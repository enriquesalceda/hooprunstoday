"use client";

import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: CSSProperties;
};

/* The single primary action. Enabled inverts; disabled keeps the white
   frame but empties the fill. No secondary or ghost variant exists. */
export function Button({ children, onClick, disabled = false, type = "button", style }: Props) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: "var(--button-h-web)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "var(--mono-7)",
        letterSpacing: "var(--track-action)",
        textTransform: "uppercase",
        border: "var(--border-inverted)",
        cursor: disabled ? "default" : "pointer",
        background: disabled ? "transparent" : "var(--selected-bg)",
        color: disabled ? "var(--disabled-ink)" : "var(--selected-ink)",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
