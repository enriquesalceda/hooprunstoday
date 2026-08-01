package createplayer_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createplayer"
)

var now = time.Date(2026, 8, 1, 12, 0, 0, 0, time.UTC)

type stubClock struct{ now time.Time }

func (c stubClock) Now() time.Time { return c.now }

type spyPlayerStore struct {
	saved   []domain.Player
	returns domain.Player
	err     error
}

func (s *spyPlayerStore) Save(_ context.Context, p domain.Player) (domain.Player, error) {
	s.saved = append(s.saved, p)
	if s.err != nil {
		return domain.Player{}, s.err
	}
	return s.returns, nil
}

func validInput() createplayer.Input {
	return createplayer.Input{
		ClerkUserID: "user_2abc",
		RealName:    "Jordan Miller",
		Handle:      "Jordan_Miller",
		DateOfBirth: time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC),
		Height:      domain.Height{Value: `6'2"`, Unit: domain.HeightFT},
		Positions:   []domain.Position{domain.PositionWing},
		HomeCourtID: "court-uuid-1",
	}
}

func TestCreatePlayer(t *testing.T) {
	t.Run("creates a player and returns the stored record", func(t *testing.T) {
		// Setup
		stored := domain.Player{ID: "uuid-1", ClerkUserID: "user_2abc", Handle: "jordan_miller"}
		store := &spyPlayerStore{returns: stored}
		uc := createplayer.New(store, stubClock{now})

		// Exercise
		out, err := uc.Execute(context.Background(), validInput())

		// Expectations
		require.NoError(t, err)
		require.Equal(t, stored, out.Player)
		require.Len(t, store.saved, 1)
		require.Equal(t, "jordan_miller", store.saved[0].Handle, "handle normalized before saving")
		require.Equal(t, "court-uuid-1", store.saved[0].HomeCourtID)
	})

	t.Run("rejects invalid input without touching the store", func(t *testing.T) {
		// Setup
		store := &spyPlayerStore{}
		uc := createplayer.New(store, stubClock{now})
		in := validInput()
		in.DateOfBirth = now.AddDate(0, 0, 1)

		// Exercise
		_, err := uc.Execute(context.Background(), in)

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidDateOfBirth)
		require.Empty(t, store.saved)
	})

	t.Run("passes through storage conflicts", func(t *testing.T) {
		cases := []struct {
			name string
			err  error
		}{
			{"handle taken", domain.ErrHandleTaken},
			{"player already exists", domain.ErrPlayerExists},
			{"court not found", domain.ErrCourtNotFound},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				store := &spyPlayerStore{err: tc.err}
				uc := createplayer.New(store, stubClock{now})

				// Exercise
				_, err := uc.Execute(context.Background(), validInput())

				// Expectations
				require.ErrorIs(t, err, tc.err)
			})
		}
	})

	t.Run("wraps unexpected storage errors", func(t *testing.T) {
		// Setup
		boom := errors.New("connection reset")
		store := &spyPlayerStore{err: boom}
		uc := createplayer.New(store, stubClock{now})

		// Exercise
		_, err := uc.Execute(context.Background(), validInput())

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
