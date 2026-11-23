<div align="center">

# quidproquo

**內建 AI 內容引擎的中英雙語個人部落格。**

[![Deploy](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml/badge.svg)](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml)
![Status](https://img.shields.io/badge/status-active_development-orange.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare_Workers-f38020.svg)

[快速開始](#快速開始) · [功能總覽](#功能總覽) · [部署](#部署到-cloudflare) · [架構](#運作方式) · [後台](#admin-主控台與-agent-平台) · [文件](#文件)

[English](README.md) · [繁體中文](README.zh-TW.md)

</div>

quidproquo 是 [quidproquo.cc](https://quidproquo.cc) 的原始碼——以 Astro（SSR）建構、部署在 Cloudflare Workers 上的個人部落格。文章以 Markdown 撰寫，雙語提供（預設 `zh-TW`，英文版在 `/en/` 底下），並同步進 D1。檢索層結合 Vectorize、D1 關鍵字搜尋與 Cloudflare AI Search，支撐混合搜尋、相關文章與聊天端點；後台則在同一平台上執行 agent session、排程 routine 與 flow。

> [!IMPORTANT]
> 這是持續開發中的個人專案。D1 schema、API 路由與內容管線可能隨時調整，不預期作為通用的部落格框架使用。

## 技術組成

| 層 | 技術 |
| --- | --- |
| 框架 | Astro 7（SSR，`output: server`）、TypeScript、React islands、Tailwind CSS 4 |
| 執行環境 | Cloudflare Workers（`@astrojs/cloudflare`、Node.js 相容）、Durable Objects |
| 資料庫 | D1（SQLite）：文章、分塊、詞彙表、單字本、agent session、skills／MCP／plugins |
| 搜尋 | Vectorize（Workers AI embedding）＋ D1 關鍵字搜尋＋ Cloudflare AI Search，以加權 RRF 融合 |
| AI | Workers AI、LangChain／LangGraph adapters、Vercel AI SDK、Langfuse 追蹤 |
| 非同步 | Cloudflare Queues（agent 執行，含 DLQ）、cron triggers |
| 儲存 | R2（圖片、agent 記憶、artifact）、KV（session、rate limit、深度研究狀態） |
| 認證 | 有設定時走 Cloudflare Access（middleware 驗 JWT 簽章）；否則退回 KV session cookie |
| 品質 | oxlint、自訂 `scripts/check-*.mjs`、`pnpm verify` 關卡 |
| 測試 | Vitest、Playwright（視覺基準、axe 無障礙檢查） |
| i18n | `zh-TW`（預設，無前綴）＋ `en`（`/en/...`），含雙語對齊檢查 |

## 功能總覽

| 領域 | 說明 | 所在位置 |
| --- | --- | --- |
| 雙語部落格 | Markdown/MDX 文章，含分類、標籤、系列文、RSS、sitemap、`llms.txt` 與 OG 圖片產生 | `src/content/posts/`、`src/pages/` |
| 搜尋與聊天 | 混合檢索（向量＋關鍵字＋AI Search），單一來源失敗時降級；相關文章；聊天 API | `src/pages/api/search.ts`、`src/pages/api/chat.ts`、`src/lib/retrieval/` |
| 深度研究 | 多步驟研究流程，含證據追蹤與佇列化的 agent 執行 | `src/pages/api/deep-research.ts`、`flows/` |
| 學習區 | 詞彙表、英文單字與口說練習、每日摘要、收藏館、專案 | `src/pages/glossary/`、`vocabulary/`、`english.astro`、`daily/`、`collection/` |
| 內容管線 | 爬蟲、影音轉文章、翻譯與每日摘要排程 | `src/lib/crawl/`、`src/lib/digest/`、`scripts/` |
| Admin 主控台 | Home／Sessions／Routines／Flows／Settings，含擴充管理（skills、MCP servers、plugins、hooks、marketplace） | `src/pages/admin/`、`src/pages/api/admin/` |
| 品質關卡 | Lint、文章互引、用語、雙語對齊、詞彙表、系列順序、連結、圖表、skills 同步檢查 | `scripts/check-*.mjs`、`pnpm verify` |

## 快速開始

需求：Node.js 22.12+ 或 24（`.nvmrc` 釘 24）、pnpm 10 與 Git。只有瀏覽器測試需要 Playwright。

```bash
git clone https://github.com/vincentxuu/quidproquo.git
cd quidproquo
pnpm install
pnpm dev        # http://localhost:4321，含 Cloudflare platform proxy
```

`pnpm dev` 走 `scripts/dev.mjs`：啟動時收掉同 repo 舊的 dev server，閒置 3 小時（`DEV_IDLE_HOURS`）自動關閉；要長開設 `DEV_KEEP_ALIVE=1`。

```bash
pnpm sync        # 文章同步到本地 D1
pnpm sync:prod   # 文章同步到正式環境 D1
```

### 常用指令

| 指令 | 用途 |
| --- | --- |
| `pnpm build` | 建構正式版本至 `./dist/`（含 cron entry、渲染檢查與 OG 圖片產生） |
| `pnpm preview` | 本地預覽正式建構結果 |
| `pnpm lint` | oxlint 靜態分析 |
| `pnpm test` | Vitest 測試 |
| `pnpm test:visual` | Playwright 視覺與無障礙測試 |
| `pnpm verify` | 完整品質關卡（lint、互引、品質、詞彙表、雙語對齊、skills 同步、progress 規範） |
| `pnpm verify:staged` | pre-commit 用：只檢查暫存檔，動到程式碼／設定／腳本時退回完整 `verify` |
| `pnpm skills:sync` | 由 `.agents/skills/` 重建 `.claude/skills/` 鏡像 |
| `pnpm eval:rag` | 執行 RAG 基準評估 |
| `pnpm session:start` | 顯示最新 commit 與 `progress.txt`，再跑一次 `verify` |

## 部署到 Cloudflare

push 到 `main` 會觸發 [`deploy.yml`](.github/workflows/deploy.yml)：品質關卡 → 建構 → `d1 migrations apply` → `wrangler deploy`。文章內容有變動時，接著呼叫 [`content-index.yml`](.github/workflows/content-index.yml) 同步 D1 與 embedding，並檢查搜尋索引是否跟上。

需要的 secrets：`CLOUDFLARE_API_TOKEN`（建構、migration、部署）與 `INDEX_SYNC_SECRET`（對已部署 Worker 做受保護的內容與 embedding 同步）。

手動部署：

```bash
pnpm exec wrangler login
pnpm run deploy
```

`pnpm run deploy` 會先建構，再以產生的 `dist/server/wrangler.json` 部署。cron triggers（爬蟲、摘要、資料保留）與 `preview` 環境定義於 [`wrangler.jsonc`](wrangler.jsonc)；維運細節見 [`docs/cloudflare-deployment-runbook.md`](docs/cloudflare-deployment-runbook.md)。

### Cloudflare 資源

| Binding | 類型 | 用途 |
| --- | --- | --- |
| `ASSETS` | Assets | 靜態資源服務 |
| `SESSION` | KV | Session 儲存 |
| `RATE` | KV | Rate limiting |
| `DEEP_RESEARCH_KV` | KV | 深度研究狀態 |
| `DB` | D1 | 所有關聯式資料（`quidproquo-db`） |
| `VECTORIZE_INDEX` | Vectorize | 向量搜尋（`quidproquo-vectors`） |
| `AI_SEARCH` | AI Search | 託管搜尋實例（`quidproquo-public`） |
| `AI` | Workers AI | Embedding 與推論 |
| `AGENT_SESSION_DO` | Durable Object | 每個 agent session 的狀態（`AgentSessionDO`） |
| `R2_IMAGES` | R2 | 圖片儲存 |
| `R2_AGENT_MEMORY` | R2 | Agent 記憶外存 |
| `R2_AGENT_ARTIFACT` | R2 | Agent artifact |
| `AGENT_QUEUE` | Queues | 背景 agent 執行（含 DLQ） |

資料庫 migration 在 [`migrations/`](migrations/)，部署時自動套用。核心資料表包括 `posts`、`post_chunks`、`doc_chunks`、`glossary_terms`、agent session／evidence／artifact 相關表、`user_skills`、`mcp_servers`、`plugins`，以及單字本與個人進度表。

## 為什麼是 quidproquo？

- **內容即資料：** 每篇文章都是純 Markdown 並同步進 D1，搜尋、推薦與分析都查詢同一個事實來源。
- **RAG 原生：** 分塊、嵌入、混合融合、評估（`pnpm eval:rag`）與 trace 保留都是 repository 的一部分。
- **雙語從根本做起：** 語言對齊與繁體中文用語檢查確保兩個版本一致。
- **發布前品質關卡：** 互引、系列順序、詞彙表覆蓋、連結與圖表幾何都在本機與 CI 驗證。
- **單一平台：** 運算、儲存、搜尋、佇列、Durable Objects 與 AI 全部在 Cloudflare 上。
- **功能旗標：** 每個進階 AI 功能都能透過 `wrangler.jsonc` vars 個別開關。

## 運作方式

```text
訪客 / 管理員
    |
    v
Astro SSR on Cloudflare Workers    Access／session 認證、rate limiting、i18n 路由
    |
    +-- pages                      部落格、分類、標籤、系列、搜尋、詞彙表、單字本、收藏館
    +-- api                        聊天、混合搜尋、深度研究、爬蟲、admin
    +-- D1                         文章、分塊、詞彙表、agent 與擴充資料
    +-- Vectorize + AI Search      embedding 與語意檢索
    +-- Durable Objects            agent session 狀態與 sandbox
    `-- Queues                     背景 agent 與摘要排程
```

文章以 Markdown 撰寫於 `src/content/posts/<category>/`，經 `src/content.config.ts` 型別檢查、check scripts 驗證後，由 [`scripts/sync-to-d1.ts`](scripts/sync-to-d1.ts) 同步到 D1，[`scripts/sync-embeddings-prod.mjs`](scripts/sync-embeddings-prod.mjs) 寫入 Vectorize。SSR 網站直接讀取 D1，讓已發布內容、搜尋索引與 RAG 分塊保持一致。

## Admin 主控台與 agent 平台

後台在 `/admin`（需登入；`AGENT_CONSOLE_ENABLED` 關閉時整個停用），五個一級分頁：

| 分頁 | 用途 |
| --- | --- |
| Home | 輸入框、待你處理的項目、近期 session、用量 |
| Sessions | Agent session 的事件流、步驟、diff、核可、evidence 與 artifact |
| Routines | 排程 agent 工作（建立、編輯、執行紀錄） |
| Flows | `flows/` 定義的宣告式流程 |
| Settings | 模型、權限、存取、環境、GitHub、通知、網站與**擴充** |

擴充（`/admin/settings/extensions`）管理 agent 的擴充層：skills（`SKILL.md` 格式；專案 skill 在 `.agents/skills/` 進版控，使用者 skill 存 D1／R2）、MCP servers（`stdio`、`http`、`sse`）、plugins（打包 skills＋MCP servers）、hooks（`PreToolUse`／`PostToolUse`／`SessionStart`／`Stop`）與 marketplace。API 在 `/api/admin/settings/extensions/*`，完整路由表見 [`docs/admin-route-map.md`](docs/admin-route-map.md)。

## 環境變數

透過 `wrangler.jsonc` 的 `vars` 或 Cloudflare dashboard 設定；`AGENT_*` 旗標都是布林值，完整清單與預設值以 [`wrangler.jsonc`](wrangler.jsonc) 為準。

| 變數 | 說明 |
| --- | --- |
| `LLM_PROVIDER` | 預設模型供應商（`openai`、`anthropic`、`gemini`、`groq`、`openrouter`） |
| `ACCESS_TEAM_DOMAIN`、`ACCESS_AUD` | Cloudflare Access 團隊網域與應用程式 audience；任一 `ACCESS_*` 有設定，後台與私人路由就要求通過驗證的 Access JWT（設定不完整時回 503） |
| `ACCESS_ALLOWED_EMAILS` | 允許通過 Access 保護路由的 email，逗號分隔 |
| `AGENT_OS_*` | Agent OS kernel 與角色（planner、research、writer、critic）、外部 MCP 工具、佇列排程 |
| `AGENT_CONSOLE_ENABLED` | `/admin` 的總開關 |
| `AGENT_EVIDENCE_ENABLED` | 證據追蹤 |
| `AGENT_ARTIFACT_*` | Artifact 輸出（CSV、PDF、PPTX、Notion、Slack、GitHub issue／PR、email） |
| `AGENT_PROVIDERS_*` | Provider router 與各供應商開關（LLM、搜尋、reader、知識來源） |
| `ADMIN_PASSWORD` | 未設定 Access 時，session cookie 登入用的密碼 |
| `CRAWL_SECRET` | 爬蟲 webhook 的密鑰 |

## 專案現況

- 已上線於 [quidproquo.cc](https://quidproquo.cc)，自 `main` 自動部署。
- 進行中的工作見 [`progress.txt`](progress.txt)、[`docs/TODO.md`](docs/TODO.md) 與 [`docs/content-pipeline-roadmap.md`](docs/content-pipeline-roadmap.md)。

## 文件

- [文件導覽](docs/README.md)
- [營運章程](docs/governance/operating-charter.md)
- [設計系統](docs/design-system.md)
- [Admin 路由地圖](docs/admin-route-map.md)
- [AI agent 內容系統](docs/ai-agent-content-system.md)
- [內容管線藍圖](docs/content-pipeline-roadmap.md)
- [翻譯管線](docs/translation-pipeline.md)
- [YT 轉文章管線](docs/yt-to-post-pipeline.md)
- [RAG trace 保留政策](docs/rag-trace-retention-policy.md)
- [Cloudflare 部署維運手冊](docs/cloudflare-deployment-runbook.md)
- [Skill package 開發指南](docs/skill-package-development-guide.md)
- [架構決策紀錄](docs/adr/)
