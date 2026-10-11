import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — PE & Health Topic 1: Physical Education at the no-exceptions bar:
// fitness components, training principles (FITT, overload, specificity),
// heart-rate zones, training methods, skill classification, injury response.

const PE_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Physical fitness — two families of components" },
  { type: "definition", term: "Fitness components", text: "HEALTH-RELATED (every body needs them): cardiovascular endurance (heart/lungs deliver oxygen — the engine), muscular strength (max force once), muscular endurance (repeat force over time), flexibility (range of motion at joints), body composition (lean vs fat ratio). SKILL-RELATED (performance needs them): agility, balance, coordination, power (speed × strength), speed, reaction time. The classification question is the exam's opener: a marathon needs cardio endurance (health); a goalkeeper needs reaction time (skill)." },
  { type: "example", text: "Worked: a long-distance runner's headline component is cardiovascular endurance; a gymnast's is balance and flexibility; a sprinter's is speed and power. 'Name the component being tested' — from the test, not the sport's fame: the bleep test = cardio; sit-and-reach = flexibility." },
  { type: "heading", level: 2, text: "2. Training principles — the rules the body obeys" },
  { type: "definition", term: "FITT and overload", text: "PROGRESSIVE OVERLOAD: the body adapts only to demands slightly ABOVE what it is used to — increase load gradually or training stalls. SPECIFICITY: you get exactly what you train (swimmers swim; marathoners run long — bench presses alone will not build 10 km endurance). REVERSIBILITY: adaptations fade when training stops — 'use it or lose it'. FITT = the dial settings: Frequency (sessions/week), Intensity (how hard — %max HR), Time (duration), Type (mode)." },
  { type: "example", text: "Worked: a runner stuck at 5 km adds a fourth weekly session and extends the long run by 10% — overload via Frequency and Time, applied specifically to running. Doubling everything overnight causes injury, not adaptation: 'progressive' is the load-bearing word." },
  { type: "heading", level: 2, text: "3. Heart rate — the body's effort gauge" },
  { type: "definition", term: "Training zones", text: "MAX HR ≈ 220 − age (a 16-year-old ≈ 204 bpm). RESTING HR: lower with fitness (stronger heart, more blood per beat). TARGET ZONES: moderate ~50–70% of max HR (aerobic base, fat burning), vigorous ~70–85% (cardio fitness gains). Training INSIDE a target zone measures intensity objectively — 'how hard' stops being a feeling and becomes a number." },
  { type: "diagram", diagramId: "training-zones", caption: "Resting to maximum — train the goal's zone: base below 70%, gains up to 85%" },
  { type: "example", text: "Worked: a 16-year-old's vigorous zone = 0.7 × 204 ≈ 143 to 0.85 × 204 ≈ 173 bpm. A falling resting HR over months = the heart pumping more per beat — the measurable proof of adaptation. Compute the zone with the 220−age formula; the arithmetic is the mark." },
  { type: "heading", level: 2, text: "4. Warm-up and cool-down — the non-negotiable bookends" },
  { type: "paragraph", text: "WARM-UP (5–10 min): raises heart rate and temperature gradually, mobilises joints, primes movement patterns — raises PERFORMANCE and lowers injury risk; finish with dynamic movements (leg swings, strides), NOT long static stretches on cold muscle. COOL-DOWN: gradually lower intensity, light static stretching — helps return blood, may ease stiffness. The exam line: warm-up = dynamic preparation; cool-down = static return. Skipping either trades minutes for injury risk." },
  { type: "heading", level: 2, text: "5. Training methods — match the method to the goal" },
  { type: "table", headers: ["Method", "What it is", "Trains"], rows: [["Continuous", "Steady effort, long duration, no rest (30+ min jog)", "Cardiovascular endurance"], ["Interval", "Work bouts with rest periods (8 × 200 m, 90 s rest)", "Speed endurance, recovery ability"], ["Circuit", "Stations rotated — mixed exercises", "General fitness, muscular endurance"], ["Weight/resistance", "Load against muscles, progressive", "Strength, power, hypertrophy"], ["Plyometric", "Explosive jumps and bounds", "Power — the stretch-shortening reflex"], ["Flexibility training", "Static (post-session) and dynamic (in warm-up)", "Range of motion"]] },
  { type: "example", text: "Worked: a 1,500 m runner uses interval sessions (race-pace repeats) INSIDE a continuous aerobic base — specificity stacking. 'Which method for a netball player's agility?' — circuit with change-of-direction stations; method matched to the demand is the mark." },
  { type: "heading", level: 2, text: "6. Skills — classification and practice design" },
  { type: "definition", term: "Skill classification", text: "OPEN skills: environment changes and the performer adapts (netball pass under defenders, surfing). CLOSED skills: fixed, self-paced environment (free throw, gymnastics routine) — practised to a groove. GROSS (large muscles — jumping) vs FINE (small muscles — dart throwing). Practice design: MASSED (long unbroken sessions — skilled, motivated learners) vs DISTRIBUTED (shorter with rests — beginners); WHOLE (skill taught complete — cycling) vs PART (broken into components — pole vault phases)." },
  { type: "example", text: "Worked: a basketball free throw is closed — same distance, no defenders — so groove it with massed practice; match practice is open — vary drills with defenders. Classify first, then choose the practice type: the classification decides the training, not habit." },
  { type: "heading", level: 2, text: "7. Injury — prevention and first response" },
  { type: "table", headers: ["Item", "Meaning", "Action"], rows: [["Sprain", "Ligament stretched/torn (ankle roll)", "R.I.C.E: Rest, Ice, Compression, Elevation"], ["Strain", "Muscle/tendon overworked (pulled hamstring)", "R.I.C.E; no return until pain-free range"], ["Blister/friction", "Skin rub — footwear or grip", "Prevent: proper kit, breaking in"], ["Overuse", "Too much load too soon (shin splints)", "Progressive overload — respect it"], ["Concussion", "Head impact — confusion, headache", "STOP immediately; medical assessment; no same-day return"]] },
  { type: "paragraph", text: "Prevention beats treatment: warm-up, correct technique, right equipment, progressive loads, hydration. The concussion line is absolute: 'if in doubt, sit them out' — no same-day return to play, because a second impact on an injured brain is catastrophic." },
  { type: "heading", level: 2, text: "8. Summary — the PE spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Components", "Health-related vs skill-related", "Cardio is health-related, not skill"], ["Principles", "Overload, specificity, reversibility", "Progressive ≠ sudden; use it or lose it"], ["Zones", "220 − age → % bands", "Compute, don't guess"], ["Methods", "Match method to the fitness goal", "Intervals have REST — that is the design"], ["Skills", "Open/closed decides practice type", "Closed = groove; open = adapt"], ["Injury", "Sprain = ligament; strain = muscle", "Concussion: sit them out"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify the component' = from the TEST or the demand; 'explain' = the mechanism (why overload, why warm up); 'design a session' = FITT named with numbers; 'justify' = goal matched to method. PE papers pay for the PRINCIPLE behind the practice — 'we warm up because we always do' earns nothing; 'gradual cardiovascular ramp raises muscle temperature and prepares the heart' earns the mark." },
];

const PE_QS: Q[] = [
  { q: "Cardiovascular endurance belongs to which component family?", o: ["skill-related", "health-related", "tactical", "genetic"], a: "health-related", e: "Health family: cardio, strength, muscular endurance, flexibility, body composition.", d: "easy" },
  { q: "The sit-and-reach test measures", o: ["agility", "flexibility", "power", "reaction time"], a: "flexibility", e: "Range of motion at joints — the component the test names.", d: "easy" },
  { q: "Progressive overload means", o: ["training the same load forever", "gradually increasing demand slightly above current ability", "maximum effort every session", "random training"], a: "gradually increasing demand slightly above current ability", e: "Adaptation needs a rising, GRADUAL challenge — sudden jumps cause injury.", d: "medium" },
  { q: "A swimmer building 10 km endurance by only heavy bench presses violates", o: ["FITT", "specificity — you adapt to what you train", "reversibility", "overload"], a: "specificity — you adapt to what you train", e: "The adaptation matches the training mode — swim to swim.", d: "medium" },
  { q: "Maximum heart rate for a 16-year-old is approximately", o: ["176 bpm", "204 bpm", "160 bpm", "220 bpm"], a: "204 bpm", e: "220 − 16 = 204 — then zones are percentages of it.", d: "medium" },
  { q: "A proper warm-up ends with", o: ["long static stretches on cold muscle", "dynamic movements — swings, strides, drills", "maximum sprinting", "a cold shower"], a: "dynamic movements — swings, strides, drills", e: "Dynamic preparation raises temperature and primes patterns.", d: "medium" },
  { q: "8 × 200 m runs with 90 s recovery is which method?", o: ["continuous", "interval — work with designed rest", "plyometric", "circuit"], a: "interval — work with designed rest", e: "The rest period IS the method's signature.", d: "easy" },
  { q: "A basketball free throw is best classified as", o: ["an open skill", "a closed skill — fixed, self-paced environment", "a gross tactical skill", "an overuse injury"], a: "a closed skill — fixed, self-paced environment", e: "No defender, same distance — groove it; open skills adapt.", d: "medium" },
  { q: "A rolled ankle with swelling is most likely a", o: ["strain — muscle", "sprain — ligament", "fracture always", "concussion"], a: "sprain — ligament", e: "Sprain = ligament; strain = muscle/tendon. Both get R.I.C.E.", d: "medium" },
  { q: "A player is dizzy and confused after a head clash. The correct response is", o: ["let them run it off", "stop immediately — no same-day return; medical assessment", "give water and continue", "return for the second half"], a: "stop immediately — no same-day return; medical assessment", e: "Concussion protocol: if in doubt, sit them out.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "physical-education" } });
    if (!topic) throw new Error("master physical-education topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Physical Education — Complete", content: { blocks: PE_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < PE_QS.length; i++) {
      const item = PE_QS[i];
      await prisma.question.upsert({
        where: { id: `master-ped-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-ped-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "ped-rebuild", blocks: PE_BLOCKS.length, questions: PE_QS.length });
  } catch (e) {
    console.error("rebuild ped failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
