# Interactive Glossary

互動詞彙表讓讀者在文章內 hover 或 focus 技術名詞時，直接看到定義、本文脈絡與延伸閱讀，不需要離開文章頁。

## 目前狀態

- 文章頁會自動標註已知詞彙，避開連結、標題、程式碼區塊與 inline code。
- 詞彙卡支援「初學 / 進階」兩種解釋深度，讀者偏好存在 `localStorage.glossary-level`。
- `/api/glossary/explain` 會優先用可用的 LLM provider 產生上下文化說明；沒有 API key 或模型失敗時，回退到本地詞彙資料。
- 每次查詢會嘗試寫入 `glossary_lookup_stats`，用來找出高頻不理解詞彙，回饋內容規劃。

## 檔案位置

| 檔案 | 用途 |
|------|------|
| `src/lib/glossary/terms.ts` | 站內預設詞彙、別名、定義、進階說明與延伸閱讀 |
| `src/content.config.ts` | `glossary` frontmatter schema |
| `src/pages/posts/[...slug].astro` | 文章頁自動標註、popover UI、初學/進階切換 |
| `src/pages/api/glossary/explain.ts` | 詞彙解釋 API，含 AI 與 local fallback |
| `migrations/0006_glossary_lookup_stats.sql` | 詞彙查詢統計表 |

## Frontmatter

文章可選擇補充專屬詞彙。文章詞彙會覆蓋或優先於預設詞彙；沒有設定時仍會套用 `DEFAULT_GLOSSARY_TERMS`。

```yaml
---
title: "RAG 成本優化"
date: 2026-03-12
category: ai
tags: [rag, cost-optimization]
lang: zh-TW
glossary:
  - term: "semantic cache"
    aliases: ["semantic caching", "語意快取"]
    definition: "把語意相近的問題對應到已存在的回答，避免每次都重新跑完整 RAG。"
    advanced: "通常會用 embedding similarity 判斷 cache hit，threshold 太低會把不同問題誤判成同一題。"
    context: "本文用它作為降低 LLM 與檢索成本的策略。"
    links:
      - label: "站內搜尋 semantic caching"
        url: "/search?q=semantic%20caching&mode=rag"
---
```

欄位說明：

- `term`：主要詞彙，必填。
- `aliases`：同義詞或不同大小寫/語言寫法。
- `definition`：初學者說明。
- `advanced`：進階說明。
- `context`：此詞在本文中的用途。
- `links`：延伸閱讀，建議至少放站內搜尋或相關文章。

## API 行為

`POST /api/glossary/explain`

Request:

```json
{
  "term": "RAG",
  "level": "beginner",
  "context": "RAG 成本不是只有模型 token...",
  "slug": "ai/2026-03-12-rag-cost-optimization",
  "seed": {
    "term": "RAG",
    "definition": "先檢索資料，再交給模型回答。"
  }
}
```

Response:

```json
{
  "term": "RAG",
  "level": "beginner",
  "definition": "RAG 是先從知識庫找相關資料，再把資料交給模型回答。",
  "context": "本文討論的是 RAG 在成本、延遲與品質之間的取捨。",
  "reading": [
    { "label": "站內搜尋 RAG", "url": "/search?q=RAG&mode=rag" }
  ],
  "source": "ai"
}
```

`source` 可能是：

- `ai`：由模型產生。
- `local`：使用 `seed` 或 `DEFAULT_GLOSSARY_TERMS` fallback。

## 統計資料

Migration 會建立：

```sql
glossary_lookup_stats (
  term TEXT,
  slug TEXT,
  level TEXT,
  lookup_count INTEGER,
  last_context TEXT,
  first_seen_at TEXT,
  last_seen_at TEXT
)
```

可用來回答：

- 哪些詞彙最多人停下來查？
- 哪篇文章的哪個詞最需要補解釋？
- 初學與進階讀者卡住的詞是否不同？

常用查詢：

```sql
SELECT term, SUM(lookup_count) AS total
FROM glossary_lookup_stats
GROUP BY term
ORDER BY total DESC
LIMIT 20;
```

```sql
SELECT slug, term, level, lookup_count, last_context
FROM glossary_lookup_stats
ORDER BY lookup_count DESC, last_seen_at DESC
LIMIT 50;
```

## 驗證

基本檢查：

```bash
pnpm lint
pnpm build
```

互動檢查：

1. 啟動 dev server：`pnpm dev`，預設網址是 `http://localhost:4321/`
2. 打開含 RAG / embedding / Vectorize 等詞彙的文章。
3. hover 或 keyboard focus 詞彙。
4. 確認 popover 顯示定義、上下文、延伸閱讀。
5. 切換「初學 / 進階」，確認內容深度更新。

已知限制：

- `pnpm astro check` 目前會被既有全專案型別問題擋住，包含 React type declaration、Cloudflare Worker global types、RAG graph typing。互動詞彙表目前以 `pnpm lint`、`pnpm build` 與瀏覽器互動檢查作為驗證。
- 本地 dev 若沒有 LLM key 或模型呼叫失敗，會回傳 local fallback。
