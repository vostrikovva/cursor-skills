---
name: vite-react
description: Vite plus React plus TypeScript SPA. Use when the app is Vite (vite.config), not Next.js. Covers import.meta.env, dev proxy to an API, React Router, and code splitting.
---

# Vite + React + TypeScript

Use this skill when the repo has Vite (`vite.config.ts`), not Next.js. Do not introduce `next/image`, App Router, or Turbopack. Follow `typescript` and `vercel-composition-patterns` when those skills are installed. For UI/a11y follow `web-design-guidelines`.

## Layout

- Entry: `index.html` + `src/main.tsx`.
- Env: only `import.meta.env.VITE_*`. Never `process.env` in browser code.
- Dev API: `server.proxy` in `vite.config.ts` to the Node server. Do not hardcode production API hosts in source.

## Routing and split

- Client router (e.g. React Router) for SPA paths.
- Lazy-load heavy routes with `React.lazy` + `Suspense`.

## Do not

- Add `next.config.*` or RSC to a Vite app.
- Commit `.env` files. Do not echo env values in chat.
