package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Courts struct {
	db *sql.DB
}

func NewCourts(db *sql.DB) *Courts {
	return &Courts{db: db}
}

func (r *Courts) List(ctx context.Context) ([]domain.Court, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, court_type FROM courts ORDER BY name`)
	if err != nil {
		return nil, fmt.Errorf("listing courts: %w", err)
	}
	defer rows.Close()

	var courts []domain.Court
	for rows.Next() {
		var c domain.Court
		var courtType string
		if err := rows.Scan(&c.ID, &c.Name, &courtType); err != nil {
			return nil, fmt.Errorf("scanning court: %w", err)
		}
		c.Type = domain.CourtType(courtType)
		courts = append(courts, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("reading courts: %w", err)
	}
	return courts, nil
}
