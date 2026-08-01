package checkhandle_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/checkhandle"
)

type stubHandleStore struct {
	taken     bool
	err       error
	gotHandle string
}

func (s *stubHandleStore) HandleTaken(_ context.Context, handle string) (bool, error) {
	s.gotHandle = handle
	return s.taken, s.err
}

func TestCheckHandle(t *testing.T) {
	t.Run("reports availability for a free handle, normalized", func(t *testing.T) {
		// Setup
		store := &stubHandleStore{taken: false}
		uc := checkhandle.New(store)

		// Exercise
		out, err := uc.Execute(context.Background(), checkhandle.Input{Handle: "Jordan_Miller"})

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "jordan_miller", out.Handle)
		require.True(t, out.Available)
		require.Equal(t, "jordan_miller", store.gotHandle)
	})

	t.Run("reports a taken handle", func(t *testing.T) {
		// Setup
		uc := checkhandle.New(&stubHandleStore{taken: true})

		// Exercise
		out, err := uc.Execute(context.Background(), checkhandle.Input{Handle: "jordan_miller"})

		// Expectations
		require.NoError(t, err)
		require.False(t, out.Available)
	})

	t.Run("rejects malformed handles without touching the store", func(t *testing.T) {
		// Setup
		store := &stubHandleStore{}
		uc := checkhandle.New(store)

		// Exercise
		_, err := uc.Execute(context.Background(), checkhandle.Input{Handle: "x"})

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidHandle)
		require.Empty(t, store.gotHandle)
	})

	t.Run("wraps storage errors", func(t *testing.T) {
		// Setup
		boom := errors.New("connection reset")
		uc := checkhandle.New(&stubHandleStore{err: boom})

		// Exercise
		_, err := uc.Execute(context.Background(), checkhandle.Input{Handle: "jordan_miller"})

		// Expectations
		require.ErrorIs(t, err, boom)
	})
}
