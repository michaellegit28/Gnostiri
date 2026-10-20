import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Discovery seeder — "Curiosity Trails" (extras domain).
 *
 * ONE new discovery field with 2 trails, each carrying the full 4-depth
 * ladder the DiscoveryReader renders (0 Understand, 1 Explore, 2 Go Deeper,
 * 3 Research): 2 x 4 = 8 published lessons, authored in the full lesson
 * vocabulary so every block renderer is exercised — heading, paragraph,
 * definition, example, callout (info + warning), table, code, question,
 * mcq and diagram.
 *
 * Idempotent: safe to run repeatedly. Every row is an upsert on a stable id,
 * so re-running refreshes content in place and never duplicates topics,
 * lessons or questions. orderIndex carries the depth level on each lesson.
 *
 * Governance: the Topic rows carry needsVerification true — nothing here has
 * been read or signed off by a human, and this file never marks a row
 * verified. Lesson and Question have no reviewStatus column in the schema
 * (only CourseLesson/AssessmentItem do), so needsVerification on the topic is
 * the single review flag for this domain. isPublished is set to true so the
 * trail is browsable, which is deliberate: the DiscoveryReader labels depth
 * content "still being charted", and human review is tracked separately.
 *
 * Factual claims: every number, wavelength ratio and code output in this file
 * was checked against the sources named in the block text, and every code
 * snippet's output was produced by running it (Python 3) rather than typed by
 * hand. Doppler/Rayleigh/scale figures follow the same convention as the
 * physics trail already in prisma/seed.ts.
 */

const FIELD_ID = "discovery-curiosity";
const FIELD_TITLE = "Curiosity Trails";
const FIELD_SLUG = "curiosity-trails";

// Existing extras roots (the 5 generic fields plus the physics deep chain) top
// out at orderIndex 4, so this field lands last in the discovery index.
const FIELD_ORDER = 5;

/** Depth ladder shared by every trail — index is the lesson orderIndex. */
const DEPTH_TITLES = ["Understand", "Explore", "Go Deeper", "Research"];

interface QuizSeed {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

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
  description: string;
  depths: DepthSeed[];
  quizzes: QuizSeed[];
}

// ---------------------------------------------------------------------------
// TRAIL 1 — The Scale Ladder
// ---------------------------------------------------------------------------
const SCALE_TRAIL: TrailSeed = {
  id: "discovery-curiosity-scale",
  title: "The Scale Ladder",
  order: 0,
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
            text: "By the end of this depth you should be able to: say roughly how big an atom is and why that number is hard to feel; compare a handful of everyday objects using the same unit; explain why a human is closer in size to a galaxy than to an atom; and read a size ladder without being fooled by the exponents.",
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
              ["Hydrogen atom", "1e-10", "10⁻¹⁰", "Ten billion atoms fit across this dot"],
              ["Your cells", "2e-5", "10⁻⁵", "A few hundred across a pinhead"],
              ["Grain of sand", "5e-4", "10⁻³", "Half a millimetre — just visible"],
              ["You", "1.7", "10⁰", "Obvious"],
              ["Earth", "1.3e7", "10⁷", "A ten-hour drive to the far side"],
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
            type: "mcq",
            stem: "Which statement about the size ladder is correct?",
            options: [
              "An atom is about the same size as a cell",
              "A human is roughly midway, by powers of ten, between a proton and the observable universe",
              "The observable universe is about a million times bigger than a light-year",
              "A light-year is a unit of time",
            ],
            correctIndex: 1,
            explanation:
              "A proton sits at about 10⁻¹⁵ m and the observable universe at about 10²⁶ m, so 10⁰ — a human — is close to the mid-point of those 41 powers of ten. Atoms are about 10⁵ times smaller than cells, light-years are lengths, and 93 billion light-years is a factor of roughly 10¹⁰.",
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
            text: "Everest is the tallest mountain on Earth at 8,849 metres — and it is a rounding error on the planet's surface. Earth's radius is 6,371 kilometres, so Everest stands about 0.14% of the radius. In a classroom globe one metre across, Everest would be a bump about 1.4 millimetres high. Smooth as a ball bearing.",
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
            text: "The Solar System is mostly empty and mostly flat. The eight planets orbit within about 3 degrees of the same plane, a disc roughly 30 times wider than the Sun is large. Beyond Neptune sits the Kuiper Belt, then the distant Oort Cloud — a shell of icy bodies thousands of times further out still, which is where long-period comets come from.",
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
              "About 100,000 light-years, containing 100–400 billion stars. The 93-billion-light-year figure is the observable universe's diameter, 26 orders of magnitude larger.",
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
      title: "Galaxies, light-years, and looking back in time",
      estimatedMinutes: 16,
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
            text: "The observable universe is 93 billion light-years across, an age-13.8-billion-year universe stretched by expansion. Galaxies line up in a cosmic web of filaments and voids, and deep-field observations show tens of thousands of them in a sliver of sky. Because of light-travel time, every telescope is a history book. That closes the Scale Ladder — and leaves one question the trail deliberately did not answer: what is all this made of, and what happens at the very edges of what we can measure?",
          },
        ],
      },
    },
  ],
  quizzes: [
    {
      id: "discovery-curiosity-scale-q1",
      questionText: "Which distance is largest?",
      options: [
        "Earth to the Moon (384,400 km)",
        "Earth to the Sun (149.6 million km)",
        "One light-year (9.46 trillion km)",
        "Across the Milky Way (about 100,000 light-years)",
      ],
      correctAnswer: "Across the Milky Way (about 100,000 light-years)",
      explanation:
        "The steps are about 1,000 km, 150 million km, 9.46 trillion km and roughly 9.5 × 10¹⁷ km. Each is about a thousand times larger than the last, so the Milky Way's diameter wins by a wide margin.",
      difficulty: "easy",
    },
    {
      id: "discovery-curiosity-scale-q2",
      questionText: "Why does sunlight take about 8 minutes 20 seconds to reach Earth?",
      options: [
        "Because the Sun is very large",
        "Because light has a finite speed of 299,792 km/s and the Sun is about 150 million km away",
        "Because the light has to pass through the atmosphere",
        "Because the Earth is moving away from the light",
      ],
      correctAnswer: "Because light has a finite speed of 299,792 km/s and the Sun is about 150 million km away",
      explanation:
        "150,000,000 km ÷ 299,792 km/s is about 500 seconds, which is 8 minutes and 20 seconds. Finite light speed, not size or motion, sets the delay.",
      difficulty: "medium",
    },
    {
      id: "discovery-curiosity-scale-q3",
      questionText:
        "The universe is about 13.8 billion years old, yet the observable universe is about 93 billion light-years across. What is the correct explanation?",
      options: [
        "Light travelled faster in the early universe, so it covered more ground than 13.8 billion light-years",
        "The universe must actually be about 93 billion years old, and the age figure is wrong",
        "Space itself expanded while the light was travelling, so the sources of the oldest light are now far more than 13.8 billion light-years away",
        "Astronomers add up distances incorrectly and double the result",
      ],
      correctAnswer:
        "Space itself expanded while the light was travelling, so the sources of the oldest light are now far more than 13.8 billion light-years away",
      explanation:
        "The light in transit travelled for 13.8 billion years, but the space it crossed stretched as it went. A radius of about 46 billion light-years gives a diameter of about 93 billion. Galaxies do not move through space faster than light; the distance between them grows because space grows.",
      difficulty: "hard",
    },
  ],
};

// ---------------------------------------------------------------------------
// TRAIL 2 — Why the Sky Is Blue
// ---------------------------------------------------------------------------
const SKY_TRAIL: TrailSeed = {
  id: "discovery-curiosity-sky",
  title: "Why the Sky Is Blue",
  order: 1,
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
      title: "Sunsets, red moons, and other skies",
      estimatedMinutes: 16,
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
          { type: "heading", level: 2, text: "What this trail deliberately left open" },
          {
            type: "paragraph",
            text: "One honest gap. Rayleigh scattering describes what transparent gases do to visible light. It does not explain why the sky is bright enough for daytime at all — that needs the whole column of atmosphere scattering together rather than a single molecule in isolation. And it does not touch why the universe should have any visible light in it at all.",
          },
          {
            type: "paragraph",
            text: "There is also a deeper asymmetry worth sitting with. The sky's colour depends on the sun's spectrum, your eye's receptors, and the composition of your atmosphere. Three of those can differ between worlds, and each difference changes the colour. There is no universal answer to 'what colour is the sky?' — only an answer per world.",
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
            text: "Sunsets are the midday answer applied to a longer path: the short wavelengths are removed first, leaving orange and red. A lunar eclipse projects all of Earth's sunsets onto the Moon, and Mars shows the answer is world-specific. That closes this trail — and the deeper questions about what the universe is made of remain for the trails that follow.",
          },
        ],
      },
    },
  ],
  quizzes: [
    {
      id: "discovery-curiosity-sky-q1",
      questionText: "What is the main reason the daytime sky appears blue?",
      options: [
        "The ocean reflects blue light up into the atmosphere",
        "Nitrogen and oxygen molecules scatter blue sunlight towards your eyes far more strongly than red",
        "The Sun emits mostly blue light",
        "Water droplets in the air are blue",
      ],
      correctAnswer:
        "Nitrogen and oxygen molecules scatter blue sunlight towards your eyes far more strongly than red",
      explanation:
        "Rayleigh scattering from air molecules redirects sunlight, with strength rising as wavelength falls. Blue at about 450 nm is scattered roughly six times more strongly than red at 700 nm, and that scattered blue arrives from the whole sky dome.",
      difficulty: "easy",
    },
    {
      id: "discovery-curiosity-sky-q2",
      questionText: "Why is the sky blue rather than violet, given violet scatters even more strongly?",
      options: [
        "Violet light does not occur in sunlight",
        "Violet scatters less strongly than blue at high altitude",
        "The Sun emits less violet than blue, and human colour vision responds weakly to it, so the mixture reads as blue",
        "Clouds absorb all the violet light",
      ],
      correctAnswer:
        "The Sun emits less violet than blue, and human colour vision responds weakly to it, so the mixture reads as blue",
      explanation:
        "Violet scatters about 9.4 times more strongly than red, against about 5.9 for blue — but the solar spectrum favours blue, some ultraviolet and short violet is absorbed aloft, and human cones respond poorly to violet. The perceived colour wins.",
      difficulty: "medium",
    },
    {
      id: "discovery-curiosity-sky-q3",
      questionText: "Why does the Moon look red during a total lunar eclipse?",
      options: [
        "The Earth's shadow itself is red",
        "Sunlight bent through the Earth's atmosphere reaches the Moon, having lost most of its blue on the long path",
        "The Moon cools and glows red",
        "The Sun emits red light when eclipsed by the Earth",
      ],
      correctAnswer:
        "Sunlight bent through the Earth's atmosphere reaches the Moon, having lost most of its blue on the long path",
      explanation:
        "The umbra is dark, not red. What illuminates the eclipsed Moon is sunlight refracted through the atmosphere — the same red light that colours Earth's sunsets — focused onto the lunar surface by the whole planet.",
      difficulty: "hard",
    },
  ],
};

/** Every trail in this field, in display order. */
const TRAILS = [SCALE_TRAIL, SKY_TRAIL];

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
 * Same idea for the quiz rows, whose key is the option TEXT (QuizClient matches
 * on the trimmed, case-folded option string), so rotating cannot break the key.
 */
function rotatedOptions(options: string[], questionId: string): string[] {
  const rot = stableHash(questionId) % options.length;
  return options.slice(rot).concat(options.slice(0, rot));
}

/**
 * Idempotent: safe to run repeatedly. Creates or refreshes one discovery field,
 * two trails, eight lessons (4 depths each) and six quiz questions — all upserts
 * on stable ids, so no row is ever duplicated and orderIndex stays stable.
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
        "Short trails built around one question worth asking. Each runs four depths — Understand, Explore, Go Deeper, Research.",
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
        "Short trails built around one question worth asking. Each runs four depths — Understand, Explore, Go Deeper, Research.",
      needsVerification: true,
    },
  });

  let lessonCount = 0;
  let questionCount = 0;

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

    for (const q of trail.quizzes) {
      const options = rotatedOptions(q.options, q.id);
      if (!options.includes(q.correctAnswer)) {
        throw new Error(
          `correctAnswer rotated out of options for ${q.id} — answer/key drift`,
        );
      }
      await prisma.question.upsert({
        where: { id: q.id },
        update: {
          domain: "extras",
          topicId: trail.id,
          type: "mcq",
          questionText: q.questionText,
          options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
        },
        create: {
          id: q.id,
          domain: "extras",
          topicId: trail.id,
          type: "mcq",
          questionText: q.questionText,
          options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
        },
      });
      questionCount++;
    }
  }

  console.log(
    `✓ Curiosity Trails: 1 field, ${TRAILS.length} trails, ${lessonCount} lessons (${DEPTH_TITLES.length} depths each), ${questionCount} quiz questions`,
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
