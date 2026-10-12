import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 2: Concord (Subject–Verb Agreement) (original authorship):
// the agreement rules, tricky subjects, proximity, notional concord.

const CC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The master rule — number agreement" },
  { type: "definition", term: "Concord", text: "A finite verb agrees with its SUBJECT in NUMBER: singular subject → singular verb form ('The boy runs'), plural subject → plural verb form ('The boys run'). Everything else in this topic is a refinement of this one rule. The exam's job is to HIDE the true subject between the subject and the verb — find the subject first, ignore everything else." },
  { type: "example", text: "Worked: 'The basket of oranges IS heavy' — the subject is 'basket' (singular), not 'oranges'. The prepositional phrase 'of oranges' is a distraction zone: cross it out mentally and match verb to 'basket'. This single move solves most concord questions." },
  { type: "heading", level: 2, text: "2. The tricky singulars" },
  { type: "table", headers: ["Subject pattern", "Verb number", "Example"], rows: [["each, every, either, neither", "singular", "Each of the boys HAS a pen"], ["everyone, somebody, nobody, anything", "singular", "Everybody WAS present"], ["one of + plural noun", "singular (agrees with 'one')", "One of the girls SINGS well"], ["uncountable nouns (news, information, advice)", "singular", "The news IS disturbing"], ["titles of books/countries/distances", "singular", "'Great Expectations' IS a classic"], ["collective noun acting as ONE unit", "usually singular", "The team IS winning"]] },
  { type: "example", text: "Worked: 'One of the boys HAS failed' — 'one' is the subject; 'of the boys' is the distraction. 'Mathematics IS my best subject' — subjects ending in -ics (mathematics, physics, economics) are singular despite the plural look." },
  { type: "heading", level: 2, text: "3. The plurals and the pairs" },
  { type: "definition", term: "Plural triggers", text: "BOTH, FEW, MANY, SEVERAL take plural verbs ('Both WERE late'; 'Many WERE called'). Two subjects joined by AND take a plural verb ('John and Mary ARE friends') — except when the pair forms ONE idea ('Rice and beans IS my favourite dish' — one dish)." },
  { type: "example", text: "Worked: 'Bread and butter IS sold here' — one item, one idea, singular. 'Bread AND butter ARE sold here' would suggest two separate items being counted. Notional concord: the MEANING decides when the grammar allows both readings." },
  { type: "heading", level: 2, text: "4. Proximity concord — or/nor agrees with the NEARER subject" },
  { type: "definition", term: "Or / nor rule", text: "With 'either...or' and 'neither...nor', the verb agrees with the subject NEAREST to it: 'Neither the teacher nor the students WERE present' (students — plural → were); 'Neither the students nor the teacher WAS present' (teacher — singular → was). The safest exam strategy: put the plural subject second, or just match the nearer one." },
  { type: "example", text: "Worked: 'Either the captain or the players ARE to blame' vs 'Either the players or the captain IS to blame' — both are correct; the verb follows the CLOSER subject. Writers arrange the sentence to control the agreement." },
  { type: "heading", level: 2, text: "5. 'The number of' vs 'A number of' — the set pair" },
  { type: "definition", term: "The pair", text: "'THE number of + plural noun' → SINGULAR verb ('The number of students IS increasing' — the number itself is one figure). 'A NUMBER OF + plural noun' → PLURAL verb ('A number of students ARE absent' — meaning 'many students')." },
  { type: "example", text: "Worked: swap the article and the verb flips. 'The/A variety of reasons...' follows the same logic: 'A variety of dishes WERE served' (many kinds), 'The variety of dishes IS impressive' (the range itself)." },
  { type: "heading", level: 2, text: "6. Relative pronouns and intervening phrases" },
  { type: "paragraph", text: "A verb after 'who/which/that' agrees with the noun the pronoun REFERS TO: 'It is the student who WORKS hardest' (student — singular) vs 'It is the students who WORK hardest'. And always strip the interruptions: 'The quality of the products HAS fallen' (quality — singular), 'The leader of the gangs WAS arrested' (leader)." },
  { type: "example", text: "Worked: 'One of the questions that WERE asked was tricky' — the relative 'that' refers to QUESTIONS (plural) → 'were'. Two decisions in one sentence: 'one ... WAS' for the main verb, 'questions ... WERE' for the relative verb." },
  { type: "heading", level: 2, text: "7. Amounts, distances, and time periods" },
  { type: "paragraph", text: "A stated amount behaves as ONE quantity: 'Ten kilometres IS a long walk'; 'Five thousand naira WAS spent'; 'Three hours SEEMS too long'. Even though the nouns look plural, the amount is a single unit. The same logic covers weights ('Two kilogrammes IS enough') and sums of money." },
  { type: "heading", level: 2, text: "8. Summary — the concord spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Find the subject", "Strip prepositional phrases first", "'The basket of oranges IS' — not 'are'"], ["Each/every/everyone", "Singular — always", "'Each of the boys HAS'"], ["One of + plural", "Agrees with ONE", "'One of the girls SINGS'"], ["The number of / A number of", "The = singular; A = plural", "The article decides the verb"], ["Or / nor", "Agree with the NEARER subject", "Proximity, not addition"], ["Amounts and distances", "One unit → singular", "'Ten kilometres IS far'"], ["Bread and butter", "One idea → singular", "Notional concord"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'choose the correct option' = locate the TRUE subject, name the rule, then match; 'correct the sentence' = the fix AND the rule it restores. Concord questions pay for locating the subject — every wrong option is built to make you match a nearby noun instead." },
];

const CC_QS: Q[] = [
  { q: "Each of the boys ___ a pen.", o: ["were given", "have", "has", "are having"], a: "has", e: "'Each' is singular; 'of the boys' is a distraction phrase.", hint: "Find the true subject.", d: "easy" },
  { q: "The basket of oranges ___ heavy.", o: ["were", "have been", "are", "is"], a: "is", e: "The subject is 'basket' — singular. The phrase 'of oranges' never controls the verb.", hint: "Cross out 'of oranges' mentally.", d: "easy" },
  { q: "Neither the teacher nor the students ___ present.", o: ["were", "is", "has been", "was"], a: "were", e: "With nor, the verb agrees with the NEARER subject — 'students' (plural).", hint: "Proximity concord.", d: "medium" },
  { q: "The number of applicants ___ rising every year.", o: ["are", "is", "were", "have been"], a: "is", e: "'THE number of' is singular — the number is one figure. 'A number of' would take 'are'.", hint: "Watch the article before 'number'.", d: "hard" },
  { q: "A number of students ___ absent today.", o: ["has been", "is", "was", "are"], a: "are", e: "'A NUMBER OF' means 'many' — plural verb.", hint: "Same phrase, different article, opposite verb.", d: "medium" },
  { q: "One of the girls ___ an award.", o: ["were given", "are winning", "have won", "has won"], a: "has won", e: "'One' is the subject — singular. The plural 'girls' sits in the distraction phrase.", hint: "Agree with 'one', not 'girls'.", d: "medium" },
  { q: "Mathematics ___ my most difficult subject.", o: ["is", "were", "have been", "are"], a: "is", e: "Subjects ending in -ics (mathematics, physics, economics) take singular verbs despite their plural spelling.", hint: "-ics subjects are singular.", d: "easy" },
  { q: "Ten kilometres ___ a long distance to walk in the sun.", o: ["are", "is", "were", "have been"], a: "is", e: "A stated distance is ONE unit — singular verb, even with a plural-looking noun.", hint: "Amounts behave as single quantities.", d: "medium" },
  { q: "It is the referee who ___ the final decision.", o: ["taking", "take", "takes", "take's"], a: "takes", e: "The relative 'who' refers to 'the referee' (singular) — 'takes'. 'It is the referees who take' would flip it.", hint: "The relative pronoun inherits the referenced noun's number.", d: "hard" },
  { q: "Bread and butter ___ served at the reception as a single dish.", o: ["were being both", "have been", "are", "is"], a: "is", e: "The pair names ONE item — notional concord: the meaning (one dish) takes a singular verb. Two separate items would take 'are'.", hint: "Is it one idea or two items?", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "concord" } });
    if (!topic) throw new Error("master concord topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Concord (Subject–Verb Agreement) — Complete", content: { blocks: CC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < CC_QS.length; i++) {
      const item = CC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-concord-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-concord-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "concord-rebuild", blocks: CC_BLOCKS.length, questions: CC_QS.length });
  } catch (e) {
    console.error("rebuild concord failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
