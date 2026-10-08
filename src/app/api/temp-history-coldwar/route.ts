import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// TEMPORARY History batch — Topic 2 of 5: Cold War Era.
// CORE in: US GB CA AU SG DE FR IL ZA AE JP BR (approved master list). Others stay pending.

const CORE_ISOS = ["US", "GB", "CA", "AU", "SG", "DE", "FR", "IL", "ZA", "AE", "JP", "BR"];

const COLD_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Roots of the rivalry — ideas become empires" },
  { type: "paragraph", text: "The Cold War was a conflict of systems before it was a conflict of states: Marxist-Leninist communism, committed to one-party rule and state ownership, versus liberal capitalism, committed to markets and elected government. The USA had intervened against the Bolsheviks in Russia's civil war (1918–20); Stalin's suspicion of the West was lifelong. WWII made them reluctant allies — and the moment Hitler fell, the alliance's glue dissolved." },
  { type: "definition", term: "Superpower", text: "A state with global military reach, economic scale, and ideological appeal. In 1945 only two existed: the USA (atomic monopoly, intact homeland, half the world's manufacturing) and the USSR (the army that broke the Wehrmacht, occupying Eastern Europe)." },
  { type: "heading", level: 2, text: "2. Wartime cracks — Yalta and Potsdam" },
  { type: "paragraph", text: "Yalta (February 1945) looked harmonious: Germany to be divided into zones, liberated countries to hold free elections, the UN to be founded. Potsdam (July–August 1945) revealed the frost: Roosevelt was dead, Churchill mid-conference was voted out, Truman mentioned a new weapon to Stalin, and free elections never came to the Soviet-occupied east." },
  { type: "example", text: "The atomic card: Hiroshima and Nagasaki (August 1945) ended the war and opened the nuclear age. Stalin read the bombs as intimidation aimed at Moscow — and ordered the Soviet programme accelerated. The first Soviet test followed in 1949, starting the arms race proper." },
  { type: "heading", level: 2, text: "3. Curtain and containment" },
  { type: "paragraph", text: "Kennan's Long Telegram (1946) framed Soviet expansion as structural and patient; Churchill's Fulton speech (March 1946) named the 'iron curtain' descending from Stettin to Trieste. In March 1947 Truman announced the Truman Doctrine — support free peoples against armed minorities and outside pressure — pledging aid to Greece and Turkey." },
  { type: "definition", term: "Marshall Plan, 1948", text: "$13 billion of US aid to rebuild Western Europe's economies. Motives were both humanitarian and strategic: prosperity starves communism of recruits and reopens markets for US goods. Stalin read it as dollar imperialism, banned participation by satellites, and answered with Cominform (political coordination) and Comecon (economic bloc)." },
  { type: "paragraph", text: "The first test came in Berlin (June 1948–May 1949): Stalin cut land access to the western-occupied island inside the Soviet zone. The Berlin Airlift flew 277,000 sorties supplying 2 million West Berliners until Stalin relented — and the crisis founded West Germany (FRG, May 1949), East Germany (GDR, October 1949), and NATO (April 1949). The USSR's answer, the Warsaw Pact, followed in 1955." },
  { type: "heading", level: 2, text: "4. Hot wars by proxy — Korea and Vietnam" },
  { type: "table", headers: ["Proxy", "Years", "Pattern and outcome"], rows: [["Korea", "1950–53", "North invaded; UN (mostly US) forces pushed north; China intervened; stalemate at the 38th parallel; armistice, no peace treaty — division permanent"], ["Vietnam", "1955–75", "Domino theory justified escalation; US peak 536,000 troops (1968); Tet Offensive broke US public faith; Paris Peace Accords 1973; Saigon fell 1975"], ["Afghanistan", "1979–89", "Soviet invasion to save a client; US Stingers bled them; withdrawal — often called 'the USSR's Vietnam', accelerating its decay"]] },
  { type: "paragraph", text: "Both superpowers learned the same rule: nuclear weapons made direct war suicidal, so the conflict expressed itself at the edges — Korea's armistice line, Vietnam's two-decade agony, the Horn of Africa, Angola, and Central America. Client states received arms, money, and advisers; the superpowers never fought each other head-on." },
  { type: "callout", variant: "warning", text: "Exam trap: 'The Cold War stayed cold' is only true for the superpowers' homelands. Millions died in Korea, Vietnam, and Afghanistan. Credit answers that distinguish direct great-power war (never) from proxy conflict (constant)." },
  { type: "heading", level: 2, text: "5. Cuba — the world at the brink" },
  { type: "paragraph", text: "Castro's 1959 revolution pulled Cuba into the Soviet orbit; the CIA-backed Bay of Pigs invasion (April 1961) failed and humiliated the new US president. In October 1962 US spy planes photographed Soviet missile sites under construction in Cuba — 13 days of crisis followed." },
  { type: "example", text: "October 1962: Kennedy chose a naval 'quarantine' over an airstrike, demanded the missiles' removal, and secretly offered to withdraw US Jupiter missiles from Turkey. Khrushchev stood down; the world stepped back. Consequences: the Moscow–Washington hotline (1963), the Limited Test Ban Treaty (1963, atmospheric testing ends), and a new steadiness in both leaders." },
  { type: "heading", level: 2, text: "6. Détente — the thaw and its limits" },
  { type: "paragraph", text: "From the late 1960s both sides had reasons to relax: the USSR had reached nuclear parity and needed grain and technology; the USA was bleeding in Vietnam and wanted China split from Moscow (Nixon's 1972 Beijing visit). SALT I (1972) capped strategic launchers; the Helsinki Accords (1975) recognised Europe's borders in exchange for human-rights language Moscow would regret; Apollo–Soyuz (1975) staged cooperation in orbit." },
  { type: "paragraph", text: "Limits: MIRVed warheads multiplied under every ceiling, Soviet SS-20s aimed at Western Europe triggered NATO's Euromissile deployments, and the 1979 Afghan invasion killed détente outright — the US Senate refused to ratify SALT II, and 66 nations boycotted the 1980 Moscow Olympics (USSR retaliating in Los Angeles 1984)." },
  { type: "heading", level: 2, text: "7. Africa and Asia — Cold War on poor ground" },
  { type: "paragraph", text: "Decolonizing states became chessboard squares. Angola's civil war (from 1975) drew Cuban troops for the MPLA, South African and US backing for UNITA; the Ogaden War (1977–78) pitted Soviet-allied Ethiopia against Soviet-armed Somalia — Moscow switching clients mid-war; the Congo crisis (1960–65) cost Lumumba his life and installed Mobutu. The pattern everywhere: superpower weapons escalated local quarrels into generational ones." },
  { type: "diagram", diagramId: "cold-war-blocs", caption: "Bipolar world and its proxies" },
  { type: "heading", level: 2, text: "8. The second Cold War and the Soviet collapse" },
  { type: "paragraph", text: "Reagan (1981–89) rebuilt US forces, pushed the Star Wars missile-defence programme, and matched Soviet hardliners' rhetoric — while the Soviet economy rotted under arms spending it could not afford. Gorbachev (1985) tried to save the system by opening it: glasnost (openness, unclogging information) and perestroika (restructuring, loosening central planning). Each reform loosened the regime's grip further." },
  { type: "paragraph", text: "The end came with astonishing speed: the INF Treaty (1987) removed medium-range missiles; 1989's revolutions (a 'Sinatra doctrine' — satellites told to go their own way) toppled the eastern regimes; the Berlin Wall fell on 9 November 1989; Germany reunited (1990); and the USSR dissolved on 26 December 1991, Gorbachev resigning as the state he led ceased to exist." },
  { type: "heading", level: 2, text: "9. Judging the era — exam technique" },
  { type: "table", headers: ["Question type", "What earns the mark"], rows: [["Causes of the Cold War", "Ideology + security fear + atomic diplomacy; avoid single-cause answers"], ["Was détente a success?", "Weigh arms ceilings vs MIRVs, SS-20s, Afghanistan — then judge"], ["Who won the Cold War?", "US outlasted, but internal Soviet economics (oil prices, Afghan bleed, legitimacy decay) did the collapsing"], ["Source evaluation", "OPCVL: Origin, Purpose, Content, Values, Limitations"]] },
  { type: "callout", variant: "info", text: "Golden essay rule: name the event, date it, and state its consequence. A fact without a consequence is a list, not an argument." },
];

const COLD_QS: Q[] = [
  { q: "The Cold War was primarily a conflict between", o: ["two empires over colonies", "communism and liberal capitalism", "Britain and Germany", "religions"], a: "communism and liberal capitalism", e: "System rivalry, expressed through superpower clients.", d: "easy" },
  { q: "The 'iron curtain' speech (1946) was delivered at Fulton by", o: ["Truman", "Churchill", "Kennan", "Stalin"], a: "Churchill", e: "It named the dividing line across Europe.", d: "easy" },
  { q: "The Marshall Plan was designed to", o: ["rebuild Western Europe and block communism's appeal", "arm West Germany", "fund the UN", "compensate the USSR"], a: "rebuild Western Europe and block communism's appeal", e: "Prosperity as containment; Stalin called it dollar imperialism.", d: "easy" },
  { q: "The Berlin Blockade was defeated by", o: ["a US tank assault", "the Berlin Airlift, 1948–49", "UN sanctions", "a treaty"], a: "the Berlin Airlift, 1948–49", e: "277,000 sorties supplied the western sectors until Stalin relented.", d: "easy" },
  { q: "The war that taught the USA limits of conventional intervention was", o: ["Korea", "Vietnam", "Afghanistan", "Angola"], a: "Vietnam", e: "Tet (1968) broke public faith; Saigon fell 1975.", d: "medium" },
  { q: "The closest the Cold War came to direct nuclear war was over", o: ["Berlin, 1961", "Cuban Missile Crisis, 1962", "Afghanistan, 1979", "Korea, 1950"], a: "Cuban Missile Crisis, 1962", e: "13 days; resolved by quarantine plus a secret Jupiter-missile trade.", d: "easy" },
  { q: "SALT I (1972) capped", o: ["all nuclear weapons", "strategic missile launchers", "naval budgets", "bioweapons only"], a: "strategic missile launchers", e: "MIRVed warheads later multiplied under the ceilings.", d: "medium" },
  { q: "Gorbachev's two signature policies were", o: ["glasnost and perestroika", "detente and brinkmanship", "containment and rollback", "autarky and collectivisation"], a: "glasnost and perestroika", e: "Openness and restructuring — loosening the grip they meant to save.", d: "medium" },
  { q: "The Soviet Union formally dissolved in", o: ["1989", "1990", "December 1991", "1993"], a: "December 1991", e: "Wall fell 1989; Germany reunited 1990; USSR ended 26 Dec 1991.", d: "medium" },
  { q: "Which judgement is best supported?", o: ["The USA militarily defeated the USSR", "The USSR collapsed largely from internal economic and legitimacy decay", "Détente ended the Cold War in 1975", "China caused the collapse"], a: "The USSR collapsed largely from internal economic and legitimacy decay", e: "US pressure mattered, but oil prices, Afghan costs, and lost belief did the breaking.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const note = "CORE: Cold War prescribed in US, UK, CA, AU, SG, DE, FR, IL, ZA, AE, JP, BR syllabi (human-approved master list).";
    const topic = await prisma.topic.findFirst({ where: { slug: "cold-war-era" } });
    if (!topic) throw new Error("master cold-war-era topic missing");
    const boards = await prisma.curriculumBoard.findMany({ where: { region: { isoCode: { in: CORE_ISOS } } }, select: { id: true } });
    if (!boards.length) throw new Error("No boards found for CORE_ISOS");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (lesson) await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Cold War Era — Complete", content: { blocks: COLD_BLOCKS } as object, estimatedMinutes: 45 } });
    else await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Cold War Era — Complete", content: { blocks: COLD_BLOCKS } as object, orderIndex: 0, estimatedMinutes: 45 } });
    for (let i = 0; i < COLD_QS.length; i++) {
      const item = COLD_QS[i];
      await prisma.question.upsert({
        where: { id: `master-cold-war-era-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-cold-war-era-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    const existingRows = await prisma.topicBoardAlignment.findMany({ where: { topicId: topic.id }, select: { boardId: true } });
    const have = new Set(existingRows.map((r) => r.boardId));
    await prisma.topicBoardAlignment.updateMany({ where: { topicId: topic.id }, data: { tier: "core", verifiedDate: today, weightNotes: note } });
    const missing = boards.filter((b) => !have.has(b.id));
    if (missing.length) await prisma.topicBoardAlignment.createMany({ data: missing.map((b) => ({ topicId: topic.id, boardId: b.id, trackId: null, tier: "core" as const, verifiedDate: today, weightNotes: note })) });
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today, needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "cold-war-era", blocks: COLD_BLOCKS.length, questions: COLD_QS.length, coreBoards: boards.length });
  } catch (e) {
    console.error("temp history cold-war failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
