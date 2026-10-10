---
title: "MIT 6.5940 L15 Long-Context LLM: When Context Grows, the KV Cache Breaks First"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, long-context, kv-cache, attention, mamba]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 19
tldr: "Lecture 15 has four parts. Extending context: interpolating RoPE stretches LLaMA from 2k to 32k, and LongLoRA's shifted sparse attention makes long-context fine-tuning cheap. Evaluation: lost-in-the-middle, Needle-in-a-Haystack, and LongBench. Efficient attention: the KV cache grows linearly with length. StreamingLLM finds that the first few tokens act as attention sinks, and keeping them plus a recent window gives stable generation. DuoAttention keeps a full KV cache only for a few retrieval heads. Quest keeps the whole KV cache but reads only the most critical pages for each query. The last part moves beyond Transformers: Mamba replaces attention with a selective SSM, and Jamba mixes the two."
description: "A guide to Lecture 15 of MIT 6.5940 EfficientML (Fall 2024), Long-Context LLM: RoPE and position interpolation, LongLoRA, lost-in-the-middle, NIAH and LongBench, sizing the KV cache, StreamingLLM and attention sinks, DuoAttention's retrieval and streaming heads, Quest's query-aware sparsity, plus Mamba and Jamba. Includes a Fall 2026 comparison."
draft: false
glossary:
  - term: "attention sink"
    definition: "The first few tokens of a sequence receive unusually high attention scores regardless of their meaning. Softmax scores must sum to one, and in an autoregressive model the initial tokens are visible to every later position, so surplus attention piles up on them."
    context: "The central observation of Lecture 15's StreamingLLM section. Evict them from the KV cache and window attention's perplexity explodes."
  - term: "retrieval head"
    definition: "DuoAttention's term for attention heads that need the full context to pull back key information from early positions. The other type, streaming heads, look only at attention sinks and recent tokens and need only a fixed-length KV cache."
    context: "Lecture 15, pages 43–49. DuoAttention uses trainable gates to find which heads are retrieval heads."
  - term: "query-aware sparsity"
    definition: "Quest's approach: discard no KV cache at all. Instead, estimate each KV page's maximum possible attention score for the current query and load only the top-scoring pages for attention."
    context: "Lecture 15, pages 55–66. It fixes a weakness of methods that evict tokens based on past attention scores: they may drop information a future query needs."
  - term: "Mamba"
    definition: "A sequence model that replaces attention with a selective state space model (SSM) for communication between tokens. Its state transition matrices depend on the input, and processing a sequence of length n takes linear time."
    context: "Lecture 15, pages 68–72, in the \"Beyond Transformers\" section."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-long-context-llm)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024.** It is post 19 in the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series.

**Series**: previous [L14 LLM Post-Training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) | next [L16–L17 Efficient ViT, GANs, Video, and Point Clouds](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [Lec15-Long-Context-LLM.pdf](https://www.dropbox.com/scl/fi/aorbruqhmbu3cpqtnbuyo/Lec15-Long-Context-LLM.pdf?rlkey=i7d5urg0m4mm96wc82nx76lgs&st=nssefmxf&dl=0) (78 pages; all page numbers below refer to this PDF) and the [Lecture 15 recording](https://youtu.be/kgTWKjbnrBA). The F24 schedule puts this lecture on October 29, 2024. Access level **A3**: slides and video are public, and no lab goes with this lecture. Checked on 2026-09-30.

**Fall 2026 comparison**: The [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) also schedules "Long Context LLM" (Lecture 15, November 3). As of 2026-09-30 its slides and video are not up yet.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=kgTWKjbnrBA
title: Lecture 15 recording (YouTube)
```

Original videos: [Lecture 15 recording (YouTube)](https://www.youtube.com/watch?v=kgTWKjbnrBA)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## What this lecture is about

If you want an LLM to read a whole book, watch an hour of video, or chat with you for hundreds of turns, you hit three walls at once. The model breaks beyond its training length. It may not actually use the long context. And the KV cache gets too big to fit. The Lecture Plan on page 2 maps onto these three walls, plus one section on alternatives to the Transformer:

| Part | Slides | Content |
|---|---|---|
| 1. Context extension | 4–12 | RoPE recap, LongLoRA |
| 2. Evaluating long context | 14–17 | Lost-in-the-middle, Needle-in-a-Haystack, LongBench |
| 3. Efficient attention | 19–66 | KV cache recap, StreamingLLM and attention sinks, DuoAttention, Quest |
| 4. Beyond Transformers | 68–73 | Mamba (SSM), Jamba (hybrid) |

Part 3 takes up nearly 50 slides, and the slides label StreamingLLM and Quest as the lab's own work ("ours", "our insight"). It's the focus of this post.

## Part 1: Stretching the context

### RoPE and interpolation

Page 4 recaps [RoPE](https://arxiv.org/abs/2104.09864). Split a d-dimensional embedding into d/2 pairs, treat each pair as a 2D coordinate, and rotate it according to position m. The phase difference in the inner product of two such vectors depends only on m−n, so the encoding is relative.

Page 5 shows RoPE's payoff. LLMs usually have a training-length limit (the slide lists 2k for LLaMA, 4k for Llama-2, 8k for GPT-4) and fail beyond it. Shrinking the rotation angles ([position interpolation](https://arxiv.org/abs/2306.15595)) extends LLaMA from 2k to 32k. The slide flags one catch: **you usually still need to fine-tune after extending**.

### LongLoRA: making long-context fine-tuning cheap

Fine-tuning means training on long sequences, and at long context attention is the bottleneck. [LongLoRA](https://arxiv.org/abs/2309.12307) (pages 7–12) has two components:

- **Shifted sparse attention (S²-Attn)**, used only during training. Split the attention heads in two, group the tokens, and attend within each group. One half of the heads shifts the grouping by half a group so information can flow across groups. At inference, switch back to full attention.
- **Enhanced LoRA**: besides the LoRA branches, also train the input embedding and normalization layers. The added parameters are tiny: under 0.004% for norms and under 2% for embeddings.

Page 12 checks topic retrieval and passkey retrieval. Both work within the fine-tuned context length.

## Part 2: Does the model actually use long context?

- **Lost in the middle** (page 14): [Liu et al.](https://arxiv.org/abs/2307.03172) test multi-document QA and key-value retrieval. Performance changes significantly depending on where the relevant information sits.
- **Needle-in-a-Haystack** (page 16): insert the sentence "The best thing in San Francisco is eating a sandwich and sitting in Dolores Park on a sunny day" at different depths of a long document, then ask the model at the end what the best thing to do in San Francisco is. The test harness is [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack).
- **LongBench** (page 17): synthetic tasks alone say little about real use. [LongBench](https://arxiv.org/abs/2308.14508) has 21 datasets across 6 task types (QA, summarization, few-shot learning, and more), in English and Chinese, with contexts of 13,000+ tokens.

These tests come back again and again. LongLoRA, DuoAttention, and Quest all use passkey/NIAH or LongBench to show they haven't damaged long-context ability.

## Part 3: The KV cache problem and three fixes

### First, how big is the KV cache?

The formula on page 19 (assuming Llama-2-70B uses MHA):

$$
\underbrace{BS}_{\text{batch}}\times\underbrace{80}_{\text{layers}}\times\underbrace{64}_{\text{kv heads}}\times\underbrace{128}_{d}\times\underbrace{N}_{\text{length}}\times\underbrace{2}_{K\&V}\times 2\,\text{bytes}=2.5\,\text{MB}\times BS\times N
$$

Batch 1 at length 512 needs 1.25 GB. At length 4096 it needs 10 GB. Batch 16 at length 4096 needs 160 GB, which takes two A100s. The chart on page 20 shows that as the batch grows, the KV cache quickly outgrows the model weights.

### StreamingLLM: keep the start, drop the middle

**The situation** (pages 22–26). Streaming applications such as multi-round dialogue need to keep generating. Two problems: memory keeps growing during decoding, and the model fails past its training length. The slides compare several approaches by perplexity (lower is better):

| Approach | Complexity | PPL |
|---|---|---|
| Dense attention | $O(T^2)$ | 5641 |
| Window attention (keep the last L) | $O(TL)$ | 5158 |
| Sliding window + recompute each step | $O(TL^2)$ | 5.43 |
| **StreamingLLM** | $O(TL)$ | **5.40** |

Window attention is cheap, but **the model collapses as soon as the initial tokens leave the cache**. Why do those first few tokens matter so much?

**Intuition** (pages 27–29). The initial tokens get very large attention scores even when they carry no special meaning. These are **attention sinks**. There are two reasons. Softmax scores must sum to one, so surplus attention has to land somewhere. And in an autoregressive model, the initial tokens are visible to every later position, which makes them the easiest place to dump it. Experimentally, replacing the start with four "\n" tokens also recovers perplexity, so what matters is **position**, not meaning. Page 28 notes that the lab saw this phenomenon in the SpAtten project in 2021 but couldn't explain it until 2023.

**Mechanism** (pages 30–31). [StreamingLLM](https://arxiv.org/abs/2309.17453) keeps the KV of the attention sinks plus a recent sliding window and drops everything in between. Positional encoding uses each token's **position within the cache**, not its position in the original text. No extra training is needed.

**Results** (pages 32–37):

- Llama-2, MPT, Falcon, and Pythia model up to 4 million tokens stably.
- Up to 22.2x faster than sliding window with recomputation.
- Four attention sinks are generally enough.
- If you pretrain with a dedicated learnable sink token at the start of every sample, you only need to keep that one token.
- ViT and BERT have attention sinks too: in ViT they appear on low-information background pixels, and in BERT on the [SEP] token at the end of sentences.

Page 38 names the limitation: **non-stop chatting ≠ infinite context**. Tokens evicted from the cache can never be attended to again. The next two methods address that gap.

### DuoAttention: not every head needs the full context

**The situation** (pages 40–41). A 224×224 image is 256 tokens. An hour of video at 1 FPS is 1 million tokens. The slide's figure: Llama-3-8B needs 137 GB of KV cache for a 1-million-token context.

**Intuition** (pages 43–44). [DuoAttention](https://arxiv.org/abs/2410.10819) splits heads into two kinds:

- **Retrieval heads** pull key tokens from far back in the sequence. They need the full KV cache, and compressing it hurts accuracy significantly.
- **Streaming heads** look only at recent tokens and attention sinks. A fixed-length cache is enough.

So only retrieval heads get a full KV cache, and the rest use a small StreamingLLM-style cache.

**Mechanism** (pages 45–48):

1. Give each head a trainable gate value α that blends the outputs of full attention and streaming attention. The objective is to stay as close as possible to the original full-attention model's output.
2. Train on synthetic data: ten passkeys buried in a long text, which the model has to recall. This surfaces the heads responsible for long-range retrieval.
3. Only about 1000 gate values get trained (for example, 32 layers × 32 heads in Llama-2-7B). It takes a few hours on 8 A100s.
4. At deployment, binarize α to decide each head's type, then reorder heads so the two types are stored contiguously, which makes slicing the KV cache efficient.

**Results** (pages 49–53): On NIAH, full attention on 25% of heads for MHA models and 50% for GQA models gives accuracy close to full attention. Decoding memory drops by up to 2.45x (MHA) and 1.65x (GQA), and latency improves by 2.13x and 1.5x. Combined with 8-bit weights and 4-bit KV cache quantization, a single A100 handles 3.3 million tokens.

### Quest: discard nothing, read selectively

**The problem** (pages 55–57). Methods like SpAtten and H2O decide which tokens to drop based on past attention scores. But a dropped token might matter to a **future** query. Page 57's example: token "B" matters to no query until the final query "is" arrives, and then it becomes critical. Whether a token is important depends on the current query.

**Mechanism** (pages 58–59). [Quest](https://arxiv.org/abs/2406.10774) keeps the **entire** KV cache but splits it into pages and loads only the K most critical pages at each decoding step. To pick pages quickly, it uses an **upper bound** on each page's attention weights to estimate the highest score that page could produce.

**Results** (pages 60–66):

- On passkey retrieval, a KV budget of about 1% of the sequence length gets near-perfect accuracy.
- On LongBench, a 2k-token budget comes close to the full KV cache.
- At sequence length 32k with a 2048 budget, self-attention is 7.03x faster than FlashInfer. With 4-bit AWQ weights, end-to-end inference at 30K is 2.23x faster.

Side by side: StreamingLLM drops the middle (cheap, but it forgets). DuoAttention splits the work by head (some heads never forget). Quest keeps everything and reads selectively per query (it never forgets, but it saves memory traffic rather than capacity).

## Part 4: Beyond Transformers

### Mamba: replacing attention with an SSM

Page 68 splits an LLM's work into two kinds: communication between tokens (attention in a Transformer) and computation within a token (the MLP). [Mamba](https://arxiv.org/abs/2312.00752) replaces the first with a state space model, which processes long sequences in linear time.

- **What an SSM is** (page 69): the state h holds the current understanding of the sequence. A decides how the state forgets and updates, B decides what part of new input to remember, and C decides how to use the state for prediction.
- **Selectivity** (page 70): in a regular SSM, A, B, and C are fixed learned parameters independent of the input. Mamba makes them functions of the input x, so each token can write into the state in its own way.
- **The cost and the fix** (pages 71–72): when parameters don't depend on the input, you can precompute the whole thing as a convolution kernel to speed up training. Selectivity rules that out, and a step-by-step recurrence is too slow. The fix: computing the states looks a lot like a prefix sum over an array, so a parallel scan can parallelize it.

### Jamba: mixing both

[Jamba](https://arxiv.org/abs/2403.19887) (page 73) interleaves Transformer and Mamba layers to cut memory needs, then adds MoE layers to raise capacity while keeping active parameters low. The slide's figure: it fits on a single 80GB GPU with support for 256K tokens.

> Pages 75–78 announce a WorldModelBench annotation competition for the 2024 class (October 29 – November 4, MIT email required). It isn't related to the lecture content, and readers outside MIT can skip it.

## How to self-study this lecture

1. Use the formula on page 19 on a model you use. Look up its layer count, number of KV heads (GQA models have far fewer than MHA), and head dimension. How many GB does one request need at 32K context?
2. Read the four-row table on page 26 next to the diagram on page 30. Make sure you can explain why window attention collapses and why keeping just 4 more tokens stops StreamingLLM from collapsing.
3. One thing you can do tonight: open [tomaarsen/attention_sinks](https://github.com/tomaarsen/attention_sinks), the repo cited on page 22. Look at the README's perplexity plots and endless-generation logs for `transformers`, `windowed`, and `attention_sinks` loading (windowed loses fluency once the first tokens leave the window). Then use its drop-in replacement for the `transformers` API and run it on a small model of your own.

## Further reading

- Same series: [L12 Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) (where the KV cache first appears), [L13 LLM Deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) (SpAtten, H2O, PagedAttention), [L14 LLM Post-Training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) (LoRA)
- KV cache: [CMU 11-868: serving at scale and the KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en), [NTU Hung-yi Lee ML 2026: the KV cache and how to slim it](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en)
- Long context and SSMs: [CMU 10-423 L19 + L21: long context and state space/hybrid models](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en)
- Inference systems: [CS336 Inference](/posts/ai/2026-08-22-cs336-inference-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Lec15-Long-Context-LLM.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/aorbruqhmbu3cpqtnbuyo/Lec15-Long-Context-LLM.pdf?rlkey=i7d5urg0m4mm96wc82nx76lgs&st=nssefmxf&dl=0) — source for all page numbers, figures, and section boundaries in this post
- [Lecture 15 recording (YouTube)](https://youtu.be/kgTWKjbnrBA)
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule and dates
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 15 schedule and release status
- [Su et al., RoFormer (RoPE)](https://arxiv.org/abs/2104.09864), [Chen et al., Position Interpolation](https://arxiv.org/abs/2306.15595), [Chen et al., LongLoRA](https://arxiv.org/abs/2309.12307)
- [Liu et al., Lost in the Middle](https://arxiv.org/abs/2307.03172), [gkamradt/LLMTest_NeedleInAHaystack (GitHub)](https://github.com/gkamradt/LLMTest_NeedleInAHaystack), [Bai et al., LongBench](https://arxiv.org/abs/2308.14508)
- [Databricks, LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — source of the KV cache formula on pages 19–20
- [Xiao et al., StreamingLLM (Efficient Streaming Language Models with Attention Sinks)](https://arxiv.org/abs/2309.17453)
- [Xiao et al., DuoAttention](https://arxiv.org/abs/2410.10819), [Tang et al., Quest](https://arxiv.org/abs/2406.10774)
- [Gu & Dao, Mamba](https://arxiv.org/abs/2312.00752), [Lieber et al., Jamba](https://arxiv.org/abs/2403.19887)
