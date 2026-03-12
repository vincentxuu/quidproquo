# quidproquo

個人部落格，部署在 [quidproquo.cc](https://quidproquo.cc)。

以 Astro + Cloudflare Workers 建構，支援中英雙語，文章以 Markdown 撰寫。

## 專案結構

```text
/
├── public/              # 靜態資源
├── src/
│   ├── components/      # Astro 元件
│   ├── content/
│   │   └── posts/       # Markdown 文章
│   │       ├── ai/      # AI / RAG 技術
│   │       ├── education/  # 教育
│   │       ├── product/ # 產品
│   │       └── tech/    # 技術
│   ├── i18n/            # 多語系設定
│   ├── layouts/         # 頁面版型
│   ├── lib/
│   │   └── crawl/       # 外部文件爬蟲設定
│   └── pages/
│       ├── api/         # API 端點（posts CRUD）
│       ├── categories/  # 分類頁
│       ├── en/          # 英文路由（categories / tags）
│       ├── posts/       # 文章路由
│       ├── tags/        # 標籤頁
│       └── index.astro
├── scripts/
│   └── sync-to-d1.ts   # 同步文章到 D1 的腳本
├── migrations/          # D1 資料庫 migration
├── docs/                # 文件
└── wrangler.jsonc       # Cloudflare Workers 設定
```

## 指令

| 指令 | 說明 |
| :--- | :--- |
| `pnpm install` | 安裝依賴 |
| `pnpm dev` | 啟動本地開發伺服器 `localhost:4321` |
| `pnpm build` | 建構正式版本至 `./dist/` |
| `pnpm preview` | 本地預覽建構結果 |
| `pnpm lint` | 執行 oxlint 靜態分析 |
| `pnpm sync` | 同步文章資料到 D1（本地） |
| `pnpm sync:prod` | 同步文章資料到 D1（正式環境） |

## Cloudflare 綁定

| Binding | 類型 | 用途 |
| :--- | :--- | :--- |
| `ASSETS` | Assets | 靜態資源服務 |
| `SESSION` | KV | Session 儲存 |
| `DB` | D1 | 文章資料庫 |
| `VECTORIZE_INDEX` | Vectorize | 向量搜尋 |
| `AI` | AI | Workers AI |
| `R2_IMAGES` | R2 | 圖片儲存 |

## 資料庫 Schema

D1 資料庫 `quidproquo-db` 包含三張資料表：

- `posts` — 文章主表（slug、title、category、lang、tags 等）
- `post_chunks` — 文章分塊（供 RAG 使用）
- `doc_chunks` — 外部文件分塊（供爬蟲 + RAG 使用）

## 技術棧

- [Astro](https://astro.build) — 靜態網站框架，SSR 模式
- [Cloudflare Workers](https://workers.cloudflare.com) — 部署平台
- [Markdown](https://www.markdownguide.org) — 文章格式
- i18n：預設 `zh-TW`，支援 `en`
