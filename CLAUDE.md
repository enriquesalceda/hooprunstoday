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

## Package Conventions

Each package carries its own CLAUDE.md with full conventions:

- `backend/CLAUDE.md` — Go, Clean Architecture layers, use case pattern,
  testing rules, logging.
- `web/CLAUDE.md` — Next.js + TypeScript, clean architecture adapted for
  React, Vitest + Testing Library + MSW.
- `mobile/CLAUDE.md` — Expo + React Native, mirrors the web conventions
  with jest-expo + React Native Testing Library.

All three share the same spine: dependencies point inward, framework at
the edges, a pure framework-free `domain/`, strict TDD, no mock libraries
for code we own.

## Commands

```bash
make test             # unit tests
make test.integration # integration tests (requires Docker)
make test.all         # all tests
make run              # run the API locally
make docker.detach    # local Postgres
make fmt              # gofmt + terraform fmt
```
