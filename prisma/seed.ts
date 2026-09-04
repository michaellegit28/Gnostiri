// Note: This seed script should be executed with "npx prisma db seed" once a real database is connected.

import { PrismaClient, AppDomain } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const domain: AppDomain = "highschool";

  // 1. Seed Examinations
  const examsData = [
    { id: "waec", code: "waec", name: "WAEC", country: "West Africa" },
    { id: "jamb", code: "jamb", name: "JAMB", country: "Nigeria" },
    { id: "neco", code: "neco", name: "NECO", country: "Nigeria" },
  ];

  for (const exam of examsData) {
    await prisma.examination.upsert({
      where: { id: exam.id },
      update: {
        code: exam.code,
        name: exam.name,
        domain,
        country: exam.country,
      },
      create: {
        id: exam.id,
        code: exam.code,
        name: exam.name,
        domain,
        country: exam.country,
      },
    });
  }

  // Define subjects and topics for each exam
  const subjectsData = [
    {
      slug: "mathematics",
      title: "Mathematics",
      topics: [
        { slug: "quadratic-equations", title: "Quadratic Equations" },
        { slug: "trigonometry", title: "Trigonometry" },
        { slug: "indices-and-logarithms", title: "Indices and Logarithms" },
        { slug: "linear-equations", title: "Linear Equations and Inequalities" },
        { slug: "probability-and-statistics", title: "Probability and Statistics" },
        { slug: "matrices-and-determinants", title: "Matrices and Determinants" },
      ],
    },
    {
      slug: "english",
      title: "English Language",
      topics: [
        { slug: "comprehension-and-summary", title: "Comprehension and Summary" },
        { slug: "grammar-and-parts-of-speech", title: "Grammar and Parts of Speech" },
        { slug: "vocabulary-and-synonyms", title: "Vocabulary and Synonyms" },
        { slug: "idioms-and-figures-of-speech", title: "Idioms and Figures of Speech" },
        { slug: "oral-english", title: "Oral English and Phonetics" },
      ],
    },
    {
      slug: "physics",
      title: "Physics",
      topics: [
        { slug: "motion-and-kinematics", title: "Motion and Kinematics" },
        { slug: "work-energy-and-power", title: "Work, Energy, and Power" },
        { slug: "waves-and-sound", title: "Waves and Sound" },
        { slug: "electric-circuits", title: "Electric Circuits and Ohm's Law" },
        { slug: "thermodynamics", title: "Thermodynamics and Heat" },
      ],
    },
    {
      slug: "chemistry",
      title: "Chemistry",
      topics: [
        { slug: "atomic-structure", title: "Atomic Structure and Periodic Table" },
        { slug: "chemical-bonding", title: "Chemical Bonding" },
        { slug: "stoichiometry", title: "Stoichiometry and Mole Concept" },
        { slug: "acids-bases-and-salts", title: "Acids, Bases, and Salts" },
        { slug: "organic-chemistry", title: "Organic Chemistry and Hydrocarbons" },
      ],
    },
    {
      slug: "biology",
      title: "Biology",
      topics: [
        { slug: "cell-structure", title: "Cell Structure and Organization" },
        { slug: "nutrition-and-digestion", title: "Nutrition and Digestion" },
        { slug: "respiration", title: "Respiration and Gas Exchange" },
        { slug: "genetics-and-heredity", title: "Genetics and Heredity" },
        { slug: "ecology", title: "Ecology and Ecosystems" },
      ],
    },
  ];

  for (const exam of examsData) {
    // Seed Root Topic for Exam
    const rootExamTopicId = exam.id;
    await prisma.topic.upsert({
      where: { id: rootExamTopicId },
      update: { title: exam.name, domain },
      create: { id: rootExamTopicId, title: exam.name, domain },
    });

    let subjectOrder = 0;
    for (const sub of subjectsData) {
      const subjectTopicId = `${exam.id}-${sub.slug}`;
      await prisma.topic.upsert({
        where: { id: subjectTopicId },
        update: {
          title: sub.title,
          domain,
          parentId: rootExamTopicId,
          orderIndex: subjectOrder,
        },
        create: {
          id: subjectTopicId,
          title: sub.title,
          domain,
          parentId: rootExamTopicId,
          orderIndex: subjectOrder,
        },
      });
      subjectOrder++;

      let topicOrder = 0;
      for (const top of sub.topics) {
        const topicId = `${exam.id}-${sub.slug}-${top.slug}`;
        await prisma.topic.upsert({
          where: { id: topicId },
          update: {
            title: top.title,
            domain,
            parentId: subjectTopicId,
            orderIndex: topicOrder,
          },
          create: {
            id: topicId,
            title: top.title,
            domain,
            parentId: subjectTopicId,
            orderIndex: topicOrder,
          },
        });
        topicOrder++;
      }
    }
  }

  // Populate ONE topic fully: WAEC > Mathematics > Quadratic Equations
  const targetTopicId = "waec-mathematics-quadratic-equations";

  const lessonContent = {
    blocks: [
      {
        type: "heading",
        level: 2,
        text: "Introduction to Quadratic Equations",
      },
      {
        type: "paragraph",
        text: "A quadratic equation is a second-order polynomial equation in a single variable x with a non-zero coefficient for x^2. The general form is ax^2 + bx + c = 0.",
      },
      {
        type: "definition",
        term: "Quadratic Equation",
        text: "An algebraic equation of the second degree in x. It has the standard form ax^2 + bx + c = 0, where a, b, and c are constants and a ≠ 0.",
      },
      {
        type: "heading",
        level: 3,
        text: "Methods of Solving Quadratic Equations",
      },
      {
        type: "paragraph",
        text: "There are three primary algebraic methods commonly tested in WAEC and JAMB examinations: Factoring, Completing the Square, and the Quadratic Formula.",
      },
      {
        type: "example",
        text: "Solve x^2 - 5x + 6 = 0 by factoring: Find two numbers that multiply to 6 and add up to -5 (-2 and -3). Thus, (x - 2)(x - 3) = 0, giving roots x = 2 or x = 3.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The Quadratic Formula is x = (-b ± √(b^2 - 4ac)) / (2a). It can solve any quadratic equation regardless of whether it factors neatly.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Pay close attention to the discriminant Δ = b^2 - 4ac. If Δ < 0, the equation has no real roots!",
      },
      {
        type: "table",
        headers: ["Method", "Best Used When", "Complexity"],
        rows: [
          ["Factoring", "Roots are easily factorable integers", "Easy"],
          ["Quadratic Formula", "General cases or complex coefficients", "Medium"],
          ["Completing the Square", "Deriving vertex form or specific requirements", "Medium"],
        ],
      },
    ],
  };

  const lessonId = "waec-math-quadratic-equations-lesson-1";
  await prisma.lesson.upsert({
    where: { id: lessonId },
    update: {
      domain,
      topicId: targetTopicId,
      title: "Quadratic Equations Mastery",
      content: lessonContent,
      orderIndex: 0,
      estimatedMinutes: 15,
    },
    create: {
      id: lessonId,
      domain,
      topicId: targetTopicId,
      title: "Quadratic Equations Mastery",
      content: lessonContent,
      orderIndex: 0,
      estimatedMinutes: 15,
    },
  });

  // 10 Question rows for WAEC Mathematics > Quadratic Equations
  const questionsData = [
    {
      id: "waec-qe-q1",
      questionText: "What are the roots of the equation x^2 - 7x + 12 = 0?",
      options: ["x = 3, 4", "x = -3, -4", "x = 2, 6", "x = -2, -6"],
      correctAnswer: "x = 3, 4",
      explanation: "Factorizing gives (x - 3)(x - 4) = 0, hence x = 3 or x = 4.",
      difficulty: "easy",
    },
    {
      id: "waec-qe-q2",
      questionText: "Find the discriminant of the quadratic equation 2x^2 - 4x + 3 = 0.",
      options: ["-8", "8", "40", "-40"],
      correctAnswer: "-8",
      explanation: "Discriminant = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q3",
      questionText: "If one root of x^2 + kx - 18 = 0 is 3, find the value of k.",
      options: ["3", "-3", "6", "-6"],
      correctAnswer: "3",
      explanation: "Substitute x = 3: 3^2 + k(3) - 18 = 0 => 9 + 3k - 18 = 0 => 3k = 9 => k = 3.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q4",
      questionText: "Which of the following quadratic equations has equal real roots?",
      options: ["x^2 - 6x + 9 = 0", "x^2 + 5x + 6 = 0", "x^2 - 4x + 5 = 0", "x^2 - 9 = 0"],
      correctAnswer: "x^2 - 6x + 9 = 0",
      explanation: "A quadratic has equal real roots if discriminant = 0. For x^2 - 6x + 9, b^2 - 4ac = (-6)^2 - 4(1)(9) = 36 - 36 = 0.",
      difficulty: "easy",
    },
    {
      id: "waec-qe-q5",
      questionText: "Solve for x in 3x^2 - 5x - 2 = 0.",
      options: ["x = 2 or x = -1/3", "x = -2 or x = 1/3", "x = 3 or x = -2", "x = 1 or x = -2/3"],
      correctAnswer: "x = 2 or x = -1/3",
      explanation: "3x^2 - 6x + x - 2 = 0 => 3x(x - 2) + 1(x - 2) = 0 => (3x + 1)(x - 2) = 0.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q6",
      questionText: "What is the sum of the roots of 5x^2 - 15x + 7 = 0?",
      options: ["3", "-3", "7/5", "-7/5"],
      correctAnswer: "3",
      explanation: "Sum of roots = -b / a = -(-15) / 5 = 3.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q7",
      questionText: "What is the product of the roots of 4x^2 - 8x - 12 = 0?",
      options: ["-3", "3", "-2", "2"],
      correctAnswer: "-3",
      explanation: "Product of roots = c / a = -12 / 4 = -3.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q8",
      questionText: "Form a quadratic equation whose roots are -2 and 5.",
      options: ["x^2 - 3x - 10 = 0", "x^2 + 3x - 10 = 0", "x^2 - 3x + 10 = 0", "x^2 + 7x - 10 = 0"],
      correctAnswer: "x^2 - 3x - 10 = 0",
      explanation: "Equation is x^2 - (sum of roots)x + (product of roots) = 0 => x^2 - (-2 + 5)x + (-2 * 5) = x^2 - 3x - 10 = 0.",
      difficulty: "medium",
    },
    {
      id: "waec-qe-q9",
      questionText: "By completing the square, x^2 + 8x + 5 = 0 can be written as:",
      options: ["(x + 4)^2 = 11", "(x + 4)^2 = 21", "(x + 8)^2 = 59", "(x + 2)^2 = -1"],
      correctAnswer: "(x + 4)^2 = 11",
      explanation: "x^2 + 8x = -5 => (x + 4)^2 - 16 = -5 => (x + 4)^2 = 11.",
      difficulty: "hard",
    },
    {
      id: "waec-qe-q10",
      questionText: "Determine the nature of the roots of 2x^2 - 3x + 4 = 0.",
      options: ["No real roots", "Two equal real roots", "Two distinct real roots", "Infinitely many roots"],
      correctAnswer: "No real roots",
      explanation: "b^2 - 4ac = (-3)^2 - 4(2)(4) = 9 - 32 = -23 < 0, so no real roots exist.",
      difficulty: "easy",
    },
  ];

  for (const q of questionsData) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        domain,
        topicId: targetTopicId,
        type: "mcq",
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        sourceExam: "WAEC",
      },
      create: {
        id: q.id,
        domain,
        topicId: targetTopicId,
        type: "mcq",
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        sourceExam: "WAEC",
      },
    });
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
