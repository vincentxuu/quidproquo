---
title: "Tool Pick｜Titration — Let a Coding Agent Iterate on a Prompt with Cross-Vendor Judges, Until the Fix Actually Holds"
date: 2026-09-29
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hosted MCP server that scores prompt edits against a frozen baseline using a cross-vendor judge panel, so an agent can't game the very metric it's iterating against"
tldr: "Titration is a self-hosted MCP server that lets a coding agent edit a prompt and grade the change against a frozen baseline, using judges from other AI vendors, until the problem is actually gone or the tool concludes the prompt was never the issue. Install: docker compose up -d for Postgres, then npm install && npm run setup. It solves the problem of an agent editing a prompt, scoring its own work, and quietly gaming that score."
series:
  name: "AI Tool of the Day"
  order: 39
---

> 🌏 [中文版](/posts/daily/2026-09-29-tool-titration)

## Tool Info

| Item | Value |
|---|---|
| Name | Titration |
| Type | MCP server |
| GitHub | [kaithoughtarchitect/titration](https://github.com/kaithoughtarchitect/titration) |
| Stars | 3 |
| Language | TypeScript |
| License | Apache-2.0 |
| Install | `docker compose up -d` for Postgres, then `npm install && npm run setup` |

## What Problem It Solves

Ever pointed an agent at an underperforming prompt, watched it rewrite the prompt, rerun it, and declare "the score went up" — with no way to tell whether that score means anything? An agent that edits its own prompt, writes its own test cases, and grades its own output is exactly the setup Goodhart's law predicts will fail: once a measure becomes the target, it stops being a good measure. Worse, the agent is usually grading against a model from its own vendor — the player is also the referee.

Titration splits "editing the prompt" from "scoring the change," and deliberately keeps the scoring power out of the agent's hands. Three mechanisms do the work. First, the judge panel must draw from three different vendor families, and the agent's own vendor is never allowed on the panel; if fewer than two vendor families agree, the attempt is refused and never scored. Second, the baseline is frozen the moment it's established — its rubric, its outputs, and its judges lock in place, so every later comparison runs against the same yardstick instead of one that quietly gets easier over time. Third, every failure is classified into one of nine origins, and only one of them — "system-under-test" — actually means the prompt should be edited; the other eight point at the test set, the rubric, the judges, or the surrounding code instead. A low score doesn't automatically mean the prompt is the problem. Whatever each run learns is stored as searchable memory cards, so the next iteration doesn't start from zero.

Where this fits: teams tuning a prompt repeatedly with no reliable way to prove a change actually helped; agent systems that want to avoid the echo chamber of self-graded iteration; or building a reusable library of evaluation rubrics and failure cases that multiple projects can draw on.

## Getting Started

### Install

```bash
git clone https://github.com/kaithoughtarchitect/titration.git
cd titration
docker compose up -d          # Postgres + pgvector on localhost:5432
npm install
cp .env.example .env          # set OPENROUTER_API_KEY — the simplest starting point
npm run setup                 # applies the schema, loads the starter pack
```

Requires Node.js 22.11+, Docker, and judges from at least three vendor families (one OpenRouter key alone covers 9 vendor families across 12 models).

Connect Claude Code:

```bash
claude mcp add titration -- npx tsx /absolute/path/to/titration/server/server.ts
```

### Basic Usage

```
Typical agent call sequence:
1. referee_panel_mint   — pick three judges from three vendor families when first establishing a baseline
2. establish_baseline   — run the current prompt once and freeze it as the baseline
3. goal_titrate         — start iterating on the prompt toward a specific goal (e.g. "% of tickets wrongly marked urgent")
4. verify               — score each edit against the frozen baseline
5. classify_failure     — when the score doesn't improve, determine which of the nine failure origins applies
```

One measured run: billing tickets wrongly marked urgent dropped from 90% to 0% with a single prompt change ([worked example](https://github.com/kaithoughtarchitect/titration/tree/main/examples/ticket-triage)).

### Advanced Usage

```bash
# Use subscription CLIs as judge seats — no extra per-call cost
npm i -g @anthropic-ai/claude-code
npm i -g @openai/codex
# In .env, set TITRATION_JUDGES=auto so Titration picks three vendor
# families you already have access to (subscription CLIs first, never
# the system-under-test's own vendor family)
```

## Compared to Existing Approaches

| | Titration | Agent self-grading (single vendor) | Traditional eval frameworks (human-run) |
|---|---|---|---|
| Judge panel forced across vendors | ✅ requires agreement from ≥2 families | ❌ player is also referee | Depends on setup |
| Baseline frozen, can't quietly drift easier | ✅ | ❌ | Partial (manual upkeep) |
| Automatic classification of whether the prompt is even the issue | ✅ nine origins | ❌ | ❌ needs manual judgment |
| Iteration memory shared across projects | ✅ searchable cards | ❌ | ❌ |
| Free to start | ✅ subscription CLIs work at no extra cost | — | Depends on tool |

## Things to Watch

- **Brand new — created today.** Only 3 stars, no track record from the community yet; run through the quickstart yourself before relying on it.
- **Scoring isn't free.** A 20-output baseline with a three-judge panel is 60 judge calls — free on subscription CLIs within their usage limits, billed per token on OpenRouter models. Estimate cost before running a large rubric.
- **You maintain your own Postgres.** Data lives in your own Postgres + pgvector, which suits teams that want to self-host and keep data local, but it's not a zero-maintenance option if you'd rather not run a database.

## Today's Takeaway

Most "agent that fixes your prompt" tools run into the same structural problem: the agent writes the test, makes the edit, and grades itself, with no real check on any of it. Titration doesn't pretend to make the agent smarter — it admits upfront that the scorer can't also be the player, and bakes that into the architecture with cross-vendor judging and a frozen baseline. Locking down the referee's impartiality may be worth more than chasing a smarter agent.

## References

- [kaithoughtarchitect/titration — GitHub](https://github.com/kaithoughtarchitect/titration)
- [Titration GitHub API metadata (license / stars / created date)](https://api.github.com/repos/kaithoughtarchitect/titration)
- [Titration README (raw)](https://raw.githubusercontent.com/kaithoughtarchitect/titration/main/README.md)
- [Ticket triage worked example](https://github.com/kaithoughtarchitect/titration/tree/main/examples/ticket-triage)
