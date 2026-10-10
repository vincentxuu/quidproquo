---
title: "CS149 L6 Locality, Communication, and Arithmetic Intensity: Why Moving Less Data Beats Adding Cores"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 7
tldr: "CS149 Lecture 6 asks you to read \"communication\" broadly: data moving between a processor and its cache, its memory, or another machine all counts. Modern parallel processors have far more compute than bandwidth, so arithmetic intensity (how much computation you do per unit of data moved) decides whether you can keep the hardware fed. The levers fall into three groups: change the assignment to cut inherent communication, use blocking and loop fusion to cut cache-induced communication, and spread out or stagger accesses to reduce contention."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 6: shared address spaces and NUMA, a message-passing grid solver, blocking vs. non-blocking send/recv and deadlock, the parallel system as an extended memory hierarchy, arithmetic intensity, inherent vs. artifactual communication, blocking and loop fusion, contention, and performance analysis with the roofline model and high watermarks."
draft: false
glossary:
  - term: "arithmetic intensity"
    definition: "The ratio of computation to communication, for example instructions executed per byte moved. Its inverse is the communication-to-computation ratio."
    context: "The central quantity of CS149 Lecture 6: modern parallel processors have a high ratio of compute to bandwidth, so low-intensity programs get stuck on bandwidth."
  - term: "artifactual communication"
    definition: "Communication the algorithm doesn't need but that arises from system implementation details, such as the minimum cache-line transfer size or limited cache capacity."
    context: "Lecture 6 splits communication into this kind and the inherent communication the algorithm requires."
  - term: "contention"
    definition: "When many requests hit the same resource within a short window, turning it into a hot spot and slowing every request down."
    context: "Lecture 6 illustrates it with students queuing at a professor's office hours; the fixes are replicating the resource or staggering access."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-locality-communication)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 offering of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 7 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and follows [Lecture 5, work distribution and scheduling](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en). It covers Lecture 6, "Program Optimization 2: Locality and Communication" (2025-10-09). The title inside the PDF adds one word: "Locality, Communication, and Contention."

The official source is the [Lecture 6 slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf) (68 pages, with a [slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)). Fall 2025 recordings aren't public; the homepage points to the 2023 version, here the [2023 Lecture 6 recording](https://www.youtube.com/watch?v=Mhdny2JNhmc). This post follows the 2025 slides and treats the video as a supplement. Access level **A3**.

Of the three goals from the previous post, this one tackles the second: **reduce communication**.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=Mhdny2JNhmc
title: CS149 2023 Lecture 6 recording (supplement)
```

Original videos: [CS149 2023 Lecture 6 recording (supplement)](https://www.youtube.com/watch?v=Mhdny2JNhmc)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)

## A shared address space is only an abstraction

So far the course has assumed all processors connect to one memory system that presents a single shared address space. Lecture 6 starts by reminding you that implementing this abstraction is complicated. A single "load the value at address X into R0" may pass through several cache levels before reaching DRAM.

The interconnects on the slides:

- Intel's **ring interconnect** (since Sandy Bridge): four rings carry request, snoop, ack, and data messages, and the L3 is split into slices attached to the ring. With each core accessing its local slice, theoretical peak bandwidth from cores to L3 at 3.4 GHz is about 435 GB/s.
- SUN Niagara 2's **crossbar**: every core connects directly to every L2 bank. The crossbar takes about the same area as one core.
- **NUMA**: in multi-socket systems, the latency of accessing a location differs by core, and so may the bandwidth. The slide notes you'll see NUMA behavior on a single socket too, because cache slices sit at different distances from each core.

In the shared-address-space model, threads communicate by reading and writing shared variables and using synchronization primitives such as locks and atomics. It is a natural extension of uniprocessor programming, but it needs hardware that lets any processor load and store any address, which gets costly to scale to many processors. The slides call this one reason high-core-count processors are expensive.

## Message passing: make communication explicit

The other abstraction is **message passing**. Each thread has a private address space, and sending and receiving messages is the only way to exchange data: `send` names the recipient, the buffer, and an optional tag; `recv` names the sender, the destination buffer, and the tag. The slides compare it to snail mail.

The hardware needn't implement one shared address space for everyone, only a way to move messages between nodes, so commodity machines can be connected into a large parallel machine. The slides call message passing the programming model for clusters and supercomputers.

### Rewriting the grid solver with messages

Lecture 4's grid solver (alternately update red and black cells until convergence) is split across four threads' address spaces when rewritten with messages. Each thread needs its neighbors' boundary rows to update, so it keeps two extra rows of **ghost cells**: cells replicated from a remote address space and "owned" by another thread.

Each iteration:

1. Send your top row to the thread above and your bottom row to the thread below
2. Receive the neighbors' ghost rows
3. Compute the update exactly as in the shared-memory version
4. Every thread sends its `my_diff` to thread 0, which checks convergence and sends `done` back

The slides note that computation uses local indexing, communication moves whole rows at a time (bulk transfer), and **synchronization is also done through sends and receives**.

### Blocking send/recv deadlocks

In the synchronous (blocking) version, `send()` returns only once the sender gets an acknowledgement that the data is in the receiver's address space, and `recv()` returns after copying the data in and sending that acknowledgement.

The slide asks what big problem the program above has with synchronous send/recv. The next slide, titled "fixed to avoid deadlock," gives it away: every thread sends first, a blocking `send` waits for the other side to receive, and everyone gets stuck in `send`. The fix keeps synchronous send/recv but has even-numbered threads send then receive, and odd-numbered threads receive then send.

The non-blocking (asynchronous) version:

- `send()` returns immediately, but the caller can't modify the buffer until the message goes out, since sending happens concurrently
- `recv()` only posts an intent to receive and returns immediately
- `checksend()` and `checkrecv()` report the actual status
- The caller can do other work while waiting

## Communication isn't just between machines

At this point the slides widen the definition: communication between cores, between a core and its cache, and between a core and memory all count.

They ask you to think of a parallel system as an **extended memory hierarchy**. From one processor outward: registers, L1, L2, another core's L2, L3, local memory, remote memory one network hop away, and remote memory N hops away. Farther out means higher latency, lower bandwidth, and more capacity. Any access a level can't satisfy becomes communication with the next level, so **locality matters at every level**.

Then the slides revisit the bandwidth-bound example from Lecture 3: the processor runs only 2 instructions per cache line loaded, the memory bus is transferring data 100% of the time, and the processor spends most of its time waiting. The slide asks you to convince yourself that in steady state, core utilization depends only on instruction throughput and memory throughput, not on memory latency or the number of outstanding requests.

## Arithmetic intensity

$$
\text{arithmetic intensity} = \frac{\text{amount of computation (e.g., instructions)}}{\text{amount of communication (e.g., bytes)}}
$$

Its inverse is the communication-to-computation ratio. The lecturer prefers arithmetic intensity because "higher is better" is more intuitive, and because it sounds cooler.

The key line: modern parallel processors have a high ratio of compute capability to available bandwidth, so **high arithmetic intensity is required to use them efficiently**. Adding cores only raises the numerator side's capacity. If each computation drags a pile of data with it, more cores just means more cores waiting on memory together.

### Two kinds of communication: inherent and artifactual

**Inherent communication** is data the algorithm fundamentally must move under a given assignment. Sending ghost rows in the message-passing solver is an example.

A good assignment reduces it. The slides compare three ways to split an N×N grid:

| Assignment | Computed per processor | Communicated per processor | Compute / communication |
|---|---|---|---|
| 1D blocked (a contiguous band of rows each) | ≈ N²/P | ≈ 2N | ∝ N/P |
| 1D interleaved (rows dealt round-robin) | | | = 1/2 |
| 2D blocked (square tiles) | N²/P | ∝ N/√P | ∝ N/√P |

With 2D blocking, communication cost grows **sub-linearly** in P, asymptotically better than 1D blocking, because the assignment captures the algorithm's 2D locality.

**Artifactual communication** is everything else, arising from system implementation details. The slides' examples:

- **Minimum transfer granularity**: the program needs one 4-byte float, but a whole 64-byte cache line must move, 16× more than necessary
- **Unnecessary operations**: the program stores 16 consecutive floats, and the whole line is loaded from memory, fully overwritten, and written back. The load was pointless, doubling the traffic
- **Finite capacity**: the cache is too small to keep data between uses, so the same data is moved several times (capacity misses)

The slides demonstrate the last case with the grid solver, assuming row-major layout, 4 elements per cache line, and a 24-element cache (6 lines). In row-by-row traversal, by the time the first output of row 2 is computed, the neighbors used earlier have been evicted, so the program loads three cache lines for every four output elements.

## Techniques for reducing communication

### Blocking: change the traversal order

Traverse the same grid in a blocked order so data is reused while it's still in cache. The slides' numbers go from three lines per four outputs to two lines per six outputs.

### Loop fusion: stop writing intermediates

Compute `E = D + ((A + B) * C)`. Written as three modular functions, `add`, `mul`, `add`, each loop does two loads and one store per math op, arithmetic intensity 1/3, and 1/3 overall.

```cpp
void fused(int n, float* A, float* B, float* C, float* D, float* E) {
  for (int i=0; i<n; i++)
    E[i] = D[i] + (A[i] + B[i]) * C[i];
}
```

Fused into one loop, it's four loads and one store per three math ops, arithmetic intensity 3/5. The slides note that the first style is more modular, like an array math library such as NumPy, while the second performs much better.

**Try this**: next time you see a chain of element-wise ops in PyTorch or NumPy, count how many intermediate arrays it creates. Each one is a full write out and read back. This is also where the layer fusion in [Lecture 9, DNNs on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) starts.

### Sharing: co-locate tasks that use the same data

Schedule threads that work on the same data structure at the same time on the same processor. This reduces inherent communication.

## Contention

The slides use office hours. They run 3:00 to 3:20 with no appointments; walking over takes 5 minutes and a question takes 5 minutes. If five students leave at once, the first spends 10 minutes, while one near the back of the line spends 23. With appointments (one at 3:00, one at 4:30), each spends only 10.

Definition: a resource can perform only so many transactions per unit time, whether it's memory, a communication link, a server, or a TA. When many requests arrive within a small window, it becomes a **hot spot**.

Two examples:

- **Updating a shared variable**: with flat communication, every processor updates it directly; latency is low without contention, but contention can be severe. Tree-structured communication reduces contention at the cost of higher latency when there's no contention.
- **Distributed work queues**: the one-queue-per-worker design from [Lecture 5](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en). No contention while everyone has work; only when your own queue is empty do you steal from a random one. The slide notes synchronization is fine at that point, since the thread would have sat idle anyway.

## Reducing communication cost: one table

The summary slide groups the levers into four categories:

| Goal | How |
|---|---|
| Cut overhead at sender and receiver | Send fewer, larger messages; coalesce small messages |
| Cut latency | Programmer: restructure code for locality. Hardware: improve the communication architecture |
| Cut contention | Replicate contended resources (local copies, fine-grained locks); stagger access |
| Overlap communication with computation | Programmer: async communication. Hardware: pipelining, multithreading, prefetching, out-of-order execution. This requires more concurrency in the application than there are execution units |

## Finding the bottleneck

The slides repeat: **always try the simplest parallel solution first, then measure.**

Then comes an analysis strategy. First decide whether you're limited by computation, memory bandwidth (or latency), or synchronization. Then establish "high watermarks": what's the best achievable in practice, and how close are you?

In the **roofline model**, the X axis is programs of different arithmetic intensity and the Y axis is the maximum instruction throughput achievable at that intensity. The diagonal region is bandwidth-limited; the flat region is compute-limited.

The slides list four hands-on experiments for estimating the dominant cost:

| Change | Watch for | What it tells you |
|---|---|---|
| Add more math instructions | Does runtime grow linearly with op count? | If so, the code is instruction-rate limited |
| Remove almost all math but keep the same loads | How much does runtime drop? | Not much suggests a memory bottleneck |
| Change every array access to `A[0]` | How much faster? | Upper bound on the benefit of better locality |
| Remove all atomics or locks | How much faster (with roughly the same work)? | Upper bound on the benefit of less synchronization |

A footnote warns that computation, memory access, and synchronization are almost never perfectly overlapped, so overall performance is rarely set by just one. These experiments measure **sensitivity**.

You can also read hardware performance counters (instructions completed, clock ticks, L2/L3 hits and misses, bytes read from the memory controller, and more). The slides show Intel's Performance Counter Monitor C++ API and mention Intel VTune, PAPI, and oprofile. The OS "CPU usage" graph only shows the fraction of time threads were scheduled on cores, which isn't much help for tuning.

## Bonus: problem size can fool you

The bonus section at the end covers scaling pitfalls:

- **What you compare against**: the parallel algorithm may converge more slowly. Using the parallel version on one core as the baseline makes speedup look better, a common pitfall. Compare against the best sequential program.
- **Too small a problem**: a 258×258 grid on a 32-processor SGI Origin 2000 gives each processor about 310 cells. The communication-to-computation ratio is too high, and there's no speedup, even a slight slowdown. Plugging into the 2D-blocked formula: small N or large P means low arithmetic intensity.
- **Super-linear speedup**: a 1K×1K grid gives each processor about 32K cells. With enough processors, each tile's working set fits in its cache, and speedup exceeds linear. Conversely, when a problem is too big for one machine's memory and thrashes to disk, the speedup on a bigger machine looks spectacular.

The takeaway: evaluating a machine with a fixed problem size can mislead, and scaling the problem with the machine is often more realistic.

## What this post can and cannot confirm

Confirmed: the contents of the Lecture 6 slide PDF and the lecture date. The numbers here (435 GB/s, 1/3 and 3/5, 310 and 32K cells) all come from the slides. Not confirmed: anything said in the Fall 2025 classroom, and page-level differences between the 2023 recording and the 2025 slides. This post was not written from the video.

Further reading: for cache and memory-hierarchy basics, start with [CS107 on caching and the memory hierarchy](/posts/learning/2026-08-22-stanford-cs107-caching-memory-hierarchy-en). For the same bandwidth-and-fusion thinking on GPUs, compare [CS336 on GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en).

Series navigation: previous, [Lecture 5: work distribution and scheduling](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en) | next, [PA2: building a task execution library from scratch](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en) | [series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 course homepage and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 6: Program Optimization 2: Locality and Communication (slide PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt2/06_progperf2.pdf)
- [Lecture 6 slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt2/)
- [CS149 2023 Lecture 6 recording (supplement)](https://www.youtube.com/watch?v=Mhdny2JNhmc)
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
