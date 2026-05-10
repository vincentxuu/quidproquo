---
name: deploy-preflight
description: Pre-deploy verification for the quidproquo Cloudflare Workers site — run lint / astro check / tests / check:references, sanity-check git state and wrangler config, and produce a go/no-go report before `pnpm deploy`. Does NOT deploy. Use when user says 準備 deploy / 上線前檢查 / preflight / 部署前看一下.
---

# deploy-preflight skill

部署到 Cloudflare 前的最後檢查。**只檢查與報告，不執行 deploy**。失敗項目要先修才能上線。

## 執行步驟

按順序跑，**任何一步紅就停**，把 log 給使用者看。

### 1. Git 狀態

```bash
git status --short
git rev-parse --abbrev-ref HEAD
git log @{u}.. --oneline 2>/dev/null
```

報告：
- 有沒有未 commit 的檔案
- 在哪個 branch（不是 main / master 要警告）
- 本地有幾個 commit 還沒 push
- 是否落後 origin

### 2. 依賴

```bash
pnpm install --frozen-lockfile
```

`pnpm-lock.yaml` 過期 → 先 `pnpm install` 更新並要求 commit。

### 3. Lint

```bash
pnpm lint
```

oxlint，error 一定修；warning 列給使用者看，自己決定。

### 4. 型別 / Astro 檢查

```bash
pnpm astro check
```

CLAUDE.md 提到 require CJS warning from Workers adapter 是 non-fatal。其他 error 要修。

### 5. Tests

```bash
pnpm test
```

全綠才能過。沒測試的功能標記為「無覆蓋風險」。

### 6. 文章參考資料

```bash
pnpm check:references
```

最近改過的 post 一定要過。

### 7. Build dry-run

```bash
pnpm build
```

Build 成功才表示 cron stub、OG image 生成、astro build 都 OK。Build artifacts 在 `dist/`，不要 commit。

### 8. Wrangler / secrets 自查

讀 `wrangler.toml` 或 `wrangler.jsonc`，列出：

- D1 binding（資料庫名、id）
- Vectorize binding
- KV binding
- AI binding
- 預期需要的 secrets（從 progress.txt：`ANTHROPIC_API_KEY` / `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `ADMIN_PASSWORD`）

不**讀**或**列出** secret 值。只檢查 `wrangler secret list` 是否齊全：

```bash
wrangler secret list
```

缺哪個就列哪個，提醒使用者 `wrangler secret put <NAME>`。

### 9. Feature flags 確認

CLAUDE.md：「Feature flags are mandatory for all advanced/experimental techniques (RAG, embeddings, AI features)」。

問使用者：
- 這次 deploy 有新的 RAG / AI 功能嗎？
- flag 預設關閉嗎？
- 開啟條件寫清楚了嗎？

### 10. 產出 go/no-go 報告

```
Preflight: <branch>
─────────────────────
✅ git clean
✅ lint
✅ astro check
🟡 1 commit ahead of origin (建議先 push)
✅ test (24 passed)
✅ check:references
✅ build
🟡 wrangler secret 缺：LANGFUSE_SECRET_KEY
─────────────────────
建議：補 LANGFUSE_SECRET_KEY 後再 deploy
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「跑 build 就跳過 test」 | build 過 ≠ 邏輯對；test 是另一條防線 |
| 「直接 `pnpm deploy` 不 preflight」 | Cloudflare 部署回滾要重新 build，比 preflight 慢得多 |
| 「未 push 也 deploy」 | 線上版跟 git 對不上，後續查 bug 找不到對應 commit |
| 「忽略 wrangler secret 缺」 | 線上會 runtime error，使用者第一個發現問題 |
| 「直接幫 deploy」 | preflight 不 deploy；通過後使用者自己決定要不要 `pnpm deploy` |

## 不在這個 skill 範圍

- 實際執行 `pnpm deploy`（使用者自己跑）
- 設定 wrangler secret（使用者自己 `wrangler secret put`）
- 建立 D1 / Vectorize / KV resource（一次性，不在 preflight）

## 詳細參考

- 部署相關 npm script：`package.json` → `deploy`、`build`
- Cloudflare 設定：`wrangler.toml` / `wrangler.jsonc`
