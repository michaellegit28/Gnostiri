#!/usr/bin/env node
/**
 * integrate-banks.mjs — ROUND 2 JAMB bank integration.
 *
 * Loads the 12 flat JAMB banks from content/questions/ and seeds their Version B
 * rows into the questions table, mapping each bank's topicSlug to the Topic row
 * with the same slug (creating missing topic rows first, published +
 * needsVerification: true).
 *
 * Idempotent: bank rows carry stable ids; existing rows are skipped
 * (createMany skipDuplicates), so re-running only inserts new content.
 *
 * The dual-version fields (coreId / variant / provenance / track) stay in the
 * JSON source of truth: the Question table has no columns for them yet. Version
 * B is what every global track (incl. JAMB) serves, so what ships here is
 * exactly what users see. Version A (official ZA/TZ) arrives with the
 * transcription queue and its own integration step.
 *
 * Usage: DATABASE_URL=... node tools/pq/integrate-banks.mjs [--dry-run]
 */

import { readdirSync, readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const ROOT = new URL("../../", import.meta.url).pathname;
const Q = (p) => (p.startsWith("/") ? p : `${ROOT}${p}`);

const SUBJECTS = [
  "mathematics", "english", "physics", "chemistry", "biology",
  "economics", "government", "commerce", "accounting", "geography",
  "agricultural-science", "literature-in-english",
];

/** Topic rows to create when a bank references a slug with no Topic row. */
const TOPIC_TITLES = {
  "atomic-structure": "Atomic Structure",
  "periodicity": "Periodicity",
  "acids-bases-salts": "Acids, Bases and Salts",
  "literature-in-english": "Literature in English",
};

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

function bankPath(slug) { return Q(`content/questions/${slug}.json`); }

async function ensureTopic(slug) {
  const existing = await prisma.topic.findUnique({ where: { slug }, select: { id: true } });
  if (existing) return existing.id;
  const title = TOPIC_TITLES[slug];
  if (!title) throw new Error(`no topic row for slug "${slug}" and no title mapping`);
  const created = await prisma.topic.create({
    data: { slug, title, domain: "highschool", isPublished: true, needsVerification: true, orderIndex: 50 },
    select: { id: true },
  });
  console.log(`  created topic ${slug} (${created.id})`);
  return created.id;
}

async function run() {
  let grandInserted = 0;
  let grandSkipped = 0;

  for (const slug of SUBJECTS) {
    const text = readFileSync(bankPath(slug), "utf8");
    const bank = JSON.parse(text);
    if (!Array.isArray(bank)) throw new Error(`${slug}.json is not an array`);

    // Map every question to its Topic id; collect per-topic batches.
    const byTopic = new Map();
    for (const q of bank) {
      if (!q.id || !q.questionText || !q.correctAnswer) {
        throw new Error(`${slug}: malformed row (${JSON.stringify(q).slice(0, 80)})`);
      }
      if (!byTopic.has(q.topicSlug)) byTopic.set(q.topicSlug, []);
      byTopic.get(q.topicSlug).push(q);
    }

    let inserted = 0;
    for (const [topicSlug, rows] of byTopic) {
      const topicId = dryRun ? "DRY" : await ensureTopic(topicSlug);
      if (dryRun) { inserted += rows.length; continue; }
      const res = await prisma.question.createMany({
        data: rows.map((q) => ({
          id: q.id,
          domain: "highschool",
          topicId,
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
      inserted += res.count;
    }

    const skipped = bank.length - inserted;
    console.log(`${slug.padEnd(22)} bank=${bank.length} inserted=${inserted} skipped(existing)=${skipped}`);
    grandInserted += inserted;
    grandSkipped += skipped;
  }

  console.log(`TOTAL inserted=${grandInserted} skipped=${grandSkipped}`);
  if (prisma) await prisma.$disconnect();
}

run().catch((e) => { console.error(e.message || e); process.exit(1); });
