---
title: "AI Engineer Interview Daily — 2026-11-13: Coding"
date: 2026-11-13
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's slot is Coding: an Amazon LLM-team interview question asking you to implement a decode step of Grouped-Query Attention with a KV cache in NumPy — the real test is the group-index math and which shape the cache actually has to be."
tldr: "Today's practice question comes from an Amazon onsite interview (as logged on 1Point3Acres): implement a single decode step of GQA in NumPy — project the new token into q, k_new, v_new, append k_new and v_new to the right KV cache, then use kv_idx = i // queries_per_group so each query head finds the group of KV heads it shares. The point isn't reciting the attention formula; it's being able to say out loud that GQA is a generalization spanning MHA (n_kv_heads = n_heads) and MQA (n_kv_heads = 1), and explaining why the cache shape is (n_kv_heads, …) rather than (n_heads, …)."
series:
  name: "AI Engineer Interview Daily"
  order: 86
---

> 🌏 [中文版](/posts/daily/2026-11-13-ai-interview-daily)

## Today's Focus

Friday is Coding day, and today's flavor is "hand-implement a piece of LLM inference internals" — the interviewer hands you a decoder-only transformer that has already run the prefill pass and has a KV cache at every layer, and asks you to write, in NumPy, the decode step that handles the next new token — using Grouped-Query Attention (GQA) rather than the textbook Multi-Head Attention (MHA). This question has been reported from Amazon's LLM/infra team coding rounds, and it isn't testing whether you can recite the attention formula — it's testing whether you've actually dealt with how inference services cut KV cache memory in practice.

This flavor of question is close to standard now for mid-to-large model interviews: Llama 3, Mistral, and Qwen 2 all ship with GQA instead of the original paper's MHA, and interviewers want to see whether you know query heads and KV heads can be different counts, and how that difference ripples into the cache's shape and the index math. For an AI Engineer, this one question tests three things at once — the basic attention mechanism, the append-only structure of a KV cache, and the edge cases in group indexing. Miss any one of the three and the interviewer will read it as "memorized the vocabulary, never actually implemented it."

## Core Concepts Cheat Sheet

```diagram
title: How a GQA decode step picks which KV cache each query head reads
desc: The new token is projected into q, k_new, v_new; k_new and v_new get appended to the KV cache, then the n_kv_heads setting decides which group of KV this query head reads before attention runs and the token is emitted.
caption: Simplified: the general GQA case is a grouped lookup, with n_kv_heads equal to n_heads or 1 as its two degenerate boundaries.
---
<svg viewBox="0 0 720 520">
  <path class="dg-line" d="M360 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 116V184" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 280V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M488 232H528" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M232 232H192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 376V412" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M624 268V404Q624 412 616 412H368" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M96 268V404Q96 412 104 412H352" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 420V440" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="360" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="228" y="60" width="264" height="56" rx="6"/>
    <text class="dg-label" x="360" y="80" text-anchor="middle" dominant-baseline="central">New token arrives, project it</text>
    <text class="dg-sub" x="360" y="100" text-anchor="middle" dominant-baseline="central">produces q (per head), k_new, v_new</text>
  </g>

  <g>
    <path class="dg-box" d="M360 184L488 232L360 280L232 232Z"/>
    <text class="dg-label" x="360" y="222" text-anchor="middle" dominant-baseline="central">Which KV does it read?</text>
    <text class="dg-sub" x="360" y="244" text-anchor="middle" dominant-baseline="central">depends on n_kv_heads</text>
  </g>

  <g>
    <rect class="dg-box" x="228" y="312" width="264" height="64" rx="6"/>
    <text class="dg-label" x="360" y="334" text-anchor="middle" dominant-baseline="central">n_kv_heads = n_heads</text>
    <text class="dg-sub" x="360" y="356" text-anchor="middle" dominant-baseline="central">degenerates to MHA: each head owns its KV</text>
  </g>

  <g>
    <rect class="dg-box" x="528" y="196" width="192" height="72" rx="6"/>
    <text class="dg-label" x="624" y="220" text-anchor="middle" dominant-baseline="central">General case (GQA)</text>
    <text class="dg-sub" x="624" y="244" text-anchor="middle" dominant-baseline="central">kv_idx=i//step</text>
  </g>

  <g>
    <rect class="dg-box" x="0" y="196" width="192" height="72" rx="6"/>
    <text class="dg-label" x="96" y="220" text-anchor="middle" dominant-baseline="central">n_kv_heads = 1</text>
    <text class="dg-sub" x="96" y="244" text-anchor="middle" dominant-baseline="central">degenerates to MQA: all heads share one KV</text>
  </g>

  <circle class="dg-dot" cx="360" cy="420" r="4"/>

  <g>
    <rect class="dg-box dg-box--accent" x="228" y="440" width="264" height="56" rx="6"/>
    <text class="dg-label" x="360" y="460" text-anchor="middle" dominant-baseline="central">Each head's attention output gets concatenated</text>
    <text class="dg-sub" x="360" y="480" text-anchor="middle" dominant-baseline="central">projected by W_o; cache carries over to the next step</text>
  </g>

  <text class="dg-edge" x="424" y="310" text-anchor="middle" dominant-baseline="central">degenerate MHA</text>
  <text class="dg-edge" x="508" y="222" text-anchor="middle" dominant-baseline="central">general GQA</text>
  <text class="dg-edge" x="212" y="222" text-anchor="middle" dominant-baseline="central">degenerate MQA</text>
</svg>
```

### A KV cache is an append-only memory structure

At each decode step, you append the new token's key and value vectors to the end of the cache, so the next step's attention can reuse them instead of recomputing attention over every token already generated. The cache's shape is `(n_kv_heads, cur_len, d_head)` — note the first dimension is the **KV head count**, not the query head count. That's exactly the detail interviewers probe for, because in GQA the two are no longer required to match.

### MHA, GQA, and MQA are the same function with different parameters

GQA isn't three separate implementations — it's one "group-shared KV" mechanism with three special cases. When `n_kv_heads == n_heads`, every query head gets its own KV and you have plain Multi-Head Attention. When `n_kv_heads == 1`, every query head shares one KV and you have Multi-Query Attention. Anything in between is GQA proper. Framing all three as one spectrum, rather than memorizing them as three separate formulas, is much less likely to break down under interview pressure.

### The group index: `kv_idx = i // queries_per_group`

`queries_per_group = n_heads // n_kv_heads` tells you how many query heads share one KV group, and query head `i` reads KV group `i // queries_per_group`. Llama 3 70B has 64 query heads and 8 KV heads, so every 8 query heads share one KV group — getting this index wrong is the single most common way to lose points on this question.

### A decode step and prefill differ only in the length of Q

Prefill runs attention once over the whole prompt, where Q, K, and V all share the same sequence length. Decode adds exactly one new token per step, so Q has length 1, but K and V still need to run attention over the full length accumulated in the cache — the scores shape is `(1, cur_len)`, not `(cur_len, cur_len)`. Miss that asymmetry and it's easy to accidentally rewrite a full prefill pass instead of a single decode step.

## Today's Practice Question

### The Question

You're given a GQA decoder that has already run its prefill pass, where every layer holds `k_cache` and `v_cache`, each shaped `(n_kv_heads, cur_len, d_head)`. Implement `decode_step(x_new, W_q, W_k, W_v, W_o, k_cache, v_cache, n_heads, n_kv_heads)` in NumPy: project the new token's embedding into `q` for every query head plus `k_new` and `v_new` to be appended to the cache; append `k_new` and `v_new` to the right cache; route each query head to the KV group it shares; run scaled dot-product attention; concatenate every head's output and project it through `W_o`; and return both this token's output and the updated `k_cache`/`v_cache`. No PyTorch or any off-the-shelf attention/KV-cache API allowed.

**Source**: Amazon onsite (logged on 1Point3Acres as "Implement GQA Multi-Head Attention Forward Pass with KV Cache"); LeetML's Amazon ML interview guide lists "attention with a KV cache …in numpy" as a question type LLM/infra teams swap into the coding round　**Difficulty**: Advanced　**Round**: onsite ML coding (LLM / infra team)

### Breaking It Down

1. **Clarify first**: Is this a single decode step, or the full autoregressive loop? Is batch size 1? Does the cache have a capacity limit (should it raise an error when full)? Interviewers usually say "write the single step first, loop and batching are the stretch goal."
2. **Build the frame**: Treat the decode step as reusing the same `scaled_dot_product_attention` from prefill, except Q's sequence length is fixed at 1 while K and V's sequence length is whatever the cache currently holds. Get the append logic right first, then the group lookup, and only then wire it into attention.
3. **Dig into the core**: When appending, make sure the dimensions line up — `k_new` has shape `(n_kv_heads, 1, d_head)` and gets appended along `axis=1` (the time dimension), not `axis=0`. The group lookup is `kv_idx = i // (n_heads // n_kv_heads)`; each query head uses that index against `k_cache[kv_idx]` and `v_cache[kv_idx]` — not `k_cache[i]` directly, which is the most common off-by-mapping bug here. Softmax still needs the max-subtraction trick, and numerical stability only gets more important as the cache keeps growing across a conversation.
4. **Wrap up**: Proactively raise two edge cases — `n_kv_heads == n_heads` makes the index degenerate to `kv_idx = i`, i.e. plain MHA, and `n_kv_heads == 1` makes every head read `k_cache[0]`, i.e. MQA — and explain how you'd verify correctness: with the same fixed weights, compare "N accumulated decode steps" against "one full prefill pass over all N tokens" and confirm the two outputs agree within floating-point tolerance.

### Sample Answer (how to actually say this in the interview)

> **Start with the overall frame**: I'd first confirm the cache shape convention is `(n_kv_heads, cur_len, d_head)`, then split the decode step into three stages — projection, append, attention — so each stage can be tested on its own. Projection reuses the same weight matrices as prefill; the only difference is the input is a single token's embedding, so `q` comes out as `(n_heads, 1, d_head)` and `k_new`/`v_new` come out as `(n_kv_heads, 1, d_head)`.
>
> **The append and the group lookup are the real core of this question**: `k_cache = np.concatenate([k_cache, k_new], axis=1)`, and the same for v — after that, the cache length becomes `cur_len + 1`. For the grouping, I'd first compute `queries_per_group = n_heads // n_kv_heads`, then each query head `i` uses `kv_idx = i // queries_per_group` to grab the KV group it shares. **Getting that line wrong is the easiest way to lose points, because if `n_kv_heads` happens to equal `n_heads`, the formula automatically degenerates to `kv_idx = i`, which is plain MHA; and if `n_kv_heads` is 1, every head points at the same group, which is MQA** — I'd call that out explicitly to show I understand GQA isn't a third, independent mechanism.
>
> **Finally, attention and verification**: each head computes `softmax(q[i] @ k_cache[kv_idx].T / sqrt(d_head)) @ v_cache[kv_idx]`, with the same max-subtraction trick in softmax to avoid overflow, and all heads' outputs get concatenated and projected through `W_o` to produce this token's output. I'd proactively bring up how I'd test it: with the same fixed weights, run "call decode_step once per step, accumulated to step N" against "one full attention pass over the first N tokens at once," and the two should match within floating-point tolerance — that's the most direct way I'd confirm the cache logic is correct.

### Self-Check Checklist

Use this table to check whether your answer hit every key point:

| Check item | Did you mention it? |
|---------|---------|
| KV cache shape is `(n_kv_heads, cur_len, d_head)`, explicitly distinct from the query head count | |
| Append happens along the time dimension (`axis=1`), not the head dimension | |
| Group lookup uses `kv_idx = i // queries_per_group`, not `k_cache[i]` directly | |
| Named both boundaries: GQA degenerates to MHA at `n_kv_heads == n_heads` and to MQA at `== 1` | |
| Softmax uses the max-subtraction trick, with a reason why it matters more as the cache grows | |
| Bonus: mentioned how to verify correctness (accumulated decode steps should match a one-shot prefill) | |

## Further Reading

- [MHA vs GQA vs MQA: Attention & KV Cache Guide](https://machinelearningplus.com/gen-ai/mha-gqa-mqa-kv-cache/) — builds MHA, MQA, and GQA from scratch in runnable NumPy alongside the KV cache memory formula; today's group-index logic can be checked directly against this
- [GitHub: ai-engineering-interview-questions](https://github.com/ombharatiya/AI-Engineer-Interview-Questions) — includes runnable from-scratch challenges like "autoregressive decode loop with vs. without KV cache," a good follow-up after today's question
- [Amazon Machine Learning Interview Guide (2026)](https://leetml.org/company/amazon-ml-interview-guide.html) — compiles real-world reports of Amazon's ML interview loop, showing LLM teams swap standard algorithm questions for from-scratch implementations like "attention with a KV cache…in numpy"

## References

- [Implement GQA Multi-Head Attention Forward Pass with KV Cache (Amazon)](https://www.1point3acres.com/interview/problems/f082d70a-be84-546e-9a0b-da64107d91fb) — the original source of today's practice question, an Amazon onsite interview logged on 1Point3Acres
- [Amazon Machine Learning Interview Guide (2026)](https://leetml.org/company/amazon-ml-interview-guide.html) — confirms "attention with a KV cache" is a real question type Amazon's LLM/infra teams swap into the coding round, not one interviewer's personal preference
- [MHA vs GQA vs MQA: Attention & KV Cache Guide](https://machinelearningplus.com/gen-ai/mha-gqa-mqa-kv-cache/) — the technical source for the MHA/GQA/MQA spectrum framing and the KV cache shape convention used in the Core Concepts section
