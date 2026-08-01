"use client";

import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

/* Outline chip — multi-select (positions at sign-up). `selected` inverts,
   the same inversion as every other selected state in the product.
   Ported from design/system/components/core/Chip.jsx (outline variant). */
export function Chip({ children, selected = false, onClick, style }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        cursor: onClick ? "pointer" : "default",
        border: "var(--border-chip)",
        background: selected ? "var(--selected-bg)" : "var(--unselected-bg)",
        color: selected ? "var(--selected-ink)" : "var(--text-body)",
        fontWeight: 700,
        fontSize: "var(--mono-4)",
        letterSpacing: "var(--track-label)",
        padding: "10px 13px",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
