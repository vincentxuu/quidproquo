---
title: "AI Agent GitHub Digest — 2026-11-14"
date: 2026-11-14
category: daily
tags: [ai-agent, github, open-source, daily, mcp, code-execution, mastra]
lang: en
description: "Claude Code shipped an experimental Code Mode, UTCP's community-built code-mode library is getting the same attention this week, Vercel entered the agent-framework race, and a tool that saves tokens by talking like a caveman hit 120k stars"
tldr: "Claude Code v2.1.323 added experimental Code Mode (letting an agent write code to call tools); the UTCP community's code-mode library is riding the same wave this week; Vercel released eve, a filesystem-first agent framework; Mastra core 1.83 lets every Agent publish a resumable stream and ships a built-in MCP endpoint."
series:
  name: "AI Agent GitHub Digest"
  order: 91
---

> 🌏 [中文版](/posts/daily/2026-11-14-ai-agent-github-digest)

## Today's Highlight

The thing worth connecting today isn't any single repo — it's the same idea surfacing in three unrelated places at once. Claude Code v2.1.323 added an experimental "Code Mode" that lets an agent write a bit of JavaScript to call its tools instead of picking one tool at a time. UTCP's community-built `code-mode` library, which has been around for half a year, got pulled back into the conversation this week by an article comparing UTCP to MCP — it does the same thing: write code that calls several MCP or UTCP tools in one shot. And Vercel entered the agent-framework race with eve, a filesystem-first take on the same problem space. The old "one tool call per turn" pattern looks like it's being replaced by "let the agent write the program."

```diagram
title: Tool-calling loop vs. writing code to call tools (Code Mode)
desc: Classic tool-calling makes the LLM pick one tool per turn and loop several rounds before it has an answer; Code Mode lets the LLM write one program that calls several tools inside a sandbox and returns the result once.
caption: Simplified for illustration — context-window size and pricing differ too, but this only shows the structural change in how tools get called.
---
<svg viewBox="0 0 640 400">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Before</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">After</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="280"/>

  <path class="dg-line" d="M160 100V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 188V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 188V224" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="76" y="56" width="168" height="44" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">Agent context</text>

  <rect class="dg-box" x="76" y="140" width="168" height="48" rx="6"/>
  <text class="dg-label" x="160" y="156" text-anchor="middle" dominant-baseline="central">LLM picks one tool</text>
  <text class="dg-sub" x="160" y="174" text-anchor="middle" dominant-baseline="central">one tool per turn</text>

  <rect class="dg-box" x="76" y="224" width="168" height="48" rx="6"/>
  <text class="dg-label" x="160" y="240" text-anchor="middle" dominant-baseline="central">Tool runs, result returned</text>
  <text class="dg-sub" x="160" y="258" text-anchor="middle" dominant-baseline="central">usually several rounds</text>

  <rect class="dg-box" x="396" y="56" width="168" height="44" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">Agent context</text>

  <rect class="dg-box dg-box--accent" x="396" y="140" width="168" height="48" rx="6"/>
  <text class="dg-label" x="480" y="156" text-anchor="middle" dominant-baseline="central">LLM writes one program</text>
  <text class="dg-sub" x="480" y="174" text-anchor="middle" dominant-baseline="central">calls several tools at once</text>

  <rect class="dg-box" x="396" y="224" width="168" height="48" rx="6"/>
  <text class="dg-label" x="480" y="240" text-anchor="middle" dominant-baseline="central">Sandbox runs the program</text>
  <text class="dg-sub" x="480" y="258" text-anchor="middle" dominant-baseline="central">result returned once</text>

  <g class="dg-badge"><circle cx="60" cy="164" r="10"/><text x="60" y="164" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="60" cy="248" r="10"/><text x="60" y="248" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="380" cy="164" r="10"/><text x="380" y="164" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge"><circle cx="380" cy="248" r="10"/><text x="380" y="248" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="300" x2="620" y2="300"/>
  <text class="dg-tag" x="20" y="324" dominant-baseline="central">Changes</text>
  <g class="dg-badge"><circle cx="32" cy="352" r="10"/><text x="32" y="352" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="352" dominant-baseline="central">Removed: pick-one-tool loop over several rounds</text>
  <g class="dg-badge dg-badge--accent"><circle cx="352" cy="352" r="10"/><text x="352" y="352" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="352" dominant-baseline="central">Added: LLM writes one program calling several tools</text>
  <g class="dg-badge"><circle cx="352" cy="376" r="10"/><text x="352" y="376" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="376" dominant-baseline="central">Added: sandbox runs the whole program, returns once</text>
</svg>
```

## Trending Repos

### vercel/eve ⭐ 5,884

[GitHub](https://github.com/vercel/eve) · TypeScript · Apache-2.0

- **What it is**: Vercel's open-source agent framework, built around a "filesystem-first" philosophy — an agent's instructions, tools, and workflows live in ordinary files and fixed folders instead of a database or a framework's own runtime objects.
- **Why it's worth watching**: Most frameworks keep agent state in memory or in custom objects; eve flips that around and spells everything out as files — instructions are literally written in Markdown — so a project can be code-reviewed, version-controlled, and even read by another agent, just like ordinary source code. For coding agents already comfortable working with a filesystem (Claude Code, Cursor, and the like), this fits their native workflow better than hiding logic behind a framework's abstraction layer.
- **Tech stack**: TypeScript + fixed directory conventions (`agent/agent.ts`, etc.) + sandboxed execution + a workflow engine
- **Getting started**: Medium — documentation is solid (eve.dev), but you have to buy into its convention-over-configuration layout; switching frameworks later isn't cheap

---

### universal-tool-calling-protocol/code-mode ⭐ 1,667

[GitHub](https://github.com/universal-tool-calling-protocol/code-mode) · TypeScript · MPL-2.0

- **What it is**: A library from the UTCP (Universal Tool Calling Protocol) community that lets an agent skip calling tools one at a time and instead write a program that calls several MCP or UTCP tools in a single pass, then collects the results.
- **Why it's worth watching**: This happens to be the same idea being discussed alongside Claude Code v2.1.323's new experimental "Code Mode" this week — the core logic is identical: stuffing every tool's schema into context is expensive, so let the agent write code instead and save a lot of tokens and round trips. `code-mode` is proof this isn't one vendor's experiment — an independent community already built it, and it stays compatible with the existing MCP ecosystem without requiring any MCP server to be rewritten.
- **Tech stack**: TypeScript + a compatibility layer spanning both MCP and UTCP + agent runtime integration
- **Getting started**: Medium — the idea itself is simple, but you need to understand how MCP and UTCP describe tools differently before the value becomes obvious

---

### nkarasiak/qgis-mcp ⭐ 436

[GitHub](https://github.com/nkarasiak/qgis-mcp) · Python · GPL-2.0

- **What it is**: Lets any MCP-capable agent (Claude Code, Claude Desktop, Cursor, Gemini CLI, and more) drive the desktop GIS software QGIS directly — managing layers, editing features, running processing algorithms, and rendering maps, all from natural-language instructions.
- **Why it's worth watching**: Unlike a chatbot that merely answers GIS questions, this MCP server plugs the agent straight into QGIS's event loop over a TCP socket to a plugin. Destructive operations ask for a second confirmation by default, and long-running tools report progress. For GIS analysts, that means running a whole workflow in natural language instead of switching back to manual menus.
- **Tech stack**: Python MCP server (FastMCP) + a QGIS Python plugin (a non-blocking TCP socket on QGIS's QTimer) + the PyQGIS API
- **Getting started**: Medium — install the QGIS 3.28+ plugin first, then wire up an MCP client; the list of supported clients is long, but setup is more than one step

---

### JuliusBrussee/caveman ⭐ 119,655

[GitHub](https://github.com/JuliusBrussee/caveman) · Go · Apache-2.0

- **What it is**: A skill-plus-proxy combo written in deliberately caveman-speak, which flattens prompts and tool results into minimal sentences before they reach the model, claiming a 65% cut in token usage for coding agents.
- **Why it's worth watching**: The interesting part isn't the technique — it's how it spread. Wrapping a real pain point ("stop talking so much, save tokens") in a meme, funny enough and useful enough to get shared widely, took it to nearly 120,000 stars within months — proof that token costs hurt enough that people will star and share a joke-wrapped tool. Strip away the meme and it's a prompt-compression proxy solving the same problem as any other context-compression approach.
- **Tech stack**: A local Go proxy + prompt/tool-result simplification rules + cross-platform desktop installers
- **Getting started**: Low — install the proxy and point your existing coding-agent setup at it; no changes to the agent itself

## Notable Releases

### Mastra @mastra/core 1.83.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)

- **Key changes**: Resumable run streams, previously limited to "durable agents," now work for every `Agent` — with replay caching and cross-instance `agent.observe(runId)` / `abortRunStream`; `@mastra/server` ships a built-in MCP endpoint at `/api/mcp`, on by default once `server.auth` is configured, so you no longer have to hand-roll your own `MCPServer`, plus OAuth discovery; Workflow Storage V2 (writing only per-step deltas instead of rewriting the whole run) now officially supports Postgres and libSQL.
- **Breaking changes**: `Agent`'s `durable` option now only controls whether a stream can be resumed — it's no longer the same thing as checkpoint-backed durable execution. If you relied on `durable: true` for persistent execution, migrate to `createDurableAgent({ agent })`; plain agents also behave differently on disconnect now that resumable streams are on by default.
- **What it means for you**: If you were treating `durable: true` as "survives a disconnect and keeps running," that behavior isn't equivalent anymore — switch to `createDurableAgent`. If all you wanted was "a client can reconnect without killing the stream," you get that now without setting durable at all.

## Today's Takeaway

I assumed Claude Code's new "Code Mode" was Anthropic's own experiment, but digging in turned up a UTCP community library doing the same thing half a year earlier — and it's compatible with both MCP and UTCP. That tells me "let the agent write a program instead of looping through tool calls" isn't one vendor's gimmick; the whole ecosystem is converging on it, just at different speeds.

## References

- [vercel/eve — GitHub repo](https://github.com/vercel/eve)
- [universal-tool-calling-protocol/code-mode — GitHub repo](https://github.com/universal-tool-calling-protocol/code-mode)
- [What Is UTCP, And Why Do I Care? — Matthew Kruczek](https://matthewkruczek.substack.com/p/what-is-utcp-and-why-do-i-care)
- [nkarasiak/qgis-mcp — GitHub repo](https://github.com/nkarasiak/qgis-mcp)
- [JuliusBrussee/caveman — GitHub repo](https://github.com/JuliusBrussee/caveman)
- [Claude Code v2.1.323 — Release Notes (Code Mode)](https://github.com/anthropics/claude-code/releases/tag/v2.1.323)
- [Mastra @mastra/core@1.83.0 — Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)
