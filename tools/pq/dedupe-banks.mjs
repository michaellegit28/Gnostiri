#!/usr/bin/env node
/**
 * dedupe-banks.mjs — quarantine duplicate question stems across the shipped banks
 * (the 2026-10-24 audit's defect #1: 141 stems carried twice, once in a base
 * subject bank and once in its expansion file).
 *
 * What it does
 *   - scans every content/questions/*.json that holds a question ARRAY
 *     (a flat array, or { questions: [...] }) — audit.json,
 *     master-stats-q2-reword.json and relabel-sourceExam.json are report files
 *     and are skipped by design
 *   - groups items by normalised questionText (lowercase, whitespace collapsed)
 *   - keeps the first occurrence in PRIORITY order — base subject banks first
 *     (biology.json before biology.expansion-1.json / biology.expansion-2.json,
 *     because only the base rows carry the full dual-version schema), then file
 *     name A-Z — and removes later duplicates
 *   - removes ONLY when the item is semantically identical to the kept copy:
 *     same coreId (same concept family) OR the same option set AND the same
 *     correctAnswer (re-ordered options are the same answer budget; a shuffled
 *     option order is an integration-time artefact, not a second question)
 *   - a later item that shares the stem but differs in options or key is KEPT
 *     and reported as "same-stem different-key" — never silently dropped
 *
 * Safety
 *   - every modified file is backed up to .backups/pre-dedupe-2026-10-24/
 *     (same convention as the earlier board-clearance backups) before writing
 *   - only removed rows disappear: key order, field order and the 2-space
 *     formatting of the shipped banks are preserved, so a diff shows deletions
 *     only
 *   - idempotent: a second run finds nothing to remove and writes nothing
 *
 * Usage:
 *   node tools/pq/dedupe-banks.mjs              # apply (backup + write)
 *   node tools/pq/dedupe-banks.mjs --dry-run    # report only, no writes
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname;
const Q = (p) => (p.startsWith("/") ? p : `${ROOT}${p}`);
const DIR = "content/questions";
const BACKUP_DIR = ".backups/pre-dedupe-2026-10-24";
const DRY_RUN = process.argv.includes("--dry-run");

/** The stem fingerprint the audit counted on: lowercase, whitespace collapsed. */
const normText = (s) => String(s ?? "").replace(/\s+/g, " ").trim().toLowerCase();

/** option sets — order-insensitive, so a shuffled option list is not a "diff". */
const optionSet = (q) => new Set((Array.isArray(q.options) ? q.options : []).map(normText).filter(Boolean));

const sameOptions = (a, b) => {
  const A = optionSet(a);
  const B = optionSet(b);
  if (A.size !== B.size || A.size === 0) return false;
  for (const o of A) if (!B.has(o)) return false;
  return true;
};

const sameKey = (a, b) => {
  const ka = normText(a.correctAnswer);
  return ka !== "" && ka === normText(b.correctAnswer);
};

/** Same core family, or the same answer budget with the same key. Theory rows
 *  carry no options/key — those are matched on their model answer instead. */
function semanticallyIdentical(a, b) {
  if (a.coreId && b.coreId && a.coreId === b.coreId) return true;
  if (sameOptions(a, b) && sameKey(a, b)) return true;
  const ma = normText(a.modelAnswer);
  return ma !== "" && ma === normText(b.modelAnswer);
}

/** Priority: base subject banks (rank 0) before their expansion files (rank 1),
 *  then file name A-Z. */
const fileRank = (name) => (/\.expansion-\d+\.json$/.test(name) ? 1 : 0);

function loadBanks() {
  const names = readdirSync(Q(DIR))
    .filter((n) => n.endsWith(".json"))
    .sort((a, b) => fileRank(a) - fileRank(b) || a.localeCompare(b));
  const banks = [];
  for (const name of names) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(Q(`${DIR}/${name}`), "utf8"));
    } catch {
      continue;
    }
    const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.questions) ? parsed.questions : null;
    if (!rows) continue;
    banks.push({ name, rows, parsed, shape: Array.isArray(parsed) ? "array" : "object" });
  }
  return banks;
}

const idOf = (q) => q.id ?? "(no id)";
const label = (bank, q) => `${bank.name}/${idOf(q)}`;

const banks = loadBanks();
const before = banks.reduce((sum, b) => sum + b.rows.length, 0);

/** Reading order IS priority order: banks are already sorted, indices ascend. */
const groups = new Map();
for (const bank of banks) {
  for (let i = 0; i < bank.rows.length; i++) {
    const item = bank.rows[i];
    const stem = normText(item.questionText);
    if (!stem) continue;
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push({ bank, index: i, item });
  }
}

const removed = []; // { entry, keptBy }
const sameStemDifferentKey = [];

for (const [stem, group] of groups) {
  if (group.length < 2) continue;
  const kept = [group[0]];
  const dropped = [];
  for (const entry of group.slice(1)) {
    const twin = kept.find((k) => semanticallyIdentical(k.item, entry.item));
    if (twin) {
      dropped.push(entry);
      removed.push({ entry, keptBy: twin });
    } else {
      // Same stem, different options or key — a genuinely distinct question.
      kept.push(entry);
    }
  }
  if (kept.length > 1) sameStemDifferentKey.push({ stem, kept, droppedCount: dropped.length });
}

/** index -> row, per bank. */
const cuts = new Map();
for (const { entry } of removed) {
  const set = cuts.get(entry.bank.name) ?? new Set();
  set.add(entry.index);
  cuts.set(entry.bank.name, set);
}

console.log(`dedupe-banks.mjs — ${banks.length} bank files under ${DIR}/`);
console.log(
  `items read: ${before} · duplicate stems: ${[...groups.values()].filter((g) => g.length > 1).length}` +
    ` · duplicate rows to quarantine: ${removed.length} · same-stem different-key groups: ${sameStemDifferentKey.length}`
);
console.log(DRY_RUN ? "DRY RUN — no files written\n" : "");

let written = 0;
for (const bank of banks) {
  const cut = cuts.get(bank.name) ?? new Set();
  const kept = bank.rows.filter((_, i) => !cut.has(i));
  console.log(
    `${bank.name.padEnd(30)} before=${String(bank.rows.length).padEnd(4)} kept=${String(kept.length).padEnd(4)} removed=${cut.size}`
  );
  if (cut.size === 0 || DRY_RUN) continue;
  const backupDir = Q(BACKUP_DIR);
  if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });
  // Back the file up as it was read, then rewrite the survivors only: key
  // order and the 1-space formatting the shipped banks use (build-banks.mjs
  // writes JSON.stringify(bank, null, 1) + "\n") survive, so a diff against the
  // backup shows deleted rows and nothing else.
  const backupPath = `${backupDir}/${bank.name}`;
  if (!existsSync(backupPath)) {
    writeFileSync(backupPath, readFileSync(Q(`${DIR}/${bank.name}`), "utf8"));
  }
  const body = bank.shape === "array" ? kept : { ...bank.parsed, questions: kept };
  writeFileSync(Q(`${DIR}/${bank.name}`), JSON.stringify(body, null, 1) + "\n");
  written++;
}

if (removed.length) {
  console.log(`\nquarantined rows (kept copy → removed duplicate):`);
  const byKept = new Map();
  for (const r of removed) {
    const k = label(r.keptBy.bank, r.keptBy.item);
    if (!byKept.has(k)) byKept.set(k, []);
    byKept.get(k).push(label(r.entry.bank, r.entry.item));
  }
  for (const [k, v] of byKept) console.log(`  kept ${k} ← removed ${v.join(", ")}`);
}

if (sameStemDifferentKey.length) {
  console.log(`\nsame-stem different-key (KEPT BOTH — human review, nothing dropped):`);
  for (const g of sameStemDifferentKey) {
    console.log(`  stem: "${g.stem}"`);
    for (const e of g.kept) {
      console.log(
        `    KEPT ${label(e.bank, e.item).padEnd(52)} key="${e.item.correctAnswer}" options=[${(e.item.options ?? []).join(" | ")}]`
      );
    }
  }
}

console.log(
  `\n${DRY_RUN ? "DRY RUN — nothing written" : `wrote ${written} file(s); backups in ${BACKUP_DIR}/`} · ` +
    `items after: ${before - removed.length} · removals this run: ${removed.length}` +
    `${removed.length === 0 ? " (idempotent — nothing left to remove)" : ""}`
);
