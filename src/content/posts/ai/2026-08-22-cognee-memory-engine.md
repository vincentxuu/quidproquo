---
title: "Cognee 完整介紹：把文件變成 Agent 可查詢的知識圖記憶"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cognee, memory, ai-agent, knowledge-graph, rag, data-pipeline]
lang: zh-TW
tldr: "Cognee 是資料到 AI memory 的 pipeline：用 relational store 保存來源與 provenance、vector store 找語意相近內容、graph store 表達 entity 關係，再以 remember、recall、improve、forget 管理生命週期。"
description: "完整介紹 Cognee 的三種儲存、DataPoint／Task／Pipeline、remember／recall／improve／forget API、部署選擇與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cognee-memory-engine-en)

[Cognee](https://docs.cognee.ai/core-concepts/overview) 是把文件、文字與結構化資料轉成可搜尋 AI memory 的開源工具。它不只建立 embedding，也會抽取 entity 與 relationship，將來源、向量與知識圖保存在不同儲存層。

這使它更像一套可組裝的 knowledge pipeline，而不是替聊天機器人加上 `remember()` 的薄 API。適合拿來處理文件型知識、研究資料與需要 ontology 的領域；若只有少量使用者偏好，整套圖處理可能太重。

## 三種儲存各負責一件事

```text
files / text / URLs
       │ loader + chunker
       ▼
 relational store ─ provenance / datasets / chunks
       │
       ├── vector store ─ semantic retrieval
       │
       └── graph store ─ entities / relationships
                         │
                         ▼
                  recall / reasoning
```

Relational store 保存文件、chunk 與來源關係；vector store 供語意搜尋；graph store 保存節點與 edge。Cognee 的本機預設可以快速開始，production 則能替換成 PostgreSQL、LanceDB、Neo4j、Neptune 等後端。這份彈性也代表你要自己負責跨儲存的一致性、備份與刪除驗證。

## DataPoint、Task、Pipeline 是真正的擴充點

DataPoint 是會變成圖節點的結構化單位；Task 是單一轉換步驟；Pipeline 把多個 Task 接成 ingestion 或 enrichment 流程。舊 API 常看到 `add → cognify → memify → search`，目前 v1.0 的高階操作則整理為：

- `remember`：寫入永久 graph memory 或 session memory；
- `recall`：從 session 與永久記憶取回 context；
- `improve`：替既有圖補充關係，或把 session 記憶提升到永久層；
- `forget`：依 item、dataset 或 user scope 移除資料。

```python
import asyncio
import cognee

async def main():
    await cognee.remember("專案 Atlas 的資料庫是 PostgreSQL。")
    result = await cognee.recall("Atlas 使用哪個資料庫？")
    print(result)

asyncio.run(main())
```

若你要控制 chunking、entity schema 或 enrichment，就應深入 lower-level pipeline，而不是把高階 API 當成不可見黑盒。

## Graph memory 的價值與代價

向量搜尋擅長找到「意思相近的段落」，圖則擅長表達「A 使用 B」「B 依賴 C」與多跳關係。Cognee 可以在圖 traversal、vector similarity 與生成式回答間選擇不同 search type，還能以 Node Sets、ontology 與自訂 DataPoint 限縮領域。

代價首先是 ingestion。Entity extraction 與 relationship extraction 會用到模型，結果受 prompt、model 與 schema 影響。其次是 schema 演進：今天把 `PostgreSQL` 當 Technology，明天改成本體中的 Database，舊圖不會無痛自動變乾淨。最後是刪除：同一來源衍生出 chunk、embedding、node 與 edge，`forget` 是否刪乾淨必須用實際查詢驗證。

## OSS 與 Cognee Cloud

OSS 適合本機、air-gapped、客製 pipeline 與自選後端；你承擔基礎設施、模型金鑰與升級。Cognee Cloud 代管 PostgreSQL、LanceDB、Kuzu 與 pipeline 執行，並提供資料集權限與 UI；導入較快，但資料處理、費用和客製邊界要另外評估。

不要只比較「能不能 self-host」。還要確認模型呼叫是否留在自管環境，以及 graph／vector／relational 三層如何備份。使用者刪除如何傳播、不同 dataset 的權限能否在 retrieval 前生效，也要實際驗證。

## 跟其他 Agent memory 工具怎麼分

Mem0 的最小單位是可搜尋的個人化 memory；Zep／Graphiti 強調會隨時間失效的 fact；Letta 把 memory block 放進 stateful agent runtime。Cognee 的強項是把原始資料加工成可客製的知識結構。因此它和 RAG ingestion pipeline 的重疊，比和 conversation-history library 的重疊更大。

## 上線前的最小測試

準備十份含同名 entity、否定句與版本更新的文件。跑完 remember 後，逐一檢查來源到 chunk、node、edge 的 provenance；更新一份、刪除一份，再查舊 fact 是否仍會回來。最後替兩個 user 或 dataset 建相同名稱的資料，確認 retrieval 不會跨邊界。這四步比只看圖 visualization 更能證明它可維運。

## 參考資料

- [Cognee Core Concepts Overview](https://docs.cognee.ai/core-concepts/overview)
- [Cognee Introduction](https://docs.cognee.ai/getting-started/introduction)
- [Cognee Graph Stores](https://docs.cognee.ai/setup-configuration/graph-stores)
- [Cognee Search API](https://docs.cognee.ai/python-api/search)
- [Cognee Cloud Overview](https://docs.cognee.ai/cognee-cloud/overview)
