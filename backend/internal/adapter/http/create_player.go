package http

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createplayer"
)

// PlayerCreator is the slice of the use case this handler needs.
type PlayerCreator interface {
	Execute(ctx context.Context, in createplayer.Input) (createplayer.Output, error)
}

type createPlayerRequest struct {
	RealName string `json:"real_name"`
	Handle   string `json:"handle"`
}

type playerResponse struct {
	ID          string `json:"id"`
	ClerkUserID string `json:"clerk_user_id"`
	RealName    string `json:"real_name"`
	Handle      string `json:"handle"`
	CreatedAt   string `json:"created_at"`
}

// NewCreatePlayerHandler handles POST /api/v1/players. The clerk user id
// comes exclusively from the authenticated Identity, never the body.
func NewCreatePlayerHandler(creator PlayerCreator, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		identity, ok := IdentityFrom(r.Context())
		if !ok {
			respondError(w, http.StatusUnauthorized, "unauthorized", "authentication required")
			return
		}

		var req createPlayerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			respondError(w, http.StatusBadRequest, "malformed_json", "request body is not valid JSON")
			return
		}

		out, err := creator.Execute(r.Context(), createplayer.Input{
			ClerkUserID: identity.ClerkUserID,
			RealName:    req.RealName,
			Handle:      req.Handle,
		})
		if err != nil {
			respondCreatePlayerError(w, logger, identity, err)
			return
		}

		respondJSON(w, http.StatusCreated, playerResponse{
			ID:          out.Player.ID,
			ClerkUserID: out.Player.ClerkUserID,
			RealName:    out.Player.RealName,
			Handle:      out.Player.Handle,
			CreatedAt:   out.Player.CreatedAt.UTC().Format(time.RFC3339),
		})
	})
}

func respondCreatePlayerError(w http.ResponseWriter, logger *slog.Logger, identity Identity, err error) {
	switch {
	case errors.Is(err, domain.ErrInvalidRealName):
		respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
			"some fields are invalid", map[string]string{"real_name": domain.ErrInvalidRealName.Error()})
	case errors.Is(err, domain.ErrInvalidHandle):
		respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
			"some fields are invalid", map[string]string{"handle": domain.ErrInvalidHandle.Error()})
	case errors.Is(err, domain.ErrInvalidClerkUserID):
		respondError(w, http.StatusUnauthorized, "unauthorized", "authentication required")
	case errors.Is(err, domain.ErrHandleTaken):
		respondError(w, http.StatusConflict, "handle_taken", "that handle is already claimed")
	case errors.Is(err, domain.ErrPlayerExists):
		respondError(w, http.StatusConflict, "player_exists", "a record already exists for this account")
	default:
		logger.Error("creating player", "clerk_user_id", identity.ClerkUserID, "error", err)
		respondError(w, http.StatusInternalServerError, "internal", "something went wrong")
	}
}
