package domain_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

func TestNewLead(t *testing.T) {
	t.Run("creates an email lead with trimmed name and lowercased contact", func(t *testing.T) {
		// Setup
		params := domain.LeadParams{
			Name:    "  Jordan  ",
			Method:  domain.ContactEmail,
			Contact: " Jordan@Example.COM ",
		}

		// Exercise
		lead, err := domain.NewLead(params)

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "Jordan", lead.Name)
		require.Equal(t, domain.ContactEmail, lead.Method)
		require.Equal(t, "jordan@example.com", lead.Contact)
	})

	t.Run("creates a mobile lead normalized to digits", func(t *testing.T) {
		// Setup
		params := domain.LeadParams{
			Name:    "Jordan",
			Method:  domain.ContactMobile,
			Contact: "+61 (412) 345-678",
		}

		// Exercise
		lead, err := domain.NewLead(params)

		// Expectations
		require.NoError(t, err)
		require.Equal(t, domain.ContactMobile, lead.Method)
		require.Equal(t, "+61412345678", lead.Contact)
	})

	t.Run("rejects invalid names", func(t *testing.T) {
		cases := []struct {
			name  string
			value string
		}{
			{"empty", ""},
			{"whitespace only", "   "},
			{"too long", strings.Repeat("a", 81)},
		}
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := domain.NewLead(domain.LeadParams{
					Name: tc.value, Method: domain.ContactEmail, Contact: "a@b.co",
				})

				// Expectations
				require.ErrorIs(t, err, domain.ErrInvalidLeadName)
			})
		}
	})

	t.Run("rejects an unknown contact method", func(t *testing.T) {
		// Exercise
		_, err := domain.NewLead(domain.LeadParams{
			Name: "Jordan", Method: "CARRIER PIGEON", Contact: "a@b.co",
		})

		// Expectations
		require.ErrorIs(t, err, domain.ErrInvalidContactMethod)
	})

	t.Run("rejects invalid email contacts", func(t *testing.T) {
		cases := []struct {
			name  string
			value string
		}{
			{"empty", ""},
			{"no at sign", "jordan.example.com"},
			{"no domain dot", "jordan@example"},
			{"spaces inside", "jor dan@example.com"},
			{"too long", strings.Repeat("a", 250) + "@b.co"},
		}
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := domain.NewLead(domain.LeadParams{
					Name: "Jordan", Method: domain.ContactEmail, Contact: tc.value,
				})

				// Expectations
				require.ErrorIs(t, err, domain.ErrInvalidLeadContact)
			})
		}
	})

	t.Run("rejects invalid mobile contacts", func(t *testing.T) {
		cases := []struct {
			name  string
			value string
		}{
			{"empty", ""},
			{"letters", "call me"},
			{"too short", "12345"},
			{"too long", "1234567890123456"},
			{"plus not leading", "04+12345678"},
		}
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := domain.NewLead(domain.LeadParams{
					Name: "Jordan", Method: domain.ContactMobile, Contact: tc.value,
				})

				// Expectations
				require.ErrorIs(t, err, domain.ErrInvalidLeadContact)
			})
		}
	})
}

func TestParseContactMethod(t *testing.T) {
	t.Run("accepts the two known methods", func(t *testing.T) {
		for _, s := range []string{"EMAIL", "MOBILE"} {
			m, err := domain.ParseContactMethod(s)
			require.NoError(t, err)
			require.Equal(t, s, string(m))
		}
	})

	t.Run("rejects anything else", func(t *testing.T) {
		_, err := domain.ParseContactMethod("email")
		require.ErrorIs(t, err, domain.ErrInvalidContactMethod)
	})
}
