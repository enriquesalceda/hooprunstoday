"use client";

import type { CSSProperties, ReactNode } from "react";

type Props = {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  uppercase?: boolean; // display-only; the submitted value keeps its typed case
  value?: string;
  onChange?: (value: string) => void;
  trailing?: ReactNode; // e.g. a UnitToggle, flush inside the frame
  style?: CSSProperties;
};

/* The system's only free-text input: label cell inside the 1px frame.
   Uncontrolled by default (pairs with form actions via name/FormData);
   pass value/onChange for controlled use.
   Ported from design/system/components/forms/FieldRow.jsx (web metrics). */
export function FieldRow({
  label,
  id,
  name,
  placeholder,
  autoComplete,
  required,
  uppercase,
  value,
  onChange,
  trailing,
  style,
}: Props) {
  return (
    <div style={{ border: "var(--border-interactive)", display: "flex", alignItems: "stretch", ...style }}>
      <label
        htmlFor={id}
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
      </label>
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
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
          textTransform: uppercase ? "uppercase" : "none",
        }}
      />
      {trailing}
    </div>
  );
}
