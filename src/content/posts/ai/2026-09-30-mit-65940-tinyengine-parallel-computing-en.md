---
title: "MIT 6.5940 L11 TinyEngine and Parallel Computing: From Loop Tiling to In-Place Depthwise"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, parallelism, performance, cuda]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 13
tldr: "Once algorithms have shrunk the model, how much more can the system layer squeeze out? Lecture 11 uses a single matrix multiply to show it: loop reordering gives 12x, tiling 19x (on an Intel Xeon 4114), and a CUDA version runs 94x faster end to end on a 2080Ti. The second half covers TinyEngine's inference tricks: im2col; in-place depthwise, which cuts peak memory from 2×C×H×W to (1+C)×H×W; NHWC for pointwise and NCHW for depthwise; and Winograd, with 2.25x fewer multiplications."
description: "A guide to Lecture 11 of MIT 6.5940 Fall 2024, TinyEngine and Parallel Processing: the resource gap between an MCU and a laptop, the memory hierarchy, loop reordering/tiling/unrolling, SIMD (SSE, NEON), multithreading (Pthreads, OpenMP), CUDA and Tensor Cores, then im2col, in-place depthwise convolution, NHWC vs NCHW layout choice, and Winograd convolution, with the link to Labs 4 and 5 on LLM deployment."
draft: false
glossary:
  - term: "loop tiling"
    aliases: ["blocking"]
    definition: "Splitting a loop's iteration space into fixed-size blocks so the data reused within a block fits in cache, then moving to the next block, to reduce cache misses. Lecture 11 demonstrates it on matrix multiplication; the tile size follows the cache size, and tiling can be applied at multiple levels for L1 and L2."
    context: "MIT 6.5940 Lecture 11 slides, pages 14–20."
  - term: "im2col"
    aliases: ["image to column"]
    definition: "Rearranging a convolution's input into a matrix so the convolution can call a general matrix multiply (GEMM). It lets you reuse highly optimized GEMM kernels at the cost of extra memory; implicit GEMM avoids that extra space."
    context: "MIT 6.5940 Lecture 11 slides, pages 55–57."
  - term: "in-place depthwise convolution"
    definition: "TinyEngine's approach: compute a depthwise convolution one channel at a time with a single channel-sized temporary buffer, writing each result back over the input. Peak memory drops from 2×C×H×W to (1+C)×H×W."
    context: "MIT 6.5940 Lecture 11 slides, pages 59–64."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)

> **Version note**: This post is based on Lecture 11 (2024-10-10) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec11-TinyEngine.pdf](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&st=ehihqr5t&dl=0) (79 pages) and the [lecture recording](https://youtu.be/wl1UEnIOVek). Page numbers refer to PDF pages. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides, video, and the example code repos the slides cite are all public. What you can't get is Canvas submission and grading feedback.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) puts the same lecture on October 20. As of 2026-09-30 its slide and video links are still empty.

**Series**: previous [L10 MCUNet and tinyML](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) | next [L12 Transformer and LLM (bridge)](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

[Lecture 10](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) described MCUNet as a co-design of TinyNAS and TinyEngine, but only covered TinyNAS. Lecture 11 fills in the other half. Once the model is fixed, how does the system layer make it run fast and use less memory?

This lecture has more code than the earlier ones, but the structure is simple. The first half takes **one matrix multiply** and applies loop optimizations, SIMD, multithreading, and CUDA in turn, reporting a speedup at each step. The second half switches to convolution and covers four inference tricks TinyEngine uses. The Lecture Plan on page 2 has exactly these three parts: edge AI and MCU characteristics, parallel computing techniques, and inference optimizations.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=wl1UEnIOVek
title: EfficientML.ai Lecture 11 - TinyEngine (YouTube)
```

Original videos: [EfficientML.ai Lecture 11 - TinyEngine (YouTube)](https://www.youtube.com/watch?v=wl1UEnIOVek)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## Where an MCU is small

Page 5 lines up four platforms in a table. The two ends make the point:

| | NVIDIA H100 | STM32F746NG |
|---|---|---|
| Memory | 80GB | 320kB |
| Storage | ~TB/PB | 1MB |
| Compute | 1,979 TOPS | 462 MOPS |

Page 6 compares the STM32F746 with an Apple M1 Ultra MacBook Pro. The clock is 216MHz vs 3200MHz. The MCU has only an 8KB L1 cache, with no L2, no L3, and no operating system. Memory differs by 210,000x and storage by 8,400,000x.

Page 7 shows the memory hierarchy: lower levels are larger, slower, and cheaper. Citing "Latency Numbers Every Programmer Should Know," the slide lists about 0.5ns for L1, about 100ns for DRAM, and about 1ms for storage. Every loop optimization that follows aims to keep data in the upper levels.

## Parallel computing techniques: six versions of one matmul

Page 9 lists four families: loop optimization (reordering, tiling, unrolling), SIMD, multithreading, and CUDA. Example code lives in [mit-han-lab/parallel-computing-tutorial](https://github.com/mit-han-lab/parallel-computing-tutorial). Apart from CUDA, all speedups were measured on an Intel Xeon 4114.

### Loop reordering: 12x

Pages 10–12. In the triple loop `i, j, k`, as the innermost `k` changes, `B[k][j]` jumps down a column. Matrices are stored row-major, so those jumps keep missing the cache.

```python
# Before: i, j, k — B[k][j] is read down a column, poor locality
for i in range(N):
    for j in range(N):
        for k in range(N):
            C[i][j] += A[i][k] * B[k][j]

# After: i, k, j — the innermost j reads B[k][j] along a row
for i in range(N):
    for k in range(N):
        for j in range(N):
            C[i][j] += A[i][k] * B[k][j]
```

Just changing the loop order gives a 12x speedup, per page 12.

### Loop tiling: 19x

Pages 14–20 handle the next problem. When B is much larger than the cache, data gets evicted before it's reused. The fix is to split the iteration space into `TILE_SIZE` blocks so each block's data fits in cache. After tiling `j`, `k`, and `i` in turn, each access to A, B, and C touches TILE_SIZE² elements instead of N². Page 19 goes one level further with multilevel tiling for L1 and L2. Page 20's C implementation with `BLK_SIZE 32` is 19x faster.

### Loop unrolling: 2.85x

Pages 22–24. Loops have overhead: pointer arithmetic, the end-of-loop test on every iteration, and branch prediction. Copy the loop body 4 times and step by 4 instead of 1. Pointer arithmetic and loop tests drop to a quarter, but the innermost code gets 4x larger. The slide calls this a trade-off between binary size and overhead, and on an MCU with 1MB of Flash that trade-off is real. Page 24 unrolls `j` by 8 and `k` by 4 for a 2.85x speedup.

### SIMD: one instruction, four numbers

Pages 26–27 cover instruction set background first. CISC (x86) has many specialized instructions. RISC (Arm, RISC-V) implements only the common ones. For `C = A + B`, CISC might need one instruction, while RISC might need four: load, load, add, store.

Pages 28–30 use 128-bit vector registers to process four 32-bit floats at once, cutting arithmetic instructions from N³ to N³/4. The slides show two intrinsic families side by side: x86 SSE (`_mm_load_ps`, `_mm_mul_ps`, `_mm_add_ps`) and Arm NEON (`vld1q_f32`, `vmulq_f32`, `vaddq_f32`). They also decode the names: `ps` means packed single-precision, and `q` means quadword. Page 30's implementation transposes B first so both operands are read contiguously. That page reports no speedup figure.

### Multithreading: 4.1x

Pages 32–37. Threads in one process share memory but each has its own stack and program counter, so they can run on different cores. Page 35 uses Pthreads to split the matrix rows evenly across 4 threads, for a 4.1x speedup. Pages 36–37 switch to OpenMP, where one `#pragma omp parallel for` line before the loop is enough; the slide notes this is much cleaner than Pthreads.

### CUDA and Tensor Cores: 94x

The CUDA introduction on pages 39–44 borrows from [Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en). Threads form blocks and blocks form a grid. Each thread uses `blockIdx` and `threadIdx` to find the element it owns. Host and device have separate address spaces, and `cudaMemcpy` moves data between them. Kernels see three kinds of memory (per-thread private, per-block shared, and global), each with different locality and access cost. Page 44's implementation loads tiles of A and B into shared memory first. On a 2080Ti it runs **94x faster end to end** than the naive CPU version.

Pages 45–52 go one level lower to Tensor Cores. A CUDA core does 1 FP32 or 2 FP16 MACs per cycle. A Tensor Core finishes a whole small matrix multiply per cycle (4×4×4 on Turing, 8×4×8 on Ampere). Page 46 measures on an A6000 that Tensor Cores are 3.8x faster than CUDA cores once N is large. Pages 47–52 show how to build a 16×16×32 multiply from 16×8×16 MMA intrinsics.

## Inference optimizations: TinyEngine's four tricks

Page 54 lists the second half's four techniques together. The first two are about memory, the last two about speed.

### Im2col: turn convolution into matrix multiply

Pages 55–57. Rearrange the input activation into a matrix and the convolution can call a general matrix multiply (GEMM) directly. The upside is that every matmul optimization from the first half applies. The downside is extra memory. The slides mention implicit GEMM as the fix: a variant of direct convolution that works directly on the original weight and activation tensors.

### In-place depthwise: peak from 2×C×H×W to (1+C)×H×W

Page 59 gives the motivation. MobileNetV2's inverted residual block uses depthwise convolution to save model size and FLOPs. But its middle layer expands channels 6x, so peak memory grows 3–6x. That's why Lecture 10 said MobileNetV2 "shrinks parameters but not activations."

Pages 60–64 give the fix. A normal depthwise convolution holds input and output at once, for a peak of 2×C×H×W. Depthwise channels are independent, so you can compute one channel at a time with a single channel-sized (H×W) temporary buffer, then write the result back where the input was. The peak becomes (1+C)×H×W.

### NHWC for pointwise, NCHW for depthwise

Pages 66–69 look at memory layout. A pointwise (1×1) convolution takes a weighted sum across channels at each pixel. NHWC, with channels innermost, makes that read contiguous, so TinyEngine uses NHWC for pointwise. A depthwise convolution slides spatially within each channel. The in-place scheme above already walks channel by channel, so NCHW is more contiguous there.

Within one network the two kinds of convolution alternate, and the layout follows the operation. General-purpose frameworks often leave this on the table; a specialized inference engine can pick it up.

### Winograd: 2.25x fewer multiplications

Pages 71–76. Computing 4 outputs (2×2) of a 3×3 convolution directly takes 9×C×4 MACs. Winograd transforms the input tile and the filter into another space, multiplies element-wise, and transforms back. That takes only 16×C MACs, 2.25x fewer. The filter transform can be precomputed offline; input and output transforms happen at inference time. The full formula Y = Aᵀ[(GgGᵀ) ⊙ (BᵀdB)] comes from [Lavin & Gray 2015](https://arxiv.org/abs/1509.09308).

<details>
<summary>Why 16 and not 36?</summary>

A 2×2 output with a 3×3 filter needs a 4×4 input tile. After the transform you multiply element-wise in that 4×4 space: 16 multiplications per input channel, then sum across channels. Direct convolution takes 9 multiplications per output, or 36 for 4 outputs. 36 / 16 = 2.25.
</details>

## The link to Labs 4 and 5

Page 77 recommends two repos, [TinyEngine](https://github.com/mit-han-lab/tinyengine) and [TinyChatEngine](https://github.com/mit-han-lab/TinyChatEngine). Page 78 previews Labs 4 and 5. You quantize an LLM to 4-bit with AWQ and deploy it as a local chatbot. You implement loop unrolling/reordering, SIMD, and multithreading yourself, then measure the latency gain from each. The slide calls the engine "TinyLLMEngine"; the F24 Lab 5 handout and starter repo call it TinyChatEngine. Details are in the [Lab 4 + Lab 5 guide](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en).

In other words, the CPU techniques from this lecture come back unchanged to speed up LLaMA2-7B's linear kernels.

## What to do after this lecture

- **Tonight**: clone [parallel-computing-tutorial](https://github.com/mit-han-lab/parallel-computing-tutorial) and run the naive and reordering versions on your own machine. Compare your speedup with the slide's 12x. The gap itself tells you about cache size and memory bandwidth.
- For a fuller treatment of the GPU side: [CS149 L2: Multicore, SIMD, Hardware Multithreading](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en) and [CS149 Lecture 7: GPU Architecture and CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en).
- From convolution-as-matmul and tiling all the way to FlashAttention: [CS149 L9: Running DNNs Efficiently on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en).

## Further reading

- Locality and arithmetic intensity: [CS149 L6 Locality and Communication](/posts/ai/2026-09-30-cs149-locality-communication-en)
- GPUs and Triton kernels: [CS336 Lecture 5: GPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en), [CS336 Lecture 6: Triton kernels](/posts/ai/2026-08-22-cs336-kernels-triton-en)
- CUDA in an assignment: [CMU 11-868 HW1: CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940): L11 date, slide and video links
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940): L11 scheduled for October 20, materials not yet released
- [Lec11-TinyEngine.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&st=ehihqr5t&dl=0): source of every page number, speedup, and formula in this post
- [EfficientML.ai Lecture 11 - TinyEngine (YouTube)](https://youtu.be/wl1UEnIOVek)
- [mit-han-lab/parallel-computing-tutorial (GitHub)](https://github.com/mit-han-lab/parallel-computing-tutorial): the loop optimization, SIMD, multithreading, and CUDA examples the slides cite
- [mit-han-lab/tinyengine (GitHub)](https://github.com/mit-han-lab/tinyengine)
- [mit-han-lab/TinyChatEngine (GitHub)](https://github.com/mit-han-lab/TinyChatEngine)
- [Lavin & Gray, Fast Algorithms for Convolutional Neural Networks (2015)](https://arxiv.org/abs/1509.09308): Winograd convolution
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices (NeurIPS 2020)](https://arxiv.org/abs/2007.10319): where TinyEngine was introduced
- [Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832): the source page 7 cites for memory hierarchy latencies
