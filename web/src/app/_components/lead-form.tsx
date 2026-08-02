"use client";

import { useId, useState } from "react";

import { Button } from "@/components/core/button";
import { canSubmitLead, firstName, type ContactMethod } from "@/domain/lead";
import type { CreateLeadInput, CreateLeadResult } from "@/lib/api/leads";

type Props = {
  action: (input: CreateLeadInput) => Promise<CreateLeadResult>;
};

const errorCopy: Record<string, string> = {
  network: "COULDN'T REACH THE SERVER — TRY AGAIN.",
  validation_failed: "CHECK YOUR DETAILS AND TRY AGAIN.",
};

const inputStyle = {
  width: "100%",
  height: 56,
  background: "transparent",
  border: "var(--border-interactive)",
  color: "var(--text-primary)",
  caretColor: "var(--text-primary)",
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  fontSize: 15,
  letterSpacing: "0.04em",
  padding: "0 16px",
} as const;

const fieldLabelStyle = {
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  fontSize: "var(--mono-2)",
  letterSpacing: "var(--track-nav)",
  color: "var(--text-muted)",
  textTransform: "uppercase",
} as const;

/* The waitlist form. One name, one way to reach you, nothing else.
   Ported from the landing bundle; validation gates the button only. */
export function LeadForm({ action }: Props) {
  const nameId = useId();
  const contactId = useId();
  const [method, setMethod] = useState<ContactMethod>("EMAIL");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo !== null) {
    return (
      <div style={{ marginTop: "clamp(32px, 5vw, 48px)", border: "var(--border-inverted)", padding: "clamp(28px, 4vw, 44px)" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: "var(--lh-display)",
          }}
        >
          YOU&apos;RE ON
          <br />
          THE LIST{sentTo === "" ? "." : `, ${sentTo}.`}
        </div>
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "var(--border-hairline)",
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            fontSize: "var(--mono-6)",
            letterSpacing: "var(--track-nav)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          WE&apos;LL REACH OUT THE DAY YOUR CITY GOES LIVE.
          <br />
          UNTIL THEN — GO GET A RUN IN.
        </div>
      </div>
    );
  }

  const switchTo = (next: ContactMethod) => {
    if (next === method) return;
    setMethod(next);
    setContact("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await action({ name, contactMethod: method, contact });
    setSubmitting(false);
    if (result.ok) {
      setSentTo(firstName(name));
      return;
    }
    setError(errorCopy[result.code] ?? "SOMETHING WENT WRONG — TRY AGAIN.");
  };

  return (
    <form
      onSubmit={submit}
      style={{ marginTop: "clamp(32px, 5vw, 48px)", display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label htmlFor={nameId} style={fieldLabelStyle}>
          FIRST NAME
        </label>
        <input
          id={nameId}
          type="text"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <label htmlFor={contactId} style={fieldLabelStyle}>
            HOW WE REACH YOU
          </label>
          <div style={{ display: "flex", border: "var(--border-interactive)" }}>
            {(["EMAIL", "MOBILE"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchTo(m)}
                aria-pressed={method === m}
                style={{
                  background: method === m ? "var(--selected-bg)" : "var(--unselected-bg)",
                  color: method === m ? "var(--selected-ink)" : "var(--unselected-ink)",
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "var(--mono-4)",
                  letterSpacing: "var(--track-action)",
                  padding: "9px 16px",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <input
          id={contactId}
          type={method === "EMAIL" ? "email" : "tel"}
          inputMode={method === "EMAIL" ? "email" : "tel"}
          autoComplete={method === "EMAIL" ? "email" : "tel"}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={inputStyle}
        />
      </div>

      {error !== null && (
        <div role="alert" style={{ ...fieldLabelStyle, color: "var(--text-secondary)" }}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting || !canSubmitLead({ name, method, contact })}
        style={{ height: 56 }}
      >
        {submitting ? "SENDING…" : "PUT ME ON THE LIST"}
      </Button>

      <div
        style={{
          ...fieldLabelStyle,
          color: "var(--text-faint)",
          lineHeight: 1.7,
        }}
      >
        ONE MESSAGE WHEN WE OPEN YOUR CITY. NOTHING ELSE.
        <br />
        YOUR DETAILS NEVER APPEAR ON A PROFILE.
      </div>
    </form>
  );
}
