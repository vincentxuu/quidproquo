---
title: "Model Card | SenseNova Loop-9B-Preview"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, model-release, daily, sensetime, model-family-sensenova]
lang: en
description: "SenseTime open-sources SenseNova Loop-9B-Preview — a Looped Transformer that re-runs the same decoder weights twice, letting a 9B model beat the 27B Qwen3.5 on three benchmarks"
tldr: "SenseNova Loop-9B-Preview (`sensenova/SenseNova-Loop-9B-Preview`): released 2026-10-30 by SenseTime under Apache 2.0. Of 32 distinct decoder layers, layers 4-27 share weights and run twice (56 total layer executions), paired with two-stream mHC (Manifold-Constrained Hyper-Connections) managing two residual streams. Training sequence length tops out at 262,144 tokens. An official ablation shows mHC alone adds +4.42 points on GPQA Diamond and +13.34 on TeamBench. It beats the 3x-larger Qwen3.5-27B on WorkBuddy Bench (66.9 vs 60.5), AutomationBench (13.7 vs 10.2), and RaccoonPPT Bench (70.7 vs 59.1), but trails on Terminal Bench 2.1 and T³-Banking. Open weights only, no official API or pricing."
series:
  name: "AI Model Tracker"
  order: 64
glossary:
  - term: "Looped Transformer"
    def: "An architecture that re-runs the same set of decoder weights multiple times, deepening the model's effective compute path without adding stored parameters"
---

> 🌏 [中文版](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview)

## Model Info

| Field | Value |
|---|---|
| Model ID | `sensenova/SenseNova-Loop-9B-Preview` |
| Vendor | SenseTime |
| Parameters | ~9B stored parameters; ~14.6B inference-equivalent compute (the 24 looped layers run twice — 56 layer executions from only 32 stored weight sets) |
| Context Window | 262,144 tokens (the documented maximum training sequence length; not a publicly announced serving-side limit) |
| Input pricing (USD/1M tokens) | Not available (open weights only, no official hosted API) |
| Output pricing (USD/1M tokens) | Not available (same as above) |
| Open source | Yes (Apache License 2.0) |
| Release date | 2026-10-30 |
| Official announcement | [SenseTime on X](https://x.com/SenseTime_AI/status/2116151078219858346) |
| Hugging Face | [sensenova/SenseNova-Loop-9B-Preview](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview) |
| Family | SenseNova Loop (first coverage on this site — a new architecture branch under SenseTime's "RiRiXin" lineup) |

## Highlights

- **Looped decoder**: the input first passes through layers 0-3, then the block spanning layers 4-27 is applied twice in sequence (`B(B(h))`), before layers 28-31 and the output head produce the result. Inference performs 56 decoder-layer computations while storing only 32 sets of weights.
- **Two-stream mHC (Manifold-Constrained Hyper-Connections)**: inside the looped section, two residual streams carry information through learned mappings, with Sinkhorn normalization (20 iterations) constraining the stream-mixing map. An official ablation shows adding mHC alone lifts GPQA Diamond by 4.42 points and TeamBench by 13.34 points.
- **Hybrid attention**: each group of four layers interleaves three linear-attention layers with one full-attention layer, and the loop boundaries align with complete four-layer groups so the attention pattern stays consistent across both passes.
- At 9B parameters, it beats the 3x-larger Qwen3.5-27B on WorkBuddy Bench, AutomationBench, and RaccoonPPT Bench (confirmed by a third-party account, TeksEdge, who verified the numbers against SenseTime's own launch chart).

## Benchmarks

```diagram
title: SenseNova Loop-9B beats Qwen3.5-27B on three benchmarks at 9B parameters
desc: SenseTime's launch chart shows SenseNova Loop-9B-Preview scoring higher than the 3x-larger Qwen3.5-27B on WorkBuddy Bench, AutomationBench, and RaccoonPPT Bench.
caption: Figures from SenseTime's official launch chart, verified via screenshot by third-party X account TeksEdge (@TeksEdge) on 2026-10-30. The chart also shows Loop-9B trailing Qwen3.5-27B on Terminal Bench 2.1 and T³-Banking, but no exact transcript of those scores has been published, so they are omitted here. Scale: baseline y=300, plot top y=60, domain 0-80 points, k=(300-60)/80=3 units per point, bar top y=300-score*3.
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

  <text class="dg-text--series" x="136" y="52" text-anchor="middle" dominant-baseline="central">Qwen3.5-27B</text>
  <text class="dg-text--series dg-text--accent" x="188" y="52" text-anchor="middle" dominant-baseline="central">Loop-9B</text>

  <rect class="dg-bar dg-c-s1" x="114" y="118" width="44" height="182"/>
  <rect class="dg-bar dg-c-accent" x="166" y="99" width="44" height="201"/>
  <rect class="dg-bar dg-c-s1" x="294" y="269" width="44" height="31"/>
  <rect class="dg-bar dg-c-accent" x="346" y="259" width="44" height="41"/>
  <rect class="dg-bar dg-c-s1" x="474" y="123" width="44" height="177"/>
  <rect class="dg-bar dg-c-accent" x="526" y="88" width="44" height="212"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="136" y="108" text-anchor="middle" dominant-baseline="central">60.5</text>
  <text class="dg-label dg-text--accent" x="188" y="89" text-anchor="middle" dominant-baseline="central">66.9</text>
  <text class="dg-sub" x="316" y="259" text-anchor="middle" dominant-baseline="central">10.2</text>
  <text class="dg-label dg-text--accent" x="368" y="249" text-anchor="middle" dominant-baseline="central">13.7</text>
  <text class="dg-sub" x="496" y="113" text-anchor="middle" dominant-baseline="central">59.1</text>
  <text class="dg-label dg-text--accent" x="548" y="78" text-anchor="middle" dominant-baseline="central">70.7</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">WorkBuddy</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">AutomationBench</text>
  <text class="dg-sub" x="522" y="320" text-anchor="middle" dominant-baseline="central">RaccoonPPT</text>
</svg>
```

| Benchmark | Score | Predecessor | Best competitor (Qwen3.5-27B) |
|---|---|---|---|
| WorkBuddy Bench | 66.9 | None (first public release in this line) | 60.5 |
| AutomationBench | 13.7 | None | 10.2 |
| RaccoonPPT Bench | 70.7 | None | 59.1 |
| GPQA Diamond (mHC ablation gain) | +4.42 pts | A variant without mHC | — |
| TeamBench (mHC ablation gain) | +13.34 pts | A variant without mHC | — |

⚠️ The three task scores above come from SenseTime's official launch chart, transcribed after verification by third-party X account TeksEdge — not an official transcript, and not yet independently reproduced. The official chart also lists BIRD-Dev, AIDABench, Terminal Bench 2.1, and T³-Banking; on the latter two, the chart shows Loop-9B trailing Qwen3.5-27B, but the exact scores have no published transcript, so they're excluded from the table.

## vs. Predecessor and Competitors

SenseNova Loop is the first public release in this architecture branch from SenseTime, so there's no strict "predecessor" to compare against. The official comparisons are against same-size Qwen3.5-9B (where a third party found Loop-9B winning 7 of 8 charted benchmarks and tying the eighth) and the deliberately harder target, Qwen3.5-27B (3x the parameters).

Against Qwen3.5-27B, Loop-9B wins on office and automation-style tasks (WorkBuddy, AutomationBench, RaccoonPPT all lead), but trails on Terminal Bench 2.1 (terminal operations) and T³-Banking (financial workflow simulation). That split suggests the gains from "looped compute depth" aren't distributed evenly across task types — on tasks requiring rigorous multi-step tool-chain execution and long transaction sequences, it still falls short of simply scaling parameters to 27B.

There's no pricing strategy to compare: Loop-9B currently ships as open weights only, with no official API, which puts it on a completely different business model from the cloud models announced around the same time, like Gemini 4 Carbon or Kimi K3.1 Pro. What it's selling is architectural efficiency — trading stored parameters for compute depth — not price competition.

## What This Means for Agent Development

The most direct implication of the Looped Transformer architecture for agent development is trading a deeper compute path for reasoning ability without growing the model's storage footprint — 56 layer computations fit in the memory footprint of 32 stored weight sets, a different trade-off from the usual "more parameters, more intelligence" path.

- **If you're running agents on consumer or edge GPUs** (like a 16GB RTX card): this model line is worth watching. It achieves near-27B performance on office and automation tasks at a 9B memory footprint, which is a better cost-to-capability ratio in resource-constrained settings.
- **If you're building for multi-step tool-chain execution or long transaction reasoning** (terminal-operation automation, financial workflows): SenseTime's own chart shows Loop-9B trailing the same-family 27B model on Terminal Bench 2.1 and T³-Banking, so it isn't a drop-in replacement for your current tool-chain agent yet.
- **Not a fit**: scenarios that need a stable public API, SLA guarantees, or off-the-shelf pricing — there's only open weights for now, no official hosted service, and self-hosting means dealing with custom inference-framework implementations (LightLLM or SGLang, loaded with `trust_remote_code=True` for the custom model code).

## Today's Takeaway

This one points to a direction different from "more parameters, more intelligence": re-running the same weights to deepen the effective compute path, instead of storing more parameters. For agent development, that hints model size and reasoning depth might eventually decouple, which would change how deployment cost gets calculated. But SenseTime's own ablation chart also shows the gains aren't evenly distributed — it trails the same-family 27B model on Terminal Bench and financial workflows, which suggests "trading compute depth for intelligence" is still a targeted optimization, not yet a general-purpose solution.

## References

- [SenseNova-Loop-9B-Preview model card (Hugging Face)](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview)
- [OpenSenseNova/SenseNova-Loop GitHub source and README](https://github.com/OpenSenseNova/SenseNova-Loop)
- [SenseTime on X: Introducing SenseNova Loop-9B-Preview](https://x.com/SenseTime_AI/status/2116151078219858346)
- [David Hendrickson (@TeksEdge) on X: third-party verification of SenseNova Loop-9B-Preview's numbers](https://x.com/TeksEdge/status/2116179128504480223)
- [SenseTime open-sources SenseNova Loop-9B-Preview: exploring compute depth to unlock model potential (Sina Finance, in Mandarin)](https://finance.sina.com.cn/roll/2026-10-30/doc-iniwziir8135422.shtml)
