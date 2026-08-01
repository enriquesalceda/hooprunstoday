"use client";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  width?: number;
};

/* Tiny segments that live inside a FieldRow's frame — never wrap in their
   own border. Ported from design/system/components/forms/UnitToggle.jsx. */
export function UnitToggle<T extends string>({ options, value, onChange, width = 48 }: Props<T>) {
  return (
    <>
      {options.map((opt) => {
        const on = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt)}
            style={{
              width,
              flex: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "var(--mono-2)",
              letterSpacing: "var(--track-label)",
              cursor: "pointer",
              userSelect: "none",
              border: "none",
              borderLeft: "var(--border-interactive)",
              background: on ? "var(--selected-bg)" : "var(--unselected-bg)",
              color: on ? "var(--selected-ink)" : "var(--unselected-ink)",
            }}
          >
            {opt}
          </button>
        );
      })}
    </>
  );
}
