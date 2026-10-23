/**
 * tools/qa/count-parsers.mjs — count extraction from rendered HTML.
 *
 * These parsers are the "read what the student sees" half of tools/audit-counts.
 * They do not re-implement application logic; they pull the numbers the pages
 * actually print, so a disagreement between two surfaces is a REAL disagreement
 * the student can see, not a unit-test artefact.
 *
 * Two input forms are supported, deliberately:
 *   - SSR text (comments stripped, whitespace collapsed) — primary, because it
 *     survives React changing how it serializes the flight payload.
 *   - RSC flight payload (quotes unescaped) — used only to recover TOPIC IDS,
 *     which the SSR markup does not render.
 *
 * Every regex tolerates React's `<!-- -->` node delimiters (the suite strips
 * them) and the ` question` / `s` split that SSR emits around plural suffixes.
 */

/** Strip React's SSR node-delimiter comments, collapse whitespace. */
export function stripComments(html) {
  return String(html).replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ");
}

/** Unescape the RSC flight payload's JSON-in-string escaping. */
export function unescapeFlight(html) {
  return String(html).replace(/\\"/g, '"');
}

function num(text) {
  if (text == null) return null;
  const m = String(text).replace(/[\s,]/g, "").match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}

function first(re, text) {
  const m = re.exec(text);
  return m ? m.slice(1) : null;
}

/**
 * Topic ids, in document order, from the flight payload's React keys.
 * `["$","li","jamb-physics-motion-and-kinematics",{…}]`
 */
export function flightTopicIds(html) {
  const flat = unescapeFlight(html);
  return [...flat.matchAll(/\["\$","li","([^"]+)",\{/g)].map((m) => m[1]);
}

/**
 * Board page (/highschool/exams/[board]).
 * Returns the hero claims plus per-subject and per-topic counts.
 */
export function parseBoardPage(html, boardCode) {
  const text = stripComments(html);
  const hero = first(/([\d,]+) practice questions? across (\d+) subjects? and (\d+) topics?/, text);
  const practiceEngine = first(/([\d,]+) questions? in the practice engine/, text);
  const emptyState = /In preparation/.test(text);

  const subjects = [...text.matchAll(
    /<h3 class="text-xl font-serif font-bold text-slate-100"><a[^>]*href="\/highschool\/[a-z0-9-]+\/([a-z0-9-]+)"[^>]*>([^<]+)<\/a><\/h3><span[^>]*>([\d,]+) questions?<\/span>/g,
  )].map((m) => ({
    slug: m[1],
    // The page builds the subject slug as `id minus the board-code prefix`, so
    // the topic id is exactly invertible — including legacy ids.
    id: `${String(boardCode).toLowerCase()}-${m[1]}`,
    title: m[2],
    count: num(m[3]),
  }));

  const ssrTopics = [...text.matchAll(
    /href="(\/highschool\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+)\/study"[^>]*>([^<]+)<\/a><span[^>]*><span[^>]*>([\d,]*) q<\/span>/g,
  )].map((m) => ({ studyPath: m[1], title: m[2], count: num(m[3]) ?? 0 }));

  // Reconcile ids: prefer the flight payload's real topic ids (legacy ids do
  // not always extend their parent id), fall back to the URL convention.
  const flightIds = flightTopicIds(html);
  const topics = ssrTopics.map((t, i) => ({
    ...t,
    id: flightIds.length === ssrTopics.length ? flightIds[i] : deriveTopicId(t.studyPath, boardCode),
  }));

  return {
    heroTotal: hero ? num(hero[0]) : null,
    heroSubjects: hero ? num(hero[1]) : null,
    heroTopics: hero ? num(hero[2]) : null,
    practiceEngineTotal: practiceEngine ? num(practiceEngine[0]) : null,
    emptyState,
    subjects,
    topics,
  };
}

/** `{board}-{subjectSlug}-{topicSlug}` from a study URL. */
export function deriveTopicId(studyPath, boardCode) {
  const m = /^\/highschool\/[^/]+\/([^/]+)\/([^/]+)\/study$/.exec(studyPath ?? "");
  if (!m) return null;
  return `${String(boardCode).toLowerCase()}-${m[1]}-${m[2]}`;
}

/**
 * Practice picker (/highschool/practice/[board]) — board-TAG scoped, so it is
 * the surface that historically under-reported the topic tree.
 */
export function parsePracticePicker(html, boardSlug) {
  const text = stripComments(html);
  const stated = first(/([\d,]+) questions? tagged to this board[^.]{0,40}?papers across (\d+) subjects?/, text);
  const start = new RegExp(
    `<a class="flex items-center justify-between gap-4[^"]*"[^>]*href="\\/highschool\\/practice\\/${boardSlug}\\/([^"?]+)\\?subject=([a-z0-9-]+)"`,
    "g",
  );
  const anchors = [...text.matchAll(start)];
  const topics = [];
  for (let i = 0; i < anchors.length; i += 1) {
    const from = anchors[i].index;
    const to = i + 1 < anchors.length ? anchors[i + 1].index : from + 4000;
    const card = text.slice(from, to);
    const title = first(/<div class="font-semibold[^"]*">([^<]+)<\/div>/, card);
    const mcq = first(/([\d,]+) objective/, card);
    const theory = first(/([\d,]+) theory/, card);
    const practical = first(/([\d,]+) practical/, card);
    const c = { mcq: num(mcq?.[0]) ?? 0, theory: num(theory?.[0]) ?? 0, practical: num(practical?.[0]) ?? 0 };
    topics.push({
      id: anchors[i][1],
      subjectSlug: anchors[i][2],
      title: title ? title[0] : null,
      ...c,
      total: c.mcq + c.theory + c.practical,
    });
  }
  return {
    statedTotal: stated ? num(stated[0]) : null,
    statedSubjects: stated ? num(stated[1]) : null,
    topics,
  };
}

/**
 * CBT select payload — the server-side tree counts, lifted straight out of the
 * flight payload's `boards` prop.
 */
export function parseCbtBoards(html) {
  const flat = unescapeFlight(html);
  const at = flat.indexOf('"boards":[');
  if (at === -1) return [];
  const open = flat.indexOf("[", at);
  let depth = 0;
  let end = -1;
  for (let i = open; i < flat.length; i += 1) {
    const ch = flat[i];
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return [];
  try {
    const boards = JSON.parse(flat.slice(open, end));
    return boards.map((b) => ({
      code: b.code,
      slug: b.slug,
      name: b.name,
      questionCount: Number(b.questionCount ?? 0),
      subjectCount: Number(b.subjectCount ?? 0),
      status: b.status,
    }));
  } catch {
    return [];
  }
}

/**
 * Topic quiz page (/highschool/[exam]/[subject]/[topic]/quiz) — the header
 * prints "Question 1 of N", the count the student is actually about to sit.
 */
export function parseQuizTotal(html) {
  const text = stripComments(html);
  const m = first(/Question\s*1\s*of\s*([\d,]+)/i, text);
  return m ? num(m[0]) : null;
}

/** Exams hub — per-board "N practice Qs" chips (tag scoped). */
export function parseExamHub(html, boardNames) {
  const text = stripComments(html);
  // Bound each parse to its OWN card: the BoardCard root className is unique to
  // board cards. An unbounded forward scan used to leak the neighbouring card's
  // number into the last card (edexcel read jamb's 6,000).
  const CARD_ROOT = "bg-slate-900/80";
  const cards = text
    .split(CARD_ROOT)
    .slice(1)
    .map((seg) => seg.slice(0, 4000));
  const out = [];
  for (const name of boardNames) {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let practiceQs = null;
    for (const card of cards) {
      if (!new RegExp(escaped).test(card)) continue;
      // RSC flight emits the number as its own child: `",0," practice Qs`.
      const m = first(new RegExp(`([\\d,]+)[^a-zA-Z0-9]{0,6}practice Qs`), card);
      practiceQs = m ? num(m[0]) : null;
      break;
    }
    out.push({ name, practiceQs });
  }
  return out;
}
