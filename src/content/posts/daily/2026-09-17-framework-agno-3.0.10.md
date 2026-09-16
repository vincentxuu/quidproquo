---
title: "框架更新｜Agno v3.0.10"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.0.10 在 CodingTools 與 PublicSurface MCP 兩處收緊預設安全邊界，run_shell 從預設可用改成顯式 opt-in，對外 MCP 預設只接受 localhost"
tldr: "Agno v3.0.10 三個重點：(1) `CodingTools` 的 `run_shell` 從預設可用改成必須 `enable_run_shell=True` 才能用，且 restricted 模式底層不再經過 shell 直接執行指令，堵掉透過 shell 元字元做 interpreter RCE 的路；(2) `PublicSurface(authorization=True, mcp=True)` 對外開的 MCP endpoint 預設只接受 localhost，要讓非本機的呼叫端進來得在 `MCPConfig(allowed_hosts=[...])` 顯式加白名單；(3) 新增 `AzureOpenAIResponses` model、Elasticsearch 向量資料庫、把 Mintlify／Fumadocs 文件轉純 Markdown 的 `DocumentationMarkdown` transform。"
series:
  name: "AI Framework Changelog"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | `v3.0.10` |
| 前一版 | `v3.0.9` |
| 發布日 | 2026-09-16 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.10) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42k |

## 這個版本為什麼重要

Agno 把程式碼執行工具（`CodingTools`）和公開 MCP endpoint（`PublicSurface`）都做成內建、開箱即用的元件，這正是它比 LangGraph、CrewAI 更「電池已附」的地方，但也代表框架本身要對預設安全邊界負更多責任。3.0.10 是一次典型的「收緊預設值」版本：`run_shell` 從「裝了就能用」改成「要顯式打開」，restricted 模式進一步不經過 shell 直接執行指令，堵住透過 `;`、`|`、`&&` 這類 shell 元字元做指令注入的路；對外開放的 MCP endpoint 也從「任何 host 都能打進來」改成「預設只認 localhost」。對已經在生產環境跑 Agno agent 的團隊來說，這版升級後某些原本能用的功能會直接失效——但失效的理由是它們本來就不該在沒有明確授權下可用。

## 重要變更

- **`CodingTools.run_shell` 預設關閉**：新增 `enable_run_shell` 參數，不顯式設成 `True` 就不能跑 shell 指令 → 依賴預設能執行 `git`／`curl` 之類 shell 指令的 agent workflow，升級後會直接失效，必須回頭顯式打開
- **restricted 模式不再經過 shell**：restricted 執行模式現在直接呼叫程式而不透過 shell 解譯 → 即使打開了 `run_shell`，也多一層防護擋掉利用 shell 元字元組合的指令注入攻擊
- **PublicSurface MCP 預設只接受 localhost**：`PublicSurface(authorization=True, mcp=True)` 不再對任意 host 開放 → 要讓非本機的呼叫端連進 MCP，得在 `MCPConfig(allowed_hosts=[...])` 顯式把網域加進白名單，否則遠端請求會被直接拒絕
- **`AzureOpenAIResponses` model**：新增走 Azure OpenAI Responses API 的 model 類別 → Azure 部署可以直接用 Responses API 而不用繞道 Chat Completions 相容層
- **Elasticsearch 向量資料庫**：新增支援 vector／keyword／hybrid 三種搜尋模式的 `Elasticsearch` vector db → 已經在用 Elasticsearch 做全文搜尋的團隊可以直接把它當 agent 的知識庫後端，不用另外接一套向量資料庫
- **`DocumentationMarkdown` transform**：`Knowledge.sync_pages` 新增這個 transform，把 Mintlify、Fumadocs 產生的文件元件轉成純 Markdown → 把第三方文件站整站吃進 knowledge base 時不用自己寫清洗邏輯
- **`MCPConfig` 新增 `root_host`／`path`／`path_aliases`**：MCP 可以掛在自訂 hostname 或自訂 endpoint path 上，`/mcp/server-card` 回傳的 JSON 也改成 pretty-printed → 多租戶或多產品線共用一個部署時，MCP 路由可以照自己的命名規則走，不用被綁死在 `/mcp`

## Breaking Changes

- `CodingTools()` 預設可執行 shell → `CodingTools(enable_run_shell=True)` 才能執行 shell 指令
  - 影響範圍：任何依賴 `CodingTools` 預設能跑 shell 指令的 agent workflow
- `PublicSurface(authorization=True, mcp=True)` 預設只接受 localhost → 需在 `MCPConfig(allowed_hosts=[...])` 顯式加入允許的網域
  - 影響範圍：把 MCP endpoint 對外開放給非 localhost 客戶端呼叫的部署
- `RemoteAgent.role` / `RemoteTeam.role` 從方法改成 property → 呼叫端要拿掉 `()`，改用 `.role`
  - 影響範圍：直接呼叫 `.role()` 的程式碼；雖然官方把這項歸在 Bug Fixes，但屬於會讓既有程式碼直接拋錯的 API signature 變動，一併視為 breaking change 處理

## 遷移指南

### 從 3.0.9 升級到 3.0.10

```bash
pip install --upgrade agno==3.0.10
```

```python
# 舊寫法（3.0.9 及之前）—— 預設可以跑 shell
tools = CodingTools()

# 新寫法（3.0.10）—— 顯式打開 shell
tools = CodingTools(enable_run_shell=True)
```

```python
# 舊寫法 —— MCP 對外預設接受任何 host
surface = PublicSurface(authorization=True, mcp=True)

# 新寫法 —— 需顯式加白名單才能給非 localhost 呼叫
surface = PublicSurface(
    authorization=True,
    mcp=MCPConfig(allowed_hosts=["your-domain.com"]),
)
```

```python
# 舊寫法
name = remote_agent.role()

# 新寫法
name = remote_agent.role
```

## 與其他框架的對比觀察

這次的核心變更不是新功能，是把「程式碼執行」與「對外開放 MCP」這兩個高風險能力的預設值收緊。這跟本站先前追蹤過的多起 agent 資安事件（AI agent 橫掃租戶憑證、OpenAI agents RubyGems RCE）方向一致：問題往往不是攻擊手法多先進，而是框架把危險能力的預設值設得太寬鬆。LangGraph、CrewAI 目前的更新重心仍放在 agent 原語與角色編排上，沒有類似「把內建工具的預設權限往下收」的動作——這正是因為它們沒有像 Agno 這樣把 shell 執行做成隨插即用的內建元件，安全責任更多落在開發者自己接的工具實作上。

## 今日收穫

之前以為 framework 的 breaking change 多半是為了加新功能或優化語法，看到 Agno 把 `run_shell` 的預設值從「可以」改成「不行」才意識到：當一個 agent 框架把程式碼執行工具做成內建、開箱即用的元件，安全預設值本身就是一種功能責任——多數開發者不會主動去收緊權限，框架把預設值定嚴一點，比事後靠文件提醒有效得多。

## 參考資料

- [Agno v3.0.10 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.10)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.6 — 上一篇框架更新](/posts/daily/2026-09-05-framework-agno-3.0.6)
- [PR #10210：harden CodingTools run_shell against interpreter RCE](https://github.com/agno-agi/agno/pull/10210)
- [PR #10220：run CodingTools restricted shell without a shell](https://github.com/agno-agi/agno/pull/10220)
- [PR #10083：detect public MCP access alongside JWT REST auth](https://github.com/agno-agi/agno/pull/10083)
- [PR #10090：configure MCP hostname and endpoint routing](https://github.com/agno-agi/agno/pull/10090)
