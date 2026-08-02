variable "app_name" {
  description = "Application name used as resource prefix"
  type        = string
  default     = "hooprunstoday"
}

variable "environment" {
  description = "Deployment environment"
  type        = string

  validation {
    condition     = contains(["staging", "prod"], var.environment)
    error_message = "environment must be staging or prod."
  }
}

variable "gcp_project_id" {
  description = "GCP project id"
  type        = string
}

variable "gcp_region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "us-central1"
}

variable "image_tag" {
  description = "Container image tag to deploy (git SHA in CI)"
  type        = string
  default     = "latest"
}

variable "neon_region" {
  description = "Neon region id"
  type        = string
  default     = "aws-us-east-2"
}

variable "api_min_instances" {
  description = "Minimum Cloud Run instances (0 = scale to zero)"
  type        = number
  default     = 0
}

variable "api_max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 4
}

variable "manage_web" {
  description = "Whether this environment owns the Vercel project (true only in prod; Vercel handles preview/production internally)"
  type        = bool
  default     = false
}

variable "github_repository" {
  description = "GitHub repo as owner/name, linked to the Vercel project"
  type        = string
  default     = "enriquesalceda/hooprunstoday"
}

variable "clerk_issuer" {
  description = "Clerk instance issuer URL (public). One dev instance for all environments until the custom-domain prod instance exists."
  type        = string
  default     = "https://deep-seasnail-45.clerk.accounts.dev"
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key (public by design)"
  type        = string
  default     = "pk_test_ZGVlcC1zZWFzbmFpbC00NS5jbGVyay5hY2NvdW50cy5kZXYk"
}

variable "clerk_secret_key" {
  description = "Clerk secret key for the Next.js server runtime. Supplied by CI (prod environment secret); empty skips the Vercel env var."
  type        = string
  sensitive   = true
  default     = ""
}

variable "staging_api_url" {
  description = "Staging API URL for Vercel preview/development targets. Literal because the staging workspace owns the value and cross-workspace reads aren't worth it for one stable string."
  type        = string
  default     = "https://hooprunstoday-api-staging-w273rowgva-uc.a.run.app"
}

variable "web_domain" {
  description = "Apex domain for the web app. Only read where manage_web is true (prod)."
  type        = string
  default     = "hoopruns.today"
}
