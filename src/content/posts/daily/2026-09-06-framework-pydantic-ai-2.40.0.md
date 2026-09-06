---
title: "框架更新｜Pydantic AI 2.40.0"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.40.0 讓 RealtimeSession 補齊 barge-in（使用者打斷）、enqueue、respond 等控制原語，同時新增 `@agent.on_event` 把 2.38.0 的事件訂閱機制收斂到單一 Agent 實例"
tldr: "Pydantic AI 2.40.0 兩個重點：(1) RealtimeSession 補上 `handle_barge_in=True`、`interrupt(played_bytes=...)`、`played_audio_bytes`，讓語音 Agent 能正確處理「使用者講話打斷 AI」這個語音互動裡最難處理的場景，另外新增 `enqueue()`（外部程式碼插隊送出訊息）與 `respond=`（文字輪次是否觸發回覆）兩個 session 控制原語；(2) 新增 `@agent.on_event`，把 2.38.0 引入的全域 `@on_event` 訂閱機制收斂成綁在單一 Agent 實例上,多 Agent 併存的程式不用再自己判斷事件是哪個 Agent 送出的。本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 16
---

> 🌏 [English version](/en/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.40.0 |
| 前一版 | v2.39.0 |
| 發布日 | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.7k |

## 這個版本為什麼重要

Pydantic AI 這幾個版本一直在往「語音 Agent 框架」的方向補洞,這一版補的是最難的那塊:使用者打斷 AI 說話怎麼辦。文字聊天沒有這個問題——訊息是一輪一輪來的,但語音對話裡使用者隨時可能在 AI 還沒講完時開口,這時候該不該中止正在播放的音訊、要不要把已經播出去的內容算進對話歷史、被打斷的那句話該不該重新生成,是每個語音 Agent 都要處理、卻又各自土法煉鋼的問題。2.40.0 把這個場景收斂成官方支援的 `handle_barge_in=True` 開關,搭配 `interrupt(played_bytes=...)` 精確標記「使用者打斷時已經播了多少音訊」,框架自己去對齊對話歷史該截到哪裡。同一版也讓 `RealtimeSession` 補上 `enqueue()`(外部程式碼可以在 session 執行中插隊塞訊息)與 `respond=`(文字輪次要不要觸發模型回覆),這三個合起來,`RealtimeSession` 才算是有了完整的「誰在什麼時候該說話」的控制權,而不是只能被動等模型自己決定。

## 重要變更

- **`handle_barge_in=True` 與 `interrupt(played_bytes=...)`**：`RealtimeSession` 原生處理使用者打斷 AI 說話的場景,`played_audio_bytes` 記錄被打斷前實際播出的音訊量 → 語音 Agent 不用再自己土法煉鋼判斷「打斷時對話歷史該截到哪」,框架直接依實際播放量對齊
- **`RealtimeSession.enqueue()`**：讓驅動 session 的外部程式碼能插隊送出訊息,不用等目前輪次自然結束 → 適合語音 Agent 需要中途插入系統提示或狀態更新的場景
- **`RealtimeSession.send()` 新增 `respond=`**：明確控制一個文字輪次是否要觸發模型回覆,並把這個行為寫進文件 → 避免「送一則訊息卻不小心觸發了不想要的回覆」這類隱性行為
- **`@agent.on_event`**：把 2.38.0 引入的全域 `@on_event` 事件訂閱收斂成綁定單一 `Agent` 實例的版本 → 一個程式裡同時跑多個 Agent 時,事件處理常式不用再自己判斷「這個事件是哪個 Agent 送出的」
- **`infer_realtime_model` 新增 `provider_factory`**：可以自訂 realtime model 底層 provider 的建構方式,不受限於框架內建的預設 provider 邏輯
- **`pydantic_ai.prices.update_in_background()`**：讓模型價格表能在背景自動更新,不用每次升級套件才能拿到最新定價資料

## Breaking Changes

本版本無 breaking changes。

直接升級即可,無需修改程式碼。

## 遷移指南

```bash
pip install --upgrade pydantic-ai==2.40.0
```

要讓語音 Agent 正確處理使用者打斷:

```python
from pydantic_ai.realtime import RealtimeSession

session = RealtimeSession(model, handle_barge_in=True)

async def on_user_interrupt(played_audio_bytes: int):
    await session.interrupt(played_bytes=played_audio_bytes)
```

要把事件訂閱綁定到單一 Agent 實例,而不是全域訂閱:

```python
from pydantic_ai import Agent

agent = Agent("anthropic:claude-fable-5-1")

@agent.on_event(CustomEvent)
async def handle_progress(event, ctx):
    print(f"[{agent.name}] progress: {event.data}")
```

## 與其他框架的對比觀察

語音 Agent 的打斷處理,目前多數框架(包含 LangGraph、CrewAI)都還停留在「開發者自己接 WebRTC/語音串流服務,框架不管這段」的階段。Pydantic AI 把 barge-in 收進框架原生 API,等於把「語音互動的正確性」也納入框架自己的責任範圍,而不是丟給應用層各自處理——這跟它先前把型別安全、durable execution 收進框架核心是同一種設計哲學的延伸。

## 今日收穫

原本以為語音 Agent 的「打斷」只是「停止播放音訊」這麼簡單,看了 `interrupt(played_bytes=...)` 這個 API 才意識到,真正難的是「打斷之後,對話歷史該怎麼算」——AI 說到一半被打斷,那句沒說完的話到底算不算「AI 說過的內容」,直接影響下一輪模型看到的上下文是否準確。框架願意把這種細節收進原生 API,代表這已經是實務上踩過夠多次坑才會有的設計。

## 參考資料

- [Pydantic AI v2.40.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #7870 — Handle barge-in in the session: handle_barge_in=True, interrupt(played_bytes=...), and played_audio_bytes](https://github.com/pydantic/pydantic-ai/pull/7870)
- [PR #8109 — Add RealtimeSession.enqueue() for out-of-band prompts](https://github.com/pydantic/pydantic-ai/pull/8109)
- [PR #8110 — Add respond= to RealtimeSession.send()](https://github.com/pydantic/pydantic-ai/pull/8110)
- [PR #8101 — Add @agent.on_event for registering event listeners on an Agent](https://github.com/pydantic/pydantic-ai/pull/8101)
- [PR #8106 — Add provider_factory to infer_realtime_model](https://github.com/pydantic/pydantic-ai/pull/8106)
- [PR #4841 — Add pydantic_ai.prices.update_in_background()](https://github.com/pydantic/pydantic-ai/pull/4841)
- [框架更新｜Pydantic AI 2.38.0（上一篇追蹤：CustomEvent／CapabilityEvent）](/posts/daily/2026-09-04-framework-pydantic-ai-2.38.0)
