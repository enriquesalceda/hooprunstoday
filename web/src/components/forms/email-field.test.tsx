import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { EmailField, maskEmail } from "@/components/forms/email-field";

function Harness() {
  const [value, setValue] = useState("");
  return <EmailField value={value} onChange={setValue} />;
}

describe("maskEmail", () => {
  it("keeps the first character and the whole domain", () => {
    expect(maskEmail("enrique@gmail.com")).toBe("e•••••@gmail.com");
    expect(maskEmail("jordan.miller@court.example")).toBe("j•••••@court.example");
  });

  it("falls back when there is no usable address", () => {
    expect(maskEmail("")).toBe("•••@•••");
    expect(maskEmail("@gmail.com")).toBe("•••@•••");
  });
});

describe("EmailField", () => {
  it("strips whitespace as the user types", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByRole("textbox", { name: /email/i }), "a b@c.co ");

    expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("ab@c.co");
  });
});
