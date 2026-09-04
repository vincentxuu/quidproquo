---
title: "Embedding Looplane：SDK、ConversationController 與 WebSocket Boundary"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, sdk, websocket, conversation-runtime]
lang: zh-TW
tldr: "Looplane 用 0.x typed SDK facade 暴露 bounded run 與 conversation contracts；WebSocket attach 只包住一個預先建立、由 controller 擁有的 runtime session，沒有 conversation-ID resume 或多 client routing。"
description: "追蹤 Looplane 從 SDK facade、ConversationRuntimeSession、ConversationController，到 loopback WebSocket attach 的 turn、event、approval、cancel 與 lifecycle 邊界。"
series:
  name: "Looplane 架構拆解"
  order: 17
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-looplane-sdk-conversation-websocket-en)

[上一篇](/posts/tech/2026-08-30-looplane-subagent-scheduling)把修改權留給 parent。另一個 Python app 或 editor 想操作 [Looplane](https://github.com/vincentxuu/looplane) 時，還有一層 ownership 要先分清楚。SDK 提供哪些 contract、controller 擁有哪一段 lifecycle，WebSocket 又到底 attach 到什麼？

## SDK 是指定入口，還不是 1.0 承諾

`looplane.sdk` 是 embedding code 的集中 import surface。它輸出 typed task、runtime event、attachment、IDE、MCP、skill、subagent 與 replay helpers，刻意不把 CLI、TUI 或 provider adapter internals 拉進來。`run_task()` 只是建立一次 bounded `AgentRunner` 的薄包裝；需要多 turn session 時，走的是另一套 conversation runtime contracts。

名稱裡雖然有「stable facade」，程式也直接標明 `SDK_STABILITY = "0.x: ... may change before 1.0."`。這表示呼叫端有一個明確入口，不表示今天的每個型別已獲得 1.0 相容性保證。

## Controller 擁有一個 live session

`ConversationRuntimeSession` 把不同外部 runtime 收斂成同一組操作：start、send turn、讀 event stream、回覆 approval、interrupt、compact 與 close。事件是 discriminated union，包含 text delta、tool lifecycle、approval、context telemetry 與 terminal turn。

`ConversationController` 包住一個 session，lazy start，並用 turn lock 確保同一個 conversation 一次只跑一個 active turn。多個 controllers 可以共享 `BackendTurnLimiter`，限制後端同時處理的 turns。每個 turn 送出文字後，只接受相同 turn ID 的 events；串流提前結束或混入另一個 turn，會以 protocol error fail closed。

```text
embedding host
  -> ConversationController
  -> one ConversationRuntimeSession
  -> send_turn
  -> typed events / correlated approval
  -> terminal RunResult
```

Approval callback 回傳的 decision 必須在 runtime 宣告的 choices 裡，controller 才會送回去。Python caller 也能對 `ConversationTurnHandle` 呼叫 `request_cancel()`；controller 會 interrupt，等待有上限的 grace period，runtime 沒回 terminal event 就關閉 session。

## Context 只使用一次，attachment 不代讀檔案

Embedding app 可排入 `RuntimeInjectedContext`。Controller 每次接受最多 16 筆，pending queue 上限 64 筆；下一個 turn 產生 request 時一次 drain，並標成不受信任的 app-server context。

每個 turn 也能帶最多 16 個 attachments。每筆只能二選一：inline content 或 URI reference。URI 會以 file reference 文字交給 runtime，Looplane 不會因為 client 傳了 `file:///...` 就替它讀 host 上的任意檔案。這條界線避免「提供附件 metadata」悄悄升級成 filesystem authority。

## WebSocket attach 是單一預建 session bridge

`ConversationWebSocketApp` 把同一個 controller 包成 pure ASGI endpoint。Client 可送 `turn`、`inject_items`、typed `ide_context`，並在 runtime 要求時送 correlated `approval`；server 回傳 typed events、result 或 error。CLI 的 `looplane conversation-server` 在啟動時建立一個 native runtime session，預設掛在 `/v1/conversation/attach`，而且只允許 loopback host。

這個 endpoint 沒有 conversation ID、resume cursor、store selector 或 session factory。它也沒有 WebSocket `cancel` message；cancel handle 目前是 Python embedding path 的能力。[Order 12 的 ConversationStore](/posts/tech/2026-08-23-looplane-state-first-event-journaling)仍是另一個 persistence subsystem，沒有接進這條 attach endpoint。

連線結束時，ASGI app 的 `finally` 會關閉 shared controller。於是這是「一個 connection 擁有一個預建 session」的橋，不是多 client session router，更不能說成斷線後拿 conversation ID 隨時 attach。Repository smoke test 用 fake session 驗證真實 uvicorn/WebSocket transport；真正 native runtime 的端到端 attach 仍是文件列出的外部驗證缺口。

Embedding boundary 到這裡很具體：SDK 給 typed contracts，controller 擁有 turn 與 session lifecycle，WebSocket 只是其中一種輸送方式。[下一篇](/posts/tech/2026-08-30-looplane-ide-lsp-vscode-bridge)會把 editor diagnostics 與 open-file state 接進這條 context 路徑，同時確認它沒有變成完整 IDE RPC。

---

## 參考資料

- [SDK facade](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/sdk.py)
- [Conversation runtime contracts](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/conversation_runtime.py)
- [ConversationController lifecycle](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/conversation_controller.py)
- [ASGI WebSocket attach bridge](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/conversation_websocket.py)
- [SDK documentation](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/docs/sdk.md)
- [Conversation controller and WebSocket tests](https://github.com/vincentxuu/looplane/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
