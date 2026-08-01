package listcourts

import (
	"context"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Output struct {
	Courts []domain.Court
}

type CourtStore interface {
	List(ctx context.Context) ([]domain.Court, error)
}

type ListCourts struct {
	store CourtStore
}

func New(store CourtStore) *ListCourts {
	return &ListCourts{store: store}
}

func (uc *ListCourts) Execute(ctx context.Context) (Output, error) {
	courts, err := uc.store.List(ctx)
	if err != nil {
		return Output{}, fmt.Errorf("listing courts: %w", err)
	}
	return Output{Courts: courts}, nil
}
