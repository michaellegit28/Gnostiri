import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Arts & Design Topic 4: Design & Technology at the no-exceptions bar:
// the design cycle, briefs and specifications, research, materials,
// manufacturing scales, sustainability, testing and evaluation.

const DT_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The design cycle — a loop, not a line" },
  { type: "definition", term: "Design process", text: "BRIEF (the problem, in the client's words) → RESEARCH (users, existing products, context) → SPECIFICATION (measurable targets) → IDEAS (diverge — many, quick, unjudged) → DEVELOP (converge — refine the best) → PROTOTYPE → MAKE → TEST against the specification → EVALUATE → (loop back: findings change the design). The cycle is ITERATIVE: evaluation feeds the next round — a design that never loops is a design that never improves." },
  { type: "diagram", diagramId: "design-cycle", caption: "Brief to evaluation and back — testing findings feed the next iteration" },
  { type: "example", text: "Worked: a phone stand fails the stability test (it tips) → evaluation says the base is too light → loop back and widen the footprint in development. 'What happens after testing reveals a fault?' — return to development with the finding; that loop IS the process mark." },
  { type: "heading", level: 2, text: "2. Brief and specification — the problem and its rulers" },
  { type: "definition", term: "Specification", text: "The BRIEF states the problem and the client's intent ('a desk lamp for a student'). The SPECIFICATION converts it into MEASURABLE criteria the design will be judged by: aesthetic, cost, size, weight, function, safety, materials, lifespan, maintenance, sustainability. Every criterion should be testable — 'attractive' is not; 'appeals to 14–18 year-olds per survey of 20' is. You design TO the specification and evaluate AGAINST it — the same ruler both ways." },
  { type: "example", text: "Worked: brief → specification: 'costs under 5,000 naira', 'fits a 60 cm desk depth', 'operates one-handed', 'weighs under 800 g'. At evaluation each is a pass/fail check, not a feeling. 'Write two specification points' = specific, measurable, relevant — vagueness is the mark-loser." },
  { type: "heading", level: 2, text: "3. Research — designing from evidence, not assumption" },
  { type: "table", headers: ["Research type", "Method", "What it yields"], rows: [["User research", "Interviews, questionnaires, observation", "Real needs and pain points"], ["Product analysis", "Take apart / compare existing products", "What works, what fails, the gap to exploit"], ["Anthropometrics", "Body measurement data (percentiles)", "Sizes that fit the 5th–95th percentile user"], ["Ergonomics", "Human factors: grip, reach, posture", "Comfort and safety designed in"], ["Materials research", "Properties, costs, availability", "A shortlist with reasons"]] },
  { type: "paragraph", text: "Ergonomics = fitting the product to the human (never the reverse). Anthropometrics uses percentiles so the small and the large are both served — designing for the 'average' excludes real people. 'Why percentiles?' — because averages fit almost nobody at the extremes; the reasoning is the mark." },
  { type: "heading", level: 2, text: "4. Idea generation and development — diverge, then converge" },
  { type: "paragraph", text: "IDEA PHASE: many sketches, annotated, judged against the specification — quantity first, quality later; even failed ideas document thinking. DEVELOPMENT: pick 2–3, model them (card, foam, clay — or CAD), test at low cost, refine proportions and joints, record WHY choices were made. Annotations carry the marks: a sketch without notes is a picture; a sketch with reasons is a design decision." },
  { type: "example", text: "Worked: 8 quick concept sketches, each with two annotated pros/cons; shortlist against the spec; a card model of the best two reveals the thumb-grip fails at scale — refine and record. 'Show how your design developed' = the paper trail of decisions; the WHYs are the marks." },
  { type: "heading", level: 2, text: "5. Materials — properties decide the choice" },
  { type: "table", headers: ["Family", "Examples", "Choose when you need"], rows: [["Woods", "Pine, oak, plywood, MDF", "Warmth, workability, strength-to-cost (plywood: stable, no grain weakness)"], ["Metals", "Mild steel, aluminium, copper", "Strength, conductivity, precision (aluminium: light + corrosion-resistant)"], ["Polymers", "Acrylic, ABS, polythene", "Light weight, colour, mass production (polythene: tough, flexible, cheap)"], ["Composites/textiles", "GRP, cotton, nylon", "Tailored strength or drape"]] },
  { type: "paragraph", text: "Selection = property + justification: 'acrylic for the guard — rigid, transparent, laser-cuttable' beats 'plastic because it is plastic'. Physical properties (strength, hardness, toughness, elasticity), working properties (malleability, ductility, machinability), and the cost/availability context all belong in the answer." },
  { type: "heading", level: 2, text: "6. Manufacturing — the scale sets the method" },
  { type: "definition", term: "Production scales", text: "ONE-OFF (prototype, bespoke — hand tools, skilled labour), BATCH (tens–thousands — jigs and templates, seasonal products), MASS (millions — assembly lines, automation, interchangeable parts), CONTINUOUS (24/7 — steel, cement, chemicals). As volume rises, unit cost falls but tooling cost rises; quality control shifts from craftsman to process. 'Which scale for a school charity badge run?' — batch: jigs pay for themselves at tens-to-thousands, mass tooling does not." },
  { type: "example", text: "Worked: a jig holds the work and guides the tool — every badge hole identical, unskilled assembly viable. That is why batch/mass use jigs: consistency and speed from tooling, not skill. Name the scale + the tooling logic; the logic is the mark." },
  { type: "heading", level: 2, text: "7. Sustainability — the 6Rs and the lifecycle" },
  { type: "definition", term: "6Rs", text: "REDUCE (less material, less energy), REUSE (design for repeated use), RECYCLE (single-polymer parts, marked for sorting), RETHINK (does the product need to exist this way?), REPAIR (fixable joints, spares available), REFUSE (say no to the disposable version). Think the whole LIFECYCLE: raw material → manufacture → transport → use → disposal. The trap: 'recyclable' on the label means nothing if the local system cannot recycle it — design for the REAL end of life." },
  { type: "example", text: "Worked: a bottle of mixed materials (plastic + glued paper + metal spring) cannot be sorted — a single-polymer bottle with a removable paper sleeve can. 'Make it more sustainable' = a named 6R applied to a named part; the specificity is the mark, 'use less plastic' alone is not." },
  { type: "heading", level: 2, text: "8. Testing and evaluation — judge against the ruler you set" },
  { type: "paragraph", text: "TESTING is objective: does the product meet each specification point (destructive tests — to failure; non-destructive — within use)? USER TRIALS put it in real hands and surface the things designers cannot see. EVALUATION answers honestly: which criteria passed, which failed, WHY, and what the NEXT iteration changes. A good evaluation is a to-do list for version two — claiming success without evidence is the classic failure." },
  { type: "example", text: "Worked: spec point 'weighs under 800 g' → scale reads 860 g → FAIL, cause: solid steel base → next iteration: aluminium base, projected 620 g. Criterion → result → cause → change: the four-part chain is the evaluation mark." },
  { type: "heading", level: 2, text: "9. Summary — the design & technology spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Process", "Iterative loop — findings feed back", "A straight line is a failed design story"], ["Specification", "Measurable, testable criteria", "'Attractive' is not a criterion"], ["Research", "Percentiles, ergonomics, product teardown", "Averages exclude the extremes"], ["Materials", "Property + justification for THIS use", "Material without a reason earns half"], ["Manufacturing", "Scale decides tooling and cost", "Jigs buy consistency at batch/mass scale"], ["Evaluation", "Criterion → result → cause → change", "Honest failures score; fake wins do not"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'design' = annotated decisions, reasons visible; 'justify' = property/criterion + evidence; 'evaluate' = against YOUR specification, pass/fail with causes; 'explain' = the mechanism (why jigs, why percentiles). DT papers pay for the REASONING chain — a drawing without annotations is decoration, not design." },
];

const DT_QS: Q[] = [
  { q: "After testing reveals a design fault, the design process says", o: ["start a new project", "return to development — findings feed the next iteration", "ignore it if it looks good", "skip to manufacturing"], a: "return to development — findings feed the next iteration", e: "The cycle is iterative — evaluation exists to drive change.", d: "easy" },
  { q: "A good specification point is", o: ["'looks nice'", "'attractive to teenagers'", "'weighs under 800 g — measurable and testable'", "'modern'"], a: "'weighs under 800 g — measurable and testable'", e: "Every criterion must be judgeable pass/fail at evaluation.", d: "easy" },
  { q: "Anthropometric data uses percentiles rather than averages because", o: ["averages are hard to measure", "designing for the average excludes users at the extremes", "percentiles cost less", "bodies change yearly"], a: "designing for the average excludes users at the extremes", e: "Serve the 5th–95th percentile — the average fits almost nobody at the tails.", d: "medium" },
  { q: "Ergonomics means", o: ["decoration of products", "fitting the product to the human body and its use", "choosing cheap materials", "speed of manufacture"], a: "fitting the product to the human body and its use", e: "Grip, reach, posture — human factors designed in.", d: "easy" },
  { q: "Aluminium is chosen over mild steel for a lightweight outdoor frame because", o: ["it is cheaper", "it is lighter and corrosion-resistant", "it is heavier", "it cannot be cut"], a: "it is lighter and corrosion-resistant", e: "Property + justification — the pairing is the answer.", d: "easy" },
  { q: "A run of 5,000 school badges is best made at which scale, and why?", o: ["one-off — bespoke", "batch — jigs and templates pay off at this volume", "continuous — 24/7 flow", "mass — automotive tooling"], a: "batch — jigs and templates pay off at this volume", e: "Batch: tooling (jigs) buys consistency; mass tooling is unjustified at 5,000.", d: "medium" },
  { q: "A jig is used in batch production to", o: ["decorate the product", "hold and guide the work so every piece is identical", "reduce material cost only", "replace all workers"], a: "hold and guide the work so every piece is identical", e: "Consistency and speed from tooling, not craftsman skill.", d: "medium" },
  { q: "A product made of plastic glued to paper glued to metal foil fails which sustainability test?", o: ["none — mixed materials are ideal", "recyclability — mixed materials cannot be sorted", "strength", "aesthetics"], a: "recyclability — mixed materials cannot be sorted", e: "Design single-polymer, separable parts for the REAL end of life.", d: "medium" },
  { q: "The most complete evaluation answer is", o: ["'it went well'", "'the spec was met'", "criterion → result → cause → the change for the next iteration", "'users liked it'"], a: "criterion → result → cause → the change for the next iteration", e: "Evaluation is a to-do list for version two — evidence chain required.", d: "hard" },
  { q: "Annotation on design sketches exists to", o: ["fill space", "record the reasons behind decisions — the design thinking", "show off drawing skill", "replace the specification"], a: "record the reasons behind decisions — the design thinking", e: "A sketch without notes is a picture; reasons are the marks.", d: "easy" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "design-technology" } });
    if (!topic) throw new Error("master design-technology topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Design & Technology — Complete", content: { blocks: DT_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < DT_QS.length; i++) {
      const item = DT_QS[i];
      await prisma.question.upsert({
        where: { id: `master-designtech-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-designtech-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "designtech-rebuild", blocks: DT_BLOCKS.length, questions: DT_QS.length });
  } catch (e) {
    console.error("rebuild designtech failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
