---
title: "How fully transparent LLMs are built: OLMo 3's model flow and LLM360 K2's 360-degree openness"
date: 2026-09-06
category: ai
type: deep-dive
tags: [olmo, llm360, llm, open-source, pre-training, training-data]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 5
tldr: "\"Open-source LLM\" is a spectrum: weights-only (Llama), weights plus data (most fully open projects), or data order, intermediate checkpoints, and training logs all released (LLM360 K2, OLMo 3's model flow). This piece unpacks the two projects that pushed transparency furthest: OLMo 3 shipped the first fully open 32B thinking model in November 2025, and K2 is the first 65B-class model whose checkpoints even include optimizer states."
description: "A deep dive into OLMo 3's model flow and LLM360 K2's 360-degree open source: the definition spectrum of fully open, the research value of intermediate checkpoints and training logs, and when you actually need resources at this level."
draft: false
---

> [中文版](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining)

"Open-source LLM" covers wildly different things. Llama released weights only; [OLMo](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) opened the training data too; and the two projects in this piece—Ai2's OLMo 3 and MBZUAI's LLM360—push one level further: they open the **training process itself**, including per-stage checkpoints, training logs, and even the exact order of training data. We already covered the OLMo family's overall story ([OLMo: the only language model family that opens its training data](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en)); this piece focuses on OLMo 3 and LLM360, the two "open the process" routes.

## The openness spectrum: weights are just the starting point

Ranking today's mainstream release practices into three tiers makes the boundaries clear:

| Tier | What is released | Examples |
|---|---|---|
| Open weights | Final model weights | [Llama](https://www.llama.com/), Mistral |
| Fully open | Weights + training data + training code | [OLMo](https://allenai.org/blog/olmo3), [Marin](/en/posts/ai/2026-08-24-marin-535b-hero-run-en), Apertus |
| 360° open | Plus intermediate checkpoints, training logs, data order | [LLM360](https://github.com/LLM360), OLMo 3 |

This spectrum is not a single standard anyone invented; the community stacked it up piece by piece. Eleuther AI's [Pythia](https://github.com/EleutherAI/pythia) released 143 intermediate checkpoints back in 2023, proving the value; LLM360 proposed "360° open" at the end of that year, folding data order and logs into the definition; BLOOM showed how to publish a training process with the [BLOOM Book](https://huggingface.co/spaces/bigscience/bloom-book). OLMo 3's increment is not inventing any of these—it is applying the whole package to a **flagship-quality** model, treatment previously reserved for small models.

## OLMo 3: the model flow as the release artifact

Ai2 released [OLMo 3](https://allenai.org/blog/olmo3) on November 20, 2025, in two dense sizes, 7B and 32B. The official framing for what it opens is the "model flow": **the full lifecycle of a language model—every stage, every checkpoint, every data point, every dependency**. What you get is not a final weight file but an entire production line you can step into at any point.

Some concrete numbers:

- Pretraining uses [Dolma 3](https://huggingface.co/datasets/allenai/dolma): a cleaned source pool of roughly 9.3 trillion tokens, with the actual Dolma 3 Mix at about 5.9 trillion (~6T) tokens, a higher share of code and math than earlier Dolma releases, plus much stronger deduplication and decontamination.
- Three base-training stages: large-scale pretraining → midtraining (Dolmino, 100B tokens of high-quality math, code, and reasoning data) → long-context extension (Longmino), ending at 65K context—16x OLMo 2.
- Three post-training routes: Instruct (chat and tool use), Think (reasoning), and RL Zero (RLVR directly from base). RL Zero notably ships four domain-focused checkpoint series: math, code, instruction following, and general chat.
- On December 12, 2025, [OLMo 3.1](https://allenai.org/blog/olmo3) followed: Think 32B, after 21 more days of RL on 224 GPUs, gained 5+ points on AIME and 20+ points on IFBench, and the long-requested Instruct 32B shipped alongside. All weights are [Apache 2.0](https://huggingface.co/collections/allenai/olmo-3).

Nathan Lambert's [Interconnects](https://www.interconnects.ai/p/olmo-3-americas-truly-open-reasoning) post calls OLMo 3 32B "the first 32B (or larger) fully open reasoning model" and notes the Think 32B closes the gap to Qwen 3 32B to 1–2 points—while training on roughly 1/6 the tokens. Two more points matter for researchers: Qwen 3 never released a 32B base model, and the RL Zero route only enables clean RLVR studies (e.g., disentangling whether controversies like [Spurious Rewards](https://arxiv.org/abs/2506.10947) stem from data contamination) because the pretraining data is fully open and can be decontaminated—impossible with open-weight models.

## LLM360 K2: 65B, opened 360 degrees

LLM360 proposed "360° Open Source" in late 2023 with three principles: reproducibility, transparency, and accessibility. After Amber 7B and CrystalCoder 7B, the [K2 paper](https://arxiv.org/abs/2501.07124) published in January 2025 pushed the approach to the largest scale yet: K2 Diamond, a 65B-parameter model trained from scratch on 1.4 trillion tokens—to the authors' knowledge, **the first fully open-source LLM at this size**.

K2's results are not frontier-level, but the point is parity: it surpasses LLaMA-65B and rivals LLaMA2-70B with roughly 35% fewer FLOPs, with stronger math and coding. Training ran on 480 A100 GPUs using 4D parallelism (TP8 × PP4 × DP15).

What is genuinely rare is its release list:

- **140 intermediate checkpoints** (380 were saved; each exceeds 100GB, and 140 were uploaded first due to storage constraints), including optimizer states—the paper honestly notes that Amber's optimizer states were lost to early implementation errors.
- **The exact training data sequence** ([K2Datasets](https://huggingface.co/datasets/LLM360/K2Datasets)): data chunked to match each checkpoint, making token-level reproduction theoretically possible.
- **Complete W&B training logs**, plus the K2 [Prompt Gallery](https://huggingface.co/spaces/LLM360/k2-gallery) and [Evaluation Gallery](https://huggingface.co/spaces/LLM360/k2-eval-gallery)—a BLOOM-Book-style browseable record of every checkpoint's outputs on fixed prompts.
- **Training incident logs**: two malignant loss spikes during pretraining, documented with how the team diagnosed them (benign spikes usually come with large gradient norms and negligible updates; malignant ones persisting 100+ steps trigger a rollback) and how they were handled. "How do you handle loss spikes at 65B" was, before K2, a question only closed labs could answer.
- Weights under [Apache 2.0](https://huggingface.co/LLM360), data under ODC-By.

## What the model flow is worth: a model is a process, not a file

Read together, both projects point at the same conceptual shift: **the unit of a model has moved from "final weights" to "the entire training process."** The OLMo 3 blog puts it plainly: sharing only the end result "obscures the rich context needed to modify, adapt, and extend a model's capabilities"—many meaningful adjustments require integrating changes deep within the development pipeline, not merely at the final stage.

In practice, this opens a few doors:

- **A choice of intervention points**: every OLMo 3 stage checkpoint is downloadable. To inject domain data, resuming from a midtraining checkpoint beats both training from scratch and post-hoc fine-tuning; to run your own post-training, skip Ai2's Dolci datasets and use your own SFT/DPO recipe.
- **Comparable learning curves**: K2's 140 checkpoints let you plot "what a 65B model can do at every stage of 1.4T tokens"—the basis of its longitudinal capability study. Capabilities do not appear in the last step; looking back at the curve shows which data contributed what.
- **Contamination can be ruled out**: as noted above, only fully open models support clean conclusions in RLVR research.

## When you actually need resources at this level

Honest answer: most people don't. For inference, RAG, even ordinary fine-tuning, open-weight models suffice—and Qwen or Gemma are often stronger. 360°-open resources are for:

1. **RLVR / post-training researchers**: you need to confirm the training data did not contaminate your benchmarks; OLMo 3 RL Zero is the cleanest experiment available.
2. **Anyone resuming from intermediate checkpoints for domain adaptation**: instead of fumbling with a 7B toy, start from OLMo 3 Base 32B's midtraining checkpoint.
3. **Model behavior, interpretability, and data-influence researchers**: [OlmoTrace](https://allenai.org/blog/olmotrace) traces model outputs back to training data in real time, and K2's per-checkpoint galleries let you watch capabilities emerge directly.
4. **Teaching and reproduction**: K2's loss-spike incident logs and OLMo 3's full data-processing tooling ([datamap-rs](https://github.com/allenai/datamap-rs), [duplodocus](https://github.com/allenai/duplodocus)) are among the only cases where "how to train a large model" exists as readable documentation.

## Overall

The previous piece, [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en), showed how far data quality can push a small model; the two projects here show another kind of extreme—turning the training process itself into a public, researchable asset. OLMo 3 proves fully open and flagship performance can advance together (the first fully open 32B thinking model), and K2 proves that the full training run of a 65B model can be completely reproducible. For anyone training a model from scratch, they are the most complete reference answers available; as for when to just use an off-the-shelf model instead, the next piece, [When to train an LLM from scratch](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en), closes out the series.

## References

- [Olmo 3: Charting a path through the model flow to lead open-source AI (Ai2 blog)](https://allenai.org/blog/olmo3)
- [OLMo 3 paper (Hugging Face Papers / arXiv:2512.13961)](https://huggingface.co/papers/2512.13961)
- [Olmo 3: America's truly open reasoning models (Nathan Lambert, Interconnects)](https://www.interconnects.ai/p/olmo-3-americas-truly-open-reasoning)
- [LLM360 K2: Building a 65B 360-Open-Source Large Language Model from Scratch (arXiv:2501.07124)](https://arxiv.org/abs/2501.07124)
- [LLM360 GitHub organization (k2-train, k2-data-prep, and more)](https://github.com/LLM360)
- [OLMo 3 models & data collection (Hugging Face)](https://huggingface.co/collections/allenai/olmo-3)
- [OLMo: the only language model family that opens its training data (site post)](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en)
- [How Stanford Marin trains its 535B MoE (site post)](/en/posts/ai/2026-08-24-marin-535b-hero-run-en)
