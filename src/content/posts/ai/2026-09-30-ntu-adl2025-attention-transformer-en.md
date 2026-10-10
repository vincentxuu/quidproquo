---
title: "NTU ADL Lecture 4: Attention and the Transformer"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, attention, transformer]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 4
tldr: "An RNN translator has to squeeze the whole source sentence into one vector, and long sentences don't fit. Attention lets the decoder look back at every input position each time it produces a word, score each one, and take a weighted sum. Call the scorer the query, the thing being scored the key, and the thing being averaged the value, and you have dot-product attention. The Transformer goes one step further: the input attends to itself, recurrence disappears, and in return you get parallelism and a constant path length. The price is that position information has to be added back by hand."
description: "A guide to the Attention Mechanism and Transformer lectures of NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025: attention in seq2seq translation, query/key/value, the matrix form of dot-product attention, applications from speech recognition to image captioning, multi-hop memory networks; the Q/K/V computation of self-attention, the who/did what/to whom multi-head example, scaled dot-product, encoder and decoder blocks, masked self-attention, the four criteria for positional encoding and the sinusoidal solution, and training tips."
draft: false
glossary:
  - term: "dot-product attention"
    definition: "Given a query and a set of key-value pairs, take the dot product of the query with each key, softmax the scores into weights, and output the weighted sum of the values. Queries and keys must share a dimension; values need not."
    context: "Slides 11–12 of the ADL Attention deck give the single-query form, then extend it to a matrix of queries."
  - term: "positional encoding"
    aliases: ["positional embedding"]
    definition: "Self-attention ignores input order, so a vector tied to each position is added to the word vector to tell the model where each word is. The original Transformer builds this vector from sines and cosines of different frequencies."
    context: "Slides 45–52 of the ADL Transformer deck list four design criteria, rule out three naive schemes, and then introduce the sinusoidal version."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This guide is based on two decks from the 9/08 week of NTU Yun-Nung Chen's *Applied Deep Learning* (ADL), **Fall 2025 (semester 114-1, 2025/09/01–12/15)**: [Attention Mechanism](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf) (28 pages) and [Transformer](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf) (58 pages), plus videos [4.1](https://youtu.be/FLNSD3zykgE) (23:41) and [4.2](https://youtu.be/c0O9s6MCFys) (25:01), both in Mandarin. All facts were checked against the official materials on 2026-09-30. The course is rated **A2**: the lectures are fully public, and the gaps are on the homework side. See the [series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). This lecture has no gaps of its own.

**Series**: Previous: [Word Representations, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) | Next: [Tokenization and BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The [previous post](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) ended on a problem: in theory an RNN remembers words from long ago, in practice the gradient never gets back to them. This lecture answers in two steps. First comes attention, originally an add-on to RNN translation models. Then comes the Transformer, which removes the RNN entirely and keeps only attention.

The two decks are separate rows on the [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), but the first nine pages of the Transformer deck review the Attention deck, so this post reads them together.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=FLNSD3zykgE
title: ADL 4.1: Attention Mechanism
```

```youtube
url: https://www.youtube.com/watch?v=c0O9s6MCFys
title: ADL 4.2: Self-Attention & Transformer
```

Original videos: [ADL 4.1: Attention Mechanism](https://www.youtube.com/watch?v=FLNSD3zykgE)、[ADL 4.2: Self-Attention & Transformer](https://www.youtube.com/watch?v=c0O9s6MCFys)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## Step one: why translation needs attention

### Starting from human attention

Slides 2–3 of the Attention deck start with people. In the [4.1 video](https://youtu.be/FLNSD3zykgE) Chen says your memory holds this morning's breakfast, a summer trip ten years ago, and what you learned in this course. When someone asks "what is deep learning?", you pull out only the relevant part to build an answer. Your senses take in a lot, but only what you attend to reaches working memory. Slide 3 puts the problem and the fix in one line: when the input is a very long sequence or an image, attend to part of it at a time.

### The bottleneck in RNN translation

Slide 4 is last week's encoder-decoder. The encoder reads "深 度 學 習" (deep learning, one character at a time), compresses the sentence into a vector, and the decoder emits "deep learning <END>."

Chen points to two problems. First, as the output gets long, that vector gets diluted along the way; a common patch is to feed it in again at every step. Second, and more fundamental, expecting one vector to hold a long input is unrealistic. When translating deep, the model should look at "深度"; when translating learning, at "學習." Different steps need to focus on different places.

### How attention is computed

Slides 5–9 go step by step. The decoder's current state z₀ is matched against each encoder position h₁…h₄ to get a score α. The match can be:

- cosine similarity;
- a small network that takes z and h and outputs a scalar;
- α = hᵀWz.

A softmax turns the scores into weights that sum to 1, and those weights average the h vectors. In the slide's example the first step learns 0.5, 0.5, 0, 0, so c⁰ = 0.5h₁ + 0.5h₂, which produces deep. At the second step the weight moves to the last two characters, c¹ = 0.5h₃ + 0.5h₄, which produces learning. This repeats until <END>.

Slide 10 names the three roles, and the course uses these names from here on:

- **query**: what you search with; here, the decoder state z.
- **key**: what gets searched and scored; here, h.
- **value**: what the weights multiply; here, also h.

Chen stresses that keys and values don't have to be the same. You could score with one layer's vectors and apply the weights to another layer's.

### Dot-product attention

Slides 11–12 turn this into a formula. For a single query:

```
A(q, K, V) = Σᵢ softmax(q · kᵢ) vᵢ
q and k are d_k-dimensional; v is d_v-dimensional
```

Each generated word brings a new query, so the queries stack into a matrix Q and are computed at once: take QKᵀ, softmax each row, multiply by V.

### Applications everywhere

Slides 13–27 run through applications. The common thread is attending to a different part of the input at each output step:

- **Speech recognition** ([Listen, Attend and Spell](https://arxiv.org/abs/1508.01211)): to recognize the first word, look only at the stretch that has speech. The leading silence doesn't matter.
- **Image captioning**: cut the image into regions and score them for each generated word. Chen highlights a second benefit in the video, interpretability: when the model calls two giraffes "a large white bird," looking at where it attended shows why.
- **Video captioning**: the same idea over a sequence of frames.
- **Reading comprehension and memory networks**: use the question as a query over the document, possibly over several hops. The video's example asks what color Greg is. The first hop finds "Greg is a frog," the second uses that to find "Brian is a frog," the third finds "Brian is yellow," and only then does the model answer yellow.
- **Conversational QA**: the slides use CoQA and QuAC, where each question depends on earlier turns.

## Step two: the Transformer removes recurrence

### What's wrong with RNNs and CNNs

Slides 3–5 of the Transformer deck compare two ways to process sequences:

| Architecture | Strengths | Weaknesses |
|---|---|---|
| RNN | Fits variable-length sequences | Each step waits for the previous one, so parallelizing is hard; no explicit modeling of long or short dependencies |
| CNN | Easy to parallelize; good at local dependencies | Long-distance dependencies need many stacked layers |

In the [4.2 video](https://youtu.be/c0O9s6MCFys) Chen reuses last week's example: "he lives in France… he speaks French." France and French are closely tied, but an RNN gives them no direct channel. It can only hope the signal survives the trip.

Slide 11's conclusion: replace recurrence with attention.

### Self-attention: the input attends to itself

The attention above is output-to-input, and "focus somewhere different at each step" only means something when the output is a sequence. Self-attention makes every input word a query once, with all words as keys, so any two positions can exchange information directly. Slide 12 names two benefits: a constant path length between any two positions, and easy parallelism.

Slides 15–23 compute it step by step. Take a¹:

1. Each input aⁱ is multiplied by three matrices: qⁱ = W^q aⁱ, kⁱ = W^k aⁱ, vⁱ = W^v aⁱ.
2. q¹ is dotted with every kⁱ to get α₁,ᵢ, and softmax turns those into α′₁,ᵢ.
3. b¹ = Σᵢ α′₁,ᵢ vⁱ.

No position depends on another, so b¹ through b⁴ can be computed at the same time. Slide 23 collapses the whole thing into four lines of matrix algebra, and the only learned parameters are W^q, W^k, and W^v:

```
Q = W^q I    K = W^k I    V = W^v I
A = Kᵀ Q     A′ = softmax(A)    O = V A′
```

(The slides stack vectors as matrix columns, hence KᵀQ; with rows it becomes the familiar QKᵀ.)

### Multi-head: several aspects at once

Slides 28–34 use "I kicked the ball" to motivate multiple heads. For kicked, a convolution learns a different linear transformation for each relative position. A single self-attention learns only one weighted average of relevance. As Chen puts it in the video, single attention knows how related you are to me, not in what way.

Multi-head attention lets each head handle one kind of relation. The slides draw three heads: who points to I, did what points to kicked itself, and to whom points to ball. In practice each head has its own W^{q,h}, W^{k,h}, and W^{v,h} and computes its own b^{i,h}; the heads are concatenated and multiplied by W^O (slides 35–37, with two heads as the example). Slide 41 describes it as mapping V, K, and Q into lower-dimensional spaces, applying attention in each, concatenating the outputs, and applying a linear transformation.

### Scaled dot-product

Slide 42: as d_k grows, the variance of qᵀk grows. If each dimension of q and k has mean 0 and variance 1, then qᵀk has variance d_k. Dividing by √d_k brings the variance back to 1.

### Encoder and decoder

The architecture on slide 24 comes from [Vaswani et al. 2017](https://arxiv.org/abs/1706.03762) (Attention Is All You Need). The original Transformer is a non-recurrent encoder-decoder for machine translation. Per slide 44, each encoder block has two parts:

- multi-head attention;
- a two-layer feed-forward network with ReLU.

Both parts are wrapped in a residual connection and LayerNorm: `LayerNorm(x + sublayer(x))`.

The decoder adds two things (slides 26 and 40, plus the video):

- **Masked self-attention**: when producing the second word, the model can attend only to words already produced. Chen's reason: during training the later words haven't been generated yet, so the model shouldn't learn to look at them.
- **Encoder-decoder attention**: queries come from the decoder, keys and values from the encoder output. This is the translation attention from step one.

The video wraps up the three kinds of attention in one sentence: in encoder self-attention, Q, K, and V all come from the input; in decoder self-attention they all come from the output, looking backward only; in encoder-decoder attention, Q comes from the output and K, V from the input.

### Positional encoding: putting order back

Slide 45 names the cost of dropping the RNN: temporal information is gone. Chen explains in the video that in self-attention every word is compared with every other word, so input order 1-2-3 and 3-2-1 give the same result.

Slides 46–50 list four criteria, then rule out three naive schemes:

| Scheme | Problem |
|---|---|
| Use the position number 1, 2, 3… | Values keep growing, so lengths unseen in training don't generalize |
| One-hot, a d-dim vector for d positions | Only covers sequences of length ≤ d |
| Normalize position to 0–1 | Adjacent positions are different distances apart in sentences of different lengths |

The four criteria: a unique encoding per position, deterministic, the same distance between neighboring positions, and easy generalization to longer sentences.

The sinusoidal version meets all four. It builds a d-dimensional vector from sines and cosines of different frequencies:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

The denominator on slide 50 is printed as 100000; the original paper uses 10000. Slide 52 plots the dot products between position encodings, showing that neighbor relations are symmetric and decay with distance. Chen adds that the position vector is usually added to the word vector, sometimes concatenated, and that most current LLMs no longer use this version.

### Training tips and results

Slide 55 lists the original Transformer's training tips: BPE, checkpoint averaging, Adam with a changing learning rate, dropout at every layer just before adding the residual, label smoothing, and autoregressive decoding with beam search and length penalties. Chen notes that the Transformer was hard to train when it first came out, and that libraries now package most of these details.

Slides 56–57 show the paper's translation and parsing experiments. Chen's reading in the video: translation quality matched the best systems of the time at lower training cost, because the model parallelizes easily.

BPE, the first item on slide 55, is the topic of the [next post](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en).

## How to self-study it

1. Start with [4.1](https://youtu.be/FLNSD3zykgE). Write out the α values on the four "深度學習 → deep learning" slides (5–9) yourself, and the roles of query, key, and value will click.
2. While watching [4.2](https://youtu.be/c0O9s6MCFys), keep slide 23's four matrix lines open and compute A and O by hand for four words with 2-dim vectors.
3. After the decoder section, check that you can say where Q, K, and V come from in each of the three kinds of attention.

One thing to try tonight: write a self-attention in under 20 lines of NumPy, with a random 4×8 input. Leave out the √d_k division, raise d_k from 8 to 512, and watch the softmax weights drift toward one-hot. Then add the division and compare. You will see exactly what slide 42 is fixing.

## Further reading

- The same material at Stanford: [CS224N Lecture 5: From Recurrence to the Transformer](/posts/ai/2026-08-22-cs224n-transformers-en), [CME295 Lecture 1: From Tokens to Transformer](/posts/ai/2026-09-29-cme295-transformer-en)
- The line-by-line implementation the slides cite: [The Annotated Transformer (Sasha Rush)](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/08 row
- [Attention Mechanism slides (2025/09/08)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf)
- [Transformer slides (2025/09/08)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf)
- [ADL 4.1: Attention Mechanism](https://youtu.be/FLNSD3zykgE) (23:41, in Mandarin)
- [ADL 4.2: Self-Attention & Transformer](https://youtu.be/c0O9s6MCFys) (25:01, in Mandarin)
- [ADL 2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Vaswani et al., Attention Is All You Need (NIPS 2017)](https://arxiv.org/abs/1706.03762) — source of the architecture diagram, scaled dot-product, and the sinusoidal PE formula (denominator 10000)
- [Chan et al., Listen, Attend and Spell (2015)](https://arxiv.org/abs/1508.01211) — the speech-recognition example on slide 14 of the Attention deck
- [The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html) — the PyTorch walkthrough recommended on slide 39
