---
title: "Claude Code Workflows in Practice: Official Best Practices from Explore to Commit"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, best-practices, workflows, tips, productivity]
lang: en
tldr: "Anthropic's official Claude Code best practices boil down to one constraint: manage the context window. This post reorganizes their guidance into a working loop — explore, plan mode, implement with a runnable check, verify, commit — plus prompt techniques, when to /clear vs rewind, and the five failure patterns they call out."
description: "A workflow-first tour of official Claude Code best practices: exploring codebases, planning in plan mode, verifiable implementation, subagent review, parallel sessions and commit hygiene, with prompt techniques and common anti-patterns."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 5
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows)

This is part 5 of the "Claude Code Deep Dives" series. The [series entry](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) broke down the agentic loop's mechanics, and the [.claude directory tour](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory) covered where the config lives; this one is about how you **operate** that loop. The material comes from three official docs pages — best practices, common workflows, and the prompt library — rearranged into one full working cycle: explore, plan, implement, verify, wrap up. To see this cycle running on a real project, pair it with [my earlier write-up of an OpenSpec-to-deploy workflow](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy).

## Where every recommendation starts: the context window

The [official best practices](https://code.claude.com/docs/en/best-practices) open with the constraint behind most of their advice: the context window fills up fast, and performance degrades as it fills. It holds your entire conversation — every message, every file Claude reads, every command output. A single debugging session or codebase exploration can consume tens of thousands of tokens.

So every technique below is really doing the same thing: keeping limited context focused on the task at hand.

## Explore first, don't rush to code

When picking up an unfamiliar codebase, start broad, then narrow: "give me an overview of this codebase", followed by architecture patterns, key data models, how authentication works. Search by behavior instead of filename — "where do we validate uploaded file types?" — and before deleting anything, ask "what would break if I deleted X?"

Delegate large investigations to subagents. "Use subagents to investigate how our auth system handles token refresh" runs in its own context window, reads dozens of files there, and reports back only a summary — your main conversation stays clean for implementation. This is the most powerful context-management move available.

## Plan mode: separate thinking from doing

Press `Shift+Tab` until plan mode is on (or start with `claude --permission-mode plan`), and Claude reads files and proposes a plan without touching source files. The officially recommended four phases build on this: **explore** the current state, **plan** the implementation (press `Ctrl+G` to edit the plan directly in your editor), **implement** against the plan, then **commit** with a descriptive message and open a PR.

But plan mode has overhead. The docs are explicit: if you could describe the diff in one sentence (fixing a typo, adding a log line), just do it directly. Planning earns its keep when the change spans multiple files, you're unsure of the approach, or you're unfamiliar with the code.

## Implement: give it a check that produces pass/fail

This is, to me, the single most important item in the best practices. Without a runnable check, "looks done" is the only signal available — and you become the verification loop, with every mistake waiting for you to notice. With tests, build exit codes, a linter, or a screenshot comparison, the loop closes on its own: do the work, run the check, read the result, iterate until it passes.

Write the check into the prompt. Two official patterns:

```text
write tests for the password reset flow first,
then implement it until they pass
```

```text
here is a build error. fix the root cause
and verify the build succeeds
```

The first is the TDD variant — the tests define what "done" means, and Claude iterates until they're green. The second demands root cause plus verification, preventing surface patches that merely suppress the error message.

## Verify and course-correct: you're part of the loop

`Esc` interrupts whatever is running at any time; context is preserved so you can redirect immediately. Double-tap `Esc` (or `/rewind`) opens the rewind menu to restore conversation, code state, or both. Checkpoints are not a git replacement — bash-driven changes aren't captured — but they make "try a risky approach; rewind and pick another if it fails" nearly free.

A stronger safeguard is adversarial review: spin up a fresh subagent that sees only the diff and your criteria, not the reasoning that produced the change. "Use a subagent to review the rate limiter diff against PLAN.md. Report gaps, not style preferences." The built-in [`/code-review`](https://code.claude.com/docs/en/best-practices) does the same in one command. One caveat: a reviewer asked to find gaps will always find some — tell it to flag only issues affecting correctness or stated requirements, and treat the rest as optional.

## When to /clear, and wrapping up

If you've corrected Claude more than twice on the same issue, the context is cluttered with failed approaches — `/clear` and restart with a better initial prompt incorporating what you learned. The docs put it bluntly: a clean session with a better prompt almost always outperforms a long session with accumulated corrections. Also `/clear` between unrelated tasks.

For wrapping up: ask Claude to "commit with a descriptive message and open a PR". For tasks spanning multiple sittings, use `--continue` / `--resume`, and name sessions with `/rename`. To work in parallel, `claude --worktree feature-auth` starts an isolated session in its own checkout — run it again with a different name in a second terminal. For large migrations, [`/batch`](https://code.claude.com/docs/en/commands) first decomposes the work into 5 to 30 independent units; after approval, each background subagent implements its unit in an isolated git worktree, runs tests, and opens a PR.

## The five failure patterns Anthropic calls out

Each maps to a fix covered above:

| Failure pattern | Fix |
|---|---|
| Kitchen sink session: unrelated tasks in one session | `/clear` between tasks |
| Correcting over and over | After two failures, `/clear` with a better prompt |
| Over-specified CLAUDE.md drowning key rules | Prune ruthlessly; delete what Claude already does |
| Trust-then-verify gap: plausible-looking but untested | Always provide tests, scripts, or screenshots |
| Infinite exploration filling context with file reads | Scope narrowly or delegate to a subagent |

## What I took away

These patterns aren't laws. The final section of the official guide is literally titled "Develop your intuition": sometimes you *should* let context accumulate (deep in one complex problem), skip planning (exploratory tasks), or even give a vague prompt on purpose to see how Claude interprets it. A workable practice: whenever Claude does notably well or badly, trace it back to what you did — prompt structure, context provided, mode you were in. The judgment you build over a few cycles beats any guide.

## References

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Official guidance on context management, verifiable tasks, plan-mode workflows, scaling in parallel, and failure patterns
- [Common workflows](https://code.claude.com/docs/en/common-workflows) — Official everyday recipes: codebase exploration, debugging, testing, PRs, worktree-based parallel sessions, and script integration
- [Commands reference](https://code.claude.com/docs/en/commands) — Official command reference for `/batch`, `/clear`, `/code-review`, `/background`, and other built-in commands or bundled skills
- [Prompt library](https://code.claude.com/docs/en/prompt-library) — Official copy-paste prompts tagged by task and role, each with a "why this works" note

## Changelog

- 2026-08-26: Expanded from outline skeleton into full prose, based on the August 2026 official docs (best-practices / common-workflows / prompt-library on the new domain).
