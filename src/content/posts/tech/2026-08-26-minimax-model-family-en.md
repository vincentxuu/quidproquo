---
title: "MiniMax: The Chat App Company That Built a Low-Cost Agent Model — M3.1 Flash Drops to $0.15/$0.60"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, moe, code-model, benchmark, pricing, china-ai, agentic-coding]
lang: en
series:
  name: "AI Model Families"
  order: 14
tldr: "MiniMax started with character-chat and video-generation apps, and in 2026 its M-series language models broke into agentic coding. The current workhorse, M3.1 Flash (2026-10-19), keeps M3's 428B / 23B-active MoE and 1M context at just $0.15/$0.60 on the API, with $0.015 cache reads. On MiniMax's own table it leads on enterprise automation (Automation-Bench) but trails on terminal work and some coding items, and independent tests question its hallucination rate. The weights are open, but the MiniMax Community License grants non-commercial use at its core; commercial use requires attribution plus a notice or written authorization. This post covers the family's evolution, MSA sparse attention, pricing and licensing, and how to choose."
description: "A guide to the MiniMax model family: M3.1 Flash and M3 specs and pricing, MiniMax Sparse Attention, the M2→M3 evolution, MiniMax Community License commercial conditions, the H3 video and H3-Image sub-lines, and agent selection."
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts — a model with many parameter groups that activates only some of them per token, balancing capability and efficiency"
  - term: "MSA"
    def: "MiniMax Sparse Attention, MiniMax's block-sparse attention: a lightweight Index Branch picks the top-k KV blocks for each GQA group, and the Main Branch runs exact attention only over the selected blocks"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark — a standard test set that measures how well models resolve real GitHub issues"
---

> :globe: [繁體中文版](/posts/tech/2026-08-26-minimax-model-family)

MiniMax didn't start as a model company. It built a character-chat app ([Talkie](https://www.talkie-ai.com/)) and video generation ([Hailuo AI](https://hailuoai.video/)). In February 2026, M2.5 scored 80.2% on SWE-bench Verified at a fraction of closed flagships' prices, and MiniMax became a low-cost option for coding agents.

This post is for agent developers evaluating MiniMax: whether to use M3.1 Flash or M3 today, which tasks it is worth trying on, what commercial use the weight license allows, and where the same company's video and image models fit.

## Family positioning and model matrix

Prices per 1M tokens, checked on 2026-11-20 against the [MiniMax pricing page](https://platform.minimax.io/docs/guides/pricing) and [model list](https://platform.minimax.io/docs/guides/models-intro):

| Model / line | Role | Key difference | Access and price |
|---|---|---|---|
| MiniMax-M3.1-Flash | Current language workhorse | 428B total / 23B active, 1M context, text/image/video input; sparse attention throughout | API: $0.15/$0.60, cache read $0.015; open weights (MiniMax Community License) |
| MiniMax-M3 | Previous flagship | Same scale, thinking can be switched on or off | API: $0.30/$1.20 up to 512K (list $0.60/$2.40, marked "permanent 50% off"), doubled above 512K; open weights |
| MiniMax-H3 series | Video generation | Generates video from text/image/video/audio references, 768P/2K | Billed per second; see the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en) |
| MiniMax-H3-Image | Image generation and editing | 33.1B diffusion transformer, up to 16 reference images | Billed by tokens, about $0.022 per 1K image; open weights, license excludes some regions (see the [model card](/posts/daily/2026-11-16-model-minimax-h3-image-en)) |
| MiniMax Code / Token Plan | Official products | Coding agent and subscription plans | Billed separately from the API |

M2.5 and M2.7 no longer appear on the official language-model list or pricing page; new projects should start with the M3 series.

## Family evolution

### Company background

MiniMax was founded in Shanghai in December 2021 by Yan Junjie, who came from SenseTime. It listed on the Main Board of the Hong Kong Stock Exchange on January 9, 2026 (stock code 0100).

Per its [2025 annual results announcement](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0302/2026030202837.pdf), 2025 revenue was US$79.04M (up 159%), with 73% coming from outside mainland China. The loss for the year was US$1.87B, but US$1.59B of that was a fair-value loss from rising preferred-share valuations; the adjusted net loss was about US$250M. About two-thirds of revenue came from AI-native products such as Hailuo, and one-third from the open platform and enterprise services.

Why would a consumer AI company build coding models? To make chat, role-play, and video products genuinely useful, the underlying model needs strong reasoning and tool use, and coding is the foundation of agentic capability.

### Timeline

From the [MiniMax model release notes](https://platform.minimax.io/docs/release-notes/models):

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| MiniMax-Text-01 / VL-01 | 2025-01-15 | First in-house flagship LLM and vision-language model | — |
| MiniMax-M2 | 2025-10-27 | The M series debuts, focused on agentic efficiency | — |
| MiniMax-M2.1 | 2025-12-22 | Multilingual programming and refactoring | — |
| MiniMax-M2.5 / highspeed | 2026-02 | 80.2% on SWE-bench Verified at a fraction of closed-flagship prices; becomes a low-cost coding-agent option | — |
| MiniMax-M2.7 / highspeed | 2026-03-18 | Pitched as "the model participating in its own evolution"; 56.2% on SWE-Pro | — |
| MiniMax-M3 | 2026-06-01 | 428B / 23B, MSA sparse attention, 1M context, native multimodal; weights opened in mid-June | — |
| MiniMax-H3 | 2026-07-31 | Open-weight multimodal video model | See the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en) |
| **MiniMax-M3.1-Flash** | 2026-10-19 (API) / 10-23 (weights) | Same scale with sparse attention throughout and quantization-aware training, at about half M3's unit price | [Model card](/posts/daily/2026-10-20-model-minimax-m3-1-flash-en) |
| MiniMax-H3-Image | 2026-11-10 | Open-weight image generation and editing | [Model card](/posts/daily/2026-11-16-model-minimax-h3-image-en) |

M2.5 and M3 are now history in this post. Full numbers — M2.5's 80.2% on SWE-bench Verified, M3's 59 on SWE-bench Pro and 80.5 on Verified, and more — remain on the [M2.5](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) and [M3](https://huggingface.co/MiniMaxAI/MiniMax-M3) HuggingFace model cards.

## Architecture and training trade-offs

### MSA: making 1M context cheap

The [M3 announcement](https://www.minimax.io/blog/minimax-m3) and the [MSA paper](https://arxiv.org/html/2606.13392) describe the core design: MSA builds on GQA, a lightweight Index Branch picks the top-k KV blocks for each query and GQA group, and the Main Branch runs exact attention only over the selected blocks. The implementation loops over KV blocks on the outside and gathers the queries that hit each one, so every block is read once with contiguous memory access.

Official figures: at 1M context, M3's per-token compute is 1/20 of M2's, with 9× faster prefill and 15× faster decode; across most ablations MSA matched full attention. The paper also reports a 28.4× reduction in per-token attention compute on a 109B model. All of these are MiniMax's own measurements.

### M3 → M3.1 Flash: three changes

Per the [M3.1 Flash model card](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash), it keeps M3's MoE skeleton and changes three things:

- **Sparse attention throughout**: M3's first three full-attention layers are also replaced with sparse attention.
- **Quantization-aware training**: routed experts and attention paths are quantized during training, cutting memory and serving cost.
- **DSpark speculative decoding**: replaces M3's EAGLE-like MTP approach, and the weights ship with the draft head.

One behavioral difference: M3's thinking can be set to `enabled`, `adaptive`, or `disabled`; M3.1 Flash can only adjust `reasoning_effort` across five levels from low to max and cannot turn thinking off.

### Native multimodality and training

M3 mixes text, images, and video from the first training step; the [NVIDIA technical blog](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/) records about 100 trillion interleaved tokens. On the RL side, the [M2.5 model card](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) says it trained across more than 200,000 real environments and over 10 programming languages, and observed an emergent tendency to write an architecture spec before coding; with [M2.7](https://huggingface.co/MiniMaxAI/MiniMax-M2.7), an internal version improved its own RL experiment workflow and coding scaffold.

## Evaluation and alternatives

### Where M3.1 Flash lands

From the [M3.1 Flash model card](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash); all scores are MiniMax's own runs, and most rivals are the versions current at release:

| Benchmark | M3.1 Flash | DeepSeek V4.1 Flash-1017 | Kimi K3 | Claude Opus 5 |
|---|---|---|---|---|
| Automation-Bench v1.0.6 (enterprise automation) | **62.8** | 60.5 | 46.7 | 50.3 |
| BankerToolBench | **76.2** | — | 69.1 | **76.2** |
| LOCA-Bench 256K (long context) | **60.3** | — | 49.7 | 53.7 |
| DeepSWE v1.1 | 73.7 | **77.0** | 67.5 | 74.0 |
| Terminal Bench 4.0 | 38.1 | 42.3 | 12.6 | **51.8** |
| NL2Repo-Bench | 61.2 | 68.2 | 58.0 | **75.3** |
| OSWorld 2.0 | 61.7 | — | 58.3 | **70.6** |
| HLE (no tools) | 43.4 | 42.6 | 43.5 | **55.6** |

How to read this table: enterprise automation, finance tooling, and long-context tasks are strengths; terminal work, whole-repo generation, and computer use trail Claude Opus 5. Note that the rivals are Kimi K3 and Opus 5, not the later K3.1 Pro and Opus 5.5.

### The reliability dispute

The [site's model card](/posts/daily/2026-10-20-model-minimax-m3-1-flash-en) records two third-party results pointing in opposite directions: VentureBeat, citing Artificial Analysis's AA-Omniscience, reports a 93% hallucination rate under that benchmark's definition because M3.1 Flash almost never abstains; in The New Stack's factual-QA test it answered 56% correctly, ahead of DeepSeek V4.1 Flash. MiniMax's own table has no reliability metric at all. Test it yourself before using it in workflows that need factual accuracy.

### Position against competitors

- **Against DeepSeek V4.1 Flash**: DeepSeek leads on DeepSWE, Terminal Bench, and NL2Repo; M3.1 Flash is cheaper per token and scores higher on Automation-Bench. DeepSeek's weight license is more permissive (see the [DeepSeek family post](/posts/tech/2026-08-24-ai-model-family-deepseek-en)).
- **Against Kimi K3.1 Pro ($2/$10)**: K3.1 Pro scores much higher on coding agents, at roughly 13–17× the unit price (see the [Kimi family post](/posts/tech/2026-08-24-ai-model-family-kimi-en)).
- **Against [Ornith](/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en)**: both target low-cost coding; Ornith uses self-improvement RL, MiniMax uses large-scale environment RL.

## Licensing, pricing, and deployment

### MiniMax Community License: attribution and notice for commercial use

M3 and M3.1 Flash both use the MiniMax Community License ([M3.1 Flash LICENSE](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/raw/main/LICENSE)). Its structure differs from Kimi's and Qwen's custom licenses:

- **The grant itself covers non-commercial purposes**: use, modify, and distribute.
- **Commercial conditions**: products or services must prominently display "Built with MiniMax M3.1-Flash" on a website, UI, blog post, about page, or documentation. If the product or service earns US$20M or less per year, a one-time notice email to MiniMax is enough; above US$20M, prior written authorization is required.
- **"Commercial use" is defined broadly**: paid products or services for third parties, commercial API use, and deploying fine-tuned or post-trained derivatives all count.
- **A prohibited-uses appendix**: including any military purpose, harming minors, and false information intended to cause harm.

In practice: small teams using it commercially mostly need attribution plus a notice; high-revenue products need to negotiate first. Compared with Kimi, MiniMax's threshold counts the revenue of "such products and services" rather than the whole group, but there is no internal-use exemption. H3-Image's license additionally excludes deployment and use in the US, EU, UK, and South Korea, so check separately when choosing an image model.

### Pricing highlights

- **M3.1 Flash**: $0.15/$0.60, cache read $0.015, no context-length tiers.
- **M3**: $0.30/$1.20 up to 512K input and $0.60/$2.40 above 512K (already including the official "permanent 50% off"); the `priority` service tier is 1.5× the standard price.
- **Task cost**: MiniMax says M3.1 Flash's weighted average agentic task cost fell from $0.51 for M3 to $0.22 (see the site's model card) — a self-reported figure.

### Self-hosting

M3.1 Flash's weights are about 250GB; MiniMax recommends SGLang, vLLM, or TokenSpeed, with FlagOS for multi-chip deployment. The model card says 428B total parameters while HuggingFace metadata shows a smaller count (about 220B); MiniMax hasn't explained the difference, which may relate to the quantized format.

## Agent integration and selection

- **High-volume enterprise automation, finance tooling, and long documents on a budget** → M3.1 Flash. Its unit price is the lowest tier among open-weight models of its class, and it leads on Automation-Bench and LOCA-Bench.
- **Primary workload is a coding agent or terminal work** → compare DeepSeek V4.1 Flash or Kimi K3.1 Pro first; M3.1 Flash trails on Terminal Bench and NL2Repo.
- **Need to turn off thinking to cut latency** → M3 supports `thinking: disabled`; M3.1 Flash does not.
- **Need factual accuracy** → test hallucinations on your own data first; third-party results contradict each other.
- **Commercial self-hosting** → confirm whether you need attribution, a notice, or authorization; don't assume a high-revenue product can use it directly.
- **Video or image generation** → H3 and H3-Image have separate billing and licenses; see the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en) and the [H3-Image model card](/posts/daily/2026-11-16-model-minimax-h3-image-en).

## Limitations and trade-offs

- **Evaluations are almost all self-reported**, and compare against rivals' previous versions at release time.
- **Reliability is unsettled**: independent hallucination results conflict, and MiniMax publishes no reliability metric.
- **The license is not MIT**: the core grant is non-commercial, commercial use carries attribution and notice duties, and there is no internal-use exemption.
- **Thinking cannot be turned off** (M3.1 Flash).
- **The company is still loss-making**: an adjusted net loss of about US$250M means low prices may be partly subsidized, so don't treat long-term pricing as fixed.
- **Geopolitics**: hosted APIs from a Chinese vendor are a consideration for some use cases; open weights allow self-hosting, but the license obligations still apply.

## Update history

- **2026-11-20**: Added the M3 and M3.1 Flash generation. The matrix, architecture, evaluation, pricing, licensing, and selection were rewritten (MiniMax pricing page, model list and release notes, the M3 announcement, the MSA paper, HuggingFace model cards and LICENSE, and the HKEX annual results announcement, read 2026-11-20); added the MSA mechanism, the three M3→M3.1 Flash changes, the Community License terms, the reliability dispute, and the H3 and H3-Image sub-lines. M2.5 and M3 are now history; the earlier M2.5 and M3 evaluation tables moved out of the body, with full numbers on their HuggingFace model cards. Corrections: M3 was listed as 456B / 45.9B active, but it is about 428B / 23B; M3's price was listed as $0.60/$2.40, which is the list price — the charged price is $0.30/$1.20 with a 512K tier; the "operating loss of US$1.87B" is actually the loss for the year, mostly from fair-value losses, with an adjusted net loss of about US$250M; M2.7's "about 10B active per token, 78% on SWE-bench" had no first-party source and was removed; unsourced figures for headcount, funding amounts, and user counts were also removed.
- 2026-10-11: Reorganized format, the model matrix, and selection sections, keeping existing sources and dates; no new fact-check this round.

## References

- [MiniMax pricing page](https://platform.minimax.io/docs/guides/pricing)
- [MiniMax model list](https://platform.minimax.io/docs/guides/models-intro)
- [MiniMax model release notes](https://platform.minimax.io/docs/release-notes/models)
- [MiniMaxAI/MiniMax-M3.1-Flash — HuggingFace model card](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)
- [MiniMax Community License (M3.1 Flash) — HuggingFace](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/raw/main/LICENSE)
- [MiniMax M3: Frontier Coding, 1M Context, Native Multimodality — official blog](https://www.minimax.io/blog/minimax-m3)
- [MiniMaxAI/MiniMax-M3 — HuggingFace model card](https://huggingface.co/MiniMaxAI/MiniMax-M3)
- [MiniMax Sparse Attention — arXiv:2606.13392](https://arxiv.org/html/2606.13392)
- [MiniMaxAI/MiniMax-M2.7 — HuggingFace model card](https://huggingface.co/MiniMaxAI/MiniMax-M2.7)
- [MiniMaxAI/MiniMax-M2.5 — HuggingFace model card](https://huggingface.co/MiniMaxAI/MiniMax-M2.5)
- [MiniMax Group 2025 annual results announcement — HKEX](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0302/2026030202837.pdf)
- [Deploy MiniMax M3 on NVIDIA Accelerated Infrastructure — NVIDIA Technical Blog](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/)
- [Model card: MiniMax M3.1 Flash](/posts/daily/2026-10-20-model-minimax-m3-1-flash-en) — this site
- [Model card: MiniMax-H3-Image](/posts/daily/2026-11-16-model-minimax-h3-image-en) — this site
- [Video generation model family](/posts/tech/2026-08-26-ai-model-family-video-generation-en) — this site
- [Ornith: The Open-Source Coding Model Built with Self-Improvement RL](/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en) — this site
