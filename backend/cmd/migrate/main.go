package main

import (
	"context"
	"database/sql"
	"log/slog"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/postgres"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	// The URL is a secret — never logged, only read.
	url := os.Getenv("DATABASE_URL")
	if url == "" {
		logger.Error("DATABASE_URL is required")
		os.Exit(1)
	}

	db, err := sql.Open("pgx", url)
	if err != nil {
		logger.Error("opening database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		logger.Error("connecting to database", "error", err)
		os.Exit(1)
	}

	if err := postgres.Migrate(ctx, db); err != nil {
		logger.Error("migrating", "error", err)
		os.Exit(1)
	}

	logger.Info("migrations applied")
}
