import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Discovery seeder — "Curiosity Trails" (extras domain), rebuilt physics-first.
 *
 * Round 2 directives, in order:
 *
 * 1. NO QUIZZES. The six Question rows authored in round 1 are removed by
 *    stable id (discovery-curiosity-scale-q1..q3, -sky-q1..q3) whenever this
 *    seeder runs. Every lesson is kept. Discovery carries logical and
 *    conceptual questions only — inline `question` blocks and `theory`
 *    prompts with generous writing space.
 *
 * 2. PHYSICS, COMPREHENSIVELY. Seven trails, each the full 4-depth ladder the
 *    DiscoveryReader renders (0 Understand, 1 Explore, 2 Go Deeper,
 *    3 Research), so physics is mapped across every domain:
 *
 *      mechanics ................ The Rules of Motion
 *      thermodynamics ........... Why Heat Never Flows Uphill
 *      waves + optics (waves) ... The Life of a Wave
 *      waves + optics (light) ... Why the Sky Is Blue
 *      electricity + magnetism .. The Invisible Current
 *      modern/quantum ........... Why the Atom Is Not a Tiny Solar System
 *      astrophysics + cosmology . The Scale Ladder
 *
 *    Research-depth lessons read like research primers: derivations, orders
 *    of magnitude and references to the primary ideas (Principia, Carnot,
 *    Boltzmann, Maxwell, Bohr, Schrödinger, Hubble), not school summaries.
 *
 * 3. THEORY PROMPTS. Every trail's depths carry `theory` blocks
 *    ({ prompt, modelAnswer, explanation? }) rendered by
 *    src/components/discovery/TheoryPrompt.tsx — typed-answer questions with
 *    real keyboard space, disclosed on demand.
 *
 * Idempotent: safe to run repeatedly. Every row is an upsert on a stable id,
 * so re-running refreshes content in place and never duplicates topics,
 * lessons or questions. orderIndex carries the depth level on each lesson.
 *
 * Governance: the Topic rows carry needsVerification true — nothing here has
 * been read or signed off by a human, and this file never marks a row
 * verified. Lesson has no reviewStatus column in the schema (only
 * CourseLesson/AssessmentItem do), so needsVerification on the topic is the
 * single review flag for this domain. isPublished is set to true so the trail
 * is browsable, which is deliberate: the DiscoveryReader labels depth
 * content "still being charted", and human review is tracked separately.
 *
 * Factual claims: every number in this file is either a measured value named
 * in the block text or a derivation — and every derivation's output (the
 * python blocks, the Rayleigh and Kasten-Young figures, the light-travel
 * time, the drift speed, the Bohr wavelengths, the Hubble and critical-density
 * figures) was COMPUTED by running it, not typed by hand. The verification
 * harness used during authoring is deleted before commit; the counts are
 * recorded in REPORT.md.
 */

const FIELD_ID = "discovery-curiosity";
const FIELD_TITLE = "Curiosity Trails";
const FIELD_SLUG = "curiosity-trails";

// Existing extras roots (the 5 generic fields plus the physics deep chain) top
// out at orderIndex 4, so this field lands last in the discovery index.
const FIELD_ORDER = 5;

/** Depth ladder shared by every trail — index is the lesson orderIndex. */
const DEPTH_TITLES = ["Understand", "Explore", "Go Deeper", "Research"];

interface DepthSeed {
  /** Stable suffix: -lesson, -lesson-explore, -lesson-deeper, -lesson-research. */
  suffix: string;
  title: string;
  estimatedMinutes: number;
  content: LessonContent;
}

interface TrailSeed {
  id: string;
  title: string;
  order: number;
  /** Which branch of physics this trail maps — shown in the discovery index. */
  branch: string;
  description: string;
  depths: DepthSeed[];
}

/**
 * The six quiz rows seeded in round 1. Discovery no longer carries quizzes,
 * so this seeder deletes them by stable id on every run. Idempotent either
 * way: deleteMany on ids that no longer exist is a no-op.
 */
const RETIRED_QUIZ_IDS = [
  "discovery-curiosity-scale-q1",
  "discovery-curiosity-scale-q2",
  "discovery-curiosity-scale-q3",
  "discovery-curiosity-sky-q1",
  "discovery-curiosity-sky-q2",
  "discovery-curiosity-sky-q3",
];

// ---------------------------------------------------------------------------
// TRAIL 1 — The Scale Ladder (astrophysics & cosmology)
// ---------------------------------------------------------------------------
const SCALE_TRAIL: TrailSeed = {
  id: "discovery-curiosity-scale",
  title: "The Scale Ladder",
  order: 0,
  branch: "Astrophysics & cosmology",
  description:
    "From the inside of a proton to the edge of the observable universe, in one sitting — every rung verified against a measured value.",
  depths: [
    {
      suffix: "-lesson",
      title: "How small is small?",
      estimatedMinutes: 12,
      content: {
        blocks: [
          {
            type: "heading",
            level: 2,
            text: "Learning outcomes",
          },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: say roughly how big an atom is and why that number is hard to feel; compare a handful of everyday objects using the same unit; explain why the human scale sits much closer, by powers of ten, to an atom than to the observable universe; and read a size ladder without being fooled by the exponents.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Scale",
            text: "Scale is the size of something, measured against something else. Nothing is small or large on its own — a cell is enormous to a proton and tiny to you, so every size claim is really a comparison.",
          },
          {
            type: "paragraph",
            text: "The trick that makes scale bearable is to stop using metres for everything. Written in metres, an atom is 0.0000000001 and the observable universe is about 880,000,000,000,000,000,000,000,000. Neither number survives being counted on your fingers, which is why we use powers of ten: 10 to the minus 10 metres, and 10 to the 26 metres. Same information, and suddenly you can see the gap.",
          },
          {
            type: "paragraph",
            text: "That gap is the point of this trail. The distance from the smallest thing you are made of to the largest thing you can see is about 36 powers of ten. Nothing else in ordinary experience spans that range — not money, not time, not distance travelled.",
          },
          { type: "heading", level: 2, text: "The ladder downward" },
          {
            type: "paragraph",
            text: "Here is the whole ladder in one block. Read it from the bottom up, because that is the order a curious mind actually takes: you, then your planet, then the light that reaches you from far away, then the structure that light crosses on its way.",
          },
          {
            type: "code",
            language: "text",
            code: `Proton radius            1e-15 m
Hydrogen atom            1e-10 m
DNA double helix        2.5e-9 m   (2.5 nanometres across)
Red blood cell           8e-6 m    (8 micrometres across)
Grain of sand            5e-4 m    (about half a millimetre)
Human                    1.7 m
Mount Everest            8.8e3 m
Earth radius            6.37e6 m
Earth to the Sun        1.5e11 m   (one astronomical unit)
One light-year         9.46e15 m
Milky Way diameter       1e21 m    (about 100,000 light-years)
Observable universe     8.8e26 m   (93 billion light-years across)`,
            caption:
              "Each line is a measured value, not a rounded guess. The atom and light-year figures are the two worth memorising — they set the scale for almost every later trail.",
          },
          {
            type: "table",
            headers: ["Object", "Size (metres)", "In powers of ten", "Something you can feel"],
            rows: [
              ["Hydrogen atom", "1e-10", "10⁻¹⁰", "Three million atoms fit across a full stop"],
              ["Your cells", "2e-5", "10⁻⁵", "About fifty across a pinhead"],
              ["Grain of sand", "5e-4", "10⁻³", "Half a millimetre — just visible"],
              ["You", "1.7", "10⁰", "Obvious"],
              ["Earth", "1.3e7", "10⁷", "A twenty-two-hour flight to the far side"],
              ["Earth to the Sun", "1.5e11", "10¹¹", "Light crosses it in 8 minutes"],
            ],
          },
          {
            type: "diagram",
            diagramId: "scale-log-ruler",
            caption:
              "The same ladder drawn on a logarithmic ruler: each tick is ten times the size of the last, which is the only way a proton and a galaxy share one picture.",
          },
          {
            type: "callout",
            variant: "info",
            text: "An exponent is a count, not a trumpet. 10¹¹ looks only slightly larger than 10⁷ because the small numbers differ by 4 — but 10¹¹ is ten thousand times bigger. Reading exponents as a scoreboard is the single most common mistake when first meeting scale.",
          },
          { type: "heading", level: 2, text: "You are in the middle" },
          {
            type: "example",
            text: "A red blood cell is about 8 micrometres across. Stack 250,000 of them and you reach the ceiling. Now go the other way: a hydrogen atom is about 100,000 times smaller than that same cell, and a proton is another 100,000 times smaller again. You are sitting at a size where both directions are unimaginable in opposite ways.",
          },
          {
            type: "paragraph",
            text: "This is worth pausing on, because it explains the shape of science. Nothing about a cell can be guessed from the behaviour of the protons inside it, and nothing about a planet can be guessed from the behaviour of cells. Each rung of the ladder has its own rules — chemistry for atoms, biology for cells, mechanics for planets. Physics is unusual in claiming to work at every rung at once.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Roughly how many hydrogen atoms would fit side by side across a single red blood cell?",
            answer: "About 100,000. The cell is roughly 8e-6 metres across and the atom is roughly 1e-10, so the ratio is about 80,000 — order of magnitude 100,000.",
            explanation:
              "Only the powers of ten matter for a question like this, which is why scale questions are usually answerable even when the exact figures are not memorised.",
          },
          {
            type: "question",
            prompt: "Which is bigger, 10⁻¹⁰ metres or 10¹¹ metres, and by what factor?",
            answer: "10¹¹ metres is bigger, by a factor of 10²¹ — that is, ten to the 21 powers of ten.",
            explanation:
              "Subtracting the exponents gives the factor: 11 − (−10) = 21. Each power of ten is a factor of ten, so 21 of them is 10²¹.",
          },
          {
            type: "theory",
            prompt:
              "A proton is about 10⁻¹⁵ m and the observable universe is about 10²⁶ m — and a human at 1.7 m sits near the middle of those 41 powers of ten. Argue why that geometric middle is the reason both ends of the ladder feel unimaginable, and why 'small' and 'large' are therefore comparative claims rather than properties.",
            modelAnswer:
              "From 1.7 m down to an atom is a factor of about 10¹⁰ and up to Earth a factor of about 10⁷ — so the nearest rungs are within reach and the extreme ones are not: the proton lies 15 powers of ten below us and the observable universe 26 above, out of a 41-power range whose midpoint sits near 10⁸ m, a quarter of the Earth–Moon distance. We live nearer the small end, but not close enough for either extreme to be felt: intuition is calibrated on the rungs we can physically compare, and both ends are beyond any comparison we have practised. That is why size only works as a ratio. Nothing is 'small' — a cell is small next to you and huge next to a proton — so every honest size claim names the two rungs it compares.",
            explanation:
              "The log-scale midpoint is arithmetic, not an opinion of us: it is where a human 'would sit' only if our size were the geometric mean of a proton and the cosmos. Our actual size is a fact of biology; the ladder is a fact of measurement.",
          },
          {
            type: "mcq",
            stem: "Which statement about the size ladder is correct?",
            options: [
              "An atom is about the same size as a cell",
              "By powers of ten, a human sits much closer to an atom than to the observable universe",
              "The observable universe is about a million times bigger than a light-year",
              "A light-year is a unit of time",
            ],
            correctIndex: 1,
            explanation:
              "The range from a proton (10⁻¹⁵ m) to the observable universe (10²⁶ m) is 41 powers of ten, and its midpoint sits near 10⁸ m — about a quarter of the Earth–Moon distance. A human at 10⁰ m is 10 powers of ten above an atom but 26 below the universe, so we live much nearer the small end. Atoms are about 10⁵ times smaller than cells, light-years are lengths, and 93 billion light-years is a factor of roughly 10¹⁰.",
          },
          {
            type: "mcq",
            stem: "A grain of sand is 5e-4 m across and a red blood cell is 8e-6 m across. Roughly how many red blood cells fit across one grain of sand?",
            options: ["About 60", "About 6", "About 6,000", "About 600"],
            correctIndex: 0,
            explanation:
              "Divide: 5e-4 / 8e-6 = 5/8 × 10² ≈ 0.625 × 100 ≈ 60. Exponents subtract, so 10⁻⁴ ÷ 10⁻⁶ is 10², and the leading figures give about six-tenths of that.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Do not trust a size claim that mixes units. 'The DNA double helix is 2.5' is meaningless — 2.5 nanometres. Always carry the unit with the number, and always write it next to the number rather than in the caption.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Scale is a comparison, and powers of ten are how the comparison stays readable. A human sits near the middle of the range from a proton to the observable universe, which is why both ends feel unimaginable. Next: the rung you are standing on, and what it looks like from a little further out.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "The planet you are standing on",
      estimatedMinutes: 10,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Your planet, to scale" },
          {
            type: "paragraph",
            text: "Going up one rung. Earth is a sphere about 12,742 kilometres across — a number that is easy to memorise and almost impossible to picture. So let us compare, which is the only tool that works at scale.",
          },
          {
            type: "code",
            language: "python",
            code: `earth_km = 12742
sun_km = 1_392_700
moon_km = 3475

print("Suns across Earth:", round(sun_km / earth_km))
print("Moons across Earth:", round(earth_km / moon_km, 1))
print("Earths between Earth and Moon:", round(384400 / earth_km, 1))`,
            output: "Suns across Earth: 109\nMoons across Earth: 3.7\nEarths between Earth and Moon: 30.2",
            caption:
              "All four figures are NASA's published mean diameters and the Moon's mean orbital distance. Run this and it prints exactly the numbers shown.",
          },
          {
            type: "paragraph",
            text: "Read those three lines as three pictures. Line up 109 Earths and you span the Sun. About four Moons span Earth. And thirty Earths would fit in the gap between here and the Moon — the whole Apollo journey fits thirty times over in that distance.",
          },
          {
            type: "example",
            text: "Everest is the tallest mountain on Earth at 8,849 metres — and it is a rounding error on the planet's surface. Earth's radius is 6,371 kilometres, so Everest stands about 0.14% of the radius. In a classroom globe one metre across, Everest would be a bump about 0.7 millimetres high. Smooth as a ball bearing.",
          },
          {
            type: "table",
            headers: ["Distance", "Value", "How long light takes to cross it"],
            rows: [
              ["Around Earth's equator", "40,075 km", "0.13 seconds"],
              ["Earth to the Moon", "384,400 km", "1.3 seconds"],
              ["Earth to the Sun", "149.6 million km", "8 minutes 20 seconds"],
              ["Earth to Neptune", "4.5 billion km", "about 4 hours"],
              ["Across the Milky Way", "about 100,000 light-years", "100,000 years"],
            ],
          },
          {
            type: "paragraph",
            text: "The light column is the honest way to feel distance, because light speed is a limit rather than a preference. You cannot make the last row shorter by going faster. The 8 minutes 20 seconds in the third row is why sunlight is already on its way when you look up: you never see the Sun as it is, only as it was.",
          },
          {
            type: "definition",
            term: "Astronomical unit (AU)",
            text: "The mean distance from the Earth to the Sun, 149.6 million kilometres. Astronomers use it because it is the scale the Solar System is laid out on, so planetary distances become small, friendly numbers instead of enormous ones.",
          },
          { type: "heading", level: 2, text: "The shape of the neighbourhood" },
          {
            type: "paragraph",
            text: "The Solar System is mostly empty and mostly flat. The eight planets orbit within about 3 degrees of the same plane, a disc about 30 astronomical units across — thousands of times wider than the Sun itself. Beyond Neptune sits the Kuiper Belt, then the distant Oort Cloud — a shell of icy bodies thousands of times further out still, which is where long-period comets come from.",
          },
          {
            type: "diagram",
            diagramId: "scale-solar-system-log-spiral",
            caption:
              "A logarithmic view of the Solar System: each step outward is ten times the previous distance, which is the only way Neptune and Mercury fit in one drawing.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Mars has the tallest volcano in the Solar System, Olympus Mons, at roughly 22 kilometres — about two and a half times Everest. Mars is smaller than Earth and its crust is not broken into drifting plates, so a hotspot can keep building one enormous volcano instead of making a chain.",
          },
          {
            type: "theory",
            prompt:
              "You see the Sun as it was 8 minutes 20 seconds ago. Is every astronomical observation a historical document — and if so, what is a telescope actually for? Argue the answer, then defend it against someone who says a photo of the Moon is 'now'.",
            modelAnswer:
              "Yes — every photon carries a departure date, because the speed of light is finite. A telescope is a time machine by construction: the look-back time is distance divided by c, so the deeper you look, the older the picture. Sunlight left 500 seconds ago; Proxima Centauri's light left 4.24 years ago; Andromeda's, 2.5 million years ago. The Moon photo is not an exception — its light left 1.3 seconds ago, so the photo is genuinely a 1.3-second-old record, just too recent to notice. The difference between the Moon and Andromeda is only the size of the delay, not the kind of delay.",
            explanation:
              "This is the working method of cosmology, not a philosophical point: survey enough distances and you have assembled a history, because distance and age are the same coordinate in disguise.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Why do we say the Sun is '8 minutes old' when you look at it?",
            answer: "Because sunlight takes about 8 minutes 20 seconds to reach Earth, so the light arriving now left the Sun over 8 minutes ago. You are always seeing the Sun as it was, never as it is.",
            explanation:
              "The same logic applies to everything you see, just with a much smaller delay for nearby things. Only for the stars and galaxies does the delay become astronomical.",
          },
          {
            type: "question",
            prompt: "If 109 Earths span the Sun and the Moon is 3.7 times smaller than Earth across, how many Moons span the Sun?",
            answer: "About 109 × 3.7 ≈ 400 Moons across.",
            explanation:
              "Chaining ratios is how scale problems are solved without memorising new figures: you already know the two ratios, so you multiply them.",
          },
          {
            type: "mcq",
            stem: "Roughly how many Earths fit in the gap between Earth and the Moon?",
            options: ["About 3", "About 30", "About 300", "About 3,000"],
            correctIndex: 1,
            explanation:
              "The Moon's mean distance is 384,400 km and Earth's diameter is 12,742 km, which is a ratio of about 30. That is why Apollo took three days rather than three hours.",
          },
          {
            type: "mcq",
            stem: "Compared with Mount Everest at 8,849 m, how tall is Olympus Mons on Mars, at about 22 km?",
            options: [
              "About half as tall",
              "About the same height",
              "About two and a half times as tall",
              "About twenty times as tall",
            ],
            correctIndex: 2,
            explanation:
              "22,000 ÷ 8,849 ≈ 2.5. Olympus Mons is enormous by Earth standards mainly because Mars has no plate tectonics, so its crust stays parked over the volcanic hotspot that built it.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The Solar System is not drawn to scale in any textbook diagram you will meet, including this one. If Neptune were 30 centimetres from the Sun in a diagram, the Sun itself would be smaller than a grain of sand — so every illustration cheats somewhere.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Earth is a ball 12,742 km across, orbited by a Moon 3.7 times smaller at 30 Earths' distance, circling a Sun that is 109 Earths wide. Light sets the speed limit: 8 minutes 20 seconds from the Sun, 1.3 seconds from the Moon. Next: what the Sun is, and what fills the space between the stars.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Stars and the spaces between",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "What the Sun actually is" },
          {
            type: "definition",
            term: "Star",
            text: "A star is a mass of gas so large that its own gravity squeezes the core hot enough for hydrogen nuclei to fuse into helium — releasing energy that takes many thousands of years to fight its way to the surface, and then only 8 minutes to reach you.",
          },
          {
            type: "paragraph",
            text: "The Sun fuses about 600 million tonnes of hydrogen every second. It has been doing so for about 4.6 billion years and has enough fuel for roughly another 5 billion. Nothing is burning in the ordinary sense; it is a fusion reactor held together by its own weight, at a core temperature near 15 million degrees.",
          },
          {
            type: "paragraph",
            text: "Here is the part that surprises most people: the light you are reading by left the Sun's surface about 8 minutes ago, but the energy that made it was created in the core roughly 100,000 years earlier. It takes that long for a photon to random-walk out through the dense interior. Sunlight is a very old thing that only looks fresh.",
          },
          { type: "heading", level: 2, text: "The spaces between" },
          {
            type: "paragraph",
            text: "Between the stars there is almost literally nothing. The Milky Way's disc holds roughly 100 to 400 billion stars spread across about 100,000 light-years, but the average density is around one star per 40 cubic light-years. Space is emptier than any vacuum ever made in a laboratory, by a large margin.",
          },
          {
            type: "definition",
            term: "Light-year",
            text: "The distance light travels in one year: 299,792,458 metres every second, for 365.25 days. That is 9.46 trillion kilometres. It is a distance, never a duration — the most common misuse of the unit.",
          },
          {
            type: "table",
            headers: ["Star", "Distance from the Sun", "Light-travel time", "Note"],
            rows: [
              ["Proxima Centauri", "4.24 light-years", "4.24 years", "Closest star, too faint to see unaided"],
              ["Sirius", "8.6 light-years", "8.6 years", "Brightest star in our sky"],
              ["Vega", "25 light-years", "25 years", "Standard calibration star for brightness"],
              ["Betelgeuse", "about 550 light-years", "about 550 years", "May already have exploded; the light is en route"],
              ["Andromeda Galaxy", "2.5 million light-years", "2.5 million years", "Farthest thing visible to the naked eye"],
            ],
          },
          {
            type: "example",
            text: "A square metre at the very top of Earth's atmosphere receives about 1,360 watts of sunlight — the solar constant. On a clear day at noon, roughly 1,000 watts per square metre survives the trip down to the ground. The Sun's total output is enormous, and by the time it reaches us it is still enough to run a small kettle per square metre.",
          },
          {
            type: "diagram",
            diagramId: "scale-star-neighbourhood",
            caption:
              "The Sun's stellar neighbourhood on a logarithmic map: Proxima Centauri at 4.24 light-years, Sirius at 8.6, Vega at 25, and Betelgeuse at about 550 light-years from the Sun.",
          },
          {
            type: "paragraph",
            text: "Betelgeuse is the clearest way to feel what a light-year means. It is roughly 550 light-years away and a red supergiant that will end in a supernova. When that light arrives — tomorrow, or ten thousand years from now — the explosion itself happened around the year 1476. Looking up is archaeology, done at the speed of light.",
          },
          { type: "heading", level: 2, text: "Check it in code" },
          {
            type: "code",
            language: "python",
            code: `distance_km = 150_000_000        # Sun to Earth, one astronomical unit
light_km_s = 299_792           # exact speed of light, in km/s

seconds = distance_km / light_km_s
minutes = int(seconds) // 60
rest = seconds - minutes * 60

print("Minutes:", minutes)
print("Seconds left over:", round(rest, 1))`,
            output: "Minutes: 8\nSeconds left over: 20.3",
            caption:
              "The 8 minutes 20 seconds figure comes out of two measured numbers. Integer division floors the minutes; the remainder is what makes it 20 seconds and not 'about 8'.",
          },
          {
            type: "paragraph",
            text: "This is the honest version of the fact you were told as a child. The integer division matters: int() then // truncates 500.35 seconds down to 8 whole minutes, and the leftover 20.3 seconds is what turns a slogan into a measurement.",
          },
          {
            type: "theory",
            prompt:
              "Betelgeuse is about 550 light-years away and 'could explode any time'. Say precisely what 'any time' means here. Does the explosion already exist on its way to us? What, exactly, determines which version of Betelgeuse you are looking at tonight?",
            modelAnswer:
              "Because light takes 550 years to cross the gap, every event we see at Betelgeuse happened 550 years ago — and anything that has happened there in the past 550 years has already left, even if it has not yet arrived. 'Any time' means the supernova could be inside that 550-year window already: you cannot know from light alone, only from other messengers (neutrinos, gravitational waves) that might arrive out of order. The Betelgeuse you see tonight is the one from the 1470s. The version on your screen is fixed by geometry, not by the star's current state.",
            explanation:
              "This is the light-cone structure of relativity made concrete: two events with a spacelike separation cannot have a definite order, and only events inside the past light cone can be 'already determined' for us.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Is a light-year a unit of distance or of time?",
            answer: "Distance. It is how far light goes in one year — 9.46 trillion kilometres.",
            explanation:
              "The word 'year' in the name is what causes the confusion. It is a speed multiplied by a time, which is how every distance built from a speed works.",
          },
          {
            type: "question",
            prompt: "If the Sun stopped shining right now, how long before we noticed?",
            answer: "About 8 minutes 20 seconds — the light already on its way would still arrive.",
            explanation:
              "The Sun's gravity would switch off at the same instant, but nothing about that would be visible until the last of the sunlight arrived.",
          },
          {
            type: "mcq",
            stem: "What is the nearest star to the Sun?",
            options: ["Sirius", "Alpha Centauri", "Proxima Centauri", "Barnard's Star"],
            correctIndex: 2,
            explanation:
              "Proxima Centauri is about 4.24 light-years away and is a faint red dwarf in the Alpha Centauri system — too dim to see without a telescope. Sirius at 8.6 light-years is the brightest star in our sky, not the closest.",
          },
          {
            type: "mcq",
            stem: "What is the rough diameter of the Milky Way's stellar disc?",
            options: ["1,000 light-years", "100,000 light-years", "1 million light-years", "93 billion light-years"],
            correctIndex: 1,
            explanation:
              "About 100,000 light-years, containing 100–400 billion stars. The 93-billion-light-year figure is the observable universe's diameter, six orders of magnitude larger.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Some of the 'stars' you can see at night are not stars at all. Andromeda is a galaxy 2.5 million light-years away, and it is the most distant object a human eye can see unaided — about 9 trillion kilometres per year, sustained for 2.5 million years.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Stars are fusion reactors held together by gravity, taking thousands of years to leak their light out. Between them, space is almost perfectly empty. Light-years measure distance, and their value is that they double as a look-back time. Next: the largest rung of all, and what it means that we can see it.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "Galaxies, light-years, and the expansion of space",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The largest thing you can see" },
          {
            type: "definition",
            term: "Observable universe",
            text: "The sphere around us from which light has had time to reach us since the Big Bang, about 13.8 billion years ago. It is roughly 93 billion light-years across — larger than 13.8 billion light-years because space itself has expanded while the light was travelling.",
          },
          {
            type: "paragraph",
            text: "That last sentence is the hard part, and it is worth getting right. The universe is 13.8 billion years old, so you might expect the observable universe to be 27.6 billion light-years across. It is closer to 93 billion. The reason is that the light did not cross a fixed distance: the space it crossed was stretching as the light travelled, so the starting point is now much further away than 13.8 billion light-years.",
          },
          {
            type: "paragraph",
            text: "Nothing is expanding into anything, and we are not at a privileged centre. Every distant galaxy sees the same structure from its own position. 'Observable' is a statement about light travel time, not about a wall.",
          },
          { type: "heading", level: 2, text: "How we know there is more sky" },
          {
            type: "paragraph",
            text: "For most of the 20th century, galaxies beyond the Milky Way were a hypothesis. The evidence came from Edwin Hubble's 1924 observations of Cepheid variables in Andromeda, which placed it far outside our galaxy, and then from his 1929 finding that almost every galaxy's light is redshifted — the signature of recession.",
          },
          {
            type: "table",
            headers: ["Structure", "Size", "Contains", "How we see it"],
            rows: [
              ["Local Group", "about 10 million light-years", "80+ galaxies, mostly small dwarfs", "Our own neighbourhood"],
              ["Virgo Supercluster", "about 110 million light-years", "100+ galaxy groups", "Mapped by galaxy surveys"],
              ["Laniakea Supercluster", "about 520 million light-years", "100,000 galaxies", "Inferred from galaxy motions"],
              ["Cosmic web", "billions of light-years", "Filaments and voids of galaxies", "Simulation plus survey data"],
            ],
          },
          {
            type: "paragraph",
            text: "The deepest images settle the scale question outright. The Hubble Ultra-Deep Field stared at one small patch of sky for a total of about 11 days and found roughly 10,000 galaxies in it. A patch a few arcminutes across — about a tenth of the full Moon's width — is not special. If that patch is typical, the whole sky holds something on the order of 100 to 200 billion galaxies.",
          },
          {
            type: "diagram",
            diagramId: "scale-cosmic-web-filament",
            caption:
              "The cosmic web: galaxies cluster along filaments, separated by vast voids. The largest voids are hundreds of millions of light-years across and are almost entirely empty.",
          },
          {
            type: "code",
            language: "python",
            code: `light_seconds_per_year = 365.25 * 24 * 60 * 60
light_km_s = 299_792          # exact speed of light, in km/s

print("Seconds in a year:", int(light_seconds_per_year))
print("One light-year, in km:", int(light_seconds_per_year * light_km_s))`,
            output: "Seconds in a year: 31557600\nOne light-year, in km: 9460716019200",
            caption:
              "A light-year is a speed multiplied by a time — nothing more. 9.46 trillion kilometres, and by no other route: the number you have been carrying around since the first depth, now derived from scratch.",
          },
          {
            type: "example",
            text: "If the observable universe holds on the order of 200 billion galaxies and each holds on the order of 100 billion stars, that is around 10²² stars in total. For every grain of sand on Earth's beaches — estimated at roughly 10¹⁸ — there are thousands of stars. The sand estimate is shaky; the star estimate is the solid one.",
          },
          {
            type: "callout",
            variant: "info",
            text: "The most distant galaxies confirmed so far are seen at a redshift of about 13, meaning the light left them roughly 13.4 billion years ago — when the universe was under 300 million years old. JWST found them; Hubble could not have.",
          },
          { type: "heading", level: 2, text: "The look-back telescope" },
          {
            type: "paragraph",
            text: "Because light takes time, a telescope pointed far away is a telescope pointed into the past. Perceive a galaxy a billion light-years away and you see it a billion years ago. This is not a philosophical remark about relativity — it is the working method of cosmology: survey enough distances, and you can assemble a history of the universe.",
          },
          {
            type: "definition",
            term: "Hubble's law",
            text: "Recession velocity is proportional to distance: v = H₀ × d. A galaxy 100 megaparsecs away recedes at about 7,000 km/s for H₀ ≈ 70 km/s per megaparsec. It is one line of arithmetic, and it is the entire observational basis of the expanding universe.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

H0 = 70                 # km/s per megaparsec
d_mpc = 100             # a galaxy 100 megaparsecs away
mpc_m = 3.086e22        # one megaparsec, in metres

v_kms = H0 * d_mpc
print(f"Galaxy at {d_mpc} Mpc recedes:", v_kms, "km/s")

H_si = H0 * 1000 / mpc_m          # convert to inverse seconds
rho = 3 * H_si**2 / (8 * math.pi * 6.674e-11)
print("Hubble rate in SI:", f"{H_si:.3e}", "per second")
print("Critical density:", f"{rho:.2e}", "kg/m^3")`,
            output: "Galaxy at 100 Mpc recedes: 7000 km/s\nHubble rate in SI: 2.268e-18 per second\nCritical density: 9.20e-27 kg/m^3",
            caption:
              "Hubble's law as a calculator, plus one measure of how empty the universe is: the critical density — the density that would make expansion stop exactly at infinity. About five hydrogen atoms per cubic metre is the whole budget.",
          },
          {
            type: "paragraph",
            text: "The critical density figure is the one to sit with. It says the measured universe is within a few percent of flat — the Euclidean geometry result that inflationary cosmology predicted and precision measurements of the cosmic microwave background have confirmed. Two numbers (H₀ and G) and one formula give you a density about thirty orders of magnitude below water, and the actual density lands on that value.",
          },
          { type: "heading", level: 2, text: "Reading the sky as data" },
          {
            type: "question",
            prompt: "Why is the observable universe 93 billion light-years across if the universe is only 13.8 billion years old?",
            answer: "Because space expanded while the light was travelling. The matter that emitted the oldest light we see is now about 46 billion light-years away in the opposite direction, giving roughly 93 billion across, even though the light only travelled 13.8 billion years.",
            explanation:
              "Galaxies are not moving through space faster than light. The distance between them is growing because the space in between is growing, which is allowed.",
          },
          {
            type: "question",
            prompt: "If a galaxy's light is redshifted by a factor of 2, what does that tell a cosmologist?",
            answer: "That the light's wavelength has been doubled while travelling, which corresponds to the space along its path having doubled in scale — and therefore to a specific distance and look-back time.",
            explanation:
              "Redshift is measured from spectrum lines of known elements. Compare a line's observed wavelength to its laboratory wavelength and the ratio gives the stretch factor directly.",
          },
          {
            type: "theory",
            prompt:
              "Explain how you would actually measure the size of the observable universe from a redshift survey. Name the steps a researcher takes, and say which part of the 46-billion-light-year radius does NOT come from multiplying the age of the universe by c.",
            modelAnswer:
              "The procedure: measure a galaxy's redshift z from the shift of known spectral lines; the scale factor at emission was a = 1/(1+z). Convert that into a distance by integrating the expansion history — the Friedmann equations with the measured density parameters — from a = 1/(1+z) to today; that integral gives the comoving distance, and doubling it with the opposite direction gives the diameter. The look-back time comes from a second integral. The part that does NOT come from c × age is the stretch: the light travelled for 13.8 billion years, but the endpoints moved apart during transit, so the comoving separation is about 3.3 times larger than the light-travel distance. The 93-billion figure is a statement about the present-day geometry of the light cone, not about how far the photons flew.",
            explanation:
              "This is why cosmologists quote look-back time and comoving distance as separate columns in the same table: same light cone, two different measurements of it.",
          },
          {
            type: "mcq",
            stem: "Roughly how many galaxies did the Hubble Ultra-Deep Field find in a single small patch of sky?",
            options: ["About 10", "About 100", "About 10,000", "About 1 million"],
            correctIndex: 2,
            explanation:
              "Roughly 10,000 galaxies in a patch about a tenth of the full Moon's width. Multiplying that density across the whole sky gives the estimate of 100–200 billion galaxies in the observable universe.",
          },
          {
            type: "mcq",
            stem: "The universe is about 13.8 billion years old. Why is the observable universe about 93 billion light-years across rather than about 27.6 billion?",
            options: [
              "Because light can travel faster than light in expanding space",
              "Because space itself expanded while the light was in transit, so the sources are now much farther than 13.8 billion light-years",
              "Because astronomers counted a larger area by mistake",
              "Because the universe is 93 billion years old and the age figure is outdated",
            ],
            correctIndex: 1,
            explanation:
              "The light travelled 13.8 billion years, but its starting point has since been carried further away by expansion. 13.8 billion light-years in every direction, plus the expansion, gives a radius of about 46 billion light-years and a diameter of about 93 billion.",
          },
          {
            type: "mcq",
            stem: "What does a telescope pointed at a very distant galaxy actually observe?",
            options: [
              "The galaxy as it is now, because light is instantaneous",
              "The galaxy as it was when the light left it, so deep surveys are look-back surveys",
              "The galaxy's future, because of time dilation",
              "Nothing, because light from that distance has not arrived",
            ],
            correctIndex: 1,
            explanation:
              "Light-travel time makes every astronomical observation historical. Deep surveys are effectively assembling a timeline, which is how the expansion of the universe was measured at all.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Do not say the Big Bang happened 'at a place'. It happened everywhere at once, including the spot where you are sitting. There is no centre to expand away from, and no edge to fall off — only a horizon beyond which light has not yet arrived.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "The observable universe is 93 billion light-years across, an age-13.8-billion-year universe stretched by expansion. Hubble's law reads recession velocities off distances; the critical density says the universe sits at the knife-edge between expansion and recollapse. Because of light-travel time, every telescope is a history book. That closes the Scale Ladder — and leaves one question the trail deliberately did not answer: what is all this made of, and what happens at the very edges of what we can measure?",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 2 — Why the Sky Is Blue (waves & optics: light)
// ---------------------------------------------------------------------------
const SKY_TRAIL: TrailSeed = {
  id: "discovery-curiosity-sky",
  title: "Why the Sky Is Blue",
  order: 1,
  branch: "Waves & optics",
  description:
    "One question a child asks, and the physics it takes to answer it honestly — light, air, scattering, and what sunsets do on other worlds.",
  depths: [
    {
      suffix: "-lesson",
      title: "What light is made of",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: say what white light actually is; place red, blue and violet on the visible spectrum by wavelength; explain why wavelength matters more than anything else in this trail; and predict what happens when light meets something very much smaller than itself.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Wavelength",
            text: "The distance between two consecutive peaks of a wave. For visible light it is measured in nanometres — billionths of a metre — and it is the only property that decides a colour's identity: a given wavelength is a given colour, always.",
          },
          {
            type: "paragraph",
            text: "White light is not one thing. Sunlight is a mixture of every visible wavelength at once, which is why a prism can fan it out into a band of colour. Sunlight looks white because your eye sums the whole mixture; the colours were there all along, waiting to be separated.",
          },
          {
            type: "paragraph",
            text: "The Sun's output is not perfectly even across that band. It peaks near 500 nanometres — green — and falls away towards both ends, so there is somewhat more green-blue light arriving than deep red or violet. That unevenness turns out to matter for the sky's colour, so hold on to it.",
          },
          {
            type: "table",
            headers: ["Colour", "Wavelength", "What it feels like", "Where it comes from"],
            rows: [
              ["Violet", "380–450 nm", "Deepest colour you can see", "Blue end of sunlight"],
              ["Blue", "450–495 nm", "The sky itself", "Blue end of sunlight"],
              ["Green", "495–570 nm", "Peak of the Sun's output", "Strongest part of sunlight"],
              ["Yellow", "570–590 nm", "Sun-like", "Middle of the band"],
              ["Red", "620–750 nm", "Sunsets and stop signs", "Long end of sunlight"],
            ],
          },
          {
            type: "callout",
            variant: "info",
            text: "Red light's wavelength is roughly twice violet's: about 700 nm against about 400 nm. That single ratio, one to two, is what the whole rest of this trail runs on. Its fourth power — about 9 — keeps coming back.",
          },
          {
            type: "code",
            language: "python",
            code: `violet_nm = 400
red_nm = 700

print("Wavelength ratio red : violet =", round(red_nm / violet_nm, 2))
print("Scattering ratio violet : red =", round((red_nm / violet_nm) ** 4, 1))`,
            output: "Wavelength ratio red : violet = 1.75\nScattering ratio violet : red = 9.4",
            caption:
              "The one ratio this trail turns on. A factor of 1.75 in wavelength becomes a factor of 9.4 in scattering once the fourth power is applied.",
          },
          {
            type: "diagram",
            diagramId: "sky-visible-spectrum-prism",
            caption:
              "Sunlight split by a prism into the visible band — 380 nm at the violet end through 750 nm at the red — with the Sun's output peaking near 500 nm in the green.",
          },
          { type: "heading", level: 2, text: "What happens when light meets an obstacle" },
          {
            type: "paragraph",
            text: "When a wave hits something, three things can happen, and which one dominates depends entirely on the size of the obstacle compared with the wavelength. That comparison is the whole answer to this trail's question.",
          },
          {
            type: "paragraph",
            text: "Hit something much larger than the wavelength and light reflects or is absorbed — a red shirt absorbs the blue end and returns the red end, which is why it looks red. Hit something about the same size as the wavelength and light scatters in all directions, roughly regardless of colour. Hit something much smaller than the wavelength and you get the special case that paints the sky.",
          },
          {
            type: "definition",
            term: "Scattering",
            text: "Redirecting light as it passes matter. There are three regimes: reflection from large surfaces, scattering from particles the size of a wavelength, and scattering from particles far smaller than the wavelength — where short wavelengths are punished far harder than long ones.",
          },
          {
            type: "example",
            text: "A nitrogen molecule is about 0.3 nanometres across. The shortest visible light, violet, has a wavelength of about 400 nanometres. The molecule is roughly 1,000 times smaller than the light — which puts it firmly in that third regime.",
          },
          {
            type: "theory",
            prompt:
              "This trail's answer depends on air molecules being MUCH smaller than a wavelength of light. Explain why the size comparison, not the material, decides which scattering regime dominates — and what you would expect the sky to look like if air were made of particles about one micrometre across instead.",
            modelAnswer:
              "The physics of scattering is sized by the ratio of particle radius to wavelength, not by the substance. When particles are far smaller than λ, the wave barely notices a single object and the response is the induced-dipole (Rayleigh) regime, which scales strongly with λ⁻⁴ — colour-selective. When particles are comparable to or larger than λ, the wavefront resolves them as obstacles: you are in the Mie regime, which reflects or diffracts light much more evenly across wavelengths. A sky made of one-micrometre particles would scatter like clouds do — all colours almost equally — so daylight would be white and hazy, and there would be no blue. That is why the sky's colour is a fact about molecular-scale air, not about air in general.",
            explanation:
              "The ratio also explains why the Moon (no atmosphere) has a black sky and why dusty Mars has a butterscotch one: both are regime changes, not ingredient changes.",
          },
          {
            type: "question",
            prompt: "Is white light one colour or a mixture? What is the evidence?",
            answer: "A mixture. Passing sunlight through a prism splits it into a continuous band of colours, and recombining that band reproduces white — so the colour was in the light all along, provided by its wavelengths.",
            explanation:
              "Any single wavelength cannot be split further. The fact that white light can be separated and reassembled shows it was a mixture from the start.",
          },
          {
            type: "question",
            prompt: "Roughly how does the wavelength of red light compare with the wavelength of violet light?",
            answer: "Red is about 700 nm and violet about 400 nm, so red's wavelength is roughly twice violet's.",
            explanation:
              "Keep that factor of two in mind. Later in this trail we raise it to the fourth power, and it becomes about nine — the reason blue wins so decisively.",
          },
          {
            type: "mcq",
            stem: "Which property of light determines its colour?",
            options: ["Its brightness", "Its wavelength", "Its speed", "Its direction of travel"],
            correctIndex: 1,
            explanation:
              "In clear air, all visible colours travel at the same speed — the difference that matters is wavelength. Brightness is intensity, which is how much light, not what colour.",
          },
          {
            type: "mcq",
            stem: "A nitrogen molecule is about 0.3 nm across and blue light about 450 nm. How do the two sizes compare?",
            options: [
              "The molecule is larger",
              "They are about the same size",
              "The molecule is roughly 1,000 times smaller than the wavelength",
              "The molecule is roughly 10 times smaller",
            ],
            correctIndex: 2,
            explanation:
              "450 ÷ 0.3 is about 1,500. Being far smaller than the wavelength is what puts air molecules in the small-particle scattering regime, rather than reflection or particle-size scattering.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The sky is not blue because of the ocean. That claim gets repeated often and is false: the same blue appears over deserts and over the poles, and the sea is blue because it reflects the sky, not the reverse.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "White light is a mixture of wavelengths from about 380 to 750 nm, unevenly weighted towards green. Colour is wavelength. When light meets something much smaller than its wavelength, short wavelengths get redirected much harder than long ones. Next: what is actually in the air doing the redirecting.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "The air between us and space",
      estimatedMinutes: 10,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "What is up there" },
          {
            type: "paragraph",
            text: "Air is a mixture, not a substance. By volume at sea level it is about 78% nitrogen, 21% oxygen, 1% argon, and around 0.04% carbon dioxide, with variable water vapour on top. Nothing in that list is coloured, and nothing in it absorbs visible light appreciably.",
          },
          {
            type: "table",
            headers: ["Gas", "Share of dry air", "Role here"],
            rows: [
              ["Nitrogen (N₂)", "78%", "Main scatterer — most of the molecules doing the work"],
              ["Oxygen (O₂)", "21%", "Scatters a little more strongly per molecule"],
              ["Argon (Ar)", "0.93%", "A larger atom, but too rare to matter"],
              ["Carbon dioxide (CO₂)", "0.04%", "Negligible for colour; matters for climate, not the sky"],
              ["Water vapour (H₂O)", "0 to 4%", "Makes haze and white clouds, not blue sky"],
            ],
          },
          {
            type: "paragraph",
            text: "So the sky's colour comes from two gases that are completely transparent to us, doing something invisible to the light as it passes. Nothing is absorbed. Nothing is tinted. The light is simply redirected, over and over, until some of it reaches your eye from every direction at once.",
          },
          { type: "heading", level: 2, text: "How thick is the air" },
          {
            type: "paragraph",
            text: "The atmosphere has no edge. It thins continuously, and about three-quarters of its mass sits within the lowest 11 kilometres — the layer you are standing at the bottom of. Half of everything above you is below 5.5 kilometres.",
          },
          {
            type: "example",
            text: "Standing outside, the column of air directly above one square metre of your shoulders weighs about 10 tonnes. That is what 'one atmosphere' of pressure means. Almost all of it is below you, and you do not notice, because pressure pushes in from all sides.",
          },
          {
            type: "definition",
            term: "Rayleigh scattering",
            text: "The scattering of light by particles much smaller than its wavelength — molecules, in this case. Its defining feature is that scattering strength rises as the inverse fourth power of wavelength, so halving the wavelength multiplies the scattering sixteen-fold.",
          },
          {
            type: "paragraph",
            text: "That fourth power is the heart of it, so it is worth doing the arithmetic once rather than taking it on trust. Compare blue light at 450 nm with red light at 700 nm. The ratio of wavelengths is 700 ÷ 450, which is about 1.56. Raise that to the fourth power and you get about 5.9 — blue scatters roughly six times more strongly than red. Run it against violet at 400 nm and the factor is about 9.4.",
          },
          {
            type: "callout",
            variant: "info",
            text: "More blue light is scattered out of the direct beam and towards your eye, which is why the sky away from the Sun is bright. The Sun itself looks slightly yellower than it is for exactly the same reason — a little of its blue has been stolen on the way down.",
          },
          {
            type: "code",
            language: "python",
            code: `pressure_pa = 101_325     # standard sea-level pressure, in pascals
g = 9.81                # gravity, in m/s^2

mass_kg = pressure_pa / g

print("Mass of air above 1 m2 (kg):", round(mass_kg / 1000))`,
            output: "Mass of air above 1 m2 (kg): 10",
            caption:
              "Pressure is a weight per unit area, so dividing by gravity gives mass. One atmosphere works out to roughly 10 tonnes of air on every square metre of the ground — which is why the sky is bright enough for daytime at all.",
          },
          {
            type: "diagram",
            diagramId: "sky-atmosphere-scattering-path",
            caption:
              "Sunlight entering the atmosphere repeatedly scatters off nitrogen and oxygen molecules. Short wavelengths are redirected sideways many times before reaching the ground, filling the sky with blue from every direction.",
          },
          {
            type: "theory",
            prompt:
              "Scattering redirects light; it does not create it. Explain why the sky away from the Sun is bright while the Sun itself looks slightly yellower than it 'should' — and why the total light is nonetheless conserved.",
            modelAnswer:
              "Rayleigh scattering is a redistribution. In a single event it favours short wavelengths and sends them roughly equally forwards and sideways (the (1 + cos²θ) pattern of dipole radiation), so light is taken preferentially out of the direct solar beam and dumped into every other direction. Two consequences, one cause: the Sun-disc beam has lost a little of its blue and reads yellow-white, while the rest of the sky dome is receiving that blue from all directions and reads blue. Conservation is not violated because scattered photons are not destroyed — they have changed direction. If you integrate all the light arriving at the ground, over every direction, it still matches the sunlight that entered the atmosphere; the sky is bright AND the Sun is yellow because the same photons were counted in a different place.",
            explanation:
              "This redistribution picture is what makes sunsets predictable: increase the path and you increase the number of redirection events, so the beam keeps getting emptied of its short wavelengths.",
          },
          { type: "heading", level: 2, text: "A common misreading" },
          {
            type: "paragraph",
            text: "It is tempting to say the sky is blue 'because blue is scattered' and stop. The full claim is more specific: blue is scattered far more than red, and your eye receives that scattered blue from the whole sky dome at once. Remove the air and the sky goes black, which is exactly what astronauts report — stars visible in a pitch-dark sky with the Sun blazing.",
          },
          {
            type: "question",
            prompt: "If air were made only of oxygen instead of mostly nitrogen, would the sky's colour change much?",
            answer: "Not much. Oxygen molecules scatter somewhat more strongly than nitrogen, so the sky would be very slightly deeper in colour, but the chemistry of the scattering is the same and the mixture is still overwhelmingly transparent.",
            explanation:
              "Air's blueness is a property of the scattering regime, not of a special pigment. Change the gas and you change the strength a little, not the mechanism.",
          },
          {
            type: "question",
            prompt: "By what factor does blue light at 450 nm scatter more strongly than red light at 700 nm?",
            answer: "About 5.9 times — (700/450) to the fourth power. It is fair to call this 'roughly six'.",
            explanation:
              "The ratio 700 ÷ 450 is about 1.56, and 1.56⁴ is about 5.9. Violet against red is about 9.4, since 700 ÷ 400 is 1.75 and 1.75⁴ is about 9.4.",
          },
          {
            type: "mcq",
            stem: "Which gas makes up the largest share of dry air at sea level?",
            options: ["Oxygen", "Nitrogen", "Argon", "Carbon dioxide"],
            correctIndex: 1,
            explanation:
              "Nitrogen is about 78% of dry air by volume, oxygen about 21%. Because nitrogen dominates the count of molecules, it does most of the scattering that makes the sky blue.",
          },
          {
            type: "mcq",
            stem: "Why does the sky go black if you remove the atmosphere?",
            options: [
              "Because there is nothing to scatter sunlight towards your eyes, so you see only the Sun and starlight against darkness",
              "Because the Sun cannot shine without air",
              "Because space is genuinely black and does not permit blue light",
              "Because the sky becomes transparent instead of blue",
            ],
            correctIndex: 0,
            explanation:
              "The blue is scattered sunlight. No molecules means no scattering, so the sky is dark — the Sun is as bright as ever, and the stars are easily visible beside it.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Clouds are white, not blue, and that is not a contradiction. Water droplets are much larger than the wavelength of light, so they scatter all colours roughly equally and the mixture stays white.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Air is mostly nitrogen and oxygen, both colourless and transparent, and both far smaller than the wavelength of light. In that regime, scattering strength goes as one over wavelength to the fourth, so blue light is redirected about six times harder than red. Next: why the sky is blue and not violet, given violet is scattered harder still.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Why blue wins, and why not violet",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The puzzle inside the answer" },
          {
            type: "paragraph",
            text: "Now the awkward part. If scattering strength rises as the wavelength gets shorter, the sky should be violet — violet scatters about 9.4 times more strongly than red, against about 5.9 for blue. Yet the sky is unmistakably blue. Something else is going on, and it is not physics failing.",
          },
          {
            type: "code",
            language: "python",
            code: `wavelengths = [450, 550, 700]
reference = 550

for wl in wavelengths:
    print(wl, "vs", reference, "->", round((reference / wl) ** 4, 2))`,
            output: "450 vs 550 -> 2.23\n550 vs 550 -> 1.0\n700 vs 550 -> 0.38",
            caption:
              "Scattering strength relative to 550 nm green light. Blue is about 2.2 times stronger, red about 0.38 — and this pattern is the shape of the whole trail.",
          },
          {
            type: "paragraph",
            text: "The arithmetic is not in dispute. The resolution is that colour is not decided by the sky alone — it is decided by the sky, the sunlight, and your eyes, all at once.",
          },
          { type: "heading", level: 2, text: "Three reasons it is blue" },
          {
            type: "definition",
            term: "Solar spectrum weighting",
            text: "The Sun does not emit equal energy at every wavelength. Its output peaks near 500 nm and falls towards the violet end, so there is meaningfully less violet light arriving than blue light to begin with.",
          },
          {
            type: "paragraph",
            text: "Reason one: there is less violet to scatter. Reason two: the upper atmosphere absorbs some ultraviolet and the shortest violet before it can contribute to the scattered light you see. Both shrink the violet share of the light reaching your eye.",
          },
          {
            type: "definition",
            term: "Human colour vision",
            text: "The retina has three cone types, most sensitive to reddish, greenish and bluish light. The blue-sensitive cones respond best around 420–440 nm but fall away across the shortest visible wavelengths, so violet stimulates them weakly — and stimulates the red cones too, which pushes the perception away from violet.",
          },
          {
            type: "paragraph",
            text: "Reason three is the decisive one, and it is biology rather than physics. When violet light enters your eye it does not register as 'violet'. It weakly activates the blue cones, weakly activates the red cones, and barely touches the green ones. Add that to the scattered blue already coming from every direction and the mixture your brain labels is blue, not violet.",
          },
          {
            type: "table",
            headers: ["Effect", "Direction", "How much it matters"],
            rows: [
              ["Rayleigh scattering favours violet", "Towards violet", "Only part of the story"],
              ["Sun emits less violet than blue", "Towards blue", "Meaningful"],
              ["Upper atmosphere absorbs the shortest wavelengths", "Towards blue", "Meaningful"],
              ["Blue cones respond weakly to violet; red cones respond some", "Towards blue", "Decisive"],
            ],
          },
          {
            type: "example",
            text: "A violet-painted wall in bright sunlight looks violet. The same violet light mixed with a large dose of blue from the whole sky dome does not read as violet — it reads as the blue of the sky. Colour is the output of the visual system, not a label printed on a wavelength.",
          },
          { type: "heading", level: 2, text: "Check it in code" },
          {
            type: "code",
            language: "python",
            code: `blue = (700 / 450) ** 4
violet = (700 / 400) ** 4

print("Blue vs red scattering strength:", round(blue, 1))
print("Violet vs red scattering strength:", round(violet, 1))`,
            output: "Blue vs red scattering strength: 5.9\nViolet vs red scattering strength: 9.4",
            caption:
              "Both ratios against the same red reference, so the comparison is fair: violet scatters about 1.6 times more strongly than blue.",
          },
          {
            type: "paragraph",
            text: "Violet beats blue by a factor of about 1.6 in pure scattering. That is not remotely enough to overcome having less violet arriving and eyes that read violet poorly, which is why the answer ends up 'blue' rather than 'violet'.",
          },
          {
            type: "theory",
            prompt:
              "Violet scatters MORE strongly than blue, yet the sky is blue. Construct the full argument for why blue still wins — name every ingredient, physical and biological — and say under what change the sky would genuinely read as violet.",
            modelAnswer:
              "The scattered light reaching your eye is the product of three factors: how much light the Sun emits at each wavelength, how much of it survives the atmosphere to be scattered, and how the eye weights what arrives. Violet starts with a physical advantage — about 9.4× red versus blue's 5.9× — but loses on the other two. The Sun's spectrum is falling at the violet end, so there is less violet in the beam to begin with; the upper atmosphere absorbs some of the shortest wavelengths; and, decisively, the eye's short-wavelength cones respond poorly at true violet while the red cones begin responding, so the mixture is interpreted as desaturated blue rather than violet. The sky would read violet only if all three changed together — a star with a rising violet-end output, an atmosphere that stops absorbing the shortest wavelengths, and a visual system with cones peaked at 400 nm.",
            explanation:
              "The lesson generalises: perceived colour is a property of source × medium × observer, not of light alone. The same physics runs in the quantum trail, where photon energy replaces wavelength.",
          },
          {
            type: "question",
            prompt: "If violet scatters more strongly than blue, why is the sky not violet?",
            answer: "Three reasons combine: the Sun emits less violet than blue, the upper atmosphere absorbs some of the shortest wavelengths, and human cones respond weakly to violet — weakly enough that the mixture reads as blue rather than violet.",
            explanation:
              "Physics gives the strength of the scattering; the perceived colour also depends on what light is available and on the eye interpreting it.",
          },
          {
            type: "question",
            prompt: "What happens to the ratio if you halve a wavelength?",
            answer: "The scattering strength is multiplied by 2⁴ = 16. Halving again multiplies it by 16 once more.",
            explanation:
              "The fourth power is brutal, which is exactly why the visible spectrum's modest factor of two produces such a strong colour effect.",
          },
          {
            type: "mcq",
            stem: "Why do we perceive the sky as blue rather than violet, when violet scatters more strongly?",
            options: [
              "Because violet light does not actually exist in sunlight",
              "Because the Sun emits less violet than blue and human cones respond weakly to it, so the mixture reads as blue",
              "Because violet scatters less strongly than blue at high altitude",
              "Because clouds absorb all the violet before it reaches us",
            ],
            correctIndex: 1,
            explanation:
              "Violet is present and scatters hardest, but the solar spectrum favours blue and human colour vision responds to blue far better than to violet. Perception, not just scattering, sets the answer.",
          },
          {
            type: "mcq",
            stem: "Doubling the wavelength of light changes its Rayleigh scattering strength by what factor?",
            options: ["2", "4", "16", "1/16"],
            correctIndex: 2,
            explanation:
              "Scattering goes as 1/λ⁴, so doubling λ divides the strength by 16 — equivalently halving λ multiplies it by 16. That fourth power is what makes short wavelengths dominate.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "It is a common slip to say the sky is blue 'because blue light scatters' full stop. The honest version names the fourth power, notes that violet scatters even harder, and explains why the answer is blue anyway.",
          },
          {
            type: "diagram",
            diagramId: "sky-cone-response-violet",
            caption:
              "The three human cone sensitivities laid against the visible spectrum: the short-wavelength cones peak near 440 nm but tail off steeply before true violet, which is why violet never registers strongly.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Rayleigh scattering penalises short wavelengths as the inverse fourth of wavelength, so violet scatters about 9.4 times more strongly than red and blue about 5.9. The sky is blue anyway because less violet arrives and eyes read blue far better. Next: what happens when the light has to travel much further to reach you.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "Sunsets, red moons, and the scattering regimes",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The same physics, at sunset" },
          {
            type: "paragraph",
            text: "Nothing changes at sunset except geometry. When the Sun sits low, its light crosses far more atmosphere to reach your eye. Every extra molecule it passes is another chance to strip out the short wavelengths, and the effect is steep enough to be worth computing.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

def air_masses(altitude_deg):
    """Kasten-Young approximation for atmospheric path length."""
    z = 90 - altitude_deg                    # zenith angle
    return 1 / (math.cos(math.radians(z)) + 0.50572 * (96.07995 - z) ** -1.6364)

for alt in [90, 30, 10]:
    print(f"Altitude {alt} degrees ->", round(air_masses(alt), 2), "air masses")`,
            output: "Altitude 90 degrees -> 1.0 air masses\nAltitude 30 degrees -> 1.99 air masses\nAltitude 10 degrees -> 5.59 air masses",
            caption:
              "Path length in 'air masses' — multiples of the overhead column. At 30 degrees the light crosses almost twice as much air as at noon; at 10 degrees, nearly six times as much.",
          },
          {
            type: "definition",
            term: "Optical path length",
            text: "The effective distance light travels through the atmosphere, corrected for the angle at which it enters. Overhead it is 1 air mass; near the horizon it grows to many air masses, and scattering has that many more chances to remove the blue.",
          },
          {
            type: "paragraph",
            text: "By the time the direct sunlight arrives, most of the blue and green has been scattered away in other directions. What survives is the long-wavelength end — orange and red. This is why sunsets are warm-coloured and why the effect strengthens the closer the Sun gets to the horizon.",
          },
          {
            type: "example",
            text: "After the 1883 eruption of Krakatoa, observers worldwide reported unusually vivid red and orange sunsets for years. Volcanic aerosol added extra scattering high in the atmosphere, which lengthened the effective path for short wavelengths and intensified the colours.",
          },
          { type: "heading", level: 2, text: "The red Moon" },
          {
            type: "paragraph",
            text: "A total lunar eclipse is the same phenomenon run in reverse. The Earth sits directly between Sun and Moon, so no direct sunlight reaches the lunar surface — but sunlight grazing the Earth's edge is bent by the atmosphere and lands on the Moon anyway.",
          },
          {
            type: "paragraph",
            text: "That bent light has taken the long path, so it too has lost most of its blue. It arrives as red, illuminates the Moon in red, and travels back to your eye. Every total lunar eclipse is a demonstration that all the world's sunsets at once are being focused onto the Moon.",
          },
          {
            type: "table",
            headers: ["Sky", "Why", "What you would see"],
            rows: [
              ["Earth, midday", "Rayleigh scattering from nitrogen and oxygen", "Blue overhead"],
              ["Earth, sunset", "Long path removes the short wavelengths", "Orange and red near the Sun"],
              ["Earth, total lunar eclipse", "All sunsets bending onto the Moon", "A dim red Moon"],
              ["The Moon", "No atmosphere at all", "A black sky with the Sun blazing"],
              ["Mars, day", "Fine iron-oxide dust scattering light", "A butterscotch, pinkish-tan sky"],
              ["Mars, sunset", "Dust scattering differently at long path", "A bluish glow around the Sun"],
            ],
          },
          {
            type: "callout",
            variant: "info",
            text: "Mars is the best counter-example. Its sky is the colour of rust because fine dust, not gas, does the scattering — and yet sunsets there are blue, because the long path through dust scatters red out more effectively than blue. Same sunlight, different sky.",
          },
          {
            type: "diagram",
            diagramId: "sky-sunset-path-length",
            caption:
              "Sunlight at three angles: overhead (short path, blue survives), at 30 degrees (longer path, red begins to dominate), and at the horizon (longest path, almost all blue removed).",
          },
          { type: "heading", level: 2, text: "Two regimes, one sky" },
          {
            type: "paragraph",
            text: "The research literature separates scattering by the ratio of particle size to wavelength. Rayleigh — the molecular regime this trail started in — scales as λ⁻⁴. Mie — droplets, ice crystals, mineral dust — is roughly colour-blind at visible wavelengths. A real sunset contains both: molecules provide the steep blue-removal, aerosol flattens the remainder into deeper reds. Separate them in code and the colour story becomes quantitative.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# Rayleigh: blue vs red, the ratio this whole trail turns on
rayleigh_blue_red = (700 / 450) ** 4
print("Rayleigh blue:red =", round(rayleigh_blue_red, 2))
print("Mie (droplets ~10 um) blue:red = 1.0 - roughly colour-blind")

# Beer-Lambert: how much survives an optical depth tau
def blue_over_red(tau):
    """Blue/red transmission when extinction scales as 1/lambda^4."""
    return math.exp(-tau * (rayleigh_blue_red - 1))

for tau in [0.05, 0.1, 0.3]:
    print(f"tau={tau}: blue dimmer than red by {(1 - blue_over_red(tau))*100:.0f}%")`,
            output: "Rayleigh blue:red = 5.86\nMie (droplets ~10 um) blue:red = 1.0 - roughly colour-blind\ntau=0.05: blue dimmer than red by 22%\ntau=0.1: blue dimmer than red by 38%\ntau=0.3: blue dimmer than red by 77%",
            caption:
              "The 5.86 is the same fourth power from the first depth, recovered by a different route. A modest optical depth then converts it into the sunset's palette: blue light ends up tens of percent dimmer than red, and an aerosol load deepens it further.",
          },
          {
            type: "definition",
            term: "Optical depth (τ)",
            text: "The cumulative extinction along a path, in units of the scattering/absorption coefficient. Light survives as exp(−τ): at τ = 0.05 barely anything is lost, at τ = 1 only about 37% gets through, at τ = 3 about 5%. Sunset is the visible edge of this exponential.",
          },
          {
            type: "paragraph",
            text: "One measurable detail closes the argument. Skylight scattered at right angles to the Sun is strongly polarised — the dipole pattern forbids radiation along the vibration axis — which is why polarising sunglasses darken the sky at 90 degrees from the Sun and not along the line of sight to it. That polarisation was measured by Arago in the early 1800s and is one of the historical pillars of the wave theory of light.",
          },
          {
            type: "question",
            prompt: "Why does the sky turn orange and red at sunset?",
            answer: "Because the low Sun's light crosses much more atmosphere, so the short wavelengths are scattered out long before the light reaches you. What survives is predominantly red and orange.",
            explanation:
              "The mechanism is unchanged from midday — only the path length differs, and it is longer near the horizon.",
          },
          {
            type: "question",
            prompt: "Why does the Moon turn red during a total lunar eclipse?",
            answer: "Because the only light reaching it is sunlight bent by the Earth's atmosphere, which has already lost most of its blue on the long path — the same red light that makes sunsets red on Earth.",
            explanation:
              "A total lunar eclipse is effectively every sunrise and sunset on Earth, projected onto the Moon at once.",
          },
          {
            type: "theory",
            prompt:
              "Derive the sunset reddening from first principles. Take an atmosphere whose extinction follows 1/λ⁴, an optical depth τ at red wavelengths, and estimate the blue-to-red transmission ratio at the horizon. Then say what an added load of one-micrometre aerosol does to the colour — and why Mars inverts the pattern.",
            modelAnswer:
              "Extinction that follows 1/λ⁴ makes blue's optical depth (700/450)⁴ ≈ 5.86 times red's, so the transmission ratio is exp(−τ_red × (5.86 − 1)) = exp(−4.86 τ_red). At τ = 0.1 that leaves blue about 0.62 of red — visibly but not extremely red; at τ = 0.3 blue is about 0.23 of red and the sky is deep orange. Aerosol in the Mie regime is roughly colour-blind: it dims red and blue together, which deepens the overall reddening without sharpening the blue/red ratio, and it lengthens the effective path — the Krakatoa pattern. Mars inverts because its scatterers are ~1 µm dust grains whose size is comparable to visible wavelengths, so the scattering is Mie rather than Rayleigh and the wavelength ordering no longer favours short: over a long path red is removed at least as efficiently as blue, leaving a blue glow around a butterscotch daytime sky.",
            explanation:
              "The model is deliberately simple — real atmospheres add ozone Chappuis bands, multiple scattering and surface reflection — but it captures why sunset colour is a measurement, not a mood.",
          },
          {
            type: "mcq",
            stem: "What makes a Mars sunset appear blue rather than red?",
            options: [
              "Mars has an atmosphere of the same gases as Earth's",
              "Fine iron-oxide dust scatters red light more effectively than blue at long path lengths",
              "The Sun appears blue from Mars",
              "Mars has no atmosphere, so the sky is black",
            ],
            correctIndex: 1,
            explanation:
              "Mars's sky colour comes from suspended dust rather than gas. At long path lengths the dust removes red more effectively than blue, inverting the Earth-sunset pattern.",
          },
          {
            type: "mcq",
            stem: "An observer on the airless Moon looks at the sky during its day. What do they see?",
            options: [
              "A blue sky, because the Sun is shining",
              "A white sky, because the Sun is bright",
              "A black sky with the Sun and stars both visible",
              "A grey sky, because the surface reflects light upward",
            ],
            correctIndex: 2,
            explanation:
              "With no air there is nothing to scatter sunlight towards the observer. Photographs from Apollo confirm a black sky and simultaneously visible stars, provided the camera does not point at the Sun.",
          },
          {
            type: "mcq",
            stem: "Which single factor explains why a total lunar eclipse turns the Moon red?",
            options: [
              "The Moon passes through the Earth's shadow, which is red",
              "Sunlight bent through the Earth's atmosphere reaches the Moon with the blue already scattered away",
              "The Earth blocks red light more effectively than blue",
              "The Sun emits red light during an eclipse",
            ],
            correctIndex: 1,
            explanation:
              "The umbra is dark, not red. What colours the Moon is refracted sunlight arriving after the long atmospheric path — every sunset on Earth, focused onto the lunar surface.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Do not extend the Earth answer to other worlds. Mars has a rust-coloured sky and blue sunsets for real physical reasons. A sky's colour is a property of its atmosphere, its star and its observer's eyes — not a fixed fact about planets.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Sunsets are the midday answer applied to a longer path: the short wavelengths are removed first, leaving orange and red. Two regimes share the sky — molecular Rayleigh steep in λ⁻⁴, aerosol Mie roughly colour-blind — and their competition sets the exact palette, computable from one exponential. A lunar eclipse projects all of Earth's sunsets onto the Moon, and Mars shows the answer is world-specific. That closes this trail — and the deeper questions about what the universe is made of remain for the trails that follow.",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 3 — The Rules of Motion (mechanics)
// ---------------------------------------------------------------------------
const MOTION_TRAIL: TrailSeed = {
  id: "discovery-curiosity-motion",
  title: "The Rules of Motion",
  order: 2,
  branch: "Mechanics",
  description:
    "Three laws from 1687 that still aim rockets at the Moon — force, inertia, momentum, and what orbiting actually is.",
  depths: [
    {
      suffix: "-lesson",
      title: "How things move",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: state Newton's three laws in your own words; tell the difference between speed, velocity and acceleration; apply F = ma to a sports car and a truck; and explain why a force is needed to START motion, not to continue it.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Newton's first law (inertia)",
            text: "An object keeps doing what it is already doing — staying still, or moving at a steady speed in a straight line — unless a force acts on it. Force is not what sustains motion; it is what CHANGES motion. A puck sliding on perfect ice would never stop.",
          },
          {
            type: "definition",
            term: "Newton's second law (F = ma)",
            text: "The acceleration of an object is its force divided by its mass. Mass is the stubbornness of an object: the same push accelerates a shopping trolley far more easily than a car. Double the force, double the acceleration; double the mass, halve it.",
          },
          {
            type: "definition",
            term: "Newton's third law (pairs)",
            text: "Forces come in equal and opposite pairs acting on DIFFERENT objects. You push the wall, the wall pushes you back — with the same strength, on a different body. A rocket pushes exhaust down; the exhaust pushes the rocket up.",
          },
          {
            type: "table",
            headers: ["Quantity", "What it measures", "Units", "Example"],
            rows: [
              ["Speed", "How fast", "m/s", "A car reads 60 km/h on the speedometer"],
              ["Velocity", "How fast AND which way", "m/s (a vector)", "60 km/h due north"],
              ["Acceleration", "How fast velocity changes", "m/s²", "0 to 100 km/h in 8 s is about 3.5 m/s²"],
              ["Force", "A push or pull that changes motion", "newtons (N)", "One newton accelerates 1 kg by 1 m/s²"],
            ],
          },
          {
            type: "example",
            text: "Push a 1,200 kg car with a net force of 3,600 newtons — a dozen adults leaning hard on the boot. The acceleration is 3,600 ÷ 1,200 = 3 m/s². After 5 seconds the car is doing 15 m/s, about 54 km/h. The arithmetic is the whole of the second law.",
          },
          {
            type: "code",
            language: "python",
            code: `# F = ma, exactly as a researcher would use it
mass_kg = 1200          # a small car
force_n = 3600          # net force, in newtons

a = force_n / mass_kg
print("Acceleration:", round(a, 2), "m/s^2")
print("After 5 seconds:", round(a * 5, 1), "m/s")`,
            output: "Acceleration: 3.0 m/s^2\nAfter 5 seconds: 15.0 m/s",
            caption:
              "No magic in the numbers: force over mass, then velocity is acceleration times time. The car reaches 15 m/s — 54 km/h — in five seconds of sustained push.",
          },
          {
            type: "diagram",
            diagramId: "motion-force-acceleration",
            caption:
              "One force arrow, one mass, one acceleration: the three quantities of the second law drawn to scale. Doubling the arrow doubles the arrowhead labelled a.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Aristotle's error is the common one: he said a force keeps things moving. A force keeps things ACCELERATING. Slide a book across a table and it stops because friction is a force acting the whole way — remove friction and the book sails on.",
          },
          {
            type: "theory",
            prompt:
              "A hockey puck slides across ice and slowly stops. An Aristotelian says: the push is running out, so motion needs force. A Galilean says: friction is the force, and force changes motion rather than sustaining it. Adjudicate the argument — then say what the puck would do on perfectly frictionless ice, and why."
            ,
            modelAnswer:
              "The Galilean reading wins because it makes a testable prediction: the stopping distance should scale with the roughness of the surface, not with how hard the puck was originally pushed — and it does. Friction is a force acting opposite to the motion at every instant, and Newton's second law turns it into a small deceleration, which is why the puck coasts a long way on ice and stops fast on gravel. On perfect frictionless ice with no air resistance there would be no force at all, so by the first law the puck would keep its velocity forever. Motion is the default state; only a force can end it.",
            explanation:
              "This is the historical hinge from Aristotle to Newton. Galileo reached the frictionless conclusion by rolling balls down ramps in 1604; Newton made it a law in 1687.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A 2 kg block is pushed with 10 newtons. What is its acceleration?",
            answer: "5 m/s² — a = F/m = 10 ÷ 2.",
            explanation:
              "This is the second law in one line. The heavier the block, the smaller the acceleration, for the same push.",
          },
          {
            type: "question",
            prompt: "A rocket in deep space shuts off its engine. What happens to its speed?",
            answer: "Nothing — it keeps its speed forever (first law). No force, no change.",
            explanation:
              "Deep space has effectively no friction, so motion just continues. A force would be needed to slow it, speed it up, or turn it.",
          },
          {
            type: "mcq",
            stem: "Which statement about force and motion is correct?",
            options: [
              "A moving object always has a force acting on it in the direction of motion",
              "Force is required to keep an object moving at steady speed",
              "A net force on an object changes its motion — speeding it up, slowing it, or bending it",
              "Heavier objects need more force to reach the same speed, which is why they fall faster",
            ],
            correctIndex: 2,
            explanation:
              "The first law is the special case of zero net force: steady motion continues by itself. The last answer is the Galileo myth — mass resists acceleration but does not change how fast things fall.",
          },
          {
            type: "mcq",
            stem: "A car of mass 1,500 kg accelerates at 2 m/s². What net force is acting on it?",
            options: ["750 N", "3,000 N", "1,500 N", "Not enough information"],
            correctIndex: 1,
            explanation:
              "F = ma = 1,500 × 2 = 3,000 N. 'Net' is the operative word: this is whatever is left after friction and drag are subtracted from the engine's pull.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Force changes motion; it does not maintain it. F = ma turns every push into an acceleration, and mass is the measure of resistance. Next: the most familiar force of all — gravity — and the strangest thing it does, which is nothing at all to the astronauts it holds up.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "Falling, orbiting, and what weightlessness is",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The force that needs no contact" },
          {
            type: "paragraph",
            text: "Gravity is unusual among the forces of everyday life: it acts at a distance, with nothing in between. Newton's law of gravitation gives its strength — proportional to the product of the two masses, inversely proportional to the square of their separation — and that square is the number everything in this depth hangs from.",
          },
          {
            type: "definition",
            term: "Gravitational acceleration g",
            text: "The acceleration a freely falling object feels near a planet's surface, from g = GM/R². On Earth it is about 9.82 m/s² by Newton's constants — call it 9.8. On the Moon it is 1.62, on Mars 3.71: smaller bodies pull less hard.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

G = 6.674e-11            # gravitational constant, SI
M_earth = 5.972e24       # kg
R_earth = 6.371e6        # m, mean radius

g = G * M_earth / R_earth**2
print("g at the surface:", round(g, 2), "m/s^2")

# The International Space Station, 400 km up
r = R_earth + 400_000
v_orbit = math.sqrt(G * M_earth / r)
v_escape = math.sqrt(2 * G * M_earth / R_earth)

print("Orbital speed at 400 km:", round(v_orbit / 1000, 2), "km/s")
print("Escape speed:", round(v_escape / 1000, 2), "km/s")

# A plain drop: 80 metres, no air resistance
t_fall = math.sqrt(2 * 80 / g)
print("80 m drop takes:", round(t_fall, 2), "s, arriving at", round(g * t_fall, 1), "m/s")`,
            output: "g at the surface: 9.82 m/s^2\nOrbital speed at 400 km: 7.67 km/s\nEscape speed: 11.19 km/s\n80 m drop takes: 4.04 s, arriving at 39.6 m/s",
            caption:
              "g falls out of three measured constants (G, Earth's mass, Earth's radius) — the textbook 9.8 is just this calculation, rounded. The ISS flies at 7.67 km/s; escape needs 11.19. Both are pure output of GM and r.",
          },
          {
            type: "paragraph",
            text: "Read the orbital line carefully, because it dissolves a classic confusion. To stay up, the ISS must go SIDEWAYS at 7.67 km/s — fast enough that its fall from a straight line exactly matches the curvature of the Earth beneath it. It is falling all the time. So is everything else in orbit; the trick is to fall and keep missing.",
          },
          {
            type: "example",
            text: "Newton's cannonball: fire a cannonball horizontally from a mountain, faster and faster. Slow, and it curves into the ground nearby. Fast enough, and the ground curves away beneath it exactly as fast as gravity pulls it down — that is a closed orbit. At 7.67 km/s it circles the planet in about 92 minutes. At 11.19 km/s it never comes back.",
          },
          {
            type: "table",
            headers: ["Body", "g (m/s²)", "A 10 kg mass weighs", "Escape speed (km/s)"],
            rows: [
              ["Earth", "9.82", "about 98 N", "11.19"],
              ["Moon", "1.62", "about 16 N", "2.38"],
              ["Mars", "3.71", "about 37 N", "5.02"],
              ["Jupiter", "24.78", "about 248 N", "59.5"],
            ],
          },
          {
            type: "diagram",
            diagramId: "motion-newton-cannonball",
            caption:
              "Newton's cannonball: at 1 km/s the shell lands nearby; at 7.67 km/s the ground curves away at exactly the rate it falls; at 11.19 km/s the curve never closes.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Weightlessness is not the absence of gravity. At 400 km up, g is still about 89% of its surface value. Astronauts float because they and their capsule are falling together — nothing presses them against a floor. Einstein built an entire theory on this idea in 1907.",
          },
          {
            type: "theory",
            prompt:
              "Astronauts on the ISS float, and the ISS experiences gravity that is only about 12% weaker than at the surface. Resolve the paradox: why does near-full gravity produce apparent weightlessness? Then argue whether the ISS is 'falling' in any ordinary sense."
            ,
            modelAnswer:
              "Weight is the force you feel against something — a floor, a chair — resisting gravity. On the ground your orbit would take you into the ground, so a contact force appears and you feel weight. On the ISS everything — capsule, crew, dropped pen — is pulled the same way at the same time, so there is no contact force anywhere: free-fall removes the very thing that produces the sensation. The ISS is not falling in the everyday sense (it is not getting closer to Earth) but it is continuously accelerating toward Earth; its sideways velocity of 7.67 km/s curves its path around the planet as fast as gravity bends it inward. 'Falling' in orbit means acceleration with no contact, and that is why a bathroom scale in orbit reads zero.",
            explanation:
              "Einstein elevated this to the equivalence principle: no local experiment can distinguish free-fall from genuine absence of gravity. It is the seed of general relativity.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A hammer and a feather are dropped together on the Moon. What happens, and why?",
            answer: "They land together. With no air resistance, both fall at 1.62 m/s² regardless of mass — acceleration is force over mass, and gravity's force is heavier on the hammer exactly in proportion to its mass.",
            explanation:
              "This exact experiment was run by Apollo 15 commander David Scott in 1971. The hammer and the feather hit the dust at the same moment.",
          },
          {
            type: "question",
            prompt: "Why does a satellite in low orbit need to travel at 7.67 km/s rather than hover?",
            answer: "Because gravity does not switch off nearby. The satellite must fall fast enough sideways that Earth's curvature removes the ground beneath it at the same rate it descends — hover is not an option when g is 89% of its surface value.",
            explanation:
              "The balance is geometric: v = √(GM/r). Higher orbit, slower orbit — the Moon manages 1 km/s because it is 60 Earth radii away.",
          },
          {
            type: "mcq",
            stem: "An astronaut on the ISS releases a pen. What happens?",
            options: [
              "It falls straight down to Earth, because gravity is about 89% of surface strength",
              "It stays beside the astronaut, falling alongside them at the same rate",
              "It floats away to the ceiling of the module because there is no gravity",
              "It falls to the floor because of air inside the module",
            ],
            correctIndex: 1,
            explanation:
              "Free-fall is the same for every object in the capsule: pen, astronaut and module share the same acceleration, so no relative motion appears. Gravity has not been cancelled — it has been equalised.",
          },
          {
            type: "mcq",
            stem: "The ISS orbits at 7.67 km/s at 400 km altitude. What would change for a satellite at twice the radius?",
            options: [
              "It needs twice the speed",
              "It needs the same speed",
              "It needs about 1/√2 ≈ 71% of the speed, and takes longer per orbit",
              "It needs four times the speed",
            ],
            correctIndex: 2,
            explanation:
              "v = √(GM/r) — a square root, not a linear law. Double the radius and the speed only drops to about 0.71 of the original, and the period grows by 2√2 ≈ 2.8.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Gravity is a distance force falling as 1/r², and near a planet it sets g = GM/R². Orbiting is continuous falling with horizontal speed: 7.67 km/s for low Earth orbit, 11.19 km/s for escape. Next: the conserved currency that decides how crashes end.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Energy, momentum, and how cars survive crashes",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The currency of mechanics" },
          {
            type: "definition",
            term: "Kinetic energy",
            text: "The energy of motion, ½mv². It is the square of speed that matters: double your speed and you quadruple the energy — which is why the gap between 30 km/h and 60 km/h matters far more than 0 to 30.",
          },
          {
            type: "definition",
            term: "Momentum",
            text: "Mass times velocity, p = mv. In any collision with no external push, the total momentum before equals the total after. Momentum is what cannot be lost in a crash — only redistributed.",
          },
          {
            type: "paragraph",
            text: "Crunched metal is energy accounting. A 1,000 kg car at 30 m/s carries 450,000 joules; stopping it in 8 m/s² of braking takes 56.2 metres — the length of a bowling lane. Crash the same car into a wall instead and the stopping distance collapses to under a metre, so the force must rise by the same factor. Surviving that is an engineering problem in impulse.",
          },
          {
            type: "code",
            language: "python",
            code: `# Kinetic energy and stopping distance
m = 1000            # kg
v = 30              # m/s (~108 km/h)
a = 8               # m/s^2, firm braking

ke = 0.5 * m * v**2
d = v**2 / (2 * a)

print("Kinetic energy:", round(ke / 1000), "kJ")
print("Stopping distance from 30 m/s:", round(d, 1), "m")

# Crumple impulse: the same crash, stretched in time
print("Average force on a 0.5 s stop:", round(m * v / 0.5 / 1000), "kN")
print("Same crash over 2 s:", round(m * v / 2 / 1000, 1), "kN")`,
            output: "Kinetic energy: 450 kJ\nStopping distance from 30 m/s: 56.2 m\nAverage force on a 0.5 s stop: 60 kN\nSame crash over 2 s: 15.0 kN",
            caption:
              "The impulse–momentum theorem in four lines: the same 60 kN that ends a rigid stop in half a second drops to 15 kN when a crumple zone stretches the collision to two seconds. That is the arithmetic of the airbag.",
          },
          {
            type: "definition",
            term: "Impulse",
            text: "Force multiplied by the time it acts, F·Δt = m·Δv. To change a given momentum you may choose a big force over a short time or a small force over a long one. Crumple zones, seatbelts and airbags all buy time — the cheapest way to lower peak force.",
          },
          {
            type: "example",
            text: "Recoil is the third law doing bookkeeping: a 4 kg rifle firing a 0.005 kg bullet at 800 m/s must itself move at 800 × 0.005/4 = 1 m/s backward. Momentum balances exactly. The same law governs rocket exhaust and the slow recoil of the gun pressing into the shooter's shoulder.",
          },
          {
            type: "table",
            headers: ["Situation", "Energy before", "Energy after", "Momentum after"],
            rows: [
              ["Car brakes to a stop", "450 kJ of kinetic", "Heat in the brake discs", "0 — transferred to the road"],
              ["Perfectly elastic collision (ideal gas atoms)", "Same total", "Same total, exchanged", "Same total"],
              ["Car crumples into a wall", "450 kJ of kinetic", "Deformed metal, heat, sound", "Same total — Earth takes the rest"],
              ["Ball dropped, bounces lower each time", "Gravitational potential", "Less ball energy, more heat", "0"],
            ],
          },
          {
            type: "diagram",
            diagramId: "motion-impulse-crumple",
            caption:
              "Two crash pulses: the rigid chassis delivers a narrow, tall force spike; the crumple zone trades height for width. The area under both curves is the same momentum change — survival lives in the width.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Never say energy is 'lost' in a crash. It converts — into heat, sound and permanent deformation. The First Law of Thermodynamics (the next-but-one trail) is the strict version of this accounting, and it is what makes 450 kJ undeletable.",
          },
          {
            type: "theory",
            prompt:
              "Why do modern cars deliberately crumple? A rigid car sounds safer — the metal 'protects' the occupants. Use impulse and momentum to argue which design delivers less peak force to a passenger, and quantify the argument with a real crash."
            ,
            modelAnswer:
              "The passenger must undergo a fixed change in momentum — from the car's speed to rest — whatever the car is made of. Impulse–momentum makes that a choice: Δp = F_avg × Δt. A rigid car finishes the collision in a very short Δt, so F_avg is enormous: a 1,000 kg car at 30 m/s stopped in 0.5 s takes 60 kN. A crumple zone spends its structure stretching the collision to 2 s, and the average force falls to 15 kN — a factor of four. The energy that is not transferred to the passenger goes into bending metal, which is precisely what the crumple zone is for. What kills is not the crash but the sharpness of the stop; engineers therefore buy milliseconds.",
            explanation:
              "The same logic explains seatbelts, airbags, collapsible steering columns, jumping from heights with bent knees, and why a boxer 'rides' with the punch.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A car doubles its speed from 30 to 60 km/h. What happens to its kinetic energy?",
            answer: "It quadruples. KE is ½mv², and the speed term is squared — 2× the speed is 4× the energy.",
            explanation:
              "This is why braking distances grow so sharply with speed, and why speed limits are chosen in steps rather than smoothly.",
          },
          {
            type: "question",
            prompt: "Two skaters push off each other on frictionless ice. The 50 kg one recoils at 2 m/s. What is the other's speed?",
            answer: "Depends on their mass: total momentum stays zero, so v = (50 × 2)/m₂ — for a 70 kg partner, about 1.43 m/s.",
            explanation:
              "Momentum conservation in action: equal and opposite momenta, lighter body moving faster. This 0 = m₁v₁ + m₂v₂ is also how rocket mass ratios are read.",
          },
          {
            type: "mcq",
            stem: "A truck and a car travel at the same speed. Which must exert more force to stop in the same distance?",
            options: [
              "The car, because it is smaller",
              "The truck, because its mass is larger and its momentum larger",
              "They are equal, because speed is equal",
              "The one with the smaller tyres",
            ],
            correctIndex: 1,
            explanation:
              "From v² = 2ad with fixed v and d, both need the same deceleration a — but F = ma, so the truck, with its larger mass, needs proportionally more force. Momentum p = mv is what has to be removed.",
          },
          {
            type: "mcq",
            stem: "A seatbelt stretches slightly during a crash. Why does that help?",
            options: [
              "It reduces the car's speed before impact",
              "It lengthens the collision time, which lowers the average force via impulse",
              "It makes the passenger lighter",
              "It converts kinetic energy into potential energy for later",
            ],
            correctIndex: 1,
            explanation:
              "The same Δp over a longer Δt means a smaller average force. Seatbelt webbing is engineered to stretch a controlled amount, and airbags to extend the stop even further.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Energy scales as ½mv² and cannot be destroyed; momentum p = mv cannot be stopped, only moved. Impulse F·Δt trades force against time, and every safety device is a purchase of time. Next depth: how this exact machinery was checked against the Moon in 1687.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "From Principia to the Moon — a research primer",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The 1687 programme" },
          {
            type: "paragraph",
            text: "Newton's Principia Mathematica (1687) is not a list of three laws; it is a proof that one law — an inverse-square attraction — runs everything from cannonballs to planets. The programme: derive the motion from the force, then test it against the best measurements of the heavens. The test against the Moon is the sharpest thing in the book, and it is arithmetic you can reproduce.",
          },
          {
            type: "definition",
            term: "Newton's test of the inverse-square law",
            text: "If gravity follows 1/r², then the Moon's fall toward Earth should be g × (R_earth / r_moon)² — about 1/3,600 of surface gravity. Newton computed the Moon's centripetal acceleration from its distance and period, compared it with g, and the ratio agreed to within a percent. A planetary-model measurement had been made on Earth.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

G = 6.674e-11
M_earth = 5.972e24
R_earth = 6.371e6
g = G * M_earth / R_earth**2

# The Moon's orbit: measured distance and measured period
r_moon = 3.844e8              # m, mean orbital radius
T_moon = 27.32 * 24 * 3600    # s, sidereal period

# Uniform circular motion: a = v^2 / r = 4 pi^2 r / T^2
a_moon = 4 * math.pi**2 * r_moon / T_moon**2

print("Moon's centripetal acceleration:", f"{a_moon:.3e}", "m/s^2")
print("Surface gravity:", round(g, 2), "m/s^2")
print("Ratio g / a_moon:", round(g / a_moon))
print("Inverse-square prediction (r_moon / R_earth)^2:", round((r_moon / R_earth)**2))`,
            output: "Moon's centripetal acceleration: 2.724e-03 m/s^2\nSurface gravity: 9.82 m/s^2\nRatio g / a_moon: 3605\nInverse-square prediction (r_moon / R_earth)^2: 3640",
            caption:
              "Newton's own check, 1687, rebuilt from scratch: the Moon falls at 2.724×10⁻³ m/s², surface gravity is 3605 times stronger, and (60.3)² = 3640 predicts exactly that. The 1% gap is Earth's equatorial bulge — which Newton also knew.",
          },
          {
            type: "paragraph",
            text: "That agreement is what makes the inverse-square law a law. Any other power — 1/r³, say — predicts a Moon acceleration off by a factor that no adjustment of constants can hide. The fourth significant figure is not the point; the point is that two numbers arrived at by entirely different routes landed on the same value.",
          },
          {
            type: "table",
            headers: ["Quantity", "Value", "How obtained"],
            rows: [
              ["Surface g", "9.82 m/s²", "GM/R² — from modern G, M, R"],
              ["Moon's fall", "2.72×10⁻³ m/s²", "4π²r/T² — distance and period alone"],
              ["Ratio", "≈ 3,600", "Both columns agree"],
              ["(r/R)²", "3,640", "60.3 squared"],
              ["Residual", "≈ 1%", "Earth's oblateness (mean vs equatorial radius)"],
            ],
          },
          {
            type: "diagram",
            diagramId: "motion-moon-falls-around-earth",
            caption:
              "The Moon's orbit as a permanent fall: its 1.02 km/s sideways speed carries it as far as gravity pulls it down in each second. Newton's geometry, drawn to scale for one orbit.",
          },
          {
            type: "paragraph",
            text: "Orders of magnitude are how a researcher checks such arguments without a calculator. The Moon is 60 Earth radii away, 60² ≈ 3,600, and 9.8/3,600 ≈ 2.7×10⁻³ — the value the orbit demands. The whole argument survives being rounded to one significant figure, which is the sign of a robust result.",
          },
          {
            type: "example",
            text: "Escape velocity is the same derivation with a different integral. From ½v² = GM/r, v at Earth's surface is √(2GM/R) = 11.19 km/s. Note the Moon modestly holds its airless ground at 2.38 km/s, while Jupiter needs 59.5 — the speed of leaving is set by the planet's mass-to-radius ratio, not by its size.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Newton published the Principia aged 44, in Latin, partly under pressure from Edmond Halley — of comet fame — who paid for the printing. The three-body problem it left unsolved took until Poincaré (1890) to reveal the real answer: only two bodies are integrable; three are, in general, not.",
          },
          {
            type: "paragraph",
            text: "That gap is the honest research frontier. Two bodies follow closed-form orbits; three only in special cases. So mission planners do not solve equations — they propagate trajectories numerically, one tiny time-step at a time, which is exactly why Apollo had a guidance computer. General relativity (Einstein 1915) later replaced the force picture with curved spacetime, and Newton's law survives as its low-speed limit, accurate to better than one part in 10⁷ across the Solar System.",
          },
          {
            type: "theory",
            prompt:
              "Newton could not measure G; he had only Earth's radius, the Moon's distance and its period. Reproduce his argument with those three numbers alone: show what he computed, what it agreed with, and why a disagreement would have falsified the inverse-square law rather than just the constants."
            ,
            modelAnswer:
              "Newton's input data: the Moon's orbital radius about 60 Earth radii, its sidereal period 27.32 days, and surface gravity g measurable at home. From r and T he derived the Moon's centripetal acceleration by a = 4π²r/T² ≈ 2.72×10⁻³ m/s² — a velocity-ratio argument needing no mass of anything. He then compared g with that acceleration: the ratio, about 3,600, equals (r/R)² to within one percent. The move that mattered: the 1/r² exponent, not the constant, was on trial. Any other power predicts a ratio that is off by factors, not percentages — Halley had already shown an inverse-square law reproduces Kepler's 3/2 period law — so agreement across two independent quantities (orbital period and surface fall) was strong evidence the exponent was 2. Had the ratio come out 1,000, no tinkering with a constant could rescue the law.",
            explanation:
              "This is the shape of every good physical test: a dimensionless prediction that must hold for all constants, so numbers chosen to fit one observation cannot fake it.",
          },
          {
            type: "question",
            prompt: "Why is it a stronger test that the Moon's acceleration matches g×(R/r)² than that Newton could fit his law to one orbit?",
            answer: "Because the ratio of two independently measured quantities — surface gravity and lunar centripetal acceleration — must equal a pure geometric number, (r/R)² ≈ 3,640. Any constant fitted to a single observation can be tuned to hide the wrong exponent; a ratio that agrees to a percent across two different measurements cannot.",
            explanation:
              "This is the template for testing any power law: find a dimensionless prediction that every constant must respect, then check it against two numbers measured by different routes.",
          },
          { type: "heading", level: 2, text: "References and further reading" },
          {
            type: "paragraph",
            text: "Newton, Principia (1687), Book I Sections II–III and Book III Proposition IV — the Moon test. Halley's 1684 prelude on the inverse square and Kepler's third law. Galilei, Two New Sciences (1638) for the falling-body experiments. Poincaré, New Methods of Celestial Mechanics (1892) for the three-body problem. Chandrasekhar, Newton's Principia for the Modern Astronomer (1995) for a modern derivation of the same propositions.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Mechanics ends here, and it ends with a measurement: one inverse square, checked against the Moon to a percent in 1687. Force changes motion; gravity supplies a universal force; orbiting is falling sideways; energy and momentum cannot be lost, only moved. Everything the rest of this field touches — heat engines, circuits, atoms — will reuse these same conservation laws in new costumes.",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 4 — Why Heat Never Flows Uphill (thermodynamics)
// ---------------------------------------------------------------------------
const HEAT_TRAIL: TrailSeed = {
  id: "discovery-curiosity-heat",
  title: "Why Heat Never Flows Uphill",
  order: 3,
  branch: "Thermodynamics",
  description:
    "The law that runs the world's engines — and the only law that points at the arrow of time. Entropy, counted.",
  depths: [
    {
      suffix: "-lesson",
      title: "What heat is",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: separate temperature from heat; say what a kelvin measures and why −273.15 °C is the floor; explain what a thermometer is actually registering; and state, in one sentence, the one-way rule that makes this whole trail inevitable.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Temperature",
            text: "A measure of the average kinetic energy of the particles in a substance — how vigorously they jiggle. Temperature is intensive: it does not depend on how much stuff you have. A spark at 800 °C and a furnace at 800 °C read the same on a thermometer.",
          },
          {
            type: "definition",
            term: "Heat",
            text: "Energy in transit, flowing from a hotter body to a cooler one. Heat is what happens DURING transfer — which is why it is wrong to say a mug 'contains heat'. It contains internal energy; it can only receive or release heat.",
          },
          {
            type: "paragraph",
            text: "The distinction matters more than it sounds. Internal energy is a property — the mug has some whether or not anything is flowing. Heat is an event — two bodies at different temperatures, touching, and a flow between them. When they equalise, the flow stops; the energy has simply moved.",
          },
          {
            type: "table",
            headers: ["Scale", "Freezing point", "Boiling point", "Why it exists"],
            rows: [
              ["Celsius (°C)", "0", "100", "Water's behaviour, human-sized"],
              ["Kelvin (K)", "273.15", "373.15", "Absolute — zero is the floor of all motion"],
              ["Fahrenheit (°F)", "32", "212", "18th-century brine and body temperature"],
            ],
          },
          {
            type: "code",
            language: "python",
            code: `k_b = 1.381e-23       # Boltzmann constant, J/K
e_charge = 1.602e-19  # one electron-volt, in joules

for T_c in [0, 25, 100]:
    print(T_c, "degrees C =", T_c + 273.15, "K")

kT_ev = k_b * 300 / e_charge
print("Thermal energy kT at 300 K:", round(kT_ev, 4), "eV")`,
            output: "0 degrees C = 273.15 K\n25 degrees C = 298.15 K\n100 degrees C = 373.15 K\nThermal energy kT at 300 K: 0.0259 eV",
            caption:
              "Kelvin is Celsius with the floor at zero, not an arbitrary mark: −273.15 °C is the temperature at which particle motion ends. The last line is the energy one degree of freedom carries at room temperature — 0.026 eV, a number that reappears in the quantum trail.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Absolute zero is not 'very cold' — it is a different kind of statement. 0 K is the limit where thermal motion stops. Nothing can be colder, because there is no jiggling left to remove. The kelvin is the SI unit precisely because it makes the physics scale, not the weather scale.",
          },
          {
            type: "example",
            text: "A kilowatt of heating pours energy into a litre of water fast enough to raise it by about 0.24 K every second — room temperature to the boil in roughly five and a half minutes. The kettle's temperature rise is linear at first, and the whole calculation is one division: power divided by the water's heat capacity, 4,186 J per K.",
          },
          {
            type: "diagram",
            diagramId: "heat-kinetic-picture",
            caption:
              "The same gas at three temperatures: the same molecules, wider and faster spreads at higher T. A thermometer is a machine for reading average kinetic energy.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The second law, stated once so it can run the rest of the trail: heat never flows from a colder body to a hotter one on its own. Left alone, differences decay and even out. Reversing that needs work — that is what a refrigerator is FOR.",
          },
          {
            type: "theory",
            prompt:
              "A cup of tea cools in a cool room. Total energy is conserved either way, so conservation alone does not forbid the tea heating up instead while the room cools a little. State the law that forbids it, and explain what quantity the law is really about."
            ,
            modelAnswer:
              "The second law forbids it, and it is about the distribution of energy, not its amount. Heat flows from hot to cold because that direction increases the number of microscopic arrangements (microstates) compatible with the macroscopic state. Tea and room at the same temperature has many more microstates than 'tea hotter than room', so the flow runs that way — overwhelmingly, every time. What the law actually tracks is entropy: S = k ln W, where W counts the microstates. Energy conservation says the total bookkeeping balances; the second law says which of the balanced arrangements nature actually visits. The tea heating spontaneously is not energy-impossible, it is entropy-forbidden: a path of such low probability that the age of the universe would not contain enough attempts.",
            explanation:
              "This probabilistic reading — the ice-melting, ink-diffusing, tea-cooling asymmetry — is what later depths count, and what the research primer connects to information itself.",
          },
          {
            type: "question",
            prompt: "Is 'this cup contains heat' correct usage?",
            answer: "No. Heat is the flow of energy between bodies at different temperatures. The cup contains internal energy at a temperature; heat is what enters or leaves during transfer.",
            explanation:
              "The habit of speech is nearly universal and nearly always harmless — but it hides the fact that heat is a process, which is exactly the process the second law constrains.",
          },
          {
            type: "question",
            prompt: "Convert 25 °C to kelvin, and say why the kelvin is the scientist's unit.",
            answer: "298.15 K. The kelvin starts at absolute zero, so ratios of temperature (as in engine efficiency formulas) are honest, and 2× the kelvins means 2× the molecular kinetic energy.",
            explanation:
              "Celsius ratios mislead: 40 °C is not 'twice as hot' as 20 °C, but 313 K is twice 156.5 K.",
          },
          {
            type: "mcq",
            stem: "Two beakers contain the same amount of water at 50 °C. What is true?",
            options: [
              "The larger beaker contains more heat",
              "Both contain the same heat, because temperature is the same",
              "The larger beaker contains more internal energy at the same temperature",
              "Heat is stored in the water as potential energy",
            ],
            correctIndex: 2,
            explanation:
              "Temperature is intensive; internal energy is extensive. At the same temperature the bigger mass holds proportionally more internal energy — and neither 'contains heat', strictly.",
          },
          {
            type: "mcq",
            stem: "A thermometer measures…",
            options: [
              "The total heat in a substance",
              "The average kinetic energy of particles",
              "The speed of the fastest particle",
              "The pressure of the surroundings",
            ],
            correctIndex: 1,
            explanation:
              "A thermometer equilibrates with its surroundings and reports the average molecular agitation — which is why a tiny thermometer can read the temperature of a lake.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Temperature is average molecular motion; heat is energy in transit from hot to cold, and that direction is one-way unless work is spent. Next: how much of that flow can be harvested as work, and the ceiling on the answer.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "The engines that move the world",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Turning heat into work" },
          {
            type: "paragraph",
            text: "Every engine — steam, petrol, jet, the giant turbines that make a country's electricity — does the same two things: absorb heat from something hot, and reject some heat to something cold, converting the difference into work. The vital part is the REJECTION. An engine with nowhere to dump its waste heat simply cannot run.",
          },
          {
            type: "definition",
            term: "Heat engine",
            text: "A device that takes heat from a hot reservoir, converts part of it to work, and dumps the rest into a cold reservoir. Its efficiency is work divided by heat absorbed — and the second law caps it, always.",
          },
          {
            type: "definition",
            term: "Carnot efficiency",
            text: "The maximum possible efficiency of any engine working between two temperatures, in kelvin: η = 1 − T_cold/T_hot. Carnot proved this in 1824 by pure logic — no engine of any design, ever, can beat it.",
          },
          {
            type: "code",
            language: "python",
            code: `def carnot_efficiency(T_hot_K, T_cold_K):
    return 1 - T_cold_K / T_hot_K

cases = [
    (573, 313, "steam plant: 573 K core, 313 K condenser"),
    (900, 300, "ideal gas turbine: 900 K to 300 K"),
    (300, 300, "no temperature difference"),
]
for hot, cold, label in cases:
    print(f"{label}: {carnot_efficiency(hot, cold)*100:.1f}% ceiling")`,
            output: "steam plant: 573 K core, 313 K condenser: 45.4% ceiling\nideal gas turbine: 900 K to 300 K: 66.7% ceiling\nno temperature difference: 0.0% ceiling",
            caption:
              "Carnot's ceiling in three lines. A real coal plant's 573 K steam against a 313 K condenser caps at 45.4% — real plants manage about 33–36% after friction, pumps and imperfect heat exchange. The last row is the point of the refrigerator: no gradient, no work.",
          },
          {
            type: "table",
            headers: ["Engine", "Hot side (K)", "Cold side (K)", "Carnot ceiling", "Real"],
            rows: [
              ["Steam power station", "573", "313", "45%", "33–36%"],
              ["Combined-cycle gas plant", "1,600 (flame)", "313", "80%", "up to 64%"],
              ["Car petrol engine", "2,300 (burn)", "313", "86%", "20–30%"],
              ["Ocean thermal (20 K gradient)", "297", "277", "6.7%", "3%"],
            ],
          },
          {
            type: "example",
            text: "A refrigerator is a heat engine run backwards. By spending work (the compressor's electricity) it forces heat to climb from a cold interior to a warmer room — the uphill flow the second law forbids for free. The kitchen gets warmer: that is the bill for the work, plus the heat dragged out of the fridge.",
          },
          {
            type: "diagram",
            diagramId: "heat-carnot-engine",
            caption:
              "Carnot's cycle: absorb Qh at Th, deliver work W, reject Qc at Tc. Every engine diagram is this one, drawn with different fluids.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Carnot never built a working engine — he published his maximum-efficiency result in 1824 from thought alone, as a young officer in the French engineering corps. His argument was budgetary: any engine beating the ceiling could be chained to a fridge to make free work from one reservoir.",
          },
          {
            type: "theory",
            prompt:
              "Could a perfect engineer build an engine at 100% efficiency by eliminating all friction, turbulence and heat leaks? Use the Kelvin-Planck statement to answer, and explain why the obstacle is not sloppy construction."
            ,
            modelAnswer:
              "No — and the obstacle is structural, not mechanical. The Kelvin-Planck statement of the second law: no device whose sole effect is to absorb heat from a single reservoir and convert it entirely to work can exist, even in principle. Carnot's argument shows why: a perfect engine between Th and Tc paired with a refrigerator could pump heat back for free, and the pair would produce net work while touching only one reservoir — a perpetual motion machine of the second kind. Any 100% engine must reject zero heat, but rejecting heat is how the cycle closes: the working fluid must return to its starting state, and shedding entropy requires a cold reservoir. Friction and leaks only push real engines further below the ceiling; they are not why the ceiling exists.",
            explanation:
              "Diesel and jet engines get closer to Carnot by widening Th − Tc, not by clever valves. The next depth explains what the ceiling is really counting.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Why does every power station need a cooling tower or river?",
            answer: "Because it must reject waste heat to a cold reservoir. Without the cold side there is no cycle, and without a cycle there is no work — the condenser is not optional plumbing, it is the second half of the engine.",
            explanation:
              "The cooling tower is dumping the Qc that Carnot's formula guarantees you cannot convert. It is also why power plants sit by water.",
          },
          {
            type: "question",
            prompt: "An engine takes 100 J of heat and does 40 J of work. What is its efficiency?",
            answer: "40% — work divided by heat absorbed. The other 60 J went to the cold reservoir.",
            explanation:
              "Whether 40% is good depends entirely on the temperatures: 40% exceeds most real engines, though it is below coal's 45% ceiling.",
          },
          {
            type: "mcq",
            stem: "An engine operates between 500 K and 300 K. What is its maximum efficiency?",
            options: ["40%", "50%", "200%", "100%"],
            correctIndex: 0,
            explanation:
              "1 − 300/500 = 0.4. The cold side always sets the discount, which is why hotter combustion and colder condensers both pay.",
          },
          {
            type: "mcq",
            stem: "Why does a fridge make a kitchen warmer, not cooler?",
            options: [
              "It rejects heat plus the compressor's work into the room",
              "It creates heat from nothing",
              "It blocks cold from entering the kitchen",
              "The cooling effect escapes into the room",
            ],
            correctIndex: 0,
            explanation:
              "A fridge moves heat from its cold interior to the room, and the work done shows up as extra heat in the rejected flow. Leave the door open and the room warms — not one watt saved.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Engines convert part of a heat flow into work and must reject the rest; Carnot's ceiling is 1 − Tc/Th. Real machines pay extra for friction on top. Next: the microscopic counting that explains the ceiling — entropy.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Entropy, counted",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The law behind the ceiling" },
          {
            type: "paragraph",
            text: "Carnot's ceiling works, but 1824 has no explanation for WHY it works. Boltzmann supplied one in 1877 with a definition so short it is carved on his tombstone: S = k ln W. Entropy is a count — how many microscopic arrangements correspond to the macroscopic state you observe.",
          },
          {
            type: "definition",
            term: "Microstate and macrostate",
            text: "A macrostate is what you measure — 'the gas fills the box'. A microstate is one exact snapshot — every molecule's position and velocity. One macrostate holds a vast number of microstates; that number is W, and entropy is its logarithm.",
          },
          {
            type: "definition",
            term: "Second law, statistical",
            text: "An isolated system moves toward the macrostate with the largest W, simply because there are more ways to be that way. Differences even out because evened-out has astronomically more arrangements — the overwhelming majority of the probability. Irreversibility is not a force; it is a headcount.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

k_b = 1.381e-23       # Boltzmann constant, J/K
R = 8.314             # J/mol/K, the gas constant

# Entropy counting: W microstates per macrostate
print("2 coins:", 2**2, "microstates")
print("100 coins:", 2**100, "microstates")

# rms molecular speed: v = sqrt(3RT/M)
def v_rms(molar_mass_kg):
    return math.sqrt(3 * R * 300 / molar_mass_kg)

for gas, molar in [("N2", 0.028), ("O2", 0.032), ("H2", 0.002)]:
    print(f"{gas} rms speed at 300 K: {v_rms(molar):.0f} m/s")`,
            output: "2 coins: 4 microstates\n100 coins: 1267650600228229401496703205376 microstates\nN2 rms speed at 300 K: 517 m/s\nO2 rms speed at 300 K: 484 m/s\nH2 rms speed at 300 K: 1934 m/s",
            caption:
              "Two facts in one block. Two coins: four microstates, easy to list. A hundred: 10³⁰ arrangements, and the most even split (50-50) claims the overwhelming majority — which is the second law, verbatim. Nitrogen's molecules actually move at 517 m/s at room temperature; the gas only feels still because directions cancel.",
          },
          {
            type: "paragraph",
            text: "The rms speed line is worth pausing on. Air molecules cross a room at the speed of a jet engine, suffering billions of collisions per second, and yet a smell takes seconds to spread across a kitchen — because each molecule random-walks into another before it travels far. Diffusion is fast at the molecular scale and slow at ours.",
          },
          {
            type: "table",
            headers: ["Gas", "Molar mass (kg/mol)", "rms speed at 300 K (m/s)", "Note"],
            rows: [
              ["Hydrogen (H₂)", "0.002", "1,934", "4× faster than nitrogen — the same reason balloon hydrogen escapes fast"],
              ["Nitrogen (N₂)", "0.028", "517", "78% of your air"],
              ["Oxygen (O₂)", "0.032", "484", "21% of your air"],
              ["Carbon dioxide (CO₂)", "0.044", "412", "Heavier, slower — which is why it pools in cellars"],
            ],
          },
          {
            type: "example",
            text: "Stir cream into coffee and the two liquids mix into a smooth brown. Never, in the age of the universe, has a stirred coffee un-mixed itself. Both directions conserve energy identically; only one direction raises W. The entropy increase is about 10²³ microstates' worth per mole — statistically irreversible without being physically impossible.",
          },
          {
            type: "diagram",
            diagramId: "heat-microstates-counting",
            caption:
              "A hundred coins, tossed: the near-even splits dominate because they can be assembled in the most ways. The second law is this chart, applied to molecules.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Entropy is not 'disorder' in the everyday sense. A tidy room is not lower-entropy than a messy one in physics terms; a star or a crystal, both ordered, have their entropy computed precisely. Entropy counts arrangements of a specified system, whatever they look like.",
          },
          {
            type: "theory",
            prompt:
              "Stirring sugar into coffee mixes it irreversibly, while both mixed and unmixed states conserve energy. Give the statistical account of why one direction is observed — and state as precisely as you can what would be required for the coffee to un-stir."
            ,
            modelAnswer:
              "The mixed state contains vastly more microstates: each sugar molecule has the whole cup available, so W_mixed ≈ (number of locations)^(number of molecules), against W_unmixed ≈ 2, say. Evolution favors the maximum-W state for the same reason a fair coin shows more near-even splits: combinatorial weight. For the coffee to un-stir, every molecule would have to drift, by chance from the thermal kicks of ~517 m/s water molecules, back to its original half of the cup — a specific microstate among 2^(10²³) possibilities. It is not forbidden by energy; it is forbidden by arithmetic. The waiting time is not long — it is longer than the age of the universe by an unprintable factor, and every fluctuation elsewhere in the room destroys it.",
            explanation:
              "This is the honest version of 'impossible': a 10⁻¹⁰ scale probability repeated macroscopically. Maxwell's demon (research depth) is what happens when you try to cheat the count.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "What does S = k ln W compute?",
            answer: "The entropy of a macrostate from its microstate count W. It converts a huge counting number into a manageable energy-per-kelvin figure, which is why the logarithm is there.",
            explanation:
              "Without the log, entropies would be 10^(10²³)-sized quantities; with it, a mole of gas has an entropy of tens of J/K.",
          },
          {
            type: "question",
            prompt: "Does the second law say unmixing is impossible?",
            answer: "Not impossible — unimaginably improbable. Fluctuations toward order occur constantly at molecular scales; they just never aggregate into a visible un-mixing of a cup.",
            explanation:
              "Statistical mechanics predicts small temporary entropy decreases; what it forbids, for practical purposes, is the macroscopic one.",
          },
          {
            type: "mcq",
            stem: "Why does the second law single out one direction in time?",
            options: [
              "Physics has an arrow built into every equation",
              "The universe started in a low-entropy state, and high-W states dominate its future",
              "Friction has a preferred direction",
              "Time itself slows as entropy rises",
            ],
            correctIndex: 1,
            explanation:
              "The microscopic laws are time-symmetric; the asymmetry comes from a boundary condition — the early universe was arranged exceptionally. This is the 'past hypothesis', an open research question.",
          },
          {
            type: "mcq",
            stem: "Two identical gas samples, one at 300 K and one at 600 K, are mixed. What happens to the entropy?",
            options: [
              "It decreases",
              "It stays exactly the same, because no energy is lost",
              "It increases, because the mixed state has more arrangements",
              "It depends on the gas",
            ],
            correctIndex: 2,
            explanation:
              "Energy is conserved, but W rises: the merged sample has more accessible volume and energy assignments. Mixing hot and cold is a second-law engine of dissipation.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Entropy counts arrangements; nature moves toward the maximum because the maximum has the most ways. Carnot's ceiling is the same fact read as economics: you cannot convert a heat flow wholly to work because the cold reservoir is where the entropy goes. Next: the modern research version of all this — where information enters the ledger.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "The second law, information, and Maxwell's demon",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The law, in its research forms" },
          {
            type: "paragraph",
            text: "The second law admits several equivalent statements — a sign of depth, not redundancy. Clausius (1850): heat does not flow spontaneously from cold to hot. Kelvin-Planck (1851): no engine can convert heat wholly to work from a single reservoir. Boltzmann (1877): entropy tends to its maximum. The equivalence proofs are short exercises; the surprises begin when information enters.",
          },
          {
            type: "definition",
            term: "Clausius inequality",
            text: "For any cyclic process, ∮ δQ/T ≤ 0, with equality only for the reversible ideal. It is the differential form of the second law and the source of every efficiency bound in engineering — Carnot's ceiling is a special case.",
          },
          {
            type: "paragraph",
            text: "On the engineering side, real cycles are analysed against Carnot using the Rankine cycle (power plants), Otto and Diesel cycles (internal combustion), and the Brayton cycle (jets). Each replaces ideal isotherms with practical processes and loses another few points to pump losses, pressure drops and finite heat-exchange areas. The second law is why a 60%-efficient combined-cycle plant is a triumph of engineering rather than a quota.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

k_b = 1.381e-23        # Boltzmann constant, J/K
T = 300                # K, room temperature

# Landauer: the minimum heat cost of erasing one bit
print("kT at 300 K:", f"{k_b*T:.3e}", "J")
print("Erasing one bit costs:", f"{k_b*T*math.log(2):.3e}", "J")

# Entropy scale set by Avogadro's number alone
N_A = 6.022e23
R = 8.314
print("R ln(Avogadro) =", round(R * math.log(N_A)), "J/K per mole")`,
            output: "kT at 300 K: 4.143e-21 J\nErasing one bit costs: 2.872e-21 J\nR ln(Avogadro) = 455 J/K per mole",
            caption:
              "Two research numbers. Landauer's limit: erasing one bit of information at 300 K must dissipate at least 2.9×10⁻²¹ J — the second law applied to computation. Avogadro scale: just by counting arrangements of one mole's worth of anything, entropy lands at hundreds of J/K — the size of chemistry's ledger.",
          },
          {
            type: "definition",
            term: "Landauer's principle",
            text: "Erasing one bit of information in a computer at temperature T releases at least T·k·ln 2 joules of heat (Landauer, 1961). Logically irreversible operations have a physical price — the second law governs information, not just steam.",
          },
          {
            type: "example",
            text: "Maxwell's demon (1867): a tiny gatekeeper sorts fast molecules from slow ones into two chambers, creating a temperature difference — and work — out of nothing. For a century the second law looked threatened. The resolution took Szilard's 1929 insight: the demon must MEASURE molecules to sort them, and measurements must be stored; eventually that memory must be erased, and erasure costs kT ln 2. The bookkeeping closes exactly.",
          },
          {
            type: "table",
            headers: ["Milestone", "Year", "What it established"],
            rows: [
              ["Carnot", "1824", "Maximum efficiency 1 − Tc/Th — from thought alone"],
              ["Clausius", "1850", "Entropy defined; heat does not flow spontaneously uphill"],
              ["Kelvin–Planck", "1851", "No 100%-efficient single-reservoir engine"],
              ["Boltzmann", "1877", "S = k ln W — the statistical foundation"],
              ["Gibbs", "1902", "Ensembles — the machinery of physical chemistry"],
              ["Szilard", "1929", "Measurement itself has an entropy cost"],
              ["Landauer", "1961", "Erasure has a minimum heat cost"],
              ["Bennett", "1982", "The demon resolved: erasure, not measurement, is the bill"],
            ],
          },
          {
            type: "diagram",
            diagramId: "heat-maxwell-demon-gate",
            caption:
              "Maxwell's demon at the gate: sorting fast from slow would pay a heat bill the moment its memory is erased — kT ln 2 per bit, forever.",
          },
          {
            type: "paragraph",
            text: "The consequences run into the present. Brownian computation — ratchets that harvest Brownian motion — was shown impossible by Feynman's ratchet argument (1962), a direct descendant of the demon. Modern fluctuation theorems (Jarzynski, Evans–Searles, 1990s) quantify exactly how far the second law can be violated for short times in small systems, which is the daily reality of molecular motors inside your cells.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The second law is often called the most secure in physics — yet it is the only one whose 'violation' is a statistical statement. For short times and few particles, decreases happen and are measured routinely; what never happens, at any scale, is a deterministic engine that beats the ceiling on average.",
          },
          {
            type: "theory",
            prompt:
              "Maxwell's demon sorts molecules by speed and seems to beat the second law for free. Walk the resolution: what does the demon have to do physically, what does it have to forget, and which step carries the entropy bill? Say why the bill can never be dodged by a cleverer gate."
            ,
            modelAnswer:
              "The chain of obligations. To sort, the demon must measure each molecule — that is a physical interaction ending in a stored record, so measurement is not free of entropy. To keep sorting it must store results, and finite memory eventually fills. Then it must erase to continue, and Landauer's principle sets the erasure cost at T·k·ln2 per bit — exactly the work the demon's sorting would have gained. The entropy did not vanish; it moved from the gas into the memory and then into the bath during erasure. No cleverer gate helps, because the argument never depended on the gate's design: it depended on the demon being a physical system with finite states. The second law's ledger closes when information is counted as physical.",
            explanation:
              "This is the deepest connection in the field: thermodynamics and information theory are the same subject. 'Entropy' in computer science is a different quantity — Shannon's — but it obeys the same arithmetic, and Landauer's line is the bridge.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "What is the minimum electric bill to erase one gigabyte (8×10⁹ bits) of memory at 300 K?",
            answer: "8×10⁹ × 2.87×10⁻²¹ J ≈ 2.3×10⁻¹¹ J, about 2×10⁻¹¹ watt-seconds. Landauer's floor is real but microscopic; modern transistors pay millions of times more per operation.",
            explanation:
              "Real chips dissipate roughly a million times the Landauer minimum per logical operation. Reversible computing is the research programme for closing that gap.",
          },
          {
            type: "question",
            prompt: "Why is Carnot's result called 'a law' when Carnot only used thought experiments?",
            answer: "Because the argument is a proof by contradiction: an over-efficient engine could be chained with a fridge to create net work from one reservoir, which every other formulation of the second law forbids. The logic binds, not the experiment.",
            explanation:
              "This is the normal shape of thermodynamics: its strength is that it constrains what ANY device can do, whether built or imagined.",
          },
          { type: "heading", level: 2, text: "References and further reading" },
          {
            type: "paragraph",
            text: "Carnot, Reflections on the Motive Power of Fire (1824) — the original ceiling argument. Clausius, 'On the Moving Force of Heat' (1850). Boltzmann, lectures on gas theory (1896–98) — the statistical programme. Szilard, 'On the Decrease of Entropy…' (1929). Landauer, IBM Journal (1961). Bennett, Scientific American (1987). Feynman, Lectures on Computation (1996) — the ratchet chapter.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Heat flows hot to cold; engines harvest the flow under a ceiling of 1 − Tc/Th; entropy counts the microscopic arrangements; and the ledger closes only when information is counted too. This is the only law of physics with a built-in direction — the rest of the trails could run equally well forwards or backwards.",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 5 — The Life of a Wave (waves)
// ---------------------------------------------------------------------------
const WAVE_TRAIL: TrailSeed = {
  id: "discovery-curiosity-wave",
  title: "The Life of a Wave",
  order: 4,
  branch: "Waves & optics",
  description:
    "Sound, music, interference and the wave equation — the one equation that runs from guitar strings to atoms.",
  depths: [
    {
      suffix: "-lesson",
      title: "What a wave is",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: say what a wave carries and what it does NOT carry; name wavelength, frequency, amplitude and period and relate them by v = fλ; distinguish transverse from longitudinal waves; and calculate a wavelength from a frequency.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Wave",
            text: "A travelling disturbance that transfers energy from place to place without transferring matter. In a stadium wave, people stand up and sit down — nobody moves around the stand, yet the wave visibly travels from one side to the other.",
          },
          {
            type: "definition",
            term: "Wavelength (λ) and frequency (f)",
            text: "Wavelength is the distance between successive crests; frequency is how many crests pass per second (hertz). They are locked to speed by v = fλ — fast waves with long wavelengths and low frequency, or short wavelengths and high frequency.",
          },
          {
            type: "table",
            headers: ["Quantity", "Symbol", "Units", "Example (a wave at 343 m/s)"],
            rows: [
              ["Wavelength", "λ", "metres", "440 Hz sound → λ = 0.78 m"],
              ["Frequency", "f", "hertz", "440 Hz is the standard tuning note"],
              ["Period", "T", "seconds", "1/440 s ≈ 2.3 ms per cycle"],
              ["Amplitude", "A", "metres (or pressure)", "Loudness — how tall the wave is"],
              ["Speed", "v", "m/s", "Sound in air: 343 m/s at 20 °C"],
            ],
          },
          {
            type: "code",
            language: "python",
            code: `v_sound = 343        # m/s in air at 20 C
c = 299_792_458      # m/s, exact

print("440 Hz sound wave:", round(v_sound / 440, 2), "m wavelength")
print("Green light (5.5e14 Hz):", round(c / 5.5e14 * 1e9), "nm wavelength")`,
            output: "440 Hz sound wave: 0.78 m wavelength\nGreen light (5.5e14 Hz): 545 nm wavelength",
            caption:
              "One equation, v = fλ, both ends of the audible/visible world. The tuning note has a wavelength about the length of your arm; green light packs 500 trillion cycles per second into half a micrometre.",
          },
          {
            type: "paragraph",
            text: "That contrast is the wave world. Sound at 343 m/s spreads across metres per cycle; light at 299,792,458 m/s fits thousands of cycles into a millimetre. Everything about how a wave interacts with the world — the colours it scatters, the doors it squeezes through — follows from this ratio of speed to size.",
          },
          {
            type: "definition",
            term: "Transverse vs longitudinal",
            text: "Transverse waves vibrate perpendicular to their travel — light, waves on a string. Longitudinal waves vibrate along their travel — sound: air compresses and rarefies in the direction the sound goes. Seismic waves include both.",
          },
          {
            type: "diagram",
            diagramId: "wave-anatomy-parts",
            caption:
              "A snapshot of a travelling wave: crest, trough, amplitude and wavelength marked. Freeze time and it is a picture; let it run and it is a journey.",
          },
          {
            type: "example",
            text: "An earthquake announces itself twice. Fast P-waves (longitudinal) arrive first at about 8 km/s; slower S-waves (transverse) shake afterwards; then the surface waves that actually topple buildings. Seismologists time the gap to triangulate the epicentre.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Waves carry energy without carrying passengers. A tsunami crossing the Pacific at jet speed involves water molecules barely oscillating in place — the ocean does not travel to Chile; the disturbance does.",
          },
          {
            type: "theory",
            prompt:
              "In a stadium wave the crowd stays seated, yet the wave tours the ground. Identify exactly what 'travels' in a wave, what stays behind, and defend the claim that a wave is not an object but an event."
            ,
            modelAnswer:
              "What travels is a pattern of disturbance plus its energy; what stays is the medium, each molecule or spectator oscillating about its own position. The stadium wave's crowd moves up and down — a few centimetres — while the phase of standing-and-sitting sweeps around the tiers at tens of metres per second. So a wave is a process, not a thing: it has no location beyond the region it occupies at an instant, no individual identity, and no stored substance. You cannot 'hold' a wave in your hand; you can only disturb a medium and let the disturbance propagate. This is why the honest definition says a wave is a disturbance that transfers energy — the disturbance, not a carried object, is the quantifiable thing.",
            explanation:
              "The one spectacular exception arrives in the quantum trail: individual photons are quantum waves that nonetheless arrive one particle at a time.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A wave has frequency 100 Hz and speed 20 m/s. What is its wavelength?",
            answer: "λ = v/f = 20/100 = 0.2 m.",
            explanation:
              "v = fλ rearranged. Whatever three of speed, frequency and wavelength you know, the fourth is fixed.",
          },
          {
            type: "question",
            prompt: "Does a sound wave move air from the speaker to your ear?",
            answer: "No — it moves a pressure disturbance through the air. Each molecule shuttles micrometres back and forth; the pattern travels the whole way.",
            explanation:
              "If the molecules themselves travelled, a clap would arrive as a wind. It arrives as pressure — proof of wave, not transport.",
          },
          {
            type: "mcq",
            stem: "Which quantity does a wave always transport?",
            options: ["Matter", "Energy", "Mass", "Permanent displacement"],
            correctIndex: 1,
            explanation:
              "Energy without matter is the definition. Ocean waves, sound and light all move energy; none delivers payload.",
          },
          {
            type: "mcq",
            stem: "Doubling the frequency of a wave while keeping its speed constant does what to the wavelength?",
            options: ["Doubles it", "Halves it", "Leaves it unchanged", "Quadruples it"],
            correctIndex: 1,
            explanation:
              "v = fλ must hold, so with v fixed, λ ∝ 1/f. Halve the wavelength, double the frequency — the trade at the heart of the next depths.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "A wave is a travelling disturbance, linked by v = fλ: long and slow, or short and fast. Next: what sets that speed — and why sound always arrives after the lightning.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "Sound, speed, and music",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "What sets the speed of sound" },
          {
            type: "paragraph",
            text: "The speed of sound is not a law handed down; it falls out of the air's properties. Sound is pressure disturbances pushing against the molecules around them, so its speed depends on how stiff the air is (adiabatic bulk), how heavy each molecule is — v = √(γRT/M). Stiffer or lighter air, faster sound.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# Speed of sound from first principles: v = sqrt(gamma R T / M)
gamma = 1.4                    # adiabatic index of air
R = 8.314                      # J/mol/K
M = 0.0289642                  # kg/mol, mean molar mass of dry air
T = 293.15                     # K, exactly 20 C

v = math.sqrt(gamma * R * T / M)
print("Speed of sound at 20 C:", round(v, 1), "m/s")

# Temperature dependence, the pilot's rule of thumb
for T_c in [-40, 0, 20, 100]:
    print(f"At {T_c} C:", round(331.3 * math.sqrt((T_c + 273.15) / 273.15), 1), "m/s")`,
            output: "Speed of sound at 20 C: 343.2 m/s\nAt -40 C: 306.1 m/s\nAt 0 C: 331.3 m/s\nAt 20 C: 343.2 m/s\nAt 100 C: 387.2 m/s",
            caption:
              "Two routes, one number: the full formula gives 343 m/s at 20 °C, and the square-root-of-kelvin scaling gives the same from the 331.3 m/s reference at 0 °C. Cold air is slower sound, noticeably — at −40 °C it is down to 306 m/s.",
          },
          {
            type: "definition",
            term: "Mach 1",
            text: "The local speed of sound. It is not a fixed 343 m/s: it drops with temperature and therefore with altitude. At cruising altitude (about −50 °C) Mach 1 is near 299 m/s — about 87% of its sea-level value, which is why 'the speed of sound' is a local reading, not a constant.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Decibels run on a logarithmic rule, which is why hearing spans so much: the threshold of hearing to the threshold of pain is a ratio of 10¹² in intensity, about 120 dB. Zero dB is not silence — it is 10⁻¹² W/m², the quietest sound a healthy ear can catch.",
          },
          {
            type: "paragraph",
            text: "Music is waves with geometry. Pluck a string and it vibrates in a standing wave: both ends fixed, so only wavelengths that fit — 2L, L, 2L/3… — survive. The allowed frequencies are f_n = n·v/2L, the harmonic series, and the string's wave speed comes from v = √(T/μ): tension over mass per length.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# A guitar string: wave speed set by tension and mass per length
L = 0.65                 # m, string length
mu = 0.00033             # kg/m, a light steel string
T = 60                   # N of tension

v = math.sqrt(T / mu)
print("Wave speed on the string:", round(v, 1), "m/s")
print("Fundamental:", round(v / (2 * L), 1), "Hz")
print("Octave above:", round(v / (2 * L) * 2, 1), "Hz")`,
            output: "Wave speed on the string: 426.4 m/s\nFundamental: 328.0 Hz\nOctave above: 656.0 Hz",
            caption:
              "A 65 cm string under 60 newtons oscillates at 328 Hz — concert E — and its octave at 656 Hz. Tuning means changing tension: to raise the pitch by 2%, tighten by about 4%, because frequency follows the square root of tension.",
          },
          {
            type: "table",
            headers: ["Note", "Frequency (Hz)", "Wavelength in air (m)", "What it feels like"],
            rows: [
              ["C4 (middle C)", "261.6", "1.31", "The note a piano tutorial starts on"],
              ["E4", "329.6", "1.04", "The lowest guitar string, open"],
              ["A4", "440.0", "0.78", "The tuning reference of the world"],
              ["C5", "523.2", "0.66", "An octave above middle C"],
            ],
          },
          {
            type: "diagram",
            diagramId: "wave-standing-string",
            caption:
              "A string's allowed standing waves: whole, halves, thirds. Only these fit between the fixed ends — the reason instruments have harmonic timbres rather than one pure tone.",
          },
          {
            type: "example",
            text: "Lightning, then thunder: light crosses the gap effectively instantly, sound at 343 m/s, so counting seconds gives distance — three seconds per kilometre. A five-second gap puts the strike about 1.7 km away, roughly a mile.",
          },
          {
            type: "theory",
            prompt:
              "Notes an octave apart (A4 at 440 Hz, A5 at 880 Hz) sound like 'the same note, higher'. Explain what perception is registering that makes a factor of 2 feel like sameness — and connect it to the standing-wave picture of a string."
            ,
            modelAnswer:
              "Perception works on ratios, not differences. The cochlea maps sound frequencies onto place along the basilar membrane in a roughly logarithmic way, so equal ratios — 440 to 880 doubling — land at equal distances in the ear and in the felt 'height' of the note. Musicians' equal-tempered scale is built from these ratios: 12 steps per octave, each a factor of 2^(1/12) ≈ 1.0595, so seven steps give 2^(7/12) ≈ 1.498 — a fifth. The string explains the physics behind it: doubling the frequency happens when the string halves its wavelength, and since f = v/2L with v = √(T/μ), halving L or quadrupling T doubles f. The octave is the unique interval where the two notes' harmonics coincide exactly, which is why the ear hears them as the same identity at a new scale.",
            explanation:
              "The logarithmic scale also explains decibels and the pitch spiral of each octave — the same 'ratio space' shows up across the whole wave trail.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Why is thunder always after lightning?",
            answer: "Both come from the same discharge at the same instant, but light travels at 3×10⁸ m/s and sound at 343 m/s — so the sound trails by the distance divided by 343.",
            explanation:
              "Five seconds ≈ 1.7 km. Divide by three for kilometres, by five for miles.",
          },
          {
            type: "question",
            prompt: "To raise a string's pitch by 10%, by roughly what factor do you increase its tension?",
            answer: "About 1.21× — tension enters as v = √(T/μ), and pitch follows v. A 21% tension increase buys a 10% pitch increase.",
            explanation:
              "The square root is why tuning feels blunt: a quarter turn of a peg moves the pitch noticeably, so musicians tune by listening, not by torque.",
          },
          {
            type: "mcq",
            stem: "Sound travels fastest in…",
            options: ["Cold air", "Warm air", "A vacuum", "The same everywhere"],
            correctIndex: 1,
            explanation:
              "v = √(γRT/M): temperature is under the root. Warmer molecules carry pressure disturbances faster. In vacuum, sound does not travel at all — there is no medium.",
          },
          {
            type: "mcq",
            stem: "A string's length is halved while tension stays the same. What happens to its fundamental frequency?",
            options: ["Halves", "Stays the same", "Doubles", "Quadruples"],
            correctIndex: 2,
            explanation:
              "f₁ = v/2L, so halving L doubles f₁ — an octave up. This is exactly how a guitar's frets are placed.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Sound speed = √(γRT/M), so temperature sets Mach 1 and cold thin air slows it. Strings choose their allowed standing waves, and music is the geometry of fitting them. Next: what happens when two waves arrive at the same place at the same time.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "When waves meet",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Superposition" },
          {
            type: "paragraph",
            text: "When two waves overlap, the medium simply does what both demand at once: their displacements add. That is superposition, and every downstream effect — interference, beats, standing waves, diffraction, the whole of optics and half of quantum mechanics — falls out of this one rule.",
          },
          {
            type: "definition",
            term: "Constructive and destructive interference",
            text: "Crest meets crest: amplitudes add, the result is louder and brighter (constructive). Crest meets trough: they cancel to silence or darkness (destructive). The pattern depends only on the path difference in whole or half wavelengths.",
          },
          {
            type: "definition",
            term: "Beats",
            text: "Two frequencies slightly close together interfere to a throbbing at their difference frequency. Tune two strings 4 Hz apart and the fusion tone pulses four times per second — the metronome in every tuning session.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# Doppler: a 500 Hz horn on a 30 m/s train
f0 = 500
v_s = 30
v_sound = 343

approaching = f0 * v_sound / (v_sound - v_s)
receding = f0 * v_sound / (v_sound + v_s)
print("Approaching:", round(approaching, 1), "Hz")
print("Receding:", round(receding, 1), "Hz")

# Beats: two nearly-equal frequencies
print("Beat frequency:", abs(440 - 444), "Hz")

# Decibels: 10 log10 of the intensity ratio
print("10x intensity is", round(10 * math.log10(10), 1), "dB")
print("100x intensity is", round(10 * math.log10(100), 1), "dB")`,
            output: "Approaching: 547.9 Hz\nReceding: 459.8 Hz\nBeat frequency: 4 Hz\n10x intensity is 10.0 dB\n100x intensity is 20.0 dB",
            caption:
              "Three effects, one arithmetic. The Doppler shift of a train's horn: +48 Hz approaching, −40 Hz receding. Beats: a 4 Hz throb for strings 4 Hz apart. Decibels: our ears' logarithmic scale, where ten times the intensity reads as only ten more decibels.",
          },
          {
            type: "paragraph",
            text: "Doppler is wavefront geometry, not an electronics trick. A moving source emits wavefronts from each new position, so the circles bunch ahead and stretch behind: compressed spacing means higher pitch ahead, stretched means lower behind. The source does not know it is moving; the pattern does.",
          },
          {
            type: "table",
            headers: ["Effect", "Rule", "Where you meet it"],
            rows: [
              ["Two-slit interference", "Bright where path difference = nλ", "Young's 1801 experiment; holograms"],
              ["Beats", "Pulse frequency = |f₁ − f₂|", "Tuning instruments; piano beat notes"],
              ["Standing waves", "Only wavelengths that fit the space", "Organ pipes; lasers; atoms (later!)"],
              ["Diffraction", "Bends around gaps ≈ λ wide", "Why you hear around corners, not see through them"],
              ["Doppler", "f' = f·v/(v ∓ v_source)", "Speed cameras; radar; redshift in astronomy"],
            ],
          },
          {
            type: "diagram",
            diagramId: "wave-interference-double-slit",
            caption:
              "Two slits, two wavefronts: they reinforce along directions where crests coincide and cancel where crest meets trough. The bright and dark bands are the interference pattern.",
          },
          {
            type: "example",
            text: "Noise-cancelling headphones listen to ambient sound and emit an inverted copy, shifted by half a wavelength. The two sum to near-silence inside the cup — destructive interference as a consumer product, in real time.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Beats need TWO sources; Doppler needs relative MOTION of source and observer (or, in astronomy, of the space between). Confusing them is common: a beat is in the sound itself, a Doppler shift is in the geometry.",
          },
          {
            type: "theory",
            prompt:
              "An ambulance's siren drops in pitch as it passes you. Argue carefully whether the siren itself changed, what the driver hears, and what exactly you are listening to — then explain why astronomy uses the same arithmetic on light."
            ,
            modelAnswer:
              "The siren's electronics are unchanged: the driver hears the same steady tone the whole way. What changes is the spacing of wavefronts arriving at your ear. As the ambulance approaches, it keeps emitting, but each new crest starts from a position closer to you, so the crests crowd together — your ear intercepts them more often, and pitch rises. After passing, each crest starts from a farther position, spacing opens, and the pitch falls. The crossover as it passes is the geometric moment when the compression turns into a stretch. Astronomy uses the identical arithmetic on light (with the relativistic correction at high speeds): the pitch-drop of receding galaxies is the Doppler shift measured on spectral lines, which is how expansion was discovered at all. Same equation, medium air vs light; same physics, different messenger.",
            explanation:
              "You can measure a train's speed with the same formula a cosmologist measures a galaxy's — this is why the wave trail matters everywhere else.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Two speakers play 440 Hz and 444 Hz together. What do you hear?",
            answer: "A 440–444 Hz mixture beating at 4 Hz — a wavering tone whose loudness pulses four times per second.",
            explanation:
              "Beat rate is the frequency difference. When the difference vanishes (tuned), the beat stops — that is how 'in tune' is defined by ear.",
          },
          {
            type: "question",
            prompt: "Why can you hear someone around a corner but not see them?",
            answer: "Diffraction. Sound's wavelength (~0.8 m) is comparable to a doorway, so it bends around edges and through the gap; light's wavelength is under a micrometre and only makes a faint penumbra.",
            explanation:
              "The rule of thumb: obstacles much larger than λ barely diffract. Doorways and voices are matched; walls and light are not.",
          },
          {
            type: "mcq",
            stem: "In the two-slit experiment, the dark bands appear where…",
            options: [
              "Light has been destroyed",
              "Waves from the two slits arrive out of step by half a wavelength",
              "The slits are too close together",
              "The screen absorbs more light there",
            ],
            correctIndex: 1,
            explanation:
              "Destructive interference: path difference of λ/2 (or any odd multiple) means crest meets trough and the displacement sums to zero. Nothing is lost — the energy went to the bright bands.",
          },
          {
            type: "mcq",
            stem: "A source moves toward you at one third the speed of sound. What happens to the pitch?",
            options: [
              "It rises by a factor of 1.5",
              "It falls by a factor of 1.5",
              "Nothing changes until it passes",
              "It rises by a factor of 3",
            ],
            correctIndex: 0,
            explanation:
              "f' = f·v/(v − vs) with vs = v/3 gives f' = f·3/2 = 1.5×. Approaching sources compress the wavefronts; receding sources stretch them by 3/4.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Waves add: interference paints bright and dark, beats pulse at the frequency difference, standing waves admit only the wavelengths that fit, and motion shifts the received pitch. Next depth: the equation underneath all of it — and the one Schrödinger pointed at atoms.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "The wave equation, dispersion, and Schrödinger's debt",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The equation that travels" },
          {
            type: "paragraph",
            text: "One partial differential equation, written down by d'Alembert in 1746, underlies this entire trail. In one dimension it reads: the second space derivative equals 1/v² times the second time derivative — the curvature of the wave at any instant matches its acceleration. Every solution of this family is a travelling shape; substituting f(x ± vt) shows why: the argument simply slides along at speed v.",
          },
          {
            type: "definition",
            term: "The wave equation",
            text: "∂²y/∂x² = (1/v²) ∂²y/∂t². Its general solution is a superposition of any two functions y = f(x − vt) + g(x + vt) — two waves, opposite directions. Its power is that line-by-line it generates interference, standing waves, reflection, transmission and refraction as consequences of boundary conditions.",
          },
          {
            type: "definition",
            term: "Dispersion",
            text: "When different wavelengths travel at different speeds, a pulse spreads out as it goes. Water waves are dispersive: in deep water v = √(gλ/2π), so a long swell outruns a short ripple. Sound in air is almost non-dispersive — which is why a conversation survives across a room.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

g = 9.81

def phase_speed(wavelength_m):
    """Deep-water waves: phase speed grows with wavelength."""
    return math.sqrt(g * wavelength_m / (2 * math.pi))

for wl in [1, 10, 100]:
    print(f"{wl} m wavelength ->", round(phase_speed(wl), 1), "m/s")

# Fourier: any repeating wave is a sum of sines — a square wave's first terms
f = 440
for n in [1, 3, 5, 7, 9]:
    print(f"square-wave harmonic {n}: {n*f} Hz, amplitude 1/{n}")`,
            output: "1 m wavelength -> 1.2 m/s\n10 m wavelength -> 4.0 m/s\n100 m wavelength -> 12.5 m/s\nsquare-wave harmonic 1: 440 Hz, amplitude 1/1\nsquare-wave harmonic 3: 1320 Hz, amplitude 1/3\nsquare-wave harmonic 5: 2200 Hz, amplitude 1/5\nsquare-wave harmonic 7: 3080 Hz, amplitude 1/7\nsquare-wave harmonic 9: 3960 Hz, amplitude 1/9",
            caption:
              "Dispersion on the seas: a 100 m swell outruns a 1 m chop by a factor of ten. And Fourier's theorem in action: a square wave is a 440 Hz note plus odd harmonics at 3, 5, 7, 9 times the frequency with shrinking amplitudes — add enough terms and the corner sharpens.",
          },
          {
            type: "paragraph",
            text: "Fourier (1822) proved that any periodic waveform — a violin's sawtooth, a radio pulse, the pressure history of a spoken word — decomposes into a sum of sine waves with definite frequencies. It is the single most exploited idea in signal processing: every filter, spectrum analyser and JPEG of a waveform begins as 'add up the harmonics'.",
          },
          {
            type: "table",
            headers: ["Wave system", "Equation", "Dispersive?", "Uses"],
            rows: [
              ["Sound in air", "linear acoustic wave equation", "Almost none", "Speech, sonar"],
              ["Light in vacuum", "Maxwell's equations (next trail)", "None", "Everything optical"],
              ["Deep-water surface waves", "v = √(gλ/2π)", "Strong", "Ocean swell forecasting"],
              ["Quantum matter waves", "Schrödinger equation (quantum trail)", "Strong", "Atoms, chemistry, chips"],
            ],
          },
          {
            type: "example",
            text: "A tsunami is dispersive in the deep ocean — barely, because its wavelength is hundreds of kilometres — but as it shelves into shallow water it slows to √(gh), compresses, and grows to tens of metres. Speed drops, wavelength shortens, amplitude climbs: all three read straight off the dispersion relation.",
          },
          {
            type: "diagram",
            diagramId: "wave-dispersion-packet",
            caption:
              "A wave packet: many wavelengths in superposition. Its envelope (group velocity) travels at a different speed from its crests (phase velocity) — the distinction that matters for anything carrying a signal.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Phase velocity can exceed c without breaking relativity — that is crest-speed, not signal-speed. Information rides on the group velocity, and in a dispersive medium the two part company. Sending faster-than-light telegrams by phase is a century-old trap.",
          },
          {
            type: "paragraph",
            text: "Now the historical hinge. In 1926 Schrödinger asked: if matter is a wave (de Broglie, 1924), what equation does it satisfy? He started from classical energy conservation — E = T + V — and treated energy as a frequency and momentum as a wave number through the relations E = hf and p = h/λ. The algebra that results is called his equation, and its structure is unmistakably the wave equation's: linear, second order in space, with a potential term. What survived from the classical picture was the machinery — superposition, standing-wave boundary conditions, dispersion. What died was the interpretation of the amplitude: ψ is not a displacement but a probability amplitude, as Born argued the same year.",
          },
          {
            type: "theory",
            prompt:
              "Schrödinger's 1926 equation is founded on the classical wave equation but describes matter. Identify precisely what he inherited from classical wave physics, what he replaced wholesale, and why 'standing waves in a box' was the physical analogy he actually used for atoms."
            ,
            modelAnswer:
              "Inherited: the wave equation's mathematical skeleton — linearity (so superpositions are solutions), second-order spatial curvature driving time evolution, and the discipline of boundary conditions. The atom-as-standing-wave picture comes straight from the string: an electron confined by the nucleus must have waves that fit themselves around the orbit, nλ = 2πr, which is exactly de Broglie's condition and exactly the kind of quantisation a string shows. Replaced: the meaning of the amplitude and the meaning of dispersion. In classical waves the amplitude is a physical displacement; Schrödinger's ψ has no such reading — Born's |ψ|² is a probability density. And unlike sound, matter waves are strongly dispersive: a spread of momenta spreads the packet, which is why an electron in an atom is not a little planet. The equation itself is classical in form and revolutionary in content — that gap is why its interpretation took another twenty years.",
            explanation:
              "The quantum trail runs this argument to ground: photons, discrete energies, and the atom that the classical picture could not keep standing.",
          },
          {
            type: "question",
            prompt: "What distinguishes a dispersive medium from a non-dispersive one, and why does the difference matter for music and for tsunamis?",
            answer: "Dispersive means different wavelengths travel at different speeds, so a pulse spreads as it goes. Sound in air is nearly non-dispersive, which is why an orchestra stays coherent across a hall; deep-water waves are strongly dispersive, which is why a tsunami's wavelength shortens and its amplitude climbs as it shelves into shallow water.",
            explanation:
              "Dispersion is quantified by the phase-speed relation v(λ); a constant v is the non-dispersive special case. The wave equation itself says nothing about dispersion — that comes from the medium's boundary conditions and physics.",
          },
          { type: "heading", level: 2, text: "References and further reading" },
          {
            type: "paragraph",
            text: "d'Alembert, 'Researches on the curve of a vibrating string' (1747) — the wave equation's birth. Fourier, The Analytical Theory of Heat (1822). Young, 'On the theory of light and colours' (1801) — the two-slit experiment. Rayleigh, Theory of Sound (1877) — the classical wave bible. de Broglie, thesis (1924). Schrödinger, Annalen der Physik (1926).",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "One equation travels: linear waves superpose, waves in confinement quantise, dispersions differ per medium, and any repeating waveform is a sum of harmonics. That structure — superposition plus boundary conditions — is the exact toolkit Schrödinger carried into the atom, which is where this trail hands over.",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 6 — The Invisible Current (electricity & magnetism)
// ---------------------------------------------------------------------------
const CURRENT_TRAIL: TrailSeed = {
  id: "discovery-curiosity-current",
  title: "The Invisible Current",
  order: 5,
  branch: "Electricity & magnetism",
  description:
    "Charge, current, fields and the two formulas that turned electricity into light — and light into electricity.",
  depths: [
    {
      suffix: "-lesson",
      title: "What charge is",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: say what charge is and that it comes in exactly two kinds; state Coulomb's law and compute one example; explain why matter is electrically neutral to a fantastic precision; and name the difference between a conductor and an insulator.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Electric charge",
            text: "A fundamental property of matter, like mass but with two signs: positive and negative. Like charges repel, unlike charges attract. The electron carries one elementary unit — about 1.6×10⁻¹⁹ C — and every charge is an integer multiple of it.",
          },
          {
            type: "definition",
            term: "Coulomb's law",
            text: "The force between two charges: F = k·q₁q₂/r². It has the same inverse-square shape as gravity — but unlike mass, which only attracts, charge can also repel, and most charges in matter come in balanced pairs.",
          },
          {
            type: "code",
            language: "python",
            code: `k_e = 8.988e9        # N m^2/C^2, Coulomb's constant
q = 1.0              # C
r = 1.0              # m

F = k_e * q * q / r**2
print("Force between two 1 C charges 1 m apart:", f"{F:.3e}", "N")

e_charge = 1.602e-19
print("1 C is", f"{1 / e_charge:.3e}", "electrons' worth")`,
            output: "Force between two 1 C charges 1 m apart: 8.988e+09 N\n1 C is 6.242e+18 electrons' worth",
            caption:
              "One coulomb is enormous. The force above is the weight of about 900,000 tonnes — generated by charges a metre apart. That is why everyday static shocks (microcoulombs) feel sharp but never pin you to the wall.",
          },
          {
            type: "example",
            text: "Rub a balloon on your sleeve and it sticks to the wall: transferred electrons give the balloon a tiny net charge, which polarises the neutral wall and attracts. The same physics, scaled down 10⁻¹² times, makes balloon decorators of us all.",
          },
          {
            type: "table",
            headers: ["Substance", "Charge carriers", "Behaviour", "Use"],
            rows: [
              ["Copper", "Free electrons (10²⁹ per m³)", "Conductor — charges flow", "Wiring"],
              ["Glass", "Electrons locked in place", "Insulator", "Support frames, fibre optics"],
              ["Salt solution", "Mobile ions", "Conductor via chemistry", "Batteries, biology"],
              ["Semiconductor (silicon)", "Electrons AND holes", "Switchable", "Every chip in every device"],
            ],
          },
          {
            type: "diagram",
            diagramId: "current-field-lines",
            caption:
              "Field lines around positive and negative charges: arrows leaving the positive, entering the negative, density encoding strength. Like charges push each other's lines apart; unlike charges join them.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Charge conservation is absolute. You cannot create or destroy net charge — only move it. In every lightning strike and every chemical reaction, electrons change address; the total count never changes by a single unit.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Static electricity hurts; circuits kill. Both are charge in motion, but a skin shock is a brief discharge of microcoulombs, while a mains shock drives current through the heart. The dangerous quantity in a shock is not voltage alone but the current through tissue.",
          },
          {
            type: "theory",
            prompt:
              "Coulomb's law says two 1-coulomb charges a metre apart exert nearly 10¹⁰ newtons — the thrust of a rocket. Yet you handle charged objects safely every day, and two neutral bodies feel no force at all. Resolve the paradox: what quantity of unbalanced charge is typical of matter, and why does the coulomb turn out to be an absurdly large unit?"
            ,
            modelAnswer:
              "Matter is neutral to extraordinary precision. An atom keeps one electron per proton; a 1 kg lump contains about 10²⁶ electrons and 10²⁶ protons, and a static-charged balloon has an imbalance of perhaps 10¹² electrons — one part in 10¹⁴. Coulomb forces are strong enough that even that tiny imbalance, spread over a balloon, supports its weight against gravity over the whole room: the force per charge is ~10⁹ times gravity's, so 10¹² unbalanced electrons is already plenty. The coulomb is enormous because the elementary charge is small: one coulomb is 6.24×10¹⁸ electrons' worth — more charge than flows in many lightning strikes, delivered through wires humans can hold. Balanced matter feels no net force because the external fields of positive and negative interiors cancel outside, exactly as they must by symmetry; only the near-field skin of unbalanced charge leaks out.",
            explanation:
              "This is why electromagnetism dominates everyday life while gravitation is only noticed at planetary scale: enormous force per unit charge, and matter keeps most of it perfectly paired away.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Two charges exert 4 N. One is doubled; what is the force?",
            answer: "8 N — the force is proportional to each charge, so doubling one doubles the force.",
            explanation:
              "Then halve the distance: ×4 again, to 32 N — inverse-square laws are sensitive to the gap.",
          },
          {
            type: "question",
            prompt: "Why is charge called 'quantised'?",
            answer: "Because it comes only in integer multiples of the elementary charge (~1.6×10⁻¹⁹ C). No object carries 0.5e or 1.7e — quarks split the unit but never appear alone.",
            explanation:
              "Quantisation of charge was established by Millikan's oil-drop experiment (1909–13) and is a deep clue that led to the quantum trail.",
          },
          {
            type: "mcq",
            stem: "Two 1 C charges, 1 m apart, exert about 9×10⁹ N. Why don't we notice such forces?",
            options: [
              "Because bodies are almost always neutral — charges come in balanced pairs",
              "Because Coulomb's law only applies in vacuum",
              "Because 1 C is a very small amount of charge",
              "Because the force only acts on moving charges",
            ],
            correctIndex: 0,
            explanation:
              "Matter is neutral to about one part in 10¹⁴. The forces are there, but cancelling exactly. A 1 C imbalance is more charge than flows in a lightning bolt.",
          },
          {
            type: "mcq",
            stem: "An insulator differs from a conductor because…",
            options: [
              "It has no electrons at all",
              "Its electrons cannot move freely through the material",
              "It carries positive charge only",
              "It has more protons than electrons",
            ],
            correctIndex: 1,
            explanation:
              "Conductors have mobile charges (in copper, free electrons); insulators hold their electrons in place. Semiconductors do both, controllably — the whole basis of electronics.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Charge comes in two kinds, is conserved, and obeys an inverse-square law of enormous strength — perfectly hidden inside neutral matter. Next: what happens when charge is allowed to flow.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "Current, voltage, and the speed of a switch",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Charge on the move" },
          {
            type: "paragraph",
            text: "A current is charge in motion: one ampere is one coulomb passing a point per second. Voltage (potential difference) is the push: it tells each coulomb how much energy per second it can deliver. Together with resistance they obey Ohm's law, V = IR, and the power dissipated falls out as P = VI.",
          },
          {
            type: "definition",
            term: "Current (I)",
            text: "The rate of flow of charge, I = Q/t, measured in amperes. By convention current flows from + to −; in a copper wire the actual electrons move the other way, from − to +. The convention is old and harmless if you are consistent.",
          },
          {
            type: "definition",
            term: "Voltage (V)",
            text: "Energy per unit charge, in volts. A 9 V battery gives each coulomb of charge 9 joules to spend as it goes around the circuit. Voltage is the push, not the stuff that flows.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# A plain circuit: 12 V across 4 ohms
V = 12.0
R = 4.0

I = V / R
P = V * I
print("Current:", round(I, 2), "A")
print("Power dissipated:", round(P, 1), "W")

# How fast do the electrons actually drift?
n = 8.5e28               # free electrons per m^3 in copper
A = math.pi * (0.0005)**2   # 1 mm diameter wire
I = 1.0                  # amps
e = 1.602e-19

v_drift = I / (n * A * e)
print("Electron drift speed, 1 A in a 1 mm wire:", f"{v_drift * 1e6:.1f}", "micrometres/s")

c = 3e8
print("Field signal crosses 1 m in:", f"{1 / (0.67 * c) * 1e9:.1f}", "nanoseconds")`,
            output: "Current: 3.0 A\nPower dissipated: 36.0 W\nElectron drift speed, 1 A in a 1 mm wire: 93.5 micrometres/s\nField signal crosses 1 m in: 5.0 nanoseconds",
            caption:
              "The surprise in four lines: a 1-amp current in a 1 mm copper wire means electrons crawl at about 93 micrometres per second — slower than a snail. The flip of the switch is not the electrons; it is the field, racing the metre in 5 nanoseconds.",
          },
          {
            type: "paragraph",
            text: "That pair of numbers is the whole reason a light comes on instantly. The electrons in the filament do not travel from the switch; they were already in the filament. What travels at nearly light speed is the electric field establishing the new voltage, and every electron in the circuit begins drifting at once. The drift speed sets the current; the field sets the response time.",
          },
          {
            type: "table",
            headers: ["Quantity", "Symbol", "Unit", "Water analogy", "What is conserved"],
            rows: [
              ["Current", "I", "amperes", "Litres per second", "Charge — loop-wide, conserved"],
              ["Voltage", "V", "volts", "Pressure difference", "Energy per coulomb"],
              ["Resistance", "R", "ohms", "Narrowness of the pipe", "Dissipation, not conservation"],
              ["Power", "P", "watts", "Waterwheel output", "Energy per second"],
            ],
          },
          {
            type: "diagram",
            diagramId: "current-circuit-loop",
            caption:
              "A simple loop: a battery maintains the voltage, a resistor dissipates it, a current circulates. Kirchhoff's rules are conservation of charge and conservation of energy applied to the junctions and the loops.",
          },
          {
            type: "example",
            text: "A 100 W bulb at 230 V draws about 0.43 A — and pushes about 2.7×10¹⁸ electrons through the filament every second. Each of those electrons has been circulating the loop at less than a millimetre per second; the filament glows because the field rattles each one far more often than it translates.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Current is not 'used up'. The same current that leaves a lamp returns; what the lamp consumes is energy (voltage × current × time). Series circuits share current; parallel circuits share voltage — and both obey energy conservation.",
          },
          {
            type: "theory",
            prompt:
              "Electrons in a copper wire carry a 1-amp current at about 93 micrometres per second — a tenth of a millimetre a second. Yet a lamp lights the instant you flip a switch. Give the full physical account: what travels, at what speed, and why 'the electricity' is a misleading way to describe both."
            ,
            modelAnswer:
              "Two different speeds live in the same wire. The drift speed — how far an individual electron translates on average — is about 9×10⁻⁵ m/s, set by I = nAev: charge density, cross-section and the elementary charge. It takes an electron minutes to traverse a metre of cable. The signal speed — how fast the information about the switch travels — is close to the speed of light in the conductor's dielectric, a large fraction of c (our estimate, 0.67c, gives 5 ns for a metre). When the switch closes, the battery's field propagates down the wire, establishing a voltage at every point along it almost at once, and every free electron in the loop — including those already inside the lamp filament — begins drifting within nanoseconds. So the lamp lights because of electrons already present, nudged by a field that arrived locally and instantly; not because energy was shipped from battery to bulb as charge. 'The electricity' blurs a field that races with particles that crawl — and both are needed for the story to make sense.",
            explanation:
              "The same appearance (instant response) with a very different mechanism (slow march) shows up in the mechanical trail: the ISS falls continuously at 0 g; here the electrons crawl continuously while the light flashes instantly.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A device draws 2 A at 230 V. What power does it consume?",
            answer: "460 W — P = VI, so 230 × 2. In one hour that is 0.46 kWh, the unit on your electricity bill.",
            explanation:
              "Utilities charge for energy (kWh), not power (W): the meter multiplies power by time.",
          },
          {
            type: "question",
            prompt: "In a series circuit, where is the current the same?",
            answer: "Everywhere — the same charge must pass through every component in turn. What splits up is the voltage.",
            explanation:
              "Kirchhoff's current law: what goes into a junction comes out. In a loop with no junctions, current is uniform by conservation of charge.",
          },
          {
            type: "mcq",
            stem: "Doubling the voltage across a fixed resistor does what to the current?",
            options: ["Halves it", "Doubles it", "Leaves it unchanged", "Quadruples it"],
            correctIndex: 1,
            explanation:
              "Ohm's law, I = V/R. Double the push, double the flow. Double the power-area too — power goes as V² through a fixed resistor.",
          },
          {
            type: "mcq",
            stem: "What is conserved around a steady current circuit?",
            options: [
              "Energy only",
              "Charge; and energy is delivered, not created",
              "Both charge and energy are created",
              "Nothing is conserved in circuits",
            ],
            correctIndex: 1,
            explanation:
              "Charge circulates forever in steady state; the battery supplies energy and the components dissipate it. Energy conservation is the deepest rule the whole circuit obeys.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Current is charge on the move, voltage is the push per coulomb, and Ohm's law connects them. The electrons crawl; the field sprints — which is why circuits respond instantly while their charge moves at a stroll. Next: the other half of the field, and how the two became one thing.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Magnetism, motors, and light",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The two halves reunite" },
          {
            type: "paragraph",
            text: "For most of history electricity and magnetism were separate phenomena. Then, one by one: Oersted (1820) — a current deflects a compass needle, so electricity makes magnetism. Faraday (1831) — a MOVING magnet drives a current, so magnetism makes electricity. And Maxwell (1861–62) — the two are one field, and light is its wave.",
          },
          {
            type: "definition",
            term: "Magnetic force on a moving charge",
            text: "F = qvB sin θ. A charge moving through a magnetic field feels a force perpendicular to both its velocity and the field — which is why magnetic forces steer, never speed up. It bends particle beams; it never does work.",
          },
          {
            type: "definition",
            term: "Faraday's law",
            text: "A changing magnetic flux through a loop induces a voltage, EMF = −N dΦ/dt. The minus sign is Lenz's law: the induced current always flows so as to oppose the change that caused it. It is not decoration — it is energy conservation.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# Faraday: switch a field through a coil and a voltage appears
N = 100            # turns
A = 0.01           # m^2, a 10 cm x 10 cm loop
B = 1.0            # T, field switched fully on
dt = 1.0           # s

emf = N * A * B / dt
print("Peak EMF from that switch:", emf, "V")

# Magnetic force on a moving charge
q_p = 1.602e-19
v_p = 1.0e6        # m/s, a proton
B_earth = 5.0e-5   # T, a typical surface field

F = q_p * v_p * B_earth
print("Force on that proton in Earth's field:", f"{F:.2e}", "N")`,
            output: "Peak EMF from that switch: 1.0 V\nForce on that proton in Earth's field: 8.01e-18 N",
            caption:
              "Faraday's law is a multiplication problem: 100 turns × 0.01 m² × 1 tesla per second gives a volt — this is roughly how a generator's alternator is scaled. Earth's feeble 10⁻⁵ T field still steers a fast proton — the aurora is charged particles taking that curve.",
          },
          {
            type: "paragraph",
            text: "Every motor is a generator run backwards. Feed a coil a current and it feels a torque in a magnetic field; spin a coil in a field and it produces a voltage. The same machine, read forwards or backwards, is why electric cars harvest energy on braking and power stations generate it at all.",
          },
          {
            type: "table",
            headers: ["Rule", "Geometry", "Where you use it"],
            rows: [
              ["Force on moving charge", "F = qvB", "Mass spectrometers, aurora, particle steering"],
              ["Force on a wire", "F = BIL", "Every electric motor"],
              ["Faraday's law", "EMF = −N ΔΦ/Δt", "Every generator and transformer"],
              ["Lenz's law", "Opposes the change", "Eddy-current brakes, induction hobs"],
              ["Right-hand rules", "Geometry of vectors", "Predicting direction, every time"],
            ],
          },
          {
            type: "diagram",
            diagramId: "current-motor-generator",
            caption:
              "The isomorphism: a motor and a generator are the same loop in the same field. Push current in and it turns; turn it and it pushes current out. Regenerative braking is this diagram read both ways at once.",
          },
          {
            type: "example",
            text: "Daniel Faraday, a bookbinder's apprentice with no university degree, discovered induction after Oersted's 1820 result. He built the first transformer, the first generator, and identified benzene — one of the most consequential careers in experimental physics, achieved without mathematics beyond ratio and proportion.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "Magnetic forces do no work. A magnetic field changes a particle's direction, never its speed — the work is done by electric fields set up when the field changes. This is why cyclotrons need accelerating gaps between bending magnets.",
          },
          {
            type: "theory",
            prompt:
              "Faraday's law carries a minus sign: the induced effect opposes the change that caused it. Explain what would go wrong physically if the induced current REINFORCED the change instead — and why the minus sign is therefore a statement about energy conservation, not a sign convention."
            ,
            modelAnswer:
              "Take the negative away and imagine pushing a magnet toward a coil. The induced current would then strengthen the increasing flux, which would strengthen the current, which would increase the flux again — a runaway positive feedback. That growing field would pull the magnet in harder, so the magnet's kinetic energy would increase as it approached, heat would appear in the coil, and the total energy of the system would rise without a source: energy created from nothing. The minus sign closes the loop in the only way possible: the induced current generates a field opposite the change, so you must do work to push the magnet in, and that work — not the magnet's kinetic energy — becomes the coil's heat. This is exactly what you feel as the resisting drag in a generator or an eddy-current brake. The law of induction is a conservation law in disguise; the sign is the physics, not the notation.",
            explanation:
              "The same reasoning recurs in every 'reaction' law of physics — Newton's third law, and (in the quantum trail) the uncertainty relations all play this conserving role.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A magnet held still inside a coil produces no current. Why?",
            answer: "Induction needs CHANGING flux. A static magnet has field lines through the coil, but no voltage is generated until something — magnet, coil or field strength — moves or varies.",
            explanation:
              "Faraday's law is about dΦ/dt, not Φ. This is why microphones work on vibration, not on mere presence of the magnet.",
          },
          {
            type: "question",
            prompt: "Why does a car's alternator produce more voltage at higher engine speed?",
            answer: "EMF = −N ΔΦ/Δt: spinning the coil faster changes the flux faster, so the induced voltage rises roughly in proportion to speed.",
            explanation:
              "The regulator then holds the battery voltage steady by trimming the field current — the loop of control every car's electrical system runs on.",
          },
          {
            type: "mcq",
            stem: "What does a generator convert?",
            options: [
              "Charge into magnetism",
              "Mechanical work into electrical energy",
              "Voltage into current",
              "Magnetism directly into work",
            ],
            correctIndex: 1,
            explanation:
              "A generator is a motor read backwards: mechanical rotation moves conductors through a field, and Faraday's law turns the changing flux into voltage.",
          },
          {
            type: "mcq",
            stem: "In a uniform magnetic field, a moving charge's speed…",
            options: [
              "Increases",
              "Decreases",
              "Stays the same while its direction curves",
              "Becomes zero",
            ],
            correctIndex: 2,
            explanation:
              "F = qvB is perpendicular to v, so it does no work: the speed is constant and only the direction bends. Speed changes require an electric field.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Currents make fields; changing fields make voltages; the minus sign conserves energy; motors and generators are one machine. Next depth: what Maxwell did when he combined the constants into a single number.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "Maxwell's equations and the speed of light",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The synthesis" },
          {
            type: "paragraph",
            text: "Maxwell's 1861–62 papers did two things: they generalised Ampère's law with a 'displacement current' term that made the equations consistent with charge conservation, and they solved the resulting system in empty space. The solution was a wave equation with a definite speed: 1/√(ε₀μ₀). Maxwell evaluated the constants — one from electrostatics, one from magnetostatics, nothing to do with light — and got about 2.88×10⁸ m/s. The measured speed of light, then known to about 3.14×10⁸ m/s, matched. The inference was immediate: light is an electromagnetic wave.",
          },
          {
            type: "definition",
            term: "Maxwell's four equations (in words)",
            text: "Electric fields begin and end on charges (Gauss). Magnetic field lines have no beginnings or ends — no magnetic monopoles (Gauss for magnetism). Electric fields curl around changing magnetic fields (Faraday). Magnetic fields curl around currents AND changing electric fields (Ampère–Maxwell). From these, in vacuum, the wave equation follows with c = 1/√(ε₀μ₀).",
          },
          {
            type: "code",
            language: "python",
            code: `import math

eps0 = 8.8541878128e-12   # F/m, electric constant (exact since 2019)
mu0 = 4 * math.pi * 1e-7  # H/m, magnetic constant

c = 1 / math.sqrt(eps0 * mu0)
print("Speed from the two constants:", f"{c:.3e}", "m/s")

f = 100e6                 # 100 MHz, FM radio
lam = c / f
print("100 MHz wavelength:", round(lam, 2), "m")
print("Half-wave dipole:", round(lam / 2, 2), "m")`,
            output: "Speed from the two constants: 2.998e+08 m/s\n100 MHz wavelength: 3.0 m\nHalf-wave dipole: 1.5 m",
            caption:
              "Maxwell's synthesis, computed: two laboratory constants — the electric constant and the magnetic constant — produce 2.998×10⁸ m/s, the speed of light, before light was mentioned. The antenna line is the same physics in engineering form.",
          },
          {
            type: "paragraph",
            text: "That agreement is the argument, and it is worth stating why it is so strong. ε₀ was known from force-per-charge measurements; μ₀ from force-per-steady-current measurements. Both involve completely different apparatus and physically different phenomena. Their combination yielding the speed of light cannot be tuned by adjusting either constant: the product is measured independently twice. This is what persuaded the community, and Hertz's 1887 generation and detection of radio waves — different frequency, same speed, same transverse character — closed the case experimentally.",
          },
          {
            type: "table",
            headers: ["Year", "Result", "Significance"],
            rows: [
              ["1820", "Oersted: current deflects a compass", "Electricity makes magnetism"],
              ["1831", "Faraday: changing field drives current", "Magnetism makes electricity"],
              ["1861–62", "Maxwell's equations + displacement current", "The unified theory; c = 1/√(ε₀μ₀)"],
              ["1887", "Hertz: radio waves generated and detected", "Light's family completed experimentally"],
              ["1905", "Einstein: light speed is invariant", "Relativity — c leaves the wave picture a constant"],
              ["1948", "QED: photons quantised properly", "Electromagnetism reconciled with quantum theory"],
            ],
          },
          {
            type: "example",
            text: "A mobile phone transmits at about 900 MHz — a wavelength of 33 cm, roughly the length of a school ruler — and the half-wave dipole that receives it is about 16 cm. Antennas are just metal sized to the wavelength of the wave they converse with, all the way from 1.5 m (FM) down to millimetres (5G).",
          },
          {
            type: "diagram",
            diagramId: "current-em-wave-antenna",
            caption:
              "The electromagnetic wave: electric and magnetic fields perpendicular to each other and to propagation, cresting and troughing in step. Energy flows in the direction of E × B.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Maxwell wrote that the agreement of these results 'seems to show that light and magnetism are affections of the same substance, and that light is an electromagnetic disturbance'. It took two decades and Hertz to convince the rest of physics — and the speed stayed in the theory until Einstein re-explained it in 1905.",
          },
          {
            type: "paragraph",
            text: "For the mathematically curious, the derivation is short. Take Maxwell's two curl equations in vacuum: ∇×E = −∂B/∂t and ∇×B = μ₀ε₀ ∂E/∂t. Take the curl of the first, substitute, and fields rearrange to ∇²E = μ₀ε₀ ∂²E/∂t² — the wave equation with v = 1/√(μ₀ε₀). No potentials, no matter, no medium: the constants alone set the speed. That this speed equals c' for ALL observers is precisely the content of special relativity.",
          },
          {
            type: "theory",
            prompt:
              "Maxwell evaluated two constants — the electric constant ε₀ and the magnetic constant μ₀ — from entirely different laboratory measurements and got a speed close to that of light. Explain why this was proof that light is electromagnetic, rather than a coincidence — and what it predicted before Hertz."
            ,
            modelAnswer:
              "The proof is in the independence of the measurements. ε₀ is determined by static electric forces between charges (from Coulomb's law calibrations); μ₀ is determined by magnetostatic forces between currents (Ampère's balance). Nothing in either setup touches light, optics, or frequency — they are electrical and magnetic measurements alone. Their combination, 1/√(ε₀μ₀), comes out numerically equal to the measured speed of light. For this to be coincidence, a constant from static electricity would have to conspire, through no mechanism, with a constant from steady magnetism, to reproduce a speed measured by rotating mirrors and Jupiter's moons. Maxwell read the equality as identity: the equations he had assembled predicted transverse waves of a specific speed and certain properties — polarisation, transverse vibration, and propagability through vacuum. He therefore predicted that they existed at all frequencies, not just the visible band, and that they could be generated and detected. Hertz's 1887 experiment did exactly that with radio-frequency circuits: same speed, same transverse nature, same reflection and refraction — the visible band was a narrow window onto a far wider spectrum.",
            explanation:
              "This is the standard shape of a great unification: two constants from separate phenomena, one equation, a third phenomenon not part of either measurement — and a testable prediction that arrives in advance.",
          },
          {
            type: "question",
            prompt: "Maxwell had to add the displacement-current term to Ampère's law. What inconsistency did it fix, and why is it called a current even when nothing flows?",
            answer: "Without it, taking the divergence of Ampère's original law contradicts charge conservation wherever charge accumulates — a charging capacitor has no conduction current between its plates yet builds a magnetic field anyway. The added term, ε₀∂E/∂t, appears in the divergence identities as a current in its own right, so the mathematics closes. Nothing physically flows in the gap; the changing field acts like a current for every purpose the theory cares about.",
            explanation:
              "It is the same term that completes the wave derivation in this depth — the 'correction' for consistency became the seed of the whole theory.",
          },
          { type: "heading", level: 2, text: "References and further reading" },
          {
            type: "paragraph",
            text: "Maxwell, 'A Dynamical Theory of the Electromagnetic Field' (1865) — the synthesis. Faraday, Experimental Researches (1839–55) — the experimental map. Hertz, Electric Waves (1893) — the confirmation. Einstein, 'On the Electrodynamics of Moving Bodies' (1905). Jackson, Classical Electrodynamics — the standard graduate reference for the equations in full.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Electricity and magnetism are one field whose waves travel at c = 1/√(ε₀μ₀), and light is a member of that family. The trail has now mapped charge, current, circuit, field and wave: the complete classical electromagnetism that ordinary technology runs on — and the exact point where the next trail's crisis begins.",
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 7 — Why the Atom Is Not a Tiny Solar System (modern/quantum physics)
// ---------------------------------------------------------------------------
const QUANTUM_TRAIL: TrailSeed = {
  id: "discovery-curiosity-quantum",
  title: "Why the Atom Is Not a Tiny Solar System",
  order: 6,
  branch: "Modern & quantum physics",
  description:
    "Photon by photon: the crisis that killed classical physics, and the quantum rules that rebuilt everything chemistry stands on.",
  depths: [
    {
      suffix: "-lesson",
      title: "Light comes in packets",
      estimatedMinutes: 12,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "Learning outcomes" },
          {
            type: "paragraph",
            text: "By the end of this depth you should be able to: compute the energy of a photon from its wavelength; state what the photoelectric effect shows that a wave picture cannot; explain why brightness is the wrong dial; and name the experiments that forced physicists to abandon the classical picture.",
          },
          { type: "heading", level: 2, text: "The big idea" },
          {
            type: "definition",
            term: "Photon",
            text: "A single quantum of light: the smallest packet of energy a wave of a given frequency can carry. Its energy is E = hf = hc/λ — so colour and energy are the same statement. Red photons are weaker than blue photons; violet are the strongest visible ones.",
          },
          {
            type: "definition",
            term: "The photoelectric effect",
            text: "Shine light on a metal and it can eject electrons — but only if the light's frequency exceeds a threshold for that metal. Below the threshold, no amount of brightness produces any ejection. Above it, even a dim light ejects electrons immediately.",
          },
          {
            type: "paragraph",
            text: "The wave picture predicts the opposite. In wave physics, brighter light is a bigger wave and delivers energy faster — so a bright-but-red beam should eventually pry electrons loose, if slowly. It never does. The experiment says the interaction is per-photon: one photon, one chance. Each photon must individually carry enough energy to pay the metal's escape fee, the work function, and no number of insufficient photons adds up to one sufficient one.",
          },
          {
            type: "code",
            language: "python",
            code: `h = 6.626e-34       # J s, Planck constant
c = 2.998e8         # m/s
e = 1.602e-19       # J per eV

def photon_ev(wavelength_nm):
    """The energy of one photon, in electron-volts."""
    return h * c / (wavelength_nm * 1e-9) / e

for nm in [400, 450, 550, 700]:
    print(f"{nm} nm photon: {photon_ev(nm):.2f} eV")

print("Visible band spans:", f"{photon_ev(750):.2f}", "eV to", f"{photon_ev(380):.2f}", "eV")`,
            output: "400 nm photon: 3.10 eV\n450 nm photon: 2.76 eV\n550 nm photon: 2.25 eV\n700 nm photon: 1.77 eV\nVisible band spans: 1.65 eV to 3.26 eV",
            caption:
              "E = hc/λ, computed. The whole visible spectrum fits inside 1.65–3.26 eV — the same range as chemical bond energies. That compactness is why one photon can trigger one molecular change: vision, photosynthesis, photochemistry.",
          },
          {
            type: "table",
            headers: ["Colour", "Wavelength", "Photon energy", "What it costs you"],
            rows: [
              ["Violet", "400 nm", "3.10 eV", "Enough to trigger some metals"],
              ["Blue", "450 nm", "2.76 eV", "Blue-ray discs read data at this energy"],
              ["Green", "550 nm", "2.25 eV", "Peak of the Sun's output"],
              ["Red", "700 nm", "1.77 eV", "Below most metals' work functions — never ejects"],
            ],
          },
          {
            type: "diagram",
            diagramId: "quantum-photoelectric-diagram",
            caption:
              "Photons striking a metal surface: below the threshold frequency every photon bounces off; above it, each photon ejects one electron carrying the surplus as kinetic energy.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Einstein's 1905 explanation of this effect was his Nobel citation (1921) — not relativity. The committee's caution is famous; the paper was called 'On a Heuristic Point of View Concerning the Production and Transformation of Light'.",
          },
          {
            type: "example",
            text: "A silicon solar cell works on the same per-packet logic: silicon's band gap is 1.12 eV, so any visible photon (1.65–3.26 eV) can create one electron–hole pair, and the excess above the gap becomes the pair's kinetic energy, which the cell collects as voltage. A red photon delivers less surplus than a violet one — and a photon below 1.12 eV, however bright, creates nothing.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The photoelectric result does not mean light stopped being a wave. It still interferes and diffracts. What quantum theory adds is that the wave's energy arrives in countable packets — the wave tells you the odds, the packet is what lands.",
          },
          {
            type: "theory",
            prompt:
              "A very bright red lamp cannot eject electrons from a photosensitive metal; a feeble ultraviolet lamp ejects them instantly. Brightness is the wrong dial. Explain what the experiment reveals about the structure of light, and why 'more' does not help when the per-packet energy is insufficient."
            ,
            modelAnswer:
              "The result forces light's energy to be delivered in indivisible packets whose size is fixed by frequency, E = hf. A red photon carries about 1.8 eV; if the metal's work function is 2.5 eV, every red photon is individually short of the escape fee, and no arrangement of light can make a brighter lamp's photons cooperate — each absorption is a single event. Ten thousand insufficient photons absorbed a thousand times over still eject nothing; what matters is one arrival of sufficient size. The ultraviolet photon carries about 3.3 eV, so it pays the fee with change to spare, and the surplus becomes the ejected electron's kinetic energy — which is why even dim UV works, and why ejection is immediate (there is no waiting while a bright red wave 'pumps up' an atom). This is the experiment that made quantisation physical fact rather than Planck's 1900 mathematical trick, and it is why photoelectron spectroscopy can identify materials from the threshold they show.",
            explanation:
              "The same per-packet logic governs the next depth: Bohr's orbits are allowed only because electron waves must fit whole numbers of times around.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "A 550 nm photon has what energy, in eV?",
            answer: "About 2.25 eV — E = hc/λ with h = 6.626×10⁻³⁴ and c = 3×10⁸.",
            explanation:
              "Shorter wavelength means higher energy: the ratio is exact, one over λ. This is why ultraviolet burns and infrared only warms.",
          },
          {
            type: "question",
            prompt: "Why does doubling the brightness of red light not eject electrons if the single-photon energy is too small?",
            answer: "Because ejection is a per-photon event. Brightness adds photons, not energy per photon; each photon still pays or fails to pay the work function on its own.",
            explanation:
              "Only raising the frequency (shortening the wavelength) raises the per-photon energy — the quantity that is actually short.",
          },
          {
            type: "mcq",
            stem: "Which observation forces light to arrive in packets?",
            options: [
              "Light travels at a finite speed",
              "Electrons are ejected immediately at any brightness above a threshold frequency",
              "Light bends around a slit",
              "Light exerts pressure on a surface",
            ],
            correctIndex: 1,
            explanation:
              "The immediacy and the frequency threshold are both per-photon signatures. Diffraction is the wave side of the same coin; pressure is classical.",
          },
          {
            type: "mcq",
            stem: "Ranking by photon energy: red, green, blue, ultraviolet — which order is correct, weakest first?",
            options: [
              "Red, green, blue, ultraviolet",
              "Ultraviolet, blue, green, red",
              "They all have the same energy",
              "Green, red, blue, ultraviolet",
            ],
            correctIndex: 0,
            explanation:
              "E = hc/λ: energy rises as wavelength falls. Red < green < blue < ultraviolet is the same ordering as wavelengths reversed, as in the sky trail's spectrum table.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Light's energy arrives in frequency-sized packets, and the visible band spans only 1.65–3.26 eV per photon. Next: what happened when the classical picture met the atom itself.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-explore",
      title: "The atom that should not exist",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "The classical atomic crisis" },
          {
            type: "paragraph",
            text: "By 1910 Rutherford's scattering experiments had proved the atom has a tiny, massive, positive nucleus with electrons somewhere around it. Apply classical electromagnetism to that picture and it collapses: an orbiting electron is an accelerating charge, and an accelerating charge must radiate; radiating, it loses energy; losing energy, it spirals inward. Run the numbers and hydrogen should vanish in well under a picosecond. Atoms are stable. Something in the classical picture is wrong.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

# Bohr energies: E_n = -13.6 eV / n^2
for n in [1, 2, 3, 5]:
    print(f"n={n}: {(-13.6 / n**2):.2f} eV")

# Transition wavelengths inside hydrogen
def transition_ev(n_hi, n_lo):
    return 13.6 * (1 / n_lo**2 - 1 / n_hi**2)

h = 6.626e-34
c = 2.998e8
e = 1.602e-19

for n_hi, n_lo, name in [(3, 2, "H-alpha"), (4, 2, "H-beta"), (2, 1, "Lyman-alpha")]:
    energy = transition_ev(n_hi, n_lo)
    lam = h * c / (energy * e) * 1e9
    print(f"{name}: {energy:.2f} eV, {lam:.0f} nm")

# The classical problem: an orbiting charge radiates its energy away
q = 1.602e-19
m = 9.109e-31
r = 5.29e-11          # m, Bohr radius
v = 2.19e6            # m/s, ground-state speed
eps0 = 8.854e-12

a = v**2 / r
P = q**2 * a**2 / (6 * math.pi * eps0 * c**3)   # Larmor formula
E = 13.6 * 1.602e-19  # J, the binding energy

print("Classical collapse time:", f"{E / P:.2e}", "s")`,
            output: "n=1: -13.60 eV\nn=2: -3.40 eV\nn=3: -1.51 eV\nn=5: -0.54 eV\nH-alpha: 1.89 eV, 656 nm\nH-beta: 2.55 eV, 486 nm\nLyman-alpha: 10.20 eV, 122 nm\nClassical collapse time: 4.64e-11 s",
            caption:
              "Two stories in one block. The Bohr lines reproduce hydrogen's spectrum exactly — 656, 486, 122 nm. And the Larmor formula times the ground-state binding energy says classical physics destroys an atom in about 5×10⁻¹¹ seconds, the tenth-of-a-nanosecond crisis.",
          },
          {
            type: "definition",
            term: "Bohr's postulates (1913)",
            text: "Electrons orbit only at certain allowed radii, each with a fixed energy; in these orbits they do not radiate; they jump between orbits by absorbing or emitting a photon of exactly the energy difference. Allowed angular momenta are whole multiples of ℏ — and, as de Broglie showed in 1924, that is the same as saying the electron's wave must fit an integer number of times around the orbit.",
          },
          {
            type: "paragraph",
            text: "Bohr's model earned its keep on prediction, not plausibility. From n = 1, 2, 3… and a single fit to hydrogen's spectrum it computed every line of the Balmer series, the Lyman series, and the ionisation energy of 13.6 eV — all in agreement with measurements that had no theoretical account before. It also named the ground state: an electron can fall no further than n = 1, so there is nothing to radiate away. Stability becomes a boundary condition.",
          },
          {
            type: "table",
            headers: ["Level", "Energy (eV)", "Radius (nm)", "Spectrum"],
            rows: [
              ["n = 1", "−13.60", "0.053", "Ground state — nothing below it"],
              ["n = 2", "−3.40", "0.212", "Emits visible Balmer light (656, 486 nm) when falling from above"],
              ["n = 3", "−1.51", "0.476", "Balmer absorption from hot gas"],
              ["n = 5", "−0.54", "1.32", "Approaches the ionisation limit 0 eV"],
            ],
          },
          {
            type: "example",
            text: "A neon sign's colour is an electron jumping between atomic energy levels — each element's levels are its fingerprint. Astronomers read stars the same way: the dark absorption lines in a star's light are the atoms in its atmosphere nibbling exactly those frequencies, as in the sky trail's spectrum work.",
          },
          {
            type: "diagram",
            diagramId: "quantum-bohr-levels",
            caption:
              "Bohr's ladder: fixed energies, forbidden gaps. Photons come out in sizes equal to the gaps — and in nowhere else, which is why line spectra are lines.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Bohr's model fails for every atom past hydrogen and for the fine details of hydrogen itself. It is a bridge, not a destination: the modern theory needs the matter-wave picture, which the Go-Deeper depth builds.",
          },
          {
            type: "theory",
            prompt:
              "A classical orbiting electron should radiate continuously and spiral into the nucleus in about 10⁻¹⁰ s, yet atoms are stable. State what Bohr changed to forbid the collapse, what price that change exacted from him, and how de Broglie's 1924 matter wave later paid it."
            ,
            modelAnswer:
              "Bohr froze the collapse with a postulate: electrons in the lowest allowed orbit simply do not radiate. That is not derived from anything — it is a rule inserted to make the atom stable. The price was conceptual: the atom kept its planetary imagery (electrons orbiting in circles around the nucleus) but the period of the orbit and the orbit itself had no classical cause, and the model could compute hydrogen yet said nothing concrete about helium, no two atoms shared rigorously, and the transition between orbits was unexplained. His nights spent at the Manchester institute wrestling with the spectrum were later described by his collaborator as 'theoretical despair'. What paid the bill was de Broglie's hypothesis: an electron is a wave of wavelength λ = h/p, so an orbit is allowed only if that wave closes on itself smoothly — nλ = 2πr, which reproduces Bohr's angular momentum quantisation as a standing-wave condition, and generalises to any orbit and any atom. The collapse is forbidden because a wave cannot end in the middle of the atom; only whole-fitted standing waves exist.",
            explanation:
              "This is the recurring pattern of the field: the model works, the explanation arrives later, and the imagery gets replaced by wave geometry.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Why do elements emit line spectra — colours at discrete wavelengths — rather than continuous ones?",
            answer: "Because atomic energy levels are discrete. A photon's energy is fixed by the gap an electron jumps, so only those energies, and only those wavelengths, come out.",
            explanation:
              "A continuous spectrum comes from any hot body; a line spectrum is the whispering gallery of quantum structure, the subject of the next depth.",
          },
          {
            type: "question",
            prompt: "What is the ionisation energy of hydrogen in eV?",
            answer: "13.6 eV — the energy to take an electron from n = 1 to n = ∞.",
            explanation:
              "It is the first Bohr level's binding energy, and it matches measurements exactly. One eV is 1.6×10⁻¹⁹ J, so ionisation of H is about 2.18×10⁻¹⁸ J per atom.",
          },
          {
            type: "mcq",
            stem: "According to classical physics, an atom should…",
            options: [
              "Be perfectly stable, as observed",
              "Collapse in about 10⁻¹⁰ s as the electron radiates and spirals in",
              "Emit a continuous rainbow",
              "Have no electrons at all",
            ],
            correctIndex: 1,
            explanation:
              "The Larmor formula applied to a ground-state hydrogen orbit gives a lifespan around 5×10⁻¹¹ s. The observed world is not classical at atomic scales.",
          },
          {
            type: "mcq",
            stem: "Bohr's model is best described as…",
            options: [
              "The complete quantum theory of atoms",
              "A quantised planetary model that fits hydrogen but is superseded by matter waves",
              "A classical model with no quantisation",
              "A statistical model of gas collisions",
            ],
            correctIndex: 1,
            explanation:
              "Bohr mixed classical orbits with quantum postulates. Its successes on hydrogen were real, its failures on helium dramatic — the modern picture arrives with Schrödinger.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Classical physics cannot keep an atom standing for longer than 10⁻¹⁰ s. Bohr saved it with discrete, non-radiating levels that reproduce hydrogen's spectrum — and left the reason unexplained. Next: the matter-wave picture that explains it.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-deeper",
      title: "Waves of matter",
      estimatedMinutes: 14,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "If electrons are waves…" },
          {
            type: "paragraph",
            text: "de Broglie's 1924 hypothesis was a symmetry argument: light behaves as a particle and as a wave, so perhaps particles also behave as waves. The wavelength of a particle of momentum p is λ = h/p. For everyday objects the wavelength is hopelessly small; for an electron it compares with the atom itself — which is exactly the scale on which the old picture was broken.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

h = 6.626e-34
m_e = 9.109e-31
hbar = h / (2 * math.pi)

# de Broglie wavelength of an electron
for speed in [1e6, 1e7]:
    lam = h / (m_e * speed)
    print(f"{speed:.0e} m/s electron: {lam * 1e9:.3f} nm")

# Heisenberg: confine an electron to the size of a nucleus
dx = 1e-14           # m, a proton's diameter
dp = hbar / (2 * dx)
dv = dp / m_e

print(f"Minimum momentum spread: {dp:.2e} kg m/s")
print(f"Implied speed spread: {dv:.2e} m/s")`,
            output: "1e+06 m/s electron: 0.727 nm\n1e+07 m/s electron: 0.073 nm\nMinimum momentum spread: 5.27e-21 kg m/s\nImplied speed spread: 5.79e+09 m/s",
            caption:
              "Electron wavelengths: at 10⁶ m/s the electron's wave is 0.73 nm — dozens fit across an atom. And confining an electron to a nucleus would force a momentum spread implying speeds faster than light — which is why electrons cannot sit inside nuclei at all.",
          },
          {
            type: "definition",
            term: "de Broglie wavelength",
            text: "λ = h/p — every particle carries a wave whose wavelength shrinks as momentum grows. The Bohr orbit condition nλ = 2πr is a standing-wave requirement, and it is why angular momentum is quantised in units of ħ.",
          },
          {
            type: "definition",
            term: "Heisenberg's uncertainty principle",
            text: "Δx·Δp ≥ ħ/2. A wave squeezed into a small region of space must spread out in momentum. It is not a measurement effect or an observer effect: it is the geometry of waves — localisation and frequency-purity are trade-offs.",
          },
          {
            type: "paragraph",
            text: "The two results above are the same insight twice. An atom's size is not fortuitous: confine an electron to a smaller box and its momentum spread, and hence its kinetic energy, must rise. The ground state is where confinement cost and binding energy balance — so atoms cannot be squeezed smaller, and electrons cannot live inside nuclei. The stable atom is a standing-wave compromise, not a miniature orbit.",
          },
          {
            type: "table",
            headers: ["Particle", "Speed", "de Broglie wavelength", "What it fits"],
            rows: [
              ["Electron in a TV tube", "3×10⁷ m/s", "0.024 nm", "Wavelength below the atom — why electron microscopes see them"],
              ["Electron at Bohr speed", "2.19×10⁶ m/s", "0.33 nm", "Fits exactly once around the hydrogen ground-state orbit (n = 1: 2πr = 0.33 nm)"],
              ["Electron, slow (10⁶ m/s)", "10⁶ m/s", "0.727 nm", "About seven wavelengths across an atom's diameter — spreads across molecules"],
              ["You, walking", "1.5 m/s", "6.3×10⁻³⁶ m", "Nothing whatsoever"],
            ],
          },
          {
            type: "example",
            text: "The electron microscope (Ruska, 1931) works because electrons at 10⁷ m/s have wavelengths over 20,000 times shorter than visible light. Resolution follows wavelength: with electron waves you resolve individual atoms in a lattice, which no optical microscope can do.",
          },
          {
            type: "diagram",
            diagramId: "quantum-de-broglie-orbit",
            caption:
              "The orbit as a standing wave: only wavelengths that fit the circumference an integer number of times survive; the others cancel around the loop and cannot exist.",
          },
          {
            type: "callout",
            variant: "warning",
            text: "The uncertainty principle is not 'you can't measure things precisely'. It is that a particle with a definite position cannot have a definite momentum — the two wave pictures are mutually exclusive. No instrument can be blamed for it.",
          },
          {
            type: "theory",
            prompt:
              "The uncertainty principle is commonly explained as 'measurement disturbs the system'. Offer the sharper reading based on the wave nature of matter, and use it to explain why an electron cannot be confined inside an atomic nucleus."
            ,
            modelAnswer:
              "The sharper reading is about what waves can be, not about instruments. A matter wave with a well-defined momentum is a long, regular train of crests; squeezing that train into a small region Δx forces you to superpose many wavelengths, so the momentum spread grows as roughly ħ/Δx. That is Fourier duality — the same mathematics that lets a wave packet spread or a sound's note be pure only over long times. An electron confined to a nucleus (Δx ≈ 10⁻¹⁴ m) would carry a momentum spread of at least about 5×10⁻²¹ kg·m/s, corresponding to speeds of 10⁹ m/s — beyond the speed of light. Relativity forbids that source of energy, so the confinement cannot happen: electrons stay outside nuclei, which is why matter is tens of thousands of times larger than the nuclei it contains. The principle is a statement about what states exist, not about what a measurement clumsily does to them.",
            explanation:
              "The same arithmetic, run the other way, explains the research depth's fine structure: forces stronger when waves are squeezed shorter.",
          },
          { type: "heading", level: 2, text: "Check your understanding" },
          {
            type: "question",
            prompt: "Why do electron microscopes beat light microscopes?",
            answer: "Because resolution follows wavelength, and electrons can be accelerated to wavelengths far shorter than visible light.",
            explanation:
              "At 3×10⁷ m/s an electron's wavelength is 0.024 nm — thousands of times finer than green light, enough to resolve atomic lattices.",
          },
          {
            type: "question",
            prompt: "If an electron's position is known very precisely, what happens to its momentum?",
            answer: "It becomes correspondingly uncertain — Δx·Δp ≥ ħ/2. Tight in space, broad in momentum.",
            explanation:
              "Not because the act of measuring ruined it: the state itself cannot be simultaneously sharp in both.",
          },
          {
            type: "mcq",
            stem: "Which condition makes an orbit allowed in the wave picture?",
            options: [
              "The circumference is an integer number of wavelengths",
              "The orbit is a perfect circle",
              "The speed is less than light",
              "The electron is not radiating",
            ],
            correctIndex: 0,
            explanation:
              "nλ = 2πr — the standing-wave condition. Any other wavelength destructively interferes with itself after one lap and averages to nothing.",
          },
          {
            type: "mcq",
            stem: "As a particle's momentum increases, its de Broglie wavelength…",
            options: ["Increases", "Decreases", "Stays the same", "Doubles"],
            correctIndex: 1,
            explanation:
              "λ = h/p. More momentum, shorter wave — which is why fast electrons resolve fine detail and slow ones smear across molecules.",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "Particles are waves with λ = h/p; waves squeezed into small spaces must spread in momentum; orbits are standing-wave fits. The atom's stability and its size both fall out of wave geometry, not force-balance. Next: the modern theory and the constant nobody can derive.",
          },
        ],
      },
    },
    {
      suffix: "-lesson-research",
      title: "Quantum mechanics as a research field",
      estimatedMinutes: 18,
      content: {
        blocks: [
          { type: "heading", level: 2, text: "From crisis to theory" },
          {
            type: "paragraph",
            text: "Quantum mechanics arrived because classical physics failed on exactly three fronts: the spectrum of a hot body (Planck, 1900), the photoelectric effect (Einstein, 1905), and the stability and spectra of atoms (Bohr, 1913; de Broglie, 1924). Between 1925 and 1927 the field assembled itself into a complete mathematical theory — two independent ways, by Heisenberg (matrix mechanics) and Schrödinger (wave mechanics), soon proven equivalent.",
          },
          {
            type: "definition",
            term: "The postulates, in research language",
            text: "A system's state is a vector in a Hilbert space; measurable quantities are operators on that space; measurement returns an eigenvalue and collapses the state to that eigenvector; the state evolves deterministically between measurements by a unitary equation. These are not interpretations — they are the theory, and they work.",
          },
          {
            type: "definition",
            term: "Schrödinger's equation",
            text: "iħ ∂ψ/∂t = Ĥψ — the Hamiltonian operator acting on the state vector gives its time evolution. Its eigenvalue problem Ĥψ = Eψ is the modern form of 'which orbits are allowed': the standing waves of the previous depth are its eigenfunctions.",
          },
          {
            type: "code",
            language: "python",
            code: `import math

e = 1.602176634e-19      # C, exact
eps0 = 8.8541878128e-12  # F/m, exact
hbar = 1.054571817e-34   # J s
c = 299_792_458          # m/s, exact

alpha = e**2 / (4 * math.pi * eps0 * hbar * c)
print("Fine-structure constant:", f"{alpha:.6f}")
print("1/alpha:", round(1 / alpha, 2))

# What alpha sets: the speed of the Bohr orbit's electron
v = alpha * c
print("Bohr orbit speed:", f"{v:.3e}", "m/s")
print("As a fraction of c:", round(alpha, 4))`,
            output: "Fine-structure constant: 0.007297\n1/alpha: 137.04\nBohr orbit speed: 2.188e+06 m/s\nAs a fraction of c: 0.0073",
            caption:
              "α = e²/4πε₀ħc ≈ 1/137.036, computed from four SI constants. It sets the strength of every electromagnetic interaction — and it fell out of the Bohr model as the orbital speed in units of c, the fact that makes chemistry non-relativistic at all.",
          },
          {
            type: "paragraph",
            text: "That number is the research taboo of the field. α is dimensionless, so it does not depend on any choice of units; it is measured, not derived, by the standard model. Its value controls the fine splitting of hydrogen's lines (the 'fine structure' of its name), and through that, the size of every atom, the pace of every chemical reaction, and the temperature of every star. A few percent different and stars would not shine as they do. Nobody knows where the number comes from.",
          },
          {
            type: "table",
            headers: ["Year", "Result", "What changed"],
            rows: [
              ["1900", "Planck's quanta", "Energy comes in finite units"],
              ["1905", "Photoelectric effect", "Light itself is quantised"],
              ["1913", "Bohr's atom", "Discrete orbits; spectra predicted"],
              ["1924", "de Broglie", "Particles are waves"],
              ["1925", "Heisenberg; Schrödinger (1926)", "Complete quantum mechanics"],
              ["1927", "Born's probability reading", "|ψ|² is a probability density"],
              ["1927", "Solvay Conference", "The Copenhagen interpretation framed"],
              ["1948", "QED (Feynman, Schwinger, Tomonaga)", "Quantum fields; Nobel 1965"],
              ["1964", "Bell's theorem", "Entanglement is non-classical"],
              ["2022", "Nobel Physics", "Entanglement experiments closed the loopholes"],
            ],
          },
          {
            type: "example",
            text: "The first atomic bomb and the first transistors both came out of the 1925–27 kernel. Quantum mechanics underlies lasers, MRI, LEDs, semiconductors, magnetic resonance — and the photochemistry of every leaf, since a chlorophyll molecule is a quantum antenna tuned by evolution to the 2.25 eV photons of the first depth.",
          },
          {
            type: "diagram",
            diagramId: "quantum-wavefunction-amplitude",
            caption:
              "A wavefunction's amplitude squared: bright where the particle is likely to be found, dark elsewhere. The quantum cloud is not a smeared orbit — it is a probability amplitude, and no planet-shaped picture survives it.",
          },
          {
            type: "callout",
            variant: "info",
            text: "Entanglement is the feature with no classical cousin. Two particles share one state; measuring one instantaneously updates the other's probabilities — without transmitting a signal, which is why relativistic causality survives. Bell's 1964 theorem turned the philosophical dispute into a numbers game, and the experiments (Aspect 1982, Zeilinger, Clauser) settled it: nature is not secretly classical.",
          },
          {
            type: "paragraph",
            text: "The honest research frontier remains open. QED is the most precisely tested theory in physics — its predictions for the electron's magnetic moment agree to one part in 10¹² — yet it is superseded experimentally at higher energies, and the measurement problem (what 'measurement' is, physically) has no consensus resolution. The quantum field also contains the smallest length and time in physics, the Planck scale of 1.6×10⁻³⁵ m and 5.4×10⁻⁴⁴ s, which is where the scale trail's ladder finally bottoms out — the rung where a quantum theory of gravity is still missing.",
          },
          {
            type: "theory",
            prompt:
              "The fine-structure constant α ≈ 1/137.036 is the most famous number in physics that no theory derives. Explain why its dimensionless character makes it physically fundamental, what would be different if it were 1/10 or 1/1,000, and why its derivations-absence bothers physicists."
            ,
            modelAnswer:
              "A dimensionless constant is a statement about the relative strength of two aspects of nature, untouched by the units you happen to use. α measures the strength of the electromagnetic coupling: it is the electron's orbital speed in units of c, the splitting factor of hydrogen's fine structure, the ratio that sets atom sizes, and the expansion parameter of every QED calculation. That one number governs atomic radii (a₀ = ħ/αmc), photon absorption rates, the temperature of stellar cores, and the chemistry that life exploits. If α were 1/10, atoms would be ten times smaller, matter would be 10⁻³ times less dense, stars would burn hotter and faster, and the fine splittings of the quantum trail would be visible in a hand spectroscope. If α were 1/1,000, atoms would rarely bind and chemistry would be too weak to build molecules. Its being 1/137 is why the universe is neither boring nor a solid lump. Physicists are bothered because the rest of the standard model's constants are at least constrained by theory; α has resisted every derivation, its value is an experimental input, and whether it has varied over cosmic time is still an observational question.",
            explanation:
              "Sommerfeld introduced it in 1916 as 'the coupling of the electron to light'. Pauli, Eddington and Dirac all tried to derive it; the efforts are a documented history of honest failure.",
          },
          {
            type: "question",
            prompt: "Heisenberg's matrix mechanics and Schrödinger's wave mechanics were built on different mathematics. How were they shown to be the same theory, and what did Born add that neither had?",
            answer: "Schrödinger proved the two formulations mathematically equivalent — they are two representations of the same structure, matrix operators acting on vectors versus differential operators on wavefunctions. What neither contained was a physical reading of the wavefunction: Born supplied it in 1926, arguing that |ψ|² is the probability density of finding the particle at a point. That interpretive step is what turned a set of equations into a theory that makes predictions about measurement.",
            explanation:
              "The equivalence is a lesson in theory structure: the same physics can be encodable in unrelated mathematics, and identifying the shared structure is a research skill in itself.",
          },
          { type: "heading", level: 2, text: "References and further reading" },
          {
            type: "paragraph",
            text: "Planck (1900), Einstein (1905), Bohr (1913) — the three papers that broke the classical picture. de Broglie's thesis (1924). Schrödinger, Annalen der Physik (1926). Born (1926) — the probability interpretation. Dirac (1928) — the relativising equation. Feynman, QED: The Strange Theory of Light and Matter (1985). Bell, Physics (1964). Aspect, Physical Review Letters (1982).",
          },
          { type: "heading", level: 2, text: "Summary" },
          {
            type: "paragraph",
            text: "The quantum theory is built from waves, operators and probabilities, and it is exact about everything ordinary matter does. It leaves open the deepest questions in physics — what measurement is, what α is, and how gravity joins — and it is here that this field's trails end: seven question-led paths, one physics, from a falling apple to a probability cloud.",
          },
        ],
      },
    },
  ],
};

/** Every trail in this field, in display order: physics mapped across its domains. */
export const TRAILS: TrailSeed[] = [
  SCALE_TRAIL,
  SKY_TRAIL,
  MOTION_TRAIL,
  HEAT_TRAIL,
  WAVE_TRAIL,
  CURRENT_TRAIL,
  QUANTUM_TRAIL,
];

/**
 * Stable string hash (FNV-1a). Deterministic across runs and process restarts,
 * which is what makes the option rotation below reproducible rather than a
 * fresh shuffle on every seed.
 */
function stableHash(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministic, index-stable rotation of an mcq's options so the correct
 * answer does not sit in the same slot across a whole trail. Mirrors the
 * rotation the introduction-to-programming seeder applies to its SBA items.
 * No explanation in this file names an option letter, so rotating is safe —
 * correctIndex is carried across with the option it points at.
 */
function balancedContent(content: LessonContent, lessonId: string): LessonContent {
  return {
    blocks: content.blocks.map((block, index) => {
      if (block.type !== "mcq") return block;
      const options = block.options;
      const rot = stableHash(`${lessonId}:${index}`) % options.length;
      const rotated = options.slice(rot).concat(options.slice(0, rot));
      const correctIndex = (block.correctIndex - rot + options.length) % options.length;
      return { ...block, options: rotated, correctIndex };
    }),
  };
}

/**
 * Idempotent: safe to run repeatedly. Creates or refreshes one discovery field,
 * seven trails and their lessons (4 depths each) — all upserts on stable ids,
 * so no row is ever duplicated and orderIndex stays stable.
 *
 * The round-1 quiz Question rows are retired here by stable id: discovery
 * carries logical and conceptual questions only, never graded quizzes.
 */
export async function seedDiscoveryCuriosity(): Promise<void> {
  const field = await prisma.topic.upsert({
    where: { id: FIELD_ID },
    update: {
      title: FIELD_TITLE,
      slug: FIELD_SLUG,
      domain: "extras",
      parentId: null,
      orderIndex: FIELD_ORDER,
      isPublished: true,
      description:
        "Question-led trails through physics — mechanics, thermodynamics, waves & optics, electricity & magnetism, quantum and cosmology — each at four depths: Understand, Explore, Go Deeper, Research.",
      // A human has not read this content; the seeder never marks it verified.
      needsVerification: true,
    },
    create: {
      id: FIELD_ID,
      title: FIELD_TITLE,
      slug: FIELD_SLUG,
      domain: "extras",
      parentId: null,
      orderIndex: FIELD_ORDER,
      isPublished: true,
      description:
        "Question-led trails through physics — mechanics, thermodynamics, waves & optics, electricity & magnetism, quantum and cosmology — each at four depths: Understand, Explore, Go Deeper, Research.",
      needsVerification: true,
    },
  });

  // No quizzes in discovery: retire the round-1 quiz rows on every run. On a
  // fresh database there is nothing to delete and this is a no-op.
  const retired = await prisma.question.deleteMany({
    where: { id: { in: RETIRED_QUIZ_IDS } },
  });

  let lessonCount = 0;
  let theoryCount = 0;

  for (const trail of TRAILS) {
    await prisma.topic.upsert({
      where: { id: trail.id },
      update: {
        title: trail.title,
        domain: "extras",
        parentId: field.id,
        orderIndex: trail.order,
        isPublished: true,
        description: trail.description,
        needsVerification: true,
      },
      create: {
        id: trail.id,
        title: trail.title,
        domain: "extras",
        parentId: field.id,
        orderIndex: trail.order,
        isPublished: true,
        description: trail.description,
        needsVerification: true,
      },
    });

    for (let depth = 0; depth < trail.depths.length; depth++) {
      const d = trail.depths[depth];
      const lessonId = `${trail.id}${d.suffix}`;
      const content = balancedContent(d.content, lessonId);
      theoryCount += content.blocks.filter((b) => b.type === "theory").length;
      await prisma.lesson.upsert({
        where: { id: lessonId },
        update: {
          title: d.title,
          domain: "extras",
          topicId: trail.id,
          orderIndex: depth,
          estimatedMinutes: d.estimatedMinutes,
          content: content as never,
        },
        create: {
          id: lessonId,
          title: d.title,
          domain: "extras",
          topicId: trail.id,
          orderIndex: depth,
          estimatedMinutes: d.estimatedMinutes,
          content: content as never,
        },
      });
      lessonCount++;
    }
  }

  console.log(
    `✓ Curiosity Trails: 1 field, ${TRAILS.length} trails (${TRAILS.map((t) => t.branch).join(", ")}), ${lessonCount} lessons (${DEPTH_TITLES.length} depths each), ${theoryCount} theory prompts, ${retired.count} quiz rows retired`,
  );
}

// CLI usage: npx ts-node prisma/seed-courses/discovery-curiosity.ts
if (process.argv[1] && process.argv[1].includes("discovery-curiosity")) {
  seedDiscoveryCuriosity()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
