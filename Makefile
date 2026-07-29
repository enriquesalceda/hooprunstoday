.PHONY: test test.integration test.all run docker.detach docker.down fmt

test:
	cd backend && go test ./...

test.integration:
	cd backend && go test -tags integration ./...

test.all: test test.integration

run:
	cd backend && go run ./cmd/api

docker.detach:
	docker compose up -d

docker.down:
	docker compose down

fmt:
	cd backend && gofmt -w .
	terraform -chdir=infra fmt -recursive
