package createlead

import (
	"context"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Input struct {
	Name    string
	Method  domain.ContactMethod
	Contact string
}

type Output struct {
	Lead domain.Lead
}

// LeadStore persists leads. Save is idempotent on the normalized contact:
// resubmitting the same contact returns the stored record, never an error.
type LeadStore interface {
	Save(ctx context.Context, l domain.Lead) (domain.Lead, error)
}

type CreateLead struct {
	store LeadStore
}

func New(store LeadStore) *CreateLead {
	return &CreateLead{store: store}
}

func (uc *CreateLead) Execute(ctx context.Context, in Input) (Output, error) {
	lead, err := domain.NewLead(domain.LeadParams{
		Name:    in.Name,
		Method:  in.Method,
		Contact: in.Contact,
	})
	if err != nil {
		return Output{}, err
	}

	stored, err := uc.store.Save(ctx, lead)
	if err != nil {
		return Output{}, fmt.Errorf("saving lead: %w", err)
	}

	return Output{Lead: stored}, nil
}
