---
title: "Embedding Rivumi: SDK, ConversationController, and the WebSocket Boundary"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, sdk, websocket, conversation-runtime]
lang: en
tldr: "Rivumi exposes bounded-run and conversation contracts through a typed 0.x SDK facade. WebSocket attach wraps one prebuilt, controller-owned runtime session rather than providing conversation-ID resume or multi-client routing."
description: "Trace Rivumi from its SDK facade and ConversationRuntimeSession through ConversationController and the turn, event, approval, cancellation, and lifecycle boundaries of loopback WebSocket attach."
series:
  name: "Rivumi Architecture Notes"
  order: 17
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-sdk-conversation-websocket)

The [previous article](/posts/tech/2026-08-30-rivumi-subagent-scheduling-en) kept modification authority with the parent. When another Python application or editor needs to operate [Rivumi](https://github.com/vincentxuu/rivumi), another ownership question appears: what does the SDK promise, what lifecycle does the controller own, and what does the WebSocket actually attach to?

## The SDK is the designated facade, not a 1.0 promise

`rivumi.sdk` is the consolidated import surface for embedding code. It exports typed task, runtime-event, attachment, IDE, MCP, skill, subagent, and replay helpers without importing the CLI, TUI, or provider adapter internals. `run_task()` is a thin wrapper for one bounded `AgentRunner`; multi-turn sessions use the separate conversation runtime contracts.

Although the documentation calls it a stable facade, the code explicitly sets `SDK_STABILITY` to a 0.x contract that may change before 1.0. Callers receive a deliberate entry point, not a frozen compatibility guarantee for every current type.

## A controller owns one live session

`ConversationRuntimeSession` reduces external runtimes to the same operations: start, send a turn, iterate events, respond to approval, interrupt, compact, and close. Its events form a discriminated union covering text deltas, tool lifecycle, approvals, context telemetry, and terminal turns.

`ConversationController` wraps one session, starts it lazily, and uses a turn lock so one conversation has only one active turn. Multiple controllers may share `BackendTurnLimiter` to bound active backend turns. Once a turn sends text, the controller accepts only events with the same turn ID. An early-ended stream or cross-turn event fails closed with a protocol error.

```text
embedding host
  -> ConversationController
  -> one ConversationRuntimeSession
  -> send_turn
  -> typed events / correlated approval
  -> terminal RunResult
```

An approval callback must return one of the runtime-advertised decisions before the controller forwards it. A Python caller can also invoke `request_cancel()` on `ConversationTurnHandle`. The controller interrupts the runtime, waits for a bounded grace period, and closes the session if no terminal event arrives.

## Context is one-shot, and attachments do not grant file reads

An embedding application may queue `RuntimeInjectedContext`. One call accepts at most 16 items, with at most 64 pending. The next turn drains that queue once and labels it untrusted app-server context.

A turn may also carry up to 16 attachments. Each has exactly one inline-content payload or URI reference. A URI is rendered as a file reference; Rivumi does not read an arbitrary host file merely because the client sent `file:///...`. Supplying attachment metadata therefore does not become filesystem authority.

## WebSocket attach is a single prebuilt-session bridge

`ConversationWebSocketApp` exposes the same controller as a pure ASGI endpoint. Clients may send `turn`, `inject_items`, typed `ide_context`, and correlated `approval` messages. The server returns typed events, results, or errors. `rivumi conversation-server` creates one native runtime session at startup, mounts `/v1/conversation/attach` by default, and allows loopback hosts only.

The endpoint accepts no conversation ID, resume cursor, store selector, or session factory. It also defines no WebSocket cancellation message; cancellation currently belongs to the Python embedding path. The [order 12 ConversationStore](/posts/tech/2026-08-23-rivumi-state-first-event-journaling-en) remains a separate persistence subsystem rather than part of this endpoint.

When a connection ends, the ASGI app closes its shared controller in `finally`. This is a connection-owned bridge around one prebuilt session, not a multi-client session router or durable conversation-ID attach service. The repository smoke test exercises real uvicorn and WebSocket transport with a fake session. Its own documentation still lists a real native-runtime attach run as an external validation gap.

The boundary is concrete: the SDK supplies typed contracts, the controller owns turn and session lifecycle, and WebSocket is only one transport. The [next article](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge-en) brings editor diagnostics and open-file state into this context path without presenting it as a complete IDE RPC protocol.

---

## References

- [SDK facade](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/sdk.py)
- [Conversation runtime contracts](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_runtime.py)
- [ConversationController lifecycle](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_controller.py)
- [ASGI WebSocket attach bridge](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/conversation_websocket.py)
- [SDK documentation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/docs/sdk.md)
- [Conversation controller and WebSocket tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
