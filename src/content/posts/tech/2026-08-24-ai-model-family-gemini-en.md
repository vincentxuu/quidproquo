---
title: "Gemini——Google's Native Multimodal Flagship, from 3.x Pro/Flash to the Four Gemini 4 Tiers: Carbon, Argon, Neon, Hydrogen"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gemini, google-deepmind, model-family-gemini, multimodal, reasoning, model-selection]
lang: en
type: deep-dive
tldr: "Gemini is Google DeepMind's native multimodal LLM family, known for 1M context and native video/audio input. From late September 2026 it moved to the Gemini 4 generation, which by November has four models: Carbon (strongest reasoning), Argon (frontier reasoning with lower token spend), Neon ($3/$15, near-frontier with fast task completion), and Hydrogen ($1.50/$7.50, replacing Flash and available on the free tier). All four support 1M context and up to 1M output tokens in long-decode mode. Carbon and Argon's $2/$10 promotional price only runs through 2026-11-30, becoming $4/$20 in December."
description: "Complete Gemini model family guide: evolution from Gemini 1.0 (2023) to Gemini 4 (2026), native multimodality and 1M context, positioning and pricing of the Gemini 4 Carbon/Argon/Neon/Hydrogen tiers, legacy shutdowns and automatic rerouting, Gemma licensing differences, and a selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 4
draft: false
glossary:
  - term: "Native multimodality"
    definition: "Integrating text, images, video, and speech from pre-training onward, rather than bolting on vision/audio adapters afterward"
  - term: "Thinking levels"
    definition: "Gemini 4's reasoning-depth settings: low, medium, high (default) and xhigh; higher levels reason more deeply and use more tokens"
  - term: "Implicit caching"
    definition: "Gemini 4's caching mode: repeated input prefixes are billed at the cache rate automatically; manually created caches (explicit caching) are not supported"
  - term: "Fairwind Program"
    definition: "Google's trusted cybersecurity partner program; Gemini 4 Argon and Carbon were opened to cyber defenders through it before reaching the general API"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-gemini)

In December 2023, Google DeepMind released Gemini 1.0—the first "native multimodal" model that integrated text, images, video, and speech from pre-training. By 2026, Gemini 3.x had pushed the Flash line to frontier-level agentic coding; on September 30 Gemini 4 Argon was announced, followed within two months by Carbon, Hydrogen, and Neon, and the naming switched from Pro/Flash to element names. This is the fourth family deep-dive in the "AI Model Families" series, tracing Gemini's full evolution from 1.0 to Gemini 4.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on the models listed on the Gemini API pricing and models pages as of 2026-11-20:

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| Gemini 4 Carbon | Strongest reasoning: long-horizon engineering, science, security | $2/$10 promo through 11/30, then $4/$20 | Hosted API (paid tier) |
| Gemini 4 Argon | Frontier reasoning with lower token spend | Same price as Carbon, faster responses and fewer tokens per turn | Hosted API (paid tier) |
| Gemini 4 Neon | Near-frontier, fast task completion | $3/$15, no promotion | Hosted API (paid tier), Gemini app |
| Gemini 4 Hydrogen | Everyday coding and agent work | $1.50/$7.50, one flat price across the 1M context | Hosted API (incl. free tier), Gemini app, Google Search |
| Gemini 3.5 Flash-Lite | High throughput, lowest cost | $0.30/$2.50 | Hosted API |
| Gemma 4 | Self-hosting option | A separate product line from Gemini | Open weights, Apache 2.0 |

### Two Product Lines: Closed Gemini for Revenue, Open Gemma for Ecosystem
The key to reading Gemini's 2026 strategy is splitting it into two lines—similar to GPT's dual track:

**Closed API line** (AI Studio / Gemini API / Gemini Enterprise Agent Platform): every Gemini model runs only on Google infrastructure, with no downloadable weights. 1M context has been standard since the 1.5 era. This line drives revenue—Google's enterprise and consumer traffic all run on it, and in-house TPUs plus global data centers form its infrastructure moat.

**Open-weight line** (Gemma): downloadable, fine-tunable, self-hostable, but not frontier. The license depends on the generation: Gemma 4 (2026-04) moved to Apache 2.0, while Gemma 1–3 used Google's own Gemma Terms of Use. See the [Gemma family](/posts/tech/2026-09-19-ai-model-family-gemma-en) for details.

The turning point worth remembering: Google published the Transformer paper in 2017, acquired DeepMind in 2014, and in December 2023 merged Brain and DeepMind into **Google DeepMind**, making Gemini the unified brand—consolidating research to compete with OpenAI and Microsoft. Gemma's openness reads more as strategic gap-filling than a return to openness—the closed-flagship core never loosened.


### Sub-lines and Ecosystem: How Many Products Gemini Actually Has
| Sub-line | Representative versions (2026-11) | Role |
|---|---|---|
| Mainline reasoning | Gemini 4 Carbon/Argon/Neon/Hydrogen | Four tiers, from strongest reasoning to everyday workhorse |
| Lightweight | Gemini 3.5 Flash-Lite, 3.1 Flash-Lite | Fast and cheap, large-scale classification and translation |
| Security | Argon/Carbon under the Fairwind Program, 3.8 Flash Cyber | Versions without cyber guardrails for trusted defenders; Vertex IDs such as `gemini-4-carbon-cyber-permissive` |
| Decision models | Gemini Decision 1 | Batched yes/no, multiple-choice and scoring questions, billed on input only ([model card](/posts/daily/2026-11-13-model-google-gemini-decision-1-en)) |
| Open weights | Gemma 4 | Apache 2.0, self-hostable |
| Embeddings | gemini-embedding-2 | RAG workhorse (listed on Gemini Enterprise Agent Platform) |
| Image | Nano Banana 2.1 / 2 / Pro | Generation and conversational editing |
| Speech / audio | Gemini 3.8 Live, 3.8 Flash TTS, 3.5 Transcribe | Real-time voice dialogue, speech synthesis, transcription |
| Video | Gemini Omni 1.2 Flash | Video generation and editing up to 15 seconds with native audio |
| Interactive world model | Genie 4 | Real-time streamed, steerable 24 fps worlds with audio ([model card](/posts/daily/2026-11-03-model-google-genie-4-en)) |
| Developer tools | AI Studio, Google Antigravity, Gemini Enterprise Agent Platform | Agent infrastructure |
| Consumer | Gemini app, NotebookLM, Google Search | The largest distribution channels |

Two observations:

**Multimodal breadth is Gemini's most underrated asset.** All four Gemini 4 models accept text, images, audio, video, and PDF, fused from pre-training rather than bolted on with adapters. For agent scenarios that need to "understand video + hear speech + read charts," this is still Gemini's clearest differentiator.

**Infrastructure and distribution are a hidden moat.** Google runs large-scale TPU clusters, and Gemini 4 Hydrogen launched simultaneously in the Gemini app, Google Search, and Sheets—distribution no other lab has. But it also ties Gemini's fate closely to Google Cloud, a risk for enterprises that don't want to depend on a single cloud.

## Family evolution

### Family Evolution Timeline
| Version | Released | Key facts | What it changed for model selection |
|---|---|---|---|
| Gemini 1.0 Ultra/Pro/Nano | 2023-12 | First native multimodal model, 32K context | Multimodality no longer required chaining several models |
| Gemini 1.5 Pro / Flash | 2024-02 / 2024-05 | Industry-first 1M context | Whole documents and videos fit in a single request |
| Gemini 2.0 Flash | 2024-12 | Agent capabilities, tool use | Flash went from "cheap summarizer" to something that can run agents; API shut down on 2026-06-01 |
| Gemini 2.5 Pro / Flash | 2025-03 / 2025-04 | Major reasoning gains | Reasoning models entered the Gemini mainline; on the Developer API they reroute to 3.8 Flash / 3.5 Flash-Lite from 2026-12-01 ([shutdown notice](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset-en)) |
| Gemini 3.0 Pro / 3.1 Pro | 2025-11 / 2026-02 | 3.1 Pro: GPQA Diamond 94.1%, ARC-AGI-2 77.1% (Deep Think), $2/$12 | Gemini led on science reasoning for the first time; 3.1 Pro is still a preview model |
| Gemini 3.1 Flash-Lite | 2026-03 | $0.25/$1.50 | The lowest-price tier took shape; scheduled to shut down on 2027-05-07 with 3.5 Flash-Lite as the replacement |
| Gemini 3.5 / 3.6 / 3.7 Flash | 2026-05 / 07 / 08 | $0.75/$3.75 from 3.6 | Three Flash generations without a price increase moved the workhorse from Pro to Flash; 3.5 and 3.7 now reroute automatically to newer versions ([3.7 model card](/posts/daily/2026-08-16-model-google-gemini-3-7-flash-en)) |
| Gemini 3.8 Flash / 3.8 Flash Cyber | 2026-09-02 | DeepSWE v1.1 73.7%, Terminal-Bench 2.1 89.4%, effort levels | Frontier agentic coding at Flash prices; the Cyber variant set the pattern of "trusted security partners first" ([model card](/posts/daily/2026-09-04-model-google-gemini-3-8-flash-en)) |
| Gemini 4 Argon | Announced 2026-09-30 / in the API 10-13 | Output limit raised from 64K to 1M, DeepSWE v1.1 77.9% | The new generation went to cyber defenders before the general API; long output became a selection criterion ([model card](/posts/daily/2026-10-05-model-google-gemini-4-argon-en)) |
| Gemini 4 Carbon | Announced 2026-10-28 / in the API 11-10 | #1 on Artificial Analysis Intelligence Index v5.0 at 59 (at launch) | The strongest model is no longer called Pro; the flagship and its token-saving sibling share a price ([model card](/posts/daily/2026-10-29-model-google-gemini-4-carbon-en)) |
| Gemini 4 Hydrogen | 2026-11-12 | $1.50/$7.50, free tier available, replaces the Flash name | The everyday workhorse changed generation, and 3.8 Flash became the previous generation |
| Gemini 4 Neon | 2026-11-18 | $3/$15, #3 on the AA Intelligence Index at 61 (xhigh) | Filled the price tier between Hydrogen and Carbon ([model card](/posts/daily/2026-11-20-model-google-gemini-4-neon-en)) |

Three years, many milestones. Gemini's arc is clear: **from multimodality to agents, from flagship to full-size coverage**. 1M context was Gemini's earliest technical moat; in the 3.x era the workhorse moved from Pro to Flash; with Gemini 4, Google dropped the Pro/Flash naming for four element names and routed each new generation through trusted security partners before opening it to general developers.

## Architecture and training trade-offs

### Architecture: Native Multimodality, 1M Context, and 1M Output
#### Native Multimodality

Gemini has been natively multimodal since its first generation—text, images, video, and speech are trained together in pre-training rather than training a text model first and bolting on a vision adapter. For Gemini 4, the models page lists text, image, audio, video, and PDF as inputs and text as output; image, video, and speech generation are handled by dedicated models such as Nano Banana, Omni, and TTS.

#### 1M Context and Long Decode

In February 2024, Gemini 1.5 Pro became the first model to support a 1M-token context window. 1M tokens is roughly 10 full novels, 30,000 lines of code, or 5 hours of transcribed speech.

The new change in Gemini 4 is on the output side. When Argon launched, Google raised the output limit from the previous 64K to 1M tokens, so the model can reason at length in a single trajectory and produce hundreds of thousands of tokens at once. The models page now lists the output limit of all four Gemini 4 models as "64K / 1M": 64K for regular requests, up to 1M with long decode.

Pricing also differs from 3.x. Gemini 3.1 Pro switches the whole request to the long-context rate once input exceeds 200K tokens; Gemini 4 Hydrogen is officially one flat price across the full 1M context.

#### Thinking Levels: From Deep Think to Four Settings

In the 3.x era, deep reasoning came from Deep Think mode; 3.8 Flash switched to effort levels. Gemini 4 standardizes on four thinking levels: low, medium, high (default), and xhigh. Google's Hydrogen and Neon announcements both stress a "smooth, predictable" progression between levels, letting developers set reasoning depth and token spend per task. The level changes scores and cost substantially: the same Neon scores differently at high and xhigh on the Artificial Analysis Intelligence Index, and Google's headline number is the xhigh one.

#### Multi-model Collaboration: Carbon Plans, Hydrogen Executes

Gemini 4's tiering also shows up in tooling. Google Antigravity introduced Orchestrator, which within one session lets Carbon handle planning and judgment while Hydrogen writes code and runs tests; Google says it reaches near-Carbon success on Terminal-Bench 4.0 while using 24% less quota on average and finishing 19% faster. Neon is also designed to act as a coordinator directing multiple Hydrogen subagents.

## Evaluation and alternatives

### Performance Position
Headline numbers from each Gemini 4 announcement, all Google self-reported or third-party leaderboards cited by Google:

| Model | Headline official numbers |
|---|---|
| Gemini 4 Argon | DeepSWE v1.1 77.9% (SOTA at launch), AutomationBench 51.3% #1, LVBench (long-video understanding) 91.7%, CWE-bench v1 68% tied #1 |
| Gemini 4 Carbon | Artificial Analysis Intelligence Index v5.0 #1 at 59 (at its 10-28 launch); security: SEC-bench Pro 88.2%, ExploitGym 54.8%, CWE-bench 71.0%; WebDev Arena #4 at 1768; Terminal-Bench 4.0 successful cheating cut to 0.0% |
| Gemini 4 Hydrogen | AA Intelligence Index 51 (high) / 54 (xhigh), above Argon's 50; Terminal-Bench 4.1 57% vs. 18.2% for 3.8 Flash; finishes tasks 2.5x faster |
| Gemini 4 Neon | AA Intelligence Index 61 (xhigh), #3 overall; AA Coding Agent Index 58.6 #1; Terminal-Bench 4.1 65.2%; Terminal-Bench Science 70.5%; AutomationBench 56.3% #1; Agents' Last Exam v1.1 75.8% |

Against third-party evaluations:

| Source | Result |
|---|---|
| Artificial Analysis Intelligence Index | Carbon was #1 at 59 when it launched; by Neon's launch (11-18), Neon ranked #3 at 61, behind Claude Fable 5.2 and GPT-6.2 Astra ([Neon model card](/posts/daily/2026-11-20-model-google-gemini-4-neon-en)) |
| Arena Agent leaderboard | Carbon (High) debuted at #2 in the 10-28 batch ([benchmark note](/posts/daily/2026-10-30-benchmark-arena-agent-gemini-carbon-en)); Neon was #3 in the 11-20 batch, with a confidence interval overlapping #2 Claude Opus 5.5 ([benchmark note](/posts/daily/2026-11-20-benchmark-gemini-4-neon-en)) |
| Agents' Last Exam | The Decoder reported that when GPT-6.2 Astra launched, only Gemini 4 Carbon kept up with it on this benchmark |

Three cautions when reading these numbers:

- **When the ranking was taken**: Carbon's "#1" is a late-October ranking; three weeks later Claude Fable 5.2 and GPT-6.2 Astra both ranked above Gemini 4. Always cite the date.
- **Thinking level**: Google often cites xhigh scores, while the default is high.
- **Benchmark version**: Gemini 4 uses Terminal-Bench 4.0/4.1, while 3.8 Flash used 2.1, so the two can't be compared directly.

Another trade-off worth noting: the AA-Omniscience hallucination rates compiled in this site's Neon model card show Neon (13.9–14.4%) higher than Carbon (11.4%), Hydrogen (8.5%), and Argon (4.3%).


### Competitive Position
Placing Gemini in the late-2026 landscape:

- **vs. Claude**: Claude Fable 5.2 ranks first on Artificial Analysis's composite index; Gemini 4 Neon leads on the Coding Agent Index and AutomationBench at a much lower $3/$15. See the [Claude family](/posts/tech/2026-08-24-ai-model-family-claude-en)
- **vs. GPT**: GPT-6.2 Astra scores above Gemini 4 on the composite index; Gemini's differences are native multimodal input, long-video understanding (Argon's LVBench 91.7%), and Hydrogen's free tier. See the [GPT family](/posts/tech/2026-08-24-ai-model-family-gpt-en)
- **vs. open models (DeepSeek / Qwen / Kimi)**: open models can be self-hosted at lower unit prices; Gemini's advantages are 1M context, multimodal breadth, and distribution through Google products, but its strongest models aren't open

## Licensing, pricing, and deployment

### The Licensing Trap: The Strongest Models Are Locked to Google Infrastructure
Google's licensing mirrors OpenAI's—closed flagships plus small open models:

- **Closed mainline (all Gemini 4)**: API only (AI Studio / Gemini API / Gemini Enterprise Agent Platform), no weights, licensed under Google's terms of service
- **Open weights (Gemma)**: Gemma 4 is Apache 2.0; Gemma 1–3 are under the Gemma Terms of Use, which are different terms and shouldn't be lumped together
- **Enterprise deployment**: Gemini on Gemini Enterprise Agent Platform (formerly Vertex AI) is governed by Google Cloud contracts, with selectable data-processing regions

The caveat: **Gemini's strongest models are essentially locked to Google infrastructure.** To use 1M context or native video understanding, you have to go through Google's API. Gemma 4 is Apache 2.0, but its scale and quality trail Gemini 4 by a wide margin. If you need "Apache 2.0 + frontier quality," look at DeepSeek (MIT) or Qwen (mostly Apache).

Another trap is **Google ecosystem lock-in**: Gemini's deepest advantages (Search, YouTube, Maps, Workspace) only show up inside Google's ecosystem. Outside Google infrastructure, the advantage shrinks considerably.

Three easily overlooked pricing and operations details:

- **Promotions expiring**: Carbon and Argon's $2/$10 (cache $0.10) runs only through 2026-11-30 and becomes $4/$20 (cache $0.20) from 12-01, a 100% increase ([promo deadline notice](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline-en)). 3.8 and 3.6 Flash's $0.75/$3.75 runs only through 2026-12-31 and becomes $1.50/$7.50 from 2027-01-01
- **Automatic rerouting instead of errors**: when Google retires a model, it often routes requests to a newer model automatically and bills at the newer model's rate. 2.5 Pro reroutes to 3.8 Flash and 2.5 Flash to 3.5 Flash-Lite on 2026-12-01; 3.7 Flash already routes to 3.8 Flash, and Omni 1.1 Flash routes to Omni 1.2 Flash on 2026-12-03. Your code won't break, but model behavior and your bill can change silently. Gemini Enterprise Agent Platform (formerly Vertex AI) runs on a different schedule: the 2.5 series shut down on 2026-10-20, 3.6 Flash on 2026-11-19, and 3.7 Flash is scheduled for 2027-01-28, so the same model has a different lifespan on each surface
- **Billing details**: Gemini 4 supports only implicit caching, with no manually created caches; thinking tokens and internal tool instructions during grounding are billed. Carbon, Argon, and Neon have no free tier; Hydrogen does


### Choosing Between Gemini 4 Carbon, Argon, Neon, and Hydrogen
Paid Tier prices from the Gemini API pricing page (read 2026-11-20), per 1M tokens:

| Item | Gemini 4 Carbon | Gemini 4 Argon | Gemini 4 Neon | Gemini 4 Hydrogen | Gemini 3.5 Flash-Lite |
|---|---|---|---|---|---|
| Role | Strongest reasoning, long-horizon engineering and security | Frontier reasoning with lower token spend | Near-frontier, fast task completion | Everyday coding and agents | High throughput, lowest cost |
| Input | $2 (through 11/30) → $4 | $2 (through 11/30) → $4 | $3 | $1.50 | $0.30 |
| Output (incl. thinking) | $10 (through 11/30) → $20 | $10 (through 11/30) → $20 | $15 | $7.50 | $2.50 |
| Cache | $0.10 → $0.20 | $0.10 → $0.20 | $0.15 | $0.075 | $0.03 |
| Free tier | No | No | No | Yes | Yes |
| Context / output limit | 1M / 64K (1M long decode) | 1M / 64K (1M long decode) | 1M / 64K (1M long decode) | 1M / 64K (1M long decode) | — |
| Input modalities | Text, image, audio, video, PDF | Same | Same | Same | Text, image, video, audio |

Pricing and specs come from [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) and [Gemini API Models](https://ai.google.dev/gemini-api/docs/models). The Batch API costs 50% of standard rates. The previous-generation 3.8 Flash ($0.75/$3.75 through 12/31) and 3.1 Pro preview ($2/$12, $4/$18 above 200K) remain available, and Google hasn't announced shutdown dates for them.

## Agent integration and selection

### What It Means for Agent Developers
- **The hardest long-horizon engineering, science and security tasks** → Gemini 4 Carbon: Google says it can run for days on root-causing and patching across large codebases, and it leads the three security benchmarks. Note the unit price doubles from December
- **Frontier reasoning with lower token spend** → Gemini 4 Argon: same price, but faster responses and fewer tokens per turn
- **Everyday workhorse, coding agents** → Gemini 4 Neon ($3/$15): leads the Coding Agent Index and AutomationBench, and Google designed it to coordinate Hydrogen subagents
- **High-volume everyday coding, agent executors, free trials** → Gemini 4 Hydrogen ($1.50/$7.50): replaces 3.8 Flash; Google says Terminal-Bench 4.1 rose from 18.2% to 57%
- **High-throughput classification / translation** → Gemini 3.5 Flash-Lite ($0.30/$2.50)
- **Video and speech understanding** → any Gemini 4 model takes video and audio directly; for long videos, see Argon's LVBench 91.7%
- **Very long single outputs** → Gemini 4's long decode allows up to 1M output tokens, the biggest change from the 3.x-era 64K limit
- **Still on 2.5 / 3.7 Flash** → check the deprecations page first: automatic rerouting changes behavior and pricing, so compare on your own requests before migrating
- **Local deployment** → Gemini is tied to Google infrastructure; for self-hosting look at Gemma 4 (Apache 2.0, not frontier) or Qwen / DeepSeek

## Limitations and trade-offs

Most Gemini 4 announcement numbers are Google self-reports or Google-chosen leaderboards, often at xhigh; on composite indices Gemini 4 currently trails Claude Fable 5.2 and GPT-6.2 Astra. Carbon and Argon double in price from December, so estimate with post-promotion pricing. Neon's hallucination rate is higher than the rest of the family. Don't mix licensing and deployment assumptions between Gemini and Gemma; check long-context and multimodal capabilities against the specific model, input conditions, and price rather than treating the family name as a spec.

### Overall
Gemini's story is "trading infrastructure advantage for leadership in multimodality, long context, and distribution." Google's in-house TPUs and global data centers let Gemini offer native multimodality within 1M context and push new models into the Gemini app, Search, and Workspace at once.

Gemini 4 brought three changes: the output limit rose from 64K to 1M, the naming moved from Pro/Flash to four element names, and each new generation went to trusted security partners before general release. For agent developers the pragmatic approach is: Carbon for the hardest tasks, Neon as the everyday workhorse and coordinator, Hydrogen for high-volume execution and testing, Flash-Lite for high throughput—and remember Carbon and Argon's promotional price ends at the end of November.


## Update history

- **2026-11-20**: Added the Gemini 4 generation (Argon, Carbon, Hydrogen, Neon). Rewrote the version matrix, sub-line table, evaluation, pricing and selection guide based on the Gemini API pricing page, models page and official announcements as of 2026-11-20; added thinking levels, 1M long decode, Orchestrator multi-model collaboration, promotion deadlines and automatic rerouting. Gemini 3.x moved to history: the detailed 3.1 Pro and 3.8 Flash benchmark tables, the three-model pricing table and selection advice left the main text, and the figures from that time are in the daily model cards linked from the timeline; each timeline row now notes what it changed for model selection. Corrected errors: the article said Gemma 2/3 were Apache 2.0, but Gemma 1–3 are under the Gemma Terms of Use and only Gemma 4 moved to Apache 2.0; outdated sub-line entries such as Imagen 4, Veo 3 and Gemini 3.1 Flash-Lite were replaced with currently listed models.
- **2026-10-11**: Corrected English drift against the existing Chinese 3.8 Flash coverage. Rechecked only the official 3.8 model-card table, launch text, and relevant pricing passages through Groundlane; this was not a full article fact-check. Older checks and chart-reading caveats remain separate.
- **2026-10-11**: Reorganized the article into the shared family format and added a matrix derived from existing content. Existing versions, prices, and source dates were retained; no new fact-check was performed.
- 2026-09-19: Added Gemini 3.8 Flash (2026-09-02) — timeline, selection table, agentic coding performance section, sub-family table (3.8 Flash Cyber, Omni 1.1 Flash), three-generation same-price and effort levels; benchmark numbers verified against Model Card evaluation table, with blog chart reading differences noted in-text.

## References

- [Gemini 4 Argon: our next era of frontier intelligence — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [Gemini 4 Carbon: our next frontier model — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Introducing Gemini 4 Hydrogen — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/)
- [Introducing Gemini 4 Neon — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Gemini 4 Hydrogen and Orchestrator — Google Antigravity Blog](https://antigravity.google/blog/gemini-4-hydrogen-in-google-antigravity/)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
- [Model versions and lifecycle — Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
- [Gemini 3.8 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
- [Gemini 3.7 Flash: our most intelligent workhorse model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.1 Pro: Announcing our latest Gemini AI model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Gemini 3.1 Pro Model Card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)
- [Google DeepMind Gemini](https://deepmind.google/models/gemini/pro/)
- [ARC-AGI-2 Benchmark](https://arcprize.org)
- [OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains — The Decoder](https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
