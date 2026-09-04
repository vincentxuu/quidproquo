---
title: "Learning from Mature Coding Agents (16): Runtime Abstraction and Capability Handshake"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 16
tags: [coding-agent, harness-engineering, runtime-abstraction, capability-handshake, acp, app-server-protocol]
lang: en
description: "Comparing the machine interfaces of Pi, OMP, OpenCode, Codex, and Claude Code, and how looplane's M13 uses a narrow ConversationRuntimeSession boundary plus an honest capability matrix to support multiple external CLIs without pretending they are the same."
tldr: "Five external CLIs expose five different machine interfaces: JSONL event streams, JSON-RPC handshake, HTTP API, ACP, stream-json. The right way to support them is not one interface that pretends they're identical — it's a narrow runtime boundary plus an honest capability matrix. Availability means installed, not authenticated; protocol drift fails closed."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-runtime-capability-handshake)

## The Design Problem

looplane has two modes: native mode owns its own agent loop, and external mode delegates a whole task to a user-installed CLI — Claude Code, Codex CLI, OpenCode, Pi, or OMP. M13 asks: how do you bring in the third, fourth, and fifth CLI without copy-pasting the Claude/Codex-specific code three times?

The trap is obvious: build a universal `CodingCliAdapter` interface that declares everyone has streaming, approvals, resume, and usage — then quietly lie at the edges. OpenCode has no interactive approval that survives a headless boundary; OMP is a Pi fork with no guarantee of staying in sync; Codex negotiates capabilities through a handshake. Fake uniformity ends with an approve button that does nothing.

So looplane's answer is two things: a narrow runtime boundary (`ConversationRuntimeSession`) and a capability matrix that each adapter declares honestly and the UI must respect.

## What the Five Projects Expose

**Pi** ships three layers of machine interface. One-shot tasks use `--mode json`, serializing internal session events as JSONL. Embedding uses RPC mode: JSON commands on stdin, events and responses on stdout, with a command set covering prompt, abort, set_model, compact, fork, and more (pi-mono/packages/coding-agent/src/modes/rpc/rpc-types.ts#RpcCommand). Events are slimmed before emission — cumulative streaming snapshots are stripped so only deltas and the final authoritative message cross the wire (pi-mono/packages/coding-agent/src/modes/json-event.ts#toJsonEvent). Below that sits a versioned CBOR framing protocol with length prefixes and frame limits (pi-mono/packages/protocol/src/schemas.ts#PROTOCOL_VERSION).

**OMP** is a Pi fork whose headless surface is nearly isomorphic: `omp --mode json` speaks the same event vocabulary. Its collab wire types say it out loud — unknown variants arrive as plain JSON and every client switch keeps a tolerant default branch (oh-my-pi/packages/wire/src/index.ts#TextContent). "Share the normalizer with upstream, but keep a separate adapter ready to diverge" is the correct defense for a fork.

**OpenCode** is the most standardized: an HTTP server with generated openapi.json (opencode/packages/server/src/routes.ts#createRoutes), an official SDK, and a full [ACP](https://agentclientprotocol.com/) implementation — initialize, authenticate, newSession, loadSession, resumeSession, forkSession, setSessionMode, setSessionModel are all wired up (opencode/packages/opencode/src/acp/agent.ts#Agent). It is the only one of the five that exposes resume and model switching as protocol methods.

**Codex CLI** uses app-server-protocol: an `initialize` handshake where the client sends ClientInfo and `InitializeCapabilities` — explicitly opting into experimental methods and naming which notifications to suppress (codex/codex-rs/app-server-protocol/src/protocol/v1.rs#InitializeCapabilities). Only then come thread/start, thread/resume, and even capability queries like modelProvider/capabilities/read (codex/codex-rs/app-server-protocol/src/protocol/common.rs#ClientRequest). Capabilities here are negotiated, not claimed.

**Claude Code**'s headless surface is a `--output-format stream-json` JSONL feed plus an SDK-side permission callback (claude-code-source/src/cli/print.ts#runHeadless). Interactive approval exists, but its shape matches nobody else's.

Line them up: JSONL event streams ×2 (Pi/OMP), JSON-RPC handshake (Codex), HTTP+ACP (OpenCode), stream-json (Claude Code). No two agree on the semantics of approvals, resume, or usage.

## looplane's Choice

looplane did not add a parallel adapter hierarchy for the new three. It generalized the existing `ConversationRuntimeSession` port: start, send_turn, capabilities(), respond_approval, interrupt, aclose — with all events converted into looplane-owned typed events (looplane/conversation_runtime.py#ConversationRuntimeSession). Approval requests are specified to carry no vendor identifiers; adapters keep vendor IDs private and the controller only ever sees looplane's own IDs (looplane/conversation_runtime.py#RuntimeApprovalRequest).

The three new CLIs share one `StreamJsonCliBackend`: subclasses provide only argv and a normalizer; the base handles executable discovery, isolated environment, bounded subprocess execution, and event forwarding (looplane/external_cli_base.py#StreamJsonCliBackend). Normalizers fold each vendor's raw events into a unified `ExternalAgentEvent`: Pi's `message_update`/`text_delta` becomes a message event (looplane/pi_backend.py#PiBackend._normalize_event); OMP simply inherits the Pi backend until a live capture proves schema divergence (looplane/omp_backend.py#OmpBackend).

Differences are not hidden — they surface in three ways:

1. **Capability matrix.** Each runtime declares nine capabilities in the registry — streaming, tool events, approval, diff reporting, multi-turn, model switching, MCP, cancellation, usage. Pi lacks MCP, so it isn't declared, and the UI hides or labels the control accordingly (looplane/runtime_registry.py#RuntimeCapability).
2. **Fail closed on drift.** Event-count overflow, oversized lines, JSON parse failures, missing type fields — all mark the stream malformed and fail the run as `malformed_event_stream` instead of swallowing noise (looplane/external_cli_base.py#StreamJsonCliBackend._normalize).
3. **Honest handshake.** The Codex session actually sends `initialize` and actually opts into `experimentalApi`, because the `runtimeWorkspaceRoots` safety-boundary field is gated behind that capability — skip negotiation and you don't get it (looplane/codex_app_server.py#CodexAppServerSession).

There is also a deliberate asymmetry: the runtime picker lists a CLI only if its executable exists (looplane/runtime_registry.py#runtime_options). Installed ≠ authenticated. looplane never reads another CLI's credentials or infers subscription validity from a binary on disk. And OpenCode illustrates the honesty cost: headless runs have stdin on `/dev/null`, so its interactive permission prompts can never be answered and hang forever. The adapter therefore passes `--dangerously-skip-permissions` and relies on looplane's disposable workspace clone plus post-hoc patch audit for safety — rather than pretending the approval was mediated (looplane/opencode_backend.py#OpenCodeBackend._argv).

## Engineering Grounding

This path has precedent. [LSP](https://microsoft.github.io/language-server-protocol/) proved that editor × language-server integration can collapse from M×N to M+N with one protocol. [ACP](https://agentclientprotocol.com/) applies the same idea to editors × coding agents: JSON-RPC over stdio, reusing MCP's type representations, with custom types for agent-specific UX like diff display. OpenCode shipping both an HTTP API and ACP shows the two consumption shapes coexisting.

But ACP also confirms what looplane refuses to assume: of the five, only OpenCode fully implements ACP today. Protocol adoption takes time, so the realistic approach is layered preference — use a versioned SDK/RPC when it exists (Codex), adopt a structured protocol when offered (ACP), fall back to documented JSON event streams (Pi/OMP, Claude Code stream-json), and treat PTY rendering strictly as a degraded integration, never the default contract. This is the same lesson the [MCP](https://modelcontextprotocol.io/) ecosystem taught: define the narrow interface and capability declarations first, let integrations grow; fake compatibility first and the debt lands in every adapter.

## What Comes Next

M13's honesty has a price. The outstanding ledger:

1. **Resume is not yet in the runtime boundary.** The registry declares multi-turn; Codex and OpenCode have thread/resume and loadSession; but `ConversationRuntimeSession` still lacks a unified resume method. Native-session continuation remains a per-adapter special case.
2. **Approval mediation is partial.** OpenCode runs skip-permissions plus post-hoc audit — "label and constrain" rather than true tool-boundary mediation. ACP's permission-request shape is worth absorbing as looplane's standard mediation point.
3. **The capability matrix is static.** Codex already demonstrates runtime queries via modelProvider/capabilities/read. Filling the matrix after handshake would eliminate a whole class of "declaration went stale after upgrade" bugs.
4. **Protocol version pinning is coarse.** Fail-closed catches malformed streams but not legal-yet-reshaped events. Minimum viable fix: record the version at handshake or first event and degrade to unavailable outside the known range.
5. **Usage and cost aren't normalized.** Pi streams usage inline, OpenCode reports tokens/cost at step_finish, Codex has its own notifications. A unified typed event is a prerequisite for comparing costs across runtimes.

One line to close: abstraction earns its keep not by erasing differences but by putting each difference in the right place — lie once in the capability matrix, and a user hits a wall in the UI every time.

## References

- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/) — JSON-RPC over stdio between editors and coding agents
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) — the M×N → M+N precedent for protocol-based integration
- [Model Context Protocol](https://modelcontextprotocol.io/) — design reference for capability declaration and narrow interfaces
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — packages/coding-agent (json/RPC modes), packages/protocol (CBOR framing)
- [sst/opencode](https://github.com/sst/opencode) — packages/server, packages/opencode/src/acp
- [openai/codex](https://github.com/openai/codex) — codex-rs/app-server-protocol
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — headless `--output-format stream-json` docs
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — Pi fork and collab wire types
