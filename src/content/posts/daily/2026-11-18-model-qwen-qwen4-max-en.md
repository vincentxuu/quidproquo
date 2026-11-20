---
title: "Model Card | Qwen4-Max"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, qwen, model-family-qwen]
lang: en
description: "Alibaba's Qwen team ships Qwen4-Max, the first model of the Qwen4 generation — a 2.4T-parameter model with only 71B active. It leads decisively on legal-agent benchmarks but still trails Claude Opus 5.5 on raw coding and vision, while pricing drops to $1.50/$4.50 per million tokens"
tldr: "Qwen4-Max: 2.4T total parameters with only 71B active (plus a 328B-parameter N-gram embedding), a 1M-token context window, and pricing of $1.50 input / $4.50 output per million tokens (25% below Qwen3.8-Max). No open weights — API-only via QwenCloud. It tops 4 of 16 official benchmarks (HLAB-Vals-1.1 legal-agent score of 21.3 versus Kimi K3.1's 11.7), but clearly trails Claude Opus 5.5 on raw coding (ProgramBench) and vision-heavy tasks"
series:
  name: "AI Model Tracker"
  order: 75
glossary:
  - term: "Qwen4"
    def: "The new model architecture generation Alibaba's Qwen team introduced in November 2026, led by Qwen4-Max; its core changes are QSA sparse attention, Gated Residuals, and an N-gram Embedding layer"
---

> :globe: [中文版](/posts/daily/2026-11-18-model-qwen-qwen4-max)

## Model Info

| Field | Value |
|---|---|
| Model ID | `qwen4-max` (QwenCloud API) |
| Vendor | Alibaba (Qwen team) |
| Parameters | 2.4T total backbone parameters, 71B active per token; plus a 328B-parameter N-gram Embedding layer at layer 2 that looks up local token patterns |
| Context Window | 1,000,000 tokens. QwenCloud's API docs list: non-thinking mode max input 991K / max output 131K; thinking mode max input 983K / max output 262K |
| Input Pricing (USD/1M tokens) | $1.50 (down from $2.00 for the previous Qwen3.8-Max, a 25% cut) |
| Output Pricing (USD/1M tokens) | $4.50 (down from $6.00 for Qwen3.8-Max, a 25% cut; implicit cached input also drops to $0.075 from $0.25) |
| Open Source | No (proprietary; available only through hosted endpoints — QwenCloud API, Token Plan, Qwen Studio, QwenWork, Qoder — with no open weights to self-host) |
| Release Date | 2026-11-16 (a Token Plan-only preview opened 2026-11-11; the general QwenCloud API launched 2026-11-16) |
| Official Announcement | [Qwen Blog: Qwen4-Max](https://qwen.ai/blog?id=qwen4-max) |
| Family | Qwen 4.x (first model of the Qwen4 generation, succeeding Qwen3.8-Max-0902) |

## Capability Highlights

- The 2.4T-parameter backbone activates only 71B parameters (roughly 3%) — 25% fewer active parameters than Qwen3.8-Max — yet Alibaba's own Work360 benchmark (26 top-level domains, 721 specialized fields) rose from 47.74 to 52.69
- Three simultaneous architecture changes: QSA (Qwen Sparse Attention, each layer paired with 3 Gated DeltaNet layers that compress history into fixed-size states), Gated Residuals (4 parallel residual branches with dynamic read/write gates), and a 328B-parameter N-gram Embedding. Alibaba reports no loss spikes across the entire 2.4T-scale pretraining run
- Uses noticeably fewer tokens for the same quality of output: roughly 24% fewer on Work360 at the Xhigh effort level and 35% fewer at High; roughly 48-49% fewer on Terminal-Bench 4.0. Average per-task cost on Work360 fell from $4.43 to $1.67, a 62% reduction
- Scores 21.3 on HLAB-Vals-1.1 (legal-agent tasks) — nearly double the runner-up Kimi K3.1's 11.7 — and ranks first on 4 of the 16 benchmarks in Alibaba's official comparison

## Benchmark Results

| Benchmark | Qwen4-Max | Previous Gen (Qwen3.8-Max-0902) | Best Competitor |
|---|---|---|---|
| DeepSWE v1.1 (agentic coding) | 75.7 | 69.3 | Kimi K3.1 Pro: 75.5 |
| Terminal-Bench 4.0 | 48.5 | 38.9 | Kimi K3.1 Pro: 67.2 |
| Humanity's Last Exam | 51.7 | 43.9 | Claude Opus 5.5: 59.8 |
| ProgramBench (raw coding) | 31.5 | 28.0 | Claude Opus 5.5: 65.0 |
| HLAB-Vals-1.1 (legal agent) | 21.3 | 15.4 | Kimi K3.1: 11.7 |

:warning: All 16 comparison points come from Alibaba's own published Qwen4-Max benchmark chart; none have been independently reproduced as of this writing. Notably, the chart lists Kimi K3.1 Pro's Terminal-Bench 4.0 score as 67.2, while Moonshot's own published figure for the same benchmark is 65.7 — a mismatch that's a reminder that scores borrowed from a rival's launch material don't always come from the same test run.

## Comparison with Previous Generation / Competitors

Compared with Qwen3.8-Max, Qwen4-Max's biggest gain isn't a single higher score — it's doing the same task with far fewer tokens and far lower cost. Terminal-Bench 4.0 token usage drops by nearly half, and the average Work360 task cost falls 62%, which means the same budget now buys considerably more agent iterations, not just a modest score bump.

Against competitors, Qwen4-Max's strengths cluster around specific vertical agent domains: it leads on legal (HLAB-Vals-1.1), biomedical (BioMysteryBench), and long-horizon agentic tasks (Agents' Last Exam v1.1), and narrowly edges out Kimi K3.1 Pro on agentic coding (DeepSWE v1.1) by 0.2 points. But raw coding ability (ProgramBench: 31.5, less than half Claude Opus 5.5's 65.0) and terminal/tool-use skill (Terminal-Bench 4.0: nearly 19 points behind Kimi K3.1 Pro) are clear weak spots — this reads less like a general-purpose coding model and more like a specialist agent model.

On pricing, Qwen4-Max continues Alibaba's low-cost strategy: input/output dropped from $2/$6 to $1.50/$4.50 (a 25% cut), and implicit cached input fell 70% to $0.075. That's 63-78% cheaper than Claude Opus 5.5's $4/$20, and 25-55% cheaper than Kimi K3.1 Pro's $2/$10 — even setting aside its weaker coding scores, it has a clear cost advantage as a cheap workhorse for high-volume agent tasks.

## Implications for Agent Development

Qwen4-Max puts its benchmark emphasis on vertical-domain agent tasks — legal, biomedical, long-horizon workflows — rather than general coding ability, which narrows where it actually fits:

- If you're building agents for legal, biomedical, or knowledge-intensive workflows: the margins on HLAB-Vals-1.1 and BioMysteryBench are wide enough (nearly 2x on the former) to make this a worthwhile candidate to test first
- If you're running high-volume batch agent pipelines where token cost matters: 24-49% fewer tokens for equivalent tasks, a 62% lower per-task cost, and pricing below both Opus 5.5 and Kimi K3.1 Pro make it a reasonable workhorse model for scaling up volume
- Not a fit: coding agents focused on raw code generation or terminal/tool operation — ProgramBench and Terminal-Bench 4.0 both trail Claude Opus 5.5 and Kimi K3.1 Pro by a clear margin, so choosing Qwen4-Max here means giving up real accuracy. Also not a fit if you need to self-host open weights — Qwen4-Max has none; it's QwenCloud API only

## Today's Takeaway

Alibaba's chosen comparison suite here — DeepSWE v1.1, Terminal-Bench 4.0, HLAB-Vals-1.1 — is a completely different yardstick from the SWE-bench Verified numbers most model cards report, so there's no way to directly line up Qwen4-Max against other models on a shared scale. The clearer signal is that the chart's Kimi K3.1 Pro Terminal-Bench 4.0 score (67.2) doesn't match what Moonshot itself published (65.7) — when citing a rival's numbers, you can't assume the benchmark name alone guarantees the same test version; you have to check back against the source's own release.

## References

- [Qwen official blog: Qwen4-Max — Your New Teammate Has Arrived](https://qwen.ai/blog?id=qwen4-max)
- [QwenCloud model page: Qwen4-Max specs and context/rate limits](https://www.qwencloud.com/models/qwen4-max)
- [MarkTechPost: Alibaba Releases Qwen4-Max: 2.4T MoE, 71B Active, 1M Context (2026-11-16, full comparison table)](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/)
- [Yotta Labs: Qwen4-Max Specs, Benchmarks, Pricing, and How to Access It](https://www.yottalabs.ai/post/qwen-4-max-specs-benchmarks-pricing-how-to-access)
- [VentureBeat: Alibaba's Qwen4-Max cuts AI task costs, but benchmarks show an uneven challenge to frontier rivals](https://venturebeat.com/technology/alibabas-qwen4-max-cuts-ai-task-costs-but-benchmarks-show-an-uneven-challenge-to-frontier-rivals)
