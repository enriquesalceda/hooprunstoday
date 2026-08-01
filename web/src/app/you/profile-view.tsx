"use client";

import { useState } from "react";

import { SectionLabel } from "@/components/core/section-label";
import type { Player } from "@/lib/api/players";

type Props = {
  player: Player;
  courtName?: string;
};

const mono = (weight: number, size: string, color: string) =>
  ({
    fontFamily: "var(--font-mono)",
    fontWeight: weight,
    fontSize: size,
    color,
  }) as const;

const dashedRow = {
  border: "var(--border-pending)",
  padding: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-4)",
} as const;

function DashedRow({ label, meta }: { label: string; meta?: string }) {
  return (
    <div style={dashedRow}>
      <span style={mono(700, "var(--mono-6)", "var(--text-muted)")}>{label}</span>
      {meta && <span style={{ ...mono(500, "var(--mono-2)", "var(--text-faint)"), flex: "none" }}>{meta}</span>}
    </div>
  );
}

export function ProfileView({ player, courtName }: Props) {
  const [tab, setTab] = useState<"street" | "league">("street");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <p style={mono(500, "var(--mono-2)", "var(--text-faint)")}>
        RECORD CREATED · {player.createdAt}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "var(--portrait-col-web) 1fr",
          gap: "var(--space-12)",
          alignItems: "start",
        }}
      >
        {/* ID card */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: "var(--portrait-h-web)",
              background: "var(--surface-well)",
              filter: "grayscale(1) contrast(1.08)",
            }}
          />
          <div
            style={{
              border: "var(--border-hairline)",
              borderTop: "none",
              padding: "16px 16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: 42,
                  lineHeight: 0.95,
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                }}
              >
                {player.realName || "NEW PLAYER"}
              </h1>
              <span
                style={{
                  flex: "none",
                  marginTop: 4,
                  border: "var(--border-pending)",
                  padding: "4px 8px",
                  ...mono(700, "var(--mono-2)", "var(--text-muted)"),
                  letterSpacing: "var(--track-label)",
                }}
              >
                UNVOUCHED
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                ...mono(500, "var(--mono-4)", "var(--text-secondary)"),
              }}
            >
              <span>{player.height.value || "—"}</span>
              <span>{player.positions.length > 0 ? player.positions.join(" / ") : "—"}</span>
              <span style={{ color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                HOME: {courtName ?? "UNSET"}
              </span>
            </div>
            <p style={mono(500, "var(--mono-2)", "var(--text-faint)")}>
              {player.handle}.hoopruns.today
            </p>
          </div>
        </div>

        {/* Tabs + empty states */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", minWidth: 0 }}>
          <div style={{ display: "flex", border: "var(--border-interactive)" }}>
            {(
              [
                ["street", "[ STREET CRED ]"],
                ["league", "[ LEAGUE STATS ]"],
              ] as const
            ).map(([key, label], i) => {
              const on = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "13px 0",
                    border: "none",
                    borderLeft: i > 0 ? "var(--border-interactive)" : "none",
                    cursor: "pointer",
                    ...mono(700, "var(--mono-4)", on ? "var(--selected-ink)" : "var(--unselected-ink)"),
                    letterSpacing: "var(--track-nav)",
                    background: on ? "var(--selected-bg)" : "var(--unselected-bg)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {tab === "street" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-8)" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--display-8)",
                    lineHeight: "var(--lh-display-tight)",
                    color: "var(--text-primary)",
                  }}
                >
                  000
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", paddingBottom: 8 }}>
                  <SectionLabel>STREET SCORE</SectionLabel>
                  <span style={mono(700, "var(--mono-7)", "var(--text-primary)")}>RANK: UNRANKED</span>
                </div>
              </div>
              <div
                style={{
                  border: "var(--border-hairline)",
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ ...mono(700, "var(--mono-4)", "var(--text-primary)"), letterSpacing: "var(--track-label)" }}>
                  CRED IS EARNED ON COURT
                </span>
                <p style={{ ...mono(500, "var(--mono-5)", "var(--text-secondary)"), lineHeight: 1.6 }}>
                  CHECK IN AT A COURT. RUN. GET VOUCHED BY THE PLAYERS YOU GUARDED. BADGES UNLOCK AT
                  3 VOUCHES EACH.
                </p>
              </div>
              <div style={{ ...dashedRow, justifyContent: "center" }}>
                <span style={{ ...mono(700, "var(--mono-4)", "var(--text-muted)"), letterSpacing: "0.08em" }}>
                  NO BADGES YET
                </span>
              </div>
              <p style={mono(500, "var(--mono-2)", "var(--text-faint)")}>
                PEER-VOUCHED CAPABILITIES · 0 VOUCHES
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "var(--border-hairline)" }}>
                {["PPG", "RPG", "APG"].map((label, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "20px 0 16px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-2)",
                      borderLeft: i > 0 ? "var(--border-hairline)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--display-4)",
                        color: "var(--text-faint)",
                      }}
                    >
                      --
                    </span>
                    <SectionLabel>{label}</SectionLabel>
                  </div>
                ))}
              </div>
              <SectionLabel>ROSTERS + ACHIEVEMENTS</SectionLabel>
              <DashedRow label="NO LEAGUE TEAM LINKED" meta="LINK ONE IN SETTINGS" />
            </div>
          )}

          <SectionLabel>GAME LOG</SectionLabel>
          <DashedRow label="NO GAMES LOGGED" meta="LOG A SCORE TO OPEN YOUR RECORD" />
        </div>
      </div>
    </div>
  );
}
