output "state_bucket" {
  description = "GCS bucket for Terraform state — goes in ../backend.tf"
  value       = google_storage_bucket.tf_state.name
}

output "workload_identity_provider" {
  description = "Set as GitHub Actions variable GCP_WORKLOAD_IDENTITY_PROVIDER"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "deployer_service_account" {
  description = "Set as GitHub Actions variable GCP_DEPLOYER_SERVICE_ACCOUNT"
  value       = google_service_account.deployer.email
}
