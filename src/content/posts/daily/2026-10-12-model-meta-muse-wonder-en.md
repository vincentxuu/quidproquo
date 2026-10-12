---
title: "Model Card | Meta Muse Wonder"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta, model-family-muse-spark]
lang: en
description: "Meta Superintelligence Labs ships its first frontier model, Muse Wonder/Wonder Full — 1M context, priced at parity with Claude Opus 5.5 ($4/$20), built around Active Memory and Active Focus for long-horizon personal and professional agents"
tldr: "Muse Wonder (API-callable) and Muse Wonder Full (Muse Code subscription only): released 2026-10-12, 1,048,576-token context, $4.00/1M input tokens (cached $0.20) / $20.00/1M output tokens — exactly matching Claude Opus 5.5. Meta's own benchmarks show Terminal-Bench 4.0-AA at 85.6 (Wonder) / 85.5 (Full), both ahead of Opus 5.5's 81.5, and SWE-Marathon at 78.8/79.0 versus Opus 5.5's 74.2. But independent evaluator Artificial Analysis puts Wonder at an Intelligence Index of 52 (9th of 219 models) and Wonder Full at 56 (4th of 699) — below both Meta's self-reported 56/59.0 and Opus 5.5's 58. This is Meta's first frontier-scale release since its August 2025 AI reorg, and the two checkpoints split capability asymmetrically: Wonder leads on AutomationBench and GDP.pdf, while Full leads by a wide margin on JobBench, Vals Finance, and MemoryBench."
series:
  name: "AI Model Tracker"
  order: 46
glossary:
  - term: "Muse"
    def: "Meta's umbrella name for its model and agent product line, spanning the lightweight Muse Spark, the open-weight Muse Glimmer, and the frontier model covered here, Muse Wonder"
  - term: "Active Memory"
    def: "Meta's name for Muse Wonder's capability to retain and retrieve information relevant to a user across multi-turn conversations and long-term use"
---

> 🌏 [中文版](/posts/daily/2026-10-12-model-meta-muse-wonder)

## Model Information

| Item | Value |
|---|---|
| Model ID | `muse-wonder-1.0` (API-callable) / `muse-wonder-full-1.0` (Muse Code subscription only, no API) |
| Vendor | Meta (Meta Superintelligence Labs) |
| Parameters | Undisclosed |
| Context Window | 1,048,576 tokens |
| Input Pricing (USD/1M tokens) | $4.00 (cached input $0.20) |
| Output Pricing (USD/1M tokens) | $20.00 (Wonder Full is not sold per token via API; it's bundled into Muse Code's $50/$200 monthly plans) |
| Open Source | No |
| Release Date | 2026-10-12 |
| Official Announcement | [Meta AI Research Blog: Muse Wonder](https://research.meta.ai/blog/muse-wonder) |
| Official Model Card | [Muse Wonder Model Card (PDF)](https://research.meta.ai/static/muse-wonder-model-card) |
| Family | Muse (prior lightweight line Muse Spark 1.x → this generation's first frontier models, Wonder and Wonder Full) |

## Capability Highlights

- First to pair **Active Memory** with **Active Focus**: the former carries forward information relevant to the user across conversations; the latter describes how the model keeps working through blockers, adapts its approach, and asks for clarification on long tasks — both are capabilities Meta explicitly says a benchmark score alone can't demonstrate
- Pricing and context window ($4/$20, 1M tokens) match Claude Opus 5.5 exactly — Meta's first release since its AI reorg pitched at flagship-tier pricing rather than a discount play
- Meta's own testing puts Terminal-Bench 4.0-AA at 85.6 (Wonder) and 85.5 (Wonder Full), both ahead of Claude Fable 5.1 (79.0), GPT-6 Astra (81.4), and Claude Opus 5.5 (81.5)
- On SWE-Marathon (an ultra-long-horizon software engineering benchmark), Wonder scores 78.8 and Wonder Full 79.0, 4-5 points ahead of Opus 5.5's 74.2 and GPT-6 Astra's 74.1

## Benchmark Performance

| Benchmark | Muse Wonder | Muse Wonder Full | Claude Opus 5.5 | Best Competitor (excl. Opus 5.5) |
|---|---|---|---|---|
| Terminal-Bench 4.0-AA | 85.6 | 85.5 | 81.5 | GPT-6 Astra 81.4 |
| DeepSWE 1.1 | 52.0 | 57.1 | 59.6 | GPT-6 Astra 59.1 |
| SWE-Marathon | 78.8 | 79.0 | 74.2 | GPT-6 Astra 74.1 |
| AA Intelligence Index (Meta's own table) | 56 | 59.0 | 58 | Claude Fable 5.1 54 |
| AA Intelligence Index (Artificial Analysis, independent) | 52 (9th of 219) | 56 (4th of 699) | 58 (1st) | — |

⚠️ The first four rows are Meta's own model-card results (some benchmarks were run by third parties like Artificial Analysis, Datacurve, or Abundant AI, but the figures are still vendor-commissioned or vendor-reported, not independently reproduced). The last row is Artificial Analysis's own published leaderboard number for the same index — about 3 points below what Meta's table reports for the same models. That gap, on the same metric, is itself worth noting.

## Versus Predecessors and Competitors

This is Meta's first frontier-tier release since Scale AI founder Alexandr Wang restructured its AI efforts in August 2025. Before this, Meta had only shipped the lightweight Muse Spark and the Muse agent, deliberately avoiding a head-on contest with OpenAI and Anthropic at the frontier tier. Muse Wonder is the first time it has gone there directly.

Against Opus 5.5, Wonder leads on both Terminal-Bench and SWE-Marathon in Meta's own tests, but trails on DeepSWE 1.1 (52.0/57.1 vs. 59.6), and the independent Artificial Analysis Intelligence Index ranks Wonder below Opus 5.5 (52 vs. 58). In other words, the benchmarks Meta chose to publish happen to be the ones where Wonder leads, while the more comprehensive independent index still favors Opus 5.5 — a reminder to read vendor-selected benchmarks for what they are, not as proof of a clean win or loss.

The pricing strategy is the most notable part of the launch: Meta isn't competing on price. At $4/$20, it matches Opus 5.5 exactly and costs several times more than open-weight-camp APIs like DeepSeek V4 Pro. That signals Meta is positioning itself to compete on capability at parity pricing with a top-tier closed model, not to undercut the market.

The two checkpoints also split capability asymmetrically. Wonder (API-callable) leads on AutomationBench-AA and GDP.pdf; Wonder Full (subscription-only) leads by a wide margin on JobBench (75.3 vs. 30.8), Vals Finance Agent V2 (59.1 vs. 10.0), and MemoryBench (39.4 vs. 34.3). This isn't the same model with the reasoning dial turned up — it's two models trained with different emphases, and the one developers can reach via API isn't the higher-scoring one on several of Meta's own benchmarks.

## Implications for Agent Development

Active Memory and Active Focus are the most notable architectural signal here: Meta is explicitly treating "remembering user state over time" and "persisting through blockers on long tasks" as core selling points distinct from conventional benchmark scores, rather than arguing for them indirectly through a bigger context window or a higher reasoning score.

- If you're building a personal assistant agent that needs to retain user preferences and history across sessions: the Muse Wonder family is one of the few frontier releases to treat memory as a first-class, separately-evaluated capability (MemoryBench), and is worth including in your evaluation. But note Wonder Full scores notably higher on MemoryBench than the API-callable Wonder — if you can only call the API, you aren't getting the version Meta's own numbers rate highest on memory
- If you're building agentic coding or long-horizon software engineering tools: SWE-Marathon's 78.8, ahead of both Opus 5.5 and GPT-6 Astra, plus the 1M context window, make this worth evaluating as a backend for existing coding agents
- Not a fit for: cost-sensitive, high-throughput batch workloads. There's no way to turn off reasoning — reasoning tokens always count toward output billing — and the pricing itself is set at Opus-tier, without the cost advantage a model like DeepSeek offers. Also worth checking before you commit: if your use case depends on the higher-scoring checkpoint, Wonder Full is currently locked behind a Muse Code monthly subscription with no API path

## Today's Takeaway

The natural assumption is that a "lite" and "full" release in the same family are the same model with the reasoning budget turned up. Muse Wonder and Wonder Full break that assumption — they trade wins across different benchmarks (the API version leads on AutomationBench and GDP.pdf; the subscription version leads by a wide margin on JobBench, Vals Finance, and MemoryBench), which suggests Meta trained two models for different task profiles rather than two reasoning tiers of one model. It's also a reminder that which benchmarks a vendor chooses to publish is itself a signal — the set Meta picked here happens to favor the Wonder family, while the independent composite index is comparatively more conservative about it.

## References

- [Meta AI Research Blog: Introducing Muse Wonder](https://research.meta.ai/blog/muse-wonder)
- [Muse Wonder Model Card (official PDF)](https://research.meta.ai/static/muse-wonder-model-card)
- [TechCrunch: Meta releases its first frontier model, Muse Wonder](https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/)
- [OrcaRouter: Muse Wonder Is Live — full benchmark table and independent comparison](https://www.orcarouter.ai/blog/meta-muse-wonder)
- [Muse Spark family introduction (this site)](/posts/tech/2026-09-19-ai-model-family-muse-spark-en)
