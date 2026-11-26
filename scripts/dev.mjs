// pnpm dev 的包裝：同一個 repo 只留一個 astro dev，閒置或啟動它的 session 結束就自己收掉。
// 為什麼：2026-10-28 發現一個 agent 開的 astro dev 被遺棄跑了 6 天（父程序已是 PID 1），
// 每次有人改檔案就重新處理，拖慢所有 session 的 astro check。
import { execFileSync, spawn } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = realpathSync(resolve(fileURLToPath(import.meta.url), '../..'));
const IDLE_HOURS = Number(process.env.DEV_IDLE_HOURS ?? 3);
// 刻意用 nohup 長開時設 DEV_KEEP_ALIVE=1，關掉閒置與孤兒檢查。
const KEEP_ALIVE = process.env.DEV_KEEP_ALIVE === '1';
const CHECK_INTERVAL_MS = 60_000;

/** ps 的 etime 格式 [[dd-]hh:]mm:ss 轉秒數。 */
export function parseEtime(etime) {
  const [days, rest] = etime.includes('-') ? etime.split('-') : ['0', etime];
  const parts = rest.split(':').map(Number);
  while (parts.length < 3) parts.unshift(0);
  const [h, m, s] = parts;
  return Number(days) * 86400 + h * 3600 + m * 60 + s;
}

/** astro dev 的請求紀錄長得像「12:00:01 [200] /posts/x 5ms」；檔案監看的重載訊息不算。 */
export function isRequestLine(line) {
  return /\[\d{3}\]\s+\/\S*/.test(line);
}

/** 只認 node 直接執行 astro 的 dev；指令文字裡碰巧有「astro dev」的 shell 不算，否則會被誤殺。 */
export function isAstroDevCommand(command) {
  return /^\S*node\s+\S*\/astro(?:\.mjs)?\s+dev(?:\s|$)/.test(command);
}

function processCwd(pid) {
  try {
    const out = execFileSync('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn'], { encoding: 'utf8' });
    return out.split('\n').find((l) => l.startsWith('n'))?.slice(1) ?? null;
  } catch {
    return null;
  }
}

/** 這個 repo 底下正在跑的 astro dev：pid、父程序、已跑秒數。 */
export function findRepoDevServers(root = ROOT) {
  let out;
  try {
    out = execFileSync('ps', ['-axo', 'pid=,ppid=,etime=,command='], { encoding: 'utf8' });
  } catch {
    return [];
  }
  return out
    .split('\n')
    .map((line) => line.trim().match(/^(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/))
    .filter((m) => m && isAstroDevCommand(m[4]) && Number(m[1]) !== process.pid)
    .map((m) => ({ pid: Number(m[1]), ppid: Number(m[2]), seconds: parseEtime(m[3]) }))
    .filter(({ pid }) => processCwd(pid) === root);
}

function parentOf(pid) {
  try {
    const [ppid, ...cmd] = execFileSync('ps', ['-o', 'ppid=,command=', '-p', String(pid)], { encoding: 'utf8' }).trim().split(/\s+/);
    return { ppid: Number(ppid), command: cmd.join(' ') };
  } catch {
    return null;
  }
}

/** 往上找到 pnpm（中間隔著 sh -c）；它被交給 PID 1，代表啟動它的終端機或 agent session 已經不在了。 */
function isOrphaned() {
  let pid = process.ppid;
  for (let depth = 0; depth < 4 && pid > 1; depth += 1) {
    const info = parentOf(pid);
    if (!info) return true;
    if (/\bp?npm\b/.test(info.command) || info.ppid === 1) return info.ppid === 1;
    pid = info.ppid;
  }
  return false;
}

async function stopExisting() {
  const old = findRepoDevServers();
  for (const { pid, seconds } of old) {
    process.stdout.write(`[dev] 收掉已在跑的 astro dev（PID ${pid}，跑了 ${Math.round(seconds / 3600)} 小時）\n`);
    try { process.kill(pid, 'SIGTERM'); } catch {}
  }
  if (old.length === 0) return;
  await new Promise((r) => setTimeout(r, 5000));
  for (const { pid } of old) {
    try { process.kill(pid, 'SIGKILL'); } catch {}
  }
}

async function main() {
  await stopExisting();
  const child = spawn(resolve(ROOT, 'node_modules/.bin/astro'), ['dev', ...process.argv.slice(2)], {
    cwd: ROOT,
    env: { ...process.env, ASTRO_DEV_BACKGROUND: '0' },
    stdio: ['inherit', 'pipe', 'inherit'],
  });

  let lastRequest = Date.now();
  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
    if (chunk.toString().split('\n').some(isRequestLine)) lastRequest = Date.now();
  });

  const shutdown = (reason) => {
    process.stdout.write(`\n[dev] ${reason}，結束 astro dev。要長開請設 DEV_KEEP_ALIVE=1。\n`);
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 5000).unref();
  };

  if (!KEEP_ALIVE) {
    const timer = setInterval(() => {
      if (isOrphaned()) shutdown('啟動它的 session 已結束');
      else if (IDLE_HOURS > 0 && Date.now() - lastRequest > IDLE_HOURS * 3600_000) shutdown(`${IDLE_HOURS} 小時沒有請求`);
      else return;
      clearInterval(timer);
    }, CHECK_INTERVAL_MS);
    timer.unref();
  }

  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => child.kill(signal));
  }
  child.on('exit', (code) => process.exit(code ?? 0));
}

function selfTest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`FAIL: ${msg}`); process.exitCode = 1; } };
  assert(parseEtime('06-03:01:00') === 6 * 86400 + 3 * 3600 + 60, 'etime 含天數');
  assert(parseEtime('26:12') === 26 * 60 + 12, 'etime 只有分秒');
  assert(parseEtime('01:02:03') === 3723, 'etime 時分秒');
  assert(isRequestLine('12:00:01 [200] /posts/ai/x 5ms'), '請求紀錄');
  assert(!isRequestLine('12:00:01 [watch] src/content/posts/a.md'), '檔案監看不算請求');
  assert(!isRequestLine('[200]'), '沒有路徑不算請求');
  assert(isAstroDevCommand('node /repo/node_modules/.pnpm/astro@7/node_modules/astro/bin/astro.mjs dev'), 'node 執行 astro.mjs dev');
  assert(isAstroDevCommand('node /repo/node_modules/.bin/astro dev --port 4322'), 'node 執行 .bin/astro dev 帶參數');
  assert(!isAstroDevCommand('/bin/zsh -c echo ASTRO_DEV_BACKGROUND=0 astro dev'), '指令文字含 astro dev 的 shell');
  assert(!isAstroDevCommand('node /repo/node_modules/astro/bin/astro.mjs check'), 'astro check 不算');
  assert(!isAstroDevCommand('node /bin/pnpm dev'), 'pnpm dev 本身不算');
  if (!process.exitCode) console.log('dev.mjs self-test OK');
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--self-test')) selfTest();
  else main();
}
