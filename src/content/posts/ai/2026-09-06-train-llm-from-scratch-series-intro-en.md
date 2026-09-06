---
title: "Training an LLM from Scratch: A Project Spectrum from $0.4 to 65B"
date: 2026-09-06
category: ai
type: guide
tags: [llm, training, open-source, pytorch, pre-training, learning-path]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 0
tldr: "Open-source projects have pushed the cost of training an LLM from scratch absurdly low: MiniMind runs the full PreTrain-to-RL pipeline for about $0.4 (2 hours on a single RTX 3090), while at the other end OLMo 3 and LLM360 K2 publish everything — data, code, and stage-by-stage checkpoints of 65B models. This series walks the whole project spectrum from $0.4 to 65B in 7 articles, and flags where the map is biased."
description: "Series introduction for 'Training an LLM from Scratch': 7 articles covering the open-source pre-training project spectrum — cost, data, and transparency — from MiniMind's $0.4 tutorial project to LLM360 K2's fully reproducible 65B run, with a coverage matrix, bias annotations, and a reading path."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-06-train-llm-from-scratch-series-intro)

Calling an LLM through an API and training one from scratch are the two ends of the same map. Everyone has tried the former; a few years ago the latter was a "big-lab-only" activity — billion-dollar budgets and thousands of GPUs. [MiniMind](https://github.com/jingyaogong/minimind) pulled that line down to about $0.4 (the cost of renting one RTX 3090 for two hours), while at the other end [LLM360 K2](https://github.com/LLM360/k2-train) shows what "fully reproducible" looks like at industrial scale: 65B parameters, 1.4T tokens. This is the introduction to the "Training an LLM from Scratch" series (7 articles): first we define what we selected and why, then lay out the cost spectrum, the coverage matrix, and the bias annotations, and finally the learning path.

## What this series covers

The population definition for "training an LLM from scratch": **projects that publish the complete training pipeline — code plus data or a full recipe — where the model is pretrained from random initialization.** We exclude three kinds of projects commonly mistaken for "from scratch": weight-only releases (models like Llama), fine-tuning only ([Llama-Factory](https://github.com/hiyouga/LLaMA-Factory) and the like), and pure inference frameworks. In other words, this series only includes projects where "you get every button" — training hyperparameters, the data recipe, and checkpoints at each stage.

## Why train from scratch: the learning-vs-product tradeoff

The same motivation, "I want to understand LLMs," grows into two very different shapes at either end of the spectrum. This is the most important classification axis of the series:

- **Learning-oriented**, typified by [MiniMind](https://github.com/jingyaogong/minimind): 64M parameters, about $0.4 and 2 hours, 56.8k stars, with the goal that "everyone can read every line of code." Its value is not the model itself — 64M is useless for any real task — but the decision chain it lays open: why 8 layers, why a 6,400-token vocabulary, why GRPO is more stable than PPO.
- **Product-oriented**, typified by [LLM360 K2](https://github.com/LLM360/k2-train) (65B / 1.4T tokens): the training goal is to compete with commercial models on real tasks, and "full reproducibility" is its biggest asset — for any training decision you want to verify, you can find the original code, data, and intermediate checkpoints.

In between there is a whole pricing ladder: learn algorithms from Karpathy's minimal codebases, learn data efficiency from [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini), learn industrial transparency from the [OLMo](https://github.com/allenai/OLMo) family. The decisive question is one sentence: **is your question "why is this written this way," or "can this be reproduced"?** — pick the cheap tutorial project for the former, and for the latter pick the most open project, not the cheapest one.

## The cost spectrum

The same goal can cost six orders of magnitude differently: budget, parameter scale, and openness all shift together.

| Project | Size | Budget | Data | Positioning | Series part |
|---|---|---|---|---|---|
| [MiniMind](https://github.com/jingyaogong/minimind) | 64M | ~$0.4 / ~2h on one 3090 | full-stage Qwen3-style data | full-pipeline tutorial (PreTrain→SFT→RL) | [1](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) |
| [nanochat](https://github.com/karpathy/nanochat) (same lineage as [llm.c](https://github.com/karpathy/llm.c)) | GPT-2/GPT-3-small territory | ~$100 / ~4h on 8×H100; $300 = GPT-2 grade; $1,000/41h ≈ GPT-3-small | public data + time-to-GPT-2 racing | minimal, single-node | [2](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en) |
| Chinese community: [baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese), [ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese), [Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM) | 0.2B–1B | 4GB VRAM to 8×H800 | mostly Chinese corpora | Chinese-first teaching and long-run testing | [3](/en/posts/ai/2026-09-06-chinese-community-small-llm-training-en) |
| [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini) | 2.4B | academic (1.08T tokens) | data recipe + full W&B logs | data-efficiency research (ACL 2025 Oral) | [4](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) |
| [OLMo 3](https://huggingface.co/allenai/Olmo-3-1125-32B) (2025-11) | 7B / 32B (incl. Think 32B reasoning model) | industrial | Dolma 3, ~6T tokens | stage checkpoints, Apache 2.0 | [5](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) |
| [LLM360 K2](https://github.com/LLM360/k2-train) | 65B | industrial | 1.4T tokens | fully reproducible | [5](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) |
| [SmolLM3](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | 3B | 11.2T tokens (full recipe published 2025-07) | testing the data ceiling of small models | —(covered in parts 5–6) | — |

A few numbers worth remembering: Karpathy spent roughly $43,000 training GPT-2 in 2019; nanochat's "time to GPT-2" speedrun has squeezed that to the ~$100 level in under 4 hours (the early-2026 official record is ~$48 / 2 hours; spot pricing varies). YuLan-Mini reaches parity or better than 7–18T-token baselines on math and code with 1.08T tokens. SmolLM3 shows a 3B model can ingest 11.2T tokens without saturating — TinyLlama's 1.1B eating 3T without saturation was the precedent.

## Coverage matrix

Framed as a matrix, you can see which dimensions this series has a dedicated part for and which only get a passing mention:

| Dimension | Population representatives | Series coverage |
|---|---|---|
| Extremely cheap teaching (<$10) | MiniMind, baby-llama2-chinese | ✅ parts 1, 3 |
| Minimal engineering ($100–1,000) | nanochat, llm.c | ✅ part 2 |
| Chinese-data-first | baby-llama2-chinese, ChatLM-mini-Chinese, Steel-LLM | ✅ part 3 |
| Data-efficiency research | YuLan-Mini | ✅ part 4 |
| Industrial full openness | OLMo 3, LLM360 K2 | ✅ part 5 |
| Open recipe but smaller scale | SmolLM3, MiniCPM, etc. | ⚠️ partially covered |
| Retired research tools | Pythia, TinyLlama | ⚠️ discussed below |
| Non-Transformer architectures | RWKV, Mamba family | ❌ not covered |
| Non-English / non-Chinese circles | LLM-jp, etc. | ❌ not covered |

**Retired cases**: we mention [Pythia](https://github.com/EleutherAI/pythia) (EleutherAI's 154-checkpoint research suite) and [TinyLlama](https://github.com/jzhang38/TinyLlama) (1.1B, 3T tokens), not because they broke, but because they finished their job and retired gracefully — Pythia's value lies in the intermediate checkpoints it left for research; TinyLlama proved "small models can also eat tokens to saturation." They are "past-tense tools still in use," used here only as reference points.

## Bias note: what this map omits

- **GitHub-star-selected population**: selection leans heavily toward English and Chinese circles (GitHub's star mechanism inherently favors large language markets), so projects from non-English, non-mainstream communities are easily missed — [LLM-jp](https://huggingface.co/llm-jp) has a complete Japanese ecosystem and high openness but did not make the cut on stars and mindshare alone. This is a known gap in this survey.
- **Retired cases are only research-oriented Pythia/TinyLlama**: "retired" here means "finished the job and got overtaken," not failed. Pythia's 154 checkpoints remain tools for studying learning dynamics; TinyLlama delivered the experiment "a 1B model trained on 3T tokens." Including them shows that obsolescence in this category usually means someone did something to completion.
- **Architecturally one-sided**: every selection is a Transformer. RWKV and Mamba-style non-attention sequence models were once hot alternative paths but aren't part of the "fully open pipeline" selection here (or the main toolchains didn't follow) — for alternatives, [CS336: Attention, MoE, and Mamba](/en/posts/ai/2026-08-22-cs336-attention-moe-en) on this site is an existing match.

## The arc

```
$0.4 ─────────────────────────────→ 65B (hundreds of thousands of dollars)
teaching / readability ────────→ product / reproducibility
English → Chinese → academic data-efficiency ──→ industrial transparency
```

| order | Article | Main thread |
|---|---|---|
| 0 | This introduction | selection criteria, cost spectrum, bias |
| 1 | [MiniMind: train an LLM from scratch for $0.4](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) (published) | full-pipeline teaching at the $0.4 grade |
| 2 | [Karpathy: nanochat, nanoGPT, and llm.c](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en) | minimalism and the time-to-GPT-2 race |
| 3 | [Chinese community small-model training](/en/posts/ai/2026-09-06-chinese-community-small-llm-training-en) | data-first floor experience for Chinese |
| 4 | [YuLan-Mini: data-efficient pretraining](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) | 1.08T vs larger budgets: recipe and ablations |
| 5 | [OLMo 3 and LLM360: fully open pretraining](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) | checkpoint-grade transparency and full reproducibility |
| 6 | [When to train an LLM from scratch](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en) | decision framework: fine-tuning vs RAG, and when NOT to |

## How to read this

- **Hands-on readers**: parts 1 (MiniMind) → 2 (Karpathy) → 3 (Chinese community). Run the README once and you will have first-hand experience with training "your own" model from scratch.
- **Research readers**: parts 4 → 5. For a solid theoretical base, first read the [CS336 overview](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) — the reference course of this series — then come back for the cost and openness reality.
- **Decision-makers / budget holders**: read part 6's decision framework first, then backfill the cases you need.

Each part is self-contained, but the arc's order follows the graduation of cost magnitude and data complexity; following it is the least tiring path.

## Bottom line

The two ends of this spectrum answer different questions: MiniMind proves "cheap can teach," OLMo 3 / LLM360 prove "expensive can verify" — the common denominator is openness, just with different objects (code vs data + logs). The first published part is [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en); the rest climb the cost ladder, and the last part re-examines "when not to spend this money at all." The site's [CS336 series](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) and [OLMo: full openness](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) give you the theoretical base and the previous generation's full picture; [Marin's 535B hero run](/en/posts/ai/2026-08-24-marin-535b-hero-run-en) shows another viable route for an individual pushing the limit. Any order works, but we suggest starting with [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) — it's the only one you can start on tonight.

## References

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [karpathy/nanochat GitHub](https://github.com/karpathy/nanochat)
- [karpathy/llm.c](https://github.com/karpathy/llm.c)
- [Llama-Factory](https://github.com/hiyouga/LLaMA-Factory)
- [YuLan-Mini GitHub (RUC-GSAI)](https://github.com/RUC-GSAI/YuLan-Mini)
- [OLMo GitHub (AI2)](https://github.com/allenai/OLMo)
- [Olmo-3-1125-32B model card (Hugging Face)](https://huggingface.co/allenai/Olmo-3-1125-32B)
- [LLM360 K2 training code (k2-train)](https://github.com/LLM360/k2-train)
- [SmolLM3-3B model card (Hugging Face)](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [TinyLlama GitHub (jzhang38)](https://github.com/jzhang38/TinyLlama)
- [Pythia GitHub (EleutherAI)](https://github.com/EleutherAI/pythia)
- [baby-llama2-chinese GitHub](https://github.com/DLLXW/baby-llama2-chinese)
- [ChatLM-mini-Chinese GitHub](https://github.com/charent/ChatLM-mini-Chinese)
- [Steel-LLM GitHub](https://github.com/zhanshijinwat/Steel-LLM)