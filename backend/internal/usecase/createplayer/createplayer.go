package createplayer

import (
	"context"
	"fmt"
	"time"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Input struct {
	ClerkUserID string
	RealName    string
	Handle      string
	DateOfBirth time.Time
	Height      domain.Height
	Positions   []domain.Position
	HomeCourtID string
}

type Output struct {
	Player domain.Player
}

// PlayerStore persists players. Save returns the stored record with
// database-populated fields (id, timestamps).
type PlayerStore interface {
	Save(ctx context.Context, p domain.Player) (domain.Player, error)
}

type Clock interface {
	Now() time.Time
}

type CreatePlayer struct {
	store PlayerStore
	clock Clock
}

func New(store PlayerStore, clock Clock) *CreatePlayer {
	return &CreatePlayer{store: store, clock: clock}
}

func (uc *CreatePlayer) Execute(ctx context.Context, in Input) (Output, error) {
	player, err := domain.NewPlayer(domain.PlayerParams{
		ClerkUserID: in.ClerkUserID,
		RealName:    in.RealName,
		Handle:      in.Handle,
		DateOfBirth: in.DateOfBirth,
		Height:      in.Height,
		Positions:   in.Positions,
		HomeCourtID: in.HomeCourtID,
	}, uc.clock.Now())
	if err != nil {
		return Output{}, err
	}

	stored, err := uc.store.Save(ctx, player)
	if err != nil {
		return Output{}, fmt.Errorf("saving player: %w", err)
	}

	return Output{Player: stored}, nil
}
