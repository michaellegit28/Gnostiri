import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Computing & ICT Topic 1: Programming Fundamentals at the no-exceptions bar:
// variables and types, control flow, operators, functions, I/O, errors, pseudocode and traces.

const PROG_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What a program is — instructions plus data" },
  { type: "definition", term: "Program", text: "A program is a SEQUENCE of instructions operating on DATA to produce output. Source code is translated to machine instructions: a COMPILER translates the whole program before running (produces an executable — C, Java); an INTERPRETER translates and executes LINE BY LINE (Python, JavaScript). The exam wants the trade-off: compiled runs faster and reports all syntax errors up front; interpreted runs immediately and stops at the first error." },
  { type: "example", text: "Worked: input a temperature, compute the conversion, output the result — every program is INPUT → PROCESS → OUTPUT. Name the stage, not just the code: 'this line reads the input' is the PROCESSING pipeline, and exam questions ask you to identify it." },
  { type: "heading", level: 2, text: "2. Variables and data types" },
  { type: "definition", term: "Variable", text: "A named location in memory holding a VALUE that can change. Types: INTEGER (whole numbers), REAL/FLOAT (decimals), STRING (text in quotes), BOOLEAN (true/false), CHARACTER (single symbol). DECLARATION names it; ASSIGNMENT gives it a value (x ← 5 or x = 5). CONSTANTS hold values that must NOT change (pi) — the trap: overwriting a constant is a design error even when the language permits it." },
  { type: "example", text: "Worked: score ← 90 (integer), name ← 'Amina' (string), passed ← TRUE (boolean). '5' + 5 fails or coerces depending on the language: '5' is TEXT, 5 is a NUMBER — type mismatch is the classic runtime error. Declare the type you mean; convert explicitly (str(), int()) when mixing." },
  { type: "heading", level: 2, text: "3. Control flow — sequence, selection, iteration" },
  { type: "definition", term: "The three structures", text: "Every program is built from THREE structures: SEQUENCE (one statement after another), SELECTION (if / else if / else — or case/switch: choose a path by condition), ITERATION (repeat: COUNTED for-loops when the number of repeats is known; CONDITIONAL while-loops when it depends on a condition). A while loop may run ZERO times (condition false from the start); a repeat-until loop runs AT LEAST once — the classic distinction." },
  { type: "diagram", diagramId: "control-flow", caption: "Sequence, selection, iteration — the three structures every program is built from" },
  { type: "example", text: "Worked: print numbers 1 to 10 — counted loop (FOR i ← 1 TO 10). Keep asking for a password until correct — conditional loop (WHILE guess ≠ password). The condition is checked BEFORE the body in a while loop: if it fails first time, the body never runs. Say which loop and WHY — the justification is the mark." },
  { type: "heading", level: 2, text: "4. Operators and precedence" },
  { type: "table", headers: ["Family", "Operators", "Watch out"], rows: [["Arithmetic", "+ − * / MOD DIV", "MOD = remainder, DIV/integer division = whole part"], ["Comparison", "= ≠ less greater", "Comparison produces a BOOLEAN, not a number"], ["Logical", "AND, OR, NOT", "Precedence: NOT before AND before OR"]] },
  { type: "example", text: "Worked: 7 MOD 2 = 1 (remainder), 7 DIV 2 = 3 (whole part) — even/odd tests use MOD. x = 5 AND y = 3 OR z = 9 binds the AND first: (x=5 AND y=3) OR z=9. Precedence errors are logic errors — the program runs but answers wrongly, which is exactly why trace tables exist." },
  { type: "heading", level: 2, text: "5. Functions — parameters, returns, scope" },
  { type: "definition", term: "Function", text: "A named, reusable block: takes PARAMETERS in, RETURNS a value out. DECLARING defines it; CALLING runs it with arguments. SCOPE: variables made INSIDE a function are LOCAL (exist only during the call); variables made outside are GLOBAL (visible everywhere — and dangerous: any code can change them). Functions exist to DECOMPOSE problems and avoid repeating code — 'write a function to...' questions pay for the parameter list and the return." },
  { type: "example", text: "Worked: FUNCTION area(w, h) RETURN w * h — parameters w and h; the call area(4, 5) returns 20. A local total inside the function cannot be seen outside; a global total can — and a second function can silently corrupt it. Local by default is the discipline the exam rewards." },
  { type: "heading", level: 2, text: "6. Input, output and validation" },
  { type: "paragraph", text: "INPUT reads from the user (always arrives as TEXT in many languages — convert before arithmetic); OUTPUT writes results. VALIDATION checks the input is sensible BEFORE using it: range checks (age between 0 and 130), type checks, length checks, presence checks. Validation is NOT verification — it accepts plausible input; only checking against the SOURCE confirms truth. The exam's favourite loop: REPEAT input UNTIL valid." },
  { type: "example", text: "Worked: read marks until 0–100 is entered — presence check first (not empty), range check second (0–100), then process. Skipping validation lets mark = 999 corrupt the average: garbage in, garbage out. Name the check type — 'range check' is the phrase that earns the mark." },
  { type: "heading", level: 2, text: "7. Errors — the trio and how to hunt them" },
  { type: "table", headers: ["Error type", "Meaning", "When detected"], rows: [["Syntax", "Broken grammar — missing bracket, misspelt keyword", "Before running (compiler/interpreter refuses)"], ["Runtime", "Legal grammar, impossible action — divide by zero, bad index", "While running (program crashes)"], ["Logic", "Runs fine, wrong answer — wrong operator, off-by-one", "Only by testing — the hardest to find"]] },
  { type: "paragraph", text: "DEBUGGING tools: trace tables (hand-simulate variables line by line), breakpoints (pause and inspect), print/OUTPUT statements (watch values change). The exam wants the TYPE named from a code snippet AND the tool that would find it: wrong formula = logic error = trace table; misspelt keyword = syntax = translator flags it." },
  { type: "heading", level: 2, text: "8. Pseudocode and trace tables — the exam's working language" },
  { type: "paragraph", text: "Pseudocode is structured English: ← for assignment, OUTPUT for print, INPUT for read, WHILE/FOR/IF — no language syntax to memorise, but precision still counts. A TRACE TABLE records every variable's value after each pass: columns = variables, rows = iterations. Trace questions are free marks with discipline: copy values EXACTLY, one line per loop pass, and never skip the condition test that exits the loop." },
  { type: "example", text: "Worked: total ← 0; FOR i ← 1 TO 3: total ← total + i. Trace: i=1 total=1; i=2 total=3; i=3 total=6 — the loop accumulates 1+2+3. Off-by-one (starting total at 1, or running TO 4) shows up instantly in the trace — that is the tool's whole point." },
  { type: "heading", level: 2, text: "9. Summary — the programming spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Translate code", "Trace it — variable by variable", "Off-by-one at loop boundaries"], ["Choose the loop", "Counted = FOR; condition-dependent = WHILE", "WHILE may run zero times"], ["Spot the error", "Syntax: translator · runtime: crash · logic: wrong answer", "Logic errors pass silently"], ["Write a function", "Parameters IN, RETURN out, local scope", "Global variables invite corruption"], ["Validate input", "Presence, type, range — in order", "Validation accepts plausible, not true"], ["Explain choice", "Name the structure + the reason", "No reason, no mark"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'write pseudocode' = assignment arrows, INPUT/OUTPUT, one structure per line — no language syntax; 'trace' = a table, one row per iteration, values copied exactly; 'explain' = structure + reason in one sentence. Programming papers pay for the TRACE — a guessed output without the trace earns half." },
];

const PROG_QS: Q[] = [
  { q: "A translator that converts and executes line by line is a", o: ["compiler", "interpreter", "assembler", "linker"], a: "interpreter", e: "Compilers translate everything first; interpreters run line by line.", d: "easy" },
  { q: "The value stored in score ← 90 is best described as", o: ["a string", "an integer", "a boolean", "a constant"], a: "an integer", e: "Whole number, no quotes — integer. '90' in quotes would be text.", d: "easy" },
  { q: "A loop that may execute zero times is", o: ["repeat-until", "WHILE — the condition is tested before the body", "FOR", "nested loop"], a: "WHILE — the condition is tested before the body", e: "Repeat-until runs at least once; while may not run at all.", d: "medium" },
  { q: "7 MOD 2 evaluates to", o: ["3", "3.5", "1", "14"], a: "1", e: "MOD is the remainder; DIV would give the whole part 3.", d: "easy" },
  { q: "A variable declared inside a function is", o: ["global", "local — it exists only during that call", "constant", "a parameter"], a: "local — it exists only during that call", e: "Scope ends with the call; globals live everywhere — and risk corruption.", d: "medium" },
  { q: "The program runs without crashing but outputs the wrong average. This is", o: ["a syntax error", "a runtime error", "a logic error", "a hardware fault"], a: "a logic error", e: "Legal code, wrong answer — found by testing or a trace table.", d: "medium" },
  { q: "Rejecting an age of 999 before processing is", o: ["verification", "a range check", "a presence check", "encryption"], a: "a range check", e: "Plausibility bounds = range check; presence = not empty.", d: "easy" },
  { q: "total ← 0; FOR i ← 1 TO 4: total ← total + i. The final total is", o: ["4", "6", "10", "11"], a: "10", e: "1+2+3+4 — trace it row by row to be certain.", d: "medium" },
  { q: "The main reason for writing functions is", o: ["faster hardware", "decomposition and reuse — no repeated code", "they run in parallel", "they avoid syntax errors"], a: "decomposition and reuse — no repeated code", e: "Parameters in, return out, problems split into named parts.", d: "medium" },
  { q: "'5' + 5 in a strongly typed language most likely", o: ["gives 10", "gives '55' always", "raises a type error — text plus number", "gives 0"], a: "raises a type error — text plus number", e: "Quoted '5' is a string; convert explicitly before arithmetic.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "programming-fundamentals" } });
    if (!topic) throw new Error("master programming-fundamentals topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Programming Fundamentals — Complete", content: { blocks: PROG_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < PROG_QS.length; i++) {
      const item = PROG_QS[i];
      await prisma.question.upsert({
        where: { id: `master-programming-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-programming-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "programming-rebuild", blocks: PROG_BLOCKS.length, questions: PROG_QS.length });
  } catch (e) {
    console.error("rebuild programming failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
