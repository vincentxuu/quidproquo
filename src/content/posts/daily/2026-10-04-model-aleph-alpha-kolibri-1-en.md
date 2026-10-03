---
title: "Model Card: Kolibri 1"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, model-release, daily, aleph-alpha, model-family-kolibri]
lang: en
description: "Aleph Alpha releases Kolibri, an open-weight sovereign model, on German Reunification Day — a 78B/3.46B-active MoE under Apache 2.0 that targets EU-regulated industries with a Merlin-Arthur abstention mechanism and native German-English training"
tldr: "Kolibri 1 (`Aleph-Alpha/Kolibri-1`, FP8; `Aleph-Alpha/Kolibri-1-BF16` is the full-precision release): open-sourced 2026-10-03, 78.1B total / 3.46B active parameters (MoE, 384 experts with 6 routed plus 1 shared), context window validated up to 1,048,576 tokens (recommended ≤262,144); fully open weights under Apache 2.0, no official API pricing, self-hosted by design; 96.9% on AIME 2025 (vs. 81.9% for the unreleased predecessor Kolibri Origin), 84.3% on GPQA Diamond (EN), 38.1% on τ³-bench Banking (far ahead of the best competitor's 15.5%); trained with the Merlin-Arthur protocol to abstain rather than hallucinate when context doesn't support an answer; trained in Germany, bilingual by design in German and English, aimed at public-sector, industrial, and aerospace deployments under the EU AI Act and GDPR"
series:
  name: "AI Model Tracker"
  order: 39
glossary:
  - term: "Kolibri"
    def: "A German-English bilingual MoE reasoning model family from Aleph Alpha, built around European 'sovereign AI' and deployment in regulated industries"
---

> 🌏 [中文版](/posts/daily/2026-10-04-model-aleph-alpha-kolibri-1)

## Model Details

| Item | Value |
|---|---|
| Model ID | `Aleph-Alpha/Kolibri-1` (FP8, default release) / `Aleph-Alpha/Kolibri-1-BF16` (full precision) |
| Vendor | Aleph Alpha (Germany) |
| Parameters | 78.1B total / 3.46B active (MoE, 50 layers, 384 experts with 6 routed plus 1 shared expert) |
| Context Window | 262,144 tokens native, validated up to 1,048,576 tokens (recommended ≤262,144 for latency-sensitive use) |
| Input Pricing (USD/1M tokens) | No official API — self-hosted (open weights) |
| Output Pricing (USD/1M tokens) | No official API — self-hosted (open weights) |
| Open Source | Yes (Apache 2.0) |
| Release Date | 2026-10-03 |
| Official Announcement | [Aleph Alpha Blog: Kolibri Has Landed](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/) |
| HuggingFace | [Aleph-Alpha/Kolibri-1](https://huggingface.co/Aleph-Alpha/Kolibri-1), [Aleph-Alpha/Kolibri-1-BF16](https://huggingface.co/Aleph-Alpha/Kolibri-1-BF16) |
| Family | Kolibri 1.x (first public release; predecessor Kolibri Origin was internal-only and never released) |

## Key Capabilities

- At 3.46B active parameters, Kolibri matches or beats models with up to four times its active-parameter count (such as Nemotron 3 Super 120B-A12B); Aleph Alpha frames this as sitting on the Pareto frontier of quality versus serving cost
- Scores 38.1% on τ³-bench Banking (multi-turn agentic banking support tasks) — well ahead of the second-best result, Nemotron 3 Super at 15.5%, and Qwen3.6-35B-A3B at 10.6%. It's the largest single-benchmark lead reported so far
- Trained with the Merlin-Arthur protocol to abstain when the answer isn't grounded in context, rather than fabricating one. Aleph Alpha calls this out as a tracked, trained capability rather than an incidental side effect
- Natively bilingual in German and English rather than an English model with translated German bolted on: 21.3% of pre-training tokens are organic German, with only 6% from translation. GPQA Diamond scores 81.3% in German versus 84.3% in English — a small gap between the two languages

## Benchmark Results

| Benchmark | Score | Predecessor (Kolibri Origin, unreleased) | Best Competitor |
|---|---|---|---|
| AIME 2025 | 96.9% | 81.9% | Nemotron 3 Super 91.7% |
| GPQA Diamond (EN) | 84.3% | 68.1% | Qwen3.6-35B-A3B 83.4% |
| τ³-bench (Banking) | 38.1% | 5.7% | Nemotron 3 Super 15.5% |
| BrowseComp | 29.4% | 4.4% | Nemotron 3 Super 29.1% |
| SWE-Bench Verified | 69.2% | Not tested | Qwen3.6-35B-A3B 73.8% |

⚠️ All figures are Aleph Alpha's own self-reported benchmarks, with no independent third-party reproduction yet. SWE-Bench Verified is one of the few benchmarks where Kolibri trails — coding wasn't the focus of this training run.

## Versus Predecessor / Competitors

Compared to the internal predecessor Kolibri Origin (30.6B total / 3.27B active, never publicly released), Kolibri doubled total parameters (30B → 78B) in three months, extended context from a native 64K to a native 256K (validated to 1M), and grew pre-training tokens from 7.5T to 20T. AIME 2025 jumped from 81.9% to 96.9%, a 15-point gain. Aleph Alpha notes that active parameters barely moved (3.27B → 3.46B); the gains came mainly from data volume, architecture changes (attention switched to sliding window plus full attention every 5th layer, expert count grew from 128 to 384), and faster training-pipeline iteration.

Against open-weight models of similar size, Kolibri's differentiation isn't about topping average benchmark scores — it's two deliberate bets: multi-turn agentic tasks in finance and customer support (τ³-bench banking at 38.1%, more than double the next-best score), and grounded abstention over hallucination. The trade-off shows up in coding benchmarks (SWE-Bench Verified, LiveCodeBench v6), where Kolibri trails Qwen3.6-35B-A3B — a sign that training resources tilted toward agentic and grounding capability rather than general-purpose coding.

On pricing, Kolibri skips the API-pricing race entirely: fully open weights under Apache 2.0, no official hosted API. Aleph Alpha's business model sells "sovereignty" instead — customers deploy it themselves, keeping data inside their own infrastructure. That's a different competitive axis than the API price wars most closed models are fighting.

## What It Means for Agent Development

Kolibri positions itself as an agent foundation for EU-regulated industries, not another general-purpose chat model.

- If you're building agents where data can't leave the EU or Germany (public sector, industrial, aerospace, finance, or other EU AI Act / GDPR-regulated use cases): Kolibri natively supports on-premises deployment, keeps inference cost manageable at 3.46B active parameters, and Aleph Alpha emphasizes that the entire training pipeline — data, pre-training, post-training, evaluation — runs inside Germany and Europe. Supply-chain transparency is itself the pitch
- If you're building RAG or any agent where you'd rather it say "I don't know" than make something up: the Merlin-Arthur-trained abstention behavior, combined with the large τ³-bench banking lead, suggests real training investment in admitting when context doesn't support an answer. Worth A/B testing against your current stack in high-stakes support or finance scenarios
- Not a fit: pure coding agents (it trails Qwen3.6-35B-A3B on SWE-Bench and LiveCodeBench), or multilingual use cases beyond German and English — Aleph Alpha is explicit that this is a deliberate "depth over breadth" choice, supporting only two languages
- If you're evaluating a switch to a self-hosted model: full-precision weights need roughly 156GB of memory (4×A100 80GB or equivalent) — not a low bar — but the throughput and latency advantage from 3.46B active parameters may pay off over a dense model with fewer total parameters but more active ones, in long-run self-hosting cost

## Today's Takeaway

Most model cards compete on who scores higher. Kolibri shifts the axis to who owns the training infrastructure and data sovereignty — training in Germany, EU regulatory compliance, and a transparent supply chain are the pitch, not a disclaimer buried at the bottom. It's a reminder that differentiation among open-weight models is starting to move from "where do you rank on the leaderboard" to "can you prove where this model actually came from."

## References

- [Aleph Alpha Blog: Kolibri Has Landed: A Sovereign Open-Weight Model](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/)
- [HuggingFace: Aleph-Alpha/Kolibri-1](https://huggingface.co/Aleph-Alpha/Kolibri-1)
- [HuggingFace: Aleph-Alpha/Kolibri-1-BF16 (full model card and evaluation tables)](https://huggingface.co/Aleph-Alpha/Kolibri-1-BF16)
- [Aleph Alpha Kolibri technical report (PDF)](https://aleph-alpha.com/downloads/tech-report.pdf)
- [Aleph Alpha: Kolibri product page](https://aleph-alpha.com/en/kolibri/)
