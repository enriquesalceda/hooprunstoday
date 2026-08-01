import type { CSSProperties } from "react";

type Props = {
  size?: number;
  style?: CSSProperties;
};

/* One-line lockup for app chrome. Print/export contexts use the files in
   design/assets/ instead — never retype the stacked construction. */
export function Logo({ size = 20, style }: Props) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.27), ...style }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1,
          color: "var(--paper-000)",
        }}
      >
        HOOPRUNS
      </span>
      <span
        style={{
          background: "var(--paper-000)",
          color: "var(--ink-900)",
          fontFamily: "var(--font-ui)",
          fontWeight: 700,
          fontSize: size * 0.333,
          letterSpacing: "var(--track-bar)",
          padding: `${size * 0.15}px ${size * 0.1}px ${size * 0.15}px ${size * 0.267}px`,
        }}
      >
        .TODAY
      </span>
    </span>
  );
}
