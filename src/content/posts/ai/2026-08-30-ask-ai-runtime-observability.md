---
title: "Ask AI 上線後怎麼查問題：SSE、Trace、Cache、Checkpoint 與 Shadow"
date: 2026-08-30
category: ai
type: guide
tags: [rag, observability, sse, semantic-cache, langfuse]
lang: zh-TW
tldr: "Ask AI 同一次請求有五種不同證據：公開 SSE、Langfuse trace、D1 log、semantic cache 與 hidden shadow run。它們看見的資料不同，單看任一層都不能還原完整 retrieval context。"
description: "沿一次 Ask AI request 的時間線，說明 SSE、Langfuse、D1 trace steps、semantic cache、checkpoint 與 shadow mode 各自能證明什麼。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 5
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-runtime-observability-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配 [RAG Streaming](/posts/ai/2026-03-12-rag-streaming-sse)、[RAG Observability](/posts/ai/2026-03-12-rag-observability-tracing) 與 [Semantic Caching](/posts/ai/2026-03-12-semantic-caching)。

使用者回報「這次回答怪怪的」時，Ask AI 沒有一份檔案能還原全部過程。公開 SSE 看得到使用者收到什麼，Langfuse 與 D1 記錄執行摘要。語意快取可能讓整條 pipeline 根本沒跑，checkpoint 又可能把前一輪摘要帶進來。

這篇按一次請求的時間線，整理每一層能回答的問題。對應實作集中在 [`/api/chat`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) 與[共用 pipeline 輸出邊界](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)。

## Request 先決定權限、快取與歷史摘要

API 收到 `message` 後，先驗 session、套用訪客配額，再載入 RAG 設定、provider keys 與 thread checkpoint。`traceScope`、`cacheMode` 也會先經過[請求權限規則](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/request-policy.ts)：只有已驗證的管理員請求可以要求評估用 trace 或 `cacheMode: bypass`。

接著才查 [semantic cache](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/cache.ts)。快取命中時，回應只有完整答案的 `token` event 與 `done` event，並標記 `cached: true`；Planner、Research、Writer、Validation、Critic 都不會執行。

這個差異會直接影響事故判讀。舊快取沒有來源，不代表新 retriever 找不到；它只證明使用者拿到一份先前存下的回答。

## Pipeline 只把接受後的答案送出

未命中快取時，[pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts) 交給目前設定的 engine 執行。engine 內部可能產生多份 Writer 草稿，但 facade 會先把 `onToken` 靜音，等 lifecycle output 正規化後，只送一次 `final_response`。

這個邊界修掉一種很難看懂的 UI 問題：重試三輪時，如果每份 draft 都透過 SSE 附加到畫面，使用者會看到三個答案黏在一起。現在 `agent_step` 仍能呈現節點走了幾次，答案 token 只有通過 routing 的最後版本。

公開 stream 可能包含：

- `agent_step`：節點名稱、completed 狀態，以及少量摘要欄位。
- `token`：接受後的回答文字。
- `related`：pipeline 產生的延伸閱讀。
- `sources`：通過 Validation 與 Critic 後的去重來源。
- `done`：token 用量、confidence、thread ID、快取狀態與剩餘配額。
- `error`：公開錯誤類型與訊息。

它不包含 raw ranked chunks、完整 prompt context、每份 rejected draft 或 Critic 的全部 JSON。

## Langfuse 與 D1 記錄執行摘要

Ask AI 會建立 `blog-rag` trace，metadata 包含 pipeline engine、thread ID、cache mode、trace scope 與請求起始時間。流程完成後，再補耗時、confidence、answer relevance、intent alignment、drift、搜尋結果數、model usage 與 lifecycle trace steps。

每個 step 也會映射成 span；mapping 無法精確對上時會標成 fallback 或 unobserved，而不是假裝每個時間點都量到了。[Langfuse adapter](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/langfuse.ts) 的呼叫採非阻塞 enqueue，外部 observability 失敗不會讓聊天一起失敗。

D1 另外保存 `chat_logs` 與步驟紀錄。這些資料適合回答「哪個 stage 重跑」「整體花多久」「最後信心多少」，仍不等於完整模型 trace。公開 SSE 的 `agent_step` 與後端 trace 都是觀測投影，不是 engine state dump。

## Checkpoint 可能改變下一題的語境

[Checkpoint](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/checkpoints.ts) 會估算對話、草稿與檢索證據的 token 數。超過設定比例時，它把最新問題、答案與 coverage gaps 摘要寫進 D1；下一次相同 `thread_id` 會載入摘要。

所以短問題「那正2呢？」不能只拿 query string 重現。原本 thread 裡的摘要也是輸入。要做乾淨 regression case，建立新的 thread；要重現對話污染，則保留原 thread ID。

## Shadow run 是隱藏比較，不是 production 答案

[RAG settings](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/settings.ts) 的 `shadowModeEnabled` 預設為 `false`。開啟後，主流程完成會再跑一份 baseline config，關掉 HyDE、Multi-Query、reranker、Critic 與 PageIndex，並把 primary／shadow 回答和 confidence 寫入 `shadow_runs`。

Shadow callbacks 全部是空函式，使用者看不到 shadow token、steps 或 sources。它的用途是比較設定，不會接管公開回答。只看到 `shadow_runs` row 也不能宣稱 shadow 較好；還需要固定資料集、評分規則與可檢查的輸出 artifact。

## 一次可複製的觀測流程

本機啟動正常的 Astro／Workers bindings 後，用 SSE client 保存公開事件：

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"message":"有哪些課程文章","thread_id":"obs-clean-01"}'
```

需要排除語意快取時，使用已驗證的管理員 session；公開請求不應取得 bypass 權限：

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session=admin-session-cookie' \
  --data '{"message":"有哪些課程文章","thread_id":"obs-clean-02","traceScope":"eval","cacheMode":"bypass"}'
```

先跑 policy 與 facade 測試，確認 bypass 權限和「只送 final answer」沒有退化：

```bash
pnpm exec vitest run \
  src/lib/conversation/pipeline.test.ts \
  src/lib/conversation/request-policy.test.ts \
  src/pages/api/chat.policy.test.ts
```

判讀時依序記錄：`cached`、thread ID、agent step 序列、sources、done/error、後端 trace ID。沒有保存這些欄位，之後很容易把快取命中當檢索失敗，或把公開 step 序列說成完整 prompt trace。

## 每一層能證明的事

| 證據 | 能回答 | 不能回答 |
|---|---|---|
| SSE | 使用者實際收到的答案、來源與 step 摘要 | hidden chunks、完整 prompt |
| Langfuse／D1 trace | stage、duration、score、設定摘要 | 每個未保存的中間值 |
| semantic cache | 是否重用舊回答 | 新 retriever 當次表現 |
| checkpoint | 哪段歷史摘要進入下一輪 | 完整原始對話重播 |
| shadow run | 同 request 下兩組設定的輸出 | production 已切換、長期品質提升 |

觀測資料越多，不代表證據邊界會自動消失。先寫下這次手上是哪一層，再下診斷，會比把所有 log 統稱為 trace 更可靠。

## 參考資料

- [Ask AI API lifecycle and SSE](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Shared pipeline final-response facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
- [Semantic cache implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/cache.ts)
- [Conversation checkpoint implementation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/checkpoints.ts)
- [RAG runtime settings and shadow baseline](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/settings.ts)
- [Ask AI evaluation evidence boundary](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
