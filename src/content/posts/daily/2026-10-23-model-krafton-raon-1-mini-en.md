---
title: "Model Card: KRAFTON Raon-1 mini"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, krafton, model-family-raon]
lang: en
description: "South Korean game studio KRAFTON trained its first LLM from scratch — Raon-1 mini, a 30B-A4B MoE model with 262K context, Apache 2.0 weights, and a huge lead on Korean conversational benchmarks"
tldr: "Raon-1 mini preview: KRAFTON AI (the studio behind PUBG) trained a 28.8B-total/4.3B-active MoE model from scratch, with 262,144-token context and Apache 2.0 open weights. Its hybrid attention stack (Raon Delta Attention + Gated MLA) shrinks KV cache to about 8 KiB per token, and a bundled DFlash2 draft model boosts throughput up to 2.18x on B300 GPUs. It scores 92.9 on an internal Korean chatbot benchmark — far ahead of the similarly-sized Qwen3.6-35B-A3B (74.5) and Gemma 4 26B-A4B (90.6) — but trails Qwen3.6-35B-A3B on MMLU-Pro and BFCL tool-calling. No official API pricing yet; it's open weights plus a time-limited free playground."
series:
  name: "AI Model Tracker"
  order: 56
glossary:
  - term: "Raon"
    def: "KRAFTON AI's open model family for language and speech models; Raon-1 mini is its first general-purpose LLM trained from scratch"
---

> 🌏 [中文版](/posts/daily/2026-10-23-model-krafton-raon-1-mini)

## Model Info

| Field | Value |
|---|---|
| Model ID | `KRAFTON/Raon-1-mini-preview` |
| Vendor | KRAFTON AI (AI research arm of KRAFTON, the studio behind *PUBG*) |
| Parameters | 28.8B total / 4.3B active (30B-A4B class MoE; 6 of 128 routed experts plus 1 shared expert active per token) |
| Context Window | 262,144 tokens |
| Input Pricing (USD/1M tokens) | Not available (open-weight preview release; no official or third-party hosted API pricing yet) |
| Output Pricing (USD/1M tokens) | Not available (same as above; the playground is free for a limited time but that isn't API pricing) |
| Open Source | Yes (Apache 2.0 for the weights; the hosted API/playground is governed by a separate service agreement outside Apache 2.0) |
| Release Date | 2026-10-21 (preview) |
| Official Announcement | [KRAFTON/Raon-1-mini-preview (Hugging Face model card)](https://huggingface.co/KRAFTON/Raon-1-mini-preview) |
| HuggingFace | [KRAFTON/Raon-1-mini-preview](https://huggingface.co/KRAFTON/Raon-1-mini-preview) |
| Family | Raon (KRAFTON AI's open-model brand, launched April 2026 with a speech LLM, a real-time voice model, a TTS model, and a vision encoder; Raon-1 mini is the family's first general-purpose text LLM) |

## Highlights

- **Korean conversation**: scores 92.9 on the internal Chatbot Korean benchmark, well ahead of the similarly-sized MoE model Qwen3.6-35B-A3B (74.5) and also beating Gemma 4 26B-A4B (90.6)
- **Hybrid attention architecture**: of 25 layers, 18 use KRAFTON's own Raon Delta Attention (linear attention with a fixed-size state) and 7 use Gated MLA (which keeps a KV cache), bringing per-token KV cache down to about 8 KiB (BF16) while natively supporting 262,144 tokens of context
- **Built-in speculative decoding**: ships with a DFlash2 draft model that delivered up to 2.18x higher output throughput on a single NVIDIA B300 across several benchmarks
- **Lower edge-deployment bar**: an NVFP4-quantized build runs entirely on a single NVIDIA RTX 5090 (32GB VRAM); MXFP8, GGUF and MLX builds are also available

## Benchmark Results

| Benchmark | Score | Previous Gen | Best MoE Peer |
|---|---|---|---|
| Chatbot Korean (internal) | 92.9 | — (first model) | Gemma 4 26B-A4B 90.6 (Qwen3.6-35B-A3B only 74.5) |
| SWE-bench Verified | 70.8 | — (first model) | Qwen3.6-35B-A3B 63.2 (for reference: dense Qwen3.8-27B 74.6) |
| AIME 2026 | 93.3 | — (first model) | Qwen3.6-35B-A3B 92.9 |
| MMLU Pro | 76.5 | — (first model) | Qwen3.6-35B-A3B 85.9 (Raon-1 mini noticeably trails on general knowledge) |
| BFCL v4 Overall (tool calling) | 59.8 | — (first model) | Qwen3.6-35B-A3B 64.7 (for reference: dense Qwen3.8-27B 72.4) |

⚠️ All figures are KRAFTON's own measurements (judged by gpt-5.6-luna) and await independent reproduction. Chatbot Korean is an unreleased internal benchmark that can't be verified directly by third parties. KRAFTON also notes this is a preview — specs and scores may change before a final release.

```diagram
title: Raon-1 mini vs. Qwen3.6-35B-A3B across four benchmarks
desc: Raon-1 mini leads the similarly-sized Qwen3.6-35B-A3B by wide margins on SWE-bench Verified and Korean conversation, ties on AIME 2026, but trails on the MMLU-Pro general-knowledge benchmark.
caption: Source — KRAFTON's own measurements on its official Hugging Face model card (judge model gpt-5.6-luna); the Korean conversation score is from an unreleased internal benchmark. Y axis runs 0–100, baseline y=300, plot top y=60, 2.4 units per point (y = 300 − score × 2.4).
---
<svg viewBox="0 0 640 360">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Score</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <g class="dg-c-accent">
    <rect class="dg-bar" x="94" y="130" width="44" height="170"/>
    <rect class="dg-bar" x="234" y="76" width="44" height="224"/>
    <rect class="dg-bar" x="374" y="116" width="44" height="184"/>
    <rect class="dg-bar" x="514" y="77" width="44" height="223"/>
    <text class="dg-text--series" x="116" y="44" text-anchor="middle" dominant-baseline="central">Raon-1 mini</text>
  </g>
  <g class="dg-c-s1">
    <rect class="dg-bar" x="150" y="148" width="44" height="152"/>
    <rect class="dg-bar" x="290" y="77" width="44" height="223"/>
    <rect class="dg-bar" x="430" y="94" width="44" height="206"/>
    <rect class="dg-bar" x="570" y="121" width="44" height="179"/>
    <text class="dg-text--series" x="172" y="44" text-anchor="middle" dominant-baseline="central">Qwen3.6-35B-A3B</text>
  </g>

  <text class="dg-sub" x="116" y="120" text-anchor="middle" dominant-baseline="central">70.8</text>
  <text class="dg-sub" x="172" y="138" text-anchor="middle" dominant-baseline="central">63.2</text>
  <text class="dg-sub" x="256" y="66" text-anchor="middle" dominant-baseline="central">93.3</text>
  <text class="dg-sub" x="312" y="67" text-anchor="middle" dominant-baseline="central">92.9</text>
  <text class="dg-sub" x="396" y="106" text-anchor="middle" dominant-baseline="central">76.5</text>
  <text class="dg-sub" x="452" y="84" text-anchor="middle" dominant-baseline="central">85.9</text>
  <text class="dg-sub" x="536" y="67" text-anchor="middle" dominant-baseline="central">92.9</text>
  <text class="dg-sub" x="592" y="111" text-anchor="middle" dominant-baseline="central">74.5</text>

  <text class="dg-sub" x="144" y="320" text-anchor="middle" dominant-baseline="central">SWE-bench</text>
  <text class="dg-sub" x="284" y="320" text-anchor="middle" dominant-baseline="central">AIME 2026</text>
  <text class="dg-sub" x="424" y="320" text-anchor="middle" dominant-baseline="central">MMLU-Pro</text>
  <text class="dg-sub" x="564" y="320" text-anchor="middle" dominant-baseline="central">Korean chat</text>
</svg>
```

## vs. Previous Gen / Competitors

Raon-1 mini is the Raon family's first general-purpose LLM, so there's no "previous generation" to compare against — the relevant comparison is other MoE models of similar size. Against Qwen3.6-35B-A3B, Raon-1 mini wins clearly on Korean conversation (92.9 vs. 74.5) and SWE-bench Verified (70.8 vs. 63.2), but trails on MMLU-Pro (76.5 vs. 85.9) and BFCL tool calling (59.8 vs. 64.7). That split suggests KRAFTON optimized training for Korean dialogue quality and software-engineering agent tasks rather than broad world-knowledge coverage.

On pricing, KRAFTON has gone fully open-weight plus a time-limited free playground, with no hosted API pricing announced — the reverse of how most closed-source labs operate (price first, open-source older versions later). It reads more like a one-time technical signal meant to win developer attention than an immediate monetization push.

What's arguably more notable is who released it: KRAFTON is a game studio, not a traditional AI lab, yet it chose to train a 30B-class MoE foundation model from scratch rather than simply calling or fine-tuning an existing open model. That suggests the bar for training your own foundation model has dropped low enough that a large company in a vertical industry like gaming now finds it worthwhile.

## What This Means for Agent Development

- If you're building a customer-support or in-game NPC dialogue agent that needs natural Korean: Raon-1 mini's lead on Korean benchmarks makes it one of the few open models explicitly tuned for Korean conversational tone, sparing you the work of forcing a larger model into the right register.
- If you're building an edge-deployed or self-hosted, low-latency agent: the NVFP4 build runs on a single RTX 5090, and DFlash2 speculative decoding adds up to 2.18x throughput — a good fit if you want to avoid cloud API dependency while keeping response times tight.
- Not a good fit: tasks that need broad world knowledge or complex multi-tool chains, where Raon-1 mini is the weakest in its class on both MMLU-Pro and BFCL. Use Qwen3.6-35B-A3B or a larger dense model there instead. And since this is still a preview, don't bet production workloads on specs or scores that may still change before the final release.

## Today's Takeaway

I used to assume the race to train foundation models from scratch was confined to traditional AI labs and Chinese vendors. A game studio training and open-sourcing a 30B-class MoE model — designing its own attention variant (Raon Delta Attention) and training it from the ground up, not just wrapping someone else's API — shows that the bar for "who gets to build foundation models" has dropped. Large companies in vertical industries can now step into this layer too, and apparently want to.

## References

- [KRAFTON/Raon-1-mini-preview (Hugging Face model card)](https://huggingface.co/KRAFTON/Raon-1-mini-preview)
- [KRAFTON AI official site](https://krafton.ai/en/)
- [Raon-1 mini playground](https://raon-mini.krafton.ai/en)
- [Seoul Economic Daily: Krafton Releases Raon-1 Mini, Its In-House AI Language Model](https://en.sedaily.com/technology/2026/10/21/krafton-releases-raon-1-mini-its-in-house-ai-language-model)
- [Digital Today: Krafton unveils 30B-class LLM 'Raon-1 Mini' to boost cost efficiency](https://www.digitaltoday.co.kr/en/view/117657/krafton-unveils-30b-class-llm-raon-1-mini-to-boost-cost-efficiency)
- [Seoul Economic Daily: Krafton Launches AI Model Brand 'Raon,' Releases Four Open-Source Models](https://en.sedaily.com/technology/2026/04/02/krafton-launches-ai-model-brand-raon-releases-four-open)
