"use client";

import { useActionState } from "react";

import type { RecordFormState } from "@/app/join/record/state";

type Props = {
  action: (prev: RecordFormState, formData: FormData) => Promise<RecordFormState>;
};

export function RecordForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });

  if (state.status === "created") {
    return (
      <section aria-live="polite">
        <h1>RECORD CREATED</h1>
        <p>
          @{state.handle} · {state.createdAt}
        </p>
      </section>
    );
  }

  return (
    <form action={formAction}>
      <h1>Create your player record</h1>

      {state.status === "error" && <p role="alert">{state.message}</p>}

      <div>
        <label htmlFor="real_name">Real name</label>
        <input id="real_name" name="real_name" autoComplete="name" required />
        {state.status === "error" && state.fields?.real_name && <p>{state.fields.real_name}</p>}
      </div>

      <div>
        <label htmlFor="handle">Handle</label>
        <input id="handle" name="handle" autoComplete="username" required />
        {state.status === "error" && state.fields?.handle && <p>{state.fields.handle}</p>}
      </div>

      <button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create player record"}
      </button>
    </form>
  );
}
