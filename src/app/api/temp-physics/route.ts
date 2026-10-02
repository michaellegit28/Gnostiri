import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][] };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY full-physics batch seeder — DELETE after confirmed. Use ?only=<slug>.
const MECH_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Describing motion — kinematics" },
  { type: "paragraph", text: "Displacement (distance with direction), velocity (displacement per second), acceleration (velocity change per second). For uniform acceleration the equations of motion — v = u + at, s = ut + ½at², v² = u² + 2as — solve every syllabus problem." },
  { type: "example", text: "A car accelerates from rest at 3 m/s² for 5 s: v = 0 + 3×5 = 15 m/s; s = 0 + ½×3×25 = 37.5 m. List u, v, a, s, t first — the equation picks itself." },
  { type: "heading", level: 2, text: "2. Newton's three laws" },
  { type: "definition", term: "First law (inertia)", text: "Objects keep their state of rest or uniform motion unless a resultant force acts. Seatbelts exist because passengers obey it." },
  { type: "definition", term: "Second law", text: "F = ma. The defining equation of mechanics — force causes acceleration, scaled by mass." },
  { type: "definition", term: "Third law", text: "Every action has an equal opposite reaction on the OTHER body. Rocket pushes gas down; gas pushes rocket up." },
  { type: "example", text: "A 2 kg trolley under 10 N accelerates at 5 m/s². Double the mass, halve the acceleration — F = ma read both ways." },
  { type: "heading", level: 2, text: "3. Work, energy, power" },
  { type: "paragraph", text: "Work = force × distance moved in the force's direction. Energy is stored work: kinetic (½mv²), gravitational potential (mgh), elastic. Power = work ÷ time (watts). Conservation rules all — energy transforms, never vanishes." },
  { type: "example", text: "A 5 kg mass dropped 10 m loses 500 J of potential (5×10×10) and hits the ground at v = √(2×10×10) ≈ 14 m/s. One conservation line replaces pages of kinematics." },
  { type: "heading", level: 2, text: "4. Momentum" },
  { type: "paragraph", text: "Momentum = mass × velocity, conserved in collisions and explosions (no external forces). Elastic collisions keep kinetic energy; inelastic lose some to heat and sound. Impulse (F×t) equals momentum change — airbags stretch t to shrink F." },
  { type: "heading", level: 2, text: "5. Circular motion" },
  { type: "paragraph", text: "Turning needs a centre-seeking (centripetal) force: tension, friction, gravity, or electromagnetism. The Moon orbits because gravity supplies exactly mv²/r — too slow and it falls, too fast and it escapes." },
  { type: "callout", variant: "warning", text: "Exam trap: there is no outward 'centrifugal force' on the object in inertial frames — only the inward pull it needs. Name the real provider (tension, friction, weight)." },
];
const MECH_QS: Q[] = [
  { q: "A car accelerates from rest at 2 m/s² for 4 s. Its final velocity is", o: ["6 m/s", "8 m/s", "4 m/s", "16 m/s"], a: "8 m/s", e: "v = u + at = 0 + 8.", d: "easy" },
  { q: "A 3 kg mass experiences 12 N. Its acceleration is", o: ["36 m/s²", "4 m/s²", "15 m/s²", "9 m/s²"], a: "4 m/s²", e: "a = F/m = 12/3.", d: "easy" },
  { q: "A rocket rises because", o: ["exhaust pushes air down", "expelled gas pushes the rocket up (Newton III)", "gravity decreases", "fuel is light"], a: "expelled gas pushes the rocket up (Newton III)", e: "Action–reaction on different bodies.", d: "medium" },
  { q: "A 2 kg object moving at 3 m/s has kinetic energy", o: ["6 J", "9 J", "12 J", "18 J"], a: "9 J", e: "½mv² = ½×2×9.", d: "easy" },
  { q: "Dropping 5 kg through 10 m (g=10) converts potential to", o: ["50 J", "500 J", "5000 J", "5 J"], a: "500 J", e: "mgh = 5×10×10.", d: "easy" },
  { q: "In an elastic collision, conserved quantities are", o: ["momentum only", "kinetic energy only", "both momentum and kinetic energy", "neither"], a: "both momentum and kinetic energy", e: "Inelastic keeps momentum only.", d: "medium" },
  { q: "Airbags reduce injury by", o: ["reducing momentum", "extending impact time, shrinking force", "absorbing all energy", "stopping the car"], a: "extending impact time, shrinking force", e: "Same impulse F×t over longer t.", d: "medium" },
  { q: "The Moon stays in orbit because gravity provides", o: ["centrifugal force", "centripetal force mv²/r", "friction", "thrust"], a: "centripetal force mv²/r", e: "Inward pull curves its path.", d: "medium" },
  { q: "A 0.5 kg ball at 20 m/s has momentum", o: ["10 kg m/s", "40 kg m/s", "20 kg m/s", "5 kg m/s"], a: "10 kg m/s", e: "p = mv = 0.5×20.", d: "easy" },
  { q: "Power of 100 J work in 4 s is", o: ["400 W", "25 W", "104 W", "96 W"], a: "25 W", e: "P = W/t = 100/4.", d: "easy" },
];

const WAVES_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What waves carry" },
  { type: "definition", term: "Wave", text: "A travelling disturbance transferring energy without net matter movement. Linked by v = fλ: speed equals frequency times wavelength." },
  { type: "example", text: "Mexican-wave crowds: people bob up and down while the wave races round the stadium — energy travels, matter stays." },
  { type: "heading", level: 2, text: "2. Reflection and refraction" },
  { type: "paragraph", text: "Reflection: angle in equals angle out (mirrors, echoes). Refraction: speed change at boundaries bends rays — light slows in glass, bending toward the normal; total internal reflection above the critical angle feeds fibre optics and sparkling diamonds." },
  { type: "heading", level: 2, text: "3. Diffraction and interference" },
  { type: "paragraph", text: "Waves spread through gaps and bend round edges (diffraction — significant when gap ≈ wavelength, which is why sound carries round corners but light seemingly doesn't). Overlapping waves interfere: path differences of whole wavelengths reinforce, half wavelengths cancel — Young's double slit proves light's wave nature with bright and dark fringes." },
  { type: "heading", level: 2, text: "4. Sound" },
  { type: "paragraph", text: "Longitudinal pressure waves needing a medium: pitch rises with frequency, loudness with amplitude. Echoes give sonar and ultrasound scans (distance = speed × time ÷ 2 — there and back)." },
  { type: "heading", level: 2, text: "5. The electromagnetic spectrum" },
  { type: "table", headers: ["Radiation", "Use", "Danger"], rows: [["Radio/microwave", "Broadcasts, cooking", "Heating at high power"], ["Infrared", "Remote controls, heaters", "Burns"], ["Visible", "Seeing, photosynthesis", "—"], ["Ultraviolet", "Fluorescence, sterilising", "Skin damage"], ["X-rays/gamma", "Imaging, radiotherapy", "Ionisation, cancer risk"]] },
  { type: "paragraph", text: "All travel at light speed in vacuum, all transverse, all carry energy: frequency rises left to right, and so does danger." },
  { type: "callout", variant: "warning", text: "Exam trap: sound CANNOT travel in vacuum (needs particles); EM waves can. Stating the medium requirement wins the mark." },
];
const WAVES_QS: Q[] = [
  { q: "A wave with frequency 5 Hz and wavelength 2 m travels at", o: ["2.5 m/s", "10 m/s", "7 m/s", "3 m/s"], a: "10 m/s", e: "v = fλ = 5×2.", d: "easy" },
  { q: "Reflection obeys the rule that", o: ["angle in = angle out", "speed doubles", "frequency halves", "wavelength doubles"], a: "angle in = angle out", e: "Measured from the normal.", d: "easy" },
  { q: "Fibre optics work by", o: ["refraction", "total internal reflection", "diffraction", "dispersion"], a: "total internal reflection", e: "Above the critical angle, light cannot escape.", d: "medium" },
  { q: "Sound bends round corners better than light because sound has", o: ["higher speed", "longer wavelength", "no frequency", "more energy"], a: "longer wavelength", e: "Diffraction matters when gap ≈ wavelength.", d: "medium" },
  { q: "Bright fringes in Young's experiment form where waves arrive", o: ["out of phase", "in phase (whole λ difference)", "polarised", "absorbed"], a: "in phase (whole λ difference)", e: "Constructive interference brightens.", d: "medium" },
  { q: "Ultrasound distance uses time divided by two because sound travels", o: ["slowly", "there and back", "in water", "upwards"], a: "there and back", e: "Echo time covers double distance.", d: "easy" },
  { q: "Which EM radiation sterilises equipment but damages skin?", o: ["Radio", "Ultraviolet", "Infrared", "Microwave"], a: "Ultraviolet", e: "Energetic enough to kill microbes and cells.", d: "medium" },
  { q: "Pitch of a sound depends on its", o: ["amplitude", "frequency", "speed", "timbre only"], a: "frequency", e: "Higher f, higher pitch; amplitude sets loudness.", d: "easy" },
  { q: "All electromagnetic waves share", o: ["same wavelength", "speed in vacuum", "need for air", "same energy"], a: "speed in vacuum", e: "3×10⁸ m/s for the whole spectrum.", d: "easy" },
  { q: "X-rays image bones because they", o: ["reflect off skin", "penetrate soft tissue, stopped by bone", "heat tissue", "diffract widely"], a: "penetrate soft tissue, stopped by bone", e: "Density contrast makes the shadow.", d: "hard" },
];

const ELEC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Static charge and fields" },
  { type: "paragraph", text: "Rubbing transfers electrons: polythene gains (negative), acetate loses (positive). Like charges repel, opposites attract — and every charge shapes an electric field, mapped by lines from positive to negative." },
  { type: "heading", level: 2, text: "2. Current, voltage, resistance" },
  { type: "definition", term: "Ohm's law", text: "V = IR. Voltage pushes, resistance opposes, current flows. Metals obey it (ohmic); filaments and diodes don't — their resistance shifts with temperature and direction." },
  { type: "example", text: "A 12 V battery across 4 Ω drives 3 A. Double the resistance, halve the current — every circuit calculation starts here." },
  { type: "table", headers: ["", "Series", "Parallel"], rows: [["Current", "Same everywhere", "Splits across branches"], ["Voltage", "Shared across components", "Same across each branch"], ["Resistance", "Adds (R₁+R₂)", "Less than smallest branch"], ["Failure", "One break kills all", "Branches survive independently"]] },
  { type: "paragraph", text: "Mains wiring is parallel (each appliance gets full voltage); fuses and switches sit in series on the live wire. Power in circuits: P = VI = I²R — the I²R heating that fuses exploit and engineers fight." },
  { type: "heading", level: 2, text: "3. Magnetism and motors" },
  { type: "paragraph", text: "Every current makes a magnetic field (right-hand grip rule); solenoids concentrate it, iron cores amplify it into electromagnets — cranes, bells, relays. Fleming's left-hand rule turns field + current into motion: the DC motor." },
  { type: "heading", level: 2, text: "4. Induction — generators" },
  { type: "paragraph", text: "Move a wire through a field (or a field past a wire) and voltage appears — electromagnetic induction. Spin a coil in magnets: a generator. Step voltage up for transmission (less I²R loss), down for homes: transformers, AC only." },
  { type: "callout", variant: "warning", text: "Exam trap: motors use Fleming's LEFT hand (motion), generators the RIGHT hand (induced current). State which hand and why." },
];
const ELEC_QS: Q[] = [
  { q: "A 12 V battery across 4 Ω drives current of", o: ["48 A", "3 A", "8 A", "16 A"], a: "3 A", e: "I = V/R = 12/4.", d: "easy" },
  { q: "In series circuits, the same throughout is", o: ["voltage", "current", "resistance", "power"], a: "current", e: "One path: same flow everywhere.", d: "easy" },
  { q: "House wiring uses parallel so each appliance gets", o: ["shared voltage", "full mains voltage", "no current", "DC only"], a: "full mains voltage", e: "Branches see the full supply independently.", d: "medium" },
  { q: "A filament bulb is non-ohmic because its resistance", o: ["is zero", "rises with temperature", "is infinite", "ignores voltage"], a: "rises with temperature", e: "Hot filament resists more — curved I–V.", d: "medium" },
  { q: "Power dissipated in a resistor equals", o: ["V/R", "I²R", "R/I", "V+R"], a: "I²R", e: "Equivalently VI or V²/R.", d: "medium" },
  { q: "Electromagnets need an iron core to", o: ["conduct current", "concentrate the field", "cool the coil", "add weight"], a: "concentrate the field", e: "Iron channels flux powerfully.", d: "easy" },
  { q: "Fleming's left-hand rule predicts", o: ["induced current", "motor motion direction", "field strength", "resistance"], a: "motor motion direction", e: "First finger field, second current, thumb motion.", d: "medium" },
  { q: "Transformers work only on AC because they need", o: ["high voltage", "changing magnetic field", "copper wire", "iron"], a: "changing magnetic field", e: "Steady DC induces nothing.", d: "medium" },
  { q: "Fuses sit on the live wire in series to", o: ["save power", "melt and break on excess current", "raise voltage", "store charge"], a: "melt and break on excess current", e: "Thin wire sacrifices itself first.", d: "easy" },
  { q: "Generators convert", o: ["electrical to kinetic", "kinetic to electrical", "heat to light", "sound to current"], a: "kinetic to electrical", e: "Motion through field induces voltage.", d: "easy" },
];

const PTHERMO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Temperature, heat, and expansion" },
  { type: "paragraph", text: "Temperature measures average kinetic energy; heat is energy in transit. Solids expand least, liquids more, gases most — bimetallic strips curl, bridges leave gaps, and water's odd expansion below 4°C lets ice float and lakes survive winter." },
  { type: "heading", level: 2, text: "2. The gas laws" },
  { type: "paragraph", text: "Boyle: pressure × volume constant (same temperature). Charles: volume ÷ temperature constant (same pressure). Pressure law: pressure ÷ temperature constant (fixed volume). Combine: pV/T constant — one equation for every gas calculation." },
  { type: "example", text: "A syringe of air (100 cm³ at 100 kPa) squeezed to 50 cm³ reaches 200 kPa (Boyle). Warm it and it pushes back — the kinetic theory in your palm." },
  { type: "heading", level: 2, text: "3. Kinetic theory" },
  { type: "definition", term: "Model", text: "Gases are countless tiny particles in ceaseless random motion; collisions are elastic; temperature tracks average kinetic energy. Pressure IS bombardment — heat the gas and the hammering intensifies." },
  { type: "heading", level: 2, text: "4. The laws of thermodynamics" },
  { type: "table", headers: ["Law", "Says"], rows: [["Zeroth", "Mutual equilibrium means equal temperature (thermometry works)"], ["First", "Energy conserved: heat in = work out + internal gain"], ["Second", "Entropy rises: heat flows hot→cold, never unaided reverse"]] },
  { type: "paragraph", text: "No engine beats Carnot, no fridge works for free — the second law taxes every transfer. Absolute zero (−273°C) is the unreachable floor where motion would cease." },
  { type: "callout", variant: "warning", text: "Exam trap: heat and temperature are different quantities — heat is energy moved (joules), temperature is intensity (kelvin/celsius). Conflating them loses definition marks." },
];
const PTHERMO_QS: Q[] = [
  { q: "Temperature measures", o: ["total heat", "average kinetic energy", "particle number", "pressure"], a: "average kinetic energy", e: "Intensity, not amount.", d: "easy" },
  { q: "100 cm³ of gas at 100 kPa squeezed to 50 cm³ (same T) reaches", o: ["50 kPa", "100 kPa", "200 kPa", "400 kPa"], a: "200 kPa", e: "Boyle: pV constant, halve V double p.", d: "easy" },
  { q: "Ice floats because water", o: ["is warm", "expands below 4°C", "has no mass", "boils easily"], a: "expands below 4°C", e: "Anomalous expansion lowers ice density.", d: "medium" },
  { q: "Gas pressure arises from", o: ["gravity", "particle bombardment of walls", "magnetism", "friction"], a: "particle bombardment of walls", e: "Kinetic theory's core claim.", d: "easy" },
  { q: "The first law of thermodynamics states energy is", o: ["created in engines", "conserved", "always wasted fully", "unrelated to heat"], a: "conserved", e: "Heat in = work out + internal gain.", d: "medium" },
  { q: "Heat flows spontaneously", o: ["cold to hot", "hot to cold", "both ways equally", "never"], a: "hot to cold", e: "Second law: entropy rises.", d: "easy" },
  { q: "Absolute zero is", o: ["0°C", "−273°C", "−100°C", "unmeasured"], a: "−273°C", e: "0 K — motion's unreachable floor.", d: "easy" },
  { q: "Charles's law keeps constant", o: ["temperature", "pressure", "volume", "moles"], a: "pressure", e: "V/T constant at fixed pressure.", d: "medium" },
  { q: "Bimetallic strips bend with heat because metals", o: ["melt", "expand differently", "conduct", "rust"], a: "expand differently", e: "Differential expansion curls the strip.", d: "medium" },
  { q: "A perfect engine is impossible because of the", o: ["zeroth law", "first law", "second law", "gas laws"], a: "second law", e: "Some heat must always be rejected.", d: "hard" },
];

const NUCLEAR_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The unstable nucleus" },
  { type: "paragraph", text: "Too many neutrons (or too few) and the nucleus breaks down to stabilise — radioactivity. Background radiation (rocks, cosmic rays, radon) means every measurement starts above zero." },
  { type: "table", headers: ["Radiation", "Nature", "Stopped by", "Ionising"], rows: [["Alpha α", "Helium nucleus", "Paper/skin", "Strongest"], ["Beta β", "Fast electron", "Aluminium", "Medium"], ["Gamma γ", "EM wave", "Lead/concrete", "Penetrating"]] },
  { type: "heading", level: 2, text: "2. Half-life" },
  { type: "definition", term: "Half-life", text: "Time for half the unstable nuclei to decay — or half the activity to remain. Random per atom, perfectly predictable for trillions: after n half-lives, (½)ⁿ remains." },
  { type: "example", text: "100 g with 10-year half-life → 50 g after 10 y, 25 g after 20 y. Carbon-14 (5730 y) dates archaeology; cobalt-60's gammas treat cancer and sterilise food." },
  { type: "heading", level: 2, text: "3. Fission and fusion" },
  { type: "paragraph", text: "Fission splits heavy nuclei (uranium-235 + neutron → fragments + 2–3 neutrons + energy): each generation triggers more — a chain reaction, tamed by control rods and coolant in reactors, unleashed in bombs. Fusion joins light nuclei (hydrogen → helium in stars): clean, vast, and still beyond steady earthly reactors." },
  { type: "paragraph", text: "Einstein's E = mc² explains the energy: a little lost mass becomes enormous energy. Binding energy per nucleon peaks at iron — splitting heavies and fusing lights both slide downhill to it." },
  { type: "heading", level: 2, text: "4. Quantum beginnings — the photoelectric effect" },
  { type: "paragraph", text: "Dim blue light ejects electrons instantly; bright red light never does — waves can't explain it. Einstein: light arrives as photons, energy hf. Below the threshold frequency no photon has enough kick, however many arrive; above it, brighter means more electrons, not faster ones." },
  { type: "callout", variant: "info", text: "This single experiment killed pure-wave light and founded quantum physics — and won Einstein his Nobel (not relativity)." },
  { type: "heading", level: 2, text: "5. Safety and sense" },
  { type: "paragraph", text: "Distance, shielding, short exposure: handle sources with tongs, never point, store lead-lined. Nuclear power's case (dense, low-carbon) versus its costs (waste for millennia, accidents, weapons links) is the standard long-answer — argue both with named examples." },
];
const NUCLEAR_QS: Q[] = [
  { q: "Alpha radiation is stopped by", o: ["lead", "paper", "concrete", "aluminium"], a: "paper", e: "Heavy, strongly ionising, barely penetrating.", d: "easy" },
  { q: "100 g with 10-year half-life leaves after 20 years", o: ["50 g", "25 g", "10 g", "0 g"], a: "25 g", e: "Two half-lives: ½ × ½.", d: "easy" },
  { q: "Fission chain reactions are controlled in reactors by", o: ["fuel rods", "control rods absorbing neutrons", "water boiling", "extra uranium"], a: "control rods absorbing neutrons", e: "Boron/cadmium rods throttle the cascade.", d: "medium" },
  { q: "Fusion powers the Sun by joining", o: ["uranium nuclei", "hydrogen into helium", "lead atoms", "electrons"], a: "hydrogen into helium", e: "Light nuclei fuse downhill to iron.", d: "easy" },
  { q: "Bright red light ejects no electrons but dim blue does, because emission depends on", o: ["intensity", "frequency", "exposure time", "temperature"], a: "frequency", e: "Photon energy hf must beat the threshold.", d: "medium" },
  { q: "E = mc² explains nuclear energy as", o: ["lost electrons", "lost mass becoming energy", "gained protons", "chemical bonds"], a: "lost mass becoming energy", e: "Tiny mass defect × c² is enormous.", d: "medium" },
  { q: "Gamma rays are best shielded by", o: ["paper", "aluminium", "thick lead", "glass"], a: "thick lead", e: "Dense shielding for penetrating EM.", d: "easy" },
  { q: "Carbon-14 dating works because C-14", o: ["is stable", "decays with known half-life while alive it replenishes", "glows", "is heavy"], a: "decays with known half-life while alive it replenishes", e: "Death stops intake; ratio clocks the years.", d: "hard" },
  { q: "Background radiation excludes", o: ["granite rocks", "cosmic rays", "radon gas", "phone chargers"], a: "phone chargers", e: "Natural sources: rocks, space, radon.", d: "medium" },
  { q: "In photoelectric effect, brighter above-threshold light gives", o: ["faster electrons", "more electrons", "no change", "different metal"], a: "more electrons", e: "More photons, same per-photon energy.", d: "hard" },
];

const FIELDS_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Simple harmonic motion" },
  { type: "definition", term: "SHM", text: "Oscillation with acceleration proportional to displacement, toward equilibrium: pendulums (small angles), mass-spring systems, vibrating strings. Period of a spring: T = 2π√(m/k); pendulum: T = 2π√(l/g)." },
  { type: "example", text: "A playground swing pushed at its natural frequency soars (resonance); pushed randomly it fights you. Soldiers break step on bridges for the same reason." },
  { type: "heading", level: 2, text: "2. Damping and resonance" },
  { type: "paragraph", text: "Friction damps oscillations (car shock absorbers kill bounce fast). Driving at the natural frequency builds amplitude catastrophically — Tacoma Narrows, wine glasses, MRI machines all obey resonance." },
  { type: "heading", level: 2, text: "3. Gravitational fields" },
  { type: "paragraph", text: "Newton: F = Gm₁m₂/r² — inverse square. Field strength g = F/m: 9.8 N/kg at Earth's surface, weakening with altitude. Satellites balance exactly: geostationary (24 h, telecoms) versus low polar (mapping, 90 min)." },
  { type: "heading", level: 2, text: "4. Electric fields and capacitance" },
  { type: "paragraph", text: "Coulomb mirrors Newton: F = kQ₁Q₂/r². Field lines + to −; uniform fields between parallel plates (E = V/d). Capacitors store charge (Q = CV, energy ½CV²): camera flashes, defibrillators, smoothing power supplies." },
  { type: "example", text: "Doubling plate separation halves capacitance — and lightning is a giant capacitor (cloud–Earth) discharging when air's insulation breaks." },
  { type: "callout", variant: "warning", text: "Exam trap: gravitational fields always attract; electric fields attract AND repel. Check the sign before the direction." },
];
const FIELDS_QS: Q[] = [
  { q: "SHM requires acceleration proportional to", o: ["velocity", "displacement toward equilibrium", "time", "mass"], a: "displacement toward equilibrium", e: "Restoring force grows with displacement.", d: "medium" },
  { q: "Soldiers break step on bridges to avoid", o: ["tiredness", "resonance", "friction", "echoes"], a: "resonance", e: "Matched frequency builds amplitude.", d: "easy" },
  { q: "Gravitational force follows what distance rule?", o: ["linear", "inverse square", "exponential", "constant"], a: "inverse square", e: "F = Gm₁m₂/r².", d: "easy" },
  { q: "Geostationary satellites orbit in", o: ["90 minutes", "24 hours", "one month", "one year"], a: "24 hours", e: "Matching Earth's spin, fixed overhead.", d: "easy" },
  { q: "Electric field between parallel plates is", o: ["radial", "uniform", "zero", "circular"], a: "uniform", e: "Even lines: E = V/d.", d: "medium" },
  { q: "Capacitor energy equals", o: ["QV", "½CV²", "C/V", "V²/Q"], a: "½CV²", e: "Equivalently ½QV.", d: "medium" },
  { q: "Doubling plate separation", o: ["doubles capacitance", "halves capacitance", "no change", "shorts it"], a: "halves capacitance", e: "C ∝ area/separation.", d: "medium" },
  { q: "Unlike gravity, electric fields can", o: ["act at distance", "repel as well as attract", "weaken with distance", "store energy"], a: "repel as well as attract", e: "Like charges repel.", d: "easy" },
  { q: "Car shock absorbers demonstrate", o: ["resonance", "damping", "induction", "fusion"], a: "damping", e: "Friction kills unwanted oscillation.", d: "easy" },
  { q: "A mass-spring period depends on", o: ["amplitude", "mass and stiffness", "gravity", "colour"], a: "mass and stiffness", e: "T = 2π√(m/k).", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const only = req.nextUrl.searchParams.get("only");
  try {
    const today = new Date();
    const boards = await prisma.curriculumBoard.findMany({ select: { id: true } });
    if (!boards.length) throw new Error("No boards found");
    const topics: { slug: string; title: string; note: string; blocks: B[]; qs: Q[] }[] = [
      { slug: "mechanics", title: "Mechanics", note: "CORE: kinematics, Newton, energy in all 20 regions.", blocks: MECH_BLOCKS, qs: MECH_QS },
      { slug: "waves-optics", title: "Waves & Optics", note: "CORE: waves, light, spectrum in all 20 regions.", blocks: WAVES_BLOCKS, qs: WAVES_QS },
      { slug: "electricity-magnetism", title: "Electricity & Magnetism", note: "CORE: circuits, fields, induction in all 20 regions.", blocks: ELEC_BLOCKS, qs: ELEC_QS },
      { slug: "thermodynamics", title: "Thermodynamics", note: "CORE in Cambridge 9702 Sec III, AQA/OCR/Edexcel and SG H2 Physics; all regions.", blocks: PTHERMO_BLOCKS, qs: PTHERMO_QS },
      { slug: "nuclear-quantum-physics", title: "Nuclear & Quantum Physics", note: "CORE: radioactivity and quantum ideas in all 20 regions.", blocks: NUCLEAR_BLOCKS, qs: NUCLEAR_QS },
      { slug: "further-mechanics-fields", title: "Further Mechanics & Fields", note: "CORE where offered: SHM, gravitation, capacitance.", blocks: FIELDS_BLOCKS, qs: FIELDS_QS },
    ].filter((t) => !only || t.slug === only || t.slug.startsWith(only));
    if (!topics.length) return NextResponse.json({ error: "Unknown only=" }, { status: 400 });
    const done: Record<string, number> = {};
    for (const t of topics) {
      const topic = await prisma.topic.findFirst({ where: { slug: t.slug } });
      if (!topic) throw new Error(`Topic missing: ${t.slug}`);
      const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
      if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, estimatedMinutes: 45 } });
      else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: `${t.title} — Complete`, content: { blocks: t.blocks } as object, orderIndex: 0, estimatedMinutes: 45 } });
      for (let i = 0; i < t.qs.length; i++) {
        const item = t.qs[i];
        await prisma.question.upsert({
          where: { id: `master-${t.slug}-q${i + 1}` },
          update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
          create: { id: `master-${t.slug}-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        });
      }
      const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
      const have = new Set(existingRows.map((r) => r.boardId));
      await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: t.note } });
      const missing = boards.filter((b) => !have.has(b.id));
      if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: t.note })) });
      await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
      done[t.slug] = t.blocks.length;
    }
    return NextResponse.json({ ok: true, topics: done, questionsPerTopic: 10, boards: boards.length });
  } catch (e) {
    console.error("temp physics failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
