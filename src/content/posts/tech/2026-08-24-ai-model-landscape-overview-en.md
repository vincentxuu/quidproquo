---
title: "AI Model Landscape: The 2026 Map You Need"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: en
type: guide
tldr: "In 2026, AI models span seven major categories and more than 20 subcategories. This introduction to the AI Model Families series maps use cases to models and models to families, with current rankings and selection advice for each use case."
description: "A 2026 selection guide covering text generation, reasoning, code, images, video, speech, music, embeddings, reranking, OCR, 3D, translation, agents, and more than 20 AI model use cases."
series:
  name: "AI 模型家族"
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

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-landscape-overview)

This is the map for the “AI Model Families” series. Hugging Face has 47 task categories and more than three million models; add closed APIs and the ecosystem is too large for anyone to follow completely. This guide cuts across it by use case: seven categories and more than 20 subcategories, each with major models and selection advice, so you can move from “what do I need to do?” to “which model should I use?”

Each major family—Qwen, DeepSeek, Claude, GPT, and others—gets its own deep dive covering its evolution and version choices. For help reading the benchmark figures, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## 1. Core Text Capabilities

### Text Generation / Chat

In August 2026, closed models still led on quality while open models caught up. DeepSeek V4 Flash ranked first on OpenRouter with 11.6T processed tokens, but Claude Opus 5 and GPT-5.6 remained the strongest on quality.

| Family | Type | Latest version | Positioning |
|---|---|---|---|
| Claude (Anthropic) | Closed | Opus 5, Sonnet 5, Fable 5 | Strongest agent/coding family; native MCP |
| GPT (OpenAI) | Closed + open | GPT-5.6 Sol/Luna, GPT-OSS 20b/120b | Largest ecosystem; first open release under Apache-2.0 |
| Gemini (Google) | Closed | Gemini 3.7 Flash, Gemini 3 Pro | Largest context and broadest multimodality |
| DeepSeek | Open | V4 Pro, V4 Flash | #1 [OpenRouter](https://openrouter.ai/rankings) usage; MIT |
| Qwen (Alibaba) | Open | Qwen3.8-27B, Qwen3.8-2.4T-A95B | Hugging Face download leader; sizes from 0.6B to 2.4T |
| Kimi (Moonshot) | Open | K3 (2.8T) | Third-highest HF likes (10.9K); MoE |
| GLM (Z.AI) | Open | GLM 5.3 | Exceptional coding/terminal performance; fastest iteration |
| Llama (Meta) | Open | Llama 4 Scout/Maverick | Largest enterprise deployment and most mature ecosystem |
| Mistral | Open | Medium 3.5, Small 3.1 | European flagship; multilingual; clearest licensing |
| Grok (xAI) | Closed | Grok 4.5 | Rapid iteration |
| Ornith | Open | Ornith 1.5-35B-A3B | Summer 2026 breakout model; MIT |
| Phi (Microsoft) | Open | Phi-4 | Small-model specialist |
| Cohere | Closed + open | Command R+, North | RAG-native, with Embed, Rerank, and multilingual Aya |

**Selection:** for agent development, Claude Opus 5 or GPT-5 currently provides the most reliable tool use. For high-throughput batch work, DeepSeek V4 Flash has unmatched price/performance. For local deployment, choose Qwen3.8-27B (Apache-2.0) or Gemma 4-12B, which fits 16GB VRAM.

**Market data** (OpenRouter, Aug. 23): DeepSeek V4 Flash 0731 (11.6T tokens) > Ox Alpha (11.6T) > MiMo-V2.5 (9.94T) > Hy3 (8.21T) > DeepSeek V4 Flash 0423 (5.46T).

### Reasoning

Reasoning models emerged as a category in 2025–2026. They perform long-chain thinking before answering and specialize in mathematics, logic, and science.

| Family | Type | Latest version | Positioning |
|---|---|---|---|
| o-series (OpenAI) | Closed | o3, o4-mini, o3-pro | Strongest reasoning, highest cost |
| DeepSeek-R1 | Open | R1-0528 | MIT; leading open reasoning model (13.5K HF likes) |
| QwQ (Qwen) | Open | QwQ-32B | Apache-2.0; 32B can run locally |
| Kimi-Thinking | Open | K2-Thinking | Hybrid reasoning and general model |

**Selection:** o3 (high) or o4-mini gives the best math and science quality. DeepSeek-R1 is the only frontier-class open reasoning option. For local consumer hardware, QwQ-32B performs best.

### Code Generation

Coding is the model dimension agent developers care about most. [Aider Polyglot](https://aider.chat/docs/leaderboards/) is especially practical because it reports both effectiveness and cost.

| Family | Aider score | Cost/run | Positioning |
|---|---|---|---|
| GPT-5 (high) | 88.0% | $29.08 | Highest quality |
| Gemini 2.5 Pro | 83.1% | $49.88 | 32K thinking |
| o3 (high) | 81.3% | $21.23 | Reasoning-oriented coding |
| Grok 4 (high) | 79.6% | $59.62 | — |
| DeepSeek V3.2 Exp (Reasoner) | 74.2% | $1.30 | Exceptional value |
| Claude Opus 4 (32K thinking) | 72.0% | $65.75 | — |
| DeepSeek V3.2 Exp (Chat) | 70.2% | $0.88 | Lowest cost |
| Kimi K2 | 59.1% | $1.24 | — |
| Qwen3 235B A22B | 59.6% | — | Large open model |

**Selection:** for maximum quality regardless of price, GPT-5 (high) leads Aider at 88%. For a roughly tenfold saving while remaining useful, DeepSeek V3.2 Exp Chat scores 70.2% for $0.88, one thirty-third of GPT-5's cost.

## 2. Visual Understanding

### Vision-Language Models (VLMs)

VLMs interpret images and text together. By 2026, open VLMs had surpassed closed models in specific areas such as document understanding and mathematical reasoning.

| Family | Type | MMMU-Pro | DocVQA | MathVista | Positioning |
|---|---|---|---|---|---|
| Gemini 3.1 Pro | Closed | 82% | 92% | 75% | Strongest across broad academic subjects |
| GPT-5.4 | Closed | 81% | 95% | 78.4% | Strongest closed document model |
| Qwen3-VL-235B | Open | 69.3% | 96.5% | 85.8% | Open leader; visual math beats closed models |
| InternVL3-78B | Open | — | 95.4% | 79.0% | Second among open models |
| Llama 4 Maverick | Open | — | 94.4% | 73.7% | Meta's open multimodal model |
| Kimi-VL | Open | — | — | — | Lightweight VLM |

**Selection:** Qwen3-VL at 96.5% DocVQA beats GPT-5.4 for self-hosted document pipelines. Gemini 3.1 Pro leads broad academic reasoning at 82% MMMU-Pro. Qwen3-VL leads all closed models on visual math at 85.8% MathVista.

### OCR / Document Understanding

| Model | Type | License | Positioning |
|---|---|---|---|
| Baidu Unlimited-OCR | Open | MIT | 4.1K likes; multilingual OCR |
| DeepSeek-OCR | Open | MIT | 3.3K likes; high accuracy |
| Mistral OCR | Closed | API | Commercial OCR API |
| Marker | Open | GPL | PDF to Markdown |

**Selection:** Unlimited-OCR offers the best open quality and language coverage under MIT. Google Document AI remains the enterprise standard for a commercial API.

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

Closed models dominate image generation: the top five are all closed.

| Model | ELO | Type | $/1,000 images | Positioning |
|---|---|---|---|---|
| GPT Image 2 | 1381 | Closed | $211 | #1 [LMArena](https://arena.ai/leaderboard/text-to-image) |
| MAI-Image-2.6 | 1336 | Closed | — | New Microsoft model |
| Grok Imagine 2.0 | 1316 | Closed | — | xAI |
| Reve 2.1 | 1302 | Closed | $200 | — |
| Meta Muse Image | 1282 | Closed | — | Meta |
| Imagen 4 | — | Closed | — | Google |
| FLUX.2 dev | — | Open | $12 | Among the strongest open models |
| Ideogram 4.0 Open | 1204 | Open | — | Highest open ELO |
| Z-Image Turbo | — | Open | $5 | Alibaba; extremely inexpensive |
| SD 3.5 Large | — | Open | — | Foundational family |

ELO comes from [LMArena Text-to-Image Arena](https://arena.ai/leaderboard/text-to-image), 2026-08-10. **Selection:** GPT Image 2 gives the highest quality at $211 per thousand images. Use FLUX.2 dev or Ideogram 4.0 Open for self-hosting, and Z-Image Turbo for the lowest cost at $0.005/image.

### Video Generation

This was 2026's fastest-moving category; rankings changed every few weeks, so always attach a date.

| Model | ELO with audio | Type | $/minute | Positioning |
|---|---|---|---|---|
| Wan 3.0 | 1244 | Closed | Coming soon | #1 [AA Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video) |
| Gemini Omni Flash | 1238 | Closed | $6.00 | Google |
| MiniMax H3 | 1228 | Open | $7.80 | Strongest open model |
| Seedance 2.0 | 1221 | Closed | $9.07 | ByteDance; native audio |
| Kling 3.0 Pro | 1106 | Closed | $20.16 | Kuaishou |
| LTX-2.5 | 1063 | Open | $7.80 | Lightricks; rapid iteration |
| Sora | — | Closed | — | OpenAI |

ELO comes from [Artificial Analysis Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video), August 2026. [VBench](https://vchitect.github.io/VBench-project/) measures 16 dimensions including subject consistency and motion smoothness; VBench-2.0 adds physical realism. Even leading models score only about 50% on motion fidelity.

**Selection:** use Wan 3.0 or Seedance 2.0 for video with audio, MiniMax H3 (ELO 1228) for open self-hosting, and LTX-2.3 Fast at $2.40/minute for the lowest budget.

### 3D Generation

| Model | Type | License | VRAM | Positioning |
|---|---|---|---|---|
| TRELLIS.2 | Open | MIT | 16–24GB | Highest quality, PBR materials |
| Hunyuan3D 2.1 | Open | Restricted | 10–29GB | Practical balance, lower VRAM |
| TripoSR | Open | MIT | 6–8GB | Fastest (<10s), but quality has fallen behind |
| Meshy 6 | Hosted | Paid | — | Most complete commercial platform |

**Selection:** TRELLIS.2 provides the best open quality and PBR materials. TripoSR is the only option for 6–8GB GPUs. Meshy 6 has the fullest hosted commercial ecosystem.

### Image Editing

Image editing—such as inpainting, outpainting, and style transfer—is generally a derivative feature of image generators: FLUX Fill, SD Inpaint, DALL-E Edit, and GPT Image edit mode. There is no independent standard benchmark, so selection follows your generation model.

## 4. Speech and Audio

### Text-to-Speech (TTS)

| Model | Type | Positioning |
|---|---|---|
| Qwen-Audio-3.0-TTS | Closed API | #1 [AA Speech Arena](https://artificialanalysis.ai/text-to-speech/arena); 16 languages |
| ElevenLabs | Closed API | Commercial industry standard |
| Kokoro | Open | Fastest on CUDA (67ms TTFA, 104× RTFx) |
| Fish Audio | Open | Multilingual voice cloning |
| VibeVoice (Microsoft) | Open | MIT; 2.4K likes |
| OmniVoice | Open | #1 voice-cloning blind test, but may drop words |

Speed figures come from [TTS-Bench](https://github.com/5uck1ess/tts-bench), covering 65 models. **Selection:** Qwen-Audio-3.0-TTS leads API quality; Kokoro has 67ms time to first audio on an RTX 5090; OmniVoice leads blind preference for voice cloning, but verify clarity with WER because it may omit words.

### Automatic Speech Recognition (ASR)

| Model | Type | Positioning |
|---|---|---|
| Whisper Large V3 | Open | General multilingual standard |
| Cohere Transcribe | Closed API | Apache-2.0, multilingual |
| Paraformer (Alibaba) | Open | Strongest Chinese ASR |
| Deepgram | Closed API | Enterprise, low latency |
| AssemblyAI | Closed API | Enterprise streaming support |

**Selection:** Whisper Large V3 remains the open general baseline. Paraformer is more accurate than Whisper for Chinese.

### Music Generation

Evaluation remains immature. [SongBench](https://github.com/Tencent/SongBench), with seven dimensions and 11,717 expert-annotated samples, is the most comprehensive.

| Model | Type | Positioning |
|---|---|---|
| MiniMax-Music3 | Open | 2B parameters, 1.2K likes |
| Suno | Closed | Commercial mainstream |
| Udio | Closed | Audio-quality focus |
| Stable Audio | Open | Stability AI |

**Selection:** MiniMax-Music3 is the most active open option. Suno leads commercial quality and ease of use.

## 5. Retrieval and Search

### Embeddings

Embeddings are the first RAG stage. [MTEB](https://huggingface.co/spaces/mteb/leaderboard) is the standard leaderboard.

| Model | Type | Downloads | Positioning |
|---|---|---|---|
| BGE-M3 (BAAI) | Open MIT | 36M | Multilingual embedding leader |
| Qwen-Embedding | Open | 7M | Qwen ecosystem; 0.6B/4B |
| Jina Embeddings v5 | Open | — | Multilingual and commercial use |
| Cohere Embed v3 | Closed API | — | Major enterprise API choice |
| Voyage code-3 | Closed API | — | Code-specialized corpus |
| OpenAI text-embedding-3 | Closed API | — | Easiest integration |

**Selection:** BGE-M3 (MIT, 36M downloads) is the 2026 default for multilingual RAG. Voyage code-3 targets code corpora. OpenAI has the most complete integration documentation.

### Reranking

Rerankers refine recalled results. [BEIR](https://github.com/beir-cellar/beir) nDCG@10 is the main metric.

| Model | Type | BEIR nDCG@10 | Positioning |
|---|---|---|---|
| Jina Reranker v3.5 | Open | 63.2 | Strongest open model |
| Qwen3-Reranker-8B | Open | ~62+ | Qwen ecosystem |
| BGE-Reranker | Open | — | BGE family |
| Cohere Rerank | Closed API | — | API industry standard |

The 2026 RAG gold standard is **BGE-M3 or Qwen-Embedding for recall, followed by Jina or Cohere Reranker**. Use BGE-M3 + Jina Reranker v3.5 for an all-open stack, or Cohere Embed + Cohere Rerank for a stable API.

## 6. Classification and Structuring

### Text Classification / Sentiment Analysis

Hugging Face has 121K text-classification models, the largest task category. In 2026, however, an LLM used zero-shot is enough for most classification: accuracy is sufficient without labeled data or training. Dedicated small models such as BERT and DistilBERT still matter for low latency, high throughput, and edge deployment.

### NER / Token Classification

Hugging Face has 30K models. spaCy plus a transformer is the standard 2026 NER pipeline. General LLMs handle most languages well; specialized models retain an advantage in medical, legal, and financial entity recognition.

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

Function calling is not a model category but a capability of major LLMs. Claude, GPT, and Gemini have the most mature native tool-use support: standardized APIs, parallel calls, and error recovery.

[tau-bench](https://github.com/sierra-research/tau-bench) is the main multi-turn tool-use evaluation. Among open models, Qwen3.8 and GLM 5.3 are improving fastest. **Selection:** Claude or GPT has the highest production reliability; Qwen3.8 with function calling is the best open option.

### Multi-step Planning and Orchestration

This belongs to agent frameworks, not model selection. Models understand instructions and call tools; frameworks plan steps and manage state. Major frameworks include LangChain/LangGraph, CrewAI, Mastra, and Pydantic AI.

## Overall

The 2026 ecosystem is highly specialized. No model leads every use case. DeepSeek V4 Flash has the most OpenRouter usage, while GPT-5 tops coding. Qwen-VL beats every closed model on document understanding but trails Gemini by more than ten percentage points on broad academic reasoning.

Open models have matched or surpassed closed ones in most areas: document understanding (Qwen-VL 96.5%), mathematical reasoning (Qwen-VL 85.8%), video generation (MiniMax H3), embeddings (BGE-M3), and TTS (Kokoro and OmniVoice). Closed models still lead mainly in agent tasks, image generation, and the strongest reasoning models.

This article is the map. The evolution, architecture, and version choices for each family belong in its own family article.

---

## References

- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — how to judge whether a model works well
- [OpenRouter Rankings](https://openrouter.ai/rankings) — actual AI model API usage through 2026-08-23
- [Artificial Analysis](https://artificialanalysis.ai) — quality, price, and speed across text, image, video, and speech
- [LMArena](https://lmarena.ai) — human-preference ELO rankings for text and image models
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — cross-language coding benchmark with cost
- [HuggingFace Models](https://huggingface.co/models) — open-model downloads, likes, and trends
- [VBench](https://vchitect.github.io/VBench-project/) — video generation across 16+18 dimensions
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — standard embedding ranking
- [BEIR](https://github.com/beir-cellar/beir) — cross-domain information-retrieval benchmark
- [TTS-Bench](https://github.com/5uck1ess/tts-bench) — speed, listening tests, and objective scores across 65 TTS models
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — multimodal academic reasoning
- [MathVista](https://mathvista.github.io/) — visual mathematical reasoning
