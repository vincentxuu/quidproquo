---
title: "Model Card: ERNIE 5.5 Flash Base"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-ernie]
lang: en
description: "Baidu open-sources ERNIE 5.5 Flash Base, a 280B-total/14B-active MoE base model with no post-training applied, leading 24 of 30 self-reported benchmarks against DeepSeek-V4-Flash-Base, Hy3-preview-Base and MiMo-V2.5-Base"
tldr: "Baidu open-sourced ERNIE 5.5 Flash Base on 2026-11-05: a 280B-total/14B-active MoE base model, pre-trained on 33.5T tokens with a 128K training context (1M for fine-tuning and inference); a pure pretraining checkpoint with zero post-training; Baidu's self-reported numbers lead on MMLU-Pro (78.4 vs. DeepSeek's 69.2) and HumanEval+ (82.3 vs. 69.5); the license is free up to $50M annual revenue but excludes the EU, UK and South Korea"
series:
  name: "AI Model Tracker"
  order: 70
glossary:
  - term: "ERNIE"
    def: "Baidu's large language model family; the 5.5 generation is the first to ship a pure base-model checkpoint with no post-training"
  - term: "MoE (Mixture-of-Experts)"
    def: "A sparse architecture where the model holds multiple expert sub-networks but activates only a small subset per inference, letting total parameter count far exceed actual compute"
---

> 🌏 [中文版](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base)

## Model Info

| Item | Value |
|---|---|
| Model ID | `baidu/ERNIE-5.5-Flash-Base` (FP8) / `baidu/ERNIE-5.5-Flash-Base-BF16` (BF16) |
| Vendor | Baidu |
| Parameters | 280B total, 14B activated per token (plus a 0.36B ECHO module, excluded from the headline count) |
| Context Window | 128K (training) / 1M (supported for fine-tuning and inference) |
| Input price (USD/1M tokens) | No official API pricing — this is a pure open-weight release; Baidu does not serve it through its own API |
| Output price (USD/1M tokens) | No official API pricing (same as above) |
| Open source | Yes (ERNIE 5.5 Flash Base Model License Agreement v1.0: free below $50M in annual related revenue, written authorization required above that threshold; excludes the EU, UK and South Korea) |
| Release date | 2026-11-05 |
| Official announcement | [Baidu ERNIE Blog: ERNIE 5.5 Flash Base](https://ernie.baidu.com/release/ernie-5-5-flash-base/) |
| HuggingFace | [baidu/ERNIE-5.5-Flash-Base](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| Family | ERNIE 5.x series (the first pure base-model release in the 5.5 generation) |

## Highlights

- **A pure pretraining checkpoint, deliberately left untrained past that point.** Baidu frames this explicitly as the weights at the end of pretraining, with no mid-training or post-training applied, so the community can compare different fine-tuning, instruction-tuning or RL methods from the same starting point. The official docs are explicit that it's served only through the completions API — it is not a chat model.
- **Hybrid sparse attention cuts KV-cache cost.** 37 of 43 layers use Heavily Compressed Attention, caching one entry per 128 tokens; only 1 in 7 layers (6 layers, MLA+DSA) keep full token-level context access, sharply reducing cache cost for long-context inference.
- **Multi-Router Latent MoE.** 512 routed experts (top-10) plus 1 shared expert, using several independently initialized sigmoid routers instead of a single router's score. Baidu reports this noticeably improves the correlation between routing scores and actual expert utility, especially in the middle-to-deep layers.
- **ECHO replaces the MTP module.** Instead of attaching a separate multi-token-prediction module, ECHO reuses the backbone's own final layer to predict future tokens, so the multi-step loss trains the same parameters that produce the next token. The same layer doubles as a draft model for speculative decoding.

## Benchmark Results

| Benchmark | ERNIE 5.5 Flash Base | DeepSeek-V4-Flash-Base | Hy3-preview-Base | MiMo-V2.5-Base |
|---|---|---|---|---|
| MMLU-Pro (EM) | **78.4** | 69.2 | 66.9 | 65.7 |
| HumanEval+ (Pass@1) | **82.3** | 69.5 | 78.0 | 74.4 |
| GPQA (EM) | **60.2** | 55.9 | 50.2 | 51.4 |
| LongBench-v2 (EM) | **48.7** | 44.5 | 39.8 | 44.6 |
| HELMET-Rerank (NDCG@10) | 56.2 | **60.0** | 55.7 | 56.6 |

⚠️ These numbers — four wins for ERNIE 5.5 Flash Base and one loss — all come from Baidu's own unified evaluation pipeline (same prompts, same few-shot settings, same judge model), so they're self-reported. MarkTechPost notes Baidu's measured competitor scores differ slightly from each vendor's own published numbers (e.g., DeepSeek self-reports MMLU-Pro at 68.3, while Baidu measured 69.2), so independent reproduction is still pending. Baidu claims a lead on 24 of 30 benchmarks, but trails DeepSeek-V4-Flash-Base on three: the long-context HELMET-Rerank and InfiniteBench, and the Chinese-knowledge ChineseSimpleQA.

## Comparison with Prior/Competing Models

Among the three same-tier open base models, the biggest gap is in code: ERNIE 5.5 Flash Base beats DeepSeek-V4-Flash-Base by 12.8 points on HumanEval+, 14.3 points on MBPP+, and 9.2 points on MMLU-Pro. But those gains concentrate in the exam and code categories — on long-context evals (HELMET-Rerank, InfiniteBench) it actually trails DeepSeek, suggesting the trade-off from keeping only 6 of 43 layers at full token-level attention (the other 37 use compressed HCA) shows up specifically in some long-document tasks rather than being a clean sweep.

Against DeepSeek-V4-Flash-Base (284B-A13B, 1M training context, MIT license), activated parameters are close (14B vs. 13B), but DeepSeek trains natively to a 1M context while ERNIE 5.5 Flash only trains to 128K and extends to 1M at inference time — meaning its long-context capability leans more on extrapolation than on something learned during training, which may explain why its long-context scores are more conservative than its exam and code scores. On licensing, DeepSeek uses the fully permissive MIT license, while ERNIE 5.5 Flash Base ships under Baidu's own custom terms: written authorization is required above $50M in annual revenue, and the EU, UK and South Korea are excluded entirely. That's usable for Taiwan-based teams (Taiwan isn't on the exclusion list), but it's not an unconditional open-source license.

Against Tencent's Hy3-preview-Base (295B-A21B), Hy3 activates 50% more parameters per token (21B vs. 14B), yet Baidu's measured MMLU-Pro, HumanEval+ and GPQA scores all favor ERNIE; Hy3 only leads on CoT-style BBH and FullStackBench. If these numbers hold, ERNIE 5.5 Flash is getting comparable or better results with less activated compute — but again, this is a one-sided evaluation from Baidu, pending outside verification.

## What This Means for Agent Development

This is a base model, not a chat model — the docs are explicit that it's only reachable through the completions API, with no chat template and no RLHF alignment. That means you **cannot** plug it directly into an agent's reasoning backend; its role is to be a clean starting point for teams with their own further-training capability.

- If you're building agents that need custom domain behavior (industry-specific tool-calling style, a particular conversational tone): a clean base checkpoint like this lets you run instruction tuning or RLHF from scratch instead of trying to "pry open" an already-aligned chat model. The code and reasoning benchmark edge, plus the published SGLang/vLLM deployment examples, lower the engineering cost of getting started.
- If you're running research that compares training methods across teams (say, SFT vs. RL): Baidu explicitly frames this checkpoint's purpose as providing a shared, controlled starting point for exactly that kind of comparison.
- Not a fit: anything that needs a chat or agent backend you can use out of the box — unlike most "open model" releases that are callable as an API the moment they ship, you have to do your own post-training first. Also not a fit for teams in the EU, UK or South Korea (excluded by license), or for anyone crossing $50M in annual related revenue without Baidu's written authorization.

## Today's Takeaway

Most "open model release" coverage assumes readers will take the model and start chatting or calling tools with it right away. Baidu instead deliberately shipped a checkpoint frozen at "end of pretraining, before any alignment" — and said so explicitly in the opening of its announcement: the target isn't end users, it's teams with the capability to do post-training, given a clean, variable-controlled starting point. That's a reminder to ask one more question whenever you see the word "open source": is what's open a model you can use directly, or a foundation you can build a house on? The two are very different for agent development — a foundation-type open release like this one will likely fail at basic instruction-following if you skip post-training and try to run it as an agent straight away.

## References

- [Baidu ERNIE Blog: ERNIE 5.5 Flash Base (official technical announcement, full benchmark table and architecture details)](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [HuggingFace: baidu/ERNIE-5.5-Flash-Base (model card and deployment guide)](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [MarkTechPost: Baidu Releases ERNIE 5.5 Flash Base: A 280B MoE Base Model With 14B Active Parameters](https://www.marktechpost.com/2026/11/05/baidu-ernie-5-5-flash-base-280b-moe/)
- [BigGo Finance: Baidu Open-Sources ERNIE 5.5 Flash Base](https://finance.biggo.com/news/364f7bfb-db7b-4722-9b14-69e97d8c4f78)
- [Pebblous: ERNIE 5.5 License: Korea Excluded, Plus a $50M Cap](https://blog.pebblous.ai/blog/baidu-ernie-5-5-license-korea-excluded/en/)
- [Unite.AI: Baidu Releases ERNIE 5.5 Flash Base for Further Training](https://www.unite.ai/baidu-releases-ernie-5-5-flash-base-for-further-training/)
