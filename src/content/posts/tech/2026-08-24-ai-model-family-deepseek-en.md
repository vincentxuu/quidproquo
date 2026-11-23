---
title: "DeepSeek: From an MoE Lab to V4.1 Flash's Causal Encoder-Decoder, the Cheapest Agentic Workhorse Among Open Weights"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, deepseek, open-source, model-family-deepseek, moe, model-selection]
lang: en
type: deep-dive
tldr: "DeepSeek drove inference costs to the open-weight low with MLA, fine-grained MoE, and now V4.1's Causal Encoder-Decoder and FP4 KV cache. As of November 2026 the official API lists just two models: `deepseek-flash` (DeepSeek-V4.1-Flash-1017, 552B total, 8B active on input and 16B on output, $0.30/$1.20 at peak) is the default, and `deepseek-v4-pro` (V4-Pro-0813) stays for knowledge-recall work. Both ship MIT weights. V4.1 Pro has only been named in an announcement and is not available."
description: "A complete guide to the DeepSeek family: the V1-to-V4.1 evolution, MLA and DeepSeekMoE, V4.1's Causal Encoder-Decoder and KV cache compression, the R1 reasoning branch, V4.1-Flash-1017 and V4-Pro-0813 benchmarks, peak/off-peak pricing, the Search/Fetch and application APIs, and selection advice for agent developers."
series:
  name: "AI Model Families"
  order: 1
draft: false
glossary:
  - term: "MLA"
    def: "Multi-head Latent Attention, DeepSeek's attention mechanism that compresses the KV cache into low-dimensional latent vectors; the V2 paper reports a 93.3% KV cache reduction."
  - term: "KV cache"
    def: "The cache of Key-Value vectors for previously processed tokens during inference; the main memory bottleneck for long sequences and the main cost driver in long agent sessions."
  - term: "CED (Causal Encoder-Decoder)"
    def: "V4.1's architecture: a 20-layer causal encoder followed by a 20-layer decoder, where the decoder's global KV cache is projected from the encoder's final hidden states, so reading input activates only 8B parameters."
  - term: "DSpark"
    def: "DeepSeek's speculative decoding module, which drafts semi-autoregressively and verifies on a confidence schedule; built into V4 and V4.1."
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-deepseek)

DeepSeek is the open-weight family that cares most about the price of each token. From V2's MLA to V4.1's Causal Encoder-Decoder, every generation's headline has been a lower inference cost rather than a larger parameter count. This guide is for developers putting DeepSeek into an agent workflow: as of November 2026 the official API lists only `deepseek-flash` and `deepseek-v4-pro`, and by the end you should know which one to use, whether self-hosting pays off, and which tasks it should not own yet.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the first family deep dive in the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on the models listed on DeepSeek's API "Models & Pricing" page on 2026-11-23:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| DeepSeek-V4.1-Flash-1017 (API name `deepseek-flash`) | Default workhorse: coding agents, tool calls, high-throughput work | 552B total, 8B active on input and 16B on output; native image input; 1M context, up to 384K output | Official API, web, and app; MIT weights |
| DeepSeek-V4-Pro-0813 (API name `deepseek-v4-pro`) | Knowledge recall and factual Q&A | 1.6T total, 49B active; no image input | Official API; MIT weights |
| DeepSeek-R1 / R1-0528 | Legacy reasoning line | Reasoning now lives in the main line's thinking mode | MIT weights; no longer listed on the official API |

Write `deepseek-flash` in new code. The legacy names `deepseek-v4-flash` and `deepseek-v4-flash-vision-exp` still work, but they are served by V4.1-Flash-1017 and billed at the Flash price. V4.1 Pro was mentioned exactly once, in the 2026-09-10 V4.1 Flash announcement; neither the pricing page nor the change log has a model ID, price, or date for it, so leave it out of your plans.

### Two main lines: general vs reasoning
DeepSeek's models originally evolved along two parallel lines:

**The general line** (V1 → V2 → V3 → V3.2 → V4 → V4.1) is tuned for chat, coding, and tool calling, with efficiency and cost as the core goals. V2 established the MLA + MoE architecture, V3 cut training to 2.788M H800 GPU hours, V4 extended the context window to 1M and split into Flash and Pro, and V4.1 switched to a Causal Encoder-Decoder that, for the first time, let Flash beat DeepSeek's own Pro on most agentic benchmarks.

**The reasoning line** (R1 → R1-0528) focused on long chains of thought. Its breakthrough was R1-Zero, trained purely with reinforcement learning and no SFT data, which still developed reasoning on its own and showed that reasoning can emerge from reward signals alone. DeepSeek then distilled that reasoning into small Qwen- and Llama-architecture models. Since V3.2 the main line ships with thinking and non-thinking modes, and the reasoning line no longer gets separate releases.

The early DeepSeek-Coder and DeepSeek-Math lines followed the same script: once the main line's coding and math were strong enough, the specialist branches stopped evolving independently.

### Sub-lines and ecosystem
In the second half of 2026, DeepSeek added a full agent-infrastructure layer around its models:

- **DeepSeek Harness**: the official agent harness, still a developer preview in November 2026. The V4.1-Flash-1017 notes say the model was specifically optimized for Harness, Tencent CodeBuddy, and WorkBuddy, and recommend Harness 0.2.1-rc.1 or later
- **Search/Fetch API** (2026-10-17): DeepSeek's in-house search engine opened to developers, billed per call
- **Application APIs** (2026-11-13): the app's web search, deep-thinking search, file input, URL reading, and content-safety check exposed as API parameters, plus standalone OCR, speech-recognition, and text-to-speech APIs
- **DeepSeek-OCR**: a standalone vision OCR model under MIT, independent of the V4 architecture
- **R1 distilled models**: R1's reasoning distilled into Qwen- and Llama-architecture models from 1.5B to 70B, so the community can run reasoning models on consumer hardware

## Family evolution

### Family timeline
| Version | Released | Key facts | What changed for selection |
|---|---|---|---|
| DeepSeek LLM 67B | 2023-11 | 67B dense, Llama-style architecture | Starting point, not yet a cost leader |
| DeepSeek-MoE | 2024-01 | 145B total, 22B active; first fine-grained MoE | Showed finely split experts reach the same quality with fewer active parameters |
| DeepSeek-V2 | 2024-05 | 236B / 21B; **MLA + DeepSeekMoE established** | Long-context inference became cheap enough to use at scale |
| DeepSeek-V3 | 2024-12 | 671B / 37B; auxiliary-loss-free load balancing, MTP, FP8 training | Open-model quality started approaching closed flagships |
| DeepSeek-R1 | 2025-01 | 671B / 37B; pure-RL reasoning, R1-Zero | Open reasoning models and distilled small models made self-hosted reasoning practical |
| DeepSeek-V3.2 | 2025-12 | Unified thinking and chat modes | Reasoning became a mode switch rather than a separate model |
| DeepSeek-V4 Flash / Pro | 2026-04 | Flash 284B / 13B, Pro 1.6T / 49B, 1M context | 1M context entered the open main line; the Flash/Pro split started here |
| V4-Flash-0731 / V4-Pro-0813 | 2026-07 / 08 | Re-done post-training; peak/off-peak pricing from August | Big agentic gains; half-price off-peak hours pushed batch jobs into new time slots ([peak/off-peak pricing](/posts/daily/2026-08-16-pricing-deepseek-v4-peak-off-peak-hike-en)) |
| V4-Flash-Vision-Exp | 2026-08-21 | Experimental multimodal model based on Flash | First image-aware agents inside DeepSeek, but experimental only ([model card](/posts/daily/2026-09-01-model-deepseek-deepseek-v4-flash-vision-exp-en)) |
| DeepSeek-V4.1-Flash | 2026-09-10 | Causal Encoder-Decoder, 552B / 8B + 16B, native multimodality, 890-byte-per-token KV cache | Flash beat V4-Pro on most agentic benchmarks, so the default moved from Pro to Flash; V4 Flash and Vision-Exp retired ([model card](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash-en)) |
| V4.1-Flash-1017 | 2026-10-17 | Minor update on the same architecture, unchanged price; Search API opened the same day | The current selection baseline, covered in the sections below |

The V4.1 Flash announcement originally said all `deepseek-v4-pro` requests would route to V4.1 Flash from 2026-09-14, but the change log then stated that "in response to user demand" V4 Pro API service would continue after September 14 with unchanged billing. The current pricing page still lists V4-Pro-0813 separately; treat the change log and pricing page as authoritative.

Three years and more than a dozen milestones, each with a concrete architectural change. V2 was the first turning point, when MLA and DeepSeekMoE settled into place; V4.1 is the second, where the decoder stopped computing its own global KV cache and active parameters actually went down.

## Architecture and training trade-offs

### Architecture: why DeepSeek is so cheap
DeepSeek's cost advantage stacks three designs: V2's MLA compresses the KV cache, V3's fine-grained MoE lowers active parameters, and V4.1's Causal Encoder-Decoder splits the cost of reading input from the cost of writing output.

#### MLA: compressing the memory bottleneck by 93%

Standard multi-head attention (MHA) has a pain point at inference time: every processed token's Key and Value vectors must be stored (the KV cache). Once context stretches to tens or hundreds of thousands of tokens, the KV cache takes more memory than the model itself.

MLA (Multi-head Latent Attention) compresses the K and V of all heads into one low-dimensional latent vector, stores only that vector, and recomputes a head's K or V on demand. The V2 paper reports a 93.3% KV cache reduction. The price is extra attention compute, but long-sequence inference is usually bound by memory bandwidth, so it is a net win.

#### DeepSeekMoE: 671B parameters, 37B active

Traditional mixture-of-experts uses about 8 large experts and picks 1–2. DeepSeek does the opposite and slices experts finely: V3 has 1 shared expert plus 256 routed experts with 8 chosen per token; V4.1 Flash has 1 shared expert plus 384 routed experts with 6 chosen per token. Fine slicing yields far more combinations, so the model can learn a finer division of knowledge, while the shared expert carries general knowledge so routed experts do not all relearn the same basics.

V3 also introduced **auxiliary-loss-free load balancing**: instead of an extra loss that penalizes imbalance, a dynamic bias adjusts each expert's chance of selection without interfering with the main training objective.

#### Causal Encoder-Decoder: reading input with 8B active

V4.1 Flash's Hugging Face model card describes a 40-layer Transformer: a 20-layer causal encoder followed by a 20-layer decoder. The decoder's global KV cache is projected straight from the encoder's final hidden states instead of being computed per layer. Prefill (reading input) therefore activates only 8B parameters per token and decode (writing output) activates 16B, which suits agent workloads that read a lot and write a little.

Other designs listed on the same model card:

- **CSA2 (Compressed Sparse Attention 2)**: each attention layer is statically Full, Reindex, or Reuse, sharing main KV and sparse indices across layers; with FP4 main KV caching, the global KV cache drops to 890 bytes per token, about 1/4 of V4 Flash
- **SWA Bounded Replay**: sliding-window KV is not persisted to SSD but rebuilt by replaying the most recent tokens, so the persistent KV footprint is about 1/8 of V4 Flash
- **Engram conditional memory**: a 196B-parameter memory module accessed sparsely by token lookup
- **Native multimodality**: an in-house DeepSeek-ViT trained jointly with text from the start of pre-training rather than bolted on later

A smaller KV cache hits the agent bill directly: the announcement notes that cache-hit charges are often a large share of agent costs, and V4.1 Flash's cache-hit price is $0.006 per 1M tokens at peak.

#### Training and engineering

- **Pre-training**: V4.1 Flash was trained from scratch on a 45T-token multimodal corpus, with sparse attention trained at 64K sequence length and context extended to 1M at the 34T-token mark
- **Post-training**: the model card says the algorithms follow the standard SFT → RL → on-policy distillation recipe; the substantive changes are in data, with large-scale automated synthesis of agent tasks and environments
- **Engineering cost cuts**: full FP8 training for V3, DualPipe overlap of compute and cross-node communication, and PTX-level GPU tuning; V3's 671B took only 2.788M H800 GPU hours

V4.1 Flash's reasoning effort is a continuous integer from 1 to 100, and the open-weight evaluations all use 100; the official API examples use `reasoning_effort: "high"` with a thinking toggle.

## Evaluation and alternatives

### V4.1-Flash-1017: official numbers
These are DeepSeek's self-reported results from the Hugging Face model card and the 2026-10-17 change log. Terminal-Bench 4.0 uses the Claude Code harness and DeepSWE uses the Mini-SWE-V2 harness; the comparison models are the ones DeepSeek chose for its table:

| Benchmark | V4.1-Flash-1017 | V4.1-Flash (9/10) | GLM-5.3 | GPT-5.6 Sol | Claude Opus 5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 77.0 | 74.2 | 66.9 | 73.0 | 74.0 |
| Terminal-Bench 4.0 | 42.3 | 31.2 | 37.9 | 39.9 | 51.8 |
| AutomationBench v1.0.6 | 60.5 | 54.8 | 48.8 | 45.8 | 50.3 |
| Agents' Last Exam | 35.4 | 31.8 | 28.5 | 26.7 | 28.6 |
| NL2Repo-Bench | 68.2 | 65.4 | 58.0 | 56.8 | 75.3 |
| ProgramBench | 29.1 | 20.3 | 19.0 | 23.0 | 37.0 |
| HLE (no tools) | 42.6 | 36.8 | 42.0 (text-only subset) | 44.5 | 56.3 |

Read this table with three caveats. First, the comparison stops at Opus 5 and GPT-5.6 Sol, with no Claude Opus 5.5 or GPT-6 models, so "matching closed flagships" holds only against the previous generation. Second, Opus 5 still leads on the hardest items (Terminal-Bench 4.0, ProgramBench, NL2Repo, HLE); DeepSeek wins mid-difficulty agentic tasks. Third, vendors use different harnesses (DeepSeek runs DeepSWE with Mini-SWE-V2, GLM with mini-swe-agent), and the harness itself moves scores, so fix your own harness before comparing.

### How Flash and Pro divide the work
V4.1 Flash beats V4-Pro-0813 across agentic benchmarks (DeepSWE 74.2 vs 62.7 and Terminal-Bench 4.0 31.2 vs 12.4 in the official table), but base-model knowledge tests go the other way: SimpleQA-Verified is 42.3 for V4.1-Flash-Base and 55.2 for V4-Pro-Base, and MultiLoKo 45.5 vs 50.9. Flash is better at doing; Pro's parameter count still buys more knowing.

### Third-party evaluation
Artificial Analysis Intelligence Index v5.0.1 scores V4.1-Flash-1017 at 33 (max), 29 (high), and 19 (non-reasoning); on the same index version GLM-5.3 (Max) scores 32. The index swaps its test set between versions, so these scores cannot be compared with pre-August ones.

### Where it sits against competitors
- **Versus GLM-5.3**: both are near the top of China's open-weight tier. In DeepSeek's table V4.1-Flash-1017 leads on DeepSWE, AutomationBench, and Agents' Last Exam; GLM-5.3's strength is security benchmarks, but its weight license adds a security-review clause for large MaaS providers. See the [GLM family](/posts/tech/2026-08-24-ai-model-family-glm-en)
- **Versus Kimi and Qwen**: Kimi K3 trails in DeepSeek's own table; for Kimi K3.1 Pro and newer Qwen releases, read each family's announcements. See the [Kimi family](/posts/tech/2026-08-24-ai-model-family-kimi-en) and [Qwen family](/posts/tech/2026-08-24-ai-model-family-qwen-en)
- **Versus the Claude/GPT frontier**: Flash's peak output price of $1.20 is more than an order of magnitude below closed flagships, while the hardest agentic coding and knowledge reasoning still lag. See the [Claude family](/posts/tech/2026-08-24-ai-model-family-claude-en) and [GPT family](/posts/tech/2026-08-24-ai-model-family-gpt-en)

## Licensing, pricing, and deployment

### License
The Hugging Face weights and code for V4.1-Flash-1017, V4.1-Flash, and V4-Pro-0813 are all MIT: commercial use, fine-tuning, and self-hosting with no revenue or user-count thresholds. The weight license does not replace a hosting provider's terms: the official API carries DeepSeek's terms of service, and for public-facing services DeepSeek recommends enabling its content-safety parameter and handling obligations such as content review, model registration, and AI labeling yourself.

### API pricing
DeepSeek API pricing page (read 2026-11-23), per 1M tokens:

| Item | `deepseek-flash` (V4.1-Flash-1017) | `deepseek-v4-pro` (V4-Pro-0813) |
|---|---|---|
| Input, cache miss (peak / off-peak) | $0.30 / $0.15 | $1.32 / $0.66 |
| Input, cache hit (peak / off-peak) | $0.006 / $0.003 | $0.044 / $0.022 |
| Output (peak / off-peak) | $1.20 / $0.60 | $3.96 / $1.98 |
| Context / max output | 1M / 384K | 1M |
| Vision | ✓ | ✗ |
| Concurrency limit | 2,500 | 500 |

Peak hours are 01:00–04:00 and 06:00–10:00 UTC, Monday through Friday, excluding Chinese public holidays (9:00–12:00 and 14:00–18:00 Beijing time); all other hours, including weekends and Chinese holidays, are off-peak at half price. Both models support JSON output, tool calls, the Responses API, and the Anthropic API format; FIM completion works only in non-thinking mode.

Charges beyond the models:

- **Search/Fetch API**: $0.75 per 1,000 successful requests each. From 12:00 Beijing time on 2026-11-18, server-side search and fetch calls triggered during model calls are no longer billed per call; their results join the context and are billed as tokens
- **File parsing / OCR**: $0.225 per 1,000 pages
- **Speech**: TTS at $0.45 per 10,000 characters and ASR at $0.116 per audio hour, currently 50% off for a limited time

### Self-hosting
The V4.1-Flash-1017 weight files total 763B parameters (the 552B backbone plus the vision encoder and memory module). The release ships no Jinja chat template; instead it includes a Python reference encoder and `deepseek-recipe` (Rust libraries with Python bindings) for prompt formatting. DeepSeek recommends `max_tokens` of at least 256K. This is not single-machine scale: the V4.1 Flash announcement asks anyone planning a deployment of "2,000 GPUs + a storage cluster" to get in touch.

## Agent integration and selection

### What this means for agent developers
- **Coding agents, CLI agents, multi-step automation** → `deepseek-flash`: official DeepSWE v1.1 77.0 and AutomationBench 60.5 at $1.20 peak output; with only 8B active on input, long sessions over large codebases are especially cheap
- **High-throughput classification, extraction, summarization** → `deepseek-flash`, scheduled off-peak to halve the bill again
- **Factual recall and knowledge-heavy Q&A** → try `deepseek-v4-pro` first: its base-model SimpleQA-Verified of 55.2 is well above Flash's 42.3, but Pro takes no images and caps concurrency at 500
- **Screenshots, UI, scanned documents** → only Flash has vision; for bulk document parsing, the OCR API bills per page
- **Search and web reading** → enable the `deepseek_web_search` / `deepseek_read_url` tools so the service assembles context; per-call charges stopped on 11-18, but fetched content is billed as tokens, so long pages count
- **Self-hosting** → the MIT weights are downloadable, but 763B of weights is cluster scale; for budget-limited teams the API is more practical
- **The hardest agentic coding or research reasoning** → Terminal-Bench 4.0, ProgramBench, and HLE still trail Claude; a practical mix is DeepSeek for sub-tasks and a closed flagship for top-level planning
- **Still on legacy model names** → change `deepseek-v4-flash` and `deepseek-v4-flash-vision-exp` to `deepseek-flash`; behavior is already the 1017 model, so the rename changes no outputs and only protects you if the aliases are removed later

### A minimal validation step
Before switching, run a controlled comparison in your own harness: fix the scaffold, prompts, and tools; compare success rate, average output tokens, and cost per task between `deepseek-flash` and your current model; and run once at peak and once off-peak to see which price your bill actually lands on.

## Limitations and trade-offs

The published V4.1-Flash-1017 numbers are all DeepSeek's own, the comparison stops at the previous generation of closed models, and vendors' harness settings are not consistent. Flash is clearly weaker than Pro at knowledge recall, while Pro lacks vision and has a low concurrency cap; there is no official information on when V4.1 Pro will arrive or whether it will change this split.

There are non-technical limits too: in October 2026 the US Department of Homeland Security published a notice barring civilian federal agencies from using DeepSeek products and services, so check your compliance requirements before sending regulated data through the official API. Self-hosting the MIT weights sidesteps the data-flow question, but the scale threshold is high.

### The big picture
DeepSeek showed that frontier competitiveness can come from architecture rather than raw compute: MLA shrinks the KV cache, fine-grained MoE shrinks active parameters, and V4.1 splits reading from writing. For agent developers the November 2026 answer is simple: default to `deepseek-flash`, try Pro for knowledge-heavy work, and leave the hardest planning to a closed flagship.

## Update history

- 2026-11-23: Added the V4.1 generation (V4.1-Flash on 9/10 and V4.1-Flash-1017 on 10/17), the Search/Fetch API, and the 11/13 application APIs; rewrote the model matrix, architecture, evaluation, pricing, and selection sections against DeepSeek's 2026-11-23 pricing page, change log, and Hugging Face model cards. V4-Flash-0731 / V4-Pro-0813 became the historical generation: the former Flash/Pro spec, benchmark, and pricing tables moved out of the body, and their numbers remain in the daily model cards and peak/off-peak pricing snapshot linked from the timeline, which now notes "what changed for selection" on each row. Corrections: V4 Pro's SWE-bench Verified 96.4% and the comparison against Claude Opus 5's 97.0% came from a third-party article and do not match DeepSeek's official evaluations, so they were removed; added that V4 Pro was not retired after 9/14 and is still priced separately.
- 2026-10-11: Reorganized sections into the shared family format and added a matrix built from existing content. Kept the original versions, prices, and source dates; no new fact-check was performed.

## References

- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [Change Log — DeepSeek API Docs](https://api-docs.deepseek.com/updates/)
- [DeepSeek-V4.1-Flash: Smarter, Faster, More Efficient — DeepSeek API Docs](https://api-docs.deepseek.com/news/news260910/)
- [deepseek-ai/DeepSeek-V4.1-Flash-1017 — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017)
- [deepseek-ai/DeepSeek-V4.1-Flash — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [DeepSeek V4.1 Flash 1017 — Artificial Analysis](https://artificialanalysis.ai/models/deepseek-v4-1-flash-1017)
- [DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437)
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948)
- [DeepSeek-V4 Technical Report (arXiv:2606.19348)](https://arxiv.org/abs/2606.19348)
- [US moves to bar DeepSeek from federal agencies and contracts — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts)
- [The Inner Workings of MLA — Chris McCormick](https://mccormickml.com/2025/04/26/inner-workings-of-mla/)
- [The DeepSeek Series: A Technical Overview — Martin Fowler](https://martinfowler.com/articles/deepseek-papers.html)
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
