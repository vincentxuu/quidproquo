---
title: "CMU 10-423 L17–L18: Distributed Training, FlashAttention, and Efficient Decoding — Where to Start When One GPU Can't Hold the Model and Inference Is Too Slow"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, distributed-training, parallelism, flashattention, pagedattention, speculative-decoding]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 17
tldr: "The last two lectures of the Scaling Up unit in CMU 10-423 Spring 2026. L17 starts from the claim that communication between GPUs is the main bottleneck, then walks through data parallelism, Megatron-style tensor parallelism, 1F1B pipeline parallelism, ZeRO optimizer parallelism, TeraPipe token parallelism, and expert parallelism. Its conclusion: data parallelism is still king, and the rest exist to push more data through it. L18 covers two things. FlashAttention combines tiling, online softmax, and recomputation to cut HBM traffic without changing the result. On the decoding side, PagedAttention manages KV-cache memory and speculative decoding reduces calls to the large model."
description: "A guide to Lectures 17 and 18 of CMU 10-423/623/723 Generative AI (Spring 2026): GPU specs and the communication bottleneck; six kinds of parallelism (data, tensor, pipeline, optimizer/ZeRO, token, expert); pairing column- and row-parallel layers; 1F1B and weight stashing; FlashAttention's matrix tiling, online softmax, GPU memory hierarchy, operator fusion, and recomputation; PagedAttention and speculative decoding. Includes notes on slide versions and what outside readers can access."
draft: false
glossary:
  - term: "1F1B"
    aliases: ["one-forward-one-backward"]
    definition: "A pipeline-parallel schedule in which, at steady state, each GPU alternates one microbatch forward pass with one backward pass, cutting idle time in the pipeline."
    context: "The L17 slides use figures from PipeDream and Megatron-LM to explain 1F1B and pipeline flushes."
  - term: "online softmax"
    definition: "A softmax algorithm that updates the running maximum and normalizer in one sweep, cutting safe softmax's three memory passes to two and making it possible to compute softmax block by block."
    context: "L18 uses it to explain why attention can be tiled like matrix multiplication, which FlashAttention depends on."
    links:
      - label: "Milakov & Gimelshein 2018"
        url: "https://arxiv.org/abs/1805.02867"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)

**This guide is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 17 of [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) and the last post in the "Scaling Up" unit. The [previous post](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en) answered "how big should the model be". This one answers "how do you train and serve a model that big".

Official materials used: the [Lecture 17 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf) and their [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf), the [Lecture 18 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf), and the [course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html). I downloaded and checked all of them on 2026-09-30. The schedule lists no readings for these two lectures, so every paper cited here is one the slides cite.

> **Version note**: The L17 PDF (March 18) was created in March 2026, but its reminder slide says HW4 "Out: Thu, Oct 23" and HW623 "Due: Mon, Dec 1". Those are Fall 2025 dates, so the content appears to be carried over from the previous semester. The slides credit Henry Chai and Pat Virtue. L18 (March 23) has Spring 2026 dates on its reminder slide and no inked version. Recordings are on CMU's internal Panopto and not visible from outside.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## L17: Distributed training

### The bottleneck is between GPUs

L17 revisits L15's Llama cost question and quotes a news item: Meta's two newly announced clusters each have 24,576 H100s, up from 16,000 A100s in the original clusters. Then a GPU comparison table (as on the slide):

| | A100 | H100 | B200 |
|---|---|---|---|
| Memory | 80 GB | 80 GB | 192 GB |
| BF16 performance | 0.6 PFLOPS | 1.9 PFLOPS | 4.5 PFLOPS |
| Inter-GPU bandwidth | ~0.6 TB/s | ~0.9 TB/s | ~1.8 TB/s |
| Price | ~$10K | ~$25K | ~$50K |

The slide's takeaway: **communication between GPUs is the main bottleneck in distributed systems, and speeding it up is worth a lot of money.** That sets the goal for the lecture: divide the work of training an LLM across many GPUs while keeping inter-GPU communication to a minimum. The good news is that Transformer architectures parallelize very well.

The slides list six kinds of parallelism: data, model (tensor), pipeline, optimizer, token, and expert. The rest of this section follows that order.

### Data parallelism: simplest, but every GPU holds the whole model

Split each minibatch evenly across GPUs, have each run forward and backward on its share, then sum the gradients and broadcast them. The slides call this the simplest and most effective form of parallelism when you can use it, with only one inter-GPU communication per iteration.

The catch is that every GPU stores a full copy of the model. The slides do the math with Llama-4. Maverick has about 400B parameters, which at 16 bits (2 bytes) each is about 800 GB. Behemoth has about 2T parameters, about 4,000 GB. A B200 has 192 GB. So the model has to be split.

### Tensor parallelism: alternate column and row

Model parallelism (also called tensor parallelism) splits the computation inside one layer across GPUs. In a Transformer, the parts to split are the MLP and attention blocks. The derivation follows [Megatron-LM](https://arxiv.org/abs/1909.08053):

- The weights of a linear layer $f(X) = XW$ can be split by columns (**column-parallel**) or by rows (**row-parallel**).
- Column-parallel concatenates outputs in the forward pass and needs a sum in the backward pass. Row-parallel is the reverse.
- So two consecutive MLPs can alternate column-parallel and row-parallel to minimize sums across GPUs. In Megatron's figure, $f$ is the identity in the forward pass and a sum in the backward pass, and $g$ is a sum forward and the identity backward.
- Multi-head attention splits naturally by head. If the heads are concatenated horizontally, the output can feed a row-parallel MLP directly.

<details>
<summary>A quick note on the slides' matrix splits</summary>

Let $Z = XW$. Split $W$ by columns as $[W_1, W_2]$ and $Z = [XW_1, XW_2]$, with each GPU needing all of $X$. Split by rows and $X$ must be split to match as $[X_1, X_2]$, giving $Z = X_1 W_1 + X_2 W_2$ with one final sum. The slides' observation is that the two schemes' forward and backward computations mirror each other.
</details>

### Pipeline parallelism: 1F1B and weight stashing

Putting different layers on different GPUs is pipeline parallelism. Layers run in sequence, though, so a naive version leaves GPUs idle most of the time. The slides use figures from [PipeDream](https://arxiv.org/abs/1806.03377) to show the fixes:

1. Work on several microbatches at once.
2. **1F1B**: at steady state, each GPU alternates one forward and one backward pass.
3. If weights update on every backward pass, a microbatch's forward and backward passes use different weights. The gap is worse on earlier GPUs and can hurt convergence. The fix is **weight stashing**: save the weights after each forward pass and reload them for the matching backward pass.
4. The [Megatron-LM 2021](https://arxiv.org/abs/2104.04473) version flushes the pipeline between minibatches to sync. The slides note that 1F1B stays efficient even when forward and backward passes take different amounts of compute.
5. How should layers be split across GPUs? Profile the code, then use dynamic programming.

At this point the slides state a conclusion: **data parallelism is still king.** Tensor and pipeline parallelism exist to support it, so more data can flow through the forward and backward passes.

### Optimizer parallelism: Adam's state outweighs the weights

An SGD update needs only the gradient and the current weights. Adam also stores a first moment $M$ and a second moment $S$. In mixed-precision training, $M$ and $S$ have the same shape as the weights and are usually kept in FP32 because of the squared term in $S$. Citing [ZeRO](https://arxiv.org/abs/1910.02054), the slides put Adam's extra state at K = 12 bytes per parameter (gradient, $M$, and $S$ at 4 bytes each). ZeRO-DP, data parallelism powered by the zero redundancy optimizer, spreads that state across GPUs instead of having every GPU keep a copy.

### Token parallelism and expert parallelism

- **Token parallelism** ([TeraPipe](https://arxiv.org/abs/2102.07988)): with causal attention, token t in layer l depends only on earlier tokens at that layer. So you don't have to wait for the whole previous layer. Once tokens 1 through t−1 are done in layer l−1, token t in layer l can start. The slides say finer pipeline granularity means less idle time, and the gain grows with sequence length as models move toward longer contexts. The cited figure uses an all-forward-all-backward schedule, which removes the need for weight stashing but adds idle time.
- **Expert parallelism**: continuing [L16's MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en), put each expert on its own GPU and give it a capacity. Following [GShard](https://arxiv.org/abs/2006.16668), tokens over capacity pass straight to the next layer through the residual connection. Following the [Switch Transformer](https://arxiv.org/abs/2101.03961) figure, a capacity factor that's too small invites overflow, and one that's too large leaves some GPUs underused.

Midway through, the slides also update the LLM size table with LLaMA-4 (2025): 30T tokens and 2T parameters (288B active).

## L18: FlashAttention and efficient decoding

### Why care about FlashAttention

The slides start with the key point: FlashAttention computes **exact** attention, so perplexity and model quality don't change. The only metric that matters is runtime. It appeared at the HAET workshop at ICML in July 2022 and at NeurIPS that December. The slides call it one of the most impactful ideas in ML recently, one that many people use without knowing it.

### Background 1: tiling matrix multiplication

Each output entry of a matrix product is the dot product of a row and a column, so the product decomposes into blocks. Each output block is the sum of products of matching input blocks. Tiling exploits this: keep the big matrices in large, slow memory, move one pair of small blocks at a time into small, fast memory, compute, and accumulate into the output.

Attention can't do this directly. Addition in matrix multiplication is associative. The softmax in attention is not.

### Background 2: online softmax

To avoid overflow when raising $e$ to large powers, softmax usually subtracts the maximum first (safe softmax), and every deep learning library does this. But safe softmax takes three passes over the data, each one reading memory. [Online softmax](https://arxiv.org/abs/1805.02867) updates the maximum and the normalizer as it goes, cutting this to two passes. The slides cite a 1.33x apparent speedup and about 1.3x in practice, because it needs less memory bandwidth.

### FlashAttention itself

**GPU memory hierarchy**: SRAM is smallest and fastest, HBM is larger but much slower, and CPU DRAM is largest and slowest. The slides cite [Data Movement Is All You Need](https://arxiv.org/abs/2007.00072): in Transformer training, matrix multiplication accounts for 99% of FLOPs but only 61% of runtime. A lot of time goes to moving data.

**Operator fusion**: the usual approach moves each layer's input from HBM to SRAM, computes, and writes the output back to HBM. Fusion moves the input into SRAM once, runs a whole sequence of operations, and writes back only the final output. The slides point out that standard attention is written the first way, with Q, K, V, the score matrix S, the probability matrix P, and the output O all going back and forth through HBM.

[FlashAttention](https://arxiv.org/abs/2205.14135) combines two ideas that are not new on their own:

1. **Tiling**: compute attention weights block by block so nothing has to fit in SRAM all at once. The hard part is that softmax spans multiple blocks, which is where online softmax comes in.
2. **Recomputation**: never store the full attention matrix, and recompute each block when the backward pass needs it. The slides first show this on a two-layer MLP: delete the hidden layer $z$ after the forward pass and recompute it from $x$ during the backward pass.

The slides also use a [FlashAttention-2](https://arxiv.org/abs/2307.08691) figure to show how the blocks are computed.

### Decoding: PagedAttention

The slides first review operating-system virtual memory: each process sees a contiguous virtual address space, and the OS maps it to scattered physical pages through page tables.

[PagedAttention](https://arxiv.org/abs/2309.06180) is virtual memory for attention on the GPU:

- **The problem**: serving an LLM means keeping a KV cache that grows with the number of tokens. Standard systems allocate one contiguous block, which causes internal fragmentation (reserved space left unused), external fragmentation (gaps between requests), and wasted capacity. Poor memory utilization means poor throughput in tokens per second.
- **The fix**: split the KV cache into blocks holding a fixed number of tokens, store them non-contiguously, and keep a block table mapping logical to physical addresses. The attention kernel works block by block. Blocks are allocated only when needed and reused when no longer needed.

### Decoding: speculative decoding

The slides give a four-step algorithm:

1. Prefill the prompt into the large target model.
2. Use a small draft model to propose the next n tokens quickly.
3. Prefill those n draft tokens into the target model to verify them, keeping the first k ≤ n.
4. Advance the position by k and repeat steps 2 and 3.

It cuts the number of large-model calls per output token, which raises throughput, and it keeps the same output distribution as standard decoding.

## Exams and assessment

The L18 reminder slide says the March 30 evening exam covers Lectures 1–15 (the same material as Quizzes 1–4), allows one double-sided sheet of notes, and includes open-ended questions as well as multiple choice. So L17 and L18 are not on the exam; the schedule places them under Quiz 5 (L16–L20). Neither lecture has a programming assignment, and the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) has no dedicated question on them. The questions on the slides are the only built-in self-check.

## How to study these two lectures

1. For L17, write one sentence per kind of parallelism: what it splits and what it has to communicate. Then compare against slide number 50's conclusion that data parallelism is still king.
2. For tensor parallelism, verify the forward and backward passes of the column and row splits on paper with 2×2 blocks.
3. For L18, read tiling and online softmax before FlashAttention. In the other order, it's hard to see why softmax is the obstacle.
4. Put the PagedAttention slide next to the page-table slide and match them item by item: page ↔ KV block, page table ↔ block table.

**What to do**: tonight, write a 20-line online softmax in NumPy. Sweep a long vector in three chunks, keep only the running maximum and normalizer, and compare the result with `scipy.special.softmax`. Once that works, FlashAttention's tiling is mostly a matter of applying it to each row of $QK^T$.

## What this post can and can't confirm

Confirmed: the text, tables, and citations on both slide decks; schedule dates and Quiz 5 coverage; and the exam details on the L18 reminder slide. Not confirmed: what was said or drawn in class (recordings are on Panopto, and L18 has no inked version), numbers shown only in figures the text layer doesn't capture (such as FlashAttention's measured speedups and the speculative decoding figure), and the original sources behind the GPU table (the slides link NVIDIA datasheets, which I did not check line by line).

## Further reading

- Building parallelism from collectives: [CS336 Lecture 7: Build Data, Tensor, and Pipeline Parallelism from Collectives](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en) and [CS336 Lecture 8: Align ZeRO, FSDP, and 3D Parallelism with Hardware Topology](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)
- Inference bottlenecks: [CS336 Lecture 10: LLM Inference Is About Reading Weights and KV Cache Less Often](/posts/ai/2026-08-22-cs336-inference-en)
- The systems-course deep dive: [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en), especially [L14–L15 on data parallelism](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en), [L18 on ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en), [L21 on FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en), and [L22 and L24 on PagedAttention and LLM serving](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en)

Series: Previous: [L15–L16: Scaling Laws and Mixture of Experts](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en) | Next: [L19 and L21: Long Context and State Space Models](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L17 and L18 dates, Quiz 5 coverage
- [Lecture 17 slides: Distributed Training](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf), [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf)
- [Lecture 18 slides: Efficient Attention (FlashAttention) & Efficient Decoding Strategies](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Shoeybi et al. 2019: Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Harlap et al. 2018: PipeDream](https://arxiv.org/abs/1806.03377)
- [Narayanan et al. 2021: Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473)
- [Rajbhandari et al. 2019: ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Li et al. 2021: TeraPipe: Token-Level Pipeline Parallelism](https://arxiv.org/abs/2102.07988)
- [Lepikhin et al. 2020: GShard](https://arxiv.org/abs/2006.16668)
- [Fedus et al. 2021: Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Milakov & Gimelshein 2018: Online normalizer calculation for softmax](https://arxiv.org/abs/1805.02867)
- [Ivanov et al. 2020: Data Movement Is All You Need](https://arxiv.org/abs/2007.00072)
- [Dao et al. 2022: FlashAttention](https://arxiv.org/abs/2205.14135)
- [Dao 2023: FlashAttention-2](https://arxiv.org/abs/2307.08691)
- [Kwon et al. 2023: Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
