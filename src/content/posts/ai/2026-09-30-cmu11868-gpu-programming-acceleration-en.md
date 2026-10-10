---
title: "CMU 11-868 L02–L04 GPU Programming and Acceleration: Threads, Blocks, the Memory Hierarchy, and Tiling"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, gpu, cuda, performance]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 2
tldr: "CMU 11-868's three GPU lectures answer one question: why does a correct CUDA matmul use only 2.48% of an A100's FP32 compute? L02 covers SMs, warps, and the grid/block/thread hierarchy. L03 covers cudaMalloc, cudaMemcpy, and kernel indexing. L04 uses tiling, coalesced access, and bank-conflict avoidance to bring data closer than global memory, which sits about 500 cycles away."
description: "A guide to the Spring 2026 L02 GPU Programming, L03 GPU Programming 2, and L04 GPU Acceleration slides of CMU 11-868 LLM Systems, plus Recitation 1: GPU servers and SM architecture, SIMT and warps, CUDA memory allocation and kernel launches, the compute-to-global-memory-access ratio, the memory hierarchy, shared-memory tiling, coalesced access, bank conflicts, CSR sparse matrices, and cuBLAS, mapped onto HW1."
draft: false
glossary:
  - term: "SM"
    aliases: ["Streaming Multiprocessor"]
    definition: "The basic compute unit of an NVIDIA GPU. The A6000 in the L02 slides has 84 SMs; each SM has four partitions of 32 cores and a shared L1/shared memory."
    context: "CUDA assigns thread blocks to SMs for execution."
  - term: "warp"
    aliases: []
    definition: "The unit in which an SM creates, manages, schedules, and executes threads. A warp has 32 threads that execute one common instruction per cycle."
    context: "CMU 11-868 L02, page 26."
  - term: "tiling"
    aliases: ["shared memory tiling"]
    definition: "Splitting input matrices into small tiles that a thread block loads cooperatively into shared memory and reuses, cutting global memory accesses."
    context: "CMU 11-868 L04 demonstrates it with matrix multiplication, following PMPP chapter 5."
  - term: "coalesced memory access"
    aliases: ["coalescing"]
    definition: "When threads in a warp access consecutive addresses, the hardware merges them into a few memory transactions, which is faster than scattered access."
    context: "CMU 11-868 L04 contrasts coalesced and uncoalesced access with a matrix transpose."
  - term: "bank conflict"
    aliases: []
    definition: "Shared memory is split into 32 banks of 4 bytes each. When several threads in a warp touch different addresses in the same bank, the accesses are serialized."
    context: "L04 removes the transpose's bank conflicts by padding the shared array with one extra column."
  - term: "compute-to-global-memory-access ratio"
    aliases: ["arithmetic intensity"]
    definition: "How many floating-point operations a kernel performs per byte read from or written to GPU global memory (FLOP/B). When it's too low, the kernel is limited by memory bandwidth, not compute."
    context: "L04 shows the simplest matmul kernel reaches only 0.25 FLOP/B."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This article follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). Sources: [L02 GPU Programming Basics 1](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf) (1/14, 36 pages), [L03 GPU Programming Basics 2](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-03-gpu-programming2-b82b6ffdf554494747d00ce7ac606c3b.pdf) (1/21, 32 pages), [L04 GPU Acceleration](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-04-gpu-acceleration-48ffa5768ba62c54138f0a71ca2b68b8.pdf) (1/26, 47 pages), the [Recitation 1 slides](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit), and the example code in [`cuda_acceleration_demo`](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo). Page numbers are PDF page numbers. Facts were checked on 2026-09-30. The official syllabus lists no public video links.

**Series**: previous [L01: Why LLMs Need Systems](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en) | next [HW1: CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

These three lectures are the foundation of the course. As the [overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) notes, the prerequisites only ask for C/C++, yet L02 reaches CUDA in week two. This article follows a five-layer structure: a surprising number first, then intuition, then the mechanisms, and finally the link back to LLMs and the homework.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The scene: a correct matmul that uses 2.48% of the GPU

L04 page 6 shows the most obvious matrix-multiply kernel. Each thread computes one element of the output by taking the dot product of a row of A and a column of B. The code is correct.

The problem is each step of the inner loop. It reads two FP32 values, `a[row*N+k]` and `b[k*N+col]` (8 bytes in total), and does one multiply and one add (2 FLOP). The slides call this ratio the compute-to-global-memory-access ratio, and it comes out to **0.25 FLOP/B**.

Page 7 plugs it into an A100 80G PCIe. Memory bandwidth of 1,935 GB/s times 0.25 feeds at most 483.75 GFLOPS, which is 2.48% of FP32 peak (19.5 TFLOPS). The slide's verdict is one line: "Memory-bound program." Speed is capped by how fast data arrives from memory, not by compute.

These three lectures answer where the GPU's compute is, where the data is, and how to bring them together.

## Intuition: lots of workers, a faraway fridge

First, why GPUs are powerful. L02 page 21 compares an AMD EPYC 9754 with an NVIDIA A6000. The CPU has 256 threads and the GPU has 10,752. Compute goes from 576 GFLOPS to 38.7 TFLOPS, at slightly lower power. A GPU is a big crew of workers all doing the same thing.

Then, where the data lives. L04 page 8 gives the access latency of each memory level: registers take about 1 cycle, shared memory and L1 about 5, and global memory about 500. Page 9 breaks vector addition into GPU instructions: two `ld.global` loads at 500 cycles each and one `add.f32` at 1 cycle.

Picture a kitchen with many fast cooks. The ingredients sit in a fridge at the end of the hall (global memory), 500 steps away, and the counter (shared memory) is right beside them. If every cook walks to the fridge for each cut, more cooks won't help. The core of acceleration is to carry more to the counter in one trip and let everyone share it.

## Mechanism 1: GPU servers and SMs

**Server level.** L02 pages 10–11 use the instructor's lab machine as an example: two EPYC CPUs and eight A6000 48GB cards, linked by NVLink (112.5 GB/s) or PCIe Gen4 (32 GB/s). Page 12 says why this matters: in data-parallel training, gradients move from one GPU to another. That thread returns in the distributed training lectures.

**GPU level.** The A6000 on page 16 has 84 SMs (Streaming Multiprocessors) and a 6MB L2 cache. The spec table on page 15 puts B200, H100, and A100 side by side; for example, H100 memory bandwidth is 3.2TB/s and A100's is 2TB/s.

**SM level.** Page 18: each SM has four partitions of 32 cores, so 128 cores per SM. Each partition has 64KB of registers (the fastest storage), and each SM has 128KB of shared L1. Page 19 shows the H100 raising shared L1 to 256KB.

## Mechanism 2: the CUDA programming model

**Host and device.** Page 23: the CPU is the host and runs ordinary C++. The GPU is the device and runs CUDA kernels. Data has to move between system memory and GPU memory.

**SIMT and three levels of organization.** Page 24: CUDA is Single Instruction Multiple Threads. Threads form thread blocks, blocks form a grid, and a kernel executes as a grid of blocks of threads. L03 page 21 adds that a block holds at most 1,024 threads.

**Warps.** L02 page 26: an SM splits a block into warps of 32 threads, the unit of creation, scheduling, and execution. A warp executes one common instruction per cycle, but each thread has its own program counter and registers and can branch. Page 27 says switching between warps is instant, and how many warps fit on an SM depends on the memory requested and available.

**Five steps of a GPU computation.** L03 page 12:

1. The CPU allocates GPU memory with `cudaMalloc`
2. Copies data from host to device with `cudaMemcpy`
3. Launches the kernel
4. Copies results back to the host with `cudaMemcpy`
5. Frees GPU memory with `cudaFree`

**How a thread knows which element is its own.** L03 page 22: the compiler provides four built-in variables, `gridDim`, `blockIdx`, `blockDim`, and `threadIdx`. In one dimension the global index is `blockDim.x * blockIdx.x + threadIdx.x`. Page 27 leaves an exercise: a grid of 2×3×4 blocks with 2×4×8 threads each, 1,536 threads in total. Can an A6000 run them all at once?

<details>
<summary>Vector addition from L03: the full host-side flow</summary>

```cpp
// L03 page 20: kernel
__global__ void VecAddKernel(int* A, int* B, int* C, int n) {
  int i = blockDim.x * blockIdx.x + threadIdx.x;
  if (i < n) {
    C[i] = A[i] + B[i];
  }
}

// L03 page 29: host side
void VecAddCUDA(int* Acpu, int* Bcpu, int* Ccpu, int n) {
  int *dA, *dB, *dC;
  cudaMalloc(&dA, n * sizeof(int));
  cudaMalloc(&dB, n * sizeof(int));
  cudaMalloc(&dC, n * sizeof(int));
  cudaMemcpy(dA, Acpu, n * sizeof(int), cudaMemcpyHostToDevice);
  cudaMemcpy(dB, Bcpu, n * sizeof(int), cudaMemcpyHostToDevice);
  int threads_per_block = 256;
  int num_blocks = (n + threads_per_block - 1) / threads_per_block;
  VecAddKernel<<<num_blocks, threads_per_block>>>(dA, dB, dC, n);
  cudaMemcpy(Ccpu, dC, n * sizeof(int), cudaMemcpyDeviceToHost);
  cudaFree(dA);
  cudaFree(dB);
  cudaFree(dC);
}
```

`num_blocks` rounds up so the last few elements are covered when n isn't a multiple of 256, and the `if (i < n)` in the kernel stops the extra threads. L02 page 31 gives the compile command `nvcc -o output.so --shared src.cu -Xcompiler -fPIC`, and HW1 builds its kernels into a shared library for Python the same way.

</details>

L03 pages 17–18 also introduce the H100's Tensor Memory Accelerator (TMA), which moves data asynchronously with `cuda::memcpy_async` and a barrier. The three lectures only mention it; they don't go further.

## Mechanism 3: the memory hierarchy

L04 page 11 tabulates each CUDA declaration with its memory, scope, and lifetime:

| Declaration | Memory | Scope | Lifetime |
|---|---|---|---|
| `int var;` | Register | One thread | Kernel run |
| `int varArr[N];` | Local | One thread | Kernel run |
| `__device__ __shared__ int SharedVar;` | Shared | One block | Kernel run |
| `__device__ int GlobalVar;` | Global | Whole grid | Whole application |
| `__device__ __constant__ int constVar;` | Constant | Whole grid | Whole application |

L03 page 15 says the same thing plainly: each thread has private registers, each block has shared memory declared with `__shared__` and visible to the whole block, and every thread can access global memory, which persists across kernel launches in the same program.

## Mechanism 4: tiling

Back to the opening matmul. L04 pages 12–13 point out the opportunity: threads in the same block use the same data. When computing one row of C, every thread reads the same row of A. If each thread reads it from global memory on its own, the same data gets moved many times.

Tiling works like this (pages 14–18):

1. Each thread in the block loads one element, so together they bring the first tile of A and B into shared memory
2. `__syncthreads()` waits until everyone has finished loading
3. Each thread computes a partial sum from the tiles in shared memory, then `__syncthreads()` waits until everyone is done
4. Load the next tile and repeat until the whole row and column are covered

Each element is read from global memory once and then reused by many threads of the block from shared memory, which raises the compute-to-global-memory-access ratio.

<details>
<summary>Tiled matmul kernel (L04 page 36, cuda_acceleration_demo)</summary>

```cpp
#define TILE_WIDTH 2
__global__ void MatMulTiledKernel(float* d_A, float* d_B, float* d_C, int N) {
  __shared__ float As[TILE_WIDTH][TILE_WIDTH];
  __shared__ float Bs[TILE_WIDTH][TILE_WIDTH];
  // Determine the row and col of the P element to be calculated for the thread
  int row = blockIdx.y * blockDim.y + threadIdx.y;
  int col = blockIdx.x * blockDim.x + threadIdx.x;
  float Cvalue = 0;
  for(int ph = 0; ph < N/TILE_WIDTH; ++ph) {
    As[threadIdx.y][threadIdx.x] = d_A[row * N + ph * TILE_WIDTH + threadIdx.x];
    Bs[threadIdx.y][threadIdx.x] = d_B[(ph * TILE_WIDTH + threadIdx.y) * N + col];
    __syncthreads();
    for(int k = 0; k < TILE_WIDTH; ++k) {
      Cvalue += As[threadIdx.y][k] * Bs[k][threadIdx.x];
    }
    __syncthreads();
  }
  d_C[row * N + col] = Cvalue;
}
```

Both `__syncthreads()` calls are required. The first makes sure the tile is loaded before anyone computes; the second makes sure everyone is done before the tile is overwritten. The outer loop runs `N/TILE_WIDTH` times with no bounds check, so this demo is only correct when N is a multiple of `TILE_WIDTH`. The repo's [`matmul_tile_full.cu`](https://github.com/llmsystem/llmsys_code_examples/blob/main/cuda_acceleration_demo/matmul_tile_full.cu) sets `TILE_WIDTH` to 32 and times the naive and tiled versions with CUDA events.

</details>

Tiles can't grow forever. L04 pages 20–21 list the limits: an A100 has 192KB of shared memory per SM and an H100 has 256KB. A 32×32 FP32 tile is 4KB, so the A and B tiles take 8KB together. Registers are finite too: the more threads you launch, the fewer registers each one gets.

## Mechanism 5: coalesced access and bank conflicts

Tiling fixes how many times you read. This section is about how you read.

**Coalesced access.** L04 pages 22–24: the GPU accesses 32 bytes at a time, and consecutive accesses within a warp are merged into one. C and CUDA store multidimensional arrays in row-major order, so reading along a row uses DRAM bursts. If neighboring threads read far-apart addresses, each thread needs its own load.

**The matrix transpose example.** Pages 25–33 walk through the whole optimization with a transpose:

1. **Naive** (pages 26–28): reads of A run along rows and are coalesced; writes to C run down columns and aren't.
2. **Use shared memory** (pages 29–30): the block reads a tile into shared memory with coalesced loads, calls `__syncthreads()`, then reads shared memory in the other direction and writes out with coalesced stores.
3. **Bank conflicts** (pages 31–32): shared memory has 32 banks of 4 bytes each, and different addresses in the same bank are served one after another. Reading the shared array down a column puts a whole warp's threads in the same bank.
4. **Padding** (pages 33–34): declare the shared array as `[X][Y+1]`. The extra column shifts each row by one bank, and the conflicts disappear.

Same data, but changing the read/write direction and adding one column of shared memory makes a large difference in how efficiently it moves. LightSeq and FlashAttention later build on this idea of rearranging the data flow.

**Sparse matrices and cuBLAS.** The last two sections of L04 are short. Pages 38–40 introduce the CSR format and an SpMV kernel with one thread per row. Pages 42–45 introduce cuBLAS, a library for GEMM and other linear algebra. They show the signatures of `cublasSdot`, `cublasSgemv`, and `cublasSgemm`, and remind you to call `cublasCreate` before and `cublasDestroy` after.

## Back to LLMs and the homework

[L01](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en) broke LLM computation into matrix multiply, reduction, map, and memory movement. L02 pages 7–8 make this concrete with a small sentiment classifier (embedding, linear, ReLU, average, softmax): every layer comes down to these operators, and computing them efficiently takes a GPU.

[Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) turns those operators into CUDA kernels and plugs them into MiniTorch: map (15 points), zip (25), reduce (25), matrix multiply (30), plus integration (5). The assignment page marks both the shared-memory tree reduction for reduce and shared-memory tiling for matmul as "Optional" hints. What's required is a correct parallel version; the tiling in this article is the stretch goal. Officially, HW1 was released on the day of L02 (1/14) and due 1/28, so students start before L03 and L04.

Recitation 1 covers setup before coding: getting a PSC account, head nodes versus GPU nodes, interactive and batch jobs, file transfer, and using VS Code to jump through the head node to an allocated node. The slides list PSC's GPU nodes as mostly V100s (24 nodes with 8×V100-32GB and 9 nodes with 8×V100-16GB) and add "Recently got H100s."

**Tonight**:

- Start a Colab GPU runtime and open [`CUDA_Accelerate_Examples.ipynb`](https://github.com/llmsystem/llmsys_code_examples/blob/main/cuda_acceleration_demo/CUDA_Accelerate_Examples.ipynb). Fill in the blanks in `matmul_tile.cu` yourself, then compile `matmul_tile_full.cu` and compare naive and tiled timings. The notebook defaults to `-arch=sm_75`, which matches Colab's T4.
- Afterwards, read the explanation at the end of the notebook. A T4 has a 6MB L2 cache, so below roughly N≈1,224 the whole matrix fits in L2 and the naive version doesn't lose by much. The larger N gets, the more tiling pays off.
- No GPU? Do the opening arithmetic: plug L04 page 6's 0.25 FLOP/B into your GPU's memory bandwidth and see what fraction of peak you could reach.

## Going deeper

- [CS336 Lecture 5: GPUs are fast because data moves fewer times](/posts/ai/2026-08-22-cs336-gpu-tpu-en): the same memory-hierarchy ideas, with video and a TPU comparison.
- [CS336 Lecture 6: learn to benchmark and profile before writing Triton kernels](/posts/ai/2026-08-22-cs336-kernels-triton-en): one level up from CUDA, writing kernels in Triton.
- Practice recommended in Recitation 1: Sasha Rush's [GPU-Puzzles](https://github.com/srush/GPU-Puzzles), NVIDIA's [cuda-samples](https://github.com/NVIDIA/cuda-samples), and [How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM), which optimizes a matmul step by step toward cuBLAS.
- Assigned reading: *Programming Massively Parallel Processors*, 4th ed. The Syllabus pairs L02 with chapters 2 and 4, L03 with chapter 3, and L04 with chapters 5 and 6. L04 page 2 also recommends NVIDIA's [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/).

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 11-868 L02 GPU Programming Basics 1 slides (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)
- [CMU 11-868 L03 GPU Programming Basics 2 slides (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-03-gpu-programming2-b82b6ffdf554494747d00ce7ac606c3b.pdf)
- [CMU 11-868 L04 GPU Acceleration slides (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-04-gpu-acceleration-48ffa5768ba62c54138f0a71ca2b68b8.pdf)
- [CMU 11-868 Recitation 1 slides: PSC, CUDA demo, HW1](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [llmsys_code_examples: cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)
- [llmsys_code_examples: simple_cuda_demo notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/simple_cuda_demo/CUDA_Code_Examples.ipynb)
- [CMU 11-868 Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/)
- [NVIDIA CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)
- [srush/GPU-Puzzles](https://github.com/srush/GPU-Puzzles)
- [NVIDIA/cuda-samples](https://github.com/NVIDIA/cuda-samples)
- [How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM)
