package main

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"

	adapterhttp "github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/http"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/adapter/repository"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/clerk"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/infrastructure/config"
	"github.com/enriquesalceda/hooprunstoday/backend/internal/usecase/createplayer"
)

type realClock struct{}

func (realClock) Now() time.Time { return time.Now() }

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	cfg, err := config.Load()
	if err != nil {
		logger.Error("loading config", "error", err)
		os.Exit(1)
	}

	// No startup ping: health and boot never depend on the database.
	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		logger.Error("opening database", "error", err)
		os.Exit(1)
	}
	defer db.Close()
	db.SetMaxOpenConns(4)
	db.SetConnMaxIdleTime(5 * time.Minute)

	verifier := clerk.NewVerifier(cfg.ClerkIssuer, &http.Client{Timeout: 5 * time.Second})
	players := repository.NewPlayers(db)
	createPlayer := createplayer.New(players, realClock{})

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/v1/health", adapterhttp.Health)
	mux.Handle("POST /api/v1/players",
		adapterhttp.RequireAuth(verifier, adapterhttp.NewCreatePlayerHandler(createPlayer, logger)))

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		logger.Info("server starting", "port", cfg.Port)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Error("shutdown failed", "error", err)
	}
	logger.Info("server stopped")
}
