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
