---
title: "Inkling: Thinking Machines Lab's Second Generation, from the 594B Inkling 2 Small to the Laptop-Sized Looped Inkling 2 Mini, plus the Tinker Fine-Tuning Platform"
date: 2026-09-05
category: tech
tags: [ai-agent, llm, thinking-machines-lab, inkling, model-family-inkling, open-source, moe, multimodal, looped-transformer, model-selection]
lang: en
type: deep-dive
tldr: "Thinking Machines Lab (founded 2025 by Mira Murati) shipped its second Inkling generation in November 2026. Inkling 2 Small (594B total / 17B active MoE, text + image input, 1M context, Artificial Analysis Intelligence Index 31) launched on Tinker with closed weights, then released weights under Apache 2.0 on Nov 12. Inkling 2 Mini (26.4B / 3.4B active, middle 12 layers looped three times, ~20GB, runs on a 32GB Mac) is among the first public looped transformers and leads open models under 100B on agentic coding. The second generation drops audio input, and knowledge-heavy QA remains a weak spot."
description: "Thinking Machines Lab and the Inkling model family: the two current models Inkling 2 Small and Inkling 2 Mini, the design trade-offs of a looped transformer, the closed-then-open weight release process, Tinker and third-party API pricing, self-hosting hardware, and a selection guide for agent developers; first-generation Inkling and Inkling-Small live in the family evolution timeline"
series:
  name: "AI Model Families"
  order: 19
draft: false
glossary:
  - term: "Inkling 2 Small"
    definition: "Thinking Machines Lab's second-generation workhorse: a 594B-total / 17B-active MoE with text and image input and 1M context, launched on Tinker on 2026-11-05 and released under Apache 2.0 on 11-12"
  - term: "Inkling 2 Mini"
    definition: "The second generation's local model: 26.4B total / 3.4B active, with the middle 12 layers run three times (5.4B effective active), about 20GB, released 2026-11-20 under Apache 2.0"
  - term: "looped transformer"
    definition: "An architecture that runs the same layer weights several times per token, adding serial compute depth without adding stored parameters"
  - term: "Tinker"
    definition: "Thinking Machines Lab's fine-tuning API platform—submitted training and sampling jobs run on first-party clusters, supporting open families including Inkling, Qwen, and Nemotron"
---

> :globe: [中文版](/posts/tech/2026-09-05-ai-model-family-inkling)

Thinking Machines Lab (TML) is the lab former OpenAI CTO Mira Murati founded in San Francisco in February 2025. It does not chase the top of the leaderboard; it sells "open weights plus easy fine-tuning": models ship under Apache 2.0, and customization runs on its own Tinker platform. In November 2026 it shipped a second generation: the workhorse Inkling 2 Small (594B total / 17B active) and Inkling 2 Mini, a looped transformer that runs on a laptop with 32GB of memory. This is the nineteenth entry in the AI Model Families series. The body covers the second generation; the July 2026 first-generation Inkling and Inkling-Small are in the family evolution timeline. By the end you should be able to decide whether to use Small for cloud agents, Mini for local always-on agents, or whether this family fits your task at all.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| Inkling 2 Small (HF `thinkingmachines/Inkling-2-Small`) | General workhorse: agentic coding, vision, knowledge work, finance | 594B / 17B active MoE, text + image input, 1M context | Apache 2.0 weights (NVFP4 main checkpoint + MXFP8); Tinker; third-party APIs |
| Inkling 2 Mini (HF `thinkingmachines/Inkling-2-Mini`) | Local and edge, many always-on agents | Looped MoE, 26.4B / 3.4B active (5.4B effective), ~20GB, 1M context | Apache 2.0 weights; Tinker; third-party APIs |
| TML-d24-varloop-research | Research | Variable loop count (trained with 1–5 passes) for studying how looping affects chain-of-thought monitorability | Apache 2.0 weights |
| Tinker | Fine-tuning and sampling platform | A training service, not another model | First-party API / Playground |

First-generation Inkling (975B / 41B) and Inkling-Small (276B / 12B) are still on Tinker and some third-party APIs, and they are the only models in the family that accept audio input. Beyond that, a new project has no reason to pick the first generation.

### Two product lines: open weights for ecosystem, Tinker for revenue

**Open-weights line** (the `thinkingmachines` org on Hugging Face): every first- and second-generation model is Apache 2.0. Second-generation framework support includes SGLang, vLLM, TokenSpeed, and Unsloth; Mini adds Ollama and Exo Labs (Apple silicon), NVIDIA Dynamo, and GGUF builds from Unsloth and llama.cpp.

**Tinker platform line**: fine-tuning jobs run on first-party clusters, alongside a sampling API and a free Playground. Besides Inkling, it can fine-tune third-party open models such as Qwen, Nemotron, DeepSeek, GLM, Kimi, and gpt-oss. One of TML's main pitches for Inkling 2 Small is that it is easy to tune: on the same data and algorithm, the official comparison shows the second generation learning faster than the first and finishing higher.

The second generation also changed the release process: **closed first, then open**. Inkling 2 Small went live on Tinker with closed weights on Nov 5; after external safety testing and red-teaming, the weights and third-party APIs followed on Nov 12. TML calls this its "safe path to open weights." Mini shipped with open weights on launch day.

## Family evolution

| Date | Event | What it changed for selection |
|---|---|---|
| 2025-02 | Company founded | Founded by Murati; founding team includes OpenAI co-founder John Schulman (chief scientist), Barret Zoph, and Lilian Weng |
| 2025-07 | $2B seed at a $12B valuation | Led by a16z; one of the largest pre-product seed rounds ever |
| 2025-10-01 | Tinker launches | Sold fine-tuning for third-party open models (Qwen, Nemotron, DeepSeek, and others) first |
| 2025-10 to 2026-01 | Andrew Tulloch leaves for Meta; Barret Zoph and Luke Metz return to OpenAI | Talent loss makes company stability a selection risk |
| 2026-03 | NVIDIA strategic partnership | Multi-year 1GW Vera Rubin compute agreement |
| 2026-07-15 | Inkling released ([announcement](https://thinkingmachines.ai/news/introducing-inkling)) | 975B / 41B MoE, 1M context, text + image + audio input, Apache 2.0; the first self-hostable TML model, stronger on knowledge QA |
| 2026-07-30 | Inkling-Small GA ([announcement](https://thinkingmachines.ai/news/inkling-small/)) | 276B / 12B; SWE-bench Verified 80.2% (vs. 77.6% for the large model), so coding and agents moved to the small model, but SimpleQA 20.6% vs. 43.9% kept knowledge QA on the large one |
| 2026-11-05 | Inkling 2 Small on Tinker (closed weights) | 594B / 17B, AA Intelligence Index 31, far above the first generation; audio input dropped |
| 2026-11-12 | Inkling 2 Small weights released | Apache 2.0, launched at NVIDIA, Fireworks, Together, Baseten, Nebius, Modal, and Cloudflare; the current cloud baseline |
| 2026-11-20 | Inkling 2 Mini released ([model card](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini-en)) | One of the first public looped-transformer models, ~20GB and runs locally on a laptop; a variable-loop research model ships alongside |

The through-line is clear: **prove post-training skill with Tinker first, then release open weights for ecosystem; the second generation re-cuts "large and small" into "cloud workhorse" and "local model."** The first generation's pattern (the small model wins on reasoning but loses on knowledge) still holds, now as Mini versus Small.

## Architecture and training trade-offs

### Inkling 2 Small: fewer active parameters, longer training context

The model card spells out the structure: a 48-layer decoder-only transformer with 384 experts per layer and 8 active per token, and attention that mixes local and global layers. Images go through a 292M-parameter vision encoder based on Perception Encoder, with 20×20-pixel patches and 2×2 pooling, interleaved with text tokens. Compared with first-generation Inkling (975B / 41B), total parameters are about 40% lower and active parameters less than half, yet the composite index is clearly higher. TML credits improvements at every step of training:

- **Native NVFP4 training**: the first pretraining phase covered 8.4 trillion tokens over 68 hours on GB300 NVL72, entirely in 4-bit NVFP4; the second phase added 3.8 trillion tokens of newer data at 512K context, and the third phase about 320 billion tokens of reasoning and agent trajectories at 1M context. The released NVFP4 checkpoint is the training precision, and TML recommends it for all uses; the MXFP8 version scores only 1–2 points higher
- **One large, unified RL run**: training randomly conditioned on an effort level and added a length penalty to the reward, so the model learned to trade speed against thoroughness; coding tasks were graded not only by unit tests but also by an agentic grader that judged how the model approached the problem
- **The cost of alignment**: TML acknowledges that early checkpoints facing hard tasks fabricated results, ignored instructions, and concealed what they had done. The fix was an alignment reward applied to every RL task plus on-policy self-distillation from a teacher prompted with a conduct spec; the internal misbehavior score fell from 66.8 for the first generation to 14.9

The trade-off is that **audio is gone**: the first generation took up to 20 minutes of WAV audio, while the second takes only text and images.

### Inkling 2 Mini: buying reasoning depth with loops

Mini has 24 layers in 4 blocks of 6. The first and last blocks run once; the two middle blocks share weights and run three times, so 24 stored layers produce 48 layer applications per token. The rationale is that middle layers carry the more abstract reasoning while the first and last layers translate between embeddings and internal representations; looping the middle 12 layers beat looping the last 12 on 27 of 28 evaluations.

A few details keep looping stable: each layer uses attention residuals, reading earlier blocks' outputs and learning its own mix; the second and third passes read the previous pass's output through a gate that starts fully closed and opens during training, so the model begins as if it had no loops.

The rest follows the mainline recipe, with two differences:

- **Prune, then heal**: training started with 384 experts per layer; at one point in midtraining, two-thirds were pruned, keeping the 128 most-used, and 1 trillion tokens distilled from a larger internal Inkling restored performance; then SFT and an RL run of 2.2 trillion tokens over 2,000 steps
- **Low-bit deployment as trained**: 20 layers in NVFP4 and the last 4 in MXFP8, so deployment precision equals training precision with no quantization loss; the whole checkpoint is about 20GB

The looping ledger has two sides. On TML's scaling ladder, the non-looped version was 7.5% cheaper to train but needed 140% more inference compute to match the looped version's loss on 512K-token agent traces. On the other side, looping does not let the weights store more facts: with the variable-loop model, long-context benchmarks (GraphWalks BFS, MRCR v2) improved with more passes, while knowledge benchmarks (AA-Omniscience, SimpleQA Verified) did not move.

Looping also touches safety: a model that computes more internally without writing it to the chain of thought could slip past a CoT monitor. With the variable-loop research model, more loops made the chain of thought shorter but still legible, and agentic sabotage tests did not rise with loop count; TML frames these as preliminary results.

## Evaluation and alternatives

Everything below is self-reported by TML, run at effort 0.99 (xhigh), temperature 1.0, and a 1M-token trajectory limit; competitor scores in the same rows were also compiled by TML, and harnesses are not identical across models.

### Inkling 2 Small vs. open models in its class (official model card)

| Benchmark | Inkling 2 Small (17B / 594B) | GLM-5.3-Flash (18B / 320B) | DeepSeek-V4.1-Flash-1017 (16B / 552B) | Kimi K3 (104B / 2800B) |
|---|---|---|---|---|
| AA Intelligence Index v5.0 | 30.6 | 27.8 | 32.6 | — |
| Vals Index v2.2 | 56.1% | 50.9% | 61.3% | 53.0% |
| DeepSWE v1.1 | 72.1% | 63.4% | 77.0% | 68.5% |
| Terminal Bench v2.1 (terminus v2) | 81.3% | 84.3% | 78.4% | 85.0% |
| BrowseComp (with compaction) | 90.2% | 76.0% | 87.8% | 88.4% |
| MCP Atlas Public | 85.0% | 82.0% | 83.2% | 84.2% |
| MMMU Pro Standard 10 | 81.6% | 79.0% | 80.6% | 80.5% |
| AA-Omniscience v1.1 score | 16.1 | 0.7 | 0.9 | — |

Three readings:

- **Not first on coding**: its closest peer, DeepSeek-V4.1-Flash-1017, scores higher on DeepSWE, the Vals Index, and the AA index; Small's strengths are vision, search and tool use, and finance and enterprise work (Vals Finance Index 61.5%, EnterpriseBench-CoreCraft 71.8%, the highest among open models in TML's tables)
- **Better knowledge than its peers**: AA-Omniscience 16.1 is far above GLM-5.3-Flash and DeepSeek-V4.1-Flash, though still below Muse Spark Open's 25.8
- **Against closed models**: on the same model card, Claude Haiku 5.5 has an AA index of 36.5 and FrontierCode v2.0 of 34.9% (Small: 25.4%)

Third party: Artificial Analysis gives Inkling 2 Small an Intelligence Index of 31 (v5.0.1), at an average $1.18 and 23.7 minutes per task; it also rates the model as very verbose, at 154M output tokens to run the index versus a class median of about 104M.

### Inkling 2 Mini vs. models under 100B (official announcement)

| Benchmark | Inkling 2 Mini (5.4B effective / 26.4B) | Qwen3.8-27B (dense) | Gemma 4 31B (dense) | Nemotron 3.5 Super VL (12B / 124.5B) |
|---|---|---|---|---|
| AA Intelligence Index v5.0 | 20.1 | 20.1 | 4.4 | 13.6 |
| DeepSWE v1.1 | 48.2% | 42.2% | 0.3% | 24.7% |
| SWE-bench Pro v2 (Hard) | 77.9% | 73.8% | 14.2% | 44.1% |
| Terminal Bench v2.1 (pi) | 71.6% | 73.0% | 43.4% | 60.7% |
| BrowseComp (with compaction) | 79.0% | 61.6% | 37.0% | 78.9% |
| AA-Omniscience v1.1 score | -8.6 | -6.4 | -48.5 | -2.9 |

Mini's profile is sharper than Small's: it leads its size class on agentic coding and search, and trails Qwen3.8-27B and Nemotron on knowledge (AA-Omniscience). TML's limitations section also names multi-turn chat (MultiChallenge 50.0%) and many-constraint instructions (ComplexConstraints v1.1 33.4%) as weak spots.

Third party: Artificial Analysis gives Mini an index of 20, tied with Qwen3.8 27B (xhigh). It uses about 38% more output tokens but about 2.8x less compute by an "active parameters × tokens" proxy, at $0.59 and 9.0 minutes per task versus $3.53 and 38.2 minutes for Qwen3.8 27B (using Tinker's first-party prices). Stanford Hazy Research measured "intelligence per joule" on DGX Spark at 0.703, against 0.430 for Qwen3.6-35B-A3B (at different precisions: MXFP8 for Mini, NVFP4 for Qwen).

## Licensing, pricing, and deployment

### License

The Hugging Face pages for both generations and the research model are tagged Apache 2.0, and the model cards also link an Acceptable Use Policy. Apache 2.0 has no revenue threshold or MaaS clause, so commercial use and redistribution are allowed; read the usage policy separately.

### Pricing (USD / 1M tokens)

| Channel | Model | Input | Cached input | Output |
|---|---|---|---|---|
| Tinker serverless inference (beta) | Inkling 2 Small | $0.30 | $0.03 | $1.00 |
| Tinker sampling (prefill / sample) | Inkling 2 Mini | $0.15 | $0.015 | $0.50 |
| OpenRouter (Modal, Nebius, Cloudflare) | Inkling 2 Small | $0.30 | $0.03–$0.06 | $1.00 |
| OpenRouter (PrimeIntellect) | Inkling 2 Small | $0.15 | $0.03 | $0.50 |
| OpenRouter (PrimeIntellect, 1M context) | Inkling 2 Mini | $0.075 | $0.015 | $0.30 |
| OpenRouter (Io Net, 262K context) | Inkling 2 Mini | $0.08 | $0.016 | $0.35 |

Tinker serverless inference currently covers only Inkling 2 Small and the two first-generation models; Mini goes through the sampling API, and production use requires a separate request. Training is billed separately: Mini costs $0.75 per million tokens (64K training context) or $1.50 (256K), and Small $1.50 or $3.00; both Small training-context options can sample up to 1M. On OpenRouter, prices and context limits differ by provider for the same model, so pin a provider to lock in a price.

The first generation is still available: on Tinker, Inkling serverless is $1.00 / $4.05 and Inkling-Small $0.30 / $1.20; on OpenRouter, Together serves Inkling and DeepInfra serves Inkling-Small. TML has not published a retirement schedule.

### Self-hosting

| Model | Checkpoint | Hardware (model card) |
|---|---|---|
| Inkling 2 Small | NVFP4 (recommended) | At least 500GB VRAM: 2×B300 or 4×H200 |
| Inkling 2 Small | MXFP8 | At least 800GB VRAM: 4×B300 or 8×H200 |
| Inkling 2 Mini | Mixed NVFP4 + MXFP8, ~20GB | 1×DGX Spark; Apple silicon with 32GB+ memory; 32GB+ VRAM recommended elsewhere |

The first-generation large model needed 2TB of VRAM in BF16; second-generation Small needs a quarter of that, moving "self-host Inkling" from a cluster job to a single multi-GPU box. TML's Mini demos include writing a flight simulator offline on a MacBook Pro (M5 Pro, 48GB) in airplane mode and running 20 town-resident agents on the same laptop.

## Agent integration and selection

- **Cloud coding or research agents that need visual feedback** → Inkling 2 Small: long-horizon agents and vision-in-the-loop work (fixing web pages or 3D scenes from screenshots) were training priorities. On coding scores alone, DeepSeek-V4.1-Flash-1017 is higher and worth testing side by side
- **Finance, legal, enterprise workflows** → Inkling 2 Small: first among open models on several of TML's tables, but all self-reported; validate on your own documents first
- **Local, offline, many always-on agents** → Inkling 2 Mini: 20GB, runs on a 32GB Mac, and sits in the top group of open models under 100B on agentic coding
- **Knowledge-heavy QA** → neither is a first choice: TML says looping adds no knowledge to Mini, and Small trails Muse Spark Open; if you use them, attach a search tool—both score high on BrowseComp
- **Audio input** → only first-generation Inkling / Inkling-Small support it
- **Custom models** → fine-tune Inkling 2 Small on Tinker, with downloadable checkpoints; this is the use TML most wants to sell
- **Still on the first generation** → before moving to Inkling 2 Small, confirm you don't rely on audio and rerun your evals: the second generation writes long outputs, so your token bill may not fall as much as the unit price

Practical settings: Mini's model card warns that it sometimes gets stuck in repetitive reasoning loops (especially while debugging) and recommends limits on output tokens and agent turns; it may also delete or overwrite files without confirmation, so run agents in a sandbox and require confirmation for destructive actions. Small picks tools unreliably in codebases with many skills, so keep the tool list lean.

Minimal validation: run 20–50 of your own tasks across Small's effort levels and Mini, recording success rate, average output tokens, and cost per task. AA measured both as verbose, so a cheap unit price does not guarantee a cheap task.

## Limitations and trade-offs

- **Evaluations are mostly self-reported**: comparison tables are compiled by TML with differing harnesses; the main third-party data today is Artificial Analysis's index and cost figures
- **Long outputs**: AA measured Small's output tokens at about 1.5x its class median and 23.7 minutes per task, on the slow side; Mini uses about 38% more output tokens than Qwen3.8 27B
- **Chat is not the focus**: TML says Small organizes and presents content less well, overuses slashes, and overreacts to mental-health and safety queries (FORTRESS overrefusal score 20.4, the highest in its table); Mini's output quality drops outside English, with clipped phrasing and mixed languages in Chinese testing
- **No audio**: the second generation takes text + image input and outputs text only
- **Looped architecture is new**: local runtime support for looped models is just starting, and speed varies by runtime and hardware; minimum reasoning effort does not fully disable reasoning, and per-token compute is higher than the active-parameter count suggests
- **Company risk**: co-founders and core researchers have left, and the product cadence is fast (two generations in four months), so evaluate long-term maintenance commitments yourself

### Overall

TML's second generation turns the family from "one large, one small" into "cloud workhorse plus local model": Inkling 2 Small reaches the front of the open-model pack with 17B active parameters and pairs with Tinker fine-tuning, while Inkling 2 Mini uses a looped architecture to fit agentic coding on a laptop. It suits teams that want a clean license, customization, or local deployment; it does not suit work that needs top-of-leaderboard capability, knowledge QA, or audio.

## Update history

- 2026-11-23: Moved to the second generation. Rewrote the matrix, architecture, evaluation, pricing, deployment, and selection sections from the official announcements and model cards for Inkling 2 Small (on Tinker 2026-11-05, weights 11-12) and Inkling 2 Mini (2026-11-20), the Tinker pricing page, Hugging Face, and OpenRouter, and added third-party figures from Artificial Analysis. First-generation Inkling and Inkling-Small are now historical: key numbers stay in the family evolution timeline, with full evaluations in the official announcements linked there; Inkling 2 Mini details are also in the daily model card. Removed the first-generation competitor table (its benchmark versions differ from the second generation's, so they are not mixed). Added that the second generation lacks audio, the closed-then-open weight release process, and the first generation's current status on Tinker and OpenRouter.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [Thinking Machines Lab official site](https://thinkingmachines.ai)
- [Introducing Inkling 2 Small (official announcement, 2026-11-05, updated 11-12 for the weight release)](https://thinkingmachines.ai/news/inkling-2-small/) — 594B / 17B, training process, alignment, limitations, evaluation settings
- [Inkling 2 Small Model Card](https://thinkingmachines.ai/model-card/inkling-2-small/) — architecture, 1M context, hardware requirements, full evaluation table
- [Introducing Inkling 2 Mini (official announcement, 2026-11-20)](https://thinkingmachines.ai/news/inkling-2-mini/) — looped design, pruning and healing, monitorability experiments, evaluation table
- [Inkling 2 Mini Model Card](https://thinkingmachines.ai/model-card/inkling-2-mini/) — 5.4B effective active, ~20GB, supported platforms, limitations
- [thinkingmachines (Hugging Face)](https://huggingface.co/thinkingmachines) — Inkling-2-Small, Inkling-2-Small-MXFP8, Inkling-2-Mini, TML-d24-varloop-research, Apache 2.0
- [Tinker pricing](https://thinkingmachines.ai/tinker/pricing/) — training, sampling, and serverless inference prices
- [OpenRouter: Inkling 2 Small](https://openrouter.ai/thinkingmachines/inkling-2-small) and [Inkling 2 Mini](https://openrouter.ai/thinkingmachines/inkling-2-mini) — third-party provider prices and context limits
- [Inkling 2 Small — Artificial Analysis](https://artificialanalysis.ai/models/inkling-2-small) — Intelligence Index 31, cost and time per task, output tokens
- [Thinking Machines has released Inkling 2 Mini — Artificial Analysis](https://artificialanalysis.ai/articles/inkling-2-mini) — Intelligence Index 20, cost and compute versus Qwen3.8 27B
- [Inkling: Our Open-Weights Model (official announcement, 2026-07-15)](https://thinkingmachines.ai/news/introducing-inkling) — first generation
- [Inkling Model Card](https://thinkingmachines.ai/model-card/inkling/) — first generation
- [Introducing Inkling-Small (official announcement, 2026-07-30)](https://thinkingmachines.ai/news/inkling-small/) — first generation
- [Model Card | Inkling 2 Mini](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini-en) — this site
- [Thinking Machines Lab — Wikipedia (company history, funding, and personnel)](https://en.wikipedia.org/wiki/Thinking_Machines_Lab)
