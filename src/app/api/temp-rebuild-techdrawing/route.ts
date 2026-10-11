import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Tech/Voc Topic 4: Technical Drawing / EGD at the no-exceptions bar:
// equipment and line types, orthographic projection (first/third angle),
// pictorial views, dimensioning, sectioning, scales, CAD.

const TD_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Technical drawing — the universal language of making" },
  { type: "definition", term: "Purpose", text: "A drawing communicates EXACTLY what to build — dimensions, shape, material, finish — to someone who will never meet the designer. That is why standards exist (SANS/ISO): a line type or symbol means the SAME thing in Lagos, Nairobi or London. Drawing is a language: line types are its alphabet, views its grammar, dimensioning its numbers — and sloppy grammar builds wrong parts." },
  { type: "example", text: "Worked: a workshop in one city builds from a drawing made in another — no phone call, no questions. That only works because every dashed line means 'hidden edge' everywhere. 'Why standards?' — unambiguous communication across makers; that sentence is the mark." },
  { type: "heading", level: 2, text: "2. Equipment and pencil grades" },
  { type: "table", headers: ["Tool", "Job", "Discipline"], rows: [["T-square + board", "Horizontal reference lines", "Head against the board edge, ALWAYS"], ["Set squares (45°, 30/60°)", "Vertical + standard angles", "Slide along the T-square blade"], ["Compass", "Circles and arcs", "Needle in the centre mark, tilt consistently"], ["Protractor", "Angle measurement", "Vertex on the point, baseline on the line"], ["Pencils H/2H (hard)", "Light construction lines", "Hard grades for guides you will erase"], ["Pencils HB/2B (soft)", "Final outlines, shading", "Soft grades for lines that STAY"]] },
  { type: "paragraph", text: "Construction first, outline second: build the whole view in light hard-grade lines, check it, then firm up the final lines soft-grade. Drawing without light construction is like bricklaying without a string line — confident and wrong." },
  { type: "heading", level: 2, text: "3. Line types — the alphabet" },
  { type: "table", headers: ["Line", "Meaning", "Used for"], rows: [["Continuous THICK", "Visible edge", "Outlines you can see"], ["Continuous THIN", "Precise but not an edge", "Dimension and projection lines"], ["Dashed (short dashes)", "HIDDEN edge", "Edges behind surfaces"], ["Chain thin (long-dash-dot)", "CENTRE line", "Axes of circles and symmetry"], ["Chain thick at ends + thin", "CUTTING plane", "Where a section is taken"], ["Wavy continuous thin", "BREAK line", "Shortened long parts"]] },
  { type: "example", text: "Worked: a drilled blind hole shows a circle (visible edge, thick) with a chain centre line through it, and the un-drilled depth as dashed lines. Read the alphabet: thick = real, dashed = hidden, chain = centre. Line-type identification is free marks — learn the six." },
  { type: "heading", level: 2, text: "4. Orthographic projection — the heart of the subject" },
  { type: "definition", term: "Orthographic", text: "A 3D object flattened into 2D VIEWS, each projected at right angles: FRONT (the most informative face), TOP (plan), and one SIDE (end). The views must ALIGN: the top view sits directly above/below the front (shares WIDTH), the side shares HEIGHT with the front and DEPTH with the top. FIRST ANGLE (Europe/Africa): the view is placed on the side you look FROM — the top view goes BELOW the front. THIRD ANGLE (US): view placed on the side you look TOWARD — top goes ABOVE. The projection symbol in the title block declares which." },
  { type: "diagram", diagramId: "orthographic", caption: "One object, three aligned views — front, top and side share edges" },
  { type: "example", text: "Worked: a step block — front shows the L-profile, the top shows the step's width and depth, the side confirms heights. Each view alone is incomplete; ALIGNED together they define the object exactly. 'Why three views?' — two leave ambiguity (depth vs height); the third resolves it." },
  { type: "heading", level: 2, text: "5. Pictorial views — 3D on flat paper" },
  { type: "definition", term: "Isometric", text: "ISOMETRIC: the three axes at 120° apart (drawn with the vertical + two at 30° from horizontal) — a true-looking 3D sketch where all edges keep proportion. OBLIQUE: front face drawn true shape, depth lines receding at an angle (usually 45°) — easier when the front is the interesting face. Pictorial views COMMUNICATE; orthographic views DEFINE — drawings pair them: isometric for understanding, orthographic for manufacturing." },
  { type: "example", text: "Worked: the same step block in isometric shows all three directions at once — instantly readable, awkward to dimension. The orthographic set is dull to read but exact to build from. 'Which view would you give the builder?' — orthographic; 'which for the client?' — pictorial; the pairing is the mark." },
  { type: "heading", level: 2, text: "6. Dimensioning — the rules that keep it unambiguous" },
  { type: "definition", term: "Dimensioning", text: "Each dimension appears ONCE only; place it on the view that shows the feature best; dimension lines sit OUTSIDE the view where possible with THIN lines and neat arrowheads; never dimension to a hidden (dashed) line; never over-dimension (a duplicate contradicts itself). Units are millimetres by default — written once in the title block, not on every number. Figure: 25 not '25 mm'." },
  { type: "example", text: "Worked: a plate 60 × 40 with a hole — width and length on the top view, hole diameter led by the symbol ⌀ once, positioned from TWO edges (so the machinist can locate it). 'Why locate from two edges?' — position needs two coordinates; one leaves it sliding along the plate." },
  { type: "heading", level: 2, text: "7. Sectioning — seeing inside" },
  { type: "paragraph", text: "A SECTION view shows the object as CUT by a plane (declared by the chain cutting-plane line with arrows showing the viewing direction). Cut surfaces are HATCHED (thin parallel lines at 45°, evenly spaced — different parts hatched in opposite directions). Hidden dashed lines are OMITTED inside a section — the whole point is to reveal what dashes would clutter. Sections turn invisible interiors into readable faces." },
  { type: "example", text: "Worked: a hollow pipe in orthographic needs dashed inner walls; sectioned through its axis, the walls become two hatched rectangles — instantly measurable. 'Why section instead of dashed lines?' — clarity; dashes on dashes is unreadable. State the purpose, not just the procedure." },
  { type: "heading", level: 2, text: "8. Scales — drawing big and small honestly" },
  { type: "definition", term: "Scale", text: "FULL SIZE 1:1 — drawing equals object. REDUCTION 1:2 — drawing is HALF the object (a 2 m beam draws at 1 m; every dimension still READS the true size). ENLARGEMENT 2:1 — drawing is TWICE the object (a watch gear). The scale is declared in the title block; dimensions on the drawing are ALWAYS true size regardless of scale — you measure the DRAWING for checking, but you quote the NUMBERS." },
  { type: "example", text: "Worked: a 3 m door at 1:10 draws at 300 mm, but its dimension line reads '3000'. The scale shrinks the DRAWING, never the NUMBER. 'How long does a 2.5 m wall draw at 1:50?' — 50 mm. Convert via the ratio; quote true size always." },
  { type: "heading", level: 2, text: "9. CAD — the modern board" },
  { type: "table", headers: ["CAD advantage", "Why it matters", "Board equivalent"], rows: [["Edit without redrawing", "Change one dimension, views update", "Full redraw by hand"], ["Layers", "Dimensions, hatch, outline separate", "Overlaid tracing sheets"], ["Libraries/blocks", "Standard symbols reused", "Plastic templates"], ["Accuracy + units", "Exact coordinates, no scaling drift", "Sharp pencil and hope"], ["Sharing/plotting", "One file, any scale print", "One original, couriered"]] },
  { type: "paragraph", text: "CAD does not remove the KNOWLEDGE: the software will happily draw an impossible projection or a double-dimensioned view — the draughtsperson still needs first/third angle, line types and dimensioning rules. CAD is a faster pencil, not a replacement for the language." },
  { type: "heading", level: 2, text: "10. Summary — the technical drawing spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Line types", "Six lines, meanings memorised", "Dashed = hidden, chain = centre"], ["Views", "Front + top + side, ALIGNED", "Width shared by front/top; height by front/side"], ["First vs third angle", "View lands on the side you look FROM (1st) / TOWARD (3rd)", "Read the symbol in the title block"], ["Isometric", "30° axes, proportional edges", "Pictorial communicates; orthographic defines"], ["Dimensioning", "Once, outside, never to hidden lines", "True size always — scale affects the drawing only"], ["Sections", "Cut plane, hatch cut faces, drop the dashes", "Hatching = cut MATERIAL only"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'draw in good proportion' = light construction lines first; 'project' = shared edges aligned exactly; 'dimension fully' = once, best view, outside; 'state the scale' = ratio + meaning. Technical drawing papers pay for ALIGNMENT and CONVENTION — a beautiful drawing with broken rules is a failed drawing." },
];

const TD_QS: Q[] = [
  { q: "A dashed line on a technical drawing means", o: ["a centre line", "a hidden edge", "a cutting plane", "a dimension"], a: "a hidden edge", e: "Thick = visible, dashed = hidden, chain = centre.", d: "easy" },
  { q: "In orthographic projection, the top view shares its", o: ["height with the front view", "width with the front view", "depth with the front view", "nothing — views are independent"], a: "width with the front view", e: "Front/top share width; front/side share height.", d: "medium" },
  { q: "In FIRST-angle projection, the top view is placed", o: ["above the front view", "below the front view", "to the right", "anywhere"], a: "below the front view", e: "First angle: the view lands on the side you look FROM.", d: "hard" },
  { q: "Isometric axes are drawn at", o: ["45° and 45°", "30°, 30° from horizontal with a vertical", "90° only", "60° and 15°"], a: "30°, 30° from horizontal with a vertical", e: "Three directions, 120° apart — the classic pictorial.", d: "easy" },
  { q: "A dimension should never be", o: ["written in mm", "placed outside the view", "repeated or duplicated", "read from the left"], a: "repeated or duplicated", e: "Each dimension once — duplicates contradict themselves.", d: "medium" },
  { q: "A wall 2.5 m drawn at 1:50 measures on paper", o: ["5 cm (50 mm)", "25 cm", "2.5 m", "12.5 cm"], a: "5 cm (50 mm)", e: "1:50 halves each metre to 2 cm — 2.5 m → 50 mm.", d: "hard" },
  { q: "On a drawing at 1:2, a dimension line reads", o: ["half the true size", "the TRUE size — scale shrinks the drawing, never the number", "double the true size", "no number is written"], a: "the TRUE size — scale shrinks the drawing, never the number", e: "Dimensions quote what to BUILD, not what was drawn.", d: "medium" },
  { q: "Hatching (45° thin lines) indicates", o: ["a hidden edge", "cut material in a section view", "a centre axis", "a welding surface"], a: "cut material in a section view", e: "Only surfaces the cutting plane slices through are hatched.", d: "medium" },
  { q: "Hidden dashed lines are omitted inside a section view because", o: ["they are illegal", "the section already reveals the interior — dashes would clutter", "CAD deletes them", "they are drawn thicker"], a: "the section already reveals the interior — dashes would clutter", e: "Clarity is the entire purpose of sectioning.", d: "medium" },
  { q: "The draughtsperson still needs projection and dimensioning rules when using CAD because", o: ["CAD refuses bad drawings", "software draws fast but cannot judge convention — it is a faster pencil, not a brain", "CAD cannot dimension", "standards do not apply to CAD"], a: "software draws fast but cannot judge convention — it is a faster pencil, not a brain", e: "The language knowledge is the professional; the tool is just speed.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "technical-drawing-egd" } });
    if (!topic) throw new Error("master technical-drawing-egd topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Technical Drawing / EGD — Complete", content: { blocks: TD_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < TD_QS.length; i++) {
      const item = TD_QS[i];
      await prisma.question.upsert({
        where: { id: `master-techdrawing-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-techdrawing-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "techdrawing-rebuild", blocks: TD_BLOCKS.length, questions: TD_QS.length });
  } catch (e) {
    console.error("rebuild techdrawing failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
