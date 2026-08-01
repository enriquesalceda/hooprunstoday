// Package postgrestest opens integration-test database connections.
// Tests get a dedicated database (created on demand) so their cleanup can
// never touch the docker-compose development data. DATABASE_URL overrides
// everything when set (CI supplies its own).
package postgrestest

import (
	"database/sql"
	"fmt"
	"net/url"
	"os"
	"strings"
	"testing"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const adminURL = "postgres://hooprunstoday:hooprunstoday@localhost:5433/hooprunstoday?sslmode=disable"

// Open connects to the named test database, creating it if needed.
// Callers own migration and cleanup; Close is registered automatically.
func Open(t *testing.T, dbName string) *sql.DB {
	t.Helper()

	target := os.Getenv("DATABASE_URL")
	if target == "" {
		ensureDatabase(t, dbName)
		u, err := url.Parse(adminURL)
		if err != nil {
			t.Fatalf("parsing admin url: %v", err)
		}
		u.Path = "/" + dbName
		target = u.String()
	}

	db, err := sql.Open("pgx", target)
	if err != nil {
		t.Fatalf("opening test database: %v", err)
	}
	if err := db.Ping(); err != nil {
		t.Fatalf("pinging test database %q (is `make docker.detach` running?): %v", dbName, err)
	}
	t.Cleanup(func() {
		if err := db.Close(); err != nil {
			t.Errorf("closing test database: %v", err)
		}
	})
	return db
}

func ensureDatabase(t *testing.T, dbName string) {
	t.Helper()

	admin, err := sql.Open("pgx", adminURL)
	if err != nil {
		t.Fatalf("opening admin connection: %v", err)
	}
	defer admin.Close()

	var exists bool
	if err := admin.QueryRow(
		`SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1)`, dbName).Scan(&exists); err != nil {
		t.Fatalf("checking for test database (is `make docker.detach` running?): %v", err)
	}
	if exists {
		return
	}

	// Parallel test packages may race the create; "already exists" is fine.
	if _, err := admin.Exec(fmt.Sprintf(`CREATE DATABASE %q`, dbName)); err != nil &&
		!strings.Contains(err.Error(), "already exists") {
		t.Fatalf("creating test database: %v", err)
	}
}
