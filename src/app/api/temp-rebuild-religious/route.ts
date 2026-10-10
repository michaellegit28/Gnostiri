import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 6: Religious Studies at the no-exceptions bar:
// the study of religion, world religions, sacred texts, worship, ethics,
// leadership, religion and society, African traditional religion.

const REL_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. The study of religion — the discipline's neutrality" },
  { type: "definition", term: "Religion", text: "A system of BELIEFS, PRACTICES, sacred TEXTS, and INSTITUTIONS orienting life around the SACRED — the set apart from the ordinary. The discipline studies religion PHENOMENOLOGICALLY: describe each tradition as its BELIEVERS hold it, from inside its own terms — neutrality, not judgement. The four elements (beliefs, practices, texts, institutions) are the definition question's checklist." },
  { type: "example", text: "Worked: a Muslim describes prayer as commanded by God; the phenomenologist records THAT claim faithfully without adopting or attacking it. 'Define religion' = the four elements; 'the approach that describes beliefs as believers hold them' = phenomenological. The neutrality is the mark." },
  { type: "heading", level: 2, text: "2. The major world religions — beliefs and anchors" },
  { type: "table", headers: ["Religion", "Sacred text", "Central belief", "Key practice"], rows: [["Christianity", "The Bible", "Salvation through Christ", "Prayer, sacraments, worship"], ["Islam", "The Qur'an", "One God; Muhammad His final prophet", "The five pillars: faith, prayer, alms, fasting, pilgrimage"], ["Judaism", "The Torah", "The covenant between God and Israel", "Sabbath, Passover"], ["Hinduism", "The Vedas", "Dharma and karma; rebirth until liberation", "Puja, yoga, festival worship"], ["Buddhism", "The Pali Canon", "The Four Noble Truths; the Eightfold Path", "Meditation, monastic life"]] },
  { type: "example", text: "Worked: Islam's five pillars are the checklist question — faith (shahada), prayer (salat), alms (zakat), fasting (sawm), pilgrimage (hajj). Buddhism's diagnosis: suffering exists, it has a cause (craving), it can cease, and the Eightfold Path is the cure — the four truths in order are the mark." },
  { type: "heading", level: 2, text: "3. Sacred texts — authority and interpretation" },
  { type: "paragraph", text: "Texts carry AUTHORITY: for believers, God's word or the record of it. Interpretation runs between LITERAL (the plain sense governs) and CONTEXTUAL (historical setting and purpose govern) — the hermeneutic question. Most scriptures began as ORAL tradition — recited, memorised, transmitted for generations before writing (the Qur'an's name itself means recitation). The exam wants the authority claimed AND the interpretive range named." },
  { type: "example", text: "Worked: the same verse can be read literally (a rule for all time) or contextually (a rule for its crisis) — the interpretation question asks you to name the approach and its implication, never to pick a winner. Oral-to-written transmission explains variant readings — the history is the mark." },
  { type: "heading", level: 2, text: "4. Worship and practice — prayer, festivals, rites" },
  { type: "table", headers: ["Element", "Meaning", "Examples across traditions"], rows: [["Prayer", "Address to the sacred", "Salat five times daily; the Lord's Prayer"], ["Festival", "Communal commemoration", "Christmas and Easter; Ramadan and Eid; Passover"], ["Rites of passage", "Marking life's thresholds", "Birth/naming, initiation, marriage, funeral"], ["Sacrifice/offering", "Giving to the sacred", "Ancient sacrifice; modern alms and tithes"]] },
  { type: "paragraph", text: "RITES OF PASSAGE move a person across life's thresholds — birth, initiation, marriage, death — each rite marks a change of STATUS. Festivals COMMEMORATE the tradition's defining events (Easter: the resurrection; Eid: the end of the fast). The exam wants the FUNCTION of the rite, never just its name." },
  { type: "heading", level: 2, text: "5. Ethics and morality in religion" },
  { type: "definition", term: "Moral authority", text: "Religious ethics draws on FOUR sources: SCRIPTURE (the text commands), TRADITION (the community's practice), REASON (natural law — what is right is discernible), and CONSCIENCE (the inner voice). The GOLDEN RULE — treat others as you wish to be treated — appears across traditions: Christianity, Islam, Judaism, Hinduism, Buddhism all carry versions. The exam wants the SOURCE named for a given rule, not just the rule." },
  { type: "example", text: "Worked: a believer declines to steal citing scripture (Thou shalt not); another cites conscience; another cites reason about harm. The same rule, different authorities — 'state the source of authority' is the mark, and the golden rule's cross-tradition presence is the comparison point." },
  { type: "heading", level: 2, text: "6. Leadership and institutions — who speaks for the sacred" },
  { type: "paragraph", text: "Leadership ranges: HIERARCHICAL (a clerical chain — bishops, the Pope; the imam and the ulama) vs CONGREGATIONAL (the local body governs itself — many Protestant churches). The CLERGY officiate; the LAITY are the members. Institutions: the church, the mosque, the temple, the monastery — each organises worship, education, and welfare. The exam wants the STRUCTURE named with its consequence: who decides doctrine and discipline." },
  { type: "example", text: "Worked: a Catholic bishop traces authority through an unbroken chain (hierarchical); a congregational church votes on its own pastor (congregational). Same faith community, different authority structure — who decides is the mark." },
  { type: "heading", level: 2, text: "7. Religion and society — cohesion, conflict, secularism" },
  { type: "paragraph", text: "Durkheim: religion binds society — shared worship produces shared conscience (COHESION). Marx: religion can also justify the existing order ('the opium of the people' — CONFLICT reading). Weber: religion can DRIVE change (the Protestant ethic and capitalism). SECULARISM: the state and religion separated — public life without religious authority; the trend and the backlash both examined." },
  { type: "example", text: "Worked: the same church is social glue (Durkheim), an establishment apologist (Marx), and an engine of change (Weber) — three lenses, one institution. Match the CLAIM to the THEORIST: cohesion is Durkheim's; the engine is Weber's. The pairing is the mark." },
  { type: "heading", level: 2, text: "8. African traditional religion — the oral tradition" },
  { type: "definition", term: "African traditional religion", text: "A SUPREME BE recognised above divinities and ANCESTORS, approached through ritual, libation, and mediation; morality is COMMUNAL (offence against the community, not only against God); transmission is ORAL — proverbs, myths, rites — not scripture. The monotheism debate: one Supreme Being above many divinities — monotheistic or polytheistic? The exam wants the structure (Supreme Being + divinities + ancestors) and the debate named." },
  { type: "example", text: "Worked: libation poured to the ancestors who mediate with the Supreme Being — the hierarchy of approach is the structure. Ancestors are venerated, not worshipped as God — the distinction is the classic exam point." },
  { type: "heading", level: 2, text: "9. Comparative themes — one table, all traditions" },
  { type: "table", headers: ["Theme", "Christianity", "Islam", "African traditional religion"], rows: [["Ultimate reality", "One God, trinitarian", "One God, unitarian", "Supreme Being above divinities and ancestors"], ["Afterlife", "Resurrection, judgment, heaven", "Judgment, paradise", "Ancestor realm; continued bond with the living"], ["Authority", "Scripture + church", "Qur'an + Sunnah", "Oral tradition + elders"], ["Ethics", "Love of God and neighbour", "Five pillars; sharia", "Communal harmony; taboos"]] },
  { type: "example", text: "Worked: the comparison question is answered ROW by row — one theme (say, authority) compared across ALL traditions on each line. Comparing one theme at a time, both traditions per line, is the mark; a general essay is not." },
  { type: "heading", level: 2, text: "10. Summary — the religious studies spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Definition", "Beliefs, practices, texts, institutions", "The phenomenological neutrality"], ["World religions", "Text + central belief + practice, paired", "The five pillars, in order"], ["Texts", "Authority + interpretive range", "Literal ≠ contextual"], ["Rites", "Function, not name", "Rites of passage mark STATUS change"], ["Ethics", "Name the source of authority", "The golden rule across traditions"], ["Society", "Theorist with the claim", "Durkheim cohesion; Weber engine"], ["African tradition", "Supreme Being + divinities + ancestors", "Venerated ≠ worshipped"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'describe' = the belief as its believers hold it; 'compare' = one theme across ALL traditions, line by line; 'explain' = the function of the practice or rite; 'state the source of authority' = scripture, tradition, reason, or conscience — named. Religious studies papers pay for the function and the comparison — never just the names." },
];

const REL_QS: Q[] = [
  { q: "The phenomenological approach to religion", o: ["judges which religion is true", "describes each tradition as its believers hold it", "rejects all religion", "studies only Christianity"], a: "describes each tradition as its believers hold it", e: "Neutrality: record the claim from inside its own terms.", d: "medium" },
  { q: "The five pillars of Islam are", o: ["faith, prayer, alms, fasting, pilgrimage", "prayer, tithing, singing, fasting, giving", "faith, works, grace, law, love", "baptism, communion, prayer, fasting, alms"], a: "faith, prayer, alms, fasting, pilgrimage", e: "Shahada, salat, zakat, sawm, hajj — in order.", d: "easy" },
  { q: "The Four Noble Truths belong to", o: ["Hinduism", "Buddhism — suffering, its cause, its end, the Path", "Judaism", "Islam"], a: "Buddhism — suffering, its cause, its end, the Path", e: "Diagnosis, cause, prognosis, cure — the Eightfold Path.", d: "easy" },
  { q: "Most sacred scriptures began as", o: ["printed books", "oral tradition — recited before written", "legal codes", "letters"], a: "oral tradition — recited before written", e: "The Qur'an means recitation; transmission came first.", d: "easy" },
  { q: "Rites of passage exist to", o: ["entertain the community", "mark a change of status across life's thresholds", "raise funds", "teach history"], a: "mark a change of status across life's thresholds", e: "Birth, initiation, marriage, death — the function is the mark.", d: "medium" },
  { q: "The golden rule — treat others as yourself — appears", o: ["in Christianity only", "across many traditions", "in no tradition", "in Islam only"], a: "across many traditions", e: "The cross-tradition comparison is the exam point.", d: "easy" },
  { q: "Which theorist read religion as a source of social COHESION?", o: ["Marx", "Durkheim", "Weber", "Freud"], a: "Durkheim", e: "Marx = opium of the people; Weber = the engine of change.", d: "medium" },
  { q: "In African traditional religion, ancestors are", o: ["worshipped as the Supreme Being", "venerated — they mediate, not worshipped as God", "ignored", "considered mythical"], a: "venerated — they mediate, not worshipped as God", e: "Supreme Being above divinities and ancestors — the hierarchy of approach.", d: "medium" },
  { q: "A comparison question is best answered", o: ["one theme across all traditions, line by line", "one long essay per tradition", "only on your own tradition", "by listing names"], a: "one theme across all traditions, line by line", e: "Row by row, both traditions per line — the method is the mark.", d: "hard" },
  { q: "Reading a verse for its historical setting and purpose is", o: ["literal interpretation", "contextual interpretation", "rejection", "translation"], a: "contextual interpretation", e: "Literal = plain sense governs; contextual = setting governs.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "religious-studies" } });
    if (!topic) throw new Error("master religious-studies topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Religious Studies — Complete", content: { blocks: REL_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < REL_QS.length; i++) {
      const item = REL_QS[i];
      await prisma.question.upsert({
        where: { id: `master-religious-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-religious-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "religious-rebuild", blocks: REL_BLOCKS.length, questions: REL_QS.length });
  } catch (e) {
    console.error("rebuild religious failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
