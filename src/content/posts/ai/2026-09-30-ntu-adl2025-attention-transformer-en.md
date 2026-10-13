---
title: "Attention and the Transformer | NTU Yun-Nung Chen Applied Deep Learning Lecture 4"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, attention, transformer]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 4
tldr: "An RNN translator has to squeeze the whole source sentence into one vector, and long sentences don't fit. Attention lets the decoder look back at every input position each time it produces a word, score each one, and take a weighted sum. Call the scorer the query, the thing being scored the key, and the thing being averaged the value, and you have dot-product attention. The Transformer goes one step further: the input attends to itself, recurrence disappears, and in return you get parallelism and a constant path length. The price is that position information has to be added back by hand."
description: "A guide to the Attention Mechanism and Transformer lectures of NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025: attention in seq2seq translation, query/key/value, the matrix form of dot-product attention, applications from speech recognition to image captioning, multi-hop memory networks; the Q/K/V computation of self-attention, the who/did what/to whom multi-head example, scaled dot-product, encoder and decoder blocks, masked self-attention, the four criteria for positional encoding and the sinusoidal solution, and training tips. Includes a hand-computed self-attention example and a self-check."
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

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This guide is based on two decks from the 9/08 week of NTU Yun-Nung Chen's *Applied Deep Learning* (ADL), **Fall 2025 (semester 114-1, 2025/09/01–12/15)**: [Attention Mechanism](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf) (28 pages) and [Transformer](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf) (58 pages), plus videos [4.1](https://youtu.be/FLNSD3zykgE) (23:41) and [4.2](https://youtu.be/c0O9s6MCFys) (25:01), both in Mandarin. The course is rated **A2**: the lectures are fully public, and the gaps are on the homework side. See the [series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). This lecture has no gaps of its own.

**Series**: Previous: [Word Representations, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) | Next: [Lecture 5](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The [previous post](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) ended on a problem: in theory an RNN remembers words from long ago, in practice the gradient never gets back to them. This lecture answers in two steps. First comes attention, originally an add-on to RNN translation models. Then comes the Transformer, which removes the RNN entirely and keeps only attention.

The two decks are separate rows on the [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), but pages 6–9 of the Transformer deck review the translation attention and dot-product attention from the Attention deck, so this post reads them together.

After this lecture you should be able to do four things: say where RNN translation gets stuck and how attention fixes it; compute self-attention by hand for a few small vectors; say where the query, key, and value come from in each of the Transformer's three kinds of attention; and explain why position information has to be added once the RNN is removed. Examples marked "made up for this post" are not from the lecture.

## Step one: why translation needs attention

### Starting from human attention

Slides 2–3 of the Attention deck start with people. In the [4.1 video](https://youtu.be/FLNSD3zykgE) Professor Chen says your memory holds this morning's breakfast, a summer trip ten years ago, and what you learned in this course. When someone asks "what is deep learning?", you pull out only the relevant part to build an answer. Your senses take in a lot, but only what you attend to reaches working memory. Slide 3 puts the problem and the fix in one line: when the input is a very long sequence or an image, attend to part of it at a time.

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
A(q, K, V) = Σᵢ [exp(q·kᵢ) / Σⱼ exp(q·kⱼ)] vᵢ
q and k are d_k-dimensional; v is d_v-dimensional
```

Each generated word brings a new query, so the queries stack into a matrix Q and are computed at once: take QKᵀ, softmax each row, multiply by V. Q is |Q|×d_k, Kᵀ is d_k×|K|, V is |K|×d_v, and the result is |Q|×d_v: one d_v-dimensional output per query.

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

The attention above is output-to-input, and "focus somewhere different at each step" only means something when the output is a sequence. Self-attention makes every input word a query once, with all words, itself included, as keys, so any two positions can exchange information directly. Slide 12 names two benefits: a constant path length between any two positions, and easy parallelism.

Slides 15–23 compute it step by step. Take a¹:

1. Each input aⁱ is multiplied by three matrices: qⁱ = W^q aⁱ, kⁱ = W^k aⁱ, vⁱ = W^v aⁱ.
2. q¹ is dotted with every kⁱ to get α₁,ᵢ, and softmax turns those into α′₁,ᵢ.
3. b¹ = Σᵢ α′₁,ᵢ vⁱ.

No position depends on another, so b¹ through b⁴ can be computed at the same time. Slide 23 writes the whole thing as matrix algebra, and the only learned parameters are W^q, W^k, and W^v (the softmax step is marked with an arrow on the slide):

```
Q = W^q I    K = W^k I    V = W^v I
A = Kᵀ Q     A′ = softmax(A)    O = V A′
```

(The slides stack vectors as matrix columns, hence KᵀQ; with rows it becomes the familiar QKᵀ. In this layout the softmax runs down each column (one per query), which is the same thing as the row-wise softmax of QKᵀ on slide 12.)

### Self-attention by hand (made up for this post)

To look only at the mechanism, set W^q, W^k, and W^v to the identity, so each word's q, k, and v are its own vector. Three words:

```
a¹ = (1, 0)    a² = (0, 1)    a³ = (1, 1)
```

**Compute b¹, with a¹ as the query.**

- Dot-product scores: a¹·a¹ = 1, a¹·a² = 0, a¹·a³ = 1
- softmax(1, 0, 1): e¹ ≈ 2.718, e⁰ = 1, sum ≈ 6.437, weights ≈ 0.4223, 0.1554, 0.4223
- b¹ = 0.4223 × (1, 0) + 0.1554 × (0, 1) + 0.4223 × (1, 1) ≈ (0.845, 0.578)

The same computation gives b² ≈ (0.578, 0.845) and b³ ≈ (0.788, 0.788).

Reading the result: the dot product of a¹ and a² is 0, so a¹ looks at a² least and gives it 0.155. Its dot products with itself and with a³ are equal, so each gets 0.422. The output b¹ is a weighted mix of the three vectors and already carries information from other positions.

**Change the order and compute again.** Arrange the input as a¹, a³, a². With a¹ as the query the three scores become 1, 1, 0 and the weights 0.4223, 0.4223, 0.1554. The vectors they multiply have swapped places too, and the sum is still (0.845, 0.578). Each word's output does not depend on where it sits. This is why positional encoding has to be added later.

### Multi-head: several aspects at once

Slides 28–34 use "I kicked the ball" to motivate multiple heads. For kicked, a convolution learns a different linear transformation for each relative position. A single self-attention learns only one weighted average of relevance. As Chen puts it in the video, single attention knows how related you are to me, not in what way.

Multi-head attention lets each head handle one kind of relation. The slides draw three heads: who points to I, did what points to kicked itself, and to whom points to ball. In practice each head has its own W^{q,h}, W^{k,h}, and W^{v,h} and computes its own b^{i,h}; the heads are concatenated and multiplied by W^O (slides 35–37, with two heads as the example). Slide 41 describes it as mapping V, K, and Q into lower-dimensional spaces, applying attention in each, concatenating the outputs, and applying a linear transformation.

### Scaled dot-product

Slide 42: as d_k grows, the variance of qᵀk grows. The slide says q and k are random variables with mean 0 and variance 1; reading that as independent per dimension (this post's reading), qᵀk has variance d_k. Dividing by √d_k brings the variance back to 1.

Numbers show why large variance is a problem (made up for this post). With scores (8, 0, 0), softmax gives (0.9993, 0.0003, 0.0003), nearly one-hot, and the other positions are effectively unseen. If d_k = 64, dividing by √64 = 8 turns the scores into (1, 0, 0), and softmax gives (0.576, 0.212, 0.212), so all three positions still have a share.

### Encoder and decoder

The architecture comes from [Vaswani et al. 2017](https://arxiv.org/abs/1706.03762) (Attention Is All You Need): slide 24 is a schematic, and the paper's original figure is on slides 39–40. The original Transformer is a non-recurrent encoder-decoder for machine translation. Per slide 44, each encoder block has two parts:

- multi-head attention;
- a two-layer feed-forward network with ReLU.

Both parts are wrapped in a residual connection and LayerNorm: `LayerNorm(x + sublayer(x))`.

The decoder adds two things (slides 26 and 40, plus the video):

- **Masked self-attention**: when producing the second word, the model can attend only to words already produced. Chen's reason: during training the later words haven't been generated yet, so the model shouldn't learn to look at them.
- **Encoder-decoder attention**: queries come from the decoder, keys and values from the encoder output. This is the translation attention from step one.

Near the end of the video, Chen sums up the three kinds of attention in one sentence: in encoder self-attention, Q, K, and V all come from the input; in decoder self-attention they all come from the output, looking backward only; in encoder-decoder attention, Q comes from the output and K, V from the input.

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

The denominator on slide 50 is printed as 100000; the original paper uses 10000.

With numbers (made up for this post), take d = 4:

| Position | (sin(pos/1), cos(pos/1), sin(pos/100), cos(pos/100)) |
|---|---|
| 0 | (0, 1, 0, 1) |
| 1 | (0.841, 0.540, 0.010, 1.000) |
| 2 | (0.909, −0.416, 0.020, 1.000) |

The first two dimensions change quickly, so adjacent positions are easy to tell apart. The last two change slowly and differ only across long distances. Every position's vector comes from the formula, needs no training, and is not limited by sentence length.

Slide 52 plots the dot products between position encodings, showing that neighbor relations are symmetric and decay with distance. Chen adds that the position vector is usually added to the word vector, sometimes concatenated, and that current LLMs no longer seem to use this version.

### Training tips and results

Slide 55 lists the original Transformer's training tips: BPE, checkpoint averaging, Adam with a changing learning rate, dropout at every layer just before adding the residual, label smoothing, and autoregressive decoding with beam search and length penalties. Chen notes that the Transformer was hard to train when it first came out, and that libraries now package most of these details.

Slides 56–57 show the paper's translation and parsing experiments. Chen's reading in the video: translation quality matched the best systems of the time at lower training cost, because the model parallelizes easily.

BPE, the first item on slide 55, is the topic of the [next post](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en).

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"Attention was invented by the Transformer."** It began as an addition to RNN translation models. What the Transformer did was let the input attend to itself and remove the RNN.
- **"The key and the value are always the same vector."** They happen to be the same in the earliest translation example. The instructor says explicitly that they can differ, and self-attention has a separate matrix for each.
- **"Self-attention inherently knows word order."** The hand computation above shows that reordering the input leaves each word's output unchanged. Order comes from positional encoding.
- **"Multi-head repeats the same thing several times."** A single attention learns only one number, how relevant something is. Each head has its own set of matrices so that different kinds of relations can be looked at separately. Chen also says that how to make sure the heads really learn different things is not elaborated on; the hope is that the model learns it by itself.
- **"The decoder masks later words because they do not matter."** They are masked because at generation time they do not exist yet, and training should not teach the model to look at them.

## Self-check

The questions were written for this post.

**1. Translating "深度學習", the decoder is about to produce "learning" and the attention weights are (0, 0, 0.5, 0.5). What vector is used for decoding at this step?**

c = 0.5·h₃ + 0.5·h₄, half each of the encoder outputs at the positions of "學" and "習".

**2. Using the three vectors from the hand computation, take a³ = (1, 1) as the query. What are the three dot-product scores, and which position gets the largest weight?**

a³·a¹ = 1, a³·a² = 1, a³·a³ = 2. a³ itself gets the largest weight: softmax(1, 1, 2) ≈ (0.212, 0.212, 0.576).

**3. Where do the query, key, and value come from in each of the Transformer's three kinds of attention?**

Encoder self-attention: all three come from the input. Decoder self-attention: all three come from the part of the output already generated, and only earlier positions are visible. Encoder-decoder attention: the query comes from the decoder, and the key and value come from the encoder's output.

**4. "Dog bites man" and "man bites dog" use the same three words. With no position information at all, does self-attention compute different outputs for "bites" in the two sentences?**

No. The three word vectors are the same, the three scores with "bites" as the query are the same, and so is the weighted sum. The model cannot tell who bites whom, which is why positional encoding has to be added.

**5. A model is trained only on sentences up to length 256. If position is represented by "just put the index 1, 2, 3…", what happens with an input of length 512? Why does the sinusoidal scheme not have this problem?**

Indices past 256 never appeared in training, so the model does not know how to handle them. Each dimension of the sinusoidal encoding is a periodic wave, and any position plugged into the formula yields a vector within a fixed range.

**6. d_k goes from 16 to 256. Without scaling, by roughly what factor does the standard deviation of the dot-product scores grow?**

Under the assumption on slide 42 the variance equals d_k, so the standard deviation is √d_k, going from 4 to 16, a factor of 4. Larger scores push softmax closer to one-hot, which is why the scores are divided by √d_k.

**7. Hands-on: in NumPy, generate two random 4×d matrices, one as Q and one as K (each element with mean 0 and variance 1, the two matrices independent), and compute softmax(QKᵀ). Leave out the division by √d at first and raise d from 8 to 512. What should you see?**

As d grows, the largest weight in each row approaches 1. With the division by √d added, the weight distribution no longer changes noticeably with d. Q and K must be generated independently to match the deck's assumption that q and k are random variables with mean 0 and variance 1, together with this post's reading of it as independent per dimension. If q = k as in the hand computation above, a vector's dot product with itself is about d, which after dividing by √d is still √d and keeps growing with d.

## Further reading

- The same material at Stanford: [CS224N Lecture 5: From Recurrence to the Transformer](/posts/ai/2026-08-22-cs224n-transformers-en), [CME295 Lecture 1: From Tokens to Transformer](/posts/ai/2026-09-29-cme295-transformer-en)
- The line-by-line implementation the slides cite: [The Annotated Transformer (Sasha Rush)](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=FLNSD3zykgE
title: ADL 4.1: Attention Mechanism
```

```youtube
url: https://www.youtube.com/watch?v=c0O9s6MCFys
title: ADL 4.2: Self-Attention & Transformer
```

Original videos: [ADL 4.1: Attention Mechanism](https://www.youtube.com/watch?v=FLNSD3zykgE), [ADL 4.2: Self-Attention & Transformer](https://www.youtube.com/watch?v=c0O9s6MCFys)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): 4.1 and 4.2 were both checked, and everything this guide attributes to the videos appears in them. Slide page numbers, formulas, and details such as CoQA/QuAC come from the slides.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. The transcripts match what the article says about the videos; no correction needed.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Added learning goals, a hand-computed self-attention example, numeric examples for scaling and positional encoding, common misreadings, and a self-check with answers.

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
