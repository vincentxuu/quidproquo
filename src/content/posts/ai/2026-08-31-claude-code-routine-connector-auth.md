---
title: "Claude Code Routine 的 Connector 一直跳授權：created_via 欄位的隱藏差異"
date: 2026-08-31
category: ai
type: debug
tags: [claude-code, mcp, routine, connector, debugging]
lang: zh-TW
tldr: "Claude 自己建的 Routine（created_via: meta_mcp）每次呼叫第三方 connector 都跳授權提示，使用者建的（created_via: http_api）不會。解法：用 RemoteTrigger API 重建 routine。"
description: "調查 Claude Code Routine 呼叫 groundlane MCP connector 時反覆跳授權的根因，發現 created_via 欄位決定 connector 信任等級。"
draft: false
glossary:
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "讓 AI 模型透過標準協定連接外部工具與資料來源的開放協定。"
  - term: "Routine"
    definition: "Claude Code 的排程雲端 agent，可設定 cron 定時執行或一次性觸發。"
  - term: "Connector"
    definition: "claude.ai 上連接的 MCP server，分為 Anthropic 官方託管與使用者自架兩種。"
---

> 🌏 [English version](/en/posts/ai/2026-08-31-claude-code-routine-connector-auth-en)

## TL;DR

Claude Code Routine 有一個未公開的 `created_via` 欄位，決定 connector 呼叫時的權限行為。`meta_mcp`（Claude 透過 MCP 工具建的）每次都跳授權提示，`http_api`（使用者或 API 建的）不會。用 [RemoteTrigger API](https://docs.anthropic.com/en/docs/claude-code/routines) 重建 routine 即可修復。

## 情境

我有十幾個 Claude Code Routine 在跑每日排程任務。其中一個「每日台股風控儀表板」需要呼叫自架的 [groundlane](https://groundlane.vincent-xu-work.workers.dev/mcp) MCP server 去打 FinMind API 抓台股資料。這個 routine 是在某個 Claude Code session 裡讓 Claude 幫我建的。

其他 routine（例如 `daily-digest-signals`）也大量使用同一個 groundlane connector，每天凌晨跑 75 次以上的 `web_fetch`，從來不跳授權。

## 問題

台股 routine 每次呼叫 groundlane 的 `web_fetch` 都會出現這個提示：

```
Allow Claude to use Web fetch (groundlane)?
This connector call requires your approval to proceed.
```

Scheduled run 如果碰到這個提示但沒人按，就會以 `stop_reason=tool_use` 失敗。Manual run 則需要手動按 "Allow once" 才能繼續。

Connector 設定頁面上 groundlane 的所有工具已經設為 "Always allow"，沒用。

## 嘗試過程

### 排除假說一：first-party vs third-party connector

最初以為問題是 groundlane 是自架的 MCP server（沒有 `claude_ai` 前綴），跟 Anthropic 官方託管的 Exa、Tavily 等有不同的信任等級。

**反證**：`daily-digest-signals` routine 也用同一個 groundlane，甚至 SKILL.md 裡明寫「不要改用 Exa/Tavily/其他」，但它從來不跳授權。

### 排除假說二：新 routine 需要第一次授權

以為新建的 routine 需要跑過一次授權才行。

**反證**：台股 routine 的第一個 Scheduled run 看起來「成功」了，但查 run log 發現它根本沒掛到 repo（`No sources configured`，`/home/user` 是空目錄），壓根沒碰到 groundlane 就結束了。那個「成功」是假的。

### 找到真正的差異

用 [RemoteTrigger API](https://docs.anthropic.com/en/docs/claude-code/routines) 的 `list` 和 `get` action 拉出兩個 routine 的完整 JSON，逐欄位比對：

| 欄位 | daily-digest-signals（正常） | 台股風控（卡授權） |
|---|---|---|
| `created_via` | `http_api` | `meta_mcp` |
| `created_kind` | `ROUTINE_CREATED_KIND_UNSPECIFIED` | `routine` |
| `creator.display_name` | `Vincent` | （空） |
| groundlane connector config | 完全相同 | 完全相同 |
| `permitted_tools` | `[]` | `[]` |
| `tool_policy_overrides` | `[]` | `[]` |

兩個 routine 掛的 groundlane connector 設定一模一樣（同一個 `connector_uuid`、同一個 URL、同樣的空 `permitted_tools`）。唯一的結構性差異就是 `created_via`。

## 解法

用 RemoteTrigger API 的 `create` action 建一個設定完全相同的新 routine：

```bash
# 在 Claude Code session 裡用 RemoteTrigger tool
RemoteTrigger({
  action: "create",
  body: {
    name: "每日台股風控儀表板 + 方向判讀（v3 skill-based）",
    cron_expression: "30 10 * * 1-5",  // weekdays 6:30 PM GMT+8
    enabled: true,
    job_config: {
      ccr: {
        environment_id: "env_...",
        session_context: {
          model: "claude-sonnet-5",
          sources: [{ git_repository: { url: "https://github.com/..." } }],
          allowed_tools: ["preset:default", "Bash", "Read", ...]
        },
        events: [{ data: { uuid: "...", type: "user",
          message: { content: "你的 prompt", role: "user" }
        }}]
      }
    },
    mcp_connections: [
      { connector_uuid: "...", name: "groundlane", url: "https://..." },
      // ... 其他 connector
    ]
  }
})
```

新 routine 回傳的 JSON 確認 `created_via: "http_api"`。

手動觸發新 routine，groundlane `web_fetch` 直接拿到結果，**沒有任何授權提示**：

```
[12:14:29] tool_use mcp__groundlane__web_fetch → FinMind TAIEX
[12:14:31] tool_result: {"ok":true, ...}  ← 直接成功
[12:14:34] tool_use mcp__groundlane__web_fetch → TAIEX 歷史資料
[12:14:36] tool_result: {"ok":true, ...}  ← 又成功
```

最後去 https://claude.ai/code/routines 手動刪掉舊的 routine。

## 為什麼會這樣

`created_via` 欄位記錄 routine 的建立途徑：

- **`http_api`**：透過 Claude Code 的 HTTP API 建立（包括 web UI 手動建立、RemoteTrigger tool、`/schedule` skill）。系統視為「使用者明確授權」，connector 呼叫不需要額外確認。
- **`meta_mcp`**：Claude 在 session 裡透過 MCP 工具自己建的。系統視為「AI 代建，使用者未明確審批 connector 權限」，每次 connector 呼叫都跳確認。

這個欄位是建立時寫入的，不可變。用 `update` API 更新 routine 的其他設定不會改變 `created_via`。唯一的修復方式是重建。

## 學到的事

Claude Code Routine 的 connector 權限不只取決於 connector 本身的設定（Always allow / Ask / Deny），還取決於 routine 是誰建的。讓 Claude 在 session 裡「幫你建 routine」跟你自己建，在權限模型上是兩件事。

## 參考資料

- [Claude Code Routines 官方文件](https://docs.anthropic.com/en/docs/claude-code/routines)
- [Model Context Protocol 規格](https://modelcontextprotocol.io/)
- [FinMind 台股 API](https://finmindtrade.com/)
