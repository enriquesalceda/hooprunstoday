import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CodeStep } from "@/app/join/_components/code-step";
import { IdentityStep } from "@/app/join/_components/identity-step";

const noop = () => {};

describe("IdentityStep", () => {
  it("renders the slate copy and gates the button until ready", async () => {
    const user = userEvent.setup();
    const onTransmit = vi.fn();
    render(
      <IdentityStep
        email=""
        onEmailChange={noop}
        ready={false}
        sending={false}
        onTransmit={onTransmit}
      />,
    );

    expect(screen.getByRole("heading", { name: /identity\s*check/i })).toBeInTheDocument();
    expect(screen.getByText(/your email never appears on your profile/i)).toBeInTheDocument();
    expect(screen.getByText(/existing player\? same email, same record/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /transmit code/i }));
    expect(onTransmit).not.toHaveBeenCalled();
  });

  it("transmits when ready", async () => {
    const user = userEvent.setup();
    const onTransmit = vi.fn();
    render(
      <IdentityStep
        email="j@court.com"
        onEmailChange={noop}
        ready={true}
        sending={false}
        onTransmit={onTransmit}
      />,
    );

    expect(screen.getByText(/ready · one-time code/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /transmit code/i }));
    expect(onTransmit).toHaveBeenCalledOnce();
  });
});

describe("CodeStep", () => {
  const base = {
    emailMasked: "j•••••@court.com",
    code: "",
    onCodeChange: noop,
    state: "default" as const,
    hint: { text: "6 DIGITS · PASTE OR TYPE", ink: "var(--text-faint)" },
    resendIn: 20,
    onResend: noop,
    onBack: noop,
  };

  it("shows the masked address and countdown", () => {
    render(<CodeStep {...base} />);

    expect(screen.getByText(/sent to j•••••@court\.com · expires in 10:00/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend code in 0:20/i })).toBeInTheDocument();
  });

  it("resend fires only when the countdown hits zero", async () => {
    const user = userEvent.setup();
    const onResend = vi.fn();
    const { rerender } = render(<CodeStep {...base} onResend={onResend} />);

    await user.click(screen.getByRole("button", { name: /resend code in/i }));
    expect(onResend).not.toHaveBeenCalled();

    rerender(<CodeStep {...base} onResend={onResend} resendIn={0} />);
    await user.click(screen.getByRole("button", { name: /^resend code$/i }));
    expect(onResend).toHaveBeenCalledOnce();
  });

  it("announces rejection hints", () => {
    render(
      <CodeStep
        {...base}
        state="error"
        hint={{ text: "CODE REJECTED · 2 ATTEMPTS LEFT", ink: "var(--text-muted)" }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/code rejected · 2 attempts left/i);
  });

  it("returns to the email step", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<CodeStep {...base} onBack={onBack} />);

    await user.click(screen.getByRole("button", { name: /email/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
