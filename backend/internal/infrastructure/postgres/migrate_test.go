//go:build integration

package postgres_test

import (
	"context"
	"database/sql"
	"os"
	"testing"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres"
)

func TestMigrate(t *testing.T) {
	t.Run("applies all migrations and is safe to run twice", func(t *testing.T) {
		// Setup
		db := openTestDB(t)
		ctx := context.Background()

		// Exercise
		require.NoError(t, postgres.Migrate(ctx, db))
		require.NoError(t, postgres.Migrate(ctx, db)) // idempotent

		// Expectations
		var version int64
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT max(version_id) FROM goose_db_version`).Scan(&version))
		require.GreaterOrEqual(t, version, int64(1))

		var hasCitext bool
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'citext')`).Scan(&hasCitext))
		require.True(t, hasCitext, "citext extension should be installed by the init migration")

		var playersTable sql.NullString
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT to_regclass('public.players')::text`).Scan(&playersTable))
		require.True(t, playersTable.Valid, "players table should exist")

		var handleType string
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT udt_name FROM information_schema.columns
			 WHERE table_name = 'players' AND column_name = 'handle'`).Scan(&handleType))
		require.Equal(t, "citext", handleType, "handle must be case-insensitive")

		var identityColumns int
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT count(*) FROM information_schema.columns
			 WHERE table_name = 'players'
			   AND column_name IN ('date_of_birth', 'height_value', 'height_unit', 'positions', 'home_court_id')`).
			Scan(&identityColumns))
		require.Equal(t, 5, identityColumns, "players carries the full identity fields")

		var seededCourts int
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT count(*) FROM courts`).Scan(&seededCourts))
		require.GreaterOrEqual(t, seededCourts, 3, "courts directory is seeded")
	})
}

func openTestDB(t *testing.T) *sql.DB {
	t.Helper()

	url := os.Getenv("DATABASE_URL")
	if url == "" {
		url = "postgres://hooprunstoday:hooprunstoday@localhost:5433/hooprunstoday?sslmode=disable"
	}

	db, err := sql.Open("pgx", url)
	require.NoError(t, err)
	require.NoError(t, db.Ping())

	// Cleanup
	t.Cleanup(func() {
		_, err := db.Exec(`DROP TABLE IF EXISTS players; DROP TABLE IF EXISTS courts; DROP TABLE IF EXISTS goose_db_version; DROP EXTENSION IF EXISTS citext`)
		require.NoError(t, err)
		require.NoError(t, db.Close())
	})

	return db
}
