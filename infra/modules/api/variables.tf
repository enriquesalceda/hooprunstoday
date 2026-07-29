variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "image_tag" {
  type = string
}

variable "min_instances" {
  type = number
}

variable "max_instances" {
  type = number
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "clerk_issuer" {
  description = "Clerk instance issuer URL (public) — JWT verification"
  type        = string
}
