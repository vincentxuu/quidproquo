---
title: "NTHU NLP Guide 7: Sub-word Tokenization, or Why a Model's Vocabulary Is Made of Word Pieces"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, tokenization, bpe, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 7
tldr: "A guide to the Sub-word Tokenization unit of Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025). Splitting on white space only works for Western languages and cannot handle unseen words or German-style compounds. BPE starts from characters and repeatedly merges the most frequent adjacent pair into the vocabulary, so each merge adds one entry; its weakness is that the greedy split is not always the best one. The Unigram LM picks splits by probability and can even sample different ones. The slides give vocabulary sizes of 30522 for BERT, 50257 for GPT-2/GPT-3 and 32,128 for T5."
description: "A guide to W3_subword.pdf and the Week 5 recordings from Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025): three problems with white-space segmentation (non-Western languages, OOV, compounds), segmentation versus tokenization, a step-by-step BPE merge example and its properties, Unigram Language Model vocabulary building and subword sampling, a BPE-versus-ULM comparison, and the tokenizers and vocabulary sizes of BERT, GPT and T5."
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte Pair Encoding"]
    definition: "A sub-word tokenization algorithm: start from characters, repeatedly find the most frequent adjacent pair of symbols in the corpus, and merge it into a new vocabulary entry. The number of merges, num_merges, is a hyperparameter."
    context: "Slides 13–29 walk through four merges on low / lower / newest / widest."
  - term: "OOV"
    aliases: ["out-of-vocabulary"]
    definition: "A word absent from the training corpus and therefore from the vocabulary. A whole-word vocabulary can only map all such words to <UNK>."
    context: "Sub-word tokenization exists mainly to handle OOV words, misspellings and compounds."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 7 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [Transformer and Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en).

The official material for this lecture is [W3_subword.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_subword.pdf) (43 slides), with the recording [Week 5 Thu.](https://www.youtube.com/live/FB0fgRTEbJE) (in Mandarin). The [Week 5 Tue.](https://www.youtube.com/live/Dpswwk6UMCc) recording in the same row, whose captions I read, covers the second half of the Transformer (positional encoding, multi-head, decoder) rather than this lecture, so it is now embedded in the [Transformer post](/posts/ai/2026-09-30-nthu-nlp-transformers-en) instead. As with the previous lecture, the W3 in the file name is an old week number; the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) places it in W5, the same row where HW2 is released. That row's Topics column is a syllabus template and is not cited here.

The slides have three parts: recap, word segmentation, and sub-word tokenization.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: the YouTube video is public and embeddable. After reading the captions, only Week 5 Thu. belongs to this lecture (it starts with assignment 2 and only then turns to subword tokenization). No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=FB0fgRTEbJE
title: Week 5 Thu.
```

Original videos: [Week 5 Thu.](https://www.youtube.com/watch?v=FB0fgRTEbJE)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the Week 5 Thu. transcript was read through. It opens with the assignment 2 briefing (arithmetic with RNN/LSTM) and only then moves to subword tokenization: how a hidden state maps onto the vocabulary, OOV and [UNK], the limits of white-space segmentation, segmentation vs. tokenization, the BPE merge example and number of merges, and ULM choosing splits by language-model probability, all consistent with the post. The Week 5 Tue. transcript is about the Transformer (QKV, positional encoding, multi-head, Add & Norm, decoder, teacher forcing), not subword tokenization, so it was removed from this page and is now embedded in the Transformer post. The rest of the post relies on the slides only.

## Recap: the model outputs a probability over the whole vocabulary

Slides 4–5 revisit a language model's output layer. After an RNN reads "I love an", the hidden state goes through a classification layer that outputs a distribution as long as the vocabulary: apple 0.6, elephant 0.3, eraser 0.05, and so on. So **how you build the vocabulary decides which words the model can say at all**.

Slide 6 lays out the basic NLP pipeline in three steps, build the vocabulary, learn the representations (training), perform predictions (testing), and lists three vocabulary sizes:

| Model | Vocabulary size (slide 6) |
|---|---|
| BERT | 30522 |
| GPT-2 / GPT-3 | 50257 |
| T5 | 32,128 |

These match the `vocab_size` in the Hugging Face configs for [bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased/blob/main/config.json), [gpt2](https://huggingface.co/openai-community/gpt2/blob/main/config.json) and [t5-base](https://huggingface.co/google-t5/t5-base/blob/main/config.json). Note that section 3.1.3 of the [T5 paper](https://arxiv.org/abs/1910.10683) says "32,000 wordpieces"; the config's 32,128 is 128 larger, and the official materials do not explain the difference.

## Where white-space splitting breaks

Slide 7 shows the obvious approach: split "I love apples. I like apples and pineapples." on white space, collect and, apples, I, like, love, pineapples and ".", and add `<UNK>` for unseen words. Stemming can follow.

Slides 8–9 list three problems:

1. **It only works for Western languages**: Chinese and Japanese have no spaces
2. **It cannot handle unseen words**: a misspelled word still carries morphological information but becomes `<UNK>`
3. **Translation does not line up**: source and target words are not always one-to-one. The slide's example maps English "sewage water treatment plant" to the single German word Abwasserbehandlungsanlage

The conclusion is that sub-word units are preferable. Slide 11 adds a distinction: all tokenization is segmentation, but not the reverse. Segmentation also covers splitting a document into sentences, while tokenization can mean splitting into words or splitting words further into sub-words. Slide 12 points students to the [OpenAI Tokenizer](https://platform.openai.com/tokenizer) to try it themselves.

## Three common algorithms

Slide 10 lists three:

- **BPE** ([Sennrich et al., 2016](https://aclanthology.org/P16-1162/)): the GPT series
- **WordPiece** (Schuster & Nakajima, 2012): BERT
- **Unigram Language Model** ([Kudo, 2018](https://aclanthology.org/P18-1007/))

Slide 40 has a fuller table: WordPiece for BERT, ALBERT and MT-DNN; BPE for RoBERTa, XLM and GPT-1/2/3; Unigram for XLNet, T5 and mT5.

The slides disagree with themselves in one place: slide 10 puts T5 under WordPiece, slide 40 under Unigram. The T5 paper says it uses [SentencePiece](https://github.com/google/sentencepiece) "to encode text as WordPiece tokens", mentioning both terms, so both labels have a source. It is enough to know the discrepancy exists.

## BPE: one merge at a time

Slides 13–27 run the whole algorithm on a toy corpus: low ×5, lower ×2, newest ×6, widest ×3. Each word is split into characters with `</w>` appended, an end-of-word symbol that lets you restore the original split later:

| Word | Count |
|---|---|
| l o w `</w>` | 5 |
| l o w e r `</w>` | 2 |
| n e w e s t `</w>` | 6 |
| w i d e s t `</w>` | 3 |

The initial vocabulary is the set of characters seen: `</w>`, d, e, i, l, n, o, r, s, t, w. Then three actions repeat: find the most frequent adjacent pair, add it to the vocabulary, and merge that pair everywhere in the corpus.

| Merge | Pair found | Frequency | Added to vocabulary |
|---|---|---|---|
| 1 | e s | 6 + 3 = 9 | es |
| 2 | es t | 6 + 3 = 9 | est |
| 3 | est `</w>` | 6 + 3 = 9 | est`</w>` |
| 4 | l o | 5 + 2 = 7 | lo |

After four merges (`num_merges` = 4) it stops. `num_merges` is a hyperparameter you set.

To tokenize a new word (slide 28), split it into characters plus `</w>` the same way, then merge according to the learned vocabulary: low becomes lo w `</w>`, and widest becomes w i d est`</w>`.

Slide 29 draws out two properties:

- **Final vocabulary size = initial size + num_merges**. Here that is 11 + 4 = 15
- **It is statistical**: the more frequent a sub-word is in the corpus, the more likely it enters the vocabulary

### BPE's problem: greedy is not always best

Slide 30 notes that BPE by default splits with the largest sub-words available, a greedy, deterministic, left-to-right procedure. "Hello world" may become Hell / o / world, but H / ello / world, He / llo / world and others are also valid, and BPE's choice may be sub-optimal.

Slide 31 gives each sub-word an occurrence probability and compares the product for each split: BPE's Hell / o / world comes to about 4.2×10<sup>−6</sup>, while H / ello / world reaches about 7.9×10<sup>−6</sup>. That motivates the next method.

## Unigram Language Model: choosing splits by probability

Slide 32 positions ULM: like BPE, it splits sentences into sub-words, but it does so by the joint probability of the whole sentence, and every token in the vocabulary has its own probability learned from the corpus.

Slides 33–37 give three steps:

1. **Set a vocabulary size and build the initial vocabulary**: take all sub-words (characters included) from the corpus, keep the most frequent, and compute each one's frequency. The original paper speeds this up with an Enhanced Suffix Array, which the course skips
2. **Train a unigram language model**: not a neural network but a probabilistic model, fit with the EM algorithm to maximize corpus likelihood; the best split per sentence is found with the Viterbi algorithm, also skipped in class
3. **Prune the vocabulary**: repeatedly compute how much the loss would rise if each sub-word were removed, and keep the top η% (for example η = 80)

The slides link two resources for details: [SentencePiece](https://github.com/google/sentencepiece) and the [Hugging Face NLP Course chapter on Unigram](https://huggingface.co/learn/nlp-course/chapter6/7).

<details>
<summary>Formula: sub-word frequency and subword sampling (slides 35, 38)</summary>

$$\mathrm{frequency}(x_i) = \frac{\mathrm{Count}(x_i)}{\sum \text{all counts}}$$

Sample one of the l best segmentations from:

$$P(\mathbf{x}_i \mid X) \approx \frac{P(\mathbf{x}_i)^{\alpha}}{\sum_{i=1}^{l} P(\mathbf{x}_i)^{\alpha}},\qquad P(\mathbf{x}_i) = \prod_{j=1}^{n_i} P(t_j)$$

X is the sentence, x<sub>i</sub> the i-th segmentation, n<sub>i</sub> its token count, and α controls how smooth the distribution is.

</details>

### Subword sampling: same word, different splits

Slides 38–39 explain that the original ULM paper does not always choose the most probable split at inference; it samples. The slides run the T5-base tokenizer on "internationalization" five times and get five splits, for example:

- ▁ / inter / national / ization
- ▁ / international / ization
- ▁in / tern / at / i / o / n / ali / z / ation

The leading "▁" is the boundary marker the T5 tokenizer adds before a word.

## BPE or ULM?

Slide 41's comparison:

| Aspect | ULM | BPE |
|---|---|---|
| Algorithm | EM algorithm | Greedy, no probabilistic model |
| Training | Slower | Faster |
| Consistency | Can split the same word differently | Same split every time |
| Inference speed | Slower | Faster |
| Downstream tasks | Maybe better for machine translation | Suits most tasks |

Slides 42–43 wrap up. Sub-word tokenization handles unknown, misspelled and compound words, eases compound-word mismatches in translation, and models like GPT-3 and BERT apply it before pretraining. The downsides are few: `num_merges` must be tuned, and once the vocabulary is built it is fixed, so new data means rerunning the algorithm. The last line asks: what about Chinese? The slide's answer is character-level encoding.

## Going deeper

- Code the four merges from slides 13–27 in Python: a `Counter` for adjacent pairs and a merge function. Compare your vocabulary with the slides.
- Set `num_merges` to 10 and see whether newest and widest end up as single tokens.
- Load the `t5-base` tokenizer in `transformers`, enable its sampling option, and run "internationalization" a few times against slide 39.
- Paste a Chinese paragraph and an English paragraph with the same meaning into the [OpenAI Tokenizer](https://platform.openai.com/tokenizer) and compare token counts.

**Further reading**: [CS224N guide: tokenization and multilinguality](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality-en) covers tokenization from a multilingual-fairness angle; [CS336 guide: overview and tokenization](/posts/ai/2026-08-22-cs336-overview-tokenization-en) has you implement byte-level BPE from scratch.

## Gaps in the materials

- This lecture has no dedicated assignment. [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en), released the same week, generates arithmetic at the character level and does not use BPE.
- WordPiece appears only in the lists; the slides do not explain its algorithm.
- Slides 10 and 40 classify T5 differently; see above.
- Solutions, quizzes and class discussion live on NTU COOL and are not available to outside readers. The Fall 2026 version of this lecture is not yet public.

**Series navigation**: previous [Transformer and Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en) | next [ELMo, BERT, T5, BART, GPT: Three Roads to Pretraining](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) | [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against the transcripts. Week 5 Thu. belongs to this lecture (it starts with assignment 2); Week 5 Tue. is about the Transformer, so it was removed from this page and embedded in the Transformer post instead.

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W3_subword.pdf (Sub-word Tokenization slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_subword.pdf)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 5 Thu. (in Chinese)](https://www.youtube.com/live/FB0fgRTEbJE)
- [Sennrich, Haddow & Birch (2016). Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [Kudo (2018). Subword Regularization](https://aclanthology.org/P18-1007/)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)](https://arxiv.org/abs/1910.10683)
- [google/sentencepiece](https://github.com/google/sentencepiece)
- [Hugging Face NLP Course: Unigram tokenization](https://huggingface.co/learn/nlp-course/chapter6/7)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- [bert-base-uncased config.json](https://huggingface.co/google-bert/bert-base-uncased/blob/main/config.json)
- [gpt2 config.json](https://huggingface.co/openai-community/gpt2/blob/main/config.json)
- [t5-base config.json](https://huggingface.co/google-t5/t5-base/blob/main/config.json)
