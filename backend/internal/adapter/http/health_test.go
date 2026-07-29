package http_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
	"github.com/stretchr/testify/require"
)

func TestHealth(t *testing.T) {
	t.Run("health endpoint returns ok status", func(t *testing.T) {
		// Setup
		req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
		rec := httptest.NewRecorder()

		// Exercise
		adapterhttp.Health(rec, req)

		// Expectations
		require.Equal(t, http.StatusOK, rec.Code)
		require.Equal(t, "application/json", rec.Header().Get("Content-Type"))

		var body map[string]string
		require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
		require.Equal(t, "ok", body["status"])
	})
}
