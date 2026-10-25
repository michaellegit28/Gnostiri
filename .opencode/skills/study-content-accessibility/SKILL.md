---
name: study-content-accessibility
description: Use when writing study-UI components or lesson copy learners interact with — quizzes, theory prompts, timers, CBT flow, diagrams, results feedback. Trigger keywords: accessibility, a11y, WCAG, keyboard, screen reader, focus, contrast, reduced motion, quiz feedback, timer, drag and drop.
---

# Study content accessibility

Gnostiri's interactive study components (CBT, theory prompts, battle-plan timers, arena, diagrams) must be usable by keyboard and screen reader.

Checklist per component/change:
1. **Keyboard-operable**: every interactive element reachable and activatable (Tab/Enter/Space); no mouse-only handlers; drag-and-drop needs a keyboard alternative (select + move buttons).
2. **Focus visible**: never remove outlines without a custom visible focus style; focus order follows reading order.
3. **Screen reader**: icon-only buttons get `aria-label`; quiz state changes (`aria-live="polite"`): question loaded, answer submitted, correct/incorrect, time warnings.
4. **Not color-only**: correct/incorrect, difficulty, and mastery signals need text or icon in addition to color. Contrast ≥ 4.5:1 for body text.
5. **Timers are extendable**: announce remaining time at intervals; users with accommodations get an extended-time path (never a hard wall on assessment timers).
6. **Reduced motion**: respect `prefers-reduced-motion` for effects in `src/components/effects/`; no essential information conveyed only by animation.
7. **Diagrams** (`src/components/diagrams/`): text equivalent describing what the diagram shows; SVG titles/descs.
8. Test with `@playwright/mcp` keyboard-only traversal of the full question → submit → feedback loop.
