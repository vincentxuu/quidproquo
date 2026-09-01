---
title: "Tool Pick | mcp-spend-guard — A Spend Cap and Circuit Breaker for Any MCP Server"
date: 2026-09-02
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "mcp-spend-guard is a proxy that wraps any stdio MCP server, using SQLite-backed counters to enforce a hard spend cap, a per-minute call limit, a timeout circuit breaker, and a kill switch you can trigger by touching a file."
tldr: "mcp-spend-guard is an open-source stdio proxy for MCP that fills the gap MCP has no built-in rate limiting for: spend caps, rate limits, a circuit breaker, and a kill switch. Install: `pipx install .`. It addresses the fact that a looping or prompt-injected agent can hammer a paid tool with nothing to stop it."
series:
  name: "AI Tool of the Day"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-02-tool-mcp-spend-guard)

## Tool Info

| Field | Value |
|---|---|
| Name | mcp-spend-guard |
| Type | MCP stdio proxy (spend cap + rate limit + circuit breaker + kill switch) |
| GitHub | [waseemnasir2k26/mcp-spend-guard](https://github.com/waseemnasir2k26/mcp-spend-guard) |
| Stars | 1 |
| Language | Python |
| License | MIT |
| Install | `pipx install .` (or `pip install .`, not yet on PyPI) |

## What Problem Does It Solve

Have you ever wired up an MCP server and just trusted the agent to decide how many times it should call it? MCP itself has no built-in rate limiting — an agent stuck in a loop can hammer the same paid tool (a search API, image generation, an enterprise SaaS call) hundreds of times before you notice, usually only when you check the bill or the logs. It gets worse: if a fetched web page carries a prompt injection that tells the model to call an expensive enrichment tool on every row of a CSV, that attack doesn't require the agent itself to be "broken" — and the client side has no mechanism to stop it either.

mcp-spend-guard is a stdio JSON-RPC relay that sits between the MCP client and the real MCP server. It spawns the real server as a child process and forwards JSON-RPC frames line by line; the only requests it ever withholds are `tools/call` requests that trip a cap. Caps live in a YAML file — total calls, calls per minute, an estimated spend ceiling (you fill in a per-tool unit price), a wall-clock timeout, plus a circuit breaker that trips after N consecutive tool errors. All counters live in local SQLite, so a restart or a reconnecting client doesn't reset them to zero. Need to hit the brakes right now? `touch STOP` from another terminal — no config change, no restart.

Good fit: your agent calls any MCP tool that's billed per call or has a clear cost attached (search, image generation, a paid third-party API), and you want a hard stop that doesn't depend on the agent's self-restraint or require you to write throttling logic in your own application layer. Or you simply want to know how many calls a session made and how much it cost — run `mcp-spend-guard report` and you have the answer.

## Quick Start

### Installation

```bash
pipx install .        # or: pip install .
```

### Basic Usage

```yaml
# guard.yaml
server:
  command: npx
  args: ["-y", "@acme/search-mcp"]

limits:
  max_calls_total: 200
  max_calls_per_minute: 30
  max_spend_usd: 5.00

costs:
  tools:
    web_search: 0.01

safety:
  kill_switch_file: ./STOP
  circuit_breaker_errors: 5
```

```diff
 {
   "mcpServers": {
     "search": {
-      "command": "npx",
-      "args": ["-y", "@acme/search-mcp"]
+      "command": "mcp-spend-guard",
+      "args": ["run", "-c", "/abs/path/to/guard.yaml"]
     }
   }
 }
```

```bash
# See how much this session spent and how many calls were blocked
mcp-spend-guard report
```

### Advanced Usage

```bash
# Freeze every call instantly from another terminal
touch STOP
# Resume normal operation
rm STOP
```

Whichever cap trips first returns a clean JSON-RPC error immediately — the agent doesn't hang, it gets an explicit reason for the refusal:

```json
{"jsonrpc":"2.0","id":3,"error":{"code":-32011,
 "message":"mcp-spend-guard blocked this call [max_spend_usd]: spend cap reached: $0.2000 estimated spend, this call adds $0.1000, limit $0.2500",
 "data":{"cap":"max_spend_usd","limit":0.25,"current":0.2,"tool":"web_search","guard":"mcp-spend-guard"}}}
```

## Comparison with Alternatives

| | mcp-spend-guard | Hand-rolled throttling in your app layer | LLM provider usage caps (OpenAI/Anthropic account-level) | mcp-guardrail (tool-level allow/deny) |
|---|---|---|---|---|
| Spend cap scoped to a single MCP tool | ✅ | Requires custom code | ❌ (governs model tokens, not downstream MCP tools) | ❌ (governs whether a tool can be called, not how expensive it is) |
| Counters survive restarts/reconnects | ✅ (SQLite) | Requires custom code | ✅ (provider-side) | Depends on implementation |
| One-file emergency stop | ✅ (kill switch file) | Requires custom code | ❌ (usually requires a dashboard change) | ❌ |
| Works with any MCP server you swap in | ✅ (proxy layer, server-agnostic) | — | — | ✅ (also a proxy layer) |
| Solves "which tools can be called" vs. "called too much/too expensive" | Governs spend/call count only | — | — | Governs permissions only — complementary, not a substitute |

## Caveats

- **Cost is estimated, not billed.** You fill in the per-tool unit price yourself in `costs.tools` — the guard has no visibility into any provider's actual invoice. If your estimate is wrong, the cap is wrong; treat it as a circuit breaker, not accounting.
- **stdio only, for now.** MCP servers using HTTP/SSE transports aren't wrapped yet — the README lists this as a planned feature.
- **Per-call granularity, not per-token.** Tools whose real cost scales with input size can't be modeled precisely. Wrapping five servers on one machine means five separate configs, and budgets aren't pooled across them unless you deliberately share the same `db_path` and `session_id`. It's less than a day old with a single contributor and 1 star, so the config schema may still change.

## Takeaway

The MCP ecosystem has spent the past year filling in the permission layer — which server an agent can connect to, which tools it can call (like mcp-guardrail, covered here last week). But "how much did calling it actually cost, and can it be stopped" is a completely separate axis — permissions can't answer "was this worth it," only a metering layer can. Stack the two together, and "should the agent be allowed to use this tool right now" finally becomes a boundary a human can actually hold.

## References

- [mcp-spend-guard GitHub repo](https://github.com/waseemnasir2k26/mcp-spend-guard): project overview, README, install instructions, config schema, architecture, and license (MIT) — all sourced from the official README.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): MCP protocol introduction.
