---
title: "Grok — From a 314B Open-Source Bet to Grok 4.7: xAI's (Now SpaceXSI's) Distribution-Driven Catch-Up"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, grok, xai, spacexsi, model-family-grok, moe, open-source, model-selection]
lang: en
type: deep-dive
tldr: "Grok is xAI's LLM family; xAI was acquired by SpaceX in February 2026, renamed SpaceXAI in July and renamed again to SpaceX Super Intelligence (SpaceXSI) in October. The current workhorse is Grok 4.7 (2026-09-21): 500K context, $2/$6 (doubled at ≥200K), four reasoning levels, pitched at coding and knowledge work; Artificial Analysis scores it 46 on its aggregate index, but it emits more than twice the output tokens per task of its predecessor. The low-cost 1M-context option is Grok 4.3 ($1.25/$2.50), Imagine covers image and video, and Grok Build and Grok Bot are the in-house agent products. The only open weights are Grok-1 (Apache 2.0) and Grok 2 (custom community license)."
description: "Complete Grok model family guide: 2023→2026 timeline, xAI's move into SpaceX and two renames, the Grok 4.7 and Grok 4.3 tiers, Imagine image/video and Voice, Grok Build and Grok Bot, two open-weight licenses, retirement redirects, and a selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 11
draft: false
glossary:
  - term: "SpaceXSI"
    aliases: ["SpaceX Super Intelligence", "SpaceXAI"]
    definition: "Current name of Grok's developer. xAI was acquired by SpaceX in 2026-02, renamed SpaceXAI in 2026-07, and in 2026-10 its website and X account switched to SpaceX Super Intelligence (SpaceXSI)"
  - term: "Colossus"
    definition: "xAI's self-built supercomputer cluster in Memphis, where RL reasoning scaling from Grok 3 onward was trained"
  - term: "Grok Build"
    definition: "SpaceXSI's coding agent, with a terminal TUI, headless mode, editor embedding via ACP, and web and mobile apps; Grok 4.7 launched inside it"
  - term: "Grok Bot"
    definition: "SpaceXSI's always-on agent product: each Bot has its own computer and works in Slack/Teams; version 1.0 launched 2026-11-11"
  - term: "Grok Imagine"
    definition: "SpaceXSI's image/video generation line, billed per image or per second via the API"
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-grok)

On March 17, 2024, xAI dropped 314B-parameter [Grok-1](https://github.com/xai-org/grok-1) on GitHub under Apache 2.0 — while the industry debated whether to open-source at all, xAI open-sourced its largest MoE. Two and a half years later, the company itself has changed names twice: SpaceX acquired it in February 2026, it became SpaceXAI in July, and in October its website and X account switched to SpaceX Super Intelligence (SpaceXSI). The model line shipped Grok 4.5, 4.6 and 4.7 between July and September 2026, and the current workhorse is [Grok 4.7](https://x.ai/news/grok-4-7). The main text covers the Grok 4.7 generation; Grok-1 through Grok 4.6 live in the family timeline.

"xAI" in this post refers to the company before July 2026; after that we use SpaceXAI or SpaceXSI as the company called itself at the time. The API domain and docs are still on `x.ai`. For how to read the benchmarks cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is the eleventh family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family positioning and model matrix

Based on SpaceXSI's API docs models and pricing pages:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| Grok 4.7 (`grok-4.7`) | Flagship for coding and knowledge work | 500K context, $2/$6 (doubled at ≥200K), low–xhigh reasoning; a fast variant has twice the output speed at twice the price | API, Grok Build, Cursor, cloud platforms |
| Grok 4.3 (`grok-4.3`) | Low-cost long context | 1M context, $1.25/$2.50, none–high reasoning | API |
| Grok Build 0.1 (`grok-build-0.1`) | Lightweight coding model | 500K, $1/$2; `grok-code-fast-1` now redirects here | API |
| Grok Imagine | Image and video generation | image $0.02, image-2.0 $0.04; video-1.5 $0.08/s, 1.5-lite $0.02/s | API |
| Grok Voice 3.0 | Voice conversation, transcription, TTS | speech-to-speech $0.08/min | API |
| Grok-1 / Grok 2 | Historical open weights | Grok-1 Apache 2.0; Grok 2 under the xAI Community License | Hugging Face `xai-org` |

### Three lines: models, media, agent products

**Text model line**: version numbers move fast, but only a few models are on the API. The docs are blunt: apart from voice, image and video, "for everything else, including code, use Grok 4.7." Grok 4.3 stays as the 1M-context, low-price option; 4.5, 4.6 and 4.20 are still on the pricing page, but the models overview now only recommends 4.7.

**Media line** (Imagine, Voice): Imagine started with images in 2025 and added video 1.5 and image 2.0 in 2026; Voice reached 3.0 in October, with 2.0 marked deprecated.

**Agent product line** (Grok Build, Grok Bot): Grok Build is a coding agent with a TUI, headless mode, ACP editor embedding, memory and workflows (fanning a task out across hundreds of parallel agents); since August it is available on every plan on web and mobile. Grok Bot is an always-on agent: each Bot has its own computer and can join Slack, Teams and video calls; 1.0 launched on 11-11. The Grok 4.7 announcement notes it was trained to "natively understand the Grok Bot harness"—the model and the in-house agent products are designed together.

### Distribution: from X to the cloud platforms

Grok's reach has never depended on a single leaderboard: beyond X, grok.com and Tesla, Grok models went onto Amazon Bedrock and Databricks in June 2026, and in August Grok 4.6 landed in GitHub Copilot, Bedrock, Gemini Enterprise Agent Platform and Microsoft Foundry. Grok 4.7 launched directly in Cursor and Grok Build—SpaceXSI's own posts mention that it has combined its support operation with Cursor's, and the Grok 4.5 announcement says that model was "trained alongside Cursor." October's X Subscription bundles Grok, Grok Bot, Cursor and X Premium into one plan.

## Family evolution

| Version | Released | Key facts | What it changed for selection |
|---|---|---|---|
| xAI founded | 2023-03 (announced 07-12) | Elon Musk and 11 researchers | — |
| Grok debut | 2023-11-03 | First model, 8K context | A chat model built into X |
| Grok-1 open-sourced | 2024-03-17 | 314B MoE (8 experts, 2 per token), Apache 2.0 | Still the only Apache 2.0 Grok weights |
| Grok-1.5 / 1.5V | 2024-03 to 04 | 128K context; first vision model | Long context and multimodality joined the family |
| Grok-2 / mini | 2024-08-13 | Enterprise API launched the same month | Grok became callable from an API |
| Grok 2 (2.5) weights | 2025-08-23 | ~500GB checkpoint, xAI Community License | A second open-weight model, but the license bans training other foundation models |
| Grok 3 / mini | 2025-02-19 | 10× Colossus compute, large-scale RL reasoning | Reasoning became the main line; `grok-3` redirected on 2026-05-15 |
| Grok 4 / Heavy | 2025-07-09 | 256K; Heavy used parallel test-time compute | Flagship-level reasoning; `grok-4-0709` now redirected |
| Grok Code Fast 1 | 2025-08-28 | Low-cost coding model for terminals/editors | Budget coding option; now redirects to `grok-build-0.1` |
| Grok 4 Fast | 2025-09-19 | 2M context, very low price | Long-context value pick; redirected to Grok 4.3 on 2026-05-15 |
| SpaceX acquires xAI | 2026-02-02 | All-stock deal; xAI became a SpaceX subsidiary | — |
| Grok 4.20 | 2026-03-09 | 1M; reasoning / non-reasoning / multi-agent models | A multi-agent model reached the API |
| Grok 4.3 | 2026-04 | 1M, $1.25/$2.50, cheaper than 4.20 | Still the cheapest 1M option |
| Grok 4.5 | 2026-07-16 | Trained alongside Cursor, focused on coding and token efficiency | Price rose to $2/$6 and context to 500K in exchange for coding ability (xAI renamed SpaceXAI the same month) |
| Grok 4.6 | 2026-08-12 | Long-running agents and visual/interactive work; AA Intelligence Index 61, matching GPT-5.6 Sol | Same-price upgrade, onto Copilot, Bedrock, Foundry and more ([model card](/posts/daily/2026-08-20-model-xai-grok-4-6-en)) |
| Grok 4.7 | 2026-09-21 | New, larger base model and longer RL | The current selection baseline, covered in the sections below ([model card](/posts/daily/2026-09-23-model-xai-grok-4-7-en)) |
| Renamed SpaceXSI | 2026-10 | Musk announced on 10-04, X account changed 10-10, website and terms then switched to SpaceXSI branding | Company name on docs, terms and invoices changed; API domain unchanged |
| Grok Voice 3.0, Grok Bot 1.0 | 2026-10-14 / 11-11 | New voice model; Bots shared across teams and taking on work proactively | The agent product line took shape |

The through-line is "trade compute and distribution for catch-up": Colossus powered the RL scaling of Grok 3 and 4, and in 2026 the focus moved to coding agents and in-house products (Build, Bot), with SpaceX and Cursor widening distribution. A large retirement in May 2026 redirected Grok 3, Grok 4, Grok 4 Fast and Code Fast 1 to newer models, collapsing the family from "many coexisting models" to "one flagship plus a low-cost long-context option."

## Architecture and training trade-offs

### Published architecture stops at Grok-1

[Grok-1's code](https://github.com/xai-org/grok-1) states: 8 experts, 2 active per token, 64 layers, 48 Q-heads / 8 KV-heads, embedding size 6,144, SentencePiece vocabulary 131,072. No later model has a published architecture or parameter count; the ~2.1T figure for Grok 4.7 comes from third-party reports, not the official spec page ([model card](/posts/daily/2026-09-23-model-xai-grok-4-7-en)).

### Grok 4.5 → 4.7: data, RL and the harness

Each announcement covers part of the training recipe:

- **Grok 4.5**: trained on tens of thousands of NVIDIA GB300 GPUs, with heavy investment in deduplication, quality scoring and domain selection; RL covers hundreds of thousands of tasks centered on multi-step software engineering, on a highly asynchronous stack so agent rollouts can run for hours
- **Grok 4.6**: a longer supplemental training run; Grok 4.5 regenerated SFT trajectories across reasoning levels and agent harnesses, filtered by model-based checks; RL expanded to domain environments such as kernel optimization, web development and CAD
- **Grok 4.7**: a new, larger base model, a longer RL run on harder tasks weighted toward problems that take many hours; SpaceXSI says it checks its own work more carefully, manages long context better, and natively understands the Grok Bot harness

The cost shows up in third-party numbers: Artificial Analysis measured Grok 4.7 (xhigh) at 81k output tokens per task on average, more than double Grok 4.6 (xhigh) at 38k. Same unit price, potentially double the bill.

### Safeguards

Grok 4.7 ships an entirely new safeguard stack: in SpaceXSI's own tests it lets through only 3.3% of risky dual-use prompts on HackerBench v0.3 (malicious cyber tasks) and scores 62.4% on LatchBio's biosafety benchmark; red-team capabilities are offered invite-only to selected security partners.

## Evaluation and alternatives

### Self-reported (Grok 4.7 announcement)

| Benchmark | Grok 4.7 (xhigh) | Grok 4.6 (high) | GPT-5.6 Sol Max | Fable 5.1 Max |
|---|---|---|---|---|
| CursorBench 4.0 | 46.3% | 40.4% | 41.7% | 51.8% |
| DeepSWE v1.1 | 71.0% (high) | 65.2% | 72.7% | 70.0% |
| EEBench (electrical engineering) | 64.0% | 53.0% | 39.4% | 56.4% |
| AA Briefcase v1.1 (Elo) | 1,657 | 1,546 | 1,487 | 1,678 |
| Terminal-Bench 4.0 | 37.6% | 20.3% | 37.3% | 57.9% |
| Harvey Legal Agent Benchmark | 19.6% | 15.8% | 2.5% | 6.7% |
| HealthBench Professional | 56.7% | 48.5% | 60.5% | 62.1% |

The comparison set is SpaceXSI's choice; competitor scores come from each developer's system cards or leaderboards at different reasoning levels. GPT-6 Astra appears only in the official GDPval chart, not in this table.

### Third-party (Artificial Analysis)

- **Intelligence Index**: Grok 4.7 (xhigh) scores 46, placing SpaceXAI among the top four labs at launch; AA-Briefcase 1,657 Elo and GDPval-AA 1,695 Elo put it alongside Claude Opus 5 and Claude Fable 5.1 on long-horizon knowledge work
- **Coding Agent Index**: Grok Build with Grok 4.7 (xhigh) scores 56 (previously 47); that runs in the first-party harness and is scored separately from the Intelligence Index's standardized harness
- **Terminal-Bench 4.0**: under the Intelligence Index's standardized conditions, Grok 4.7 gains only 4.5 points over 4.6; the official 37.6% was run inside Grok Build. That explains the gap between official and third-party numbers; the [model card](/posts/daily/2026-09-23-model-xai-grok-4-7-en) has the comparison from launch

### Competitive position

- **Against GPT-6 and Claude at the frontier**: still behind on Terminal-Bench and HealthBench, and behind Fable 5.1 on CursorBench; on knowledge work (AA-Briefcase, GDPval) it has caught up to the same tier
- **Price**: SpaceXSI's pitch is "half the price of comparable models"—$2/$6 versus GPT-5.6 Sol's $4/$20 and Fable 5.1's $10/$50 in the announcement table; the higher output-token count eats part of that gap
- **Against open-weight models**: Grok has no current open-weight flagship; teams that need to self-host are not Grok's core audience

## Licensing, pricing, and deployment

### API pricing (USD per 1M tokens, SpaceXSI pricing page)

| Model | Context | Input | Cached | Output | When prompt ≥200K |
|---|---|---|---|---|---|
| grok-4.7 | 500K | $2.00 | $0.50 | $6.00 | $4.00 / $1.00 / $12.00 |
| grok-4.6 | 500K | $2.00 | $0.50 | $6.00 | $4.00 / $1.00 / $12.00 |
| grok-4.5 | 500K | $2.00 | $0.30 | $6.00 | $4.00 / $0.60 / $12.00 |
| grok-4.3 | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-4.20 (three models) | 1M | $1.25 | $0.20 | $2.50 | $2.50 / $0.40 / $5.00 |
| grok-build-0.1 | 500K | $1.00 | $0.20 | $2.00 | $2.00 / $0.40 / $4.00 |

Two details to budget for: **once a prompt reaches 200K, every token in the request is billed at the higher rate**, not just the excess; **the Batch API is 20% off** for 4.7, 4.6, 4.5, 4.3 and the 4.20 models, with no discount for grok-build-0.1. Grok 4.7 also has a fast variant at twice the output speed and twice the price.

Server-side tools are billed separately: web search and code execution are $5 per 1,000 calls; since 2026-09-21 X Search bills per post fetched ($5 per 1,000) and per profile ($10 per 1,000) ([pricing tracker](/posts/daily/2026-09-19-pricing-xai-x-search-billing-change-en)).

Media and voice: image $0.02, image-2.0 $0.04 per image; video $0.05/s, video-1.5 $0.08/s, video-1.5-lite $0.02/s; grok-voice-3.0 speech-to-speech $0.08/min, TTS $15 per 1M characters.

### Retirements and redirects

SpaceXSI retires models by redirecting rather than failing: old model names still resolve, but they are served by the newer model at the newer model's price.

| Old model | Effective | Redirects to |
|---|---|---|
| `grok-4-fast-*`, `grok-4-1-fast-*`, `grok-4-0709` | 2026-05-15 | `grok-4.3` (low for reasoning, none for non-reasoning) |
| `grok-3` | 2026-05-15 | `grok-4.3` (none) |
| `grok-code-fast-1` | 2026-05-15 | `grok-build-0.1` |
| `grok-imagine-image-quality` | 2026-11-02 | `grok-imagine-image-2.0` forced to quality: low ([pricing tracker](/posts/daily/2026-10-03-pricing-xai-grok-imagine-image-quality-sunset-en)) |
| `grok-voice-2.0` | Marked deprecated | `grok-voice-3.0` |

Redirects look harmless, but reasoning level and price both change: code still calling `grok-4-fast-reasoning` is now running Grok 4.3 at low reasoning and paying Grok 4.3 prices.

### Open weights: two models, two licenses

- **Grok-1** (314B, 2024): [Apache 2.0](https://github.com/xai-org/grok-1), commercial use and modification allowed
- **Grok 2** (trained in 2024, released 2025-08): [xAI Community License](https://huggingface.co/xai-org/grok-2/raw/main/LICENSE)—research and non-commercial use; commercial use only in compliance with xAI's acceptable use policy; **the weights, derivatives or outputs may not be used to train other foundation or general-purpose LLMs**; distribution must display "Powered by xAI"; the license terminates on breach
- In August 2025 Musk said Grok 3 would be open-sourced in about six months; the Hugging Face `xai-org` org currently lists only grok-1 and grok-2

All current 4.x models are API- and partner-cloud-only, with no weights. Grok Build's framework is an open-source harness ([GitHub](https://github.com/xai-org/grok-build)): the agent shell is open, the model is not.

### Deployment regions

Grok 4.7 is served in us-east-1, us-west-2 and us-central-1; it is also available through partner platforms such as Amazon Bedrock, Microsoft Foundry, Gemini Enterprise Agent Platform and Databricks (check which versions each platform lists).

## Agent integration and selection

- **Coding agents near the frontier at a lower price** → Grok 4.7 (high/xhigh), most smoothly inside Grok Build or Cursor; measure output tokens on your own tasks first, since 4.7 uses more than twice as many as 4.6
- **Long documents, high volume, unit price first** → Grok 4.3: 1M context, $1.25/$2.50, another 20% off with Batch
- **Complex terminal work** → Grok 4.7's Terminal-Bench under standardized conditions still clearly trails GPT-6 Astra and Claude; gate these tasks with your own evaluation
- **Long-horizon knowledge work (documents, spreadsheets, slides)** → Grok 4.7 is frontier-level on AA-Briefcase and GDPval-AA and belongs on the shortlist
- **Agents over X data** → X Search bills per post fetched; monitoring agents that pull whole threads should model the cost first
- **Images and video** → Imagine image-2.0 / video-1.5; video-1.5-lite on a tight budget
- **Self-hosting** → only Grok-1 (Apache 2.0) and Grok 2 (restrictive), both 2024 models; current Grok cannot be self-hosted
- **Still on Grok 4 Fast or Code Fast 1** → already redirected; switch explicitly to `grok-4.3` or `grok-build-0.1` and set the reasoning level so you are not silently given defaults

Minimal selection check: in one harness (for example your own agent loop), run 20–50 of your own tasks through Grok 4.7 at high and xhigh and through Grok 4.3, recording success rate, average output tokens and cost per task—harness and token usage are exactly where official and third-party Grok 4.7 numbers diverge most.

## Limitations and trade-offs

- **Official versus third-party gaps**: the official Terminal-Bench figure was run in Grok Build; under a standardized harness the gain is much smaller. Cite the conditions
- **Token usage doubled**: an unchanged unit price does not mean unchanged cost; Grok 4.7 emits more than twice the output tokens per task of 4.6
- **Opaque architecture**: no parameter counts or architecture have been published since Grok 1.5, and training data is only described in general terms
- **Openness cliff**: current models have no weights, and Grok 2's license bans training other models with it
- **Frequent corporate and brand changes**: within a year it went from xAI to a SpaceX subsidiary and through two renames; go by the latest terms for the company name on contracts, invoices and compliance documents
- **Redirect-style retirement**: old model names do not error, but price and reasoning level have changed, so model names in code need an active audit

## Update history

- **2026-11-23**: Added the Grok 4.5, 4.6 and 4.7 generation plus Grok Build, Grok Bot and Voice 3.0; rewrote the matrix, evaluation, pricing and selection sections from SpaceXSI's API docs, pricing page, the Grok 4.7 announcement and Artificial Analysis's benchmarking; added how xAI was acquired by SpaceX and renamed SpaceXAI then SpaceXSI, and the redirect-style retirement schedule. Grok 4.6 moved to history, with its benchmarks in the daily model card linked from the timeline. Corrected errors: the previously recommended Grok 4 Fast (2M) was retired on 2026-05-15 and redirects to Grok 4.3; the post said Grok-1 was the only open weight, but Grok 2 was also released in 2025-08 under the xAI Community License; grok-build-0.1's context is now the 500K shown on the pricing page; "Grok 4.3 / 4.20, 2026-03" is split into 4.20 (2026-03) and 4.3 (2026-04); the Bedrock listing now follows the official announcement; `grok-imagine-image-quality` was retired on 2026-11-02.
- **2026-10-11**: Restructured sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [SpaceXSI News](https://x.ai/news) — Grok 4.5/4.6/4.7, Grok Build, Grok Bot, cloud platform announcements
- [Introducing Grok 4.7 — SpaceXSI](https://x.ai/news/grok-4-7) — new base model, official benchmark table, fast variant, pricing
- [Introducing Grok 4.6 — SpaceXSI](https://x.ai/news/grok-4-6) — training recipe, benchmarks, $2/$6
- [Introducing Grok 4.5 — SpaceXSI](https://x.ai/news/grok-4-5) — GB300 training, trained alongside Cursor
- [Introducing Grok Bot 1.0 — SpaceXSI](https://x.ai/news/grok-bot-1-0)
- [Grok Models & Pricing — SpaceXSI Docs](https://docs.x.ai/developers/models) — current models, selection advice, Grok 4.7 knowledge cutoff May 2026
- [Grok 4.7 — SpaceXSI Docs](https://docs.x.ai/docs/models/grok-4.7) — 500K, four reasoning levels, regions, rate limits
- [Pricing — SpaceXSI Docs](https://docs.x.ai/docs/pricing) — all model prices, 200K threshold, 20% Batch discount, tool and media pricing
- [Grok 4.3 — SpaceXSI Docs](https://docs.x.ai/developers/models/grok-4.3)
- [May 15, 2026 Model Retirement — SpaceXSI Docs](https://docs.x.ai/developers/migration/may-15-retirement) — redirect table
- [Benchmarking Grok 4.7 — Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-grok-4-7) — Intelligence Index 46, Coding Agent Index 56, token usage
- [Musk says he will rename SpaceXAI to SpaceXSI — Reuters](https://www.reuters.com/business/media-telecom/musk-says-he-will-rename-spacexai-spacexsi-2026-10-04/)
- [Elon Musk says SpaceXAI will be renamed SpaceXSI — The Economic Times](https://economictimes.indiatimes.com/tech/artificial-intelligence/elon-musk-says-spacexai-will-be-renamed-spacexsi-after-trumps-super-intelligence-push/articleshow/134676679.cms) — background on the July SpaceXAI rename
- [xai-org/grok-1 — GitHub](https://github.com/xai-org/grok-1) / [HF](https://huggingface.co/xai-org/grok-1) — 314B MoE, Apache 2.0
- [xai-org/grok-2 — Hugging Face](https://huggingface.co/xai-org/grok-2) and [LICENSE](https://huggingface.co/xai-org/grok-2/raw/main/LICENSE) — xAI Community License
- [Elon Musk says xAI has open sourced Grok 2.5 — TechCrunch](https://techcrunch.com/2025/08/24/elon-musk-says-xai-has-open-sourced-grok-2-5/)
- [Announcing Grok — xAI Blog](https://x.ai/blog/grok) — 2023-11-03 debut
- [Announcing Grok-1.5](https://x.ai/blog/grok-1.5), [Grok-1.5 Vision](https://x.ai/blog/grok-1.5v), [Grok-2 Beta](https://x.ai/blog/grok-2)
- [Grok 3 Beta — The Age of Reasoning Agents](https://x.ai/blog/grok-3), [Grok 4](https://x.ai/news/grok-4), [Grok Code Fast 1](https://x.ai/news/grok-code-fast-1), [Grok 4 Fast](https://x.ai/news/grok-4-fast)
- [Grok Build — GitHub (xai-org/grok-build)](https://github.com/xai-org/grok-build) and [Grok Build Overview — Docs](https://docs.x.ai/build/overview)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
