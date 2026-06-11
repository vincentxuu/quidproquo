---
title: "Codex App Server: How OpenAI Turned an Agent Harness into a Universal Protocol"
date: 2026-04-21
type: guide
category: ai
tags: [codex, app-server, json-rpc, agent-harness, openai, harness-engineering]
lang: en
tldr: "OpenAI wrapped the Codex harness as a JSON-RPC over stdio App Server, enabling VS Code, JetBrains, Web, and desktop apps to share a single agent loop. Three core primitives: Item, Turn, and Thread."
description: "An introduction to the design of OpenAI's Codex App Server: why JSON-RPC over stdio was chosen, what the three conversation primitives (Item/Turn/Thread) are, how the approval flow works, and the tradeoffs among Local, Web, and TUI integration modes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-21-openai-codex-app-server)

OpenAI engineer Celia Chen published an article in February 2026 introducing the Codex App Server, explaining how they transformed the Codex agent harness from a TUI-specific implementation into a universal protocol shared across IDEs, Web, and desktop apps. This post distills the architectural decisions, the three conversation primitives, and the tradeoffs of different integration modes — useful reading for engineers interested in agent harness design.

---

## Why an App Server Was Needed

Codex CLI started as a TUI (terminal UI), with the entire agent loop running in a single process. The problem arose when the VS Code extension needed to be added — it had to share the same harness, including conversation history management, config and auth, tool execution, and sandbox — but each client couldn't re-implement all of that from scratch.

The first attempt was wrapping Codex core as an MCP server. MCP was originally designed to let a host call external tools. Reversing it — having the IDE act as host and Codex as server — was technically feasible but semantically awkward and hard to maintain. The Codex agent loop isn't just "a tool being called"; it has its own conversation lifecycle, approval workflows, and asynchronous event pushing, none of which fit well into MCP's request-response framework.

The final choice was **JSON-RPC over stdio**, built as a standalone App Server. This decision enabled bidirectional communication (the server can proactively push events to the client), kept the protocol simple, made cross-language integration easy, and fully encapsulated the Codex core details on the server side.

---

## What Codex Core Contains

The App Server's job is to translate external requests for Codex core, so understanding the core's scope is important. Codex core handles three things:

**Thread lifecycle & persistence**: Conversation history is preserved across sessions. A thread can be paused at any point and later resumed from the same state, or forked into a new branch.

**Config & auth**: Including authentication mechanisms like Sign in with ChatGPT, along with various per-thread and global settings.

**Tool execution & extensions**: A sandbox-isolated tool execution environment, plus extension mechanisms for MCP servers and skills.

The App Server itself is composed of four components: the stdio reader (handling IO), the Codex message processor (translating between JSON-RPC and core events), the thread manager (managing the lifecycle of all threads), and core threads (each thread running its own core session).

---

## Three Conversation Primitives

The App Server defines three primitives that form the backbone of the entire protocol.

### Item: The Smallest Event Unit

An Item is the finest-grained fragment of a conversation. Each item has its own lifecycle: `started` → `delta` (possibly multiple, used for streaming) → `completed`.

Item types include:
- **user message**: The user's input
- **agent message**: The model's response, with streaming support
- **tool execution**: Records of agent tool calls (including inputs and outputs)
- **approval request**: Actions requiring user confirmation
- **diff**: File change content

This design allows clients to perform granular UI updates — instead of waiting for an entire response to complete, each delta event can be immediately reflected in the interface.

### Turn: A Complete Work Cycle

A Turn represents the complete cycle from a user input to the agent finishing all corresponding work. A single turn can contain multiple items: the agent might call several tools first, then produce a final text response.

The Turn is the unit of granularity for the approval flow — the server can pause mid-turn and wait for the user's response before continuing.

### Thread: A Persistent Conversation Container

A Thread is the highest-level unit. A thread contains multiple turns and represents a complete conversation history. Threads support four operations:

- **create**: Start a new conversation
- **resume**: Continue from where it was last interrupted
- **fork**: Branch a new conversation from a historical state
- **archive**: Seal a thread that is no longer in use

The persistent design of threads is especially meaningful for web integration — even if the user closes a browser tab, the server-side thread state still exists and can be seamlessly continued the next time the user opens it.

---

## Initialize Handshake and Approval Flow

Two design details of the App Server deserve special attention.

**Initialize handshake**: After a client connects to the server, it must first send an `initialize` request. The server returns metadata such as userAgent and available capabilities, and only then can normal conversation flow begin. This mechanism lets different versions of server and client negotiate capabilities, avoiding version incompatibility issues.

**Approval flow**: Certain tool executions require user confirmation (e.g., deleting files, running dangerous commands). The App Server design has the server proactively send an approval request to the client. The turn's execution is paused, waiting for the client to return `allow` or `deny` before continuing. This flow reverses the typical request-response direction — the server sends a request to the client — and this is one of the key reasons for choosing a bidirectional communication protocol.

---

## Three Integration Modes

The App Server design allows different client types to integrate in different ways.

**Local / IDE integration** (VS Code, JetBrains): The App Server binary is bundled into the extension, communicating via bidirectional stdio. The server runs locally, with state stored on the local machine. This is the lowest-latency integration approach and is best suited for scenarios that require direct access to the local file system.

**Web integration**: The App Server runs in a container, with state entirely on the server side. When a user closes a tab, the thread doesn't stop — they can continue where they left off next time. This is suitable for long-running tasks that don't need local tool permissions.

**TUI integration**: Currently, the Codex CLI TUI still calls Rust core types directly, bypassing the App Server. OpenAI's plan is to refactor the TUI in the future to communicate through the App Server as well, so all clients use the same protocol, reducing duplicate maintenance costs.

---

## Choosing an Integration Approach

The article also outlines four integration options of varying depth, from heaviest to lightest:

1. **App Server**: A complete agent harness with thread management, approval flow, and streaming
2. **Codex as MCP server**: Wraps Codex as a tool, suitable for systems that already have their own agent loop
3. **Codex Exec**: For CI/CD environments, one-shot execution, no interaction needed
4. **Codex SDK (TypeScript)**: The lightest weight, called directly in code, suitable for scenarios requiring high customization

The tradeoffs across these four layers are clear: the higher you go, the more out-of-the-box harness functionality you get; the lower you go, the more control you retain.

---

## Overall Takeaways

The core tradeoff of the Codex App Server is: accepting the maintenance cost of a standard protocol in exchange for the reliability of multiple clients sharing a single harness. JSON-RPC over stdio isn't the most fashionable choice, but it solves concrete engineering problems — bidirectional communication makes the approval flow viable, the protocol's simplicity makes cross-language integration easy, and encapsulating core logic on the server side prevents behavioral inconsistencies that arise when each client implements its own version.

The three-layer structure of Item / Turn / Thread is also worth noting. It's not just an API specification — it's an explicit model of the nature of "agent conversations": events have lifecycles, work has boundaries, and conversations have persistent state. This kind of clear primitive design means client implementers don't need to guess at server behavior, and future feature extensions have a clear place to hook in.

---

## References

- [Unlocking the Codex harness: how we built the App Server](https://openai.com/index/unlocking-the-codex-harness/) — Celia Chen, OpenAI, February 2026, original source for this article
- [Codex CLI](https://github.com/openai/codex) — OpenAI Codex CLI GitHub repository
- [Model Context Protocol](https://modelcontextprotocol.io/introduction) — MCP specification, the alternative approach discussed in the article
- [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) — Background context on Harness Engineering
- [Anthropic Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic's perspective on harness design, for comparison with this article
