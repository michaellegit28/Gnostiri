import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 6: Reading Comprehension (original authorship):
// skimming, scanning, inference, main idea, tone, vocabulary-in-context, strategies.

const RC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The three reading speeds" },
  { type: "definition", term: "Skim, scan, study", text: "SKIMMING reads fast for the GENERAL idea — the shape of the passage, not the facts. SCANNING hunts one specific item — a date, a name, a figure — without reading everything. STUDY reading works line by line for understanding. Examinations reward switching speeds: skim the passage first for its shape, scan for each question's evidence, and only study the lines the question points at." },
  { type: "example", text: "Worked: a question asks 'In which year did the dam open?' — that is a SCAN: sweep for the digits, ignore the rest. A question asks 'What is the passage mainly about?' — that is a SKIM: the opening sentences and the closing sentence carry it." },
  { type: "heading", level: 2, text: "2. Main idea — the passage in one sentence" },
  { type: "definition", term: "Main idea", text: "The main idea is the point EVERY paragraph serves. It is most often stated or strongly signalled in the OPENING sentences; in some passages it lands in the CONCLUSION; in well-built passages, the FIRST and LAST sentences bracket it. Wrong options are too NARROW (one paragraph's detail) or too BROAD (more than the passage claims)." },
  { type: "example", text: "Worked: a passage describes how one school trained its teachers, how results rose, and how other schools copied the model. Main idea: 'A school's teacher-training programme became a model for others.' The training detail alone is too narrow; 'all schools improve when trained' is too broad." },
  { type: "heading", level: 2, text: "3. Inference — what is strongly suggested, never invented" },
  { type: "definition", term: "Inference", text: "An inference is a conclusion the passage SUPPORTS without stating: the evidence forces it, even though the words never appear. The discipline: an inference must be provable from the passage — if reasonable readers could disagree, it is not an inference. 'The writer says the roads were flooded and shops were shut' → inference: movement in the town had stopped." },
  { type: "example", text: "Worked: 'She saved every naira for two years' → inference: the thing she wanted was expensive or important to her. The passage never says 'the prize was costly' — but two years of saving forces that reading. Inference questions are answered by EVIDENCE, not imagination." },
  { type: "heading", level: 2, text: "4. Vocabulary in context — the substitution test" },
  { type: "paragraph", text: "Vocabulary questions ask what a word MEANS AS USED in the passage — not its dictionary headline. The method: read the SENTENCE the word sits in, then substitute each option and keep the one that preserves the sense. Words like 'run', 'charge', 'fine' carry many senses; the context elects one. The trap: choosing the word's most COMMON meaning when the passage uses another." },
  { type: "example", text: "Worked: 'The judge imposed a fine' vs 'The soil is fine for planting' — same spelling, different senses. In 'Her fine performance earned applause', 'fine' means excellent. Substitution decides; memory of the commonest meaning misleads." },
  { type: "heading", level: 2, text: "5. Tone and attitude — how the writer feels" },
  { type: "table", headers: ["Tone cue", "Signals", "Reads as"], rows: [["Critical", "faults named, 'unfortunately', 'should have'", "the writer disapproves"], ["Sympathetic", "'poor', 'struggled', focus on hardship", "the writer takes a side"], ["Humorous/ironic", "exaggeration, mismatch, playful comparison", "the writer entertains"], ["Neutral/objective", "figures, both sides, no judgement words", "the writer reports"], ["Persuasive", "'must', 'surely', repeated appeals", "the writer campaigns"]] },
  { type: "paragraph", text: "Tone is read from WORD CHOICE, not topic. A passage about crime can be neutral (statistics) or alarmed ('menace', 'scourge'). The question 'the writer's attitude is...' is answered by collecting the writer's FEELING WORDS, not by your own opinion of the topic." },
  { type: "heading", level: 2, text: "6. The question types and the strategy for each" },
  { type: "table", headers: ["Type", "Strategy", "Trap"], rows: [["Main idea", "First + last sentences; test breadth", "A detail dressed as the main idea"], ["Detail", "Scan for keywords from the question", "The 'true elsewhere' option — true, but not the answer"], ["Inference", "The option the evidence FORCES", "The imaginative leap"], ["Vocabulary in context", "Substitute each option", "The commonest dictionary sense"], ["Tone/attitude", "Collect the feeling words", "Importing your own opinion"], ["Except/NOT", "Find the THREE that fit; keep the odd one", "Reading too fast past the NOT"]] },
  { type: "paragraph", text: "Elimination is the universal engine: two options usually fail the passage immediately; the last two differ by a hair — return to the exact lines and let the EVIDENCE elect. Never answer a comprehension question from general knowledge alone: if the passage does not support it, it is not an answer." },
  { type: "heading", level: 2, text: "7. Summary — the comprehension spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Main idea", "Bracket with first and last sentences", "Too narrow or too broad"], ["Detail", "Scan the keywords", "True-looking but unasked"], ["Inference", "What the evidence forces", "Imagination, not evidence"], ["Vocabulary", "Substitute in the sentence", "The commonest sense"], ["Tone", "Collect the feeling words", "Your opinion of the topic"], ["Except/NOT", "Eliminate the three that fit", "Missing the NOT"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'according to the passage' = the passage's words are the ONLY court; 'the writer suggests' = the forced inference; 'as used in the passage' = substitution. Comprehension papers pay for EVIDENCE LOCATED IN THE PASSAGE — a true statement of general knowledge is still a wrong answer if the passage did not say it." },
];

const RC_QS: Q[] = [
  { q: "A question asks 'In which year was the bridge commissioned?' The best reading speed is", o: ["reading the passage backwards", "scanning — hunting for a specific figure", "skimming for the general idea", "studying every line slowly"], a: "scanning — hunting for a specific figure", e: "A single fact (a year) is retrieved by scanning — sweeping for the digits, not reading everything.", hint: "One fact, one sweep.", d: "easy" },
  { q: "The main idea of a passage is usually found by", o: ["counting the paragraphs", "reading only the questions", "reading the first and last sentences and testing the middle against them", "choosing the most interesting sentence"], a: "reading the first and last sentences and testing the middle against them", e: "Main ideas are stated or bracketed at the opening and close; every paragraph must serve the idea you pick.", hint: "The passage brackets its own point.", d: "easy" },
  { q: "An inference is", o: ["any opinion the reader holds", "a sentence copied from the passage", "the writer's stated main point", "a conclusion the evidence forces, though never stated word for word"], a: "a conclusion the evidence forces, though never stated word for word", e: "Inference = reading BETWEEN the lines, but only where the evidence makes disagreement unreasonable.", hint: "Forced, not invented.", d: "easy" },
  { q: "In 'The judge imposed a fine', the word 'fine' means", o: ["excellent", "a penalty payment", "thin or narrow", "healthy"], a: "a penalty payment", e: "Vocabulary-in-context: the sentence's world (judge, imposed) elects the penalty sense over the other senses of 'fine'.", hint: "Substitute each option into the sentence.", d: "medium" },
  { q: "A passage opens: 'For the third time this year, the bridge has failed inspection.' The tone is best described as", o: ["playful", "critical/alarming", "celebratory", "neutral statistics"], a: "critical/alarming", e: "'Failed inspection' plus the emphatic 'third time this year' signals concern — the writer's word choice carries the attitude.", hint: "Collect the feeling words.", d: "medium" },
  { q: "A question asks: 'Which of the following is NOT a reason the writer gives for the delay?' The correct strategy is", o: ["pick the longest option", "answer from general knowledge", "find the three options the passage DOES give; the odd one out is the answer", "choose the option you know is false in real life"], a: "find the three options the passage DOES give; the odd one out is the answer", e: "Except/NOT questions invert the game: three options are SUPPORTED by the passage, and the unsupported one wins.", hint: "Spot the NOT and play it in reverse.", d: "medium" },
  { q: "A passage states: 'She saved every naira for two years, skipping parties and new clothes.' The strongest inference is", o: ["she disliked her friends", "she was poor all her life", "banks refuse students accounts", "the goal mattered greatly to her"], a: "the goal mattered greatly to her", e: "Two years of sacrifice FORCES the conclusion that the goal mattered. The other options are imaginable — but nothing in the passage forces them.", hint: "Which option does the evidence compel?", d: "medium" },
  { q: "The main-idea option 'Teachers everywhere should be retrained annually' is wrong for a passage about ONE school's programme because", o: ["it is broader than the passage supports", "it is too short", "it uses the passage's exact words", "it contradicts the first sentence"], a: "it is broader than the passage supports", e: "Wrong main-idea options overshoot the evidence: one school's story cannot license a claim about 'teachers everywhere'.", hint: "Test the breadth against the passage.", d: "hard" },
  { q: "For a vocabulary-in-context question, the surest method is", o: ["picking the most formal option", "substituting each option into the sentence and keeping the one that preserves the sense", "recalling the word's commonest dictionary meaning", "choosing the option with the same first letters"], a: "substituting each option into the sentence and keeping the one that preserves the sense", e: "Context elects the sense — the commonest meaning is exactly the distractor the examiner plants.", hint: "Test each option where the word stands.", d: "hard" },
  { q: "A passage reports crime figures for five years without comment. Its tone is best described as", o: ["sympathetic to offenders", "humorous", "neutral and objective", "alarmed"], a: "neutral and objective", e: "Figures without judgement words signal reporting, not feeling — the absence of 'menace/scourge' words IS the evidence.", hint: "No feeling words, no feeling tone.", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "reading-comprehension" } });
    if (!topic) throw new Error("master reading-comprehension topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Reading Comprehension — Complete", content: { blocks: RC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < RC_QS.length; i++) {
      const item = RC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-compr-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-compr-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "comprehension-rebuild", blocks: RC_BLOCKS.length, questions: RC_QS.length });
  } catch (e) {
    console.error("rebuild comprehension failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
