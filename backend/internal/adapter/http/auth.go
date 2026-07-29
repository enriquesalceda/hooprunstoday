package http

import (
	"context"
	"net/http"
	"strings"
)

// Identity is the authenticated caller as this layer sees it.
type Identity struct {
	ClerkUserID string
}

// TokenVerifier validates a bearer token and resolves the caller.
// Implemented by infrastructure (Clerk JWKS); faked in tests.
type TokenVerifier interface {
	Verify(ctx context.Context, token string) (Identity, error)
}

type identityKey struct{}

// RequireAuth verifies "Authorization: Bearer <token>" and stores the
// Identity in the request context; otherwise responds 401.
func RequireAuth(verifier TokenVerifier, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, ok := bearerToken(r.Header.Get("Authorization"))
		if !ok {
			respondError(w, http.StatusUnauthorized, "unauthorized", "a bearer token is required")
			return
		}

		identity, err := verifier.Verify(r.Context(), token)
		if err != nil {
			respondError(w, http.StatusUnauthorized, "unauthorized", "invalid or expired token")
			return
		}

		next.ServeHTTP(w, r.WithContext(
			context.WithValue(r.Context(), identityKey{}, identity)))
	})
}

// IdentityFrom returns the authenticated Identity stored by RequireAuth.
func IdentityFrom(ctx context.Context) (Identity, bool) {
	identity, ok := ctx.Value(identityKey{}).(Identity)
	return identity, ok
}

func bearerToken(header string) (string, bool) {
	scheme, token, found := strings.Cut(header, " ")
	if !found || !strings.EqualFold(scheme, "Bearer") {
		return "", false
	}
	token = strings.TrimSpace(token)
	return token, token != ""
}
