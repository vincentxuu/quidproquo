---
title: "Tool of the Day｜AnythingMCP — turn the systems your company never built an MCP server for into MCP tools"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hosted, open-source MCP gateway that imports a REST/SOAP/GraphQL/OData/SQL spec and auto-generates MCP tools, so you never write an MCP server by hand"
tldr: "AnythingMCP is an open-source, self-hostable MCP gateway under AGPL-3.0: import an OpenAPI spec, a SOAP/WSDL service, GraphQL, OData, or a database schema, and it turns every operation into an MCP tool that Claude, ChatGPT, or Copilot can call. Install: `docker compose up -d` with the official quickstart compose file. It solves the problem of every ERP, legacy SOAP service, and in-house REST API in a company having no MCP server, and nobody wanting to hand-write one for each system."
series:
  name: "AI Tool of the Day"
  order: 72
---

> 🌏 [中文版](/posts/daily/2026-11-03-tool-anythingmcp)

## Tool info

| Item | Value |
|---|---|
| Name | AnythingMCP |
| Type | MCP server (self-hosted MCP gateway) |
| GitHub | [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp) |
| Stars | 771 |
| Language | TypeScript (NestJS backend + Next.js frontend, monorepo) |
| License | AGPL-3.0-only (the `ee/` directory ships under a separate commercial license — see `LICENSING.md`) |
| Install | `docker compose up -d` (with the official `docker-compose.quickstart.yml`) |

## What problem it solves

Most companies have more than one system an AI agent would love to query and can't: an ERP (SAP, Odoo), a SOAP service nobody's touched since 2009, an in-house REST API, a PostgreSQL box that only the internal network can reach. None of them has an MCP server. Hooking Claude or ChatGPT up to any of them means writing one by hand — and doing that again for every single system: parsing the API spec, wiring up auth, reshaping the response into something the model can read.

AnythingMCP turns that hand-written chore into configuration. Point it at an OpenAPI/Swagger spec, a WSDL file, a GraphQL endpoint, a Postman collection, or just connect a SQL database or MongoDB directly, and it registers every operation as an MCP tool at runtime — no restart needed. It also ships 694 ready-made adapters out of the box (SAP S/4HANA, Odoo, WooCommerce, Amazon Seller, and more), 35 of which need no API key to try. Once the tools exist, an admin can rename and redescribe them in a visual editor, strip out fields before they ever reach the model, and decide which role may call which tool — every call gets logged.

```diagram
title: How AnythingMCP turns legacy systems into MCP tools
desc: ERP, REST/SOAP API, and SQL database specs are each imported into AnythingMCP's connector catalog, which generates MCP tools; a governance layer filters fields and enforces role permissions before Claude, ChatGPT, and other AI clients call them through one MCP endpoint.
caption: Simplified: omits the knowledge graph, company memory, and Code Mode's sandboxed execution layer.
---
<svg viewBox="0 0 700 480">
  <rect class="dg-zone" x="212" y="16" width="320" height="448" rx="8"/>
  <text class="dg-tag" x="228" y="38" dominant-baseline="central">ANYTHINGMCP (SELF-HOSTED)</text>

  <path class="dg-line" d="M168 110H236" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 210H236" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 310H236" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M366 360V384" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M496 416H576" marker-end="url(#arrow-link)"/>

  <rect class="dg-box" x="20" y="82" width="148" height="56" rx="6"/>
  <text class="dg-label" x="94" y="102" text-anchor="middle" dominant-baseline="central">ERP／SAP, Odoo</text>
  <text class="dg-sub" x="94" y="122" text-anchor="middle" dominant-baseline="central">OData／SQL spec</text>

  <rect class="dg-box" x="20" y="182" width="148" height="56" rx="6"/>
  <text class="dg-label" x="94" y="202" text-anchor="middle" dominant-baseline="central">REST／SOAP／GraphQL</text>
  <text class="dg-sub" x="94" y="222" text-anchor="middle" dominant-baseline="central">OpenAPI／WSDL</text>

  <rect class="dg-box" x="20" y="282" width="148" height="56" rx="6"/>
  <text class="dg-label" x="94" y="302" text-anchor="middle" dominant-baseline="central">SQL／MongoDB</text>
  <text class="dg-sub" x="94" y="322" text-anchor="middle" dominant-baseline="central">in-house database</text>

  <rect class="dg-box dg-box--store" x="236" y="60" width="260" height="300" rx="6"/>
  <text class="dg-label" x="366" y="200" text-anchor="middle" dominant-baseline="central">Connector catalog</text>
  <text class="dg-sub" x="366" y="222" text-anchor="middle" dominant-baseline="central">694 adapters, registered as MCP tools at runtime</text>

  <rect class="dg-box dg-box--accent" x="236" y="384" width="260" height="64" rx="6"/>
  <text class="dg-label" x="366" y="406" text-anchor="middle" dominant-baseline="central">Governance layer</text>
  <text class="dg-sub" x="366" y="428" text-anchor="middle" dominant-baseline="central">roles・field filtering・audit log</text>

  <rect class="dg-box" x="576" y="388" width="104" height="56" rx="6"/>
  <text class="dg-label" x="628" y="408" text-anchor="middle" dominant-baseline="central">AI client</text>
  <text class="dg-sub" x="628" y="428" text-anchor="middle" dominant-baseline="central">Claude／ChatGPT</text>

  <text class="dg-edge" x="536" y="404" text-anchor="middle" dominant-baseline="central">MCP endpoint</text>
</svg>
```

It fits companies that want several AI clients (Claude, ChatGPT, Copilot, Gemini) to share one access layer into internal systems while keeping centralized control over who can call what and which fields never leave the network — or anyone sitting on a pile of not-yet-MCP'd legacy systems (SOAP, OData, an internal database) who wants to wire them up fast, either from a ready adapter or by importing their own spec.

## Quick start

### Install

```bash
mkdir anythingmcp && cd anythingmcp
curl -fsSLo docker-compose.yml \
  https://raw.githubusercontent.com/HelpCode-ai/anythingmcp/main/docker-compose.quickstart.yml
printf 'JWT_SECRET=%s\nENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > .env
docker compose up -d
```

Open `http://localhost:3000` and register — the first account becomes admin. Your MCP endpoint is `http://localhost:4000/mcp`, and the API docs live at `http://localhost:4000/api/docs`. Keep that generated `.env`: `ENCRYPTION_KEY` decrypts every stored credential, and losing it means re-credentialing every connector.

### Basic usage

1. In the dashboard, pick a ready-made adapter (Odoo, say), or paste your own API's OpenAPI/WSDL/GraphQL spec.
2. In the visual editor, choose which operations to expose, strip the fields that shouldn't reach the model, and set which role may call which tool.
3. Add the resulting MCP endpoint URL (`http://your-host:4000/mcp`) to Claude under *Customize → Connectors*, or any MCP-capable client.

### Advanced usage

Code Mode lets an agent collapse several tool calls into one short program, run inside an isolated code-runner container with no filesystem, network, or environment access — it can only call tools the caller already has permission to use:

```js
// Discover tools, read a schema, call a tool — scoped to the caller's own permissions
const schema = await amcp.describe('list_invoices');
const invoices = await amcp.run('list_invoices', { customerId: args.customerId });
return invoices.filter((i) => i.status === 'open').map((i) => i.id);
```

Code Mode is off by default; an admin has to enable it at the workspace level (`codeMode`), and it requires running a separate code-runner service.

## Compared to existing tools

| | AnythingMCP | Composio | n8n |
|---|---|---|---|
| License | Open source, AGPL-3.0 (`ee/` separate) | SDK is MIT, but the platform itself is closed and runs on the vendor's cloud | Source-available "fair-code" (Sustainable Use License, not OSI open source) |
| Full feature set when self-hosted | ✅ `docker compose up` is the full version | ❌ Self-hosting is an Enterprise-only arrangement through sales; self-serve plans store credentials on Composio's cloud | ✅ (but you manage credentials and ops yourself) |
| Auto-generates MCP tools from existing REST/SOAP/OData/SQL specs | ✅ import a spec and tools appear, 694 ready adapters | Leans on an auto-generated SaaS toolkit; SOAP/OData/self-hosted databases aren't the focus | ❌ a workflow automation platform — MCP is just one node/trigger, you wire the integration logic yourself |
| Built-in role permissions, field filtering, and audit logging | ✅ set directly in the visual editor | configured separately | you build it yourself with workflows |

## Things to watch

- **AGPL-3.0's network clause**: if you modify the source and let others use that modified version over a network (say, running it as a public SaaS), the license requires publishing that source. Self-hosting inside your own company usually doesn't trigger this, but read `LICENSING.md` before any commercial use.
- **Free self-hosting caps out at 3 active users**: the Community edition is free to self-host, but once you go past 3 accounts, or want File Search, company memory, or SSO — all labeled Cloud or Enterprise — you need a paid license.
- **Docker image is amd64-only for now**: on Apple Silicon, compose runs it under platform emulation, not native arm64. The quickstart binds to `127.0.0.1` on purpose; to let other people or a cloud AI client reach it, follow `docs/deployment.md` and run `setup.sh` to set up a domain and TLS.
- **Code Mode is off by default**: it needs a separate code-runner service and a workspace-level toggle before an agent can collapse multiple tool calls into one program.

## Today's takeaway

Gateways like this that "import a spec, auto-generate MCP tools" point at something real: the barrier to hooking a system up to an AI agent has shifted from "did someone hand-write an MCP server for this" to "does this system have a public API spec to import." The mechanical conversion — OpenAPI to tool — is basically solved now; what actually separates these tools is the governance layered on top of it: who can call which tool, which fields must never leave the company network, and whether every call leaves an audit trail. That's a different bet than Composio folding credentials and governance into its own cloud, or n8n treating MCP as just one node in a workflow.

## References

- [HelpCode-ai/anythingmcp — GitHub](https://github.com/HelpCode-ai/anythingmcp)
- [AnythingMCP README](https://github.com/HelpCode-ai/anythingmcp/blob/main/README.md)
- [LICENSE (AGPL-3.0-only)](https://github.com/HelpCode-ai/anythingmcp/blob/main/LICENSE)
- [LICENSING.md (the AGPL / `ee/` commercial-license boundary)](https://github.com/HelpCode-ai/anythingmcp/blob/main/LICENSING.md)
- [Code Mode docs](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/code-mode.md)
- [Best self-hosted API integration platforms for AI agents — Nango (on Composio's Enterprise-only self-hosting)](https://nango.dev/blog/best-self-hosted-api-integration-platforms-for-ai-agents)
- [n8n — Wikipedia (on the fair-code / Sustainable Use License)](https://en.wikipedia.org/wiki/N8n)
