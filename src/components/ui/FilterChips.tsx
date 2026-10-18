/**
 * FilterChips — a row of pill toggles. Controlled: the parent owns the value.
 * Two semantics, same visuals:
 *  - default ("chips"): aria-pressed toggles for independent filters
 *  - "tabs": role=tab / aria-selected + aria-controls for single-select views
 * Items can be disabled (shown but not selectable). Server-safe.
 */
export type ChipItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export default function FilterChips({
  items,
  value,
  onChange,
  label,
  variant = "chips",
  idPrefix = "chip",
  panelId,
}: {
  items: ChipItem[];
  value: string | null;
  onChange: (value: string) => void;
  /** Accessible name for the group (chips) or tablist (tabs). */
  label: string;
  variant?: "chips" | "tabs";
  idPrefix?: string;
  /** tabs variant only: id of the panel these tabs control. */
  panelId?: string;
}) {
  const isTabs = variant === "tabs";
  return (
    <div
      role={isTabs ? "tablist" : "group"}
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => {
        const active = item.value === value;
        const tabId = `${idPrefix}-${item.value}`;
        return (
          <button
            key={item.value}
            id={isTabs ? tabId : undefined}
            type="button"
            role={isTabs ? "tab" : undefined}
            aria-selected={isTabs ? active : undefined}
            aria-controls={isTabs && panelId ? panelId : undefined}
            aria-pressed={isTabs ? undefined : active}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            className={`shrink-0 min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40 ${
              active
                ? "border-transparent bg-gold text-slate-950"
                : "border-white/10 bg-white/5 text-slate-200 hover:border-gold/50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
