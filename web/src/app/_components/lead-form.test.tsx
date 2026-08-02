import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LeadForm } from "@/app/_components/lead-form";
import type { CreateLeadInput, CreateLeadResult } from "@/lib/api/leads";

function okResult(input: CreateLeadInput): CreateLeadResult {
  return {
    ok: true,
    lead: {
      id: "uuid-1",
      name: input.name,
      contactMethod: input.contactMethod,
      contact: input.contact,
      createdAt: "2026-08-02T12:00:00Z",
    },
  };
}

function spyAction(result?: (input: CreateLeadInput) => CreateLeadResult) {
  const calls: CreateLeadInput[] = [];
  const action = async (input: CreateLeadInput): Promise<CreateLeadResult> => {
    calls.push(input);
    return (result ?? okResult)(input);
  };
  return { action, calls };
}

describe("LeadForm", () => {
  it("submits an email lead and shows the success panel with the first name", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(screen.getByLabelText(/first name/i), "Jordan Miller");
    await user.type(screen.getByLabelText(/how we reach you/i), "jordan@court.com");
    await user.click(screen.getByRole("button", { name: /put me on the list/i }));

    // Expectations
    expect(calls).toEqual([
      { name: "Jordan Miller", contactMethod: "EMAIL", contact: "jordan@court.com" },
    ]);
    expect(await screen.findByText(/the list, jordan\./i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /put me on the list/i })).not.toBeInTheDocument();
  });

  it("switches to mobile and submits the number", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.click(screen.getByRole("button", { name: "MOBILE" }));
    await user.type(screen.getByLabelText(/first name/i), "Jordan");
    await user.type(screen.getByLabelText(/how we reach you/i), "0412345678");
    await user.click(screen.getByRole("button", { name: /put me on the list/i }));

    // Expectations
    expect(calls).toEqual([
      { name: "Jordan", contactMethod: "MOBILE", contact: "0412345678" },
    ]);
    expect(await screen.findByText(/the list, jordan\./i)).toBeInTheDocument();
  });

  it("switching methods clears the contact already typed", async () => {
    // Setup
    render(<LeadForm action={spyAction().action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(screen.getByLabelText(/how we reach you/i), "jordan@court.com");
    await user.click(screen.getByRole("button", { name: "MOBILE" }));

    // Expectations
    expect(screen.getByLabelText(/how we reach you/i)).toHaveValue("");
  });

  it("keeps the button disabled until the draft is valid", async () => {
    // Setup
    render(<LeadForm action={spyAction().action} />);
    const user = userEvent.setup();
    const submit = () => screen.getByRole("button", { name: /put me on the list/i });

    // Exercise / Expectations
    expect(submit()).toBeDisabled();

    await user.type(screen.getByLabelText(/first name/i), "Jordan");
    expect(submit()).toBeDisabled();

    await user.type(screen.getByLabelText(/how we reach you/i), "not-an-email");
    expect(submit()).toBeDisabled();

    await user.clear(screen.getByLabelText(/how we reach you/i));
    await user.type(screen.getByLabelText(/how we reach you/i), "jordan@court.com");
    expect(submit()).toBeEnabled();
  });

  it("shows an error and keeps the form when the save fails", async () => {
    // Setup
    const { action } = spyAction(() => ({ ok: false, code: "network" }));
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(screen.getByLabelText(/first name/i), "Jordan");
    await user.type(screen.getByLabelText(/how we reach you/i), "jordan@court.com");
    await user.click(screen.getByRole("button", { name: /put me on the list/i }));

    // Expectations
    expect(await screen.findByText(/couldn't reach the server/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /put me on the list/i })).toBeEnabled();
    expect(screen.getByLabelText(/first name/i)).toHaveValue("Jordan");
  });
});
