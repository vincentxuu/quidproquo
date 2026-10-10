---
title: "NTHU NLP HW1: Testing Word Vectors on Google Analogy — Pretrained GloVe vs. Word2Vec Trained on 20% of Wikipedia"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, word2vec, embedding]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 3
tldr: "HW1 tests word vectors on the 19,544 Google Analogy questions (8,869 semantic, 10,675 syntactic). You first answer them with pretrained glove-wiki-gigaword-100 loaded through Gensim, then train your own Word2Vec on a 20% sample of a pre-cleaned Wikipedia dump, and plot t-SNE for the family subcategory both times. Seven TODOs are worth 55%, the report 45%. Fall 2026 keeps the same TODOs but asks for an .ipynb with outputs."
description: "A guide to Assignment 1 of Hung-Yu Kao's Natural Language Processing course at NTHU (Fall 2025): what word analogy is, how the Google Analogy set breaks down, the three parts of main.ipynb, TODO1–7 and their weights, the report questions, submission rules, and what changed in Fall 2026."
draft: false
glossary:
  - term: "word analogy"
    aliases: ["analogy task"]
    definition: "Given words A, B, and C, answer \"A is to B as C is to what?\" With word vectors, the answer is the word closest to B − A + C."
    context: "HW1 uses it to check whether embeddings capture semantic and syntactic relations."
  - term: "t-SNE"
    aliases: ["t-distributed stochastic neighbor embedding"]
    definition: "A visualization method that projects high-dimensional vectors into 2D or 3D while trying to keep nearby points close."
    context: "TODO3 and TODO7 in HW1 use it to plot the family subcategory."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This is post 3 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. It follows [Word Embeddings and Language Models](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en), which covered how word vectors are trained. This post puts them to a test: **do word vectors really learn that king is to queen as man is to woman, and how far behind is a model you train yourself?**

The sources are the Fall 2025 [Assignment 1 folder](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment1) in the [IKMLab course repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing): the handout [NLP_HW1_word_emb.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/NLP_HW1_word_emb.pdf), the starter [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb), the processed `questions-words.csv`, and the TA's [walkthrough video](https://youtu.be/nCS3GpHwqr8) (titled "Week 2 Thu. - Assignment 1" and listed in the W2 row of the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)). The video is in Mandarin. Access level is **A3**: the handout, starter code, and data are public. Solutions and grading scripts live on NTU COOL, which outside readers cannot reach.

## Course video sources

These recordings correspond to the material discussed here. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=nCS3GpHwqr8
title: 2025 HW1 walkthrough video
```

Original videos: [2025 HW1 walkthrough video](https://www.youtube.com/watch?v=nCS3GpHwqr8)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## What the assignment tests

The handout phrases analogy as "A is to B as C is to D." With word vectors you compute B − A + C, find the nearest word, and check whether it is D.

Slide 2 writes "King + Queen − Man ≈ Woman", which is a typo. The hint in the starter code has it right: `word_b + word_c - word_a should be close to word_d`. For the question `king queen man woman`, that means queen − king + man ≈ woman.

The data is the [Google Word Analogy set](https://arxiv.org/abs/1301.3781) (Mikolov et al., 2013). I counted the `questions-words.csv` in the repo:

| Category | Subcategories | Questions | Example |
|---|---|---|---|
| Semantic | 5 | 8,869 | family: `king queen man woman` |
| Syntactic | 9 | 10,675 | gram1-adjective-to-adverb: `infrequent infrequently cheerful cheerfully` |
| Total | 14 | 19,544 | |

Subcategory sizes vary a lot: capital-world has 4,524 questions, family only 506. Keep that in mind when you compare which categories a model handles well.

## The three parts of the starter notebook

The work happens on [Colab](https://colab.research.google.com/), and `main.ipynb` has three parts.

**Part I: preprocessing.** You download the raw `questions-words.txt` with `wget`. Each line holds four words, and lines starting with `: ` are subcategory headers. A comment notes that the first five headers are semantic and the other nine syntactic. TODO1 turns this into a DataFrame with `Question`, `Category`, and `SubCategory` columns. The TAs ship the processed CSV, but the handout says you still have to write the TODO1 code.

**Part II: pretrained embeddings.** You load `glove-wiki-gigaword-100` through the [Gensim](https://radimrehurek.com/gensim/) downloader. A comment says you may swap in [other pretrained models listed by Gensim](https://radimrehurek.com/gensim/models/word2vec.html#pretrained-models). TODO2 predicts every answer and keeps the gold labels. The evaluation cell is already written. It prints accuracy for both categories and all 14 subcategories, counting a prediction as correct only if it matches the gold word exactly. TODO3 plots the words in the family subcategory with t-SNE.

**Part III: train your own embeddings.** Downloading the raw [Wikipedia dump](https://dumps.wikimedia.org/) takes a long time, and cleaning it with Gensim's [`WikiCorpus`](https://radimrehurek.com/gensim/corpora/wikicorpus.html) takes longer. So the TAs pre-cleaned it into 11 `.txt.gz` files that you fetch with `gdown`. The notebook says each file has 562,365 lines, one article per line (except the last file). Cleaning used `WikiCorpus` defaults, so single-character words were dropped.

Then:

- TODO4: sample 20% of the articles.
- TODO5: train your own [Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html) on the sample.
- TODO6 and TODO7: repeat TODO2 and TODO3 with your own model.

Slide 28 suggests preprocessing steps: drop non-English words, remove stop words, lemmatize (rocks → rock), tokenize better than whitespace splitting, and keep only frequent words in the vocabulary. The same slide warns that not every trick helps, so you have to test them.

## Grading

Code is worth 55%, split across the seven TODOs:

| TODO | Task | Weight |
|---|---|---|
| 1 | Convert analogy data to a DataFrame | 5% |
| 2 | Answer with pretrained embeddings | 10% |
| 3 | family t-SNE for pretrained embeddings | 5% |
| 4 | Sample 20% of Wikipedia articles | 5% |
| 5 | Train your own embeddings on the sample | 10% |
| 6 | Answer with your own embeddings | 10% |
| 7 | family t-SNE for your own embeddings | 10% |

The report is worth 45%:

- Which embedding model, which preprocessing steps, which hyperparameters (5%)
- Performance when TODO4 samples 5%, 10%, and 20% (10%)
- Performance by category or subcategory when trained on a different corpus (15%): present results, describe your corpus and how it differs from Wikipedia in size, topic, and structure, and explain why performance rose or fell, 5% each
- Pick a few words, retrieve the five most similar words for each, and describe what you see (10%)
- Anything else that strengthens the report (5%)

The second question forces you to plot corpus size against accuracy. The third makes you leave Wikipedia and find your own corpus.

## Submission rules

The 2025 version asks for three files zipped and uploaded to NTU COOL:

- Code: the `.py` downloaded from Colab, named `NLP_HW1_school_studentID.py`
- Packages: `requirements.txt` (the example is `gensim==4.3.3`)
- Report: a `.docx` following the template

The report must state the runtime environment and Python version. If you use generative AI, say so in both code comments and the report. Link any code you borrowed from the web. Wrong filenames, a missing `requirements.txt`, or edits to the code template (only data loading may change) cost 5 points each. If your code or report is highly similar to another student's, both lose 100 points. You get three weeks.

## What changed in Fall 2026

The [2026 assignment page](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md) has only HW1 so far, with a [new walkthrough video](https://youtu.be/4nktsdfU24k). I diffed the [2026 handout](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/Assignment1/NLP_HW1_word_emb.pdf) against 2025 line by line and compared the two notebooks:

- **Same tasks**: TODO1–7 and their weights, the dataset, the pretrained model, and the Wikipedia files are unchanged.
- **New submission format**: code is now an `.ipynb` that must keep its outputs for the 20% Wikipedia run. Without outputs, no points go to anything based on results or plots. The report moves from Word into a report cell inside the notebook.
- **Tweaked report questions**: the other-corpus question now says "except wiki", and the extra experiment code must sit in the notebook or the question scores 0. The similar-words question now asks for at least five words. A new "Generative AI Usage" field costs 10 points if left empty.

So if you study with the 2025 materials, you are doing the same assignment as the 2026 class.

## Before you start

1. **Finish Part II before touching Wikipedia.** It only needs the GloVe download, and within minutes you have per-category accuracy. That is your baseline for every later comparison.
2. **Run the full pipeline at 5% first.** The report needs 5%, 10%, and 20% anyway. Starting small surfaces preprocessing bugs without waiting for a 20% training run each time.
3. **Handle out-of-vocabulary words.** GloVe's vocabulary differs from yours. How your code handles a question with a missing word directly affects accuracy, so explain it in the report.
4. **Read t-SNE plots for relations, not clusters.** The family questions are pairs like king/queen and man/woman. Good embeddings make the offsets between pairs point in similar directions.

## Further reading

- Previous in this series: [Word Embeddings and Language Models (n-gram → RNN)](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en)
- Next in this series: [Seq2seq, LSTM, and Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en)
- The same topic in an English-language course: [CS224N: Word Vectors](/posts/ai/2026-08-22-cs224n-word-vectors-en)
- Back to the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [IKMLab/NTHU_Natural_Language_Processing (GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2025 HW1 handout NLP_HW1_word_emb.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/NLP_HW1_word_emb.pdf)
- [2025 HW1 starter main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb)
- [2025 HW1 walkthrough video](https://youtu.be/nCS3GpHwqr8) (in Mandarin)
- [2026 HW1 handout](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/Assignment1/NLP_HW1_word_emb.pdf)
- [2026 HW1 walkthrough video](https://youtu.be/4nktsdfU24k) (in Mandarin)
- [Mikolov et al., 2013, Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Gensim Word2Vec docs and pretrained model list](https://radimrehurek.com/gensim/models/word2vec.html)
- [Gensim WikiCorpus docs](https://radimrehurek.com/gensim/corpora/wikicorpus.html)
