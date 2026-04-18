---
title: "當 Agent 要呼叫 Agent：A2A 的問題空間"
date: 2026-04-18
category: ai
tags: [a2a, agent, mcp, protocol, multi-agent, google-adk, ibm-acp]
lang: zh-TW
tldr: "A2A 不是某一家的協議名稱，而是一個問題空間：agent 要呼叫另一個會推理的 agent，需要 discovery、task 狀態機、opacity、async 這幾件事。Google A2A、IBM ACP 都在解它，但多數單機多 agent 場景還用不到——真正的價值在跨框架、跨組織。"
description: "把 A2A 當成問題空間看：agent 之間通訊需要解的設計問題、現行協議（Google A2A、IBM ACP 等）的取捨、以及跟 MCP 的分工邊界。"
draft: false
---

「A2A」這個詞最近出現頻率變高，但多數文章直接跳進 Google 那一版的 spec，沒先講清楚它在解什麼。這篇不綁定任何一家協議，把 agent-to-agent 當成**問題空間**拆開——先定位 agent 目前在跟誰講話、為什麼既有方案湊不出來、再看現行幾家怎麼解、最後回答最現實的問題：現在該不該上車。

## Agent 在跟誰講話

先攤開 agent 這個角色的互動面，A2A 才有位置可以放：

| 互動對象 | 在解什麼 | 代表協議 / 技術 |
|---|---|---|
| **Agent ↔ Tool** | 呼叫確定性功能（檔案、API、DB） | MCP |
| **Agent ↔ Agent** | 把工作委派給另一個會推理的 agent | **A2A**（Google）、IBM **ACP** |
| **Agent ↔ Human** | 確認、回問、approvals | human-in-the-loop（各家自訂） |
| **Agent ↔ Model** | 選模型、routing、failover | OpenAI-compatible、Anthropic API |
| **Agent ↔ Editor / IDE** | 編輯器 ↔ agent 的 UI 協定 | Zed **Agent Client Protocol** |
| **Agent ↔ Runtime** | 沙箱、檔案系統、shell、state | 各家 harness 自建 |
| **Agent ↔ Web / OS** | 抓網頁、桌面操作 | WebMCP、Computer Use |
| **Agent ↔ Memory** | 向量庫、知識圖、長期記憶 | RAG stack |

一個先提醒再往下講的坑：**「ACP」被兩個協議搶走了**。IBM 的 ACP 是 Agent Communication Protocol（agent ↔ agent，跟 A2A 打對台），Zed 的 ACP 是 Agent Client Protocol（editor ↔ agent，像 LSP）。這篇講的是 IBM 那個。

## 為什麼既有方案湊不出來

既然協議這麼多，為什麼還需要 A2A？先排除幾個常見的「用現有東西硬湊」方案：

**把對方包成 MCP tool**
這是最多人第一直覺。問題是 MCP 的語意是「確定性工具呼叫」——你送 input、拿 output、通常秒回。但**另一個 agent 不是工具**：它會自己思考、中途可能需要回問你、任務可能跑兩天、輸出不是 JSON 是一段協商過的對話。硬塞進 tool call 會失去這些特性，變成一個假裝同步的黑盒。

**用框架內建的 handoff / sub-agent**
CrewAI、LangGraph、OpenAI Agents SDK 都有 handoff 機制，但**只在同一個框架內成立**。CrewAI 的 agent 沒辦法用 handoff 呼叫 LangGraph 的 agent，因為它們的 task 格式、memory、tracing 都不相容。

**直接走 HTTP API**
可以，但你得自己發明：怎麼 discovery、task 狀態怎麼表達、streaming 怎麼做、跨組織的授權怎麼走、取消和回問怎麼處理。每家都重新造一輪，就是沒有標準的狀態。

真正缺的，是一個同時滿足「**跨框架 + 長任務 + 會對話 + 可發現**」的協議。這就是 A2A 在解的問題。

## A2A 類協議要解的共通設計問題

不管是 Google A2A 還是 IBM ACP，這類協議都要回答下面幾件事。看懂這幾件，比背任何一家的 spec 都重要：

**Discovery**
我怎麼知道對方是誰、能做什麼、要怎麼認證？這件事的標準解法是一份 machine-readable 的元資料檔——Google A2A 放在 `/.well-known/agent.json`（叫 Agent Card），IBM ACP 用類似的 manifest。欄位通常包含：名字、描述、capabilities、支援的 modality、endpoint、auth 方式。

**Task 狀態機**
長任務不能用 request/response 表達。A2A 類協議都會定義一個狀態機，大致是：

```
submitted → working → input-required → working → completed
                  ↘ canceled
                  ↘ failed
```

關鍵是 `input-required` 這一個狀態——它容納了「remote agent 中途需要回問」這件事，而這正是 agent ≠ tool 的本質差異。

**Opacity（不透明性）**
你呼叫 remote agent，不該（也不能）知道它內部用哪個模型、call 了哪些 tool、有沒有用 sub-agent。這跟 MCP 恰好相反——MCP 的 tool schema 是明示的，A2A 則刻意把對方當黑盒。這個設計選擇讓 A2A 能跨組織（對方不想讓你看到內部），但也意味著你很難對 remote agent 的行為做形式化保證。

**Modality**
agent 的輸入輸出不只是 text：可能是檔案、結構化資料、表單請求、甚至要求 human 上傳東西。A2A 類協議通常把訊息拆成多個 part，每個 part 有自己的 type。

**Async / Streaming**
任務可能跑很久。標準做法是用 SSE 推 incremental update，或用 webhook / push notification 讓 remote agent 在完成時主動通知。

**Trust / Auth**
跨組織呼叫 agent 的授權模型比 MCP 複雜很多——不只是 API key，還有：哪些 task 可以接、哪些資料可以看、哪些 artifact 可以回傳。這塊目前還在各家自己摸索的階段，沒有標準答案。

## 現行協議比較

目前有三種立場的解法並存：

| 解法 | 提出方 | 定位 | 狀態 |
|---|---|---|---|
| **Google A2A** | Google + 50+ 夥伴（Salesforce、SAP、ServiceNow、Atlassian、LangChain…） | 跨廠商開放協議 | 2025 Cloud Next 發布，已捐 Linux Foundation |
| **IBM ACP** | IBM BeeAI | REST-first、與 BeeAI runtime 整合 | 2025 發布，正與 A2A 整合中 |
| **OpenAI Handoffs** | OpenAI Agents SDK | SDK 內建機制 | 不是協議，只在 OpenAI 生態內 |
| **Framework-native** | CrewAI、LangGraph、Claude Code subagent | 各自實作 | 不跨框架 |

從生態廣度看，**Google A2A 目前領先**。50+ 合作夥伴、Linux Foundation 背書、CrewAI 和 Google ADK 都原生支援。IBM ACP 在技術設計上跟 A2A 非常像，雙方 2025 年下半已經宣布要收斂到同一個標準底下——這是好消息，因為多協議並存最痛的就是使用者。

OpenAI Handoffs 不在同一個層級——它是 SDK 內部的任務移交，不跨進程也不跨組織，比較像 function call 的糖衣。Framework-native 也類似：好用，但一碰到跨框架就變成零。

## 以 Google A2A 為例：一次呼叫長什麼樣

因為生態最成熟，用 Google A2A 當標本。典型流程是三步：

**1. 找到對方（Agent Card）**

```json
GET https://support.example.com/.well-known/agent.json

{
  "name": "Customer Support Agent",
  "description": "Handles tier-1 customer support tickets",
  "url": "https://support.example.com/a2a",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    { "id": "lookup_order", "name": "Order lookup" },
    { "id": "refund", "name": "Process refund" }
  ],
  "authentication": { "schemes": ["bearer"] }
}
```

**2. 送出 task**

```json
POST /a2a
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "id": "task-123",
    "message": {
      "role": "user",
      "parts": [{ "type": "text", "text": "退款訂單 #A8821" }]
    }
  }
}
```

**3. 訂閱狀態變化**
透過 SSE 拿到 `working` → `input-required`（remote agent 可能回問：「請提供訂單 email」）→ `working` → `completed`，最後 artifact 裡是確認單號。

真正跑起來的樣子就是這樣——看起來很像在呼叫一個會對話的 REST API，但背後的狀態機和 message 結構讓它能承載遠比 REST 豐富的互動。

## A2A vs MCP：同一個專案會同時用到

這是讀者最常問的問題，直接攤開：

| 維度 | MCP | A2A |
|---|---|---|
| **對象** | Agent ↔ Tool | Agent ↔ Agent |
| **語意** | 確定性工具呼叫 | 把工作委派給會推理的對等體 |
| **時長** | 通常秒級 | 可長、可中斷、可回問 |
| **可見性** | tool schema 透明 | 對方內部不透明 |
| **狀態** | 無狀態 | 有 task 狀態機 |
| **典型載荷** | JSON input / output | 多輪 message + artifact |

兩者不互斥，同一個 agent 很可能**同時是 A2A server（對外）也是 MCP client（對內）**——對外開放 skills 給其他 agent 呼叫，對內用 MCP 拿檔案、查 DB。Google 和 Anthropic 都明確講過這兩個協議互補，不是取代關係。

## 現在該不該上車

誠實講，**多數專案現在還用不到 A2A**。判斷標準很簡單：

**該用：**
- 你要把 agent 當成公開 service 開放給其他組織呼叫
- 你在接不同框架建的 agent（LangGraph 呼叫 CrewAI 之類）
- 你的任務是長期非同步的（人工審核、跨天 pipeline）

**不該用：**
- 單機多 agent：framework 內建 handoff 就夠，硬套 A2A 只是增加複雜度
- 你能控制兩端：直接 function call 或內部 RPC 快得多
- 原型階段：先把單一 agent 做對，再考慮怎麼跟別人對話

還有一個冷靜點的理由不要急：**標準還在收斂**。Google A2A 和 IBM ACP 正在整合、Linux Foundation 那邊還在定治理模型、Agent Card 格式細節也還會改。現在就深度綁定某一版 spec，半年後可能要改一輪。

## 為什麼還是要看懂它

就算現在不用，這個問題空間值得提早理解。理由是：

- 「agent 會變成像 web service 一樣可被呼叫的公民」這件賭注如果成立，A2A 就是這代的 HTTP 之於 web、LSP 之於編輯器。現在每個大廠都在押這一注。
- **MCP 已經證明了協議層的槓桿**——標準站穩後，生態爆發的速度比想像快。A2A 如果走同一條路，窗口期很短。
- 理解 A2A 的設計取捨，就算自己不實作，也會讓你在選 framework、設計 agent 系統時問對問題：「這個 agent 將來要不要被別人呼叫？」「task 狀態怎麼暴露？」「remote agent 的 opacity 怎麼處理？」

這些問題以前沒人問，是因為沒有框架逼你問。A2A 把它們變成顯性的設計決定——光這點就值得看懂。

## 參考資料

- [A2A Protocol — 官方網站](https://a2aproject.github.io/A2A/) — Google A2A 規格與範例
- [a2aproject/A2A — GitHub](https://github.com/a2aproject/A2A) — A2A spec 原始碼與 reference implementation
- [Announcing the Agent2Agent Protocol (A2A) — Google Developers Blog](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — 2025 年 A2A 首次公布
- [Linux Foundation welcomes A2A](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project) — 協議捐贈與治理
- [IBM Agent Communication Protocol (ACP)](https://agentcommunicationprotocol.dev/) — IBM 的對應協議
- [Agent Client Protocol — Zed](https://agentclientprotocol.com/) — 容易混淆的同名協議（editor ↔ agent）
- [Model Context Protocol — 官方](https://modelcontextprotocol.io/) — 對照 MCP 的設計邊界
- [Google ADK](https://google.github.io/adk-docs/) — 原生 A2A 支援的 agent 框架
- [CrewAI A2A Integration](https://docs.crewai.com/) — 另一個原生支援 A2A 的框架
- 本站：[MCP 協議介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)、[2026 年 agent 框架清點](/posts/ai/2026-04-01-agent-frameworks-2026)、[MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)
