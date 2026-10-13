---
title: "Tokenization and BERT: How Words Are Split and How Representations Become Contextual | NTU Yun-Nung Chen Applied Deep Learning Lecture 5"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, tokenization, bpe, bert, pretraining]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 5
tldr: "This lecture has two halves. The first covers tokenization: with whole words as units, unseen words can only become UNK; with characters as units, meaning cannot be put back together. The compromise is subwords, and a common way to build them is BPE: start from characters and repeatedly merge the most frequent adjacent pair. The second half covers BERT: a static word vector gives \"apple\" one embedding and cannot tell the fruit from the company. ELMo uses a language model to produce contextual representations, and BERT replaces the LSTM with a Transformer, pre-trains with a masked LM that hides 15% of tokens plus next sentence prediction, and then fine-tunes the whole model on downstream tasks."
description: "A guide to Lecture 5 of NTU Yun-Nung Chen's Applied Deep Learning, Fall 2025, built from the Tokenization and BERT decks and the spoken content of videos 5.1 and 5.2: the UNK problem, subwords, the three steps of BPE with a step-by-step merge, the token cost of multilingual BPE for Chinese; polysemy, TagLM and ELMo, BERT's masked LM, next sentence prediction, input representation, fine-tuning versus feature-based use, ERNIE, and a comparison table for the optional BERT family material. Includes BPE and BERT input examples and a self-check with answers."
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte-Pair Encoding"]
    definition: "A method for defining a subword vocabulary: start with only characters and an end-of-word symbol, repeatedly find the most frequent adjacent pair of units in the corpus, merge it into a new unit, and add it to the vocabulary until the vocabulary reaches the desired size. The recorded order of merges is the rule set for splitting new text."
    context: "The ADL Tokenization deck, slides 5–19, walks through it on a small corpus of low, lower, newest, and widest."
  - term: "subword"
    definition: "A unit between a whole word and a single character. Common words stay whole and rare words are split into a few more common pieces, so vocabulary size stays under control and fully unseen input is rare."
    context: "Slide 4 of the ADL Tokenization deck calls it the dominant modern paradigm, a balance between words and characters."
  - term: "Masked Language Model"
    aliases: ["MLM"]
    definition: "A pre-training objective that hides a random subset of input tokens and asks the model to recover them from context on both sides."
    context: "The ADL slides say BERT masks 15% of tokens: too few makes training expensive, too many leaves too little context."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-bert-family)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 5 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en), based on the 9/08 week of ADL Fall 2025 (114-1, 2025/09/01–12/15). The [previous lecture](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) covered the Transformer's skeleton. This one answers two questions: **what units is text split into before it goes into a model, and how does a model give different representations to the same word in different sentences?**

Official materials:

- The [Tokenization deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf) (22 slides) and video [5.1 BPE Tokenization](https://youtu.be/NrT5kmnTFCk) (33:37)
- The [BERT deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf) (22 slides) and video [5.2 BERT](https://youtu.be/pSQM-HNHA64) (57:29)
- Optional: the BERT Variants deck and videos 5.3–5.6, in the comparison table near the end

5.1 and 5.2 are recordings uploaded in October 2023 and have no captions, so this guide works from transcripts made from their audio. The lectures are in Mandarin. Examples marked "made up for this post" are not from the lecture.

After reading you should be able to do four things: run BPE merges by hand on a small corpus and use the merge rules to split an unseen word; say what static word vectors cannot handle and how ELMo and BERT each address it; draw what BERT's input looks like in pre-training and what each of its two objectives predicts; and tell fine-tuning apart from using only the vectors.

## First half: tokenization and BPE

### What to do with unseen words

The traditional approach puts every word seen in training into the vocabulary, one vector per word. A word outside the vocabulary at test time becomes the same UNK, sharing one meaningless vector. Slide 2 gives three kinds:

- Variations: taaaaasty
- Misspellings: laern
- Novel words: Transformerify

Models cannot handle these, and people can. Professor Yun-Nung Chen uses the word "tokenization" itself: even on first sight you recognize "token"; adding -ize makes a verb, "to turn into tokens"; adding -ation makes it a noun again. From such pieces the gist of an unseen word can be guessed.

Slide 3 adds a linguistic angle: some languages have very rich word forms. The deck's example is Swahili, where one verb root yields hundreds of forms carrying person, tense, and more. With whole words as units, such a language needs an impractically large vocabulary and still meets many unseen words.

### How fine to split

| Unit | Benefit | Drawback |
|---|---|---|
| Whole word | Each unit carries a complete meaning | Large vocabulary, and unseen words still occur |
| Character | English has only 26 letters, so no unit is unseen | Meaning needs several characters together. Her example: with u and n modeled separately, the model cannot learn that un- negates |
| Subword | A compromise, and today's mainstream (slide 4) | The pieces have to be decided somehow |

### BPE in three steps

BPE was originally a compression algorithm (slide 5). She says it has little to do with bytes here and borrows one idea: things that often occur together are merged into one unit.

1. Start the vocabulary with every character that appears in the corpus, plus an end-of-word symbol `</w>`.
2. Find the most frequent adjacent pair of units in the corpus, merge them, and add the result to the vocabulary.
3. Replace every occurrence of that pair in the corpus with the new unit. Return to step 2 until the vocabulary reaches the desired size.

The paper that applied BPE to neural machine translation is [Sennrich et al. 2016](https://arxiv.org/abs/1508.07909), which the deck does not cite.

### Step by step

Slides 6–16 use four words, with their counts:

```
l o w </w>        : 5
l o w e r </w>    : 2
n e w e s t </w>  : 6
w i d e s t </w>  : 3
```

The starting vocabulary is `</w> d e i l n o r s t w`, 11 units.

**First merge.** Count each adjacent pair: `e s` appears in newest (6) and widest (3), 9 times; `s t` and `t </w>` also appear 9 times (the slide marks only `e s` and `t </w>`); `l o` appears 7 times. Three pairs tie at 9, and any may be chosen. The deck picks `es`.

**Every later step is the same**: count, merge the top pair, rewrite the corpus. The nine merges in order:

```
1. e + s        → es
2. es + t       → est
3. est + </w>   → est</w>
4. l + o        → lo
5. lo + w       → low
6. n + e        → ne
7. ne + w       → new
8. new + est</w> → newest</w>
9. low + </w>   → low</w>
```

At this point the vocabulary has 20 units and the demonstration stops. The final corpus is `low</w>`, `low e r </w>`, `newest</w>`, and `w i d est</w>`.

She points out two things. First, the vocabulary holds whole words as well as pieces, such as `newest</w>`: a word that appears often enough gets merged entirely. Second, the vocabulary can never be large enough for every piece, so the most frequent go in first.

Step 3 merges `est` with `</w>`, which makes "est at the end of a word" a unit. The same letters inside a word and at its end are different units, and that is the role of `</w>`.

### Splitting new words with the merge rules

The nine merges, recorded in order, are the rules for splitting: break a new word into characters and apply the rules in sequence (slides 17–19).

- **lowest** → `low` `est</w>`. The word is not in the corpus, but both pieces are in the vocabulary. Rule 9 does not apply because this "low" is not followed by `</w>`.
- **powest** (a word she made up) → `<unk>` `o` `w` `est</w>`. "p" is not in the starting vocabulary and can only be unknown; `o w` has no "l" before it and cannot become "low." The first part is unknown, and it is still clear that the word carries -est.

The second example also shows BPE's limit: a character missing from the starting vocabulary still becomes an unknown symbol.

Frequent pieces produced by BPE are often morphemes (slide 20), the smallest meaningful units of a language, such as -er and -est. "unlikeliest" can be read as three morphemes: un-, likely, and -est. She hopes merging stops at this "smallest yet meaningful" size: stopping at `wo` gives nothing meaningful, and merging up to whole words brings back the unseen-word problem.

### Multilingual BPE: Chinese costs more

Slide 21 shows results from the OpenAI tokenizer, using the GPT-3 tokenizer:

| Sentence | Characters | Tokens |
|---|---|---|
| Working on NLP is fun, but tokenization is not fun. | 51 | 14 |
| 做NLP工作很有趣，但tokenization不有趣。 | 27 | 29 |

In the English sentence "Working" is one token, common enough to have been merged whole; "NLP" splits into N and LP; "tokenization" splits into "token" and "ization." The Chinese sentence has about half the characters and twice the tokens. She notes that the single character 「做」 is split into three tokens.

The reason is that this model must handle every language and has no splitting scheme designed per language. Her explanation: it converts every character into its encoding and runs BPE on everything as one stream of symbols.

> Note: more precisely, tokenizers of this kind run BPE over UTF-8 bytes. A common Chinese character takes three bytes, which become three tokens if they are not merged.

There are two consequences. In training, the more tokens the same content is split into, the more it costs. In generation, three tokens in a row may be needed to produce one Chinese character. Her view is that when the application is mainly in Chinese, designing tokenization for Chinese is worth doing.

In practice, a pre-trained model must be used with its own vocabulary, and only training from scratch lets you decide how to split.

## Second half: BERT

### The problem with one vector per word

Slide 3 has two sentences: "An apple a day keeps the doctor away" and "Smartphone companies including apple …". The two "apple"s mean different things, and a static word vector gives one embedding. She spells out the consequence: in the first sentence "apple" is near "orange," in the second near "Microsoft," and sharing one vector pulls "orange" and "Microsoft" together as well. "rock" as stone and as music has the same problem.

Besides multiple senses, one word can take different parts of speech. Without context, one vector cannot hold all of that.

The clue to a solution was already in [Lecture 3](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) (slide 4): when an RNN language model reads a sentence, it produces a vector at each position that has already seen the preceding context. The same word in different sentences naturally gets different vectors. This is a contextualized word representation.

### TagLM and ELMo

- **TagLM** ([Peters et al. 2017](https://arxiv.org/abs/1705.00108), slide 5): train a language model on a large amount of unlabeled text, then concatenate the vectors it produces with ordinary word vectors for NER. The labels are made from the text itself (the next word), which is why it is called self-supervised learning.
- **ELMo** ([Peters et al. 2018](https://arxiv.org/abs/1802.05365), slide 6): the same group's version a year later, short for Embeddings from Language Models. It trains a language model with a multi-layer LSTM, and downstream tasks use the vectors from every layer.

BERT and ELMo are both Sesame Street characters. She says Bert is Elmo's good friend in the show, and that she only noticed where the name came from some time after reading the paper. BERT did not propose pre-training; what it did was make the idea take off.

### BERT: replace the LSTM with a Transformer

[BERT](https://arxiv.org/abs/1810.04805) (slide 7) has the same goal as ELMo and uses a Transformer encoder in place of the LSTM. It uses only the encoder half of the Transformer.

**Objective 1: masked language model** (slide 8). ELMo's forward and backward directions are two separate models, each seeing only one side during training. BERT wants both sides at once, so it randomly masks 15% of the tokens and has the model fill them in. At a masked position the model outputs a probability distribution over the vocabulary, and the correct token should get the highest probability.

Why 15%:

- Too little masking trains only a few positions per sentence, so more data is needed and training costs more.
- Too much masking leaves too little context to fill the blanks.

She adds that the number has no theoretical basis and was chosen after the paper tried several ratios.

How the three models differ:

| Model | What it predicts | Which side it sees |
|---|---|---|
| ELMo | The next word and the previous word, one LSTM each | Each model sees one side, and the vectors from both are used together |
| GPT | The next word | Left side only |
| BERT | The masked words | Both sides |

**Objective 2: next sentence prediction** (slides 10–11). Tasks such as question answering need the relation between two pieces of text, which single sentences cannot teach. Two sentences go in each time, and the model judges whether the second really follows the first in the original text. Such data can be generated in bulk with no annotation: two truly adjacent sentences are labeled IsNext, and a sentence paired with a random one is labeled NotNext.

The deck's example:

- "the man went to the store" + "he bought a gallon of milk" → IsNext
- "the man went to the store" + "penguins are flightless birds" → NotNext

### What the input looks like

Slide 12. Two sentences are separated by `[SEP]`, with a `[CLS]` at the very front. The input at each position is the sum of three vectors:

| | [CLS] | my | dog | is | cute | [SEP] | he | likes | play | ##ing | [SEP] |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Token | [CLS] | my | dog | is | cute | [SEP] | he | likes | play | ##ing | [SEP] |
| Segment | A | A | A | A | A | A | B | B | B | B | B |
| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

- Token embedding: the units after subword splitting, where "playing" becomes "play" and "##ing," connecting to the first half of this lecture.
- Segment embedding: marks whether the token belongs to the first or the second sentence.
- Position embedding: a Transformer needs position supplied separately.

The vector output at `[CLS]` is used for next sentence prediction through a fully connected layer and a binary classification. Each masked position predicts its original token, and all those positions share one output layer.

**A quick count (made up for this post).** The input above has 11 positions. At 15%, about 1 or 2 are masked. Suppose "dog" and "likes" are masked: the model makes one "choose from the whole vocabulary" prediction at each of the two positions and one "is it the next sentence" prediction at `[CLS]`. One unlabeled example yields three training signals.

### Training data and two sizes

Slide 13: the data is Wikipedia plus BookCorpus.

| | Layers | Hidden size | Heads |
|---|---|---|---|
| BERT-Base | 12 | 768 | 12 |
| BERT-Large | 24 | 1024 | 16 |

Pre-training takes a lot of resources, so the paper released the trained models for everyone to use. She says Large performs better, and that Base is enough in many settings where hardware or the use case is limited.

### Fine-tuning: adjust the whole model

She calls this the other distinctive part of BERT (slide 14). ELMo is used by taking vectors out and training a separate task model. BERT trains no separate model: feed the task's data into the pre-trained BERT, add a simple output on top, compute the loss with the task's labels, and **fine-tune the weights of the whole model together**. The pre-trained weights are a very good starting point, so little data is needed.

How four kinds of tasks are attached:

| Task | Input | Where the output attaches |
|---|---|---|
| Sentence-pair relation (such as NLI) | Two sentences | Classify the `[CLS]` vector |
| Single-sentence classification | One sentence | Classify the `[CLS]` vector |
| Extractive question answering | Question and paragraph | Each paragraph token predicts whether it is the answer's start or end |
| Sequence tagging (such as NER) | One sentence | Each token predicts a tag |

The extractive QA setup is what [Assignment 1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) asks for.

### Do the two pre-training objectives help?

Slide 16 is the paper's ablation, and her reading of it:

- Removing next sentence prediction lowers performance on tasks that need the relation between two sentences.
- Replacing the masked LM with a left-to-right language model lowers it again, most of all on question answering.
- Adding a bidirectional LSTM on top of the left-to-right version recovers some on the QA dataset SQuAD, and still falls short of the original BERT; she adds that the other three datasets remain worse; on the chart, MNLI, QNLI, and MRPC stay flat or drop after the BiLSTM is added.

The NER comparison (slide 17, F1 on CoNLL 2003): TagLM 91.93, ELMo 92.22, BERT-Base 92.4, BERT-Large 92.8. The same table lists models using other techniques that score higher, such as Flair at 93.09.

Larger models perform better (slide 18), and the curve is still rising at the largest size. Her addition: at a little over a hundred million parameters the results are already good, and beyond that, performance grows less than parameters do; use the largest if you want the maximum, while industry has to trade performance against cost.

### What if only the vectors are used

Slides 19–20 make a comparison: as with ELMo, keep BERT fixed and use only its vectors to train another NER model. BERT-Base has 12 layers, each with vectors, so which layer? The dev-set results on slide 20:

| Which layers | Score |
|---|---|
| First layer only (little more than word vector plus position) | 91 |
| Last layer only | 94.9 |
| Sum of all 12 layers | 95.5 |
| Second-to-last layer only | 95.6 |
| Sum of the last four layers | 95.9 |
| Concatenation of the last four layers | 96.1 |
| Fine-tuning directly | 96.4 |

Later layers carry more contextual information. No combination beats fine-tuning directly. Her conclusion is that with fine-tuning there is no need to worry about which layer to choose, and that with all the model's parameters free to move, it is more flexible than fixed vectors.

### Chinese: ERNIE

Slide 21. Soon after BERT came [ERNIE](https://arxiv.org/abs/1904.09223), named after Ernie, Bert's good friend on Sesame Street. She jokes that the full name, Enhanced Representation through Knowledge Integration, is a bit of a stretch.

It addresses a problem in Chinese. She says that when Chinese is handled the way BERT does it, one character is usually one token, so 「哈爾濱」 (Harbin) is split into three characters. Masking only one of them is too easy to guess, as in 「哈 [MASK] 濱是黑龍江的省會」 ("Ha [MASK] bin is the capital of Heilongjiang"; this is simplified for this post, and the figure on the slide masks several characters in the same sentence), and the model does not really learn the word. ERNIE masks all the characters of a word together whenever any is masked.

The deck's last slide gives two starting points: [google-research/bert](https://github.com/google-research/bert) and [huggingface/transformers](https://github.com/huggingface/transformers).

## Optional: the BERT family

The course page lists this part as optional, with slides from the [Fall 2024 BERT Variants deck](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf) (32 slides; the Fall 2025 link on the course page is broken). Only what each model changed is listed here. The content follows the slides and was not checked against the spoken lecture.

| Model | What it changed | Video |
|---|---|---|
| [Transformer-XL](https://arxiv.org/abs/1901.02860) | Caches the previous segment's hidden states for the next segment and switches to relative position encoding, to handle the context fragmentation caused by fixed-length segments | None |
| [XLNet](https://arxiv.org/abs/1906.08237) | Uses a permutation language model: only the prediction order changes and positions stay, so an autoregressive model also sees both sides. It addresses BERT treating masked words in a sentence as independent, and the mismatch of `[MASK]` appearing in pre-training and not in fine-tuning | [5.4](https://youtu.be/Q-bIzFhVweA) (34:06) |
| [RoBERTa](https://arxiv.org/abs/1907.11692) | Dynamic masking, learning rate and warmup tuned separately, batch size raised to 8K, full-length sequences only, more data | [5.5](https://youtu.be/u6USoD6mRR4) (22:20) |
| [SpanBERT](https://arxiv.org/abs/1907.10529) | Masks contiguous spans, trains on a single segment at a time, and predicts the span from its boundary representations. Helps question answering, NLI, and coreference resolution | Same |
| Multilingual BERT | Trained jointly on Wikipedia in 104 languages | [5.6](https://youtu.be/NAFu7xQKbRE) (12:48) |
| [XLM](https://arxiv.org/abs/1901.07291) | Adds a translation LM to the masked LM, suited to zero-shot cross-lingual settings | Same |

The overview video is [5.3 BERT Variants](https://youtu.be/sqldA6AgV7s) (4:09).

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"BPE splits morphemes by linguistic rules."** It only looks at which pair is most frequently adjacent. The pieces often happen to be morphemes, as a result of statistics.
- **"With subwords there are no unknown tokens."** A character missing from the starting vocabulary is still unknown, like the "p" in "powest."
- **"One Chinese character is one token."** It depends on the tokenizer. That is usually how BERT handles Chinese, but in the multilingual BPE from the first half one Chinese character may be split into several tokens.
- **"BERT invented pre-training."** The idea was already in TagLM and ELMo. What BERT did was replace ELMo's LSTM with a Transformer, use a masked LM that sees both sides, and fine-tune the whole model.
- **"BERT and GPT differ only in being an encoder and a decoder."** What matters more is which side each can see: GPT predicts the next word and sees only the left; BERT predicts masked words and sees both sides.
- **"Fine-tuning trains another model on top of BERT."** That is how ELMo is used. In fine-tuning, BERT's own weights are updated along with the task.

## Self-check

The questions were written for this post.

**1. In the BPE demonstration above, if the first step picks `s t` instead of `e s`, do the four words end up split differently after nine merges?**

No. After merging `s t`, the pairs `e st` and `st </w>` tie at 9 again; either choice reaches `est</w>` within three steps, and everything after is identical. The final corpus is the same: `low</w>`, `low e r </w>`, `newest</w>`, `w i d est</w>`. Only the intermediate pieces in the vocabulary differ: picking `e+st`, for example, gives `st` instead of `es`.

**2. Split "newer" with the nine rules from the demonstration.**

`new` `e` `r` `</w>`. n, e, w merge into "new"; the following e and r have no merge rule; the word ends with r followed by `</w>`, which has no rule either.

**3. A sentence has 40 tokens. About how many are masked in pre-training? What is the problem with masking only 1?**

40 × 15% = 6. With only 1 masked, a full pass over the sentence trains a single position, so learning the same amount takes more data and more computation.

**4. To use BERT for "decide whether a review is positive or negative," how is the input arranged and where does the output attach?**

The input is `[CLS]` followed by the review's tokens. Take the vector at `[CLS]`, add a classification layer that predicts positive or negative, and fine-tune the whole model on labeled data.

**5. For "apple released a new phone" and "he ate an apple," how do the vectors that a static word embedding and BERT give to "apple" differ?**

A static word embedding gives the same vector in both sentences. BERT's vector is computed after reading the whole sentence, so the two differ: one context points to the company and the other to a fruit.

**6. Training another NER model on BERT's vectors versus fine-tuning BERT directly: by the lecture's numbers which is better, and what extra decision does each require?**

Fine-tuning directly is better (96.4, against 96.1 for the best combination of vectors). Using only the vectors requires deciding which layers to take and how to combine them, and fine-tuning does not.

**7. In pre-training, one BERT input holds two sentences. How does the model know which token belongs to which sentence? Which position's output does next sentence prediction use, and what does it predict?**

The two sentences are separated by `[SEP]`, and each position also gets a segment embedding marking whether it belongs to the first or the second sentence. Next sentence prediction takes the output vector at `[CLS]` and adds a fully connected layer for binary classification: whether the second sentence really follows the first in the original text.

**8. ELMo and BERT both produce contextual representations. How do they differ in the model and in which side they can see?**

ELMo uses LSTMs, with separate forward and backward models that each see one side, and the vectors from both are used together. BERT uses the Transformer encoder and is trained by masking tokens and filling them back in, so one model sees both left and right at once.

## Further reading

- Implementing a BPE tokenizer from scratch: [CS336 Lecture 1: From Bytes to Tokenizers](/posts/ai/2026-08-22-cs336-overview-tokenization-en)
- A fuller discussion of multilingual token cost: [CS224N Lecture 14: How Tokenization Creates Multilingual Cost Gaps](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality-en)
- [CS224N Lecture 7: Pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en) covers encoder, decoder, and encoder-decoder pre-training from another angle
- [CS224U's contextual representation model families](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en) surveys BERT, RoBERTa, ELECTRA, and others

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Attention and the Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) | Next: [Assignment 1: Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=NrT5kmnTFCk
title: ADL 5.1: BPE (Byte-Pair Encoding) Tokenization
```

```youtube
url: https://www.youtube.com/watch?v=pSQM-HNHA64
title: 5.2 BERT
```

Original videos: [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://www.youtube.com/watch?v=NrT5kmnTFCk), [5.2 BERT](https://www.youtube.com/watch?v=pSQM-HNHA64), [5.3 BERT Variants](https://www.youtube.com/watch?v=sqldA6AgV7s), [5.4 XLNet](https://www.youtube.com/watch?v=Q-bIzFhVweA), [5.5 RoBERTa & SpanBERT](https://www.youtube.com/watch?v=u6USoD6mRR4), [5.6 Multilingual BERT & XLM](https://www.youtube.com/watch?v=NAFu7xQKbRE)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 5.1 and 5.2 have no captions, so this guide was written from speech-recognition transcripts of their audio, which may mishear some proper nouns. Both are recordings uploaded on 2023/10/12, not re-recorded in 2025. 5.3–5.6 were not checked, and the BERT family section follows the slides.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-13: Merged the previously separate Tokenization and BERT guides into one guide for Lecture 5, rewritten from the spoken content of the two videos, with examples, common misreadings, and a self-check with answers. The old "Tokenization and BPE" URL now redirects here.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/08 schedule row
- [Tokenization slides (2025/09/08)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf)
- [250908_BERT.pdf (BERT: Bidirectional Encoder Representations from Transformers)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)
- [240918_BERTVariants.pdf (BERT Variants, f113 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Sennrich, Haddow & Birch, Neural Machine Translation of Rare Words with Subword Units (ACL 2016)](https://arxiv.org/abs/1508.07909)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — source of the screenshot on slide 21
- [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding (arXiv 1810.04805)](https://arxiv.org/abs/1810.04805)
- [Deep contextualized word representations (ELMo, arXiv 1802.05365)](https://arxiv.org/abs/1802.05365)
- [Semi-supervised sequence tagging with bidirectional language models (TagLM, arXiv 1705.00108)](https://arxiv.org/abs/1705.00108)
- [ERNIE: Enhanced Representation through Knowledge Integration (arXiv 1904.09223)](https://arxiv.org/abs/1904.09223)
- [Transformer-XL (arXiv 1901.02860)](https://arxiv.org/abs/1901.02860)
- [XLNet (arXiv 1906.08237)](https://arxiv.org/abs/1906.08237)
- [RoBERTa (arXiv 1907.11692)](https://arxiv.org/abs/1907.11692)
- [SpanBERT (arXiv 1907.10529)](https://arxiv.org/abs/1907.10529)
- [Cross-lingual Language Model Pretraining (XLM, arXiv 1901.07291)](https://arxiv.org/abs/1901.07291)
- [google-research/bert](https://github.com/google-research/bert)
