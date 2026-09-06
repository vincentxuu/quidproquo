---
title: "Karpathy's nano lineage: nanoGPT, llm.c, and nanochat"
date: 2026-09-06
category: ai
type: deep-dive
tags: [karpathy, nanochat, nanogpt, llm, training, pre-training, cuda]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 2
tldr: "A tour of Karpathy's three teaching repos: nanoGPT (2022, ~300 lines each to reproduce GPT-2 124M), llm.c (pure C/CUDA training), and nanochat (2025-10, one speedrun.sh from tokenizer to WebUI). $100 and 4 hours on 8×H100 buys a chatty model; GPT-2-grade capability is now down to about 2 hours and $48."
description: "How the three Karpathy nano repos differ in positioning: nanochat's full-stack pipeline and cost tiers, why llm.c chose C/CUDA, nanoGPT's historical role, and the English-only data plus 8-GPU-node threshold that limit it."
draft: false
---

> [中文版](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c)

The previous post pushed "training an LLM from scratch" down to one RTX 3090 and 3 RMB. This post looks at the other end of the same lineage: [nanoGPT](https://github.com/karpathy/nanoGPT), [llm.c](https://github.com/karpathy/llm.c), and [nanochat](https://github.com/karpathy/nanochat), which [Andrej Karpathy](https://karpathy.ai/) released in sequence from 2022 to 2025. All three are English-language GitHub star repos — this series leans toward English- and Chinese-language community stars, and the Karpathy lineage is the best-known lineage on the English side — but each solves a different problem: nanoGPT teaches you how a GPT grows, llm.c teaches you how kernels are written, and nanochat packs an entire ChatGPT product line into one script.

## Positioning: three repos, three resource scales

Three repos from the same author in sequence, and the positioning differences matter more than the technical evolution:

| Repo | Scope | Resource bar | One-line summary |
|---|---|---|---|
| [nanoGPT](https://github.com/karpathy/nanoGPT) | Pretraining and finetuning only | Single A100 to start | The "teeth over education" rewrite |
| [llm.c](https://github.com/karpathy/llm.c) | Pretraining only | A CPU can run the reference build | PyTorch replaced with pure C/CUDA |
| [nanochat](https://github.com/karpathy/nanochat) | Full stack, tokenizer to WebUI | 8×H100 node (~$24/hr) | Train your own ChatGPT in one evening |

nanochat's README opens by calling it "the simplest experimental harness for training LLMs", designed for a single GPU node and covering all major LLM stages: tokenization, pretraining, finetuning, evaluation, and inference. Compared with [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en), covered earlier in this series, the differences are threefold: **resource scale** (MiniMind runs on one 3090; nanochat assumes an 8×H100 node), **industrial-grade pretraining** (nanochat directly adopts 2025 state-of-the-art practice — the [Muon](https://github.com/KellerJordan/Muon) optimizer, Flash Attention 3, value embeddings — rather than simplifying for pedagogy), and **teaching focus** (MiniMind collapses every PO algorithm into one objective function; nanochat teaches "how an entire product line runs").

## nanochat: one speedrun.sh through the full stack

When it launched on October 13, 2025, Karpathy's tagline was "The best ChatGPT that $100 can buy". [speedrun.sh](https://github.com/karpathy/nanochat/blob/master/runs/speedrun.sh) goes from environment setup to a web UI on a blank 8×H100 node:

```
speedrun.sh
 ├─ Download FineWeb-EDU pretraining shards (~24GB)
 ├─ scripts.tok_train    Rust BPE tokenizer (~1 minute)
 ├─ scripts.base_train   8-GPU pretraining, d20 (~3 hours)
 ├─ scripts.mid_train    smol-SmolTalk + MMLU + GSM8K mix (~8 minutes)
 ├─ scripts.chat_sft     SFT (~7 minutes)
 ├─ scripts.chat_rl      GRPO on GSM8K (optional, commented out by default)
 └─ scripts.chat_cli / chat_web    CLI and FastAPI WebUI, plus a report.md
```

The launch README defined three cost tiers: the **$100 tier** (d20, ~4 hours) trains a model you can talk to, with a CORE score of 0.22 — slightly above GPT-2 large's 0.21; the **~$300 tier** (d26, ~12 hours) slightly beats GPT-2's CORE 0.2565; and the **~$1,000 tier** (~41.6 hours) "quickly becomes a lot more coherent and can solve simple math/code problems and take multiple choice tests" (Karpathy's launch tweet). The gaps between tiers are nearly linear — the `--depth` flag is the single complexity dial, with width, head count, learning rate, and training horizon all derived from it.

Two details worth pausing on:

- **A homegrown tokenizer, in Rust**. Karpathy judged his own [minbpe](https://github.com/karpathy/minbpe) (Python) too slow and Hugging Face's [tokenizers](https://github.com/huggingface/tokenizers) too bloated, so nanochat ships rustbpe — regex splitting plus byte-level BPE, the same algorithm OpenAI uses, compiled with maturin; inference switches to [tiktoken](https://github.com/openai/tiktoken). The vocab is 65,536 and the compression ratio on FineWeb is about 4.8 characters per token: better than GPT-2's tokenizer across the board (except math) and slightly ahead of GPT-4 on English — because the training corpus is FineWeb itself, so the tokenizer fits that document distribution. Which also exposes the limitation: [FineWeb-EDU](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1) is English text, and multilingual compression clearly lags GPT-4.
- **Pretraining has an explicit pass line**. Training periodically evaluates the CORE metric from the [DCLM paper](https://arxiv.org/abs/2406.11794) (a composite over 22 tasks), and the loss is reported as bits per byte rather than cross-entropy — bpb normalizes away token length, so the number survives a tokenizer swap. The d20 has ~560M parameters and, following the [Chinchilla scaling law](https://arxiv.org/abs/2203.15556) at 20:1, trains on 11.2B tokens, about 4e19 FLOPs in total.

After SFT you can talk to your own model via `chat_cli` or `chat_web` (FastAPI), and the run finishes by writing a `report.md` with an eval table across the BASE/MID/SFT/RL stages plus total wall-clock time. The RL stage is a heavily simplified GRPO: no trust region or KL regularization, on-policy, token-level normalization, applied only to GSM8K and off by default — Karpathy himself calls this part "not super well-tuned".

By early 2026 the line was still moving fast: the January 29 d24 run compressed "beating GPT-2" to [3.04 hours and ~$73](https://github.com/karpathy/nanochat/discussions/481); as of March 2026 the leaderboard record is [1.65 hours](https://github.com/karpathy/nanochat), and the README's speedrun description now reads "~2 hours, $48". Training GPT-2 cost $43,000 in 2019; seven years later it is under one percent of that.

## llm.c: why C/CUDA

Between nanoGPT and nanochat, Karpathy took a different direction with [llm.c](https://github.com/karpathy/llm.c), subtitled "LLM training in simple, raw C/CUDA — no need for 245MB of PyTorch or 107MB of cPython".

It is not a trade of education for minimal dependencies; the two goals run in parallel:

- **Education**: `dev/cuda/` is a library of hand-written kernels — forward and backward for attention, layernorm, matmul, all laid out and documented, ordered from simple to fast versions. Karpathy says this explicitly: the fast kernels exist to establish an "expert upper bound", a unit of measurement — you can say your hand-written kernels reach 80% of cuBLAS speed.
- **Performance**: the mainline `train_gpt2.cu` does mixed-precision training and, per the README, runs about 7% faster than PyTorch Nightly, targeting reproduction of the GPT-2 and GPT-3 miniseries.

The engineering discipline is equally explicit: `train_gpt2.c` is a ~1,000-line CPU fp32 reference implementation in one readable file, and every change is covered by unit tests asserting that the C code's logits, loss, and 10 Adam updates match the PyTorch reference exactly. Karpathy also set a rule — a PR that gains 2% but costs 500 lines of complex C gets rejected. That restraint shows up in the fork ecosystem: a dozen-plus ports (Rust, Zig, Go, Swift, Metal, AMD support, and more) live in separate repos, and the root folder stays C/CUDA only.

To see where llm.c's actual increment lies: hand-written kernels are not new. What is new is **laying out "which kernels LLM training actually needs" as one complete, readable curriculum**, with PyTorch as the reference implementation verifying correctness. Data preparation (downloading, tokenizing into .bin files) is still done by Python scripts — it honestly does not pretend C covers everything.

## nanoGPT's historical role

[nanoGPT](https://github.com/karpathy/nanoGPT) (December 2022) is a rewrite of [minGPT](https://github.com/karpathy/minGPT) whose README describes itself as "prioritizes teeth over education" — no longer purely educational, it actually runs. `train.py` is a ~300-line training loop and `model.py` a ~300-line model definition; on one side, torchrun across 8×A100 reproduces GPT-2 124M in about 4 days, and on the other, the Shakespeare character-level model produces samples after 3 minutes on a single A100, with CPU and MacBook options for the GPU-poor. Paired with the [Zero to Hero](https://karpathy.ai/zero-to-hero.html) video series, it became the entry point through which nearly everyone understood GPT training after 2023.

Its lasting influence came through two channels: [modded-nanoGPT](https://github.com/KellerJordan/modded-nanogpt) gamified the repo — clear metrics, a leaderboard, the community racing for records — and nanochat's Muon, value embeddings, and other pretraining tricks largely originate there; and in November 2025 nanoGPT's README pinned the official handoff: "nanoGPT has a new and improved cousin called nanochat. It is very likely you meant to use/find nanochat instead." A 62,000+-star repo formally marked deprecated by its own author — that kind of clean closing statement is rare among well-known open-source projects.

## Limitations

- **English-first**. The pretraining data is FineWeb-EDU, the tokenizer's multilingual compression clearly trails GPT-4, and the pipeline has no Chinese corpus. If you want a small model that speaks Chinese from scratch, the MiniMind route is more direct; Chinese-community approaches are the next post in this series.
- **The 8-GPU node is a real bar**. nanochat targets 8×H100 (~$24/hr); single-GPU works (it automatically switches to gradient accumulation) but takes 8 times longer, and cards below 80GB require tuning `--device-batch-size`. CPU/MPS can run runcpu.sh, but Karpathy says outright "you will not get strong results in this way".
- **Incomplete evals**. Karpathy himself notes in the launch post that the evals are still missing a lot; ChatCORE is his own Chat-side extension of CORE, not a community-standard metric.
- **RL is not general RLHF**. One task (GSM8K), one simplified GRPO, and the result drifts toward math problems rather than general chat.
- The model itself is a kindergarten-grade ChatGPT clone — ask who you are and it starts hallucinating. That is both a feature and the limitation: $100 buys you the pipeline, not the capability.

## Overall

The three nano repos are three answers to the same question: **what does the smallest readable version of LLM training look like**. nanoGPT answers the model and training loop (~300 lines × 2), llm.c answers kernels and hardware (taking PyTorch apart), and nanochat answers the whole pipeline — tokenizer, pretraining, SFT, RL, inference, WebUI — plus a scaling dial and a report card. The shared trade-off across all three is "readability over configurability": no giant config objects, no model factories; changing something means changing code.

The audience splits into three tiers too: start with nanoGPT (or the Zero to Hero videos) to understand GPT training for the first time; read llm.c for GPUs and kernels; rent an 8×H100 and run the nanochat speedrun to watch every stage's numbers move. This site's [2026 AI courses guide](/en/posts/ai/2026-07-10-ai-courses-2026-guide-en) files nanochat under "strictly a project rather than a course, but the learning density of reading the code is high" — an assessment I agree with.

But keep the caveats in view: all three repos live in English-language corpora and the H100 ecosystem, a full order of magnitude above MiniMind's single-GPU route, and they are not the only answer. The Chinese community grew its own low-cost routes, which the next post covers; and when training from scratch is actually worth it — versus just fine-tuning — is the question the final post takes up.

## References

- [nanochat GitHub](https://github.com/karpathy/nanochat)
- [Introducing nanochat (Discussion #1, 2025-10-13)](https://github.com/karpathy/nanochat/discussions/1)
- [nanochat launch README (commit dd6ff9a, includes the $300/$1,000 tiers)](https://github.com/karpathy/nanochat/blob/dd6ff9a1cc23b38ce69ddc119fb220f9ee96cedd/README.md)
- [Beating GPT-2 for <<$100: the nanochat journey (Discussion #481, 2026-01-31)](https://github.com/karpathy/nanochat/discussions/481)
- [nanochat speedrun.sh](https://github.com/karpathy/nanochat/blob/master/runs/speedrun.sh)
- [Karpathy's launch tweet for nanochat (2025-10-13)](https://x.com/karpathy/status/1977755427569111362)
- [nanoGPT GitHub](https://github.com/karpathy/nanoGPT)
- [llm.c GitHub](https://github.com/karpathy/llm.c)
- [modded-nanoGPT](https://github.com/KellerJordan/modded-nanogpt)
- [FineWeb-EDU (official Hugging Face introduction)](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
- [DCLM paper (source of the CORE metric, arXiv:2406.11794)](https://arxiv.org/abs/2406.11794)
- [Chinchilla scaling law (arXiv:2203.15556)](https://arxiv.org/abs/2203.15556)
- [MiniMind: train an LLM from scratch for 3 RMB (this series, order 1)](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)
- [Zero to Hero video series](https://karpathy.ai/zero-to-hero.html)