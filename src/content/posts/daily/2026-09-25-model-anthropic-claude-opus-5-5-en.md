---
title: "Model Card: Claude Opus 5.5"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: en
description: "Anthropic ships Claude Opus 5.5, matching Claude Fable 5.1 on most work while cutting cost 40% versus Opus 5 — Terminal-Bench 4.0 hits 66.4%, but thinking mode can no longer be disabled"
tldr: "Claude Opus 5.5 shipped 2026-09-22, model ID `claude-opus-5-5`; 1,000,000-token context window (128K output cap); API pricing is $4.00 input / $20.00 output per 1M tokens (down from Opus 5's $5/$25), with cache reads cut 60% to $0.20; Terminal-Bench 4.0 jumps from Opus 5's 52.3% to 66.4%, and GDPval-AA v2.1 leads at 1846 Elo versus Fable 5.1's 1735 and GPT-6 Astra's 1542; Anthropic's own numbers show it still trailing GPT-6 Astra on AutomationBench and Terminal-Bench-Science; because its biology and cybersecurity capabilities now match Claude Mythos 5.1, it ships with Fable-5.1-level safeguards, and on the API side thinking mode can no longer be turned off while forced tool use now returns an error instead of failing silently"
series:
  name: "AI Model Tracker"
  order: 30
glossary:
  - term: "Claude"
    def: "Anthropic's large language model family; Opus is its highest-capability tier"
  - term: "Terminal-Bench"
    def: "A benchmark measuring how well a model can autonomously execute multi-step commands, debug, and complete tasks in a real terminal environment — widely used as an agentic-coding indicator"
---

> 🌏 [中文版](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)

## Model Info

| Field | Value |
|---|---|
| Model ID | `claude-opus-5-5` |
| Vendor | Anthropic |
| Parameters | Undisclosed |
| Context window | 1,000,000 tokens (128,000-token output cap; the Batch API can reach 300K output with the `output-300k-2026-03-24` beta header) |
| Input price (USD/1M tokens) | $4.00 |
| Output price (USD/1M tokens) | $20.00 |
| Open source | No (API-only via Claude Platform, AWS, Google Cloud, and Azure; weights are not released) |
| Release date | 2026-09-22 |
| Official announcement | [Anthropic: Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5) |
| Family | Claude 5.5 (first model released in the family; Sonnet 5.5 and Haiku 5.5 are promised "in the coming weeks") |

## Highlights

- Terminal-Bench 4.0 (agentic coding, xhigh effort) jumps from Opus 5's 52.3% to 66.4% (+14.1pp), one of the largest self-reported gains in this release
- Cache-read pricing drops 60% to $0.20 per 1M tokens — Anthropic says cache reads make up most agentic and coding costs — combined with output generation over 30% faster, netting a claimed 40% cost reduction on typical workloads
- One early tester audited and fixed a 200,000-line codebase in under three hours, versus more than 20 hours and 2.5x the tokens for Opus 5
- Anthropic's strongest alignment scores to date: on a new containment test, Opus 5.5 attempted to circumvent boundaries about 85% less often than Opus 5 or Claude Mythos 5.1

## Benchmark Results

| Benchmark | Opus 5.5 | Prior (Opus 5) | Best competitor |
|---|---|---|---|
| Terminal-Bench 4.0 | 66.4% | 52.3% | GPT-6 Astra 57.9% |
| FrontierCode v1.1 (Main) | 54.4% | 48.0% | GPT-6 Astra 53.3% |
| CursorBench 4.0 | 57.8% | 46.6% | GPT-5.6 Sol (Anthropic reports an 11pp lead, no exact figure given) |
| GDPval-AA v2.1 (Elo, independently run by Artificial Analysis) | 1846 | 1708 | GPT-6 Astra 1542 |
| Humanity's Last Exam (with tools) | 67.7% | 63.6% | GPT-6 Astra 57.2% |
| Terminal-Bench-Science 0.1 | 58.7% | 29.0% | GPT-6 Astra 64.6% (top score) |
| AutomationBench (run by Zapier) | 40.0% | 26.9% | GPT-6 Astra 41.4% (top score) |

⚠️ Except for GDPval-AA v2.1, which Artificial Analysis ran independently, all figures above are vendor self-reported at each model's highest effort setting. Anthropic itself notes its Terminal-Bench 4.0 and Terminal-Bench-Science 0.1 reproductions fall within the public leaderboards' noise (±1.6–5pt standard error). GPT-6 Astra still leads on AutomationBench and Terminal-Bench-Science — this is not a clean sweep.

## Versus Prior Model and Competitors

Compared with Opus 5, the biggest gains are in agentic coding and long-horizon tasks: Terminal-Bench 4.0 is up 14.1pp, and Anthropic emphasizes doing more work with fewer tokens — in one case a 680,000-line code migration that took an engineering team weeks was finished in under a day. Pricing dropped in step: input and output are each down 20%, cache reads down 60%, netting a claimed 40% reduction on typical workloads.

Against competitors, Opus 5.5 leads GPT-6 Astra on agentic coding (Terminal-Bench 4.0, FrontierCode) and knowledge work (GDPval-AA v2.1, HLE), and does so more cheaply — Anthropic says it matches GPT-6 Astra's top FrontierCode score at roughly a fifth of the per-task cost. But GPT-6 Astra still posts the top score on AutomationBench and Terminal-Bench-Science, both of which test scientific and cross-system automation rather than pure coding — suggesting Opus 5.5's edge is concentrated in coding and knowledge work, not a universal win. Against its sibling Claude Fable 5.1, Anthropic is explicit that the two are "comparable on most work," and that in its own use the gap is narrower than the benchmark table implies.

## What This Means for Agent Development

The biggest change here isn't the scores — it's the cost structure. Cache reads, which dominate spend in long-running, multi-turn agentic workflows, are down 60%. Anthropic also frames "fewer tokens per task" as a core metric, not just a lower unit price.

- If you're building a long-running autonomous coding agent (large-scale migrations, audits): the double-digit gains on Terminal-Bench 4.0 and FrontierCode, plus cheaper cache reads, make this one of the best price-performance options right now — worth testing first
- If you're building agents for scientific research or cross-system automation (the kind AutomationBench and Terminal-Bench-Science cover): Anthropic's own numbers show it trailing GPT-6 Astra here, so run your own task set before migrating based on coding benchmarks alone
- Major compatibility risk: on the API, thinking mode **can no longer be disabled**, and forced tool use now returns an error instead of being handled silently — existing integrations may break on a naive upgrade. Check Anthropic's Opus 5 → 5.5 breaking-changes list before migrating
- For agents touching security or biology research: because its capabilities now match Claude Mythos 5.1, most cybersecurity tasks get rerouted to Opus 4.8, and biology work requires applying to the Life Sciences Verification Program — budget for that fallback path in capacity planning

## Today's Takeaway

In the Opus 5.5 announcement, Anthropic admits that "benchmark margins have become a less reliable guide" — and it honestly lists the benchmarks where GPT-6 Astra still leads (AutomationBench, Terminal-Bench-Science), rather than only showcasing wins. That's a useful signal for reading any model-launch post: the more a vendor's numbers look like a clean sweep, the more worth checking whether they've disclosed where they didn't win. A launch post willing to admit losses is usually the more trustworthy one.

## References

- [Anthropic: Introducing Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)
- [Anthropic Newsroom](https://www.anthropic.com/news)
- [Anthropic: Claude Opus 5.5 System Card (PDF)](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf)
- [Claude Platform Docs: Claude Opus 5.5 overview](https://platform.claude.com/docs/en/models/opus-5-5/overview)
- [Amazon Bedrock: Claude Opus 5.5 model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-opus-5-5.html)
- [MarkTechPost: Anthropic Releases Claude Opus 5.5](https://www.marktechpost.com/2026/09/22/anthropic-claude-opus-5-5-release/)
