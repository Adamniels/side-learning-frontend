# OpenAPI Contracts Sync

This frontend generates API TypeScript types directly from the backend Swagger/OpenAPI document.

## Why this setup

- Backend is the contract source of truth.
- Frontend can sync on demand without copying files between repos.
- Generated types are committed so CI/builds are not blocked by backend availability.

## Rules for contributors and AI agents

- Do not create or maintain duplicate hand-written API DTOs in the frontend when a generated type exists.
- Prefer imports from `src/generated/api-types.ts` for request/response contracts.
- If a needed field/type is missing from generated output, do not patch around it by adding custom frontend contract types.
- Treat missing generated types as an API contract issue to be fixed at the source:
  1. confirm the backend endpoint/request/response is correctly modeled,
  2. confirm it appears in backend Swagger/OpenAPI output,
  3. re-run sync in frontend.
- Only use temporary local aliases/wrappers when migration is in progress, and remove them once generated contracts are available.

## Prerequisites

- Backend API is reachable at one of:
  - `OPENAPI_URL` (recommended for flexibility), or
  - default local URL: `http://localhost:5207/swagger/v1/swagger.json`
- Frontend dependencies are installed (`npm install`).

## Commands

- Default sync (uses `OPENAPI_URL` if set, otherwise local fallback):

```bash
npm run contracts:sync
```

- Force local backend URL:

```bash
npm run contracts:sync:local
```

- Use a specific environment/backend URL:

```bash
OPENAPI_URL=https://your-backend-host/swagger/v1/swagger.json npm run contracts:sync
```

## Output

- Generated file: `src/generated/api-types.ts`
- Generator runner: `openapi.config.mjs`

## Troubleshooting

- `fetch failed` or connection errors:
  - Verify backend is running and reachable.
  - Open the Swagger JSON URL directly in browser to confirm.
  - Confirm you are using the correct protocol/port.
- Swagger URL requires auth/network access:
  - Use a reachable URL from your machine (VPN, dev environment URL, etc.).
- Types look outdated:
  - Re-run `npm run contracts:sync` after backend changes.

## Recommended workflow

1. Backend contract changed (request/response/route).
2. Run `npm run contracts:sync`.
3. Update frontend code to align with changed generated types from `src/generated/api-types.ts`.
4. Commit both generated file and consumer changes together.

## When generated types are missing

Use this checklist before adding any new frontend type:

1. Verify endpoint is included in backend OpenAPI (`/swagger/v1/swagger.json`).
2. Verify backend request/response model is exposed in endpoint metadata and serializable.
3. Re-run `npm run contracts:sync` (or `make contracts-sync`).
4. If still missing, fix backend OpenAPI generation/root cause first, then sync again.
