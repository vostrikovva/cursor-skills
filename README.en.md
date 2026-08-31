# Skills catalog (Cursor)

[English](README.en.md) | [Русский](README.md)

A personal Agent Skills set: process skills from [Matt Pocock](https://github.com/mattpocock/skills), React/RN/UI from [Vercel](https://github.com/vercel-labs/agent-skills), plus short TypeScript skills for Vite, Next, Express, Nest, Drizzle, Mongo, Tauri, and Expo.

The format matches Claude (`SKILL.md`), but invocations are wired for Cursor: name the skill by `name` in chat; do not expect `/grill-me` the way Claude Code works.

Plan: [plans/skills-security-merge.md](plans/skills-security-merge.md). Risks: [SECURITY.md](SECURITY.md). Licenses: [NOTICE.md](NOTICE.md). Upstream SHAs: [SOURCES.md](SOURCES.md).

## Install into a project

Repo: [vostrikovva/cursor-skills](https://github.com/vostrikovva/cursor-skills). Run from the **target app**. Default is **local** and **`.cursor/skills/`** (preferred over `.agents/skills`). `--to` is the project root. Flags: `npx --yes github:vostrikovva/cursor-skills --help`. On Windows, do not put a stray `--` before the preset name (if you do, the installer ignores it).

Interactive (scope, skill directory, then frontend / backend / database):

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
npx --yes github:vostrikovva/cursor-skills react --to . --skill-dir agents
npx --yes github:vostrikovva/cursor-skills react --global
```

Cursor loads `.cursor/skills/` and `.agents/skills/` (project), plus `~/.cursor/skills/` and `~/.agents/skills/` (user). Do not use `--all`. Do not install into `~/.cursor/skills-cursor/`. A global preset applies to every project — do not mix `react` and `react-ssr`.

High-risk Vercel skills (deploy / tokens / optimize) are only in [optional/README.md](optional/README.md).

## Checking SKILL.md

If YAML frontmatter is invalid, `npx skills add` **skips** that file (`Skipped … YAML parse error`) and still installs the rest of the preset. A common cause is a one-line `description` with an unquoted `: ` (compact mapping). Quote the value, use `>-`, or a multiline `description:` (as in composition-patterns).

Before you push (or after `npm install` — a pre-commit hook via `simple-git-hooks`):

```bash
npm run check-skills
```

Installed copies default to `.cursor/skills/<name>/`. Not `~/.cursor/skills-cursor/`. If a skill “did not install”, look for `Skip, missing in catalog` in the installer output.

## Subspaces

Each subspace (except pure `db-*`) includes **core**: grilling, grill-me, teach-me, grill-with-docs, domain-modeling, to-spec, to-tickets, tdd, implement, code-review, diagnosing-bugs, codebase-design, typescript.

**Every** preset (including pure `db-*`) also installs `which-skill` (explicit invoke only).

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

Subspaces drop **uninstalled** skills. Cursor still puts descriptions of **installed** skills into context.

## How to use

- **On their own for the task** (model-invoked): `tdd`, `typescript`, `vite-react`, `nextjs`, composition, UI guidelines, Express/Nest, and so on — the agent may pick them up when the description matches.
- **By name** (`disable-model-invocation`): `grill-me`, `teach-me`, `grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `which-skill`. Write: “apply the grill-me skill”. To pick a skill: “apply the which-skill skill” plus the request.
- Loop: grill → spec/tickets → implement + tdd → code-review. After three consecutive failing full test suites, STOP and ask the user. Commit only if you asked for it explicitly.
- All generated code is TypeScript `strict`.

## Skill catalog

### Process (Pocock, adapted)

Descriptions below come from upstream [Reference](https://github.com/mattpocock/skills/tree/main), fitted to this catalog: invoke by `name`, and no skills that are not vendored here.

| name | Description |
|------|-------------|
| grilling | Interview the user relentlessly about a plan, decision, or idea until every branch of the design tree is resolved. The reusable interview primitive behind `grill-me` and `grill-with-docs`. |
| grill-me | Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved. Explicit invoke only. |
| teach-me | Teach a named technology in chat: brief motivation, then Q&A and beginner code hints. Does not edit project files. Explicit invoke only. |
| grill-with-docs | Grilling session that also builds your project's domain model, sharpening terminology and updating `CONTEXT.md` and ADRs inline. |
| domain-modeling | Actively build and sharpen a project's domain model: challenge terms against the glossary, stress-test with edge-case scenarios, and update `CONTEXT.md` and ADRs inline. |
| to-spec | Turn the current conversation into a spec and publish it to the issue tracker. No interview, just synthesizes what you've already discussed. |
| to-tickets | Break any plan, spec, or conversation into a set of tracer-bullet tickets, each declaring its blocking edges, written as text in a local file, or as native blocking links on a real tracker. |
| tdd | Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time. |
| implement | Build the work described by a spec or set of tickets, driving `tdd` at pre-agreed seams and closing out with `code-review` before committing. Commit only if you asked for it explicitly. |
| code-review | Two-axis review of the diff since a fixed point: Standards (does it follow the repo's coding standards, plus a Fowler smell baseline?) and Spec (does it faithfully implement the originating issue/spec?), run as parallel sub-agents so neither pollutes the other. |
| diagnosing-bugs | Disciplined diagnosis loop for hard bugs and performance regressions: build a feedback loop that goes red on this bug → minimise → hypothesise → instrument → fix → regression-test. |
| codebase-design | Shared discipline and vocabulary for designing deep modules: a lot of behaviour behind a small interface, placed at a clean seam, testable through that interface. |
| which-skill | Recommend which Cursor skill (built-in or from this catalog) to apply to a request. Explicit invoke only; installed with every preset. |

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
