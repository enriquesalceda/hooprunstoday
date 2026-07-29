# HOOPRUNS.TODAY

Social network for basketball players — find runs, track games, create and
run leagues.

## Structure

```
backend/   Go API (Clean Architecture, TDD) — deployed to GCP Cloud Run
web/       Next.js app — deployed to Vercel            (not created yet)
mobile/    React Native + Expo + TypeScript — Expo EAS  (not created yet)
infra/     Terraform: Cloud Run + Neon + Vercel — see infra/README.md
design/    Design handoff package
```

## Development

```bash
make docker.detach   # local Postgres
make run             # start the API on :8080
make test            # unit tests
```

CI/CD: PRs run tests + terraform plan; merging to `main` deploys staging;
prod deploys behind a one-click approval. See `.github/workflows/ci.yml`.
