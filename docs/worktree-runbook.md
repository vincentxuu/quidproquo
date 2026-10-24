# 隔離 worktree 工作手冊

主工作目錄常有多個 session 的未提交改動（見 `docs/governance/operating-charter.md` §8.1）。要改程式、跑完整驗證或發布，又不想碰到別人的半成品時，從 origin/main 開一個獨立 worktree 做。

## 開 worktree

```bash
git fetch origin
git worktree add /private/tmp/quidproquo-<任務> -b <type>/<任務> origin/main
```

放在暫存目錄（`/private/tmp`、`$TMPDIR`），不要放進 repo 裡。

## 共用 node_modules

完整 `pnpm install` 一份約 2–4 GB。依賴沒變時，可以直接連到主 repo 的：

```bash
ln -s /Users/xiaoxu/Projects/quidproquo/node_modules node_modules
```

- `.gitignore` 的 `node_modules/` 只忽略目錄，符號連結會顯示成 `?? node_modules`。不要 commit 它。
- 分支的 `pnpm-lock.yaml` 和主 repo 不同時，連結會拿到錯的版本；改用 `pnpm install --frozen-lockfile`。
- dev server 若對 node_modules 的資源回 403、訊息是 `outside of Vite serving allow list`，表示 Vite 只允許讀 worktree 目錄。開一份不 commit 的本機設定，把主 repo 的 node_modules 加進允許清單：

```js
// astro.worktree.config.mjs（不要 commit）
import config from './astro.config.mjs';
export default {
  ...config,
  vite: {
    ...config.vite,
    server: {
      ...config.vite?.server,
      fs: { allow: [process.cwd(), '/Users/xiaoxu/Projects/quidproquo/node_modules'] },
    },
  },
};
```

```bash
node scripts/prepare-pdf-viewer.mjs && ASTRO_DEV_BACKGROUND=0 npx astro dev --config astro.worktree.config.mjs
```

## 改了 Markdown 外掛，預覽看到的還是舊 HTML

Astro 把 Markdown 的渲染結果存在 `.astro/data-store`，文章內容沒變就直接沿用，不會重跑 remark／rehype 外掛。改了 `src/plugins/**`，或外掛讀的資料檔（例如 `src/data/climbing-videos.ts`）之後：

- 預覽前先刪掉 **這個 worktree 自己的** `.astro/`。只改 Vite 的 `cacheDir` 沒有用。不要刪主工作目錄的 `.astro/`，別的 session 可能正在用。
- CI 的快取 key 已經包含外掛與相依（`deploy.yml`、`preview.yml`）。外掛新增讀取的資料檔時，要一併加進那兩個檔的 `hashFiles`，否則部署出去仍是舊 HTML（2026-10-23 路線影片表事件）。

## 收尾

1. commit 用 `git commit -- <明確路徑>`，push 後 `git log --oneline -1 origin/main` 確認是自己那筆。
2. 做完就移除：先刪 `node_modules` 連結，再 `git worktree remove <路徑>`。已合併的分支用 `git branch -D` 刪掉。
3. 只想留研究紀錄時，先把 `.work/` 裡要留的檔案複製回主工作目錄，再移除 worktree。

本機另有每週自動清理（`~/.local/bin/agent-tmp-prune`，週日 10:00）：只刪暫存目錄裡「已合併、沒有未提交改動、3 天沒動」的 worktree。有未提交改動的永遠不會被刪，要自己處理。
