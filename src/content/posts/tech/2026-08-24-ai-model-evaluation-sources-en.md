---
title: "AI Model Evaluation Sources: How to Judge Whether a Model Is Actually Good"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, benchmark, evaluation, model-selection]
lang: en
tldr: "You cannot take model vendors' self-reported scores at face value. This guide covers the most important independent evaluation platforms in 2026 (Artificial Analysis Intelligence Index v5.0.1, Arena, LiveBench 2.0, Vals AI, Epoch AI), domain benchmarks (SWE-bench, Terminal-Bench, HLE-Diamond, and more), adoption indicators, and official sources: what each measures, how to read it, where it is biased, and which figures matter for different use cases."
description: "A 2026 guide to AI model evaluation sources including Artificial Analysis, Arena (formerly LMArena), LiveBench, Vals AI, Epoch AI, SWE-bench, Terminal-Bench, and OpenRouter Rankings, with interpretation methods, limitations, and common traps."
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

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-evaluation-sources)

Model launches arrive with a wall of benchmark numbers. Which are credible, and which are inflated? This guide breaks down the main evaluation sources in 2026: what each measures, how to interpret it, and where its biases lie.

The goal is not to list every benchmark. It is to help you ask where a number came from, what it represents, and whether to trust it.

## General Evaluation Platforms

These five platforms approach the question “how good is the model overall?” from different angles.

### Artificial Analysis

[artificialanalysis.ai](https://artificialanalysis.ai)

**Measures:** quality, price, speed, and latency across text, image, video, and speech, plus real API throughput and cost. For text models the headline metric is the [Intelligence Index](https://artificialanalysis.ai/methodology/intelligence-benchmarking), currently v5.0.1: nine evaluations in four categories — Knowledge Work, Coding, Science, and General, 25% each — including AA-Briefcase, FrontierCode-AA 2.0, Terminal-Bench 4.0, Terminal-Bench-Science, CritPt v2, AA-Omniscience, and HLE-Diamond, mostly agentic tasks rather than multiple choice. Image and video use their own v2.1 Elo boards.

**How to read it:** two kinds of value. First, standardized price and speed comparisons: for API selection, its output tokens/sec and $/1M-token figures are often more useful than one-off local tests because it continuously monitors providers. Second, every model runs the same evaluations under the same conditions, so results compare directly; this site's [model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) and family posts use its Intelligence Index plus Terminal-Bench 4.0 and FrontierCode 2.0. When the Intelligence Index version changes, so do its tasks and weights, so scores across versions are not comparable.

**Biases:** primarily covers API models; local models receive less coverage. Several evaluations (AA-Briefcase, FrontierCode-AA, AA-Omniscience, and others) use private question sets that outsiders cannot rerun.

### Arena (formerly LMArena, Chatbot Arena)

[arena.ai](https://arena.ai) — [renamed from LMArena on 2026-01-28](https://arena.ai/blog/lmarena-is-now-arena), moving from lmarena.ai; before that it was Chatbot Arena on lmsys.org.

**Measures:** human preference. Users chat with two anonymous models, choose the better response, and produce an ELO ranking.

**How to read it:** ELO answers “which response does an ordinary user prefer?” It is closer to actual user experience than an exam. Differences below 20 points are generally not statistically significant.

**Biases:** voters favor longer, more formatted answers; style can beat correctness; prompts skew toward ordinary conversation rather than coding or professional work; experienced voters may infer model identity from style. Despite this, Arena is widely cited because static benchmarks are easier to game.

### LiveBench

[livebench.ai](https://livebench.ai)

**Measures:** since 2026-10 it is LiveBench 2.0, which swaps short questions for long-running real work — building decks, writing research reports, fixing bugs, building apps that run for hours — in seven suites (Agentic, Design, Coding, Browser Use, Data Analysis, Research, Reasoning), with cost per successful task. The core goal is still contamination resistance: questions keep changing, and 2.0 shipped three releases in its first month (2026-10-14, 10-25, 11-06).

**How to read it:** it reflects current ability better than static tests such as MMLU because the questions are new, and the cost-per-successful-task column is a direct value comparison. Scores from different releases are not directly comparable; compare models within one release, and treat 1.x and 2.0 as entirely different tests.

**Biases:** task selection reflects the designers' preferences. LiveBench is maintained by Abacus AI, whose site says the results also power its own agent product.

### Vals AI

[vals.ai/benchmarks](https://www.vals.ai/benchmarks)

**Measures:** real industry tasks — currently 43 independent evaluations across legal, finance, healthcare, coding, math, tax, and more, each comparing accuracy, cost, and latency. The headline Vals Index weights agentic finance, coding, legal, and tax tasks by each sector's share of U.S. GDP; there are also Finance, Legal, and Science sub-indexes, and an Inference Provider Index that compares the same open-weight model across inference providers.

**How to read it:** for professional work such as law or finance, Vals' sub-boards fit better than general indexes. On 2026-11-19 the Vals Index top three were Claude Fable 5.2 (71.31%), Gemini 4 Neon (70.87%), and Claude Sonnet 5.5 (70.85%) — within half a point, effectively one tier. This site's model family posts cite its sub-scores often.

**Biases:** most question sets are private and can't be rerun; coverage centers on U.S. industry structure and regulation, with limited local-law and non-English material.

### Epoch AI

[epoch.ai/benchmarks](https://epoch.ai/benchmarks)

**Measures:** a research organization's benchmark database tracking 431 models and 99 benchmarks, some run in-house (GPQA Diamond, FrontierMath, and others) and some collected from external sources. The Epoch Capabilities Index (ECI) combines many benchmarks into one capability scale; the record holder in 2026-11 is Claude Fable 5.2. The FrontierMath line added FrontierMath Erdős in 2026-09: 68 unsolved Erdős problems that models must solve in Lean.

**How to read it:** best for long-run trends — how ability on one benchmark moves with time, compute, and openness. ECI now uses a Bayesian model with uncertainty intervals, so check whether intervals overlap before comparing two models.

**Biases:** a newly launched model may have only a few Epoch-run results, and the ECI shifts as more come in; Epoch notes that launch-day records rest on pre-launch testing and may change.

## Domain Benchmarks

General platforms assess overall quality; domain benchmarks answer whether a model can perform a specific job.

### SWE-bench / SWE-bench Verified

[swebench.com](https://www.swebench.com)

**Measures:** real GitHub issues from 12 open-source Python projects including Django, Flask, and scikit-learn. A model reads the repository, fixes the bug, and must pass the associated tests.

**Verified:** the original (2,294 problems) contains ambiguous issues and weak tests. Verified is a manually reviewed 500-problem subset and the most frequently cited version. The official site also has Bash Only (the default Verified view, with every model in the same mini-SWE-agent environment — the fairest cross-model comparison), Lite (300), Multilingual (42 repositories, nine languages, 300 problems), and Multimodal (480 problems with visual elements).

**How to read it:** a high score shows repository understanding, bug localization, and correct patches. The original and Verified measure only Python bug fixes—not new features or refactoring; for other languages, read Multilingual. Verified scores in vendor announcements usually come from the vendor's own agent harness, which is not the same condition as the official Bash Only view.

**Biases:** original and Verified are Python only; accepts fixes that pass the original tests even when other valid fixes exist; vendors may train specifically on the coding style of these 12 repositories.

### Terminal-Bench

[tbench.ai](https://www.tbench.ai/)

**Measures:** long tasks in a terminal — compiling, setting up environments, debugging, running data jobs — graded by test suites, with resolution rates and 95% confidence intervals. The latest version on the site is Terminal-Bench 4.1, with the 4.0 board still listed. Each entry is a model plus an agent harness (Claude Code, Codex, GitHub Copilot, and others), with token use and cost.

**How to read it:** one of the most cited coding-agent evaluations in 2026. Artificial Analysis includes Terminal-Bench 4.0 (66 tasks) in its Intelligence Index, and this site's model overview uses it to compare coding ability. On the official board the same model scores differently under different harnesses, so hold the harness fixed or use Artificial Analysis's uniformly run version.

**Biases:** tasks lean toward Linux terminal work and don't cover interactive editing inside an IDE; versions (2.x, 3.0, 4.0, 4.1) use different tasks, so scores don't compare across versions.

### Aider Polyglot

[aider.chat/docs/leaderboards](https://aider.chat/docs/leaderboards/)

**Measures:** 225 Exercism exercises in C++, Go, Java, JavaScript, Python, and Rust. A model edits existing files until tests pass; API cost is recorded.

**How to read it:** by design closer than SWE-bench to everyday “change this code correctly” work. But the newest results on the board are 2025 models (GPT-5 (high) 88% for $29); no 2026 frontier model is listed, so treat it as historical. For current models, use Terminal-Bench or LiveBench's Coding suite.

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

**Measures:** extremely difficult questions across 100+ subjects, written by thousands of experts through Scale AI and CAIS and published in Nature (649, 1139–1146). At release in 2025-01, frontier models scored in the single digits.

**HLE-Diamond:** a [refined version released 2026-09-22](https://lastexam.ai/blog/hle-diamond). After a year of cleanup, 1,000 questions were drawn from the original 2,500-question pool and its held-out reserve, split into 500 reasoning and 500 knowledge questions, with a frozen set and stable IDs so scores compare across time. Artificial Analysis Intelligence Index v5.0.1 now uses HLE-Diamond (no tools, including 272 image questions); its earlier results used 2,158 text-only questions from the full set and are listed separately.

**How to read it:** progress is rapid. In August 2026 the top of original HLE was around 55% (Claude Fable 5 at 55.5%, Opus 5 at 54.9%). On the official no-tools HLE-Diamond results, Claude Fable 5.2 leads at 74.3%, followed by GPT-6.2 Astra at 66.6% and Gemini 4 Neon at 65.2%; reasoning scores generally exceed knowledge scores. Scale expects Diamond to carry signal for another 6 to 12 months.

**Biases:** results vary sharply by source. Original HLE has full-set, text-only, with-tools, and no-tools variants; in 2026-08 Artificial Analysis reported about 55% for Opus 5 on text-only questions while BenchLM reported 64.7%. HLE-Diamond scores are not interchangeable with original HLE. Always record the question set, tool use, and evaluator.

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

### Arena Text-to-Image

[arena.ai/leaderboard/text-to-image](https://arena.ai/leaderboard/text-to-image)

**Measures:** pairwise blind ELO voting on images generated from the same prompt, across 87 models, with median cost per image.

**Top five, 2026-11-21:** GPT-Image-2.5 Sunburst (1429), GPT-Image-2.6 Sunburst Medium (1412), GPT-Image-2.5 Flare (1400), MAI-Image-2.7 (1385), GPT-Image-2 Medium (1382). The best open-weight model is Qwen-Image-2.1.

### Artificial Analysis Image Arena

[artificialanalysis.ai/image/leaderboard/text-to-image](https://artificialanalysis.ai/image/leaderboard/text-to-image)

**Measures:** independent image ELO (currently AA-Image-T2I v2.1) plus API price per thousand images, combining quality and cost. On 2026-11-23 the leader was GPT Image 2.6 Sunburst (max) at 1263 and $210.72/thousand; MAI-Image-2.7, also top five, scored 1215 at $34.82/thousand — about a sixth of the price.

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

**Measures:** blind-vote ELO for text-to-video and image-to-video, each split into with-audio and without-audio boards, covering 30+ models with $/minute prices. The current version is v2.1, which pins Kling 3.0 1080p (Pro) at 1000 as its anchor.

**Top five, T2V with audio, 2026-11-23 (AA-Video-T2V v2.1):** Wan 3.0 (1175), Utopai X (1171), MiniMax H3 768p (1163), Hyperflow H3 (1157), Seedance 2.5 (1156). With the v2.1 anchor these scores aren't comparable to the older board this post cited in its 2026-08 version (Wan 3.0 1244 then). For access and licensing per model, see [video generation model families](/posts/tech/2026-08-26-ai-model-family-video-generation-en).

**Biases:** rankings fluctuate more than text or image rankings. Kling 3.0 1080p Pro moved by 137 ELO and three positions across measurements, and a board revision can reset the whole scale. Always attach the date and board version to video rankings.

### Arena Image-to-Video

[arena.ai/leaderboard/image-to-video](https://arena.ai/leaderboard/image-to-video)

**Measures:** ELO across 50 I2V models, with median cost per video. As of 2026-11-08, Gemini Omni 1.2 Flash leads at 1503, closely followed by Seedance 2.5 720p (1494) and MiniMax H3 (1493); MiniMax H3 is also the top open-weight model.

### VBench / VBench-2.0

[vchitect.github.io/VBench-project](https://vchitect.github.io/VBench-project/)

**Measures:** VBench decomposes quality into 16 dimensions such as subject consistency, motion smoothness, temporal flicker, and aesthetics. VBench-2.0 added 18 physical-realism dimensions in March 2026, including fluid flow and collision inertia.

**How to read it:** Arena measures subjective preference; VBench measures technical quality, and they can disagree. Open Wan 2.2 scored 84.7% on VBench, while even leading models scored only about 50% on VBench-2.0's physical-motion dimensions.

## Speech and Music Evaluation

### Artificial Analysis Speech Arena

[artificialanalysis.ai/text-to-speech/arena](https://artificialanalysis.ai/text-to-speech/arena)

**Measures:** blind-listening ELO between two TTS outputs of the same text. On 2026-11-23 Eleven v4 Turbo and Eleven v4 tied for first (1340), followed by StepAudio 3 TTS (1307).

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

**Weekly top ten, 2026-11 (data through Nov. 22, trailing seven days):**

| Rank | Model | Token volume |
|---|---|---|
| 1 | DeepSeek V4.1 Flash 1017 | 65T |
| 2 | DeepSeek V4.1 Flash | 15.4T |
| 3 | GLM 5.3 Flash (z-ai) | 12.2T |
| 4 | Hy4 flash (tencent) | 10.2T (new) |
| 5 | GPT-6 Luna | 8.31T |
| 6 | Claude Opus 5.5 | 6.97T |
| 7 | MiniMax M3.1 Flash | 4.29T |
| 8 | Kimi K3.1 Pro | 4.07T |
| 9 | Nemotron 3 Ultra (free) | 3.93T |
| 10 | MiMo-V2.6-Flash (xiaomi) | 3.7T |

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

A March 2026 comparison may be three model generations behind by August. **Defense:** check publication date and model version; prefer continuously updated sources such as Artificial Analysis, Arena, LiveBench, Vals AI, and Epoch AI; treat boards that stopped updating (such as Aider Polyglot, frozen at 2025 models) as stale too.

## Selection Framework: What to Read by Scenario

Different work requires different metrics.

### Agents / Tool Calling

| Prioritize | What it tells you |
|---|---|
| SWE-bench Verified (Bash Only) | Multi-step task completion |
| Terminal-Bench 4.0 / 4.1 | Long terminal-task resolution + cost |
| Artificial Analysis FrontierCode-AA 2.0 | Code changes to real open-source repos |
| LiveBench 2.0 (Agentic suite) | Long agent tasks + cost per successful task |
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
| Terminal-Bench and LiveBench cost columns | Actual cost for identical tasks |
| OpenRouter Rankings | High-use models often offer good value |

### General Chat / Customer Service

| Prioritize | Source |
|---|---|
| Arena ELO | Real user preference |
| MMLU-Pro | Knowledge breadth |
| Multilingual benchmarks such as Aya | Non-English service |

### Reasoning / Math / Science

| Prioritize | Source |
|---|---|
| AIME | Math reasoning |
| GPQA Diamond | Science reasoning |
| HLE-Diamond | Extreme cross-domain reasoning |
| Epoch AI (FrontierMath, ECI) | Frontier math and long-run capability trends |
| LiveBench Reasoning | Contamination-resistant reasoning |

### Image Generation

| Prioritize | Source |
|---|---|
| Arena / AA Image Arena | Human-preference ELO |
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

## Changelog

- 2026-11-23: Data updated to 2026-11. Artificial Analysis now describes the Intelligence Index v5.0.1 composition (nine evaluations, four categories at 25% each), and the earlier Coding Agent Index is replaced by the Terminal-Bench 4.0 and FrontierCode-AA 2.0 evaluations inside the index; LMArena is now Arena (arena.ai) after its 2026-01-28 rename; LiveBench is rewritten as 2.0 (long real tasks, seven suites, cost per successful task), correcting "refreshed every six months"; new Vals AI, Epoch AI, and Terminal-Bench sections; SWE-bench adds the official Bash Only, Multilingual, and other variants; Aider Polyglot corrected to 225 exercises in six languages and noted as frozen at 2025 models; HLE adds the 2026-09 HLE-Diamond and Artificial Analysis's switch to it, and removes the inaccurate "Gemini 3 Pro at 38.3% in April 2025"; image, video, and speech boards and the OpenRouter weekly ranking use 2026-11 data; the selection framework's agent, cost, chat, and reasoning tables are updated to match.

## References

- [Artificial Analysis](https://artificialanalysis.ai) — independent quality, price, and speed comparisons
- [Artificial Analysis Intelligence Benchmarking Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) — Intelligence Index v5.0.1 composition and weights
- [Arena](https://arena.ai) — human-preference ELO (formerly LMArena)
- [LMArena is now Arena](https://arena.ai/blog/lmarena-is-now-arena) — 2026-01-28 rename announcement
- [LiveBench](https://livebench.ai) — contamination-resistant benchmark, version 2.0 since 2026-10
- [Vals AI Benchmarks](https://www.vals.ai/benchmarks) — industry-task evaluations and the Vals Index
- [Epoch AI Benchmarks](https://epoch.ai/benchmarks) — benchmark database and Epoch Capabilities Index
- [SWE-bench](https://www.swebench.com) — real GitHub issue repair
- [Terminal-Bench](https://www.tbench.ai/) — long terminal-task agent benchmark
- [Introducing HLE-Diamond](https://lastexam.ai/blog/hle-diamond) — 1,000-question refined HLE
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — multilingual code editing with cost (frozen at 2025 models)
- [OpenRouter Rankings](https://openrouter.ai/rankings) — actual aggregate API usage
- [HuggingFace Models](https://huggingface.co/models) — downloads, likes, and trends
- [Ollama Library](https://ollama.com/library) — local-model pulls
- [MMLU-Pro (arXiv:2406.01574)](https://arxiv.org/abs/2406.01574)
- [GPQA (arXiv:2311.12022)](https://arxiv.org/abs/2311.12022)
- [Humanity's Last Exam (arXiv:2501.14249)](https://arxiv.org/abs/2501.14249)
- [MMMU Benchmark](https://mmmu-benchmark.github.io/)
- [MathVista](https://mathvista.github.io/)
- [Arena Text-to-Image](https://arena.ai/leaderboard/text-to-image)
- [Arena Image-to-Video](https://arena.ai/leaderboard/image-to-video)
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
