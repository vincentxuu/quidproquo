---
title: "Model Card｜Xing4.0-29B-A4B"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, china-telecom, model-family-xing]
lang: en
description: "China Telecom open-sources Xing4.0-29B-A4B — the first model at this scale trained entirely on Huawei Ascend NPUs, scoring 75.0 on SWE-bench Verified, close to the much larger Qwen3.6-35B-A3B"
tldr: "Xing4.0-29B-A4B (China Telecom Artificial Intelligence Technology / XingChen-AGI, successor to TeleChat): 29B total parameters with only 4B active, 256K native context (extensible to 512K), Apache-2.0 open source. Scores 75.0 on SWE-bench Verified (vs. 76.0 for the larger Qwen3.6-35B-A3B and 53.0 for Gemma4-26B-A4B) and 57.5 on Terminal-Bench 2.1, the highest of the three. It's the first model at this scale trained entirely from scratch on Ascend 910C + MindSpore, with training throughput improved roughly 96% over an unoptimized baseline."
series:
  name: "AI Model Tracker"
  order: 24
glossary:
  - term: "Xing"
    def: "A large language model family from China Telecom Artificial Intelligence Technology, successor to TeleChat; Xing4.0 is its latest generation"
---

> 🌏 [中文版](/posts/daily/2026-09-18-model-china-telecom-xing4-0-29b-a4b)

## Model Information

| Field | Value |
|---|---|
| Model ID | `XingChen-AGI/Xing4.0-29B-A4B` |
| Vendor | China Telecom Artificial Intelligence Technology Co., Ltd. |
| Parameters | 29B sparse MoE (64 routed experts + 1 shared expert, 4 active per token, ~4B effectively active) |
| Context Window | 256K tokens (extensible to 512K) |
| Input pricing (USD/1M tokens) | Not disclosed (open-source model; no official hosted API, self-hosted deployment only) |
| Output pricing (USD/1M tokens) | Not disclosed (open-source model; no official hosted API, self-hosted deployment only) |
| Open source | Yes (Apache-2.0) |
| Release date | 2026-09-17 |
| Official announcement | [GitHub: XingChen-AGI/Xing4.0-29B-A4B](https://github.com/XingChen-AGI/Xing4.0-29B-A4B) |
| Hugging Face | [XingChen-AGI/Xing4.0-29B-A4B](https://huggingface.co/XingChen-AGI/Xing4.0-29B-A4B) |
| Family | Xing series (successor to TeleChat; the prior flagships were TeleChat3-105B-A4.7B-Thinking and TeleChat3-36B-Thinking, released December 2025) |

## Highlights

- Scores 75.00 on SWE-bench Verified, close to the larger Qwen3.6-35B-A3B (76.00) and well ahead of the similarly-sized Gemma4-26B-A4B (53.00)
- Scores 57.50 on Terminal-Bench 2.1, beating both Gemma4-26B-A4B (30.00) and Qwen3.6-35B-A3B (51.50) — the highest of the three in the official comparison table
- Reaches the above with just 29B total parameters and 4B active, making it the first model at this scale trained entirely from scratch on Huawei's Ascend NPU platform (Ascend 910C clusters + MindSpore framework)
- The mHC + MLA + MTP architecture is natively optimized for multi-step planning and tool calling; China Telecom reports that multi-level co-optimization — including fine-grained MoE communication optimization and selective recomputation — improved training throughput by roughly **96%** over an unoptimized baseline

## Benchmark Results

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| SWE-bench Verified | 75.00 | No comparable score disclosed for TeleChat3 on this benchmark | Qwen3.6-35B-A3B 76.00 |
| Terminal-Bench 2.1 | 57.50 | No comparable score disclosed for TeleChat3 on this benchmark | Qwen3.6-35B-A3B 51.50 (Gemma4-26B-A4B only 30.00) |
| Claw-Eval | 76.55 | No comparable score disclosed for TeleChat3 on this benchmark | Qwen3.6-35B-A3B 74.54 |
| DeepresearchBII | 60.80 | No comparable score disclosed for TeleChat3 on this benchmark | Qwen3.6-35B-A3B 59.70 |
| AIME2026 | 90.00 | No comparable score disclosed for TeleChat3 on this benchmark | Qwen3.6-35B-A3B 92.70 (trails here) |

⚠️ All figures are self-reported by China Telecom (via the GitHub/Hugging Face model card) and have not been independently reproduced. Sampling parameters (temperature ranging 0.8–1.0) vary by benchmark and were each set by the vendor, which may affect cross-model comparability.

## Comparison with Predecessor/Competitors

The prior TeleChat3 generation, released in December 2025, topped out at 105B-A4.7B-Thinking (MoE) and 36B-Thinking (dense), trained on Huawei Ascend 910B chips. Xing4.0-29B-A4B moves to the newer Ascend 910C cluster and MindSpore framework while shrinking noticeably to 29B total parameters (4B active) — but the official announcement doesn't provide directly comparable scores against TeleChat3 on the same benchmark suite, so the generational improvement can't be precisely quantified. What's confirmed is that this continues the "architecture and hardware co-optimization" direction rather than simply scaling up parameters.

Against similarly-sized competitors, Xing4.0 matches or beats Gemma4-26B-A4B across every agentic/coding metric (SWE-bench Verified, Terminal-Bench 2.1, Claw-Eval, DeepresearchBII), and even beats the larger Qwen3.6-35B-A3B on Terminal-Bench 2.1 and Claw-Eval. But it trails Qwen3.6-35B-A3B on the more reasoning-heavy AIME2026 (90.00 vs. 92.70) and long-context retrieval AA.LCR (61.00 vs. 62.00), suggesting this round's optimization clearly favored agent/coding tasks over pure mathematical reasoning.

On pricing, Xing4.0 is fully open source (Apache-2.0) with no official hosted API or pricing — a completely different model from token-billed closed products like Gemini or GPT. Adopters bear their own inference infrastructure costs in exchange for freedom from any single cloud vendor.

## Implications for Agent Development

This is the first production-grade agent model trained entirely from scratch on Huawei's Ascend NPU + MindSpore software stack, and the README explicitly lists format alignment work for mainstream agent frameworks including OpenCode, Claude Code, OpenClaw, and Hermes. If you're deploying agent systems in environments where NVIDIA GPUs aren't an option: Xing4.0 is currently one of the few large-scale-validated models that hits comparable agent-benchmark scores on non-NVIDIA compute.

With just 4B active out of 29B total parameters and 256K native context (extensible to 512K), if you're building a locally or privately deployed coding agent: the hardware bar is far lower than the hundred-billion-plus MoE models that dominate this category, and the vendor ships deployment examples for vLLM, SGLang, and KTransformers (though some framework support is still pending PR merge).

Not a fit: scenarios centered on pure math/logical reasoning (it trails similarly-sized competitors on AIME2026), or teams that need an officially hosted API and want to launch without running their own infrastructure — today it's self-hosted only, with no official billed cloud endpoint, and some inference-framework support is still stuck in PR review rather than merged into main.

## Today's Takeaway

I used to assume domestic Chinese compute for training large models was still "capable but a generation behind." Xing4.0 matches or beats similarly-sized models trained on mainstream GPUs on agentic benchmarks, which suggests the Ascend + MindSpore software stack has crossed past the bar of merely "being able to train" and started producing differentiated advantages in specific task directions.

## References

- [Hugging Face: XingChen-AGI/Xing4.0-29B-A4B](https://huggingface.co/XingChen-AGI/Xing4.0-29B-A4B)
- [GitHub: XingChen-AGI/Xing4.0-29B-A4B (News, architecture, and benchmark table)](https://github.com/XingChen-AGI/Xing4.0-29B-A4B)
- [arXiv: Training Report of TeleChat3-MoE](https://arxiv.org/abs/2512.24157)
- [SCMP: China Telecom develops MoE models trained entirely on Huawei's AI chips](https://www.scmp.com/tech/big-tech/article/3340591/china-telecom-develops-countrys-first-moe-models-trained-entirely-huaweis-ai-chips)
- [AI/TLDR: Xing4.0-29B-A4B — China Telecom's agent model](https://ai-tldr.dev/releases/china-telecom-xing4-0-29b-a4b/)
