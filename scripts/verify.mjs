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

function checkDailySkillTimezones() {
  const problems = [];
  const skillDir = resolve(ROOT, '.agents/skills');
  const dailySkills = [
    'daily-digest-arxiv', 'daily-digest-github', 'daily-digest-model-card',
    'daily-digest-security', 'daily-digest-benchmark', 'daily-digest-framework',
    'daily-digest-tool', 'daily-digest-funding', 'daily-digest-pricing',
    'daily-digest-signals', 'daily-digest-report', 'daily-digest-weekly',
    'daily-digest-region',
  ];
  for (const skill of dailySkills) {
    const p = resolve(skillDir, skill, 'SKILL.md');
    if (!existsSync(p)) continue;
    const content = readFileSync(p, 'utf8');
    const todayMatch = content.match(/TODAY=\$\(([^)]+)\)/);
    if (todayMatch && !todayMatch[1].includes('TZ=Asia/Taipei')) {
      problems.push(`${skill}: TODAY= 缺少 TZ=Asia/Taipei（CCR 雲端是 UTC，會導致日期差一天）`);
    }
  }
  results.push(
    problems.length === 0
      ? { name: 'daily-skill timezones', ok: true }
      : { name: 'daily-skill timezones', ok: false, detail: problems.join('\n') }
  );
}

runStep('lint (oxlint)', 'pnpm lint');
runStep('check:references', 'pnpm check:references');
runStep('skills-sync (.agents ↔ .claude)', 'node scripts/check-skills-sync.mjs');
checkDailySkillTimezones();
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
