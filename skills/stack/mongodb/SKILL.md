---
name: mongodb
description: MongoDB with TypeScript document types and indexes. Use when the data model is document-oriented, not when the project already standardized on Postgres plus Drizzle.
---

# MongoDB + TypeScript

Type documents (interface or schema). Do not pass `any` through the driver.

## Defaults

- Indexes for fields you filter/sort on. Call out missing indexes when adding queries.
- Do not store secrets in documents. Do not print connection strings in chat.

## vs Postgres

If the repo already uses Drizzle/Postgres, do not add Mongo “for variety”. Split databases only when the user wants a document store for a defined bounded context.
