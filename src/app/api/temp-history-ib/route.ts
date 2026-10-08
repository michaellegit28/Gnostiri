import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY History batch — Topic 5 of 5: IB World History.
// CORE on IB-offering boards (approved master list: "All IB schools globally").

const IB_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What makes IB History a different exam" },
  { type: "paragraph", text: "IB History does not reward memory alone. Papers ask you to compare regions, weigh sources, and argue with evidence — the examiner marks the discipline of history, not the syllabus's coverage. Three skills run through everything: source evaluation (OPCVL), comparative thinking (two case studies per essay), and cause/consequence chains that survive counter-argument." },
  { type: "definition", term: "OPCVL", text: "Origin (who made it, when, where), Purpose (what it was for), Content (what it actually says), Values (what it usefully reveals), Limitations (what it cannot reveal or distorts). Every source question runs this grid — practice it until automatic." },
  { type: "heading", level: 2, text: "2. Prescribed subject — Move to Global War, case study 1: Japanese expansion, 1931–41" },
  { type: "paragraph", text: "Japan's road to war began in economics: the Depression strangled an island empire dependent on trade, and the military argued that conquest was cheaper than commerce. The Mukden Incident (September 1931) — a staged railway bombing blamed on China — justified seizing Manchuria, renamed the puppet state Manchukuo (1932). The League's Lytton Report condemned; Japan simply walked out (1933), the first major state to quit the League." },
  { type: "paragraph", text: "The Second Sino-Japanese War (from July 1937) brought the Nanjing Massacre and a quagmire the army could not finish. Hemmed by US embargoes on oil and steel, Japan chose the southern resource path — signing the Tripartite Pact with Germany and Italy (1940) and striking Pearl Harbor on 7 December 1941 to buy the time its fuel stocks denied. Move-to-war answers must tie economics, army autonomy, and diplomatic isolation together." },
  { type: "heading", level: 2, text: "3. Case study 2 — German and Italian expansion, 1933–40" },
  { type: "paragraph", text: "Hitler's steps were each tested against the powers' will to resist: leaving the League and disarmament talks (1933), rearmament and conscription (1935), remilitarising the Rhineland (March 1936 — a bluff that worked), Anschluss with Austria (March 1938), the Sudetenland at Munich (September 1938), the rump of Czechoslovakia (March 1939), and Poland (September 1939). Each success retrained his risk calculus: the pattern examiners want named." },
  { type: "paragraph", text: "Italy ran its own ladder: Abyssinia (1935–36) exposed the League's paralysis — sanctions that excluded oil and closed no canal. The Rome–Berlin Axis (1936) and Pact of Steel (1939) joined the revisionist powers; Mussolini's Albania (1939) and the 1940 entry into the war completed the axis alignment the move-to-war documents chart." },
  { type: "diagram", diagramId: "wars-timeline", caption: "Expansion steps toward global war" },
  { type: "callout", variant: "warning", text: "Paper 1 trap: when comparing the two case studies, organise by theme (economic motive, military autonomy, League failure, great-power appeasement) — not by country in separate paragraphs. Comparison is the marked skill." },
  { type: "heading", level: 2, text: "4. Rights and protest — civil rights in the USA" },
  { type: "paragraph", text: "IB treats the US civil rights movement as a study of strategy under oppression. Montgomery (1955–56) proved the boycott; Little Rock (1957) forced a president to enforce a court order with paratroopers; the Birmingham campaign and March on Washington (1963) put the contradiction on television; the Civil Rights Act (1964) and Voting Rights Act (1965) converted protest into statute. Malcolm X and Black Power supply the internal comparison — nonviolence versus self-defence as contested strategy." },
  { type: "paragraph", text: "The parallel case, apartheid resistance (defiance campaigns, Sharpeville, Rivonia, Soweto, UDF, negotiation — see the Decolonization chapter), lets essays compare strategies across regions: what changed when law itself was the oppression, when international pressure was available, and when leadership chose reconciliation over victory." },
  { type: "heading", level: 2, text: "5. Conflicts and intervention — Korea and Vietnam" },
  { type: "table", headers: ["Conflict", "Intervention frame", "Exam angle"], rows: [["Korea, 1950–53", "First UN collective-security action (USSR boycotting the Council)", "Was it UN multilateralism or US policy wearing a UN helmet?"], ["Vietnam, 1955–75", "Gulf of Tonkin resolution; unilateral escalation under domino logic", "Why did the greatest power fail — legitimacy, guerrilla war, or domestic politics?"]] },
  { type: "paragraph", text: "The topic's exam question is really one question: when force crosses borders, what legitimises it? The UN Charter's self-defence and Security Council rules, measured against what Korea and Vietnam actually did, is the analytic core. Add one post-1945 example beyond the named cases for full-range essays." },
  { type: "heading", level: 2, text: "6. Essay craft — the comparative discipline" },
  { type: "example", text: "Worked structure (Paper 2 style): Thesis — 'Expansion succeeded because the powers' will to resist decayed faster than the revisionists' will to risk.' Paragraph 1: Japan — Mukden to Pearl Harbor, ordered by the rising stakes. Paragraph 2: Germany — Rhineland to Poland, same theme, different theatre. Paragraph 3: compare directly (bluff vs calculation; League vs appeasement). Conclusion: judge which factor bound both — the lesson every IB rubric rewards." },
  { type: "callout", variant: "info", text: "Rubric rule: analysis beats narrative. Every paragraph needs a claim, two dated evidences, and a link back to the thesis — description earns the bottom band even when accurate." },
  { type: "heading", level: 2, text: "7. Required dates and summary" },
  { type: "table", headers: ["Case study", "Load-bearing dates"], rows: [["Japanese expansion", "1931 Mukden · 1933 League exit · 1937 Nanjing · 1940 Tripartite Pact · 1941 Pearl Harbor"], ["German/Italian expansion", "1935 conscription · 1936 Rhineland/Abyssinia · 1938 Anschluss/Munich · 1939 Pact of Steel/Poland"], ["US civil rights", "1955 Montgomery · 1963 Birmingham/March · 1964–65 Acts"], ["Korea/Vietnam", "1950–53 · Tonkin 1964 · Tet 1968 · Paris 1973"]] },
];

const IB_QS: Q[] = [
  { q: "The OPCVL source method stands for", o: ["Origin, Purpose, Content, Values, Limitations", "Order, Peace, Conflict, War, Law", "Opinion, Proof, Cause, View, Logic", "Only Primary Sources Count, Verify Later"], a: "Origin, Purpose, Content, Values, Limitations", e: "Every IB source question runs this grid.", d: "easy" },
  { q: "The Mukden Incident (1931) was", o: ["a genuine Chinese attack", "a staged railway bombing Japan used to seize Manchuria", "a Soviet invasion", "a League operation"], a: "a staged railway bombing Japan used to seize Manchuria", e: "Manufactured pretext → Manchukuo puppet state, 1932.", d: "easy" },
  { q: "Japan's expansion was driven most directly by", o: ["religious duty", "economic insecurity and resource hunger worsened by the Depression and embargoes", "a UN mandate", "population decline"], a: "economic insecurity and resource hunger worsened by the Depression and embargoes", e: "Oil/steel embargoes pushed the southern strategy and Pearl Harbor.", d: "medium" },
  { q: "The Rhineland remilitarisation (1936) was a turning point because", o: ["France invaded Germany", "Hitler's bluff succeeded, recalibrating his risk calculus", "the League sanctioned oil", "Germany joined the League"], a: "Hitler's bluff succeeded, recalibrating his risk calculus", e: "Each unopposed step trained the next.", d: "medium" },
  { q: "Abyssinia (1935–36) exposed", o: ["Italy's weakness", "the League's paralysis — sanctions that excluded oil and closed no canal", "German rearmament", "US isolation ending"], a: "the League's paralysis — sanctions that excluded oil and closed no canal", e: "The last credibility the League had bled out in East Africa.", d: "medium" },
  { q: "In comparing civil rights and anti-apartheid strategies, IB rewards", o: ["narrating each separately", "organising by theme across both regions", "dates only", "quoting speeches at length"], a: "organising by theme across both regions", e: "Comparison is the marked skill; parallel themes beat parallel stories.", d: "medium" },
  { q: "The Montgomery bus boycott (1955–56) proved that", o: ["courts act instantly", "sustained economic pressure plus litigation can break a segregated institution", "federal troops were necessary everywhere", "the movement had no leadership"], a: "sustained economic pressure plus litigation can break a segregated institution", e: "Strategy blueprint for Birmingham and the Acts that followed.", d: "medium" },
  { q: "Korea (1950–53) is examinable as", o: ["pure US aggression", "the first UN collective-security action — with the USSR boycotting the Council when it passed", "a colonial war", "a civil war with no outside powers"], a: "the first UN collective-security action — with the USSR boycotting the Council when it passed", e: "Multilateral label, unilateral weight — the tension to analyse.", d: "hard" },
  { q: "Which thesis best fits a move-to-global-war comparison?", o: ["War was accidental everywhere", "Expansion succeeded because the powers' will to resist decayed faster than the revisionists' will to risk", "Only Germany was revisionist", "The League caused peace"], a: "Expansion succeeded because the powers' will to resist decayed faster than the revisionists' will to risk", e: "A claim both case studies test — thesis-shaped, not story-shaped.", d: "hard" },
  { q: "An IB essay paragraph in the top band must contain", o: ["a claim, dated evidence, and a link to the thesis", "five dates minimum", "direct quotes only", "all three case studies at once"], a: "a claim, dated evidence, and a link to the thesis", e: "Analysis beats narrative — the rubric's core criterion.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const note = "CORE: prescribed for all IB schools globally (human-approved master list).";
    const topic = await prisma.topic.findFirst({ where: { slug: "ib-world-history" } });
    if (!topic) throw new Error("master ib-world-history topic missing");
    const boards = await prisma.curriculumBoard.findMany({ where: { name: { contains: "IB" } }, select: { id: true } });
    if (!boards.length) throw new Error("No IB boards found");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "IB World History — Complete", content: { blocks: IB_BLOCKS } as object, estimatedMinutes: 45 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "IB World History — Complete", content: { blocks: IB_BLOCKS } as object, orderIndex: 0, estimatedMinutes: 45 } });
    for (let i = 0; i < IB_QS.length; i++) {
      const item = IB_QS[i];
      await prisma.question.upsert({
        where: { id: `master-ib-world-history-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "IB" },
        create: { id: `master-ib-world-history-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "IB" },
      });
    }
    const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
    const have = new Set(existingRows.map((r) => r.boardId));
    await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
    const missing = boards.filter((b) => !have.has(b.id));
    if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: note })) });
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "ib-world-history", blocks: IB_BLOCKS.length, questions: IB_QS.length, coreBoards: boards.length });
  } catch (e) {
    console.error("temp history ib failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
