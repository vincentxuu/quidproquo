---
title: "Ask AI 的問題怎麼走完整條 RAG 管線：UI、API、Agent 與來源卡片"
date: 2026-08-30
category: ai
type: guide
tags: [rag, ai-agent, langgraph, sse, retrieval, cloudflare-workers]
lang: zh-TW
tldr: "Ask AI 把一次提問拆成 UI、`/api/chat`、Planner、Research、Writer、Validation、Critic 與 Related 八段；回答文字、參考來源和延伸閱讀各有不同的產生與顯示條件。"
description: "沿著 quidproquo Ask AI 的實際程式碼，追蹤一個問題從聊天介面、SSE API、RAG pipeline 到回答、來源與延伸閱讀卡片的完整資料流。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 0
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-pipeline-overview-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配〈[RAG 的三個世代：從 Naive 到 Modular](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution)〉與〈[Modular RAG Pipeline：把 RAG 設計成可組合的 DAG](/posts/ai/2026-03-12-modular-rag-pipeline-architecture)〉。

Ask AI 不是「搜尋幾篇文章，再把結果丟給模型」這麼短的一條線。使用者在聊天視窗送出問題後，請求會經過配額、快取、查詢規劃、檢索、寫作、格式驗證、內容審查與來源顯示門檻。畫面上的回答、參考來源和延伸閱讀，也不是同一份資料換三種樣式。

這篇先畫責任地圖。後面的文章會逐段拆索引、混合檢索、Writer、Validation 與可觀測性。這一篇只回答一個問題：**使用者按下送出後，哪個元件負責哪件事？**

## 從聊天元件進入 `/api/chat`

[ChatWidget](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/ChatWidget.tsx) 把問題與 `thread_id` 送到 `/api/chat`，接著逐段解析 SSE。不同事件會落到訊息的不同欄位：

- `token`：附加到回答文字。
- `agent_step`：顯示 Planner、Research、Writer 等進度。
- `sources`：存成「參考來源」。
- `related`：存成「延伸閱讀」。
- `done`：結束串流，帶回 confidence、用量與剩餘配額。

[MessageList](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/MessageList.tsx) 才把這些欄位畫成 Markdown 回答與兩組卡片。因此，畫面上「沒有參考來源」不必然等於 Research 沒找到任何 chunk；來源也可能在後面的品質門檻被擋下。反過來說，延伸閱讀是另一個節點產生的推薦，不該拿它證明 Writer 看過同一批證據。

## API 先處理請求政策，再啟動 pipeline

[`src/pages/api/chat.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) 是 HTTP 與 RAG 之間的邊界。它先驗證訊息、管理員 session、公開使用者配額與 cache policy，再載入 RAG 設定、provider key 與對話 checkpoint。

如果 semantic cache 命中，API 直接送出快取回答與 `done`，不會重跑 Research，也不會補送 `sources` 或 `agent_step`。若沒有命中，API 才呼叫共用的 [`runPipeline`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)。這也是為什麼評估 retrieval 時不能把快取回答當成新一輪檢索證據。

Pipeline facade 會依設定選擇 `langgraph`、`manual` 或 `llamaindex` engine，將各 engine 的輸出正規化成同一個 `GraphState`。它刻意壓掉 engine 中途送出的 draft token，最後只把 `final_response` 送給 UI。這個邊界避免重試時把多份 Writer 草稿串成一個看似完整、其實互相重複的回答。

## 一個問題會經過哪些 Agent

預設 LangGraph 路徑可從 [`graph.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/graph.ts) 直接讀出來：

```text
Planner
  → Research
    → Normalize Results
      → Writer
        → Deterministic Validation
          → Critic
            ├─ 通過 → Related
            ├─ 尚可重試 → Research
            └─ 用完重試額度 → Fallback → Related
```

各節點的責任不能混在一起看：

1. **Planner** 判斷 intent、complexity、language，並整理搜尋關鍵字。
2. **Research** 執行文章、文件、摘要或外部搜尋，留下 `search_results`。
3. **Normalize Results** 統一分數、判斷弱召回，並在功能開啟時 rerank。
4. **Writer** 只根據截取後的 evidence context 產生草稿。
5. **Validation** 檢查 Markdown、引用 URL 與 Mermaid 結構。
6. **Critic** 檢查相關性、意圖對齊、漂移與未被證據支持的主張。
7. **Related** 從另一條 Vectorize 查詢找最多三篇尚未使用的文章。

Planner 若判定問題需要澄清或完全離題，可以直接結束；Critic 或 Validation 失敗時，也可能回到 Research。這是一張控制流地圖，不代表每次 production request 都一定跑完同一串節點。

## 回答、來源、延伸閱讀是三條輸出

Pipeline 回傳後，API 會透過 [`shouldExposeRetrievedLinks`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts) 決定能不能送出 `sources`。條件不是「有搜尋結果」而已，還要求 Validation 與 Critic 沒有失敗。來源再依 `source_url` 去重後才送到前端。

[`relatedPostsNode`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/related-posts.ts) 也套用同一個門檻，但它用原問題另外查 Vectorize，排除已被 Research 使用的 slug，最多取三篇。因此三種輸出應該這樣解讀：

| 畫面區塊 | 從哪裡來 | 能證明什麼 |
|---|---|---|
| 回答文字 | 通過 engine normalization 的 `final_response` | 系統最後接受並送出的文字 |
| 參考來源 | 通過品質門檻的 `search_results` | 這些 URL 曾在本輪 retrieval state 中 |
| 延伸閱讀 | Related 節點的另一輪查詢 | 系統另外推薦的文章，不等於 Writer context |

## 跟著程式碼重跑最小檢查

這組測試不需要呼叫 production，也不需要模型金鑰：

```sh
pnpm exec vitest run \
  src/lib/conversation/pipeline.test.ts \
  src/lib/retrieval/presentation.test.ts \
  src/components/Chat/AgentSteps.test.ts
```

它能確認共用 facade 只送出最後回答、來源門檻的布林邏輯，以及 Research 顯示文章數與 evidence chunk 數的 UI 契約。它不能證明 Cloudflare bindings、production D1、Vectorize 或模型供應商當下可用。

## 證據邊界

這篇的流程來自目前 repo 程式碼與測試，描述的是**實作契約**。它不宣稱每個功能旗標都已在 production 開啟，也不把 shadow pipeline、local test 或存在的 adapter 寫成公開流量已採用。

SSE 公開事件能看到回答、顯示來源、延伸閱讀與節點狀態，卻看不到 Writer 收到的完整 context、原始 ranked chunks 或所有 Critic 欄位。看到 `Research completed` 可以證明節點送出了狀態事件，不能單憑這一行重建它當時拿到的全部證據。

下一篇會往前追：一篇 Markdown 文章如何先變成 D1 FTS5 與 Vectorize 都能找到的資料。

## 參考資料

- [Ask AI chat API](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Conversation pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
- [LangGraph pipeline](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/graph.ts)
- [ChatWidget SSE consumer](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/ChatWidget.tsx)
- [MessageList answer and link sections](https://github.com/vincentxuu/quidproquo/blob/main/src/components/Chat/MessageList.tsx)
- [Retrieved-link presentation gate](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts)
- [Related-posts node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/related-posts.ts)
