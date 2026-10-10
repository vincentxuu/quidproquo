---
title: "CS231N L8: Attention, Transformers, and ViT"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, transformer, attention, vision-transformer]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 10
tldr: "Lecture 8 of CS231N Spring 2026 starts from the bottleneck in RNN translation models, abstracts attention into an operation on sets of vectors, builds up to self-attention, masking, and multiple heads, and shows the whole layer is four matrix multiplies. A Transformer block is self-attention, LayerNorm, residual connections, and an MLP; ViT turns a 224×224 image into 16×16 patches used as tokens. The lecture closes with four common post-2017 changes: Pre-Norm, QK-Norm, SwiGLU, and MoE."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 8, built from the 124-page official slides: seq2seq with attention, attention layer Q/K/V shapes, permutation equivariance and positional encoding (including RoPE), masked and multi-head attention, four matmuls and Flash Attention, the RNN/convolution/self-attention trade-offs, the Transformer block, LLM and ViT input/output design, and Pre-Norm, QK-Norm, SwiGLU, and MoE."
draft: false
glossary:
  - term: "self-attention"
    definition: "Each input vector produces its own query, key, and value. Each query computes similarities with every key, applies softmax, and uses those weights to sum the values, giving one output vector that mixes information from all inputs."
    context: "CS231N Lecture 8 writes it as Q=XW_Q, K=XW_K, V=XW_V, Y=softmax(QKᵀ/√D)V."
  - term: "permutation equivariant"
    definition: "Shuffle the inputs and the outputs get shuffled the same way, with nothing else changed: F(σ(X)) = σ(F(X))."
    context: "CS231N uses it to show that self-attention works on sets of vectors and doesn't know order on its own, which is why it needs positional encoding."
  - term: "Vision Transformer"
    aliases: ["ViT"]
    definition: "Split an image into fixed-size patches, flatten each patch and project it linearly to a vector, add positional encoding, and feed the result to a standard Transformer. For classification, average-pool the output vectors and apply a linear layer."
    context: "CS231N Lecture 8 uses a 224×224×3 image with 16×16 patches as the example."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Version note**: This post mainly follows the [Lecture 8 slides](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf) linked from the Spring 2026 [CS231N](https://cs231n.stanford.edu/) schedule (124 pages, downloaded and checked on 2026-09-30), plus the [RNNs & Transformers review slides](https://cs231n.stanford.edu/slides/2026/section_5.pdf) from the 5/1 section, whose cover says they were copied from the 2025 version. For video, watch Spring 2025's [Lecture 8: Attention and Transformers](https://www.youtube.com/watch?v=RQowiOF_FvQ); 2026 recordings are on Canvas for enrolled students only. The two years' slides are mostly the same, but the 2026 deck adds a page each on RoPE and QK-Norm, so the video won't cover those two. Access level **A3**.

**Series**: previous [A2 guide: BatchNorm, Dropout, CNNs, PyTorch, and RNN Captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) | next [L9: Object Detection, Image Segmentation, and Visualization](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

Through Lecture 7, CS231N has two kinds of structure: convolution for grids and RNNs for sequences. Lecture 8 introduces a third, and it went on to take over the territory of the other two. The summary slide says it outright: Transformers are the backbone of all large AI models today, used for language, vision, speech, and more.

The lecture follows one line: where attention came from → abstracting it into a general operation → building the Transformer out of it → turning images into something a Transformer can consume. This post follows the same line.

## Course video sources

This article uses Spring 2026 materials. The official Spring 2026 schedule (checked live on 2026-10-10) lists no recording links, and no public Spring 2026 playlist was found. The Spring 2025 recordings below come from the public Stanford Online playlist and share the lecture title, but their content may differ from the 2026 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=RQowiOF_FvQ
title: Stanford CS231N | Spring 2025 | Lecture 8: Attention and Transformers
```

Original videos: [Stanford CS231N | Spring 2025 | Lecture 8: Attention and Transformers](https://www.youtube.com/watch?v=RQowiOF_FvQ)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The problem: an RNN translator squeezed through one vector

The slides open with seq2seq translation, turning "we see the sky" into the Italian "vediamo il cielo". The encoder RNN reads the whole English sentence and hands the decoder only its final hidden state, a summary c of the sentence. The longer the sentence, the more has to fit into that one fixed-size vector.

[Bahdanau et al. 2015](https://arxiv.org/abs/1409.0473) let the decoder look back at **every** encoder hidden state each time it emits a word:

1. Compute an alignment score e_{t,i} between the previous decoder state s_{t−1} and each encoder state h_i. The slides say f_att is a linear layer.
2. Softmax turns the scores into weights a_{t,i}.
3. Sum the h_i with those weights to get a context vector c_t for this step.

Each timestep uses a different context vector, and you can plot the weights to see which source words the model attends to while translating.

The slides then point out a general operation hiding here. Decoder states act as **queries**, encoder states act as **data vectors**, and each query looks at all the data vectors and produces one output. None of this needs an RNN.

## Intuition: attention is an operation on sets

With the RNN removed, an attention layer takes a set of query vectors Q and a set of data vectors X. The slides build up the full shapes page by page:

- Project keys from X: K = XW_K; project values: V = XW_V
- Similarities E = QKᵀ / √D_Q, each entry a dot product between one query and one key
- Weights A = softmax(E), giving each query a distribution over the keys
- Output Y = AV, each output a weighted sum of values

When queries and data come from different sources, this is **cross-attention**. When the queries are computed from the same inputs (Q = XW_Q), it's **self-attention**: each input produces one output, and that output mixes information from all inputs. In practice the Q, K, and V projections are often fused into one matmul: [Q K V] = X[W_Q W_K W_V].

<details>
<summary>Full self-attention shapes (slide 47)</summary>

```text
input X          [N × D_in]
Q = X W_Q        [N × D_out]
K = X W_K        [N × D_out]
V = X W_V        [N × D_out]
E = Q Kᵀ / √D_Q   [N × N]
A = softmax(E)   [N × N]      each query normalized over all keys
Y = A V          [N × D_out]   Y_i = Σ_j A_ij V_j
```

The slides note that almost always D_Q = D_V = D_out.

</details>

## Mechanism: four properties that shape the Transformer

### 1. It doesn't know order

Permute the inputs, and Q, K, V, the similarities, the weights, and the outputs are all permuted the same way. Nothing else changes. The slides write this as F(σ(X)) = σ(F(X)) and call it **permutation equivariance**.

That's both a strength and a problem. Self-attention is a natural fit for sets, but on a sentence it can't tell "dog bites man" from "man bites dog". The slides give two fixes:

- Add a **positional encoding** to each input, a fixed function of the position index.
- **RoPE** ([Su et al. 2021](https://arxiv.org/abs/2104.09864)): map positions to angles and rotate queries and keys, so their dot product depends only on relative position. This page is new in 2026; the 2025 deck doesn't have it.

### 2. Masks control what it can see

**Masked self-attention** overrides the similarities it shouldn't see with −∞, so their softmax weights become 0. Language models use this so each token sees only the tokens before it and can't peek at the answer.

### 3. You can run several copies in parallel

**Multi-head self-attention** runs H copies of self-attention in parallel, one per head, then concatenates their outputs and projects back to the original dimension.

### 4. The whole layer is four matrix multiplies

The slides break multi-head self-attention into four steps:

1. QKV projection: [N × D] times [D × 3HD_H]
2. QK similarity: giving [H × N × N]
3. Weighting V: giving [H × N × D_H]
4. Output projection: [N × HD_H] times [HD_H × D]

The trouble is step 2's H × N × N attention matrix. The slides' example: with N = 100K and H = 64, that matrix alone takes 1.192 TB, more than a GPU holds. The fix is [Flash Attention](https://arxiv.org/abs/2205.14135), which computes steps 2 and 3 together without storing the full attention matrix, making large N feasible.

## Three ways to process sequences

The slides compare RNNs, convolution, and self-attention side by side. This table is the page most worth remembering from the lecture:

| | RNN | Convolution | Self-attention |
|---|---|---|---|
| Works on | 1D ordered sequences | N-dimensional grids | Sets of vectors |
| Long sequences | Good in theory; O(N) compute and memory | Bad; needs many stacked layers to see far | Good; each output depends directly on all inputs |
| Parallelism | No; hidden states computed sequentially | Yes | Yes; it's just four matmuls |
| Cost | — | — | Expensive: O(N²) compute, O(N) memory |

The 5/1 [section slides](https://cs231n.stanford.edu/slides/2026/section_5.pdf) add another angle. RNNs have a strong inductive bias with temporal structure built in; Transformers have a weak one and must learn it from data.

## Back to the model: the Transformer block

A block of the [Transformer](https://arxiv.org/abs/1706.03762) (Vaswani et al. 2017), from bottom to top:

1. **Multi-head self-attention**: where all vectors interact
2. **Residual connection + LayerNorm**: LayerNorm normalizes each vector on its own
3. **MLP**: usually two layers, classically D → 4D → D, also called an FFN, applied to each vector **independently**
4. Another residual connection + LayerNorm

A Transformer is just a stack of identical blocks. The slides stress three points. Self-attention is the only place vectors interact. LayerNorm and the MLP work on each vector independently. Most of the compute is just 6 matmuls, 4 in self-attention and 2 in the MLP, which makes the architecture highly scalable and parallelizable. The slides add that it hasn't changed much since 2017; it has mostly gotten a lot bigger.

### For language: LLMs

At the input, learn a [V × D] embedding matrix that turns words into vectors. Inside each block, use masked attention so each token sees only earlier tokens. At the output, learn a [D × V] projection matrix that turns each D-dimensional vector into scores over the vocabulary.

### For images: ViT

[ViT](https://arxiv.org/abs/2010.11929) (Dosovitskiy et al., ICLR 2021, titled "An Image is Worth 16x16 Words") answers the question: an image isn't a sequence of words, so how does it become Transformer input? The slides' steps:

1. Take an input image, e.g. 224×224×3.
2. Break it into patches, e.g. 16×16×3.
3. Flatten each patch (16×16×3 = 768 values) and apply a linear projection to D dimensions.
4. Add positional encoding so the Transformer knows each patch's 2D position.
5. **Use no masking**: every patch can look at every other patch.
6. The Transformer outputs one vector per patch; average-pool the N vectors into one, then apply a linear layer D → C to predict class scores.

At step 3 the slides pause to ask: is there another way to describe this operation? The answer is a 16×16 convolution with stride 16, 3 input channels, and D output channels. That one line connects ViT to the CNNs of earlier lectures: ViT's first layer is really a large-stride convolution, and self-attention takes over from there.

## Four common changes since 2017

The last section lists adjustments that have become standard in modern Transformers:

- **Pre-Norm**: the original puts LayerNorm outside the residual connection, which the slides call "kind of weird" because the model can't learn the identity function. The fix moves normalization inside the residual branch.
- **QK-Norm**: normalize queries and keys before computing similarities, which prevents gradient spikes and stabilizes training. This page is also new in 2026.
- **SwiGLU**: replace the classic MLP with Y = (σ(XW₁) ⊙ XW₂)W₃. Setting the hidden size to H = 8D/3 keeps the parameter count the same ([Shazeer 2020](https://arxiv.org/abs/2002.05202)).
- **Mixture of Experts (MoE)**: learn E sets of MLP weights per block and route each token to only A of them. Parameters grow by a factor of E while compute grows only with A ([Shazeer et al. 2017](https://arxiv.org/abs/1701.06538)).

The 2025 deck had RMSNorm in this section. The 2026 Lecture 8 drops that page and moves it to the Transformer recap at the start of [Lecture 9](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en).

## Going deeper

- **Suggested readings on the schedule**: the original [Attention Is All You Need](https://arxiv.org/abs/1706.03762) paper, Lilian Weng's [Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/), Jay Alammar's [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/), and the [ViT paper](https://arxiv.org/abs/2010.11929).
- **Hands-on**: the section 5 slides end with a [Colab notebook](https://colab.research.google.com/drive/1mC5CWwekbZ2NrYv6Zfpuv55z8DuOZXVP). The first question in this series' [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en) swaps A2's RNN for a Transformer in image captioning.
- **Self-check**: without the slides, write out the matrix shape at every step of self-attention, and explain why ViT's patch embedding is a convolution.

## Further reading

These courses cover the same architecture from the language model side. This post's vision thread doesn't depend on them:

- [CS224N: Transformers](/posts/ai/2026-08-22-cs224n-transformers-en)
- [CME295: Transformers](/posts/ai/2026-09-29-cme295-transformer-en)
- Building a Transformer language model from scratch: [CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Spring 2025 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [CS231N Lecture 8 slides (Spring 2026)](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf) — source of every figure, shape, and example in this post
- [CS231N Section 5: RNNs & Transformers slides](https://cs231n.stanford.edu/slides/2026/section_5.pdf) — RNN versus Transformer comparison
- [CS231N schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html) — the 4/23 lecture and suggested readings
- [CS231N Lecture 8 slides (Spring 2025)](https://cs231n.stanford.edu/slides/2025/lecture_8.pdf) — for comparison with 2026
- [Spring 2025 Lecture 8 recording](https://www.youtube.com/watch?v=RQowiOF_FvQ)
- [Vaswani et al., Attention Is All You Need (NeurIPS 2017)](https://arxiv.org/abs/1706.03762)
- [Dosovitskiy et al., An Image is Worth 16x16 Words (ICLR 2021)](https://arxiv.org/abs/2010.11929)
- [Bahdanau, Cho & Bengio, Neural Machine Translation by Jointly Learning to Align and Translate (ICLR 2015)](https://arxiv.org/abs/1409.0473)
- [Su et al., RoFormer: Enhanced Transformer with Rotary Position Embedding (2021)](https://arxiv.org/abs/2104.09864)
- [Dao et al., FlashAttention (2022)](https://arxiv.org/abs/2205.14135)
- [Shazeer, GLU Variants Improve Transformer (2020)](https://arxiv.org/abs/2002.05202)
- [Shazeer et al., Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer (2017)](https://arxiv.org/abs/1701.06538)
- [Lilian Weng, Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/)
- [Jay Alammar, The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)
