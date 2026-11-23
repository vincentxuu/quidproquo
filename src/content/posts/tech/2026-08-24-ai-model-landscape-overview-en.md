---
title: "AI Model Landscape: The 2026 Map You Need"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: en
type: guide
tldr: "In 2026, AI models span seven major categories and more than 20 subcategories. This introduction to the AI Model Families series maps use cases to models and models to families, with selection advice for each use case. November 2026 edition: the closed frontier is now Claude Fable 5.2, GPT-6.2, and Gemini 4, the strongest open-weight model is Kimi K3.1 Pro, coding is compared using Artificial Analysis's Terminal-Bench 4.0 and FrontierCode 2.0, and decision models are added as a category; the image, video, speech, and retrieval sections now use 2026-11-23 leaderboards."
description: "A 2026 selection guide covering text generation, reasoning, code, images, video, speech, music, embeddings, reranking, OCR, 3D, translation, agents, and more than 20 AI model use cases."
series:
  name: "AI Model Families"
  order: 0
draft: false
glossary:
  - term: "VLM"
    def: "Vision-Language Model, a multimodal model that understands images and text together."
  - term: "MoE"
    def: "Mixture of Experts, an architecture with multiple parameter groups that activates only a subset per request, balancing capability and efficiency."
  - term: "pipeline_tag"
    def: "Hugging Face's task classification tag, used to group models by use case, such as text-generation or text-to-image."
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-landscape-overview)

This is the map for the “AI Model Families” series. Hugging Face has 47 task categories and more than three million models; add closed APIs and the ecosystem is too large for anyone to follow completely. This guide cuts across it by use case: seven categories and more than 20 subcategories, each with major models and selection advice, so you can move from “what do I need to do?” to “which model should I use?” The text, reasoning, coding, vision, and agent sections use data from 2026-11-20, and the image, video, speech, music, and retrieval sections use data from 2026-11-23; the remaining subsections, such as object detection, 3D, and translation, still use August 2026 data, so cite them with dates.

Each major family—Qwen, DeepSeek, Claude, GPT, and others—gets its own deep dive covering its evolution and version choices. For help reading the benchmark figures, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).


## 1. Core Text Capabilities

### Text Generation / Chat

As of November 2026, the closed frontier has turned over a full generation, and the strongest open-weight model is Kimi's. The top of the [Artificial Analysis Intelligence Index v5.0.1](https://artificialanalysis.ai/leaderboards/models) (2026-11-20) is Claude Fable 5.2 (64.6), GPT-6.2 Astra (62.1), Gemini 4 Neon (61.4), Gemini 4 Carbon (60.0), and Claude Opus 5.5 (59.1); the top open-weight model is Kimi K3.1 Pro (46.5), followed by DeepSeek V4.1 Flash (32.6) and GLM-5.3 (31.7) — still a clear gap.

| Family | Type | Current workhorses | Positioning |
|---|---|---|---|
| [Claude](/posts/tech/2026-08-24-ai-model-family-claude-en) (Anthropic) | Closed | Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5 | Agent/coding workhorse; first on the composite index |
| [GPT](/posts/tech/2026-08-24-ai-model-family-gpt-en) (OpenAI) | Closed + open | GPT-6.2 Astra/Sol, 6.1 Terra, 6 Luna; gpt-oss | Largest ecosystem; four price tiers with the widest coverage |
| [Gemini](/posts/tech/2026-08-24-ai-model-family-gemini-en) (Google) | Closed | Gemini 4 Carbon/Neon/Argon/Hydrogen | Most complete multimodality, 1M context |
| [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen-en) (Alibaba) | Closed flagship + open | Qwen4-Max (API); Qwen3.8 27B / Flash-Next (weights) | Widest size range; the flagship went back to closed |
| [Kimi](/posts/tech/2026-08-24-ai-model-family-kimi-en) (Moonshot) | Open | K3.1 Pro (2.8T / 104B active) | Strongest open-weight model overall; custom license |
| [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek-en) | Open | V4.1-Flash-1017, V4-Pro-0813 | The cheapest agentic workhorse among open weights; MIT license |
| [GLM](/posts/tech/2026-08-24-ai-model-family-glm-en) (Z.AI) | Open | GLM-5.3, 5.3-Flash, FlashX | Strongest open-weight model on cybersecurity; the flagship moved to the custom GLM-5.3 License (MaaS providers above $10B in revenue need a safety review before commercial use), while Flash stays MIT |
| [Muse](/posts/tech/2026-09-19-ai-model-family-muse-spark-en) (Meta) | Closed + open | Muse Wonder / Spark 1.3 / Ember; Spark Open | Three API tiers plus an open-weight flagship |
| [MiniMax](/posts/tech/2026-08-26-minimax-model-family-en) | Open | M3.1 Flash | The lowest price tier; strong on enterprise automation |
| [LongCat](/posts/tech/2026-10-10-ai-model-family-longcat-en) (Meituan) | Open | LongCat-2.5 | 1.6T open weights under MIT |
| [Tencent Hy](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) (Tencent Hunyuan) | Open | Hy4, Hy4 flash | Strong on finance and office agents; custom license |
| [ERNIE](/posts/tech/2026-11-23-ai-model-family-ernie-en) (Baidu) | Closed flagship + open | ERNIE 5.1 (API); 5.5 Flash Preview / Base | Low-cost 14B-active open weights; no third-party scores yet |
| [Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron-en) (NVIDIA) | Open | 3.5 Super VL, Bolt, Lightning | Open training data; tiered by deployment target |
| [Llama](/posts/tech/2026-08-24-ai-model-family-llama-en) (Meta) | Open | Llama 4 Scout/Maverick (2025-04) | Largest deployment base, but no Llama 5; Meta's new models ship as Muse; conditional Community License |
| [Mistral](/posts/tech/2026-08-24-ai-model-family-mistral-en) | Open | Mistral Large 4, Small 4 | European sovereign deployment; Large 4 is the strongest Western open-weight model on coding and security |
| [Grok](/posts/tech/2026-08-24-ai-model-family-grok-en) (SpaceXSI, formerly xAI) | Closed | Grok 4.7, 4.3 | Distribution is the moat; 4.3 is the low-cost 1M-context option |
| [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere-en) | Closed + open | Command A+, Embed 5, Rerank 5 | RAG-native; Command A+ weights are Apache 2.0 |

**Selection advice**: For agent development, compare the two mid-priced workhorses, Claude Opus 5.5 and GPT-6.2 Sol, first; step up to Fable 5.2 or GPT-6.2 Astra for the hardest tasks. For high-throughput batch work, look at MiniMax M3.1 Flash ($0.15/$0.60), DeepSeek V4.1 Flash ($0.30/$1.20), or Claude Haiku 5.5 and GPT-6 Luna (both $0.10/$0.50). For self-hosted open weights, the only frontier-class option is Kimi K3.1 Pro (multi-node); for a single GPU or laptop, look at Qwen3.8-27B (Apache-2.0), Nemotron 3.5 Bolt 24GB, or LFM3-1.7B.

**Market data**: this post last recorded OpenRouter usage rankings on 2026-08-23 (DeepSeek V4 Flash 0731 first with 11.6T tokens) and hasn't updated them since; check [OpenRouter Rankings](https://openrouter.ai/rankings) for current numbers before citing them.

### Reasoning

In 2025, reasoning models were still a separate category (the o-series, DeepSeek-R1, QwQ). By November 2026, the major families have folded reasoning back into their main models and control it with an effort parameter: GPT's `reasoning_effort`, Claude's effort, Gemini 4's thinking level, Muse's minimal to max, and Kimi K3.1 Pro, which always thinks but lets you adjust the effort. The selection question has shifted from "which reasoning model" to "which setting for the same model."

Artificial Analysis lists each reasoning setting separately: Claude Fable 5.2 ranges from 53.9 at Low to 64.6 at Max, and GPT-6.2 Sol from 40.6 at Low to 57.3 at Max. The same model differs by 10 to 17 points between its low and high settings, and cost and latency scale up with it.

**Selection advice**: Test your tasks at a middle setting (medium or high) first and step up only if accuracy falls short; for simple classification and routing, use a low setting or switch to a [decision model](/posts/tech/2026-10-22-ai-model-family-decision-models-en). For open-weight reasoning, Kimi K3.1 Pro, DeepSeek V4.1 Flash, and GLM-5.3 all have built-in thinking modes; for local use, look at Qwen3.8-27B.

### Code Generation

Coding is the dimension agent developers care about most. The Aider Polyglot scores this post used before were stuck on 2025 models and no longer useful; this section now uses two coding evaluations that Artificial Analysis runs itself, under consistent conditions that allow side-by-side comparison: Terminal-Bench 4.0 (long terminal tasks) and FrontierCode 2.0 (Cognition's private evaluation of 132 tasks in real open-source repos, graded on whether a maintainer would merge the change).

| Model | Type | Terminal-Bench 4.0 | FrontierCode 2.0 | Price (per 1M tokens) |
|---|---|---|---|---|
| Kimi K3.1 Pro | Open | **67.2** | 25.5 | $2/$10 |
| Gemini 4 Carbon (High) | Closed | 65.2 | 40.6 | $4/$20 |
| GPT-6.2 Astra (Max) | Closed | 64.1 | 45.4 | $8/$40 |
| Claude Sonnet 5.5 (Max) | Closed | 63.6 | 41.7 | $2/$10 |
| GPT-6.2 Sol (Max) | Closed | 60.1 | 44.4 | $2/$10 |
| Claude Fable 5.2 (Max) | Closed | 59.6 | **48.8** | $8/$40 |
| Claude Opus 5.5 (Max) | Closed | 59.6 | 46.4 | $4/$20 |
| Qwen4-Max | Closed | 48.5 | 26.5 | $1.50/$4.50 |
| GLM-5.3 (Max) | Open | 41.9 | 21.6 | $1.40/$4.40 |
| DeepSeek V4.1 Flash (Max) | Open | 33.8 | 28.5 | $0.30/$1.20 |
| MiniMax M3.1 Flash | Open | 25.8 | 20.8 | $0.15/$0.60 |

(Artificial Analysis data from 2026-11-20; each model uses the reasoning setting with its highest composite index on that table.)

The two evaluations disagree: Kimi K3.1 Pro leads on long terminal tasks but scores only 25.5 on FrontierCode, meaning it's good at running through a long chain of commands but its changes don't necessarily meet a maintainer's bar; Claude Fable 5.2 and Opus 5.5 lead on FrontierCode.

**Selection advice**: For PR quality, look at Claude Opus 5.5 or Fable 5.2 first; for running long tasks unattended in a terminal, Kimi K3.1 Pro is half the price; for large volumes of budget coding subtasks, DeepSeek V4.1 Flash or MiniMax M3.1 Flash are an order of magnitude cheaper per token, but trail clearly on both evaluations.

## 2. Visual Understanding

### Vision-Language Models (VLMs)

Almost every 2026 main-line model is natively multimodal, and standalone VLM lines (Qwen-VL, Kimi-VL) have been folded back into the main lines. On Artificial Analysis's MMMU-Pro (multi-discipline image-text reasoning) as of 2026-11-20:

| Model | Type | MMMU-Pro | Positioning |
|---|---|---|---|
| GPT-6.2 Astra (Max) | Closed | 89.5 | Highest score |
| Gemini 4 Carbon | Closed | 89.2 | Most complete multimodal input (including video and audio) |
| Claude Opus 5.5 (Max) | Closed | 87.7 | — |
| Kimi K3.1 Pro | Open | 83.9 | Highest open-weight score |
| Muse Spark Open | Open | 80.9 | 816B open weights, natively multimodal |
| DeepSeek V4.1 Flash (Max) | Open | 80.6 | — |
| MiniMax M3.1 Flash | Open | 79.1 | Low price |

Older document-specific numbers (DocVQA and similar) came from the August 2026 Qwen3-VL-235B (96.5%) and GPT-5.4 (95%) and haven't been revisited since; for document processing, look at natively multimodal open-weight models such as Qwen3.8-27B in the [Qwen family post](/posts/tech/2026-08-24-ai-model-family-qwen-en) and Nemotron 3.5 Super VL, and test on your own documents.

**Selection advice**: For the best image-text reasoning, GPT-6.2 Astra or Gemini 4 Carbon; for open weights, Kimi K3.1 Pro (multi-node) or the single-GPU Qwen3.8-27B; to analyze video and audio together, the Gemini 4 series.

### OCR / Document Understanding

| Model | Type | License | Positioning |
|---|---|---|---|
| [Baidu Unlimited OCR 2](/posts/tech/2026-11-23-ai-model-family-ernie-en) | Open | MIT | 3.34B; cross-page parsing of documents hundreds of pages long |
| DeepSeek-OCR | Open | MIT | 3.5K likes; high accuracy |
| Mistral OCR | Closed | API | Commercial OCR API |
| Marker | Open | GPL | PDF to Markdown |

**Selection:** For documents hundreds of pages long, Unlimited OCR 2 (MIT) doesn't need pre-chunking. Google Document AI remains the enterprise standard for a commercial API.

### Object Detection / Segmentation

| Model | Type | Positioning |
|---|---|---|
| YOLO v11 | Open | Fastest real-time object detection |
| SAM 2 (Meta) | Open | Segment any object, including video |
| Grounding DINO | Open | Text description to bounding box |
| LocateAnything (NVIDIA) | Open | Precise 3B localization model (2.9K likes) |

**Selection:** use YOLO for real-time camera or autonomous-driving detection; combine Grounding DINO with SAM 2 to select objects from text descriptions.

## 3. Generative Multimodality

### Image Generation

Image generation is still where closed models lead most clearly: the top ten on [Artificial Analysis AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image) (2026-11-23) are all closed, and OpenAI's GPT Image 2.5/2.6 take four of the top five places.

| Model | AA Elo | Type | $/1K images | Positioning |
|---|---|---|---|---|
| GPT Image 2.6 Sunburst (max) | 1263 | Closed | $211 | First place ([model card](/posts/daily/2026-11-07-model-openai-gpt-image-2-6-en)) |
| GPT Image 2.6 Flare (max) | 1226 | Closed | $211 | The other tier of the same generation |
| MAI-Image-2.7 | 1215 | Closed | $35 | Microsoft; cheapest in the top five |
| Kling Image 4.0 | 1181 | Closed | $63 | Kuaishou |
| Nano Banana 2.1 | 1175 | Closed | $34 | Google |
| Grok Imagine Image 2.0 | 1167 | Closed | $60 | SpaceXSI (formerly xAI) |
| Muse Image | 1126 | Closed | $10 | Meta; lowest price near the top |
| FLUX 3 Image | 1114 | Closed API | $48 | Black Forest Labs |
| Qwen-Image-2.1 | 1047 | Open weights (research license, no commercial use) | — | Alibaba; top open-weight model on LMArena |
| FLUX 3 Image Klein | 1040 | Open weights (FLUX Kommunity License) | $9 | 5.6B; free commercial use under $5M annual revenue |
| FLUX.2 [dev] | 1000 | Open weights (non-commercial) | $12 | This board's Elo anchor |
| Z-Image Turbo | 936 | Open, Apache-2.0 | $5 | Alibaba; cheapest, with the cleanest license |

(AA-Image-T2I v2.1 fixes FLUX.2 [dev] at 1000, so these scores can't be compared directly with the LMArena ELO figures in this post's earlier version. [LMArena Text-to-Image](https://arena.ai/leaderboard/text-to-image) (2026-11-21) gives roughly the same order, with GPT-Image-2.5 Sunburst first.)

**Selection advice**: For the highest quality, use GPT Image 2.6 Sunburst, at about $211 per thousand images; MAI-Image-2.7 scores a notch lower at about a sixth of the price. For self-hosting, check the license first: Z-Image Turbo (Apache-2.0) can be used commercially as is; FLUX 3 Image Klein is much stronger, but companies above $5M in annual revenue need a separate license; Qwen-Image-2.1 and FLUX.2 [dev] are non-commercial; MiniMax H3-Image's open weights exclude the US, EU, UK, and South Korea ([model card](/posts/daily/2026-11-16-model-minimax-h3-image-en)). For FLUX's tiers and licenses, see the [FLUX family post](/posts/tech/2026-08-26-ai-model-family-flux-en).

### Video Generation

The biggest change in the second half of 2026 is OpenAI's exit: the Sora app closed on 2026-04-26, and Sora 2 and the Videos API shut down on 2026-09-24, with no replacement API. The top of [Artificial Analysis AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video) (with audio, 2026-11-23) is crowded: the top seven all sit between 1150 and 1175 with overlapping confidence intervals. Rankings change every few weeks, so always attach a date.

| Model | AA Elo (with audio) | Type | $/minute | Positioning |
|---|---|---|---|---|
| Wan 3.0 | 1175 | Closed API | $12.00 | Alibaba; up to 30 seconds at 1080P per generation |
| Utopai X | 1171 | Closed | No API | — |
| MiniMax H3 (768p) | 1163 | Open weights (custom license) | $4.80 | Top open-weight model |
| Dreamina Seedance 2.5 | 1156 | Closed | $34.12 | ByteDance; most expensive near the top |
| Gemini Omni Flash 1.2 | 1154 | Closed | $6.26 | Google |
| FLUX 3 Max | 1151 | Closed | $17.40 | fal Research's post-trained FLUX 3 Video, billed only on fal ($8.70 promo rate through 11-22) |
| HeyGen Video 1 | 1150 | Closed | $2.40 | First on the silent board |
| Pika H3 Flex | 1125 | Open weights | $2.10 | Lowest price near the top |
| Kling 3.0 1080p (Pro) | 1000 | Closed | $10.08 | Kuaishou; this board's Elo anchor |
| Veo 3.1 | 962 | Closed | $24.00 | Google's previous generation |

(v2.1 fixes Kling 3.0 1080p (Pro) at 1000, so these scores can't be compared directly with this post's August 2026 figures.)

[VBench](https://vchitect.github.io/VBench-project/) measures 16 dimensions including subject consistency and motion smoothness; VBench-2.0 adds physical realism. Even leading models score only about 50% on motion fidelity.

**Selection advice**: For the best video with audio, use Wan 3.0; Gemini Omni Flash 1.2 scores close behind at about half the price. For self-hosting, MiniMax H3 is the top open-weight model, but its license excludes the US, EU, UK, and South Korea, and products with more than $20M in annual revenue need separate written authorization. On a tight budget, look at Pika H3 Flex ($2.10/minute) or HeyGen Video 1 ($2.40/minute). Integrations still on the Sora API need to migrate. For each family's history, see the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en).

### 3D Generation

| Model | Type | License | VRAM | Positioning |
|---|---|---|---|---|
| TRELLIS.2 | Open | MIT | 16–24GB | Highest quality, PBR materials |
| [Hunyuan3D 2.1](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) | Open | Restricted | 10–29GB | Practical balance, lower VRAM |
| TripoSR | Open | MIT | 6–8GB | Fastest (<10s), but quality has fallen behind |
| Meshy 6 | Hosted | Paid | — | Most complete commercial platform |

**Selection:** TRELLIS.2 provides the best open quality and PBR materials. TripoSR is the only option for 6–8GB GPUs. Meshy 6 has the fullest hosted commercial ecosystem.

### Image Editing

Image editing—inpainting, reference-image composition, and style transfer—now mostly lives in the same model as generation: FLUX 3 Image Klein handles text-to-image, editing with up to 10 reference images, and bounding-box local edits in one set of weights. Artificial Analysis also runs an Image Editing leaderboard for comparison; selection usually follows your image generation model.

## 4. Speech and Audio

### Text-to-Speech (TTS)

| Model | AA Elo | Type | $/1M characters | Positioning |
|---|---|---|---|---|
| Eleven v4 / v4 Turbo | 1340 | Closed API | $80 / $40 | ElevenLabs; tied for first |
| StepAudio 3 TTS | 1307 | Closed API | $14 | StepFun |
| Qwen-Audio-3.1-TTS-Plus | 1298 | Closed API | $19.31 | Alibaba |
| Simba 3.5 | 1293 | Closed API | $6.58 | Cheapest near the top |
| Gemini 3.8 Flash TTS | 1282 | Closed API | $16.49 | Google |
| Fish Audio Drama 3 | 1277 | Open weights (custom license) | $15 | Top open-weight model |
| Kokoro 82M | 1060 | Open, Apache-2.0 | $0.65 | Cheapest on the board; self-hostable |

(Elo comes from the [Artificial Analysis Text to Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard), 2026-11-23. The board compares each provider's built-in voices and doesn't test voice cloning.)

**Selection advice**: For the best API quality, Eleven v4 Turbo ties v4 at half the price; to cut costs, Simba 3.5 is $6.58 per million characters. For self-hosting, Fish Audio Drama 3 has the best quality, but its weights are under the Fish Audio Community License: free commercial use only below $500K annual revenue, and hosted services need a separate agreement; for an open model you can use commercially as is, Kokoro 82M (Apache-2.0). For each family's history and voice cloning, see the [speech and audio family post](/posts/tech/2026-08-26-ai-model-family-speech-audio-en).

### Automatic Speech Recognition (ASR)

| Model | AA-WER | Type | $/1K minutes | Positioning |
|---|---|---|---|---|
| Fun-Realtime-ASR-preview | 1.7% | Closed API | $2.82 | Alibaba; lowest error rate |
| Scribe v3 | 1.9% | Closed API | $3.33 | ElevenLabs; launched 2026-11-10 |
| MAI-Transcribe-2 | 2.0% | Closed API | $1.67 | Microsoft; about 340× real time |
| Voxtral Small Transcribe 3 | 2.1% | API | $4.00 | Mistral |
| Grok Voice Transcribe 2.0 | 2.3% | Closed API | $1.67 | SpaceXSI |
| SOV-Transcribe-1 | 2.3% | Open, Apache-2.0 | — | Salesforce; best open-weight model |
| Voxtral Small | 2.8% | Open, Apache-2.0 | $4.00 | Tied for second-best open-weight model |
| Nemotron 3.5 Transcribe | 2.8% | Open weights | $2.00 | NVIDIA; tied for second-best open-weight model |
| Whisper Large v3 | 4.1–4.5% | Open | From $1.50 | The old baseline with the widest tool support |
| Parakeet TDT 0.6B V3 | 4.5% | Open weights | $1.50 | Fastest, about 640× real time |

(AA-WER v2.2 from [Artificial Analysis Speech to Text](https://artificialanalysis.ai/speech-to-text), 2026-11-23: mostly English, non-streaming transcription that mixes voice-agent conversations, European Parliament speeches, and earnings calls; prices are for the providers listed on the board.)

**Selection advice**: For the most accurate API, use Fun-Realtime-ASR-preview or Scribe v3; MAI-Transcribe-2 is slightly less accurate but faster and cheaper. For self-hosting, SOV-Transcribe-1 is the most accurate Apache-2.0 model (seven European languages only); for more languages use Voxtral Small, and Parakeet TDT 0.6B V3 suits large batch jobs; Whisper Large v3 has the most mature ecosystem but now trails on accuracy. The board is mostly English, so test Chinese or other languages on your own recordings.

### Music Generation

Evaluation is still early. [SongBench](https://github.com/Tencent/SongBench) (Tencent; seven dimensions, 11,717 expert-annotated samples) is the most comprehensive academic benchmark; for human-preference rankings, [Artificial Analysis's music leaderboard](https://artificialanalysis.ai/music/leaderboard/instrumental) has separate instrumental and vocal boards.

| Model | AA Elo (instrumental) | Developer |
|---|---|---|
| Suno v6 | 1148 | Suno |
| Mureka V9.5 | 1084 | Mureka |
| Lyria 3 Pro | 1080 | Google |
| Eleven Music | 1021 | ElevenLabs |
| Stable Audio 3 Large | 1014 | Stability AI |
| MiniMax Music 3.0 | 1000 | MiniMax (this board's anchor) |
| MusicGen | 868 | Meta; open, ranked last |

(Instrumental board, 2026-11-23.)

**Selection advice**: For commercial quality, Suno v6 and v6-mini hold the top two places, and everything from third place down trails by more than 60 points; Mureka and Lyria 3 form the second tier. Open music models lag clearly on this board, so for self-hosting, listen to your own genres first.

## 5. Retrieval and Search

### Embeddings

Embeddings are the first RAG stage, turning text into vectors. [MTEB](https://huggingface.co/spaces/mteb/leaderboard) is the standard leaderboard; the table uses MTEB(Multilingual, v2), an average over 131 tasks.

| Model | Type | MTEB multilingual v2 | Positioning |
|---|---|---|---|
| harrier-oss-v1-27b (Microsoft) | Open, MIT | 74.3 | First on the multilingual board, but 27B is costly to self-host |
| KaLM-Embedding-Gemma3-12B (Tencent) | Open weights (custom license) | 72.3 | Second |
| Qwen3-Embedding-8B / 4B / 0.6B | Open, Apache-2.0 | 70.6 / 69.5 / 64.3 | 32K context; the default self-hosted choice |
| harrier-oss-v1-0.6b | Open, MIT | 69.0 | Strongest small model |
| gemini-embedding-001 | Closed API | 68.4 | The newer gemini-embedding-2 is multimodal (text, images, video, audio, documents) |
| [Cohere Embed 5](/posts/tech/2026-08-24-ai-model-family-cohere-en) Pro / Fast | Closed API | Not published | Strong on mixed image-text PDFs; $0.12 / $0.08 per million tokens |
| voyage-4-large / 4 / 4-lite | Closed API | Not published | $0.12 / $0.06 / $0.02; voyage-code-4 for code |
| [pplx-embed](/posts/tech/2026-10-09-ai-model-family-pplx-embed-en) | Open MIT + API | Retrieval subset only | Single-vector, contextual, and multi-vector lines |
| BGE-M3 (BAAI) | Open, MIT | — | The old 2024 default, now surpassed by the models above |

(Scores come from each model card and the MTEB multilingual board, November 2026. Some models trained on data that overlaps MTEB tasks, so treat the averages as a first filter.)

**Selection advice**: For self-hosted multilingual RAG, start with Qwen3-Embedding-4B or 8B (Apache-2.0, 32K); for the top score with a GPU budget, harrier-oss-v1-27b; for a small model, harrier-oss-v1-0.6b. On APIs, use Cohere Embed 5 for PDFs and mixed image-text documents, and gemini-embedding-2 to put text, images, and video in one vector space. The board average includes classification, clustering, and other tasks, so for RAG look at the retrieval subset, and finish by testing on your own queries.

### Reranking

Rerankers refine recalled results, the second RAG stage. Each vendor tests on datasets and first-stage retrievers of its own choosing, so numbers can't be compared directly across vendors.

| Model | Type | Positioning |
|---|---|---|
| Qwen3-Reranker-4B / 8B | Open, Apache-2.0 | First choice for commercially usable open weights; 4B and 8B are close |
| jina-reranker-v3.5 | Open weights (CC BY-NC 4.0) | 0.6B; Jina's own BEIR run gives 63.2, slightly above Qwen3-Reranker-4B; weights are non-commercial, so commercial use goes through the API |
| [Cohere Rerank 5](/posts/tech/2026-08-24-ai-model-family-cohere-en) Pro / Fast | Closed API | $0.05 / $0.02 per million tokens; can return passages, with calibrated scores |
| Voyage rerank-3 / rerank-3-lite | Closed API | Launched 2026-09-30; Voyage's own tests put it above Cohere Rerank 4 Pro and Qwen3-Reranker-8B |
| BGE-Reranker-v2-m3 | Open | The small, CPU-friendly old baseline |

**Selection advice**: For an all-open commercial stack, use Qwen3-Embedding for recall and Qwen3-Reranker-4B for reranking; for a single API vendor, Cohere Embed 5 + Rerank 5, or Voyage 4 + rerank-3. Whether reranking helps depends on whether the first stage recalls the right passage, so measure recall before choosing a reranker.

## 6. Classification and Structuring

### Text Classification / Sentiment Analysis

Hugging Face has 121K text-classification models, the largest task category. In 2026, however, an LLM used zero-shot is enough for most classification: accuracy is sufficient without labeled data or training. Dedicated small models such as BERT and DistilBERT still matter for low latency, high throughput, and edge deployment.

### NER / Token Classification

Hugging Face has 30K models. spaCy plus a transformer is the standard 2026 NER pipeline. General LLMs handle most languages well; specialized models retain an advantage in medical, legal, and financial entity recognition.

### Decision Models (Judgements Over a Fixed Set of Options)

A new category since September 2026: these models don't generate text but return a probability for each option, and bill only input tokens. For "pick one of a fixed set of options" work — ticket routing, content moderation, approving tool calls — they can replace zero-shot LLM calls. On the Artificial Analysis Decision Index v2.1, the top model, d1.2-ultra, is only 1.7 points behind Claude Haiku 5.5 (Max), at 47× lower cost per million tasks and about 150× the speed. The trade-off is weaker knowledge and reasoning, and they're often confidently wrong. For the version matrix, the two leaderboards, and threshold setting, see [Choosing a Decision Model](/posts/tech/2026-10-22-ai-model-family-decision-models-en).

### Translation

| Model | Type | Languages | Positioning |
|---|---|---|---|
| NLLB-200 (Meta) | Open | 200+ | Broadest low-resource coverage |
| SeamlessM4T v2 (Meta) | Open | 100+ | Speech translation and live interpretation |
| Aya (Cohere) | Open | 101 | Instruction-based translation with context |
| Google Translate | Closed API | 100+ | Commercial standard |
| DeepL | Closed API | 30+ | Best European-language quality |

**Selection:** NLLB-200 is the only open choice covering low-resource languages such as Yoruba and Igbo. SeamlessM4T v2 supports real-time speech-to-speech translation. Aya follows contextual instructions such as “translate this in a legal context,” which NLLB cannot.

## 7. Agent Capabilities

### Function Calling / Tool Use

Function calling isn't a separate model category but a capability dimension of the major LLMs. Claude, GPT, and Gemini have the most mature native tool use — standardized API formats, parallel tool calls, and error recovery; Muse's and Qwen's APIs are also compatible with both OpenAI and Anthropic formats.

The [tau-bench](https://github.com/sierra-research/tau-bench) series is the main multi-turn tool-calling evaluation. Among open-weight models, Kimi K3.1 Pro's long-horizon coding scores are close to the closed frontier, and MiniMax M3.1 Flash and LongCat-2.5 post strong official scores on enterprise automation and web search tasks; for judgements limited to "whether to call a tool, and which one," [decision models](/posts/tech/2026-10-22-ai-model-family-decision-models-en) score higher on When2Call than language models.

**Selection advice**: For production agents, Claude's or GPT's tool use is still the most reliable; running the main loop on a large model and handing repeated subtasks to cheap small models (Muse Ember, Claude Haiku 5.5, GPT-6 Luna) is a common 2026 division of labor. For open-source agents, compare Kimi K3.1 Pro and GLM-5.3 first; both use custom licenses with different conditions.

### Multi-step Planning and Orchestration

This belongs to agent frameworks, not model selection. Models understand instructions and call tools; frameworks plan steps and manage state. Major frameworks include LangChain/LangGraph, CrewAI, Mastra, and Pydantic AI.

## Overall

The 2026 ecosystem is highly specialized, and no model leads every use case. Claude Fable 5.2 leads the composite index and FrontierCode, Kimi K3.1 Pro leads Terminal-Bench 4.0, and GPT-6.2 Astra leads image-text reasoning; decision models beat language models outright on tool selection and cost, but fall a step behind on knowledge.

The gap between open and closed actually widened in the second half of 2026. The strongest open-weight model, Kimi K3.1 Pro, scores 46.5 on the composite index, while the closed frontier sits between 60 and 65; and flagship open weights increasingly come with conditions (Kimi, Qwen, MiniMax, Muse Spark Open, GLM-5.3, and Tencent Hy4 all use custom licenses), while Qwen4-Max took its flagship back to closed. Open models' advantages concentrate in self-hosting, low prices, and specific tasks (long terminal tasks, documents, embeddings), and an open-weight model has reached the top three in video generation; closed models still lead in composite reasoning, PR quality, image generation, and speech.

This article is the map. The evolution, architecture, and version choices for each family belong in its own family article.

---

## Update History

- **2026-11-23**: Rewrote the DeepSeek, GLM, Llama, Mistral, Grok, and Cohere rows of the "Text Generation" table to match that day's family-post updates (the GLM-5.3 flagship now uses the custom GLM-5.3 License, Grok's developer was renamed SpaceXSI, Mistral Medium 3.5 is deprecated and replaced by Small 4, and Cohere moves to Command A+), and removed the note that those family posts were still at October 2026. The image, video, TTS, ASR, music, embedding, and rerank sections now use Artificial Analysis and MTEB data from November 2026: image and video use AA v2.1 Elo (with different anchors from the old figures), the Sora API shutdown on 2026-09-24 is added, Eleven v4 replaces the old TTS leader, ASR uses AA-WER, harrier-oss-v1-27b replaces the old embedding leader, and rerankers are grouped by license and API, noting that jina-reranker-v3.5 weights are non-commercial; the OCR table now lists Unlimited OCR 2, and the image editing paragraph was rewritten. Sources for each figure were re-read from primary pages.
- **2026-11-20**: Synced with the November family updates. The "Text Generation" table now lists each family's current workhorses and adds Muse, MiniMax, LongCat, and Nemotron; "Reasoning" was rewritten to reflect reasoning being folded back into main models and controlled by an effort parameter; the "Code Generation" Aider Polyglot table (stuck on 2025 models such as GPT-5 and Gemini 2.5 Pro) was replaced with Artificial Analysis's Terminal-Bench 4.0 and FrontierCode 2.0 from 2026-11-20; "VLMs" now uses Artificial Analysis's MMMU-Pro; a "Decision Models" subsection was added; "Agent" and "Overall" were rewritten with the new data, and the earlier conclusion that open models had matched or surpassed closed ones in most areas was changed to note that the gap widened in the second half of the year. The image, video, 3D, speech, music, embedding, rerank, OCR, and translation sections still use August 2026 data and were not re-verified this time.
- 2026-08-24: First version.

## References

- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — how to judge whether a model works well
- [OpenRouter Rankings](https://openrouter.ai/rankings) — actual AI model API usage through 2026-08-23
- [Artificial Analysis](https://artificialanalysis.ai) — quality, price, and speed across text, image, video, and speech
- [LMArena](https://lmarena.ai) — human-preference ELO rankings for text and image models
- [AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image), [AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video), [Text to Speech](https://artificialanalysis.ai/text-to-speech/leaderboard), [Speech to Text](https://artificialanalysis.ai/speech-to-text), [Music](https://artificialanalysis.ai/music/leaderboard/instrumental) — Artificial Analysis image, video, speech, and music leaderboards (2026-11-23)
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations) — Sora 2 and the Videos API shut down on 2026-09-24
- [Wan3.0 officially launched — Alibaba Cloud](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) — Wan 3.0 specs and API
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) — excluded territories and revenue threshold
- [FLUX 3 Image Klein — Black Forest Labs](https://bfl.ai/blog/flux-3-image-klein) — 5.6B open weights and the Kommunity License
- [Artificial Analysis Models Leaderboard](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1, Terminal-Bench 4.0, FrontierCode 2.0, MMMU-Pro (2026-11-20)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — cross-language coding benchmark with cost (source of this post's earlier coding table)
- [Choosing a Decision Model](/posts/tech/2026-10-22-ai-model-family-decision-models-en) — this site
- [HuggingFace Models](https://huggingface.co/models) — open-model downloads, likes, and trends
- [VBench](https://vchitect.github.io/VBench-project/) — video generation across 16+18 dimensions
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — standard embedding ranking
- [harrier-oss-v1-27b](https://huggingface.co/microsoft/harrier-oss-v1-27b), [Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B) — model cards and MTEB multilingual scores
- [Gemini API Embeddings](https://ai.google.dev/gemini-api/docs/embeddings) — gemini-embedding-2 multimodal embeddings
- [Voyage AI Pricing](https://docs.voyageai.com/docs/pricing), [rerank-3 — Voyage AI](https://blog.voyageai.com/2026/09/30/rerank-3/) — Voyage 4 embedding prices and rerank-3
- [jina-reranker-v3.5](https://huggingface.co/jinaai/jina-reranker-v3.5) — 0.6B listwise reranker and Jina's own scores
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — multimodal academic reasoning
- [MathVista](https://mathvista.github.io/) — visual mathematical reasoning
