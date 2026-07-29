package postgres

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"io/fs"

	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// Migrate applies all pending migrations. Safe to run repeatedly; each
// migration runs in its own transaction.
func Migrate(ctx context.Context, db *sql.DB) error {
	src, err := fs.Sub(migrationsFS, "migrations")
	if err != nil {
		return fmt.Errorf("scoping migrations filesystem: %w", err)
	}

	provider, err := goose.NewProvider(goose.DialectPostgres, db, src)
	if err != nil {
		return fmt.Errorf("creating migration provider: %w", err)
	}

	if _, err := provider.Up(ctx); err != nil {
		return fmt.Errorf("applying migrations: %w", err)
	}

	return nil
}
