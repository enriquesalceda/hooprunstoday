terraform {
  required_providers {
    neon = {
      source = "kislerdm/neon"
    }
  }
}

# One Neon project per environment. PR preview branches are created by CI
# (neondatabase/create-branch-action) against the staging project, not here.
resource "neon_project" "this" {
  name      = "${var.app_name}-${var.environment}"
  region_id = var.region

  # Free-plan maximum; the provider default (24h) exceeds it.
  history_retention_seconds = 21600

  branch {
    name          = "main"
    database_name = var.app_name
    role_name     = var.app_name
  }
}
