package http

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/getplayer"
)

type PlayerGetter interface {
	Execute(ctx context.Context, in getplayer.Input) (getplayer.Output, error)
}

// NewGetMeHandler handles GET /api/v1/players/me — the caller's own record.
func NewGetMeHandler(getter PlayerGetter, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		identity, ok := IdentityFrom(r.Context())
		if !ok {
			respondError(w, http.StatusUnauthorized, "unauthorized", "authentication required")
			return
		}

		out, err := getter.Execute(r.Context(), getplayer.Input{ClerkUserID: identity.ClerkUserID})
		if errors.Is(err, domain.ErrPlayerNotFound) {
			respondError(w, http.StatusNotFound, "player_not_found", "no record yet — create one")
			return
		}
		if err != nil {
			logger.Error("getting player", "clerk_user_id", identity.ClerkUserID, "error", err)
			respondError(w, http.StatusInternalServerError, "internal", "something went wrong")
			return
		}

		respondJSON(w, http.StatusOK, toPlayerResponse(out.Player))
	})
}
