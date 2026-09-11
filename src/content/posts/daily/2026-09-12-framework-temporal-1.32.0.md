---
title: "框架更新｜Temporal v1.32.0"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, framework, daily, temporal]
lang: zh-TW
description: "Temporal v1.32.0 把 Standalone Activities 推到 GA，同時在 Nexus 回呼路由、統一查詢轉換器上帶來多項 breaking changes"
tldr: "Temporal v1.32.0 三個重點：(1) Standalone Activities 正式 GA，新增延遲啟動、operator API（暫停/恢復/重置）與批次操作；(2) Nexus 回呼改為預設依 URL scheme 路由，移除舊的 header-based 設定，屬安全性驅動的 breaking change；(3) 統一查詢轉換器（Unified Query Converter）成為預設值，對 Visibility 查詢的型別比對與空字串過濾轉嚴。"
series:
  name: "AI Framework Changelog"
  order: 19
---

> 🌏 [English version](/en/posts/daily/2026-09-12-framework-temporal-1.32.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Temporal |
| 版本 | v1.32.0 |
| 前一版 | v1.31.1 |
| 發布日 | 2026-09-11 |
| Release Notes | [GitHub Release](https://github.com/temporalio/temporal/releases/tag/v1.32.0) |
| GitHub | [temporalio/temporal](https://github.com/temporalio/temporal) |
| Stars | 22.9k |

## 這個版本為什麼重要

Temporal 在 Agent 圈子裡的角色一直很尷尬：它不是 Agent 框架，卻是不少長時序 Agent 任務背後真正撐住可靠性的執行引擎。v1.32 最大的訊號是 Standalone Activities 正式 GA——這是一種不綁定在完整 Workflow 生命週期裡、可以獨立暫停、恢復、取消的 Activity 執行單元，對「一次 Agent 任務只是呼叫幾個工具，不需要整套 Workflow 編排開銷」的場景是更貼近需求的抽象層級。同一版也把 Nexus 跨服務回呼的路由方式改成預設依 URL scheme 走，這是一項安全性驅動的變更：修正了舊版在特定設定下，外部回呼可能被誤判成內部請求執行的風險。對正在自架 Temporal cluster 支撐 Agent 長時序任務的團隊來說，這版需要認真讀過 breaking changes 才能升級。

## 重要變更

- **Standalone Activities GA**：`activity.enableStandalone` 與 `activity.startDelayEnabled` 預設開啟，新增延遲啟動、operator API（暫停/恢復 Activity、重置 attempt 狀態並可選擇清除 heartbeat）與批次操作（依 visibility 查詢或明確指定執行清單，批次取消/終止/刪除）→ 過去 Activity 只能依附在 Workflow 底下管理，現在可以當成獨立的可維運單元，更貼近「一次 Agent 工具呼叫」的粒度
- **Proactive Activity Cancellation**：透過 Nexus-based worker commands channel，Server 不再需要靠 heartbeat 才能取消 worker 上的 Activity，Workflow 關閉（terminate/timeout/cancel/continue-as-new）時會直接對所有進行中的 Activity 送出取消指令 → 減少 Agent 長時間卡在已經該結束的工具呼叫上
- **CountWorkers API**：新增依查詢條件計算 worker 數量的 RPC，不用抓完整明細 → 監控大規模 worker fleet 時省掉大量資料傳輸
- **一次性 Versioning Override**：可以讓單一 Workflow 路由到指定的 Worker Deployment Version 而不建立永久 Pinned override，Workflow Task 成功完成後自動清除；Child Workflow 也能獨立於 parent 指定 Pinned/Auto-Upgrade/一次性路由
- **Poller Autoscaling 可觀測性**：新增 `poller_scale_decision` 計數器追蹤每次擴縮決策，並支援伺服器端依 namespace 自動開啟 poller autoscaling（`frontend.pollerAutoscalingAutoEnroll`）
- **Task Queue Dynamic Partitioning（實驗性）**：依任務新增速率與 backlog 動態調整讀寫分區數，目前沒有預設策略，需要 operator 逐一驗證再套用
- **Workflow Task Completion Pagination（預發布）**：允許單一 `RespondWorkflowTaskCompleted` 拆成多個請求分頁送出，讓超過請求大小限制的 Workflow Task 仍能完成，預設關閉

## Breaking Changes

- Nexus 回呼路由方式改變：worker 目標一律走 `temporal://system`，舊的 `Nexus-Callback-Source` header-based 路由只有在明確開啟 `callback.inspectSourceHeader` 時才可用；`nexusoperation.useSystemCallbackURL` 與 `component.nexusoperations.useSystemCallbackURL` 設定已移除
  - 影響範圍：使用 Nexus 跨服務回呼且依賴舊版路由行為的部署
- `component.callbacks.allowedAddresses` → `callback.allowedAddresses`
  - 影響範圍：透過 dynamic config 設定 Nexus 回呼白名單網址的部署
- 統一查詢轉換器（Unified Query Converter）成為預設：Visibility 查詢的型別比對轉嚴（例如 `CustomKeyword = 123` 這種型別不符的比較會直接回錯誤，數值型別之間互轉例外），且 `Text` 型別欄位不能拿空字串或純空白比對 → 可用 `system.visibilityEnableUnifiedQueryConverter: false` 暫時退回舊行為，但舊轉換器預計在 v1.33 移除
  - 影響範圍：所有使用自訂 Search Attribute 做 Visibility 查詢的專案
- `VisibilityRow.ExecutionDuration` 型別從 `*time.Duration` 改為 `*int64`
  - 影響範圍：自行實作 `VisibilityStore` 介面的專案
- `Describe`/`List` 批次操作回應改用明確的 `*_WORKFLOW` enum 值
  - 影響範圍：拿舊版已標記 deprecated 的 enum 值做比對的 client 程式碼
- Elasticsearch Visibility 查詢預設關閉部分結果（`allow_partial_search_results=false`）
  - 影響範圍：使用 Elasticsearch 作為 Visibility store 的部署，`ListWorkflowExecutions` 等 API 分頁行為可能受影響
- `ListWorkers` 預設不再回傳系統內部 worker，需傳入 `include_system_workers` 才會列出
  - 影響範圍：依賴 `ListWorkers` 回應內容做監控或自動化的腳本

## 遷移指南

### 從 1.31.x 升級到 1.32.0

```bash
# Server 端（依部署方式擇一，以下為容器映像範例）
docker pull temporalio/server:1.32.0
```

```bash
# 若自行實作 VisibilityStore，需同步調整型別
# 舊寫法
type VisibilityRow struct {
    ExecutionDuration *time.Duration
}

# 新寫法
type VisibilityRow struct {
    ExecutionDuration *int64
}
```

若專案依賴舊版 Nexus header-based 回呼路由，升級前先確認外部回呼來源是否都已遷移到 URL scheme 路由，或先設定 `callback.inspectSourceHeader: true` 爭取過渡時間。若有自訂 Search Attribute 查詢，先在測試環境跑一輪既有查詢語句，確認沒有踩到統一查詢轉換器新增的型別比對限制，再決定是否要暫時用 `system.visibilityEnableUnifiedQueryConverter: false` 延後遷移。

## 與其他框架的對比觀察

在 LangGraph、Mastra 這類框架陸續把記憶與 checkpoint 做成原生功能、降低對外部持久化元件依賴的同時，Temporal 這次反而在做相反方向的事——把 Activity 拆得更細、更能獨立維運。這反映兩種對「長時序 Agent 任務」的不同賭注：一種是讓 Agent 框架自己吸收持久化邏輯，換取更輕量的部署；另一種像 Temporal 這樣，持續強化底層執行引擎的粒度控制，把自己定位成「不管上層框架怎麼變，都值得放在底下撐可靠性」的基礎設施層。兩條路線目前看不出誰會贏，但 Standalone Activities GA 說明 Temporal 沒有打算退出 Agent 工具呼叫這個場景的競爭。

## 今日收穫

之前以為 Standalone Activity 只是「不用包在 Workflow 裡的 Activity」這種語法上的簡化，看到這次一次補齊 operator API（暫停、恢復、重置 attempt 狀態）和批次操作（依 visibility 查詢批次取消/終止/刪除）才意識到：一個執行單元要從「實驗性語法糖」變成「可以放進生產環境維運」，門檻不是能不能跑，而是出問題時有沒有一整套操作介面可以介入——這批 API 補的正是這一塊。

## 參考資料

- [Temporal v1.32.0 Release Notes](https://github.com/temporalio/temporal/releases/tag/v1.32.0)
- [Temporal GitHub](https://github.com/temporalio/temporal)
- [Temporal v1.31.1 Release Notes](https://newreleases.io/project/github/temporalio/temporal/release/v1.31.1)
- [Full Changelog: v1.31.1...v1.32.0](https://github.com/temporalio/temporal/compare/v1.31.1...v1.32.0)
