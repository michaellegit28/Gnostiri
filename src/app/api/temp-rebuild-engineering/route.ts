import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Tech/Voc Topic 1: Engineering at the no-exceptions bar:
// forces and loads, levers and moments, machines and MA, materials,
// structures and triangulation, workshop practice and safety, joining, failure.

const ENG_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Engineering — science applied under constraints" },
  { type: "definition", term: "Engineering", text: "Applying science and mathematics to build solutions that WORK within CONSTRAINTS: cost, safety, materials, time, environment. The loop: design → model → test → improve — the same iterative discipline as design & technology, with numbers attached. 'Engineers solve problems' is not the answer — 'engineers solve problems within given constraints' is." },
  { type: "example", text: "Worked: a bridge brief — span 20 m, budget fixed, loads known. The design that is strongest AND cheapest AND safe wins; a perfect bridge that costs triple is a failed design. Name the constraint being balanced — constraint reasoning is the engineering mark." },
  { type: "heading", level: 2, text: "2. Forces and loads — the five ways materials are attacked" },
  { type: "definition", term: "Force types", text: "TENSION (pulling apart — cables, ties), COMPRESSION (squashing — columns, struts), SHEAR (sliding layers — scissors, rivets), BENDING (both at once — beams: top compressed, bottom in tension), TORSION (twisting — drive shafts). STATIC loads are steady; DYNAMIC loads change (impact, vibration) and cause FATIGUE — failure below the normal strength after repeated cycles." },
  { type: "example", text: "Worked: a shelf sagging — bending: its top surface compresses, its underside stretches in tension; that is why shelves crack from the BOTTOM. A rope in a tug-of-war is pure tension. Identify the force from the geometry; the force named with evidence is the mark." },
  { type: "heading", level: 2, text: "3. Levers — three classes, one law" },
  { type: "definition", term: "Levers", text: "A lever turns about a FULCRUM with LOAD and EFFORT applied. Class 1: fulcrum between (see-saw, crowbar). Class 2: load between (wheelbarrow, bottle opener — always force-multipliers). Class 3: effort between (tweezers, fishing rod — always distance-multipliers, sacrifice force for precision and reach). The law: moments balance — EFFORT × effort-arm = LOAD × load-arm (equilibrium)." },
  { type: "diagram", diagramId: "levers", caption: "The three lever classes — where the fulcrum, load and effort sit decides everything" },
  { type: "example", text: "Worked: a wheelbarrow — load 600 N at 0.5 m from the wheel (fulcrum), hands at 1.5 m: effort = 600 × 0.5 ÷ 1.5 = 200 N. The arm RATIO is the mechanical advantage; class 2 multiplies force by construction. 'Which class and why' = position of the effort relative to load and fulcrum." },
  { type: "heading", level: 2, text: "4. Machines — trading distance for force" },
  { type: "definition", term: "Mechanical advantage", text: "MA = load ÷ effort (force multiplier). VELOCITY RATIO = distance moved by effort ÷ distance moved by load. No machine is free: gain force, lose distance — energy in ≥ energy out (efficiency = MA ÷ VR × 100%, below 100% by friction). Pulleys: each supporting rope section shares the load (a 4-section block lifts a 800 N load with ~200 N effort). GEARS: meshed pairs reverse rotation; the ratio is the teeth ratio — a 20-tooth driver into a 40-tooth follower halves speed and doubles torque." },
  { type: "example", text: "Worked: gears 20T → 40T: velocity ratio 2:1 — follower turns at half speed with twice the torque. Why bicycles climb in LOW gear: small front, large rear — force wins on the hill, speed on the flat. Compute the ratio from teeth; the ratio is the answer's spine." },
  { type: "heading", level: 2, text: "5. Materials — properties decide, again" },
  { type: "table", headers: ["Property", "Meaning", "Design implication"], rows: [["Strength", "Resists force without failing", "Load-bearing parts"], ["Stiffness", "Resists bending/stretching", "Precision frames — vs flexible needs"], ["Toughness", "Absorbs impact without cracking", "Hammer heads, guards"], ["Hardness", "Resists surface wear", "Cutting edges, bearings"], ["Corrosion resistance", "Survives the environment", "Outdoor/marine — stainless, aluminium, galvanising"]] },
  { type: "paragraph", text: "Selection = load case + environment + cost. The trap: strong ≠ tough — hardened glass is strong but shatters (low toughness); mild steel is softer but bends before it breaks. Say which property the APPLICATION needs, then name the material that carries it." },
  { type: "heading", level: 2, text: "6. Structures — why everything is triangles" },
  { type: "definition", term: "Triangulation", text: "A rectangle can collapse into a parallelogram (its joints rotate); a triangle CANNOT change shape without a member changing length — triangulation makes rigid frames from pinned joints. STRUTS carry compression, TIES carry tension; trusses arrange them so every member works in its best direction. The roof truss and the bicycle frame are triangles for this exact reason — 'why triangulate?' answers itself in one sentence: triangles are the only inherently rigid polygon." },
  { type: "example", text: "Worked: add a diagonal to a wobbly rectangular gate — the diagonal divides it into two triangles; the frame stops racking. Braces are struts or ties depending on the load direction — name which member takes which force for the mark." },
  { type: "heading", level: 2, text: "7. Workshop practice — safety is a procedure, not an attitude" },
  { type: "table", headers: ["Hazard", "Control", "Discipline"], rows: [["Flying chips/sparks", "Goggles/face shield", "Eye protection BEFORE the machine starts"], ["Rotating parts", "Guards in place, no loose clothing, tie hair", "The guard you remove 'just for a second' is the accident"], ["Sharp tools", "Cut away from the body, sharp tools (dull ones slip)", "A sharp chisel is safer than a blunt one"], ["Noise/dust", "Earmuffs, extraction, masks", "Damage is cumulative and permanent"], ["Lifting", "Bend knees, load close, ask for help", "Your back has no replacement part"]] },
  { type: "paragraph", text: "Work sequence: MEASURE twice → MARK OUT (scriber/pencil, datum lines from an edge) → CUT/shape → CHECK against the drawing → FINISH (deburr, sand, protect). TOLERANCE = the allowed variation ('20 ± 0.5 mm' — 19.5 to 20.5 passes): precision parts only need the tolerance they NEED, no more — tighter costs money." },
  { type: "heading", level: 2, text: "8. Joining — permanent, temporary, and choosing between them" },
  { type: "paragraph", text: "PERMANENT: welding (fuse the parent metal — strongest), brazing (filler below melting point of parent), riveting, adhesives. TEMPORARY: bolts, screws, clips — chosen for MAINTENANCE: anything that will be serviced joins with fasteners. The question 'justify the joint' = service life + loads + disassembly needs. A bolted machine frame exists because motors get replaced." },
  { type: "heading", level: 2, text: "9. Failure and maintenance — how things actually die" },
  { type: "paragraph", text: "FATIGUE: repeated cyclic loads grow micro-cracks until sudden failure — below the material's normal strength (the paperclip bent back and forth). CORROSION: electrochemical eating of metals — prevented by coating, galvanising, or sacrificial anodes. WEAR: surfaces rubbing — lubrication. MAINTENANCE: preventive (scheduled — cheaper) vs corrective (after failure — expensive). 'Why did it fail?' questions want the mechanism: cycles → fatigue; moisture → corrosion; friction → wear." },
  { type: "heading", level: 2, text: "10. Summary — the engineering spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Force type", "Geometry reveals tension/compression/shear", "Bending is BOTH surfaces at once"], ["Lever class", "Position of effort vs load vs fulcrum", "Class 3 trades force for reach — not a mistake"], ["Moments", "Effort × arm = load × arm", "Arms measured from the FULCRUM"], ["Gears/pulleys", "Ratios from teeth or rope sections", "Force gained = distance lost"], ["Materials", "Property the application needs", "Strong ≠ tough"], ["Structures", "Triangles are inherently rigid", "Name strut (compression) vs tie (tension)"], ["Failure", "Cycles, environment, friction", "Fatigue fails below normal strength"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units — no units, no mark; 'explain' = the mechanism (why triangles, why fatigue); 'justify' = the constraint evidence; 'state the class' = positions named. Engineering papers pay for UNITS and MECHANISMS — a right number with wrong units is half marks." },
];

const ENG_QS: Q[] = [
  { q: "A rope in a tug-of-war experiences mainly", o: ["compression", "tension", "torsion", "shear"], a: "tension", e: "Pulling apart — the definition of tension.", d: "easy" },
  { q: "A shelf sags: its top surface is in", o: ["tension", "compression — bending compresses the top, stretches the underside", "shear", "torsion"], a: "compression — bending compresses the top, stretches the underside", e: "Bending attacks both surfaces — cracks start underneath.", d: "medium" },
  { q: "A wheelbarrow is which lever class?", o: ["class 1", "class 2 — load between fulcrum and effort", "class 3", "not a lever"], a: "class 2 — load between fulcrum and effort", e: "Wheel (fulcrum) — bucket (load) — handles (effort): always force-multiplying.", d: "medium" },
  { q: "Load 600 N at 0.5 m from the fulcrum; effort applied at 1.5 m. The effort needed is", o: ["200 N", "600 N", "1,800 N", "1,200 N"], a: "200 N", e: "600 × 0.5 ÷ 1.5 — moments balance about the fulcrum.", d: "hard" },
  { q: "Tweezers multiply force. True or false?", o: ["true", "false — class 3 levers trade force for precision and reach", "true only at the tip", "depends on material"], a: "false — class 3 levers trade force for precision and reach", e: "Effort between fulcrum and load — distance-multipliers by design.", d: "medium" },
  { q: "A 20-tooth gear drives a 40-tooth gear. The follower turns", o: ["twice as fast with half the torque", "at half speed with twice the torque", "at the same speed", "in the same direction"], a: "at half speed with twice the torque", e: "Teeth ratio 2:1 — and meshed gears REVERSE direction.", d: "medium" },
  { q: "The gate keeps racking into a parallelogram. The fix is", o: ["thicker hinges", "a diagonal brace — triangulation makes the frame rigid", "longer screws", "lighter wood"], a: "a diagonal brace — triangulation makes the frame rigid", e: "Triangles cannot distort without a member changing length.", d: "easy" },
  { q: "A paperclip snapped after being bent back and forth. The mechanism is", o: ["corrosion", "fatigue — repeated cycles grow cracks below normal strength", "shear overload", "wear"], a: "fatigue — repeated cycles grow cracks below normal strength", e: "Cyclic loading kills below the strength you would expect.", d: "medium" },
  { q: "'20 ± 0.5 mm' means acceptable parts measure", o: ["exactly 20 mm", "between 19.5 and 20.5 mm", "above 20.5 mm", "20 mm ± 5%"], a: "between 19.5 and 20.5 mm", e: "Tolerance is the allowed variation band.", d: "easy" },
  { q: "A machine frame is bolted rather than welded mainly because", o: ["bolts are cheaper", "it needs maintenance — temporary joints allow disassembly", "welding is weaker always", "bolts look better"], a: "it needs maintenance — temporary joints allow disassembly", e: "Permanent vs temporary is decided by service life.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "engineering" } });
    if (!topic) throw new Error("master engineering topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Engineering — Complete", content: { blocks: ENG_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ENG_QS.length; i++) {
      const item = ENG_QS[i];
      await prisma.question.upsert({
        where: { id: `master-engineering-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-engineering-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "engineering-rebuild", blocks: ENG_BLOCKS.length, questions: ENG_QS.length });
  } catch (e) {
    console.error("rebuild engineering failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
