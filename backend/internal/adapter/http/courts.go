package http

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/listcourts"
)

type CourtLister interface {
	Execute(ctx context.Context) (listcourts.Output, error)
}

type courtResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CourtType string `json:"court_type"`
}

// NewListCourtsHandler handles GET /api/v1/courts. Public: the directory
// is not sensitive and the record screen needs it.
func NewListCourtsHandler(lister CourtLister, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		out, err := lister.Execute(r.Context())
		if err != nil {
			logger.Error("listing courts", "error", err)
			respondError(w, http.StatusInternalServerError, "internal", "something went wrong")
			return
		}

		courts := make([]courtResponse, len(out.Courts))
		for i, c := range out.Courts {
			courts[i] = courtResponse{ID: c.ID, Name: c.Name, CourtType: string(c.Type)}
		}
		respondJSON(w, http.StatusOK, map[string][]courtResponse{"courts": courts})
	})
}
