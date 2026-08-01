import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { getMe } from "@/lib/api/me";

const API_URL = "http://api.test";
const server = setupServer();

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_URL;
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getMe", () => {
  it("returns the caller's mapped record", async () => {
    server.use(
      http.get(`${API_URL}/api/v1/players/me`, ({ request }) => {
        if (request.headers.get("Authorization") !== "Bearer tok_1") {
          return HttpResponse.json({}, { status: 401 });
        }
        return HttpResponse.json({
          id: "uuid-1",
          clerk_user_id: "user_2abc",
          real_name: "Jordan Miller",
          handle: "jordan_miller",
          date_of_birth: "2000-07-13",
          height: { value: `6'2"`, unit: "FT" },
          positions: ["WING"],
          home_court_id: "c1",
          created_at: "2026-08-01T12:00:00Z",
        });
      }),
    );

    const result = await getMe("tok_1");

    expect(result).toEqual({
      ok: true,
      player: {
        id: "uuid-1",
        clerkUserId: "user_2abc",
        realName: "Jordan Miller",
        handle: "jordan_miller",
        dateOfBirth: "2000-07-13",
        height: { value: `6'2"`, unit: "FT" },
        positions: ["WING"],
        homeCourtId: "c1",
        createdAt: "2026-08-01T12:00:00Z",
      },
    });
  });

  it("maps 404 to not_found", async () => {
    server.use(
      http.get(`${API_URL}/api/v1/players/me`, () =>
        HttpResponse.json({ error: { code: "player_not_found" } }, { status: 404 }),
      ),
    );

    expect(await getMe("tok")).toEqual({ ok: false, code: "not_found" });
  });

  it("maps network failures to error", async () => {
    server.use(http.get(`${API_URL}/api/v1/players/me`, () => HttpResponse.error()));

    expect(await getMe("tok")).toEqual({ ok: false, code: "error" });
  });
});
