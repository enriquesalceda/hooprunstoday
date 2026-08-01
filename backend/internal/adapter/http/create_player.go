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

type heightPayload struct {
	Value string `json:"value"`
	Unit  string `json:"unit"`
}

type createPlayerRequest struct {
	RealName    string        `json:"real_name"`
	Handle      string        `json:"handle"`
	DateOfBirth string        `json:"date_of_birth"` // YYYY-MM-DD
	Height      heightPayload `json:"height"`
	Positions   []string      `json:"positions"`
	HomeCourtID string        `json:"home_court_id"`
}

type playerResponse struct {
	ID          string        `json:"id"`
	ClerkUserID string        `json:"clerk_user_id"`
	RealName    string        `json:"real_name"`
	Handle      string        `json:"handle"`
	DateOfBirth string        `json:"date_of_birth"`
	Height      heightPayload `json:"height"`
	Positions   []string      `json:"positions"`
	HomeCourtID string        `json:"home_court_id"`
	CreatedAt   string        `json:"created_at"`
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

		in, fields := parseCreatePlayerRequest(identity, req)
		if len(fields) > 0 {
			respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
				"some fields are invalid", fields)
			return
		}

		out, err := creator.Execute(r.Context(), in)
		if err != nil {
			respondCreatePlayerError(w, logger, identity, err)
			return
		}

		respondJSON(w, http.StatusCreated, toPlayerResponse(out.Player))
	})
}

func parseCreatePlayerRequest(identity Identity, req createPlayerRequest) (createplayer.Input, map[string]string) {
	fields := map[string]string{}

	var dob time.Time
	if req.DateOfBirth != "" {
		parsed, err := time.Parse("2006-01-02", req.DateOfBirth)
		if err != nil {
			fields["date_of_birth"] = "use the format YYYY-MM-DD"
		}
		dob = parsed
	}

	unit, err := domain.ParseHeightUnit(req.Height.Unit)
	if err != nil && req.Height.Unit != "" {
		fields["height"] = "unit must be FT or CM"
	}

	positions := make([]domain.Position, 0, len(req.Positions))
	for _, s := range req.Positions {
		p, err := domain.ParsePosition(s)
		if err != nil {
			fields["positions"] = "unknown position: " + s
			break
		}
		positions = append(positions, p)
	}

	return createplayer.Input{
		ClerkUserID: identity.ClerkUserID,
		RealName:    req.RealName,
		Handle:      req.Handle,
		DateOfBirth: dob,
		Height:      domain.Height{Value: req.Height.Value, Unit: unit},
		Positions:   positions,
		HomeCourtID: req.HomeCourtID,
	}, fields
}

func toPlayerResponse(p domain.Player) playerResponse {
	positions := make([]string, len(p.Positions))
	for i, pos := range p.Positions {
		positions[i] = string(pos)
	}
	return playerResponse{
		ID:          p.ID,
		ClerkUserID: p.ClerkUserID,
		RealName:    p.RealName,
		Handle:      p.Handle,
		DateOfBirth: p.DateOfBirth.Format("2006-01-02"),
		Height:      heightPayload{Value: p.Height.Value, Unit: string(p.Height.Unit)},
		Positions:   positions,
		HomeCourtID: p.HomeCourtID,
		CreatedAt:   p.CreatedAt.UTC().Format(time.RFC3339),
	}
}

func respondCreatePlayerError(w http.ResponseWriter, logger *slog.Logger, identity Identity, err error) {
	validation := map[string]error{
		"real_name":     domain.ErrInvalidRealName,
		"handle":        domain.ErrInvalidHandle,
		"date_of_birth": domain.ErrInvalidDateOfBirth,
		"height":        domain.ErrInvalidHeight,
		"positions":     domain.ErrInvalidPositions,
	}
	for field, sentinel := range validation {
		if errors.Is(err, sentinel) {
			respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
				"some fields are invalid", map[string]string{field: sentinel.Error()})
			return
		}
	}

	switch {
	case errors.Is(err, domain.ErrInvalidHomeCourt), errors.Is(err, domain.ErrCourtNotFound):
		respondFieldErrors(w, http.StatusUnprocessableEntity, "validation_failed",
			"some fields are invalid", map[string]string{"home_court_id": "pick a court from the directory"})
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
