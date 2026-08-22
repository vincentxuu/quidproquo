---
title: "How to Write a Claude Code Skill That Doesn't Eat Context: Entry Point, Thresholds, Cost, Sources"
date: 2026-08-22
category: ai
type: debug
tags: [claude-code, context-engineering, agent-skills, prompt-cache, dx]
lang: en
tldr: "I turned Anthropic's session-cost advice into a global skill, and the first version made the very mistakes it was meant to prevent: a description stuffed with trigger keywords, hard thresholds based on file counts and minutes, and 'protect the main context' conflated with 'spend fewer tokens overall'. Three rounds later the entry point is one page, details live in references, numeric thresholds became four judgment dimensions, and every claim from a draft post was checked against official docs."
description: "A record of three rounds of fixes to a global Claude Code skill: starting from Anthropic's session-cost advice, through an external review, re-reading the source articles to fill gaps, and verifying against official docs — and the four mistakes that are easiest to make when designing a skill."
draft: false
glossary:
  - term: "progressive disclosure"
    definition: "只在需要時才把細節載入，入口保持最小。"
    definition_en: "Load detail only when needed; keep the entry point minimal."
    context: "Here it means SKILL.md keeps only judgment and routing, while tables and command references move to files read on demand."
---

> 🌏 [中文版](/posts/ai/2026-08-22-token-efficiency-skill-design-lessons)

## TL;DR

I turned Anthropic's [session-cost advice](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions) into a global skill that proactively reminds me, and the first version made the mistakes it was supposed to prevent: a heavy entry point, arbitrary thresholds, two kinds of cost folded into one. The three rounds of fixes are more worth recording than the result.

## Context

Anthropic's post is about session-level habits: `/clear` when a task is done, pick model and effort at the start, add quiet flags to noisy commands, hand large outputs to subagents. I wanted more than having read it — I wanted Claude to apply it **proactively**: add `-q` before running tests, suggest `/clear` when I start something unrelated.

So I wrote a global skill at `~/.claude/skills/claude-code-token-efficiency/`.

## Problem

Reading the first version back, the problems were obvious.

**The entry point read like a spec.** The description listed a dozen trigger keywords plus seven "proactive intervention" conditions. A skill's description loads at the start of every session, so to save tokens I was first charging a fixed cost to every session.

**Quantities as judgment.** "More than five files → subagent", "more than 200 lines of output → truncate", "more than forty minutes → compact". These look actionable, but six 30-line files aren't worth a subagent, while one 20,000-line JSON file is a single file that should be isolated.

**Two costs conflated.** The table mapped "large output" straight to "use a subagent". A subagent protects the main context, but it also loads its own system prompt, CLAUDE.md, skills, and tool descriptions, then has to report back. The official docs only say verbose operations are good candidates for delegation — not that delegation is necessarily cheaper.

## What I tried

### Round one: external review

I asked another Claude session to review the skill against two posts on this site. It came back with nine points. Beyond the three above, it caught several places where I'd been too absolute:

- "Output costs five times input" is a price ratio, not a law, and it changes by model; write it as "roughly 5× for most current models, check the price sheet".
- Cache TTL must be scoped to the environment: about one hour for Claude Code subscription usage, five minutes by default for API keys — not one rule.
- "Changing effort invalidates the whole cache" over-generalizes; the [official docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) say message blocks are always invalidated, while tools and system depend on the model.
- `@path` saves the search round-trip, not context tokens; a large file attached this way still lands in context.
- `cmd | tail -50` drops the first error location and, without `pipefail`, hides upstream failures.

I restructured accordingly: SKILL.md keeps only judgment dimensions, routing, and when to speak up; tables and command references moved to `references/`, read only when needed.

### Round two: going back to the sources

Here I made the second mistake. The review was "based on two posts", and I applied it **without reading those posts myself**, on the grounds that "reading them would bloat the context". When asked "why didn't you read them?" I realized: the sources the user names are the spec itself; substituting someone's paraphrase replaces the spec.

I dispatched a subagent to read both in full and return only "in the article, not in the skill". The review had missed a lot with real operational value, all from [Context Is Full: Seven Answers](/posts/ai/2026-08-21-context-full-seven-answers-en):

- **Prune before you compress**: if the same task isn't done and the conversation just got wordy, cut bloated tool output at the source first; `/compact` rewrites tool calls as prose and erases message boundaries, so it's the last resort.
- **Hand off at phase transitions**: research done and moving to implementation, implementation done and moving to review — write the next goal first, then `/clear` and carry the conclusions into a new conversation; the summary should face forward, not backward.
- **Cache is prefix matching**: one token differs and everything after is recomputed, so toggling MCP servers or editing CLAUDE.md are cache boundaries too, not just model and effort changes.
- **Don't parallelize what must agree**: two subagents can't see each other, actions carry implicit decisions, and two halves of one feature done in parallel will collide.
- **Keep failure output**: quiet modes should only trim noise on the success path; stack traces are evidence.

### Round three: verifying the draft

The site also has an unfinished draft outlining when each feature loads into context. The review suggested folding it into the skill, but the draft itself was marked "to be written". I first proposed "which claims to take and why", then sent an agent to check each one against [code.claude.com](https://code.claude.com/docs/en/context-window).

Confirmed: skills load only their descriptions, MCP loads only tool names, subagents get an independent context, `.claude/rules/` load only on matching paths.

Needs an exception: "CLAUDE.md is present on every request" holds only for the root file; nested ones load only when Claude reads files in that directory.

Wrong: the "500-line limit". The official recommendation is 200 lines, and the hard limit is 4 MiB.

Not found: hooks costing zero, the `disable-model-invocation` field, the auto-compact trigger threshold. These were not taken.

Confirmed claims went into the skill, the wrong one was fixed in the draft, and unverifiable ones were marked as such there.

## Solution

Final structure:

```
claude-code-token-efficiency/
├── SKILL.md                      # 4.8 KB, loaded every time
└── references/
    ├── decision-table.md         # 6 KB, on demand
    └── quiet-commands.md         # 2 KB, on demand
```

SKILL.md has three core parts.

**Four judgment dimensions** replace every numeric threshold: how large is this material relative to the context, is it single-use, will I repeatedly edit the same batch, and is the cost of briefing a delegate close to the cost of just doing it.

**A routing table**, one situation and one action per row: same task unfinished but output bloated → prune first; phase transition → hand off; unrelated task → `/clear`; switching model, effort, or MCP → `/compact` or start fresh first.

**When to speak up**, in two classes: quiet flags, reading a region instead of a whole file, handing single-use exploration to a subagent — no information lost, just do it; truncating, sacrificing diagnostics, recommending `/clear` — say one sentence first. At most one reminder per class per session.

## Why it happened

All three rounds point to one root cause: **the skill's shape followed the research process instead of the load at time of use.**

Each of the four traps had a reason that looked sensible at the time:

1. **A fat entry point**: I wrote in everything I had read.
2. **Numeric thresholds**: numbers look most like rules.
3. **Two costs merged**: they appeared in the same paragraph of the source.
4. **Sources not checked in person**: I skipped the original articles because the summary looked sufficient, and took the draft's claims because they were stated with confidence.

Each step was reasonable on its own; together they produced a skill that violated its own principles.

## Takeaway

Anything that loads into every session needs its own fixed cost computed first; sources the user names must be read in person — delegate the reading and get the diff back if context is a concern, don't skip it; a confidently written draft is not a verified fact.

## References

- [Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions) — Anthropic's official session-cost advice; the starting point for this skill
- [Manage costs effectively](https://code.claude.com/docs/en/costs) — official cost management doc, including `/compact` as a large request and the 200-line CLAUDE.md recommendation
- [Explore the context window](https://code.claude.com/docs/en/context-window) — when each feature loads; source for deferred MCP schemas
- [Manage Claude's memory](https://code.claude.com/docs/en/memory) — on-demand nested CLAUDE.md, path-scoped `.claude/rules/`, the 4 MiB limit
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — 0.1× cache reads, effort changes invalidating message blocks
- [Context Is Full: Seven Answers](/posts/ai/2026-08-21-context-full-seven-answers-en) — the original write-up on pruning, handoff, isolation, and loading less
- [Agent Skills documentation](https://code.claude.com/docs/en/skills) — source for skill bodies loading only on invocation
