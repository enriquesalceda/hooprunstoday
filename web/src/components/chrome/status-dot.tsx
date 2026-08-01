import type { CSSProperties } from "react";

/* The only round thing in the system. Pulses forever while the session is live. */
export function StatusDot({ style }: { style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "var(--dot-size)",
        height: "var(--dot-size)",
        background: "var(--text-primary)",
        borderRadius: "var(--radius-dot)",
        animation: "hr-pulse var(--dur-pulse) infinite",
        flex: "none",
        ...style,
      }}
    />
  );
}
