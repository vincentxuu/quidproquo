---
title: "CMU 11-868 Serving at Scale: Prefill/Decode Disaggregation, KV Cache, and Heterogeneous Hardware"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm-inference, model-serving, kv-cache, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 21
tldr: "11-868 closes with five serving decks: Hao Zhang on DistServe, Vikram Mailthody on NVIDIA Dynamo, Junchen Jiang on LMCache, Mingxing Zhang on Mooncake and KTransformers, and Lei Li's map of serving frameworks. They share one question: once serving grows from one machine to a data center, where do the compute and the KV cache go? The argument runs in three steps. Measure goodput under latency SLOs instead of raw throughput. Put prefill and decode on separate GPUs. Let the KV cache spill from GPU memory into CPU memory, SSDs, and remote storage."
description: "A guide to lectures L26–L30 of CMU 11-868 LLM Systems (Spring 2026): goodput with TTFT and TPOT, DistServe's prefill/decode disaggregation and placement, NVIDIA Dynamo's KV-aware router, Planner and NIXL, LMCache with CacheGen and CacheBlend, Mooncake's KVCache-centric design, KTransformers' CPU/GPU hybrid inference, and the App Stack deck's framework map. Includes the date and scheduling status of each deck."
draft: false
glossary:
  - term: "goodput"
    aliases: ["effective throughput"]
    definition: "Requests completed per second that also meet the latency SLOs, such as limits on TTFT and TPOT. Unlike throughput, requests that miss the SLO don't count."
    context: "Pages 32–34 of the DistServe deck show a system with 10 rps of throughput but only 3 rps of goodput."
  - term: "prefill/decode disaggregation"
    aliases: ["disaggregated serving", "P/D disaggregation"]
    definition: "Running the prefill phase, which processes the whole prompt, and the decode phase, which generates one token at a time, on different GPUs. The KV cache moves between them, and each phase gets its own parallelism and GPU count."
    context: "Three 11-868 decks center on it: L26 (Dynamo), L28 (Mooncake), and L29 (DistServe)."
  - term: "TTFT / TPOT"
    aliases: ["time to first token", "time per output token"]
    definition: "TTFT is the time from sending a request to receiving the first output token, driven mostly by prefill. TPOT is the average gap between later output tokens, driven by decode."
    context: "The DistServe deck contrasts chatbots, which need a fast TTFT, with summarization, where a slow TTFT is acceptable."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The sources are five slide PDFs linked from the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus). I checked every fact against the original files on 2026-09-30 and cite page numbers. Two decks have dates, 4/20 and 4/22. The other three sit in the Syllabus's unscheduled section, so the spring class may not have covered them. Access grade **A3**: all slides are public. What's missing is video. Neither spring nor fall has recordings, so whatever the guest speakers said aloud is lost.

**Series**: previous [HW6: DeepSpeed ZeRO + LoRA training and SGLang inference](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en) | next [RLHF systems and HW7](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

[Two posts back](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en) we stayed inside a single inference server: continuous batching, PagedAttention, RadixAttention. This post zooms out. Requests come from thousands of users, GPUs span several racks, and the KV cache no longer fits in GPU memory. The question becomes: **how do you place compute and KV cache so you serve the most requests within your latency targets?**

The five speakers come from academia, NVIDIA, an open-source project, and a Chinese LLM service company, and their angles differ a lot. I've reordered them by argument rather than by file number.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The five decks

| No. | Title (as on the Syllabus) | Speaker | Date | Pages | Syllabus reading |
|---|---|---|---|---|---|
| [L26](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-26-dynamo-vikram_mailthody-0ddbeb69382d5c168b6d4636a82185d0.pdf) | Serving with Disaggregated Prefill-Decoding | Vikram Sharma Mailthody (NVIDIA Research) | 4/20 | 46 | DistServe |
| [L27](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-27-LMCache_junchenjiang-c21828fe582270cb5e08b4a21a002956.pdf) | Better KV Cache for LLM Serving | Junchen Jiang | 4/22 | 51 | CacheGen, CacheBlend |
| [L28](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-28-mooncake-kTransformer-1243bfbecbb0c3610bf95eac030acb2a.pdf) | LLM Serving on Heterogeneous Hardware | Mingxing Zhang (KVCache.AI) | unscheduled | 70 | Mooncake, kTransformer |
| [L29](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-29-disaggregating_prefill_decode_hao_zhang-c0e55139d20512a2348783423397cc7f.pdf) | DistServe: Disaggregated Prefill-Decoding | Hao Zhang (UCSD) | unscheduled | 68 | DistServe |
| [L30](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-30-serving-c4a70ab21cde01fb60068a256c6e163a.pdf) | App Stack and Model Serving | Lei Li | unscheduled | 49 | Triton, LightLLM |

One mismatch to know up front. On 4/20 the Syllabus title and reading are both DistServe, but the linked slides are the NVIDIA speaker's Dynamo deck, titled "Inference at Scale: Opportunities and challenges." The first-hand DistServe material is in the unscheduled L29.

Suggested order: read L29 for the concepts, then L26 to see how a product does it, then L27 and L28 for KV cache storage. Skim L30 last as a map.

## A new yardstick: from throughput to goodput

Single-server material mostly chases throughput. Page 31 of L29 starts by noting that applications care about different latencies. It uses two metrics:

- **TTFT** (time to first token): a chatbot needs it fast.
- **TPOT** (time per output token): it needs to keep up with human reading speed.

The contrast on the same page is summarization, where users tolerate a slower first token.

Pages 32–34 then separate two quantities. Throughput counts completed requests per second. Goodput counts only the ones finished within the SLO. The deck's example is a system with 10 rps of throughput and only 3 rps within the SLO. High throughput doesn't mean a good user experience.

Pages 26–27 of L26 put the same definitions in cost terms. Throughput approximates cost per request; goodput approximates cost per *good* request. Everything later in these decks optimizes goodput per GPU.

## Why split prefill from decode

**Scenario**: one GPU is serving many requests when a long prompt arrives.

**Intuition**: prefill processes the whole input at once, which is a big matrix multiply. Decode handles one token per step, so the matrix multiply degenerates into a matrix-vector product (L29 p. 10, L26 p. 17). Page 36 of L29 puts it this way: one prefill can saturate compute, so it is compute-bound. Decode is memory-bound and needs many requests batched together to use the compute.

**Mechanism**: running both on one GPU with continuous batching causes two problems (L29 pp. 37–41):

1. **Interference**. When a new prefill cuts in, requests that are decoding have to wait, and TPOT suffers. It works the other way too. Meeting both SLOs then means buying more GPUs.
2. **Coupled parallelism**. If TTFT is tight and TPOT is loose, prefill and decode want different TP/PP setups, but one GPU group can only pick one.

After the split, prefill instances care only about TTFT and decode instances only about TPOT. Each side picks its own parallelism and GPU count (p. 44). The sketch on pages 45–47 uses two GPUs for prefill and one for decode (2P1D). That alone doubles goodput per GPU compared with running both phases on one card.

**Cost**: the KV cache has to move from prefill to decode. Goodput per GPU also depends on workload, SLOs, parallelism, resource allocation, and network bandwidth, which makes it hard to optimize (p. 48).

<details>
<summary>How DistServe decides placement (L29 pp. 50–56)</summary>

The deck frames the problem as "XPYD": given a workload, choose X prefill instances and Y decode instances while keeping KV cache traffic between them low. Placement means three things: the parallelism of each instance type, how many of each to deploy, and where they go in the physical cluster.

- **High bandwidth between nodes** (for example InfiniBand): the two phases can be optimized separately. Simulate the goodput of a given parallelism config, find the best config for each phase, then replicate to match total traffic.
- **Low bandwidth between nodes**: KV cache only moves between matching layers. So the same pipeline stage of prefill and decode is pinned to the same node and uses NVLink.

Page 55 estimates the transfer cost. For a 175B model on A100s, KV cache transfer over PCIe still takes less than one decode step. Page 56 reports 2.0–4.48x over vanilla vLLM depending on the application: 2.0–3.4x for chatbots, 3.2x for code completion, 4.5x for summarization. The [DistServe paper](https://arxiv.org/abs/2401.09670)'s abstract measures it differently: 7.4x more requests served within latency limits, or a 12.6x tighter SLO.
</details>

Page 57 takes on a common question: is going from continuous batching to disaggregation a step backward? The speaker says no. Continuous batching improves GPU utilization, which is throughput. Disaggregation targets goodput. And the core idea of continuous batching still applies after the split: finished requests exit, new ones start as soon as possible.

Page 58 adds some history. DistServe was published and open-sourced from Hao Zhang's UCSD lab at the end of 2023, alongside a concurrent closed-source Microsoft work (the figure credit on L26 p. 35 names Splitwise). In 2024 open-source adoption lagged behind PagedAttention, but large companies quietly switched to disaggregation. In 2025 DeepSeek-V3 used prefill/decode disaggregation with different parallelism on each side (p. 66).

## From paper to product: NVIDIA Dynamo

L26 comes from an NVIDIA researcher. The first half covers "AI factories," using xAI's 100K-GPU cluster to show that power, cooling, and networking are the real limits (pp. 5–10). Pages 12–15 contrast inference with training. Training is one big centrally coordinated job. Inference is many small jobs that need to scale up and down fast.

Then it walks through [Dynamo](https://github.com/ai-dynamo/dynamo)'s components. Disaggregated serving is one feature among several, not the whole product (p. 36):

| Component | What it does | Pages |
|---|---|---|
| Disaggregated serving | Prefill and decode on separate GPUs, each with its own parallelism | 34–35 |
| KV-aware router | Sends requests to workers with high KV cache hit rates; cites Baseten's 2x faster TTFT on Qwen3 480B | 37 |
| Planner | Scales prefill and decode workers in real time against TTFT/TPOT SLAs | 38 |
| AIConfigurator | Searches offline, on a laptop, for the best disaggregated config and emits deployment yaml | 39 |
| KV memory tiers | G1 HBM, G2 host memory, G3 local SSD, G4 network storage | 40 |
| NIXL | Library for moving KV cache across nodes and memory types, with backends such as UCX, Mooncake, and GDS | 41 |
| Grove | Topology-aware Kubernetes scheduling with prefill and decode as separate scaling groups | 42 |
| Fault tolerance | Request cancellation, token-level request migration, restart with shared router state | 43 |

The router and Planner numbers are partner case studies quoted in the deck, not paper experiments, so read them that way. The open problems on page 44 are worth reading as project ideas. Performance measurement and fault-injection tools for inference at scale barely exist. Agentic workloads where several models run side by side are little studied.

## KV cache as data: LMCache, CacheGen, CacheBlend

L27's speaker is the author of [LMCache](https://github.com/LMCache/LMCache), and the deck is titled "KV Cache: A New AI Memory Abstraction." His argument: there is far too much KV cache to keep only on GPUs, so it should be managed as data that gets stored, compressed, and moved.

Page 8 estimates that one MI300X running DeepSeek R1 in FP16 produces about 15 TB of KV cache per day. Page 11 shows where KV cache lives, spreading from GPU memory alone in 2023 out to CPU memory, SSDs, and remote storage. The reason to keep it is money. Page 9 cites a cost calculator where storage pays for itself once roughly 1% of requests hit the cache.

Once it's stored, two research questions follow, one per Syllabus reading:

- **Reusing KV cache that isn't a prefix ([CacheBlend](https://arxiv.org/abs/2405.16444))**. Prefix caching only reuses an identical opening. When a RAG prompt stitches together several retrieved documents, the second document's cached KV lacks its cross-attention with the first, and plain concatenation hurts quality (pp. 18–19). CacheBlend recomputes KV for a few selected tokens per layer to restore that cross-attention (pp. 20–22). The paper abstract reports 2.2–3.3x lower TTFT than full recompute with no quality loss.
- **Moving a huge KV cache quickly ([CacheGen](https://arxiv.org/abs/2310.07240))**. KV cache is a big 3-D tensor. Pages 27–28 argue that if you only need to store or send it, you don't have to keep the tensor shape, and you can encode it like video. Quantize layers, heads, and tokens at different strengths. Store deltas between neighboring tokens, which have similar values. Finish with arithmetic coding. The paper abstract reports a 3.5–4.3x smaller KV cache.

Pages 32–33 explain LMCache's own design choice. Existing KV cache libraries run inside the inference engine's process (vLLM, SGLang), which slows inference and makes them hard to change. LMCache runs as a separate KV cache service, so engines, storage vendors, and researchers all plug into one layer.

The closing "Lessons" section is the most interesting part of the deck (pp. 44–48):

- The LLM inference stack is separating into layers: application, inference orchestrator, KV cache data store, inference engine. These map onto user programs, scheduler, file system, and processor in an operating system.
- The OpenAI API has become the de facto narrow waist, like IP in networking. Switching providers is easy. The cost is that app-level information never reaches the backend: which inputs will be reused, which outputs will never be read. The deck warns that many research ideas may never be adopted because of this.
- Traditional MLSys avoided "lossy" optimizations that change model output. Industry is now more open to them, with the caveat that factual or format-sensitive queries are exceptions.

## Heterogeneous hardware: Mooncake and KTransformers

L28's speaker is from [KVCache.AI](https://github.com/kvcache-ai). Page 9 compares three kinds of hardware. The H800 has the compute, so it suits prefill. The H20 has high memory bandwidth, so it suits decode. A CPU with lots of DRAM gives cheap capacity, so it suits KV cache. The deck notes that the prices shown are illustrative, not accurate. That page is the thesis of the whole deck: **different hardware is good at different things, so a serving system should assign work by phase**.

The first half covers [Mooncake](https://github.com/kvcache-ai/Mooncake), the serving platform behind Moonshot AI's Kimi. Like DistServe it splits prefill and decode, but it centers on the KV cache. It pools the idle CPU, DRAM, and SSD inside a GPU cluster into a distributed KV cache (p. 11). Page 17 explains why: cache hit rate grows with cache size, and the capacity needed is petabyte-scale, beyond any single machine. Page 25 gives transfer-engine numbers: a 40 GB KV cache (LLaMA3-70B, 128k tokens) moves at 87 GB/s over 4×200 Gbps RoCE. The [Mooncake paper](https://arxiv.org/abs/2407.00079)'s abstract says that under real workloads the design lets Kimi handle 75% more requests.

The second half covers [KTransformers](https://github.com/kvcache-ai/ktransformers) and switches to local deployment of MoE models. Pages 36–37 observe that an MoE only activates a few experts at a time, so the many routed experts have low arithmetic intensity and fit well in CPU memory. Attention and shared experts stay on the GPU. To keep the CPU from becoming the bottleneck, the deck lists four techniques:

- Intel AMX instructions for the matrix multiplies (p. 40)
- CUDA Graph to remove kernel-launch overhead (p. 43)
- NUMA-aware splitting of expert weights (p. 44)
- Expert deferral, which postpones some experts so CPU and GPU work overlap (pp. 45–46)

The fine-tuning example on page 56 runs LoRA on DeepSeek-V3/R1 671B with 70 GB of GPU memory plus 1.2 TB of CPU memory.

## Back to the map: App Stack and Model Serving

L30 is Lei Li's own deck and reads more like a map. The first half uses [a16z's LLM app architecture](https://a16z.com/emerging-architectures-for-llm-applications/) to split an application into three layers: data preprocessing and embedding, prompt construction and retrieval, and prompt execution and inference (pp. 3–17).

The second half lists serving frameworks (p. 20): NVIDIA Triton with LightSeq or TensorRT-LLM, Text Generation Inference, OpenLLM, MLC LLM, and LightLLM. Page 21 warns that there are two "Tritons." NVIDIA's [Triton Inference Server](https://developer.nvidia.com/triton-inference-server) is serving software; OpenAI's Triton is a language for writing kernels. Page 24 describes the split of work: Triton groups requests into batches and the inference engine runs them. [LightLLM](https://github.com/ModelTC/lightllm/blob/main/docs/LightLLM.md) gets the most pages (pp. 36–48). Its two main ideas are Token Attention, which manages KV cache memory per token, and the Efficient Router scheduler that works with it.

This deck's framework list has no SGLang or Dynamo, and page 20 defers vLLM to "later lectures." Use it to learn the names, not as current advice on what to pick.

## What self-learners should watch for

- **No public recording links listed in the official syllabus**. Many guest-deck pages are just figures or headings (L26 pp. 18–21, for example, borrow figures from the unreleased fifth edition of PMPP). The spoken explanation is gone, so pair the slides with the papers.
- **Three decks are unscheduled**. L28, L29, and L30 sit at the bottom of the Syllabus with no date in the spring calendar, so it's unclear whether they were taught.
- **No matching homework**. HW7 is due on 4/20, and after these lectures only the final project remains. If you want hands-on work, pick your own project.
- **Separate research numbers from vendor numbers**. Paper abstracts come with experiment setups you can check. The Baseten and Alibaba cases quoted in the slides are partner performance reports.
- **Fall 2026**: the [fall Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) schedules the Dynamo and LMCache talks on 11/30 and 12/2. The other three decks are still unscheduled.

## How to study this part

1. Read L29 and the [DistServe paper](https://arxiv.org/abs/2401.09670) until you can explain goodput, interference, and coupled parallelism.
2. Read L27, then pick one of [CacheBlend](https://arxiv.org/abs/2405.16444) or [CacheGen](https://arxiv.org/abs/2310.07240).
3. Read L26 and L28 as engineering case studies. Pick one component (KV-aware router, Mooncake Store, expert deferral) and trace it into the source code.

One thing to do tonight: open the [vLLM disaggregated serving example](https://docs.vllm.ai/en/latest/examples/online_serving/disaggregated_serving/) that L26 recommends on page 36. Hold it next to the XPYD framing on page 50 of the DistServe deck. Find how many prefill and decode instances the example starts and how it moves the KV cache.

## Further reading

- The single-server step before this one: [L22 + L24 LLM serving: scheduling, RadixAttention, PagedAttention](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en)
- Another course's take on inference: [Stanford CS336: Inference](/posts/ai/2026-08-22-cs336-inference-en)
- vLLM's own architecture: [The vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — 4/20 and 4/22 topics and readings, plus the three unscheduled decks at the bottom
- [CMU 11-868 Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) — fall schedule for comparison
- [L26 Inference at Scale (Vikram Sharma Mailthody)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-26-dynamo-vikram_mailthody-0ddbeb69382d5c168b6d4636a82185d0.pdf) — goodput and cost, Dynamo components, open problems
- [L27 KV Cache: A New AI Memory Abstraction (Junchen Jiang)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-27-LMCache_junchenjiang-c21828fe582270cb5e08b4a21a002956.pdf) — KV cache volume, CacheBlend, the compression pipeline, LMCache design, Lessons
- [L28 LLM Serving on Heterogeneous Hardware (Mingxing Zhang)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-28-mooncake-kTransformer-1243bfbecbb0c3610bf95eac030acb2a.pdf) — hardware roles, Mooncake Store, KTransformers
- [L29 Disaggregating prefill and decode (Hao Zhang)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-29-disaggregating_prefill_decode_hao_zhang-c0e55139d20512a2348783423397cc7f.pdf) — continuous batching, goodput, interference, XPYD placement, history
- [L30 LLM Serving (Lei Li)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-30-serving-c4a70ab21cde01fb60068a256c6e163a.pdf) — the LLM app stack and serving frameworks
- [Zhong et al., DistServe (arXiv 2401.09670)](https://arxiv.org/abs/2401.09670)
- [Liu et al., CacheGen (arXiv 2310.07240)](https://arxiv.org/abs/2310.07240)
- [Yao et al., CacheBlend (arXiv 2405.16444)](https://arxiv.org/abs/2405.16444)
- [Qin et al., Mooncake (arXiv 2407.00079)](https://arxiv.org/abs/2407.00079)
- [KTransformers paper (ACM, as linked from the Syllabus)](https://dl.acm.org/doi/10.1145/3731569.3764843)
- [NVIDIA Triton Inference Server](https://developer.nvidia.com/triton-inference-server)
- [LightLLM documentation](https://github.com/ModelTC/lightllm/blob/main/docs/LightLLM.md)
- [ai-dynamo/dynamo](https://github.com/ai-dynamo/dynamo), [LMCache/LMCache](https://github.com/LMCache/LMCache), [kvcache-ai/Mooncake](https://github.com/kvcache-ai/Mooncake), [kvcache-ai/ktransformers](https://github.com/kvcache-ai/ktransformers)
