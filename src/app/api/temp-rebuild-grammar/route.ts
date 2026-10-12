import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 1: Grammar Foundations (original authorship):
// the eight parts of speech, word-class shifts in context, phrases, clauses,
// sentence types by structure and function, fragments and run-ons.

const GF_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The eight word classes — the toolkit" },
  { type: "definition", term: "Parts of speech", text: "Every English word belongs to one of eight classes: NOUN (names a person, place, thing or idea), PRONOUN (stands in for a noun), VERB (expresses an action or a state), ADJECTIVE (describes a noun), ADVERB (modifies a verb, an adjective or another adverb), PREPOSITION (links a noun to another word — position, time, relationship), CONJUNCTION (joins words or clauses), INTERJECTION (a sudden exclamation). The exam question is never 'define a noun' — it is 'identify the class of THIS word in THIS sentence'." },
  { type: "table", headers: ["Class", "Job", "Examples"], rows: [["Noun", "Names", "Lagos, teacher, courage, team"], ["Pronoun", "Replaces a noun", "she, themselves, who, everybody"], ["Verb", "Action or state", "run, is, seem, must go"], ["Adjective", "Describes a noun", "tall, five, this, her"], ["Adverb", "Modifies verb/adj/adverb", "slowly, very, yesterday, here"], ["Preposition", "Shows relationship", "under, during, because of"], ["Conjunction", "Joins", "and, although, either...or"], ["Interjection", "Exclaims", "Ouch! Hurrah!"]] },
  { type: "example", text: "Worked: in 'She sang beautifully at the concert last night', 'She' is a pronoun, 'sang' a verb, 'beautifully' an adverb (modifying 'sang'), 'at' a preposition, 'the concert' a noun phrase, 'last night' an adverbial phrase of time. Identify by FUNCTION in the sentence, not by guessing from the word alone." },
  { type: "heading", level: 2, text: "2. Words change class in context" },
  { type: "definition", term: "Class shift", text: "The SAME spelling can serve different classes: 'He will BOOK a flight' (verb), 'She read a BOOK' (noun), 'That is a FAST car' (adjective), 'He runs FAST' (adverb), 'They FAST during Ramadan' (verb). The test: what JOB does the word do in THIS sentence? Examiners choose sentences where the word's usual class misleads you." },
  { type: "example", text: "Worked: 'The early bird catches the worm' — 'early' is an adjective (describes 'bird'). 'He arrived early' — 'early' is an adverb (modifies 'arrived'). Same word, two classes, two jobs. The surrounding words decide." },
  { type: "heading", level: 2, text: "3. Phrases and clauses — the building blocks" },
  { type: "definition", term: "Phrase vs clause", text: "A PHRASE is a group of words WITHOUT a subject–verb pair ('in the morning', 'the tall boy', 'has been waiting'). A CLAUSE has BOTH a subject and a verb. An INDEPENDENT clause stands alone as a sentence ('She came early'); a DEPENDENT clause cannot ('because she wanted to study'). Dependent clauses serve as nouns ('What he said surprised me'), adjectives ('The man who called is my uncle'), or adverbs ('I will wait until you return')." },
  { type: "example", text: "Worked: 'When the bell rang' — subject 'the bell', verb 'rang' → a clause; but it cannot stand alone → a DEPENDENT (adverb) clause. 'After the assembly' — no verb → a phrase. The phrase/clause distinction is the most-tested identification item in this topic." },
  { type: "heading", level: 2, text: "4. Sentence types by structure" },
  { type: "table", headers: ["Type", "Recipe", "Example"], rows: [["Simple", "ONE independent clause", "The girl sang."], ["Compound", "Two independent clauses joined (coordinating word or semicolon)", "The girl sang, and the crowd cheered."], ["Complex", "One independent + at least one dependent clause", "Although it rained, we went out."], ["Compound-complex", "Two independent + at least one dependent", "Although it rained, we went out, and we enjoyed it."]] },
  { type: "paragraph", text: "By FUNCTION, sentences are declarative (statement), interrogative (question), imperative (command), exclamatory (strong emotion). Structure and function are independent axes — 'Close the door' is simple in structure AND imperative in function. Exam questions name ONE axis: read which is asked." },
  { type: "heading", level: 2, text: "5. Fragments, run-ons and comma splices" },
  { type: "definition", term: "Three faults", text: "A FRAGMENT is punctuated as a sentence but lacks a subject–verb pair or is a stranded dependent clause ('Because I was tired.'). A RUN-ON joins independent clauses with no punctuation between them. A COMMA SPLICE joins independent clauses with only a comma. The repairs: a full stop, a semicolon, or comma + coordinating word (and, but, so...)." },
  { type: "example", text: "Worked: 'She studied hard, she passed' — comma splice. Repairs: 'She studied hard; she passed.' / 'She studied hard, so she passed.' / 'She studied hard. She passed.' Every repair restores a proper boundary between the two independent clauses." },
  { type: "heading", level: 2, text: "6. Summary — the grammar foundations spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Identify the word class", "Test the job in THIS sentence", "Spelling misleads — 'fast' is both adjective and adverb"], ["Phrase or clause", "Look for a subject–verb pair", "'Before the match' is a phrase — no verb"], ["Sentence type (structure)", "Count independent + dependent clauses", "One complex sentence still has ONE independent clause"], ["Fragment repair", "Supply the missing subject–verb pair", "A capital letter and full stop do not make a sentence"], ["Comma splice", "Full stop, semicolon, or comma + and/but/so", "A comma alone is never enough"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify the part of speech' = name the class AND the clue in the sentence; 'state the sentence type' = say which axis (structure or function) and the evidence; 'correct the sentence' = name the fault AND the repair. Grammar papers pay for the REASON — a correct label without evidence earns half." },
];

const GF_QS: Q[] = [
  { q: "In 'She sang beautifully', the word 'beautifully' is", o: ["a verb", "an adjective", "an adverb modifying 'sang'", "a noun"], a: "an adverb modifying 'sang'", e: "It tells HOW she sang — adverbs modify verbs.", hint: "Ask what the word tells you about the singing.", d: "easy" },
  { q: "In 'They fast during Ramadan', the word 'fast' is", o: ["a verb", "an adverb", "a noun", "an adjective"], a: "a verb", e: "It names the ACTION they perform — the same spelling serves as noun or adjective elsewhere.", hint: "What job does it do here?", d: "medium" },
  { q: "Which group contains ONLY prepositions?", o: ["under, although, because", "during, and, of", "because of, and, or", "under, during, because of"], a: "under, during, because of", e: "'Although/and/or' are conjunctions — they join clauses; prepositions link a noun to another word.", hint: "One of the groups smuggles in conjunctions.", d: "easy" },
  { q: "'What he said surprised me' — the underlined clause 'What he said' functions as", o: ["an adjective clause", "an adverb clause", "a noun clause (subject)", "an independent clause"], a: "a noun clause (subject)", e: "It occupies the SUBJECT slot — the thing that surprised me IS what he said. Noun clauses do a noun's job.", hint: "Replace it with 'it' — does the sentence survive?", d: "hard" },
  { q: "The sentence 'Although it rained, we went out' is", o: ["a compound-complex sentence", "a simple sentence", "a compound sentence", "a complex sentence"], a: "a complex sentence", e: "One independent clause ('we went out') + one dependent clause ('Although it rained') = complex. Compound requires TWO independent clauses.", hint: "Count the independent clauses.", d: "hard" },
  { q: "'The girl sang, and the crowd cheered' is", o: ["a complex sentence", "a fragment", "a simple sentence", "a compound sentence — two independent clauses joined"], a: "a compound sentence — two independent clauses joined", e: "Two subject–verb pairs, each able to stand alone, joined by 'and' — the compound recipe.", hint: "Could each half stand alone?", d: "medium" },
  { q: "Which is a FRAGMENT?", o: ["The match was cancelled, so we went home.", "We waited for the rescheduled match.", "The referee arrived late.", "Because the match was cancelled."], a: "Because the match was cancelled.", e: "It is a dependent clause punctuated as a sentence — no complete thought. The rest are full sentences.", hint: "Does it leave a question hanging?", d: "medium" },
  { q: "The comma splice in 'She studied hard, she passed' is best repaired by", o: ["adding 'so' after the comma", "removing the comma", "swapping the two clauses", "adding 'although' before 'she passed'"], a: "adding 'so' after the comma", e: "Comma + coordinating word repairs a splice: 'She studied hard, so she passed.' Removing the comma makes a run-on; 'although' wrecks the logic.", hint: "Give the second clause a reason-word that fits the meaning.", d: "hard" },
  { q: "In 'The early bird catches the worm', 'early' is an adjective; in 'He arrived early', it is", o: ["a conjunction", "an adjective", "an adverb", "a noun"], a: "an adverb", e: "It modifies 'arrived' — HOW he arrived. Same spelling, different class: the sentence's job decides.", hint: "What question does it answer?", d: "medium" },
  { q: "The function of 'Close the door' is", o: ["imperative", "exclamatory", "declarative", "interrogative"], a: "imperative", e: "It commands. Structure is separate: it is also a simple sentence — but the question asks FUNCTION.", hint: "What does the speaker want done?", d: "easy" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "grammar-foundations" } });
    if (!topic) throw new Error("master grammar-foundations topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Grammar Foundations — Complete", content: { blocks: GF_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < GF_QS.length; i++) {
      const item = GF_QS[i];
      await prisma.question.upsert({
        where: { id: `master-grammar-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-grammar-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "grammar-foundations-rebuild", blocks: GF_BLOCKS.length, questions: GF_QS.length });
  } catch (e) {
    console.error("rebuild grammar failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
