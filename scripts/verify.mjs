#!/usr/bin/env node
// pnpm verify — the single canonical quality gate for this repo.
//
// Runs every fast, offline, deterministic check. If this is green, the
// working tree is safe to commit. Used by: Stop hook, preview CI, and the
// deploy quality gate. The pre-commit hook runs `--staged` (only the staged
// files; see stagedPlan). Full details: docs/governance/operating-charter.md.
//
// Deliberately NOT included (slow or network-dependent): pnpm test,
// pnpm build, post-quality/glossary advisory checks.
// Those belong to deploy-preflight, CI build, or per-skill flows.
// astro check IS included — catches TS errors that block CI deploy.

import { exec, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { promisify } from 'node:util';

const ROOT = resolve('.');
const results = [];
const execAsync = promisify(exec);

async function runStep(name, command) {
  try {
    await execAsync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    return { name, ok: true };
  } catch (error) {
    const out = [error.stdout, error.stderr].map((s) => s?.toString().trim()).filter(Boolean).join('\n');
    return { name, ok: false, detail: out || error.message };
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

const FULL_STEPS = [
  ['astro check (types)', 'npx astro check'],
  ['lint (oxlint)', 'pnpm lint'],
  ['check:references', 'pnpm check:references'],
  ['check:post-quality', 'pnpm check:post-quality'],
  ['check:tw (台灣用語 A 級)', 'pnpm check:tw'],
  ['check:chat-style', 'pnpm check:chat-style'],
  ['check:glossary', 'pnpm check:glossary'],
  ['check:series-order', 'pnpm check:series-order'],
  ['course title regression tests', 'node .agents/skills/post/scripts/check-course-titles.mjs --self-test'],
  ['course title gate', 'node .agents/skills/post/scripts/check-course-titles.mjs'],
  ['course layout regression tests', 'node .agents/skills/post/scripts/check-course-guide-layout.mjs --self-test'],
  ['course source layout gate', 'node .agents/skills/post/scripts/check-course-guide-layout.mjs'],
  ['check:lang-parity', 'pnpm check:lang-parity'],
  ['check:course-videos', 'pnpm check:course-videos'],
  ['check:seo-smoke', 'pnpm check:seo-smoke'],
  ['skills-sync (.agents ↔ .claude)', 'node scripts/check-skills-sync.mjs'],
  ['skill-anchors (章節連結)', 'node scripts/check-skill-anchors.mjs'],
];

// --staged（pre-commit 用）：只檢查這次暫存的檔案；完整 verify 由 CI 跑（quality.yml，deploy 前必過）。
// 安全邊界：暫存區只有文章、skill／docs 的 Markdown、.work、progress.txt 時才縮小範圍；
// 只要動到程式碼、設定、腳本，或刪除／改名文章（別篇可能連過來），一律退回完整 verify。
function stagedPlan() {
  const out = execSync('git diff --cached --name-status -M', { cwd: ROOT, encoding: 'utf8' });
  const entries = out.split('\n').filter(Boolean).map((line) => {
    const [status, ...paths] = line.split('\t');
    return { status: status[0], path: paths.at(-1) };
  });
  const isPost = (p) => /^src\/content\/posts\/.+\.md$/.test(p);
  const isSafe = (p) =>
    isPost(p)
    || /^(\.agents|\.claude)\/skills\/.+\.md$/.test(p)
    || /^docs\/.+\.md$/.test(p)
    || p.startsWith('.work/')
    || p === 'progress.txt';
  const fullReason =
    entries.find((e) => !isSafe(e.path))?.path
    ?? entries.find((e) => isPost(e.path) && (e.status === 'D' || e.status === 'R'))?.path;
  if (fullReason) return { full: true, reason: fullReason };

  const posts = entries.filter((e) => isPost(e.path)).map((e) => e.path);
  const zhPosts = posts.filter((p) => !p.endsWith('-en.md'));
  const quote = (files) => files.map((f) => `'${f.replaceAll("'", "'\\''")}'`).join(' ');
  const pick = (...names) => FULL_STEPS.filter(([name]) => names.includes(name));
  const steps = [];
  if (posts.length > 0) {
    steps.push(
      ['check:references (staged)', `node scripts/check-post-references.mjs ${quote(posts)}`],
      ['check:post-quality (staged)', `node scripts/check-post-quality.mjs ${quote(posts)}`],
      ['check:glossary (staged)', `node scripts/check-glossary-coverage.mjs ${quote(posts)}`],
    );
    if (zhPosts.length > 0) steps.push(['check:tw (staged)', `node scripts/check-tw-terms.mjs ${quote(zhPosts)}`]);
    // 這些看的是文章之間的關係（系列編號、中英成對、課程標題與版面），本來就要全站看；實測每項 2 秒內。
    steps.push(...pick('check:chat-style', 'check:series-order', 'course title gate', 'course source layout gate',
      'check:lang-parity', 'check:course-videos', 'check:seo-smoke'));
  }
  if (entries.some((e) => /^(\.agents|\.claude)\/skills\//.test(e.path))) {
    steps.push(...pick('skills-sync (.agents ↔ .claude)', 'skill-anchors (章節連結)'));
  }
  return { full: false, steps, count: entries.length };
}

let steps = FULL_STEPS;
let header = '=== pnpm verify ===';
if (process.argv.includes('--staged')) {
  const plan = stagedPlan();
  if (plan.full) {
    header = `=== pnpm verify --staged → 完整 verify（暫存區含 ${plan.reason}）===`;
  } else {
    steps = plan.steps;
    header = `=== pnpm verify --staged（${plan.count} 個暫存檔、${steps.length} 項檢查；完整 verify 在 CI）===`;
  }
}

const commandResults = await Promise.all(steps.map(([name, command]) => runStep(name, command)));
results.push(...commandResults);
// check:links 故意不放這裡：它會打外網，pre-commit 不該依賴網路。手動或排程跑 `pnpm check:links`。
checkDailySkillTimezones();
checkProgress();
checkDurableObjectsExport();
checkCronEntryImports();

let failed = 0;
process.stdout.write(`\n${header}\n`);
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
