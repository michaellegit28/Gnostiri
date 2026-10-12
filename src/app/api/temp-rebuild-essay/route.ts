import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 8: Continuous Writing (original authorship):
// essay architecture, the writing types, register, the four marking criteria.

const CW_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The architecture — every essay, three floors" },
  { type: "definition", term: "Introduction, body, conclusion", text: "INTRODUCTION: hook, background, and a clear statement of position or purpose — two to four sentences that tell the reader where the essay is going. BODY: one MAIN point per paragraph, each with an example or evidence, linked to the next. CONCLUSION: no new arguments — a summary of the case and a final thought. Examiners read the introduction, sample the body paragraphs, and read the conclusion: the architecture is scored on sight." },
  { type: "example", text: "Worked: an essay on 'Why examination malpractice persists' plans: (intro) the problem and a thesis that three causes sustain it; (body) paragraph 1 — pressure to succeed; paragraph 2 — weak invigilation; paragraph 3 — societal approval; (conclusion) the three causes restated and one remedy proposed. Three body points, three paragraphs, one spine." },
  { type: "heading", level: 2, text: "2. Planning — ten minutes that buy thirty marks" },
  { type: "paragraph", text: "Before writing: choose the question you can EVIDENCE best (not the one that sounds clever); brainstorm points; number them; open each planned body paragraph with its point as a topic sentence. A planned essay cannot wander — unplanned essays drift mid-paragraph and lose organisation marks. The plan also protects the word count: five solid paragraphs beat nine empty ones." },
  { type: "heading", level: 2, text: "3. The types — each with its own rules" },
  { type: "table", headers: ["Type", "Rule that decides the marks", "Watch"], rows: [["Formal letter", "Writer's address, date, recipient, salutation (Dear Sir/Madam), title, body, subscription", "No contractions, no slang"], ["Informal letter", "Address, date, 'Dear Ada', body, closing", "Contractions and warmth ARE appropriate"], ["Speech", "Address the audience, signpost, rhetorical questions, a strong close", "It is meant to be HEARD"], ["Narrative", "Story with beginning, middle, end — usually past tense", "Keep ONE tense; make the ending earn the story"], ["Descriptive", "Sensory detail — sight, sound, smell, feel", "Show, do not list"], ["Argumentative", "Position stated, evidence given, counter-argument answered", "Concede a point to win credibility"], ["Report/Article", "Headline or heading, factual, organised sections", "Objective register — no sentimentality"]] },
  { type: "example", text: "Worked: the same topic — 'Road accidents on the Lagos–Ibadan expressway' — changes shape by type: a FORMAL LETTER to the FRSC demands causes and requests; an ARGUMENTATIVE essay takes a side (speed limiters: yes or no); a REPORT gives findings in sections with a neutral voice. The TYPE is a register contract — break it and organisation/expression marks fall together." },
  { type: "heading", level: 2, text: "4. Register — matching language to situation" },
  { type: "definition", term: "Register", text: "Register is the level of formality the situation demands. FORMAL writing (letters to officials, reports, articles): no contractions, no slang, no abbreviations, polite formulas ('I would be grateful if...'). INFORMAL writing (letters to friends): contractions and everyday idiom are CORRECT — stiffness loses marks in the other direction. The examiner tests register by planting casual phrases in formal tasks: 'a whole lot of', 'guys', 'wanna'." },
  { type: "example", text: "Worked: in a formal letter to a chairman, 'I am writing to draw your attention to the deplorable state of the township roads' scores; 'I want to yarn about the bad roads' fails on register even though the meaning is clear. In a letter to a friend, the formal sentence sounds absurd — register runs both ways." },
  { type: "heading", level: 2, text: "5. The four marking criteria — how the essay is scored" },
  { type: "table", headers: ["Criterion", "The examiner asks", "How to win it"], rows: [["Content (relevance)", "Does the essay answer THIS question?", "Answer the actual question; stay on it"], ["Organisation", "Paragraphs? Order? Links?", "One point per paragraph, signposted"], ["Expression", "Vocabulary, variety, control", "Precise words; vary sentence openings"], ["Mechanical accuracy", "Grammar, spelling, punctuation", "Reserve five minutes to edit"]] },
  { type: "paragraph", text: "The fastest marks are mechanical: an essay that argues brilliantly but confuses 'its/it's' and drops full stops bleeds accuracy marks sentence by sentence. The slowest to build is expression — vocabulary earned over months. Content and organisation are won by the plan before the first sentence." },
  { type: "heading", level: 2, text: "6. Summary — the continuous writing spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Choose the question", "Pick the one you can EVIDENCE", "The clever topic you cannot develop"], ["Plan first", "Number the body points", "Drifting mid-essay"], ["Letters", "The layout contract", "Formal register in a friendly letter"], ["Argumentative", "Concede one point, answer it", "Ignoring the other side"], ["Register", "Match formality to situation", "Slang in formal tasks"], ["Conclusion", "Restate, no new arguments", "A new point at the death"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'write a letter to...' = the layout contract begins immediately — address, date, salutation; 'discuss' = both sides weighed, then a verdict; 'describe' = sensory detail, not narrative; 'argue for or against' = a position taken and defended. Continuous writing pays for RELEVANCE first — an off-topic masterpiece scores like an off-topic rough draft." },
];

const CW_QS: Q[] = [
  { q: "The body paragraphs of a well-planned essay each carry", o: ["the introduction restated", "one main point with supporting detail", "as many points as fit", "only examples, no points"], a: "one main point with supporting detail", e: "One point per paragraph keeps the essay signposted — examiners tick the point, then the evidence.", hint: "One paragraph, one job.", d: "easy" },
  { q: "In a formal letter to a government official, which expression is register-correct?", o: ["The roads are a total write-off, trust me.", "Just checking in about the road palava.", "I would be grateful if urgent action were taken.", "I wanna let you guys know about the roads."], a: "I would be grateful if urgent action were taken.", e: "Formal register: no contractions, no slang, polite formulas. The other three are informal or slang — register failure.", hint: "Match the formality to the official.", d: "easy" },
  { q: "The introduction of an essay should", o: ["contain every argument in detail", "announce only the title again", "save all the evidence for the end", "state the purpose or position and preview the essay's direction"], a: "state the purpose or position and preview the essay's direction", e: "Two to four sentences: hook, context, thesis. Full arguments belong in the body.", hint: "Tell the reader where the essay is going.", d: "easy" },
  { q: "A narrative essay is conventionally written in", o: ["the past tense, held consistently", "the present tense, switching freely", "the future tense", "any tense, paragraph by paragraph"], a: "the past tense, held consistently", e: "Stories are told in one controlling tense — usually past. Slipping tenses is the most common narrative accuracy loss.", hint: "One story, one clock.", d: "medium" },
  { q: "The strongest argumentative essays", o: ["list unrelated facts", "state a position, support it with evidence, and answer the counter-argument", "present only their own side", "refuse to take a side"], a: "state a position, support it with evidence, and answer the counter-argument", e: "Conceding and answering the strongest objection makes the argument credible — pretending it does not exist weakens it.", hint: "Face the best opposing point head-on.", d: "hard" },
  { q: "A report differs from an argumentative essay chiefly because a report is", o: ["designed to persuade at all costs", "always a personal story", "objective and organised in factual sections", "written in the first person throughout"], a: "objective and organised in factual sections", e: "Reports record findings with headings and neutral voice — sentiment and campaigning belong to other types.", hint: "Reports record; essays argue.", d: "medium" },
  { q: "Which sentence best serves as a DESCRIPTIVE paragraph opener?", o: ["The market is a place where goods are bought and sold.", "There are many reasons to visit a market.", "I will describe the market now.", "The market greeted every sense at once — smoke, pepper, shouting, and the wet sting of fish-slime in the air."], a: "The market greeted every sense at once — smoke, pepper, shouting, and the wet sting of fish-slime in the air.", e: "Description works through SENSES, not announcements or definitions. The other options tell rather than show.", hint: "Show, do not tell.", d: "hard" },
  { q: "The mechanical accuracy criterion covers", o: ["grammar, spelling and punctuation across the essay", "the number of big words used", "the essay's length alone", "the handwriting alone"], a: "grammar, spelling and punctuation across the essay", e: "Accuracy is scored sentence by sentence — which is why the last five minutes of editing are the cheapest marks in the paper.", hint: "Small errors, many times, many marks.", d: "medium" },
  { q: "An essay's conclusion should", o: ["repeat the introduction word for word", "restate the case and end with a final thought — no new arguments", "introduce a fresh argument forgotten earlier", "apologise for the essay's weaknesses"], a: "restate the case and end with a final thought — no new arguments", e: "A new point at the death is unargued and unordered — it damages organisation. The conclusion closes the case that the body built.", hint: "Close the case; do not reopen it.", d: "medium" },
  { q: "Choosing an examination essay question should be decided mainly by", o: ["which question appears first", "which topic your friends chose", "which topic you can support with the best points and evidence", "which topic sounds most impressive"], a: "which topic you can support with the best points and evidence", e: "Content marks follow DEVELOPMENT, not ambition. The impressive topic without evidence loses to the plain topic fully argued.", hint: "Evidence beats ambition.", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "continuous-writing" } });
    if (!topic) throw new Error("master continuous-writing topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Continuous Writing — Complete", content: { blocks: CW_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < CW_QS.length; i++) {
      const item = CW_QS[i];
      await prisma.question.upsert({
        where: { id: `master-essay-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-essay-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "essay-rebuild", blocks: CW_BLOCKS.length, questions: CW_QS.length });
  } catch (e) {
    console.error("rebuild essay failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
