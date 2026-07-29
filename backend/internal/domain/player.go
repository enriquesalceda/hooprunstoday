package domain

import (
	"errors"
	"regexp"
	"strings"
	"time"
)

var (
	ErrInvalidClerkUserID = errors.New("clerk user id is required")
	ErrInvalidRealName    = errors.New("real name must be 1-80 characters")
	ErrInvalidHandle      = errors.New("handle must be 3-20 characters: a-z, 0-9, underscore")

	// Uniqueness conflicts surfaced by storage.
	ErrHandleTaken  = errors.New("handle is already taken")
	ErrPlayerExists = errors.New("player already exists for this clerk user")
)

var handlePattern = regexp.MustCompile(`^[a-z0-9_]{3,20}$`)

// Player is someone with a record on the platform. Identity (phone,
// sessions) lives in Clerk; the domain only knows the Clerk user id.
type Player struct {
	ID          string
	ClerkUserID string
	RealName    string
	Handle      string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// NewPlayer validates and normalizes: real name is trimmed, handle is
// lowercased (uniqueness is case-insensitive).
func NewPlayer(clerkUserID, realName, handle string) (Player, error) {
	if clerkUserID == "" {
		return Player{}, ErrInvalidClerkUserID
	}

	realName = strings.TrimSpace(realName)
	if realName == "" || len(realName) > 80 {
		return Player{}, ErrInvalidRealName
	}

	handle = strings.ToLower(handle)
	if !handlePattern.MatchString(handle) {
		return Player{}, ErrInvalidHandle
	}

	return Player{
		ClerkUserID: clerkUserID,
		RealName:    realName,
		Handle:      handle,
	}, nil
}
