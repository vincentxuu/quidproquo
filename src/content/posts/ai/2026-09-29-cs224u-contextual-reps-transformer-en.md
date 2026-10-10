---
title: "CS224U Contextual Representations I: \"Break\" Has Eight Meanings, and How the Transformer Lets Each Word Read Its Context"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, transformer, attention, nlp]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 3
tldr: "The first three parts of CS224U's Spring 2023 contextual representations unit start with examples like \"break\" and \"crane\" to show why static word vectors were never going to be enough. They then build a Transformer block step by step on the three words \"The Rock rules.\" Only attention connects the columns; every other step runs on each column independently. Finally, two questions sort three positional encoding schemes: Do you have to fix the set of positions ahead of time? Does the scheme get in the way of generalizing to new positions? Absolute encoding fails both, sinusoidal encoding passes the first, and the relative encoding of Shaw et al. (2018) passes both."
description: "A guide to the first three sections (Guiding ideas, Transformer, Positional encoding) of the Stanford CS224U (Spring 2023) contextual representations slides and YouTube videos 04–06: the limits of static word vectors, where attention and subwords came from, a step-by-step walk through a Transformer block and multi-headed attention, and a comparison of absolute, sinusoidal, and relative positional encoding. Formulas are in collapsible blocks."
draft: false
glossary:
  - term: "positional encoding"
    definition: "A mechanism that adds a word's position in the sequence to its representation. Transformer attention has no sense of direction, so without positional encoding it cannot tell A B C from C B A."
    context: "This post compares absolute, sinusoidal, and relative schemes."
  - term: "WordPiece"
    aliases: ["word piece tokenization"]
    definition: "A tokenization method that splits words into smaller subword units. A word missing from the vocabulary is broken into known pieces instead of becoming UNK."
    context: "BERT uses it to keep its vocabulary under 30,000 items."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/).** It is part 3 of the [Stanford CS224U guide](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) series. The previous post covers [the opening lecture: the evolution of NLU and the course map](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu-en).

The CS224U session on April 5, 2023 covered contextual word representations. The official material is a [slide deck](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf) (a 95-page handout; slide numbers run to 81) in ten sections: Guiding ideas, Transformer, Pos enc, GPT, BERT, RoBERTa, ELECTRA, seq2seq, Distillation, and Wrap-up. The [XCS224U YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) splits it into ten short videos.

This post covers the first three sections, which match videos [04](https://www.youtube.com/watch?v=FEFeeRONEdw), [05](https://www.youtube.com/watch?v=yqV_YfBBtK0), and [06](https://www.youtube.com/watch?v=JERXX2Byr90). The remaining seven sections, on the model families, are in [the next post](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en).

Potts explains the trade-off at the start of video 04. Earlier versions of the course spent about two weeks on static vectors. The 2023 version goes straight to contextual representations and moves static vectors to the course's [background materials](https://web.stanford.edu/class/cs224u/background.html).

## Course video sources

The videos below are the recordings linked for the topics covered in this article.

```youtube
url: https://www.youtube.com/watch?v=FEFeeRONEdw
title: Video 04: Contextual Word Representations, Part 1: Guiding Ideas
```

```youtube
url: https://www.youtube.com/watch?v=yqV_YfBBtK0
title: Video 05: Part 2: Transformer
```

Original videos: [Video 04: Contextual Word Representations, Part 1: Guiding Ideas](https://www.youtube.com/watch?v=FEFeeRONEdw)、[Video 05: Part 2: Transformer](https://www.youtube.com/watch?v=yqV_YfBBtK0)、[Video 06: Part 3: Positional Encoding](https://www.youtube.com/watch?v=JERXX2Byr90)

Course and recording entries:

- [XCS224U YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## The scene: one "break," eight meanings

Slide 4 lists sentences that all use the same verb:

- The vase broke. (shattered)
- Dawn broke. (began)
- The news broke. (became public)
- Sandy broke the world record. (surpassed)
- Sandy broke the law. (violated)
- The burglar broke into the house. (entered by force)
- The newscaster broke into the movie broadcast. (interrupted)
- We broke even. (neither gained nor lost)

Adjectives behave the same way: flat tire, flat beer, flat note, flat surface. Go further out and "A crane caught a fish" probably means the bird, while "A crane picked up the steel beam" means the machine. "I saw a crane" can't be settled without more context.

The last pair goes furthest. In "Are there typos? I didn't see any." and "Are there bookstores downtown? I didn't see any.", the second sentences are identical, yet "any" refers to completely different things.

Potts's conclusion in the [video](https://www.youtube.com/watch?v=FEFeeRONEdw) is blunt. A static vector approach insists that "broke" is one vector across all those examples, so **it was never really going to work out**. Word meaning shifts with the surrounding words, the discourse, and even world knowledge. That is what contextual representations are meant to capture.

## From static to contextual: four phases, five milestones

The slides compress the history of static representations into four phases:

1. Feature-based, sparse: hand-written feature functions
2. Count-based, sparse: PMI, TF-IDF
3. Classical dimensionality reduction, dense: PCA, SVD, LDA
4. Learned dimensionality reduction, dense: autoencoders, word2vec, GloVe

The history of contextual representations is short. The slides give five dates:

| Date | Paper | Contribution |
|---|---|---|
| Nov 2015 | [Dai & Le](https://arxiv.org/abs/1511.01432) | Showed that LM-style pretraining helps downstream tasks |
| Aug 2017 | [McCann et al. (CoVe)](https://papers.nips.cc/paper/7209-learned-in-translation-contextualized-word-vectors) | Used bi-LSTMs pretrained for machine translation as a starting point for other tasks |
| Feb 2018 | [Peters et al. (ELMo)](https://aclanthology.org/N18-1202/) | First showed that very large-scale pretraining of bi-LSTMs gives rich multipurpose representations |
| Jun 2018 | [Radford et al. (GPT)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) | GPT |
| Oct 2018 | [Devlin et al. (BERT)](https://aclanthology.org/N19-1423/) | BERT, formally published in 2019 |

## Intuition: four building blocks that existed before the Transformer

The Transformer didn't come from nowhere. The Guiding ideas section is really an account of pieces that grew up separately in the years before it.

**First block: less built-in structure.** Slide 6 draws four models over "The Rock rules." Adding word vectors together decides in advance that meanings combine by addition, which is a high-bias choice. An RNN lets the combination be learned. A tree-structured network has to know ahead of time that "The Rock" is a constituent and "Rock rules" is not. The last model, a bidirectional RNN with attention connecting every state to every other state, says "anything goes." Potts's conclusion: a lesson of the Transformer era is that, given enough data, "anything goes" is the most powerful mode to be in.

**Second block: dot-product attention.** Before the Transformer, attention was a patch on RNNs. When classifying the sentiment of "really not so good," the final state may not remember early words well. So you take the dot product of the final state with each earlier state, softmax-normalize, average them into a context vector, and feed that into the classifier along with the final state. Potts calls this the beating heart of the Transformer.

**Third block: subwords.** ELMo starts from characters and builds word vectors with filters of different widths plus max-pooling. But its vocabulary has about 100,000 words, and real text still keeps hitting words outside it. BERT switched to [WordPiece](https://aclanthology.org/P16-1162/). The slides show the BERT tokenizer splitting "encode" in "Encode me!" into "En" and "##code," and splitting the single word "Snuffleupagus" into six pieces, with a vocabulary under 30,000 items. Words outside the vocabulary don't become UNK; they break into known pieces.

**Fourth block: massive pretraining and fine-tuning.** Potts describes three eras of fine-tuning. From 2016 to 2018, static vectors were fed into RNNs. From 2018 on, contextual models like BERT were fine-tuned directly. From 2021 on, more fine-tuning happens on huge models whose parameters we can't touch, only through an API. He hopes people keep writing their own fine-tuning code, because it's powerful both analytically and technologically.

Positional encoding is also on the guiding-ideas list. It gets its own section below.

## Mechanism: one Transformer block, step by step

Video 05 builds the whole block on three words, "The Rock rules." Each step shows only the computation for the third position, c; positions a and b run in parallel.

1. **Input.** Look up word vectors ("the" is x47, "Rock" is x30, "rules" is x34) and position vectors p1, p2, p3, then add them dimension by dimension. So c_input = x34 + p3.
2. **Attention.** Take the dot product of c_input with a_input and with b_input, divide by √d_k, and softmax to get weights α. Use α to take a weighted sum of a_input and b_input, giving c_attn.
3. **Residual and dropout.** Add c_attn back to c_input and apply dropout to the sum, giving c_alayer.
4. **Layer norm.** Subtract the mean and divide by the standard deviation to keep values in a range that trains well.
5. **Feed-forward.** Two dense layers: ReLU after the first, and the second projects back to d_k.
6. **Residual, dropout, and layer norm again**, giving c_out.

Why does d_k matter so much? The model adds things together everywhere, so almost every representation has to have dimensionality d_k. **The one exception is inside the feed-forward layer**: the first layer can expand to a wider dimension as long as the second one brings it back to d_k. Potts notes that many of the parameters in large models are hidden here.

One more observation to hold on to: **within a block, attention is the only step where positions interact.** Every other step runs on each column independently. That's why attention is the core of the Transformer, and why it helps to have many heads.

<details>
<summary>Formulas: the full computation for one position (slide 14)</summary>

$$c_{\text{input}} = x_{34} + p_3$$

$$\tilde{\alpha} = \left[\frac{c_{\text{input}}^\top a_{\text{input}}}{\sqrt{d_k}},\ \frac{c_{\text{input}}^\top b_{\text{input}}}{\sqrt{d_k}}\right],\quad \alpha = \mathrm{softmax}(\tilde{\alpha})$$

$$c_{\text{attn}} = \alpha_1 a_{\text{input}} + \alpha_2 b_{\text{input}}$$

$$c_{\text{alayer}} = \mathrm{Dropout}(c_{\text{attn}} + c_{\text{input}}),\quad c_{\text{anorm}} = \frac{c_{\text{alayer}} - \mathrm{mean}(c_{\text{alayer}})}{\mathrm{std}(c_{\text{alayer}}) + \epsilon}$$

$$c_{\text{ff}} = \mathrm{ReLU}(c_{\text{anorm}} W_1 + b_1) W_2 + b_2$$

$$c_{\text{fflayer}} = c_{\text{anorm}} + \mathrm{Dropout}(c_{\text{ff}}),\quad c_{\text{out}} = \frac{c_{\text{fflayer}} - \mathrm{mean}(c_{\text{fflayer}})}{\mathrm{std}(c_{\text{fflayer}}) + \epsilon}$$

</details>

**What if the matrix form doesn't click?** Papers usually write attention as softmax(QKᵀ/√d_k)V. Potts admits he didn't immediately see how that matched the piecewise version. Slide 15 includes a short NumPy script that computes both versions on three random vectors and gets the same result.

**Multi-headed attention.** Each head has its own W^Q, W^K, and W^V, applied to the query, key, and value before the same dot products. Remove those parameters and you're back to the single-head version. After the three heads finish, their results are reassembled for each position.

**Stacking.** c_out becomes the c_input of the next block, repeated N times. Potts says 12 or 24 layers are common, and there can be hundreds.

**Back to the famous diagram.** The original paper, [Attention Is All You Need](https://arxiv.org/abs/1706.03762), dealt with seq2seq problems, so it has an encoder and a decoder. The encoder is the block above repeated N times. The decoder has the same structure plus masking, so attention looks only at the past, never the future. Potts also explains the title: RNNs at the time already had lots of attention stacked on top, and the authors argued you could drop the recurrence entirely.

**Looking at a real model with Hugging Face.** Slide 19 prints the structure of BERT-base. The word embedding has about 30,000 entries of 768 dimensions each. There are 512 positional embeddings, so the maximum sequence length is 512 tokens. Everything is 768 except the middle of the feed-forward layer, which expands to 3,072.

## Positional encoding: two questions, three schemes

At the start of video 06, Potts says he took positional encoding for granted for too long, and it now looks like a crucial factor in how Transformers perform.

**Why do we need it?** Attention is just a bunch of dot products. It has no direction, and there's no other interaction between the columns. Without position information, A B C and C B A look the same to the model. Positional encoding has a second use too: marking hierarchical position, such as which words belong to the premise and which to the hypothesis in NLI.

**The two questions:**

1. Does the set of positions need to be decided ahead of time?
2. Does the scheme hinder generalization to new positions?

He adds one rule. Models may cap sequence length for many design and optimization reasons. Set those aside and ask only whether the positional encoding scheme itself limits length generalization.

| Scheme | Q1: Fix positions in advance? | Q2: Hinders generalization to new positions? |
|---|---|---|
| Absolute (learn a vector per position, add it to the word vector) | Yes. Set 512 and there's no position 513 | Yes. "The Rock" at the start and in the middle are different representations |
| Sinusoidal (the original paper's scheme) | No. Any position gets a vector | Still yes. The position vector is added to the word vector as an equal partner |
| Relative ([Shaw et al. 2018](https://arxiv.org/abs/1803.02155)) | No. You only choose a window size | Largely solved |

**How does relative positional encoding work?** Two changes matter. First, position information enters inside attention rather than at the input layer: a relative position vector is added to the key in the dot product, and another is added to the value in the weighted sum. Second, there's a window. With a window size of 2, looking left from position 4, distance −1 uses w₋₁, distance −2 uses w₋₂, and anything farther also uses w₋₂. The same happens to the right. The whole model only learns the vectors from w₋₂ to w₂.

**Why does that generalize?** Wherever "The Rock" appears in the string, the relative position vectors inside the phrase are 0, 1, and −1. That makes it easier for the model to see it as the same phrase. Potts's judgment is that relative positional encoding is "a very good bet" for the Transformer, and he believes results across the field support it.

<details>
<summary>Formulas: the full definition of relative positional encoding (slide 27)</summary>

$$\mathrm{attn}_i = \sum_{j=1}^{n} \alpha_{ij}\left(x_j W^V + a^V_{ij}\right)$$

$$\alpha_{ij} = \mathrm{softmax}\left(\frac{(x_i W^Q)^\top (x_j W^K + a^K_{ij})}{\sqrt{d_k}}\right)$$

Here $a^K_{ij}$ and $a^V_{ij}$ depend on the relative distance $j - i$, clipped to the window $[-d, d]$: every distance beyond $d$ shares $w_{\pm d}$.

</details>

## Back to the models: how these sections connect to what follows

- BERT uses absolute positional encoding, so its maximum length is 512 tokens. When the next post gets to BERT, the slides list this as one of its limitations.
- The Wrap-up section mentions [DeBERTa](https://arxiv.org/abs/2006.03654), which separates word and position representations and gives each its own attention. Potts says it echoes his concern from the positional encoding section that position representations can have too much influence on word meaning.
- The causal mask GPT needs is the decoder masking described above.

## If you want to go deeper

- The fastest hands-on route: open [The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/), which is an assigned reading and implements the paper line by line.
- Type out the NumPy code from slide 15 yourself and confirm that the piecewise and matrix versions produce the same c_attn.
- Load `bert-base-cased` with `transformers`, run `print(model)`, and compare it to slide 19.

**Further reading**: [CS224N guide: from recurrence to the Transformer](/posts/ai/2026-08-22-cs224n-transformers-en) covers the same architecture from another course, including quadratic cost and how Assignment 3 tests it. [CS224N guide: word vectors](/posts/ai/2026-08-22-cs224n-word-vectors-en) fills in the static-vector background.

## Gaps in the materials

- The videos are screencasts from the online XCS224U, not classroom recordings, so there's no Q&A.
- These three sections have no homework of their own. The first homework (multi-domain sentiment analysis) is where you fine-tune contextual models.
- In the extracted text of slide 27, the relative encoding slide still shows two "Limitations" lines, but the video says clearly that relative encoding passes both questions. The PDF text doesn't show whether the original slide strikes them out, so this post follows the video.

**Series navigation**: Previous: [Opening lecture: the evolution of NLU and the course map](/posts/ai/2026-09-29-cs224u-intro-evolution-of-nlu-en) | Next: [Contextual representations II: GPT, BERT, RoBERTa, ELECTRA, seq2seq, and distillation](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224U course website (Spring 2023)](https://web.stanford.edu/class/cs224u/)
- [Contextual word representations slides (handout PDF)](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)
- [Video 04: Contextual Word Representations, Part 1: Guiding Ideas](https://www.youtube.com/watch?v=FEFeeRONEdw)
- [Video 05: Part 2: Transformer](https://www.youtube.com/watch?v=yqV_YfBBtK0)
- [Video 06: Part 3: Positional Encoding](https://www.youtube.com/watch?v=JERXX2Byr90)
- [CS224U background materials page](https://web.stanford.edu/class/cs224u/background.html)
- [Vaswani et al. (2017). Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Rush (2018). The Annotated Transformer](http://nlp.seas.harvard.edu/annotated-transformer/)
- [Shaw, Uszkoreit & Vaswani (2018). Self-Attention with Relative Position Representations](https://arxiv.org/abs/1803.02155)
- [Dai & Le (2015). Semi-supervised Sequence Learning](https://arxiv.org/abs/1511.01432)
- [McCann et al. (2017). Learned in Translation: Contextualized Word Vectors](https://papers.nips.cc/paper/7209-learned-in-translation-contextualized-word-vectors)
- [Peters et al. (2018). Deep Contextualized Word Representations](https://aclanthology.org/N18-1202/)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Devlin et al. (2019). BERT](https://aclanthology.org/N19-1423/)
- [Sennrich, Haddow & Birch (2016). Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [He et al. (2021). DeBERTa](https://arxiv.org/abs/2006.03654)
