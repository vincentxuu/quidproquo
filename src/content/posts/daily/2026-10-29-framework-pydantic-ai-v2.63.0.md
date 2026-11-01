---
title: "框架更新｜Pydantic AI v2.63.0"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.63.0 把 CodeMode 的揭露工具改成附加而非重寫快取 prompt，新增 DetectLoops 偵測重複動作迴圈，並讓 harness SpendLimits 預算能透過 PostgreSQL 跨 worker 共享"
tldr: "Pydantic AI v2.63.0 三個重點：(1) Breaking：`CodeMode` 預設 `dynamic_catalog=True`，揭露的工具改成附加而非重寫快取的 prompt，`GoogleRealtimeConnection.dial` 的 `replay` 參數也改成 keyword-only；(2) 新增 `DetectLoops` capability 偵測並中斷重複動作迴圈，另加 `IPythonCodeMode` 作為 Monty-based CodeMode 的替代執行環境；(3) 新增 `PostgresSpendStore`，讓 harness 的 `SpendLimits` 預算可以透過 PostgreSQL 在多個 worker 間共享，不必各自維護獨立額度。"
series:
  name: "AI Framework Changelog"
  order: 55
---

> 🌏 [English version](/posts/daily/2026-10-29-framework-pydantic-ai-v2.63.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.63.0 |
| 前一版 | v2.62.0 |
| 發布日 | 2026-10-27 |
| Release Notes | [v2.63.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## 這個版本為什麼重要

這版的主線是「長跑 agent 的失控成本」：重複呼叫同一個工具、卡住的 callback、多個 worker 各算各的預算，這些問題平時不會壞事，但跑到幾十輪、幾十個 worker 之後就會慢慢把 token 和金錢燒掉。`DetectLoops` 直接偵測「agent 在重複做同一件事」並主動中斷，`PostgresSpendStore` 讓原本各 worker 獨立計算的 `SpendLimits` 預算改成共用一份存在 PostgreSQL 裡的額度，`task_timeout` 則讓 `Dataset.evaluate` 裡卡住的單個任務不會拖垮整批評測。同時官方在 Compatibility Notes 裡點名 `CodeMode` 的工具揭露行為改了：原本揭露一個新工具會整段重寫快取的 prompt，現在改成「附加」——這對大量使用 CodeMode 動態揭露工具的 agent 來說，直接影響 prompt cache 的命中率。

## 重要變更

- **DetectLoops 偵測重複動作迴圈**：新增 `DetectLoops` capability，在 agent 重複執行相同動作時主動中斷 → 不必自己寫迴圈偵測邏輯，長任務卡在同一個工具呼叫迴圈時可以提早止損
- **IPythonCodeMode 新執行環境**：在既有 Monty-based `CodeMode` 之外新增 `IPythonCodeMode` → 需要 IPython 生態（如既有 notebook 工具鏈）相容性的場景可以換一套執行環境，不必綁定 Monty
- **PostgresSpendStore 共享預算**：新增 `PostgresSpendStore`，讓 harness 的 `SpendLimits` 透過 PostgreSQL 共享 → 多個 worker 跑同一個預算上限時不必各自維護獨立額度，避免多 worker 疊加超支
- **task_timeout 限制單個評測任務**：`Dataset.evaluate` 新增 `task_timeout`，為每個任務嘗試設定時限 → 評測批次裡卡住的單個 task 不會拖住整批結果
- **manage_message_history 避免歷史重複傳送**：UI adapters 新增 `manage_message_history`，讓 server 端保存的歷史不會重複送給 model → 接自訂 UI 層時減少一種容易漏算的 token 浪費
- **公開 framing 模組**：新增公開的 `pydantic_ai.framing` 模組（`wrap`、`neutralize_tags`、`register_tag`）→ 擴充套件可以用官方工具框自己的標籤，而不必各自重新發明轉義邏輯
- **ag-ui-protocol 1.0 支援**：正式支援 ag-ui-protocol 1.0 → 接前端 Agent UI 協定時不必卡在舊版規格

## Breaking Changes

- `CodeMode` 預設改為 `dynamic_catalog=True`：揭露新工具時改成「附加」而不是重寫整段快取的 prompt
  - 影響範圍：大量依賴 CodeMode 動態揭露工具、且依賴舊版「每次揭露都重寫 prompt」行為或快取 key 的程式碼，prompt cache 命中模式會改變
- `GoogleRealtimeConnection.dial` 的 `replay` 參數改為 keyword-only
  - 影響範圍：用 positional 參數呼叫 `dial(..., replay_value)` 的程式碼會直接報錯
- Harness `LLMReminder` 預設 `interval=10`，不再每次請求都生成提醒
  - 影響範圍：依賴「每次請求都會收到 reminder」的自訂邏輯行為會改變
- 把帶簽章或加密的歷史資料用相同 `canonical_system` 重播給 provider
  - 影響範圍：自訂 provider wrapper 若假設每次請求的 `canonical_system` 都不同，需要重新檢查

## 遷移指南

### 從 2.62.0 升級到 2.63.0

```bash
pip install --upgrade pydantic-ai==2.63.0
```

```python
# 若要維持 CodeMode 舊版「重寫快取 prompt」的行為
code_mode = CodeMode(dynamic_catalog=False)

# 若呼叫 GoogleRealtimeConnection.dial 時用 positional replay 參數
# 舊寫法
await connection.dial(config, replay_value)
# 新寫法（改成 keyword-only）
await connection.dial(config, replay=replay_value)
```

其餘功能為新增能力，不升級既有程式碼也能照常運作。

## 與其他框架的對比觀察

同一天（2026-10-27）Agno 在 v3.1.11 讓 `ClaudeAgent`／`CodexAgent` 這類外部 coding agent 可以直接當 Team／Workflow 的成員，走的是「把整個外部 agent 吸收進多代理編排」的路線；Pydantic AI 這版則是從執行環境本身演進——新增 `IPythonCodeMode` 作為 Monty-based CodeMode 的替代方案，同時用 `DetectLoops`／`task_timeout`／`PostgresSpendStore` 補強長跑執行期間的失控成本控制。兩個框架同期都在往「agent 可以更久、更安全地自己跑」的方向補強，只是一個從編排層整合外部 agent，一個從執行層管控資源消耗。

## 今日收穫

之前以為 `SpendLimits` 這類預算控制是「單個 worker 自己算」的事，看到 `PostgresSpendStore` 把它搬進共享資料庫才意識到：只要 agent 系統一旦擴展成多 worker 並行，預算控制就不再是單機邏輯問題，而是分散式一致性問題——沒有共享存儲，各 worker 看到的「還剩多少預算」永遠是舊資料，疊加超支只是時間問題。

## 參考資料

- [Pydantic AI v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.62.0...v2.63.0](https://github.com/pydantic/pydantic-ai/compare/v2.62.0...v2.63.0)
- [Agno v3.1.11 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.11)
