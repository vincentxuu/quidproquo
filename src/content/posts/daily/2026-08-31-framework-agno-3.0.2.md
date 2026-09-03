---
title: "框架更新｜Agno 3.0.2"
date: 2026-08-31
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.0.2 讓 Agent、Team、Workflow 和 Toolkit 都能直接發佈成具名 MCP tool，同時悄悄翻轉了 metadata 解析優先序，是一次表面看是 patch、實際上動了行為契約的版本"
tldr: "Agno 3.0.2 三個重點：(1) Agent／Team／Workflow／Toolkit 現在都能用 MCPConfig.tools 或 component.as_tool() 直接發佈成獨立命名的 MCP tool，不用再包一層 run_agent(agent_id=...)；(2) 三項不換版本號但真的會咬人的行為變更：metadata 解析優先序反轉（call-site 現在贏過 component）、MCPConfig 對未知欄位直接拋錯、BaseRemote.acancel_run 多了必填的 auth_token 參數；(3) 新增 Synthorai model provider、WaveSpeed 圖片/影片生成、Serply 搜尋、AtomicMail 收件匣四個整合，MCP 相關命名也統一為 mcp= / MCPConfig / default_tools（舊名保留到 3.1 才移除）。"
series:
  name: "AI Framework Changelog"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-08-31-framework-agno-3.0.2-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.0.2 |
| 前一版 | v3.0.1 |
| 發布日 | 2026-08-30 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.2) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 41.9k |

## 這個版本為什麼重要

版本號只跳了一個 patch（3.0.0 → 3.0.2），但這次改的是 Agno 和 MCP 生態系互動的方向。過去 Agno 的 MCP 支援基本上是單向的：Agent 去連 MCP server、拉外部工具進來用。3.0.2 把這件事反過來——Agent、Team、Workflow，甚至一整個 Toolkit，現在都能自己變成一個具名的 MCP tool，發佈出去讓別的 MCP client（包含另一個 Agno 部署,或 Claude 這類支援 MCP 的助理）直接呼叫。過去要做到類似效果得手刻一個 `run_agent(agent_id="chief")` 這種通用入口，現在用 `MCPConfig(tools=[researcher_agent])` 或 `component.as_tool(name="research")` 就能把內部組件變成外部看得懂、叫得動的獨立工具。與此同時，release note 裡藏了幾個不影響版本號但確實會改變既有程式行為的調整，尤其是 metadata 優先序反轉——這種「沒改函式簽名、但回傳值變了」的修改最容易在升級後悄悄產生資料不一致，值得升級前先讀過一遍。

## 重要變更

- **Agents/Teams/Workflows 發佈為 MCP tool**：`MCPConfig.tools` 現在接受 `Agent`、`Team`、`Workflow` 實例、remote proxy 或 component factory，每個都會被發佈成獨立命名的 MCP tool（例如 `chief`），而不是統一走 `run_agent(agent_id="chief")` → `component.as_tool(name=..., description=...)` 可以自訂發佈時的名稱與描述；`continue_run`／`cancel_run` 也會跟著曝露的組件一起註冊，讓卡在確認步驟的 run 可以透過 MCP 繼續執行
- **Toolkit 逐方法發佈為 MCP tool**：`MCPConfig.tools` 現在也接受一整個 `Toolkit`，會把它註冊的每個方法各自發佈成一個 MCP tool（之前傳 Toolkit 會直接 `TypeError`），並套用該 toolkit 自己的 `enable_*`／`include_tools`／`exclude_tools` 篩選 → 框架專屬參數（`RunContext`、`Agent`、`Team`、`_agno_*` channel）會從對外 schema 中隱藏，由伺服器端補上，`ToolResult` 也會依內容型別轉成對應的 MCP content block（文字、圖片、音訊、影片/檔案走 embedded resource、URL-only 走 resource_link）
- **MCP tool 的 title 與行為標註**：`as_tool()` 和 `@tool`/`Function` 新增 `title` 與 `annotations` 參數，AgentOS 會把這些資訊透過 MCP 曝露給外部 client，內建的八個工具也會標上對應標註；曝露的組件預設會斷言 `readOnlyHint: False`、`destructiveHint: True`、`openWorldHint: True`，可依需要覆寫，但未知的標註鍵會直接拋錯而不是被忽略
- **Context provider 新增 `query_timeout` 與 `write_tools`**：每個 context provider 現在都能設定逐次呼叫的 timeout（超時回傳錯誤 chunk，而不是卡住整個 run），需要 Python 3.11 以上；五個可寫入的 provider 也能用 `write_tools` 換掉預設的寫入子代理工具集
- **四個新整合**：Synthorai model provider（走 OpenAI 相容端點）、WaveSpeed 圖片/影片生成工具、Serply 搜尋工具（Google Web／News／Scholar）、AtomicMail toolkit（讓 Agent 擁有自己的信箱，走 proof-of-work 註冊、無需網域或人工驗證）

## Breaking Changes

- **Run metadata 解析優先序反轉**：`metadata` 現在依「component → session → call-site」解析，call-site（傳給 `run()` 的 `metadata=`）會贏過 `agent.metadata`，和過去 component 值優先的行為相反；一次 run 執行後也不會再把 session metadata 寫回共用的 component 上，代表原本靠「跑完後讀 `agent.metadata` 觀察 session 值」的程式碼，現在只會看到建構子時的原始值
  - 影響範圍：所有依賴 metadata 優先序或跑後讀回 `agent.metadata` 的程式碼；注意這個 session 層邏輯只在 dispatch 會預先讀取 session 的路徑生效，`Team.arun` 和非同步 DB 的 agent/workflow 路徑仍只看 component 與 call-site
- **`MCPConfig` 拒絕未知欄位**：`MCPConfig`／`MCPServerConfig` 建構時傳入無法識別的關鍵字參數會直接拋錯，不再默默忽略
  - 影響範圍：拼錯參數名稱（例如誤植 `tool=` 而非 `tools=`）的設定，過去會在啟動階段悄悄提供錯誤的工具介面，現在會在啟動時直接爆炸
- **`BaseRemote.acancel_run` 多了必填參數**：抽象方法新增 `auth_token` 參數，取消入口會以關鍵字傳入
  - 影響範圍：任何自行實作 `BaseRemote` 子類別的第三方程式碼，需要更新方法簽名才能相容
- **MCP 相關命名統一（舊名保留到 3.1）**：`AgentOS(mcp=...)`、`MCPConfig`、`default_tools` 是 `mcp_server=`、`MCPServerConfig`、`enable_builtin_tools` 的新寫法；舊名目前仍可用（別名），但預計在 3.1 移除，同時傳新舊兩種寫法且值不同會直接拋錯
- **推理模型偵測改為詢問 provider**：原生 reasoning 偵測現在會先問 provider 本身，問不到才 fallback 到用 model id 比對；這代表設定成 thinking 的 Gemini 或 Claude 模型，若 provider 回報不支援 thinking，會被重新分類為非 reasoning 模型；id fallback 規則也一併調整（例如 `gpt-5` 系列在 OpenAI/Azure 上比對、Groq/Ollama 改比對 `gpt-oss` 與 `qwen3`）

## 遷移指南

### 從 3.0.0/3.0.1 升級到 3.0.2

```bash
pip install --upgrade agno==3.0.2
```

MCP 相關命名建議直接改用新寫法（舊名還能用，但 3.1 就會移除）：

```python
# 舊寫法（3.0.1 及之前，仍可用但已棄用）
os = AgentOS(
    mcp_server=MCPServerConfig(
        enable_builtin_tools=True,
        tools=[my_toolkit],
    ),
)

# 新寫法（3.0.2）
os = AgentOS(
    mcp=MCPConfig(
        default_tools=True,
        tools=[my_toolkit, research_agent, review_team],
    ),
)
```

把既有 Agent／Team 發佈成具名 MCP tool：

```python
research_specialist = researcher.as_tool(
    name="research",
    description="Research a question on the web and report the findings",
)

os = AgentOS(mcp=MCPConfig(tools=[research_specialist]))
```

若專案有自訂 `BaseRemote` 子類別，需要補上新的 `auth_token` 參數：

```python
# 舊寫法
async def acancel_run(self, run_id: str) -> None: ...

# 新寫法（3.0.2）
async def acancel_run(self, run_id: str, auth_token: str | None = None) -> None: ...
```

若程式碼曾在 run 執行完後讀取 `agent.metadata` 來觀察 session 層寫入的值，這個模式在 3.0.2 之後不再成立，需要改成直接從 run 結果或 session 物件讀取。

## 與其他框架的對比觀察

同一週被追蹤的框架裡，AG2 v1.0.3 也把整條 MCP 客戶端全面遷移到 MCP 2.0 協定，走的是「協定版本」升級；Agno 3.0.2 做的是另一個維度——不改協定版本，而是把「框架內部的組件（Agent/Team/Workflow/Toolkit）能不能對外變成 MCP tool」這件事補齊。兩者放在一起看，是同一個大方向的兩種切法：MCP 正在從「Agent 怎麼消費外部工具」的協定，長成「Agent 自己怎麼被別人當工具消費」的雙向介面，框架這層的工作也從「接 MCP client」變成「同時也要做 MCP server」。

## 今日收穫

原本以為 MCP 整合對框架來說是單向的功能——讓 Agent 多一種辦法接外部工具。看完 Agno 這次「把 Agent/Team/Toolkit 逐一發佈成具名 MCP tool」的做法才意識到，MCP 其實更接近一種「介面協定」而不是「工具接入協定」：一旦框架把自己的組件也包成 MCP tool，你的 Agent 系統本身就變成別人（另一個 Agent、另一套工具鏈）可以消費的服務。這代表以後評估一個 Agent 框架的 MCP 支援夠不夠完整，除了看它能接多少外部 MCP server，也該看它能不能把自己的東西發佈出去。

## 參考資料

- [Agno v3.0.2 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.2)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.1 — GitHub Release（前一版）](https://github.com/agno-agi/agno/releases/tag/v3.0.1)
- [AG2 v1.0.3 — GitHub Release（同期 MCP 2.0 遷移，對比用）](https://github.com/ag2ai/ag2/releases/tag/v1.0.3)
