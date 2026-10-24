---
title: "框架更新｜Inngest v1.49.0"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, framework, daily, inngest]
lang: zh-TW
description: "Inngest v1.49.0 把 function 的 replay 與 resume 操作開放到 v2 API、CLI 與 MCP 三個入口，讓卡住或失敗的 agent workflow 可以直接恢復"
tldr: "Inngest v1.49.0 兩個重點：(1) 新增 v2 API function replay，可依時間範圍與狀態重放特定 run，同時開放 API／CLI／MCP 三種呼叫方式；(2) 新增 v2 API resume function，讓暫停中的 workflow 能直接從控制層恢復，不用自己寫輪詢邏輯。對 SDK 使用者無 breaking changes，自行架設的團隊需留意 migration notes 的部署順序。"
series:
  name: "AI Framework Changelog"
  order: 52
---

> 🌏 [English version](/posts/daily/2026-10-24-framework-inngest-v1.49.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Inngest |
| 版本 | v1.49.0 |
| 前一版 | v1.48.0 |
| 發布日 | 2026-10-23 |
| Release Notes | [GitHub Release](https://github.com/inngest/inngest/releases/tag/v1.49.0) |
| GitHub | [inngest/inngest](https://github.com/inngest/inngest) |
| Stars | 5,968 |

## 這個版本為什麼重要

[前一篇（1.46.0）](/posts/daily/2026-10-07-framework-inngest-1.46.0)把本機開發環境接上雲端 sandbox；這次則是補上長時間執行 workflow 的維運能力：function 的 replay（重放）與 resume（恢復）操作，第一次同時開放給 v2 API、CLI、MCP 三個入口。過去要重放失敗的 run 或恢復卡住的 function，多半得靠 dashboard 手動點，或是自己寫輪詢邏輯去檢查狀態。現在這兩個動作變成一般呼叫就能觸發的標準操作，對會寫長時間執行 agent workflow（等外部事件、等人工審核）的團隊來說，這代表「卡住的 agent」可以被自動化系統偵測並直接恢復，不需要人工介入。

## 重要變更

- **新增 v2 API function replay**：透過 API（`POST /api/v2/apps/{app_id}/functions/{function_id}/replays`）、CLI（`inngest api create-replay`）或 MCP（`create_replay`）依時間範圍與狀態重放某個 function 的歷史執行 → 不用重新觸發整個事件，就能針對特定時間窗內失敗或跳過的 run 做重放除錯
- **新增 v2 API resume function**：透過 API（`POST /v2/apps/{app_id}/functions/{function_id}/resume`）、CLI 或 MCP 恢復暫停中的 function → 長時間執行的 agent workflow 卡在等待外部事件時，可以直接從控制層恢復，不用自己寫輪詢邏輯
- **CQRS 分頁精準度修正**：run 分頁納入跳過的 run，並修正分頁精確度 → 重放查詢現在能正確找到所有「skipped」狀態的 run
- **Dashboard 顯示重放失敗與正確的跳過計數** → 重放操作失敗不會再靜默消失，維運時能直接看到哪些重放沒成功
- **API 請求限制修正**：在解析請求前就套用大小限制 → 修掉用尾斜線繞過事件請求大小限制的漏洞

## Breaking Changes

本版本對 SDK 使用者無 breaking changes。自行架設（self-host）的團隊需留意 release notes 的 Migration Notes：#5018 的 GraphQL 變更要先部署，dashboard build 會使用即時 API，移除新的 error 欄位前要先確認 dashboard 版本可以回退。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
# Go 版 inngest CLI／server
go install github.com/inngest/inngest/cmd/inngest@v1.49.0
```

自行架設 Inngest 的團隊，部署 #5018 的 GraphQL 變更時，記得先確認 dashboard 版本可以安全回退，再移除新增的 error 欄位。

## 與其他框架的對比觀察

Temporal 原生支援長時間執行的 signal／resume 已經打磨多年；Inngest 這次把 function replay 與 resume 同時開放給 API、CLI、MCP 三個入口，是在補齊「長時間 agent workflow 維運能力」上更貼近 Temporal 核心賣點的一步，而不只是停留在佇列、排程層的 serverless workflow 引擎。

## 今日收穫

之前以為 function 的 replay／resume 是維運人員用 dashboard 手動點的後台調試工具；看到 Inngest 把這兩個操作同時開放給 API、CLI、MCP 三個入口才意識到，這等於是把「恢復一個卡住的 agent」變成 agent 自己或外部自動化系統也能直接呼叫的標準動作，而不是只能靠人工介入。

## 參考資料

- [Inngest v1.49.0 Release Notes](https://github.com/inngest/inngest/releases/tag/v1.49.0)
- [inngest/inngest GitHub Repository](https://github.com/inngest/inngest)
- [Inngest v1.46.0 — 上一篇框架更新](/posts/daily/2026-10-07-framework-inngest-1.46.0)
- [Full Changelog: v1.48.0...v1.49.0](https://github.com/inngest/inngest/compare/v1.48.0...v1.49.0)
