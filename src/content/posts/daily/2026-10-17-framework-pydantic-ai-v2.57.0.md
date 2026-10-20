---
title: "框架更新｜Pydantic AI v2.57.0"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.57.0 新增 ApprovalReviewer，讓另一個模型先審低風險工具呼叫再決定要不要讓人看；也補上 MetaProvider 與 MCP Apps 的工具結果轉送"
tldr: "Pydantic AI v2.57.0 兩個重點：(1) 新增 harness `ApprovalReviewer`，讓模型在人看到之前先審過低風險工具呼叫；(2) 新增 `MetaProvider` 接 Meta Muse 模型家族。另外 MCP Apps 的工具結果會轉給 AG-UI 與 Vercel AI 前端，`MCPToolset` 補上 `read_resource_contents`／`call_tool_for_app`。相容性注意：`BackgroundTools` completion 多了命名空間化的 `origin`／`tool_call_id` metadata，Gemini Live／GPT-Live 的 realtime 歷史、用量與等待回覆邏輯搬進 session core，`Skills` 開始遵守 `disable-model-invocation`／`user-invocable` 旗標。"
series:
  name: "AI Framework Changelog"
  order: 45
---

> 🌏 [English version](/posts/daily/2026-10-17-framework-pydantic-ai-v2.57.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.57.0 |
| 前一版 | v2.56.0 |
| 發布日 | 2026-10-16 |
| Release Notes | [v2.57.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.7k |

## 這個版本為什麼重要

上一版把執行環境補齊（microVM 沙箱、PGTaskDurability），這一版補的是審批流程。`ApprovalReviewer` 讓低風險的工具呼叫先過一個模型審查，只有真正該讓人看的才會跳出確認——這是把「人在迴圈裡」的成本從每次工具呼叫，降到只剩真正有風險的那幾次。對已經在用 human-in-the-loop 審批的 harness 專案，這是直接能省掉大量不必要中斷的功能。

## 重要變更

- **Harness ApprovalReviewer**：讓一個模型在人看到工具呼叫之前先審過，低風險的直接放行，可疑的才交給人 → 原本每個待審工具呼叫都要人看一眼,現在可以先篩掉大部分
- **MetaProvider**：新增對 Meta Muse 模型家族的支援，用 `meta:` 前綴走 Responses API → 不用自己接 Meta 的 API 格式
- **MCP Apps 工具結果轉送**：MCP Apps 的工具結果會轉給 AG-UI 與 Vercel AI 前端，`MCPToolset` 新增 `read_resource_contents`、`call_tool_for_app` → 前端能直接展示 MCP Apps 回傳的畫面，不用自己轉譯
- **請求計價**：請求依報回的 service tier 計價 → 帳務和模型實際用的 tier 對得起來
- **EvaluationReport 補欄位**：新增 `dataset_name` → 跑評測時更容易追回是哪個資料集
- **值得注意的修正**：token-based compaction 保留更多近期歷史;`OpenAIResponsesModel` 不再送 `allowed_tools` 裡不存在的 `tool_choice` 名稱；Gemini 的 tool-call thought signature 會從 `OpenAIChatModel` 送回去；工具的 `prepare` 在 `.prefixed()`／`.renamed()`／`PrefixTools` 底下各自有自己的重試次數

## Breaking Changes

Release notes 沒有標成 breaking，但列了四項「相容性注意」，實務上等同行為變更：

- `BackgroundTools` completion 多了命名空間化的 `origin`／`tool_call_id` metadata
  - 影響範圍：自己解析 `BackgroundTools` completion 結構的程式
- Gemini Live 與 GPT-Live 的 realtime 歷史、用量、等待回覆邏輯都搬進 session core
  - 影響範圍：直接操作這兩種 realtime session 內部狀態的整合
- `Skills` 開始遵守 `disable-model-invocation`／`user-invocable` 旗標，也會跳過不在技能庫裡的雜散路徑
  - 影響範圍：依賴舊行為（旗標不生效）載入技能的專案

## 遷移指南

### 從 v2.56.0 升級到 v2.57.0

```bash
pip install --upgrade "pydantic-ai==2.57.0"
```

升級後檢查：如果自己解析過 `BackgroundTools` completion 的 metadata 結構，確認新加的 `origin`／`tool_call_id` 不會踩到既有欄位；用 Gemini Live 或 GPT-Live 且直接碰過 session 內部狀態的地方，改走 session core 提供的介面。想用新的審批流程：

```python
from pydantic_ai.harness import ApprovalReviewer

reviewer = ApprovalReviewer(model="低風險審查用的模型")
# 低風險工具呼叫由 reviewer 直接放行，其餘才交給人審
```

## 與其他框架的對比觀察

今天 Mastra 1.78.0 用 agent scope 做「誰能碰哪個 run」，Agno v3.1.4 用 sandbox 做「agent 能碰到什麼」，Pydantic AI 的 `ApprovalReviewer` 補的是第三層：「工具呼叫要不要讓人看」。三個框架這週的更新合起來,剛好是生產環境 agent 需要的三道防線——權限、隔離、審批。

## 今日收穫

之前以為 human-in-the-loop 審批就是「所有工具呼叫都丟給人看」,看到 `ApprovalReviewer` 才意識到這個假設的成本有多高——如果低風險的呼叫可以先讓另一個模型篩掉,人真正要看的才是少數例外,審批機制才不會變成瓶頸。

## 參考資料

- [Pydantic AI v2.57.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [ApprovalReviewer PR #10143 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10143)
- [MetaProvider PR #10156 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10156)
- [框架更新｜Pydantic AI v2.56.0](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0)
