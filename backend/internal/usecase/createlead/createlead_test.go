package createlead_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createlead"
)

type spyLeadStore struct {
	saved   []domain.Lead
	returns domain.Lead
	err     error
}

func (s *spyLeadStore) Save(_ context.Context, l domain.Lead) (domain.Lead, error) {
	s.saved = append(s.saved, l)
	if s.err != nil {
		return domain.Lead{}, s.err
	}
	return s.returns, nil
}

func TestCreateLead(t *testing.T) {
	t.Run("saves a normalized lead and returns the stored record", func(t *testing.T) {
		// Setup
		stored := domain.Lead{
			ID: "uuid-1", Name: "Jordan", Method: domain.ContactEmail,
			Contact: "jordan@example.com", CreatedAt: time.Date(2026, 8, 2, 12, 0, 0, 0, time.UTC),
		}
		store := &spyLeadStore{returns: stored}
		uc := createlead.New(store)

		// Exercise
		out, err := uc.Execute(context.Background(), createlead.Input{
			Name: " Jordan ", Method: domain.ContactEmail, Contact: "Jordan@Example.com",
		})

		// Expectations
		require.NoError(t, err)
		require.Equal(t, stored, out.Lead)
		require.Len(t, store.saved, 1)
		require.Equal(t, "Jordan", store.saved[0].Name, "name trimmed before saving")
		require.Equal(t, "jordan@example.com", store.saved[0].Contact, "contact normalized before saving")
	})

	t.Run("rejects invalid input without touching the store", func(t *testing.T) {
		// Setup
		store := &spyLeadStore{}
		uc := createlead.New(store)

		// Exercise
		_, err := uc.Execute(context.Background(), createlead.Input{
			Name: "Jordan", Method: domain.ContactEmail, Contact: "not-an-email",
		})

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidLeadContact)
		require.Empty(t, store.saved)
	})

	t.Run("wraps storage failures", func(t *testing.T) {
		// Setup
		boom := errors.New("connection refused")
		store := &spyLeadStore{err: boom}
		uc := createlead.New(store)

		// Exercise
		_, err := uc.Execute(context.Background(), createlead.Input{
			Name: "Jordan", Method: domain.ContactEmail, Contact: "jordan@example.com",
		})

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
