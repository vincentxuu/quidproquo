---
title: "框架更新｜Agno v3.1.0"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.1 把 RBAC 授權與檔案系統收進 AgentOS 核心，同時把 MCP 的內建工具從預設公開改成顯式 opt-in，並要求既有 filesystem 資料表手動遷移"
tldr: "Agno v3.1.0 三個重點：(1) 新增 `agno.os.authz` 套件，AgentOS 內建角色儲存、scope policy、審計日誌與使用者目錄，提供原生與 `fga` 兩種可插拔授權引擎；(2) 新增 `agno.fs`／`DbFileSystem`，AgentOS 多一組 `/filesystem` 路由管理檔案，但既有 `agno_fs` 資料表需停機跑遷移腳本，否則直接噴 `SchemaOutdatedError`；(3) Breaking：`MCPConfig` 的內建預設工具與生命週期工具（`continue_run`／`cancel_run`）從『自動附贈』改成要顯式打開。"
series:
  name: "AI Framework Changelog"
  order: 30
---

> 🌏 [English version](/en/posts/daily/2026-10-02-framework-agno-3.1.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | `v3.1.0` |
| 前一版 | `v3.0.10` |
| 發布日 | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.5k |

## 這個版本為什麼重要

Agno 的賣點一直是「電池已附」：程式碼執行、公開 MCP endpoint、現在又加上使用者管理和檔案系統，全部做成 AgentOS 內建、開箱即用的元件。3.1 補的是多租戶部署真正會卡住的那塊——誰可以呼叫哪個 agent、誰能讀寫哪些檔案。新的 `agno.os.authz` 套件把角色儲存、scope policy、審計日誌直接收進框架，不用再自己拼一層授權中介層；`agno.fs` 則讓 agent 有了原生的檔案管理介面，不必另外接 S3 或自架檔案服務。但這版也延續上一版（3.0.10）收緊預設值的路線：MCP 的內建工具不再「設定了就自動全部附贈」，而是要你明確列出想要哪些；既有的 filesystem 資料表更是直接被新版拒絕讀寫，逼你先手動跑遷移腳本，而不是悄悄用錯的 schema 繼續跑。

## 重要變更

- **使用者管理／RBAC（`agno.os.authz`）**：新套件提供角色儲存、scope policy、審計日誌、使用者目錄和一支 admin router，並支援原生引擎與細粒度的 `fga` 引擎兩種可插拔授權後端 → AgentOS 多租戶部署終於有框架原生的授權層，不用自己接 Auth0 或手刻 RBAC 中介層
- **AgentOS Filesystem（`agno.fs`／`DbFileSystem`）**：新增 `DbFileSystem`，搭配專屬的 `/filesystem` 路由做檔案列表／讀取／管理，資料存在 `agno_fs` 資料表 → agent 需要讀寫檔案時，不必再另外接 S3 或自架檔案服務，直接用 AgentOS 內建的資料庫後端
- **MCP 設定／授權更新**：重新整理 MCP server 設定與內建 MCP 授權處理邏輯
- **`AIMLAPITools`**：新增透過 AI/ML API 做圖片、影片、語音與轉錄的工具包 → 多一條不綁單一供應商的多模態工具路徑

## Breaking Changes

- Filesystem 資料表重新分鍵（`agno_fs`）：
  - v3.1 把資料表的鍵從舊結構改成 `(namespace, user_id, path)`，`user_id` 為共用／無使用者分區時填 `""`
  - 用舊版建立的資料表會被直接拒絕讀寫，拋出 `SchemaOutdatedError`，重新分鍵**不會**自動執行
  - 影響範圍：只影響實際用到 `DbFileSystem` 的部署；升級前必須停機，依資料庫類型跑對應的遷移腳本（這張表是 `DbFileSystem` 自己管的 schema，刻意不納入 `MigrationManager`）
- `MCPConfig` 的內建預設工具與生命週期工具改成 opt-in：
  - 舊版：只要設定 `tools=[...]`，框架也會自動附贈內建的 `default_tools` 和生命週期工具（`continue_run`／`cancel_run`）
  - 新版：`default_tools` 和 `lifecycle_tools` 預設都是 `False`，`tools=[...]` 現在只公開你明確列出的工具
  - 影響範圍：依賴舊版「設定 tools 就自動拿到內建工具」行為的 MCP 部署，升級後這些工具會直接消失

## 遷移指南

### 從 3.0.x 升級到 3.1.0

```bash
pip install --upgrade agno==3.1.0
```

```bash
# 只有用到 DbFileSystem 的部署需要這步：停機後，依資料庫類型二選一執行
python libs/agno/migrations/migrate_filesystem_postgres.py   # PostgreSQL
python libs/agno/migrations/migrate_filesystem_sqlite.py     # SQLite
```

```python
# 舊寫法（3.0.x）—— 設定 tools 會自動附贈內建預設工具與生命週期工具
mcp_config = MCPConfig(tools=["my_custom_tool"])

# 新寫法（3.1.0）—— 要保留舊行為，需顯式打開
mcp_config = MCPConfig(
    tools=["my_custom_tool"],
    default_tools=True,
    lifecycle_tools=True,
)
```

其餘變更（HITL 續跑重複寫入歷史、`OpenAIResponses` 鏈結遺失、CSV／Shell 工具的零值處理等）都是 bug fix，一般升級不需要額外調整程式碼。

## 與其他框架的對比觀察

Agno 把 RBAC 和檔案系統都做成框架原生元件，進一步拉開和 LangGraph、CrewAI 的差距——後兩者的授權與儲存多半仍交給開發者自己接外部服務。但這份「電池已附」的代價也很明顯：這次又是先補安全與權限邊界（MCP 工具 opt-in、filesystem 強制遷移），而不是單純疊新功能，跟 3.0.10 版收緊 `run_shell` 預設值是同一條路線。同一天發布的 Haystack 3.3 則是另一種取向——沒有新增授權層，而是在既有 pipeline 元件上修安全性（`anyio` CVE）和效能瓶頸，反映兩個框架對「生產就緒」的不同切入點：Agno 補的是平台層的治理能力，Haystack 補的是既有元件的正確性與效能。

## 今日收穫

之前以為 schema migration 失敗大多會「悄悄用錯的結構繼續跑」，看到 Agno 新版對舊版 filesystem 資料表直接拋 `SchemaOutdatedError` 拒絕讀寫，才意識到「拒絕啟動」其實是更安全的設計——比起用錯的鍵結構默默腐化資料，寧可讓應用程式直接噴錯，逼著維運者照遷移腳本走一次，而不是留著一個看起來能動、但資料其實已經錯位的系統。

## 參考資料

- [Agno v3.1.0 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.0)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.10 — 上一篇框架更新](/posts/daily/2026-09-17-framework-agno-3.0.10)
- [PR #10530：feat v3.1（RBAC authz、filesystem、filesystem 資料表遷移）](https://github.com/agno-agi/agno/pull/10530)
- [PR #10499：MCPConfig 預設與生命週期工具改為 opt-in](https://github.com/agno-agi/agno/pull/10499)
