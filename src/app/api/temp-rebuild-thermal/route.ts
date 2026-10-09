import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 4: Thermodynamics at the no-exceptions bar:
// temperature vs heat, kinetic theory, gas laws, heat transfer, specific heats, expansion, engines.

const THERMO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Temperature vs heat — different quantities" },
  { type: "definition", term: "Temperature", text: "The AVERAGE kinetic energy of a substance's particles — measured in °C or K. Heat is the ENERGY TRANSFERRED from hot to cold because of a temperature difference, measured in joules. Temperature tells you which way energy will flow; heat is the energy that flows. A sparkler's spark (~2000 °C) vs a bath at 40 °C: the spark has the higher temperature but far LESS total energy — the bath holds much more water, and energy depends on mass too." },
  { type: "paragraph", text: "Energy flows hot → cold until THERMAL EQUILIBRIUM — equal temperatures, no net flow. That single direction rule explains conduction, convection, radiation, and why drinks cool to room temperature and stop: no difference, no transfer." },
  { type: "heading", level: 2, text: "2. Kinetic theory — the particle model" },
  { type: "paragraph", text: "All matter is particles in constant motion: solids vibrate in place, liquids slide past each other, gases fly free and fast. Gas PRESSURE is the particles colliding with the walls — billions of tiny impacts per second. Heat the gas and the particles move faster, collide harder and more often: pressure rises. Brownian motion (smoke particles jiggling under a microscope as air molecules batter them) is the evidence the exam names: the jiggling is invisible molecules making themselves visible." },
  { type: "example", text: "Worked reasoning: a sealed can is heated → particles gain kinetic energy → they strike the walls harder AND more often → pressure rises until the can bursts. Every gas-law explanation is this chain: temperature ↑ → kinetic energy ↑ → collisions ↑ → pressure ↑." },
  { type: "heading", level: 2, text: "3. The gas laws — three rules and a zero" },
  { type: "table", headers: ["Law", "Equation", "Held constant"], rows: [["Boyle's law", "pV = constant (p₁V₁ = p₂V₂)", "temperature"], ["Charles's law", "V/T = constant", "pressure"], ["Pressure law", "p/T = constant", "volume"], ["Kelvin scale", "K = °C + 273", "— (absolute zero: −273 °C, particles at minimum energy)"]] },
  { type: "example", text: "Worked — Boyle: 100 kPa of gas at 2 m³ is compressed to 0.5 m³ → p₂ = p₁V₁/V₂ = 100 × 2 ÷ 0.5 = 400 kPa (volume quartered, pressure ×4 ✓). ALWAYS convert to kelvin in any temperature gas calculation: 27 °C = 300 K — the °C value in the ratio is the classic trap." },
  { type: "heading", level: 2, text: "4. Conduction — energy passed along" },
  { type: "paragraph", text: "In CONDUCTION, hot particles vibrate hard and pass energy to cooler neighbours, particle to particle, along the solid. Metals conduct best because their FREE ELECTRONS drift through the lattice carrying energy (the particles cannot travel — the electrons do). Insulators (plastic, wood, wool) have no free electrons and tightly-bound lattices. The exam experiment: rods of different metals with wax-fixed ball bearings — the ball drops first from the best conductor." },
  { type: "example", text: "Applications as explanations: double glazing traps a layer of air (air is a poor conductor — the gap does the insulating); pot handles are plastic; a metal spoon in hot tea heats from the handle end last — conduction along the spoon, slowest at the far end." },
  { type: "heading", level: 2, text: "5. Convection — hot fluid rises" },
  { type: "paragraph", text: "In CONVECTION, a heated fluid EXPANDS, becomes less dense, and RISES; cooler, denser fluid sinks to replace it — a convection current circulates the energy. Only fluids (liquids and gases) convect — solids cannot flow. Sea breezes: day-time land heats faster than sea, warm air over land rises, cool sea air flows in to replace it; the current reverses at night. Radiators, boiling water, and the Earth's weather are all convection currents." },
  { type: "example", text: "Worked reasoning: why does the heating element of a kettle sit at the BOTTOM? Element heats water → water expands, less dense → rises → cool water sinks to the element → the current stirs the whole kettle. Element at the top would heat only the top layer — the current could never form." },
  { type: "heading", level: 2, text: "6. Radiation — infrared without a medium" },
  { type: "paragraph", text: "All objects emit and absorb INFRARED radiation — no medium needed (it crosses the vacuum of space: the Sun's energy arrives by radiation alone). Surfaces matter: BLACK MATTE is the best absorber AND best emitter; SILVER SHINY is the worst at both — it reflects. Hotter objects radiate faster, and the temperature difference drives the net flow." },
  { type: "example", text: "The vacuum flask defeats all three transfers at once: VACUUM stops conduction and convection (no particles), SILVERED walls reflect radiation, and the stopper blocks convection at the neck. Name all three for the marks — the flask is a thermal siege engine in reverse." },
  { type: "heading", level: 2, text: "7. Specific heat capacity — the energy to warm" },
  { type: "definition", term: "Specific heat capacity (c)", text: "The energy needed to raise 1 kg of a substance by 1 °C (J/kg °C). E = mcΔT — mass × specific heat × temperature change. Water's unusually high c (4200 J/kg °C) makes it the coolant of engines, radiators, and the climate itself: it absorbs huge energy for a small temperature rise." },
  { type: "example", text: "Worked: 2 kg of water heated from 20 °C to 40 °C → E = mcΔT = 2 × 4200 × 20 = 168,000 J. Reverse: 84,000 J into 1 kg of water (c = 4200) → ΔT = 84,000 ÷ 4200 = 20 °C rise. Rearrange the triangle; watch the units — J/kg °C with mass in kg." },
  { type: "heading", level: 2, text: "8. Specific latent heat — the energy to change state" },
  { type: "definition", term: "Specific latent heat (L)", text: "The energy needed to change the STATE of 1 kg WITHOUT any temperature change: latent heat of FUSION (solid ↔ liquid) and of VAPORISATION (liquid ↔ gas). E = mL. Boiling water stays at 100 °C while it boils — the energy goes into breaking bonds, not raising temperature." },
  { type: "diagram", diagramId: "heating-curve", caption: "Sloped sections: E = mcΔT; flat sections: E = mL" },
  { type: "example", text: "Worked: melting 0.5 kg of ice (L_fusion = 334,000 J/kg) → E = mL = 0.5 × 334,000 = 167,000 J — at 0 °C throughout, no temperature change. Steaming the same mass away (L_vap ≈ 2,260,000) needs ~7× more: vaporisation breaks bonds completely. On the heating curve: sloped sections cost mcΔT, flat sections cost mL — read the flat, quote the latent." },
  { type: "heading", level: 2, text: "9. Thermal expansion — solids, liquids, gases" },
  { type: "paragraph", text: "Everything expands on heating: particles vibrate harder and push each other apart (gases most, liquids next, solids least — the particles' freedom decides). Engineering lives with it: gaps in bridges and railway rails allow summer expansion; telephone wires sag in summer and snap taut in winter." },
  { type: "definition", term: "Bimetallic strip", text: "Two metals bonded in one strip (usually brass and invar) that expand differently — heating bends the strip toward the metal that expands LESS. The bend makes and breaks a contact: thermostats, irons, and circuit breakers are a bent strip doing the switching." },
  { type: "heading", level: 2, text: "10. The laws of thermodynamics" },
  { type: "definition", term: "First law", text: "Energy is conserved: energy supplied to a system = the rise in internal energy + the work done. Heat is not created or destroyed — it moves and transforms." },
  { type: "definition", term: "Second law", text: "Heat flows spontaneously from hot to cold — NEVER the reverse without work being done (fridges pump heat out by doing work on the refrigerant). And no engine converts heat entirely to work: some energy is always expelled to the surroundings — disorder (entropy) always increases overall." },
  { type: "paragraph", text: "The second law is why every power station and every car engine has a cooling system: the expelled heat is not a design flaw — it is the law." },
  { type: "heading", level: 2, text: "11. Efficiency of heat engines" },
  { type: "example", text: "Worked: a power station takes 1000 MJ of fuel energy and delivers 400 MJ of electricity. Efficiency = useful ÷ input × 100 = 400/1000 × 100 = 40%. The missing 600 MJ leaves as heat in the cooling towers — wasted to the atmosphere, never destroyed. Sankey diagrams show the split: the arrow narrows at every loss." },
  { type: "paragraph", text: "Car engines run ~25–30% efficient; combined-cycle gas stations reach ~60% by using the exhaust heat to drive a second turbine. Efficiency improves by cutting friction, improving insulation, and recycling waste heat — never by breaking the second law." },
  { type: "heading", level: 2, text: "12. Summary — the thermodynamics spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Gas laws", "Convert °C to K first", "27 °C is 300 K, not 27 K"], ["Heat transfer", "Name the mechanism + why", "Radiation needs no medium"], ["SHC", "E = mcΔT with units", "Mass in kg, ΔT is a change"], ["Latent heat", "E = mL on the FLAT sections", "No temperature change while state changes"], ["Vacuum flask", "All three transfers defeated", "Vacuum stops conduction AND convection"], ["Efficiency", "useful ÷ input × 100", "Lost ≠ destroyed — it leaves as heat"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' = formula, substitution, units (kelvin in gas laws); 'explain' = the particle chain (kinetic energy ↑, collisions ↑) or the named mechanism (conduction, convection, radiation); 'state' = the memorised distinction (temperature is average kinetic energy; heat is energy in transit)." },
];

const THERMO_QS: Q[] = [
  { q: "Heat always flows", o: ["from hot to cold", "from cold to hot", "from solids to gases", "from large objects to small"], a: "from hot to cold", e: "Temperature difference drives the transfer — until equilibrium.", d: "easy" },
  { q: "100 kPa of gas at 2 m³ is compressed to 0.5 m³ (constant temperature). The new pressure is", o: ["25 kPa", "50 kPa", "400 kPa", "200 kPa"], a: "400 kPa", e: "Boyle: p₁V₁ = p₂V₂ → 100 × 2 ÷ 0.5.", d: "easy" },
  { q: "27 °C in kelvin is", o: ["27 K", "246 K", "300 K", "273 K"], a: "300 K", e: "K = °C + 273. Kelvin in every gas-law ratio.", d: "easy" },
  { q: "Metals conduct heat better than non-metals because", o: ["their particles travel through the metal", "free electrons carry energy through the lattice", "they are denser", "they are shinier"], a: "free electrons carry energy through the lattice", e: "The lattice vibrates in place — the electrons drift and deliver.", d: "medium" },
  { q: "A convection current forms because heated fluid", o: ["expands, becomes less dense, and rises", "contracts and sinks", "evaporates instantly", "conducts along the container"], a: "expands, becomes less dense, and rises", e: "Density difference drives the circulation — fluids only.", d: "medium" },
  { q: "The best absorber and emitter of radiation is", o: ["black matte", "silver shiny", "white gloss", "clear glass"], a: "black matte", e: "Shiny reflects; matte absorbs and emits best.", d: "easy" },
  { q: "2 kg of water (c = 4200 J/kg °C) heated by 20 °C needs", o: ["84,000 J", "168,000 J", "8400 J", "42,000 J"], a: "168,000 J", e: "E = mcΔT = 2 × 4200 × 20.", d: "medium" },
  { q: "While ice is melting at 0 °C, the energy supplied", o: ["raises the temperature slowly", "changes the state with no temperature change", "raises the temperature quickly", "is stored as pressure"], a: "changes the state with no temperature change", e: "Flat section on the heating curve: E = mL.", d: "medium" },
  { q: "A vacuum flask keeps drinks hot because", o: ["the vacuum stops conduction and convection, and silvered walls reflect radiation", "it generates heat", "the vacuum raises the temperature", "plastic conducts heat away"], a: "the vacuum stops conduction and convection, and silvered walls reflect radiation", e: "Name all three transfers defeated for the marks.", d: "medium" },
  { q: "A power station takes 1000 MJ of fuel and delivers 400 MJ of electricity. Its efficiency is", o: ["40%", "60%", "140%", "25%"], a: "40%", e: "Useful ÷ input × 100 = 400/1000 × 100. The 600 MJ leaves as heat.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "thermodynamics" } });
    if (!topic) throw new Error("master thermodynamics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("thermodynamics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Thermodynamics — Complete", content: { blocks: THERMO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < THERMO_QS.length; i++) {
      const item = THERMO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-thermodynamics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-thermodynamics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "thermodynamics-rebuild", blocks: THERMO_BLOCKS.length, questions: THERMO_QS.length });
  } catch (e) {
    console.error("rebuild thermodynamics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
