import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Arts & Design Topic 2: Music at the no-exceptions bar:
// elements of music, notation and note values, time signatures, scales and keys,
// intervals and chords, texture, form, instruments, African traditions.

const MUS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The elements of music — the analysis vocabulary" },
  { type: "definition", term: "Elements", text: "PITCH (how high/low), DURATION (note lengths), DYNAMICS (volume — p to f), TEMPO (speed — largo to presto), TIMBRE (tone colour — what makes a flute differ from a trumpet on the same pitch), TEXTURE (how layers combine), STRUCTURE (how sections are ordered). Every 'describe the music' answer is built from these seven — name the element, then what the composer does with it." },
  { type: "example", text: "Worked: a quiet string entry that grows — dynamics (piano to forte) and texture (solo to full). 'Identify two elements the composer uses for the climax' — dynamics and texture with evidence from the score are the mark." },
  { type: "heading", level: 2, text: "2. Notation — the staff, clefs and note values" },
  { type: "definition", term: "Note values", text: "The staff (5 lines, 4 spaces) holds pitches; the clef fixes the reference (treble G-clef, bass F-clef). Duration halves each step down: SEMIBREVE (4 beats) → MINIM (2) → CROTCHET (1) → QUAVER (½) → SEMIQUAVER (¼). A DOT adds HALF the note's value (dotted minim = 3 beats). RESTS are the silences with matching values — the silence is part of the music." },
  { type: "diagram", diagramId: "note-values", caption: "Whole to sixteenth — each step halves; the dot adds half the value" },
  { type: "example", text: "Worked: a dotted crotchet = 1 + ½ = 1½ beats. Two quavers = one crotchet of time — that is why beamed quavers fill a crotchet beat. 'How many quavers equal a dotted minim?' — a dotted minim = 3 beats = 6 quavers. The halving ladder answers every duration question — trace it, never guess." },
  { type: "heading", level: 2, text: "3. Time signatures — the beat architecture" },
  { type: "definition", term: "Time signature", text: "Top number: beats PER BAR. Bottom: WHICH note value gets one beat (4 = crotchet, 8 = quaver, 2 = minim). 4/4 (four crotchet beats — 'common time'), 3/4 (three — the waltz), 2/2 (cut common — two minims, marches feel it in two). SIMPLE time: beats divide into TWO (each crotchet → 2 quavers). COMPOUND time: beats divide into THREE (6/8 = two dotted-crotchet beats, each splitting into 3 quavers) — the lilt difference is the exam's ear test." },
  { type: "example", text: "Worked: 6/8 vs 3/4 — both hold six quavers per bar, but 3/4 groups 2+2+2 (three beats), 6/8 groups 3+3 (two compound beats). Count the grouping, not the total — the grouping IS the signature's meaning." },
  { type: "heading", level: 2, text: "4. Scales and keys — the tonal map" },
  { type: "definition", term: "Major scale", text: "The major scale pattern is fixed: TONE-TONE-SEMITONE-TONE-TONE-TONE-SEMITONE (C major is all white keys for this reason). MINOR lowers the 3rd, 6th and 7th degrees (natural minor: T-S-T-T-S-T-T) — the darker colour is those lowered degrees. KEY SIGNATURE (sharps/flats after the clef) declares the key; the TONIC is home. Modulation = the music changes home key mid-piece — say from where to what." },
  { type: "example", text: "Worked: D major = D-E (T), E-F# (T), F#-G (S), G-A, A-B, B-C#, C#-D — two sharps in the signature. A minor has no sharps but a lowered 3rd (C natural): same key signature as C major — relative keys. Build the pattern on the note; the signature falls out of the maths." },
  { type: "heading", level: 2, text: "5. Intervals and chords — harmony's atoms" },
  { type: "definition", term: "Triad", text: "An INTERVAL is the distance between two pitches (2nd, 3rd, 4th, 5th, octave); major/minor/perfect qualities depend on semitone counts. A TRIAD stacks a 3rd + a 3rd on a root: MAJOR = 4+3 semitones (bright), MINOR = 3+4 (dark). The workhorse progression I-IV-V-I (tonic-subdominant-dominant-tonic) cadences home — the dominant (V) pulls to the tonic, which is why a piece ends there." },
  { type: "example", text: "Worked: C major triad = C-E-G (E is 4 semitones up, G is 3 more). C minor = C-E♭-G (3+4) — the flat 3rd flips the colour. 'Name the chord and its quality' — root, then the semitone arithmetic; the arithmetic is the mark, the label is just the reading of it." },
  { type: "heading", level: 2, text: "6. Texture — how the layers relate" },
  { type: "table", headers: ["Texture", "What it is", "Sounds like"], rows: [["Monophonic", "One unaccompanied line", "A lone voice, a bugle call"], ["Homophonic", "Melody + chordal accompaniment moving together", "Hymns, pop songs, a singer with piano"], ["Polyphonic", "Two or more independent melodies interwoven", "Round/canon, fugue, drum polyrhythm"]] },
  { type: "example", text: "Worked: a round like 'Row Your Boat' — each voice enters with the SAME melody at different times: polyphonic (independent lines in imitation). The same song with piano chords: homophonic. Ask 'could the lines stand alone?' — if yes, polyphony; if they move as one, homophony." },
  { type: "heading", level: 2, text: "7. Structure — the architecture of pieces" },
  { type: "paragraph", text: "BINARY (AB): two sections, often repeated. TERNARY (ABA): return of the opening — the most common closed shape. RONDO (ABACA): a recurring refrain between episodes. THEME AND VARIATIONS: one theme restated in changed clothes (new key, rhythm, texture). Popular forms: verse-chorus. Analysis question = name the letter plan and cite WHERE each section starts — bar numbers are the evidence." },
  { type: "example", text: "Worked: a piece where a bright theme returns twice between contrasting episodes = rondo ABACA. Say 'the A theme returns at bar 23 and bar 41' — the return POINTS are the proof; the label alone is a guess." },
  { type: "heading", level: 2, text: "8. Instruments and voices — timbre families" },
  { type: "table", headers: ["Family", "Sound production", "Examples"], rows: [["Strings", "Vibrating strings — bowed or plucked", "Violin, cello, guitar, kora"], ["Woodwind", "Air split across a reed or edge", "Flute, clarinet, saxophone"], ["Brass", "Buzzing lips into a cup", "Trumpet, trombone, horn"], ["Percussion", "Struck or shaken — pitched or not", "Djembe, xylophone, drum kit"], ["Voices", "Ranges SATB — soprano, alto, tenor, bass", "Choir, solo voice"]] },
  { type: "paragraph", text: "TIMBRE questions: name the family from the sound (attack, sustain, brightness), then the instrument. African traditions the exam expects: POLYRHYTHM (independent interlocking rhythms — texture question in disguise), CALL-AND-RESPONSE (leader answered by chorus — structure in disguise), and oral transmission by ear rather than notation." },
  { type: "example", text: "Worked: three drum lines each keeping a different pattern that interlock into one groove — polyrhythm (a POLYPHONIC texture of rhythms). A leader sings a phrase, the community repeats it — call-and-response, a structural device. Name the element AND the tradition device — the pairing is the mark." },
  { type: "heading", level: 2, text: "9. Summary — the music spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Durations", "Trace the halving ladder + dot rule", "Dotted crotchet = 1½, not 2"], ["Time signature", "Beats per bar ÷ which value", "6/8 vs 3/4: grouping, not totals"], ["Scales", "T-T-S-T-T-T-S on the given tonic", "Key signature is the maths, not a memory test"], ["Chords", "Root + 3rd + 3rd; count semitones", "Major 4+3, minor 3+4 — order flips colour"], ["Texture", "Could the lines stand alone?", "Melody + chords = homophonic, not monophonic"], ["Form", "Letter plan + where sections start", "Cite bars — returns are the evidence"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify' = the element, value, or form name; 'describe' = what happens with evidence (bars, dynamics marks); 'explain' = the mechanism (why the dominant pulls home); 'compare' = both excerpts, difference per line. Music papers pay for SCORE EVIDENCE — a label without a bar number or symbol earns half." },
];

const MUS_QS: Q[] = [
  { q: "A dotted crotchet lasts", o: ["1 beat", "1½ beats", "2 beats", "2½ beats"], a: "1½ beats", e: "Crotchet (1) + half its value (½) = 1½.", d: "easy" },
  { q: "How many quavers equal one dotted minim?", o: ["3", "4", "6", "8"], a: "6", e: "Dotted minim = 3 beats = 6 × ½-beat quavers.", d: "medium" },
  { q: "The top number of a time signature tells you", o: ["the tempo", "beats per bar", "the key", "the note value that gets one beat"], a: "beats per bar", e: "The bottom number says which value gets the beat.", d: "easy" },
  { q: "3/4 and 6/8 differ in", o: ["the number of quavers per bar", "the beat grouping — 2+2+2 vs 3+3", "the key signature", "the tempo only"], a: "the beat grouping — 2+2+2 vs 3+3", e: "Simple vs compound — the lilt is the grouping.", d: "medium" },
  { q: "The major scale pattern is", o: ["T-S-T-T-S-T-T", "T-T-S-T-T-T-S", "S-T-T-T-T-T-S", "T-T-T-S-T-T-S"], a: "T-T-S-T-T-T-S", e: "Semitones between 3-4 and 7-8 — C major is the white-key proof.", d: "medium" },
  { q: "A minor triad stacks", o: ["4 then 3 semitones", "3 then 4 semitones", "5 then 5 semitones", "2 then 5 semitones"], a: "3 then 4 semitones", e: "The lowered 3rd flips major to minor — C-E♭-G.", d: "medium" },
  { q: "One unaccompanied melody is", o: ["homophonic", "monophonic", "polyphonic", "binary"], a: "monophonic", e: "One line alone — a bugle call, a solo voice.", d: "easy" },
  { q: "A hymn: melody with chordal accompaniment moving together. Texture?", o: ["monophonic", "homophonic", "polyphonic", "a round"], a: "homophonic", e: "All parts move as one harmonic block.", d: "medium" },
  { q: "A recurring theme returning between contrasting episodes is", o: ["binary form", "ternary form", "rondo form — ABACA", "theme and variations"], a: "rondo form — ABACA", e: "The refrain returns at least twice between episodes.", d: "medium" },
  { q: "A leader's phrase answered by the chorus, over interlocking drum patterns, shows", o: ["call-and-response and polyrhythm", "monophony only", "the I-IV-V progression", "a fugue"], a: "call-and-response and polyrhythm", e: "African tradition devices: structure + texture, answered in element terms.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "music" } });
    if (!topic) throw new Error("master music topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Music — Complete", content: { blocks: MUS_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < MUS_QS.length; i++) {
      const item = MUS_QS[i];
      await prisma.question.upsert({
        where: { id: `master-music-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-music-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "music-rebuild", blocks: MUS_BLOCKS.length, questions: MUS_QS.length });
  } catch (e) {
    console.error("rebuild music failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
