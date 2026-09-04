export type LessonBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "definition"; term: string; text: string }
  | { type: "example"; text: string }
  | { type: "callout"; variant: "info" | "warning"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type LessonContent = {
  blocks: LessonBlock[];
};
