---
title: "Model Card｜Agnes 3.0 Flash"
date: 2026-09-13
category: daily
type: digest
tags: [ai-agent, model-release, daily, agnes-ai, model-family-agnes]
lang: en
description: "Singapore's Sapiens AI ties DeepSeek V4 Pro on the Artificial Analysis intelligence index with Agnes 3.0 Flash — an eighth of the price, three times the speed, but two very different models hiding under one name"
tldr: "Agnes 3.0 Flash (API model: agnes-3.0-flash, vendor: Agnes AI / Singapore's Sapiens AI): launched 2026-09-09, 512K context, input $0.05 / output $0.15 / cached input $0.005 per 1M tokens (currently free during a promo period). Scores 36 on the Artificial Analysis Intelligence Index v4.3, tying DeepSeek V4 Pro, while generating output at 235-252.7 tokens/s — over 3x V4 Pro's 72 t/s. Closed-source, cannot be self-hosted. A separate open-weight Preview checkpoint sharing the same name (33B, 262K context, Apache 2.0) has different architecture and scores — easy to confuse with the production model."
series:
  name: "AI Model Tracker"
  order: 22
glossary:
  - term: "Agnes AI"
    def: "The commercial brand of Singapore startup Sapiens AI (founded by Bruce Yang), offering text, image, and video models through a single omni-modal API"
---

> 🌏 [中文版](/posts/daily/2026-09-13-model-agnes-ai-agnes-3-0-flash)

## Model Information

| Field | Value |
|---|---|
| Model ID | `agnes-3.0-flash` (API model name; a separate open-weight Preview checkpoint with different specs shares this name on Hugging Face — see below) |
| Vendor | Agnes AI (a brand of Singapore's Sapiens AI) |
| Parameters | Undisclosed for the API/production model; the open-weight Preview checkpoint is 33B, a hybrid-attention decoder (54 of 72 layers run a gated delta-rule recurrent mechanism, only 18 run standard global attention — just those 18 layers hold a KV cache that grows with context) |
| Context Window | 512K tokens (API/production model, per official docs); the open-weight Preview checkpoint has 262,144 tokens |
| Input pricing (USD/1M tokens) | List price $0.05; currently free ($0) during the promo period |
| Output pricing (USD/1M tokens) | List price $0.15; currently free ($0) during the promo period |
| Open source | No for the API/production model (available only through Agnes AI's own API); a separate Apache-2.0 open-weight Preview checkpoint exists, but its parameter count and scores differ from the production model |
| Release date | 2026-09-09 (API/production model launch; the open-weight Preview checkpoint went up on Hugging Face on 2026-09-11) |
| Official announcement | [Agnes AI docs: Agnes 3.0 Flash](https://www.agnes-ai.com/en/docs/agnes-30-flash) |
| Hugging Face | [Agnes-AI/Agnes-3.0-Flash](https://huggingface.co/Agnes-AI/Agnes-3.0-Flash) (open-weight Preview checkpoint only, not the production model) |
| Family | Agnes series (predecessor Agnes 2.5 Pro Beta remains available) |

## Highlights

- Scores 36 on the Artificial Analysis Intelligence Index v4.3, ranking 1st out of 61 models in its class and tying DeepSeek V4 Pro (also 36) — while pricing at roughly one-eighth (input) to one-sixth (output) of V4 Pro's rate
- Both the official docs and third-party testing put output speed at 235-252.7 tokens/s, over 3x DeepSeek V4 Pro's 72 t/s, second only to Google's Gemini 3.8 Flash (267.2 t/s)
- The open-weight Preview checkpoint uses a hybrid-attention decoder: only 1 in every 4 layers runs standard global attention, the other 3 run a gated delta-rule recurrent mechanism — of 72 layers, only 18 hold a KV cache that grows with context, in principle cutting memory overhead sharply for long-context workloads
- Positioned around "trustworthy delivery": the vendor emphasizes stronger factual grounding, result verification, and tool-call stability, aiming to reduce cases where the model claims a task is done when it isn't, and to cut down on leaking internal reasoning

## Benchmark Results

| Benchmark | Agnes 3.0 Flash | DeepSeek V4 Pro | DeepSeek V4.1 Flash |
|---|---|---|---|
| AA Intelligence Index v4.3 | 36 | 36 | 40 |
| AutomationBench-AA (agentic SaaS workflows) | 51% | 57% | 68.9% |
| Terminal-Bench v4.0 (agentic terminal use) | 7% | 14% | 26.8% |
| AA-LCR v1.1 (long-context reasoning) | 81% | 80% | 84.0% |
| AA-Omniscience Accuracy (factual knowledge) | 25% | 49% | 46% |

⚠️ Figures above are Artificial Analysis v4.3 results for the API/production Agnes 3.0 Flash (accessed 2026-09-11; the vendor labels the index score an estimate pending independent evaluation). The open-weight Preview checkpoint on Hugging Face reports different benchmark numbers and should not be cited interchangeably. DeepSeek V4.1 Flash figures are from yesterday's (2026-09-12) model card in this series.

## Comparison with Predecessor/Competitors

Against its own predecessor Agnes 2.5 Pro Beta (Intelligence Index 35), 3.0 Flash gains only 1 point, but output speed jumps from 159.5 t/s to 235+ t/s — the improvement is concentrated in speed, not raw intelligence.

Against DeepSeek V4 Pro, which shares the same index score, Agnes 3.0 Flash's pricing and speed edge is clear: roughly 8.7x cheaper on input, 5.8x cheaper on output, and 3.3x faster on output generation. But breaking down the sub-scores shows the tied 36 hides two very different capability profiles: Agnes edges ahead slightly on SciCode and long-context reasoning, but trails clearly on AutomationBench-AA (agentic SaaS workflows) and Terminal-Bench v4.0 (agentic terminal use), and its AA-Omniscience factual accuracy is just 25% versus V4 Pro's 49%. In other words, under the same composite score, Agnes 3.0 Flash is "cheap, fast, but less reliable," while V4 Pro is "expensive, slower, but better at multi-step agentic tasks and less prone to factual errors."

The only model here that beats Agnes 3.0 Flash on the Intelligence Index is DeepSeek V4.1 Flash (40), but its output pricing is 4x Agnes's, and it leads clearly on agentic benchmarks (68.9% on AutomationBench-AA, 26.8% on Terminal-Bench v4.0) — if budget allows, V4.1 Flash remains the most balanced choice among the three for now.

## Implications for Agent Development

If you're building interactive coding agents or workloads where output-token volume dominates the bill: Agnes 3.0 Flash's low price plus high speed is compelling, especially during the current free promo — good for prototyping or load testing without paying DeepSeek- or Gemini-tier prices up front.

If you're building agentic workflows that need high factual accuracy or multi-step autonomy (terminal operation, SaaS workflow automation): the 25% AA-Omniscience accuracy and the clear gap on AutomationBench-AA/Terminal-Bench mean DeepSeek V4 Pro or V4.1 Flash are still the better fit for now — don't swap models purely on the strength of a matching Intelligence Index total.

Not a fit: use cases requiring self-hosting or data that can't leave your own infrastructure — the production Agnes 3.0 Flash is fully closed-source and available only through the official API. Also a weak fit for long-context, cache-heavy repetitive agent work (replaying the same system prompt or an entire codebase repeatedly), since Agnes's cached-input price ($0.005/1M) is higher than both DeepSeek's ($0.003) and Xiaomi MiMo's ($0.0028).

## Today's Takeaway

The most useful thing to note here isn't the score itself, but the "same name, different model" problem: the `Agnes-AI/Agnes-3.0-Flash` repo on Hugging Face is a 33B open-weight Preview checkpoint with a 262K context window, while the production model tested by Agnes AI's own API and Artificial Analysis (512K context, undisclosed parameter count) is a completely different model — their benchmark scores aren't even comparable. This confusion was significant enough that Agnes AI itself added a "version clarification" section to the Hugging Face model card. Going forward, whenever a vendor ships both an "open-weight version" and an "API version" under the same name, it's worth confirming they're actually the same weights before assuming they only differ in deployment method.

## References

- [Agnes AI docs: Agnes 3.0 Flash](https://www.agnes-ai.com/en/docs/agnes-30-flash)
- [Hugging Face: Agnes-AI/Agnes-3.0-Flash (open-weight Preview checkpoint)](https://huggingface.co/Agnes-AI/Agnes-3.0-Flash)
- [Artificial Analysis: Agnes 3.0 Flash model page](https://artificialanalysis.ai/models/agnes-3-0-flash)
- [Intelligent Living: Agnes 3.0 Flash: Free Singapore AI Matches DeepSeek V4 Pro](https://www.intelligentliving.co/agnes-3-0-flash-matches-deepseek/)
- [NanoGPT/Sulat: Agnes 3.0 Flash model info (lists 2026-09-09 release date)](https://models.sulat.com/models/nano-gpt-agnes-30-flash-597606fc)
