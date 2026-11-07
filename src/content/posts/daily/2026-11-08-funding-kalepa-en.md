---
title: "Funding Alert: Kalepa's $75M Series B (Updata Partners leads, five years in the making)"
date: 2026-11-08
category: daily
type: digest
tags: [ai-agent, funding, daily, kalepa, insurance-ai]
lang: en
description: "Insurance underwriting AI company Kalepa closed a $75M Series B led by Updata Partners at a $470M valuation, five years after its Series A and while staying cash-flow positive"
tldr: "Kalepa raised $75M in a Series B led by Updata Partners at a $470M valuation, five years after its 2021 Series A. The signal: the division of labor where AI agents handle tasks and human experts sign off is now a real purchase decision in a regulated, high-stakes industry like insurance."
series:
  name: "AI Agent Funding"
  order: 128
---

> 🌏 [中文版](/posts/daily/2026-11-08-funding-kalepa)

## Funding Details

| Item | Value |
|---|---|
| Company | Kalepa (New York, USA) |
| Round | Series B |
| Amount | $75M |
| Lead investor | Updata Partners |
| Participants | IA Ventures, Inspired Capital (both existing investors from the 2021 Series A doubling down) |
| Valuation | $470M (the 2021 Series A was only $14M; this is the company's largest round to date) |
| Total raised | $91M |
| Founded | 2018 |
| Headcount | Undisclosed (the company says it plans to double its team by the end of 2027) |

## What the company does

Kalepa builds "professional-grade AI" for insurance companies — its customers are underwriters, not consumers.

Its core product coordinates multiple AI agents across a single workflow. When a new submission comes in, Kalepa pulls together the relevant data, risk assessment, and underwriting guidelines into one workspace, then decides whether an AI agent can handle the task directly or whether it needs to go to a human underwriter for sign-off, based on the task's complexity and risk. The company is explicit that autonomy is assigned dynamically by task, not handed wholesale to AI across the entire process — every result stays traceable and auditable. Customers include major insurers and MGAs such as W.R. Berkley, Bowhead Specialty, and AmRisc. The volume of work running through the platform grew 4x over the past year.

Co-founder and CEO Paul Monasterio holds a PhD in nuclear science and engineering from MIT. Before Kalepa, he worked at Applied Predictive Technologies (later acquired by Mastercard for $600M), then at Mastercard and Facebook. Co-founder Daniel Hillman came up through sales at the same analytics firm. Neither founder has an insurance background — Monasterio calls that outsider perspective one of the company's advantages.

## What this round signals

### What it means for the agent ecosystem

This round fills in a piece of the agent conversation that often gets skipped: in a genuinely high-stakes, heavily regulated industry, the division of labor where AI agents handle tasks and human experts sign off has already been validated by real purchasing decisions, not just proof-of-concept pilots. The funding will go toward expanding Kalepa's AI product line, entering new markets, and doubling headcount by 2027.

```diagram
title: How Kalepa routes underwriting tasks
desc: Every underwriting task is routed to an AI agent or a human expert based on complexity and risk, and either way the result stays traceable for audit.
caption: Simplified illustration — actual routing rules vary by customer and task type; details differ by deployment.
step: A new underwriting task enters the system
step: Risk is assessed to decide where the task goes
step: Low-risk tasks go straight to an AI agent, traceable for audit
step: High-risk tasks go to a human expert, traceable for audit
---
<svg viewBox="0 0 480 260">
  <rect class="dg-box" x="8" y="102" width="120" height="56" rx="6" data-step="1"/>
  <text class="dg-label" x="68" y="121" text-anchor="middle" dominant-baseline="central" data-step="1">Underwriting</text>
  <text class="dg-sub" x="68" y="141" text-anchor="middle" dominant-baseline="central" data-step="1">task comes in</text>

  <path class="dg-line" d="M128 130H168" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="168" y="102" width="120" height="56" rx="6" data-step="2"/>
  <text class="dg-label" x="228" y="121" text-anchor="middle" dominant-baseline="central" data-step="2">Risk check</text>
  <text class="dg-sub" x="228" y="141" text-anchor="middle" dominant-baseline="central" data-step="2">decides routing</text>

  <path class="dg-line" d="M288 130H308V46H328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M288 130H308V222H328" marker-end="url(#arrow)" data-step="4"/>

  <rect class="dg-box" x="328" y="18" width="140" height="56" rx="6" data-step="3"/>
  <text class="dg-label" x="398" y="37" text-anchor="middle" dominant-baseline="central" data-step="3">AI agent</text>
  <text class="dg-sub" x="398" y="57" text-anchor="middle" dominant-baseline="central" data-step="3">low risk, auditable</text>

  <rect class="dg-box" x="328" y="194" width="140" height="56" rx="6" data-step="4"/>
  <text class="dg-label" x="398" y="213" text-anchor="middle" dominant-baseline="central" data-step="4">Human expert</text>
  <text class="dg-sub" x="398" y="233" text-anchor="middle" dominant-baseline="central" data-step="4">high risk, auditable</text>
</svg>
```

### What the investors are betting on

Lead investor Updata Partners is a growth-equity firm that previously led CData's $140M Series B (2021) and Nerdio's $117M Series B (2022) — both companies that had already found product-market fit and were raising growth capital rather than cash to survive on. The logic with Kalepa looks similar: the company has been cash-flow positive for over two years, so this round isn't about staying alive, it's about accelerating on a model that's already working. IA Ventures and Inspired Capital, both from the 2021 Series A, came back for this round too, which says those early investors aren't disappointed with where five years of growth landed.

### Numbers worth watching

- A full five years between rounds ($14M Series A in 2021 to $75M Series B in 2026), with valuation jumping from an undisclosed figure to $470M — a "slow and steady" trajectory rather than the burn-fast-to-grow-fast pattern
- Revenue and customer count both tripled over the past year, platform throughput grew 4x, premium per underwriter rose 30–60%, quote time dropped 58%, combined ratio improved by 960 basis points, and quote-to-bind rate doubled — six metrics disclosed at once, which holds up better to scrutiny than the one-or-two-metric announcements most companies at this stage put out
- Competing insurance underwriting AI companies raised in the same window: Federato ($100M Series D led by Goldman Sachs Alternatives, November 2025, over $180M raised total), Sixfold ($30M Series B, January 2026), and Artificial Labs ($45M Series B). Kalepa's stated differentiation is task-by-task autonomy rather than Sixfold's pitch of fully automated, end-to-end underwriting

## Watchlist status

Kalepa is not currently on the watchlist. The watchlist's D-series covers customer support (D1), sales (D2), recruiting (D3), legal (D4), healthcare (D5), compliance/risk (D6), analytics (D7), e-commerce (D8), industrial (D9), enterprise search/RPA (D10), and automation (D11) — there's no category yet for vertical insurance AI. Recommend adding section D12 (insurance vertical AI) to track Kalepa alongside competitors Federato, Sixfold, and Artificial Labs, with a focus on how each splits work between AI and humans and how healthy their cash flow is, rather than just the headline funding numbers.

## Today's takeaway

Most agent companies pitch a story where more autonomy is always better and replacing humans faster is the win. Kalepa took five years to raise again and has been cash-flow positive for over two years — a record that argues for the opposite: in an industry with real regulatory accountability, investors are rewarding a company that deliberately doesn't chase full autonomy and instead lets AI do what it's good at while people do what they should be doing, over companies that burn cash chasing higher autonomy scores.

## References

- [Kalepa Raises $75 Million Series B at a $470 Million Valuation to Expand Professional Grade AI Across Insurance](https://kalepa.com/news-posts/kalepa-raises-75-million-series-b)
- [Five years after its Series A, insurance AI startup Kalepa raises $75M at $470M valuation](https://techfundingnews.com/kalepa-75m-series-b-updata-insurance-ai/)
- [AI-powered insurance startup Kalepa valued at $470 million](https://www.businessinsurance.com/ai-powered-insurance-startup-kalepa-valued-at-470-million/)
- [Kalepa raises $75m to scale AI across insurance](https://fintech.global/2026/11/06/kalepa-raises-75m-to-scale-ai-across-insurance/)
