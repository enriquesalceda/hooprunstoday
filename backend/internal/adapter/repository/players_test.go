//go:build integration

package repository_test

import (
	"context"
	"database/sql"
	"os"
	"testing"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/repository"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres"
)

var now = time.Date(2026, 8, 1, 12, 0, 0, 0, time.UTC)

func TestPlayers(t *testing.T) {
	t.Run("saves a player and returns the stored record", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		player := mustNewPlayer(t, db, "user_save", "jordan_miller")

		// Exercise
		stored, err := players.Save(context.Background(), player)

		// Expectations
		require.NoError(t, err)
		require.NotEmpty(t, stored.ID)
		require.False(t, stored.CreatedAt.IsZero())
		require.Equal(t, "user_save", stored.ClerkUserID)
		require.Equal(t, "jordan_miller", stored.Handle)
		require.Equal(t, player.DateOfBirth, stored.DateOfBirth)
		require.Equal(t, player.Height, stored.Height)
		require.Equal(t, player.Positions, stored.Positions)
		require.Equal(t, player.HomeCourtID, stored.HomeCourtID)
	})

	t.Run("rejects a taken handle regardless of case", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := players.Save(context.Background(), mustNewPlayer(t, db, "user_one", "jordan_miller"))
		require.NoError(t, err)

		// Exercise: citext uniqueness straight through SQL with mixed case
		_, rawErr := db.Exec(
			`INSERT INTO players (clerk_user_id, real_name, handle) VALUES ($1, $2, $3)`,
			"user_two", "Other Person", "JORDAN_MILLER")

		// Expectations
		require.Error(t, rawErr, "citext unique index must treat JORDAN_MILLER as taken")

		_, err = players.Save(context.Background(), mustNewPlayer(t, db, "user_two", "jordan_miller"))
		require.ErrorIs(t, err, domain.ErrHandleTaken)
	})

	t.Run("rejects a second record for the same clerk user", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := players.Save(context.Background(), mustNewPlayer(t, db, "user_dup", "jordan_miller"))
		require.NoError(t, err)

		// Exercise
		_, err = players.Save(context.Background(), mustNewPlayer(t, db, "user_dup", "different_handle"))

		// Expectations
		require.ErrorIs(t, err, domain.ErrPlayerExists)
	})

	t.Run("rejects a home court that does not exist", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		player := mustNewPlayer(t, db, "user_ghost_court", "ghost_court")
		player.HomeCourtID = "00000000-0000-0000-0000-000000000000"

		// Exercise
		_, err := players.Save(context.Background(), player)

		// Expectations
		require.ErrorIs(t, err, domain.ErrCourtNotFound)
	})

	t.Run("finds a player by clerk user id", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		saved, err := players.Save(context.Background(), mustNewPlayer(t, db, "user_find", "jordan_miller"))
		require.NoError(t, err)

		// Exercise
		found, err := players.FindByClerkUserID(context.Background(), "user_find")

		// Expectations
		require.NoError(t, err)
		require.Equal(t, saved.ID, found.ID)
		require.Equal(t, "jordan_miller", found.Handle)
		require.Equal(t, saved.Positions, found.Positions)
		require.Equal(t, saved.HomeCourtID, found.HomeCourtID)
	})

	t.Run("reports not-found for an unknown clerk user", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)

		// Exercise
		_, err := players.FindByClerkUserID(context.Background(), "user_ghost")

		// Expectations
		require.ErrorIs(t, err, domain.ErrPlayerNotFound)
	})

	t.Run("tolerates rows created before the identity migration", func(t *testing.T) {
		// Setup: a minimal pre-00003 row with NULL identity columns
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := db.Exec(
			`INSERT INTO players (clerk_user_id, real_name, handle) VALUES ($1, $2, $3)`,
			"user_legacy", "Old Timer", "old_timer")
		require.NoError(t, err)

		// Exercise
		found, err := players.FindByClerkUserID(context.Background(), "user_legacy")

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "old_timer", found.Handle)
		require.True(t, found.DateOfBirth.IsZero())
		require.Empty(t, found.Positions)
		require.Empty(t, found.HomeCourtID)
	})

	t.Run("reports handle availability case-insensitively", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		players := repository.NewPlayers(db)
		_, err := players.Save(context.Background(), mustNewPlayer(t, db, "user_avail", "jordan_miller"))
		require.NoError(t, err)

		// Exercise + Expectations
		taken, err := players.HandleTaken(context.Background(), "jordan_miller")
		require.NoError(t, err)
		require.True(t, taken)

		free, err := players.HandleTaken(context.Background(), "someone_else")
		require.NoError(t, err)
		require.False(t, free)
	})
}

func TestCourts(t *testing.T) {
	t.Run("lists the seeded directory", func(t *testing.T) {
		// Setup
		db := openMigratedDB(t)
		courts := repository.NewCourts(db)

		// Exercise
		list, err := courts.List(context.Background())

		// Expectations
		require.NoError(t, err)
		require.GreaterOrEqual(t, len(list), 3)
		names := map[string]domain.CourtType{}
		for _, c := range list {
			require.NotEmpty(t, c.ID)
			names[c.Name] = c.Type
		}
		require.Equal(t, domain.CourtOutdoor, names["PRINCE ALFRED PARK"])
		require.Equal(t, domain.CourtIndoor, names["REDFERN COMMUNITY CT"])
	})
}

func mustNewPlayer(t *testing.T, db *sql.DB, clerkUserID, handle string) domain.Player {
	t.Helper()
	p, err := domain.NewPlayer(domain.PlayerParams{
		ClerkUserID: clerkUserID,
		RealName:    "Jordan Miller",
		Handle:      handle,
		DateOfBirth: time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC),
		Height:      domain.Height{Value: `6'2"`, Unit: domain.HeightFT},
		Positions:   []domain.Position{domain.PositionWing, domain.PositionCenter},
		HomeCourtID: seededCourtID(t, db),
	}, now)
	require.NoError(t, err)
	return p
}

func seededCourtID(t *testing.T, db *sql.DB) string {
	t.Helper()
	var id string
	require.NoError(t, db.QueryRow(`SELECT id FROM courts ORDER BY name LIMIT 1`).Scan(&id))
	return id
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
