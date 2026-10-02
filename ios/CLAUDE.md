# iOS Engineering Conventions (Swift + SwiftUI)

These conventions govern all code under `ios/`.

## Language & Stack

- **Swift 6 language mode**, strict concurrency. No `!` force-unwraps or
  `try!` in production code; tests may force-unwrap fixtures.
- **SwiftUI** with the Observation framework (`@Observable`). UIKit only
  when SwiftUI genuinely can't do it.
- **iOS 26 minimum**, iPhone only, portrait, dark UI.
- Prefer the platform (`URLSession`, `Codable`, `Foundation` formatters)
  before reaching for a dependency. New dependencies need explicit
  justification. Clerk's iOS SDK (`ClerkKit`, pinned in `project.yml`) is
  the one exception, and only `App/` imports it.
- Format with `swift format` (ships with the toolchain; config in
  `.swift-format`). `make fmt` runs it.

## Project Layout

```
ios/
  project.yml            # XcodeGen spec — the source of truth. HoopRuns.xcodeproj
                         # is generated (`make ios.project`) and never committed
  Config/App.xcconfig    # API base URL + Clerk publishable key (both public)
  App/                   # thin app target: @main composition root, config,
                         # the Clerk adapter (ClerkAuthenticator), assets.
                         # Wires concrete dependencies; contains no logic
  AppTests/              # unit tests for App/ (config, Clerk adapter rules)
  UITests/               # XCUITest end-to-end smoke tests
  Packages/HoopRunsKit/  # everything else, as SPM targets
    Sources/
      Domain/            # pure Swift: entities, validation, business rules.
                         # Foundation only — never SwiftUI/UIKit
      API/               # the one HTTP client: Codable DTOs mapped to Domain.
                         # The only place that knows endpoints
      DesignSystem/      # tokens, fonts, shared chrome (header, logo, dot)
      Features/          # SwiftUI screens + @Observable view models, and the
                         # `Authenticator` port the Clerk adapter implements
```

New modules arrive with their first real type: no empty targets.

Dependencies point inward: `Features → API, DesignSystem → Domain`. Each
layer is its own SPM target, so the compiler enforces the direction: a
target can only import what `Package.swift` lists. `Domain` depends on
nothing.

Add files under `ios/App` or `ios/UITests`, or targets in `project.yml`,
then run `make ios.project`. Never edit the `.xcodeproj` by hand.

## Test Driven Development

Same workflow and non-negotiables as `backend/CLAUDE.md`: red, green,
refactor; no production code without a failing test; test behaviour, not
implementation; commit at green.

## Testing

### Tooling

- **Swift Testing** (`import Testing`, `@Test`, `#expect`) for all package
  tests. XCTest only for UI tests (`XCUIApplication`).
- **No mocking libraries.** Depend on protocols and pass hand-written fakes
  through initialisers, as the backend does.
- **Network edge:** a `URLProtocol` stub injected into a `URLSession`
  configuration, the Swift analog of MSW on web. The real API client runs
  against canned HTTP responses. Never fake the API client to test the
  API client.

### Where tests run

- `swift test` in `Packages/HoopRunsKit` runs package tests on the Mac in
  seconds. That is the TDD loop. Keep Domain, API and view-model logic
  platform-neutral so it stays testable there.
- `make test.ios` runs `swift test`, then the `HoopRuns` scheme on the
  simulator: package tests again on real iOS, the `AppTests`, and the UI
  tests. Override the device with `IOS_SIM="iPhone 17 Pro" IOS_OS=26.5`.
- Keep `App/` thin, but when it has a rule (config parsing, which Clerk
  error codes mean what), extract it as a plain function and test it in
  `AppTests`.
- UI tests launch with `-uitest-signed-out` so a session left in the
  simulator keychain can't change where the app lands.

### CI

The `iOS tests` job in `.github/workflows/ci.yml` runs on `macos-26` with a
pinned Xcode (`XCODE_APP`) whenever `ios/**`, the `Makefile` or the
workflow changes. It runs `swift format lint --strict`, then `make
test.ios`. On failure, the `.xcresult` bundle is uploaded as an artifact.
The runner's Xcode can trail the local one, so don't use language features
newer than the pinned Xcode. Bump `XCODE_APP` when the image adds a newer
one.

### Style

- Test names read like sentences: `@Test("rejects handles shorter than 3
  characters")`.
- Logic lives in `Domain` or view models, where it's tested as plain
  values. SwiftUI views stay declarative and are covered by UI tests that
  query by accessibility label, the way a user (or VoiceOver) finds them.
- No snapshot tests as primary assertions.

### Coverage expectations

- **Domain: 100%.**
- **API client:** each endpoint's success path, plus every error code it maps.
- **View models:** happy path + each error branch.
- **UI tests:** one smoke test per user flow, not per screen detail.

## Design

`design/` is the source of truth for all UI (start with
`design/system/readme.md`, then the tokens and prototypes). Its docs still
mention Expo / React Native; read that as SwiftUI. `design/` is replaced
wholesale on each handoff import, so don't edit it here.

- Tokens live in `DesignSystem` and mirror `design/system/tokens/*.css`.
  Tests pin the values, so drift shows up as a red test.
- Two families only: Anton (bundled, registered via `Fonts.register()` at
  launch) and the system monospace. No corner radius except the status
  dot, no shadows, no gradients, ALL CAPS labels.

## Auth

- Clerk email-code sign-in, mirroring the web join flow: try sign-up, and
  on `form_identifier_exists` switch to an email-code sign-in.
- `Features` only knows the `Authenticator` protocol. `App/ClerkAuthenticator`
  adapts ClerkKit to it. View models are tested with `FakeAuthenticator`;
  the adapter is thin and verified end to end.
- The API gets a fresh Clerk session JWT per request (`APIClient`'s token
  provider). Tokens live ~60s, so never cache one.
- The backend accepts tokens from the dev instance in `Config/App.xcconfig`.
  The issuer must match the backend's `CLERK_ISSUER`.
- To test sign-in manually without real email, use a `+clerk_test` address
  with code `424242` (Clerk dev instances only).

## Shared Domain with Web

`web/` and this app model the same domain against the same API. TypeScript
and Swift can't share code, so each client mirrors the API contract in
its own types by hand.

## Things to Avoid

- Logic in SwiftUI `body` or `.task` chains: lift it to `Domain` or a view
  model.
- Singletons and global mutable state. Inject dependencies from `App/`.
- Ad-hoc `URLSession` calls outside `API`.
- Committing the generated `.xcodeproj`.
