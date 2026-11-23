---
title: "IBM Granite: Granite 4.2 Reasoning Models Plus Guardian, Vision, Speech, Embedding and Time Series, an Apache 2.0 Kit of Small Enterprise Models"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, ibm, open-source, model-family-granite, reasoning, embedding, speech-to-text, guardrails, model-selection]
lang: en
type: deep-dive
tldr: "IBM Granite's current language line is Granite 4.2 (3B, 8B and 30B dense reasoning models with switchable thinking; plan self-hosting around 128K context), surrounded by Guardian 4.1 (a judge model), Vision 4.1 (document extraction), Speech 5.0 (speech recognition), Embedding R2 and time-series models. Almost everything is Apache 2.0; the exception is the non-commercial license on the speech NC variant. Artificial Analysis scores the 30B at 6 and the 8B at 5, below the median for their size. Granite's value is full self-hosting, a clean license and a complete set of sub-lines, not single-model scores."
description: "IBM Granite model family: what Granite 4.2 and the Switch, Guardian, Vision, Speech, Embedding and time-series sub-lines are for, the turn from 4.0's hybrid Mamba back to dense in 4.1 and 4.2, vendor and third-party evaluations, license exceptions, OpenRouter, watsonx and Workers AI pricing, and agent selection."
series:
  name: "AI Model Families"
  order: 39
draft: false
glossary:
  - term: "aLoRA (Activated LoRA)"
    aliases: ["Activated LoRA"]
    definition: "A LoRA adapter that only takes effect after a control token activates it; the KV cache before activation is produced by the base model, so switching to the adapter can reuse it instead of recomputing the whole prefix"
  - term: "CTC (Connectionist Temporal Classification)"
    definition: "A speech recognition training objective that aligns audio frames directly to text units, so inference can emit output non-autoregressively in one pass, far faster than speech language models that generate token by token"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-granite)

IBM Granite is IBM's open-weight model family, built around small models that enterprises can deploy themselves. The largest language model is 30B, and alongside it sit sub-lines for safety judging, document vision, speech, embeddings and time-series forecasting, almost all released under Apache 2.0. This post is for developers assembling agent pipelines inside their own data center or cloud account: which Granite 4.2 size to pick, which gap each sub-line fills, and how far it sits from frontier open-weight models.

As of November 2026 the main line is Granite 4.2, released on August 25. It is the first Granite generation with a built-in thinking mode, but the architecture moved from 4.0's hybrid Mamba back to an ordinary dense Transformer.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Granite is a set of components you can use separately, not one flagship plus shrunken copies. Every row below is open weights under the Hugging Face [`ibm-granite` organization](https://huggingface.co/ibm-granite):

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| [Granite 4.2](https://huggingface.co/ibm-granite/granite-4.2-30b) (3B / 8B / 30B) | Current language line | Dense Transformer; thinking, non-thinking and low-effort modes; 12 tested languages; text only | Weights (Apache 2.0); only the 8B is hosted on OpenRouter, from $0.06 / $0.15 |
| [Granite 4.1](https://huggingface.co/ibm-granite/granite-4.1-8b) (3B / 8B / 30B) | Previous non-reasoning instruct models, and the base of 4.2 | No thinking mode; this is the generation watsonx.ai currently lists | Weights (Apache 2.0) + watsonx.ai |
| [Granite Switch 4.1](https://huggingface.co/ibm-granite/granite-switch-4.1-8b) (8B / 30B) | One endpoint for chat, decisions and speech | 4.1 base + decision and guardian aLoRAs + embedded speech encoder | Weights (Apache 2.0), vLLM plugin or llama.cpp |
| [Granite Guardian 4.1 8B](https://huggingface.co/ibm-granite/granite-guardian-4.1-8b) | Input/output judge | Built-in criteria for harm, jailbreaks, RAG and tool-call hallucination, plus custom criteria | Weights (Apache 2.0) |
| [Granite Vision 4.1 4B](https://huggingface.co/ibm-granite/granite-vision-4.1-4b) | Document image extraction | Chart to CSV or code, table to JSON or HTML, key-value extraction | Weights (Apache 2.0) + watsonx.ai |
| [Granite Speech 5.0](https://huggingface.co/ibm-granite/granite-speech-5.0-2b) (2B / 470M TurboCTC) | Speech recognition and translation | The 2B is a speech language model that can translate; the 470M only transcribes, an order of magnitude faster | Weights (Apache 2.0; NC variant separate) |
| [Granite Embedding Multilingual R2](https://huggingface.co/ibm-granite/granite-embedding-311m-multilingual-r2) (311M / 97M) | Multilingual retrieval vectors | 32K context, 768 / 384 dimensions, truncatable | Weights (Apache 2.0) |
| Granite Time Series ([TTM-R3](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3), [PatchTST-FM-r2](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2), [Ensemble R1](https://huggingface.co/ibm-granite/granite-timeseries-ensemble-r1)) | Zero-shot time-series forecasting | From about 1M to about 385M parameters, not language models | Weights (Apache 2.0; PatchTST-FM-r2 dual-licensed) |

Three things to know first:

- **Two context numbers.** The [Granite 4.2 model card](https://huggingface.co/ibm-granite/granite-4.2-30b) says "natively supports 128K, long-context extension to 512K", because the last pre-training phase of the 4.1 base stretched length to 512K. The model config, the official vLLM and SGLang examples, Ollama and OpenRouter all use 131,072 tokens. Plan systems around 128K and validate 512K yourself.
- **The 3B has no agentic training.** The 8B and 30B go through three extra agentic reinforcement learning stages (software engineering, terminal, search); the 3B only gets foundational RL, and its SWE-bench and Terminal-Bench cells in the official table are NA.
- **4.2 is text only.** For images use Vision 4.1 4B, for audio use Speech 5.0 or Switch; there is no multimodal Granite 4.2 yet.

### Sub-lines and ecosystem

- **Switch and Granite Libraries.** [Granite Libraries](https://huggingface.co/collections/ibm-granite/granite-libraries) (`granitelib-core`, `granitelib-rag`, `granitelib-guardian`) are aLoRA adapters trained for tasks such as RAG query rewriting, hallucination detection and policy checks. Switch composes some of them with a base model into one checkpoint; Switch 4.1 ships only decision and guardian-core by default, while the [preview builds](https://huggingface.co/ibm-granite/granite-switch-4.1-8b-preview) carry 12. IBM recommends calling them through its [Mellea](https://github.com/generative-computing/mellea) library.
- **Docling.** The VLM pipeline of the document converter [Docling](/posts/tech/2026-09-06-docling-document-parsing-en) defaults to [Granite-Docling 258M](https://huggingface.co/ibm-granite/granite-docling-258M), and Vision 4.1 4B can plug into Docling for deeper chart and table extraction.
- **Experiments.** [Granite-SWASH-3B-A600M](https://huggingface.co/ibm-granite/granite-swash-3b-a600m) (an MoE with sliding-window attention and attention sinks, labelled a preview of the next Granite generation) and [Granite 4.1 LLMON preview](https://huggingface.co/ibm-granite/granite-4.1-8b-llmon-preview) (wraps each prompt part in an addressable block to separate trusted instructions from untrusted data) live in the Granite Experiments collection and are not products.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Granite Code | 2024-05-06 | 3B to 34B code models, IBM's first large batch of open weights | — |
| Granite 3.0 | 2024-10-21 | General 2B / 8B instruct models released under Apache 2.0, with Guardian 3.0 alongside | — |
| Granite 3.1 / 3.2 / 3.3 | 2024-12 to 2025-04 | 3.1 extended context to 128K; 3.2 added a switchable thinking mode; the Vision and Speech sub-lines took shape in this period | — |
| Granite 4.0 | 2025-10-02 | Hybrid Mamba-2 / Transformer, cutting memory for long context and many concurrent sessions; first open models with ISO 42001 certification and cryptographically signed checkpoints | [Workers AI guide](/posts/ai/2026-08-18-workers-ai-model-guide-en) (4.0-H-Micro) |
| Granite 4.1 | 2026-04-29 | Back to a dense Transformer, about 15T pre-training tokens; IBM says the 8B matches 4.0-H-Small (32B-A9B). Guardian, Vision and Embedding R2 refreshed the same month | — |
| Granite 4.2 | 2026-08-25 | First generation with built-in thinking; agentic RL for 8B / 30B; Speech 5.0 TurboCTC launched the same day | [Daily digest](/posts/daily/2026-08-29-ai-agent-daily-en), [Speech 5.0](/posts/daily/2026-08-28-ai-agent-daily-en) |
| Granite Switch 4.1 / 4.1.1 | 2026-10-14 / 10-27 | Chat, decisions, safety judging and speech share one endpoint; 4.1.1 updates the decision weights and adds 7 speech languages | [4.1](/posts/daily/2026-10-17-ai-agent-daily-en), [4.1.1](/posts/daily/2026-10-30-ai-agent-daily-en) |
| Speech 5.0 2B | 2026-10-20 | New generation of the speech language model, with expanded translation and keyword biasing | — |

The site has no daily model cards for Granite, so the table links to that day's daily digest. Two threads run through the timeline. The first is architecture: 4.0 bet on hybrid Mamba for long-context memory efficiency, then 4.1 went back to dense; IBM Research says the dense architecture "supports broad compatibility" across cloud, on-premises and edge. The second is the shift from one language model to a component library: Guardian, Libraries and Switch turn "safety check" and "RAG subtask" into adapters on a shared base. The 4.0 hybrid models (H-Micro, H-Tiny, H-Small) are still on Hugging Face, watsonx.ai and Workers AI, but they are not the selection target here.

## Architecture and training trade-offs

### Granite 4.2: small dense models with staged reinforcement learning

What the [Granite 4.2 technical blog](https://huggingface.co/blog/ibm-granite/granite-4-2) and model cards disclose:

- **Backbone**: dense decoder-only with GQA (8 KV heads), RoPE (θ = 10,000,000), SwiGLU, RMSNorm and untied input/output embeddings. The 3B and 8B have 40 layers; the 30B has 64.
- **Pre-training**: inherited from the 4.1 base, about 15T tokens in five phases. The first two lay foundations and weight math and code more heavily, the middle two anneal on high-quality data, and the last extends context in stages from 4K to 512K. The [IBM Research announcement](https://research.ibm.com/blog/introducing-granite-4-2) also mentions 1T tokens of synthetic code and a speculative decoding layer for faster output.
- **SFT**: about 7.2 million samples, 100B tokens, with agentic data at 31.6% (of which software engineering is 69%). The data comes from a dozen agent harnesses including OpenHands, OpenCode, SWE-agent and Codex, filtered by LLM judges to drop hallucinations, invalid tool interactions and calls to undefined functions. The 30B gets a second SFT phase that upsamples agentic coding data.
- **Reinforcement learning**: each stage is a separate asynchronous GRPO run warm-started from the previous checkpoint: verifiable rewards (math, code, science, instruction following, tool calling) → instruction-following and code boosters → software-engineering agent (real repo sandboxes, hidden tests) → terminal agent → search agent (LLM judge on the final answer) → RLHF. The RLHF stage also adds a reasoning-length penalty to trim verbose thinking picked up earlier.

Staging lets each run optimize one capability with a clean reward signal. The cost is that the 3B is left out of the agentic stages, so the gap between sizes is more than parameter count.

### Why Granite went from hybrid Mamba back to dense

The [Granite 4.0 announcement](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models) sold the H series on having only 4 attention layers out of every 40, with the other 36 being Mamba-2, which sharply cut memory for long context and many concurrent sessions. But hybrid architectures need extra support in inference frameworks, and IBM shipped a conventional-Transformer 4.0-Micro at the time for platforms that lacked it. After switching to dense, the [Granite 4.1 blog](https://huggingface.co/blog/ibm-granite/granite-4-1) claims the 8B instruct model matches or beats 4.0-H-Small. For self-hosters the practical effect of 4.2 is that any framework that runs a standard Transformer can serve it, but the KV cache again grows linearly with length, so memory at 128K is higher than with 4.0-H.

### Sub-line architecture notes

- **Switch**: every adapter is an aLoRA, so the KV cache computed by the base model is reused directly for subsequent decisions or safety checks; the [Switch 4.1 blog](https://huggingface.co/blog/ibm-granite/granite-switch-4-1) says the whole bundle takes about the same VRAM as the base model alone. Speech works by splicing the TurboCTC transcript back into the chat, and the [model card](https://huggingface.co/ibm-granite/granite-switch-4.1-8b) says plainly that the speech encoder and the LLM are not jointly trained.
- **Speech 5.0 TurboCTC**: encoder only, no LLM, 16 Conformer blocks plus CTC, with output rate reduced to 12.5 tokens per second. The [launch blog](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc) is explicit about the trade: over 20x throughput in exchange for giving up speech translation and keyword biasing. For translation use [Speech 5.0 2B](https://huggingface.co/ibm-granite/granite-speech-5.0-2b), a speech language model built by aligning granite-4.0-1b-base to speech.
- **Vision 4.1 4B**: built on Granite 4.1 3B, a 3.4B language model plus a 0.6B vision encoder, with task tags (`<chart2csv>`, `<tables_html>` and so on) selecting the extraction task.
- **Embedding R2**: ModernBERT architecture; the 97M is derived from the 311M by layer pruning and vocabulary selection.

## Evaluation and alternatives

### Vendor-reported: the three Granite 4.2 sizes

From the [Granite 4.2 model card](https://huggingface.co/ibm-granite/granite-4.2-30b) and technical blog, measured by IBM with a framework based on the NeMo Evaluator SDK:

| Benchmark | 3B | 8B | 30B |
|---|---|---|---|
| SWE-bench Verified | NA | 47.67 | 57.00 |
| SWE-bench Pro | NA | 19.11 | 33.29 |
| Terminal-Bench 2.1 | NA | 20.56 | 29.24 |
| τ³-bench (avg) | 45.78 | 58.06 | 62.00 |
| BFCL v4 | 52.41 | 52.39 / 50.29 | 61.39 |
| AIME25 | 78.33 | 86.67 | 89.17 |
| GPQA | 54.80 | 64.14 | 66.41 |
| IFBench (prompt) | 74.33 | 79.33 | 77.17 |
| RULER 128K | 55.30 | 71.41 | 81.38 |

How to read it:

- **The 8B-to-30B gap is concentrated in agentic coding.** SWE-bench Pro jumps from 19 to 33, while reasoning and instruction following differ by a few points; for RAG and document work the 8B is better value.
- **IBM's own documents disagree slightly.** The 8B's BFCL v4 is 52.39 on the model card and 50.29 in the blog table, so both are shown. The blog text says 40 attention heads, but its own architecture table lists 32 for the 8B and 30B; this post follows the table.
- **No competitor numbers in text form.** The [IBM Research announcement](https://research.ibm.com/blog/introducing-granite-4-2) only includes a chart comparing the 30B with similar models, without per-benchmark figures, so it is not turned into a table here.

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-30b) Intelligence Index v5.0.1 gives Granite 4.2 30B a 6, below the median of 10 among 4B–40B open-weight models; the [8B](https://artificialanalysis.ai/models/granite-4-2-8b) gets 5; the [3B](https://artificialanalysis.ai/models/granite-4-2-3b) also gets 5, but that is above the median of 4 in the sub-4B class. The index is dominated by hard agent tasks such as Terminal-Bench 4.0, FrontierCode and HLE, which is harsh on small models; for reference, [Tencent Hy4](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) scores 35. Artificial Analysis also measures the 8B at $0.0405 per index task and about 100 tok/s, with mid-pack verbosity.

### Vendor numbers for the sub-lines

All of these are IBM's self-reported model card results; comparison sets and conditions are as stated on each card:

- **Speech 5.0 TurboCTC**: the [launch blog](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc) measured over 12,600 RTFx on a single H200 (more than 3.5 hours of audio transcribed per second), when the speed leaders on the Open ASR Leaderboard were around 6,000. The October multilingual [model card](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc) reports 5.51% average English WER, better than the English-only release's 5.78%; this aggregation differs from the 5.00% in the launch blog, so the two are not directly comparable. Japanese CER beats the 2B on all three test sets.
- **Embedding R2**: Multilingual MTEB Retrieval (18 tasks) 65.2 for the 311M and 60.3 for the 97M; IBM says the 97M is the highest-scoring open multilingual model under 100M parameters.
- **Guardian 4.1 8B**: balanced accuracy on IFEval multi-constraint custom criteria rises from Guardian 3.3's 0.458 to 0.844; as a best-of-N reward model on JETTS it scores 70.29, above every tested reward model up to 70B.
- **Vision 4.1 4B**: 94.2% zero-shot exact match on VAREX document key-value extraction.
- **Time series**: the PatchTST-FM-r2 card says that as of 2026-08-31 it was the top zero-shot model under a permissive commercial license on GIFT-Eval, and second among all replicable zero-shot models; Ensemble R1 ranks third in the October 20 GIFT-Eval snapshot.
- **Switch decision aLoRA**: 46.72 overall on the Jev Decision Index v0.3. For how to read decision-model leaderboards, see [choosing a decision model](/posts/tech/2026-10-22-ai-model-family-decision-models-en).

## Licensing, pricing, and deployment

### License: Apache 2.0, with two exceptions

The Granite 4.2 Hugging Face repos carry no separate LICENSE file; the license is set by the `apache-2.0` metadata and the model card's link to the Apache 2.0 text. IBM Research says organizations can download, fine-tune and put the models into production "without licensing restrictions": no revenue or user thresholds and no regional exclusions. Across the 252 repos in the `ibm-granite` organization, the exceptions to watch are:

| Model | License | Effect |
|---|---|---|
| [granite-speech-5.0-470m-turboctc-nc](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc-nc) | CC-BY-NC-SA-4.0 | Research and non-commercial use only; trained on extra restricted data, slightly better English WER. For commercial use pick the Apache version without `-nc` |
| [granite-timeseries-patchtst-fm-r2](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2) | OpenMDW 1.0 or Apache 2.0, your choice | Dual-licensed; choosing Apache 2.0 means ordinary use |

A few GGUF conversion repos have no license metadata, so check the original repo before using them. Since the 4.0 generation IBM has also cryptographically signed the checkpoints on Hugging Face so their provenance can be verified.

### Hosted pricing

| Channel | Model | Price (per 1M tokens, input / output) |
|---|---|---|
| [OpenRouter](https://openrouter.ai/ibm-granite/granite-4.2-8b) | Granite 4.2 8B | CoreWeave $0.06 / $0.15, DeepInfra $0.06 / $0.25; cache read $0.015 |
| [watsonx.ai](https://www.ibm.com/products/watsonx-ai/pricing) | Granite 4.0-H-Small | $0.0636 / $0.265 |
| [Workers AI](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | Granite 4.0-H-Micro | $0.017 / $0.112, 131K context |

- **Few hosted options for Granite 4.2.** OpenRouter only carries the 8B, at 131K context with reasoning on by default (`reasoning_effort` can be high, low or none); OpenRouter's weighted average paid price is about $0.036 / $0.183. Artificial Analysis lists the 30B as having no public API.
- **watsonx.ai stops at the 4.1 generation.** The pricing page lists granite-4-1-3b / 8b / 30b, Vision 4.1 4B and Speech 4.1 2B, but not Granite 4.2; to use 4.2 you deploy it yourself on watsonx or go elsewhere.
- **Workers AI** still only has 4.0-H-Micro; see the [Workers AI model guide](/posts/ai/2026-08-18-workers-ai-model-guide-en).

### Self-hosting

- **File sizes**: on [Ollama](https://ollama.com/library/granite4.2), `granite4.2:3b` is about 2.2GB, `8b` 5.3GB and `30b` 18GB, all with 128K context. IBM also publishes FP8, NVFP4, MXFP4, GGUF and Apple MLX builds.
- **vLLM**: v0.20 or later, with the `granite_thinking_parser` shipped in the repo as the reasoning parser (the built-in `nemotron_v3` also works) and `qwen3_coder` as the tool-call parser. **SGLang** v0.5.18 or later with both parsers set to `auto`.
- **Sampling settings are mandatory**: the model card requires `temperature=1.0` and `top_p=0.95` for all tasks and backends; carrying over the low temperatures you use for other models may hurt results.
- **Thinking modes**: chat template argument `enable_thinking=True/False`, plus `low_effort=True` for low-effort thinking; multi-turn conversations strip earlier turns' thinking by default (`truncate_history_thinking`) to save context.

## Agent integration and selection

- **Tool calling, RAG and document workflows on your own GPUs** → Granite 4.2 8B. No license strings, about 5GB quantized, and only 4 points behind the 30B on τ³-bench.
- **Self-hosted coding agent** → Granite 4.2 30B at 57 on SWE-bench Verified; the model card includes configs for OpenCode, Pi and OpenHands. It is not in the same league as frontier models for coding.
- **Phones, laptops or very low latency** → 3B or 4.0-H-Micro; the 3B has no agentic training, so do not hand it multi-step tool loops.
- **Checking agent inputs and outputs** → Guardian 4.1 8B, with built-in criteria for jailbreaks, harmful content, RAG groundedness and tool-call hallucination, plus custom criteria written as one natural-language sentence.
- **One endpoint for chat, classification decisions and speech transcription** → Switch 4.1, saving the VRAM of several models.
- **Chart, table and form extraction** → Vision 4.1 4B, or Granite-Docling inside a Docling pipeline.
- **High-volume transcription** → Speech 5.0 TurboCTC; for translation or keyword biasing use Speech 5.0 2B.
- **Multilingual retrieval** → Embedding Multilingual R2, the 97M when latency comes first.
- **Demand or monitoring-metric forecasting** → start TTM-R3 zero-shot, or use Ensemble R1 to skip model selection.

A minimal stack: Granite 4.2 8B as the main model, Guardian 4.1 8B judging before and after each turn, and Embedding R2 for retrieval, all Apache 2.0 and all inside one private environment. To validate the choice, run the same task set with `enable_thinking=False`, `low_effort=True` and full thinking, comparing completion rate, output tokens and latency; for Guardian, measure false-positive and false-negative rates on your own violation samples rather than relying on the official balanced accuracy.

## Limitations and trade-offs

- **Overall capability is far from the frontier.** Artificial Analysis puts both the 30B and 8B below their size-class median, and the official table has no direct competitor numbers. Granite's strengths are control, self-hosting and a clean license, not leaderboard rank.
- **Evaluations are mostly self-reported.** The sub-lines' MTEB, JETTS, VAREX and GIFT-Eval numbers all come from IBM's model cards, and IBM's documents disagree in small ways (BFCL, attention head count, and the IBM Research announcement saying 4.2 builds on "the Granite 4.0 foundation models" while the model card names the 4.1 base).
- **512K is the pre-training length, not the serving length.** Every official deployment example uses 128K, and the 8B scores only 71 on RULER 128K.
- **The 3B is missing a stage.** No agentic RL, and IBM gives it no coding-agent scores.
- **The license exception hides in the name.** The `-nc` speech model is non-commercial; read the repo name before downloading.
- **Few hosted channels.** Only the Granite 4.2 8B is on OpenRouter and watsonx.ai is still on 4.1, so using the latest generation without self-hosting is hard.
- **Switch speech is only a cascade.** The speech encoder and LLM are not jointly trained, so transcription errors flow straight into the downstream chat and decisions.

Granite's positioning comes down to this: an Apache 2.0 kit of the small parts an enterprise agent needs, letting a team run the main model, safety judge, retrieval, speech and document extraction all on open weights in its own environment. When you need frontier reasoning or coding, it fits best as the workers and gatekeepers of the pipeline, with the main brain sourced elsewhere.

## References

- [ibm-granite — Hugging Face organization](https://huggingface.co/ibm-granite)
- [ibm-granite/granite-4.2-30b — Hugging Face model card (specs, evaluations, deployment)](https://huggingface.co/ibm-granite/granite-4.2-30b)
- [ibm-granite/granite-4.2-8b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-4.2-8b)
- [ibm-granite/granite-4.2-3b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-4.2-3b)
- [Granite 4.2 LLMs: How They're Built — Hugging Face technical blog](https://huggingface.co/blog/ibm-granite/granite-4-2)
- [Granite 4.2 brings native reasoning to enterprise agents — IBM Research](https://research.ibm.com/blog/introducing-granite-4-2)
- [Granite 4.1 LLMs: How They're Built — Hugging Face technical blog](https://huggingface.co/blog/ibm-granite/granite-4-1)
- [ibm-granite/granite-4.1-8b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-4.1-8b)
- [IBM Granite 4.0: hyper-efficient, high performance hybrid models — IBM announcement](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models)
- [ibm-granite/granite-4.0-h-small — Hugging Face model card](https://huggingface.co/ibm-granite/granite-4.0-h-small)
- [ibm-granite/granite-3.0-8b-instruct — Hugging Face model card](https://huggingface.co/ibm-granite/granite-3.0-8b-instruct)
- [ibm-granite/granite-8b-code-instruct-4k — Hugging Face model card](https://huggingface.co/ibm-granite/granite-8b-code-instruct-4k)
- [ibm-granite/granite-switch-4.1-8b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-switch-4.1-8b)
- [ibm-granite/granite-switch-4.1-8b-preview — Hugging Face model card](https://huggingface.co/ibm-granite/granite-switch-4.1-8b-preview)
- [Granite Switch 4.1: Chat, Decisions, and Speech from One Endpoint — Hugging Face blog](https://huggingface.co/blog/ibm-granite/granite-switch-4-1)
- [Granite Libraries — Hugging Face collection](https://huggingface.co/collections/ibm-granite/granite-libraries)
- [Mellea — GitHub](https://github.com/generative-computing/mellea)
- [ibm-granite/granite-guardian-4.1-8b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-guardian-4.1-8b)
- [ibm-granite/granite-vision-4.1-4b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-vision-4.1-4b)
- [ibm-granite/granite-docling-258M — Hugging Face model card](https://huggingface.co/ibm-granite/granite-docling-258M)
- [ibm-granite/granite-speech-5.0-2b — Hugging Face model card](https://huggingface.co/ibm-granite/granite-speech-5.0-2b)
- [ibm-granite/granite-speech-5.0-470m-turboctc — Hugging Face model card](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc)
- [ibm-granite/granite-speech-5.0-470m-turboctc-nc — Hugging Face model card (CC-BY-NC-SA-4.0)](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc-nc)
- [Extremely Fast and Accurate Transcription with Granite Speech 5.0 Turbo CTC — Hugging Face blog](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc)
- [ibm-granite/granite-embedding-311m-multilingual-r2 — Hugging Face model card](https://huggingface.co/ibm-granite/granite-embedding-311m-multilingual-r2)
- [ibm-granite/granite-embedding-97m-multilingual-r2 — Hugging Face model card](https://huggingface.co/ibm-granite/granite-embedding-97m-multilingual-r2)
- [ibm-granite/granite-timeseries-ttm-r3 — Hugging Face model card](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3)
- [ibm-granite/granite-timeseries-patchtst-fm-r2 — Hugging Face model card](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2)
- [ibm-granite/granite-timeseries-ensemble-r1 — Hugging Face model card](https://huggingface.co/ibm-granite/granite-timeseries-ensemble-r1)
- [ibm-granite/granite-swash-3b-a600m — Hugging Face model card](https://huggingface.co/ibm-granite/granite-swash-3b-a600m)
- [ibm-granite/granite-4.1-8b-llmon-preview — Hugging Face model card](https://huggingface.co/ibm-granite/granite-4.1-8b-llmon-preview)
- [IBM: Granite 4.2 8B — OpenRouter (providers and pricing)](https://openrouter.ai/ibm-granite/granite-4.2-8b)
- [Granite 4.2 30B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-30b)
- [Granite 4.2 8B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-8b)
- [Granite 4.2 3B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-3b)
- [watsonx.ai pricing — IBM](https://www.ibm.com/products/watsonx-ai/pricing)
- [granite-4.0-h-micro — Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/)
- [granite4.2 — Ollama](https://ollama.com/library/granite4.2)
- [Docling document parsing](/posts/tech/2026-09-06-docling-document-parsing-en) — this site
- [Workers AI model guide](/posts/ai/2026-08-18-workers-ai-model-guide-en) — this site
- [Choosing a decision model](/posts/tech/2026-10-22-ai-model-family-decision-models-en) — this site
- [Tencent Hy (Hunyuan) model family](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
