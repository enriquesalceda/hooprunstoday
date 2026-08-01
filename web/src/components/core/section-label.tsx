import type { CSSProperties, ReactNode } from "react";

/* The only heading the system has. */
export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontSize: "var(--mono-2)",
        color: "var(--text-faint)",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
