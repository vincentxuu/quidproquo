---
title: "Model Card | Liquid AI LFM3-1.7B"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, liquid-ai, model-family-liquid-ai]
lang: en
description: "Liquid AI ships its next-generation LFM3 family: six models sharing one 1.7B backbone. The text model, LFM3-1.7B, beats its predecessor with 35% fewer parameters and outscores a 5x-larger Qwen3.5-9B on web-agent benchmarks"
tldr: "LFM3-1.7B: released 2026-10-27, 1.73B parameters, 256K context, LFM Open License v1.0 (free commercial use under $10M annual revenue). A tri-hybrid architecture (13 short-convolution layers, 5 sliding-window attention, 6 global attention) cuts KV cache to about 27% of a standard transformer. It scores 38.42 on WebArena-Verified, beating both the predecessor LFM2.5-2.6B (3.02) and the 5x-larger Qwen3.5-9B (28.94), but still trails Qwen3.5-9B on long-context understanding (AA-LCR) and knowledge-heavy tasks (GPQA Diamond). Liquid AI's own model card says it isn't recommended for agentic coding or complex multi-step reasoning. Liquid Console API pricing: $0.08 input / $0.20 output per 1M tokens (cached input $0.02). The same release also ships VL, Audio, Omni, and two decision models sharing the same backbone."
series:
  name: "AI Model Tracker"
  order: 61
glossary:
  - term: "LFM3"
    def: "Liquid AI's third-generation edge inference model family — text, vision, audio, omni, and two decision models, all sharing a single 1.7B backbone"
  - term: "tri-hybrid architecture"
    def: "A model architecture that mixes short-convolution layers, sliding-window attention layers, and global attention layers, trading memory for near-full-attention capability"
---

> 🌏 [中文版](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b)

## Model Information

| Item | Value |
|---|---|
| Model ID | `LiquidAI/LFM3-1.7B` |
| Vendor | Liquid AI |
| Parameters | 1.73B (text model, 24 layers: 13 short convolution / 5 sliding-window attention / 6 global attention) |
| Context Window | 256,000 tokens (input + output) |
| Input Pricing (USD/1M tokens) | $0.08 (cached input $0.02, via Liquid Console API) |
| Output Pricing (USD/1M tokens) | $0.20 |
| Open Source | Yes (LFM Open License v1.0: free to download, fine-tune, and deploy commercially; a separate commercial license is required above $10M annual revenue) |
| Release Date | 2026-10-27 |
| Official Announcement | [Liquid AI Blog: Introducing LFM3](https://www.liquid.ai/blog/lfm3) |
| HuggingFace | [LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B) |
| Family | LFM3 (the next generation after LFM2.5; six models share one `LFM3-1.7B-Base` backbone: text, vision LFM3-VL-2B, audio LFM3-Audio-2B, omni LFM3-Omni-2B, and two decision models) |

## Capability Highlights

- Scores 38.42 on WebArena-Verified, beating the 5x-larger Qwen3.5-9B (28.94); also beats it on the LiveClaw agent benchmark, 45.60 vs 35.77
- Uses 35% fewer parameters than its predecessor LFM2.5-2.6B (1.73B vs 2.6B) while beating it on every benchmark Liquid AI published side by side
- On three test devices (AMD Ryzen AI Max+ 395, Apple M5 Max, iPhone 17 Pro) at 32K context, it prefills at least 2.5x faster and decodes at least 1.8x faster than every compared model, while using the least memory; at 4-bit precision it needs only about 1GB
- The tri-hybrid architecture cuts KV cache to roughly 27% of a standard 24-layer transformer, which is how the same memory budget stretches to a 256K context; total pre-training was 22T tokens

## Benchmark Results

| Benchmark | LFM3-1.7B | Predecessor (LFM2.5-2.6B) | Strongest competitor (Qwen3.5-9B, 5x larger) |
|---|---|---|---|
| WebArena-Verified | 38.42 | 3.02 | 28.94 |
| LiveClaw | 45.60 | 14.70 | 35.77 |
| BFCL V4 (tool calling) | 71.39 | 55.89 | 62.83 |
| IFEval (instruction following) | 96.66 | 95.39 | 92.08 |
| AA-LCR (long-context understanding) | 52.83 | 6.00 | **62.00** |

⚠️ All figures above are Liquid AI's own benchmarks (vLLM, BF16, run at full context length); no independent third-party reproduction exists as of release. Multiple outlets (VentureBeat, TechTimes) also flag these as vendor-reported numbers.

## Comparison with Predecessor and Competitors

Against its predecessor LFM2.5-2.6B, LFM3-1.7B isn't just smaller — the architecture changed entirely: the tri-hybrid design (13 short-convolution, 5 sliding-window attention, 6 global attention layers) replaces what came before, and pre-training data grew to 22T tokens. The result is a generational jump rather than a tune-up: the predecessor could barely answer WebArena-Verified tasks (3.02), while LFM3-1.7B scores 38.42.

Against Qwen3.5-9B — five times the parameter count — LFM3-1.7B wins across every "hands-on" agent task (WebArena-Verified, LiveClaw, BFCL V4 tool calling), and edges ahead on the unweighted average too (49.37 vs 47.24). But it still loses on long-context understanding (AA-LCR, 52.83 vs 62.00) and knowledge-heavy benchmarks (GPQA Diamond, 63.37 vs 80.40; Humanity's Last Exam trails across the board). That profile shows LFM3-1.7B is deliberately optimized for "doing" rather than "knowing."

Pricing also shifted noticeably: the Liquid Console API's $0.08/1M input and $0.20/1M output is far cheaper than the predecessor LFM2.5-2.6B's $0.35/$0.50, as tracked by third-party aggregators (VentureBeat cites the official console rate card, which requires login to view; the LFM2.5-2.6B figures come from pricepertoken.com). A smaller model at a lower price, with free on-device deployment on top of open weights, is the clearest commercial signal in this release.

## What This Means for Agent Development

The tri-hybrid architecture's ~27% KV cache footprint is why Liquid AI could push the text model's context window all the way to 256K on the same memory budget. That matters most for "always-on" local agents — ones running continuously on a phone or laptop and accumulating conversation history — since they don't need to clear context frequently or lean on a cloud API for memory.

- If you're building an always-on local or enterprise-controlled agent (data stays on-device): LFM3-1.7B needs roughly 1GB of memory at 4-bit precision, ships with a 256K context, and officially supports agent harnesses like Hermes Agent, Pi, and OpenClaw. The release names Mercedes-Benz (exploring it for the MBUX in-car assistant) and Shopify as pre-release testing partners
- If you're running high-concurrency cloud tool-calling services: a single NVIDIA B300 can produce 3.6 billion tokens/day at 1,024 concurrent requests, and it beats Qwen3.5-9B on several agentic benchmarks with a fifth of the parameters — worth evaluating for cost-sensitive workloads
- Not a good fit: Hugging Face's own model card explicitly says it isn't recommended for agentic coding or complex multi-step reasoning (SWE-bench Verified is only 43.40, trailing Qwen3.5-9B's 51.20), or for knowledge-heavy tasks without retrieval

## Today's Takeaway

The interesting part here isn't the familiar "small model beats big model" story — it's how clearly Liquid AI spells out the trade-off. LFM3-1.7B beats a model five times its size on tool-use and web-navigation tasks, at the cost of falling behind on long-context understanding and knowledge-heavy questions, and the official model card itself discourages using it for agentic coding. The same release also ships two "decision models" (the d1 series) that return structured answers instead of conversational text — a reminder that not every agent task needs a model that can chat; some just need a reliable classifier.

## References

- [Liquid AI Blog: Introducing LFM3 — Every Modality for Specialized Intelligence (official release post)](https://www.liquid.ai/blog/lfm3)
- [Official HuggingFace model card: LiquidAI/LFM3-1.7B](https://huggingface.co/LiquidAI/LFM3-1.7B)
- [VentureBeat: Liquid AI's new LFM3 models put browser agents, voice commands, and image recognition onto enterprise-controlled devices (includes Liquid Console API pricing)](https://venturebeat.com/technology/liquid-ais-new-lfm3-models-put-browser-agents-voice-commands-and-image-recognition-onto-enterprise-controlled-devices)
- [TechTimes: Liquid AI Releases LFM3 — Six Open-Weight Models Fuse Text, Vision, Audio, One 2B Backbone (tri-hybrid architecture and KV cache details)](https://www.techtimes.com/articles/329588/20261028/liquid-ai-releases-lfm3-six-open-weight-models-fuse-text-vision-audio-one-2b-backbone.htm)
- [startupfortune.com: Liquid AI releases LFM3 models small enough to run on a phone (LFM3-VL-2B / LFM3-Audio-2B details)](https://startupfortune.com/liquid-ai-releases-lfm3-models-small-enough-to-run-on-a-phone/)
- [pricepertoken.com: Liquid AI API Pricing (LFM2.5-2.6B pricing comparison)](https://pricepertoken.com/pricing-page/provider/liquid)
- [Our Liquid AI / LFM family primer](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)
- [Our model card: Liquid AI LFM2.5-24B-A2B (previous entry)](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b-en)

```diagram
title: WebArena-Verified: LFM3-1.7B vs Predecessor and Competitor
desc: LFM3-1.7B scores 38.42 on WebArena-Verified, more than 12x the predecessor LFM2.5-2.6B's 3.02, and ahead of the 5x-larger Qwen3.5-9B at 28.94.
caption: Data from LiquidAI/LFM3-1.7B's official HuggingFace model card benchmark table (Liquid AI's own testing, vLLM BF16), pending independent reproduction. Conversion: baseline y=300, plot top y=60, value domain 0–45, k=240/45=5.333 (y = 300 − value × 5.333).
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">score</text>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">15</text>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">30</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="140" y="283.9" width="64" height="16.1"/>
    <rect class="dg-bar dg-bar--soft" x="480" y="145.7" width="64" height="154.3"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="310" y="95.1" width="64" height="204.9"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="274" text-anchor="middle" dominant-baseline="central">3.02</text>
  <text class="dg-label dg-text--accent" x="342" y="85" text-anchor="middle" dominant-baseline="central">38.42</text>
  <text class="dg-sub" x="512" y="136" text-anchor="middle" dominant-baseline="central">28.94</text>

  <text class="dg-sub" x="172" y="320" text-anchor="middle" dominant-baseline="central">LFM2.5-2.6B (prev)</text>
  <text class="dg-label dg-text--accent" x="342" y="320" text-anchor="middle" dominant-baseline="central">LFM3-1.7B</text>
  <text class="dg-sub" x="512" y="320" text-anchor="middle" dominant-baseline="central">Qwen3.5-9B (5x larger)</text>
</svg>
```
