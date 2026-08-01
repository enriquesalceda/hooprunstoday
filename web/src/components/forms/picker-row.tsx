"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  glyph?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
};

/* A framed row that opens something: a sub-screen ("→") or an inline list.
   Same anatomy as FieldRow so a form reads as one column of identical rows.
   Ported from design/system/components/forms/PickerRow.jsx (web). */
export function PickerRow({ label, value, placeholder = "SELECT", glyph = "→", onClick, disabled, style }: Props) {
  const [hover, setHover] = useState(false);
  const empty = !value;

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-disabled={disabled}
      style={{
        border: "var(--border-interactive)",
        display: "flex",
        alignItems: "stretch",
        cursor: disabled ? "default" : "pointer",
        background: hover && !disabled ? "var(--hover-bg)" : "transparent",
        padding: 0,
        width: "100%",
        textAlign: "left",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        ...style,
      }}
    >
      <span
        style={{
          width: 120,
          flex: "none",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-2)",
          color: "var(--text-secondary)",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          borderRight: "var(--border-hairline)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-8)",
          color: empty ? "var(--text-faint)" : "var(--text-primary)",
          padding: "19px 14px",
        }}
      >
        {value || placeholder}
      </span>
      <span
        style={{
          width: 48,
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: 22,
          color: "var(--text-secondary)",
          borderLeft: "var(--border-hairline)",
        }}
      >
        {glyph}
      </span>
    </button>
  );
}
