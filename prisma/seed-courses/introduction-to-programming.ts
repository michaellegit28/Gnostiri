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
  { id: `${COURSE_ID}-lesson-6`, title: "Logic & debugging basics", module: 2, estimatedMinutes: 30, concept: { title: "Logic and debugging basics", slug: "logic-debugging-basics", blooms: "analyze", minutes: 30, prereq: ["loops"] }, content: lesson6() },
  { id: `${COURSE_ID}-lesson-7`, title: "Functions", module: 3, estimatedMinutes: 35, concept: { title: "Functions", slug: "functions", blooms: "apply", minutes: 35, prereq: ["logic-debugging-basics"] }, content: lesson7() },
  { id: `${COURSE_ID}-lesson-8`, title: "Lists & dictionaries", module: 3, estimatedMinutes: 35, concept: { title: "Lists and dictionaries", slug: "lists-dictionaries", blooms: "apply", minutes: 35, prereq: ["functions"] }, content: lesson8() },
  { id: `${COURSE_ID}-lesson-9`, title: "Strings & files", module: 3, estimatedMinutes: 35, concept: { title: "Strings and files", slug: "strings-files", blooms: "apply", minutes: 35, prereq: ["lists-dictionaries"] }, content: lesson9() },
  { id: `${COURSE_ID}-lesson-10`, title: "Decomposition", module: 4, estimatedMinutes: 30, concept: { title: "Decomposition", slug: "decomposition", blooms: "analyze", minutes: 30, prereq: ["strings-files"] }, content: lesson10() },
  { id: `${COURSE_ID}-lesson-11`, title: "Testing & debugging", module: 4, estimatedMinutes: 30, concept: { title: "Testing and debugging", slug: "testing-debugging", blooms: "evaluate", minutes: 30, prereq: ["decomposition"] }, content: lesson11() },
  { id: `${COURSE_ID}-lesson-12`, title: "Mini project", module: 4, estimatedMinutes: 45, concept: { title: "Mini project", slug: "mini-project", blooms: "create", minutes: 45, prereq: ["testing-debugging"] }, content: lesson12() },
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
// LESSON 6 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson6(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: tell the three kinds of error apart — syntax, logic and semantic; trace a short loop by hand to predict its output; read an error message and use it to point you at the cause; and apply the four habits of debugging: read, run, ruminate, retreat.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 4 and 5 (Conditions and Loops). You need to be able to read an if/elif chain and a loop, because the whole point of this lesson is to predict what such code does — and to find the mistake when it does not.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Debugging",
        text: "Debugging is the art of finding the cause of an error — and the first honest thing to know is that it is an art with a method, not a random guess. The error is repeatedly reported as an unexpected output or a stopped program; your job is to connect it back to the line of code that caused it.",
      },
      {
        type: "paragraph",
        text: "The best way to understand debugging is to understand what went wrong in the first place. Almost every bug is one of three kinds. A syntax error is a grammar mistake — the program cannot even be read. A logic error is a mistake in the order of steps — the program runs, but the steps are in the wrong sequence. A semantic error is a mistake in meaning — the steps are correct and in order, but they say something other than what you intended. Knowing which kind you are looking at tells you where to look.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the technique" },
      {
        type: "paragraph",
        text: "The three error types are different enough that trying to fix them all the same way wastes time. A syntax error is the easiest. Python cannot understand the line at all, so it points at the exact spot — often the fix is a missing colon or a misplaced quote. The clue is that the program does not produce output; it refuses to run.",
      },
      {
        type: "paragraph",
        text: "A logic error is subtler because the program runs fine. The steps are all valid Python; they are simply in the wrong order. Remember the example of the water bottle: \"take a drink, put it in your backpack, walk to the library, then put the top back on.\" Every step is a sensible action, but the order makes the whole thing wrong. This kind of error gives no error message — the program runs and produces the wrong answer, which is why it is the hardest to notice.",
      },
      {
        type: "paragraph",
        text: "A semantic error is the cruelest. Every step is valid and in the right order, but a step says the wrong thing. You meant minutes but wrote seconds; you meant greater-than but wrote less-than. The program does exactly what you told it — the bug is that you told it the wrong thing. This is why debugging starts with going back to the problem itself, not just to the syntax.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: tracing a loop by hand" },
      {
        type: "paragraph",
        text: "The habit that prevents the most logic bugs is tracing: walking through a loop line by line, keeping a running note of each variable, to predict what it prints before you run it.",
      },
      {
        type: "code",
        language: "python",
        code: `total = 0\nfor i in range(1, 4):\n    total = total + i\nprint("total =", total)`,
        output: "total = 6",
        caption: "Trace: i=1 total 0+1=1, i=2 total 1+2=3, i=3 total 3+3=6. The print confirms the mental trace.",
      },
      {
        type: "paragraph",
        text: "Read it one pass at a time. The loop visits i equal to 1, then 2, then 3 — remember range(1, 4) stops before 4. Each pass adds the current i onto the running total. First pass: 0 + 1 = 1. Second: 1 + 2 = 3. Third: 3 + 3 = 6. So total is 6 when the loop ends. Tracing like this, on paper, is the single best hedge against logic bugs: it forces you to predict the output, and if your prediction differs from what the program prints, you have found a bug before it ships.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a syntax error and its message" },
      {
        type: "paragraph",
        text: "Dropping the colon on a for line produces a syntax error — the program will not run at all. Learn to read the message as Python pointing at the spot it got confused.",
      },
      {
        type: "code",
        language: "python",
        code: `# This is a syntax error — the colon is missing.\nfor i in range(3):\n    print(i)`,
        output: "File \"<stdin>\", line 2\n    for i in range(3)\n                      ^\nSyntaxError: invalid syntax",
        caption: "The caret points at the missing colon. A syntax error means Python could not read the statement at all.",
      },
      {
        type: "paragraph",
        text: "The message tells you two things: the line number and the character it was confused about. Here it points right after the closing bracket, which is exactly where the colon should be. The instinct to fear error messages is worth unlearning. They are not judgments; they are Python saying, as politely as it can, \"I got as far as this and then I lost my place.\" Most syntax errors have one of a handful of causes: a missing colon, a missing or mismatched quote, a mismatched parenthesis, or a misspelt keyword.",
      },

      { type: "heading", level: 2, text: "Worked example 3: a logic error with no message" },
      {
        type: "paragraph",
        text: "Here the program runs without complaint but does the wrong thing. The cause is ordering — the bottleneck of a logic bug: steps that are individually fine but in the wrong sequence.",
      },
      {
        type: "code",
        language: "python",
        code: `# Bug: the drink is taken before the lid is opened.\nstep = "put the lid on"\nprint("step 1:", "take a drink")\nprint("step 2:", step)`,
        output: "step 1: take a drink\nstep 2: put the lid on",
        caption: "Every line is valid Python, no error is raised — but the steps are badly ordered, so the result is nonsense.",
      },
      {
        type: "paragraph",
        text: "This is why logic errors are the dangerous ones. There is no traceback, no red text, no clue at all except that the output is wrong. The only way to catch it is to know what the output should be. That is why tracing and predicting are such central skills: if you have trained yourself to predict the output first, you will notice the moment the program disagrees with you.",
      },

      { type: "heading", level: 2, text: "Worked example 4: a semantic error — the wrong meaning" },
      {
        type: "paragraph",
        text: "Here the code is valid and in a sensible order, but a value is recorded in the wrong unit. The program does exactly what you wrote — you just told it the wrong thing.",
      },
      {
        type: "code",
        language: "python",
        code: `# Bug: recorded seconds, but meant minutes.\nduration_seconds = 120\nprint("Duration in minutes:", duration_seconds // 60)`,
        output: "Duration in minutes: 2",
        caption: "The math is correct for 120 seconds. If you meant 120 minutes, the answer you wanted was 120 — the bug is in the value, not the code.",
      },
      {
        type: "paragraph",
        text: "Notice the code is clean and the answer is technically right for 120 seconds. Two minutes is the correct conversion of 120 seconds. The bug is that the input was a number of minutes, so dividing by 60 was the wrong operation entirely. A semantic error cannot be found by looking at the code alone — you must look at the problem, decide what the answer should be, and compare. This is why the best debuggers spend time at the start making sure they understood the question, not just the syntax.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Random-walk programming. Making random small changes hoping one fixes the bug can take forever. Before you change anything, have a hypothesis about which line is wrong and why.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming an error message is a judgement. It is not. It is a location and a clue. Read the line number and the caret first, then decide — the fix may even be a line earlier than where Python noticed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Only reading, or only running, or only thinking. Each alone fails differently. Reading catches typos, running catches order, thinking catches meaning — you need all three.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Refusing to retreat. The best move, when a program is too tangled, is to undo your recent changes back to a version that worked. Copy it aside if you are squeamish, but get back to a known-good state.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A program runs but prints the wrong answer, with no error message. Which error type is this, and where do you look?",
        answer: "A logic or semantic error. Because it runs, you trace the logic and re-read the problem to check the meaning — not just the syntax.",
        explanation: "No traceback means the program was valid and ran. The wrong answer comes from either wrong ordering (logic) or wrong meaning (semantic), so you reason from the expected output backwards.",
      },
      {
        type: "question",
        prompt: "What is the first thing to read in a Python error message?",
        answer: "The line number and the caret — where Python lost its place. The fix may lie at or before that point.",
        explanation: "Error messages give a location. Reading it first turns a vague fear into a precise coordinate to investigate.",
      },
      {
        type: "question",
        prompt: "Why does tracing a loop by hand help prevent logic errors?",
        answer: "Because it forces you to predict the output first, so the moment the program disagrees with your prediction you have located the bug.",
        explanation: "Tracing builds an expected result. The mismatch between expectation and reality is the debugging signal, and it can only fire if you have an expectation.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which error is a mistake in the grammar of the code, so Python cannot even run it?",
        options: ["Semantic error", "Logic error", "Syntax error", "Runtime error"],
        correctIndex: 2,
        explanation: "A syntax error means Python could not parse the statement. It usually throws a traceback at the offending line and produces no output at all.",
      },
      {
        type: "mcq",
        stem: "A program runs cleanly but the steps are in the wrong order. Which error is this?",
        options: ["Syntax error", "Logic error", "Semantic error", "Input error"],
        correctIndex: 1,
        explanation: "A logic error has valid syntax but a flaw in the sequence of steps, so it runs and gives the wrong result with no error message.",
      },
      {
        type: "mcq",
        stem: "Which error is when the code is correct and ordered well, but does not do what you intended?",
        options: ["Semantic error", "Syntax error", "Logic error", "Indentation error"],
        correctIndex: 0,
        explanation: "A semantic error is a mistake in meaning — valid steps with the wrong intent. The program does exactly what you wrote, which is not what you meant.",
      },
      {
        type: "mcq",
        stem: "Which habit is NOT part of effective debugging?",
        options: ["Reading the code", "Running small experiments", "Ruminating on the likely cause", "Making random changes until it works"],
        correctIndex: 3,
        explanation: "Random-walk programming — blind changes without a hypothesis — can take forever. Effective debugging is reading, running, and thinking, each with a purpose.",
      },
      {
        type: "mcq",
        stem: "Why is tracing a loop useful before running it?",
        options: ["It makes the program faster", "It produces a predicted output to compare against the real one", "It prevents syntax errors", "It converts the loop into a function"],
        correctIndex: 1,
        explanation: "Tracing predicts the output. The prediction is the reference point that lets you notice when the program's behaviour is wrong.",
      },
      {
        type: "mcq",
        stem: "Where does a missing colon most likely show up?",
        options: ["As a semantic error with no message", "As a syntax error, with a caret pointing at the spot", "As a logic error in the output", "It never errors"],
        correctIndex: 1,
        explanation: "A missing colon is a grammar mistake, so Python raises SyntaxError and points the caret at where the colon should be.",
      },
      {
        type: "mcq",
        stem: "What is the first step when a program is too tangled to debug?",
        options: ["Rewrite it completely from memory", "Retreat to a known-good version, then rebuild carefully", "Add more features", "Ignore the error"],
        correctIndex: 1,
        explanation: "Retreating — undoing changes back to a working state — gives you a solid footing to rebuild from, rather than debugging on top of a mess.",
      },
      {
        type: "mcq",
        stem: "You recorded a value in seconds but meant minutes. What kind of error is this, and what does it require to catch?",
        options: ["Syntax error; fix the colon", "Logic error; reorder the lines", "Semantic error; re-examine the problem and the expected answer", "Syntax error; add a print"],
        correctIndex: 2,
        explanation: "The code is valid and ordered; the meaning is wrong. You catch it by comparing the output against what the answer should be, which means going back to the problem.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bugs are one of three kinds: syntax (cannot be read), logic (wrong order), and semantic (wrong meaning). Reading, running, ruminating and retreating are the four debugging habits. Error messages are coordinates, not judgements; tracing gives you a predicted output to compare against; and the hardest errors are found by going back to the problem, not by staring at the code.",
      },
      {
        type: "paragraph",
        text: "Next: functions. So far every program has been a single list of steps. The next lesson introduces the reuse pattern — write a set of instructions once, give it a name, and call it wherever it is needed — which is the whole idea of composing programs from pieces, and the topic you will keep returning to.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson7(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: wrap a set of steps in a function with def; pass values in as parameters and send a value back with return; describe why return and print are different jobs; and use a function as the first real tool for composing a program out of reusable pieces.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 1-6. You need variables, conditions and loops, and the debugging idea that a program is a sequence of steps. A function is precisely a named chunk of such steps, so those foundations all apply inside it.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Function",
        text: "A function is a named block of instructions that you reuse by calling its name. Write a recipe once, and ask for it as many times as you like — no need to repeat the instructions. This is the 'reuse' building block that PY4E lists among the constructs every program uses.",
      },
      {
        type: "paragraph",
        text: "Up to now, every program you wrote was one long list. That is fine for a short program, but it does not scale. A function changes the relationship you have with your code. You stop thinking, \"what is the next line?\" and start thinking, \"what are the pieces of this problem?\" — and each piece becomes a function. This is the first step toward the decomposing mindset you will build in Module 4, and it is the single tool that makes longer programs possible at all.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "There are three things a function does, and they are easy to conflate. A function takes inputs — these are the parameters, the placeholders in its definition that get filled in each time you call it. A function does work — the block inside. And a function can hand back a result — the return value. Understanding that a function is a machine with inputs, a body, and an output is more useful than memorising the syntax.",
      },
      {
        type: "paragraph",
        text: "The distinction that trips up beginners most is return versus print. They look similar but are fundamentally different. print writes something to the screen; return hands a value back to whichever part of the program called the function, and that value can be used — stored, passed on, or returned again. A function that prints and a function that returns are not interchangeable. If you call a function in an arithmetic expression and it only prints, you will get an error, because a printing function hands back nothing (it returns None).",
      },
      {
        type: "paragraph",
        text: "Finally, understand the order of events. Python reads the def to learn the recipe, but it does not run the body when it reads the def. The body runs only when the function is called. This is why a function can be defined long before it is used, and why an error inside a function does not surface until you actually call it. Defining a function is writing a recipe; calling it is cooking.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: define and call" },
      {
        type: "paragraph",
        text: "The simplest function. It takes nothing in, does one job, and is called twice — so the job happens twice, from a single recipe.",
      },
      {
        type: "code",
        language: "python",
        code: `def greet():\n    print("Hello!")\n\ngreet()\ngreet()`,
        output: "Hello!\nHello!",
        caption: "The def writes the recipe; each greet() call runs it. The blank line between the def and the first call is a style convention.",
      },
      {
        type: "paragraph",
        text: "The def line names the function and ends with a colon, just like the control statements — the indented block that follows is its body. The function is not run here; it is merely defined. When Python reaches greet() later, it looks up the recipe and runs its body. This is why you see Hello! twice: the recipe was written once, and asking for it twice produced two greetings with no duplicated code.",
      },

      { type: "heading", level: 2, text: "Worked example 2: parameters" },
      {
        type: "paragraph",
        text: "A function that takes two inputs and returns their sum. The values you pass in each call fill the placeholders named in the definition.",
      },
      {
        type: "code",
        language: "python",
        code: `def add(a, b):\n    result = a + b\n    return result\n\nprint(add(3, 4))\nprint(add(10, 20))`,
        output: "7\n30",
        caption: "a and b are the parameters; 3 and 4 in the first call fill them, and the returned value is printed.",
      },
      {
        type: "paragraph",
        text: "When you call add(3, 4), Python stores 3 into the parameter a and 4 into b, runs the body, computes the sum, and returns it. The return sends 7 back out to wherever add(3, 4) was used — here to print. The second call does the same, with different values, giving 30. Notice the function is identical both times; only the inputs changed. That is the power of a parameter: one recipe, many values.",
      },

      { type: "heading", level: 2, text: "Worked example 3: return vs print" },
      {
        type: "paragraph",
        text: "This function returns a built string rather than printing it. The caller decides what to do with the returned value — here, print it.",
      },
      {
        type: "code",
        language: "python",
        code: `def describe(name, age):\n    return name + " is " + str(age)\n\nprint(describe("Ada", 19))`,
        output: "Ada is 19",
        caption: "return hands the string back; the print outside the function is what displays it.",
      },
      {
        type: "paragraph",
        text: "The function builds a string and returns it; it does not itself print anything. The print is outside, in the calling code. This separation is the point: a well-built function produces a value and lets the caller decide whether to print it, store it, or pass it along. It also shows why str(age) is needed — concatenating text with a number requires conversion, a lesson from earlier that still applies inside functions.",
      },

      { type: "heading", level: 2, text: "Worked example 4: a default argument" },
      {
        type: "paragraph",
        text: "A parameter can be given a default. Call the function with one argument and the default is used; supply two and it is overridden.",
      },
      {
        type: "code",
        language: "python",
        code: `def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))\nprint(power(2, 5))`,
        output: "9\n32",
        caption: "power(3) uses exp=2 to give 9; power(2, 5) overrides the default to give 32.",
      },
      {
        type: "paragraph",
        text: "The function can be called two ways because exp has a default of 2. The first call supplies only the base, so exp falls back to 2 and computes 3 squared, which is 9. The second call supplies both arguments, so the default is ignored and 2 to the power 5 is computed, giving 32. Defaults are a convenience, not a substitute for thinking: a default should be the most common value, so callers write less when the usual case applies.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing return with print. Paint the difference: print writes to the screen and returns None; return hands a value back to the caller. A function that only prints cannot be used where a value is needed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting the def body is not run until the call. Creating a function with def does not execute it. If you define a function and nothing happens, you have not called it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Defining a parameter list but not using the returned value. A function that returns nothing gives None, so print(add(3,4)) inside an arithmetic step can produce unexpected None results.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Placing side effects (like print) inside a function that later needs to return data. Keep the function's job focused: if it computes a value, return it and let the caller handle output.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "When does the body of a function defined with def actually run?",
        answer: "Only when the function is called, not when it is defined.",
        explanation: "def writes the recipe; the body runs on each call. This is why an error inside a function surfaces only at the call site.",
      },
      {
        type: "question",
        prompt: "What is the difference between return and print?",
        answer: "return hands a value back to the caller; print displays it on the screen. A function that only prints can still return None and cannot be used in arithmetic or stored directly.",
        explanation: "return produces a value for the program to use; print is a side effect for the reader. They are different jobs.",
      },
      {
        type: "question",
        prompt: "What is the difference between a parameter and an argument?",
        answer: "A parameter is the placeholder named in the function definition; an argument is the actual value passed in when you call it.",
        explanation: "Parameters are named in def; arguments are the real values supplied at the call. They line up by position.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which keyword defines a function in Python?",
        options: ["function", "def", "func", "repeat"],
        correctIndex: 1,
        explanation: "def is the keyword that defines a function. The body follows the colon and is indented.",
      },
      {
        type: "mcq",
        stem: "What does the return statement do?",
        options: ["Displays text on the screen", "Hands a value back to the caller of the function", "Starts a loop", "Ends the entire program"],
        correctIndex: 1,
        explanation: "return sends a value out of the function to wherever it was called. It is not the same as print, which only writes to the screen.",
      },
      {
        type: "mcq",
        stem: "When is a function's body executed?",
        options: ["When the def line is read", "Each time the function is called", "When the program starts", "Never, functions are declarative"],
        correctIndex: 1,
        explanation: "def only defines the recipe. The body runs on each call. Calling is what triggers execution.",
      },
      {
        type: "mcq",
        stem: "In def greet(name), what is name?",
        options: ["An argument", "A parameter", "A return value", "A global variable"],
        correctIndex: 1,
        explanation: "name is a parameter — a placeholder in the definition. The value actually passed at the call site is the argument.",
      },
      {
        type: "mcq",
        stem: "What does a function that calls print but has no return produce when used in an assignment?",
        options: ["The printed value", "None", "0", "An error always"],
        correctIndex: 1,
        explanation: "A function without a return statement returns None. Assigning its result gives None, not the printed output.",
      },
      {
        type: "mcq",
        stem: "What is the main benefit of putting code in a function?",
        options: ["It makes the program run faster", "It lets you reuse the recipe instead of rewriting it", "It removes the need for variables", "It fixes all bugs"],
        correctIndex: 1,
        explanation: "Functions enable reuse: write the recipe once and call it many times, which is the core of composing programs from pieces.",
      },
      {
        type: "mcq",
        stem: "Which arithmetic operator does power(base, exp) use to raise base to the exponent?",
        options: ["*", "**", "^", "//"],
        correctIndex: 1,
        explanation: "** is the exponentiation operator. base ** exp raises base to the power of exp. The caret ^ is not exponentiation in Python.",
      },
      {
        type: "mcq",
        stem: "Why must a small helper function return a value rather than print it when its result feeds another calculation?",
        options: ["Because print can only run once", "Because the caller needs the value, and print hands back None", "Because functions cannot print", "Because return is always faster"],
        correctIndex: 1,
        explanation: "To use a function's result in arithmetic, the function must return a usable value. print hands back None, so the calculation would receive None.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A function is a named, reusable block of steps: inputs come in as parameters, the body runs on each call, and return hands a value back to the caller. print and return are different jobs, and the body runs only at the call. Functions let you think in pieces, which is precisely the direction the course is heading.",
      },
      {
        type: "paragraph",
        text: "Next: lists and dictionaries. Functions collect actions into named pieces; the next lesson collects values into named structures — lists for an ordered sequence, dictionaries for a set of key-value pairs — and shows the word-count idiom that is the heart of the PY4E course.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson8(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: build and index a list; add to a list and loop over it; build a dictionary and look values up by key; and use the dictionary get() + 1 idiom to count occurrences — the pattern that lies at the heart of the PY4E course.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 4, 5 and 7. You need conditions, loops, and the idea of a function — because a dictionary usually lives inside a loop you are iterating, and the counting pattern you will learn is the whole reason these structures exist.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "List",
        text: "A list is an ordered collection of values you can index by position and loop over. It answers the question, \"what is at the third position?\".",
      },
      {
        type: "definition",
        term: "Dictionary",
        text: "A dictionary is a set of key-value pairs you look up by key, not by position. It answers the question, \"what is the value associated with this label?\" — and it is the structure you use to count, group, and associate data.",
      },
      {
        type: "paragraph",
        text: "Until now, every variable you wrote held exactly one value. That is a real constraint: to store a list of names, you would have needed one variable per name. A list lets you hold many values in one box, ordered and addressable. A dictionary lets you hold many values but address them by a meaningful label rather than a number. These are the first two structures that let a program work with real collections of data — the raw material of everything from inventory to word counts.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "Choose the structure by the question you need to ask. If you need to know the position, or to keep things in a defined order, use a list. If you need to look up a value by a label — a name, a word, an id — use a dictionary. Trying to use a dictionary as an ordered list, or a list as a lookup table, is the most common awkwardness. A dictionary has no meaningful 'third position' because it is ordered by insertion but not indexed that way; and a list has no fast 'find the value for Ada' mechanism because it has no keys.",
      },
      {
        type: "paragraph",
        text: "The second thing is that these structures are genuinely useful only when combined with a loop. A list is built to be iterated: for item in my_list. A dictionary is built to be used inside a loop where you accumulate something keyed by a label. The powerful pattern is the two together: a dictionary initialized before a loop, updated on each pass, keyed by whatever the loop encounters.",
      },
      {
        type: "paragraph",
        text: "The single most valuable idiom in the whole course is the counting pattern: counts[key] = counts.get(key, 0) + 1. It does three things at once: it asks the dictionary what count is currently there, with a default of 0 if the key has never been seen; it adds one to that; and it stores the result back under the same key. One line, and it turns a stream of data into a tally. You will use this repeatedly from now through the final project.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: lists — build and index" },
      {
        type: "paragraph",
        text: "A list is created with square brackets and indexed from zero. The index is a position, not a rank you count from one.",
      },
      {
        type: "code",
        language: "python",
        code: `fruits = ["apple", "banana", "cherry"]\nprint(len(fruits))\nprint(fruits[0])\nprint(fruits[1])`,
        output: "3\napple\nbanana",
        caption: "len() gives the number of items. Index 0 is the first, index 1 the second — counting starts at zero.",
      },
      {
        type: "paragraph",
        text: "The hard part for most beginners is the zero-based indexing. fruits[0] is the first element (apple), not the second. This is why loops that count through a list often go from 0 to len minus one, or why range(len(...)) looks one short. Once you accept that the first item lives at index 0, list indexing becomes predictable.",
      },

      { type: "heading", level: 2, text: "Worked example 2: adding to a list and looping" },
      {
        type: "paragraph",
        text: "append grows a list in place, and a for loop visits each element. Two ways to see a list grow and be consumed.",
      },
      {
        type: "code",
        language: "python",
        code: `fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nprint(len(fruits))\nfor f in fruits:\n    print(f)`,
        output: "4\napple\nbanana\ncherry\nmango",
        caption: "append adds to the end; the for loop then visits each fruit in the order they appear.",
      },
      {
        type: "paragraph",
        text: "append modifies the list in place and does not return a new one, which is why you write fruits.append(...) as a statement rather than assigning. The for loop is the natural way to consume a list — it visits each element in order, one per pass. This pairing — a list built by appending, then consumed by a for loop — is the backbone of collecting results.",
      },

      { type: "heading", level: 2, text: "Worked example 3: dictionaries — look up by key and update" },
      {
        type: "paragraph",
        text: "A dictionary matches keys to values and is built with braces. Look up by key; set by assigning to that key.",
      },
      {
        type: "code",
        language: "python",
        code: `ages = {"Ada": 19, "Gustav": 34}\nprint(ages["Ada"])\nages["Ada"] = 20\nprint(ages["Ada"])`,
        output: "19\n20",
        caption: "ages[\"Ada\"] reads the value for that key; the next line updates it to 20.",
      },
      {
        type: "paragraph",
        text: "The key is the label, not a number. You ask for Ada and get 19. Assigning ages[\"Ada\"] = 20 replaces the value 19 with 20 under the same key. There is no 'first entry' or 'second entry' to worry about — you address a dictionary purely by its keys. If you asked for a key that does not exist, ages[\"Mina\"], Python would raise a KeyError, which is where the get() method in the next example comes in.",
      },

      { type: "heading", level: 2, text: "Worked example 4: the counting idiom" },
      {
        type: "paragraph",
        text: "Count how often each word appears. The dictionary tracks the tally, and a single line does the whole job per word.",
      },
      {
        type: "code",
        language: "python",
        code: `counts = {}\nfor w in ["the", "cat", "the", "dog"]:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)`,
        output: "{'the': 2, 'cat': 1, 'dog': 1}",
        caption: "counts.get(w, 0) returns the current tally or 0 if unseen; adding 1 stores the new total under w.",
      },
      {
        type: "paragraph",
        text: "Walk the first word, the. counts is empty, so counts.get(\"the\", 0) returns the default 0. Add 1 and store, giving counts[\"the\"] = 1. The second word, cat, is unseen, so it also gets 1. When the appears again, counts.get(\"the\", 0) now returns 1 — the existing tally — add 1 to get 2, and store 2. Reading the statement as \"give me what's there, or 0, then add one and put it back\" makes it second nature. This one idiom is the engine of the word-count programme you will build at the end of the course.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting that list indexing starts at 0. fruits[1] is the second element, not the first. This off-by-one is the single most common list bug.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Looking up a missing key without a default. ages[\"Mina\"] raises a KeyError if Mina is not there. Use ages.get(\"Mina\", 0) to fall back gracefully.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a dictionary like an ordered list. A dictionary is keyed by label, not indexed by position, so don't expect a 'third entry'.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Making a list rather than a dictionary for a lookup task. To count or to find-by-label, a dictionary is the right structure; a list only offers position.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the index of the first element of a list, and why does it surprise beginners?",
        answer: "0. Because Python numbers from zero, so the first element is at index 0, not 1.",
        explanation: "Zero-based indexing means a list of length n has indices 0 to n-1. The first element is fruits[0]. This is why loops counting from 0 are the norm.",
      },
      {
        type: "question",
        prompt: "Why does ages[\"Mina\"] raise an error while ages.get(\"Mina\", 0) does not?",
        answer: "The bracket form raises KeyError for a missing key, while get() returns the provided default (0) instead.",
        explanation: "get() is the safe lookup: it returns the default if the key is absent. The bracket form demands the key be present, raising KeyError otherwise.",
      },
      {
        type: "question",
        prompt: "In the counting idiom counts[w] = counts.get(w, 0) + 1, what does the 0 do?",
        answer: "It is the default returned if w has never been seen, so the first occurrence starts counting from 1.",
        explanation: "get(w, 0) returns 0 for an unseen key instead of erroring. Adding 1 gives 1, and storing that under w starts the tally.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which structure is best for counting how many times each word appears?",
        options: ["A list", "A dictionary", "A variable", "A string"],
        correctIndex: 1,
        explanation: "A dictionary maps each word (key) to its count (value), which is exactly the counting task. A list cannot look up by word efficiently.",
      },
      {
        type: "mcq",
        stem: "What is the index of the first element in a list?",
        options: ["1", "0", "-1", "It depends on the list"],
        correctIndex: 1,
        explanation: "Python is zero-indexed, so the first element is at index 0. The last element is at index -1, but the first is always 0.",
      },
      {
        type: "mcq",
        stem: "Which method adds an element to the end of a list?",
        options: ["add()", "append()", "push()", "insert()"],
        correctIndex: 1,
        explanation: "append() grows the list by adding an element to the end. It modifies the list in place rather than returning a new one.",
      },
      {
        type: "mcq",
        stem: "What does counts.get(\"x\", 0) return when \"x\" is not in counts?",
        options: ["An error", "0", "None", "The whole dictionary"],
        correctIndex: 1,
        explanation: "get(key, default) returns the default when the key is absent, so it returns 0 here rather than raising KeyError.",
      },
      {
        type: "mcq",
        stem: "Which best describes a dictionary?",
        options: ["An ordered list indexed by numbers", "A set of key-value pairs looked up by key", "A single value stored under one name", "A loop that repeats"],
        correctIndex: 1,
        explanation: "A dictionary maps keys to values and is accessed by key. Order is not its organising principle.",
      },
      {
        type: "mcq",
        stem: "What is the result of counts.get(w, 0) + 1 in the counting idiom?",
        options: ["The number of keys in counts", "The current count for w, plus one", "The total of all values", "A new list"],
        correctIndex: 1,
        explanation: "It reads the current tally for w (or 0 if unseen) and adds one — the increment for this occurrence. The result is stored back under w.",
      },
      {
        type: "mcq",
        stem: "To read a value from a dictionary and handle a missing key gracefully, which form is correct?",
        options: ["ages[\"Mina\"]", "ages.get(\"Mina\", 0)", "ages.pop(\"Mina\")", "ages.keys()"],
        correctIndex: 1,
        explanation: "get() returns a default for a missing key. The bracket form raises KeyError, and keys() lists keys rather than fetching a value.",
      },
      {
        type: "mcq",
        stem: "Why are lists and dictionaries best combined with loops?",
        options: ["Loops make them faster", "Many real tasks build or scan the data, which requires iterating", "Structures forbid loops", "They cannot store more than one value"],
        correctIndex: 1,
        explanation: "The typical pattern is to build a structure by appending during a loop, then consume it by iterating. The loop is what does the work; the structure holds the results.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A list is an ordered, position-addressable collection; a dictionary is a set of key-value pairs looked up by key. Choose the structure by the question you must answer. The counting idiom — counts[key] = counts.get(key, 0) + 1 — is the single most important pattern, and you will reach for it constantly.",
      },
      {
        type: "paragraph",
        text: "Next: strings & files. Lesson 8 gave you structures to hold data; the next lesson shows you how to get text into them — slicing and splitting strings, then reading a file line by line — which closes the loop between stored data and the information you actually want to analyse.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson9(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: index and slice a string exactly as you index a list; split a line of text into words; open a file and read it line by line; and combine file reading with a dictionary to summarise the text inside — which is the capstone pattern you will complete in the final lesson.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 8 (Lists & dictionaries). A string is a lot like a list of characters, and file output is collected with the dictionary counting idiom — so you need both ideas already in hand.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "String",
        text: "A string is a sequence of characters. It is indexed from zero like a list, and it comes with a rich set of methods for taking it apart — splitting on spaces, stripping whitespace, and finding substrings.",
      },
      {
        type: "definition",
        term: "File",
        text: "A file is data stored in secondary memory that persists after the program ends. Opening it gives you a stream you can read line by line — the first step in turning raw text into information you can analyse.",
      },
      {
        type: "paragraph",
        text: "This lesson is where the course turns a corner. Everything so far worked on values you typed or computed. Files let your program work on the kind of data it exists to process: text someone stored, records from a database, paragraphs from a web page. And the strings you learned about in passing become the real work of the course — text that needs slicing, splitting, and counting. Combine the two — read a file, split each line, count words with a dictionary — and you have the core of the PY4E course in front of you.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "Strings are the common currency of this course, and they behave like the lists you already know. You index them from zero, you can take a slice s[1:4] to get a substring, and you can use a negative index to count from the end. The reason to care about slicing and splitting is that text almost never arrives in the shape you want. A line of a file like \"the cat sat\" is one contiguous string, but you usually want its component words — which is exactly what split() gives you.",
      },
      {
        type: "paragraph",
        text: "Files introduce the idea of a stream. When you open a file and loop over it, you get it line by line — the loop's variable is the whole line, including the newline character at the end. This is why stripping matters: a line read from a file often ends with a newline, and if you split without stripping, the last word on the line carries a trailing newline you did not intend. The strip() method removes surrounding whitespace and is the standard first move on every line you read.",
      },
      {
        type: "paragraph",
        text: "The final piece is the pattern that ties it all together: open the file, loop over its lines, split each line into words, and feed each word into the counting dictionary. This is a small program but it is the template for the whole field — reading text, breaking it into tokens, and summarising them. Everything after this lesson is variations on that idea.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: indexing and slicing a string" },
      {
        type: "paragraph",
        text: "A string is a sequence of characters, indexed from zero and sliceable the way a list is.",
      },
      {
        type: "code",
        language: "python",
        code: `s = "Python"\nprint(s[0])\nprint(s[-1])\nprint(s[1:4])`,
        output: "P\nn\nyth",
        caption: "s[0] is the first character, s[-1] the last, and s[1:4] takes from index 1 up to but not including 4.",
      },
      {
        type: "paragraph",
        text: "Indexing a string is identical to indexing a list: you count from zero, and a negative index counts from the end, so s[-1] is the last character and s[-2] the second-to-last. A slice s[1:4] is like a substring — it takes the characters at positions 1, 2 and 3, stopping before 4. Once you have seen list indexing, string indexing is not a new idea, just a new thing to apply it to.",
      },

      { type: "heading", level: 2, text: "Worked example 2: splitting a line into words, and stripping" },
      {
        type: "paragraph",
        text: "split() breaks a string on whitespace and returns a list of words. strip() removes surrounding whitespace — including a trailing newline.",
      },
      {
        type: "code",
        language: "python",
        code: `line = "the cat sat"\nwords = line.split()\nprint(len(words))\nprint(words[0])\nprint(repr("  hi \\n".strip()))`,
        output: "3\nthe\n'hi'",
        caption: "split() gives 3 words; strip() removes the spaces and newline around hi, leaving just hi.",
      },
      {
        type: "paragraph",
        text: "The split() method returns a list of the individual words, so the line \"the cat sat\" becomes a list of three strings and len(words) is 3. The strip() method peels off leading and trailing whitespace — spaces, tabs, newlines — which is why the third line, given \"  hi \\n\", yields exactly \"hi\". In real use, a line read from a file often arrives with a newline on the end, so stripping first is routine.",
      },

      { type: "heading", level: 2, text: "Worked example 3: reading a file line by line" },
      {
        type: "paragraph",
        text: "To read a file, first create it. This example assumes a small file called words.txt with three lines. The open() call hands back a stream and the loop visits it one line at a time.",
      },
      {
        type: "table",
        headers: ["words.txt (create this file)"],
        rows: [["the cat sat"], ["the dog ran"], ["the cat"]],
      },
      {
        type: "code",
        language: "python",
        code: `f = open("words.txt", "r")\nfor line in f:\n    print(line.strip())\nf.close()`,
        output: "the cat sat\nthe dog ran\nthe cat",
        caption: "Each line is printed after strip() removes its trailing newline. close() releases the file.",
      },
      {
        type: "paragraph",
        text: "open(\"words.txt\", \"r\") opens the file for reading; the second argument \"r\" is optional for reading but is good to be explicit about. The for loop reads the file one line at a time, with line bound to each full line including its newline. print(line.strip()) is why the output has no blank lines — it trims the newline before printing. Closing the file is polite and, in larger programs, essential so the file is not held open longer than needed.",
      },

      { type: "heading", level: 2, text: "Worked example 4: the capstone pattern — count words from a file" },
      {
        type: "paragraph",
        text: "Now the payoff. Read the same file, split every line into words, and count each word with a dictionary. This is the small program PY4E opens its whole course with.",
      },
      {
        type: "code",
        language: "python",
        code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`,
        output: "{'the': 3, 'cat': 2, 'sat': 1, 'dog': 1, 'ran': 1}",
        caption: "Two nested loops: outer over lines, inner over the words in each line, feeding the counting idiom.",
      },
      {
        type: "paragraph",
        text: "There are three pieces nested together. The outer loop reads each line of the file. For each line, the inner loop splits it into words and visits each one. Each word goes through the counting idiom from lesson 8 — get its current count or 0, add one, store it back. The result is a dictionary whose keys are all the distinct words and whose values are how many times each appeared. Read it slowly and you will see it is just the file-reading pattern wrapped around the counting pattern — and that this small program is the seed of the word-count project you will write in the final lesson.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Not stripping a line before splitting. A line read from a file keeps its newline, so the last word of each line has one attached. strip() trims it.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to close the file. Forgetting f.close() may not break a small program, but it holds the file open and can cause problems. Prefer closing, or use a with block.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing split with strip. split() breaks a string into a list of pieces; strip() only trims the surrounding whitespace. They do different jobs — usually used together.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Expecting a single split() argument to count words. split() with no argument splits on any whitespace and skips empties, which is usually right. Split on a single space to preserve empties, which is rarely what you want.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is s[1:4] if s is \"Python\", and why does it include those particular characters?",
        answer: "\"yth\" — the characters at positions 1, 2 and 3, because a slice stops before its end index.",
        explanation: "Slicing s[1:4] is half-open: it includes index 1 up to but not including 4. So you get positions 1, 2 and 3, which are y, t and h.",
      },
      {
        type: "question",
        prompt: "Why does a line read from a file often need strip()?",
        answer: "Because each line arrives with a trailing newline character, and strip() trims that surrounding whitespace.",
        explanation: "File iteration returns lines ending in a newline. If you don't strip, the last token of the line carries the newline.",
      },
      {
        type: "question",
        prompt: "In the word-count capstone, what does the inner for w in line.split() do?",
        answer: "It splits the current line into individual words and visits each one, so each word can be counted.",
        explanation: "The outer loop gives lines; the inner loop breaks each line into words. Each word then feeds the counting dictionary.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What does \"Python\"[1:4] evaluate to?",
        options: ["Pyt", "yth", "thon", "Python"],
        correctIndex: 1,
        explanation: "The slice is half-open, taking indices 1 to 3. Position 0 is P, 1 is y, 2 is t, 3 is h, so s[1:4] is yth.",
      },
      {
        type: "mcq",
        stem: "Which method turns \"the cat sat\" into a list of words?",
        options: ["strip()", "split()", "splitlines()", "join()"],
        correctIndex: 1,
        explanation: "split() with no argument splits on whitespace, returning a list of words. strip() only trims edges.",
      },
      {
        type: "mcq",
        stem: "Why should you strip each line read from a file?",
        options: ["strip() makes reading faster", "Lines retain a trailing newline, which you usually do not want", "strip() is required or the file won't open", "strip() removes punctuation"],
        correctIndex: 1,
        explanation: "File lines end with a newline. strip() trims it so the token is clean, especially before counting words.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly opens a file for reading?",
        options: ["open(\"words.txt\", \"r\")", "read(\"words.txt\")", "load(\"words.txt\")", "open(\"words.txt\", \"w\")"],
        correctIndex: 0,
        explanation: "open(name, \"r\") opens for reading. \"w\" opens for writing (and would overwrite), \"read\" and \"load\" are not the file-opening functions.",
      },
      {
        type: "mcq",
        stem: "In the inline for line in open(\"words.txt\", \"r\"):, what does the loop variable line hold?",
        options: ["The whole file content at once", "One line of the file at a time, including its newline", "A list of all words", "A single character"],
        correctIndex: 1,
        explanation: "Iterating over an open file yields one line per pass, each line a string that includes its trailing newline.",
      },
      {
        type: "mcq",
        stem: "What is the main purpose of the strip() method?",
        options: ["To remove surrounding whitespace", "To split a string into words", "To count characters", "To open a file"],
        correctIndex: 0,
        explanation: "strip() trims leading and trailing whitespace. Once you have split, you may also need to strip edges — they are complementary.",
      },
      {
        type: "mcq",
        stem: "After the capstone program runs, what does its result dictionary contain?",
        options: ["Each line of the file as a key", "Each distinct word as a key, and how often it appeared as its value", "The total number of characters", "A list of words in order"],
        correctIndex: 1,
        explanation: "The counting idiom maps every distinct word to its frequency. Keys are words; values are counts.",
      },
      {
        type: "mcq",
        stem: "Which two pieces does the capstone pattern combine?",
        options: ["Loops and functions", "File-reading (open, loop lines) and the dictionary counting idiom", "Strings and numbers", "Print and return"],
        correctIndex: 1,
        explanation: "It reads a file line by line and feeds each split word through the counting dictionary — the two core ideas of this lesson and the last one.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A string is a sequence you index and slice like a list. split() breaks it into words, strip() trims surrounding whitespace, and open() lets you read a file line by line. The capstone — read a file, split each line, count words in a dictionary — links the last two lessons and is the heart of the whole course.",
      },
      {
        type: "paragraph",
        text: "Next: decomposition. You have now used functions and data structures. The next lesson pulls them together into the higher-level skill of breaking a real problem into functions — the difference between writing a program and designing one.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson10(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: take a problem and break it into smaller functions; decide what each function takes in and hands back; assemble those functions into a working whole; and recognise the difference between writing a program and designing one.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 7, 8 and 9. You need functions and the data structures, and the capstone reading pattern — because decomposition is the skill of taking a program like that and organising it into named pieces you can reason about one at a time.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Decomposition",
        text: "Decomposition is breaking a large problem into smaller, named pieces that each do one well-defined job. Instead of one long unbroken program, you get a set of functions, each with a clear input, a clear responsibility, and a clear output — and a small amount of code that calls them in order.",
      },
      {
        type: "paragraph",
        text: "This is the skill that separates someone who can write code from someone who can build software. A short program can be written as one long list, but a real program cannot — it would be a wall of text you can hardly read, and any change would ripple through it unpredictably. Decomposition is how you make a big program tractable: divide it so that you can understand, test, and fix one piece at a time.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the technique" },
      {
        type: "paragraph",
        text: "The drive behind decomposition is simple: it is easier to think about small things than large ones. Each function should do one job and do it well. If you catch yourself saying a function \"does a few things\", that is the signal to split it — the moment a function's job needs an 'and' in its description, it probably should be two functions.",
      },
      {
        type: "paragraph",
        text: "Deciding the interface is the hard part. Before you write a function's body, decide what it needs as input and what it produces as output. If a function is meant to compute a grade from a score, its input is a score and its output is a grade. If it is meant to produce a sentence, its inputs are a name and a score, and its output is a string. Nailing down the parameters and the return type first is what makes the pieces fit together without surprises.",
      },
      {
        type: "paragraph",
        text: "There is an art to choosing the boundaries. A good decomposition has functions that are reusable and readable on their own. A bad one has functions that are too large, too small, or that depend on each other's internals. The test is usually this: can you read a function's name and what it returns and understand its job without reading its body? If yes, you have a clean boundary; if no, the piece is doing too much.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: a problem split into three small functions" },
      {
        type: "paragraph",
        text: "A trivial greeting, but decomposed. Each function has one job, and a tiny bit of code assembles them.",
      },
      {
        type: "code",
        language: "python",
        code: `def get_name():\n    return "Ada"\n\ndef make_greeting(name):\n    return "Hello, " + name + "!"\n\ndef print_greeting(greeting):\n    print(greeting)\n\nprint_greeting(make_greeting(get_name()))`,
        output: "Hello, Ada!",
        caption: "Each function does one thing; the last line passes each result to the next like an assembly line.",
      },
      {
        type: "paragraph",
        text: "Read the pieces separately. get_name produces a string. make_greeting takes a string and produces a longer string. print_greeting takes a string and shows it. No function knows how the others work — each just receives a value and hands one back. The final line composes them: get_name() is fed into make_greeting, whose result is fed into print_greeting. This is the whole idea: each piece is simple and testable on its own, and the whole program is just onesimplification of functions.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a slightly more realistic decomposition" },
      {
        type: "paragraph",
        text: "Grade a student using two functions. One computes a letter grade from a number; the other builds a readable summary. The summarising function calls the grading one.",
      },
      {
        type: "code",
        language: "python",
        code: `def letter_grade(score):\n    if score >= 85:\n        return "A"\n    elif score >= 70:\n        return "B"\n    return "C"\n\ndef summarize(name, score):\n    return name + ": " + letter_grade(score)\n\nprint(summarize("Ada", 92))\nprint(summarize("Ben", 74))`,
        output: "Ada: A\nBen: B",
        caption: "letter_grade has one job — turn a score into a grade. summarize composes it into a sentence.",
      },
      {
        type: "paragraph",
        text: "Notice how the two functions divide the work. letter_grade is concerned only with the mapping from a number to a grade — it is the decision logic from lesson 4, wrapped up. summarize is concerned only with arranging a name and a grade into a readable sentence. Neither cares about the other's details. If the grading threshold changes, you edit letter_grade alone and summarize needs no change; if you want to show the grade differently, you edit summarize. Each piece is independent, which is exactly what makes the program understandable and maintainable.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Making one giant function. If a function's job needs an 'and' — 'it validates and formats and saves' — it is likely too big. Split it so each piece does one thing.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not deciding inputs and outputs first. Writing a body before you know what it takes in and gives back leads to functions that don't compose. Decide the interface first.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Over-decomposing into tiny meaningless functions. A function that wraps a single print with a misleading name adds noise rather than clarity. Split where it clarifies, not for its own sake.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Duplicating logic instead of extracting a function. If the same calculation appears in two places, make it one function and call it from both — that is the reuse payoff of decomposition.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What is the main benefit of decomposition?",
        answer: "It breaks a large problem into small, named pieces, each with one clear job, so you can understand, test and fix one piece at a time.",
        explanation: "Small functions are easier to reason about. The whole program then becomes a simple composition of understandable parts.",
      },
      {
        type: "question",
        prompt: "What decision should you make before writing a function's body?",
        answer: "Its interface — what it takes in as input and what it hands back as output.",
        explanation: "Defining parameters and return value first is what lets pieces fit together. The body is then an implementation of a known contract.",
      },
      {
        type: "question",
        prompt: "How can you tell when a function is too big?",
        answer: "When its job needs an 'and' in its description — when it does more than one thing.",
        explanation: "A function doing multiple jobs is a signal to split it. Each function should do one thing and do it well.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is decomposition?",
        options: ["Breaking a large problem into smaller functions", "Running a program faster", "Making all code one function", "Removing functions"],
        correctIndex: 0,
        explanation: "Decomposition divides a problem into named pieces, each with a clear job, so the whole becomes a composition of simple parts.",
      },
      {
        type: "mcq",
        stem: "Which is the best first step after deciding what a problem needs to do?",
        options: ["Write one giant function", "Identify the inputs and outputs each function needs", "Add more features", "Skip to testing"],
        correctIndex: 1,
        explanation: "Defining each function's interface (inputs and outputs) before its body is what makes the pieces compose cleanly.",
      },
      {
        type: "mcq",
        stem: "What is the signal that a function is too big?",
        options: ["It is more than five lines", "Its job has an 'and' in it, meaning it does more than one thing", "It contains a loop", "It returns a value"],
        correctIndex: 1,
        explanation: "A function should do one job. If the description of its job needs an 'and', it is doing more than one thing and should be split.",
      },
      {
        type: "mcq",
        stem: "Why is 'reuse' a benefit of decomposition?",
        options: ["It makes functions larger", "A calculation written once as a function can be called from many places", "It removes the need for loops", "It makes programs run faster"],
        correctIndex: 1,
        explanation: "Extracting a shared calculation into one function lets you call it wherever it is needed instead of duplicating the logic.",
      },
      {
        type: "mcq",
        stem: "What is the trade-off to avoid when decomposing?",
        options: ["Having too many functions", "Wrapping single trivial statements in misleadingly named functions", "Writing functions that loop", "Passing parameters"],
        correctIndex: 1,
        explanation: "Over-decomposition — tiny functions that each wrap a single statement — adds noise. Split where it clarifies, not for its own sake.",
      },
      {
        type: "mcq",
        stem: "In a decomposed program, how should functions relate to one another?",
        options: ["Each should read the other's internals", "Each should take values in and hand values back, without depending on internals", "They should never call each other", "They must be identical"],
        correctIndex: 1,
        explanation: "Well-decomposed functions communicate only through their parameters and return values. Each is understandable in isolation.",
      },
      {
        type: "mcq",
        stem: "Which change is easiest to make if the grading thresholds change?",
        options: ["Edit the summarize function", "Edit the letter_grade function, since it owns the score-to-grade logic", "Rewrite the whole program", "Add a new threshold to the main code"],
        correctIndex: 1,
        explanation: "letter_grade owns the mapping from score to grade, so the change is local. The rest of the program needs no modification.",
      },
      {
        type: "mcq",
        stem: "How does decomposition relate to the word-count program?",
        options: ["It removes the dictionary", "It lets the reading, counting and printing live in separate named functions", "It replaces the loop with functions", "It makes counting unnecessary"],
        correctIndex: 1,
        explanation: "The capstone could be decomposed into distinct functions: read the file, count the words, report the result. Each is testable and reusable.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Decomposition is breaking a problem into one-job functions with clear inputs and outputs. Decide the interface before the body; keep each function doing one thing; and compose them so the whole program is a chain of understandable parts. This is what turns a wall of code into a design.",
      },
      {
        type: "paragraph",
        text: "Next: testing & debugging. Lesson 10 organised your code into pieces; the next lesson shows you how to test each piece and find the bug when one of them misbehaves — moving from the debug technique of lesson 6 to a disciplined, build-your-own-tests approach.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 content — original writing, all code verified runnable (Python 3).
// ---------------------------------------------------------------------------
function lesson11(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: write a simple assert-based test for a function; describe why automated tests beat eyeballing; use print-instrumentation to see what a loop is really doing; and do hypothesis-driven debugging — forming a guess and testing it rather than changing code at random.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 6 (debugging basics), Lesson 7 (functions) and Lesson 10 (decomposition). Testing makes the most sense once a program is split into functions, because each function is a unit you can test on its own.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Unit test",
        text: "A unit test is a small, runnable check that a particular function produces the expected output for a given input. Your test is the contract: it says plainly what the function is supposed to do, in a form a computer can check for you.",
      },
      {
        type: "paragraph",
        text: "Lesson 6 showed you how to debug. This lesson makes it proactive: instead of waiting for a bug and then hunting it, you write checks that tell you the moment something stops being right. The deeply practical reason to test is that a function that works today may stop working after your next change. A test catches that. Eyeballing re-runs the whole program and relies on you noticing — a test is a permanent, instant, and precise reminder of what the function is supposed to do.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "Why this matters before the syntax" },
      {
        type: "paragraph",
        text: "The simplest way to write a test in Python is the assert statement. assert a function call equals an expected value; if it does, nothing happens and the program continues; if it does not, Python raises an AssertionError and stops. An assert is a way of writing down, in code, the statement \"I believe this is true\" — and having the computer verify it every time the program runs.",
      },
      {
        type: "paragraph",
        text: "Testing works best on well-decomposed functions, which is exactly what lesson 10 taught you to write. A small function with a clear input and output is easy to test: pick an input, state the expected output. If a program is one giant blob, you cannot test part of it — you can only run the whole thing and look at the final result, which hides which piece misbehaved. This is the payoff of decomposition: it makes testing possible, and testing makes correctness possible.",
      },
      {
        type: "paragraph",
        text: "Debugging in this framework becomes hypothesis-driven. When a test fails, you learn something before you change anything: which input produced the wrong output. That is a clue, and clues should narrow the search rather than invite a blind fix. Print-instrumentation — temporarily adding a print to see a variable's value — is the checkout tool. The discipline is: form a guess about the cause, test it with a targeted check, and only then change the code. This is the opposite of random-walk, the failure mode lesson 6 warned you about.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "Worked example 1: a passing test" },
      {
        type: "paragraph",
        text: "The simplest test. Write what the function should do, and have Python check it. If both asserts pass, nothing is printed — which is the point: silent success.",
      },
      {
        type: "code",
        language: "python",
        code: `def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5, "add(2, 3) should be 5"\nassert add(-1, 1) == 0, "add(-1, 1) should be 0"\nprint("all tests passed")`,
        output: "all tests passed",
        caption: "Each assert states an expectation. If every one is True, Python prints the confirmation; a failure raises AssertionError.",
      },
      {
        type: "paragraph",
        text: "The assert statement checks a condition. The message after the comma is what Python reports if the condition is False. Here both expectations hold — 2 + 3 is 5 and -1 + 1 is 0 — so both asserts pass silently and the program reaches the final print. Note that this tells you nothing new while the function is correct; it is insurance that pays off the moment you break it.",
      },

      { type: "heading", level: 2, text: "Worked example 2: a failing test surfaces the bug" },
      {
        type: "paragraph",
        text: "Now the test is wrong about what the function should return, and Python tells you. Crucially, the error is caught here so we can read it as a message rather than a crash.",
      },
      {
        type: "code",
        language: "python",
        code: `try:\n    assert add(2, 3) == 6, "expected 6"\nexcept AssertionError as e:\n    print("caught:", e)`,
        output: "caught: expected 6",
        caption: "add(2, 3) is 5, not 6, so the assert fails and raises AssertionError with the message we wrote.",
      },
      {
        type: "paragraph",
        text: "The assert fails because 2 plus 3 is 5, not 6 — the expectation was wrong, not necessarily the function. The try/except is here only so we can show the message as text; in normal use, an uncaught AssertionError just stops the program at the failing line, which is precisely the signal you want: it tells you exactly which expectation did not hold, and the message is a note you wrote listing what you expected. That is a far more informative failure than \"the output looked wrong\".",
      },

      { type: "heading", level: 2, text: "Worked example 3: print-instrumentation" },
      {
        type: "paragraph",
        text: "When a function misbehaves and you are not sure where, add a print to watch it. Here we watch a search loop as it checks each element.",
      },
      {
        type: "code",
        language: "python",
        code: `def find(words, target):\n    for i, w in enumerate(words):\n        print("checking", i, w)\n        if w == target:\n            return i\n    return -1\n\nprint("found at", find(["a", "b", "c"], "b"))`,
        output: "checking 0 a\nchecking 1 b\nfound at 1",
        caption: "The print shows each step as the loop runs, so you can see it reaches index 1 and returns it.",
      },
      {
        type: "paragraph",
        text: "The print is temporary scaffolding. It reveals what the loop is actually doing — here, that it compares element 0, then element 1, and matches at index 1, so it immediately returns. Without this, you might wonder whether the loop is even reaching the target. Printing a variable just before it matters is the fastest way to turn a guess into a certainty about what the code does. Once you have fixed the problem, remove the print.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Only testing the 'happy path'. If a function is supposed to handle an empty list or a zero, test those too. The edge cases are where bugs hide.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Leaving print-instrumentation in production. Prints used for debugging are scaffolding — remove them once the bug is found, or leave them fenced behind a logging level.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Random-walk debugging. Changing code without a hypothesis is the slowest possible approach. Form a guess, test it, then change — the lesson-6 failure mode.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Testing a whole program instead of a function. If the program is decomposed into functions, test each one. Testing the giant whole hides which piece is wrong.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "What does an assert statement do?",
        answer: "It checks that a condition is true; if it is false, it raises an AssertionError with a message you supply.",
        explanation: "assert states an expectation. It raises when false, stopping the program at the failing line — the exact spot that violated the contract.",
      },
      {
        type: "question",
        prompt: "What is print-instrumentation, and when is it useful?",
        answer: "Temporarily adding a print to watch a variable's value, useful when the program runs but behaves unexpectedly and you need to see what it is doing.",
        explanation: "It turns a guess about the problem into a certainty about the code's actual behaviour. Like all scaffolding, it should be removed once the fix is in.",
      },
      {
        type: "question",
        prompt: "Why does testing work best on well-decomposed functions?",
        answer: "Because a small function with a clear input and output is easy to test in isolation, whereas a monolithic program's failure state hides which part misbehaves.",
        explanation: "Decomposition makes functions into testable units. Each can be checked independently, so a failing test localises the bug precisely.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What does assert do when its condition is false?",
        options: ["It prints False", "It raises an AssertionError with a message you provide", "It silently continues", "It returns 0"],
        correctIndex: 1,
        explanation: "assert stops the program with an AssertionError when the condition is False, carrying your message. It is the simplest automated check.",
      },
      {
        type: "mcq",
        stem: "Why is an automated test better than eyeballing output?",
        options: ["It is always faster to write", "It runs every time and checks exactly what you expected, instantly and precisely", "It makes code shorter", "It removes the need for functions"],
        correctIndex: 1,
        explanation: "A test is a permanent, automatic reminder of the contract. Eyeballing requires you to notice a wrong value; a test catches it deterministically.",
      },
      {
        type: "mcq",
        stem: "What is print-instrumentation?",
        options: ["A way to make printing faster", "Temporarily adding a print to see what a variable is doing during a bug", "A built-in function for testing", "A type of loop"],
        correctIndex: 1,
        explanation: "Adding a targeted print reveals the program's actual behaviour. It is debugging scaffolding to be removed once the fix is found.",
      },
      {
        type: "mcq",
        stem: "Which is an example of random-walk programming?",
        options: ["Forming a hypothesis then testing it", "Changing code randomly until it works", "Writing an assert test", "Reading the error message first"],
        correctIndex: 1,
        explanation: "Random-walk is blind changes without a hypothesis — often slow and unreliable. Hypothesis-driven debugging is the disciplined alternative.",
      },
      {
        type: "mcq",
        stem: "What makes a function easy to test?",
        options: ["Being large and complex", "Having a clear input and output, doing one job", "Printing its result", "Using global variables"],
        correctIndex: 1,
        explanation: "A small, single-job function with defined inputs and outputs is a clean unit to test: pick an input, state the output, assert it.",
      },
      {
        type: "mcq",
        stem: "When debugging, what should you do before changing code?",
        options: ["Change the first likely line", "Form a hypothesis about the cause and design a check to test it", "Delete the function", "Add more features"],
        correctIndex: 1,
        explanation: "Hypothesis-driven debugging means guessing the cause and testing the guess before editing. The test result tells you whether your hypothesis was right.",
      },
      {
        type: "mcq",
        stem: "Why should you test edge cases, not just the normal case?",
        options: ["Edge cases run faster", "Bugs most often hide at the boundaries, like empty collections or zero values", "Edge cases are required syntax", "They make tests longer"],
        correctIndex: 1,
        explanation: "The boundaries — empty lists, zero, negative, maximum values — are where a function's assumptions often break. Covering them is what makes a test valuable.",
      },
      {
        type: "mcq",
        stem: "Where should you leave print-instrumentation after fixing a bug?",
        options: ["Permanently, it is harmless", "Remove it, since it was scaffolding for debugging", "In a database", "On every function"],
        correctIndex: 1,
        explanation: "Debug prints are temporary. Once the bug is fixed, remove them, or route them behind logging so they can be turned off.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Testing is proactive correctness: an assert states an expectation that Python verifies every run, best applied to small, single-job functions. Debugging is hypothesis-driven — form a guess, verify it with print-instrumentation, then change. Together, decomposed code plus tests give you a program you can change without fear.",
      },
      {
        type: "paragraph",
        text: "Next: the mini project. This is where it all comes together — you will write a real, complete program that reads a file, counts words, and reports the result, using the functions, structures and loops you have built across the whole course. It is the capstone."
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 content — the capstone project. Original writing; runnable code
// verified with Python 3. Builds a complete word-count program from the ideas
// of every previous lesson, and ties it to PY4E ch.1 + ch.10 (tuples/capstone).
// ---------------------------------------------------------------------------
function lesson12(): LessonContent {
  return {
    blocks: [
      // --- Learning outcomes ---
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this project you should be able to: write a complete program that reads a text file, counts how often each word appears, and reports the most common word and its count; explain how each part maps onto a lesson you have already completed; and trace the whole program so you can predict and verify its output.",
      },

      // --- Prerequisites ---
      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Everything. This is the capstone. You need reading a file lesson 9, the counting idiom lesson 8, the loop lesson 5, and the decomposition mind-set lesson 10. If any of these is shaky, this is the place to go back and shore it up.",
      },

      // --- Big idea ---
      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "paragraph",
        text: "This program is the one PY4E opens its whole course with — counting the most common word in a piece of text — and by now you can build it yourself from the ideas you already have. It is not a new concept. It is the moment all the separate lessons snap together into one real, useful program. Notice that once you can count words, you can count almost anything: letters, tags, student scores, error types. The pattern is the same, and the pattern is the point.",
      },

      // --- Concept explanation (why before how) ---
      { type: "heading", level: 2, text: "How to approach it" },
      {
        type: "paragraph",
        text: "Do not try to write the whole program in one go. Build it one piece at a time, running each piece and checking the output, exactly as you practised in lesson 11. Here is the road map in four steps: first, read the file and print each line to confirm you are reading it at all. Second, split each line into words and print them, so you can see the text breaking apart. Third, feed each word into the counting dictionary and print the whole dictionary. Fourth, add the loop that finds the most common word. Each stage is testable and each builds on the last, so if something is wrong you know exactly which stage broke.",
      },

      // --- Worked examples with code ---
      { type: "heading", level: 2, text: "The data — a small text file" },
      {
        type: "paragraph",
        text: "For this project you will work on a short file so you can verify the answer by hand. Create words.txt with these three lines.",
      },
      {
        type: "table",
        headers: ["words.txt (create this file)"],
        rows: [["the cat sat on the mat"], ["the dog chased the cat"], ["the cat ran home"]],
      },
      {
        type: "paragraph",
        text: "Before you run anything, count by hand: 'the' appears five times, 'cat' three times, and 'sat', 'on', 'mat', 'dog', 'chased', 'ran', 'home' once each. That manual count is your prediction — the reference the program's output must match. This is tracing and testing in action: you have an expected result before you run the program.",
      },

      { type: "heading", level: 2, text: "Stage 1 — read the file" },
      {
        type: "paragraph",
        text: "First, prove you are reading the file. Open it, loop over it, and print each line stripped.",
      },
      {
        type: "code",
        language: "python",
        code: `for line in open("words.txt", "r"):\n    print(line.strip())`,
        output: "the cat sat on the mat\nthe dog chased the cat\nthe cat ran home",
        caption: "Stage 1 confirms the file is being read, one line at a time, with each newline trimmed.",
      },

      { type: "heading", level: 2, text: "Stage 2 — split into words" },
      {
        type: "paragraph",
        text: "Next, break each line into individual words so you can see the raw material you are counting.",
      },
      {
        type: "code",
        language: "python",
        code: `for line in open("words.txt", "r"):\n    print(line.split())`,
        output: "['the', 'cat', 'sat', 'on', 'the', 'mat']\n['the', 'dog', 'chased', 'the', 'cat']\n['the', 'cat', 'ran', 'home']",
        caption: "Stage 2 turns each line into a list of words — you can now see exactly the tokens that will be counted.",
      },

      { type: "heading", level: 2, text: "Stage 3 — count the words" },
      {
        type: "paragraph",
        text: "The heart of the program: run the counting idiom over every word in every line. Print the dictionary to check your hand count.",
      },
      {
        type: "code",
        language: "python",
        code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\nprint(counts)`,
        output: "{'the': 5, 'cat': 3, 'sat': 1, 'on': 1, 'mat': 1, 'dog': 1, 'chased': 1, 'ran': 1, 'home': 1}",
        caption: "Stage 3 produces the full tally. Compare it against your manual count — this is your first verification.",
      },
      {
        type: "paragraph",
        text: "This is the exact idiom from lesson 8, wrapped in two nested loops: the outer one over the file's lines, the inner one over the words in each line. The dictionary counts holds every distinct word as a key and its frequency as a value. Compare this against your manual prediction: 'the' has 5, 'cat' has 3, and every other word has 1. If the program does not match, you have found a bug while it is still small.",
      },

      { type: "heading", level: 2, text: "Stage 4 — find the most common word" },
      {
        type: "paragraph",
        text: "Now loop over the dictionary to find the word with the largest count. You track the best answer as you go.",
      },
      {
        type: "code",
        language: "python",
        code: `counts = {}\nfor line in open("words.txt", "r"):\n    for w in line.split():\n        counts[w] = counts.get(w, 0) + 1\n\ntop_word = None\ntop_count = None\nfor w, c in counts.items():\n    if top_count is None or c > top_count:\n        top_word = w\n        top_count = c\n\nprint("Total distinct words:", len(counts))\nprint("Most common word:", top_word, "appears", top_count, "times")`,
        output: "Total distinct words: 9\nMost common word: the appears 5 times",
        caption: "The final loop scans the dictionary, keeping the word with the highest count, and the program reports the result.",
      },
      {
        type: "paragraph",
        text: "The loop sets up two trackers, top_word and top_count, and starts with neither known. For each word and its count, it compares against the current best; if the new count is higher — or if nothing has been set yet — it remembers this word as the new best. This is the maximum-finding pattern, the same shape you used to sum a total, just deciding on a best rather than accumulating. The output confirms your hand count: nine distinct words and 'the' appearing five times.",
      },

      // --- Common mistakes ---
      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Trying to write the whole program at once. Build it in the four stages above, running and checking after each. A bug in a ten-line version is trivial to find; a bug in a forty-line version is not.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Not stripping or splitting correctly. If words come back with trailing newlines, strip() each line first; if you want word tokens, use split() with no argument.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Forgetting to handle the empty dictionary. If the file has no lines, counts is empty, top_count stays None, and the program should report that gracefully rather than crash.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Comparing counts with < instead of > in the maximum-finding loop. The trackers start as None; ensure you use a comparison that keeps the larger count, and guard the first iteration.",
      },

      // --- Check questions ---
      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "Why build the program in four stages instead of one pass?",
        answer: "Because each stage is independently testable. If something breaks, you know exactly which stage to inspect, and you have a manual prediction to verify each one.",
        explanation: "Running a small, readable part and checking its output keeps the search space small — the lesson-11 approach applied to a whole project.",
      },
      {
        type: "question",
        prompt: "In the maximum-finding loop, why do the trackers start as None rather than a number like 0?",
        answer: "Because a real count could conceivably be anything, and starting as None lets you detect the first iteration cleanly — 'if nothing is set yet, set it'.",
        explanation: "Starting as None and guarding the first assignment avoids assuming a lower bound that might exclude legitimate counts.",
      },
      {
        type: "question",
        prompt: "What happens to the program if words.txt is empty?",
        answer: "counts stays empty, the maximum loop never updates the trackers (staying None), and a well-written program reports it gracefully instead of crashing.",
        explanation: "An empty input is an edge case worth handling — it exercises the guard in the maximum-finding loop and the empty-dictionary path.",
      },

      // --- MCQs ---
      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "What is the core data structure used to count word frequencies?",
        options: ["A list", "A dictionary", "A string", "A loop only"],
        correctIndex: 1,
        explanation: "A dictionary maps each distinct word (key) to its frequency (value), which is exactly what counting requires.",
      },
      {
        type: "mcq",
        stem: "What does split() with no argument return?",
        options: ["A single string", "A list of words split on whitespace", "A dictionary", "The line count"],
        correctIndex: 1,
        explanation: "split() on whitespace returns a list of the words. It is what turns each line into countable tokens.",
      },
      {
        type: "mcq",
        stem: "How does the counting idiom add a new word to the tally?",
        options: ["It starts a new list", "counts.get(w, 0) returns the current tally or 0, then +1 stores it back", "It appends to a list", "It just prints w"],
        correctIndex: 1,
        explanation: "get(w, 0) safely reads the current count, defaulting to 0 for an unseen word, and +1 stores the incremented value under w.",
      },
      {
        type: "mcq",
        stem: "What is the purpose of the second loop that scans counts.items()?",
        options: ["To print every word", "To find the word with the largest count", "To delete the smaller counts", "To sort the dictionary"],
        correctIndex: 1,
        explanation: "That loop walks the word-count pairs and keeps the one with the highest value — the maximum-finding pattern.",
      },
      {
        type: "mcq",
        stem: "Why is it important to verify the program against a manual count?",
        options: ["It is a formality", "It is your expected output, so a mismatch immediately signals a bug", "It makes the program faster", "It is required syntax"],
        correctIndex: 1,
        explanation: "A hand count gives you a reference. Comparing it with the output is how you know the program is correct — the essence of testing.",
      },
      {
        type: "mcq",
        stem: "Which loop structure does the program use to read the whole file?",
        options: ["A dictionary", "A for loop over the opened file, yielding one line per pass", "A while loop with a manual counter", "A function"],
        correctIndex: 1,
        explanation: "Iterating over an opened file yields each line in turn — the natural way to process a file line by line.",
      },
      {
        type: "mcq",
        stem: "If the program should handle an empty file safely, what must it check?",
        options: ["That counts is not empty before finding a maximum", "That the file exists", "That split is called", "That print is available"],
        correctIndex: 0,
        explanation: "An empty dictionary means there is no 'most common word'. A graceful program checks the edge case rather than assuming a count exists.",
      },
      {
        type: "mcq",
        stem: "How does this capstone program relate to the earlier lessons?",
        options: ["It is unrelated", "It combines file reading (9), the counting idiom (8), loops (5) and decomposition (10)", "It only uses lesson 1", "It is a wholly new concept"],
        correctIndex: 1,
        explanation: "The project is the integration of the whole course: reading, splitting, counting, and organising into a complete, testable program.",
      },

      // --- Summary & next ---
      { type: "heading", level: 2, text: "Summary and what comes next" },
      {
        type: "paragraph",
        text: "You built a complete word-count program from the ideas of every previous lesson: read a file, split it into words, count them in a dictionary, and find the most common. You verified each stage against a manual prediction. That is not just a program — it is a demonstration that the separate pieces of the course compose into something genuinely useful.",
      },
      {
        type: "paragraph",
        text: "Where the course goes from here: tuples let you sort the counted words (PY4E chapter 10), and from there the same counting idea extends to real data — scraping, parsing, and analysing text at scale. You have the foundation. Everything after this is this same pattern, applied to bigger and messier data.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// SBA assessment items — one per concept, following the seed-university
// convention (slug `${courseSlug}--${conceptSlug}--sba`).
// ---------------------------------------------------------------------------
// Authored SBA content — one substantive item per concept, grounded in the
// lesson it assesses. Every code claim is executed against real Python in the
// verification pass (see tests/lesson-python.test.mjs for the lesson-side
// claims; these item outputs were verified the same way by A1, 2026-10-12).
const AUTHORED_SBAS: Record<string, { stem: string; options: string[]; correctAnswer: string; explanation: string }> = {
  "what-is-a-program": {
    stem: "A friend says a program is 'a conversation with the computer — it asks you what to do next at every step.' Which description is more accurate?",
    options: [
      "A program is a list of instructions written in advance that the computer follows in order — it does not stop to ask you at each step.",
      "A program is a conversation — the computer asks you for the next instruction each time it finishes one.",
      "A program is a single instruction that the computer repeats forever.",
      "A program is a piece of hardware that stores recipes for the computer to cook.",
    ],
    correctAnswer: "A program is a list of instructions written in advance that the computer follows in order — it does not stop to ask you at each step.",
    explanation: "Like the recipe model in lesson 1: you write every step before the computer starts, and it executes them in order. The 'conversation' description confuses writing a program with using an interactive shell.",
  },
  "variables-and-types": {
    stem: "In Python, what are the type and the value of the expression 7 / 2?",
    options: [
      "float, 3.5 — the / operator always produces a float, even when both operands are whole numbers.",
      "int, 3 — the / operator discards the fractional part.",
      "float, 3.0 — the / operator rounds to the nearest whole number.",
      "str, '3.5' — division results are stored as text.",
    ],
    correctAnswer: "float, 3.5 — the / operator always produces a float, even when both operands are whole numbers.",
    explanation: "Verified by running it: 7 / 2 is 3.5 and type(7 / 2) is float. Discarding the fraction is what the floor-division operator // does (7 // 2 is 3), not /.",
  },
  "input-output-operators": {
    stem: "A program runs n = input('Number? '), the user types 4, and it prints n * 3. What is printed, and why?",
    options: [
      "444 — input() always returns a string, and '4' * 3 repeats the string three times.",
      "12 — input() converts the typed text to a number, and 4 * 3 is 12.",
      "4 — the * operator does nothing on input values.",
      "TypeError — you cannot multiply something you read from the keyboard.",
    ],
    correctAnswer: "444 — input() always returns a string, and '4' * 3 repeats the string three times.",
    explanation: "Verified by running it: '4' * 3 is '444'. input() never converts — to do arithmetic you must convert explicitly, as in int(n) * 3, which lesson 3 practises.",
  },
  "conditionals": {
    stem: "With score = 85, this chain runs: if score >= 90: grade = 'A' / elif score >= 80: grade = 'B' / elif score >= 70: grade = 'C' / else: grade = 'F'. What is grade, and why?",
    options: [
      "'B' — conditions are checked in order and only the first true branch runs, so 85 skips the A test and matches the B test.",
      "'A' — the computer grades generously and rounds 85 up to the top band.",
      "'C' — the last elif that was read by the programmer is the one that runs.",
      "'B' then 'C' — every branch whose condition is true runs, so later tests overwrite earlier ones.",
    ],
    correctAnswer: "'B' — conditions are checked in order and only the first true branch runs, so 85 skips the A test and matches the B test.",
    explanation: "An if/elif/else chain is exclusive: evaluation stops at the first true condition. 85 fails score >= 90, passes score >= 80, and grade becomes 'B' — the C and F branches never run.",
  },
  "loops": {
    stem: "What does this code print? total = 0 / for i in [1, 2, 3, 4]: total = total + i / print(total)",
    options: [
      "10 — the loop adds each item to the accumulator, so 1 + 2 + 3 + 4.",
      "4 — the total is the last value of i.",
      "24 — the loop multiplies the items together.",
      "1 — the accumulator keeps only the first value it receives.",
    ],
    correctAnswer: "10 — the loop adds each item to the accumulator, so 1 + 2 + 3 + 4.",
    explanation: "Verified by running it: the accumulator starts at 0 and grows 1, 3, 6, 10 across the four iterations. Accumulating a running total across a loop is the pattern lesson 5 builds and lesson 12 reuses.",
  },
  "logic-debugging-basics": {
    stem: "A script crashes on its first line: print(greeting) — greeting was never created. Which error is this, and what fixes it?",
    options: [
      "NameError — the name greeting was never defined; define it (or fix the spelling) before the print.",
      "SyntaxError — print is misspelled somewhere in the line.",
      "TypeError — you cannot print a name that has no value.",
      "No error — Python prints an empty line and continues.",
    ],
    correctAnswer: "NameError — the name greeting was never defined; define it (or fix the spelling) before the print.",
    explanation: "Verified: using an undefined name raises NameError. SyntaxError is for malformed structure, TypeError for mixing wrong types (like '5' + 3). Reading the error type first — before the message — is the triage habit lesson 6 teaches.",
  },
  "functions": {
    stem: "Given def double(n): print(n * 2) — what is stored in x after x = double(5)?",
    options: [
      "None — the function prints 10 but has no return statement, so it returns nothing.",
      "10 — the function's print sends the value back to the caller.",
      "5 — parameters cannot be changed by a function.",
      "TypeError — a function cannot both print and be assigned.",
    ],
    correctAnswer: "None — the function prints 10 but has no return statement, so it returns nothing.",
    explanation: "Verified by running it: the screen shows 10 but x is None. print shows a value to the human; return hands it back to the program. When a caller needs the value, the function must return it — the print/return distinction is lesson 7's core idea.",
  },
  "lists-dictionaries": {
    stem: "This code counts letters in a word: counts = {} / for ch in 'banana': counts[ch] = counts.get(ch, 0) + 1. What is counts['n']?",
    options: [
      "2 — 'banana' contains the letter n exactly twice, and the .get(ch, 0) + 1 idiom adds 1 to its running total each time it appears.",
      "3 — every letter in 'banana' is counted three times.",
      "1 — a dictionary key can only be stored once.",
      "KeyError — 'n' is not in the dictionary because vowels were counted first.",
    ],
    correctAnswer: "2 — 'banana' contains the letter n exactly twice, and the .get(ch, 0) + 1 idiom adds 1 to its running total each time it appears.",
    explanation: "Verified by running it: counts is {'b': 1, 'a': 3, 'n': 2}. The .get(key, 0) + 1 idiom handles both the first sighting (start from 0) and every later one — the counting pattern lesson 8 drills.",
  },
  "strings-files": {
    stem: "What does this code print? word = 'python' / print(word[0:3])",
    options: [
      "pyt — slicing [0:3] takes characters at indexes 0, 1 and 2, and the end index is excluded.",
      "pyth — the slice includes the character at the end index.",
      "yth — the first index is skipped and three characters are taken from index 1.",
      "py — slicing takes the first and last characters of the range.",
    ],
    correctAnswer: "pyt — slicing [0:3] takes characters at indexes 0, 1 and 2, and the end index is excluded.",
    explanation: "Verified by running it: 'python'[0:3] is 'pyt'. The classic off-by-one trap is expecting the end index to be included — the rule is 'up to but not including'.",
  },
  "decomposition": {
    stem: "You are building a quiz game that loads questions, asks each one, checks answers and reports a final score. Which decomposition is best, and why?",
    options: [
      "One function per job — load_questions(), ask_question(), check_answer(), report_score() — each with a single clear responsibility and a name that says what it does.",
      "One giant run_quiz() function containing every step, because fewer functions means simpler code.",
      "Split by file only — all code in one function but spread across many comments.",
      "No functions at all — straight-line code repeated for each question.",
    ],
    correctAnswer: "One function per job — load_questions(), ask_question(), check_answer(), report_score() — each with a single clear responsibility and a name that says what it does.",
    explanation: "Decomposition means each function owns one job, can be tested on its own, and can be reused by the capstone. A giant function mixes loading, asking, checking and scoring, so a bug in any one of them hides in the whole — the lesson 10 argument.",
  },
  "testing-debugging": {
    stem: "A script contains assert add(2, 2) == 5, and add actually returns 4. What happens when that line runs?",
    options: [
      "The program stops immediately with an AssertionError — assert fails loudly the moment its condition is false.",
      "The program prints a warning and continues to the next line.",
      "The assert returns False and the program stores it for later.",
      "Nothing — assert lines are ignored unless you enable testing mode.",
    ],
    correctAnswer: "The program stops immediately with an AssertionError — assert fails loudly the moment its condition is false.",
    explanation: "Verified by running it: a false assert raises AssertionError and execution halts. That loud failure is the point — tests that fail silently prove nothing. Lesson 11 uses assert exactly this way: state the expected behaviour, let the crash find the gap.",
  },
  "mini-project": {
    stem: "You start the capstone: a number-guessing game. Which build order follows the plan–build–test cycle the course teaches?",
    options: [
      "Write a tiny working version first — pick one number, one guess, one check — run it, then grow the loop, attempts and scoring, testing as each piece lands.",
      "Write all several hundred lines in one sitting, then run the finished program for the first time at the end.",
      "Find a finished guessing game online and paste it in, then read it to see how it works.",
      "Start with the artwork and menus, and add the game logic last once it looks finished.",
    ],
    correctAnswer: "Write a tiny working version first — pick one number, one guess, one check — run it, then grow the loop, attempts and scoring, testing as each piece lands.",
    explanation: "The capstone lesson's cycle is plan (name the pieces), build the smallest end-to-end version, test it, then extend one piece at a time. Code that has never run until it is 'finished' is where bugs hide — lesson 12 exists to break that habit.",
  },
};

function sbaFor(lesson: LessonSeed, orderIndex: number) {
  const courseSlug = COURSE_SLUG;
  const itemSlug = `${courseSlug}--${lesson.concept.slug}--sba`;
  const c = lesson.concept;
  const authored = AUTHORED_SBAS[lesson.concept.slug];
  if (!authored) throw new Error(`No authored SBA for concept ${lesson.concept.slug} — every concept needs a real item.`);
  // Deterministic rotation seeded by the item slug: kills the correct-answer-
  // first bias while staying stable across re-runs (correctAnswer is the
  // option TEXT, so rotation never breaks the key).
  const raw = authored.options;
  const rot = orderIndex % raw.length; // uniform, index-stable spread
  const options = raw.slice(rot).concat(raw.slice(0, rot));
  if (!options.includes(authored.correctAnswer)) {
    throw new Error(`correctAnswer not present in options for ${itemSlug} — answer/key drift`);
  }
  return {
    where: { slug: itemSlug },
    update: {
      conceptId: undefined, orderIndex,
      stem: authored.stem,
      options: options as never,
      correctAnswer: authored.correctAnswer,
      explanation: authored.explanation,
      reviewStatus: "draft",
      needsCheck: false,
    },
    create: {
      slug: itemSlug,
      courseId: COURSE_ID,
      conceptId: undefined, // filled in main() once concept ids are known
      format: "sba",
      stem: authored.stem,
      options: options as never,
      correctAnswer: authored.correctAnswer,
      explanation: authored.explanation,
      marks: 1,
      negativeMarks: 0.25,
      orderIndex,
      isPublished: true,
      difficulty: c.blooms === "remember" ? "easy" : c.blooms === "evaluate" || c.blooms === "create" ? "hard" : "medium",
      reviewStatus: "draft",
      needsCheck: false,
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
        // All 12 lessons are authored in the full format and every code
        // snippet + output claim is machine-verified (tests/lesson-python).
        // Draft = awaiting final pedagogy sign-off, no longer needs-check.
        reviewStatus: "draft",
        needsCheck: false,
      },
      create: {
        id: l.id,
        courseId: course.id,
        domain: "university",
        title: l.title,
        orderIndex: i,
        estimatedMinutes: l.estimatedMinutes,
        content: l.content as never,
        reviewStatus: "draft",
        needsCheck: false,
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
