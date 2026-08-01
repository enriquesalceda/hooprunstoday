"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

type Props = {
  label: string; // names the destination, never "back"
  onClick: () => void;
  style?: CSSProperties;
};

export function BackLink({ label, onClick, style }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: "none",
        alignSelf: "flex-start",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "var(--mono-4)",
        textTransform: "uppercase",
        color: hover ? "var(--text-primary)" : "var(--text-secondary)",
        cursor: "pointer",
        ...style,
      }}
    >
      ← {label}
    </button>
  );
}
