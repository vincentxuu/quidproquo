---
title: "NTU Hung-yi Lee ML 2026 Guide: HW3 LLM Fast Inference: Seven Speed-up Papers, Then Measuring Speculative Decoding, FlashAttention, and vLLM on a GPU"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, llm-inference, speculative-decoding, flashattention, kv-cache, vllm]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 8
tldr: "HW3 is 20 multiple-choice questions at 0.5 points each. No code is submitted; students answer a quiz on NTU COOL. The first 10 questions come from reading papers: four on speculative decoding (Leviathan et al., DeepMind's Speculative Sampling, Inference with Reference, SpecInfer) plus FlashAttention 1–3. The last 10 require filling TODOs in the Colab and analyzing the results: acceptance rate of a hand-written speculative decoder, speed-up curves for an assistant model vs n-gram under two prompt regimes, HBM reads and theoretical FlashAttention speed-up from T4 specs, vLLM prefix caching across turns and a cache invalidation test, and the effect of CPU offload on throughput. All questions are printed in both Mandarin and English in the homework PDF, so outsiders can do the whole thing; they just cannot get the official answers."
description: "A guide to HW3 of NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw3.pdf, the homework Colab, and the TA walkthrough video: format and prerequisites, what each of the seven assigned papers is tested on, the Manual Speculative Decoding TODO, Benchmark with Two Prompt Regimes, FlashAttention read/write formulas and T4 run-time estimates, vLLM KV Cache multi-turn and invalidation tests, CPU offload, and the limits for self-learners."
draft: false
glossary:
  - term: "Speculative Decoding"
    aliases: ["speculative sampling"]
    definition: "A small draft/assistant model autoregressively guesses γ tokens, then the large target model computes γ+1 distributions in one parallel pass and accepts tokens up to the first rejection based on probability ratios. At the rejected position, a new token is sampled from a corrected distribution."
    context: "In theory the output distribution matches using the target model alone; the cost is running an extra small model."
  - term: "Acceptance rate alpha"
    aliases: ["acceptance rate", "alpha"]
    definition: "Defined in the HW3 Colab as accepted / drafted: the fraction of draft-model tokens the target model accepts."
    context: "The homework compares alpha and runtime under a normal prompt and a simple prompt."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide is based on HW3 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 8 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous two posts covered [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en) and [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en). This homework has you measure them on a real GPU, and it brings back Speculative Decoding, which the lecture skipped.

Official materials used: the homework slides [hw3.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw3.pdf) (63 pages; the second half holds the questions in Mandarin and English), the [homework Colab](https://colab.research.google.com/drive/1vZNo6_PlaP2fvMqr3g5KoQA0rN79m24O?usp=sharing) (40 cells), and the TA walkthrough video [ML 2026 Spring HW3 LLM Fast Inference](https://youtu.be/rXfp9Yo5HwU) listed on the course page. The course page gives 3/20 as the release date, and the PDF sets the deadline at 2026/04/09 23:59:59 (UTC+8) with no late submissions. The TAs are 馮柏翰, 吳岳霖, and 蘇炳揚.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=rXfp9Yo5HwU
title: TA video: ML 2026 Spring HW3 LLM Fast Inference
```

Original videos: [TA video: ML 2026 Spring HW3 LLM Fast Inference](https://www.youtube.com/watch?v=rXfp9Yo5HwU)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Access level: A3, but no official answers

- **Available**: the homework PDF, the Colab starter code, and the full text of all 20 questions. The PDF says the questions are provided "for those who are neither enrolled in nor auditing the course" and are identical to the ones on NTU COOL, in both Mandarin and English.
- **Not available**: answering and grading happen on NTU COOL, which needs an NTU account. The PDF says a link to answers and explanations would be posted after 2026/04/12, but I found no such document among the PDF's links. You can work through every question on your own; you just cannot check your answers.
- **Hardware**: the questions assume a Colab T4 (Q15 and Q17 both name the T4). Q14 in the PDF also includes plots from T4, A100, L4, and G4 VM runs for comparison, since different GPUs and some randomness mean your plot may differ. The speculative decoding and vLLM parts both need a Hugging Face token, and the vLLM part uses `meta-llama/Llama-3.2-3B-Instruct`, which requires requesting access first.

## Format and prerequisites

The homework is **20 multiple-choice questions at 0.5 points each, 10 points total**:

| Part | Questions | How |
|---|---|---|
| Part 1: Paper Reading | Q1–Q10 | Read the assigned papers |
| Part 2: Coding | Q11–Q20 | Fill in the Colab cells marked `# TODO` and analyze the output |

The Colab splits the coding questions into three sections: Q11–Q15 on Speculative Decoding, Q16–Q17 on FlashAttention, and Q18–Q20 on vLLM. You do not submit code, and the NTU COOL quiz allows unlimited attempts, keeping the highest score.

The prerequisite video is [Intro to Generative AI & ML 2025, Lecture 3: Dissecting LLMs](https://youtu.be/8iFvM7WUUs8) (in Mandarin). For Speculative Decoding itself, watch [Intro to Generative AI 2024, Lecture 16](https://youtu.be/MAbGgsWKrg8) (in Mandarin); this semester's lecture did not cover it again.

## Part 1: what each of the seven papers is tested on

The PDF suggests skimming each paper first, then reading the sections relevant to each question closely. It also says outright that you can use an LLM to find the relevant sections or check your answers.

**Four speculative decoding papers:**

- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) (Q1–Q2): order the five steps of a speculative decoding step, and identify the consequences you cannot avoid, such as a step possibly producing no new token and at most γ+1.
- [Accelerating Large Language Model Decoding with Speculative Sampling](https://arxiv.org/abs/2302.01318) (Q3): what to watch for when choosing a draft model, such as how acceptance differs between random sampling and greedy decoding, and what happens when the target model lacks compute for parallel verification.
- [Inference with Reference](https://arxiv.org/abs/2304.04487) (Q4): decide which scenarios do not match the paper's Figure 1. This paper uses no small model; it speeds things up by exploiting text overlap between reference documents and the output.
- [SpecInfer](https://arxiv.org/abs/2305.09781) (Q5): how the Learning-based Speculator builds token trees (expansion-based vs merge-based), and how the Token Tree Verifier shares the KV cache for common prefixes.

**Three FlashAttention papers:**

- [FlashAttention](https://arxiv.org/abs/2205.14135) (Q6–Q7): order the forward-pass steps, and explain why the backward pass uses the stored l and m to recompute S and P.
- [FlashAttention-2](https://arxiv.org/abs/2307.08691) (Q8): which parallelism and work-partitioning improvements it adds over the original.
- [FlashAttention-3](https://arxiv.org/abs/2407.08608) (Q9): the Hopper GPU thread hierarchy, overlapping softmax and matrix multiplication across warpgroups, and FP8 handling.

Q10 is a synthesis question that combines the lecture, the homework slides, and all the papers. The PDF also lists extra material not used in questions: the [SpeculativeDecodingPapers](https://github.com/hemingkx/SpeculativeDecodingPapers) reading list and [FlashAttention-4](https://arxiv.org/abs/2603.05451).

## Part 2-1: Speculative decoding experiments (Q11–Q15)

The Colab uses `google/gemma-3-1b-it` as the target model and `google/gemma-3-270m-it` as the assistant model. It first checks that both have exactly the same vocabulary and raises an error if not.

**Manual Speculative Decoding (TODO)**: implement the core logic following the Speculative Sampling paper. The Colab's roadmap:

1. Draft `gamma` tokens with the assistant model.
2. Run one target-model forward pass on the drafted sequence.
3. Compute the acceptance ratio for each drafted token.
4. On rejection, sample a new token from the corrected distribution.
5. Track `alpha = accepted / drafted`.

Note that the Colab's notation is the reverse of the paper's: `q()` is the assistant model's distribution and `p()` is the target model's. Q11 asks what to put in the `diff` line for the corrected distribution. Q12 asks what `ratio = torch.clamp(p_x / (q_x + eps), max=1.0)` does. Q13 has you run a normal prompt and a simple prompt and compare runtime and alpha.

**Benchmark with Two Prompt Regimes**: compares a low-utilization case (a short, simple prompt with `max_new_tokens=64`) against a high-utilization case (a long, complex prompt with `max_new_tokens=128`). It sweeps gamma from 1 to 10 and plots speed-up curves for the assistant model and for n-gram lookup (Hugging Face's `prompt_lookup_num_tokens`). The Colab asks you to explain the differences in terms of acceptance quality, overhead, and workload size. Q14 asks you to pick the correct statement based on your plot. Q15 asks why, on a T4, speculative generation can be slower than normal generation for some settings.

**Try it**: run the simple prompt first and note alpha. Then switch to the normal prompt and work out whether the speed-up comes mainly from alpha or from prompt length. That is exactly what Q13 is probing.

## Part 2-2: FlashAttention experiment (Q16–Q17)

The Colab implements Standard Attention and FlashAttention in Python, with an explicit note that **the Python version gives no real speed-up**; actual gains require low-level implementations in CUDA or C++. So this section counts reads and writes and uses hardware specs to estimate theoretical time. Wall-clock seconds are beside the point here.

The homework PDF gives the HBM read/write counts for both algorithms (N is sequence length, d is the per-head dimension, and N is much larger than d):

| | Reads | Writes | Total |
|---|---|---|---|
| Standard Attention | Q, K, V each N×d; S, P each N×N | S, P each N×N; O is N×d | N(4d+4N) |
| FlashAttention | Q, K, V, O each N×d; l, m each N×1 | O is N×d; l, m each N×1 | N(5d+4) |

The N×N terms disappear. That is what the [previous post](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en) meant by never writing the attention weights back to the warehouse.

**Run Time Calculation (TODO)**: the Colab gives T4 specs (FP32 8.1 TFLOPS, 320 GB/s memory bandwidth) and an example formula, and asks you to rewrite it for several sequence lengths:

```python
run_time = flops / (8.1 * 1e12) + 4 * total_memory_floats / (320 * 1e9)
```

The `4 *` is 4 bytes per FP32 value. Q16 asks how many floats are read from HBM when N=1024, and Q17 asks for FlashAttention's theoretical speed-up over Standard Attention on a T4 when N=2048.

## Part 2-3: vLLM experiments (Q18–Q20)

The PDF introduces [vLLM](https://github.com/vllm-project/vllm) as a high-throughput inference engine that combines several techniques, with [PagedAttention](https://arxiv.org/abs/2309.06180) as the reference paper. All three experiments use `meta-llama/Llama-3.2-3B-Instruct`.

**KV Cache Multi-turn Test**: with `enable_prefix_caching=True`, a long document serves as a shared prefix for four questions in a row. Q18 asks for a screenshot and which part of the time is saved in rounds 2, 3, and 4. Think back to prefill and decode in the [KV Cache post](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en); the answer is one of those two phases.

**KV Cache Invalidation**: the same prompt runs four times:

1. First inference builds the cache (slower).
2. The exact same prompt hits the cache (faster).
3. One extra space **before** the long document: cache miss (slower).
4. One extra space **after** the long document: cache hit (faster).

This is the hands-on version of the lecture's rule that only an identical prefix can be shared. Q19 asks for a screenshot and why a single space invalidates the cache.

**vLLM CPU RAM/Speed Trade-off (TODO)**: set `OFFLOAD_GB` (passed to vLLM's `cpu_offload_gb`) to two different values and watch how available KV cache space and throughput change. Q20 asks for screenshots of both settings and why moving model weights to the CPU slows throughput.

**Try it**: after the invalidation test, add a Run 5 that puts the extra space at the very start of the prompt. Predict the result before running it to check that you really understand when the cache hits.

## Rules and resources

- No plagiarism, and no sharing code or answers with anyone (the PDF says "any living creatures"). A first violation means a 0 on that homework and the final grade multiplied by 0.9; more than one means an F for the semester.
- Post questions on the NTU COOL discussion board first, or email the TA list with a subject starting `[ML 2026 Spring HW3]`. TA hours are before and after class every Friday in 博理 112.
- The PDF's references include [GenAI-ML 2025 HW3](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall-course-data/hw3.pdf), the previous version of this homework.

## Related on this site

The [Stanford CS336 inference guide](/posts/ai/2026-08-22-cs336-inference-en) gives another take on speculative decoding and KV cache, and the [CME295 LLM systems guide](/posts/ai/2026-09-29-cme295-llm-systems-en) also covers inference optimization. For vLLM's architecture, see [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine-en).

## What this post could and could not verify

Verified: the full text and embedded links of hw3.pdf, the Colab's markdown and code (model IDs, TODO locations, experiment parameters), the release date on the course page, the TA video's title and uploader (via YouTube oEmbed), and the titles of the seven papers plus FlashAttention-4 (checked on arXiv).

Not verified: the TA video has no captions to pull, and this post did not transcribe it, so any extra hints in the video are not included. The official answers are not public, and this post deliberately gives no answers. The description of n-gram speed-up is based only on the `prompt_lookup_num_tokens` parameter in the Colab code.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Faster Generation, Part 2: KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) | Next: [Positional Embedding and Very Long Inputs](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [hw3.pdf: ML 2026 Spring HW3, LLM Fast Inference](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw3.pdf)
- [HW3 Colab starter code](https://colab.research.google.com/drive/1vZNo6_PlaP2fvMqr3g5KoQA0rN79m24O?usp=sharing)
- [TA video: ML 2026 Spring HW3 LLM Fast Inference](https://youtu.be/rXfp9Yo5HwU)
- [Prerequisite video: Intro to Generative AI & ML 2025, Lecture 3: Dissecting LLMs (in Mandarin)](https://youtu.be/8iFvM7WUUs8)
- [Intro to Generative AI 2024, Lecture 16: Speculative Decoding (in Mandarin)](https://youtu.be/MAbGgsWKrg8)
- [Fast Inference from Transformers via Speculative Decoding (arXiv 2211.17192)](https://arxiv.org/abs/2211.17192)
- [Accelerating Large Language Model Decoding with Speculative Sampling (arXiv 2302.01318)](https://arxiv.org/abs/2302.01318)
- [Inference with Reference: Lossless Acceleration of Large Language Models (arXiv 2304.04487)](https://arxiv.org/abs/2304.04487)
- [SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification (arXiv 2305.09781)](https://arxiv.org/abs/2305.09781)
- [FlashAttention (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2 (arXiv 2307.08691)](https://arxiv.org/abs/2307.08691)
- [FlashAttention-3 (arXiv 2407.08608)](https://arxiv.org/abs/2407.08608)
- [FlashAttention-4: Algorithm and Kernel Pipelining Co-Design for Asymmetric Hardware Scaling (arXiv 2603.05451)](https://arxiv.org/abs/2603.05451)
- [Efficient Memory Management for Large Language Model Serving with PagedAttention (arXiv 2309.06180)](https://arxiv.org/abs/2309.06180)
- [vLLM (GitHub)](https://github.com/vllm-project/vllm)
- [hemingkx/SpeculativeDecodingPapers (GitHub)](https://github.com/hemingkx/SpeculativeDecodingPapers)
- [GenAI-ML 2025 HW3 (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall-course-data/hw3.pdf)
