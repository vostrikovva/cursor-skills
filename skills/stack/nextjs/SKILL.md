---
name: nextjs
description: Next.js App Router and Next bundler (not Vite). RSC, next/image, next.config.
---

# Next.js (react-ssr)

This subspace is **Next.js and its bundler**, not Vite SSR. Config lives in `next.config.ts`, not `vite.config.ts`.

Layout paths below are defaults. Real directories come from the `implement`/`tdd` recon of `package.json` and `tsconfig.json` (monorepo, `paths`).

When `vercel-react-best-practices` is installed, apply those rules here (RSC, waterfalls, `next/image`).

## Bundler

- Local dev: Next Turbopack (`next dev`). Do not add a parallel Vite pipeline to the same app.
- Production build: Next CLI (`next build`) — webpack unless the project has opted into Turbopack for build.
- Aliases, env, and image domains belong in `next.config.ts`.

## App Router

- Default: App Router under `app/`. Server Components unless the file needs client APIs (`use client`).
- Links: `next/link`. Images: `next/image` with explicit sizes.
- Env: `NEXT_PUBLIC_*` for browser; server secrets only in server modules. Never print secrets in chat.

## Do not

- Copy Vite SPA patterns (`import.meta.env.VITE_*`, React Router as the primary app router) into a Next app unless the user is migrating and said so.
