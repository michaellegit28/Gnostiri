import {
  listBoards,
  generateBoardSet,
  generateAllBoards,
  SUBJECTS,
  getQuestionPair,
  isOfficialPastBoard,
} from "./integrator.js";

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
    console.log("  pair <questionId>         Show Version A (official) vs Version B (cloned)");
    console.log("  all [count]               Generate for all boards (default 3 each)");
    console.log("");
    console.log("Examples:");
    console.log("  node src/index.js questions jamb 6");
    console.log("  node src/index.js questions waec 6");
    console.log("  node src/index.js questions sa 6");
    console.log("  node src/index.js pair m001");
    process.exit(1);
  }
}
