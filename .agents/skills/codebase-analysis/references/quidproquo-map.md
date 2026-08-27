# quidproquo（本 repo）的目錄地圖

Astro 6 SSR（`output: server`）＋ Cloudflare Workers adapter；D1（SQLite）、Vectorize、KV、R2、Queue、AI binding。
pnpm；oxlint；i18n zh-TW（無前綴）／en（`/en/...`）。完整規範見 `CLAUDE.md`，治理見 `docs/governance/operating-charter.md`。

## 目錄

```
src/
  content/posts/<category>/   # Markdown 文章（glob 載入）；content.config.ts 定 schema
  pages/                      # 路由：index、posts、search、rss.xml.ts、llms.txt.ts、categories、tags、series、en/、daily、chat
  pages/admin/*.astro         # 後台頁：rag、providers、jobs、traces、pipelines、agent-*、settings…
  pages/api/admin/**          # 後台 API：rag.ts、rag-eval.ts、providers、pipelines、agents、flows、evidence、policies…
  pages/api/auth/             # 登入
  components/                 # Astro／TSX 元件（Chat、Search、admin、PostCard、RelatedPosts）
  layouts/
  lib/                        # 伺服端邏輯（見下表）
  server/                     # Worker 進入點相關
  utils/                      # content.ts、series.ts、i18n-pairing.ts、relatedPosts.ts
  plugins/                    # remark（readingTime）
  i18n/
scripts/                      # verify.mjs 與 check-*.mjs 閘門、sync-to-d1.ts、generate-og-images、create-cron-*、eval-rag-baseline
docs/                         # governance、content-plan-*、progress-archive
.research/                    # 研究筆記
```

## `src/lib` 速查

| 目錄 | 管什麼 |
|---|---|
| `rag/` | embedding、providers、settings、state、sync-to-d1、admin-eval、`agents/`、`tools/`——RAG 主線 |
| `db/` | settings-store（D1 設定） |
| `search-tools.ts`、`crawl/`、`research/` | 站內搜尋工具、爬取、deep-research |
| `agent-*`（foundation／evidence／flow／artifact／policy／providers／os／console／skills） | agent 平台各層；狀態見 `docs/progress-archive.md` 與 escalation-queue |
| `pipelines/` | 內容管線 |
| `chat/`、`api/response.ts`、`auth/` | chat 端點、統一回應格式、session |
| `glossary/`、`translations/`、`markdown-toc.ts` | 內容輔助 |
| `langfuse.ts`、`workers-ai-models.ts`、`config/` | 觀測、模型清單、設定 |

## Bindings（`wrangler.jsonc`）

`DB`（D1 `quidproquo-db`）、`VECTORIZE_INDEX`、`AI`、`SESSION`／`RATE`／`DEEP_RESEARCH_KV`（KV）、`R2_IMAGES`／`R2_AGENT_MEMORY`／`R2_AGENT_ARTIFACT`、`AGENT_QUEUE`、`ASSETS`；`crons` 於同檔。
追資料流時，binding 名稱就是 grep 的關鍵字（`env.DB`、`env.VECTORIZE_INDEX`）。

## 追資料流的三條常見線

1. **文章**：`src/content/posts` → `content.config.ts` schema → `pages/posts/[...]`／`en/` → `utils/content.ts`、`series.ts`；建置後 Pagefind 索引；`scripts/sync-to-d1.ts` 同步到 D1。
2. **RAG／chat**：`pages/chat.astro`＋`components/Chat` → `pages/api/...` → `lib/rag/*`（embedding → Vectorize → provider）→ `lib/langfuse.ts` 追蹤。**每個進階功能都有 feature flag**（`lib/rag/settings.ts`／`db/settings-store.ts`），分析時先確認 flag 預設值。
3. **後台**：`pages/admin/*.astro` → `pages/api/admin/**` → `lib/agent-*`／`lib/rag/admin-eval.ts` → D1／R2／Queue。

## 定位指令

```bash
grep -rnw "VECTORIZE_INDEX" src/            # 依 binding 找用法
grep -rnE "export (async )?function \w+" src/lib/rag/*.ts
grep -rn "featureFlag\|isEnabled\|flags\." src/lib/rag/settings.ts
ls src/pages/api/admin                       # 後台 API 一覽
```

## 注意

- `astro check` 在 `src/lib`、`src/server` 有既有 TS error（見 progress.txt），不是你分析的功能造成的，報告裡分開寫。
- `.claude/skills/` 是鏡像，分析 skill 請看 `.agents/skills/`。
- 測試檔與實作同目錄（`*.test.ts`），要看行為先看測試。
