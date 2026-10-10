---
title: "NTU Hung-yi Lee ML 2026 Guide: Faster Generation, Part 2: KV Cache Saves Time, Fills the Warehouse, and How to Slim It Down"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, llm-inference, kv-cache, attention, prompt-caching]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 7
tldr: "KV Cache stores the keys and values already computed so decode does not recompute them, but every token costs memory. For Gemma 2 27B that is about 0.72MB per token, so an 80GB A100 holds only about 114k tokens. Hung-yi Lee then walks through ways to shrink it: let queries share keys and values (MQA, GQA), compress keys and values into one vector without ever decompressing (MLA), limit the attention span (Sliding Window, StreamingLLM), and drop keys and values nobody attends to (Scissorhands, H2O). He ends with cross-conversation prompt caching: it only hits when the prefix is identical, so a system prompt should put stable content first."
description: "A guide to the second half of the 3/20 inference lecture in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on inference.pdf pages 29–55 and the video 'Speeding up LM generation (2/2): KV Cache': prefill/decode and KV Cache, the Gemma 2 memory estimate, multi-query and grouped-query attention, why Multi-head Latent Attention never decompresses, Sliding Window, StreamingLLM, Scissorhands and H2O pruning, when cross-conversation prompt caching hits, and the lecture's comparison table."
draft: false
glossary:
  - term: "KV Cache"
    aliases: ["key-value cache"]
    definition: "Storing each token's key and value vectors in GPU memory so they can be reused for attention when new tokens are generated. Queries are discarded after use and never stored."
    context: "It speeds up decode but consumes HBM linearly with sequence length."
  - term: "Grouped-query Attention"
    aliases: ["GQA"]
    definition: "A middle ground between multi-head and multi-query attention: each key/value group is shared by several queries, so there are more queries than key/value groups."
    context: "The slides note that models such as Llama and Gemma use it."
  - term: "Prompt caching"
    aliases: ["cached input", "cross-conversation cache"]
    definition: "The provider keeps the KV Cache from earlier requests and reuses it when a new request starts with the exact same prefix, billing those tokens at a lower price."
    context: "If a single token in the prefix differs, nothing after it can be reused."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-kv-cache)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide is based on the 3/20 materials of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 7 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. At the end of the previous post on [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en), the demo Colab made the sequence ten times longer and the GPU ran out of memory. What filled up was the warehouse (HBM), not the workbench (SRAM). This post picks up that thread: **what fills the warehouse, and how do you make it last longer?**

Official materials used: the slides [inference.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf), pages 29–55, and the lecture video [加快語言模型生成速度 (2/2)：KV Cache](https://youtu.be/fDQaadKysSA) (in Mandarin). Access level is **A3**: slides (pdf/pptx) and recording are public. The hands-on part is the vLLM section of [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en).

## Course video sources

Video sources were checked against the official course page. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=fDQaadKysSA
title: Video: Speeding up LM generation (2/2): KV Cache (in Mandarin)
```

Original videos: [Video: Speeding up LM generation (2/2): KV Cache (in Mandarin)](https://www.youtube.com/watch?v=fDQaadKysSA)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## The scene: KV Cache itself is simple

Lee opens with a pun: in Mandarin, "cache" and "cash" sound the same, and the cache really does have something to do with money. That pays off at the end of this post.

Recap of generation: the prompt goes through **Prefill**, where every token gets its q, k, v at once and attention runs in parallel. Then **Decode** emits one token at a time. After prefill, **q is thrown away and k and v are kept**. That is the KV Cache (slides 30–33).

Why keep only k and v? When token 4 is generated, you only compute its own q4, k4, v4. Then q4 attends to the stored k1…k3 plus k4, and takes the weighted sum over v1…v4. Earlier tokens' keys and values never need recomputing, and old queries are never used again.

## Intuition: it fills a warehouse you thought was huge

The practical problem with KV Cache is memory, for two reasons. Every token needs its own k and v, so longer sequences store more. And there is more than one set: in multi-head attention every head has its own k and v, in every layer.

Slide 35 estimates it with the [Gemma 2](https://arxiv.org/abs/2408.00118) 27B architecture table (ignoring for now that it actually uses GQA and treating all 32 heads as having their own k and v):

<details>
<summary>Expand: KV Cache size per token</summary>

46 (layers) × 32 (heads) × 128 (dimension) × 2 (FP16, 2 bytes per number) × 2 (key and value) = 753,664 bytes ≈ 736 KB ≈ 0.72 MB

An A100 has 80GB, which works out to only about 114k tokens.

</details>

Under 1MB per token sounds small, but a whole A100 holds only about 110 thousand tokens, and agents often need far more than 100k tokens of context. Everything that follows is an attempt to make the warehouse last longer.

## Mechanism 1: let queries share keys and values

**Multi-query attention (MQA)** (slide 36): you still have many queries, but they all share one set of keys and values. Only k and v are stored, so extra queries cost nothing. Lee says MQA does not perform well.

**Grouped-query attention (GQA)** (slide 37) sits in between: several sets of k and v, each shared by a group of queries. The GQA in the Gemma 2 table is this, and the slide notes that Llama, Gemma, and others use it.

Lee points out a design consequence. Why do queries share keys and values, instead of several key/value sets sharing one query? Without knowing about KV Cache, both look like valid options. Because only k and v get stored, those are the ones worth cutting.

## Mechanism 2: compress keys and values, and never decompress

**Multi-head Latent Attention (MLA)** comes from [DeepSeek-V2](https://arxiv.org/abs/2405.04434) (slides 38–43). It puts a bottleneck between the input x and the many sets of k and v. x is first compressed into a lower-dimensional vector c, and only c goes into the warehouse. Different matrices turn c back into each key or value when needed. The model has to be trained this way from the start.

Intuitively, storing compressed vectors sounds like you would have to decompress every c back into k and v for each attention step, which would eat the savings. The trick in MLA is that **you never need to decompress**.

<details>
<summary>Expand: why you can compute directly in the compressed space</summary>

Keys: k_i = W_K · c_i, so

a_i = q^T k_i = q^T W_K c_i = (W_K^T q)^T c_i = q'^T c_i, where q' = W_K^T q

Compress q into q' once (independent of sequence length), then dot it directly with each c_i. This is exact, not an approximation.

Values: v_i = W_V · c_i, so

O = Σ_i â_i v_i = Σ_i â_i W_V c_i = W_V (Σ_i â_i c_i)

Take the weighted sum over c_i in the compressed space, then decompress once at the end.

</details>

The point is to avoid decompressing anything that scales with sequence length. Lee adds that in the literature MLA can even do slightly better than standard multi-head attention.

## Mechanism 3: change the attention span

**Sliding Window Attention** (slides 44–45): each query only looks at a fixed window before it, say 4096 tokens, which puts a hard cap on the KV Cache. Each layer sees less, but a Transformer has many layers, and positions in the layer below have already looked further back. With enough depth, the effective range can still be large. The slides say it was used in a version of Mistral 7B. GPT-OSS alternates one sliding-window layer with one full-attention layer.

**StreamingLLM** (slide 46, [Efficient Streaming Language Models with Attention Sinks](https://arxiv.org/abs/2309.17453)): a plain sliding window degrades on long inputs, but if the window also includes **the first few tokens** of the sequence, performance recovers sharply, even without extra training. The paper's perplexity plots show dense attention collapsing past the training length and window attention collapsing past the window size, while StreamingLLM handles lengths it never saw in training.

Why do the first few tokens matter so much? Lee's explanation: attention weights must sum to 1, so every query has to attend to something. When there is nothing useful to look at, the model's default is to attend to the first token. Take that token away and the model no longer knows what to do.

## Mechanism 4: drop keys and values nobody uses

**Pruning KV Cache** (slides 47–48) cites two 2023 papers, [Scissorhands](https://arxiv.org/abs/2305.17118) and [H2O](https://arxiv.org/abs/2306.14048). Both observe that only a small fraction of tokens get attention at any step, and a few tokens keep soaking up most of it. So if a key/value pair goes unattended for a while, it is dropped, like clearing out warehouse stock nobody has picked up in days.

Scissorhands' results show that at 5× compression (keeping k and v for about 20% of tokens), many tasks perform about the same. Lee also notes that later work found hard tasks still degrade when k and v are dropped carelessly, and how to prune well is still an active research area.

## Back to real systems: cross-conversation caching, or money

Everything so far caches within one conversation. Slide 49 extends it **across conversations**. "大家好我是大金" and "大家好我是小金" ("Hi everyone, I'm Big Jin" vs "Little Jin") share their first five tokens, so those five tokens' k and v can simply be copied over.

The final "金" cannot be shared, though. It is the same character, but each token's representation depends on everything before it. Once "大" becomes "小", every later token's k and v change. **Only an identical prefix can be shared.**

That is the money connection. Slide 50 shows a screenshot of OpenAI's [pricing page](https://developers.openai.com/api/docs/pricing): for gpt-5.4 on the slide, short-context input is $2.50 per million tokens and cached input is $0.25. Providers can offer the discount because the keys and values are already computed. The same slide shows a figure from [OpenAI's prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching/): changing only the last few tokens still hits, but adding one token at the very front makes the whole thing a cache miss.

When are prefixes identical? **When you use an AI agent** (slides 51–52). Recall from the [OpenClaw post](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) that an agent prepends a long system prompt to everything you say: its name, its soul, its goals, all of which rarely change. So the order of the system prompt matters:

- **Stable content first**: which tools exist and how to use them, behavior rules from AGENTS.md, identity files such as SOUL.md, IDENTITY.md, and USER.md, and the available SKILLs.
- **Changing content last**: Lee's example is the date. System prompts include the current time on every call, and if that sits near the front it breaks the cache.

The slide cites [OpenClaw issue #27732](https://github.com/openclaw/openclaw/issues/27732) as a real community discussion about this ordering. Slide 53 gives a prompt-writing example: "Book me a flight from Taipei to Boston" and "Book me a flight from San Francisco to New York" share only the first few words. Rewrite both as "Book me a flight from x to y" with the values of x and y at the end, and the shared prefix gets much longer.

Slide 54 cites the January 2026 paper [Don't Break the Cache](https://arxiv.org/abs/2601.06007), which measures prompt caching on long-horizon agent tasks. The chart on the slide shows cost reductions of 79.6% for GPT-5.2, 78.5% for Claude Sonnet 4.5, 52.2% for Gemini 2.5 Pro, and 45.9% for GPT-4o.

**Try it**: dump the full prompt your agent or LLM app sends, find every field that changes per call (timestamps, user names, retrieved results), and make sure they all come after the fixed content.

## Summary table: what each method costs

Slide 55 fills in the framework from the start of the [previous post](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en):

| Method | Approach | Changes attention? | Needs training? | Other cost |
|---|---|---|---|---|
| Flash Attention | Move less data | No | No | A bit of extra compute + a bit of brain strain |
| KV Cache | Store computed keys and values | No | No | Uses memory |
| Multi-query attention | Queries share keys and values | Yes | Yes | May clearly hurt model ability |
| Grouped-query attention | Same (in groups) | Yes | Yes | |
| Multi-head Latent Attention | Compress keys and values | Yes | Yes | |
| Sliding Window Attention | Change attention span | Yes | ? | |
| StreamingLLM | Change attention span | Yes | ? | |
| Pruning KV Cache | Drop keys and values | Yes | No | May clearly hurt model ability |
| Speculative Decoding | Small model predicts the output | No (in theory) | No | The small model still costs extra compute |

The slide puts question marks in the training column for Sliding Window and StreamingLLM. Lee explains that papers differ: you can train a full-attention model and switch to a sliding window only at inference, and the original StreamingLLM paper tried both. Why Speculative Decoding does not change the result in theory is left for students to find in the original paper. That is the reading part of the [next post, HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en).

## Going deeper

- **Papers**: for MLA, the attention section of [DeepSeek-V2](https://arxiv.org/abs/2405.04434). For attention sinks, [StreamingLLM](https://arxiv.org/abs/2309.17453). For pruning, [Scissorhands](https://arxiv.org/abs/2305.17118) and [H2O](https://arxiv.org/abs/2306.14048).
- **Related on this site**: the [Stanford CS336 inference guide](/posts/ai/2026-08-22-cs336-inference-en), the [CME295 LLM systems guide](/posts/ai/2026-09-29-cme295-llm-systems-en), and [TurboQuant+](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression-en), which shrinks the KV Cache through quantization.

## What this post could and could not verify

Verified: the text and figures of slides 29–55 (the Gemma 2 table, the OpenAI pricing screenshot, and the Don't Break the Cache chart were read directly from the slide images), the video transcript (from the zh-TW captions on YouTube), and the titles of cited papers (checked on arXiv).

Not verified: the captions mishear the head count as 30 and name a different model for the pricing example; this post uses the numbers on the slides (32 heads, gpt-5.4 prices). The slide only shows a screenshot of the pricing table, and this post did not check OpenAI's current prices, so check the official page for real numbers. In the summary table, the "Other cost" cells for GQA, MLA, Sliding Window, and StreamingLLM are blank on the slide.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Faster Generation, Part 1: Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en) | Next: [HW3: LLM Fast Inference](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [inference.pdf: Speeding up language model generation (in Mandarin)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf)
- [Video: Speeding up LM generation (2/2): KV Cache (in Mandarin)](https://youtu.be/fDQaadKysSA)
- [Gemma 2: Improving Open Language Models at a Practical Size (arXiv 2408.00118)](https://arxiv.org/abs/2408.00118)
- [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model (arXiv 2405.04434)](https://arxiv.org/abs/2405.04434)
- [Efficient Streaming Language Models with Attention Sinks (StreamingLLM, arXiv 2309.17453)](https://arxiv.org/abs/2309.17453)
- [Scissorhands: Exploiting the Persistence of Importance Hypothesis for LLM KV Cache Compression at Test Time (arXiv 2305.17118)](https://arxiv.org/abs/2305.17118)
- [H2O: Heavy-Hitter Oracle for Efficient Generative Inference of Large Language Models (arXiv 2306.14048)](https://arxiv.org/abs/2306.14048)
- [OpenAI: Prompt caching guide](https://developers.openai.com/api/docs/guides/prompt-caching/)
- [OpenAI: API pricing](https://developers.openai.com/api/docs/pricing)
- [OpenClaw issue #27732](https://github.com/openclaw/openclaw/issues/27732)
- [Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks (arXiv 2601.06007)](https://arxiv.org/abs/2601.06007)
