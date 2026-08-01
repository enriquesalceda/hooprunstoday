package getplayer_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/getplayer"
)

type stubPlayerFinder struct {
	player domain.Player
	err    error
	got    string
}

func (s *stubPlayerFinder) FindByClerkUserID(_ context.Context, clerkUserID string) (domain.Player, error) {
	s.got = clerkUserID
	return s.player, s.err
}

func TestGetPlayer(t *testing.T) {
	t.Run("returns the caller's player", func(t *testing.T) {
		// Setup
		player := domain.Player{ID: "uuid-1", ClerkUserID: "user_2abc", Handle: "jordan_miller"}
		finder := &stubPlayerFinder{player: player}
		uc := getplayer.New(finder)

		// Exercise
		out, err := uc.Execute(context.Background(), getplayer.Input{ClerkUserID: "user_2abc"})

		// Expectations
		require.NoError(t, err)
		require.Equal(t, player, out.Player)
		require.Equal(t, "user_2abc", finder.got)
	})

	t.Run("passes through not-found", func(t *testing.T) {
		// Setup
		uc := getplayer.New(&stubPlayerFinder{err: domain.ErrPlayerNotFound})

		// Exercise
		_, err := uc.Execute(context.Background(), getplayer.Input{ClerkUserID: "user_ghost"})

		// Expectations
		require.ErrorIs(t, err, domain.ErrPlayerNotFound)
	})

	t.Run("rejects an empty clerk user id", func(t *testing.T) {
		// Setup
		finder := &stubPlayerFinder{}
		uc := getplayer.New(finder)

		// Exercise
		_, err := uc.Execute(context.Background(), getplayer.Input{ClerkUserID: ""})

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidClerkUserID)
		require.Empty(t, finder.got)
	})

	t.Run("wraps unexpected storage errors", func(t *testing.T) {
		// Setup
		boom := errors.New("connection reset")
		uc := getplayer.New(&stubPlayerFinder{err: boom})

		// Exercise
		_, err := uc.Execute(context.Background(), getplayer.Input{ClerkUserID: "user_2abc"})

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
