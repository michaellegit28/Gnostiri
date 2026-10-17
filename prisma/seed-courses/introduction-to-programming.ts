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
  { id: `${COURSE_ID}-lesson-3`, title: "Input, output & operators", module: 1, estimatedMinutes: 30, concept: { title: "Input, output and operators", slug: "input-output-operators", blooms: "apply", minutes: 30, prereq: ["variables-and-types"] }, content: pending(3) },
  { id: `${COURSE_ID}-lesson-4`, title: "Conditions", module: 2, estimatedMinutes: 30, concept: { title: "Conditional statements", slug: "conditionals", blooms: "understand", minutes: 30, prereq: ["input-output-operators"] }, content: pending(4) },
  { id: `${COURSE_ID}-lesson-5`, title: "Loops", module: 2, estimatedMinutes: 35, concept: { title: "Loops and iteration", slug: "loops", blooms: "understand", minutes: 35, prereq: ["conditionals"] }, content: pending(5) },
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
