---
title: "Funding Brief｜Temporal Series E $550M"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, funding, daily, temporal, agent-framework]
lang: en
description: "Durable execution engine Temporal closes a $550M Series E at a $12.55B valuation, with OpenAI, NVIDIA, and JPMorgan Chase as paying customers — a bet that agents need to actually stay alive"
tldr: "Temporal closed a $550M Series E co-led by Lightspeed, with its valuation climbing from $5B at Series D seven months ago to $12.55B — a 2.5x jump. The round signals that the market now treats durable execution as required infrastructure for putting agents into production, not an optional engineering nicety."
series:
  name: "AI Agent Funding"
  order: 34
---

> 🌏 [中文版](/posts/daily/2026-09-15-funding-temporal)

## Funding Details

| Field | Value |
|---|---|
| Company | Temporal Technologies (San Francisco, USA) |
| Round | Series E |
| Amount | $550M |
| Lead investors | Lightspeed (co-lead), Wellington Management, Goldman Sachs Alternatives' growth equity arm, Tiger Global (co-leads) |
| Follow-on | T. Rowe Price, SV Angel (new); a16z, Sequoia Capital, Index Ventures, GIC, Sapphire Ventures, Amplify (returning) |
| Valuation | $12.55B (up from $5B at Series D, roughly 2.5x) |
| Total raised | Approximately $1.3B (roughly $754.5M disclosed before Series D plus this $550M round; exact figures aren't fully public on Crunchbase) |
| Founded | 2019 (originated as Cadence, an internal Uber project open-sourced in 2017) |
| Headcount | 570 (company-disclosed, doubled over the past year) |

## What the company does

Temporal builds a durable execution engine — it lets developers write ordinary application code without hand-rolling retries, state persistence, and failure recovery, and Temporal guarantees that logic will pick back up correctly from wherever it left off, whether the task takes seconds or spans weeks.

The core product is an open-source workflow orchestration platform paired with a managed cloud service, Temporal Cloud. Developers write code that looks like a normal program, in whatever language or toolchain the job calls for, and Temporal handles state persistence and failure recovery across systems behind the scenes. An application can pause for days awaiting human approval, and even if a service crashes in the meantime, it resumes exactly where it left off after restart — without developers building that machinery by hand each time. The company positions this as infrastructure for the agent era: customers are now asking to run agents that work continuously for days, weeks, or months, not agents that finish in a single call.

The platform now serves more than 4,300 paying customers (up 139% year over year), with named customers including OpenAI, Snap, NVIDIA, and JPMorgan Chase: Snap moves 414 million Stories a day on the platform, JPMorgan Chase runs it in regulated production, and OpenAI's usage has grown 60-fold in under a year. Open-source installs have passed 43 million (up 134% year over year), annualized revenue run rate is up more than 200%, and net dollar retention has held above 200% since February 2026.

## What this round signals

### What it means for the agent ecosystem

At $550M, this is one of the largest rounds so far in 2026 for the agent-infrastructure category — and it landed just seven months after Series D ($300M in February 2026 at a $5B valuation), with valuation up 2.5x in that span. The stated use of funds is straightforward: expand global operations, deepen investment in the platform's core primitives, and ship the reliability and security work enterprise customers keep asking for. The signal is clear: as agents move from "runs a working demo" to "enterprises trust it to carry real workflows for weeks," durable execution and state management — problems that used to only matter to distributed-systems engineers — are becoming infrastructure the agent ecosystem has to solve properly, rather than something every agent framework quietly hand-waves on its own.

### What investors are betting on

Lightspeed moved from a follow-on investor to a co-lead this round, a step up from Series D where a16z led — a sign that Temporal has moved from "early bet on distributed-systems infrastructure" to a stage where multiple top-tier growth-equity firms are competing to get in. Wellington Management, Goldman Sachs Alternatives' growth-equity arm, and Tiger Global are the kind of late-stage growth funds that typically show up once a company already has a clear, verifiable revenue growth curve — not while it's still a concept to prove out. OpenAI's VP of Infrastructure, Venkat Venkataramani, endorsed the round directly in the announcement, noting that OpenAI itself built its durable orchestration framework on top of Temporal. That "the AI labs use it themselves" signal carries more weight than any third-party recommendation could.

### Numbers worth watching

- Valuation went from $5B (February) to $12.55B (September) — a 2.5x jump in seven months, faster than the typical annualized multiple for a late-stage growth round, reflecting a premium the market is currently paying for the "agent infrastructure" category
- Annualized revenue growth above 200% and net dollar retention above 200% held simultaneously — meaning growth isn't just coming from new logos, existing customers' usage is scaling right alongside them
- OpenAI's usage growing 60x in under a year is one of the most extreme publicly disclosed usage-growth figures for any single infrastructure vendor used by a frontier AI lab

## Watchlist status

Temporal is already tracked in watchlist section B2. Tracking focus updated to: the $550M Series E, the $12.55B valuation (up 2.5x from $5B in seven months), and continued validation that durable execution is a real requirement for agents' long-horizon tasks.

## Today's takeaway

It's tempting to treat "agent framework" and "workflow orchestration engine" as two fairly separate categories — one handles how an agent thinks, the other handles how the underlying system keeps running. But this round points at a trend worth sitting with: as an agent's task horizon stretches from seconds to weeks, the question of "how the agent thinks" quietly gets swallowed by the question of "how the system guarantees a week-long task doesn't die halfway through." That's also why OpenAI's own durable orchestration framework was built on top of Temporal instead of reinventing that wheel.

## References

- [Temporal raises $550M at a $12.55B valuation as demand grows for reliable AI infrastructure](https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai)
- [Temporal Raises $550M Series E at $12.55B Valuation to Expand Operations](https://www.unite.ai/temporal-raises-550m-series-e-at-12-55b-valuation-to-expand-operations/)
