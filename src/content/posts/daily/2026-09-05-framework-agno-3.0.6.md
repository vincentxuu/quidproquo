---
title: "框架更新｜Agno 3.0.6"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.0.6 讓 MCP server 可以跑成無狀態、多副本互相接手的形態，並跟進 MCP 2026-07-28 規格的 sessionless 協商"
tldr: "Agno 3.0.6 三個重點：(1) `MCPConfig(stateless=True)` 讓 `/mcp` endpoint 不追蹤 session，任何副本都能回答任何請求，多實例部署不再需要 session affinity（代價是失去 server-initiated 通知與 SSE resumability）；(2) `MCPTools(protocol_mode=\"auto\")` 讓 client 自動協商雙方都支援的最新 MCP 協定版本（含 2026-07-28 規格的 sessionless），預設仍是 `\"legacy\"` 不影響既有行為；(3) 新增 AgentOS MCP Server Card（`GET /mcp/server-card`）、`.zip`／`.eml` 檔案上傳、`AuthorizationConfig.excluded_route_paths`，並修正 Anthropic thinking blocks 重播、Gemini 圖片 MIME type 等多個 bug。本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 15
---

> 🌏 [English version](/en/posts/daily/2026-09-05-framework-agno-3.0.6-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.0.6 |
| 前一版 | v3.0.5 |
| 發布日 | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.6) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.0k |

## 這個版本為什麼重要

[上一篇（3.0.5）](/posts/daily/2026-09-02-framework-agno-3.0.5)修的是 Knowledge ingestion 的資料完整性契約，這次 3.0.6 回頭處理 MCP serving 本身的部署模型。過去 MCP server（包含 Agno 自己 serve 出來的 AgentOS MCP endpoint）預設都是 session-based：client 建立連線後，session 狀態綁在某個特定 process 上，多副本部署要嘛靠 session affinity 讓同一個 client 一路打到同一台機器，要嘛自己想辦法做 session 共享。3.0.6 加入 `MCPConfig(stateless=True)`，讓 `/mcp` 完全不追蹤 session，任何一個副本都可以回答任何請求——這代表水平擴展 MCP server 終於可以像無狀態 HTTP API 一樣直接丟給 load balancer，不用特別處理黏性路由。同一版也讓 `MCPTools` 學會協商 MCP 協定的版本（`protocol_mode="auto"`），跟進今年稍早發佈的 2026-07-28 規格裡新增的 sessionless 協商能力，把 client 端和 server 端的無狀態化銜接起來。

## 重要變更

- **Stateless MCP Serving**：`MCPConfig(stateless=True)` 讓 `/mcp` endpoint 不追蹤 session，任何副本都能回答任何請求，多實例部署不需要 session affinity → 代價是失去 server-initiated 通知與 SSE resumability，因此預設關閉，需要水平擴展的部署可以自行評估後開啟
- **`MCPTools(protocol_mode=...)` 協定版本協商**：預設 `"legacy"` 維持既有的 session-based 行為不變；設成 `"auto"` 會協商雙方都支援的最新協定版本（sessionless 能力來自 MCP `2026-07-28` 規格）→ 現有的 server 不受影響，仍然能接受舊版 handshake；MCP client 內部改建構在 `fastmcp.Client` 之上
- **AgentOS MCP Server Card**：新增 `GET /mcp/server-card`，列出目前 serve 出去的工具清單，並可設定 name／version／instructions → 方便 client 端自我介紹式地探索一個 AgentOS 實例提供了什麼
- **`.zip`／`.eml` 檔案上傳**：AgentOS 現在支援上傳並解包這兩種檔案格式
- **`AuthorizationConfig.excluded_route_paths`**：可以把特定自訂路由標記為公開，不用整組關掉 auth
- **Bedrock 自訂 async client**：model 或 embedder 可以直接帶入自己建立的 async client
- **多個穩定性修正**：Anthropic 現在會逐字重播先前的 assistant turn，thinking blocks 不會再被拒絕；Gemini 改成正確解析圖片 MIME type 而不是寫死 `image/jpeg`；`RecursiveChunking` 不再產生重複的尾端 chunk；AG-UI 傳給 remote entity 的欄位改用 wire fields 而非整個 `RunContext`，並會把串流過程中的錯誤往外曝露

## Breaking Changes

本版本無 breaking changes。`stateless=True` 與 `protocol_mode="auto"` 都是選用（opt-in）設定，預設值維持原本的 session-based 行為。

直接升級即可，無需修改程式碼。

## 遷移指南

```bash
pip install --upgrade agno==3.0.6
```

要讓 AgentOS 的 MCP endpoint 支援多副本部署，開啟 stateless serving：

```python
from agno.os.mcp import MCPConfig

mcp_config = MCPConfig(stateless=True)
# 之後可以直接把 /mcp 丟給 load balancer，不需要 session affinity
# 代價：不支援 server-initiated 通知與 SSE resumability
```

要讓 MCP client 自動協商到最新協定版本：

```python
from agno.tools.mcp import MCPTools

mcp_tools = MCPTools(
    url="https://example.com/mcp",
    protocol_mode="auto",  # 預設是 "legacy"
)
```

## 與其他框架的對比觀察

MCP 規格今年稍早（2026-07-28）才把 sessionless 協商正式定案，Agno 3.0.6 幾乎是第一時間跟進實作到 client／server 兩端，反映出 Agno 一直把「快速吃下 MCP 生態的最新能力」當成核心賣點之一——這跟它在 Agentic Index 排名第一、主打多模型靈活的定位一致。相較之下，LangGraph 和 CrewAI 目前對 MCP 協定版本協商的支援還沒有到這麼細的粒度，這次更新讓 Agno 在「MCP-native 部署到生產環境」這條路上暫時領先一步。

## 今日收穫

之前以為 MCP server 天生就需要 session affinity 才能水平擴展，看到 Agno 直接在協定層面加上 `stateless=True` 才意識到，session-based 設計其實只是 MCP 早期實作選擇的預設值，不是協定的必然限制——只要願意放棄 server-initiated 通知這類需要長連線狀態的功能，MCP server 完全可以做成跟一般無狀態 REST API 一樣好水平擴展的形態。評估一個 Agent 框架的 MCP 支援，除了看它接了多少工具，也該看它有沒有把「部署到多副本環境」這件事納入協定層的設計。

## 參考資料

- [Agno v3.0.6 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.6)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.5 — GitHub Release（前一版）](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [MCP 2026-07-28 — Specification Release](https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28)
- [Agno 3.0.5 — 上一篇框架更新](/posts/daily/2026-09-02-framework-agno-3.0.5)
