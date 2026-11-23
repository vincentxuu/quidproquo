---
title: "Tencent Hy (Hunyuan): Hy4 and Hy4 flash Ship Open Weights, but the License Moves Off Apache 2.0"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, tencent, open-source, model-family-hunyuan, moe, model-selection]
lang: en
type: deep-dive
tldr: "Tencent Hy (formerly Hunyuan) currently offers Hy4 (770B total, 49B active, 1M context, first with image input and computer use) and the low-cost Hy4 flash (about 220B, 12B active). Both have open weights, but the license changed from the Apache 2.0 used by Hy3 and Hy4 preview to the Tencent Hy License, which requires large MaaS operators to get a separate license. Artificial Analysis scores Hy4 at 35; long-horizon coding still trails the closed frontier, while finance, office work and cost are its strengths."
description: "Tencent Hy (Hunyuan) model family: Hy4 and Hy4 flash specs, architecture (Gated DSA, iHC, Engram, DFly2), vendor and third-party evaluations, Tencent Hy License terms, TokenHub and OpenRouter pricing, the 2024–2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 34
draft: false
glossary:
  - term: "Gated DSA (Gated DeepSeek Sparse Attention)"
    aliases: ["Gated DSA"]
    definition: "The sparse attention used in Hy4: an indexer selects up to 2,048 relevant positions per token before attention, with a gate added; IndexCache lets adjacent layers reuse the same sparse indices"
  - term: "iHC (identity Hyper-Connections)"
    aliases: ["identity Hyper-Connections"]
    definition: "A design that widens a single residual path into several parallel residual streams (four in Hy4) to improve cross-layer information flow"
  - term: "Engram"
    definition: "Hy4 flash's N-gram embedding module: multi-head hash lookups retrieve bigram and trigram representations, using lookup-table parameters to expand model capacity"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-tencent-hy)

Tencent Hy is Tencent's large language model family, formerly called Tencent Hunyuan. Chinese press releases still often use "腾讯混元", while the weights on Hugging Face now carry the Hy name. This post is for agent developers evaluating Chinese open-weight models: what Hy4 and Hy4 flash are each good for, where they stand against DeepSeek, Kimi and GLM, and what the new license means for API resellers and very large products.

As of November 2026, the flagship Hy4 launched on the API on November 4 and released its weights on November 20; the low-cost Hy4 flash went open on November 17. Both use the new Tencent Hy License instead of the Apache 2.0 used by the previous two releases.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Prices below are the [Tencent Cloud list prices on OpenRouter](https://openrouter.ai/tencent/hy4), per 1M tokens:

| Model / line | Role | Key difference | Access and price |
|---|---|---|---|
| Hy4 (`tencent/Hy4`, API name `hy4`) | Current flagship | 770B total, 49B active; 1M context; text, image and video input; first with computer use | Open weights (Tencent Hy License) + API: $0.834 / $2.501, cache hit $0.042 |
| Hy4 flash (`tencent/Hy4-flash`) | Low-cost everyday work | About 220B (including 63.5B Engram), 12B active; 1M context; text and image input | Open weights (Tencent Hy License) + API: $0.07 / $0.281, cache hit $0.003 |
| Hy4 base / Hy4-flash-base | Pre-trained weights | Not instruction-tuned; for your own post-training | Open weights |
| Hy3 (`tencent/Hy3`) | Previous mid-size model | 295B total, 21B active, 256K context, text only | Open weights, Apache 2.0 |
| Hy-Memory-30B-A3B | Agent memory writing | Built for the memory-write path of frameworks such as Mem0 and MemOS | Open weights, Apache 2.0 |

Two things to know first:

- **Hy4 kept the preview's API price.** Together and DeepInfra host it at the same price on OpenRouter; Tencent's press release converts the same price to roughly $0.90 / $2.70. Tencent Cloud TokenHub is at 50% off through 2026-12-31, so OpenRouter shows $0.417 / $1.251.
- **The weights come in FP8 and base versions.** Both Hy4 and Hy4 flash ship BF16, FP8 and pre-trained base weights, and the [Hy4 model card](https://huggingface.co/tencent/Hy4) also provides a GGUF build for end-to-end testing.

### Sub-lines and ecosystem

Beyond the general-purpose line, Tencent's [`tencent` organization](https://huggingface.co/tencent) on Hugging Face hosts several Hy-branded sub-lines: translation (Hy-MT2 and the simultaneous interpretation model Hy-SimulMT), agent memory ([Hy-Memory-30B-A3B](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b-en)), world models (HY-World 2.0), embodied AI (HY-Embodied) and 3D generation (Hunyuan3D; see the 3D section of the [model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)). Youtu Lab's [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni-en) also sits under the `tencent` organization, but it comes from a different team under a different license.

Distribution runs through Tencent's own products: Hy4 already powers the office agent WorkBuddy, the coding assistant CodeBuddy, the Yuanbao assistant, the knowledge tool ima and the assistant in WeCom. WorkBuddy also plugs DeepSeek, GLM, Kimi and other outside models into the same workspace (see the [China regional digest](/posts/daily/2026-08-28-region-china-en)), so Hy competes for users even inside Tencent's products.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Hunyuan-Large | 2024-11 | 389B-A52B MoE open weights, Tencent's first large MoE release; custom Tencent License | — |
| Hunyuan-A13B | 2025-06 | 80B-A13B mid-size MoE, an open-weight option that fits on a single node | — |
| Hy3 preview | 2026-04-23 | First release on rebuilt infrastructure, 295B-A21B, 256K; Tencent Hy Community License | — |
| Hy3 | 2026-07-06 | The final release switched to Apache 2.0 and expanded international access in August; the first mid-size Hy weights without commercial strings | — |
| Hy4 preview | 2026-08-28 | Scaled to 770B-A49B and 1M context, still Apache 2.0 and text only | [Model card](/posts/daily/2026-08-29-model-tencent-hy4-preview-en) |
| Hy4 | 2026-11-04 (API) / 11-20 (weights) | First with images and computer use at the same price; weights move to the Tencent Hy License | — |
| Hy4 flash | 2026-11-17 | 12B-active low-cost branch, about 1/20 of Hy4's cost per task; also Tencent Hy License | [Model card](/posts/daily/2026-11-19-model-tencent-hy4-flash-en) |

Over the year the theme was "scale and context go up, price stays put." The other thread is licensing: Hy3 and Hy4 preview used permissive Apache 2.0, and the Hy4 generation moved to a custom license built on Apache 2.0 with added MaaS terms. Hy4 preview is now the previous generation in this post; its SWE-bench Pro and Terminal-Bench 2.1 scores stay in [its model card](/posts/daily/2026-08-29-model-tencent-hy4-preview-en). Those benchmark versions differ from the ones here, so they are not mixed into the same table.

## Architecture and training trade-offs

### Hy4: sparse attention plus multiple residual streams

The [Hy4 model card](https://huggingface.co/tencent/Hy4) says the architecture and parameter count carry over from the preview, with vision as the main addition:

- **MoE backbone**: 78 layers, the first with a dense FFN and the other 77 each holding 256 routed experts and 1 shared expert; each token activates 8 routed experts.
- **Gated DSA + IndexCache**: attention uses the MLA formulation, with an indexer picking up to 2,048 positions per token; adjacent layers reuse the same sparse indices to cut indexing cost at 1M context. Tencent credits DeepSeek and GLM as inspiration.
- **iHC**: four parallel residual streams to strengthen cross-layer information flow.
- **Vision**: a 1.23B ViT handles dynamic resolutions, and an adapter turns image and video frames into visual tokens. Active parameters per token are 49B for text plus 1.23B for vision.
- **DFly2 speculative decoding**: a built-in 5-layer, 3.3B drafter shares the main model's KV cache and sparse indices. Each draft token attends to at most about 2K keys, so the cost does not grow with context length and no separate KV memory is needed.

The costs are concrete. Self-hosting needs 8-way tensor parallelism (the official vLLM and SGLang recipes run the FP8 build with `tensor-parallel-size 8`), and the [system card](https://cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf) admits that native visual perception and multi-disciplinary visual reasoning without tools remain weak.

### Hy4 flash: three concessions to cost

The [Hy4 flash model card](https://huggingface.co/tencent/Hy4-flash) lists three changes relative to Hy4:

- **Hybrid attention**: sparse attention interleaved 1:3 with 512-token sliding-window attention.
- **LatentMoE**: routed experts run in a lower-dimensional latent space; each token picks 16 of 512 experts plus one shared expert.
- **Engram**: hash lookups retrieve bigram and trigram representations; all 63.5B of its parameters serve the lookup tables.

Together these cut the KV cache to 1/24 of Hy3 and 1/6 of Hy4. Post-training self-distills from Hy4, then uses reinforcement learning to halve the average output length. When reading the spec, note that nearly 30% of the 220B total is lookup parameters: estimate inference cost from the 12B active count, not the total. The total itself is reported two ways: the model card's spec table adds up to about 220B (155.5B backbone + 63.5B Engram + vision encoder and drafter), while [Tencent's press release](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html) says 224B (including 64B Engram); this post follows the model card.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/tencent-hy4) scores Hy4 at 35 on Intelligence Index v5.0.1 (reasoning configuration), above the median of 23 for open-weight models of similar size. [heise](https://www.heise.de/en/news/Tencent-Hy4-New-AI-model-joins-China-s-top-tier-11513717.html) notes that this puts it second among Chinese labs, behind Kimi K3.1 Pro at 46, tied with Grok 4.7 and just below Claude Haiku 5.5 at 36. Artificial Analysis also flags verbosity: the full index run produced 160M output tokens against a median of about 104M. Artificial Analysis's own Terminal-Bench 4.0 run gives 37%, below Tencent's self-reported 44.4.

### Third party: Vals AI

[Vals AI](https://www.vals.ai/models/tencent_hy4) scores Hy4 at 59.35% on the Vals Index (finance, coding, legal and tax tasks weighted by each sector's share of GDP), 20th of 43 models; its launch-day note placed Hy4 fourth among open-weight models, behind Kimi K3.1 Pro, DeepSeek V4.1 Flash 1017 and GLM 5.3. Vals's Terminal-Bench 4.0 run gives 39.39%. [Hy4 flash](https://www.vals.ai/models/tencent_hy4-flash) scores 50.78% on the Vals Index, 36th; Hy4 flash has no Artificial Analysis score yet.

### Vendor-reported: Hy4 against open weights and the closed frontier

From the [Hy4 model card appendix](https://huggingface.co/tencent/Hy4); all numbers are Tencent's, with every model at its highest reasoning setting. Where a rival cell has two numbers, the first is quoted from that vendor's report and the second is Tencent's own run; single numbers marked "Tencent run" are Tencent's own, and the rest are quoted from the vendor. Terminal-Bench 4.0 and ProgramBench use the Claude Code harness:

| Benchmark | Hy4 preview | Hy4 | DeepSeek-V4.1-Flash-1017 | Kimi K3.1 Pro | Claude Opus 5.5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 64.3 | 74.9 | 77.0 / 73.8 | 75.5 / 76.3 | 74.2 / 72.6 |
| Terminal-Bench 4.0 | 26.3 | 44.4 | 42.3 / 40.0 | 65.7 / 66.8 | 66.4 / 66.4 |
| ProgramBench (almost solved) | 17.5 | 30.0 | 29.1 / 29.0 | 31.5 / 24.5 | 65.0 / 56.5 |
| APEX-Agents v1.1 | 53.9 | 75.2 | 72.1 / 72.9 | 67.2 / 68.2 | 73.5 / 74.8 |
| OSWorld 2.1 | — | 78.9 | 68.4 (Tencent run) | 79.6 | 81.8 |
| MMMU-Pro | — | 78.6 | 76.7 (Tencent run) | 84.1 / 83.4 | 88.2 (Tencent run) |

How to read it:

- **Long-horizon coding is the weak spot.** DeepSWE is roughly even, but Terminal-Bench 4.0 and ProgramBench trail Kimi K3.1 Pro and Claude Opus 5.5 clearly. The Known Limitations section says the same.
- **Work-style agents are the strength.** APEX-Agents and OSWorld sit close to the closed frontier. In a blind evaluation run with Tencent Financial Technology, 213 finance professionals rated 579 tasks: Hy4 averaged 3.04 out of 4, ahead of DeepSeek-V4.1-Flash-1017 at 2.97 and Kimi K3.1 Pro and GLM-5.3 at 2.68.
- **The hallucination gain is Tencent's own number, and two official documents disagree.** The model card says internal hallucination rate fell from 15.76% on the preview to 5.45%; the same-day [press release](https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/) says 12.95% to 7.2%. Artificial Analysis's AA-Omniscience test measures a hallucination rate of about 89% (when it lacks the answer it tends to guess instead of abstaining; the definition differs from Tencent's, so the numbers are not directly comparable), and the [system card](https://cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf) concedes that at `high` reasoning Hy4 answers questions beyond its knowledge.

Numbers also drift between vendors' tables: Baidu's [ERNIE 5.5 Flash Preview announcement](https://ernie.baidu.com/release/ernie-5-5-flash-preview) quotes Hy4 at 77.6 on APEX-Agents, while Tencent's own table says 75.2. When citing, name whose table it came from.

### Hy4 flash

The [Hy4 flash model card](https://huggingface.co/tencent/Hy4-flash) leads with the internal WorkIndex (eight task sets covering slides, documents, spreadsheets and audio/video processing): Hy4 flash 42.1, Hy4 preview 39.7, Hy4 51.4. Average cost per task is 1/13 of Hy4 preview, 1/20 of Hy4 and 1/8 of DeepSeek-V4.1-Flash-1017 (Max tier, peak pricing).

The appendix also lists public agent benchmarks (Tencent runs), and the gap concentrates in coding: Terminal-Bench 4.0 19.2 (Hy4 44.4), ProgramBench 16.0 (Hy4 30.0), DeepSWE 64.6 (Hy4 74.9). Work-style tasks show a smaller gap: APEX-Agents 63.1 (Hy4 75.2), OSWorld 2.1 68.1 (Hy4 78.9). That is why Tencent explicitly recommends Hy4 for long-horizon software engineering.

## Licensing, pricing, and deployment

### Tencent Hy License: Apache 2.0 underneath, plus a MaaS clause

[Hy4](https://huggingface.co/tencent/Hy4/blob/main/LICENSE) and [Hy4 flash](https://huggingface.co/tencent/Hy4-flash/blob/main/LICENSE) share the Tencent Hy License 1.0. The text opens by stating that it is derived from Apache 2.0 but is not Apache 2.0; the difference sits in Section 10:

| Situation | Condition |
|---|---|
| General commercial use, fine-tuning, redistribution | Same as Apache 2.0: keep the license and change notices |
| Operating a MaaS business (giving third parties general-purpose inference or fine-tuning access, e.g. via API) | If group worldwide revenue exceeds $50M over 12 months, or a product exceeds 100M monthly active users, a separate written license from Tencent is required first |
| Purely internal use | Exempt from the row above as long as neither the model nor its outputs reach third parties |

The MaaS definition excludes two cases: end-user products whose model capabilities are confined to specific features or workflows, and simple relaying of requests to an independent third-party model service. In practice, embedding Hy4 in a SaaS product with a defined feature set is usually unaffected; only large general-purpose API resellers need to negotiate first. The license has no territorial exclusions.

The previous Hy3 and Hy4 preview remain Apache 2.0 and are still on Hugging Face. Teams that need a fully permissive license can stay on those two, at the cost of no vision.

### API pricing

- **Hy4**: $0.834 / $2.501, cache hit $0.042 (same price from Tencent Cloud, Together and DeepInfra on OpenRouter); Tencent Cloud is 50% off through 2026-12-31. Context is 1M.
- **Hy4 flash**: $0.07 / $0.281, cache hit $0.003; Tencent Cloud is the only host for now, and its TokenHub 50% promotion runs only through 2026-11-30.
- **Caching matters a lot.** OpenRouter reports a cache hit rate of about 96% for Hy4 traffic, putting the weighted average input price near $0.04 per 1M; repeated prompts in agent workflows push bills far below list price.

### Self-hosting

Tencent provides vLLM (`vllm/vllm-openai:hy4`) and SGLang (`lmsysorg/sglang:hy4`) images, both with DFly2 speculative decoding enabled. `reasoning_effort` accepts `no_think` or `high` (the default). Tencent's AngelSlim toolkit handles quantization, and the official Finetuning Guide covers fine-tuning.

## Agent integration and selection

- **Finance research, office documents, deep search agents** → Hy4. These are where Tencent invested most, at a fraction of Claude Opus 5.5's price; measure the hallucination rate on your own tasks first.
- **High-volume, low-complexity pre-processing** → Hy4 flash. At about 1/20 of Hy4's cost per task, it can take the first pass and escalate hard cases to Hy4.
- **A primary coding agent or terminal work** → Hy4 is not the first choice; Terminal-Bench 4.0 and ProgramBench trail Kimi K3.1 Pro and Claude Opus 5.5.
- **Computer use or chart understanding** → Hy4 is one of the few options with both GUI operation and open weights; its vendor-reported OSWorld 2.1 score is 78.9.
- **You need Apache 2.0** → Hy3 (text only, 256K) or Hy4 preview (text only, 1M).
- **API resale or a product with 100M+ monthly users** → check against Section 10 whether you count as MaaS before choosing Hy4, and request a written license if needed.
- **Long-term agent memory** → Hy-Memory-30B-A3B can replace the general-purpose model behind Mem0 or MemOS.

A minimal selection check: send the same agent tasks to Hy4 with `no_think`, to Hy4 with `high`, and to Hy4 flash, then compare completion rate, output tokens and the bill. Artificial Analysis data shows Hy4 runs long, so the cost gap from `no_think` may matter more than the score gap.

## Limitations and trade-offs

- **Long-horizon coding trails the closed frontier.** Tencent's own table, Known Limitations section and system card point the same way: on terminal work and building systems from scratch, Hy4 is still behind Kimi K3.1 Pro and Claude Opus 5.5. Third-party Terminal-Bench 4.0 runs (Artificial Analysis 37%, Vals AI 39%) also come in below Tencent's self-reported 44.4.
- **Most evaluations are vendor-reported or internal.** WorkIndex, TenureTrail and the finance blind test are Tencent-built; the only independent overall scores are Artificial Analysis's 35 and the Vals Index's 59.35%.
- **The license is no longer Apache 2.0.** Hy4-generation weights carry MaaS terms tied to group revenue and user counts; the old assumption "Hy open source means unrestricted commercial use" no longer holds.
- **Verbose output.** The default `high` reasoning produces many tokens; measure latency and cost.
- **Native vision is still weak.** Tencent concedes that fine-grained visual understanding without tools lags frontier models clearly.

Hy's strategy comes down to this: use Tencent's own products as the training and evaluation ground, push the flagship into the top tier of open weights, and keep the price mid-range. For outside developers, Hy4 is an open-weight option worth adding to the evaluation list for finance and office agents. It is not the coding champion, and its license adds a gate the previous two releases did not have.

## References

- [Tencent Launches Hy4 — Tencent press release](https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/)
- [Hy4 — Tencent Hy official blog](https://hy.tencent.ai/research/hy4)
- [tencent/Hy4 — Hugging Face model card (specs, benchmark appendix, deployment)](https://huggingface.co/tencent/Hy4)
- [Tencent Hy License 1.0 — Hugging Face](https://huggingface.co/tencent/Hy4/blob/main/LICENSE)
- [Hy4 System Card](https://cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf)
- [tencent/Hy4-flash — Hugging Face model card](https://huggingface.co/tencent/Hy4-flash)
- [Tencent Launches Hy4 flash — Tencent press release (PR Newswire)](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html)
- [tencent/Hy3 — Hugging Face model card](https://huggingface.co/tencent/Hy3)
- [Tencent Hunyuan officially releases Hy3 — Tencent press release (in Chinese)](https://www.tencent.com/zh-cn/tencent-hunyuan-officially-releases-hy3-advancing-agent-capabilities-and-deeper-product-integration/)
- [Tencent Hy3 Now Available Globally — Tencent press release](https://www.tencent.com/tencent-hy3-now-available-globally-extending-practical-ai-across-products-workflows-and-cloud-services/)
- [tencent/Hy3-preview — Hugging Face model card](https://huggingface.co/tencent/Hy3-preview)
- [tencent/Hy4-preview — Hugging Face model card](https://huggingface.co/tencent/Hy4-preview)
- [tencent/Tencent-Hunyuan-Large — Hugging Face](https://huggingface.co/tencent/Tencent-Hunyuan-Large)
- [Hunyuan-Large technical report — arXiv 2411.02265](https://arxiv.org/abs/2411.02265)
- [tencent/Hunyuan-A13B-Instruct — Hugging Face](https://huggingface.co/tencent/Hunyuan-A13B-Instruct)
- [Tencent: Hy4 — OpenRouter (providers and pricing)](https://openrouter.ai/tencent/hy4)
- [Tencent: Hy4 flash — OpenRouter](https://openrouter.ai/tencent/hy4-flash)
- [Tencent Hy4 — Artificial Analysis](https://artificialanalysis.ai/models/tencent-hy4)
- [Hy4 — Vals AI](https://www.vals.ai/models/tencent_hy4)
- [Hy4 Flash — Vals AI](https://www.vals.ai/models/tencent_hy4-flash)
- [Tencent Hy4: New AI model joins China's top tier — heise online](https://www.heise.de/en/news/Tencent-Hy4-New-AI-model-joins-China-s-top-tier-11513717.html)
- [Tencent releases Hy4 model weights with million-token context — TechNode](https://technode.com/2026/11/20/tencent-releases-hy4-model-weights-with-million-token-context/)
- [ERNIE 5.5 Flash Preview — Baidu ERNIE official blog (includes Hy4 comparison figures)](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [Model card: Tencent Hy4 flash](/posts/daily/2026-11-19-model-tencent-hy4-flash-en) — this site
- [Model card: Tencent Hy4 Preview](/posts/daily/2026-08-29-model-tencent-hy4-preview-en) — this site
- [Model card: Hy-Memory-30B-A3B](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series introduction
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
