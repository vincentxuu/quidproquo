---
title: "Zep 完整介紹：用時序知識圖管理 Agent 記憶"
date: 2026-08-22
category: ai
type: deep-dive
tags: [zep, graphiti, memory, ai-agent, knowledge-graph, temporal-data]
lang: zh-TW
tldr: "Zep 的核心不是向量化聊天紀錄，而是把 episode 抽成帶有效時間的 entity 與 fact，讓新資訊使舊關係失效但不抹掉歷史；Graphiti 是開源核心，Zep 則是代管與治理層。"
description: "完整說明 Zep 與 Graphiti 的關係、雙時間時序圖、episode ingestion、hybrid retrieval、部署選擇與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-zep-agent-memory-en)

[Zep](https://help.getzep.com/graphiti/getting-started/overview) 是以時序知識圖為核心的 agent memory 服務。它在意的不只是「Kendra 喜歡 Adidas」，還包括這個事實何時成立、何時被新資訊推翻，以及它來自哪一次互動。

這讓 Zep 和一般「對話切塊後做 semantic search」走上不同路線。前者把變動中的 entity、relationship 與 fact 當成一等資料；後者通常只能找到幾段相似文字，再由模型自行處理衝突。

## 先分清楚 Zep 與 Graphiti

**Graphiti** 是開源的 temporal knowledge graph framework。它負責 entity／edge extraction、bi-temporal model 與 fact invalidation。Hybrid retrieval 可融合向量、BM25 與圖 traversal，圖資料庫則能接 Neo4j、FalkorDB 等後端。

**Zep** 是建立在 Graphiti 思路上的代管服務，以 Context Graph／Context Lake 提供使用者、thread、治理、多租戶與營運能力。官方目前很明確地把兩者分開：Graphiti 適合自行維運單一 subject 的 context graph；Zep 負責大量圖的代管與治理。不能把 Graphiti 的開源授權直接推論成 Zep 整個服務都開源。

## Episode 如何變成會失效的事實

```text
chat / JSON / business event
          │
          ▼
       episode
          │ extract + resolve entities
          ▼
entity nodes ── fact edges ── entity nodes
                   │
        valid_at / invalid_at / provenance
                   │
          hybrid graph search
```

Episode 是輸入與 provenance 單位，可以是聊天、文字或結構化 JSON。系統從 episode 抽出節點與 edge；當新 episode 表示關係已變動，舊 edge 會被標記失效，而不是直接消失。

```python
from graphiti_core import Graphiti

graphiti = Graphiti(neo4j_uri, neo4j_user, neo4j_password)
await graphiti.build_indices_and_constraints()

# 實際 ingestion 會加入帶時間與來源的 episode
results = await graphiti.search("使用者目前在哪家公司？")
for edge in results:
    print(edge.fact, edge.valid_at, edge.invalid_at)
```

這種模型特別適合 CRM、客服狀態、訂閱方案、職務與偏好等會變動的資料。若知識庫大多是穩定文件，時序抽取的成本不一定換得到相同比例的價值。

## Retrieval 為什麼不只是 vector search

Graphiti 可以融合 semantic similarity、BM25 與圖關係，再依 search recipe 決定回傳 edge、node 或 episode。圖的價值在 multi-hop 與 entity neighborhood；時間欄位則讓應用區分「目前有效」與「歷史上曾經有效」。

Zep 的高階 `memory.get()` 會依目前 session 取回使用者圖中的相關 context string；`graph.search()` 則提供較低階的圖搜尋。前者適合直接塞入 prompt，後者適合應用自己控制結果與 reranking。

## 維運成本藏在 ingestion

Graphiti quickstart 需要圖資料庫、LLM 與 embedding provider。Episode ingestion 會做抽取、entity resolution 與關係更新，比單純產生一個 embedding 多出模型呼叫、併發限制與失敗重試。官方預設以 semaphore 控制併發，正是因為大量 episode 容易撞到 provider rate limit。

還要測 entity resolution 的錯誤：同名人物被合併、同一公司被拆成別名節點、否定句被寫成正向 fact，都可能讓圖看似結構完整卻答錯。時間圖提供表達衝突的能力，不代表抽取一定正確。

## 適合與不適合

適合 Zep／Graphiti 的情境：

- agent 需要追蹤使用者、客戶或案件狀態如何改變；
- 查詢會問「現在」「當時」或「變更前後」；
- 關係與 multi-hop 比原文段落更重要；
- 團隊願意評估 entity resolution、時間正確性與圖資料庫維運。

只要保存少量穩定偏好，Mem0 的介面更小。主要工作是把大量文件做成知識圖時，Cognee 的 pipeline 更通用；想讓 agent 主動管理 in-context memory，Letta 解的是另一層問題。

## 上線前的最小測試

建立「A 在甲公司任職」episode，再加入較晚的「A 已轉職乙公司」。分別查目前公司、過去公司與轉職時間，確認舊 edge 有 `invalid_at`、新 edge 有正確 `valid_at`，兩者都能追到來源 episode。接著用另一位同名人物測 entity resolution，這比只測 semantic recall 更能暴露時序圖的真正風險。

## 參考資料

- [Graphiti Overview](https://help.getzep.com/graphiti/getting-started/overview)
- [Graphiti Quick Start](https://help.getzep.com/graphiti/getting-started/quick-start)
- [Zep vs Graphiti](https://help.getzep.com/zep-vs-graphiti)
- [Zep Key Concepts](https://help.getzep.com/v2/concepts)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956)
