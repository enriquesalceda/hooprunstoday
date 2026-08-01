import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GeofencePanel } from "@/app/join/geofence/geofence-panel";

describe("GeofencePanel", () => {
  it("states the contract before asking for anything", () => {
    render(<GeofencePanel asking={false} onGrant={() => {}} onSkip={() => {}} />);

    expect(screen.getByRole("heading", { name: /geofence\s*access/i })).toBeInTheDocument();
    expect(screen.getByText(/verified by proximity, not by trust/i)).toBeInTheDocument();
    expect(screen.getByText("COURT CHECK-IN")).toBeInTheDocument();
    expect(screen.getByText("REQUIRES PROXIMITY MATCH")).toBeInTheDocument();
    expect(screen.getByText("BACKGROUND TRACKING")).toBeInTheDocument();
    expect(screen.getByText("NEVER")).toBeInTheDocument();
    expect(screen.getByText(/location is read only while the tab is open/i)).toBeInTheDocument();
  });

  it("grants and skips", async () => {
    const user = userEvent.setup();
    const onGrant = vi.fn();
    const onSkip = vi.fn();
    render(<GeofencePanel asking={false} onGrant={onGrant} onSkip={onSkip} />);

    await user.click(screen.getByRole("button", { name: /grant location access/i }));
    expect(onGrant).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /skip — browse only/i }));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it("locks the grant button while asking", () => {
    render(<GeofencePanel asking={true} onGrant={() => {}} onSkip={() => {}} />);

    expect(screen.getByRole("button", { name: /requesting…/i })).toBeDisabled();
  });
});
