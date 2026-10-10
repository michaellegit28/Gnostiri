import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 4: Psychology at the no-exceptions bar:
// approaches, learning, memory, development, motivation, personality,
// social psychology, research methods, disorders.

const PSY_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Psychology — the science of mind and behaviour" },
  { type: "definition", term: "Psychology", text: "The SCIENTIFIC study of behaviour and mental processes — evidence and experiment, not intuition. Four goals: DESCRIBE (what happens), EXPLAIN (why), PREDICT (when), and INFLUENCE (how to change it). Psychology ≠ psychiatry: psychiatry is a medical specialism (drugs, diagnosis of illness); psychology is broader — learning, development, cognition, society." },
  { type: "example", text: "Worked: aggression is DESCRIBED as hitting (observable), EXPLAINED by frustration or learning, PREDICTED by provocation history, INFLUENCED by teaching alternatives. Name the goal at each step — 'describe' wants observation, not theory." },
  { type: "heading", level: 2, text: "2. The approaches — six lenses on one mind" },
  { type: "table", headers: ["Approach", "Explains behaviour via", "Key names"], rows: [["Biological", "Brain, genes, hormones", "—"], ["Behavioural", "Learning: association and consequence", "Pavlov, Skinner"], ["Cognitive", "Information processing: attention, memory, thinking", "—"], ["Psychodynamic", "Unconscious drives and early experience", "Freud"], ["Humanistic", "Growth and self-actualisation", "Maslow, Rogers"], ["Sociocultural", "Culture and social context", "—"]] },
  { type: "example", text: "Worked: the same fear of dogs is conditioning (behavioural), a threat-response circuit (biological), a catastrophic thought pattern (cognitive), a buried childhood scare (psychodynamic). 'Which approach explains X via consequences?' — behavioural, Skinner. Match the CLAIM to the LENS; the lens named is the mark." },
  { type: "heading", level: 2, text: "3. Learning — association and consequence" },
  { type: "definition", term: "Classical and operant conditioning", text: "CLASSICAL (Pavlov): learning by ASSOCIATION — a neutral stimulus paired with an unconditioned stimulus (UCS) becomes a conditioned stimulus (CS) producing a conditioned response (CR): bell + food → bell alone → salivation. OPERANT (Skinner): learning by CONSEQUENCE — reinforcement RAISES behaviour, punishment LOWERS it; positive = ADD something, negative = REMOVE something. Observational learning (Bandura): behaviour copied from models." },
  { type: "example", text: "Worked: the seatbelt beeper STOPS when you buckle up — negative reinforcement (removing something unpleasant RAISES the behaviour). Hitting that stops a behaviour is punishment. Negative reinforcement is not punishment — the removal that RAISES behaviour is the trap the exam sets every year." },
  { type: "heading", level: 2, text: "4. Memory — three stores, three failures" },
  { type: "definition", term: "Memory", text: "Encoding → STORAGE → retrieval. Stores: SENSORY (iconic/echoic — under 2 seconds), SHORT-TERM (7±2 items, ~15–30 seconds, held by rehearsal), LONG-TERM (effectively unlimited). Forgetting: DECAY (fades), INTERFERENCE (proactive: OLD disrupts NEW; retroactive: NEW disrupts OLD), RETRIEVAL FAILURE (the memory is stored but the CUE is missing)." },
  { type: "diagram", diagramId: "memory-stages", caption: "Sensory, short-term, long-term — encoding, storage, retrieval" },
  { type: "example", text: "Worked: revise the old password list, then learn the new one, then fail the OLD one — retroactive interference (new disrupts old). Walk into the exam hall and the cue (the room) unlocks the answer — retrieval failure is why context cues matter. Name the FAILURE type; the direction of the interference is the mark." },
  { type: "heading", level: 2, text: "5. Development — Piaget and attachment" },
  { type: "paragraph", text: "Piaget's stages: SENSORIMOTOR (0–2: object permanence arrives), PREOPERATIONAL (2–7: symbols, but egocentric — no conservation), CONCRETE OPERATIONAL (7–11: logic on concrete things — conservation achieved), FORMAL OPERATIONAL (11+: abstract and hypothetical reasoning). Attachment (Bowlby): a critical period for bonding; Ainsworth's strange situation: secure vs insecure attachment — the template for later relationships. Nature and nurture INTERACT — never either alone." },
  { type: "example", text: "Worked: a child who says the taller thin glass holds more water (before conservation) is preoperational; one who conserves is concrete operational. The STAGE is diagnosed by the TASK failed — conservation and object permanence are the two the exam names." },
  { type: "heading", level: 2, text: "6. Motivation and emotion — the hierarchy" },
  { type: "definition", term: "Maslow's hierarchy", text: "Needs stack: PHYSIOLOGICAL (food, water) → SAFETY → BELONGING → ESTEEM → SELF-ACTUALISATION — lower needs generally satisfied before higher ones activate. Motivation: INTRINSIC (from the activity itself) vs EXTRINSIC (from reward or punishment) — the trap: extrinsic rewards can UNDERMINE intrinsic motivation (pay a child to draw and the drawing stops being play)." },
  { type: "example", text: "Worked: a starving student studies for a meal voucher (extrinsic, physiological); a curious one studies for the joy of it (intrinsic). Over-reward the first and the joy route closes. The UNDERMINING effect is the named trap, not just the two types." },
  { type: "heading", level: 2, text: "7. Personality — traits and the id" },
  { type: "paragraph", text: "TRAIT theory: the Big Five (OCEAN — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism), measured by inventories. Freud's structure: ID (instinct, pleasure principle), EGO (reality principle — the mediator), SUPEREGO (conscience, moral principle). Projective tests (Rorschach inkblots) probe the unconscious; inventories measure conscious traits. The assessment pairs with the theory — projective for psychodynamic, inventory for traits." },
  { type: "heading", level: 2, text: "8. Social psychology — conformity, obedience, attribution" },
  { type: "definition", term: "Conformity and obedience", text: "CONFORMITY (Asch): matching the group's wrong answer under social pressure — the line experiment. OBEDIENCE (Milgram): following AUTHORITY against conscience — 65% went to maximum shock under instruction. ATTITUDES have three components: cognitive (belief), affective (feeling), behavioural (action). ATTRIBUTION: dispositional (their character) vs situational (their circumstances) — the FUNDAMENTAL ATTRIBUTION ERROR over-credits character and under-credits situation." },
  { type: "example", text: "Worked: you call a latecomer 'lazy' (dispositional) though their bus failed (situational) — the fundamental attribution error in one line. Asch = peer pressure; Milgram = authority: name the STUDY with the CONCEPT — the pairing is the mark." },
  { type: "heading", level: 2, text: "9. Research methods and ethics — the evidence machine" },
  { type: "table", headers: ["Method", "Strength", "Weakness / trap"], rows: [["Experiment", "Causality — IV manipulated, DV measured, control group", "Artificial settings; ethics limits"], ["Correlational", "Real-world association between variables", "Correlation is NOT causation"], ["Case study", "Depth — one person in full", "Cannot generalise"], ["Survey", "Breadth, attitudes at scale", "Shallow; response bias"]] },
  { type: "paragraph", text: "Ethics: informed CONSENT, the right to WITHDRAW, DECEPTION only with strong justification plus DEBRIEFING, CONFIDENTIALITY, protection from HARM. Milgram and Asch both deceived — the debriefing was the repair. 'Why can a correlation not prove causation?' — the third variable may drive both; the reasoning is the mark." },
  { type: "heading", level: 2, text: "10. Disorders and treatment — the biopsychosocial model" },
  { type: "paragraph", text: "Disorders group into ANXIETY (phobias, panic), MOOD (depression, bipolar), PSYCHOTIC (schizophrenia — loss of touch with reality). Treatment: PSYCHOLOGICAL (CBT — restructuring thoughts and behaviour), BIOLOGICAL (medication), SOCIAL (support, housing) — the BIOPSYCHOSOCIAL model combines all three. Diagnosis describes; the model explains: one disorder, three interacting causes." },
  { type: "heading", level: 2, text: "11. Summary — the psychology spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Approaches", "Match the claim to the lens", "Skinner = consequences; Freud = unconscious"], ["Learning", "Conditioning type by the mechanism", "Negative reinforcement RAISES behaviour"], ["Memory", "Name the failure type + direction", "Retroactive: new disrupts old"], ["Development", "Stage by the task failed", "Conservation marks concrete operations"], ["Motivation", "Intrinsic vs extrinsic", "Rewards can undermine intrinsic drive"], ["Social", "Study with the concept", "Asch = conformity; Milgram = obedience"], ["Methods", "Experiment = causality; correlation ≠ cause", "The third variable"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify' = the single named concept; 'explain' = the mechanism; 'evaluate' = strength AND weakness of the study or theory; 'with reference to' = the named study, used precisely. Psychology papers pay for the STUDY attached to the claim — a concept name without its evidence earns half." },
];

const PSY_QS: Q[] = [
  { q: "Psychology is best defined as the scientific study of", o: ["the mind only", "behaviour and mental processes", "mental illness only", "the brain only"], a: "behaviour and mental processes", e: "Observable behaviour plus internal processes — studied scientifically.", d: "easy" },
  { q: "Learning by consequence (reinforcement and punishment) belongs to", o: ["classical conditioning", "operant conditioning — Skinner", "psychodynamic theory", "humanistic theory"], a: "operant conditioning — Skinner", e: "Skinner = consequences; Pavlov = association.", d: "easy" },
  { q: "A beeper that stops when you buckle up is", o: ["positive reinforcement", "negative reinforcement — removing something unpleasant raises the behaviour", "punishment", "extinction"], a: "negative reinforcement — removing something unpleasant raises the behaviour", e: "Removal that RAISES behaviour — not punishment.", d: "medium" },
  { q: "You learn a new password and can no longer recall the old one. This is", o: ["proactive interference", "retroactive interference — new learning disrupts old", "decay", "retrieval failure"], a: "retroactive interference — new learning disrupts old", e: "Retroactive: NEW disrupts OLD; proactive the reverse.", d: "medium" },
  { q: "A child who cannot conserve volume is in which Piagetian stage?", o: ["sensorimotor", "preoperational", "concrete operational", "formal operational"], a: "preoperational", e: "Conservation arrives with concrete operations (7–11).", d: "medium" },
  { q: "Paying a child to draw and watching the free drawing stop illustrates", o: ["intrinsic motivation", "extrinsic rewards undermining intrinsic motivation", "negative reinforcement", "observational learning"], a: "extrinsic rewards undermining intrinsic motivation", e: "The named trap — reward converts play into work.", d: "hard" },
  { q: "Milgram's experiment demonstrated", o: ["conformity to peers", "obedience to authority", "the bystander effect", "learned helplessness"], a: "obedience to authority", e: "Asch = peers; Milgram = authority. Name the pairing.", d: "medium" },
  { q: "Calling a latecomer lazy when their bus failed is", o: ["situational attribution", "the fundamental attribution error — over-crediting character", "cognitive dissonance", "a self-serving bias"], a: "the fundamental attribution error — over-crediting character", e: "Dispositional credited, situational ignored.", d: "medium" },
  { q: "A correlation between two variables cannot prove causation because", o: ["correlations are always weak", "a third variable may drive both", "experiments are better funded", "samples are too small"], a: "a third variable may drive both", e: "Association without manipulation — the reasoning is the mark.", d: "hard" },
  { q: "Deception in psychological research is acceptable only when", o: ["never under any circumstance", "justified and followed by a full debriefing", "the sample is large", "the result is published"], a: "justified and followed by a full debriefing", e: "Milgram's repair: consent, withdrawal, debriefing, harm limits.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "psychology" } });
    if (!topic) throw new Error("master psychology topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("psychology standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Psychology — Complete", content: { blocks: PSY_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < PSY_QS.length; i++) {
      const item = PSY_QS[i];
      await prisma.question.upsert({
        where: { id: `master-psychology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-psychology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "psychology-rebuild", blocks: PSY_BLOCKS.length, questions: PSY_QS.length });
  } catch (e) {
    console.error("rebuild psychology failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
