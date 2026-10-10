import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Humanities Topic 5: Philosophy at the no-exceptions bar:
// metaphysics, epistemology, logic, ethics, political philosophy,
// African philosophy, philosophy of religion, aesthetics.

const PHI_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What philosophy is — the questioning discipline" },
  { type: "definition", term: "Philosophy", text: "Rational, CRITICAL inquiry into the most fundamental questions — existence, knowledge, value, meaning — pursued by argument alone, no lab required. The branches: METAPHYSICS (what exists), EPISTEMOLOGY (what we can know), ETHICS (what we ought to do), LOGIC (what follows from what), AESTHETICS (what is beautiful). Other subjects answer questions; philosophy first questions the QUESTIONS." },
  { type: "example", text: "Worked: biology asks how vision works; philosophy asks what JUSTIFIES saying we know anything at all. 'Define philosophy' = rational, critical inquiry + the branches, listed. The questioning of assumptions — not the love of opinions — is the mark." },
  { type: "heading", level: 2, text: "2. Metaphysics — what exists" },
  { type: "paragraph", text: "Metaphysics asks what is REAL: MATERIALISM (only matter exists) vs IDEALISM (mind or ideas are primary — Berkeley). FREE WILL vs DETERMINISM: are choices free or caused by prior events? MIND-BODY: dualism (Descartes — two substances, mental and physical) vs physicalism (one substance). The exam wants a POSITION defended by argument, not just named." },
  { type: "example", text: "Worked: every choice has a prior cause (genes, upbringing, brain state) — so was the choice free? The determinist says no; the compatibilist redefines freedom as acting on your own desires without coercion. The free-will question is answered by DEFINING terms first — that move is the mark." },
  { type: "heading", level: 2, text: "3. Epistemology — what we can know" },
  { type: "definition", term: "Knowledge", text: "Classically, knowledge is JUSTIFIED TRUE belief — all three, not two: believe it, it is true, AND you can justify it (Gettier-style cases show justified true belief can still fail knowledge). RATIONALISM (Descartes, Plato): reason is the source — certainty from thought alone. EMPIRICISM (Locke, Hume): sense experience is the source — the mind starts as a blank sheet. SCEPTICISM doubts that knowledge is possible at all." },
  { type: "example", text: "Worked: you believe it will rain, it rains, and you based it on the forecast — justified true belief. But a stopped clock reads the right time by accident: true belief, no knowledge — the Gettier challenge. Rationalism vs empiricism is answered by naming the SOURCE of justification — that is the mark." },
  { type: "heading", level: 2, text: "4. Logic — the test of arguments" },
  { type: "definition", term: "Deductive and inductive", text: "DEDUCTION: if the premises are true the conclusion NECESSARILY follows (the syllogism: all men are mortal; Socrates is a man; so Socrates is mortal). INDUCTION: generalising from cases — probable, never certain. VALIDITY is about STRUCTURE (does it follow?); SOUNDNESS = valid AND true premises. Fallacies: ad hominem (attack the person), straw man (misstate the view), false dilemma (two options only), appeal to authority, begging the question." },
  { type: "example", text: "Worked: 'all fish fly; Nemo is a fish; so Nemo flies' — VALID structure, UNSOUND argument (false premise): the conclusion follows but nothing supports it. Valid ≠ sound is the distinction; attacking the speaker instead of the argument is ad hominem — the two most-tested logic points." },
  { type: "heading", level: 2, text: "5. Ethics — the test of right action" },
  { type: "table", headers: ["Theory", "Right action is...", "Key name", "Weakness the exam names"], rows: [["Utilitarianism", "Whatever maximises total happiness — outcome decides", "Bentham, Mill", "Justifies injustice to a minority"], ["Deontology", "Whatever DUTY commands — rules, not outcomes", "Kant", "Rigidity when duties collide"], ["Virtue ethics", "What a person of good CHARACTER would do", "Aristotle", "Vague guidance"], ["Relativism", "What the culture approves", "—", "Cannot condemn reformers or atrocities"]] },
  { type: "paragraph", text: "Kant's categorical imperative: act only on rules you could will UNIVERSALLY, and treat persons as ENDS, never merely as MEANS. Utilitarianism judges the OUTCOME (the greatest good for the greatest number); deontology judges the RULE; virtue ethics judges the CHARACTER. The lying-to-save-a-life case: the utilitarian lies (outcome), the Kantian cannot (duty) — run the case through both." },
  { type: "heading", level: 2, text: "6. Political philosophy — the social contract" },
  { type: "paragraph", text: "Why obey the state? The CONTRACT tradition: HOBBES — without the state, life is a war of all against all; trade liberty for ORDER (a strong sovereign). LOCKE — the state exists to protect natural rights (life, liberty, property); break the contract and resistance is justified. ROUSSEAU — the GENERAL WILL: legitimate law is what the people as a whole would will. RAWLS (modern): justice is what you would choose behind a VEIL OF IGNORANCE — not knowing your own place in society." },
  { type: "example", text: "Worked: Rawls asks you to design society blind to your own wealth, sex, and talent — you would insure the worst-off, because you might be them. The veil of ignorance is the exam's favourite modern device: design rules BEFORE you know your position." },
  { type: "heading", level: 2, text: "7. African philosophy — Ubuntu and its critics" },
  { type: "paragraph", text: "UBUNTU: 'I am because we are' — personhood is COMMUNAL, forged in relationship; duties to the community precede individual rights. Ethnophilosophy (the communal worldview of a people) vs the SAGE and CRITICAL traditions (individual reasoned reflection — Oruka). The debate: is African philosophy the shared worldview or individual critical work — the exam wants both sides stated." },
  { type: "example", text: "Worked: under Ubuntu, an individual's achievement belongs to the community that made them — personhood is relational, not solitary. The critic replies: communalism can silence individual dissent. State the tradition AND the objection — the balanced answer is the mark." },
  { type: "heading", level: 2, text: "8. Philosophy of religion — the arguments and the problem" },
  { type: "table", headers: ["Argument", "Form", "Classic objection"], rows: [["Ontological (Anselm)", "A perfect being must exist — existence is a perfection", "Existence is not a predicate"], ["Cosmological", "Everything has a cause; there must be a FIRST cause", "What caused the first cause?"], ["Teleological (design)", "Order implies a designer", "Evolution explains apparent design"], ["Problem of evil", "Against: a good, all-powerful God and evil coexist", "Free-will defence replies — the classic debate"]] },
  { type: "paragraph", text: "The PROBLEM OF EVIL is the classic challenge: if God is good AND all-powerful, why evil? Replies: evil is the price of FREE WILL, or soul-making. FAITH and REASON: fideism (faith above reason) vs natural theology (reason supports faith). The exam wants the argument's FORM and the named objection — never just positions." },
  { type: "heading", level: 2, text: "9. Aesthetics — what is beauty" },
  { type: "paragraph", text: "Aesthetics asks whether beauty is OBJECTIVE (a property of things) or SUBJECTIVE (in the eye of the beholder), and what justifies artistic judgement. Art for art's sake vs art as moral instruction. The exam wants the question stated and a position argued — one paragraph of reasoning, not a verdict alone." },
  { type: "heading", level: 2, text: "10. Summary — the philosophy spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Definition", "Rational critical inquiry + branches", "Philosophy questions the questions"], ["Knowledge", "Justified TRUE belief — three parts", "The Gettier gap"], ["Logic", "Valid ≠ sound — structure then truth", "Ad hominem attacks the person"], ["Ethics", "Run the case through BOTH theories", "Outcome vs duty vs character"], ["Contract", "Hobbes order, Locke rights, Rousseau will", "Rawls: the veil, before your position is known"], ["Philosophy of religion", "Argument + named objection", "Evil vs free-will defence"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = the argument's form, premise by premise; 'critically assess' = the argument AND the strongest objection; 'distinguish' = both items, the difference on each line. Philosophy papers pay for ARGUMENT and OBJECTION — a position without reasons earns half." },
];

const PHI_QS: Q[] = [
  { q: "The branches of philosophy include", o: ["metaphysics, epistemology, ethics, logic", "physics, chemistry, biology", "history, geography, economics", "law, medicine, engineering"], a: "metaphysics, epistemology, ethics, logic", e: "What exists, what we can know, what we ought to do, what follows.", d: "easy" },
  { q: "Knowledge, classically, is", o: ["true belief", "justified TRUE belief — all three parts", "strong feeling", "sense experience alone"], a: "justified TRUE belief — all three parts", e: "Belief + truth + justification — and the Gettier gap is the follow-up.", d: "medium" },
  { q: "Empiricism holds that knowledge comes from", o: ["reason alone", "sense experience", "revelation", "authority"], a: "sense experience", e: "Locke and Hume: the mind starts blank; rationalism says reason.", d: "easy" },
  { q: "'All fish fly; Nemo is a fish; so Nemo flies' is", o: ["sound but invalid", "valid but unsound — false premise", "inductive", "circular"], a: "valid but unsound — false premise", e: "The conclusion follows (valid) but nothing supports it (unsound).", d: "medium" },
  { q: "Kant's categorical imperative commands that you", o: ["maximise happiness", "act only on rules you could will universally — persons as ends, never means", "follow your culture", "seek pleasure"], a: "act only on rules you could will universally — persons as ends, never means", e: "Deontology: duty and universality, not outcomes.", d: "medium" },
  { q: "The utilitarian judges an action by", o: ["its rule", "its outcome — the greatest good for the greatest number", "the agent's character", "its motive"], a: "its outcome — the greatest good for the greatest number", e: "Bentham and Mill: consequences decide.", d: "easy" },
  { q: "Rawls's veil of ignorance asks you to", o: ["obey the sovereign", "design justice before knowing your own place in society", "follow tradition", "maximise your own good"], a: "design justice before knowing your own place in society", e: "Blind to your wealth and talent, you would insure the worst-off.", d: "medium" },
  { q: "Ubuntu holds that personhood is", o: ["solitary and self-made", "communal — 'I am because we are'", "fixed at birth", "earned by wealth"], a: "communal — 'I am because we are'", e: "Personhood forged in relationship — with the critical objection noted.", d: "easy" },
  { q: "The problem of evil challenges", o: ["the cosmological argument", "a God who is both good and all-powerful coexisting with evil", "empiricism", "utilitarianism"], a: "a God who is both good and all-powerful coexisting with evil", e: "The classic challenge; the free-will defence is the classic reply.", d: "medium" },
  { q: "Attacking the speaker instead of the argument is", o: ["a straw man", "ad hominem", "begging the question", "a false dilemma"], a: "ad hominem", e: "Straw man misstates the view; ad hominem attacks the person.", d: "medium" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "philosophy" } });
    if (!topic) throw new Error("master philosophy topic missing");
    const lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) throw new Error("philosophy standard lesson missing");
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Philosophy — Complete", content: { blocks: PHI_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < PHI_QS.length; i++) {
      const item = PHI_QS[i];
      await prisma.question.upsert({
        where: { id: `master-philosophy-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-philosophy-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "philosophy-rebuild", blocks: PHI_BLOCKS.length, questions: PHI_QS.length });
  } catch (e) {
    console.error("rebuild philosophy failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
