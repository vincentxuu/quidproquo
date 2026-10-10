---
title: "CMU 11-868 HW6: Training Llama-2-7B with DeepSpeed ZeRO + LoRA, Serving with SGLang"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, homework, lora, distributed-training, sglang, llm-inference]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 20
tldr: "The sixth 11-868 assignment is the first to set aside your homemade MiniTorch and use industry frameworks. Two problems, 50 points each. Problem 1: edit a DeepSpeed training script to turn on LoRA so Llama-2-7B can train on two 16GB V100s. Problem 2: fill in the TODOs of an SGLang inference script and tune parameters to make generation faster. The two problems want conflicting GPUs: SGLang doesn't support V100, so you need an L40S, A6000, or A100. The spring due date was April 13, and the assignment page publishes no grading tests."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Assignment 6: the goal, environment setup, what Problem 1 (DeepSpeed ZeRO & LoRA, 50 points) and Problem 2 (SGLang inference, 50 points) ask for and what you submit, the structure of the llmsys_hw6 starter code, the lectures it depends on (18, 22, 23), hardware requirements, and where self-learners get stuck. No solutions."
draft: false
glossary:
  - term: "DeepSpeed-Chat"
    aliases: ["dschat"]
    definition: "A set of training examples released by Microsoft's DeepSpeed team, covering SFT, reward models, and RLHF, with built-in ZeRO and LoRA options."
    context: "HW6's deepspeed folder reuses its dschat package and main.py."
  - term: "mem_fraction_static"
    aliases: []
    definition: "An SGLang engine parameter: the fraction of GPU memory used for static allocation, meaning model weights plus the KV cache memory pool."
    context: "HW6 Problem 2 lists it with dp_size, batch size, and others as parameters worth exploring for speed."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The assignment page lives on the cross-semester [homework site](https://llmsystem.github.io/llmsystemhomework/assignment_6/), and the starter code is in [llmsys_hw6](https://github.com/llmsystem/llmsys_hw6); both are as seen on 2026-09-30. The repo's last commit is from 2026-03-23 (message "update hw6"), before the spring due date, and Fall 2026 hasn't touched it since. The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) lists only the April 13 due date, not a release date. Access level **A3**: the problems and starter code are public. What you can't get is the submission system, the grading rubric, and the school-provided PSC GPUs.

**Series**: Previous [L22 and L24 LLM Serving: Scheduling, RadixAttention, and PagedAttention](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en) | Next [L26–L30 Serving at Scale: Prefill/Decode Disaggregation, KV Cache, and Heterogeneous Hardware](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

In HW1 through HW5 you kept adding to your own [MiniTorch](https://llmsystem.github.io/llmsystemhomework/): CUDA kernels, autodiff, a Transformer, fused kernels, data and pipeline parallelism. HW6 turns around. The first sentence of the assignment page states the goal: get familiar with the common frameworks used for training and inference.

Put differently, the first five assignments showed you what a framework looks like inside. This one has you use the real thing, running ZeRO, LoRA, and RadixAttention from earlier lectures on a 7B model.

This post covers only the problem structure, points, required resources, and where outside readers get stuck. **It does not provide solutions to any problem.**

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## Where it sits in the course

Each problem maps to earlier lectures:

| Problem | Lectures it depends on | Posts in this series |
|---|---|---|
| Problem 1: DeepSpeed ZeRO & LoRA | Lecture 18 ZeRO (3/23), Lecture 23 PEFT (4/8) | [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en), [L23 LoRA and QLoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en) |
| Problem 2: SGLang inference | Lecture 22 LLM serving with SGL (4/6) | [L22 and L24 LLM Serving](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en) |

The April 13 due date falls on the day of Lecture 24 on vLLM. Spring students wrote this assignment in roughly one week after the SGLang and PEFT lectures.

## What the starter code looks like

[llmsys_hw6](https://github.com/llmsystem/llmsys_hw6) has just two folders:

- `deepspeed/`: the training part. The script header credits Microsoft and the DeepSpeed Team, and the `dschat` package inside (including `utils/module/lora.py` and `rlhf/`) and `main.py` follow the DeepSpeed-Chat layout. The file you edit is `run_llama2_7b_lora.sh`.
- `sglang/`: the inference part, a single `run_sglang.py`.

`run_llama2_7b_lora.sh` is currently a working full-parameter training script: ZeRO stage 3 by default, BF16, gradient checkpointing on, with a "TODO: modify the args to start training for LoRA" comment where it calls `main.py`. `main.py`'s argument section already has LoRA- and offload-related options. The assignment wants you to work out how to combine them.

`run_sglang.py` defaults to the model `Qwen/Qwen2.5-7B-Instruct-1M` and reads the evaluation questions from [AlpacaEval](https://huggingface.co/datasets/tatsu-lab/alpaca_eval), collecting the instructions into a prompt list. It has three TODOs: initialize the SGLang engine, pick a batch size, and send batched prompts to `llm.generate` and collect the outputs. It writes one output in every ten to `outputs.jsonl`.

## Environment setup

The assignment page asks you to create a conda environment with Python 3.9 to avoid dependency issues, load CUDA 12.6.1 and GCC 10.2.0 on PSC, then install `datasets` and `sglang[all]>=0.4.4.post3` (from FlashInfer's wheel index).

It recommends an interactive PSC session with 2 GPUs for 4 hours (`GPU-shared` partition), and pointing the Hugging Face cache at PSC project storage. Otherwise the model fills your home directory and you get Disk Quota Exceeded.

The page leaves one contradiction unresolved. Setup says Python 3.9, but Problem 2's note says SGLang may need Python 3.10 or later. In practice, two separate environments for the two problems is simpler.

## Problem 1: DeepSpeed ZeRO & LoRA (50 points)

**The task.** The page says this problem continues training "from our example", but with LoRA enabled so it fits on 2 GPUs. Concretely, you update `deepspeed/run_llama2_7b_lora.sh` to use LoRA, exploring configurations until training runs on **two V100s with 16GB each**.

**Prerequisites.** The model is [meta-llama/Llama-2-7b-hf](https://huggingface.co/meta-llama/Llama-2-7b-hf). Request access on Hugging Face first and log in with `huggingface-cli login`.

**What you submit.** The edited `run_llama2_7b_lora.sh` and the training log. The script's last line has a commented-out log redirect; uncomment it to save the log in the output folder.

**What it really tests.** Go back to the memory math in [L23](/posts/ai/2026-09-30-cmu11868-peft-lora-en). A 7B model in BF16 is about 14GB of weights alone, which leaves a 16GB card almost no room for gradients and Adam's optimizer state. ZeRO stage 3 partitions parameters, gradients, and optimizer state across the two cards; LoRA shrinks the set of parameters that need gradients and optimizer state. Your job is to find a combination of the two (along with batch size, sequence length, gradient checkpointing, offload, and so on) that doesn't OOM. The page encourages exploration, so a log that shows what you tried says more than one set of parameters that happens to run.

## Problem 2: SGLang inference (50 points)

**Hardware first.** The page's note is explicit: SGLang doesn't support V100 (compute capability below sm75). Use an L40S, A6000, A100, or similar. So this problem can't run on the same card type as Problem 1.

**Background.** The page spends a fair amount of space on [SGLang](https://arxiv.org/abs/2312.07104)'s runtime acceleration, echoing Lecture 22:

- **RadixAttention**: instead of discarding the KV cache for prompts and generations after a call, SGLang keeps it in a radix tree, making prefix search, reuse, insertion, and eviction faster. Eviction is LRU on the least recently used leaf; shared ancestors stay until they are evicted in turn.
- **Cache-aware scheduling**: in batch processing, requests are sorted by matched prefix length, and longer matches go first instead of FIFO.
- **Constrained decoding with a compressed finite state machine**: adjacent single-transition edges in the FSM are merged into one edge so several tokens can be decoded at once.

The page also notes that SGLang's backend is built on [FlashInfer](https://arxiv.org/abs/2501.01005).

**The task.** Fill in the TODOs in `sglang/run_sglang.py`. The page invites you to explore parameters that make it faster, including temperature, top_k, top_p, max_new_tokens, batch size, `mem_fraction_static`, and `dp_size`.

**What you submit.** `sglang/run_sglang.py` and the inference log.

**What it really tests.** The code is short. The hard part is mapping ideas from the two serving lectures onto parameters. Per the [SGLang docs](https://sgl-project.github.io/advanced_features/server_arguments.html), `mem_fraction_static` is the fraction of GPU memory used for static allocation (model weights plus the KV cache pool). `dp_size` corresponds to the data parallelism Lecture 24 describes, meaning replicated engines. Batch size decides how many requests the scheduler sees at once. The starter code's default `max_new_tokens` is 8192, and that cap directly affects how much KV cache each request might claim.

## Compute requirements

- **Problem 1**: 2 GPUs; the page targets two 16GB V100s. Larger cards make it easier, but then you skip the "doesn't fit" exercise.
- **Problem 2**: a GPU at sm75 or above (the page names L40S, A6000, A100).
- **Storage**: 7B model weights need a place with enough quota; the page specifically warns that your home directory will overflow.
- **Accounts**: Llama-2 requires approved access on Hugging Face.

## Where outside readers get stuck

1. **No PSC.** The page's `srun`, `module load`, and `/ocean/projects/...` paths are all PSC-specific. Outside readers need their own cloud GPUs and must sort out CUDA and compiler versions themselves.
2. **Two problems, two kinds of GPU.** When renting, Problem 1 wants the 16GB constraint while Problem 2 can't use V100. The simplest approach is sm75+ cards for both, with smaller batches or a memory cap to simulate Problem 1's pressure. That's this post's suggestion, not a requirement from the assignment.
3. **The README disagrees with the assignment page.** The repo README is an older version: it links to `llmsys_f25_hw6`, lists each problem as 5 points, and adds "You should be able to finish all generations in under 15 minutes." Go by the [homework site page](https://llmsystem.github.io/llmsystemhomework/assignment_6/) for points and requirements (50 each). The 15-minute line isn't on that page; treat it as a rough reference.
4. **Grading isn't public.** The page lists what to submit but not what loss the log should reach or how fast inference must be.
5. **Is it one of the optional assignments?** [Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) says there are five required and two optional assignments without naming which two, so there's no way to tell whether HW6 is optional.

## How to study it yourself

1. Read [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en) and [L23 LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en), then estimate on paper roughly how much each card holds for Llama-2-7B under "full parameters + ZeRO-3" versus "LoRA + ZeRO-3".
2. Run the original script unchanged first to see how it fails on your hardware, then start turning on LoRA.
3. For Problem 2, get a small batch working first, then tune `mem_fraction_static`, `dp_size`, and batch size one at a time, recording throughput and total time.
4. After reading [L22 and L24](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en), try to explain in your own words why each parameter made things faster or slower.

## Further reading

- Parallelism in another course: [CS336 Parallelism Mechanics](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en)
- Another take on inference systems: [CS336 Inference](/posts/ai/2026-08-22-cs336-inference-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-868 LLM Systems (Spring 2026) course home](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Syllabus (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — HW6 due April 13
- [11-868 Logistics (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — five required and two optional assignments, unnamed
- [Assignment 6: Advanced Training and Inference Systems](https://llmsystem.github.io/llmsystemhomework/assignment_6/) — goal, setup, points, tasks and submissions, SGLang's GPU restriction
- [llmsystem/llmsys_hw6 GitHub repo](https://github.com/llmsystem/llmsys_hw6) — starter code (last commit 2026-03-23)
- [meta-llama/Llama-2-7b-hf](https://huggingface.co/meta-llama/Llama-2-7b-hf) — Problem 1's model, access required
- [tatsu-lab/alpaca_eval dataset](https://huggingface.co/datasets/tatsu-lab/alpaca_eval) — evaluation questions read by `run_sglang.py`
- [Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs (arXiv 2312.07104)](https://arxiv.org/abs/2312.07104)
- [SGLang Server Arguments documentation](https://sgl-project.github.io/advanced_features/server_arguments.html) — definition of `mem_fraction_static`
- [Ye et al., FlashInfer (arXiv 2501.01005)](https://arxiv.org/abs/2501.01005) — the backend the assignment page names for SGLang
