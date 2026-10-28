---
title: "框架更新｜Agno v3.1.11"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno v3.1.11 讓 Claude Code／Codex 這類外部 coding agent 可以直接當 Team 的成員或 Workflow 的一個步驟，另加進階 Session Search 與 Company Task／Routine 的狀態管理 API"
tldr: "Agno v3.1.11 三個重點：(1) 新增 Harness Agents，`ClaudeAgent`／`CodexAgent` 可以直接當 `Team` 的成員或 `Workflow` 裡 `Parallel`／`Loop`／`Condition`／`Router` 的一個步驟，各自用自己的模型、工具與 workspace 跑，session 內自己保留對話；(2) 新增進階 Session Search，`POST /sessions/search` 支援巢狀 AND/OR/NOT 條件過濾 session；(3) Company Task／Routine 補上完整狀態管理 API（Task 可在任意階段建立或編輯、Routine 可取消／封存／還原）。"
series:
  name: "AI Framework Changelog"
  order: 56
---

> 🌏 [English version](/posts/daily/2026-10-29-framework-agno-v3.1.11-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.1.11 |
| 前一版 | v3.1.10 |
| 發布日 | 2026-10-27 |
| Release Notes | [v3.1.11](https://github.com/agno-agi/agno/releases/tag/v3.1.11) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43k |

## 這個版本為什麼重要

多代理團隊一直有個缺口：Team 裡的成員都是用同一套 Agno 原語定義的 Agent，想塞一個 Claude Code 或 Codex 這種有自己完整工具鏈、沙箱、對話狀態的外部 coding agent 進來，只能自己接一層 adapter。這版直接把 `ClaudeAgent`／`CodexAgent` 當成 Harness Agent，變成 Team 的正式成員或 Workflow 裡的一個步驟，連 `Parallel`／`Loop`／`Condition`／`Router` 這些控制流都能用——團隊 leader 一樣用 `delegate_task_to_member` 委派任務，差別只在於這個成員跑的是整套獨立的 coding agent，有自己的 workspace 和沙箱,而且同一個 session 內會自己保留對話歷史。等於把「外部 coding agent」從一個要手動接線的黑盒子,變成多代理編排裡可以直接委派、可以組合的一等公民。

```diagram
title: Agno v3.1.11：Harness Agent 加入 Team
desc: Team leader 一樣用 delegate_task_to_member 委派任務，差別是其中兩個成員是在沙箱裡跑的 Harness Agent
caption: 簡化示意：圖裡只畫委派關係，省略 Workflow 的 Parallel／Loop／Condition／Router 控制流。
---
<svg viewBox="0 0 640 320">
  <rect class="dg-zone" x="220" y="160" width="380" height="120" rx="8"/>
  <text class="dg-tag" x="236" y="182" dominant-baseline="central">SANDBOX</text>

  <path class="dg-line" d="M270 104V138Q270 146 262 146H118Q110 146 110 154V188" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M310 104V188" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 104V138Q350 146 358 146H482Q490 146 490 154V188" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="240" y="40" width="160" height="64" rx="6"/>
  <text class="dg-label" x="320" y="62" text-anchor="middle" dominant-baseline="central">Team Leader</text>
  <text class="dg-sub" x="320" y="82" text-anchor="middle" dominant-baseline="central">團隊負責人</text>

  <rect class="dg-box" x="40" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="110" y="210" text-anchor="middle" dominant-baseline="central">一般成員</text>
  <text class="dg-sub" x="110" y="232" text-anchor="middle" dominant-baseline="central">Agno Agent</text>

  <rect class="dg-box" x="240" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="310" y="210" text-anchor="middle" dominant-baseline="central">ClaudeAgent</text>
  <text class="dg-sub" x="310" y="232" text-anchor="middle" dominant-baseline="central">沙箱 Agent</text>

  <rect class="dg-box" x="420" y="188" width="140" height="64" rx="6"/>
  <text class="dg-label" x="490" y="210" text-anchor="middle" dominant-baseline="central">CodexAgent</text>
  <text class="dg-sub" x="490" y="232" text-anchor="middle" dominant-baseline="central">沙箱 Agent</text>

  <text class="dg-edge" x="320" y="146" text-anchor="start" dominant-baseline="central">委派任務</text>
</svg>
```

## 重要變更

- **Harness Agents 可當 Team 成員或 Workflow 步驟**：`ClaudeAgent`／`CodexAgent` 可以是 `Team` 的成員，也可以是 `Workflow` 裡 `Parallel`／`Loop`／`Condition`／`Router` 的一個步驟；帶 `sandbox=` 的 harness agent 每輪都在自己的容器裡跑，AgentOS 的 team 頁面也會列出 harness 成員 → 不用再自己寫 adapter 把外部 coding agent 接進多代理編排，團隊 leader 用既有的 `delegate_task_to_member` 就能委派
- **進階 Session Search**：新增 `GET /sessions/filter-schema` 與 `POST /sessions/search`，支援巢狀 AND/OR/NOT 條件過濾 session 名稱、session／user／component ID、session 類型與建立／更新時間，和既有 Traces API 的篩選邏輯一致；PostgreSQL／SQLite 在分頁計數前先套用條件，其他 adapter 走批次 fallback，同步與非同步 client 方法都有 → 大量 session 的部署可以直接用結構化條件查，不必自己撈全部 session 再在應用層過濾
- **Company Task 全階段狀態管理**：`POST /company/tasks` 可以直接帶 `status`，Task 能建立在 Backlog、Ready 或 Cancelled；任意階段間都能互轉，Done／Cancelled 的 Task 能重開，標題與簡述在任何階段都能編輯；但 In Progress 仍只能由一次 run 啟動，該 run 還在執行或暫停時不能把 Task 移出 In Progress → Task 生命週期管理更完整，同時保留「執行中不能被繞過」這個安全邊界
- **Company Routine 補齊操作 API**：新增 `POST /company/routines/{id}/cancel`、`/archive`、`/restore` 與僅限 admin 的 `DELETE /company/routines/{id}`；`GET /company/routines` 支援 `sort_by`／`sort_order`；對已暫停的 on-demand Routine 做 pause／resume 會回 409，排程執行不再更動 `updated_at` → Routine 的生命週期管理終於跟 Task 看齊

## Breaking Changes

本版本無 breaking changes。多項修復調整了既有行為的邊界情況：

- `ReaderFactory.create_reader()` 改成每次回傳依呼叫參數設定的全新 reader，不再回傳快取的單例，`chunk_size` 等覆寫參數會確實生效，不會跨 `Knowledge` 實例互相汙染
- `StepOutput.to_dict()` 保留 int／float／bool／str 原本的型別，不再把 `0` 或 `False` 這類值字串化成 `"0"`／`"False"`，避免 HITL resume 或 session 重新載入後資料變形

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade agno==3.1.11
```

```python
# 把 Claude Code 或 Codex 接進 Team，當成一般成員委派任務
from agno.agent import ClaudeAgent, CodexAgent
from agno.team import Team

team = Team(members=[
    ClaudeAgent(sandbox=my_sandbox),
    CodexAgent(sandbox=my_sandbox),
    # 其他一般 Agno Agent 成員
])
```

## 與其他框架的對比觀察

同一天（2026-10-27）Pydantic AI 在 v2.63.0 新增 `IPythonCodeMode`，走的是在框架自己的執行層裡多一套 code execution 環境；Agno 這版則是反過來，把 Claude Code／Codex 這類已經成熟的外部 coding agent 整個吸收進 Team／Workflow 編排層,讓它們以「正式成員」的身分參與委派。兩個框架同期都在處理「agent 框架和外部 coding agent 的邊界要畫在哪」,只是一個選擇自己做執行環境,一個選擇把外部工具鏈直接編排進來。

## 今日收穫

之前以為「把 Claude Code 接進多代理 Team」只能靠工具呼叫（讓某個 Agent 的 tool 去 shell out 呼叫 Claude Code CLI）,看到 Agno 把它做成 Harness Agent 直接當 Team 成員、能被 leader 委派、能用 `Parallel`／`Loop` 這些控制流組合才意識到:外部 coding agent 和框架內建 Agent 的差異,其實可以只是「這個成員執行時用的是另一套完整的 agent runtime」,編排層的委派邏輯完全不需要知道差異在哪裡。

## 參考資料

- [Agno v3.1.11 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.11)
- [agno-agi/agno GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.10...v3.1.11](https://github.com/agno-agi/agno/compare/v3.1.10...v3.1.11)
- [Pydantic AI v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
