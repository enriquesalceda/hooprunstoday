terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
    }
  }
}

resource "vercel_project" "this" {
  name           = var.app_name
  framework      = "nextjs"
  root_directory = "web"

  git_repository = {
    type = "github"
    repo = var.github_repository
  }
}

resource "vercel_project_environment_variable" "api_url" {
  project_id = vercel_project.this.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = var.api_url
  target     = ["production"]
}

# Previews and local `vercel dev` talk to the staging API.
resource "vercel_project_environment_variable" "api_url_preview" {
  project_id = vercel_project.this.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = var.staging_api_url
  target     = ["preview", "development"]
}

resource "vercel_project_environment_variable" "clerk_publishable_key" {
  project_id = vercel_project.this.id
  key        = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  value      = var.clerk_publishable_key
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "clerk_secret_key" {
  count = var.clerk_secret_key == "" ? 0 : 1

  project_id = vercel_project.this.id
  key        = "CLERK_SECRET_KEY"
  value      = var.clerk_secret_key
  # Vercel forbids sensitive vars on the development target; local dev uses
  # web/.env.local anyway.
  target    = ["production", "preview"]
  sensitive = true
}
