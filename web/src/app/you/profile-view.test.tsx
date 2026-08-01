import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProfileView } from "@/app/you/profile-view";
import type { Player } from "@/lib/api/players";

const player: Player = {
  id: "uuid-1",
  clerkUserId: "user_2abc",
  realName: "Jordan Miller",
  handle: "jordan_miller",
  dateOfBirth: "2000-07-13",
  height: { value: `6'2"`, unit: "FT" },
  positions: ["WING", "FORWARD"],
  homeCourtId: "c1",
  createdAt: "2026-08-01T12:00:00Z",
};

describe("ProfileView", () => {
  it("renders the stamp, id card, and zeroed street cred", () => {
    render(<ProfileView player={player} courtName="PRINCE ALFRED PARK" />);

    expect(screen.getByText(/record created · 2026-08-01/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /jordan miller/i })).toBeInTheDocument();
    expect(screen.getByText("UNVOUCHED")).toBeInTheDocument();
    expect(screen.getByText("WING / FORWARD")).toBeInTheDocument();
    expect(screen.getByText(/home: prince alfred park/i)).toBeInTheDocument();
    expect(screen.getByText("jordan_miller.hoopruns.today")).toBeInTheDocument();
    expect(screen.getByText("000")).toBeInTheDocument();
    expect(screen.getByText("RANK: UNRANKED")).toBeInTheDocument();
    expect(screen.getByText("NO BADGES YET")).toBeInTheDocument();
    expect(screen.getByText("NO GAMES LOGGED")).toBeInTheDocument();
  });

  it("switches to empty league stats", async () => {
    const user = userEvent.setup();
    render(<ProfileView player={player} courtName="PRINCE ALFRED PARK" />);

    await user.click(screen.getByRole("button", { name: /league stats/i }));

    expect(screen.getAllByText("--")).toHaveLength(3);
    expect(screen.getByText("PPG")).toBeInTheDocument();
    expect(screen.getByText("NO LEAGUE TEAM LINKED")).toBeInTheDocument();
    expect(screen.queryByText("NO BADGES YET")).not.toBeInTheDocument();
  });

  it("falls back honestly for legacy records", () => {
    render(
      <ProfileView
        player={{ ...player, height: { value: "", unit: "FT" }, positions: [] }}
      />,
    );

    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/home: unset/i)).toBeInTheDocument();
  });
});
