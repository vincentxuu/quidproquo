---
title: "CMU 11-868 L12–L13 TPU, JAX, and Pallas: One Attention Kernel on TPU, from XLA Fusions to Splash Attention"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, hardware, compiler, attention]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 17
tldr: "Across two lectures and more than 200 slides, Google's Srinath Mandalapu traces one attention computation from Python down to TPU VLIW instructions. L12 covers the JAX ecosystem, the memory and compute units of TPU Ironwood, and how XLA compiles attention into three fused kernels. L13 covers what XLA cannot do: using Pallas to control movement between HBM and VMEM yourself, writing FlashAttention, then adding block sparsity to get Splash Attention. The ideas match the GPU version. The difference is that on TPU the compiler does most of the scheduling, and Pallas is how you take loops and block sizes back into your own hands."
description: "A guide to two Google guest lectures in CMU 11-868 LLM Systems (Spring 2026): L12 Introduction to JAX/XLA/TPU and L13 Pallas and Splash Attention. Covers the JAX AI stack, data and tensor parallelism via meshes, TPU Ironwood's HBM/VMEM/MXU/VPU, the XLA compilation pipeline and attention fusions, GSPMD vs. shard_map, Pallas grids and BlockSpecs, tile-size tuning, FlashAttention in Pallas, and Splash Attention's sparse execution tables. This series moves them from the official Week 7 slot to after FlashAttention."
draft: false
glossary:
  - term: "Pallas"
    aliases: ["JAX Pallas"]
    definition: "JAX's kernel-authoring extension. You write the computation for one block in Python, then use a grid and BlockSpecs to describe how large tensors are tiled and moved between HBM and on-chip memory."
    context: "L13 uses it to implement FlashAttention and Splash Attention on TPU."
    links:
      - label: "Pallas documentation"
        url: "https://docs.jax.dev/en/latest/pallas/index.html"
  - term: "systolic array"
    aliases: []
    definition: "A 2D grid of multiply-accumulate units where data passes between neighbors every cycle, so intermediate results never return to memory."
    context: "The TPU matrix unit (MXU) is a 256 × 256 systolic array, per the L12 slides."
  - term: "VMEM"
    aliases: ["vector memory"]
    definition: "On-chip memory in a TPU TensorCore. Much smaller than HBM but with far higher bandwidth, playing a role similar to GPU shared memory/SRAM."
    context: "Every performance analysis in L12 and L13 revolves around movement between HBM and VMEM."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

**This guide follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is post 17 in the [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) series and follows [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en).

**About the order**: in the official [Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), these two lectures sit in Week 7 (2/23 and 2/25), between LightSeq and distributed training. This series moves them after FlashAttention, because L13's main subject, Splash Attention, is FlashAttention's tiling idea carried over to TPU. With the previous post in hand, this one is a single step: new hardware and a new language, same algorithm. The in-progress [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) schedules the same two lectures on 9/28 and 9/30, adds "Recitation 6: JAX and TPU" on 10/2, and lists two "Acceleration on TPU" lectures in Week 13 that have no slides yet.

Both lectures are by Srinath Mandalapu of Google CoreML Frameworks. The official materials are two slide decks: [L12 Introduction to JAX/XLA/TPU](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-12-Introduction_to_JAX_XLA_TPU-f0450caf9e7e6707c009f7f77997a2be.pdf) (107 pages) and [L13 Pallas and Splash Attention](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-13-pallas_splash_attention_srinath_mandalapu-b0bc7990950b84561ff9aa8e1791f727.pdf) (111 pages). The Syllabus lists no readings for them. Access level is **A3**, but the official syllabus lists no public recording links, and every profiling number in the slides was measured on TPU Ironwood, which most outside readers cannot reproduce. Page numbers refer to the PDFs.

The whole post answers one question: **when you move to TPUs and XLA, how does writing a fast kernel change?**

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The scenario: the same attention on a different machine

The agenda on L12 page 3 reads as a route: train GPT-2 in JAX, look at TPU hardware, trace how XLA compiles the program into hardware instructions, then shard across devices. L13 then asks what to do when XLA's automatic output is not good enough.

The running example in both lectures is attention, the same operation Tri Dao covered in the previous post. That makes the two posts directly comparable.

## L12, part one: the JAX ecosystem and meshes

Pages 6–7 introduce the [JAX AI stack](https://jaxstack.ai/). JAX provides the NumPy API and function transformations (`jit`, `grad`, `vmap`). Flax NNX and Optax handle neural networks and optimizers. Orbax and Grain handle checkpointing and data loading. Underneath, the XLA compiler generates hardware code, and the same program runs on CPU, GPU, and TPU.

Pages 10–13 use a GPT-2 configuration (24 layers, sequence length 1024, embedding 1024, 16 heads, batch 32) to demonstrate distributed training, with a linked [Colab notebook](https://github.com/yufengg/jax-in-action/blob/master/GPT2_transformers_workshop_IO_2025.ipynb). The key concept is the **mesh**: arrange 8 devices as a named 2D grid.

| Mesh | Meaning | Communication |
|---|---|---|
| (8, 1), axes ('batch', 'model') | Pure data parallelism: the batch splits 8 ways, 4 samples per device, model fully replicated | `@nnx.jit` inserts an All-Reduce in the backward pass |
| (4, 2) | 4-way data parallel × 2-way tensor parallel: large weight matrices split across 2 devices | Partial activations exchanged within a group (All-Gather/Reduce-Scatter), gradients aggregated across groups |

JAX's style is already visible: **you declare how data is split, and the compiler inserts the communication.** `nnx.with_partitioning` on page 15 binds the split to a parameter at creation time.

## L12, part two: TPU Ironwood hardware

Page 23 gives the specs (slide figures): each Ironwood chip has 2 TensorCores and 4 SparseCores, 192 GiB of HBM at 7380 GBps, and 2307 TFLOPs peak in BF16. Pages 24–26 cover scale: 64 chips form a 3D-torus "cube," and optical circuit switching (OCS) links cubes into superpods of up to 9216 chips.

What matters more for kernel writing is the inside of a TensorCore:

- **Two memory tiers** (page 28): HBM on the order of 10–100 GiB, and on-chip VMEM of about 0.1 GiB with much higher bandwidth. The slide says that because VMEM is fast, even operations with arithmetic intensity of 10–20 can reach peak FLOPs.
- **VPU** (pages 30, 32): the vector unit is an 8 × 128 2D SIMD grid. The basic unit of data is an 8 × 128 vector register (vreg), and each site has 4 ALUs.
- **MXU** (page 35): the matrix unit is a 256 × 256 **systolic array** with 65,536 multiply-accumulate units, bfloat16 inputs, and FP32 accumulation. Weights are preloaded and stay put, activations flow in diagonally from the top, partial sums accumulate horizontally, and intermediates never go back to memory. Pages 36–44 animate a 3 × 3 example cycle by cycle.
- **XLU** (page 34): a dedicated unit for moving data across lanes, for example in cross-lane reductions.

Compared with GPUs: GPU programming centers on threads, warps, blocks, and shared memory. TPU programming centers on **getting data to flow through the VPU in 8 × 128 shapes and through the MXU in 256 × 256 shapes.**

## L12, part three: how XLA compiles attention

### The compilation pipeline

Pages 49–51 describe what happens when you call `jax.jit(attention)`:

1. **Tracing**: run the Python with abstract tracers and record a Jaxpr, doing no real math. Python side effects such as `print()` run only once, during tracing (page 53).
2. **Lowering**: Jaxpr → StableHLO → HLO. StableHLO is a cross-framework, hardware-agnostic intermediate representation that JAX, TensorFlow, and PyTorch can all target (page 56).
3. **Compile**: HLO → optimized HLO → LLO (a TPU-specific low-level representation) → scheduling → VLIW bundles → executable.

HLO's properties shape what XLA can do (page 58): it is an acyclic graph, and every array dimension is known at compile time, so memory usage can be fully determined at compile time.

### Attention becomes three fused kernels

Pages 63–73 trace XLA's output for an attention with Q and K of shape 1024 × 512. XLA fuses it into three kernels:

| Fusion | What it does | Output |
|---|---|---|
| 1. Logit & Max | QKᵀ, apply mask, row-wise max | Max logits (1024), masked logits (1024 × 1024) |
| 2. Softmax denominator | Subtract max, exponentiate, row-wise sum | Sum of exponentials (1024) |
| 3. Attention output | **Recompute** the exponentials, divide by the sum, multiply by V | Output (1024 × 512) |

Pages 68 and 70 single out the rematerialization in step 3. Instead of writing the 1024 × 1024 exponential matrix to VMEM and reading it back (8MB of write plus read, by the slide's count), XLA recomputes it on the VPU. The slide's phrase: "Math is cheap; bandwidth is expensive." It is the same trade-off as FlashAttention's backward recomputation.

A few TPU-specific details:

- **Base-2 exponentials** (page 85): TPU hardware natively supports powers of two, so eˣ is rewritten as 2^(x · log₂e).
- **VLIW** (pages 74–75): the compiler packs several independent operations into one 512-bit instruction bundle issued in the same cycle. Scheduling complexity moves from hardware to compiler, one of the most basic differences between TPUs and GPUs.
- **Asynchronous copies** (pages 71–72): `copy-start`/`copy-done` let V move from HBM to VMEM while the VPU finishes the previous fusion.

The measurements on page 92 are revealing: fusions 1 and 3 hit about 35% FLOPs utilization, while fusion 2 hits 0.32%, because softmax runs entirely on the VPU while the MXU sits idle.

### Sharding: GSPMD and shard_map

Pages 94–105 return to multiple devices. JAX offers two styles:

- **`jit` + GSPMD** (page 98): you annotate input and output shardings, and XLA partitions the whole graph and inserts communication such as All-Reduce and All-Gather.
- **`shard_map`** (page 99): you write the per-device local program and call communication yourself, for example `jax.lax.psum` or `jax.lax.all_gather`.

In the example on page 101, with both matrices row-sharded, the `jit` version gets an All-Gather on the right-hand matrix inserted by the compiler. Both styles end up as the same kind of SPMD program: every device runs the same instructions on its own shard (page 105).

## L13: when XLA is not enough, use Pallas

### Why custom kernels

L13 pages 5 and 59 critique L12's three fusions:

- The standard approach still writes large logit and probability matrices to HBM and reads them back for the next fusion.
- Even small vectors like the max and the sum of exponentials go to HBM and back.
- While the VPU computes exponentials and sums, the MXU is idle.

Pallas's positioning: you control the **temporal** flow (when to move, when to compute), and the backend handles the **spatial** layout (8 × 128 tiling). Page 5 adds that Pallas lowers from a custom call through MLIR straight to LLO, bypassing HLO, so the compiler will not reorder your manual scheduling.

### The three parts of Pallas

Page 16 lists the memory spaces Pallas can target: HBM (`ANY`), VMEM, SMEM (scalar memory), and SEMAPHORE. Pages 22–25 explain the three parts:

| Part | Role |
|---|---|
| `grid` | The iteration space; the kernel is invoked prod(grid) times |
| `BlockSpec` | Which block to copy from HBM to VMEM at each grid position (`block_shape` and `index_map`) |
| `pallas_call` | Binds kernel, grid, and BlockSpecs, and automatically emits a pipeline that overlaps copies with compute |

Page 25 puts `pallas_call` plainly: it is essentially a set of nested for loops. Each iteration fetches the matching input blocks, calls the kernel, and writes the output block back.

Page 19 shows what happens without tiling. Without a BlockSpec, Pallas tries to fit entire tensors in VMEM. The slide says VMEM is about 32MB per core, so a 2048 × 2048 FP32 matrix (16MB) plus workspace triggers an OOM.

<details>
<summary>Slides 18 and 23: matrix addition, untiled and tiled</summary>

```python
def add_matrices_kernel(x_vmem_ref, y_vmem_ref, z_vmem_ref):
    # load from VMEM into registers, add, store back to VMEM
    z_vmem_ref[:, :] = x_vmem_ref[:, :] + y_vmem_ref[:, :]

# Page 18: no tiling, whole tensors copied into VMEM
def add_matrices(x, y):
    return pl.pallas_call(
        add_matrices_kernel,
        out_shape=jax.ShapeDtypeStruct(x.shape, x.dtype),
    )(x, y)

# Page 23: BlockSpec tiles into (bm, bn) blocks; pallas_call pipelines automatically
def add_matrices_pipelined_param(x, y, *, bm=256, bn=256):
    m, n = x.shape
    block_spec = pl.BlockSpec((bm, bn), lambda i, j: (i, j))
    return pl.pallas_call(
        add_matrices_kernel,
        out_shape=x,
        in_specs=[block_spec, block_spec],
        out_specs=block_spec,
        grid=(m // bm, n // bn),
    )(x, y)
```

</details>

### Tile size decides everything

Pages 38–45 use matrix multiplication to show how to tell whether a kernel is compute-bound or memory-bound. Page 39 computes Ironwood's critical arithmetic intensity at about 279 FLOPs/byte per TensorCore (1028.75 TFLOP/s peak divided by HBM bandwidth), so an FP32 square matmul needs M > about 1674 to become compute-bound.

The experiment on page 45 is the most direct. For the same (4096, 7168) × (7168, 18432) matmul:

| Tile (bm, bk, bn) | Time | FLOPs utilization | Kernel invocations |
|---|---|---|---|
| 512, 512, 512 | 4.63 ms | 22.72% | 4032 |
| 1024, 1024, 1024 | 1.68 ms | 62.70% | 504 |

Changing only the tile size made it 2.75x faster. The slide's conclusion: the main goal of Pallas tuning is to find the largest tiles that fit in VMEM, keeping the grid as small as possible.

Pages 48–52 go one level lower. `pallas_call` automatically double-buffers. For deeper pipelines or unusual tiling, you can issue DMAs manually with `pl.make_async_copy`, or schedule inside the kernel with `pltpu.emit_pipeline`.

### FlashAttention in Pallas

Pages 57–66 carry over the previous post's ideas unchanged. Each Q block walks through all K/V blocks, maintaining a per-row running max (m) and sum of exponentials (l). Each new block rescales the old result by alpha = exp(m_prev − m_next), and the division happens only once at the end (delayed normalization).

Then comes the TPU tuning story. With 128 heads, sequence length 4096, Q/K head dimension 192, and V dimension 128 (pages 71–85):

| Version | Blocks (br, bc) | Time | MFU |
|---|---|---|---|
| Baseline | 1024, 2048 | 4.03 ms | 33.37% |
| Larger Q block | 2048, 2048 | 3.36 ms | 39.73% |
| Plus Max Logit Estimate | 2048, 2048 | 2.64 ms | 50.27% |
| Larger still | 4096, 4096 | — | Memory limit exceeded |

Along the way come problems that only show up on TPU:

- **Register pressure** (pages 75–76): a Pacchetto trace of the LLO bundles shows vregs 100% full, triggering constant `VSTORE.SPILL`, with the MXU stalling intermittently for data. The fix is micro-tiling: split bc = 2048 into compute chunks of 1024 (pages 82–86).
- **Implicit zero padding** (page 79): head dimension 192 is not a multiple of 256, so LLO pads it to 256, and a quarter of the MXU work is multiplying zeros.
- **Max Logit Estimate** (page 84): replace each block's dynamic max with a predetermined constant, removing the `vmax` reduction from the VPU.

### Splash Attention: sparse + flash

From page 87 on comes the title subject. Splash means "Sparse + Flash" (page 93): preprocess the mask into a sparse execution table so the kernel computes only the blocks that matter.

- **Three kinds of mask block** (pages 89–91): fully masked blocks are skipped entirely; fully visible blocks need no mask; only partially visible blocks get a fine-grained mask. Page 90's example is a 4096 × 4096 causal mask with [1024, 2048] blocks: only 6 of 8 blocks need computing, and the partial blocks need just 2 distinct mask patterns stored.
- **Execution tables live in SMEM**: arrays such as `block_mask`, `active_rows`, `active_cols`, and `mask_next` are computed once per mask. The kernel uses them to compute the address of the next block to load and to prefetch the next mask pattern.
- **Segment IDs** (pages 95–96): when several samples are packed into one sequence, segment IDs ensure tokens only attend within their own sample. They are ANDed with causal or local masks into one execution table.
- **The block-size dilemma** (page 94): large blocks (e.g., 2048) are needed to saturate the MXU but compute many zeros inside a causal mask. Small blocks (e.g., 512) skip more precisely but hurt MFU.

The implementation the slides point to is [Tokamax](https://github.com/openxla/tokamax) (page 54), a library of custom kernels built on JAX and Pallas that supports NVIDIA GPUs and TPUs. The [Splash Attention source](https://github.com/openxla/tokamax/tree/main/tokamax/_src/ops/experimental/tpu/splash_attention) lives there. Page 11 also mentions that Paged Attention for inference is written in Pallas, pointing to [vLLM's TPU inference project](https://github.com/vllm-project/tpu-inference).

## Back to the question: how GPUs and TPUs differ

Side by side with the previous post:

| | GPU (FlashAttention) | TPU (Pallas/Splash) |
|---|---|---|
| Traffic to cut | HBM ↔ SRAM | HBM ↔ VMEM |
| Core algorithm | Tiling, online softmax, recomputation | Same |
| Who schedules | You write CUDA; warp schedulers decide at runtime | XLA schedules VLIW bundles at compile time; Pallas lets you take over loops and blocks |
| Typical bottleneck | Exponential units lag Tensor Cores (FA3, FA4) | Softmax on the VPU leaves the MXU idle; vreg spills |
| Tuning levers | Warp specialization, async instructions, FP8 | Tile size, micro-tiling, base-2 exponentials, Max Logit Estimate |

The algorithm is identical. What differs is **where control sits**. On GPUs you are already writing the kernel, and the question is how to schedule it better. On TPUs the compiler does everything by default, and Pallas is the tool for taking some of that control back.

**Something you can do tonight**: L13 page 110 lists five exercises. The first is the easiest start: set Splash Attention's `bq` and `bkv` to 2048 and `bkv_compute` to 512, and observe the effect of micro-tiling. Without a TPU, follow L12 page 51 on any device: call `jax.make_jaxpr` and `jax.jit(...).lower(...).as_text()` on an attention function and look at the Jaxpr and StableHLO yourself.

## Further reading

- Stanford CS336's [GPU/TPU post](/posts/ai/2026-08-22-cs336-gpu-tpu-en) compares the two accelerators from the hardware side.
- The [How to Scale Your Model sharding chapter](https://jax-ml.github.io/scaling-book/sharding/) and the [official shard_map tutorial](https://docs.jax.dev/en/latest/notebooks/shard_map.html), both cited in L12.
- The [Pallas documentation](https://docs.jax.dev/en/latest/pallas/index.html) covers every API used in L13.

## Series navigation

- Previous: [L21 FlashAttention (guest lecture by Tri Dao)](/posts/ai/2026-09-30-cmu11868-flashattention-en)
- Next: [L23 Parameter-Efficient Fine-Tuning for Large Models](/posts/ai/2026-09-30-cmu11868-peft-lora-en)
- Series overview: [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L12 Decoding the JAX AI Stack: JAX / XLA / TPU slides (Srinath Mandalapu, 2026-02-23)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-12-Introduction_to_JAX_XLA_TPU-f0450caf9e7e6707c009f7f77997a2be.pdf)
- [L13 Pallas Kernels / Splash Attention slides (Srinath Mandalapu, 2026-02-25)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-13-pallas_splash_attention_srinath_mandalapu-b0bc7990950b84561ff9aa8e1791f727.pdf)
- [CMU 11-868 Fall 2026 Syllabus (for schedule comparison)](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
- [GPT-2 JAX notebook linked from L12 (yufengg/jax-in-action)](https://github.com/yufengg/jax-in-action/blob/master/GPT2_transformers_workshop_IO_2025.ipynb)
- [JAX AI Stack](https://jaxstack.ai/)
- [Pallas documentation](https://docs.jax.dev/en/latest/pallas/index.html)
- [openxla/tokamax (includes Splash Attention)](https://github.com/openxla/tokamax)
- [vllm-project/tpu-inference](https://github.com/vllm-project/tpu-inference)
- [Dao et al., FlashAttention (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135)
