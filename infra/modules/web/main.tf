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
