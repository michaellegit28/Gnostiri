// NOTE: Run this seed script with `npx prisma db seed` once a real live PostgreSQL database is connected.

import { PrismaClient, AppDomain } from "@prisma/client";
import { LessonContent } from "../src/types/lesson";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create 3 High School Examinations
  const examsData = [
    { name: "West African Senior School Certificate Examination", code: "WAEC", country: "West Africa" },
    { name: "Joint Admissions and Matriculation Board", code: "JAMB", country: "Nigeria" },
    { name: "National Examinations Council", code: "NECO", country: "Nigeria" },
  ];

  for (const exam of examsData) {
    const createdExam = await prisma.examination.upsert({
      where: { id: `exam-${exam.code.toLowerCase()}` },
      update: {},
      create: {
        id: `exam-${exam.code.toLowerCase()}`,
        domain: AppDomain.highschool,
        name: exam.name,
        code: exam.code,
        country: exam.country,
      },
    });

    // 2. Create 5 Subjects per exam as top-level parent Topic
    const subjects = [
      {
        title: "Mathematics",
        description: "Core high school mathematics including algebra, geometry, and calculus.",
        topics: [
          "Quadratic Equations",
          "Trigonometry",
          "Indices and Logarithms",
          "Surds and Sequences",
          "Coordinate Geometry",
          "Probability and Statistics",
        ],
      },
      {
        title: "English Language",
        description: "Grammar, comprehension, essay writing, and vocabulary.",
        topics: [
          "Grammar & Parts of Speech",
          "Comprehension Passages",
          "Summary Writing",
          "Lexis and Structure",
          "Oral English & Phonetics",
        ],
      },
      {
        title: "Physics",
        description: "Mechanics, waves, electricity, optics, and modern physics.",
        topics: [
          "Kinematics and Dynamics",
          "Work, Energy, and Power",
          "Waves and Optics",
          "Electric Fields and Current",
          "Atomic and Nuclear Physics",
        ],
      },
      {
        title: "Chemistry",
        description: "Physical, inorganic, and organic chemistry.",
        topics: [
          "Atomic Structure & Periodic Table",
          "Chemical Bonding",
          "Stoichiometry & Mole Concept",
          "Acids, Bases, and Salts",
          "Organic Chemistry Fundamentals",
        ],
      },
      {
        title: "Biology",
        description: "Cell biology, ecology, genetics, and human physiology.",
        topics: [
          "Cell Structure & Function",
          "Nutrition in Living Organisms",
          "Transport System in Plants and Animals",
          "Ecology & Ecosystems",
          "Genetics & Variation",
        ],
      },
    ];

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const subjectTopicId = `topic-${createdExam.code.toLowerCase()}-${subject.title.toLowerCase().replace(/\s+/g, "-")}`;

      const createdSubjectTopic = await prisma.topic.upsert({
        where: { id: subjectTopicId },
        update: {},
        create: {
          id: subjectTopicId,
          domain: AppDomain.highschool,
          title: subject.title,
          description: subject.description,
          orderIndex: i,
          isPublished: true,
        },
      });

      // 3. Create Subtopics under Subject
      for (let j = 0; j < subject.topics.length; j++) {
        const topicTitle = subject.topics[j];
        const subtopicSlug = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const subtopicId = `subtopic-${createdExam.code.toLowerCase()}-${subject.title.toLowerCase().replace(/\s+/g, "-")}-${subtopicSlug}`;

        const createdSubtopic = await prisma.topic.upsert({
          where: { id: subtopicId },
          update: {},
          create: {
            id: subtopicId,
            domain: AppDomain.highschool,
            parentId: createdSubjectTopic.id,
            title: topicTitle,
            description: `Study guide for ${topicTitle} in ${subject.title} (${createdExam.code}).`,
            orderIndex: j,
            isPublished: true,
          },
        });

        // 4. For ONE topic only (WAEC > Mathematics > Quadratic Equations), populate Lesson and 10 Questions
        if (createdExam.code === "WAEC" && subject.title === "Mathematics" && topicTitle === "Quadratic Equations") {
          const lessonContent: LessonContent = {
            blocks: [
              {
                type: "heading",
                level: 2,
                text: "Introduction to Quadratic Equations",
              },
              {
                type: "paragraph",
                text: "A quadratic equation is a second-order polynomial equation in a single variable x, written in the standard form ax² + bx + c = 0, where a ≠ 0.",
              },
              {
                type: "definition",
                term: "Discriminant (Δ)",
                text: "The expression b² - 4ac is called the discriminant. It determines the nature of the roots: real and distinct if Δ > 0, real and equal if Δ = 0, and complex if Δ < 0.",
              },
              {
                type: "heading",
                level: 3,
                text: "Methods of Solving Quadratic Equations",
              },
              {
                type: "paragraph",
                text: "There are three primary algebraic methods to solve quadratic equations: Factoring, Completing the Square, and applying the Quadratic Formula.",
              },
              {
                type: "callout",
                variant: "info",
                text: "Tip: Always check if the quadratic expression can be easily factored before attempting Completing the Square or using the Quadratic Formula.",
              },
              {
                type: "example",
                text: "Solve x² - 5x + 6 = 0 using factoring.\nSolution: Find two numbers that multiply to +6 and add to -5 (-2 and -3).\n(x - 2)(x - 3) = 0 ⇒ x = 2 or x = 3.",
              },
              {
                type: "callout",
                variant: "warning",
                text: "Beware: If a = 0, the equation is linear, not quadratic! Ensure the coefficient of x² is non-zero.",
              },
              {
                type: "table",
                headers: ["Method", "Best Used When", "Formula / Technique"],
                rows: [
                  ["Factoring", "b² - 4ac is a perfect square", "(x - p)(x - q) = 0"],
                  ["Quadratic Formula", "Any quadratic equation", "x = (-b ± √(b² - 4ac)) / 2a"],
                  ["Completing Square", "Deriving formula or finding vertex", "(x + d)² = e"],
                ],
              },
            ],
          };

          await prisma.lesson.upsert({
            where: { id: "lesson-waec-math-quadratic-equations" },
            update: {},
            create: {
              id: "lesson-waec-math-quadratic-equations",
              domain: AppDomain.highschool,
              topicId: createdSubtopic.id,
              title: "Comprehensive Guide to Quadratic Equations",
              content: lessonContent as unknown as object,
              orderIndex: 0,
              estimatedMinutes: 20,
            },
          });

          // Seed 10 MCQ Questions
          const questionsData = [
            {
              questionText: "What are the roots of the quadratic equation x² - 7x + 12 = 0?",
              options: ["x = 3, 4", "x = -3, -4", "x = 2, 6", "x = 1, 12"],
              correctAnswer: "x = 3, 4",
              explanation: "Factoring yields (x - 3)(x - 4) = 0, so x = 3 or x = 4.",
              difficulty: "easy",
            },
            {
              questionText: "Which of the following represents the quadratic formula?",
              options: [
                "x = (-b ± √(b² - 4ac)) / (2a)",
                "x = (b ± √(b² + 4ac)) / (2a)",
                "x = (-b ± √(b² - 2ac)) / a",
                "x = (-b ± √(4ac)) / (2a)",
              ],
              correctAnswer: "x = (-b ± √(b² - 4ac)) / (2a)",
              explanation: "The standard quadratic formula is x = (-b ± √(b² - 4ac)) / (2a).",
              difficulty: "easy",
            },
            {
              questionText: "What is the discriminant of x² + 4x + 4 = 0?",
              options: ["0", "16", "-16", "8"],
              correctAnswer: "0",
              explanation: "b² - 4ac = 4² - 4(1)(4) = 16 - 16 = 0.",
              difficulty: "easy",
            },
            {
              questionText: "If the discriminant of a quadratic equation is negative, the roots are:",
              options: ["Complex / Imaginary", "Real and equal", "Real and distinct", "Undefined"],
              correctAnswer: "Complex / Imaginary",
              explanation: "A negative discriminant (Δ < 0) implies taking the square root of a negative number, resulting in complex conjugate roots.",
              difficulty: "medium",
            },
            {
              questionText: "Find the value of k if x² - kx + 9 = 0 has equal roots.",
              options: ["±6", "±3", "±9", "±12"],
              correctAnswer: "±6",
              explanation: "For equal roots, Δ = k² - 4(1)(9) = 0 ⇒ k² = 36 ⇒ k = ±6.",
              difficulty: "medium",
            },
            {
              questionText: "What is the sum of the roots of 2x² - 8x + 6 = 0?",
              options: ["4", "3", "-4", "-3"],
              correctAnswer: "4",
              explanation: "Sum of roots = -b/a = -(-8)/2 = 8/2 = 4.",
              difficulty: "medium",
            },
            {
              questionText: "What is the product of the roots of 3x² + 5x - 12 = 0?",
              options: ["-4", "4", "12/3", "-5/3"],
              correctAnswer: "-4",
              explanation: "Product of roots = c/a = -12/3 = -4.",
              difficulty: "medium",
            },
            {
              questionText: "Form a quadratic equation whose roots are 2 and -5.",
              options: ["x² + 3x - 10 = 0", "x² - 3x - 10 = 0", "x² + 3x + 10 = 0", "x² - 7x + 10 = 0"],
              correctAnswer: "x² + 3x - 10 = 0",
              explanation: "Equation is x² - (sum)x + product = 0. Sum = 2 + (-5) = -3. Product = 2(-5) = -10. x² - (-3)x + (-10) = x² + 3x - 10 = 0.",
              difficulty: "hard",
            },
            {
              questionText: "Solve by completing the square: x² + 6x + 5 = 0.",
              options: ["x = -1, -5", "x = 1, 5", "x = -2, -3", "x = 0, -5"],
              correctAnswer: "x = -1, -5",
              explanation: "(x + 3)² - 9 + 5 = 0 ⇒ (x + 3)² = 4 ⇒ x + 3 = ±2 ⇒ x = -1 or x = -5.",
              difficulty: "hard",
            },
            {
              questionText: "If one root of x² - p x + 8 = 0 is twice the other, find the positive value of p.",
              options: ["6", "4", "8", "12"],
              correctAnswer: "6",
              explanation: "Let roots be r and 2r. Product r(2r) = 8 ⇒ 2r² = 8 ⇒ r² = 4 ⇒ r = 2. Sum r + 2r = 3r = 3(2) = 6 = p.",
              difficulty: "hard",
            },
          ];

          for (let k = 0; k < questionsData.length; k++) {
            const q = questionsData[k];
            await prisma.question.upsert({
              where: { id: `q-waec-math-quad-${k + 1}` },
              update: {},
              create: {
                id: `q-waec-math-quad-${k + 1}`,
                domain: AppDomain.highschool,
                topicId: createdSubtopic.id,
                type: "mcq",
                questionText: q.questionText,
                options: q.options as unknown as object,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: q.difficulty,
                sourceExam: "WAEC",
              },
            });
          }
        }
      }
    }
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
