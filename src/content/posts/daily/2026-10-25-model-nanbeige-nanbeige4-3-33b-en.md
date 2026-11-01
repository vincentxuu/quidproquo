---
title: "Model Card: Nanbeige4.3-33B"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, nanbeige, model-family-nanbeige]
lang: en
description: "Nanbeige, the AI team under Kanzhun (parent of Chinese job app BOSS直聘), open-sourced a 33.1B dense model — 512K context, Apache 2.0, beats Qwen3.8-27B on several agentic coding benchmarks, and is explicitly positioned as a teacher model for distilling smaller models later"
tldr: "Nanbeige4.3-33B: a 33.1B dense model open-sourced by Nanbeige, the AI team under Kanzhun (parent company of Chinese job app BOSS直聘), with a 524,288-token (512K) context window under Apache 2.0. It scores 80.9 on Terminal-Bench 2.1 (vs. Qwen3.8-27B's 73.0), 65.5 on DeepSWE (vs. 42.5), and 44.8 on JobBench (vs. 34.5), but trails Qwen3.8-27B on SWE-Bench Pro (60.3 vs. 61.7) and Gemma4-31B on GPQA Diamond (89.5 vs. 91.3). There's no official API pricing — it's open weights only. Nanbeige positions it as the flagship teacher model for the Nanbeige4.3 series, meant to distill smaller models such as Nanbeige4.3-3B down the line."
series:
  name: "AI Model Tracker"
  order: 58
glossary:
  - term: "Nanbeige"
    def: "The open-model team under Kanzhun Limited, parent company of the Chinese job-search app BOSS直聘; previously focused on 3B-class models, with Nanbeige4.3-33B as its first 30B-class flagship"
---

> 🌏 [中文版](/posts/daily/2026-10-25-model-nanbeige-nanbeige4-3-33b)

## Model Info

| Item | Value |
|---|---|
| Model ID | `Nanbeige/Nanbeige4.3-33B` |
| Vendor | Nanbeige (AI team under Kanzhun Limited, parent of job-search app BOSS直聘) |
| Parameters | 33.1B (dense, no MoE) |
| Context Window | 524,288 tokens (512K) |
| Input Pricing (USD/1M tokens) | Not available (open weights only, no official hosted API) |
| Output Pricing (USD/1M tokens) | Not available (same as above) |
| Open Source | Yes (Apache 2.0) |
| Release Date | 2026-10-24 |
| Official Announcement | [Nanbeige/Nanbeige4.3-33B (Hugging Face model card)](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) |
| Hugging Face | [Nanbeige/Nanbeige4.3-33B](https://huggingface.co/Nanbeige/Nanbeige4.3-33B) |
| Family | Nanbeige 4.x (previously 3B-class models like Nanbeige4.2-3B; 4.3-33B is the series' first 30B-class flagship) |

## Key Capabilities

- **Large lead on agentic coding benchmarks**: Terminal-Bench 2.1 hits 80.9 (vs. Qwen3.8-27B 73.0, Muse-Glimmer-30B 61.8, Gemma4-31B 47.2), and DeepSWE hits 65.5 (vs. Qwen3.8-27B's 42.5)
- **Ahead across 35 occupations on cowork tasks**: on the internal JobBench suite spanning 35 occupations, it beats the baseline in most of them, scoring 44.8 overall vs. Qwen3.8-27B's 34.5
- **Native 512K context**: 524,288 tokens; Nanbeige recommends `preserve_thinking=true` for agentic and tool-use scenarios to retain multi-turn reasoning traces
- **Explicitly positioned as a "teacher model"**: Nanbeige states the Nanbeige4.3 strategy is to first train a high-capacity teacher, then distill it into smaller models (such as the upcoming Nanbeige4.3-3B) — this 33B release is not meant to be an end product on its own

## Benchmark Results

| Benchmark | Score | Previous Gen | Strongest ~30B-class Competitor |
|---|---|---|---|
| Terminal-Bench 2.1 (agentic coding) | 80.9 | —(first 30B-class flagship) | Qwen3.8-27B 73.0 |
| DeepSWE | 65.5 | —(first 30B-class flagship) | Qwen3.8-27B 42.5 |
| SWE-Bench Pro | 60.3 | —(first 30B-class flagship) | Qwen3.8-27B **61.7** (Nanbeige trails) |
| JobBench (cowork, 35 occupations) | 44.8 | —(first 30B-class flagship) | Qwen3.8-27B 34.5 |
| GPQA Diamond (reasoning) | 89.5 | —(first 30B-class flagship) | Gemma4-31B **91.3** (Nanbeige trails) |

```diagram
title: Nanbeige4.3-33B vs. Qwen3.8-27B on four agentic benchmarks
desc: Nanbeige4.3-33B leads Qwen3.8-27B by a wide margin on Terminal-Bench 2.1, DeepSWE, and JobBench, but trails slightly on SWE-Bench Pro.
caption: Source: Nanbeige's official self-reported scores on its Hugging Face model card; see the card's footnotes for judge models and tooling used per benchmark. Not yet independently reproduced. Y-axis 0–100, baseline at y=300, plot top at y=60, 2.4 units per point (y = 300 − score × 2.4).
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
    <rect class="dg-bar" x="94" y="106" width="44" height="194"/>
    <rect class="dg-bar" x="234" y="143" width="44" height="157"/>
    <rect class="dg-bar" x="374" y="155" width="44" height="145"/>
    <rect class="dg-bar" x="514" y="192" width="44" height="108"/>
    <text class="dg-text--series" x="116" y="44" text-anchor="middle" dominant-baseline="central">Nanbeige4.3-33B</text>
  </g>
  <g class="dg-c-s1">
    <rect class="dg-bar" x="150" y="125" width="44" height="175"/>
    <rect class="dg-bar" x="290" y="198" width="44" height="102"/>
    <rect class="dg-bar" x="430" y="152" width="44" height="148"/>
    <rect class="dg-bar" x="570" y="217" width="44" height="83"/>
    <text class="dg-text--series" x="172" y="44" text-anchor="middle" dominant-baseline="central">Qwen3.8-27B</text>
  </g>

  <text class="dg-sub" x="116" y="96" text-anchor="middle" dominant-baseline="central">80.9</text>
  <text class="dg-sub" x="172" y="115" text-anchor="middle" dominant-baseline="central">73.0</text>
  <text class="dg-sub" x="256" y="133" text-anchor="middle" dominant-baseline="central">65.5</text>
  <text class="dg-sub" x="312" y="188" text-anchor="middle" dominant-baseline="central">42.5</text>
  <text class="dg-sub" x="396" y="145" text-anchor="middle" dominant-baseline="central">60.3</text>
  <text class="dg-sub" x="452" y="142" text-anchor="middle" dominant-baseline="central">61.7</text>
  <text class="dg-sub" x="536" y="182" text-anchor="middle" dominant-baseline="central">44.8</text>
  <text class="dg-sub" x="592" y="207" text-anchor="middle" dominant-baseline="central">34.5</text>

  <text class="dg-sub" x="144" y="320" text-anchor="middle" dominant-baseline="central">Terminal-Bench 2.1</text>
  <text class="dg-sub" x="284" y="320" text-anchor="middle" dominant-baseline="central">DeepSWE</text>
  <text class="dg-sub" x="424" y="320" text-anchor="middle" dominant-baseline="central">SWE-Bench Pro</text>
  <text class="dg-sub" x="564" y="320" text-anchor="middle" dominant-baseline="central">JobBench</text>
</svg>
```

⚠️ All scores above are Nanbeige's own self-reported results. The model card's footnotes note that some benchmarks used GPT-6 Sol or Claude Code as judge/harness; none have been independently reproduced yet.

## Comparison with Prior Gen / Competitors

Nanbeige4.3-33B is the series' first 30B-class model — Nanbeige's earlier public releases topped out at 3B (like Nanbeige4.2-3B), so there's no real "previous generation" to compare against. The only meaningful comparison is with similarly-sized competitors: Qwen3.8-27B, Muse-Glimmer-30B, and Gemma4-31B.

Against Qwen3.8-27B, Nanbeige4.3-33B wins clearly on agent-leaning tasks: Terminal-Bench 2.1 (80.9 vs. 73.0), DeepSWE (65.5 vs. 42.5), and JobBench (44.8 vs. 34.5) are all large leads, suggesting it's tuned more deeply for long-horizon coding and multi-step, multi-tool cowork tasks. But it trails slightly on SWE-Bench Pro (60.3 vs. 61.7) and GDPval (84.8 vs. 86.4), and isn't the strongest on GPQA Diamond either (89.5 vs. Gemma4-31B's 91.3) — suggesting it traded some general-knowledge breadth for depth in agentic coding.

There's no mystery on pricing: it's open weights only, with no official hosted API — the opposite order from most closed-source vendors, who typically price a model first and open-source older versions later. Nanbeige frames this release as a "teacher model" rather than an end product; the real commercial intent is to use it to distill smaller models like Nanbeige4.3-3B down the line. The 33B model itself is more of a stepping stone than a bid to take market share from Qwen3.8-27B.

## What This Means for Agent Development

The biggest signal from Nanbeige4.3-33B isn't the scores themselves — it's the explicitly stated "train a big teacher first, then distill smaller students" size-ladder strategy. If you're tracking the capability ceiling for small (3B-class) agent models, what's actually worth watching next isn't the 33B model itself, but the Nanbeige4.3-3B distilled from it: a stronger teacher raises the plausible ceiling for the distilled student.

- If you're building a self-hosted, single-GPU-friendly coding agent: a 33.1B dense model deploys more easily than 70B+ models, and the large leads on Terminal-Bench 2.1 and DeepSWE suggest it may be more reliable than Qwen3.8-27B for multi-step debugging and terminal operations — worth benchmarking directly against your own workload.
- If you're building a general assistant that needs broad world knowledge: GPQA Diamond and SWE-Bench Pro aren't its strongest suits, so Qwen3.8-27B or Gemma4-31B may be steadier choices there.
- If you're waiting on a small (3B-class) distilled version: watch this 33B teacher's scores now, then evaluate how much capability the eventual Nanbeige4.3-3B inherits — distillation quality is capped by the teacher, and this teacher's scores are unusually well-documented as a reference point.
- Not a fit: production environments that need an official SLA or hosted API — right now there's only open weights, no official hosted service at all.

## Today's Takeaway

I used to assume small-model distillation always meant "borrow the best existing large model and extract what you need." Nanbeige4.3 flips that: train a brand-new, purpose-built high-capacity teacher first, then distill the later small-model series from it. That means the ceiling for a distillation chain isn't capped by "whichever large model you can borrow" — it's capped by whether a lab is willing and able to invest in building that teacher layer themselves. The 33B flagship's whole reason for existing is to let the later 3B model distill to a higher ceiling.

## References

- [Nanbeige/Nanbeige4.3-33B (Hugging Face model card)](https://huggingface.co/Nanbeige/Nanbeige4.3-33B)
- [explainx.ai: Nanbeige4.3-33B — Open Apache 2.0 Agent Model Tested Against Qwen3.8-27B](https://explainx.ai/blog/nanbeige-4-3-33b-open-agentic-model-guide-2026)
- [pasqualepillitteri.it: Nanbeige4.3-33B arrives open source and takes on Qwen3.8-27B in coding](https://pasqualepillitteri.it/en/news/27138/nanbeige-4-3-33b-open-source-en)
- [Nanbeige/Nanbeige4.2-3B (Hugging Face, prior small-model reference)](https://huggingface.co/Nanbeige/Nanbeige4.2-3B)
