#!/usr/bin/env node
/**
 * integrate-banks.mjs — canonical JAMB bank integration (v2).
 *
 * Seeds the 12 flat JAMB banks from content/questions/ into the questions
 * table AND places every question into the app's jamb-* topic hierarchy
 * (the constructed-id convention the highschool pages require:
 * jamb -> jamb-{subject} -> jamb-{subject}-{topic}).
 *
 * Mapping policy:
 *  - bank topicSlug -> the EXISTING jamb child when the concept matches
 *    (e.g. algebra-foundations -> jamb-mathematics-linear-equations);
 *  - otherwise a NEW child is created (id == slug) under jamb-{subject};
 *  - monolithic subjects (one bank slug for all 500) get a single
 *    jamb-{subject}-full-syllabus child.
 *
 * The dual-version fields (coreId / variant / provenance / track) stay in the
 * JSON source of truth: the Question table has no columns for them. Version B
 * (all global tracks, incl. JAMB) is what ships here; Version A (official
 * ZA/TZ) arrives with the transcription queue and its own integration.
 *
 * Idempotent: stable question ids are inserted with skipDuplicates; topic
 * placement is enforced with UPDATE ... WHERE id IN (...) AND topicId <> target.
 *
 * Usage: DATABASE_URL=... node tools/pq/integrate-banks.mjs [--dry-run]
 */

import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const ROOT = new URL("../../", import.meta.url).pathname;
const Q = (p) => (p.startsWith("/") ? p : `${ROOT}${p}`);

const SUBJECTS = [
  "mathematics", "english", "physics", "chemistry", "biology",
  "economics", "government", "commerce", "accounting", "geography",
  "agricultural-science", "literature-in-english",
];

const SUBJECT_TITLE = {
  mathematics: "Mathematics", english: "English", physics: "Physics", chemistry: "Chemistry",
  biology: "Biology", economics: "Economics", accounting: "Accounting", commerce: "Commerce",
  geography: "Geography", government: "Government",
  "agricultural-science": "Agricultural Science",
  "literature-in-english": "Literature in English",
};

/** bank topicSlug -> jamb child topic id (created if missing; id == slug) */
const MAP = {
  mathematics: { "algebra-foundations": "jamb-mathematics-linear-equations", "geometry-trigonometry": "jamb-mathematics-trigonometry", "statistics-probability": "jamb-mathematics-probability-and-statistics", "calculus": "jamb-mathematics-calculus", "further-mathematics": "jamb-mathematics-further-mathematics" },
  english: { "oral-english": "jamb-english-oral-english", "reading-comprehension": "jamb-english-comprehension-and-summary", "summary-writing": "jamb-english-comprehension-and-summary", "lexis-structure": "jamb-english-vocabulary-and-synonyms", "grammar-foundations": "jamb-english-grammar-and-parts-of-speech", "concord": "jamb-english-grammar-and-parts-of-speech", "tenses-and-aspect": "jamb-english-grammar-and-parts-of-speech", "punctuation-mechanics": "jamb-english-punctuation-and-mechanics", "continuous-writing": "jamb-english-continuous-writing" },
  physics: { "thermodynamics": "jamb-physics-thermodynamics", "waves-optics": "jamb-physics-waves-and-sound", "electricity-magnetism": "jamb-physics-electric-circuits", "mechanics": "jamb-physics-motion-and-kinematics", "nuclear-quantum-physics": "jamb-physics-nuclear-and-quantum-physics", "further-mechanics-fields": "jamb-physics-fields-and-further-mechanics" },
  chemistry: { "stoichiometry-mole": "jamb-chemistry-stoichiometry", "acids-bases-salts": "jamb-chemistry-acids-bases-and-salts", "chemical-bonding": "jamb-chemistry-chemical-bonding", "organic-chemistry": "jamb-chemistry-organic-chemistry", "atomic-structure-periodic-table": "jamb-chemistry-atomic-structure", "atomic-structure": "jamb-chemistry-atomic-structure", "periodicity": "jamb-chemistry-atomic-structure", "thermodynamics-kinetics": "jamb-chemistry-thermodynamics-and-kinetics", "electrochemistry": "jamb-chemistry-electrochemistry" },
  biology: { "cell-biology": "jamb-biology-cell-structure", "genetics-molecular-biology": "jamb-biology-genetics-and-heredity", "ecology-evolution": "jamb-biology-ecology", "bioenergetics-biochemistry": "jamb-biology-respiration", "human-physiology": "jamb-biology-human-physiology", "plant-biology": "jamb-biology-plant-biology" },
  economics: { "microeconomics": "jamb-economics-microeconomics", "macroeconomics": "jamb-economics-macroeconomics" },
  accounting: { "accounting": "jamb-accounting-full-syllabus" },
  "agricultural-science": { "agriculture": "jamb-agriculture-full-syllabus" },
  commerce: { "commerce": "jamb-commerce-full-syllabus" },
  geography: { "geography": "jamb-geography-full-syllabus" },
  government: { "political-science-government": "jamb-government-full-syllabus" },
  "literature-in-english": { "literature-in-english": "jamb-literature-in-english-full-syllabus" },
};

const CHILD_TITLE = {
  "jamb-mathematics-calculus": "Calculus",
  "jamb-mathematics-further-mathematics": "Further Mathematics",
  "jamb-english-punctuation-and-mechanics": "Punctuation and Mechanics",
  "jamb-english-continuous-writing": "Continuous Writing",
  "jamb-physics-nuclear-and-quantum-physics": "Nuclear and Quantum Physics",
  "jamb-physics-fields-and-further-mechanics": "Fields and Further Mechanics",
  "jamb-chemistry-thermodynamics-and-kinetics": "Thermodynamics and Kinetics",
  "jamb-chemistry-electrochemistry": "Electrochemistry",
  "jamb-biology-human-physiology": "Human Physiology",
  "jamb-biology-plant-biology": "Plant Biology",
  "jamb-economics-microeconomics": "Microeconomics",
  "jamb-economics-macroeconomics": "Macroeconomics",
  "jamb-accounting-full-syllabus": "Full syllabus practice",
  "jamb-agriculture-full-syllabus": "Full syllabus practice",
  "jamb-commerce-full-syllabus": "Full syllabus practice",
  "jamb-geography-full-syllabus": "Full syllabus practice",
  "jamb-government-full-syllabus": "Full syllabus practice",
  "jamb-literature-in-english-full-syllabus": "Full syllabus practice",
};

const safe = (s) => { if (!/^[A-Za-z0-9._-]+$/.test(s)) throw new Error(`unsafe id: ${s}`); return s; };
const lit = (s) => `'${safe(s)}'`;

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

async function ensureTopic(id, title, parentId, orderIndex) {
  if (dryRun) return;
  const rows = await prisma.$queryRawUnsafe(`SELECT id FROM "Topic" WHERE id = ${lit(id)}`);
  if (rows.length) return;
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Topic" (id, slug, title, domain, "parentId", "orderIndex", "isPublished", "needsVerification")
     VALUES (${lit(id)}, ${lit(id)}, '${title.replace(/'/g, "''")}', 'highschool', ${lit(parentId)}, ${orderIndex}, true, true)
     ON CONFLICT (id) DO NOTHING`
  );
  console.log(`  created topic ${id}`);
}

async function run() {
  let grandInserted = 0;

  for (const subject of SUBJECTS) {
    const bank = JSON.parse(readFileSync(Q(`content/questions/${subject}.json`), "utf8"));
    if (!Array.isArray(bank)) throw new Error(`${subject}.json is not an array`);
    for (const row of bank) {
      if (!row.id || !row.questionText || !row.correctAnswer) throw new Error(`${subject}: malformed row`);
    }

    // 1. seed the rows (stable ids; skipDuplicates keeps re-runs safe)
    let inserted = 0;
    if (!dryRun) {
      const res = await prisma.question.createMany({
        data: bank.map((q) => ({
          id: q.id,
          domain: "highschool",
          topicId: MAP[subject][q.topicSlug] ?? `jamb-${subject}-full-syllabus`,
          type: q.type || "mcq",
          questionText: q.questionText,
          options: q.options,
          correctAnswer: String(q.correctAnswer),
          explanation: q.explanation ?? null,
          difficulty: q.difficulty || "medium",
          sourceExam: q.sourceExam ?? null,
        })),
        skipDuplicates: true,
      });
      inserted = res.count;
    } else {
      inserted = bank.length;
    }

    // 2. ensure the jamb hierarchy exists and every row sits in it
    if (!dryRun) {
      await ensureTopic(`jamb-${subject}`, SUBJECT_TITLE[subject], "jamb", 10);
      let childOrder = 0;
      for (const topicId of new Set(Object.values(MAP[subject]))) {
        await ensureTopic(topicId, CHILD_TITLE[topicId] ?? topicId, `jamb-${subject}`, childOrder++);
      }
      const bySlug = {};
      for (const q of bank) (bySlug[q.topicSlug] ??= []).push(q.id);
      for (const [bankSlug, topicId] of Object.entries(MAP[subject])) {
        const ids = bySlug[bankSlug] || [];
        for (let i = 0; i < ids.length; i += 100) {
          const chunk = ids.slice(i, i + 100).map(safe);
          await prisma.$executeRawUnsafe(
            `UPDATE "Question" SET "topicId" = ${lit(topicId)} WHERE id IN (${chunk.map(lit).join(",")}) AND "topicId" <> ${lit(topicId)}`
          );
        }
      }
    }

    console.log(`${subject.padEnd(22)} bank=${bank.length} inserted=${inserted}`);
    grandInserted += inserted;
  }

  console.log(`TOTAL inserted=${grandInserted}`);
  if (prisma) await prisma.$disconnect();
}

run().catch((e) => { console.error(e.message || e); process.exit(1); });
