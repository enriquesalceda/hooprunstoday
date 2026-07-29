# Backend Engineering Conventions (Go)

These conventions govern all code under `backend/`.

## Language & Stack

- **Go** (idiomatic, latest stable). Prefer the standard library; reach for
  third-party deps only with justification.
- Format with `gofmt`/`goimports` (`make fmt`). Lint with `golangci-lint`
  (errcheck, govet, staticcheck, revive, gocyclo).
- The API currently deploys to Cloud Run, but the cloud provider is not a
  settled decision. Keep provider-specific code confined to
  `infrastructure/` so switching providers never touches domain, use cases,
  or adapters.

## Architecture: Clean Architecture

### Layers (dependencies point inward)

```
infrastructure/   →  adapter/  →  usecase/  →  domain/
 (DB drivers,       (HTTP         (application   (entities,
  cloud SDKs,        handlers,     business       core rules,
  config, IO)        repos)        rules)         no deps)
```

- **`domain/`** — Entities and invariants. Pure Go. Zero external
  dependencies. Business rules that are true regardless of how the app is
  delivered.
- **`usecase/`** — Application-specific business rules. Each use case
  orchestrates domain entities and infrastructure (via interfaces). This is
  where the bulk of testable logic lives.
- **`adapter/`** — Interface adapters: HTTP handlers, repository
  implementations, presenters. Translates between the outside world and use
  cases.
- **`infrastructure/`** — Concrete drivers: DB drivers (Postgres), cloud SDK
  clients, third-party API clients, config loading.

The `adapter/http` package is named `http`; import it with an alias
(`adapterhttp`) wherever `net/http` is also in scope.

### Use Case Convention

- One use case = one struct with one `Execute` method (or a single verb
  method when `Execute` is awkward).
- Each use case defines its own `Input` and `Output` structs in the same file.
- Dependencies declared as **interfaces** on the use case struct, injected
  via constructor.
- Use cases never import from `adapter/` or `infrastructure/`.

```go
type CreateRunInput struct { /* ... */ }
type CreateRunOutput struct { /* ... */ }

type RunStore interface {
    Save(ctx context.Context, r domain.Run) error
}

type CreateRun struct {
    store RunStore
    clock Clock
}

func NewCreateRun(store RunStore, clock Clock) *CreateRun {
    return &CreateRun{store: store, clock: clock}
}

func (uc *CreateRun) Execute(ctx context.Context, in CreateRunInput) (CreateRunOutput, error) {
    // ...
}
```

### Dependency Injection

- **Constructor injection only.** No service locators, no globals, no
  `init()`-based wiring, no DI frameworks (`wire`, `fx`, etc. — unless
  explicitly justified).
- Depend on **interfaces defined by the consumer** (the use case), not by
  the provider. Interfaces live next to the code that uses them.
- Wire everything at the composition root (`cmd/api/main.go`).
- Pass `context.Context` as the first argument to every method that crosses
  a boundary.

## Test Driven Development

### Workflow

1. Write a failing test that describes the desired behaviour.
2. Run it. Confirm it fails for the right reason.
3. Write the minimum production code to make it pass.
4. Refactor with tests green.
5. Commit at green.

### Non-negotiables

- **No production code without a failing test first.** If asked for a
  feature, write the test first and show it failing before writing the
  implementation.
- Tests describe **behaviour**, not implementation. Avoid asserting on
  internal state.
- One scenario per test. Use table-driven tests when scenarios share
  structure.
- If a test is hard to write, the design is wrong. Refactor the design, not
  the test.

## Testing

### Libraries

- **Allowed:** `github.com/stretchr/testify/require` and
  `github.com/stretchr/testify/assert`.
  - `require.*` for preconditions and any assertion where continuing would
    produce noise.
  - `assert.*` for independent verifications within a single test.
- **Not allowed:** `testify/mock`, `gomock`, `mockery`, `counterfeiter`, or
  any mock-generation library.

### Test Doubles — Hand-Rolled

- Write all test doubles by hand (mocks, stubs, fakes, spies).
- A test double implements the **same interface** as the real dependency.
- Keep doubles minimal: only implement methods the test actually exercises;
  stub the rest to fail loudly if called.
- Place doubles either in the same `_test.go` file when used by one test, or
  in a sibling `testdoubles/` package when shared across tests.
- Naming: prefix with `stub`, `fake`, or `spy` to communicate intent.
  Reserve `mock` for doubles that verify interaction.

```go
type spyRunStore struct {
    saved   []domain.Run
    saveErr error
}

func (s *spyRunStore) Save(_ context.Context, r domain.Run) error {
    s.saved = append(s.saved, r)
    return s.saveErr
}
```

### Test Structure

- **Setup / Exercise / Expectations / Cleanup**, marked with comments,
  inside `t.Run` blocks (see `internal/handler/health_test.go`).
- `t.Run` names read like sentences describing the scenario:
  `"health endpoint returns ok status"` — name the scenario, not the input.
- External test packages (`package foo_test`) for black-box testing.
- Use `t.Helper()` in test helpers.
- Use `t.Cleanup()` over `defer` for teardown.
- Integration tests behind `//go:build integration`
  (`make test.integration`, requires Docker).

### Coverage Expectations

- **Use cases: 100%.** That's where the business logic is — there's no
  excuse for gaps.
- **Adapters:** happy path + each error branch.
- **Infrastructure:** integration tests where practical; otherwise thin and
  obvious.

## Code Quality

### Principles

- **Readability over cleverness.** This code is read far more than it is
  written.
- **Small functions:** target < 30 lines, hard ceiling at ~60. If it's
  longer, it's doing too much.
- **Small interfaces:** 1–3 methods. "The bigger the interface, the weaker
  the abstraction." (Pike)
- **Loose coupling:** depend on interfaces, not concrete types. Interfaces
  belong to the consumer.
- **Explicit over implicit.** No reflection, no magic, no clever
  abstractions that save three lines but cost an hour to understand.
- **Errors are values.** Wrap with `fmt.Errorf("doing X: %w", err)`. Handle
  each one deliberately. Never ignore.
- **Composition over inheritance.**

### Naming

- Packages: short, lowercase, no underscores. Name by what they provide,
  not what they contain (`run`, not `runutils`).
- Interfaces: role-based nouns — `RunStore`, not `IRunStore` or
  `RunStoreInterface`.
- Test doubles: `stub*`, `fake*`, `spy*`, `mock*` prefix.
- Avoid stuttering: `run.Run` is fine; `run.RunType` is not (use `run.Type`).

### Things to Avoid

- Anemic domain models — if behaviour belongs to an entity, put it on the
  entity.
- Returning `interface{}` / `any` from public APIs when a concrete type
  would do.
- Panics in library code — return errors.
- `init()` functions for anything non-trivial.
- God files. Split when a file exceeds ~300 lines or holds unrelated
  concerns.
- New third-party dependencies without explicit justification.

## Logging

- Use the standard library structured logger (`log/slog`) with the JSON
  handler, as wired in `cmd/api/main.go`. Inject the logger via
  constructors like any other dependency; snake_case keys.
- **Never log raw payload bodies on error.** Request/response bodies can
  carry user PII — log a **structured field summary** instead: ids,
  lengths, counts, and the (payload-free) error.
- **The database is the forensic record, not the logs.** If a full payload
  is needed for debugging or replay, lean on what already retains it rather
  than duplicating it into logs.
- **Bound untrusted strings that do reach a log line.** An upstream error
  body or any externally-sourced text must be capped to a sane length so a
  pathological payload can't flood the logs.

## Database Migrations

- **goose** with plain SQL files in
  `internal/infrastructure/postgres/migrations/`, sequentially numbered.
  Create with `make db.migration name=add_runs_table`; apply locally with
  `make db.migrate`.
- Migrations are embedded in the binary (`postgres.Migrate`) — the same
  files run in integration tests, against local Docker Postgres, and in CI.
- **CI applies migrations**, not the app: a step after `terraform apply`
  in each deploy job. Never run migrations on app startup.
- **Expand/contract discipline.** Every migration must be compatible with
  the code revision currently running: add-then-migrate-then-drop, never
  break the running schema. This is what makes deploys and rollbacks boring.
- **Down migrations are local-dev convenience only.** Prod recovery is a
  new forward migration, never a rollback.
- Migrations use the **direct (unpooled)** connection string. If the app
  ever moves to Neon's pooled endpoint, migrations must keep the direct one.

## Project Layout

```
cmd/
  api/
    main.go              # composition root: wire everything here
internal/
  domain/                # entities, value objects, domain errors
  usecase/               # one package per use case or bounded use-case group
  adapter/
    http/                # HTTP handlers
    repository/          # repository implementations
  infrastructure/
    postgres/            # DB driver wiring
    config/              # config loading
```

Everything lives in `internal/`. No `pkg/` unless something is genuinely
reusable across binaries — and there is only one binary today.
