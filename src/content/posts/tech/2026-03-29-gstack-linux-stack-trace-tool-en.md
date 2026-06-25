---
title: "gstack — Garry Tan's 20 Skills That Turn Claude Code into a Virtual Engineering Team"
date: 2026-03-29
type: guide
category: tech
tags: [claude-code, ai, gstack, skills, vibe-coding]
lang: en
tldr: "gstack is Garry Tan's open-source Claude Code skills toolkit. Its 20 specialized skills transform a solo developer into an entire engineering team — automating everything from product planning and design review to code review, QA, and deployment."
description: "An introduction to Garry Tan's open-source gstack project: its design philosophy, how 20 skills chain together into a development pipeline, installation instructions, and what it means for solo developer workflows."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-03-29-gstack-linux-stack-trace-tool)

Garry Tan (CEO of Y Combinator) claims to ship 10,000–20,000 lines of code per day using Claude Code — all while running YC full-time. He open-sourced his entire Claude Code setup under the name gstack. It has 54,000+ stars and an MIT license.

This post covers what gstack actually is, how it works, and whether it's worth using.

## What Is gstack?

gstack isn't an app — it's a collection of Claude Code **skills** (slash commands). After installation, you get 20 new commands, each playing a distinct role:

| Role | Command | What It Does |
|------|----------|--------------|
| CEO | `/office-hours` | Challenges your product assumptions, produces three implementation directions |
| CEO | `/plan-ceo-review` | Reviews the scope and vision of design documents |
| Tech Lead | `/plan-eng-review` | Architecture review, data flow diagrams, error path analysis |
| Designer | `/design-consultation` | Generates a complete design system |
| Designer | `/design-review` | Design review with automatic corrections |
| Engineer | `/review` | Code review, catches production bugs |
| Engineer | `/investigate` | Systematic root cause debugging |
| QA | `/qa` | Opens a real browser to run tests, auto-fixes discovered bugs |
| QA | `/qa-only` | Reports bugs only, no fixes |
| Security | `/cso` | OWASP Top 10 + STRIDE threat modeling |
| DevOps | `/ship` | Runs tests, opens a PR |
| DevOps | `/land-and-deploy` | Merge, CI/CD, production verification |
| DevOps | `/canary` | Post-deployment monitoring |
| Performance | `/benchmark` | Performance baseline and comparison |
| Doc | `/document-release` | Automatically updates documentation |
| Retro | `/retro` | Weekly retrospective |

There are also 8 utility commands: `/browse` (a real Chromium browser), `/codex` (second-opinion review via OpenAI), `/careful` (dangerous operation warnings), `/freeze` (lock edit scope), and others.

## Core Design: The Sprint Pipeline

gstack's strength isn't any single skill — it's how they chain into a pipeline:

```
Think → Plan → Build → Review → Test → Ship → Reflect
```

Each skill's output feeds into the next. In practice, a session looks something like this:

```
You:    I want to build a daily calendar summary app
You:    /office-hours
Claude: [Challenges assumptions, produces three directions]

You:    Go with direction 2
You:    /plan-ceo-review
Claude: [Reads design doc, runs 10 review checks]

You:    /plan-eng-review
Claude: [Draws data flow, lists test matrix, flags error paths]

You:    Approve. Exit plan mode.
Claude: [Produces 2,400 lines across 11 files in 8 minutes]

You:    /review
Claude: [Auto-fixes 2 issues, asks about 1 race condition]

You:    /qa https://staging.myapp.com
Claude: [Opens browser, finds bug, fixes it, writes regression test]

You:    /ship
Claude: [Syncs main, runs tests, opens PR]
```

One person. Full cycle from product planning to deployment.

## Installation

Requires Claude Code and Bun v1.0+.

**Global install (30 seconds):**

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git \
  ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

**Per-project install:**

```bash
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack && \
  rm -rf .claude/skills/gstack/.git && \
  cd .claude/skills/gstack && ./setup
```

Cursor and Codex are also supported with slightly different setup commands — see the repo README for details.

## Common Usage Patterns

### Full Product Development Cycle

The canonical workflow is running the entire pipeline from start to finish:

```
/office-hours          # Clarify what to build, get three directions
/plan-ceo-review       # Review scope, choose to expand or narrow
/plan-eng-review       # Lock architecture, draw data flow, list edge cases
/plan-design-review    # Design review scored 0-10 across each dimension
→ Implement
/review                # Code review
/qa https://localhost:3000  # Open browser and run QA
/ship                  # Run tests, open PR
/land-and-deploy       # Merge + deploy + verify
```

You don't have to run every step every time. For small changes, skip the planning phase and go straight to `/review` → `/ship`.

### Quick Debugging

```
/investigate
```

This forces you through four phases: investigate → analyze → hypothesize → implement. The core principle is "no fix without a root cause" — preventing the AI from guessing and making blind changes.

### Design System from Scratch

```
/design-consultation
```

It asks what your product is and who the target users are, then generates a complete design system — colors, typography, spacing, motion — saved to `DESIGN.md`. All future sessions automatically read this file to maintain design consistency.

### Dual-Model Code Review

```
/review        # Claude reviews first
/codex         # OpenAI Codex provides a second opinion
```

Two models catch different things. `/codex` has three modes: review (audit the code), challenge (try to break it), and consult (ask questions).

### Safety Mode

When touching production or an unfamiliar codebase:

```
/guard                 # Enables /careful + /freeze simultaneously
```

- `/careful` warns you before executing dangerous commands like `rm -rf`, `DROP TABLE`, or `git push --force`
- `/freeze src/components` locks the edit scope to `src/components` only, preventing accidental changes to unrelated files during debugging

### QA Without Touching Your Code

```
/qa-only https://staging.myapp.com
```

Reports bugs only — with screenshots and reproduction steps — without modifying any code. Useful when you want to hand the fixes to someone else, or when you want to decide yourself how to fix things.

### Post-Launch Monitoring

```
/canary https://myapp.com
```

Continuously monitors after deployment: catches console errors, performance regressions, and broken pages. Periodically takes screenshots and compares them against a pre-deployment baseline.

### Testing Pages Behind Login

```
/setup-browser-cookies
```

Imports cookies from Chrome, Arc, Brave, or Edge. After that, `/qa` and `/browse` can test pages that require authentication.

## Notable Design Choices

**Skills have dependencies.** `/plan-eng-review` expects you to have run `/office-hours` and `/plan-ceo-review` first, because it reads the design documents they produce. You can skip steps, but the results will be less effective.

**QA uses a real browser.** `/qa` runs Playwright with a real Chromium instance — not a simulation. It opens a browser, clicks buttons, fills forms, takes screenshots, and determines whether bugs exist.

**Supports parallel execution.** Using Conductor, you can run 10–15 sprints simultaneously, with each agent managing an independent branch. This is the actual mechanism behind Garry Tan's high output claims — not a single agent writing fast, but many agents writing in parallel.

**Telemetry is off by default.** There's an opt-in Supabase telemetry integration that never sends code, file paths, or prompts. The schema is public.

## Overall Take

gstack's core idea is: **turn every role in software development into a callable skill, then connect them with a fixed workflow.** It doesn't make the AI smarter — it uses process to constrain the AI, so it does the right thing at each stage.

This is most valuable for solo developers or small teams. You don't need an actual tech lead, designer, or QA engineer — you just need to call the right skill at the right moment. AI review isn't the same as human review, of course, but for a one-person project, having a process beats having none.

54,000+ stars suggests this direction is hitting a real need. As for the 10,000–20,000 LOC/day claim — take it with a grain of salt. Lines of code have never been a meaningful measure of output. What's genuinely interesting is the workflow itself: it demonstrates how to upgrade an AI coding assistant from a "question-answer tool" to a "development pipeline."

---

## References

- [garrytan/gstack — GitHub](https://github.com/garrytan/gstack)
- [gstack ARCHITECTURE.md](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [gstack ETHOS.md — Builder Philosophy](https://github.com/garrytan/gstack/blob/main/ETHOS.md)
- [gstack Skills Documentation](https://github.com/garrytan/gstack/blob/main/docs/skills.md)
