---
title: "Kimi: From a 200K Long-Context Tool to a 2.8T Open-Weight Frontier — K3.1 Pro Cuts Prices and Ships Weights on Schedule"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, kimi, moonshot-ai, model-family-kimi, long-context, reasoning, moe, open-source, model-selection]
lang: en
type: deep-dive
tldr: "Kimi is Moonshot AI's model family, born from ultra-long context. The current flagship, Kimi K3.1 Pro (API on 2026-10-23, weights on 11/4), is a post-trained version of K3: 2.8T total parameters, 104B active, 1M context, with API prices cut to $2/$10 — a third below K3. It self-reports 65.7 on Terminal-Bench 4.0, close to Claude Opus 5.5. The weights use the custom Kimi K3.1 Pro License: ordinary products and internal use are free for commercial use, but Model-as-a-Service businesses with group revenue above US$20M need a separate agreement. This post covers the family's evolution, the KDA and Gated DSA architecture, pricing and licensing, and how to choose."
description: "A guide to the Kimi (Moonshot AI) model family: K3.1 Pro and Highspeed specs and pricing, the K3→K3.1 architecture changes (KDA, Gated DSA, AttnRes, Stable LatentMoE), the Kimi K3 / K3.1 Pro License terms, the K2 retirement schedule, the 2023→2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 9
draft: false
glossary:
  - term: "Agent Swarm"
    definition: "Kimi's multi-agent execution scheme since K2.5: a router splits a task across many parallel sub-agents and merges the results. Up to 100 sub-agents in K2.5, extended to 300 in K2.6"
  - term: "Kimi Delta Attention"
    aliases: ["KDA"]
    definition: "Kimi's linear attention layer, which handles long sequences with a fixed-size state so compute grows linearly with length. 69 of the 93 layers in the K3 series are KDA; the rest keep full or sparse attention for global interaction"
  - term: "Gated DSA"
    aliases: ["Gated DeepSeek Sparse Attention"]
    definition: "The sparse attention that K3.1 Pro uses in place of K3's full-attention Gated MLA layers: an indexer picks the top 2,048 relevant positions per query before attention runs, lowering long-context cost"
  - term: "Attention Residuals"
    aliases: ["AttnRes"]
    definition: "Lets each layer selectively retrieve representations from all earlier layers instead of accumulating them uniformly, improving information flow across model depth"
  - term: "Stable LatentMoE"
    definition: "The K3 series' sparse MoE framework: 896 routed experts with 16 active per token plus 2 shared experts, using Quantile Balancing and SiTU-GLU to train stably at extreme sparsity"
  - term: "MoonViT-V2"
    definition: "The K3 series' 401M-parameter vision encoder, not initialized from a contrastively pretrained model such as SigLIP"
---

> 🌏 [繁體中文版](/posts/tech/2026-08-24-ai-model-family-kimi)

Kimi is Moonshot AI's model family. In 2023 it didn't rush to build a "Chinese ChatGPT" — it bet on ultra-long context instead, and by 2026 that path had led to a 2.8T-parameter open-weight flagship. This post is for agent developers choosing within Kimi: K3.1 Pro versus Highspeed, whether to self-host, which commercial uses the license restricts, and when anyone still on the K2 series has to migrate.

As of November 2026, both the API and the weights have moved to K3.1 Pro. It is a post-trained version of K3, priced a third lower, and its weights landed on HuggingFace on 11/4 as promised. The K2 series has been closed to new sign-ups since 10/31 and is expected to retire fully by the end of December.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This post is one of the family deep dives in the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Prices per 1M tokens, checked on 2026-11-20 against [Kimi's official pricing guide](https://www.kimi.ai/resources/kimi-k3-1-pro-pricing), the [Kimi API model list](https://platform.kimi.ai/docs/models), and the HuggingFace model cards:

| Model / line | Role | Key difference | Access and price |
|---|---|---|---|
| Kimi K3.1 Pro (`kimi-k3.1-pro`) | Current flagship | Post-trained K3, 2.8T / 104B active, 1M context, text + image input, thinking cannot be turned off | API: $2/$10, cache hit $0.20; open weights (Kimi K3.1 Pro License) |
| Kimi K3.1 Pro Highspeed (`kimi-k3.1-pro-highspeed`) | Latency-sensitive interaction | About 2–3× faster per Moonshot | API only: $4/$20, cache hit still $0.20; no separate weights |
| Kimi K3 (`kimi-k3`) | Previous flagship | Full-attention layers use Gated MLA | API: $3/$15, cache hit $0.30; open weights (Kimi K3 License) |
| Kimi K2.6 / K2.7 Code | Retiring | 1T / 32B active, 262K context | Closed to new users since 10/31; retirement expected end of December 2026 |
| Kimi Code / Kimi Work / Kimi.ai | Official products | Terminal coding agent, desktop work assistant, chat app | Subscription or free plans, billed separately from the API |

Every K3-series model has a 1,048,576-token context with no context-length price tiers. The Batch API supports K3.1 Pro and K3 at 60% of the standard price.

### Two product lines: open weights and API

**The open-weight line** (`moonshotai` on HuggingFace): K2 through K2.7 Code used Modified MIT; from K3 on, the license is custom (see "Licensing, pricing, and deployment"). Moonshot itself consistently says "open weight" rather than "open source." Both K3 and K3.1 Pro shipped on the API first and released weights about ten days later: K3's weights came out on its [July 27 open day](https://www.kimi.com/news/kimi-k3-open-source), together with the technical report and training infrastructure such as MoonEP, FlashKDA, and AgentEnv; K3.1 Pro promised weights "by Nov 4" at launch and [delivered on time](https://huggingface.co/moonshotai/Kimi-K3.1-Pro).

**The API line** (platform.kimi.ai): compatible with OpenAI and Anthropic formats, with Zero Data Retention available. Third parties such as AWS Bedrock and Cloudflare also host K3.1 Pro; section 4 of the license exempts use "accessed through Moonshot AI's official products or certified inference partners."

### Sub-lines and ecosystem

| Sub-line | Representative models | Status (2026-11) |
|---|---|---|
| Main line | K1.5 → K2 → K2.5 → K2.6 → K3 → **K3.1 Pro** | K3.1 Pro is the flagship; K3 is still offered |
| Coding | Kimi-Dev (72B) → K2.7 Code | K2.7 Code retires with the K2 series; coding moves to the K3 main line |
| Vision-language | Kimi-VL (16B MoE) → native multimodal main line | The K3 series natively accepts images |
| Linear-attention experiment | Kimi Linear (48B MoE, 3B active) | Small-scale validation of KDA, later promoted to the K3 main-line architecture |
| Reasoning | K1.5 → K2 Thinking | Thinking folded into the main line; K3.1 Pro always thinks |
| Official products | Kimi Code CLI, Kimi Work, Kimi.ai, 3D Make | Switched to K3.1 Pro at launch |

Two trends:

**Capabilities are being folded into the main line.** K2.7 Code was the last standalone coding model; from K3 on, coding, vision, and reasoning all live in the main line.

**The license moved from an attribution clause to a revenue threshold.** K2's Modified MIT only required large products to display the model name; K3 added a separate-agreement clause aimed at Model-as-a-Service businesses.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Kimi Chat | 2023-10 | 200K Chinese-character context; the long-context origin | — |
| Kimi K1.5 | 2025-01 | RL reasoning, Long CoT, multimodal reasoning | — |
| Kimi-VL / Kimi-Dev | 2025-04 / 06 | A small open vision-language model and a 72B coding model, giving specialist tasks their own options | — |
| Kimi K2 | 2025-07 | 1T MoE (32B active), MuonClip optimizer, open weights under Modified MIT; self-hosting options reach the trillion-parameter scale | — |
| K2 Thinking | 2025-11 | 256K context, long tool-call chains | — |
| Kimi K2.5 | 2026-01-27 | Native multimodal, Agent Swarm (up to 100 sub-agents) | — |
| Kimi K2.6 | 2026-04-20 | Long-horizon coding; Agent Swarm scaled to 300 sub-agents | — |
| Kimi K2.7 Code | 2026-06-12 | Coding-focused, about 30% fewer thinking tokens than K2.6 | — |
| Kimi K3 | mid-2026-07 (API) / 07-27 (weights) | 2.8T / 104B, 1M context, KDA + AttnRes; the first open-weight 3T-class model, but now under the Kimi K3 License with a revenue threshold; $3/$15 | — |
| **Kimi K3.1 Pro** | 2026-10-23 (API) / 11-04 (weights) | Same skeleton with sparse attention and much larger post-training, a third cheaper; Terminal-Bench 4.0 close to Claude Opus 5.5 | [Model card](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro-en) |

The first half of the story was "differentiate on long context." From 2025 it became "scale and architecture together": K2 pushed open weights to 1T, then K3 pushed them to 2.8T with a new architecture. K3 is now the previous generation in this post; its full evaluation table remains on its [HuggingFace model card](https://huggingface.co/moonshotai/Kimi-K3) and [official blog](https://www.kimi.ai/blog/kimi-k3), and the update history below records what moved out.

## Architecture and training trade-offs

### The K3-series skeleton

Per the [K3](https://huggingface.co/moonshotai/Kimi-K3) and [K3.1 Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro) model cards, the two share one skeleton: 93 layers (1 dense), 896 routed experts with 16 active per token plus 2 shared, a 160K vocabulary, and the MoonViT-V2 vision encoder (401M).

- **Kimi Delta Attention (KDA)**: 69 of the 93 layers are KDA, handling long sequences with a fixed-size state so that 1M context stays affordable.
- **Attention Residuals (AttnRes)**: each layer selectively retrieves earlier layers' representations rather than accumulating them uniformly, improving information flow across 93 layers of depth.
- **Stable LatentMoE**: experts are allocated directly from router-score quantiles (Quantile Balancing), removing a sensitive balancing hyperparameter; Per-Head Muon optimizes attention heads independently.
- **Quantization-aware training**: MXFP4 weights and MXFP8 activations from the SFT stage onward, so the released weights are already quantized — about 1.56TB.

The [K3 blog](https://www.kimi.ai/blog/kimi-k3) says these changes plus the training recipe improve overall scaling efficiency by about 2.5× over K2. That figure is self-reported by Moonshot.

### K3 → K3.1 Pro: new attention, more post-training

K3.1 Pro changes the architecture in one place: the remaining 24 layers switch from full-attention Gated MLA to sparse **Gated DSA** (DeepSeek Sparse Attention), where each query attends only to the top 2,048 positions picked by an indexer, to lower long-context cost.

The rest of the gains come from post-training. The [K3.1 Pro blog](https://www.kimi.ai/blog/kimi-k3-1-pro) describes joint reinforcement learning across hundreds of downstream domains with substantially more compute, for which Moonshot rebuilt its RL framework, sandboxes, and rollout scheduling. So the gap between K3.1 Pro and K3 is mostly behavior (coding, factual accuracy, finance workflows), not scale.

### Deliberately lowering cyber capability before release

The K3.1 Pro blog discloses an unusual trade-off: Moonshot traced offensive cyber capability to security content mixed into the general mid-training corpus and RL environments, and removed that data for the open-weight release. On its internal xdev-bench-hard, a checkpoint without the removal solved 90.5% (pass@3); the released model solves 81.0%. Moonshot's stated principle is not to let open weights extend the absolute frontier of cyber capability. For teams building defensive security tools, this means K3.1 Pro deliberately trails closed frontier models on such tasks.

## Evaluation and alternatives

### Where K3.1 Pro lands

From the comparison table on the [K3.1 Pro model card](https://huggingface.co/moonshotai/Kimi-K3.1-Pro); K3.1 Pro always runs at `max` reasoning effort, and most closed-model scores are cited from vendor reports or leaderboards, marked "w/ fallback":

| Benchmark | K3.1 Pro | Claude Opus 5.5 | GPT-6 Astra | Note |
|---|---|---|---|---|
| Terminal-Bench 4.0 | 65.7 | 66.4 | 58.2 | Claude Code harness |
| DeepSWE v1.1 | 75.5 | 74.2 | 74.1 | |
| SWE Marathon v1.1 | **51.7** | 46.3 | 42.5 | Long-horizon coding |
| ProgramBench | 31.5 | **65.0** | 50.0 | Native coding; the widest gap |
| HLE-Full w/ tools | **70.0** | 67.7 | 57.2 | |
| HLE-Full (no tools) | 51.1 | **59.8** | 53.6 | |
| OfficeQA Pro v2 | **64.4** | 62.2 | 54.4 | Financial document analysis |
| GDPval-AA v2.1 (Elo) | 1846 | **1866** | 1573 | Artificial Analysis |
| Kimi Hallu Bench Hard w/ tools (lower is better) | 8.3 | 15.0 | **5.5** | Internal |

How to read this table: on long-horizon coding, tool-assisted knowledge work, and financial analysis, K3.1 Pro matches or beats Claude Opus 5.5; on tool-free reasoning (HLE) and native coding (ProgramBench) it still trails clearly.

Caveats:

- **Same benchmark, different sources.** The 65.7 on Terminal-Bench 4.0 is Moonshot's own run; the [site's model card](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro-en) records Artificial Analysis's independent result as 67%, and Alibaba's Qwen4-Max chart lists 67.2. Harnesses and settings differ, so these can't be converted into one another.
- **Internal benchmarks are not external evidence.** Kimi Code Bench and Hallu Bench are Moonshot's own.
- **Cost isn't just the unit price.** The Artificial Analysis result cited in the site's model card shows K3.1 Pro using about 14% more output tokens per task, so after the one-third price cut the cost per task is roughly flat.

### Position against competitors

- **Against Claude Opus 5.5 ($4/$20)**: close on coding agents and tool-assisted tasks at about half the price; behind on pure reasoning and ProgramBench. When you need self-hosting or data sovereignty, K3.1 Pro is one of the few open-weight options at this level.
- **Against Qwen4-Max ($1.50/$4.50)**: Qwen4-Max is cheaper but has no open weights; K3.1 Pro leads clearly on Terminal-Bench 4.0 (see the [Qwen family post](/posts/tech/2026-08-24-ai-model-family-qwen-en)).
- **Against GLM and DeepSeek**: both have more permissive open-weight licenses (see the [GLM family post](/posts/tech/2026-08-24-ai-model-family-glm-en) and [DeepSeek family post](/posts/tech/2026-08-24-ai-model-family-deepseek-en)); in the model card's table, DeepSeek-V4.1-Flash and GLM-5.3 trail K3.1 Pro on most coding items.

## Licensing, pricing, and deployment

### Kimi K3 / K3.1 Pro License: a permissive base with two thresholds

The K3 and K3.1 Pro LICENSE files are identical apart from the model name ([K3](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE), [K3.1 Pro](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE)). The base is an MIT-style grant — use, modify, distribute, sell, fine-tune, and create derivatives — with two conditions:

1. **Model-as-a-Service threshold**: if you operate a MaaS business (an inference or fine-tuning service, such as an API, that lets third parties meaningfully control inputs, parameters, or training data) and your combined revenue with affiliates exceeds US$20M over any 12 months, you need a separate agreement with Moonshot before commercial use. End-user products that only embed the model within specific features, and simple relaying to models hosted by others, are not MaaS.
2. **Display the model name**: commercial products above 100M monthly active users or US$20M in monthly revenue must prominently display "Kimi K3" or "Kimi K3.1-Pro" in the UI.

Neither condition applies to purely internal use (not exposing the software, its outputs, or its capabilities to third parties), or to use through Moonshot's official products or certified inference partners.

In practice: banks, brands, and SaaS companies embedding it in customer service or product features are mostly unaffected; cloud providers and API resellers need to negotiate first. Note that revenue counts the licensee plus affiliates, so a small team inside a large group can cross the threshold. For comparison, the Qwen3.8-Max License threshold is US$50M; the K3 series' US$20M is lower.

### Pricing highlights

| Item | K3.1 Pro | K3.1 Pro Highspeed | K3 (previous) |
|---|---|---|---|
| Input | $2.00 | $4.00 | $3.00 |
| Output | $10.00 | $20.00 | $15.00 |
| Cache hit | $0.20 | $0.20 | $0.30 |
| Cache write (5-min / 1-hour TTL) | $2.00 / $4.00 | $4.00 / $8.00 | $3.00 / $6.00 |

- Caching is on by default with a 5-minute TTL; cached input is billed only at the cache-hit price, with no extra write charge.
- Highspeed's cache-hit price matches the standard model, so for workloads that reuse long prefixes, Highspeed's real premium is less than 2×.
- K3.1 Pro always thinks; `reasoning_effort` takes `low`/`high`/`max`, defaulting to `max`; `max_completion_tokens` defaults to 131,072 and can go up to 1,048,576. Image input doesn't accept public URLs — use base64 or an uploaded file ID ([K3.1 Pro quickstart](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)).

### Retirement schedule

Per the [Kimi API model list](https://platform.kimi.ai/docs/models) and [pricing page](https://platform.kimi.ai/docs/pricing/chat): `kimi-k2.6`, `kimi-k2.7-code`, and `kimi-k2.7-code-highspeed` have been closed to new sign-ups since 2026-10-31 (existing users unaffected), with full retirement expected at the end of December 2026; Moonshot recommends migrating to K3.1 Pro. `kimi-k2.5`, the `moonshot-v1` series, `kimi-k2-thinking`, and other older models are already deprecated.

### Self-hosting

K3.1 Pro's weights are about 1.56TB (MXFP4), and Moonshot recommends vLLM, SGLang, or TokenSpeed. That is a multi-GPU server spec, not a workstation; for most teams the API or a third-party host is cheaper.

## Agent integration and selection

- **Long-horizon coding agents, with a need for open weights or data sovereignty** → K3.1 Pro. Terminal-Bench 4.0, SWE Marathon, and DeepSWE are all near Claude Opus 5.5 at about half the price; Moonshot publishes results with both Kimi Code and the Claude Code harness.
- **Interactive coding where users wait on responses** → K3.1 Pro Highspeed, at twice the unit price but the same cache-hit price.
- **Large non-real-time workloads** → the Batch API at 60% of standard price.
- **Native coding or tool-free hard reasoning as the main workload** → K3.1 Pro is not the first pick; ProgramBench and HLE trail Claude Opus 5.5 clearly.
- **Still on K2.6 / K2.7 Code** → migrate before the end of December; the K3 series always thinks, so latency and output tokens differ from K2 — re-measure costs first.
- **Reselling on an API platform or cloud** → check whether you fall under the MaaS revenue threshold before choosing K3.1 Pro over a more permissively licensed GLM.
- **Citing scores** → state whether it's Moonshot's own run or an Artificial Analysis measurement, plus the harness and reasoning effort.

## Limitations and trade-offs

- **The weights are too large for most people to self-host.** 1.56TB of quantized weights needs multi-GPU servers, so the practical benefit of open weights goes mainly to cloud teams and researchers.
- **Thinking cannot be turned off.** Even simple tasks spend reasoning tokens; `reasoning_effort: low` is the only lever.
- **The license is not MIT.** The MaaS revenue threshold is lower than Qwen's flagship license and counts group revenue.
- **Cyber capability is deliberately reduced.** If defensive security research needs frontier capability, K3.1 Pro is not the first pick.
- **Most evaluations are self-reported.** Closed-model scores in the model card mostly come from vendor reports, under conditions that don't fully match.

Kimi's story is "a neglected direction grew into an open-weight frontier": from a 200K long-context chatbot to K3.1 Pro, with 2.8T parameters, about half the price of Claude Opus 5.5, and close coding-agent scores. The thing to remember is the license: ordinary products can use it with confidence, but it isn't MIT, and API businesses need to check the threshold first.

## Update history

- **2026-11-20**: Added the K3.1 Pro generation. The matrix, architecture, evaluation, pricing, and selection were rewritten for K3.1 Pro / Highspeed (Kimi official blog, API docs, pricing guide, HuggingFace model cards and LICENSE files, read 2026-11-20); added the K3→K3.1 attention change, the decision to remove cyber data before release, a clause-by-clause license explanation, and the K2 retirement schedule. K3 is now the previous generation; the earlier K3 evaluation table moved out of the body, with full numbers on its HuggingFace model card and official blog. The timeline now has four columns and adds dates for K2.5, K2.6, and K2.7 Code. Corrections: the MoonViT-V2 section wrongly attributed a finding to Zhipu — it was Moonshot; the K3 table's "ProgramBench 7x" and an unverifiable Intelligence Index score of 60 were removed; the earlier text treated K2.5 as K3's predecessor and said it would be removed on 8/31, but K2.6 and K2.7 Code also exist and the K2 series retires fully only at the end of December; a reference labeled HuggingFace actually pointed to GitHub and now points to the HuggingFace model card.
- **2026-10-11**: Reorganized sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [Kimi K3.1 Pro Tech Blog: Advancing Open Intelligence — official blog](https://www.kimi.ai/blog/kimi-k3-1-pro)
- [moonshotai/Kimi-K3.1-Pro — HuggingFace model card](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)
- [Kimi K3.1-Pro License — HuggingFace](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE)
- [Kimi K3.1 Pro Pricing — Kimi official](https://www.kimi.ai/resources/kimi-k3-1-pro-pricing)
- [Kimi K3.1 Pro quickstart — Kimi API docs](https://platform.kimi.ai/docs/guide/kimi-k3-1-pro-quickstart)
- [Model List — Kimi API docs](https://platform.kimi.ai/docs/models)
- [Model Inference Pricing — Kimi API docs](https://platform.kimi.ai/docs/pricing/chat)
- [Platform Changelog — Kimi API docs](https://platform.kimi.ai/docs/platform-changelog)
- [Kimi K3: Open Frontier Intelligence — official blog](https://www.kimi.ai/blog/kimi-k3)
- [Kimi K3 open day: weights, technical report, and key infra released — Kimi official (Chinese)](https://www.kimi.com/news/kimi-k3-open-source)
- [moonshotai/Kimi-K3 — HuggingFace model card](https://huggingface.co/moonshotai/Kimi-K3)
- [Kimi K3 License — HuggingFace](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE)
- [Kimi K3 technical report — arXiv:2607.24653](https://arxiv.org/html/2607.24653v2)
- [Kimi K1.5 technical report](https://arxiv.org/abs/2501.12599)
- [Kimi K2 technical report](https://arxiv.org/abs/2507.20534)
- [Kimi Code What's New (K2.7 Code release)](https://www.kimi.com/code/docs/en/kimi-code/whats-new.html)
- [Kimi K3's full weights are here, but they're 'open' with a caveat — VentureBeat](https://venturebeat.com/technology/kimi-k3s-full-weights-are-here-but-theyre-open-with-a-caveat-what-enterprises-should-know)
- [Model card: Kimi K3.1 Pro](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro-en) — this site
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
