package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

const uniqueViolation = "23505"

type Players struct {
	db *sql.DB
}

func NewPlayers(db *sql.DB) *Players {
	return &Players{db: db}
}

func (r *Players) Save(ctx context.Context, p domain.Player) (domain.Player, error) {
	row := r.db.QueryRowContext(ctx,
		`INSERT INTO players (clerk_user_id, real_name, handle)
		 VALUES ($1, $2, $3)
		 RETURNING id, created_at, updated_at`,
		p.ClerkUserID, p.RealName, p.Handle)

	if err := row.Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt); err != nil {
		return domain.Player{}, mapSaveError(err)
	}
	return p, nil
}

func mapSaveError(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == uniqueViolation {
		switch pgErr.ConstraintName {
		case "players_handle_key":
			return domain.ErrHandleTaken
		case "players_clerk_user_id_key":
			return domain.ErrPlayerExists
		}
	}
	return fmt.Errorf("inserting player: %w", err)
}
