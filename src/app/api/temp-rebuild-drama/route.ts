import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Arts & Design Topic 3: Drama & Theatre at the no-exceptions bar:
// dramatic structure, elements of drama, genres, conventions, staging,
// acting craft, technical theatre, script analysis, African traditions.

const DRA_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Dramatic structure — the shape of a story on stage" },
  { type: "definition", term: "The arc", text: "EXPOSITION (world and stakes established) → RISING ACTION (complications pile up — conflict intensifies) → CLIMAX (the turning point — highest tension, the decision that cannot be undone) → FALLING ACTION (consequences unfold) → RESOLUTION (new normal, questions answered). The structure exists because CONFLICT is the engine: no conflict, no drama — the exam's first principle." },
  { type: "diagram", diagramId: "dramatic-arc", caption: "Exposition to resolution — tension rises, peaks, and releases" },
  { type: "example", text: "Worked: the family secret is revealed (exposition); letters arrive, threats escalate (rising); the confrontation where everything said cannot be unsaid (climax); alliances collapse (falling); the household settles into a changed truth (resolution). 'Identify the climax' = the irreversible TURN, not the loudest scene." },
  { type: "heading", level: 2, text: "2. The elements of drama — what a play is made of" },
  { type: "table", headers: ["Element", "Meaning", "Exam angle"], rows: [["Plot", "The arranged events — cause and effect", "Story vs plot: plot is the ORDER the playwright chooses"], ["Character", "Their wants, fears, relationships, arcs", "Motivation answers 'why does she do that?'"], ["Theme", "The idea the play argues about", "Stated as a statement, not a topic word"], ["Dialogue", "Spoken text — and its silences", "Subtext: what is meant under what is said"], ["Spectacle", "The visual and aural staging", "Everything the audience SEES and HEARS"], ["Audience", "The live relationship drama needs", "Theatre is incomplete without spectators"]] },
  { type: "paragraph", text: "The distinguishing trait: drama is PERFORMED — a script is a blueprint until actors and audience complete it. Theme must be phrased as an argument ('ambition destroys without restraint'), never as a single word ('ambition' — the classic half-mark answer)." },
  { type: "heading", level: 2, text: "3. Genres — the mood contract with the audience" },
  { type: "definition", term: "Genres", text: "TRAGEDY: a serious protagonist falls through flaw and circumstance — ends in catastrophe, audience purged (catharsis). COMEDY: disorder resolved into harmony — ends in renewal (marriage, reunion), laughter by incongruity. TRAGICOMEDY: serious stakes with comic relief and an unresolved or mixed ending. FARCE: exaggeration, absurd situations, frantic pace — comedy at maximum pressure. MELODRAMA: heightened emotion, clear villains/victims, sensation over subtlety." },
  { type: "example", text: "Worked: a king destroyed by his own suspicion — tragedy (flaw + fall). Twin cases of mistaken identity colliding at a wedding — farce. The genre is read from the ENDING and the treatment: catastrophe vs restoration, subtle vs exaggerated. Name the genre + the evidence line; genre without evidence is a guess." },
  { type: "heading", level: 2, text: "4. Conventions and devices — the playwright's toolkit" },
  { type: "table", headers: ["Device", "What it does", "Effect"], rows: [["Monologue", "One character speaks at length to others", "Reveals the speaker's position publicly"], ["Soliloquy", "Alone, thinking aloud", "Direct access to inner thought"], ["Aside", "Brief remark to the audience, unheard by others", "Dramatic irony — we know more"], ["Dramatic irony", "Audience knows what a character does not", "Tension: we watch the mistake approach"], ["Foreshadowing", "Early hints of what is coming", "Prepares and steers expectation"], ["Flashback", "Scene from the past staged", "Context without exposition dialogue"]] },
  { type: "example", text: "Worked: the audience saw the letter switched (we know); the character reads it aloud confident of its contents (they do not) — dramatic irony, tension built from the knowledge gap. 'How does the playwright create tension here?' = name the device + the knowledge asymmetry; the gap is the mark." },
  { type: "heading", level: 2, text: "5. Staging — the spaces and their politics" },
  { type: "definition", term: "Stage types", text: "PROSCENIUM: the picture-frame stage — audience on one side, illusion at its strongest. THRUST: stage projects into the audience on three sides — intimacy, no full back-wall sets. IN-THE-ROUND: audience on all sides — total intimacy, sightlines rule every move. TRAVERSE: catwalk between two facing banks. Directions are from the ACTOR's view: downstage (toward audience — historically steeper stages), upstage, left/right. Blocking = the planned pattern of movement." },
  { type: "example", text: "Worked: a confessional two-hander suits in-the-round — the audience surrounds the intimacy; a spectacle musical wants proscenium — the frame hides the machinery. 'Why this stage type for this play?' — match sightline/intimacy demands to the space; the matching is the mark." },
  { type: "heading", level: 2, text: "6. Acting craft — building a person from a script" },
  { type: "paragraph", text: "CHARACTERISATION: objective (what the character wants in each scene — playable), motivation (why), obstacle (what blocks), tactic (how they try). Voice: pitch, pace, pause, volume, accent — the pause is where meaning lives. Physicality: posture, gesture, gait chosen from character, not habit. Improvisation builds background the script never states — actors play the subtext, not the line." },
  { type: "example", text: "Worked: the line 'Fine.' — playable as warmth, fury, or defeat; the objective and tactic decide which. 'How would you deliver X and why?' — state the subtext, then the vocal/physical choices that carry it; the choice-with-reason is the mark, the line reading alone is decoration." },
  { type: "heading", level: 2, text: "7. Technical theatre — the visible machine" },
  { type: "table", headers: ["Area", "Job", "Design question"], rows: [["Set", "Location, period, levels and entrances", "What must the space allow the actors to do?"], ["Lighting", "Visibility, mood, time, focus", "Where does the audience LOOK?"], ["Costume", "Character, status, period, transformation", "What does this outfit say before a word?"], ["Sound", "Ambience, effects, music cues", "What does the world sound like off-stage?"], ["Props", "Objects handled by actors", "Personal vs set dressing — who touches it?"]] },
  { type: "paragraph", text: "Design serves the DIRECTOR'S concept: one organising idea that every element obeys. The exam's design question — 'explain how lighting creates atmosphere in this scene' — is answered with the element (intensity, colour, angle) + the effect (isolation, menace, warmth) + the moment it serves." },
  { type: "heading", level: 2, text: "8. Script work — reading like a practitioner" },
  { type: "paragraph", text: "A script analysis pass: WHO wants WHAT (per scene), WHAT blocks it, WHAT changes (turns), WHERE the power shifts. Stage directions vs dialogue: directions are the playwright's instructions (setting, movement, tone) — treat them as evidence, not decoration. Subtext: the meaning UNDER the words — the script says 'sit down', the subtext may be 'surrender' or 'trap'. Read for the gap between saying and meaning." },
  { type: "heading", level: 2, text: "9. African theatre traditions — performance beyond the proscenium" },
  { type: "paragraph", text: "Roots: STORYTELLING with audience participation, MASQUERADE (masked figures embodying spirits or social commentary), ritual and festival performance, dance-drama. Traits the exam expects: communal (audience as participants, not spectators), oral transmission, music and dance integrated rather than added, performance as social function (teaching, judging, celebrating) — not only entertainment. Modern African theatre fuses these roots with scripted, proscenium forms." },
  { type: "example", text: "Worked: a masquerade appearance satirises a corrupt official — entertainment AND social judgement (function). The audience answers the griot's prompts — participation as structure, not decoration. Name the trait AND its social function; function is the mark." },
  { type: "heading", level: 2, text: "10. Summary — the drama spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Structure", "Find the irreversible turn", "Climax ≠ loudest moment — the point of no return"], ["Theme", "State it as an argument", "A topic word is a half-answer"], ["Genre", "Read the ending + treatment", "Farce exaggerates; comedy restores"], ["Devices", "Name it + the knowledge gap created", "Soliloquy is alone; monologue is to others"], ["Staging", "Match space demands to stage type", "Directions are from the ACTOR's view"], ["Performance", "Objective → obstacle → tactic", "Play the subtext, not the punctuation"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify' = the named element, device, or genre; 'explain' = mechanism + effect on the AUDIENCE; 'discuss' = evidence (lines, moments, design choices) tied to claims; 'as a director/designer' = a decision + its intended effect. Drama papers pay for the AUDIENCE EFFECT — what the device does to the watcher is the mark, the definition is only the ticket." },
];

const DRA_QS: Q[] = [
  { q: "The point of no return, where tension peaks and the decisive event happens, is the", o: ["exposition", "rising action", "climax", "resolution"], a: "climax", e: "The irreversible turn — everything after reacts to it.", d: "easy" },
  { q: "Drama differs from other literature because it is", o: ["longer", "performed by actors before an audience", "always fictional", "written in verse"], a: "performed by actors before an audience", e: "The script is a blueprint; performance completes it.", d: "easy" },
  { q: "A theme should be stated as", o: ["a single word", "a statement of the play's argument", "the plot summary", "the genre"], a: "a statement of the play's argument", e: "'Ambition' is a topic; 'unchecked ambition destroys' is a theme.", d: "medium" },
  { q: "A character alone on stage revealing inner thoughts delivers a", o: ["monologue", "soliloquy", "aside", "dialogue"], a: "soliloquy", e: "Alone = soliloquy; to others = monologue; to audience mid-scene = aside.", d: "medium" },
  { q: "The audience knows the letter is forged; the character does not. This is", o: ["foreshadowing", "dramatic irony", "flashback", "farce"], a: "dramatic irony", e: "Tension from the knowledge gap between audience and character.", d: "medium" },
  { q: "A play of exaggerated situations and frantic pace ending in marriage and order is likely", o: ["tragedy", "farce", "melodrama", "tragicomedy"], a: "farce", e: "Maximum-pressure comedy: absurd premise, restoration ending.", d: "medium" },
  { q: "An intimate two-person confessional play best suits", o: ["proscenium staging", "in-the-round staging", "a stadium concert", "traverse only"], a: "in-the-round staging", e: "Audience on all sides surrounds the intimacy — sightlines rule.", d: "medium" },
  { q: "'Downstage' means", o: ["at the back of the stage", "toward the audience", "below stage level", "the actor's right"], a: "toward the audience", e: "From the actor's view — historically, raked stages sloped down to the audience.", d: "medium" },
  { q: "Playing the scene, an actor first identifies the character's", o: ["costume", "objective — what they want in this scene", "stage type", "the playwright's biography"], a: "objective — what they want in this scene", e: "Objective, obstacle, tactic — the playable spine.", d: "medium" },
  { q: "A masked figure satirising a corrupt official in a communal festival performance illustrates", o: ["proscenium spectacle", "African theatre's social function — performance that judges and teaches", "melodrama", "binary form"], a: "African theatre's social function — performance that judges and teaches", e: "Communal, oral, functional — masquerade as commentary.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "drama-theatre" } });
    if (!topic) throw new Error("master drama-theatre topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Drama & Theatre — Complete", content: { blocks: DRA_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < DRA_QS.length; i++) {
      const item = DRA_QS[i];
      await prisma.question.upsert({
        where: { id: `master-drama-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-drama-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "drama-rebuild", blocks: DRA_BLOCKS.length, questions: DRA_QS.length });
  } catch (e) {
    console.error("rebuild drama failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
