---
title: "CS336 Lecture 10: LLM Inference Is About Reading Weights and KV Cache Less Often"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm-inference, kv-cache, quantization, vllm]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 11
tldr: "Lecture 10 separates prefill from decode: prefill parallelizes and is often compute-bound, while decode is sequential and commonly bandwidth-bound. GQA/MLA, quantization, speculative decoding, continuous batching, and PagedAttention reshape that cost."
description: "A guide to Stanford CS336 Spring 2026 Lecture 10: TTFT, latency, throughput, prefill versus decode, KV cache, quantization, speculative sampling, continuous batching, and PagedAttention."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-inference)

This post covers **CS336 Spring 2026 Lecture 10: Inference**, taught by Percy Liang on April 29, 2026. Its primary source is the official executable lecture, [`lecture_10.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py).

Training places a full sequence inside matrix multiplications. Autoregressive inference generates only the next token. That difference turns the same Transformer into another systems problem at serving time: weights and KV cache are repeatedly read from memory while requests arrive and finish at different times.

## Three metrics represent three product objectives

**Time to first token (TTFT)** measures the wait from submitting a prompt to receiving the first token and is dominated by prefill. **Inter-token latency** measures the pace of later tokens for one request. **Throughput** measures total tokens per second across many requests.

Larger batches often improve throughput because one weight read serves more sequences. They can worsen latency and KV-cache memory as requests share resources. Interactive chat, offline batch processing, and large reinforcement-learning rollouts should not use the same operating point.

## Prefill and decode have different arithmetic intensity

Prefill knows the entire prompt and parallelizes across sequence positions. Its matrix multiplications have higher arithmetic intensity and are commonly compute-bound. Decode adds one token at a time and cannot parallelize along generation length. Each MLP step reads full weights and becomes memory-bound at small batch sizes.

Attention decode also reads a private KV cache for every request. Batching amortizes shared weights but not per-sequence K/V. Longer context increases the cache scanned for every token, making generation attention especially resistant to simple batching.

## First route: shrink the KV cache

GQA and MQA reduce key/value heads. MLA compresses K/V into lower-dimensional latent state. Cross-layer attention shares selected cache across layers. Local or sliding-window attention truncates visible history, while hybrids retain global attention in a small subset of layers.

Linear attention and state-space models more aggressively compress history into fixed state. Every method trades capacity, exact retrieval, and kernel complexity. “Supports long context” therefore needs long-context accuracy, decode latency, and cache bytes per token—not only a maximum length.

## Second route: quantize and compress weights

Inference commonly moves from bf16 to fp8, int8, or int4. Fewer bytes reduce both capacity and bandwidth pressure, while scale granularity, outlier channels, and hardware kernels determine actual error and speed.

Quantization-aware training simulates quantization during forward so weights adapt, but it is expensive. Post-training quantization uses calibration data and is cheaper. GPTQ-like methods use second-order information to compensate progressive error, while activation-aware methods preserve higher precision for influential weights.

Pruning, distillation, and new architectures also reduce cost, but they act differently: quantization changes representation, pruning removes structure, and distillation trains a smaller model. Their quality loss and kernel availability differ.

## Speculative decoding exploits cheaper verification

A smaller draft model proposes several tokens, and the target model evaluates them in parallel. Acceptance and a residual distribution preserve exact sampling from the target distribution. The more accurate the draft, the more tokens one target pass accepts.

This does not shrink a target pass. It combines several memory-bound token steps into one. Benefit depends on draft cost, acceptance rate, batch, and target hardware. Medusa and EAGLE modify how drafts are produced.

## Continuous batching and PagedAttention manage dynamic requests

Static batching waits until all sequences finish, leaving short requests behind long ones. Continuous batching removes completed requests and admits new ones at every decode step. Different lengths create ragged batches: attention tracks boundaries, while other operations can process concatenated tokens.

Preallocating one maximum contiguous KV-cache region per request causes internal and external fragmentation. PagedAttention borrows operating-system paging, splitting cache into non-contiguous blocks and mapping logical sequence positions through a page table. It also enables shared system-prompt prefixes or multiple samples from one prompt.

This is the core idea behind vLLM's serving baseline: it changes dynamic memory allocation without changing the model's answers.

## A complete inference benchmark

For a fixed model and hardware setup, sweep prompt length, output length, concurrency, and precision. Record TTFT, p50/p99 inter-token latency, throughput, peak memory, and quality regression. Separate queueing, prefill, decode, and communication time.

Tokens per second alone hides user waiting; latency alone may hide idle GPUs. Lecture 10 puts model computation, memory, and dynamic scheduling in one account.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. This guide follows its inference accounting, KV-cache, quantization, speculation, and paging structure.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 10 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py)
- [vLLM and PagedAttention](https://arxiv.org/abs/2309.06180)
- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)

