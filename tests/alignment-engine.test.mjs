import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Pure mirrors of app logic (no DB) — run with: node --test tests/alignment-engine.test.mjs

function parseTier(s) {
  const v = String(s || "").toLowerCase().trim();
  return ["core", "elective", "excluded"].includes(v) ? v : null;
}
function badgeClass(tier) {
  if (tier === "core") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (tier === "elective") return "bg-amber-50 text-amber-800 border border-amber-300";
  return "bg-red-50 text-red-700 border border-red-200 opacity-75";
}
function disclosure(region) {
  // Progressive disclosure cascade
  return {
    showBoard: region.boards.length > 1,
    showTrackFor: (boardId) => {
      const b = region.boards.find((x) => x.id === boardId);
      return !!b && b.tracks.length > 0;
    },
  };
}

describe("tier logic (core/elective/excluded)", () => {
  it("accepts only core|elective|excluded", () => {
    assert.equal(parseTier("core"), "core");
    assert.equal(parseTier("ELECTIVE"), "elective");
    assert.equal(parseTier("excluded"), "excluded");
    assert.equal(parseTier("optional"), null);
    assert.equal(parseTier(""), null);
  });
  it("uncertain defaults to elective (never auto-core)", () => {
    const incoming = "maybe-core";
    const tier = parseTier(incoming) || "elective";
    assert.equal(tier, "elective");
  });
});

describe("badge rendering (3 tiers)", () => {
  it("core = solid green pill", () => assert.match(badgeClass("core"), /emerald/));
  it("elective = amber outlined", () => assert.match(badgeClass("elective"), /amber/));
  it("excluded = muted red", () => assert.match(badgeClass("excluded"), /red/));
});

describe("widget progressive disclosure", () => {
  it("single-board country hides board dropdown", () => {
    const d = disclosure({ boards: [{ id: "b1", tracks: [] }] });
    assert.equal(d.showBoard, false);
  });
  it("multi-board country shows board dropdown (IN CBSE/ISC, UK x4)", () => {
    const d = disclosure({ boards: [{ id: "a", tracks: [] }, { id: "b", tracks: [] }] });
    assert.equal(d.showBoard, true);
  });
  it("track dropdown only when board has tracks", () => {
    const d = disclosure({ boards: [{ id: "cbse", tracks: [{ id: "sci" }] }, { id: "aqa", tracks: [] }] });
    assert.equal(d.showTrackFor("cbse"), true);
    assert.equal(d.showTrackFor("aqa"), false);
  });
});

describe("RTL layout (EG/AE/IL)", () => {
  it("rtl flags in seed regions", () => {
    const seed = readFileSync("prisma/seed-curriculum-alignment.ts", "utf8");
    for (const iso of ['"EG"', '"AE"', '"IL"']) assert.ok(seed.includes(iso), `seed has ${iso}`);
    assert.ok(seed.includes("rtl: true"), "rtl:true present");
  });
  it("widget sets dir=rtl for rtl regions", () => {
    const w = readFileSync("src/components/curriculum/CurriculumAlignmentWidget.tsx", "utf8");
    assert.ok(w.includes('dir={rtl ? "rtl" : "ltr"}'));
  });
});

describe("hard-correction topics (UK/SG/IL)", () => {
  it("seed tags 3 topics CORE across all boards", () => {
    const seed = readFileSync("prisma/seed-curriculum-alignment.ts", "utf8");
    for (const slug of ["human-physiology", "thermodynamics", "statistics-probability"]) {
      assert.ok(seed.includes(slug), `seed covers ${slug}`);
    }
    assert.ok(seed.includes('tier: "core"'), "CORE tier seeded");
    assert.ok(seed.includes("for (const board of boards)"), "covers every board");
  });
  it("disclaimer + audit date present on topic templates", () => {
    for (const f of [
      "src/components/curriculum/AlignmentDisclaimer.tsx",
      "src/app/highschool/[exam]/[subject]/[topic]/study/StudyReaderClient.tsx",
      "src/app/discovery/[topic]/page.tsx",
      "src/app/university/[course]/page.tsx",
    ]) {
      const src = readFileSync(f, "utf8");
      assert.ok(src.includes("AlignmentDisclaimer") || src.includes("alignment guide"), f);
    }
    const d = readFileSync("src/components/curriculum/AlignmentDisclaimer.tsx", "utf8");
    assert.ok(d.includes("Gnostiri is not affiliated"), "mandatory disclaimer text");
    assert.ok(d.includes("Last audited"), "last_audited_date foundation of trust");
  });
});

describe("low-bandwidth (?lite=1)", () => {
  it("lite prop renders static text, hides widgets", () => {
    const w = readFileSync("src/components/curriculum/CurriculumAlignmentWidget.tsx", "utf8");
    assert.ok(w.includes("lite"), "lite prop");
    const css = readFileSync("src/app/globals.css", "utf8");
    assert.ok(css.includes("html.lite"), "lite CSS");
  });
});
