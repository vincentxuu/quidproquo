---
title: "框架更新｜Pydantic AI v2.62.0"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.62.0 讓 thinking effort 可以在對話中途改、把壓縮後的對話摘要變成結構化資料，並明確警告 GraphBuilder 的分支啟動順序改了，會影響正在重播的 durable workflow"
tldr: "Pydantic AI v2.62.0 三個重點：(1) 新增 `ModelSettingsDeltaPart`，可在對話進行中透過 OpenAI `configuration_update`／Anthropic per-message `output_config` 改 thinking effort，OpenRouter 上改 effort 還能保留 prompt cache；(2) `SummarizingCompaction` 的摘要改存成 `CompactionPart` 而非系統提示詞，且會送給所有 provider；(3) Breaking：`GraphBuilder` 的 broadcast 分支改成依 `.to()` 宣告順序啟動（原本是反過來），可能讓升級前已暫停、尚待重播的 durable workflow 行為改變。"
series:
  name: "AI Framework Changelog"
  order: 54
---

> 🌏 [English version](/posts/daily/2026-10-28-framework-pydantic-ai-v2.62.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.62.0 |
| 前一版 | v2.61.0 |
| 發布日 | 2026-10-26 |
| Release Notes | [v2.62.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## 這個版本為什麼重要

長任務的 agent 常遇到一個兩難：一開始用高 thinking effort 確保推理品質，但跑到後段重複性步驟時，高 effort 只是在燒 token。這版讓 thinking effort 可以在對話「進行中」改變，而不必砍掉對話重開一輪——OpenAI 用 `configuration_update`、Anthropic 用 per-message `output_config`，兩邊都記錄成新的 `ModelSettingsDeltaPart`，而且在 OpenRouter 上改 effort 還不會打掉 prompt cache。另一個值得注意的是 `GraphBuilder` 的 broadcast 分支啟動順序被倒過來改成依宣告順序——這類「執行順序」層級的改動最容易被忽略，但官方自己在 compatibility notes 裡點名：如果你有 durable workflow 在升級前就暫停、升級後才要重播，行為可能跟暫停時不一樣。

## 重要變更

- **對話中途改 thinking effort**：新增 `ModelSettingsDeltaPart`，OpenAI 透過 `configuration_update`、Anthropic 透過 per-message `output_config` 在對話進行中調整 thinking effort，OpenRouter 上改 effort 時維持 prompt cache 不被打掉 → 長任務可以依步驟複雜度動態調整推理成本，不必整輪對話固定一個 effort
- **新的模型錯誤分類**：新增 `ModelRequestRejectedError`、`ModelAuthenticationError`、`ModelNotFoundError` 三種錯誤類別 → 可以針對「請求被拒」「認證失敗」「模型不存在」分別處理重試策略，不必再從錯誤訊息字串猜原因
- **Deferred capabilities 的指令可見**：延遲載入的 capability 指令現在會用系統語氣陳述、變更會附加記錄，且會傳給 `before_model_request` → 寫自訂 before-request hook 時能看到目前載入了哪些 capability 指令
- **Hosted MCP 工具名稱預設加前綴**：hosted MCP capabilities 的工具名稱預設會加上服務名稱前綴，可用 `tool_prefix` 自訂 → 多個 MCP 服務掛同一個 agent 時減少工具名稱撞名
- **SubAgents 可背景執行、可操控**：`task_control` 讓 `SubAgents` 的委派任務可以背景跑、可被模型主動 steer／回答／取消 → 搭配 `Coder(task_control=)` 可以讓長任務委派不卡住主流程
- **Provider batch API 支援**：新增 `BatchModelRequests` capability 與 `get_wrapper_model` hook → 可以把大量請求送進 provider 的批次 API 省成本，不必自己拼批次邏輯
- **模型可主動請求壓縮**：`CompactOnRequest` 讓模型在任務的自然斷點主動請求 harness 壓縮對話 → 不必完全依賴固定的 token 門檻才觸發壓縮

## Breaking Changes

- `GraphBuilder` 的 broadcast 分支現在依 `.to()` 宣告順序啟動，而不是反過來
  - 影響範圍：升級前已暫停、升級後才要重播的 durable workflow，分支執行順序可能和暫停時不同
- `SummarizingCompaction` 的摘要改存成 `CompactionPart`，不再是系統提示詞，且會送給每個 provider（即使該 provider 沒有對應的 provider-specific 格式）
  - 影響範圍：依賴「壓縮摘要以系統提示詞形式出現」的自訂邏輯（例如解析 system prompt 找摘要文字）需要改讀 `CompactionPart`
- Hosted MCP capabilities 的工具名稱預設加上服務前綴（可用 `tool_prefix` 關閉或自訂）
  - 影響範圍：寫死工具名稱做比對、路由或白名單的程式碼升級後名稱會變

## 遷移指南

### 從 2.61.0 升級到 2.62.0

```bash
pip install --upgrade pydantic-ai==2.62.0
```

```python
# 若依賴 GraphBuilder 的 durable workflow 有暫停中的執行實例，
# 升級前確認分支順序改變不會影響已排程但尚未重播的步驟

# 若自訂邏輯讀取壓縮摘要，舊寫法（從 system prompt 字串找摘要）
summary = next(p.content for p in messages if is_system_prompt(p) and "摘要" in p.content)
# 新寫法（直接讀 CompactionPart）
summary = next(p.summary for p in messages if isinstance(p, CompactionPart))

# 若程式碼依賴 hosted MCP 工具的原始名稱，加回前綴或改用 tool_prefix=None 維持舊名稱
mcp_toolset = MCPToolset(..., tool_prefix=None)
```

其餘功能為新增能力，不升級既有程式碼也能照常運作。

## 與其他框架的對比觀察

這版把「執行期可調」做到了更細的粒度：thinking effort 能中途改、壓縮能由模型主動請求，都是把原本「啟動時固定、跑到底」的參數變成可以在運行中動態調整。對照 crewAI 在 1.15.29（2026-10-23）把 `AgentExecutor` 轉正、Mastra 在 1.79.0（2026-10-21）補 span 層級 observability，三個框架同期都在往「執行過程可觀測、可介入」的方向補強，只是切入點不同：pydantic-ai 做的是參數層的動態調整，crewAI／Mastra 做的是觀測與追蹤層。

## 今日收穫

之前以為 thinking effort 是「一輪對話開始前就定了，中途改不了」的參數，看到這版用 `configuration_update`／`output_config` 做到中途調整才意識到：長任務的推理成本控制，其實可以跟任務本身的複雜度曲線對齊，而不是整輪對話套同一個 effort 設定——這把「省 token」從「選一個夠用的 effort」變成「隨步驟動態調」的問題。

## 參考資料

- [Pydantic AI v2.62.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.61.0...v2.62.0](https://github.com/pydantic/pydantic-ai/compare/v2.61.0...v2.62.0)
