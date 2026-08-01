package domain_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

var now = time.Date(2026, 8, 1, 12, 0, 0, 0, time.UTC)

func validParams() domain.PlayerParams {
	return domain.PlayerParams{
		ClerkUserID: "user_2abc",
		RealName:    "  Jordan Miller  ",
		Handle:      "Jordan_Miller",
		DateOfBirth: time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC),
		Height:      domain.Height{Value: `6'2"`, Unit: domain.HeightFT},
		Positions:   []domain.Position{domain.PositionWing, domain.PositionForward},
		HomeCourtID: "court-uuid-1",
	}
}

func TestNewPlayer(t *testing.T) {
	t.Run("creates a player with normalized fields", func(t *testing.T) {
		// Setup + Exercise
		p, err := domain.NewPlayer(validParams(), now)

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "user_2abc", p.ClerkUserID)
		require.Equal(t, "Jordan Miller", p.RealName)
		require.Equal(t, "jordan_miller", p.Handle, "handle is stored lowercase")
		require.Equal(t, time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC), p.DateOfBirth)
		require.Equal(t, domain.Height{Value: `6'2"`, Unit: domain.HeightFT}, p.Height)
		require.Equal(t, []domain.Position{domain.PositionWing, domain.PositionForward}, p.Positions)
		require.Equal(t, "court-uuid-1", p.HomeCourtID)
	})

	t.Run("rejects invalid input", func(t *testing.T) {
		cases := []struct {
			name    string
			mutate  func(*domain.PlayerParams)
			wantErr error
		}{
			{"empty clerk user id", func(p *domain.PlayerParams) { p.ClerkUserID = "" }, domain.ErrInvalidClerkUserID},
			{"empty real name", func(p *domain.PlayerParams) { p.RealName = "   " }, domain.ErrInvalidRealName},
			{"real name over 80 chars", func(p *domain.PlayerParams) { p.RealName = repeat("a", 81) }, domain.ErrInvalidRealName},
			{"handle too short", func(p *domain.PlayerParams) { p.Handle = "ab" }, domain.ErrInvalidHandle},
			{"handle with symbols", func(p *domain.PlayerParams) { p.Handle = "jordan-m!" }, domain.ErrInvalidHandle},
			{"zero date of birth", func(p *domain.PlayerParams) { p.DateOfBirth = time.Time{} }, domain.ErrInvalidDateOfBirth},
			{"future date of birth", func(p *domain.PlayerParams) { p.DateOfBirth = now.AddDate(0, 0, 1) }, domain.ErrInvalidDateOfBirth},
			{"impossibly old", func(p *domain.PlayerParams) { p.DateOfBirth = now.AddDate(-121, 0, 0) }, domain.ErrInvalidDateOfBirth},
			{"empty height", func(p *domain.PlayerParams) { p.Height.Value = "  " }, domain.ErrInvalidHeight},
			{"oversized height", func(p *domain.PlayerParams) { p.Height.Value = repeat("9", 11) }, domain.ErrInvalidHeight},
			{"bad height unit", func(p *domain.PlayerParams) { p.Height.Unit = domain.HeightUnit("IN") }, domain.ErrInvalidHeight},
			{"no positions", func(p *domain.PlayerParams) { p.Positions = nil }, domain.ErrInvalidPositions},
			{"unknown position", func(p *domain.PlayerParams) { p.Positions = []domain.Position{"COACH"} }, domain.ErrInvalidPositions},
			{"duplicate positions", func(p *domain.PlayerParams) {
				p.Positions = []domain.Position{domain.PositionWing, domain.PositionWing}
			}, domain.ErrInvalidPositions},
			{"missing home court", func(p *domain.PlayerParams) { p.HomeCourtID = "" }, domain.ErrInvalidHomeCourt},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				params := validParams()
				tc.mutate(&params)

				// Exercise
				_, err := domain.NewPlayer(params, now)

				// Expectations
				require.ErrorIs(t, err, tc.wantErr)
			})
		}
	})
}

func TestParsePosition(t *testing.T) {
	t.Run("accepts the five positions", func(t *testing.T) {
		for _, s := range []string{"POINT GUARD", "SHOOTING GUARD", "WING", "FORWARD", "CENTER"} {
			// Exercise
			p, err := domain.ParsePosition(s)

			// Expectations
			require.NoError(t, err)
			require.Equal(t, s, string(p))
		}
	})

	t.Run("rejects anything else", func(t *testing.T) {
		// Exercise
		_, err := domain.ParsePosition("COACH")

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidPositions)
	})
}

func TestParseHeightUnit(t *testing.T) {
	t.Run("accepts FT and CM only", func(t *testing.T) {
		for _, s := range []string{"FT", "CM"} {
			// Exercise
			u, err := domain.ParseHeightUnit(s)

			// Expectations
			require.NoError(t, err)
			require.Equal(t, s, string(u))
		}

		// Exercise
		_, err := domain.ParseHeightUnit("IN")

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidHeight)
	})
}

func repeat(s string, n int) string {
	out := ""
	for range n {
		out += s
	}
	return out
}
