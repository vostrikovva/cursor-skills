#!/usr/bin/env node
/**
 * Parse every SKILL.md the same way `npx skills add` does (package `yaml`).
 * A compact mapping in `description:` (unquoted `: `) makes the CLI skip that
 * skill while the rest of the preset still installs.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const catalogRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const roots = ["skills", "optional"];

async function collectSkillMd(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && err.code === "ENOENT") return acc;
    throw err;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectSkillMd(path, acc);
    } else if (entry.name === "SKILL.md") {
      acc.push(path);
    }
  }
  return acc;
}

function extractFrontmatter(raw, rel) {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!text.startsWith("---\n") && !text.startsWith("---")) {
    throw new Error(`${rel}: missing opening --- frontmatter`);
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    throw new Error(`${rel}: missing closing --- frontmatter`);
  }
  return text.slice(4, end);
}

const files = [];
for (const root of roots) {
  await collectSkillMd(join(catalogRoot, root), files);
}
files.sort();

if (files.length === 0) {
  console.error("No SKILL.md files found under skills/ or optional/");
  process.exit(1);
}

let failed = 0;
for (const abs of files) {
  const rel = relative(catalogRoot, abs).replaceAll("\\", "/");
  const raw = await readFile(abs, "utf8");
  let data;
  try {
    data = parse(extractFrontmatter(raw, rel));
  } catch (err) {
    failed += 1;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`YAML parse error: ${rel}\n${msg}\n`);
    continue;
  }
  if (!data || typeof data !== "object") {
    failed += 1;
    console.error(`${rel}: frontmatter is not a mapping\n`);
    continue;
  }
  if (typeof data.name !== "string" || data.name.length === 0) {
    failed += 1;
    console.error(`${rel}: name must be a non-empty string\n`);
  }
  if (typeof data.description !== "string" || data.description.length === 0) {
    failed += 1;
    console.error(`${rel}: description must be a non-empty string\n`);
  }
}

if (failed > 0) {
  console.error(
    `Failed: ${failed} issue(s) in ${files.length} SKILL.md file(s).\n` +
      "Unquoted `: ` in a one-line description is parsed as a nested mapping; use quotes, `>-`, or a multiline `description:`.",
  );
  process.exit(1);
}

console.log(`OK: ${files.length} SKILL.md file(s)`);
