---
title: "Mastra：把 Agent、Workflow、Memory 與 Evals 放進 TypeScript"
date: 2026-08-22
category: ai
type: deep-dive
tags: [mastra, ai-agent, typescript, workflow, memory, observability]
lang: zh-TW
tldr: "Mastra 是 TypeScript agent 框架，將 agent、typed workflow、memory、MCP、tracing 與 scorers 放進同一套 Node.js 開發環境。"
description: "介紹 Mastra 的 Agent、Tools、Workflows、Memory、Studio 與評估能力，以及它和較薄 AI SDK 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mastra-typescript-agent-framework-en)

[Mastra](https://mastra.ai/docs) 是面向 TypeScript／Node.js 團隊的開放原始碼 agent 框架。它不只包一層模型 SDK，而是把 Agent、Tools、MCP、Workflows、Memory、tracing、scorers 與本機 Studio 放在同一個開發面。

這個定位最適合既有 Next.js、Node.js 或 Cloudflare 專案：前後端共用 TypeScript schema，不必另起 Python agent service。代價也很直接——framework surface 很寬，採用的不只是一次模型呼叫介面。

## Agent 與 Tool 都以 schema 為邊界

Mastra 的 Agent 組合 instructions、model、tools 與 memory；Tool 則用 schema 描述輸入，executor 實作行為。[官方工具指南](https://mastra.ai/docs/agents/mcp-guide)也能把 MCP server 的工具載入 agent，或把 Mastra agent 反向暴露成 MCP tool。

```ts
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const lookup = createTool({
  id: 'lookup-order',
  description: 'Look up an order',
  inputSchema: z.object({ id: z.string() }),
  execute: async ({ id }) => ({ id, status: 'shipped' }),
});

export const supportAgent = new Agent({
  name: 'Support agent',
  instructions: 'Use tools before answering order questions.',
  model: 'openai/gpt-5-mini',
  tools: { lookup },
});
```

Schema 能攔住格式錯誤，不能自動處理權限。工具查詢客戶資料時，仍要從 runtime context 取得已驗證身分，不能信任模型傳入的 customer ID。

## Workflow 負責確定路徑

[Mastra Workflows](https://mastra.ai/ai-workflows)用 typed step 組成 sequential、parallel、branch 與 loop，也支援 suspend／resume。Agent 適合「下一步要由模型判斷」；Workflow 適合順序、錯誤處理與人工核准必須明確的流程。兩者可互相組合，而不是把每個問題都塞進 agent loop。

這是 Mastra 最實用的設計：訂單核准可由 workflow 控制，只有分類理由或草稿生成交給 agent。外部寫入仍需冪等設計；框架保存 state，不等於第三方 API 的副作用會自動安全重播。

## Memory、tracing 與 scorer 形成回饋迴圈

Mastra memory 可保存 conversation history、working memory 與語意回憶。Tracing 記錄步驟輸入輸出，scorer 則用規則或模型評分。這三者要分清楚：memory 改變下次看到的 context，trace 解釋發生什麼，scorer 衡量結果是否達標。

正式採用前，應確認 storage 的資料所有權、trace 是否能匯出，以及模型輸入中的敏感資料是否需要遮蔽。Studio 很適合開發除錯，但 production 的稽核不能只存在某個視覺介面。

## 整體來說

Mastra 適合想在 TypeScript 裡同時建立 agent 與可恢復工作流的團隊。只有單次 structured generation 時，AI SDK 加 Zod 會更薄；需要 memory、人工暫停、trace 與 eval 一起進入產品生命週期時，Mastra 才真正省下整合成本。

最小評估請做一個三步驟 workflow：讀資料、讓 agent 判斷、人工核准後寫入，並實際重啟程序測 resume。跨框架差異見[Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)。

## 參考資料

- [Mastra documentation](https://mastra.ai/docs)
- [Mastra agents](https://mastra.ai/ai-agents)
- [Mastra workflows](https://mastra.ai/ai-workflows)
- [Mastra tools and MCP](https://mastra.ai/docs/agents/mcp-guide)
- [站內：2026 Agent 框架怎麼選](/posts/ai/2026-08-22-agent-framework-selection-guide)
