# Infrastructure

| Piece | Where | Managed by |
|---|---|---|
| Go API | GCP Cloud Run (`us-central1`) | Terraform (this tree) |
| Postgres | Neon (`aws-us-east-2`) | Terraform (this tree) |
| Next.js web | Vercel | Terraform project + Vercel's own git-driven deploys |
| Mobile | Expo EAS | EAS CLI / CI — no Terraform |
| Terraform state | GCS bucket, workspace per environment (`staging`, `prod`) | `bootstrap/` |
| CI auth to GCP | Workload Identity Federation (OIDC) — no stored keys | `bootstrap/` |

## One-time setup

1. **Create the GCP project** (console or `gcloud projects create hooprunstoday`)
   and link billing. If the project id differs, update `envs/*.tfvars` and
   `backend.tf`.

2. **Bootstrap** (state bucket + OIDC + deployer service account):

   ```bash
   gcloud auth application-default login
   cd infra/bootstrap
   terraform init
   terraform apply -var project_id=hooprunstoday
   ```

3. **Configure the GitHub repo** (`gh` or Settings → Secrets and variables → Actions):

   - Variables: `GCP_PROJECT_ID`, plus `GCP_WORKLOAD_IDENTITY_PROVIDER` and
     `GCP_DEPLOYER_SERVICE_ACCOUNT` from the bootstrap outputs.
   - Secrets: `NEON_API_KEY` (Neon console), `VERCEL_API_TOKEN` (Vercel account
     settings).
   - Environments: create `staging` (no protection) and `prod` with **required
     reviewers = you**. That approval click is the prod gate.

4. **First deploy**: the Cloud Run service needs an image to exist before the
   first apply succeeds. Push any backend change to `main` — CI builds and
   pushes the image, then applies staging. Approve the `prod` environment run
   to create prod.

## Day-to-day

- PRs touching `infra/` get a `terraform plan` comment; merge applies staging,
  prod waits for approval.
- Local plans: `terraform init && terraform workspace select staging &&
  terraform plan -var-file=envs/staging.tfvars` (needs `NEON_API_KEY` and
  `VERCEL_API_TOKEN` exported, and gcloud ADC).
- `manage_web` is true only in prod: Vercel is one project for all
  environments and runs its own preview/production lifecycle from git.

## Deliberately not here

- **Fly.io** — its Terraform provider is archived/unmaintained.
- **PR preview databases** — add later with Neon's branch-per-PR GitHub
  action against the staging project.
- **Custom domain, Sentry, object storage (R2/GCS)** — add as modules when
  the product needs them.
