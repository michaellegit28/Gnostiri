import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Chemistry Topic 4: Thermodynamics & Kinetics at the
// no-exceptions bar: energetics, rates, equilibrium — reasoned at every step.

const THERMO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Energy changes — the bond ledger" },
  { type: "paragraph", text: "Every reaction is an energy audit: BREAKING bonds costs energy (endothermic step), MAKING bonds releases it (exothermic step). The balance decides the sign. Exothermic (combustion, neutralisation, respiration): heat RELEASED, products sit at lower energy, ΔH negative — the flask warms. Endothermic (thermal decomposition, photosynthesis): heat ABSORBED, ΔH positive — the flask cools against your palm. The temperature change is the evidence; the sign is the bookkeeping." },
  { type: "definition", term: "Reaction profile", text: "A graph of energy against reaction progress: reactants' plateau, an activation-energy hill, products' plateau. Exothermic: products BELOW reactants (ΔH down). Endothermic: products ABOVE (ΔH up). The hill's height is the activation energy (Ea) — independent of ΔH. Label both arrows: examiners award the labels." },
  { type: "heading", level: 2, text: "2. Bond energies — calculating ΔH" },
  { type: "definition", term: "Bond energy", text: "The energy to break one mole of a specific bond in the gas phase — always positive (breaking costs). ΔH = total bonds broken − total bonds made. A negative result means more energy was released making bonds than spent breaking them: exothermic." },
  { type: "example", text: "Worked: H₂ + Cl₂ → 2HCl, given H–H 436, Cl–Cl 243, H–Cl 431 kJ/mol. Bonds broken: 436 + 243 = 679. Bonds made: 2 × 431 = 862. ΔH = 679 − 862 = −183 kJ/mol — exothermic, matching the observed heat. Same method any bond table: list bonds, break then make, subtract. The gas-phase caveat is the precision mark (water solutions differ)." },
  { type: "heading", level: 2, text: "3. Activation energy — why sparks are needed" },
  { type: "paragraph", text: "Exothermic reactions still need a start: the activation energy hill must be climbed before the downhill run. Paper ignites with a match, not at room temperature; the reaction is exothermic but kinetically blocked until Ea is supplied. Catalysts (below) lower the hill; temperature supplies more climbing energy. Explaining 'why does charcoal not burn at room temperature' needs exactly this distinction — thermodynamics says yes, kinetics says not yet." },
  { type: "heading", level: 2, text: "4. Rates — collision theory with reasons" },
  { type: "table", headers: ["Factor", "Effect", "Because (the mark)"], rows: [["Concentration", "↑", "More particles per volume → more frequent collisions"], ["Pressure (gases)", "↑", "Same as concentration in a squeezed volume"], ["Surface area", "↑", "More exposed particles; powder beats lumps"], ["Temperature", "↑", "Particles move faster: more collisions AND more energy per collision — a double effect"], ["Catalyst", "↑", "Lower-Ea route: more collisions succeed, catalyst emerges unchanged"]] },
  { type: "paragraph", text: "Temperature's effect is DOUBLE (frequency and energy) — which is why a 10 °C rise can double a rate. The Maxwell–Boltzmann distribution shows it: the curve's peak shifts right and flattens at higher temperature, and the area beyond Ea grows disproportionately — many more collisions now clear the hill. 'More particles have energy above Ea' is the distribution phrase that earns the mark." },
  { type: "example", text: "Required practical 1 — gas collection: magnesium ribbon + excess HCl in a conical flask with gas syringe; record volume every 10 s. Plot volume vs time: the curve starts steep (fastest rate — most acid unreacted) and flattens as reactants run out. Rate at any instant = the tangent's slope. Repeat at different temperatures/concentrations; compare initial gradients — the initial rate is the fair comparison point (nothing yet consumed)." },
  { type: "example", text: "Required practical 2 — disappearing cross: sodium thiosulfate + dilute HCl in a flask over a marked cross; time how long the precipitating sulfur takes to hide it. Faster at higher temperature (collision theory). Precision limit: human judgment of 'hidden' varies — repeat and average; the method's weakness IS an evaluation mark. Both practicals answer 'how do we measure rate' — syringe for volume, cross for visual endpoint." },
  { type: "heading", level: 2, text: "5. Catalysts — the lowered hill" },
  { type: "paragraph", text: "A catalyst provides an alternative route with lower activation energy: more collisions succeed, rate rises, and the catalyst emerges chemically unchanged (though it participates — iron's surface holds reacting molecules in the Haber process; catalytic converters adsorb CO and NOx, converting them on platinum surfaces). Three rules every exam tests: catalysts speed reactions WITHOUT being consumed; they do NOT change ΔH or the energy released; they NEVER shift an equilibrium — both directions speed equally, so the same yield arrives faster." },
  { type: "heading", level: 2, text: "6. Reversible reactions and dynamic equilibrium" },
  { type: "paragraph", text: "A reversible reaction (⇌) runs both ways. In a CLOSED system (nothing in or out), forward and backward rates eventually match — dynamic equilibrium: concentrations steady but NOT equal, and both reactions continue at the molecular level. 'Equal amounts' is the classic wrong answer; 'equal rates' is the right one. The position of equilibrium (how much product vs reactant) is what Le Chatelier's rule moves." },
  { type: "heading", level: 2, text: "7. Le Chatelier — oppose the change" },
  { type: "definition", term: "The rule", text: "Disturb an equilibrium and it shifts to OPPOSE the change. Concentration added → consumed (shift away). Pressure raised (gases) → toward fewer gas molecules. Temperature raised → toward the endothermic direction (absorbing the extra heat). Catalyst → NO shift, only faster arrival." },
  { type: "example", text: "Applied — the Haber process N₂ + 3H₂ ⇌ 2NH₃ (ΔH = −92 kJ/mol), justified line by line: 200 atm pressure — 4 gas molecules → 2, so high pressure favours ammonia (and costs money/safety: the compromise); ~450 °C — low temperature favours yield (exothermic forward) but is too slow; 450 °C is the rate-yield compromise; iron catalyst — faster arrival, no yield change. Every condition is a Le Chatelier sentence plus an economic reason: that structure IS the full-mark answer." },
  { type: "example", text: "Required practical — equilibrium shift demo: [Cu(H₂O)₆]²⁺ is blue; add concentrated HCl and it turns yellow-green as Cl⁻ replaces water ([CuCl₄]²⁻); add water and blue returns. One reversible equation, two colours, the shift visible live — and the reasoning: adding Cl⁻ pushed the equilibrium away from it, exactly as Le Chatelier predicts." },
  { type: "heading", level: 2, text: "8. Worked rate from a graph" },
  { type: "example", text: "From a gas-syringe curve: at t = 20 s, draw the tangent; slope = Δvolume ÷ Δtime = (48 − 12) cm³ ÷ (30 − 10) s = 1.8 cm³/s. The initial rate (t = 0 tangent) is steepest — most reactant, most collisions. Rates fall because reactants deplete, not because the reaction 'slows down by itself'. Reading tangents is a guaranteed graph skill." },
  { type: "heading", level: 2, text: "9. Summary — the reasoning spine" },
  { type: "table", headers: ["Observation", "Because", "Key phrase"], rows: [["Exothermic warms flask", "Bond-making outstrips bond-breaking", "ΔH negative, products lower"], ["Rate doubles per +10 °C", "Frequency AND energy both rise", "More collisions exceed Ea"], ["Catalyst speeds but doesn't shift", "Lower-Ea route, both directions equal", "Same yield, faster"], ["High pressure favours NH₃", "4 molecules → 2", "Fewer gas molecules side"], ["Equilibrium concentrations steady", "Rates equal, not amounts", "Dynamic, not static"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'predict the shift' names the disturbance's opposition; 'explain the effect of a catalyst' includes never-shifts-yield; 'justify the conditions' pairs each Le Chatelier sentence with its economic compromise. Kinetics answers are reason-chains — one factor alone caps the mark." },
];

const THERMO_QS: Q[] = [
  { q: "Given H–H 436, Cl–Cl 243, H–Cl 431 kJ/mol, ΔH for H₂ + Cl₂ → 2HCl is", o: ["−183 kJ/mol", "+183 kJ/mol", "−679 kJ/mol", "−862 kJ/mol"], a: "−183 kJ/mol", e: "679 broken − 862 made. Exothermic — heat released.", d: "medium" },
  { q: "An exothermic reaction warms its flask because", o: ["the flask is heated first", "bond-making releases more energy than bond-breaking absorbs", "activation energy is negative", "the catalyst heats it"], a: "bond-making releases more energy than bond-breaking absorbs", e: "The bond ledger's net is negative.", d: "easy" },
  { q: "Charcoal does not burn at room temperature despite being exothermic because", o: ["it lacks oxygen", "activation energy has not been supplied", "it is already oxidised", "entropy forbids it"], a: "activation energy has not been supplied", e: "Thermodynamics says yes; kinetics says not yet.", d: "medium" },
  { q: "Raising temperature speeds reactions doubly because", o: ["particles move faster AND more exceed Ea", "concentration rises", "catalysts form", "volume expands"], a: "particles move faster AND more exceed Ea", e: "Frequency + energy — the double effect.", d: "medium" },
  { q: "Powdered marble reacts faster than lump marble because", o: ["it is purer", "more surface is exposed — more collisions per second", "its bonds are weaker", "it dissolves first"], a: "more surface is exposed — more collisions per second", e: "Surface area factor with its because-chain.", d: "easy" },
  { q: "A catalyst speeds a reaction by", o: ["raising temperature", "providing a lower-Ea route, emerging unchanged", "increasing concentration", "shifting equilibrium toward products"], a: "providing a lower-Ea route, emerging unchanged", e: "Never shifts equilibrium — same yield, faster.", d: "medium" },
  { q: "For N₂ + 3H₂ ⇌ 2NH₃, raising pressure", o: ["favours reactants", "favours ammonia — 4 molecules → 2", "has no effect", "stops the reaction"], a: "favours ammonia — 4 molecules → 2", e: "Le Chatelier: toward fewer gas molecules.", d: "medium" },
  { q: "The Haber process uses ~450 °C rather than lower because", o: ["the yield is highest there", "lower favours yield but is too slow — a rate-yield compromise", "iron melts lower", "ammonia decomposes above 450"], a: "lower favours yield but is too slow — a rate-yield compromise", e: "Every condition pairs Le Chatelier with economics.", d: "hard" },
  { q: "A gas-syringe curve gives rate at t = 20 s from", o: ["the final volume", "the tangent's slope at that instant", "the intercept", "the colour change"], a: "the tangent's slope at that instant", e: "Steeper = faster; initial rate is the comparison point.", d: "medium" },
  { q: "Adding water to the blue [Cu(H₂O)₆]²⁺ / yellow [CuCl₄]²⁻ equilibrium", o: ["turns it yellow", "shifts it back toward blue — diluting Cl⁻", "no change", "precipitates copper"], a: "shifts it back toward blue — diluting Cl⁻", e: "Le Chatelier opposes: fewer Cl⁻ → regenerate the hydrate.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "thermodynamics-kinetics" } });
    if (!topic) throw new Error("master thermodynamics-kinetics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("thermodynamics-kinetics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Thermodynamics & Kinetics — Complete", content: { blocks: THERMO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < THERMO_QS.length; i++) {
      const item = THERMO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-thermodynamics-kinetics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-thermodynamics-kinetics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "thermo-rebuild", blocks: THERMO_BLOCKS.length, questions: THERMO_QS.length });
  } catch (e) {
    console.error("rebuild thermo failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
