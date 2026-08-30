---
title: "Ask AI 怎麼找到文章：Planner、Hybrid Retrieval 與 Retry"
date: 2026-08-30
category: ai
type: guide
tags: [rag, retrieval, hybrid-search, bm25, vector-search, rrf, langgraph]
lang: zh-TW
tldr: "Ask AI 先由 Planner 抽出 intent、complexity 與 1–4 個搜尋詞，再依查詢型態走 metadata、BM25、Vectorize 與 RRF；第二輪搜尋會加入 Critic gaps，並關閉第一次才允許的 BM25 short circuit。"
description: "沿著 Ask AI 的 Planner、Research 與 search-posts 實作，拆解查詢改寫、混合檢索、RRF、弱召回判斷與 retry 如何接在一起。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 2
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-hybrid-retrieval-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配〈[Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)〉、〈[RRF：RAG 系統裡多路結果怎麼合併](/posts/ai/2026-03-12-rrf-multi-source-fusion)〉與〈[CRAG：檢索失敗時，自動放寬條件重試](/posts/ai/2026-03-12-corrective-rag-crag)〉。

索引準備好之後，下一個問題才是「要拿什麼去查」。使用者輸入的是口語問題，BM25 想要辨識度高的詞，向量搜尋需要能表達語意的 query。列文章清單和查一個技術錯誤，也不該共用完全相同的 top-k 與 context 策略。

Ask AI 的做法不是讓一個 Agent 自由決定所有工具呼叫。它把責任拆成 Planner、Research、post search 與 result normalization。這篇沿著這四層追一次，重點是各層如何改變 query 與候選集合，不重講 BM25、embedding 或 RRF 的數學原理。

## Planner 先把對話句整理成搜尋計畫

[`planner.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/planner.ts) 要模型回傳一個 JSON plan，其中包含：

- `intent`：factual、summary、comparison、recommendation 等類型。
- `complexity`：simple、medium 或 complex。
- `language`：`zh-TW` 或 `en`。
- `needs_clarification`、`subtasks` 與 `specialists`。
- 1–4 個去掉口語填充詞的 `search_keywords`。

這個 plan 會改變後面的資源配置。Recommendation 預設可以取更多文章；complex query 才可能啟用 Multi-query 或 PageIndex；simple query 不查 abstract index。若 Planner 輸出不是合法 JSON，程式會回到 factual、medium、zh-TW 的預設值，而不是讓整個請求直接失敗。

Recommendation 還會再經過 [`query-strategy.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts)。像「幫我找」「有哪些」「文章」這些詞會被移除，讓「有哪些 RAG 評估文章」盡量用 `RAG 評估` 去查。Broad catalog query 則另外標記，後續可以採 metadata-only 路徑。

## Research 組出一組真的不重複的 query variants

[`research.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts) 先以原問題與 subtasks 建立 base query，再視 plan 與功能旗標加入其他版本：

1. 一般查詢可加入 Planner 抽出的 keyword query。
2. retry 時若 Critic 留下 gaps，會把缺口加入新的 query。
3. HyDE 開啟且問題不是 simple 時，可加入假想答案。
4. Multi-query 開啟且問題是 complex 時，可加入多組替代問法。

最後用 `Set` 去重，再平行查 posts、docs 與必要的 abstract index。外部搜尋只有在 search tools 開啟，而且不是 metadata-only catalog query 時才會執行。

這裡有一個很重要的 retry 契約：**第二輪不能只重播第一次的檢索。** 程式會加入 Critic gaps；BM25 short circuit 也只允許在 `iteration === 0`。否則第一次的弱候選集很容易原封不動地回來，Writer 只是換一種講法再失敗一次。

## Post search 不是每次都跑完整 hybrid

[`search-posts.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/search-posts.ts) 會先查文章 metadata，再查 D1 FTS5 的 BM25 結果。接著依 query 型態選路：

```text
metadata-only catalog
  → metadata results → 依 slug 去重

precision query + BM25 至少 5 筆
  → metadata + BM25 → RRF → 依 slug 去重

其他查詢
  → metadata + BM25 + Vectorize → RRF → 依 slug 去重
```

`D1`、版本號、路徑或帶特殊符號的 identifier 會被視為 precision query。只有這類查詢在 BM25 至少回五筆且 short circuit 開啟時，才會跳過 Vectorize。一般口語查詢即使 BM25 有結果，仍會走向量 lane。

[`hybrid-search.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/hybrid-search.ts) 用 RRF 合併排名，而不是直接比較 BM25 與 cosine 的原始分數。每個 active list 依名次貢獻 `1 / (60 + rank)`，最後再正規化到 0–1。這個 `relevance_score` 是融合後的相對排名訊號，不應寫成「模型判定有 0.8 的事實相關性」。

## Normalize Results 再判斷這批證據夠不夠用

Research 會把 posts、docs、abstract 與可能的外部結果合併。Recommendation 以文章為單位去重並依 `postLimit` 截斷；一般 factual query 則保留 chunk 粒度。

[`normalize-results.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/normalize-results.ts) 接著統一排序分數，並用最高可比較分數是否低於 `0.4` 判斷 weak retrieval。若 reranker 功能開啟，它還會混合 query token overlap，並用 MMR 調整多樣性。

目前預設設定中 HyDE、Multi-query 與 reranker 都是關閉，BM25 short circuit 開啟。Repo 能支持的說法是：這些 lane 已有實作與測試。功能旗標存在，不足以證明 production 每次查詢都在使用。

## 跑 targeted tests，而不是猜路由

```sh
pnpm exec vitest run \
  src/lib/retrieval/agents/planner.parity.test.ts \
  src/lib/retrieval/agents/research.parity.test.ts \
  src/lib/retrieval/query-strategy.test.ts \
  src/lib/retrieval/tools/hybrid-search.test.ts
```

這組測試覆蓋 Planner 的輸出契約、recommendation query 清理、retry 改變檢索、article-level dedupe、result cap 與 RRF/short-circuit helper。它沒有查 production D1 或 Vectorize，也不會產生真實 ranked list。

如果要看目前預設旗標，不要從文章敘述反推，直接查程式碼：

```sh
rg -n "hydeEnabled|multiQueryEnabled|rerankerEnabled|bm25ShortCircuitEnabled" \
  src/lib/retrieval/settings.ts src/lib/retrieval/state.ts
```

## 證據邊界

這篇能證明目前程式如何組 query、何時跳過 Vectorize、如何融合與 retry。它不能從靜態程式碼推得 production 索引內容、每條 lane 的實際召回率或延遲。

更重要的是，`search_results` 是 Writer 的候選證據，不是「網站所有相關文章」。top-k、去重與 context window 都會讓完整母群縮小。下一篇會接著看 Writer 實際拿到多少來源，以及它為什麼只能引用候選集合裡的 URL。

## 參考資料

- [Ask AI Planner](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/planner.ts)
- [Research agent](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts)
- [Recommendation query strategy](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts)
- [Post search implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/search-posts.ts)
- [Hybrid search and RRF helpers](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/tools/hybrid-search.ts)
- [Result normalization](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/normalize-results.ts)
