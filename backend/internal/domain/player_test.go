package domain_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

func TestNewPlayer(t *testing.T) {
	t.Run("creates a player with normalized fields", func(t *testing.T) {
		// Setup + Exercise
		p, err := domain.NewPlayer("user_2abc", "  Jordan Miller  ", "Jordan_Miller")

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "user_2abc", p.ClerkUserID)
		require.Equal(t, "Jordan Miller", p.RealName)
		require.Equal(t, "jordan_miller", p.Handle, "handle is stored lowercase")
	})

	t.Run("rejects invalid input", func(t *testing.T) {
		cases := []struct {
			name        string
			clerkUserID string
			realName    string
			handle      string
			wantErr     error
		}{
			{"empty clerk user id", "", "Jordan Miller", "jordan", domain.ErrInvalidClerkUserID},
			{"empty real name", "user_2abc", "", "jordan", domain.ErrInvalidRealName},
			{"whitespace-only real name", "user_2abc", "   ", "jordan", domain.ErrInvalidRealName},
			{"real name over 80 chars", "user_2abc", string(make([]byte, 0, 81)) + repeat("a", 81), "jordan", domain.ErrInvalidRealName},
			{"handle too short", "user_2abc", "Jordan Miller", "ab", domain.ErrInvalidHandle},
			{"handle too long", "user_2abc", "Jordan Miller", repeat("a", 21), domain.ErrInvalidHandle},
			{"handle with spaces", "user_2abc", "Jordan Miller", "jordan miller", domain.ErrInvalidHandle},
			{"handle with symbols", "user_2abc", "Jordan Miller", "jordan-miller!", domain.ErrInvalidHandle},
			{"empty handle", "user_2abc", "Jordan Miller", "", domain.ErrInvalidHandle},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := domain.NewPlayer(tc.clerkUserID, tc.realName, tc.handle)

				// Expectations
				require.ErrorIs(t, err, tc.wantErr)
			})
		}
	})

	t.Run("accepts boundary-length values", func(t *testing.T) {
		cases := []struct {
			name     string
			realName string
			handle   string
		}{
			{"shortest valid handle", "J", "ab_"},
			{"longest valid handle", repeat("a", 80), repeat("a", 20)},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := domain.NewPlayer("user_2abc", tc.realName, tc.handle)

				// Expectations
				require.NoError(t, err)
			})
		}
	})
}

func repeat(s string, n int) string {
	out := ""
	for range n {
		out += s
	}
	return out
}
