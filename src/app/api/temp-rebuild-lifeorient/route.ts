import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — PE & Health Topic 3: Life Orientation at the no-exceptions bar:
// self-concept and goals, study and decision skills, relationships and peer pressure,
// rights and responsibilities, citizenship and democracy, careers, environment.

const LO_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Self-concept and self-esteem — who you think you are" },
  { type: "definition", term: "Self-concept", text: "The picture you hold of yourself — built from ability beliefs, appearance, roles, and above all FEEDBACK from significant people. SELF-ESTEEM is its emotional weight: how much you VALUE that picture. Healthy self-esteem is realistic (knows strengths AND weaknesses) and stable (not hostage to every comment). The trap: high self-esteem built only on praise collapses on first failure — build it on EVIDENCE of effort and growth, not on applause alone." },
  { type: "example", text: "Worked: a learner told 'you're just not a maths person' builds a fixed self-concept; one told 'your method needs work — here's the next step' builds a growth view. The feedback cycle shapes the self — and the self shapes what is attempted. Name the belief, then its effect on behaviour: that chain is the mark." },
  { type: "heading", level: 2, text: "2. Goals — SMART, written, and reviewed" },
  { type: "definition", term: "SMART goals", text: "Specific (what exactly), Measurable (how will you know), Achievable (stretch, not fantasy), Relevant (why does it matter to YOU), Time-bound (by when). 'Do better at school' is a wish; 'raise maths average from 55% to 65% by the June exams with two extra problem sets weekly' is a goal — it contains its own plan. Long-term goals are reached through short-term milestones; review dates turn intentions into feedback loops." },
  { type: "example", text: "Worked: the 65%-by-June goal is specific, measurable, achievable (10 points is stretch, not leap), relevant, and time-bound — and it implies the weekly mechanism (two problem sets). 'Turn this wish into a SMART goal' = add the missing dimensions one by one; each named dimension is a mark." },
  { type: "heading", level: 2, text: "3. Study and time management — the operating system of a learner" },
  { type: "table", headers: ["Tool", "What it does", "Discipline"], rows: [["Timetable/planner", "Assigns every hour a job", "Study time is an APPOINTMENT, not a mood"], ["Prioritising", "Urgent vs important", "Important beats urgent — plan it before it screams"], ["Active recall + spaced practice", "Test yourself, revisit over days", "Rereading feels productive; recall produces marks"], ["Chunking", "45-min focused blocks + breaks", "Marathon sessions decay — attention has a duty cycle"], ["Environment control", "Phone away, fixed place", "Willpower loses to design — remove the choice"]] },
  { type: "paragraph", text: "Decision-making framework: identify the DECISION → gather options → weigh consequences of each (short and long term) → choose → ACT → REVIEW the outcome. The review step is where most people skip the learning — every decision, good or bad, is data for the next one." },
  { type: "heading", level: 2, text: "4. Peer pressure and substance refusal — the rehearsed no" },
  { type: "definition", term: "Peer pressure", text: "The push to conform — strongest in adolescence because belonging is a survival need of the age. RESISTANCE STRATEGIES: the firm no (decide BEFORE the situation — rehearsed refusals win under pressure), the broken record (same words, calm repetition), the exit (leave the scene — the strongest move), the ally (bring a like-minded friend), the alternative (offer something else to do), and the assertive challenge ('a real friend wouldn't make me prove anything'). Substance facts: alcohol, tobacco/vaping, and drugs impair the developing brain, addict through tolerance and withdrawal, and cost more than money." },
  { type: "example", text: "Worked: at a party, the joint comes round — the unprepared 'um, maybe' is a yes. The prepared response: 'No thanks' + broken record + physical exit. Refusal is a SKILL: it is rehearsed before it is needed, like a penalty kick. 'How would you refuse?' = a named strategy + the words; the words are the mark." },
  { type: "heading", level: 2, text: "5. Relationships — respect, consent, and the boundaries" },
  { type: "paragraph", text: "Healthy relationships run on RESPECT (each person's boundaries, opinions and autonomy held as valid), equality (decisions shared, control absent), honesty and TRUST. CONSENT: freely given, informed, reversible, specific — and required every time; silence or fear is not consent. Warning signs of unhealthy control: jealousy framed as love, isolation from friends, checking phones, pressure of any kind. Abuse is about POWER, not passion — and reporting it (teacher, counsellor, helpline) is strength, not betrayal." },
  { type: "example", text: "Worked: 'if you loved me you would' is coercion — pressure dressed as proof. The healthy line: 'no' is accepted the first time, without sulking or punishment. 'Identify the unhealthy sign' = the control behaviour named, not the argument topic." },
  { type: "heading", level: 2, text: "6. Rights and responsibilities — the two-sided coin" },
  { type: "definition", term: "Rights and responsibilities", text: "Every RIGHT carries a matching RESPONSIBILITY: the right to education ↔ the responsibility to attend and try; freedom of speech ↔ the responsibility not to defame or incite; the right to a clean environment ↔ the responsibility not to litter or pollute. A constitution grants rights AND bounds them — my rights end where another's begin. 'Claim rights, dodge responsibilities' is not citizenship; it is freeloadery, and the exam marks it accordingly." },
  { type: "example", text: "Worked: learners demand the right to be heard in class meetings — and owe the responsibility to listen when others speak. Pair them: right → responsibility, both stated. The pairing IS the answer." },
  { type: "heading", level: 2, text: "7. Citizenship and democracy — participation is the job" },
  { type: "definition", term: "Democracy", text: "Government BY the people: elections (free, fair, regular), the rule of law (nobody above it — chapter recycled from government), accountability and transparency. Citizenship is ACTIVE, not spectator: vote, know your representatives, hold them accountable (questions, petitions, peaceful protest), serve the community, pay taxes. UBUNTU — 'I am because we are' — the communitarian engine of civic duty: the community made you; serving it is maintenance, not charity. One-line recycled: rule of law ≠ rule BY law." },
  { type: "example", text: "Worked: complaining about a broken clinic gate on social media vs logging the petition, attending the ward meeting, following the response — the second is citizenship as a verb. 'How can citizens participate beyond voting?' = the action list, with the mechanism each works through." },
  { type: "heading", level: 2, text: "8. Careers — subject choices are the first fork" },
  { type: "table", headers: ["Step", "Question", "Tool"], rows: [["Self-assessment", "Interests, strengths, values", "Aptitude tests, honest reflection"], ["Explore", "What does the career actually DO daily?", "Job shadowing, career exhibitions, interviews"], ["Requirements", "Which subjects/grades does the path demand?", "Prospectuses — read them BEFORE choosing subjects"], ["Plan", "Qualification route + fallback", "Written plan with dates"], ["Act", "Applications, experience, skills", "CV, volunteering, part-time work"]] },
  { type: "paragraph", text: "The CV: personal details, education, achievements with evidence, skills, experience, referees — one page, honest, tailored to the application. ENTREPRENEURSHIP as a career path: identify a need → solve it at a price → keep the margin; the same design-thinking loop as any subject — need, solution, evaluation. Careers are designed, not wished into." },
  { type: "heading", level: 2, text: "9. Environment — the one home rule" },
  { type: "paragraph", text: "Responsibility operates at three scales: PERSONAL (save water/power, refuse single-use, don't litter), COMMUNITY (clean-ups, tree planting, reporting dumping), SYSTEMIC (support conservation policy, understand climate basics: greenhouse gases from burning fossil fuels trap heat — the mechanism, not a vibe). The 6Rs recycled from design & technology apply verbatim. The exam pairing: environmental problem → the behaviour that causes it → the behaviour that fixes it. Cause and fix, both named." },
  { type: "heading", level: 2, text: "10. Summary — the life orientation spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Self-concept", "Feedback → belief → behaviour", "Praise-built esteem collapses on failure"], ["Goals", "SMART — all five letters", "'Do better' is a wish, not a goal"], ["Refusal", "Strategy + actual words", "Rehearsed before needed, not improvised"], ["Relationships", "Respect + consent, every time", "Pressure framed as love is still control"], ["Rights", "Pair with the responsibility", "Rights without responsibilities is not citizenship"], ["Democracy", "Participation beyond voting", "Rule of law binds everyone"], ["Careers", "Requirements BEFORE subject choices", "The CV: one page, evidence, honest"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = mechanism (why SMART, why consent matters); 'demonstrate' = the actual words or steps, not a description of them; 'discuss' = both sides, then a reasoned position; 'recommend' = option + reason tied to the scenario. Life orientation papers pay for APPLIED answers — a correct principle aimed at the wrong scenario earns half." },
];

const LO_QS: Q[] = [
  { q: "'Raise my maths average from 55% to 65% by June with two problem sets weekly' is", o: ["a wish", "a SMART goal — all five dimensions present", "a dream", "a timetable"], a: "a SMART goal — all five dimensions present", e: "Specific, measurable, achievable, relevant, time-bound — with the mechanism included.", d: "medium" },
  { q: "Self-esteem built only on praise", o: ["is the strongest kind", "collapses on first failure — build it on evidence of effort and growth", "never changes", "equals self-concept"], a: "collapses on first failure — build it on evidence of effort and growth", e: "Realistic and stable beats applause-dependent.", d: "medium" },
  { q: "The strongest peer-pressure refusal move when pressure continues is", o: ["negotiating a smaller amount", "the exit — leave the scene, with an ally if possible", "saying 'maybe later'", "silence"], a: "the exit — leave the scene, with an ally if possible", e: "Broken record first, exit always available — rehearsed before needed.", d: "medium" },
  { q: "Consent must be", o: ["assumed in relationships", "freely given, informed, reversible, specific — every time", "given once for all time", "obtained by persistence"], a: "freely given, informed, reversible, specific — every time", e: "Silence or fear is not consent; persistence negates it.", d: "medium" },
  { q: "'If you loved me you would...' is", o: ["romantic commitment", "coercion — pressure dressed as proof", "a healthy boundary", "good communication"], a: "coercion — pressure dressed as proof", e: "Control behaviours are the warning signs, whatever the framing.", d: "easy" },
  { q: "The right to education carries the matching responsibility to", o: ["nothing — rights are unconditional", "attend and genuinely try", "pay for school personally", "teach others"], a: "attend and genuinely try", e: "Every right pairs with a responsibility — the coin has two faces.", d: "easy" },
  { q: "Citizenship beyond voting includes", o: ["nothing else is required", "accountability: petitions, questions, peaceful protest, community service", "only paying taxes", "following orders"], a: "accountability: petitions, questions, peaceful protest, community service", e: "Democracy is a verb — participation is the job description.", d: "medium" },
  { q: "The rule of law means", o: ["the powerful are exempt", "nobody is above the law — and it is not rule BY law as a weapon", "majority decides everything", "courts advise the ruler"], a: "nobody is above the law — and it is not rule BY law as a weapon", e: "Recycled from government — the distinction is the trap.", d: "medium" },
  { q: "Choosing subjects should happen", o: ["after matric", "after reading the qualification requirements of the career path", "by popularity", "by what friends choose"], a: "after reading the qualification requirements of the career path", e: "Requirements BEFORE choices — prospectuses first.", d: "easy" },
  { q: "Climate change is driven by", o: ["recycling bins", "greenhouse gases from burning fossil fuels trapping heat", "wind turbines", "cold winters"], a: "greenhouse gases from burning fossil fuels trapping heat", e: "The mechanism, not a mood — cause and fix both nameable.", d: "easy" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "life-orientation" } });
    if (!topic) throw new Error("master life-orientation topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Life Orientation — Complete", content: { blocks: LO_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < LO_QS.length; i++) {
      const item = LO_QS[i];
      await prisma.question.upsert({
        where: { id: `master-lifeorient-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-lifeorient-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "lifeorient-rebuild", blocks: LO_BLOCKS.length, questions: LO_QS.length });
  } catch (e) {
    console.error("rebuild lifeorient failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
