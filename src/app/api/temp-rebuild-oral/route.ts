import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; hint: string; d: string };

// DEEP REBUILD — English Language Topic 9: Oral English (original authorship):
// vowel phonemes, consonant phonemes, minimal pairs, silent letters, word stress,
// emphatic stress, rising/falling intonation.

const OR_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The vowel sounds — twenty voices, no letters" },
  { type: "definition", term: "Vowel phonemes", text: "English carries twenty vowel SOUNDS: twelve short and long single sounds (monophthongs — the mouth holds one position) and eight gliding sounds (diphthongs — the mouth moves from one position to another). Spelling is unreliable ('cut' and 'put' share a letter but not a sound), so the exam tests the SOUND: which word contains the same vowel as another." },
  { type: "table", headers: ["Sound type", "How it behaves", "Contrast pair"], rows: [["Short monophthong", "One steady position, brief", "ship /i/ vs sheep /iː/"], ["Long monophthong", "One steady position, held longer", "cart /ɑː/ vs cot /ɒ/"], ["Diphthong", "Glides from one vowel to another", "day, boy, now, go"]] },
  { type: "example", text: "Worked: 'ship' and 'sheep' differ by ONE sound — /i/ (short, relaxed) against /iː/ (long, tense). That single difference changes the word: a MINIMAL PAIR. The exam's identification questions are minimal-pair hunts: find the word whose vowel matches (or differs from) the given set." },
  { type: "heading", level: 2, text: "2. The consonant system — including the two strangers" },
  { type: "definition", term: "Consonants", text: "Twenty-four consonant sounds, including two that English spelling hides: the voiceless TH /θ/ in 'think' and 'bath', and the voiced TH /ð/ in 'this' and 'mother' — both written with the same two letters but produced differently (voiceless = breath only; voiced = vibration). Other traps: /ʃ/ in 'she' and 'sugar', /tʃ/ in 'chair', /dʒ/ in 'judge', /ŋ/ in 'sing' — the last never begins an English word." },
  { type: "example", text: "Worked: 'think' vs 'this' — place your fingers on your throat: /θ/ has no vibration, /ð/ hums. The silent-letter family also lives here: the K in 'knife', the B in 'debt', the W in 'write', the S in 'island' — spelled but never spoken." },
  { type: "heading", level: 2, text: "3. Word stress — the loud syllable" },
  { type: "definition", term: "Stress", text: "Every English word of two or more syllables carries ONE primary stress — the syllable spoken louder, longer and at a higher pitch: 'TEAcher', 'canTEEN', 'underSTAND'. Stress is meaning-bearing: REcord (noun — a disc) vs reCORD (verb — to capture sound); INcrease (noun) vs inCREASE (verb). Nouns lean first-syllable, verbs lean second — the noun/verb stress shift is the exam's staple." },
  { type: "example", text: "Worked: 'There was a sudden INcrease in prices' (noun, first syllable) vs 'Prices will inCREASE again' (verb, second syllable). Same letters, different stress, different word class — stress is grammar you can hear." },
  { type: "heading", level: 2, text: "4. Emphatic stress — the sentence's spotlight" },
  { type: "definition", term: "Emphatic stress", text: "In speech, ONE word in a sentence is stressed to answer an implied question: 'MUSA broke the cup' (who?), 'Musa BROKE the cup' (what did he do?), 'Musa broke the CUP' (which object?). Exam questions give the stressed word and ask which question the sentence answers — or reverse it. The stressed word is the information spotlight: everything the sentence does NOT stress is taken as known." },
  { type: "example", text: "Worked: 'The PRINCIPAL spoke to the students' — stress on PRINCIPAL answers 'WHO spoke to the students?' The same words with stress on STUDENTS answer a different question entirely. Locate the capitalised stress and ask the question it answers." },
  { type: "heading", level: 2, text: "5. Intonation — the melody of the sentence" },
  { type: "definition", term: "Rising and falling", text: "FALLING intonation completes: statements ('I am coming.'), WH-questions ('Where is he?'), commands ('Sit down.'). RISING intonation continues or asks: yes/no questions ('Are you coming?'), polite requests ('Come in?'), unfinished lists ('tea, coffee, and milk...'), and expressions of surprise or doubt. Wh-questions fall; yes/no questions rise — the pairing the exam drills." },
  { type: "example", text: "Worked: 'Where are you going?' — a WH-question (it begins with a question word) → FALLING tone. 'Are you going?' — answerable by yes/no → RISING. The first word of the question predicts the melody: WH falls, auxiliary rises." },
  { type: "heading", level: 2, text: "6. Summary — the oral English spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Vowel identification", "Minimal-pair comparison by SOUND", "Spelling is not the sound"], ["Consonants", "θ voiceless vs ð voiced", "Both are spelled 'th'"], ["Silent letters", "The letter is written, never spoken", "knife, debt, island, write"], ["Word stress", "Noun leans first, verb leans second", "REcord / reCORD shift"], ["Emphatic stress", "The stressed word answers WHO/WHAT/WHEN", "Read the unstressed parts as known"], ["Intonation", "WH falls; yes/no rises", "Statements also fall"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify the sound' = the phoneme, not the letter; 'which word rhymes/contains the same vowel' = minimal-pair logic; 'the stressed word is...' = the question it answers; 'the intonation of...' = the sentence type. Oral English papers pay for SOUND reasoning — every question is answerable by ear rules you can state." },
];

const OR_QS: Q[] = [
  { q: "Which word contains the same vowel sound as 'seat'?", o: ["sat", "sit", "meat", "set"], a: "meat", e: "'Seat' and 'meat' share the long /iː/; 'sit' carries the short relaxed /i/ — a minimal pair that changes the word.", hint: "One of these is a minimal pair with 'seat'.", d: "easy" },
  { q: "The initial sound in 'think' is", o: ["the same as in 'tank'", "a silent letter", "the same as in 'this'", "a voiceless /θ/ — breath without vibration"], a: "a voiceless /θ/ — breath without vibration", e: "'Think' begins with the voiceless TH: air passes, the throat does not hum. 'This' begins with the voiced partner /ð/.", hint: "Touch your throat — does it hum?", d: "easy" },
  { q: "Which word contains a silent letter?", o: ["signal", "isolated", "visible", "island"], a: "island", e: "The S in 'island' is written but never spoken — /ˈaɪlənd/. Its relatives 'signal' and 'visible' pronounce every letter.", hint: "One word hides a letter it never says.", d: "easy" },
  { q: "The word 'record' is stressed on the FIRST syllable when it is", o: ["a noun — a disc or a best performance", "a verb — to capture sound", "an adjective", "an adverb"], a: "a noun — a disc or a best performance", e: "Noun REcord vs verb reCORD — the stress shift signals the word class. Nouns lean front; verbs lean back.", "hint": "Stress is grammar you can hear.", d: "medium" },
  { q: "Which pair are minimal pairs — differing by exactly one sound?", o: ["sheep / sheet's edge", "ship / sheep", "ship / boat", "sheep / shop"], a: "ship / sheep", e: "'Ship' and 'sheep' differ in ONE sound (short /i/ vs long /iː/) with everything else identical — the definition of a minimal pair.", hint: "Identical except for one vowel.", d: "medium" },
  { q: "'The PRINCIPAL addressed the students.' The emphatic stress on PRINCIPAL answers the question", o: ["To whom did she speak?", "When did it happen?", "Who addressed the students?", "What did the principal do?"], a: "Who addressed the students?", e: "The stressed word is the NEW information: stress on PRINCIPAL supplies the doer — the answer to WHO.", hint: "The spotlight word answers the missing question.", d: "hard" },
  { q: "The intonation of 'Where are you going?' is", o: ["rising — all questions rise", "flat throughout", "rising then falling twice", "falling — WH-questions complete with a fall"], a: "falling — WH-questions complete with a fall", e: "Questions beginning with a question word (where, what, why, who) take FALLING intonation; only yes/no questions rise.", hint: "WH falls; yes/no rises.", d: "medium" },
  { q: "Which question would be spoken with RISING intonation?", o: ["Are you coming to the match?", "Where is the match?", "Who won the match?", "What time does the match start?"], a: "Are you coming to the match?", e: "It is answerable with YES or NO — yes/no questions carry rising intonation. WH-questions fall.", hint: "Yes or no questions climb.", d: "medium" },
  { q: "In 'conTENT' (satisfaction) versus 'CONtent' (what is inside), the stress", o: ["changes the spelling", "distinguishes two different words", "is irrelevant to meaning", "marks only the plural"], a: "distinguishes two different words", e: "Stress is meaning-bearing: the same letters are two different English words depending on which syllable carries the beat.", hint: "Same spelling — different words.", d: "hard" },
  { q: "A diphthong is best described as", o: ["a consonant cluster", "a long vowel held perfectly steady", "a vowel sound that GLIDES from one position to another within one syllable", "two separate syllables joined"], a: "a vowel sound that GLIDES from one position to another within one syllable", e: "Monophthongs hold one position; diphthongs move — hear your mouth travel in 'boy' (ɔɪ) and 'now' (aʊ).", hint: "The mouth travels mid-sound.", d: "hard" }

];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "oral-english" } });
    if (!topic) throw new Error("master oral-english topic missing — run the curriculum seed first");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Oral English — Complete", content: { blocks: OR_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < OR_QS.length; i++) {
      const item = OR_QS[i];
      await prisma.question.upsert({
        where: { id: `master-oral-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
        create: { id: `master-oral-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, hint: item.hint, difficulty: item.d, sourceExam: "original-exam-style" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "oral-rebuild", blocks: OR_BLOCKS.length, questions: OR_QS.length });
  } catch (e) {
    console.error("rebuild oral failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
