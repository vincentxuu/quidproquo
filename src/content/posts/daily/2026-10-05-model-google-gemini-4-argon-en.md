---
title: "Model Card: Gemini 4 Argon"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google unveils its new flagship Gemini 4 Argon — a new SOTA on DeepSWE v1.1 (77.9%) and an industry-leading 1M output-token limit, but it's locked to trusted security partners and doesn't even have a public API model ID yet"
tldr: "Gemini 4 Argon: announced 2026-09-30. Google states only the output limit — 1M tokens (up from 64K) — and has not published an input context window (third-party reports of 2M tokens can't be traced to a Google source); introductory pricing is $2.00 input / $10.00 output per 1M tokens, doubling to $4.00 / $20.00 once the promo ends; it sets a new SOTA on DeepSWE v1.1 at 77.9% (vs. 74.2% for Opus 5.5 and 74.1% for GPT-6 Astra), but only scores 55% on FrontierSWE v2, trailing GPT-6 Astra's 65.5%; access is currently limited to trusted security partners through the Fairwind Program — developers, enterprises, and consumers don't have it yet"
series:
  name: "AI Model Tracker"
  order: 40
glossary:
  - term: "Gemini"
    def: "Google DeepMind's large language model family; Argon is its newest flagship branch"
---

> 🌏 [中文版](/posts/daily/2026-10-05-model-google-gemini-4-argon)

## Model Details

| Item | Value |
|---|---|
| Model ID | Not published (API not yet open — Argon appears in neither the Gemini API pricing page nor the changelog) |
| Vendor | Google DeepMind |
| Parameters | Not disclosed |
| Context Window | Google states only the output limit — 1,000,000 tokens (up from 64,000). The input context window is not disclosed; multiple outlets (NeuralTrust, The Rundown) checked and found the widely repeated "2M tokens" figure can't be traced to any Google source |
| Input Pricing (USD/1M tokens) | $2.00 (introductory, no stated expiry), rising to $4.00 after the promo period |
| Output Pricing (USD/1M tokens) | $10.00 (introductory, no stated expiry), rising to $20.00 after the promo period |
| Open Source | No (closed, Google-proprietary) |
| Release Date | 2026-09-30 |
| Official Announcement | [Google Blog: Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon) |
| HuggingFace | Not applicable (closed model) |
| Family | Gemini 4.x |

## Key Capabilities

- Scores 77.9% on DeepSWE v1.1 (long-horizon, real-world software engineering tasks), a new SOTA ahead of Claude Opus 5.5 (74.2%) and GPT-6 Astra (74.1%)
- Output token limit jumps from the predecessor's 64,000 to 1,000,000 — Google says this lets the model sustain long reasoning chains in a single pass instead of restarting across chained calls
- Ranks #1 on Zapier's AutomationBench (end-to-end business-process execution) at 51.3%, and hits 91.7% on LVBench (long-video understanding) — also the current best score
- Ties GPT-6 Astra for first on CWE-bench v1 (real-world vulnerability remediation) at 68%; Google says it will give trusted security partners a version with cyber guardrails removed, for full defensive capability

## Benchmark Results

| Benchmark | Score | Best Competitor |
|---|---|---|
| DeepSWE v1.1 | 77.9% | Claude Opus 5.5 74.2%, GPT-6 Astra 74.1% |
| FrontierSWE v2 | 55% | GPT-6 Astra 65.5%, Claude Opus 5.5 62.3% |
| CWE-bench v1 (vulnerability remediation) | 68% (tied for first) | GPT-6 Astra 68%, Claude Opus 5.5 67% |
| AutomationBench (Zapier) | 51.3% (first) | Runner-up score not published |
| LVBench (long-video understanding) | 91.7% (SOTA) | Runner-up score not published |
| Artificial Analysis Intelligence Index | 53 | GPT-6.1 Sol 54, Claude Opus 5.5 58 |

⚠️ Except for Artificial Analysis, all figures are Google's own self-reported benchmarks with no independent third-party reproduction yet. DeepSWE v1.1 and CWE-bench scores come from charts in the official blog post; the FrontierSWE v2 figure comes from third-party aggregation (AIFire). Argon doesn't lead everywhere — it trails on both FrontierSWE v2 and the Artificial Analysis Intelligence Index, which suggests targeted strength in specific areas rather than a clean sweep.

## Versus Predecessor / Competitors

Against its own predecessor, Argon's biggest leap is a 15.6x jump in output capacity (64K → 1M tokens), letting tasks that need long reasoning chains — extended coding runs, multi-turn legal or financial research — finish in a single call instead of being truncated and stitched back together. But the announcement never mentions an input context window at all, which runs against the usual industry pattern of leading with that number — and multiple independent write-ups (NeuralTrust, The Rundown, Vallettasoftware) all flagged "Google didn't disclose the input limit" as a headline detail.

Against competitors, Argon establishes a lead in three areas — long-horizon software engineering (DeepSWE v1.1), business-process automation (AutomationBench), and long-video understanding (LVBench) — but trails GPT-6 Astra by 10.5 points on FrontierSWE v2, a different coding benchmark, and sits behind Opus 5.5 on Artificial Analysis's composite intelligence score. That points to Argon's strength being concentrated in long-horizon, multi-step, sustained-output tasks rather than a universal upgrade across every coding benchmark.

On pricing, the $2/$10 introductory rate lines up exactly with Sonnet 5.5 and GPT-6 Sol, while the post-promo $4/$20 rate lands in Opus 5.5's tier — a classic "match the mid-tier price to drive adoption, then step up to flagship pricing" play. Google hasn't published an expiry date for the promo (see our [Oct 4 pricing tracker](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en)), so anyone modeling long-term cost shouldn't plan around the introductory rate alone.

## What It Means for Agent Development

Argon's biggest constraint right now isn't capability — it's access. It's limited to trusted security partners in the Fairwind Program; the rest of us can't even see a public API model ID.

- If you're building agents that need long reasoning chains with large single-call output (long-horizon code migrations, full audit reports, multi-file patches): a 1M-token output limit is currently the largest in the industry and worth prioritizing once the API opens — but confirm the actual input context window first rather than designing around the unconfirmed "2M" figure circulating online
- If you're building defensive security agents (vulnerability discovery, automated remediation): tying for first on CWE-bench v1, plus the planned guardrail-free variant, signals Google is positioning this line as a dedicated tool for security teams — but general developers won't have access any time soon
- Not a fit: putting Argon into production today. Access is still restricted to trusted testers with no stated timeline for general API availability, and the FrontierSWE v2 gap shows it isn't the strongest option for every coding scenario
- If you're comparing flagship models across Gemini, Claude, and GPT: Argon currently reads more like a specialist model for specific long-horizon tasks than a drop-in replacement for Sonnet 5.5 or GPT-6 Astra in everyday use

## Today's Takeaway

This is an unusual release order: Google published pricing before publishing access. Most vendors open testing first and announce pricing later; Argon did the opposite — the pricing is already sitting in a footnote of the blog post, while the model ID, input context window, and access timeline are all still missing. It's a reminder to separate "numbers the vendor actually confirmed" from "rumors the vendor hasn't denied" when reading a model announcement — the 1M output-token figure is something Google wrote themselves, but the "2M" input-context rumor is outside reporting that shouldn't get the same confidence level in a model card.

## References

- [Google Blog: Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [NeuralTrust: Gemini 4 Argon: Benchmarks, Pricing & Security (2026)](https://neuraltrust.ai/blog/gemini-4-argon)
- [AIFire: Gemini 4 Argon Benchmarks vs GPT And Claude Performance](https://www.aifire.co/p/gemini-4-argon-benchmarks-vs-gpt-and-claude-performance)
- [quidproquo: Pricing Tracker — Gemini 4 Argon's intro pricing](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en)
