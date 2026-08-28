---
title: "Managing Claude Code Costs: Token Tracking, Model Choice, Effort, and Team Analytics"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, cost, model-config, usage]
lang: en
tldr: "Claude Code costs accumulate with context size: enterprise deployments average ~$13 per developer per active day and $150–250 per month. This post covers /usage and /insights tracking, six token-saving tactics, and a systematic answer to 'which model should I use': provider-dependent model aliases, effort levels, fast mode ($10/$50 per MTok for Opus 5/4.8), and the advisor tool."
description: "Breaks down Claude Code's cost structure and tracking tools, covering /usage attribution, context management, model aliases and effort trade-offs, fast mode pricing, and team-level analytics dashboards."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 32
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage)

Subscription users often misunderstand what drives usage: they assume it tracks how much they type. In reality Claude Code bills by API token consumption (per the [official docs](https://code.claude.com/docs/en/costs)), and the main variable in token consumption is **context size** — every request carries the full conversation history, so a session that has been open all day meters the entire conversation even if you end with a one-line question. This is the costs chapter of the series, following the posts on [context window management](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management) and [prompt caching](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching); here we turn those mechanisms into money and plan limits.

## Where costs come from

First, the order of magnitude. Citing enterprise deployment data, the official docs put the average at roughly **$13 per developer per active day** and **$150–250 per month**, with 90% of users below $30 per active day. The variance comes from three things: model selection, codebase size, and usage patterns (multiple instances and automation both amplify).

When a long session's usage climbs for no obvious reason, the official docs name several causes:

- **Long context**: every tool call is a new request carrying all history.
- **Cache misses**: the first message after a break longer than the [prompt cache](https://code.claude.com/docs/en/prompt-caching) lifetime reprocesses your full context. The lifetime is one hour on subscriptions; once you draw on usage credits or switch to an API key, it drops to five minutes.
- **Background consumption**: scheduled tasks firing on their interval, cross-session messages arriving, agent teammates that haven't exited — all send full context while you appear idle.
- **Compaction itself**: `/compact` reads the conversation it summarizes, so compacting a large context is itself a large request. When you want a fresh start instead, `/clear` costs nothing.

## Tracking: /usage and /insights

`/usage` is the primary tracking command. The session block shows token detail and a dollar figure for the current session — by default this is estimated at list rates; if an organization sets `modelPricing` through managed settings, newer Claude Code versions display the organization's configured rates. It is still an estimate, and authoritative billing lives on the Usage page of the Claude Console. What subscription users should actually study is the **plan usage breakdown** below: it attributes recent usage to skills, subagents, plugins, and individual MCP servers (each as a percentage), and flags behaviors like long context and cache misses once they account for 10% or more. Newer versions also show the heaviest recent `/loop` or scheduled tasks; when usage credits are enabled, `/usage` also shows usage-credit spend for the month. Press `d` or `w` to toggle between the last 24 hours and 7 days.

If you want to understand how you work rather than how many tokens you've used, run [`/insights`](https://code.claude.com/docs/en/costs): it analyzes up to 200 recent local sessions and writes an HTML report (friction points, suggestions) to `~/.claude/usage-data/report.html`, with timestamped copies kept alongside it. The analysis itself consumes tokens counted against your plan.

## Practical ways to spend fewer tokens

From the official cost-reduction list, these have the highest return:

1. **`/clear` between tasks**. Stale context makes every subsequent message more expensive. Worried about losing the old session? `/rename` before clearing, then `/resume` to return.
2. **Custom compaction instructions**. `/compact Focus on code samples and API usage`, or add a `# Compact instructions` section to your project's CLAUDE.md.
3. **Keep CLAUDE.md lean**. It loads in full at every session start; move workflow-specific details into skills (loaded only on invocation). The official recommendation is under 200 lines.
4. **Preprocess output with hooks**. Instead of Claude reading a 10,000-line log to find errors, a PreToolUse hook can grep for `ERROR` lines — the docs' example shrinks tens of thousands of tokens to hundreds.
5. **Reduce MCP overhead**. MCP tool definitions are deferred by default now, but CLI tools (`gh`, `aws`, etc.) remain more efficient because they add no per-tool listing at all; disable unused servers via `/mcp`.
6. **Delegate verbose work to subagents**. Tests, doc fetches, log processing — send them out so only a summary returns to the main conversation.

And the simplest, most neglected one: **write specific prompts**. "Improve this codebase" triggers broad scanning; "add input validation to the login function in auth.ts" lands in one pass.

## Which model should I use: a systematic answer

The question readers ask most has an official answer spread across four doc pages; this section assembles it.

### The model family and defaults

As of 2026-08-29, the official docs steer users toward aliases rather than memorizing full model IDs: `best`, `fable`, `opus`, `sonnet`, `haiku`, `sonnet[1m]`, `opus[1m]`, and `opusplan`. What `opus` and `sonnet` resolve to depends on the provider: on the Anthropic API they currently resolve to Opus 5 / Sonnet 5; on Claude Platform on AWS, Opus 5 / Sonnet 4.6; on Bedrock and Google Cloud Agent Platform, Opus 5 / Sonnet 4.5; on Microsoft Foundry, Opus 4.6 / Sonnet 4.5. Aliases advance with Claude Code releases, so pin the full model name or use `ANTHROPIC_DEFAULT_*_MODEL` when drift would be a problem.

**Fable 5 is not the default on any account type** — select it explicitly with `/model fable`; the `/model` picker may only list it after the server reports that your organization has access. It is the strongest and most expensive model, suited to tasks larger than a single sitting, and on some plans its usage bills to usage credits (with a consent prompt).

The official division of labor is blunt: Sonnet handles most coding tasks, Opus is reserved for complex architectural decisions, and simple subagent tasks get `model: haiku` in their frontmatter. Another cost-saving combo is `opusplan`: Opus reasons during plan mode, then execution switches back to Sonnet automatically.

### Effort levels

[`/effort`](https://code.claude.com/docs/en/model-config) controls adaptive reasoning: the model decides how much to think on each step. Levels run `low` through `max`, with `high` as the default. Lower effort is faster and cheaper for straightforward tasks; `max` reasons deepest but may overthink — the docs say explicitly to test before adopting broadly. For one-off deeper reasoning without changing settings, put the keyword `ultrathink` anywhere in your prompt; it affects only that turn.

### Fast mode

[`/fast`](https://code.claude.com/docs/en/fast-mode) doesn't change models; it switches Opus to a latency-prioritized API configuration: up to **2.5x faster**, at $10/$50 per MTok input/output on Opus 5 / Opus 4.8. It is supported through the Anthropic API and subscription usage credits only, not on Bedrock, Google Cloud Agent Platform, Microsoft Foundry, or Claude Platform on AWS. Best for interactive debugging and rapid iteration; batch jobs and CI should stay on standard mode. Two gotchas: Team/Enterprise organizations need an Owner to enable it first, and enabling fast mode mid-conversation repays the entire context at uncached fast mode prices the first time — enable it at the start of a session.

### Advisor

The [advisor tool](https://code.claude.com/docs/en/advisor) (experimental) is the middle path: keep a cheaper model like Sonnet as the main, and let Claude consult a stronger advisor (Opus or Fable) at decision points — before committing to an approach, when stuck on a recurring error, before declaring completion. The advisor is an Anthropic API server tool and is not available on Bedrock, Claude Platform on AWS, Google Cloud Agent Platform, or Microsoft Foundry; it also receives the full conversation each time, so it isn't free. Consulting at decision points typically costs less than running the stronger model throughout. Set it with `/advisor opus`.

### When extended thinking is worth it

Extended thinking is on by default, thinking tokens are **billed as output tokens**, and the default budget can reach tens of thousands of tokens per request. The trade-off is clear: worth it for complex planning, pure waste for straightforward tasks — lower the effort level or disable thinking via `/config` to save. The exception is Fable 5: its thinking cannot be turned off.

## Team level: analytics dashboard and spend management

Individuals watch `/usage`; teams watch the [analytics dashboard](https://code.claude.com/docs/en/analytics). Teams/Enterprise find it at `claude.ai/analytics/claude-code`: daily active users, sessions, suggestion accept rate, leaderboard, CSV export, plus GitHub-integrated contribution metrics (which PRs contain Claude Code-assisted code) — matching is deliberately conservative, counting only high-confidence involvement, so the numbers are an underestimate. Per-user token counts and usage-credit spend live elsewhere: the org analytics spend report, the Enterprise Analytics API, or your own OpenTelemetry export. API customers use the Console dashboard at `platform.claude.com/claude-code` for per-user spend, accepted lines, activity, and team insights.

On spend caps, the Teams/Enterprise seat allowance is the default ceiling; letting members exceed it means turning on usage credits and setting spend limits at the organization, group, or individual level. Console customers use workspace spend limits. For real-time per-user numbers into your own observability stack, OpenTelemetry export is the only option supported across every setup.

## Lessons learned

Cost management boils down to one sentence: **context is the primary variable; everything else is a lever.** `/clear` and compaction control context size; model choice and effort control the price per token; fast mode and advisor shift chips between speed and quality. Run `/usage` first to see which attribution bucket your money goes to, then decide which lever to pull — doing it the other way around is tuning blind.

## References

- [Manage costs effectively — Claude Code Docs](https://code.claude.com/docs/en/costs) — token tracking, enterprise cost data, cost-reduction strategies, and why long-session usage climbs
- [Track team usage with analytics — Claude Code Docs](https://code.claude.com/docs/en/analytics) — Teams/Enterprise and API customer dashboards, contribution metrics attribution
- [Model configuration — Claude Code Docs](https://code.claude.com/docs/en/model-config) — model aliases, effort levels, extended context, auto-compact window
- [Speed up responses with fast mode — Claude Code Docs](https://code.claude.com/docs/en/fast-mode) — fast mode pricing, use cases, and usage credit requirements
- [Escalate hard decisions with the advisor tool — Claude Code Docs](https://code.claude.com/docs/en/advisor) — advisor pairings, consultation timing, and billing

## Changelog

- 2026-08-26: Initial version, written from the five official doc pages (costs / analytics / model-config / fast-mode / advisor).
- 2026-08-29: Updated `/usage` fields, model alias/provider drift, fast mode/advisor availability, and team analytics/spend wording from the official docs.
