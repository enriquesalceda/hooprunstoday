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
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createplayer"
)

type stubPlayerCreator struct {
	got createplayer.Input
	out createplayer.Output
	err error
}

func (s *stubPlayerCreator) Execute(_ context.Context, in createplayer.Input) (createplayer.Output, error) {
	s.got = in
	return s.out, s.err
}

const validBody = `{
	"real_name": "Jordan Miller",
	"handle": "Jordan_Miller",
	"date_of_birth": "2000-07-13",
	"height": {"value": "6'2\"", "unit": "FT"},
	"positions": ["WING", "FORWARD"],
	"home_court_id": "court-uuid-1"
}`

func serveCreatePlayer(t *testing.T, creator *stubPlayerCreator, identity *adapterhttp.Identity, body string) *httptest.ResponseRecorder {
	t.Helper()

	handler := adapterhttp.NewCreatePlayerHandler(creator, testLogger())
	req := httptest.NewRequest(http.MethodPost, "/api/v1/players", strings.NewReader(body))
	if identity != nil {
		verifier := &stubVerifier{identity: *identity}
		req.Header.Set("Authorization", "Bearer tok")
		rec := httptest.NewRecorder()
		adapterhttp.RequireAuth(verifier, handler).ServeHTTP(rec, req)
		return rec
	}
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec
}

func TestCreatePlayerHandler(t *testing.T) {
	identity := &adapterhttp.Identity{ClerkUserID: "user_2abc"}

	t.Run("creates a player and responds 201 with the record", func(t *testing.T) {
		// Setup
		created := time.Date(2026, 8, 1, 12, 0, 0, 0, time.UTC)
		creator := &stubPlayerCreator{out: createplayer.Output{Player: domain.Player{
			ID: "uuid-1", ClerkUserID: "user_2abc", RealName: "Jordan Miller",
			Handle:      "jordan_miller",
			DateOfBirth: time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC),
			Height:      domain.Height{Value: `6'2"`, Unit: domain.HeightFT},
			Positions:   []domain.Position{domain.PositionWing, domain.PositionForward},
			HomeCourtID: "court-uuid-1",
			CreatedAt:   created,
		}}}

		// Exercise
		rec := serveCreatePlayer(t, creator, identity, validBody)

		// Expectations
		require.Equal(t, http.StatusCreated, rec.Code)
		require.Equal(t, "user_2abc", creator.got.ClerkUserID,
			"clerk user id must come from the verified token, not the body")
		require.Equal(t, time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC), creator.got.DateOfBirth)
		require.Equal(t, []domain.Position{domain.PositionWing, domain.PositionForward}, creator.got.Positions)
		require.Equal(t, domain.Height{Value: `6'2"`, Unit: domain.HeightFT}, creator.got.Height)

		var body map[string]any
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "uuid-1", body["id"])
		require.Equal(t, "jordan_miller", body["handle"])
		require.Equal(t, "2000-07-13", body["date_of_birth"])
		require.Equal(t, map[string]any{"value": `6'2"`, "unit": "FT"}, body["height"])
		require.Equal(t, []any{"WING", "FORWARD"}, body["positions"])
		require.Equal(t, "court-uuid-1", body["home_court_id"])
		require.Equal(t, "2026-08-01T12:00:00Z", body["created_at"])
	})

	t.Run("responds 400 on malformed json", func(t *testing.T) {
		// Setup + Exercise
		rec := serveCreatePlayer(t, &stubPlayerCreator{}, identity, `{"real_name":`)

		// Expectations
		require.Equal(t, http.StatusBadRequest, rec.Code)
		requireErrorCode(t, rec, "malformed_json")
	})

	t.Run("responds 401 when no identity is present", func(t *testing.T) {
		// Setup + Exercise
		rec := serveCreatePlayer(t, &stubPlayerCreator{}, nil, validBody)

		// Expectations
		require.Equal(t, http.StatusUnauthorized, rec.Code)
		requireErrorCode(t, rec, "unauthorized")
	})

	t.Run("responds 422 with field details on unparseable fields", func(t *testing.T) {
		cases := []struct {
			name  string
			body  string
			field string
		}{
			{"bad date format", strings.Replace(validBody, "2000-07-13", "13/07/2000", 1), "date_of_birth"},
			{"unknown position", strings.Replace(validBody, `"WING"`, `"COACH"`, 1), "positions"},
			{"bad height unit", strings.Replace(validBody, `"FT"`, `"IN"`, 1), "height"},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				creator := &stubPlayerCreator{}

				// Exercise
				rec := serveCreatePlayer(t, creator, identity, tc.body)

				// Expectations
				require.Equal(t, http.StatusUnprocessableEntity, rec.Code)
				requireFieldError(t, rec, tc.field)
			})
		}
	})

	t.Run("responds 422 with field details on validation errors", func(t *testing.T) {
		cases := []struct {
			name  string
			err   error
			field string
		}{
			{"invalid handle", domain.ErrInvalidHandle, "handle"},
			{"invalid real name", domain.ErrInvalidRealName, "real_name"},
			{"invalid date of birth", domain.ErrInvalidDateOfBirth, "date_of_birth"},
			{"invalid height", domain.ErrInvalidHeight, "height"},
			{"invalid positions", domain.ErrInvalidPositions, "positions"},
			{"missing home court", domain.ErrInvalidHomeCourt, "home_court_id"},
			{"unknown home court", domain.ErrCourtNotFound, "home_court_id"},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				creator := &stubPlayerCreator{err: tc.err}

				// Exercise
				rec := serveCreatePlayer(t, creator, identity, validBody)

				// Expectations
				require.Equal(t, http.StatusUnprocessableEntity, rec.Code)
				requireFieldError(t, rec, tc.field)
			})
		}
	})

	t.Run("responds 409 on conflicts", func(t *testing.T) {
		cases := []struct {
			name string
			err  error
			code string
		}{
			{"handle taken", domain.ErrHandleTaken, "handle_taken"},
			{"player exists", domain.ErrPlayerExists, "player_exists"},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				creator := &stubPlayerCreator{err: tc.err}

				// Exercise
				rec := serveCreatePlayer(t, creator, identity, validBody)

				// Expectations
				require.Equal(t, http.StatusConflict, rec.Code)
				requireErrorCode(t, rec, tc.code)
			})
		}
	})

	t.Run("responds 500 without leaking details on unexpected errors", func(t *testing.T) {
		// Setup
		creator := &stubPlayerCreator{err: errors.New("pq: connection reset by peer")}

		// Exercise
		rec := serveCreatePlayer(t, creator, identity, validBody)

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		requireErrorCode(t, rec, "internal")
		require.NotContains(t, rec.Body.String(), "connection reset")
	})
}

func requireFieldError(t *testing.T, rec *httptest.ResponseRecorder, field string) {
	t.Helper()
	var body struct {
		Error struct {
			Code   string            `json:"code"`
			Fields map[string]string `json:"fields"`
		} `json:"error"`
	}
	require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
	require.Equal(t, "validation_failed", body.Error.Code)
	require.Contains(t, body.Error.Fields, field)
}
