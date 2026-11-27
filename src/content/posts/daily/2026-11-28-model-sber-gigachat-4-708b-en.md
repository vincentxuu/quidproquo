---
title: "Model Card: GigaChat 4 (708B-A41B)"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, sber, model-family-gigachat]
lang: en
description: "Sber open-sources its flagship GigaChat 4 under MIT — 708B parameters, a 1M-token context, and a single checkpoint that switches between instant and reasoning modes. It tops the comparison table on tool calling, but falls well behind DeepSeek on long-horizon software engineering."
tldr: "GigaChat 4 (ai-sage/GigaChat4-708B-A41B): Sber released it on 2026-11-26 under the MIT license — 708B total parameters, 41B active, a 1,048,576-token context, and instant/reasoning modes in one checkpoint. SWE-bench Verified hit 80.89% (up from 64.70%), and BFCL v4 tool calling hit 79.55%, the highest on the official comparison table — but DeepSWE scored only 35.40%, far behind DeepSeek 4.1's 74.34%."
series:
  name: "AI Model Tracker"
  order: 115
glossary:
  - term: "GigaChat"
    def: "A large language model family and chat-assistant brand from Sber, Russia's largest bank"
---

> :globe: [中文版](/posts/daily/2026-11-28-model-sber-gigachat-4-708b)

## Model Information

| Field | Value |
|---|---|
| Model ID | `ai-sage/GigaChat4-708B-A41B` |
| Vendor | Sber (Russia's largest bank, developer of GigaChat) |
| Parameters | 708B total, 41B active per token (MoE, 8 of 256 routed experts selected per token, plus 1 shared expert) |
| Context Window | 1,048,576 tokens |
| Input price (USD/1M tokens) | No official API price published — this release ships open weights only, and the current GigaChat API tariff table does not yet list a GigaChat 4 tier |
| Output price (USD/1M tokens) | No official API price published (same as above) |
| Open source | Yes (MIT License; the companion 37B-A4B model released at the same time uses a noncommercial individual license) |
| Release date | 2026-11-26 |
| Official announcement | [GigaChat 4 (Sber GigaChat Blog)](https://giga.chat/blog/en/posts/gigachat-4) |
| HuggingFace | [ai-sage/GigaChat4-708B-A41B](https://huggingface.co/ai-sage/GigaChat4-708B-A41B) |
| Family | GigaChat 4.x |

## Highlights

- One checkpoint now covers both instant and reasoning modes, selectable per request — the previous generation, GigaChat 3.5, needed two separate weight sets for the same split
- A 1,048,576-token context window built on a hybrid of Gated DeltaNet and DeepSeek Sparse Attention (DSA) layers at a 3:1 ratio; DSA attends to only 2,048 earlier tokens per query, balancing long-context recall against inference cost
- Tool calling (BFCL v4) scores 79.55, the highest of every model on the official comparison table, including DeepSeek V4.1, GLM-5.3, and Mistral 4 Large
- Two speculative-decoding paths: a recurrent MTP drafter that reuses a single prediction layer, and a separate 5-layer BF16 drafter (DFlash2); the official docs include integration examples for Pi, Codex CLI, and DeepSeek Harness

## Benchmark Results

| Benchmark | GigaChat 4 708B (reasoning mode) | GigaChat 3.5 Ultra 432B (previous gen) | Best competitor |
|---|---|---|---|
| SWE-bench Verified | 80.89% | 64.70% | GLM-5.3 86.67% |
| LiveCodeBench v6 | 88.82% | 85.40% | DeepSeek 4.1 1017 90.14% |
| Terminal-Bench 2.0 | 71.26% | 30.30% | Mistral 4 Large 77.78% |
| BFCL v4 (tool calling) | 79.55% | 58.59% | DeepSeek V4 Flash 0731 73.12% (GigaChat 4 is the table's highest) |
| DeepSWE (long-horizon SWE) | 35.40% | Not reported | DeepSeek 4.1 1017 74.34% |

These are Sber's own self-reported results; independent reproduction hasn't been published yet. DeepSWE is a clear weak point — Tech Times' coverage of the release specifically called out this gap against DeepSeek.

```diagram
title: GigaChat 4 vs. the previous generation, GigaChat 3.5 Ultra, on four key benchmarks
desc: GigaChat 4 beats the previous-generation GigaChat 3.5 Ultra on all four self-reported benchmarks shown, with the largest gain on Terminal-Bench 2.0 and the smallest on LiveCodeBench v6.
caption: Figures come from the Hugging Face model card for ai-sage/GigaChat4-708B-A41B (reasoning mode). x-coordinate = 200 + score(%) × 4, so 0% maps to x=200 and 100% to x=600. Rows are sorted by the size of the gain from 3.5 Ultra to 4, largest first.
---
<svg viewBox="0 0 680 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">Terminal-Bench 2.0</text>
  <line class="dg-axis" x1="321" y1="90" x2="485" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="321" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="485" cy="90" r="6"/>
  <text class="dg-sub" x="309" y="90" text-anchor="end" dominant-baseline="central">30.3%</text>
  <text class="dg-label dg-text--accent" x="497" y="90" text-anchor="start" dominant-baseline="central">71.3%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">BFCL v4 (tools)</text>
  <line class="dg-axis" x1="434" y1="170" x2="518" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="434" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="518" cy="170" r="6"/>
  <text class="dg-sub" x="422" y="170" text-anchor="end" dominant-baseline="central">58.6%</text>
  <text class="dg-label dg-text--accent" x="530" y="170" text-anchor="start" dominant-baseline="central">79.6%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">SWE-bench Verified</text>
  <line class="dg-axis" x1="459" y1="250" x2="524" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="459" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="524" cy="250" r="6"/>
  <text class="dg-sub" x="447" y="250" text-anchor="end" dominant-baseline="central">64.7%</text>
  <text class="dg-label dg-text--accent" x="536" y="250" text-anchor="start" dominant-baseline="central">80.9%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">LiveCodeBench v6</text>
  <line class="dg-axis" x1="542" y1="330" x2="555" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="542" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="555" cy="330" r="6"/>
  <text class="dg-sub" x="530" y="330" text-anchor="end" dominant-baseline="central">85.4%</text>
  <text class="dg-label dg-text--accent" x="567" y="330" text-anchor="start" dominant-baseline="central">88.8%</text>

  <line class="dg-rule" x1="20" y1="356" x2="660" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">Legend</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">GigaChat 3.5 Ultra</text>
  <circle class="dg-point dg-c-accent" cx="330" cy="382" r="6"/>
  <text class="dg-small" x="346" y="382" dominant-baseline="central">GigaChat 4</text>
</svg>
```

## Vs. the Previous Generation and Competitors

Against GigaChat 3.5 Ultra, Terminal-Bench 2.0 jumped from 30.30% to 71.26% — the largest gain in the official table, pointing to a big improvement in multi-step terminal task execution. Tool calling (BFCL v4) also climbed from 58.59% to 79.55%, overtaking every competitor on the table, including DeepSeek 4.1, GLM-5.3, and Mistral 4 Large.

Against open-weight competitors released around the same time, GigaChat 4's code generation (LiveCodeBench, SWE-bench Verified) sits between DeepSeek 4.1 and GLM-5.3 — not the strongest. But on long-horizon software engineering (DeepSWE), it scores only 35.40%, far behind DeepSeek 4.1's 74.34%. Tech Times' coverage specifically flagged this gap, a useful reminder that a headline "1M context" number doesn't mean a model is strong at every long-horizon task.

On pricing strategy, Sber released its 708B flagship entirely under MIT while restricting the smaller 37B-A4B to a noncommercial individual license — the reverse of the usual playbook where vendors open-source the small model to build a developer ecosystem and charge for the flagship. This suggests Sber wants the flagship to win developer mindshare first, while keeping monetization on its existing GigaChat API (billed per character).

## What This Means for Agent Development

GigaChat 4 turns the instant-vs-reasoning choice from a deployment-time decision (two separate weight sets) into a per-request decision (one checkpoint). For an agent system that needs to handle both real-time customer support and deep analysis, this can remove the cost of maintaining two separate models.

- If you're building an agent that makes heavy use of tool calls: BFCL v4's 79.55% is the highest published score on the comparison table, and the official docs give ready-made integration examples for Pi, Codex CLI, and DeepSeek Harness, so the integration cost is low
- If you're building long-horizon automation (multi-step debugging, cross-file refactors): DeepSWE's 35.40% is clearly weak here; DeepSeek 4.1 or GLM-5.3 are still the more reliable choice for this class of task
- Not a fit for small or mid-sized teams running their own infrastructure: the FP8 version needs at least two nodes of 8×H100 80GB each (TP16) to deploy, which assumes a team with large-scale inference infrastructure already in place

## Today's Takeaway

Most vendors' open-source playbook is "open-source the small model to build an ecosystem, charge for the flagship." GigaChat 4 does the opposite: the 708B flagship is fully open under MIT, while the 37B model is the one restricted to noncommercial use. It's a reminder that "how open a model is" and "how a company plans to make money from it" aren't necessarily tied together — openness is more about which part of the ecosystem a company is trying to win right now, not simply a function of how large the model is.

## References

- [GigaChat 4 (Sber GigaChat official blog)](https://giga.chat/blog/en/posts/gigachat-4)
- [ai-sage/GigaChat4-708B-A41B (Hugging Face model card)](https://huggingface.co/ai-sage/GigaChat4-708B-A41B)
- [Sber releases GigaChat 4 as open weights (Little Wolf Labs)](https://news.littlewolflabs.com/posts/2026-11-26-gigachat-4-open-weights)
- [Sber Releases GigaChat 4 With 1M-Token Window but Lists 35% on Coding Test Where DeepSeek Gets 74% (Tech Times)](https://techtimes.com/articles/331654/20261127/sber-releases-gigachat-4-1m-token-window-lists-35-coding-test-where-deepseek-gets-74.htm)
- [Sber GigaChat 4: agentic models, open weights and licenses (Magica)](https://magica.com/news/sber-gigachat-4-agentic-models-open-weights-split-licenses)
