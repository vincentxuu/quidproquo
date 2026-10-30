---
title: "框架更新｜Agno v3.1.12"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno v3.1.12 讓 Claude Code／Codex 這類 Harness Agent 自己發出的權限請求，可以直接接進 AgentOS 的既有 Approval UI，暫停成一筆可恢復的 PAUSED run"
tldr: "Agno v3.1.12 重點：Native Approvals for Harness Agents——`ClaudeAgent`／`CodexAgent` 自己的權限請求（Claude 的 `permission_mode`、Codex 的 `approval_policy`）現在會直接變成 AgentOS 裡一筆 PAUSED run，出現在既有的 Chat 與 Approvals 畫面，Resolve＋Continue Run 能把決定送回同一個原生執行，不重放 prompt；沙箱環境（Docker／AgentCore）也保有這個能力。另外新增 `Routine(enabled=False)`（可以先停用再讓使用者開啟的公司流程）與圖表上的 headline 數字。"
series:
  name: "AI Framework Changelog"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-30-framework-agno-v3.1.12-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.1.12 |
| 前一版 | v3.1.11 |
| 發布日 | 2026-10-29 |
| Release Notes | [v3.1.12](https://github.com/agno-agi/agno/releases/tag/v3.1.12) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43k |

## 這個版本為什麼重要

上一版（v3.1.11，10/27）剛把 `ClaudeAgent`／`CodexAgent` 這類 Harness Agent 接成 Team 成員與 Workflow 步驟，這版接著補上一個很實際的缺口：Claude Code 和 Codex 本來就有自己的權限機制（Claude 的 `permission_mode` 與權限 callback、Codex 的 `approval_policy`），但這些請求之前只活在 harness 自己的世界裡,AgentOS 完全看不到、也管不到。這版直接把這兩套權限機制接進 AgentOS 既有的 Approval UI——harness 發出的權限請求會變成一筆持久化的 `PAUSED` run,出現在使用者已經在用的 Chat 和 Approvals 畫面裡,人工 Resolve 之後用 Continue Run 把決定送回同一個原生執行,不用重新跑一次 prompt。連 Docker／AgentCore 這種沙箱環境都保留了這個能力,包含 capability negotiation、決策 RPC、持久化、worker 斷線後重新接上。值得注意的是行為改變：`CodexAgent` 沒設定時現在預設走 `on-request` 政策,原本「請求發出去但沒人處理」的狀況,現在會變成暫停等待,由 `hitl_timeout`（預設 900 秒）設上限。

```diagram
title: Agno v3.1.12：Harness Agent 的權限請求接進 Approval UI
desc: ClaudeAgent／CodexAgent 自己發出的權限請求，被 AgentOS 存成一筆 PAUSED run；人工 Resolve 後用 Continue Run 送回同一個原生執行，不重放 prompt。
caption: 簡化示意：沙箱環境下的 capability negotiation 與斷線重接細節省略。
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 96V136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 204V240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 300V340" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="120" y="40" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">ClaudeAgent／CodexAgent</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">發出自己的權限請求</text>

  <rect class="dg-box dg-box--accent" x="120" y="140" width="400" height="64" rx="6"/>
  <text class="dg-label" x="320" y="160" text-anchor="middle" dominant-baseline="central">Run 暫停</text>
  <text class="dg-sub" x="320" y="180" text-anchor="middle" dominant-baseline="central">狀態 PAUSED，持久化存進資料庫</text>

  <rect class="dg-box" x="120" y="244" width="400" height="56" rx="6"/>
  <text class="dg-label" x="320" y="264" text-anchor="middle" dominant-baseline="central">AgentOS Approval UI</text>
  <text class="dg-sub" x="320" y="284" text-anchor="middle" dominant-baseline="central">出現在既有 Chat／Approvals 畫面</text>

  <rect class="dg-box" x="120" y="344" width="400" height="64" rx="6"/>
  <text class="dg-label" x="320" y="364" text-anchor="middle" dominant-baseline="central">Resolve ＋ Continue Run</text>
  <text class="dg-sub" x="320" y="384" text-anchor="middle" dominant-baseline="central">回到同一個原生執行，不重放 prompt</text>
</svg>
```

## 重要變更

- **Native Approvals for Harness Agents**：Claude／Codex 自己的權限請求直接接進 AgentOS 的 Approval UI，持久化成 `PAUSED` run，Resolve＋Continue Run 把決定送回同一個原生執行；決策會對照請求的確切動作做驗證，支援同步／非同步續行、取消、逾時與儲存失敗處理，沙箱環境（Docker／AgentCore）保留 capability negotiation、決策 RPC、worker 斷線後重接 → 人工審核權限請求不用再切去 harness 自己的介面，統一在 AgentOS 裡處理；但也要注意行為改變：沒設定 approval 的 `CodexAgent` 現在預設 `on-request`，原本沒人接手的請求會變成暫停等待（`hitl_timeout` 預設 900 秒）
- **Initially Disabled Company Routines**：`Routine(enabled=False)` 讓範本可以先出一個停用狀態的 Routine，讓使用者之後自己從 UI 打開；停用的 Routine 仍會被原子化建立、連結到所屬 Product、在列表裡可見,只是排程器會跳過它,重啟後使用者的選擇仍保留 → 範本可以先把流程鋪好,不強迫使用者一安裝就全部跑起來
- **Headline Numbers on Charts**：`ChartTools.create_chart()` 可以帶一個預先格式化的 `value`（像 `"$22.3K"` 或 `"94%"`），顯示在圖表標題旁邊；文件提醒模型只在真的有單一數字能概括全圖時才填,平均值或比率不應該被加總 → 圖表加一個總覽數字不用另外畫

## Breaking Changes

本版本無 breaking changes，但有一項值得注意的行為改變：

- 沒有設定 approval 選項的 `CodexAgent`，現在會自動套用原生 `on-request` 政策，原本「請求發出去但沒人處理就卡住」的狀況改成明確暫停等待（`hitl_timeout` 預設 900 秒）
- 影響範圍：現有程式碼裡建立 `CodexAgent` 時沒傳 approval 相關設定、原本依賴「請求無人處理時就直接繼續」行為的流程

## 遷移指南

直接升級即可，無需修改程式碼；要用到新的審批功能才需要額外設定：

```bash
pip install --upgrade agno==3.1.12
```

```python
from agno.agent import ClaudeAgent
from agno.os import AgentOS

# ClaudeAgent 的權限請求會自動接進 AgentOS 的 Approval UI
# 只要這個 agent 有資料庫（包含 AgentOS 提供的那個）
claude_agent = ClaudeAgent(permission_mode="default")
agent_os = AgentOS(agents=[claude_agent])

# 人工在 Approvals 畫面 Resolve 之後，用 Continue Run 送回同一個原生執行
# 參考 cookbook/frameworks/human_in_the_loop/
```

## 與其他框架的對比觀察

同一週（10/27–10/29）Mastra 在 `@mastra/core@1.80.0` 加了 per-resource 的 OAuth 連線隔離,處理的是「這個連線代表哪個使用者」;Agno 這版處理的是「這一次工具呼叫要不要執行」的同意機制。兩者都是把原本散落在應用層、甚至散落在 harness 自己介面裡的授權邏輯,收進框架本身統一管理——這也延續了上一版（v3.1.11）把 Harness Agent 當成一等公民的方向：先讓外部 coding agent 能被編排進團隊,這版再讓它們的權限機制能被框架本身的審核介面看見。

## 今日收穫

之前以為 Claude Code／Codex 的權限詢問只能在它們自己的 CLI 或介面裡處理,看到 Agno 把這個請求直接變成一筆 AgentOS 資料庫裡的 `PAUSED` run,才意識到：只要一個狀態能被持久化、能被另一個系統讀到並寫回決定,「審核」這件事就不一定要發生在請求產生的那個介面裡——它可以被搬到任何能連上同一個資料庫的審核畫面。

## 參考資料

- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
- [agno-agi/agno GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.11...v3.1.12](https://github.com/agno-agi/agno/compare/v3.1.11...v3.1.12)
- [Agno v3.1.11 深入介紹（Harness Agents）](/posts/daily/2026-10-29-framework-agno-v3.1.11)
- [Mastra @mastra/core v1.80.0 深入介紹](/posts/daily/2026-10-30-framework-mastra-core-v1.80.0)
