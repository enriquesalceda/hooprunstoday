import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RecordFormState } from "@/app/join/record/state";
import { RecordFlow } from "@/app/join/record/record-flow";
import type { Court } from "@/lib/api/courts";

const courts: Court[] = [
  { id: "c1", name: "PRINCE ALFRED PARK", courtType: "OUTDOOR" },
  { id: "c2", name: "REDFERN COMMUNITY CT", courtType: "INDOOR" },
];

const idleAction = async (): Promise<RecordFormState> => ({ status: "idle" });
const freeCheck = async () => "free" as const;

function renderFlow(overrides?: Partial<Parameters<typeof RecordFlow>[0]>) {
  return render(
    <RecordFlow
      courts={courts}
      action={idleAction}
      checkAvailability={freeCheck}
      debounceMs={0}
      {...overrides}
    />,
  );
}

async function fillEverything(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/real name/i), "Jordan Miller");
  await user.type(screen.getByLabelText(/@handle/i), "jordan_miller");
  await user.type(screen.getByLabelText(/born dd/i), "13");
  await user.type(screen.getByLabelText(/born mm/i), "07");
  await user.type(screen.getByLabelText(/born yyyy/i), "2000");
  await user.type(screen.getByLabelText(/height/i), `6'2"`);
  await user.click(screen.getByRole("button", { name: "WING" }));
  await user.click(screen.getByRole("button", { name: /home court/i }));
  await user.click(screen.getByText("PRINCE ALFRED PARK"));
}

describe("RecordFlow", () => {
  it("renders the full record screen with stubs", () => {
    renderFlow();

    expect(screen.getByRole("heading", { name: /player record/i })).toBeInTheDocument();
    expect(screen.getByText(/drop a mono portrait/i)).toBeInTheDocument();
    expect(screen.getByText(/shot in mono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/real name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/@handle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/born dd/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "POINT GUARD" })).toBeInTheDocument();
    expect(screen.getByText(/league team/i)).toBeInTheDocument();
    expect(screen.getByText(/still needed:/i)).toHaveTextContent(
      "STILL NEEDED: REAL NAME · HANDLE · DATE OF BIRTH · HEIGHT · POSITION · HOME COURT",
    );
  });

  it("slugs the handle and reports availability", async () => {
    const user = userEvent.setup();
    const check = vi.fn().mockResolvedValue("free");
    renderFlow({ checkAvailability: check });

    await user.type(screen.getByLabelText(/@handle/i), "Jordan Miller!");

    expect(screen.getByLabelText(/@handle/i)).toHaveValue("jordanmiller");
    expect(await screen.findByText(/available · jordanmiller\.hoopruns\.today/i)).toBeInTheDocument();
    expect(check).toHaveBeenLastCalledWith("jordanmiller");
  });

  it("shows TOO SHORT before three characters", async () => {
    const user = userEvent.setup();
    renderFlow();

    await user.type(screen.getByLabelText(/@handle/i), "ab");

    expect(screen.getByText(/too short · minimum 3 characters/i)).toBeInTheDocument();
  });

  it("shows TAKEN with a suggestion", async () => {
    const user = userEvent.setup();
    renderFlow({ checkAvailability: async () => "taken" as const });

    await user.type(screen.getByLabelText(/@handle/i), "jordan");

    expect(await screen.findByText(/taken · try jordan_hoops/i)).toBeInTheDocument();
  });

  it("selects a home court through the picker and returns", async () => {
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: /home court/i }));
    expect(screen.getByRole("heading", { name: /home court/i })).toBeInTheDocument();
    expect(screen.getByText(/court directory/i)).toBeInTheDocument();

    await user.click(screen.getByText("REDFERN COMMUNITY CT"));

    expect(screen.getByRole("heading", { name: /player record/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /home court/i })).toHaveTextContent(
      "REDFERN COMMUNITY CT",
    );
  });

  it("flips to READY and submits the composed record", async () => {
    const user = userEvent.setup();
    let seen: FormData | undefined;
    const action = async (_prev: RecordFormState, formData: FormData): Promise<RecordFormState> => {
      seen = formData;
      return { status: "idle" };
    };
    renderFlow({ action });

    await fillEverything(user);

    expect(screen.getByText(/ready · creates jordan_miller\.hoopruns\.today/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /create player record/i }));

    expect(seen?.get("real_name")).toBe("Jordan Miller");
    expect(seen?.get("handle")).toBe("jordan_miller");
    expect(seen?.get("dob_d")).toBe("13");
    expect(seen?.get("dob_m")).toBe("07");
    expect(seen?.get("dob_y")).toBe("2000");
    expect(seen?.get("height_value")).toBe(`6'2"`);
    expect(seen?.get("height_unit")).toBe("FT");
    expect(seen?.get("positions")).toBe(JSON.stringify(["WING"]));
    expect(seen?.get("home_court_id")).toBe("c1");
  });

  it("keeps the button gated while incomplete", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    renderFlow({ action: action as never });

    await user.click(screen.getByRole("button", { name: /create player record/i }));

    expect(action).not.toHaveBeenCalled();
  });

});
