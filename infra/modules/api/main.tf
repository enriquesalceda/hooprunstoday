locals {
  service_name = "${var.app_name}-api-${var.environment}"
  image        = "${var.region}-docker.pkg.dev/${var.project_id}/${var.app_name}/api:${var.image_tag}"
}

# The shared Docker repo lives in ../../bootstrap — CI pushes images before
# the first environment apply, so it must predate this stack.

resource "google_service_account" "runtime" {
  account_id   = "${var.app_name}-api-${var.environment}"
  display_name = "Cloud Run runtime for ${local.service_name}"
}

# DATABASE_URL lives in Secret Manager, never in env-var plaintext or state-adjacent config.
resource "google_secret_manager_secret" "database_url" {
  secret_id = "${local.service_name}-database-url"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = var.database_url
}

resource "google_secret_manager_secret_iam_member" "runtime_access" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_run_v2_service" "this" {
  name     = local.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  # Terraform (via CI) must be free to replace the service; the provider
  # defaults this to true and blocks any destroy.
  deletion_protection = false

  template {
    service_account = google_service_account.runtime.email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = local.image

      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle = true
      }

      startup_probe {
        http_get {
          path = "/api/v1/health"
        }
      }
    }
  }

  depends_on = [google_secret_manager_secret_version.database_url]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.this.name
  location = google_cloud_run_v2_service.this.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
