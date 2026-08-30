---
title: "Rivumi 的 context pressure、compaction 與 workspace reinjection"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, context-window, compaction, checkpoint]
lang: zh-TW
tldr: "Rivumi 在 85% context pressure 附近啟動兩種不同流程：native loop 可做一次 bounded deterministic summary fallback；支援原生 compaction 的 conversation runtime 則在完成 turn 後壓縮並回報 lifecycle。兩條路徑都會在下一次請求重新注入 workspace snapshot。"
description: "區分 Rivumi native-loop summary fallback 與 conversation runtime compaction，追蹤 high watermark、hooks、checkpoint coherence 與 post-compaction workspace reminder。"
series:
  name: "Rivumi 架構拆解"
  order: 13
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-context-compaction-en)

[上一篇](/posts/tech/2026-08-23-rivumi-state-first-event-journaling)說明 run state 如何保存。長 session 還有另一種壓力：messages 與 tool observations 逐步吃掉 context。Rivumi 對這件事有兩條路徑；把它們都叫「自動摘要」會漏掉關鍵差異。

## 先分清兩種 85%

conversation runtime 收到 provider telemetry，且 capability 明確宣告 `native_compaction=True` 時，`should_auto_compact_context()` 才能拿 total tokens 除以已知 context window；比例達 85%，TUI 會在一個 completed turn 後請 runtime compact。

Native `AgentRunner` 沒有使用這個 provider context-window contract。它看的是 task 設定的 `max_total_tokens`；使用量達 85% 時，先送一次 context-pressure reminder，並在歷史夠長時啟動自己的 summary fallback。兩個分母不同，一個是 runtime 回報的 context window，一個是任務 token cap。

## Native loop：有界、一次、lossy

fallback 只做一次。預設保護最前面兩個 messages、保留最近四個，兩者之間至少有兩筆舊內容才壓縮。若切點落在 tool observation 前，Rivumi 會延伸範圍，避免把 tool call 與 observation 拆開。

pre-compact hook 可以 deny；通過後，`build_history_summary_fallback_message()` 逐筆產生 bounded deterministic 摘要，每個欄位與總長度都有上限。這個步驟不會再呼叫模型撰寫語意摘要，只把角色、tool 狀態與截短 preview 排成一則 injected context。內容明確提醒這是 lossy reminder，真正編輯前應以目前 repository state 與保留的 tool output 為準。完成後再跑 post-compact hook，並寫 event。

## Conversation runtime：native lifecycle 或 local checkpoint

`ConversationController.compact_context()` 先取得 turn lock。runtime 支援原生 compaction 時，controller 執行 pre hook、呼叫 session 的 compact API，接著持續讀 event stream，直到收到同一 context 的 `CompactionCompletedEvent` 才執行 post hook。

runtime 不支援原生 compaction 時，controller 可以建立 local conversation compaction checkpoint。`ContextCheckpoint` 將 summary source turn IDs 與 retained turn IDs 分開，兩組不能重疊；telemetry after 也不能比 before 佔更多 context。另一方面，Codex 原生 compaction 目前可能只回 lifecycle、不附 Rivumi checkpoint。Rivumi 不會為了填欄位捏造 checkpoint。

## 壓縮後要重新錨定 workspace

摘要保住了對話，不保證模型還記得此刻 workspace。Native fallback 之後，下一次 request 會注入一次 bounded reminder，內容包含 changed files、上次 check status、recent important paths 與 allowed paths／verification／remaining steps／token limit 等 constraints。

TUI 收到原生 compaction completed event 後也會設 pending marker。下一個使用者 request 送出前，它查 changed paths，附上 runtime、mode、permission 與 isolated workspace 說明，再清掉 marker。提醒是 one-shot，resume 也會辨識既有 marker，避免重複塞入。

```text
context pressure
  ├─ native AgentRunner → deterministic fallback → workspace reminder
  └─ conversation runtime → native/local compaction lifecycle
                                      └──────────→ next-turn reminder
```

這套設計接受 context 無法無限延伸。資訊損失發生後，它把 repository state、檢查結果與執行限制重新放回決策面。[下一篇](/posts/tech/2026-08-30-rivumi-native-mcp-authorization)進入 native MCP transport 與 authorization。

---

## 參考資料

- [context runtime semantics](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/runtime_semantics.py)
- [native-loop compaction flow](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [conversation controller](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_controller.py)
- [prompt reminders](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/prompts.py)
- [context semantics tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_runtime_semantics.py)
