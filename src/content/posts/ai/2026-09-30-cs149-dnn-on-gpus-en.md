---
title: "CS149 L9: Running DNNs Efficiently on GPUs — Conv as GEMM, Blocking, Fusion, and the Road to FlashAttention"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, gpu, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 12
tldr: "L9 opens with a claim: if you understand arithmetic intensity and the roofline, you know almost everything about software-side performance optimization for modern AI. It then shows three things. Fully connected layers, conv layers, and attention all reduce to matrix multiplication (GEMM). GEMM needs blocking so data stays in cache. Adjacent layers should be fused so intermediates never round-trip through DRAM. Softmax can be computed in chunks, which is why fused attention (the core idea behind FlashAttention) never has to store the N×N matrix."
description: "A guide to Lecture 9 of Stanford CS149 (Fall 2025): roofline and loop fusion recap, a minimal intro to DNNs and conv layers, conv to explicit and implicit GEMM, blocked and vectorized matrix multiply, CUTLASS / Triton / ThunderKittens, fusing conv + scale/bias + pool, chunked softmax and fused attention, low precision, and why GPUs are a good (but not ideal) platform for DNNs."
draft: false
glossary:
  - term: "arithmetic intensity"
    aliases: ["operational intensity"]
    definition: "The amount of computation a program does per unit of data moved. Higher values push a program toward being compute bound; lower values toward being bandwidth bound."
    context: "CS149 L9 revisits it with the roofline curve and says it covers almost everything about software-side AI optimization."
  - term: "GEMM"
    aliases: ["general matrix multiply", "dense matrix-matrix multiplication"]
    definition: "Dense matrix-matrix multiplication. High-performance libraries optimize it more thoroughly than anything else, so many operations are rewritten as GEMM before calling a library."
    context: "Slide 32 of L9 lists it as the shared core kernel of fully connected layers, conv layers, and attention."
  - term: "implicit GEMM"
    definition: "Instead of expanding a convolution into a full matrix, build only a small block at a time in GPU shared memory and run a blocked GEMM on it. No extra DRAM storage or traffic."
    context: "Slides 42–43 of L9 contrast it with explicit GEMM, which writes the whole convolution matrix out first."
  - term: "kernel fusion"
    aliases: ["operator fusion", "layer fusion"]
    definition: "Merging several operations that would otherwise run separately and exchange intermediates through memory into a single kernel, raising arithmetic intensity."
    context: "L9 demonstrates it with conv + scale/bias + max pool, row-wise softmax, and attention."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-dnn-on-gpus)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is post 12 in the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers Lecture 9 from October 21, [Efficiently Evaluating DNNs on GPUs: Transformers and ConvNets](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dnninference/). The official [slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/dnninference/09_dnneval.pdf) has 75 slides.

Fall 2025 recordings live only on Stanford Canvas. The closest public video is [2023 Lecture 10: Efficiently Evaluating DNNs on GPUs](https://www.youtube.com/watch?v=qbKtU0X6-WU), and it is only a partial supplement. Compared with the [2023 slides for the same lecture](https://gfxcourses.stanford.edu/cs149/fall23/lecture/dnneval/) (68 slides), conv-to-GEMM, blocked matrix multiply, implicit GEMM, fusion, and fused attention are all there. The 2025 deck adds Triton and ThunderKittens, the row-wise softmax fusion example, and a ThunderKittens Flash-Attention. It also drops the 2023 section on saving compute through better network topologies (ResNet, MobileNet). This guide follows the 2025 slides. The course overall is A3 (enough to self-study); gaps are listed in the [series overview](/posts/ai/2026-09-30-cs149-course-overview-en).

The [previous post](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en) drew circles on a GPU. This one runs neural networks. The bridge: a conv layer is just a huge pile of dot products, and making dot products fast is still about the arithmetic intensity from [post 7](/posts/ai/2026-09-30-cs149-locality-communication-en).

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=qbKtU0X6-WU
title: 2023 Lecture 10 video: Efficiently Evaluating DNNs on GPUs
```

Original videos: [2023 Lecture 10 video: Efficiently Evaluating DNNs on GPUs](https://www.youtube.com/watch?v=qbKtU0X6-WU)

Course and recording entries:

- [CS149 2023 public video playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dnninference/)

## Opening: you already know most of this

Slides 3–10 are "things you already know — and should remember":

- **Pipelining overlaps data movement with computation** (slides 4–5). Two questions: is this program compute bound or bandwidth bound? How much on-chip storage does overlap cost? The hint is **double buffering**: the data being computed on and the data being transferred both need buffers.
- **The roofline curve** (slides 6–8): arithmetic intensity on the x-axis, throughput on the y-axis. The slope on the left is the bandwidth-bound regime; the flat line on the right is compute bound. Raise peak compute without improving memory and the knee moves right, so more programs land in the bandwidth-bound regime.
- **Loop fusion** (slide 9): computing `E = D + (A + B) * C` in three loops does two loads, one store, and one op per loop, for an overall arithmetic intensity of 1/3. Fused into one loop, it does four loads, one store, and three ops: 3/5.

Slide 10 has four takeaways. The last two matter most: **faster hardware makes a program more likely to be bandwidth bound; raising a program's arithmetic intensity makes it more likely to be compute bound.**

Slide 11 then says that if you know the previous slide, you know almost everything you need about the **software side** of modern AI performance. The rest waits for the next lecture and boils down to two points: data movement costs energy, and chip area spent on storage can't be spent on compute, so keep buffers small.

## A minimal DNN intro: it's just a circuit

Slides 12–23 are a crash course for people who haven't studied deep learning:

- A neuron has n inputs and n+1 parameters (weights plus bias). It takes a weighted sum and applies a nonlinearity such as ReLU, `max(0, x)` (slide 14). The slide offers two readings: computationally, "it is just a circuit"; in machine learning terms, a binary classifier.
- A fully connected layer is a matrix-vector product followed by element-wise ReLU (slide 16).
- A conv layer is **locally connected, and every unit in the layer shares the same weights** (slide 19). Slide 17 first asks you to guess what a short C program does. It's a 3×3 blur. The gradient-detection filters on slide 20 make the point that a filter is a pattern "detector," and each output pixel's magnitude is its "response" to the surrounding region.
- A layer usually applies many filters at once (slide 21 shows 96 filters of 11×11×3), followed by ReLU and pooling (max over each 2×2 region), which shrinks the data (slide 23).

## Making conv layers fast

### The direct version: seven nested loops

Slide 25's direct implementation is seven nested loops: each image in the batch, each output pixel (y, x), each filter, then accumulate over input channels and the filter's spatial extent (y, x). The slide stresses the **heavy data reuse**: filter weights are reused throughout the convolution, and input values are reused across filters. Reuse means room to raise arithmetic intensity.

### Rewriting as matrix multiply: explicit GEMM

Slides 26–29 show **explicit GEMM** (often called im2col). Put the 3×3 inputs each output pixel needs into one row of a matrix, so the image becomes a (W×H) × 9 matrix. Multiply by a 9 × num_filters weight matrix and you compute every filter at once. With multiple input channels, each row holds 9 × num_channels elements.

Why take the detour? Slide 32: **GEMM is the core kernel of fully connected layers, conv layers, and transformer attention** (slides 30–31 first note that attention is matrix multiplies too). Mature high-performance GEMM implementations already exist, so rewriting as GEMM lets you use them.

The cost is on slide 33. Off-the-shelf libraries need the input matrix materialized. For a conv layer that multiplies DRAM traffic by R×S (the filter's spatial size) and takes a lot of extra storage.

### Making GEMM itself fast: blocking

Slide 34 shows a triple-loop matrix multiply with `#pragma omp parallel for`. What's wrong with it? **Low arithmetic intensity**: it doesn't exploit temporal locality in accesses to A and B.

Slide 35's fix is **blocking**: compute one small block of C at a time, so the matching blocks of A and B stay in cache for the duration. The slide leaves a self-check: do you want BLOCKSIZE as big as possible? Why? (Hint: all three blocks must fit in cache together.)

Slide 36 extends blocking across the memory hierarchy: outer blocks sized for L2, inner blocks for L1, and a final level for registers (the slide notes it isn't shown). Slides 37–39 add SIMD and compare three vectorization schemes:

1. Vectorize the `i` loop. This also improves spatial locality in B, but the working set grows by SIMD_WIDTH and the code still walks B in large strides.
2. If the `i` dimension is small, first copy the block of B into a transposed temp buffer, then vectorize the innermost dot product.
3. Pre-transpose blocks of A and C and compute one SIMD_WIDTH × SIMD_WIDTH chunk at a time, so the innermost loop's iterations are independent.

Slide 40 uses MobileNet's per-layer sizes as a reminder: **layers in the same network have very different matrix shapes, and each benefits from a different schedule.** The slide's verdict: "Ug for library implementers!"

### Don't materialize the whole matrix: implicit GEMM

Slides 42–43 improve on this with **implicit GEMM**. Instead of writing the full convolution matrix to DRAM, build one sub-block at a time in GPU on-chip shared memory and hand it to a well-tuned shared-memory GEMM routine. That needs **no extra off-chip storage and no extra DRAM traffic**. The slide points to NVIDIA's [CUTLASS](https://github.com/NVIDIA/cutlass).

## Tools for writing blocked code

Slides 44–47 cover three tools, all meant to save you from hand-writing blocked kernels from scratch:

| Tool | What the slides say |
|---|---|
| [CUTLASS](https://github.com/NVIDIA/cutlass) | Building blocks for your own high-performance DNN layers, useful for unusual sizes cuDNN hasn't tuned; includes in-shared-memory GEMM, warp-level GEMM, iterators for block loading, tensor reductions |
| [Triton](https://triton-lang.org/) | Language support for loading and storing tensors: load "blocks" into GPU shared memory, then run data-parallel operations on them; slide 46's full matrix multiply uses two levels of blocking |
| [ThunderKittens](https://github.com/HazyResearch/ThunderKittens) | A CUDA library of tile-based primitives meant to make advanced developers ("CS149-level folks," per the slide) more productive writing blocked code; supports async tile load/store and advanced memory layouts |

Slides 51–54 add another route: vendor libraries. The slides mention AWS NKI (used in PA4, [post 15](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en)) and the choice of algorithms available for cuDNN convolution.

### Why "more work" runs faster

Slides 48–49 revisit the V100 (80 SMs, 6 MB L2, 900 GB/s HBM): a GPU needs "a lot of parallel work" to fill it. The slide compares two conv output sizes. N=1 with 64×64 outputs gives about 524K outputs (2 MB). N=32 with 256×256 outputs gives 256M (2²⁸) outputs (1 GB). Bigger batches and bigger images make the machine easier to saturate.

## Fusion: keep intermediates out of memory

### conv + scale/bias + max pool

Slide 56 describes a common chain: Conv → Scale/Bias → Max Pool. Imagine dumping 1 GB of conv output to memory, reading it back just to scale every value, then reading it again to pool. The bandwidth cost is enormous.

Better:

- Do the per-element scale + bias right after conv computes each element (slide 57 folds it into the last line of the conv loop).
- A max pool output is ready as soon as each 2×2 region of conv output is computed.

Slide 57 leaves a class exercise: how would you fuse the max pool too? Hint: how would you block the two loops over output pixels?

### Row-wise softmax

The second example (slides 58–59) is softmax over each row of a matrix. Following the definition directly takes several passes: find the max m(x), compute f(x) = e^(x−m(x)), sum to l(x), then divide. Each pass reads and writes the whole M×N matrix. The slide counts 5MN + 2M reads and 3MN + 2M writes for the naive version. The fused version, "load row → compute the entire softmax → store row," reads MN and writes MN, provided one row's working set fits in on-chip storage.

### Fused attention

Slides 60–64 are the high point. Attention takes three N×d matrices Q, K, V (N is sequence length, d the embedding size). Compute S = QKᵀ (N×N), take row-wise softmax to get P (N×N), then O = PV (N×d). Slide 61 flags the problem: N can reach thousands for long sequences, and **the naive version needs N² space**.

<details>
<summary>Slide 63: why softmax can be computed in chunks</summary>

Split a row x into two chunks x⁽¹⁾ and x⁽²⁾. The row max is m(x) = max(m(x⁽¹⁾), m(x⁽²⁾)). Compute f and l for each chunk using its own max, then correct with the factor e^(m(x⁽ⁱ⁾) − m(x)) when combining:

- f(x) = [ e^(m(x⁽¹⁾)−m(x)) · f(x⁽¹⁾), e^(m(x⁽²⁾)−m(x)) · f(x⁽²⁾) ]
- l(x) = e^(m(x⁽¹⁾)−m(x)) · l(x⁽¹⁾) + e^(m(x⁽²⁾)−m(x)) · l(x⁽²⁾)

So you can accumulate a correct softmax chunk by chunk without seeing the whole row first.

</details>

Slide 64's fused algorithm: for each block Qᵢ and each block of K and V, load Qᵢ, Kⱼᵀ, Vⱼ, Oᵢ; compute Sᵢⱼ = QᵢKⱼᵀ; compute m, f, l row-wise; multiply PᵢⱼVⱼ and accumulate into Oᵢ with the right scaling. The slide lists three effects:

- **Saves memory footprint**: the N² matrix is never materialized.
- **Saves bandwidth**: read three blocks, do two matrix multiplies and a few row sums, accumulate into an O block that stays in cache. High arithmetic intensity.
- **Cost**: a bit more computation than the original, because prior values of O must be rescaled at each step.

Slide 65 shows Flash-Attention written in ThunderKittens. That's as deep as this lecture goes. For the full derivation and later versions, see the site's [CMU 11-868 FlashAttention guide](/posts/ai/2026-09-30-cmu11868-flashattention-en). PA5 in [post 18](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en) has you write one on an H100.

### Fusion in frameworks

Slides 66–69 trace how frameworks handle fusion. Early on, library writers hardcoded a few fused ops (the slide uses TensorFlow). Later, the cuDNN backend had a compiler generate new implementations that fuse several operations into one node, with no intermediates passing through memory. Now there are many compiler-based efforts to schedule DNN operations automatically; the slide lists `torch.compile`.

## Other tricks and the wrap-up

Slide 70: **low precision**. 16-bit and 8-bit weights and activations are common, 4-bit is arriving, and the extreme case is 1-bit.

Slide 71 groups optimization techniques into three kinds:

1. **Better algorithms**: hand-design more efficient models (depth, filter width and count, stride), often with automatic search for efficient topologies.
2. **Software optimization**: schedule the performance-critical operations well, with blocking and fusion. Usually done by hand, with significant research into automating it.
3. **Approximation**: compress models, for example with lower bit precision.

Slides 72–74 close with two questions. Why might a GPU be a good platform for DNNs? High-intensity matrix computations benefit from the GPU's abundant FLOPS, and highly optimized kernel libraries like cuDNN exist. Why might a GPU be **sub-optimal**? The hint: is a general-purpose processor really needed? Slide 75 previews the next lecture, specialized hardware for DNN inference and training, showing the TPU, Apple Neural Engine, Cerebras, SambaNova, an Ampere GPU with Tensor Cores, and others.

## Three habits to take away

1. **When you see a DNN layer, ask whether it can become a GEMM.** If it can, you inherit the most mature optimization stack there is.
2. **When you see two adjacent operations, ask whether the intermediate really needs to go back to DRAM.** If not, fuse them.
3. **When an operation seems to need a whole row before it can start, ask whether it can accumulate chunk by chunk, like softmax.** That's where FlashAttention comes from.

**Something to try tonight**: using slide 9's method, count the reads, writes, and ops for a layer sequence you use often (say `linear → bias → GELU`), unfused and fused, and compare the arithmetic intensity.

Further reading: to see how Triton kernels are actually written, read the site's [CS336 Kernels and Triton guide](/posts/ai/2026-08-22-cs336-kernels-triton-en). For the same ideas in an LLM systems course, read [CMU 11-868 GPU Programming and Acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en).

Series navigation: previous [PA3 + Written 2: CUDA circle renderer](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en) | next [L10 Hardware specialization and DNN accelerator design](/posts/ai/2026-09-30-cs149-hardware-specialization-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 course home](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 9 page (slide-by-slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dnninference/)
- [Lecture 9 slide PDF: Efficiently Evaluating DNNs](https://gfxcourses.stanford.edu/cs149/fall25content/media/dnninference/09_dnneval.pdf)
- [2023 Lecture 10 video: Efficiently Evaluating DNNs on GPUs](https://www.youtube.com/watch?v=qbKtU0X6-WU)
- [2023 Lecture 10 page (for comparison)](https://gfxcourses.stanford.edu/cs149/fall23/lecture/dnneval/)
- [CS149 2023 public video playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [NVIDIA CUTLASS](https://github.com/NVIDIA/cutlass)
- [Triton documentation](https://triton-lang.org/)
- [ThunderKittens (HazyResearch)](https://github.com/HazyResearch/ThunderKittens)
