---
title: "Cloudflare Agent Memory 怎麼用：把 agent 記憶和 RAG 文件分開"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, agent-memory, agents, rag, memory, retrieval]
lang: zh-TW
tldr: "Agent Memory 是 Cloudflare 的 private beta 服務，用來讓 agent 跨對話記住使用者、團隊、專案與任務脈絡。它適合存 facts、events、instructions、tasks；RAG 文件、產品資料、檔案和 audit log 仍應該放在 AI Search、Vectorize、D1 或 R2。"
description: "從 Cloudflare Agent Memory 的 namespaces、profiles、ingest、remember、recall、list、delete、memory types、deduplication 與 RAG 邊界，拆解它在 Cloudflare AI Stack 裡的位置。"
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 8
---

> 🌏 [English version](/en/posts/ai/2026-08-30-cloudflare-agent-memory-en)

Agent 做久了，遲早會碰到「它要記得什麼」這個問題。使用者偏好、團隊規則、專案狀態、客服歷史、上次做過的決策、還沒完成的 follow-up，這些都不適合每次塞進 prompt，也不該全部混進文件檢索。

[Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/) 針對的是這段 durable memory。它讓 agent 可以跨對話記住 scoped context，並提供自動 extraction、storage、search、summarization。官方文件也明確標註：Agent Memory 目前是 private beta，所以這篇會把它當成方向和架構 primitive 來看，不把它寫成所有產品今天都能無條件依賴的穩定服務。

在 Cloudflare AI Stack 裡，Agent Memory 放在 Agents 後面。Agents 解決 durable runtime；Agent Memory 解決 runtime 以外，哪些知識要被長期記住、怎麼 recall、怎麼刪除、怎麼和 RAG 分開。

## Memory 和 RAG 的差別

最容易混淆的是 memory 和 RAG。

| 問題 | 用什麼 | 例子 |
|---|---|---|
| 使用者偏好、團隊規則、專案習慣 | Agent Memory | 「這個使用者偏好繁中回覆」「團隊 deploy 前要跑 pnpm verify」 |
| 文件、知識庫、產品手冊、政策 | AI Search / Vectorize | API docs、FAQ、法規文件、內部 wiki |
| conversation transcript、artifact、附件 | R2 / D1 | 完整對話、PDF、截圖、tool output |
| 當前任務狀態 | Agent state / SQLite | workflow step、pending approval、tool queue |

RAG 回答的是「我要從一批文件裡找資料」。Memory 回答的是「這個使用者、團隊、agent、tenant 或物件有什麼要被記住的脈絡」。兩者都會 retrieval，但資料來源和治理方式不同。

如果把每段文件都塞進 memory，memory 會變成難治理的文件庫。反過來，如果把使用者偏好藏在 RAG 文件裡，agent 每次都要碰運氣檢索到那份文件。

## Namespaces 和 profiles：先決定隔離邊界

Agent Memory 用 namespace 和 profile 隔離資料。namespace 可以分 application、environment 或 memory layer；profile 則是實際記憶的主體，可以是 user、agent、tenant、team，甚至是某個產品物件。

我會先用這些問題決定 profile：

- memory 是屬於個人，還是屬於 team？
- staging 和 production 要不要分開？
- 同一個 user 在不同 workspace 裡的偏好是否要共用？
- agent 自己的 operating rules 和 user preference 要不要分 profile？
- GDPR / deletion request 來時，應該刪哪個 profile 或 session？

這些問題不能等到資料長大後才想。Memory 的價值在於「記得正確的東西」，但前提是隔離邊界正確。

Workers binding 長這樣：

```jsonc
{
  "agent_memory": [
    {
      "binding": "MEMORY",
      "namespace": "prod-assistant"
    }
  ]
}
```

Worker 裡先取 profile：

```ts
const profile = await env.MEMORY.getProfile(`tenant:${tenantId}:user:${userId}`);
```

第一次 `getProfile()` 會建立 profile，官方文件也提醒，新 profile 的第一次呼叫可能比較慢。

## 四種 memory type

Agent Memory 會把抽出的記憶分成四種：

| Type | 意義 | 例子 |
|---|---|---|
| Facts | 穩定知識，會被新版本 supersede | 使用者身份、偏好、工具設定、專案目標 |
| Events | 已完成且有時間點的事件 | deploy、決策、milestone、觀察 |
| Instructions | 可重用的流程與慣例 | 寫作風格、release checklist、review workflow |
| Tasks | 短期、session-scoped 的待辦 | 目前調查、下一步、follow-up |

Facts 和 Instructions 支援 supersession。也就是新的記憶可以取代同 topic key 的舊記憶；舊版本保留，但 recall 時會浮出最新版本。Events 則累積，不互相衝突。Tasks 在 session 結束後會降權。

這個分類很實用，因為它讓 agent 不必把「偏好更新」和「歷史事件」混在一起。偏好會變；事件已經發生；instruction 需要可重用；task 通常有時效。

## ingest()：從對話抽出記憶

`ingest()` 會處理一段 conversation，讓 Agent Memory 自動 extraction、classification、deduplication、storage：

```ts
await profile.ingest(
  [
    {
      role: "user",
      content: "之後幫我寫技術文時，用台灣繁中，少用翻譯腔。",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      content: "了解，我會用自然的台灣繁中技術文語氣。",
      timestamp: new Date(),
    },
  ],
  { sessionId: "session-2026-08-30" },
);
```

官方 Workers API 寫明，message content 上限是 32 KB；一次 `ingest()` 最多 500 messages；`sessionId` 最長 64 characters。`ingest()` 是 idempotent，重複丟同一段 conversation 不會建立重複記憶。

我會在這些時機跑 `ingest()`：

- chat session 結束後。
- user 明確說「以後都這樣」。
- agent 完成一段重要 workflow。
- support / email thread 被處理完。

不要每個 token 都即時 ingest。Memory extraction 本身是工作，應該挑有意義的 boundary。

## remember()：應用已經知道時，直接記

如果 app 已經知道該記什麼，用 `remember()` 比丟 conversation 更直接：

```ts
await profile.remember({
  content: "User prefers Traditional Chinese technical writing with concrete Taiwan wording.",
  sessionId: "settings-update-2026-08-30",
});
```

例如 user 在 settings 裡選了語言偏好、team admin 設了 release rule、project 建立了固定 convention，這些不需要靠 LLM 從對話推測。直接 remember，讓 Agent Memory 做分類和摘要即可。

## recall()：查記憶，不要讓模型自己猜

當 agent 需要跨對話脈絡時，用 `recall()`：

```ts
const recalled = await profile.recall("How should I write technical posts for this user?", {
  thinkingLevel: "medium",
  responseLength: "short",
  referenceDate: new Date(),
});

if (recalled.count > 0) {
  systemContext.push(recalled.answer);
}
```

官方文件說，`recall()` 會做 query analysis，並平行搜尋 keyword indexes、topic key、semantic vector indexes 和 raw conversation messages，再合併排序，最後產生 grounded answer。如果沒有 match，會回空答案，不會編一段。

這點很重要。Memory retrieval 要允許「不知道」。如果沒有記憶，就讓 agent 問使用者或採用預設值，而不是裝作記得。

## list / get / delete：治理比記住更重要

Agent Memory 也提供 `list()`、`get()`、`delete()`、`deleteSession()`、`deleteProfile()` 和 `getSummary()`。這些 API 對產品很重要，因為 memory 一旦跨 session，就會牽涉：

- 使用者要看系統記得什麼。
- 使用者要刪某段記憶。
- session 需要被清掉。
- profile 需要依租戶或帳號刪除。
- support 或 admin 需要檢查 memory summary。

我不會在沒有 UI / admin path 的狀態下大量開 memory。能記住資料，也要能解釋、列出、修正、刪除資料。

## 在 AI app 裡怎麼分層

一個 Cloudflare AI app 可以這樣切：

1. Agents：維持 durable session、WebSocket、tool loop。
2. Agent Memory：存 user/team/project 的 facts、events、instructions、tasks。
3. AI Search：處理 managed RAG 文件。
4. Vectorize：自己控制 chunking、embedding、metadata filter 的 retrieval。
5. D1：存產品資料、conversation index、billing event。
6. R2：存完整 transcript、附件、artifact、raw email。
7. Analytics Engine：記 recall hit、tool latency、tenant usage。

這樣 agent 在每次回覆前，可以先組 context：

- current prompt
- current agent state
- recalled memory
- retrieved documents
- product DB records
- tool results

每一層的資料治理不同，不能全部叫做 memory。

## 什麼時候先不要用

我會暫緩使用 Agent Memory 的情境：

- 產品目前沒有 private beta access。
- 只需要查固定文件，AI Search 或 Vectorize 就夠。
- 記憶內容高度敏感，但還沒有刪除、審計和使用者可見機制。
- 團隊還沒決定 profile / namespace 隔離模型。
- agent 只做 single-turn task，不需要跨對話記住任何事。

Agent Memory 的方向很有價值：Cloudflare 把 extraction、storage、search、summarization 做成一個 managed memory layer。但「會記得」不是目標本身。好的 memory 設計要能說清楚：記誰、記什麼、記多久、誰能看、誰能刪、什麼時候 recall。

## 參考資料

- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [How Agent Memory works](https://developers.cloudflare.com/agent-memory/concepts/how-agent-memory-works/)
- [Agent Memory Workers API](https://developers.cloudflare.com/agent-memory/api/workers-api/)
- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
