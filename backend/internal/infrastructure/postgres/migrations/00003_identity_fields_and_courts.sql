-- +goose Up
CREATE TABLE courts (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text NOT NULL UNIQUE,
    court_type text NOT NULL CHECK (court_type IN ('OUTDOOR', 'INDOOR')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Fixture directory from the design package; Radar features will manage
-- courts properly later.
INSERT INTO courts (name, court_type) VALUES
    ('PRINCE ALFRED PARK', 'OUTDOOR'),
    ('WATERLOO OVAL', 'OUTDOOR'),
    ('REDFERN COMMUNITY CT', 'INDOOR')
ON CONFLICT (name) DO NOTHING;

-- Nullable in the schema: rows created before this migration stay valid,
-- and profiles may grow over time. The domain requires them at creation.
ALTER TABLE players
    ADD COLUMN date_of_birth date,
    ADD COLUMN height_value  text,
    ADD COLUMN height_unit   text CHECK (height_unit IN ('FT', 'CM')),
    ADD COLUMN positions     text[] CHECK (
        positions IS NULL OR (
            array_length(positions, 1) >= 1 AND
            positions <@ ARRAY['POINT GUARD','SHOOTING GUARD','WING','FORWARD','CENTER']::text[]
        )
    ),
    ADD COLUMN home_court_id uuid REFERENCES courts (id);

-- +goose Down
ALTER TABLE players
    DROP COLUMN date_of_birth,
    DROP COLUMN height_value,
    DROP COLUMN height_unit,
    DROP COLUMN positions,
    DROP COLUMN home_court_id;
DROP TABLE courts;
