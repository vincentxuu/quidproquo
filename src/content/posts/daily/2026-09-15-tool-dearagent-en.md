---
title: "Tool Pick | DearAgent — Give Your Agent Its Own Inbox, Running on Your Own Cloudflare Account"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source, AGPL-3.0 email inbox API that runs as a single Cloudflare Worker — receiving, waiting for codes, searching, replying, and webhooks all inside your own account — a self-hosted alternative to AgentMail"
tldr: "DearAgent is an open-source email inbox API that runs on Cloudflare Workers, with a built-in MCP server so an agent can create an inbox, wait for a verification code, search, and reply. Install: git clone then npm run setup for an interactive deploy, or just try the live demo at dearagent.sh. It solves the problem of agents that need a real inbox for signup flows without wanting to depend on a third-party hosted service."
series:
  name: "AI Tool of the Day"
  order: 30
---

> 🌏 [中文版](/posts/daily/2026-09-15-tool-dearagent)

## Tool Info

| Field | Value |
|---|---|
| Name | DearAgent |
| Type | MCP server + REST API (self-hosted on Cloudflare Workers) |
| GitHub | [panda-sandeep/dearagent](https://github.com/panda-sandeep/dearagent) |
| Stars | 23 |
| Language | TypeScript |
| License | AGPL-3.0 |
| Install | `git clone https://github.com/panda-sandeep/dearagent && cd dearagent && npm install && npm run setup` |

## What Problem It Solves

Say you're building an agent that runs signup flows for a user — filling out a form on some site, receiving a verification email, pasting the code back in to finish registering. For that, the agent needs a real, working email address. Using your own inbox mixes test traffic with real mail and gives you no way to hand out a clean, disposable address per agent or per run. Reaching for a hosted "agent inbox" SaaS like AgentMail solves that, but now your mail lives on someone else's cloud, the code is closed, pricing is usually per-inbox or per-message, and you have no way to audit where your data actually goes.

DearAgent compresses that whole stack into one Cloudflare Worker: it receives mail on your own domain via Cloudflare Email Routing, writes messages and metadata into your own D1 database and attachments into your own R2 bucket, threads by `In-Reply-To`/`References` instead of guessing from the subject line, and exposes two interfaces at once — a REST API, and a stateless Streamable HTTP MCP server mounted at `/mcp`. The MCP toolset includes `create_inbox`, `wait_for_message` (block until a new message arrives instead of hand-rolling a polling loop), `search_messages`, `reply_to_message`, `forward_message`, and more, so Claude Code, Cursor, or any MCP client can treat an inbox as just another tool.

Good fit for: automation or RPA-style agents that need a disposable inbox per signup flow to catch verification codes; teams already running on Cloudflare Workers/D1/R2 who'd rather keep an agent's mail data on their own infrastructure than open yet another third-party SaaS account.

## Quick Start

### Install

```bash
# Prerequisites: a Cloudflare account, an apex domain that isn't receiving mail
# anywhere else today, Node 20+, and npx wrangler login done

git clone https://github.com/panda-sandeep/dearagent
cd dearagent
npm install
npm run setup   # interactive: creates D1, R2, secrets, enables Email Routing/Sending, deploys, sets the catch-all rule
```

You don't need to deploy anything just to see it work: [dearagent.sh](https://dearagent.sh/#try) spins up a real inbox on the public demo instance the moment you load the page, and mail you send to it shows up live. Demo addresses live for fifteen minutes and demo mail isn't kept.

### Basic Usage

A typical flow of an agent talking to an inbox over MCP (from the project's own README):

```
> create_inbox {}
✓ agent-k3m9x2pq@mail.example.com   # hand this address to the signup form

> wait_for_message { inbox: "agent-k3m9x2pq@mail.example.com", timeout: 25 }
✓ from: Pied Piper
  subject: Your verification code
  text: "Your code is 493021. It expires in 10 minutes."
```

Wiring the MCP server into Claude Code:

```bash
claude mcp add --transport http dearagent https://dearagent.<your-subdomain>.workers.dev/mcp \
  --header "Authorization: Bearer $KEY"
```

### Advanced Usage

Restrict which addresses get accepted and forward everything else to a human inbox, so the catch-all rule doesn't dump every stray message at the domain into your database:

```jsonc
{
  "vars": {
    "EMAIL_DOMAINS": "mail.example.com",
    "ADDRESS_MATCH_PATTERN": "^agent-[a-z0-9]{8}$",
    "FORWARD_UNMATCHED_TO": "ops@example.com",
    "RETENTION_DAYS": "7"
  }
}
```

Pair that with a webhook to push new mail straight to a downstream service instead of polling:

```bash
curl -X POST $DA/webhooks -H "Authorization: Bearer $KEY" -d '{
  "url": "https://your-service.example.com/hooks/mail",
  "events": ["message.received"]
}'
```

## Comparison With Existing Approaches

| | DearAgent | AgentMail (hosted) | Roll your own SMTP webhook service |
|---|---|---|---|
| Where mail lives | Your own Cloudflare account (D1 + R2) | Their cloud | Whatever infrastructure you run |
| Source is readable / auditable | ✅ one repo, AGPL-3.0 | ❌ closed | ✅ (but you write it from scratch) |
| Built-in MCP server | ✅ (`/mcp`, 15 tools) | Needs your own integration | Needs your own integration |
| Threading / attachments / webhooks | ✅ built in | ✅ (product feature) | You implement it yourself |
| Billing | Your Workers bill (receiving is free, sending needs Workers Paid) | Priced per inbox or message | Whatever your own infra costs |
| Multi-tenant / per-agent permissions | ❌ one API key, full access | ✅ built into the product | You implement it yourself |

## Caveats

- **The README labels itself "Experimental."** The author is upfront that it "works end to end, but has not had an in-depth audit, the API may still change, and things may break." Review the code and run your own audit before pointing it at anything sensitive or exposing it to untrusted agents.
- **Domain requirements are strict.** Cloudflare Email Routing needs to own the MX records for the whole apex domain, so a domain already on Google Workspace, Fastmail, or similar can't be used as-is — you'll need a separate domain that isn't receiving mail anywhere today. Receiving works fine on the free plan; sending or replying as the agent requires Workers Paid.
- **One API key, no per-agent isolation.** A single key grants full access to every inbox in a deployment, and the README itself says to treat it like a database password. If several agents or people share one deployment, you have to add your own access layer (like Cloudflare Access) in front of it — the tool won't do that scoping for you.

## Today's Takeaway

Most "give your agent an inbox" options assume you rent a SaaS and pay per inbox or per message. DearAgent is a reminder that receiving mail, threading it, storing attachments, and firing webhooks can all collapse into one Worker plus one D1 database plus one R2 bucket — if you're already on Cloudflare, the marginal cost of "give an agent an identity" is basically your Workers bill, not a separate subscription. It's also a pattern worth noticing across a lot of "agent infrastructure" startups: repackaging a primitive your cloud provider already gives you into a product with a UI and a price tag on top.

## References

- [panda-sandeep/dearagent GitHub repo](https://github.com/panda-sandeep/dearagent): full README — design motivation, the "Try it now" demo, feature list, the "Why self-host" comparison table, quick start, API reference, the MCP tool list, and the Security/Limits sections — source for the technical details in this article.
- [dearagent.sh](https://dearagent.sh/): the project's website and no-deploy live demo (demo addresses live for 15 minutes).
- GitHub API repo metadata (`panda-sandeep/dearagent`): stars (23), language (TypeScript), license (AGPL-3.0), and creation date (2026-09-11), via the GitHub REST API.
- [AgentMail](https://www.agentmail.to/): the hosted agent-inbox SaaS the DearAgent README positions itself against as an open-source, self-hosted alternative.
