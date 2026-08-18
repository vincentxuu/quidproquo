---
title: "OpenClaw Tools, Part 4: When the Catalog Outgrows the Prompt — Code Mode, Tool Search, and MCP"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, code-mode, tool-search, mcp, plugins, lobster, media-tools]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 23
tldr: "When the tool catalog no longer fits in the prompt, OpenClaw offers two answers: Code Mode shows the model only exec and wait and has it write small programs against a hidden catalog, while Tool Search keeps structured search/describe/call controls. Neither bypasses tool policy."
description: "How OpenClaw handles large tool catalogs: Code Mode's QuickJS-WASI sandbox and auto-tier activation, the trade-off against Tool Search, connecting MCP servers with toolFilter, and the remaining plugin-provided tool surface."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-tts-pdf-lobster)

The first three articles covered individual tools. This one covers **what happens when there are too many** — a problem every agent system eventually hits, and one OpenClaw answers two different ways.

## The problem: every tool costs a schema

Every tool the model can see is a structured function definition occupying prompt space. Install a dozen plugins and connect a few MCP servers and tool schemas alone consume serious context — while most tools go unused on most turns.

## Answer one: Code Mode

**Code Mode stops the model from seeing every tool schema.** It sees only `exec`, `wait`, and the few direct-only tools whose structured results cannot cross the JSON-only guest bridge. The model instead **writes a small JavaScript or TypeScript program** that searches, describes, and calls the hidden catalog.

Key facts:

- It runs in **an isolated QuickJS-WASI worker thread**
- Every catalog-eligible enabled tool (OpenClaw core, plugin, MCP, client) is hidden as a standalone model tool and exposed inside the guest program through `ALL_TOOLS` and `tools`
- **Guest tool calls go through the same execution path as normal agent turns** — policy, approvals, hooks, and telemetry all still apply
- **MCP tools are grouped under the `MCP` namespace, and in code mode that is the only supported way to call them**
- `wait` resumes a suspended run when nested tool calls are still pending

**It defaults to the `"auto"` tier**: engaged only when the run's model is flagged as a preferred code-mode performer in its provider catalog, with every other model keeping normal exposure. Set `tools.codeMode: false` to opt out globally, or `true` to force it on.

Two design details worth learning from:

**The `exec` description carries a bounded quick index** — exact OpenClaw and plugin catalog ids, compact input hints, and compact output hints when a trusted tool provides an output schema. It **omits descriptions, full schemas, MCP entries, and overflow entries**, with guest-side lookup as the fallback. So not "hide everything" but "keep an index that is just enough."

**It fails closed**: if code mode is enabled but the QuickJS-WASI runtime is unavailable, **the run fails instead of silently falling back to broad direct tool exposure.**

The docs also clear up a naming collision: **OpenClaw Code Mode and Codex Code Mode are separate implementations** that happen to share a name and the control-tool names `exec` and `wait`. Codex's runs inside the Codex coding harness on its in-process V8 runtime with a freeform-grammar `exec`; OpenClaw's runs in the generic agent runtime and takes a JSON `{ code, language }` payload.

**Neither `exec` is a shell surface** — in code mode `command` is an alias for `code`, and recognizable shell commands are rejected before the QuickJS worker starts, with actionable guidance.

## Answer two: Tool Search

If you want a compact catalog but **prefer structured search/describe/call controls over a QuickJS guest**, use Tool Search (`tool_search`, `tool_describe`, `tool_search_code`).

The selection criterion upstream is blunt: **keep direct tool exposure for a small catalog or a model that does not reliably write short programs**; use Code Mode for a large catalog with a capable model; use Tool Search for the middle.

Both Code Mode and Tool Search are **experimental OpenClaw agent surfaces**. Codex harness runs use Codex-native code mode, native tool search, deferred dynamic tools, and nested tool calls instead of `tools.codeMode` or `tools.toolSearch`.

## MCP: borrowing another program's tools

MCP in one line: **an agent borrows tools from another program.** Server definitions live under `mcp.servers`, and **the tools they expose go through the same tool-profile and tool-policy controls as everything else — connecting a server does not bypass your policy.**

Three ways to add one: the Control UI's **Settings → MCP**, the composer's **+ → Connectors → Add MCP server…** (administrator access required, scoped to this session or everywhere), or the CLI:

```bash
openclaw mcp add docs \
  --url https://mcp.example.com/mcp \
  --transport streamable-http \
  --include 'search,read_*'
openclaw mcp doctor docs --probe
```

**The line most worth remembering is about verification**:

> Saving a definition proves nothing about reachability — **the probe does.**

And already-running Gateway or agent processes **may need a restart or runtime reload** before they see a new definition; `openclaw mcp reload` only refreshes runtimes owned by the current CLI process.

Other practical details: transports are Streamable HTTP, SSE, and Stdio; `toolFilter.include` / `exclude` limits which tools are exposed; OAuth-protected HTTP servers use `openclaw mcp login <name>`; **the server name `__proto__` is reserved**; and `enabled: false` keeps a definition without connecting it.

The reverse direction is supported too: **`openclaw mcp serve` exposes OpenClaw channel conversations to another MCP client.**

One sandbox note: with sandboxed agents and configured MCP servers, **allow the bundled MCP plugin in the sandbox tool policy** (`tools.sandbox.tools.alsoAllow: ["bundle-mcp"]`).

## The rest of the plugin tool surface

Beyond core tools, plugins register a batch worth knowing:

| Tool | Purpose |
|---|---|
| **Lobster** | Typed workflows with **resumable approvals** |
| **Tokenjuice** | Compacting noisy `exec` and `bash` output |
| **Diffs** | Rendering file and markdown diffs |
| **Show widget** | Self-contained inline SVG and HTML in supported chat clients |
| **Screen** | Arranging a connected Control UI's panes and panels |
| **LLM Task** | JSON-only workflow steps |
| **Canvas** | Node Canvas control and A2UI |

**Tokenjuice**'s existence points at a real problem: **`exec` output is frequently long and useless.** Making the compaction a tool rather than hardcoding it into exec lets you choose whether to pay for that model call.

The media group is `image`, `image_generate`, `music_generate`, `video_generate`, and `tts`. The shared media-generation tools **infer an auth-backed provider default when unset** (the current default provider first, then remaining registered providers in provider-id order), and **cross-provider fallback is the fixed default behavior.**

## The big picture

These three answer the same question at three levels: **MCP lets you connect more tools, Code Mode and Tool Search keep the prompt affordable once you have, and Tokenjuice keeps what the tools return affordable too.**

One guarantee runs through all of them, and it matters: **they change only the orchestration surface the model faces — not the tools themselves, nor policy, approvals, auth, or channel behavior.** Hidden tools still take the same execution path, and connected MCP tools are still governed by the same policy.

## Changelog

- 2026-08-18: Substantially revised against the current official docs, refocusing from individual tools (TTS/PDF) onto **handling large tool catalogs**, which is the biggest change since March. Added: **Code Mode** (the QuickJS-WASI worker, `"auto"` per-model activation, the bounded quick index in the `exec` description, failing closed rather than reverting to broad exposure, MCP tools under the `MCP` namespace, the clarification that it is separate from Codex Code Mode, and that `exec` is not a shell surface), **Tool Search** and the criteria for choosing between them, **the three ways to add MCP servers and `toolFilter`** (including "saving proves nothing, the probe does" and allowing `bundle-mcp` under sandboxing), and the plugin-provided tool surface (Lobster's resumable approvals, Tokenjuice, Diffs, Show widget, Screen, LLM Task, Canvas) plus media tools' cross-provider fallback.

## References

This article draws on the following official OpenClaw documentation:

- [Code Mode](https://docs.openclaw.ai/tools/code-mode) — the QuickJS-WASI sandbox, tiered activation, MCP namespace
- [Tool Search](https://docs.openclaw.ai/tools/tool-search) — structured catalog search controls
- [Connect MCP servers](https://docs.openclaw.ai/tools/mcp) — adding, verifying, and filtering
- [Tools overview](https://docs.openclaw.ai/tools/) — tool categories and plugin-provided tools
- [Media overview](https://docs.openclaw.ai/tools/media-overview) — media generation and provider selection
