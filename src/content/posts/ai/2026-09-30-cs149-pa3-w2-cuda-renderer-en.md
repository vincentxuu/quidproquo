---
title: "CS149 PA3 and Written 2: A CUDA Circle Renderer That Must Be Both Correctly Ordered and Fast"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, homework]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 11
tldr: "PA3 has three parts: port SAXPY to CUDA and time it two ways, implement find_repeats with an exclusive scan, and write a CUDA circle renderer that is both correct and fast (85 points). The hard part of the renderer is that blending semi-transparent circles doesn't commute, so every pixel must be updated in input order, and the starter code's one-thread-per-circle approach gets neither atomicity nor order right. Written 2 has five graded problems (fusion, SIMD utilization, a barrier instead of locks, data-parallel primitives on graphs, locks in a particle simulation) plus 14 practice problems. Outside Stanford you need your own NVIDIA GPU. No solutions here."
description: "A guide to Stanford CS149 (Fall 2025) Programming Assignment 3 and Written Assignment 2: kernel timing and PCIe bandwidth in SAXPY, the grading bar for scan and find_repeats, the renderer's atomicity and order invariants, the eight graded scenes and the performance formula, the README's hints, the AWS g5g.xlarge setup, and what each of Written 2's five graded problems practices. No solutions."
draft: false
glossary:
  - term: "alpha blending"
    aliases: ["alpha compositing"]
    definition: "Layering a semi-transparent color over an existing pixel: result = α × new color + (1 − α) × old pixel color. Order matters, so the operation doesn't commute."
    context: "That is why PA3's circle renderer must update each pixel in circle input order."
  - term: "kernel fusion"
    aliases: ["loop fusion", "fusion"]
    definition: "Merging several loops or kernels that would each read and write memory into one, so intermediate results stay in registers or cache and memory traffic drops."
    context: "The topic of Written 2's first problem, 'To Fuse or Not to Fuse'."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: This post is based on [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25), Fall 2025: [Assignment 3: A Simple CUDA Renderer](https://github.com/stanford-cs149/asst3) (due October 30) and [Written Assignment 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf) (the course homepage lists October 21). I checked the README, `cloud_readme.md`, and the PDF on 2026-09-30. Access grade **A3**: the problems, starter code, grading scripts, and written assignment PDF are public. What you can't get is Gradescope grading, the course's AWS credits, and solutions. You need your own NVIDIA GPU. **This post contains no solutions.**

**Series**: Previous: [Lecture 8: Data-Parallel Thinking](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en) | Next: [Lecture 9: DNNs on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

[Lecture 7](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en) covered how CUDA's abstractions land on the GPU, and [Lecture 8](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en) covered replacing locks with primitives like scan and sort. PA3 tests both. The README says the renderer is very simple, but parallelizing it requires you to design and implement **data structures that can be efficiently constructed and manipulated in parallel**. Then, in bold: seriously, start early.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding. Rechecked live on 2026-10-10: the official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and offers only the 2023 playlist, which has no video matching this article's scope. Checked: 2026-10-10.

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17)

## Where it sits in the course, and the environment

PA3 is due October 30, right after Lectures 7 and 8. Per the [course info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo), programming assignments can be done in pairs and PA3 is worth 12% of the grade. Written 2 must be done in groups of three, randomly assigned by the staff, and each written assignment is worth 3%.

**Environment**: the README says performance testing happens on AWS GPU VMs and mentions the NVIDIA T4 (compute capability 7.5). The [cloud_readme.md](https://github.com/stanford-cs149/asst3/blob/master/cloud_readme.md) is more specific:

- Instance type `g5g.xlarge`; its sample `nvidia-smi` output shows an **NVIDIA T4G** with CUDA 12.8.
- The AMI is `Deep Learning ARM64 Base OSS Nvidia Driver GPU AMI (Ubuntu 22.04) 20250613` from Community AMIs, with a 65 GiB volume.
- You also install `freeglut3-dev`.
- The course hands out AWS student credits, and the doc keeps reminding you to shut the instance down.

For a self-learner outside Stanford, this means the AMI is a public community AMI, so **in principle you can follow the same steps at your own expense**. That differs from PA4, which uses a private course AMI. (I have not launched one myself.) You can also use your own NVIDIA GPU. The repo ships reference solutions in both ARM64 (`render_ref`, `cudaScan_ref`) and x86 (`render_ref_x86`, `cudaScan_ref_x86`) builds, and `render/checker.py` picks one based on `platform.machine()`. `checker.py` scores you against the reference solution **on the same machine**, so scores stay meaningful on other hardware. The raw times just can't be compared with T4 numbers.

## Part 1: SAXPY warm-up (5 points)

Port the SAXPY from [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance-en) Program 5 to CUDA: allocate device memory, copy the inputs over, run the kernel, and copy the result back.

The point is the timing. The starter code already times the whole process of copying over, running the kernel, and copying back. You add a second timer around the kernel alone. The README warns that kernel launches are **asynchronous** with the CPU by default. If you read the clock right before and after the launch, you measure only the API call and get an amazingly fast number. You need `cudaDeviceSynchronize()` after the launch. `cudaMemcpy()` is synchronous in the way the assignment uses it, so it needs no extra sync.

Two questions:

1. How does performance compare with the sequential CPU version from PA1?
2. How do the two sets of timings differ? Are the observed bandwidths roughly consistent with the specs of each part of the machine?

The README drops a hint. The expected bandwidth of the memory bus on AWS is 5.3 GB/s, which doesn't match a 16-lane PCIe 3.0 link. Reasons include motherboard chipset performance and whether the source host memory is **pinned**. What this question really wants you to see is the arithmetic intensity reasoning from [Lecture 6](/posts/ai/2026-09-30-cs149-locality-communication-en) playing out on a GPU. SAXPY does one multiply-add per element, so moving data dominates.

## Part 2: prefix sum and find_repeats (10 points)

`find_repeats` takes an integer array A and returns every index i where `A[i] == A[i+1]`. The README's example: `{1,2,2,1,1,1,3,5,3,3}` gives `{1,3,4,8}`.

You must first implement a parallel exclusive scan and then build `find_repeats` on top of it. The pseudocode in the README is the up-sweep / down-sweep algorithm from [Lecture 8's slides](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17), with one kernel launch per `parallel_for`. The starter code rounds the array length up to a power of two and copies only N elements back, so you only need to handle powers of two.

Things to notice while reading the task:

- **Grading is on performance alone**, and full credit requires being within 20% of the reference. The scan score table in the README shows times from a simple CUDA implementation on a K80.
- The README says this part is about practicing CUDA and data-parallel thinking, **not performance tuning**, and a direct port of the pseudocode should suffice. There is one trap. Launching N threads every round and using conditionals to decide who works performs badly (think about the last round of the up-sweep, where only two threads have work). A full-credit solution launches one thread per iteration of the innermost parallel loop.
- Grading uses random inputs via `-i random`. `--thrust` runs Thrust's implementation for comparison, and matching Thrust earns up to 2 points of extra credit.

## Part 3: the circle renderer (85 points)

### What the task asks

The renderer takes an array of circles (3D position, velocity, radius, color). The sequential algorithm for each frame: clear the image; update each circle's position; for each circle, compute its screen bounding box, and for each pixel in the box whose center lies inside the circle, compute the color and **blend** it into that pixel.

"Blend" is the crux. Circles are semi-transparent, stored as RGBA, and the formula is `result = C_alpha * C + (1 - C_alpha) * P`. The README stresses that this composition doesn't commute: X over Y looks different from Y over X, so circles must be drawn in the order the application provides (you can assume that order is by depth).

The starter code includes a sequential C++ reference, `refRenderer.cpp`, and an **incorrect** CUDA version, `cudaRenderer.cu`. That version assigns one circle to each CUDA thread. Its math is fully correct, but it has two major errors. The README says running the `rgb` and `circles` scenes shows horizontal streaks that change every frame.

### Two invariants

Your CUDA renderer must preserve two things the sequential version gets for free:

1. **Atomicity**: every image update must be atomic. The critical region covers reading the pixel's four 32-bit floats (RGBA), blending in the current circle, and writing the result back.
2. **Order**: updates to a pixel must follow **circle input order**. The README bolds a key observation: order constrains only updates to **the same pixel**. Circles that don't touch the same pixel have no ordering requirement and can be processed independently.

A solution that doesn't meet both requirements gets at most 12 points on Part 3. The README adds: "We have already given you such a solution!"

### The README's suggested sequence and hints

The README suggests three steps. First make the starter code logically correct in parallel (**it recommends an approach that needs no locks or synchronization**). Then find the performance problem in that solution. Then, in its words, the real thinking begins.

The hints, collected (these are directions the README itself gives, not solutions):

- There are two axes of parallelism: **across pixels** and **across circles** (the latter while respecting order). The README says solutions need both, possibly in different parts of the computation.
- The circle-intersects-box tests in `circleBoxTest.cu_inl` are your friend.
- `exclusiveScan.cu_inl` provides an exclusive scan in shared memory, but only for power-of-two lengths, and **the number of threads in the block must equal the array size**. The README says so in all caps and tells you to read the comments.
- `shadePixel` does several global memory operations per update. Consider accumulating in a register and writing once at the end.
- Thrust is allowed but not needed to reach reference performance. The README says one popular solution uses the provided shared-memory scan and another uses Thrust's prefix sum; both are valid.
- Is there data reuse in the renderer? How can you exploit it?
- CUDA has no primitive that performs the whole pixel update atomically. Building a lock from global memory atomics is one option, but even an atomic update must happen in the right order. The README's advice: **think about ordering first, and only then about atomicity, if it's still a problem at all**.
- `rand1M` and `micro2M` have many circles, so be careful that temporary structures don't exhaust device memory. If you don't check what `cudaMalloc` returns, the program keeps running and then fails the correctness check. The README supplies a `cudaCheckError` macro and suggests wrapping every CUDA API call while debugging. Kernel launches can't be wrapped; their errors surface at the next wrapped call.

### Grading

`./checker.py` runs the reference solution `render_ref` and your version on your machine. The eight graded scenes are `rgb`, `rand10k`, `rand100k`, `pattern`, `snowsingle`, `biglittle`, `rand1M`, and `micro2M`, 9 points each:

- 2 points for correctness (only image sizes that are multiples of 256 are tested).
- 7 points for performance, available only if correct: full marks for T ≤ 1.2 × T_ref, zero for T at 10× T_ref or more, and `7 × T_ref / T` in between.

That's 72 points in total. You also hand in a write-up: how you decomposed the work across blocks and threads (maybe even warps), where synchronization happens, what you did to reduce communication, what you tried along the way, and which measurements guided your optimization. Extra credit goes up to 10 points: up to 5 for significantly beating the required performance, and up to 5 for a high-quality parallel CPU-only renderer (with an analysis of how it differs from the GPU version).

The README's point breakdown contradicts itself in two places, so read carefully. The Grading Guidelines say the write-up is worth 18 points and the prefix sum 10. The summary list right below says the Part 3 write-up is 13 points, plus 5 for Part 1. And the sample score table in Part 2 shows scan out of 5 (find_repeats presumably being the other half). The summary list adds up to 5 + 10 + 13 + 72 = 100, which matches the 100 points in the title.

## Written 2: what the five graded problems practice

[Written Assignment 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf) runs 43 pages. The first half has five graded problems worth 20 points each; the second half has 14 PRACTICE PROBLEMs. Here I only name the concept each problem tests, with no answers.

| Problem | Grading | What it practices |
|---|---|---|
| 1. To Fuse or Not to Fuse | Correctness | A chain of `parallel_for` loops with a sequential max loop in the middle. A asks whether a 20× speedup is possible with infinite cores and bandwidth (Amdahl's law). B moves to a machine with 10 cores, 4 GB/s of bandwidth, and a shared 256 KB cache, lets you rewrite the program using `atomicMax`, and asks for the run time. The hints ask directly: is the program compute bound or bandwidth bound? Where can you fuse, and which dependency blocks fusion? |
| 2. SPMD and SIMD | Correctness | A: find the input that gives the worst SIMD utilization for an ISPC program with nested ifs and a gang size of 8. B: 1024 CUDA threads each take a random path down a depth-10 binary tree with a warp size of 32; find the SIMD utilization |
| 3. A Barrier is Worth a 1000 Locks | Correctness | 4 threads build a 10-bin histogram, all fighting over one lock for every increment. A asks what the performance problem is; B asks for a rewrite with no locks and a single `barrier()` |
| 4. Data-parallel thinking for graphs | Effort only | Using a graph in CSR form (`edgeStarts`, `edges`), compute the average of each vertex's neighbors using only gather, scatter, inclusive segmented scan, shiftLeft, and map. The problem calls it a graph version of the grid solver from class and a common operation in PageRank |
| 5. Particle simulation | Effort only | A dual-core O(N²) gravity computation uses symmetry to make only N²/2 calls but takes N² locks. A: halve the number of locks without new variables or changing the work split. B: find another major performance problem unrelated to lock count and propose a fix |

Problems 3 and 4 are almost direct extensions of Lecture 8. Problem 3 is "partial results plus merge" instead of a global lock, and Problem 4 is the gather-plus-segmented-scan sparse matrix recipe applied to graphs.

The 14 practice problems range wider: removing ISPC SIMD divergence with sort/scatter/transpose, divergence in a CUDA binary tree walk, the abstraction versus implementation of ISPC `foreach` and Cilk `cilk_spawn`, caches and LRU, Amdahl's law, roofline plots, asynchronous message passing, pipelining, and more. They aren't graded, but they make good review material.

## How to self-study it

1. Without a GPU, decide on a machine first: launch a `g5g.xlarge` at your own expense following `cloud_readme.md`, or use any NVIDIA GPU. Shut it down every time you finish.
2. Treat Parts 1 and 2 as warm-ups. The goal is to get comfortable with `cudaMalloc`, `cudaMemcpy`, kernel launches, and `cudaDeviceSynchronize()`, and to turn Lecture 8's scan pseudocode into working CUDA.
3. For Part 3, run `./render -r cuda rand10k` and `./render -r cpuref rand10k` side by side and see the errors with your own eyes.
4. Before writing code, write down on paper: is your unit of parallelism a pixel, a circle, or a region of the screen? How does each thread know which circles to process? How is order guaranteed?
5. Written 2 can run in parallel with PA3; the thinking in Problems 3 and 4 carries straight over to the renderer.

One thing you can do tonight: clone [asst3](https://github.com/stanford-cs149/asst3), read only `kernelRenderCircles` in `cudaRenderer.cu`, and write one sentence on why it violates both atomicity and order.

## Further reading

- Another course's introductory CUDA assignment: [CMU 11-868 Assignment 1: Writing MiniTorch's map, zip, reduce, and matmul in CUDA](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en)
- A different explanation of threads, blocks, and shared-memory tiling: [CMU 11-868 L02–L04 GPU Programming and Acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en)
- The environment requirements of all five assignments in one table: [Reading Stanford CS149 (series overview)](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Rechecked official sources; there is still no public recording matching this article, and a check date was added.

## References

- [stanford-cs149/asst3 README](https://github.com/stanford-cs149/asst3) — the three parts, points, hints, and checker
- [asst3 cloud_readme.md](https://github.com/stanford-cs149/asst3/blob/master/cloud_readme.md) — AWS `g5g.xlarge`, the AMI, T4G, and CUDA 12.8
- [Written Assignment 2 (PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf) — five graded problems and 14 practice problems
- [Stanford CS149 Fall 2025 homepage](https://gfxcourses.stanford.edu/cs149/fall25) — dates for PA3 and Written 2
- [CS149 Fall 2025 Course Info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo) — group rules and grade weights
- [Lecture 8 slide 17 (work-efficient scan)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/slide_17) — the scan algorithm the README cites
- [NVIDIA CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/) — the reference the README recommends, including the compute capability tables
- [CUDA Runtime API: memcpy synchronization behavior](https://docs.nvidia.com/cuda/cuda-runtime-api/api-sync-behavior.html) — the source of the README's note on `cudaMemcpy` synchronization
