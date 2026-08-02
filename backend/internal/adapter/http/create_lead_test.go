package http_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createlead"
)

type stubLeadCreator struct {
	in  createlead.Input
	out createlead.Output
	err error
}

func (s *stubLeadCreator) Execute(_ context.Context, in createlead.Input) (createlead.Output, error) {
	s.in = in
	return s.out, s.err
}

func postLead(t *testing.T, creator adapterhttp.LeadCreator, body string) *httptest.ResponseRecorder {
	t.Helper()
	rec := httptest.NewRecorder()
	adapterhttp.NewCreateLeadHandler(creator, testLogger()).
		ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/api/v1/leads", strings.NewReader(body)))
	return rec
}

func TestCreateLeadHandler(t *testing.T) {
	t.Run("creates a lead and responds with the stored record", func(t *testing.T) {
		// Setup
		creator := &stubLeadCreator{out: createlead.Output{Lead: domain.Lead{
			ID: "uuid-1", Name: "Jordan", Method: domain.ContactEmail,
			Contact:   "jordan@example.com",
			CreatedAt: time.Date(2026, 8, 2, 12, 0, 0, 0, time.UTC),
		}}}

		// Exercise
		rec := postLead(t, creator,
			`{"name":"Jordan","contact_method":"EMAIL","contact":"jordan@example.com"}`)

		// Expectations
		require.Equal(t, http.StatusCreated, rec.Code)
		require.Equal(t, createlead.Input{
			Name: "Jordan", Method: domain.ContactEmail, Contact: "jordan@example.com",
		}, creator.in)

		var body map[string]string
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "uuid-1", body["id"])
		require.Equal(t, "Jordan", body["name"])
		require.Equal(t, "EMAIL", body["contact_method"])
		require.Equal(t, "jordan@example.com", body["contact"])
		require.Equal(t, "2026-08-02T12:00:00Z", body["created_at"])
	})

	t.Run("rejects a malformed body", func(t *testing.T) {
		// Exercise
		rec := postLead(t, &stubLeadCreator{}, `{not json`)

		// Expectations
		require.Equal(t, http.StatusBadRequest, rec.Code)
		require.Contains(t, rec.Body.String(), "malformed_json")
	})

	t.Run("maps validation errors to fields", func(t *testing.T) {
		cases := []struct {
			name  string
			err   error
			field string
		}{
			{"invalid name", domain.ErrInvalidLeadName, "name"},
			{"invalid method", domain.ErrInvalidContactMethod, "contact_method"},
			{"invalid contact", domain.ErrInvalidLeadContact, "contact"},
		}
		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				creator := &stubLeadCreator{err: tc.err}

				// Exercise
				rec := postLead(t, creator,
					`{"name":"Jordan","contact_method":"EMAIL","contact":"jordan@example.com"}`)

				// Expectations
				require.Equal(t, http.StatusUnprocessableEntity, rec.Code)
				var body struct {
					Error struct {
						Code   string            `json:"code"`
						Fields map[string]string `json:"fields"`
					} `json:"error"`
				}
				require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
				require.Equal(t, "validation_failed", body.Error.Code)
				require.Contains(t, body.Error.Fields, tc.field)
			})
		}
	})

	t.Run("responds 500 on unexpected failures", func(t *testing.T) {
		// Setup
		creator := &stubLeadCreator{err: errors.New("connection refused")}

		// Exercise
		rec := postLead(t, creator,
			`{"name":"Jordan","contact_method":"EMAIL","contact":"jordan@example.com"}`)

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		require.Contains(t, rec.Body.String(), "internal")
	})
}
