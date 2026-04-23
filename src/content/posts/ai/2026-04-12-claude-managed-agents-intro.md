---
title: "Claude Managed Agents：把 agent 外殼和沙箱都交給 Anthropic"
date: 2026-04-12
type: guide
category: ai
tags: [claude, managed-agents, anthropic, ai-agent, sandbox, serverless, beta]
lang: zh-TW
tldr: "Claude Managed Agents 是 Anthropic 2026/04/08 推出的 beta 服務，提供 agent harness 加雲端容器沙箱，按 token 加 $0.08/session-hour 計費，適合長時間非同步任務，不想自己寫 agent loop 和跑沙箱的人值得看。"
description: "深入介紹 Claude Managed Agents 的核心概念、跟 Messages API 的差異、四大元件、SDK 使用、工具生態、計費與適用情境。"
draft: false
---

Anthropic 在 2026/04/08 推出 Claude Managed Agents，目前是 beta。用一句話說：以前你只能拿 Messages API 自己刻 agent loop、自己跑 sandbox、自己接工具，現在 Anthropic 直接把整套 harness 和雲端容器都打包好，你只要定義 agent、丟 prompt、收 SSE 事件。這篇整理它的架構、跟 Messages API 的取捨、SDK 用法，以及什麼樣的專案應該考慮切過去。

## 定位：Messages API 之外的第二條路

Anthropic 現在在文件裡明確把兩條路並列：

| | Messages API | Claude Managed Agents |
|---|---|---|
| 本質 | 直接呼叫模型的 API | 預先組好的 agent harness + 基礎設施 |
| 適合 | 自訂 agent loop、要細粒度控制 | 長時間執行、非同步任務 |
| 你要做的事 | 自己寫 loop、工具、沙箱 | 定義 agent 和環境就好 |

核心差異是**誰擁有 agent loop**。Messages API 是「我餵 prompt、你回 token」，要變成 agent 得自己接 tool use、維護 context、跑 sandbox、處理 compaction。Managed Agents 則是 Anthropic 把 loop、prompt caching、compaction、SSE 串流、容器沙箱全包起來，對使用者暴露的單位是 session，不是 message。

## 四個核心概念

整套服務只有四個物件要記：

| 概念 | 說明 |
|------|------|
| **Agent** | 模型、system prompt、tools、MCP servers、skills 的綁定；建立一次、跨 session 複用，有版本號 |
| **Environment** | 容器模板——預裝哪些套件（Python / Node / Go…）、網路規則、掛載檔案 |
| **Session** | 在某個 environment 裡跑某個 agent 的一次執行；有自己的檔案系統和事件歷史 |
| **Events** | app 和 agent 之間來回的訊息——user turn、tool result、status update，走 SSE 串流 |

Agent 跟 Environment 是「模板」，Session 才是真正在跑的實體。這個切分的好處是你可以一個 agent 對應很多 session 平行跑，也可以中途丟新的 user event 進去「steer」agent 轉向，或直接 interrupt。

## 工作流程

官方文件用五步驟說明：

1. 建立 agent：定義 model、system、tools
2. 建立 environment：挑容器模板、設定網路
3. 開 session：指定 agent 和 environment
4. 送 user event、收 SSE：Claude 自動跑 tool、串回結果
5. 中途 steer 或 interrupt：再送 user event 調整方向

值得注意的是 event history 會在伺服器端持久化，可以隨時拉全紀錄——這對非同步任務特別重要，你不用在自己這邊維護 conversation state。

## 最小可跑的 Python 範例

安裝 SDK 之後（`pip install anthropic`），建 agent、環境、session 然後串流事件：

```python
from anthropic import Anthropic

client = Anthropic()

agent = client.beta.agents.create(
    name="Coding Assistant",
    model="claude-sonnet-4-6",
    system="You are a helpful coding assistant.",
    tools=[{"type": "agent_toolset_20260401"}],
)

environment = client.beta.environments.create(
    name="quickstart-env",
    config={"type": "cloud", "networking": {"type": "unrestricted"}},
)

session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Quickstart session",
)

with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(session.id, events=[{
        "type": "user.message",
        "content": [{"type": "text",
                     "text": "生成前 20 個費波那契數，存到 fibonacci.txt"}],
    }])
    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "agent.tool_use":
                print(f"\n[tool: {event.name}]")
            case "session.status_idle":
                break
```

`agent_toolset_20260401` 是一個 tool bundle，一次開通 bash、read、write、edit、glob、grep、web search / fetch 全部工具。比起自己在 Messages API 一個一個註冊 tool schema 省下大量樣板。所有請求需要帶 `managed-agents-2026-04-01` 這個 beta header，官方 SDK 會自動加。

## 內建工具與擴充

Managed Agents 預設就給 agent 接上：

- **Bash** — 在容器裡跑 shell
- **File operations** — read / write / edit / glob / grep
- **Web** — 搜尋、抓網頁
- **MCP servers** — 接外部工具供應商

容器可以裝 Python、Node.js、Go 等語言 runtime，也能走不受限或受限的網路規則。要接自家系統就透過 MCP——等於 Anthropic 把 MCP 當成 Managed Agents 的外掛協定。

## 整體架構

```
你的 app
  ↓  REST / SSE
Anthropic Managed Agents API
  ├─ Agent (模板)
  ├─ Environment (容器模板)
  └─ Session (執行實體)
        ↓
     雲端容器
     ├─ Claude 模型（loop / caching / compaction 由 Anthropic 管）
     ├─ 內建工具（bash / file / web）
     └─ MCP servers（外部工具）
```

你的程式碼只負責送 event 和消費 SSE，loop 和沙箱都在 Anthropic 那邊。

## 計費與限制

- **Token 用量**：照 Claude Platform 標準 token 費率
- **Session 執行時間**：另外加 `$0.08 / session-hour`（只算 active runtime）
- **Rate limit**：建立類 endpoint 60 req/min，讀取類 600 req/min，加上組織層級的 spend limit
- **狀態**：整個服務 beta；`outcomes`、`multi-agent`、`memory` 三項是 research preview，要另外申請

Session-hour 這個計費單位值得注意——長時間跑的 agent 會累積額外費用，要設合理的 budget 和 timeout。

## 什麼時候該用，什麼時候不該

**該用**：

- 任務要跑幾分鐘到幾小時，有很多 tool call 的非同步 workload
- 需要容器沙箱但不想自己養 Kubernetes 或 Firecracker
- 要 stateful session，跨互動保留檔案系統和對話
- 團隊不想自己寫 agent loop、prompt caching、compaction 這些底層

**不該用**：

- 短 latency 的單輪對話——Messages API 更直接、更便宜
- 要完全掌控 agent loop 細節、或 loop 邏輯跟 Anthropic 預設差很多
- 工具要跑在你的內網、資料不能離開私有雲（走 MCP 能部分解，但執行環境還是 Anthropic 的容器）
- 要用非 Anthropic 的模型；Managed Agents 綁 Claude

跟自己架 Claude Agent SDK 的取捨很像雲端資料庫 vs. 自己跑 Postgres——便利性換掉控制權和（潛在的）資料位置。

## 跟周邊產品的關係

容易混淆的幾個名詞：

- **Claude Code** — 裝在你本機 / IDE 的 CLI，是 Anthropic 自己基於 agent 概念做的工具，不是 Managed Agents 的產品
- **Claude Agent SDK** — 給你自己跑 agent loop 的 SDK，還是要自備 infra
- **Claude Managed Agents** — 連 infra 都包好的 SaaS 版

品牌守則也明確要求：整合 Managed Agents 的產品**不可以**叫自己「Claude Code」或做得像 Claude Code 的 ASCII art，要維持自家品牌。可以叫「Claude Agent」或「{你的 agent 名} Powered by Claude」。

## 整體來說

Claude Managed Agents 的核心取捨是**把 agent 的基礎設施當作 SaaS 賣**。對中小團隊、或只是想快速把一個長時間任務做成 agent 產品的場景，它把從 0 到 production 的距離大幅縮短——不用自己研究怎麼做 sandbox、不用自己刻 SSE 協定、不用自己調 prompt caching。代價是綁定 Claude、綁定 Anthropic 的容器基礎設施，以及每 session-hour 多付 $0.08。

Messages API 不會消失，它更像是「底層 primitive」，Managed Agents 則是「高階 runtime」。如果你在寫一個 coding agent、資料分析 agent、或任何要跑幾分鐘以上的自動化任務，現在可以先拿 Managed Agents 做 MVP，真的有瓶頸再下沉到 Messages API 自己寫 loop。

## 參考資料

- [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)
- [Get started with Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/quickstart)
- [Claude Managed Agents: get to production 10x faster（Anthropic blog）](https://claude.com/blog/claude-managed-agents)
- [Build a data analyst agent with Claude Managed Agents（cookbook）](https://platform.claude.com/cookbook/managed-agents-data-analyst-agent)
- [Claude Managed Agents: complete guide to building production AI agents (2026)](https://www.the-ai-corner.com/p/claude-managed-agents-guide-2026)
- [Claude Managed Agents: What It Actually Offers, the Honest Pros and Cons（Medium / unicodeveloper）](https://medium.com/@unicodeveloper/claude-managed-agents-what-it-actually-offers-the-honest-pros-and-cons-and-how-to-run-agents-52369e5cff14)
- [I Built a Claude Managed Agent in 30 Minutes（Substack）](https://aiblewmymind.substack.com/p/claude-managed-agents-explained-demo)
- [What Is Claude Managed Agents? A Developer Guide（Verdent）](https://www.verdent.ai/guides/what-is-claude-managed-agents)
- [You can set up Claude Managed Agents in 5 easy steps（Digit）](https://www.digit.in/features/general/you-can-set-up-claude-managed-agents-in-5-easy-steps-heres-how.html)
