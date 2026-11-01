
export type QueueState = "pending" | "failed";

export interface QueueItem {
  id: string;
  endpoint: string;
  body: Record<string, unknown>;
  queuedAt: number;
  attempts: number;
  state: QueueState;
  lastError?: string;
}

export interface QueuedAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface Submission {
  endpoint: string;
  body: Record<string, unknown>;
}

export const MAX_ATTEMPTS = 3;
export const BASE_DELAY_MS = 1_000;
export const BACKOFF_CAP_MS = 30_000;

export function backoffDelay(attempt: number): number {
  const step = Math.max(1, attempt);
  return Math.min(BASE_DELAY_MS * 2 ** (step - 1), BACKOFF_CAP_MS);
}

export function shouldRetry(item: Pick<QueueItem, "attempts">): boolean {
  return item.attempts < MAX_ATTEMPTS;
}

export function nextAttempt(
  item: QueueItem,
  outcome: { ok: true } | { ok: false; error?: string },
): QueueItem {
  const attempts = item.attempts + 1;
  if (outcome.ok) return { ...item, attempts, state: "pending", lastError: undefined };
  return attempts >= MAX_ATTEMPTS
    ? { ...item, attempts, state: "failed", lastError: outcome.error?.slice(0, 300) }
    : { ...item, attempts, state: "pending", lastError: outcome.error?.slice(0, 300) };
}

export function flushable(items: QueueItem[]): QueueItem[] {
  return items.filter((item) => item.state === "pending" && shouldRetry(item)).sort((a, b) => a.queuedAt - b.queuedAt);
}

const DB_NAME = "gnostiri-offline";
const DB_VERSION = 1;
const QUEUE_STORE = "queue";
const VIEWS_STORE = "views";

export interface ViewRecord {
  path: string;
  title: string;
  viewedAt: number;
}

function hasIdb(): boolean {
  return typeof indexedDB !== "undefined";
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(QUEUE_STORE)) db.createObjectStore(QUEUE_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(VIEWS_STORE)) db.createObjectStore(VIEWS_STORE, { keyPath: "path" });
    };
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}

async function withStore<T>(store: string, mode: IDBTransactionMode, run: (s: IDBObjectStore) => Promise<T> | T): Promise<T> {
  const db = await openDb();
  try {
    const tx = db.transaction(store, mode);
    return await run(tx.objectStore(store));
  } finally {
    db.close();
  }
}

function newId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${rand}`;
}

export async function pending(): Promise<QueueItem[]> {
  if (!hasIdb()) return [];
  try {
    const rows = await withStore(QUEUE_STORE, "readonly", (store) => request(store.getAll() as IDBRequest<QueueItem[]>));
    return (rows ?? []).sort((a, b) => a.queuedAt - b.queuedAt);
  } catch {
    return [];
  }
}

export async function outstanding(): Promise<QueueItem[]> {
  const items = await pending();
  return [...items.filter((i) => i.state === "pending"), ...items.filter((i) => i.state === "failed")];
}

export async function enqueue(submission: Submission): Promise<QueueItem | null> {
  if (!hasIdb()) return null;
  const item: QueueItem = {
    id: newId(),
    endpoint: submission.endpoint,
    body: submission.body,
    queuedAt: Date.now(),
    attempts: 0,
    state: "pending",
  };
  try {
    await withStore(QUEUE_STORE, "readwrite", async (store) => {
      await request(store.put(item));
    });
    return item;
  } catch {
    return null;
  }
}

export async function markSynced(id: string): Promise<void> {
  if (!hasIdb()) return;
  try {
    await withStore(QUEUE_STORE, "readwrite", async (store) => {
      await request(store.delete(id));
    });
  } catch {
  }
}

export async function update(item: QueueItem): Promise<void> {
  try {
    await withStore(QUEUE_STORE, "readwrite", async (store) => {
      await request(store.put(item));
    });
  } catch {
  }
}

export interface FlushReport {
  sent: number;
  synced: number;
  failed: number;
  remaining: number;
}

export async function flush(): Promise<FlushReport> {
  const items = await pending();
  const queue = flushable(items);
  const report: FlushReport = { sent: 0, synced: 0, failed: 0, remaining: items.length };

  for (const item of queue) {
    report.sent += 1;
    let ok = false;
    let error: string | undefined;
    try {
      const res = await fetch(item.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.body),
      });
      ok = res.ok;
      if (!ok) {
        const detail = (await res.json().catch(() => null)) as { error?: string } | null;
        error = detail?.error ?? `The server refused this submission (${res.status})`;
      }
    } catch (e) {
      ok = false;
      error = e instanceof Error ? e.message : "Network error";
    }

    if (ok) {
      await markSynced(item.id);
      report.synced += 1;
    } else {
      const next = nextAttempt(item, { ok: false, error });
      await update(next);
      if (next.state === "failed") report.failed += 1;
    }
  }

  report.remaining = (await pending()).length;
  return report;
}

export async function recentViews(limit = 12): Promise<ViewRecord[]> {
  if (!hasIdb()) return [];
  try {
    const rows = await withStore(VIEWS_STORE, "readonly", (store) => request(store.getAll() as IDBRequest<ViewRecord[]>));
    return (rows ?? []).sort((a, b) => b.viewedAt - a.viewedAt).slice(0, limit);
  } catch {
    return [];
  }
}

export async function rememberView(path: string, title: string): Promise<void> {
  if (!hasIdb()) return;
  try {
    await withStore(VIEWS_STORE, "readwrite", async (store) => {
      await request(store.put({ path, title, viewedAt: Date.now() } as ViewRecord));
    });
  } catch {
  }
}
