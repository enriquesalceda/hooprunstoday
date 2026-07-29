.PHONY: test test.integration test.all run docker.detach docker.down fmt db.migrate db.migration

test:
	cd backend && go test ./...

test.integration:
	cd backend && go test -tags integration ./...

test.all: test test.integration

run:
	cd backend && go run ./cmd/api

docker.detach:
	docker compose up -d

# Apply migrations to the local Docker Postgres
db.migrate:
	cd backend && DATABASE_URL="postgres://hooprunstoday:hooprunstoday@localhost:5433/hooprunstoday?sslmode=disable" go run ./cmd/migrate

# Create a new migration: make db.migration name=add_runs_table
db.migration:
	cd backend && go run github.com/pressly/goose/v3/cmd/goose@latest -s -dir internal/infrastructure/postgres/migrations create $(name) sql

docker.down:
	docker compose down

fmt:
	cd backend && gofmt -w .
	terraform -chdir=infra fmt -recursive
