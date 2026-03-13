# quidproquo.cc — 專案規劃書

> 多主題個人部落格，整合 D1 資料庫與 post skill，部署於 Cloudflare Workers 的全端應用。

## 專案概述

### 目標

建立一個低摩擦的寫作工作流：在日常生活（解決技術問題、攀岩、衝浪、看電影...）後，透過 Claude Code post skill 自動產生結構化文章，同步建立可搜尋的 D1 知識庫。

### 核心價值

- **個人知識庫**：建立跨主題的個人記錄，技術解法、生活體驗、學習筆記一次涵蓋
- **面試 Portfolio**：按分類整理的文章展示個人廣度與深度
- **社群貢獻**：公開技術文章幫助遇到同樣問題的開發者
- **Portfolio Piece**：本專案本身就是一個完整的 Cloudflare full-stack 應用展示

### 技術棧

| 層級 | 技術 | 用途 |
|------|------|------|
| 前端框架 | Astro 5 (Hybrid Mode) | 文章頁 SSG + 動態 API SSR |
| 部署 | Cloudflare Workers | 靜態資源 + Server-side 邏輯 |
| 資料庫 | Cloudflare D1 | 文章與 chunk 原文儲存 |
| 向量搜尋 | Cloudflare Vectorize | RAG 向量索引（Phase 4） |
| AI 模型 | Cloudflare Workers AI | Embedding + LLM 回答（Phase 4） |
| 爬蟲 | Cloudflare Browser Rendering `/crawl` | 爬取外部技術文件（Phase 3） |
| 圖片儲存 | Cloudflare R2 | OG image、文章內圖片 |
| 內容產生 | Claude Code + post skill | 從對話自動產生 markdown |

---

## 架構設計

### 雙路徑並行架構

Markdown 是唯一的 source of truth，D1 是衍生資料。

```
                        post skill 產生 .md
                                │
                 ┌──────────────┴──────────────┐
                 ↓                             ↓
          路徑 A：靜態部落格                路徑 B：D1 資料庫
                 │                             │
    存到 src/content/posts/              Build-time sync
                 │                             │
    Astro Content Collections              寫入 D1
    prerender = true                          │
                 │                      (Phase 4: Chunking + Embedding)
    git push → 自動 build                     │
                 │                    D1 (原文) + Vectorize (向量)
         靜態 HTML 頁面                        │
         (讀者看文章)                   RAG Query API
                                       (搜尋/問答)
```

### 資料流總覽

```
┌─────────────┐     ┌─────────────┐
│ Claude Code  │     │ /crawl API  │
│ post skill   │     │ 爬技術文件   │
└──────┬──────┘     └──────┬──────┘
       │ .md               │ .md
       ↓                   ↓
┌──────────────────────────────────┐
│         Markdown 檔案             │
│       (source of truth)          │
└──────┬───────────────┬───────────┘
       │               │
       ↓               ↓
┌────────────┐  ┌─────────────────┐
│ Astro SSG  │  │ Sync Pipeline   │
│ 靜態頁面    │  │                 │
└────────────┘  │  ┌───────────┐  │
                │  │ D1 (原文)  │  │
                │  └───────────┘  │
                │  ┌───────────┐  │
                │  │ Vectorize │  │
                │  │ (向量索引) │  │
                │  └───────────┘  │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │  RAG Query API  │
                │  + Workers AI   │
                └─────────────────┘
```

---

## Post Skill 設計

### 三種輸入來源

| 來源 | 觸發方式 | 特性 |
|------|----------|------|
| Claude Code CLI 對話 | 解完問題後說「寫成文章」 | 上下文最完整，零摩擦 |
| Claude App（claude.ai） | 對話結尾下指令整理 | 偏討論規劃，需要補充細節 |
| 手動筆記 | 貼上文字或 markdown | 最零散，需要 AI 整理 |

### Skill 結構

```
.claude/skills/post/
├── SKILL.md                          # 主要指令
├── templates/
│   ├── tech-post.md                  # 技術文章模板
│   └── general-post.md              # 通用文章模板（非技術分類）
└── references/
    ├── writing-guide.md              # 各分類寫作風格指南
    └── frontmatter-schema.md        # frontmatter 欄位說明
```

### 輸出格式

每篇文章包含以下 frontmatter，同時作為 Astro Content Collection schema 和 D1 欄位：

```yaml
---
title: "Cloudflare D1 batch insert 超過 100 筆會 timeout 的解法"
date: 2026-03-12
category: tech
tags: [cloudflare, d1, typescript]
lang: zh-TW
tldr: "D1 batch 單次上限 100 筆，用 chunkArray + Promise.all 分批送"
description: "解決 Cloudflare D1 batch insert 超過 100 筆靜默 timeout 的問題"
draft: false
---
```

### 文章結構（tech 類）

1. **TL;DR** — 一兩句話講完解法
2. **情境** — 在做什麼時遇到的
3. **問題** — 錯誤訊息或異常行為
4. **嘗試過程** — 試了什麼、為什麼沒用
5. **解法** — 最終怎麼解的，附程式碼
6. **為什麼會這樣** — 根本原因
7. **學到的事** — 一句話總結

---

## Astro 部落格架構

### 渲染策略：Hybrid Mode

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server',  // 預設 SSR
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false }
  }
});
```

- 文章頁 → `prerender = true`（靜態產生，速度快、SEO 好）
- API endpoints → SSR（posts CRUD、未來的 RAG query）
- 分類/標籤頁 → `prerender = true`（靜態）

### 分類系統

單一 `posts` collection，`category: z.string()` 自由填寫（不鎖 enum）。

目前分類：`tech` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `ai` / `product` / `marketing` / `travel` / `design` / `education` / `policy` / `anime` / `career`

### 專案目錄結構

```
quidproquo/
├── astro.config.mjs
├── wrangler.jsonc
├── tsconfig.json
├── package.json
├── migrations/
│   └── 0001_initial.sql              # D1 schema
├── scripts/
│   └── sync-to-d1.ts                 # Build 時 markdown → D1 同步
├── src/
│   ├── content/
│   │   ├── config.ts                 # Content Collection schema (Zod)
│   │   └── posts/                    # 所有文章，按 category 建子目錄
│   │       ├── tech/
│   │       │   └── 2026-03-12-d1-batch-timeout.md
│   │       └── life/
│   ├── i18n/
│   │   ├── ui.ts                     # 翻譯字串
│   │   └── utils.ts                  # getLangFromUrl, useTranslations
│   ├── layouts/
│   │   └── PostLayout.astro
│   ├── components/
│   │   ├── PostCard.astro
│   │   └── TagList.astro
│   └── pages/
│       ├── index.astro               # 首頁 zh-TW（文章列表）
│       ├── en/
│       │   ├── index.astro           # 首頁 en
│       │   ├── categories/           # en 分類頁
│       │   └── tags/                 # en 標籤頁
│       ├── posts/
│       │   └── [...slug].astro       # 單篇文章（prerender）
│       ├── categories/
│       │   ├── index.astro           # 分類總覽
│       │   └── [category].astro      # 分類篩選（prerender）
│       ├── tags/
│       │   ├── index.astro           # 標籤總覽
│       │   └── [tag].astro           # 標籤篩選（prerender）
│       └── api/
│           └── posts.ts              # GET/POST posts
└── .claude/
    └── skills/
        └── post/                     # post skill
```

### Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    description: z.string().optional(),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

---

## D1 資料庫設計

### Schema

```sql
-- 文章主表
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'zh-TW',
  description TEXT,
  tldr TEXT,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at);

-- Post chunk 表（Phase 4 RAG 使用）
CREATE TABLE post_chunks (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE INDEX idx_chunks_post ON post_chunks(post_id);

-- 外部技術文件 chunk 表（Phase 3 爬蟲爬回來的）
CREATE TABLE doc_chunks (
  id TEXT PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_name TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_doc_source ON doc_chunks(source_url);
```

### 資料同步策略

Markdown 是 source of truth，D1 是衍生資料。同步發生在 build 階段：

1. `git push` 觸發 Cloudflare build
2. `scripts/sync-to-d1.ts` 讀取 `src/content/posts/` 下的 `.md` 檔案
3. 比對 D1 現有資料，用 `ON CONFLICT(slug) DO UPDATE` 新增/更新
4. 分批送（每批 100 筆，避免 D1 batch 上限）

如果 D1 資料損壞，可以從 `.md` 檔案完全重建。

---

## RAG 系統設計（Phase 4）

### 知識庫組成

| 來源 | 存放位置 | metadata.type | 更新頻率 |
|------|----------|---------------|----------|
| 自己的文章 | D1 `post_chunks` | `post` | 每次 push |
| Cloudflare Docs | D1 `doc_chunks` | `docs` | 每週 |
| Astro Docs | D1 `doc_chunks` | `docs` | 每週 |
| 其他常用文件 | D1 `doc_chunks` | `docs` | 每週 |

### RAG Query 流程

```
使用者提問
    ↓
POST /api/rag/query
    ↓
1. Query → Workers AI embedding
    ↓
2. Vectorize 搜尋 top-K 相關 chunks
    ↓
3. 用 chunk id 從 D1 撈原文
    ↓
4. 組 context + prompt → Workers AI LLM
    ↓
5. 回傳回答 + 來源引用
```

### 使用的 Workers AI 模型

| 用途 | 模型 |
|------|------|
| Text Embedding | `@cf/baai/bge-base-en-v1.5` |
| LLM 回答 | `@cf/meta/llama-3.1-8b-instruct` |

---

## 爬蟲整合（Phase 3）

### API 概述

Cloudflare Browser Rendering `/crawl` endpoint，一個 API call 即可爬取整個網站，回傳 HTML、Markdown 或結構化 JSON。

### 爬取策略

```javascript
{
  url: "https://developers.cloudflare.com/d1/",
  formats: ["markdown"],
  maxPages: 50,
  render: false,                    // 靜態文件不需渲染，節省額度
  includePatterns: ["/d1/**"],
  maxAge: 604800,                   // 7 天快取避免重複
  source: "sitemaps"
}
```

---

## Wrangler 設定

```jsonc
{
  "name": "quidproquo",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-03-10",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "d1_databases": [{
    "binding": "DB",
    "database_name": "quidproquo-db",
    "database_id": "<your-db-id>"
  }],
  "vectorize": [{
    "binding": "VECTORIZE_INDEX",
    "index_name": "quidproquo-embeddings"
  }],
  "ai": {
    "binding": "AI"
  },
  "r2_buckets": [{
    "binding": "IMAGES",
    "bucket_name": "quidproquo-images"
  }]
}
```

---

## 關鍵設計決策

| 問題 | 決定 | 原因 |
|------|------|------|
| 文章格式 | Markdown | Astro 原生支援、skill 好產生、git 友善 |
| 渲染模式 | Hybrid（文章 SSG + API SSR） | 文章靜態快速、API 需要動態 endpoint |
| 框架選擇 | Astro 而非 Next.js | 內容導向、輕量、Cloudflare 整合好 |
| D1 角色 | 衍生資料 | markdown 是 source of truth，D1 壞了可重建 |
| 分類設計 | `z.string()` 不鎖 enum | 多主題部落格需要靈活擴充 |
| i18n | zh-TW 為根路徑，en 加 `/en/` 前綴 | 對 SEO 友善，中文讀者零額外點擊 |
| 向量索引 | 共用一個 Vectorize index | 用 metadata.type 區分來源 |
| 爬蟲 | /crawl API + render:false | 省額度、原生整合 Cloudflare 生態 |
| 同步時機 | Build 時自動同步 | 確保 markdown 和 D1 一致 |

---

## 實作階段

### Phase 1+2 — 部落格 + D1 整合（詳細計畫見 `docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md`）✅

- [x] 初始化 Astro 5 + Cloudflare Workers adapter
- [x] 設定 Content Collections（posts schema）
- [x] i18n utilities（zh-TW / en）
- [x] 建立基本頁面（首頁、文章頁、分類頁、標籤頁）
- [x] 建立 D1 database + 執行 schema migration
- [x] 實作 build-time markdown → D1 同步腳本
- [x] 建立 `/api/posts` GET/POST endpoint
- [x] 部署 post skill 到 `.claude/skills/`
- [x] git push → Cloudflare 自動部署

**交付物**：可運作的部落格 + post skill + D1 整合

### Phase 3 — 爬蟲整合（計畫見 `docs/superpowers/plans/2026-03-12-crawler-integration.md`）

- [ ] 實作 `/api/crawl/sync` endpoint
- [ ] 設定要爬取的技術文件站清單
- [ ] 實作 Markdown → chunking pipeline
- [ ] 設定 Cron Trigger 定期爬取
- [ ] 增量更新機制（modifiedSince）

**交付物**：自動更新的外部技術文件知識庫

### Phase 4 — RAG 系統（計畫見 `docs/superpowers/plans/2026-03-12-rag-system.md`）

- [ ] 建立 Vectorize index
- [ ] 實作 chunk → embedding → upsert pipeline
- [ ] 建立 `/api/rag/query` endpoint
- [ ] 前端搜尋/問答 UI 元件

**交付物**：可查詢文章 + 技術文件的 RAG API

### Phase 5 — 進階功能

- [ ] RSS feed（`@astrojs/rss`）
- [ ] 靜態搜尋（Pagefind）
- [ ] OG Image 自動產生
- [ ] Langfuse observability 串接
- [ ] 進階 RAG 策略（reranking、HyDE）

**交付物**：production-ready 的完整平台

---

## 日常工作流

```
1. 有事情值得記錄（解決問題、攀岩、看電影...）

2. 「寫成文章」→ post skill 產生 .md

3. 快速 review → git push

4. 自動完成：
   ├── Astro build 靜態頁面
   ├── 同步到 D1
   └── 部落格上線

5. （Phase 3）每週自動爬取技術文件更新知識庫

6. （Phase 4）使用者可以在部落格上搜尋/問答
```

---

## 參考資源

- [Astro Cloudflare Workers 部署指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Astro Content Collections 文件](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Browser Rendering /crawl](https://developers.cloudflare.com/browser-rendering/rest-api/crawl-endpoint/)
- [Cloudflare Vectorize 文件](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Workers AI 模型列表](https://developers.cloudflare.com/workers-ai/models/)
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [AgriciDaniel/claude-blog](https://github.com/AgriciDaniel/claude-blog) — Claude Code blog skill 參考
