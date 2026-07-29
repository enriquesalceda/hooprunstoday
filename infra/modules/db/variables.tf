variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  description = "Neon region id, e.g. aws-us-east-2"
  type        = string
}
