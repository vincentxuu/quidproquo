---
title: "NTHU NLP Guide 8: ELMo, BERT, T5, BART, GPT and the Three Roads to Pretraining"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, pre-training, bert, gpt, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 8
tldr: "A guide to the BERT and its Family unit of Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025). It starts from \"I record the record\": Word2Vec and GloVe give both records the same vector. ELMo fixes this with a bidirectional LSTM language model. With Transformers, pretraining splits into three roads: encoders (BERT: MLM plus NSP, strong at understanding, weak at generation), encoder-decoders (T5's span corruption, BART's five noise types), and decoders (GPT: pure next-token prediction). The last part covers GPT-3's in-context learning and scaling laws, and why decoders became today's dominant backbone."
description: "A guide to W4_bert_and_its_family.pdf and the Week 6 recordings from Prof. Hung-Yu Kao's NLP course at NTHU (Fall 2025): limits of static embeddings, ELMo's biLM and layer weighting, three ways to pretrain Transformers, BERT's 80/10/10 MLM and NSP, pretrain-then-finetune, extensions such as RoBERTa, SpanBERT and ALBERT, T5's text-to-text format and span corruption, BART's five noise functions, GPT-1 through GPT-4, GPT-3 in-context learning and scaling laws."
draft: false
glossary:
  - term: "MLM"
    aliases: ["Masked Language Model"]
    definition: "BERT's pretraining task: pick 15% of tokens; replace 80% of them with [MASK], 10% with a random token, and leave 10% unchanged; the model must recover the originals from context on both sides."
    context: "Slide 20 says the 80/10/10 split stops the model from building good representations only where it sees [MASK]."
  - term: "span corruption"
    aliases: ["replace spans"]
    definition: "T5's pretraining objective: replace variable-length runs of consecutive tokens with unique placeholders, one per span, and have the decoder reconstruct the removed spans in order."
    context: "T5's default corrupts 15% of tokens with an average span length of 3."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-bert-family)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 8 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en).

The official material for this lecture is [W4_bert_and_its_family.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W4_bert_and_its_family.pdf) (58 slides), titled "ELMo, BERT, GPT, and T5 (BERT and its Family)", with recordings [Week 6 Tue.](https://www.youtube.com/live/U5HypcXrIgY) and [Week 6 Thu.](https://www.youtube.com/live/RNlcZjzbhDo) (in Mandarin). The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) places it in W6. The W9 row's Topics column does say "ELMo, BERT, GPT, and T5", but the file attached there is the PEFT deck. The Topics column is a syllabus template; this guide goes by the attached files.

The outline: recap of word embeddings and RNNs, then from word embeddings to pretrained language models (ELMo), then pretraining with Transformers (encoder BERT, encoder-decoder T5, decoder GPT), then GPT-3's in-context learning and large language models.

## Starting point: one "record", two meanings

Slide 6 uses "I record the record": the first record is a verb, the second a noun. Word2Vec and GloVe give both the same vector, because static embeddings **ignore context**. That is the problem this lecture solves, and it picks up the contextualized embeddings that already appeared in the [part 2](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) slides.

Slide 8 uses fill-in-the-blank examples to show how much next-token prediction can teach:

- National Tsing Hua University is in ___ (Hsinchu): world knowledge
- I put ___ bag on the table (a): grammar
- The movie was ___ (bad): you must understand the complaint before it
- 1, 1, 2, 3, 5, 8, 13, 21, ___ (34): reasoning

## ELMo: read the whole sentence, then embed each word

[ELMo](https://aclanthology.org/N18-1202/) (Embeddings from Language Models, Peters et al., 2018) does not give each word a fixed representation. It reads the entire sentence first, then produces a vector for each word in it.

Slides 9–11 draw the backbone: characters go through a CNN to get token representations, topped by a two-layer bidirectional language model (biLM), each layer with a left-to-right and a right-to-left RNN.

Slides 12–14 build the ELMo vector from the biLM:

1. **Concatenate**: at each layer, join the forward and backward hidden states (the token layer is joined with itself)
2. **Weight**: multiply each layer by a softmax-normalized weight s<sup>task</sup>
3. **Sum**: add the weighted vectors and scale by a scalar γ<sup>task</sup>, letting the downstream model rescale the whole ELMo vector. The slides say this matters for optimization

The weights are learned with the downstream task, so the slides define ELMo as a **task-specific combination** of the biLM's intermediate layer representations.

<details>
<summary>Formula: ELMo layer weighting (slides 12–14)</summary>

$$\mathrm{ELMo}_k^{task} = \gamma^{task} \sum_{j=0}^{L} s_j^{task}\, h_{k,j}^{LM},\qquad h_{k,j}^{LM} = \left[\overrightarrow{h}_{k,j}^{LM};\ \overleftarrow{h}_{k,j}^{LM}\right]$$

j = 0 is the token layer and j = 1…L the biLM layers; s<sup>task</sup> is softmax-normalized and γ<sup>task</sup> is a scalar.

</details>

## Enter the Transformer: three ways to pretrain

Slide 16's timeline: Word2Vec in 2013, GloVe in 2014, ELMo, BERT and GPT in 2018, T5 in 2019. The Transformer's machine translation results led researchers to see it as a better alternative to RNNs.

Slide 17 is the backbone of the lecture, splitting Transformer pretraining into three roads:

| Architecture | How the slides describe it | Examples |
|---|---|---|
| Encoder | Bidirectional, can look into the future; suits downstream tasks | BERT |
| Encoder-decoder | Wants the strengths of both; the slides leave a question: what does having both cost during pretraining? | T5, BART |
| Decoder | The kind of LM seen so far; suits generation; not bidirectional | GPT |

## Road one: encoders (BERT)

### Two pretraining tasks

Slides 19–21 introduce the two tasks of [BERT](https://aclanthology.org/N19-1423/) (Devlin et al., 2018):

**MLM (Masked Language Model)**: pick 15% of tokens for prediction, of which:

- 80% become `[MASK]`
- 10% become a random token
- 10% stay unchanged

Why not mask them all? The slides explain that `[MASK]` never appears during fine-tuning. If only masked positions required careful representation, the model would get lazy about the unmasked words and fail to build robust representations.

**NSP (Next Sentence Prediction)**: the input is "`[CLS]` sentence A `[SEP]` sentence B", and the `[CLS]` output classifies whether B follows A (IsNext / NotNext). The goal is to learn sentence relationships, and any monolingual corpus can generate the training data automatically.

### Pretrain, then fine-tune

Slides 22–24 describe today's standard recipe: pretrain a general model of language understanding on a lot of unlabeled text, then fine-tune on a specific task. Fine-tuning adds one output layer on top of BERT, for example:

- Sentence-pair classification: a classifier on the `[CLS]` output
- Sequence tagging (e.g. NER): a classifier on each token's output, producing labels such as O and B-PER

Slide 25's details:

| | BERT-base | BERT-large |
|---|---|---|
| Parameters | 110M | 340M |
| Layers | 12 | 24 |
| Hidden size | 768 | 1024 |
| Attention heads | 12 | 16 |

Training data was BooksCorpus (800M words) and English Wikipedia (2,500M words). Pretraining took 64 TPU chips for 4 days, which is impractical on a single GPU; fine-tuning on one GPU is common. That is what makes [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en), multi-output learning with `bert-base-uncased`, feasible.

### Extensions of BERT

Slide 27's table:

| Model | MLM change | NSP change | Release |
|---|---|---|---|
| BERT | Static masking | Sentence relationship | 2018/10 |
| [RoBERTa](https://arxiv.org/abs/1907.11692) | Dynamic masking | NSP removed | 2019/07 |
| SpanBERT | Span masking | NSP removed | 2019/07 |
| ALBERT | N-gram masking | Sentence order | 2019/09 |
| DistilBERT | Compression by knowledge distillation | | 2019/10 |
| TinyBERT | Distillation for NLU | | 2019/09 |
| DeBERTa | Decoding-enhanced BERT with disentangled attention | | 2020/06 |

Slide 28 adds SpanBERT's Span Boundary Objective: each word in a masked span is predicted by ordinary MLM and also from only the two boundary words plus its position. The example is "Generative AI is [MASK] [MASK] [MASK] at NTHU", where the model must recover "a NLP course".

Slides 29–30 list RoBERTa's four changes: train longer with bigger batches on more data (over 160GB); remove NSP; train on longer sequences; use dynamic masking that changes every iteration. The slides' conclusion: with the right training strategy, BERT's MLM objective is highly competitive.

Slide 31 lists domain-specific BERTs from around 2019: SciBERT, FinBERT, BioBERT, PubMedBERT, BlueBERT, ClinicalBERT and LegalBERT.

### The limit of encoders

Slide 33: encoders do well across understanding tasks but poorly on generation. If your task produces output one word at a time, use a pretrained decoder instead.

## Road two: encoder-decoders (T5, BART)

### T5: every task is text in, text out

Slide 34 first lists design options for encoder-decoder pretraining: language modeling, BERT-style, deshuffling, and corruption strategies (replace with a mask, replace spans, drop tokens).

[T5](https://arxiv.org/abs/1910.10683) (Text-to-Text Transfer Transformer, Raffel et al., Google, 2019) casts classification, similarity, sequence tagging and generation into one format. Slides 36–38 compare two objectives on one sentence:

Original: Thank you for inviting me to your party last week.

| | Input | Target |
|---|---|---|
| BERT-style masking | Thank you `<M>` `<M>` me to your party apple week | The full original sentence |
| Replace spans | Thank you `<X>` me to your party `<Y>` week | `<X>` for inviting `<Y>` last `<Z>` |

Replace spans turns each run of corrupted tokens into one unique placeholder, so both input and target get shorter. Slide 39's setting corrupts 15% of tokens with an average span length of 3, and notes that below a 50% corruption rate, results are not very sensitive to these two parameters.

Slide 37 has an easy-to-miss line: the BERT-style objective, originally designed for encoder-only models, was found in T5's comparison to outperform the alternatives.

Slide 40's model sizes:

| Variant | Parameters | Layers | Hidden size | Heads |
|---|---|---|---|---|
| T5-small | 60M | 6 | 512 | 8 |
| T5-base | 220M | 12 | 768 | 12 |
| T5-large | 770M | 24 | 1024 | 16 |
| T5-3B | 3B | 24 | 1024 | 32 |
| T5-11B | 11B | 24 | 1024 | 128 |

Training data was C4 (the Colossal Clean Crawled Corpus, extracted from Common Crawl; the slide says 34B words). Slide 41 shows fine-tuning for closed-book QA: asked when Franklin D. Roosevelt was born, with no supporting text, T5 answers 1882 from what it learned in pretraining.

### BART: break it, then fix it

Slides 42–44 cover [BART](https://aclanthology.org/2020.acl-main.703/) (Lewis et al., 2019; the slide labels it Meta). It is a denoising autoencoder: corrupt text with an arbitrary noise function, then learn to reconstruct the original. Five noise types:

| Noise | How | What the model learns |
|---|---|---|
| Token Masking | Random tokens become [MASK] | Predict masked tokens |
| Token Deletion | Random tokens are deleted | Predict deleted tokens and their positions |
| Text Infilling | Like SpanBERT, but a 0-length span inserts a [MASK] | Predict how many tokens a span is missing |
| Sentence Permutation | Split on full stops and shuffle sentences | Understand how sentences relate |
| Document Rotation | Pick a token at random and rotate the document to start there | Find the start of the document |

For fine-tuning, classification feeds the same input to encoder and decoder and uses the final output representation. For generation tasks such as translation, a newly trained encoder is placed in front of BART and can use a different vocabulary from the original.

## Road three: decoders (GPT)

Slide 46 gives [GPT-1](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) (Radford et al., 2018): a 12-layer Transformer decoder with 117M parameters, 768-dimensional hidden states, 3072-dimensional feed-forward layers, and BPE with 40,000 merges, trained on BooksCorpus (over 7,000 books), whose long runs of contiguous text help learn long-distance dependencies. A bit of trivia from the slide: the acronym "GPT" never appears in the original paper.

Slide 48's pretraining task is next-token prediction, factoring a sentence's probability into a chain of conditional probabilities. Slide 49 shows fine-tuning: convert any structured input into a token sequence followed by a linear classifier. Entailment becomes "Start premise Delim hypothesis Extract"; multiple choice runs each answer through GPT separately and compares them.

Slide 50's GPT family table:

| Model | Slide description | Parameters | Data | Release |
|---|---|---|---|---|
| GPT-1 | Transformer decoder followed by linear-softmax | 117M | BooksCorpus 4.5 GB | 2018/06 |
| GPT-2 | Same as GPT-1 with differently placed normalization; the text generation era starts | 1.5B | WebText 40 GB | 2019/02 |
| GPT-3 | A larger GPT-2 | 175B | CommonCrawl 45 TB | 2020/05 |
| GPT-4 | Trained with RLHF | > 1.5T | Undisclosed | 2023/03 |

Treat the GPT-4 parameter count with caution: the [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774) states that it withholds architecture details including model size, so the slide's "> 1.5T" is not a figure OpenAI published.

## GPT-3, in-context learning and scaling laws

Slides 51–53 cite the [GPT-3 paper](https://arxiv.org/abs/2005.14165) (Brown et al., 2020). Before it, there were two ways to use a pretrained model: sample from the distribution it defines, or fine-tune it on task data. Large enough models show an emergent ability: **they learn a task from a few examples in the context, without any gradient steps**. This is in-context learning, and 175-billion-parameter GPT-3 is the example.

Slide 55 covers [scaling laws](https://arxiv.org/abs/2001.08361) (Kaplan et al., 2020): increase model size, data and training compute together and performance improves smoothly, following simple predictive rules.

Slides 56–57 list large models and community models: GPT-3 (175B), BLOOM (176B), Flan-PaLM (540B); Llama 2 (7B/13B/70B), Mistral (7B, 8×7B), Phi 2 (2.7B) and Gemma (2B/7B), the last four all decoder-only.

Slide 58's takeaways close the three roads in three lines: the BERT family pretrains with MLM and NSP and is not good at generation; T5 and BART boost MLM with span corruption and target a text-to-text format; the GPT family is pure language modeling and the most popular backbone today.

## Going deeper

- Load `bert-base-uncased` in a `transformers` `fill-mask` pipeline, feed it "I [MASK] NLP", and look at the top five candidates.
- Run "I record the record" through BERT, take the last-layer vectors of both records, compute their cosine similarity, and compare with GloVe's single vector.
- Write a span corruption function: given a sentence, a 15% rate and average length 3, output a T5-format input and target, and check it against slide 36.
- Take any decoder-only model and run the same classification task with zero-shot and 3-shot prompts to see slide 52's in-context learning.

**Further reading**: [CS224N guide: pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en), [CS224U contextual representations II: GPT, BERT, RoBERTa, ELECTRA, seq2seq and distillation](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en), [CS224U guide: in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning-en), [CME295 guide: LLM training](/posts/ai/2026-09-29-cme295-llm-training-en).

## Gaps in the materials

- Slides 53–54 (GPT-3 ICL, GPT-3 family) and 26 (why bidirectional) are paper figures; the extracted text has only their titles, so this guide does not restate numbers from them.
- This lecture has no dedicated assignment. BERT hands-on work is in the next part, [HF BERT tutorial and HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en); GPT-2/T5 hands-on work is in [GPT-2/T5 Chinese summarization](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en).
- What came after GPT-3 (InstructGPT, RLHF) is in [GPT-3, InstructGPT and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en).
- Solutions, quizzes and class discussion live on NTU COOL and are not available to outside readers. The Fall 2026 version of this lecture is not yet public.

**Series navigation**: previous [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization-en) | next [HF BERT Tutorial and HW3: Multi-output Learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) | [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W4_bert_and_its_family.pdf (ELMo, BERT, GPT, and T5 slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W4_bert_and_its_family.pdf)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 6 Tue. (in Chinese)](https://www.youtube.com/live/U5HypcXrIgY)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 6 Thu. (in Chinese)](https://www.youtube.com/live/RNlcZjzbhDo)
- [Peters et al. (2018). Deep Contextualized Word Representations (ELMo)](https://aclanthology.org/N18-1202/)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Liu et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)](https://arxiv.org/abs/1910.10683)
- [Lewis et al. (2020). BART: Denoising Sequence-to-Sequence Pre-training](https://aclanthology.org/2020.acl-main.703/)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training (GPT-1)](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Brown et al. (2020). Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)
- [Kaplan et al. (2020). Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [OpenAI (2023). GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
