import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { CodeInput } from "@/components/forms/code-input";

function Harness({ state = "default" as const }) {
  const [value, setValue] = useState("");
  return <CodeInput value={value} onChange={setValue} state={state} />;
}

describe("CodeInput", () => {
  it("accepts pasted codes and strips non-digits", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByLabelText(/verification code/i);
    await user.click(input);
    await user.paste("42-42-42");

    expect(input).toHaveValue("424242");
  });

  it("caps input at six digits", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByLabelText(/verification code/i);
    await user.type(input, "1234567890");

    expect(input).toHaveValue("123456");
  });

  it("disables input when locked", () => {
    render(<CodeInput value="" onChange={() => {}} state="locked" />);

    expect(screen.getByLabelText(/verification code/i)).toBeDisabled();
  });
});
