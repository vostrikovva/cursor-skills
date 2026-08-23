---
name: express-api
description: Express HTTP APIs in TypeScript: routes, middleware, errors. Not NestJS.
---

# Express + TypeScript

Use when the server is Express. If the repo is NestJS, follow `nestjs` instead.

Source layout is a default. Real directories come from the `implement`/`tdd` recon of `package.json` and `tsconfig.json` (monorepo, `paths`).

## Defaults

- `express` + TypeScript. Type `Request`/`Response` handlers; do not use untyped `any` callbacks.
- One place for errors: centralized error middleware. Route handlers `next(err)` or `async` wrapper. Do not `res.status` from random helpers inconsistently.
- Validate body/query at the edge (e.g. zod). Infer types from the schema.
- Do not log tokens, passwords, or `Authorization` headers.

## Structure

Keep routers thin: parse → call a typed service → map result to HTTP. Business rules do not live in middleware.

## Secrets

Read `process.env` in a small config module with explicit types. Never dump `.env` into chat.
