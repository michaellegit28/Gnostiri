import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Computing & ICT Topic 5: AI & Emerging Tech at the no-exceptions bar:
// what AI is, machine learning paradigms, the ML pipeline, evaluation and overfitting,
// neural networks, ethics and bias, IoT/cloud/blockchain/quantum, agents and LLMs.

const AI_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What AI is — and what it is not" },
  { type: "definition", term: "Artificial intelligence", text: "AI = systems performing tasks that normally need HUMAN intelligence: perceiving, reasoning, learning, deciding, language. NARROW AI does ONE domain well (spam filters, chess engines, translation) — every AI in daily use today. GENERAL AI would match human ability ACROSS domains — it does not exist. The exam's trap: today's systems are narrow, however impressive; 'it is just statistics' is also wrong — it is pattern learning at scale." },
  { type: "example", text: "Worked: a face-unlock system recognises faces (narrow, vision only); it cannot write an essay or drive a car. Chatbots sound general but predict text — narrow, with a wide surface. 'State whether this is narrow or general AI and why' — the domain-bound answer is the mark." },
  { type: "heading", level: 2, text: "2. Machine learning — learn patterns from data" },
  { type: "definition", term: "Machine learning", text: "Classical programming: RULES + DATA → ANSWERS. Machine learning: DATA + ANSWERS → RULES (the model). Paradigms: SUPERVISED (labelled examples — classification: spam or not; regression: a price), UNSUPERVISED (no labels — find structure: customer CLUSTERS), REINFORCEMENT (actions with REWARDS — game agents, robotics). The paradigm question: 'does the training data carry labels?' decides everything." },
  { type: "example", text: "Worked: 10,000 labelled emails (spam/not-spam) → supervised classification. Unlabelled purchase histories grouped into segments → unsupervised clustering. A robot rewarded for staying upright → reinforcement. Name the paradigm from the data description — labels present or not is the fork." },
  { type: "heading", level: 2, text: "3. The ML pipeline — data in, decisions out" },
  { type: "diagram", diagramId: "ml-pipeline", caption: "Collect, clean, train, evaluate, deploy, monitor — the loop that ships a model" },
  { type: "definition", term: "Pipeline", text: "COLLECT data → CLEAN it (missing, wrong, duplicated values) → engineer FEATURES (the inputs the model uses) → TRAIN (fit the model on a TRAINING split) → EVALUATE (score it on a HELD-OUT TEST split it never saw) → DEPLOY → MONITOR (retrain when the world drifts). Data quality dominates: garbage in, garbage out — the model can only be as good as its data." },
  { type: "example", text: "Worked: predicting exam scores from study hours — 80% of rows train the model, 20% held back for testing; testing on TRAINING data inflates the score (it memorised) — the held-out split is the honesty check. 'Why split the data?' — to measure performance on UNSEEN examples; that is the mark." },
  { type: "heading", level: 2, text: "4. Overfitting — memorising is not learning" },
  { type: "definition", term: "Overfitting", text: "OVERFITTING: the model learns the training data's NOISE — perfect on training examples, poor on new ones (memorised, not generalised). UNDERFITTING: too simple to capture the pattern at all — poor everywhere. Fixes for overfitting: more data, simpler model, regularisation, early stopping. The symptom pair (high train score, low test score) is the exam's signature." },
  { type: "example", text: "Worked: 98% accuracy on training data, 61% on the test set — overfitted: it memorised the training set's quirks. 55% on both — underfitted: the model is too crude. Diagnose from the TWO numbers; one number alone cannot distinguish the failure modes." },
  { type: "heading", level: 2, text: "5. Neural networks — layers, weights, learning" },
  { type: "paragraph", text: "A neural network layers simple units: each connection has a WEIGHT, each unit sums its weighted inputs and applies an ACTIVATION. Training adjusts the weights to reduce error (backpropagation + gradient descent — 'nudge weights downhill'). DEEP learning = many layers, excelling at vision, speech and language; the cost is data and compute hunger, and the model's reasoning is hard to inspect (black box)." },
  { type: "example", text: "Worked: handwriting recognition — the first layers detect strokes, deeper layers assemble shapes into letters. No layer is 'programmed' — weights start random and are tuned by examples. 'Explain how the network learns' = adjust weights to reduce error, repeatedly — the mechanics in one line is the mark." },
  { type: "heading", level: 2, text: "6. Ethics and bias — the model inherits the data" },
  { type: "table", headers: ["Issue", "Cause", "Exam response"], rows: [["Bias", "Unrepresentative or historical data", "The model repeats the data's unfairness — audit and diversify data"], ["Privacy", "Training on personal data", "Consent, anonymisation, data minimisation"], ["Accountability", "Opaque decisions", "Explainability, human oversight for high-stakes calls"], ["Hallucination", "Generative models predict plausible text", "Verify outputs; confidence is not truth"]] },
  { type: "paragraph", text: "The core principle: a model is only as fair as its data. A hiring model trained on a biased history learns the bias — technology does not neutralise it automatically. High-stakes decisions (loans, hiring, medicine) need HUMAN oversight; generative models state falsehoods fluently — verification is never optional." },
  { type: "heading", level: 2, text: "7. Emerging tech — IoT, cloud, blockchain, quantum" },
  { type: "table", headers: ["Technology", "What it is", "Honest maturity"], rows: [["IoT", "Everyday objects with sensors + connectivity, streaming data", "Live — smart meters, trackers; security is the weak link"], ["Cloud", "Computing rented on demand (storage, servers, AI services)", "Live — pay per use, scales; dependency and privacy trade-offs"], ["Blockchain", "Append-only distributed ledger, consensus instead of a central party", "Live for crypto; enterprise uses narrower than the hype"], ["Quantum computing", "Qubits exploit superposition for certain problems", "Experimental — real for research, not yet everyday"]] },
  { type: "example", text: "Worked: a smart farm — soil sensors (IoT) stream to the cloud, models schedule irrigation. The exam wants the DEFINITION matched to the application AND the risk named: IoT devices are notoriously insecure endpoints; cloud shifts control to a provider; blockchain's guarantee is tamper-EVIDENCE, not truth of what was recorded." },
  { type: "heading", level: 2, text: "8. Agents and LLMs — prediction, not understanding" },
  { type: "paragraph", text: "A LARGE LANGUAGE MODEL predicts the next TOKEN from a prompt, trained on vast text — fluency, not comprehension. AGENTS wrap an LLM with tools and goals: plan → act (search, code, call APIs) → observe → repeat. Limits: hallucination (confident falsehoods), knowledge cut-offs, prompt injection (malicious instructions smuggled in data). The discipline: verify outputs, keep humans on the loop for consequential actions." },
  { type: "example", text: "Worked: an agent asked to 'book the cheapest flight' plans, queries an API, compares, acts — every consequential step needs a guardrail because the model optimises the LETTER of the goal. 'How does an LLM differ from a search engine?' — it generates text from patterns; it does not look up documents (though agents can). The prediction framing is the mark." },
  { type: "heading", level: 2, text: "9. Summary — the AI & emerging tech spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Classify the AI", "Narrow (all today) vs general (none)", "Impressive ≠ general"], ["Pick the paradigm", "Labels? supervised; no labels? unsupervised; rewards? reinforcement", "Regression predicts quantities, classification categories"], ["Explain the split", "Test on UNSEEN data", "Testing on training data inflates the score"], ["Diagnose the model", "Train score vs test score together", "Overfit: memorised noise; underfit: too simple"], ["Ethics", "Bias flows from data; oversight for stakes", "Confident output is not true output"], ["Emerging tech", "Definition + application + risk", "Blockchain is tamper-evident, not truthful"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'explain' = mechanism in one causal line; 'discuss the ethical concerns' = issue + cause + mitigation, not a slogan list; 'justify' = the evidence from the scenario (labels, scores, stakes). AI papers pay for the REASONING from data to conclusion — buzzwords without the mechanism earn nothing." },
];

const AI_QS: Q[] = [
  { q: "Every AI system in daily use today is", o: ["general AI", "narrow AI — one domain, however broad it looks", "conscious", "self-aware"], a: "narrow AI — one domain, however broad it looks", e: "General AI does not exist; impressive surface, single domain.", d: "easy" },
  { q: "Training on 10,000 emails labelled spam or not-spam is", o: ["unsupervised learning", "supervised learning — labelled examples", "reinforcement learning", "search"], a: "supervised learning — labelled examples", e: "Labels present → supervised; the task is classification.", d: "easy" },
  { q: "Clustering customers with NO labels is", o: ["supervised", "unsupervised learning", "reinforcement", "overfitting"], a: "unsupervised learning", e: "No labels — the algorithm finds structure itself.", d: "easy" },
  { q: "The purpose of a held-out test set is to", o: ["speed up training", "measure performance on UNSEEN data", "increase accuracy", "reduce storage"], a: "measure performance on UNSEEN data", e: "Testing on training data rewards memorisation, not learning.", d: "medium" },
  { q: "98% on training data, 61% on test data indicates", o: ["underfitting", "overfitting — memorised the training noise", "perfect generalisation", "bad data only"], a: "overfitting — memorised the training noise", e: "The gap between the two scores is the signature.", d: "medium" },
  { q: "A hiring model trained on biased historical decisions will", o: ["self-correct the bias", "inherit and repeat the bias", "ignore the bias with enough data", "become general AI"], a: "inherit and repeat the bias", e: "The model learns the data's patterns — including unfair ones.", d: "medium" },
  { q: "In a neural network, learning happens by", o: ["copying rules from programmers", "adjusting connection weights to reduce error", "adding more RAM", "sorting the training data"], a: "adjusting connection weights to reduce error", e: "Backpropagation nudges weights downhill on the error.", d: "medium" },
  { q: "An LLM generates an answer by", o: ["looking up the exact document", "predicting the next token from learned patterns", "querying a database", "proving the answer logically"], a: "predicting the next token from learned patterns", e: "Fluent generation, not retrieval or proof — verify outputs.", d: "medium" },
  { q: "Blockchain's core guarantee is", o: ["the recorded data is true", "records are tamper-EVIDENT once written", "data is encrypted", "it replaces databases"], a: "records are tamper-EVIDENT once written", e: "Alteration is detectable — truth of input is a separate question.", d: "hard" },
  { q: "The weakest link in IoT deployments is usually", o: ["sensor accuracy", "device security — many insecure endpoints", "cloud pricing", "cabling"], a: "device security — many insecure endpoints", e: "Cheap devices, default passwords, unpatched firmware.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "ai-emerging-tech" } });
    if (!topic) throw new Error("master ai-emerging-tech topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "AI & Emerging Tech — Complete", content: { blocks: AI_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < AI_QS.length; i++) {
      const item = AI_QS[i];
      await prisma.question.upsert({
        where: { id: `master-aitech-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-aitech-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "aitech-rebuild", blocks: AI_BLOCKS.length, questions: AI_QS.length });
  } catch (e) {
    console.error("rebuild aitech failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
