---
title: "Chrome DevTools MCP: The MCP Server Wired Directly to CDP"
date: 2026-06-20
updated: 2026-08-19
category: tech
type: deep-dive
tags: [chrome, cdp, mcp, browser-automation, debugging, devtools, ai-agent]
lang: en
tldr: "chrome-devtools-mcp, maintained by the Chrome team, packages DevTools capability as an MCP server: performance traces and insights, Lighthouse audits, heap snapshots, extension management — none of which @playwright/mcp exposes. It runs on Puppeteer, so interactions auto-wait; the costs are Chrome-only support and usage statistics reported to Google by default."
description: "An introduction to chrome-devtools-mcp: what CDP is, what Chrome's official MCP server can do, how to attach it to a browser you already have open, the privacy and platform limits, and when you'd still wrap CDP yourself."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 3
---

> 🌏 [中文版](/posts/tech/2026-06-20-chrome-devtools-mcp)

**The premise of this post changed after 2025: Chrome DevTools MCP now has an official package.** [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) (`chrome-devtools-mcp` on npm) is maintained by the Chrome team and packages DevTools capability as an MCP server so an AI agent can control and inspect a live Chrome. Its current official name is "Chrome DevTools for agents".

Compared with [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en) and the archived [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp-en), what sets this route apart is *not* that it is lower-level — it also runs on Puppeteer and also waits for action results. It is that **it moves the diagnostic half of the DevTools panel into a tool interface**: performance traces, Lighthouse audits, heap snapshots, extension management.

## What the Chrome DevTools Protocol Is

The Chrome DevTools Protocol (CDP) is the browser's built-in WebSocket remote-control protocol. Everything you see when you hit F12 — the Network request list, breakpoints in Sources, Performance recordings — talks to the browser engine over CDP.

Launch Chrome with `--remote-debugging-port=9222` and it exposes a CDP WebSocket endpoint on that port, so external programs can drive the browser through the same channel:

```bash
google-chrome --headless --remote-debugging-port=9222
```

Hit `http://localhost:9222/json` and you get the WebSocket URL for every tab; each tab is an independent control channel. The protocol itself is JSON-RPC 2.0: the caller sends JSON with `method` and `params`, the browser replies with `result` or pushes an `event`.

CDP splits functionality across dozens of Domains (`Page`, `Network`, `DOM`, `Runtime`, `Debugger`, `Profiler`, `HeapProfiler`, `Emulation`, …) and is the shared substrate under Puppeteer, Playwright's Chromium backend, and Lighthouse. The full list lives in the official [protocol viewer](https://chromedevtools.github.io/devtools-protocol/tot/).

## Installation

No need to write a server yourself — just use npx:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Requires Node.js LTS and current-stable-or-newer Chrome. If you only want basic browsing and don't want a large tool schema eating your context, add `--slim` to load a reduced tool set; add `--headless` to run without a window. Claude Code can also install it as a plugin (`/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`), which brings along the matching skills.

The tool list churns, so this post doesn't enumerate it — treat the official [tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md) as the source of truth. The groups are roughly: input automation, navigation, emulation, performance, network, debugging, memory, extensions, PWAs.

## What It Gets That the Others Don't

This is the actual reason to pick it. None of the following has an equivalent in @playwright/mcp:

**Performance traces and insights**: `performance_start_trace` / `performance_stop_trace` record a Chrome trace, and `performance_analyze_insight` extracts actionable insights — reusing the analysis engine behind the DevTools Performance panel rather than dumping a raw trace on the model. Note that performance tooling **sends trace URLs to Google's CrUX API by default** to pull real-user field data as a comparison; pass `--no-performance-crux` if you don't want that.

**Lighthouse audits**: `lighthouse_audit` runs a Lighthouse pass inside the agent loop.

**Memory analysis**: a full set of heap snapshot tools — take a snapshot, diff two snapshots, walk retainers and retaining paths, find duplicate strings, query objects of a given class. This is the most practical toolkit here for chasing leaks; enable it with `--memoryDebugging`.

**Extensions and PWAs**: install / uninstall / reload extensions and trigger an extension's action; install and launch PWAs. For Chrome extension development this route has essentially no substitute.

**Console messages with source maps**: the stack traces you get back are mapped, not minified line numbers.

## Attaching to a Chrome You Already Have Open

"Let the agent drive the browser I'm already logged into" is a common use, and there are three ways in:

- `--browser-url http://127.0.0.1:9222`: attach to a Chrome already running with remote debugging.
- `--ws-endpoint ws://127.0.0.1:9222/devtools/browser/<id>`: point straight at a WebSocket endpoint, with `--ws-headers` when you need custom headers.
- `--auto-connect`: Chrome 144+, connects automatically to the local user data directory for the given channel — provided you've already enabled remote debugging via `chrome://inspect/#remote-debugging` in that Chrome.

If you specify none of these, the server launches its own Chrome using its own profile directory (`$HOME/.cache/chrome-devtools-mcp/chrome-profile`). Add `--isolated` for a throwaway profile each run.

If several agents or subagents share one server instance, add `--experimentalPageIdRouting`: it exposes `pageId` on page-scoped tools so each agent can route calls to its own tab instead of fighting over one.

## Trade-offs to Know Up Front

**Google Chrome and Chrome for Testing only.** The project states plainly that other Chromium-based browsers may work but are not guaranteed. Cross-browser needs belong with @playwright/mcp.

**It exposes the entire browser to the MCP client.** The official disclaimer is blunt: the server lets clients inspect, debug, and modify any data in the browser or DevTools. Weigh that sentence carefully before attaching it to the Chrome you're logged into all day.

**Usage statistics are on by default.** Google collects tool invocation success rates, latency, and environment information. Turn it off with `--no-usage-statistics` or the `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS` env variable (collection is disabled automatically when `CI` is set). The server also polls npm for updates periodically; `CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS` disables that.

**Some capabilities are experimental**: coordinate-based clicking (`click_at`) needs `--experimentalVision` plus a model that can produce accurate coordinates from screenshots; automating DevTools targets themselves needs `--experimentalDevtools`.

## Do You Still Need to Wrap CDP Yourself?

Mostly no. The official server already covers the Domains that used to be DIY-only (Profiler, HeapProfiler, the fine-grained Network surface).

One situation genuinely remains: **the CDP method you need isn't exposed by the official server**. Then reach for something like [`chrome-remote-interface`](https://github.com/cyrus-and/chrome-remote-interface) and wrap just those methods as MCP tools — the point is filling one or two gaps, not rebuilding a whole server:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import CDP from "chrome-remote-interface";

const server = new McpServer({ name: "cdp-extra", version: "0.1.0" });
const client = await CDP({ port: 9222 });

server.tool("security_state", {}, async () => {
  await client.Security.enable();
  const state = await new Promise((r) => client.Security.securityStateChanged(r));
  return { content: [{ type: "text", text: JSON.stringify(state) }] };
});
```

The cost of rolling your own is that connection lifecycle, timing waits, and error reporting all become your problem — things the official server, being built on Puppeteer, has already handled.

## When It Fits and When It Doesn't

**Good fit for chrome-devtools-mcp:**
- Performance work (traces, insights, Lighthouse) and memory leak hunting
- Letting an agent drive the Chrome you're already signed into
- Developing Chrome extensions or PWAs
- Front-end debugging that needs source-mapped console output and request detail

**Poor fit:**
- Cross-browser testing — Chrome only; use @playwright/mcp for Firefox / WebKit
- Privacy-sensitive environments — usage statistics on by default, and the whole browser is exposed to the client
- Plain "let the agent click around a page" — it works, but beyond `--slim` there's no context-efficiency argument over @playwright/mcp

## In Summary

"Chrome DevTools MCP has no official package, so you'll be wrapping CDP yourself" is an out-of-date judgement. It's now a finished product maintained by the Chrome team, with a clear position: **what it sells is not lower-level control, it's DevTools' diagnostic power.**

That makes the division of labour cleaner than it was two years ago. General web automation and cross-browser work go to @playwright/mcp. Working out what is actually happening inside Chrome — where the time goes, where the memory leaks, whether an extension broke — goes to chrome-devtools-mcp.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Browser Automation and MCP" series.

## References

- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [chrome-devtools-mcp tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [Chrome DevTools Protocol — Official Docs](https://chromedevtools.github.io/devtools-protocol/)
- [CDP Protocol Viewer (interactive Domain browser)](https://chromedevtools.github.io/devtools-protocol/tot/)
- [chrome-remote-interface — GitHub](https://github.com/cyrus-and/chrome-remote-interface)
- [Model Context Protocol SDK — GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
- [@playwright/mcp Introduction](/posts/tech/2026-06-20-playwright-mcp-en)
- [@modelcontextprotocol/server-puppeteer Introduction](/posts/tech/2026-06-20-puppeteer-mcp-en)
