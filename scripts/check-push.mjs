#!/usr/bin/env node
// pre-push 守門（simple-git-hooks 安裝到 .git/hooks/pre-push）。
// 規則：要推 main 時，origin/main 必須是即將推送的 commit 的 ancestor。
// 不是的話代表 remote 有你沒有的 commit，直接 push 會蓋掉別人的工作；先 pull --rebase。
// 治理依據：docs/governance/operating-charter.md「8.1 多 session 共用工作目錄」。

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const ZERO_SHA = /^0+$/;

function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options });
}

// git 會把推送內容從 stdin 傳進來：<local ref> <local sha> <remote ref> <remote sha>
// 手動在終端機執行時沒有 stdin，當成空輸入（改用目前分支判斷）。
const updates = (process.stdin.isTTY ? '' : readFileSync(0, 'utf8'))
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [localRef, localSha, remoteRef, remoteSha] = line.split(/\s+/);
    return { localRef, localSha, remoteRef, remoteSha };
  });

let target = null;
if (updates.length > 0) {
  const mainUpdate = updates.find(
    (update) => update.remoteRef === 'refs/heads/main' && !ZERO_SHA.test(update.localSha),
  );
  if (!mainUpdate) process.exit(0);
  target = mainUpdate.localSha;
} else {
  // 手動執行、沒有 stdin 時，退回檢查目前分支。
  const branch = git(['symbolic-ref', '--short', 'HEAD']).trim();
  if (branch !== 'main') process.exit(0);
  target = 'HEAD';
}

try {
  git(['fetch', '--quiet', 'origin', 'main'], { stdio: 'ignore', timeout: 20000 });
} catch {
  console.error('check-push: 無法 fetch origin/main，跳過守門檢查（請自行確認有沒有先 pull）。');
  process.exit(0);
}

try {
  git(['merge-base', '--is-ancestor', 'origin/main', target], { stdio: 'ignore' });
} catch {
  console.error('✋ push 被擋：origin/main 有你本機沒有的 commit。');
  console.error('   先跑 git pull --rebase origin main，再 push。');
  console.error('   （守門腳本：scripts/check-push.mjs）');
  process.exit(1);
}

// 系列規劃閘門：這次推送若動到 series.ts 或系列文章，立刻檢查，不等 CI 在 deploy 才發現。
// 為什麼：2026-11-24 認識 benchmark 系列沒帶規劃表就進了 main，CI 在 deploy 前才紅燈，
// 隔天整條 daily-digest 產線被同一個紅燈擋住（Q-054）。
// 只看這次推送的範圍（origin/main..target），不因 main 上別人欠的債擋住無關的推送。
let changed = null;
try {
  changed = git(['diff', '--name-only', 'origin/main', target]).split('\n').filter(Boolean);
} catch {
  // 讀不到差異時不擋，CI 的完整 verify 仍是最後一關。
}
if (changed) {
  const posts = changed.filter((f) => /^src\/content\/posts\/.+\.md$/.test(f) && existsSync(f));
  const seriesChanged = changed.includes('src/utils/series.ts') || changed.some((f) => f.startsWith('.work/series-plans/'));
  const args = seriesChanged ? [] : posts.length ? ['--staged', ...posts] : null;
  if (args) {
    try {
      execFileSync('node', ['scripts/check-series-plan.mjs', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (error) {
      console.error('✋ push 被擋：系列規劃表或審稿紀錄不齊。');
      console.error(String(error.stdout ?? '').trim());
      console.error('   （守門腳本：scripts/check-push.mjs → check-series-plan.mjs）');
      process.exit(1);
    }
  }
}
