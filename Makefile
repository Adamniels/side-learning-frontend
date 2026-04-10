.PHONY: dev build start lint typecheck check clean install contracts-sync contracts-sync-local

# Default target
all: install dev

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Start production server
start:
	npm run start

# Run ESLint
lint:
	npm run lint

# Run TypeScript compilation check
typecheck:
	npx tsc --noEmit

# Run both lint and typecheck
check: lint typecheck

# Sync generated OpenAPI types (uses OPENAPI_URL if set, else local fallback)
contracts-sync:
	npm run contracts:sync

# Sync generated OpenAPI types from local backend URL explicitly
contracts-sync-local:
	npm run contracts:sync:local

# Remove build cache and modules
clean:
	rm -rf .next
	rm -rf out
	rm -rf node_modules
	rm -rf package-lock.json
