---
title: "CMU 10-423 L19 + L21: Long Context and State Space / Hybrid Models — Three Ways Out When Attention Cost Grows Quadratically"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, long-context, attention, state-space-model, mamba, flashattention]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 18
tldr: "Lectures 19 and 21 of CMU 10-423 (Spring 2026) tackle the same problem: once a sequence gets long, the memory of standard attention and the KV cache stop fitting. L19 offers two routes: approximate attention with sparse, sliding window, or dilated patterns, or keep full attention and split the computation across GPUs with the Blockwise Parallel Transformer and Ring Attention. L21 offers a third: replace attention with state space models (S4, Mamba) that keep only a fixed-size hidden state, or interleave attention with linear attention layers in hybrid models (Jamba, Nemotron-H, Qwen3-Next)."
description: "A guide to Lectures 19 and 21 of CMU 10-423/623/723 Generative AI (Spring 2026): the context length timeline, the Needle-in-a-Haystack test, the recipe for extending short-context models, long-context ICL versus fine-tuning, approximate attention, sequence parallelism, the Blockwise Parallel Transformer and Ring Attention, plus the three representations of SSMs, S4, Mamba, linear attention, and hybrid models."
draft: false
glossary:
  - term: "Ring Attention"
    aliases: ["RingAttention"]
    definition: "Split a long sequence into blocks across devices. Each device computes attention for its own query block in blockwise fashion while passing key/value blocks to the next device around a ring, so the sequence length that fits in memory grows with the number of devices."
    context: "The centerpiece of the \"efficient full attention\" section of CMU 10-423 Lecture 19."
    links:
      - label: "Ring Attention (Liu et al., 2023)"
        url: "https://arxiv.org/abs/2310.01889"
  - term: "selective SSM"
    aliases: ["selective state space model"]
    definition: "The SSM variant used by Mamba: the parameters B and C change with the input at every time step instead of staying fixed. The cost is that the convolution kernel can no longer be precomputed, so it is implemented with a scan."
    context: "The key difference in the move from S4 to Mamba in CMU 10-423 Lecture 21."
    links:
      - label: "Mamba (Gu & Dao, 2023)"
        url: "https://arxiv.org/abs/2312.00752"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-long-context-ssm)

**This post is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 18 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and the first post in the "Advanced Topics" unit. It covers two lectures: Lecture 19, "Long Context in LLM," on March 25 (Matt Gormley), and Lecture 21, "State Space Models / Hybrid Models," on April 1 (Aran Nayebi and Matt Gormley).

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [L19 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf) and the [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf) (40 pages each), and the [L21 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf) (42 pages, no inked version). The schedule lists no readings for either lecture, so this post cites only the slides and the papers the slides credit. The course's access grade is **A3** (definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)), but the recordings sit behind a CMU Panopto login, so this post relies entirely on the slides; what was said in class is not available.

Lecture 20 on reasoning models sits between L19 and L21. This guide puts the two together because they answer the same question: **attention cost grows with the square of sequence length, so what other routes are there?**

## What the problem looks like: one video blows the context

L19 does not open with formulas. It shows a complete PyTorch program: extract 10 frames from a video with a ViT, turn each frame into a run of image tokens, and feed them into GPT-2 for video question answering. The code is fine, but the next slide shows a single error message: the input exceeds the Transformer's maximum context length of 4096 tokens.

The example makes the need concrete: multimodal inputs, long documents, and long conversations all push token counts past a model's limit. The slides then list model context lengths from 2019 to 2026 in two tables, from [GPT-2](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en)'s 1024 up to several 1M-class models in 2026, with Grok 4.20's 2M as the longest entry.

## How do you know a model actually uses its long context?

The first tool on the slides is the [Needle-in-a-Haystack test](https://github.com/gkamradt/LLMTest_NeedleInAHaystack). The slides frame it conservatively, as an "extremely simple, bare minimum" check:

1. Build a very long document
2. Bury a fact at some depth in the document
3. Ask the model a question whose answer is exactly that fact

Passing only shows the model can find information, not that it can reason over a long text.

## Extending a short-context model

The slides cite [Fu et al. 2024](https://arxiv.org/abs/2402.10171): extending a short-context model takes two key ingredients, **extensible position encodings** and **carefully selected long data**. The recipe:

- Pretrain a short-context model with a 4k block size on 1 trillion tokens
- Adjust the position encoding hyperparameters
- Continue pretraining with the block size raised to 80k, using only 5 billion tokens

"Extensible position encodings" points back to [RoPE in L4](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en).

### Long context makes ICL competitive again

In [L10 on PEFT and ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en), one slide says "fine-tuning usually beats in-context learning," with a note that this was the 2023 consensus and may no longer hold (see Lecture 19). L19 pays that off here.

The slides cite [Bertsch et al. 2024](https://arxiv.org/abs/2405.00200): given a long-context model that can hold many demonstrations, ICL sometimes beats fine-tuning. The experiments use LLaMA2-7B on two many-class classification datasets, Clinic-150 (151 classes) and Trecfine (50 classes), comparing three approaches: LoRA fine-tuning, ICL with randomly chosen training examples as demonstrations, and retrieval ICL that picks the most similar examples with BM25.

## Route one: approximate attention

The slides first name the real bottleneck: standard attention is O(N²) in both compute and memory. Compute may be tolerable; **memory usually is not**. One fix is to approximate the attention computation, and the slides list three examples:

| Method | Year | Complexity | Slide takeaway |
|---|---|---|---|
| [Sparse Attention](https://arxiv.org/abs/1904.10509) | 2019 | O(N√N) | Only some positions attend to each other |
| Sliding Window Attention ([Longformer](https://arxiv.org/abs/2004.05150)) | 2020 | O(N) | The causal mask keeps only a window |
| Dilated Attention ([LongNet](https://arxiv.org/abs/2307.02486)) | 2023 | O(N) | Mixes several dilation rates |

Sliding window is familiar from L4 and HW1. This lecture adds three ways to implement it:

1. **Full matrix multiply, then mask**: still slow
2. **A for loop**: asymptotically faster and leaner on memory, but PyTorch for loops are too slow to use in practice
3. **Sliding chunks**: cut Q and K into w×w blocks that overlap by ½w, do full attention inside each block, then mask off the extra parts; fast and memory-efficient in practice

The verdict on dilated attention is the one worth remembering: great runtime, but it "is a different model." Approximate attention changes the model itself, not just the implementation.

## Route two: keep full attention and split the computation

The second half of L19 changes direction: no approximation, just make full attention runnable.

The slides first use a figure from the Ring Attention paper to make a counterintuitive point: a Transformer LM's FLOPs do not grow with context length as fast as you might expect, because besides the O(N²) attention the model has plenty of other compute-heavy components.

Then comes a progression:

- **[Sequence parallelism](https://arxiv.org/abs/2105.13120)**: cut the long sequence into chunks, give each chunk to a device, and pass earlier devices' computations to later ones. The problem is poor scaling efficiency, because later queries still attend to O(N) keys/values.
- **[Blockwise Parallel Transformer (BPT)](https://arxiv.org/abs/2305.19370)**: [FlashAttention in L18](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en) computes blockwise only in the attention layer; BPT computes attention, the feedforward network, and the residual connections blockwise together. The key is that softmax is invariant to shifts, so attention can be computed one block at a time, with earlier outputs rescaled using the statistics of other blocks. Each query block Qᵢ walks through all key/value blocks Kⱼ, Vⱼ.
- **[Ring Attention](https://arxiv.org/abs/2310.01889)**: use BPT across multiple devices for very long sequences, and pass key/value blocks between devices in exactly the order they are used in the attention computation (the slides' nickname is "pass the parcel"). The result: the sequence length that fits in memory grows with the number of available devices.

The Ring Attention result on the slides: a 7B model handles a 4-million-token context on 32 A100s. The last slide connects to the same authors' [Large World Model](https://arxiv.org/abs/2402.08268), the academic 1M-token LWModel in the context length table.

## Route three: replace attention with state space models

L21's motivation slide states the trade-off in one line: Transformers are slow at inference because the KV cache grows linearly with sequence length; SSMs are fast at inference because, like RNNs, they keep only a fixed-size hidden state in memory. And with the right tricks, SSMs can also be trained efficiently. The slides also note that SSMs move naturally between input resolutions (for example, 16kHz versus 8kHz audio).

### One model, three representations

The core of the lecture is the three representations of an SSM. The slides' figures are adapted from Albert Gu's guest lecture in this course in Fall 2024.

**Continuous representation**: map a 1-D function x(t) to a 1-D function y(t) through an N-dimensional hidden state h(t):

```text
h'(t) = A h(t) + B x(t)
y(t)  = C h(t) + D x(t)
```

It can represent any continuous 1-D-to-1-D function, but cannot handle real data directly.

**Discrete recurrent representation**: replace the continuous parameters A, B, C, D with functions of them, Ā, B̄, C̄, D̄, giving the same recurrence as an RNN:

```text
h_{k+1} = Ā h_k + B̄ x_k
y_k     = C̄ h_k + D̄ x_k
```

S4 discretizes with the bilinear transformation (a first-order Padé approximation).

**Convolutional representation**: assume the initial state is 0 and unroll the recurrence. Each y_k is a weighted sum of past inputs, with weights C̄ Āʲ B̄. The whole sequence can therefore be written as one global convolution y = K̄ ∗ x, with kernel K̄ = (C̄B̄, C̄ĀB̄, …, C̄Ā^(L−1)B̄). **All y_k can be computed in parallel.**

<details>
<summary>Expand: the first three steps from recurrence to convolution</summary>

Let h₋₁ = 0 and ignore D̄ for now:

- h₀ = B̄x₀, so y₀ = C̄B̄x₀
- h₁ = ĀB̄x₀ + B̄x₁, so y₁ = C̄ĀB̄x₀ + C̄B̄x₁
- h₂ = Ā²B̄x₀ + ĀB̄x₁ + B̄x₂, so y₂ = C̄Ā²B̄x₀ + C̄ĀB̄x₁ + C̄B̄x₂

The pattern is y_k = Σⱼ C̄ Ā^(k−j) B̄ xⱼ. The coefficient depends only on the distance k−j, which is exactly a convolution.

</details>

### Why you want both representations

The slides put the three model families in one table:

| | Training | Inference |
|---|---|---|
| Recurrent (RNN) | Slow | Fast |
| Attention | Fast | Slow |
| SSM | Fast | Fast |

At inference an SSM uses the recurrent form, needs no KV cache, and can generate truly long sequences; at training it uses the convolutional form and trains in parallel like a Transformer.

To use SSMs in a language model, the approach resembles multi-head attention: take H copies of a 1-D SSM, each with its own parameters, like heads in attention or channels in a convolution. An S4 LM stacks many SSM layers (plus nonlinearities and other sublayers), and the language modeling part is the same as in an RNN-LM or Transformer-LM.

### Two tricks S4 needs

The slides warn that numerical instability is especially severe here. S4 needs:

- **The HiPPO matrix**: initialize A very carefully
- **Efficient computation**: decompose A so the kernel K̄ can be computed efficiently and stably

### Mamba: parameters that follow the input

[Mamba](https://arxiv.org/abs/2312.00752)'s selective state space model differs from S4 in that the parameters B and C change at every time step. The cost is that the kernel K̄ cannot be computed once in advance; an efficient scan is used instead (the slide notes "recall the FlashAttention lecture" here). The slides' conclusion: Mamba is the first non-attention language model that can challenge Transformers.

### Linear attention: the bridge between Transformers and SSMs

Linear attention is standard attention with the softmax removed. Without the softmax it can be rewritten as a recurrence, which gives a direct link between Transformers and SSMs. The slide's figure comes from the [Gated Delta Networks](https://arxiv.org/abs/2412.06464) paper and lists many proposed forms of linear attention.

## Hybrid models: the best of both

The final part of L21 covers hybrid models. The slides list three motivations: scalability to long contexts, better hardware utilization, and generalization from mixing different inductive biases. The three examples share one design: **standard attention layers interleaved with linear attention layers**. The former are quadratic in sequence length and the latter linear; the goal is lower memory and faster generation.

| Model | Slide takeaway |
|---|---|
| [Jamba](https://arxiv.org/abs/2403.19887) | Called by the slides the first hybrid combining Transformer and SSM layers (2024); shrinks the long-context KV cache sharply, fits longer contexts on one GPU, and has higher generation throughput |
| [Nemotron-H](https://arxiv.org/abs/2504.03624) | Keeps the performance of a standard Transformer (Nemotron-T) while greatly increasing throughput; also has a VLM version |
| [Qwen3-Next](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd) | Uses Gated DeltaNet layers in place of ordinary linear attention layers; cuts training and generation time substantially compared with a dense model of the same size |

## The three routes in one table

| Route | What changes | Cost | Source |
|---|---|---|---|
| Approximate attention | The sparsity pattern of attention | It becomes a different model | L19 |
| Full attention + blockwise / multi-device | Scheduling of compute and communication | Needs many devices | L19 |
| SSM / hybrid | Replace some or all attention with fixed-state layers | Needs special initialization and a scan implementation | L21 |

## How the course tests these lectures

- **Quizzes**: the schedule puts L19 in Quiz 5 (April 6, L16–L20) and L21 in Quiz 6 (April 20, L21–L24). The questions are not public.
- **Exam**: the reminder slide in L19 states that the March 30 evening exam covers only Lectures 1–15, so these lectures are outside the exam, and the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) has no matching questions.
- **Homework**: there is no programming homework after L15. Readers who want hands-on work can use these lectures as a starting point for a final project or a [HW623](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) topic.

**Try this tonight**: take a discrete SSM with N = 1 (a scalar), set Ā = 0.5, B̄ = 1, C̄ = 2, and input x = [1, 0, 3, 1]. First compute y step by step with the recurrence, then compute the kernel K̄ = [2, 1, 0.5, 0.25] and do one convolution, and check that the results match. After doing it once, "train with convolution, infer with recurrence" stops being a slogan.

## What this post can and cannot confirm

Confirmed: the schedule's dates, speakers, and quiz coverage; the text, tables, and credits on both slide decks; and the titles of the papers the slides cite (checked against arXiv). Not confirmed: what was said in class (Panopto requires login), numbers shown only in figures (for example, the Needle-in-a-Haystack heatmaps, the Mamba and Jamba experiment curves, and the S4 discretization formulas shown as images), and official answers to the in-class questions on the slides. The text extracted from the L19 inked version matches the original; I did not compare the handwritten annotations page by page. The model specs in the context length table are the slides' own compilation; this post did not check each against the vendors' documentation.

Further reading: this site's [CS336 architectures and hyperparameters post](/posts/ai/2026-08-22-cs336-architectures-hyperparameters-en) and [inference post](/posts/ai/2026-08-22-cs336-inference-en) discuss position encodings and the KV cache from the angle of training your own LM; the [CMU 11-868 guide](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) covers distributed training and inference from the systems side.

Series navigation: previous [L17–L18: distributed training, FlashAttention, and efficient decoding](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en) | next [L20: reasoning models](/posts/ai/2026-09-30-cmu10423-reasoning-models-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (L19 and L21 dates and quiz coverage)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 19 slides: Long Context in LLMs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lecture 19 slides (inked)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf)
- [Lecture 21 slides: State Space Models + Hybrid Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [Fu et al. 2024: Data Engineering for Scaling Language Models to 128K Context](https://arxiv.org/abs/2402.10171)
- [Bertsch et al. 2024: In-Context Learning with Long-Context Models: An In-Depth Exploration](https://arxiv.org/abs/2405.00200)
- [Child et al. 2019: Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509)
- [Beltagy et al. 2020: Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Ding et al. 2023: LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486)
- [Li et al. 2021: Sequence Parallelism: Long Sequence Training from System Perspective](https://arxiv.org/abs/2105.13120)
- [Liu & Abbeel 2023: Blockwise Parallel Transformer for Large Context Models](https://arxiv.org/abs/2305.19370)
- [Liu et al. 2023: Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Liu et al. 2024: World Model on Million-Length Video And Language With Blockwise RingAttention](https://arxiv.org/abs/2402.08268)
- [Hazy Research: The Annotated S4 blog series (source of slide figures)](https://hazyresearch.stanford.edu/blog/2022-01-14-s4-3)
- [Gu & Dao 2023: Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)
- [Yang et al. 2024: Gated Delta Networks: Improving Mamba2 with Delta Rule](https://arxiv.org/abs/2412.06464)
- [Lieber et al. 2024: Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887)
- [NVIDIA 2025: Nemotron-H: A Family of Accurate and Efficient Hybrid Mamba-Transformer Models](https://arxiv.org/abs/2504.03624)
- [Qwen3-Next official blog post](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
