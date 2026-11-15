---
title: "框架更新｜Agno v3.2.0"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno v3.2.0 把 A2A 協定升到官方 1.0、改掉 Slack 核准權限的預設行為，並讓 Super Agent 自己動手執行任務而不只是路由請求"
tldr: "Agno v3.2.0 三個 breaking changes 要先看：OS Manager 的 tool_call_limit 與 num_history_runs 預設值變了、A2A 協定正式升到官方 1.0（移除 /v1/message 與 /v1/tasks 舊路由）、Slack 核准預設收斂成只有本人能按。新功能重點是 Super Agent 改成自己動手做事，不再只是路由給 manager members。"
series:
  name: "AI Framework Changelog"
  order: 65
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.2.0 |
| 前一版 | v3.1.12 |
| 發布日 | 2026-11-12 |
| Release Notes | [v3.2.0](https://github.com/agno-agi/agno/releases/tag/v3.2.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43.2k |

## 這個版本為什麼重要

這版同時動了三個會直接讓既有程式碼或流程壞掉的地方，而不是加一個可以選擇不用的新功能。最大的一塊是 A2A（agent-to-agent）協定從草案／RC 正式升級到官方 `a2a-sdk` 1.x，`/v1/message:*` 與 `/v1/tasks:*` 這兩組路由直接被移除，AgentOS 跟 `A2AClient` 必須一起升級才能繼續講同一種語言。另一塊是 Slack 介面整個換成官方 Slack Bolt SDK，連帶改了核准的預設語意：以前任何人都能在 Slack 上點 Approve／Deny，這版預設收斂成只有啟動這次 run 的人能按，除非被明確列進 `approvers=`。這種「API 名稱沒變、預設行為變了」的改動比呼叫介面改掉更容易被忽略——程式碼照樣能跑，直到有人真的在 Slack 按下核准才發現自己沒有權限。功能面最值得注意的是 Super Agent 不再只是把請求路由給 manager members，而是直接動手執行；再加上 A2A 任務正式進資料庫、支援訂閱與恢復，Agno 把「agent 之間怎麼互通」這件事明顯當成這一版的主線。

```diagram
title: Agno v3.2.0：三項 Breaking Changes 的新舊對照
desc: OS Manager 預設值、A2A 協定版本、Slack 核准權限，三處行為一次性改變，升級前要逐一確認是否命中。
caption: 簡化示意：每項的完整影響範圍與相容層細節見下方「Breaking Changes」。
---
<svg viewBox="0 0 640 400">
  <rect class="dg-box" x="20" y="20" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="42" text-anchor="middle" dominant-baseline="central">OS Manager 預設值（舊）</text>
  <text class="dg-sub" x="145" y="66" text-anchor="middle" dominant-baseline="central">tool_call_limit=8／num_history_runs=7</text>

  <path class="dg-line" d="M270 56H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="20" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="42" text-anchor="middle" dominant-baseline="central">OS Manager 預設值（新）</text>
  <text class="dg-sub" x="495" y="66" text-anchor="middle" dominant-baseline="central">tool_call_limit=24／num_history_runs=5</text>

  <rect class="dg-box" x="20" y="160" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="182" text-anchor="middle" dominant-baseline="central">A2A 協定（舊）</text>
  <text class="dg-sub" x="145" y="206" text-anchor="middle" dominant-baseline="central">/v1/message:*／/v1/tasks:* 路由</text>

  <path class="dg-line" d="M270 196H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="160" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="182" text-anchor="middle" dominant-baseline="central">A2A 協定（新，v1.0）</text>
  <text class="dg-sub" x="495" y="206" text-anchor="middle" dominant-baseline="central">官方 a2a-sdk 1.x，各自的 A2A endpoint</text>

  <rect class="dg-box" x="20" y="300" width="250" height="72" rx="6"/>
  <text class="dg-label" x="145" y="322" text-anchor="middle" dominant-baseline="central">Slack 核准權限（舊）</text>
  <text class="dg-sub" x="145" y="346" text-anchor="middle" dominant-baseline="central">任何人都能 Approve／Deny</text>

  <path class="dg-line" d="M270 336H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="370" y="300" width="250" height="72" rx="6"/>
  <text class="dg-label" x="495" y="322" text-anchor="middle" dominant-baseline="central">Slack 核准權限（新）</text>
  <text class="dg-sub" x="495" y="346" text-anchor="middle" dominant-baseline="central">預設只有本人，除非列入 approvers</text>
</svg>
```

## 重要變更

- **Super Agent 自己動手做事**：以前 Super Agent 只負責把請求路由給 manager members，這版改成直接列出／執行 agents、teams、workflows，並讀取平台活動與排程；Platform Builder 變成它唯一的 member → 不用再多包一層 manager member，Super Agent 就能直接完成任務
- **A2A 任務儲存與完整生命週期**：A2A 任務存進資料庫，支援 send／stream／get／cancel／list／subscribe；外部 agent 可以被服務，HITL 跟外部工具可以暫停繼續，Agent Card 同時廣播 v1.0 跟 v0.3 介面 → A2A 不再是一次性的請求/回應，而是可以查詢、訂閱、恢復的任務
- **Company OS 的 Mini Agent for Routines**：Routine 現在跑在限定、非對話的 Mini Agent 上，只有 Company 工具跟打包好的 Routine skills，看不到平台或一般執行工具，也不出現在 agent discovery／MCP／A2A 裡；Task 多了 `last_run`、API 算好的 `allowed_transitions`，可以直接 start，記錄持久化的嘗試狀態，Super Agent 能把已核准的 Task 丟進 durable queue 而不卡住對話 → Routine 的執行環境被隔離，Task 的狀態機變得可查詢、可操作
- **AgentOS homepage metrics**：新增 component／aggregate／refresh 三層表，支援每天 session／run／token／user／model／cost／duration／首字延遲（TTFT）／模型延遲的 `/os/metrics/*` API；背景刷新、只重算有變動的天，也能彙總多個本地或遠端資料庫 → 原本要自己兜 SQL 算的平台指標，現在框架內建
- **外部 agent 元件可被儲存管理**：`ClaudeAgent`／`CodexAgent` 可以透過 components API 存、讀、版本化、列出、執行；sandbox 跟 output-schema 參照透過 registry 解析，設定不支援或無法序列化時會直接報錯，不會被默默丟掉 → Harness agent 的設定變成跟一般 agent 一樣可管理的元件

## Breaking Changes

- `OSManager.tool_call_limit` 預設值 `8` → `24`，`OSManager.num_history_runs` 預設值 `7` → `5`；另外 `OSManager(root=...)` 搭配名為 `read_file`、`list_files`、`search_content` 的自訂工具時，AgentOS 會直接拒絕啟動
  - 影響範圍：沒有自己明確設定這兩個參數、依賴框架預設值的部署；用到 `OSManager(root=...)` 且工具名稱剛好撞名的專案
- AgentOS 與 `A2AClient` 改跑官方 `a2a-sdk` 1.x：`/v1/message:*` 與 `/v1/tasks:*` 路由被移除，改用每個 entity 自己的 A2A endpoint；stream 事件與回應 artifact 格式跟著 v1.0 規格變；`a2a` extra 現在要求 `a2a-sdk[http-server]>=1.2.2,<2`
  - 影響範圍：直接呼叫被移除路由的客戶端、直接 `import` 被移除 A2A helper 的程式碼；標準 v0.3 client 經相容層預設仍可動，但應規劃改接 v1.0
- Slack 介面改跑 Slack Bolt：只有啟動 run 的人能 Approve／Deny，除非被列進 `approvers=` 或透過 `users=` 對應到同一個 principal；`slack` extra 現在要求 `slack_bolt>=1.29.0,<2` 與 `slack_sdk>=3.43.0,<4`；用 `AgentOS(authorization=...)` 搭配 Slack 卻沒傳 `users=` 時會拒絕啟動；直接 `import` 被移除的內部 Slack helper（`SlackEventHandler`、`HITLHandler`、`verify_slack_signature`）需要改寫
  - 影響範圍：依賴「團隊內任何人都能幫忙核准」的既有 Slack 審批流程；沿用舊版 `slack_bolt`／`slack_sdk` 版本區間的專案

## 遷移指南

### 從 3.1.x 升級到 3.2.0

```bash
pip install --upgrade "agno[a2a,slack]==3.2.0"
```

```python
# 舊寫法（3.1.x）：依賴預設的 tool_call_limit=8／num_history_runs=7
# 若流程預期舊預設值，升級後要明確指定
from agno.os import OSManager

os_manager = OSManager(
    tool_call_limit=8,      # 新預設已變成 24，不想變行為就自己寫死
    num_history_runs=7,     # 新預設已變成 5，同理
)

# A2A：確認相依版本鎖在 1.x，並停止直接呼叫 /v1/message:* 或 /v1/tasks:*
# pip install "a2a-sdk[http-server]>=1.2.2,<2"

# Slack：補上 approvers 或 users，否則核准權限會收斂到只剩本人
from agno.os.interfaces.slack import Slack

slack = Slack(
    team=agent_os.manager,
    approvers=["U012ABCDEF"],      # 明確列出誰能代為核准
    users={"U012ABCDEF": "alice"}, # 或把 Slack 使用者對應到同一個 principal
)
```

## 與其他框架的對比觀察

同一週（11/10）[AG2 v1.3.1](https://github.com/ag2ai/ag2/releases/tag/v.1.3.1) 也把自家的 A2UI 協定從 release candidate 送進官方 1.0 穩定版；Agno 這版則是把 Google 那套 A2A 協定從 draft/RC 升到官方 1.0。兩個框架幾乎同時把各自押注的跨 agent 互通協定送進穩定版，顯示「agent 之間怎麼講話」在 2026 下半年已經變成框架競爭的新戰場，不再只是「單個 agent 怎麼寫」。

## 今日收穫

之前以為 breaking change 只會發生在呼叫介面本身——函式改名、參數順序變了這類一看程式碼就能抓到的改動。這次才注意到 Agno 把 Slack 核准權限的「預設語意」也列成 breaking change：從「任何人都能按核准」收斂成「預設只有本人，要列名才能代按」，API 名稱完全沒變，程式碼照樣能編譯、能跑，直到真的有人在 Slack 點了 Approve 才發現自己被擋下來。這種藏在預設值背後的行為改動，比介面改掉更容易被忽略。

## 參考資料

- [Agno v3.2.0 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [agno-agi/agno GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.1.12...v3.2.0](https://github.com/agno-agi/agno/compare/v3.1.12...v3.2.0)
- [AG2 v1.3.1 Release Notes（A2UI v1.0）](https://github.com/ag2ai/ag2/releases/tag/v.1.3.1)
- [Agno v3.1.12 深入介紹（Native Approvals for Harness Agents）](/posts/daily/2026-10-30-framework-agno-v3.1.12)
