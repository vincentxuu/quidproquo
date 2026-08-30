---
title: "Cloudflare AI app 資料怎麼放：D1、R2、Durable Objects 的分工"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, d1, r2, durable-objects, rag, agents]
lang: zh-TW
tldr: "AI app 不該把 conversation、artifact、memory、retrieval document、lock、eval trace 全塞進同一個 storage。D1 適合查詢與產品資料，R2 適合大型檔案與 artifact，Durable Objects 適合具名協調、WebSocket、per-session state；Agent Memory / AI Search / Vectorize 則分別處理記憶與檢索。"
description: "從 Cloudflare D1、R2、Durable Objects、Agent Memory、AI Search、Vectorize 與 Analytics Engine 的資料形狀，整理 AI / RAG / agent app 在 Cloudflare 上的 storage architecture。"
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 12
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 25
---

> 🌏 [English version](/en/posts/ai/2026-08-30-cloudflare-ai-app-storage-patterns-en)

AI app 很容易把資料放錯地方。conversation 放 D1、完整 transcript 放 D1、PDF 放 D1、embedding metadata 放 D1、工具輸出也放 D1，最後 database 變成檔案櫃。另一種常見錯法是把所有東西都丟 R2，結果要查狀態、分 tenant、做報表時，每一步都要掃 object。

Cloudflare 的好處是資料 primitive 很多；壞處也是資料 primitive 很多。你有 [D1](https://developers.cloudflare.com/d1/)、[R2](https://developers.cloudflare.com/r2/)、[Durable Objects](https://developers.cloudflare.com/durable-objects/)、KV、Queues、Analytics Engine、AI Search、Vectorize、Agent Memory。這篇不重講每個服務的入門，而是整理 AI / RAG / agent app 裡常見資料應該放哪裡。

## 先看資料形狀

我會先用這張表：

| 資料 | 優先位置 | 原因 |
|---|---|---|
| user、tenant、plan、conversation index | D1 | 需要 SQL、join、查詢、報表 |
| 完整 transcript、附件、PDF、截圖、tool output | R2 | 大型 unstructured object |
| 當前 agent/session state、WebSocket coordination、lock | Durable Objects | 具名 instance、強一致、靠近 compute |
| 使用者偏好、團隊規則、專案記憶 | Agent Memory | 跨對話 scoped memory |
| RAG 文件檢索 | AI Search / Vectorize | managed RAG 或自建向量搜尋 |
| queue job、workflow run 狀態索引 | D1 + Queues / Workflows | 查詢與背景流程分離 |
| usage、latency、token、tool metrics | Analytics Engine | 高基數事件與 time series |

重點不在比較哪個服務比較強，而是看哪種資料形狀最接近問題。

## D1：產品資料和可查詢狀態

[D1](https://developers.cloudflare.com/d1/) 是 Cloudflare 的 managed serverless database，提供 SQLite SQL semantics、Worker / HTTP API access、Time Travel、Global Read Replication。它適合放產品資料和可查詢狀態：

- users / tenants / memberships
- conversations table
- messages index
- jobs / workflow runs
- billing events
- eval run summaries
- document metadata

例如 conversation 不一定要把完整內容都塞 D1。比較穩的是：

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  r2_key TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

D1 留索引與查詢欄位，完整 transcript 放 R2。這樣你可以查「某 tenant 最近 30 天有多少 conversation」，也不會讓資料庫被長文本撐大。

## R2：大型內容和 artifact

[R2](https://developers.cloudflare.com/r2/) 是 object storage，適合大型 unstructured data，而且沒有傳統 cloud storage 常見的 egress bandwidth fee。AI app 常見 R2 用途：

- user uploaded PDFs、images、audio、CSV
- RAG corpus 原始文件
- Markdown conversion 後的中間檔
- model / eval artifacts
- sandbox output
- browser screenshots / PDFs
- 完整 conversation transcript
- raw email 或 webhook payload archive

R2 的原則是：需要整包拿出來、尺寸可能很大、查詢模式不是 SQL 的資料，就放 object。D1 存 pointer 和 metadata；R2 存 body。

例如：

```ts
await env.ARTIFACTS.put(`tenants/${tenantId}/runs/${runId}/transcript.json`, JSON.stringify(messages), {
  httpMetadata: { contentType: "application/json" },
});

await env.DB.prepare(
  "UPDATE conversations SET r2_key = ?, updated_at = ? WHERE id = ?",
).bind(r2Key, new Date().toISOString(), conversationId).run();
```

這樣你可以用 D1 查到 conversation，再用 R2 取完整內容。

## Durable Objects：具名協調與 per-session state

[Durable Objects](https://developers.cloudflare.com/durable-objects/) 是 stateful serverless 的 building block。官方文件強調每個 Durable Object 有 globally-unique name，並有 attached durable storage；它適合需要協調多個 client 或事件的場景。

在 AI app 裡，DO 常見角色是：

- 一個 chat session 的 WebSocket hub。
- 一個 agent instance 的 state owner。
- 一個 tenant/job 的 lock。
- Browser Run session coordinator。
- Container / Sandbox lifecycle controller。
- rate limit bucket 或 concurrency controller。

DO 不適合變成所有產品資料的唯一資料庫。它強在「同一個 entity 的順序與協調」。例如同一個 conversation 的 streaming response、tool call、user cancel、reconnect，都應該打到同一個 DO / Agent instance。

```ts
const id = env.CHAT_SESSION.idFromName(`${tenantId}:${conversationId}`);
const stub = env.CHAT_SESSION.get(id);
return stub.fetch(request);
```

這比把所有同步問題丟給 D1 transaction 更自然。D1 管查詢；DO 管正在發生的協調。

## Agent Memory、AI Search、Vectorize：不要混成一個 memory bucket

AI app 還有三種很容易混淆的資料層：

- Agent Memory：user/team/project 的 facts、events、instructions、tasks。
- AI Search：託管 RAG pipeline，資料來源、索引、混合檢索由 Cloudflare 包起來。
- Vectorize：自己控制 embedding、metadata、query path 的向量搜尋。

使用者偏好不該塞進 AI Search 文件庫。產品文件不該當 Agent Memory。embedding index 也不該拿來當完整 transcript archive。

我會這樣判斷：

- 「下次和這個 user 對話要記得」：Agent Memory。
- 「問答時需要查文件」：AI Search 或 Vectorize。
- 「之後需要完整重放或稽核」：R2。
- 「需要列表、filter、join、報表」：D1。
- 「現在有一個 session 正在跑」：Durable Objects / Agents。

## 一個實際架構

假設要做一個客服 agent：

1. Worker 接 chat / email / webhook。
2. Agent instance 或 Durable Object 以 `tenantId:userId` 定址。
3. Agent Memory recall 使用者偏好、過去事件、團隊 instruction。
4. AI Search 查產品文件和客服知識庫。
5. D1 寫 conversation index、ticket state、billing event。
6. R2 存完整 transcript、附件、AI 產生的摘要和原始 email。
7. Queues 處理非即時分類、摘要、通知、重試。
8. Analytics Engine 記 token、latency、tool call、retrieval hit、tenant usage。

每一層都能替換，但責任不要混。D1 不是 blob store；R2 不是 query engine；DO 不是 BI database；Agent Memory 不是萬用知識庫。

## 什麼資料不要存

AI app 特別容易過度留存。幾個原則：

- 不要把 provider API key、session cookie、OAuth token 寫進 transcript。
- 不要把完整 prompt 和回覆都塞進 log。
- 不要把個資放進 Analytics Engine 維度。
- 不要讓 R2 object key 洩漏 tenant 或 user 的敏感資訊。
- memory 要能 list、delete、profile deletion。
- eval trace 要和 production user data 分開。

資料放對地方只是第一步。第二步是知道哪些資料不該存在、哪些資料要短期、哪些資料要可刪除。

## 最小可行版本

如果今晚要做一個 Cloudflare AI app，我會先這樣開：

- D1：`users`、`conversations`、`messages_index`、`jobs`。
- R2：`transcripts/`、`uploads/`、`artifacts/`。
- Durable Objects / Agents：`conversationId` 或 `tenantId:userId` 做 instance key。
- AI Search：先用 managed RAG，等需要自訂 retrieval 再用 Vectorize。
- Analytics Engine：只記 usage/latency/error，不放 PII。
- Secrets Store：AI Gateway BYOK 或跨 Worker provider key。

這個版本不是最完整，但責任分明。等到 workload 真的變大，再把 queue、workflow、container、browser、memory 分別補上。

## 參考資料

- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
