---
title: "CS146S Week 8: Once Agents Run in the Cloud, the Bottleneck Moves from Waiting to Reviewing"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - multi-agent
  - orchestration
  - developer-experience
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 9
tldr: "Background agents replace 'you watch it run' with 'it finishes and opens a PR.' Every vendor's design converges on the same parts: an isolated environment, external triggers (issues, Slack, Linear), and a PR as the output. The genuinely new problem is that you become the bottleneck — five agents finish at once, five diffs queue for you, and none of them know the others exist."
description: "Stanford CS146S Fall 2026 Week 8, 'Background Agents': the shared architecture of async cloud agents, issue-to-PR pipelines and triggers, the cost of managing parallel agent fleets, and which tasks belong in the background."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-background-agents)

This is the ninth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 8 of Fall 2026.

Three topics: async, cloud-delegated agents; managing fleets of parallel agents; issue-to-PR pipelines and triggers (Slack, Linear, GitHub). The session is "Background agents: launching tasks asynchronously," guest still unannounced.

This week didn't exist in Fall 2025. A year ago, an agent was something you opened a terminal and watched.

**Disclosure: this post was written by a background agent** — running in an ephemeral cloud container on its own branch, pushing the result when done. The costs and limits below are not speculation.

## The shared parts

Product names differ; the architecture has converged:

| Part | What it does |
|---|---|
| Isolated environment | A clean container or VM per task, usually with its own git worktree |
| Triggers | GitHub issues, `@` mentions, Slack messages, Linear tickets, schedules |
| Environment declaration | How to install dependencies, how to run tests, which env vars exist |
| Output | A pull request, not a conversation |
| Feedback channel | PR comments and CI results return to the agent so it can iterate |

[Claude Code's GitHub Actions integration](https://code.claude.com/docs/en/github-actions) describes exactly this shape — "Run Claude Code in GitHub Actions workflows to respond to @claude mentions, automate tasks, and turn issues into pull requests" — split into interactive (waits for a trigger) and automation (runs a configured prompt) modes. [Codex cloud](https://learn.chatgpt.com/docs/cloud) sums itself up as "Delegate work to Codex in isolated cloud environments."

**"Output is a PR" matters more than it looks.** It forces agent output into a review mechanism that has existed for decades: diff, CI, review, merge. You don't have to invent an acceptance process for agents. It also means [Week 5's codebase readiness](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en) becomes a direct throughput ceiling — a repo where CI doesn't run produces PRs nobody can validate.

## What belongs in the background

Not every task should be async. Three conditions, all required:

1. **You can write the acceptance criteria down** — "tests go green," "this lint rule stops firing," "this API returns a new field." If you can't state acceptance up front, you won't know whether the result is right
2. **The context fits in one handoff** — a task needing three mid-flight questions just makes every round trip longer
3. **Failure is cheap** — the output is a PR, not a deploy

Filtering by those three, what actually runs well: dependency upgrades, mechanical refactors (renames, API migrations), promoting a lint rule from warn to error and fixing the fallout, adding tests, turning a spec into scaffolding, cross-file consistency fixes.

What runs badly: vague requirements, anything needing back-and-forth alignment, anything depending on business context only you hold. Send those to the background and you get back a PR that looks complete and points the wrong way — **and it's harder to throw away than a wrong conversation**, because it looks finished.

## The real new problem: you are the bottleneck

Starting five background agents is easy. Reading five diffs at once is not.

Concrete problems you will hit:

**They don't know about each other.** Five agents branch from the same base, two touch the same file, and you find out at merge time. That's not a bug — it's the price of isolation.

**Review cost is linear; output speed isn't.** Agent output scales horizontally, human review bandwidth doesn't. That's why [Week 6's AI code review](/posts/ai/2026-08-16-cs146s-agentic-code-review-en) is sequenced before this week: without an automated review layer, background agents just move the traffic jam from writing to reading.

**Silent failure.** When you're watching, you see it go off track within thirty seconds. Asynchronously, it can spend twenty minutes walking into a dead end and hand you a diff that took the scenic route. Some harnesses notify mid-run, but "when should this be interrupted" has no good answer yet.

**Opaque cost.** Five parallel agents each burn tokens; the bill is one number. Attributing it per task needs extra instrumentation — the problem [Week 9's gateways](/posts/ai/2026-08-16-cs146s-ai-native-team-en) exist to solve.

## Practical rules

- **One agent, one PR, and keep PRs small.** Large PRs were already an antipattern for humans; an agent's large PR is worse, because there's no author to ask
- **Environment setup lives in the repo.** That's what `AGENTS.md` and setup scripts are for (see [Week 4](/posts/ai/2026-08-16-cs146s-agent-customization-en)). A background agent has neither your shell history nor the three steps you never wrote down
- **Minimize permissions.** Nobody is watching a background agent, and [Week 7's lethal trifecta](/posts/ai/2026-08-16-cs146s-agent-security-en) is at its most dangerous here: it reads issues (untrusted content), holds repo access (private data), and can open PRs and call APIs (outbound channel) — all three on by default
- **Put acceptance criteria in the triggering issue**, not in your head

## Where this week sits

Read across the ten weeks, Week 8 is the pivot: the first seven teach you to work with one agent, and from here the subject is managing many. The course then moves into [Week 9's team scale](/posts/ai/2026-08-16-cs146s-ai-native-team-en) and [Week 10's software factory](/posts/ai/2026-08-16-cs146s-software-factory-en).

The order makes sense: one person managing three background agents is a tooling problem; an organization managing three hundred is an infrastructure problem.

## What will go stale

- Background agent features and pricing move very fast; this post covers shared architecture, not product comparison
- Fall 2026's guest and materials for this week aren't published
- Conventions like "one agent, one PR" are young and may look different in a year

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 8 topics
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions) — official docs on issue-to-PR and the two trigger modes
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) — cloud sessions, environments, and network policy configuration
- [Codex cloud](https://learn.chatgpt.com/docs/cloud) — OpenAI's isolated cloud task environments
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering, on the cost of sub-agent context isolation
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, on how feedback loop quality bounds autonomous run length
