---
title: "AI-Native SDLC Playbook L5: CLAUDE.md Turns Team Knowledge into Agent Memory"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, claude-md, context-engineering, governance]
lang: en
tldr: "CLAUDE.md is a context file at the repo root that Claude reads at the start of every session — your team's conventions, commands, architecture patterns, and pitfalls. The course's core advice: if Claude makes the same mistake twice, write it into CLAUDE.md."
description: "Claude Academy AI-Native SDLC Playbook Lesson 5 guide: what CLAUDE.md is, how to write it, governance mechanics, and why it's foundational infrastructure for AI-native development."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 5
---

Every team has unwritten rules that only veterans know: which flags to pass to the build command, which modules are frozen, why monetary amounts must always use BigDecimal. This knowledge lives in wikis, Slack message history, and senior engineers' heads. New hires learn by stepping on landmines; AI agents learn by guessing.

[Claude Academy Lesson 5](https://academy.claude.com/courses/ai-native-sdlc-playbook/claude-md) tackles exactly this problem: **turn the team's tacit knowledge into a file that Claude reads at the start of every session.**

## What the Course Teaches

### What CLAUDE.md Is

`CLAUDE.md` sits at the repo root and is automatically loaded by Claude Code at the start of every session. According to the [Anthropic docs](https://docs.anthropic.com/en/docs/claude-code/memory), it lets Claude understand team conventions, commands, architecture patterns, and common mistakes.

The course sums it up in one line: "Knowledge that used to sit in people's heads and on wikis becomes a file the agent reads at the start of every session."

### How to Create One

1. Run `/init` in the repo — Claude generates an initial version from existing content
2. Trim to "things you'd need to know on day one": build commands, test procedures, lint rules, key conventions, recurring pitfalls
3. Commit to git so the whole team shares one copy with reviewed changes
4. Establish a working rule: **if Claude makes the same mistake twice, write the correction into CLAUDE.md**
5. Keep it under one page — Claude reads all of it at session start, and anything stale is wasting context

### Example Structure

The course provides a payments service example:

```
# Payments service
## Commands
- Build: make build
- Test: make test (unit), make itest (integration, needs docker)
- Lint: make lint (runs in CI; fix before pushing)
## Conventions
- Java 21, Spring Boot 3. No new Lombok.
- Money is always BigDecimal, never double.
- Every endpoint needs an integration test in src/itest.
## Architecture
- api/ holds REST controllers, core/ holds domain logic,
  adapters/ talks to external systems.
- Kafka events are defined in schemas/; never edit generated classes.
## Things Claude gets wrong
- Do not bump dependency versions; the platform team owns them.
- The legacy v1/ package is frozen; changes go in v2/.
```

Key structure: **Commands → Conventions → Architecture → Things Claude gets wrong**. The last section is especially important — it's accumulated from real mistakes, each entry corresponding to an actual incident.

### Governance

The course emphasizes that `CLAUDE.md` isn't just a "convenient document" — it's **auditable, reviewable agent instructions**:

- All changes go through version control with full history
- Team conventions apply uniformly to every session, regardless of who's running it
- Code owners can require specific approvers for `CLAUDE.md` changes

### How to Measure Effectiveness

The course suggests tracking two metrics:

- **Leading indicator**: How often Claude repeats mistakes already documented in `CLAUDE.md` (should approach zero)
- **Lagging indicator**: Time from new member onboarding to first merged PR (should decrease)

## Practical Experience: From One Page to Tiered Governance

In one of our projects, `CLAUDE.md` evolved far beyond a simple "cheat sheet" — it became a tiered action governance framework.

### The Tier System

We classify what the agent can do into four levels:

| Tier | Scope | Description |
|------|-------|-------------|
| 0 | Autonomous | Read files, run checks, write articles per skill |
| 1 | Gate required | Every commit must pass the verify gate |
| 2 | Ask first | Schema changes, deploys, deleting published content |
| 3 | Forbidden | Bypassing checks, writing unsourced facts, reverting without confirmation |

This tiering wasn't designed upfront — it grew from real incidents. Every time the agent did something it shouldn't have, we added a rule to `CLAUDE.md`, gradually forming the current structure.

### The Verify Gate

`CLAUDE.md` specifies that `pnpm verify` is the quality gate, and the agent must run it before every commit. This gate chains together lint, internal link checks, skill sync verification, and more. If it fails, the agent must fix the real issue — using `--no-verify` to bypass is forbidden, and that's also written in `CLAUDE.md`.

### Lessons Learned

**"One page" is correct, but define what counts as a page.** Our `CLAUDE.md` includes commit conventions, branching strategy, and verify gate instructions, totaling about 150 lines. Details beyond that threshold belong in skills, not crammed into `CLAUDE.md`.

**"Things Claude gets wrong" is the most valuable section.** Ours includes rules like "don't invent new categories" and "don't use `--no-verify` to bypass pre-commit." Every entry traces back to a real incident, and each one has immediate effect.

**CLAUDE.md needs periodic cleanup.** Stale rules don't just waste context — they can conflict with newer rules. We do a trimming pass roughly every two weeks, removing entries that have been superseded by hooks or skills.

## Getting Started

### Step 1: Run /init, but Don't Accept Everything

The `/init` output is usually too long and too generic. Spend 15 minutes cutting it down to only the things that "would cause trouble if you didn't know" — build commands, no-touch zones, and recurring mistakes.

### Step 2: Add "Things Claude Gets Wrong"

Create a dedicated section and add one entry every time Claude makes a mistake. You don't need to anticipate all rules upfront — let mistakes drive the content. After two weeks, this section will be the most valuable part of the entire file.

### Step 3: Put Changes Through Code Review

Add `CLAUDE.md` to CODEOWNERS and designate a tech lead or senior engineer as reviewer. It's the agent's configuration file — the blast radius of a change is equivalent to changing CI config, and it shouldn't be modified casually.

### Step 4: Pair with Hooks for Hard Enforcement

`CLAUDE.md` is advisory — Claude "should" follow it, but technically can choose not to. For rules that must never be violated (e.g., "never push to production"), use hooks for deterministic enforcement. The next lesson (L6 Skills) and L11 (Hooks) go deep on this topic.

## References

- [The CLAUDE.md — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/claude-md)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
