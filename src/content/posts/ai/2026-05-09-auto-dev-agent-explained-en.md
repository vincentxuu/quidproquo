---
title: "What Is an Auto-Dev Agent? An Intro to daodao's Automated Development System"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - auto-dev-agent
  - product
  - automation-overview
  - non-engineer
  - notion
  - github
  - pipeline
lang: en
tldr: "A PM checks a task card in Notion → the system syncs it to a GitHub issue → writes a plan → writes code → opens a PR for human review. This post explains what the system does, what it doesn't do, and why it's feasible now — written for people who don't write code."
description: "What is an auto-dev agent? An introductory guide for PMs, designers, and founders: the automated pipeline from Notion tasks to GitHub PRs, 4 intervention modes, safety design, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-auto-dev-agent-explained)

## TL;DR

A PM checks a task card in Notion → the system syncs it to a GitHub issue → writes a plan → writes code → opens a PR for human review. This post explains what the system does, what it doesn't do, and why it's feasible now — written for people who don't write code.

If you want the technical details on how to build this system, jump straight to the [From Plan to PR: daodao's Auto-Dev Agent in Practice](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) case study or [15 Walls When Building Your Own Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/).

---

## A Day in the Life of a PM

Imagine you're a PM at daodao. After a morning meeting with the designer, you have a change request: "When the mood field is empty on the practice page, the check-in card should show an empty state instead of an error."

**Before the auto-dev agent**, the workflow looks like this:

1. You create a card on the Notion task board, writing a description and acceptance criteria
2. You open Slack to find an engineer and ask, "Can this be done today?"
3. The engineer takes a look → estimates the effort → schedules it into the sprint
4. The engineer opens a GitHub issue (manually copying the description from your Notion card)
5. The engineer creates a branch, writes code, pushes, and opens a PR
6. You review the PR and merge

The entire process from "you thought of it" to "PR is ready" takes at least half a day, and sometimes one to two weeks. Every step requires an engineer to actively pick up the baton.

**With the auto-dev agent**, the same workflow becomes:

1. You fill in the description and acceptance criteria on the Notion card
2. You check two checkboxes: `Status = Ready for Dev` + `Sync to GitHub = ✅`
3. Within an hour, a corresponding issue automatically appears on GitHub
4. Within two hours, a PR (for small tasks) or a spec PR (for larger tasks) is automatically opened on GitHub
5. You or an engineer review the PR and merge

From "you thought of it" to "PR is ready" in as little as two hours. Nobody has to actively pick up the baton — the system periodically scans Notion and automatically pushes tasks forward.

---

## It Does More Than Just "Sync Notion to GitHub"

If it were just syncing issues, tools like Zapier could already do that. The real value of the auto-dev agent is in the second half — **it writes the code itself**.

Think of it as an engineer who's "always online, never complains, but needs clear instructions":

- **Small tasks** (typos, adding an endpoint, changing button text): It writes code and opens a PR directly — you review and merge
- **Medium tasks** (a new feature requiring changes across several files): It first writes a "design proposal" (spec PR) — you review it, suggest a few edits, merge → it then writes code based on the merged spec and opens a second PR
- **Large tasks** (architectural changes, cross-service work): It only writes the design proposal — the code phase is handed off to humans

The decision logic behind this is configured by the PM in Notion:

| Notion Setting | System Behavior |
|---|---|
| `Auto Mode = manual` | Only syncs the issue, no code written |
| `Auto Mode = plan-only` | Writes plan / spec, no code written |
| `Auto Mode = auto-pr`, `Scope = XS / S` | Writes code and opens a PR directly |
| `Auto Mode = auto-pr`, `Scope = M` | Writes spec PR first, then writes code PR after human merge |
| `Auto Mode = auto-pr`, `Scope = L` | Only writes spec PR, code is mandatorily handed off to humans |

PMs don't need to understand code — they just need to learn: "How big is this task, and how much human involvement is needed?" The system follows the corresponding path based on the Notion settings.

---

## How Does It Avoid Going Rogue?

Letting an AI automatically open PRs sounds terrifying. In practice, the daodao system has several layers of protection:

### 1. Two Gates

Checking `Sync to GitHub` alone won't push a task to GitHub — `Status = Ready for Dev` must also be set. Both must be yes before syncing.

This prevents situations where "the PM is still brainstorming but the AI has already started writing code."

### 2. High-Risk Repos Are Forced to Non-Auto Mode

daodao has 8 repos, two of which are `daodao-storage` (database migration scripts) and `daodao-infra` (infrastructure). If either of these gets modified incorrectly, there's no going back — database migrations are production incidents, and infra mistakes take down the entire service.

Hardcoded in the system: **these two repos always run in plan-only mode**, even if the PM checks `auto-pr` in Notion. The system treats the Notion setting as a reference, not a command.

This safeguard is hardcoded in the source code (it can't be changed via configuration) — modifying it requires an engineer to go through the formal PR review process.

### 3. Four Ways to Hit the Brakes at Any Time

- **Pause everything**: Place an `.automation-paused` file in the project root — all routines stop immediately
- **Pause a single repo**: Place `.automation-paused-<repo>` to pause only that repo
- **Pause a single issue**: Add the `automation:hold` label to the issue
- **Permanent handoff**: Add the `human-driving` label to the issue — the system automatically steps back, removes its own labels, and leaves an audit comment: "🤝 Handed off to human"

PMs, engineers, or anyone with GitHub write access can hit the brakes. You don't need to be an engineer to slam on the emergency stop.

### 4. AI-Written Code Still Requires Human Review

After the system opens a PR, **it does not merge it on its own**. Humans review, CI runs green, humans approve, humans click merge.

This aligns with how top Silicon Valley companies operate: Stripe / Spotify / Ramp's internal agents all skip auto-merge — code still needs a final human sign-off. Coinbase is an exception, but they have a more complex multi-layered AI review council, which daodao hasn't scaled to yet.

---

## What It Can't Do

Don't be fooled by the phrase "automatically writes code." The auto-dev agent does NOT:

- **Come up with product strategy**: You still have to decide "what to build." The system only handles "how to build it"
- **Guess vague acceptance criteria**: The clearer the Notion card, the better the output. Garbage in, garbage out
- **Change things not in the spec**: It only touches what the issue description mentions — it won't "helpfully" refactor things on the side
- **Make sweeping changes across 8 repos at once**: Each issue can only target one repo
- **Replace senior engineering judgment**: Architecture decisions, performance bottlenecks, and security reviews still need humans. The system only handles "well-defined, verifiable" work

In plainer terms: **it frees engineers from repetitive labor — it doesn't replace engineers**. Spotify's CTO said their best engineers "haven't written a single line of code since December 2025" — that's because they're doing higher-level work (architecture, review, product decisions), not because engineers were replaced.

---

## Why This Is Feasible Now

This couldn't have been built two years ago. Three key changes made it possible:

1. **LLM-generated code is actually usable now**: Claude Sonnet 4.6 / Opus 4.7 achieve a high enough success rate on "medium complexity" work like multi-file refactors and bug fixes. Not 100%, but 70-80% — paired with human review, that's good enough
2. **"Guardrail" design has matured**: Stripe Minions, Ramp Inspect, Coinbase Cloudbot, Spotify Honk and other Silicon Valley companies have open-sourced specific guardrail designs (tool allowlists, verification loops, token budgets, and 15 other walls). No need to reinvent the wheel
3. **Claude Code Routines provides the infrastructure**: Anthropic turned "run on a schedule, with GitHub access, able to push code" into a SaaS product. No need to set up your own EC2 instances, write cron jobs, or manage secrets — configure three checkboxes and you're running

Top Silicon Valley companies merge thousands of PRs per week via internal agents ([Stripe 1,300/week, Spotify 1,000/10 days](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/)). A small team like daodao can use the same approach at 1/100 of the scale.

---

## Not Just Notion — Swap In Any PM Tool with an API

This article uses Notion throughout, but the system's task source is abstracted. **Only the "sync PM tool to GitHub issue" segment is tied to Notion** — the downstream plan / code / PR / safety gate logic doesn't care what tool you use.

You can swap in:

| Tool | Swap Difficulty |
|---|---|
| Linear | Easy (clean API, most popular in engineering circles) |
| Asana | Easy (concise REST, well-suited for non-engineering teams) |
| ClickUp | Easy (API design similar to Notion) |
| Jira | Medium (complex but comprehensive schema) |
| Trello | Medium (board / list / card structure is somewhat rigid) |
| GitHub Projects v2 | Easiest (direct GraphQL, same origin as GitHub) |

To swap tools, an engineer only needs to modify one module (from "Notion sync" to "Linear sync"). The other 14 files, 9 documentation pieces, and PR patrol logic — **completely untouched**.

The selection logic is usually: "Use whatever the PM / designer is comfortable with. The system adapts to people, not the other way around." daodao uses Notion because the design team has always collaborated there. If your team uses Linear or Jira, it works just the same.

---

## The Big Picture

If you're a PM, designer, or founder — here's how the auto-dev agent affects you:

- **Ideas reach production faster** (from one to two weeks down to a few hours)
- **The clearer your Notion cards, the faster your product iterates**
- **No need to chase engineers for sprint scheduling** (small tasks are handled automatically, big tasks go through spec PRs for engineers)
- **You don't need to learn to code, but you do need to learn to write clear acceptance criteria**

If you're an engineer —

- **More time reviewing code, less time writing boilerplate**
- **Architecture design and code review skills become more important** (you need to spot whether the system's code is correct)
- **Humans define "what correct looks like" (tests, specs), the system writes code to make it correct**

If you're a team lead —

- **Small teams can run this system too** (no need for Stripe-scale infrastructure)
- **But the upfront investment isn't cheap** (writing the plan + designing the walls alone takes 1-2 engineer-days)
- **Long-term ROI is 2-3x team output** (Meta heavy users saw 80% YoY improvement)

For the implementation details, start with the [case study](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/); for each wall in detail, see [15 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/); for a step-by-step guide, see the [tutorial](https://quidproquo.cc/posts/ai/2026-05-09-build-your-own-auto-dev-agent/).

---

## References

- [From Stripe to Meta: How Top Silicon Valley Companies Use AI Agents to Replace the Keyboard](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — How major companies do it
- [Lessons from Practice: What AI-Native Teams Should Get Right](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — 18 practical insights
- [From Plan to PR: daodao's Auto-Dev Agent in Practice](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — Design and pitfalls from the daodao case
- [15 Walls When Building Your Own Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/) — Detailed implementation specifics
- [Step-by-Step: Build a Notion-to-PR Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-build-your-own-auto-dev-agent/) — 12-step tutorial
- [Anthropic Claude Code Routines](https://code.claude.com/docs/en/routines) — The infrastructure the system runs on
- [Spotify CTO Gustav Söderström: Best Developers Haven't Written Code Since Dec 2025](https://techcrunch.com/2026/01/15/spotify-cto-best-developers-not-writing-code) — Engineer role transformation quote
