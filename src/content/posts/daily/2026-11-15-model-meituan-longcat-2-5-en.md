---
title: "Model Card｜LongCat-2.5"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, model-release, daily, meituan, model-family-longcat]
lang: en
description: "Meituan ships LongCat-2.5 — a 1.6T MoE model that folds vision into the same token stream, with agentic RL pushing DeepSWE from 9.7% to 64.6% — then reverses course a week later and ships MIT weights"
tldr: "LongCat-2.5: 1.6T total parameters, ~48B active per token, 1M context, API pricing input $0.30 / output $1.20 per 1M tokens; DeepSWE v1.1 jumps from predecessor LongCat-2.0's 9.7% to 64.6%, BrowseComp hits 91.9% — the highest in the comparison set; native visual tokens folded into the backbone enable 'visual coding'"
series:
  name: "AI Model Tracker"
  order: 73
glossary:
  - term: "LongCat"
    def: "Meituan's open-weight agentic model family, known for dynamic MoE routing and long-context support"
---

> 🌏 [中文版](/posts/daily/2026-11-15-model-meituan-longcat-2-5)

## Model Information

| Field | Value |
|---|---|
| Model ID | `LongCat-2.5` |
| Vendor | Meituan / LongCat team |
| Parameters | 1.6T total, ~48B active per token (MoE) |
| Context Window | 1,000,000 tokens |
| Input pricing (USD/1M tokens) | $0.30 (limited-time price, uncached; cached input $0.006) |
| Output pricing (USD/1M tokens) | $1.20 |
| Open source | Yes (MIT — weights shipped a week after the announcement) |
| Release date | 2026-11-01 (announced / API live), 2026-11-09 (weights released) |
| Official announcement | [LongCat-2.5 Blog](https://longcat.ai/blog/longcat-2.5/) |
| HuggingFace | [meituan-longcat/LongCat-2.5](https://huggingface.co/meituan-longcat/LongCat-2.5) |
| Family | LongCat 2.x |

## Highlights

- DeepSWE v1.1 jumps from predecessor LongCat-2.0's 9.7% to 64.6% (+54.9 points), Terminal Bench v4.0 goes from 3.0% to 38.5%, and PaperBench goes from 45.2% to 82.1% — the team attributes this to a step change from scaling agentic RL, not incremental gains from more pretraining data
- BrowseComp hits 91.9%, the highest score in the entire comparison set (which includes Claude Opus 5, GPT-5.6-Sol, and DeepSeek-V4.1-Flash)
- Visual input is folded directly into the same 1.6T MoE backbone: images are converted to discrete tokens via residual vector quantization (RVQ) and share the same token stream and training objective as text, with no separate vision-encoder adapter — the team calls this "visual coding": reading a screenshot, UI, or chart and writing code in the same reasoning loop
- W4A4 quantization (4-bit weights and activations) lifts decode throughput 42.77% over a W8A8 baseline, enabling training and inference on domestic AI accelerators with under 80GB of memory per card

## Benchmark Results

| Benchmark | Score | Predecessor (LongCat-2.0) | Best competitor |
|---|---|---|---|
| Terminal Bench v2.1 | 88.4 | 70.8 | DeepSeek-V4.1-Flash: 90.6 |
| DeepSWE v1.1 | 64.6 | 9.7 | DeepSeek-V4.1-Flash: 74.2 |
| PaperBench | 82.1 | 45.2 | GPT-5.6-Sol: 83.3 |
| HLE (with tools) | 63.1 | 37.5 | Claude-Opus-5: 64.7 |
| BrowseComp | 91.9 | 79.9 | DeepSeek-V4.1-Flash: 91.5 (LongCat-2.5 is the highest overall) |

⚠️ LongCat-2.5/LongCat-2.0 scores are self-reported by Meituan. Competitor scores come from the official release: some are cited from public technical reports or official leaderboards (marked `*` in the source), others are run in-house by the LongCat team and are indicative only (unmarked in the source). No independent external reproduction has appeared yet.

## Comparison with Predecessor/Competitors

Against LongCat-2.0, the biggest gains cluster in agentic RL tasks: DeepSWE v1.1, Terminal Bench v4.0, and PaperBench all jump several-fold to more than tenfold, not single-digit-percentage tweaks. The team's own explanation is a step change from scaling long-horizon agentic RL across four axes at once — data, environments, algorithms, and harnesses — rather than simply adding more pretraining data.

```diagram
title: LongCat-2.5 vs. LongCat-2.0 on three agentic benchmarks
desc: LongCat-2.5 jumps several-fold to more than tenfold over predecessor LongCat-2.0 on DeepSWE v1.1, Terminal Bench v4.0, and PaperBench
caption: Source — LongCat-2.5 Hugging Face model card official evaluation table (2026-11). Scale: baseline x=200, 4 units per point (x = 200 + score × 4), horizontal axis starts at 0.
---
<svg viewBox="0 0 640 300">
  <text class="dg-small" x="20" y="20" dominant-baseline="central">Score (%)</text>

  <line class="dg-grid" x1="400" y1="50" x2="400" y2="280"/>
  <line class="dg-grid" x1="600" y1="50" x2="600" y2="280"/>
  <text class="dg-small" x="400" y="34" text-anchor="middle">50</text>
  <text class="dg-small" x="600" y="34" text-anchor="middle">100</text>
  <line class="dg-axis" x1="200" y1="50" x2="200" y2="280"/>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="200" y="56" width="39" height="24"/>
    <rect class="dg-bar dg-bar--soft" x="200" y="134" width="12" height="24"/>
    <rect class="dg-bar dg-bar--soft" x="200" y="212" width="181" height="24"/>
  </g>
  <g class="dg-c-accent">
    <rect class="dg-bar" x="200" y="86" width="258" height="24"/>
    <rect class="dg-bar" x="200" y="164" width="154" height="24"/>
    <rect class="dg-bar" x="200" y="242" width="328" height="24"/>
  </g>

  <text class="dg-sub" x="247" y="68" dominant-baseline="central">9.7 LongCat-2.0</text>
  <text class="dg-label dg-text--accent" x="466" y="98" dominant-baseline="central">64.6 LongCat-2.5</text>
  <text class="dg-sub" x="220" y="146" dominant-baseline="central">3.0</text>
  <text class="dg-label dg-text--accent" x="362" y="176" dominant-baseline="central">38.5</text>
  <text class="dg-sub" x="389" y="224" dominant-baseline="central">45.2</text>
  <text class="dg-label dg-text--accent" x="536" y="254" dominant-baseline="central">82.1</text>

  <text class="dg-label" x="192" y="83" text-anchor="end" dominant-baseline="central">DeepSWE v1.1</text>
  <text class="dg-label" x="192" y="161" text-anchor="end" dominant-baseline="central">Terminal Bench v4.0</text>
  <text class="dg-label" x="192" y="239" text-anchor="end" dominant-baseline="central">PaperBench</text>
</svg>
```

Against competitors, LongCat-2.5 leads on BrowseComp (91.9%, highest overall) and AutomationBench, but still trails Claude Opus 5 by a meaningful margin on the hardest repo-scale engineering tasks: Terminal Bench v4.0 (38.5 vs. 53.9, a 15.4-point gap) and NL2Repo (60.5 vs. 75.3, nearly 15 points). DeepSeek-V4.1-Flash beats LongCat-2.5 on DeepSWE v1.1 and Terminal Bench v2.1. On pure vision benchmarks, LongCat-2.5 is mid-pack: VideoMME scores 85.2 against Kimi-K3's 90.0. The team's own conclusion: a strong all-round agentic model with a distinctive visual-coding edge, but not yet the top performer on the frontier's hardest engineering tasks.

On pricing, input $0.30 / output $1.20 per 1M tokens (limited-time price), with cached input at just $0.006, puts LongCat-2.5 in a low-to-mid price tier similar to DeepSeek-V4.1-Flash, and clearly cheaper than Claude Opus 5 or GPT-5.6-Sol. The API is compatible with both OpenAI and Anthropic request formats, so it plugs directly into existing harnesses like Claude Code, Codex, and OpenCode — a low-risk entry point for teams who want to try a Chinese frontier model.

## Implications for Agent Development

Folding visual understanding into the same token stream means an agent can read a screenshot, a chart, or a rendered result and act on it inside the same reasoning loop that writes code. The team's own t-SNE visualization on a smaller probe model shows visual and text embeddings genuinely interwoven in a shared semantic space, not two systems bolted together.

- If you're building agents that need to "look at the screen, then write code" (frontend debugging, visual acceptance loops, screenshot-to-code): LongCat-2.5 skips the engineering cost of a separate vision-encoder adapter — you can run the full loop on one model
- If you're building long-horizon agents whose output needs to be "seen through to completion" (3D scene generation, interactive web pages, data-reconciliation reports): the team's own demos (fluid simulation, 3D showcase, city diorama) show this is a deliberate training direction, not an incidental capability
- Not a fit: engineering tasks with very large repos or extremely complex multi-step work — LongCat-2.5 still trails Claude Opus 5 by a meaningful margin on Terminal Bench v4.0 and NL2Repo, so Opus 5 remains the steadier choice for now. Also not a fit for teams planning long-term around self-hosted open weights — the announcement explicitly said "no open-weight release has been announced," only to reverse course a week later and ship MIT weights; that commitment itself is not stable

## Today's Takeaway

I used to think "folding multimodality into the backbone" was just an engineering choice to skip an adapter. But LongCat-2.5's t-SNE visualization shows visual and text embeddings actually land in the same semantic space — meaning an agent reading a screen and an agent reading a document run on the same reasoning, not two bolted-together systems. The other cognitive diff: open weights aren't a commitment you can take at face value on announcement day. LongCat-2.5 explicitly said "no open-weight release has been announced," then reversed and shipped MIT weights a week later — when tracking open-weight models, the license statement on launch day isn't the final answer.

## References

- [LongCat-2.5 official tech blog](https://longcat.ai/blog/longcat-2.5/)
- [LongCat-2.5 Hugging Face model card with full benchmark table](https://huggingface.co/meituan-longcat/LongCat-2.5)
- [Meituan LongCat's official account announces MIT-licensed weights](https://x.com/Meituan_LongCat/status/2119793531393040462)
- [LongCat-2.5 technical breakdown — LongCat AI](https://www.longcatai.org/news/longcat-2-5)
- [LongCat-2.5 benchmarks, pricing & context window — LLM Stats](https://llm-stats.com/models/longcat-2.5)
- [Meituan Releases LongCat 2.5 on Chinese Chips — Tech Times](https://www.techtimes.com/articles/329925/20261103/meituan-releases-longcat-25-chinese-chips-benchmark-claims-await-independent-tests.htm)
