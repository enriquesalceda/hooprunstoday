package config_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/config"
)

func TestLoad(t *testing.T) {
	t.Run("loads required values and defaults the port", func(t *testing.T) {
		// Setup
		t.Setenv("PORT", "")
		t.Setenv("DATABASE_URL", "postgres://example/db")
		t.Setenv("CLERK_ISSUER", "https://example.clerk.accounts.dev")

		// Exercise
		cfg, err := config.Load()

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "8080", cfg.Port)
		require.Equal(t, "postgres://example/db", cfg.DatabaseURL)
		require.Equal(t, "https://example.clerk.accounts.dev", cfg.ClerkIssuer)
	})

	t.Run("respects an explicit port", func(t *testing.T) {
		// Setup
		t.Setenv("PORT", "9999")
		t.Setenv("DATABASE_URL", "postgres://example/db")
		t.Setenv("CLERK_ISSUER", "https://example.clerk.accounts.dev")

		// Exercise
		cfg, err := config.Load()

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "9999", cfg.Port)
	})

	t.Run("fails when a required value is missing", func(t *testing.T) {
		cases := []struct {
			name    string
			unset   string
			mention string
		}{
			{"missing database url", "DATABASE_URL", "DATABASE_URL"},
			{"missing clerk issuer", "CLERK_ISSUER", "CLERK_ISSUER"},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				t.Setenv("DATABASE_URL", "postgres://example/db")
				t.Setenv("CLERK_ISSUER", "https://example.clerk.accounts.dev")
				t.Setenv(tc.unset, "")

				// Exercise
				_, err := config.Load()

				// Expectations
				require.Error(t, err)
				require.Contains(t, err.Error(), tc.mention)
			})
		}
	})
}
