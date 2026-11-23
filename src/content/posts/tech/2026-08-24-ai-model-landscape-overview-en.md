---
title: "AI Model Landscape: The 2026 Map You Need"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: en
type: guide
tldr: "In 2026, AI models span seven major categories and more than 20 subcategories. This introduction to the AI Model Families series maps use cases to models and models to families, with selection advice for each use case. November 2026 edition: the closed frontier is now Claude Fable 5.2, GPT-6.2, and Gemini 4, the strongest open-weight model is Kimi K3.1 Pro, coding is compared using Artificial Analysis's Terminal-Bench 4.0 and FrontierCode 2.0, and decision models are added as a category."
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

This is the map for the “AI Model Families” series. Hugging Face has 47 task categories and more than three million models; add closed APIs and the ecosystem is too large for anyone to follow completely. This guide cuts across it by use case: seven categories and more than 20 subcategories, each with major models and selection advice, so you can move from “what do I need to do?” to “which model should I use?” The text, reasoning, coding, vision, and agent sections use data from 2026-11-20; the image, video, speech, retrieval, and other sections still use August 2026 data, so cite them with dates.

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
| [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek-en) | Open | V4.1 Flash, V4 Pro | Low price, MIT license |
| [GLM](/posts/tech/2026-08-24-ai-model-family-glm-en) (Z.AI) | Open | GLM-5.3, 5.3-Flash | MIT license, strong on coding and terminal work |
| [Muse](/posts/tech/2026-09-19-ai-model-family-muse-spark-en) (Meta) | Closed + open | Muse Wonder / Spark 1.3 / Ember; Spark Open | Three API tiers plus an open-weight flagship |
| [MiniMax](/posts/tech/2026-08-26-minimax-model-family-en) | Open | M3.1 Flash | The lowest price tier; strong on enterprise automation |
| [LongCat](/posts/tech/2026-10-10-ai-model-family-longcat-en) (Meituan) | Open | LongCat-2.5 | 1.6T open weights under MIT |
| [Tencent Hy](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) (Tencent Hunyuan) | Open | Hy4, Hy4 flash | Strong on finance and office agents; custom license |
| [ERNIE](/posts/tech/2026-11-23-ai-model-family-ernie-en) (Baidu) | Closed flagship + open | ERNIE 5.1 (API); 5.5 Flash Preview / Base | Low-cost 14B-active open weights; no third-party scores yet |
| [Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron-en) (NVIDIA) | Open | 3.5 Super VL, Bolt, Lightning | Open training data; tiered by deployment target |
| [Llama](/posts/tech/2026-08-24-ai-model-family-llama-en) (Meta) | Open | Llama 4 Scout/Maverick | Most mature ecosystem, but no new versions |
| [Mistral](/posts/tech/2026-08-24-ai-model-family-mistral-en) | Open | Mistral Large 4, Medium 3.5 | European compliance positioning |
| [Grok](/posts/tech/2026-08-24-ai-model-family-grok-en) (xAI) | Closed | Grok 4.7 | Distribution is the moat |
| [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere-en) | Closed + open | Command A, North | RAG-native: Embed + Rerank + Aya |

(The DeepSeek, GLM, Llama, Mistral, Grok, and Cohere family posts are still at their October 2026 versions; the "current workhorses" column follows Artificial Analysis's model list on 2026-11-20, with details to follow when those family posts are updated.)

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
| [Baidu Unlimited-OCR](/posts/tech/2026-11-23-ai-model-family-ernie-en) | Open | MIT | 4.1K likes; multilingual OCR |
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
| [Hunyuan3D 2.1](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) | Open | Restricted | 10–29GB | Practical balance, lower VRAM |
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

**Selection advice**: For production agents, Claude's or GPT's tool use is still the most reliable; running the main loop on a large model and handing repeated subtasks to cheap small models (Muse Ember, Claude Haiku 5.5, GPT-6 Luna) is a common 2026 division of labor. For open-source agents, compare Kimi K3.1 Pro and GLM-5.3 first, noting that their licenses differ.

### Multi-step Planning and Orchestration

This belongs to agent frameworks, not model selection. Models understand instructions and call tools; frameworks plan steps and manage state. Major frameworks include LangChain/LangGraph, CrewAI, Mastra, and Pydantic AI.

## Overall

The 2026 ecosystem is highly specialized, and no model leads every use case. Claude Fable 5.2 leads the composite index and FrontierCode, Kimi K3.1 Pro leads Terminal-Bench 4.0, and GPT-6.2 Astra leads image-text reasoning; decision models beat language models outright on tool selection and cost, but fall a step behind on knowledge.

The gap between open and closed actually widened in the second half of 2026. The strongest open-weight model, Kimi K3.1 Pro, scores 46.5 on the composite index, while the closed frontier sits between 60 and 65; and flagship open weights increasingly come with conditions (Kimi, Qwen, MiniMax, and Muse Spark Open all use custom licenses), while Qwen4-Max took its flagship back to closed. Open models' advantages concentrate in self-hosting, low prices, and specific tasks (long terminal tasks, documents, embeddings, TTS); closed models still lead in composite reasoning, PR quality, and image generation.

This article is the map. The evolution, architecture, and version choices for each family belong in its own family article.

---

## Update History

- **2026-11-20**: Synced with the November family updates. The "Text Generation" table now lists each family's current workhorses and adds Muse, MiniMax, LongCat, and Nemotron; "Reasoning" was rewritten to reflect reasoning being folded back into main models and controlled by an effort parameter; the "Code Generation" Aider Polyglot table (stuck on 2025 models such as GPT-5 and Gemini 2.5 Pro) was replaced with Artificial Analysis's Terminal-Bench 4.0 and FrontierCode 2.0 from 2026-11-20; "VLMs" now uses Artificial Analysis's MMMU-Pro; a "Decision Models" subsection was added; "Agent" and "Overall" were rewritten with the new data, and the earlier conclusion that open models had matched or surpassed closed ones in most areas was changed to note that the gap widened in the second half of the year. The image, video, 3D, speech, music, embedding, rerank, OCR, and translation sections still use August 2026 data and were not re-verified this time.
- 2026-08-24: First version.

## References

- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — how to judge whether a model works well
- [OpenRouter Rankings](https://openrouter.ai/rankings) — actual AI model API usage through 2026-08-23
- [Artificial Analysis](https://artificialanalysis.ai) — quality, price, and speed across text, image, video, and speech
- [LMArena](https://lmarena.ai) — human-preference ELO rankings for text and image models
- [Artificial Analysis Models Leaderboard](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1, Terminal-Bench 4.0, FrontierCode 2.0, MMMU-Pro (2026-11-20)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — cross-language coding benchmark with cost (source of this post's earlier coding table)
- [Choosing a Decision Model](/posts/tech/2026-10-22-ai-model-family-decision-models-en) — this site
- [HuggingFace Models](https://huggingface.co/models) — open-model downloads, likes, and trends
- [VBench](https://vchitect.github.io/VBench-project/) — video generation across 16+18 dimensions
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — standard embedding ranking
- [BEIR](https://github.com/beir-cellar/beir) — cross-domain information-retrieval benchmark
- [TTS-Bench](https://github.com/5uck1ess/tts-bench) — speed, listening tests, and objective scores across 65 TTS models
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — multimodal academic reasoning
- [MathVista](https://mathvista.github.io/) — visual mathematical reasoning
