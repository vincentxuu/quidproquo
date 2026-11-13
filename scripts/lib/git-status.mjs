// git 工作區狀態的純函式：session-start 用它預警「現在 pull 會撞到什麼」。
// 2026-11-13 事故：11-09 的 46 篇課程重查放了 4 天沒 commit，遠端 routine 對同一批檔案
// 做了更新版；pull 時整批衝突，另外 3 個未追蹤的 .work 檔案也擋住 checkout。

// 解析 `git status --porcelain`：已追蹤改動（rename 取新路徑）與未追蹤檔案分開。
export function parseStatus(output) {
  const tracked = [];
  const untracked = [];
  for (const raw of output.split('\n')) {
    if (raw.trim() === '') continue;
    const code = raw.slice(0, 2);
    let file = raw.slice(3).trim();
    const arrow = file.indexOf(' -> ');
    if (arrow !== -1) file = file.slice(arrow + 4);
    if (file.startsWith('"') && file.endsWith('"')) file = file.slice(1, -1);
    if (code === '??') untracked.push(file);
    else tracked.push(file);
  }
  return { tracked, untracked };
}

// 會被 pull 蓋掉的檔案：
// - 已追蹤改動 ∩ origin/main 也改過的檔案 → pull 會衝突
// - 未追蹤檔案 ∩ origin/main 已納入版控的路徑 → checkout 會被拒絕
export function findPullCollisions({ tracked, untracked }, { changedByRemote, trackedByRemote }) {
  return {
    tracked: tracked.filter((file) => changedByRemote.has(file)),
    untracked: untracked.filter((file) => trackedByRemote.has(file)),
  };
}

export function formatList(files, limit = 10) {
  if (files.length <= limit) return files.map((file) => `  ${file}`).join('\n');
  return [
    ...files.slice(0, limit).map((file) => `  ${file}`),
    `  …還有 ${files.length - limit} 個`,
  ].join('\n');
}
