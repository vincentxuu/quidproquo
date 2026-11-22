---
title: "Model Card: Inkling 2 Mini"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, thinking-machines, model-family-inkling]
lang: en
description: "Thinking Machines Lab released Inkling 2 Mini, the first publicly released looped transformer. 26B weights, 5.4B effective active compute, it beats five-times-larger Qwen3.8-27B on agentic coding and fits on a 20GB laptop."
tldr: "Inkling 2 Mini (thinkingmachines/Inkling-2-Mini): released 2026-11-20 by Thinking Machines Lab under Apache 2.0. 26.4B total params, 3.4B native active; the middle 12 layers loop 3 times, giving 5.4B effective active compute per token. 1M context. Official Tinker pricing: $0.15 input / $0.50 output / $0.015 cache hit per 1M tokens. It beats Qwen3.8-27B on DeepSWE v1.1 (48.2% vs 42.2%) and SWE-bench Pro v2 Hard (77.9% vs 73.8%). Thinking Machines also published the first public study of how looping affects chain-of-thought monitorability, concluding that looping itself did not make the model meaningfully harder to monitor at this scale."
series:
  name: "AI Model Tracker"
  order: 79
glossary:
  - term: "looped transformer"
    def: "An architecture that reruns the same weight layers multiple times to add serial computation depth without adding stored parameters, unlike a standard transformer where each layer runs once"
---

> :globe: [中文版](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini)

## Model Info

| Field | Value |
|---|---|
| Model ID | `thinkingmachines/Inkling-2-Mini` |
| Vendor | Thinking Machines Lab |
| Parameters | 26.4B total, 3.4B native active; the middle 12 layers loop 3 times, giving 5.4B effective active parameters (24 stored layers produce 48 layer applications per token) |
| Context Window | 1,000,000 tokens |
| Input price (USD/1M tokens) | $0.15 (official Tinker platform pricing) |
| Output price (USD/1M tokens) | $0.50 (official Tinker platform pricing; cache hit $0.015) |
| Open source | Yes (Apache License 2.0) |
| Release date | 2026-11-20 |
| Official announcement | [Introducing Inkling 2 Mini (Thinking Machines Lab)](https://thinkingmachines.ai/news/inkling-2-mini/) |
| Hugging Face | [thinkingmachines/Inkling-2-Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) |
| Family | Inkling (a new looped-architecture branch, trained alongside the existing Inkling 2 Small on the same pipeline) |

## Key Capabilities

- **The first publicly released looped transformer**: two of the 24 layers' middle blocks (12 layers) run three times each, for 48 layer applications from 24 stored layers — the model "thinks more without writing more"
- **Beats a five-times-larger open competitor on agentic coding**: DeepSWE v1.1 48.2% (vs. Qwen3.8-27B's 42.2%) and SWE-bench Pro v2 Hard 77.9% (vs. 73.8%), while Inkling 2 Mini's effective active parameter count is only 5.4B — about a fifth of Qwen3.8-27B's
- **Runs on a 20GB laptop**: weights are deployed at the same precision they were trained in (20 layers NVFP4, 4 layers MXFP8) with no quantization conversion loss, so a 32GB-RAM MacBook, Mac mini, or a single NVIDIA DGX Spark can run it locally
- **Leads on compute efficiency per watt**: Stanford's Hazy Research Lab measured 0.703 on their "intelligence per joule" metric running on a DGX Spark, versus 0.430 for Qwen3.6-35B-A3B and 0.159 for Gemma-4-26B-A4B
- **Published the first public study of how looping affects CoT monitorability**: alongside Inkling 2 Mini, Thinking Machines released a variable-loop research model, TML-d24-varloop-research, and found that increasing loop count did not make the model noticeably easier to use for undetected side tasks in agentic settings

## Benchmark Performance

```diagram
title: Inkling 2 Mini beats Qwen3.8-27B on three agentic coding benchmarks with a fifth of the effective parameters
desc: Official Hugging Face model card benchmarks show Inkling 2 Mini (5.4B effective active parameters) scoring higher than the roughly five-times-larger Qwen3.8-27B (27B active) on DeepSWE v1.1, SWE-bench Pro v2 Hard, and SWE-bench Verified.
caption: Figures from Thinking Machines Lab's official Hugging Face model card. Scale: baseline y=300, plot top y=60, domain 0-80, k=(300-60)/80=3 (3 units per point), bar top y=300-score*3.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Score</text>
  <line class="dg-grid" x1="72" y1="240" x2="612" y2="240"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="120" x2="612" y2="120"/>
  <text class="dg-small" x="64" y="240" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="120" text-anchor="end" dominant-baseline="central">60</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-s1"><text class="dg-text--series" x="350" y="18" text-anchor="start" dominant-baseline="central">Qwen3.8-27B</text></g>
  <g class="dg-c-accent"><text class="dg-text--series" x="520" y="18" text-anchor="start" dominant-baseline="central">Inkling 2 Mini</text></g>

  <rect class="dg-bar dg-c-s1" x="114" y="173" width="44" height="127"/>
  <rect class="dg-bar dg-c-accent" x="166" y="155" width="44" height="145"/>
  <rect class="dg-bar dg-c-s1" x="294" y="79" width="44" height="221"/>
  <rect class="dg-bar dg-c-accent" x="346" y="66" width="44" height="234"/>
  <rect class="dg-bar dg-c-s1" x="474" y="67" width="44" height="233"/>
  <rect class="dg-bar dg-c-accent" x="526" y="62" width="44" height="238"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="163" text-anchor="middle" dominant-baseline="central">42.2</text>
  <text class="dg-label dg-text--accent" x="188" y="145" text-anchor="middle" dominant-baseline="central">48.2</text>
  <text class="dg-sub" x="316" y="69" text-anchor="middle" dominant-baseline="central">73.8</text>
  <text class="dg-label dg-text--accent" x="368" y="56" text-anchor="middle" dominant-baseline="central">77.9</text>
  <text class="dg-sub" x="496" y="57" text-anchor="middle" dominant-baseline="central">77.8</text>
  <text class="dg-label dg-text--accent" x="548" y="52" text-anchor="middle" dominant-baseline="central">79.2</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">DeepSWE v1.1</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench Pro v2 Hard</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench Verified</text>
</svg>
```

| Benchmark | Score (Inkling 2 Mini) | Predecessor | Best competitor (Qwen3.8-27B) |
|---|---|---|---|
| DeepSWE v1.1 | 48.2% | None (first public looped transformer) | 42.2% |
| SWE-bench Pro v2 Hard | 77.9% | None | 73.8% |
| SWE-bench Verified | 79.2% | None | 77.8% |
| Vals Index v2.2 | 46.5% | None | Not reported |
| AA Index v5.0 (Artificial Analysis) | 20.1 | None | 20.1 (tied) |
| ComplexConstraints v1.1 | 33.4% | None | 35.6% (Inkling trails) |

All figures above are Thinking Machines Lab's own benchmarks from the official Hugging Face model card; Artificial Analysis independently measured the AA Index and per-task cost and latency figures.

## Comparison with Predecessors and Competitors

Inkling 2 Mini has no direct predecessor to compare against — it's Thinking Machines Lab's first public looped transformer. Their own comparison is an internal "looped vs. non-looped" experiment: at equal training compute, the non-looped version trained 7.5% cheaper, but needed 140% more inference compute to match the looped version's loss on 512K-token agentic traces. The gain from looping isn't cheaper training — it's reaching the same reasoning depth with fewer tokens at inference time.

Against Qwen3.8-27B, Inkling 2 Mini leads on all three agentic coding benchmarks using a fifth of the effective active parameters (5.4B vs. 27B): +6 points on DeepSWE v1.1, +4.1 points on SWE-bench Pro v2 Hard, +1.4 points on SWE-bench Verified. But on benchmarks that need long instruction-following or multi-turn stability — Terminal-Bench v2.1 (71.6% vs. 73.0%), MultiChallenge multi-turn dialogue, and ComplexConstraints v1.1 (33.4% vs. 35.6%) — Qwen3.8-27B still edges ahead, and Thinking Machines names this as a limitation of Inkling 2 Mini themselves.

On pricing, Thinking Machines Lab gave an official Tinker platform price ($0.15 input / $0.50 output / $0.015 cache hit per 1M tokens) rather than following the usual open-weights pattern of no first-party API. That's an aggressive price play: Artificial Analysis measured the same Intelligence Index tasks costing $0.59 and taking 9.0 minutes on Inkling 2 Mini, versus $3.53 and 38.2 minutes on Qwen3.8-27B — roughly 6x cheaper and 4x faster.

## What This Means for Agent Development

A 1M-token context window combined with a 20GB footprint that runs on a laptop makes Inkling 2 Mini's positioning clear: it isn't competing with larger models on breadth of knowledge — it's built for running local, low-latency, persistent agents offline. Thinking Machines' own demo (20 villager characters simulated by one model on an offline MacBook) is a direct showcase of that positioning.

- **If you're building a local or edge-deployed coding agent**: it beats the 27B-class open competitor across the DeepSWE and SWE-bench family, and ships at native training precision with no quantization conversion loss — currently the strongest candidate at this size
- **If you need many persistent agent instances on a limited budget**: official Tinker pricing is roughly 6x cheaper than Qwen3.8-27B, and the local-inference option cuts both API cost and infrastructure cost at once
- **Not a good fit for**: knowledge-intensive Q&A — Thinking Machines states explicitly that looping doesn't help the model "remember more facts"; knowledge benchmarks like AA-Omniscience track total parameter count, not loop count. It's also weaker on strict multi-turn instruction-following (ComplexConstraints and MultiChallenge both trail Qwen3.8-27B). For long-horizon agentic tasks, cap output tokens and agent turns — Thinking Machines' own testing observed the model getting stuck in repeated reasoning loops

## Today's Takeaway

I'd assumed the only way to make a small model reason better was a longer visible chain of thought — more output tokens the model writes out. Inkling 2 Mini shows a second path: run the same weights internally more than once (looping), buying invisible computation depth without adding parameters or output tokens. The more surprising part is that this "invisible computation" didn't make the model harder to monitor at this scale, according to Thinking Machines' own tests — the opposite of the intuitive worry that hidden reasoning means harder oversight. They're careful to note this is a preliminary result that might not hold at larger scale.

## References

- [Introducing Inkling 2 Mini (Thinking Machines Lab, official announcement)](https://thinkingmachines.ai/news/inkling-2-mini/)
- [Inkling 2 Mini Model Card (Thinking Machines Lab)](https://thinkingmachines.ai/model-card/inkling-2-mini/)
- [thinkingmachines/Inkling-2-Mini (Hugging Face model page)](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [Thinking Machines has released Inkling 2 Mini (Artificial Analysis independent benchmarks and pricing analysis)](https://artificialanalysis.ai/articles/inkling-2-mini)
- [Thinking Machines releases Inkling 2 Mini, an open looped model that runs on a laptop (MLQ.ai)](https://mlq.ai/news/thinking-machines-releases-inkling-2-mini-an-open-looped-model-that-runs-on-a-laptop/)
