---
title: "CS146S Week 4: What Goes in CLAUDE.md, What Hooks Should Block, Where Subagents Cut"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - claude-code
  - agentic-coding
  - multi-agent
  - context-engineering
  - ai-agent
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 5
tldr: "The instruction file is the only thing loaded in full on every startup, which makes it config rather than memory — write too much and you dilute the rules that matter. Hooks cover what instructions can't: a rule can be ignored, a hook cannot. Subagents earn their keep by burning tens of thousands of tokens and returning 1,000–2,000."
description: "Stanford CS146S Fall 2026 Week 4, 'Customizing Your Agent and Repository': the division of labor between CLAUDE.md and AGENTS.md, hooks as deterministic gates, planner/implementer/reviewer subagent patterns, and how each of the three fails."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agent-customization)

This is the fifth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 4 of Fall 2026.

Three topics: what belongs in `CLAUDE.md` versus `AGENTS.md`, hooks for lint gates and test runs, and planner / implementer / reviewer subagent patterns. The guest is Boris Cherny — creator of Claude Code, who also spoke in Fall 2025; this time it's a fireside Q&A.

These look like three features. They are really **three answers to one question**: how do you get an agent to work your team's way every time, without repeating yourself every time.

## Instruction files are config, not memory

`AGENTS.md` was introduced by OpenAI in August 2025 and is now stewarded by the [Agentic AI Foundation](https://aaif.io/) under the Linux Foundation. Its [site](https://agents.md/) reports adoption by "over 60k open-source projects," with support spanning Codex, Cursor, the Copilot coding agent, Gemini CLI, Devin, Warp, Zed, and Factory. Claude Code reads `CLAUDE.md`.

Both are plain Markdown with no required fields. The agents.md FAQ is blunt: "AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide."

**What goes in.** agents.md suggests project overview, build and test commands, code style, testing instructions, and security considerations. Its test is "anything you'd tell a new teammate."

**What doesn't.** Here's the trap. Describing how Claude Code works, Anthropic's [context engineering post](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) says `CLAUDE.md` files "are naively dropped into context up front" — naively, up front, meaning unconditionally, in full, every time.

So the instruction file is **the one layer with no progressive disclosure protecting it**. Skills have three levels (see [Week 3](/posts/ai/2026-08-16-cs146s-agent-skills-en)), files are read on demand, tool definitions can be loaded lazily. Only the instruction file arrives whole, every session.

Its failure mode therefore isn't "not found" — it's **dilution**. Write three hundred lines and the five that matter compete with two hundred ninety-five that don't. The test:

- Hard rules that always apply → instruction file
- Procedures for a class of task → a skill
- Rules that apply to one directory → a nested instruction file (agents.md supports this; "The closest AGENTS.md to the edited file wins," and OpenAI's own main repo has 88 of them)

If you use tools from two vendors, the common pattern is a single `AGENTS.md` as the source of truth with `CLAUDE.md` importing it in one line, rather than two copies that drift.

This site's `CLAUDE.md` is written as config: it opens with a tier table (Tier 0 act autonomously / Tier 1 pass the gate / Tier 2 ask first / Tier 3 forbidden), turning "what can I just do" into a lookup rather than advice scattered through prose.

## Hooks: a rule can be ignored, a hook cannot

Instruction files and skills share one weakness: **they are suggestions**. The model usually complies, and "usually" is not enough for CI.

Hooks fill that gap — deterministic programs that run at fixed points in the agent's lifecycle, with results that don't depend on the model's mood. Typical uses:

| Point | What runs | What it blocks |
|---|---|---|
| After a file edit | formatter / linter | style drift, syntax errors |
| Before a command runs | command allowlist check | accidental deletes and pushes |
| Before finishing a task | tests, type checks | "I fixed it" without running anything |
| Before commit | the project's full verification | red things entering the repo |

This site takes the last option: `package.json` declares `"simple-git-hooks": { "pre-commit": "pnpm verify" }`, and `pnpm verify` runs lint, internal reference checks, skill-directory sync checks, and a `progress.txt` protocol check in one pass. A matching Tier 3 rule in CLAUDE.md forbids bypassing it with `--no-verify`.

**A hook's value isn't automation, it's non-negotiability.** "Please run the tests before committing" in an instruction file is a rule; a pre-commit hook is a gate. The difference is whether you still trust it three months from now.

Factory makes the same point from another angle in its [agent readiness](https://factory.ai/news/agent-readiness) write-up: "Missing pre-commit hooks mean the agent waits ten minutes for CI feedback instead of five seconds." For an agent, a hook is not only a gatekeeper — it compresses the feedback loop from ten minutes to five seconds. That thread runs directly into [Week 5](/posts/ai/2026-08-16-cs146s-agent-ready-codebase-en).

## Subagents cut context, not tasks

The course lists planner / implementer / reviewer. What matters is that a subagent's real mechanism isn't the division of labor — that's the surface — it's **context isolation**.

Anthropic's framing: subagents explore in clean contexts, and "each subagent might explore extensively, using tens of thousands of tokens or more, but returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)."

That ratio is the whole value. The main thread gets the conclusion; the tens of thousands of exploration tokens stay behind.

When to split:

- **A one-sentence answer requires a lot of exploring** — "where does this repo handle permissions?" reads twenty files, returns a paragraph
- **You need an independent perspective** — the reviewer shouldn't have seen the implementer's reasoning. Same principle as [Week 2's RePPIT rule](/posts/ai/2026-08-16-cs146s-context-engineering-en): the instance that wrote the code doesn't review it
- **Work is parallel and independent** — five unrelated files, five agents

When not to:

- The task is short — startup cost exceeds the savings
- Subtasks need to trade intermediate state constantly — that exchange spends back the context you saved
- You just want it to look more architected

Anthropic's summary posture on these choices is worth copying: "do the simplest thing that works."

## Putting the three together

A sensible order of adoption:

1. Write the **ten-line version** of the instruction file: how to build, how to test, what never to touch
2. Watch where the agent actually goes wrong
3. Errors a program can catch → a hook
4. Errors from not knowing the procedure → a skill
5. Errors from context filling with irrelevant material → a subagent
6. Only the always-applicable hard rules stay in the instruction file

Doing it in reverse — starting with three hundred lines of instructions — is the most common order and the least effective one.

## What will go stale

- Claude Code currently reads `CLAUDE.md` rather than `AGENTS.md`; that can change between releases, so check current docs
- The 60k project count is agents.md's own figure (linked to a GitHub search), not a third-party census
- This site's hook configuration is a 2026-08-16 snapshot

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 4 topics and guest
- [AGENTS.md](https://agents.md/) — format, supported tools, nesting rules, and FAQ
- [Agentic AI Foundation](https://aaif.io/) — current steward of AGENTS.md
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic Engineering, assigned in Fall 2025 Week 4
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering, on subagents and how instruction files load
- [Introducing Agent Readiness](https://factory.ai/news/agent-readiness) — Factory, 2026-01-20, on pre-commit hooks and feedback loops
