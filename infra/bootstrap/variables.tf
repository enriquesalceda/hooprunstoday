variable "project_id" {
  description = "GCP project id"
  type        = string
}

variable "region" {
  description = "Region for the state bucket"
  type        = string
  default     = "us-central1"
}

variable "github_repository" {
  description = "GitHub repo allowed to deploy, as owner/name"
  type        = string
  default     = "enriquesalceda/hooprunstoday"
}
