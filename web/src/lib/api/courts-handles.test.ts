import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { getCourts } from "@/lib/api/courts";
import { checkHandle } from "@/lib/api/handles";

const API_URL = "http://api.test";
const server = setupServer();

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_URL;
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("getCourts", () => {
  it("returns the mapped directory", async () => {
    server.use(
      http.get(`${API_URL}/api/v1/courts`, () =>
        HttpResponse.json({
          courts: [{ id: "c1", name: "PRINCE ALFRED PARK", court_type: "OUTDOOR" }],
        }),
      ),
    );

    const result = await getCourts();

    expect(result).toEqual({
      ok: true,
      courts: [{ id: "c1", name: "PRINCE ALFRED PARK", courtType: "OUTDOOR" }],
    });
  });

  it("reports failures", async () => {
    server.use(http.get(`${API_URL}/api/v1/courts`, () => HttpResponse.error()));

    expect(await getCourts()).toEqual({ ok: false });
  });
});

describe("checkHandle", () => {
  it("sends the token and reports availability", async () => {
    let seenAuth = "";
    server.use(
      http.get(`${API_URL}/api/v1/handles/jordan_miller`, ({ request }) => {
        seenAuth = request.headers.get("Authorization") ?? "";
        return HttpResponse.json({ handle: "jordan_miller", available: false });
      }),
    );

    const result = await checkHandle("tok_1", "jordan_miller");

    expect(seenAuth).toBe("Bearer tok_1");
    expect(result).toEqual({ ok: true, available: false });
  });

  it("maps 422 to invalid", async () => {
    server.use(
      http.get(`${API_URL}/api/v1/handles/x`, () =>
        HttpResponse.json({ error: { code: "validation_failed" } }, { status: 422 }),
      ),
    );

    expect(await checkHandle("tok", "x")).toEqual({ ok: false, code: "invalid" });
  });

  it("maps failures to error", async () => {
    server.use(http.get(`${API_URL}/api/v1/handles/jordan_miller`, () => HttpResponse.error()));

    expect(await checkHandle("tok", "jordan_miller")).toEqual({ ok: false, code: "error" });
  });
});
