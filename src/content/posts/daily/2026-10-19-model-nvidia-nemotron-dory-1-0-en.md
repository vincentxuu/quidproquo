---
title: "Model Card: NVIDIA Nemotron Labs Dory 1.0"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, nvidia, model-family-nemotron]
lang: en
description: "NVIDIA's new Nemotron Labs sub-brand quietly shipped its first model, Dory 1.0 — a 4B looped architecture where the same checkpoint can switch between 1/2/4 inference-time loops, trading compute depth for accuracy"
tldr: "NVIDIA-Nemotron-Labs-Dory1.0-4B: a 4B looped (latent-recurrent) normalized-GPT — 8 input layers + a shared 20-layer recurrent block (run 1/2/4 times) + 8 output layers, 256K context, OpenMDW-1.1 license (MIT-like); shipped quietly to Hugging Face on 2026-10-16 with no official blog post. SWE-bench Verified at 1/2/4 loops: 50.3%/57.4%/73.4% (the 4-loop figure is a cited score, not fully NVIDIA-measured), with the 2-loop setting roughly matching similarly sized dense models Qwen3.5-4B/3.5-9B. The pitch is that one checkpoint can trade inference compute for accuracy at serving time by changing the loop count, no retraining or model swap needed; vLLM/llama.cpp support is still under PR review, and there's no official or third-party API pricing yet."
series:
  name: "AI Model Tracker"
  order: 51
glossary:
  - term: "Dory"
    def: "A looped large language model from NVIDIA Nemotron Labs that repeatedly applies a shared block of layers to elastically scale inference-time compute"
  - term: "Nemotron Labs"
    def: "An NVIDIA sub-brand exploring new language model architectures; Dory 1.0 is its first public release and is not yet listed on NVIDIA's official Nemotron product page"
---

> 🌏 [中文版](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0)

## Model Info

| Field | Value |
|---|---|
| Model ID | `nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16` |
| Vendor | NVIDIA (Nemotron Labs) |
| Parameters | 4B (looped/latent-recurrent architecture: 8 input layers + a shared 20-layer recurrent block, applied 1/2/4 times, + 8 output layers) |
| Context Window | 256,000 tokens |
| Input Pricing (USD/1M tokens) | Not available (open weights only; no official or third-party hosted API yet) |
| Output Pricing (USD/1M tokens) | Not available (same as above) |
| Open Source | Yes (OpenMDW-1.1, terms essentially equivalent to MIT, no extra usage restrictions) |
| Release Date | 2026-10-16 (marked GA on the Hugging Face model card; no official blog post) |
| Official Announcement | [NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16 (Hugging Face model card)](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) |
| HuggingFace | [nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) |
| Family | Nemotron Labs (an NVIDIA sub-brand exploring new architectures; the official [Nemotron product page](https://developer.nvidia.com/topics/ai/nemotron) currently lists Bolt/Nano/Lightning/Super/Ultra but not Dory — this release flew under the radar) |

## Capability Highlights

- **Elastic Inference Compute**: a single checkpoint can trade accuracy for compute by changing how many times the shared recurrent block is applied (1/2/4 loops), with no retraining or model swap required
- **Token Efficiency**: extra compute goes into "thinking" in latent space across loops rather than into longer generated output; higher loop counts need fewer output tokens to solve the same task
- **Last-Loop KV Caching**: instead of storing a separate KV cache per loop, Dory keeps only the final loop's cache, so KV-cache overhead stays fixed at single-loop size regardless of loop count
- **Native NVFP4 Pretraining**: of the 6 trillion pretraining tokens, roughly the first 4.5 trillion were trained natively in NVIDIA's own 4-bit floating-point format NVFP4, before continuing in BF16 — an uncommon "native low-precision pretraining" approach

## Benchmark Results

| Benchmark | Dory 1-loop | Dory 2-loop (recommended default) | Dory 4-loop | Qwen3.5-4B | Qwen3.5-9B |
|---|---|---|---|---|---|
| SWE-bench Verified | 50.3 | 57.4 | 73.4† | 59.5 | 61.8 |
| Terminal-Bench 2.1 | 12.5 | 35.0 | 43.0 | 18.1 | 22.2 |
| GPQA Diamond | 69.19 | 80.43 | 85.35 | 72.41 | 72.16 |
| IFBench | 74.29 | 77.89 | 57.44 | 77.94 | 79.0 |

⚠️ All numbers above are NVIDIA's own measurements under a consistent harness (NeMo Gym / NeMo Evaluator SDK); none have been independently replicated yet. † The 4-loop SWE-bench Verified score is separately flagged on the official model card as a "reported score," measured differently from the other numbers, so it carries lower confidence. IFBench is the only metric in the table that drops as loop count increases — down to 57.44 at 4 loops, below even the 1-loop score of 74.29.

## Versus Prior Generation / Competitors

Dory 1.0 is Nemotron Labs' first public model, so there's no prior generation to compare against. Against similarly sized models: at 2 loops, Dory roughly matches or exceeds dense models Qwen3.5-4B/Qwen3.5-9B on SWE-bench Verified (57.4%) and GPQA Diamond (80.43%), but on Terminal-Bench 2.1 (an agentic task) it only barely catches up to Qwen3.6-35B-A3B's score (43) even at 4 loops — still trailing much larger models overall.

Dory's real pitch isn't winning benchmark scores — it's that the *same set of weights* is adjustable at inference time. Normally, trading speed for accuracy means deploying a different (smaller or larger) checkpoint; with Dory you just change the `n_recurrent_loops` parameter. But IFBench's drop as loop count rises shows this knob isn't "more is always better" — instruction-following and reasoning/coding tasks may respond to loop count in opposite directions, so it needs per-task tuning rather than cranking it to the max by default.

## Implications for Agent Development

Dory's significance is more about "a new inference-time knob in the architecture" than "a new leaderboard score":

- If you're building an agent router that dynamically sizes compute to query complexity: loop count is a compute/accuracy trade-off you can adjust without swapping models or retraining — conceptually similar to a reasoning budget, but it operates at the model-architecture level rather than the output-token level. In theory, a single 4B checkpoint could serve both "fast, simple queries" and "tasks needing deeper reasoning"
- If you're building edge or single-GPU agents: 4B parameters + 256K context + native NVFP4 quantization + last-loop KV caching keeps the memory footprint for long-context serving manageable — worth a proof of concept in resource-constrained environments
- Not yet production-ready: vLLM support is still under PR review ([vllm-project/vllm#60149](https://github.com/vllm-project/vllm/pull/60149)), and llama.cpp support hasn't landed in a release either ([ggml-org/llama.cpp#30306](https://github.com/ggml-org/llama.cpp/pull/30306)) — both require building from development branches. And the IFBench counter-example is a reminder not to assume "more loops = better"; you need to benchmark different loop counts against your own task distribution before shipping

## Today's Takeaway

Most "model efficiency" narratives I've seen boil down to either "pack more capability into the same parameter count" or "quantize to trade accuracy for speed." Dory 1.0 offers a third path: turn "recurrence depth" into a knob you can still adjust after deployment. The same weights, with a shared block applied repeatedly, let you decide at inference time how much compute to spend for how much accuracy — instead of that trade-off being locked in at training time. But IFBench dropping instead of rising with more loops is also a reminder that "architecturally adjustable" doesn't mean "turning it up is always better" — this kind of elastic knob still needs per-task-type validation, and assuming a single-direction scaling law is a trap.

## References

- [NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16 (Hugging Face model card)](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
- [NVIDIA's official Nemotron product page (Dory not listed, supporting the "quiet release" characterization)](https://developer.nvidia.com/topics/ai/nemotron)
- [explainx.ai: NVIDIA Dory 4B: A Looped Model You Can Dial Up at Inference](https://explainx.ai/blog/nvidia-nemotron-labs-dory-4b-looped-model-nvfp4-adjustable-loops-swe-bench-2026)
- [AICoder: NVIDIA quietly releases Dory1.0-4B, a looped model with adjustable inference depth](https://aicoder.com/news/news-20261017-nvidia-nemotron-labs-dory-1-0-4b-looped-model)
