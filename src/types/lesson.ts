export type LessonBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "definition"; term: string; text: string }
  | { type: "example"; text: string }
  | { type: "callout"; variant: "info" | "warning"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; language: "python" | "text"; code: string; output?: string; caption?: string }
  | { type: "question"; prompt: string; answer: string; explanation?: string }
  | { type: "mcq"; stem: string; options: string[]; correctIndex: number; explanation: string }
  | { type: "diagram"; diagramId: string; caption: string }
  | {
      type: "principle";
      term?: string;
      text: string;
      equation?: string;
    }
  | {
      type: "project";
      term?: string;
      text: string;
      materials?: string[];
      metadata?: { estimatedMinutes?: number };
    }
  | {
      type: "hypothesis";
      term?: string;
      text: string;
      status?: string;
    }
  | {
      type: "news-item";
      term?: string;
      text: string;
      source?: string;
      date?: string;
      metadata?: { date?: string };
    }
  | {
      type: "research";
      term?: string;
      text: string;
      citation: string;
      doi?: string;
      url?: string;
    };

export type LessonContent = {
  blocks: LessonBlock[];
};
