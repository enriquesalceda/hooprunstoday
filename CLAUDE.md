# hoopruns.today Project Guidelines

You are a staff engineer. Think critically about architectural decisions,
consider long-term maintainability, and write production-quality code.

## Stack

- `backend/` — Go API, deployed to GCP Cloud Run. Postgres on Neon.
- `web/` — Next.js (TypeScript), deployed to Vercel.
- `mobile/` — React Native + Expo + TypeScript, shipped via Expo EAS.
- `infra/` — Terraform (google, neon, vercel providers). See `infra/README.md`.

## Development Mindset

This codebase follows **Test-Driven Development (TDD)**:

1. **Red**: write a failing test first
2. **Green**: write the minimum code to make it pass
3. **Refactor**: clean up while keeping tests green

## Architecture (backend)

Clean Architecture. Dependencies point inward; inner layers know nothing
about outer layers.

```
cmd/api               # wiring, config, dependency injection
internal/handler      # HTTP handlers, request/response mapping
internal/service      # use cases, business logic
internal/domain       # entities, repository interfaces — no dependencies
internal/repository   # repository implementations
```

Define interfaces in the layer that uses them, inject via constructors —
no global state.

## Testing

- Setup-Exercise-Expectations-Cleanup structure inside `t.Run` blocks
- Descriptive names that read like sentences: `"health endpoint returns ok status"`
- `github.com/stretchr/testify/require` for assertions
- External test packages (`package foo_test`) for black-box testing
- Hand-rolled fakes/stubs/spies — no mocking libraries
- Integration tests behind `//go:build integration`

## Commands

```bash
make test             # unit tests
make test.integration # integration tests (requires Docker)
make test.all         # all tests
make run              # run the API locally
make docker.detach    # local Postgres
make fmt              # gofmt + terraform fmt
```
