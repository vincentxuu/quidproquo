---
title: "NTHU NLP Guide 6: Without the RNN, How Does a Transformer Know How Words Relate and Where They Sit?"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, transformer, self-attention, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 6
tldr: "A guide to the Transformer unit of Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025). The slides start from two RNN problems: words interact only across O(N) steps, and time steps cannot run in parallel. Self-attention lets every word look at every other word and computes it all in one matrix multiplication, fixing both at once. The cost is that the model can no longer tell word order, so sinusoidal positional encoding is added. The lecture then assembles multi-head attention, Add & Norm, feed forward, cross-attention, masked attention and teacher forcing, and closes with GPT-2, ViT and four variants to show how far the architecture went."
description: "A guide to W3_Transformers.pdf and the Week 4 Thu. recording from Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025): RNN linear interaction distance and lack of parallelism, QKV self-attention, scaled dot product, sinusoidal positional encoding, multi-head attention, Add & Norm, encoder-decoder and cross-attention, masked attention, teacher forcing, and variants such as GPT-2, ViT, Universal Transformer, Longformer and RoFormer. Formulas are in collapsible blocks."
draft: false
glossary:
  - term: "self-attention"
    aliases: ["intra-sentence attention"]
    definition: "Each position compares its query with the keys of every position, then uses the softmax weights to average all the values, producing that position's new representation."
    context: "This lecture uses it to fix the RNN's linear interaction distance and lack of parallelism."
  - term: "teacher forcing"
    aliases: ["teacher-forced training"]
    definition: "When training a decoder, the next step's input is always the gold token, whatever the model predicted at the previous step."
    context: "Slides 55–56 illustrate it with a model that predicts 'the' where the answer is 'a'."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-transformers)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 6 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [PyTorch Tutorial and HW2: Arithmetic as Language](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en).

The official material for this lecture is [W3_Transformers.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Transformers.pdf) (65 slides), and the recordings are [Week 4 Thu.](https://www.youtube.com/live/tr5QyN5TswM) and [Week 5 Tue.](https://www.youtube.com/live/Dpswwk6UMCc) (the latter was originally attached to the sub-word lecture; reading its captions showed it covers the second half of this deck) (lectures are in Mandarin; slides are mostly English). The file name says W3, but it sits in the W4 row of the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md), next to that Tuesday's PyTorch tutorial. The week number is left over from an older numbering, so this guide goes by the slides and recording actually attached to the row. The row's Topics column says "Basic machine learning for text"; that is a syllabus template that does not match the slides, and this guide does not cite it.

The slides have six parts: issues with RNNs, attention as a solution, self-attention, the Transformer encoder-decoder, the Transformer's achievements, and Transformer variants. This guide follows that order in five layers: scenario, intuition, mechanism, back to the model, going deeper.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: the YouTube videos are public and embeddable. After reading the captions, Week 4 Thu. covers the first half (RNNs and attention up to the start of self-attention) and Week 5 Tue. covers the second half. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=tr5QyN5TswM
title: Week 4 Thu.
```

```youtube
url: https://www.youtube.com/watch?v=Dpswwk6UMCc
title: Week 5 Tue.
```

Original videos: [Week 4 Thu.](https://www.youtube.com/watch?v=tr5QyN5TswM)、[Week 5 Tue.](https://www.youtube.com/watch?v=Dpswwk6UMCc)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both the Week 4 Thu. and Week 5 Tue. transcripts were read through. Week 4 Thu. finishes LSTM, then covers RNN plus attention (the translation alignment figure, the cost of storing all hidden states), the QKV search analogy, why we divide by the square root of d, and starts self-attention; Week 5 Tue. continues with the QKV matrix dimensions, sinusoidal positional encoding, multi-head attention, Add & Norm (with layer norm as the default), cross-attention, masked attention, autoregressive decoding and teacher forcing, the base/big results, ViT and the Stanford AI Index training-cost chart, which matches the structure of this post. The post originally had only Week 4 Thu.; Week 5 Tue. was moved here from the sub-word post. Slide numbers and formulas come from the slides, and the captions carry no timestamps, so nothing is tied to video time points.

## Scenario: John lives in New York, but the RNN forgot John

Slide 3 opens with a QA example. The sentence mentions John at the start and New York later, and the model must answer where John lives. In an RNN, how much two words influence each other depends on their distance. John's information has to travel nearly O(N) time steps before it meets the answer, and it has faded by then. The slide puts it this way: we already know that "closer means more important" is not the right way to understand a sentence.

Slide 4 shows the second problem. The RNN's hidden state at step t cannot start until step t−1 is done, so time steps cannot run in parallel. The slide draws a two-layer, unidirectional RNN and labels each cell with the minimum number of steps needed to compute it; the numbers climb toward the top right. With large corpora and long text, this makes RNNs hard to train at scale.

Together these are what the previous lecture, [seq2seq and attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en), left open. Attention already lets the decoder look back at every encoder position. Why not let every word in a sentence look at every other word directly, and drop the RNN altogether?

## Intuition: a search engine inside the sentence

Slides 5–6 answer with **attention within a sentence**: in each layer, every word attends to all words in the same sentence. How much word i attends to word j is written α<sub>ij</sub>, and it is learned rather than set by distance.

Slides 7–9 explain the QKV attention of [Vaswani et al. (2017)](https://arxiv.org/abs/1706.03762) with a YouTube search analogy:

| Role | In a search engine | In a sentence (who does "it" refer to?) |
|---|---|---|
| Query | What you type | "it" looking for its referent |
| Key | Video titles and descriptions | Clues from each word: distance to "it", because, was, part of speech |
| Value | The videos returned | The word that is the answer (monkey in the example) |

The slides admit that the key is "fairly abstract". One sentence to hold onto: **the query decides what to look for, the key decides how likely something is to be found, and the value decides what you take once it is found.**

## Mechanism: from one word's attention to a full block

### Computing self-attention

Slides 12–20 work through it. The input is N d-dimensional embeddings e<sub>1</sub>…e<sub>N</sub>. Three matrices W<sub>q</sub>, W<sub>k</sub>, W<sub>v</sub> project each e<sub>i</sub> into q<sub>i</sub>, k<sub>i</sub>, v<sub>i</sub>. Then three steps:

1. **Score**: a scaled dot product between q<sub>i</sub> and every k<sub>j</sub>
2. **Normalize**: softmax over all scores for the same i, giving α′<sub>ij</sub>
3. **Weighted average**: sum all v<sub>j</sub> weighted by α′<sub>ij</sub> to get output y<sub>i</sub>

Why divide by √d<sub>k</sub>? Slide 13 explains that larger d<sub>k</sub> means larger dot products, which push softmax toward one-hot and make gradients vanish. If every dimension of the queries and keys has mean 0 and standard deviation 1, dividing by √d<sub>k</sub> keeps the scores in a stable range.

Slides 19–20 rewrite the three steps in matrix form so the whole sequence is computed in one multiplication. The slide adds: "Solves the parallelizability problem!!"

<details>
<summary>Formula: scaled dot-product attention (slides 13–20)</summary>

$$q_i = W_q e_i,\quad k_i = W_k e_i,\quad v_i = W_v e_i$$

$$\mathrm{score}(e_i, e_j) = \frac{q_i^\top k_j}{\sqrt{d_k}},\qquad \alpha'_{ij} = \frac{\exp(\mathrm{score}(e_i,e_j))}{\sum_{j'} \exp(\mathrm{score}(e_i,e_{j'}))}$$

$$y_i = \sum_{j=1}^{N} \alpha'_{ij}\, v_j$$

Matrix form (N is the sequence length):

$$Y = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V,\qquad Y \in \mathbb{R}^{N\times d}$$

</details>

### Positional encoding: two problems solved, a third appears

Slide 21 takes stock. Linear interaction distance is solved (weights are learned directly instead of decaying with distance), and so is parallelism (matrix multiplication). The new problem: **the model has no idea of relative position**. The same word "Amy" in two sentences with different meanings gets the same y, as long as the surrounding words are the same set and the weights are shared.

The fix is to add a position vector to each embedding. Slide 22 first asks why simply adding the index 1, 2, 3… fails. Two reasons:

- **No magnitude bound**: the values grow with sentence length
- **No length bound**: if the longest training sentence has 50 tokens and a test sentence has 53, the embeddings for positions 51–53 were never trained

Slides 24–30 present Vaswani's solution: nothing is trained; sines and cosines generate a periodic encoding. Each position's encoding is a set of waves at different frequencies, and nearby positions look alike. Values stay within [−1, 1], which fixes the first problem, and the pattern can continue forever, which fixes the second. The slides note that there are many positional encoding methods and the lecture covers only this one.

<details>
<summary>Formula: sinusoidal positional encoding (Vaswani et al., 2017)</summary>

$$PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right),\qquad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

pos is the position and i is the dimension index. Even dimensions use sin, odd ones cos, and the wavelengths grow geometrically from 2π to 10000·2π.

</details>

### Multi-head attention

Slide 32 returns to the search analogy. If you want different sets of queries to focus on different aspects, say one on semantic similarity and another on active versus passive voice, you need several attention mechanisms: several heads.

Slides 33–36 keep the computation simple. Each of h heads produces an N×d output Y<sub>1</sub>…Y<sub>h</sub>. They are concatenated into N×(h·d) and multiplied by W<sup>O</sup> to project to the desired dimension d<sub>out</sub>. The slides point out that Q<sub>1</sub>, Q<sub>2</sub>… can be grouped into one large matrix, so more heads do not complicate the computation, and the output dimension does not depend on the head count.

### Add & Norm and feed forward

Slides 37–39 unpack "Add & Norm":

- **Add**: a residual connection ([He et al., 2016](https://arxiv.org/abs/1512.03385)), so the layers in between only learn the residual Y − X, which stabilizes training
- **Norm**: layer normalization ([Ba et al., 2016](https://arxiv.org/abs/1607.06450)), computing the mean and standard deviation of a single vector across its embedding dimensions

Why layer norm and not batch norm? The slides say the original paper gives no experimental reason, but batch norm needs batch statistics at inference time, which suits NLP's variable sequence lengths poorly, and layer norm works well.

Slide 40 covers feed forward in one line: multiply by a weight matrix to project to a given dimension.

## Back to the model: encoder, decoder, and training

### Stacking and cross-attention

Slides 41–42 show cross-attention in the decoder: K and V come from the encoder's output, Q from the decoder itself. This is the Transformer version of the previous lecture's seq2seq attention.

Slides 43–45 point out a convenient design property: every block takes N×d and returns N×d. Because the dimensions match, the encoder can stack N layers to add parameters, and so can the decoder.

### Masked attention: no peeking at the future

Slides 46–49 raise a contradiction. Self-attention for the current token uses the tokens after it, but at test time the decoder does not know them yet. The fix is to mask the upper-right triangle of the QK score matrix with −∞ before softmax. Since softmax(−∞) = 0, each step averages only over positions j ≤ i.

### Autoregressive decoding and teacher forcing

Slides 50–54 borrow figures from [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) to show the decoder producing one token at a time until it emits `<eos>`. Slides 55–56 separate two stages:

- **At test time**: the token generated at step i is appended to the input to predict step i+1
- **At training time**: teacher forcing. If the model predicts "the" at step 2 but the answer is "a", the next step's input is still "a". The predicted token itself does not matter during training; only its probability distribution is used for the loss

This is the same teacher forcing that [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) implements with an LSTM, now on a Transformer.

### Achievements and variants

Slide 57 cites the machine translation results from the original paper. The base setting has 6 encoder and 6 decoder layers, dimension 512, 100K training steps; the big setting has dimension 1024 and 300K steps, and it set the state of the art for translation at the time. Slide 19 says "the original Transformer uses d = 1024", which matches the big setting; in the [original paper](https://arxiv.org/abs/1706.03762) the base model has d<sub>model</sub> = 512.

Slides 58–61 connect the Transformer to the rest of the course. (Chat)GPT is just n layers of Transformer decoders, pretrained. Pretraining is like having the model read many books and infer word meaning from context distributions. The slides use "special restaurant" and "extraordinary restaurant" appearing in similar contexts to introduce Firth's (1957) distributional hypothesis: a word is characterized by the company it keeps. The GPT series is postponed to later lectures, which in this series are [the BERT family](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) and [GPT-3, InstructGPT and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en).

Slides 62–63 list variants (the slide notes "there are many more"):

| Variant | What it changes |
|---|---|
| [Universal Transformer](https://arxiv.org/abs/1807.03819) | Adds Adaptive Computation Time |
| [Longformer](https://arxiv.org/abs/2004.05150) | Handles long documents |
| [RoFormer](https://arxiv.org/abs/2104.09864) | Redesigns positional encoding (Rotary Position Embedding) |
| [Vision Transformer (ViT)](https://arxiv.org/abs/2010.11929) | Splits an image into patches, feeds the sequence to a Transformer encoder, and beats an improved ResNet (BiT-L) on large-scale data |

The last slide shows a training-cost chart from the [Stanford AI Index Report 2024](https://aiindex.stanford.edu/wp-content/uploads/2024/05/HAI_AI-Index-Report-2024.pdf), a reminder that this road keeps getting more expensive.

## Going deeper

- Write single-head self-attention in NumPy: take 4 random vectors, compute QK<sup>⊤</sup>/√d<sub>k</sub>, softmax, multiply by V, then mask the upper triangle with −∞ and compare the masked version.
- Reproduce the "Amy" example from slide 21: drop the positional encoding, shuffle the input order, and confirm the outputs just move with their tokens while the values stay the same.
- Plot a heatmap of sinusoidal positional encoding with d<sub>model</sub> = 64 and compare it with slides 25–30.
- RoFormer, from the variants table, changes exactly the positional encoding. For where positional encoding went next, read [NTU ML 2026: positional embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en).

**Further reading**: [CS224N guide: from recurrence to Transformers](/posts/ai/2026-08-22-cs224n-transformers-en), [CME295 guide: the Transformer](/posts/ai/2026-09-29-cme295-transformer-en), [CS224U contextual representations I: Transformer and positional encoding](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en). Three courses, one architecture, different angles.

## Gaps in the materials

- Most formulas and diagrams on the slides are images. The formulas here are written from the source the slides cite (Vaswani et al., 2017), with notation kept close to the slides.
- This lecture has no assignment. Hands-on Transformer work comes in [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en), with BERT.
- Solutions, quizzes and class discussion live on NTU COOL and are not available to outside readers.
- The Fall 2026 version of this lecture is not yet public (the 2026 schedule is empty from W4 on); this guide uses Fall 2025 only.

**Series navigation**: previous [PyTorch Tutorial and HW2: Arithmetic as Language](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) | next [Sub-word Tokenization: Why a Model's Vocabulary Is Made of Word Pieces](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en) | [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against the transcripts. Week 4 Thu. covers the first half and Week 5 Tue. the second, matching the post; Week 5 Tue. was moved here from the sub-word post and embedded.

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W3_Transformers.pdf (Transformer and Self-Attention slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Transformers.pdf)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 4 Thu. (in Chinese)](https://www.youtube.com/live/tr5QyN5TswM)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 5 Tue. (in Chinese)](https://www.youtube.com/live/Dpswwk6UMCc)
- [Vaswani et al. (2017). Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [He et al. (2016). Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
- [Ba, Kiros & Hinton (2016). Layer Normalization](https://arxiv.org/abs/1607.06450)
- [Alammar. The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Dehghani et al. (2018). Universal Transformers](https://arxiv.org/abs/1807.03819)
- [Beltagy et al. (2020). Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Su et al. (2021). RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Dosovitskiy et al. (2021). An Image is Worth 16x16 Words](https://arxiv.org/abs/2010.11929)
- [Stanford HAI. AI Index Report 2024](https://aiindex.stanford.edu/wp-content/uploads/2024/05/HAI_AI-Index-Report-2024.pdf)
