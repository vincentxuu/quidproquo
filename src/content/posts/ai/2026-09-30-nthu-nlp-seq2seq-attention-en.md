---
title: "NTHU NLP W3: When Input and Output Lengths Differ — Seq2seq, LSTM, and Attention"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, rnn, attention]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 4
tldr: "\"Look over there\" is 3 tokens, the Chinese version 4, the Japanese version 12. When output length does not track input length, the classifier trick of adding an FFN at the end fails. This 33-slide deck starts from encoder-decoder models, works through vanishing gradients in RNNs and the three LSTM gates, and ends with attention fixing both long-range memory and parallelism, including why scores are divided by √d."
description: "A guide to the W3 slides of Hung-Yu Kao's Natural Language Processing course at NTHU (Fall 2025): the length problem in machine translation, encoder-decoder models and the context vector, vanishing and exploding gradients, the LSTM forget/input/output gates, Bahdanau attention, and attention without RNNs."
draft: false
glossary:
  - term: "context vector"
    definition: "In an encoder-decoder model, the single vector that summarizes the input sequence for the decoder. The simplest choice is the encoder's last hidden state."
    context: "The W3 slides use it to show why long sentences lose information, which motivates attention."
  - term: "vanishing gradient"
    aliases: ["gradient vanishing"]
    definition: "During backpropagation the gradient is a product of many terms. If each is below 1 it shrinks exponentially and early time steps stop learning; if each is above 1 it blows up, which is the exploding gradient."
    context: "W3 uses it to explain the limits of RNNs before introducing LSTM."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention)

**Video status: Videos included.** [Source details](#course-video-sources)

This is post 4 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. [Post 2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) introduced RNN language models, which read one token at a time and predict the next. [HW1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) tested word vectors. This post takes on a problem RNN language models never faced: **how do you design a model when the input and output have different lengths?**

The source is the 33-slide deck [W3_Sequence-to-sequence Models and Attention Mechanisms.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Sequence-to-sequence%20Models%20and%20Attention%20Mechanisms.pdf) from the [IKMLab course repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing). The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) lists it in the W3 row with two recordings, [W3 Tue](https://www.youtube.com/live/LFeFc0VtKRI) and [W3 Thu](https://www.youtube.com/live/UZ22K0rmU1g) (lectures are in Mandarin). Reading the captions showed W3 Tue is about word embeddings and language models, so it now lives in [part 2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en), and [W4 Thu](https://www.youtube.com/live/tr5QyN5TswM), whose first half (LSTM recap, RNN plus attention) matches this deck's attention part, is embedded instead. That row's Topics column says "Introduction to NLP (Language model)", but it is a syllabus template, so the slides are the source of truth. This post is based on the slides only; I did not check it against the recordings segment by segment.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: the YouTube videos are public and embeddable. After reading the captions, W3 Thu covers the end of RNNs, seq2seq and LSTM, and W4 Thu covers attention. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=UZ22K0rmU1g
title: Fall 2025 W3 Thu recording
```

```youtube
url: https://www.youtube.com/watch?v=tr5QyN5TswM
title: Fall 2025 W4 Thu recording
```

Original videos: [Fall 2025 W3 Thu recording](https://www.youtube.com/watch?v=UZ22K0rmU1g)、[Fall 2025 W4 Thu recording](https://www.youtube.com/watch?v=tr5QyN5TswM)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both the W3 Thu and W4 Thu transcripts were read through. W3 Thu first finishes RNNs (NER, sentiment classification, stacking and bidirectional), then covers seq2seq (translation with RNNs, the context vector, teacher forcing), vanishing gradients and the LSTM gates, and closes by saying RNNs/LSTMs cannot be parallelized; W4 Thu recaps LSTM, then covers RNN plus attention (the translation alignment figure, the cost of storing every hidden state), then moves on to QKV and self-attention. These line up with the encoder-decoder, vanishing-gradient, LSTM and attention sections of this post. The original W3 Tue is about word embeddings and language models and was moved to part 2; W4 Thu is also embedded in the Transformer post. Slide numbers and details come from the slides; the body is unchanged.

## The problem: translation lengths do not line up

The deck opens by noting that many advances in NLP language models were first driven by translation. It shows a few examples, including the Chinese idiom 來都來了 rendered as "Since we're already here…".

The real point is on slide 3. The same sentence has different lengths in three languages:

| Language | Sentence | Tokens |
|---|---|---|
| English | Look over there | 3 |
| Chinese | 請看那邊 | 4 |
| Japanese | あそこを見てください | 12 |

Classification has a fixed output size, so you can put an FFN on top of an RNN. Translation output may be longer or shorter than the input. The slide's conclusion: the hidden state has to encode the original sequence and pass it on to the generation side.

## Encoder-decoder: read everything, then speak

A seq2seq model maps a **variable-length input sequence** to a **variable-length output sequence**. The slides list three uses: machine translation, summarization, and dialogue generation.

Generating a sequence with an RNN works like this: feed the input one element at a time, update the hidden state at each step, emit one output element per step, and repeat until a target length or an end-of-sequence token. Generation starts from a special start token.

Translation uses the encoder-decoder architecture (slide 10, drawn from [Jurafsky & Martin's SLP3](https://web.stanford.edu/~jurafsky/slp3/)), which has three parts:

1. **Encoder**: reads x₁:ₙ and produces contextual representations h₁:ₙ.
2. **Context vector**: a function of h₁:ₙ that hands the gist of the input to the decoder. The simplest version is the encoder's last hidden state, which is said to "contain all the information of the input."
3. **Decoder**: starts from the context vector and generates an output of any length.

Squeezing a whole sentence into one vector is exactly what attention will later fix.

## Vanishing gradients in RNNs

Slides 11–14 walk backpropagation through the shared parameter W. Every time step reuses W, so the earlier an input is, the more factors its gradient gets multiplied by. The slides conclude:

- If those factors are **below 1**, the gradient decays exponentially: **vanishing gradients**.
- If they are **above 1**, it grows quickly: **exploding gradients**.

Vanishing gradients cause three problems. Important information from early steps is lost as sequences get longer. Parameter updates for early steps slow down or stall. Long generated sequences come out poorly and may become incoherent.

## LSTM: gates that decide what to keep and forget

[LSTM](https://www.bioinf.jku.at/publications/older/2604.pdf) was proposed to address vanishing gradients in RNNs. Besides the hidden state hₜ, it keeps a cell state cₜ and uses gates to control what flows in and out:

| Component | What the slides say |
|---|---|
| Forget gate | A sigmoid decides which past memory to discard |
| Input gate | A sigmoid decides which new information to write into the cell state |
| Candidate memory | A tanh produces the new content that might be written |
| Output gate | Controls how much of the cell state flows to the hidden state |

Slide 21 explains the four parts with one sentence: "The cat chased the mouse, and then it climbed a tree."

- At "climbed a tree", the **forget gate** lowers the weight of "chased the mouse" because the focus has moved to a new action.
- At "climbed", the **input gate** stores the new action in memory.
- The **candidate memory** encodes "climb + tree".
- When producing "tree", the **output gate** pulls the location being climbed out of memory.

Gates and memory cells let an LSTM keep or drop information selectively. Gradient flow is steadier, and long-range dependencies are easier to capture than with a plain RNN. The slides say LSTM "partially" avoids the problem.

## The two problems left in the RNN family

Slide 23 spells them out:

1. **Vanishing/exploding gradients**: LSTM eases them, but they remain.
2. **Poor parallelism**: each step waits for the previous hidden state. That limits training speed on large datasets and caps how big language models can grow.

## Attention: look back at the whole sentence at every step

The core idea of attention: **when producing each output, let the model focus on the most relevant parts of the input.** The slides present it in two stages.

### Stage one: attention with RNNs

Attention first appeared alongside RNNs, in [Bahdanau, Cho & Bengio (2014)](https://arxiv.org/abs/1409.0473). When the decoder computes a new hidden state sₜ, it scores sₜ against every input token (encoded by a bidirectional RNN) and takes a weighted sum of the inputs. An alignment model produces the scores, measuring how well the inputs around position j match the output at position i.

The decoder no longer depends on one context vector. It sees the whole input at every step. Slide 27 shows the paper's translation alignment plot.

### Stage two: drop the RNN

Slide 28 gives two reasons to remove the RNN. Its main job, extracting sequential features, can be done with simpler and cheaper methods. And RNNs cannot be parallelized, which limits scale.

Attention without an RNN multiplies the input by three learned weight matrices to get Q, K, and V, then computes an N×N score matrix QᵀK, where N is the text length.

### Why divide by √d

Slides 30–31 explain the scaling factor. Suppose each component of q and k is a random variable with mean 0 and variance 1. Their dot product then has variance d. To bring the variance back to 1, divide the scores by √d.

The summary slide:

- RNN is the basic neural network for NLP tasks; LSTM modifies it to ease gradient problems.
- Attention with RNNs avoids vanishing gradients; attention without RNNs is parallelizable and simpler.

Attention without RNNs is the heart of the Transformer, which this series covers in full in [Transformers and Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en).

## Things to try after reading

1. **Check the variance yourself.** In NumPy, draw two standard normal vectors with d = 64, take ten thousand dot products, measure the variance, then divide by 8. Ten lines of code confirm slide 31.
2. **Annotate the LSTM example in another language.** Translate "The cat chased the mouse, and then it climbed a tree" into a language you know, mark what each gate should do word by word, and compare with slide 21.
3. **Warm up for the next post.** [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) has you teach a two-layer LSTM arithmetic. The vanishing and exploding gradients here map to that report's question about why gradient clipping is needed.

## Further reading

- Previous in this series: [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en)
- Next in this series: [PyTorch TA Session + HW2 Arithmetic as a Language](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en)
- The same material in English-language courses: [CS224N: RNNs and Language Models](/posts/ai/2026-08-22-cs224n-rnn-language-models-en), [CMU 11-785: Language Models and Translation](/posts/ai/2026-08-22-cmu-11785-17-language-models-translation-en), [CMU 11-785: Attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)
- Back to the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against the transcripts. W3 Thu covers the end of RNNs, seq2seq and LSTM, and W4 Thu covers attention, matching the post; W3 Tue is about word embeddings, was moved to part 2, and W4 Thu was embedded here instead. The body is unchanged.

## References

- [W3_Sequence-to-sequence Models and Attention Mechanisms.pdf (course slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Sequence-to-sequence%20Models%20and%20Attention%20Mechanisms.pdf)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 W3 Thu recording](https://www.youtube.com/live/UZ22K0rmU1g) (in Mandarin)
- [Fall 2025 W4 Thu recording](https://www.youtube.com/live/tr5QyN5TswM) (in Mandarin)
- [Bahdanau, Cho & Bengio (2014), Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- [Jurafsky & Martin, Speech and Language Processing (3rd ed. draft)](https://web.stanford.edu/~jurafsky/slp3/)
- [Hochreiter & Schmidhuber (1997), Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf)
