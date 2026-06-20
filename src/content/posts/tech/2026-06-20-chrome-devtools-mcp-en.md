---
title: "Chrome DevTools MCP: An MCP Server Built on CDP"
date: 2026-06-20
category: tech
type: deep-dive
tags: [chrome, cdp, mcp, browser-automation, debugging, devtools, ai-agent]
lang: en
tldr: "Chrome DevTools MCP wraps Chrome DevTools Protocol (CDP) as an MCP server, giving AI agents direct access to 40+ CDP Domains including Profiler, HeapProfiler, and Security that Playwright and Puppeteer MCP don't expose — at the cost of having to implement MCP tool definitions and auto-wait logic yourself."
description: "A deep-dive into Chrome DevTools MCP: what CDP is, why wrapping it as an MCP server makes sense, what Domains you can access, how to build a basic server with chrome-remote-interface, and how it compares to Playwright MCP and Puppeteer MCP."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-06-20-chrome-devtools-mcp)

Chrome DevTools MCP isn't the name of a specific package — it's an approach: wrapping the [Chrome DevTools Protocol (CDP)](https://chromedevtools.github.io/devtools-protocol/) as an MCP server so an AI agent can call the browser's low-level API through MCP. Compared to [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en) and [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp-en), this route has no high-level abstraction layer, but it can access functionality the other two can't reach.

## What Chrome DevTools Protocol Is

Chrome DevTools Protocol (CDP) is the browser's built-in WebSocket remote control protocol. The DevTools panel you open with F12 — the request list in the Network tab, breakpoints in Sources, recordings in Performance — all communicate with the browser engine via CDP behind the scenes.

Start Chrome with `--remote-debugging-port=9222` and the browser exposes a CDP WebSocket endpoint on that port for external programs to use the same channel:

```bash
google-chrome --headless --remote-debugging-port=9222
```

Once running, `http://localhost:9222/json` lists all tabs and their WebSocket URLs. Each tab is an independent control channel.

The protocol itself is JSON-RPC 2.0: the caller sends a JSON request with a `method` and `params`, and the browser responds with a `result` or pushes an `event`.

## Why Wrap It as an MCP Server

CDP is a WebSocket protocol — AI agents can't call it directly. They need MCP tools. Wrapping CDP as an MCP server lets the agent call browser functionality the same way it calls any other MCP tool:

```
tool: cdp_network_enable
tool: cdp_page_navigate  → { url: "https://example.com" }
tool: cdp_dom_get_document
tool: cdp_runtime_evaluate → { expression: "document.title" }
```

Each MCP tool maps to one or more CDP methods. The MCP server manages the WebSocket connection, serialises parameters, and returns results.

## CDP's Domains

CDP organises its functionality into 40+ Domains. The commonly used ones:

| Domain | Purpose |
|---|---|
| `Page` | Navigation, screenshots, lifecycle events |
| `Network` | Intercept requests, get response bodies, simulate throttling |
| `DOM` | Query and modify DOM nodes |
| `Runtime` | Execute JS in the page, retrieve JS objects |
| `Debugger` | Set breakpoints, step through code |
| `Target` | Manage multiple tabs and iframes |
| `Profiler` | CPU profiling (not exposed by Playwright MCP) |
| `HeapProfiler` | Memory heap snapshots (not exposed by Playwright MCP) |
| `Security` | Certificate management, mixed content (not exposed by Playwright MCP) |
| `Fetch` | Low-level request interception, finer-grained than Network |
| `Emulation` | Device simulation, geolocation, timezone |
| `Performance` | Runtime metrics (JS heap, layout count) |

**Playwright MCP and Puppeteer MCP only expose what they've wrapped.** Chrome DevTools MCP can access every Domain.

## Building an MCP Server with chrome-remote-interface

There's no official Chrome DevTools MCP package, so you typically build one using [`chrome-remote-interface`](https://github.com/cyrus-and/chrome-remote-interface) (Node.js). Here's a minimal skeleton:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import CDP from "chrome-remote-interface";

const server = new McpServer({ name: "chrome-devtools", version: "0.1.0" });
let cdpClient: CDP.Client | null = null;

async function getClient() {
  if (!cdpClient) {
    cdpClient = await CDP({ port: 9222 });
    await cdpClient.Page.enable();
    await cdpClient.Network.enable();
    await cdpClient.Runtime.enable();
  }
  return cdpClient;
}

server.tool("page_navigate", { url: { type: "string" } }, async ({ url }) => {
  const client = await getClient();
  await client.Page.navigate({ url });
  await client.Page.loadEventFired();
  return { content: [{ type: "text", text: `Navigated to ${url}` }] };
});

server.tool("runtime_evaluate", { expression: { type: "string" } }, async ({ expression }) => {
  const client = await getClient();
  const { result } = await client.Runtime.evaluate({ expression, returnByValue: true });
  return { content: [{ type: "text", text: JSON.stringify(result.value) }] };
});

server.tool("network_get_response", { requestId: { type: "string" } }, async ({ requestId }) => {
  const client = await getClient();
  const { body } = await client.Network.getResponseBody({ requestId });
  return { content: [{ type: "text", text: body }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": ["./chrome-devtools-mcp.js"]
    }
  }
}
```

Chrome must already be running with `--remote-debugging-port=9222` before the MCP server tries to connect.

## Profiler: A Domain Playwright MCP Can't Reach

The `Profiler` Domain is one of the clearest advantages Chrome DevTools MCP has over high-level wrappers:

```typescript
server.tool("profiler_start", {}, async () => {
  const client = await getClient();
  await client.Profiler.enable();
  await client.Profiler.start();
  return { content: [{ type: "text", text: "Profiling started" }] };
});

server.tool("profiler_stop", {}, async () => {
  const client = await getClient();
  const { profile } = await client.Profiler.stop();
  return { content: [{ type: "text", text: JSON.stringify(profile) }] };
});
```

The same pattern applies to `HeapProfiler` (memory analysis), `Security` (handling untrusted certificates), and `Fetch` (modifying request headers before they're sent).

## When to Use (and When Not To)

**Good fit for Chrome DevTools MCP:**
- Performance analysis tooling (CPU / memory profiling)
- Attaching to a Chrome instance the user already has open
- Accessing Domains that Playwright / Puppeteer MCP don't expose
- Building custom DevTools extensions or Chrome Extension backends
- Capturing raw browser traffic (Network Domain event stream)

**Not a good fit:**
- General AI agent web browsing — you'd have to implement every MCP tool and all auto-wait logic yourself; @playwright/mcp already handles this
- Cross-browser scenarios — CDP is Chromium-specific
- Rapid prototyping — building an MCP server from scratch is far slower than just using @playwright/mcp

## In Summary

Chrome DevTools MCP is the highest-barrier, finest-grained option of the three. No official package means building your own MCP server; no auto-wait means the agent handles timing itself. What you get in return is access to the full 40+ Domain set and the ability to attach to an existing Chrome instance.

For AI agents doing ordinary web automation, @playwright/mcp is the more sensible starting point. Chrome DevTools MCP's value is in what it can do that the other two can't.

## References

- [Chrome DevTools Protocol — Official Documentation](https://chromedevtools.github.io/devtools-protocol/)
- [chrome-remote-interface — GitHub](https://github.com/cyrus-and/chrome-remote-interface)
- [Model Context Protocol SDK — GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [CDP Protocol Viewer (interactive Domain browser)](https://chromedevtools.github.io/devtools-protocol/tot/)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
- [@playwright/mcp Introduction](/posts/tech/2026-06-20-playwright-mcp-en)
- [@modelcontextprotocol/server-puppeteer Introduction](/posts/tech/2026-06-20-puppeteer-mcp-en)
