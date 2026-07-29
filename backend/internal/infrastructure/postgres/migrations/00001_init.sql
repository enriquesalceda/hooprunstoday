-- +goose Up
-- Case-insensitive text type for user-facing identifiers (emails,
-- usernames) as the schema grows.
CREATE EXTENSION IF NOT EXISTS citext;

-- +goose Down
DROP EXTENSION IF EXISTS citext;
