package http_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/getplayer"
)

type stubPlayerGetter struct {
	got getplayer.Input
	out getplayer.Output
	err error
}

func (s *stubPlayerGetter) Execute(_ context.Context, in getplayer.Input) (getplayer.Output, error) {
	s.got = in
	return s.out, s.err
}

func serveGetMe(t *testing.T, getter *stubPlayerGetter, authed bool) *httptest.ResponseRecorder {
	t.Helper()
	handler := adapterhttp.NewGetMeHandler(getter, testLogger())
	req := httptest.NewRequest(http.MethodGet, "/api/v1/players/me", nil)
	rec := httptest.NewRecorder()
	if authed {
		verifier := &stubVerifier{identity: adapterhttp.Identity{ClerkUserID: "user_2abc"}}
		req.Header.Set("Authorization", "Bearer tok")
		adapterhttp.RequireAuth(verifier, handler).ServeHTTP(rec, req)
		return rec
	}
	handler.ServeHTTP(rec, req)
	return rec
}

func TestGetMeHandler(t *testing.T) {
	t.Run("returns the caller's record", func(t *testing.T) {
		// Setup
		getter := &stubPlayerGetter{out: getplayer.Output{Player: domain.Player{
			ID: "uuid-1", ClerkUserID: "user_2abc", RealName: "Jordan Miller",
			Handle:      "jordan_miller",
			DateOfBirth: time.Date(2000, 7, 13, 0, 0, 0, 0, time.UTC),
			Height:      domain.Height{Value: `6'2"`, Unit: domain.HeightFT},
			Positions:   []domain.Position{domain.PositionWing},
			HomeCourtID: "court-1",
			CreatedAt:   time.Date(2026, 8, 1, 12, 0, 0, 0, time.UTC),
		}}}

		// Exercise
		rec := serveGetMe(t, getter, true)

		// Expectations
		require.Equal(t, http.StatusOK, rec.Code)
		require.Equal(t, "user_2abc", getter.got.ClerkUserID)
		var body map[string]any
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "jordan_miller", body["handle"])
		require.Equal(t, "2000-07-13", body["date_of_birth"])
		require.Equal(t, []any{"WING"}, body["positions"])
	})

	t.Run("responds 404 when no record exists", func(t *testing.T) {
		// Setup
		getter := &stubPlayerGetter{err: domain.ErrPlayerNotFound}

		// Exercise
		rec := serveGetMe(t, getter, true)

		// Expectations
		require.Equal(t, http.StatusNotFound, rec.Code)
		requireErrorCode(t, rec, "player_not_found")
	})

	t.Run("responds 401 without identity", func(t *testing.T) {
		// Setup + Exercise
		rec := serveGetMe(t, &stubPlayerGetter{}, false)

		// Expectations
		require.Equal(t, http.StatusUnauthorized, rec.Code)
		requireErrorCode(t, rec, "unauthorized")
	})

	t.Run("responds 500 on failures", func(t *testing.T) {
		// Setup
		getter := &stubPlayerGetter{err: errors.New("boom")}

		// Exercise
		rec := serveGetMe(t, getter, true)

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		requireErrorCode(t, rec, "internal")
	})
}
