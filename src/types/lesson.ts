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
  | { type: "diagram"; diagramId: string; caption: string };

export type LessonContent = {
  blocks: LessonBlock[];
};
