package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

const (
	uniqueViolation     = "23505"
	foreignKeyViolation = "23503"
)

type Players struct {
	db *sql.DB
}

func NewPlayers(db *sql.DB) *Players {
	return &Players{db: db}
}

func (r *Players) Save(ctx context.Context, p domain.Player) (domain.Player, error) {
	positions := make([]string, len(p.Positions))
	for i, pos := range p.Positions {
		positions[i] = string(pos)
	}

	row := r.db.QueryRowContext(ctx,
		`INSERT INTO players
		     (clerk_user_id, real_name, handle, date_of_birth, height_value, height_unit, positions, home_court_id)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		 RETURNING id, created_at, updated_at`,
		p.ClerkUserID, p.RealName, p.Handle, p.DateOfBirth,
		p.Height.Value, string(p.Height.Unit), positions, p.HomeCourtID)

	if err := row.Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt); err != nil {
		return domain.Player{}, mapSaveError(err)
	}
	return p, nil
}

func (r *Players) FindByClerkUserID(ctx context.Context, clerkUserID string) (domain.Player, error) {
	var (
		p         domain.Player
		dob       sql.NullTime
		heightVal sql.NullString
		heightU   sql.NullString
		positions sql.NullString
		courtID   sql.NullString
	)
	// database/sql cannot scan text[]; flatten with a separator that can
	// never appear in a position name.
	err := r.db.QueryRowContext(ctx,
		`SELECT id, clerk_user_id, real_name, handle, date_of_birth,
		        height_value, height_unit, array_to_string(positions, '|'), home_court_id,
		        created_at, updated_at
		 FROM players WHERE clerk_user_id = $1`, clerkUserID).
		Scan(&p.ID, &p.ClerkUserID, &p.RealName, &p.Handle, &dob,
			&heightVal, &heightU, &positions, &courtID, &p.CreatedAt, &p.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return domain.Player{}, domain.ErrPlayerNotFound
	}
	if err != nil {
		return domain.Player{}, fmt.Errorf("finding player: %w", err)
	}

	// Identity columns are nullable for rows created before migration 00003.
	if dob.Valid {
		p.DateOfBirth = dob.Time
	}
	if heightVal.Valid {
		p.Height = domain.Height{Value: heightVal.String, Unit: domain.HeightUnit(heightU.String)}
	}
	if positions.Valid && positions.String != "" {
		for _, pos := range strings.Split(positions.String, "|") {
			p.Positions = append(p.Positions, domain.Position(pos))
		}
	}
	if courtID.Valid {
		p.HomeCourtID = courtID.String
	}
	return p, nil
}

func (r *Players) HandleTaken(ctx context.Context, handle string) (bool, error) {
	var taken bool
	err := r.db.QueryRowContext(ctx,
		`SELECT EXISTS (SELECT 1 FROM players WHERE handle = $1)`, handle).Scan(&taken)
	if err != nil {
		return false, fmt.Errorf("checking handle: %w", err)
	}
	return taken, nil
}

func mapSaveError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch {
		case pgErr.Code == uniqueViolation && pgErr.ConstraintName == "players_handle_key":
			return domain.ErrHandleTaken
		case pgErr.Code == uniqueViolation && pgErr.ConstraintName == "players_clerk_user_id_key":
			return domain.ErrPlayerExists
		case pgErr.Code == foreignKeyViolation && pgErr.ConstraintName == "players_home_court_id_fkey":
			return domain.ErrCourtNotFound
		}
	}
	return fmt.Errorf("inserting player: %w", err)
}
