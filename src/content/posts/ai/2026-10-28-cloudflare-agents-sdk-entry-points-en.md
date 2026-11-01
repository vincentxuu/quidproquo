---
title: "Cloudflare Agents SDK: choosing between Pi harness, Agent, AIChatAgent, and Think"
date: 2026-10-28
type: deep-dive
category: ai
tags: [cloudflare, cloudflare-agents, agent-harness, durable-objects, ai-agent]
lang: en
tldr: "Already have a harness: PiHarness. Chat where you assemble each model call: AIChatAgent; let the framework run it: Think. Not chat but need state, scheduling or MCP: Agent."
description: "A comparison of the four Cloudflare Agents SDK entry points — PiHarness, Agent, AIChatAgent, and Think — including the Lifecycle split, who owns the loop, and the boundaries of dynamic agents, agent tools, and Code Mode."
draft: false
glossary:
  - term: "Agent harness"
    aliases: ["harness"]
    definition: "The layer that runs the agent loop: when to call the model, how to choose tools, how tool results re-enter context, how to retry failures, and where to resume after a crash."
    context: "This article uses it to separate Pi Durable, Think, AIChatAgent, and your own loop."
  - term: "Facet"
    aliases: ["facets"]
    definition: "A workerd execution unit that colocates a child Durable Object with its parent while giving it a separate isolate and SQLite database."
    context: "Cloudflare's dynamic agents are built on facets."
---

> 🌏 [中文版](/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points)

Open the [cloudflare/agents](https://github.com/cloudflare/agents) README and the first example is an `Agent` class with `@callable()`. Open the [official docs home page](https://developers.cloudflare.com/agents/) and the opening line says "Start with the Pi harness"; its Get started section adds "Build your agent with the Pi harness." Both are correct. They are not talking about the same layer.

As of 2026-10-28 the repo is at `agents` 0.31.0, with 5.9k stars and more than 1,800 commits. What started as one `Agent` class is now a Durable Object runtime with four selectable entry points: PiHarness, Agent, AIChatAgent, and Think. Picking the wrong one will not stop you from shipping. It will make you write a layer that the SDK already had, or tie you to an experimental API you did not need.

This article answers one question: **where should your agent loop live?**

## What this is

Cloudflare Agents is an agent runtime on Workers. Each agent is a [Durable Object](https://developers.cloudflare.com/durable-objects/): a stable address, its own SQLite database, one alarm, and WebSocket support. It hibernates when idle and wakes when there is work. It is not a model, a prompt framework, or a chat UI. It handles the layer that keeps an agent alive inside a product.

The repo now ships 50-plus examples, five sets of docs (agents, think, codemode, voice, shell), and a `design/` directory full of architecture records. For a first-time reader, the question is not "does it run?" It is "which of these classes am I supposed to extend?"

Versions below are the npm latest as of 2026-10-28: `agents` 0.31.0, `@cloudflare/ai-chat` 0.12.2, `@cloudflare/think` 0.22.0, and `@cloudflare/codemode` 0.5.5. These are 0.x packages. Check the changelog before you upgrade.

## Runtime and harness are two different things

The same repo contains two layers, and the docs often discuss them together.

**Runtime** keeps the agent alive: stable address, SQLite, WebSockets, alarms, a job queue, and recovery after eviction. The seam for this layer is `agents/lifecycle`.

**Harness** runs the loop: when to call the model, how to choose tools, how tool results re-enter context, whether to retry, how to compact a full context window, and where to resume after a crash.

Once you split them, "what happens when the agent dies?" has two answers. The runtime guarantees the object is woken by an alarm and its SQLite is still there. The harness decides where to resume and which tool may run again. You need both answers, but they come from different layers.

```diagram
title: The five layers of the Agents SDK, with harness and runtime separated
desc: From top to bottom — application channels, harness, the optional Agent preset, Lifecycle, and Durable Object. The harness owns the loop; Lifecycle and the DO keep the agent alive.
caption: PiHarness can attach directly to the Lifecycle without going through Agent; AIChatAgent and Think are Agent subclasses.
---
<svg viewBox="0 0 440 392">
  <path class="dg-axis" d="M24 360V40" marker-end="url(#arrow)"/>
  <text class="dg-sub" x="8" y="12" font-weight="700" dominant-baseline="central">ABSTRACT</text>
  <text class="dg-sub" x="8" y="380" font-weight="700" dominant-baseline="central">CONCRETE</text>

  <rect class="dg-box" x="52" y="24" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="52" font-weight="700" dominant-baseline="central">L5</text>
  <text class="dg-label" x="96" y="52" dominant-baseline="central">App &amp; channels</text>
  <text class="dg-sub" x="408" y="52" text-anchor="end" dominant-baseline="central">WebSocket, HTTP, Slack</text>

  <rect class="dg-box" x="52" y="88" width="372" height="72" rx="6"/>
  <text class="dg-sub" x="68" y="112" font-weight="700" dominant-baseline="central">L4</text>
  <text class="dg-label" x="96" y="112" dominant-baseline="central">Harness</text>
  <text class="dg-sub" x="96" y="136" dominant-baseline="central">owns the agent loop</text>
  <text class="dg-sub" x="408" y="112" text-anchor="end" dominant-baseline="central">Pi Durable, Think</text>
  <text class="dg-sub" x="408" y="136" text-anchor="end" dominant-baseline="central">AIChatAgent, your loop</text>

  <rect class="dg-box" x="52" y="168" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="196" font-weight="700" dominant-baseline="central">L3</text>
  <text class="dg-label" x="96" y="196" dominant-baseline="central">Agent (optional)</text>
  <text class="dg-sub" x="408" y="196" text-anchor="end" dominant-baseline="central">state, schedules, MCP</text>

  <rect class="dg-box dg-box--accent" x="52" y="232" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="260" font-weight="700" dominant-baseline="central">L2</text>
  <text class="dg-label" x="96" y="260" dominant-baseline="central">Lifecycle</text>
  <text class="dg-sub" x="408" y="260" text-anchor="end" dominant-baseline="central">fetch / alarm / WebSocket</text>

  <rect class="dg-box" x="52" y="296" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="324" font-weight="700" dominant-baseline="central">L1</text>
  <text class="dg-label" x="96" y="324" dominant-baseline="central">Durable Object</text>
  <text class="dg-sub" x="408" y="324" text-anchor="end" dominant-baseline="central">isolate, SQLite, hibernation</text>
</svg>
```

## Four entry points, plus one you assemble yourself

These are not four feature sets. They are four answers to "who owns the loop."

| Entry point | Loop owner | What you get | What you still write | Status |
|---|---|---|---|---|
| PiHarness | Pi Durable | DO storage, wake-ups, sessions, tools, retries | Client transport, UI, permissions | Beta |
| Agent | You | State sync, `@callable`, schedules, MCP, email, queue | Loop, prompt, tool choice | Not marked experimental |
| AIChatAgent | You (`onChatMessage`) | Chat protocol, message persistence, resumable streams, recovery | Each model call, tools, prompt | First-class |
| Think | The framework | All of the above plus a session tree, compaction, workspace, client tools, messengers | `getModel`, `getTools`, context | Experimental |
| DO + Lifecycle | You | Runtime primitives only; pick your capabilities | Almost everything | Lifecycle stable; most capabilities experimental |

The last row is not the marketed entry point, but it exists: `agents/lifecycle` installs on a plain Durable Object, and Sessions, Streams, and Tasks are separate capabilities. If you already have a loop, this is the smallest dependency surface.

## Pi harness: outsource the loop

The docs home page now leads with the Pi harness. The exact sentence is: "Start with the Pi harness, which runs a durable model loop with tools in a Durable Object, and add state, real-time connections, and scheduled tasks with the Agents SDK." Read it twice. It is not saying "the Agent class is convenient." It is saying the loop is pluggable.

[Pi Durable](/posts/ai/2026-10-05-pi-durable-long-running-agents) treats every step of a run as a task: one for each model request, one for each tool call, one for compaction. Each task writes a checkpoint before it moves on. After a crash, a new process opens the same storage, finds unfinished tasks, and resumes each from its last checkpoint.

Cloudflare's `PiHarness` adds exactly two things: it puts Pi's transcript, inbox, and tasks into the Durable Object's SQLite (table names start with `pi_`), and it uses a Lifecycle job's alarm to wake an evicted object. It does not choose how clients connect or what the WebSocket looks like. It hands you a session event stream; you decide whether to send it over WebSocket, HTTP, or RPC.

That is what "pluggable harness" means here: `PiHarness` is a Lifecycle capability, not an `Agent` subclass. You can extend a plain `DurableObject`, call `Lifecycle.install(this).use(this.harness)`, and skip the entire `Agent` preset.

The cost is maturity. `PiHarness` is marked Beta in the capability table, Pi Durable itself is experimental, and `agents` supports one Pi minor at a time. The documented limits are real: no tool approval step, event streams always start from a snapshot with no cursor, a single model request that streams for more than 15 minutes can be cut off by the alarm boundary, and sessions cannot be deleted yet. If you need human approval on tool calls, you are building it yourself for now.

## Agent: you own the loop, the SDK owns the runtime

`Agent` is the repo's default bundle. It extends `DurableObject`, installs a Lifecycle, and adds Scheduler, Queue, MCPClientManager, State, WebSockets, Tasks, and dynamic agents. Extending it gives you `this.state`, `this.sql`, `this.schedule()`, `this.addMcpServer()`, and `@callable()`.

It fits products that are not primarily chat: one small stateful server per user, room, workflow, or webhook source.

- One agent per customer, tracking which ticket is open.
- One agent per game room, syncing scores and players.
- One agent per webhook source, queueing events and retrying failures.
- One agent per dashboard, exposing data and commands through `@callable()`.

`@callable()` is WebSocket RPC, not an HTTP API. Once a method is decorated, a client can call `agent.stub.increment()` directly, and state changes broadcast to every connection. That is convenient for live UI. If all you need is a REST endpoint, a normal Worker is enough.

There is one setup trap worth calling out: `@callable()` uses TC39 standard decorators, not TypeScript's legacy decorators. Your `tsconfig.json` must extend `agents/tsconfig`, and Vite needs the `agents/vite` plugin. Do **not** set `"experimentalDecorators": true`; it applies an incompatible transform and silently breaks `@callable()` at runtime. Without the two required settings, the dev server fails with `SyntaxError: Invalid or unexpected token`.

Every entry point also needs a Durable Object binding and a SQLite migration:

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "Chat", "class_name": "Chat" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Chat"] }]
}
```

## AIChatAgent: you own the model call, the SDK owns the chat plumbing

`AIChatAgent` is a protocol adapter. It extends `Agent` and handles message persistence, streaming, aborts, resumable streams, recovery, and client sync. You override `onChatMessage()` and return a `Response`.

```ts
import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, streamText } from "ai";

export class Chat extends AIChatAgent<Env> {
  async onChatMessage() {
    const result = streamText({
      model: this.env.MODEL,
      messages: await convertToModelMessages(this.messages)
    });
    return result.toUIMessageStreamResponse();
  }
}
```

The value of this position is control over every model call. You can run retrieval before `streamText`, call the model twice in one turn, use a provider that is not on the AI SDK, or normalize legacy message shapes. The SDK does not touch your prompt or tool choice; it makes sure messages are stored, a broken stream can resume, and an evicted object can recover.

It fits teams that already have a retrieval or prompting strategy. You will not get the session tree, context compaction, or workspace tools, because those belong to `Think`.

## Think: the framework owns the loop

`Think` is Cloudflare's answer to "what is the minimum a chat agent should have to write?" You declare a model, a prompt, and tools; the framework runs the loop:

```ts
import { Think } from "@cloudflare/think";

export class Chat extends Think<Env> {
  getModel() {
    return "@cf/moonshotai/kimi-k2.7-code";
  }

  getSystemPrompt() {
    return "You are a helpful coding assistant.";
  }
}
```

That gives you the WebSocket chat protocol, message persistence, the agentic loop, resumable streaming, client tools, and workspace file tools. It also adds a session tree with branching, compaction, and FTS5 search; non-destructive regeneration; messengers such as Telegram; workflows; and human-in-the-loop.

`Think` and `AIChatAgent` are not replacements for each other. They are two ownership models. `AIChatAgent` lets you own the loop; `Think` lets the framework own it and exposes hooks (`beforeTurn`, `beforeStep`, `beforeToolCall`) for the parts you want to change. The design docs are explicit that `AIChatAgent` is first-class, not legacy. Both are supported. Pick the layer you are willing to debug.

`Think` is still experimental. If you need to ship a production service today and cannot absorb API churn, `AIChatAgent` is the conservative choice. For a new project that wants defaults and can follow upgrades, `Think` removes a lot of plumbing.

## Splitting work: dynamic agents, agent tools, and Code Mode

Once you pick a base, the next question is whether work should leave the current agent. Three mechanisms solve three different problems. Do not mix them up.

**Dynamic agents (formerly sub-agents)** are facet-backed child Durable Objects. Each child has its own isolate and its own SQLite, runs on the same machine as the parent, and can be aborted, deleted, or restarted by the parent. Children do not get an independent alarm. This fits cases where the parent owns the child's class and lifecycle: dynamically loaded code, a per-run tool agent, or a sandboxed component that needs isolated storage.

It does not fit "many independent peers." The docs are explicit: if you need one agent per chat, document, or session, use top-level Durable Objects plus a per-user index. Facets are an isolation and supervision primitive, not a scale-out unit.

**Agent tools** let the parent model decide when to call a child. `agentTool(Researcher, {...})` wraps a chat-capable agent as an AI SDK tool. The child gets its own Durable Object, messages, tools, and resumable stream; the parent keeps a run registry so clients can watch the child timeline, replay it after refresh, and drill into the full transcript.

```ts
export class Assistant extends Think<Env> {
  getTools() {
    return {
      research: agentTool(Researcher, {
        description: "Research one topic in depth.",
        inputSchema: z.object({ query: z.string().min(3) })
      })
    };
  }
}
```

The difference from dynamic agents is who decides. With dynamic agents, your code opens the child. With agent tools, the model decides during the conversation. Agent tools add a registry, event replay, cancellation, and drill-in. The cost is that the child run becomes part of the parent's conversation, and an `AIChatAgent` child runs headless, so browser-provided client tools are unavailable during that turn.

**Code Mode** targets tool count and sequence length. With many tools, every description sits in context before the model does any work; with long sequences, every step is a round trip through the model. Code Mode lets the model write TypeScript that calls several tools inside one sandboxed Worker:

```ts
// Code the model writes; github is a connector exposed as a sandbox global
const prs = await github.list_pull_requests({ owner: "cloudflare", repo: "agents" });
```

The sandbox has no network access, so every side effect goes through a connector. That is where approvals, rollback, and audit logs can live. The cost is that Code Mode is experimental and you have to wrap tools as connectors. If you have three to five tools, ordinary tool calling is simpler.

| Your problem | Use | Cost |
|---|---|---|
| The parent owns the child's class and lifecycle | Dynamic agents | No independent alarm; not a scale-out unit |
| The model should choose a child mid-conversation and show progress | Agent tools | An extra run registry; child client tools are limited |
| Too many tools, or too many model round trips per task | Code Mode | No network in the sandbox; wrap side effects in connectors; experimental |

## How I would choose

Ask the questions in order. Most people get an answer in three.

1. **Do you already have a harness you want to use?** If yes, and you can live with its experimental API, use `PiHarness`. It gives you the most mature loop and recovery semantics; you pay for it in client-side plumbing.
2. **No harness, and you are building a chat interface?** If not, skip to question 4.
3. **In that chat interface, do you want to assemble every model call yourself?** Yes: `AIChatAgent`. No: `Think`. The dividing line is not features; it is whether you want the framework to own the loop.
4. **Not chat, but you need state, RPC, schedules, MCP, email?** Use `Agent`.
5. **You only need runtime primitives and already have a loop?** Use a plain `DurableObject` + `Lifecycle`, and install only the capabilities you need.

If you are still unsure, here is something you can do tonight: run `examples/playground`, open `src/server.ts`, and pick the demo it re-exports that looks most like your product. `demos/ai/chat-agent.ts` is an `AIChatAgent`; `demos/multi-agent/supervisor-agent.ts` is an `Agent` with dynamic agents. Change the prompt and one tool in whichever is closer, and do not read all five sets of docs first.

## Limits

- **Everything is 0.x.** `Think`, Code Mode, facets, and `PiHarness` are marked experimental or beta. `Agent` is not marked experimental, but the SDK is moving fast. Pin versions and read changelogs.
- **The lock-in is deep.** You are not just calling a model. You are using Durable Objects, facets, Worker Loader, AI bindings, and SQLite. Leaving Cloudflare means rewriting the runtime layer, not swapping an API key.
- **The docs are not in sync.** The README leads with `Agent`; the docs home page leads with the Pi harness. Both are true, but you need to know which layer you are reading. Trust the version you installed, not the front page.
- **Pi's limits are specific.** No tool approval, no event cursor, a 15-minute alarm ceiling, no session deletion. If you need compliance or approval flows, do not treat it as finished.
- **Not every agent fits.** Workloads that need the Python ecosystem, GPUs, long-running VMs, or data that cannot enter Cloudflare should take a different path.
- **No external PRs.** The repo says it is not accepting external pull requests right now. Contributions go through issues and discussions.

## The short version

What Cloudflare is really selling is not a class. It is the unit: every agent gets its own Durable Object. Which entry point you choose depends on which layer you are willing to debug: the loop, the chat plumbing, or the runtime.

If you are already on Workers and want one stateful agent per user, this SDK is the shortest path. If you need a single model call, or your team writes Python, do not move your runtime just because the word "agent" is in the name.

## References

- [cloudflare/agents](https://github.com/cloudflare/agents)
- [Cloudflare Agents documentation](https://developers.cloudflare.com/agents/)
- [Pi harness documentation](https://developers.cloudflare.com/agents/harnesses/pi/)
- [Agent class documentation](https://developers.cloudflare.com/agents/agent-class/)
- [Durable Object lifecycle (`agents/lifecycle`)](https://github.com/cloudflare/agents/blob/main/docs/agents/lifecycle.md)
- [Callable methods and decorator setup](https://github.com/cloudflare/agents/blob/main/docs/agents/callable-methods.md)
- [AIChatAgent documentation](https://github.com/cloudflare/agents/blob/main/docs/agents/chat-agents.md)
- [Think documentation](https://github.com/cloudflare/agents/blob/main/docs/think/index.md)
- [Think vs AIChatAgent design comparison](https://github.com/cloudflare/agents/blob/main/design/think-vs-aichat.md)
- [Dynamic agents (facets)](https://github.com/cloudflare/agents/blob/main/docs/agents/sub-agents.md)
- [Agent tools](https://github.com/cloudflare/agents/blob/main/docs/agents/agent-tools.md)
- [Code Mode documentation](https://github.com/cloudflare/agents/blob/main/docs/codemode/index.md)
- [Pi Durable: where a long-running agent resumes after a crash](/posts/ai/2026-10-05-pi-durable-long-running-agents)
- [Cloudflare Agents: durable agent runtime, tools, and real-time connections](/posts/ai/2026-08-30-cloudflare-agents-runtime)
