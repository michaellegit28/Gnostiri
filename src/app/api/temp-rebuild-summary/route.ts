import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 7: Summary Writing (original authorship):
// point-hunting, paraphrase, word limits, lifting, examiner criteria.

const SW_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What a summary is — and is not" },
  { type: "definition", term: "Summary", text: "A summary reproduces the passage's MAIN POINTS in YOUR OWN WORDS, within a set word limit — nothing more. It is not a copy (lifting sentences earns zero for expression), not a commentary (no opinions, no additions), and not a compression of every detail (minor examples and repetitions are cut). The two skills: IDENTIFYING the points the examiner counts, and PARAPHRASING them economically." },
  { type: "example", text: "Worked: original — 'The government has begun rebuilding rural clinics because millions of villagers currently travel more than thirty kilometres to reach the nearest hospital, a journey many cannot afford.' Summary — 'Rural clinics are being rebuilt because villagers live too far from hospitals.' The POINT survives; the figures and colouring are cut. That is compression, not copying." },
  { type: "heading", level: 2, text: "2. Hunting the points — the examiner's arithmetic" },
  { type: "paragraph", text: "Summary questions typically ask for a NUMBER of points ('In three sentences, summarise the causes of...'). The marks are awarded PER POINT, so the first job is inventory: the passage's causes/reasons/effects usually map one-to-one onto paragraphs or signposted sentences ('first', 'another', 'finally'). Under-delivering points loses content marks that expression cannot recover — find ALL the asked-for points before writing a word." },
  { type: "example", text: "Worked: the question asks for THREE causes of rural poverty. The passage gives: poor roads, poor electricity, poor credit. Your summary needs all three — a beautiful sentence covering only two causes scores less than three plain sentences covering all three." },
  { type: "heading", level: 2, text: "3. Paraphrase — say it in your own words" },
  { type: "definition", term: "Paraphrase", text: "Paraphrasing changes the WORDING and often the STRUCTURE while keeping the meaning: use synonyms ('build' → 'construct'), change word classes ('the failure of the crops' → 'the crops failed'), merge or reorder clauses. What you may NOT do: lift the passage's sentences wholesale, or distort the meaning to save words. The paraphrase test: read your summary beside the passage — if whole phrases match, you have lifted." },
  { type: "example", text: "Worked: passage — 'Flooding destroyed the harvest and left thousands without shelter.' Lift (bad): 'Flooding destroyed the harvest and left thousands without shelter.' Paraphrase (good): 'Floods ruined crops and homes.' Same point, new words, fewer of them." },
  { type: "heading", level: 2, text: "4. The word limit — the silent scorer" },
  { type: "paragraph", text: "Examiners set a limit ('in not more than 60 words') and enforce it: writing beyond the limit usually means the extra lines are IGNORED — and they may contain your best points. Budget first: three points, 60 words → about 20 words per point. Write tight sentences (subject + verb + object), cut qualifiers, and count. The discipline of the limit IS part of the skill being tested." },
  { type: "heading", level: 2, text: "5. What the examiner scores" },
  { type: "table", headers: ["Criterion", "What it means", "How to win it"], rows: [["Content", "The required points, all found", "Inventory the points before writing"], ["Organisation", "Logical order, one point per sentence", "Follow the passage's order"], ["Expression", "Your own words, clear and economical", "Paraphrase; cut repetition"], ["Mechanical accuracy", "Grammar, spelling, punctuation", "Leave time to check the summary cold"]] },
  { type: "paragraph", text: "The scoring order matters: content first — a beautifully written summary missing half the points fails. Expression rewards economy: 'because of' becomes 'for'; 'due to the fact that' becomes 'because'. Every word must earn its place." },
  { type: "heading", level: 2, text: "6. Summary — the spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Find the points", "Count what the question demands", "Missing points = lost content marks"], ["Paraphrase", "Synonyms + restructure", "Lifting whole phrases"], ["Word limit", "Budget words per point", "Best points hidden past the limit"], ["No opinions", "The passage's points only", "Adding your own knowledge"], ["Sentence form", "One point per sentence", "Cramming two points into one clause"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'in N sentences' = exactly N sentences, each carrying one point; 'in not more than X words' = count; 'in your own words' = no lifted strings of three-plus words. Summary papers pay for the POINTS FOUND — elegance cannot rescue an incomplete inventory." },
];

const SW_QS: Q[] = [
  { q: "The FIRST duty of a summary is to", o: ["copy the passage's best sentences", "reproduce the passage's main points in your own words", "comment on the writer's style", "add your own knowledge of the topic"], a: "reproduce the passage's main points in your own words", e: "Points + own words + limit — the three pillars. Copying earns zero expression; additions earn zero relevance.", hint: "Three pillars: points, own words, limit.", d: "easy" },
  { q: "A question asks for 'three causes of rural poverty'. A summary covering only two causes", o: ["is preferred — shorter is better", "earns a bonus for economy", "scores full marks if well written", "loses content marks — elegance cannot replace a missing point"], a: "loses content marks — elegance cannot replace a missing point", e: "Summary marks are awarded PER POINT. The inventory comes first; beauty second.", hint: "Count the marks on the table.", d: "easy" },
  { q: "Which is the best paraphrase of 'The flood destroyed the harvest and left thousands homeless'?", o: ["The flood destroyed the harvest and left thousands homeless.", "The harvest and homes were destroyed by the flood.", "There was a flood.", "Floods ruined crops and homes."], a: "Floods ruined crops and homes.", e: "New words (ruined, crops, homes), same point, fewer words. Option 3 lifts the structure with only word-order changes; option 4 drops the point.", hint: "New words, same point, fewer words.", d: "medium" },
  { q: "The word limit in a summary question exists to test", o: ["your economy of expression — a real summarising skill", "your handwriting speed", "your ability to guess", "nothing — it is ignored"], a: "your economy of expression — a real summarising skill", e: "Compressing a point into few words IS summarising. Examiners enforce the limit by ignoring or penalising the excess.", hint: "Compression is the skill being examined.", d: "medium" },
  { q: "In summarising, minor examples and repetitions in the passage should be", o: ["moved to the front", "cut — they are not main points", "included for completeness", "copied as they stand"], a: "cut — they are not main points", e: "A summary keeps the skeleton — the points the question counts — and discards illustration, repetition and colour.", hint: "Keep the skeleton, lose the flesh.", d: "medium" },
  { q: "The passage says: 'The scheme failed because funds were released late and officials lacked training.' The two points are", o: ["officials' laziness only", "the scheme's popularity", "late funding and untrained officials", "poor roads and late funding"], a: "late funding and untrained officials", e: "The signpost 'because' introduces the counted points, in order: funds late + training missing. Invent nothing; miss nothing.", hint: "Signposts mark the counted points.", d: "hard" },
  { q: "Which opening sentence best summarises a passage listing four benefits of tree planting?", o: ["Trees are green and beautiful.", "The writer loves forests.", "Deforestation is a global problem.", "Tree planting offers four distinct benefits."], a: "Tree planting offers four distinct benefits.", e: "A summary opening announces the passage's own point with the passage's own count. The other options drift outside the passage.", hint: "Announce the point the passage makes.", d: "medium" },
  { q: "A lifted summary sentence is penalised mainly because", o: ["expression marks reward the CANDIDATE'S own words", "examiners cannot read the passage again", "lifting changes the meaning", "the passage is copyrighted"], a: "expression marks reward the CANDIDATE'S own words", e: "Expression is scored on YOUR wording. Lifted strings demonstrate selection, not expression — the skill the question tests.", hint: "The skill under test is re-expression.", d: "hard" },
  { q: "Your best third point lands at 63 words of a 60-word limit. The best practical response is", o: ["write it in the margin", "tighten the earlier sentences to pull the point inside the limit", "leave the point out", "continue past the limit — content counts most"], a: "tighten the earlier sentences to pull the point inside the limit", e: "Examiners commonly stop reading at the limit. The fix is compression — cut qualifiers, not points.", hint: "Compress words, keep points.", d: "hard" },
  { q: "Mechanical accuracy in a summary covers", o: ["handwriting only", "the number of paragraphs", "grammar, spelling and punctuation in YOUR sentences", "the passage's own grammar"], a: "grammar, spelling and punctuation in YOUR sentences", e: "The four criteria: content, organisation, expression, mechanical accuracy — the last is the correctness of what YOU wrote.", hint: "It is about your sentences, not the passage's.", d: "easy" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "summary-writing" } });
    if (!topic) throw new Error("master summary-writing topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Summary Writing — Complete", content: { blocks: SW_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < SW_QS.length; i++) {
      const item = SW_QS[i];
      await prisma.question.upsert({
        where: { id: `master-summary-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-summary-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "summary-rebuild", blocks: SW_BLOCKS.length, questions: SW_QS.length });
  } catch (e) {
    console.error("rebuild summary failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
