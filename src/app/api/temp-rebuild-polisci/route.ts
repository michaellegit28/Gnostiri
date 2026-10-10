import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 2: Political Science / Government at the no-exceptions bar:
// the state, forms of government, separation of powers, rule of law, constitutions, federalism,
// elections, parties, civil service, public opinion.

const POL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The state and sovereignty" },
  { type: "definition", term: "The state", text: "A state has FOUR features: a permanent POPULATION, a defined TERRITORY, a GOVERNMENT, and SOVEREIGNTY — the supreme legal authority, both INTERNAL (highest power over everyone within the territory) and EXTERNAL (independence: no other state commands it). A NATION is a people bound by identity — several nations can share one state, and one nation can be split across states." },
  { type: "example", text: "Worked: a government is the ADMINISTRATION of the moment (it changes at elections); the state is the PERMANENT legal entity (it persists). Nigeria has many nations within one state. 'Distinguish state from government' is the set piece: permanence is the difference." },
  { type: "heading", level: 2, text: "2. Forms of government" },
  { type: "table", headers: ["Form", "Power held by", "Key feature"], rows: [["Democracy", "The people (direct) or their representatives", "Periodic free elections — accountability"], ["Monarchy", "A hereditary monarch", "Absolute: rules; constitutional: reigns but does not rule"], ["Oligarchy", "A small elite group", "Power by wealth, family or rank"], ["Military", "The armed forces", "Rules by decree — suspends the constitution"], ["Theocracy", "Religious authority", "Law and faith merged"]] },
  { type: "paragraph", text: "The exam wants the FORM matched to the FEATURE: a constitutional monarchy's king reigns but does not rule (elected ministers govern); a military regime governs by decree, not law. Name the feature, not just the label." },
  { type: "heading", level: 2, text: "3. Separation of powers — the three branches" },
  { type: "definition", term: "Separation of powers", text: "Power is split so no one branch can tyrannise: the LEGISLATURE makes laws, the EXECUTIVE implements and administers, the JUDICIARY interprets and applies the law to cases. Each branch CHECKS the others — checks and balances: veto, impeachment, judicial review, budget approval, confirmation of appointments." },
  { type: "diagram", diagramId: "three-branches", caption: "Legislature makes, executive implements, judiciary interprets — with checks both ways" },
  { type: "example", text: "Worked: the executive vetoes a bill (checks the legislature); the legislature refuses the budget and can impeach (checks the executive); the judiciary strikes down an unconstitutional act (checks both); the executive appoints judges but the legislature confirms them. Name the CHECK and the BRANCH it runs against — that pairing is the mark." },
  { type: "heading", level: 2, text: "4. Rule of law — Dicey's three limbs" },
  { type: "definition", term: "Rule of law", text: "Dicey: (1) SUPREMACY of the law — no one is punished except for a breach of law proven in court; (2) EQUALITY before the law — officials and citizens alike; (3) RIGHTS protected by the courts, not by paper promises. Limits in practice: emergency powers, official immunity, military decrees. Rule of LAW is government bound by law; rule BY law is law as a weapon of the ruler — the trap." },
  { type: "example", text: "Worked: a minister and a citizen commit the same offence — equality before the law means both face the same court. Under rule BY law, the ruler writes decrees against opponents: legality without justice. The distinction is the mark; the limits list is the favourite follow-up." },
  { type: "heading", level: 2, text: "5. Constitutions — the supreme rulebook" },
  { type: "table", headers: ["Axis", "One end", "Other end", "Example"], rows: [["Written", "One codified document", "Unwritten: statutes, conventions, precedent (UK)"], ["Rigid", "Amended by special procedure", "Flexible: amended by ordinary law (UK)"], ["Federal", "Power split central vs regions", "Unitary: one supreme centre"], ["Effective", "Followed in practice", "A sham on paper — the trap question"]] },
  { type: "paragraph", text: "A constitution is the supreme law: it allocates power, limits government, and states rights. RIGID constitutions protect stability at the cost of adaptability; FLEXIBLE adapt at the cost of protection. 'A constitution that is not followed in practice is' — the exam's trap: nominal, not effective." },
  { type: "heading", level: 2, text: "6. Federalism — power divided, each supreme in its sphere" },
  { type: "definition", term: "Federalism", text: "Power is constitutionally divided between CENTRAL (defence, currency, foreign affairs) and REGIONAL (education, health, local roads) governments, EACH supreme within its own sphere — neither created nor abolished by the other. Features: a written division of powers, a Supreme Court to arbitrate disputes, bicameralism (states represented in one chamber), and revenue allocation." },
  { type: "example", text: "Worked: a state passes an education law (its sphere — valid); the federal government runs the currency (its sphere — valid); a dispute over who controls mineral royalties goes to the Supreme Court, not to a political fight. The ARBITRATION is the mark: courts, not force, settle federal conflicts." },
  { type: "heading", level: 2, text: "7. Elections — the accountability machine" },
  { type: "table", headers: ["Element", "Meaning", "Exam beat"], rows: [["Universal adult suffrage", "Every adult citizen votes", "Universal = all adults, no property test"], ["Secret ballot", "No one sees your vote", "Protects against intimidation"], ["First-past-the-post", "Most votes in the seat wins the seat", "Winner takes all — votes for losers are 'wasted'"], ["Proportional representation", "Seats ∝ share of votes", "Fairer shares; weaker single-party governments"], ["By-election", "One seat, mid-term", "Fills a vacancy; tests the government's standing"]] },
  { type: "paragraph", text: "FREE and FAIR requires: an independent electoral commission, an accurate register, secret ballot, impartial counting, access for observers. FPTP rewards concentrated support (strong governments, wasted votes); PR rewards spread support (fair shares, coalitions). The trade-off named is the mark." },
  { type: "heading", level: 2, text: "8. Parties vs pressure groups — power vs influence" },
  { type: "paragraph", text: "A political PARTY contests elections to HOLD power and govern; a PRESSURE GROUP lobbies to INFLUENCE those who hold it — it never seeks to govern. Pressure group types: professional (bar, medical), economic (trade unions), religious, promotional. Functions of parties: aggregate interests, recruit leaders, form governments; functions of pressure groups: defend members' interests, inform, check power between elections." },
  { type: "example", text: "Worked: a party campaigns to WIN the presidency; a nurses' association lobbies whichever party rules for better funding. Both seek to shape policy — but only one seeks the office. The distinction (power vs influence) is the exam's favourite pairing." },
  { type: "heading", level: 2, text: "9. The civil service — permanent, neutral, anonymous" },
  { type: "paragraph", text: "The civil service implements policy: PERMANENT (it survives elections and serves whichever party governs), NEUTRAL (serves the government of the day without partisan bias), ANONYMOUS (ministers take public credit and blame; officials stay unnamed). The public corporation: a state-owned enterprise run on business lines — the exam wants the civil service's THREE qualities, not its duties alone." },
  { type: "example", text: "Worked: an election changes the party in power; the permanent secretary stays and briefs the new minister. That continuity IS the point — expertise survives politics. The neutrality is the trap: a partisan civil service is a contradiction of its own definition." },
  { type: "heading", level: 2, text: "10. Public opinion and the media — the watchdog" },
  { type: "paragraph", text: "Public opinion: the aggregate attitudes of citizens — formed by family, school, peers, religion, and above all the MEDIA. The media's WATCHDOG role: investigates and exposes official wrongdoing between elections. Propaganda: persuasion stripped of balance — one-sided by design. Opinion polls measure but also shape opinion — the reflexivity the exam likes." },
  { type: "heading", level: 2, text: "11. Summary — the government spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["State", "Four features; sovereignty internal + external", "State ≠ government — permanence"], ["Forms", "Match form to feature", "Constitutional monarch reigns, does not rule"], ["Branches", "Function + the check against it", "Judicial review checks BOTH branches"], ["Rule of law", "Dicey's three limbs", "Rule of law ≠ rule BY law"], ["Constitutions", "Written/rigid/federal axes", "Nominal ≠ effective"], ["Federalism", "Each tier supreme in its sphere", "Disputes go to the courts"], ["Elections", "FPTP vs PR trade-off", "Universal = ALL adults"], ["Parties vs groups", "Power vs influence", "Groups lobby; parties govern"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'distinguish between' = both items, the difference on each line; 'explain the term' = definition + one feature; 'outline' = the listed items, brief; 'to what extent' = a verdict with the weighing shown. Government papers pay for the FUNCTION of institutions — never just their names." },
];

const POL_QS: Q[] = [
  { q: "The four features of a state are", o: ["population, territory, government, sovereignty", "president, courts, police, army", "nation, culture, language, history", "party, parliament, press, people"], a: "population, territory, government, sovereignty", e: "Sovereignty is the supreme authority — internal and external.", d: "easy" },
  { q: "The primary function of the legislature is to", o: ["implement policy", "interpret the law", "make laws", "conduct elections"], a: "make laws", e: "Executive implements; judiciary interprets.", d: "easy" },
  { q: "A court striking down an unconstitutional act is an example of", o: ["judicial review — the judiciary checking the other branches", "impeachment", "a veto", "separation of party and state"], a: "judicial review — the judiciary checking the other branches", e: "Checks and balances: the court checks both branches at once.", d: "medium" },
  { q: "Dicey's rule of law includes", o: ["one-party rule", "supremacy of law, equality before it, rights via courts", "rule by decree", "majority rule only"], a: "supremacy of law, equality before it, rights via courts", e: "The three limbs — and the limits list is the follow-up.", d: "medium" },
  { q: "A rigid constitution is one that", o: ["is never followed", "can be amended by ordinary law", "requires a special procedure to amend", "has no supreme court"], a: "requires a special procedure to amend", e: "Rigid: special amendment; flexible: ordinary law.", d: "medium" },
  { q: "Under federalism,", o: ["one centre holds all power", "central and regional tiers are each supreme in their own sphere", "states create and abolish the centre", "courts hold all power"], a: "central and regional tiers are each supreme in their own sphere", e: "Neither tier created by the other; courts arbitrate disputes.", d: "easy" },
  { q: "In first-past-the-post, the winner is", o: ["whoever wins a majority nationwide", "the candidate with the most votes in the seat", "chosen by proportional shares", "appointed by the courts"], a: "the candidate with the most votes in the seat", e: "Winner takes the seat — wasted votes are the trade-off.", d: "medium" },
  { q: "A pressure group differs from a political party because it", o: ["seeks influence, not power", "seeks power, not influence", "never has members", "is always illegal"], a: "seeks influence, not power", e: "Parties contest to govern; groups lobby those who do.", d: "medium" },
  { q: "The civil service is described as permanent because it", o: ["cannot be disciplined", "survives elections and serves whichever government is in power", "holds all sovereign power", "is above the law"], a: "survives elections and serves whichever government is in power", e: "Continuity of expertise — with neutrality and anonymity.", d: "medium" },
  { q: "A constitution that exists on paper but is ignored in practice is", o: ["effective", "nominal", "rigid", "federal"], a: "nominal", e: "Effective means followed in practice — the trap pairing.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "political-science-government" } });
    if (!topic) throw new Error("master political-science-government topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("political-science-government standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Political Science / Government — Complete", content: { blocks: POL_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < POL_QS.length; i++) {
      const item = POL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-polisci-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-polisci-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "polisci-rebuild", blocks: POL_BLOCKS.length, questions: POL_QS.length });
  } catch (e) {
    console.error("rebuild polisci failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
