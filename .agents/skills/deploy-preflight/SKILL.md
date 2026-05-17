---
name: deploy-preflight
description: Pre-deploy verification for the quidproquo Cloudflare Workers site. Run lint, astro check, tests, check:references, build, sanity-check git state and wrangler config, then produce a go/no-go report before `pnpm deploy`. Does NOT deploy. Use when user says 準備 deploy / 上線前檢查 / preflight / 部署前看一下.
---

# deploy-preflight skill

部署到 Cloudflare 前的最後檢查。**只檢查與報告，不執行 deploy**。

## 執行步驟

按順序跑；任何一步紅就停，列出 log 與修復建議。

### 1. Git 狀態

```bash
git status --short
git rev-parse --abbrev-ref HEAD
git log @{u}.. --oneline 2>/dev/null
```

報告未 commit 檔案、branch、本地 ahead/behind 狀態。

### 2. 依賴

```bash
pnpm install --frozen-lockfile
```

`pnpm-lock.yaml` 過期就要求先處理並 commit。

### 3. Lint

```bash
pnpm lint
```

error 一定修；warning 列給使用者決定。

### 4. 型別 / Astro 檢查

```bash
pnpm astro check
```

error 要修。已知 non-fatal warning 可列在報告中。

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

Build 成功才表示 cron stub、OG image 生成、Astro build 都 OK。`dist/` 不要 commit。

### 8. Wrangler / secrets 自查

讀 `wrangler.toml` / `wrangler.jsonc` / `dist/server/wrangler.json`，列出 D1、Vectorize、KV、AI binding。

不要讀或列出 secret 值。若要檢查，只列 secret 名稱是否存在，例如：

```bash
wrangler secret list
```

缺哪個就提醒使用者 `wrangler secret put <NAME>`。

### 9. Feature flags

所有 RAG、embedding、AI、experimental 功能必須有 feature flag。問清楚：

- 這次 deploy 有新的 RAG / AI 功能嗎？
- flag 預設關閉嗎？
- 開啟條件寫清楚了嗎？

### 10. go/no-go 報告

```text
Preflight: <branch>
✅ git clean
✅ lint
✅ astro check
✅ test
✅ check:references
✅ build
🟡 1 commit ahead of origin
🔴 missing secret: LANGFUSE_SECRET_KEY

建議：補 secret 後再 deploy
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 跑 build 就跳過 test | build 過不代表邏輯對 |
| 直接 deploy 不 preflight | Cloudflare 回滾比 preflight 慢 |
| 未 push 也 deploy | 線上版跟 git 對不上 |
| 忽略 secret 缺漏 | 線上會 runtime error |
| preflight 直接 deploy | 這個 skill 只檢查，不 deploy |

## 不在範圍

- 實際執行 `pnpm deploy`
- 設定 wrangler secret
- 建立 D1 / Vectorize / KV resource

## 詳細參考

- npm scripts：`package.json`
- Cloudflare 設定：`wrangler.toml` / `wrangler.jsonc` / `dist/server/wrangler.json`
