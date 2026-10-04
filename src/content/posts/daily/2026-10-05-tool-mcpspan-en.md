---
title: "Tool Pick｜mcpspan — An Observability Dashboard for Your MCP Server"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: en
description: "An open-source, self-hosted analytics dashboard for MCP servers: one line of code records every tool call's caller, latency, and which of two kinds of failure it was, with one behavior contract shared across 8 language SDKs"
tldr: "mcpspan is an open-source, self-hosted analytics dashboard for MCP servers. Install: docker compose up -d to run the dashboard, npm install mcpspan to wire up a server. It solves the problem of a deployed MCP server being a black box about who is calling it, how long calls take, and why they fail."
series:
  name: "AI Tool of the Day"
  order: 45
---

> 🌏 [中文版](/posts/daily/2026-10-05-tool-mcpspan)

## Tool Info

| Field | Value |
|---|---|
| Name | mcpspan |
| Type | Self-hosted analytics dashboard + multi-language instrumentation SDK |
| GitHub | [mcpspan/mcpspan](https://github.com/mcpspan/mcpspan) |
| Stars | 1 (just published, 2026-10-03) |
| Language | TypeScript (core + dashboard), with SDKs for Python, Go, C#, Java, Rust, Ruby, and PHP |
| License | MIT |
| Install | `docker compose up -d` (dashboard) + `npm install mcpspan` (SDK) |

## What Problem It Solves

You wrote an MCP server for an agent to use. It's deployed — now what? Your own logs will tell you a tool ran, but not whether it was Claude, Cursor, or some client you've never heard of calling it, not how this call compares to the last nine hundred, and not whether a failure means the handler broke or the tool politely answered "no flights found." Once an MCP server has users other than you, that black box stays a black box.

mcpspan turns the black box into a dashboard. On the SDK side, one call to `instrument()` before the server starts is enough: every tool call, resource read, and prompt get after that is recorded — who called it, how long it took, whether it succeeded, and whether a failure was the handler throwing an exception or the tool reporting `isError` on its own. Those events go to a dashboard you run yourself (`docker compose up -d` is enough to get it running), which charts call volume, each tool's latency distribution, compares releases against each other, and can page Slack, Discord, or any webhook when an error rate spikes or a server goes quiet.

It fits when an MCP server is exposed to more than one client and you need to know which tool keeps getting called with the wrong arguments, which release made latency worse, or which client suddenly stopped connecting. If you're just running a server locally for your own testing, you won't get much use out of it.

## Getting Started

### Install

```bash
# Run the self-hosted dashboard; needs Docker
git clone https://github.com/mcpspan/mcpspan.git
cd mcpspan
docker compose up -d
# Open http://localhost:6270, create an account, get an API key for your first server

# Wire up a TypeScript MCP server
npm install mcpspan
```

### Basic Usage

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { instrument } from 'mcpspan';

const server = new McpServer({ name: 'flights', version: '1.0.0' });

instrument(server, {
  apiKey: process.env.MCPSPAN_API_KEY,
  endpoint: 'http://localhost:6271', // your own mcpspan install
});

// register tools exactly as before, nothing changes
server.registerTool('search_flights', { inputSchema }, async (params) => {
  return { content: [{ type: 'text', text: 'Found 3 flights' }] };
});
```

### Advanced Usage

```ts
import { exclude } from 'mcpspan';

// skip tools polled by machinery (e.g. health checks) so their volume and
// latency don't drown out the numbers that actually matter
server.registerTool('health_check', {}, exclude(async () => {
  return { content: [{ type: 'text', text: 'ok' }] };
}));
```

You can also set `OTEL_EXPORTER_OTLP_ENDPOINT` to have mcpspan forward every call as an OpenTelemetry span straight into an existing Grafana, Datadog, or Honeycomb setup.

## Comparison with Existing Tools

| | mcpspan | Rolling your own logging | General-purpose APM (via OTel) |
|---|---|---|---|
| Understands MCP semantics (tool/resource/prompt) | ✅ | ❌ you parse it yourself | ❌ no tool name or client type |
| Tells apart "tool reported an error" vs. "handler threw" | ✅ | You build it yourself | ❌ |
| Parameter values ever leave the process | ❌ never | Depends on your log design | Depends on your instrumentation |
| One behavior contract across 8 languages | ✅ | — | Depends on each vendor's SDK |
| Exports to OTel with zero extra setup | ✅ | ❌ | (it already is one) |

## Things to Watch Out For

- **Just published, stability unknown**: the repo was created on 2026-10-03 with only 1 star and no official release yet. Fine to try out; watch it for a few days before relying on it in production.
- **No parameter values by default, but parameter names are opt-in**: `captureParameterNames: true` additionally records parameter names and types (e.g. `{ destination: 'string' }`) to catch cases like an agent writing the wrong argument name — but even names and types alone can indirectly leak details of your tool's design, so weigh that before turning it on.
- **Self-hosted means self-managed**: retention (90 days of raw events, 2 years of summaries by default), backups, and the signing secret are all on you; deleting a server's data cannot be undone.

## Today's Takeaway

Most observability tools slice data at the level of an HTTP request or a function call. mcpspan slices it at MCP's own protocol semantics instead — each tool, resource, and prompt is its own unit, and client identity comes from the handshake or the request itself. That's what lets it do something a generic APM can't: split "the tool correctly said no flights found" from "the handler actually broke" into two distinct signals, instead of folding both into the same error-rate curve.

## References

- [mcpspan/mcpspan — GitHub](https://github.com/mcpspan/mcpspan)
- [mcpspan TypeScript SDK README](https://github.com/mcpspan/mcpspan/blob/main/packages/mcpspan/README.md)
- [Self-hosting docs](https://github.com/mcpspan/mcpspan/blob/main/docs/self-hosting.md)
- [Model Context Protocol specification](https://modelcontextprotocol.io)
