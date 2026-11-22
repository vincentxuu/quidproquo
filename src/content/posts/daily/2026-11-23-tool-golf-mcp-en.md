---
title: "Tool of the Day: Golf — Cuts MCP Server Auth, Telemetry and Deployment from 2-4 Weeks to 60 Seconds"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "Golf is an open-source Python framework for MCP servers: write a function inside a tools/ directory, golf build generates the schema, and golf run gives you a server with JWT/OAuth auth and OpenTelemetry tracing already wired in — skipping the plumbing teams keep rebuilding from scratch"
tldr: "Golf is a Python framework — pip install golf-mcp plus golf init gets you running in five minutes. It defines MCP tools from a file layout and ships with built-in auth and telemetry config. It solves the problem of every team rewriting the same auth, tracing, and deployment logic for MCP servers, which the Golf team found takes 2-4 weeks on average."
series:
  name: "AI Tool of the Day"
  order: 87
---

> :globe: [中文版](/posts/daily/2026-11-23-tool-golf-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | Golf |
| Type | Python framework + CLI |
| GitHub | [golf-mcp/golf](https://github.com/golf-mcp/golf) |
| Stars | 842 (checked 2026-11-22) |
| Language | Python |
| License | Apache-2.0 |
| Install | `pip install golf-mcp` |

## The Problem It Solves

Your team has decided to build an MCP server — maybe wrapping an internal API for agents to call, or exposing a tool for Claude or Cursor to connect to. Writing the tool function itself isn't hard. What eats the time is everything after that: how to authenticate callers (JWT? OAuth?), how to trace how long each call took and where it failed, and how to turn the whole thing into something that runs as a long-lived server instead of a local script. The Golf team interviewed more than 40 teams building MCP servers and landed on a number: that plumbing layer takes 2-4 weeks on average, and nearly every team ends up rebuilding the same thing.

Golf's approach separates "defining" from "running." You write ordinary Python files under `tools/`, `resources/`, and `prompts/` — one file, one MCP component. The module's docstring becomes the component's description, the function's parameters are inferred into the input schema, and a returned Pydantic model becomes the output schema. `golf build` compiles these files into a runnable server, and `golf run` starts it (defaulting to `localhost:3000`). Authentication — JWT, an OAuth 2.0 server mode, or a dev-only static token — lives in the same project's `auth.py`; tracing turns on through environment variables for OpenTelemetry, with nothing extra to wire up. Under the hood it's built on FastMCP 4.0.0 and the MCP 2026-07-28 protocol, not a from-scratch protocol implementation.

Good fit: a team that wants to stand up an internal-facing MCP server quickly and needs auth without redesigning an OAuth flow each time, or a team already writing tools in FastMCP that has never had time to bolt on telemetry and deployment.

## Quickstart

### Install

```bash
# Requires Python 3.10+
pip install golf-mcp

# Scaffold a project (ships with example tool/resource/prompt)
golf init my-project
cd my-project
```

### Basic usage

```python
# tools/hello.py
"""Say hello to someone."""

from pydantic import BaseModel, Field


class Output(BaseModel):
    message: str


async def hello(
    name: str = Field(default="World", description="Name to greet"),
    greeting: str = Field(default="Hello", description="Greeting word"),
) -> Output:
    msg = f"{greeting}, {name}!"
    print(msg)
    return Output(message=msg)


export = hello
```

```bash
# Build and start (defaults to http://localhost:3000)
golf build dev
golf run
```

File paths decide component IDs: `tools/hello.py` becomes `hello`, and `tools/payments/submit.py` becomes `submit_payments`.

### Advanced usage (optional)

```python
# auth.py — JWT for production
from golf.auth import configure_auth, JWTAuthConfig

configure_auth(
    JWTAuthConfig(
        jwks_uri_env="AUTH_JWKS_URI",
        issuer_env="AUTH_ISSUER",
        audience_env="AUTH_AUDIENCE",
        required_scopes=["mcp:invoke"],
    )
)
```

```bash
# Turn on OpenTelemetry tracing (after setting opentelemetry_enabled: true in golf.json)
export OTEL_EXPORTER=otlp_http
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
golf run
```

## Comparison with Existing Tools

| | Golf | FastMCP (plain) | Official MCP Python SDK |
|---|---|---|---|
| File-as-component (no manual registration) | ✓ | ✗ (manual `@mcp.tool` decorator) | ✗ (same decorator pattern) |
| Built-in auth config (JWT / OAuth server) | ✓ | Not in the open-source library; routed through the separate commercial FastMCP Gateway | Not included, not documented |
| Built-in OpenTelemetry switch | ✓ (env-var toggle) | Not in the open-source library | Not included |
| CLI scaffolding (`init`/`build`/`run`) | ✓ | ✗ (no equivalent commands) | Has `mcp dev`/`mcp run`/`mcp install`, but no auth/telemetry |
| Requires hand-written JSON Schema | ✗ (type inference) | ✗ (type inference) | ✗ (type signature is the schema) |

Golf sits on top of FastMCP and adds a layer of convention (file layout) plus a layer of configuration (auth, telemetry), trading "deciding how this project's MCP server authenticates" for "learning one more framework" — and its auth approach was a breaking change from v0.1.x.

## Things to Watch

- **Don't forward inbound tokens upstream as-is.** The README is explicit: the MCP bearer token is scoped to this MCP resource. Calling an upstream API should use a separate credential or a standards-based token exchange/delegation flow, not a direct pass-through.
- **Static tokens are dev-only.** Switch to JWT or OAuth server mode before production.
- **`detailed_tracing` captures full inputs and outputs.** Turn it off for tools handling sensitive data, or it ends up written straight into your traces.
- **SSE transport is deprecated,** kept only for legacy client compatibility; new projects should use `streamable-http`.
- **The CLI collects anonymous usage data** (commands run, success/failure, Golf version, OS, Python version) — no code or error messages. Disable with `golf telemetry disable` or `--no-telemetry`.

## Today's Takeaway

The MCP protocol solves "how to describe a tool" — it doesn't solve "how this tool gets called with any trust guarantees." Auth, tracing, and deployment are production concerns left outside the protocol, so every team ends up reinventing a layer on top of it. Golf isn't another MCP SDK; it's the layer everyone keeps rewriting, extracted into a convention. That's the same move Vercel made for Node servers: a framework's value isn't in the protocol itself, it's in the stuff around the protocol nobody wants to rebuild but everyone has to write.

## References

- [golf-mcp/golf — GitHub](https://github.com/golf-mcp/golf)
- [golf-mcp/golf — README](https://raw.githubusercontent.com/golf-mcp/golf/main/README.md)
- [golf-mcp package — PyPI](https://pypi.org/project/golf-mcp/)
- [Launch YC: Golf — Open-source platform for shipping production MCP servers](https://ycombinator.com/launches/NYn-golf-open-source-platform-for-shipping-production-mcp-servers)
- [jlowin/fastmcp — GitHub](https://github.com/jlowin/fastmcp)
- [modelcontextprotocol/python-sdk — GitHub](https://github.com/modelcontextprotocol/python-sdk)
