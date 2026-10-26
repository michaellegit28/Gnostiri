/**
 * Study-content crosswalk — JAMB topic tree → master curriculum library.
 *
 * High school study notes live on the master-* curriculum topics (67 Lesson
 * rows); the JAMB bank resolves study pages through its own {code}-* topic
 * tree, which carries no Lesson rows. This crosswalk lets a JAMB study page
 * show the authored note for the matching master topic instead of an empty
 * state. Keys are JAMB topic ids, values are master topic ids.
 *
 * Not every JAMB topic has a master counterpart (topics unique to the JAMB
 * syllabus map to nothing and keep the honest empty state).
 */

const JAMB_TO_MASTER: Record<string, string> = {
  // Biology
  "jamb-biology-cell-structure": "master-cell-biology",
  "jamb-biology-ecology": "master-ecology-evolution",
  "jamb-biology-genetics-and-heredity": "master-genetics-molecular-biology",
  "jamb-biology-human-physiology": "master-human-physiology",
  "jamb-biology-plant-biology": "master-plant-biology",
  "jamb-biology-respiration": "master-bioenergetics-biochemistry",
  // Chemistry
  "jamb-chemistry-atomic-structure": "master-atomic-structure-periodic-table",
  "jamb-chemistry-chemical-bonding": "master-chemical-bonding",
  "jamb-chemistry-organic-chemistry": "master-organic-chemistry",
  "jamb-chemistry-stoichiometry": "master-stoichiometry-mole",
  "jamb-chemistry-thermodynamics-and-kinetics": "master-thermodynamics-kinetics",
  "jamb-chemistry-electrochemistry": "master-electrochemistry",
  // Physics
  "jamb-physics-electric-circuits": "master-electricity-magnetism",
  "jamb-physics-fields-and-further-mechanics": "master-further-mechanics-fields",
  "jamb-physics-motion-and-kinematics": "master-mechanics",
  "jamb-physics-nuclear-and-quantum-physics": "master-nuclear-quantum-physics",
  "jamb-physics-thermodynamics": "master-thermodynamics",
  "jamb-physics-waves-and-sound": "master-waves-optics",
  // Mathematics
  "jamb-mathematics-calculus": "master-calculus",
  "jamb-mathematics-further-mathematics": "master-further-mathematics",
  "jamb-mathematics-linear-equations": "master-algebra-foundations",
  "jamb-mathematics-probability-and-statistics": "master-statistics-probability",
  "jamb-mathematics-trigonometry": "master-geometry-trigonometry",
  // English
  "jamb-english-comprehension-and-summary": "master-reading-comprehension",
  "jamb-english-continuous-writing": "master-continuous-writing",
  "jamb-english-grammar-and-parts-of-speech": "master-grammar-foundations",
  "jamb-english-oral-english": "master-oral-english",
  "jamb-english-punctuation-and-mechanics": "master-punctuation-mechanics",
  "jamb-english-vocabulary-and-synonyms": "master-lexis-structure",
  // Arts & commerce
  "jamb-commerce-full-syllabus": "master-commerce",
  "jamb-economics-macroeconomics": "master-macroeconomics",
  "jamb-economics-microeconomics": "master-microeconomics",
  "jamb-geography-full-syllabus": "master-geography",
  "jamb-government-full-syllabus": "master-political-science-government",
  // Whole-syllabus subjects
  "jamb-accounting-full-syllabus": "master-accounting",
  "jamb-agriculture-full-syllabus": "master-agriculture",
};

/** The master topic that carries the authored study note for a JAMB topic. */
export function masterTopicFor(jambTopicId: string): string | null {
  return JAMB_TO_MASTER[jambTopicId] ?? null;
}
