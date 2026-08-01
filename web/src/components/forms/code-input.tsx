"use client";

import type { CSSProperties } from "react";

export type CodeInputState = "default" | "error" | "locked";

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  state?: CodeInputState;
  style?: CSSProperties;
};

/* Email OTP entry: N cells driven by one invisible full-size input. Border
   style carries state — solid while typing, dashed once rejected or locked.
   Ported from design/system/components/forms/CodeInput.jsx (web metrics). */
export function CodeInput({ length = 6, value, onChange, state = "default", style }: Props) {
  const bad = state === "error" || state === "locked";
  const locked = state === "locked";

  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${length}, 1fr)`, gap: 8 }}>
        {Array.from({ length }, (_, i) => {
          const filled = i < value.length;
          return (
            <div
              key={i}
              style={{
                height: 82,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 44,
                color: "var(--text-primary)",
                border: `1px ${bad ? "dashed" : "solid"} ${
                  bad ? "var(--pending-line)" : filled ? "var(--text-primary)" : "var(--line-interactive)"
                }`,
                background: filled && state !== "error" ? "var(--surface-track)" : "transparent",
                opacity: locked ? "var(--disabled-opacity)" : 1,
              }}
            >
              {value[i] ?? ""}
            </div>
          );
        })}
      </div>
      <input
        aria-label="Verification code"
        type="tel"
        inputMode="numeric"
        maxLength={length}
        value={value}
        disabled={locked}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, length))}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 16,
          cursor: "pointer",
          caretColor: "transparent",
        }}
      />
    </div>
  );
}
