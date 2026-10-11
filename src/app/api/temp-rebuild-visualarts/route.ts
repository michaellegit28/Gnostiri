import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Arts & Design Topic 1: Visual Arts at the no-exceptions bar:
// elements of art, colour theory, principles of design, media and techniques,
// perspective, movements, and the analysis method.

const VA_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The elements of art — the vocabulary" },
  { type: "definition", term: "Elements", text: "Seven building blocks every artwork is made of: LINE (a moving point — contour, gesture, implied), SHAPE (2D — geometric or organic), FORM (3D — actual or illusion), COLOUR (hue, value, intensity), TEXTURE (actual or implied surface quality), SPACE (positive/negative, depth), VALUE (light to dark). Analysis begins here: name the elements before anything else — the describe question is pure vocabulary." },
  { type: "example", text: "Worked: a charcoal portrait — heavy contour LINES define the jaw, strong VALUE contrast models the FORM, rough TEXTURE implies age, the dark background flattens SPACE. Name element → what it does: that pairing is the describe mark." },
  { type: "heading", level: 2, text: "2. Colour theory — the wheel is the map" },
  { type: "definition", term: "Colour wheel", text: "PRIMARY: red, yellow, blue — mixable into everything, unmixable themselves. SECONDARY: orange, green, violet (two primaries). TERTIARY: primary + adjacent secondary (red-orange). HARMONIES: COMPLEMENTARY (opposites on the wheel — maximum contrast), ANALOGOUS (neighbours — calm unity), MONOCHROMATIC (one hue, many values), TRIADIC (three evenly spaced — vibrant balance). Warm colours (red/orange/yellow) advance; cool (blue/green/violet) recede." },
  { type: "diagram", diagramId: "color-wheel", caption: "Primaries, secondaries, tertiaries — and the harmony schemes read off the wheel" },
  { type: "example", text: "Worked: a red flower on green leaves — complementary scheme, maximum contrast, the flower advances. A seascape in blues and blue-greens — analogous, calm unity. 'Identify the colour scheme' = locate the hues on the wheel; opposites, neighbours, or one hue decide the answer." },
  { type: "heading", level: 2, text: "3. The principles of design — how elements are organised" },
  { type: "table", headers: ["Principle", "Meaning", "Reads as"], rows: [["Balance", "Visual weight distributed", "Symmetrical, asymmetrical, or radial"], ["Contrast", "Strong differences juxtaposed", "Light/dark, rough/smooth, big/small"], ["Emphasis", "One area dominates — the focal point", "Where your eye lands first"], ["Rhythm / movement", "Repeated elements guide the eye", "Repetition with variation"], ["Proportion", "Size relationships within the work", "Exaggeration is a deliberate tool"], ["Unity / harmony", "Everything belongs together", "Variety WITHIN agreement — not sameness"]] },
  { type: "paragraph", text: "The principles are what you DO with the elements. The exam pairing: element = the ingredient, principle = the recipe move. 'How does the artist create emphasis?' — via contrast in value, or isolation, or placement at a golden-section point — name the mechanism, not just the word." },
  { type: "heading", level: 2, text: "4. Media and techniques — the material decides the method" },
  { type: "table", headers: ["Medium", "Character", "Technique watch-out"], rows: [["Pencil / graphite", "Tonal range via pressure; H hard, B soft", "Hatching, cross-hatching, blending"], ["Charcoal", "Rich blacks, smudgeable, expressive", "Fixative — it never fully 'dries'"], ["Watercolour", "Transparent layers, light through pigment", "Lightest lights RESERVED — white paper is the white"], ["Oil / acrylic", "Opaque, reworkable (oil slow, acrylic fast)", "Fat over lean (oil) — cracking otherwise"], ["Printmaking", "Multiples from a matrix — lino, screen", "Editions numbered; reversed image"], ["Sculpture", "ADDITIVE (clay building) vs SUBTRACTIVE (carving)", "Carving cannot un-cut — planning is absolute"]] },
  { type: "example", text: "Worked: a lino cut prints in REVERSE — lettering must be cut mirrored. Watercolour highlights are the untouched paper, not white paint. 'Name the technique and its implication' — the implication is the mark; technique alone earns half." },
  { type: "heading", level: 2, text: "5. Perspective — making space on a flat surface" },
  { type: "paragraph", text: "LINEAR perspective: ONE-POINT (front-facing — receding lines meet at one vanishing point on the horizon), TWO-POINT (corner-on — two vanishing points). AERIAL/atmospheric perspective: distance loses contrast and detail and cools in colour (mountains fade blue). Overlapping, size diminution and placement (high = far) are the pre-perspective cues still worth naming." },
  { type: "example", text: "Worked: a straight road shrinking to a point at the horizon — one-point linear perspective. Distant hills pale and bluer — aerial perspective. 'How is depth created?' — name the TYPE of perspective and where the vanishing point sits; the location is the marked detail." },
  { type: "heading", level: 2, text: "6. Movements — style is a fingerprint" },
  { type: "table", headers: ["Movement", "Look for", "Key idea"], rows: [["Realism", "Ordinary subjects, faithful detail", "Life as it is — no idealising"], ["Impressionism", "Loose visible strokes, shifting light, outdoor scenes", "The MOMENTARY impression over detail"], ["Cubism", "Fractured forms, multiple viewpoints at once", "Geometry over appearance — Picasso, Braque"], ["Abstract", "No recognizable subject", "Elements and principles as the whole subject"]] },
  { type: "paragraph", text: "Style recognition = name the movement from the visual evidence, then JUSTIFY with the look-for. A work with broken colour and visible dabs of unblended paint is impressionist because of HOW it is painted, not because it is old or pretty. The justification sentence is the mark." },
  { type: "heading", level: 2, text: "7. Analysis — the four-step method" },
  { type: "definition", term: "Feldman's method", text: "DESCRIBE (what do you literally see — elements, facts) → ANALYSE (how are they organised — principles, composition) → INTERPRET (what does it mean — mood, message, context) → JUDGE (how well does it succeed — by its OWN purpose). The order is the discipline: interpretation before description is speculation, not analysis. Every 'discuss this artwork' question is this ladder." },
  { type: "example", text: "Worked: 'a woman in a blue dress stands at a window' (describe) → 'cool dominant hue and her isolation in the left third create emphasis on her stillness' (analyse) → 'the mood is patient longing — waiting' (interpret) → 'the restrained palette serves the quiet subject well' (judge). Four steps, four sentences, full marks." },
  { type: "heading", level: 2, text: "8. Craftsmanship and the portfolio" },
  { type: "paragraph", text: "Craftsmanship: the quality of making — clean edges, considered finishes, no accidental smudges or glue marks. The PORTFOLIO documents the PROCESS: brief, research, preparatory studies, development, final piece, evaluation. The exam values the JOURNEY: a documented line of development beats a polished piece with no evidence of thinking. 'Show your process' is a marking instruction, not a suggestion." },
  { type: "heading", level: 2, text: "9. Summary — the visual arts spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Describe", "Elements named + where they appear", "Description ≠ opinion"], ["Colour scheme", "Locate hues on the wheel", "Opposites complementary, neighbours analogous"], ["Principles", "The move made with the elements", "Emphasis needs its mechanism named"], ["Media", "Material → method → implication", "Print reverses; watercolour reserves the white"], ["Movement", "Look-for + justification", "Style is HOW, not when"], ["Analysis", "Describe → analyse → interpret → judge", "Interpreting before describing is guessing"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'identify' = the named element/principle/scheme; 'describe' = facts of what is seen — no feelings; 'discuss' = the four-step method in order; 'justify' = evidence from the work itself. Visual arts papers pay for EVIDENCE — every claim must point at something in the image." },
];

const VA_QS: Q[] = [
  { q: "Red, yellow and blue are", o: ["secondary colours", "primary colours — they mix into all others", "tertiary colours", "warm colours only"], a: "primary colours — they mix into all others", e: "Primaries cannot be mixed from other hues.", d: "easy" },
  { q: "Red and green side by side form a", o: ["monochromatic scheme", "complementary scheme — opposites, maximum contrast", "analogous scheme", "triadic scheme"], a: "complementary scheme — opposites, maximum contrast", e: "Opposites on the wheel — each intensifies the other.", d: "easy" },
  { q: "Blues and blue-greens together form a", o: ["complementary scheme", "analogous scheme — neighbours, calm unity", "monochromatic scheme", "primary scheme"], a: "analogous scheme — neighbours, calm unity", e: "Adjacent hues share a base — harmony by proximity.", d: "medium" },
  { q: "Shape differs from form because form is", o: ["always geometric", "three-dimensional", "always organic", "a colour property"], a: "three-dimensional", e: "Shape is flat (2D); form has depth (3D).", d: "easy" },
  { q: "The lightest areas in a watercolour painting are usually", o: ["white paint", "the reserved paper", "grey wash", "the darkest layer"], a: "the reserved paper", e: "Watercolour is transparent — the white comes from untouched paper.", d: "medium" },
  { q: "Carving a sculpture from stone is a technique that is", o: ["additive", "subtractive — material removed, cannot be replaced", "printmaking", "mixed media"], a: "subtractive — material removed, cannot be replaced", e: "Clay is additive; carving is subtractive — plan absolutely.", d: "easy" },
  { q: "A road receding to a single vanishing point on the horizon uses", o: ["aerial perspective", "one-point linear perspective", "two-point perspective", "no perspective"], a: "one-point linear perspective", e: "Front-facing subject, one vanishing point — depth by converging lines.", d: "medium" },
  { q: "Distant mountains appearing pale and bluer is", o: ["aerial (atmospheric) perspective", "monochromatic harmony", "symmetrical balance", "cubism"], a: "aerial (atmospheric) perspective", e: "Atmosphere desaturates and cools with distance.", d: "medium" },
  { q: "Broken colour, visible dabs, and shifting outdoor light indicate", o: ["realism", "impressionism", "abstract art", "printmaking"], a: "impressionism", e: "Style is HOW it is painted — the momentary impression over detail.", d: "medium" },
  { q: "The correct order of artwork analysis is", o: ["interpret, describe, judge, analyse", "describe, analyse, interpret, judge", "judge, describe, interpret, analyse", "analyse, judge, describe, interpret"], a: "describe, analyse, interpret, judge", e: "Facts first, organisation second, meaning third, verdict last.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "visual-arts" } });
    if (!topic) throw new Error("master visual-arts topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Visual Arts — Complete", content: { blocks: VA_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < VA_QS.length; i++) {
      const item = VA_QS[i];
      await prisma.question.upsert({
        where: { id: `master-visualarts-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-visualarts-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "visualarts-rebuild", blocks: VA_BLOCKS.length, questions: VA_QS.length });
  } catch (e) {
    console.error("rebuild visualarts failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
