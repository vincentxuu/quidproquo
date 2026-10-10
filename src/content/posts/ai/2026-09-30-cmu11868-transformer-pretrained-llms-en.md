---
title: "CMU 11-868 L06–L07: Reading Transformers, T5, LLaMA, and GPT-3 Like a Systems Engineer"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, transformer, pre-training, llama]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 6
tldr: "11-868 spends only two lectures on the model itself. L06 breaks the Transformer into embeddings, multi-head attention, FFN, LayerNorm, and residuals; L07 uses T5, LLaMA, and GPT-3 to show what modern LLMs changed. For a systems engineer the point is to remember the shapes: GPT-3 175B has 96 layers, d_model 12288, a 2048-token context, and trained on 300B tokens; LLaMA 65B has 80 layers, d_model 8192, and trained on 1.4T tokens. Those numbers set the workload for every acceleration, parallelism, and serving lecture that follows."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L06 Transformer and L07 Pre-trained LLMs: encoder-decoder vs. decoder-only, the matrix shapes of attention and FFN, pre-norm, SwiGLU, RoPE, and the model sizes and training compute of T5, LLaMA, and GPT-3. Architecture deep dives are linked to CS224N, CME295, and CS336."
draft: false
glossary:
  - term: "SwiGLU"
    definition: "An FFN variant that combines the Swish activation with a gated linear unit: one linear projection goes through Swish and is multiplied elementwise with a second projection. LLaMA uses it and shrinks the FFN hidden size from 4d to about 2/3 × 4d to keep the parameter count similar."
    context: "The second architectural change in the LLaMA section of CMU 11-868 L07."
  - term: "RoPE"
    definition: "Rotary Position Embedding: treats each pair of query/key dimensions as a 2D vector and rotates it by mθ at position m, so the attention score between two tokens depends only on their offset n−m."
    context: "The third architectural change in the LLaMA section of CMU 11-868 L07."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The main sources are the [L06 Transformer slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf) (Feb 2, 25 pages), the [L07 Pre-trained LLMs slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-07-llms-acf5db9438a8d9a86f86d29d9c563c00.pdf) (Feb 4, 22 pages), and the readings listed in the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus). Page numbers refer to PDF pages. All facts were checked against the official materials on 2026-09-30. Access level **A3**: slides and assignments are all public, but **there are no public recordings**, so this post works from slides and papers only and cannot relay anything the lecturer said aloud.

**Series**: previous [HW2: MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework-en) | next [L08–L09: Tokenization, decoding, and speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The first five posts laid the foundation: how a GPU runs a kernel, how a framework differentiates automatically, and how your own MiniTorch trains a sentiment classifier. This is where the course puts an actual model on the table for the first time.

11-868 covers the model in just two lectures: L06 on the Transformer, L07 on pre-trained LLMs. Compared with [Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) or [CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en), that is short. The goal here is not to explain why language models work. It is to show you **what the thing you will accelerate, shard, and serve actually looks like**. This post reads the lectures from that angle and asks two questions of every component: what shape are its matrices, and what resources does it consume?

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## Orientation: three kinds of language models

L06 page 4 sorts language models into three types:

| Type | Training objective | Examples on the slide |
|---|---|---|
| Encoder-only | Masked LM | BERT, RoBERTa, ESM (protein) |
| Encoder-decoder | Autoregressive or non-autoregressive | T5 |
| Decoder-only | Autoregressive | GPT, LLaMA, ProGen (protein) |

L06 uses machine translation as its running example and follows the encoder-decoder route; L07 switches to decoder-only. That matters for the homework: [HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) asks you to do German-English translation with a decoder-only GPT-2 architecture, so you need both.

L06 pages 6–7 give the motivation for the new architecture. Earlier seq2seq models used LSTMs or GRUs and processed one position at a time. The Transformer uses attention in both encoder and decoder; with recurrence gone, the encoder can encode the whole sentence **at once**. For a systems course, that is the whole point: parallel work is what GPUs are good at.

## L06: the shape of one Transformer layer

### Embeddings

L06 page 10: the token embedding is a lookup table shared (tied) between input and output. Positional encoding uses the original paper's sin/cos formula, has the same dimension as the token embedding, and is added to it. Tokenization is deferred to the next lecture.

The systems takeaway: the embedding table is vocabulary size × hidden dimension. A bigger vocabulary means a bigger table and a bigger output layer, a cost the next post comes back to.

### Multi-head attention

L06 pages 11–13: the input X is (number of tokens × dimension). It is projected into Q, K, and V, split into h heads, each head runs scaled dot-product attention, and the results are concatenated and multiplied by the output matrix W^O. Page 12 labels two shapes on the diagram: Q, K, and V are **len × dim**, and the attention score matrix is **len × len**. It also leaves a question for the reader: why divide by √d?

That len × len is the setup for the rest of the course. Double the sequence length and the attention matrix gets four times bigger. The later [FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en) lecture is entirely about not writing that matrix back to memory in one piece.

Decoder self-attention adds one step: positions to the right (the future) are masked to −∞ before the softmax (page 14).

### FFN, residuals, and LayerNorm

The FFN on L06 page 13 is two linear layers with a ReLU: `FFN(x) = max(0, xW1 + b1)W2 + b2`. Page 17 gives the original paper's numbers: 6 encoder and 6 decoder layers, embedding size 512 (base) or 1024 (large), FFN hidden size 2048.

Page 15 puts residual connections and LayerNorm together and lists two placements, post-norm and pre-norm. In HW3 this becomes a requirement: the assignment page states that GPT-2 uses pre-LN.

### Training setup

L06 pages 18–23 summarize the original paper's training details. The ones that bear on resources:

- Training uses teacher forcing: the decoder pretends it already knows the correct prefix, so loss for every position is computed together (page 18)
- Batches are grouped by approximate sentence length but still shuffled (page 21)
- Hardware: the 2017 paper used one machine with 8 GPUs; the base model took 100k steps (about 12 hours) and the large model 300k steps (about 3.5 days) (page 21)
- Adam with a learning rate that warms up and then decays (pages 21–22)
- The base model averages its last 5 checkpoints (page 23)

The last page of L06 (page 25) points the code walkthrough to [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/), and the Syllabus schedules it as Recitation 3 on Feb 6. Without recordings, this line-by-line implementation is the best substitute for L06.

## L07: what modern pre-trained LLMs changed

L07 uses three models as case studies (page 3): the encoder-decoder T5, the decoder-only LLaMA, and GPT-3.

### T5: a unified format and span corruption

Pages 4–7:

- A standard encoder-decoder Transformer, decoded with beam search (beam width 4, length penalty 0.6)
- Sizes: T5-base has 220M parameters (12 blocks, d_model 768, d_ff 3072, 12 heads); T5-11B has 24 blocks, d_model 1024, d_ff 65536, and 128 heads
- Pre-training data is C4, a filtered English corpus from Common Crawl, 750GB
- Pre-training objective: corrupt 15% of the text as random spans and recover them; 0.5M steps with batches of 128 sequences of length 512, packed to about 65k tokens per batch, about 34B tokens in total
- Multitask fine-tuning writes the task instruction into the input as natural language; T0 and Flan-T5 build on this

T5-11B's d_model is only 1024; almost all of its parameters sit in the 65536-wide FFN. It is a reminder that the same parameter count spread over different matrices puts very different pressure on memory and compute.

### LLaMA: three architectural changes

Page 8 lists three changes LLaMA makes to a decoder-only Transformer, each with its source:

1. **Pre-normalization** (from GPT-3): LayerNorm moves before each sublayer (page 9)
2. **SwiGLU** (from PaLM): the FFN uses a Swish gate; page 10 notes the hidden size changes from 4d to **2/3 × 4d**
3. **RoPE** (from RoFormer): a rotation matrix makes attention scores depend only on relative position (pages 11–12)

Page 14 adds the training recipe: standard language-modeling loss without label smoothing, plus an auxiliary loss that keeps the softmax normalizer close to 0; pre-training uses only open-source data.

The model-size table on page 13 is an image, so the numbers come from Table 2 of the [LLaMA paper](https://arxiv.org/abs/2302.13971):

| Params | d_model | Heads | Layers | Training tokens |
|---|---|---|---|---|
| 6.7B | 4096 | 32 | 32 | 1.0T |
| 13.0B | 5120 | 40 | 40 | 1.0T |
| 32.5B | 6656 | 52 | 60 | 1.4T |
| 65.2B | 8192 | 64 | 80 | 1.4T |

Section 2.4 of the paper has a number a systems course will like: training the 65B model processed about 380 tokens per second per GPU on 2048 A100s with 80GB, so one pass over 1.4T tokens took roughly 21 days.

### GPT-3: size and compute

Page 15: GPT-3 keeps the standard Transformer but changes the initialization, uses pre-normalization and reversible tokenization, and alternates dense and locally banded sparse attention. The size table, training details, and "Computation" slide on pages 16–18 are screenshots from the [GPT-3 paper](https://arxiv.org/abs/2005.14165). Table 2.1 of the paper gives the largest model, 175B, as:

- 96 layers, d_model 12288, 96 heads of 128 dimensions each
- A 2048-token context window for every model size
- 300B training tokens for every model size

Table D.1 in Appendix D does the compute accounting: about 2 floating-point operations per parameter per token in the forward pass, times 3 to include the backward pass, for 6 in total. Training 175B on 300B tokens comes to about 3.14 × 10²³ FLOPs, or about 3,640 petaflop/s-days.

### Back-of-the-envelope math

The following are my own rough estimates from the numbers above, not slide content. But this is exactly the exercise the rest of the course asks of you:

- **Parameter memory**: 175B parameters in FP16 is about 350GB for the weights alone, more than one 80GB GPU holds. That is why [model parallelism](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en) and [ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en) exist
- **Parameters per layer**: attention (four d×d matrices for Q, K, V, O) plus the FFN (two d×4d matrices) is about 12d². With d = 12288 and 96 layers, 12 × 12288² × 96 ≈ 174B, which matches 175B
- **Attention scores**: with a 2048 context, each head in each layer has a 2048 × 2048 score matrix

## Further reading: the architecture itself

11-868 deliberately covers only what systems work needs. For the reasoning behind the architecture, the site has fuller guides:

- [CS224N Lecture 5: from recurrence to Transformers](/posts/ai/2026-08-22-cs224n-transformers-en) and [Lecture 7: pre-training](/posts/ai/2026-08-22-cs224n-pretraining-en)
- [CME295 Lecture 1: from tokens to Transformers](/posts/ai/2026-09-29-cme295-transformer-en) and [Transformer tricks](/posts/ai/2026-09-29-cme295-transformer-tricks-en)
- [CS336 Lecture 3: architectures and hyperparameters](/posts/ai/2026-08-22-cs336-architectures-hyperparameters-en): why pre-norm, SwiGLU, and RoPE became defaults
- [CMU 11-785 Lecture 19: Transformers and beyond](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures-en)

## How to self-study this part

1. Read L06, then work through [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) and write every matrix shape down on paper, especially the permutes and reshapes in attention. HW3 tests exactly that
2. L07's size tables are images; open Table 2 of [LLaMA](https://arxiv.org/abs/2302.13971) and Tables 2.1 and D.1 of [GPT-3](https://arxiv.org/abs/2005.14165) directly
3. Use GPT-3's numbers to compute parameter count, weight memory, and training FLOPs once, as a warm-up for the second half of the course
4. L07 page 21 links straight to the [HW3 assignment page](https://llmsystem.github.io/llmsystemhomework/assignment_3/). The assignment went out on Feb 4; after this post and the [next one](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en) you can start it

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CMU 11-868 LLM Systems, Spring 2026 course site](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L06 Transformer slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)
- [L07 Pre-trained LLMs slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-07-llms-acf5db9438a8d9a86f86d29d9c563c00.pdf)
- [Vaswani et al., Attention Is All You Need (2017)](https://arxiv.org/abs/1706.03762)
- [Touvron et al., LLaMA: Open and Efficient Foundation Language Models (2023)](https://arxiv.org/abs/2302.13971)
- [Brown et al., Language Models are Few-Shot Learners (GPT-3, 2020)](https://arxiv.org/abs/2005.14165)
- [The Annotated Transformer (Harvard NLP)](https://nlp.seas.harvard.edu/annotated-transformer/)
- [11-868 Assignment 3 page](https://llmsystem.github.io/llmsystemhomework/assignment_3/)
