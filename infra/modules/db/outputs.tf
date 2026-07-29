output "project_id" {
  value = neon_project.this.id
}

output "connection_uri" {
  value     = neon_project.this.connection_uri
  sensitive = true
}
