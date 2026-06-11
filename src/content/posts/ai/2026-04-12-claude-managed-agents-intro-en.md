---
title: "Claude Managed Agents: Letting Anthropic Handle the Agent Shell and Sandbox"
date: 2026-04-12
type: guide
category: ai
tags: [claude, managed-agents, anthropic, ai-agent, sandbox, serverless, beta]
lang: en
tldr: "Claude Managed Agents is a beta service launched by Anthropic on 2026/04/08 that provides an agent harness plus cloud container sandbox, billed per token plus $0.08/session-hour. It suits long-running async tasks and is worth exploring if you don't want to build your own agent loop and sandbox."
description: "A deep dive into Claude Managed Agents' core concepts, how it differs from the Messages API, its four building blocks, SDK usage, tool ecosystem, pricing, and ideal use cases."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-12-claude-managed-agents-intro)

Anthropic launched Claude Managed Agents on 2026/04/08, currently in beta. In one sentence: previously you could only use the Messages API to hand-roll your own agent loop, run your own sandbox, and wire up your own tools. Now Anthropic bundles the entire harness and cloud container for you -- you just define the agent, send a prompt, and consume SSE events. This article covers the architecture, the trade-offs versus the Messages API, SDK usage, and what kinds of projects should consider switching over.

## Positioning: A Second Path Beyond the Messages API

Anthropic's documentation now explicitly presents two parallel paths:

| | Messages API | Claude Managed Agents |
|---|---|---|
| Essence | Direct model API calls | Pre-assembled agent harness + infrastructure |
| Best for | Custom agent loops requiring fine-grained control | Long-running, asynchronous tasks |
| Your responsibility | Build the loop, tools, and sandbox yourself | Just define the agent and environment |

The core difference is **who owns the agent loop**. With the Messages API, it's "I feed a prompt, you return tokens" -- turning that into an agent means wiring up tool use yourself, maintaining context, running a sandbox, and handling compaction. Managed Agents has Anthropic wrapping up the loop, prompt caching, compaction, SSE streaming, and container sandbox into a single package. The unit exposed to users is the session, not the message.

## Four Core Concepts

The entire service has only four objects to remember:

| Concept | Description |
|---------|-------------|
| **Agent** | The binding of model, system prompt, tools, MCP servers, and skills; created once, reused across sessions, versioned |
| **Environment** | A container template -- which packages are pre-installed (Python / Node / Go...), network rules, mounted files |
| **Session** | A single execution of an agent within an environment; has its own filesystem and event history |
| **Events** | Messages flowing back and forth between app and agent -- user turns, tool results, status updates, delivered via SSE streaming |

Agent and Environment are "templates"; Session is the actual running instance. The benefit of this separation is that one agent can map to many sessions running in parallel. You can also send new user events mid-session to "steer" the agent in a different direction, or interrupt it outright.

## Workflow

The official documentation describes five steps:

1. Create an agent: define model, system prompt, and tools
2. Create an environment: pick a container template, configure networking
3. Open a session: specify the agent and environment
4. Send user events, receive SSE: Claude automatically runs tools and streams back results
5. Steer or interrupt mid-session: send additional user events to adjust direction

Notably, event history is persisted server-side and can be fetched at any time -- this is particularly important for async tasks, as you don't need to maintain conversation state on your end.

## Minimal Working Python Example

After installing the SDK (`pip install anthropic`), create an agent, environment, and session, then stream events:

```python
from anthropic import Anthropic

client = Anthropic()

agent = client.beta.agents.create(
    name="Coding Assistant",
    model="claude-sonnet-4-6",
    system="You are a helpful coding assistant.",
    tools=[{"type": "agent_toolset_20260401"}],
)

environment = client.beta.environments.create(
    name="quickstart-env",
    config={"type": "cloud", "networking": {"type": "unrestricted"}},
)

session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Quickstart session",
)

with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(session.id, events=[{
        "type": "user.message",
        "content": [{"type": "text",
                     "text": "Generate the first 20 Fibonacci numbers and save them to fibonacci.txt"}],
    }])
    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "agent.tool_use":
                print(f"\n[tool: {event.name}]")
            case "session.status_idle":
                break
```

`agent_toolset_20260401` is a tool bundle that enables bash, read, write, edit, glob, grep, web search/fetch -- all tools at once. Compared to registering tool schemas one by one in the Messages API, this eliminates a huge amount of boilerplate. All requests need the `managed-agents-2026-04-01` beta header; the official SDK adds it automatically.

## Built-in Tools and Extensions

Managed Agents comes with the following tools pre-wired for the agent:

- **Bash** -- run shell commands in the container
- **File operations** -- read / write / edit / glob / grep
- **Web** -- search, fetch web pages
- **MCP servers** -- connect to external tool providers

The container can have Python, Node.js, Go, and other language runtimes installed. Networking can be unrestricted or restricted. To connect to your own systems, use MCP -- Anthropic effectively treats MCP as Managed Agents' plugin protocol.

## Overall Architecture

```
Your app
  |  REST / SSE
Anthropic Managed Agents API
  |-- Agent (template)
  |-- Environment (container template)
  +-- Session (running instance)
        |
     Cloud container
     |-- Claude model (loop / caching / compaction managed by Anthropic)
     |-- Built-in tools (bash / file / web)
     +-- MCP servers (external tools)
```

Your code only handles sending events and consuming SSE; the loop and sandbox live on Anthropic's side.

## Pricing and Limits

- **Token usage**: standard Claude Platform token rates
- **Session runtime**: additional `$0.08 / session-hour` (only active runtime counts)
- **Rate limits**: 60 req/min for creation endpoints, 600 req/min for read endpoints, plus organization-level spend limits
- **Status**: entire service is beta; `outcomes`, `multi-agent`, and `memory` are research preview and require separate access requests

The session-hour billing unit is worth noting -- long-running agents accumulate additional costs, so set reasonable budgets and timeouts.

## When to Use It (and When Not To)

**Use it when**:

- Tasks run for minutes to hours with many tool calls -- async workloads
- You need a container sandbox but don't want to manage Kubernetes or Firecracker yourself
- You need stateful sessions that preserve the filesystem and conversation across interactions
- Your team doesn't want to build the agent loop, prompt caching, and compaction infrastructure from scratch

**Don't use it when**:

- Low-latency single-turn conversations -- the Messages API is more direct and cheaper
- You need full control over agent loop details, or your loop logic differs significantly from Anthropic's defaults
- Tools must run on your internal network and data cannot leave your private cloud (MCP partially solves this, but the execution environment is still Anthropic's container)
- You want to use non-Anthropic models; Managed Agents is tied to Claude

The trade-off versus running the Claude Agent SDK yourself is similar to managed database vs. self-hosted Postgres -- convenience in exchange for control and (potentially) data locality.

## Relationship to Adjacent Products

A few easily confused terms:

- **Claude Code** -- A CLI installed on your local machine / IDE. It's a tool Anthropic built on agent concepts, not a Managed Agents product
- **Claude Agent SDK** -- An SDK for running your own agent loop; you still provide your own infra
- **Claude Managed Agents** -- The SaaS version that includes infra

Branding guidelines also explicitly state: products integrating Managed Agents **must not** call themselves "Claude Code" or mimic Claude Code's ASCII art. They should maintain their own brand identity. Acceptable names include "Claude Agent" or "{Your Agent Name} Powered by Claude".

## The Big Picture

The core trade-off of Claude Managed Agents is **selling agent infrastructure as SaaS**. For small-to-medium teams, or anyone who just wants to quickly turn a long-running task into an agent product, it dramatically shortens the distance from zero to production -- no need to figure out sandboxing, no need to implement SSE protocols, no need to tune prompt caching. The cost is lock-in to Claude, lock-in to Anthropic's container infrastructure, and an extra $0.08 per session-hour.

The Messages API isn't going away -- it's more like the "low-level primitive," while Managed Agents is the "high-level runtime." If you're building a coding agent, data analysis agent, or any automation task that runs for more than a few minutes, you can now start with Managed Agents for the MVP and only drop down to the Messages API to write your own loop when you hit actual bottlenecks.

## References

- [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)
- [Get started with Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/quickstart)
- [Claude Managed Agents: get to production 10x faster (Anthropic blog)](https://claude.com/blog/claude-managed-agents)
- [Build a data analyst agent with Claude Managed Agents (cookbook)](https://platform.claude.com/cookbook/managed-agents-data-analyst-agent)
- [Claude Managed Agents: complete guide to building production AI agents (2026)](https://www.the-ai-corner.com/p/claude-managed-agents-guide-2026)
- [Claude Managed Agents: What It Actually Offers, the Honest Pros and Cons (Medium / unicodeveloper)](https://medium.com/@unicodeveloper/claude-managed-agents-what-it-actually-offers-the-honest-pros-and-cons-and-how-to-run-agents-52369e5cff14)
- [I Built a Claude Managed Agent in 30 Minutes (Substack)](https://aiblewmymind.substack.com/p/claude-managed-agents-explained-demo)
- [What Is Claude Managed Agents? A Developer Guide (Verdent)](https://www.verdent.ai/guides/what-is-claude-managed-agents)
- [You can set up Claude Managed Agents in 5 easy steps (Digit)](https://www.digit.in/features/general/you-can-set-up-claude-managed-agents-in-5-easy-steps-heres-how.html)
