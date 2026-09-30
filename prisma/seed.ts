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

  const courseSeed = [
    { id: "course-programming", slug: "introduction-to-programming", title: "Introduction to Programming", department: "Computer Science", description: "Learn programming fundamentals with practical examples." },
    { id: "course-data", slug: "data-foundations", title: "Data Foundations", department: "Computer Science", description: "Understand how data is represented, queried, and used." },
    { id: "course-statistics", slug: "applied-statistics", title: "Applied Statistics", department: "Mathematics", description: "Build confidence with probability and statistical reasoning." },
    { id: "course-writing", slug: "academic-writing", title: "Academic Writing", department: "Humanities", description: "Plan, structure, and improve academic arguments." },
  ];
  for (const course of courseSeed) {
    await prisma.course.upsert({ where: { id: course.id }, update: { ...course, domain: "university" }, create: { ...course, domain: "university" } });
    await prisma.courseLesson.upsert({
      where: { id: `${course.id}-lesson-1` },
      update: { courseId: course.id, domain: "university", title: `Getting started with ${course.title}`, orderIndex: 0, estimatedMinutes: 15, content: { blocks: [{ type: "heading", level: 2, text: course.title }, { type: "paragraph", text: course.description }, { type: "definition", term: "Learning objective", text: "By the end of this lesson, you can explain the key ideas and apply them to a simple example." }] } },
      create: { id: `${course.id}-lesson-1`, courseId: course.id, domain: "university", title: `Getting started with ${course.title}`, orderIndex: 0, estimatedMinutes: 15, content: { blocks: [{ type: "heading", level: 2, text: course.title }, { type: "paragraph", text: course.description }, { type: "definition", term: "Learning objective", text: "By the end of this lesson, you can explain the key ideas and apply them to a simple example." }] } },
    });
    {
      await prisma.courseLesson.upsert({ where: { id: `${course.id}-lesson-2` }, update: { domain: "university", title: "Variables and expressions", orderIndex: 1 }, create: { id: `${course.id}-lesson-2`, courseId: course.id, domain: "university", title: "Variables and expressions", orderIndex: 1, estimatedMinutes: 20, content: { blocks: [{ type: "heading", level: 2, text: "Variables and expressions" }, { type: "paragraph", text: "A variable gives a name to a value so a program can store and use information." }] } } });
    }
    await prisma.courseQuestion.upsert({ where: { id: `${course.id}-quiz-1` }, update: { domain: "university", courseId: course.id, questionText: `Which best describes the purpose of studying ${course.title}?`, options: ["To understand and apply its core ideas", "To memorize unrelated facts", "To avoid practicing examples", "To replace all other subjects"], correctAnswer: "To understand and apply its core ideas", explanation: "The course builds understanding that learners can use in practical contexts." }, create: { id: `${course.id}-quiz-1`, domain: "university", courseId: course.id, questionText: `Which best describes the purpose of studying ${course.title}?`, options: ["To understand and apply its core ideas", "To memorize unrelated facts", "To avoid practicing examples", "To replace all other subjects"], correctAnswer: "To understand and apply its core ideas", explanation: "The course builds understanding that learners can use in practical contexts." } });
  }

  const extras = ["World Geography", "Everyday Science", "Critical Thinking", "Digital Literacy", "Financial Basics"];
  for (let index = 0; index < extras.length; index++) {
    const title = extras[index];
    const id = `extras-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;
    await prisma.topic.upsert({ where: { id }, update: { title, domain: "extras", parentId: null, orderIndex: index, isPublished: true }, create: { id, title, domain: "extras", orderIndex: index } });
    await prisma.lesson.upsert({ where: { id: `${id}-lesson` }, update: { title, domain: "extras", topicId: id }, create: { id: `${id}-lesson`, title, domain: "extras", topicId: id, estimatedMinutes: 10, content: { blocks: [{ type: "heading", level: 2, text: title }, { type: "paragraph", text: `Explore the foundations of ${title.toLowerCase()} through clear explanations and examples.` }] } } });
    await prisma.question.upsert({ where: { id: `${id}-question` }, update: { domain: "extras", topicId: id, questionText: `Which is a good way to build understanding of ${title.toLowerCase()}?`, options: ["Ask questions and apply ideas", "Avoid examples", "Memorize unrelated details", "Skip practice"], correctAnswer: "Ask questions and apply ideas", explanation: "Active practice and applying ideas help develop understanding." }, create: { id: `${id}-question`, domain: "extras", topicId: id, questionText: `Which is a good way to build understanding of ${title.toLowerCase()}?`, options: ["Ask questions and apply ideas", "Avoid examples", "Memorize unrelated details", "Skip practice"], correctAnswer: "Ask questions and apply ideas", explanation: "Active practice and applying ideas help develop understanding." } });
  }

  // ---- Discovery deep chain: Physics → Mechanics → Motion → Forces → Energy ----
  // Depth convention (no schema change): a topic's lessons ordered by
  // orderIndex map to depth levels: 0 Understand, 1 Explore, 2 Go Deeper, 3 Research.
  interface DiscoSeed {
    id: string;
    title: string;
    parent: string | null;
    order: number;
    lessonTitle: string;
    blocks: object[];
    exploreTitle?: string;
    exploreBlocks?: object[];
    question: {
      id: string;
      questionText: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    };
  }

  const disco: DiscoSeed[] = [
    {
      id: "disco-physics",
      title: "Physics",
      parent: null,
      order: 0,
      lessonTitle: "What physics really is",
      blocks: [
        { type: "heading", level: 2, text: "The study of everything that moves and changes" },
        { type: "paragraph", text: "Physics asks the simplest and hardest questions: why do things fall, what is light, what is time? It studies matter, energy, and the rules that connect them — from tiny atoms to entire galaxies." },
        { type: "definition", term: "Physics", text: "The science of matter, energy, motion, and force — and the fundamental laws that describe how the universe behaves." },
        { type: "example", text: "When you throw a ball, physics can predict exactly where it lands. When engineers build bridges or satellites, they trust the same rules. The same laws work on Earth and on distant planets." },
        { type: "callout", variant: "info", text: "Everything you are about to explore — motion, forces, energy, waves, electricity — is a branch of this one tree." },
      ],
      exploreTitle: "The map of physics",
      exploreBlocks: [
        { type: "heading", level: 2, text: "How the territory fits together" },
        { type: "paragraph", text: "Physics begins with Mechanics — how objects move. Motion leads to Forces, forces lead to Energy, and energy opens the door to Fields, Electromagnetism, Waves, and eventually Relativity and Quantum mechanics." },
        { type: "paragraph", text: "You do not need to learn it in one straight line. Wander: each step links to the next, and every idea connects sideways to mathematics, chemistry, engineering, and astronomy." },
      ],
      question: {
        id: "disco-physics-question",
        questionText: "Which of these best describes what physics studies?",
        options: ["Matter, energy, motion and force", "Only living things", "Only chemicals in a laboratory", "Only stars and planets"],
        correctAnswer: "Matter, energy, motion and force",
        explanation: "Physics covers matter and energy at every scale — living things, chemicals and stars are studied by biology, chemistry and astronomy using physical laws.",
      },
    },
    {
      id: "disco-mechanics",
      title: "Mechanics",
      parent: "disco-physics",
      order: 0,
      lessonTitle: "The rules of motion",
      blocks: [
        { type: "heading", level: 2, text: "Why things move the way they do" },
        { type: "paragraph", text: "Mechanics is the oldest branch of physics. It explains walking, driving, flying, and orbiting — anything with mass that moves. Its foundation is three laws discovered by Isaac Newton in the 1600s." },
        { type: "definition", term: "Mechanics", text: "The branch of physics describing the motion of objects and the forces that cause or change that motion." },
        { type: "example", text: "A car braking at a traffic light, a football curving through the air, the Moon circling Earth — all mechanics, all the same three laws." },
      ],
      exploreTitle: "Beyond Newton",
      exploreBlocks: [
        { type: "heading", level: 2, text: "Where Newton stops working" },
        { type: "paragraph", text: "Newton's laws are superb for everyday speeds and sizes. Near the speed of light they give way to Relativity; at the scale of atoms they give way to Quantum mechanics. Mechanics is the doorway to both." },
      ],
      question: {
        id: "disco-mechanics-question",
        questionText: "Mechanics is best described as the study of…",
        options: ["Motion of objects and the forces behind it", "Chemical reactions", "Living cells", "Electric circuits only"],
        correctAnswer: "Motion of objects and the forces behind it",
        explanation: "Mechanics deals with mass, motion and force — the other options belong to chemistry, biology and electromagnetism.",
      },
    },
    {
      id: "disco-motion",
      title: "Motion",
      parent: "disco-mechanics",
      order: 0,
      lessonTitle: "Describing movement precisely",
      blocks: [
        { type: "heading", level: 2, text: "Displacement, velocity, acceleration" },
        { type: "paragraph", text: "To describe motion, physicists track three quantities. Displacement is how far something moved from its start. Velocity is displacement per second. Acceleration is how fast velocity itself changes." },
        { type: "definition", term: "Acceleration", text: "The rate of change of velocity. A car speeding up, slowing down, or turning is accelerating — even at constant speed, turning counts." },
        { type: "example", text: "A sprinter exploding from the blocks accelerates at roughly 3 m/s² — every second, their velocity grows by 3 metres per second." },
      ],
      question: {
        id: "disco-motion-question",
        questionText: "A car drives at a steady 60 km/h around a circular bend. Is it accelerating?",
        options: ["Yes — its direction is changing", "No — its speed is constant", "Only if it uses more fuel", "Only on uphill bends"],
        correctAnswer: "Yes — its direction is changing",
        explanation: "Acceleration is any change in velocity, and velocity includes direction. Turning at constant speed is still acceleration.",
      },
    },
    {
      id: "disco-forces",
      title: "Forces",
      parent: "disco-motion",
      order: 0,
      lessonTitle: "What pushes the world",
      blocks: [
        { type: "heading", level: 2, text: "Newton's three laws" },
        { type: "paragraph", text: "First law: objects keep doing what they are doing unless a force acts — this is inertia. Second law: force equals mass times acceleration (F = ma). Third law: every action has an equal and opposite reaction." },
        { type: "example", text: "Push a heavy box and a light box with the same force: the light one accelerates more. That is F = ma, felt in your arms." },
        { type: "callout", variant: "warning", text: "Common trap: action–reaction pairs act on DIFFERENT objects. The rocket pushes gas down; the gas pushes the rocket up." },
      ],
      question: {
        id: "disco-forces-question",
        questionText: "A 2 kg object experiences a 10 N force. Its acceleration is…",
        options: ["5 m/s²", "20 m/s²", "12 m/s²", "0.2 m/s²"],
        correctAnswer: "5 m/s²",
        explanation: "F = ma, so a = F/m = 10/2 = 5 m/s².",
      },
    },
    {
      id: "disco-energy",
      title: "Energy",
      parent: "disco-forces",
      order: 0,
      lessonTitle: "The currency of the universe",
      blocks: [
        { type: "heading", level: 2, text: "Energy is never created or destroyed" },
        { type: "paragraph", text: "Energy changes form but the total never changes. A raised weight holds gravitational potential energy; falling, it becomes kinetic energy of motion; landing, it becomes heat and sound. Nothing is lost — only transformed." },
        { type: "definition", term: "Conservation of energy", text: "In a closed system the total energy stays constant. It is one of the most tested and trusted principles in all of science." },
        { type: "example", text: "Hydroelectric dams are conservation of energy at giant scale: falling water's motion spins turbines that generate electricity lighting distant cities." },
        { type: "callout", variant: "info", text: "Go deeper next: fields and electromagnetism — energy carried through empty space itself." },
      ],
      question: {
        id: "disco-energy-question",
        questionText: "A ball falls from a height. Ignoring air resistance, what happens to its total mechanical energy?",
        options: ["It stays constant — potential becomes kinetic", "It decreases steadily", "It increases as it speeds up", "It becomes zero at the ground"],
        correctAnswer: "It stays constant — potential becomes kinetic",
        explanation: "Lost potential energy reappears exactly as kinetic energy. Conservation of energy holds at every instant of the fall.",
      },
    },
    {
      id: "disco-waves",
      title: "Waves",
      parent: "disco-physics",
      order: 1,
      lessonTitle: "How energy travels",
      blocks: [
        { type: "heading", level: 2, text: "Disturbances on the move" },
        { type: "paragraph", text: "A wave carries energy from place to place without carrying matter along. Ocean waves move across water while the water mostly bobs up and down. Sound, light, and earthquakes all travel as waves." },
        { type: "definition", term: "Wave", text: "A travelling disturbance that transfers energy. Key properties: wavelength, frequency, amplitude and speed, linked by speed = frequency × wavelength." },
        { type: "example", text: "Pluck a guitar string: the string vibrates hundreds of times per second, the air carries that vibration to your ear, and your brain hears a note." },
      ],
      question: {
        id: "disco-waves-question",
        questionText: "What does a wave transport from one place to another?",
        options: ["Energy, without net movement of matter", "Matter from source to receiver", "Only sound", "Only light"],
        correctAnswer: "Energy, without net movement of matter",
        explanation: "The medium oscillates in place while the energy of the disturbance travels onward — true for water, sound and light alike.",
      },
    },
    {
      id: "disco-electromagnetism",
      title: "Electromagnetism",
      parent: "disco-physics",
      order: 2,
      lessonTitle: "Electricity and magnetism are one thing",
      blocks: [
        { type: "heading", level: 2, text: "Two forces, one field" },
        { type: "paragraph", text: "Electric charges create electric fields; moving charges create magnetic fields. In the 1800s Maxwell showed they are a single electromagnetic field — and that light itself is a wave in it." },
        { type: "paragraph", text: "Every screen, motor, generator and radio you have ever used runs on this unity. It is the deepest idea in classical physics, and the bridge to relativity and quantum theory." },
      ],
      question: {
        id: "disco-electromagnetism-question",
        questionText: "What did Maxwell's equations reveal about light?",
        options: ["Light is an electromagnetic wave", "Light needs air to travel", "Light is unrelated to electricity", "Light travels slower than sound"],
        correctAnswer: "Light is an electromagnetic wave",
        explanation: "Maxwell predicted electromagnetic waves travelling at the known speed of light — identifying light as one of them.",
      },
    },
  ];

  for (const item of disco) {
    await prisma.topic.upsert({
      where: { id: item.id },
      update: { title: item.title, domain: "extras", parentId: item.parent, orderIndex: item.order, isPublished: true },
      create: { id: item.id, title: item.title, domain: "extras", parentId: item.parent, orderIndex: item.order, isPublished: true },
    });
    await prisma.lesson.upsert({
      where: { id: `${item.id}-lesson` },
      update: { title: item.lessonTitle, domain: "extras", topicId: item.id, orderIndex: 0, content: { blocks: item.blocks } },
      create: { id: `${item.id}-lesson`, title: item.lessonTitle, domain: "extras", topicId: item.id, orderIndex: 0, estimatedMinutes: 8, content: { blocks: item.blocks } },
    });
    if (item.exploreBlocks) {
      await prisma.lesson.upsert({
        where: { id: `${item.id}-lesson-explore` },
        update: { title: item.exploreTitle ?? "Explore", domain: "extras", topicId: item.id, orderIndex: 1, content: { blocks: item.exploreBlocks } },
        create: { id: `${item.id}-lesson-explore`, title: item.exploreTitle ?? "Explore", domain: "extras", topicId: item.id, orderIndex: 1, estimatedMinutes: 6, content: { blocks: item.exploreBlocks } },
      });
    }
    const q = item.question;
    await prisma.question.upsert({
      where: { id: q.id },
      update: { domain: "extras", topicId: item.id, questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation },
      create: { id: q.id, domain: "extras", topicId: item.id, questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation },
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
