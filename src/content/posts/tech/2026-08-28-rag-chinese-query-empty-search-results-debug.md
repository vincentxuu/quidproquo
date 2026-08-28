---
title: "問「我想找入門的ai課程」卻回 0 筆？RAG 中文分詞與資料鏈路脫節除錯實戰"
date: 2026-08-28
category: tech
type: debug
tags: [rag, hybrid-search, fts5, bm25, vector-search, cloudflare, d1, vectorize]
lang: zh-TW
tldr: "在 Ask AI 輸入「我想找入門的ai課程」顯示搜尋文章 0 筆並觸發拒答，底部的延伸閱讀卻精準推薦相關文章。問題在於無空格中英混寫被 FTS5 當成單一長 token、LIKE fallback 拿整句查表命中 0，以及向量檢索未帶 post filter 且強依賴 post_chunks 造成空回傳；解法為引入 Script 邊界切詞、漢字 2-gram 滑窗與 Vectorize metadata 雙重保險。"
description: "深度拆解 RAG 問答系統中「搜尋文章 0 筆拒答但延伸閱讀精準命中」的矛盾現象：從 FTS5 斷詞缺陷、中英混合無空格連寫、LIKE 降級失效到 Vectorize 與 D1 post_chunks 鏈路脫節的完整根因與修復方案。"
draft: false
---

## TL;DR

在部落格的 Ask AI 輸入「我想找入門的ai課程」，AI 生成進度條顯示 `搜尋文章 0`，模型回覆「知識庫中沒有足夠的可靠證據...」，但對話框底部的「延伸閱讀」卻赫然出現第一篇就是《2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production》。

這個「回答找不到、推薦卻找得到」的矛盾，是三個環節疊加造成的：
1. **FTS5 查詢組裝未做 Script 邊界切割**：正則將無空格的「我想找入門的ai課程」視為單一長 Token，導致 BM25 `MATCH` 0 筆。
2. **LIKE Fallback 拿完整問句查表**：全文檢索掛掉後，降級的 `pc.content LIKE '%我想找入門的ai課程%'` 依然因無完全一致的口語句子而回傳 0 筆。
3. **向量檢索缺少 Filter 且強綁定 D1 `post_chunks`**：`searchPosts` 查向量未限定 `post` 類型，且查到 chunk 後必須到 D1 的 `post_chunks` 做 SQL JOIN；若 chunk ID 脫節就直接回空，而「延伸閱讀」直接讀取 Vectorize 的 metadata 因而成功命中。

解法為：在檢索層加入**漢字/非漢字 Script 邊界切割**、**長中文 2-gram 滑窗拆解**、**LIKE 多詞 OR 查詢（排除單字噪音）**，並在向量搜尋補上 `type: post` 過濾與 metadata 直讀備援。

---

## 情境

本站的 RAG 問答系統採用 Multi-Agent 架構（`Planner` $\to$ `Research` $\to$ `Writer` $\to$ `Validation` $\to$ `Critic` $\to$ `Related`）：
- `Research` 節點負責檢索文章與文檔，採用 BM25（D1 FTS5）與 Vectorize（Qwen3 向量）的 Hybrid Search，並透過 RRF（Reciprocal Rank Fusion）融合結果。
- `Writer` 節點負責生成回答。若 `search_results` 為 0 或檢索可信度不足，系統 Prompt 會觸發安全防線（Guardrail），明確告知知識庫無可靠證據以防幻覺。
- `Related` 節點在流程尾端執行，根據使用者問題向 Vectorize 查詢最相關的延伸閱讀文章。

在測試問答系統時，輸入了一句非常自然的中文口語查詢：
> **「我想找入門的ai課程」**

結果出現了極度矛盾的畫面：
- 進度條：`分析問題` $\to$ `搜尋文章 0` $\to$ `生成回應` $\to$ `格式驗證` $\to$ `品質檢查`
- AI 回應：*「很抱歉，我的知識庫中沒有足夠的可靠證據來提供入門AI課程的建議。您可能需要嘗試其他資源或平臺來尋找合適的課程。」*
- 延伸閱讀：`01 2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production`

明明資料庫裡就有完全對應的文章，為什麼主檢索流程回傳 0 筆，延伸閱讀卻能精準抓到？

---

## 問題

將整個請求鏈路分層拆解，發現了三個斷點：

### 1. BM25 路徑：分詞邏輯將中英混寫視為單一長 Token
在 `src/lib/rag/tools/hybrid-search.ts` 的 `buildFtsQuery` 函數中：
```ts
const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
```
因為 Unicode 正則 `\p{L}` 同時涵蓋漢字（Han）與英文字母（Latin），在使用者沒有主動在「的」和「ai」與「課程」之間打空格的情況下，整句「我想找入門的ai課程」被匹配成一個長度為 11 的單一 Token。

既有的 CJK 2 字拆解邏輯（`token.length === 2`）無法觸發，送進 SQLite FTS5 的查詢變成了：
```sql
SELECT ... FROM chunks_fts WHERE chunks_fts MATCH '"我想找入門的ai課程"'
```
文章的 Chunk 內文不可能出現這句完整的口語提問，因此 FTS5 `MATCH` 結果為 0。

### 2. Lexical Fallback 路徑：全句模糊比對命中 0 筆
當 FTS5 回傳 0 筆時，系統設計了 `searchLikePosts` 作為降級：
```sql
SELECT ... FROM post_chunks pc WHERE pc.content LIKE '%我想找入門的ai課程%'
```
同樣地，沒有任何文章段落會包含「我想找入門的ai課程」這一整串字，LIKE fallback 依然回傳 0 筆。

### 3. Vectorize 向量路徑 vs 延伸閱讀的機制差異
為什麼向量檢索在 `searchPosts` 失敗，但在 `relatedPosts` 卻能成功？

| 機制比較 | 搜尋文章 (`search-posts.ts`) | 延伸閱讀 (`related-posts.ts`) |
| :--- | :--- | :--- |
| **Vectorize Query** | 查全庫 `topK: 24`，未帶 metadata filter（易被 doc 擠掉） | 帶入 `filter: { type: { $eq: 'post' } }` |
| **資料來源取得** | 拿 `chunk_id` 到 D1 `post_chunks` 做 `WHERE pc.id IN (...)` | 直接讀取 Vectorize 回傳的 `metadata.slug`，查 `posts` 主表 |
| **容錯度** | 若 D1 `post_chunks` 的 chunk_id 有脫節或 SQL 異常，被 `.catch(() => [])` 吞掉直接回空 | 不依賴 `post_chunks` 表，直接拿到文章標題與連結 |

---

## 嘗試過程

### 1. 驗證分詞行為
在 Node/Vitest 環境測試分詞輸出：
```ts
buildFtsQuery('我想找入門的ai課程')
// 原始輸出：'"我想找入門的ai課程"' （單一長詞，FTS5 必死）
```
若使用者輸入純中文長句，例如「推薦新手學習深度學習」：
```ts
buildFtsQuery('推薦新手學習深度學習')
// 原始輸出：'"推薦新手學習深度學習"' （長度 10，完全無子詞展開）
```
這證實了不管是中英混寫還是純中文長句，在沒有空格的情況下，原有分詞器完全無法產生有效的檢索關鍵詞。

### 2. 評估 Stopwords 方案的副作用
一度嘗試引入 Stopwords（停用詞列表）來剝離「我想」、「找」、「的」等詞。但硬編碼 Stopwords 很容易誤殺領域詞（例如若將「入門」、「課程」、「教學」列入停用詞，使用者搜「AI 課程」時關鍵字直接被清空），不可取。

### 3. 確定 2-gram 滑窗與 Script 邊界拆分
最穩健的純字元層級解法是不依賴龐大字典，直接從字元特徵切入：
- **Script 邊界切詞**：按 `[\p{Script=Han}]+` 與 `[^\p{Script=Han}]+` 邊界切開，自動將「我想找入門的ai課程」分為 `我想找入門的`（漢字段）、`ai`（拉丁段）、`課程`（漢字段）。
- **漢字 2-gram 滑窗**：對於連續漢字段，產生雙字組合（`我想`、`想找`、`入門`、`課程`），確保 FTS5 trigram / unicode61 能以子詞命中。

---

## 解法

### 1. 優化 `buildFtsQuery`（Script 邊界與 2-gram 展開）

在 `src/lib/rag/tools/hybrid-search.ts` 中：
```ts
export function buildFtsQuery(query: string): string | null {
  const normalized = query.trim().replace(/["']/g, ' ')
  if (!normalized) return null

  // 1) 先按空白/標點切出基礎 token
  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const baseTokens = Array.from(new Set(rawTokens.map(token => token.trim()).filter(token => token.length >= 2)))

  const expanded = new Set<string>()
  for (const token of baseTokens) {
    // 2) 按 Script 邊界拆分：漢字連續段 vs 非漢字連續段（拉丁/數字）
    const parts = token.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu) ?? [token]
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.length < 2) continue
      expanded.add(trimmed)

      // 3) 若是漢字連續段，產生 2-gram 滑窗與短詞拆解
      if (/^[\p{Script=Han}]+$/u.test(trimmed)) {
        for (let i = 0; i < trimmed.length - 1; i++) {
          expanded.add(trimmed.slice(i, i + 2))
        }
        if (trimmed.length <= 3) {
          for (const ch of trimmed) {
            expanded.add(ch)
          }
        }
      }
    }
  }

  if (expanded.size === 0) return null

  return [...expanded]
    .map(token => `"${token.replace(/"/g, '""')}"`)
    .join(' OR ')
}
```

### 2. 升級 `searchLikePosts`（Token-based OR LIKE 且排除單字噪音）

在 `src/lib/rag/tools/search-posts.ts` 中，將 LIKE fallback 改為使用 `buildFtsQuery` 產生的有效 Token（長度 $\ge 2$）：
```ts
  const tokens = ftsQuery
    .split(' OR ')
    .map(t => t.slice(1, -1).replace(/""/g, '"'))
    .filter(t => t.length >= 2) // 排除單字避免高頻字噪音

  if (tokens.length === 0) return []

  const likeClauses = tokens.map(() => 'pc.content LIKE ?').join(' OR ')
  const params = tokens.flatMap(t => [`%${t}%`])

  const rows = await DB.prepare(
    `SELECT pc.id AS chunk_id, COALESCE(pc.sentence_window, pc.content) AS content, p.slug, p.title, p.category, p.lang, substr(p.created_at, 1, 10) AS date, '[]' AS images, '[]' AS links
     FROM post_chunks pc
     JOIN posts p ON p.id = pc.post_id
     WHERE (${likeClauses})
     ORDER BY p.created_at DESC
     LIMIT ?`
  ).bind(...params, Math.max(limit * 3, BM25_SHORT_CIRCUIT_THRESHOLD)).all<...>()
```

### 3. 對齊 Vectorize 檢索並加入 Metadata 查表備援

在 `searchVectorPosts` 中：
1. 傳入 `filter: { type: { $eq: 'post' } }`，防止其他文檔擠佔名額。
2. 當 `fetchPostRowsByChunkIds` 因 D1 chunk 脫節回傳 0 筆時，自動 fallback 到 `fetchPostsByMetadata`，直接藉由 Vectorize metadata 裡記錄的 `slug` 從 `posts` 主表讀取內文與摘要。

---

## 為什麼會這樣

1. **中文自然語言問句無空格特徵**：英文詞與詞之間天然有空格，正則分詞非常單純；但繁體中文使用者輸入「我想找入門的ai課程」時，中文與英文常連寫在一起，任何依賴空白分割的分詞器都會直接陣亡。
2. **多路檢索與安全邊界的連鎖反應**：
   - 檢索層 0 筆 $\to$ 狀態標記為 `weak_retrieval`。
   - `Writer` 節點依據 Prompt 指令，遇到 0 筆證據時嚴格拒答（避免幻覺）。
   - 後續的 `Related` 節點因為檢索機制不同（直讀 metadata）成功撈出文章，造成了 UI 上「回答說沒有、下方推薦卻有」的強烈視覺衝突。

---

## 學到的事

* **中文檢索不能假設有空格或純英文邊界**：混合 Script（Han + Latin）的交界處是天然的斷詞點，必須透過 Script 正則顯式切分。
* **LIKE Fallback 必須與分詞連動**：Lexical 降級不能傻傻拿原始問句 `LIKE '%query%'`，而要用拆出的子詞組合 `OR LIKE`，但同時要過濾掉單字高頻詞（$\text{len} < 2$）以防雜訊污染排序。
* **多節點資料流需要一致的容錯層**：若系統中有兩處用到向量檢索（如 RAG 內文檢索 vs 延伸閱讀），兩者的 Filter 規則與查表 Fallback 策略應該保持對齊，避免產生自相矛盾的使用者體驗。

---

## 參考資料

- [搜尋只回 10 筆的解法：Cloudflare D1 FTS5 與 Hybrid Search 中文召回實戰](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall)
- [Hybrid Search：BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [SQLite FTS5 Extension Documentation](https://sqlite.org/fts5.html)
- [Cloudflare Vectorize Metadata Filtering](https://developers.cloudflare.com/vectorize/best-practices/metadata-filtering/)
