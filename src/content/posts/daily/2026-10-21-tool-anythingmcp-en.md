---
title: "Tool Pick｜AnythingMCP — Turn ERPs, SOAP Services and SQL Databases into MCP Tools"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hosted, AGPL-3.0 MCP gateway that ingests OpenAPI, SOAP, GraphQL and SQL sources plus 517 ready-made ERP/e-commerce adapters, generating MCP tools without writing a server, complete with RBAC, SSO, audit logs and response-field filtering"
tldr: "AnythingMCP is a self-hosted MCP gateway that turns REST, SOAP, GraphQL, OData and SQL databases into MCP tools, with 517 ready-made ERP/e-commerce adapters. Install: `docker compose up -d` with the official quickstart compose file. It solves the problem of internal systems having no MCP server, forcing every team to hand-write its own tool-translation layer."
series:
  name: "AI Tool of the Day"
  order: 61
---

> 🌏 [中文版](/posts/daily/2026-10-21-tool-anythingmcp)

## Tool Info

| Item | Value |
|---|---|
| Name | AnythingMCP |
| Type | MCP server (self-hosted MCP gateway that auto-generates tools from existing systems) |
| GitHub | [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp) (today's GitHub Trending Repository of the Day) |
| Stars | 772 |
| Language | TypeScript |
| License | AGPL-3.0 (the cloud-operator code under `ee/` is licensed separately and isn't needed for self-hosting) |
| Install | `docker compose up -d` with the official quickstart compose file |

## What Problem It Solves

Most companies only have MCP servers for one or two systems. Everything else is a plain REST API, a decade-old SOAP service, a SAP instance, or just a table you need to query directly. Getting an agent to touch any of that traditionally means hand-writing an MCP server for each one — defining tool schemas, handling auth, deciding which fields are safe to hand back to the model. The more systems you connect, the more that repetitive work piles up: you parse the WSDL yourself, convert OpenAPI specs into tool definitions yourself, and block writes on SQL queries yourself.

AnythingMCP removes that hand-writing step entirely. Hand it an OpenAPI spec, a WSDL, a GraphQL endpoint, or a database connection string, and it turns every operation into an MCP tool at runtime — no restart needed. It also ships 517 ready-made adapters (SAP, Odoo, WooCommerce, Amazon Seller, DHL, and more), so adding one is mostly a matter of pasting an API key. More importantly, it makes "which fields the model gets to see" an editable response-mapping layer: the official example shows one order response filtered from 12,172 bytes down to 1,072 bytes — cutting context cost along with it.

Good fit: a team with several internal systems that have no MCP server of their own (ERP, CRM, SOAP services, databases), wanting Claude, ChatGPT or Cursor to reach all of them through one endpoint, while still needing RBAC, SSO and audit logs to satisfy internal security requirements. If you only need to connect one or two services that already ship an official MCP server (GitHub or Slack, say), installing that server directly is simpler than running an extra gateway.

## Quick Start

### Install

```bash
mkdir anythingmcp && cd anythingmcp
curl -fsSLo docker-compose.yml \
  https://raw.githubusercontent.com/HelpCode-ai/anythingmcp/main/docker-compose.quickstart.yml
printf 'JWT_SECRET=%s\nENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > .env
docker compose up -d
# Open http://localhost:3000 and register — the first account becomes admin
# MCP endpoint: http://localhost:4000/mcp
```

Requires Docker 24+; the amd64 image runs under emulation on Apple Silicon. The image pulls in about 30 seconds, and the API is healthy roughly 24 seconds later.

### Basic Usage

```bash
# Add the gateway to Claude Code
claude mcp add --transport http anythingmcp http://localhost:4000/mcp
```

Then, in the web UI, install an adapter (say, WooCommerce), paste in the API key, and pick which roles can call which tools — the tool list Claude sees updates live, with no need to reconnect. Every operation on every adapter becomes its own tool, tagged with `readOnlyHint` / `destructiveHint`.

### Advanced Usage

```json
{
  "transform": {
    "mode": "select",
    "fallbackToRaw": false,
    "exclude": ["customer.iban", "customer.taxId"],
    "select": { "order": "$.id", "total": "$.amounts.gross", "status": "$.state" }
  }
}
```

This is a response-mapping config: it tells a tool exactly which fields to return. `fallbackToRaw: false` makes sure that a misconfigured mapping fails the call outright, instead of silently leaking the full raw response — which might include an IBAN or a tax ID — to the model.

## Comparison with Existing Tools

| | AnythingMCP | A hand-written single-purpose MCP server | AI Agent Gateway ([previously covered](/posts/daily/2026-10-10-tool-ai-agent-gateway)) |
|---|---|---|---|
| Auto-generates tools from existing APIs/ERPs/DBs | ✅ | ❌ (every system is written by hand) | ❌ (assumes the tools are already MCP servers) |
| 517 ready-made adapters | ✅ | ❌ | ❌ |
| RBAC + SSO + audit logs | ✅ | Build it yourself | ✅ (this is its core function) |
| Response-field filtering (keeps sensitive data out of context) | ✅ | Build it yourself | ❌ (doesn't touch tool response content) |
| Self-hosted, open source | ✅ (AGPL-3.0) | Depends on the project | ✅ (Apache-2.0) |

The two can actually be layered: AnythingMCP turns legacy systems into MCP tools, while AI Agent Gateway handles credential injection and auditing across multiple agents.

## Things to Watch For

- **AGPL-3.0's copyleft obligation**: self-hosting inside your own company isn't affected, but if you modify AnythingMCP itself and offer the modified version to others over a network, you have to open-source those changes. Plain internal deployment for your own use doesn't trigger this.
- **Some adapters are marked with †**: adapters flagged this way in the README (OTTO Market, Zalando Direct Ship, Sage 100, and others) were built from vendor-published API docs and haven't been exercised against a live tenant yet — your first connection may need some debugging.
- **The quickstart binds to `127.0.0.1` only**: there's no TLS termination, so it's local-testing only. To let a team or a cloud AI client reach it, follow the Deployment Guide and run `./setup.sh` (which provisions certificates through Caddy).

## Today's Takeaway

I used to assume "wiring MCP into a system" meant waiting for that system's own maintainer to ship an official MCP server. AnythingMCP made it click that an adapter is fundamentally just a JSON config file, and parsing OpenAPI/WSDL specs can be generalized — turning "write an MCP server" from a coding problem into a configuration problem.

## References

- [HelpCode-ai/anythingmcp — GitHub](https://github.com/HelpCode-ai/anythingmcp)
- [AnythingMCP homepage](https://anythingmcp.com/)
- [License FAQ (AGPL-3.0 details)](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/license-faq.md)
- [REST / OpenAPI connector docs](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/connectors/rest.md)
- [Deployment Guide](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/deployment.md)
