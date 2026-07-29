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
		created := time.Date(2026, 7, 29, 12, 0, 0, 0, time.UTC)
		creator := &stubPlayerCreator{out: createplayer.Output{Player: domain.Player{
			ID: "uuid-1", ClerkUserID: "user_2abc", RealName: "Jordan Miller",
			Handle: "jordan_miller", CreatedAt: created,
		}}}

		// Exercise
		rec := serveCreatePlayer(t, creator, identity,
			`{"real_name":"Jordan Miller","handle":"Jordan_Miller"}`)

		// Expectations
		require.Equal(t, http.StatusCreated, rec.Code)
		require.Equal(t, "user_2abc", creator.got.ClerkUserID,
			"clerk user id must come from the verified token, not the body")

		var body map[string]string
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "uuid-1", body["id"])
		require.Equal(t, "user_2abc", body["clerk_user_id"])
		require.Equal(t, "Jordan Miller", body["real_name"])
		require.Equal(t, "jordan_miller", body["handle"])
		require.Equal(t, "2026-07-29T12:00:00Z", body["created_at"])
	})

	t.Run("ignores a clerk_user_id smuggled into the body", func(t *testing.T) {
		// Setup
		creator := &stubPlayerCreator{}

		// Exercise
		serveCreatePlayer(t, creator, identity,
			`{"real_name":"J","handle":"jordan","clerk_user_id":"user_forged"}`)

		// Expectations
		require.Equal(t, "user_2abc", creator.got.ClerkUserID)
	})

	t.Run("responds 400 on malformed json", func(t *testing.T) {
		// Setup + Exercise
		rec := serveCreatePlayer(t, &stubPlayerCreator{}, identity, `{"real_name":`)

		// Expectations
		require.Equal(t, http.StatusBadRequest, rec.Code)
		requireErrorCode(t, rec, "malformed_json")
	})

	t.Run("responds 401 when no identity is present", func(t *testing.T) {
		// Setup + Exercise (handler mounted without middleware)
		rec := serveCreatePlayer(t, &stubPlayerCreator{}, nil,
			`{"real_name":"Jordan","handle":"jordan"}`)

		// Expectations
		require.Equal(t, http.StatusUnauthorized, rec.Code)
		requireErrorCode(t, rec, "unauthorized")
	})

	t.Run("responds 422 with field details on validation errors", func(t *testing.T) {
		cases := []struct {
			name  string
			err   error
			field string
		}{
			{"invalid handle", domain.ErrInvalidHandle, "handle"},
			{"invalid real name", domain.ErrInvalidRealName, "real_name"},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				creator := &stubPlayerCreator{err: tc.err}

				// Exercise
				rec := serveCreatePlayer(t, creator, identity,
					`{"real_name":"Jordan","handle":"jordan"}`)

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
				rec := serveCreatePlayer(t, creator, identity,
					`{"real_name":"Jordan","handle":"jordan"}`)

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
		rec := serveCreatePlayer(t, creator, identity,
			`{"real_name":"Jordan","handle":"jordan"}`)

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		requireErrorCode(t, rec, "internal")
		require.NotContains(t, rec.Body.String(), "connection reset",
			"internal error details must not leak to clients")
	})
}
