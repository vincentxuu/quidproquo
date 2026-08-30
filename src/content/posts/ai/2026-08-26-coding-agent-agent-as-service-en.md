---
title: "Learning Design from Mature Coding Agents (38): Agent as a Service — Wrapping Your Loop in Something Other Programs Can Call"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 38
tags: [coding-agent, server-api, sse, websocket, rivumi, opencode, codex]
lang: en
tldr: "rivumi now has a Cloudflare Durable Object run resource with async creation, status/cancel/artifacts, live NDJSON, and Last-Event-ID SSE; remote approvals use a separate short-lived capability. Python also provides an attach client and a stateful conversation WebSocket. Production deployment, cross-runtime parity, and full multi-tenant hardening remain unverified."
description: "Comparing server APIs across mature coding agents, including rivumi's implemented durable-run, SSE/WebSocket attach, and remote-approval baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-coding-agent-agent-as-service)

The final post of the series. [The previous one](/posts/ai/2026-08-25-coding-agent-code-mode-en) covered code mode; this one closes out Part Two with the last missing capability: turning the agent from "a program in your terminal" into "a service other programs can call."

Evidence scope as usual: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community decompilation v2.1.88 — symbol names may differ from the original). Every citation below was read in my local clones.

## The capability gap: what's still missing after the loop works

[Order 21 of this series](/posts/ai/2026-08-25-coding-agent-headless-ci-mode-en) solved the "nobody to click approve" problem; a plain headless CLI still remains a **one-shot** interaction model. Rivumi's later service surface addresses these three limitations:

1. **Mid-flight observation**: while a task runs, external programs can't see progress — they can only wait for the end.
2. **Persistent reuse**: every call reloads the system prompt and rebuilds workspace state, paying startup cost again.
3. **Multi-party intervention**: a human wants to peek mid-run, append an instruction, or drive the agent from a web frontend — the CLI has no entry point for that.

Wrapping the loop as a service means answering three design questions: what does the API surface look like, how do events get pushed out, and — most underestimated — **where does the trust boundary go**? A service that executes shell commands exposes its listener as an attack surface.

## How the five do it

### opencode: REST + SSE, the only full server product in the five

opencode declares its API surface with Effect's HttpApi: `opencode/packages/protocol/src/groups/session.ts#session.prompt`, `session.events`, and `session.interrupt` map to `/api/session/:id/prompt`, event subscription, and interruption; event push rides on SSE (`groups/event.ts#HttpApiSchema.StreamSse`). Its route surface is the largest of the five. The official TypeScript SDK wraps everything into a typed client at `packages/sdk/js/src/client.ts#createOpencodeClient`.

Auth is pragmatic: `packages/server/src/auth.ts#ServerAuth.Config` supports Basic auth (password from an environment variable), embedded mode needs no password, and the default bind is localhost. In other words, opencode treats "served mode" as a first-class deployment shape without pretending public exposure is the default scenario.

### codex: JSON-RPC over two transports, methods marked experimental

codex's app-server is not REST — it's JSON-RPC. Methods live in `codex-rs/app-server-protocol/src/protocol/v2/thread.rs`: a whole family of `thread/start`, `thread/resume`, and `turn/*` calls, heavily annotated `#[experimental]` — an explicit admission that the wire format will still move. Dispatch centers on `codex-rs/app-server/src/message_processor.rs#handle_client_request`. There are two transports: stdio (for IDE embedding) and a WebSocket acceptor (`app-server/src/transport.rs#start_websocket_acceptor`).

The notable trade: choosing JSON-RPC over REST lets one protocol definition run unchanged on both stdio and WebSocket — IDE extensions and remote clients consume the same method surface.

### pi: transport-agnostic, auth outsourced to the operating system

pi's server core isn't an HTTP router at all. `pi-mono/packages/server/src/server.ts#PiServer` manages byte connections: after a version handshake, traffic becomes frame streams; `packages/server/src/sessions.ts#LiveSessionManager` lets one connection attach multiple sessions with snapshot broadcasts. The only transport preset today is a Unix socket (`transports/unix/preset.ts#createUnixServer`).

It's a clever simplification: Unix socket file permissions *are* the authentication — no tokens, no TLS, inherently local-only. The cost is that remote scenarios require user-built bridges; pi leaves that problem to users rather than shipping a half-baked HTTP layer.

### omp: collaboration as the primary scene, a fully blind relay

omp goes furthest and most radical here. `packages/coding-agent/src/collab/host.ts#CollabHost` is the authoritative node, broadcasting entries and state to guests through a relay; the wire grammar is defined in `collab/protocol.ts#CollabFrame` (welcome, prompt, snapshot-chunk, ui-request, and other frame types). The key design sits at the envelope layer: each frame is `[4B peerId][AES-256-GCM sealed]`, with envelope keys from `collab/crypto.ts#generateRoomKey` and write access gated by `generateWriteToken` — the relay sees only peerIds and ciphertext, so compromising the server leaks nothing about session content. The browser-side guest SDK is `collab-web/src/lib/client.ts#GuestClient`, supporting read-only share links.

### claude-code: the server is in the cloud, the CLI is the client

claude-code points the opposite direction from the other four: in its remote-session architecture, the server is Anthropic infrastructure. `src/remote/SessionsWebSocket.ts#SessionsWebSocket` connects to `wss://api.anthropic.com/v1/sessions/ws/{sessionId}/subscribe`, with lifecycle managed by `src/remote/RemoteSessionManager.ts#RemoteSessionManager` — you can pick up a home-running session from your phone or a browser because state sync relays through the cloud. A local direct-connect path exists too (`src/server/directConnectManager.ts#DirectConnectSessionManager`), but the cloud architecture is the mainline.

## Shared patterns and the protocol ecosystem

Stripping away transport details, the five converge on three things:

- **Session is the core resource**: every route/RPC revolves around create, prompt, events, interrupt; nobody makes "the agent" itself a resource.
- **Events stream, they don't poll**: SSE or WebSocket, never polling — agent event streams are naturally one-way broadcasts.
- **Security defaults are conservative**: localhost, Unix sockets, or end-to-end encryption; none of them exposes a command-executing agent to the public internet by default.

The wider ecosystem converges the same way: [Model Context Protocol](https://modelcontextprotocol.io) standardized the tool surface, and [Agent Client Protocol](https://agentclientprotocol.com) standardized editor-to-agent communication — omp's ACP mapping plugs into the latter. The space for bespoke private protocols is shrinking.

## The service surface now implemented in rivumi

The Cloudflare control plane represents each run as a Durable Object resource. `POST /v1/runs` returns `202` and starts an isolated Sandbox in the background. Clients can read status, cancel, retrieve artifacts, and consume live NDJSON. `?stream=1` upgrades events to SSE, replaying a bounded buffer before pushing new events; `Last-Event-ID` resumes after an integer sequence cursor, and terminal state closes the stream.

Remote approval does not smuggle trust through the event channel. Model requests, event append, and approval use separate short-lived capability audiences. Clients explicitly submit `allow_once`, `allow_session`, `deny`, or `cancel` through approval routes, while the Sandbox polls a dedicated internal endpoint. Python's `CloudflareRunClient` covers start/status/cancel/artifact/attach, and the SDK also exposes a stateful `/v1/conversation/attach` WebSocket for turns, approvals, and injected context.

These are source- and test-backed baselines, not a production-success claim. Production deployment, long real-provider runs, cross-runtime attach parity, Durable Object restart behavior, and full multi-tenant hardening still require separate validation.

## References

- [rivumi Cloudflare control-plane documentation at `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb/cloudflare/README.md)
- [rivumi Python attach client at `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb/src/rivumi/cloudflare_client.py)
- [rivumi conversation WebSocket at `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb/src/rivumi/conversation_websocket.py)

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [Claude Code Agent SDK documentation](https://docs.anthropic.com/en/docs/claude-code/sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Agent Client Protocol](https://agentclientprotocol.com)
