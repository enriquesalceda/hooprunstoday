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
      phone: input.phone,
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

const name = () => screen.getByLabelText(/first name/i);
const email = () => screen.getByLabelText(/email address/i);
const phone = () => screen.getByLabelText(/mobile number/i);
const country = () => screen.getByLabelText(/country dialing code/i);
const submit = () => screen.getByRole("button", { name: /get on the list/i });

describe("LeadForm", () => {
  it("submits name and email and shows the success line with the first name", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(name(), "jordan miller");
    await user.type(email(), "Jordan@Court.com");
    await user.click(submit());

    // Expectations
    expect(calls).toEqual([
      { name: "Jordan Miller", contactMethod: "EMAIL", contact: "jordan@court.com", phone: null },
    ]);
    expect(await screen.findByText(/you're on the list, jordan\./i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /get on the list/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/vip drop alerts on/i)).not.toBeInTheDocument();
  });

  it("sends the mobile in E.164 under the chosen country and confirms SMS alerts", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(name(), "Jordan");
    await user.type(email(), "jordan@court.com");
    await user.selectOptions(country(), "AU");
    await user.type(phone(), "0412 345 678");
    await user.click(submit());

    // Expectations
    expect(calls).toEqual([
      { name: "Jordan", contactMethod: "EMAIL", contact: "jordan@court.com", phone: "+61412345678" },
    ]);
    expect(await screen.findByText(/you're on the list, jordan\./i)).toBeInTheDocument();
    expect(screen.getByText(/vip drop alerts on · \+61 412 345 678/i)).toBeInTheDocument();
  });

  it("formats the mobile as it is typed", async () => {
    // Setup
    render(<LeadForm action={spyAction().action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(phone(), "4155550123");

    // Expectations
    expect(phone()).toHaveValue("(415) 555-0123");
  });

  it("flags missing fields on submit without calling the action", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.click(submit());

    // Expectations
    expect(calls).toEqual([]);
    expect(screen.getByText(/enter your first name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
  });

  it("flags a malformed email and a short mobile", async () => {
    // Setup
    const { action, calls } = spyAction();
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(name(), "Jordan");
    await user.type(email(), "not-an-email");
    await user.type(phone(), "415");
    await user.click(submit());

    // Expectations
    expect(calls).toEqual([]);
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid mobile number/i)).toBeInTheDocument();
  });

  it("clears a field's error as soon as it is edited", async () => {
    // Setup
    render(<LeadForm action={spyAction().action} />);
    const user = userEvent.setup();
    await user.click(submit());
    expect(screen.getByText(/enter your first name/i)).toBeInTheDocument();

    // Exercise
    await user.type(name(), "J");

    // Expectations
    expect(screen.queryByText(/enter your first name/i)).not.toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
  });

  it("shows an error and keeps the form when the save fails", async () => {
    // Setup
    const { action } = spyAction(() => ({ ok: false, code: "network" }));
    render(<LeadForm action={action} />);
    const user = userEvent.setup();

    // Exercise
    await user.type(name(), "Jordan");
    await user.type(email(), "jordan@court.com");
    await user.click(submit());

    // Expectations
    expect(await screen.findByText(/couldn.t send\. try again\./i)).toBeInTheDocument();
    expect(submit()).toBeEnabled();
    expect(name()).toHaveValue("Jordan");
  });

  it("pretends to succeed for bots that fill the hidden field", async () => {
    // Setup
    const { action, calls } = spyAction();
    const { container } = render(<LeadForm action={action} />);
    const user = userEvent.setup();
    const honeypot = container.querySelector('input[name="company"]');
    if (!(honeypot instanceof HTMLInputElement)) throw new Error("honeypot missing");

    // Exercise
    await user.type(honeypot, "Acme");
    await user.click(submit());

    // Expectations
    expect(calls).toEqual([]);
    expect(await screen.findByText(/you're on the list\./i)).toBeInTheDocument();
  });
});
