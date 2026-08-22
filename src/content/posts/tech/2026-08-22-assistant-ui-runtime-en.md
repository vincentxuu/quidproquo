---
title: "assistant-ui Explained: Runtime and Primitives for Backend-Portable Agent Chat"
date: 2026-08-22
category: tech
type: deep-dive
tags: [assistant-ui, agent-ui, react, generative-ui, ai-agent]
lang: en
tldr: "assistant-ui separates Agent Chat into headless React primitives, a conversation runtime, and backend adapters, so the UI does not have to bind directly to one model SDK's message state."
description: "A guide to assistant-ui's Thread, Message, and Composer primitives, runtime ownership, backend adapters, tool UI, and thread persistence."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-assistant-ui-runtime)

[assistant-ui](https://www.assistant-ui.com/docs) is a component and state layer for React Agent Chat. It decomposes the interface into Thread, Message, Composer, ActionBar, and other primitives, then uses a Runtime to connect them to AI SDK, LangGraph, AG-UI, A2A, or a custom backend.

It does not primarily solve model invocation. It solves the full conversation behavior after output starts streaming: message parts, tool calls, retry, editing, branching, attachments, thread switching, and persistence. When those behaviors grow directly around one SDK's `useChat()`, changing the backend or adding agent events often requires a broad rewrite.

This article follows ownership boundaries: primitives render, Runtime owns or adapts conversation state, adapters and protocols connect the backend, and a database or Assistant Cloud persists history. Documentation and APIs were checked on **2026-08-22**. Official runtime pages distinguish several SDK generations and unstable APIs, so pin versions during adoption.

## Four layers with separate owners

The [official architecture](https://www.assistant-ui.com/docs/architecture) separates UI, Runtime, backend or agent, and persistence:

```text
Thread / Message / Composer primitives
                 │
                 ▼
       AssistantRuntimeProvider
        message + run + thread state
                 │ adapter / protocol
                 ▼
 AI SDK / LangGraph / AG-UI / custom backend
                 │
                 └── database or Assistant Cloud
```

UI components do not fetch the model directly or independently store the full conversation. They read state and issue commands through the nearest Runtime context. Runtime decides who owns messages, streaming lifecycle, editing, regeneration, and threads. An adapter translates backend-specific events into that interface.

This separation lets styling and backend evolve independently. It also means debugging starts by identifying whether a fault lives in rendering, runtime state, adapter conversion, or the backend event stream. If a team will not maintain those boundaries, the abstraction can make a simple chat harder to trace.

## Primitives compose behavior, not only markup

[Headless Primitives](https://www.assistant-ui.com/docs/primitives) follow a Radix-like structure. A `Root` provides context; child parts handle input, submission, scrolling, keyboard behavior, and streaming state. `asChild` applies primitive behavior to your own element.

```tsx
import { ComposerPrimitive } from "@assistant-ui/react";

export function Composer() {
  return (
    <ComposerPrimitive.Root>
      <ComposerPrimitive.Input placeholder="Ask anything…" />
      <ComposerPrimitive.Send>Send</ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}
```

A prebuilt Thread is useful for starting quickly. Primitives fit products with an existing design system, custom message layouts, floating composers, or inline editing. Unlike pure copy-in components, you control DOM and styling while behavior still depends on the assistant-ui Runtime contract.

## Runtime is the central choice

[Picking a runtime](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime) gives a practical decision tree. Existing AI SDK, LangGraph, AG-UI, or A2A backends use their adapters. A simple custom API can use LocalRuntime. Messages already owned by Redux, Zustand, or another store fit ExternalStoreRuntime. A backend streaming complete agent-state snapshots fits AssistantTransport.

Runtime is more than transport. It determines message normalization, run state, composer behavior, thread navigation, branching, editing, and reload. Choosing components first and forcing in a runtime later usually confuses ownership. Ask where the single source of truth for messages lives, choose Runtime second, and compose UI last.

If the backend already speaks an AI SDK streaming protocol, the frontend should not invent a second message reducer. If an agent session owns the thread, an adapter should replay its event log instead of pretending LocalRuntime owns all state.

## Tool UI has several trust models

[assistant-ui Tools](https://www.assistant-ui.com/docs/tools) groups tool schema, execution location, and renderer into a toolkit. A known tool can render loading, result, error, and approval states. Frontend tools execute in the browser, backend tools remain on the server, and human tools wait for user input.

The documentation distinguishes several generative-UI patterns: a known tool call rendered by a custom component, an interactable edited by model and user, a component tree composed from an allowlist, and UI pushed by a LangGraph node. They do not share the same trust model merely because all of them display generated UI.

A renderer is never authorization. Deleting data, paying, or sending messages must be re-authorized on the backend against the current user, arguments, and resource state. Letting a model choose a card is acceptable; letting a browser tool bypass server permissions is not.

## Threads and persistence do not belong in presentation

Thread UX includes creation, switching, archive, deletion, message editing, branching, and regeneration. Runtime coordinates those operations, while [Assistant Cloud](https://www.assistant-ui.com/docs/cloud) or custom database adapters can own persistence.

Production design must define thread IDs, user and organization scope, ordering, attachment storage, deletion semantics, and permission revocation. Shipping a localStorage demo creates trouble across devices, organizations, and compliance deletion. A UI capable of listing threads does not prove the data layer isolates them safely.

## Where it sits among adjacent choices

| Option | Organizing spine | Best fit |
|---|---|---|
| assistant-ui | primitives → runtime → adapter → thread | Chat UX and backend portability are central |
| [CopilotKit](/posts/tech/2026-08-22-copilotkit-agent-ui-en) | Application state, agent tools, and HITL | Agents deeply operate an existing product UI |
| [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en) | shadcn copy-in components and AI SDK message parts | You already use AI SDK and want source-owned components |
| [A2UI](/posts/ai/2026-05-23-a2ui-agent-to-ui-protocol-en) | Declarative cross-client UI protocol | One agent UI description must cross renderers |

assistant-ui does not make backend replacement free. Backends expose different tool events, agent state, interrupts, and attachments. Adapters unify the shared surface while backend-specific capabilities still appear. The library provides deliberate replacement points; it does not erase differences.

## The trade-off

assistant-ui fits teams treating Agent Chat as a production interface: complete thread behavior, tool UI, attachments, and backend portability without rebuilding accessibility, auto-scroll, and streaming state from scratch.

Adopt Runtime before styling. Prove one thread, one message stream, and one tool, including edit, cancel, retry, errors, and persistence ownership. Then map it into the design system. If the product only needs one small question-and-answer box and the backend will remain fixed, the existing SDK's chat hook may be simpler.

## References

- [assistant-ui Documentation](https://www.assistant-ui.com/docs)
- [assistant-ui Architecture](https://www.assistant-ui.com/docs/architecture)
- [Headless Chat Primitives](https://www.assistant-ui.com/docs/primitives)
- [Picking a Runtime](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime)
- [Runtime Architecture](https://www.assistant-ui.com/docs/runtimes/concepts/architecture)
- [assistant-ui Tools](https://www.assistant-ui.com/docs/tools)
- [Assistant Cloud](https://www.assistant-ui.com/docs/cloud)
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui)
