package http

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createlead"
)

// LeadCreator is the slice of the use case this handler needs.
type LeadCreator interface {
	Execute(ctx context.Context, in createlead.Input) (createlead.Output, error)
}

type createLeadRequest struct {
	Name          string `json:"name"`
	ContactMethod string `json:"contact_method"`
	Contact       string `json:"contact"`
}

type leadResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	ContactMethod string `json:"contact_method"`
	Contact       string `json:"contact"`
	CreatedAt     string `json:"created_at"`
}

// NewCreateLeadHandler handles POST /api/v1/leads. Public: the landing page
// waitlist has no account to authenticate. The domain validates and the store
// dedupes on contact, so replays are harmless.
func NewCreateLeadHandler(creator LeadCreator, logger *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req createLeadRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			respondError(w, http.StatusBadRequest, "malformed_json", "request body is not valid JSON")
			return
		}

		out, err := creator.Execute(r.Context(), createlead.Input{
			Name:    req.Name,
			Method:  domain.ContactMethod(req.ContactMethod),
			Contact: req.Contact,
		})
		if err != nil {
			respondCreateLeadError(w, logger, req, err)
			return
		}

		respondJSON(w, http.StatusCreated, leadResponse{
			ID:            out.Lead.ID,
			Name:          out.Lead.Name,
			ContactMethod: string(out.Lead.Method),
			Contact:       out.Lead.Contact,
			CreatedAt:     out.Lead.CreatedAt.UTC().Format(time.RFC3339),
		})
	})
}

func respondCreateLeadError(w http.ResponseWriter, logger *slog.Logger, req createLeadRequest, err error) {
	validation := map[string]error{
		"name":           domain.ErrInvalidLeadName,
		"contact_method": domain.ErrInvalidContactMethod,
		"contact":        domain.ErrInvalidLeadContact,
	}
	for field, sentinel := range validation {
		if errors.Is(err, sentinel) {
			respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
				"some fields are invalid", map[string]string{field: sentinel.Error()})
			return
		}
	}

	logger.Error("creating lead",
		"contact_method", req.ContactMethod, "name_len", len(req.Name),
		"contact_len", len(req.Contact), "error", err)
	respondError(w, http.StatusInternalServerError, "internal", "something went wrong")
}
