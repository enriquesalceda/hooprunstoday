@AGENTS.md

# Web Engineering Conventions (Next.js + TypeScript)

These conventions govern all code under `web/`.

## Language & Stack

- **TypeScript, strict mode.** No `any` in committed code; prefer `unknown`
  plus narrowing at boundaries.
- **Next.js (App Router)**, deployed to Vercel. Scaffold with
  `create-next-app` (TypeScript, ESLint, `src/` directory).
- Prefer the platform (`fetch`, `URL`, `Intl`, CSS) before reaching for a
  dependency. New dependencies need explicit justification — no state
  management or data-fetching library until pain proves the need.
- Format with Prettier, lint with ESLint (`next/core-web-vitals` +
  `typescript-eslint`).

## Architecture: Clean Architecture, adapted for React

The principle is the same as the backend — dependencies point inward, the
framework lives at the edges — but the expression is React-idiomatic:
modules and hooks, not classes and constructor injection.

```
src/
  domain/        # pure TS: entities, validation, business rules.
                 # ZERO imports from react/next — same rule as Go domain/
  lib/api/       # the API client: one typed module wrapping fetch against
                 # the backend. The only place that knows endpoints.
  hooks/         # client-side use cases that need state/effects
  components/    # SHARED presentational components. Props in, JSX out.
  app/           # Next.js App Router — routes, layouts, server components,
                 # server actions. Route-specific components live here too.
```

Rules that keep it clean:

- **`domain/` is sacred.** If logic can live in a plain `.ts` file with no
  framework imports, it must. This is where testability comes from.
- **One API client.** All backend calls go through `lib/api` with typed
  request/response shapes. No ad-hoc `fetch` calls scattered around.
- **Fetch on the server by default.** Server components and server actions
  call `lib/api` directly — that is the Next.js idiom, not a violation of
  the layering. Client components get data via props or hooks.
- Colocate route-specific pieces with their route in `app/` (use private
  folders like `_components/`); promote to `src/components/` only when a
  second route needs them.
- `domain/` imports nothing from the layers above it.

## Follow Next.js Conventions — Don't Reinvent the Wheel

The App Router is the delivery layer and we take its opinions wholesale:

- **Server components by default.** Add `"use client"` only at interactive
  leaves, and push it as far down the tree as possible.
- **Use the file conventions** for cross-cutting UI states:
  `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` — not
  hand-rolled spinners and error boundaries.
- **Mutations via Server Actions** that call `lib/api`, with
  `revalidatePath`/`revalidateTag` for cache invalidation — before
  reaching for client-side mutation state.
- **Use Next.js caching** (`fetch` cache options, `revalidate`) before
  adding a client data library (React Query/SWR). Add one only when
  client-side interactivity genuinely demands it.
- **Use the built-ins:** `next/link`, `next/image`, `next/font`, the
  Metadata API. Never rebuild what the framework ships.

## Test Driven Development

Same workflow and non-negotiables as `backend/CLAUDE.md`: red, green,
refactor; no production code without a failing test; test behaviour, not
implementation; commit at green.

## Testing

### Tooling

- **Vitest** as the runner, **React Testing Library** +
  `@testing-library/user-event` for components and hooks.
- **MSW (Mock Service Worker)** to stub the network at the HTTP boundary.
  This is the frontend analog of a hand-rolled fake: the app runs its real
  code paths against a fake server.
- **Not allowed:** `vi.mock`/`jest.mock` of internal modules. If a test
  needs to mock a module you own, the design is wrong — fix the design.
  Mock only at the network edge (MSW) or via props/arguments.

### Style

- Query the DOM the way a user would: `getByRole`, `getByLabelText`,
  `getByText`. Never query by test id when an accessible query exists.
- Test names read like sentences: `it("shows an error when the run cannot
  be saved")`.
- No snapshot tests as primary assertions.
- `domain/` is tested as plain functions — push logic there so most tests
  need no rendering at all.

### Coverage Expectations

- **`domain/`: 100%.** Pure functions, no excuse for gaps.
- **Hooks:** happy path + each error branch.
- **Components:** render + user interactions that carry behaviour.
- **Server components and server actions:** async server components don't
  render well under Vitest — keep them thin (fetch via `lib/api`, map to
  props, render), extract any logic into `domain/` where it's testable,
  and cover full routes with Playwright e2e once the app earns it.

## Things to Avoid

- Logic in components or `useEffect` chains — lift it to `domain/` or hooks.
- `any`, non-null assertions (`!`), and `as` casts to silence the compiler.
- Ad-hoc `fetch` outside `lib/api`.
- Global state libraries, CSS frameworks, or component kits without
  explicit justification.
- Barrel files (`index.ts` re-export hubs) — import from the real module.

## Shared Domain with Mobile

`web/` and `mobile/` model the same domain against the same API. For now,
duplicate domain types and API-client shapes deliberately and keep them
consistent by hand. Extract a shared package only when the duplication
demonstrably hurts — not before.
