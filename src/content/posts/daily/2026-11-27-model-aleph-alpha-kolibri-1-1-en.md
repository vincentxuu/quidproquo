---
title: "Model Card: Kolibri 1.1"
date: 2026-11-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, aleph-alpha, model-family-kolibri]
lang: en
description: "Aleph Alpha releases Kolibri 1.1 — a 75B-total/3.44B-active sparse-attention MoE that decodes 14x faster than its predecessor at 1M-token context, and pushes AgentDojo prompt-injection resistance to 99.1%"
tldr: "Kolibri 1.1 (Aleph-Alpha/Kolibri-1.1, released 2026-11-23, Apache 2.0): a 75B-total/3.44B-active MoE with context up to 1,048,576 tokens; SWE-bench Verified 70.4% (up from 64.0% on Kolibri 1.0); AgentDojo prompt-injection resistance 99.1% (up from just 30.3%). A new sparse-attention architecture decodes 14x faster at 1M-token context and cuts GPU time per task to under a third. Built for EU data sovereignty and regulatory-compliant deployment."
series:
  name: "AI Model Tracker"
  order: 83
glossary:
  - term: "Kolibri"
    def: "Aleph Alpha's German/English bilingual open-weight MoE model family, built around data sovereignty and EU regulatory compliance (the EU AI Act, GDPR)"
---

> :globe: [中文版](/posts/daily/2026-11-27-model-aleph-alpha-kolibri-1-1)

## Model Info

| Field | Value |
|---|---|
| Model ID | `Aleph-Alpha/Kolibri-1.1` (official GGUF quantization also available as `Aleph-Alpha/Kolibri-1.1-GGUF`) |
| Vendor | Aleph Alpha (Heidelberg, Germany; developed by Aleph Alpha Research GmbH) |
| Parameters | 75B total (75,128,393,984), 3.44B active per token (3,439,874,304), Mixture-of-Experts |
| Context Window | 262,144 tokens native, extendable to 1,048,576 tokens (Aleph Alpha recommends staying within 262,144 for complex tasks) |
| Input Pricing (USD/1M tokens) | Not publicly priced (open weights can be self-hosted; the official Inference API is sold on a custom contract — contact sales) |
| Output Pricing (USD/1M tokens) | Not publicly priced (same as above) |
| Open Source | Yes (Apache License 2.0) |
| Release Date | 2026-11-23 |
| Official Announcement | [Aleph Alpha Blog: Kolibri 1.1: More Efficient. More Capable.](https://aleph-alpha.com/en/blog/kolibri-1-1) |
| HuggingFace | [Aleph-Alpha/Kolibri-1.1](https://huggingface.co/Aleph-Alpha/Kolibri-1.1) |
| Family | Kolibri 1.x (predecessor Kolibri 1.0 launched around early October 2026; 1.1 followed seven weeks later) |

## Highlights

- **Agentic coding up across the board**: SWE-bench Verified rises from 64.0% to 70.4%, Terminal-Bench 2.1 from 25.8% to 35.6%
- **New sparse-attention architecture slashes long-context cost**: decode throughput at 1M-token context is up to 14x faster than the predecessor, and GPU time per 1,000 tasks drops from 0.718 to 0.208 GPU-hours (about 3.4x)
- **Prompt-injection resistance jumps sharply**: AgentDojo attack-resistance rate climbs from just 30.3% on Kolibri 1.0 to 99.1% — the highest of every model Aleph Alpha compared against, including the larger GPT-OSS 120B and Mistral Small 4
- **More efficient reasoning**: average output tokens per task drop 41%; at low reasoning effort, output volume falls to roughly 1/3.6 of the predecessor's, directly cutting latency and cost

## Benchmark Results

| Benchmark | Score | Predecessor (Kolibri 1.0) | Best Competitor (GPT-OSS 120B) |
|---|---|---|---|
| AIME 2026 | 95.8 | 95.6 | 92.9 |
| SWE-bench Verified | 70.4% | 64.0% | 57.8% |
| BrowseComp-Plus (agentic retrieval) | 43.9% | 33.1% | 33.1% (tied) |
| AgentDojo prompt-injection resistance | 99.1% | 30.3% | 67.5% |
| GPQA Diamond | 87.1% | 84.7% | 78.6% |

All figures are Aleph Alpha's own in-house evaluation results, comparing within the same weight class (3–4B active parameters) against larger models; GPT-OSS 120B (5B active parameters) is one of the larger models Aleph Alpha explicitly names as being outperformed. No independent party has reproduced this table yet.

```diagram
title: Kolibri 1.1 vs. predecessor Kolibri 1.0 on four key metrics
desc: Kolibri 1.1 outperforms predecessor Kolibri 1.0 across prompt-injection resistance, agentic retrieval, terminal tasks, and code repair, with the largest gain in AgentDojo prompt-injection resistance.
caption: Figures from Aleph Alpha's official blog post and model card. x-coordinate = 200 + score(%) × 4, so 0% maps to x=200 and 100% to x=600. Rows are sorted by the size of the 1.1-over-1.0 improvement, largest first.
---
<svg viewBox="0 0 680 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">AgentDojo</text>
  <line class="dg-axis" x1="307" y1="90" x2="596" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="307" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="596" cy="90" r="6"/>
  <text class="dg-sub" x="295" y="90" text-anchor="end" dominant-baseline="central">30.3%</text>
  <text class="dg-label dg-text--accent" x="608" y="90" text-anchor="start" dominant-baseline="central">99.1%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">BrowseComp-Plus</text>
  <line class="dg-axis" x1="332" y1="170" x2="376" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="332" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="376" cy="170" r="6"/>
  <text class="dg-sub" x="320" y="170" text-anchor="end" dominant-baseline="central">33.1%</text>
  <text class="dg-label dg-text--accent" x="388" y="170" text-anchor="start" dominant-baseline="central">43.9%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">Terminal-Bench 2.1</text>
  <line class="dg-axis" x1="303" y1="250" x2="342" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="303" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="342" cy="250" r="6"/>
  <text class="dg-sub" x="291" y="250" text-anchor="end" dominant-baseline="central">25.8%</text>
  <text class="dg-label dg-text--accent" x="354" y="250" text-anchor="start" dominant-baseline="central">35.6%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">SWE-bench Verified</text>
  <line class="dg-axis" x1="456" y1="330" x2="482" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="456" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="482" cy="330" r="6"/>
  <text class="dg-sub" x="444" y="330" text-anchor="end" dominant-baseline="central">64.0%</text>
  <text class="dg-label dg-text--accent" x="494" y="330" text-anchor="start" dominant-baseline="central">70.4%</text>

  <line class="dg-rule" x1="20" y1="356" x2="660" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">Legend</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">Kolibri 1.0</text>
  <circle class="dg-point dg-c-accent" cx="300" cy="382" r="6"/>
  <text class="dg-small" x="316" y="382" dominant-baseline="central">Kolibri 1.1</text>
</svg>
```

## Comparison with the Predecessor and Competitors

Against Kolibri 1.0, the biggest gains are in agentic retrieval and safety. BrowseComp-Plus rises from 33.1% to 43.9%, MuSiQue from 78.3% to 86.4%, and the German Agentic Wiki QA benchmark from 63.9% to 73.7% — a clear accuracy improvement on agent tasks that involve long documents and multi-turn search. Safety is another focus: AgentDojo attack resistance jumps from 30.3% to 99.1%, while the CyberSecEval 2 attack success rate drops from 14.7% to 6.8%.

Against competitors, within the same 3–4B active-parameter weight class Kolibri 1.1 posts the highest overall score (72.2% English, 74.2% German), beating even the larger GPT-OSS 120B (5–6B active, 63.4%), Mistral Small 4 (56.6%), and Nemotron 3 Super (12–18B active, 64.0%). It still trails same-class rivals on a few individual metrics, though — on tool-calling benchmark BFCL v4, Kolibri 1.1's 62.7% falls short of Qwen3.6 35B-A3B's 67.1%.

On pricing, Aleph Alpha skips public API rate cards and instead reports efficiency in GPU time: just 0.208 GPU-hours per 1,000 tasks (on 8×B200), down from 0.718 GPU-hours for Kolibri 1.0 — a 3.4x reduction. For enterprises choosing to self-host, that is a number that translates directly into lower infrastructure cost, not a list-price discount.

## Implications for Agent Development

The sparse-attention architecture is the change with the most direct impact on engineering decisions this time: each token now attends only to its 2,048 most relevant tokens plus the 128 most recent ones, so inference at long context no longer has to brute-force full attention — this is also the core reason decode throughput can be 14x faster at 1M-token context.

- If you're building agent systems that need data sovereignty and regulatory compliance (the EU AI Act, GDPR): Kolibri 1.1 is trained and served entirely within Europe, and it tops its weight class on the German public-sector customer-proxy suite at 86.0% — a good fit for government agencies, manufacturing, and other scenarios that require localized deployment
- If you're building agentic workflows over long documents or large codebases: the sparse-attention architecture cuts long-context inference latency substantially, and the smallest quantized build runs on 24GB of VRAM — well suited to stuffing an entire regulatory document or codebase into a single context window
- Not a fit: scenarios that demand top-tier tool-calling precision (Kolibri 1.1 trails same-class rivals on BFCL) or very broad knowledge coverage (just 10.5% on Humanity's Last Exam) — larger models like GLM-5.3 Flash and Qwen3.8 Flash Next perform noticeably better on those tasks

## Today's Takeaway

It's easy to treat "sovereignty- or compliance-oriented regional model" as shorthand for "performance trade-off" — as if meeting regulatory requirements inherently costs competitiveness. Kolibri 1.1 argues otherwise: with sparse attention and more efficient reasoning, a 3B-active-parameter model can simultaneously beat larger open-weight models on safety (99.1% on AgentDojo) and long-context throughput (14x). Compliance and performance don't have to trade off against each other — the right engineering choices can deliver both.

## References

- [Aleph Alpha Blog: Kolibri 1.1: More Efficient. More Capable. (official announcement with full benchmark tables)](https://aleph-alpha.com/en/blog/kolibri-1-1)
- [HuggingFace: Aleph-Alpha/Kolibri-1.1 (model card with parameter specs and license)](https://huggingface.co/Aleph-Alpha/Kolibri-1.1)
- [HuggingFace: Aleph-Alpha/Kolibri-1.1-GGUF (official quantized build with local deployment instructions)](https://huggingface.co/Aleph-Alpha/Kolibri-1.1-GGUF)
- [Aleph Alpha Blog: Kolibri has landed — a sovereign open-weight model (Kolibri 1.0 launch post)](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/)
