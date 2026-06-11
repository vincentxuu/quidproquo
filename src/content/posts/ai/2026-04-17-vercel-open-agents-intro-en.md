---
title: "Vercel Open Agents: Moving the Coding Agent from Your Laptop to the Cloud"
date: 2026-04-17
type: project
category: ai
tags: [coding-agent, vercel, open-source, agent-infrastructure, sandbox]
lang: en
tldr: "An open-source coding agent reference implementation from Vercel Labs. A three-layer architecture separates the web UI, agent workflow, and sandbox VM — designed as a starting point for teams that want to self-host their own Claude Code or Cursor Background Agent."
description: "Open Agents' architecture design, trade-offs versus off-the-shelf coding agents, real-world cost structure, and what kind of teams should fork it."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-17-vercel-open-agents-intro)

After products like Claude Code and Cursor Background Agent took off, the question for many teams shifted from "should we adopt a coding agent" to "the off-the-shelf agent is painful to run in our monorepo." Vercel Labs recently open-sourced **Open Agents**, a reference implementation that teams can fork and customize to fit their own workflow. This post covers its architecture, tech stack, and real-world cost considerations.

## Why Open Agents Exists

Vercel CEO Guillermo Rauch put it bluntly: **"Off-the-shelf coding agents can't handle large monorepos, and they don't understand your company's knowledge, integrations, or workflows."** This is a real pain point. Drop Claude Code into a 500K-line codebase and you'll spend ages getting it to find the right package, use the right lint config, and run the right test commands — you end up stuffing a pile of CLAUDE.md files in there, and the results are still limited.

Open Agents isn't trying to compete with Claude Code or Cursor. Instead, it provides a **forkable, hackable** reference implementation that teams can wire into their own CI, their own code review process, and their own deployment pipeline. The repo itself isn't a SaaS — it's a runnable Next.js app.

## Three-Layer Architecture

The core design of Open Agents is a three-layer separation:

```
┌─────────────────────────────────────────┐
│  Web UI (Next.js)                        │
│  - Auth, sessions, chat streaming        │
│  - Share links, voice input (ElevenLabs) │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Agent Workflow (Vercel Workflow SDK)    │
│  - Durable multi-step execution          │
│  - Streaming, cancellation, snapshot/    │
│    resume                                │
└──────────────┬──────────────────────────┘
               │ tools (file, shell, git)
┌──────────────▼──────────────────────────┐
│  Sandbox VM (Vercel Sandbox)             │
│  - Isolated filesystem / shell / git     │
│  - One instance per session              │
└─────────────────────────────────────────┘
```

The key design decision: **the agent runs outside the VM** and interacts with the sandbox through a tool interface, rather than executing inside the VM. This is the exact opposite of Claude Code's approach of running directly on the user's machine. The benefits are that the agent crashing doesn't destroy the sandbox state, you can snapshot and disconnect then resume later, and a single agent can operate multiple sandboxes.

## Tech Stack

The entire repo is 99.3% TypeScript:

- **Next.js** — Web app with server components + streaming
- **Vercel Workflow SDK** — Orchestrates durable workflows; this is the key to Open Agents' ability to recover after crashes
- **Vercel Sandbox** — Execution environment providing the agent with an isolated Linux VM
- **PostgreSQL** — Persistence for sessions, messages, and agent state
- **Upstash Redis / Vercel KV** (optional) — Caching
- **ElevenLabs** (optional) — Voice-to-text input
- **GitHub OAuth** (optional) — Clone repos, open PRs

Bun is the local dev runtime; deployment targets Vercel.

## Trade-offs vs. Claude Code / Cursor Background Agent

Not every team should fork Open Agents. Sticking with Claude Code / Cursor makes sense if you:

- Are an individual or small team that doesn't need to customize agent behavior
- Don't want to operate PostgreSQL, Sandbox, LLM API keys, and the rest
- Have a project small enough for off-the-shelf agents to handle the context

Forking Open Agents makes sense if you:

- Have a large monorepo that needs custom tools / context strategies tailored to the codebase
- Have internal docs, internal APIs, and enterprise knowledge that need to be injected into the agent
- Want to plug the agent into existing CI / review / deployment pipelines
- Want control over which model the agent uses, how billing works, and where data stays

## Real-World Costs

Open Agents itself is free and open source, but "running it" costs money:

| Service | Cost |
|---|---|
| Vercel Hosting | Free on Hobby tier (personal, non-commercial) |
| PostgreSQL (Neon / Vercel Postgres) | Free tier ~0.5GB |
| Vercel Sandbox | Usage-based billing |
| LLM API (Claude / GPT) | **The main cost** — one session runs ~$0.1 – $1+ |
| ElevenLabs voice | 10K characters/month free |

The biggest money pit is the **LLM API**. A complex coding session easily burns hundreds of thousands of tokens. With a Sonnet-tier model under heavy use, exceeding $100/month is entirely normal. You can try swapping in Groq or Gemini's free tiers to cut costs, but output quality will drop noticeably.

## Limitations and Caveats

- **Not plug-and-play**: This is a reference app, not a product. Expect to spend time customizing after forking.
- **Tied to Vercel infrastructure**: The Vercel Workflow SDK and Vercel Sandbox are core dependencies. Moving to AWS / GCP means rewriting those two layers yourself.
- **No built-in eval**: The repo doesn't address how to evaluate agent quality or run regression tests.
- **Skills ecosystem**: Vercel simultaneously launched `vercel-labs/skills`, an open registry for extending agent capabilities, which can be used alongside Open Agents.

## The Big Picture

Open Agents is a strategic move by Vercel — not just offering an agent product (Vercel Agent), but open-sourcing the underlying reference implementation so the entire ecosystem gravitates toward their infrastructure (Workflow SDK, Sandbox).

For teams, the greatest value of this repo isn't "a free Claude Code alternative" but rather **showing you what a production-grade coding agent should look like**: session management, durable execution, sandbox isolation, streaming UI — building all of this from scratch would take months, and Open Agents gives you a working starting point.

It's a good fit for teams that have already decided "we need to build our own agent, and we have people to operate it." If you just want to try out whether a coding agent is useful, stick with Claude Code first.

## References

- [vercel-labs/open-agents — GitHub](https://github.com/vercel-labs/open-agents)
- [Agentic Infrastructure — Vercel Blog](https://vercel.com/blog/agentic-infrastructure)
- [Open Agents — Vercel Template](https://vercel.com/templates/next.js/open-agents)
- [AGENTS.md — Architecture Technical Docs](https://github.com/vercel-labs/open-agents/blob/main/AGENTS.md)
- [Introducing Skills — Vercel Changelog](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem)
- [vercel-labs/skills — GitHub](https://github.com/vercel-labs/skills)
- [Vercel launches Open Agents — Tessl.io](https://tessl.io/blog/vercel-open-sources-open-agents-to-help-companies-build-their-own-ai-coding-agents/)
- [Vercel Introduces Skills.sh — InfoQ](https://www.infoq.com/news/2026/02/vercel-agent-skills/)
