"use client";

import { BackLink } from "@/components/core/back-link";
import { SectionLabel } from "@/components/core/section-label";
import { CodeInput, type CodeInputState } from "@/components/forms/code-input";
import { SplitSlate } from "@/app/join/_components/split-slate";

export type CodeHint = { text: string; ink: string };

type Props = {
  emailMasked: string;
  code: string;
  onCodeChange: (code: string) => void;
  state: CodeInputState;
  hint: CodeHint;
  resendIn: number; // seconds; 0 = ready
  onResend: () => void;
  onBack: () => void;
};

export function CodeStep({
  emailMasked,
  code,
  onCodeChange,
  state,
  hint,
  resendIn,
  onResend,
  onBack,
}: Props) {
  const resendReady = resendIn === 0;

  return (
    <SplitSlate
      statement={["ENTER", "CODE"]}
      caption={`SENT TO ${emailMasked} · EXPIRES IN 10:00`}
    >
      <BackLink label="EMAIL" onClick={onBack} />
      <SectionLabel>SIX DIGITS</SectionLabel>
      <CodeInput value={code} onChange={onCodeChange} state={state} />
      <p
        role={state === "error" || state === "locked" ? "alert" : undefined}
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-3)",
          letterSpacing: "var(--track-label)",
          color: hint.ink,
        }}
      >
        {hint.text}
      </p>
      <button
        type="button"
        onClick={resendReady ? onResend : undefined}
        style={{
          background: "none",
          border: "none",
          alignSelf: "flex-start",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-4)",
          color: resendReady ? "var(--text-primary)" : "var(--text-faint)",
          cursor: resendReady ? "pointer" : "default",
        }}
      >
        {resendReady ? "RESEND CODE" : `RESEND CODE IN 0:${String(resendIn).padStart(2, "0")}`}
      </button>
    </SplitSlate>
  );
}
