"use client";

import type { CSSProperties } from "react";
import { useId } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: CSSProperties;
};

/* Email entry — the single identity field for sign-in and sign-up.
   Ported from design/system/components/forms/EmailField.jsx (web metrics). */
export function EmailField({
  label = "EMAIL",
  value,
  onChange,
  placeholder = "you@court.com",
  style,
}: Props) {
  const id = useId();
  return (
    <div style={{ border: "var(--border-interactive)", display: "flex", alignItems: "stretch", ...style }}>
      <label
        htmlFor={id}
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
      </label>
      <input
        id={id}
        type="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--text-primary)",
          caretColor: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-9)",
          padding: "18px 14px",
        }}
      />
    </div>
  );
}

/* Mask for the code screen: keep the first character and the whole domain. */
export function maskEmail(v: string): string {
  const e = v.trim();
  const at = e.indexOf("@");
  if (at < 1) return "•••@•••";
  return e[0] + "•••••" + e.slice(at);
}
