---
title: "CMU 11-868 L10: Accelerating Transformers on GPUs, and Where LightSeq Finds the Time"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, llm, gpu, cuda, transformer]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 9
tldr: "Lecture 10 of 11-868 uses Lei Li's own LightSeq and LightSeq2 as the case study and breaks them into four techniques: fuse every small operation outside matrix multiplication into one kernel, rewrite the LayerNorm and Softmax formulas to cut thread synchronizations, store parameters and gradients in FP16 but compute updates in FP32, and reuse memory based on backward-pass dependencies. The slides report 1.4-3.5x training speedups on WMT14 English-German. There is no recording; this guide works from slide page numbers and the two papers."
description: "A guide to Lecture 10 of CMU 11-868 LLM Systems (Spring 2026): why kernel launches are expensive, LightSeq2's kernel fusion, the LayerNorm and Softmax reduction rewrites, mixed-precision updates and memory reuse, and Hierarchical Auto Regressive Search on the inference side. With slide page numbers, paper figures, and a reading plan."
draft: false
glossary:
  - term: "kernel fusion"
    aliases: ["fused kernel", "fused kernels"]
    definition: "Writing operations that would normally run as several GPU kernels in sequence as a single kernel, which saves repeated kernel launches and the round trips of intermediate results through GPU memory."
    context: "Slide 10 of L10 uses adding three matrices as the example: two kernels need 4 loads and 2 stores; one fused kernel needs 3 loads and 1 store."
  - term: "LightSeq"
    aliases: ["LightSeq2"]
    definition: "A GPU acceleration library for Transformers from ByteDance AI Lab. LightSeq (NAACL 2021) targets inference; LightSeq2 (SC22) extends the acceleration to training."
    context: "11-868 instructor Lei Li co-authored both papers, and Lecture 10 is built entirely around them."
    links:
      - label: "bytedance/lightseq (GitHub)"
        url: "https://github.com/bytedance/lightseq"
  - term: "thread synchronization"
    aliases: ["__syncthreads"]
    definition: "A barrier where every thread in a CUDA block must finish a step before any of them moves on. Reductions such as sums or maxima usually need one."
    context: "L10's second technique rewrites formulas so LayerNorm and Softmax need one fewer synchronization."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq)

> **Version note**: This post is based on the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). Every fact was checked on 2026-09-30 against the [course syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), the [L10 slide PDF](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) (66 pages), and the two readings. Access grade **A3**: slides, assignments, and starter code are all public, but **the course has no public recordings**, so everything below comes from the slides and papers, with page numbers.

**Series**: Previous: [HW3: A Decoder-Only Transformer in MiniTorch](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) | Next: [HW4: Fused CUDA Kernels for Softmax and LayerNorm](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

## What this lecture answers

By the end of HW3 you have a trainable Transformer built on your own MiniTorch framework. It runs, but slowly. Lecture 10 asks: **while the model still fits on one GPU, how much faster can single-GPU training and inference get, and where does the speed come from?**

The syllabus schedules the topic over two sessions, February 16 and 18 (Part 1 and Part 2), but both use the same slide deck, which is why PDF number 11 is missing. Each session has one reading: [LightSeq](https://arxiv.org/abs/2010.13887) (inference) and [LightSeq2](https://arxiv.org/abs/2110.05722) (training). Both come from ByteDance AI Lab, and instructor Lei Li is a co-author on each, so this lecture is the authors taking apart their own system.

Slide 6 sets the scope: this lecture only covers models smaller than GPU memory, built on the [LightSeq library](https://github.com/bytedance/lightseq). Models too big for one GPU belong to the next lecture on [distributed training](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en).

## Intuition: GPUs aren't slow at math, they're slow at starting work and moving data

Start with a number that surprises people. Slide 9 says **a kernel launch costs about 3-5 microseconds, roughly 4,000 clock cycles**. A Transformer layer has a few big matrix multiplications and a pile of small operations: bias add, dropout, residual, LayerNorm, softmax. PyTorch launches a separate kernel for each small operation by default, and each kernel reads its inputs from GPU memory and writes results back.

Slide 10 shows the cost with the simplest possible example:

- `E = A + B + D` in two steps (`C = A + B`, then `E = C + D`): two kernels, **4 loads and 2 stores**
- One custom "add three matrices" kernel: one kernel, **3 loads and 1 store**

The intermediate `C` never needs to touch memory. That is the core of the first technique: leave matrix multiplication to cuBLAS and **fuse everything else you can**.

## Mechanism: LightSeq2's four techniques

Slide 8 groups the LightSeq/LightSeq2 optimizations into three categories: computational graph rewriting, rewriting dependent reductions, and memory management. The lecture then walks through four numbered techniques.

### Technique 1: kernel fusion, leaving only GEMMs to cuBLAS

Slide 12 shows a full Transformer layer after re-partitioning. The GEMMs (Q/K/V projections, the two FFN linear layers, the output projection) go to cuBLAS. The operations in between, such as "bias + dropout + residual", "bias + ReLU + dropout", and "bias + reshape Q, K, V", each become one custom elementwise kernel. LayerNorm, softmax, and cross entropy become custom reduce kernels.

The slides pick a few concrete cases:

| Operation | Before fusion | After fusion | Slide |
|---|---|---|---|
| Embedding forward `y = Dropout(s·E_w + P_p)` | 5 kernel launches | 1 | p.13 |
| Embedding backward | 3 | 1 (gradients of the same word accumulate with AtomicAdd) | p.14 |
| Criterion (label-smoothed cross entropy) | Forward and backward computed separately | Uses the gradient form `∇x = q − p` to fuse softmax, log, and inner product into elementwise work | p.17-18 |

Slide 19 has a case that isn't elementwise. In an encoder-decoder model, every decoder layer projects the encoder output for cross attention. LightSeq2 concatenates all layers' weights `[W1, …, WL]`, **runs one big GEMM, and splits the result**, instead of L small GEMMs.

Slides 15-16 paste code straight from LightSeq's `embedding_kernels.cu`. You can read the real thing on [GitHub](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/embedding_kernels.cu).

### Technique 2: rewrite the formula, drop a synchronization

LayerNorm needs the mean μ(x) and the standard deviation σ(x). By definition, σ(x) needs μ(x) first, so the two reductions run back to back with a thread synchronization between them. Slide 21 rewrites it as:

σ(x) = √(μ(x²) − μ(x)²)

Now μ(x) and μ(x²) can be computed together, and **two synchronizations become one**. The slide also notes computation in FP32 and storage in FP16. Slide 22 does the same for the LayerNorm backward pass: rearrange ∇x into two sums that can run in parallel, Σ wⱼ∇yⱼ and Σ wⱼ∇yⱼxⱼ, plus elementwise work.

Softmax forward also has two reductions: a max (to prevent overflow in the exponent), then a sum of exponentials. Slide 23 says it plainly: "Two reduce: Costly!" Slide 24's answer isn't a new formula but **shape-dependent tuning**: rows of length ≤ 32 get one warp per row, rows between 32 and 64 get two elements per thread, and so on. Slides 25-26 show LightSeq baking parameters like block count and elements per thread into C++ templates at compile time, then picking the right instantiation at launch.

The corners of slides 22 and 24 say "You will implement LayerNorm/Softmax in hw3!". That's an older semester's numbering. In Spring 2026 these two kernels are in [HW4](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en).

### Technique 3: mixed precision, with FP32 only where it's needed

Slide 27 lists the benefits of low precision: less memory for model and data, so larger batches; faster data movement between GPU memory and SMs at the same bandwidth; and up to 8x more FLOPs for FP16 than FP32. Slide 28 names the limit: forward and backward can use FP16 or FP8, but **the optimizer's parameter update needs FP32**. NVIDIA's APEX automates mixed precision but misses fine-grained memory optimization for LLMs.

Slide 29 shows LightSeq2's approach: parameters and gradients live in FP16 in **one contiguous workspace**. The trainer reads them, computes in FP32, and writes FP16 back; the FP32 copies never occupy real memory. Because every parameter sits in the same contiguous block, the whole update **takes a single kernel launch** instead of one per parameter tensor.

### Technique 4: reuse memory based on backward-pass dependencies

Slide 30 lists each step of the self-attention backward pass and marks which intermediate tensors are never used again, so the next step can take their space. For example, once ∇out is consumed, ∇Z is written into the same buffer. The bottleneck is the gradient of the attention scores, whose size grows with the square of the sequence length; everything else fits by rotating through the same few B×L×H buffers.

The LightSeq inference paper pushes this further. Because input lengths vary, it **pre-defines a maximum memory size for each kernel and lets operations with no dependency on each other share it**. [Section 1 of the paper](https://arxiv.org/abs/2010.13887) reports eight times fewer memory allocations with no loss of inference speed.

## Results: the numbers the slides report

Everything below is what the slides report (from the LightSeq2 experiments). Hardware and baselines differ by row:

| Task | Baseline | Reported speedup | Slide |
|---|---|---|---|
| WMT14 En-De translation training (24+24-layer Transformer, one machine with 8x A100) | Fairseq + Apex | 1.4-2.8x on V100, 1.5-3.5x on A100 | p.31-32 |
| Same, one training step | Fairseq | 457 ms → 214 ms | p.33 |
| Individual operators | Fairseq | LayerNorm 4x, Softmax 2.5-3.4x, Dropout 1.1-2.5x, Trainer 2.3x | p.34 |
| Multi-machine (1 to 5 machines, 8x A100 each) | — | 1.12-1.41x | p.35 |
| GPT-2 Large training (WikiText) | Hugging Face | 1.7-1.8x on V100, 1.6-1.9x on A100 | p.37 |
| BERT paraphrase identification (MRPC) | Hugging Face / DeepSpeed | 1.28-1.44x | p.38 |
| ViT image classification (CIFAR-10) | Hugging Face | 1.2-1.7x | p.40 |

Slide 36 also reports about 6 GB less training memory. The [LightSeq2 abstract](https://arxiv.org/abs/2110.05722) puts it as 1.4-3.5x faster than previous systems across GPUs, and a 308% training speedup on WMT14 English-German.

One thing to keep in mind when reading this table: slide 32 notes "A100 is more efficient in GEMM" to explain why the ceiling on A100 is higher than on V100. My reading: the faster matrix multiplication gets, the larger the share of time spent on non-GEMM operations, so fusing them pays off more. In other words, **the speedup depends on where your bottleneck was**, not on a fixed constant.

## Inference: making beam search skip a sort

The second half of the deck (from p.42) turns to inference, with [LightSeq](https://arxiv.org/abs/2010.13887) (NAACL 2021) as the subject. Inference has no backward pass, but it has a bottleneck training doesn't: beam search.

Slide 45 points out that each beam search step does two things: a softmax over the whole vocabulary, then picking the top k out of k × V candidates. **Sorting k × V elements is expensive.** LightSeq's Hierarchical Auto Regressive Search (HARS) switches to "filter roughly, then rank precisely":

1. Split each beam's logits into k groups and take each group's max (p.46)
2. The smallest of those k maxima is a rough threshold ℛ: the k-th best is at least this large
3. Write only logits above ℛ back to memory, then sort that small set (p.47)

Slides 48-54 walk through an example with beam size 2 and vocabulary size 8: of 16 logits, only 5 need sorting. Sorting turns into a sequence of parallel max, filter, and re-rank operations.

Slide 55 adds other inference details: share tensor memory across layers, compute mostly in FP16, use `float4` and `half2` for bandwidth, and keep no intermediate results or gradients. Slides 61-62 report up to 14x speedup for translation inference and 6x for GPT-2 inference; the LightSeq abstract says up to 14x over TensorFlow and 1.4x over FasterTransformer.

<details>
<summary>API usage shown on the slides (p.57-59)</summary>

The slides show two ways in. One replaces a Hugging Face BERT layer with a LightSeq2 layer:

```python
from lightseq.training import LSTransformerEncoderLayer
config = LSTransformerEncoderLayer.get_config(
    model="bert-base",
    max_batch_tokens=4096,
    max_seq_len=512,
    fp16=True,
    local_rank=0)
ls_layer = LSTransformerEncoderLayer(config)
# replace the 1st Hugging Face layer with LightSeq2
bert_model.layer[0] = ls_layer
```

The other uses the `lightseq-train` command in Fairseq, swapping the architecture, optimizer, and criterion for `ls_`-prefixed versions. Slide 59 says this also works alongside Apex and DeepSpeed.

</details>

## What this lecture doesn't cover

- **FlashAttention**: attention here still writes the L×L score matrix to memory; it just makes softmax fast. Fusing the whole attention without materializing the scores is the topic of this series' [FlashAttention post](/posts/ai/2026-09-30-cmu11868-flashattention-en).
- **Triton**: LightSeq is hand-written CUDA. The bottom of the syllabus lists an unscheduled topic, "Triton for Kernel Optimization", but it has no slides.
- **Quantization**: slide 64 lists it under "other approaches"; details come in the later [quantization post](/posts/ai/2026-09-30-cmu11868-model-quantization-en).

## How to read this lecture

1. Start with slides 9-12. Take any Transformer layer you know, count how many kernels PyTorch launches by default, and mark which ones could fuse.
2. Then read the LayerNorm and Softmax rewrites on slides 21-24. That's what [HW4](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en) has you write. Revisit the reduce kernel from [HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) and "one fewer synchronization" will mean something concrete.
3. For the papers, Section IV of LightSeq2 (The LightSeq2 System) matches the first half of the deck, and LightSeq's HARS section matches the second half.

One thing you can do tonight: run the PyTorch profiler on a forward pass of any Transformer you have, and count how many non-GEMM kernels there are and how much time they take.

## Further reading

- The same ideas in Triton, and measuring before optimizing: [CS336 Lecture 6: Benchmark and Profile Before Writing a Triton Kernel](/posts/ai/2026-08-22-cs336-kernels-triton-en)
- GPU memory hierarchy and the "move less data" intuition: [CS336 Lecture 5: GPUs Win by Moving Data Less, Not by Making Each Thread Fast](/posts/ai/2026-08-22-cs336-gpu-tpu-en)
- This course's earlier GPU programming model: [L02-L04 GPU Programming and Acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en)

## References

- [CMU 11-868 LLM Systems (Spring 2026) course home](https://llmsystem.github.io/llmsystem2026spring/) — instructor and course description
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — the 2/16 and 2/18 sessions share the L10 deck, one reading each
- [L10 slides: Accelerating Transformer Training and Inference (PDF, 66 pages)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) — source of every page number here
- [Wang et al., LightSeq: A High Performance Inference Library for Transformers (NAACL 2021, arXiv 2010.13887)](https://arxiv.org/abs/2010.13887) — 4x fewer kernels, 8x fewer memory allocations, HARS, 14x/1.4x inference speedups
- [Wang et al., LightSeq2: Accelerated Training for Transformer-based Models on GPUs (SC22, arXiv 2110.05722)](https://arxiv.org/abs/2110.05722) — 1.4-3.5x training speedup, 308% on WMT14 En-De
- [bytedance/lightseq (GitHub)](https://github.com/bytedance/lightseq) — the CUDA kernel source the slides quote
- [lightseq embedding_kernels.cu](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/embedding_kernels.cu) — the code on slides 15-16
- [lightseq softmax_kernels.cu](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/softmax_kernels.cu) — the template tuning example on slides 25-26
