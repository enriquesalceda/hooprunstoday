variable "app_name" {
  type = string
}

variable "github_repository" {
  type = string
}

variable "api_url" {
  description = "Prod API URL exposed to the Next.js app"
  type        = string
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key (public by design)"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk secret key; empty skips creating the Vercel env var"
  type        = string
  sensitive   = true
  default     = ""
}

variable "staging_api_url" {
  description = "API URL for preview/development deployments"
  type        = string
}
