---
name: tauri
description: Tauri desktop apps with a Vite plus React plus TypeScript webview. Use when adding IPC commands, capabilities, or packaging a desktop shell. Keep OS capabilities on a minimal allowlist.
---

# Tauri + Vite + React + TS

Frontend is the **react** subspace (Vite + React + TS). Rust/sidecar talks to it through typed IPC. Do not turn the webview into a Next.js app.

`src-tauri` vs webview paths are defaults. Real directories come from the `implement`/`tdd` recon of `package.json` and `tsconfig.json` (monorepo, `paths`).

## IPC

- Commands: typed arguments and results on both sides. No `any` payloads.
- Do not expose a generic “run any shell command” API.

## Capabilities

Default deny. Allow only the capabilities the feature needs (`fs` scoped to an app dir, not the whole disk; no `shell` unless the user needs it). Review `capabilities/*.json` on every new permission.

## Secrets

Signing keys and updater tokens stay out of the repo and out of chat. Frontend must not ship production secrets in `VITE_*`.
