---
title: "AI Model Evaluation Sources: How to Judge Whether a Model Is Actually Good"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, benchmark, evaluation, model-selection]
lang: en
tldr: "You cannot take model vendors' self-reported scores at face value. This guide covers the most important independent evaluation platforms, domain benchmarks, adoption indicators, and official sources in 2026: what each measures, how to read it, where it is biased, and which figures matter for different use cases."
description: "A 2026 guide to AI model evaluation sources including Artificial Analysis, LMArena, LiveBench, SWE-bench, Aider, and OpenRouter Rankings, with interpretation methods, limitations, and common traps."
type: guide
draft: false
glossary:
  - term: "ELO"
    def: "A competitive ranking system that derives relative strength from the outcomes of pairwise comparisons."
  - term: "benchmark gaming"
    def: "Optimizing a model specifically for known test questions, inflating its benchmark score without improving real capability."
  - term: "contamination"
    def: "Test questions leaking into training data, letting a model memorize answers instead of demonstrating understanding."
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-evaluation-sources)

Model launches arrive with a wall of benchmark numbers. Which are credible, and which are inflated? This guide breaks down the main evaluation sources in 2026: what each measures, how to interpret it, and where its biases lie.

The goal is not to list every benchmark. It is to help you ask where a number came from, what it represents, and whether to trust it.

## General Evaluation Platforms

These three platforms approach the question “how good is the model overall?” from different angles.

### Artificial Analysis

[artificialanalysis.ai](https://artificialanalysis.ai)

**Measures:** quality, price, speed, and latency across text, image, video, and speech. It maintains an Intelligence Index and Coding Agent Index and monitors real API throughput and cost.

**How to read it:** standardized price and speed comparisons are more valuable than the quality ranking. For API selection, its output tokens/sec and $/1M-token figures are often more useful than one-off local tests because it continuously monitors providers. Its proprietary Intelligence Index is not directly equivalent to other benchmarks.

**Biases:** primarily covers API models; local models receive less coverage. The Coding Agent Index methodology is less transparent than SWE-bench.

### LMArena (Chatbot Arena)

[lmarena.ai](https://lmarena.ai), formerly lmsys.org.

**Measures:** human preference. Users chat with two anonymous models, choose the better response, and produce an ELO ranking.

**How to read it:** ELO answers “which response does an ordinary user prefer?” It is closer to actual user experience than an exam. Differences below 20 points are generally not statistically significant.

**Biases:** voters favor longer, more formatted answers; style can beat correctness; prompts skew toward ordinary conversation rather than coding or professional work; experienced voters may infer model identity from style. Despite this, Arena is widely cited because static benchmarks are easier to game.

### LiveBench

[livebench.ai](https://livebench.ai)

**Measures:** 23 objective tasks across seven categories, refreshed every six months to resist contamination.

**How to read it:** it better reflects current reasoning than static tests such as MMLU because the questions are new. Scores from different releases are not directly comparable; compare models within one release.

**Biases:** task selection reflects the designers' preferences, and 23 tasks cannot represent every scenario.

## Domain Benchmarks

General platforms assess overall quality; domain benchmarks answer whether a model can perform a specific job.

### SWE-bench / SWE-bench Verified

[swebench.com](https://www.swebench.com)

**Measures:** real GitHub issues from 12 open-source Python projects including Django, Flask, and scikit-learn. A model reads the repository, fixes the bug, and must pass the associated tests.

**Verified:** the original contains ambiguous issues and weak tests. Verified is a manually reviewed 500-problem subset and the more frequently cited 2026 version.

**How to read it:** this is the toughest coding-agent benchmark. A high score shows repository understanding, bug localization, and correct patches. It measures only Python bug fixes—not new features, refactoring, or multilingual development.

**Biases:** Python only; accepts fixes that pass the original tests even when other valid fixes exist; vendors may train specifically on the coding style of these 12 repositories.

### Aider Polyglot

[aider.chat/docs/leaderboards](https://aider.chat/docs/leaderboards/)

**Measures:** 133 multilingual exercises in Python, JavaScript, TypeScript, C#, Java, Go, and more. A model edits existing files until tests pass; API cost is recorded.

**How to read it:** closer than SWE-bench to everyday “change this code correctly” work. Cost is especially useful: GPT-5 (high) scored 88% for $29, while DeepSeek V3.2 Exp Chat scored 70% for $0.88.

**Biases:** Aider's prompt design affects results; the same model may behave differently in Cursor, Copilot, or Claude Code.

### HumanEval

**Measures:** 164 Python tasks released by OpenAI in 2021. Given a signature and docstring, the model writes a function body that must pass tests.

**How to read it:** saturated by 2026, with leading models above 95%. It remains an introductory coding test but should not drive selection.

**Biases:** too easy, Python-only, and widely present in training corpora.

### MMLU-Pro

**Measures:** a harder MMLU with about 12,000 questions across 14 subjects, ten answer choices rather than four, and more multi-step reasoning.

**How to read it:** random-guess accuracy falls from 25% to 10%, preserving separation among strong models. It still tests “what do you know?” through multiple choice, not “what can you do?”

**Biases:** multiple-choice format and dependence on training-data knowledge coverage.

### GPQA Diamond

**Measures:** 198 graduate-level physics, chemistry, and biology questions written by specialists and validated as too hard for non-specialists even with Google.

**How to read it:** one of 2026's hardest science-reasoning tests. With only 198 items, small score changes may be random.

**Biases:** natural sciences only; no engineering, social science, or humanities; small sample and wide confidence intervals.

### AIME (American Invitational Mathematics Examination)

**Measures:** 15 contest problems with integer answers from 0 to 999, requiring multi-step and creative reasoning.

**How to read it:** a clean math-reasoning test with little formatting bias; reports accuracy, such as AIME 2024 at 83.3%.

**Biases:** historical questions may enter training data. The 2024 set was newer but will also become contaminated.

### Humanity's Last Exam (HLE)

**Measures:** extremely difficult questions across 100+ subjects, written by thousands of experts through Scale AI and CAIS and published in Nature (649, 1139–1146). Artificial Analysis evaluates 2,158 text-only items.

**How to read it:** progress is rapid. In April 2025, Gemini 3 Pro led at 38.3% and GPT-5 scored 25.3%. By August 2026, frontier models reached 55%+—Claude Fable 5 at 55.5% and Opus 5 at 54.9%—or 64.7% with tools. Nearly half remains unsolved.

**Biases:** results vary sharply by source. Artificial Analysis reports about 55% for Opus 5 on 2,158 text-only questions; BenchLM reports 64.7%. Different subsets, tools, judge models, or scoring can explain the gap. Always record the evaluator and conditions.

## Multimodal Model Evaluation (VLM)

VLMs must understand images and text, adding another dimension to evaluation.

### MMMU / MMMU-Pro

[mmmu-benchmark.github.io](https://mmmu-benchmark.github.io/)

**Measures:** 11,500 university-level multimodal questions across 30 subjects, including charts, images, musical notation, and chemical structures. Pro expands choices from four to ten and removes questions answerable without the image.

**How to read it:** original MMMU saturated above 80% after 2025; Pro still separates models. Gemini 3.1 Pro scored 82%, GPT-5.4 81%, Qwen3.6 Plus 78.8%, and open Qwen3-VL-235B 69.3%, leaving closed models about 10pp ahead in broad academic reasoning.

### MathVista

[mathvista.github.io](https://mathvista.github.io/)

**Measures:** 6,141 visual math problems involving chart arithmetic, geometry, and statistical tables.

**How to read it:** open models lead here: Qwen3-VL-235B scored 85.8%, above every closed model.

### DocVQA / ChartQA / OCRBench

**Measures:** practical document understanding. DocVQA asks questions about scanned invoices, contracts, and tables; ChartQA tests charts; OCRBench v2 tests bilingual recognition.

**How to read it:** these matter more than MMLU for enterprise document pipelines. Qwen2.5-VL-72B scored 96.4% on DocVQA, above GPT-5.4 at 95%.

## Image Generation Evaluation

Images have no single objective answer, so evaluation relies more on human preference and multidimensional automated scoring.

### LMArena Text-to-Image Arena

[arena.ai/leaderboard/text-to-image](https://arena.ai/leaderboard/text-to-image)

**Measures:** pairwise blind ELO voting on images generated from the same prompt, across 76+ models.

**August 2026 top five:** GPT Image 2 (1381), MAI-Image-2.6 (1336), Grok Imagine 2.0 (1316), Reve 2.1 (1302), Meta Muse Image (1282).

### Artificial Analysis Image Arena

[artificialanalysis.ai/image/leaderboard/text-to-image](https://artificialanalysis.ai/image/leaderboard/text-to-image)

**Measures:** independent image ELO plus API price per image, combining quality and cost. GPT Image 2 high costs $211/thousand images versus $48 for MAI-Image-2.5.

### Evalytic

[evalytic.ai/leaderboard](https://evalytic.ai/leaderboard)

**Measures:** 33 models, 100 prompts, and six AI judges—CLIP Score, PickScore, HPSv2, ImageReward, VQAScore, and a VLM judge—with subdimensions for visual quality, prompt adherence, and text rendering.

**How to read it:** subdimensions help when a specific ability matters, such as rendering text, more than Arena's single ELO.

**Biases:** AI preferences differ from human preferences. CLIP Score, NIMA, and sharpness capture technical quality rather than aesthetics.

### Traditional Metrics: FID / CLIP Score

FID measures distribution similarity between generated and real images; CLIP Score measures image-text alignment. They dominated before 2024, but by 2026 their correlation with human preference was considered too weak for primary use. Treat them as supporting metrics.

## Video Generation Evaluation

Video was the most volatile 2026 category, with rankings changing every few weeks.

### Artificial Analysis Video Arena

[artificialanalysis.ai/video/leaderboard/text-to-video](https://artificialanalysis.ai/video/leaderboard/text-to-video)

**Measures:** blind-vote ELO for text-to-video and image-to-video, each split into with-audio and without-audio boards, covering 30+ models with $/minute prices.

**August 2026 top five, T2V with audio:** Wan 3.0 (1244), Gemini Omni Flash (1238), MiniMax H3 (1228), Seedance 2.0 (1221), Wan 2.7 (1156).

**Biases:** rankings fluctuate more than text or image rankings. Kling 3.0 1080p Pro moved by 137 ELO and three positions across measurements. Always date video rankings.

### LMArena Image-to-Video Arena

[arena.ai/leaderboard/image-to-video](https://arena.ai/leaderboard/image-to-video)

**Measures:** ELO across 45 I2V models. MiniMax H3 led at 1489 in August 2026.

### VBench / VBench-2.0

[vchitect.github.io/VBench-project](https://vchitect.github.io/VBench-project/)

**Measures:** VBench decomposes quality into 16 dimensions such as subject consistency, motion smoothness, temporal flicker, and aesthetics. VBench-2.0 added 18 physical-realism dimensions in March 2026, including fluid flow and collision inertia.

**How to read it:** Arena measures subjective preference; VBench measures technical quality, and they can disagree. Open Wan 2.2 scored 84.7% on VBench, while even leading models scored only about 50% on VBench-2.0's physical-motion dimensions.

## Speech and Music Evaluation

### Artificial Analysis Speech Arena

[artificialanalysis.ai/text-to-speech/arena](https://artificialanalysis.ai/text-to-speech/arena)

**Measures:** blind-listening ELO between two TTS outputs of the same text. Qwen-Audio-3.0-TTS ranked first in July 2026.

### TTS-Bench

[github.com/5uck1ess/tts-bench](https://github.com/5uck1ess/tts-bench)

**Measures:** 65 TTS models across speed (TTFA, RTFx), blind A/B listening, and objective UTMOS naturalness, WER clarity, and SIM voice similarity, on RTX 5090, M4, and RTX 3090 hardware.

**How to read it:** the most practical local-deployment benchmark because it reports speed and naturalness by hardware. Its public [TTS Voting Arena](https://5uck1ess-tts-arena.hf.space) collects blind votes.

### MINT-Bench

[arxiv.org/abs/2604.17958](https://arxiv.org/abs/2604.17958)

**Measures:** multilingual instruction-following TTS across ten languages and three layers: content consistency, instruction following, and perceptual quality. Frontier commercial systems lead in English, while Qwen3-TTS beats Gemini in Chinese.

### Speech Recognition (ASR) Metrics

WER is the standard ASR metric. The [OpenASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard) evaluates LibriSpeech, Common Voice, and other datasets. Whisper Large V3 remains the most widely used baseline.

### Music Generation Evaluation

Evaluation remains early:

- **FAD:** audio equivalent of FID, comparing generated and real music distributions.
- **MusicCaps:** Google's music-description dataset for text-to-music alignment.
- **SongBench** ([Tencent, 2026](https://github.com/Tencent/SongBench)): the largest song benchmark, with 11,717 expert annotations across vocals, instruments, melody, structure, arrangement, mixing, and musicality.

Music is highly subjective; musicians and general listeners can disagree sharply on the same generated song.

## Embedding and Rerank Evaluation

### MTEB Leaderboard

[huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard)

**Measures:** embedding quality across retrieval, classification, clustering, and semantic similarity; the standard selection leaderboard.

**How to read it:** separate multilingual from English-only results. BGE-M3 leads multilingual work; Qwen3-Embedding and Voyage are strong on code.

### BEIR

[github.com/beir-cellar/beir](https://github.com/beir-cellar/beir)

**Measures:** cross-domain retrieval, with reranker accuracy measured by nDCG@10. Main competitors include Jina Reranker v3.5 at 63.2, Qwen3-Reranker-8B, and BGE-Reranker.

**How to read it:** the 2026 RAG standard is BGE-M3 or Qwen3-Embedding for recall plus a reranker. BEIR nDCG@10 is the primary reranker metric.

## Market Adoption Indicators

Benchmarks measure capability; adoption measures how many people use a model. They need not agree.

### OpenRouter Rankings

[openrouter.ai/rankings](https://openrouter.ai/rankings)

**Measures:** actual prompt plus completion token volume across hundreds of models through one aggregation API. Data is public under CC BY 4.0 and available through a [Data API](https://openrouter.ai/docs/cookbook/administration/data-api).

**August 2026 top ten, through Aug. 23:**

| Rank | Model | Token volume |
|---|---|---|
| 1 | DeepSeek V4 Flash 0731 | 11.6T |
| 2 | Ox Alpha (stealth) | 11.6T (new) |
| 3 | MiMo-V2.5 (xiaomi) | 9.94T |
| 4 | Hy3 (tencent) | 8.21T |
| 5 | DeepSeek V4 Flash 0423 | 5.46T |
| 6 | GPT-5.6 Luna | 4.91T |
| 7 | Nemotron 3 Ultra (free) | 4.75T |
| 8 | GLM 5.2 | 3.42T |
| 9 | DeepSeek V4 Pro 0423 | 1.85T |
| 10 | Gemini 3.7 Flash | 1.8T |

**How to read it:** this is the closest indicator of market adoption, not quality—OpenRouter explicitly says so. Strong benchmarks with little usage may indicate high price or an unstable API; high usage without top scores often indicates value or a mature ecosystem.

**Biases:** users skew technical; enterprise and direct Anthropic/OpenAI API usage is missing; tokenizers differ, so token counts are not perfectly comparable; free tiers such as Nemotron 3 Ultra may inflate use.

### Hugging Face Downloads / Likes

[huggingface.co/models](https://huggingface.co/models)

**Measures:** downloads and likes for open models, filterable by pipeline tag, seven-day trend, and lifetime totals.

**How to read it:** downloads include CI/CD pulls and can exceed actual users; likes measure attention rather than durable adoption; Trending Score is a seven-day weighted signal of what is hot now. Quantizations often out-download originals because more people can run them, not because they are better.

**Biases:** open models only; a download does not prove deployment.

### Ollama Library

[ollama.com/library](https://ollama.com/library)

**Measures:** pulls and ranking in the most popular local LLM runner.

**How to read it:** the best indicator of what people run on personal computers, usually models that balance quality with consumer-hardware performance.

**Biases:** personal and small-team use only; enterprise vLLM, TGI, and SGLang deployments are absent.

## Official Sources

### Vendor Model Cards / Blogs

Launch posts contain benchmarks, architecture, and prices. They are primary sources but require the most caution.

**How to read them:** mark self-tests with a warning because prompt templates, temperature, few-shot setup, and post-processing change results. Compare only independent runs using one protocol. Missing benchmarks may be selectively omitted. Distinguish “reaches Y%” from “beats every model.” Confirm pricing on the pricing page, including standard, batch, and cached rates, rather than launch promotions.

| Vendor | Announcements | Pricing |
|---|---|---|
| Anthropic | [anthropic.com/news](https://www.anthropic.com/news) | [anthropic.com/pricing](https://www.anthropic.com/pricing) |
| OpenAI | [openai.com/blog](https://openai.com/blog) | [openai.com/api/pricing](https://openai.com/api/pricing/) |
| Google | [blog.google/technology/ai](https://blog.google/technology/ai/) | [ai.google.dev/pricing](https://ai.google.dev/pricing) |
| Meta | [ai.meta.com/blog](https://ai.meta.com/blog/) | Open source; no API price |
| xAI | [x.ai/blog](https://x.ai/blog) | [docs.x.ai](https://docs.x.ai/) |
| Mistral | [mistral.ai/news](https://mistral.ai/news/) | [mistral.ai/products](https://mistral.ai/products/) |
| DeepSeek | [api-docs.deepseek.com/news](https://api-docs.deepseek.com/news) | [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing) |
| Qwen | [qwenlm.github.io/blog](https://qwenlm.github.io/blog/) | Open source + Tongyi API |
| Cohere | [cohere.com/blog](https://cohere.com/blog) | [cohere.com/pricing](https://cohere.com/pricing) |

## Common Traps

### Benchmark Gaming

Vendors optimize for watched benchmarks by including identical or similar questions in training, special-casing known formats at inference, or selectively reporting favorable versions. **Defense:** use independent reproduction and contamination-resistant tests such as LiveBench and HLE.

### Leaderboard Saturation

HumanEval and original MMLU are saturated above 95%. A 0.5-point gap is not practically meaningful even when marketing says “beats competitors.” **Defense:** inspect confidence intervals; overlapping intervals imply no demonstrated difference.

### Self-Reported Numbers

Vendor and independent scores differ because of prompts, temperatures, few-shot settings, and post-processing. **Defense:** compare one benchmark only within one evaluator. Anthropic's MMLU-Pro run is not directly comparable with OpenAI's.

### Cherry-Picking

“Beats GPT-4o” may compare against a six-month-old version rather than the latest. **Defense:** confirm version and date; `GPT-4o` could mean 2024-08-06, 2025-02-15, or `chatgpt-4o-latest`, with substantial performance differences.

### Stale Data

A March 2026 comparison may be three model generations behind by August. **Defense:** check publication date and model version; prefer continuously updated sources such as Artificial Analysis, LMArena, LiveBench, and Aider.

## Selection Framework: What to Read by Scenario

Different work requires different metrics.

### Agents / Tool Calling

| Prioritize | What it tells you |
|---|---|
| SWE-bench Verified | Multi-step task completion |
| Aider Polyglot | Code editing success + cost |
| Artificial Analysis Coding Agent Index | End-to-end agent performance |
| tau-bench | Multi-turn tool success (vendor self-tests) |

### RAG / Search

| Prioritize | Source |
|---|---|
| [MTEB](https://huggingface.co/spaces/mteb/leaderboard) | Embedding quality |
| [BEIR](https://github.com/beir-cellar/beir) nDCG@10 | Reranker accuracy |
| Context window | Vendor model card |
| [RULER](https://github.com/hsiehjackson/RULER) / Needle in a Haystack | Long-context retrieval |

### Cost / High Throughput

| Prioritize | Source |
|---|---|
| Artificial Analysis price + speed | Standardized $/1M and tokens/sec |
| Aider cost | Actual cost for identical tasks |
| OpenRouter Rankings | High-use models often offer good value |

### General Chat / Customer Service

| Prioritize | Source |
|---|---|
| LMArena ELO | Real user preference |
| MMLU-Pro | Knowledge breadth |
| Multilingual benchmarks such as Aya | Non-English service |

### Reasoning / Math / Science

| Prioritize | Source |
|---|---|
| AIME | Math reasoning |
| GPQA Diamond | Science reasoning |
| HLE | Extreme cross-domain reasoning |
| LiveBench Reasoning | Contamination-resistant reasoning |

### Image Generation

| Prioritize | Source |
|---|---|
| LMArena / AA Image Arena | Human-preference ELO |
| Evalytic TR / PA | Text rendering and prompt adherence |
| $/1,000 images | Artificial Analysis pricing |

### Video Generation

| Prioritize | Source |
|---|---|
| AA Video Arena, dated | Volatile human-preference ELO |
| VBench / VBench-2.0 | 16+18 technical dimensions |
| $/minute | Provider pricing |

### Text-to-Speech (TTS)

| Prioritize | Source |
|---|---|
| AA Speech Arena | Human-preference ELO |
| TTS-Bench | Local speed, listening, and objective scores |
| SEED-TTS-Eval | Voice-cloning quality |

### Multimodal Understanding (VLM)

| Prioritize | Source |
|---|---|
| MMMU-Pro | Cross-subject visual reasoning |
| DocVQA / ChartQA | Practical document understanding |
| MathVista | Visual math reasoning |

## Overall

No single benchmark tells you whether a model is good. Instead:

1. **Define the scenario** and select two or three relevant metrics.
2. **Use independent evaluations**, not vendor self-tests.
3. **Cross-check** quality benchmarks, adoption, and your own tests.
4. **Always attach a date** and model version to every number.

The greatest risk is not choosing the wrong model. It is choosing with the wrong numbers.

---

## References

- [Artificial Analysis](https://artificialanalysis.ai) — independent quality, price, and speed comparisons
- [LMArena](https://lmarena.ai) — human-preference ELO
- [LiveBench](https://livebench.ai) — refreshed contamination-resistant benchmark, 23 tasks × seven categories
- [SWE-bench](https://www.swebench.com) — real GitHub issue repair
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — multilingual code editing with cost
- [OpenRouter Rankings](https://openrouter.ai/rankings) — actual aggregate API usage
- [HuggingFace Models](https://huggingface.co/models) — downloads, likes, and trends
- [Ollama Library](https://ollama.com/library) — local-model pulls
- [MMLU-Pro (arXiv:2406.01574)](https://arxiv.org/abs/2406.01574)
- [GPQA (arXiv:2311.12022)](https://arxiv.org/abs/2311.12022)
- [Humanity's Last Exam (arXiv:2501.14249)](https://arxiv.org/abs/2501.14249)
- [MMMU Benchmark](https://mmmu-benchmark.github.io/)
- [MathVista](https://mathvista.github.io/)
- [LMArena Text-to-Image](https://arena.ai/leaderboard/text-to-image)
- [Artificial Analysis Image Arena](https://artificialanalysis.ai/image/leaderboard/text-to-image)
- [Evalytic Image Leaderboard](https://evalytic.ai/leaderboard)
- [Artificial Analysis Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video)
- [VBench](https://vchitect.github.io/VBench-project/)
- [TTS-Bench](https://github.com/5uck1ess/tts-bench)
- [Artificial Analysis Speech Arena](https://artificialanalysis.ai/text-to-speech/arena)
- [MINT-Bench (arXiv:2604.17958)](https://arxiv.org/abs/2604.17958)
- [SongBench](https://github.com/Tencent/SongBench)
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [BEIR](https://github.com/beir-cellar/beir)
