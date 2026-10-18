"use client";

import { useEffect, useRef } from "react";

/**
 * useDialogFocus — focus management for role="dialog" surfaces.
 * On open: remembers the trigger, moves focus into the panel (the first
 * focusable element, else the panel itself). While open: Tab / Shift+Tab
 * cycle inside the panel. On close: focus returns to the trigger.
 * `active` gates the behaviour — pass false while the dialog is not
 * rendered (e.g. inside a long-lived parent component).
 * Purely additive — Escape handling stays with each dialog.
 */
export default function useDialogFocus<T extends HTMLElement>(active = true) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active) return;
    const panel = ref.current;
    if (!panel) return;
    const trigger = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    const first = focusables()[0];
    (first ?? panel).focus?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKey);
    return () => {
      panel.removeEventListener("keydown", onKey);
      trigger?.focus?.();
    };
  }, [active]);

  return ref;
}
