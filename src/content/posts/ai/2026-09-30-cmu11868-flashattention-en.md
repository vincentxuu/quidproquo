---
title: "CMU 11-868 L21 FlashAttention: Attention Is Slow Because of Data Movement, Not Math — Tri Dao from FA1 to FA4"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, flashattention, attention, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 16
tldr: "Standard attention writes the N×N score matrix out to HBM and reads it back, and most of its time goes to that traffic. FlashAttention uses tiling plus softmax rescaling so each block finishes inside SRAM, and the backward pass recomputes instead of storing. Tri Dao's guest slides for 11-868 give one set of numbers: the backward pass does 13% more FLOPs, 9x less HBM traffic, and runs 6x faster. FA3 and FA4 follow the same theme: when the hardware changes, the bottleneck moves, and the algorithm has to move with it."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L21, 'Optimizing Attention for Modern Hardware', by Tri Dao: the IO-aware view, tiling and the online softmax derivation, recomputation in the backward pass, asynchrony and FP8 in FlashAttention-3 on Hopper, FlashAttention-4's response to asymmetric scaling on Blackwell, and Flash-Decoding plus GQA packing for inference."
draft: false
glossary:
  - term: "IO-aware"
    aliases: ["IO-awareness"]
    definition: "Designing an algorithm around the number of reads and writes between memory levels as the main cost, not just FLOPs."
    context: "The FlashAttention paper argues this is the principle earlier efficient-attention work was missing."
    links:
      - label: "FlashAttention (arXiv 2205.14135)"
        url: "https://arxiv.org/abs/2205.14135"
  - term: "online softmax"
    aliases: ["softmax rescaling"]
    definition: "Computing softmax block by block while keeping only the running max and running sum of exponentials; each new block rescales the earlier partial result, and the final answer matches computing it all at once."
    context: "The trick that lets FlashAttention compute in blocks without changing the result."
  - term: "HBM"
    aliases: ["high bandwidth memory"]
    definition: "The off-chip main memory of a GPU or TPU: large, but with far less bandwidth than on-chip SRAM."
    context: "FlashAttention exists to cut reads and writes to HBM."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-flashattention)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

**This guide follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is post 16 in the [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) series and follows [L19–L20 Model Quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en).

The 4/1 lecture was a guest lecture by [Tri Dao](https://tridao.me), the author of FlashAttention. The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) titles it "Optimizing Attention for Modern Hardware." The official material is a 61-page [slide deck](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-21-FlashAttention_tridao2026.4-50476379a6127697ae7fbf974ad28348.pdf), and the readings are four papers: [FlashAttention](https://arxiv.org/abs/2205.14135), [FlashAttention-2](https://arxiv.org/abs/2307.08691), [FlashAttention-3](https://arxiv.org/abs/2407.08608), and [FlashAttention-4](https://arxiv.org/abs/2603.05451). Access level is **A3**, but the official syllabus lists no public recording links, so whatever the guest said out loud is not available. Everything below comes from the slides and papers. Page numbers refer to the PDF.

This is one of the harder posts in the series. It starts with the scenario and intuition, and the derivation sits in a collapsible block. If GPU memory hierarchies are new to you, read [L02–L04 GPU programming](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en) and [L10 LightSeq](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en) first.

The whole post answers one question: **why is attention bottlenecked by IO rather than FLOPs?**

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The scenario: longer sequences slow training down

Pages 2–3 give the motivation. Understanding a whole book or codebase needs long context. Higher image resolution helps vision. Audio and video are naturally very long sequences. But as context grows, training slows down or stops fitting.

Page 5 writes attention in three steps: S = QKᵀ, A = softmax(S), O = AV. Q, K, and V are N × d. S and A in the middle are N × N. The slide gives typical values of N from 1K to 8K and head dimension d from 64 to 128. So the N × N intermediates are much larger than the inputs, and they grow with the square of sequence length.

Page 6 shows the mainstream answer at the time: approximate attention, trading quality for speed by cutting FLOPs. Tri Dao's question was whether there is an attention algorithm that is fast, memory-efficient, and **exact**.

## The intuition: the biggest cost is moving bits

Page 7 answers in one line: **The biggest cost is in moving the bits!** The standard implementation repeatedly reads and writes slow GPU memory.

Page 8 sketches how a GPU works. Inputs start in HBM (GPU main memory), move to compute units and SRAM, and the output goes back to HBM. HBM is big and slow. SRAM is small and fast. In standard attention each step is its own kernel: compute S and write it to HBM; the next kernel reads S, computes softmax, and writes A; the next reads A and multiplies by V. The N × N matrix makes several round trips.

So the issue is not how much you compute but **how much you move**. That is what IO-aware means: treat reads and writes between memory levels as the main cost.

## The mechanism: tiling plus recomputation

Page 9 lists two challenges and the matching fixes:

| Challenge | Fix |
|---|---|
| Softmax normalizes over a full row, but a block cannot see the full row | **Tiling**: load block by block from HBM into SRAM, with softmax rescaling |
| The backward pass needs the N × N attention matrix from forward | **Recomputation**: do not store it; recompute it in SRAM during backward |

### Tiling: fix the wrong denominator afterward

Pages 10–12 build it step by step. Splitting Q is easy, since query blocks are independent. K and V are the hard part: the softmax denominator sums exp(S) across the whole row, so after the first K block you do not yet know the second.

Page 12's answer: compute a partial output using the first block's local denominator, knowing it is wrong. When the second block arrives, multiply the old output by "old denominator / new denominator" to correct it, then add the second block's contribution. Every step happens in SRAM with no write to HBM, and the final answer is exact.

<details>
<summary>Rescaling with two K/V blocks (slide page 12)</summary>

Split K and V into two blocks each, with S⁽ⁱ⁾ = Q(K⁽ⁱ⁾)ᵀ and A⁽ⁱ⁾ = exp(S⁽ⁱ⁾).

The output we want is

O = (A⁽¹⁾V⁽¹⁾ + A⁽²⁾V⁽²⁾) / l, where l = Σ exp(S⁽¹⁾) + Σ exp(S⁽²⁾) (summed per row).

1. First block only: l⁽¹⁾ = Σ exp(S⁽¹⁾), O⁽¹⁾ = A⁽¹⁾V⁽¹⁾ / l⁽¹⁾. The denominator is missing block two.
2. Second block: l⁽²⁾ = l⁽¹⁾ + Σ exp(S⁽²⁾), then

   O⁽²⁾ = (l⁽¹⁾ / l⁽²⁾) · O⁽¹⁾ + A⁽²⁾V⁽²⁾ / l⁽²⁾

   The first term swaps the old output's denominator from l⁽¹⁾ to l⁽²⁾. Expanding it gives exactly O.

In practice the kernel also tracks a per-row running max and subtracts it before exponentiating to avoid overflow. When the max changes, the old result is rescaled by a factor in the same way (Algorithm 1 in the FlashAttention paper).

</details>

### Recomputation: compute a little more, move a lot less

Page 14 covers backward. The forward pass stores only the per-row softmax normalization constants (length N). Backward recomputes attention in SRAM from Q, K, and V. The slide includes a comparison:

| | Standard attention | FlashAttention |
|---|---|---|
| GFLOPs | 66.6 | 75.2 (13% more) |
| HBM reads/writes (GB) | 40.3 | 4.4 (9x less) |
| Runtime (ms) | 41.7 | 7.3 (6x faster) |

FLOPs go up and time goes way down. This table is the answer to the focus question: attention's time is dominated by HBM traffic.

Page 15 sums up: 2–4x speedup, 10–20x memory reduction (memory linear in sequence length), and **no approximation**.

## New hardware moves the bottleneck

The second half of the deck (pages 16–56) asks how attention should be redesigned for new hardware. The thread running through it: each GPU generation speeds up some unit, and the bottleneck moves to whichever unit did not speed up.

### FlashAttention-2: close to matmul on A100

Page 17 covers it in one line: FA2 reaches about 70% utilization on A100 but only 35–40% on H100. FA2's own changes are in the paper's abstract: fewer non-matmul FLOPs, parallelizing even a single head across thread blocks along the sequence, and redistributing work between warps inside a thread block to cut shared-memory communication. The result is about 2x over FA1.

### FlashAttention-3: asynchrony and FP8 on Hopper

Page 18 lists FA3's three directions, which the slides say give 1.6–3x on Hopper:

1. **New instructions**: WGMMA (a higher-throughput, asynchronous matrix-multiply instruction) and TMA (faster global-to-shared memory copies that also save registers). Both are asynchronous: a thread issues them and can do other work while they run (page 19).
2. **Asynchronous overlap**: run softmax and matmul at the same time.
3. **Low precision: FP8.**

Page 20 shows with numbers why overlap matters. With head dimension 128 and a 128 × 128 block, the FP16 WGMMA takes 2048 cycles, and the exponentials in softmax (MUFU.EX2, run on special function units) take 1024 cycles, half as long. **Exponential throughput is far below Tensor Core throughput.** If the two take turns, the Tensor Cores sit idle a third of the time. The slide adds that with FP8, or on Blackwell, both take 1024 cycles.

The next pages stack up optimizations, each with a TFLOPS figure:

| Page | Technique | Effect |
|---|---|---|
| 21 | Pingpong scheduling: two warpgroups alternate via barriers, one on softmax while the other does matmul | 580 → 640 TFLOPS |
| 22 | Within one warpgroup, overlap iteration k's GEMM with iteration k+1's softmax | 640 → 670 TFLOPS |
| 26 | Persistent kernels: CTA count fixed to the number of SMs, hiding prologue/epilogue | 670 → 700 TFLOPS |
| 27–46 | Load balancing for causal attention: longest-processing-time-first (LPT) | 670 → 730 TFLOPS (causal) |

The LPT section uses a small example with 2 batches and 3 SMs. In order, the three SMs get [9, 5, 6] blocks of work, and the longest tile is always scheduled last. Scheduling the longest first gives [7, 7, 6].

FP8's problem is that outliers inflate quantization error. Page 24's fix is incoherent processing: multiply Q and K by the same random orthogonal (Hadamard) matrix. Because (QJ)(KJ)ᵀ = QKᵀ, the result is unchanged, but outliers get spread out. The slide reports 2.6x lower quantization error on data with simulated outliers. It is the same problem LLM.int8() faced in the [previous post](/posts/ai/2026-09-30-cmu11868-model-quantization-en), solved differently.

Benchmarks on pages 47–49: the BF16 page is titled "1.8–2.2x speedup" (the baseline appears only in the chart, not in the slide text), peaking at 840 TFLOPS, and causal attention reaches 730–750 TFLOPS, which the slide says is close to matmul speed. FP8 peaks at 1.3 PFLOPS. These are the 2026 slide figures, higher than the 740 TFLOPS in the 2024 FA3 abstract.

### FlashAttention-4: asymmetric scaling on Blackwell

Page 50 names the Blackwell pattern: matrix-multiply units got faster, but exponential units and shared memory did not. The result: **forward is bottlenecked by exponentials, backward by shared-memory traffic.** The slide notes that the FA4 paper appears at MLSys 2026.

The fixes (pages 51–52):

- Forward: a pingpong pipeline across query tiles; emulating the exponential in software with polynomials (Chebyshev) to offload the exponential units; and a new online softmax variant that skips 90% of rescaling.
- Backward: new 2-CTA MMA instructions, letting two CTAs cooperate to cut shared-memory bandwidth.

Results on pages 53–55: forward reaches about 1600 TFLOPS, and the slide says newer cuDNN versions now include many FA4 optimizations. Backward is 4x faster than an FA2 baseline without Blackwell optimizations. FA4 is written in the Python-embedded CuTe-DSL. Applying its abstractions (block sparsity, masking) to FlexAttention made it 2.7–3.0x faster across the board.

## Attention at inference time

Pages 57–60 turn to decoding. During decode the query is a few tokens, but the context can be 128k long.

- **Flash-Decoding** (since FA2) splits along the KV sequence length so the GPU has enough work.
- **GQA packing**: the WGMMA tile is 64 wide in the M dimension, and most of it is wasted when the query is short. In MQA/GQA several query heads share one set of KV, so they can be packed to fill the tile. FA2 handled only a single query token. FA3 extends it to arbitrary query lengths.

## What to take away

The summary on page 61 frames FlashAttention as fast, exact attention optimized for modern hardware, with asynchrony and low precision as the key algorithmic ideas. In the context of this course, the method is what is worth keeping:

1. Ask which memory level the time goes to before counting FLOPs.
2. When it helps, compute a bit more (recomputation) to move a lot less.
3. Find the bottleneck again on every hardware generation: HBM on A100, the gap between exponential units and Tensor Cores on Hopper, exponential units and shared memory on Blackwell.

**Something you can do tonight**: open the [flash-attention repo](https://github.com/Dao-AILab/flash-attention), go to `flash_attn/cute/flash_fwd_sm100.py` (cited on page 56), and find the online softmax rescaling.

The next post takes the same problem to TPUs: [L12–L13 TPU, JAX, and Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en). Splash Attention is FlashAttention's tiling idea implemented on TPU.

## Further reading

- Stanford CS336's [GPU post](/posts/ai/2026-08-22-cs336-gpu-tpu-en) and [Triton kernels post](/posts/ai/2026-08-22-cs336-kernels-triton-en) also use FlashAttention as the IO-aware example.
- [CME295 LLM systems](/posts/ai/2026-09-29-cme295-llm-systems-en) covers FlashAttention and the KV cache from the serving side.

## Series navigation

- Previous: [L19–L20 Model Quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en)
- Next: [L12–L13 TPU, JAX, and Pallas/Splash Attention](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en)
- Series overview: [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L21 Optimizing Attention for Modern Hardware slides (Tri Dao, 2026-04-01)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-21-FlashAttention_tridao2026.4-50476379a6127697ae7fbf974ad28348.pdf)
- [Dao et al., FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135)
- [Dao, FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning (arXiv 2307.08691)](https://arxiv.org/abs/2307.08691)
- [Shah et al., FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision (arXiv 2407.08608)](https://arxiv.org/abs/2407.08608)
- [Zadouri et al., FlashAttention-4: Algorithm and Kernel Pipelining Co-Design for Asymmetric Hardware Scaling (arXiv 2603.05451)](https://arxiv.org/abs/2603.05451)
- [Dao-AILab/flash-attention (GitHub)](https://github.com/Dao-AILab/flash-attention)
- [NVIDIA CUTLASS example 77_blackwell_fmha](https://github.com/NVIDIA/cutlass/tree/main/examples/77_blackwell_fmha)
