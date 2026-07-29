package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port        string
	DatabaseURL string
	ClerkIssuer string
}

func Load() (Config, error) {
	cfg := Config{
		Port:        os.Getenv("PORT"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		ClerkIssuer: os.Getenv("CLERK_ISSUER"),
	}

	if cfg.Port == "" {
		cfg.Port = "8080"
	}
	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.ClerkIssuer == "" {
		return Config{}, fmt.Errorf("CLERK_ISSUER is required")
	}

	return cfg, nil
}
