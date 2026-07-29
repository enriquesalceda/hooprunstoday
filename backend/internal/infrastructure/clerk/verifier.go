// Package clerk verifies Clerk session JWTs against the instance's public
// JWKS. No Clerk secret is needed: the JWKS endpoint is public.
package clerk

import (
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
)

var errUnknownKey = errors.New("token signed by an unknown key")

type Verifier struct {
	issuer string
	client *http.Client

	// RefreshCooldown bounds how often an unknown kid may trigger a JWKS
	// refetch, so garbage tokens can't hammer the endpoint.
	RefreshCooldown time.Duration

	mu        sync.Mutex
	keys      map[string]*rsa.PublicKey
	lastFetch time.Time
}

func NewVerifier(issuer string, client *http.Client) *Verifier {
	return &Verifier{
		issuer:          issuer,
		client:          client,
		RefreshCooldown: 30 * time.Second,
		keys:            map[string]*rsa.PublicKey{},
	}
}

// Verify parses and validates an RS256 session token: signature against the
// JWKS, issuer, mandatory expiry (10s leeway), non-empty subject.
func (v *Verifier) Verify(ctx context.Context, token string) (adapterhttp.Identity, error) {
	parsed, err := jwt.ParseWithClaims(token, &jwt.RegisteredClaims{},
		func(t *jwt.Token) (any, error) { return v.keyFor(ctx, t) },
		jwt.WithValidMethods([]string{"RS256"}),
		jwt.WithIssuer(v.issuer),
		jwt.WithExpirationRequired(),
		jwt.WithLeeway(10*time.Second),
	)
	if err != nil {
		return adapterhttp.Identity{}, fmt.Errorf("verifying token: %w", err)
	}

	claims, ok := parsed.Claims.(*jwt.RegisteredClaims)
	if !ok || claims.Subject == "" {
		return adapterhttp.Identity{}, errors.New("token has no subject")
	}

	return adapterhttp.Identity{ClerkUserID: claims.Subject}, nil
}

func (v *Verifier) keyFor(ctx context.Context, token *jwt.Token) (*rsa.PublicKey, error) {
	kid, _ := token.Header["kid"].(string)
	if kid == "" {
		return nil, errors.New("token has no kid header")
	}

	v.mu.Lock()
	defer v.mu.Unlock()

	if key, ok := v.keys[kid]; ok {
		return key, nil
	}

	if !v.lastFetch.IsZero() && time.Since(v.lastFetch) < v.RefreshCooldown {
		return nil, errUnknownKey
	}
	if err := v.fetchLocked(ctx); err != nil {
		return nil, err
	}

	if key, ok := v.keys[kid]; ok {
		return key, nil
	}
	return nil, errUnknownKey
}

func (v *Verifier) fetchLocked(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet,
		v.issuer+"/.well-known/jwks.json", nil)
	if err != nil {
		return fmt.Errorf("building jwks request: %w", err)
	}

	res, err := v.client.Do(req)
	if err != nil {
		return fmt.Errorf("fetching jwks: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("fetching jwks: status %d", res.StatusCode)
	}

	var doc struct {
		Keys []struct {
			Kty string `json:"kty"`
			Kid string `json:"kid"`
			N   string `json:"n"`
			E   string `json:"e"`
		} `json:"keys"`
	}
	if err := json.NewDecoder(res.Body).Decode(&doc); err != nil {
		return fmt.Errorf("decoding jwks: %w", err)
	}

	keys := map[string]*rsa.PublicKey{}
	for _, k := range doc.Keys {
		if k.Kty != "RSA" || k.Kid == "" {
			continue
		}
		n, err := base64.RawURLEncoding.DecodeString(k.N)
		if err != nil {
			continue
		}
		e, err := base64.RawURLEncoding.DecodeString(k.E)
		if err != nil {
			continue
		}
		keys[k.Kid] = &rsa.PublicKey{
			N: new(big.Int).SetBytes(n),
			E: int(new(big.Int).SetBytes(e).Int64()),
		}
	}

	v.keys = keys
	v.lastFetch = time.Now()
	return nil
}
