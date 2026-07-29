# Mobile Engineering Conventions (Expo + React Native + TypeScript)

These conventions govern all code under `mobile/`. They mirror
`web/CLAUDE.md` — same architecture, same testing philosophy — with
React-Native-specific tooling.

## Language & Stack

- **TypeScript, strict mode.** No `any` in committed code.
- **Expo** with **expo-router**, shipped via EAS. Scaffold with
  `create-expo-app` (TypeScript template).
- Stay inside the Expo managed workflow; adding native modules that force a
  bare workflow needs explicit justification.
- Prefer built-ins (React Native core, Expo SDK) before third-party
  dependencies; new deps need justification.
- Format with Prettier, lint with ESLint (`eslint-config-expo` +
  `typescript-eslint`).

## Architecture: Clean Architecture, adapted for React

Same shape as `web/`: dependencies point inward, the framework lives at
the edges.

```
src/
  domain/        # pure TS: entities, validation, business rules.
                 # ZERO imports from react/react-native/expo
  lib/api/       # the API client: one typed module wrapping fetch against
                 # the backend. The only place that knows endpoints.
  hooks/         # use-case boundary: orchestrate domain + api for the UI
  components/    # presentational. Props in, JSX out. No fetching.
app/             # expo-router screens — wiring and composition only
```

- **`domain/` is sacred** — framework-free TypeScript, tested as plain
  functions. Keep it consistent with the web `domain/` (see "Shared
  Domain" in `web/CLAUDE.md`).
- **Screens are thin.** A route file composes hooks and components; it
  holds no business logic.
- **One API client** in `lib/api`; no ad-hoc `fetch` in components or
  screens.

## Follow Expo Conventions — Don't Reinvent the Wheel

Expo is the delivery layer and we take its opinions wholesale. The goal is
speed: stay on the paved road.

- **expo-router file conventions** for navigation: `_layout.tsx`, route
  groups, tabs, error boundaries. Same mental model as the Next.js App
  Router — don't hand-wire React Navigation directly.
- **`npx expo install`, never plain `npm install`,** for any dependency
  that touches native code — it resolves the version compatible with the
  current SDK.
- **Expo SDK packages first** (`expo-image`, `expo-font`,
  `expo-secure-store`, ...) before community alternatives.
- **Develop in Expo Go** until a native module forces a development build.
  Adding a dependency that breaks Expo Go compatibility needs explicit
  justification.
- **EAS owns the release pipeline:** EAS Build for store binaries and code
  signing, EAS Submit for store submission, EAS Update for over-the-air JS
  updates. Never hand-roll builds or signing.
- **Keep the SDK current.** Upgrade with `npx expo install --fix` and
  check health with `npx expo-doctor`; don't let the SDK version rot.

## Test Driven Development

Same workflow and non-negotiables as `backend/CLAUDE.md`: red, green,
refactor; no production code without a failing test; test behaviour, not
implementation; commit at green.

## Testing

### Tooling

- **Jest with the `jest-expo` preset** (Expo's supported runner) and
  **React Native Testing Library**.
- **MSW** to stub the network at the HTTP boundary — the app exercises its
  real code paths against a fake server.
- **Not allowed:** `jest.mock` of internal modules you own. Mocking is
  acceptable only for native modules that cannot run under Jest (keep such
  mocks in `jest.setup.ts`, minimal and documented) and at the network
  edge via MSW.

### Style

- Query the way a user would: `getByRole`, `getByLabelText`, `getByText`.
  Test ids only when no accessible query exists.
- Test names read like sentences:
  `it("shows an error when the run cannot be saved")`.
- No snapshot tests as primary assertions.
- Push logic into `domain/` so most tests are plain-function tests that
  never render a component.

### Coverage Expectations

- **`domain/`: 100%.**
- **Hooks:** happy path + each error branch.
- **Components/screens:** render + user interactions that carry behaviour.
- End-to-end (Maestro) only when the app is real enough to earn it.

## Things to Avoid

- Logic in components, screens, or `useEffect` chains — lift it to
  `domain/` or hooks.
- `any`, non-null assertions (`!`), and `as` casts to silence the compiler.
- Ad-hoc `fetch` outside `lib/api`.
- Global state libraries or UI kits without explicit justification.
- Drifting from web conventions without a reason — when the two disagree,
  reconcile them deliberately in both CLAUDE.md files.
