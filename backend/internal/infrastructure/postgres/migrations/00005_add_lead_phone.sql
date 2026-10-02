-- +goose Up
-- Optional mobile for SMS launch alerts, in E.164. NULL means the lead
-- didn't opt in. The email stays the identity (unique contact); the phone
-- is a preference that a resubmission can add or change.
ALTER TABLE leads ADD COLUMN phone text;

-- +goose Down
ALTER TABLE leads DROP COLUMN phone;
