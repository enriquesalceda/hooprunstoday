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
	ErrInvalidDateOfBirth = errors.New("date of birth must be a past date within a lifetime")
	ErrInvalidHeight      = errors.New("height must be 1-10 characters with unit FT or CM")
	ErrInvalidPositions   = errors.New("positions must be one or more distinct court positions")
	ErrInvalidHomeCourt   = errors.New("home court is required")

	// Conflicts and absences surfaced by storage.
	ErrHandleTaken    = errors.New("handle is already taken")
	ErrPlayerExists   = errors.New("player already exists for this clerk user")
	ErrCourtNotFound  = errors.New("home court does not exist")
	ErrPlayerNotFound = errors.New("no player record for this clerk user")
)

var handlePattern = regexp.MustCompile(`^[a-z0-9_]{3,20}$`)

type Position string

const (
	PositionPointGuard    Position = "POINT GUARD"
	PositionShootingGuard Position = "SHOOTING GUARD"
	PositionWing          Position = "WING"
	PositionForward       Position = "FORWARD"
	PositionCenter        Position = "CENTER"
)

var allPositions = []Position{
	PositionPointGuard, PositionShootingGuard, PositionWing, PositionForward, PositionCenter,
}

func ParsePosition(s string) (Position, error) {
	for _, p := range allPositions {
		if string(p) == s {
			return p, nil
		}
	}
	return "", ErrInvalidPositions
}

type HeightUnit string

const (
	HeightFT HeightUnit = "FT"
	HeightCM HeightUnit = "CM"
)

func ParseHeightUnit(s string) (HeightUnit, error) {
	switch HeightUnit(s) {
	case HeightFT, HeightCM:
		return HeightUnit(s), nil
	}
	return "", ErrInvalidHeight
}

type Height struct {
	Value string
	Unit  HeightUnit
}

// Player is someone with a record on the platform. Identity (email,
// sessions) lives in Clerk; the domain only knows the Clerk user id.
type Player struct {
	ID          string
	ClerkUserID string
	RealName    string
	Handle      string
	DateOfBirth time.Time
	Height      Height
	Positions   []Position
	HomeCourtID string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type PlayerParams struct {
	ClerkUserID string
	RealName    string
	Handle      string
	DateOfBirth time.Time
	Height      Height
	Positions   []Position
	HomeCourtID string
}

// NewPlayer validates and normalizes: real name trimmed, handle lowercased
// (uniqueness is case-insensitive). now anchors date-of-birth plausibility.
func NewPlayer(p PlayerParams, now time.Time) (Player, error) {
	if p.ClerkUserID == "" {
		return Player{}, ErrInvalidClerkUserID
	}

	realName := strings.TrimSpace(p.RealName)
	if realName == "" || len(realName) > 80 {
		return Player{}, ErrInvalidRealName
	}

	handle := strings.ToLower(p.Handle)
	if !handlePattern.MatchString(handle) {
		return Player{}, ErrInvalidHandle
	}

	if p.DateOfBirth.IsZero() || !p.DateOfBirth.Before(now) || p.DateOfBirth.Before(now.AddDate(-120, 0, 0)) {
		return Player{}, ErrInvalidDateOfBirth
	}

	height := strings.TrimSpace(p.Height.Value)
	if height == "" || len(height) > 10 {
		return Player{}, ErrInvalidHeight
	}
	if _, err := ParseHeightUnit(string(p.Height.Unit)); err != nil {
		return Player{}, err
	}

	if len(p.Positions) == 0 {
		return Player{}, ErrInvalidPositions
	}
	seen := map[Position]bool{}
	for _, pos := range p.Positions {
		if _, err := ParsePosition(string(pos)); err != nil {
			return Player{}, err
		}
		if seen[pos] {
			return Player{}, ErrInvalidPositions
		}
		seen[pos] = true
	}

	if p.HomeCourtID == "" {
		return Player{}, ErrInvalidHomeCourt
	}

	return Player{
		ClerkUserID: p.ClerkUserID,
		RealName:    realName,
		Handle:      handle,
		DateOfBirth: p.DateOfBirth,
		Height:      Height{Value: height, Unit: p.Height.Unit},
		Positions:   p.Positions,
		HomeCourtID: p.HomeCourtID,
	}, nil
}
