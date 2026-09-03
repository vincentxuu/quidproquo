---
title: "框架更新｜Pydantic AI 2.36.0"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.36.0 把 durable_exec 重寫成單一 @durable_operation 宣告式介面，讓第三方（Lambda、Restate、Absurd 等）durable 引擎不用碰任何私有 API 就能接上 Agent 的容錯執行"
tldr: "Pydantic AI 2.36.0 三個重點：(1) 新增 `@durable_operation` decorator，讓 Agent 的自訂能力（capability）方法直接變成可在 Temporal／Prefect／DBOS 等引擎下 replay-safe 的 durable unit；(2) 為第三方 durable 引擎開出公開 backend API（`BaseDurabilityCapability`、`CallableOperationBackend`、`RegisteredOperationBackend`），官方三個 out-of-tree 引擎驗證零私有 import；(3) 一項相容性緊縮：MCP 工具不再能透過 tool metadata 關閉 durable 執行（DBOS 先前允許），此外 Prefect 的動態工具快取鍵也修正為包含完整 `ToolDefinition`。"
series:
  name: "AI Framework Changelog"
  order: 10
---

> 🌏 [English version](/en/posts/daily/2026-08-30-framework-pydantic-ai-2.36.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.36.0 |
| 前一版 | v2.35.3 |
| 發布日 | 2026-08-29 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.36.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.6k |

## 這個版本為什麼重要

Pydantic AI 已經支援 Temporal、DBOS、Prefect、Restate 四種 durable execution 引擎，讓 Agent 能在 API 中斷或應用程式重啟後從斷點續跑。但過去每個引擎都要自己手刻一套「怎麼命名、序列化、派發、快取一個 durable 單元」的邏輯，六套機制各自維護。2.36.0 把這件事收斂成一個核心概念：**每個 durable 單元都是一個宣告出來的 operation**，框架負責組裝，各引擎只需要實作一個小小的 backend class 去綁定它。對開發 Agent capability（例如自訂的訊息壓縮、審核、快取邏輯）的人來說，這代表只要在方法上加一行 `@durable_operation`，這段邏輯在任何 durable 引擎下都會自動變成可重放（replay-safe）的執行單元——官方拿內部的 `SummarizingCompaction` 壓縮邏輯做示範，改動只用了 3 行。對正在整合或維護第三方 durable 引擎（例如 AWS Lambda、Restate、Absurd）的團隊，這次也第一次拿到完整公開的 backend API，不用再碰任何私有內部名稱。

## 重要變更

- **`@durable_operation` decorator（`pydantic_ai.capabilities`）**：在 capability 的 async 方法上標記後，正常呼叫這個方法就會在有 durability 引擎綁定時自動變成 activity／step／task 執行，沒有引擎時則直接透傳（pass-through）→ 開發者不用為了「要不要支援 durable」寫兩套邏輯，也不用學任何引擎專屬 API
- **標記在 base hook 上會透過 MRO 掃描讓所有子類別覆寫都自動 durable**：例如 `create_sandbox`／`destroy_sandbox` 這類 hook 只要在基底類別標一次，所有 provider 的覆寫實作都自動獲得 durable 保護 → 子類別完全不用重複宣告
- **第三方引擎公開 backend API（`pydantic_ai.durable_exec`）**：新增 `BaseDurabilityCapability`、`DurabilityEngineSpec`、`CallableOperationBackend`（給 Temporal/DBOS/Prefect 這類流程/journal 引擎）、`RegisteredOperationBackend`（給 Temporal 風格需要預先註冊操作的引擎）等公開類別 → 引擎作者只需設定一個 `engine_spec` 並覆寫 `get_durable_operation_backend()`，不再需要繼承或呼叫框架內部私有名稱
- **未來新操作族群（例如即將加入的 sandbox 操作）零額外接線**：Registered 類引擎透過通用 fallback 綁定未知的未來 operation id，引擎作者不需要為每個新功能族群補寫對應程式碼
- **工具參數驗證獨立成自己的 durable 單元**：`args_validator` 的執行被拆到獨立的 durable unit 中，所有 `ValidationError`（無論來自參數驗證還是工具本體）都完整記錄並在 worker 端重建，讓 durable 執行下的重試提示行為與一般執行完全一致

## Breaking Changes

- **MCP 工具無法再透過 tool metadata 關閉 durable 執行**：舊寫法 `{'<engine>': False}` 在所有引擎上都不再支援（因為 MCP 工具本身會進行 I/O，官方認定它必須永遠在自己的 durable 單元中執行）
  - 影響範圍：先前依賴 DBOS 這項行為、刻意讓特定 MCP 工具跳過 durable 包裝的專案
- **Prefect 動態工具快取鍵變更**：動態工具（dynamic tool）的快取識別鍵現在納入完整的 `ToolDefinition`，修正舊版「工具定義變了但快取仍沿用舊結果」的 bug
  - 影響範圍：使用 Prefect 引擎且依賴動態工具快取的專案——升級後首次呼叫會快取未命中（cache miss）並重新計算一次，之後恢復正常
- 另外 `clai` CLI 的 `load_mcp_toolsets()` 從 2.36.0 起會在載入階段直接拒絕不符合 `mcpServers` schema 的設定值，而不是等到連線 MCP server 時才失敗（官方註記：這類設定本來就無法成功呼叫 MCP，且拋出的仍是文件記載的 `ValueError`，故視為可在 minor 版本內调整的相容性緊縮，而非破壞式變更）

## 遷移指南

### 從 2.35.x 升級到 2.36.0

```bash
pip install --upgrade pydantic-ai==2.36.0
```

若曾用 tool metadata 停用 MCP 工具的 durable 執行（DBOS 使用者需特別檢查）：

```python
# 舊寫法（2.35.x 及之前，DBOS 上可行）
# 透過 tool metadata 讓特定 MCP 工具跳過 durable 包裝
mcp_tool_metadata = {"dbos": False}

# 新寫法（2.36.0 起）
# 不再支援關閉；MCP 工具一律在自己的 durable 單元中執行
# 若需要客製行為，改在該工具外層另行包裝一層非 MCP 的 capability 方法
```

若要在自訂 capability 上啟用 durable 執行，直接加上新的 decorator 即可：

```python
from pydantic_ai.capabilities import durable_operation

class MyCapability:
    @durable_operation(id="my_capability.summarize")
    async def summarize(self, messages: list[str]) -> str:
        ...  # 在任何 durability 引擎下自動變成 replay-safe 的 durable 單元
```

## 與其他框架的對比觀察

LangGraph 的持久化走的是「checkpoint 存 state」路線，把整個 graph 執行狀態序列化保存；Pydantic AI 這次走的是另一條路——把「哪些程式碼片段需要容錯重放」下放成開發者用 decorator 逐一宣告的細粒度單元，同時把「怎麼接不同的 durable 引擎」這件事標準化成一組公開介面。對已經有自訂 Temporal/DBOS 用量、或想接非官方引擎（如 AWS Lambda、Restate）的團隊來說，這種「引擎中立」的設計比綁死單一持久化後端更有彈性。

## 今日收穫

一開始以為「支援多個 durable 執行引擎」只是接口適配層的差異，看了這次 PR 描述才注意到，真正的工程難點其實是「命名穩定性」——引擎需要知道同一個邏輯單元在跨版本重跑時該對應到同一個持久化名稱，否則 replay 會對不上號。Pydantic AI 這次把「命名、快取識別、序列化」全部收攏到框架基底類別裡統一處理，而不是讓每個引擎各自決定，這才是真正解決「多引擎支援」這個問題的關鍵所在，而不只是多寫幾個 adapter。

## 參考資料

- [Pydantic AI v2.36.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.36.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #6696 — Add `@durable_operation` for capabilities and a public backend API for third-party durable execution engines](https://github.com/pydantic/pydantic-ai/pull/6696)
- [PR #1374 — Add `--mcp-config` support and tool-call streaming to `clai`](https://github.com/pydantic/pydantic-ai/pull/1374)
- [Durable Execution — Pydantic AI 官方文件](https://ai.pydantic.dev/durable_execution/overview/)
