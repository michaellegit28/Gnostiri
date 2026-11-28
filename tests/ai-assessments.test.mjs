// AI Assessments — server-owned + graceful (mirrors the AI-lane notes contracts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

test("assessments are read/written server-side with identity from the session", () => {
  const api = read("src/app/api/ai/assessments/route.ts");
  assert.doesNotMatch(api, /^["']use client["']/m, "the assessments API is a server route");
  assert.match(api, /getCurrentUser/, "identity comes from the session, not the client");
  assert.match(api, /from ["']@\/lib\/db["']/, "reads/writes go through Prisma server-side");
  assert.match(api, /config: \{\}/, "a new assessment starts with an empty item config");
});

test("assessment delete is ownership-scoped and graceful", () => {
  const del = read("src/app/api/ai/assessments/[id]/route.ts");
  assert.match(del, /deleteMany\(\{ where: \{ id, userId: user\.id \} \}\)/, "ownership enforced in the WHERE clause");
  const comp = read("src/components/university/AiAssessments.tsx");
  assert.match(comp, /^["']use client["']/m, "the widget is a client component");
  assert.doesNotMatch(comp, /@\/lib\/db|from ["']@prisma\/client["']/, "no Prisma client in the client bundle (rule 4)");
});

test("the AI Studio renders the assessments widget", () => {
  const page = read("src/app/university/ai/page.tsx");
  assert.match(page, /<AiAssessments \/>/, "AI assessments are surfaced in the AI Studio");
});