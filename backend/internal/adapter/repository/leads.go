package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/domain"
)

type Leads struct {
	db *sql.DB
}

func NewLeads(db *sql.DB) *Leads {
	return &Leads{db: db}
}

// Save upserts on the normalized contact: a resubmission refreshes the name
// and returns the existing row, so signing up twice always looks like success.
func (r *Leads) Save(ctx context.Context, l domain.Lead) (domain.Lead, error) {
	row := r.db.QueryRowContext(ctx,
		`INSERT INTO leads (name, contact_method, contact)
		 VALUES ($1, $2, $3)
		 ON CONFLICT (contact_method, contact) DO UPDATE SET name = EXCLUDED.name
		 RETURNING id, created_at`,
		l.Name, string(l.Method), l.Contact)

	if err := row.Scan(&l.ID, &l.CreatedAt); err != nil {
		return domain.Lead{}, fmt.Errorf("inserting lead: %w", err)
	}
	return l, nil
}
