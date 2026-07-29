terraform {
  backend "gcs" {
    # Created by ./bootstrap — "<project_id>-tf-state". Bucket names can't be
    # variables here; update after running bootstrap.
    bucket = "hooprunstoday-tf-state"
    prefix = "terraform/state"
  }
}
