---
title: "AI Engineer Interview Drill — 2026-11-24: Deep Learning & NLP"
date: 2026-11-24
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's slot is Deep Learning & NLP: a real Mistral 7B interview question on why the KV cache turns into a memory-bandwidth bottleneck during decode, and how GQA/MQA fix it by sharing KV heads across query heads."
tldr: "The KV cache starts as a speedup trick and ends up as the thing that caps throughput: prefill is one big matmul over the whole prompt and is compute-bound, while decode processes one token at a time but must re-read the entire cache every step, making it memory-bandwidth-bound — and the cache grows linearly with batch size times context length. GQA/MQA fix this by having multiple query heads share the same KV heads, shrinking the stored and re-read data proportionally. Today's question asks what Mistral 7B's GQA and sliding-window attention each solve and each cost — the trap is treating them as the same trick."
series:
  name: "AI Engineer 面試日練"
  order: 97
---

> :globe: [中文版](/posts/daily/2026-11-24-ai-interview-daily)

## Today's Focus

Tuesday's fixed slot is Deep Learning & NLP. Previous weeks covered the self-attention derivation, RoPE, and LoRA/QLoRA fine-tuning. Today moves to a part of inference that shows up in almost every LLM system-design round: the KV cache. The trap isn't reciting what a KV cache is — it's failing to explain why a technique built to speed things up turns into the single biggest memory consumer in production, and exactly where GQA/MQA's "share the KV heads" trick saves anything.

## Core Concepts

### Why the KV cache exists: decode shouldn't recompute every past token's K and V

At every autoregressive step, the new token's query has to take a dot product against every previous token's key and value. Recomputing the full sequence each step would make the cost grow quadratically with sequence length. The KV cache's trick: once a token's K and V are computed, they never change again, so they're computed once and stored. Each later step only computes the new token's own Q, K, and V, appends the new K/V to the cache, and uses the new Q against everything already cached. That turns the per-step cost from scaling with sequence length into roughly constant work, relative to recomputing from scratch.

### Prefill is compute-bound, decode is bandwidth-bound — and interviewers love this split

This is the distinction interviewers probe hardest. Prefill processes the whole prompt in one pass — the query is a tall matrix stacking every prompt token, multiplied against the weights as a large matmul that saturates GPU compute. That makes prefill compute-bound, and it determines time-to-first-token. Decode processes one new token per step — the query degenerates into a single row, so the matmul becomes a thin matrix-vector multiply with very low arithmetic intensity. The real cost isn't the multiplication itself; it's streaming the entire KV cache from HBM to the compute units every step. That makes decode memory-bandwidth-bound, and it determines inter-token latency. This is exactly why production systems batch many decode requests together: one weight read from HBM gets amortized across more requests, which is the only lever that actually helps when bandwidth, not compute, is the ceiling.

### The KV cache size formula — why it can outgrow the model's own weights

For one layer and one token, cache size is `2 × number of KV heads × head dimension × bytes per element` (the 2 accounts for storing both K and V). Multiply that by the number of layers, the batch size, and the sequence length, and you get the full memory footprint the system has to hold. This is a linear function of batch size times context length — the longer the context and the more requests served concurrently, the bigger the cache gets. At large batch sizes and long contexts, the KV cache routinely exceeds the size of the model's weights themselves, becoming the actual throughput ceiling. The bottleneck isn't insufficient compute — it's no spare memory to hold the cache, and no spare bandwidth to read it.

### GQA/MQA: letting multiple query heads share one set of KV heads shrinks both storage and reads directly

Standard multi-head attention (MHA) uses as many KV heads as query heads — every head stores its own K and V. Multi-query attention (MQA) goes to the opposite extreme: every query head shares a single KV head, minimizing the cache but costing each head its independent view of the sequence, which can hurt quality. Grouped-query attention (GQA) sits in between: the number of KV heads is smaller than the number of query heads but greater than one — for example, 32 query heads split into 8 groups of 4, each group sharing one KV head, which shrinks the cache by that same factor (4x in this example). The original 2023 paper found that this intermediate grouping keeps most of MHA's quality while capturing most of MQA's inference benefit, which is why Llama 3, Qwen3, and the Mistral family all default to GQA.

```flow-diagram
{
  "title": "One decode step: how the KV cache gets read, and how GQA shrinks it",
  "lang": "en",
  "width": 560,
  "height": 700,
  "nodes": [
    {"id": "token", "label": "New token arrives", "x": 280, "y": 40, "w": 260},
    {"id": "qkv", "label": "Compute this token's\nQ, K, V", "x": 280, "y": 150, "w": 260},
    {"id": "append", "label": "Append new K, V\nto the cache", "x": 280, "y": 260, "w": 260},
    {"id": "read", "label": "Read back the whole\nKV cache (bandwidth\nbottleneck happens here)", "x": 280, "y": 370, "w": 260, "tone": "accent"},
    {"id": "attn", "label": "New Q dot every cached K,\nthen softmax", "x": 280, "y": 480, "w": 260},
    {"id": "gqa", "label": "GQA: multiple Q heads\nshare one KV head\n→ cache shrinks proportionally", "x": 280, "y": 600, "w": 260, "tone": "accent"}
  ],
  "edges": [
    {"from": "token", "to": "qkv", "step": 1, "label": "Only the new token, no recompute"},
    {"from": "qkv", "to": "append", "step": 2, "label": "K, V never change once computed"},
    {"from": "append", "to": "read", "step": 3, "label": "Next step needs the full history"},
    {"from": "read", "to": "attn", "step": 4, "label": "Matrix-vector, low arithmetic intensity"},
    {"from": "attn", "to": "gqa", "step": 5, "label": "KV head count sets how much gets read"}
  ],
  "steps": [
    "For every new token the model generates, it only computes that token's own Q, K, V — it never recomputes the history.",
    "The new K, V are appended to the end of the KV cache — K and V never change once computed, which is exactly what makes caching possible.",
    "To produce the next token, the entire KV cache (every past token's K and V) must be read back from HBM into the compute units.",
    "This step is a matrix-vector multiply with low arithmetic intensity — the real cost is moving data, not computing, which is why decode is memory-bandwidth-bound.",
    "GQA lets multiple query heads share one set of KV heads, so the number of KV heads drops and the data stored and read shrinks proportionally."
  ],
  "caption": "Simplified view of the read/write path for one decode step. Real systems add batching mechanisms like PagedAttention on top of this."
}
```

### Further production optimizations: PagedAttention and DeepSeek's MLA

GQA/MQA are architecture-time decisions, baked in before training starts. Two more optimizations apply at inference time. First, PagedAttention (the core idea behind vLLM): instead of pre-allocating each request's cache as one contiguous block sized to `max_len`, the cache is split into fixed-size pages managed through a block table, much like an OS's virtual memory. This eliminates the internal fragmentation caused by requests of different lengths finishing early and leaving holes, and it lets a shared system prompt's pages be reused across multiple requests (prefix sharing). Second, DeepSeek's multi-head latent attention (MLA) goes further than GQA — instead of storing the full K and V, it stores a single low-rank shared latent vector and projects back to K/V at inference time. DeepSeek-V2's MLA cut KV cache size by 93.3% compared to an equivalent dense model.

## Today's Practice Question

### The Question

Mistral 7B ships with both grouped-query attention and sliding-window attention. What does each one buy you, and what does each one cost?

**Source**: ombharatiya/AI-Engineer-Interview-Questions (GitHub, Mistral AI company question bank) **Difficulty**: Medium **Round**: Onsite architecture deep-dive

### How to Break It Down

1. **Scope the question first**: Pairing two techniques in one question is often a check for whether you'll conflate them into "one trick that saves memory." Open by splitting them explicitly — "these solve two different bottlenecks, let me take each one's benefit and cost separately, then say how they combine in the same model."
2. **Build a framework**: GQA attacks the size of the KV cache itself (how many KV head groups get stored). Sliding-window attention attacks how much history each token needs to remember (only the last W positions). They're orthogonal — one decides "how coarse to store," the other decides "how far back to store."
3. **Go deep on the core trade-off**: The key move is making each cost concrete. GQA's cost is that query heads sharing KV heads lose some expressive capacity relative to full MHA, though empirically there's almost no quality loss at this grouping ratio. Sliding-window's cost is that true long-range direct attention disappears — information can only propagate further through stacked layers indirectly, which can hurt tasks that need precise recall of something far back (like reproducing a sentence from 30,000 tokens ago).
4. **Close strong**: Converge on one judgment call — "GQA and sliding-window are both architecture-time decisions that bake inference economics into the model, not runtime switches. GQA has almost no free-lunch cost, which is why nearly every new model defaults to it. Sliding-window trades precise long-range recall for bandwidth and memory headroom, which is why newer models more often mix full-attention layers with windowed layers rather than windowing the entire model."

### Sample Answer (how you'd actually say this in an interview)

> **Separate the two bottlenecks first.** GQA targets the size of the KV cache itself. If Mistral 7B used full multi-head attention, its 32 query heads would each need their own K and V stored; GQA splits those 32 query heads into 8 groups, each sharing one KV head, which cuts the cache to a quarter of its original size. That number translates directly into two things: more concurrent requests fit on the same GPU, because each request's cache footprint shrinks, and decode reads less data from HBM every step — and since decode is bandwidth-bound, reading less means running faster. The cost is that heads sharing a KV head see the same weighted content, so expressive capacity drops a bit relative to full MHA, though at this 4x grouping ratio there's essentially no measured quality loss.
>
> **Sliding-window attention targets a completely different bottleneck.** It restricts each token to attend only to the most recent W positions — 4096 for Mistral 7B — which turns the compute per token from scaling with the full sequence length into a fixed O(W), and lets the cache be a fixed-size ring buffer that never grows no matter how many tens of thousands of tokens get generated. The cost is that true long-range direct attention is gone — a token can't directly see anything more than 4096 positions back; information can only reach further through stacking many layers, and if a task needs precise recall of something far in the past, that indirect path isn't always enough.
>
> **These are the same design philosophy applied to two orthogonal problems.** GQA decides how many KV head groups to store; sliding-window decides how much history to store. Mistral 7B uses both together because their costs don't stack and amplify each other — each buys its own separate benefit. That's also why later models more often mix full-attention layers with windowed layers, rather than windowing the entire model uniformly.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist Item | Covered? |
|---------|---------|
| Clearly explained why decode is memory-bandwidth-bound, contrasted with prefill's compute-bound profile | |
| Correctly stated or described how KV cache size scales linearly with KV head count, layer count, batch size, and sequence length | |
| Separated GQA (KV head count) and sliding-window (history length) as two orthogonal bottlenecks | |
| Named the actual cost of GQA/MQA, not just "sharing KV heads saves memory" | |
| Bonus: mentioned PagedAttention or DeepSeek's MLA as a further inference-time or architecture-time optimization | |

## Further Reading

- [Grouped-Query Attention (GQA) in Modern LLMs — Sebastian Raschka](https://sebastianraschka.com/faq/docs/grouped-query-attention.html) — Works out the cache-size formula using real head counts from Qwen3, Llama 3, and Gemma 3 — good for checking your own hand-calculated KV cache numbers.
- [Decoding Multi-Head Latent Attention: The KV Cache Memory Bottleneck, Solved — Vizuara](https://vizuara.substack.com/p/decoding-multi-head-latent-attention) — Walks from the KV cache memory wall to how DeepSeek's MLA compresses it further with low-rank projection — good next step past GQA.

## References

- [Mistral AI — AI Engineer Interview Questions (ombharatiya/AI-Engineer-Interview-Questions, GitHub)](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/mistral.md) — Source of today's practice question, from this GitHub AI Engineer interview question bank's Mistral AI section.
- [Explain KV cache in Transformer inference — prachub.com](https://prachub.com/interview-questions/explain-kv-cache-in-transformer-inference) — Source for the first two Core Concepts sections on the prefill/decode distinction and the KV cache memory formula.
- [Grouped-Query Attention (GQA) in Modern LLMs — Sebastian Raschka](https://sebastianraschka.com/faq/docs/grouped-query-attention.html) — Source for the third and fourth Core Concepts sections on MHA/MQA/GQA definitions and cache-size math.
- [Decoding Multi-Head Latent Attention: The KV Cache Memory Bottleneck, Solved — Vizuara](https://vizuara.substack.com/p/decoding-multi-head-latent-attention) — Source for the fifth Core Concepts section on PagedAttention and DeepSeek's MLA.
