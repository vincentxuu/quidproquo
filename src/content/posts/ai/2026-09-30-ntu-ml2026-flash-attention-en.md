---
title: "NTU Hung-yi Lee ML 2026 Guide: Faster Generation, Part 1: Flash Attention and Why Moving Data Is the Bottleneck"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, llm-inference, flashattention, attention, gpu]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 6
tldr: "In week 3 of ML 2026, Hung-yi Lee spends the first half of the inference lecture on one technique: Flash Attention. A GPU's execution units are fast, but their workbench (on-chip SRAM) is tiny, so data has to be carried to and from the warehouse (HBM). The carrying is the bottleneck. A naive softmax makes several round trips to the warehouse. Flash Attention assumes the current maximum is Amax, then multiplies by a correction factor when a larger value shows up. That lets it find the maximum, build the denominator, and compute the weighted sum in one pass, without ever materializing the attention weights. The output is identical to standard attention, no retraining is needed, and the cost is a little extra compute and a little brain strain."
description: "A guide to the first half of the 3/20 inference lecture in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on inference.pdf pages 1–28 and the video 'Speeding up LM generation (1/2): Flash Attention': prefill vs decode, the three costs to check for any speed-up, the HBM warehouse vs SRAM workbench analogy, read counts for chunked softmax, the online-softmax correction, skipping the attention weights entirely, and results from the demo Colab."
draft: false
glossary:
  - term: "HBM"
    aliases: ["High Bandwidth Memory", "warehouse"]
    definition: "GPU memory with large capacity (80GB on an A100) but relatively slow access. Lee calls it the warehouse."
    context: "Flash Attention's goal is to cut the number of trips from HBM to SRAM."
  - term: "SRAM"
    aliases: ["on-chip SRAM", "workbench"]
    definition: "Small, fast memory on the GPU chip. Execution units can only work on data that fits there. Lee calls it the workbench."
    context: "The lecture notes the workbench is typically only a dozen or so MB, so nothing that scales with sequence length L fits on it."
  - term: "Online softmax"
    aliases: ["chunked softmax", "correction factor"]
    definition: "While scanning in chunks, use the maximum seen so far as Amax. When a larger value appears, multiply the old partial sum by exp(old max − new max). The final result is exactly the same as a single full pass."
    context: "This is the core trick that lets Flash Attention finish softmax and the weighted sum in one pass."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-flash-attention)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide is based on the 3/20 materials of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 6 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous post is [HW2: An AI Agent as an AI Engineer](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en). The earlier posts were about agents: [OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) prepends a long system prompt to every message you send, and [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) deals with context that no longer fits. This post moves inside the model: **when inputs run to tens or hundreds of thousands of tokens, why does generation slow down, and how do you speed it up?**

Official materials used: the slides [inference.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf), pages 1–28 (55 pages total; the second half is the [next post on KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en)), the lecture video [加快語言模型生成速度 (1/2)：Flash Attention](https://youtu.be/vXb2QYOUzl4) (in Mandarin), and the [demo Colab](https://colab.research.google.com/drive/1KoeKKIXSXI9b-pYg0kun3-uLQkP6p_hC?usp=sharing) linked on slide 28. Access level is **A3**: slides (pdf/pptx), recording, and demo code are all public. There is no quiz for this lecture; the matching exercises are in [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en).

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=vXb2QYOUzl4
title: Video: Speeding up LM generation (1/2): Flash Attention (in Mandarin)
```

Original videos: [Video: Speeding up LM generation (1/2): Flash Attention (in Mandarin)](https://www.youtube.com/watch?v=vXb2QYOUzl4)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): video vXb2QYOUzl4 (49:39) was read in full. Checked Prefill/Decode and the three-cost evaluation framework, the warehouse/workbench analogy (80GB is the warehouse, the workbench is only a dozen or so MB), chunking and the rule that nothing proportional to L fits on the workbench, the online-softmax correction exp(d1−d2), the output-correction formula that skips the attention weights, Hugging Face being unable to return attention weights, the Colab difference of about 1e-7, the roughly 8–9x speedup at length 4096, and the CUDA OOM at long lengths; all match the transcript. One inconsistency: the instructor names Yi-34B for the real-model demo in the transcript while the post said gemma-3-4b-it, so it now lists both and reports trends only; the saved Colab output and slide page numbers cannot be verified from the video.

## Prerequisite: you are expected to know Transformers

Slide 2 has one prerequisite link: [Lecture 3 of Intro to Generative AI & ML 2025: Dissecting LLMs](https://youtu.be/8iFvM7WUUs8) (in Mandarin). Lee opens by saying the lecture assumes you already understand how a Transformer works inside, and that it is about **inference**, not training.

Slides 3–4 review self-attention in two figures. Inputs x1…x5 are each multiplied by three matrices to get q, k, v. The output at position 4 comes from dotting q4 with k1…k4 to get a1…a4, applying softmax to get â1…â4, and taking the weighted sum of v1…v4. The rest of the lecture is about reordering this computation.

Slide 5 splits generation into two phases: **Prefill**, which ingests the whole prompt at once, and **Decode**, which emits tokens one at a time. Both terms come back in the KV Cache post.

## For any speed-up, ask what it costs

Slide 6 lists three classic techniques: Flash Attention, KV Cache, and Speculative Decoding. Lee sets up a framework that runs through both lectures: **if someone tells you they invented a speed-up, ask what they paid for it.** The usual costs are:

1. It changes the attention computation, so the result is an approximation.
2. It is tied to a model: you have to train or customize a specific model, so it is not plug-and-play.
3. Even without those two, something else was traded away.

At the end of the second lecture every method goes into one table (slide 55, covered in full in the next post).

**Speculative Decoding is not covered this semester.** Slide 7 only links the old video, [Intro to Generative AI 2024, Lecture 16: Speculative Decoding](https://youtu.be/MAbGgsWKrg8) (in Mandarin). Lee says topics already covered in past years are not repeated, but the homework includes it. One-line version: a small model guesses a few tokens ahead, and the large model verifies them in one parallel pass. Details are in the [HW3 guide](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en).

## The scene: compute is fast, moving data is slow

Flash Attention comes from the 2022 paper [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) (slide 8). Lee first explains why it is impressive. Its output is **exactly** the same as standard attention, not an approximation. It drops into any Transformer that uses self-attention, with no model lock-in. And its cost is tiny.

The core idea is to respect how a GPU actually computes. Slides 9–10 use an analogy (Lee stresses it is simplified and not GPU-specific):

- **Execution units** are a crowd of many-armed sprites: lots of them, and fast.
- **The workbench** is on-chip SRAM. It is small and holds only a few values at a time.
- **The warehouse** is HBM. It is far bigger than the workbench, but not infinite.

Data has to be carried from the warehouse to the workbench to be processed, then carried back. Once something is on the workbench, you can treat the computation as instant. **The carrying is what slows things down.** Flash Attention reorders the computation to cut the number of trips, without changing the result.

The demo Colab ran on an A100 80GB. Lee points out that 80GB is the warehouse. The workbench stays small, usually a dozen or so MB.

## Intuition: the naive way makes many warehouse trips

Slides 11–17 walk through standard attention. To keep it simple, Lee uses a single query (a real GPU handles many at once).

The key constraint: **nothing that scales with sequence length L can sit on the workbench.** An agent's input might be ten thousand, a hundred thousand, or a million tokens. Even one number per position is a million numbers, which will not fit. So the keys are split into chunks of N keys each, B = L/N chunks in total.

Under that constraint, turning a_i into â_i takes several passes:

1. For each chunk, compute the dot products a_i of q and k and write them back to the warehouse.
2. Read the a_i chunk by chunk, keeping a running maximum. Only after the last chunk do you know Amax. In practice you subtract Amax before taking the exponential to avoid overflow.
3. Read the a_i again, compute exp(a_i − Amax), and write it back.
4. Read again and accumulate the denominator S.
5. Read again, divide by S to get â_i, and write it back.
6. Finally read â_i and v chunk by chunk and accumulate the weighted sum to get the output O.

Slide 17 asks: going from a_i to â_i takes several reads. **Is that really necessary?**

## Mechanism: run with the wrong answer, then correct it

Slides 18–24 start with a simplified version. The difficulty is that the denominator depends on Amax, and you only know Amax after seeing everything, which seems to force two passes.

The fix is to **assume** the maximum of the first chunk, d1, is Amax and compute the partial sum s1. When the second chunk reveals a larger d2, you do not reread the first chunk. You multiply s1 by exp(d1 − d2), and it becomes what you would have gotten using d2 from the start. Lee says the correction is "nothing fancy, just one formula," but all of Flash Attention is this trick applied over and over. After the last chunk, d is Amax and s is the correct denominator.

<details>
<summary>Expand: why multiplying by exp(d1 − d2) fixes it</summary>

The first chunk's partial sum is

s1 = Σ_{i=1..N} exp(a_i − d1)

Multiply by exp(d1 − d2):

s1 · exp(d1 − d2) = Σ_{i=1..N} exp(a_i − d1 + d1 − d2) = Σ_{i=1..N} exp(a_i − d2)

That is exactly what the first chunk should contribute if d2 were Amax, so it can be added directly to the second chunk's Σ exp(a_i − d2). For chunk k in general:

d_k = max(d_{k−1}, max of chunk k)
s_k = s_{k−1} · exp(d_{k−1} − d_k) + Σ_{i∈chunk k} exp(a_i − d_k)

</details>

Now getting from a_i to â_i takes only **two** reads: one that finds Amax and the denominator together, and one that produces â_i (slide 24).

That is still not the whole of Flash Attention. Slides 25–27 pose what Lee calls the soul-searching question: **do you really need the attention weights before computing the weighted sum?**

Flash Attention says no. When the first chunk is read, v is read too, and O1 is computed with the "wrong" weights exp(a_i − d1)/s1. When the second chunk arrives, d and s are updated to the more accurate d2 and s2. O1 is multiplied by (s1/s2)·exp(d1 − d2) to erase the traces of d1 and s1, and then the second chunk's contribution is added. After correcting all the way to the last chunk, O is the right output. q, k, and v all go onto the workbench in one pass, and â_i is never written out.

<details>
<summary>Expand: the correction for the output O</summary>

O_k = O_{k−1} · (s_{k−1} / s_k) · exp(d_{k−1} − d_k) + Σ_{i∈chunk k} [exp(a_i − d_k) / s_k] · v_i

Multiplying by s_{k−1} cancels the old denominator and dividing by s_k applies the new one. Multiplying by exp(d_{k−1} − d_k) fixes the exponent. After chunk B, d_B = Amax and s_B is the full denominator, so

O_B = Σ_{i=1..L} â_i · v_i

which in theory matches computing â_i first and then taking the weighted sum.

</details>

Lee mentions one practical consequence. Because the attention weights are never computed, if you use Flash Attention in Hugging Face and try to plot an attention matrix for analysis, you get an error saying there are no attention weights to read.

## Back to real models: you are probably using it already

The demo Colab calls PyTorch's `scaled_dot_product_attention` with either `SDPBackend.MATH` (the naive algorithm) or `SDPBackend.FLASH_ATTENTION`. Lee explains that without special settings PyTorch usually defaults to Flash Attention, so your everyday Transformer runs likely use it already.

The Colab does three things:

- **Numerical check**: random q, k, v (B=4, H=8, L=256, D=64). The maximum difference between the two algorithms is around 1e-7.
- **Speed comparison**: sequence lengths from 64 to 4096. On the A100, Flash Attention is about 9× faster at length 4096 (the saved Colab output shows 9.49x).
- **A real model**: the saved Colab code names `google/gemma-3-4b-it` (the instructor says Yi-34B in the transcript; the two disagree, so only trends are reported below), with `attn_implementation` set to `eager` (no Flash Attention) or `sdpa`, fed a long string repeated many times and asked for one token. In the lecture, short inputs showed no real difference, because the model also spends a lot of time on feed-forward layers and embeddings. Once the string got longer, Flash Attention was clearly faster. Ten times longer again, and the run hit CUDA out of memory.

Lee notes that what ran out was the warehouse, not the workbench. However big it is, the warehouse has a limit. **Why long sequences blow up the warehouse** is the topic of the next lecture, KV Cache.

His conclusion: Flash Attention gets a several-fold speed-up just by carrying data less often. The only costs are a more complex algorithm and a bit of extra compute for the corrections, which he considers minor next to the gain.

## Going deeper

- **Papers**: read Algorithm 1 in [FlashAttention](https://arxiv.org/abs/2205.14135) alongside the correction formulas above. HW3 also assigns [FlashAttention-2](https://arxiv.org/abs/2307.08691) and [FlashAttention-3](https://arxiv.org/abs/2407.08608); see the [HW3 guide](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en).
- **Try it**: open the demo Colab, extend `SEQ_LENS` to 8192, and check whether the speed-up keeps growing. Then shrink `B` and `H` and see whether Flash Attention still pays off for short sequences.
- **Related on this site**: the [Stanford CS336 inference guide](/posts/ai/2026-08-22-cs336-inference-en) covers memory-bound workloads from a roofline angle, and the [CME295 LLM systems guide](/posts/ai/2026-09-29-cme295-llm-systems-en) also covers Flash Attention and inference optimization.

## What this post could and could not verify

Verified: the structure and text of slides 1–28, the video transcript (from the zh-TW captions on YouTube), the demo Colab's code and saved outputs, and the titles of cited papers (checked on arXiv).

Not verified: which model the real-model demo used. The instructor says Yi-34B in the transcript, while the saved Colab code names `google/gemma-3-4b-it`; the two disagree, so this post draws no conclusion and reports trends only. The timings in the lecture do not match the saved Colab output (the longest saved run did not hit OOM), so the real-model section reports trends only, not seconds. Slides 11–27 are mostly animated figures, so their content is paraphrased from the transcript.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW2: An AI Agent as an AI Engineer](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en) | Next: [Faster Generation, Part 2: KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. The transcript names Yi-34B for the real-model demo while the Colab code names gemma-3-4b-it; the post now states both. Everything else matches.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [inference.pdf: Speeding up language model generation (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf)
- [Video: Speeding up LM generation (1/2): Flash Attention (in Mandarin)](https://youtu.be/vXb2QYOUzl4)
- [Demo Colab: Flash Attention vs naive attention (comments in Mandarin)](https://colab.research.google.com/drive/1KoeKKIXSXI9b-pYg0kun3-uLQkP6p_hC?usp=sharing)
- [Prerequisite video: Intro to Generative AI & ML 2025, Lecture 3: Dissecting LLMs (in Mandarin)](https://youtu.be/8iFvM7WUUs8)
- [Older video: Intro to Generative AI 2024, Lecture 16: Speculative Decoding (in Mandarin)](https://youtu.be/MAbGgsWKrg8)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning (arXiv 2307.08691)](https://arxiv.org/abs/2307.08691)
- [FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision (arXiv 2407.08608)](https://arxiv.org/abs/2407.08608)
