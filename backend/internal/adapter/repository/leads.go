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
// (and the phone, when one is given) and returns the existing row, so signing
// up twice always looks like success.
func (r *Leads) Save(ctx context.Context, l domain.Lead) (domain.Lead, error) {
	row := r.db.QueryRowContext(ctx,
		`INSERT INTO leads (name, contact_method, contact, phone)
		 VALUES ($1, $2, $3, NULLIF($4, ''))
		 ON CONFLICT (contact_method, contact) DO UPDATE
		   SET name = EXCLUDED.name,
		       phone = COALESCE(EXCLUDED.phone, leads.phone)
		 RETURNING id, created_at, COALESCE(phone, '')`,
		l.Name, string(l.Method), l.Contact, l.Phone)

	if err := row.Scan(&l.ID, &l.CreatedAt, &l.Phone); err != nil {
		return domain.Lead{}, fmt.Errorf("inserting lead: %w", err)
	}
	return l, nil
}
