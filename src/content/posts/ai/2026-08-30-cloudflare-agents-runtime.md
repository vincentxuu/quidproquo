---
title: "Cloudflare Agents 怎麼用：durable agent runtime、工具與即時連線"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, agents, workers-ai, durable-objects, tools, websockets]
lang: zh-TW
tldr: "Cloudflare Agents 把 agent session 做成 durable runtime：每個 agent instance 有穩定 identity、local SQLite、WebSocket、scheduled work、recoverable execution 和 tools。它不只是聊天範例；真正處理的是怎麼把 Workers、Durable Objects、AI model、Browser、Sandbox、AI Search、MCP 接成可部署的 agent app。"
description: "從 Cloudflare Agents 的 communication channels、agent harness、Agents SDK runtime、Agent class、state、sessions、WebSockets、scheduling、tools 與 Durable Objects 依賴，拆解它在 AI Stack 裡的位置。"
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 7
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 22
---

> 🌏 [English version](/en/posts/ai/2026-08-30-cloudflare-agents-runtime-en)

很多「agent app」其實只是 HTTP endpoint 加上一段 while loop：收到訊息、呼叫模型、選工具、再回覆。demo 很快，但產品一上線就會碰到同一批問題：使用者斷線怎麼辦？同一個 user 的 session 要怎麼找回？工具呼叫跑到一半失敗怎麼恢復？WebSocket、email、Slack、webhook 這些入口要怎麼接到同一個狀態？

[Cloudflare Agents](https://developers.cloudflare.com/agents/) 針對的是這一層 runtime。官方文件把 Agents 拆成四個部分：communication channels、agent harness、Agents SDK runtime、tools。這個拆法比「Cloudflare 也能跑 chat bot」重要，因為 agent app 的難點常常落在 state、連線、工具、排程、恢復和觀測。

在 Cloudflare AI Stack 裡，Agents 放在 Workers AI、AI Gateway、AI Search、Vectorize 後面。前面幾篇先回答模型和 retrieval；Agents 這篇回答「怎麼把這些能力包成一個會持續存在的應用單位」。

## Cloudflare Agents 的四層

我會用這張表理解 Agents：

| 層 | 負責什麼 | 例子 |
|---|---|---|
| Communication channels | 使用者和系統怎麼進來 | chat、voice、email、Slack、webhooks |
| Agent harness | agent loop 怎麼跑 | Project Think、自己寫 planning/tool loop |
| Agents SDK runtime | durable identity、state、connection、schedule、recovery | Agent class、sessions、WebSockets、fibers、SQLite |
| Tools | agent 能操作什麼 | Browser、Sandbox、AI Search、MCP、Payments |

這四層要分開看。Chat UI 只是 channel；model provider 只是推理來源；tools 只是能力；runtime 才決定 agent 是否能跨 request、跨連線、跨時間維持狀態。

## Agent instance：一個可定位的小型 server

Agents SDK 的核心是 server-side `Agent` class：

```ts
import { Agent, routeAgentRequest } from "agents";

type State = {
  status: "idle" | "working";
};

export class ResearchAgent extends Agent<Env, State> {
  async onRequest(request: Request): Promise<Response> {
    return Response.json({ state: this.state });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
```

官方文件說，每個 Agent 可以有 millions of instances；每個 instance 都是獨立運作的 micro-server，通常用 user ID、email、ticket number、channel id 這類穩定識別來定址。同名 instance 會回到同一個 agent。

這和傳統 stateless endpoint 很不一樣。你不需要每次 request 都重新組 session store，也不需要把所有狀態塞到外部 Redis。Cloudflare Agents 要求 Durable Objects；每個 agent instance 背後就是 durable execution 和 storage 的單位。

## Lifecycle：不只 fetch

Agent lifecycle 不只有 HTTP request。官方 Agents API 列出多個 hook：

- `onStart()`：instance 啟動或從 hibernation 醒來。
- `onRequest()`：HTTP request。
- `onConnect()` / `onMessage()` / `onClose()`：WebSocket lifecycle。
- `onEmail()`：email route 到 agent。
- `onStateChanged()`：state 從 server 或 client 改變。

這也是 agent runtime 和一般 Worker handler 的差別。Agent 可能同時有 browser client、Slack message、email、scheduled task、tool result。runtime 要讓這些事件打到同一個 instance，而不是散成幾個互不認識的 request handler。

## State 和 SQLite：短期狀態放 instance，長期資料再分層

每個 Agent instance 有 `this.state` 和 `this.sql`。`this.state` 適合和 client 同步的狀態，例如目前任務狀態、UI 顯示用的進度、selected tool。`this.sql` 則是 embedded SQLite，可以存 instance-local 的結構化資料：

```ts
this.sql`
  CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    status TEXT,
    created_at TEXT
  )
`;

this.sql`
  INSERT INTO runs (id, status, created_at)
  VALUES (${runId}, ${status}, ${new Date().toISOString()})
`;
```

我會這樣切：

- Agent state：當前 UI/connection 需要同步的狀態。
- Agent SQLite：這個 agent instance 的 local run、queue、checkpoint。
- D1：跨 agent、跨 tenant、需要報表或 join 的資料。
- R2：檔案、artifact、長 transcript、工具輸出。
- Agent Memory：跨對話可回想的 preference、instruction、project fact。

這樣可以避免把所有資料都塞進一個地方。Agent instance 是狀態中心，但不是整個產品唯一的資料庫。

## WebSockets 和 chat：agent 需要即時連線

Agents 支援 WebSockets，也有 client-side SDK：`AgentClient`、`useAgent()`、`useAgentChat()`。如果你做的是 chat agent，官方建議可以 extend `AIChatAgent`，取得 message persistence、resumable streaming、React hook 整合。

這對 AI app 很實用。使用者不一定會等完整工具流程跑完；網路可能斷線；LLM response 可能 streaming 到一半；tool call 可能要人工核准。Durable agent instance 讓 client 可以重新連回同一個 agent，繼續看狀態。

這也是為什麼 Agents 不只是「呼叫 Workers AI 的範例」。Workers AI 解決 inference；Agents 解決「一個 AI workflow 要怎麼活在產品裡」。

## Tools：Browser、Sandbox、AI Search、MCP

Agents 的 tools 層把 Cloudflare AI Stack 其他服務接進來：

- Browser：讓 agent 用 Browser Run 操作網頁、截圖、抽資料。
- Sandbox：讓 agent 執行程式或分析 artifact。
- AI Search：讓 agent 查 managed RAG 資料來源。
- MCP：讓 agent 接外部工具與服務。
- Payments：讓 agent 參與需要付款流程的動作。

這裡要小心。Tool 能力越強，越需要權限邊界。Browser tool 需要 domain allowlist；Sandbox tool 需要資源限制；MCP tool 需要 per-user authorization；Payments 更需要 human approval 和 audit log。

我會在 agent harness 裡明確設計：

- 哪些 tool 可以自動跑。
- 哪些 tool 需要使用者確認。
- 哪些 tool 只能讀，不能寫。
- tool result 要不要寫進 D1/R2。
- tool failure 要不要 retry、fallback 或停止。

## Configuration：Agents 是 Durable Objects

Agents 專案的 Wrangler config 會包含 Durable Object bindings、`exports`、`nodejs_compat`、可選的 AI binding 和 observability：

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "durable_objects": {
    "bindings": [
      {
        "name": "ResearchAgent",
        "class_name": "ResearchAgent"
      }
    ]
  },
  "exports": {
    "ResearchAgent": {
      "type": "durable-object",
      "storage": "sqlite"
    }
  },
  "ai": {
    "binding": "AI"
  },
  "observability": {
    "enabled": true
  }
}
```

官方 configuration 文件也提醒，Agents 需要 `nodejs_compat`；新 Agents 建議使用 SQLite storage；`exports` 用來宣告 Agent class 和 durable-object storage。這些設定不是樣板細節，實際上就是 agent runtime 的依賴。

## 什麼時候該用 Agents

我會在這些場景用 Agents：

- 需要長期存在的 user/session/team/channel agent。
- 需要 WebSocket 或 resumable streaming。
- 同一個 agent 要接 chat、email、Slack、webhook 多入口。
- 需要 scheduled tasks 或 recoverable execution。
- agent 需要 local state、SQLite、tool queue 或 checkpoint。
- 需要把 Browser、Sandbox、AI Search、MCP 接成同一個 durable workflow。

如果只是「收到 HTTP request，呼叫一次模型，回傳 JSON」，普通 Worker + Workers AI / AI Gateway 就夠了。Agents 的價值在於狀態和生命週期，不在於讓 single-turn completion 變得更神奇。

## 在 AI Stack 裡的順序

Cloudflare AI Stack 的閱讀順序可以這樣看：

1. Workers AI：模型在哪裡跑。
2. AI Gateway：模型呼叫怎麼被觀測、快取、fallback、控成本。
3. AI Search / Vectorize：資料怎麼被找回來。
4. Agents：誰在持續執行任務、維持 state、操作 tools。
5. Agent Memory：哪些跨對話知識要被記住。
6. Browser / Sandbox / Secrets：agent 可以用哪些高風險工具，以及金鑰怎麼管。

Agents 是把前面那些服務接成產品的 runtime。它不是取代 Workers；它把 Workers、Durable Objects、WebSockets、AI models、tools 和 observability 包成一個可以長期存在的 agent 單位。

## 參考資料

- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Agents API](https://developers.cloudflare.com/agents/runtime/agents-api/)
- [Agents configuration](https://developers.cloudflare.com/agents/runtime/operations/configuration/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare AI Search](https://developers.cloudflare.com/agents/tools/ai-search/)
