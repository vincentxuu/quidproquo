---
title: "CMU 11-868 L16–L17: When a Model Won't Fit on One GPU — Split Layers, Matrices, or Experts"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, parallelism, moe, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 12
tldr: "CMU 11-868 (Spring 2026) spends two lectures on models too big for one GPU. L16 covers pipeline parallelism, which splits layers (GPipe micro-batches, 1F1B, interleaved stages), and tensor parallelism, which splits matrices (Megatron-LM's cuts for FFN, attention, and embeddings). The rule of thumb: TP inside a node, PP across nodes, DP on top. L17 treats MoE as a third way to split: each GPU holds different experts and replicates everything else. The price is all-to-all communication and load balancing, shown through GShard, DeepSpeed-MoE, and DeepSeek-V3."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L16 Model Parallel Training and L17 System for MoE Models: why naive pipelines sit idle, GPipe micro-batches and the bubble, gradient checkpointing, PipeDream 1F1B, Megatron-LM's interleaved schedule and tensor parallelism, how to combine TP/PP/DP, and MoE seen as expert parallelism: all-to-all, load-balancing losses, DeepSpeed-MoE inference optimizations, and DeepSeek-V3's MoE configuration."
draft: false
glossary:
  - term: "pipeline bubble"
    aliases: ["bubble"]
    definition: "Time in pipeline parallelism when a device sits idle, waiting for upstream outputs or downstream gradients. GPipe shrinks it by splitting each batch into micro-batches."
    context: "L16 gives the bubble fraction as O((K−1)/(M+K−1)), where K is the number of partitions and M the number of micro-batches."
  - term: "expert parallelism"
    aliases: ["EP"]
    definition: "Placing different experts of an MoE layer on different devices while replicating the non-expert parts (attention, embeddings). Tokens travel to the device holding their chosen expert via all-to-all."
    context: "L17 cites GShard as the reference design."
  - term: "all-to-all"
    definition: "A collective in which every participant sends a different slice of its data to every other participant. MoE uses it to dispatch tokens to experts and to collect the results."
    context: "L17 notes that expert parallelism needs fast all-to-all, whose latency grows linearly with the number of devices."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)

> **This guide follows the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is part 12 of [Reading CMU 11-868 LLM Systems](/en/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en). The previous post covered [data parallelism](/en/posts/ai/2026-09-30-cmu11868-data-parallel-training-en): every GPU holds a full model copy and gets a slice of the data. This post covers the case data parallelism can't handle: **one full copy of the model doesn't fit on a single GPU.**

These two lectures are Week 10 of the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus): "Distributed Model Training III" on 3/16 ([L16 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf), 36 pages) and "Large models with Mixture-of-Expert" on 3/18 ([L17 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-17-MoE-3aa3125f9ccdd4bb7109ef077fbe9260.pdf), 38 pages). Lei Li teaches both. The course has no public recordings, so everything below comes from the slides and the readings on the Syllabus. Page numbers are PDF pages; the numbers printed in the slide corners run one to three higher in the second half of both decks.

## The big picture: three ways to split

L16 page 4 defines model parallelism as partitioning the model's computation (forward, backward, update) across workers, in two flavors: by layer and by tensor. A footnote on the same page defers the more advanced expert parallelism to later, which means L17.

| Split | What gets split | What each GPU holds | Main cost | Course reading |
|---|---|---|---|---|
| Pipeline parallelism | Layers (horizontal split) | A contiguous block of layers | Bubbles (idle time), activation memory | [GPipe](https://arxiv.org/abs/1811.06965), PipeDream |
| Tensor parallelism | A single matmul | Part of every layer's weights | Collectives in every layer; usually intra-node | [Megatron-LM](https://arxiv.org/abs/2104.04473) |
| Expert parallelism | The experts in an MoE layer | Some experts plus replicated everything else | All-to-all, load imbalance | [GShard](https://openreview.net/forum?id=qrwe7XHTmYb), [DeepSpeed-MoE](https://arxiv.org/abs/2201.05596) |

I built this table from the two decks; it is not a slide.

## L16, part 1: pipeline parallelism splits layers

### The problem: the naive split keeps one GPU busy

The naive model parallelism on page 5 puts layers 0–3 on dev0–dev3. Each GPU finishes and hands its output to the next over NCCL send/recv. The slide asks "Any disadvantage?" and answers on the same page: **at any moment, all but one GPU is idle.**

Page 8 lists three limits of the naive pipeline:

1. Low GPU utilization: only one device works at a time
2. No overlap of compute and communication: GPUs wait while intermediate results are sent
3. High memory demand: the first GPU keeps all activations until the whole batch finishes

### The intuition: cut the batch into small pieces and keep them flowing

[GPipe](https://arxiv.org/abs/1811.06965) (pages 9–11) splits a mini-batch into smaller micro-batches. The first GPU sends micro-batch 1 downstream as soon as it's done and starts on micro-batch 2, so downstream GPUs get work quickly. The slides make two points: batch size is usually set by GPU memory and should be as large as possible, while a micro-batch can be much smaller. GPipe's schedule runs **forward for every micro-batch before starting any backward**.

### The mechanism: three bills — bubble, communication, memory

Page 11 uses three symbols: K partitions (devices), M micro-batches, L layers.

- **Bubble fraction** is O((K−1)/(M+K−1)). The slide says it becomes negligible when M > 4 × K.
- **Communication** happens only at partition boundaries: activation tensors are passed along.
- **Peak activation memory** drops from O(N × L) to O(N + L/K × N/M), with gradient checkpointing.

Pages 13–14 add gradient checkpointing (citing Chen et al. 2016). Vanilla backprop uses O(n) activation memory and O(n) compute. The most memory-frugal version stores O(1) but costs O(n²) compute. The middle ground caches activations every √n layers and recomputes from the nearest checkpoint during backward, keeping compute at O(n). In GPipe, each device stores only its output activations in forward and recomputes its own segment in backward.

### Two improvements: 1F1B and interleaved stages

Page 15 names GPipe's remaining problem. Running all forwards first means many micro-batches are "in flight" (forward done, backward not yet). The slide's example has 8, and all 8 sets of activations must be stored.

- **1F1B** (page 16, PipeDream-Flush, Narayanan et al., SOSP 2019) starts backward as soon as possible, alternating one forward with one backward. In the slide's example, at most 4 micro-batches are in flight (assuming backward takes twice as long as forward), versus 8 for GPipe. The savings are in activation memory.
- **Interleaved stages** (page 17, citing [Megatron-LM, SC 2021](https://arxiv.org/abs/2104.04473)) cut the layers into smaller chunks and give each device two non-contiguous blocks. With 16 layers on 4 devices, Device 1 gets layers 1–2 and 9–10. Each chunk is smaller, and each device runs two forward/backward stages per batch. The paper's abstract reports a throughput gain of more than 10% at a memory footprint comparable to existing schedules.

<details>
<summary>Code on the slides: a GPipe schedule and PyTorch pipelining (pages 18–24)</summary>

Pages 18–20 quote `minibatch_steps` from [shallowspeed](https://github.com/siboehm/shallowspeed). It yields forward commands for every micro-batch, then backward commands in reverse order, and only then `OptimizerStep()`. In the forward commands, the first stage loads the micro-batch from disk, every other stage calls `RecvActivations()` first, and every stage except the last calls `SendActivations()` afterward (marked non-blocking on the slide). In backward, the last micro-batch interleaves backprop with AllReduce; the others only accumulate gradients.

Pages 21–24 show PyTorch's [`torch.distributed.pipelining`](https://pytorch.org/docs/main/distributed.pipelining.html). Build the full Transformer on the meta device, delete the layers a stage doesn't need, and wrap the rest in a `PipelineStage`. Then create `ScheduleGPipe(stage, n_microbatches)`. Rank 0 calls `schedule.step(x)` with the whole batch, which gets split into micro-batches automatically.

</details>

## L16, part 2: tensor parallelism splits matrices

### The problem and the intuition

Page 26 starts with one matmul, A × B = C. Split B by columns into B1 and B2 on two GPUs, compute C1 and C2 separately, then AllGather them back into C. How you split decides where you must communicate.

### The mechanism: how each part of a Transformer is split

- **FFN** (pages 27–28): if you split both the input X and the first weight A, you need an all-reduce to get XA before GeLU. Megatron instead splits A by columns into [A1, A2] and B by rows into [B1; B2]. Each GPU computes GeLU(X·A1) or GeLU(X·A2) on its own, so **computing Y needs no all-reduce**. The results only merge at Z = Y1·B1 + Y2·B2.
- **Self-attention** (page 29): split the weights by columns, which means by heads. The slide notes no all-reduce is needed.
- **Embeddings** (page 30): the input embedding is split by columns and needs an all-reduce. The output embedding is also split by columns and fused with the cross-entropy loss, which the slide says cuts communication a lot, though an all-gather is still needed.
- **LayerNorm, dropout, residuals** (page 31): duplicated on every GPU; each worker optimizes its own copy.

### Rules for combining them

Pages 32–34 quote two takeaways from Megatron-LM:

1. On servers with g GPUs, use tensor parallelism up to degree g, then use pipeline parallelism to scale across servers. The slide's one-liner: TP for in-node parallel computing.
2. When combining data and model parallelism, choose a total model-parallel size M = t · p (t for TP, p for PP) large enough that parameters and intermediate data fit in GPU memory, then use data parallelism to scale to more GPUs.

Page 32 adds that the PP and TP degrees depend on the model architecture and the GPU server configuration. The summary on page 35 contrasts them: PP splits by layer and focuses on eliminating bubbles and interleaving forward and backward; TP splits the matmul across GPUs, usually within one node.

## L17: MoE as a third way to split

### Why MoE

L17 pages 3–4 argue that dense models are getting hard to scale and that compute is the main obstacle to training huge models. Sparse models can raise quality without raising training cost, and MoE is one kind. The slides claim MoE pretrains much faster than dense models and infers faster than a dense model with the same parameter count.

The definition on page 5: replace the Transformer's FFN with several small experts (each a network such as an FFN), plus a gating network that picks which expert to activate for each token. The slide warns not to confuse this with the older learning algorithm of the same name, which learns a weighted average of predictors.

This post covers the modeling side (router formulas, [Switch Transformer](https://arxiv.org/abs/2101.03961)'s top-1 routing, where shared experts came from) only as far as the systems story needs. The points from pages 6–13:

- In Switch Transformer, a token passes through only one selected FFN (page 6), with top-k gating (page 7)
- Shared experts (page 8): one always-on shared FFN captures common knowledge, and routed experts capture token-specific knowledge. The slide says the idea first appeared in DeepSpeed-MoE and was later adopted by DeepSeek MoE
- Each layer activates different experts (page 9)
- Counting parameters (page 10): Mixtral 8x7B is 47B, not 56B, because only the FFNs are experts; attention and embeddings are shared

For the modeling side of MoE, see the site's [CS336 attention and MoE guide](/en/posts/ai/2026-08-22-cs336-attention-moe-en) and [Why the MoE architecture wins](/en/posts/ai/2026-08-26-moe-architecture-why-it-wins-en).

### The mechanism: expert parallelism

Pages 15–16 cite GShard (Lepikhin et al., ICLR 2021) for how to train MoE:

1. **One expert per device** (Expert 1 on GPU1, and so on)
2. **Replicate everything else**: every GPU has the embeddings, attention, and router
3. **Two all-to-alls**: after the router assigns each token an expert, one all-to-all dispatches tokens to the GPUs holding their experts; after the experts run, a second all-to-all sends results back

Page 17 walks two batches ("red fox sits" and "the weather is") through the layers. Each token may visit an expert on another GPU at every layer, while its KV cache stays on the original GPU. Page 18 adds that GShard doesn't use MoE in every layer; it uses it **in every other layer**.

Set this next to L16 and the contrast is clear. Expert parallelism needs neither a micro-batch schedule nor per-layer matrix splits. It turns "the model doesn't fit" into "tokens have to travel between GPUs." That is why page 15 simply says: you need fast all-to-all communication.

### Load balancing

If the router sends most tokens to a few experts, their GPUs get congested while the rest sit idle; the slides call this routing collapse. Page 19 gives the expert-level balance loss:

<details>
<summary>Formula: expert-level balance loss (L17, page 19)</summary>

$$L_{\text{ExpBal}} = \alpha_1 M \sum_{i=1}^{M} f_i P_i,\quad f_i = \frac{\#\text{tokens to expert } i}{\#\text{tokens}},\quad P_i = \frac{1}{\#\text{tokens}}\sum_{t} s_{i,t}$$

M is the number of experts and $s_{i,t}$ is token t's routing weight for expert i. $f_i$ is the fraction of tokens actually routed to expert i, and $P_i$ is its average routing probability. The loss peaks when both concentrate on the same expert.

</details>

DeepSeek's version on page 30 adds a **device-level balance loss**. Experts are grouped, and the same form of loss is computed from each group's average $f$ and summed $P$, so that compute balances across devices, not just across experts. This is exactly what the "split the experts" view adds: in the end, the unit you balance is the GPU, not the expert.

### Inference: DeepSpeed-MoE's system design

Page 20 says MoE inference performance depends on three things: total model size, how many experts are activated, and overall memory bandwidth. The default implementation keeps every expert in GPU memory, which takes a lot of memory.

Pages 21–24 cite the design goal of [DeepSpeed-MoE](https://arxiv.org/abs/2201.05596) (Rajbhandari et al. 2022): **minimize the critical data path per device and maximize achievable aggregate memory bandwidth.** Concretely:

- **Expert slicing plus tensor slicing** (page 22): tokens assigned to the same expert share one critical data path, and token groups for different experts are spread across devices with expert parallelism. Non-expert parameters (attention) are split with tensor parallelism, usually within a node, and data parallelism goes on top
- **Kernel work** (page 23): fuse the gating function into one kernel and use a dense token-to-expert mapping table. The slide reports over a 6x reduction in MoE-kernel latency
- **All-to-all work** (page 24): all-to-all latency in expert parallelism grows linearly with the number of devices. The fixes are a hierarchical all-to-all (fewer hops) and scheduling communication around the model's parallelism strategy

The DeepSpeed-MoE abstract reports 7.3x better inference latency and cost than existing MoE inference solutions, and up to 4.5x faster and 9x cheaper inference than quality-equivalent dense models.

### DeepSeek-V3: fine-grained experts plus shared experts

Page 28 covers the two ideas in [DeepSeekMoE](https://arxiv.org/abs/2401.06066): split each FFN into smaller experts (fine-grained experts), and combine shared and routed experts, taking a top-k weighted average over the routed ones. The abstract says DeepSeekMoE 16B matches LLaMA2 7B with about 40% of the compute.

Page 29 lists DeepSeek-V3's MoE configuration (labeled 670B on the slide), taken from the official [inference/model.py](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/inference/model.py):

| Setting | Value |
|---|---|
| Vocabulary | 129,280 |
| Hidden dimension | 7,168 |
| Layers | 61 (the lowest 3 are dense) |
| Attention heads | 128 (MLA) |
| Dense FFN inner dimension | 18,432 |
| MoE expert inner dimension | 2,048 |
| Shared experts | 1 |
| Routed experts | 256 |
| Routed experts activated per token | 8 |
| Expert groups / limited groups | 8 / 4 |

Page 31 names two libraries DeepSeek released: [DeepEP](https://github.com/deepseek-ai/DeepEP), a communication library for MoE and expert parallelism, and [EPLB](https://github.com/deepseek-ai/EPLB), an expert-parallel load balancer. Pages 33–36 walk through the [DeepSpeed MoE tutorial](https://www.deepspeed.ai/tutorials/mixture-of-experts/) and [`deepspeed/moe/layer.py`](https://github.com/microsoft/DeepSpeed/blob/master/deepspeed/moe/layer.py).

## Try it yourself: three exercises without enrolling

1. **Compute the bubble yourself.** Fix K = 4, sweep M from 1 to 32, and plot (K−1)/(M+K−1). See where it lands at M = 16 (that is, 4K), then think about what smaller micro-batches do to per-GPU efficiency.
2. **Derive Megatron's FFN split by hand.** Generate random X, A, and B in NumPy, split A by columns and B by rows, and check that GeLU(X·A1)·B1 + GeLU(X·A2)·B2 equals the unsplit result. Then try splitting A by rows and see why you'd need to sync before GeLU.
3. **Read DeepSeek-V3's `model.py`.** Look only at the `Gate` and `MoE` classes. Using the table above, find the lines for top-k, group-limited routing, and the shared expert.

## Further reading

- Previous in series: [L14–L15 Distributed training and data parallelism](/en/posts/ai/2026-09-30-cmu11868-data-parallel-training-en)
- Next in series: [L18 ZeRO: memory optimization for distributed training](/en/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en)
- Hands-on for this lecture: [HW5: data parallelism and pipeline parallelism](/en/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en)
- On this site: [CS336 parallelism mechanics](/en/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), [CS336 parallelism strategies](/en/posts/ai/2026-08-22-cs336-parallelism-strategies-en)
- On this site: [CS336 attention and MoE](/en/posts/ai/2026-08-22-cs336-attention-moe-en), [Why the MoE architecture wins](/en/posts/ai/2026-08-26-moe-architecture-why-it-wins-en)

## References

- Course: [CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) (3/16 and 3/18 topics and readings)
- Slides: [L16 Model Parallel Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf), [L17 System for MOE Models](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-17-MoE-3aa3125f9ccdd4bb7109ef077fbe9260.pdf)
- Papers: [Huang et al., GPipe](https://arxiv.org/abs/1811.06965), [Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473) (10%+ throughput from the interleaved schedule)
- Papers: [Lepikhin et al., GShard (OpenReview)](https://openreview.net/forum?id=qrwe7XHTmYb), [arXiv version](https://arxiv.org/abs/2006.16668), [Fedus et al., Switch Transformers](https://arxiv.org/abs/2101.03961)
- Papers: [Rajbhandari et al., DeepSpeed-MoE](https://arxiv.org/abs/2201.05596) (the 7.3x, 4.5x, and 9x figures), [Dai et al., DeepSeekMoE](https://arxiv.org/abs/2401.06066) (16B vs. LLaMA2 7B at about 40% compute)
- Code: [DeepSeek-V3 inference/model.py](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/inference/model.py), [DeepEP](https://github.com/deepseek-ai/DeepEP), [EPLB](https://github.com/deepseek-ai/EPLB), [DeepSpeed MoE tutorial](https://www.deepspeed.ai/tutorials/mixture-of-experts/), [shallowspeed](https://github.com/siboehm/shallowspeed), [PyTorch pipelining docs](https://pytorch.org/docs/main/distributed.pipelining.html)
