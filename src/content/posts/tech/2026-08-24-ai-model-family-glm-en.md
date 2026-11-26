---
title: "GLM: From a Tsinghua Lab to the GLM-5.3 Generation, the Most Cyber-Capable Open-Weight Model, and the Flash, FlashX, and Legal Tiers"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, glm, zhipu-ai, model-family-glm, moe, open-source, model-selection]
lang: en
type: deep-dive
tldr: "GLM is Zhipu AI (Z.ai)'s open-weight LLM family, rooted in Tsinghua University's KEG Lab. The current generation is GLM-5.3: the flagship GLM-5.3 (about 750B total, 40B active, $1.4/$4.4) scores 84.5% on CyberGym and was named by NIST CAISI the most cyber-capable open-weight model; GLM-5.3-Flash (320B/18B, MIT, $0.15/$0.50) adds native multimodality, FlashX trades price for speed, and FlashX-Legal targets legal work. The flagship weights now ship under a custom GLM-5.3 License rather than plain MIT."
description: "A complete guide to the GLM (Zhipu AI / Z.ai) family: the 2022-to-2026 timeline, the GLM-5.3 / 5.3-Flash / FlashX / FlashX-Legal tiers and pricing, GLM-5's MoE and sparse attention, slime asynchronous RL, GLM-5.3's cyber capabilities and third-party assessments, how the GLM-5.3 License differs from MIT, and selection advice for agent developers."
series:
  name: "AI Model Families"
  order: 8
draft: false
glossary:
  - term: "GLM"
    aliases: ["General Language Model"]
    definition: "The model series from Tsinghua University's KEG Lab; the early GLM-130B used an autoregressive blank-infilling objective to unify understanding and generation, while generations from GLM-4.5 on are large MoE models"
  - term: "slime"
    definition: "Zhipu AI's open-source framework for large-scale asynchronous reinforcement learning, which decouples generation from training and is used for RL post-training on long-horizon agent environments"
  - term: "MaaS (Model as a Service)"
    definition: "A service that gives third parties inference or fine-tuning access (for example via API) with meaningful control over inputs, parameters, or training data; the GLM-5.3 License adds a security review for MaaS operators with more than $10B in annual revenue"
  - term: "CAISI"
    aliases: ["Center for AI Standards and Innovation"]
    definition: "NIST's Center for AI Standards and Innovation, which published an assessment of GLM-5.3's cyber capabilities on 2026-09-17"
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-glm)

GLM is the model family of Zhipu AI (international brand Z.ai), running from Tsinghua KEG Lab's GLM-130B in 2022 to the GLM-5.3 generation in 2026. This generation is defined by "same base, new capabilities through post-training," and by cyber capabilities that a US government body and Anthropic separately identified as the strongest among open-weight models. This guide is for agent developers choosing an open-weight workhorse: by the end you should know which work suits GLM-5.3, Flash, FlashX, and FlashX-Legal, and whether the flagship's new license affects your deployment.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the eighth family deep dive in the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on the "Latest Models" and text-model sections of Z.ai's pricing page on 2026-11-23:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| GLM-5.3 | Flagship: complex coding, long-horizon agents, security | Same base as GLM-5.2, about 750B total and 40B active; text only; 1M context | Z.ai API; GLM-5.3 License weights |
| GLM-5.3-Flash | Low-cost workhorse, coding agents that look at screens | 320B / 18B, hybrid linear + sparse attention; native video, image, and file input | Z.ai API, GLM Coding Plan; MIT weights |
| GLM-5.3-FlashX | Low-latency interactive agents | The same Flash model served at about 200 tokens/s | Z.ai API only |
| GLM-5.3-FlashX-Legal (GLM-Legal) | Legal research, contract review, drafting | Built on GLM-5.3-Flash with legal mid-training and RL | Z.ai API only |

Older models (GLM-5.2, GLM-5.1, GLM-5, GLM-4.7, GLM-4.6) remain on the pricing page, but new projects have little reason to pick them: GLM-5.2 and 5.1 cost the same as 5.3 and trail it across the board.

### Two product lines: open weights for the ecosystem, commercial API for revenue
The key to reading GLM's moves is to split them into two parallel lines:

**The open-weight line** (`zai-org` on Hugging Face): checkpoints from GLM-4.5 to GLM-5.3 can be downloaded, fine-tuned, and self-hosted. Everything up to GLM-5.2, plus GLM-5.3-Flash, is MIT; the flagship GLM-5.3 moved to a custom GLM-5.3 License (terms under "Licensing, pricing, and deployment"). The official model cards list SGLang, vLLM, Transformers, and KTransformers, plus vLLM-Ascend and xLLM for Huawei Ascend NPUs.

**The commercial line** (Z.ai / BigModel.cn API, GLM Coding Plan, AutoClaw): the GLM-5.3 API went live on 2026-08-18 and the weights reached Hugging Face on 08-25, delivering on the promise to open the weights within two weeks of launch once safety evaluation was done. FlashX and FlashX-Legal exist only as hosted services with no separate weights. The GLM Coding Plan uses a points system, and off-peak hours (including all weekend) consume half the points; GLM-5.3-Flash gets three times GLM-5.3's quota on the plan.

### Sub-lines and ecosystem
| Sub-line | Representative models (2026-11) | Positioning |
|---|---|---|
| Flagship text line | GLM-5.3 | Strongest coding, long-horizon agents, security |
| Flash line | GLM-5.3-Flash, FlashX | The first natively multimodal GLM-5 model; FlashX is a faster serving tier of the same model |
| Domain models | GLM-5.3-FlashX-Legal | Legal workflows, paired with MCP services for legal data and Word documents |
| Vision and OCR | GLM-4.6V, GLM-OCR | Older vision models; multimodality has moved to 5.3-Flash |
| Generation models | GLM-Image, CogView-4, CogVideoX-3 | Image and video generation |
| Products | Z.ai Chat, ZCode, AutoClaw, GLM Coding Plan | Chat, coding, and a desktop agent platform |

Two trends:

**Capabilities fold into the main line.** Vision used to be a separate GLM-V line and is now native to 5.3-Flash; vertical needs such as law get domain training on the same Flash base instead of a new model line.

**Licensing has started to tier.** GLM's open weights used to be MIT throughout; GLM-5.3 is the first flagship with conditions attached, while Flash stays MIT. Stronger cyber capability and a tighter license arrived in the same generation, which is not a coincidence (see "Limitations and trade-offs").

## Family evolution

### Family timeline
| Version | Released | Key facts | What changed for selection |
|---|---|---|---|
| GLM-130B | 2022-08 | 130B dense model, autoregressive blank infilling, ICLR 2023 paper | Starting point for open bilingual large models |
| ChatGLM-6B | 2023-03 | Aligned release, 6B open weights | A Chinese chat model that ran on consumer GPUs and energized the community |
| ChatGLM2 / 3 | 2H 2023 | Longer context, function calling | Usable for tool calls and agents |
| GLM-4 series | 2024 | 10T+ pre-training tokens, All Tools autonomous tool selection | The commercial API line took shape |
| GLM-4.5 | 2025-07 | 355B MoE (32B active) | Moved to large MoE and into the open-model front tier |
| GLM-4.6 / 4.7 | 2025-09 / 12 | 4.6 extended context to 200K; 4.7 strengthened coding and agents | One of China's main coding options, still on the pricing page |
| GLM-5 | 2026-02-12 | 744B MoE (40B active), DeepSeek Sparse Attention and asynchronous agent RL | Shift from "writing code" to "systems engineering"; MIT weights |
| GLM-5.1 | 2026-04-07 | Built for long-horizon tasks, up to 8 hours of independent work per run | Long unattended agent runs became feasible |
| GLM-5.2 | 2026-06-16 | 1M lossless context, open-source SOTA on coding | 1M context arrived in GLM; also the base for 5.3 |
| GLM-5.3 | 2026-08-18 | Same base, post-training only; Z.ai Code Bench +50% over 5.2, CyberGym 84.5% | Open weights reached near-frontier cyber capability for the first time, and the license gained a condition ([model card](/posts/daily/2026-08-25-model-zhipu-glm-5-3-en)) |
| GLM-5.3-Flash | 2026-08-26 | 320B / 18B, native multimodality, MIT, about a tenth of the flagship's price | The low-cost tier stopped being a cut-down model, with coding scores near the flagship ([model card](/posts/daily/2026-08-28-model-zhipu-glm-5-3-flash-en)) |
| GLM-5.3-FlashX | 2026-09-18 | Faster serving of Flash, about 200 tokens/s | The same model priced by latency, giving interactive work a speed option |
| GLM-5.3-FlashX-Legal | 2026-10-12 | Legal-domain training, 19.2% all-pass on Harvey LAB | The first vertical GLM-5 model; the current selection baseline is covered below |

Four-plus years and more than a dozen milestones. The first half was academic work turning into products; the second half split open weights from the commercial API, and in the 5.3 generation the same Flash base was further cut into three hosted products by latency and domain.

## Architecture and training trade-offs

### Architecture: one base, new capabilities from post-training
#### From blank infilling to large MoE

The early GLM-130B unified understanding and generation with a blank-infilling objective, which is where the "GLM" name comes from. Generations from GLM-4.5 on are large MoE models: the GLM-5 technical report lists 256 experts with 8 routed plus 1 shared per token, 744B total and 40B active parameters, and adopts DeepSeek Sparse Attention (DSA) to cut long-context training and inference costs. The GLM-5.3 weight files on Hugging Face total about 753B parameters, which is also the figure Artificial Analysis lists.

GLM-5.2 and GLM-5.3 share a base. Z.ai's GLM-5.3 post describes the generation as "scaling post-training is all we did": on top of the IndexShare (long-context processing), SAO (RL for long-horizon tasks), and slime (large-scale asynchronous RL training) stack built for 5.2, they added more environments, more diverse tasks, and more training compute.

#### Environment synthesis: the post-training bottleneck moves from model to environment

GLM-5.3's training tasks look increasingly like real expert work, some equal to several days for an experienced engineer, such as diagnosing training bottlenecks in an environment with compute clusters, storage, and internal docs and delivering a measurable speedup. To mass-produce such environments, Z.ai built an end-to-end synthesis pipeline: research agents collect task patterns from real work and turn them into runnable long-horizon environments, and a judge agent checks that each task is solvable; verifiers are synthesized without access to the reference solution, and solver trajectories are used to find and close reward shortcuts. Z.ai acknowledges the pipeline still needs substantial human involvement.

#### GLM-5.3-Flash: hybrid linear and sparse attention

Flash is the first natively multimodal GLM-5 model, with 320B total and 18B active parameters. It does not reuse the 5.2/5.3 base: the Hugging Face model card says it starts from a newly trained base model on a 30T-token multimodal corpus and adopts mHC (Manifold-Constrained Hyper-Connections). The official docs call it the first open frontier model to combine sparse and linear attention, cutting attention compute by 3.01× and KV cache by 4.44× versus GLM-5.3. Vision is built into the coding loop: the model looks at interfaces, rendered output, and interaction feedback, then fixes its code, across frontend, games, Blender 3D scenes, and browser or computer use.

FlashX has no new weights; it is a faster serving tier of the same Flash model at about 2.5× the price. FlashX-Legal starts from Flash, adds mid-training on a large legal corpus, then RL across tens of thousands of environments modeled on legal workflows.

#### Reasoning effort

GLM-5.3 controls its thinking budget with `reasoning_effort`, accepting `low`, `high`, and `max`; anything else, or no value, means `max`. Official evaluations and leaderboards use `max`, so if you deploy at `high`, re-test it yourself.

## Evaluation and alternatives

### GLM-5.3: official numbers
These are Z.ai's self-reported results from its blog and Hugging Face model card; most coding and security items use the Claude Code harness at maximum reasoning effort:

| Benchmark | GLM-5.3 | GLM-5.2 | Claude Fable 5 (w/ fallback) | GPT-5.6 Sol | Kimi K3 |
|---|---|---|---|---|---|
| Terminal-Bench 2.1 | 88.2 | 81.0 | 88.0 | 88.8 | 88.3 |
| Terminal-Bench 3.0 | 28.3 | 4.6 | 33.7 | 34.6 | 17.4 |
| DeepSWE v1.1 | 66.9 | 46.2 | 69.7 | 72.7 | 67.5 |
| CyberGym | 84.5 | 77.2 | 83.8 | 83.6 | 80.0 |
| ExploitBench | 54.4 | 24.4 | 78.0 | 76.5 | 32.2 |
| AutomationBench v1.0.6 | 48.2 | 26.2 | 46.2 | 45.8 | 46.7 |
| Agents' Last Exam (CLI) | 28.5 | 23.8 | 23.8 | 28.6 | 27.6 |

GLM-5.3 tops the table on CyberGym (finding vulnerabilities) but still trails Claude Fable 5 and GPT-5.6 Sol clearly on ExploitBench (writing working exploits). On Z.ai's in-house Code Bench at Max effort it reaches 34.5% (GLM-5.2: 23.4%) while output tokens per task fall from about 96K to about 75K; on the same chart Claude Fable 5 reaches 39.5%.

### GLM-5.3-Flash and FlashX-Legal
- **GLM-5.3-Flash**: the chart on Z.ai's model card shows Terminal-Bench 2.1 at 84.3, DeepSWE v1.1 at 63.4 (GLM-5.2: 46.2), AutomationBench at 48.8, and Agents' Last Exam at 26.3, against Claude Opus 4.8's 85.0, 58.0, 41.0, and 27.0. The gap to the flagship is much smaller than the price gap
- **GLM-Legal**: 19.2% on Harvey LAB (law-firm workflows across 24 practice areas, scored only when every criterion passes), 12.5 points above its base model; the Harvey LAB and LegalBench results were evaluated independently by Vals

### Third-party assessments
- **Artificial Analysis Intelligence Index v5.0.1**: GLM-5.3 (Max) scores 32, fourth of 33 open-weight models in its size class, but at $5.01 and 29.8 minutes per index task it is the most expensive and among the slowest in that class; on the same index version DeepSeek V4.1-Flash-1017 scores 33
- **NIST CAISI (2026-09-17)**: called it "the most cyber-capable open-weight model released to date," about four months behind the US frontier on CAISI's aggregate cyber benchmarks
- **Anthropic Frontier Red Team (2026-09-29)**: on the V8 ExploitBench, GLM-5.3 produced end-to-end exploits in 50 of 410 attempts versus 56 for Claude Mythos Preview; simple techniques bypassed GLM-5.3's safeguards between 64% and 100% of the time

### Where it sits against competitors
- **Versus DeepSeek V4.1 Flash**: in DeepSeek's own table, V4.1-Flash-1017 leads on DeepSWE (77.0 vs 66.9), AutomationBench, and Agents' Last Exam, and costs less ($0.30/$1.20 at peak vs $1.4/$4.4); GLM-5.3's edge is security and Terminal-Bench 3.0. See the [DeepSeek family](/posts/tech/2026-08-24-ai-model-family-deepseek-en)
- **Versus Kimi**: in Z.ai's table GLM-5.3 and Kimi K3 trade wins across most coding items, with GLM ahead on CyberGym and ExploitBench. See the [Kimi family](/posts/tech/2026-08-24-ai-model-family-kimi-en)
- **Versus Muse Spark Open**: Meta's open-weight flagship emphasizes agentic benchmarks and stricter safety post-training, also under a custom license with conditions. See the [Muse Spark family](/posts/tech/2026-09-19-ai-model-family-muse-spark-en)
- **Versus the Claude/GPT frontier**: ahead locally on CyberGym but behind on ExploitBench, DeepSWE, and composite indexes; several times cheaper

## Licensing, pricing, and deployment

### License: treat MIT and the GLM-5.3 License separately
Licenses on Hugging Face (read 2026-11-23):

- **GLM-5.3-Flash, GLM-5.2, GLM-5.1, GLM-5**: MIT, with commercial use, fine-tuning, and self-hosting and no thresholds
- **GLM-5.3**: the custom GLM-5.3 License. Its core is an MIT-style permissive grant (use, modify, distribute, sublicense, and fine-tune are all allowed), with one addition: if the licensee or its affiliates operate a Model-as-a-Service (MaaS) business and their combined revenue exceeds $10 billion over any 12 consecutive months, they must pass Z.ai's security review before any commercial use
- **FlashX, FlashX-Legal**: no weights; Z.ai API only

MaaS means giving third parties inference or fine-tuning access with meaningful control over inputs, parameters, or training data; end-user products that embed the model only within specific features or harnesses, and mere relaying of requests to models hosted by others, are excluded. For almost every company GLM-5.3 behaves like MIT; the clause bites only cloud platforms at the $10B-revenue scale.

### API pricing
Z.ai pricing page (read 2026-11-23), per 1M tokens:

| Item | GLM-5.3 | GLM-5.3-Flash | GLM-5.3-FlashX | GLM-5.3-FlashX-Legal |
|---|---|---|---|---|
| Input | $1.40 | $0.15 | $0.37 | $0.37 |
| Cached input | $0.26 | $0.03 | $0.075 | $0.075 |
| Output | $4.40 | $0.50 | $1.25 | $1.25 |
| Cache storage | Free for a limited time | Free for a limited time | Free for a limited time | Free for a limited time |
| Context / max output | 1M | 1M / 128K | 1M / 128K | 1M |
| Input modalities | Text | Video, image, text, file | Same as Flash | Same as Flash |

The built-in Web Search tool costs $0.01 per use. GLM-5.2 and GLM-5.1 cost the same as GLM-5.3 ($1.4/$4.4), and GLM-5 is $1/$3.2. Third-party hosts such as Together AI also list GLM-5.3 at $1.40/$4.40.

### Self-hosting
GLM-5.3 has about 753B parameters and also ships BF16 weights; the official model card covers SGLang, vLLM, Transformers, KTransformers, and Unsloth, plus vLLM-Ascend, xLLM, and SGLang on Ascend NPUs. GLM-5.3-Flash has about 321B parameters, also with BF16 weights. For chat use, pass `clear_thinking=true` explicitly in the chat template; by default the thinking content is kept.

## Agent integration and selection

### What this means for agent developers
- **Complex coding agents, long-horizon work** → GLM-5.3: Terminal-Bench 3.0 28.3, DeepSWE 66.9, and Z.ai Code Bench 50% above 5.2; but time and cost per task are high, so make sure the task is worth it
- **Everyday coding and agents that look at screens** → GLM-5.3-Flash: $0.15/$0.50, native screenshot and video input, DeepSWE 63.4 not far from the flagship; three times the flagship's quota on the GLM Coding Plan
- **Interactive work where users wait on output** → GLM-5.3-FlashX: the same model at about 200 tokens/s for 2.5× Flash's price; not yet on the Coding Plan
- **Legal research, contract review, drafting** → GLM-5.3-FlashX-Legal, paired with the legal-data and Word-document MCP services Z.ai recommends
- **Defensive security: vulnerability scanning, code review** → GLM-5.3: CyberGym 84.5%; but build your own guardrails, because the model's refusals are easy to bypass
- **MIT weights for self-hosting** → GLM-5.3-Flash or GLM-5.2; for flagship weights, accept the GLM-5.3 License and confirm you are not a $10B-scale MaaS operator
- **The cheapest API** → DeepSeek V4.1 Flash or GLM-5.3-Flash; the GLM-5.3 flagship has the highest cost per task in its Artificial Analysis class
- **When citing benchmarks** → GLM model names now include 5.3, 5.3-Flash, FlashX, and Legal, and third-party scores often omit which one and at what reasoning effort; write both out in full

## Limitations and trade-offs

Most of GLM-5.3's public benchmarks are Z.ai's own, and third-party composite indexes show it is expensive and slow: $5.01 and 29.8 minutes per Artificial Analysis task. The cyber capability cuts both ways: Anthropic's testing found GLM-5.3's safeguards could be bypassed 64% to 100% of the time with simple techniques, and anyone can download the weights; this site's [security alert](/posts/daily/2026-11-18-security-cairn-china-nexus-ai-pentest-breach-en) has also covered attackers wiring GLM into an open-source penetration framework. When GLM-5.3 runs inside an agent that can execute code or touch production systems, protection must come from the harness and permission design, not from model refusals.

Beyond the benchmarks Z.ai highlights, there is little data on the Flash line's vision ability, and FlashX and Legal have no weights, so they are tied to the Z.ai API. Z.ai has not released a new flagship since GLM-5.3, and there is no official timeline for the next generation.

### The big picture
GLM's story is an open frontier model grown from an academic lab. In the GLM-5.3 generation, one base showed that post-training can lift frontier capability sharply, and open weights ran into the question of whether capability this strong should carry conditions. For agent developers the practical split is: Flash for everyday and screen-reading work, the flagship for the hardest coding and defensive security, FlashX for latency, and Legal for law. On licensing, Flash is still clean MIT, while the flagship adds a security review that affects only the largest cloud providers.

## Update history

- 2026-11-23: Added GLM-5.3-Flash, GLM-5.3-FlashX, and GLM-5.3-FlashX-Legal, and rewrote the model matrix, sub-line table, evaluation, pricing, and selection sections against Z.ai's 2026-11-23 pricing page, official docs, Hugging Face model cards, and third-party assessments (Artificial Analysis, NIST CAISI, Anthropic). The GLM-5.2 / 5.1 / 5-Turbo comparison table moved out of the body and is preserved through the timeline and daily model cards; the timeline gained GLM-4.6 / 4.7 and now notes "what changed for selection" on each row. Corrections: GLM-5.3's weights use the custom GLM-5.3 License, not MIT; GLM-5.3's API price is $1.4/$4.4, not $0.42/$2.10; the 83.8% CyberGym comparison belongs to Claude Fable 5 (with fallback), not Mythos 5; GLM-5.1 was released on 2026-04-07, not in May; "60 on the Intelligence Index, tied with Kimi K3" was a score on an older index version and is replaced with the current v5.0.1 score of 32; the architecture from GLM-5 on is MoE with sparse attention, and blank infilling belongs only to the early GLM-130B; removed statements that conflict with or cannot be traced to official documentation ("OpenClaw is Zhipu's coding tool," "GLM-5-Turbo tool-calling accuracy of 99.32%," and "the only frontier open model trained entirely on Huawei Ascend"), replacing the last with the Ascend NPU deployment support stated in the official model card.
- 2026-10-11: Reorganized sections into the shared family format and added a matrix built from existing content. Kept the original versions, prices, and source dates; no new fact-check was performed.

## References

- [GLM-5.3: Frontier Coding with Emergent Cyber Capabilities — Z.ai Blog](https://z.ai/blog/glm-5.3)
- [zai-org/GLM-5.3 — Hugging Face](https://huggingface.co/zai-org/GLM-5.3)
- [GLM-5.3 License — Hugging Face](https://huggingface.co/zai-org/GLM-5.3/blob/main/LICENSE)
- [zai-org/GLM-5.3-Flash — Hugging Face](https://huggingface.co/zai-org/GLM-5.3-Flash)
- [GLM-5.3-Flash/FlashX and GLM-5.3-FlashX-Legal — Z.ai Developer Docs](https://docs.z.ai/guides/vlm/glm-5.3-flash)
- [GLM-Legal: Advancing Agentic Legal Intelligence — Z.ai Blog](https://z.ai/blog/glm-legal)
- [Pricing — Z.ai Developer Docs](https://docs.z.ai/guides/overview/pricing)
- [New Released — Z.ai release notes](https://docs.z.ai/release-notes/new-released)
- [GLM-5.3 — Artificial Analysis](https://artificialanalysis.ai/models/glm-5-3)
- [GLM-5.3 and the spread of advanced cyber capabilities — Anthropic](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities)
- [GLM-5: from Vibe Coding to Agentic Engineering (arXiv:2602.15763)](https://arxiv.org/abs/2602.15763)
- [ChatGLM: A Family of Large Language Models (arXiv:2406.12793)](https://arxiv.org/abs/2406.12793)
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
