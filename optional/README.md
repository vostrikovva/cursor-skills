# Optional skills (not in subspaces)

High-risk or Vercel-account skills. Not under `skills/`, so default `npx skills add <this-repo>` will not list them.

If you still want one, from the target project:

```bash
npx skills add <path-or-github-of-this-catalog> --full-depth -a cursor --copy --skill deploy-to-vercel
```

Prefer the Vercel CLI with interactive login over claimable `deploy.sh` and over grepping tokens into chat.
