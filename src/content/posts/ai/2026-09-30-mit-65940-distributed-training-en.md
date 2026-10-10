---
title: "MIT 6.5940 L19–L20 Distributed Training: Split the Model When Memory Runs Out, Compress Gradients When Bandwidth Does"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, distributed-training, parallelism, zero]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 22
tldr: "GPT-3's fp16 weights alone take 350GB, which does not fit on an 80GB A100, never mind gradients and Adam state. Lecture 19 covers how to split: data parallelism, ring all-reduce, ZeRO-1/2/3 (pushing the largest trainable model per 80GB GPU from 5B to 320B), GPipe raising pipeline utilization from 25% to 57%, Megatron-style tensor parallelism, and sequence parallelism with Ulysses and Ring Attention. Lecture 20 covers the communication bottleneck that follows: Alpa's automatic strategy search, DGC compressing gradients 277–608x without losing accuracy, TernGrad's three-value gradients, and DGA, which hides network latency behind delayed updates."
description: "A guide to Lectures 19 and 20 of MIT 6.5940 Fall 2024, Distributed Training: data, pipeline, tensor, and sequence parallelism; parameter server versus all-reduce bandwidth; the memory arithmetic of ZeRO-1/2/3 and FSDP; GPipe micro-batching; Megatron-LM's FFN and attention partitioning; DeepSpeed Ulysses and Ring Attention; hybrid parallelism and Alpa; bandwidth and latency bottlenecks; Deep Gradient Compression, PowerSGD, 1-bit SGD, TernGrad, and Delayed Gradient Averaging."
draft: false
glossary:
  - term: "all-reduce"
    aliases: ["AllReduce"]
    definition: "Every worker holds a tensor; when the operation finishes, every worker has the sum (or average) of all of them. Data-parallel training uses it to synchronize gradients, and the ring implementation keeps per-node bandwidth constant as the number of nodes grows."
    context: "MIT 6.5940 Lecture 19 slides, pages 47 and 53–57."
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimizer", "ZeRO-1/2/3"]
    definition: "DeepSpeed's memory optimization for data parallelism: shard the optimizer state (ZeRO-1), then also gradients (ZeRO-2), then also weights (ZeRO-3) N ways across GPUs, removing the redundancy of every GPU holding a full copy. PyTorch's FSDP implements ZeRO-3."
    context: "MIT 6.5940 Lecture 19 slides, pages 68–73."
  - term: "Deep Gradient Compression"
    aliases: ["DGC"]
    definition: "Send only the largest gradients and accumulate the rest locally for later; add momentum correction (accumulate velocity, not gradients), local gradient clipping, and warm-up, so training still converges to the original accuracy at 99.9% gradient sparsity."
    context: "MIT 6.5940 Lecture 20 slides, pages 26–52; from Lin et al., ICLR 2018."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-distributed-training)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on Lecture 19 (2024-11-12) and Lecture 20 (2024-11-14) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec19-Distributed-Training-I.pdf](https://www.dropbox.com/scl/fi/85ud2gzrtyllgeqgpv9gs/Lec19-Distributed-Training-I.pdf?rlkey=80t52w3peqqf8oanpc6ojmvnf&st=jn4yxsjy&dl=0) (103 pages), [Lec20-Distributed-Training-II.pdf](https://www.dropbox.com/scl/fi/c0w7j7dxduuf8ply7lzeb/Lec20-Distributed-Training-II.pdf?rlkey=ynh3yx4jf99nojklt0ki7zh0y&st=vxzkzdt4&dl=0) (76 pages), and two recordings ([L19](https://www.youtube.com/watch?v=LcOM-nZdqxw), [L20](https://www.youtube.com/watch?v=lOVcPooetrM)). "L19 page N" refers to the PDF page. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides and video are public; neither lecture has a lab, so what you cannot get from outside MIT is Canvas and Piazza.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) keeps both lectures (Part I on November 17, Part II on November 19), and its course description adds "model serving" to the topic list. As of 2026-09-30, slides and video for both are empty links.

**Series position**: Previous [Lecture 18: Efficient Diffusion Models](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en) | Next [Lecture 21: On-Device Training and Transfer Learning](/posts/ai/2026-09-30-mit-65940-on-device-training-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

These two lectures open the course's Chapter III: Efficient Training. The previous seventeen lectures made inference cheaper; now the target is training.

The table on L19 page 6 shows why distribution is unavoidable. On an A100, training ResNet-50 takes 31 GPU hours and GPT-3 takes 3.1 million, which works out to 355 years on a single GPU. Page 8 puts it more directly: a 10-GPU-day job could ideally finish in 14 minutes on 1024 GPUs, and the research cycle speeds up accordingly.

Page 10 is HAN Lab's own example: training the video model TSM on the Summit supercomputer. One node (6 GPUs) takes 49 hours 50 minutes; 256 nodes (1536 GPUs) take 14 minutes, with almost no change in accuracy (74.1% vs 74.0%).

But "add more GPUs" runs into two problems, one per lecture:

- **The model does not fit on one GPU**: you have to split it (L19).
- **Once split, GPUs have to talk to each other**: communication becomes the bottleneck (L20).

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=LcOM-nZdqxw
title: EfficientML.ai Lecture 19 - Distributed Training Part 1 (MIT 6.5940, Fall 2024)
```

```youtube
url: https://www.youtube.com/watch?v=lOVcPooetrM
title: EfficientML.ai Lecture 20 - Distributed Training Part 2 (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 19 - Distributed Training Part 1 (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=LcOM-nZdqxw), [EfficientML.ai Lecture 20 - Distributed Training Part 2 (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=lOVcPooetrM)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): For L19 I read the opening agenda, the keyword hits for ZeRO/FSDP, pipeline, tensor and sequence parallelism, and the ending. The video mentions 1,000+ V100s on the Summit supercomputer, about 3 million GPU hours for GPT-3 and about 14 minutes on 1,024 GPUs, consistent with the figures at the start of this post. For L20 I read the opening and closing summary: hybrid/2D/3D parallelism and auto-parallelization, the bandwidth and latency bottlenecks, gradient compression (deep gradient compression) and gradient quantization, delayed gradient averaging, and the 8-node Raspberry Pi experiment. Both lectures match this post's topics and lecture numbers. Page numbers and slide figures follow the slides and were not checked sentence by sentence against the video.

## Four ways to split

L19 pages 12–31 run through four kinds of parallelism, and L20 page 4 summarizes the trade-offs:

| Parallelism | What it splits | Model copies | Utilization | Memory cost | Communication |
|---|---|---|---|---|---|
| Data | the data | N | high | high | low |
| Pipeline | the model, by layer | 1 | low | low | medium |
| Tensor | the model, by tensor | 1 | high | low | high |
| Sequence | the data, by token | — | — | — | extra in attention layers |

Data parallelism's memory problem can be addressed with ZeRO/FSDP. No row wins on all three columns, so real systems end up mixing them (see the L20 section).

## Data parallelism: from parameter server to all-reduce

Pages 33–42 use the [parameter server (Li et al., OSDI 2014)](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/li_mu) to walk through data parallelism in five steps: replicate the model to every worker, split the data randomly and evenly, compute gradients locally, push gradients to the server to be summed, and update the weights on the server. Page 42 notes that compared with single-node training, this adds two synchronization points.

Pages 44–47 introduce the communication primitives: send/recv, scatter/gather, reduce/broadcast, all-reduce/all-gather. Page 50 has you redescribe the parameter server in these terms: pulling the model is a broadcast, pushing gradients is a reduce.

The problem is bandwidth. Pages 52–53 work out that each worker needs O(1) bandwidth but the server needs O(N), growing linearly with the number of workers. Can you drop the central server? Yes, with all-reduce. Page 57 compares implementations:

| Approach | Time | Peak per-node bandwidth | Total bandwidth |
|---|---|---|---|
| Parameter server | O(1) | O(N) | O(N) |
| All-reduce, sequential | O(N) | O(N) | O(N) |
| All-reduce, ring | O(N) | O(1) | O(N) |
| All-reduce, fully parallel | O(1) | O(N) | O(N²) |

Ring brings peak bandwidth down to O(1) but takes N steps. Recursive halving on pages 58–66 (from MPICH's collective-communication optimizations) has each node exchange with neighbors at distance 1, then 2, then 4, finishing in log(N) steps for N workers.

## ZeRO: why data parallelism eats memory

Page 68: GPT-3 175B needs 350GB just for its fp16 weights, far beyond an A100's 80GB, and training also stores gradients and optimizer state.

Page 69 uses [ZeRO's (Rajbhandari et al.)](https://arxiv.org/abs/1910.02054) accounting for bytes per parameter: 2 for weights, 2 for gradients, and 12 for Adam's optimizer state (an fp32 copy of the weights, momentum, and variance). Plain data parallelism keeps all 16 bytes on every GPU, so an 80GB GPU can train at most a 5B-parameter model.

ZeRO shards the redundant parts N ways. Pages 70–73 compute it with N=64:

| Stage | What gets sharded | Bytes per parameter | Largest trainable model on 80GB |
|---|---|---|---|
| Plain data parallel | nothing | 2 + 2 + 12 | 5B |
| ZeRO-1 | optimizer state | 2 + 2 + 12/N | 19B |
| ZeRO-2 | + gradients | 2 + 2/N + 12/N | 36B |
| ZeRO-3 | + weights | (2 + 2 + 12)/N | 320B |

Page 73 adds that ZeRO-3 in PyTorch is FullyShardedDataParallel, or FSDP.

## Pipeline parallelism: split by layer, then fill the bubbles

Page 75 switches direction: instead of splitting data, split the model. 350GB across 8 GPUs is 43.75GB each, which fits.

The problem is the timeline on page 78. The forward pass moves layer by layer, the backward pass comes back, and only one GPU is computing at any moment. For a 4-layer network, theoretical utilization is only 25%.

[GPipe (Huang et al.)](https://arxiv.org/abs/1811.06965) on pages 79–80 splits each batch into micro-batches, for example [16, 10, 512] into four [4, 10, 512]. The first GPU hands off the first micro-batch as soon as it is done and starts on the second, so several GPUs work at once. In the same example utilization rises to 57%, 2.5x the original; more micro-batches mean higher utilization.

## Tensor parallelism: split the matrices so every GPU is busy

Page 82 says pipeline parallelism still leaves idle time even with micro-batches. Can you split more finely? Tensor parallelism splits a single weight matrix into N chunks.

Pages 83–90 walk through a Transformer using [Megatron-LM's (Shoeybi et al.)](https://arxiv.org/abs/1909.08053) partitioning:

- **FFN**: split the first linear layer by **columns**, broadcast the input to every GPU, and each computes a slice. Split the second linear layer by **rows**; each GPU multiplies its part and a single all-reduce sums the results (pages 85–87). No communication is needed between the two layers.
- **Attention**: split the QKV projection by columns so each GPU gets a subset of heads; softmax(QKᵀ)V runs locally with no communication; split the output projection by rows and all-reduce at the end (pages 88–90).

Page 87's conclusion: as long as communication is not the bottleneck, GPUs can be fully utilized. That "as long as" is what L20 deals with.

## Sequence parallelism: split tokens when context gets long

Pages 30–31 contrast the two: data parallelism splits the batch, sequence parallelism splits tokens, which helps once context exceeds 100K. Page 92 names the difficulty. Splitting tokens in FC layers is just like data parallelism, but in attention every query needs every key and value.

The slides offer two solutions:

- **[DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)** (page 93): split by token in FC layers, then use all-to-all before attention to redistribute by head.
- **[Ring Attention](https://arxiv.org/abs/2310.01889)** (pages 94–96): each GPU keeps its own queries while key/value blocks travel around a ring, computing as they go.

This ties into [Lecture 15 on long context](/posts/ai/2026-09-30-mit-65940-long-context-llm-en): this is one of the bottlenecks in training long-context models.

## L20: hybrid parallelism and automatic search

L20 pages 5–8 show several combinations: data plus pipeline parallelism (an example from the DeepSpeed tutorial), pipeline outside with tensor inside (Megatron-LM's GPU-cluster training), and 3D parallelism that adds data parallelism on top. Page 7 is HAN Lab's [LongVILA](https://arxiv.org/abs/2408.10188): within a node, where bandwidth is high, it uses all-to-all redistribution; between nodes it uses Ring Attention, so each level uses what it does best.

With so many combinations, picking a strategy by hand gets hard. Page 9 reframes the problem into two kinds: inter-operator (like pipeline, placing different operators on different GPUs) and intra-operator (like tensor parallelism, splitting a single operator). [Alpa](https://arxiv.org/abs/2201.12023) on pages 10–14 searches at two levels: the outer level uses dynamic programming to divide stages, and the inner level uses 0-1 integer linear programming to choose each operator's partitioning, with a cost that includes compute, communication, and resharding between operators. Page 14 reports that it matches specialized hand-tuned systems and beats a manual baseline by up to 8x.

## Why communication is the bottleneck: bandwidth and latency are different problems

Pages 17–18 list the causes: every step needs synchronization, larger models transfer more data, and more nodes make all-reduce take longer.

Pages 19–22 isolate latency. Within a rack or a data center, latency barely affects training. Over a home wireless connection, training is 1.4x slower; across the globe, 3.5 to 5.8x slower.

Pages 62–64 separate the two: **bandwidth is easy to improve, latency is hard**. You can raise bandwidth by compressing gradients or by upgrading hardware (home routers at 100Mbps–1Gbps, fiber switches at 1–25Gbps, InfiniBand at 20–400Gbps). Latency hits physical limits: even at the speed of light, Shanghai to Boston takes 162ms. So L20 takes two paths: compress gradients for bandwidth, delay updates for latency.

## Compressing gradients, part 1: prune the small ones (DGC)

Pages 26–28 start from [sparse communication (Aji & Heafield 2017)](https://arxiv.org/abs/1704.05021): send only the largest gradients and keep the rest locally to send later. It works for simple networks, but ResNet-110 on CIFAR-10 loses a full point (93.75% to 92.75%).

Page 29's diagnosis is one word: **momentum**. Pages 36–40 show why. If you feed the accumulated gradients straight into momentum, the optimization trajectory no longer matches plain momentum SGD. [Deep Gradient Compression (Lin et al.)](https://arxiv.org/abs/1712.01887) fixes this by **accumulating velocity instead of gradients** (pages 41–43). It adds warm-up too: the learning rate ramps up over the first few epochs, and sparsity increases exponentially rather than all at once (pages 44–46).

The ablation on page 47 separates each technique's contribution (8 GPUs, ResNet-110, CIFAR-10):

| Setting | Top-1 |
|---|---|
| Baseline | 92.92 |
| Naive gradient pruning | does not converge |
| + local gradient accumulation | 91.36 |
| + local accumulation + momentum correction | 92.56 |
| + local accumulation + warm-up | 91.89 |
| DGC (all combined) | 93.28 |

Pages 49–51 give compression ratios: AlexNet's gradients shrink from 232.56MB to 0.39MB (597x), VGG 277x, a language model 462x, speech recognition 608x, with no accuracy loss. Page 49 also asks why it stops short of 1000x: the sparse format has to store indices, and biases are not pruned.

Page 52 raises a practical issue: sparse gradients get denser during all-reduce, because each node keeps different positions. [PowerSGD](https://arxiv.org/abs/1905.13727) on pages 53–54 switches to low-rank factorization; the matrix dimensions are the same on every machine, so nothing gets denser.

## Compressing gradients, part 2: quantize them

Pages 57–60 cover three approaches:

- **1-bit SGD** (Seide et al., 2014): keep only each gradient's sign, with a column-wise scaling factor, and carry the quantization error into the next step.
- **Threshold quantization** (Strom, 2015): a preselected threshold τ serves as both the threshold and the reconstruction value. It also accumulates error, and τ has to be chosen empirically.
- **[TernGrad](https://arxiv.org/abs/1705.07878)**: quantize each gradient to 0, +1, or −1 with probability |gᵢ|/max(g), so the expectation equals the original gradient and no error accumulation is needed.

Page 55 sums up the pruning family in one line each: plain sparsification only reaches low sparsity; DGC reaches 99.9% with momentum correction, gradient clipping, and warm-up; PowerSGD uses low rank instead.

## Handling latency: Delayed Gradient Averaging

The problem on pages 65–68: in synchronous SGD, each worker has to wait for communication to finish before its next step. When latency is long, most of the time goes to waiting. The slides pose it as an analogy: could gradients be turned in late?

[DGA (Zhu et al., NeurIPS 2021)](https://hanlab.mit.edu/projects/dga) on pages 69–71 delays receiving the step-i average until step i+D. A worker sends its gradient and keeps doing local updates, so computation covers the communication.

Applying stale gradients directly hurts accuracy, so page 72 adds a correction term: take the new local gradient, subtract the local gradient from D steps ago, and add the global average from D steps ago. Page 72 checks the correction on ResNet-18 and CIFAR-10:

| Delay D | Without correction | With correction |
|---|---|---|
| 5 | 88.7 | 89.2 |
| 10 | 86.9 | 89.3 |
| 15 | 85.5 | 89.0 |
| 20 | 84.2 | 88.7 |

The real-hardware test on page 74 uses 8 nodes. DGA is 7.1x faster on a vision task and 7.5x on a language task, compared with 3.8x and 4.2x for FedAvg (K=10).

<details>
<summary>DGA's update rule (pages 71–72)</summary>

```python
G = {}
for iter in range(1, max_iters + 1):
    g = grad(net, data)
    send(g, id=iter)
    G[iter] = g
    avg_g = recv(id=iter - D)        # the global average sent D steps ago arrives now
    W = W - lr * (g - G[iter - D] + avg_g)
```

`g - G[iter-D]` is how the local gradient changed over those D steps; `avg_g` brings in the other nodes' information.
</details>

## What you can do after these lectures

- **Tonight**: take a model you are training (or want to train) and apply the 16 bytes per parameter from L19 page 69. Does your GPU hold the weights, gradients, and optimizer state? If not, what do ZeRO-1, 2, and 3 bring it down to? That tells you directly which FSDP setting to use.
- Run two-GPU DDP in PyTorch with the profiler on and see what share of each step goes to all-reduce; then shrink the batch size and watch how the share changes.
- To build these parallel schemes yourself: [CS336 Lecture 7: Build Data, Tensor, and Pipeline Parallelism from Collectives](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), then [Lecture 8: Align ZeRO, FSDP, and 3D Parallelism with Hardware Topology](/posts/ai/2026-08-22-cs336-parallelism-strategies-en).

## Further reading

- [CMU 11-868 Lectures 14–15: distributed training and data parallelism](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en)
- [CMU 11-868 Lecture 18: how ZeRO shards data-parallel memory](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en)
- [CMU 11-868 Lectures 16–17: split layers, matrices, or experts](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)
- Gradient pruning follows the same logic as weight pruning in Lectures 3–4: [Lecture 3 on pruning granularity and criteria](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. L19 and L20 match the topics and lecture numbers, and the sampled figures agree, so the body text is unchanged.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 19 and 20 dates, slides, and video links
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — both lectures scheduled for November 17 and 19; materials not yet released
- [Lec19-Distributed-Training-I.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/85ud2gzrtyllgeqgpv9gs/Lec19-Distributed-Training-I.pdf?rlkey=80t52w3peqqf8oanpc6ojmvnf&st=jn4yxsjy&dl=0)
- [Lec20-Distributed-Training-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/c0w7j7dxduuf8ply7lzeb/Lec20-Distributed-Training-II.pdf?rlkey=ynh3yx4jf99nojklt0ki7zh0y&st=vxzkzdt4&dl=0)
- [EfficientML.ai Lecture 19 - Distributed Training Part 1 (YouTube)](https://www.youtube.com/watch?v=LcOM-nZdqxw)
- [EfficientML.ai Lecture 20 - Distributed Training Part 2 (YouTube)](https://www.youtube.com/watch?v=lOVcPooetrM)
- [Li et al., Scaling Distributed Machine Learning with the Parameter Server (OSDI 2014)](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/li_mu)
- [Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Huang et al., GPipe](https://arxiv.org/abs/1811.06965)
- [Shoeybi et al., Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Jacobs et al., DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)
- [Liu et al., Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Chen et al., LongVILA](https://arxiv.org/abs/2408.10188)
- [Zheng et al., Alpa (OSDI 2022)](https://arxiv.org/abs/2201.12023)
- [Aji & Heafield, Sparse Communication for Distributed Gradient Descent](https://arxiv.org/abs/1704.05021)
- [Lin et al., Deep Gradient Compression (ICLR 2018)](https://arxiv.org/abs/1712.01887)
- [Vogels et al., PowerSGD](https://arxiv.org/abs/1905.13727)
- [Wen et al., TernGrad](https://arxiv.org/abs/1705.07878)
- [Zhu et al., Delayed Gradient Averaging (NeurIPS 2021, MIT HAN Lab project page)](https://hanlab.mit.edu/projects/dga)
