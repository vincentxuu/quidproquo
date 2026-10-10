---
title: "CMU 11-868 L22 and L24 LLM Serving: Scheduling, RadixAttention, and PagedAttention"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm-inference, model-serving, kv-cache, sglang, vllm, pagedattention]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 19
tldr: "11-868 spends two lectures on one question: how does an inference server handle many requests at once without wasting KV cache on the GPU? Lecture 22 (Lei Li) starts from SGLang's scheduling loop: ORCA's continuous batching, RadixAttention's radix tree for KV, sorting and routing by prefix hit rate, and hiding CPU scheduling behind GPU compute. Lecture 24 is given by vLLM author Woosuk Kwon: PagedAttention cuts KV cache into fixed-size blocks and virtualizes them with a block table, taking the batch on one A100 from 8 to 40. The second half covers how vLLM cuts CPU overhead, uses piecewise CUDA graphs, splits models across GPUs, and manages memory for hybrid architectures."
description: "A guide to Lecture 22, LLM serving with SGL, and Lecture 24, Paged Attention & vLLM, in CMU 11-868 LLM Systems (Spring 2026): inference server architecture, the scheduling loop, continuous and selective batching, KV cache size, RadixAttention insert/split/evict, cache-aware scheduling and load balancing, the overlap scheduler, PagedAttention's block table, copy-on-write, preemption, vLLM's async scheduling, piecewise CUDA graphs, five kinds of parallelism and PD disaggregation, and the hybrid memory allocator."
draft: false
glossary:
  - term: "selective batching"
    aliases: []
    definition: "ORCA's technique: batch operations that don't depend on sequence length (linear, layer norm, GeLU) together, while attention is handled per request by an attention engine."
    context: "Lecture 22 of 11-868 pairs it with continuous batching as ORCA's two core ideas."
  - term: "block table"
    aliases: []
    definition: "In PagedAttention, the table recording which physical block a request's i-th logical KV block maps to and how many slots are filled. It plays the role of an OS page table."
    context: "Woosuk Kwon walks through block-table updates step by step in Lecture 24 using an Alan Turing prompt."
  - term: "cache-aware scheduling"
    aliases: []
    definition: "Ordering requests by the length of their prefix already in the KV cache, longest first, to raise the cache hit rate, as opposed to first-come-first-served (FCFS)."
    context: "Both SGLang's scheduler and the HW6 assignment page describe this policy."
  - term: "piecewise CUDA graph"
    aliases: []
    definition: "Splitting a model into pieces: per-token operations outside attention are captured as CUDA graphs, while attention runs in PyTorch eager, trading a little speed for flexibility."
    context: "vLLM splits the graph with torch.compile; Lecture 24 compares its latency against a full CUDA graph."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The main sources are two slide decks: the April 6 [Lecture 22, Design of Efficient LLM Inference Server](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-22-llm-serving-scheduler-radixattention-dfa87a4515092525676277a85bc4425d.pdf) (Lei Li, 47 PDF pages), and the April 13 [Lecture 24, Paged Attention & vLLM for Efficient LLM Inference Engine](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-24-vLLM_woosuk_kwon-b6a0750bb310949461ba5a635a1126eb.pdf) (Woosuk Kwon, credited to Inferact on the slides, 82 PDF pages). Page numbers below are PDF page order. The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) lists [ORCA](https://www.usenix.org/system/files/osdi22-yu.pdf), [SGLang](https://arxiv.org/abs/2312.07104), and [vLLM](https://arxiv.org/abs/2309.06180) as readings. All facts were checked against the official materials on 2026-09-30. Access level **A3**: the slides are public. What you can't get is lecture video (the official syllabus lists no public recording links) and the quizzes.

**Series**: Previous [L23 Efficient Fine-Tuning: LoRA and QLoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en) | Next [HW6: DeepSpeed ZeRO + LoRA Training and SGLang Inference](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The official order is SGLang on April 6, PEFT on April 8, and vLLM on April 13. This series puts the two serving lectures together because they solve the same problem, and page 9 of Lecture 22 says outright that "SGLang / vLLM share similar arch".

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The setting: one server, many requests

Page 3 of Lecture 22 opens with scale: 200 million daily active users, 2.5 billion prompts a day, 30,000 requests per second. Pages 4–6 then list three common usage patterns, each hiding a systems problem:

- **Many users, single round**: different users may send the exact same prompt.
- **Multi-round chat**: should the server keep a user's chat history in GPU memory while waiting for the next turn?
- **Multiple answers**: the same prompt (maybe with in-context examples) has to be generated three times. Do you really run it from scratch three times?

Page 7 turns this into design goals: maintain multi-user chat sessions; handle many requests at once, with varied generation lengths and shared prompt prefixes; balance throughput and latency; use heterogeneous CPU/GPU devices. The examples it names are ORCA, SGLang, and vLLM.

## Intuition: the bottleneck is the KV cache

Ordinary neural network inference keeps only the current layer's output. Transformers can't: generating the next token needs every earlier token's keys and values in every layer. So each layer's K and V are stored in GPU memory. That's the KV cache (Lecture 22, pages 18–19).

It's big. Lecture 22's page 20 estimates about 2.5MB per token for LLaMA3 70B (80 layers, dimension 8192), or about 20GB for one request at 8k context. Lecture 24's page 11 says about 1MB per token, several GB for a full request. The two decks assume different models and precisions; the real size also depends on whether the model shares KV heads, as GQA does. What matters is the order of magnitude: the KV cache competes with the model weights for memory.

Pages 12–13 of Lecture 24 draw this as one chart. A 13B model on an A100-40GB (the slide notes this was a common setup in 2023) spends 26GB (65%) on parameters, leaving about 12GB (30%) for KV cache. Earlier systems filled the 40GB at a batch of 8, for about 0.8 req/s. PagedAttention stretches the batch to 40, for about 3.2 req/s. The slide's conclusion is one sentence: how well you manage the KV cache decides whether high-throughput serving is possible.

The two lectures attack it from opposite ends. SGLang covers scheduling and reuse. vLLM covers allocation without waste.

## Mechanism 1: the scheduling loop and continuous batching

Page 9 of Lecture 22 shows the server architecture: Client API (native generation API, OpenAI-compatible API, structured language frontend) → FastAPI server → tokenizer → scheduler → detokenizer. Under the scheduler sits the model worker, which manages the memory pool, the radix tree cache, and the attention backend.

The scheduler is one infinite loop (page 10): receive requests, process input, pick the next batch, run it, process the results. The five jobs inside the loop are receiving input, streaming output, checking stop conditions, reordering requests into a batch, and allocating memory for the next batch and the running batch.

<details>
<summary>The scheduling loop from Lecture 22, page 10 (as on the slide)</summary>

```python
while True:
    recv_reqs = recv_requests()
    process_input_requests(recv_reqs)
    batch = get_next_batch_to_run()
    result = run_batch(batch)
    process_batch_result(batch, result)
```

</details>

**Why continuous batching.** Page 13 names the obvious problem: requests in a batch generate different lengths, and a naive implementation waits for the longest one. The fix on page 14 comes from [ORCA (OSDI 2022)](https://www.usenix.org/system/files/osdi22-yu.pdf): schedule at the iteration level. After every generated token, check the batch; whenever a request finishes, slot a new one in.

Page 15 is ORCA's other idea, **selective batching**. Non-attention operations like linear, layer norm, and GeLU run as one batch, and prefill is merged into one step. Attention goes to a dedicated attention engine; the slide gives PagedAttention as an example.

**Inside SGLang's scheduler** (page 16). `get_next_batch_to_run()` handles three cases:

- A request just finished prefill: move it to the decode batch.
- New prefill requests are waiting: pick requests based on free batch slots and the waiting queue's priorities, and add them to prefill.
- No new prefill: keep decoding. First `check_decode_mem` asks whether GPU memory suffices. If yes, prepare for decode and lower `new_token_ratio`. If no, `retract_decode`, raise `new_token_ratio`, and put the request back on the prefill waiting list.

`process_batch_result` checks for finished requests and frees their KV cache. The slide notes that this frees only the reference, not the memory itself. The next section shows why those KVs are worth keeping.

## Mechanism 2: RadixAttention, reusing KV through a prefix tree

Go back to the three usage patterns: identical prompts, multi-round chat history, shared in-context examples. All of them are "same prefix". [SGLang](https://arxiv.org/abs/2312.07104)'s RadixAttention is built for exactly this (pages 21–24):

- KV memory pointers live in a radix tree (prefix tree).
- Each edge is a string, each node holds the KV memory pointers for its edge, and the path from root to node is a prefix.
- Looking up a prompt walks the edges to find the longest cached prefix and returns the number of matched tokens and the node.

Page 23 adds an implementation detail: the tree itself lives on the CPU, and nodes point to the GPU memory holding each edge's KVs.

Pages 25–32 are a sequence of diagrams showing how the tree grows. A new request adds nodes. The next round of a chat extends the same path. A new user's prompt that only partly matches splits a node. When the GPU cache overflows, the least-used KV nodes are evicted. The [HW6 assignment page](https://llmsystem.github.io/llmsystemhomework/assignment_6/) is more specific about eviction: LRU evicts the least recently used **leaf**, so shared ancestors stay until they become leaves themselves.

**Cache-aware scheduling and load balancing** (pages 35–38). With the tree in place, scheduling can look at the cache. Requests in the queue are sorted by matched prefix length, and hit rate is defined as cached tokens ÷ total prompt tokens. With several workers, a load balancer predicts each worker's prefix hit rate and routes to the best match. Page 38's comparison: round robin gets 82,665 tokens/s at a 20% hit rate; the cache-aware balancer gets 158,596 tokens/s at 75%.

## Mechanism 3: hiding CPU scheduling

Pages 40–43 deal with the last source of waste: the GPU waiting on the CPU scheduler. The scheduler's jobs (receiving messages, streaming output, checking stop conditions, maintaining the radix tree and matching prefixes, allocating memory for the next batch) leave the GPU idle if they alternate with GPU compute.

The fix is to overlap the CPU scheduler with the GPU worker. The slides name two keys: resolve the dependency by delaying the stop-condition check by one step, and use CUDA events and streams for fine-grained scheduling. They cite NanoFlow (Zhu et al.), and report 1.3× faster than the best open-source baseline at the time (page 43).

Page 45 lists extra server features the lecture doesn't expand on: speculative decoding (SpecForge), constrained decoding (XGrammar), expert parallelism (DeepEP), and model-specific support (MLA).

## Mechanism 4: PagedAttention, KV cache as virtual memory

Lecture 24 is given by Woosuk Kwon, first author of the [vLLM paper (SOSP 2023)](https://arxiv.org/abs/2309.06180).

**What went wrong before** (pages 15–16). Earlier systems followed the static-shape convention of deep learning and pre-allocated one contiguous chunk per request, sized to that request's maximum length. That causes two kinds of fragmentation. Unknown output length causes **internal fragmentation** (reserved slots never used). Different maximum lengths across requests cause **external fragmentation**. Page 16's conclusion: only 20–40% of KV cache space actually stores token states.

**PagedAttention** (pages 17–21) borrows paging from operating systems:

- The KV cache is cut into fixed-size **KV blocks**, for example 4 tokens' worth of KV per block.
- Each request sees contiguous **logical blocks**, which live in arbitrary **physical blocks**.
- A **block table** maps between them: which physical block the i-th logical block uses, and how many slots are filled.

Pages 22–26 walk through the prompt "Alan Turing is a computer scientist". Each generated token fills the next free slot in the last block. Only when a block is full does a new physical block get allocated and a new row get added to the block table.

At attention time, the kernel fetches the non-contiguous blocks through the block table and computes attention on the fly. Page 20 admits the indirection adds 5–10% to GPU kernel latency. Page 21 says that in practice PagedAttention is a custom GPU kernel that avoids gathering keys and values into contiguous tensors first, and that it can be combined with FlashAttention.

**How much it saves** (page 27). Internal fragmentation happens only in a sequence's last block, so each sequence wastes less than one block. External fragmentation disappears. The slide's scale is a sequence of about 1,000 tokens with blocks of about 10 tokens.

**The second payoff of paging: sharing** (pages 28–32). In parallel sampling, several samples share the same prompt, and every prompt block except the last can be shared. When a sample needs to write into a shared block, it copies it first (copy-on-write). Beam search has a more complex sharing structure; the slides compare it to a process tree with fork and kill, and it's supported the same way, by paging plus copy-on-write.

**When memory runs out** (pages 34–37). If no physical block is free, some requests have to pause. There are two options: swap their KV to the CPU and back, or delete it and recompute later. Every step needs all earlier tokens, so both work on whole requests. The slides observe that smaller blocks make swapping pay more overhead for small transfers, while recomputation is surprisingly fast because all tokens' KV can be computed in parallel. vLLM uses recomputation with an FCFS policy.

Page 38 compares this with OS virtual memory. OS pages map to KV blocks; pages shared across processes map to blocks shared across samples. The differences: vLLM uses a single-level block table (the table is tiny next to the data), and preemption is per request with recomputation-based recovery.

Results on pages 39–40 (OPT-13B, one A100-40G): greedy decoding on a ShareGPT trace is 2.4× faster than Orca(Pow2). On an Alpaca trace, it's 1.8× faster without beam search, and 2.4×, 3.2×, and 3.5× faster at beam widths 2, 4, and 6. Page 41 lists systems that adopted PagedAttention, such as TensorRT-LLM and HuggingFace TGI.

Page 14 adds a newer reason this matters more now: MoE models are sparse. The slide computes 32× for DeepSeek V3 (top 8 of 256 experts) and 48× for Kimi K2 (top 8 of 384). Each expert sees only 1/32 to 1/48 of the tokens in a batch, so saturating the GPU takes batches 32–48× larger, and KV cache demand grows with them.

## Mechanism 5: how vLLM squeezes out another layer

The second half of Lecture 24 covers vLLM itself. It offers two APIs (pages 44–45): the `LLM` class for offline batched inference, and an OpenAI-compatible server built on FastAPI (`vllm serve`). Page 47 groups its optimizations into four areas.

**1. Cutting CPU overhead** (pages 49–62). Page 49 makes the argument plainly. An inference step takes just 5–10 ms (100–200 tokens/s), while a training step takes 100 ms to over a second. So 1 ms of extra CPU overhead can cut inference performance by 20%, and 1 ms is easy to hit in Python. The countermeasures:

- Rewrite the API server from Python to Rust.
- Async scheduling and async de-tokenization: schedule and prepare the next batch one step ahead, overlapping host overhead with model execution so the GPU never waits on the CPU (page 52, also citing NanoFlow).
- GPU-native input preparation: the batching, paged-attention, and sampling-parameter bookkeeping that used to run as many small PyTorch ops on the CPU is rewritten as Triton kernels (page 53). This also makes async scheduling compatible with speculative decoding (page 54).
- CUDA graphs: Python/PyTorch overhead can take up to 50% of total latency (page 55). Capturing the whole model as one CUDA graph minimizes overhead, but requires static shapes and forbids CPU operations during execution. LLM inference is dynamic: prefills and decodes mix arbitrarily in one batch, kernels rely on runtime heuristics, and CPU offloading may be needed. vLLM's compromise is the **piecewise CUDA graph**: torch.compile splits the model, attention runs in PyTorch eager, and the other per-token ops run as CUDA graphs (pages 58–61). Page 62 measures it as 6–39% faster than PyTorch eager, 2–7% slower than a full CUDA graph in the worst case, and only 0–2% slower at batch size ≥ 8.

**2. GPU kernels** (pages 64–67). Complex or critical kernels come from FlashInfer and other libraries. vLLM provides `AttentionBackend` and `FusedMoE` abstractions so implementations can be swapped. Memory-bound kernels like RMS norm and RoPE are either fused automatically by torch.compile or written by hand as fused kernels. The slides use DeepSeek V3.2 as the example.

**3. Model parallelism** (pages 69–78). Models keep growing: the slide cites Kimi K2.5 at 1T parameters, about 600GB after quantization, while one B200 has 285GB of HBM. The goals are to minimize communication (keeping in mind the large gap between NVLink and InfiniBand bandwidth) and to balance load. The trade-offs of five kinds of parallelism:

| Parallelism | Pros | Cons |
|---|---|---|
| Data (replicated engines; a load balancer routes by load, KV usage, prefix cache) | No communication between engines | No parameter memory saving, no latency reduction |
| Tensor (partition linear-layer weights) | Lower latency if the network is fast; KV cache can be partitioned too | Heavy communication, usually needs NVLink; limited by number of KV heads |
| Expert (experts spread across nodes) | Friendly to GPU kernels; less communication than TP | Only for MoE layers, attention needs another scheme; load imbalance |
| Context (split one long sequence) | Parallelizes very long sequences; balances KV cache | No parameter memory saving; requests need load balancing |
| Pipeline (layers across GPUs) | Lowest communication | Higher latency; imbalance between stages |

Page 76 introduces prefill/decode disaggregation: separate prefill workers and decode workers make TTFT and TPOT more controllable, and each side can be optimized independently. Routing can use vLLM Router, NVIDIA Dynamo, llm-d, or Ray Serve LLM, with NIXL for KV transfer. This series covers the topic in depth in [L26–L30 Serving at Scale](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en).

**4. Memory management** (pages 80–81). Modern models often mix full attention with other layer types; the slides cite GPT-OSS (with sliding window attention) and Qwen 3.5 (with Gated DeltaNet). Static partitioning of memory causes severe fragmentation. vLLM's hybrid memory allocator partitions a shared pool dynamically and adjusts block sizes per layer type. The slides claim 0–12% memory waste across all open-source models.

## The two lectures side by side

| | SGLang (Lecture 22) | vLLM (Lecture 24) |
|---|---|---|
| Main question | Can requests with the same prefix reuse KV? | How do you allocate KV without waste? |
| Core structure | Radix tree (on CPU) pointing at KV on GPU | Block table mapping logical to physical blocks |
| Reuse | Prefix hits across requests and rounds | Samples of one request share blocks, with copy-on-write |
| When full | LRU eviction of leaves | Per-request preemption, recovered by recomputation |
| CPU overhead | Overlap scheduler | Async scheduling, GPU-native input prep, piecewise CUDA graphs |

This isn't either/or. Lecture 22's page 9 says the architectures are similar, and its page 15 uses PagedAttention as the example attention engine.

## Limits and how to study it

- Performance numbers in both decks come from the speakers' own systems and setups. PagedAttention's speedups, for instance, are against Orca(Pow2) on OPT-13B. Measure on your own model and traffic.
- The vLLM internals in Lecture 24 (Rust API server, GPU-native input prep, hybrid allocator) reflect spring 2026. The engine moves fast; check the [vLLM documentation](https://docs.vllm.ai/) for current details.
- The official syllabus lists no public video link, and many diagrams (pages 11, 25–32, 44) have no accompanying text. You'll need the papers alongside.

Suggested order:

1. Read Lecture 24 pages 15–27 and the PagedAttention section of the [vLLM paper](https://arxiv.org/abs/2309.06180), then draw a block-table update on paper.
2. Read Lecture 22 pages 21–32 and the RadixAttention part of the [SGLang paper](https://arxiv.org/abs/2312.07104). Work out what shape of tree multi-round chat and parallel sampling each produce.
3. Do the SGLang problem in [HW6](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en), tune `mem_fraction_static`, `dp_size`, and batch size, and watch how throughput changes.

## Further reading

- Another course's take on inference: [CS336 Inference](/posts/ai/2026-08-22-cs336-inference-en)
- Making attention itself faster: [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en)
- Beyond one machine: [L26–L30 Serving at Scale: Prefill/Decode Disaggregation, KV Cache, and Heterogeneous Hardware](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-868 LLM Systems (Spring 2026) course home](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Syllabus (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — the April 6 and April 13 sessions and the ORCA, SGLang, vLLM readings
- [Lecture 22 slides: Design of Efficient LLM Inference Server](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-22-llm-serving-scheduler-radixattention-dfa87a4515092525676277a85bc4425d.pdf) — server architecture, scheduling loop, continuous/selective batching, RadixAttention, cache-aware load balancing, overlap scheduler
- [Lecture 24 slides: Paged Attention & vLLM for Efficient LLM Inference Engine (Woosuk Kwon)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-24-vLLM_woosuk_kwon-b6a0750bb310949461ba5a635a1126eb.pdf) — fragmentation, block table, copy-on-write, preemption, throughput experiments, vLLM's four optimization areas
- [Yu et al., ORCA: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)](https://www.usenix.org/system/files/osdi22-yu.pdf)
- [Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs (arXiv 2312.07104)](https://arxiv.org/abs/2312.07104)
- [Kwon et al., Efficient Memory Management for Large Language Model Serving with PagedAttention (SOSP 2023, arXiv 2309.06180)](https://arxiv.org/abs/2309.06180)
- [HW6 assignment page](https://llmsystem.github.io/llmsystemhomework/assignment_6/) — description of RadixAttention's LRU leaf eviction and cache-aware scheduling
- [vLLM documentation](https://docs.vllm.ai/)
