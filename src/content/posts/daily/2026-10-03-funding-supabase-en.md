---
title: "Funding Alert: Supabase Raises $150M and Acquires Turso, Second Round in 4 Months"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, funding, daily, supabase, ai-infrastructure]
lang: en
description: "Open-source Postgres platform Supabase closed a GIC-led $150M round just four months after its $500M Series F, and acquired database startup Turso to handle the surge of databases AI agents spin up on their own"
tldr: "Supabase raised a GIC-led $150M round only four months after its $500M Series F in June, and acquired Turso the same day to support agents that create databases at scale. The signal: backend infrastructure customers are shifting fast from human developers to agents that provision their own databases, and that shift is compressing the company's own fundraising cycle."
series:
  name: "AI Agent Funding"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-10-03-funding-supabase)

## Deal Terms

| Item | Value |
|---|---|
| Company | Supabase (San Francisco, US / Singapore) |
| Round | New funding (extension of the Series F, just 4 months after the original round) |
| Amount | $150M |
| Lead | GIC |
| Participants | CapitalG (Alphabet's independent growth fund), IronArc, SquarePeg |
| Valuation | Carries forward the $10.5B set at the June 2026 Series F (no new valuation disclosed) |
| Total raised | ~$1.19B (cumulative $1.04B through the June 2026 Series F's $500M, plus this $150M) |
| Founded | 2020, by Paul Copplestone and Ant Wilson |
| Headcount | ~350 (mid-2026) |

## What the Company Does

Supabase is an open-source Postgres backend platform — it bundles a database, authentication, file storage, edge functions, realtime subscriptions, and vector search into a backend a solo developer can stand up over a weekend. It's positioned as "the open-source Firebase alternative."

The product is built entirely on PostgreSQL, used by more than 13 million developers, with 250,000+ business customers including PwC, McDonald's, GitHub Next, and Mozilla. The biggest shift in 2026 is who those customers are: more than half of new databases are now created automatically by AI tools, with Claude Code alone among the largest sources of new databases that year, and "vibe coding" tools like Cursor, Bolt.new, and Lovable defaulting to Supabase as their backend.

Alongside the funding, Supabase announced it is acquiring Turso, a company building on-demand database infrastructure that lets a platform spin up large numbers of isolated database instances without provisioning a dedicated machine for each one; Turso's customers include Superhuman, Sauna.ai, and Mastra. Combined, the two companies are targeting a specific bottleneck: when an agent spins up a new database for every task, the old model of one machine per database stops scaling.

## What This Round Signals

### What It Means for the Agent Ecosystem

This is Supabase's third capital raise in seven months (a Series E in October 2025, a Series F in June 2026, and now this round), and the shrinking gap between rounds tracks a usage curve that's accelerating on its own, not just a valuation chase. The official announcement calls itself the leader in "agentic infrastructure" rather than a developer-tools company, which reflects a broader shift in the backend infrastructure narrative — from serving human developers to serving agents that write their own code and provision their own databases. The Turso acquisition targets exactly the part of that scenario that breaks first: the cost of creating and managing a single database has to fall as fast as, or faster than, the number of agents using it grows.

### What Investors Are Betting On

GIC backing the same company twice within four months (leading the $500M Series F in June, then leading this $150M round in October) suggests it believes Supabase's growth curve wasn't fully priced in by the prior round. CapitalG, Alphabet's independent growth fund, has historically favored companies with a demonstrated enterprise adoption curve rather than early-stage proof of concept — Supabase's 250,000+ customers and the 70% of databases now created by AI tools fit that "scale has already arrived, the bet is on defending it" profile.

### Numbers Worth Watching

- ARR grew from $70M in 2025 to an estimated $170M in 2026, roughly 143% year over year — but the valuation doubled from $5B (Series E) to $10.5B (Series F) in just 8 months, outpacing revenue growth
- New database creation is up 600% year over year, with 60-70% (estimates vary by source) now created automatically by AI tools or agents — the central evidence behind this round's narrative
- Supabase raised roughly $1.04B across 7 rounds (through the Series F) in 6 years, with the last three rounds ($200M Series D, ~$100-143M Series E, $500M Series F) landing within 14 months — a fundraising cadence that's clearly accelerating

## Watchlist Status

Neither Supabase nor Turso is currently on the watchlist. Recommend adding Supabase, loosely under B4 (Agent Memory / Context) or as a new "Agent Data Layer" subcategory, tracking its open-source Postgres backend and its capacity to supply isolated databases at agent scale — this round's $150M plus the Turso acquisition.

## Today's Takeaway

What makes this round notable isn't the amount — it's the cadence. Supabase went back for another $150M just four months after a $500M Series F, which shows that once your customer base shifts from human developers to agents that provision their own databases, even your fundraising cycle gets compressed to match your users' usage curve: infrastructure companies are starting to grow at the pace set by the non-human users they serve.

## References

- [Supabase Announces $150M in New Funding and Turso Acquisition](https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html)
- [Supabase Raises $150 Million and Acquires Turso to Scale Agentic Database Infrastructure](https://www.tipranks.com/news/private-companies/supabase-raises-150-million-and-acquires-turso-to-scale-agentic-database-infrastructure)
- [Supabase Raises $150 Million, Acquires Turso to Scale Agentic Databases](https://www.citybiz.co/article/913344/supabase-raises-150-million-acquires-turso-to-scale-agentic-databases)
- [Supabase Revenue, Valuation, Funding & Investors | Multiples](https://multiples.vc/private-comps/supabase)
