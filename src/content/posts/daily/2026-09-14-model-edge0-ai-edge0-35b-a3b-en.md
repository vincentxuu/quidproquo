---
title: "Model Card｜Edge0-35B-A3B"
date: 2026-09-14
category: daily
type: digest
tags: [ai-agent, model-release, daily, edge0-ai, model-family-edge0]
lang: en
description: "Open-source project Edge0 combines SSD expert offload, predictive prerouting, and Recover-LoRA distillation to run a 35B-parameter MoE model in 2.9GB of memory on a Mac mini, with only a 3.9-point quality loss"
tldr: "Edge0-35B-A3B-preview (Edge0/Edge0-35B-A3B-preview): open-sourced by Edge0-AI on 2026-09-08. 4-bit quantized, 256 experts with 4 active per token (base model: Qwen3.5-MoE 35B-A3B). Three mechanisms — SSD expert offload, prerouter predictive routing, and Recover-LoRA distillation — let it run on a Mac mini M4 Pro (24GB) with just 2.9 GiB peak memory and 15 tok/s decode, averaging only a 3.9-point loss across 5 benchmarks versus the fp16 base. Fully open under Apache-2.0; also ships an 8B-A1B tier (built on Ling 3.0 Tiny). Agentic capability is currently weak — officially positioned as a preview release."
series:
  name: "AI Model Tracker"
  order: 23
glossary:
  - term: "Edge0"
    def: "An open-source streaming MoE inference framework that combines SSD expert offload, prerouter predictive routing, and Recover-LoRA distillation to run large MoE models on memory-constrained devices (like a Mac mini) with a tiny memory footprint"
---

> 🌏 [中文版](/posts/daily/2026-09-14-model-edge0-ai-edge0-35b-a3b)

## Model Information

| Field | Value |
|---|---|
| Model ID | `Edge0/Edge0-35B-A3B-preview` (HF repo: int4 checkpoint bundled with LoRA/prerouter adapters) |
| Vendor | Edge0-AI (independent open-source project, not a major lab) |
| Parameters | 35B sparse MoE (256 experts, 4 active per token, K=4); base model is Qwen3.5-MoE 35B-A3B |
| Context Window | Not disclosed (the README only reports memory/speed figures at short context lengths, with no stated context window ceiling) |
| Input pricing (USD/1M tokens) | No official API pricing (open-source framework and weights only, self-hosted) |
| Output pricing (USD/1M tokens) | No official API pricing (open-source framework and weights only, self-hosted) |
| Open source | Yes (Apache-2.0, covering the framework code, model weights, and trained LoRA/prerouter adapters) |
| Release date | 2026-09-08 (GitHub and Hugging Face went live together) |
| Official announcement | [GitHub: Edge0-AI/edge0](https://github.com/Edge0-AI/edge0) |
| Hugging Face | [Edge0/Edge0-35B-A3B-preview](https://huggingface.co/Edge0/Edge0-35B-A3B-preview) |
| Family | Edge0 series (two tiers released together: 35B-A3B on Qwen3.5-MoE, and 8B-A1B on Ling 3.0 Tiny) |

## Highlights

- **SSD expert offload**: MoE expert weights stay on disk/flash storage and stream in only when routed to, so peak memory scales with the active expert set rather than total parameter count — the 35B model measured just 2.9 GiB peak memory and 14.9–17.7 tok/s decode on a Mac mini M4 Pro (24GB)
- **Prerouter predictive routing**: a trained head predicts which experts the next step will need one step ahead, letting expert loads overlap the forward pass instead of stalling it — up to **+59%** decode throughput, with the gain growing as storage latency, model size, or routed width K increase
- **Recover-LoRA distillation**: the int4 base is frozen, and LoRA adapters are trained by distillation from an FP16 teacher to recover quantization loss — the int4 checkpoint averages only a **3.9-point** loss across 5 benchmarks (out of 100)
- Two tiers, 35B-A3B and 8B-A1B, ship together from one framework; the base checkpoint is read-only and never re-quantized, so a single base can serve multiple LoRA adapter sets across different tasks

## Benchmark Results

| Benchmark | Edge0-35B-A3B (int4) | Qwen3.5-MoE 35B-A3B (fp16 base) | Gap |
|---|---|---|---|
| AIME 2026 | 86.6 | 92.7 | -6.1 |
| HumanEval | 90.9 | 95.1 | -4.2 |
| GPQA-Diamond | 79.8 | 81.8 | -2.0 |
| MMLU-Pro | 81.0 | 84.6 | -3.6 |
| IFBench | 57.9 | 61.7 | -3.8 |
| **Average** | **79.2** | **83.2** | **-3.9** |

⚠️ All figures are self-reported by Edge0-AI using OpenCompass (not independently reproduced). The comparison point is the fp16 base model score under the same team's own test setup, not an official Qwen-reported score, so results may differ from other sources due to evaluation-setup differences.

## Comparison with Predecessor/Competitors

This is Edge0's first release (a preview), so there's no predecessor to compare against — but it's worth comparing to the typical quantization route. Standard int4 static quantization (e.g. GGUF, AWQ) applied to large MoE models usually costs more on reasoning-heavy benchmarks like AIME; Edge0's Recover-LoRA keeps the average loss to 3.9 points, and even the worst-hit benchmark, AIME 2026, only drops 6.1 points — better than what static quantization typically achieves.

Against the framework's other tier, edge0-8b (built on Ling 3.0 Tiny), the 8B model shows an even smaller quantization loss (officially 2.8 points on average vs. 3.9 for the 35B tier), and actually scores higher than its fp16 base on MMLU-Pro (70.1 vs. 65.8) — suggesting the prerouter+LoRA compensation mechanism is more stable at smaller scale. But the two tiers use base models from entirely different families (Qwen3.5-MoE vs. Ling 3.0), not scaled versions of the same model, so this isn't a direct "smaller is better" comparison.

On pricing, Edge0 is entirely free and open-source (framework, weights, and adapters all under Apache-2.0) — a completely different business model from closed cloud APIs. What it sells isn't model capability itself, but a deployment path for "running a bigger model on less hardware."

## Implications for Agent Development

If you're building agents that need to run offline or on-device (e.g. a macOS desktop app, or a privacy-sensitive scenario that can't call a cloud API): Edge0 lets a 24GB Mac mini run a 35B-class MoE model without cloud GPU costs — a rare open-source option that reaches this parameter scale on consumer hardware.

If you're building a multi-tenant inference service: the read-only base checkpoint plus pluggable LoRA adapters mean one quantized 35B base can serve multiple task-specific adapters without re-quantizing the whole model for each task, saving significant storage and deployment overhead.

Not a fit: production use cases that need real agentic capability (tool use, multi-step planning, long-horizon autonomy) — the official README explicitly states this preview's "agent capability is currently weak," with the full release promising substantial improvement. Also not a fit for non-Apple-Silicon platforms — only the MLX backend (Apple Silicon) exists today, with CUDA still on the roadmap, so Windows/Linux GPU users can't use it yet.

## Today's Takeaway

I used to think of quantization and performance as a strict trade-off — shrink the model to save memory, or accept worse precision to save speed. Edge0's prerouter + Recover-LoRA combination shows there's a third path: hide SSD read latency behind computation via predictive routing, then use distillation-trained LoRA to recover the precision lost to quantization — bringing the cost of "running a datacenter-scale model on consumer hardware" down to single-digit points instead of a steep discount.

## References

- [Hugging Face: Edge0/Edge0-35B-A3B-preview](https://huggingface.co/Edge0/Edge0-35B-A3B-preview)
- [GitHub: Edge0-AI/edge0](https://github.com/Edge0-AI/edge0)
- [GitHub: Edge0 architecture docs](https://github.com/Edge0-AI/Edge0/blob/main/docs/architecture.md)
- [AlphaSignal: Edge0 Runs a 35B AI Model on a Mac mini Using SSD](https://alphasignal.ai/news/edge0-runs-a-35b-ai-model-on-a-mac-mini-using-ssd)
- [MindStudio: Edge0-35B-A3B: A 35B MoE Model That Runs in 3GB of RAM](https://www.mindstudio.ai/blog/edge0-35b-phone-memory-moe)
