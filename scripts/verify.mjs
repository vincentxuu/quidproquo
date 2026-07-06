#!/usr/bin/env node
// pnpm verify — the single canonical quality gate for this repo.
//
// Runs every fast, offline, deterministic check. If this is green, the
// working tree is safe to commit. Used by: pre-commit hook, Stop hook,
// preview CI. Full details: docs/governance/operating-charter.md.
//
// Deliberately NOT included (slow or network-dependent): pnpm test,
// pnpm build, astro check, post-quality/glossary advisory checks.
// Those belong to deploy-preflight, CI build, or per-skill flows.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const results = [];

function runStep(name, command) {
  try {
    execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    results.push({ name, ok: true });
  } catch (error) {
    const out = [error.stdout, error.stderr].map((s) => s?.toString().trim()).filter(Boolean).join('\n');
    results.push({ name, ok: false, detail: out || error.message });
  }
}

function checkProgress() {
  const path = resolve(ROOT, 'progress.txt');
  const problems = [];
  if (!existsSync(path)) {
    problems.push('progress.txt missing — it is the session memory, do not delete it');
  } else {
    const text = readFileSync(path, 'utf8');
    const lineCount = text.split('\n').length;
    if (!/^Last updated: \d{4}-\d{2}-\d{2}$/m.test(text)) {
      problems.push('progress.txt needs a "Last updated: YYYY-MM-DD" line');
    }
    if (lineCount > 90) {
      problems.push(
        `progress.txt is ${lineCount} lines (cap: 90). Move finished/stale entries to docs/progress-archive.md — progress.txt is working memory, not a logbook`
      );
    }
  }
  results.push(
    problems.length === 0
      ? { name: 'progress.txt protocol', ok: true }
      : { name: 'progress.txt protocol', ok: false, detail: problems.join('\n') }
  );
}

runStep('lint (oxlint)', 'pnpm lint');
runStep('check:references', 'pnpm check:references');
runStep('skills-sync (.agents ↔ .claude)', 'node scripts/check-skills-sync.mjs');
checkProgress();

let failed = 0;
process.stdout.write('\n=== pnpm verify ===\n');
for (const r of results) {
  process.stdout.write(`${r.ok ? '✅' : '🔴'} ${r.name}\n`);
  if (!r.ok) {
    failed += 1;
    const indented = r.detail
      .split('\n')
      .slice(0, 30)
      .map((l) => `     ${l}`)
      .join('\n');
    process.stdout.write(`${indented}\n`);
  }
}
process.stdout.write(
  failed === 0 ? '=== verify: all green ===\n' : `=== verify: ${failed} check(s) failed — fix before commit ===\n`
);
process.exitCode = failed === 0 ? 0 : 1;
