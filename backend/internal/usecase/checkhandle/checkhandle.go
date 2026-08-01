package checkhandle

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

var handlePattern = regexp.MustCompile(`^[a-z0-9_]{3,20}$`)

type Input struct {
	Handle string
}

type Output struct {
	Handle    string
	Available bool
}

type HandleStore interface {
	HandleTaken(ctx context.Context, handle string) (bool, error)
}

type CheckHandle struct {
	store HandleStore
}

func New(store HandleStore) *CheckHandle {
	return &CheckHandle{store: store}
}

func (uc *CheckHandle) Execute(ctx context.Context, in Input) (Output, error) {
	handle := strings.ToLower(in.Handle)
	if !handlePattern.MatchString(handle) {
		return Output{}, domain.ErrInvalidHandle
	}

	taken, err := uc.store.HandleTaken(ctx, handle)
	if err != nil {
		return Output{}, fmt.Errorf("checking handle: %w", err)
	}

	return Output{Handle: handle, Available: !taken}, nil
}
