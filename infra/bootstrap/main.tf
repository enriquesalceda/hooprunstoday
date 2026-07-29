# One-time bootstrap, run locally with your own gcloud credentials:
#   gcloud auth application-default login
#   terraform init && terraform apply -var project_id=YOUR_GCP_PROJECT
#
# Creates the resources everything else depends on:
#   - GCS bucket for Terraform state
#   - Workload Identity Federation so GitHub Actions can auth without long-lived keys
#   - Deployer service account used by CI
#
# State for this module stays local (bootstrap.tfstate) — it changes ~never.

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
}

locals {
  services = [
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "iamcredentials.googleapis.com",
    "iam.googleapis.com",
  ]
}

resource "google_project_service" "required" {
  for_each           = toset(local.services)
  service            = each.value
  disable_on_destroy = false
}

# One shared Docker repo for all environments. Lives here, not in the main
# stack: CI pushes the image BEFORE the first staging apply, so the repo has
# to exist before any environment does.
resource "google_artifact_registry_repository" "docker" {
  location      = var.region
  repository_id = var.app_name
  format        = "DOCKER"

  depends_on = [google_project_service.required]
}

resource "google_storage_bucket" "tf_state" {
  name                        = "${var.project_id}-tf-state"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }
}

# --- GitHub Actions -> GCP via OIDC (no service account keys) ---

resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"
  display_name                       = "GitHub OIDC"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  # Only this repo may exchange tokens.
  attribute_condition = "assertion.repository == \"${var.github_repository}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "deployer" {
  account_id   = "github-deployer"
  display_name = "GitHub Actions deployer"
}

resource "google_service_account_iam_member" "deployer_wif" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repository}"
}

resource "google_project_iam_member" "deployer_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/artifactregistry.writer",
    "roles/secretmanager.admin",
    "roles/iam.serviceAccountUser",
    "roles/iam.serviceAccountAdmin",
    "roles/artifactregistry.admin",
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}

resource "google_storage_bucket_iam_member" "deployer_state" {
  bucket = google_storage_bucket.tf_state.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.deployer.email}"
}
