-- +goose Up
-- Waitlist signups from the temporary landing page. No account, no Clerk —
-- just a name and one normalized way to reach them. Uniqueness is on the
-- contact so a resubmission refreshes the name instead of duplicating.
CREATE TABLE leads (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name           text NOT NULL,
    contact_method text NOT NULL CHECK (contact_method IN ('EMAIL', 'MOBILE')),
    contact        text NOT NULL,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (contact_method, contact)
);

-- +goose Down
DROP TABLE leads;
