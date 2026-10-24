---
title: "Funding Alert｜Blacksmith Raises $66M Series C, Doubling Its Valuation to $1B in Two Months"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, funding, daily, blacksmith, ci-infrastructure]
lang: en
description: "CI cloud platform Blacksmith raised a $66M Series C led by Sequoia Capital, jumping from a $550M to a $1B valuation in just two months — a sign that AI coding agents have pushed the bottleneck from writing code to validating it"
tldr: "Blacksmith raised a $66M Series C led by Sequoia Capital at a $1B valuation, just two months after its last round. The signal: as Cursor, Claude, and Codex make writing code \"extremely easy,\" the bottleneck has shifted to validating it — Blacksmith's ARR grew 17x in a year and its CI job volume grew 18x, proof that this new bottleneck is already being priced."
series:
  name: "AI Agent Funding"
  order: 104
---

> 🌏 [中文版](/posts/daily/2026-10-24-funding-blacksmith)

## Funding Details

| Item | Value |
|---|---|
| Company | Blacksmith Software (San Francisco, USA) |
| Round | Series C |
| Amount | $66M |
| Lead | Sequoia Capital |
| Participants | Peak XV Partners, Y Combinator, GV |
| Valuation | $1B (up from $550M at Series B — a 1.8x jump in just 2 months) |
| Total raised | $125M |
| Founded | 2024 |
| Headcount | ~40 (plans to expand to 75 by year-end) |

## What this company does

Blacksmith runs a CI (continuous integration) cloud platform that helps companies build and test code more efficiently — including a growing share of code that AI now writes.

It owns its own hardware and runs a dedicated, globally distributed CI cloud, instead of the usual approach of renting compute from AWS, Azure, or GCP to run CI jobs. It also automates much of the manual setup work that used to precede every test run. The pitch is simple: hand Blacksmith your CI workload, and it runs faster than you could run it yourself, with zero operational overhead.

The company now counts more than 10,000 customers — up from roughly 5,000 in August, doubling in two months — including Mercury, Granola, LangChain, and Supabase. Some of its largest customers pay more than $1M a year, and overall revenue is now in the "tens of millions of dollars."

## What this round signals

### What it means for the agent ecosystem

Blacksmith co-founder and CEO Aditya Jayaprakash laid out the core logic: before AI coding assistants, developers spent roughly half their time writing code and half waiting for builds and tests to finish. Now that Cursor, Claude, and Codex have made writing code "extremely easy," the bottleneck has moved to the second half — validating all that code. That points to coding agents splitting into two layers: the agents that write code (Cursor, Cognition, Windsurf) and the infrastructure that validates it (Blacksmith) — a bottleneck that only became visible once the first layer exploded. Anthropic's own numbers back this up: its CI workload grew more than 25x over six months as Claude took over most of its code-writing duties.

### What the investors are betting on

The most notable detail in this round is the lead investor swap. Series B was led by Peak XV Partners at a $550M valuation; this time, Sequoia Capital's US parent fund stepped in to lead, with Peak XV reduced to a participant. That typically signals that the previous round's market validation — the valuation jumped from $60M to $550M in nine months — was convincing enough for a larger fund to pay a steeper multiple to get in. Sequoia's logic follows its usual developer-tools playbook of claiming the infrastructure layer early: the bet isn't on which coding agent wins, but that whoever wins, someone has to validate their output.

### Numbers worth tracking

- Valuation trajectory: $60M (Series A, September 2025) → $550M (Series B, August 2026, 9.2x in 11 months) → $1B (Series C, October 2026, another 1.8x just 2 months later) — the rate of increase is itself accelerating, not linear
- CI job volume: from roughly 5 million per week at the start of the year to roughly 90 million per week in October — an 18x increase in under 10 months
- Customer count: roughly 5,000 in August to more than 10,000 in October, doubling in two months, while ARR grew 17x — meaning existing customers are ramping usage faster than new customers are being added

## Watchlist status

Blacksmith is not yet on the watchlist. Recommend adding it as infrastructure adjacent to coding agents — not an agent itself, but the validation layer for code agents produce — tracking whether its CI workload keeps spiking in lockstep with frontier model releases (its CI volume reportedly jumped more than 40% in a single day when Claude Fable 5 launched), and whether AI model vendors start building this capability themselves, threatening Blacksmith's position.

## Today's takeaway

The most counterintuitive part of this round isn't the dollar amount — it's that Blacksmith's valuation doubled faster than its product could plausibly have improved. Going from $550M to $1B in two months wasn't driven by a new feature; it was the market suddenly grasping how severe it is that "coding agents now write code faster than humans can validate it." When a bottleneck-naming signal (Anthropic's 25x CI surge) persuades investors more than a product roadmap does, naming the bottleneck first is itself a competitive advantage in this round of AI infrastructure investing.

## References

- [Blacksmith hits unicorn valuation after Sequoia leads Series C](https://techcrunch.com/2026/10/21/blacksmith-hits-unicorn-valuation-after-sequoia-leads-series-c/)
- [Code testing startup Blacksmith becomes a unicorn after raising $66M in Series C funding](https://siliconangle.com/2026/10/21/code-testing-startup-blacksmith-becomes-a-unicorn-after-raising-66m-in-series-c-funding/)
- [Blacksmith Raises Sequoia-Led Series C at $1 Billion Valuation to Scale Code Validation](https://www.prnewswire.com/news-releases/blacksmith-raises-sequoia-led-series-c-at-1-billion-valuation-to-scale-code-validation-302915140.html)
