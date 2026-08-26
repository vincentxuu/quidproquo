---
title: "Funding Brief｜Vals AI Series A $40M"
date: 2026-08-16
category: daily
tags: [ai-agent, funding, daily, vals-ai, model-evaluation]
lang: en
description: "Independent AI model evaluation startup Vals AI closes $40M Series A led by Andreessen Horowitz at a $400M valuation, betting on real-world task benchmarks over academic exams"
tldr: "Vals AI closes a $40M Series A led by Andreessen Horowitz at a $400M valuation. The round signals that VCs are starting to treat 'independent AI evaluation' as essential trust-layer infrastructure for the AI economy — not a nice-to-have leaderboard site."
series:
  name: "AI Agent Funding"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-funding-vals-ai)

## Funding Details

| Field | Value |
|---|---|
| Company | Vals AI (San Francisco, USA) |
| Round | Series A |
| Amount | $40M |
| Lead | Andreessen Horowitz (a16z) |
| Participants | 8VC, Pear VC, Bloomberg Beta (existing investors); HRT Ventures, Next Ladder Ventures (new investors) |
| Valuation | $400M (prior Seed valuation undisclosed) |
| Total Raised | $45M ($5M Seed + $40M Series A) |
| Founded | 2024 |
| Headcount | ~15 (LinkedIn; 67% YoY growth) |

## What the Company Does

Vals AI builds independent AI model evaluations — measuring whether an LLM can actually do the job using real-world professional tasks, not academic exam questions.

The core product recruits domain experts in law, finance, healthcare, and software engineering, converts their actual workflows into evaluation benchmarks, and pairs them with an automated scoring system that grades model outputs to professional standards. Private test sets are run a limited number of times to prevent contamination or targeted optimization, and the entire evaluation infrastructure can produce results within hours of gaining access to a new model. Benchmarks are periodically retired and rebuilt — in May this year, Vals replaced the saturated CorpFin corporate finance benchmark with a new Excel modeling test. Alongside this round, Vals announced three new products: Vals Smith, which lets customers build code benchmarks from their own GitHub repos; frontier risk benchmarks covering cybersecurity, mental health, and AI safety; and an expanded Vals Index 2.0 covering the broader economy.

Vals' evaluation results are currently cited in model cards by OpenAI, Anthropic, Google, Meta, and xAI. Enterprise customers use its scores to decide which models go into production. The company reports 8x revenue growth in 2025, doubled customer count, and 3x team growth over the past six months. Prior to this round, Vals had raised only a $5M Seed in 2024 from 8VC, Bloomberg Beta, and Pear VC.

## What This Round Signals

### Implications for the Agent Ecosystem

Models are shifting from "answering questions" to "doing work" — especially as Agents run unsupervised, long-horizon tasks spanning hours or even days. Choosing the wrong model no longer just costs extra tokens; it risks an entire automation pipeline going off the rails. At the same time, public academic benchmarks are breaking down: datasets saturate, leak into training corpora, or become explicit optimization targets. A model can look brilliant on leaderboards yet fall apart on real multi-step workflows. Vals is positioning itself between model providers and enterprise adoption decisions as the trusted referee layer both sides can rely on. The funding will go toward scaling Vals Smith, frontier risk benchmarks, and Vals Index 2.0.

### What Investors Are Betting On

a16z partner Jennifer Li's thesis is straightforward: every sufficiently large market eventually needs an independent scorekeeper — credit markets have Moody's and S&P, public markets have independent auditors, product manufacturing has UL certification. When sellers (model providers) hold more information than buyers (enterprises) and have strong incentives to present themselves favorably, credible third-party measurement is what makes the market function. a16z, which has previously backed infrastructure-scale bets like OpenAI, Anduril, Databricks, and Stripe, is using a relatively modest $40M check to bet that an "AI trust layer" will become inescapable industry infrastructure — much like credit ratings.

### Numbers Worth Watching

- Total funding jumped from $5M (2024 Seed, valuation undisclosed) to $45M (valuation $400M). The company hasn't disclosed explicit valuation multiples, but reaching a $400M valuation within two years of a seed round is a steep climb.
- The company reports 8x full-year 2025 revenue growth, doubled customer count, and 3x team growth in six months — all on roughly 15 employees, a textbook example of an ultra-lean team supporting a high valuation.
- In the same period, the "independent AI evaluation" space saw multiple approaches funded simultaneously: LMArena raised $150M at a $1.7B valuation (over 4x Vals' valuation) using crowdsourced user voting; Trismik raised £2.2M using psychometric methods; Datacurve raised a $15M Series A using private code datasets. This shows VCs are backing several competing "who referees AI" approaches at once rather than picking a single winner.

## Watchlist Status

Vals AI is not yet on the watchlist. Recommend adding to section B6 (Agent Observability / Evaluation). Key tracking points: independent AI model evaluation infrastructure, $40M Series A, a16z-led, $400M valuation.

## Takeaway

I used to think "AI evaluation / leaderboards" was an optional marketing tool. This round shows VCs are treating it as a standalone infrastructure category — and funding several mutually exclusive approaches simultaneously (crowdsourced voting, private expert benchmarks, psychometrics). The bet isn't on which methodology wins; it's on the certainty that "AI needs a universally trusted referee" as a need will persist.

## References

- [Investing in Vals](https://a16z.com/announcement/investing-in-vals/) — Andreessen Horowitz
- [a16z leads $40M Vals AI round at $400M valuation to test AI on real-world tasks](https://techfundingnews.com/a16z-leads-40m-vals-ai-round-at-400m-valuation-to-test-ai-on-real-world-tasks/) — Tech Funding News
- [Vals AI Raises $40 Million Series A At $400 Million Valuation As Revenue Grows 8x](https://pulse2.com/vals-ai-raises-40-million-series-a-at-400-million-valuation-as-revenue-grows-8x/) — Pulse2
