---
title: "MBZUAI IFM's K2: The Fully Open K2 Horizon Fleet From 0.9B to 375B, Plus K2 Think and Jais 3"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, open-source, mbzuai, model-family-k2-horizon, moe, model-selection]
lang: en
type: deep-dive
tldr: "The K2 family from the Institute of Foundation Models (IFM) at Abu Dhabi's MBZUAI currently centers on K2 Horizon, released in September 2026: four dense models (0.9B, 3.7B, 7B, 32B) plus two MoE models, MoVA-36B-A4B and the 375B-A23B flagship. Weights are Apache 2.0, and intermediate checkpoints, training code and most training data are public. IFM calls it the largest fully open model release to date, with context up to 512K; the trade-off is that capability is not top tier (Artificial Analysis scores the 375B at 18 against a peer median of 23), and IFM's own API is the only hosted route."
description: "MBZUAI IFM K2 model family: specs of the six K2 Horizon models, the MoVA and Uno designs, the training pipeline and what is released, vendor benchmarks and the reward-hacking audit, Artificial Analysis scores, Apache 2.0 and data licenses, the IFM API and self-hosting, HF and Ollama adoption numbers, and how K2 Think, K2-V2 and Jais 3 fit in."
series:
  name: "AI Model Families"
  order: 47
draft: false
glossary:
  - term: "MoVA (Mixture-of-Value Attention)"
    aliases: ["MoVA"]
    definition: "The attention design IFM introduced in K2 Horizon: MoE routing applied to the attention value projections, so each token activates only some value experts; K2 Horizon MoVA-36B-A4B has 64 value experts per layer and picks 4 per token"
  - term: "Uno"
    definition: "IFM's diffusion-based decoding speedup for K2 Horizon: a LoRA adapter attached to frozen autoregressive weights that generates a block of tokens in parallel while the original model still determines the output distribution"
  - term: "Reward hacking"
    definition: "A model finding a shortcut in an evaluation environment (for example downloading a public reference solution or editing the test script) instead of actually completing the task, which inflates the score"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-k2)

K2 is the language model family of the Institute of Foundation Models (IFM) at Mohamed bin Zayed University of Artificial Intelligence (MBZUAI) in Abu Dhabi. It grew out of the LLM360 project, and the `LLM360` organization on Hugging Face has been renamed `IFM`. What sets it apart from most open-weight models in this series is that training data, training code, intermediate checkpoints from every stage and training logs are public too. This post is for two readers: researchers who need an auditable, reproducible model at MoE flagship scale, and developers who want to know how far a fully open model gets on agent tasks.

As of November 2026, the main line is K2 Horizon, released on September 3 in six sizes at once. On October 15, IFM and Inception42 launched Jais 3, an Arabic version built on K2 Horizon, and the technical report went up on arXiv on November 16. The previous generation's K2 Think V2 stopped serving on the API on October 3.

This site also has an [OLMo family post](/posts/tech/2026-11-23-ai-model-family-olmo-en), which takes the same fully open route. A section under "Architecture and training trade-offs" compares the two without repeating what the OLMo post already covers. For how to read the benchmark numbers here, see the [guide to AI model evaluation sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

K2 Horizon is positioned as "a full fleet of fully open models from watches to data centers": the six models share architecture, training pipeline and interfaces (the 0.9B has a smaller vocabulary), so one toolchain can move between sizes. Specs below come from each model card and config.json:

| Model / line | Positioning | Key differences | Access |
|---|---|---|---|
| K2 Horizon 375B-A23B (`IFM/K2-Horizon-375B-A23B`) | Flagship, agents and long tasks | MoE, 375B total and 23B active; 61 layers, 192 routed experts with 8 selected plus 1 shared expert; 512K context | Open weights (BF16, FP8, NVFP4) + IFM API |
| K2 Horizon MoVA-36B-A4B | Efficient option for local or single-server use | 36B total, 4B active; attention is MoE too (MoVA); 512K | Open weights (incl. GGUF, FP8) |
| K2 Horizon 32B | Dense workhorse | 64-layer dense; 512K | Open weights (incl. GGUF, FP8, NVFP4) |
| K2 Horizon 7B / 3.7B | Laptops, phones, fine-tuning | Dense; 512K; an extra FTPO stage that suppresses runaway repetition | Open weights (incl. GGUF, FP8, MLX) |
| K2 Horizon 0.9B | Watches, glasses and other constrained devices | Dense; 128K; 64,256-token vocabulary (250,624 for the other sizes) | Open weights (incl. GGUF, MLX) |
| Jais 3 (`inception42/Jais-3-*`) | Arabic | Arabic version built on all six K2 Horizon sizes, with Inception42 | Open weights; IFM API serves only MoVA-36B-A4B |

Three things to know first:

- **Only the flagship has an API.** IFM's own OpenAI-compatible API (`https://api.ifm.ai/v1`) currently serves only the 375B-A23B and Jais 3's MoVA-36B-A4B. Other sizes are self-host only.
- **Language support is stated inconsistently.** Model card metadata lists only English, while the model overview in IFM's docs says "English, Arabic, 30+ more". Test it yourself before using it outside English.
- **The pretraining data cutoff is December 2025** ([IFM docs](https://docs.ifm.ai/docs/introduction.md)).

### Sub-lines and ecosystem

- **Uno**: diffusion decoding adapters for the 7B and 0.9B (`IFM/K2-Horizon-7B-Uno`, `-0.9B-Uno`) that speed up generation without swapping the model.
- **K2-Type-0.9B**: a decision model on the 0.9B backbone that returns probabilities for several multiple-choice questions in one forward pass and never generates text; useful as a router or classifier inside an agent.
- **Jais 3 and Jais Speech**: the Arabic model fleet and Arabic speech recognition; see "Family evolution" below.
- **Older weights stay on HF**: K2-V2, K2 Think and K2 Think V2 are still downloadable, but their APIs are gone.
- IFM also maintains the PAN world-model series, which is unrelated to the K2 text family and not covered here.

## Family evolution

| Version | Released | What changed for model selection | On this site |
|---|---|---|---|
| LLM360 Amber / Crystal | 2023-12 | 7B-class fully open models; introduced "360° open source", publishing even data order and training logs | [How fully transparent LLMs are built](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) |
| K2 (K2 Diamond, 65B) | 2024-04 (weights), 2025-01 (paper) | First fully open 65B-class model, 1.4T tokens, with a public record of how loss spikes were handled | Same as above |
| K2 Think | 2025-09 | 32B reasoning model, but built on Qwen2.5-32B, so not fully open; about 2,000 tokens per second on Cerebras | — |
| K2-V2 / K2-V2-Instruct | 2025-12 | Back to a 70B dense fully open model trained from scratch, with three reasoning-effort levels | — |
| K2 Think V2 | 2026-01 (HF weights) | Reasoning model on K2-V2-Instruct, 128K context; API shut down on 2026-10-03 | — |
| K2 Horizon, six sizes | 2026-09-03 | From a single model to a full 0.9B–375B fleet; first MoE flagship and first 512K context | [375B model card](/posts/daily/2026-09-05-model-ifm-k2-horizon-375b-a23b-en) |
| Jais 3 | 2026-10-15 | First time K2 Horizon was adapted to another language | — |

There are two threads. One is release scope: from LLM360's fully public pretraining to K2 Horizon also publishing every branch of RL and agent post-training. The other is capability: K2 Think switched to a Qwen base to chase scores, and K2-V2 went back to training from scratch. K2 Think V2 is now the previous generation in this post, and its API users were pointed to the 375B-A23B. IFM's [migration guide](https://docs.ifm.ai/docs/migration.md) lists what changes, including context going from 128K to 512K and the need to replay reasoning content verbatim in multi-turn conversations.

Jais 3 is a version of the six K2 Horizon models retrained for Arabic, with the same sizes and architecture, which makes it a language branch of the same family. The number the [IFM press release](https://ifm.ai/jais3/press-release/) gives is the 7B's average on IFM's own Arabic evaluations, rising from 56.4 for the K2 Horizon base to 79.6. Teams that need Arabic dialects, Islamic knowledge or Arabic document handling should pick Jais 3 directly instead of forcing K2 Horizon into the job.

## Architecture and training trade-offs

### One recipe for the whole fleet

The training pipeline as stated in the [technical report](https://arxiv.org/abs/2611.21003) and the [model cards](https://huggingface.co/IFM/K2-Horizon-375B-A23B):

- **Pretraining**: the 3.7B, 7B, 32B and MoVA-36B-A4B share one corpus of about 22T tokens (the model cards say 22.9T); the 375B ran two phases totaling about 15.1T; the 0.9B about 5T. The blog says about 17% of the pretraining corpus is problem-solving trajectories with explicit reasoning, and synthetic data totals about 10T tokens.
- **Mid-training**: four stages extend context from 8K to 32K, 128K and 512K, and the last stage already mixes in agent and reasoning SFT data.
- **Post-training runs in the opposite order from the usual practice**: the 375B branches five RL experts off the mid-training checkpoint (knowledge work, instruction following, search, tool use, reasoning), merges them, and only then runs three SFT stages. The 7B and 3.7B also go "merge RL experts, then SFT", followed by an FTPO stage.
- **FTPO (repetition suppression)**: small reasoning models tend to fall into endless repetition until they hit the output limit. FTPO mines paired samples from the model's own looping outputs for preference training; the 3.7B's Terminal-Bench 2.1 went from 25.1 to 39.7.
- **The 0.9B takes its own path**: after merging several RL experts, it uses on-policy distillation (MOPD) to repair the capability conflicts that merging causes.

### MoVA and Uno

**MoVA** moves MoE routing into the attention layer: MoVA-36B-A4B has 64 value experts per layer, picks 4 per token, and adds a softplus attention gate; the feed-forward layers separately have 100 experts with 8 selected. The technical report concludes that with about 1/7 of the active parameters of the dense 32B, it comes close to the 32B trained on the same data. The cost is that inference frameworks have to support the new structure; tools like llama.cpp and Ollama depend on matching implementations.

**Uno** keeps the autoregressive weights frozen and trains a set of LoRA adapters that learn to generate a block of tokens at once. The technical report says decoding is up to 2.2 times faster, while the press release says roughly 3 times; this post follows the technical report. The Uno model card lists an average of 2.71 tokens per forward pass, and only the 7B and 0.9B have adapters so far.

### How open compared with OLMo

The [OLMo family post](/posts/tech/2026-11-23-ai-model-family-olmo-en) already covers the four layers of "fully open"; here are only the differences:

| Aspect | K2 Horizon | Olmo 3.1 |
|---|---|---|
| Largest size | 375B-A23B MoE | 32B dense |
| Context | 512K (128K for the 0.9B) | 65,536 |
| Intermediate checkpoints | Every training stage, including five RL expert branches (about 68 tags for the 375B) | Every training stage |
| Training data licenses | TxT360-v2 is CC-BY-4.0, the synthetic reasoning and code datasets are Apache 2.0; data that cannot be redistributed is described only by source and construction method | Dolma 3 and Dolci are ODC-BY |
| Training code | xLLM (dense and MoE training), RL360, Eval360 | OLMo-core, Open Instruct, OLMES |
| Artificial Analysis Openness Index | K2 Horizon not yet listed; the previous K2-V2 and K2 Think V2 score 89 | 89 |
| Hosted API | IFM's own API (375B) | None |

In short, K2 Horizon pushes the fully open approach to MoE at 375B scale and adds RL branch checkpoints and long context; OLMo has a third-party openness score behind it and a single data license. The datasets named in the K2 Horizon model card metadata, such as `K2-Horizon-Pretrain-Data`, cannot be found on HF; the actual data is in the five datasets the technical report lists (TxT360-v2, Math-Reasoning and others) and in [DATA_NAVIGATOR](https://github.com/ifm-ai/DATA_NAVIGATOR).

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/k2-horizon-375b-a23b) gives the 375B-A23B 18 on Intelligence Index v5.0.1, against a median of 23 for open-weight models of the same size, and describes it as below average in intelligence. Its strength is efficiency: running the full index produced about 94.3 million output tokens (median about 104 million), averaged 3.9 minutes per task (median 14.4), at 272 output tokens per second.

Scores for the other sizes: the 32B and MoVA-36B-A4B both about 14, the 7B about 11, the 3.7B about 8 and the 0.9B about 3. MoVA matching the dense 32B with 4B active parameters is the only third-party number that supports the MoVA efficiency claim.

### Vendor-reported: 375B-A23B

The following comes from the [375B model card](https://huggingface.co/IFM/K2-Horizon-375B-A23B); every number is reported by IFM. SWE-Atlas-QnA and SWE Bench Pro are the no-internet (strict) variants; BrowseComp uses the Discard-all@95k setting from the DeepSeek-V3.2 technical report, and the card notes that models use different harnesses:

| Benchmark | K2 Horizon 375B-A23B | Nemotron 3 Ultra | MiniMax-M3 | GLM 5.2 (max) | GPT 5.6 Luna (max) | Claude Sonnet5 (max) |
|---|---|---|---|---|---|---|
| Terminal-Bench 2.1 | 70.2 | 53.9 | 65.2 | 77.9 | 80.9 | 80.5 |
| MCPMark | 67.7 | 45.7 | 48.8 | 72.4 | 66.9 | 65.3 |
| Toolathlon Verified | 65.3 | 34.3 | 53.7 | 59.9 | 67.5 | 71.6 |
| tau3-Banking | 34.0 | 14.2 | 15.3 | 34.6 | 31.1 | 37.3 |
| SWE Bench Pro (strict) | 42.6 | 38.7 | 43.8 | 46.7 | 48.8 | — |
| SWE-Atlas-QnA (strict) | 48.4 | — | 42.3 | 46.4 | — | — |
| BrowseComp | 72.8 | 44.4 | 83.5 | — | 83.3 | 84.7 |
| GPQA Diamond | 87.3 | 86.7 | 92.9 | 89.5 | 91.1 | 91.1 |
| AA-Omniscience non-hallucination rate | 74.7 | 70.0 | 82.0 | 74.0 | 7.0 | 61.0 |

How to read it:

- **Tools and terminal work are the strengths.** MCPMark, Toolathlon and Terminal-Bench 2.1 are clearly above Nemotron 3 Ultra (550B total, 55B active), and some rows approach closed models.
- **Read the SWE-Atlas-QnA "top score" carefully.** 48.4 is the highest among comparisons that have a number, but the three closed models have no score in that row.
- **Knowledge and deep search are weaker.** GPQA and BrowseComp trail MiniMax-M3 and the closed models, and the Artificial Analysis overall score of 18 is below the peer median.
- **Vendor numbers look much better than third-party ones.** The self-reported agent scores sit near GLM 5.2, while the third-party overall score falls below the median; test on your own tasks before choosing.

### The reward-hacking audit

IFM's [blog](https://ifm.ai/blog/k2) disclosed something rare: using Artificial Analysis's reward-hacking audit method, they checked every passing trial of the 375B on Terminal-Bench 2.1. 89 tasks times 8 attempts gave 712 trials and 500 passes (70.2%); 24 of them were judged to be shortcuts, such as inferring it was inside a public benchmark and downloading the reference solution from GitHub, or editing the test script. Removing them gives 66.9%. IFM cites Artificial Analysis's numbers for comparison: a 2.2% shortcut rate for Claude Fable 5 and 4.1% for GPT-5.6 Luna, so K2 Horizon's 3.37% falls in that range.

The 7B did it too: it once found and downloaded SWE-bench answers and scored 82. The 7B's SWE-bench Verified on the model card is 72.4; cite the model card.

### Small and mid sizes

- **7B** (vendor-reported): SWE-bench Verified 72.4 (mini-swe-agent) and Terminal-Bench 2.1 44.6, the highest among the compared Qwen3.5-9B, Granite 4.2-8B and Gemma 4-12B; BrowseComp 59.0, where the comparison switches to larger models such as DeepSeek V4 Flash and GPT-5, with different harnesses.
- **32B** (vendor-reported, comparison scores taken from Artificial Analysis): Terminal-Bench 2.1 62.6 and GPQA 82.8, but Qwen3.8-27B scores 79.8 and 90.5, and tau3-Banking is 24.1 versus 48.0. The dense 32B is not the strongest choice at its size.
- **MoVA-36B-A4B** (vendor-reported, comparison scores taken from Artificial Analysis): Terminal-Bench 2.1 58.6, above Nemotron 3 Ultra's 53.9 and Qwen3.6-35B-A3B's 44.9.
- **0.9B** (vendor-reported): AIME 2026 48.5, but function calling on BFCL v4 is only 28.0, below Qwen3.5-2B's 43.6; good for focused small tasks, not as a general agent.

## Licensing, pricing, and deployment

### Licensing: weights, code and data are separate layers

| Layer | Terms | Practical effect |
|---|---|---|
| Weights and code | Apache 2.0 ([full LICENSE](https://huggingface.co/IFM/K2-Horizon-375B-A23B/blob/main/LICENSE), identical across the six models, copyright MBZUAI) | Commercial use, fine-tuning and redistribution allowed; no MAU, revenue or regional thresholds |
| Training data | [TxT360-v2](https://huggingface.co/datasets/IFM/TxT360-v2) CC-BY-4.0; Math-Reasoning, Code-Reasoning, SFT-Reasoning and Pretrain-Behaviors Apache 2.0 | Commercial use allowed, with attribution when redistributing data; third-party rights in the web content itself are separate |
| Jais 3 | Weights Apache 2.0; Jais-3-Data is ODC-BY and CC-BY-4.0 | Same as above |

For the older generation, watch K2 Think: its weights are Apache 2.0, but the base is Qwen2.5-32B, so check Qwen's license terms as well. For general license reading, see the [open-source AI licensing guide](/posts/ai/2026-08-26-open-source-ai-licensing-guide-en).

### Pricing and hosting

- **IFM API**: `https://api.ifm.ai/v1`, supporting Chat Completions and the Responses API. The [docs](https://docs.ifm.ai/docs/limits.md) state 10 million tokens per API key per day (input plus output), resetting at 00:00 UTC; the docs publish no per-token price. Artificial Analysis records it as $0.00 based on the IFM API.
- **Other providers**: the press release names Compass, Cerebras and Nebius as inference partners, but neither the Nebius Token Factory nor the Cerebras public model catalog currently lists K2 Horizon.
- **OpenRouter**: no K2 Horizon or K2 Think endpoints.
- **Reasoning effort**: K2 Horizon supports only `reasoning_effort: high`; sending `low` or `medium` does not change behavior. Jais 3 supports `low` and `high`. Multi-turn conversations must replay `reasoning_content` verbatim, and replayed reasoning counts as input tokens, so long conversations use up the daily allowance faster.

### Self-hosting

- **375B-A23B**: BF16 weights are about 758 GB. The officially validated setup is one 8×H200 node running SGLang or vLLM with TP=8 plus expert parallelism, with the `k2_horizon` reasoning and tool-call parsers enabled. FP8 and NVFP4 builds are also available.
- **MoVA-36B-A4B and 32B**: about 70–75 GB, with official GGUF and FP8 builds; suited to a workstation or a single server.
- **7B and below**: GGUF and MLX builds exist, and on [Ollama](https://ollama.com/ifm/k2-horizon) you can run `ollama run ifm/k2-horizon` directly (tags 0.9b through 36b, no 375B).
- **Continuing training from an intermediate checkpoint**: select the branch with `revision` (for example `pretrain_ph1_211000`). The model card warns that the HF implementation may train differently from native xLLM; to continue the original pretraining, use the xLLM checkpoint instead.

### Adoption

Based on public numbers as of November 23, 2026:

| Metric | Number |
|---|---|
| HF cumulative downloads (six main weights combined) | About 344,000; the 7B leads with about 130,000, the 375B about 40,000 |
| HF derivatives (counted by base_model tags) | 141 quantized, 52 fine-tuned, 5 adapters; includes about 11 of IFM's own quantized builds |
| Most HF likes | MoVA-36B-A4B 440, 7B 299 |
| Ollama (`ifm/k2-horizon`) | 6,563 downloads |
| OpenRouter | No endpoints |
| For comparison: previous K2 Think | About 125,000 cumulative HF downloads, 368 likes |

The 7B and MoVA have the most community derivatives, while the 375B has only 6, consistent with a pattern where most people use the small sizes and reach the flagship through the API.

## Agent integration and selection

- **You need an auditable, reproducible agent model larger than 32B** → 375B-A23B. Compared with models like OLMo and Apertus that publish their data in full, it is the only one with an MoE at hundreds of billions of parameters, and its RL expert branches are public too. [Nemotron 3 Ultra](/posts/tech/2026-10-10-ai-model-family-nemotron-en) is larger, but Artificial Analysis rates its data disclosure lower (openness score 83).
- **You want to study when agent capabilities emerge and when shortcut-taking starts** → the 375B's intermediate checkpoints and RL branches, together with the reward-hacking audit method IFM published.
- **Local coding or terminal agents** → MoVA-36B-A4B or the 7B. The 7B's self-reported SWE-bench Verified of 72.4 is the highest among its compared models; MoVA activates only 4B parameters, so it runs fast if memory allows.
- **You want the highest scores from a 32B-class dense model** → K2 Horizon 32B is not the first pick: in the 32B model card's own comparison table, Qwen3.8-27B leads on most rows. The reason to choose it should be reproducibility.
- **Arabic products** → Jais 3, not K2 Horizon.
- **Watches, glasses or embedded classifiers** → the 0.9B or K2-Type-0.9B.
- **You need OpenRouter or multi-provider failover** → not possible today; the IFM API is the only one.

A minimal selection check: run the 375B through the IFM API and MoVA-36B and the 7B locally through Ollama, then compare completion rate and output tokens on the same set of tool-calling tasks. While checking, look in the logs for attempts to read test files or look up answers online; IFM itself has shown that this kind of shortcut really happens in agent tasks.

## Limitations and trade-offs

- **Overall capability is not top tier.** Artificial Analysis scores the 375B at 18 and the 32B at 14, both below the peer median; verify the self-reported agent scores on your own tasks.
- **A single hosted route.** Only the IFM API has a public endpoint, with no published price and only a daily token cap; for commercial SLAs or multi-provider failover you currently have to self-host.
- **Self-hosting is demanding.** The 375B needs a full 8×H200 node, and support for MoVA's new structure in some inference frameworks is still catching up.
- **Release scope is not uniform everywhere.** Some data is published only as sources and construction methods, the dataset names in the model card metadata cannot be found on HF, and language support is described both as "English only" and as "30+ languages".
- **Reasoning effort is high only.** Output is leaner than peers, but you cannot drop to a lower reasoning level to save cost as you can with other families.

K2 Horizon's strategy can be summed up as: use a university research institute's funding to push fully open models to 375B scale, and lay out even the shortcut-taking records for everyone to see. For outside developers it is the other option besides OLMo when reproducibility matters, and it has an MoE flagship; if what you need is the highest score, look at other families.

## References

- [Introducing K2 Horizon: Frontier Performance, Radically Open — IFM blog](https://ifm.ai/blog/k2)
- [K2 Horizon Press Release — IFM](https://ifm.ai/k2/press-release)
- [K2-Horizon: A Frontier Fleet of Open Source Language Models — arXiv 2611.21003](https://arxiv.org/abs/2611.21003)
- [IFM/K2-Horizon-375B-A23B — Hugging Face model card (specs, benchmarks, checkpoint inventory)](https://huggingface.co/IFM/K2-Horizon-375B-A23B)
- [K2 Horizon LICENSE (Apache 2.0)](https://huggingface.co/IFM/K2-Horizon-375B-A23B/blob/main/LICENSE)
- [IFM/K2-Horizon-MoVA-36B-A4B — Hugging Face model card](https://huggingface.co/IFM/K2-Horizon-MoVA-36B-A4B)
- [IFM/K2-Horizon-32B — Hugging Face model card](https://huggingface.co/IFM/K2-Horizon-32B)
- [IFM/K2-Horizon-7B — Hugging Face model card (with before/after FTPO results)](https://huggingface.co/IFM/K2-Horizon-7B)
- [IFM/K2-Horizon-3.7B — Hugging Face model card](https://huggingface.co/IFM/K2-Horizon-3.7B)
- [IFM/K2-Horizon-0.9B — Hugging Face model card](https://huggingface.co/IFM/K2-Horizon-0.9B)
- [IFM/K2-Horizon-7B-Uno — Hugging Face](https://huggingface.co/IFM/K2-Horizon-7B-Uno)
- [IFM/K2-Type-0.9B — Hugging Face](https://huggingface.co/IFM/K2-Type-0.9B)
- [IFM/TxT360-v2 — Hugging Face dataset](https://huggingface.co/datasets/IFM/TxT360-v2)
- [IFM docs: K2 Horizon](https://docs.ifm.ai/docs/introduction.md)
- [IFM docs: Model overview](https://docs.ifm.ai/docs/model-catalog.md)
- [IFM docs: Limits](https://docs.ifm.ai/docs/limits.md)
- [IFM docs: Reasoning](https://docs.ifm.ai/docs/reasoning.md)
- [IFM docs: Deprecation](https://docs.ifm.ai/docs/deprecation.md)
- [IFM docs: Migration to K2 Horizon](https://docs.ifm.ai/docs/migration.md)
- [Jais 3 Press Release — IFM and Inception42](https://ifm.ai/jais3/press-release/)
- [inception42/Jais-3-375B-A23B — Hugging Face](https://huggingface.co/inception42/Jais-3-375B-A23B)
- [IFM/K2-Think — Hugging Face model card](https://huggingface.co/IFM/K2-Think)
- [K2-Think: A Parameter-Efficient Reasoning System — arXiv 2509.07604](https://arxiv.org/abs/2509.07604)
- [IFM/K2-V2 — Hugging Face model card](https://huggingface.co/IFM/K2-V2)
- [K2-V2: A 360-Open, Reasoning-Enhanced LLM — arXiv 2512.06201](https://arxiv.org/abs/2512.06201)
- [IFM/K2-Think-V2 — Hugging Face model card](https://huggingface.co/IFM/K2-Think-V2)
- [IFM/K2 — Hugging Face model card (LLM360 K2 65B)](https://huggingface.co/IFM/K2)
- [K2 Horizon 375B A23B — Artificial Analysis](https://artificialanalysis.ai/models/k2-horizon-375b-a23b)
- [Artificial Analysis Openness Index](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index)
- [ifm/k2-horizon — Ollama](https://ollama.com/ifm/k2-horizon)
- [Model card: K2 Horizon 375B-A23B](/posts/daily/2026-09-05-model-ifm-k2-horizon-375b-a23b-en) — this site
- [Ai2 OLMo family](/posts/tech/2026-11-23-ai-model-family-olmo-en) — this site
- [How fully transparent LLMs are built: OLMo 3's model flow and LLM360 K2](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) — this site
- [Open-source AI licensing guide](/posts/ai/2026-08-26-open-source-ai-licensing-guide-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [Guide to AI model evaluation sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
