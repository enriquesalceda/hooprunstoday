package http_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/listcourts"
)

type stubCourtLister struct {
	out listcourts.Output
	err error
}

func (s *stubCourtLister) Execute(_ context.Context) (listcourts.Output, error) {
	return s.out, s.err
}

func TestListCourtsHandler(t *testing.T) {
	t.Run("responds with the directory", func(t *testing.T) {
		// Setup
		lister := &stubCourtLister{out: listcourts.Output{Courts: []domain.Court{
			{ID: "c1", Name: "PRINCE ALFRED PARK", Type: domain.CourtOutdoor},
		}}}
		rec := httptest.NewRecorder()

		// Exercise
		adapterhttp.NewListCourtsHandler(lister, testLogger()).
			ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/v1/courts", nil))

		// Expectations
		require.Equal(t, http.StatusOK, rec.Code)
		var body struct {
			Courts []map[string]string `json:"courts"`
		}
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Len(t, body.Courts, 1)
		require.Equal(t, "c1", body.Courts[0]["id"])
		require.Equal(t, "PRINCE ALFRED PARK", body.Courts[0]["name"])
		require.Equal(t, "OUTDOOR", body.Courts[0]["court_type"])
	})

	t.Run("responds 500 on failures", func(t *testing.T) {
		// Setup
		lister := &stubCourtLister{err: errors.New("boom")}
		rec := httptest.NewRecorder()

		// Exercise
		adapterhttp.NewListCourtsHandler(lister, testLogger()).
			ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/v1/courts", nil))

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		requireErrorCode(t, rec, "internal")
	})
}
