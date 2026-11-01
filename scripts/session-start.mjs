import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { findRepoDevServers } from './dev.mjs';

const ROOT = resolve('.');
const PROGRESS_PATH = resolve(ROOT, 'progress.txt');

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

const verifyOk = runCommand('pnpm verify', 'pnpm verify');
process.exitCode = verifyOk ? 0 : 1;
