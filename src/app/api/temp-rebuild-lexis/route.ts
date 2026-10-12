import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 5: Lexis and Structure (original authorship):
// articles, countables, pronoun case, verbals (gerund/infinitive/participle),
// adjective vs adverb, collocations, idioms and phrasal verbs.

const LX_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Articles — a, an, the, and the zero article" },
  { type: "definition", term: "Sound decides, not spelling", text: "Use AN before a vowel SOUND (an apple, an hour — the h is silent; an honest man) and A before a consonant sound (a book, a university — 'yu' sound; a European). Use THE for something specific or already mentioned ('the book on the table'). No article at all for general plurals and uncountables ('Books are useful', 'Water is life')." },
  { type: "example", text: "Worked: 'She gave me an advice' fails twice — 'advice' is UNCOUNTABLE (no a/an) and would take 'a piece of advice' when counted. 'Furniture', 'information', 'luggage' behave the same: never plural, never with a/an." },
  { type: "heading", level: 2, text: "2. Countables and uncountables — the quantity words" },
  { type: "table", headers: ["Countable", "Uncountable"], rows: [["many books", "much water"], ["few chairs", "little sugar"], ["fewer mistakes", "less time"], ["a number of ideas", "an amount of money"]] },
  { type: "paragraph", text: "The count/uncount divide decides the quantifier: MANY/FEW/FEWER with countables; MUCH/LITTLE/LESS with uncountables. The exam's favourite pair: 'fewer books' (count) vs 'less water' (uncount) — supermarkets get this wrong; examinations do not." },
  { type: "heading", level: 2, text: "3. Pronoun case — subject, object, possessive" },
  { type: "definition", term: "Case", text: "SUBJECT case performs the action (I, he, she, we, they); OBJECT case receives it (me, him, her, us, them); POSSESSIVE shows ownership (my/mine, your/yours, their/theirs). The test for compounds: drop the other person — 'She gave the book to Kola and (I/me)' → 'to ME' (you would never say 'to I'). 'Between you and ME' — always object after a preposition." },
  { type: "example", text: "Worked: 'Each of the girls must bring HER pen' — the antecedent is EACH (singular), so formal English wants the singular possessive. 'Their' is common in speech, but the examination prefers agreement with the singular 'each'." },
  { type: "heading", level: 2, text: "4. Verbals — the three disguises of a verb" },
  { type: "definition", term: "Gerund, infinitive, participle", text: "A GERUND (-ing form used as a NOUN): 'Swimming is fun', 'I enjoy reading'. An INFINITIVE (to + verb): 'I want to go'. A PARTICIPLE used as an adjective: 'the broken vase', 'a running tap'. Some verbs fix their partner: ENJOY takes a gerund (enjoy reading, never enjoy to read), WANT takes an infinitive (want to go), and prepositions take gerunds ('look forward to SEEING you' — to is a preposition here, not part of an infinitive)." },
  { type: "example", text: "Worked: 'I look forward to see you' fails because 'to' in 'look forward to' is a PREPOSITION, and prepositions take the -ing form: 'look forward to SEEING you.' Compare 'I want to see you' — there, 'to' starts a true infinitive." },
  { type: "heading", level: 2, text: "5. Modifier choice — adjective or adverb" },
  { type: "paragraph", text: "Adjectives describe NOUNS ('a careful driver'); adverbs describe VERBS ('she drives carefully'), adjectives, or other adverbs. After a linking verb (be, seem, become, feel, taste), use the ADJECTIVE: 'She seems calm' (not calmly) — the word describes the subject, not an action. And no double comparisons: 'more taller' is out; 'taller' stands alone." },
  { type: "heading", level: 2, text: "6. Collocations — words that travel together" },
  { type: "table", headers: ["Verb/Adjective + preposition", "Example"], rows: [["depend ON", "It depends on the weather."], ["interested IN", "She is interested in biology."], ["afraid OF", "He is afraid of heights."], ["good AT", "She is good at mathematics."], ["comply WITH", "Comply with the rules."], ["consist OF", "The team consists of eleven players."], ["married TO", "He is married to a teacher."]] },
  { type: "paragraph", text: "Collocations are fixed by USAGE, not logic — you memorise them in pairs. 'Married WITH' and 'good IN' are the two that appear most often as wrong options. When two options differ only by the preposition, the collocation list IS the answer." },
  { type: "heading", level: 2, text: "7. Idioms and phrasal verbs — meaning is not arithmetic" },
  { type: "definition", term: "Idioms", text: "An IDIOM means something its individual words cannot give: 'let the cat out of the bag' = reveal a secret; 'bite the bullet' = endure something painful bravely; 'call off' = cancel; 'put off' = postpone; 'take after' = resemble a relative; 'look into' = investigate. The exam gives you the idiom IN a sentence and asks for its MEANING — never translate word by word; recall the fixed sense." },
  { type: "example", text: "Worked: 'The strike was CALLED OFF' — a reader who knows only 'call' and 'off' separately is lost; the phrasal verb is a single unit meaning CANCELLED. Phrasal verbs are vocabulary items, not grammar puzzles — learn them as whole words." },
  { type: "heading", level: 2, text: "8. Summary — the lexis spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["a / an / the", "Vowel SOUND, not letter", "an hour, a university"], ["much / many", "Uncountable vs countable", "less books — no: fewer books"], ["I or me", "Drop the other person", "Between you and ME"], ["enjoy / want", "Gerund vs infinitive verbs", "enjoy to read — no: enjoy reading"], ["look forward to", "'to' is a preposition → -ing", "look forward to SEEING you"], ["Idiom meaning", "Fixed sense, recalled whole", "Word-by-word translation misleads"], ["Collocations", "Married TO, good AT, depend ON", "Logic cannot choose — usage does"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'choose the correct option' = name the RULE or the fixed usage; 'explain the idiom' = the meaning, not the words; 'fill the gap' = the collocation, recalled as a pair. Lexis papers pay for USAGE — grammar logic cannot rescue an unknown idiom; the fixed list is the work." },
];

const LX_QS: Q[] = [
  { q: "She gave me ___ useful advice.", o: ["many", "a piece of", "an", "a"], a: "a piece of", e: "'Advice' is uncountable — no a/an, no plural. Count it with 'a piece of'.", hint: "Uncountables are counted in pieces or bits.", d: "easy" },
  { q: "He arrived ___ hour late.", o: ["the", "some", "a", "an"], a: "an", e: "'Hour' begins with a silent h — the first SOUND is a vowel, so 'an hour'. Compare 'a university' (yu-sound).", hint: "Sound, not spelling.", d: "easy" },
  { q: "There are ___ mistakes in your essay than in mine.", o: ["fewer", "little", "much", "less"], a: "fewer", e: "'Mistakes' is countable — fewer. 'Less' pairs with uncountables (less ink, less time).", hint: "Can you count it?", d: "medium" },
  { q: "She gave the award to Bola and ___.", o: ["I", "me", "myself", "mine"], a: "me", e: "After the preposition 'to', use the object case. Drop 'Bola and' and test: 'gave the award to me' — never 'to I'.", "hint": "Drop the other person and listen.", d: "hard" },
  { q: "I look forward to ___ from you soon.", o: ["be heard", "hear", "hearing", "have heard"], a: "hearing", e: "In 'look forward to', the 'to' is a PREPOSITION — prepositions take the -ing form: hearing.", hint: "Which 'to' is it — infinitive or preposition?", d: "hard" },
  { q: "The thief denied ___ the money.", o: ["steal", "having steal", "to steal", "stealing"], a: "stealing", e: "'Deny' takes a gerund: denied stealing. 'Enjoy', 'avoid', 'finish' and 'deny' all take -ing partners.", hint: "Some verbs demand the -ing partner.", d: "medium" },
  { q: "After the linking verb in 'The soup tastes ___', choose", o: ["delicious", "more deliciously", "delicacy", "deliciously"], a: "delicious", e: "Linking verbs (taste, seem, feel) take an ADJECTIVE describing the subject — the soup IS delicious; nothing is being tasted by the soup.", hint: "The soup is not doing the tasting.", d: "hard" },
  { q: "She is good ___ mathematics but weak ___ grammar.", o: ["in / at", "at / in", "at / on", "in / in"], a: "at / in", e: "The collocations are fixed: good AT, weak IN. Usage, not logic, fixes the pair.", hint: "Learn the pairs as they come.", d: "medium" },
  { q: "The union leader said the strike would be ___.", o: ["called for — demanded", "called off — cancelled", "called up — telephoned", "called on — visited"], a: "called off — cancelled", e: "'Call off' is a phrasal verb meaning CANCEL — a fixed unit whose meaning no single word gives away.", hint: "The phrasal verb is one vocabulary item.", d: "easy" },
  { q: "The idiom 'to let the cat out of the bag' means", o: ["to create confusion", "to buy a worthless item", "to reveal a secret carelessly", "to release a pet"], a: "to reveal a secret carelessly", e: "Idioms mean what usage fixed, not what the words say — the cat and the bag are history, not instruction.", hint: "Recall the fixed sense, ignore the literal picture.", d: "medium" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "lexis-structure" } });
    if (!topic) throw new Error("master lexis-structure topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Lexis and Structure — Complete", content: { blocks: LX_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < LX_QS.length; i++) {
      const item = LX_QS[i];
      await prisma.question.upsert({
        where: { id: `master-lexis-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-lexis-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "lexis-rebuild", blocks: LX_BLOCKS.length, questions: LX_QS.length });
  } catch (e) {
    console.error("rebuild lexis failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
