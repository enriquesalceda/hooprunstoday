import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { createLead } from "@/lib/api/leads";

const API_URL = "http://api.test";
const server = setupServer();

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_URL;
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const input = {
  name: "Jordan",
  contactMethod: "EMAIL" as const,
  contact: "jordan@example.com",
};

describe("createLead", () => {
  it("sends the lead and returns the stored record", async () => {
    let seenBody: unknown;
    server.use(
      http.post(`${API_URL}/api/v1/leads`, async ({ request }) => {
        seenBody = await request.json();
        return HttpResponse.json(
          {
            id: "uuid-1",
            name: "Jordan",
            contact_method: "EMAIL",
            contact: "jordan@example.com",
            created_at: "2026-08-02T12:00:00Z",
          },
          { status: 201 },
        );
      }),
    );

    const result = await createLead(input);

    expect(seenBody).toEqual({
      name: "Jordan",
      contact_method: "EMAIL",
      contact: "jordan@example.com",
    });
    expect(result).toEqual({
      ok: true,
      lead: {
        id: "uuid-1",
        name: "Jordan",
        contactMethod: "EMAIL",
        contact: "jordan@example.com",
        createdAt: "2026-08-02T12:00:00Z",
      },
    });
  });

  it("carries field details on validation failures", async () => {
    server.use(
      http.post(`${API_URL}/api/v1/leads`, () =>
        HttpResponse.json(
          {
            error: {
              code: "validation_failed",
              message: "nope",
              fields: { contact: "bad" },
            },
          },
          { status: 422 },
        ),
      ),
    );

    const result = await createLead(input);

    expect(result).toEqual({ ok: false, code: "validation_failed", fields: { contact: "bad" } });
  });

  it("maps the internal error code", async () => {
    server.use(
      http.post(`${API_URL}/api/v1/leads`, () =>
        HttpResponse.json({ error: { code: "internal", message: "nope" } }, { status: 500 }),
      ),
    );

    const result = await createLead(input);

    expect(result).toEqual({ ok: false, code: "internal" });
  });

  it("reports unreachable networks as a network error", async () => {
    server.use(http.post(`${API_URL}/api/v1/leads`, () => HttpResponse.error()));

    const result = await createLead(input);

    expect(result).toEqual({ ok: false, code: "network" });
  });
});
