"use client";

import { useActionState } from "react";

import type { RecordFormState } from "@/app/join/record/state";
import { Button } from "@/components/core/button";
import { SectionLabel } from "@/components/core/section-label";
import { FieldRow } from "@/components/forms/field-row";

type Props = {
  action: (prev: RecordFormState, formData: FormData) => Promise<RecordFormState>;
};

const hintStyle = {
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  fontSize: "var(--mono-2)",
  color: "var(--text-faint)",
  lineHeight: 1.6,
} as const;

export function RecordForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });

  if (state.status === "created") {
    return (
      <section aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <p style={hintStyle}>RECORD CREATED · {state.createdAt}</p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--display-5)",
            lineHeight: 0.95,
            color: "var(--text-primary)",
          }}
        >
          @{state.handle}
        </h1>
        <p style={hintStyle}>{state.handle}.hoopruns.today</p>
      </section>
    );
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "var(--display-5)",
          lineHeight: 0.95,
          color: "var(--text-primary)",
        }}
      >
        PLAYER RECORD
      </h1>
      <SectionLabel style={{ paddingBottom: "var(--space-5)" }}>
        WRITES TO YOUR PUBLIC PROFILE
      </SectionLabel>

      {state.status === "error" && (
        <p role="alert" style={{ ...hintStyle, color: "var(--text-muted)", fontWeight: 700 }}>
          {state.message.toUpperCase()}
        </p>
      )}

      <FieldRow
        label="REAL NAME"
        id="real_name"
        name="real_name"
        placeholder="JORDAN MILLER"
        autoComplete="name"
        required
        uppercase
      />
      {state.status === "error" && state.fields?.real_name && (
        <p style={{ ...hintStyle, color: "var(--text-muted)" }}>{state.fields.real_name.toUpperCase()}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <FieldRow
          label="@HANDLE"
          id="handle"
          name="handle"
          placeholder="jordan_miller"
          autoComplete="username"
          required
        />
        <p
          style={{
            ...hintStyle,
            fontWeight: 700,
            color:
              state.status === "error" && state.fields?.handle
                ? "var(--text-muted)"
                : "var(--text-faint)",
          }}
        >
          {state.status === "error" && state.fields?.handle
            ? state.fields.handle.toUpperCase()
            : "3–20 CHARACTERS · LOWERCASE, NUMBERS, UNDERSCORE"}
        </p>
      </div>

      <Button type="submit" disabled={pending} style={{ marginTop: "var(--space-5)" }}>
        {pending ? "CREATING…" : "CREATE PLAYER RECORD"}
      </Button>
    </form>
  );
}
