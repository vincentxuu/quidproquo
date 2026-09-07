---
title: "The framework for training from scratch: LitGPT's no-abstraction rewrites, pretrain flow, and the TinyLlama track record"
date: 2026-09-06
category: ai
type: deep-dive
tags: [litgpt, llm, training, open-source, pytorch, pre-training, lora]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 9
tldr: "LitGPT (Lightning AI, ~13,600 stars, Apache 2.0) rewrites 20+ mainstream LLMs — Llama 3, Qwen2.5, Phi 4 — from scratch as single-file, no-abstraction implementations, with a full pretrain / finetune / evaluate / serve CLI. TinyLlama (1.1B parameters, 3T tokens) was trained on this codebase. This post breaks down how it differs from MiniMind, how to actually use it, and where it stops."
description: "A deep dive into LitGPT: 20+ LLMs rewritten from scratch, the no-abstraction philosophy, the litgpt pretrain workflow, the TinyLlama and NeurIPS efficiency challenge track record, and its limits as a training skeleton."
draft: false
---

> [中文版](/posts/ai/2026-09-06-litgpt-from-scratch-framework)

The first eight posts in this series were all about *training a specific model*: [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) training a 64M teaching model, [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) a 21B one, [OLMo 3](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) a 32B one. This post switches dimensions — instead of the model, look at the training skeleton. [LitGPT](https://github.com/Lightning-AI/litgpt) (Lightning AI, ~13,600 stars at the time of writing) ships no flagship model of its own; instead it rewrites 20+ mainstream LLMs — Llama 3, Qwen2.5, Phi 4, Gemma 2 — from scratch, and wraps them in a complete command-line flow: `litgpt pretrain` / `finetune` / `evaluate` / `serve`. If you want to get hands-on after reading the earlier posts but don't want to hand-write every line, this is the middle path.

## Framework vs. project: a new dimension for this series

Every project covered so far shares one trait: it trains *a named model*. LitGPT is the opposite — the README positions itself as "20+ high-performance LLMs with recipes to pretrain, finetune, and deploy at scale." The protagonist is the recipes, not any single model. The contrast with MiniMind is sharpest here:

- **MiniMind is one model plus a textbook.** minimind-3's 8-layer, 768-dim configuration and 6,400-token vocabulary were hand-picked for teaching; the training loop, tokenizer, and datasets are all bound to that one model.
- **LitGPT is a general tool for 20+ architectures.** The same CLI trains Llama 3.3 70B or pythia-14m (14M parameters); switching models is just a different name and config. To be clear: those 20+ architectures are the original authors' designs — LitGPT's contribution is the *reimplementation*, not the architecture.

The lineage matters too. LitGPT grew out of Lit-LLaMA, a 2023 reproduction of LLaMA paired with a readable PyTorch implementation. Its README acknowledgments thank Karpathy's [nanoGPT](https://github.com/karpathy/nanoGPT) and EleutherAI's [GPT-NeoX](https://github.com/EleutherAI/gpt-neox), with [Lightning Fabric](https://lightning.ai/docs/fabric/stable/) handling distributed execution underneath. "From-scratch, no abstraction" was not LitGPT's invention; its increment is industrializing that route: scaling to 20+ architectures, supporting what the README claims is 1–1000+ GPUs, and shipping under Apache 2.0 for unrestricted enterprise use.

## Design philosophy: no abstraction, but not a toy

Three checkmarks from the README are worth quoting verbatim: "From scratch implementations ✅ No abstractions ✅ Beginner friendly," and for debugging, "Easy debugging with no abstraction layers and single file implementations." Compare with the [transformers](https://github.com/huggingface/transformers) Trainer: there, the model hides between configs and callbacks, and debugging means stepping through layers to reach real code. In LitGPT every model is a single-file implementation and the training script reads top to bottom — [CS336](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) keeps stressing "understand what you train," and LitGPT makes that the default.

"No abstraction" is easy to misread as "you build the wheels yourself." In practice it's the opposite: the distributed and performance infrastructure is already wired in — FSDP (PyTorch's native fully-sharded data parallelism), [Flash Attention 2](https://github.com/Dao-AILab/flash-attention) (Dao-AILab's kernels), 4-bit / 8-bit quantization ([bitsandbytes](https://github.com/TimDettmers/bitsandbytes)), and LoRA / QLoRA / Adapter. None of these are LitGPT inventions; the increment is that they're connected — flipping `--devices 8` gets you multi-GPU instead of hand-rolling DDP.

## Hands-on: starting from pythia-14m

After installing, the README's command template is `litgpt [action] [model]`, with five actions covering the whole lifecycle:

```bash
litgpt serve     meta-llama/Llama-3.2-3B-Instruct
litgpt finetune  meta-llama/Llama-3.2-3B-Instruct
litgpt pretrain  meta-llama/Llama-3.2-3B-Instruct
litgpt chat      meta-llama/Llama-3.2-3B-Instruct
litgpt evaluate  meta-llama/Llama-3.2-3B-Instruct
```

The minimal example from the [official pretrain docs](https://lightning.ai/docs/litgpt/tutorials/pretrain) trains a pythia-14m from scratch on TinyStories with a debug config. For custom data, the `TextFiles` data module takes a folder of cleaned plain-text files:

```bash
litgpt download EleutherAI/pythia-14m --tokenizer_only true

litgpt pretrain pythia-14m \
   --tokenizer_dir EleutherAI/pythia-14m \
   --data TextFiles \
   --data.train_data_path custom_pretraining_data \
   --train.lr_warmup_steps=200
```

The docs are explicit that `TextFiles` suits small datasets only; multi-GB corpora should first be preprocessed into streamable chunks with [LitData](https://github.com/Lightning-AI/litdata), then read with `--data LitData`. Resuming an interrupted run takes a single `--resume "auto"` flag. The `config_hub` ships ready-made YAML recipes (tinyllama.yaml, tinystories.yaml, debug.yaml), LoRA / QLoRA finetuning configs are listed per model, and any parameter can be overridden on the command line.

## The track record: TinyLlama as proof of existence

Framework routes are routinely dismissed as toys. LitGPT's counter-evidence is [TinyLlama](https://github.com/jzhang38/TinyLlama): LitGPT's own README lists it under "LitGPT powered the TinyLlama project," and the TinyLlama repo's acknowledgments say "This repository is built upon lit-gpt" — confirmed from both sides. TinyLlama is a 1.1B-parameter model trained on 3 trillion tokens over roughly 90 days on 16 A100-40G GPUs, at about 24k tokens per second per GPU, on this no-abstraction codebase. Other cases: LitGPT was the official starter kit for the [NeurIPS 2023 LLM Efficiency Challenge](https://llm-efficiency-challenge.github.io) (1 LLM + 1 GPU + 1 day), and Microsoft's Samba (a hybrid state-space model) was built on the LitGPT codebase. These all come from LitGPT's own README "Project highlights" section, not community folklore.

## Limits: a training skeleton, not a research framework

- **No RLHF / GRPO.** The README's workflows are pretrain, finetune (with LoRA / QLoRA / Adapter), evaluate, and serve. Preference optimization means writing it yourself — ironically, [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) hand-wrote DPO, PPO, and GRPO.
- **Data pipelines are on you.** LitGPT provides data modules (TextFiles, LitData); cleaning, deduplication, and mixture ratios — the data curation covered in the [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) post — do not happen automatically.
- **Monitoring is on you.** Loggers can be wandb / tensorboard / csv, but there's no OLMo-style culture of public training logs and intermediate checkpoints: LitGPT hands you the buttons, not the operating records.
- **Evaluation is borrowed.** `litgpt evaluate` wraps EleutherAI's [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness); the evaluation capability isn't LitGPT's own. That's sound design (no reinventing evaluation), but keep the two projects straight when reading eval docs.

## Against the hand-written route

Three routes from this series now sit side by side: MiniMind is "hand-write every line" — pure PyTorch, highest teaching value, but distributed training is your own problem. LitGPT is "from scratch, but engineered" — the implementation is still readable single-file from-scratch code, while distribution, checkpointing, and quantization go to Fabric and off-the-shelf kernels. transformers wraps models in abstraction layers: trainable, but hard to read. The trade-off axes are readability, control, and scale ceiling — and TinyLlama shows the second route reaches trillion-token training.

## Overall

The series can close in one sentence: if you want to understand every line, read [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en); if you want understanding *and* a real model, use LitGPT; if you're deciding whether to spend the money at all, go back to the [decision framework in order 6](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en). The previous post looked at efficient and edge models — [OpenELM and MiniCPM](/en/posts/ai/2026-09-06-efficient-edge-llm-training-en); this one hands you the tool, limits included: no RLHF, bring your own data pipeline, wire up your own monitoring. It's a skeleton, not a full meal. Returning to the series' bias notes (skewed toward English- and Chinese-sphere GitHub star projects, no non-Transformer architectures), LitGPT's supported models do include multilingual implementations like BSC's [Salamandra](https://github.com/langtech-bsc/salamandra) — a rare exception. The next post, [Running MiniMind on RunPod](/en/posts/ai/2026-09-06-run-minimind-on-runpod-en), is the series' only hands-on entry — no architecture talk, just renting a machine and chatting with your own model.

## References

- [LitGPT GitHub (README: 20+ models, workflows, project highlights)](https://github.com/Lightning-AI/litgpt)
- [LitGPT official docs: Pretrain LLMs with LitGPT](https://lightning.ai/docs/litgpt/tutorials/pretrain)
- [TinyLlama GitHub (acknowledgments: built upon lit-gpt)](https://github.com/jzhang38/TinyLlama)
- [MiniMind: Train an LLM from scratch for 3 RMB (series order 1, EN)](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)
- [LM Evaluation Harness (EleutherAI)](https://github.com/EleutherAI/lm-evaluation-harness)
- [NeurIPS 2023 LLM Efficiency Challenge](https://llm-efficiency-challenge.github.io)
- [Flash Attention (Dao-AILab)](https://github.com/Dao-AILab/flash-attention)
- [LitData (Lightning AI)](https://github.com/Lightning-AI/litdata)