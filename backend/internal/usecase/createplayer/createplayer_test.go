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

func TestCreatePlayer(t *testing.T) {
	t.Run("creates a player and returns the stored record", func(t *testing.T) {
		// Setup
		stored := domain.Player{
			ID:          "8f14e45f-ea4a-4a3f-9c6b-000000000000",
			ClerkUserID: "user_2abc",
			RealName:    "Jordan Miller",
			Handle:      "jordan_miller",
			CreatedAt:   time.Date(2026, 7, 29, 12, 0, 0, 0, time.UTC),
		}
		store := &spyPlayerStore{returns: stored}
		uc := createplayer.New(store)

		// Exercise
		out, err := uc.Execute(context.Background(), createplayer.Input{
			ClerkUserID: "user_2abc",
			RealName:    "Jordan Miller",
			Handle:      "Jordan_Miller",
		})

		// Expectations
		require.NoError(t, err)
		require.Equal(t, stored, out.Player)
		require.Len(t, store.saved, 1)
		require.Equal(t, "jordan_miller", store.saved[0].Handle, "handle normalized before saving")
	})

	t.Run("rejects invalid input without touching the store", func(t *testing.T) {
		// Setup
		store := &spyPlayerStore{}
		uc := createplayer.New(store)

		// Exercise
		_, err := uc.Execute(context.Background(), createplayer.Input{
			ClerkUserID: "user_2abc",
			RealName:    "Jordan Miller",
			Handle:      "x",
		})

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidHandle)
		require.Empty(t, store.saved)
	})

	t.Run("passes through storage conflicts", func(t *testing.T) {
		cases := []struct {
			name string
			err  error
		}{
			{"handle taken", domain.ErrHandleTaken},
			{"player already exists", domain.ErrPlayerExists},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				store := &spyPlayerStore{err: tc.err}
				uc := createplayer.New(store)

				// Exercise
				_, err := uc.Execute(context.Background(), createplayer.Input{
					ClerkUserID: "user_2abc",
					RealName:    "Jordan Miller",
					Handle:      "jordan_miller",
				})

				// Expectations
				require.ErrorIs(t, err, tc.err)
			})
		}
	})

	t.Run("wraps unexpected storage errors", func(t *testing.T) {
		// Setup
		boom := errors.New("connection reset")
		store := &spyPlayerStore{err: boom}
		uc := createplayer.New(store)

		// Exercise
		_, err := uc.Execute(context.Background(), createplayer.Input{
			ClerkUserID: "user_2abc",
			RealName:    "Jordan Miller",
			Handle:      "jordan_miller",
		})

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
