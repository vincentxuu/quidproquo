---
title: "Tool Pick｜Opengeni — session persistence, human approval, and credential governance for agents, bundled into one self-hostable service"
date: 2026-10-11
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: en
description: "An open-source, self-hostable agentic service that bundles session persistence, human approval, and credential governance — the infrastructure every agent product ends up rebuilding from scratch"
tldr: "Opengeni is an open-source, self-hostable agentic service handling session persistence, human approval, and credential governance. Install: git clone https://github.com/Cloudgeni-ai/opengeni.git && bun run dev (or try it with zero deployment at app.opengeni.ai). It solves the problem of every team building an agent product having to re-assemble the same infrastructure — where sessions live, how approvals gate risky actions, how credentials stay out of the agent's view."
series:
  name: "AI Tool of the Day"
  order: 51
---

> 🌏 [中文版](/posts/daily/2026-10-11-tool-opengeni)

## Tool Info

| Field | Value |
|---|---|
| Name | Opengeni |
| Type | Self-hostable agentic service (session / approval / credential governance infrastructure) |
| GitHub | [Cloudgeni-ai/opengeni](https://github.com/Cloudgeni-ai/opengeni) |
| Stars | 198 (official Cloudgeni project, created 2026-04-16) |
| Language | TypeScript (Bun + Hono + Temporal + Postgres) |
| License | Apache-2.0 |
| Install | `git clone https://github.com/Cloudgeni-ai/opengeni.git && cd opengeni && bun run dev` (or try it with zero deployment at [app.opengeni.ai](https://app.opengeni.ai)) |

## What problem it solves

Build an agent product that needs to keep running for a while — a support agent that remembers state across conversations, an infra agent that needs a human to approve a change before it ships, a research agent that runs for hours and can't afford to restart from scratch — and you quickly find the model itself only covers a fraction of what's needed. A model is a function from tokens to tokens: it forgets everything between calls, has no idea what it's allowed to do, and has no obligation to keep working until a job is actually done. Where sessions get stored, how a browser refresh reconnects to the same conversation, how a risky tool call gets gated behind a human's approval, how the credentials an agent can see stay separate from the prompt it's executing — nearly every team building an agent product ends up stitching this together themselves, usually out of Postgres, some workflow engine, and a hand-rolled approval UI.

Opengeni's approach is to package that surrounding layer into a ready-made, self-hostable service: every event lands in Postgres as a replayable record, so a browser reload or a brand-new client can pick up the same history. A session is given a goal with success criteria, and the agent keeps working until it meets that goal, pauses with a rationale, or a human interrupts it. Tool calls can sit behind an approval gate, and an agent can even resume the exact interrupted tool call once a human answers its question. Execution can run in a managed sandbox, or on a machine you register yourself (a Connected Machine) — the key detail being that machine only ever dials out and never holds any Opengeni credentials. The project's own framing is "rent the edges, own the middle": models, provider APIs, and raw compute change too fast to be worth owning, but session state, governance rules, and the knowledge base are the part that's actually yours and belongs in a Postgres database you control.

Good fit: teams already building agent products that need to run long, need a human in the loop, and need an audit trail, and who'd rather use ready-made infrastructure than assemble their own out of Temporal and Postgres; or teams who want to validate product shape first on the zero-deployment managed version before deciding whether to self-host. If you're only writing a small, single-shot agent that finishes in a few seconds, this whole layer of persistence and approval gating is more than you need — a plain agent-logic framework like LangGraph or CrewAI is lighter weight.

## Quick Start

### Install

```bash
# Local dev/evaluation: needs the exact Bun version in .bun-version, Docker, rustup, a C compiler
git clone https://github.com/Cloudgeni-ai/opengeni.git
cd opengeni
cp .env.example .env   # add your OpenAI or Azure OpenAI key
bun run dev
```

`bun run dev` installs dependencies, starts Postgres, NATS, Temporal, and object storage, runs migrations, and starts the API, workers, and web app; open `http://127.0.0.1:3000`, describe a task, and watch the session run. If you'd rather skip the dependency stack, sign up directly at [app.opengeni.ai](https://app.opengeni.ai), connect a model, and start a session with nothing to deploy.

### Basic usage

Wiring Opengeni into your own product takes one server route and one component:

```ts
// app/api/opengeni/[...path]/route.ts (server only; the key stays here)
import { Opengeni } from "@opengeni/sdk/chat";
import { createSessionProxyRoute } from "@opengeni/sdk/next";

const og = new Opengeni({ apiKey: process.env.OPENGENI_API_KEY! });

export const { GET, POST, PUT, PATCH, DELETE } = createSessionProxyRoute(og, {
  resolve: async (request) => {
    const me = await authenticate(request); // your product's own auth
    if (!me) return new Response("Unauthorized", { status: 401 });
    return { user: me.id, tenant: me.teamId };
  },
  createSession: (input) => input,
});
```

```tsx
// Browser
import { OpenGeniChat } from "@opengeni/react";
import "@opengeni/react/compiled.css";
```

### Advanced usage

Let a coding agent like Claude Code wire Opengeni into an existing project for you:

```bash
claude plugin marketplace add Cloudgeni-ai/opengeni
claude plugin install opengeni@opengeni --scope user
```

Once installed, the agent connects to your organization over MCP (sign in once in the browser) and gains the bundled Opengeni skills that handle the integration details.

## Compared to existing approaches

| | Opengeni | Assembling your own Temporal + Postgres stack | A plain agent-logic framework (LangGraph / CrewAI) |
|---|---|---|---|
| Persistent sessions with replayable event history | ✅ Built in | Design your own schema and replay logic | ❌ Usually single-shot execution only |
| Human approval gates that resume precisely after an interrupt | ✅ Built in | Build it yourself | ❌ Needs to be added |
| Cross-machine execution (Connected Machine holds no credentials) | ✅ Built in | Design your own dial-out and credential isolation | ❌ |
| Zero-deployment trial | ✅ app.opengeni.ai | ❌ | Depends on the framework |
| Open source, self-hostable | ✅ Apache-2.0 | — | ✅ Most are open source |

## Things to watch out for

- **Self-hosting isn't lightweight**: local development alone needs a specific Bun version, Docker, rustup, and a C compiler; running it in production means standing up Postgres, NATS, and Temporal — this isn't a single-binary, one-line install. If you just want to feel out the product shape, the zero-deployment managed version is faster.
- **Follow the README's security boundary before going to production**: it's explicit that you should "not expose a production deployment without a deliberate access mode, tested database role posture, rate limits, and a reviewed sandbox credential policy" — details live in the security boundary section of `docs/deployment.md`.
- **Stars and project maturity are still early**: 198 stars, 49 open issues, created in April 2026 — for the scope it covers (identity, tenancy, permissions, approvals, audit, credential governance all at once), this is an ambitious, still fast-moving project. Watch its issues and release history for a while before depending on it in production.

## Today's takeaway

Most discussions of "how to build an agent product" still center on picking an agent framework or a prompt strategy, but what actually gets an agent into a real product is usually the layer outside the framework: where sessions live, when a human needs to step in, how credentials stay out of the agent's own view. Opengeni calls that layer out specifically and packages it as something you can just use — turning "infrastructure every agent product has to reinvent" from each team's individual tech debt into a shared layer you can choose whether to maintain yourself.

## References

- [Cloudgeni-ai/opengeni — GitHub](https://github.com/Cloudgeni-ai/opengeni)
- [Opengeni website](https://opengeni.ai/)
- [Opengeni self-host docs (security boundary, deployment guide)](https://github.com/Cloudgeni-ai/opengeni/blob/main/docs/deployment.md)
- [Opengeni official blog](https://opengeni.substack.com/)
- [Model Context Protocol specification](https://modelcontextprotocol.io)
