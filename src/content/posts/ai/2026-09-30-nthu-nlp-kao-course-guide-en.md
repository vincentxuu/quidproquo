---
title: "Natural Language Processing: A Learning Path from Text Representations to Language Models | NTHU Hung-Yu Kao Natural Language Processing Course Overview"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, taiwan]
lang: en
math: true
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 0
tldr: "NTHU Professor Hung-Yu Kao's Natural Language Processing covers one line in a semester: turn text into numbers (TF-IDF, word vectors), handle sequences (RNNs, attention, Transformers, sub-words), pretrained models (BERT, T5, GPT, decoding and evaluation), make models follow instructions and fine-tune with few parameters (RLHF, PEFT), then plug in outside knowledge (RAG) and reasoning. Fall 2025 slides, 32 recordings, 4 assignments, and starter notebooks are all public on GitHub; lectures are in Mandarin; there are no public solutions."
description: "Entry point for the series on NTHU Professor Hung-Yu Kao's Natural Language Processing: what each of the six segments teaches, a hand-worked TF-IDF retrieval example that exposes the vocabulary-mismatch problem, prerequisites and self-check questions, three ways to read with the materials available outside NTHU, and the 19 posts in this series."
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟"]
    definition: "臺灣大專院校人工智慧學程聯盟, an alliance of Taiwanese universities' AI programs. Several universities offer flagship courses that students at partner schools take through live online classes; in Fall AY114, six universities offered 10 of them."
    context: "TAICA's course list files this course under the Artificial Intelligence for Natural Language Technology Program."
  - term: "mirror course"
    aliases: ["鏡像課程"]
    definition: "One TAICA format for partner schools: students follow the host school's live online class directly. The other format, a satellite course, adds co-instructors and TAs at the partner school."
    context: "TAICA listed this course as 'Closed: mirror course / Conditional: satellite course' for Fall AY114 and as 'mirror course' for Fall AY115."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

**Video status: Videos included.** The intro embeds the Week 1 Tuesday recording (1 h 25 min); each week's recordings are in the individual posts. [Source details](#course-video-sources)

[Natural Language Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing), taught by Professor Hung-Yu Kao of National Tsing Hua University's computer science department, is a lead course in [TAICA](https://taicatw.net/fall-114/), Taiwan's inter-university AI program: graduate level, taught in Mandarin, and taken remotely and synchronously by students at member schools. Slides, recordings, and assignments all live in the lab's GitHub repo, so outside readers get nearly everything enrolled students get, minus solutions and grading.

The course answers one question: how did computers get from not understanding text at all to LLMs that answer questions? It opens with sentences that read two ways and runs through TF-IDF, word vectors, RNNs, Transformers, and BERT to RLHF, PEFT, and RAG. Each step patches a gap left by the previous one, so reading in order shows best why the technology looks the way it does today.

This post is the series entry point. It lays out what each of the six segments teaches, works a TF-IDF example by hand to show the first week's core idea and its limit, and ends with a prerequisite check and ways to read. Below is the Week 1 Tuesday recording, which matches the first post in the series; watch it before reading, or come back to it after the first post.

```youtube
url: https://www.youtube.com/watch?v=X7XJcm9wfFA
title: Fall 2025 Week 1 Tue. recording
```

## The storyline: six segments

### Turning text into numbers (Posts 1–3)

[Post 1](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) takes an information-retrieval view and strings inverted indexes, tokenization, stemming, TF-IDF, and BM25 into one pipeline: the more often a word appears in a document and the rarer it is in other documents, the higher the score. The pipeline's weak spot is synonyms and polysemy, which leads to dimensionality reduction with LSA's SVD. [Post 2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) switches to predicting the next word: statistical language models with bigram count tables, add-one smoothing, and perplexity; dense word vectors with Word2Vec's negative sampling; and RNNs for sentences of any length. [Assignment 1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) tests word vectors on nearly 20,000 Google Analogy questions to see whether "king − man + woman" really lands near queen.

### Handling sequences (Posts 4–7)

When input and output lengths differ (translation, summarization), the classifier trick of adding a final layer no longer works; you need an encoder-decoder. [Post 4](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en) covers vanishing gradients in RNNs, the three gates of an LSTM, and attention, which lets the decoder look directly at the whole input. [Post 6](/posts/ai/2026-09-30-nthu-nlp-transformers-en) removes the RNN: self-attention lets every word look at every other word and computes it all in one matrix multiplication, at the cost of losing word order, which positional encodings restore. [Post 7](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en) explains why vocabularies are made of word pieces: BPE repeatedly merges the most frequent adjacent pair, so even unseen words can be split. [Assignment 2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) treats "14*(43+20)=882" as a character sequence and has an LSTM generate the answer character by character after the "=".

### Pretrained models (Posts 8–11)

[Post 8](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) starts from "I record the record": Word2Vec gives both "record"s the same vector, and context has to decide the meaning. With Transformers, pretraining splits into three paths: encoder-only BERT (predict masked words, good at understanding), encoder-decoder T5 and BART, and decoder-only GPT (predict only the next word, which became the mainstream). [Post 10](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) covers how to pick words during generation: greedy cannot recover from one bad step, beam search keeps several candidates at once, and top-k/top-p sample to get more variety; scoring uses BLEU (counts n-gram overlap and penalizes sentences that are too short), ROUGE, and perplexity. [Assignment 3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) puts two heads on one BERT to do 1–5 regression and three-way classification at once; [Post 11](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en) does Chinese summarization once with GPT-2 and once with mT5: the decoder-only model needs the article and summary joined into one sequence, left padding, and −100 labels on positions that should not count toward the loss; the encoder-decoder tooling handles this automatically.

### Following instructions and fine-tuning with few parameters (Posts 12–13)

[Post 12](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en) explains the gap between continuing text and following instructions: the maximum-likelihood objective cannot tell that inventing a fact is worse than picking the wrong synonym, so InstructGPT adds three steps: SFT to learn how people write, a reward model to learn how people rate, and PPO to adjust to the ratings, with a KL penalty to keep the model from drifting too far. [Post 13](/posts/ai/2026-09-30-nthu-nlp-peft-en) starts with a calculation: full fine-tuning of Llama 2-7B needs about 56 GB of GPU memory, and training only a small set of parameters cuts it to about 17 GB, because gradients and optimizer state almost disappear. Methods fall into four kinds: adding parameters (adapters, prompt tuning), selecting parameters (BitFit), reparameterizing (LoRA), and hybrids.

### Plugging in outside knowledge (Posts 14–17)

LLMs confidently state wrong facts; RAG retrieves first, then generates. [Post 14](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) is about finding the right material: sparse vectors (TF-IDF, BM25) are cheap and reliable, dense vectors catch paraphrases; cross-encoders are accurate but slow, while bi-encoders can precompute document vectors. [Post 15](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en) connects the retriever to a generator and surveys fixes such as rewriting the query, making the generator robust to noise, and deciding when to retrieve (Self-RAG). [Post 16](/posts/ai/2026-09-30-nthu-nlp-llm-api-en) shows prompts, JSON output, and few-shot through APIs. The two TA sessions in [Post 17](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) each build a RAG, the second showing hybrid BM25-plus-cosine retrieval; Assignment 4 reuses the first session's LangChain-plus-Chroma skeleton to build a RAG over cat trivia and reports recall@k and exact match.

### Summary and reasoning (Posts 18–19)

[Post 18](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) wraps up the semester in three columns (fundamentals, models, advances), then summarizes Denny Zhou's talk: pretrained models can already reason, and the key is decoding, drawing reasoning out with CoT decoding and self-consistency. [Post 19](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en) covers the final project's grading structure and the switch to a midterm exam in Fall 2026.

## Work it by hand: how TF-IDF scores, and where it fails

This is a teaching example written for this post, to show the first week's core idea and why it carries all the way to word vectors and RAG.

Three already-tokenized documents:

- D1: cat　likes　fish
- D2: dog　likes　bones
- D3: kitty　hates　baths

TF-IDF weights each word by how many times it appears in the document times $\text{idf} = \ln(N / \text{df})$, where $N$ is the number of documents and df is how many contain the word. Here $N = 3$:

- "cat" appears only in D1: idf $= \ln 3 \approx 1.10$.
- "likes" appears in D1 and D2: idf $= \ln 1.5 \approx 0.41$.

For the query "likes cat", add up the query words' weights: D1 $= \ln 1.5 + \ln 3 = \ln 4.5 \approx 1.50$, D2 $= 0.41$, D3 $= 0$. D1 ranks first, as it should: "cat" is rarer than "likes", so it discriminates better and gets more weight.

The problem is D3. It is clearly about a cat, yet scores 0, because "kitty" and "cat" are different strings. This is the vocabulary mismatch Post 1 talks about.

**What this means:** with exact matching alone, rare words are correctly weighted up, but synonyms never match. Post 2's word vectors put "cat" and "kitty" close together, and Post 14's dense retrieval applies the same idea to RAG; but dense vectors have their own weak spots (proper nouns, exact numbers), which is why the TA session in Post 17 combines BM25 and cosine. The whole course works like this: each step patches the previous one's gap and brings a new trade-off.

## Prerequisites and self-check

You need Python, basic linear algebra and probability, and a little machine learning (what a loss function and gradient descent are). For linear algebra, check yourself with [Harvard CS181's linear algebra review](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en); for probability, read the [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en); for loss functions and gradient descent, see [NTU ADL Lecture 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en). Assignments use PyTorch and Hugging Face, which the TA sessions in Posts 5 and 9 teach from scratch. The syllabus says the course does not teach prompt usage, and that it is not for people who expect no exams and plan to get through the homework by collaborating.

After reading this post, try to answer:

1. Add a fourth document D4 "cat sleeps" to the example. What is the idf of "cat" now, and how does D1's score change?
   Answer: $N = 4$, df $= 2$, so idf $= \ln 2 \approx 0.69$; "likes" rises from 0.41 to $\ln 2 \approx 0.69$ (with more documents it is relatively rarer), so D1 $= 2\ln 2 \approx 1.39$, only a little below the original 1.50. As "cat" gets more common, its weight drops.
2. Why does self-attention need positional encodings?
   Answer: Every word looks at every other word at once and the computation ignores order, so "dog bites man" and "man bites dog" would come out the same; position has to be added separately.
3. How do BERT's and GPT's pretraining objectives differ, and what is each good at?
   Answer: BERT masks some words and predicts them from both sides (good at understanding); GPT predicts the next word from the left context only (good at generation).
4. Why does InstructGPT's PPO add a KL penalty?
   Answer: To keep the model from drifting far from the original just to please the reward model, producing odd outputs the reward model never saw but scores highly.
5. Why do RAG systems often combine BM25 with dense vectors?
   Answer: BM25 catches exact terms and proper nouns, dense vectors catch paraphrases; their failures complement each other.

## Three ways to read

This series follows the finished Fall 2025 term in its actual teaching order, with each TA session merged into the post for its assignment.

- **One quick pass (8 posts)**: 1 → 2 → 6 → 8 → 12 → 13 → 14 → 18. Lectures only, for readers who want to know what happened between TF-IDF and RAG.
- **Follow the whole course (19 posts)**: read in order; the recording linked in each post is that week's live stream. About a semester's worth.
- **Assignments only**: 3 → 5 → 9 → 17, plus the tool posts 11 and 16. Each assignment has a problem PDF, a `main.ipynb`, and data files you can drop into Colab. There are no public solutions and the course platform (NTU COOL) needs an enrolled account, so set up your own checks; for Assignment 1, for example, use the pretrained GloVe accuracy as your baseline.

Two things that affect how you read: the Topics column in the [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) is a syllabus template that does not match the slides actually posted in each row, so just follow this series' order; and the LLM API TA session uses 2024 model names, some since retired, which Post 16 explains how to replace.

Fall 2026 is running now with 75% homework plus a 25% in-person midterm and a new Reasoning/Agent unit; only the first few weeks are public, and this series does not draw on it.

## Posts in this series

| # | Post | Question |
|---|---|---|
| 1 | [Intro to NLP and classical text processing](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en) | Before LLMs, how did text become something you can compute on? |
| 2 | [Word embeddings and language models: from n-grams to RNNs](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) | How did "predict the next word" go from counting to neural nets? |
| 3 | [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en) | Do word vectors really learn "king − man + woman"? |
| 4 | [Seq2seq, LSTM, and attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en) | What if input and output lengths differ? |
| 5 | [PyTorch tutorial + HW2 arithmetic as language](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en) | Can an LSTM learn arithmetic? |
| 6 | [Transformers and self-attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en) | Without an RNN, how does the model know word relations and positions? |
| 7 | [Sub-word tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en) | Why is the vocabulary made of word pieces? |
| 8 | [ELMo, BERT, T5, BART, GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) | How do encoder, encoder-decoder, and decoder differ? |
| 9 | [HF BERT tutorial + HW3 multi-output learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) | How do you design the loss when one BERT does regression and classification? |
| 10 | [Decoding strategies and NLG evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) | How do you score generated text? |
| 11 | [GPT-2/T5 Chinese summarization lab](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en) | How do decoder-only and encoder-decoder summarization differ in code? |
| 12 | [GPT-3, InstructGPT, and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en) | How does a text continuer become an assistant that follows instructions? |
| 13 | [Parameter-efficient fine-tuning](/posts/ai/2026-09-30-nthu-nlp-peft-en) | How do you fine-tune a large model without a GPU cluster? |
| 14 | [RAG (1): hallucination and retrievers](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) | What are sparse and dense vectors each good at? |
| 15 | [RAG (2): from ODQA to Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en) | Where does it still break after the retriever meets the generator? |
| 16 | [LLM API tutorial](/posts/ai/2026-09-30-nthu-nlp-llm-api-en) | How do prompts, JSON output, and few-shot work through an API? |
| 17 | [RAG tutorials + HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en) | Build a cat-facts RAG two ways |
| 18 | [Course summary and notes on LLM reasoning](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) | Can a pretrained model reason without prompting? |
| 19 | [Term project and the Fall 2026 changes](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes-en) | Why did 2026 switch to a midterm? |

## What to do tonight

1. Open the [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md), click Week 1's slides, and find the TF-IDF pages to compare with the hand calculation above.
2. Drop [Assignment 1's main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb) into Colab and run it up to the cell that loads GloVe.
3. Read [Post 1](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en).

## Further reading

- [Reading Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en): Stanford's main NLP course, taught in English.
- [Reading Stanford CS224U](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en): natural language understanding, retrieval, and evaluation methods.
- [Reading NTU Hung-yi Lee's Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): also taught in Mandarin with all recordings public, but centered on AI agents and model behavior.

## Course video sources

This is a course overview; the intro embeds the Week 1 Tuesday recording. For other weeks, use the week table in the official README; each post also links its recording.

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Week 1 Tuesday recording](https://www.youtube.com/watch?v=X7XJcm9wfFA) (embedded in the intro, 1 h 25 min)

Checked: 2026-10-14.

## Update Log

- 2026-10-14: Rewrote the body as a real guide: what each of the six segments teaches, a hand-worked TF-IDF example, self-check questions, and the Week 1 recording in the intro; the semester comparison, README week column, and access ratings were cut down to a few sentences in the reading section.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [IKMLab/NTHU_Natural_Language_Processing (main README, 2026 edition)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 README: Fall 2025 weekly table](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf) (in Chinese and English)
- [2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf) (in Chinese and English)
- [2025 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2026 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)
- [2025 Reference notebooks](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference)
- [TAICA course list, Fall AY114](https://taicatw.net/fall-114/) (in Chinese and English)
- [TAICA course list, Fall AY115](https://taicatw.net/fall-115/) (in Chinese and English)
- [IKMLab NTHU YouTube channel](https://www.youtube.com/@IKMLabNTHU) (in Mandarin)
- [Fall 2025 Week 1 Tue. recording](https://www.youtube.com/live/X7XJcm9wfFA) (in Mandarin)
- [Fall 2026 Week 1 recording](https://youtube.com/live/EEbwXXoVQPY) (in Mandarin)
- [W1_NLP_brief.pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf) — Week 1 slides: TF-IDF, BM25, vocabulary mismatch, and LSA
- [W2_Word embeddings and Language Modeling (RNN).pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf) — Week 2 slides: language models, word vectors, and RNNs
