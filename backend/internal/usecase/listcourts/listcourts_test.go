package listcourts_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/listcourts"
)

type stubCourtStore struct {
	courts []domain.Court
	err    error
}

func (s *stubCourtStore) List(_ context.Context) ([]domain.Court, error) {
	return s.courts, s.err
}

func TestListCourts(t *testing.T) {
	t.Run("returns the directory", func(t *testing.T) {
		// Setup
		courts := []domain.Court{{ID: "c1", Name: "PRINCE ALFRED PARK", Type: domain.CourtOutdoor}}
		uc := listcourts.New(&stubCourtStore{courts: courts})

		// Exercise
		out, err := uc.Execute(context.Background())

		// Expectations
		require.NoError(t, err)
		require.Equal(t, courts, out.Courts)
	})

	t.Run("wraps storage errors", func(t *testing.T) {
		// Setup
		boom := errors.New("connection reset")
		uc := listcourts.New(&stubCourtStore{err: boom})

		// Exercise
		_, err := uc.Execute(context.Background())

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
