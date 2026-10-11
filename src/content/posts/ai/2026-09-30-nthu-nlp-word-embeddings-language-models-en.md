---
title: "NTHU Hung-Yu Kao NLP, Week 2: Word Embeddings and Language Models, from Counting N-grams to RNNs"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, language-model, n-gram, perplexity, rnn]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 2
tldr: "Week 2 of Hung-Yu Kao's NLP course at NTHU is a 62-page deck about predicting the next word. The first part covers statistical language models with a bigram count table, add-one smoothing, and perplexity, then sparse vectors through a PPMI example with cherry and digital. The middle returns to Word2Vec's negative sampling and uses the Chinese word for 'apple' to show why contextualized embeddings are needed. The last part derives RNNs from three weaknesses of feedforward networks and shows how they handle NER, sentence classification, and stacked and bidirectional variants."
description: "Guide to week 2 of NTHU Hung-Yu Kao's Natural Language Processing, Fall 2025: based on 'W2 Word embeddings and Language Modeling (RNN).pdf' and the W2 Tuesday and Thursday recordings. Covers n-grams and the Markov assumption, add-k smoothing, four readings of perplexity, n-gram limits, TF-IDF and PPMI sparse vectors, analogies and semantic change in embeddings, Word2Vec negative sampling, contextualized embeddings, the ingredients of neural network training, limits of FFNs, RNNs for NER, and stacked and bidirectional RNNs."
draft: false
glossary:
  - term: "perplexity"
    aliases: ["PPL"]
    definition: "A measure of how 'surprised' a language model is by test text, readable as the average number of choices the model hesitates between at each step. Lower means better prediction."
    context: "The slides use it as the shared evaluation for n-gram and neural language models."
  - term: "PPMI"
    aliases: ["positive pointwise mutual information"]
    definition: "Compare how often a word and a context word actually co-occur with how often they would if independent, take log2, and set every negative value to 0."
    context: "The slides pair it with TF-IDF as the two ways to build sparse vectors."
  - term: "contextualized embedding"
    definition: "A representation in which the same word gets a different vector depending on the sentence around it, unlike Word2Vec's one fixed vector per word."
    context: "The slides cite BERT and GPT and illustrate with 'Apple the company' versus 'apple pie'."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: this post is based on the Fall 2025 run of [NTHU Hung-Yu Kao's Natural Language Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing), specifically [W2_Word embeddings and Language Modeling (RNN).pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf) (62 pages). The matching recordings are [Week 2 Thu.](https://www.youtube.com/live/cqp5a39eyJQ) and [Week 3 Tue.](https://www.youtube.com/live/LFeFc0VtKRI) (in Mandarin). Week 2 Tue. was originally attached here, but reading its captions showed it covers the information-retrieval material of the previous post, so it was moved there; Week 3 Tue. was moved in from the seq2seq post. Facts were checked against the slides on 2026-09-30. The post follows the slides only; I did not transcribe the recordings. Access rating **A3** (see the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) for why).

**Series position**: previous: [Intro to NLP and classical text processing](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) | next: [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) | [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

"Please turn your homework …" What comes next? Over? In? You can probably guess, and guess well. Week 2's slides start from that question: **how did predicting the next word go from counting to neural networks?**

The [previous post](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) turned text into vectors from the retrieval side. This one switches to language models. The first slide is titled "GAI Motivation" and lists two problems with supervised learning (text classification, QA systems): not enough training data, and limited domain knowledge. The next slide says the most common way to generate a sentence is to write the words down one after another.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: the YouTube videos are public and embeddable. After reading the captions, Week 2 Thu. covers the first part of the deck (up to perplexity) and Week 3 Tue. covers the later part. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=cqp5a39eyJQ
title: Fall 2025 Week 2 Thu. recording
```

```youtube
url: https://www.youtube.com/watch?v=LFeFc0VtKRI
title: Fall 2025 Week 3 Tue. recording
```

Original videos: [Fall 2025 Week 2 Thu. recording](https://www.youtube.com/watch?v=cqp5a39eyJQ)、[Fall 2025 Week 3 Tue. recording](https://www.youtube.com/watch?v=LFeFc0VtKRI)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both the Week 2 Thu. and Week 3 Tue. transcripts were read through. Week 2 Thu. opens with the HW1 briefing, then covers n-grams, language models, add-one smoothing and perplexity (including using perplexity to judge whether text was written by ChatGPT and the four-gram analysis in the J.K. Rowling pseudonym case), and stops at perplexity; Week 3 Tue. then revisits perplexity and the limits of n-grams, and covers sparse vs. dense vectors, the PPMI cherry/sugar example (3.3), analogies and semantic change in word vectors (broadcast, network), CBOW/skip-gram and negative sampling, softmax, contextual embeddings (Apple the company vs. the pie), neural-network basics, RNNs (the moving-average analogy) and NER/sentiment classification, all consistent with the post sections. The original Week 2 Tue. covers information retrieval (TF-IDF, BM25, LSA), which belongs to the previous post, so it was moved there; Week 3 Tue. was moved in from the seq2seq post. Slide numbers and figures come from the slides; the body is unchanged.

## Statistical language models: counting n-grams

The slides recall Markov (1913, on how the chance of a letter depends on the letter before it) and Shannon (1951, "Prediction and Entropy of Printed English"). Then they use a collage of Chinese song lyrics: in that text, the probability that one particular character follows "you" is 1/4, and the probability that it follows a longer three-character history is 0. A language model learns exactly these conditional probabilities.

An **n-gram** is a sequence of n words: the unigram "please," the bigram "please turn," the trigram "please turn your." The slides slip in an application: the J.K. Rowling pen-name case reported by [Scientific American](https://www.scientificamerican.com/article/how-a-computer-program-helped-show-jk-rowling-write-a-cuckoos-calling/). The stylometry software JGAAP used four-character sequences (four-grams), the frequency of the most common words, the distribution of word lengths, and frequent word pairs to link *The Cuckoo's Calling* to the author of *Harry Potter*.

### From counts to probabilities

A bigram model is counting. The slides first use three sentences (C(I want) = 2, C(want to) = 3), then give a bigram count table for eight words: "I" followed by "want" appears 827 times, and "want" followed by "to" appears 608 times.

The table has many zeros. Unseen does not mean impossible, so the slides apply **add-k smoothing (k=1)**: add 1 to every cell, then divide by the totals to get relative frequencies. Afterward P(want | I) is about 0.21 and P(to | want) about 0.26.

A sentence's probability is split with the chain rule, then simplified with the **Markov assumption**: a word's probability depends only on the previous word (bigram) or the previous n−1 words. That step makes the computation feasible, and it plants every limitation that follows.

### Perplexity: evaluating a language model

The slides say lower perplexity means a better language model, and give four readings of it:

1. **A measure of uncertainty**: how unsure the model is when predicting.
2. **An average branching factor**: how many choices the model picks among at each step, on average.
3. **A quantification of performance**: how well the model has captured the rules and structure of the language.
4. **A compression indicator**: lower perplexity means the model assigns higher probability to the test data, which is better compression.

The slide ends with a question it does not answer: **can perplexity tell whether a text was written by AI?** Keep it in mind. Perplexity comes back in the [decoding and evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) post.

### Four limits of n-grams

- **Limited context**: cannot capture dependencies much longer than N.
- **Data sparsity**: parameters grow exponentially as N grows.
- **Ignoring word order and context**: words are assumed independent.
- **Low flexibility**: weak at synonyms and at adapting to different settings such as dialogue.

## Sparse vectors: TF-IDF and PPMI

Before neural networks, the slides cover the sparse ways to represent a word by its context. Each dimension is a word, and most values are 0.

TF-IDF is a week 1 recap. The new one is **PPMI**. It starts from the distributional hypothesis: words in similar contexts have similar meanings ("I enjoy coding" and "I like coding").

PMI compares two things: how often word w and context word c actually co-occur, and how often they would if they were independent, then takes log2. PPMI sets every negative value to 0.

The example counts four words across five contexts: cherry appears with pie 442 times, digital with computer 1,670 times. After converting to probabilities and computing PPMI, cherry's vector is (0, 0, 0, 4.38, 3.30), nonzero only on pie and sugar, while digital and information concentrate on computer, data, and result. For the cherry–sugar cell, the slide's arithmetic is log2(0.0021 / (0.0415 × 0.0052)) ≈ 3.30.

## Dense vectors: Word2Vec and contextualized embeddings

Dense vectors place words in a continuous space where similar words sit close together. The slides show two properties:

- **Analogy**: Washington − U.S. + U.K. = London. This is exactly what [HW1 in the next post](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) asks you to test.
- **Semantic change**: embeddings can track how meaning shifts over time. In the slide's figure, broadcast in the 1850s sits near sow, seed, and scatter, and by the 1900s it has moved next to newspapers and television. Network sits near telegraph and wires in the 1920s, near Internet and Email in the 1990s, and near cloud computing, blockchain, and IoT in the 2020s.

### Word2Vec with negative sampling

Week 1 covered the Skip-gram network. This week explains training in four steps:

1. Treat the target word and a context word from its window as a positive example.
2. Randomly sample other words from the vocabulary as negative examples.
3. Train a logistic-regression classifier to tell the two apart.
4. Use the learned weights as the embeddings.

The slides also flag efficiency: each update touches only the vectors in the window. With window size m, a window holds just 2m+1 words, so the gradient is sparse.

### Why one word needs more than one vector

Word2Vec gives each word one fixed vector. The slides use the Chinese word for "apple" to show why that falls short. Apple the company and apple pie are different things. "An apple changed his life" means one thing for Newton and another for Steve Jobs.

**Contextualized embeddings** give the same word different vectors depending on context; the slides cite BERT and GPT. They learn from long contexts rather than a small window, and use every layer of a deep neural language model. The slides close with a practical question: in a downstream task, should the embedding layer be frozen or trained along with the rest?

## Neural language models: from FFN to RNN

Processing these vectors needs a model. The slides fill in a few pages of deep-learning basics:

- **Three components**: the model (the structure from inputs to outputs), the optimizer (the algorithm that adjusts parameters to reduce error), and the loss function (how far predictions are from targets).
- **Six training steps**: prepare data, build the model in a framework (TensorFlow, PyTorch), pick a loss (cross-entropy and others), pick an optimizer (Adam, SGD, and others), train, evaluate.
- **Activation functions**: softmax outputs a distribution summing to 1, for multi-class classification; sigmoid outputs 0 to 1, for binary classification; tanh outputs −1 to 1, zero-centered, common in hidden layers; ReLU adds nonlinearity and avoids vanishing gradients.

### Three weaknesses of FFNs

A feedforward network is a multilayer network with no cycles between units. The slides list three problems for language:

- **No sequence modeling**: word order and dependencies matter.
- **Fixed input size**: sentences vary in length.
- **Limited context**: many tasks need long-range dependencies.

### RNNs

RNNs are built for sequences. The slides describe them as an "advanced moving average." Each step's hidden state is computed from the previous hidden state and the current input through learnable weights and a nonlinearity, and **every time step shares the same weights**.

A timeline runs from the Hopfield network, Elman RNN, BPTT, LSTM, bidirectional RNNs, GRU, and Seq2seq to attention (2015) and the Transformer (2017). The slides list four properties of RNNs:

- Sequential processing, which models dependencies over time.
- Recurrent connections, which keep an internal memory.
- Parameter sharing across time steps, which makes learning efficient.
- **Vanishing gradients**: plain RNNs struggle to learn long-range dependencies.

This week does not expand on the last point. It is where [post 4, Seq2seq and attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en), begins.

### What RNNs can do

- **Named entity recognition (NER)**: find countries, organizations, and people in a sequence. It is token classification: each step's output goes through an FFN to a one-hot label.
- **Sentence classification**: classify the whole sequence, not each token. Take the last token's hidden state and feed it to an FFN and softmax.
- **Stacked RNNs**: several RNN layers, each taking the previous layer's output. They usually beat a single layer because layers learn representations at different levels of abstraction, but training cost rises quickly with depth.
- **Bidirectional RNNs**: many applications need the whole input. Two independent RNNs read start-to-end and end-to-start; for sentence classification, the final hidden states from both directions are combined and passed to the classifier.

## The week's map

The final summary slide is this post's skeleton:

| Category | Methods | Core idea |
|---|---|---|
| Statistical LM | n-gram | Count, Markov assumption |
| Sparse vectors | TF-IDF, PPMI | Encode a word by its contexts |
| Dense vectors | Word2Vec, contextualized embeddings | Self-supervised training |
| Neural LM | FFN, RNN | Fully connected network; recurrent structure that keeps a hidden state |

## The Fall 2026 counterpart

The 2026 main README links the [v2 of this deck](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29_v2.pdf) in W3, with the [Fall 2026 Week 3 recording](https://youtube.com/live/g0QE6O17BWE), and HW1 is released the same week. v2 is also 62 pages, and its extracted text is nearly identical to the 2025 deck apart from layout.

## What to do after reading

- **Tonight**: take a text you know well, count every bigram with Python's `collections.Counter`, pick a word, and see what most often follows it. That is an n-gram model learning only what it has seen.
- **One step further**: hand-compute one cell of the slide's PPMI table and confirm where 3.30 comes from.
- **Next post**: [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) has you run analogy questions on pretrained vectors and on a Word2Vec you train yourself, to check whether relations like Washington − U.S. + U.K. = London were really learned.

## Further reading

- [CS224N word vectors](/posts/ai/2026-08-22-cs224n-word-vectors-en): Stanford's derivation of word2vec.
- [CS224N RNNs and language models](/posts/ai/2026-08-22-cs224n-rnn-language-models-en): another take on n-grams, perplexity, and RNN language models.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against the transcripts. Week 2 Thu. (up to perplexity) and Week 3 Tue. (word vectors to RNNs) match the post; Week 2 Tue. covers information retrieval and was moved to the previous post, and Week 3 Tue. was moved in from the seq2seq post. The body is unchanged.

## References

- [W2_Word embeddings and Language Modeling (RNN).pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf)
- [W2_Word embeddings and Language Modeling (RNN)_v2.pdf (Fall 2026)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29_v2.pdf)
- [2025 README: Fall 2025 weekly table](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 Week 2 Thu. recording](https://www.youtube.com/live/cqp5a39eyJQ) (in Mandarin)
- [Fall 2025 Week 3 Tue. recording](https://www.youtube.com/live/LFeFc0VtKRI) (in Mandarin)
- [Fall 2026 Week 3 recording](https://youtube.com/live/g0QE6O17BWE) (in Mandarin)
- [Scientific American: How a Computer Program Helped Show J.K. Rowling Write A Cuckoo's Calling](https://www.scientificamerican.com/article/how-a-computer-program-helped-show-jk-rowling-write-a-cuckoos-calling/)
