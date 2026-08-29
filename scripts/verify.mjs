#!/usr/bin/env node
// pnpm verify — the single canonical quality gate for this repo.
//
// Runs every fast, offline, deterministic check. If this is green, the
// working tree is safe to commit. Used by: pre-commit hook, Stop hook,
// preview CI. Full details: docs/governance/operating-charter.md.
//
// Deliberately NOT included (slow or network-dependent): pnpm test,
// pnpm build, post-quality/glossary advisory checks.
// Those belong to deploy-preflight, CI build, or per-skill flows.
// astro check IS included — catches TS errors that block CI deploy.

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve('.');
const results = [];

function runStep(name, command) {
  try {
    execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    });
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

function checkDurableObjectsExport() {
  try {
    const wranglerPath = resolve(ROOT, 'wrangler.jsonc');
    const cronEntryPath = resolve(ROOT, 'scripts/create-cron-entry.mjs');
    if (!existsSync(wranglerPath) || !existsSync(cronEntryPath)) {
      results.push({ name: 'durable_objects export', ok: true });
      return;
    }
    const wrangler = JSON.parse(readFileSync(wranglerPath, 'utf8'));
    const bindings = wrangler?.durable_objects?.bindings ?? [];
    const cronEntry = readFileSync(cronEntryPath, 'utf8');
    const missing = bindings.filter((b) => !cronEntry.includes(b.class_name)).map((b) => b.class_name);
    if (missing.length === 0) {
      results.push({ name: 'durable_objects export', ok: true });
    } else {
      results.push({ name: 'durable_objects export', ok: false, detail: `Missing export in scripts/create-cron-entry.mjs: ${missing.join(', ')}` });
    }
  } catch (e) {
    results.push({ name: 'durable_objects export', ok: false, detail: String(e) });
  }
}

function checkCronEntryImports() {
  try {
    const generatorPath = resolve(ROOT, 'scripts/create-cron-entry.mjs');
    if (!existsSync(generatorPath)) {
      results.push({ name: 'cron-entry imports', ok: true });
      return;
    }
    const generator = readFileSync(generatorPath, 'utf8');
    const contentMatch = generator.match(/const content = `([\s\S]*?)`\n\nwriteFileSync/);
    if (!contentMatch) {
      results.push({ name: 'cron-entry imports', ok: false, detail: 'Could not find generated cron entry content template' });
      return;
    }
    const generatedPath = resolve(ROOT, 'dist/cron-entry.js');
    const generatedDir = dirname(generatedPath);
    const missing = [];
    for (const match of contentMatch[1].matchAll(/(?:import|export)\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('../src/')) continue;
      const resolvedPath = resolve(generatedDir, specifier);
      if (!existsSync(resolvedPath)) missing.push(specifier);
    }
    results.push(
      missing.length === 0
        ? { name: 'cron-entry imports', ok: true }
        : { name: 'cron-entry imports', ok: false, detail: `Generated cron entry imports missing files: ${missing.join(', ')}` }
    );
  } catch (e) {
    results.push({ name: 'cron-entry imports', ok: false, detail: String(e) });
  }
}

runStep('astro check (types)', 'npx astro check');
runStep('lint (oxlint)', 'pnpm lint');
runStep('check:references', 'pnpm check:references');
runStep('check:post-quality', 'pnpm check:post-quality');
runStep('check:tw (台灣用語 A 級)', 'pnpm check:tw');
runStep('check:glossary', 'pnpm check:glossary');
runStep('check:series-order', 'pnpm check:series-order');
runStep('check:lang-parity', 'pnpm check:lang-parity');
runStep('check:seo-smoke', 'pnpm check:seo-smoke');
runStep('skills-sync (.agents ↔ .claude)', 'node scripts/check-skills-sync.mjs');
// check:links 故意不放這裡：它會打外網，pre-commit 不該依賴網路。手動或排程跑 `pnpm check:links`。
checkDailySkillTimezones();
checkProgress();
checkDurableObjectsExport();
checkCronEntryImports();

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
