import { writeFileSync } from "node:fs";
import {
  listBoards,
  generateBoardSet,
  generateAllBoards,
  SUBJECTS,
  getQuestionPair,
  isOfficialPastBoard,
  getBoard,
  boardRegion,
} from "./integrator.js";
import { generateSubject, GENERATORS } from "./generator.js";

const [cmd, ...args] = process.argv.slice(2);

function printQuestion(q, i) {
  console.log(`Q${i + 1} [${q.subject}] (${q.core.difficulty}) — ${q.version}:`);
  console.log(`   ${q.text}`);
  if (q.options && q.options.length) {
    q.options.forEach((opt, oi) => console.log(`   ${String.fromCharCode(65 + oi)}. ${opt}`));
  }
  console.log(`   A: ${q.answer}`);
  if (q.attribution) console.log(`   [${q.attribution}]`);
  if (q.disclaimer) console.log(`   [${q.disclaimer}]`);
  console.log("");
}

switch (cmd) {
  case "boards": {
    console.log(`High School Exam Boards (${listBoards().length}):`);
    listBoards().forEach((b, i) => {
      const tag = isOfficialPastBoard(b.id) ? "  [OFFICIAL PAST QUESTIONS]" : "";
      console.log(`  ${i + 1}. ${b.name} (${b.id}) — ${b.region}, ${b.level}${tag}`);
    });
    break;
  }

  case "subjects": {
    console.log("High School Subjects:");
    SUBJECTS.forEach((s) => console.log(`  - ${s.name} (${s.id})`));
    break;
  }

  case "questions": {
    const boardId = args[0] || "jamb";
    const count = parseInt(args[1] || "5", 10);
    try {
      const set = generateBoardSet(boardId, { count });
      console.log(`\nPQ Set for ${set.board.name} (${set.board.level}, ${set.board.region})`);
      console.log(`Version: ${set.tag} | Generated: ${set.generatedAt} | Questions: ${set.count}\n`);
      set.questions.forEach((q, i) => printQuestion(q, i));
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    break;
  }

  case "pair": {
    const questionId = args[0];
    if (!questionId) {
      console.error("Usage: node src/index.js pair <questionId>");
      process.exit(1);
    }
    const pair = getQuestionPair(questionId);
    if (!pair) {
      console.error(`Question not found: ${questionId}`);
      process.exit(1);
    }
    console.log(`\nQuestion pair for ${questionId}\n`);
    console.log(`Version A — OFFICIAL (South Africa / Tanzania):`);
    console.log(`  ${pair.official.text}`);
    if (pair.official.options && pair.official.options.length) {
      pair.official.options.forEach((opt, i) => console.log(`  ${String.fromCharCode(65 + i)}. ${opt}`));
    }
    console.log(`  A: ${pair.official.answer}`);
    console.log(`  Tag: ${pair.official.tag}`);
    console.log(`  Attestation: ${pair.official.attestation}\n`);
    console.log(`Version B — CLONED VARIANT (JAMB / WAEC / global):`);
    console.log(`  ${pair.global.text}`);
    if (pair.global.options && pair.global.options.length) {
      pair.global.options.forEach((opt, i) => console.log(`  ${String.fromCharCode(65 + i)}. ${opt}`));
    }
    console.log(`  A: ${pair.global.answer}`);
    console.log(`  Tag: ${pair.global.tag}`);
    console.log(`  Core: ${pair.global.core.formula} | ${pair.global.core.structure}\n`);
    break;
  }

  case "generate": {
    const boardId = args[0] || "jamb";
    const subject = args[1];
    const count = parseInt(args[2] || "500", 10);
    const outIdx = args.indexOf("--out");
    const outFile = outIdx >= 0 ? args[outIdx + 1] : null;

    if (!subject || !GENERATORS[subject]) {
      console.error(`Unknown subject: ${subject || "(none)"}. Valid: ${Object.keys(GENERATORS).join(", ")}`);
      process.exit(1);
    }
    const board = getBoard(boardId);
    if (!board) {
      console.error(`Unknown board: ${boardId}`);
      process.exit(1);
    }

    const useOfficial = isOfficialPastBoard(boardId);
    const region = boardRegion(boardId);
    const generated = generateSubject(subject, count);

    const records = generated.map((q) => {
      const v = useOfficial ? q.versions.official : q.versions.global;
      return {
        id: `${boardId}-${q.id}`,
        coreId: q.coreId,
        provenance: useOfficial ? "official" : "original",
        variant: useOfficial ? "A" : "B",
        track: [region.toUpperCase()],
        styleBoard: boardId.toUpperCase(),
        domain: "highschool",
        type: "mcq",
        questionText: v.text,
        options: v.options,
        correctAnswer: v.answer,
        hint: q.core.formula,
        difficulty: q.core.difficulty,
        sourceExam: `${boardId}-generated-${subject}`,
        reviewStatus: useOfficial ? "needs-human-review" : "generated",
      };
    });

    let invalid = 0;
    for (const r of records) {
      if (!r.options.includes(r.correctAnswer)) invalid++;
    }
    if (invalid > 0) {
      console.error(`Validation failed: ${invalid} questions have answer not in options`);
      process.exit(1);
    }

    console.log(`Generated ${records.length} ${useOfficial ? "official (A)" : "cloned-variant (B)"} questions for ${board.name} / ${subject}`);
    if (outFile) {
      writeFileSync(outFile, JSON.stringify(records, null, 2) + "\n");
      console.log(`Wrote ${outFile}`);
    } else {
      records.slice(0, 5).forEach((r, i) => {
        console.log(`\nQ${i + 1}: ${r.questionText}`);
        r.options.forEach((o, oi) => console.log(`  ${String.fromCharCode(65 + oi)}. ${o}`));
        console.log(`  A: ${r.correctAnswer}`);
      });
      if (records.length > 5) console.log(`\n... and ${records.length - 5} more (use --out <file> to save)`);
    }
    break;
  }

  case "all": {
    const count = parseInt(args[0] || "3", 10);
    const sets = generateAllBoards({ count });
    console.log(`\nGenerated PQ sets for all ${sets.length} boards (${count} questions each)\n`);
    sets.forEach((s) => {
      console.log(`## ${s.board.name} — ${s.tag} (${s.count} questions)`);
      s.questions.forEach((q) => console.log(`  - [${q.version}] ${q.text}`));
      console.log("");
    });
    break;
  }

  default: {
    console.log("Usage: node src/index.js <command> [args]");
    console.log("");
    console.log("Commands:");
    console.log("  boards                    List all 27 exam boards (SA & TZ = official)");
    console.log("  subjects                  List high school subjects");
    console.log("  questions <board> [count] Generate questions (default jamb, 5)");
    console.log("  generate <board> <subject> [count] [--out file]");
    console.log("                           Generate schema-valid bank (default 500)");
    console.log("  pair <questionId>         Show Version A (official) vs Version B (cloned)");
    console.log("  all [count]               Generate for all boards (default 3 each)");
    console.log("");
    console.log("Examples:");
    console.log("  node src/index.js questions jamb 6");
    console.log("  node src/index.js generate jamb math 500 --out content/questions/jamb-math.json");
    console.log("  node src/index.js pair m001");
    process.exit(1);
  }
}
