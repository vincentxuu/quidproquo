---
title: "Pricing Watch: Google Kills Jules Coding Agent, Subscription Price Stays Put"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: en
description: "Google announced on 2026-10-29 that Jules, its async coding agent, goes read-only on 11/11 and shuts down fully on 12/31 — with no corresponding cut to Google AI Pro/Ultra subscription prices."
tldr: "Google's Jules coding agent went read-only on 2026-11-11 and shuts down fully on 12/31. Google AI Pro ($19.99/mo) and AI Ultra ($99.99/$199.99/mo) keep their current prices even though the built-in Jules task allowance disappears. Replacing it with GitHub Copilot Pro ($10/mo) or Cursor Premium ($30/mo) raises total subscription spend by 50%-150%."
series:
  name: "AI Pricing Watch"
  order: 35
---

> 🌏 [中文版](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown)

## Summary

On October 29, 2026, Google posted a "Jules Turndown" notice in the official Jules changelog: the async coding agent that clones a GitHub repo into a cloud VM, works a task in the background, and opens a PR will shut down entirely on December 31. It went read-only on November 11 — a window that, as of today (11/14), has already been in effect for three days. This isn't a classic "old price to new price" pricing event, but it squarely fits this column's API-sunset-and-deprecation beat, and it drags along a cost shift that's easy to miss: Jules's paid task quota is a bundled benefit of the Google AI Pro ($19.99/mo) and AI Ultra ($99.99-$199.99/mo) subscriptions, not a separately billed API. Google hasn't adjusted either subscription's price to reflect the feature's removal — the same monthly bill now buys less after December 31.

## Before / After

| Item | Before | After | Change | Effective date |
|---|---|---|---|---|
| Jules service status | Fully operational, new tasks can be created | Shut down entirely | Service termination | 2026-12-31 |
| Jules read-only window | None | View-only access to past sessions, no new tasks | Read-only mode | 2026-11-11 (already in effect) |
| Jules Free tier (15 tasks/day) | Available | Discontinued | Service termination | 2026-12-31 |
| Google AI Pro monthly price (included Jules in Pro: 100 tasks/day, 15 concurrent) | $19.99/mo | $19.99/mo (Jules benefit removed) | Price unchanged, benefit reduced | 2026-12-31 |
| Google AI Ultra monthly price (included Jules in Ultra: 300 tasks/day, 60 concurrent) | $99.99-$199.99/mo | $99.99-$199.99/mo (Jules benefit removed) | Price unchanged, benefit reduced | 2026-12-31 |

Google frames the shutdown as part of "unifying our agentic coding efforts," saying lessons learned from Jules will feed into Antigravity, its agent-first development environment — but it gives no date for feature parity, and doesn't say whether Jules's session history, memories, or scheduled tasks will carry over at all. Code, branches, and PRs already pushed to GitHub are unaffected, but account settings, environment variables, scheduled tasks, memories, setup scripts, session prompts and plans, activity logs, and code patches all need to be exported manually via Jules Tools before the service actually closes.

## Cost Breakdown

**Scenario**: A developer on Google AI Pro ($19.99/mo) who relies on Jules to run background tasks — bug fixes, dependency bumps, test coverage — needs a new home for that workflow after December 31.

| | Before: Google AI Pro + Jules | Option A: Google AI Pro + GitHub Copilot Pro | Option B: Google AI Pro + Cursor Premium |
|---|---|---|---|
| Google AI Pro | $19.99 | $19.99 | $19.99 |
| Background coding agent | $0 (bundled with Jules) | $10.00 | $30.00 |
| **Total/month** | **$19.99** | **$29.99 (+50%)** | **$49.99 (+150%)** |

This deliberately leaves out "wait for Antigravity to pick up the slack for free" as an option — Google hasn't given a feature-parity timeline, so it isn't something you can budget around today. Even if Antigravity eventually replaces Jules one-for-one, the gap between now and December 31 still needs a real answer.

## Impact on Developers and Teams

### Who's hit hardest

Developers running side projects on Jules's Free tier (15 tasks/day) take the most direct hit — that tier disappears on December 31 with no free successor. Paying subscribers face a subtler problem: nothing on a Google AI Pro/Ultra bill changes, but the feature set you're paying for just got smaller — a price increase that will never show up in any official "pricing change" announcement.

### Competitive landscape

Entry-level pricing for async/background coding agents (USD/month):

| Tool | Entry paid tier | Notes |
|---|---|---|
| GitHub Copilot Pro | $10.00 | Primarily synchronous assistance; agent mode still expanding |
| Google AI Pro (formerly included Jules Pro) | $19.99 | Jules shuts down 2026-12-31; Gemini chat and other features unaffected |
| OpenAI ChatGPT Plus (includes Codex) | $20.00 | — |
| Cursor Premium | $30.00 | Background agents + third-party models (billed at API rates) |
| Google AI Ultra (formerly included Jules Ultra) | $99.99-$199.99 | Jules benefit also removed |
| Devin | $500.00 | Positioned as a "fully autonomous software engineer" |

With Jules gone, the $10-$20 price band (Copilot Pro, ChatGPT Plus/Codex) becomes the most direct replacement option — though neither tool currently matches Jules's "assign a task, let it run in the background, get a PR back" model exactly, so expect some workflow adjustment.

### Recommendations

- If Google AI Pro/Ultra was primarily for Jules: it's already read-only since 11/11 — export everything you need with Jules Tools now (sessions, memories, scheduled tasks, setup scripts), not at the last minute before 12/31.
- If you need a continuous background-PR workflow: start trialing GitHub Copilot's coding agent or Cursor's background agent now. Don't bet on Antigravity reaching feature parity in time — Google has committed to no date.
- If your Google AI Pro/Ultra subscription is mainly for Gemini chat, Flow, storage, or other features: this shutdown has no real effect on you, and there's no need to re-evaluate the subscription.

## Timeline Alert

⚠️ **Read-only in effect**: 2026-11-11 (already active). No new tasks can be created or run; existing sessions remain viewable.
⚠️ **Shutdown date**: 2026-12-31. Jules shuts down completely. Code, branches, and PRs already on GitHub are unaffected, but account settings, environment variables, scheduled tasks, memories, and session history must be exported via [Jules Tools](https://jules.google/docs/usage-limits/) before then.

## Today's Takeaway

Most coverage of an API or service shutdown fixates on when it closes. The more useful thing to note here is that Google never reflected Jules's disappearance in the Google AI Pro/Ultra subscription price — the same monthly bill buys less after December 31. When tracking features that are "free because they're bundled into a subscription," a shrinking feature set is itself a hidden price increase. It never shows up in a pricing-change announcement — only when you re-audit what your subscription actually includes.

## References

- [Jules Turndown (official changelog, 2026-10-29)](https://jules.google/docs/changelog/2026-10-29/)
- [Limits and Plans | Jules (official plans and quota page)](https://jules.google/docs/usage-limits/)
- [Google AI Pro & Ultra subscriptions page (official pricing)](https://gemini.google/subscriptions/)
- [Google to Shut Down Jules AI Coding Agent in December 2026 — TimesOfAI](https://www.timesofai.com/news/google-jules-antigravity/)
- [Google's Jules shuts down December 31: 7 days left to export — dev.to](https://dev.to/piekwerk/googles-jules-shuts-down-december-31-7-days-left-to-export-your-coding-agents-memories-and-setup-5oi)
