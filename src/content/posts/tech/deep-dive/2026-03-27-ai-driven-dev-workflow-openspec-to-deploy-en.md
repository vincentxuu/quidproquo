---
title: "A One-Person Full-Stack Team: AI-Driven Development Workflow from OpenSpec to Auto-Deploy"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, openspec, ai-agent, ci-cd, code-review, dx, monorepo, github-actions]
lang: en
tldr: "Use OpenSpec to break requirements into engineering tasks, Claude Code to implement them, hooks to auto-format and protect, local review before committing, three AI reviewers running in parallel on PR, and auto-deploy after merge. This entire workflow lets one person maintain quality across six sub-projects."
description: "A complete walkthrough of an AI-driven development workflow: eight stages from PRD/FRD input, OpenSpec decomposition, Claude Code-assisted development, multi-layer quality checks, to automated deployment — along with the design tradeoffs behind each decision."
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 14
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy)

Six sub-projects — frontend, backend, AI services, database, infrastructure, background jobs — all maintained by one person. Not impossible, but if every step is done manually — writing code, running lint, writing commit messages, reviewing diffs, generating PR descriptions — half the day disappears into things that aren't actually coding.

This post documents the development workflow I currently use. The core idea is simple: automate the repetitive work at every stage, while preserving human judgment at every critical decision point.

## Eight Stages

The entire workflow breaks down into eight stages:

```
Requirements → Spec Decomposition → Development → Commit → Pre-Push Review → PR → Merge & Deploy → Acceptance & Archive
```

Not every feature goes through all eight steps. A small bug fix might start at stage three and jump straight to seven. But for large features — the kind that span frontend and backend and require data model changes — the full pipeline has the best ROI. The time invested upfront in specification saves far more time later by avoiding dead ends.

## How Requirements Come In

Requirements enter through three channels, but everything eventually lands in the `docs/product/` directory:

**PM's PRD/FRD** — The PRD describes "what to build and why," the FRD covers "how it specifically works." Not every feature needs both; a small feature can get by with just an FRD.

**Designer's Figma files** — Screenshots go into the docs directory, or you can paste a Figma URL directly. During development, Figma MCP lets Claude Code read design files without context-switching.

**Prototypes** — Some things are hard to articulate in writing, so just build a prototype on a branch. Once validated, put the conclusions back into docs.

The key is having everything in one place. No digging through Notion, no searching Slack, no asking "where's that spec again?"

## Using OpenSpec to Turn Requirements into Engineering Tasks

PRD/FRD describes "what the product needs." Engineers need "what specifically to do." OpenSpec handles the translation in between.

The flow looks like this:

```
/openspec-explore       → Clarify requirements, ask questions, explore approaches
/openspec-new-change    → Create a change, generate a proposal
/openspec-continue      → Progressively generate design → specs → tasks
/openspec-apply-change  → Start implementation based on tasks
```

Each step produces an artifact that progressively refines vague requirements into a concrete plan:

- **proposal** — Is the direction right? How large is the scope? What are the risks?
- **design** — What architecture? What does the API look like? How does the data model change?
- **specs** — Complete specification for each feature point, including edge cases
- **tasks** — Engineering task list, with each task scoped to 2–4 hours

Before running apply-change, a human reviews all artifacts. This is the most important quality gate — better to spend an extra half hour here than to write 500 lines of code before realizing the direction was wrong.

## Automated Protection During Development

While writing code, Claude Code hooks run silently in the background:

**Before writing files** — `pre-write-guard.sh` intercepts sensitive files like `.env`, `.pem`, `.key`, protects migrations from accidental modification, and loads each project's coding rules.

**After writing files** — `post-write-format.sh` auto-formats. JavaScript/TypeScript uses Biome, Python uses Black + Ruff. Written code is always properly formatted.

These two hooks are fool-proofing mechanisms. AI occasionally does unexpected things (like overwriting `.env`), and hooks ensure those situations are caught.

## Commit: Two Steps to Ensure Quality

Not just `git commit`.

**Step 1: pre-commit-check** — Automatically runs lint + typecheck. Auto-fixable issues get fixed; non-fixable ones are listed. This ensures code entering the commit at least passes basic quality thresholds.

**Step 2: format-commit** — Interactively generates a commit message. Choose a type, choose a scope, write the reason (Why), then the skill analyzes the diff and automatically generates what was done (How).

The output looks like this:

```
feat(notification): add email notification scheduling

## Why is this necessary?

- Users reported that in-app notifications alone weren't enough; they often missed important messages
- PM survey showed 40% of users wanted email notifications

## How does it address?

- Added NotificationEmailJob to handle email send scheduling
- Added email channel routing logic in NotificationService
- Built email template system with Traditional Chinese / English support
```

Looking at this commit three months later, you know why it was changed and what changed — without reading a single line of code.

## Pre-Push Local Review

After committing but before pushing, the `code-review` skill reviews all changes across the entire branch:

- Logic errors (conditionals, null checks, boundary handling)
- Security issues (injection, XSS, sensitive data exposure)
- Performance issues (N+1 queries, unnecessary re-renders)
- Architectural consistency (does it follow project conventions)

Catching obvious problems before code leaves the local machine reduces back-and-forth on the PR.

## Four Parallel Checks on the PR

After pushing and opening a PR, GitHub Actions automatically triggers four things:

| Check | Engine | What It Does |
|-------|--------|--------------|
| Auto PR Description | GPT-4o-mini | Auto-generates a Traditional Chinese PR description from commit log |
| AI Code Review | GPT-4o-mini | Reviews the diff, produces severity-graded comments |
| Gemini Code Assist | Google Gemini | Additional AI review + PR summary |
| CI | GitHub Actions | lint + typecheck + test + build |

All four run in parallel and finish within 2–5 minutes.

Two different AI reviewers using different models look at the code from different angles — the combined coverage is higher than any single reviewer. AI Code Review comments are severity-labeled: 🔴 High (must fix), 🟡 Medium (suggested fix), 🟢 Low (can ignore).

After they finish, the `collect-pr-feedback` skill gathers all feedback at once — CI status, comments from all three reviewers — organizes them by category, and asks "which of these do you want to fix?" No more manually scanning through a dozen comments one by one.

## Automated Deployment

After merging to main, everything is fully automatic:

| Project | Deployment Method | Target |
|---------|-------------------|--------|
| Frontend (Next.js) | Docker → Linode | daodao.so |
| Backend (NestJS) | Docker → Linode | server.daodao.so |
| AI Service (FastAPI) | Docker → Linode | ai.daodao.so |
| Database | SSH → migration | PostgreSQL |
| Background Jobs | Wrangler | Cloudflare Workers |
| Infrastructure | Docker restart | Nginx |

No manual steps required. GitHub Actions sends a notification if anything fails.

## Acceptance and Archiving

After deploying to production, return to OpenSpec to wrap up:

```bash
/openspec-verify-change   # Compare implementation against spec, confirm nothing is missing
/openspec-archive-change  # Archive; artifacts are retained as historical record
```

## Tradeoffs in This Workflow

**The benefits are real**: one person can maintain quality across six sub-projects, commit messages are meaningful, and most PR issues get caught before merge.

**The costs are real too**: high upfront setup cost (hooks, skills, and workflows all need to be written and tuned), the workflow isn't zero-error (AI reviewers have false positives), and every time you change the workflow you need to update multiple config files in sync.

**When it doesn't fit**: small side projects don't need a workflow this heavyweight. If your project has one repo, CI finishes in 30 seconds, and things rarely change — just write code.

**When it fits well**: multiple sub-projects requiring consistent quality standards, one person or a small team managing many things, requirements that keep coming in and need to be tracked.

The key isn't how complete the workflow is — it's whether each automated step genuinely reduces your cognitive load. If any step feels like going through the motions, simplify or remove it. The workflow is the tool, not the goal.

## References

- [Claude Code Official Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Hooks Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [OpenSpec GitHub](https://github.com/openspec-dev/openspec)
- [GitHub Actions Official Docs](https://docs.github.com/en/actions)
- [Biome Official Site](https://biomejs.dev/)
- [Figma MCP](https://www.figma.com/blog/introducing-figma-mcp/)
- [Claude Code's Three-Layer Quality Defense: Hook, Skill, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — Detailed explanation of the Hook and Skill mechanism
- [Using Claude Code Remote Agent for Late-Night Automated Development](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline) — Remote Agent workflow for automatically picking up Issues and opening PRs
- [/file-bug-issue Skill and Remote Agent Integration](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) — Automatically converting debug conversations into GitHub Issues
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
