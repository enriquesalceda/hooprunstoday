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
)

type stubVerifier struct {
	identity adapterhttp.Identity
	err      error
	gotToken string
}

func (s *stubVerifier) Verify(_ context.Context, token string) (adapterhttp.Identity, error) {
	s.gotToken = token
	return s.identity, s.err
}

func TestRequireAuth(t *testing.T) {
	t.Run("passes the bearer token to the verifier and exposes the identity", func(t *testing.T) {
		// Setup
		verifier := &stubVerifier{identity: adapterhttp.Identity{ClerkUserID: "user_2abc"}}
		var seen adapterhttp.Identity
		next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id, ok := adapterhttp.IdentityFrom(r.Context())
			require.True(t, ok)
			seen = id
			w.WriteHeader(http.StatusOK)
		})
		req := httptest.NewRequest(http.MethodPost, "/api/v1/players", nil)
		req.Header.Set("Authorization", "Bearer tok_123")
		rec := httptest.NewRecorder()

		// Exercise
		adapterhttp.RequireAuth(verifier, next).ServeHTTP(rec, req)

		// Expectations
		require.Equal(t, http.StatusOK, rec.Code)
		require.Equal(t, "tok_123", verifier.gotToken)
		require.Equal(t, "user_2abc", seen.ClerkUserID)
	})

	t.Run("rejects requests without a usable bearer token", func(t *testing.T) {
		cases := []struct {
			name   string
			header string
		}{
			{"missing header", ""},
			{"not a bearer scheme", "Basic abc123"},
			{"bearer with empty token", "Bearer "},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Setup
				verifier := &stubVerifier{}
				next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					t.Fatal("next handler must not run")
				})
				req := httptest.NewRequest(http.MethodPost, "/api/v1/players", nil)
				if tc.header != "" {
					req.Header.Set("Authorization", tc.header)
				}
				rec := httptest.NewRecorder()

				// Exercise
				adapterhttp.RequireAuth(verifier, next).ServeHTTP(rec, req)

				// Expectations
				require.Equal(t, http.StatusUnauthorized, rec.Code)
				requireErrorCode(t, rec, "unauthorized")
			})
		}
	})

	t.Run("rejects tokens the verifier refuses", func(t *testing.T) {
		// Setup
		verifier := &stubVerifier{err: errors.New("expired")}
		next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			t.Fatal("next handler must not run")
		})
		req := httptest.NewRequest(http.MethodPost, "/api/v1/players", nil)
		req.Header.Set("Authorization", "Bearer bad_token")
		rec := httptest.NewRecorder()

		// Exercise
		adapterhttp.RequireAuth(verifier, next).ServeHTTP(rec, req)

		// Expectations
		require.Equal(t, http.StatusUnauthorized, rec.Code)
		requireErrorCode(t, rec, "unauthorized")
	})

	t.Run("identity is absent outside an authenticated request", func(t *testing.T) {
		// Exercise
		_, ok := adapterhttp.IdentityFrom(context.Background())

		// Expectations
		require.False(t, ok)
	})
}

func requireErrorCode(t *testing.T, rec *httptest.ResponseRecorder, want string) {
	t.Helper()
	require.Equal(t, "application/json", rec.Header().Get("Content-Type"))
	var body struct {
		Error struct {
			Code    string `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}
	require.NoError(t, json.NewDecoder(rec.Body).Decode(&body))
	require.Equal(t, want, body.Error.Code)
	require.NotEmpty(t, body.Error.Message)
}
