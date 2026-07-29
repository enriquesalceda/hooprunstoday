//go:build integration

package repository_test

import (
	"context"
	"database/sql"
	"os"
	"testing"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/repository"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres"
)

func TestPlayers(t *testing.T) {
	t.Run("saves a player and returns the stored record", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		player := mustNewPlayer(t, "user_save", "Jordan Miller", "jordan_miller")

		// Exercise
		stored, err := players.Save(context.Background(), player)

		// Expectations
		require.NoError(t, err)
		require.NotEmpty(t, stored.ID)
		require.False(t, stored.CreatedAt.IsZero())
		require.False(t, stored.UpdatedAt.IsZero())
		require.Equal(t, "user_save", stored.ClerkUserID)
		require.Equal(t, "Jordan Miller", stored.RealName)
		require.Equal(t, "jordan_miller", stored.Handle)
	})

	t.Run("rejects a taken handle regardless of case", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := players.Save(context.Background(),
			mustNewPlayer(t, "user_one", "Jordan Miller", "jordan_miller"))
		require.NoError(t, err)

		// Exercise: same handle, different case, different clerk user.
		// NewPlayer lowercases, so exercise citext directly with raw SQL-level
		// difference via a mixed-case insert bypassing normalization.
		_, rawErr := db.Exec(
			`INSERT INTO players (clerk_user_id, real_name, handle) VALUES ($1, $2, $3)`,
			"user_two", "Other Person", "JORDAN_MILLER")

		// Expectations
		require.Error(t, rawErr, "citext unique index must treat JORDAN_MILLER as taken")

		// And through the repository:
		_, err = players.Save(context.Background(),
			mustNewPlayer(t, "user_two", "Other Person", "jordan_miller"))
		require.ErrorIs(t, err, domain.ErrHandleTaken)
	})

	t.Run("rejects a second record for the same clerk user", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := players.Save(context.Background(),
			mustNewPlayer(t, "user_dup", "Jordan Miller", "jordan_miller"))
		require.NoError(t, err)

		// Exercise
		_, err = players.Save(context.Background(),
			mustNewPlayer(t, "user_dup", "Jordan Miller", "different_handle"))

		// Expectations
		require.ErrorIs(t, err, domain.ErrPlayerExists)
	})
}

func mustNewPlayer(t *testing.T, clerkUserID, realName, handle string) domain.Player {
	t.Helper()
	p, err := domain.NewPlayer(clerkUserID, realName, handle)
	require.NoError(t, err)
	return p
}

func openMigratedDB(t *testing.T) *sql.DB {
	t.Helper()

	url := os.Getenv("DATABASE_URL")
	if url == "" {
		url = "postgres://hooprunstoday:hooprunstoday@localhost:5433/hooprunstoday?sslmode=disable"
	}

	db, err := sql.Open("pgx", url)
	require.NoError(t, err)
	require.NoError(t, db.Ping())
	require.NoError(t, postgres.Migrate(context.Background(), db))

	// Cleanup
	t.Cleanup(func() {
		_, err := db.Exec(`TRUNCATE players`)
		require.NoError(t, err)
		require.NoError(t, db.Close())
	})

	return db
}
