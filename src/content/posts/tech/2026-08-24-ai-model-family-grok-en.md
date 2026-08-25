---
title: "Grok — From a 314B Open-Source Bet to Grok 4.6/Build/Imagine, xAI's Distribution-Driven Catch-Up"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, grok, xai, model-family-grok, moe, open-source, model-selection]
lang: en
type: deep-dive
tldr: "Grok is xAI's LLM family: founded July 2023, opened with a 314B MoE under Apache 2.0 in March 2024, and two and a half years later spans Grok 4.6 (500K, $2/$6, four reasoning levels), Grok 4 Fast (2M), Imagine for image/video, and Grok Build for terminal coding — its moat is distribution (X / grok.com / Tesla / Bedrock), not single-model supremacy. This post traces Grok 1→4.6, sub-line positioning, pricing, and licensing traps."
description: "Complete Grok (xAI) family guide: 2023→2026 timeline, 314B MoE open start, Colossus supercomputer and RL reasoning scaling, Grok 4/4 Fast/4.6 pricing and positioning, Imagine image/video, Grok Build terminal agent, licensing and competitive landscape."
series:
  name: "AI Model Families"
  order: 11
draft: false
glossary:
  - term: "Colossus"
    definition: "xAI's Memphis supercomputer cluster where RL reasoning scaling has been trained since Grok 3, at 200K-GPU scale."
  - term: "Grok Build"
    definition: "xAI's terminal-native coding agent harness and TUI — interactive, headless, and ACP-embeddable; the harness itself is Apache 2.0."
  - term: "ACP"
    aliases: ["Agent Client Protocol"]
    definition: "A standard protocol for embedding agents in editors; supported by Grok Build, Claude Code, and others."
  - term: "Grok Imagine"
    definition: "xAI's image/video generation model line, billed per image/per second via the xAI API."
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-grok)

On March 17, 2024, xAI dropped 314B-parameter [Grok-1](https://github.com/xai-org/grok-1) on GitHub under Apache 2.0 — while the industry debated whether to open-source at all, xAI open-sourced its largest MoE. That was Grok's starting point and, to date, its only open weight. Two and a half years later the same family spans four lines: the reasoning [Grok 4.6](https://docs.x.ai/docs/models/grok-4.6) (500K, $2/$6), the radically cheaper [Grok 4 Fast](https://x.ai/news/grok-4-fast) (2M), [Imagine](https://docs.x.ai/docs/models/grok-imagine-image-2.0) for image/video, and [Grok Build](https://github.com/xai-org/grok-build) living in the terminal. This post traces Grok from open-source bet to full product suite.

For how to read the benchmarks cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is the eleventh family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Timeline

| Version | Release | Context | Key fact |
|---|---|---|---|
| xAI founded | 2023-07-12 | — | Led by Elon Musk, anchored by the Memphis Colossus supercomputer |
| Grok debut | 2023-11-03 | 8K | First model, [Announcing Grok](https://x.ai/blog/grok) |
| Grok-1 open release | 2024-03-17 | 8K | 314B MoE (8 experts, 2 per token), 64 layers, Apache 2.0 ([xai-org/grok-1](https://github.com/xai-org/grok-1) / [HF](https://huggingface.co/xai-org/grok-1)) |
| Grok-1.5 | 2024-03-28 | 128K | 16× context, [perfect NIAH retrieval](https://x.ai/blog/grok-1.5), MATH 50.6% / GSM8K 90% / HumanEval 74.1% |
| Grok-1.5V | 2024-04-12 | 128K | First multimodal (vision), [RealWorldQA](https://x.ai/blog/grok-1.5v) |
| Grok-2 / mini | 2024-08-13 | — | [Grok-2 Beta](https://x.ai/blog/grok-2), LMSYS `sus-column-r` beating Claude 3.5 Sonnet / GPT-4-Turbo; enterprise API the same month |
| Grok 3 / mini (Think) | 2025-02-19 | 1M | [Age of Reasoning Agents](https://x.ai/blog/grok-3), 10× compute on Colossus, Elo 1402 (Chatbot Arena), 1M context (8× prior) |
| Grok 4 / Heavy | 2025-07-09 | 256K | [Grok 4](https://x.ai/news/grok-4), 256K, RL on 200K-GPU Colossus, Heavy via parallel test-time compute |
| Grok Code Fast 1 | 2025-08-28 | 256K | [Speedy economical reasoning](https://x.ai/news/grok-code-fast-1), built for terminal/editors, $1.00/$2.00 |
| Grok 4 Fast | 2025-09-19 | 2M | [2M context, 40% fewer thinking tokens, 98% price delta](https://x.ai/news/grok-4-fast), SOTA price-to-intelligence (Artificial Analysis) |
| Grok 4.3 / 4.20 | 2026-03 | 1M | Still-active docs line, $1.25/$2.50, 20% batch discount |
| Grok 4.5 / 4.6 | 2026 (current docs) | 500K | [Current docs leaders](https://docs.x.ai/developers/models), $2.00/$6.00 (2× above 200K → $4/$12), four reasoning levels low/medium/high/xhigh |
| Grok Imagine | 2026 | — | Image $0.02/$0.04/$0.05, video $0.05–$0.08/sec ([pricing](https://docs.x.ai/docs/pricing)) |
| Grok Build | 2026-08-12 | — | [TUI + headless + ACP](https://docs.x.ai/build/overview), [26k stars, Apache 2.0](https://github.com/xai-org/grok-build) |

Two and a half years, 13 milestones. The through-line is "catch up with compute and distribution" — Colossus doubling each generation, context from 8K to 2M, and distribution via X / grok.com / Tesla / Bedrock to put the model where users already are.

## Three Sub-Lines: Reasoning, Image, Terminal

Grok is often treated as "a chat model" but now spans three sub-lines targeting different rivals:

**Reasoning/chat** (Grok 1 → 4.6 + 4 Fast): xAI's main battle. [Grok 3](https://x.ai/blog/grok-3) scaled reasoning with RL at unprecedented scale (10× compute on Colossus, seconds-to-minutes thinking, backtracking); [Grok 4](https://x.ai/news/grok-4) pushed Heavy (parallel test-time compute) for leaderboard wins; [Grok 4 Fast](https://x.ai/news/grok-4-fast) trades 2M context and 40% fewer thinking tokens for a 98% price cut — the "price-to-intelligence king."

**Image/video** (Imagine): [grok-imagine-image](https://docs.x.ai/docs/models/grok-imagine-image-2.0) ($0.02), [image-quality](https://docs.x.ai/docs/pricing) ($0.05), [image-2.0](https://docs.x.ai/docs/models/grok-imagine-image-2.0) ($0.04), [video](https://docs.x.ai/docs/pricing) ($0.05/sec) and [video 1.5](https://docs.x.ai/docs/pricing) ($0.08/sec). The [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) image ELO places [Grok Imagine 2.0](https://arena.ai/leaderboard/text-to-image) in the top five, but xAI's own announcement and leaderboard details were Cloudflare-blocked during verification — cite LMArena/Artificial Analysis with dates.

**Terminal coding** (Build / Code Fast): [Grok Build](https://github.com/xai-org/grok-build) is xAI's coding agent harness — fullscreen TUI, mouse-interactive, extensible — with three run modes: interactive, headless (`grok -p "prompt" --output-format streaming-json` for CI/scripting), and embedded in editors via [ACP](https://docs.x.ai/build/overview). The harness is [Apache 2.0](https://github.com/xai-org/grok-build/blob/main/LICENSE); the model behind it is [Grok 4.6](https://docs.x.ai/build/overview#use-grok-46-on-the-api) ([grok-build-0.1 / grok-code-fast-1](https://docs.x.ai/docs/models/grok-build-0.1), 256K, $1/$2).

## Architecture: MoE Start, Colossus and RL Scaling

### Grok-1's MoE Starting Point

[Grok-1's Model Specifications](https://github.com/xai-org/grok-1) (`model.py`) specify: 8 experts, 2 active per token, 64 layers, 48 Q-heads / 8 KV-heads, embedding 6,144, SentencePiece 131,072, RoPE, 8-bit/activation sharding. At 314B total it was among the largest open MoEs at the time, but 8K context already looks cramped next to the later 128K/1M.

### Colossus and Reasoning Scaling

xAI's narrative spine is compute. [Grok 3](https://x.ai/blog/grok-3) claims RL at "unprecedented scale" with 10× prior compute on Colossus; [Grok 4](https://x.ai/news/grok-4) adds 200K-GPU Colossus, 6× compute efficiency, 10× Grok 3 reasoning compute. This explains Grok's iteration speed — not an architectural ambush but pushing RL and test-time compute to the limit (Heavy trades parallel compute for scores).

## Pricing and Performance: How to Choose

### API Pricing (per million tokens, from [docs.x.ai](https://docs.x.ai/docs/pricing))

| Model | Context | Input (<200K) | Cached | Output (<200K) | Input (≥200K) | Output (≥200K) | Reasoning levels |
|---|---|---|---|---|---|---|---|
| Grok 4.6 | 500K | $2.00 | $0.50 | $6.00 | $4.00 | $12.00 | low/medium/high/xhigh (default high) |
| Grok 4.5 | 500K | $2.00 | $0.30 | $6.00 | $4.00 | $12.00 | Same |
| Grok 4.3 / 4.20 (reasoning/non-reasoning/multi-agent) | 1M | $1.25 | $0.20 | $2.50 | $2.50 | $5.00 | — (20% batch discount) |
| Grok Build 0.1 (Code Fast 1) | 256K | $1.00 | $0.20 | $2.00 | $2.00 | $4.00 | reasoning |
| Grok 4 Fast | 2M | — (anchored to 4.5/4.6, 98% delta) | — | — | — | — | Unified reasoning/non-reasoning |

Two details: **above 200K tokens the price doubles** (both input and output); **20% batch discount** applies only to 4.3/4.20. Long-context workloads must be priced at the doubled rate.

### Performance Position (xAI official releases; third-party boards cited with dates)

| Metric | Grok 4 ([official](https://x.ai/news/grok-4)) | Grok 3 ([official](https://x.ai/blog/grok-3)) | Reference (in-series) |
|---|---|---|---|
| HLE (Humanity's Last Exam) | 44.4% Heavy / 38.6% (full set, with Python+search) | — | DeepSeek V4 Pro undisclosed; see Claude/GPT family posts |
| ARC-AGI v2 | 15.9% (vs Opus 8.6%) | — | — |
| GPQA | 87.5–88.4% | 84.6% | Gemini 3.1 Pro 94.1% (science reasoning still leads) |
| LiveCodeBench | 79.3% | 79.4% | DeepSeek V4 Pro 96.4% (different board: SWE-bench Verified) |
| AIME'25 | — | 93.3% cons@64 | — |

Grok 4 Fast's official comparison ([Grok 4 Fast](https://x.ai/news/grok-4-fast)): GPQA Diamond 85.7% vs Grok 4 87.5%, AIME'25 92.0% vs 91.7%, HLE 20.0% vs 25.4%, LiveCodeBench 80.0% vs 79.0% — near-flagship scores for 2M context and a 98% price cut.

The site's daily Grok 4.6 note ([Grok 4.6 daily](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-daily)): GDPVal-AA v2 1753 Elo (field high) but hard-core coding (DeepSWE, Terminal-Bench) still behind GPT-5.6 Sol Max — consistent with the family post's "strong distribution, still chasing on hard engineering" framing.

### How to Choose

- **Strongest reasoning with 500K** → Grok 4.6 (high/xhigh), watch the >200K doubling.
- **Value with 2M long docs** → Grok 4 Fast — 40% fewer thinking tokens, 98% cheaper, keeping 85%+ GPQA.
- **Terminal coding agent** → Grok Build (Apache 2.0 harness) + grok-build-0.1 / 4.6 API, with headless/ACP.
- **Image/video generation** → Imagine image $0.02–$0.05 / video $0.05–$0.08/sec by quality tier.
- **Local self-host** → Only Grok-1 (314B, Apache 2.0); everything after is closed API.

## Licensing Traps: Open Only Once

Grok has the sharpest licensing cliff in the series:

- **Grok-1**: [Apache 2.0](https://github.com/xai-org/grok-1), commercially usable, self-hostable, modifiable — but 8K context and 2024 architecture, no longer frontier.
- **Grok 1.5 / 2 / 3 / 4 / 4 Fast / 4.5 / 4.6**: Closed API, no weight downloads. License is [xAI Terms of Service](https://x.ai/legal/terms-of-service).
- **Grok Build harness**: [Apache 2.0](https://github.com/xai-org/grok-build/blob/main/LICENSE) — harness open, model closed. You can self-host the harness, not the model.
- **Grok Imagine**: API-billed, no weights.

Comparison: Qwen (mostly Apache 2.0), DeepSeek (MIT), Gemma (Apache 2.0, 2B–27B), Llama 4 (Community License, downloadable), Mistral (Apache/Modified MIT) all offer commercially self-hostable weights; only Grok-1 is self-hostable in the Grok family, two generations behind the current frontier.

## Sub-Lines and Ecosystem

| Sub-line | Representative | Positioning |
|---|---|---|
| Flagship reasoning | Grok 4.6 500K | Strongest reasoning, four tunable levels, $2/$6 |
| Long value | Grok 4 Fast 2M | 2M, 98% price delta, SOTA price-to-intelligence |
| 1M flagship | Grok 4.3 / 4.20 1M | 1M, $1.25/$2.50, 20% batch discount |
| Light reasoning | Grok Code Fast 1 / Build 0.1 256K | Terminal/editor coding, $1/$2 |
| Image | Imagine image / image-quality / 2.0 | $0.02/$0.05/$0.04 per image |
| Video | Imagine video / 1.5 | $0.05/$0.08 per second |
| Terminal agent | Grok Build | TUI + headless + ACP, Apache 2.0 harness |
| Open weight | Grok-1 314B | Only open weight, Apache 2.0, 8K |

Two observations:

**Distribution is Grok's most underrated lever.** Built into X, on grok.com, in Tesla vehicles, on [Amazon Bedrock](https://aws.amazon.com/bedrock) (community-reported as live Aug 2026; not listed on xAI's site at writing — verify against AWS announcements) — Grok's reach does not rely on leaderboards but on the Elon distribution system. That is why xAI can trade "faster iteration, lower price" for catch-up.

**Build's openness is harness openness.** [xai-org/grok-build](https://github.com/xai-org/grok-build) (26k stars) and [grok-build-plugin-cc](https://github.com/xai-org/grok-build-plugin-cc) open-source the harness and Claude Code plugin; the model still goes through the [xAI API](https://docs.x.ai/docs/models/grok-4.6). For agent builders, Build's value is an auditable, forkable harness — not a self-hostable model.

## Competitive Position

Grok in the 2026 landscape:

- **vs. GPT-5.6**: GPT still leads on hard agentic boards (SWE-bench Verified / Terminal-Bench / BrowseComp); Grok chases with 2M/500K and lower pricing
- **vs. Claude Opus 5**: Claude leads at 96% SWE-bench Verified and agentic stability; Grok's edge is distribution and terminal-native (Build vs. Claude Code)
- **vs. Gemini 3.1 Pro**: Gemini leads on GPQA 94.1% / ARC-AGI-2 77.1% for science; Grok has highlights on HLE/ARC-AGI v2 but not a sweeping win
- **vs. DeepSeek V4**: DeepSeek matches Claude on SWE-bench at 1/28 the price under MIT and is self-hostable; Grok has no commercially self-hostable flagship (only Grok-1) and requires official xAI deployment for private use
- **vs. Qwen3.8 / Kimi K3 / GLM-5.3**: All three ship 1T+ open weights; Grok has no equivalent open flagship — its differentiation is Imagine and Build breadth
- **vs. open small models**: No Phi/Gemma/Ornith-equivalent open small line; edge/local is not Grok's lane

## What This Means for Agent Builders

- **Long reasoning** → Grok 4 Fast (2M) or Grok 4.6 (500K) — watch the >200K doubling; 4.3/4.20's 1M + batch discount suits off-peak batches
- **Terminal coding** → Grok Build (Apache 2.0 harness) + grok-build-0.1/4.6 — headless for CI, ACP for editors, competing head-on with Claude Code
- **Image/video generation** → Imagine ($0.02–$0.08) — same account, same API, same distribution as text reasoning
- **X / Tesla ecosystem** → If your product already lives in the X or Tesla stack, Grok has the lowest integration friction
- **High-throughput / cost-sensitive** → Grok 4 Fast's 98% delta + 2M is the most aggressive value play today; for well-defined bug fixes DeepSeek V4 Pro (SWE-bench 96.4%, ultra-low cost) remains an option
- **Local / private deployment** → Only Grok-1 is self-hostable; private use goes through the xAI API / official deployment — factor in vendor lock-in and the >200K doubling

Pragmatic mix-and-match:

| Task | Recommendation | Why |
|---|---|---|
| Long reasoning / research | Grok 4 Fast 2M or Grok 4.6 500K | 2M/500K + four tunable reasoning levels |
| Terminal coding agent | Grok Build + grok-build-0.1 | Auditable, embeddable harness |
| Image/video generation | Imagine image 2.0 / video 1.5 | One xAI account end-to-end |
| Well-defined bug fix | DeepSeek V4 Pro | SWE-bench 96.4%, ultra-low cost |
| Complex agentic orchestration | Claude Opus 5 / GPT-5.6 Sol | Agentic stability still ahead of Grok |
| Local deployment | Qwen3.8-27B / Gemma 3 27B | No current open Grok flagship |

## Overall

Grok's story is "catch up with distribution and compute." xAI proved good faith by open-sourcing 314B, then bet everything on Colossus RL scaling and distribution through X / Tesla / Bedrock — the model as a traffic entry point for the Elon system. By 2026 Grok is no longer a single model but a quartet: 4.6 at 500K, 4 Fast at 2M, Imagine for images, Build for the terminal.

The price is openness and the hard-coding gap. No open flagship, Build opens the harness not the model; HLE/ARC-AGI highlights aside, it still trails GPT-5.6 and Claude on SWE-bench / Terminal-Bench engineering boards. That defines Grok's pragmatic fit: **the default inside its distribution, the long-context value king, the second choice for terminal-native agents** — not a replacement for the strongest coding model.

---

## References

- [xAI Official Site](https://x.ai)
- [Announcing Grok — xAI Blog](https://x.ai/blog/grok) — Nov 3, 2023 debut
- [Open Release of Grok-1 — xAI](https://x.ai/blog/grok-1) / [xai-org/grok-1 — GitHub](https://github.com/xai-org/grok-1) — 314B MoE, Apache 2.0
- [Grok-1 — HuggingFace (xai-org/grok-1)](https://huggingface.co/xai-org/grok-1) — 314B, Apache 2.0
- [Announcing Grok-1.5 — xAI Blog](https://x.ai/blog/grok-1.5) — 128K, NIAH
- [Grok-1.5 Vision Preview — xAI Blog](https://x.ai/blog/grok-1.5v) — First multimodal
- [Grok-2 Beta Release — xAI Blog](https://x.ai/blog/grok-2) — Grok-2 / mini, LMSYS
- [Grok 3 Beta — The Age of Reasoning Agents — xAI Blog](https://x.ai/blog/grok-3) — 1M, Elo 1402, 10× Colossus
- [Grok 4 — xAI News](https://x.ai/news/grok-4) — 256K, Heavy, HLE/ARC-AGI
- [Grok Code Fast 1 — xAI News](https://x.ai/news/grok-code-fast-1) — Terminal/editor coding
- [Grok 4 Fast — xAI News](https://x.ai/news/grok-4-fast) — 2M, 98% price delta, 40% fewer thinking tokens
- [xAI Docs — Models](https://docs.x.ai/developers/models) — Current model catalog, contexts, reasoning levels
- [xAI Docs — Pricing](https://docs.x.ai/docs/pricing) — Full pricing, >200K doubling, batch
- [Grok 4.6 — xAI Docs](https://docs.x.ai/docs/models/grok-4.6) — 500K, $2/$6
- [Grok Build 0.1 — xAI Docs](https://docs.x.ai/docs/models/grok-build-0.1) — 256K, $1/$2
- [Grok Imagine Image 2.0 — xAI Docs](https://docs.x.ai/docs/models/grok-imagine-image-2.0) — $0.04
- [Grok Build — GitHub (xai-org/grok-build)](https://github.com/xai-org/grok-build) — 26k stars, Apache 2.0, TUI/ACP
- [Grok Build Plugin CC — GitHub](https://github.com/xai-org/grok-build-plugin-cc) — Claude Code plugin
- [Grok Build Overview — xAI Docs](https://docs.x.ai/build/overview) — Three run modes, ACP
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — This site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — This site
