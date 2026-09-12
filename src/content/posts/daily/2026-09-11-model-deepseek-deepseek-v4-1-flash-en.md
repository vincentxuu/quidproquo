---
title: "Model Card: DeepSeek-V4.1-Flash"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: en
description: "DeepSeek's new architecture cuts KV cache to 890 bytes per token. Its published Terminal-Bench and DeepSWE results exceed Claude Opus 5, while DeepSeek plans to route V4-Pro traffic to this cheaper model from September 14."
tldr: "DeepSeek-V4.1-Flash (`deepseek-flash`) is a 552B MoE with 8B prefill and 16B decode active parameters, a 1M-token context window, and 384K maximum output. It is MIT-licensed, priced at $0.30 input and $1.20 output per million peak-hour tokens, and brings CED, CSA2, and FP4 KV-cache compression to agent workloads."
series:
  name: "AI Model Tracker"
  order: 19
glossary:
  - term: "DeepSeek V4"
    def: "DeepSeek's flagship LLM family, with Flash and Pro variants and an emphasis on multimodality and aggressive KV-cache compression."
---

> 🌏 [中文版](/posts/daily/2026-09-11-model-deepseek-deepseek-v4-1-flash)

## Model information

| Item | Value |
|---|---|
| Model ID | `deepseek-flash`; the Hugging Face repository is `deepseek-ai/DeepSeek-V4.1-Flash` |
| Parameters | 552B total, 8B active for prefill and 16B for decode; 763B including the vision encoder |
| Context window | 1,000,000 tokens; 384K maximum output |
| Price | Input: $0.30 peak / $0.15 off-peak per 1M tokens; output: $1.20 peak / $0.60 off-peak |
| License | MIT; weights and reference inference code are published on Hugging Face |
| Released | 2026-09-10 |

## Highlights

- DeepSeek reports 90.6 on Terminal-Bench 2.1 and 74.2 on DeepSWE v1.1. Its reported Claude Opus 5 comparisons are 89.1 and 74.0 respectively.
- Causal Encoder-Decoder, Compressed Sparse Attention 2, and an FP4 primary KV cache reduce global KV-cache use to 890 bytes per token.
- The API exposes a continuous `reasoning_effort` scale from 1 to 100, letting callers trade cost against reasoning depth without changing models.

## Benchmark context

| Benchmark | DeepSeek-V4.1-Flash | Prior V4-Flash-0731 | Reported leading competitor |
|---|---:|---:|---:|
| Terminal-Bench 2.1 | 90.6 | 82.7 | Claude Opus 5: 89.1 |
| DeepSWE v1.1 | 74.2 | 54.4 | Claude Opus 5: 74.0 |
| AutomationBench v1.0.6 | 54.8 | 37.7 | Claude Opus 5: 50.3 |
| CyberGym | 88.1 | 76.7 | GPT-5.6 Sol / GLM-5.3: 84.5 |
| GPQA Diamond | 90.9 | 89.9 | GPT-5.6 Sol: 94.1 |

These are DeepSeek's release-day results, run with its own harness and high reasoning settings. They are useful for choosing candidates to evaluate, not independent reproductions.

## What it means for agent builders

CED changes the long-context cost equation for multi-turn, tool-using sessions: the decoder projects from the encoder's final states instead of independently computing KV cache at every layer. A 1M-token context and 384K output limit make the model worth testing for repository-scale coding or long automation runs.

The reported agentic results make it a reasonable candidate for coding and CLI agents, particularly workloads currently routed to V4-Pro. DeepSeek says requests to `deepseek-v4-pro` will route to V4.1-Flash from September 14 at Flash pricing. Do not infer broad reasoning leadership from those results: its published GPQA Diamond score trails GPT-5.6 Sol, and its Humanity's Last Exam result trails Opus 5.

## Comparison with the prior model

The reported gains concentrate on agentic tasks while using fewer active parameters than V4-Flash-0731. The architectural claim to test in practice is not only the benchmark score, but whether KV-cache compression improves the latency and cost profile of the actual long-context workload.

## Takeaway

Treat V4.1-Flash as a strong agent-workload candidate with an unusually aggressive price change, then validate it against the task, tool loop, and reliability requirements that matter to your system.

## References

- [DeepSeek API models and pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [DeepSeek-V4.1-Flash model card on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [DeepSeek-V4.1-Flash technical report](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)
