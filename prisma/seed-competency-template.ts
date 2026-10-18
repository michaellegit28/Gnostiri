import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Competency transcript template — MBBS programme.
 *
 * The competency lines that would appear on a graduate's transcript, aligned
 * with the MDCN (Medical and Dental Council of Nigeria) expectation that a
 * graduate can demonstrate core clinical competencies before internship. The
 * ten lines span the domains MDCN assesses: patient assessment, clinical
 * skills, communication, professionalism, and safe practice.
 *
 * This seeds a TEMPLATE — a programme-level transcript holding the competency
 * framework itself, keyed to a stable id so individual learner transcripts
 * (built by buildTranscript in src/lib/assessment.ts) can reference the same
 * codes. Every line is reviewStatus needs-human-review: a medical educator
 * must confirm the wording and the MDCN mapping before this represents a
 * graduate's record.
 *
 * Idempotent: upserts on the transcript title + programme, and on competency
 * code within the transcript. Re-running updates content in place and never
 * duplicates rows.
 */

const PROGRAMME_SLUG = "medicine-surgery-mbbs";
const TRANSCRIPT_TITLE = "MBBS Competency Framework (MDCN-aligned)";

interface CompetencySeed {
  code: string;
  title: string;
  level: "developing" | "proficient" | "mastery";
  evidence: string;
}

const COMPETENCIES: CompetencySeed[] = [
  {
    code: "C1.1",
    title: "Takes a structured patient history",
    level: "proficient",
    evidence: "Demonstrated across the introductory clinical contact strand; can elicit presenting complaint, history of presenting complaint, systems review, past medical, drug and family history, and synthesise the findings into a clinical narrative.",
  },
  {
    code: "C1.2",
    title: "Performs a competent general and systems examination",
    level: "proficient",
    evidence: "Completed the physical examination OSCE strand covering cardiovascular, respiratory, abdominal and neurological examination with the expected sequence and correct technique for each system.",
  },
  {
    code: "C2.1",
    title: "Performs cardiopulmonary resuscitation to the standard of the current ALS algorithm",
    level: "mastery",
    evidence: "Certified in basic life support and completed the advanced life support simulation, demonstrating correct chest compression technique, airway management, reversible-cause recognition and team leadership in a simulated arrest.",
  },
  {
    code: "C2.2",
    title: "Performs core practical clinical procedures",
    level: "proficient",
    evidence: "Signed off on venepuncture, peripheral cannulation, urinary catheterisation, and basic suturing in the skills laboratory, with each procedure completed to the checklist standard on at least one occasion.",
  },
  {
    code: "C3.1",
    title: "Communicates clinical information clearly to patients and colleagues",
    level: "proficient",
    evidence: "Assessed in the communication OSCE; can explain a diagnosis and its management in plain language, break bad news appropriately, and hand over a patient using a structured framework such as SBAR.",
  },
  {
    code: "C3.2",
    title: "Obtains valid, informed consent",
    level: "proficient",
    evidence: "Can explain a common procedure's indications, risks, alternatives and expected outcome, and can confirm that a patient's consent is informed, voluntary and capacitous, including where capacity is in question.",
  },
  {
    code: "C4.1",
    title: "Applies the principles of medical ethics and confidentiality in practice",
    level: "proficient",
    evidence: "Demonstrated across the ethics and law strand; can reason through a confidentiality conflict, recognise the limits of disclosure, and apply the four-principles framework to a clinical dilemma.",
  },
  {
    code: "C4.2",
    title: "Behaves with professional accountability and recognises the limits of competence",
    level: "proficient",
    evidence: "Faculty report and reflective portfolio show punctuality, appropriate conduct, and a documented pattern of escalating to senior colleagues where a presentation falls outside current competence.",
  },
  {
    code: "C5.1",
    title: "Prescribes and administers medicines safely",
    level: "proficient",
    evidence: "Passed the prescribing assessment; can calculate drug doses including weight-based and renal-function-adjusted doses, check for allergy and interaction, and complete a prescription chart legibly and correctly.",
  },
  {
    code: "C5.2",
    title: "Recognises and responds to the acutely deteriorating patient",
    level: "proficient",
    evidence: "Completed the acute-illness simulation strand; can apply a track-and-trigger early-warning system, escalate in a timely manner, and initiate the first responses to sepsis, hypovolaemia and a falling GCS.",
  },
];

/**
 * Idempotent: safe to run repeatedly. Seeds the programme-level competency
 * framework as a template transcript.
 */
export async function seedCompetencyTemplate(): Promise<void> {
  const programme = await prisma.programme.findUnique({
    where: { slug: PROGRAMME_SLUG },
    select: { id: true, name: true, degreeAwarded: true },
  });
  if (!programme) throw new Error(`Programme ${PROGRAMME_SLUG} not found. Run prisma/seed-university.ts first.`);

  // A template transcript is keyed to the programme, not a learner. The
  // userId is required by the schema, so it carries the programme id — a
  // sentinel that is stable and can never collide with a real User row.
  const templateUserId = `template:${programme.id}`;

  const existing = await prisma.competencyTranscript.findUnique({
    where: { userId_programmeId: { userId: templateUserId, programmeId: programme.id } },
    select: { id: true },
  });

  const summary = {
    type: "template",
    programme: programme.name,
    degree: programme.degreeAwarded,
    framework: "MDCN graduate competencies",
    domains: 5,
    lines: COMPETENCIES.length,
    levels: {
      mastery: COMPETENCIES.filter((c) => c.level === "mastery").length,
      proficient: COMPETENCIES.filter((c) => c.level === "proficient").length,
      developing: COMPETENCIES.filter((c) => c.level === "developing").length,
    },
    reviewStatus: "needs-human-review",
    note: "Framework wording and MDCN mapping require medical educator sign-off before use on a graduate record.",
  };

  const transcript = existing
    ? await prisma.competencyTranscript.update({
        where: { id: existing.id },
        data: {
          title: TRANSCRIPT_TITLE,
          summary,
          lines: {
            deleteMany: {},
            create: COMPETENCIES.map((c) => ({
              code: c.code,
              title: c.title,
              level: c.level,
              evidence: c.evidence,
              awardedAt: new Date(),
            })),
          },
        },
      })
    : await prisma.competencyTranscript.create({
        data: {
          userId: templateUserId,
          programmeId: programme.id,
          title: TRANSCRIPT_TITLE,
          summary,
          lines: {
            create: COMPETENCIES.map((c) => ({
              code: c.code,
              title: c.title,
              level: c.level,
              evidence: c.evidence,
              awardedAt: new Date(),
            })),
          },
        },
      });

  console.log(`✓ MBBS competency template: ${COMPETENCIES.length} lines on transcript ${transcript.id} (${summary.levels.mastery} mastery, ${summary.levels.proficient} proficient)`);
}

// CLI usage: npx ts-node prisma/seed-competency-template.ts
if (process.argv[1] && process.argv[1].includes("seed-competency-template")) {
  seedCompetencyTemplate()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
