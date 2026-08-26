#!/usr/bin/env node
/**
 * Install catalog subspaces into a Cursor project.
 *
 * Interactive (TTY, no preset args):
 *   npx --yes github:vostrikovva/cursor-skills
 *
 * Named:
 *   npx --yes github:vostrikovva/cursor-skills react-ssr --to .
 *
 * Locally, from this catalog:
 *   npx --yes . react --to ../my-app
 */
import { input, select } from "@inquirer/prompts";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const catalogRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const presets = JSON.parse(readFileSync(join(catalogRoot, "presets.json"), "utf8"));
const SKIP = "";
/** Installed with every subspace, including pure db-* (not in core). */
const everyPresetSkills = ["which-skill"];

function usage() {
  const names = Object.keys(presets).join(", ");
  console.log(`Install Cursor skill subspaces from this catalog.

Usage:
  npx --yes github:vostrikovva/cursor-skills
  npx --yes github:vostrikovva/cursor-skills <subspace...> [options]
  npx --yes . <subspace...> [options]
  node scripts/install-subspace.mjs <subspace...> [options]

With no subspace names and a TTY, prompts for install scope, skill directory,
project directory (local), then frontend / backend / database.

Default: local project, .cursor/skills (preferred over .agents/skills).
Do not install into ~/.cursor/skills-cursor/ (Cursor internals).
Do not mix react and react-ssr in one project.

Cursor loads skills from:
  .cursor/skills/          project-level  (default)
  .agents/skills/          project-level
  ~/.cursor/skills/        user-level (global)
  ~/.agents/skills/        user-level (global)

npx skills add -a cursor --copy writes to .agents/skills (local) or
~/.cursor/skills (-g). This installer copies into .cursor/skills when that
is selected and leaves the native copy in place.

Options:
  --to <dir>              Local project root (default: current directory).
                          Cannot be combined with --global.
  -g, --global            User-level install (all projects).
  --skill-dir cursor      Project .cursor/skills or ~/.cursor/skills (default)
  --skill-dir agents      Project .agents/skills or ~/.agents/skills
  --dry-run               Print the skill list and dest without installing
  --list                  List subspaces and the skills they expand to
  --help                  Show this help

Subspaces: ${names}

Examples:
  npx --yes github:vostrikovva/cursor-skills
  npx --yes github:vostrikovva/cursor-skills react --to .
  npx --yes github:vostrikovva/cursor-skills react --to . --skill-dir agents
  npx --yes github:vostrikovva/cursor-skills react --global
  npx --yes github:vostrikovva/cursor-skills react --global --skill-dir agents
  npx --yes github:vostrikovva/cursor-skills backend-express db-postgres --to .
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

function withEveryPreset(list) {
  return unique([...everyPresetSkills, ...list]);
}

function parseSkillDir(value) {
  if (value !== "cursor" && value !== "agents") {
    throw new Error('--skill-dir must be "cursor" or "agents"');
  }
  return value;
}

function parseArgs(argv) {
  const names = [];
  let to = null;
  let globalInstall = false;
  let skillDir = null;
  let dryRun = false;
  let list = false;
  let help = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") {
      continue;
    }
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
    if (a === "--global" || a === "-g") {
      globalInstall = true;
      continue;
    }
    if (a === "--skill-dir") {
      const value = argv[++i];
      if (!value) throw new Error("--skill-dir requires cursor or agents");
      skillDir = parseSkillDir(value);
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
  if (globalInstall && to != null) {
    throw new Error("Use either --global or --to, not both");
  }
  return {
    names,
    to,
    globalInstall,
    skillDir,
    dryRun,
    list,
    help,
  };
}

function listPresets() {
  for (const name of Object.keys(presets)) {
    console.log(`${name}: ${withEveryPreset(expand(name)).join(", ")}`);
  }
}

function isTty() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

async function promptPresets() {
  if (!isTty()) return null;

  const frontend = await select({
    message: "Frontend",
    choices: [
      { name: "Skip", value: SKIP },
      { name: "react — Vite + React + TS", value: "react" },
      { name: "react-ssr — Next.js App Router", value: "react-ssr" },
      { name: "tauri-desktop — Vite React + Tauri", value: "tauri-desktop" },
      { name: "mobile — Expo + React Native", value: "mobile" },
    ],
  });
  const backend = await select({
    message: "Backend",
    choices: [
      { name: "Skip", value: SKIP },
      { name: "backend-express — Express + TS", value: "backend-express" },
      { name: "backend-nest — NestJS + TS", value: "backend-nest" },
    ],
  });
  const database = await select({
    message: "Database",
    choices: [
      { name: "Skip", value: SKIP },
      { name: "db-postgres — Drizzle + Postgres", value: "db-postgres" },
      { name: "db-mongo — MongoDB + TS", value: "db-mongo" },
    ],
  });

  const names = [frontend, backend, database].filter(Boolean);
  if (names.length === 0) {
    throw new Error("Select at least one of frontend, backend, or database.");
  }
  return names;
}

async function resolveInstallTarget(parsed) {
  let globalInstall = parsed.globalInstall;
  let skillDir = parsed.skillDir;
  let to = parsed.to;
  const tty = isTty();
  const scopeKnown = parsed.globalInstall || parsed.to != null;

  if (tty && !scopeKnown) {
    const scope = await select({
      message: "Install scope",
      default: "local",
      choices: [
        { name: "Local (this project) — default", value: "local" },
        { name: "Global (all projects)", value: "global" },
      ],
    });
    globalInstall = scope === "global";
  }

  if (tty && skillDir == null) {
    skillDir = globalInstall
      ? await select({
          message: "Skill directory",
          default: "cursor",
          choices: [
            { name: "~/.cursor/skills (user-level) — preferred", value: "cursor" },
            { name: "~/.agents/skills (user-level)", value: "agents" },
          ],
        })
      : await select({
          message: "Skill directory",
          default: "cursor",
          choices: [
            { name: ".cursor/skills (project-level) — preferred", value: "cursor" },
            { name: ".agents/skills (project-level)", value: "agents" },
          ],
        });
  }

  skillDir = skillDir ?? "cursor";

  if (!globalInstall && to == null) {
    if (tty) {
      const raw = await input({
        message: "Project directory",
        default: process.cwd(),
      });
      to = resolve(process.cwd(), raw);
    } else {
      to = resolve(process.cwd());
    }
  } else if (to != null) {
    to = resolve(process.cwd(), to);
  } else {
    to = resolve(process.cwd());
  }

  return { globalInstall, skillDir, to };
}

function skillsHome(kind) {
  return join(homedir(), kind === "cursor" ? ".cursor" : ".agents", "skills");
}

function skillsProject(project, kind) {
  return join(project, kind === "cursor" ? ".cursor" : ".agents", "skills");
}

function copyInstalledSkills(skills, fromDir, toDir) {
  if (resolve(fromDir) === resolve(toDir)) return;
  mkdirSync(toDir, { recursive: true });
  for (const name of skills) {
    const src = join(fromDir, name);
    if (!existsSync(src)) {
      console.warn(`Skip copy, missing: ${src}`);
      continue;
    }
    cpSync(src, join(toDir, name), { recursive: true });
  }
  console.log("Copied to:", toDir);
}

function install({ names, to, dryRun, globalInstall, skillDir }) {
  const skills = withEveryPreset(names.flatMap((n) => expand(n)));

  if (skills.includes("vite-react") && skills.includes("nextjs")) {
    console.warn(
      "Warning: both vite-react and nextjs are selected. Do not mix react and react-ssr in one project.",
    );
  }

  const useGlobalFlag = globalInstall && skillDir === "cursor";
  const cwd = globalInstall && skillDir === "agents" ? homedir() : to;
  const nativeDir = useGlobalFlag ? skillsHome("cursor") : join(cwd, ".agents", "skills");
  const chosenDir = globalInstall ? skillsHome(skillDir) : skillsProject(to, skillDir);

  const skillArgs = skills.flatMap((s) => ["--skill", s]);
  const args = ["-y", "skills", "add", catalogRoot, "-a", "cursor", "--copy", ...skillArgs];
  if (useGlobalFlag) args.push("-g");

  console.log("Catalog:", catalogRoot);
  console.log("Scope:", globalInstall ? "global" : "local");
  console.log("Project:", to);
  console.log("Chosen:", chosenDir);
  if (resolve(nativeDir) !== resolve(chosenDir)) {
    console.log("Native:", nativeDir);
  }
  console.log("Subspaces:", names.join(", "));
  console.log("Skills:", skills.join(", "));

  if (dryRun) {
    process.exit(0);
  }

  const result = spawnSync("npx", args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  const status = result.status ?? 1;
  if (status !== 0) {
    process.exit(status);
  }

  copyInstalledSkills(skills, nativeDir, chosenDir);
  process.exit(0);
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.help) {
    usage();
    process.exit(0);
  }
  if (parsed.list) {
    listPresets();
    process.exit(0);
  }

  const target = await resolveInstallTarget(parsed);

  let names = parsed.names;
  if (names.length === 0) {
    const picked = await promptPresets();
    if (!picked) {
      usage();
      process.exit(1);
    }
    names = picked;
  }

  install({ names, dryRun: parsed.dryRun, ...target });
}

main().catch((err) => {
  const name = err && typeof err === "object" && "name" in err ? err.name : "";
  if (name === "ExitPromptError") {
    process.exit(1);
  }
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
