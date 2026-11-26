---
title: "MiniCPM: MiniCPM5 Text Models, MiniCPM-V 4.7 Multimodal and OCR, an On-Device Family Under Plain Apache 2.0"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, openbmb, open-source, model-family-minicpm, on-device, multimodal, model-selection]
lang: en
type: deep-dive
tldr: "MiniCPM is the on-device model family from ModelBest, Tsinghua University and the OpenBMB community. The current lineup is the MiniCPM5-2B and 1B text models, MiniCPM-V 4.7 multimodal (a 35B-A3B MoE and a 1B), MiniCPM-OCR 1.0 for document parsing, and the full-duplex MiniCPM-o 4.5, all under Apache 2.0 with no extra terms. MiniCPM5-2B scored 15 on Artificial Analysis v4.2, the highest of any open-weights model under 4B; its strengths are tool calling and agent tasks, while knowledge and terminal coding stay weak. It is not on OpenRouter, so access is mostly self-hosting or ModelBest's own platform."
description: "The MiniCPM (OpenBMB / ModelBest) model family: positioning and specs for MiniCPM5, MiniCPM-V 4.7, MiniCPM-OCR and MiniCPM-o 4.5, training and on-device inference design, vendor and Artificial Analysis evaluations, licensing, credit-based platform pricing, Hugging Face and Ollama adoption numbers, car and phone deployments, and agent selection."
series:
  name: "AI Model Families"
  order: 41
draft: false
glossary:
  - term: "OPD (On-Policy Distillation)"
    aliases: ["On-Policy Distillation"]
    definition: "Training a student on samples it generates itself, using the teacher's distribution at the same positions as the signal (MiniCPM5 uses full-vocabulary reverse KL); MiniCPM5 uses it to merge several RL expert models back into one release model"
  - term: "LES (Lookahead Expert Scheduling)"
    aliases: ["Lookahead Expert Scheduling"]
    definition: "MiniCPM-V 4.7 35B-A3B's on-device MoE inference technique: cross-layer routing prediction preloads expert weights the next layer will likely need, so loading overlaps with compute; predictions only affect prefetch order, actual routing is unchanged"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-minicpm)

MiniCPM is a family of small models built by ModelBest (面壁智能) together with Tsinghua University and the OpenBMB open-source community, aimed at running locally on phones, PCs and in-car systems without the cloud. This post is for agent developers who want a model on the device: which product line to pick now, where each is strong or weak, and how the family compares with other small-model families such as [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen-en), [Gemma](/posts/tech/2026-09-19-ai-model-family-gemma-en) and [Liquid AI LFM](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en).

As of November 2026 there are four active lines: MiniCPM5 for text (2B released in September), MiniCPM-V 4.7 for multimodal (October), MiniCPM-OCR for document parsing (late October), and MiniCPM-o 4.5, which can watch, listen and speak at the same time (February). The VoxCPM speech-synthesis models come from the same organization and only appear in the matrix here.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

What the lines share is an on-device-first approach: every model ships quantized variants such as GGUF, MLX or int4, with deployment guides for llama.cpp, Ollama, vLLM and SGLang. Weights live in the [`openbmb` organization](https://huggingface.co/openbmb) on Hugging Face.

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| MiniCPM5-2B (`openbmb/MiniCPM5-2B`) | Main text model | About 2.5B dense, standard Llama architecture, 131K context; one checkpoint switches thinking on or off; native tool calling | Weights (Apache 2.0) + ModelBest platform API |
| MiniCPM5-1B | Smaller text model | About 1.08B, 131K context, same training recipe | Weights + API |
| MiniCPM-V 4.7 35B-A3B | Multimodal flagship | First MoE in MiniCPM-V (35B total, about 3B active); images, multiple images, video; ModelBest says it runs at 13+ tokens/s in 3GB of memory on an iPhone 17 Pro Max | Weights + API (currently free for a limited time) |
| MiniCPM-V 4.7 1B | Phone-class multimodal | 1B class; visual tokens can be compressed 4x or 16x | Weights + API (currently free for a limited time) |
| MiniCPM-OCR 1.0 / OCR Jev | Document parsing and result checking | A 1.3B parsing model plus a 2B model that scores whether an OCR result is correct | Weights + API + SDK |
| MiniCPM-o 4.5 | Full-duplex voice and video interaction | 9B; takes live audio and video streams while producing speech and text | Weights + API |
| VoxCPM2 | Speech synthesis | 2B, 30 languages, voice design and cloning | Weights + API; see [speech and audio models](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) |

Two things to know first:

- **The text and multimodal lines sit on different foundations.** [MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) is a `LlamaForCausalLM` that ModelBest pretrained itself. The [MiniCPM-V 4.7](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B) model card says its language backbone comes from Qwen3.5 / Qwen3.6 and its vision module is SigLIP2; OCR 1.0 and OCR Jev are also built on Qwen3.5. The multimodal line's language ability is therefore tied to Qwen's generations.
- **No OpenRouter.** OpenRouter's model list has no MiniCPM entry. The only hosted API is ModelBest's own [open platform](https://platform.modelbest.cn/console/docs/models); most users download the weights and self-host.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| MiniCPM-2B | 2024-02 | First generation; a 2B model with public benchmark scores close to Mistral-7B | — |
| MiniCPM-Llama3-V 2.5 / MiniCPM-V 2.6 | 2024-05 / 2024-08 | The multimodal line takes shape, with 8B-class models running on phones; V 2.6 is still the most-downloaded MiniCPM on Ollama | — |
| MiniCPM3-4B | 2024-09 | Text line grows to 4B | — |
| MiniCPM-o 2.6 | 2025-01 | First "o" model: adds speech input and output | — |
| MiniCPM4 / 4.1 | 2025-06 / 2025-09 | 8B and 0.5B, pitched at 5x+ faster generation on edge chips; 4.1 adds trainable sparse attention and hybrid reasoning | — |
| MiniCPM-V 4.0 | 2025-07 | 4B multimodal with ModelBest's own MiniCPM4-3B as the language backbone | — |
| MiniCPM-V 4.5 | 2025-08 | 8B multimodal, backbone switched to Qwen3-8B, focused on high-frame-rate video understanding | — |
| MiniCPM-o 4.5 | 2026-02 | 9B full-duplex model that can watch, listen and speak up on its own; becomes the main model in car partnerships | — |
| MiniCPM-SALA | 2026-02 | Experimental 1M-context model mixing sparse and linear attention; runs a million tokens on a consumer GPU | — |
| VoxCPM2 | 2026-04 | Speech synthesis grows to 2B and 30 languages | — |
| MiniCPM-V 4.6 | 2026-05 | Qwen3.5-0.8B backbone plus SigLIP2, about 1.3B, runs on phones with 6GB of memory | — |
| MiniCPM5-1B | 2026-05 | New-generation text line; one checkpoint switches thinking modes | — |
| MiniCPM5-2B | 2026-09 | Scaled-up 1B; top third-party score among models under 4B | [Model card](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b-en) |
| MiniCPM-V 4.7 | 2026-10 | First MoE multimodal model (35B-A3B) plus a 1B; 35B total parameters on a phone | — |
| MiniCPM-OCR 1.0 / Jev | 2026-10 | Dedicated document parsing and result verification split out from the general multimodal line | — |

Two threads run through these two years. First, the product lines keep splitting: from a single text model into vision (V), omni (o), OCR, speech and robotics (MiniCPM-Robot). Second, the multimodal line has switched language backbones between in-house and external models (V 4.0 used ModelBest's own MiniCPM4-3B; from V 4.5 on it uses the Qwen3 series), while ModelBest puts its effort into visual compression and on-device inference so the models actually run on devices. Earlier generations' full evaluations are not repeated here; the third-party scores from MiniCPM5-2B's launch stay in the [model card](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b-en).

## Architecture and training trade-offs

### MiniCPM5: conservative architecture, effort on data and post-training

The [MiniCPM5-2B model card](https://huggingface.co/openbmb/MiniCPM5-2B) lists plain specs: standard `LlamaForCausalLM`, 42 layers, GQA (16 query heads, 2 KV heads), 2,516,756,480 parameters, 131,072-token context. The payoff of a standard architecture is compatibility: llama.cpp, Ollama, LM Studio, MLX and Google's LiteRT-LM all run it directly, with no wait for inference frameworks to support new operators. The cost is that nothing in the architecture saves KV cache, so you have to budget long-context memory yourself.

The differences are in data and post-training, and most of the datasets are public:

- **Tiered data management**: pretraining and mid-training corpora are graded by quality ([UltraData paper](https://arxiv.org/abs/2602.09003)); web, code and math sets are released as Ultra-FineWeb, UltraData-Code, UltraData-Math and others.
- **400B tokens of deep-thinking SFT**, followed by separate RL teacher models for math, code, agents, writing and other domains.
- **OPD merge**: 16 RL expert models (5 of them agentic) are merged back into one release model with on-policy distillation, using full-vocabulary reverse KL at each position as the advantage estimate. ModelBest says RL + OPD adds 10.96 points on average to reasoning benchmarks and 6.96 to agentic ones.
- **Open agent data**: 500K agent SFT samples (UltraData-SFT-Agent-2609) and 80K+ RL samples (UltraData-RL-2609).

For teams that want to fine-tune, this means the Base, Midtrain, SFT and final weights are all available, so you can take over from any stage.

### MiniCPM-V 4.7: fitting a 35B MoE into a phone

MoE saves compute in the cloud, but on a phone it creates a problem: each token may pick different experts, memory cannot hold every expert, and loading them from storage on demand stalls generation. The [MiniCPM-V 4.7 model card](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B) handles this with three pieces:

- **LES**: predicts across layers which experts the next layer will need and preloads them; computation still follows the original routing, and mispredicted experts are loaded as usual. On [GitHub](https://github.com/OpenBMB/MiniCPM-o) ModelBest reports about a 5x speedup on real devices.
- **Fine-grained layer-wise quantization**: compresses expert weights so each load moves less data.
- **DSpark speculative decoding**: a separate draft model that works alongside expert scheduling and quantization.

The result is ModelBest's claim of 13+ tokens per second in 3GB of memory on an iPhone 17 Pro Max. On the vision side it uses the in-ViT early compression from [LLaVA-UHD v4](https://github.com/THUMAI-Lab/LLaVA-UHD-v4) and lets developers choose 4x (more detail) or 16x (fewer tokens) compression per request. The cost: on-device speed depends on ModelBest's own [llama.cpp-omni](https://github.com/OpenBMB/llama.cpp-omni) fork and apps, and stock llama.cpp or Ollama may not have the same expert scheduling.

### MiniCPM-OCR: a two-stage pipeline plus a checking model

[MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) does not read a whole page end to end. PaddlePaddle's PP-DocLayoutV3 first cuts the page into layout regions with a reading order, then each region goes to the 1.3B recognition model. The separate [MiniCPM-OCR Jev](https://huggingface.co/openbmb/MiniCPM-OCR-Jev) replaces Qwen3.5-2B's output head with a binary classifier: given the region image and a candidate text, it returns a 0–1 score for whether the recognition is correct, which you use to auto-accept regions or send them to human review. Splitting "recognize" and "judge whether recognition is right" into two models costs an extra PaddlePaddle environment in deployment.

### MiniCPM-o 4.5: full duplex costs size

[MiniCPM-o 4.5](https://huggingface.co/openbmb/MiniCPM-o-4_5) chains SigLIP2, Whisper-medium, CosyVoice2 and Qwen3-8B into about 9B, aligns all input and output streams at millisecond resolution, and decides once per second whether to speak up. It can judge when to respond before the user has finished, but 9B is large for current in-car chips; ModelBest's co-founder said in an [interview with China Economic Net](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml) (in Chinese) that deployment needs the next generation of cockpit chips.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis's September 2026 write-up](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b) gave MiniCPM5-2B 15 on Intelligence Index v4.2, the highest of any open-weights model under 4B; second place, Granite 4.2 3B, scored 11. Details:

- **Agent tasks are the strength**: GDPval-AA v2 Elo 831, the lead among models under 4B; τ³-Bench Banking 21%, tied for first with Ling 3.0 Tiny.
- **Knowledge, terminal coding and scientific reasoning are the weaknesses**: Humanity's Last Exam 9%, Terminal-Bench v2.1 9%, CritPt 0%.
- **It abstains when unsure**: on AA-Omniscience it answers only 29% of questions, for a 78% non-hallucination rate; its 8% accuracy is low in itself.
- **Token-efficient**: 19k output tokens per index task on average, 11k of them reasoning.

Mind the version: Artificial Analysis's current v5.0.1 [model page](https://artificialanalysis.ai/models/minicpm5-2b) lists no index score for MiniCPM5-2B. The 15 is a v4.2 result and cannot be compared directly with v5 scores. MiniCPM-V 4.7, OCR 1.0 and o 4.5 have no Artificial Analysis scores yet.

### Vendor-reported: MiniCPM5-2B against small peers

From the [MiniCPM5-2B model card](https://huggingface.co/openbmb/MiniCPM5-2B). Numbers marked † are Artificial Analysis figures cited in the card; the rest were re-run internally by ModelBest:

| Benchmark | MiniCPM5-2B | LFM2.5-2.6B | Qwen3.5-2B | Gemma-4-E2B-it | Qwen3.5-4B (reference) |
|---|---|---|---|---|---|
| Table average | 53.9 | 33.2 | 28.0 | 24.6 | 51.1 |
| LiveCodeBench v6 | 69.1 | 42.1 | 20.2 | 42.9 | 56.4 |
| AIME 2026 | 86.5 | 45.2 | 29.0 | 39.8 | 82.7 |
| IFEval | 86.7 | 93.4 | 77.5 | 31.4 | 90.2 |
| MMLU-Pro | 70.8 | 65.2 | 64.3 | 56.0 | 78.0 |
| AA-LCR † | 59.0 | 5.3 | 28.7 | 17.0 | 61.0 |
| BFCL v4 | 66.6 | 61.1 | 43.6 | 36.6 | 56.8 |
| SWE-bench Verified | 46.4 | 6.0 | 5.0 | 2.0 | 33.6 |
| Terminal-Bench v2.1 † | 8.6 | 4.5 | 3.0 | 0.4 | 25.8 |
| GAIA (Text-103) | 88.7 | 49.5 | 47.9 | 30.1 | 78.6 |

How to read it:

- **Math, code and agent tasks lead the class by a wide margin.** SWE-bench Verified 46.4 even beats the Qwen3.5-4B reference column, but it is self-reported and has not been re-run by a third party.
- **Instruction following and knowledge are not first.** IFEval loses to LFM2.5-2.6B, and MMLU-Pro and Terminal-Bench v2.1 trail Qwen3.5-4B clearly, matching Artificial Analysis's conclusion.
- **Cross-vendor tables do not always agree.** The Raon-1 vendor table cited in this site's [Korean models post](/posts/tech/2026-11-23-ai-model-family-korea-models-en) puts MiniCPM5 2B at 61.0 on BFCL v4, while ModelBest's own table says 66.6. Say whose table a number comes from.

### Vendor-reported: MiniCPM-V 4.7 35B-A3B

The comparison table in the [MiniCPM-V 4.7 model card](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B) is all instruct mode and mixes "public reports" with "ModelBest's local re-runs" without marking which cell is which. MiniCPM-V 4.7 uses 4x visual compression here:

| Benchmark | MiniCPM-V 4.7 35B-A3B | Qwen3.6 35B-A3B | Qwen3.6 27B | Gemma-4 31B |
|---|---|---|---|---|
| MMBench | 91.72 | 86.76 | 85.11 | 89.63 |
| OCRBench v2 | 68.47 | 66.50 | 65.49 | 54.14 |
| OmniDocBench v1.6 | 94.24 | 80.17 | 82.14 | 79.17 |
| CharXiv (reasoning) | 75.60 | 67.50 | 68.50 | 65.00 |
| Video-MME (no subtitles) | 76.40 | 75.70 | 70.20 | 74.10 |
| ScreenSpot | 86.99 | 92.94 | 90.73 | 83.75 |
| MMLU-Pro (text only) | 83.45 | 84.11 | 84.52 | 84.43 |
| LiveCodeBench v6 (text only) | 56.57 | 54.29 | 59.05 | 71.24 |
| τ²-Bench (text only) | 84.65 | 79.65 | 79.70 | 67.35 |

How to read it: documents, charts and OCR account for the biggest gaps, with OmniDocBench 14 points above Qwen3.6 35B-A3B on the same backbone; GUI grounding (ScreenSpot) actually loses to Qwen; text-only ability roughly matches the backbone. ModelBest also plots score against inference time and says the 35B-A3B beats Qwen3.6 35B-A3B in instruct mode on both, while the 1B clearly beats Qwen3.5 0.8B.

### MiniCPM-OCR

ModelBest reports that [MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) scores 93.68 on Real5-OmniDocBench (real-world captured documents) and 54.7 on OCRBench v2, and processes 1.2 pages per second on an RTX 5090 at image-level concurrency 1, about 1.49x PaddleOCR-VL-1.6 and 3.62x MinerU2.5 Pro. [OCR Jev](https://huggingface.co/openbmb/MiniCPM-OCR-Jev) reaches an AUROC of 93.6 for judging correctness on ModelBest's own JevOCRBench, close to Qwen3.5-397B-A17B's 93.8. Both rest on in-house benchmarks or self-reported settings; re-test on your own samples before switching document types.

## Licensing, pricing, and deployment

### License: Apache 2.0 across the lineup, no extra terms

The active MiniCPM5, MiniCPM-V 4.7, MiniCPM-OCR, MiniCPM-o 4.5 and VoxCPM2 repos all carry `apache-2.0` in their Hugging Face metadata. The HF repos have no LICENSE file of their own; the model cards' License sections link to the GitHub repos for [MiniCPM](https://github.com/OpenBMB/MiniCPM/blob/main/LICENSE), [MiniCPM-V](https://github.com/OpenBMB/MiniCPM-V/blob/main/LICENSE), [MiniCPM-OCR](https://github.com/OpenBMB/MiniCPM-OCR/blob/main/LICENSE) and others, whose full text is standard Apache 2.0 with no revenue threshold, user-count threshold or regional restriction. Older weights such as MiniCPM-V 2.6 carry no license field; check their terms separately before using them.

The multimodal line's language backbone comes from Qwen3.5 / 3.6, and ModelBest releases the full weights under Apache 2.0; if your legal team wants to trace upstream, check the license of the corresponding Qwen version separately.

### API: ModelBest's platform, priced in credits

[ModelBest's open platform](https://platform.modelbest.cn/console/docs/models) (in Chinese) offers an OpenAI-compatible `https://api.modelbest.cn/v1`, with prices listed in "credits per million tokens":

| Model | Input | Output | Notes |
|---|---|---|---|
| MiniCPM5-2B | 0.15 | 0.3 | 128K context |
| MiniCPM5-1B | 0.1 | 0.2 | 128K context |
| MiniCPM-V 4.7 35B-A3B / 1B | Free for a limited time | Free for a limited time | 256K context |
| MiniCPM-OCR 1.0 / Jev | Free for a limited time | Free for a limited time | |
| MiniCPM-o 4.5 Realtime | 3 | 9 | Live voice and video |
| VoxCPM2 | 1 | 8 | |

The platform docs do not state how credits convert to currency, and the default limit is 30 requests per minute; confirm actual charges in the console before adopting it. The platform suits trials and comparisons; it is not the main way MiniCPM is used.

### Self-hosting and on-device

- **Text line**: the official MiniCPM5 GitHub has deployment guides for vLLM, SGLang, llama.cpp, Ollama, LM Studio, MLX, LiteRT-LM (Android / iOS) and vLLM Ascend, each with a Skill file an agent can read directly. For tool calling, use SGLang's `minicpm5` parser.
- **Chinese chips**: the model card lists FlagOS builds for NVIDIA, Hygon, MetaX, Iluvatar, Moore Threads, Kunlunxin, Ascend, Arm v9 and others.
- **Multimodal line**: MiniCPM-V 4.7 supports iOS, Android and HarmonyOS, with launch-day support for Rockchip, Houmo, Intel, AMD and Arm chips; there is an OpenVINO build for Intel platforms.

### Adoption

Hugging Face downloads are for the last 30 days (fetched 2026-11-23) and cover only the language and multimodal lines:

| Line | HF 30-day downloads (all variants) | Derivatives (models listing the main model as base_model, excluding openbmb's own) | Ollama downloads |
|---|---|---|---|
| MiniCPM-V 4.7 | about 2.75M | 35B-A3B 83, 1B 79 | 7,605 (openbmb/minicpm-v4.7) |
| MiniCPM5 | about 2.36M | 2B 284, 1B 242 | 16.3K (minicpm5-2b) + 13.2K (minicpm5) |
| MiniCPM-OCR | about 0.64M | 15 | 1,616 |
| MiniCPM-V 4.6 | about 0.35M | 54 | 106.1K (official library minicpm-v4.6) |
| MiniCPM-o 4.5 | about 0.30M | 24 | 10.2K |

The biggest cumulative number on Ollama belongs to an old release: the official library's `minicpm-v` (8B, V 2.6 era) has 5.8M downloads. Most MiniCPM5-2B derivatives on HF are community quantizations and uncensored variants (names like abliterated and heretic also show up on Ollama).

Device deployments come from ModelBest and press reports:

- **Cars**: [Xinhua](https://www.news.cn/auto/20260719/bcf02346528a4cf0873587c164e8fa7e/c.html) (in Chinese) covered ModelBest's July WAIC event: MiniCPM ships in the cockpits of the Geely Galaxy M9 and Changan Mazda EZ-60, and ModelBest said its open-source models had passed 38 million cumulative downloads (company figure, through 2026-06-30). [China Economic Net](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml) (in Chinese) lists the carmakers with confirmed programs: Geely, SAIC Volkswagen, GAC, Great Wall and Changan Mazda, with the EZ-60 the first production model.
- **Phones**: [ModelBest's website](https://modelbest.cn/) says MiniCPM was the on-device model provider when Samsung Galaxy AI completed China's generative-AI filing. Samsung has not said which devices or features use it, and reports such as [KrASIA](https://kr-asia.com/modelbests-on-device-ai-model-is-coming-to-samsung-smartphones) note the details are undisclosed.
- **Chips and Tier 1s**: at the Beijing auto show ModelBest signed agreements with Aptiv and TINNOVE, pushing MiniCPM-o 4.5 into cockpit AI boxes.

## Agent integration and selection

- **Local agents and tool calling on phones or PCs** → MiniCPM5-2B. It has the best tool-calling and agent scores under 4B, 131K context and Apache 2.0; pair it with SGLang's `minicpm5` parser to get OpenAI-format `tool_calls`.
- **Only a few GB of memory and basic Q&A** → MiniCPM5-1B, or compare quality against MiniCPM5-2B's 4-bit quantization before deciding.
- **Reading images, screenshots or video on the device** → MiniCPM-V 4.7 1B; if you need more and can afford 3GB+ of memory and the dedicated inference fork → 35B-A3B.
- **Converting many documents to Markdown and knowing which parts may be wrong** → MiniCPM-OCR 1.0 with Jev, using Jev's score as a threshold to send low-confidence regions to people.
- **Voice assistants or cockpit interaction that can be interrupted and speak up proactively** → MiniCPM-o 4.5, provided the hardware can hold 9B.
- **Heavy factual knowledge or terminal-driven coding agents** → not MiniCPM5; it trails larger models clearly on Terminal-Bench and HLE, so use a cloud model or an open-weights model of at least 9B.
- **Must use a hosted API with multi-provider failover** → MiniCPM is a poor fit: it is not on OpenRouter, and ModelBest is the only host.

A minimal selection check: run your own tool list through MiniCPM5-2B with thinking on and off (`enable_thinking`) and compare tool-call format accuracy, completion rate and output tokens; then quantize the same task set to 4-bit on the target device and see how much speed and quality drop. On-device models usually hit their limits on post-quantization quality and heat, not on benchmarks.

## Limitations and trade-offs

- **The small-model knowledge ceiling.** Third-party and vendor tables both show MiniCPM5-2B is weak on HLE, Terminal-Bench and CritPt; its high scores are concentrated in tool calling and agent workflows, so do not use it as a knowledge source on its own without retrieval.
- **Evaluations are mostly self-reported.** MiniCPM-V 4.7, OCR and o 4.5 have no third-party overall scores, and V 4.7's comparison table does not mark which cells were re-run and which were cited.
- **On-device speed depends on ModelBest's toolchain.** The 35B-A3B phone numbers rely on LES and ModelBest's llama.cpp fork; a generic inference framework may not reproduce them.
- **The multimodal line depends on Qwen.** Since V 4.5 the language backbone has been the Qwen3 series, so both the capability ceiling and the update pace follow upstream.
- **A single hosting channel.** There is no OpenRouter or other third-party host, and the API is priced in credits with no published conversion; teams needing an SLA and multi-provider failover have to self-host.
- **Deployment cases are mostly company statements.** The car and Samsung partnerships come from ModelBest and press reports; the exact model versions and feature scope are largely undisclosed.

MiniCPM's strategy comes down to this: instead of chasing large-model rankings, it maximizes how strong a model can be within a fixed memory budget, and trades Apache 2.0 plus thorough deployment guides for adoption by developers, carmakers and phone makers. For teams putting agents on devices, MiniCPM5-2B and MiniCPM-V 4.7 1B belong in the first round of tests; when you need knowledge depth or a hosted service, it is not the first choice.

## References

- [openbmb/MiniCPM5-2B — Hugging Face model card (specs, evaluation table, training recipe, deployment)](https://huggingface.co/openbmb/MiniCPM5-2B)
- [openbmb/MiniCPM5-1B — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM5-1B)
- [openbmb/MiniCPM-V-4.7-35B-A3B — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B)
- [openbmb/MiniCPM-V-4.7-1B — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-V-4.7-1B)
- [openbmb/MiniCPM-V-4.6 — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-V-4.6)
- [openbmb/MiniCPM-OCR-1.0 — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-OCR-1.0)
- [openbmb/MiniCPM-OCR-Jev — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-OCR-Jev)
- [openbmb/MiniCPM-o-4_5 — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-o-4_5)
- [openbmb/MiniCPM-SALA — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-SALA)
- [openbmb/VoxCPM2 — Hugging Face model card](https://huggingface.co/openbmb/VoxCPM2)
- [OpenBMB/MiniCPM — GitHub (changelog, deployment and fine-tuning guides, LICENSE)](https://github.com/OpenBMB/MiniCPM)
- [OpenBMB/MiniCPM-o (MiniCPM-V) — GitHub (V 4.7 and o 4.5 docs and changelog)](https://github.com/OpenBMB/MiniCPM-o)
- [MiniCPM API Guide — GitHub](https://github.com/OpenBMB/MiniCPM-V/blob/main/docs/api.md)
- [OpenBMB/MiniCPM-OCR — GitHub](https://github.com/OpenBMB/MiniCPM-OCR)
- [OpenBMB/llama.cpp-omni (LES) — GitHub](https://github.com/OpenBMB/llama.cpp-omni)
- [UltraData: Tiered Data Management — arXiv 2602.09003](https://arxiv.org/abs/2602.09003)
- [LLaVA-UHD v4 — GitHub](https://github.com/THUMAI-Lab/LLaVA-UHD-v4)
- [Model list and pricing — ModelBest open platform (in Chinese)](https://platform.modelbest.cn/console/docs/models)
- [ModelBest website](https://modelbest.cn/)
- [OpenBMB releases MiniCPM5-2B — Artificial Analysis](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b)
- [MiniCPM5-2B — Artificial Analysis model page](https://artificialanalysis.ai/models/minicpm5-2b)
- [openbmb — Ollama](https://ollama.com/openbmb)
- [minicpm-v — Ollama official library](https://ollama.com/library/minicpm-v)
- [ModelBest on-device AI forum — Xinhua (in Chinese)](https://www.news.cn/auto/20260719/bcf02346528a4cf0873587c164e8fa7e/c.html)
- [Behind ModelBest's move into cars — China Economic Net (in Chinese)](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml)
- [ModelBest's on-device AI model is coming to Samsung smartphones — KrASIA](https://kr-asia.com/modelbests-on-device-ai-model-is-coming-to-samsung-smartphones)
- [Model card: MiniCPM5-2B](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
