---
name: nestjs
description: NestJS modules, DI, pipes, and guards in TypeScript. Use when the backend is Nest, not a raw Express app.
---

# NestJS + TypeScript

Use when the server is NestJS. Do not introduce a second Express app alongside it unless the user asked.

## Defaults

- Feature modules, injectable providers, constructor DI.
- Validation: `class-validator` + `ValidationPipe` (whitelist) or a typed schema pipe. DTOs are TypeScript classes/types, not loose `any`.
- Authz: guards on controllers. Do not hide authorization only in a random middleware file.
- Config: `ConfigModule`; typed config keys. Do not print secrets in chat.

## When Express is enough

A tiny JSON API with a handful of routes can stay on `express-api`. Nest pays off with multiple modules, shared guards, and a growing team.

## Do not

- Mix Nest HTTP and a parallel Express server in the same process without an explicit architecture decision.
