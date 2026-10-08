import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY History batch — Topic 4 of 5: Regional Compulsory History.
// CORE in: NG IL EG (approved master list). WAEC (Nigerian History), Bagrut, Thanaweya Amma.

const CORE_ISOS = ["NG", "IL", "EG"];

const REGIONAL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Why states make their own history compulsory" },
  { type: "paragraph", text: "Every syllabus on earth teaches world wars and cold wars — but WAEC reserves marks for Nigerian History, Israel's Bagrut for Zionism and the state's wars, Egypt's Thanaweya Amma for Egypt's national story. The reason is identity: a state's exam system is its memory policy, and these three histories show how nations choose which pasts to require." },
  { type: "callout", variant: "info", text: "Exam framing: this chapter treats each national history in its own syllabus's language and periodisation. Learn the exam you are sitting — WAEC wants Sokoto to civil war; Bagrut wants aliyah to Oslo; Thanaweya wants Muhammad Ali to Nasser." },
  { type: "heading", level: 2, text: "2. Nigerian history — states, caliphate, colony, nation" },
  { type: "paragraph", text: "Nigeria's depth surprises students who expect a young country: Kanem-Borno's millennium of recorded kings by Lake Chad; Hausa city-states (Kano's walls, Katsina's scholarship) trading trans-Saharan gold and salt; Yoruba kingdoms (Ife as spiritual source, Oyo's cavalry empire) and Benin's bronzes and earthworks — political complexity centuries before 1900." },
  { type: "definition", term: "Sokoto Caliphate, 1804", text: "Usman dan Fodio's jihad — launched from Degel against corrupt Hausa rule — built West Africa's largest state: an emirate system under the Caliph in Sokoto, running Quranic law, scholarship (his daughter Nana Asma'u led women's education), and administration that Britain would later borrow wholesale as 'indirect rule'." },
  { type: "paragraph", text: "Britain's conquest (lagging abolition, gunboats, and the Royal Niger Company) ended at Sokoto in 1903; Lugard's amalgamation of North and South (1914) joined three civilisations and dozens of nations into one colony for administrative convenience — not consent. Nationalism grew through the press (Azikiwe's West African Pilot), unions, and regional parties (Awolowo's Action Group, Bello's NPC), arriving at independence on 1 October 1960 and a republic in 1963." },
  { type: "paragraph", text: "The First Republic broke on its contradictions: the 1964 federal elections and the 1966 crises (two coups, anti-Igbo pogroms in the North) led the East under Ojukwu to secede as Biafra in May 1967. The civil war (1967–70) — 'no victor, no vanquished' in Gowon's peace — cost perhaps a million lives, most to blockade famine, and set the rule that Nigeria stays one: oil money, federal quotas, and twelve states created to dilute power have held it together since." },
  { type: "example", text: "Source-style judgment (WAEC staple): 'Indirect rule succeeded in the North and stumbled in the West and East.' Explain via existing emirate structures versus elected chiefs and warrant chiefs — administration borrowed what was there, and where centralised tradition was absent it invented weak substitutes." },
  { type: "heading", level: 2, text: "3. Israeli history — return, state, survival" },
  { type: "paragraph", text: "Bagrut's story opens with dispora and return: pogroms and European nationalism produced Herzl's political Zionism (Der Judenstaat, 1896; Basle 1897), then waves of aliyah — Second Aliyah building kibbutzim and Hebrew revival, Eliezer Ben-Yehuda's dictionary turning liturgy into a spoken language. Britain's Balfour Declaration (1917) promised a 'national home' in Palestine to a Mandate that also promised Arab independence; the 1936–39 Arab revolt and Britain's White Paper caps forced the issue." },
  { type: "paragraph", text: "The Holocaust gave the argument its terrible weight; UN Resolution 181 (November 1947) voted partition; Britain quit; David Ben-Gurion declared Israel on 14 May 1948 as five armies invaded. The War of Independence ended with armistice lines (1949) and a Palestinian refugee question that remains the conflict's core. Sinai 1956 confirmed the new state's reach; the Six-Day War (June 1967) — six days, three fronts — took the West Bank, Gaza, Golan and Sinai, redrawing both borders and the peace problem; Yom Kippur 1973 showed deterrence could crack." },
  { type: "paragraph", text: "Camp David (1978) returned Sinai for recognition — the template of land-for-peace. The First Intifada (1987) made occupation political; the Oslo Accords (1993) — Rabin and Arafat's handshake on the White House lawn — created the Palestinian Authority and mutual recognition, before Rabin's assassination (1995), the Second Intifada, and disengagement from Gaza (2005) froze the process into the lines students must now analyse." },
  { type: "callout", variant: "warning", text: "Bagrut trap: dates do the work here. 1897 (Basle), 1917 (Balfour), 1947 (UN 181), 1948 (statehood), 1967 (Six-Day), 1973 (Yom Kippur), 1978 (Camp David), 1993 (Oslo). A Bagrut essay without anchored dates cannot pass." },
  { type: "heading", level: 2, text: "4. Egyptian history — from Muhammad Ali to Nasser's Egypt" },
  { type: "paragraph", text: "Egypt's national story is deliberately long — a civilisation that unified under pharaohs (c. 3100 BCE), built the pyramids at Giza, wrote in hieroglyphs (deciphered via the Rosetta Stone after 1799), and was ruled in turn by Persians, Greeks (Ptolemies), Romans, Arabs (Amr ibn al-As, 641 CE), Mamluks, and Ottomans. The modern state begins where Thanaweya begins: Napoleon's 1798 invasion, and the Albanian officer who emerged from its chaos." },
  { type: "definition", term: "Muhammad Ali, 1805–1848", text: "The founder of modern Egypt: destroyed the Mamluks (1811), built a European-modelled army and industry, introduced long-staple cotton as export king, sent educational missions to France (belatedly including Tahtawi, who returned to found Arabic translation and journalism). His dynasty ruled until 1952 — increasingly in Britain's shadow." },
  { type: "paragraph", text: "The Suez Canal (opened 1869, built with corvée Egyptian labour for European profit) made Egypt the empire's artery — and its debt trap. Britain occupied in 1882 (Tel el-Kebir) to protect the Canal and bondholders. The 1919 Revolution — Saad Zaghlul and the Wafd demanding Versailles attendance for Egypt — forced nominal independence (1922) but kept British troops and control of the Canal until 1936, and the monarchy in Cairo as a client." },
  { type: "paragraph", text: "The Free Officers' coup (July 1952) evicted King Farouk and by 1954 Nasser ruled. His zenith was Suez 1956: nationalising the Canal brought an Anglo-French-Israeli invasion that the USA and USSR forced to withdraw — humiliating the old empires, making Nasser the Arab world's figurehead, and confirming Egypt's non-aligned leverage. Aswan Dam, land reform, and pan-Arabism (the United Arab Republic, 1958–61) followed; the 1967 defeat by Israel (Sinai lost) broke the aura, and his death in 1970 passed the stage to Sadat — the 1973 crossing of the Canal, Camp David's peace with Israel (1978), and his 1981 assassination opened the Mubarak decades that ran to Tahrir in 2011." },
  { type: "diagram", diagramId: "regional-history-timelines", caption: "Three national timelines" },
  { type: "heading", level: 2, text: "5. Comparing the three — exam technique" },
  { type: "table", headers: ["", "Nigeria (WAEC)", "Israel (Bagrut)", "Egypt (Thanaweya)"], rows: [["Opening frame", "States & caliphate before 1800", "Zionism & aliyah", "Muhammad Ali's modernisation"], ["Colonial/mandate turn", "Lugard & amalgamation 1914", "Balfour 1917 & Mandate", "Occupation 1882 & 1919 Revolution"], ["Foundational moment", "Independence 1960", "Statehood 14 May 1948", "Free Officers 1952 / Suez 1956"], ["Defining crisis", "Civil war 1967–70", "Six-Day War 1967", "1967 defeat & recovery"], ["Required skills", "Indirect-rule judgment essays", "Date-anchored narrative essays", "Source analysis & chronology"]] },
  { type: "callout", variant: "info", text: "Golden rule across all three: every paragraph earns its place by naming an actor, a date, and a consequence. National histories reward precise narrative, not adjectives." },
];

const REGIONAL_QS: Q[] = [
  { q: "Usman dan Fodio's jihad (1804) founded the", o: ["Benin Empire", "Sokoto Caliphate", "Oyo Empire", "Kanem-Borno"], a: "Sokoto Caliphate", e: "West Africa's largest pre-colonial state; its emirates became indirect rule's skeleton.", d: "easy" },
  { q: "Northern and Southern Nigeria were amalgamated in", o: ["1903", "1914", "1960", "1963"], a: "1914", e: "Lugard's administrative union of dozens of nations into one colony.", d: "easy" },
  { q: "The Nigerian civil war (1967–70) was fought between", o: ["North and South", "Nigeria and Britain", "Nigeria and secessionist Biafra", "NPC and AG"], a: "Nigeria and secessionist Biafra", e: "Ojukwu's East seceded; Gowon's blockade and 'no victor, no vanquished' peace followed.", d: "medium" },
  { q: "Indirect rule struggled in Western Nigeria because", o: ["the Yoruba had no chiefs at all", "it rested on warrant chiefs where tradition was elected and decentralised", "Britain refused to appoint any chiefs", "the West had no educated elite"], a: "it rested on warrant chiefs where tradition was elected and decentralised", e: "The North's emirates fit; the West's own structures were bypassed.", d: "medium" },
  { q: "Political Zionism was launched by Herzl at", o: ["the Balfour Declaration", "Basle, 1897", "Paris, 1789", "Versailles, 1919"], a: "Basle, 1897", e: "Der Judenstaat (1896) then the First Zionist Congress.", d: "easy" },
  { q: "The Six-Day War (1967) gave Israel control of", o: ["the Golan, West Bank, Gaza and Sinai", "only Gaza", "Cairo", "Jordan alone"], a: "the Golan, West Bank, Gaza and Sinai", e: "Three fronts in six days — borders and peace problem redrawn.", d: "medium" },
  { q: "The Oslo Accords (1993) established", o: ["peace with Syria", "the Palestinian Authority and mutual recognition", "the Balfour Declaration", "the PLO's dissolution"], a: "the Palestinian Authority and mutual recognition", e: "Rabin and Arafat's handshake; land-for-peace template.", d: "medium" },
  { q: "Modern Egypt's founding dynasty was established by", o: ["Napoleon", "Muhammad Ali, 1805", "Saad Zaghlul", "Nasser"], a: "Muhammad Ali, 1805", e: "Army, industry, cotton — the moderniser whose line ruled to 1952.", d: "easy" },
  { q: "The Suez Crisis (1956) ended with", o: ["permanent Anglo-French control of the Canal", "invading forces withdrawn under US-Soviet pressure, boosting Nasser", "Egypt joining NATO", "the Canal closing forever"], a: "invading forces withdrawn under US-Soviet pressure, boosting Nasser", e: "The old empires humiliated; non-aligned Egypt elevated.", d: "medium" },
  { q: "Which best compares the three required histories?", o: ["All begin in 1948", "Each anchors national identity: caliphate-to-nation, aliyah-to-Oslo, Muhammad Ali to Nasser", "All three were British colonies to 1960", "None requires dates"], a: "Each anchors national identity: caliphate-to-nation, aliyah-to-Oslo, Muhammad Ali to Nasser", e: "Different pasts, same memory policy: exam-required national narrative.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const note = "CORE: Nigerian History (WAEC), Israeli History (Bagrut), Egyptian History (Thanaweya) — prescribed by name in NG, IL, EG (human-approved master list).";
    const topic = await prisma.topic.findFirst({ where: { slug: "regional-compulsory-history" } });
    if (!topic) throw new Error("master regional-compulsory-history topic missing");
    const boards = await prisma.curriculumBoard.findMany({ where: { region: { isoCode: { in: CORE_ISOS } } }, select: { id: true } });
    if (!boards.length) throw new Error("No boards found for CORE_ISOS");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Regional Compulsory History — Complete", content: { blocks: REGIONAL_BLOCKS } as object, estimatedMinutes: 50 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Regional Compulsory History — Complete", content: { blocks: REGIONAL_BLOCKS } as object, orderIndex: 0, estimatedMinutes: 50 } });
    for (let i = 0; i < REGIONAL_QS.length; i++) {
      const item = REGIONAL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-regional-compulsory-history-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-regional-compulsory-history-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
    const have = new Set(existingRows.map((r) => r.boardId));
    await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
    const missing = boards.filter((b) => !have.has(b.id));
    if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: note })) });
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "regional-compulsory-history", blocks: REGIONAL_BLOCKS.length, questions: REGIONAL_QS.length, coreBoards: boards.length });
  } catch (e) {
    console.error("temp history regional failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
