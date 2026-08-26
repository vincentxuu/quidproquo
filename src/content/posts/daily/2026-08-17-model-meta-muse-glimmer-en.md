---
title: "Model Card｜Muse Glimmer"
date: 2026-08-17
category: daily
tags: [ai-agent, model-release, daily, meta]
lang: en
description: "Meta open-sources Muse Glimmer — a 30B-parameter local agentic model under Apache 2.0, scoring 75.5 on MCP Atlas far ahead of same-tier models, with DFlash speculative decoding delivering 3.1x decode speedup on RTX 5090"
tldr: "Muse Glimmer (HF: meta-models/Muse-Glimmer-30B): 29.6B params, 131K+ context, Apache 2.0 fully open-source, zero token cost for local deployment; MCP Atlas 75.5 (vs Gemma4-31B 54.2, Qwen3.6-27B 62.5), SWE-Bench Pro 51.2 leads same tier, but trails Qwen3.6-27B on OSWorld-Verified and TerminalBench 2.1; 4-bit quantized fits under 20GB, DFlash speculative decoding delivers 3.1x speedup on RTX 5090"
series:
  name: "AI Model Tracker"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-17-model-meta-muse-glimmer)

## Model Information

| Item | Value |
|---|---|
| Model ID | `meta-models/Muse-Glimmer-30B` (Hugging Face open weights, no official hosted API ID) |
| Vendor | Meta (Meta Superintelligence Labs) |
| Parameters | 29.6B (including ~1.8B vision encoder ViT-G/14) |
| Context Window | 131,072+ tokens |
| Input Pricing (USD/1M tokens) | $0.00 (open weights, free for local deployment; third-party hosts like Together AI / Fireworks AI / OpenRouter charge their own rates) |
| Output Pricing (USD/1M tokens) | $0.00 (same as above, no official Meta API pricing) |
| Open Source | Yes (Apache 2.0, includes full-precision weights, 4-bit quantized version, DFlash drafter, vision encoder) |
| Release Date | 2026-08-10 |
| Official Announcement | [Meta AI Research Blog](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model) |

## Key Capabilities

- Scores 75.5 on MCP Atlas (Public), far ahead of same-tier Gemma4-31B (54.2) and Qwen3.6-27B (62.5), demonstrating leading multi-tool coordination and schema-accurate tool calling among models of this size
- 4-bit quantized language model fits under 20GB, runnable on 24GB/32GB consumer GPUs or Mac, with accuracy degradation of only 0.2% (32GB tier) to 1.0% (24GB tier)
- With DFlash-based speculative decoding drafter, decode speed on RTX 5090 goes from 74.9 tok/s to 233.4 tok/s (3.1x), and 1.8x on Apple M5 Max
- Native multimodal perception encoder supports screenshots, charts, and document understanding; trained on 100+ languages with four adjustable reasoning intensity levels: low/medium/high/xhigh

## Benchmark Results

| Benchmark | Muse Glimmer-30B | Competitor Gemma4-31B | Competitor Qwen3.6-27B |
|---|---|---|---|
| MCP Atlas (Public, multi-tool coordination) | 75.5 | 54.2 | 62.5 |
| SWE-Bench Pro (agentic code repair) | 51.2 | 36.9 | 50.2 |
| τ3-Banking (multi-turn task completion) | 23.5 | 15.1 | 16.7 |
| Gaia2 (general agent tasks) | 43.3 | 36.4 | 40.0 |
| AIME 2026 (math reasoning) | 94.7 | 89.2 | 94.1 |
| OSWorld-Verified (computer operation) | 65.9 | 58.5 | **75.6** |
| TerminalBench 2.1 (terminal operation) | 51.7 | 43.4 | **60.7** |

⚠️ The above are Meta's internally published evaluation results (including cross-vendor model comparisons), not third-party reproductions published by each vendor. Qwen3.6-27B leads on OSWorld-Verified, TerminalBench 2.1, and GDPVal-AA v2 (953 vs Qwen3.6-27B's 1141).

## Comparison with Predecessors and Competitors

Muse Glimmer is a brand-new local agentic model product line with no direct "predecessor" — it was distilled from Meta's larger teacher model Muse Spark (logit distillation + on-policy distillation + RL), deliberately trading capability for a size and speed profile that runs on consumer hardware. Its positioning is entirely different from cloud API models.

Compared to same-tier open-source competitors, Muse Glimmer has a clear advantage in "multi-tool coordination + agentic task completion": MCP Atlas leads Gemma4-31B by 21.3 points and Qwen3.6-27B by 13.0 points, and it also tops the trio in τ3-Banking, Gaia2, and SWE-Bench Pro. However, it falls behind Qwen3.6-27B in "precise manipulation of existing environments": OSWorld-Verified trails by 9.7 points and TerminalBench 2.1 trails by 9.0 points, suggesting Muse Glimmer excels at "planning and tool calling" rather than "fine-grained environment manipulation."

The biggest differentiator is the licensing strategy: Muse Glimmer ships full-precision weights, 4-bit quantized version, DFlash drafter, and vision encoder all under Apache 2.0, with zero token cost for local deployment. Compared to Qwen3.6-27B's typical Apache 2.0 / custom license combination, Meta also open-sourced the inference acceleration component (drafter) this time — one of the more complete releases of its kind.

## What This Means for Agent Development

Muse Glimmer pushes "local-first" agent architecture forward — until now, running near-cloud-grade agentic performance in offline or high-privacy environments meant very limited choices. An MCP Atlas score of 75.5 combined with a sub-20GB 4-bit quantized footprint means consumer hardware can now support meaningful multi-tool agent workflows.

- If you're building a local-first or privacy-sensitive personal assistant (e.g., local file handling, screenshots, everyday tool calls that don't need the cloud): Muse Glimmer's multimodal perception encoder + scaffold compatibility (OpenClaw, Hermes Agent) can run directly on a user's Mac or PC — no API key, no per-token cost
- If you're building agents that make many repetitive tool calls but don't require top-tier reasoning depth per task (customer service triage, data cleaning, batch document classification): zero marginal cost locally plus DFlash's 3.1x decode speedup make the total cost of long-running jobs far lower than cloud API calls
- Not recommended for: scenarios requiring precise manipulation of existing computer environments (OSWorld-Verified 65.9 trails Qwen3.6-27B by ~10 points) or deep knowledge-work judgment (GDPVal-AA v2 trails Qwen3.6-27B by 188 points) — frontier-tier cloud models are still the better fit

## Takeaway

The default assumption has been that "local small models" necessarily trail their cloud/large-model contemporaries across the board, with the gap purely a function of scale. But Muse Glimmer's benchmarks show this gap is becoming uneven: on multi-tool coordination tasks like MCP Atlas and τ3-Banking, it actually beats same-tier Qwen3.6-27B; yet on tasks requiring precise manipulation of existing environments like OSWorld-Verified and TerminalBench, it falls noticeably behind. This means the optimization focus for local models is shifting from "catch up to the cloud across the board" to "make deliberate trade-offs on specific agent sub-capabilities" — when choosing a local model, you first need to determine whether your agent scenario is closer to "tool coordination and planning" or "fine-grained environment manipulation."

## References

- [Introducing Muse Glimmer: An Open Agentic Model That Runs on Your Device — Meta AI Research](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model)
- [meta-models/Muse-Glimmer-30B — Hugging Face Model Card](https://huggingface.co/meta-models/Muse-Glimmer-30B)
- [Build with Muse Glimmer — Meta AI Developers Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-glimmer/)
- [Meta returns to open source with Muse Glimmer — VentureBeat](https://venturebeat.com/technology/meta-returns-to-open-source-with-muse-glimmer-an-apache-2-0-licensed-30b-parameter-ai-model-optimized-for-agents-available-now)
