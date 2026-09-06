---
title: "When to Train an LLM From Scratch: A Decision Tree and the Full Cost Ladder"
date: 2026-09-06
category: ai
type: deep-dive
tags: [llm, training, pre-training, open-source, cost, scaling-laws]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 6
tldr: "Training from scratch only makes sense in three cases: you want to learn how training works, you have 10B+ clean tokens no open model has seen, or you need a fully transparent training process for research. Otherwise fine-tuning or RAG is almost always cheaper. This post collapses the series' main routes into one cost ladder and a decision tree."
description: "The 'Train an LLM From Scratch' series conclusion: the cost ladder from $0.40 to 65B, which route matches which motivation, when not to train from scratch, and a recap of the whole spectrum."
draft: false
---

> [中文版](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)

Every route this series walked can be seen through one lens: [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) at $0.40, [nanochat at $100](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en), the Chinese community's small models, YuLan-Mini squeezing value from every token, and the industrially fully-open OLMo 3 and LLM360 — plus the national, efficiency, and framework routes that followed. This post collapses them into one question: **which route should you take — or none at all.**

## The cost ladder

"Training from scratch" isn't one action; it's a spectrum spanning five orders of magnitude:

| Investment | Example | What you get |
|---|---|---|
| ~3 RMB / 2 hours | MiniMind (64M) | A teaching sample of the full training chain; the model itself is unusable |
| ~$100 / 4 hours | nanochat (8×H100) | A conversational ChatGPT clone, below GPT-2 level |
| ~$300 / 12 hours | nanochat mid | GPT-2 equivalent on CORE metrics |
| ~$1,000 / 41 hours | nanochat full | More coherent; solves simple math and coding problems |
| Thousands of GPU-hours | YuLan-Mini (2.4B, 1.08T tokens) | Math/coding rivaling much larger models, but demands data engineering skill |
| Tens of thousands of GPU-hours | OLMo 3 (32B), LLM360 K2 (65B) | Frontier-research-grade models with fully transparent training |

How to read this table matters more than the numbers: **each step up swaps the bottleneck for a different one**. At 3 RMB the gate is reading the code; at $100 it's operating a multi-GPU node; at YuLan-Mini it's data curriculum design; at OLMo scale it's systems engineering plus budget.

## The decision tree

Ask what you actually want:

**Understand how training works** → MiniMind or nanochat. The former runs on one GPU in the Chinese ecosystem and covers through Agentic RL; the latter is a full-stack strong baseline in the English ecosystem, closer to industrial practice. Run both and your understanding of LLMs will surpass most people who've only fine-tuned. For the theory behind it, our [Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) course guides are the companion material.

**Teach a model your domain data** → almost never from scratch. If LoRA, full fine-tuning, or RAG can solve it, pretraining from zero trades tens of thousands of dollars for a worse result. The only exception: you hold 10B+ clean tokens no open model has seen (rare languages, proprietary domains, closed-industry corpora). In that case, study YuLan-Mini's data-efficiency recipe first — it proves data quality and curriculum design can save an order of magnitude of compute.

**Research requiring transparency** → OLMo 3 or LLM360. Weights, data, every checkpoint, training logs, all open. If you need to trace a model output back to its training data, this is the only route that can.

**Train production models** → use mature frameworks like verl and Llama-Factory, building on public recipes from [OLMo](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) and Marin. Don't rewrite a trainer.

## When not to train

The honest list:

- "The model should know my documents" → RAG, one afternoon
- "The model should answer in my format" → fine-tuning
- "The model needs fresh knowledge" → RAG or re-fine-tuning
- "I want my own model" but the use case is unclear → clarify the use case first; the answer is usually an API

From-scratch pretraining in 2026 resembles building your own PC: enormous learning value, usually negative economic value. But "not economical" doesn't mean "not worth it" — that's the entire reason this series exists.

## The takeaway

Recapping the spectrum: [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) pushed the entry bar down to where anyone can run it; Karpathy's nanochat shows the industrial-grade floor one person can maintain; the Chinese community projects prove the data ecosystem matters more than the architecture; YuLan-Mini takes data efficiency to its limit; OLMo and LLM360 define the ceiling of "fully open." These routes don't replace each other — they answer different questions. The only mistake to avoid is running a flagship with toy-project expectations, or dismissing educational projects because they can't do flagship work.

## References

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [nanochat GitHub](https://github.com/karpathy/nanochat)
- [nanochat release discussion](https://github.com/karpathy/nanochat/discussions/1)
- [YuLan-Mini GitHub](https://github.com/RUC-GSAI/YuLan-Mini)
- [YuLan-Mini paper](https://arxiv.org/abs/2412.17743)
- [OLMo 3 — Allen AI Blog](https://allenai.org/blog/olmo3)
- [LLM360 K2 paper](https://arxiv.org/pdf/2501.07124)
- [SmolLM3 — Hugging Face](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [Self-Training a Small LLM From Scratch (2026 Guide)](https://codersera.com/blog/self-training-small-llm-complete-guide-2026/)
- Series posts: [order 0 intro](/en/posts/ai/2026-09-06-train-llm-from-scratch-series-intro-en), [order 2 Karpathy lineage](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en), [order 3 Chinese community routes](/en/posts/ai/2026-09-06-chinese-community-small-llm-training-en), [order 4 YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en), [order 5 fully-open flagships](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en), [order 7 national teams](/en/posts/ai/2026-09-06-national-multilingual-llm-training-en), [order 8 efficiency/edge](/en/posts/ai/2026-09-06-efficient-edge-llm-training-en), [order 9 training framework](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en)