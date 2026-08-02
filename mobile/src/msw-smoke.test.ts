// Toolchain guard: proves MSW can stub the network edge under jest-expo
// (see jest.config.js for the transform/resolution accommodations).
// Delete once real lib/api tests exercise MSW.
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("msw", () => {
  it("intercepts fetch at the network edge", async () => {
    server.use(
      http.get("http://api.test/api/v1/ping", () =>
        HttpResponse.json({ ok: true }),
      ),
    );

    const res = await fetch("http://api.test/api/v1/ping");

    expect(await res.json()).toEqual({ ok: true });
  });
});
