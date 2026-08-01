package http

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/checkhandle"
)

type HandleChecker interface {
	Execute(ctx context.Context, in checkhandle.Input) (checkhandle.Output, error)
}

// NewCheckHandleHandler handles GET /api/v1/handles/{handle} — the live
// availability check behind the record screen's 600ms debounce.
func NewCheckHandleHandler(checker HandleChecker, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		out, err := checker.Execute(r.Context(), checkhandle.Input{Handle: r.PathValue("handle")})
		if errors.Is(err, domain.ErrInvalidHandle) {
			respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
				"some fields are invalid", map[string]string{"handle": domain.ErrInvalidHandle.Error()})
			return
		}
		if err != nil {
			logger.Error("checking handle", "error", err)
			respondError(w, http.StatusInternalServerError, "internal", "something went wrong")
			return
		}

		respondJSON(w, http.StatusOK, map[string]any{
			"handle":    out.Handle,
			"available": out.Available,
		})
	})
}
