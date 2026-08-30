---
title: "How to Use Cloudflare Agents: Durable Runtime, Tools, and Real-Time Connections"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, agents, workers-ai, durable-objects, tools, websockets]
lang: en
tldr: "Cloudflare Agents turns an agent session into a durable runtime: each agent instance has stable identity, local SQLite, WebSockets, scheduled work, recoverable execution, and tools. It is not just a chat example; it composes Workers, Durable Objects, AI models, Browser, Sandbox, AI Search, and MCP into a deployable agent app."
description: "A practical guide to Cloudflare Agents: communication channels, agent harness, Agents SDK runtime, Agent class, state, sessions, WebSockets, scheduling, tools, and the Durable Objects dependency."
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 7
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 22
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-agents-runtime)

Many "agent apps" are really an HTTP endpoint plus a loop: receive a message, call a model, choose a tool, return a response. That makes a fast demo, but production brings a familiar set of problems: what happens when the user disconnects, how do you route back to the same user session, how does a half-finished tool call recover, and how do WebSocket, email, Slack, and webhook events reach the same state?

[Cloudflare Agents](https://developers.cloudflare.com/agents/) targets that runtime layer. The official docs split Agents into four parts: communication channels, the agent harness, the Agents SDK runtime, and tools. That split matters more than "Cloudflare can run a chatbot", because the hard parts of agent apps are often state, connections, tools, scheduling, recovery, and observability.

In the Cloudflare AI Stack, Agents belong after Workers AI, AI Gateway, AI Search, and Vectorize. The earlier posts answer model and retrieval questions. This post answers: how do those capabilities become a durable application unit?

## The Four Layers of Cloudflare Agents

I would read Agents through this table:

| Layer | Responsibility | Examples |
|---|---|---|
| Communication channels | How users and systems reach the agent | chat, voice, email, Slack, webhooks |
| Agent harness | How the agent loop runs | Project Think, custom planning/tool loop |
| Agents SDK runtime | Durable identity, state, connection, schedule, recovery | Agent class, sessions, WebSockets, fibers, SQLite |
| Tools | What the agent can operate | Browser, Sandbox, AI Search, MCP, Payments |

Keep those layers separate. Chat UI is only a channel. The model provider is only the inference source. Tools are capabilities. The runtime decides whether an agent can keep state across requests, connections, and time.

## Agent Instance: A Small Addressable Server

The core of the Agents SDK is the server-side `Agent` class:

```ts
import { Agent, routeAgentRequest } from "agents";

type State = {
  status: "idle" | "working";
};

export class ResearchAgent extends Agent<Env, State> {
  async onRequest(request: Request): Promise<Response> {
    return Response.json({ state: this.state });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
```

The official docs say each Agent can have millions of instances. Each instance is an independently running micro-server, usually addressed by a stable identifier such as user ID, email, ticket number, or channel ID. The same name routes back to the same agent instance.

That is different from a stateless endpoint. You do not need to rebuild a session store on every request or push all state into an external Redis. Cloudflare Agents require Durable Objects; each agent instance is backed by durable execution and storage.

## Lifecycle: More than Fetch

The Agent lifecycle has more than HTTP. The Agents API lists hooks such as:

- `onStart()`: instance starts or wakes from hibernation.
- `onRequest()`: HTTP request.
- `onConnect()` / `onMessage()` / `onClose()`: WebSocket lifecycle.
- `onEmail()`: email routed to the agent.
- `onStateChanged()`: state changes from server or client.

That is the difference between an agent runtime and a regular Worker handler. An agent can receive browser clients, Slack messages, emails, scheduled tasks, and tool results. The runtime needs to route those events to the same instance, instead of scattering them across unrelated request handlers.

## State and SQLite: Local State, Then Layered Storage

Each Agent instance has `this.state` and `this.sql`. `this.state` fits client-synchronized state such as current task status, UI progress, and selected tools. `this.sql` is embedded SQLite for instance-local structured data:

```ts
this.sql`
  CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    status TEXT,
    created_at TEXT
  )
`;

this.sql`
  INSERT INTO runs (id, status, created_at)
  VALUES (${runId}, ${status}, ${new Date().toISOString()})
`;
```

I would split storage this way:

- Agent state: current UI and connection state.
- Agent SQLite: local runs, queues, checkpoints for one agent instance.
- D1: cross-agent and cross-tenant data that needs reporting or joins.
- R2: files, artifacts, long transcripts, and tool outputs.
- Agent Memory: cross-conversation preferences, instructions, and project facts.

This avoids putting every kind of data into one store. The agent instance is the state center, but it is not the product's only database.

## WebSockets and Chat

Agents support WebSockets and include client-side SDK APIs: `AgentClient`, `useAgent()`, and `useAgentChat()`. For chat agents, the official docs point to extending `AIChatAgent`, which provides message persistence, resumable streaming, and React hook integration.

That is useful for AI apps. Users may not wait for a full tool workflow to finish. Networks disconnect. LLM output may stream halfway. A tool call may need human approval. A durable agent instance lets the client reconnect to the same agent and continue observing state.

This is why Agents are more than a Workers AI example. Workers AI solves inference. Agents solve how an AI workflow lives inside a product.

## Tools: Browser, Sandbox, AI Search, MCP

The tools layer connects the rest of the Cloudflare AI Stack:

- Browser: uses Browser Run to operate pages, take screenshots, and extract data.
- Sandbox: executes code or analyzes artifacts.
- AI Search: retrieves from a managed RAG source.
- MCP: connects the agent to external tools and services.
- Payments: lets agents participate in payment-related actions.

Stronger tools require clearer permissions. Browser tools need domain allowlists. Sandbox tools need resource limits. MCP tools need per-user authorization. Payments need human approval and audit logs.

In the harness, I would explicitly define:

- Which tools can run automatically.
- Which tools require user confirmation.
- Which tools are read-only.
- Whether tool results should be stored in D1/R2.
- Whether tool failure should retry, fall back, or stop the run.

## Configuration: Agents Are Durable Objects

An Agents project Wrangler config includes Durable Object bindings, `exports`, `nodejs_compat`, optional AI binding, and observability:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "durable_objects": {
    "bindings": [
      {
        "name": "ResearchAgent",
        "class_name": "ResearchAgent"
      }
    ]
  },
  "exports": {
    "ResearchAgent": {
      "type": "durable-object",
      "storage": "sqlite"
    }
  },
  "ai": {
    "binding": "AI"
  },
  "observability": {
    "enabled": true
  }
}
```

The configuration docs note that Agents require `nodejs_compat`, that new Agents should use SQLite storage, and that `exports` declares the Agent class and durable-object storage. These are not incidental template details; they are the runtime dependencies of the agent.

## When Agents Fit

I would use Agents when:

- A user, session, team, or channel needs a durable agent.
- The app needs WebSockets or resumable streaming.
- The same agent receives chat, email, Slack, and webhook events.
- The workflow needs scheduled tasks or recoverable execution.
- The agent needs local state, SQLite, a tool queue, or checkpoints.
- Browser, Sandbox, AI Search, and MCP need to be composed into one durable workflow.

If the app only receives an HTTP request, calls one model, and returns JSON, a normal Worker with Workers AI or AI Gateway is enough. Agents are valuable because of state and lifecycle, not because they make single-turn completions magical.

## Where It Sits in the AI Stack

The Cloudflare AI Stack can be read like this:

1. Workers AI: where models run.
2. AI Gateway: how model calls are observed, cached, retried, and controlled.
3. AI Search / Vectorize: how documents are retrieved.
4. Agents: who keeps executing the task, holding state, and operating tools.
5. Agent Memory: which cross-conversation knowledge should be remembered.
6. Browser / Sandbox / Secrets: which high-risk tools agents can use, and how credentials are controlled.

Agents are the runtime that turns the earlier services into a product. They do not replace Workers; they wrap Workers, Durable Objects, WebSockets, AI models, tools, and observability into a durable agent unit.

## References

- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Agents API](https://developers.cloudflare.com/agents/runtime/agents-api/)
- [Agents configuration](https://developers.cloudflare.com/agents/runtime/operations/configuration/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare AI Search](https://developers.cloudflare.com/agents/tools/ai-search/)
