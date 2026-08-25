---
title: "vLLM: The Default Choice for Self-Hosted Inference — and When It's Over-Engineering"
date: 2026-08-21
category: ai
type: deep-dive
tags: [vllm, llm-inference, self-hosting, gpu, pagedattention, cost]
lang: en
tldr: "vLLM is the de facto standard for self-hosted LLM inference (89,470 GitHub stars, verified 2026-08-21), built on managing the KV cache the way an OS manages paged memory. But the selection question isn't how fast it is — it's your GPU utilization. Using Red Hat's measured 793 output tokens/second, a fully saturated A100 costs roughly $0.70 per million output tokens; at 10% utilization that becomes $7, more than most cloud APIs."
description: "vLLM from a technology-selection angle: what problems PagedAttention and continuous batching actually solve, how to compute the cost threshold between self-hosting and a cloud API, how SGLang compares in the same layer, and when running your own inference server is over-engineering."
series:
  name: "Self-Hosted Inference"
  order: 2
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-vllm-self-host-decision)

This series has so far stayed in the application layer: routing, validation, documentation formats. This post drills one layer down, into self-hosted inference serving — the layer that directly determines the cost and latency of running models yourself, and one of the few choices where getting it wrong shows up on the invoice.

[vLLM](https://github.com/vllm-project/vllm) is the default answer in that layer. It is an open-source LLM inference and serving engine: hand it a Hugging Face model name and it stands up an OpenAI-compatible HTTP server that squeezes your GPU's memory and compute as hard as it can. The project came out of UC Berkeley's Sky Computing Lab and is now [hosted by the PyTorch Foundation](https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/), with 89,470 GitHub stars.

This site already has a [usage-oriented introduction to vLLM](/posts/ai/2026-03-14-vllm-inference-engine-en) covering PagedAttention's details, the V1 engine, and how to start a server. This post doesn't repeat any of that. It answers three selection questions: **should I self-host, should I use vLLM, and when should I not.**

Version numbers, prices, and star counts in this post were verified on 2026-08-21; methodology and sources are collected in the appendix.

## Two mechanisms, in one sentence each

What vLLM sells is not "the model runs faster" — same model, same weights, same GPU, and a single request finishes at roughly the same speed. What it sells is **how many people one card can serve at once**. Two mechanisms do that work.

**PagedAttention** treats wasted memory. Every in-flight request needs its KV cache stored, but you don't know in advance how long it will generate. The traditional approach is to pre-allocate one contiguous block at the maximum length, and the [PagedAttention paper](https://arxiv.org/abs/2309.06180) (arXiv:2309.06180) measured what that cost systems at the time: less than 40% of that memory actually held token state, the rest was reservation and fragmentation.

The fix is lifted straight from operating systems: cut the KV cache into fixed-size blocks and use a block table for indirection, so physical locations can be scattered anywhere in memory. The reclaimed memory buys a larger batch — the paper's own evaluation reports 2–4x higher throughput than the then-current FasterTransformer and Orca.

**Continuous batching** treats wasted queueing. Static batching waits for an entire batch to finish generating before starting the next one, so short requests idle alongside long ones. Let every forward pass admit new requests and evict finished ones, and the GPU stops waiting on people.

Anyscale [measured this](https://www.anyscale.com/blog/continuous-batching-llm-inference): on their simulated production workload, continuous batching plus vLLM's memory optimizations reached up to 23x over naive batching. That is the Ray team measuring, not a neutral third party.

Both mechanisms have a cost, and the paper states it: PagedAttention's indirection makes attention kernel latency 20–26% higher than the heavily optimized FasterTransformer implementation. The trade pays off because it touches only the attention operator, and the batch-size gain dwarfs it.

## Decision one: does self-hosting pencil out

This is the calculation you should run first and the one most often skipped. Start with both sides of the market:

| Item | Price |
|---|---|
| A100 SXM 40GB on demand ([Lambda](https://lambda.ai/service/gpu-cloud#pricing)) | $1.99 / GPU / hour |
| H100 SXM 80GB on demand ([RunPod](https://www.runpod.io/pricing)) | $3.29 / hour |
| gpt-oss-120B serverless ([Together AI](https://www.together.ai/pricing)) | $0.15 in / $0.60 out, per million tokens |
| Llama 3.3 70B serverless (Together AI) | $1.04 / million tokens |
| Qwen3.5 9B serverless (Together AI) | $0.17 in / $0.25 out |

Now one measured throughput figure. On a single A100 running an 8B model, Red Hat clocked vLLM's peak at [793 output tokens per second](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking).

Divide that against the hourly rate in the table: a fully saturated card produces about 2.85 million output tokens per hour, which works out to roughly **$0.70 per million output tokens**. That division is this site's arithmetic, not a claim from any source; the formula and its assumptions are in the appendix.

That number carries two implications, and the second is the important one.

First: $0.70 is already not cheaper than serverless on Together. On the same price list a small model bills $0.25 for output and a large MoE model bills $0.60. In other words, **at the small-model end, self-hosting shows little price advantage even with the card pinned at full load.**

Second: $0.70 is a floor that assumes the card runs saturated twenty-four hours a day. Real internal services never do — busy in the afternoon, empty overnight, near-dead on weekends.

GPUs bill by the hour, not by the token. Drop utilization to a tenth and your per-token cost multiplies by ten, to $7 per million tokens — an order of magnitude worse than anything on that table. Serverless APIs have an idle cost of zero.

**What to do**: before buying a card or launching an instance, estimate one number — how many output tokens your service will actually generate per day. Divide by 2.85 million (or by whatever hourly throughput you measure yourself) to get "card-hours needed." If the answer is far below 24, what you'd be paying for is idle time, not inference. This requires no benchmark, just a sheet of paper.

## Decision two: the three reasons that aren't money

Not penciling out doesn't mean don't do it. Three situations justify self-hosting even when it costs more, and they are usually the real motivation anyway.

**The data can't leave.** Compliance, a customer contract, or an internal policy says inference doesn't go to a third party. There's nothing to debate.

**What you need to run isn't on any API.** Your own fine-tune, your own LoRA adapters, experiments that need modified sampling or nonstandard decoding. vLLM serves multiple LoRAs simultaneously, which hosted APIs generally won't give you.

**You want predictable latency, not average latency.** This deserves unpacking because it cuts against intuition. Red Hat's tests also recorded something unflattering to vLLM: past a concurrency of sixteen, vLLM's inter-token latency starts climbing while Ollama's stays low and stable.

The reason is that Ollama throttles, holding the number of simultaneously processed requests very small — at the cost of making new requests queue for a long time. At peak throughput, time to first token was 673 ms for Ollama versus 80 ms for vLLM (both P99).

Both trade-offs are defensible, but you should know which one you picked. vLLM's default stance is "pack everyone into the batch," which means an individual user's token-by-token output slows down as load rises.

## Decision three: which engine within the layer

There aren't many real choices in this layer.

| Engine | Position | Stars (2026-08-21) |
|---|---|---|
| [vLLM](https://github.com/vllm-project/vllm) | Production GPU serving, widest hardware coverage | 89,470 |
| [SGLang](https://github.com/sgl-project/sglang) | Production GPU serving, focused on large-scale deployment | 32,194 |
| [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide-en) | Local development and single-user use | — |

Ollama is the easy call: it isn't a competitor to vLLM, it's the earlier stage of the same pipeline. Local development, single-user chat, quickly trying a model — use Ollama; the moment you're serving multiple people, switch. Red Hat's benchmark concludes the same way.

The gap between vLLM and SGLang, by contrast, is too small to settle with "which is faster." Both are Apache-licensed, both sit inside the PyTorch ecosystem, both ship day-0 support for new models. They borrow from each other's designs — the [vLLM V1 announcement](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html) credits SGLang by name in its acknowledgments.

The criterion that actually matters is coverage, not peak numbers. vLLM's documentation lists support for 200+ model architectures, with hardware spanning NVIDIA, AMD, and Intel GPUs and CPUs and extending to TPU, Gaudi, and Ascend through plugin backends.

Unless you have specific hardware or a specific model that only one side supports, pick the one with larger adoption so that someone answers when things break. That's the criterion this series keeps returning to.

## The honest part: when vLLM is over-engineering

The PagedAttention paper's discussion section contains a rarely quoted passage that is the most useful thing in it for selection purposes. Paging works for LLM serving because the workload has two properties: **output length is not known a priori**, and **performance is bound by GPU memory capacity**.

The authors are explicit that these premises don't hold for every GPU workload. The counterexample is right next door: in deep learning training, tensor shapes are static and memory allocation can be optimized ahead of time, so paging has nothing to do.

Read that backwards and you get vLLM's boundary. In the following situations its core mechanisms spin idle:

- **Low concurrency.** With one or two requests at a time, continuous batching has nothing to fill with, and the memory PagedAttention reclaims has no second request to use it. This is the normal state of local development and small internal tools.
- **Fixed, short outputs.** Classification, extraction, tagging — tasks that emit a handful of tokens — don't fragment much to begin with.
- **Spiky batch traffic.** For an offline batch job that runs once a day, a serverless API or an on-demand instance beats keeping a GPU resident.

Then add the hidden costs of self-hosting: GPU drivers and CUDA versions, downloading and storing model weights, tuning OOM and queueing parameters, monitoring — and upgrades.

That last one is the most underestimated. vLLM moves fast: the recent v0.27.0 alone landed 561 commits, and it carried a major PyTorch version bump, the kind of change that breaks environments. Someone has to maintain all of this.

**What to do**: budget "self-hosting" as a project with a headcount attached, not as a technical option. If nobody on your team is willing to put their name on upgrading and being on call for this service, the answer is don't self-host — that predicts the outcome better than any benchmark.

## Overall

vLLM's position in the inference-serving layer isn't in question: it has the largest adoption, the widest hardware coverage, and a foundation as steward. If you're self-hosting, start there and require a concrete reason to move. But the real selection problem in this layer isn't which engine — it's **whether you should be standing in this layer at all**.

The cost structure of inference serving is nothing like package selection in the application layer. Pick the wrong package and you pay a refactoring cost; pick the wrong inference architecture and you pay for idle GPUs every month. The variable that decides it is neither PagedAttention nor continuous batching — it's how much of the time that card is actually computing. Estimate utilization first, then decide whether to open this layer at all.

## Appendix: where the numbers come from

- **Red Hat's 793 TPS**: GuideLLM 0.2.1, OpenShift 4.17.15, a single NVIDIA A100-PCIE-40GB, vLLM 0.9.1 against Ollama 0.9.2, model Llama 3.1 8B (fp16 build on the Ollama side), a fixed prompt-response dataset, concurrency from 1 to 256, 300 seconds per concurrency level, TTFT and ITL reported at P99. Published 2025-08-08; the page shows a last-updated date of 2026-07-13. **Red Hat sells Red Hat AI Inference Server, which is powered by vLLM — this is a measurement by a party with a commercial stake**, and the article closes with a promotional link to that product.
- **$0.70 per million output tokens**: this site's arithmetic, not a claim by any source. 793 × 3600 ÷ 1,000,000 ≈ 2.85 (million tokens/hour); $1.99 ÷ 2.85 ≈ $0.70. It assumes 100% GPU saturation, counts output tokens only, ignores storage and network fees, and pairs Red Hat's throughput on an A100-40GB with Lambda's list price for an A100 40GB. Real numbers vary by model, sequence length, and hardware; this formula is for order of magnitude, not for quoting.
- **2–4x and 20–26%**: both from the PagedAttention paper's own evaluation (baselines FasterTransformer and Orca, hardware A100, models from the OPT family and LLaMA), not independent replication.
- **23x**: measured by Anyscale (the Ray team) on 2023-06-22, on a production-inference workload they simulated themselves, against naive static batching.
- **Prices**: public list-price pages from Lambda, RunPod, and Together AI, retrieved 2026-08-21, before tax and before any committed-use discount.

## References

- [Efficient Memory Management for Large Language Model Serving with PagedAttention (arXiv:2309.06180)](https://arxiv.org/abs/2309.06180) — read the abstract, §1 Introduction, §2 Background, §7.1 kernel microbenchmark, §7.3 recomputation vs swapping, and §8 Discussion; the memory-waste share, the 2–4x throughput figure, the 20–26% kernel latency, and the preconditions for paging all come from here
- [vLLM documentation](https://docs.vllm.ai/en/latest/) — the count of supported model architectures and the hardware backend list
- [vLLM GitHub repository](https://github.com/vllm-project/vllm) — star count, README feature list, hardware support
- [vLLM Releases](https://github.com/vllm-project/vllm/releases) — v0.27.1's release date, v0.27.0's commit and contributor counts, the PyTorch 2.13 upgrade
- [vLLM V1: A Major Upgrade to vLLM's Core Architecture](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html) — the scope of the V1 rewrite and the acknowledgments crediting SGLang and other engines
- [PyTorch Foundation Welcomes vLLM as a Hosted Project](https://pytorch.org/blog/pytorch-foundation-welcomes-vllm/) — governance and timing
- [Ollama vs. vLLM: A deep dive into performance benchmarking (Red Hat)](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking) — 793 TPS, P99 TTFT of 80 ms vs 673 ms, and the ITL rise past concurrency 16
- [How continuous batching enables 23x throughput in LLM inference (Anyscale)](https://www.anyscale.com/blog/continuous-batching-llm-inference) — the mechanism of continuous batching and the source of the 23x figure
- [SGLang GitHub repository](https://github.com/sgl-project/sglang) — star count and recent support timeline
- [Lambda GPU Cloud pricing](https://lambda.ai/service/gpu-cloud#pricing) — A100 / H100 / B200 list prices
- [RunPod pricing](https://www.runpod.io/pricing) — H100 / A100 / L40S list prices
- [Together AI pricing](https://www.together.ai/pricing) — serverless per-million-token prices
- Related on this site: [vLLM — from PagedAttention to a production LLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine-en), [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en), [Technology Choices in the AI Era: series guide](/posts/tech/2026-08-21-ai-era-tech-choices-guide-en)
