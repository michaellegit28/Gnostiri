import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Physics Topic 2: Waves & Optics at the no-exceptions bar:
// wave properties, reflection, refraction, TIR, diffraction, sound, EM, lenses.

const WAVE_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What waves carry — and what they don't" },
  { type: "definition", term: "Wave", text: "A travelling disturbance that transfers ENERGY without net movement of matter. Ocean waves race across water while the water bobs in place; stadium waves race round the crowd while nobody changes seat. Energy travels; the medium oscillates — the distinction every wave question tests." },
  { type: "table", headers: ["", "Transverse", "Longitudinal"], rows: [["Oscillation", "Perpendicular to travel", "Parallel to travel (compressions + rarefactions)"], ["Examples", "EM waves (light, radio), S-waves, water surface", "Sound, ultrasound, P-waves"], ["Vacuum", "EM travel fine", "CANNOT — need particles to compress"]] },
  { type: "definition", term: "The vocabulary", text: "Wavelength λ: crest-to-crest (metres). Amplitude: rest-to-peak (energy carried). Frequency f: waves per second (hertz). Period T: seconds per wave = 1/f. Speed v = fλ — the equation every wave calculation starts from." },
  { type: "example", text: "Worked: a wave with f = 5 Hz and λ = 2 m travels at v = 5 × 2 = 10 m/s. Reverse: water ripples at 2 m/s with λ = 0.5 m → f = v/λ = 4 Hz. The triangle has three entries — speed, frequency, wavelength — and any two give the third. Show the substitution: method marks precede answers." },
  { type: "heading", level: 2, text: "2. Reflection — the law and the diagrams" },
  { type: "paragraph", text: "Angle of incidence = angle of reflection, both measured from the NORMAL (the perpendicular to the surface) — measuring from the surface is the classic diagram error. Regular reflection (smooth surfaces — mirrors) keeps the image sharp; diffuse reflection (rough — paper, walls) scatters rays in all directions, which is why you can't shave in a wall. Ray diagrams: incident ray, normal, reflected ray, labelled angles — draw them for the method marks." },
  { type: "example", text: "Worked echo: a shout returns in 1.2 s (sound at 340 m/s). Distance to the wall = (340 × 1.2) ÷ 2 = 204 m — the THERE-AND-BACK ÷2 is the trap the exam always sets. Same arithmetic runs ultrasound scans: echo timing maps depth inside the body." },
  { type: "heading", level: 2, text: "3. Refraction — light changes speed, rays bend" },
  { type: "paragraph", text: "Light slows entering a denser medium (air → glass) and the ray bends TOWARD the normal; leaving, it speeds and bends AWAY. The frequency NEVER changes (the source sets it) — wavelength and speed change together. Why: light's interaction with the glass's electrons delays the wavefront. Half-immersed pencils look broken; pools look shallower than they are — refraction in daily life, and the ray diagram (incident, refracted, normal, both angles) earns the marks." },
  { type: "heading", level: 2, text: "4. Total internal reflection — trapped light" },
  { type: "definition", term: "Two conditions", text: "1) Light travels in the DENSER medium toward the boundary; 2) angle of incidence EXCEEDS the critical angle — then ALL light reflects inside, none escapes. Below the critical angle, partial refraction leaves; at it, the refracted ray skims the surface." },
  { type: "paragraph", text: "Optical fibres exploit it: light bounces along a glass core (cladding keeps it in) for medicine (endoscopes — seeing inside without surgery) and communications (the internet's backbone — light pulses carrying data). Diamond's sparkle: its very low critical angle (~24°) traps light through multiple bounces before it escapes. The underwater swimmer's mirrored surface (looking up from below past the critical angle) is TIR in nature." },
  { type: "heading", level: 2, text: "5. Diffraction — waves that bend round corners" },
  { type: "paragraph", text: "Waves spread (diffract) through gaps and round edges — and the effect is significant only when the gap is comparable to the wavelength. Sound (λ ~ metres) bends round doorways; light (λ ~ 500 nm) does not — which is why you hear around corners but cannot see around them. Harbour walls diffract real water waves; radio (long λ) reaches valleys behind hills that TV (short λ) cannot — the exam wants the gap-vs-wavelength rule, not just the word." },
  { type: "heading", level: 2, text: "6. Interference — waves that add and cancel" },
  { type: "definition", term: "Coherence and paths", text: "Coherent sources share frequency and phase. Overlapping waves: path difference of a WHOLE wavelength → arrive in phase → constructive (loud/bright); HALF a wavelength → antiphase → destructive (silent/dark)." },
  { type: "example", text: "Young's double slit: light through two slits lands as alternating bright and dark fringes — proof light is a WAVE (particles would make two bright patches, nothing between). Fringe spacing measures wavelength: red light's fringes sit wider than blue's — longer wavelength, measured by ruler. The experiment that forced wave-thinking on light is the exam's favourite history-of-physics item." },
  { type: "heading", level: 2, text: "7. Sound — pressure waves with personality" },
  { type: "paragraph", text: "Longitudinal compressions needing a medium: the vacuum-jar experiment (bell ringing in evacuated flask — silence spreads as air leaves) is the required knowledge. Pitch rises with FREQUENCY; loudness with AMPLITUDE — energy carried. Human range 20 Hz–20,000 Hz; below is infrasound (earthquakes), above ultrasound." },
  { type: "example", text: "Ultrasound (above 20 kHz) has two exam jobs: prenatal scans (echo timing maps the fetus — non-ionising, safe) and sonar (ships' depth, shoals of fish). Both are echo-distance arithmetic: depth = (speed × time) ÷ 2. Ultrasound's safety vs X-rays' ionisation is the comparison question — sound waves carry no ionising energy." },
  { type: "heading", level: 2, text: "8. The electromagnetic spectrum — one family, seven faces" },
  { type: "table", headers: ["Radiation (↑ frequency)", "Use", "Danger"], rows: [["Radio", "Broadcast, MRI", "Low-power safe"], ["Microwave", "Cooking, satellites, phones", "Tissue heating at high power"], ["Infrared", "Remotes, heaters, thermal imaging", "Skin burns"], ["Visible", "Seeing, photosynthesis, fibre optics", "— (bright lasers damage eyes)"], ["Ultraviolet", "Fluorescence, sterilising, vitamin D", "Sunburn, skin cancer"], ["X-rays", "Bone imaging, security", "Ionising — cancer risk (lead shielding)"], ["Gamma", "Radiotherapy, sterilising equipment, tracers", "Most ionising — deepest penetration"]] },
  { type: "paragraph", text: "All seven travel at 3 × 10⁸ m/s in vacuum, all transverse — one family differing only in frequency. Frequency rises left to right, and so does danger: ionising radiation (UV, X, gamma) carries enough energy per photon to strip electrons from cells and damage DNA — the ionising/non-ionising distinction is the safety question's core." },
  { type: "heading", level: 2, text: "9. Lenses — bending light to form images" },
  { type: "table", headers: ["Lens", "Shape", "Image", "Use"], rows: [["Converging (convex)", "Fat middle", "Object beyond F: real, inverted, can be projected on a screen; inside F: virtual, upright, magnified", "Camera, projector, magnifying glass"], ["Diverging (concave)", "Thin middle", "Always virtual, upright, smaller — never projected", "Glasses for short-sightedness, peepholes"]] },
  { type: "paragraph", text: "Ray diagram rules (draw two, find the image): 1) a ray parallel to the axis passes through the focus F; 2) a ray through the centre goes straight on. Their crossing (or backward projection) marks the image. Magnification = image height ÷ real height: a 5 mm object imaging at 15 mm is ×3 — show the ratio. The eye's lens does this live: ciliary muscles flex it, focusing near and far." },
  { type: "example", text: "Required practical — the ripple tank: a motor dips a bar into shallow water, strobing the waves. Measure f (bars of the strobe), λ (crest spacing on the screen with a ruler), then v = fλ — and compare with measured wave speed. Slide barriers into the tank for diffraction (gap ≈ λ spreads most); two dipper bars for interference patterns. The tank is waves made visible — every property from one sheet of water." },
  { type: "heading", level: 2, text: "10. Summary — the wave spine" },
  { type: "table", headers: ["Observation", "Because", "Key phrase"], rows: [["Echo takes longer than expected", "There-and-back double journey", "÷ 2 for distance"], ["Light bends entering glass", "Speed changes at the boundary", "Toward the normal, denser medium"], ["Sound bends round corners, light doesn't", "Gap ≈ wavelength for diffraction", "Metres vs nanometres"], ["Bright and dark fringes", "Path differences add/cancel", "Young's proof of wave nature"], ["X-rays shielded by lead", "Ionising — penetrates soft tissue", "Density stops them"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'calculate' shows v = fλ (or echo ÷2) with units; 'explain' names the mechanism (speed change, path difference, gap ratio); 'describe the image' states real/virtual, upright/inverted, magnified/diminished — three adjectives, every time." },
];

const WAVE_QS: Q[] = [
  { q: "A wave with f = 5 Hz and λ = 2 m travels at", o: ["2.5 m/s", "10 m/s", "7 m/s", "0.4 m/s"], a: "10 m/s", e: "v = fλ = 5 × 2. Show the substitution.", d: "easy" },
  { q: "An echo returns in 1.2 s (sound 340 m/s). The wall is", o: ["408 m away", "204 m away — divide by 2", "1.2 km away", "283 m away"], a: "204 m away — divide by 2", e: "There-and-back: the ÷2 is the trap.", d: "easy" },
  { q: "Total internal reflection requires", o: ["denser → less dense AND angle > critical angle", "any angle in glass", "a mirror surface", "less dense → denser"], a: "denser → less dense AND angle > critical angle", e: "Both conditions named — one without the other scores half.", d: "medium" },
  { q: "You hear around corners but cannot see around them because", o: ["sound is louder", "sound's wavelength is comparable to the gap — it diffracts; light's is not", "light is too fast", "walls reflect sound"], a: "sound's wavelength is comparable to the gap — it diffracts; light's is not", e: "Gap-vs-wavelength is the diffraction rule.", d: "medium" },
  { q: "Young's double slit proves light is a wave because", o: ["light bends in glass", "bright AND dark fringes appear — particles would make two bright patches", "light travels fast", "colours split in prisms"], a: "bright AND dark fringes appear — particles would make two bright patches", e: "Destructive interference is the wave signature.", d: "medium" },
  { q: "Sound cannot travel through a vacuum because", o: ["it is too fast", "it needs particles to compress — longitudinal waves have no medium to oscillate", "vacuums absorb sound", "it turns into light"], a: "it needs particles to compress — longitudinal waves have no medium to oscillate", e: "The bell-jar experiment: silence as air leaves.", d: "easy" },
  { q: "Which radiation ionises?", o: ["Radio", "Infrared", "Ultraviolet, X-rays, gamma", "Microwave"], a: "Ultraviolet, X-rays, gamma", e: "Enough per-photon energy to strip electrons and damage DNA.", d: "easy" },
  { q: "A 5 mm object images at 15 mm. The magnification is", o: ["×0.33", "×3", "×10", "×15"], a: "×3", e: "image ÷ real = 15/5. State upright/inverted too.", d: "easy" },
  { q: "In refraction, the frequency of light", o: ["changes with speed", "stays constant — the source sets it; wavelength and speed change", "doubles", "becomes zero"], a: "stays constant — the source sets it; wavelength and speed change", e: "The trap: only λ and v change together.", d: "hard" },
  { q: "A converging lens with the object INSIDE the focus gives", o: ["a real inverted image", "a virtual upright magnified image — the magnifying glass", "no image", "a smaller inverted image"], a: "a virtual upright magnified image — the magnifying glass", e: "Beyond F it flips to real/inverted — position decides.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "waves-optics" } });
    if (!topic) throw new Error("master waves-optics topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("waves-optics standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Waves & Optics — Complete", content: { blocks: WAVE_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < WAVE_QS.length; i++) {
      const item = WAVE_QS[i];
      await prisma.question.upsert({
        where: { id: `master-waves-optics-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-waves-optics-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "waves-rebuild", blocks: WAVE_BLOCKS.length, questions: WAVE_QS.length });
  } catch (e) {
    console.error("rebuild waves failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
