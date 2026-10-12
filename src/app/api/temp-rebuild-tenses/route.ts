import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 3: Tenses and Aspect (original authorship):
// the 12 tense forms, perfect vs continuous aspect, sequence of tenses, consistency.

const TS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The twelve forms — two axes" },
  { type: "definition", term: "Tense × aspect", text: "English builds its twelve forms from two choices: TIME (past, present, future) and ASPECT (simple, continuous/progressive, perfect, perfect continuous). 'I write' (present simple), 'I am writing' (present continuous), 'I have written' (present perfect), 'I have been writing' (present perfect continuous) — and the same grid repeats for past and future. Name the TIME and the ASPECT separately and every form becomes computable." },
  { type: "table", headers: ["Aspect", "Meaning", "Example"], rows: [["Simple", "A fact or a complete event", "She writes letters weekly."], ["Continuous (progressive)", "Ongoing at a moment — be + -ing", "She is writing now."], ["Perfect", "Completed BEFORE a reference point — have/had/will have + past participle", "She has written three pages."], ["Perfect continuous", "Duration up to a reference point", "She has been writing since noon."]] },
  { type: "example", text: "Worked: 'By 2020 she HAD WRITTEN two novels' — past perfect: completed BEFORE the past reference point 2020. 'By 2030 she WILL HAVE WRITTEN ten' — future perfect: completed before a FUTURE point. The perfect aspect always points at a reference time." },
  { type: "heading", level: 2, text: "2. The perfect tenses — the earlier-of-two rule" },
  { type: "definition", term: "Past perfect", text: "Use the past perfect ('had + past participle') for the EARLIER of two past actions, and the simple past for the later: 'The guests HAD LEFT before I ARRIVED.' With only ONE past action, plain past is enough: 'I arrived at six.' Using 'had left' when there is no second action is the exam's favourite tense error." },
  { type: "example", text: "Worked: 'When the police CAME, the thief HAD FLED' — two past events; fleeing happened first, so it takes 'had fled'. Swap them and the meaning collapses: the police arrive first, then the thief runs." },
  { type: "heading", level: 2, text: "3. Present perfect vs simple past — the finished-time wall" },
  { type: "definition", term: "The wall", text: "The present perfect ('has/have + past participle') connects to NOW: recent events, life experiences with no stated time, situations that continue. A FINISHED time expression ('yesterday', 'last week', 'in 2019') demands the SIMPLE PAST: 'I saw him YESTERDAY', never 'I have seen him yesterday'. The finished-time wall is absolute in examinations." },
  { type: "example", text: "Worked: 'She HAS VISITED Abuja twice' (no when — experience) vs 'She VISITED Abuja in 2019' (finished time — simple past). Both true; only one fits each sentence. Add 'last year' and the perfect is dead." },
  { type: "heading", level: 2, text: "4. Sequence of tenses and the time-clause trap" },
  { type: "definition", term: "Sequence", text: "If the main verb is PAST, the subordinate verb usually shifts to past too: 'He said that he WAS tired.' But after WHEN/UNTIL/AS SOON AS/BEFORE introducing FUTURE meaning, use the PRESENT: 'When I ARRIVE, I will call you' — never 'when I will arrive'. Time words with future meaning do not take 'will'." },
  { type: "example", text: "Worked: 'I will leave UNTIL the rain STOPS' — hmm, careful: 'until' pairs with the present in the time clause: 'I will wait until the rain STOPS.' The trap sentence 'When I will arrive' appears in almost every examination paper somewhere." },
  { type: "heading", level: 2, text: "5. Continuous aspect — be + -ing and stative verbs" },
  { type: "paragraph", text: "The continuous shows an action IN PROGRESS at a moment: 'They WERE PLAYING when I called.' But stative verbs — verbs of states, not actions (know, believe, own, seem, love, contain) — resist the continuous: 'I KNOW the answer', not 'I am knowing'. When an exam offers 'am knowing', it is testing whether you know the stative list." },
  { type: "heading", level: 2, text: "6. Tense consistency in passages" },
  { type: "paragraph", text: "Narration holds ONE main tense: a past-tense narrative stays in the past (reported thoughts shift too). Slips happen at paragraph boundaries — re-read the verbs AROUND the gap, not just the sentence with the blank. In cloze passages, the neighbouring verbs are the evidence: they fix the time frame the blank must join." },
  { type: "heading", level: 2, text: "7. Summary — the tense spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Name the form", "Time + aspect, named separately", "'Will have written' = future perfect, not future"], ["Past perfect", "The EARLIER of two past actions", "'Had' with no second action is a fault"], ["Present perfect", "No finished-time words", "'Yesterday' kills the perfect"], ["Time clauses", "When/until/as soon as + PRESENT", "'When I will arrive' — never"], ["Statives", "No continuous for know/own/believe", "'I am knowing' — classic distractor"], ["Cloze passages", "Read the surrounding verbs", "One paragraph slip breaks consistency"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'choose the correct tense' = identify the reference time in the sentence, then the aspect the meaning demands; 'correct the error' = name the broken rule (finished-time wall, sequence, stative). Tense papers pay for the REFERENCE TIME — every option is grammatically shaped; only the time logic discriminates." },
];

const TS_QS: Q[] = [
  { q: "By next December, he ___ the course.", o: ["has completed", "will have completed", "will has completed", "will completing"], a: "will have completed", e: "Completed BEFORE a future reference point (next December) — future perfect: will have + past participle.", hint: "Completed before a future point.", d: "easy" },
  { q: "When the police came, the thief ___.", o: ["flees", "is fleeing", "has fled", "had fled"], a: "had fled", e: "The fleeing happened BEFORE the past arrival — the earlier of two past actions takes the past perfect.", hint: "Which past action came first?", d: "easy" },
  { q: "I ___ him yesterday at the market.", o: ["had seen", "saw", "see", "have seen"], a: "saw", e: "'Yesterday' is a finished time — the present perfect cannot cross that wall. Simple past.", hint: "Finished time words reject the perfect.", d: "easy" },
  { q: "When I ___ to Lagos, I will visit your shop.", o: ["will get", "get", "will have got", "got"], a: "get", e: "Time clauses with future meaning take the PRESENT after when/until/as soon as: 'When I get ... I will visit.'", hint: "'Will' never follows 'when' in the time clause.", d: "medium" },
  { q: "She ___ that novel since morning.", o: ["read", "reads", "is reading", "has been reading"], a: "has been reading", e: "Ongoing action with DURATION up to now ('since morning') — present perfect continuous.", hint: "'Since' + still ongoing = perfect continuous.", d: "medium" },
  { q: "He said that he ___ tired.", o: ["will be", "has been", "is", "was"], a: "was", e: "Sequence of tenses: a past reporting verb ('said') pulls the reported clause into the past.", hint: "The reporting verb drags the tense back.", d: "medium" },
  { q: "Which sentence is CORRECT?", o: ["I know the answer.", "I am know the answer.", "I known the answer.", "I am knowing the answer."], a: "I know the answer.", e: "'Know' is a stative verb — it resists the continuous. States use the simple form.", hint: "Some verbs describe states, not actions.", d: "medium" },
  { q: "The guests ___ before the couple cut the cake.", o: ["have left", "had left", "leave", "were leaving"], a: "had left", e: "Two past events: leaving was EARLIER than the cake-cutting — past perfect for the earlier one.", hint: "Order the two past events.", d: "hard" },
  { q: "By the time you arrive, we ___ dinner.", o: ["had finished", "will have finished", "will finish already", "have finished"], a: "will have finished", e: "The dinner will be complete BEFORE the future reference moment ('by the time you arrive') — future perfect.", hint: "'By the time' points at a future completion.", d: "hard" },
  { q: "In the cloze sentence 'The boy ___ his books and left for school', the best choice is", o: ["has packed yesterday", "packs yesterday", "is packing", "packed"], a: "packed", e: "'Left' sets a past time frame; 'and' joins a second completed action in the same frame — simple past 'packed'. The neighbouring verb is the evidence.", hint: "Match the tense of the verb joined by 'and'.", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "tenses-and-aspect" } });
    if (!topic) throw new Error("master tenses-and-aspect topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Tenses and Aspect — Complete", content: { blocks: TS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < TS_QS.length; i++) {
      const item = TS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-tenses-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-tenses-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "tenses-rebuild", blocks: TS_BLOCKS.length, questions: TS_QS.length });
  } catch (e) {
    console.error("rebuild tenses failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
