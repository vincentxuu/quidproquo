---
title: "Model Card: SenseNova Loop-9B (Stable Release)"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, sensetime, model-family-sensenova]
lang: en
description: "SenseTime graduates SenseNova Loop-9B from Preview to a stable release — GAIA jumps from 37.86 to 69.90, context doubles to 512K, and launch day ships official AWQ 4-bit weights plus Cambricon MLU support"
tldr: "SenseNova Loop-9B stable (`sensenova/SenseNova-Loop-9B`): released 2026-11-17 by SenseTime, superseding the 2026-10-30 Preview, under Apache 2.0. ~9B stored parameters / ~14.6B inference-equivalent compute; context window doubles from the Preview's 262K to 512K tokens. SenseTime's own benchmarks: GAIA 37.86→69.90, Terminal-Bench 2.1 40.45→59.55, AutomationBench 14.33→36.67 (tying Qwen3.8-27B's 36.67); it trails Qwen3.8-27B on NL2Repo (41.36 vs 44.60). Open weights only, no official API. Launch day also ships official AWQ 4-bit quantization and day-0 Cambricon MLU support."
series:
  name: "AI Model Tracker"
  order: 78
glossary:
  - term: "SenseNova Loop"
    def: "SenseTime's architecture branch exploring compute depth versus parameter efficiency — it re-runs shared-weight layers to deepen the effective compute path without adding stored parameters"
---

> :globe: [中文版](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b)

## Model Info

| Field | Value |
|---|---|
| Model ID | `sensenova/SenseNova-Loop-9B` |
| Vendor | SenseTime |
| Parameters | ~9B stored parameters; ~14.6B inference-equivalent compute (of 32 distinct decoder layers, layers 4-27 run twice — 56 total layer executions from only 32 stored weight sets) |
| Context Window | 512,000 tokens (per the official Hugging Face model card; double the Preview's 262,144 tokens) |
| Input pricing (USD/1M tokens) | Not available (open weights only, no official hosted API) |
| Output pricing (USD/1M tokens) | Not available (same as above) |
| Open source | Yes (Apache License 2.0) |
| Release date | 2026-11-17 |
| Official announcement | [SenseNova-Loop-9B model card (Hugging Face)](https://huggingface.co/sensenova/SenseNova-Loop-9B) |
| Hugging Face | [sensenova/SenseNova-Loop-9B](https://huggingface.co/sensenova/SenseNova-Loop-9B) |
| Family | SenseNova Loop (the stable release, 18 days after the [Preview](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en) opened-sourced on 2026-10-30) |

## Highlights

- **GAIA jumps from 37.86 to 69.90**: the official Hugging Face model card's "From Preview to Release" benchmark chart shows the stable release beating the Preview on all seven charted benchmarks, with GAIA posting the largest gain (+32.04 points, nearly doubling)
- **Terminal-Bench 2.1 climbs from 40.45 to 59.55, AutomationBench from 14.33 to 36.67** — the latter exactly ties Qwen3.8-27B, a model with roughly 3x the parameters (also 36.67)
- **Context window doubles from 262,144 to 512,000 tokens**, while the looped architecture itself is unchanged (32 distinct decoder layers executed 56 times, with two-stream mHC)
- **Launch day ships official AWQ 4-bit and GGUF weights**: the 4-bit quantized weights come in at roughly 4.9GB, and 256K-context multimodal inference is estimated to need only about 15GiB of GPU memory with an 8-bit KV cache
- **Day-0 Cambricon MLU support**: Cambricon's `vllm_mlu` statically unrolls the looped architecture into 56 sequential execution slots, reusing vLLM's existing scheduling and KV-cache machinery — though Pandaily's coverage notes these throughput claims haven't been independently verified

## Benchmarks

```diagram
title: SenseNova Loop-9B's stable release pulls far ahead of the Preview on three benchmarks
desc: The official Hugging Face model card's "Model Performance: From Preview to Release" chart shows the stable SenseNova Loop-9B (2026-11-17) scoring far higher than the 2026-10-30 Preview on GAIA, Terminal-Bench 2.1, and AutomationBench.
caption: Figures from SenseTime's official Hugging Face model card. Scale: baseline y=300, plot top y=60, domain 0-80 points, k=(300-60)/80=3 units per point, bar top y=300-score*3.
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

  <g class="dg-c-s1"><text class="dg-text--series" x="380" y="32" text-anchor="start" dominant-baseline="central">Preview</text></g>
  <g class="dg-c-accent"><text class="dg-text--series" x="500" y="32" text-anchor="start" dominant-baseline="central">Stable</text></g>

  <rect class="dg-bar dg-c-s1" x="114" y="186" width="44" height="114"/>
  <rect class="dg-bar dg-c-accent" x="166" y="90" width="44" height="210"/>
  <rect class="dg-bar dg-c-s1" x="294" y="179" width="44" height="121"/>
  <rect class="dg-bar dg-c-accent" x="346" y="121" width="44" height="179"/>
  <rect class="dg-bar dg-c-s1" x="474" y="257" width="44" height="43"/>
  <rect class="dg-bar dg-c-accent" x="526" y="190" width="44" height="110"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="176" text-anchor="middle" dominant-baseline="central">37.86</text>
  <text class="dg-label dg-text--accent" x="188" y="80" text-anchor="middle" dominant-baseline="central">69.90</text>
  <text class="dg-sub" x="316" y="169" text-anchor="middle" dominant-baseline="central">40.45</text>
  <text class="dg-label dg-text--accent" x="368" y="111" text-anchor="middle" dominant-baseline="central">59.55</text>
  <text class="dg-sub" x="496" y="247" text-anchor="middle" dominant-baseline="central">14.33</text>
  <text class="dg-label dg-text--accent" x="548" y="180" text-anchor="middle" dominant-baseline="central">36.67</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">GAIA</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">Terminal-Bench 2.1</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">AutomationBench</text>
</svg>
```

| Benchmark | Score (stable) | Predecessor (Preview) | Best competitor (Qwen3.8-27B) |
|---|---|---|---|
| GAIA | 69.90 | 37.86 | Not available |
| Terminal-Bench 2.1 | 59.55 | 40.45 | Not available |
| AutomationBench | 36.67 | 14.33 | 36.67 (tied) |
| AIDABench | 65.31 | Not available | 65.01 |
| NL2Repo | 41.36 | Not available | 44.60 (trails) |
| BIRD | 72.34 | 71.38 | Not available |

All figures are SenseTime's own results from the official Hugging Face model card, not yet independently reproduced. Qwen3.8-27B's parameter count is roughly double the stable release's inference-equivalent compute (~14.6B).

## vs. Predecessor and Competitors

Against the Preview, the stable release's biggest gains are on GAIA (+32.04 points, nearly doubling) and Terminal-Bench 2.1 (+19.1 points) — both benchmarks that demand multi-step tool chains and complex task planning, which suggests the 18-day iteration mainly strengthened agentic ability rather than just padding scores. AutomationBench is the most concrete "small model beats big model" evidence here: the Preview trailed the (differently-sized) Qwen3.5-27B at 10.2 points behind, and the stable release now exactly ties Qwen3.8-27B at 36.67.

Against Qwen3.8-27B, AutomationBench ties and AIDABench edges ahead slightly (65.31 vs 65.01, within noise), but NL2Repo trails by 3.24 points (41.36 vs 44.60) — code-generation-adjacent tasks remain a weak spot, consistent with the Preview-era pattern of falling behind larger models on Terminal Bench and financial-workflow tasks.

Pricing hasn't changed: the stable release, like the Preview, ships as open weights only with no official API, so it isn't competing on price. What's new is the official AWQ 4-bit quantization and day-0 Cambricon support, which lower the cost of self-hosting rather than the cost of calling an API — 4.9GB of quantized weights plus roughly 15GiB of GPU memory (at 256K context) makes consumer-grade hardware a more realistic deployment target than before.

## What This Means for Agent Development

Doubling the context window (262K→512K) alongside the sharp jump in agentic benchmarks puts the stable Loop-9B closer to being something you'd actually run an agent on, rather than just a showcase of architectural efficiency.

- **If you're running agents on consumer or edge GPUs**: the official AWQ 4-bit quantization (~4.9GB) combined with roughly 15GiB of GPU memory for 256K-context inference gives you an officially-validated quantization path, which is less guesswork than the Preview era.
- **If you're building long-context, multi-step tasks** (document analysis, long-running conversational agents): the 512K context paired with the GAIA and Terminal-Bench 2.1 gains is worth evaluating — but SenseTime's own "Known Limitations" section flags inconsistent instruction-following with many complex tool definitions and multiple constraints, plus uneven performance on long-horizon coding and agent tasks, so validate on a small scope first.
- **Not a fit**: scenarios needing a stable public API or SLA guarantees — there's still only open weights, no official hosted service. Don't treat Cambricon's MLU throughput numbers as capacity-planning input either; Pandaily's coverage is explicit that those are the vendor's own unverified claims.

## Today's Takeaway

Only 18 days separate the Preview from the stable release, yet GAIA nearly doubled and AutomationBench went from trailing to tying a ~27B-class competitor — a sign that "ship a Preview to gather community feedback, then iterate fast into a stable release" is becoming a standard cadence among Chinese open model labs, not a SenseTime one-off (Tencent's Hy4 flash and MiniMax's recent releases follow the same pattern). But what stands out more than the benchmark gains is the discipline on display: SenseTime's own model card plainly lists where long-horizon tasks still wobble, and Pandaily explicitly flags that Cambricon's throughput claims are unverified — a release that moves fast while drawing its own verification boundaries clearly.

## References

- [SenseNova-Loop-9B model card (Hugging Face, stable release)](https://huggingface.co/sensenova/SenseNova-Loop-9B)
- [SenseTime Releases Final SenseNova-Loop-9B With Cambricon Day-0 Support (Pandaily, 2026-11-17)](https://pandaily.com/sensetime-sensenova-loop-9b-final-cambricon-mlu-support)
- [IT Home: SenseNova-Loop-9B stable release coverage (in Mandarin)](https://www.ithome.com/1/028/534.htm)
- [IT Home: Cambricon MLU adaptation coverage (in Mandarin)](https://www.ithome.com/1/028/568.htm)
- [SenseNova-Loop-9B-Preview model card (this site, 2026-10-31)](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en)
