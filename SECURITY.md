# Security

## What we did not put in default subspaces

These stay in [`optional/`](optional/) and are **not** discovered by a normal `npx skills add` of this repo (they sit outside `skills/`):

- `deploy-to-vercel` — uploads a tarball to `https://claude-skills-deploy.vercel.com/api/deploy`; excludes `.env*` but not all secret file types; Claude sandbox paths.
- `vercel-cli-with-tokens` — reads `VERCEL_TOKEN` from env/`.env` into the agent session.
- `vercel-optimize` — authenticated Vercel CLI, account metrics and billing-adjacent data.

Install only with `--full-depth` and an explicit `--skill` if you accept that. `disable-model-invocation` is set so they should not auto-fire.

## Subspaces vs extra skills

Installing `react` does not install Next. That removes unused skills from the project. Cursor still injects the **description of every installed skill** into context. Do not combine `react` and `react-ssr`. Do not use `--all`.

## Other rules this catalog encodes

- Do not commit unless the user asked (`implement`).
- Do not print secrets, `.env`, or `DATABASE_URL` in chat.
- Drizzle: generate SQL and review; no silent `push` on shared DBs.
- Tauri: minimal capabilities allowlist.
- Windows: installer uses `npx skills add --copy` (not symlinks).
- Never install into `~/.cursor/skills-cursor/` (Cursor internals).

## Upstream updates

Copy at the SHAs in [SOURCES.md](SOURCES.md). Re-read diffs before merging new upstream.
