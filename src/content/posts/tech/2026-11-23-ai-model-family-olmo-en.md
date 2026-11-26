---
title: "Ai2 OLMo: Olmo 3.1 With Open Weights, Training Data and Code, Plus the Molmo 2 and MolmoWeb Multimodal Lines"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, open-source, olmo, allen-ai, model-family-olmo, model-selection]
lang: en
type: deep-dive
tldr: "Ai2's current OLMo lineup is Olmo 3.1 32B Think and Instruct plus Olmo 3 7B: dense models with 65K context and English only. Weights are Apache 2.0, training data is ODC-BY, and even intermediate checkpoints are public. Its strength is auditability and reproducibility, with a tied-first 89 on the Artificial Analysis Openness Index; the cost is capability below same-size Qwen 3 and no hosted API, so you self-host."
description: "Ai2 OLMo model family: Olmo 3.1 32B and Olmo 3 7B specs, Dolma 3 and Dolci data and the model flow, the Olmo Hybrid research line, vendor evaluations and third-party openness scores, Apache 2.0 and ODC-BY licensing, self-hosting, and selection guidance for sub-lines such as Molmo 2, MolmoWeb and SERA."
series:
  name: "AI Model Families"
  order: 36
draft: false
glossary:
  - term: "Model flow"
    definition: "Ai2's term for how Olmo 3 is released: not just final weights but checkpoints and data for every stage (pretraining, midtraining, long-context extension, SFT, DPO, RLVR), so users can fork and retrain from any stage"
  - term: "RLVR (Reinforcement Learning with Verifiable Rewards)"
    aliases: ["RLVR"]
    definition: "Reinforcement learning with rewards that can be checked automatically (a math answer is right, code passes its tests, an instruction's format is followed); Ai2 introduced the name in Tülu 3 and every later OLMo post-training run uses it"
  - term: "OlmoTrace"
    definition: "Ai2's tracing tool that links a model's output back to likely source documents in its training data; available in the Ai2 Playground"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-olmo)

OLMo is the language model family of the Allen Institute for AI (Ai2), a nonprofit research institute. What separates it from the other open-weight models in this series is that Ai2 also publishes the training data, data-processing tools, training code, intermediate checkpoints and evaluation tooling. This post is for two readers: researchers and regulated-industry teams that need a model they can audit and reproduce, and agent developers who want to know how much capability "fully open" costs.

As of November 2026, the text line is still Olmo 3 (November 2025) and Olmo 3.1 (December 2025), with Olmo 3.1 32B Think and 32B Instruct as the flagships. In October Ai2 said the next Olmo is in pretraining with a hybrid mixture-of-experts architecture; no release date has been announced. The multimodal Molmo 2, the web agent MolmoWeb and the robotics model MolmoAct 2 shipped between late 2025 and the first half of 2026.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

OLMo is positioned as "fully open models for research": its capability target is the level of same-size open-weight models, and the real selling point is that every layer can be inspected. The table lists the versions to pick today; parameter counts come from the safetensors totals on Hugging Face:

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| Olmo 3.1 32B Think (`allenai/Olmo-3.1-32B-Think`) | Current flagship, reasoning | 32.2B dense, 65,536 context, emits its reasoning; 21 more days of RL than Olmo 3 32B Think | Open weights, Apache 2.0 |
| Olmo 3.1 32B Instruct (`allenai/Olmo-3.1-32B-Instruct`) | Chat and tool use | Same 32B base, no long reasoning, shorter replies | Open weights, Apache 2.0 |
| Olmo 3 7B Think / Instruct | Small size | 7.3B dense, 65,536 context; fits a laptop or a single consumer GPU | Open weights, Apache 2.0 |
| Olmo 3 Base (7B, 32B) and RL Zero 7B | Research starting points | Pretrained weights and per-stage checkpoints; RL Zero runs RLVR straight from Base as a control | Open weights, Apache 2.0 |
| Olmo Hybrid 7B | Architecture research | Hybrid RNN with 75% of layers on Gated DeltaNet; only SFT/DPO, no RL version | Open weights, Apache 2.0 |

Three things to know first:

- **English only.** Every Olmo 3 model card lists English as the only language, with a knowledge cutoff of December 2024.
- **No hosted API.** [OpenRouter](https://openrouter.ai/allenai/olmo-3.1-32b-think) still has model pages for Olmo 3 and 3.1, but no provider endpoints; Artificial Analysis also gives no Intelligence Index score, citing the lack of a public API. You self-host, or try it in the [Ai2 Playground](https://playground.allenai.org/).
- **Data is a first-class release.** The pretraining corpus Dolma 3 and the post-training data Dolci are on Hugging Face under ODC-BY; weights are Apache 2.0. The difference between the two licenses is covered under "Licensing, pricing, and deployment".

### Sub-lines and ecosystem

Ai2's [`allenai` organization on Hugging Face](https://huggingface.co/allenai) carries several more Olmo- and Molmo-branded lines. Check the base before you pick one: some sit on Olmo (fully open), others on Qwen (open weights only).

| Sub-line | Use | Language model base | License |
|---|---|---|---|
| [Molmo 2](https://allenai.org/blog/molmo2) (4B, 8B, O-7B) | Image, multi-image and video understanding, pointing and tracking | 8B on Qwen3-8B, 4B on Qwen3-4B; only Molmo 2-O 7B uses Olmo 3 7B Instruct | Apache 2.0, but trained on third-party datasets restricted to academic and non-commercial research |
| [MolmoWeb](https://allenai.org/blog/molmoweb) (4B, 8B) | Web agent that operates a browser from screenshots | Molmo 2 architecture (8B on Qwen3-8B) | Apache 2.0 |
| [MolmoAct 2](https://allenai.org/blog/molmoact2) | Vision-language-action (VLA) model for robots | Molmo 2-ER (embodied-reasoning Molmo 2) | Not stated on the model card |
| [SERA](https://huggingface.co/allenai/SERA-32B) (8B, 32B) | Coding agent, with a CLI that plugs into Claude Code | Qwen 3 | Apache 2.0 |
| [olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025) | PDF and scanned-document OCR | Qwen2.5-VL-7B | Apache 2.0 |
| [Tülu 3](https://allenai.org/blog/tulu-3) | Open post-training recipe (SFT→DPO→RLVR) | Llama 3.1 | Llama 3.1 license |

OlmoEarth (satellite embeddings), Bolmo (byte-level models) and ACE2 (climate simulation) also come from Ai2, but they are far from agent model selection and are not covered here.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| OLMo | 2024-02 | Ai2's first language model released together with its training data (Dolma), training code and evaluation | — |
| OLMoE | 2024-09 | 7B total, 1B active MoE; the first fully open MoE on the performance/size frontier | — |
| Molmo | 2024-09 | First vision-language model with the open image-text data PixMo; pioneered image pointing | — |
| Tülu 3 | 2024-11 | Published a full post-training recipe and introduced RLVR; built on Llama 3.1, then became the post-training backbone for OLMo | — |
| OLMo 2 | 2024-11 (7B, 13B) / 2025-03 (32B) | Ai2 calls the 32B the first fully open model to beat GPT-3.5 Turbo and GPT-4o mini on its academic benchmark suite | — |
| Olmo 3 | 2025-11-20 | Olmo's first Think reasoning models and first long-context support (65K); every stage released as a "model flow" | [Olmo 3 introduction](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) |
| Olmo 3.1 | 2025-12-12 | Longer RL for 32B Think, new 32B Instruct; the current flagships | — |
| Molmo 2 | 2025-12-11 | Extended from images to video and multi-image input, with video tracking | — |
| Olmo Hybrid | 2026-03-05 | 7B hybrid RNN; Ai2's controlled study shows roughly twice the data efficiency of Olmo 3 | — |
| MolmoWeb | 2026-03-24 | Web agent with open training data, without distilling from proprietary agents | — |
| MolmoAct 2 | 2026-05-05 | Robotics model moved to a Molmo 2-ER base, with action inference down to about 180 ms | — |

The two-year arc is "a widening scope of what is public": from weights plus data, to the post-training recipe (Tülu 3), to checkpoints for every training stage (Olmo 3's model flow). The other arc is scale: OLMo 2's 32B was the first large version, 32B became the main size with Olmo 3, and the next generation moves to MoE. Olmo 3 32B Think has been superseded by 3.1 and appears in the evaluation table below only as a reference point; for Olmo 3's data and model flow, see this site's ["How to build a fully transparent LLM"](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en).

## Architecture and training trade-offs

### Olmo 3: a conservative dense Transformer

The [Olmo 3 technical report](https://arxiv.org/abs/2512.13961) and [model card](https://huggingface.co/allenai/Olmo-3-1125-32B) describe a conservative design:

- **Dense decoder-only Transformer.** 7B has 32 layers with 32 query heads and 32 KV heads; 32B has 64 layers with 40 query heads and 8 KV heads (GQA).
- **Sliding-window attention.** Three of every four layers attend only to the previous 4,096 tokens, and the last layer always uses full attention. Pretraining and midtraining use an 8,192-token context; the long-context stage applies YaRN to the full-attention layers only and ends at 65,536.
- **Three pretraining stages.** The first stage trains on Dolma 3 Mix, a roughly 5.9-trillion-token mix drawn from the roughly 9.3-trillion-token Dolma 3 pool. Midtraining uses Dolmino: 100 billion tokens of math, code, reading comprehension and reasoning traces sampled from a 2.2-trillion-token pool. Long-context extension uses Longmino, about 50 billion tokens from a 639-billion-token pool of long documents. The model card lists actual training totals of 5.93 trillion tokens for 7B and 5.50 trillion for 32B.
- **Three post-training stages.** Every path runs SFT → DPO → RLVR on data collectively called Dolci. Think learns long reasoning; Instruct produces shorter output aimed at chat and tool calling; RL Zero skips SFT and runs RLVR straight from Base as a research control.

The trade-off: no MoE, no multimodality, and only 65K of context, in exchange for a clean baseline that is easy to study and reproduce. Ai2's [blog post](https://allenai.org/blog/olmo3) explains the 32B choice: big enough to be competitive, small enough that most research teams can fine-tune and deploy it.

### What "fully open" actually covers

The [Olmo 3 release post](https://allenai.org/blog/olmo3) lists four layers of release:

- **Weights and checkpoints**: Base, after midtraining, after long-context extension, plus SFT, DPO and RLVR checkpoints for each post-training path. Pass a `revision` (for example `stage1-step10000`) on Hugging Face to load an intermediate version.
- **Data**: every Dolma 3 stage mix (from a few billion up to 6 trillion tokens) and the Dolci post-training sets.
- **Code**: the OLMo-core pretraining framework, Open Instruct for post-training, datamap-rs for cleaning, duplodocus for deduplication, OLMES for evaluation, and decon for removing test-set contamination.
- **Tracing**: OlmoTrace links model output back to training data in real time and runs directly in the Ai2 Playground.

That is what lets Olmo do something other open-weight models cannot: you can swap in your own domain data at midtraining and retrain, or fork before RLVR and rerun post-training with your own reward function.

### Olmo Hybrid and the next generation

[Olmo Hybrid](https://allenai.org/blog/olmohybrid) replaces Olmo 3 7B's sliding-window attention layers with Gated DeltaNet, a linear RNN that still trains in parallel. Three DeltaNet layers alternate with one attention layer, and everything else follows the Olmo 3 recipe. Ai2's controlled comparison found that it reaches the same MMLU accuracy with 49% fewer tokens, and that RULER at 64K context rises from 70.9 for Olmo 3 7B to 85.0 (with DRoPE). The training total is stated two ways: the [model card](https://huggingface.co/allenai/Olmo-Hybrid-7B) spec table says 5.5 trillion tokens, the blog says 6 trillion; this post follows the model card.

For now this line is research, not a product: Ai2 released Base, Think SFT and Instruct SFT/DPO, with no final RLVR version, and it needs transformers 5.3.0 or later. Its significance is as a preview of the next generation. Ai2's [COLM 2026 recap](https://allenai.org/blog/colm-2026-recap) says the next Olmo is in pretraining with a hybrid MoE architecture, and [Olmo-core 3](https://allenai.org/blog/olmocore3) is the MoE training framework built for it, aiming at Ai2's largest dataset and longest context yet.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/olmo-3-1-32b-think) has no Intelligence Index score for Olmo 3.1 because there is no public API to test. It does publish an [Openness Index](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index) covering weights, licensing, data and methodology disclosure: Olmo 3.1 32B Think and Instruct and Olmo 3 7B all score 89, tied for first with Swiss AI's Apertus and MBZUAI's K2-V2. They miss full marks because the data license scores only 1 point (commercial use with attribution required), matching ODC-BY's attribution requirement. Molmo 2 8B, built on Qwen3-8B, scores 72; the gap is the base model's unpublished data.

In other words, a third party can confirm how open it is, not how strong it is. The capability numbers below are all Ai2's own.

### Vendor-reported: Olmo 3.1 32B Think

From the [Olmo 3.1 32B Think model card](https://huggingface.co/allenai/Olmo-3.1-32B-Think). All numbers are Ai2's own runs; the recommended settings are temperature 0.6, top_p 0.95 and up to 32,768 output tokens:

| Benchmark | Olmo 3 32B Think | Olmo 3.1 32B Think | Qwen 3 32B | DeepSeek-R1-Distill-Qwen-32B |
|---|---|---|---|---|
| AIME 2025 | 72.5 | 78.1 | 70.9 | 56.3 |
| OMEGA | 50.8 | 53.4 | 47.7 | 38.9 |
| ZebraLogic | 76.0 | 80.1 | 88.3 | 69.4 |
| LiveCodeBench v3 | 83.5 | 83.3 | 90.2 | 79.5 |
| IFEval | 89.0 | 93.8 | 86.5 | 78.7 |
| IFBench | 47.6 | 68.1 | 37.3 | 23.8 |
| MMLU | 85.4 | 86.4 | 88.8 | 88.0 |
| GPQA | 58.1 | 57.5 | 67.3 | 61.8 |

How to read it:

- **3.1's gains are in math and instruction following.** The longer RL run adds 5.6 points on AIME 2025 and 20.5 on IFBench, while GPQA and LiveCodeBench stay flat.
- **Knowledge and coding still trail Qwen 3 32B.** GPQA is about 10 points behind and LiveCodeBench about 7. Ai2 describes this as "narrowing the gap", while training on roughly a sixth of Qwen 3's tokens.
- **The comparison set stops in 2025.** The card compares against the Qwen 3 and Gemma 3 generation, not 2026 models; against today's open-weight frontier the gap is only larger.

### Vendor-reported: tool calling in Olmo 3.1 32B Instruct

Tool calling, the number agent developers care about most, is not on the model card; it is in Table 25 of the [technical report](https://arxiv.org/abs/2512.13961). Olmo 3.1 32B Instruct scores 58.8 on BFCL against 63.1 for Qwen 3 32B (no reasoning). On the literature-search task LitQA2, Olmo 3.1's 55.6 is higher than Qwen 3 32B's 46.7. The gap is wider at 7B: Olmo 3 7B Instruct scores 49.8 on BFCL, Qwen 3 8B 60.2.

### Molmo 2 and MolmoWeb

The [Molmo 2 model card](https://huggingface.co/allenai/Molmo2-8B) compares averages over 15 academic benchmarks: Molmo 2 8B 63.1, 4B 62.8, and the fully open Molmo 2-O 7B 59.7; the same-size Qwen3-VL-8B scores 59.5 and GPT-5 70.6. [MolmoWeb 8B](https://huggingface.co/allenai/MolmoWeb-8B) reaches 78.2% single-attempt success on WebVoyager and 94.7% with best-of-4; on the harder Online-Mind2Web it scores 35.3% (60.5% best-of-4). Both are vendor-reported.

## Licensing, pricing, and deployment

### Three layers of terms: weights, data, usage guidelines

| Layer | Terms | Practical effect |
|---|---|---|
| Weights and code | Apache 2.0 (stated on each model card) | Commercial use, fine-tuning and redistribution allowed; keep the license and change notices |
| Training data (Dolma 3, Dolci) | [ODC-BY](https://huggingface.co/datasets/allenai/dolma3_pool) (as tagged on the Hugging Face datasets) | Commercial use allowed, but distributing the data or derived data requires attribution; third-party rights in the underlying content are separate |
| Usage guidelines | [Ai2 Responsible Use Guidelines](https://allenai.org/responsible-use) | Model cards say "intended for research and educational use"; the guidelines place no limits on pure research use and list disallowed uses outside research (harassment, fraud, malicious code, political manipulation and more) |

Compared with other "open source" models in this series, Olmo's weight license has no monthly-user or revenue thresholds and no regional exclusions. Watch the sub-lines. Tülu 3's weights derive from Llama 3.1 and carry the Llama 3.1 license. Molmo 2 8B, MolmoWeb and SERA have Apache 2.0 weights, but their base is Qwen, and Ai2 cannot publish Qwen's pretraining data. The Molmo 2 model cards also note that the training data includes third-party datasets "subject to academic and non-commercial research use only" and ask users to review the sources; clear that before any commercial use. For general guidance on reading licenses, see the [open-source AI licensing guide](/posts/ai/2026-08-26-open-source-ai-licensing-guide-en).

### Pricing and hosting

There is no API price to cite today. OpenRouter's pages for Olmo 3/3.1 and Molmo 2 still exist, but their provider endpoint lists are empty, and Hugging Face inference providers currently have no working Olmo endpoint either. When Olmo 3.1 launched, Ai2 wrote that it was available "via API courtesy of our inference partners"; check the current provider list when you choose, rather than assuming an endpoint exists.

### Self-hosting

- **Frameworks**: Olmo 3 and 3.1 need transformers 4.57.0 or later, and the model cards include a vLLM example; Olmo Hybrid needs transformers 5.3.0 or later.
- **Memory**: 32B is dense, so BF16 weights take about 64 GB; a single 80 GB GPU holds them but leaves little room for context. Community GGUF builds (bartowski, unsloth) and LM Studio MLX quantizations run on high-memory Macs or consumer GPUs.
- **Fine-tuning**: the model cards include an 8-GPU OLMo-core training command, and you can start from any intermediate checkpoint.

## Agent integration and selection

- **You need to audit training data or reproduce training** (academic research, regulated industries, contamination investigations) → Olmo 3.1 32B Think or Instruct. This is Olmo's core use, and no other open-weight model offers this layer.
- **You want to redo midtraining or RL on your own domain data** → fork from Olmo 3 Base or an intermediate checkpoint; that is far more room than models that only allow last-stage fine-tuning.
- **General tool-calling agent, open data not required** → evaluate open-weight models such as [Qwen 3](/posts/tech/2026-08-24-ai-model-family-qwen-en) first; Olmo 3.1 32B Instruct trails by about 4 points on BFCL.
- **You care about openness but want a bigger model** → most [NVIDIA Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron-en) models score 83 on the Openness Index, second only to the 89-point group, and the line includes 120B and 550B MoE sizes.
- **Self-hosted web agent** → MolmoWeb 8B, which clicks, types and scrolls from screenshots, with open training data and code; its base is Qwen3-8B.
- **Video understanding, counting or object tracking** → Molmo 2 8B; if the whole stack must be open, Molmo 2-O 7B, at the cost of about 3 points on the average. Both include non-commercial third-party training data, so check before commercial use.
- **Chinese, multilingual work, or documents longer than 65K** → not a fit; Olmo 3 is English only with a 65,536-token limit.
- **You do not want to self-host** → there is no hosted endpoint today; pick another family.

A minimal selection check: serve Olmo 3.1 32B Instruct with vLLM, send your tool schemas and 20 real tasks to it and to Qwen 3 32B, and compare tool-call format errors and task completion. Then take a few wrong answers to the Ai2 Playground and use OlmoTrace to see which training documents the output traces back to. The first step tells you whether it is good enough; the second is the layer of value only Olmo provides.

## Limitations and trade-offs

- **Capability trails the same-size frontier.** The vendor tables show it behind Qwen 3 32B on GPQA, LiveCodeBench and BFCL, against a comparison set that stops in 2025, and Artificial Analysis has no capability score to cross-check.
- **Evaluations are almost all vendor-reported.** A third party can confirm only openness; test capability yourself.
- **English only, 65K context, knowledge to December 2024.** Those three rule out multilingual support, long documents and tasks that need recent knowledge.
- **No hosted API.** Budget for self-hosting hardware and operations.
- **"Fully open" covers the main line and only some sub-lines.** Molmo 2 8B/4B, MolmoWeb, SERA and olmOCR sit on Qwen bases, so only the layer Ai2 added on top has open training data; Molmo 2 also includes non-commercial third-party data.
- **The next generation has no schedule.** The hybrid-MoE Olmo is still in pretraining, with no published specs or release date; adopt Olmo 3.1 now and expect a generational change within a year.

OLMo's value is not on the leaderboard; it is one of the few models you can trace from the first token to the last checkpoint. For teams that need that transparency, it has almost no substitute; for teams that only want capability and hosting convenience, there are better choices.

## References

- [Olmo 3: Charting a path through the model flow — Ai2 blog (with the Olmo 3.1 update)](https://allenai.org/blog/olmo3)
- [Olmo 3 technical report — arXiv 2512.13961](https://arxiv.org/abs/2512.13961)
- [allenai/Olmo-3.1-32B-Think — Hugging Face model card](https://huggingface.co/allenai/Olmo-3.1-32B-Think)
- [allenai/Olmo-3.1-32B-Instruct — Hugging Face model card](https://huggingface.co/allenai/Olmo-3.1-32B-Instruct)
- [allenai/Olmo-3-1125-32B — Hugging Face model card (Base specs)](https://huggingface.co/allenai/Olmo-3-1125-32B)
- [allenai/Olmo-3-7B-Instruct — Hugging Face model card](https://huggingface.co/allenai/Olmo-3-7B-Instruct)
- [allenai/dolma3_pool — Hugging Face dataset (ODC-BY)](https://huggingface.co/datasets/allenai/dolma3_pool)
- [Introducing Olmo Hybrid — Ai2 blog](https://allenai.org/blog/olmohybrid)
- [allenai/Olmo-Hybrid-7B — Hugging Face model card](https://huggingface.co/allenai/Olmo-Hybrid-7B)
- [Introducing Olmo-core 3 — Ai2 blog](https://allenai.org/blog/olmocore3)
- [Ai2 at COLM 2026 — Ai2 blog](https://allenai.org/blog/colm-2026-recap)
- [Molmo 2 — Ai2 blog](https://allenai.org/blog/molmo2)
- [allenai/Molmo2-8B — Hugging Face model card](https://huggingface.co/allenai/Molmo2-8B)
- [MolmoWeb — Ai2 blog](https://allenai.org/blog/molmoweb)
- [allenai/MolmoWeb-8B — Hugging Face model card](https://huggingface.co/allenai/MolmoWeb-8B)
- [MolmoAct 2 — Ai2 blog](https://allenai.org/blog/molmoact2)
- [allenai/SERA-32B — Hugging Face model card](https://huggingface.co/allenai/SERA-32B)
- [allenai/olmOCR-2-7B-1025 — Hugging Face model card](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [Tülu 3 — Ai2 blog](https://allenai.org/blog/tulu-3)
- [Tülu 3 paper — arXiv 2411.15124](https://arxiv.org/abs/2411.15124)
- [OLMo 2 — Ai2 blog](https://allenai.org/blog/olmo2)
- [OLMo 2 32B — Ai2 blog](https://allenai.org/blog/olmo2-32B)
- [OLMo 2 paper — arXiv 2501.00656](https://arxiv.org/abs/2501.00656)
- [OLMo paper — arXiv 2402.00838](https://arxiv.org/abs/2402.00838)
- [OLMoE paper — arXiv 2409.02060](https://arxiv.org/abs/2409.02060)
- [Molmo and PixMo paper — arXiv 2409.17146](https://arxiv.org/abs/2409.17146)
- [Ai2 Responsible Use Guidelines](https://allenai.org/responsible-use)
- [AllenAI: Olmo 3.1 32B Think — OpenRouter](https://openrouter.ai/allenai/olmo-3.1-32b-think)
- [Olmo 3.1 32B Think — Artificial Analysis](https://artificialanalysis.ai/models/olmo-3-1-32b-think)
- [Artificial Analysis Openness Index](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index)
- [Ai2 Playground](https://playground.allenai.org/)
- [OLMo: the language model family that open-sources even its training data](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) — this site
- [How to build a fully transparent LLM: OLMo 3's model flow and LLM360 K2](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) — this site
- [Open-source AI licensing guide](/posts/ai/2026-08-26-open-source-ai-licensing-guide-en) — this site
- [Qwen model family](/posts/tech/2026-08-24-ai-model-family-qwen-en) — this site
- [NVIDIA Nemotron model family](/posts/tech/2026-10-10-ai-model-family-nemotron-en) — this site
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
