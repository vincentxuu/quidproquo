---
title: "CMU 10-423 L4: Pre-training, Fine-tuning, and the Modern Transformer — What RoPE, GQA, and Sliding Windows Each Fix"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, transformer, attention, pre-training, long-context]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 3
tldr: "The first half of CMU 10-423 Lecture 4 separates pre-training, mid-training, and post-training. The second half picks three components that nearly every modern LLM uses. RoPE turns position into a rotation of queries and keys, so attention scores depend only on the relative distance between two tokens. GQA lets several query heads share one key/value head to save memory and compute. Sliding window attention changes the mask so each token sees only a fixed number of tokens to its left. All three show up in HW1."
description: "A guide to Lecture 4 of CMU 10-423/623/723 Generative AI (Spring 2026): definitions of pre-training and fine-tuning, the pre-/mid-/post-training pipeline for LLMs, the slide deck's list of modern LLMs, and the motivation and math behind RoPE, grouped query attention, and sliding window attention, mapped to HW1 and the practice exam."
draft: false
glossary:
  - term: "RoPE"
    aliases: ["rotary position embeddings"]
    definition: "Splits each query and key vector into d/2 two-dimensional pieces and rotates each piece by a position-dependent angle, so the attention score between two tokens depends only on their relative distance."
    context: "The first modern component in CMU 10-423 Lecture 4; HW1 asks you to implement it in minGPT."
    links:
      - label: "RoFormer (Su et al., 2021)"
        url: "https://arxiv.org/abs/2104.09864"
  - term: "GQA"
    aliases: ["grouped query attention", "grouped-query attention"]
    definition: "Groups the query heads so each group shares one key head and one value head. With as many key/value heads as query heads it is ordinary multi-head attention; with a single one it is multi-query attention."
    context: "The second modern component in CMU 10-423 Lecture 4; HW1 asks you to measure its effect on attention time."
    links:
      - label: "GQA (Ainslie et al., 2023)"
        url: "https://arxiv.org/abs/2305.13245"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 3 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and follows [L2–L3: Transformer LMs and decoding](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en). It covers Lecture 4, "Pre-training, fine-tuning / Modern Transformers," taught by Matt Gormley on January 26, 2026.

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf) (44 pages) and the [inked in-class version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf) (47 pages), plus the three readings on the schedule: [GQA](https://arxiv.org/pdf/2305.13245.pdf), [Longformer](https://arxiv.org/pdf/2004.05150.pdf), and [RoFormer](https://arxiv.org/pdf/2104.09864.pdf). The course is rated **A3** (see the grading in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)). The recordings sit behind CMU's Panopto login, so this post relies entirely on the slides; anything said only out loud in class is out of reach.

This is the last lecture of the text unit. The schedule marks "HW1 out (L1-L4)" on the same day, and Quiz 1 two days later also covers L1–L4. The three components in this lecture are exactly what the next post, [HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en), asks you to build.

## First half: what separates pre-training from fine-tuning

The slides start with two definitions:

| | Pre-training | Fine-tuning |
|---|---|---|
| Initialization | Random | Parameters from pre-training |
| Data | Option A: unsupervised training on a very large unlabeled set; Option B: supervised training on a very large labeled set | Data for the target task, usually much less |
| Procedure | Train from scratch | Optionally add a small, randomly initialized prediction head, then train by backprop |

Three sets of examples then apply the same definitions:

- **Vision**: pre-training can be an autoencoder on MNIST (unsupervised) or classification on ImageNet with 21k classes and 14M images (supervised). Fine-tuning is COCO object detection or ADE20k semantic segmentation.
- **History**: the slides cite Bengio et al. (2006) on MNIST, comparing a shallow net, a deep net without pre-training, supervised pre-training, and unsupervised pre-training. The point is that deep learning took off in 2006 because of pre-training.
- **Language models**: pre-training maximizes the likelihood of a large set of unlabeled sentences, such as The Pile and Dolma (3 trillion tokens). Fine-tuning examples are MMLU (57 tasks) and MBPP code generation (about 400 training examples).

The slides also note that today's vision models mostly do supervised pre-training on a massive labeled dataset, and that [ViT](https://arxiv.org/pdf/2010.11929.pdf) succeeded largely because of a much larger pre-training set. The next lecture, [CNNs, BERT, and ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en), comes back to this.

### The three-stage LLM pipeline

The slides split modern LLM training into three stages:

1. **Pre-training**: maximize likelihood on a large amount of unlabeled text.
2. **Mid-training**: the same procedure on higher-quality data, for example Dolmino Mix 1124 (100B–300B tokens).
3. **Post-training**: some combination of instruction tuning, RLHF/DPO, RLVR (reinforcement learning with verifiable rewards), safety tuning, and task-specific fine-tuning, usually with small amounts of supervised data.

The post-training methods arrive in the course's third unit; in this series that is the order-11 post on IFT, RLHF, and DPO.

## The modern Transformer list: what changed since 2017

The second half opens with two dense pages of models, from PaLM, Llama 1–4, Falcon, Mistral, Qwen, OLMo, and Gemma 1–3 to DeepSeek-R1/V3, gpt-oss, and Olmo 3. Each entry records what changed from the previous generation. The recurring terms are RoPE, GQA, MQA, SwiGLU, RMSNorm, and sliding window.

A few concrete entries from the slides:

- Llama-2 vs. Llama-1: GQA instead of multi-head attention, and context length 4096 instead of 2048.
- Mistral: sliding window attention (W = 4096) plus GQA, with a rolling buffer cache that overwrites position i into position i mod W.
- Gemma 2: local sliding window attention interleaved with global self-attention.
- Olmo 3: MHA at 7B, GQA at 32B, both with RoPE and sliding window.

A self-deprecating slide follows: "It sure would be nice if we could keep this list of Modern LLMs automatically updated… Can an LLM do this for me?" The answer is "You would think so, but…" next to several entries marked "wrong." The RoPE section later repeats the joke with a version of the formula that has multiple errors flagged.

From this list, the slides pick three components to study: RoPE, GQA, and sliding window attention.

## RoPE: writing position into the attention score

### The problem it fixes

The original Transformer used absolute position embeddings. Page 45 of the inked version (the plain version lacks this page) puts it this way. Absolute encodings (sinusoidal or learned) give each position a unique vector, and the model has to infer relative distances by comparing them. Relative encodings (Shaw et al. 2018, T5) model the distance directly, so the score between tokens i and j depends explicitly on i − j.

The HW1 handout adds another angle. Absolute position embeddings are added to the word embeddings only in the first layer, and later layers rely on position information passed up from below. RoPE puts position into the attention computation of **every** layer.

### How it works

The key idea on slide 34 has three parts:

1. Break each d-dimensional query and key vector into d/2 vectors of length 2.
2. Rotate each 2D vector by an amount scaled by the position m.
3. m is the absolute position of the query or key.

Each piece rotates at its own rate. Piece i has angular rate θᵢ = 10000^(−2(i−1)/d) for i = 1 to d/2. These values are fixed ahead of time, not learned.

Inked page 46 writes down the key observation: the rotation matrices satisfy (R_i)ᵀ R_j = R_(j−i). So once the rotated query and key are multiplied, only their relative position t − j remains. RoPE rotates by absolute position and ends up with a relative position encoding.

<details>
<summary>The slide formulas side by side (standard vs. RoPE attention)</summary>

```text
Standard attention             RoPE attention
q_j = W_qᵀ x_j                 q_j = W_qᵀ x_j        k_j = W_kᵀ x_j
k_j = W_kᵀ x_j                 q̃_j = R_(Θ,j) q_j     k̃_j = R_(Θ,j) k_j
s_(t,j) = k_jᵀ q_t / √d_k      s_(t,j) = k̃_jᵀ q̃_t / √d_k
a_t = softmax(s_t)             a_t = softmax(s_t)

R_(Θ,m) is a d_k × d_k block-diagonal matrix whose i-th 2×2 block is
  [ cos mθ_i  −sin mθ_i ]
  [ sin mθ_i   cos mθ_i ]
Θ = { θ_i = 10000^(−2(i−1)/d), i = 1, …, d/2 }
```

Slides 42–43 then explain that because R is block-sparse, you never need a real matrix multiply. Multiply the vector elementwise by a cosine vector, then add the "pairwise swapped and negated" vector multiplied elementwise by a sine vector. The matrix version rearranges the left and right halves of the whole Q (or K) and multiplies them elementwise by the cos and sin of an N × d angle matrix C. HW1 asks you to implement this matrix version.

</details>

Next to the formulas, the slides pose two in-class questions. The public inked version leaves them unanswered:

- What advantage comes from cutting the vector into 2D vectors and rotating each of them?
- Why do we rotate the different 2D vectors by different amounts?

The [RoFormer abstract](https://arxiv.org/abs/2104.09864) offers clues. It says RoPE encodes absolute position with a rotation matrix while incorporating explicit relative position dependency in self-attention, and lists flexibility in sequence length and inter-token dependency that decays with relative distance among its properties.

## GQA: letting query heads share keys and values

### The problem it fixes

The recap at the start of Lecture 5 says it plainly: Transformers are computation and memory intensive. GQA reuses some of the key/value heads while keeping the same number of query heads, which cuts computation and memory.

### How it works

The slides first recall multi-head attention, where each head has its own W_q, W_k, and W_v. GQA defines three numbers:

- h_q: number of query heads
- h_kv: number of key/value heads, with h_q assumed divisible by h_kv
- g = h_q / h_kv: the group size, i.e. how many query heads one key/value head serves

Each parameter matrix keeps its size; there are just fewer key/value matrices. All g query heads in group i score against the same K⁽ⁱ⁾ and weight the same V⁽ⁱ⁾. The h_q outputs are concatenated and multiplied by the output matrix W_o.

The two extremes have names: h_kv = h_q is ordinary multi-head attention (MHA), and h_kv = 1 is multi-query attention (MQA). In the slide list, PaLM (2022) and the first Gemma (2024) use MQA.

The [GQA abstract](https://arxiv.org/abs/2305.13245) states the motivation. MQA uses a single key-value head and drastically speeds up decoder inference, but it can degrade quality. The paper contributes two things: a recipe to "uptrain" existing multi-head checkpoints into MQA using 5% of the original pre-training compute, and GQA as the in-between design. Its conclusion is that uptrained GQA reaches quality close to MHA at speed comparable to MQA.

## Sliding window attention: look only at a fixed number of tokens to the left

### The problem it fixes

Slide 54: regular attention is computationally expensive and needs a lot of memory. Sliding window attention, also called local attention, was introduced for the Longformer model (2020), according to the slides.

### How it works

It keeps the formula and changes only the causal mask M. Each token attends to a window of ½w + 1 tokens, with the rightmost element being the token itself (the diagonal of the mask). The slides show regular causal attention, w = 4, and w = 6 side by side. The Lecture 5 recap summarizes the effect: attention drops from quadratic to linear time.

The slides list three ways to implement it:

| Implementation | Trade-off |
|---|---|
| Plain matrix multiply plus mask | Simple, but still slow |
| For-loop over tokens | Asymptotically faster with less memory, but unusable in practice because PyTorch for-loops are too slow |
| Sliding chunks | Split Q and K into w × w chunks overlapping by ½w, compute full attention within each chunk, and mask out the rest; fast and low-memory in practice |

HW1's written Question 4 (11 points) starts from this table. It asks for the time and space complexity of the plain matrix-multiply version, then asks you to write more efficient pseudocode. The next post has the details.

The [Longformer abstract](https://arxiv.org/abs/2004.05150) describes an attention mechanism that scales linearly with sequence length and combines local windowed attention with task-motivated global attention as a drop-in replacement for standard self-attention. Gemma 2's "interleaved local and global" entry in the slide list follows the same idea.

## The three components in one table

| Component | Problem it fixes | What it changes | In HW1 |
|---|---|---|---|
| RoPE | Absolute positions enter only at layer one; the model must infer distances | q and k in every attention layer | Programming: implement `RotaryPositionalEmbeddings` |
| GQA | Attention is memory- and compute-hungry | The number of key/value heads | Programming: implement `GroupedQueryAttention` and time it |
| Sliding window | Attention cost grows quadratically with length | The causal mask | Written: complexity analysis and pseudocode |

## How the course checks this lecture

- **Quiz 1**: in class on January 28 per the schedule, covering L1–L4. The questions are not public.
- **HW1**: RoPE and GQA are programming questions; sliding window is written. See the [HW1 guide](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en).
- **Practice exam**: Question 4 of the [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), "Pre-training, fine-tuning / Modern Transformers," is worth 17 of 167 points.

**What to do**: tonight, open the RoPE formula on slide 39. Take d = 4 and positions m = 1 and m = 3, compute R_(Θ,1)ᵀ R_(Θ,3) by hand, and check that it equals R_(Θ,2). Once that clicks, the RoPE part of HW1 is mostly a matter of tensor shapes.

## What this post can and cannot confirm

Confirmed: the schedule's dates and readings, the plain and inked slide content, and the abstracts of the three readings. Not confirmed: spoken explanations in the recordings (Panopto login required), official answers to the two RoPE in-class questions, and the Quiz 1 questions. When the slides mention The Pile, one page says 800 GB and another says 825 GB (about 1.2 trillion tokens); this post does not verify that figure independently.

Further reading: the site's [CME295 post on Transformer tricks](/posts/ai/2026-09-29-cme295-transformer-tricks-en) covers position encodings and attention variants from another course's angle. [CS336's architectures and hyperparameters post](/posts/ai/2026-08-22-cs336-architectures-hyperparameters-en) and its [attention and MoE post](/posts/ai/2026-08-22-cs336-attention-moe-en) survey the same modern components from the "train your own LM" angle.

Series navigation: previous [L2–L3: Transformer LMs, LLM training, and decoding](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en) | next [HW1: adding RoPE and GQA to minGPT](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (Lecture 4 and readings)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 slides: Pretraining vs. finetuning + Modern Transformers](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [Lecture 4 slides (inked in-class version)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf)
- [Lecture 5 slides (opening recap of modern Transformers)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [Ainslie et al. 2023: GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (EMNLP)](https://arxiv.org/abs/2305.13245)
- [Beltagy et al. 2020: Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Su et al. 2021: RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [HW1 handout (hw1.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
