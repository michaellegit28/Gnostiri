/**
 * tests/qa-fixtures.mjs — synthetic HTML fixtures for the QA tools.
 *
 * The fixtures reproduce the SHAPE of the shipped pages (React's `<!-- -->`
 * node delimiters, the `question` / `s` plural split, the `"li","<topicId>"`
 * flight keys), so tools/qa/count-parsers.mjs is exercised the way it runs
 * against production. Every count is derived from one state object, so a
 * "planted failure" flips exactly one number and breaks exactly one agreement.
 *
 * A GREEN fixture has all surfaces agreeing (tree count == tag count == hub ==
 * cbt == api == quiz), which is what the tools must accept with exit 0.
 */

const COMMENT = "<!-- -->";
const plural = (n, word) => `${word}${n === 1 ? "" : "s"}`;
const num = (n) => n.toLocaleString("en-US");

export function page(body) {
  return `<!DOCTYPE html><html lang="en"><head><title>fixture</title></head><body>${body}</body></html>`;
}

export const json = (value, status = 200) => ({
  status,
  contentType: "application/json",
  body: JSON.stringify(value),
});

/** Board page — hero + practice-engine sentence + subject/topic cards. */
export function boardPageHtml(board) {
  const subjectCounts = new Map();
  for (const t of board.topics) {
    subjectCounts.set(t.subjectSlug, (subjectCounts.get(t.subjectSlug) ?? 0) + t.count);
  }
  const topicTotal = board.topics.reduce((s, t) => s + t.count, 0);
  const cards = board.subjects
    .filter((s) => subjectCounts.get(s.slug) > 0 || board.topics.some((t) => t.subjectSlug === s.slug))
    .map((s) => {
      const rows = board.topics
        .filter((t) => t.subjectSlug === s.slug)
        .map(
          (t) =>
            `<li class="flex items-center justify-between gap-3 text-sm">` +
            `<a class="rounded text-slate-300" href="/highschool/${board.slug}/${s.slug}/${t.topicSlug}/study">${t.title}</a>` +
            `<span class="flex items-center gap-3 shrink-0 text-xs text-slate-400">` +
            `<span>${num(t.count)}${COMMENT} q</span>` +
            `<a class="rounded font-semibold" href="/highschool/${board.slug}/${s.slug}/${t.topicSlug}/quiz">Quiz</a>` +
            `</span></li>`,
        )
        .join("");
      return (
        `<div class="flex flex-col bg-slate-900/80"><div class="flex items-start justify-between gap-3">` +
        `<h3 class="text-xl font-serif font-bold text-slate-100">` +
        `<a class="rounded" href="/highschool/${board.slug}/${s.slug}">${s.title}</a></h3>` +
        `<span class="shrink-0 text-xs font-semibold text-teal-200 bg-teal-500/10">` +
        `${num(subjectCounts.get(s.slug) ?? 0)}${COMMENT} question${COMMENT}s</span></div>` +
        `<p class="mt-1 text-xs text-slate-400">${rows ? board.topics.filter((t) => t.subjectSlug === s.slug).length : 0}${COMMENT} ` +
        `${plural(board.topics.filter((t) => t.subjectSlug === s.slug).length, "topic")} in the ${board.code.toUpperCase()} syllabus tree</p>` +
        `<ul class="mt-4 space-y-1.5">${rows}</ul></div>`
      );
    })
    .join("");

  const hasCards = board.subjects.length > 0;
  return page(
    `<div class="min-h-screen">` +
      `<h1 class="text-3xl">${board.name.toUpperCase()} <span class="text-gold">practice bank</span></h1>` +
      (hasCards
        ? `<p class="text-slate-400">${board.country ? `${board.country} — ` : ""}${COMMENT}${num(board.tree.total)}${COMMENT} ` +
          `practice question${COMMENT}s${COMMENT} across${COMMENT} ${COMMENT}${board.subjects.length}${COMMENT} ` +
          `${plural(board.subjects.length, "subject")}${COMMENT}${COMMENT} and${COMMENT} ${COMMENT}${board.topics.length}${COMMENT} ` +
          `${plural(board.topics.length, "topic")}${COMMENT}.</p>`
        : "") +
      `<p class="text-sm">Board-format sessions on this board&#x27;s topics — ${num(board.tagTotal)} ` +
      `question${board.tagTotal === 1 ? "" : "s"} in the practice engine.</p>` +
      `<p class="text-xs">past papers</p>` +
      `<p class="text-xs">Class: ${board.class}</p>` +
      (hasCards
        ? `<h2>Past papers</h2><p>Past-paper digitization in progress</p><section>${cards}</section>`
        : `<h2>In preparation</h2><p>${board.name} is not live yet.</p>`) +
      flightKeys(board.topics.map((t) => t.id)) +
      `</div><span class="hidden">${topicTotal}</span>`,
  );
}

function flightKeys(topicIds) {
  if (!topicIds.length) return "";
  return `<script>self.__next_f.push([1,"${topicIds.map((id) => `[\\"$\\",\\"li\\",\\"${id}\\",{\\"className\\":\\"flex\\"}]`).join(",")}"])</script>`;
}

/** Practice picker — tag scoped. */
export function pickerPageHtml(board) {
  const cards = board.tagTopics
    .map((t) => {
      const kinds = [
        t.mcq ? `<span class="flex items-center gap-1"><svg></svg> ${num(t.mcq)}${COMMENT} objective</span>` : "",
        t.theory ? `<span class="flex items-center gap-1"><svg></svg> ${num(t.theory)}${COMMENT} theory</span>` : "",
        t.practical ? `<span class="flex items-center gap-1"><svg></svg> ${num(t.practical)}${COMMENT} practical</span>` : "",
      ].join("");
      return (
        `<a class="flex items-center justify-between gap-4" ` +
        `href="/highschool/practice/${board.slug}/${t.id}?subject=${t.subjectSlug}">` +
        `<div><div class="font-semibold">${t.title}</div>` +
        `<div class="mt-2 flex items-center gap-4 text-xs">${kinds}</div></div></a>`
      );
    })
    .join("");
  const stated = board.tagTopics.reduce((s, t) => s + t.mcq + t.theory + t.practical, 0);
  const subjectCount = new Set(board.tagTopics.map((t) => t.subjectSlug)).size;
  return page(
    `<header><p class="text-teal-300">Board-format practice</p>` +
      `<h1>Practice ${board.name.toUpperCase()} the way the exam is actually set</h1>` +
      (stated > 0
        ? `<p class="text-xs text-slate-500">${num(stated)}${COMMENT} question${COMMENT}s${COMMENT} tagged to this board&#x27;s ` +
          `papers across${COMMENT} ${subjectCount}${COMMENT} ${plural(subjectCount, "subject")}${COMMENT}.</p>`
        : `<section><p>No topics are tagged for ${board.name.toUpperCase()} practice yet.</p></section>`) +
      `</header>${cards}`,
  );
}

/** /cbt — the server-side board payload, as the page embeds it. */
export function cbtPageHtml(boards) {
  return page(
    `<h1>Sit the exam, not a quiz</h1>` +
      `<p>Computer-Based Test</p>` +
      `<script>self.__next_f.push([1,"${JSON.stringify({ boards })}"])</script>`,
  );
}

/** Exams hub — per-board "N practice Qs" chips plus the class-grouped hub.
 *  Card markup mirrors the real BoardCard root (bg-slate-900/80) so the
 *  card-bounded parser is tested against real structure. */
export function hubPageHtml(boards) {
  const cards = boards
    .map(
      (b) =>
        `<div class="flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-6">` +
        `<h3 class="text-xl font-serif font-bold">${b.name}</h3>` +
        `<svg class="lucide lucide-book-open"></svg> ${num(b.hubTagTotal)} practice Qs</span></div>`,
    )
    .join("");
  return page(
    `<h2>Computer-Based Test boards</h2><p>Open board</p>${cards}` +
      `<span>JAMB (UTME)</span>`,
  );
}

/** Topic quiz page — "Question 1 of N" is the count the student is about to sit. */
export function quizPageHtml(board, topic) {
  return page(
    `<nav><span>${topic.title}</span><span>${board.name}</span></nav>` +
      `<div class="bg-slate-900"><span>Question 1 of ${num(board.quizTotal)}</span>` +
      `<h2>A car accelerates uniformly from rest to 24 m/s in 8 s.</h2></div>`,
  );
}

const STATIC_PAGES = {
  "/": "High School · University",
  "/highschool": "Textbooks and exams · Open textbooks",
  "/login": "Password · Google",
  "/cbt/results": "Your result",
  "/cbt/review": "Review every question",
  "/university": "MBBS · Gnostiri University · module",
  "/university/gross-anatomy-i": "Human Anatomy · module",
  "/university/physiology-cell-and-general": "Human Physiology · module",
  "/discovery": "Discovery · deeper",
  "/cbt/setup?board=jamb": "Session setup · JAMB (UTME)",
  "/cbt/session?board=jamb&mode=simulation": "Mark for review · JAMB (UTME)",
};

export const DEFAULT_BOARDS = [
  {
    slug: "jamb", code: "jamb", name: "JAMB (UTME)", country: "Nigeria", class: "CBT", status: "live",
    cbtReady: true, tagTotal: 600, hubTagTotal: 600,
    tree: { total: 600, subjects: 1, topics: 3 },
    subjects: [{ slug: "physics", title: "Physics" }],
    topics: [
      { id: "jamb-physics-motion-and-kinematics", subjectSlug: "physics", topicSlug: "motion-and-kinematics", title: "Motion and Kinematics", count: 300 },
      { id: "jamb-physics-work-energy-and-power", subjectSlug: "physics", topicSlug: "work-energy-and-power", title: "Work, Energy and Power", count: 200 },
      { id: "jamb-physics-waves-and-optics", subjectSlug: "physics", topicSlug: "waves-and-optics", title: "Waves and Optics", count: 100 },
    ],
    tagTopics: [
      { id: "jamb-physics-motion-and-kinematics", subjectSlug: "physics", title: "Motion and Kinematics", mcq: 300, theory: 0, practical: 0 },
      { id: "jamb-physics-work-energy-and-power", subjectSlug: "physics", title: "Work, Energy and Power", mcq: 200, theory: 0, practical: 0 },
      { id: "jamb-physics-waves-and-optics", subjectSlug: "physics", title: "Waves and Optics", mcq: 100, theory: 0, practical: 0 },
    ],
    cbtCard: { questionCount: 600, subjectCount: 1, status: "live" },
    quizTotal: 300,
  },
];

/** Route map for a whole fixture site. */
export function buildSite(boards = DEFAULT_BOARDS) {
  const routes = {};
  const cbtBoards = [];

  for (const board of boards) {
    routes[`/highschool/exams/${board.slug}`] = boardPageHtml(board);
    routes[`/highschool/practice/${board.slug}`] = pickerPageHtml(board);
    if (board.cbtCard) cbtBoards.push({ code: board.code, slug: board.slug, name: board.name, ...board.cbtCard });
    for (const topic of board.topics) {
      routes[`/highschool/${board.slug}/${topic.subjectSlug}/${topic.topicSlug}/study`] = page(
        `<h1>${topic.title}</h1><nav>${board.name}</nav>`,
      );
      routes[`/highschool/${board.slug}/${topic.subjectSlug}/${topic.topicSlug}/quiz`] = quizPageHtml(board, topic);
      routes[`/api/questions?boardId=${board.code}&topicId=${topic.id}`] = json({
        questions: Array.from({ length: topic.count }, (_, i) => ({ id: `q-${topic.id}-${i}`, type: "mcq", options: [] })),
      });
    }
  }

  routes["/cbt"] = cbtPageHtml(cbtBoards);
  routes["/highschool/exams"] = hubPageHtml(boards);
  routes["/api/boards"] = json({
    regions: [
      {
        region: "Nigeria",
        boards: boards.map((b) => ({ id: b.slug, name: b.name, code: b.code, papers: [] })),
      },
    ],
  });
  routes["/api/cbt/session"] = json({
    boardCode: "jamb",
    boardName: "JAMB (UTME)",
    mode: "practice",
    durationSec: 750,
    subjects: [{ topicId: "jamb-physics", title: "Physics", questions: Array.from({ length: 10 }, (_, i) => ({ id: `c-${i}` })) }],
  });
  for (const [path, body] of Object.entries(STATIC_PAGES)) routes[path] = page(body);
  return routes;
}

/** Serve a fixture site; `mutate(path, rendered)` applies planted failures. */
export async function startFixture(routes, mutate = (path, rendered) => rendered) {
  const http = await import("node:http");
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const found = mutate(url.pathname + url.search, routes[url.pathname + url.search]);
    if (!found) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }
    const rendered = typeof found === "string" ? { status: 200, contentType: "text/html", body: found } : found;
    res.writeHead(rendered.status, { "content-type": rendered.contentType ?? "text/html" });
    res.end(rendered.body);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
