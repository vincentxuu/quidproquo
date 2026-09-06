---
title: "框架更新｜Pydantic AI v2.40.0"
date: 2026-09-06
category: daily
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.40 新增 @agent.on_event 事件監聽器與即時語音 barge-in 處理，強化 Agent 可觀測性與語音互動體驗"
tldr: "Pydantic AI v2.40.0 三大變更：(1) @agent.on_event 裝飾器讓 Agent 具備原生事件監聽能力；(2) 即時語音 session 支援 barge-in 中斷處理；(3) RealtimeSession.enqueue() 允許外部程式碼注入即時提示。無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 16
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.40.0 |
| 前一版 | v2.39.0 |
| 發布日 | 2026-09-05 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19,742 |

## 這個版本為什麼重要

Pydantic AI 在語音 Agent 的即時互動體驗上跨了一大步。之前做語音 Agent 時，使用者打斷 AI 說話（barge-in）的處理要自己接——偵測中斷、計算已播放位元組、通知模型停止，全是手工活。v2.40.0 把這套邏輯內建到 session 層級，一個 `handle_barge_in=True` 搞定。同時 `@agent.on_event` 裝飾器讓 Agent 有了原生事件監聽能力，對 logging、計費、即時 UI 更新這類橫切關注點不用再 monkey-patch。

## 重要變更

- **`@agent.on_event` 事件監聽裝飾器**：在 Agent 上註冊事件 callback，涵蓋 tool call、token streaming、完成等事件 → 不用再攔截內部 hook，計費和 observability 邏輯直接掛在 Agent 上
- **即時語音 barge-in 處理**：`handle_barge_in=True` + `interrupt(played_bytes=...)` + `played_audio_bytes` 屬性 → 使用者打斷 AI 說話時自動處理中斷、回報已播放進度，不用自己寫中斷偵測邏輯
- **`RealtimeSession.enqueue()`**：允許驅動 session 的外部程式碼注入 out-of-band 提示 → 可以在語音對話中途從後端推送指令（例如客服系統推送優惠碼提示）
- **`respond=` 參數**：`RealtimeSession.send(respond=True/False)` 控制文字訊息是否要求模型回覆 → 精確控制多輪語音對話的節奏
- **`provider_factory` for `infer_realtime_model`**：自訂 provider 工廠函式 → 更靈活的即時模型初始化
- **`prices.update_in_background()`**：背景更新模型價格資料 → 長時間運行的 Agent 不用重啟就能追蹤最新定價

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼。

```bash
pip install --upgrade pydantic-ai==2.40.0
```

新功能使用範例：

```python
from pydantic_ai import Agent

agent = Agent("openai:gpt-4o")

@agent.on_event
async def log_events(event):
    print(f"Agent event: {event.type}")

result = await agent.run("Hello")
```

## 與其他框架的對比觀察

Pydantic AI 在即時語音方面持續拉開差距。目前追蹤的 12 個 Agent 框架中，只有 Pydantic AI 在框架層級原生支援 barge-in 和即時音訊串流控制——其他框架（LangGraph、CrewAI、Mastra）若要做語音 Agent，仍然要自己接 WebSocket 和音訊處理。`@agent.on_event` 則是把 LangChain 系生態早就有的 callback 機制用更 Pythonic 的方式帶進來。

## 今日收穫

之前以為語音 Agent 的 barge-in 處理只是「偵測到使用者說話就停止」這麼簡單，看到 Pydantic AI 的實作才發現還需要追蹤已播放位元組數——模型需要知道「使用者在聽到哪裡時打斷的」才能維持對話連貫性，這是音訊串流特有的狀態管理問題。

## 參考資料

- [Pydantic AI v2.40.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #7870: Handle barge-in in the session](https://github.com/pydantic/pydantic-ai/pull/7870)
- [PR #8101: Add @agent.on_event](https://github.com/pydantic/pydantic-ai/pull/8101)
- [PR #8109: Add RealtimeSession.enqueue()](https://github.com/pydantic/pydantic-ai/pull/8109)
