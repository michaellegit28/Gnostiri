import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 3: Sociology at the no-exceptions bar:
// the sociological imagination, culture and socialisation, structure, institutions,
// perspectives, stratification, change, research methods, social problems.

const SOC_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Sociology and the sociological imagination" },
  { type: "definition", term: "Sociological imagination", text: "Sociology is the SCIENTIFIC study of society, social institutions, and social relationships — systematic evidence, not opinion. The sociological IMAGINATION (C. Wright Mills) links personal troubles to PUBLIC issues: one person unemployed is a biography; mass unemployment is an economy. The move from private to public IS the discipline's signature." },
  { type: "example", text: "Worked: a student fails an exam (personal) — but if a whole cohort fails, the question turns to the school system, the curriculum, the funding (public issue). 'Explain with the sociological imagination' = connect the personal case to the social structure; the connection is the mark." },
  { type: "heading", level: 2, text: "2. Culture — norms, values, and the lag" },
  { type: "definition", term: "Culture", text: "Culture is the total way of life of a people: MATERIAL (tools, dress, buildings) and NON-MATERIAL (norms — rules of behaviour; values — shared ideals; beliefs; language). ETHNOCENTRISM judges other cultures by your own (the trap); CULTURAL RELATIVISM judges each culture by ITS OWN standards. Cultural LAG (Ogburn): material culture changes faster than non-material — technology runs ahead of norms." },
  { type: "example", text: "Worked: smartphones (material) spread decades before the etiquette and laws governing them (non-material) caught up — that gap is cultural lag. Ethnocentrism: calling another culture's diet 'wrong'; relativism: asking what it means to THEM. The distinction is the mark." },
  { type: "heading", level: 2, text: "3. Socialisation — how culture is transmitted" },
  { type: "definition", term: "Socialisation", text: "The lifelong process of learning norms and roles: PRIMARY (the family — language, basic norms, identity), SECONDARY (school, peers, media, religion — universalistic standards: rules apply to everyone, not family favours), ANTICIPATORY (rehearsing a future role — the intern before the job). SOCIAL CONTROL keeps it in line: informal (gossip, shame) and formal (police, courts)." },
  { type: "example", text: "Worked: the family teaches a child to speak and to trust (primary); school then grades them by universal standards — the same rules for every child (secondary). The shift from particularistic (family) to universalistic (school) standards is the classic exam beat." },
  { type: "heading", level: 2, text: "4. Social structure — status, roles, groups" },
  { type: "table", headers: ["Concept", "Meaning", "Example"], rows: [["Ascribed status", "Assigned at birth, not earned", "Sex, ethnicity, royal birth"], ["Achieved status", "Earned by effort or choice", "Graduate, champion, doctor"], ["Role", "The behaviour a status expects", "The doctor role: competence, care"], ["Role conflict", "Two roles' demands clash", "Parent and night-shift worker"], ["Primary group", "Small, intimate, lasting (family)", "Face-to-face, emotional bonds"], ["Secondary group", "Large, formal, goal-based (firm)", "Impersonal, contractual"]] },
  { type: "example", text: "Worked: royal birth is ascribed (nothing earned); a medical licence is achieved (years earned it). Role conflict: the night-shift nurse who is also a single parent — the two roles fight for the same hours. Name the STATUS type and the CLASH — the pairing is the mark." },
  { type: "heading", level: 2, text: "5. Social institutions — the answers to universal needs" },
  { type: "paragraph", text: "Institutions are stable structures answering universal needs: the FAMILY (reproduction, socialisation, care), RELIGION (meaning, cohesion, moral order), EDUCATION (skills AND sorting), the ECONOMY (production, distribution), the POLITY (order, authority). Functionalism reads them as interconnected — change one and the others adjust. The exam wants the FUNCTION of each institution, never just its name." },
  { type: "heading", level: 2, text: "6. Theoretical perspectives — four lenses on one society" },
  { type: "table", headers: ["Perspective", "Society is...", "Key names", "Reads education as..."], rows: [["Functionalism", "A system of interdependent parts serving needs", "Durkheim, Parsons", "Skill + sorting into roles"], ["Conflict theory", "Arena of inequality and power struggle", "Marx", "Reproducing class advantage"], ["Symbolic interactionism", "Meanings built in everyday interaction", "Mead, Blumer", "Labelling in the classroom"], ["Feminism", "Structured by gender inequality", "—", "Gendered subject choices"]] },
  { type: "example", text: "Worked: the same school is a sorting machine (functionalism), a class-reproduction machine (conflict), a labelling site (interactionism), a gendered pathway (feminism). 'Which perspective views religion as promoting cohesion?' — Durkheim's functionalism. Match the CLAIM to the LENS; the lens named is the mark." },
  { type: "heading", level: 2, text: "7. Stratification and mobility — the ranking of people" },
  { type: "definition", term: "Social stratification", text: "The ranking of people into layers with unequal rewards. CASTE: hereditary, CLOSED — birth fixes the layer, marriage within it, no exit. CLASS: economic, OPEN — wealth, education and occupation can move you. Mobility: VERTICAL (up or down the layers) vs HORIZONTAL (same level, different position); INTER-generational (between parent and child) vs INTRA-generational (within one life)." },
  { type: "example", text: "Worked: caste systems trap status at birth (closed); class systems let education move a child past their parents (inter-generational mobility). 'Why is class described as open?' — the mobility is the test; the closed caste is the contrast." },
  { type: "heading", level: 2, text: "8. Social change — causes and resistance" },
  { type: "paragraph", text: "Change is driven by TECHNOLOGY (new tools, new norms — cultural lag), POPULATION movement, the ENVIRONMENT, and IDEAS (Weber: the Protestant ethic and the spirit of capitalism — ideas can drive economics, not only the reverse). Change meets RESISTANCE (vested interests, tradition) and arrives unevenly. The exam wants the CAUSE named and the MECHANISM traced, not a slogan." },
  { type: "heading", level: 2, text: "9. Research methods — the evidence machine" },
  { type: "table", headers: ["Method", "Strength", "Weakness"], rows: [["Survey / questionnaire", "Breadth — many respondents, cheap", "Shallow answers; low response rates"], ["Interview", "Depth — reasons and meanings", "Small numbers; interviewer bias"], ["Observation (participant / non)", "Behaviour in its natural setting", "Time-consuming; observer effect"], ["Experiment", "Causality — control of variables", "Artificial; ethics limit it"], ["Secondary data", "Cheap, large-scale", "Collected for another question — may not fit"]] },
  { type: "paragraph", text: "Two quality tests: RELIABILITY (repeatable — same result again) and VALIDITY (measures what it CLAIMS to measure — the deeper test). Ethics: informed consent, confidentiality, protection from harm, no deception without justification. 'A study that repeats with the same result is' — reliable; 'that measures what it claims' — valid. The distinction is the mark." },
  { type: "heading", level: 2, text: "10. Social problems — crime, poverty, urbanisation" },
  { type: "paragraph", text: "CRIME: functionalism reads punishment as boundary maintenance (the rule reaffirmed when broken); conflict theory reads crime statistics as the powerful defining deviance. POVERTY: relative vs absolute; culture-of-poverty vs structural explanations — the exam wants the STRUCTURAL case (jobs, housing, schooling), not blame. URBANISATION: crowding, housing pressure, anomie (Durkheim: normlessness in the crowd)." },
  { type: "heading", level: 2, text: "11. Summary — the sociology spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Imagination", "Personal trouble → public issue", "Not psychology — the structure, not the self"], ["Culture", "Norms + values + beliefs, listed", "Ethnocentrism ≠ relativism"], ["Socialisation", "Primary (family) → secondary (school)", "Particularistic → universalistic standards"], ["Status", "Ascribed vs achieved", "Role conflict: two roles, one person"], ["Perspectives", "Match the claim to the lens", "Durkheim = cohesion; Marx = conflict"], ["Stratification", "Caste closed, class open", "Mobility is the test"], ["Methods", "Reliability = repeatable; validity = measures the claim", "Correlation is not causation"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = mechanism, not description; 'assess' = verdict + weighing; 'with reference to' = the named theorist or study, used; 'distinguish' = both items, difference on each line. Sociology papers pay for the LENS and the EVIDENCE — opinion without a theorist earns half." },
];

const SOC_QS: Q[] = [
  { q: "The sociological imagination connects", o: ["personal troubles to public issues", "psychology to biology", "the past to the future", "norms to laws"], a: "personal troubles to public issues", e: "One biography vs mass unemployment — the structural link.", d: "medium" },
  { q: "The agent of PRIMARY socialisation is usually", o: ["the school", "the family", "the media", "the workplace"], a: "the family", e: "Language, identity, basic norms — then school's universal standards.", d: "easy" },
  { q: "Royal birth is an example of", o: ["achieved status", "ascribed status", "role conflict", "a reference group"], a: "ascribed status", e: "Assigned at birth, not earned.", d: "easy" },
  { q: "Which perspective sees religion as promoting social cohesion?", o: ["conflict theory", "functionalism — Durkheim", "symbolic interactionism", "feminism"], a: "functionalism — Durkheim", e: "Match the claim to the lens: cohesion is the functionalist beat.", d: "medium" },
  { q: "A caste system differs from a class system because caste is", o: ["open and economic", "closed and hereditary — no exit by effort", "based on wealth alone", "modern"], a: "closed and hereditary — no exit by effort", e: "Class is open: education and wealth can move you.", d: "medium" },
  { q: "A study that produces the same result when repeated is", o: ["valid", "reliable", "biased", "ethical"], a: "reliable", e: "Reliability = repeatable; validity = measures what it claims.", d: "medium" },
  { q: "Cultural lag occurs when", o: ["norms change faster than technology", "material culture changes faster than non-material", "two roles clash", "cultures borrow freely"], a: "material culture changes faster than non-material", e: "Technology runs ahead of etiquette and law — Ogburn.", d: "medium" },
  { q: "A parent who is also a night-shift worker experiences", o: ["status inconsistency", "role conflict", "anomie", "cultural lag"], a: "role conflict", e: "Two roles' demands fight for the same hours.", d: "medium" },
  { q: "A study that measures what it claims to measure is", o: ["reliable", "valid", "representative", "random"], a: "valid", e: "Validity is the deeper test — the claim, not the repetition.", d: "hard" },
  { q: "Conflict theory reads crime statistics as", o: ["objective counts of evil", "the powerful defining what counts as deviance", "boundary maintenance", "random noise"], a: "the powerful defining what counts as deviance", e: "Whose rules get enforced is the conflict lens's question.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "sociology" } });
    if (!topic) throw new Error("master sociology topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Sociology — Complete", content: { blocks: SOC_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < SOC_QS.length; i++) {
      const item = SOC_QS[i];
      await prisma.question.upsert({
        where: { id: `master-sociology-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-sociology-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "sociology-rebuild", blocks: SOC_BLOCKS.length, questions: SOC_QS.length });
  } catch (e) {
    console.error("rebuild sociology failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
