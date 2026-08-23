#!/usr/bin/env node
/**
 * Install catalog subspaces into a Cursor project.
 *
 * From the target app (after this catalog is on GitHub):
 *   npx --yes github:vostrikovva/cursor-skills -- react-ssr --to .
 *
 * Locally, from this catalog:
 *   npx --yes . -- react --to ../my-app
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const catalogRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const presets = JSON.parse(readFileSync(join(catalogRoot, "presets.json"), "utf8"));

function usage() {
  const names = Object.keys(presets).join(", ");
  console.log(`Install Cursor skill subspaces from this catalog.

Usage:
  npx --yes github:vostrikovva/cursor-skills -- <subspace...> [--to <dir>] [--dry-run]
  npx --yes . -- <subspace...> [--to <dir>] [--dry-run]
  node scripts/install-subspace.mjs <subspace...> [--to <dir>] [--dry-run]

Options:
  --to <dir>   Target app (default: current directory)
  --dry-run    Print the skill list without installing
  --list       List subspaces and the skills they expand to
  --help       Show this help

Subspaces: ${names}

Examples:
  npx --yes github:vostrikovva/cursor-skills -- react-ssr --to .
  npx --yes github:vostrikovva/cursor-skills -- backend-express db-postgres --to .
`);
}

function expand(name, seen = new Set()) {
  if (!presets[name]) {
    throw new Error(`Unknown subspace "${name}". Known: ${Object.keys(presets).join(", ")}`);
  }
  if (seen.has(name)) return [];
  seen.add(name);
  const spec = presets[name];
  const out = [];
  for (const parent of spec.extends ?? []) {
    out.push(...expand(parent, seen));
  }
  out.push(...(spec.skills ?? []));
  return out;
}

function unique(list) {
  return [...new Set(list)];
}

function parseArgs(argv) {
  const names = [];
  let to = null;
  let dryRun = false;
  let list = false;
  let help = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      help = true;
      continue;
    }
    if (a === "--list") {
      list = true;
      continue;
    }
    if (a === "--to") {
      to = argv[++i];
      if (!to) throw new Error("--to requires a directory");
      continue;
    }
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a.startsWith("-")) {
      throw new Error(`Unknown flag: ${a}`);
    }
    names.push(a);
  }
  return {
    names,
    to: resolve(process.cwd(), to ?? "."),
    dryRun,
    list,
    help,
  };
}

function listPresets() {
  for (const name of Object.keys(presets)) {
    console.log(`${name}: ${unique(expand(name)).join(", ")}`);
  }
}

try {
  const { names, to, dryRun, list, help } = parseArgs(process.argv.slice(2));

  if (help) {
    usage();
    process.exit(0);
  }
  if (list) {
    listPresets();
    process.exit(0);
  }
  if (names.length === 0) {
    usage();
    process.exit(1);
  }

  const skills = unique(names.flatMap((n) => expand(n)));

  if (skills.includes("vite-react") && skills.includes("nextjs")) {
    console.warn(
      "Warning: both vite-react and nextjs are selected. Do not mix react and react-ssr in one project.",
    );
  }

  const skillArgs = skills.flatMap((s) => ["--skill", s]);
  const args = ["-y", "skills", "add", catalogRoot, "-a", "cursor", "--copy", ...skillArgs];

  console.log("Catalog:", catalogRoot);
  console.log("Project:", to);
  console.log("Subspaces:", names.join(", "));
  console.log("Skills:", skills.join(", "));

  if (dryRun) {
    process.exit(0);
  }

  const result = spawnSync("npx", args, {
    cwd: to,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  process.exit(result.status ?? 1);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
