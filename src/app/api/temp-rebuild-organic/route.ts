import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 5: Organic Chemistry at the no-exceptions bar:
// nomenclature, families, reactions, polymers, isomers, tests.

const ORG_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Carbon's superpower — the homologous series" },
  { type: "paragraph", text: "Carbon bonds to itself in chains, branches, and rings (catenation) with single, double, or triple bonds — a handful of atoms builds millions of compounds. Families (homologous series) share a functional group that dictates their chemistry: same general formula, properties that drift gradually with chain length (melting and boiling points rise as molecules grow heavier), and the same reactions whatever the size." },
  { type: "table", headers: ["Family", "Functional group", "General formula", "Example"], rows: [["Alkanes", "C–C single only", "CnH2n+2", "Methane CH₄, ethane C₂H₆"], ["Alkenes", "C=C double", "CnH2n", "Ethene C₂H₄"], ["Alcohols", "–OH", "CnH2n+1OH", "Ethanol C₂H₅OH"], ["Carboxylic acids", "–COOH", "CnH2n+1COOH", "Ethanoic acid CH₃COOH"], ["Esters", "–COO–", "—", "Ethyl ethanoate"]] },
  { type: "heading", level: 2, text: "2. Nomenclature — naming by the rules" },
  { type: "paragraph", text: "IUPAC names are built, not memorised: 1) find the LONGEST carbon chain (the stem: meth-, eth-, prop-, but-); 2) number from the end nearest the first branch or functional group; 3) name branches/positions with numbers; 4) the functional group's suffix names the family (-ane, -ene, -ol, -oic acid)." },
  { type: "example", text: "Worked: a 4-carbon chain with a methyl group on the second carbon = 2-methylbutane (not 3-methylbutane — number from the nearest end). A 3-carbon chain with –OH on carbon 2 = propan-2-ol; on carbon 1 = propan-1-ol. A double bond between carbons 1 and 2 of a butane chain = but-1-ene. Draw the structure, count, number, name — method marks at every step." },
  { type: "heading", level: 2, text: "3. Alkanes — saturated fuels" },
  { type: "paragraph", text: "All single bonds (saturated), so alkanes are comparatively unreactive — but they burn beautifully. Complete combustion (plenty of oxygen): CH₄ + 2O₂ → CO₂ + 2H₂O, blue flame, maximum energy. Incomplete (oxygen-limited): 2CH₄ + 3O₂ → 2CO + 4H₂O (or carbon/soot) — yellow flame, less energy, and deadly carbon monoxide that binds haemoglobin where oxygen should go. Balancing combustion equations is a guaranteed exam skill: balance C, then H, then O last." },
  { type: "paragraph", text: "Cracking answers the demand gap: long fractions are abundant but useless; petrol and alkenes are scarce but needed. Heat + catalyst (or steam) splits long chains: C₁₀H₂₂ → C₈H₁₈ + C₂H₄ (decane → octane + ethene) — one alkane becomes a smaller alkane PLUS an alkene. The alkene product is why cracking feeds the polymer industry; the test for success is bromine water turning colourless." },
  { type: "callout", variant: "warning", text: "Exam trap: incomplete combustion makes carbon monoxide — odourless, binds haemoglobin 200× stronger than oxygen, kills silently. Every fuel-safety question wants CO named, with the haemoglobin mechanism for full marks." },
  { type: "heading", level: 2, text: "4. Alkenes — the reactive family" },
  { type: "paragraph", text: "The C=C double bond is electron-rich and opens to ADDITION reactions: bromine water (orange → colourless — the unsaturation test), hydrogen (H₂ over nickel → alkane; margarine's hardening), steam (H₂O over catalyst → alcohol; industrial ethanol), and to each other (polymerisation, below). The test's reasoning earns the mark: the double bond's electrons attack Br₂, adding one bromine to each carbon — the colour disappears because the bromine is consumed. Alkanes have no double bond, so the orange stays." },
  { type: "heading", level: 2, text: "5. Alcohols — two roads to ethanol" },
  { type: "table", headers: ["Route", "Method", "Trade-offs"], rows: [["Fermentation", "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ — yeast, warm (~35 °C), anaerobic", "Renewable (sugar crops), slow, batch, max ~15% — ethanol toxicity kills the yeast"], ["Hydration of ethene", "C₂H₄ + H₂O (steam) over phosphoric acid catalyst", "Fast, continuous, pure — but ethene comes from cracked crude oil"]] },
  { type: "paragraph", text: "The comparison is the essay: renewable vs fossil, batch vs continuous, pure vs needing distillation. Ethanol oxidises to ethanoic acid (vinegar) on standing in air — wine left open turns sour; breathalysers measure the same oxidation in exhaled vapour (orange dichromate → green)." },
  { type: "example", text: "Required practical — fermentation + distillation: sugar solution + yeast in a stoppered flask (airlock lets CO₂ out, keeps air in? no — keeps AIR out; the lock vents gas without letting oxygen in), warm 35 °C for days, then fractional distillation purifies the ethanol (b.p. 78 °C vs water's 100 °C). State why the temperature is 35 °C: enzyme kinetics — yeast's enzymes denature above ~40 °C and work too slowly below." },
  { type: "heading", level: 2, text: "6. Carboxylic acids and esters" },
  { type: "paragraph", text: "The –COOH group is a WEAK acid: partially ionised in water (ethanoic acid pH ~3 vs hydrochloric ~1 at the same concentration) — still reacts with metals (H₂), carbonates (CO₂), and bases, but gentler. Esters form from alcohol + carboxylic acid with a catalyst: CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O — sweet-smelling, in perfumes and flavourings. Naming: the acid supplies the first part (ethanoate), the alcohol the second (ethyl) — ethyl ethanoate. Draw the ester link (–COO–) for the method mark." },
  { type: "heading", level: 2, text: "7. Polymers — thousands joined" },
  { type: "paragraph", text: "Addition polymerisation: the C=C double bond opens and thousands of monomers join into one chain — ethene → poly(ethene); propene → poly(propene); chloroethene → PVC. The repeat unit sits in square brackets with an n (the n matters: it says 'many'). Properties follow the chain: long chains entangle (tough), side groups change flexibility and melting." },
  { type: "paragraph", text: "Disposal is the honest problem: addition polymers are inert and non-biodegradable — they persist for centuries. Answers weigh three routes: recycling (melting and remoulding — sorting is the cost), incineration (energy recovery — but CO₂ and toxics), biodegradable alternatives (starch-based plastics — weaker in use). 'Plastics are bad' earns nothing; 'inert because of strong C–C and C–H bonds throughout the chain, hence non-biodegradable; mitigated by X' earns the marks." },
  { type: "heading", level: 2, text: "8. Isomerism — same formula, different shape" },
  { type: "table", headers: ["Type", "Definition", "Worked case"], rows: [["Chain", "Different carbon skeletons", "C₅H₁₂ has 3: pentane, 2-methylbutane, 2,2-dimethylpropane"], ["Position", "Same skeleton, group elsewhere", "but-1-ene vs but-2-ene; propan-1-ol vs propan-2-ol"], ["Functional", "Same atoms, different family", "C₃H₆O: propanal (aldehyde) vs propanone (ketone)"]] },
  { type: "paragraph", text: "Isomers differ in properties: branching lowers boiling points (chains pack less tightly — weaker dispersion forces). The exam skill is DRAWING them systematically: fix the chain, move the branch, count that none repeat. C₄H₁₀ has 2 (butane, methylpropane); C₅H₁₂ has 3; C₆H₁₄ has 5 — the ladder is worth memorising." },
  { type: "heading", level: 2, text: "9. Qualitative analysis — one unknown, three tests" },
  { type: "table", headers: ["Test", "Result", "Conclusion"], rows: [["Bromine water", "Orange → colourless", "C=C present: an alkene"], ["Universal indicator", "pH ~3 red-orange", "Weak acid: carboxylic"], ["Burn on a watch glass", "Blue flame, no soot", "Complete combustion — short clean chain"], ["Litmus + magnesium", "Red litmus; H₂ bubbles", "Acid — reacts like other acids but weaker"]] },
  { type: "paragraph", text: "The exam skill is the SEQUENCE: test unsaturation first (bromine water), then acidity, then combustion character. Each test's chemistry is the reason: bromine adds across C=C; weak acids partially ionise; soot means incomplete combustion from long or oxygen-starved burning." },
  { type: "heading", level: 2, text: "10. Summary — the family map" },
  { type: "table", headers: ["Reaction", "Family", "Reagent → product"], rows: [["Combustion", "Alkanes", "O₂ → CO₂ + H₂O (complete)"], ["Addition", "Alkenes", "Br₂/H₂/H₂O → dibromo/alkane/alcohol"], ["Oxidation", "Alcohols", "O₂ → ethanoic acid"], ["Esterification", "Acid + alcohol", "→ ester + water"], ["Polymerisation", "Alkenes", "→ poly(alkene)"], ["Cracking", "Long alkanes", "→ smaller alkane + alkene"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'name' follows the four IUPAC steps; 'draw the repeat unit' needs brackets + n; 'explain the test' names the bond attacked; 'discuss disposal' weighs two routes with a judgment. Organic papers reward systematic method, not memorised answers." },
];

const ORG_QS: Q[] = [
  { q: "A 4-carbon chain with a methyl branch on carbon 2 is named", o: ["3-methylbutane", "2-methylbutane", "methylbutan-2-ane", "butylmethane"], a: "2-methylbutane", e: "Number from the nearest end — lowest position wins.", d: "easy" },
  { q: "Bromine water turns colourless with", o: ["alkanes", "alkenes — addition across the C=C", "water", "ethanoic acid"], a: "alkenes — addition across the C=C", e: "The double bond's electrons consume Br₂.", d: "easy" },
  { q: "Incomplete combustion of methane can produce", o: ["only CO₂", "carbon monoxide — binding haemoglobin where oxygen should", "hydrogen", "no products"], a: "carbon monoxide — binding haemoglobin where oxygen should", e: "Yellow flame, less energy, silent killer.", d: "easy" },
  { q: "Cracking decane C₁₀H₂₂ can give", o: ["octane + ethene", "ethane only", "methane + CO₂", "poly(ethene)"], a: "octane + ethene", e: "One alkane → smaller alkane PLUS alkene — feeding polymers.", d: "medium" },
  { q: "Fermentation stops at ~15% ethanol because", o: ["sugar runs out", "ethanol toxicity kills the yeast", "CO₂ blocks it", "the temperature falls"], a: "ethanol toxicity kills the yeast", e: "Hence distillation is needed for stronger spirits.", d: "medium" },
  { q: "Ethyl ethanoate is formed from", o: ["ethanoic acid + ethanol", "ethene + water", "ethane + oxygen", "ethanol + ethene"], a: "ethanoic acid + ethanol", e: "Acid supplies the -oate part, alcohol the alkyl part.", d: "medium" },
  { q: "The poly(ethene) repeat unit is drawn", o: ["with brackets and n", "as one ethene molecule", "with double bonds intact", "as C₂H₆"], a: "with brackets and n", e: "The double bond opens; n says 'many'.", d: "medium" },
  { q: "C₅H₁₂ has how many structural isomers?", o: ["2", "3", "4", "5"], a: "3", e: "Pentane, 2-methylbutane, 2,2-dimethylpropane.", d: "hard" },
  { q: "Branched isomers boil lower than straight chains because", o: ["they are lighter", "chains pack less tightly — weaker dispersion forces", "bonds are weaker", "they are more reactive"], a: "chains pack less tightly — weaker dispersion forces", e: "Same formula, different intermolecular contact.", d: "hard" },
  { q: "Addition polymers are hard to dispose of because", o: ["they dissolve in water", "strong C–C and C–H bonds make them inert and non-biodegradable", "they are radioactive", "they evaporate"], a: "strong C–C and C–H bonds make them inert and non-biodegradable", e: "Inertness is the mechanism; recycling/biodegradables mitigate.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "organic-chemistry" } });
    if (!topic) throw new Error("master organic-chemistry topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("organic-chemistry standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Organic Chemistry — Complete", content: { blocks: ORG_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < ORG_QS.length; i++) {
      const item = ORG_QS[i];
      await prisma.question.upsert({
        where: { id: `master-organic-chemistry-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-organic-chemistry-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "organic-rebuild", blocks: ORG_BLOCKS.length, questions: ORG_QS.length });
  } catch (e) {
    console.error("rebuild organic failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
