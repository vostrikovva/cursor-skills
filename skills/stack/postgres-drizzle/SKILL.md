---
name: postgres-drizzle
description: PostgreSQL with Drizzle ORM and Drizzle Kit. Use when defining schema, generating or applying SQL migrations, or querying Postgres. Prefer generate-and-review over drizzle-kit push on shared databases.
---

# PostgreSQL + Drizzle

TypeScript schema in `pgTable` (or equivalent). Query types come from the schema, not `any`.

## Kit

- Change schema in TS → `drizzle-kit generate` → **read the SQL** → then `migrate`.
- Do not run `drizzle-kit push` against a shared or production database unless the user explicitly asked and understands it can skip migration history.
- Never print `DATABASE_URL` or credentials in chat.

## Migrations

Irreversible changes (drop column, drop table) need an explicit user OK. Prefer expand/contract over rewrite-in-place.

## vs Mongo

Relational data, joins, constraints → Postgres. Document-shaped, uneven records → `mongodb` skill.
