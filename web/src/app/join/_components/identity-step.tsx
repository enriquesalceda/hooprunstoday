"use client";

import { Button } from "@/components/core/button";
import { SectionLabel } from "@/components/core/section-label";
import { EmailField } from "@/components/forms/email-field";
import { SplitSlate } from "@/app/join/_components/split-slate";

type Props = {
  email: string;
  onEmailChange: (email: string) => void;
  ready: boolean; // gates the button only — typing is never blocked
  sending: boolean;
  error?: string;
  onTransmit: () => void;
};

export function IdentityStep({ email, onEmailChange, ready, sending, error, onTransmit }: Props) {
  const hint = error ?? (ready ? "READY · ONE-TIME CODE, NO PASSWORD TO FORGET" : "YOUR EMAIL NEVER APPEARS ON YOUR PROFILE.");

  return (
    <SplitSlate statement={["IDENTITY", "CHECK"]} caption="ONE ADDRESS, ONE PLAYER · NO PASSWORD TO FORGET">
      <SectionLabel>EMAIL VERIFICATION</SectionLabel>
      <EmailField value={email} onChange={onEmailChange} />
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "var(--mono-2)",
          color: error ? "var(--text-muted)" : "var(--text-faint)",
          lineHeight: 1.6,
        }}
      >
        {hint}
      </p>
      <Button
        disabled={!ready || sending}
        onClick={onTransmit}
        style={{ marginTop: "var(--space-3)" }}
      >
        {sending ? "TRANSMITTING…" : "TRANSMIT CODE"}
      </Button>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "var(--mono-2)",
          color: "var(--text-faint)",
        }}
      >
        EXISTING PLAYER? SAME EMAIL, SAME RECORD.
      </p>
      {/* Clerk bot-protection mount point for custom flows */}
      <div id="clerk-captcha" />
    </SplitSlate>
  );
}
