# -----------------------------------------------------------------------------
# Database (Neon serverless Postgres)
# -----------------------------------------------------------------------------

module "db" {
  source = "./modules/db"

  app_name    = var.app_name
  environment = var.environment
  region      = var.neon_region
}

# -----------------------------------------------------------------------------
# API (Cloud Run)
# -----------------------------------------------------------------------------

module "api" {
  source = "./modules/api"

  app_name      = var.app_name
  environment   = var.environment
  project_id    = var.gcp_project_id
  region        = var.gcp_region
  image_tag     = var.image_tag
  clerk_issuer  = var.clerk_issuer
  min_instances = var.api_min_instances
  max_instances = var.api_max_instances
  database_url  = module.db.connection_uri
}

# -----------------------------------------------------------------------------
# Web (Vercel) — one project for all environments; Vercel runs its own
# preview/production lifecycle off the linked GitHub repo. Enabled via
# manage_web=true in prod only so staging/prod applies don't fight over it.
# -----------------------------------------------------------------------------

module "web" {
  source = "./modules/web"
  count  = var.manage_web ? 1 : 0

  app_name              = var.app_name
  github_repository     = var.github_repository
  api_url               = module.api.url
  staging_api_url       = var.staging_api_url
  clerk_publishable_key = var.clerk_publishable_key
  clerk_secret_key      = var.clerk_secret_key
}

# -----------------------------------------------------------------------------
# Outputs
# -----------------------------------------------------------------------------

output "api_url" {
  description = "Cloud Run API URL"
  value       = module.api.url
}

output "db_connection_uri" {
  description = "Postgres connection URI"
  value       = module.db.connection_uri
  sensitive   = true
}
