import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { createPlayer } from "@/lib/api/players";

const API_URL = "http://api.test";
const server = setupServer();

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_URL;
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const input = {
  realName: "Jordan Miller",
  handle: "jordan_miller",
  dateOfBirth: "2000-07-13",
  height: { value: `6'2"`, unit: "FT" as const },
  positions: ["WING", "FORWARD"],
  homeCourtId: "court-1",
};

describe("createPlayer", () => {
  it("sends the full record and returns the created player", async () => {
    let seenAuth = "";
    let seenBody: unknown;
    server.use(
      http.post(`${API_URL}/api/v1/players`, async ({ request }) => {
        seenAuth = request.headers.get("Authorization") ?? "";
        seenBody = await request.json();
        return HttpResponse.json(
          {
            id: "uuid-1",
            clerk_user_id: "user_2abc",
            real_name: "Jordan Miller",
            handle: "jordan_miller",
            date_of_birth: "2000-07-13",
            height: { value: `6'2"`, unit: "FT" },
            positions: ["WING", "FORWARD"],
            home_court_id: "court-1",
            created_at: "2026-08-01T12:00:00Z",
          },
          { status: 201 },
        );
      }),
    );

    const result = await createPlayer("tok_123", input);

    expect(seenAuth).toBe("Bearer tok_123");
    expect(seenBody).toEqual({
      real_name: "Jordan Miller",
      handle: "jordan_miller",
      date_of_birth: "2000-07-13",
      height: { value: `6'2"`, unit: "FT" },
      positions: ["WING", "FORWARD"],
      home_court_id: "court-1",
    });
    expect(result).toEqual({
      ok: true,
      player: {
        id: "uuid-1",
        clerkUserId: "user_2abc",
        realName: "Jordan Miller",
        handle: "jordan_miller",
        dateOfBirth: "2000-07-13",
        height: { value: `6'2"`, unit: "FT" },
        positions: ["WING", "FORWARD"],
        homeCourtId: "court-1",
        createdAt: "2026-08-01T12:00:00Z",
      },
    });
  });

  it.each([
    ["handle_taken", 409],
    ["player_exists", 409],
    ["unauthorized", 401],
    ["internal", 500],
  ] as const)("maps the %s error code", async (code, status) => {
    server.use(
      http.post(`${API_URL}/api/v1/players`, () =>
        HttpResponse.json({ error: { code, message: "nope" } }, { status }),
      ),
    );

    const result = await createPlayer("tok", input);

    expect(result).toEqual({ ok: false, code });
  });

  it("carries field details on validation failures", async () => {
    server.use(
      http.post(`${API_URL}/api/v1/players`, () =>
        HttpResponse.json(
          { error: { code: "validation_failed", message: "nope", fields: { handle: "bad" } } },
          { status: 422 },
        ),
      ),
    );

    const result = await createPlayer("tok", input);

    expect(result).toEqual({ ok: false, code: "validation_failed", fields: { handle: "bad" } });
  });

  it("reports unreachable networks as a network error", async () => {
    server.use(http.post(`${API_URL}/api/v1/players`, () => HttpResponse.error()));

    const result = await createPlayer("tok", input);

    expect(result).toEqual({ ok: false, code: "network" });
  });
});
