---
title: "Inkling: From an OpenAI Exodus Team to a 975B Open Flagship, and Tinker's Fine-Tuning Bet"
date: 2026-09-05
category: tech
tags: [ai-agent, llm, thinking-machines-lab, inkling, model-family-inkling, open-source, moe, multimodal, model-selection]
lang: en
type: deep-dive
tldr: "Thinking Machines Lab (founded 2025 by Mira Murati, $2B seed at a $12B valuation) released Inkling in July 2026 under Apache 2.0 (975B total / 41B active params, 1M context, native multimodality, controllable thinking effort) plus a smaller Inkling-Small (276B / 12B), paired with the Tinker fine-tuning platform—turning customizability itself into the product."
description: "Complete Thinking Machines Lab and Inkling family guide: 2025→2026 evolution timeline, Tinker fine-tuning platform plus open-weights dual-track strategy, MoE architecture and RL-at-scale training, Inkling vs Inkling-Small selection, ecosystem map, and selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 19
draft: false
glossary:
  - term: "Inkling"
    definition: "Thinking Machines Lab's open flagship released July 2026—a 975B-total / 41B-active MoE under Apache 2.0"
  - term: "Inkling-Small"
    definition: "Inkling's lightweight sibling—276B total / 12B active, beating the larger model on reasoning and agentic tasks, with full weights released"
  - term: "Tinker"
    definition: "Thinking Machines Lab's fine-tuning API platform—submit jobs run on first-party clusters, supporting open families including Inkling, Qwen, and Nemotron"
---

> 🌏 [中文版](/posts/tech/2026-09-05-ai-model-family-inkling)

In February 2025, former OpenAI CTO Mira Murati founded Thinking Machines Lab in San Francisco with roughly 30 researchers and engineers from OpenAI, Meta, and Mistral. That July, with no product shipped, the company closed a $2B seed round at a $12B valuation led by a16z—a Silicon Valley early-stage record. A year later, its first answer was not a closed API but an Apache 2.0 open model, Inkling (975B total parameters), plus Tinker, a platform that sells fine-tuning as a service. This is the nineteenth family deep-dive in the "AI 模型家族" series, tracing the company's path from Tinker to Inkling to Inkling-Small, and its bet that customizability—not the strongest model—wins.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family Evolution Timeline

| Date | Event | Why it matters |
|---|---|---|
| 2025-02 | Founded | Murati founds the lab; co-founders include OpenAI co-founder John Schulman (chief scientist), ex-VP Research Barret Zoph, and ex-VP Lilian Weng |
| 2025-07 | $2B seed at $12B valuation | a16z-led, with Nvidia, AMD, Cisco, Jane Street participating; among the largest seed rounds ever, pre-product |
| 2025-10-01 | Tinker launches | Fine-tuning API first, initially supporting third-party open models from Qwen, Nemotron, DeepSeek, GLM, and Kimi |
| 2025-10 | Co-founder poached | Andrew Tulloch leaves for Meta; in Jan 2026 Barret Zoph and Luke Metz return to OpenAI—the cost of the talent war |
| 2026-03 | NVIDIA strategic partnership | Multi-year 1GW Vera Rubin compute agreement lands the compute supply |
| 2026-07-15 | Inkling released | Apache 2.0 open weights, 975B total / 41B active params, 1M context |
| 2026-07-30 | Inkling-Small GA | 276B total / 12B active, full weights released, beating the larger model on reasoning and agentic tasks |

Eighteen months, seven milestones. The throughline is clear: **sell fine-tuning capability first (Tinker) to prove post-training mastery, then trade open weights (Inkling) for ecosystem**—the reverse order of most labs, which ship a model first and bolt on tooling later.

## Two Product Lines: Open Weights for Ecosystem, Tinker for Revenue

TML's 2026 moves make sense as two parallel lines:

**The open-weights line** (Hugging Face `thinkingmachines` org): full Inkling and Inkling-Small weights, plus an NVFP4 quantized build for NVIDIA Blackwell systems. This line buys ecosystem—Apache 2.0 is cleaner than Llama's Community License, and SGLang, vLLM, TokenSpeed, llama.cpp, and transformers all work, leaving hardware as the only self-hosting barrier.

**The Tinker platform line** (fine-tuning API + Playground): submit tuning jobs executed on first-party clusters. Supported families include Inkling, Qwen, and Nemotron, plus individual models such as DeepSeek-V3.1, GLM-5.3, Kimi K2.6, and gpt-oss; finished checkpoints deploy directly to Together AI, Fireworks, Modal, Databricks, and Baseten. First-party extras include a cookbook, `tml-renderer` (post-processing for tool calls and multimodal sampling), and a free-trial Playground chat UI. This line earns revenue by productizing the insight that post-training scaling is where the value is (as covered in this series' [GLM installment](/posts/tech/2026-08-24-ai-model-family-glm-en), GLM-5.3 gained 6× capability from pure post-training; TML sells you that path directly).

The trade-off is stated upfront: TML says Inkling "is not the strongest overall model available today, open or closed." Instead of racing Claude and GPT to the top of leaderboards, it sells tunability, deployability, and clean licensing—the rational play for a startup lab that cannot out-spend giants on compute scale.

## Architecture: Standard MoE Skeleton, Training Recipe as the Real Body

Inkling is a 66-layer decoder-only transformer whose MoE design largely follows DeepSeek-V3: 256 routed experts per layer with 6 active per token, plus 2 always-on shared experts. Its departures from the common recipe all serve efficiency and long context: a sigmoid router with auxiliary-loss-free load-balancing bias; 5:1 interleaved sliding-window and global attention with 8 KV heads; relative positional embeddings instead of RoPE for longer-sequence extrapolation; short convolutions on attention and residual branches.

The real differentiation is training. Pre-training spans 45 trillion tokens (text, image, audio, video) with hybrid optimization—Muon for large matrices, Adam elsewhere. Post-training warm-starts with SFT on synthetic data including Kimi K2.5 generations, then scales asynchronous RL past 30M rollouts, with reasoning scores improving log-linearly throughout. The company also productized **controllable thinking effort**: sweeping effort from 0.2 to 0.99 via system message plus per-token cost reaches Nemotron 3 Ultra parity on Terminal Bench at roughly one-third the tokens. A telling RL byproduct: chains of thought spontaneously compress, dropping grammatical filler while staying readable—telegraphic style squeezed out by efficiency pressure.

Multimodality is natively encoder-free: audio as dMel spectrograms (16kHz WAV, up to 20 minutes), images as 40×40 patches through a four-layer hMLP, jointly processed with text tokens. Inputs cover text, image, and audio; outputs are text-only for now (including code and structured data).

## Inkling vs Inkling-Small: How to Choose

| Dimension | Inkling | Inkling-Small |
|---|---|---|
| Parameters | 975B total / 41B active | 276B total / 12B active |
| Reasoning & agentic | HLE 29.7%, SWE-Bench Verified 77.6%, Terminal Bench 2.1 63.8% | HLE 31.6%, SWE-Bench 80.2%, Terminal Bench 64.7%—ahead across the board |
| Knowledge & factuality | SimpleQA 43.9%, Tau 3 Banking 23.7% | SimpleQA 20.6%, Tau 3 Banking 15.5%—clearly behind |
| Efficiency | GDPval 1238 Elo at ~28.6k tokens/task | GDPval 1269 Elo at ~23k tokens/task |
| Self-hosting cost | BF16 needs 2TB VRAM (8×B300 or 16×H200) | Far lighter; or start from NVFP4 (600GB) |

The decision rule is crisp: **reasoning, coding, agents, and cost pressure → Small; knowledge coverage and factual QA → the large model**. Small wins because it started later: a revised pre-training data mix, on-policy distillation with Inkling as teacher, plus two extra weeks of agentic-coding RL. The warning label: the small model's knowledge and calibration were traded for parameters—don't send factuality workloads to the wrong sibling.

## Ecosystem Map: Everything TML Ships

| Item | Content | Access |
|---|---|---|
| Inkling | Flagship open MoE, 975B / 41B, 1M context | Apache 2.0, HF `thinkingmachines/inkling` (original + NVFP4) |
| Inkling-Small | Lightweight version, 276B / 12B | Same license, `thinkingmachines/Inkling-Small` |
| Tinker | Fine-tuning API + Playground | First-party platform, 64K / 256K context options for Inkling, limited-time 50% discount |
| Inference partners | Together AI, Fireworks, Modal, Databricks, Baseten | Each provider's API, day-zero availability |
| OSS frameworks | SGLang, vLLM, TokenSpeed, llama.cpp, transformers | Community integrations (RadixArk, Inferact, Lightseek, Unsloth, HF) |
| Dev tools | Cookbook with three audio recipes, `tml-renderer` | GitHub, PyPI |

## Competitive Position

Inkling's position reads as "leading US open weights, front of the global open second tier." Key rows from the official comparison table (effort 0.99, vendor self-reported, not yet fully reproduced by third parties):

| Benchmark | Inkling | Small | Nemotron 3 Ultra | Kimi K2.6 | GLM 5.2 | GPT-5.6 Sol | Claude Fable 5 |
|---|---|---|---|---|---|---|---|
| SWE-Bench Verified | 77.6% | 80.2% | 70.7% | 80.2% | 80.0% | 82.2% | 95.0% |
| Terminal Bench 2.1 | 63.8% | 64.7% | 56.4% | 71.3% | 82.7% | 89.5% | 84.6% |
| MCP Atlas | 76.0% | 79.6% | 44.7% | 68.1% | 77.8% | 81.8% | 83.3% |
| HLE (with tools) | 46.0% | 47.8% | 37.4% | 54.0% | 54.7% | 55.0% | 64.5% |
| FORTRESS (adversarial) | 78.0% | 71.6% | 77.6% | 65.6% | 71.3% | 82.4% | 96.0% |

⚠️ All figures above are TML's official self-reported results, not yet independently reproduced.

Three readings: first, it wins the US open-weights civil war against Nemotron 3 Ultra (76.0 vs 44.7 on MCP Atlas is a blowout); second, against Chinese open weights (GLM-5.2, Kimi K2.6, DeepSeek V4 Pro) it's win-some-lose-some, with GLM-5.2's 82.7% on Terminal Bench still an untouched ceiling; third, closed frontier models (Claude Fable 5, GPT-5.6 Sol) lead everywhere—95.0% vs 77.6% on SWE-Bench says different leagues. Safety is the bright spot: 78.0% adversarial on FORTRESS is the highest among listed open models, without over-refusal (95.9% benign).

## What It Means for Agent Developers

- Building coding agents: Inkling-Small is currently top-tier open value—80.2% SWE-Bench with 12B active params plus controllable effort, so long-horizon token bills are directly tunable. The company validates multiple coding/agent harnesses, and training-time tool-schema randomization makes it less sensitive to any single harness.
- Building RAG / knowledge QA: pick the large Inkling (SimpleQA 43.9% vs Small's 20.6%), or wait for factuality-tuned Tinker recipes. Don't let Small's reasoning scores lure QA workloads onto it.
- Evaluating self-hosting: BF16 large needs 2TB VRAM, so the pragmatic entry is NVFP4 (600GB) or Small; below that, managed Tinker. The Playground is free to try first—picking a base model is inherently "scores plus feel," which the company itself acknowledges.
- Poor fits: leaderboard-maximum performance (go closed), speech output (audio is input-only on Inkling), or expecting product-grade guarantees beyond the license (Apache 2.0 is clean, but downstream moderation is yours to stack—Llama Guard-style defense in depth, as officially recommended).

## Overall

Thinking Machines Lab's moat is not model scale but customizability-as-product: Tinker monetizes post-training capability, Apache 2.0 weights buy ecosystem, controllable effort sells the cost curve. The package suits teams needing long-term customization, private deployment, and clean licensing; the price is that top-end performance, mature ecosystem, and company stability are all still in transit—co-founders flowing back to OpenAI, NVIDIA compute freshly landed, multimodal outputs still text-only. Choosing it is a bet that "good enough and tunable" beats "strongest but closed."

## References

- [Thinking Machines Lab official site](https://thinkingmachines.ai)
- [Inkling: Our Open-Weights Model (official announcement, 2026-07-15)](https://thinkingmachines.ai/news/introducing-inkling)
- [Inkling Model Card (official technical document)](https://thinkingmachines.ai/model-card/inkling/)
- [Introducing Inkling-Small (official announcement, 2026-07-30)](https://thinkingmachines.ai/news/inkling-small/)
- [Thinking Machines Lab — Wikipedia (company history, funding, and product summary)](https://en.wikipedia.org/wiki/Thinking_Machines_Lab)
