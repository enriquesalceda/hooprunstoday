# HOOPRUNS.TODAY

Social network for basketball players — find runs, track games, create and
run leagues.

## Structure

```
backend/   Go API (Clean Architecture, TDD) — GCP Cloud Run
web/       Next.js app (App Router, TDD) — Vercel
mobile/    React Native + Expo + TypeScript — Expo EAS   (not created yet)
infra/     Terraform: Cloud Run + Neon + Vercel — see infra/README.md
design/    Design system + prototypes — the source of truth for all UI
```

Each package carries its own `CLAUDE.md` with full engineering conventions.

## Local development

```bash
docker compose up    # full stack: Postgres → migrations → API :8080 → web :3000
make test.all        # Go unit + integration tests, web tests
make db.migration name=add_thing   # scaffold a new SQL migration
```

The web app needs `web/.env.local` (copy `web/.env.example`; Clerk keys from
the dashboard). Integration tests use dedicated `hooprunstoday_test*`
databases — they never touch your local dev data.

## Environments & workflow

| Environment | API (Cloud Run)         | Web (Vercel)                    | Database (Neon) |
|-------------|-------------------------|---------------------------------|-----------------|
| staging     | `…-api-staging-…run.app`| **PR preview deployments**      | `…-staging`     |
| production  | `…-api-prod-…run.app`   | `hooprunstoday.vercel.app`      | `…-prod`        |

Work happens on branches, and **the pull request is the staging gate**:

1. Branch, commit, push, open a PR against `main`.
2. CI runs backend tests; infra changes get a `terraform plan` comment on
   the PR.
3. Vercel builds a **preview deployment** and comments the URL — previews
   are wired to the **staging API**, so the PR link is the full staging
   web app. (Direct preview URLs sit behind Vercel authentication unless
   Deployment Protection is relaxed in the project settings.)
4. Merge to `main`: the staging API deploys automatically (image build →
   terraform apply → migrations), and Vercel ships production.
5. Prod API deploys pause at a **one-click approval gate** (GitHub
   environment `prod`).

See `.github/workflows/ci.yml` for the pipeline and `infra/README.md` for
the cloud setup.
