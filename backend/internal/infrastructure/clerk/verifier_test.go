package clerk_test

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"math/big"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/require"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/clerk"
)

type jwksServer struct {
	*httptest.Server
	keys    map[string]*rsa.PrivateKey
	fetches atomic.Int64
}

func newJWKSServer(t *testing.T) *jwksServer {
	t.Helper()
	s := &jwksServer{keys: map[string]*rsa.PrivateKey{}}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /.well-known/jwks.json", func(w http.ResponseWriter, r *http.Request) {
		s.fetches.Add(1)
		type jwk struct {
			Kty string `json:"kty"`
			Kid string `json:"kid"`
			N   string `json:"n"`
			E   string `json:"e"`
		}
		var keys []jwk
		for kid, k := range s.keys {
			keys = append(keys, jwk{
				Kty: "RSA",
				Kid: kid,
				N:   base64.RawURLEncoding.EncodeToString(k.PublicKey.N.Bytes()),
				E:   base64.RawURLEncoding.EncodeToString(big.NewInt(int64(k.PublicKey.E)).Bytes()),
			})
		}
		w.Header().Set("Content-Type", "application/json")
		require.NoError(t, json.NewEncoder(w).Encode(map[string]any{"keys": keys}))
	})
	s.Server = httptest.NewServer(mux)
	t.Cleanup(s.Close)
	return s
}

func (s *jwksServer) addKey(t *testing.T, kid string) *rsa.PrivateKey {
	t.Helper()
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	require.NoError(t, err)
	s.keys[kid] = key
	return key
}

type tokenOpts struct {
	issuer  string
	subject string
	expires time.Time
}

func signRS256(t *testing.T, key *rsa.PrivateKey, kid string, opts tokenOpts) string {
	t.Helper()
	claims := jwt.RegisteredClaims{
		Issuer:    opts.issuer,
		Subject:   opts.subject,
		ExpiresAt: jwt.NewNumericDate(opts.expires),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token.Header["kid"] = kid
	signed, err := token.SignedString(key)
	require.NoError(t, err)
	return signed
}

func newVerifier(server *jwksServer) *clerk.Verifier {
	v := clerk.NewVerifier(server.URL, server.Client())
	v.RefreshCooldown = 0 // tests rotate keys instantly
	return v
}

func TestVerifier(t *testing.T) {
	ctx := context.Background()
	inAnHour := time.Now().Add(time.Hour)

	t.Run("accepts a valid token and returns the clerk user id", func(t *testing.T) {
		// Setup
		server := newJWKSServer(t)
		key := server.addKey(t, "kid_1")
		verifier := newVerifier(server)
		token := signRS256(t, key, "kid_1", tokenOpts{server.URL, "user_2abc", inAnHour})

		// Exercise
		identity, err := verifier.Verify(ctx, token)

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "user_2abc", identity.ClerkUserID)
	})

	t.Run("rejects bad tokens", func(t *testing.T) {
		// Setup
		server := newJWKSServer(t)
		key := server.addKey(t, "kid_1")
		verifier := newVerifier(server)

		cases := []struct {
			name  string
			token func(t *testing.T) string
		}{
			{"expired", func(t *testing.T) string {
				return signRS256(t, key, "kid_1", tokenOpts{server.URL, "user_2abc", time.Now().Add(-time.Hour)})
			}},
			{"wrong issuer", func(t *testing.T) string {
				return signRS256(t, key, "kid_1", tokenOpts{"https://evil.example.com", "user_2abc", inAnHour})
			}},
			{"empty subject", func(t *testing.T) string {
				return signRS256(t, key, "kid_1", tokenOpts{server.URL, "", inAnHour})
			}},
			{"no expiry", func(t *testing.T) string {
				claims := jwt.RegisteredClaims{Issuer: server.URL, Subject: "user_2abc"}
				token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
				token.Header["kid"] = "kid_1"
				signed, err := token.SignedString(key)
				require.NoError(t, err)
				return signed
			}},
			{"HS256 forgery signed with a public value", func(t *testing.T) string {
				claims := jwt.RegisteredClaims{
					Issuer: server.URL, Subject: "user_2abc",
					ExpiresAt: jwt.NewNumericDate(inAnHour),
				}
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
				token.Header["kid"] = "kid_1"
				signed, err := token.SignedString([]byte("guessable-secret"))
				require.NoError(t, err)
				return signed
			}},
			{"tampered payload", func(t *testing.T) string {
				good := signRS256(t, key, "kid_1", tokenOpts{server.URL, "user_2abc", inAnHour})
				forged := jwt.RegisteredClaims{
					Issuer: server.URL, Subject: "user_admin",
					ExpiresAt: jwt.NewNumericDate(inAnHour),
				}
				payload, err := json.Marshal(forged)
				require.NoError(t, err)
				parts := []byte(good)
				first := 0
				for i, c := range parts {
					if c == '.' {
						first = i
						break
					}
				}
				rest := parts[first+1:]
				second := 0
				for i, c := range rest {
					if c == '.' {
						second = i
						break
					}
				}
				return string(parts[:first+1]) +
					base64.RawURLEncoding.EncodeToString(payload) +
					string(rest[second:])
			}},
			{"garbage", func(t *testing.T) string { return "not.a.jwt" }},
		}

		for _, tc := range cases {
			t.Run(tc.name, func(t *testing.T) {
				// Exercise
				_, err := verifier.Verify(ctx, tc.token(t))

				// Expectations
				require.Error(t, err)
			})
		}
	})

	t.Run("refetches the JWKS when a token carries an unknown kid", func(t *testing.T) {
		// Setup
		server := newJWKSServer(t)
		server.addKey(t, "kid_old")
		verifier := newVerifier(server)
		old := signRS256(t, server.keys["kid_old"], "kid_old", tokenOpts{server.URL, "user_2abc", inAnHour})
		_, err := verifier.Verify(ctx, old)
		require.NoError(t, err)
		require.Equal(t, int64(1), server.fetches.Load())

		// Exercise: rotate keys, present a token signed by the new key
		rotated := server.addKey(t, "kid_new")
		token := signRS256(t, rotated, "kid_new", tokenOpts{server.URL, "user_2abc", inAnHour})
		identity, err := verifier.Verify(ctx, token)

		// Expectations
		require.NoError(t, err)
		require.Equal(t, "user_2abc", identity.ClerkUserID)
		require.Equal(t, int64(2), server.fetches.Load(), "unknown kid triggers one refetch")
	})

	t.Run("does not refetch for a kid that stays unknown within the cooldown", func(t *testing.T) {
		// Setup
		server := newJWKSServer(t)
		key := server.addKey(t, "kid_1")
		verifier := clerk.NewVerifier(server.URL, server.Client())
		verifier.RefreshCooldown = time.Hour
		good := signRS256(t, key, "kid_1", tokenOpts{server.URL, "user_2abc", inAnHour})
		_, err := verifier.Verify(ctx, good)
		require.NoError(t, err)

		// Exercise: unknown kid, cooldown not elapsed
		unknownKey, err := rsa.GenerateKey(rand.Reader, 2048)
		require.NoError(t, err)
		bad := signRS256(t, unknownKey, "kid_ghost", tokenOpts{server.URL, "user_2abc", inAnHour})
		_, err = verifier.Verify(ctx, bad)

		// Expectations
		require.Error(t, err)
		require.Equal(t, int64(1), server.fetches.Load(), "cooldown suppresses refetch")
	})
}
