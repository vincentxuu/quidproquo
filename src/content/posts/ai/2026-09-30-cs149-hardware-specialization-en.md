---
title: "CS149 L10: Why General-Purpose Processors Waste Energy — Hardware Specialization, Tensor Cores, TPU Systolic Arrays, and Dataflow Architectures"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, gpu, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 13
tldr: "L10 starts from one equation: when power is capped, performance can only improve by spending fewer joules per operation, and a general-purpose processor spends most of its energy fetching, decoding, and moving data rather than computing. The slides' rule of thumb is that GPUs give about 10x better perf/watt than CPUs and fixed-function ASICs can reach 100–1000x. The lecture then judges the H100's Tensor Cores and TMA, Google's TPU systolic array, and reconfigurable dataflow architectures against the same checklist: tiled tensors, asynchronous compute and memory, and compute units talking directly to each other."
description: "A guide to Lecture 10 of Stanford CS149 (Fall 2025): energy-constrained computing, the overhead of instruction processing, the efficiency-vs-programmability spectrum of DSPs, FPGAs, and ASICs, traits of an ideal AI accelerator, the energy cost of data movement, amortizing control with complex instructions, BF16/FP8 formats, A100/H100/B100 Tensor Cores and TMA, the TPU systolic array, the Hardware Lottery, and the Plasticine reconfigurable dataflow architecture."
draft: false
glossary:
  - term: "ASIC"
    aliases: ["application-specific integrated circuit", "fixed-function hardware"]
    definition: "A chip designed for one purpose, with circuits that implement the algorithm directly. No instruction fetch or decode, so it has the best energy efficiency, but it can't be reprogrammed and is expensive to design and verify."
    context: "CS149 L10's rule of thumb: for compute-bound, non-floating-point work, an ASIC can reach 100–1000x or more perf/watt over a CPU."
  - term: "Tensor Core"
    aliases: ["tensor cores"]
    definition: "A unit on NVIDIA GPUs that performs small matrix multiply-accumulates (8×4 × 4×8 on the A100). One instruction does a whole block of matrix math, amortizing fetch and control costs over many operations."
    context: "One L10 slide title reads: all the TFLOPS are in the Tensor Cores."
  - term: "systolic array"
    definition: "A grid of processing elements (PEs) through which data flows like a wave, cell by cell. Each PE does one multiply-add and passes results to its neighbor. High data reuse, local communication, and distributed control give it high area and energy efficiency."
    context: "L10 walks through it with a step-by-step y = Wx animation from Google's TPU v1."
  - term: "TMA"
    aliases: ["Tensor Memory Accelerator"]
    definition: "A dedicated data-movement unit introduced with the H100. One thread issues a copy descriptor describing a tensor region; hardware generates the addresses, moves the block asynchronously from global to shared memory, and signals a barrier when done."
    context: "L10 and L11 both use it as an example of GPUs specializing for AI."
  - term: "dataflow architecture"
    aliases: ["reconfigurable dataflow architecture", "RDA"]
    definition: "Hardware driven not by a sequential instruction stream but by laying the computation graph directly across on-chip compute and memory units. Work starts when data arrives, and units pass intermediates directly to each other."
    context: "L10 explains it with Plasticine (ISCA 2017); L11 shows how to program it with the SambaNova SN40L."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-hardware-specialization)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This guide follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is post 13 in the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers Lecture 10 from October 23, [Hardware Specialization](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/). The official [slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf) has 71 slides.

Fall 2025 recordings live only on Stanford Canvas. The closest public video is [2023 Lecture 18: Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw), but it only supplements the first half. Compared with the [2023 course site's slides on the same topic](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/), the opening material (energy constraints, H.264, FFT, DSPs, Anton, FPGAs, efficiency rules of thumb) is all in the 2023 deck. The 2023 second half covered the Spatial accelerator-design language, streaming execution, and how DRAM works (the recording's captions contain only Spatial and streaming execution; the speaker says there was no time for DRAM). The 2025 deck replaces that with GPU Tensor Cores, the TPU systolic array, and dataflow architectures. This guide follows the 2025 slides. The course overall is A3 (enough to self-study); gaps are listed in the [series overview](/posts/ai/2026-09-30-cs149-course-overview-en).

The [previous post](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) ended on a question: GPUs run DNNs well, but are they the ideal platform? This lecture answers it. This post also sets up the accelerator vocabulary (Tensor Core, systolic array, TMA, dataflow architecture) that the [next post](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en) uses without re-explaining.

## Course video sources

This article uses Fall 2025 materials. The official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and points to a 2023 YouTube playlist instead. The Fall 2023 recording below covers a closely related topic but its content may differ from the 2025 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=2tAb3EgyjNw
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 18 - Hardware Specialization
```

Original videos: [Stanford CS149 I Parallel Computing I 2023 I Lecture 18 - Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw)

Course and recording entries:

- [CS149 2023 public video playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/)

Content check: verified against the video transcript (2026-10-10): I read the auto-generated captions of the Fall 2023 recording “Lecture 18 - Hardware Specialization” (1:11:48). The captions cover energy-constrained computing, the energy cost of H.264 encoding with SIMD, FFTs/DSPs/ASICs and Anton, energy limits on mobile devices, the TPU and FPGAs (the captions render the latter as “field programmable gator rays” and touch on it only briefly), and the second half is mainly the Spatial accelerator-design language and streaming execution; the speaker says there was no time to cover how DRAM works. BF16/FP8, the A100/H100/B100 Tensor Cores, systolic arrays, Plasticine and the Hardware Lottery are not in the captions, so the video only supplements the first half of this post (energy and the case for specialization), as the post says. I checked how the video's topic relates to this post's topic; the post itself follows the Fall 2025 slides and was not compared segment by segment against the video.

## Why specialize: energy

Slides 2–4 reframe the problem as energy. Phones are limited by battery life and fanless heat dissipation. Supercomputers and data centers are limited by power and cooling because of their sheer scale (hundreds of thousands of CPUs and GPUs). And AI demand is growing exponentially.

Slide 5's equation is the backbone of the lecture:

**Power = (Ops / second) × (Joules / Op)**

Power is a fixed cap, so going faster means spending less energy per operation. The slide's conclusion: **better energy efficiency ⇒ specialization (fixed function)**. Then it asks how big the improvement from specialization can be.

## Where a general-purpose processor spends its energy

Slide 7 anticipates the objection: this whole class has been about using multi-core CPUs and GPUs efficiently, and now they're "inefficient"?

Slide 8 lists what a modern processor does to execute one instruction: read it (address translation, icache access), decode it (translate to micro-ops), check dependencies and pipeline hazards, find a free execution resource, read operands from the register file, move data to the execution unit, **do the arithmetic**, move the result back, write the register file. Only one step is the actual computation. A review question follows: how does SIMD reduce this overhead for some computations, and what properties must those computations have?

Two measured examples:

- **H.264 video encoding** (slide 9, [Hameed et al., ISCA 2010](https://doi.org/10.1145/1815961.1815968)): even with SIMD, functional units consume only a small fraction of the energy. The rest of the chart goes to instruction fetch, register access, pipeline control, and the data cache.
- **FFT** (slide 10, [Chung et al., MICRO 2010](https://doi.org/10.1109/MICRO.2010.36)): an ASIC matches one CPU core's performance with about 1/1000 of the chip area and about 1/100 of the power. GPU cores are about 5–7x more area-efficient than CPU cores.

## The specialization spectrum

Slides 11–17 walk through options more specialized than a CPU:

- **DSPs** (slide 11): still programmable, but with simpler instruction-stream control. They use complex instructions (SIMD, VLIW) to do many operations per instruction and amortize control. The example is Qualcomm's Hexagon DSP, used for modem, audio, and imaging on Snapdragon chips; the innermost FFT loop runs 29 "RISC" ops per cycle. VLIW (very long instruction word) means one instruction specifies several **different** operations, in contrast to SIMD's same operation on many data.
- **Anton** (slide 12): D. E. Shaw Research's molecular dynamics supercomputer. Anton 1 (2008) has 512 ASICs for particle-particle interactions, a throughput-oriented FFT subsystem, and a low-latency network built for N-body communication patterns. The slide says Anton 3 (2025) is about 20x faster than a contemporary GPU.
- **TPU** (slide 13): Google's deep learning processor, after which top architecture conferences filled with DNN accelerator papers.
- **FPGAs** (slides 14–17): a middle ground between an ASIC and a processor. The chip provides an array of logic blocks and interconnect, and programmer-defined logic is implemented directly on it. The basic unit is a programmable lookup table (LUT); a 6-input LUT in a Xilinx Virtex-7 is a 64-entry table, and chaining eight LUT6s gives a 40-input AND. Modern FPGAs devote a lot of area to hard blocks (SRAM, multiplier DSP blocks, even ARM or RISC-V CPUs) and are programmed in hardware description languages like Verilog. AWS offers cloud FPGAs through EC2 F1/F2.

Slide 18's rules of thumb, compared with high-quality C code on a CPU:

| Platform | perf/watt improvement | Assumption |
|---|---|---|
| Throughput-oriented processors (GPU cores) | About 10x | Code maps well to wide data-parallel execution and is compute bound |
| Fixed-function ASIC | Can approach 100–1000x or more | Compute bound and not floating-point math |

Slide 19 (design credited to Pat Hanrahan) lays these out as a spectrum: CPU, GPU, programmable DSP, domain-specific accelerator, FPGA, ASIC. Efficiency rises and programmability falls from left to right. CPUs are easiest to program. Domain-specific accelerators are programmable only within a limited domain, through DSLs (for example, DNNs). FPGAs are hard to program, and making them easier is an active research area. ASICs aren't programmable and cost tens to hundreds of millions of dollars to design, verify, and build.

## What an ideal AI accelerator looks like

Slides 21–22 return to last lecture's question. GPUs offer high FLOPS and cuDNN, but if the main operation in AI is matrix multiply, is a general-purpose processor needed?

Slide 23 lists traits of an ideal AI accelerator: high peak TFLOPS and energy efficiency, high memory bandwidth, easy to program for high performance, and able to hit the performance bound on both compute-bound and bandwidth-bound models.

Slides 24–28 build up an "ideal features" table. Two ideas set it up: asynchronous execution (later loads, ops, and stores start before earlier ones finish), and the fact that AI models are dataflow graphs (slide 25: GEMM → Pool → GEMM → SoftMax → Sum). Slide 26 names the crux: **GEMM computation is cheap; data movement is expensive**, in silicon area, watts, and nanoseconds.

| Feature | Why |
|---|---|
| Tiled tensors (e.g., 16×16, 32×32) | Max TFLOPS on GEMM, low instruction overhead |
| Asynchronous compute | Overlap compute and memory access |
| Asynchronous memory access | Overlap compute and memory access |
| Asynchronous chip-to-chip communication | Overlap compute, memory, and communication |
| Compute unit to compute unit communication | Fusion and pipelining, streaming dataflow |

The last row is the hardware version of the previous post's fusion: intermediates never leave the chip.

## Two key numbers: moving data is expensive, and so is control

Slide 31's "ballpark" numbers (sources: Bill Dally and Tom Olson) count only the logical operation, not decode or register reads:

- Integer op: about 1 pJ; floating-point op: about 20 pJ
- Reading 64 bits from a small local SRAM 1 mm away on chip: about 26 pJ
- Reading 64 bits from low-power mobile DRAM (LPDDR): about 1200 pJ

Hence the design rule: **always look for ways to reduce data movement.**

Slide 32 quantifies the overhead of programmability (instruction stream and control) relative to the operation itself:

- Half-precision FMA (fused multiply-add): 2000%
- Half-precision DP4 (vec4 dot product): 500%
- Half-precision 4×4 MMA (matrix multiply-accumulate): 27%

The principle: **amortize instruction-processing cost across the many operations of a single complex instruction.** Tensor Cores are the result.

Slide 33 covers number formats (credited to Bill Dally). BF16 has 1 sign bit, 8 exponent bits, and 7 mantissa bits: the same range as FP32 with lower accuracy. FP8 comes as E4M3 (range 0–448) and E5M2 (range 0–57344).

## How GPUs moved toward specialization

### A100 and H100 Tensor Cores

Slide 35's A100 SM has 64 fp32 ALUs, 32 int32 ALUs, and 4 Tensor Cores. A Tensor Core executes an 8×4 × 4×8 matrix multiply-add A×B + D, with A and B stored as fp16 and accumulation in fp32. The full GA100 has 108 SMs; at 1.4 GHz that's 19.5 TFLOPS of fp32 plus 312 TFLOPS of mixed fp16/32 in the Tensor Cores.

Slides 36–41 cover the H100 (2022): fourth-generation Tensor Cores, TMA, CUDA clusters, up to 80 GB of HBM3, TSMC 4nm, 80 billion transistors. Slide 38 lines up three hierarchies:

| CUDA hierarchy | Compute hierarchy | Memory |
|---|---|---|
| Grid | GPU | 80 GB HBM / 50 MB L2 |
| Cluster | CPC | 256 KB shared memory per SM |
| Thread Block | SM | 256 KB shared memory |
| Thread | SIMD lane | 1 KB registers per thread, 64 KB per SM partition |

A thread block cluster holds up to 16 thread blocks, each guaranteed to run on a separate SM at the same time. Slide 41's full H100 has 144 SMs. The Tensor Cores (labeled "systolic array MMA" on the slide) deliver 989 TFLOPS fp16; the SIMD units deliver 134 TFLOPS fp16 and 67 TFLOPS fp32. Slide 43's title says it plainly: **all the TFLOPS are in the Tensor Cores.**

### TMA: a unit just for moving data

Slide 40's **TMA (Tensor Memory Accelerator)** provides special-purpose instructions for data movement. One thread issues a copy descriptor describing a tensor region; hardware generates the addresses, moves the region asynchronously from global to shared memory, and signals a barrier when the copy completes.

### B100: "Not your father's CUDA"

Slide 44 lists the specialized features each generation added from V100 to A100, H100, and B100 (FP8, FP4, Transformer Engine, asynchronous copy, Tensor Core sparsity, a decompression engine, and more), and asks what that means for programmers.

Slide 45 gives part of the answer. B100 Tensor Cores are limited by register bandwidth, so tensor data lives in SMEM and TMEM, and single threads issue MMAs: "No more warps!" Programming Tensor Cores becomes: allocate TMEM and descriptors with `tcgen05.alloc`; prefetch and stream tiles with TMA (`cp.async.bulk.tensor`, coordinated with `mbarrier`); launch async MMAs with `tcgen05.mma` and `tcgen05.commit`; order and retire with `tcgen05.fence`. The slide's tagline: "Not your father's CUDA." Slide 46 then lists DSLs for GPU AI kernels, such as Cute-DSL (CUTLASS in Python) and Mosaic GPU.

### How close GPUs are to ideal

Slide 47 puts GPUs back into the ideal-features table: tiled tensors ✅; asynchronous compute ✅ (`mma_async`); asynchronous memory access ✅ (TMA + TMEM); compute-unit-to-compute-unit communication ❓, only partly covered by thread block clusters.

## Google's TPU and the systolic array

Slide 49 shows a lineup of AI accelerators: AWS Trainium 2, Google TPU3, Apple Neural Engine, an Intel inference accelerator, SambaNova Cardinal SN10, the Cerebras Wafer Scale Engine, and an Ampere GPU with Tensor Cores.

Slides 50–51 look at TPU v1 (figures from [Jouppi et al. 2017](https://arxiv.org/abs/1704.04760)). Arithmetic units take about 30% of the chip, and control takes very little area. There are only five key instructions: read host memory, write host memory, read weights, matrix_multiply/convolve, and activate.

Slides 52–58 animate the **systolic array**. Take y = Wx: each PE in a 4×4 grid holds one weight. Elements of x enter from the left on a diagonal, one cell per clock. Each PE does one multiply and passes its partial sum down to its neighbor, and results land in 32-bit accumulators at the bottom. For a matrix multiply Y = WX, columns of X flow through wave after wave, and the slide notes you need multiple accumulators to hold the output columns.

Slide 59's comparison:

| | SIMD | Systolic array |
|---|---|---|
| Dataflow | Control-driven (instructions) | Data-driven (wavefront) |
| Data reuse | Limited | Temporal and spatial |
| Communication | Global (register/memory) | Local (neighbor PEs) |
| Control | Centralized | Distributed |
| Efficiency (perf/mm², perf/W) | Medium | Very high |

<details>
<summary>Slides 60–63: computing a big matrix on a small array</summary>

The example is A = 8×8, B = 8×4096, C = 8×4096, assuming 4096 accumulators. Over four animated slides, A is split into small blocks loaded into the array in turn, columns of B stream through, and partial sums accumulate across the 4096 accumulators. The point: the array size is fixed, so large matrices are handled by blocking and rotating through accumulators. It's the blocked GEMM from the previous post, scheduled in hardware.

</details>

Slides 64–65 show the TPU's perf/watt comparison and how TPUs evolved across generations. Slide 66 cites Sara Hooker's [Hardware Lottery](https://arxiv.org/abs/2009.06489): a research idea may win because it suits the dominant available software and hardware, not because it's universally better. The slide draws a loop: the TPU is good at dense matrix multiply (labeled "OI ∝ n": the bigger the matrix, the more work per unit of data moved), transformer models fit that well, so hardware specializes even further for matrix multiply.

## Dataflow architectures

Slides 67–69 return to "AI models are dataflow graphs." If so, why not make the hardware dataflow too? The example is [Plasticine](https://doi.org/10.1145/3079856.3080256) (Prabhakar, Zhang, et al., ISCA 2017): a chip tiled with PCUs (pattern compute units), PMUs (pattern memory units), and switches, which lays out GEMM plus parallel patterns like map, filter, and reduce directly on the chip.

Slide 69 puts it back into the ideal-features table and adds two advantages GPUs lack: **no instructions ⇒ no instruction fetch/decode overhead**, and **extreme asynchrony: no sequential instruction execution**. Slide 70 shows FlashAttention on a dataflow architecture. QKᵀ, Mask, Softmax, Dropout, and ×V each get a group of PCUs and PMUs, and tiles flow through them like an assembly line, called a metapipeline. How to program this kind of hardware is the subject of the [next post](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en).

## Wrap-up: three things specialized hardware shares

Slide 71's summary. Specialized hardware for DNNs:

1. has many arithmetic units;
2. has customized or configurable datapaths that move intermediate values directly between processing units, which means scheduling the computation by laying it out **spatially** on the chip, at multiple granularities;
3. has large amounts of on-chip storage for fast access to intermediates.

## Vocabulary for the next few posts

| Term | In one line |
|---|---|
| ASIC | Fixed-function circuit: most efficient, not programmable |
| FPGA | Reconfigurable logic, between an ASIC and a processor |
| Tensor Core | A GPU unit that does a small matrix multiply-add in one instruction |
| TMA | A GPU unit dedicated to moving tensor blocks asynchronously |
| Systolic array | A multiply-add grid where data flows between neighboring PEs; the heart of the TPU |
| Dataflow architecture | Lays the computation graph on chip; units pass data directly, no instruction stream |

**Something to try tonight**: use slide 31's numbers to estimate a matrix multiply of two 4096×4096 fp16 matrices. If every input is read from DRAM once, how much energy goes to data movement versus arithmetic? Then think about which side blocking saves.

Further reading: for how TPUs are used with JAX and Pallas in an LLM systems course, read [CMU 11-868 TPU, JAX, and Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en). For GPUs and TPUs from the LLM training side, read [CS336 GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en).

Series navigation: previous [L9 Running DNNs efficiently on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) | next [L11 Programming systems for specialized hardware](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Fall 2023 recordings, so the status is now related supplementary video only, and video titles use the original titles.
- 2026-10-10: Checked the video content against its transcript. The video covers only the motivation half of this post plus the Spatial design language; Tensor Cores, systolic arrays and dataflow architectures are not in it, and the video-sources section now describes what the video actually contains.

## References

- [Stanford CS149 Fall 2025 course home](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 10 page (slide-by-slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/accelerators/)
- [Lecture 10 slide PDF: Hardware Specialization](https://gfxcourses.stanford.edu/cs149/fall25content/media/accelerators/10_Specialized.pdf)
- [2023 Lecture 18 video: Hardware Specialization](https://www.youtube.com/watch?v=2tAb3EgyjNw)
- [2023 hardware specialization lecture page (for comparison)](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)
- [CS149 2023 public video playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Hameed et al., Understanding Sources of Inefficiency in General-Purpose Chips (ISCA 2010)](https://doi.org/10.1145/1815961.1815968)
- [Chung et al., Single-Chip Heterogeneous Computing (MICRO 2010)](https://doi.org/10.1109/MICRO.2010.36)
- [Jouppi et al., In-Datacenter Performance Analysis of a Tensor Processing Unit (2017)](https://arxiv.org/abs/1704.04760)
- [Sara Hooker, The Hardware Lottery (2020)](https://arxiv.org/abs/2009.06489)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://doi.org/10.1145/3079856.3080256)
