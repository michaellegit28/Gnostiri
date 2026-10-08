import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY History batch — Topic 3 of 5: Decolonization & Independence.
// CORE in: NG GH KE ZA IN PK GB FR EG BR (approved master list).

const CORE_ISOS = ["NG", "GH", "KE", "ZA", "IN", "PK", "GB", "FR", "EG", "BR"];

const DECOL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Why the empires could not last" },
  { type: "paragraph", text: "The Second World War broke colonialism's spine. Britain emerged victorious but bankrupt, dependent on US loans that came with anti-imperial strings; Japan's 1942 humiliations in Singapore shattered the myth of European invincibility across Asia; and two million African and Asian troops had fought for freedoms they were denied at home. The 1941 Atlantic Charter promised self-determination; the new United Nations (1945) made trusteeship a duty, not a possession." },
  { type: "definition", term: "Decolonization", text: "The transfer of political sovereignty from European powers to independent states — by negotiation, by armed struggle, or (rarely) by abrupt departure. It ran in waves from 1947 into the 1990s, reshaping the UN from 51 founding members to today's 193." },
  { type: "paragraph", text: "Empire had also stopped paying: colonies became markets and raw-material sources for rival manufacturers, while nationalist movements (congresses, congress parties, trade unions, student bodies) organised mass politics the old repression could no longer afford to face down. Both new superpowers, for their own reasons, rhetorically opposed colonialism — squeezing the Europeans from both sides." },
  { type: "heading", level: 2, text: "2. South Asia — the Partition precedent, 1947" },
  { type: "paragraph", text: "India's independence movement had the deepest bench: Gandhi's non-cooperation and salt marches built mass moral pressure from 1920; Nehru's Congress and Jinnah's Muslim League fought the constitutional endgame. Britain, broke and facing post-war unrest, sent Mountbatten with an impossible deadline — and Partition carved out Pakistan (14 August 1947) a day before Indian independence (15 August)." },
  { type: "example", text: "Partition's cost: the Radcliffe Line split Punjab and Bengal overnight. Up to a million people died in communal violence and 10–15 million crossed borders — the largest forced migration in history. Kashmir, its mahaja undecided, remains disputed and nuclear-flashpoint to this day: decolonization's unfinished business made permanent." },
  { type: "callout", variant: "warning", text: "Exam trap: do not write that Britain simply 'gave' India freedom. Cite the 1946 naval mutiny, mass satyagraha, wartime exhaustion, and US pressure — independence was taken, negotiated, and hurried, not gifted." },
  { type: "heading", level: 2, text: "3. West Africa — the constitutional path" },
  { type: "paragraph", text: "Ghana (Gold Coast) set the template. Nkrumah — jailed by the British, then elected while imprisoned — led the Convention People's Party to victory on the slogan 'Seek ye first the political kingdom.' Ghana's independence on 6 March 1957 was the first in sub-Saharan Africa and became the headquarters of pan-African ambition, hosting the 1958 All-African Peoples' Conference." },
  { type: "paragraph", text: "Nigeria followed in 1960: a federation of three regions shaped by British indirect rule, its paths, schools and civil service making the transition largely by ballot and conference. The pattern across British West Africa (Sierra Leone 1961, Gambia 1965) was constitutional — election, conference, flag — yet each inherited borders that split or joined peoples arbitrarily, sowing later conflicts (Nigeria's civil war, 1967–70)." },
  { type: "heading", level: 2, text: "4. East & Southern Africa — land and settler delay" },
  { type: "paragraph", text: "Where Europeans had settled and taken land, independence came later and harder. Kenya's Mau Mau uprising (1952–56) triggered a state of emergency; repression killed thousands, but the cost of holding on pushed Britain toward Kenyatta's release and independence in 1963. Tanganyika (1961) and Uganda (1962) followed Nyerere's and Obote's peaceful roads; Nyasaland and Northern Rhodesia escaped the imposed Central African Federation into Malawi (1964) and Zambia (1964)." },
  { type: "paragraph", text: "Rhodesia was the extreme case: Ian Smith's white minority declared UDI (unilateral independence, 1965) rather than accept majority rule, provoking sanctions and a guerrilla war that ended only at Lancaster House (1979) — Zimbabwe independent under Mugabe, April 1980. Settler resistance plus a prime minister who defied Britain stretched decolonization by two decades and made it armed where elsewhere it had been argued." },
  { type: "heading", level: 2, text: "5. Apartheid — the state that defied the century" },
  { type: "paragraph", text: "South Africa left the Commonwealth in 1961 to perfect apartheid — 'apartness' — built on the 1948 Nationalist platform: Population Registration (racial classification at birth), Group Areas (forced removals), Pass Laws (movement control), Bantu Education (schooling for subservience). Resistance moved from Defiance Campaign to armed struggle after Sharpeville (1960, 69 killed); Rivonia (1964) put Mandela away for 27 years; Soweto's schoolchildren (1976) brought the world's cameras." },
  { type: "paragraph", text: "Isolation did the rest: sports boycotts, arms embargoes, divestment and sanctions bit into an economy already bleeding on township revolt and border wars. De Klerk (1989) chose negotiation over Gorbachev-style collapse — Mandela walked free in February 1990, negotiations survived their crises, and South Africa's first universal elections (April 1994) made Mandela president of what the world calls the rainbow nation — Africa's last great decolonization." },
  { type: "diagram", diagramId: "decolonization-waves", caption: "Independence in waves" },
  { type: "heading", level: 2, text: "6. The violent exceptions — Algeria and the Portuguese" },
  { type: "paragraph", text: "France treated Algeria as sovereign French soil with a million settlers, so the FLN's war (1954–62) — terrorism, reprisals, the Battle of Algiers, army mutiny — ran eight brutal years before Evian brought independence by referendum. Portugal, Europe's poorest imperial, held on longest of all: Guinea-Bissau, Angola and Mozambique won their wars only after Lisbon's own Carnation Revolution (1974) toppled the dictatorship and let go overnight." },
  { type: "heading", level: 2, text: "7. Legacies — what independence inherited and made" },
  { type: "table", headers: ["Legacy", "Evidence", "Consequence"], rows: [["Artificial borders", "Berlin Conference lines split peoples", "Secessionism, civil wars (Nigeria, Sudan, Somalia)"], ["One-party drift & coups", "Nkrumah deposed 1966; dozens of juntas", "Weak legitimacy, decades of lost development"], ["Economic dependence", "Raw exports, manufactured imports", "Neo-colonialism — political freedom without fiscal freedom"], ["Cold War entanglement", "Angola's civil war, Ogaden", "Proxy armies outlived the superpowers' patience"], ["Kept institutions", "English/French languages, parliaments, courts", "Pan-African cooperation easier; elite continuity too"]] },
  { type: "heading", level: 2, text: "8. Exam technique — paths compared" },
  { type: "table", headers: ["Path", "Cases", "Explain by"], rows: [["Constitutional", "Ghana, Nigeria, India (after 1945 pressure)", "Mass movements + imperial bankruptcy + moderate elites both sides"], ["Armed struggle", "Kenya, Zimbabwe, Angola, Mozambique", "Settler land + minority refusing majority rule"], ["Negotiated miracle", "South Africa 1990–94", "Sanctions cost + leadership (Mandela/De Klerk) + fear of mutual ruin"]] },
  { type: "callout", variant: "info", text: "Essay rule for this topic: when asked why paths differed, weigh settler presence and land against imperial exhaustion — the two variables that best predict peaceful versus violent decolonization." },
];

const DECOL_QS: Q[] = [
  { q: "India and Pakistan became independent in", o: ["1945", "1947", "1950", "1957"], a: "1947", e: "Pakistan 14 August, India 15 August — Partition's deadline rushed by a bankrupt Britain.", d: "easy" },
  { q: "The first sub-Saharan African colony to gain independence was", o: ["Nigeria (1960)", "Kenya (1963)", "Ghana (1957)", "Zambia (1964)"], a: "Ghana (1957)", e: "Nkrumah's Gold Coast became the template and pan-African hub.", d: "easy" },
  { q: "Partition's human cost included roughly", o: ["1 million dead, 10–15 million displaced", "no casualties", "50,000 displaced", "2 million dead, no movement"], a: "1 million dead, 10–15 million displaced", e: "The largest forced migration in history.", d: "medium" },
  { q: "Kenya's decolonization was accelerated by", o: ["the Mau Mau uprising and its repression's cost", "a UN invasion", "an Indian treaty", "oil discovery"], a: "the Mau Mau uprising and its repression's cost", e: "Emergency 1952–56 led to Kenyatta's release and 1963 independence.", d: "medium" },
  { q: "Rhodesia delayed majority rule by declaring", o: ["war on Britain", "UDI — Unilateral Declaration of Independence, 1965", "union with South Africa", "a republic in 1948"], a: "UDI — Unilateral Declaration of Independence, 1965", e: "Smith's regime fought sanctions and guerrillas until Lancaster House, 1979.", d: "medium" },
  { q: "The apartheid law that racially classified every person at birth was", o: ["Group Areas Act", "Population Registration Act", "Pass Laws", "Bantu Education Act"], a: "Population Registration Act", e: "Classification was apartheid's foundation; the other laws built on it.", d: "medium" },
  { q: "Sharpeville (1960) mattered because", o: ["it ended apartheid", "police killed 69 unarmed protesters, moving resistance toward armed struggle", "it freed Mandela", "it brought UN rule"], a: "police killed 69 unarmed protesters, moving resistance toward armed struggle", e: "The ANC and PAC switched to arms afterwards.", d: "medium" },
  { q: "Algeria's independence came after", o: ["a peaceful referendum in 1954", "eight years of FLN war ending at Evian, 1962", "a British conference", "Portugal's collapse"], a: "eight years of FLN war ending at Evian, 1962", e: "Settler presence made France fight rather than negotiate early.", d: "hard" },
  { q: "Which best explains why some African decolonization turned violent?", o: ["Tribal conflict, as colonial propaganda held", "Settler land-holding plus minority regimes refusing majority rule", "UN resolutions demanding war", "Religious differences alone"], a: "Settler land-holding plus minority regimes refusing majority rule", e: "Kenya, Zimbabwe, Algeria fit; constitutional cases lacked large settler land stakes.", d: "hard" },
  { q: "Neo-colonialism describes", o: ["continued colonisation", "political independence with economic dependence on former powers", "UN trusteeship", "migration to Europe"], a: "political independence with economic dependence on former powers", e: "Raw-material export + manufactured import keeps fiscal power abroad.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const note = "CORE: Decolonization prescribed in NG, GH, KE, ZA, IN, PK, GB, FR, EG, BR syllabi (human-approved master list).";
    const topic = await prisma.topic.findFirst({ where: { slug: "decolonization-independence" } });
    if (!topic) throw new Error("master decolonization-independence topic missing");
    const boards = await prisma.curriculumBoard.findMany({ where: { region: { isoCode: { in: CORE_ISOS } } }, select: { id: true } });
    if (!boards.length) throw new Error("No boards found for CORE_ISOS");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Decolonization & Independence — Complete", content: { blocks: DECOL_BLOCKS } as object, estimatedMinutes: 45 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Decolonization & Independence — Complete", content: { blocks: DECOL_BLOCKS } as object, orderIndex: 0, estimatedMinutes: 45 } });
    for (let i = 0; i < DECOL_QS.length; i++) {
      const item = DECOL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-decolonization-independence-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-decolonization-independence-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
    const have = new Set(existingRows.map((r) => r.boardId));
    await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
    const missing = boards.filter((b) => !have.has(b.id));
    if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: note })) });
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "decolonization-independence", blocks: DECOL_BLOCKS.length, questions: DECOL_QS.length, coreBoards: boards.length });
  } catch (e) {
    console.error("temp history decolonization failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
