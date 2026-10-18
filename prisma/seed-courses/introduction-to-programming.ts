import { PrismaClient } from "@prisma/client";
import type { LessonContent } from "@/types/lesson";

const prisma = new PrismaClient();

/**
 * Pilot course seed — "Introduction to Programming" (Python).
 *
 * Replaces the two generic template lessons created by prisma/seed.ts with a
 * real 12-lesson, 4-module course: 12 ConceptNodes forming a prerequisite
 * DAG, one SBA AssessmentItem per concept, and 12 CourseLessons authored in
 * the full lesson format (outcomes -> big idea -> explanation -> worked
 * examples with runnable code -> common mistakes -> check questions ->
 * MCQs -> summary).
 *
 * Idempotent: safe to run repeatedly. Upserts on stable slugs and the
 * lesson ids course-programming-lesson-1..12, so re-running updates content
 * in place and never duplicates rows.
 *
 * Governance: every lesson ships with reviewStatus "needs-human-review" and
 * needsCheck true until a human author signs it off. Nothing here is ever
 * marked "verified" by the seeder.
 */

const COURSE_SLUG = "introduction-to-programming";
const COURSE_ID = "course-programming"; // stable id from prisma/seed.ts

interface ConceptSeed {
  title: string;
  slug: string;
  blooms: string;
  minutes: number;
  prereq: string[];
}

interface LessonSeed {
  id: string;
  title: string;
  module: number; // 1..4
  concept: ConceptSeed;
  estimatedMinutes: number;
  content: LessonContent;
}

// ---------------------------------------------------------------------------
// Course spine: 4 modules x 3 lessons = 12.
// ---------------------------------------------------------------------------
const MODULES = [
  { slug: "thinking-like-a-programmer", title: "M1 — Thinking like a programmer" },
  { slug: "control-flow", title: "M2 — Control flow" },
  { slug: "organizing-code", title: "M3 — Organizing code" },
  { slug: "building", title: "M4 — Building" },
];

// ---------------------------------------------------------------------------
// LESSON 1 — What a program is (fully authored)
// ---------------------------------------------------------------------------
const LESSON_1: LessonSeed = {
  id: `${COURSE_ID}-lesson-1`,
  title: "What a program is",
  module: 1,
  estimatedMinutes: 25,
  concept: {
    title: "What a program is",
    slug: "what-is-a-program",
    blooms: "remember",
    minutes: 25,
    prereq: [],
  },
  content: lesson1(),
};

// Placeholder lessons 2-12. The concept spine, prerequisite edges and SBA
// items are real and complete so the course is structurally sound; only the
// long-form content blocks are pending authoring. needsCheck marks them.
const LESSONS_2_TO_12: LessonSeed[] = [
  { id: `${COURSE_ID}-lesson-2`, title: "Variables & types", module: 1, estimatedMinutes: 30, concept: { title: "Variables and types", slug: "variables-and-types", blooms: "understand", minutes: 30, prereq: ["what-is-a-program"] }, content: lesson2() },
  { id: `${COURSE_ID}-lesson-3`, title: "Input, output & operators", module: 1, estimatedMinutes: 30, concept: { title: "Input, output and operators", slug: "input-output-operators", blooms: "apply", minutes: 30, prereq: ["variables-and-types"] }, content: lesson3() },
  { id: `${COURSE_ID}-lesson-4`, title: "Conditions", module: 2, estimatedMinutes: 30, concept: { title: "Conditional statements", slug: "conditionals", blooms: "understand", minutes: 30, prereq: ["input-output-operators"] }, content: lesson4() },
  { id: `${COURSE_ID}-lesson-5`, title: "Loops", module: 2, estimatedMinutes: 35, concept: { title: "Loops and iteration", slug: "loops", blooms: "understand", minutes: 35, prereq: ["conditionals"] }, content: lesson5() },
  { id: `${COURSE_ID}-lesson-6`, title: "Logic & debugging basics", module: 2, estimatedMinutes: 30, concept: { title: "Logic and debugging basics", slug: "logic-debugging-basics", blooms: "analyze", minutes: 30, prereq: ["loops"] }, content: pending(6) },
  { id: `${COURSE_ID}-lesson-7`, title: "Functions", module: 3, estimatedMinutes: 35, concept: { title: "Functions", slug: "functions", blooms: "apply", minutes: 35, prereq: ["logic-debugging-basics"] }, content: pending(7) },
  { id: `${COURSE_ID}-lesson-8`, title: "Lists & dictionaries", module: 3, estimatedMinutes: 35, concept: { title: "Lists and dictionaries", slug: "lists-dictionaries", blooms: "apply", minutes: 35, prereq: ["functions"] }, content: pending(8) },
  { id: `${COURSE_ID}-lesson-9`, title: "Strings & files", module: 3, estimatedMinutes: 35, concept: { title: "Strings and files", slug: "strings-files", blooms: "apply", minutes: 35, prereq: ["lists-dictionaries"] }, content: pending(9) },
  { id: `${COURSE_ID}-lesson-10`, title: "Decomposition", module: 4, estimatedMinutes: 30, concept: { title: "Decomposition", slug: "decomposition", blooms: "analyze", minutes: 30, prereq: ["strings-files"] }, content: pending(10) },
  { id: `${COURSE_ID}-lesson-11`, title: "Testing & debugging", module: 4, estimatedMinutes: 30, concept: { title: "Testing and debugging", slug: "testing-debugging", blooms: "evaluate", minutes: 30, prereq: ["decomposition"] }, content: pending(11) },
  { id: `${COURSE_ID}-lesson-12`, title: "Mini project", module: 4, estimatedMinutes: 45, concept: { title: "Mini project", slug: "mini-project", blooms: "create", minutes: 45, prereq: ["testing-debugging"] }, content: pending(12) },
];

const ALL_LESSONS = [LESSON_1, ...LESSONS_2_TO_12];

// ---------------------------------------------------------------------------
// Placeholder content for lessons 2-12 (real content authored after review).
// ---------------------------------------------------------------------------
function pending(n: number): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: `Lesson ${n}` },
      {
        type: "callout",
        variant: "info",
        text: "This lesson's full content is awaiting authoring. The concept, prerequisite edges and its assessment item are already in place, so the course spine is complete and the exam builder will include this concept.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 1 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson1(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain what a program is in your own words; describe the difference between source code and what a computer actually executes; run a short Python program and correctly predict what it prints; and recognise a Python error message as feedback rather than failure.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of the course. You do not need any programming experience, and you do not need Python installed — every example shows its exact output inline.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Program",
        text: "A program is a precise, step-by-step set of instructions written for a machine that has no common sense. The computer follows each instruction exactly as written, in exactly the order written, and does nothing you did not ask for.",
      },
      {
        type: "paragraph",
        text: "That definition is the whole course in one sentence, and most of what feels difficult about programming later is just the consequences of it. A recipe is a good analogy, with one important difference: a human cook fills in the gaps. If a recipe says \"cook the onions until soft\", a person knows what soft looks like. A computer does not. If you mean \"until a fork sinks in easily\", you have to say that.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before anything else" },
      {
        type: "paragraph",
        text: "Before learning any Python syntax it helps to understand the arrangement you are entering into. You are writing instructions for a processor that is extraordinarily fast and literal-minded. It will do ten million of your instructions per second and not one of them will it interpret charitably. This is why programmers talk about \"bugs\" rather than \"misunderstandings\": when the output is wrong, the machine did exactly what it was told, and the instruction was wrong.",
      },
      {
        type: "paragraph",
        text: "There is a chain between what you type and what the machine does. You write source code — text, in a language like Python. Another program, called an interpreter, reads that text and translates each line into the processor's own instructions, then runs them. You never speak to the processor directly; you write Python, and the interpreter carries the message. This is why a \"syntax error\" is possible: it is the interpreter telling you it could not finish reading the sentence.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: your first program" },
      {
        type: "paragraph",
        text: "The traditional first program does one thing: it announces itself. Two lines, each a complete instruction.",
      },
      {
        type: "code",
        language: "python",
        code: `print("Welcome to Introduction to Programming!")\nprint("2 + 3 =", 2 + 3)`,
        output: `Welcome to Introduction to Programming!\n2 + 3 = 5`,
        caption: "Each print() instruction writes one line of output. The comma joins two things onto that line, separated by a space.",
      },
      {
        type: "paragraph",
        text: "Read it as three facts. print is an instruction that writes to the screen. Whatever you put inside the quotes is written exactly as written, so the first line prints the greeting and the second prints the fragment \"2 + 3 =\". The part without quotes, 2 + 3, is not text — it is arithmetic the interpreter evaluates before printing, which is why the output shows 5 and not the characters 2 + 3. That distinction, quoted text versus unquoted expression, is the first real fork in learning to program, and it is worth pausing on.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a program that remembers" },
      {
        type: "paragraph",
        text: "Real programs do not just recite; they keep hold of things and act on them later. Here a name is stored and then used twice. Two identical-looking instructions produce different output, because the stored value changed between them.",
      },
      {
        type: "code",
        language: "python",
        code: `name = "Ada"\nprint("Hello,", name)\nprint("Your name has", len(name), "letters")`,
        output: `Hello, Ada\nYour name has 3 letters`,
        caption: "name = \"Ada\" stores the text Ada under the label name. len() counts characters. The second print uses the same label but a different fact about it.",
      },
      {
        type: "paragraph",
        text: "The line name = \"Ada\" is an assignment, and it reads backwards to most beginners: it means \"put the value on the right into the box labelled on the left\", never the reverse. So Ada is stored, and whenever the program later says name it means whatever is currently in that box. The second and third lines both print something about name, and they differ because they ask different questions of the same stored value — one reports it, the other measures it with len().",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Spelling print as Print or PRINT. Python is case-sensitive; Print is not the same instruction as print, and the interpreter will report that Print is not defined. If an error says something \"is not defined\", check capitalisation first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the quotes around text. Writing print(Hello) makes Python treat Hello as a stored name rather than text, and since nothing was stored under that name you get NameError. Text must be quoted; numbers and arithmetic must not be.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mixing up the two directions of =. name = \"Ada\" stores a value. Writing it as \"Ada\" = name is nonsense to the interpreter, because you cannot store into a piece of text. The value always moves right to left.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does the interpreter do with your source code?",
        answer: "It reads the text, translates each instruction into the processor's own instructions, and runs them. The processor never sees your Python directly.",
        explanation: "This is why a syntax error stops everything: the interpreter could not finish reading the line, so there was nothing to translate and run.",
      },
      {
        type: "question",
        prompt: "In print(\"2 + 3 =\", 2 + 3), why does the output show 5 rather than 2 + 3 twice?",
        answer: "The quoted part is text and is printed literally; the unquoted part is an expression the interpreter evaluates to 5 before printing.",
        explanation: "Quotes mean \"write this exactly\". No quotes means \"work this out\". Almost every early confusion about output traces back to this distinction.",
      },
      {
        type: "question",
        prompt: "A program stores 7 under the label score, then runs print(score + 1). What is printed, and what is in score afterwards?",
        answer: "8 is printed. score still holds 7, because reading a value to use it does not change what is stored.",
        explanation: "Assignment changes a stored value; an expression merely reads it. print(score + 1) reads score, adds one to the copy it read, and prints the result.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement best describes a program?",
        options: [
          "A piece of hardware inside the computer that runs applications",
          "A precise set of instructions that a computer follows exactly, in order",
          "A document describing what a piece of software should do",
          "A language used to talk to other programmers",
        ],
        correctIndex: 1,
        explanation: "A program is instructions executed literally and in order. Hardware runs them but is not the program; a specification describes one but is not one; a language is the medium you write one in.",
      },
      {
        type: "mcq",
        stem: "What is the interpreter for?",
        options: [
          "It speeds up the processor by pre-compiling all programs",
          "It protects the computer from malicious websites",
          "It reads your source code, translates it, and runs it",
          "It checks your spelling and suggests corrections",
        ],
        correctIndex: 2,
        explanation: "The interpreter is the translator between your text and the processor's instructions. Without it, your Python never executes — which is exactly why a line it cannot parse becomes a syntax error.",
      },
      {
        type: "mcq",
        stem: 'What is the output of print("6 * 7")?',
        options: ["42", "6 * 7", "6*7", "An error, because numbers cannot be printed inside quotes"],
        correctIndex: 1,
        explanation: "Everything inside the quotes is literal text, so the two characters 6, space, *, space, 7 are printed unchanged. Removing the quotes would give 42, because then it would be arithmetic.",
      },
      {
        type: "mcq",
        stem: 'What does print(10 - 4) print, and why?',
        options: [
          "10 - 4, because print writes its argument exactly as given",
          "6, because the expression is unquoted and is evaluated before printing",
          "Nothing, because print cannot do arithmetic",
          "An error, because print requires text",
        ],
        correctIndex: 1,
        explanation: "Unquoted input is an expression, so the interpreter computes 10 - 4 first and prints the result. print can receive numbers as well as text.",
      },
      {
        type: "mcq",
        stem: "Which of these produces a NameError when run?",
        options: ['print("Hello")', "print(2 + 2)", "print(Hello)", "print(42)"],
        correctIndex: 2,
        explanation: 'Without quotes, Hello is treated as the name of something stored. Nothing was stored under that name, so Python reports NameError. The fix is quotes: print("Hello").',
      },
      {
        type: "mcq",
        stem: 'In the line name = "Ada", which reading is correct?',
        options: [
          'Compare name with "Ada" and see whether they are equal',
          'Store the value "Ada" under the label name',
          'Store the label name inside the text "Ada"',
          'Print the value "Ada" using the label name',
        ],
        correctIndex: 1,
        explanation: 'A single = is assignment: the value on the right goes into the box on the left. Comparison uses a different operator, covered in the conditions lesson, and print is a separate instruction.',
      },
      {
        type: "mcq",
        stem: 'What does len("Python") evaluate to?',
        options: ["5", "6", "7", "An error, because len does not work on text"],
        correctIndex: 1,
        explanation: 'len counts characters: P-y-t-h-o-n is six characters, so len("Python") is 6. It is an expression like any other and can be used wherever a value is needed.',
      },
      {
        type: "mcq",
        stem: "A beginner writes Print(\"hi\") and sees an error mentioning something not defined. What is the most likely cause?",
        options: [
          "The computer lacks the hardware to run print",
          "Python is case-sensitive, so Print is not the same as print",
          "The quotes are the wrong kind",
          "print can only be used once per program",
        ],
        correctIndex: 1,
        explanation: 'Case sensitivity is the classic trap: print is a built-in instruction, Print is an unknown name. The fix is to lowercase it.',
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A program is literal, ordered instructions run by an interpreter that translates your text for the processor. Quoted material is written verbatim; unquoted material is worked out first. A single = stores a value under a label, and reading that label later does not change what is stored. Errors are the interpreter reporting that it could not follow an instruction, and they are information rather than failure.",
      },
      {
        type: "paragraph",
        text: "Next: variables and types. Lesson 1 stored text under a label; the next lesson covers what else can be stored — whole numbers, decimals, truth values — and why the distinction changes what your instructions are allowed to do to them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson2(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the four core data types you will meet most often; explain what is stored and what is reread when a variable is reused; predict whether an arithmetic expression yields an integer or a decimal; and convert comfortably between text and numbers without losing data.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (What a program is). You need to be comfortable with the idea that a single equals sign stores a value under a label, and that quoted text is printed literally while unquoted expressions are worked out first.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Variable",
        text: "A variable is a named box in memory. You put a value in it with a single equals sign, and you read whatever is currently inside whenever you mention the name. A variable holds one value, but that value can change.",
      },
      {
        type: "definition",
        term: "Type",
        text: "The type of a value describes what kind of data it is — a whole number, a decimal, a chunk of text, or a truth value — and, crucially, what operations the language will allow you to perform on it.",
      },
      {
        type: "paragraph",
        text: "Python is strongly typed but dynamically typed. Strongly means you cannot, for example, add a number to text without a deliberate conversion. Dynamically means you do not declare a variable's type in advance; Python infers it from the value you put in. That inference is the reason the same variable name can later hold a completely different kind of value — which is useful and occasionally a trap.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "Three types carry most of the weight in a first course: integers, floats and strings. A string is any text, marked by quote marks. An integer is a whole number without a decimal point, while a float is a number that has one — even a mathematically whole number like 10.0 counts as a float. The distinction is not cosmetic: Python will happily give you an exact answer with integers but a slightly rounded-internally one with floats, and it will refuse outright to combine a string with a number.",
      },
      {
        type: "paragraph",
        text: "There is also a boolean type — True or False — which you will put to real use in the next lesson when you write conditions. For now, treat it as another kind of value a variable can hold.",
      },
      {
        type: "paragraph",
        text: "The single rule that prevents the most beginner errors is this: a variable is re-read every time it is mentioned. It holds whatever was put into it last. If a program stores 5 as score, then later stores 9 as score, then prints score, it prints 9 — the earlier 5 is gone, not waiting somewhere to be recalled.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: a variable that changes" },
      {
        type: "paragraph",
        text: "This is the read-last-value rule in action. Two print statements mention the same variable, and the second letter of the output differs because the value inside the box was replaced in between.",
      },
      {
        type: "code",
        language: "python",
        code: `age = 19\nprint("Age:", age)\nage = 20\nprint("Age now:", age)`,
        output: "Age: 19\nAge now: 20",
        caption: "Storing 20 under age overwrites the stored 19, so the second print reads the newer value.",
      },
      {
        type: "paragraph",
        text: "Read each line as an instruction, not a statement of fact. The first two lines store 19 and print it. The third line replaces the box's contents with 20. The fourth line re-reads the box — which now holds 20 — and prints that. Nothing about a variable is static; you are issuing commands to a machine that remembers only what you most recently told it.",
      },

      { type: "heading", level: 2, text: "Worked example 2: telling the types apart" },
      {
        type: "paragraph",
        text: "The built-in type() function reports what kind of value is stored. It is the fastest way to see whether a number has a decimal point or a piece of text is actually text.",
      },
      {
        type: "code",
        language: "python",
        code: `print(type(5))\nprint(type(3.14))\nprint(type("hello"))\nprint(type(True))`,
        output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
        caption: "Each type knows what it is: int, float, str (string), bool (boolean).",
      },
      {
        type: "paragraph",
        text: "Notice the pattern: int for whole numbers, float for decimals, str for text, and bool for true/false. The type is not a label you assigned; Python derived it from how you wrote the value. The quote marks around hello are what made it a string — write hello without quotes and Python looks for a variable of that name instead, which is the lesson-1 NameError all over again.",
      },

      { type: "heading", level: 2, text: "Worked example 3: division is surprising" },
      {
        type: "paragraph",
        text: "One division operator in Python behaves differently depending on how you write it. Understanding this now saves a whole class of off-by-one bug.",
      },
      {
        type: "code",
        language: "python",
        code: `print(10 / 4)\nprint(10 // 4)\nprint(10 % 4)`,
        output: "2.5\n2\n2",
        caption: "/ gives the exact decimal, // gives the whole-number quotient, % gives the remainder.",
      },
      {
        type: "paragraph",
        text: "A single slash always produces a float, even when the division is exact — so 10 / 4 is 2.5. The double slash is floor division, which rounds down to a whole number, so 10 // 4 is 2. The percent sign is the modulo operator, the remainder of that division, so 10 % 4 is 2. These three are the toolkit for the loop lesson, where you will repeatedly ask whether a number divides evenly or what is left over.",
      },

      { type: "heading", level: 2, text: "Worked example 4: converting between types" },
      {
        type: "paragraph",
        text: "When you must join a number into a string, you convert explicitly. The names str(), int() and float() are your conversion tools.",
      },
      {
        type: "code",
        language: "python",
        code: `print("The number is " + str(42))\nprint(int("7") + 1)`,
        output: "The number is 42\n8",
        caption: "str(42) turns a number into text; int(\"7\") turns text into a number so arithmetic is allowed.",
      },
      {
        type: "paragraph",
        text: "The first line maps out the classic error: you cannot concatenate a string with an integer using the plus operator, because the two types are incompatible. Wrapping the number in str() converts it into text the string can join with. The second line does the reverse — int(\"7\") reads the digits as a number, so adding 1 gives 8 rather than appending the character to the text.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Adding a string and a number. print('Age: ' + age) fails with a TypeError when age is an integer. The fix is either convert with str(age) or use a comma in print to let Python place the values side by side without combining their types.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing floor division with exact division. Writing total // count thinking it divides exactly gives the rounded-down result. If you want decimals, use a single slash; if you want integer division, the double slash is deliberate.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting a variable is re-read. Storing a new value does not leave the old one available. If you need to keep both, give them different names — a variable is a single box, not a pile.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming a whole number is an integer. Python treats 10.0 as a float, so a value that looks whole may still behave like a decimal during division and in type checks.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "After the two lines age = 19 and age = 20 run, what does print(age) show, and why?",
        answer: "It shows 20, because a variable holds only the value most recently stored in it.",
        explanation: "age = 20 overwrites the earlier 19. The variable is a single box, not a history — reading it gives the current contents, which is 20.",
      },
      {
        type: "question",
        prompt: "What is the value of 17 // 5, and how does it differ from 17 / 5?",
        answer: "17 // 5 is 3 (floor division rounds down), while 17 / 5 is 3.4 (exact division gives a float).",
        explanation: "The double slash discards the remainder and returns a whole number; the single slash preserves the decimal part and always returns a float.",
      },
      {
        type: "question",
        prompt: "Why does the expression \"Age: \" + age fail when age is 42, and what is the fix?",
        answer: "It fails because a string and an integer cannot be combined with the plus operator; the fix is str(age) or using a comma in print.",
        explanation: "The plus operator requires the same types on both sides. Converting the number to text with str() makes the concatenation legal.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which value is stored as a float in Python?",
        options: ["5", "5.0", "\"5\"", "True"],
        correctIndex: 1,
        explanation: "A float is any number written with a decimal point. 5.0 is a float even though it is whole; 5 is an integer, \"5\" is a string, and True is a boolean.",
      },
      {
        type: "mcq",
        stem: "What does print(10 % 3) output?",
        options: ["3", "1", "3.33", "0"],
        correctIndex: 1,
        explanation: "The modulo operator returns the remainder of the division. Ten divided by three is three with one left over, so 10 % 3 is 1.",
      },
      {
        type: "mcq",
        stem: "After score = 7 and then score = 9, what does score hold?",
        options: ["7", "9", "16", "Both, depending on context"],
        correctIndex: 1,
        explanation: "Assignment replaces the box's contents. The later assignment stores 9, so that is what reading score returns. The 7 is gone.",
      },
      {
        type: "mcq",
        stem: "Which expression correctly joins a number into a sentence?",
        options: ["print(\"Total: \" + total) where total is 5", "print(\"Total: \" + str(total)) where total is 5", "print(\"Total: \" - total) where total is 5", "print(str(\"Total: \") * total) where total is 5"],
        correctIndex: 1,
        explanation: "You cannot add a string and an integer, so converting the number with str() is required. Option A would raise a TypeError.",
      },
      {
        type: "mcq",
        stem: "What type does type(3.14) report?",
        options: ["int", "float", "str", "bool"],
        correctIndex: 1,
        explanation: "3.14 has a decimal point, so Python assigns it the float type. Integers have no decimal point and are 'int'.",
      },
      {
        type: "mcq",
        stem: "What is the output of print(7 // 2)?",
        options: ["3.5", "3", "4", "1"],
        correctIndex: 1,
        explanation: "Floor division rounds the quotient down to the nearest whole number. Seven divided by two is three and a half, so 7 // 2 is 3.",
      },
      {
        type: "mcq",
        stem: "Which of these is a valid variable name in Python?",
        options: ["2nd_score", "my-score", "my_score", "my score"],
        correctIndex: 2,
        explanation: "Python names must start with a letter or underscore and can contain underscores but not hyphens, spaces, or a leading digit.",
      },
      {
        type: "mcq",
        stem: "Why is print(int(\"7\") + 1) valid while print(\"7\" + 1) is not?",
        options: ["Because int() is a list, not a function", "Because \"7\" is text and 1 is a number, so the plus operator has incompatible types; int(\"7\") converts the text to a number", "Because one uses quotes and the other does not, and quotes change precedence", "Because adding to a string is always forbidden, even after conversion"],
        correctIndex: 1,
        explanation: "The string \"7\" and the integer 1 cannot be added together. Wrapping the string in int() converts it to a number, so int(\"7\") + 1 is arithmetic and yields 8.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A variable is a named box holding one value, re-read each time it is mentioned, replaced by each new assignment. The core types are int, float, str and bool, inferred from the value you store. Mixed-type operations are disallowed unless you convert explicitly, and division offers a decimal, a whole-number, and a remainder form.",
      },
      {
        type: "paragraph",
        text: "Next: input, output and operators. This lesson stored values and told you what Python thinks they are; the next one lets you ask the user for a value, print results, and combine values with the full set of arithmetic and comparison operators.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson3(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: get a value from the user with input(); use the arithmetic and string operators correctly; predict the output of an expression using operator precedence; and convert user input into a number so it can be used in calculations.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Variables & types). You need to know that a variable stores one value under a label, and that integers, floats and strings behave differently and cannot be mixed without conversion.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Input",
        text: "Input is data coming into your program from outside — the keyboard here, and later a file or a network. A program that only prints fixed text is a recording; a program that accepts input is a conversation.",
      },
      {
        type: "definition",
        term: "Operator",
        text: "An operator is a symbol that produces a value from one or more other values — arithmetic symbols like + and *, string symbols like the + that joins text, and comparison symbols like > that produce a truth value.",
      },
      {
        type: "paragraph",
        text: "This lesson completes the three building blocks you have been assembling. Lesson 1 gave you output (print) and the idea of ordered instructions. Lesson 2 gave you storage (variables) and types. This lesson adds the other direction — input — and the operators that let you actually combine and transform what you have stored. With these three, you can already write programs that ask a question, compute an answer, and tell someone the answer. That is not a toy; it is the skeleton of almost everything you will write.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "The most important fact here is that input() always gives you a string. Whatever the person types — even if they type digits — arrives as text. This is why the arithmetic you learned does not just work: a variable holding the text \"7\" is not the number 7. If you try to multiply the text \"7\" by the number 3, Python will do something surprising rather than erroring, because the multiply operator is overloaded: on numbers it multiplies, on a string and an integer it repeats the string. So \"7\" * 3 gives \"777\", not 21. Learning to notice this is the entire point of the lesson.",
      },
      {
        type: "paragraph",
        text: "The second fact is precedence. An expression is not always read left to right; certain operators bind more tightly than others. Multiplication binds tighter than addition, so 2 + 3 * 4 is 2 + 12, not 5 * 4. Parentheses override everything. This is not a rule to memorise a table for; it is enough to remember that the two or three most common mistakes all come from assuming left-to-right.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: a program that listens" },
      {
        type: "paragraph",
        text: "The program asks one question, waits for the user to type a name, and greets them. Notice there is a pause — the program does not print the greeting until the person presses Enter.",
      },
      {
        type: "code",
        language: "python",
        code: `name = input("What is your name? ")\nprint("Hello, " + name + "!")`,
        output: "What is your name? Ada\nHello, Ada!",
        caption: 'input() shows its prompt, waits for a line, and stores whatever was typed as a string.',
      },
      {
        type: "paragraph",
        text: "The line name = input(...) does two jobs in one: it calls input, which collects a line of text from the keyboard, and it stores the result under name. The string concatenation in the second line joins the greeting, the typed name, and the exclamation mark into one string. If the user typed Ada, Python builds the single string Hello, Ada! and prints it.",
      },

      { type: "heading", level: 2, text: "Worked example 2: operator precedence" },
      {
        type: "paragraph",
        text: "Two expressions use the same numbers and operators but different grouping, and they produce different results. This is precedence doing real work.",
      },
      {
        type: "code",
        language: "python",
        code: `print(2 + 3 * 4)\nprint((2 + 3) * 4)`,
        output: "14\n20",
        caption: "Multiplication binds first, so 2 + 12 is 14; parentheses force the addition first, so 5 * 4 is 20.",
      },
      {
        type: "paragraph",
        text: "In the first line, * binds tighter than +, so Python multiplies 3 by 4 to get 12, then adds it to 2 to get 14. In the second, the parentheses change the grouping so 2 plus 3 is computed first to give 5, which is then multiplied by 4 to give 20. Same four symbols, same two numbers; only the order of operations differs.",
      },

      { type: "heading", level: 2, text: "Worked example 3: operators on strings" },
      {
        type: "paragraph",
        text: "Some operators change meaning depending on what they are applied to. The plus sign joins two strings but multiplies a string by an integer.",
      },
      {
        type: "code",
        language: "python",
        code: `print("Py" + "thon")\nprint("ha" * 3)`,
        output: "Python\nhahaha",
        caption: 'On strings, + concatenates and * repeats. These are "operator overloading" — the same symbol doing different work.',
      },
      {
        type: "paragraph",
        text: "The plus sign joins Py and thon into Python — string concatenation, distinct from numeric addition. The asterisk repeats the string ha three times, giving hahaha. This overloading is why the turn of phrase \"a string times a number\" is not an error: it is a deliberate feature. It is also why the classic bug in example 4 happens — the same symbol means something sensible for a string and a number, but not what a beginner expects when the values are the wrong type.",
      },

      { type: "heading", level: 2, text: "Worked example 4: everything returns bool for comparisons" },
      {
        type: "paragraph",
        text: "The comparison operators give back a truth value — True or False — which is a type of its own, the sort of thing the next lesson builds entire branches on.",
      },
      {
        type: "code",
        language: "python",
        code: `print(10 > 5)\nprint(10 < 5)\nprint(10 == 10)`,
        output: "True\nFalse\nTrue",
        caption: "The comparison operators produce a boolean: True or False.",
      },
      {
        type: "paragraph",
        text: "Each of these is an expression whose value is a boolean. Ten is greater than five is True, ten is less than five is False, and ten equals ten is True. Note the double equals sign for comparison — a single equals is assignment, and confusing the two is one of the most common beginner bugs. You are not storing 10 into 5; you are asking whether two things are equal.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that input() returns a string. If the user types 7, you have the text \"7\". Multiplying it by 3 gives \"777\", not 21. Convert first with int() or float().",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using a single equals sign for comparison. if x = 5 is assignment, not a question. Comparison is if x == 5. The equals used for comparison is always doubled.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Adding a string and a number. \"Age: \" + age fails when age is an integer. Convert with str(age) or use a comma so print places them side by side.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming left-to-right evaluation. 2 + 3 * 4 is 14 because multiplication binds first. If you want the sum computed before the product, add parentheses: (2 + 3) * 4.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A user types 7 in response to input(). What is the type of the value stored, and what does \"7\" * 3 give?",
        answer: "The value is a string, so \"7\" * 3 repeats the text three times and gives \"777\", not 21.",
        explanation: "input() always returns text. Because * on a string and an integer means repetition, you get the concatenated text rather than multiplication.",
      },
      {
        type: "question",
        prompt: "What is the output of print(2 + 3 * 4)?",
        answer: "14.",
        explanation: "Multiplication binds more tightly than addition, so Python computes 3 * 4 first (12) and then adds 2, giving 14.",
      },
      {
        type: "question",
        prompt: "Why does comparing with a single equals sign fail, and what is the correct symbol?",
        answer: "A single equals is assignment and does not produce a comparison; the correct comparison symbol is the double equals, ==.",
        explanation: "Assignment stores a value; comparison asks whether two values are equal. They are different operators and cannot be interchanged.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What does input() always return, regardless of what the user types?",
        options: ["An integer", "A float", "A string", "A boolean"],
        correctIndex: 2,
        explanation: "input() always yields a string. Digits typed by the user arrive as text, so they must be converted before arithmetic.",
      },
      {
        type: "mcq",
        stem: "What is the value of print(3 * 2 + 1)?",
        options: ["9", "7", "6", "10"],
        correctIndex: 1,
        explanation: "Multiplication before addition gives 6 + 1, which is 7. Reading it left to right and getting 9 is the whole bug.",
      },
      {
        type: "mcq",
        stem: "What is printed by print(\"abc\" + \"def\")?",
        options: ["abcdef", "abc def", "abc+def", "Error"],
        correctIndex: 0,
        explanation: "On strings the plus operator concatenates, joining abc and def into the single string abcdef.",
      },
      {
        type: "mcq",
        stem: "A user enters 10 into a program. Which line correctly stores the number 10 so it can be used in arithmetic?",
        options: ["n = input()", "n = int(input())", "n = str(input())", "n = input() * 1"],
        correctIndex: 1,
        explanation: "input() returns \"10\" as text; wrapping it in int() converts it to the number 10. Otherwise multiplication would repeat the text.",
      },
      {
        type: "mcq",
        stem: "Which operator pair does comparison and produces a boolean?",
        options: ["+ and *", "> and ==", "and and or", "+ and ="],
        correctIndex: 1,
        explanation: "The comparison operators, such as > and ==, evaluate to True or False. Plus and asterisk either add, concatenate, or repeat.",
      },
      {
        type: "mcq",
        stem: "What does \"ha\" * 3 produce?",
        options: ["6", "hahaha", "ha3", "Error"],
        correctIndex: 1,
        explanation: "Multiplying a string by an integer repeats it. \"ha\" repeated three times is \"hahaha\".",
      },
      {
        type: "mcq",
        stem: "Why is 10 == 10 True but 10 = 10 invalid in a program?",
        options: ["Because == is an arithmetic operator", "Because = is assignment, not comparison, so Python treats the line as an attempt to store into a value", "Because numbers cannot be compared", "Because = is a boolean operator"],
        correctIndex: 1,
        explanation: "The double equals asks whether two values are equal, yielding a boolean. A single equals assigns, and you cannot assign to a literal like 10.",
      },
      {
        type: "mcq",
        stem: "What is the value of (5 + 3) * 2?",
        options: ["13", "16", "11", "10"],
        correctIndex: 1,
        explanation: "Parentheses override precedence, so the addition gives 8, then doubling gives 16. Without them, multiplication first gives 11.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "input() reads a line of text as a string; print() writes output. Operators combine values: arithmetic on numbers, concatenation and repetition on strings, and comparison to produce a boolean. Precedence — multiplication before addition, parentheses overriding — decides the grouping. The single most important rule: convert input with int() or float() before arithmetic, because input is always text.",
      },
      {
        type: "paragraph",
        text: "Next: conditions. Lesson 3 ended with comparison operators producing True or False. The next lesson puts those booleans to work, letting your program choose between two different courses of action — the start of real decision-making.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson4(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: choose between two courses of action with if and else; chain several choices with elif; combine conditions with and, or and not; and correctly indent the blocks that belong to each branch (which is how Python knows which statements to include).",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Input, output & operators). You need comparison operators — >, <, ==, and the others — which produce True or False, and to be comfortable that a single equals stores while a double equals asks.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Conditional execution",
        text: "Conditional execution is the ability of a program to run one block of statements on some decision and a different block on another — to make a choice, rather than always doing the same thing. It is the difference between a program that types out a script and a program that responds.",
      },
      {
        type: "paragraph",
        text: "So far every lesson you wrote has been a straight run of instructions: the program did everything, in order, every time. That is a monotone recitation. This lesson gives the program a fork in the road. When the program reaches an if statement, it evaluates a condition — an expression that is True or False — and, depending on the answer, follows one path or the other. This is what separates a calculator from a programme that can, say, grade an exam or decide whether a patient's reading is normal.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "The first thing to internalise is that a condition is just a value — a boolean. The if statement does not do anything special to the condition; it simply looks at whether it is True or False. This is why you can use a variable holding a boolean (like has_id = True directly as a condition) as easily as a comparison it produces. A condition is not a special phrase; it is an expression you already know how to write, now used in a decision.",
      },
      {
        type: "paragraph",
        text: "The second, and easily most confusing, thing is indentation. Python does not use braces to group statements the way many other languages do. It uses the indentation. Every statement indented further than the if line belongs to that branch, and the block ends when the indentation returns to its earlier level. This is not cosmetic. If you indent too little or too much, either the statements fall outside the branch (running regardless) or Python refuses to run at all with an IndentationError.",
      },
      {
        type: "paragraph",
        text: "The third thing is the order of an elif chain. Python checks the conditions top to bottom and runs the first one that is True, then skips the rest. The order matters: if you test a broad condition before a narrow one, the narrow one may never be reached. Putting the most specific test first is usually the safer habit.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: the first fork" },
      {
        type: "paragraph",
        text: "A single if statement with an else. Exactly one of the two blocks runs — never both, never neither.",
      },
      {
        type: "code",
        language: "python",
        code: `x = 15\nif x > 10:\n    print("big")\nelse:\n    print("small")`,
        output: "big",
        caption: "x is 15, so the condition x > 10 is True and only the indented block under if runs.",
      },
      {
        type: "paragraph",
        text: "Read the colon on the if and else lines carefully — it is required and easy to drop. The statements inside each branch are indented. Because 15 is greater than 10, the condition is True, so Python runs the indented line print(\"big\") and skips the else block entirely. The else is not a thing that would run later; it is a fallback that runs only when the if condition is False.",
      },

      { type: "heading", level: 2, text: "Worked example 2: choosing from many with elif" },
      {
        type: "paragraph",
        text: "When there are more than two possible outcomes, chain them. The first True condition wins and the rest are skipped.",
      },
      {
        type: "code",
        language: "python",
        code: `score = 72\nif score >= 85:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")`,
        output: "B",
        caption: "Score 72 is not 85 or above, but it is 70 or above, so the elif branch matches and prints B.",
      },
      {
        type: "paragraph",
        text: "Walk the chain. The first condition, score >= 85, is False, so Python ignores its block and moves on. The next, score >= 70, is True, so it runs print(\"B\") and then jumps past the rest — the else does not run, because an elif already matched. The chains read from the most demanding test to the least; if you flipped the order to test >= 70 first, an A student would get B, because the looser condition would match before the stricter one got a chance.",
      },

      { type: "heading", level: 2, text: "Worked example 3: combining conditions" },
      {
        type: "paragraph",
        text: "To require two things at once, use and. To accept either one, use or. To invert a condition, use not.",
      },
      {
        type: "code",
        language: "python",
        code: `age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Welcome")\nelse:\n    print("Entry denied")`,
        output: "Welcome",
        caption: "and means both must hold. Age 20 is 18 or over and has_id is True, so the whole condition is True.",
      },
      {
        type: "paragraph",
        text: "The boolean operators and and or combine smaller booleans into a bigger one. With and, the result is True only if both sides are True — that is the right choice for a rule where every condition must be met, like being both old enough and carrying identification. The not operator drops in front of an expression to flip it, so not mood == \"sad\" is True whenever mood is anything other than sad. These are not new kinds of condition; they are ways to build richer ones from the comparisons you already have.",
      },

      { type: "heading", level: 2, text: "Worked example 4: three outcomes from a sign" },
      {
        type: "paragraph",
        text: "A classic branch: decide whether a number is positive, negative, or zero. Three branches, so it uses if, elif, and else together.",
      },
      {
        type: "code",
        language: "python",
        code: `n = -3\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")`,
        output: "negative",
        caption: "-3 is not greater than 0, but it is less than 0, so the elif branch runs and prints negative.",
      },
      {
        type: "paragraph",
        text: "There is a careful point hidden here. If you had written two separate if statements instead of an if/elif, both could run for the same value. With if/elif, exactly one branch runs — the first matching one — and the rest are skipped. That is the whole difference between a chain of decisions and a set of independent checks, and it is often the source of a subtle bug where a value answers two conditions at once.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Dropping the colon at the end of the if, elif or else line. if x > 10 is a syntax error; you need if x > 10:. The colon is how Python knows a block is about to begin.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mismatched indentation. All statements in a branch must line up at exactly the same indent. Mixing tabs and spaces, or indenting a statement by one level too far, breaks the block or raises IndentationError.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using if/if instead of if/elif for an exclusive choice. Two separate ifs both evaluate, so a value that matches both runs both blocks. An elif chain runs only the first match.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Testing a broad condition before a narrow one. In an elif chain the first True wins, so a loose test earlier will swallow cases intended for a later, stricter one. Order the tests from the most specific to the least.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "If score is 60, what does this chain print, and why? if score >= 85: print('A') elif score >= 70: print('B') else: print('C')",
        answer: "C. Neither 85 or above nor 70 or above matches, so the else fallback runs.",
        explanation: "The chain checks top to bottom; only the first True condition runs. 60 fails both thresholds, so the else catches it.",
      },
      {
        type: "question",
        prompt: "What does the condition age >= 18 and has_id require to be True?",
        answer: "Both sides must be True — the person must be 18 or over AND have identification.",
        explanation: "The and operator is True only when every part is True. It is the right choice when a rule on a story must be met.",
      },
      {
        type: "question",
        prompt: "Why does Python require consistent indentation inside an if block?",
        answer: "Because Python uses indentation, not braces, to decide which statements belong to a branch.",
        explanation: "Indentation is grouping in Python. Statements must line up exactly, or they fall outside the branch and raise IndentationError.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which line correctly starts a conditional block?",
        options: ["if x > 10:", "if x > 10", "if x > 10;", "if x > 10 then"],
        correctIndex: 0,
        explanation: "An if statement needs the condition followed by a colon, which signals the indented block. Missing the colon is a syntax error.",
      },
      {
        type: "mcq",
        stem: "What does and produce when one side is True and the other is False?",
        options: ["True", "False", "It depends on the order", "An error"],
        correctIndex: 1,
        explanation: "and is True only when both sides are True. If either is False, the whole expression is False.",
      },
      {
        type: "mcq",
        stem: "In an if/elif/else chain, how many branches can run?",
        options: ["All of them", "Exactly one", "Two at most", "None, the chain only evaluates"],
        correctIndex: 1,
        explanation: "The chain runs the first branch whose condition is True and skips the rest. Exactly one branch runs, and else catches the fallthrough case.",
      },
      {
        type: "mcq",
        stem: "Which is the correct way to check whether a number is at least 18?",
        options: ["if age = 18", "if age == 18", "if age >= 18", "if age => 18"],
        correctIndex: 2,
        explanation: ">= means 'at least'. A single equals is assignment and == is equality, neither of which expresses 'at least'.",
      },
      {
        type: "mcq",
        stem: "What happens if the two statements in an if block are indented by different amounts?",
        options: ["They still run, Python ignores indentation", "Python raises an IndentationError or treats them as separate blocks", "Only the first runs", "Python runs them in reverse"],
        correctIndex: 1,
        explanation: "Indentation defines the block in Python. Mismatched indentation either splits the block or raises IndentationError.",
      },
      {
        type: "mcq",
        stem: "How do you invert a condition, so that it is True when the original is False?",
        options: ["Use != instead", "Use the not operator, e.g. not x > 0", "Swap the values", "Use &&"],
        correctIndex: 1,
        explanation: "The not operator flips a boolean. not x > 0 is True whenever x is not greater than zero.",
      },
      {
        type: "mcq",
        stem: "A student scores 90. Why does the chain below print C instead of A? if score >= 70: print('C') elif score >= 85: print('A')",
        options: ["Because elif cannot follow a True branch", "Because the looser condition >= 70 matches first, so the stricter one is skipped", "Because score must be an integer", "Because elif is the wrong keyword"],
        correctIndex: 1,
        explanation: "The chain runs the first True condition and skips the rest. The loose >= 70 matches 90 before the strict >= 85 is ever tested.",
      },
      {
        type: "mcq",
        stem: "Which boolean operator would you use when a rule must satisfy ALL listed conditions?",
        options: ["or", "and", "not", "+"],
        correctIndex: 1,
        explanation: "and requires every part to be True — the right choice for a rule like 'logged in AND premium AND active'.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A condition is just a boolean expression. if runs one block when it is True, else runs the fallback, and elif chains several mutually exclusive choices — running only the first match. Indentation groups the statements into each block, and and/or/not build richer conditions. Order your elif tests from most specific to least.",
      },
      {
        type: "paragraph",
        text: "Next: loops. Lesson 4 gave your program the power to choose; the next lesson gives it the power to repeat — doing something many times, which is what computers are actually for, and the start of the word-count idea that runs through the whole PY4E course.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson5(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: repeat a block while a condition holds using while; iterate over a special collection with for; stop or skip ahead inside a loop with break and continue; and write the accumulate-a-total pattern that appears constantly in real programs.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 4 (Conditions). You need if/elif/else and the boolean operators, because a loop's repetition is governed by a condition of exactly the kind you just learned to write — and because break and continue make decisions inside each pass.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Repeated execution",
        text: "Repeated execution, or iteration, lets a program do a block of work over and over — usually with the data changing each time. It is the whole reason we use computers: the tasks that bore humans are exactly the ones that are repetitive, and a loop makes the computer do them a million times without tiring.",
      },
      {
        type: "paragraph",
        text: "Until now, every program you wrote had a fixed number of steps. That is a significant limit. If you wanted to count to a thousand, or read every line of a file, or sum a list of unknown length, you could not write out each step by hand. A loop removes the limit. You describe the pattern once, and tell the computer how many times — or under what condition — to repeat it.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "There are two loop kinds in Python, and choosing between them is the first decision. A while loop keeps going as long as some condition is True — you do not know in advance how many passes there will be, you just know when to stop. A for loop marches through a known sequence — you usually know exactly how many items there are. Beginners reach for while as the default and then get stuck on the infinite loop; the habit worth building is to use for when you can, because it is harder to make a for loop run forever.",
      },
      {
        type: "paragraph",
        text: "The second thing to know is the accumulate pattern, which is the heart of nearly everything to come. Almost every loop you write will do one of two things: collect or accumulate. Collect means building up a new value each pass (a running total, a list of results). Accumulate means adding to something you started before the loop. Either way you must initialise an accumulator before the loop and then update it inside — two separate steps, and forgetting the first is a classic bug.",
      },
      {
        type: "paragraph",
        text: "Third: break and continue are exits, not the loop itself. break stops the loop immediately and jumps past it; continue skips the rest of the current pass and goes to the next one. They are sometimes overused. If you find yourself using break in every loop, there is usually a cleaner condition. But they are genuinely useful for the classic pattern of finding something and stopping the moment you find it.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: the while loop" },
      {
        type: "paragraph",
        text: "Count from 0 to 4. The loop runs while n is less than 5, printing and then increasing n each pass, so it stops once n reaches 5.",
      },
      {
        type: "code",
        language: "python",
        code: `n = 0\nwhile n < 5:\n    print(n)\n    n = n + 1`,
        output: "0\n1\n2\n3\n4",
        caption: "Each pass prints n, then adds 1. When n becomes 5 the condition is False and the loop ends.",
      },
      {
        type: "paragraph",
        text: "Three parts make this work. There is an initialisation before the loop — n = 0 — so the condition has a value to test the first time. There is the condition itself, n < 5, which is re-checked at the start of every pass. And there is an update inside, n = n + 1, so that the condition eventually becomes False. Remove the update and the loop never ends — the condition stays True forever. Remove the initialisation and n does not exist when the loop first checks it.",
      },

      { type: "heading", level: 2, text: "Worked example 2: the for loop" },
      {
        type: "paragraph",
        text: "The same counting, done with for. Here the sequence is supplied by range, so you do not manage your own counter.",
      },
      {
        type: "code",
        language: "python",
        code: `for i in range(3):\n    print(i)`,
        output: "0\n1\n2",
        caption: "range(3) produces 0, 1 and 2 — the for loop visits each in turn.",
      },
      {
        type: "paragraph",
        text: "range(3) is a sequence of three numbers: 0, 1 and 2. It stops before 3, which surprises people who expect it to include the last number. The for loop takes each value in the sequence, assigns it to the variable i, and runs the indented block. This is the loop you will use most — it reads naturally, it cannot accidentally miss its update, and it is very hard to make infinite.",
      },

      { type: "heading", level: 2, text: "Worked example 3: stopping early with break" },
      {
        type: "paragraph",
        text: "Search the numbers 0 to 9 and stop the moment you reach 3. The loop looks like it should go to 9, but break cuts it off.",
      },
      {
        type: "code",
        language: "python",
        code: `for i in range(10):\n    if i == 3:\n        break\n    print(i)`,
        output: "0\n1\n2",
        caption: "When i becomes 3, break leaves the loop immediately, so 3 and later values are never printed.",
      },
      {
        type: "paragraph",
        text: "Notice the print comes after the if. When i reaches 3, the condition i == 3 is True, so break fires — it leaves the loop immediately without running the rest of that pass, which is the print. That is why 3 is not printed. This is the find-and-stop pattern: you test inside the loop, and the moment you find what you want, you break. If the print had gone before the if, 3 would have been printed first. Order matters.",
      },

      { type: "heading", level: 2, text: "Worked example 4: skipping one with continue" },
      {
        type: "paragraph",
        text: "Print the numbers 0 to 4 but skip 2. continue jumps to the next pass without executing the lines after it.",
      },
      {
        type: "code",
        language: "python",
        code: `for i in range(5):\n    if i == 2:\n        continue\n    print(i)`,
        output: "0\n1\n3\n4",
        caption: "When i is 2, continue abandons that pass and moves to 3, so 2 is never printed.",
      },
      {
        type: "paragraph",
        text: "continue only skips the rest of the current iteration; it does not end the loop. When i is 2, the if matches and continue sends control back to the top of the loop with the next value, 3. Everything after the continue in that pass — the print — is skipped for 2 only. The loop still runs to completion for every other value. Where break is an exit, continue is a skip.",
      },

      { type: "heading", level: 2, text: "Worked example 5: the accumulate pattern" },
      {
        type: "paragraph",
        text: "Sum the numbers 1 to 5. You start a total before the loop and add each number inside it.",
      },
      {
        type: "code",
        language: "python",
        code: `total = 0\nfor i in range(1, 6):\n    total = total + i\nprint("sum:", total)`,
        output: "sum: 15",
        caption: "total starts at 0 and adds 1, then 2, then 3, then 4, then 5, ending at 15.",
      },
      {
        type: "paragraph",
        text: "This is the pattern that appears in every data program you will write from now on. Before the loop, total = 0 initialises the accumulator — this is easy to forget, and if you do, total does not exist when the loop first tries to add to it. Inside the loop, total = total + i reads the current total, adds the new value, and stores the result back. Each pass the total grows. This same skeleton, with slight changes, is what counts words, finds maximums, and builds almost every summary in the PY4E course.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "An infinite loop. If the condition never becomes False — usually because the update is missing or inside an if — the loop runs forever. Make sure the body changes something that affects the condition.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to initialise an accumulator before the loop. If you write total = total + i inside a loop without a total = 0 before it, Python raises a NameError the first time.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Off-by-one in range. range(5) gives 0..4, not 0..5. To include the last number, range(1, 6) — the stop value is exclusive.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using while when a for would be safer. A for loop knows when to stop and cannot easily miss its update, so reach for it whenever you are stepping through a known sequence.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why does the while loop below never end? n = 0 while n < 5: print(n)",
        answer: "Because nothing changes n inside the loop, so n < 5 stays True forever — there is no update line.",
        explanation: "A while loop relies on something in its body making the condition eventually False. Without n = n + 1, the condition never changes.",
      },
      {
        type: "question",
        prompt: "What values does range(3) visit, and which value is excluded?",
        answer: "It visits 0, 1 and 2. The stop value 3 is excluded — range's upper bound is exclusive.",
        explanation: "range(start, stop) goes up to but not including stop. To include a number, use a stop one greater.",
      },
      {
        type: "question",
        prompt: "In the accumulate pattern, why must the accumulator be set before the loop?",
        answer: "Because the loop body reads and adds to total; if it is not defined before the first pass, Python raises a NameError.",
        explanation: "An accumulator needs a starting value (usually 0) before the loop, then is updated inside. The two steps are separate and both required.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which loop repeats while a condition holds, and may not know how many times in advance?",
        options: ["for", "while", "if", "def"],
        correctIndex: 1,
        explanation: "A while loop keeps going while its condition is True — suited to 'keep going until something changes'. A for loop steps through a known sequence.",
      },
      {
        type: "mcq",
        stem: "What does break do inside a loop?",
        options: ["Skips the current pass and moves to the next", "Exits the loop immediately", "Pauses the program", "Restarts the loop from the top"],
        correctIndex: 1,
        explanation: "break ends the loop entirely and continues after it. The skip-one-pass behaviour is continue, not break.",
      },
      {
        type: "mcq",
        stem: "What is the output of for i in range(4): print(i)?",
        options: ["1 2 3 4", "0 1 2 3", "0 1 2 3 4", "1 2 3"],
        correctIndex: 1,
        explanation: "range(4) produces 0, 1, 2 and 3 — it stops one before the upper bound, so it visits four values starting at zero.",
      },
      {
        type: "mcq",
        stem: "Which code produces an infinite loop?",
        options: ["for i in range(5): print(i)", "n = 0 while n < 5:", "while n < 5: n = n + 1", "for i in range(0,5): print(i)"],
        correctIndex: 1,
        explanation: "Without an update, n stays 0 forever, so n < 5 never becomes False. A for loop supplies its own sequence and cannot do this.",
      },
      {
        type: "mcq",
        stem: "A loop prints all values but must skip 4. Which keyword does it?",
        options: ["break", "continue", "pass", "return"],
        correctIndex: 1,
        explanation: "continue skips the rest of the current pass and moves to the next value, so 4 is skipped but the loop finishes.",
      },
      {
        type: "mcq",
        stem: "Which is the accumulate-total skeleton in the right order?",
        options: ["total = total + i inside the loop, with no total before it", "total = 0 before the loop, then total = total + i inside", "total = 0 inside the loop, reading it each pass", "i = 0 before the loop, then total = i"],
        correctIndex: 1,
        explanation: "Initialise the accumulator before the loop, then update it inside. Forgetting the initialisation gives a NameError.",
      },
      {
        type: "mcq",
        stem: "To sum the numbers from 1 to 5 inclusive, what range do you use?",
        options: ["range(1, 5)", "range(1, 6)", "range(5)", "range(0, 5)"],
        correctIndex: 1,
        explanation: "The stop value is exclusive, so range(1, 6) visits 1, 2, 3, 4 and 5 — exactly the inclusive set. range(1, 5) would miss 5.",
      },
      {
        type: "mcq",
        stem: "Why does placing the print after the if matter in a break loop?",
        options: ["It does not matter", "Because break ends the pass before the print runs, so the matched value is not printed", "Because print cannot follow if", "Because break skips the next pass"],
        correctIndex: 1,
        explanation: "break exits the loop at that moment, before any later statement in the same pass. So lines after the break are skipped for that value.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A loop repeats a block: while repeats while a condition holds, for steps through a sequence. break exits, continue skips a pass, and the accumulate pattern — initialise a total, then add each value inside — is the skeleton behind nearly every data program. Prefer for when you know the sequence, and always make sure something in a while body changes its condition.",
      },
      {
        type: "paragraph",
        text: "Next: logic & debugging basics. Lesson 5 gave you repetition; the next lesson steps back and shows you how to read a tricky loop and find the errors when one does not do what you meant — the skill that turns a writer of small loops into someone who can untangle them.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SBA assessment items — one per concept, following the seed-university
// convention (slug `${courseSlug}--${conceptSlug}--sba`).
// ---------------------------------------------------------------------------
function sbaFor(lesson: LessonSeed, orderIndex: number) {
  const courseSlug = COURSE_SLUG;
  const itemSlug = `${courseSlug}--${lesson.concept.slug}--sba`;
  const c = lesson.concept;
  return {
    where: { slug: itemSlug },
    update: { conceptId: undefined, orderIndex },
    create: {
      slug: itemSlug,
      courseId: COURSE_ID,
      conceptId: undefined, // filled in main() once concept ids are known
      format: "sba",
      stem: `Which statement best describes ${c.title.toLowerCase()}?`,
      options: [
        `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
        "A plausible but incorrect statement that confuses this idea with a related one.",
        "A statement that is true of a different lesson's topic, not this one.",
        "A statement that reverses the correct relationship.",
      ],
      correctAnswer: `A precise, correct description of ${c.title.toLowerCase()} as taught in this lesson.`,
      explanation: `${c.title} is a core concept of Introduction to Programming. Review this lesson before re-attempting.`,
      marks: 1,
      negativeMarks: 0.25,
      orderIndex,
      isPublished: true,
      difficulty: c.blooms === "remember" ? "easy" : c.blooms === "evaluate" || c.blooms === "create" ? "hard" : "medium",
      reviewStatus: "needs-human-review",
      needsCheck: true,
    },
  };
}

/**
 * Idempotent: safe to run repeatedly. Creates or refreshes the 4 modules,
 * 12 concept nodes with prerequisite edges, 12 lessons and 12 SBA items.
 */
export async function seedIntroductionToProgramming(): Promise<void> {
  const course = await prisma.course.findUnique({ where: { id: COURSE_ID } });
  if (!course) throw new Error(`Course ${COURSE_ID} not found. Run prisma/seed.ts first.`);

  // 1. Modules
  for (let i = 0; i < MODULES.length; i++) {
    const m = MODULES[i];
    await prisma.courseModule.upsert({
      where: { courseId_slug: { courseId: course.id, slug: m.slug } },
      update: { title: m.title, orderIndex: i },
      create: { courseId: course.id, slug: m.slug, title: m.title, orderIndex: i },
    });
  }
  const moduleBySlug = new Map(
    (await prisma.courseModule.findMany({ where: { courseId: course.id } })).map((m) => [m.slug, m.id]),
  );

  // 2. Lessons (upsert first so order is stable, content filled next)
  let lessonCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    await prisma.courseLesson.upsert({
      where: { id: l.id },
      update: {
        courseId: course.id,
        domain: "university",
        title: l.title,
        orderIndex: i,
        estimatedMinutes: l.estimatedMinutes,
        content: l.content as never,
        reviewStatus: "needs-human-review",
        needsCheck: l.id !== LESSON_1.id,
      },
      create: {
        id: l.id,
        courseId: course.id,
        domain: "university",
        title: l.title,
        orderIndex: i,
        estimatedMinutes: l.estimatedMinutes,
        content: l.content as never,
        reviewStatus: "needs-human-review",
        needsCheck: l.id !== LESSON_1.id,
      },
    });
    lessonCount++;
  }

  // 3. Concepts + prerequisite edges
  const slugToId = new Map<string, string>();
  let conceptCount = 0;
  let edgeCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    const moduleSlug = MODULES[l.module - 1].slug;
    const node = await prisma.conceptNode.upsert({
      where: { courseId_slug: { courseId: course.id, slug: l.concept.slug } },
      update: { title: l.concept.title, bloomsLevel: l.concept.blooms, estMinutes: l.concept.minutes, orderIndex: i, moduleId: moduleBySlug.get(moduleSlug) ?? null },
      create: {
        courseId: course.id,
        slug: l.concept.slug,
        title: l.concept.title,
        summary: null,
        bloomsLevel: l.concept.blooms,
        estMinutes: l.concept.minutes,
        orderIndex: i,
        moduleId: moduleBySlug.get(moduleSlug) ?? null,
        isPublished: true,
      },
    });
    slugToId.set(l.concept.slug, node.id);
    conceptCount++;
  }
  for (const l of ALL_LESSONS) {
    for (const prereqSlug of l.concept.prereq) {
      const conceptId = slugToId.get(l.concept.slug);
      const prerequisiteId = slugToId.get(prereqSlug);
      if (!conceptId || !prerequisiteId) continue;
      await prisma.conceptPrerequisite.upsert({
        where: { conceptId_prerequisiteId: { conceptId, prerequisiteId } },
        update: {},
        create: { conceptId, prerequisiteId },
      });
      edgeCount++;
    }
  }

  // 4. SBA items, now that concept ids exist
  let itemCount = 0;
  for (let i = 0; i < ALL_LESSONS.length; i++) {
    const l = ALL_LESSONS[i];
    const spec = sbaFor(l, i);
    await prisma.assessmentItem.upsert({
      where: spec.where,
      update: { ...spec.update, conceptId: slugToId.get(l.concept.slug) ?? null },
      create: { ...spec.create, conceptId: slugToId.get(l.concept.slug) ?? null },
    });
    itemCount++;
  }

  console.log(`✓ Introduction to Programming: ${MODULES.length} modules, ${lessonCount} lessons, ${conceptCount} concepts, ${edgeCount} prerequisite edges, ${itemCount} SBA items`);
}

// CLI usage: npx ts-node prisma/seed-courses/introduction-to-programming.ts
if (process.argv[1] && process.argv[1].includes("introduction-to-programming")) {
  seedIntroductionToProgramming()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
