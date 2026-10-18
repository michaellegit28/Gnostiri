import {
  listBoards,
  generateBoardSet,
  generateAllBoards,
  SUBJECTS,
  getQuestionVariant,
  boardRegion,
} from "./integrator.js";

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case "boards": {
    console.log(`High School Exam Boards (${listBoards().length}):`);
    listBoards().forEach((b, i) => {
      console.log(
        `  ${i + 1}. ${b.name} (${b.id}) — ${b.region}, ${b.level}`
      );
    });
    console.log("");
    console.log("All boards receive cloned-variant questions only.");
    break;
  }

  case "subjects": {
    console.log("High School Subjects:");
    SUBJECTS.forEach((s) => console.log(`  - ${s.name} (${s.id})`));
    break;
  }

  case "questions": {
    const boardId = args[0] || "aqa";
    const count = parseInt(args[1] || "5", 10);
    try {
      const set = generateBoardSet(boardId, { count });
      console.log(
        `\nPQ Set for ${set.board.name} (${set.board.level}, ${set.board.region})`
      );
      console.log(
        `Version: ${set.tag} | Region: ${set.region} | Generated: ${set.generatedAt} | Questions: ${set.count}\n`
      );
      set.questions.forEach((q, i) => {
        console.log(
          `Q${i + 1} [${q.subject}] (${q.core.difficulty}) — ${q.version}:`
        );
        console.log(`   ${q.text}`);
        console.log(`   A: ${q.answer}\n`);
      });
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    break;
  }

  case "variant": {
    const questionId = args[0];
    if (!questionId) {
      console.error("Usage: node src/index.js variant <questionId>");
      process.exit(1);
    }
    const v = getQuestionVariant(questionId);
    if (!v) {
      console.error(`Question not found: ${questionId}`);
      process.exit(1);
    }
    console.log(`\nCloned variant for ${questionId}\n`);
    console.log(`  ${v.text}`);
    console.log(`  A: ${v.answer}`);
    console.log(`  Tag: ${v.tag} | Region: ${v.region}`);
    console.log(`  Core: ${v.core.formula} | ${v.core.structure}\n`);
    break;
  }

  case "all": {
    const count = parseInt(args[0] || "3", 10);
    const sets = generateAllBoards({ count });
    console.log(
      `\nGenerated PQ sets for all ${sets.length} boards (${count} questions each)\n`
    );
    sets.forEach((s) => {
      console.log(`## ${s.board.name} — ${s.tag} (${s.count} questions)`);
      s.questions.forEach((q) => {
        console.log(`  - [${q.version}] ${q.text}`);
      });
      console.log("");
    });
    break;
  }

  default: {
    console.log("Usage: node src/index.js <command> [args]");
    console.log("");
    console.log("Commands:");
    console.log("  boards              List all exam boards");
    console.log("  subjects            List high school subjects");
    console.log(
      "  questions <board> [count]  Generate cloned-variant questions for a board (default aqa, 5)"
    );
    console.log(
      "  variant <questionId>  Show the cloned variant for a question"
    );
    console.log("  all [count]         Generate cloned variants for all boards (default 3 each)");
    console.log("");
    console.log("Example: node src/index.js questions sa 6");
    console.log("Example: node src/index.js questions tz 6");
    console.log("Example: node src/index.js questions edexcel 6");
    console.log("Example: node src/index.js variant m001");
    process.exit(1);
  }
}
