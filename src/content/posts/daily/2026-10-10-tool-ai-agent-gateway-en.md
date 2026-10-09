---
title: "Tool Pick｜AI Agent Gateway — an open-source gateway for credential and audit control over agent MCP/LLM calls"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source gateway that sits between agents and both MCP tool servers and LLM providers, authenticating with its own API keys, scoping tool access per agent profile, and injecting real credentials from an encrypted store so callers never see them"
tldr: "AI Agent Gateway is Tuskira's open-source gateway between agents and MCP tool servers / LLM providers. Install: docker compose -f deploy/docker-compose.yml up --build -d. It solves the problem of credentials pasted into every agent's MCP config, with tool access that was otherwise all-or-nothing."
series:
  name: "AI Tool of the Day"
  order: 50
---

> 🌏 [中文版](/posts/daily/2026-10-10-tool-ai-agent-gateway)

## Tool info

| Item | Value |
|---|---|
| Name | AI Agent Gateway |
| Type | Gateway (auth, credential injection and audit layer for MCP tool calls + LLM traffic) |
| GitHub | [Tuskira/ai-agent-gateway](https://github.com/Tuskira/ai-agent-gateway) |
| Stars | 74 (created 2026-10-01, an official Tuskira project) |
| Language | Go (backend) + Node.js (bundled console) |
| License | Apache-2.0 |
| Install | `docker compose -f deploy/docker-compose.yml up --build -d` |

## What problem it solves

When an agent needs to reach GitHub, Jira, or an internal database, the standard move is to write the connection details and credentials straight into its MCP config — pasting an API key or token into the JSON that `claude mcp add` produces. That's fine for one agent with one credential. It stops being fine once a team runs several agents against several MCP servers: credentials end up scattered across every agent's config file, each expiring and rotating on its own schedule. Revoking one agent's access to one tool means first finding every config that credential is pasted into. Auditing "who deleted that repo through an agent last week" means digging through each MCP server's own logs. Worse, MCP's `tools/list` only lists what's available — it doesn't enforce anything. A tool being absent from the list an agent sees doesn't mean a call to it is actually blocked, and plenty of thin wrapper tools only filter at the listing level, leaving the call path wide open.

AI Agent Gateway pulls that whole path into one process. Agents stop connecting directly to MCP servers and LLM providers; they call the gateway with a gateway-issued API key, and the gateway is the only thing that holds the real credentials, pulled from an encrypted secret store, to reach the actual backend — the caller never sees them. Access isn't "filtered out of a list"; it's defined on an agent profile and enforced on **every `tools/call`**: a call outside the profile's allow-list gets a JSON-RPC `-32003` rejection, not a quiet omission from some list. LLM calls — direct to Anthropic, or through Bedrock, OpenAI, Gemini — go through the same gateway, which also logs token usage and an estimated cost per call. Three planes run separately: `:8080` for MCP traffic, `:8081` for the control API and bundled console, `:8082` for LLM traffic.

It fits teams running several agents against a shared set of MCP servers — GitHub, Jira, an internal database, all wired up — who want fine-grained control ("this agent profile can read issues but can't delete a repo") and an audit trail proving who called what. If you're running a single agent against your own dev environment, this layer is overkill; connecting directly to the MCP server is cheaper than standing up a Postgres-backed Go service in front of it.

## Getting started

### Install

```bash
# Needs Docker + the Compose plugin, at least 4GB free RAM
git clone https://github.com/Tuskira/ai-agent-gateway.git
cd ai-agent-gateway
docker compose -f deploy/docker-compose.yml up --build -d

# wait for all three planes
until curl -sf localhost:8081/api/v1/health >/dev/null; do sleep 1; done
curl localhost:8080/health          # MCP plane
curl localhost:8081/api/v1/health   # control plane + console
curl localhost:8082/health          # LLM plane
```

Then create the first admin account:

```bash
docker compose -f deploy/docker-compose.yml exec gateway /gateway bootstrap-key
docker compose -f deploy/docker-compose.yml exec gateway /gateway create-user \
  -tenant default -username admin -role admin
```

`bootstrap-key` prints an admin API key exactly once — save it. `create-user` prints a one-time temporary password; log in at `http://localhost:8081` and you'll be asked to change it.

### Basic usage

Register an MCP server from the console's **MCPs → Catalog**, grab the gateway's own MCP endpoint config, and drop it into your agent:

```json
{
  "mcpServers": {
    "gateway": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer <your API key>",
        "X-Agent-Profile-Name": "read-only-analyst"
      }
    }
  }
}
```

Without `X-Agent-Profile-Name`, every tool in the tenant is visible and callable by default (`mcp.require_profile: false` is the default) — to narrow access you need a profile plus this header, or better, bind the API key directly to a profile.

### Advanced usage

Bind an API key to a profile so it only ever gets that profile's allow-list, no matter what header it sends:

```bash
curl -X PATCH http://localhost:8081/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $GATEWAY_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"profile_id": "'$PROFILE_ID'"}'

# then set the profile's allowed tools (SetTools replaces the list, it doesn't merge)
curl -X PUT http://localhost:8081/api/v1/profiles/$PROFILE_ID/tools \
  -H "Authorization: Bearer $GATEWAY_ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"tools": [{"connector_id": "'$CONNECTOR_ID'", "tool_name": "get_issue"}]}'
```

Once bound, a caller lying about which profile it wants in the header doesn't matter — the gateway only honors the bound one. That's what actually confines a key to a scope; the header alone only constrains cooperative agents, not a call that's deliberately trying to work around it.

## How it compares

| | AI Agent Gateway | Credentials pasted into every MCP config | Generic cloud secret managers (Vault, AWS Secrets Manager) |
|---|---|---|---|
| Caller never sees the real backend credential | ✅ injected from an encrypted store | ❌ the credential sits in the config file | Partial — secrets are centralized, but who can use which secret still needs its own wiring |
| Tool-level access control (which key can call which tool) | ✅ profile enforced on every `tools/call` | ❌ all-or-nothing | ❌ not a concept at the MCP protocol layer |
| LLM calls under the same governance | ✅ one proxy for Anthropic/Bedrock/OpenAI/Gemini | ❌ | ❌ usually manages keys, not traffic |
| Built-in access logs + cost tracking | ✅ bundled console | ❌ you wire up each service's own logs | Partial — secret-access logs, no LLM call detail |
| Works with no self-hosting | ❌ you run Postgres + a Go service | ✅ | ✅ (managed) |

## Things to watch

- **Still pre-1.0, alpha.** The README says so directly: APIs and config schemas can still change between minor versions. Watch the changelog and release notes before relying on today's profile/connector schema as a stable contract.
- **The `X-Agent-Profile-Name` header alone isn't real isolation.** It's self-declared by the caller, so it only constrains agents that cooperate. To actually lock a key into a scope, bind it to a profile via `profile_id` — otherwise a misbehaving or buggy caller can just name a different profile.
- **It blocks all outbound connections to internal/loopback addresses by default** (including cloud metadata at `169.254.169.254`) — deliberate SSRF protection, but it means reaching an MCP server on localhost or a private network needs an explicit `egress.allowed_cidrs` / `egress.allowed_hosts` entry. First-time setups often get stuck here, with the MCP server clearly running and the gateway insisting it can't connect.
- **It's not a lightweight thing to run.** PostgreSQL is required, ClickHouse is needed for the analytics dashboard, and scaling the MCP plane to multiple replicas needs a Redis-compatible session store (the examples use Valkey). For a solo developer or small team, that's real operational overhead, not a single binary you drop somewhere.

## Today's takeaway

Most "wire tools up to an agent" setups conflate three different things into one key: an API key doubles as both identity ("who are you") and authorization ("what can you see"), because that same key is the real backend credential. AI Agent Gateway's design is to split those three layers apart — the gateway's own API key proves identity, an agent profile decides which tools are callable, and the credential that actually reaches the backend lives in an encrypted store the caller never touches. And the enforcement point matters: it checks on `tools/call`, not `tools/list`. That distinction is the whole argument — filtering a list is a suggestion an agent can ignore; denying a call is a control.

## References

- [Tuskira/ai-agent-gateway — GitHub](https://github.com/Tuskira/ai-agent-gateway)
- [AI Agent Gateway — docs/profiles.md (agent profile allow-lists and enforcement)](https://github.com/Tuskira/ai-agent-gateway/blob/main/docs/profiles.md)
- [AI Agent Gateway — docs/security-model.md (SSRF protection and egress allowlisting)](https://github.com/Tuskira/ai-agent-gateway/blob/main/docs/security-model.md)
- [AI Agent Gateway: Open-source tool keeps credentials out of agent configs — Help Net Security](https://www.helpnetsecurity.com/2026/10/07/open-source-ai-agent-gateway/)
- [Model Context Protocol specification](https://modelcontextprotocol.io)
