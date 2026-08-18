---
title: "CS146S Week 5: Express Scores 28, CockroachDB Scores 74 — Agent Readiness Is Measurable"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - agentic-coding
  - developer-experience
  - ai-agent
  - testing
  - code-quality
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 6
tldr: "Factory breaks 'can an agent work in this repo' into eight pillars and five levels, and published real scores: CockroachDB L4 (74%), FastAPI L3 (53%), Express L2 (28%). The thesis is that agent readiness approximates the density of deterministic validation loops — linters, type checkers, tests are reward signals for agents."
description: "Stanford CS146S Fall 2026 Week 5, 'Agent-Ready Codebases': Factory's eight-pillar, five-level agent readiness framework, the 80% gating rule, published scores for open source projects, and a checklist for auditing your own repo without any tooling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agent-ready-codebase)

This is the sixth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 5 of Fall 2026.

Three topics: what makes a repo agent-ready (structure, docs, tests, checks), scoring and auditing readiness, and the common gaps that block agents in real repos. The guest is [Factory](https://factory.ai/) co-founder and CTO Eno Reyes, speaking on agent readiness.

This may be **the most counterintuitive week in the new syllabus**: it argues that when your agent underperforms, the model usually isn't the problem.

## This week didn't appear from nowhere

I originally wrote that this week "didn't exist in Fall 2025." Having read the older slides, that needs correcting: **the topic had no week of its own, but the idea was already there.**

Fall 2025's Week 3, [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit), has a slide reading:

> Optimize your codebase so that a human and an agent could understand what's going on. **Much of LLM confusion comes from trying to finish a task with a messy repo as context.**

The same slide lists eight things to document: repo orientation, file structure, setup and environment, best practices, code style, access patterns, APIs and contracts — plus the note that "a monorepo design in your repo is highly encouraged."

Set that beside Factory's eight pillars and the contrast is interesting: **the course's list is about documentation a human and an agent can both read; Factory's is about machine-decidable checks.** In one year the topic moved from "please tidy your repo" to "your repo can be scored."

## "The agent is not broken. The environment is."

Factory states the problem precisely in [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) (January 2026):

> Teams deploying AI coding agents often see uneven results. They blame the model, try a different agent, get the same thing. The real problem is usually the codebase itself.
>
> The agent is not broken. The environment is.

Three concrete examples follow: without pre-commit hooks, the agent waits ten minutes for CI instead of five seconds of local feedback; with undocumented environment variables, it guesses, fails, and guesses again; when the build process lives in a Slack thread, it has no way to verify its own work.

Eno Reyes's one-line version has traveled further: **agent readiness is the density of deterministic validation loops inside a codebase** — linters, type checkers, security scans, end-to-end tests, anything that either passes or fails. Those are dense reward signals for an agent. The denser they are, the longer it can run without human intervention.

This is the same mechanism as [Week 4's hooks](/posts/ai/2026-08-16-cs146s-agent-customization-en) at a different scale: a hook is a gate for one task, validation loops are the terrain for a whole repo.

## Eight pillars

Factory's framework scores a repo along eight axes:

| Pillar | The question |
|---|---|
| Style & Validation | Are there linters, formatters, type checkers |
| Build System | Is the build reproducible, or does it need tribal knowledge |
| Testing | Do tests exist, do they run, what do they cover |
| Documentation | Are env vars, architecture, and conventions written down |
| Dev Environment | How many steps from clean machine to running |
| Code Quality | Complexity, duplication, dead code |
| Observability | What can you see when something breaks |
| Security & Governance | Scanning, CODEOWNERS, branch protection |

Each maps to a failure mode observed in production deployments. For Style & Validation, the consequence of missing it is written out: "Agent submits code with formatting issues, waits for CI, fixes blindly, repeats."

## Five levels, and that 80% rule

Scores place a repo in one of five maturity levels: **Functional → Documented → Standardized → Optimized → Autonomous**.

Level 3, Standardized, is explicitly the target: "Production-ready for agents... Level 3 is the target. Most teams should aim here first." At that level, agents reliably handle routine maintenance — bug fixes, tests, docs, dependency upgrades.

The gating rule is worth noting: **to unlock a level you must pass 80% of criteria from that level and all previous levels.** The stated reason is "building on solid foundations rather than cherry-picking easy wins at higher levels" — you can't skip testing and buy points with observability.

The organizational metric is deliberately different too. They track the percentage of active repos at Level 3 or above, because "'80% of our active repos are agent-ready' is more actionable than 'our average score is 73.2%.'"

## Published scores: equally successful, very different

Factory [published scores](https://factory.ai/agent-readiness) for well-known open source projects, which is the framework's most persuasive part:

| Project | Language | Level | Score |
|---|---|---|---|
| cockroachdb/cockroach | Go | L4 | 74% |
| fastapi/fastapi | Python | L3 | 53% |
| expressjs/express | TypeScript | L2 | 28% |

Their own commentary is honest:

> The contrast is instructive. CockroachDB at Level 4 has extensive CI, comprehensive testing, clear documentation, and security scanning. Express at Level 2 lacks several foundational signals. Both are successful, widely-used projects. But an agent will have a much easier time contributing to CockroachDB.

**That's the point.** Express isn't a bad project; it's a mature library millions of projects depend on. "Friendly to humans" and "friendly to agents" are different axes, and most repos have never been measured on the second one.

## A detail about the scoring itself

Grading 60-plus criteria with an LLM introduces nondeterminism — the same repo scoring differently on consecutive runs would destroy trust. Factory disclosed how they handled it: ground each evaluation on that repo's previous report.

> Before the fix, variance averaged 7% with spikes to 14.5%. After grounding, variance dropped to 0.6% and has stayed there for six weeks across 9 benchmark repositories.

Most criteria are file-existence checks or configuration parsing (does the linter config exist, is branch protection enabled, do tests run locally), each binary. **That design choice is itself a lesson**: where a deterministic check will do, don't ask a model.

## Audit your own repo without any tooling

The framework is a vendor's, but the checklist isn't. Six questions drawn from the eight pillars that pay off fastest:

1. **How many steps from clone to running?** More than three, write a script
2. **How long from editing a line to seeing a lint or type error?** More than ten seconds, you need a local gate
3. **Can you run a single test?** If only the whole suite runs, the agent pays full price for every verification
4. **Is there a complete list of environment variables?** Without one, the agent guesses
5. **Does any build step exist only in someone's head?** That step is your agent's ceiling
6. **Do failure messages say what to do next?** "Error: 1" is as useless to an agent as to a new hire

Number 6 is the most overlooked. Error messages are the agent's entire feedback channel — vague messages leave it guessing.

## The framework's limits

To be clear about a few things:

- This is a **vendor framework**. Factory sells coding agents, and "your repo isn't ready" is a convenient narrative for them. The eight pillars hold up on their own, but the thresholds and weights are theirs
- Scores are LLM-generated. Variance of 0.6% is stable, but stable isn't the same as correct
- A high score doesn't guarantee good agent performance; it just removes a class of known obstacles

That said, the closing line is true regardless of vendor interest:

> This is not just about Factory. A more agent-ready codebase improves the performance of all software development agents.

**A repo with fast feedback, clear docs, and reproducible builds was already a better repo for humans.** Agents just made the cost of skipping that more visible.

## What will go stale

- The three published scores are a snapshot; repos change
- Individual criteria within the eight pillars will shift as the product iterates
- Fall 2026's actual materials and assignment for this week land after classes start

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 5 topics and guest
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, 2026-01-20, the eight-pillar framework and scoring methodology
- [Agent Readiness Reports](https://factory.ai/agent-readiness) — published open source project scores
- [Making Codebases Agent Ready – Eno Reyes, Factory AI](https://www.youtube.com/watch?v=ShuJ_CN6zr4) — this week's guest on the same subject
- [From first prompt to optimal IDE setup](https://docs.google.com/presentation/d/11pQNCde_mmRnImBat0Zymnp8TCS_cT_1up7zbcj6Sjg/edit) — Fall 2025 Week 3 slides, the precursor to agent-ready codebases
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering, on file structure and naming as signal for agents
