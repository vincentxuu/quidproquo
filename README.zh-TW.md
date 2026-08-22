<div align="center">

# quidproquo

**內建 AI 內容引擎的中英雙語個人部落格。**

[![Deploy](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml/badge.svg)](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml)
![Status](https://img.shields.io/badge/status-active_development-orange.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare_Workers-f38020.svg)

[快速開始](#快速開始) · [功能總覽](#功能總覽) · [部署](#部署到-cloudflare) · [架構](#運作方式) · [文件](#文件)

[English](README.md) · [繁體中文](README.zh-TW.md)

</div>

quidproquo 是 [quidproquo.cc](https://quidproquo.cc) 的原始碼——一個以 Astro（SSR）建構、部署在 Cloudflare Workers 上的個人部落格。文章以 Markdown 撰寫，支援雙語（預設 `zh-TW`，另支援 `en`），並具備檢索層：文章會分塊存入 D1 與 Vectorize，支撐語意搜尋、相關文章推薦與聊天端點。

> [!IMPORTANT]
> 這是持續開發中的個人專案。D1 schema、API 路由與內容管線可能隨時調整，不預期作為通用的部落格框架使用。

## 功能總覽

| 領域 | 說明 | 所在位置 |
| --- | --- | --- |
| 雙語部落格 | Markdown/MDX 文章，含分類、標籤、系列文、RSS、sitemap 與 OG 圖片產生 | `src/content/posts/`、`src/pages/` |
| RAG 搜尋與聊天 | 文章分塊嵌入 Vectorize；語意搜尋、相關文章與聊天 API | `src/pages/api/search.ts`、`src/pages/api/chat.ts` |
| 深度研究 | 多步驟研究流程，含證據追蹤與佇列化的 agent 執行 | `src/pages/api/deep-research.ts`、`flows/` |
| 內容管線 | 爬蟲、YouTube 轉文章、翻譯與每日摘要排程 | `src/lib/crawl/`、`scripts/`、`docs/yt-to-post-pipeline.md` |
| Admin 主控台 | 以 Session 認證的管理介面，管理工作、provider 與政策 | `src/pages/admin/` |
| 品質關卡 | Lint 加上文獻引用、用語、雙語對齊、詞彙表與外部連結檢查 | `scripts/check-*.mjs`、`pnpm verify` |

搜尋與聊天除了透過 `LLM_PROVIDER` 設定的模型供應商外，不需要其他外部 SaaS；embedding 與推論使用 Workers AI 與 LangChain adapters。

## 快速開始

需求：Node.js 22+、pnpm 10 與 Git。只有瀏覽器測試需要 Playwright。

```bash
git clone https://github.com/vincentxuu/quidproquo.git
cd quidproquo
pnpm install
```

啟動本地開發伺服器：

```bash
pnpm dev
```

網站現在可在 `http://localhost:4321` 存取。Cloudflare 綁定由 Wrangler 在本地模擬；需要時可將文章資料同步進本地 D1：

```bash
pnpm sync        # 本地 D1
pnpm sync:prod   # 正式環境 D1
```

### 常用指令

| 指令 | 用途 |
| --- | --- |
| `pnpm build` | 建構正式版本至 `./dist/`（含 cron entry 與 OG 圖片產生） |
| `pnpm preview` | 本地預覽正式建構結果 |
| `pnpm lint` | oxlint 靜態分析 |
| `pnpm test` | Vitest 測試 |
| `pnpm verify` | 完整 pre-commit 驗證（透過 `simple-git-hooks` 執行） |
| `pnpm check:lang-parity` | 驗證 `zh-TW`/`en` 內容對齊 |
| `pnpm eval:rag` | 執行 RAG 基準評估 |
| `pnpm session:start` | 顯示最新 commit、`progress.txt`，並跑一次 lint |

## 部署到 Cloudflare

部署透過 GitHub Actions 自動化：push 到 `main` 後會依序 lint、驗證引用、建構並部署到正式環境。Repository 需設定 `CLOUDFLARE_API_TOKEN` secret；見 [`deploy.yml`](.github/workflows/deploy.yml)。

若要手動部署，先登入 Wrangler，再建構並部署：

```bash
pnpm exec wrangler login
pnpm run deploy
```

`pnpm run deploy` 會先建構，再以產生的 `dist/server/wrangler.json` 部署。排程工作（爬蟲、摘要、資料保留等 cron triggers）定義於 [`wrangler.jsonc`](wrangler.jsonc)。

### Cloudflare 資源

| Binding | 類型 | 用途 |
| --- | --- | --- |
| `ASSETS` | Assets | 靜態資源服務 |
| `SESSION` | KV | Session 儲存 |
| `RATE` | KV | Rate limiting |
| `DEEP_RESEARCH_KV` | KV | 深度研究狀態 |
| `DB` | D1 | 文章、分塊與詞彙表資料（`quidproquo-db`） |
| `VECTORIZE_INDEX` | Vectorize | 向量搜尋（`quidproquo-vectors`） |
| `AI` | Workers AI | Embedding 與推論 |
| `R2_IMAGES` | R2 | 圖片儲存 |
| `AGENT_QUEUE` | Queues | 背景 agent 執行（含 DLQ） |

資料庫 migration 在 [`migrations/`](migrations/)，核心三張資料表：
`posts`（文章主表）、`post_chunks`（RAG 分塊）、`doc_chunks`（外部爬蟲文件分塊）。

## 為什麼是 quidproquo？

- **內容即資料：** 每篇文章都是純 Markdown 並同步進 D1，搜尋、推薦與分析都查詢同一個事實來源。
- **RAG 原生：** 檢索不是外加功能——分塊、嵌入、評估（`pnpm eval:rag`）與 trace 保留都是 repository 的一部分。
- **雙語從根本做起：** 語言對齊與繁體中文用語檢查確保兩個版本一致。
- **發布前品質關卡：** 引用、系列順序、詞彙表覆蓋率與外部連結都在 CI 中驗證。
- **單一平台：** 運算、儲存、搜尋索引、佇列與 AI 全部在 Cloudflare Workers 內完成。

## 運作方式

```text
訪客 / 管理員
    |
    v
Astro SSR on Cloudflare Workers    sessions、rate limiting、i18n 路由
    |
    +-- pages                      部落格、分類、標籤、系列、搜尋
    +-- api                        聊天、搜尋、深度研究、爬蟲
    +-- D1                         文章、分塊、詞彙表統計
    +-- Vectorize + Workers AI     embedding 與語意檢索
    `-- Queues                     背景 agent 與摘要排程
```

文章以 Markdown 撰寫於 `src/content/posts/<category>/`，經
`src/content.config.ts` 型別檢查、check scripts 驗證後，由
[`scripts/sync-to-d1.ts`](scripts/sync-to-d1.ts) 同步到 D1。SSR
網站直接讀取 D1，讓已發布內容、搜尋索引與 RAG 分塊保持一致。

## 專案現況

- 已上線於 [quidproquo.cc](https://quidproquo.cc)，自 `main` 自動部署。
- 已實作：雙語 SSR 部落格、RAG 搜尋與聊天、深度研究流程、agent queue 主控台、內容 QA 套件、RAG 評估框架。
- 進行中：agent flow/policy/artifact 擴充、詞彙表分析與發布自動化——見 [`docs/TODO.md`](docs/TODO.md) 與 [`docs/content-pipeline-roadmap.md`](docs/content-pipeline-roadmap.md)。

## 文件

- [AI agent 內容系統](docs/ai-agent-content-system.md)
- [營運章程](docs/governance/operating-charter.md)
- [內容管線藍圖](docs/content-pipeline-roadmap.md)
- [翻譯管線](docs/translation-pipeline.md)
- [YT 轉文章管線](docs/yt-to-post-pipeline.md)
- [RAG trace 保留政策](docs/rag-trace-retention-policy.md)
- [架構決策紀錄](docs/adr/)
