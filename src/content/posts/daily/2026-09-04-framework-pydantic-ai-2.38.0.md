---
title: "框架更新｜Pydantic AI 2.38.0"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.38.0 讓應用程式碼與 capability 能透過型別化的 CustomEvent／CapabilityEvent 訂閱 Agent 執行事件流，同時新增 context_window 內省與 gemini-3.8-flash、Claude Fable 5.1 等最新模型支援"
tldr: "Pydantic AI 2.38.0 三個重點：(1) 新增型別化 `CustomEvent`／`CapabilityEvent`，應用程式與 capability 都能把自訂事件送進 Agent 的 run event stream，再用 `@on_event` 訂閱，等於補上一層通用的可觀測性與擴充介面；(2) `RunContext` 新增 `context_window_used`，`ModelProfile` 新增 `context_window`，Agent 程式碼第一次能在執行中直接讀到「這個模型的上下文窗口還剩多少」；(3) 補上 `gemini-3.8-flash`、Claude Fable 5.1、Claude Mythos 5.1 等新模型與 `VLLMProvider`。本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-09-04-framework-pydantic-ai-2.38.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.38.0 |
| 前一版 | v2.37.0 |
| 發布日 | 2026-09-03 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.7k |

## 這個版本為什麼重要

上一版（2.36.0）Pydantic AI 把「哪些程式碼要能容錯重放」收攏成 `@durable_operation` 這個宣告式介面。這一版接著補上另一半：**執行期間怎麼往外送資料**。以前想觀察或擴充一個 Agent run，只能倚賴框架內建的固定事件類型（工具呼叫、模型回應片段等），應用程式碼自己想塞一個「這個 capability 現在進度到哪」或「這個工具呼叫要不要使用者確認」之類的自訂訊號，沒有正規管道。2.38.0 開放了 `CustomEvent` 和 `CapabilityEvent` 兩種型別化事件，應用程式與 capability 都能直接把資料丟進 run 的事件流，再用新的 `@on_event` 裝飾器訂閱——等於把 Agent 的可觀測性和擴充機制，從「框架決定你能看到什麼」變成「你自己決定要暴露什麼」。同一版也讓 Agent 第一次能在執行中直接讀出「這個模型的上下文窗口還剩多少」，對需要主動觸發壓縮或截斷的長任務 Agent 是新增的操作依據。

## 重要變更

- **型別化 `CustomEvent` 與 `CapabilityEvent`（`@on_event`）**：應用程式碼與 capability 都能把自訂事件送進 Agent 的 run event stream，再用 `@on_event` 訂閱處理 → 不用再繞道用工具呼叫或 side channel 傳遞執行期間的自訂訊號，事件本身是型別化的，訂閱端可以拿到完整結構而不是塞在字串裡的資訊
- **`ModelProfile.context_window` 與 `RunContext.context_window_used`**：Agent 程式碼可以在執行中查詢目前綁定模型的總上下文窗口大小，以及目前這次呼叫實際用掉多少 → 適合用來在容量快用完前主動觸發訊息壓縮、截斷歷史，或切換到更長窗口的模型，而不用自己維護一份 token 計算邏輯
- **新增 `gemini-3.8-flash`、Claude Fable 5.1（`claude-fable-5-1`）、Claude Mythos 5.1（`claude-mythos-5-1`）模型支援**：跟進主要模型商最新發布，`AnthropicModel`／`GoogleModel` 可以直接指定這些模型 id 使用
- **新增 `VLLMProvider`**：為自架 vLLM 推理伺服器提供專屬 provider，不需要再手動組 OpenAI-compatible 相容層來接
- **串流拒絕 flag（reject streams without `finish_reason`）**：新增 model profile 開關，讓某些串流回應缺少 `finish_reason` 時直接視為錯誤，而不是靜默當成正常結束 → 避免下游把「連線中斷」誤判成「模型正常說完了」

## Breaking Changes

本版本無 breaking changes。唯一的相容性調整（列在 Release Notes 的 Compatibility Notes 而非 Breaking Changes）：未命名的一次性（one-off）capability 現在會拿到預設 `id`，且重複註冊時採用統一的 combine 規則——只影響沒有明確指定 `id` 的 capability 寫法，官方判斷不構成破壞式變更。

直接升級即可，無需修改程式碼。

## 遷移指南

```bash
pip install --upgrade pydantic-ai==2.38.0
```

要用新的自訂事件機制，在 capability 或應用程式碼裡送出事件，並用 `@on_event` 訂閱：

```python
from pydantic_ai import Agent
from pydantic_ai.events import CustomEvent, on_event

agent = Agent("anthropic:claude-fable-5-1")

@on_event(CustomEvent)
async def handle_progress(event: CustomEvent, ctx):
    print(f"progress: {event.data}")

# 在 capability 或工具內部送出自訂事件
async def my_capability(ctx):
    ctx.emit(CustomEvent(data={"stage": "fetching"}))
```

要在執行中檢查上下文窗口用量：

```python
async def my_tool(ctx: RunContext) -> str:
    profile = ctx.model.profile
    used = ctx.context_window_used
    if profile.context_window and used / profile.context_window > 0.8:
        # 主動觸發壓縮或截斷歷史
        ...
```

## 與其他框架的對比觀察

這次的 `CustomEvent`／`CapabilityEvent` 延續了 2.36.0 `@durable_operation` 打開的方向：把「框架幫你決定好一切」換成「框架給你一組型別化的積木，你自己組裝」。放在 Pydantic AI 自己的脈絡裡看，這兩個版本合起來等於把 capability 系統從「容錯執行」擴展到「可觀測與可擴充」，兩層都用同一套宣告式風格處理，而不是各自長出一套獨立機制。

## 今日收穫

一開始以為「加一個自訂事件系統」只是給 Agent 多一個 debug 用的 hook，但對照 2.36.0 的 `@durable_operation` 一起看才發現，Pydantic AI 這半年其實是在系統性地把「Agent 執行期間會發生的各種副作用」——容錯重放、事件通知——都收斂成同一種宣告式擴充點的形狀，而不是每次遇到新需求就加一個獨立的回呼參數。框架的擴充性設計,有時候比單一功能更值得長期追蹤。

## 參考資料

- [Pydantic AI v2.38.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #6258 — Let application code and capabilities emit typed CustomEvents and CapabilityEvents](https://github.com/pydantic/pydantic-ai/pull/6258)
- [PR #4611 — Add context_window to ModelProfile and context_window_used to RunContext](https://github.com/pydantic/pydantic-ai/pull/4611)
- [PR #8021 — Add gemini-3.8-flash model](https://github.com/pydantic/pydantic-ai/pull/8021)
- [PR #7989 — Add Claude Fable 5.1 and Claude Mythos 5.1 support](https://github.com/pydantic/pydantic-ai/pull/7989)
- [PR #6153 — Add VLLMProvider for vLLM servers](https://github.com/pydantic/pydantic-ai/pull/6153)
- [框架更新｜Pydantic AI 2.36.0（上一篇追蹤：@durable_operation）](/posts/daily/2026-08-30-framework-pydantic-ai-2.36.0)
