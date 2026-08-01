"use client";

import type { CSSProperties } from "react";

export type DobPart = "d" | "m" | "y";

type Props = {
  label?: string;
  day: string;
  month: string;
  year: string;
  onChange: (part: DobPart, value: string) => void;
  style?: CSSProperties;
};

/* DD / MM / YYYY in one framed row. Three cells, slash separators, digits
   only. Ported from design/system/components/forms/DateField.jsx (web). */
export function DateField({ label = "BORN", day, month, year, onChange, style }: Props) {
  const cell = (value: string, len: number, placeholder: string, part: DobPart, width: number) => (
    <input
      type="tel"
      inputMode="numeric"
      maxLength={len}
      value={value}
      placeholder={placeholder}
      aria-label={`${label} ${placeholder}`}
      onChange={(e) => onChange(part, e.target.value.replace(/[^0-9]/g, "").slice(0, len))}
      style={{
        width,
        flex: "none",
        background: "transparent",
        border: "none",
        outline: "none",
        color: "var(--text-primary)",
        caretColor: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "var(--mono-9)",
        padding: "18px 0",
        textAlign: "center",
      }}
    />
  );
  const slash = (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontSize: "var(--mono-9)",
        color: "var(--text-faint)",
        display: "flex",
        alignItems: "center",
      }}
    >
      /
    </span>
  );

  return (
    <div style={{ border: "var(--border-interactive)", display: "flex", alignItems: "stretch", ...style }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-2)",
          color: "var(--text-secondary)",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          borderRight: "var(--border-hairline)",
          whiteSpace: "nowrap",
          flex: "none",
        }}
      >
        {label}
      </span>
      {cell(day, 2, "DD", "d", 46)}
      {slash}
      {cell(month, 2, "MM", "m", 46)}
      {slash}
      {cell(year, 4, "YYYY", "y", 64)}
    </div>
  );
}
