#!/usr/bin/env node
// Enforce that .claude/skills is a byte-identical mirror of .agents/skills.
//
// Policy (docs/governance/operating-charter.md):
//   - .agents/skills is the ONLY place skills are edited.
//   - .claude/skills is generated, never hand-edited.
//   - Runtime differences (Claude vs Codex) live INSIDE skill bodies as
//     conditional sections, not as forked files.
//
// Usage:
//   node scripts/check-skills-sync.mjs          # check, exit 1 on drift
//   node scripts/check-skills-sync.mjs --fix    # rebuild mirror from canonical

import { cpSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve('.');
const CANONICAL = join(ROOT, '.agents', 'skills');
const MIRROR = join(ROOT, '.claude', 'skills');
const FIX = process.argv.includes('--fix');

function fail(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(1);
}

if (!existsSync(CANONICAL)) fail(`canonical skills dir missing: ${CANONICAL}`);

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

if (FIX) {
  if (existsSync(MIRROR)) rmSync(MIRROR, { recursive: true });
  cpSync(CANONICAL, MIRROR, { recursive: true });
  const n = listFiles(MIRROR).length;
  process.stdout.write(`skills-sync: rebuilt .claude/skills from .agents/skills (${n} files)\n`);
  process.exit(0);
}

if (!existsSync(MIRROR)) {
  fail('skills-sync: .claude/skills missing.\n  fix: node scripts/check-skills-sync.mjs --fix');
}

const canonicalFiles = listFiles(CANONICAL);
const mirrorFiles = listFiles(MIRROR);
const canonicalSet = new Set(canonicalFiles);
const mirrorSet = new Set(mirrorFiles);

const missing = canonicalFiles.filter((f) => !mirrorSet.has(f));
const extra = mirrorFiles.filter((f) => !canonicalSet.has(f));
const differs = canonicalFiles.filter((f) => {
  if (!mirrorSet.has(f)) return false;
  const a = join(CANONICAL, f);
  const b = join(MIRROR, f);
  if (statSync(a).size !== statSync(b).size) return true;
  return !readFileSync(a).equals(readFileSync(b));
});

if (missing.length === 0 && extra.length === 0 && differs.length === 0) {
  process.stdout.write(`skills-sync: OK (${canonicalFiles.length} files identical)\n`);
  process.exit(0);
}

const lines = ['skills-sync: .claude/skills has drifted from .agents/skills'];
for (const f of missing) lines.push(`  missing in mirror: ${f}`);
for (const f of extra) lines.push(`  extra in mirror:   ${f}`);
for (const f of differs) lines.push(`  content differs:   ${f}`);
lines.push('');
lines.push('  Rule: edit skills ONLY under .agents/skills/, then run:');
lines.push('    node scripts/check-skills-sync.mjs --fix');
lines.push('  Never hand-edit .claude/skills/. See docs/governance/operating-charter.md.');
fail(lines.join('\n'));
