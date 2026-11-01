---
title: "Model Card: Baidu Unlimited OCR 2"
date: 2026-10-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-unlimited-ocr]
lang: en
description: "Baidu open-sources Unlimited OCR 2, a 3.34B vision-language model whose SR-SWA sparse attention pulls hundred-page parsing scores from 0 to 77.1"
tldr: "Baidu Unlimited OCR 2 (`baidu/Unlimited-OCR-2`): open-sourced 2026-10-27, 3.34B parameters (SAM ViT-B + CLIP-L encoder, 12-layer MoE decoder routing each token to 6-of-64 experts plus 2 shared experts), 131,072-token context window, MIT License; its core trick is SR-SWA (Sparse Reference Sliding Window Attention), which compresses cross-page text-visual attention into a fixed 512-token reference set; scores 84.6 on MPDocBench (dozens of pages) and 77.1 on MarathonDocBench (hundreds of pages) — only a 7.5-point drop; predecessor Unlimited-OCR 1.0 scored 0.0 on MarathonDocBench, and rival Qwen3.8-Max falls from 78.3 to 22.9; runs on a single NVIDIA A800-80GB with BF16 weights around 6.7GB"
series:
  name: "AI Model Tracker"
  order: 60
glossary:
  - term: "Unlimited OCR"
    def: "Baidu's open-source long-document OCR model family, aiming to parse documents of any length — from a few pages to hundreds — in one pass, without chunking and stitching"
---

> 🌏 [中文版](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2)

## Model Info

| Field | Value |
|---|---|
| Model ID | `baidu/Unlimited-OCR-2` |
| Vendor | Baidu |
| Parameters | 3.34B total (active parameters undisclosed; 12-layer MoE decoder routing each token to 6-of-64 experts plus 2 shared experts, an architecture carried over from DeepSeek-OCR's DeepSeek3B-MoE-A570M) |
| Context Window | 131,072 tokens |
| Input price (USD/1M tokens) | Not available (open weights plus Baidu Cloud docs only — no official hosted API pricing) |
| Output price (USD/1M tokens) | Not available (same as above) |
| Open source | Yes (MIT License) |
| Release date | 2026-10-27 |
| Official announcement | [Baidu Inc. on X: Unlimited OCR 2 is here](https://x.com/Baidu_Inc/status/2114910381311512987) |
| Hugging Face | [baidu/Unlimited-OCR-2](https://huggingface.co/baidu/Unlimited-OCR-2) |
| Family | Unlimited-OCR (predecessor Unlimited-OCR 1.0 shipped 2026-06-22, built to push DeepSeek-OCR's long-document parsing further; this generation's core advance is SR-SWA) |

## Highlights

- **SR-SWA (Sparse Reference Sliding Window Attention)**: compresses cross-page text-visual attention into a fixed 512-token working reference set (a 128-token local window plus top-16 selection over 32-token blocks), keeping per-step decoding latency and memory footprint nearly flat regardless of how many pages a document has
- **Scores 77.1 on MarathonDocBench** (hundred-page documents), more than double the next-best model Kimi-K3 at 33.7; that's only 7.5 points below its own 84.6 on MPDocBench (dozens of pages)
- **Against its own predecessor, Unlimited-OCR 1.0**: on the same MarathonDocBench test, the predecessor scored 0.0 while this generation scores 77.1 — the earlier model collapsed outright on hundred-page documents; this one is the first to actually hold up as documents get longer
- 3.34B parameters (SAM ViT-B + CLIP-L encoder, 12-layer MoE decoder), runs on a single NVIDIA A800-80GB with BF16 weights around 6.7GB, and costs just 273 image tokens per page in multi-page mode

## Benchmark Results

| Benchmark | Score | Predecessor (Unlimited-OCR 1.0) | Best competitor |
|---|---|---|---|
| MPDocBench (dozens of pages, overall) | 84.6 | 61.9 | Qwen3.8-Max 78.3 |
| MarathonDocBench (hundreds of pages, overall) | 77.1 | 0.0 | Kimi-K3 33.7 |
| Text extraction (MarathonDocBench sub-score) | 89.6 | Sub-score not disclosed | Not disclosed |
| Tables (MarathonDocBench sub-score) | 74.8 | Sub-score not disclosed | Not disclosed |
| Heading hierarchy (MarathonDocBench sub-score, the model's weakest category) | 48.2 | Sub-score not disclosed | Not disclosed |

⚠️ All figures are Baidu's own self-reported results, published only as a leaderboard chart image on the model card (transcribed here by third-party coverage, not a data table). MarathonDocBench is a benchmark Baidu built itself; the dataset isn't publicly released, and no other team has independently reproduced these numbers yet.

```diagram
title: Unlimited OCR 2 shrinks the score gap on long-document benchmarks
desc: Baidu Unlimited OCR 2 drops only 7.5 points between MPDocBench (dozens of pages) and MarathonDocBench (hundreds of pages); rival Qwen3.8-Max drops 55.4 points, and predecessor Unlimited-OCR 1.0 collapses to zero.
caption: Source: Baidu's official leaderboard chart (2026-10-27, all self-reported scores; MarathonDocBench is a Baidu-built benchmark with no public release yet). Conversion: baseline y=300, plot top y=60, domain 0–100 points, k=(300−60)÷100=2.4 (2.4 units per point), bar top y=300−score×2.4.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Score</text>
  <line class="dg-grid" x1="72" y1="108" x2="612" y2="108"/>
  <line class="dg-grid" x1="72" y1="204" x2="612" y2="204"/>
  <text class="dg-small" x="64" y="108" text-anchor="end" dominant-baseline="central">80</text>
  <text class="dg-small" x="64" y="204" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <text class="dg-text--series" x="136" y="52" text-anchor="middle" dominant-baseline="central">MPDoc</text>
  <text class="dg-text--series dg-text--accent" x="188" y="52" text-anchor="middle" dominant-baseline="central">Marathon</text>

  <rect class="dg-bar dg-c-s1" x="114" y="97" width="44" height="203"/>
  <rect class="dg-bar dg-c-accent" x="166" y="115" width="44" height="185"/>
  <rect class="dg-bar dg-c-s1" x="294" y="112" width="44" height="188"/>
  <rect class="dg-bar dg-c-accent" x="346" y="245" width="44" height="55"/>
  <rect class="dg-bar dg-c-s1" x="474" y="151" width="44" height="149"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="87" text-anchor="middle" dominant-baseline="central">84.6</text>
  <text class="dg-label dg-text--accent" x="188" y="105" text-anchor="middle" dominant-baseline="central">77.1</text>
  <text class="dg-sub" x="316" y="102" text-anchor="middle" dominant-baseline="central">78.3</text>
  <text class="dg-sub" x="368" y="235" text-anchor="middle" dominant-baseline="central">22.9</text>
  <text class="dg-sub" x="496" y="141" text-anchor="middle" dominant-baseline="central">61.9</text>
  <text class="dg-label dg-text--accent" x="548" y="288" text-anchor="middle" dominant-baseline="central">0.0</text>

  <text class="dg-sub dg-text--accent" x="162" y="320" text-anchor="middle" dominant-baseline="central">Unlimited OCR 2</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">Qwen3.8-Max</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">Unlimited OCR 1</text>
</svg>
```

## vs. Predecessor and Competitors

Against predecessor Unlimited-OCR 1.0, MPDocBench only improved by 22.7 points (61.9 → 84.6), but MarathonDocBench jumped from 0.0 straight to 77.1. That gap says a lot: the predecessor's `infer_multi` could already feed an entire document into one request, but it never actually solved the computational complexity of long-sequence attention, so it fell apart past some page count. SR-SWA's fixed-size reference set is what actually fixes the bottleneck — not a bigger context window or a multi-page inference interface.

Against Qwen3.8-Max, currently the runner-up on MPDocBench, the two are nearly tied on short documents (84.6 vs. 78.3, a 6.3-point gap). But move to the hundred-page MarathonDocBench and Qwen3.8-Max crashes from 78.3 to 22.9 — a 55.4-point drop — while Unlimited OCR 2 loses only 7.5 points. A high score on a short-document benchmark doesn't guarantee stability on long documents; what actually determines long-document parsing quality is whether the attention mechanism was designed for extreme sequence lengths, not how many parameters a model stacks or how large a context window it advertises.

On licensing, Unlimited OCR 2 sits in the same open-weight camp as DeepSeek-OCR-2 (Apache 2.0) and PaddleOCR-VL-1.6 (Apache 2.0): weights, code, and the technical report are all released under MIT, with no separate paid API product line.

## What This Means for Agent Development

- If you're building agents that process long documents (clause-by-clause contract comparison, annual financial-report archiving, RAG indexing for entire books): Unlimited OCR 2's pitch is "no chunking first" — `infer_multi` ingests a whole document in one request and preserves cross-page table, heading, and paragraph structure, which especially helps downstream tasks that need the full document structure (auto-generated tables of contents, precisely locating a cited passage) rather than page-by-page isolated text
- If you're running a document-parsing pipeline and want to self-host inference: 3.34B parameters on a single A800-80GB with roughly 6.7GB of BF16 weights means a mid-tier GPU is enough, so you don't need to call an external OCR API — a realistic option for data that can't leave your premises (finance, healthcare documents)
- If your task needs high accuracy on heading or chapter structure (auto-generating a table of contents or chapter summaries): note that heading hierarchy is the model's weakest sub-score (only 48.2 on hundred-page documents) — that part still needs human review or extra post-processing, not full automation
- Not a fit: scenarios that need an official hosted API with SLA guarantees — Baidu currently only offers open weights and Baidu Cloud documentation, not a standard managed API like OpenAI's or Anthropic's, so you'll need to evaluate your own deployment and operations cost

## Today's Insight

I used to assume "long-document OCR" mainly meant chunking and stitching, or just brute-forcing it with a bigger context window. Unlimited OCR 2's MarathonDocBench result breaks that assumption: the predecessor used the exact same "ingest every page at once" strategy (`infer_multi`), and its score collapsed to zero anyway. Only switching to a mechanism like SR-SWA — one that compresses attention into a fixed-size reference set — kept parsing quality from falling apart as page count grew. The reminder: the bottleneck in long-sequence tasks is often not "is the context window big enough," but whether the attention mechanism's own computational complexity has actually been solved.

## References

- [Baidu: Unlimited-OCR-2 model card (Hugging Face)](https://huggingface.co/baidu/Unlimited-OCR-2)
- [Baidu: Unlimited-OCR source code on GitHub](https://github.com/baidu/Unlimited-OCR)
- [Baidu Inc. on X: Unlimited OCR 2 is here](https://x.com/Baidu_Inc/status/2114910381311512987)
- [MarkTechPost: Baidu Open-Sources Unlimited OCR 2 for Hundred-Page Document Parsing](https://www.marktechpost.com/2026/10/26/baidu-unlimited-ocr-2-open-source-long-document-ocr/)
- [explainX: Unlimited-OCR-2 — Baidu's 3B MIT OCR Model, How to Run It](https://explainx.ai/blog/baidu-unlimited-ocr-2-sr-swa-3b-mit-hundred-page-document-parsing-how-to-run-2026)
- [AlphaSignal: Baidu Open-Sources Unlimited OCR 2 to Parse Hundreds of Pages Without Breaking](https://alphasignal.ai/news/baidu-open-sources-unlimited-ocr-2-to-parse-hundreds-of-pages-without-breaking)
