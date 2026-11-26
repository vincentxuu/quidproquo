---
title: "Model Card: ERNIE 5.5 Flash Preview"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-ernie]
lang: en
description: "Baidu open-sources ERNIE 5.5 Flash Preview: a 280B-parameter MoE with 1M context and a speculative-decoding draft head, DSpark, baked right into the released weights — it matches or beats Claude Opus 5.5 on office-automation and multi-tool benchmarks, but trails clearly on general knowledge reasoning"
tldr: "ERNIE 5.5 Flash Preview (baidu/ERNIE-5.5-Flash-Preview, weights open-sourced 2026-11-24; API live on Baidu Qianfan since 2026-11-11): 280B total / 14B active parameters (MoE), 1M-token context, Apache 2.0; international pricing is $0.28 input / $1.13 output per 1M tokens; its DSpark speculative-decoding draft head ships inside the released weights, and a lightweight indexer gives a further 40% speedup at 1M-token context. It beats Claude Opus 5.5 on two agent/office-automation benchmarks — MCP-Atlas (84.6) and AutomationBench (61.9) — but trails by 15 points on HLE, suggesting post-training leans hard toward office and multi-tool agent work rather than general knowledge."
series:
  name: "AI Model Tracker"
  order: 82
glossary:
  - term: "ERNIE"
    def: "Baidu's large language model family, known in Chinese as Wenxin (文心)"
  - term: "DSpark"
    def: "The speculative-decoding draft head built into the ERNIE 5.5 Flash series — it proposes a whole block of candidate tokens in parallel for the main model to verify, and is quantized and trained alongside the main model, then kept in sync through ongoing online distillation"
---

> :globe: [中文版](/posts/daily/2026-11-25-model-baidu-ernie-5-5-flash-preview)

## Model Info

| Field | Value |
|---|---|
| Model ID | `baidu/ERNIE-5.5-Flash-Preview` (also shipped as `-FP8` and `-BF16` weight variants; Qianfan model-center ID `am-abe18d298d70`) |
| Vendor | Baidu (ERNIE team) |
| Parameters | 280B total, 14B active per token (MoE, 512 routed experts top-10 + 1 shared expert) |
| Context Window | 1,048,576 tokens (1M; extended from a 128K training context) |
| Input Price (USD/1M tokens) | $0.28 (cache hit $0.028) |
| Output Price (USD/1M tokens) | $1.13 |
| Open Source | Yes (Apache License 2.0, covers the Preview weights only; the base model, ERNIE-5.5-Flash-Base, ships under its own separate license) |
| Release Date | 2026-11-24 (weights open-sourced on Hugging Face); API live on Baidu Qianfan since 2026-11-11 |
| Official Announcement | [ERNIE Blog: Introducing ERNIE 5.5 Flash Preview](https://ernie.baidu.com/release/ernie-5-5-flash-preview) |
| Hugging Face | [baidu/ERNIE-5.5-Flash-Preview](https://huggingface.co/baidu/ERNIE-5.5-Flash-Preview) |
| Family | ERNIE 5.5 Flash (base model ERNIE-5.5-Flash-Base released 2026-11-05; Preview is the series' first post-trained checkpoint) |

## Capability Highlights

- **MCP-Atlas (multi-tool coordination): 84.6**, edging out Claude Opus 5.5's 84.2 — the highest score among the six models Baidu compared
- **AutomationBench (office automation): 61.9**, also the highest of the six, ahead of Claude Opus 5.5's 58.0 (Baidu's own evaluation)
- **The DSpark speculative-decoding draft head ships inside the released weights**, not as a bolted-on side model: it goes through W4A8 quantization-aware training alongside the main model and gets its acceptance rate tuned continuously through online distillation. Paired with a lightweight indexer's head-routing and threshold pre-filtering, it delivers a further 40% speedup at 1M-token context
- A single **11-hour continuous coding task** that wrote a complete third-person wuxia game, *Yunxiu Xing*, in C++ on Unreal Engine 5.8 — a demonstration of long-horizon autonomous iteration and debugging

## Benchmark Results

| Benchmark | ERNIE 5.5 Flash Preview | Predecessor | Best Competitor |
|---|---|---|---|
| MCP-Atlas (multi-tool coordination) | 84.6 | None (first post-trained release in the ERNIE 5.5 series) | Claude Opus 5.5　84.2 |
| AutomationBench (office automation) | 61.9 | None | DeepSeek-V4.1-Flash-1017　60.5 / 60.5* (Baidu's own eval) |
| OfficeQA Pro V2 (office document QA) | 67.9 | None | GPT-6.1 Sol　70.0* (Baidu's own eval) |
| BrowseComp (web research) | 87.4 | None | Hy4　91.8* (Tencent Hunyuan, Baidu's own eval) |
| HLE (no tools, general knowledge reasoning) | 46.4 | None | Claude Opus 5.5　61.4 |

:warning: Every ERNIE 5.5 Flash Preview score in this table is Baidu's own evaluation. Competitor scores marked `*` are also Baidu's own runs; unmarked competitor scores are taken from that vendor's official release or the Artificial Analysis leaderboard. No independent lab has reproduced this table yet. Baidu's own model card states Preview "is an intermediate checkpoint from post-training," so these numbers may still move before an official release.

```diagram
title: ERNIE 5.5 Flash Preview vs. Claude Opus 5.5 on four benchmarks
desc: ERNIE 5.5 Flash Preview leads on agent and office-automation benchmarks (AutomationBench, OfficeQA Pro V2), but trails far behind on open-domain knowledge reasoning (HLE) — a pattern consistent with post-training aimed at agent and office work rather than general knowledge.
caption: Figures are from Baidu's official ERNIE model card; Claude Opus 5.5 scores marked * are Baidu's own evaluations, not Anthropic's official numbers. x-position = 200 + score(%) × 4, so 0% maps to x=200 and 100% to x=600.
---
<svg viewBox="0 0 640 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">AutomationBench</text>
  <line class="dg-axis" x1="432" y1="90" x2="448" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="432" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="448" cy="90" r="6"/>
  <text class="dg-sub" x="420" y="90" text-anchor="end" dominant-baseline="central">58.0%*</text>
  <text class="dg-label dg-text--accent" x="460" y="90" text-anchor="start" dominant-baseline="central">61.9%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">OfficeQA Pro V2</text>
  <line class="dg-axis" x1="449" y1="170" x2="472" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="449" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="472" cy="170" r="6"/>
  <text class="dg-sub" x="437" y="170" text-anchor="end" dominant-baseline="central">62.2%</text>
  <text class="dg-label dg-text--accent" x="484" y="170" text-anchor="start" dominant-baseline="central">67.9%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">BrowseComp</text>
  <line class="dg-axis" x1="550" y1="250" x2="563" y2="250"/>
  <circle class="dg-point dg-c-accent" cx="550" cy="250" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="563" cy="250" r="6"/>
  <text class="dg-label dg-text--accent" x="538" y="250" text-anchor="end" dominant-baseline="central">87.4%</text>
  <text class="dg-sub" x="575" y="250" text-anchor="start" dominant-baseline="central">90.8%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">HLE (no tools)</text>
  <line class="dg-axis" x1="386" y1="330" x2="446" y2="330"/>
  <circle class="dg-point dg-c-accent" cx="386" cy="330" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="446" cy="330" r="6"/>
  <text class="dg-label dg-text--accent" x="374" y="330" text-anchor="end" dominant-baseline="central">46.4%</text>
  <text class="dg-sub" x="458" y="330" text-anchor="start" dominant-baseline="central">61.4%</text>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">Legend</text>
  <circle class="dg-point dg-c-accent" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">ERNIE 5.5 Flash Preview</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="360" cy="382" r="6"/>
  <text class="dg-small" x="376" y="382" dominant-baseline="central">Claude Opus 5.5</text>
</svg>
```

## Versus Predecessor and Competitors

This is the first post-trained release in the ERNIE 5.5 series, so there's no direct predecessor to compare against. But the base model, ERNIE-5.5-Flash-Base (released 2026-11-05), already led same-size open base models on base-to-base evaluations: 78.4 on MMLU-Pro versus DeepSeek V4 Flash Base's 69.2, and 82.3 on HumanEval+ versus 69.5 — gaps of 9 to 13 points. Preview is the result of mid-training (extending context from 128K to 1M) and post-training on top of that base.

Against today's frontier models, the pattern is clear. On vertical agent tasks — multi-tool coordination (MCP-Atlas: 84.6, just ahead of Claude Opus 5.5's 84.2) and office automation (AutomationBench: 61.9, nearly 4 points ahead of Claude Opus 5.5) — it matches or edges out the top models. But on open-domain knowledge reasoning without tools (HLE), it scores only 46.4 against Claude Opus 5.5's 61.4, a 15-point gap, and trails by almost 37 points on AA-Omniscience. The post-training data clearly leans toward office and agent work rather than broad general knowledge.

The pricing strategy follows the same logic: Baidu Qianfan's international pricing is $0.28 input / $1.13 output per 1M tokens — a fraction of what flagship models like Claude Opus 5.5 or GPT-6.1 Sol charge (typically $3-8 input / $15-40 output). This is a "good enough for agent work, as cheap as possible" play, not a direct challenge to the top models' general intelligence ceiling.

## What This Means for Agent Development

Baking the DSpark speculative-decoding head directly into the released weights has a real engineering payoff for long-running agent loops: you don't need to separately train, deploy, and maintain an independent draft model — the official vLLM/SGLang deployment scripts turn it on with a single `--speculative-algorithm DSPARK` flag. And because DSpark is quantized and trained together with the main model, then kept aligned through ongoing online distillation, its speedup doesn't degrade as the main model gets updated — a pain point that's common when the community bolts an external small model on as a draft model.

- If you're building vertical agents for document processing, spreadsheet repair, or cross-app automation: the lead on AutomationBench and OfficeQA Pro V2 shows this direction was deliberately trained for, and the 40% speedup at 1M-token context from the sparse indexer makes it worth putting on your shortlist.
- If you're building multi-step agents that need heavy cross-tool coordination: MCP-Atlas's 84.6 matches or slightly beats Claude Opus 5.5, at a fraction of the per-token price — a strong candidate for cost-sensitive deployments.
- Not a fit: scenarios that need broad open-domain knowledge or hard reasoning (it trails clearly on both HLE and AA-Omniscience), and not a good candidate as your final production dependency yet — Baidu's own model card calls this "an intermediate checkpoint from post-training," and the numbers may still move before an official release.

## Today's Takeaway

My default mental model for speculative decoding was: train the main model first, then bolt on a separate small model as the draft model afterward. ERNIE 5.5 Flash Preview does the opposite — DSpark, the draft head, goes through quantization-aware training together with the main model starting in post-training, using the exact same quantization granularity, scaling factors, and rounding rules as inference, and its acceptance rate is then kept calibrated through ongoing online distillation. That's a reminder that the engineering choice in speculative decoding isn't just "whether to add a draft model" — it's also "whether to tie the draft model's lifecycle to the main model's." Tying them together buys you zero-maintenance and a speedup that doesn't decay, at the cost of a draft head that can't be reused outside this specific main model.

## References

- [ERNIE Blog: Introducing ERNIE 5.5 Flash Preview (official announcement, with the full benchmark table)](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [ERNIE Blog: ERNIE 5.5 Flash Base (base model announcement, architecture and base-to-base evaluation)](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [Hugging Face: baidu/ERNIE-5.5-Flash-Preview (model card, full 20-benchmark table and deployment commands)](https://huggingface.co/baidu/ERNIE-5.5-Flash-Preview)
- [Baidu Qianfan international pricing documentation (ERNIE-5.5-Flash-Preview billing)](https://intl.cloud.baidu.com/en/doc/qianfan/s/Jm8r1826a-intl-en)
- [The Decoder: Baidu releases ERNIE 5.5 Flash Base with 280 billion parameters as an open-source foundation model](https://the-decoder.com/baidu-releases-ernie-5-5-flash-base-with-280-billion-parameters-as-an-open-source-foundation-model)
