---
title: "框架更新｜AG2 v1.3.0"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: zh-TW
description: "AG2 v1.3.0 讓祖先代理能觀測整棵委派樹的事件、用 ScopedValue 明確定義變數跨委派邊界怎麼傳遞，同時棄用四組舊 API 並把 Python 門檻提高到 3.11"
tldr: "AG2 v1.3.0 三個重點：(1) `@observer(ChildEvent)` 讓祖先代理收到整棵委派樹的事件（含串流 chunk），但不會進入祖先自己的模型對話記錄；(2) `ScopedValue` 用 COPIED／LOCAL／SHARED 三種範圍明確定義變數怎麼跨委派邊界傳遞；(3) Breaking：`TaskConfig`、`Agent(assembly=...)`、`Agent(knowledge=...)`、`Agent.task()` 四組 API 棄用、1.4 移除，且最低 Python 版本提高到 3.11。"
series:
  name: "AI Framework Changelog"
  order: 63
---

> 🌏 [English version](/posts/daily/2026-11-07-framework-ag2-v1.3.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | AG2（前身為 AutoGen） |
| 版本 | v1.3.0 |
| 前一版 | v1.2.2 |
| 發布日 | 2026-11-04 |
| Release Notes | [v1.3.0](https://github.com/ag2ai/ag2/releases/tag/v1.3.0) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.0k |

## 這個版本為什麼重要

多代理協作一旦有委派（delegation），馬上會碰到兩個麻煩：子代理在做什麼，父代理看不到；子代理改了某個變數，父代理和其他兄弟節點該不該跟著變。過去 AG2 把這兩件事交給開發者自己想辦法——想看進度就自己加 callback 印 log，想共享狀態就自己傳參考、自己注意會不會被悄悄覆蓋。1.3 把這兩個問題都變成一級 API：`@observer` 讓事件從任何深度的子節點直接浮上來，但不會混進父代理自己的推理上下文；`ScopedValue` 讓「這個變數要不要跨節點共享」變成宣告式設定,不用再靠口頭約定。同時這版也動了刀——四組舊 API 列入棄用，Python 最低版本拉到 3.11，算是把過去幾版陸續鋪的方向收攏成一次明確的里程碑。

## 重要變更

- **跨委派樹事件觀測**：`@observer(ChildEvent)` 讓祖先代理收到所有後代（包含串流中的 `ModelMessageChunk`）發出的事件，且不會進入祖先自己的模型對話記錄，也不會觸發祖先的工具或模型迴圈 → 可以做統一的進度監控、UI 即時回報，不會污染上層代理的推理上下文
- **事件可定向回送**：被觀測事件帶有 `event.origin`，可以用 `await event.origin.send(...)` 把訊息送回原本觸發事件的那個委派節點，走它自己原本的處理流程 → 父代理能主動介入某個子節點，而不只是被動旁聽
- **顯式變數範圍（`ScopedValue`）**：新增 `Scope.COPIED`（每個分支各自深拷貝，一般值的預設行為）、`Scope.LOCAL`（不往下代的子節點繼承）、`Scope.SHARED`（整棵委派樹共用同一個綁定）三種範圍 → 多代理共用狀態時,哪些要共享、哪些該隔離,一開始宣告就講清楚,不必事後除錯才發現誤用共用參考
- **後代用量即時回報**：原始 `UsageEvent` 會即時傳到祖先，保留來源身份、階段、模型與 provider，不再產生委派彙總 → 計費或用量監控可以逐筆歸因到實際發起呼叫的節點,而不是看一個模糊的加總數字
- **執行前動態上下文（`statusbar_middleware`）**：在每次模型呼叫前插入目前狀態（進度、剩餘步驟、環境狀態等），支援依賴注入，`persist=True` 可以把這些快照留存為服務觀察記錄 → 不用把進度資訊硬塞進 prompt 範本
- **共享任務生命週期**：model run、委派、獨立的 `Task` 區塊現在共用同一組生命週期轉換，透過 `capability` 或 `ttl_seconds` 開啟生命週期事件；`ttl_seconds` 只是給外部觀察者的到期時限，不是本地執行逾時 → 監控外部系統可以用統一的方式追蹤不同類型工作的狀態轉換
- **知識改成 plugin（`KnowledgePlugin`）**：把 store、知識工具、bootstrap、事件記錄打包成一個 plugin,取代原本散落在 `Agent(knowledge=...)` 的設定方式

```diagram
title: 事件觀測管道跟模型對話記錄是分開的兩條路
desc: Worker 串流輸出的 chunk 包成 ChildEvent 送到 observer 回呼並就地處理，不會往右轉送進模型對話記錄；Worker 完成委派後回傳的工具結果才會送進模型對話記錄，兩條路徑在中間的 observer 完全不相交；observer 另外可以用 event.origin.send() 把訊息定向送回 Worker。
step: Worker 串流輸出 chunk，包成 ChildEvent 送到 observer 回呼
step: observer 回呼就地處理事件，印出進度
step: Worker 完成委派，回傳的工具結果直接送進模型對話記錄
step: observer 用 event.origin.send() 把訊息定向送回 Worker
---
<svg viewBox="0 0 640 360">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="336"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="336"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="336"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">ChildEvent</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M324 160H352Q360 160 360 168V176Q360 184 352 184H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="372" y="172" dominant-baseline="central">印出進度</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 232H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="220" text-anchor="middle" dominant-baseline="central">回傳工具結果</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 296H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-mono" x="208" y="284" text-anchor="middle" dominant-baseline="central">origin.send()</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="96" rx="2" data-step="1 2"/>

  <rect class="dg-box" x="16" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Worker（子代理）</text>
  <rect class="dg-box dg-box--accent" x="244" y="24" width="152" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">observer 回呼</text>
  <rect class="dg-box" x="476" y="24" width="136" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">模型對話記錄</text>
</svg>
```

## Breaking Changes

- `TaskConfig`、`Agent(tasks=...)`、`Agent.tasks`，以及自動注入的 `run_subtask` / `run_subtasks` 工具 → 改成明確建構 worker、透過 `Agent.as_tool()` 委派：
  - 影響範圍：用 `tasks=` 參數自動產生子任務委派的專案，1.4 移除前需改寫
- `Agent(assembly=...)` → 改成透過 `middleware=` 註冊 `AssemblerMiddleware`，搭配 `AlertPolicy` 時要再加 `HaltCheckMiddleware`：
  - 影響範圍：用 assembly 參數組裝多代理流程的專案
- `Agent(knowledge=...)` → 改成 `plugins=[KnowledgePlugin(...)]`：
  - 影響範圍：直接在 Agent 建構子傳 knowledge 設定的專案
- `Agent.task()` → 改成直接建構 `Task(owner_id=..., spec=TaskSpec(...))`：
  - 影響範圍：呼叫 `Agent.task()` 建立獨立任務的程式碼
- `OpenAIConfig` 將在 1.4 變成 `OpenAIResponsesConfig` 的別名，官方建議現在就改用 `OpenAIResponsesConfig` 或 `OpenAICompletionsConfig` 明確指定：
  - 影響範圍：還在用 `OpenAIConfig` 這個名稱的專案，1.4 後語義會跟著別名切換而改變
- **最低 Python 版本提高到 3.11**：
  - 影響範圍：還在 Python 3.10 環境的專案，必須先升級 Python 才能裝 AG2 1.3

## 遷移指南

### 從 1.2.2 升級到 1.3.0

```bash
pip install --upgrade ag2==1.3.0
```

```python
# 舊寫法：用 Agent(tasks=...) 自動注入 run_subtask / run_subtasks
agent = Agent(
    "coordinator",
    config=config,
    tasks=[TaskConfig(worker_agent)],
)

# 新寫法：明確建構 worker，透過 as_tool() 委派
worker = Agent("worker", config=config, prompt="...")
coordinator = Agent(
    "coordinator",
    config=config,
    tools=[worker.as_tool(description="委派給 worker 處理")],
)

# 舊寫法：Agent(knowledge=...)
agent = Agent("assistant", config=config, knowledge=KnowledgeConfig(...))

# 新寫法：plugins=[KnowledgePlugin(...)]
from ag2.knowledge import KnowledgePlugin, MemoryKnowledgeStore

agent = Agent(
    "assistant",
    config=config,
    plugins=[KnowledgePlugin(store=MemoryKnowledgeStore())],
)
```

升級前先確認執行環境是 Python 3.11 以上；沒有用到 `tasks=`、`assembly=`、`knowledge=`、`Agent.task()` 四個棄用入口的專案，照常升級即可,棄用警告不影響既有行為。

## 與其他框架的對比觀察

CrewAI 的 role-based 委派和 LangGraph 的 graph-level state 都沒有把「子節點事件怎麼浮上來」和「變數跨節點怎麼傳」做成明確的一級 API——通常是開發者自己接 callback 或自己管傳參考。AG2 這版把這兩件事都規格化：事件走 observer 管道、不混進父代理推理上下文；狀態走 `ScopedValue` 宣告、不靠隱性複製。這讓 AG2 在「委派樹內部可觀測性」這塊補得比同類框架更完整，但它仍是單一行程內的委派模型，跟 Temporal、Inngest 這類跨行程、可持久化的工作流引擎比,解決的是不同層次的問題。

## 今日收穫

之前以為多代理框架的「觀測」就是在委派點加個 callback 印 log,有需要就自己把訊息轉傳給上層。看到 AG2 這版把 `ChildEvent` 明確定義成「不進父代理模型對話記錄、不觸發父代理工具迴圈」才意識到，觀測和參與對話必須是兩條分開的管線——如果子代理的進度更新被當成一般訊息塞進父代理的上下文，父代理很可能把進度通知誤判成需要回應的新指令，反而讓推理鏈多繞一圈。

## 參考資料

- [AG2 v1.3.0 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.3.0)
- [ag2ai/ag2 GitHub](https://github.com/ag2ai/ag2)
- [Full Changelog: v1.2.2...v1.3.0](https://github.com/ag2ai/ag2/compare/v1.2.2...v1.3.0)
- [AG2 Documentation: Observe a Delegation Tree](https://docs.ag2.ai/docs/user-guide/advanced/stream/#observe-a-delegation-tree)
- [AG2 Documentation: Variable Scopes Across Subagents](https://docs.ag2.ai/docs/user-guide/context/variables/#variable-scopes-across-subagents)
- [AG2 Documentation: Migrating from TaskConfig](https://docs.ag2.ai/docs/user-guide/subagents/#migrating-from-taskconfig)
