---
title: "NTU ADL Lecture 3: Word Representations, Language Models, and RNNs"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, language-model, rnn]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 3
tldr: "The first real lecture of ADL Fall 2025 has one through-line: a language model predicts the next word. It starts from one-hot vectors and co-occurrence matrices, moves through the zero-probability problem of n-grams and the smoothing that a neural LM gets for free, and ends at the RNN LM, which folds all previous words into a hidden state. BPTT and vanishing/exploding gradients are the training cost, and LSTM and GRU patch it with gating. The lecture closes by splitting applications into sequence input versus sequence output, which separates tagging from encoder-decoder models."
description: "A guide to the Sequence Modeling lecture of NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025: knowledge-based versus corpus-based word representations, co-occurrence matrices and SVD, n-gram LMs and smoothing, the Bengio 2003 neural LM, RNN LMs and weight sharing, BPTT, vanishing and exploding gradients, clipping, LSTM/GRU, bidirectional RNNs, and applications such as sentiment analysis, POS tagging, slot tagging, and machine translation."
draft: false
glossary:
  - term: "RNN LM"
    aliases: ["RNNLM", "recurrent neural network language model"]
    definition: "A language model that uses a recurrent neural network to predict the next word. At each time step it combines the current word vector with the previous hidden state, and every step shares the same weights, so in principle it can use the whole history without the model growing with sentence length."
    context: "The ADL Sequence Modeling lecture introduces it after n-gram and feed-forward neural LMs to remove the fixed context window."
  - term: "BPTT"
    aliases: ["backpropagation through time"]
    definition: "Unroll an RNN along the time axis into one deep network and run ordinary backpropagation on it. Because every time step shares weights, gradients from all steps accumulate on the same parameters."
    context: "Slides 36–41 of the ADL Sequence Modeling deck walk through the unrolling and the forward and backward passes."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This guide is based on NTU Yun-Nung Chen's *Applied Deep Learning* (ADL), **Fall 2025 (semester 114-1, 2025/09/01–12/15)**. The main materials are the [Sequence Modeling slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) (66 pages) from the week of 9/01 and the four video segments the course page links: [3.1](https://youtu.be/215BxEbYrCs), [3.2](https://youtu.be/eVA_WTW4gXE), [3.3](https://youtu.be/e9Ef3dZcvjw), and [3.4](https://youtu.be/MyKrovk8tLM). The optional word-embedding material uses the [Fall 2022 Word Embeddings slides](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf). All facts were checked against the official materials on 2026-09-30. The lectures are taught in Mandarin with English slides. The course as a whole is rated **A2**: slides and videos for the lectures are public, and the gaps are on the homework side (HW2 and HW3 have only intro videos). See the [series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) for details. This lecture has no gaps of its own.

**Series**: Previous: [Neural Networks and Backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en) | Next: [Attention and the Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The previous two posts cover material students must self-study before enrolling. This lecture is the first regular class of [ADL Fall 2025](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), held on 9/01 right after Course Logistics. The slide subtitle is "Language Modeling & Recurrent Neural Networks," and the outline has four parts: word representations, language modeling, RNNs, and RNN applications.

That is four new ideas, but one of them carries the rest: **a language model estimates the probability of a word sequence by predicting one next word at a time.** Word representations are its input, the RNN is its architecture, and the applications are what you get by changing its output. Keep that line in mind and the lecture holds together.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=215BxEbYrCs
title: ADL 3.1: Word Representations
```

```youtube
url: https://www.youtube.com/watch?v=eVA_WTW4gXE
title: ADL 3.2: Language Modeling
```

Original videos: [ADL 3.1: Word Representations](https://www.youtube.com/watch?v=215BxEbYrCs)、[ADL 3.2: Language Modeling](https://www.youtube.com/watch?v=eVA_WTW4gXE)、[ADL 3.3: Recurrent Neural Network](https://www.youtube.com/watch?v=e9Ef3dZcvjw)、[ADL 3.4: RNN Applications](https://www.youtube.com/watch?v=MyKrovk8tLM)、[ADL 4: Gating Mechanism (LSTM and GRU)](https://www.youtube.com/watch?v=LosffMy3BqM)、[5.1 Word Representation Review](https://www.youtube.com/watch?v=K2oYKdK--9U)、[5.3 Word2Vec Training](https://www.youtube.com/watch?v=4Vrd15ZwxH4)、[5.4 Word2Vec Variants](https://www.youtube.com/watch?v=cKor9hMjFLc)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## How do you put a word into a computer?

Slide 4 splits word representations into two camps.

**Knowledge-based**: describe words with hand-built hypernym (is-a) relations such as WordNet. Slide 6 lists four problems: new words are missing, the labels are subjective, the annotation is expensive, and word similarity is hard to compute.

**Corpus-based**: learn from large amounts of text. The simplest version is one-hot, where each word is a vector with a single 1. The trouble is that the dot product of car and motorcycle is always 0, so nothing says they are related.

The turning point is one line on slide 8: words with similar meanings tend to have similar neighbors. So a word is now represented by its neighbors:

- With the whole document as the neighborhood, you get a word-document co-occurrence matrix, which captures topics (Latent Semantic Analysis).
- With a window of nearby words, you capture syntactic information such as part of speech, plus semantic information.

Slide 10 builds a window-1 co-occurrence matrix from three sentences: "I love AI.", "I love deep learning.", "I enjoy learning." Both love and enjoy co-occur with I, so their similarity is now above 0.

The problem is that the matrix grows with the vocabulary and is sparse. Slides 11–13 offer two ways to get short, dense vectors:

1. Run SVD on the co-occurrence matrix. It is expensive (O(mn²) for an n×m matrix), and adding new words is awkward.
2. Learn low-dimensional vectors directly, which is what we now call word embeddings. The slides list the milestones: Rumelhart 1986, Bengio 2003, Collobert & Weston 2008, word2vec (Mikolov 2013), and GloVe (Pennington 2014).

This lecture does not explain how Word2Vec or GloVe are trained. The course page lists them under "optional supplement," linking the Fall 2022 [Word Embeddings slides](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf) (48 pages; the closing slide summarizes skip-gram, CBOW, GloVe, and word-vector evaluation) and a set of older videos. If you want to fill the gap, watch these five:

- [5.1 Word Representation Review](https://youtu.be/K2oYKdK--9U)
- [5.3 Word2Vec Training](https://youtu.be/4Vrd15ZwxH4)
- [5.4 Word2Vec Variants](https://youtu.be/cKor9hMjFLc)
- [5.5 GloVe](https://youtu.be/BbTSvFwuCbo)
- [5.6 Word Vector Evaluation](https://youtu.be/MnFDW20J17E)

The link labeled "Intro" on the course page (`LosffMy3BqM`) is wrong. The video it points to is actually titled "[ADL 4: Gating Mechanism 了解LSTM與GRU的細節](https://youtu.be/LosffMy3BqM)" (the details of LSTM and GRU). It works well as a supplement to the LSTM/GRU section below.

## Language modeling: the probability of a word sequence

Slide 16 uses speech recognition as the example: "recognize speech" and "wreck a nice beach" sound almost the same. In the [3.2 video](https://youtu.be/eVA_WTW4gXE), Chen says most people hear the first one because the language model in their head says it is more common. A machine can't tell them apart from sound alone. It needs to know which word order is more plausible.

### n-grams: probabilities by counting

An n-gram model looks only at the previous n−1 words, and the probabilities are counted from training data:

```
P(beach | nice) = C(nice beach) / C(nice)
```

The trouble is unseen combinations. On slide 19 the training data contains only "The dog ran" and "The cat jumped," so P(jumped | dog) is 0. The sentence probability is a product, so one zero wipes out the whole sentence. The fix is smoothing: give unseen pairs a small probability (the slide uses 0.0001). In the video Chen points out the awkward part: why 0.0001 and not some other value? The root cause is that you can never collect all possible text.

### Neural LM: let a network predict, and smoothing comes for free

Slides 21–23 replace counting with a neural network that predicts the distribution of the next word, following [Bengio et al. 2003](https://www.jmlr.org/papers/v3/bengio03a.html). The input is the vectors of the previous few words; the output is a probability over the whole vocabulary.

The payoff is on slide 23. The vectors for cat and dog are close, so if P(jump | cat) is large, P(jump | dog) rises too, even though "dog jumps" never appears in the data. The slide's summary: "Smoothing is automatically done."

What remains is a fixed context window: the model still sees only the previous n−1 words.

### RNN LM: fold all previous words into a hidden state

Slides 25–26 add two ideas: condition on every previous word, and tie the weights across time steps. In the video Chen explains why tying matters. A 10-word sentence uses the same weights 10 times, a 100-word sentence 100 times, so the model does not grow as the history gets longer.

She also notes that RNNs are rarely used today, but they are the step before the Transformer: the Transformer keeps the temporal information and drops the RNN's weaknesses.

## The RNN itself: definition, training, problems

The definition on slides 29–31 is short. At each time step t:

```
s_t = σ(W s_{t-1} + U x_t)      σ can be tanh or ReLU
o_t = softmax(V s_t)
```

The whole model learns just three matrices: W, U, and V. For language modeling, the training target is to make each output o_t match the next real word y_t, summing the loss over all steps and optimizing it jointly.

<details>
<summary>BPTT: unrolling the RNN for backpropagation (slides 34–41)</summary>

The slides first review backpropagation in an ordinary network: the gradient of a parameter is the product of a forward-pass activation and a backward-pass error signal δ, and δ flows backward from the last layer.

An RNN is unrolled along time. The inputs are init, x₁, x₂ … x_t, and the output o_t is compared with the target y_t. Once unrolled, "one layer back" becomes "one time step back": the error flows from s_t to s_{t−1}, s_{t−2}, and so on. That is why it is called Backpropagation through Time.

The difference from an ordinary network is that the weights are tied (slides 39–40: "Weights are tied together"). The same connection at every time step is the same parameter, so its gradients add up.

Slide 41 shows four time steps. The forward pass computes s₁ through s₄. The backward pass runs once each for C⁽⁴⁾, C⁽³⁾, C⁽²⁾, and C⁽¹⁾, and each loss flows only to earlier steps. In the [3.3 video](https://youtu.be/e9Ef3dZcvjw) Chen warns that with long sequences and shared weights, RNNs take a long time to train.

</details>

### Vanishing and exploding gradients

Slide 43: backprop multiplies by the same matrix at every step, so the gradient quickly becomes very small or very large. Slide 44 draws the resulting error surface as either very flat or very steep, which makes optimization unstable. Chen's illustration: multiply 0.9 by itself many times and you approach 0; multiply something slightly above 1 and it blows up.

The two problems get different fixes:

- **Exploding → clipping** (slide 46, citing [Pascanu et al. 2013](https://proceedings.mlr.press/v28/pascanu13.html)): when the gradient norm crosses a threshold, scale it down proportionally. The slide notes that thresholds from half to ten times the average norm still converge.
- **Vanishing → gating** (slides 47–49): the example is "I grew up in France… I speak fluent French." In theory an RNN can remember France; in practice the gradient never gets back there. LSTM (Hochreiter & Schmidhuber 1997) and GRU (Cho et al. 2014) add gates that open a shortcut to distant steps and let the model learn when to open them.

Chen adds a preview in the video: long-range dependencies are exactly what the Transformer is good at, because attention can jump straight to the relevant word without passing through everything in between. That is where the [next post](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) starts.

### Two extensions

- **Bidirectional RNN** (slide 50): run left-to-right and right-to-left and concatenate, so each position summarizes both past and future. The video warns that for a next-word language model you cannot feed the whole sentence into a bidirectional RNN, or the model will see the answer.
- **Deep bidirectional RNN** (slide 51): each layer passes its intermediate representation to the next.

## What RNNs can do: look at the shape of input and output

Slide 54 writes the learning problem as f : X → Y and says network design should exploit the properties of the input and output domains. Inputs can be words, word sequences, audio, or click logs. Outputs can be a single label, a tag sequence, a tree, or a probability distribution.

In the [3.4 video](https://youtu.be/MyKrovk8tLM) Chen adds a practical note: averaging a sentence's word vectors looks crude, but if the task is only "is this about finance?", it may be enough, and it is cheap.

By input and output, the lecture sorts applications into three kinds:

| Kind | Approach | Slide example |
|---|---|---|
| Sequence input | An RNN compresses the sentence into one vector, a classifier sits on top, and both train end to end | Sentiment analysis on "這 規格 有 誠意" ("these specs show sincerity," slide 57) |
| Sequence output aligned with the input (tagging) | One tag per time step | POS tagging of "四樓 好 專業" (roughly "the fourth-floor reply is really professional"); slot tagging that turns "send email to bob about fishing this weekend" into `send_email(contact_name="bob", subject="fishing this weekend")` (slides 61–62) |
| Sequence output not aligned (seq2seq) | One RNN encodes, another decodes | Machine translation and chit-chat dialogue (slides 64–65) |

One line on slide 59 is worth keeping: sequence output can be viewed as a sequence of classifications. In the video Chen connects this to today's LLMs: generating every token is one classification over the whole vocabulary.

She also recommends using tagging whenever a task allows it, because aligned input and output mean fewer parameters and much easier training. The video ends by saying all of these applications can be done with Transformers instead, and HW1 uses a Transformer-family model (see [HW1: Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en)).

## How to self-study it

1. Start with [3.2](https://youtu.be/eVA_WTW4gXE) (15 minutes). The n-gram → neural LM → RNN LM progression is the spine of the lecture.
2. While watching [3.3](https://youtu.be/e9Ef3dZcvjw), keep slide 41 open and draw the four-step backward pass on paper. Check where each loss flows.
3. For word embeddings, go back to the five optional videos. For the inside of LSTM and GRU gates, watch the Gating Mechanism video the course page mislabels as Intro.

One thing to try tonight: take the three sentences on slide 10, count the window-1 co-occurrence matrix yourself, and compute the cosine similarity of the love and enjoy rows. You will see "similar neighbors → similar vectors" happen by hand.

## Further reading

- The same material at Stanford: [CS224N Lecture 2: word2vec](/posts/ai/2026-08-22-cs224n-word-vectors-en), [CS224N Lecture 4: Language Models and RNNs](/posts/ai/2026-08-22-cs224n-rnn-language-models-en)
- How NTU's courses divide the ground: [NTU AI/ML course map](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/01 row and the optional-supplement row
- [Sequence Modeling slides (2025/09/01)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_SeqModel.pdf) — all slide numbers in this post refer to this deck
- [ADL 3.1: Word Representations](https://youtu.be/215BxEbYrCs) (22:04, in Mandarin)
- [ADL 3.2: Language Modeling](https://youtu.be/eVA_WTW4gXE) (15:28, in Mandarin)
- [ADL 3.3: Recurrent Neural Network](https://youtu.be/e9Ef3dZcvjw) (16:11, in Mandarin)
- [ADL 3.4: RNN Applications](https://youtu.be/MyKrovk8tLM) (12:25, in Mandarin)
- [Word Embeddings slides (Fall 2022, optional)](https://www.csie.ntu.edu.tw/~miulab/f111-adl/doc/220929_WordEmbeddings.pdf)
- [ADL 4: Gating Mechanism (LSTM and GRU)](https://youtu.be/LosffMy3BqM) — mislabeled on the course page as Word Embeddings Intro (in Mandarin)
- [ADL 2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Bengio et al., A Neural Probabilistic Language Model (JMLR 2003)](https://www.jmlr.org/papers/v3/bengio03a.html)
- [Pascanu, Mikolov & Bengio, On the difficulty of training recurrent neural networks (ICML 2013)](https://proceedings.mlr.press/v28/pascanu13.html)
