---
title: "框架更新｜Pydantic AI v2.69.0"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.69.0 一次補上六種沙箱／workspace 後端，並新增讓多個 agent 直接互傳訊息的 Peers，同時把 RequestInput 收進 HandleDeferredToolCalls"
tldr: "Pydantic AI v2.69.0 的相容性注意事項：RequestInput 被併入 HandleDeferredToolCalls，其 handler 現在能接 resume token；BubblewrapSandbox 改名為 BubblewrappedWorkspace。功能面新增 KubernetesSandbox、WindowsWorkspace 等六種沙箱／workspace 後端，以及讓多個 agent 直接互傳訊息的 Peers。"
series:
  name: "AI Framework Changelog"
  order: 69
---

> :globe: [English version](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.69.0 |
| 前一版 | v2.68.0 |
| 發布日 | 2026-11-16 |
| Release Notes | [v2.69.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## 這個版本為什麼重要

這版的改動量很大（官方 changelog 列了上百條），但主線很清楚：Pydantic AI 把自己的 `pydantic-ai-harness`（agent 執行環境層）從「幾種固定沙箱」往「照各家雲端供應商的網路與機密管理介面逐一對應」擴充，一次新增六種沙箱／workspace 後端。同時新增 `Peers`，讓多個 agent 可以直接互傳訊息，不必每次都繞經一個中央 orchestrator 轉送。對正在用 pydantic-ai 搭多 agent 系統的開發者來說，這版是「agent 要跑在哪裡、agent 之間怎麼講話」這兩件事同時被補齊的一版，而不是單一功能的小修。

## 重要變更

- **六種沙箱／workspace 後端一次補齊**：新增 `KubernetesSandbox`（跑在 kubernetes-sigs/agent-sandbox pods 上）、`WindowsWorkspace`（PowerShell workspace，支援 Windows host）、`E2BSandbox(network=)`、`BoxdSandbox(secrets=)`、`DaytonaSandbox(secrets=)`、`OpenSandbox(network_policy=)` → agent 執行環境不再侷限於原本少數幾種沙箱，可以照各家雲端供應商自己的網路隔離與機密注入方式對應
- **Peers：agent 之間直接傳訊息**：`pydantic-ai-harness` 新增 `Peers`，讓多個 agent 能彼此傳訊息 → 補上多 agent 協作時「agent 互相講話」的原生管道，不用每次都自己兜一個中央轉送層
- **ToolBudgets**：工具呼叫超出預算或被重複呼叫時，可以讓 `ToolBudgets` 回答一個結果而不是直接丟例外 → 把「要不要繼續呼叫工具」這個決策從寫死的例外處理，變成開發者可以接管的掛鉤
- **DynamicWorkflow(call_scheduler=)**：子類別可以自訂子 agent 呼叫什麼時候啟動 → 子任務的排程邏輯不再被框架內部邏輯綁死

## Breaking Changes

- `RequestInput` 被併入 `HandleDeferredToolCalls`：官方 compatibility note 寫的是「Fold `RequestInput` into `HandleDeferredToolCalls`, whose handler can take a resume token」——原本獨立的 `RequestInput` 機制收進 `HandleDeferredToolCalls`，它的 handler 現在可以接收 resume token 來串接恢復流程
  - 影響範圍：直接 import 或建構 `RequestInput` 的程式碼
- `BubblewrapSandbox` 改名為 `BubblewrappedWorkspace`
  - 影響範圍：直接引用 `BubblewrapSandbox` 類別名稱的程式碼

## 遷移指南

### 從 2.68.x 升級到 2.69.0

```bash
pip install --upgrade pydantic-ai==2.69.0
```

這版的相容性變動主要是命名與介面收斂，而不是行為邏輯重寫，官方沒有提供逐行的新舊程式碼對照，確切改法建議直接看對應 PR 的 diff：

- `RequestInput` → `HandleDeferredToolCalls`：[PR #13285](https://github.com/pydantic/pydantic-ai/pull/13285)
- `BubblewrapSandbox` → `BubblewrappedWorkspace`：[PR #13179](https://github.com/pydantic/pydantic-ai/pull/13179)

## 與其他框架的對比觀察

同一週 [Agno v3.2.1](/posts/daily/2026-11-18-framework-agno-v3.2.1) 把 session compaction 歷程和 Company 檔案開放成可查詢的 API，Pydantic AI 這版則是往「agent 要跑在哪裡、agent 之間怎麼互通」的基礎設施面擴充。兩個框架同一週分別往「可稽核性」跟「執行環境彈性」兩個不同方向補強，呼應上一篇 Agno v3.2.0 文章提到的觀察：agent 框架之間的競爭，已經從單個 agent 怎麼寫，延伸到 agent 要跑在哪裡、彼此怎麼講話這些基礎設施層的問題。

## 今日收穫

之前以為 Pydantic AI 的「harness」只是把 agent 跑起來的執行環境包裝層，這次看到一次補上六種沙箱／workspace 後端，外加讓多個 agent 直接互傳訊息的 Peers，才意識到它已經把自己定位成一個完整的 multi-agent 執行環境提供商，而不只是一個呼叫 LLM 的 SDK。

## 參考資料

- [Pydantic AI v2.69.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.68.0...v2.69.0](https://github.com/pydantic/pydantic-ai/compare/v2.68.0...v2.69.0)
- [PR #13285：Fold RequestInput into HandleDeferredToolCalls](https://github.com/pydantic/pydantic-ai/pull/13285)
- [PR #13179：Rename BubblewrapSandbox to BubblewrappedWorkspace](https://github.com/pydantic/pydantic-ai/pull/13179)
- [Agno v3.2.1 深入介紹（Session Compactions／Company Files API）](/posts/daily/2026-11-18-framework-agno-v3.2.1)
