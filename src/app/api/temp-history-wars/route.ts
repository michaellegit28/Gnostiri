import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY History batch — Topic 1 of 5: World Wars I & II (CORE in all regions).
// Use ?secret=... only. Tags ALL boards core per approved master list.

const WARS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The road to 1914 — MAIN causes" },
  { type: "paragraph", text: "The First World War was not an accident; it was a structure waiting for a spark. Four long-term causes run through every exam answer — remember them as MAIN." },
  { type: "definition", term: "MAIN", text: "Militarism — armies and war plans grew, with Germany's Schlieffen Plan demanding lightning mobilisation. Alliances — the Triple Alliance (Germany, Austria-Hungary, Italy) faced the Triple Entente (France, Russia, Britain), so any local quarrel became continental. Imperialism — rival colonies and markets bred distrust. Nationalism — Serbian dreams of a South Slav state threatened Austria-Hungary; French resentment over Alsace-Lorraine burned since 1871." },
  { type: "example", text: "The trigger: 28 June 1914, Sarajevo — Gavrilo Princip of the Black Hand assassinates Archduke Franz Ferdinand. Austria's ultimatum to Serbia, backed by Germany's 'blank cheque', set the alliance dominoes falling: Russia mobilised, Germany declared war on Russia and France, and the Schlieffen Plan's sweep through neutral Belgium brought Britain in on 4 August 1914." },
  { type: "heading", level: 2, text: "2. Trench deadlock, 1914–1918" },
  { type: "paragraph", text: "By Christmas 1914 the war of movement had frozen into trench stalemate on the Western Front: parallel lines of trenches from the Channel to Switzerland, separated by no man's land. Attacks gained metres at terrible cost — the Somme (1916) cost Britain ~57,000 casualties on its first day for almost no ground." },
  { type: "paragraph", text: "Technology favoured defence: machine guns, barbed wire, and artillery. Gas (first used at Ypres 1915) and tanks (1916) failed to break the logic. Only when combined-arms methods matured in 1918 — and fresh American troops and British blockade told — did the front move again. An armistice ended the fighting on 11 November 1918." },
  { type: "callout", variant: "warning", text: "Exam trap: the Schlieffen Plan was Germany's gamble to beat France in six weeks before turning on Russia — its failure created the two-front war and hence the trenches. If asked why the war stalemated, begin with the failure of war plans, not with trenches themselves." },
  { type: "heading", level: 2, text: "3. Versailles — a peace that failed" },
  { type: "paragraph", text: "The 1919 Treaty of Versailles punished Germany: Article 231's war-guilt clause, reparations fixed at 132 billion gold marks, the army capped at 100,000 men, the Rhineland demilitarised, and land handed to neighbours (Alsace-Lorraine to France, Polish corridor to Poland, colonies taken as mandates). President Wilson's Fourteen Points promised fairness; the settlement delivered revenge." },
  { type: "definition", term: "League of Nations", text: "The world's first collective-security body (1920), born from Wilson's vision — but the USA never joined, and it lacked an army. When Japan seized Manchuria (1931) and Italy invaded Abyssinia (1935), the League protested and did nothing, teaching dictators that aggression paid." },
  { type: "paragraph", text: "Germans across politics called Versailles a Diktat — a dictated peace. The 'stab-in-the-back' myth (that the army was betrayed at home, not beaten at the front) fed Nazi propaganda for two decades." },
  { type: "heading", level: 2, text: "4. The interwar spiral" },
  { type: "paragraph", text: "The Great Depression (1929–33) collapsed world trade and trust. Unemployment shredded Germany's fragile Weimar democracy; by January 1933 Hitler was Chancellor, rebuilding the army, remilitarising the Rhineland (1936), annexing Austria (1938), and taking the Sudetenland at Munich (1938). Appeasement — buying peace with concessions — peaked at Munich, Chamberlain's 'peace for our time'." },
  { type: "example", text: "Source-style judgment: appeasement bought Britain and France time to rearm and avoided a war their publics did not want in 1938 — but it handed Hitler the Sudeten fortifications, convinced Stalin the West was weak (pushing him toward the Nazi-Soviet Pact, 1939), and emboldened further demands. Full-marks answers weigh both sides." },
  { type: "heading", level: 2, text: "5. The Second World War — course and turning points" },
  { type: "paragraph", text: "Germany overran Poland in September 1939 (Britain and France finally declared war), then blitzkrieged through Denmark, Norway, the Low Countries, and France by June 1940. Britain stood alone until Operation Barbarossa (June 1941) opened the Eastern Front and Pearl Harbor (December 1941) brought the USA and USSR into a global conflict." },
  { type: "table", headers: ["Turning point", "Date", "Why it mattered"], rows: [["Stalingrad", "1942–43", "First major German defeat; USSR now pushed west — 3 in 4 German soldiers died on the Eastern Front"], ["Midway", "1942", "US Pacific fleet sank four Japanese carriers; Japan never recovered the initiative"], ["El Alamein", "1942", "Britain ended Axis advance toward the Suez oil route"], ["D-Day", "6 June 1944", "Second front in France; Germany now fought on three fronts"], ["Hiroshima & Nagasaki", "Aug 1945", "Atomic bombs ended the Pacific war and opened the nuclear age"]] },
  { type: "paragraph", text: "Total war mobilised whole societies: rationing, women in factories and auxiliary services, propaganda, evacuation of children from target cities. The war killed some 60–70 million people — soldiers and civilians — the deadliest conflict in human history." },
  { type: "diagram", diagramId: "wars-timeline", caption: "From Sarajevo to the UN" },
  { type: "heading", level: 2, text: "6. The Holocaust" },
  { type: "paragraph", text: "Nazi antisemitism moved from persecution (Nuremberg Laws 1935, Kristallnacht 1938) to annihilation. At the Wannsee Conference (January 1942) the 'Final Solution' was coordinated: ghettos, Einsatzgruppen mass shootings, and industrialised murder in camps such as Auschwitz. Around six million Jews were murdered, alongside Roma, disabled people, political prisoners, and others." },
  { type: "callout", variant: "info", text: "Historians name this genocide deliberately — it is the definitional case of state-planned, industrial killing. Examiners expect the distinction between pre-war persecution and wartime extermination policy." },
  { type: "heading", level: 2, text: "7. Outcomes — the world the wars made" },
  { type: "paragraph", text: "1945 ended European dominance forever. The United Nations (founded with a Security Council and veto powers) replaced the failed League. Europe lay broke between two superpowers — the USA with the atomic bomb and the USSR occupying half the continent — the Cold War's bipolar stage. Empires could no longer be held: India (1947), Ghana (1957), and most of Africa (1960s) followed. Nuremberg established that leaders could be tried for crimes against humanity, and the Universal Declaration of Human Rights (1948) wrote wartime lessons into law." },
  { type: "heading", level: 2, text: "8. Summary — the chain of consequences" },
  { type: "table", headers: ["Stage", "Key dates", "Consequence"], rows: [["WWI", "1914–18", "Four empires fall: German, Austro-Hungarian, Russian, Ottoman"], ["Versailles", "1919", "Guilt clause + reparations + weak League"], ["Interwar spiral", "1929–38", "Depression → dictators → appeasement"], ["WWII", "1939–45", "60–70 million dead; Holocaust; nuclear age"], ["Postwar", "1945–", "UN, Cold War partition, decolonization wave"]] },
  { type: "callout", variant: "warning", text: "Essay trap: never write that Versailles 'caused' WWII alone. Full-credit chains run: Versailles resentment → Depression collapse → Nazi rise → appeasement tolerance → Nazi-Soviet Pact → invasion of Poland. Causes in history are chains, not single buttons." },
];

const WARS_QS: Q[] = [
  { q: "The four long-term MAIN causes of WWI are", o: ["Militarism, Alliances, Imperialism, Nationalism", "Money, Armies, Industry, Navy", "Monarchy, America, Italy, Netherlands", "Marxism, Anarchism, Islam, Nationalism"], a: "Militarism, Alliances, Imperialism, Nationalism", e: "MAIN is the standard exam mnemonic.", d: "easy" },
  { q: "WWI began when Germany invaded", o: ["France directly", "neutral Belgium under the Schlieffen Plan", "Russia", "Serbia"], a: "neutral Belgium under the Schlieffen Plan", e: "Belgium's invasion brought Britain in, 4 Aug 1914.", d: "easy" },
  { q: "The first day of the Somme (1916) is remembered because", o: ["the war ended", "Britain suffered ~57,000 casualties for almost no ground", "gas was first used", "tanks ended the war"], a: "Britain suffered ~57,000 casualties for almost no ground", e: "Trench warfare's human cost in one day.", d: "easy" },
  { q: "Article 231 of the Treaty of Versailles", o: ["founded the League", "imposed the war-guilt clause on Germany", "freed Poland", "banned U-boats"], a: "imposed the war-guilt clause on Germany", e: "It underpinned reparations of 132 billion gold marks.", d: "medium" },
  { q: "The League of Nations failed mainly because", o: ["it met too rarely", "the USA never joined and it had no enforcement power", "Germany chaired it", "it had too many members"], a: "the USA never joined and it had no enforcement power", e: "Manchuria and Abyssinia exposed its weakness.", d: "medium" },
  { q: "Appeasement reached its peak at", o: ["Yalta, 1945", "Munich, 1938", "Potsdam, 1945", "Versailles, 1919"], a: "Munich, 1938", e: "Sudetenland conceded to Hitler; 'peace for our time'.", d: "easy" },
  { q: "Which opened the Eastern Front in 1941?", o: ["Pearl Harbor", "Operation Barbarossa", "D-Day", "El Alamein"], a: "Operation Barbarossa", e: "Germany invaded the USSR in June 1941.", d: "medium" },
  { q: "The turning point often called the first major German defeat is", o: ["Dunkirk", "Stalingrad", "Munich", "The Somme"], a: "Stalingrad", e: "1942–43; the USSR pushed west from there.", d: "medium" },
  { q: "The 'Final Solution' was coordinated at", o: ["Munich Conference", "Wannsee Conference, 1942", "Nuremberg trials", "Yalta Conference"], a: "Wannsee Conference, 1942", e: "Industrialised genocide; ~6 million Jews murdered.", d: "hard" },
  { q: "Which best states the chain from WWI to WWII?", o: ["Versailles resentment → Depression → Nazi rise → appeasement → war", "Isolationism → League success → disarmament", "Communism → collapse of Russia → German unity", "Naval race → disarmament treaty → peace"], a: "Versailles resentment → Depression → Nazi rise → appeasement → war", e: "Essay answers must show linked causes, not single events.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const note = "CORE: World Wars I & II — prescribed in all 20 regional syllabi (human-approved master list).";
    const topic = await prisma.topic.findFirst({ where: { slug: "world-wars" } });
    if (!topic) throw new Error("master world-wars topic missing");
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    if (!boards.length) throw new Error("No boards found");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "World Wars I & II — Complete", content: { blocks: WARS_BLOCKS } as object, estimatedMinutes: 45 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "World Wars I & II — Complete", content: { blocks: WARS_BLOCKS } as object, orderIndex: 0, estimatedMinutes: 45 } });
    for (let i = 0; i < WARS_QS.length; i++) {
      const item = WARS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-world-wars-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-world-wars-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
    const have = new Set(existingRows.map((r) => r.boardId));
    await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
    const missing = boards.filter((b) => !have.has(b.id));
    if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: note })) });
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "world-wars", blocks: WARS_BLOCKS.length, questions: WARS_QS.length, boards: boards.length });
  } catch (e) {
    console.error("temp history world-wars failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
