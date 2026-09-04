---
title: "Learning Design from Mature Coding Agents (30): MCP Integration — the Standard Socket for Tool Ecosystems"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 30
tags: [coding-agent, mcp, looplane, tool-integration, elicitation, lazy-connect]
lang: en
tldr: "An MCP client must handle transports, tool refresh, approvals, and credential boundaries together. looplane now supports allowlisted stdio, Streamable HTTP/SSE, tools/resources/prompts, tools/list_changed, OAuth metadata/PKCE, and a 0600 credential store. A real authorization-server E2E and MCP-specific confirmation UX remain open."
description: "Comparing MCP lifecycle, dynamic registration, and approvals across five agents, then checking Looplane's stdio/HTTP, resources/prompts, and OAuth PKCE baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-mcp-integration)

The [previous post](/posts/ai/2026-08-25-coding-agent-os-level-sandboxing-en) covered OS-level sandboxing. This post first dissects MCP design, then checks looplane's current native-client baseline.

## The capability problem

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/docs/getting-started/intro) turns "agent connects to external tools" into a standard protocol: the host runs clients, each MCP server attaches over stdio or HTTP, offering tools, resources, and prompts. For users, it means never waiting on the agent author to write a Slack integration. For agent authors, it means maintaining a hundred SDKs becomes unnecessary — at the price of three new problems.

First, lifecycle: servers are child processes or remote connections that crash, hang, and demand OAuth. Second, context cost: every server wants its tool descriptions in the system prompt; five servers can mean tens of thousands of tokens. Third, security: `mcp__github__create_issue` travels the same model-call path as built-in tools — if the approval mechanism doesn't cover it, you've opened a backdoor for external code.

The honest state of looplane: **no MCP client of its own**. `docs/progress.md` lists MCP under "Deferred future capabilities"; the only MCP capability comes from external CLI backend pass-through — the Codex app-server path forwards `mcpToolCall` events, and the Claude backend lets tools prefixed with `mcp__` through untouched.

## What the five projects do

**codex** uses the official Rust SDK (RMCP) as its client foundation: `codex/codex-rs/rmcp-client/src/local_stdio_transport.rs` handles stdio transport, with the connection set managed centrally by `codex/codex-rs/codex-mcp/src/connection_manager.rs#McpConnectionSet`. Two details are worth stealing. First, prewarming stays off the critical path: `codex/codex-rs/core/src/session/mcp_prewarm.rs#schedule_mcp_prewarm` is explicitly best-effort — the file's opening comment says so — and a slow server never blocks the first prompt. Second, tool exposure goes through a policy layer: `codex/codex-rs/core/src/mcp_tool_exposure.rs#append_mcp_tools` filters tools through exposure policy before they enter the registry; not everything a server declares is visible to the model. codex also exposes itself as an MCP server in the reverse direction — `codex/codex-rs/mcp-server/src/lib.rs#run_main` lets any other host use Codex as a tool.

**claude-code** takes the most "frontend engineering" approach: `claude-code-source/src/services/mcp/MCPConnectionManager.tsx#MCPConnectionManager` is a React component supplying connection state to the whole UI tree via context; `claude-code-source/src/services/mcp/useManageMCPConnections.ts#useManageMCPConnections` takes a `dynamicMcpConfig` parameter and reconnects when config changes — dynamic registration is a first-class citizen. On the tool side there are no N dynamic classes but a single template: every field of `claude-code-source/src/tools/MCPTool/MCPTool.ts#MCPTool` — name, schema, prompt — is annotated "Overridden in mcpClient.ts"; each MCP tool is just an instantiation of this template, uniformly named with the `mcp__<server>__<tool>` prefix (see `claude-code-source/src/services/mcp/utils.ts`). Approval gets a dedicated project-level gate: `claude-code-source/src/services/mcpServerApproval.tsx#handleMcpjsonServerApprovals` pops a dialog when a project `.mcp.json` contains unapproved servers — nothing connects until the user nods.

**opencode** is the most minimal while nailing dynamism: `opencode/packages/opencode/src/mcp/index.ts#createClient` builds the client, and both local and remote connects run under timeouts (`connectLocal`/`connectRemote` with `withTimeout`). The key is notification handling — when the client receives `ToolListChangedNotification` it republishes a `ToolsChanged` event, and the upper layer refreshes the tool list accordingly; servers hot-update their tools without restarting the session.

**omp** (oh-my-pi) makes it a process-global singleton: `oh-my-pi/packages/coding-agent/src/mcp/manager.ts#MCPManager` has exactly one instance per process, `discoverAndConnect` batches discovery and connection, and failed connections degrade gracefully to "discovered but not connected". It also has a very pragmatic trick: reading other tools' configs. `.omp/mcp.json` is the native format, but MCP configs from Claude Code, Codex, Cursor, and VS Code all get translated in — the user's existing investment carries over. omp exports in reverse too: the memory package mnemopi ships `oh-my-pi/packages/mnemopi/src/mcp-server.ts`, exposing its own memory features as an MCP server for any host.

**pi** is the one that says no: `pi-mono/packages/coding-agent/README.md` states plainly "No MCP", suggesting extension authors build it themselves if needed. The earlier capability handshake post mentioned Pi has no MCP — verified, and it's not "not yet", it's deliberate, in service of keeping the core minimal. A reminder that MCP isn't mandatory; it's an ecosystem-position choice.

## Engineering grounding

The official MCP documentation draws the responsibilities clearly: the [architecture page](https://modelcontextprotocol.io/docs/concepts/architecture) defines the host–client–server three layers, where a host holds multiple clients and each client maps to one server — this is the normative basis for keeping connection management in one place. The [Tools concept page](https://modelcontextprotocol.io/docs/concepts/tools) explicitly supports the `listChanged` capability declaration — servers may add or remove tools at runtime and clients must handle the `tools/list_changed` notification; opencode's `ToolsChanged` forwarding is precisely this spec implemented. The elicitation spec lets servers request user input or confirmation mid-execution — which is why MCP tool approval can't be static configuration only.

## Original looplane design draft (2026-08-25)

One principle up front: **MCP initialization stays off the startup critical path** — this commitment is already written into the startup-performance checklist in `docs/progress.md`, and the draft must honor it.

1. **Lazy connect**: MCPManager only accepts config in its constructor; a server spawns/connects the first time its tools are actually needed, with results cached. codex's prewarm lesson applies inversely to the TUI: background MCP connections get scheduled only after the controller warms up, and failures are always swallowed.
2. **Deny-by-default allowlist**: `src/looplane/codex_app_server.py#allowed_mcp_servers` already demonstrates the right posture — servers outside the whitelist don't pass, and names must pass format validation before entering config. The native client reuses these semantics directly.
3. **A single tool template**: following claude-code, no N dynamic tool classes; one MCPTemplate named `mcp__<server>__<tool>`, schemas forwarded verbatim, aligned with the existing `RuntimeToolKind.MCP`.
4. **Approval grading takes over**: MCP tool calls go through the existing grading in `permissions.py` — read-only tools get a low bar, side-effectful ones are treated like shell commands; server elicitation requests map onto the same approval UI, no separate channel.
5. **Context budget**: tool descriptions get truncated and compressed before entering the prompt; disabled servers consume zero tokens — more on this in the code mode post.

## Fitting into the existing architecture

The good news: the foundations exist. The capability handshake already has `src/looplane/runtime_registry.py#RuntimeCapability.MCP`, so the contract closes whenever an external runtime reports MCP support; the event layer's `src/looplane/conversation_runtime.py#RuntimeToolKind.MCP` means transcript and audit trail already recognize MCP calls. What's missing is the middle: a native MCPManager, a tool template wired into the dynamic registration point in `tools.py`, and the bridge from elicitation to approval. The external-backend pass-through (`src/looplane/claude_agent_session.py` letting `mcp__`-prefixed tools through) should converge into the same policy once the native client lands, instead of two behaviors.

The order is clear too: land the allowlist semantics and the tool template in the native loop first, then consider exposing looplane itself as a server. The ecosystem-position choice can wait — but the shape of the socket needs to be drawn correctly now.

## Looplane's current implementation

As of `2ed5efb`, native MCP is no longer mere pass-through. `mcp_client.py` loads a deny-by-default `.mcp.json` allowlist, supports stdio and Streamable HTTP including SSE responses, and maps tools, resources/list/read, and prompts/list/get into `mcp__`, `mcp_resource__`, and `mcp_prompt__` bridge tools. Tool annotations become conservative trust metadata; calls still pass through the existing approval, event, and timeout path, and server processes close at run end.

The HTTP path includes protected-resource metadata discovery, authorization-code plus PKCE helpers, and an app-owned credential store that rejects symlinks and requires mode 0600. Tool-list change notifications refresh dynamic tools. Remaining gaps are a complete E2E against a real authorization server and MCP-specific confirmation/elicitation UX; local tests are not production-server parity.

## References

- [Looplane native MCP client (fixed commit)](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/mcp_client.py)
- [Looplane MCP tests (fixed commit)](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_mcp_client.py)

- [Model Context Protocol — Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)
- [MCP Architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Tools (incl. listChanged dynamic tools)](https://modelcontextprotocol.io/docs/concepts/tools)
- [openai/codex — codex-rs (rmcp-client, codex-mcp, mcp-server crates)](https://github.com/openai/codex/tree/main/codex-rs)
- [anthropics/claude-code (official repo; decompiled source studied via local clone)](https://github.com/anthropics/claude-code)
- [sst/opencode — packages/opencode/src/mcp](https://github.com/sst/opencode/tree/dev/packages/opencode/src/mcp)
- [badlogic/pi-mono — packages/coding-agent](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [can1357/oh-my-pi — docs/mcp-config.md](https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-config.md)
