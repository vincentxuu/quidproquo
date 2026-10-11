---
title: "框架更新｜Pydantic AI 2.55.0"
date: 2026-10-11
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.55 把跨 run 的對話歷程收進原生 Conversation 物件，並把 prompt caching 統一成跨供應商的 cache 設定"
tldr: "Pydantic AI 2.55.0 三個重點：(1) 新增 `Conversation` 物件承載並儲存一次對話的 run 歷程，所有進入點都能用 `conversation=` 傳入，不用再自己手動接 `message_history`；(2) 新增跨供應商的統一 `cache` 設定與 `Caching` capability，`cache=True` 時 Anthropic 連 instructions／tool definitions 都一併快取；(3) 新增官方託管的 `PostgresStepStore`／`PostgresMediaStore` 持久化後端。相容性變更：全系列套件要求 Python 3.11+，LogfireMCP 工具名稱多了 `logfire_` 前綴。"
series:
  name: "AI Framework Changelog"
  order: 37
---

> 🌏 [English version](/en/posts/daily/2026-10-11-framework-pydantic-ai-2.55.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | `v2.55.0` |
| 前一版 | `v2.54.0` |
| 發布日 | 2026-10-09 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.5k |

## 這個版本為什麼重要

過去要讓一次 `run()` 接續上一次的對話，得自己把前一次的 `message_history` 撈出來、傳進下一次呼叫——這段銜接邏輯寫在呼叫端，框架不管。2.55 把這件事收進框架層：新增 `Conversation` 物件承載並儲存一次對話的完整 run 歷程，而且是所有進入點（`run`／`run_sync`／`run_stream` 等）共通的參數，不是只有某個特定 API 才吃得到。另一個方向是把 prompt caching 從「各家 provider SDK 自己的參數」收斂成框架層的統一設定：新增跨供應商的 `cache` 設定與 `Caching` capability，一行 `cache=True` 就能在 Anthropic 上連 instructions 與 tool definitions 都一併快取，而不只是訊息內容。這兩項合起來看，方向很一致——把「對話怎麼銜接」「快取怎麼開」這兩件原本分散在呼叫端或各 provider 參數裡的事，變成框架原生、跨 provider 通用的介面。比較實際的影響則是 import 時間減半（`pydantic_ai.mcp` 改成延遲載入）和新增官方託管的 Postgres 持久化後端，這兩項對日常開發體感更直接。

## 重要變更

- **`Conversation` 物件**：新增 `Conversation` 類別承載並儲存一次對話的 run 歷程，所有進入點都能用 `conversation=` 傳入 → 不用再自己手動把上一次 run 的 `message_history` 接到下一次呼叫（[#8337](https://github.com/pydantic/pydantic-ai/pull/8337)）
- **統一 `Caching` capability**：新增跨供應商的 `cache` 設定與 `Caching` capability → 一致的方式開啟 prompt caching，不必為每個 provider 各寫一套快取參數（[#7560](https://github.com/pydantic/pydantic-ai/pull/7560)）
- **Anthropic 快取範圍擴大**：`cache=True` 使用 Anthropic 自動快取時，連 instructions 與 tool definitions 都會一併快取（原本只快取訊息內容）→ system prompt 長、工具定義多的 Agent 可以省下更多重複 token 成本（[#10047](https://github.com/pydantic/pydantic-ai/pull/10047)）
- **`PostgresStepStore` / `PostgresMediaStore`**：新增官方託管的 Postgres 後端，分別儲存訊息與媒體 → 不用再自己刻儲存層或綁 Logfire 雲端（[#9899](https://github.com/pydantic/pydantic-ai/pull/9899)）
- **Import 時間減半**：`pydantic_ai.mcp` 改成延遲載入，只有真的用到 MCP capability 時才匯入 → `import pydantic_ai` 的時間減半（[#10046](https://github.com/pydantic/pydantic-ai/pull/10046)）
- **`OpenAIDecisionsModel`**：新增支援影像輸入的 Decisions 後端（[#9634](https://github.com/pydantic/pydantic-ai/pull/9634)）
- **`claude-haiku-5-5` 支援**：新增對 Claude Haiku 5.5 模型的支援（[#9998](https://github.com/pydantic/pydantic-ai/pull/9998)）
- **harness `Coder` 預設開 prompt caching**：內建的 `Coder` capability 現在預設打開 prompt caching（[#10040](https://github.com/pydantic/pydantic-ai/pull/10040)）

## Breaking Changes

- 全系列套件（`pydantic-ai`／`pydantic-ai-slim`／`pydantic-graph` 等）要求 Python 3.11 或更新版本，Python 3.10 的安裝會被解析到 2.54.0 或更早版本：
  - `pip install pydantic-ai` 在 Python 3.10 上不會報錯，但也拿不到 2.55 的任何新功能，只是悄悄裝到舊版
  - 影響範圍：仍在用 Python 3.10 的專案（[#9526](https://github.com/pydantic/pydantic-ai/pull/9526)）
- `LogfireMCP` 的工具名稱加上 `logfire_` 前綴：
  - 影響範圍：用 `LogfireMCP` 且在程式碼或提示詞中硬寫了舊工具名稱字串的專案（[#9868](https://github.com/pydantic/pydantic-ai/pull/9868)）

## 遷移指南

### 從 2.54.x 升級到 2.55.0

```bash
# Step 1：先確認 Python 版本（3.11+），再升級套件
python --version
pip install --upgrade pydantic-ai==2.55.0
```

```python
# 舊寫法（2.54.x 及之前）：自己接續上一次 run 的 message_history
result1 = agent.run_sync("第一句話")
result2 = agent.run_sync("接著說", message_history=result1.all_messages())

# 新寫法（2.55.0）：用 Conversation 物件承載整段對話
from pydantic_ai import Conversation

conversation = Conversation()
result1 = agent.run_sync("第一句話", conversation=conversation)
result2 = agent.run_sync("接著說", conversation=conversation)
```

```python
# 新功能：跨供應商統一的 prompt caching 設定
agent = Agent("anthropic:claude-haiku-5-5", cache=True)  # instructions + tool definitions 一併快取
```

沒有用 Python 3.10、也沒有硬寫 `LogfireMCP` 工具名稱字串的專案，升級後沒有程式碼層的 breaking change；還在 Python 3.10 的專案，先升級 Python 才能拿到 2.55 的新功能。

## 與其他框架的對比觀察

把對話歷程從「呼叫端自己手刻的 `message_history` list」提升成框架層的一等公民物件，這跟同期 Agno 3.1.2 的 `Agent(compaction=True)`（把長對話折疊存檔進 `agno_compactions` 表，原始訊息不覆寫）方向一致——不同框架都在往「對話本身是一個可被查詢、儲存、搬移的物件」收斂，而不是停留在一串傳來傳去的訊息陣列。Prompt caching 收斂成框架層統一設定則補上另一塊：LangGraph、CrewAI 目前仍是「有快取能力但要跟著各 provider SDK 的參數寫」，Pydantic AI 用一個 `cache` 設定把這件事抽象掉，對同時接多個 model provider 的專案體感差異會比較明顯。

## 今日收穫

之前以為 prompt caching 單純是「各家 provider SDK 自己的參數」，頂多框架幫忙轉傳一下。Pydantic AI 把它收進框架層統一設定、而且預設把 harness 自帶的 `Coder` 也打開快取之後才意識到，快取策略其實該跟著 Agent 定義走——是不是要快取、快取到什麼範圍（訊息？instructions？tool definitions？），這些本來就是框架該幫忙決定的事，不該讓開發者在每個 provider 呼叫點各自重新想一遍。

## 參考資料

- [Pydantic AI v2.55.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.53.0 — 上一篇框架更新](/posts/daily/2026-10-03-framework-pydantic-ai-2.53.0)
- [PR #8337：新增 `Conversation` 物件](https://github.com/pydantic/pydantic-ai/pull/8337)
- [PR #7560：統一跨供應商 `Caching` capability](https://github.com/pydantic/pydantic-ai/pull/7560)
- [PR #10047：Anthropic 快取擴大到 instructions／tool definitions](https://github.com/pydantic/pydantic-ai/pull/10047)
- [PR #9899：新增 `PostgresStepStore`／`PostgresMediaStore`](https://github.com/pydantic/pydantic-ai/pull/9899)
- [PR #10046：`pydantic_ai.mcp` 延遲載入，import 時間減半](https://github.com/pydantic/pydantic-ai/pull/10046)
- [PR #9526：全系列套件要求 Python 3.11+](https://github.com/pydantic/pydantic-ai/pull/9526)
- [PR #9868：`LogfireMCP` 工具名稱加上 `logfire_` 前綴](https://github.com/pydantic/pydantic-ai/pull/9868)
- [Full Changelog：v2.54.0...v2.55.0](https://github.com/pydantic/pydantic-ai/compare/v2.54.0...v2.55.0)
