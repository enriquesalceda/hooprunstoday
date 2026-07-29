import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RecordForm } from "@/app/signup/record/record-form";
import type { RecordFormState } from "@/app/signup/record/state";

function actionReturning(state: RecordFormState) {
  return async () => state;
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/real name/i), "Jordan Miller");
  await user.type(screen.getByLabelText(/handle/i), "jordan_miller");
  await user.click(screen.getByRole("button", { name: /create player record/i }));
}

describe("RecordForm", () => {
  it("renders the identity fields", () => {
    render(<RecordForm action={actionReturning({ status: "idle" })} />);

    expect(screen.getByLabelText(/real name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/handle/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create player record/i })).toBeInTheDocument();
  });

  it("passes the typed values to the action", async () => {
    const user = userEvent.setup();
    let seen: FormData | undefined;
    const action = async (_prev: RecordFormState, formData: FormData): Promise<RecordFormState> => {
      seen = formData;
      return { status: "idle" };
    };
    render(<RecordForm action={action} />);

    await user.type(screen.getByLabelText(/real name/i), "Jordan Miller");
    await user.type(screen.getByLabelText(/handle/i), "jordan_miller");
    await user.click(screen.getByRole("button", { name: /create player record/i }));

    expect(seen?.get("real_name")).toBe("Jordan Miller");
    expect(seen?.get("handle")).toBe("jordan_miller");
  });

  it("shows an error message and field details", async () => {
    const user = userEvent.setup();
    render(
      <RecordForm
        action={actionReturning({
          status: "error",
          message: "Some fields are invalid.",
          fields: { handle: "Handles are 3–20 characters: a–z, 0–9, underscore." },
        })}
      />,
    );

    await fillAndSubmit(user);

    expect(await screen.findByText(/some fields are invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/3–20 characters/i)).toBeInTheDocument();
  });

  it("shows the created record on success", async () => {
    const user = userEvent.setup();
    render(
      <RecordForm
        action={actionReturning({
          status: "created",
          handle: "jordan_miller",
          createdAt: "2026-07-29T12:00:00Z",
        })}
      />,
    );

    await fillAndSubmit(user);

    expect(await screen.findByText(/record created/i)).toBeInTheDocument();
    expect(screen.getByText(/@jordan_miller/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /create player record/i })).not.toBeInTheDocument();
  });
});
