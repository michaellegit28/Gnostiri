import prisma from "@/lib/db";
import QuizClient, { QuestionItem } from "./QuizClient";

interface QuizPageProps {
  params: {
    exam: string;
    subject: string;
    topic: string;
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const examSlug = params.exam.toLowerCase();
  const subjectSlug = params.subject.toLowerCase();
  const topicSlug = params.topic.toLowerCase();

  let examination = null;
  let subjectTopic = null;
  let currentTopic = null;
  let questionsData: Array<{
    id: string;
    questionText: string;
    options: unknown;
    correctAnswer: string;
    explanation: string | null;
    difficulty: string;
  }> = [];

  try {
    examination = await prisma.examination.findFirst({
      where: {
        domain: "highschool",
        code: {
          equals: examSlug,
          mode: "insensitive",
        },
      },
    });

    if (examination) {
      const subjectTopicId = `${examination.code.toLowerCase()}-${subjectSlug}`;
      subjectTopic = await prisma.topic.findFirst({
        where: {
          domain: "highschool",
          id: subjectTopicId,
        },
      });

      if (subjectTopic) {
        const fullTopicId = `${subjectTopic.id}-${topicSlug}`;
        currentTopic = await prisma.topic.findFirst({
          where: {
            domain: "highschool",
            id: fullTopicId,
          },
        });

        if (currentTopic) {
          questionsData = await prisma.question.findMany({
            where: {
              domain: "highschool",
              topicId: currentTopic.id,
            },
            orderBy: {
              id: "asc",
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("Database error in QuizPage:", err);
  }

  const topicTitle =
    currentTopic?.title || topicSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const examName = examination?.name.toUpperCase() || examSlug.toUpperCase();
  const subjectTitle =
    subjectTopic?.title || subjectSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const topicId = currentTopic?.id || `${examSlug}-${subjectSlug}-${topicSlug}`;

  const questions: QuestionItem[] = questionsData.map((q) => {
    let optionsArray: string[] = [];
    if (Array.isArray(q.options)) {
      optionsArray = q.options as string[];
    } else if (typeof q.options === "string") {
      try {
        optionsArray = JSON.parse(q.options);
      } catch {
        optionsArray = [];
      }
    }

    return {
      id: q.id,
      questionText: q.questionText,
      options: optionsArray,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? undefined,
      difficulty: q.difficulty,
    };
  });

  return (
    <QuizClient
      examCode={examSlug}
      examName={examName}
      subjectSlug={subjectSlug}
      subjectTitle={subjectTitle}
      topicSlug={topicSlug}
      topicTitle={topicTitle}
      topicId={topicId}
      initialQuestions={questions}
    />
  );
}
