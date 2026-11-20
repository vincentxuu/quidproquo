---
title: "Model Card: NVIDIA Nemotron Labs Dory 1.0"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, nvidia, model-family-nemotron]
lang: en
description: "NVIDIA's new Nemotron Labs sub-brand quietly shipped its first model, Dory 1.0 — a 4B looped architecture where the same checkpoint can switch between 1/2/4 inference-time loops, trading compute depth for accuracy"
tldr: "NVIDIA-Nemotron-Labs-Dory1.0-4B: a 4B looped (latent-recurrent) normalized-GPT — 8 input layers + a shared 20-layer recurrent block (run 1/2/4 times) + 8 output layers, 256K context, OpenMDW-1.1 license (MIT-like); shipped quietly to Hugging Face on 2026-10-16 with no official blog post. SWE-bench Verified at 1/2/4 loops: 50.3%/59.5%/61.8%; the recommended 2-loop setting beats Qwen3.5-4B (54.7%) and sits just below Qwen3.5-9B (61%), with 4 loops needed to match 9B. Most of the gain comes from the second loop, and knowledge benchmarks like GPQA don't rise with more loops. The pitch is that one checkpoint can trade inference compute for accuracy at serving time by changing the loop count, no retraining or model swap needed; vLLM/llama.cpp support is still under PR review, and there's no official or third-party API pricing yet."
series:
  name: "AI Model Tracker"
  order: 51
glossary:
  - term: "Dory"
    def: "A looped large language model from NVIDIA Nemotron Labs that repeatedly applies a shared block of layers to elastically scale inference-time compute"
  - term: "Nemotron Labs"
    def: "An NVIDIA sub-brand exploring new language model architectures; Dory 1.0 and several other experimental models such as the Sigma series are released under this name, and it is not yet listed on NVIDIA's official Nemotron product page"
---

> :globe: [中文版](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0)

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
| SWE-bench Verified | 50.3 | 59.5 | 61.8 | 54.7 | 61 |
| Terminal-Bench 2.1 | 12.5 | 18.1 | 22.2 | 15 | 24 |
| SciCode | 27.3 | 34.94 | 35.11 | 25.82 | 28.21 |
| GPQA Diamond | 69.19 | 72.41 | 72.16 | 77.71 | 80.93 |
| IFBench | 74.29 | 77.94 | 79 | 53.83 | 59 |
| AA-LCR (long context) | 63 | 71 | 73 | 64.7 | 68.4 |

:warning: All numbers above are NVIDIA's own measurements under a consistent harness (NeMo Gym / NeMo Evaluator SDK); none have been independently replicated yet. The official table also lists Gemma 4 26B A4B and Qwen3.6-35B-A3B for comparison; Qwen3.6-35B-A3B's 73.4 on SWE-bench Verified is marked "†" as a reported score.

## Versus Prior Generation / Competitors

Dory is a 1.0 release, so there's no prior generation to compare against. Against similarly sized models: the recommended 2-loop setting beats Qwen3.5-4B on SWE-bench Verified (59.5), SciCode (34.94), and IFBench (77.94), and trails Qwen3.5-9B by only 1.5 points on SWE-bench; at 4 loops, SWE-bench (61.8) edges just above 9B. But on Terminal-Bench 2.1, even 4 loops (22.2) stays below Qwen3.5-9B (24), and on GPQA Diamond all three loop counts trail Qwen3.5-4B (77.71).

Dory's real pitch isn't winning benchmark scores — it's that the *same set of weights* is adjustable at inference time. Normally, trading speed for accuracy means deploying a different (smaller or larger) checkpoint; with Dory you just change the `n_recurrent_loops` parameter. The table also shows the knob's diminishing returns: going from 1 to 2 loops adds 9.2 points on SWE-bench and 8 on AA-LCR, while going on to 4 loops adds only 2.3 and 2; GPQA Diamond and HLE dip slightly from 2 to 4 loops, and AA-Omniscience accuracy stays around 10% at every loop count. Looping adds compute depth for reasoning and coding, but it doesn't add knowledge the model remembers — knowledge tasks need more parameters or external retrieval.

## Implications for Agent Development

Dory's significance is more about "a new inference-time knob in the architecture" than "a new leaderboard score":

- If you're building an agent router that dynamically sizes compute to query complexity: loop count is a compute/accuracy trade-off you can adjust without swapping models or retraining — conceptually similar to a reasoning budget, but it operates at the model-architecture level rather than the output-token level. In theory, a single 4B checkpoint could serve both "fast, simple queries" and "tasks needing deeper reasoning"
- If you're building edge or single-GPU agents: 4B parameters + 256K context + native NVFP4 quantization + last-loop KV caching keeps the memory footprint for long-context serving manageable — worth a proof of concept in resource-constrained environments
- Not yet production-ready: vLLM support is still under PR review ([vllm-project/vllm#60149](https://github.com/vllm-project/vllm/pull/60149)), and llama.cpp support hasn't landed in a release either ([ggml-org/llama.cpp#30306](https://github.com/ggml-org/llama.cpp/pull/30306)) — both require building from development branches. And with diminishing returns after 2 loops and knowledge scores dipping, don't assume "more loops = better"; you need to benchmark different loop counts against your own task distribution before shipping

## Today's Takeaway

Most "model efficiency" narratives I've seen boil down to either "pack more capability into the same parameter count" or "quantize to trade accuracy for speed." Dory 1.0 offers a third path: turn "recurrence depth" into a knob you can still adjust after deployment. The same weights, with a shared block applied repeatedly, let you decide at inference time how much compute to spend for how much accuracy — instead of that trade-off being locked in at training time. But the gains concentrating in the second loop, with knowledge scores barely moving, is also a reminder that "architecturally adjustable" doesn't mean "turning it up is always better" — looping adds compute depth, not knowledge, and this kind of elastic knob still needs per-task-type validation.

## Update History

- 2026-11-20: Corrected the benchmark table. The original misread the official model card's columns: the card lists Dory at 1/2/4 loops, then Qwen3.5-4B, Qwen3.5-9B, Gemma 4 26B A4B, and Qwen3.6-35B-A3B, and the original table took some comparison models' scores as Dory's 2-loop and 4-loop results (for example, the 73.4 shown as SWE-bench 4-loop is Qwen3.6-35B-A3B's reported score, and the 57.44 shown as IFBench 4-loop is also Qwen3.6-35B-A3B's). The tldr, comparison, agent implications, and takeaway were rewritten with the correct numbers; the earlier conclusion that IFBench drops with more loops doesn't hold — IFBench actually rises with loop count. Also corrected the claim that Dory is Nemotron Labs' first public model: earlier experimental models such as Sigma were released under the same name.

## References

- [NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16 (Hugging Face model card)](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
- [NVIDIA's official Nemotron product page (Dory not listed, supporting the "quiet release" characterization)](https://developer.nvidia.com/topics/ai/nemotron)
- [explainx.ai: NVIDIA Dory 4B: A Looped Model You Can Dial Up at Inference](https://explainx.ai/blog/nvidia-nemotron-labs-dory-4b-looped-model-nvfp4-adjustable-loops-swe-bench-2026)
- [AICoder: NVIDIA quietly releases Dory1.0-4B, a looped model with adjustable inference depth](https://aicoder.com/news/news-20261017-nvidia-nemotron-labs-dory-1-0-4b-looped-model)
