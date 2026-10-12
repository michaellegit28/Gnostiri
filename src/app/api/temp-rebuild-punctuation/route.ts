import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 4: Punctuation and Mechanics (original authorship):
// the marks and their jobs, boundary repairs, its/it's, capitalisation, spelling rules.

const PM_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Every mark has ONE job" },
  { type: "definition", term: "The marks", text: "The full stop ends a sentence. The comma marks a pause INSIDE it — separating list items, setting off introductory phrases, or framing an aside. The semicolon joins two CLOSELY RELATED independent clauses without a conjunction. The colon ANNOUNCES — a list, an explanation, a quotation. The apostrophe shows possession or contraction. Learn the JOB and the choice becomes logical, not memorised." },
  { type: "table", headers: ["Mark", "Job", "Example"], rows: [["Full stop (.)", "End a complete sentence", "The bell rang."], ["Comma (,)", "Separate inside a sentence", "However, we stayed."], ["Semicolon (;)", "Join related independent clauses", "I studied; I passed."], ["Colon (:)", "Announce a list or explanation", "Buy three things: rice, oil, salt."], ["Apostrophe (')", "Possession or contraction", "the boy's bag; don't"], ["Question/exclamation", "End question/strong emotion", "Really? Amazing!"]] },
  { type: "example", text: "Worked: 'I was tired I went to bed' — a run-on. The repairs: full stop ('...tired. I went...'), semicolon ('...tired; I went...'), or comma + word ('...tired, so I went...'). The semicolon is the option that keeps the two thoughts glued — it claims the ideas belong together." },
  { type: "heading", level: 2, text: "2. The comma — the tested mark" },
  { type: "paragraph", text: "Comma uses the exam hunts: separating THREE OR MORE list items ('beans, rice, and oil'); after an INTRODUCTORY element ('After the match, we ate'); around a NON-ESSENTIAL aside ('My uncle, a doctor, lives in Enugu' — the sentence survives without the aside); before a coordinating word joining two independent clauses ('He ran, and she followed'). The trap: NO comma between a subject and its verb, or a verb and its object." },
  { type: "example", text: "Worked: 'My brother who lives in Kano is a pilot' vs 'My brother, who lives in Kano, is a pilot' — WITH the commas, 'who lives in Kano' is extra information (I have one brother); WITHOUT, it identifies WHICH brother (I have several). The commas change the meaning — that is why the exam tests them." },
  { type: "heading", level: 2, text: "3. The apostrophe — possession and contraction" },
  { type: "definition", term: "Apostrophe", text: "POSSESSION: add 's to a singular owner ('the girl's book'), and just an apostrophe after a plural already ending in s ('the girls' books'). CONTRACTION: the apostrophe marks MISSING letters ('don't' = do not; 'it's' = it is). The famous pair: ITS (possessive — no apostrophe) vs IT'S (it is). Test by expanding: if 'it is' fits the sentence, write it's." },
  { type: "example", text: "Worked: 'The dog wagged it's tail' — expand: 'the dog wagged it is tail' — nonsense → the possessive 'its' is required. The expansion test settles every its/it's and your/you're ('you are') question instantly." },
  { type: "heading", level: 2, text: "4. Capitalisation rules" },
  { type: "table", headers: ["Capitalise", "Example"], rows: [["First word of a sentence", "We arrived late."], ["Proper nouns and places", "Amina, Kano, River Niger"], ["Days, months, holidays", "Monday, December, Sallah"], ["Titles with names", "President Tinubu, Dr Ade"], ["Languages and nationalities", "English, Nigerian"], ["The pronoun I", "Amina and I travelled."]] },
  { type: "paragraph", text: "NOT capitalised: ordinary common nouns ('the river' vs 'River Niger'), school subjects except languages ('I study mathematics and English'), seasons ('the rainy season'). The exam pairs a capitalisation error with three correct-looking neighbours — test each option against the table." },
  { type: "heading", level: 2, text: "5. Spelling — the rules that decide the options" },
  { type: "table", headers: ["Rule", "Apply", "Watch"], rows: [["i before e except after c", "believe, receive", "weird, seize (exceptions)"], ["Drop final e before a vowel suffix", "make → making", "keep the e to soften: notice → noticeable"], ["Double final consonant after single vowel + stressed syllable", "stop → stopped", "open → opened (stress not final — no doubling)"], ["y → i before a suffix (except -ing)", "carry → carried", "carry → carrying (no change before -ing)"]] },
  { type: "paragraph", text: "The commonly misspelled list rewards slow reading: accommodation (double c, double m), separate (there's 'a rat' in the middle), occurred (double c, double r), definitely, necessary (one c, two s), embarrass, recommend. In options, the misspelling is usually ONE letter off — compare letter by letter." },
  { type: "heading", level: 2, text: "6. Summary — the punctuation spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Join two clauses", "Full stop, semicolon, or comma + word", "A comma alone splices"], ["Its / It's", "Expand: 'it is' fits → it's", "Possessive its takes NO apostrophe"], ["List commas", "Items + optional final comma", "No comma between subject and verb"], ["Essential vs extra information", "Commas change meaning", "'My brother, who...' assumes one brother"], ["Spelling options", "Compare letter by letter", "One-letter-off distractors"], ["Capitalisation", "Proper nouns only", "School subjects stay small (except languages)"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'punctuate correctly' = name the JOB the mark is doing; 'identify the error' = the rule broken, not just the mark; 'rewrite' = the repaired sentence, complete. Mechanics papers pay for the RULE behind the mark — a lucky correct option without the rule earns half." },
];

const PM_QS: Q[] = [
  { q: "Which sentence is punctuated correctly?", o: ["I studied hard: and I passed the exam.", "I studied hard; I passed the exam.", "I studied hard, I passed the exam.", "I studied hard I passed the exam."], a: "I studied hard; I passed the exam.", e: "Two related independent clauses join with a semicolon. The comma alone splices; nothing at all run-ons.", hint: "Two full sentences, one close relationship.", d: "easy" },
  { q: "___ raining, so the match was postponed.", o: ["Its'", "It is'", "Its", "It's"], a: "It's", e: "Expand: 'IT IS raining' — the contraction 'it's'. The possessive 'its' never takes an apostrophe.", hint: "Expand it: does 'it is' fit?", d: "medium" },
  { q: "The books belonging to the three girls are the ___ books.", o: ["girls'", "girls", "girl's'", "girl's"], a: "girls'", e: "Plural owner already ending in s takes ONLY the apostrophe after the s: the girls' books. Singular would be girl's.", hint: "How many owners?", d: "medium" },
  { q: "Which sentence uses the comma correctly?", o: ["After the long meeting, the committee adjourned.", "After, the long meeting the committee adjourned.", "After the long meeting the, committee adjourned.", "After the long, meeting the committee adjourned."], a: "After the long meeting, the committee adjourned.", e: "An introductory phrase takes a comma AFTER it — one comma, correctly placed at the boundary.", hint: "The comma sits at the phrase's end.", d: "medium" },
  { q: "'My sister, who lives in Abuja, is a lawyer' — the commas tell us that", o: ["the information is essential", "I have several sisters, and the Abuja one is a lawyer", "I have exactly one sister, and she lives in Abuja", "the sister lives in Abuja but is not a lawyer"], a: "I have exactly one sister, and she lives in Abuja", e: "Commas mark NON-ESSENTIAL information — extra detail about an already-identified person. Without commas, the clause would IDENTIFY which sister of several.", "hint": "Read the sentence with and without the aside.", d: "hard" },
  { q: "Which word is spelled correctly?", o: ["acommodation", "accomadation", "accommodation", "accomodation"], a: "accommodation", e: "Double c AND double m: ac-com-mo-da-tion. The options each drop or swap one doubled letter — compare slowly.", hint: "Two doubles in one word.", d: "easy" },
  { q: "The correct spelling is", o: ["separate", "sepperate", "separete", "seperate"], a: "separate", e: "There is 'a rat' in sep-a-rate — the middle vowel is 'a' twice, never 'e'.", hint: "a-rat hides inside the word.", d: "easy" },
  { q: "Which sentence is correctly capitalised?", o: ["I study mathematics and english at school.", "I study Mathematics and English at School.", "I study mathematics and English at school.", "I study Mathematics and english at school."], a: "I study mathematics and English at school.", e: "Language names are capitalised (English); school subjects generally are not (mathematics); 'school' is a common noun and stays small.", hint: "Languages always capitalise.", d: "medium" },
  { q: "stop → stopped follows the same rule as", o: ["fix → fixed", "open → opened", "occur → occurred", "walk → walked"], a: "occur → occurred", e: "Both double the final consonant: single vowel + stressed final syllable. 'Opened' and 'walked' carry unstressed final syllables (no doubling), and 'fixed' ends in x.", hint: "Stress on the last syllable decides the doubling.", d: "hard" },
  { q: "The colon is used correctly in", o: ["He packed three things, a map: a rope, and a lamp.", "He packed three things; a map, a rope, and a lamp.", "He packed three things: a map, a rope, and a lamp.", "He packed: three things a map, a rope and a lamp."], a: "He packed three things: a map, a rope, and a lamp.", e: "The colon ANNOUNCES a list after a complete introduction. A semicolon cannot introduce; a comma cannot announce.", hint: "The colon announces what follows.", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "punctuation-mechanics" } });
    if (!topic) throw new Error("master punctuation-mechanics topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Punctuation and Mechanics — Complete", content: { blocks: PM_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < PM_QS.length; i++) {
      const item = PM_QS[i];
      await prisma.question.upsert({
        where: { id: `master-punct-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-punct-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "punctuation-rebuild", blocks: PM_BLOCKS.length, questions: PM_QS.length });
  } catch (e) {
    console.error("rebuild punctuation failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
