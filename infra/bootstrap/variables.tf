variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "region" {
  description = "Region for the state bucket"
  type        = string
  default     = "us-central1"
}

variable "app_name" {
  description = "Application name — names the shared Docker repo"
  type        = string
  default     = "hooprunstoday"
}

variable "github_repository" {
  description = "GitHub repo allowed to deploy, as owner/name"
  type        = string
  default     = "enriquesalceda/hooprunstoday"
}
