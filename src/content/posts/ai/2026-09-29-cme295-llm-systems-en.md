---
title: "LLM Systems: Making the Model Fit on GPUs and Run Fast | Stanford CME295 2026 Edition Lecture 5"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cme295, llm-inference, kv-cache, distributed-training, gpu, stanford]
lang: en
math: true
series:
  name: "Reading Stanford CME295"
  order: 10
tldr: "Lecture 5 of the 2026 CME295 organizes the whole session around two questions: how do we make it fit, and how do we make it fast. The first half covers FlashAttention on a single GPU (splitting softmax into a numerator and denominator that accumulate block by block, so the n×n attention matrix never goes to slow memory) and five kinds of multi-GPU parallelism. The second half covers inference: TTFT and TPOT, the roofline model, three KV cache problems handled by PagedAttention, GQA and MLA, and a blackboard proof that speculative decoding samples exactly from the large model's distribution."
description: "A guide to Stanford CME295 2026 Lecture 5, \"LLM systems,\" based on the recording and the 156-slide deck: GPU HBM versus SRAM, FlashAttention's blockwise softmax and backward recomputation, data parallelism and ZeRO, tensor/pipeline/context/expert parallelism, TTFT and TPOT, arithmetic intensity and the roofline, KV caching and PagedAttention, GQA, MLA, speculative decoding's acceptance rule and proof, knowledge distillation, and multi-token prediction."
draft: false
glossary:
  - term: "prefill / decode"
    aliases: ["prefill", "decode"]
    definition: "The two phases of LLM inference. Prefill processes the whole prompt at once and parallelizes well; decode then produces one token per step, strictly one after another."
    context: "The lecture uses the two phases to explain why TTFT and TPOT are tracked separately."
  - term: "TTFT / TPOT"
    aliases: ["time to first token", "time per output token"]
    definition: "TTFT is the time from sending a request to receiving the first output token, including queueing and prefill; TPOT is the average time to produce each token after that."
    context: "The lecture names these two as the numbers inference teams watch most closely."
  - term: "arithmetic intensity"
    aliases: ["operational intensity"]
    definition: "How many floating-point operations are performed per byte moved from memory. Low values mean the bottleneck is data movement; high values mean it is compute."
    context: "The lecture uses it to draw the roofline and explain why decode is limited by memory bandwidth."
  - term: "HBM"
    aliases: ["High Bandwidth Memory"]
    definition: "The GPU's main memory: on the order of 100 GB, but roughly an order of magnitude slower than on-chip SRAM. Model weights and the KV cache live here."
    context: "FlashAttention's goal is to cut HBM reads and writes."
  - term: "kernel fusion"
    aliases: ["operator fusion", "fused kernel"]
    definition: "Merging several GPU operations, each of which would otherwise write its intermediate result back to HBM, into a single pass that keeps intermediates on chip."
    context: "The lecture raises it in the FlashAttention section: once the numerator and denominator accumulate block by block, the attention steps can be fused."
---

> :globe: [中文版](/posts/ai/2026-09-29-cme295-llm-systems)

**Video status: Videos included.** [Source details](#course-video-sources)

This post covers Lecture 5, "LLM systems," of the 2026 edition of Stanford's [CME295](/posts/ai/2026-09-29-cme295-course-overview-en) (October 30, 2026). It is based on the English captions of the lecture recording and the [156-slide deck](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf). Afshine Amidi teaches the first half (FlashAttention and distributed training) and Shervine Amidi the second half (inference optimizations). The lecture did not exist in 2025; its material used to be split across the 2025 Lectures 3 and 4, which our guides to [Lecture 3](/posts/ai/2026-09-29-cme295-large-language-models-en) and [Lecture 4](/posts/ai/2026-09-29-cme295-llm-training-en) map out.

Prerequisites: self-attention's Q, K, V and softmax ([Lecture 1 guide](/posts/ai/2026-09-29-cme295-transformer-en)), and the idea that a training step computes a loss and gradients and updates weights with Adam ([Lecture 4 guide](/posts/ai/2026-09-29-cme295-llm-training-en)).

The video runs 1 hour 47 minutes and this post covers all of it. Each section starts with a timestamp link into the recording, so if a derivation does not click you can jump straight to the speaker working through it.

```youtube
url: https://www.youtube.com/watch?v=25KIyaeI_Fg
title: Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 5 - LLM Systems
```

## How the lecture is organized: two questions, three parts

[Recording 00:00–09:13](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=0s)

The speaker opens by reducing the whole session to two questions, and every part comes back to answer them:

1. **How do we make it fit?**
2. **How do we make it fast?**

The [2026 syllabus](https://cme295.stanford.edu/syllabus/) lists seven topics: distributed training, inference optimizations, KV caching, speculative decoding, efficient kernels, FlashAttention, and hardware trade-offs. The lecture itself is ordered differently, expanding outward from a single GPU:

| Part | Recording | Making it fit | Making it fast |
|---|---|---|---|
| FlashAttention (one GPU) | 09:13–50:48 | Never materialize the n×n attention matrix | Fewer HBM reads and writes |
| Distributed training (many GPUs) | 50:48–1:09:54 | Spread parameters, activations, gradients, optimizer states across GPUs | Data parallelism, model parallelism |
| Inference optimizations | 1:09:54–1:45:54 | PagedAttention organizes memory; GQA and MLA make vectors fewer and shorter | Speculative decoding and MTP produce several tokens at once |

"Efficient kernels" and "hardware trade-offs" do not get their own segments. The first shows up inside FlashAttention as "fusing the operations"; the second is spread across the GPU spec sheet, the roofline, and the costs of parallelism. Quantization and mixed precision are not covered in this lecture.

### Starting point: one GPU cannot hold an LLM

The speaker first separates two terms that are easy to confuse: **FLOPs** (lowercase s) counts floating-point operations and measures a compute budget; **FLOPS** (or FLOP/s) is operations per second and measures how fast hardware is. Earlier lectures used only the first; this one uses both.

Next comes the NVIDIA H200 spec sheet. GPUs are good at matrix multiplication because every entry of the result is an independent dot product that can be handed to a different core, and the decoder's two layers (masked self-attention and the feedforward network) are essentially piles of matrix multiplications. The spec sheet has three kinds of numbers: compute speed (TFLOPS), memory capacity, and transfer speed (on the order of TB/s). The problem is capacity: the H200 has 141 GB.

The napkin math: a 100-billion-parameter model stored in FP16 at 2 bytes per parameter needs 200 GB for the weights alone, already more than 141 GB. Training also needs activations, gradients, and optimizer states. The other limitation is cost: training consumes trillions of tokens and inference has to serve many requests. That is where the two questions come from.

**Self-check**: Can a single H200 hold a 70-billion-parameter model's weights in BF16? What about training it?

<details>
<summary>Answer</summary>

The weights take 70e9 × 2 bytes = 140 GB, right at the 141 GB edge; in practice you also need room for activations, the KV cache, and runtime buffers, so one GPU cannot serve it. Training adds gradients and Adam's two states, which is out of the question. Criterion: compute the weight size and note that training needs more than the weights.

</details>

## FlashAttention: never writing the n×n matrix back to slow memory

[Recording 09:13–50:48](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=553s)

### A GPU has fast and slow memory

Self-attention computes $QK^\top$; with n tokens that is n×n scores. The speaker's example: just 1,000 tokens already means a million numbers to compute and store.

Two kinds of GPU memory matter here:

- **HBM** (high bandwidth memory): the 141 GB on the spec sheet. Large, with transfer speeds on the order of 1 TB/s; it sits off the compute chip.
- **SRAM**: on chip, roughly an order of magnitude faster (tens of TB/s), but only on the order of 100 MB, too small for big matrices.

The slides draw them as "small and fast" versus "big and slow." FlashAttention starts from one sentence: **reduce movement of data in and out of HBM**.

### The standard approach makes three round trips

Softmax is $\text{softmax}(x)_i = e^{x_i} / \sum_j e^{x_j}$, and the denominator needs the entire row. So standard attention goes like this (slides 19–29 walk through it step by step):

1. Read Q and K from HBM, compute the score matrix S, **write S back to HBM**
2. Read S back, compute the softmax P, **write P back to HBM**
3. Read P and V, compute the output O, write it to HBM

S and P are both n×n. The root cause is softmax's dependency on the full row. So the speaker asks: is there a way to avoid processing the whole row first?

### Splitting softmax into a numerator and denominator that accumulate

This is the longest stretch of the lecture (about 30 minutes), worked on the blackboard. Take one row of Q; its scores against every key form a row vector $s = (s_1, \dots, s_n)$, and the values are $v_1, \dots, v_n$. We want:

$$
\text{softmax}(s)\,v = \sum_{i=1}^{n} \frac{e^{s_i}}{\sum_{j=1}^{n} e^{s_j}}\, v_i = \frac{\sum_{i} e^{s_i} v_i}{\sum_{j} e^{s_j}}
$$

Once the sum moves into the numerator, the expression is one sum divided by another, and both sums can be built one term at a time:

$$
N_{t+1} = N_t + e^{s_{t+1}} v_{t+1}, \qquad D_{t+1} = D_t + e^{s_{t+1}}
$$

The answer is $N_n / D_n$. There is no need to finish the row's sum before dividing.

**Numerical stability.** $e^{s_i}$ can overflow. The speaker's observation: multiplying the numerator and denominator by the same constant leaves the ratio unchanged, so just choose the constant wisely, namely the largest score seen so far, $m$. That gives the two quantities on slides 46–47:

$$
m_{t+1} = \max(m_t, s_{t+1}), \qquad \alpha_t = e^{m_t - m_{t+1}}
$$

$$
N_{t+1} = \alpha_t N_t + e^{s_{t+1} - m_{t+1}} v_{t+1}, \qquad D_{t+1} = \alpha_t D_t + e^{s_{t+1} - m_{t+1}}
$$

$m_{t+1}$ is the new scaling factor; $\alpha_t$ rescales the running sums to the new baseline. The speaker derives $\alpha_t$: the old constant was $c_1 = e^{-m_t}$, the new one is $c_2 = e^{-m_{t+1}}$, so the old sums must be multiplied by $c_2 / c_1 = e^{m_t - m_{t+1}}$ for the constants to agree.

A student asks what happens if $e^{m_t - m_{t+1}}$ is so small it becomes 0. The answer: a number too small to represent contributes nothing to the sum anyway, so treating it as 0 is fine; the dangerous case is a number too large to represent, because it does contribute. That is why the constant is the maximum rather than something arbitrary.

<details>
<summary>This post's example: three scores, block by block</summary>

Take $s = (1, 3, 2)$ and scalar values $v = (10, 20, 30)$.

Directly: the denominator is $e^1 + e^3 + e^2 \approx 30.19$, the weighted sum about 650.5, giving about **21.547**.

Block by block:

| Step | Sees | $m$ | $\alpha$ | $N$ | $D$ |
|---|---|---|---|---|---|
| 1 | $s_1 = 1$ | 1 | — | $e^0 \cdot 10 = 10$ | 1 |
| 2 | $s_2 = 3$ | 3 | $e^{1-3} \approx 0.135$ | $0.135 \cdot 10 + 20 \approx 21.35$ | $0.135 + 1 \approx 1.135$ |
| 3 | $s_3 = 2$ | 3 | $e^0 = 1$ | $21.35 + e^{-1} \cdot 30 \approx 32.39$ | $1.135 + e^{-1} \approx 1.503$ |

$32.39 / 1.503 \approx$ **21.547**, the same as computing directly. No exponential along the way exceeded $e^0 = 1$.

</details>

**Back to attention.** Move one small block of Q and one small block of K and V into SRAM at a time, update $m$, $N$, and $D$ there, and after all key blocks are processed, write that block of O back to HBM. S and P never touch HBM; slide 57 sums it up as "far fewer reads and writes to HBM." The speaker stresses that many sources just present the formulas, but there are only two ideas behind them: the numerator and denominator can be computed incrementally, and rescaling avoids huge exponentials. Because the sums accumulate block by block, the separate steps can be **fused into one operation**, which is the core of the syllabus topic "efficient kernels."

### During training, recomputing beats storing

[Recording 42:21](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=2541s)

The second idea applies to the backward pass. Computing gradients needs the attention matrix; normally it is stored in HBM during the forward pass and read back. FlashAttention does not store it and recomputes it in SRAM with the same blockwise trick. Slide 58 puts it as "Sometimes, it is better to recompute instead of storing."

Slide 60 reuses the paper's numbers:

| | Standard attention | FlashAttention |
|---|---|---|
| GFLOPs | 66.6 | 75.2 |
| HBM R/W (GB) | 40.3 | 4.4 |
| Runtime (ms) | 41.7 | 7.3 |

More computation, much less time, because what it saves is the most expensive thing: HBM traffic. The speaker notes these numbers are for orders of magnitude only.

Three points from the Q&A:

- **It is exact, not an approximation.** The final $N/D$ equals the original formula; only the order of data movement changed.
- **Recomputation only matters for training.** Inference has no backward pass, but the forward blockwise trick still applies.
- **FlashAttention 2, 3, and 4** add optimizations for newer GPUs: 3 targets Hopper (H100, H200), 4 targets Blackwell (B100, B200). The speaker calls those papers more technical; what to remember is blockwise fusion and recomputation.

**Self-check**: FlashAttention does more computation, so why is it faster? If a GPU's HBM were as fast as its SRAM, would FlashAttention still help?

<details>
<summary>Answer</summary>

It trades a little extra compute for a large reduction in HBM traffic, and HBM traffic is much slower than compute, so total time falls. If HBM were as fast as SRAM, data movement would no longer be the bottleneck and most of the speed benefit would disappear, though the memory benefit of never storing an n×n matrix would remain. Criterion: identify that the savings are in data movement, not computation.

</details>

## Distributed training: five kinds of parallelism

[Recording 50:48–1:09:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3048s)

### What sits in memory during training

The speaker breaks a training step down and lists what must be stored:

| Item | When it is needed | Size depends on |
|---|---|---|
| Parameters | From the start | Model size (billions to trillions) |
| Activations | Forward pass for the loss, backward pass for gradients | Model size, batch size, context length |
| Gradients | Backward pass | Same count as parameters |
| Optimizer state | Weight update (Adam keeps two moments) | A multiple of the parameters |

Activations grow with context length because every token interacts with every other token and each one has its own intermediate results. 141 GB is nowhere near enough, so we need more than one GPU.

The [ZeRO paper](https://arxiv.org/abs/1910.02054) gives concrete numbers: mixed-precision training with Adam needs 16 bytes per parameter (2 for FP16 parameters, 2 for gradients, 12 for the FP32 parameter copy plus two moments).

### Data parallelism and ZeRO

[Recording 54:34](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3274s)

**Data parallelism** (DP) splits a batch across GPUs; each GPU runs its own forward and backward pass, then gradients are synchronized. The naive version puts a full copy of parameters, gradients, and optimizer state on every GPU, which is a lot of redundancy.

**ZeRO** (Zero Redundancy Optimizer) avoids storing duplicates and shards them across GPUs instead:

- ZeRO-1: shard the optimizer state
- ZeRO-2: also shard gradients
- ZeRO-3: also shard parameters

The cost is communication: a GPU running its forward pass needs parameters it does not hold and must request them from the others. A student asks whether that loading takes a lot of time. The answer: yes, but the choice is between training slowly and not training at all.

Another student asks: if parameters are sharded, isn't that model parallelism? The speaker's distinction: under ZeRO, **all the computation** for a sub-batch happens on one GPU, and missing parameters arrive by communication; gradients and optimizer states follow the parameters, so each GPU holds only the parts tied to its own shard. Model parallelism instead splits **the computation itself** across GPUs.

<details>
<summary>Formula: how much each GPU stores under ZeRO (from the ZeRO paper)</summary>

Notation: Ψ is the parameter count, N_d the number of data-parallel GPUs.

```
Plain data parallel:          2Ψ + 2Ψ + 12Ψ        = 16Ψ bytes
ZeRO-1 (shard optimizer):     2Ψ + 2Ψ + 12Ψ / N_d
ZeRO-2 (also gradients):      2Ψ + 14Ψ / N_d
ZeRO-3 (also parameters):     16Ψ / N_d
```

With the paper's example (Ψ = 7.5B, N_d = 64): plain data parallelism needs 120 GB per GPU, ZeRO-3 about 1.9 GB. These formulas are not on the slides; they come from the paper.

</details>

### Four ways to split the model

[Recording 58:01](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=3481s)

| Kind | What it splits | How the lecture describes it | Cost |
|---|---|---|---|
| Tensor parallelism (TP) | Matrices inside a layer | Each attention head can be computed independently on a different GPU; for the feedforward layer, following the [Megatron-LM](https://arxiv.org/abs/1909.08053) figure, the first matrix is split by columns and the second by rows | Results are exchanged at every layer |
| Pipeline parallelism (PP) | Different layers | Stage 0 on the first GPU, stage 1 on the second, passed along and back again in the backward pass ([GPipe](https://arxiv.org/abs/1811.06965)) | GPUs sit idle waiting on neighbors, the **bubble** |
| Context parallelism (CP) | Sequence length | Each GPU owns a group of queries while K and V rotate between GPUs (the slides cite [Ring Attention](https://arxiv.org/abs/2310.01889)) | K and V move constantly |
| Expert parallelism (EP) | MoE experts | Experts live on different GPUs; at the feedforward layer each token is sent to the GPU holding its assigned expert (the slides cite [GShard](https://arxiv.org/abs/2006.16668)) | Tokens travel there and back |

For context parallelism the speaker uses two tokens on two GPUs: GPU 1 computes $q_1, k_1, v_1$ and GPU 2 computes $q_2, k_2, v_2$; each handles its own query against the key and value it holds, then they hand their K and V to each other and repeat. With more tokens, you group them and keep passing K and V to your neighbor.

Add data parallelism and there are five, which some people call "5D parallelism." They combine freely; data parallelism plus tensor parallelism is perfectly fine.

### Why not always parallelize as much as possible

[Recording 1:08:38](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4118s)

Slide 86 gives three reasons: GPU utilization drops, GPUs are expensive (rented by the hour), and communication costs add up (ZeRO-3, for example, ships parameters every time).

How these are built from communication primitives like all-reduce and all-gather is derived in [CS336 Lecture 7](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en); how to combine them according to cluster topology is in [CS336 Lecture 8](/posts/ai/2026-08-22-cs336-parallelism-strategies-en).

**Self-check**: ZeRO-3 and tensor parallelism both leave each GPU with only part of the parameters. How do they divide the computation differently?

<details>
<summary>Answer</summary>

ZeRO-3 is a variant of data parallelism: each GPU processes different data but runs the whole model's computation, borrowing missing parameters from other GPUs on the fly. Tensor parallelism splits the same layer's computation on the same data, with each GPU computing part of a matrix and the results combined. Criterion: contrast "split the data, borrow the parameters" with "split the computation."

</details>

## The inference time budget: TTFT and TPOT

[Recording 1:09:54–1:16:44](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4194s)

Shervine opens with a question: a 10-token input asking for a 10,000-token output ("generate a story for my teddy bear to fall asleep") versus a 10,000-token input with a 10-token output ("describe this teddy bear"). Which is faster? The second. Input tokens can all be fed in at once and processed in parallel (like teacher forcing in training), but output tokens come one at a time.

Slide 92 writes this intuition as a formula, where O is the number of output tokens:

$$
T_{\text{request}} = T_{\text{queue}} + T_{\text{prefill}} + (O - 1)\, T_{\text{per output token}}
$$

- $T_{\text{queue}}$: the provider has more users than you, so your request waits in line. Batching strategy affects this; the lecture does not go into it. A common approach is the step-level scheduling proposed by [Orca](https://www.usenix.org/conference/osdi22/presentation/yu), known as continuous batching.
- $T_{\text{prefill}}$: running the whole prompt through once and computing every K and V. Fast relative to the number of tokens.
- The last term is decode, one token at a time, and slow.

That defines three metrics: **TTFT** (time to first token) = queue + prefill; **TPOT** (time per output token); and **TTLT** (time to last token), the whole request. The speaker says infrastructure teams watch the first two most closely: TTFT shows whether queueing and prefill strategies work, and TPOT determines whether users see text stream smoothly. TTLT is less useful for judging a system because it is tied to model behavior: if the model reasons at length, or users keep asking for long stories, TTLT grows without the system being any worse.

A student asks why per-output-token time is labeled "slow" when it may be shorter than the prefill. The speaker says the comparison is per token; and in multi-turn conversations, earlier content and the system prompt are often cached, which makes the actual prefill time even shorter.

**Prices tell the same story.** Slides 94–95 show screenshots of the OpenAI, Google, and Anthropic API pricing pages. The speaker observes that output tokens cost roughly five times as much as input tokens, and says no rule dictates that it must be five.

A serving system wants to be fast, high quality, and cheap. This lecture deals with fast and cheap, and the speaker suggests writing them as concrete bounds: for example, TTFT at most $\tau_1$, TPOT at most $\tau_2$, and a cap on cost.

**Self-check**: Queueing takes 0.2 s, prefill 0.3 s, TPOT is 20 ms, and the output is 500 tokens. What are TTFT and TTLT? If the prompt doubles in length, which one is mainly affected?

<details>
<summary>Answer</summary>

TTFT = 0.2 + 0.3 = 0.5 s. TTLT = 0.5 + 499 × 0.02 = 10.48 s. A longer prompt mainly lengthens prefill, so TTFT; TPOT may rise slightly because each step reads a larger KV cache, but with 500 output tokens most of the time is still decode. Criterion: TTFT includes only queueing and prefill; TTLT multiplies by (O − 1).

</details>

## Compute fast or move data fast: arithmetic intensity and the roofline

[Recording 1:16:44–1:22:51](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4604s)

This segment turns "why is decode slow" into something measurable. Three definitions:

- **Computational throughput**: how much computation per second, the TFLOPS on the spec sheet. It depends on the data type; numbers stored in fewer bits allow more operations per second.
- **Memory bandwidth**: how much data per second can move from HBM to SRAM for the compute units.
- **Arithmetic intensity**: computation done divided by memory moved, in FLOPs/byte. The first two are given by the hardware; this one depends on your workload.

Slide 100 gives orders of magnitude: SRAM about 100 MB, HBM about 100 GB, bandwidth about 1 TB/s, compute about 1,000 TFLOPS. The speaker warns that TFLOPS depends heavily on data type, so don't quote it without details. A student asks: if bandwidth is the bottleneck, why not just make it faster? The answer is that these components take a lot of chip area, so GPU design is a trade-off; ideally you'd have as much SRAM and as many compute units as possible, but you can't.

**The roofline.** Plot arithmetic intensity on the x-axis and achieved compute speed on the y-axis, and you get a line that rises and then flattens, shaped like a roof, hence the roofline model. The bend is the **ridge point**:

$$
I^* = \frac{P_{\max}}{B_{\text{HBM}}}
$$

$P_{\max}$ is peak compute and $B_{\text{HBM}}$ is HBM bandwidth. Below $I^*$ you are on the slope, **memory bound**, with compute idling while it waits for data; above $I^*$ you are on the plateau, **compute bound**.

The speaker places inference on the chart: each decode step reads the entire set of weights to predict one token, so decode sits in the memory-bound region; prefill has lots of parallel computation and, done well (with FlashAttention, say), should sit in the compute-bound region. The slide's line does not start at the origin; the speaker explains these charts are usually drawn on a log scale, and on a linear scale the line would pass through the origin.

<details>
<summary>This post's example: the H100 ridge point and decode's arithmetic intensity</summary>

Per the [NVIDIA H100 spec page](https://www.nvidia.com/en-us/data-center/h100/), the H100 SXM delivers about 989 TFLOPS of dense BF16 compute (the listed 1,979 includes sparsity) and 3.35 TB/s of memory bandwidth.

```
ridge point ≈ 989e12 FLOP/s ÷ 3.35e12 byte/s ≈ 295 FLOP/byte

decode one token (batch = 1, BF16 weights):
  each parameter: read 2 bytes, do 1 multiply + 1 add = 2 FLOP
  arithmetic intensity ≈ 2 FLOP / 2 bytes = 1 FLOP/byte

with batch = B, one read of the weights serves B requests:
  arithmetic intensity ≈ B FLOP/byte
```

This rough estimate ignores KV cache reads and counts only weights. 1 is far below 295, so single-user decode leaves the GPU mostly waiting for data; batching many requests together is the most direct way to push decode toward compute bound.

</details>

**Self-check**: The same model runs batch-1 decode on GPU A (twice the compute, same bandwidth) and GPU B (twice the bandwidth, same compute). Which is faster?

<details>
<summary>Answer</summary>

GPU B. Batch-1 decode is memory bound, so its speed is set by bandwidth; doubling compute only moves the ridge point to the right while decode stays on the slope, barely faster. Criterion: first decide which side of the ridge point the workload is on, then identify the bottleneck spec.

</details>

## The KV cache and its three problems

[Recording 1:22:51–1:32:51](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=4971s)

A new token must attend to every earlier token, so it needs their keys and values. Old tokens' K and V never change, so compute them once, store them, and read them later. The slides walk through "a cute teddy bear" token by token: the K and V of "teddy" get reused by "bear" and everything after.

**The trace in pricing.** Slide 110 shows the three providers' cached-input prices, and the speaker notes that cached input costs about a tenth of fresh input. He separates two kinds of caching: the cost of reading the KV cache at every decode step is already included in the output price; "cached input" on the pricing page refers to caching across turns, for example when you continue a conversation and the provider has already computed the earlier state, so it is not new input.

The speaker then runs the whole segment off a list of three KV cache problems, with a before/after on slides 136–137:

| Problem | Fix | How |
|---|---|---|
| Vectors scattered around (fragmentation) | PagedAttention | A lookup table places K and V in fixed-size blocks |
| Too many vectors | GQA | Several query heads share one set of K and V |
| Vectors too long | MLA | Store only a compressed low-dimensional representation |

### Fragmentation: PagedAttention

[Recording 1:24:52](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5092s)

Suppose you are an inference provider with a chunk of GPU memory for the KV cache, and you want to know how many requests you can hold. Every API has a "maximum x output tokens" limit, so the naive approach reserves one contiguous block per request sized for the prompt plus the maximum output. But actual completions are usually much shorter: the extra reservation goes unused, and since it sits in the middle, new requests cannot use it either. At scale you end up with lots of memory that is "not used, yet not usable."

[PagedAttention](https://arxiv.org/abs/2309.06180) keeps a lookup table instead: K and V need not be contiguous; they go into blocks of size B, and the table records which blocks belong to each request. The most you can waste is one partially filled block.

Block size is a trade-off (slides 118–119): too small a B makes the table large and the overhead high; too large a B brings the waste back. A typical value is **B = 16**. The vLLM paper measured that in existing systems only 20.4% to 38.2% of reserved space actually held token state; vLLM's implementation details are in our [vLLM deep dive](/posts/ai/2026-03-14-vllm-inference-engine-en).

### Too many vectors: GQA

[Recording 1:28:06](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5286s)

Multi-head attention (MHA) has h heads, so each token stores h keys and h values. **GQA** (grouped-query attention) keeps only G sets of keys and values, G < h, each shared by several query heads. Two extremes: G = h is MHA; G = 1 is **MQA** (multi-query attention), one K and one V per token. The speaker says G = 1 is usually not what you want, because K and V become too inexpressive for the model to build good features.

The savings are $1 - G/h$. Slide 125's order of magnitude: h = 24 and G = 2 saves more than 90% ($1 - 2/24 \approx 91.7\%$), citing a Qwen model card that uses G = 2 in practice.

A student asks whether this makes the model weaker. The speaker says yes, it is a trade-off. Pretraining teams run grid searches and ablations to pick G; in practice, G close to h buys only marginal improvements, so nobody uses G = h. The architecture side was covered in our [Lecture 2 guide](/posts/ai/2026-09-29-cme295-transformer-tricks-en).

### Vectors too long: MLA

[Recording 1:31:00](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5460s)

After GQA each token still has 2G vectors. The speaker says the next method is not necessarily used together with GQA; it can be an alternative: **MLA** (multi-head latent attention, from [DeepSeek-V2](https://arxiv.org/abs/2405.04434)).

It works like LoRA's low-rank decomposition: one matrix projects the input to a small representation, and a learned "decoder" reconstructs each head's K and V from it when needed. Only the small representation goes into the KV cache; the reconstructed K and V are not stored. The key is that the first projection is **shared** across all heads and across both K and V, so each token stores just one short vector. The DeepSeek-V2 paper reports a 93.3% smaller KV cache than its own DeepSeek 67B and up to 5.76 times the maximum generation throughput.

<details>
<summary>This post's example: how big the KV cache gets</summary>

```
KV cache bytes = 2 × layers × KV heads × head dimension
                 × sequence length × batch × bytes per value
(the leading 2 = one copy each for K and V)
```

With the 8B configuration from the [Llama 3 paper](https://arxiv.org/abs/2407.21783) (32 layers, 32 query heads, 8 KV heads, 128 dimensions per head) in BF16:

```
per token:     2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KiB
8,192 tokens:  128 KiB × 8,192 = 1 GiB (one request)
```

Without GQA, with 32 KV heads, the same length needs 4 GiB.

</details>

**Self-check**: A model with h = 32 switches from MHA to GQA with G = 8. What fraction of the original KV cache remains? Which of the three problems does it fix, and can it be combined with PagedAttention?

<details>
<summary>Answer</summary>

8/32 = 1/4 remains, a 75% saving. It fixes "too many vectors"; PagedAttention fixes fragmentation. They address different problems and combine fine (fewer KV vectors, managed in blocks). Criterion: get the ratio right and note that the two methods target different problems.

</details>

## Speculative decoding: letting the large model verify several tokens at once

[Recording 1:32:51–1:45:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5571s)

So far the focus was the attention layer; this segment looks at where tokens are actually produced. The starting point: generating tokens is slow because they come one at a time, but **verifying** tokens is cheap, because they can all be fed in at once, as in prefill or training.

The procedure (slides 139–145, citing [Chen et al.](https://arxiv.org/abs/2302.01318)):

1. A small **draft model** quickly guesses the next k tokens after "[BOS] my teddy bear", say "is cute and smart"
2. Feed the prompt plus those k tokens into the large **target model** in one pass to get the probability at every position
3. Accept or reject them left to right

Write $T_i(x)$ for the target's probability of a token and $D_i(x)$ for the draft's. The rule on slide 144:

- If $T_i(x) \geq D_i(x)$ (the target is more confident than the draft): accept
- Otherwise, accept with probability $T_i(x) / D_i(x)$ and reject with probability $1 - T_i(x)/D_i(x)$
- On a rejection, resample the token from the residual distribution $[T_i - D_i]_+$ (normalized) and end the round

There is also a bonus: if all k are accepted, the target's forward pass has already computed the distribution for position k+1, so you can sample one more token, **a next token for free**.

### Why the output distribution is unchanged: the blackboard proof

[Recording 1:36:14](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=5774s)

The speaker asks the class whether they believe this rule reproduces the target's distribution. Some nod, some look doubtful, so he proves it on the board. Let X be the token that comes out; the goal is $P(X = x) = T(x)$.

By the law of total probability, split into "the draft's guess is accepted" and "rejected, then resampled":

$$
P(X = x) = P(\text{draft proposes } x \text{ and it is accepted}) + P(\text{reject}) \cdot P(X = x \mid \text{reject})
$$

First term: the draft proposes x with probability $D(x)$, accepted with probability $\min(1, T(x)/D(x))$, so the product is $\min(D(x), T(x))$.

Second term: the rejection probability is 1 minus the probability that any token is accepted,

$$
P(\text{reject}) = 1 - \sum_{x'} \min(D(x'), T(x')) = \sum_{x'} \max(0,\, T(x') - D(x'))
$$

This step uses $1 = \sum_{x'} T(x')$ and $T - \min(D, T) = \max(0, T - D)$. After a rejection we sample from the residual distribution,

$$
P(X = x \mid \text{reject}) = \frac{\max(0,\, T(x) - D(x))}{\sum_{x'} \max(0,\, T(x') - D(x'))}
$$

Multiplying, the denominator cancels exactly, leaving $\max(0, T(x) - D(x))$. Altogether:

$$
P(X = x) = \min(D(x), T(x)) + \max(0,\, T(x) - D(x)) = T(x)
$$

The last equality checks out case by case: if $D(x) \geq T(x)$ it is $T(x) + 0$; if $T(x) > D(x)$ it is $D(x) + T(x) - D(x)$. So speculative decoding is not an approximation; the output distribution is exactly that of sampling from the large model alone.

<details>
<summary>Expected tokens per round (from Leviathan et al.)</summary>

[Leviathan et al.](https://arxiv.org/abs/2211.17192) assume each guess is accepted with roughly constant probability α and γ tokens are guessed per round:

```
expected tokens per round = (1 − α^(γ+1)) / (1 − α)
```

With α = 0.8 and γ = 4 that is about 3.4 tokens for a single run of the large model. This formula is not on the slides.

</details>

### Aligning the draft with the target: distillation and MTP

[Recording 1:44:53](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=6293s)

Rejections are what you want to avoid at all costs: a rejection ends the round and everything the draft guessed after that point is wasted work. So slides 146–147 list two conditions: the draft should be noticeably faster than the target, and its next-token distribution should be close to the target's.

The way to bring the distributions together is **knowledge distillation** ([Hinton et al.](https://arxiv.org/abs/1503.02531)): train the small model on the large model's full probability distribution, not just the correct answer. The slides cite [DistillSpec](https://arxiv.org/abs/2310.08461), which uses distillation specifically to improve speculative decoding.

The other route is **multi-token prediction** (MTP, [Gloeckle et al.](https://arxiv.org/abs/2404.19737)): one LLM trains k output heads (linear plus softmax) to predict the next k tokens at once; the k heads serve as the draft and the first head as the verifier. Draft and target are the same model, so no separate small model is needed.

It is not always worth it. The [vLLM speculative decoding docs](https://docs.vllm.ai/en/latest/features/speculative_decoding/) say it is meant for "medium-to-low QPS, memory-bound workloads": under heavy traffic the batch is already large and the GPU is already compute-bound, so extra guesses take compute away. That is the roofline from the previous section again.

**Self-check**: The vocabulary has only tokens A and B, the target is $T = (0.6, 0.4)$ and the draft is $D = (0.9, 0.1)$. What is the total acceptance probability? What is the residual distribution after a rejection? Verify that $P(X = A) = 0.6$.

<details>
<summary>Answer</summary>

A: $D > T$, accepted with probability 0.6/0.9 = 2/3; B: $T > D$, always accepted. Total acceptance $= \min(0.9, 0.6) + \min(0.1, 0.4) = 0.6 + 0.1 = 0.7$. Residual $[T - D]_+ = (0, 0.3)$, normalized to (0, 1), so a rejection always yields B. $P(X = A) = 0.6 + 0.3 \times 0 = 0.6$ and $P(X = B) = 0.1 + 0.3 \times 1 = 0.4$, matching the target. Criterion: use min for acceptance and max(0, T − D) for the residual.

</details>

## Wrap-up: answering the two questions

[Recording 1:45:54](https://www.youtube.com/watch?v=25KIyaeI_Fg&t=6354s)

Slides 153–154 condense the inference half into two lines: to make it fit, organize vectors better (PagedAttention) and make them fewer and smaller (GQA, MLA); to make it fast, generate more tokens at once (speculative decoding, MTP). The speaker closes with a screenshot of the [Artificial Analysis](https://artificialanalysis.ai/) homepage: about two thirds of that benchmark aggregator's front page is inference-speed charts, a sign that these topics are what users actually care about.

Laid side by side, every technique in the lecture trades one resource for another. This table is this post's summary:

| Technique | Saves | Costs |
|---|---|---|
| FlashAttention's backward recomputation | HBM traffic and memory | Some extra computation |
| ZeRO-3 / tensor parallelism | Per-GPU memory | Communication between GPUs |
| KV cache | Recomputing past tokens | Memory that grows with conversation length |
| PagedAttention block size | Small B: less fragmentation | Larger lookup overhead |
| GQA / MLA | KV cache memory | Expressiveness; needs retraining and ablations |
| Speculative decoding | Decode latency | Draft compute; may slow things down under load |

## Connecting back to the models you use

- **When using an API**: a long prompt delays the first token (prefill); the streaming speed is TPOT. Compare inference services on the two separately. In multi-turn conversations, keep the beginning (system prompt, earlier turns) stable so you get cached-input pricing.
- **When self-hosting**: estimate the KV cache first. Plug your model's configuration, context length, and concurrency into the formula above; often the KV cache, not the weights, is what limits you. Our [vLLM self-hosting decision guide](/posts/ai/2026-08-21-vllm-self-host-decision-en) works through how GPU utilization affects cost per million tokens.
- **When considering speculative decoding**: look at your traffic first. It helps at low traffic when single-user latency matters and may not help at high traffic. The draft should ideally be from the same family as the target, or distilled from it.
- **When training or fine-tuning**: if the model does not fit, try ZeRO/FSDP first, which needs no model code changes; only then consider tensor or pipeline parallelism.

## Compared with the 2025 edition

| 2026 Lecture 5 content | Where it was in 2025 | What changed in 2026 |
|---|---|---|
| FlashAttention | Lecture 4 | Fuller blackboard derivation of blockwise softmax; adds FlashAttention 4 (Blackwell) |
| Data parallelism, ZeRO | Lecture 4 | Largely the same |
| Model parallelism | Lecture 4, names only | TP, PP, CP, and EP each get a figure and an example |
| TTFT/TPOT, pricing, roofline | Absent | New |
| KV cache, PagedAttention, GQA, MLA | Lecture 3 | Tied together as "three problems"; adds the block-size trade-off |
| Speculative decoding, MTP | Lecture 3 | Adds the blackboard proof and knowledge distillation |
| Quantization, mixed precision | Lecture 4 | Not in this lecture |

The 2025 recordings: [Lecture 3](https://www.youtube.com/watch?v=Q5baLehv5So), [Lecture 4](https://www.youtube.com/watch?v=VlA_jt_3Qc4).

## Cumulative self-check

Questions 1, 2, 3, and 6 are adapted from Parts III and IV of the [2025 midterm](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf), with answers in the [solutions PDF](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf). The 2026 final is on December 9.

1. What is the KV cache used for at inference time, and what cost does it save? (III.5)
2. Compared with MHA, what is the main way MQA/GQA reduce latency? (III.6)
3. What problem is PagedAttention mainly trying to solve? (III.3)
4. FlashAttention and speculative decoding are both described as "exact." What argument shows each one leaves the result unchanged?
5. Use the roofline to explain why a larger batch makes decode more efficient but also shrinks the benefit of speculative decoding.
6. Explain the core idea of FlashAttention and give one observed benefit. (IV.10)
7. Using this post's KV cache formula, compute the KV cache for Llama 3 8B at 32K context, 4 concurrent requests, BF16. Then say which of the three problems' fixes can shrink it.

<details>
<summary>Criteria for questions 4, 5, and 7</summary>

- Question 4: FlashAttention rests on an algebraic identity: multiplying the numerator and denominator by the same constant and rescaling leaves $N/D$ unchanged. Speculative decoding rests on a probability argument: the acceptance term $\min(D, T)$ plus the resampling term $\max(0, T - D)$ equals exactly $T$.
- Question 5: a larger batch shares one read of the weights across more requests, raising arithmetic intensity toward compute bound. Speculative decoding exploits compute that sits idle during decode; once compute is saturated, verifying extra tokens is no longer free.
- Question 7: 128 KiB × 32,768 × 4 = 16 GiB. GQA (already at 8 KV heads) and MLA make vectors fewer and shorter; PagedAttention does not shrink the total but cuts waste from over-reservation.

</details>

## Going deeper

- Count FLOPs, memory, and rooflines yourself: [CS336 Lecture 2](/posts/ai/2026-08-22-cs336-resource-accounting-en)
- The GPU memory hierarchy and how FlashAttention works: [CS336 Lecture 5](/posts/ai/2026-08-22-cs336-gpu-tpu-en)
- Writing fused kernels: [CS336 Lecture 6](/posts/ai/2026-08-22-cs336-kernels-triton-en), [Triton's fused softmax tutorial](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html)
- Communication primitives and parallelism strategies: [CS336 Lecture 7](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), [CS336 Lecture 8](/posts/ai/2026-08-22-cs336-parallelism-strategies-en), Hugging Face's [Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook)
- The full inference ledger with quantization and continuous batching: [CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference-en)
- Get a feel for TTFT and speculative decoding with sliders: [Learn Inference interactive guide](/posts/ai/2026-09-29-learn-inference-interactive-guide-en)
- The other new 2026 lectures: [RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en), [AI Agents](/posts/ai/2026-09-29-cme295-ai-agents-en), [Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en)

## Course video sources

This post is based on the CME295 2026 Lecture 5 recording ([Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 5 - LLM Systems](https://www.youtube.com/watch?v=25KIyaeI_Fg), 1:47:01) and the [2026 slides](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf); the player is in the introduction. The captions are YouTube's human-made English captions; where they mishear names such as ZeRO, MQA, and LoRA, the slides take precedence.

Content check: verified against the video transcript (2026-11-23): read the full human-made English captions with timestamps; section timestamp links come from the caption timecodes; classroom explanations, Q&A, and blackboard derivations are paraphrased from the captions, while formulas and numbers follow the slides (pages 46–47, 60, 92, 100–102, 119, 125, 144).

Course and recording entries:

- [Official 2026 syllabus](https://cme295.stanford.edu/syllabus/)
- [CME295 Autumn 2026 playlist](https://www.youtube.com/playlist?list=PLakGfbKCei80)

Checked: 2026-11-23.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The 2026 Lecture 5 recording is not yet published, so the 2025 Lecture 3 and 4 videos previously marked as included are now labelled related supplementary videos, and their titles were corrected.
- 2026-10-10: Checked the video content against its transcript. Both 2025 videos (Lectures 3 and 4) do cover inference speedups, parallelism and quantization, matching the post's "related supplement" label; nothing needed correcting.
- 2026-11-09: Rechecked video status. The 2026 Lecture 5 recording is now on the official syllabus; added the link and rewrote the status line. Updating the body against the recording is still to do.
- 2026-11-23: Rewrote the post from the 2026 Lecture 5 captions and 156-slide deck. Reordered to match the lecture (FlashAttention → distributed training → inference); added the TTFT/TPOT formula, the roofline, context and expert parallelism, the "three KV cache problems" framing, the full speculative decoding proof, and knowledge distillation; removed the kernel and hardware-spec sections the lecture did not cover; moved the recording into the introduction, set the status to Videos included, and added timestamp links and self-checks to each section.

## References

- [CME 295 2026 syllabus](https://cme295.stanford.edu/syllabus/)
- [2026 Lecture 5 slides (PDF)](https://cme295.stanford.edu/slides/fall26-cme295-lecture5.pdf) / [recording](https://www.youtube.com/watch?v=25KIyaeI_Fg)
- [2025 Lecture 3 slides (PDF)](https://cme295.stanford.edu/slides/fall25-cme295-lecture3.pdf) / [recording](https://www.youtube.com/watch?v=Q5baLehv5So)
- [2025 Lecture 4 slides (PDF)](https://cme295.stanford.edu/slides/fall25-cme295-lecture4.pdf) / [recording](https://www.youtube.com/watch?v=VlA_jt_3Qc4)
- [2025 midterm](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf) / [solutions](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf)
- [NVIDIA H100 Tensor Core GPU specifications](https://www.nvidia.com/en-us/data-center/h100/)
- [Dao et al., FlashAttention (2022)](https://arxiv.org/abs/2205.14135)
- [Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (2019)](https://arxiv.org/abs/1910.02054)
- [Shoeybi et al., Megatron-LM (2019)](https://arxiv.org/abs/1909.08053)
- [Huang et al., GPipe (2018)](https://arxiv.org/abs/1811.06965)
- [Liu et al., Ring Attention with Blockwise Transformers for Near-Infinite Context (2023)](https://arxiv.org/abs/2310.01889)
- [Lepikhin et al., GShard (2020)](https://arxiv.org/abs/2006.16668)
- [Hugging Face, The Ultra-Scale Playbook (2025)](https://huggingface.co/spaces/nanotron/ultrascale-playbook)
- [Yu et al., Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)](https://www.usenix.org/conference/osdi22/presentation/yu)
- [Kwon et al., Efficient Memory Management for LLM Serving with PagedAttention (2023)](https://arxiv.org/abs/2309.06180)
- [Ainslie et al., GQA (2023)](https://arxiv.org/abs/2305.13245)
- [Shazeer, Fast Transformer Decoding: One Write-Head is All You Need (2019)](https://arxiv.org/abs/1911.02150)
- [DeepSeek-AI, DeepSeek-V2 (2024)](https://arxiv.org/abs/2405.04434)
- [Llama Team, The Llama 3 Herd of Models (2024)](https://arxiv.org/abs/2407.21783)
- [Chen et al., Accelerating Large Language Model Decoding with Speculative Sampling (2023)](https://arxiv.org/abs/2302.01318)
- [Leviathan et al., Fast Inference from Transformers via Speculative Decoding (2022)](https://arxiv.org/abs/2211.17192)
- [Hinton et al., Distilling the Knowledge in a Neural Network (2015)](https://arxiv.org/abs/1503.02531)
- [Zhou et al., DistillSpec: Improving Speculative Decoding via Knowledge Distillation (2023)](https://arxiv.org/abs/2310.08461)
- [Gloeckle et al., Better & Faster Large Language Models via Multi-token Prediction (2024)](https://arxiv.org/abs/2404.19737)
- [vLLM docs: Speculative Decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/)
- [Artificial Analysis](https://artificialanalysis.ai/)
- [Triton: Fused Softmax tutorial](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html)
- [Reading Stanford CME295 (series overview)](/posts/ai/2026-09-29-cme295-course-overview-en)
