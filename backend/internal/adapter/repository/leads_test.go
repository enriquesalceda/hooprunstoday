//go:build integration

package repository_test

import (
	"context"
	"database/sql"
	"testing"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/repository"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres/postgrestest"
)

func TestLeads(t *testing.T) {
	t.Run("saves a lead and returns the stored record", func(t *testing.T) {
		// Setup
		db := openLeadsDB(t)
		leads := repository.NewLeads(db)
		lead := mustNewLead(t, "Jordan", domain.ContactEmail, "jordan@example.com")

		// Exercise
		stored, err := leads.Save(context.Background(), lead)

		// Expectations
		require.NoError(t, err)
		require.NotEmpty(t, stored.ID)
		require.False(t, stored.CreatedAt.IsZero())
		require.Equal(t, "Jordan", stored.Name)
		require.Equal(t, domain.ContactEmail, stored.Method)
		require.Equal(t, "jordan@example.com", stored.Contact)
	})

	t.Run("resubmitting the same contact refreshes the name instead of duplicating", func(t *testing.T) {
		// Setup
		db := openLeadsDB(t)
		leads := repository.NewLeads(db)
		first, err := leads.Save(context.Background(), mustNewLead(t, "Jordan", domain.ContactEmail, "jordan@example.com"))
		require.NoError(t, err)

		// Exercise
		second, err := leads.Save(context.Background(), mustNewLead(t, "Jordy", domain.ContactEmail, "jordan@example.com"))

		// Expectations
		require.NoError(t, err)
		require.Equal(t, first.ID, second.ID, "same contact keeps the same row")
		require.Equal(t, "Jordy", second.Name)

		var count int
		require.NoError(t, db.QueryRow(`SELECT count(*) FROM leads`).Scan(&count))
		require.Equal(t, 1, count)
	})

	t.Run("the same contact under a different method is a separate lead", func(t *testing.T) {
		// Setup
		db := openLeadsDB(t)
		leads := repository.NewLeads(db)
		_, err := leads.Save(context.Background(), mustNewLead(t, "Jordan", domain.ContactMobile, "61412345678"))
		require.NoError(t, err)

		// Exercise
		_, err = leads.Save(context.Background(), mustNewLead(t, "Jordan", domain.ContactMobile, "61412345679"))

		// Expectations
		require.NoError(t, err)
		var count int
		require.NoError(t, db.QueryRow(`SELECT count(*) FROM leads`).Scan(&count))
		require.Equal(t, 2, count)
	})
}

func mustNewLead(t *testing.T, name string, method domain.ContactMethod, contact string) domain.Lead {
	t.Helper()
	lead, err := domain.NewLead(domain.LeadParams{Name: name, Method: method, Contact: contact})
	require.NoError(t, err)
	return lead
}

func openLeadsDB(t *testing.T) *sql.DB {
	t.Helper()

	db := postgrestest.Open(t, "hooprunstoday_test_leads")
	require.NoError(t, postgres.Migrate(context.Background(), db))

	// Cleanup
	t.Cleanup(func() {
		_, err := db.Exec(`TRUNCATE leads`)
		require.NoError(t, err)
	})

	return db
}
