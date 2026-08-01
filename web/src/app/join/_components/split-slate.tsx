import type { ReactNode } from "react";

type Props = {
  statement: [string, string]; // two stacked Anton lines
  caption: string;
  children: ReactNode; // right panel content
};

/* The web auth layout: statement slate left, form panel right.
   min-width:min-content on the left is load-bearing — the 96px headline
   must never clip or overlap the divider; the right panel absorbs squeeze. */
export function SplitSlate({ statement, caption, children }: Props) {
  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      <div
        style={{
          flex: 1,
          minWidth: "min-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-8)",
          padding: "var(--space-14)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--display-7)",
            lineHeight: 0.9,
            color: "var(--text-primary)",
          }}
        >
          {statement[0]}
          <br />
          {statement[1]}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "var(--mono-4)",
            letterSpacing: "var(--track-label)",
            color: "var(--text-faint)",
          }}
        >
          {caption}
        </p>
      </div>
      <div
        style={{
          flex: "0 1 520px",
          minWidth: 0,
          maxWidth: "100%",
          borderLeft: "var(--border-hairline)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-6)",
          padding: "var(--space-14) var(--space-13)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
