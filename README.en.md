# Skills catalog (Cursor)

[English](README.en.md) | [Русский](README.md)

A personal Agent Skills set: process skills from [Matt Pocock](https://github.com/mattpocock/skills), React/RN/UI from [Vercel](https://github.com/vercel-labs/agent-skills), plus short TypeScript skills for Vite, Next, Express, Nest, Drizzle, Mongo, Tauri, and Expo.

The format matches Claude (`SKILL.md`), but invocations are wired for Cursor: name the skill by `name` in chat; do not expect `/grill-me` the way Claude Code works.

Plan: [plans/skills-security-merge.md](plans/skills-security-merge.md). Risks: [SECURITY.md](SECURITY.md). Licenses: [NOTICE.md](NOTICE.md). Upstream SHAs: [SOURCES.md](SOURCES.md).

## Install into a project

Repo: [vostrikovva/cursor-skills](https://github.com/vostrikovva/cursor-skills). Run from the **target app**. `--to` defaults to the current directory. On Windows, do not put a stray `--` before the preset name (if you do, the installer ignores it).

Interactive (arrow keys: frontend / backend / database):

```bash
npx --yes github:vostrikovva/cursor-skills
```

Non-interactive, named preset:

```bash
npx --yes github:vostrikovva/cursor-skills react --to .
npx --yes github:vostrikovva/cursor-skills react-ssr --to .
npx --yes github:vostrikovva/cursor-skills tauri-desktop --to .
npx --yes github:vostrikovva/cursor-skills backend-express db-postgres --to .
npx --yes github:vostrikovva/cursor-skills backend-nest db-mongo --to .
npx --yes github:vostrikovva/cursor-skills mobile --to .
```

Locally, from a clone of this catalog:

```bash
npx --yes . react --to ../my-app
npx --yes github:vostrikovva/cursor-skills --list
npx --yes github:vostrikovva/cursor-skills react --dry-run
```

Do not use `--all`. Do not install into `~/.cursor/skills-cursor/`, and do not install the catalog globally (`-g`): the presets are mutually exclusive.

High-risk Vercel skills (deploy / tokens / optimize) are only in [optional/README.md](optional/README.md).

## Subspaces

Each subspace (except pure `db-*`) includes **core**: grilling, grill-me, grill-with-docs, domain-modeling, to-spec, to-tickets, tdd, implement, code-review, diagnosing-bugs, codebase-design, typescript.

| Name | Stack | Does not install |
|------|--------|------------------|
| `react` | Vite + React + TS, composition, web UI guidelines | Next, `vercel-react-best-practices` |
| `react-ssr` | Next.js and its bundler (Turbopack/webpack), Vercel RBP | Vite (`vite-react`) |
| `tauri-desktop` | same as `react` + Tauri IPC/capabilities | RN, Nest |
| `backend-express` | Express + TS | Nest |
| `backend-nest` | Nest + TS | Express |
| `db-postgres` | Drizzle + Postgres | Mongo |
| `db-mongo` | Mongo + TS | Postgres |
| `mobile` | Vercel RN + Expo | Vite desktop |

Do not install `react` and `react-ssr` into the same repository.

Subspaces drop **uninstalled** skills. Cursor still puts descriptions of **installed** skills into context; those descriptions are kept short (~100 characters), with the rest in the `SKILL.md` body.

## How to use

- **On their own for the task** (model-invoked): `tdd`, `typescript`, `vite-react`, `nextjs`, composition, UI guidelines, Express/Nest, and so on — the agent may pick them up when the description matches.
- **By name** (`disable-model-invocation`): `grill-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`. Write: “apply the grill-me skill”.
- Loop: grill → spec/tickets → implement + tdd → code-review. After three consecutive failing full test suites, STOP and ask the user. Commit only if you asked for it explicitly.
- All generated code is TypeScript `strict`.

## Skill catalog

### Process (Pocock, adapted)

| name | When |
|------|------|
| grilling | Decision-tree interview |
| grill-me | Same, only on explicit invoke |
| grill-with-docs | Grill + CONTEXT.md / ADR |
| domain-modeling | Glossary and terms |
| to-spec | Gather a spec from the chat |
| to-tickets | Slice into tickets |
| tdd | Red-green at the seams |
| implement | Do the work from spec/tickets |
| code-review | Standards + spec against the diff |
| diagnosing-bugs | Debugging discipline |
| codebase-design | Deep modules / seams |

### Frontend / mobile (Vercel + custom)

| name | When |
|------|------|
| vite-react | Vite SPA, not Next |
| nextjs | Next App Router and Next’s bundler |
| vercel-react-best-practices | React/Next perf (react-ssr preset) |
| vercel-composition-patterns | Compound components |
| web-design-guidelines | A11y / UX audit |
| vercel-react-native-skills | RN performance |
| expo-rn | Expo Router, EAS |
| tauri | Desktop IPC, capabilities |

### Backend (custom)

| name | When |
|------|------|
| typescript | Strict, API boundaries |
| express-api | HTTP on Express |
| nestjs | Nest modules |
| postgres-drizzle | Schema and migrations |
| mongodb | Documents and indexes |
