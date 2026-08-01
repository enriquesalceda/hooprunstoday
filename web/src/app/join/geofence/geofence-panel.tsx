"use client";

import { SplitSlate } from "@/app/join/_components/split-slate";
import { Button } from "@/components/core/button";

const FACTS: [string, string][] = [
  ["COURT CHECK-IN", "REQUIRES PROXIMITY MATCH"],
  ["BROWSING COURTS", "WORKS WITHOUT LOCATION"],
  ["BACKGROUND TRACKING", "NEVER"],
  ["STORED HISTORY", "CHECK-INS ONLY"],
];

type Props = {
  asking: boolean;
  onGrant: () => void;
  onSkip: () => void;
};

export function GeofencePanel({ asking, onGrant, onSkip }: Props) {
  return (
    <SplitSlate
      statement={["GEOFENCE", "ACCESS"]}
      caption="CHECK-INS ARE VERIFIED BY PROXIMITY, NOT BY TRUST"
    >
      <div style={{ border: "var(--border-hairline)", display: "flex", flexDirection: "column" }}>
        {FACTS.map(([term, value], i) => (
          <div
            key={term}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-5)",
              padding: "16px 14px",
              borderBottom: i < FACTS.length - 1 ? "var(--border-faint)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "var(--mono-5)",
                color: "var(--text-primary)",
              }}
            >
              {term}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: "var(--mono-3)",
                color: "var(--text-secondary)",
                textAlign: "right",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "var(--mono-2)",
          color: "var(--text-faint)",
          lineHeight: 1.6,
        }}
      >
        LOCATION IS READ ONLY WHILE THE TAB IS OPEN.
      </p>
      <Button onClick={onGrant} disabled={asking}>
        {asking ? "REQUESTING…" : "GRANT LOCATION ACCESS"}
      </Button>
      <button
        type="button"
        onClick={onSkip}
        style={{
          background: "none",
          border: "none",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-4)",
          color: "var(--text-faint)",
          cursor: "pointer",
        }}
      >
        SKIP — BROWSE ONLY
      </button>
    </SplitSlate>
  );
}
