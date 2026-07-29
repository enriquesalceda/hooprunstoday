package createplayer

import (
	"context"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Input struct {
	ClerkUserID string
	RealName    string
	Handle      string
}

type Output struct {
	Player domain.Player
}

// PlayerStore persists players. Save returns the stored record with
// database-populated fields (id, timestamps).
type PlayerStore interface {
	Save(ctx context.Context, p domain.Player) (domain.Player, error)
}

type CreatePlayer struct {
	store PlayerStore
}

func New(store PlayerStore) *CreatePlayer {
	return &CreatePlayer{store: store}
}

func (uc *CreatePlayer) Execute(ctx context.Context, in Input) (Output, error) {
	player, err := domain.NewPlayer(in.ClerkUserID, in.RealName, in.Handle)
	if err != nil {
		return Output{}, err
	}

	stored, err := uc.store.Save(ctx, player)
	if err != nil {
		return Output{}, fmt.Errorf("saving player: %w", err)
	}

	return Output{Player: stored}, nil
}
