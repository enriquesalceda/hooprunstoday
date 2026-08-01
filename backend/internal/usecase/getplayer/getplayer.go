package getplayer

import (
	"context"
	"errors"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Input struct {
	ClerkUserID string
}

type Output struct {
	Player domain.Player
}

type PlayerFinder interface {
	FindByClerkUserID(ctx context.Context, clerkUserID string) (domain.Player, error)
}

type GetPlayer struct {
	finder PlayerFinder
}

func New(finder PlayerFinder) *GetPlayer {
	return &GetPlayer{finder: finder}
}

func (uc *GetPlayer) Execute(ctx context.Context, in Input) (Output, error) {
	if in.ClerkUserID == "" {
		return Output{}, domain.ErrInvalidClerkUserID
	}

	player, err := uc.finder.FindByClerkUserID(ctx, in.ClerkUserID)
	if err != nil {
		if errors.Is(err, domain.ErrPlayerNotFound) {
			return Output{}, err
		}
		return Output{}, fmt.Errorf("finding player: %w", err)
	}

	return Output{Player: player}, nil
}
