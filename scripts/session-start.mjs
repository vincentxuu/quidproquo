import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { findRepoDevServers } from './dev.mjs';
import { findPullCollisions, formatList, parseStatus } from './lib/git-status.mjs';

const ROOT = resolve('.');
const PROGRESS_PATH = resolve(ROOT, 'progress.txt');

if (process.argv.includes('--self-test')) {
  const parsed = parseStatus(' M src/a.md\n?? .work/b.md\nR  old.md -> new.md\n');
  assert.deepEqual(parsed.tracked, ['src/a.md', 'new.md']);
  assert.deepEqual(parsed.untracked, ['.work/b.md']);
  const collisions = findPullCollisions(parsed, {
    changedByRemote: new Set(['src/a.md', 'other.md']),
    trackedByRemote: new Set(['.work/b.md', '.work/c.md']),
  });
  assert.deepEqual(collisions.tracked, ['src/a.md']);
  assert.deepEqual(collisions.untracked, ['.work/b.md']);
  assert.equal(formatList(['a']), '  a');
  assert.match(formatList(Array.from({ length: 12 }, (_, i) => `f${i}`), 10), /還有 2 個/);
  console.log('session-start --self-test: ok');
  process.exit(0);
}

function printSection(title, body) {
  process.stdout.write(`\n=== ${title} ===\n`);
  process.stdout.write(`${body}\n`);
}

function runCommand(title, command, options = {}) {
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    }).trim();
    printSection(title, output || '(no output)');
    return true;
  } catch (error) {
    const stdout = error.stdout?.toString().trim();
    const stderr = error.stderr?.toString().trim();
    const combined = [stdout, stderr].filter(Boolean).join('\n');
    printSection(title, combined || error.message);
    return false;
  }
}

printSection('pwd', ROOT);
runCommand('git log -1 --oneline', 'git log -1 --oneline');

if (existsSync(PROGRESS_PATH)) {
  const progress = readFileSync(PROGRESS_PATH, 'utf8').trim();
  printSection('progress.txt', progress || '(empty progress.txt)');
} else {
  printSection('progress.txt', '(missing progress.txt)');
}

// 被遺棄的 astro dev 會拖慢所有 session 的 astro check；開工時先列出來。
const staleDev = findRepoDevServers().filter(({ seconds, ppid }) => seconds > 3 * 3600 || ppid === 1);
if (staleDev.length > 0) {
  printSection(
    'stale astro dev',
    staleDev
      .map(({ pid, ppid, seconds }) => `PID ${pid}：已跑 ${Math.round(seconds / 3600)} 小時${ppid === 1 ? '，啟動它的 session 已結束' : ''}。不用了就 kill ${pid}`)
      .join('\n'),
  );
}

// 每日 routine 一天推十幾筆到 main；本機 commit 放著不推，下次 pull 就是一大串 merge（2026-11-09：本機 5 筆放 10 天、落後 84 筆）。
try {
  execSync('git fetch --quiet origin main', { cwd: ROOT, stdio: 'ignore', timeout: 20000 });
  const [behind, ahead] = execSync('git rev-list --left-right --count origin/main...HEAD', { cwd: ROOT, encoding: 'utf8' })
    .trim().split(/\s+/).map(Number);
  const notes = [];
  if (ahead > 0) notes.push(`本機有 ${ahead} 筆沒推的 commit：做完就 push（git pull --rebase origin main && git push origin main）`);
  if (behind > 20) notes.push(`落後 origin/main ${behind} 筆：開工前先 git pull --rebase origin main`);
  if (notes.length) printSection('git sync', notes.join('\n'));
} catch {
  printSection('git sync', '（無法 fetch origin，略過同步檢查）');
}

// 未 commit 的改動若與 origin/main 重疊，pull 就是衝突或被拒絕 checkout
// （2026-11-13：46 篇 11-09 重查放了 4 天，3 個未追蹤 .work 檔案擋住 rebase）。
try {
  const { tracked, untracked } = parseStatus(execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }));
  if (tracked.length > 0 || untracked.length > 0) {
    const changedByRemote = new Set(
      execSync('git diff --name-only HEAD origin/main', { cwd: ROOT, encoding: 'utf8' })
        .trim().split('\n').filter(Boolean),
    );
    const trackedByRemote = new Set(
      execSync('git ls-tree -r --name-only origin/main', { cwd: ROOT, encoding: 'utf8' })
        .trim().split('\n').filter(Boolean),
    );
    const collisions = findPullCollisions({ tracked, untracked }, { changedByRemote, trackedByRemote });
    const lines = [`未 commit 的改動 ${tracked.length} 個、未追蹤檔案 ${untracked.length} 個。`];
    if (collisions.tracked.length > 0) {
      lines.push('這些檔案 origin/main 也改過，現在 pull 會衝突：', formatList(collisions.tracked));
    }
    if (collisions.untracked.length > 0) {
      lines.push('這些未追蹤檔案 origin/main 已納入版控，現在 pull 會被擋：', formatList(collisions.untracked));
    }
    lines.push(
      collisions.tracked.length > 0 || collisions.untracked.length > 0
        ? '先 commit 或 stash，再 git pull --rebase origin main。'
        : '收工前 commit 或 stash，不要跨 session 留著。',
    );
    printSection('working tree', lines.join('\n'));
  }
} catch {
  printSection('working tree', '（無法讀取 git 狀態，略過 dirty 檢查）');
}

const verifyOk = runCommand('pnpm verify', 'pnpm verify');
process.exitCode = verifyOk ? 0 : 1;
