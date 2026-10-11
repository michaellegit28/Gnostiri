import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type B = { type: string; level?: number; text?: string; term?: string; variant?: string; headers?: string[]; rows?: string[][]; diagramId?: string; caption?: string };
type Q = { q: string; o: string[]; a: string; e: string; d: string };

// DEEP REBUILD — Computing & ICT Topic 4: Databases at the no-exceptions bar:
// the relational model, keys and relationships, SQL (DDL/DML/joins/aggregation),
// normalisation, integrity and transactions, indexing.

const DB_BLOCKS: B[] = [
  { type: "heading", level: 2, text: "1. What a database is — and why not a spreadsheet" },
  { type: "definition", term: "Database", text: "A structured, PERSISTENT, SHARED collection of data managed by a DBMS. The DBMS enforces structure (schema), controls concurrent access (two users, no corruption), manages permissions, and backs up. FLAT FILE = one table, repeats data everywhere; RELATIONAL = many tables linked by keys, each fact stored ONCE. The move from flat file to relational is about removing redundancy — that is the whole story." },
  { type: "example", text: "Worked: a customer's address typed on every invoice row (flat file) — change it 500 times or watch inconsistency. In a relational DB the address lives once in Customers; invoices point at the customer by key. One fact, one place — the definition of the relational idea." },
  { type: "heading", level: 2, text: "2. The relational model — tables, keys, relationships" },
  { type: "definition", term: "Keys", text: "TABLE (relation) of ROWS (records) and COLUMNS (fields). PRIMARY KEY: the column that uniquely identifies each row (StudentID — never name, names collide). FOREIGN KEY: a column referencing another table's primary key — the link that joins tables. Relationships: 1:1, 1:M (one customer, many orders), M:N (students and subjects — resolved by a JUNCTION table holding both foreign keys)." },
  { type: "example", text: "Worked: Students(StudentID PK, name) and Subjects(SubjectID PK, title); M:N enrolment → Enrolments(StudentID FK, SubjectID FK). 'Why not store the subject name in Students?' — redundancy and update anomalies. Name the key, name the relationship type, name the junction — that trio is the mark." },
  { type: "heading", level: 2, text: "3. SQL — defining the structure (DDL)" },
  { type: "paragraph", text: "CREATE TABLE Students (StudentID INT PRIMARY KEY, Name VARCHAR(50) NOT NULL, ClassID INT REFERENCES Classes(ClassID)). Constraints are the schema's law: PRIMARY KEY (unique, never null), FOREIGN KEY (must match a parent row), NOT NULL, UNIQUE, CHECK (a condition like marks BETWEEN 0 AND 100). The exam reads/writes short DDL — know that constraints live IN the table definition, not in the app." },
  { type: "heading", level: 2, text: "4. SQL — querying and changing data (DML)" },
  { type: "definition", term: "SELECT", text: "SELECT columns FROM table WHERE condition ORDER BY column — the query spine. INSERT INTO adds rows, UPDATE ... SET ... WHERE changes matching rows, DELETE FROM ... WHERE removes them (omit WHERE and you change EVERYTHING — the classic disaster). Comparison: = ≠ less greater; BETWEEN, IN, LIKE for patterns; AND/OR/NOT combine conditions." },
  { type: "example", text: "Worked: SELECT Name, Score FROM Results WHERE Score ≥ 50 ORDER BY Score DESC — names of everyone who passed, best first. UPDATE Results SET Score = 65 WHERE StudentID = 12 — the WHERE clause IS the safety catch: forget it and every row becomes 65." },
  { type: "heading", level: 2, text: "5. Joins — combining tables" },
  { type: "definition", term: "JOIN", text: "INNER JOIN returns only rows that MATCH in both tables; LEFT JOIN returns all rows of the left table plus matches (NULL where none). The trap: an INNER JOIN silently drops customers with no orders — if the question says 'ALL customers, with orders if any', that is a LEFT JOIN. Join on the foreign key: FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID." },
  { type: "example", text: "Worked: 100 customers, 80 have orders. INNER JOIN → 80 rows; LEFT JOIN → 100 rows (20 with NULL order columns). 'List all customers and any orders' — the ALL is the keyword that demands LEFT. Read the question's quantifier before choosing the join." },
  { type: "heading", level: 2, text: "6. Aggregation — GROUP BY and the HAVING trap" },
  { type: "definition", term: "Aggregation", text: "COUNT, SUM, AVG, MIN, MAX collapse many rows into one answer. GROUP BY department produces one row per department; WHERE filters ROWS before grouping, HAVING filters GROUPS after aggregation. SELECT department, AVG(salary) FROM staff GROUP BY department HAVING AVG(salary) is greater than 50000 — HAVING because the condition uses the aggregate, WHERE cannot." },
  { type: "example", text: "Worked: 'departments with more than 5 staff' — WHERE COUNT(*) fails (aggregates do not exist yet); GROUP BY department HAVING COUNT(*) is greater than 5 succeeds. The order of execution: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Say which clause and why — the HAVING rule is the exam's favourite SQL mark." },
  { type: "heading", level: 2, text: "7. Normalisation — 1NF, 2NF, 3NF" },
  { type: "definition", term: "Normal forms", text: "1NF: every cell ATOMIC (one value — no comma lists). 2NF: 1NF + no PARTIAL dependency — a non-key column must depend on the WHOLE composite key. 3NF: 2NF + no TRANSITIVE dependency — non-key columns must not depend on other non-key columns. Purpose: kill the UPDATE, INSERT and DELETE ANOMALIES — every fact stored once." },
  { type: "diagram", diagramId: "normal-forms", caption: "1NF atomic cells, 2NF whole-key dependency, 3NF no transitive chains" },
  { type: "example", text: "Worked: Orders(OrderID, ProductID, ProductName, Qty) — ProductName depends only on ProductID, not the whole key (partial) → 2NF violation: split Products(ProductID, ProductName). Then if Products also stored SupplierName with SupplierCity — City depends on Supplier (transitive) → 3NF violation: split Suppliers. Identify the DEPENDENCY first, split second — the dependency named is the mark." },
  { type: "heading", level: 2, text: "8. Integrity and transactions — ACID" },
  { type: "definition", term: "Integrity and ACID", text: "ENTITY integrity: every row has a unique, non-null primary key. REFERENTIAL integrity: every foreign key points to an EXISTING parent row (no orphan orders). TRANSACTION: a unit of work that is ATOMIC (all or nothing), CONSISTENT (rules hold), ISOLATED (concurrent transactions do not trample), DURABLE (committed means survives crashes). The bank transfer is the canonical case: debit + credit must both happen or neither." },
  { type: "example", text: "Worked: transfer 500 from A to B — debit A, credit B inside ONE transaction: a crash between the two steps rolls back both (atomicity). An order pointing at a deleted customer breaks referential integrity — the FK constraint blocks the delete (or cascades, by explicit choice). Name the property; the transfer story is the mark." },
  { type: "heading", level: 2, text: "9. Indexing — the read/write trade-off" },
  { type: "paragraph", text: "An INDEX is a lookup structure (like a book index) over one or more columns: searches on indexed columns jump from full-table scans O(n) to near O(log n). Cost: indexes take SPACE and SLOW every INSERT/UPDATE/DELETE (each must maintain the index). Index the columns you SEARCH and JOIN on; leave rarely-queried columns alone. 'Why not index everything?' — the write penalty is the answer." },
  { type: "heading", level: 2, text: "10. Summary — the databases spine" },
  { type: "table", headers: ["Question type", "Method beat", "Trap"], rows: [["Design", "Entities, keys, relationship types", "Names are not keys — uniqueness is"], ["SQL query", "SELECT-FROM-WHERE-ORDER BY", "Missing WHERE on UPDATE/DELETE"], ["Joins", "INNER matches only; LEFT keeps all left rows", "'ALL customers' demands LEFT"], ["Aggregation", "WHERE before grouping, HAVING after", "HAVING is for aggregates only"], ["Normalisation", "Name the dependency, then split", "1NF lists, 2NF partial, 3NF transitive"], ["Integrity", "PK unique/not null; FK matches a parent", "Cascade deletes are a CHOICE, not a default"]] },
  { type: "callout", variant: "info", text: "Command discipline: 'write SQL' = correct clauses in order, keywords in caps, conditions explicit; 'explain' = the anomaly or the integrity rule being prevented; 'normalise to 3NF' = state the dependency that forces each split. Database papers pay for the DEPENDENCY and the CONSTRAINT — a table without keys earns nothing." },
];

const DB_QS: Q[] = [
  { q: "A primary key must be", o: ["a number", "unique and never null", "the first column", "a name"], a: "unique and never null", e: "Entity integrity — uniqueness identifies the row.", d: "easy" },
  { q: "A foreign key is a column that", o: ["encrypts data", "references another table's primary key", "must be unique", "stores dates"], a: "references another table's primary key", e: "The link that joins tables and enforces referential integrity.", d: "easy" },
  { q: "A many-to-many relationship between Students and Subjects is implemented with", o: ["two foreign keys in Students", "a junction table holding both keys", "a unique index", "one combined table"], a: "a junction table holding both keys", e: "Enrolments(StudentID FK, SubjectID FK) resolves M:N.", d: "medium" },
  { q: "List ALL customers with their orders if any exist. You need", o: ["INNER JOIN", "LEFT JOIN", "a subquery", "GROUP BY"], a: "LEFT JOIN", e: "ALL customers — the unmatched ones get NULLs; INNER drops them.", d: "medium" },
  { q: "Filtering groups by an aggregate (COUNT, AVG) requires", o: ["WHERE", "HAVING", "ORDER BY", "LIKE"], a: "HAVING", e: "WHERE filters rows before grouping; HAVING filters groups after.", d: "medium" },
  { q: "Storing 'maths, physics, art' in one subject cell violates", o: ["1NF — atomic values", "2NF — partial dependency", "3NF — transitive dependency", "no rule"], a: "1NF — atomic values", e: "One value per cell; lists prevent clean joins and searches.", d: "easy" },
  { q: "ProductName depends only on ProductID inside a composite-key table. This is", o: ["a transitive dependency", "a partial dependency — 2NF violation", "referential integrity", "an index"], a: "a partial dependency — 2NF violation", e: "Non-key column depending on PART of the composite key.", d: "hard" },
  { q: "An order row pointing to a customer who was deleted breaks", o: ["entity integrity", "referential integrity", "atomicity", "encryption"], a: "referential integrity", e: "Foreign keys must reference existing parent rows — FK constraints block it.", d: "medium" },
  { q: "In a bank transfer, debit and credit must both complete or neither. This is", o: ["isolation", "atomicity", "durability", "consistency"], a: "atomicity", e: "All or nothing — the ACID property the transfer tests.", d: "medium" },
  { q: "Indexing every column in a heavily-written table is unwise because", o: ["indexes cannot be created on many columns", "every write must also update every index", "queries become slower", "it breaks normalisation"], a: "every write must also update every index", e: "Indexes buy read speed with write cost and storage — index what you search.", d: "hard" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const today = new Date();
    const topic = await prisma.topic.findFirst({ where: { slug: "databases" } });
    if (!topic) throw new Error("master databases topic missing");
    let lesson = await prisma.lesson.findFirst({ where: { topicId: topic.id }, orderBy: { orderIndex: "asc" } });
    if (!lesson) {
      lesson = await prisma.lesson.create({
        data: { domain: "highschool", topicId: topic.id, title: "Standard lesson (auto-created)", orderIndex: 0, content: { blocks: [] } as object },
      });
    }
    await prisma.lesson.update({ where: { id: lesson.id }, data: { title: "Databases — Complete", content: { blocks: DB_BLOCKS } as object, estimatedMinutes: 55 } });
    for (let i = 0; i < DB_QS.length; i++) {
      const item = DB_QS[i];
      await prisma.question.upsert({
        where: { id: `master-databases-q${i + 1}` },
        update: { questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
        create: { id: `master-databases-q${i + 1}`, domain: "highschool", topicId: topic.id, type: "mcq", questionText: item.q, options: item.o, correctAnswer: item.a, explanation: item.e, difficulty: item.d, sourceExam: "WAEC" },
      });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: today } });
    return NextResponse.json({ ok: true, topic: "databases-rebuild", blocks: DB_BLOCKS.length, questions: DB_QS.length });
  } catch (e) {
    console.error("rebuild databases failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
