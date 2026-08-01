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
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/checkhandle"
)

type stubHandleChecker struct {
	got checkhandle.Input
	out checkhandle.Output
	err error
}

func (s *stubHandleChecker) Execute(_ context.Context, in checkhandle.Input) (checkhandle.Output, error) {
	s.got = in
	return s.out, s.err
}

func serveCheckHandle(t *testing.T, checker *stubHandleChecker, handle string) *httptest.ResponseRecorder {
	t.Helper()
	handler := adapterhttp.NewCheckHandleHandler(checker, testLogger())
	mux := http.NewServeMux()
	mux.Handle("GET /api/v1/handles/{handle}", handler)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/v1/handles/"+handle, nil))
	return rec
}

func TestCheckHandleHandler(t *testing.T) {
	t.Run("reports availability", func(t *testing.T) {
		// Setup
		checker := &stubHandleChecker{out: checkhandle.Output{Handle: "jordan_miller", Available: true}}

		// Exercise
		rec := serveCheckHandle(t, checker, "Jordan_Miller")

		// Expectations
		require.Equal(t, http.StatusOK, rec.Code)
		require.Equal(t, "Jordan_Miller", checker.got.Handle)
		var body map[string]any
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "jordan_miller", body["handle"])
		require.Equal(t, true, body["available"])
	})

	t.Run("responds 422 for malformed handles", func(t *testing.T) {
		// Setup
		checker := &stubHandleChecker{err: domain.ErrInvalidHandle}

		// Exercise
		rec := serveCheckHandle(t, checker, "x")

		// Expectations
		require.Equal(t, http.StatusUnprocessableEntity, rec.Code)
		requireFieldError(t, rec, "handle")
	})

	t.Run("responds 500 on failures", func(t *testing.T) {
		// Setup
		checker := &stubHandleChecker{err: errors.New("boom")}

		// Exercise
		rec := serveCheckHandle(t, checker, "jordan_miller")

		// Expectations
		require.Equal(t, http.StatusInternalServerError, rec.Code)
		requireErrorCode(t, rec, "internal")
	})
}
