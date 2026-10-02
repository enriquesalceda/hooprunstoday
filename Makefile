.PHONY: test test.integration test.web test.ios ios.project test.all run docker.detach docker.down fmt db.migrate db.migration

test:
	cd backend && go test ./...

test.integration:
	cd backend && go test -tags integration ./...

test.web:
	cd web && npx vitest run

IOS_SIM ?= iPhone 17
IOS_OS ?= latest

# Regenerate ios/HoopRuns.xcodeproj from ios/project.yml (requires xcodegen)
ios.project:
	cd ios && xcodegen generate

# Package tests on the Mac (fast), then the full scheme on the simulator
test.ios: ios.project
	rm -rf ios/.build/Tests.xcresult
	cd ios/Packages/HoopRunsKit && swift test
	cd ios && xcodebuild test -project HoopRuns.xcodeproj -scheme HoopRuns \
		-destination 'platform=iOS Simulator,name=$(IOS_SIM),OS=$(IOS_OS)' \
		-derivedDataPath .build/DerivedData -resultBundlePath .build/Tests.xcresult -quiet

test.all: test test.integration test.web test.ios

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
	cd ios && swift format -i -r App AppTests UITests Packages/HoopRunsKit/Sources Packages/HoopRunsKit/Tests
