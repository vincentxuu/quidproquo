---
title: "Product Builder Interview Daily — 2026-11-21: Technical PM"
date: 2026-11-21
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "A Technical PM interview drill: a framework for deciding when an RFC is worth writing, then a Meta-style marketplace architecture question that forces a clear matching-speed-vs-quality trade-off."
tldr: "Whether to write an RFC depends on complexity and dependencies, not on a fixed rule. Today's practice question asks you to design a marketplace's architecture and pick a side on matching speed versus matching quality — then say exactly what would make you switch sides later."
series:
  name: "Product Builder 面試日練"
  order: 94
---

> :globe: [中文版](/posts/daily/2026-11-21-product-builder-interview-daily)

## Today's Focus

Technical PM interviews don't test whether you can code. They test whether, when engineering hands you a constraint, you can tell "this is genuinely impossible" apart from "this one approach doesn't work" — and whether you can argue a technical trade-off at the altitude a PM should. Today covers two things: first, RFCs (Request for Comments) and design docs as a cross-team decision mechanism, and when they're worth writing; second, a Meta-style technical PM architecture question — designing a marketplace's product architecture while making an explicit call on matching speed versus matching quality.

## Core Frameworks

### Framework 1: Whether to write an RFC depends on complexity and dependencies, not company size

A common trap is treating RFCs as bureaucracy reserved for big companies, or as a rule that applies to everything. In practice the test is simple:

| Situation | What to do |
|---|---|
| Small change, no cross-team dependencies | Don't bother — just make the change |
| Moderate complexity, some dependencies | Consider writing one; scope the effort to the complexity, and skip sections that don't apply |
| High risk, cross-team, many dependencies | Write one, with named approvers who must sign off or raise objections |

When a full RFC is overkill, the minimum viable decision record is an ADR (Architecture Decision Record) with four fields: **Status** (proposed / accepted / deprecated), **Context** (why this decision is needed now), **Decision** (what was decided), and **Consequences** (the trade-offs that decision carries). Fill in those four fields and the next person who asks "why was this built this way" has an answer already written down.

### Framework 2: Four steps for a PM making an architecture trade-off

When an interviewer asks you to design the architecture for a system, they aren't testing whether you can draw low-level technical detail — they're testing whether you hold a PM's altitude:

1. **Scope it first**: who are the actors in this system? What's the pilot's geographic footprint? Are there regulatory or security requirements that must land before launch?
2. **Find the minimum viable path, not a feature list**: get "complete the core action for the first time" working end to end; push ratings, advanced settings, and other nice-to-haves later.
3. **Pick one explicit trade-off and answer it head-on**: don't hedge with "it depends" — say exactly what option A gives up and gains, and what the opposite trade-off looks like for option B.
4. **Define metrics and experiments** that prove the choice was right: decide before launch which metric would tell you "we chose wrong," rather than figuring that out after shipping.

## Today's Practice Question

### The question

"You're a technical PM at Meta, designing the product architecture for a dog-walking marketplace — covering user journeys, matching logic, trust and safety, and payments — and you need to make an explicit call on matching speed versus matching quality." (Source: PracHub's "Technical Architecture For Product Managers" interview concept guide, framed as a Meta technical PM interview scenario)

### How to break it down

1. **Clarify scope first**: what are the core flows for owners, walkers, and support? Is this a single-city pilot or nationwide? Do background checks and insurance need to exist before launch, or can they be optional at first?
2. **Define the MVP as a path, not a feature list**: get "search → match → complete the walk → get paid" working first; ratings, insurance, and advanced route planning come later, prioritized by impact versus effort — and say explicitly why each cut item is safe to defer.
3. **Pick the matching trade-off and commit to a side**: greedy proximity matching (nearest-first) has low latency and a simple UX, and it's easier to reach the critical mass a new market needs — but it's weaker on match quality and pricing control. Batched auction matching improves quality and pricing, at the cost of higher latency and more engineering effort. For an early market chasing completed-match conversion, greedy wins — and you should name the condition (supply density, request volume) that would flip the decision toward batching later.
4. **Treat trust, safety, and payments as product decisions, not engineering hand-offs**: decide how identity verification, background checks, reviews, and incident reporting roll out in stages (optional early, mandatory as scale and risk grow), and whether payouts are escrowed or instant, and what the refund window is — all of which shape user trust and cash flow directly.
5. **Define success metrics and experiments**: track the supply-demand ratio (DAU/MAU), fill rate (matched requests ÷ total requests), median and p90 time-to-match, and supplier-side churn. Run a properly powered A/B test before launch and roll out in stages to limit the blast radius of a wrong call.

### Sample answer (the kind of thing you'd actually say in the room)

> **Scope first, architecture second**: "I'd scope this to a single-city pilot with three roles — owners, walkers, and support. I wouldn't ship insurance in v1, but background checks would be a hard gate before anyone can list as a walker, because trust is the foundation of this product — if that breaks early, it's very hard to repair later. The MVP just needs to support the full path: search, match, complete the walk, get paid. Ratings and advanced route planning can wait."
>
> **Commit to the matching trade-off, no hedging**: "For matching, I'd start with greedy proximity — low latency, simple logic, and it gets us to a completed-match conversion rate fast enough to keep both owners and walkers coming back. Batched auction matching would improve match quality and pricing control, but it adds latency and engineering cost we don't need yet when supply is still thin. I'd watch daily active walkers as the signal for when supply is thick enough to revisit batching."
>
> **Pair every metric with a guardrail**: "I'd track fill rate and p90 time-to-match as the primary metrics, but I'd watch supplier churn and incident-report rate as guardrails — if matching speed looks great but walkers feel the assignments are unfair and start leaving, that growth is borrowing against future supply."

### Self-check

| Check | Covered? |
|---|---|
| Did you define the actors and pilot scope before architecture? | |
| Is the MVP prioritized, not just a feature list? | |
| Did you name the matching trade-off explicitly — latency vs. quality — and pick a side? | |
| Did you treat trust, safety, and payments as product decisions, not engineering hand-offs? | |
| Did you define launch metrics like fill rate and p90 time-to-match? | |
| Bonus: did you name the condition that would flip the trade-off as the platform scales? | |

## Today's Case

**Uber's RFC system: from one engineer's "DUCK" doc to a risk-tiered review process**

Uber was founded in 2010 and made its first full-time engineering hire in 2011. Around 2012-13, when the engineering team was still under 50 people, one engineer created a Google Doc format called "DUCK" — named after the "rubber duck" habit of thinking out loud — to write proposals, challenges, and problems in plain language before a new service shipped. The practice caught on as a standard: new services got a DUCK sent to a mailing list, which let other teams spot dependencies before anyone started coding. As Uber grew to more than 1,000 microservices by 2016, DUCK evolved into the RFC (Request for Comment): backend, web, and mobile teams split off their own mailing lists to cut noise, and complex proposals gained an "approver" field requiring key people to sign off or raise objections. That machinery held up under real pressure in 2017, when Uber shipped a tipping feature in response to Lyft launching one first — in about two months, touching dozens of systems and more than twenty engineering teams. But once the engineering org passed 2,000 people, the RFC process started breaking down: hundreds of RFCs went out weekly to large mailing lists, every team interpreted "when do we need one" differently, and documents scattered across Google Drive folders became impossible to find. Led by a principal engineer, Uber consolidated the process into a tiered Engineering Planning Process: a searchable tool with clearly marked approvers integrated into the task system, lightweight templates for small changes, heavier templates for cross-org changes, and a weekly formal review reserved for the highest-risk changes.

**How to use this in an interview**: this case is the cleanest real example of Framework 1 — the rule for when to write an RFC grows out of actual pain points, not a decision made upfront. When asked "how do you keep engineering decisions high-quality as the org scales fast without slowing it down," you can walk through these three stages (one engineer's personal habit → an org-wide RFC process → risk-tiered review) and name the real trigger for change: not "the company got bigger," but the concrete symptoms — noise, inconsistent interpretation, and undiscoverable documents — that actually showed up.

## Further Reading

- [Engineering Planning with RFCs, Design Documents and ADRs](https://newsletter.pragmaticengineer.com/p/rfcs-and-design-docs) — the source for today's Uber RFC history, and a survey of how Google, Sourcegraph, and Stedi each run their own design-doc processes.
- [Top 100 Technical Product Manager Interview Questions](https://www.techinterviewprep.io/roles/technical-product-manager/qa) — a hundred common Technical PM interview questions with model answers, a good next step for more architecture trade-off practice.

## References

- [Technical Architecture For Product Managers](https://prachub.com/concepts/technical-architecture-for-product-managers) — the source for today's practice question and breakdown, including the full dog-walking marketplace worked example and the greedy-vs-batched matching trade-off.
- [Engineering Planning with RFCs, Design Documents and ADRs](https://newsletter.pragmaticengineer.com/p/rfcs-and-design-docs) — the source for the numbers and timeline behind Uber's DUCK → RFC → risk-tiered review evolution.
