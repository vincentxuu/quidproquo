---
title: "Tool Pick｜Bernstein — a deterministic scheduler that runs multiple coding agents in parallel without spending model tokens"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "Open-source Apache-2.0 CLI that decomposes a goal into tasks with plain Python, not an LLM, then runs Claude Code, Codex and other CLI agents in parallel git worktrees, merging only the ones that pass quality gates and leaving an offline-verifiable record of every step"
tldr: "Bernstein is an open-source CLI that runs multiple coding agents in parallel under a deterministic scheduler instead of an LLM. Install: pipx install bernstein. It fixes the problem of nobody tracking who's doing what, whether tests passed, or what happened after the fact when you fan agents out across a codebase."
series:
  name: "AI Tool of the Day"
  order: 89
---

> :globe: [中文版](/posts/daily/2026-11-26-tool-bernstein)

## Tool Info

| Field | Value |
|---|---|
| Name | Bernstein |
| Type | CLI / Python library / MCP server |
| GitHub | [sipyourdrink-ltd/bernstein](https://github.com/sipyourdrink-ltd/bernstein) |
| Stars | 1,220 (checked 2026-11-25) |
| Language | Python 3.12+ |
| License | Apache-2.0 |
| Install | `pipx install bernstein` |

## What Problem It Solves

Running several Claude Code or Codex sessions on the same codebase at once sounds efficient until three problems show up: who owns which piece, whether two agents just touched the same file, and whether anything they changed actually passes lint, type checks and tests. Hand-rolling this yourself means scripting worktree creation, retries and cost tracking from scratch — and when something breaks, you have no record of what the agent actually decided along the way.

Bernstein wraps that management layer into one CLI, and deliberately keeps the scheduler itself free of LLM calls: it's plain Python. It decomposes a goal — or a YAML plan with staged, dependent steps — into tasks, spawns a short-lived CLI agent per task inside its own git worktree, runs quality gates (lint, type checks, tests, optionally a security scan), merges only the worktrees that pass, and escalates to a stronger model on failure before giving up and dropping the task into a dead-letter queue with the worktree preserved for inspection. Because decomposition, assignment and merging are deterministic code, replaying the same plan twice reproduces the same task graph, and a lineage spine lets you step back through a run by default. An optional HMAC-chained audit log turns every step into a signed record that someone who never ran the job can still verify offline.

It fits teams who want to queue a batch of work before bed and wake up to a set of green PRs; teams that need a paper trail of what an autonomous agent did and why for an audit; or anyone who just wants a CI-style wrapper — fan out to N tasks, merge what's green — on top of whatever CLI agent they already use. The project lists 55 selectable adapter names, including Claude Code, Codex, Gemini CLI and Aider.

```diagram
title: Bernstein's tick loop: from goal to merged code
desc: Bernstein breaks a goal into tasks, runs each one with a short-lived agent in its own git worktree, merges only what passes the quality gate, escalates the model and retries on failure, and drops exhausted retries into a dead-letter queue.
caption: Simplified from the official docs; heartbeat monitoring, the warm pool and the bulletin board are left out.
---
<svg viewBox="0 0 640 616">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 124V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 220V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M400 316H432" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 372V400" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M184 448H108Q100 448 100 440V196Q100 188 108 188H164" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--warn" d="M280 496V532" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <rect class="dg-box" x="200" y="60" width="160" height="64" rx="6"/>
  <text class="dg-label" x="280" y="83" text-anchor="middle" dominant-baseline="central">Decompose goal</text>
  <text class="dg-sub" x="280" y="103" text-anchor="middle" dominant-baseline="central">into tasks</text>

  <rect class="dg-box" x="168" y="156" width="224" height="64" rx="6"/>
  <text class="dg-label" x="280" y="179" text-anchor="middle" dominant-baseline="central">Spawn agent for task</text>
  <text class="dg-sub" x="280" y="199" text-anchor="middle" dominant-baseline="central">own git worktree</text>

  <path class="dg-box" d="M280 260L400 316L280 372L160 316Z"/>
  <text class="dg-label" x="280" y="306" text-anchor="middle" dominant-baseline="central">Quality gate passes?</text>
  <text class="dg-sub" x="280" y="328" text-anchor="middle" dominant-baseline="central">lint・type・test</text>

  <rect class="dg-box dg-box--accent" x="432" y="292" width="144" height="48" rx="6"/>
  <text class="dg-label" x="504" y="316" text-anchor="middle" dominant-baseline="central">Merge to main</text>

  <path class="dg-box" d="M280 400L376 448L280 496L184 448Z"/>
  <text class="dg-label" x="280" y="438" text-anchor="middle" dominant-baseline="central">Retries left?</text>
  <text class="dg-sub" x="280" y="460" text-anchor="middle" dominant-baseline="central">count &lt; max</text>

  <rect class="dg-box dg-box--warn" x="148" y="532" width="264" height="64" rx="6"/>
  <text class="dg-label" x="280" y="555" text-anchor="middle" dominant-baseline="central">Dead-letter queue</text>
  <text class="dg-sub" x="280" y="575" text-anchor="middle" dominant-baseline="central">worktree kept for review</text>

  <text class="dg-edge" x="416" y="304" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge" x="290" y="386" text-anchor="start" dominant-baseline="central">No</text>
  <text class="dg-edge" x="146" y="436" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge dg-text--warn" x="290" y="514" text-anchor="start" dominant-baseline="central">No</text>
</svg>
```

## Getting Started

### Install

```bash
pipx install bernstein   # recommended; pip install bernstein / uv tool install bernstein also work
# Requires: Python 3.12+, at least one installed CLI coding agent (Claude Code / Codex / Gemini CLI...), git
```

### Basic usage

```bash
cd your-project
bernstein -g "add JWT-based user authentication"
# Bernstein decomposes the goal, runs each task's agent in its own worktree,
# and merges only what passes the quality gate — results land straight in git history
```

### Advanced usage (optional)

```yaml
# plan.yaml: multi-stage project with dependencies between stages
name: "Add authentication"
stages:
  - name: database
    steps:
      - goal: "Create user table migration"
        role: backend
        complexity: low
  - name: api
    depends_on: [database]
    steps:
      - goal: "Implement /login endpoint"
        role: backend
        complexity: medium
        priority: high
```

```bash
bernstein run plan.yaml --routing bandit --audit   # pick models with a contextual bandit, enable the HMAC audit chain
bernstein audit verify                             # verify the audit chain offline afterward
```

## How It Compares

| | Bernstein | Hand-rolled multi-agent scripts | Most LLM-driven agent orchestrators |
|---|---|---|---|
| Scheduler itself calls an LLM | ✗ (plain Python, zero scheduling tokens) | — | ✓ |
| Each task gets its own git worktree | ✓ | You build it | Partial |
| HMAC-chained audit log, offline-verifiable | ✓ | ✗ | Mostly missing |
| Number of supported CLI agents | 55 selectable adapters (Claude Code, Codex, Gemini CLI, Aider...) | Whatever you wire up | Usually 1–3 |
| Auto model-escalation retry, dead-letter queue on exhaustion | ✓ | You build it | Partial |

## Things to Watch

- **Beta status, solo-maintained**: the README itself says "status: beta, solo-maintained." The version number counts releases, not maturity, and interfaces can change between minor versions — pin your version.
- **The HTTP task server binds 127.0.0.1:8052 by default**: fine for local use, but don't expose it externally. Each agent calls its own model API with credentials you configure; Bernstein doesn't proxy or store those keys for you.
- **Not a compliance certification**: the docs are explicit that Bernstein doesn't claim SOC 2, HIPAA or FedRAMP coverage. The HMAC audit chain is a technical primitive you can build your own compliance case on, not a certification in itself.
- Cloudflare-based cloud execution is still experimental; you deploy it to your own Cloudflare account, and there's no hosted service from the project.

## Today's Takeaway

Whether the scheduler itself spends LLM tokens decides whether you can ever replay a run. Bernstein deliberately keeps decomposition, assignment and merge-decisions as plain Python that never touches a model, which buys you a task graph that's identical across two runs of the same plan, and a replay journal you can step back through when something diverges. That's a different bet from "have a smarter agent coordinate the other agents" — the latter is more flexible, but nobody can promise the coordination comes out the same way twice.

## References

- [sipyourdrink-ltd/bernstein — GitHub](https://github.com/sipyourdrink-ltd/bernstein)
- [sipyourdrink-ltd/bernstein — README](https://github.com/sipyourdrink-ltd/bernstein/blob/main/README.md)
- [Bernstein docs — Getting Started / Install](https://docs.bernstein.run/en/latest/getting-started/install)
- [Bernstein full technical reference (llms-full.txt)](https://bernstein.run/llms-full.txt)
- [Bernstein — PyPI](https://pypi.org/project/bernstein/)
