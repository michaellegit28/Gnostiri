import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Computing & ICT Topic 2: Data Structures & Algorithms at the no-exceptions bar:
// arrays, stacks, queues, linked lists, trees, graphs, hash tables, searching, sorting, Big-O.

const DSA_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. Data structures — organise for the operations you need" },
  { type: "definition", term: "Data structure", text: "A way of ORGANISING data so the operations you need are fast. The choice question is always: which operations dominate — access by position? insert/remove often? search by key? There is no best structure, only the right one for the access pattern. An ALGORITHM is the step-by-step procedure; complexity measures how it SCALES." },
  { type: "example", text: "Worked: an undo feature needs last-in-first-out → stack. A printer queue needs first-in-first-out → queue. A dictionary lookup by word → hash table. Name the operation pattern, then the structure — that pairing is the mark." },
  { type: "heading", level: 2, text: "2. Arrays — index addressing" },
  { type: "definition", term: "Array", text: "Elements in CONTIGUOUS memory, addressed by INDEX (0-based in most languages). Access by index: O(1) — direct address arithmetic. Insert/delete in the middle: O(n) — every later element shifts. 2D arrays address as [row][col], stored row by row. Fixed size in many languages — overflow is a design failure, not a surprise." },
  { type: "example", text: "Worked: scores[4] reads the 5th element instantly (one address computation). Inserting at position 0 of a 1,000-element array moves 1,000 elements. Random access → array; frequent middle inserts → linked list. The trade-off IS the answer." },
  { type: "heading", level: 2, text: "3. Stacks and queues — the two disciplines" },
  { type: "definition", term: "Stack and queue", text: "STACK: LIFO — push adds to the top, pop removes from the top (call stack, undo, expression evaluation, backtracking). QUEUE: FIFO — enqueue at the rear, dequeue from the front (printers, task scheduling, breadth-first search). Both are ABSTRACT types: any underlying storage that keeps the discipline qualifies." },
  { type: "example", text: "Worked: push A, B, C then pop twice → C then B (reverse order of arrival). Enqueue A, B, C then dequeue twice → A then B (arrival order). The order question is the exam's staple: stack REVERSES, queue PRESERVES." },
  { type: "heading", level: 2, text: "4. Linked lists — nodes and pointers" },
  { type: "paragraph", text: "Each NODE holds data + a POINTER to the next node; the head anchors the chain; the last points to null. Insert at head: O(1) — rewire two pointers, no shifting. Search: O(n) — must walk the chain; no random access (unlike arrays). Doubly linked adds a prev pointer; a circular list links the tail back to the head. The trade-off: arrays win on access, lists win on insert/delete without shifting." },
  { type: "heading", level: 2, text: "5. Trees and graphs — hierarchy and networks" },
  { type: "definition", term: "Tree and graph", text: "TREE: hierarchical nodes — one root, no cycles. BINARY SEARCH TREE: left descendants are smaller, right descendants larger — lookup, insert, delete all O(log n) when balanced (degrades to O(n) if it becomes a linked chain). GRAPH: VERTICES joined by EDGES — directed/undirected, weighted/unweighted; models maps, networks, dependencies. Traversal: BFS (level by level, uses a QUEUE) vs DFS (deep first, uses a STACK or recursion)." },
  { type: "example", text: "Worked: find 7 in a balanced BST of 1..15 — compare at root 8 (go left), then 4 (go right), then 6 (go right), found: 3 comparisons for 15 elements — that halving IS O(log n). Shortest unweighted path → BFS; explore all dependencies deeply → DFS. Structure + traversal matched to the job." },
  { type: "heading", level: 2, text: "6. Hash tables — key to bucket" },
  { type: "definition", term: "Hash table", text: "A HASH FUNCTION maps a key to a bucket index: average O(1) insert, lookup, delete. COLLISIONS (two keys, one bucket) are handled by CHAINING (a list per bucket) or OPEN ADDRESSING (probe the next free slot). Worst case degrades to O(n) when everything collides — the load factor (entries ÷ buckets) is kept low by resizing." },
  { type: "example", text: "Worked: 'obi' hashes to bucket 11, stored there in O(1). 'ada' also hashes to 11 → chaining appends it to bucket 11's list; lookups in that bucket now scan the chain. The hash function's QUALITY decides the speed — that is why 'design a good hash' questions exist." },
  { type: "heading", level: 2, text: "7. Searching — linear vs binary" },
  { type: "definition", term: "Binary search", text: "LINEAR search: check each element in turn — O(n), works on ANY list. BINARY search: check the MIDDLE, discard half, repeat — O(log n), but ONLY on a SORTED list (the trap: applying it to unsorted data silently returns wrong answers). One million sorted elements: linear up to 1,000,000 comparisons; binary about 20 — the halving is the whole story." },
  { type: "example", text: "Worked: find 42 in [3, 8, 15, 42, 67] — middle 15 (go right), middle 42 — found in 2 comparisons. The list MUST be sorted; sorting costs O(n log n), so for ONE search linear is cheaper — binary pays off on repeated searches. Name the precondition; it is the marked line." },
  { type: "heading", level: 2, text: "8. Sorting — the growth families" },
  { type: "table", headers: ["Algorithm", "Complexity", "Character"], rows: [["Bubble sort", "O(n²)", "Swap neighbours; simple, slow, easy to trace"], ["Merge sort", "O(n log n)", "Divide, sort halves, merge — predictable, stable"], ["Quick sort", "O(n log n) average, O(n²) worst", "Partition around a pivot; fast in practice, bad pivots hurt"]] },
  { type: "example", text: "Worked: bubble on [5, 3, 8, 1] — pass 1: 3,5,1,8; pass 2: 3,1,5,8; pass 3: 1,3,5,8 — three passes, n−1 worst case each: O(n²). Merge halves the work each level (log n levels × n merge work). The exam wants the COMPLEXITY CLASS matched to the algorithm, and bubble traced by hand." },
  { type: "heading", level: 2, text: "9. Big-O — how it scales, not how fast it runs" },
  { type: "definition", term: "Big-O", text: "Big-O gives the GROWTH RATE as input size n rises, ignoring constants and small terms: O(1) constant, O(log n) halving, O(n) linear, O(n log n) good sorts, O(n²) nested loops, O(2ⁿ) brute-force subsets. The trap: Big-O says NOTHING about machine speed or constant factors — an O(n²) on ten items beats an O(n) on ten million. Nested loops over n multiply: n × n = O(n²)." },
  { type: "diagram", diagramId: "bigo-curves", caption: "O(1), O(log n), O(n), O(n log n), O(n squared) — how work grows with input" },
  { type: "example", text: "Worked: for i in n { for j in n { work } } → n² operations: at n = 1,000 that is a million — the nested loop is the visual signature. Halving the search space each step is log n. 'What is the complexity of...' is answered by counting the LOOPS, not the lines." },
  { type: "heading", level: 2, text: "10. Summary — the DS&A spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Choose a structure", "Dominant operation decides", "No universal best — match the access pattern"], ["Stack vs queue", "LIFO reverses; FIFO preserves", "Pop order vs dequeue order"], ["Binary search", "Halve — but ONLY sorted data", "Silently wrong on unsorted input"], ["Hash tables", "Hash to bucket; chain or probe collisions", "Worst case O(n) — average is the O(1)"], ["Complexity", "Count the loops; halving = log", "Constants and machine speed are NOT Big-O"], ["Traversal", "BFS queue, level order; DFS stack, deep", "Match traversal to the question asked"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'state the complexity' = the class, no derivation needed; 'justify' = the growth-rate reason (halving, nesting); 'show' = trace the algorithm on the GIVEN data, every pass written down. DS&A papers pay for the SCALING argument — a number without the growth reason earns half." },
];

const DSA_QS: Q[] = [
  { q: "A stack processes elements in which order?", o: ["first in, first out", "last in, first out", "sorted order", "random order"], a: "last in, first out", e: "Push/pop at the top — undo and the call stack.", d: "easy" },
  { q: "Accessing the i-th element of an array is", o: ["O(1) — direct index addressing", "O(n)", "O(log n)", "O(n²)"], a: "O(1) — direct index addressing", e: "Contiguous memory: address = base + i × size.", d: "easy" },
  { q: "Binary search requires that the list is", o: ["short", "sorted", "unique", "numeric"], a: "sorted", e: "Halving assumes order — unsorted input returns wrong answers silently.", d: "easy" },
  { q: "for i in n { for j in n { work } } has complexity", o: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], a: "O(n²)", e: "Nested loops multiply: n × n.", d: "medium" },
  { q: "In a binary search tree, values smaller than a node go", o: ["to the right subtree", "to the left subtree", "to the root", "anywhere"], a: "to the left subtree", e: "Left smaller, right larger — that ordering makes lookup O(log n) balanced.", d: "easy" },
  { q: "Two keys hashing to the same bucket is", o: ["overflow", "a collision — handled by chaining or open addressing", "a syntax error", "rebalancing"], a: "a collision — handled by chaining or open addressing", e: "Chained list per bucket, or probe for the next free slot.", d: "medium" },
  { q: "Breadth-first search uses which auxiliary structure?", o: ["a stack", "a queue", "a hash table", "a heap only"], a: "a queue", e: "BFS explores level by level — FIFO; DFS uses a stack.", d: "medium" },
  { q: "Which sort repeatedly swaps adjacent out-of-order pairs?", o: ["merge sort", "bubble sort", "quick sort", "binary search"], a: "bubble sort", e: "O(n²), simple, hand-traceable.", d: "easy" },
  { q: "Linked lists beat arrays when the workload is", o: ["random access by index", "frequent insert/delete without shifting", "binary search", "fixed-size storage"], a: "frequent insert/delete without shifting", e: "Pointer rewiring is O(1) at the head; arrays shift O(n) elements.", d: "medium" },
  { q: "An O(n²) algorithm can beat an O(n) one in practice when", o: ["never — growth rate decides always", "n is very small — constants dominate tiny inputs", "the data is sorted", "the language is compiled"], a: "n is very small — constants dominate tiny inputs", e: "Big-O ignores constants; at n = 10 the 'worse' class can be faster.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "data-structures-algorithms" } });
    if (!topic) throw new Error("master data-structures-algorithms topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Data Structures & Algorithms — Complete", content: { blocks: DSA_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < DSA_QS.length; i++) {
      const item = DSA_QS[i];
      await prisma.question.upsert({
        where: { id: `master-dsa-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-dsa-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "dsa-rebuild", blocks: DSA_BLOCKS.length, questions: DSA_QS.length });
  } catch (e) {
    console.error("rebuild dsa failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
