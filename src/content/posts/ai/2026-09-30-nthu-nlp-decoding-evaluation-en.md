---
title: "NTHU NLP Guide 10: Why the Same Model Sounds Stiff or Rambles — Decoding Strategies and NLG Evaluation"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, decoding, evaluation, metrics, benchmark, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 10
tldr: "A guide to the decoding and evaluation unit in NTHU Prof. Hung-Yu Kao's NLP course (Fall 2025). The first half covers how to pick a word once the model outputs a probability distribution: greedy decoding can't take back a mistake, beam search keeps several candidates but favors short outputs, and top-k / top-p trade determinism for diversity (missing from the slides; the professor covers it verbally in class). The second half covers scoring generated text: BLEU's modified precision and brevity penalty, ROUGE-N and ROUGE-L, perplexity, and what GLUE, SQuAD 2.0, MTEB, and MMLU each measure."
description: "A guide to W5_decoding.pdf and the Week 7 Tue. recording from NTHU Prof. Hung-Yu Kao's Natural Language Processing course (Fall 2025): conditional language models and teacher forcing, error accumulation in greedy decoding, step-by-step beam search scoring and length normalization, top-k / top-p sampling and temperature, stop criteria; BLEU's modified precision, clipping, and brevity penalty, ROUGE-N / ROUGE-L, perplexity, human versus automatic evaluation, and GLUE, SQuAD 2.0, MTEB, MMLU, and TMMLU."
draft: false
glossary:
  - term: "beam search"
    definition: "At each decoding step, keep the k highest-scoring candidate sequences (k is the beam size), expand each, keep the best k again, and repeat until a stop criterion is met."
    context: "Slides 15–28 walk through it step by step with beam size 2."
  - term: "top-p sampling"
    aliases: ["nucleus sampling"]
    definition: "Sort candidate tokens by probability, take the smallest group whose cumulative probability passes a threshold p, and sample one from it. The candidate pool grows or shrinks with the shape of the distribution."
    context: "The professor explains it verbally in the Week 7 Tue. recording; the slides have no section on it."
  - term: "modified n-gram precision"
    definition: "The core of BLEU: each n-gram in the output counts at most as many times as it appears in any single reference (clipping), so repeating a word can't inflate the score."
    context: "The slides show 'the the the the the the' getting only 1/6."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 10 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [the Hugging Face BERT tutorial and HW3 multi-output learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en).

The official materials are the slides [W5_decoding.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W5_decoding.pdf) (63 pages, titled "Decoding Strategies and Evaluations for Natural Language Generation") and the [Week 7 Tue.](https://www.youtube.com/live/NtPrXea8qSE) recording (about 98 minutes, in Mandarin).

First, which recording to watch. The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) puts this deck and the Hugging Face tutorial in the same W7 row, and its Topics column ("Python for text tutorial") is a syllabus template that doesn't match the content. I read the captions for Week 7 Tue.: it runs from the opening on decoding all the way to MMLU, and the professor closes with "that's it for decoding and evaluation today." [Week 7 Thu.](https://www.youtube.com/live/4qDUML9TeHM) that week plays the Hugging Face tutorial (frames at minutes 5, 25, and 50 show the tutorial slides), which the previous part covers. For this unit, W7 Tue. alone is enough.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=NtPrXea8qSE
title: Week 7 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=4qDUML9TeHM
title: Week 7 Thu.
```

Original videos: [Week 7 Tue.](https://www.youtube.com/watch?v=NtPrXea8qSE)、[Week 7 Thu.](https://www.youtube.com/watch?v=4qDUML9TeHM)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

## The setup: training has answers, testing doesn't

The first 10 slides are review. A language model predicts the next word's probability given the previous words, P(y<sub>t</sub> | y<sub>1</sub>, …, y<sub>t−1</sub>). Add a source text x and you get a conditional language model, i.e. seq2seq: translation, summarization, and dialogue generation all fit here.

Training uses [teacher forcing](/posts/ai/2026-09-30-nthu-nlp-transformers-en). Whatever the model guessed at the previous step, the next input is replaced with the correct token, and the per-position cross-entropy sums to the sequence loss. Slide 10 then asks: **at test time there's no correct answer to feed in, so how is the next word chosen?**

Slide 14 adds an easy-to-miss premise. Every strategy below operates on the last layer's output, a probability distribution the size of the vocabulary (the slide's example is 32k token probabilities). The architecture stays the same; only "how to pick from the distribution" changes, and the output changes a lot.

## Decoding: from one path to several

### Greedy: take the maximum every step

The slides translate "I love reading books" into 我 愛 閱 讀. Greedy decoding takes the argmax at every step. Slide 13 names the problem: **greedy can't undo**. If step three picks 打 instead of 閱, step four follows with 球, and the output becomes 我愛打球 ("I love playing ball"). The error compounds.

In the recording, the professor says output found this way is "usually stiff, without much variation," and once one word goes wrong, everything after it can go badly wrong.

Slide 14 proposes keeping more than one choice at each step. One direction is **stochastic sampling** (top-k, top-p); the other is **deterministic search** (beam search). The two can be combined.

### Top-k and top-p: not in the slides, covered verbally

A detail worth recording. The outline lists "Top-k / Top-p Sampling," but the deck has no content pages for either. At the start of the recording, the professor says the slides "didn't write up top-k and top-p sampling… I'll explain it verbally later; I only noticed today." What follows comes from his spoken explanation:

- **Top-k**: take the k most probable words (say k = 3) and roll a die among them. The answer varies between runs, and a wrong pick can still recover later. It adds diversity.
- **Top-p**: same idea, but the cutoff is a cumulative probability; he mentions defaults of 0.9 or 0.8. If the top word has 0.6 and the second 0.2, the running total hasn't passed p, so you keep adding words. This fixes a problem with top-k: if the top word is already very likely and the rest are tiny, should you still roll a die? Top-p lets the sampling range follow the shape of the distribution. His verdict: "top-p usually works better, but not always."
- **Temperature**: if you only call a GPT API, you probably never touch per-step decoding and can only set temperature. That's also why asking the same question twice can give different answers.

For illustrated examples, see Hugging Face's [How to generate text](https://huggingface.co/blog/how-to-generate). Slides 36–37 of [the next part's GPT-2 / T5 tutorial](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en) cite that post and use `model.generate()` to avoid hand-writing the decoding loop.

### Beam search: keep k candidates at once

The beam size (or beam width) is a hyperparameter: how many candidates survive each step. The score is the sum of log probabilities along the sequence, and closer to 0 is better. Slides 15–28 compute it step by step with beam size 2:

| Step | Candidates and running scores | Kept |
|---|---|---|
| t = 1 | I: −0.7; You: −0.9 | Both |
| t = 2 | I like: −1.7; I want: −2.9; You want: −1.6; You are: −1.8 | You want, I like |
| On to t = 6 | Expands into candidates like "I like to watch horror movies" | Two per step |

At t = 2, the You branch, which started with the worse score, takes first place. Greedy would have dropped You at t = 1. Keeping one extra path is what lets beam search find that out.

The professor's practical notes from class: beam size often defaults to 2, and "three is already a lot; it shouldn't go higher." In experiments, start with width 1 (which is greedy), then increase. Only try 3 if the difference is small, and 3 may already be too slow to run.

**Stop criteria** (slide 29): the model emits `<EOS>`, or the output reaches a preset maximum length. Both apply to greedy and beam search.

**Beam search's flaw** (slides 30–32): each extra word adds another negative log probability, so **longer candidates score lower**, and the search favors short outputs. The fix is to normalize by length T, dividing the sum by T before comparing.

Slide 33 inserts a news item: the October 2024 Nature paper [Scalable watermarking for identifying large language model outputs](https://www.nature.com/articles/s41586-024-08025-4), which watermarks text during generation while keeping quality and detection accuracy. It sits at the end of the decoding section because watermarking works at exactly this layer, the per-step word choice.

## Evaluation: how do you score generated text?

Slide 35's example: 我愛閱讀 can be translated as "I love reading books," but so can other phrasings. Language is subjective and diverse, and the same thing has many right ways to say it. Evaluation splits into human and automatic; this unit focuses on automatic.

### BLEU: n-gram precision

[BLEU](https://aclanthology.org/P02-1040/) (Papineni et al., 2002) is word-based, so it's **very sensitive to tokenization**. Its core is precision over 1-grams through 4-grams, called BLEU-1 through BLEU-4.

**Problem one: repeating a word games the score.** Slides 38–40:

- Reference 1: I want to read the book.
- Reference 2: I want to read that book.
- Model output: the the the the the the.

Plain precision is 6/6, a perfect score, which is clearly wrong. Modified precision caps each word at the number of times it appears in a reference. "the" appears once in reference 1, so the output gets only 1/6.

**The second example** is BLEU-2 (slides 42–48). The output "The dog the dog on the bed." has six bigrams. "the dog" appears twice but at most once in any reference, so it's clipped to 1. "dog the" appears in neither reference, so 0. "dog on," "on the," and "the bed" get 1 each. Modified precision is 4/6. The slides note that an n-gram matching both references still counts only once.

**Problem three: shorter is better.** Precision only checks whether the output's words are right, so emitting two or three confident words scores well. BLEU therefore multiplies in a **brevity penalty** (slide 51): c is the output length, r is the reference length closest to c, and outputs shorter than the reference are penalized. The modified precisions for 1-grams through 4-grams (N = 4) are combined as a weighted average of logs, with each weight set to 1/4 in the original paper.

### ROUGE: recall, mainly for summaries

In [ROUGE](https://aclanthology.org/W04-1013/) (Lin, 2004), ROUGE-N is recall-based n-gram co-occurrence, and ROUGE-L uses the longest common subsequence (LCS). Slide 52's example:

- S1 (reference): police killed the gunman
- S2: police kill the gunman
- S3: the gunman kill police

S2 and S3 have the same ROUGE-2, since only "the gunman" matches. ROUGE-L tells them apart: S2's LCS is "police the gunman," scoring 3/4, while S3 only has "the gunman," scoring 1/2. A fourth sentence, "the gunman police killed," flips things: its ROUGE-2 is higher than S2's and its ROUGE-L lower. Each metric sees something different.

### Perplexity

Slide 53 recaps perplexity, a quantitative measure of language modeling ability where **lower is better**. It first appeared in [word embeddings and language models](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en); here it's placed back in the evaluation context.

### Human or automatic?

Slide 54's comparison:

| | Pros | Cons |
|---|---|---|
| Human evaluation | Handles subjectivity better; can be designed for any comparison | Less objective, slow, expensive |
| Automatic evaluation | Objective enough to be a shared metric; fast | Can't handle language diversity; there's always another valid translation |

## Benchmarks: shared exams for models

The last ten slides shift from "how to score one output" to "how to compare whole models."

| Benchmark | What the slides highlight |
|---|---|
| [GLUE](https://arxiv.org/abs/1804.07461) (ICLR 2019) | Nine tasks, all handled by one model, to show general language understanding. Three groups: single-sentence classification (CoLA acceptability, SST-2 sentiment), sentence-pair classification (MNLI, RTE, WNLI, QNLI for natural language inference; QQP, MRPC for paraphrase), and text similarity (STS-B). The score is the average of the nine; the human baseline averages 87.6 |
| [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/) | Reading comprehension: crowdworkers write questions on Wikipedia articles, and each answer is a span of the passage. Version 1.1 has 100,000+ QA pairs over 500+ articles; [2.0](https://arxiv.org/abs/1806.03822) adds 50,000 unanswerable questions that look like answerable ones, so systems must learn to abstain when the passage has no answer |
| [MTEB](https://arxiv.org/abs/2210.07316) | Evaluates embedding models across 8 task categories, each with its own metrics (nDCG@10, Recall@k, accuracy, F1, V-measure, Spearman, and others). The slide lists Qwen-Embedding-8B (70.58) as the top model at the time; the [leaderboard](https://huggingface.co/spaces/mteb/leaderboard) changes |
| [MMLU](https://arxiv.org/abs/2009.03300) | Multiple-choice questions across 57 subjects (STEM, humanities, social sciences, and more), zero-shot and few-shot only, measuring knowledge acquired in pretraining. The slide also lists "TMMLU, MediaTek" and links a Traditional Chinese evaluation paper from MediaTek's research team, [arXiv 2309.08448](https://arxiv.org/abs/2309.08448) |

STS-B, RTE, and MNLI in the GLUE table deserve a second look. The previous part's HW3, relatedness regression plus entailment classification, combines exactly these two kinds of tasks.

Slide 62 also separates three kinds of data: in-domain (same distribution as training), out-of-domain (clearly different content, style, or context, e.g. trained on tech news, tested on health articles), and open-domain (no topic restriction). Benchmark scores need to be read within this frame.

On MMLU, the professor notes that such datasets basically provide no training data. People evaluate directly, or use one or two items as in-context learning examples. He also mentions that top venues such as ACL now publish many papers on how to evaluate large language models in the first place.

## Try it

- With Hugging Face's `model.generate()`, have one small model (e.g. GPT-2) continue the same prompt four ways: `num_beams=1`, `num_beams=3`, `do_sample=True, top_k=3`, and `do_sample=True, top_p=0.9`. Compare how repetitive each output is.
- Recompute the BLEU-2 modified precision from slide 48 on paper, then shorten the output to "the bed" and see how precision and the brevity penalty change.
- Compute ROUGE-2 and ROUGE-L for S1–S4 and confirm the orderings on slide 52.

**Further reading**: [CS224U methods and metrics I](/posts/ai/2026-09-29-cs224u-methods-metrics-en) goes deeper into the weaknesses of BLEU and perplexity; [CS224N Lecture 11: why benchmarks and LLM evaluation expire](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en) continues with saturation and contamination; [CME295 Lecture 8](/posts/ai/2026-09-29-cme295-llm-evaluation-en) covers LLM-as-a-judge.

## Gaps in the materials

- Top-k / top-p has no slides; that section relies entirely on the recording's captions. The captions contain recognition errors (e.g. "threshold" rendered as "stress hold"), so I only used sentences whose meaning is clear.
- The BLEU and perplexity formulas are images on the slides; this guide only restates the symbol definitions the slides label and doesn't reproduce the formulas.
- This unit has no assignment. Solutions, quizzes, and the discussion board are on NTU COOL, out of reach for outside readers.
- The Fall 2026 version of this unit isn't public yet. Under the grading in the [global course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), Fall 2025 is A3 (enough for self-study).

**Series navigation**: previous, [Hugging Face BERT tutorial and HW3 multi-output learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) | next, [GPT-2 / T5 Chinese summarization](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W5_decoding.pdf (Decoding Strategies and Evaluations for NLG slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W5_decoding.pdf)
- [Recording: [Fall 2025] Natural Language Processing - Prof. Hung-Yu Kao - Week 7 Tue.](https://www.youtube.com/live/NtPrXea8qSE) (in Mandarin)
- [Recording: [Fall 2025] Week 7 Thu. (Hugging Face tutorial playback)](https://www.youtube.com/live/4qDUML9TeHM) (in Mandarin)
- [Papineni et al. (2002). BLEU: a Method for Automatic Evaluation of Machine Translation](https://aclanthology.org/P02-1040/)
- [Lin (2004). ROUGE: A Package for Automatic Evaluation of Summaries](https://aclanthology.org/W04-1013/)
- [Wang et al. (2019). GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding](https://arxiv.org/abs/1804.07461)
- [SQuAD Explorer](https://rajpurkar.github.io/SQuAD-explorer/)
- [Rajpurkar, Jia & Liang (2018). Know What You Don't Know: Unanswerable Questions for SQuAD](https://arxiv.org/abs/1806.03822)
- [Muennighoff et al. (2022). MTEB: Massive Text Embedding Benchmark](https://arxiv.org/abs/2210.07316)
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [Hendrycks et al. (2020). Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300)
- [Hsu et al. (2023). Advancing the Evaluation of Traditional Chinese Language Models: Towards a Comprehensive Benchmark Suite](https://arxiv.org/abs/2309.08448)
- [Dathathri et al. (2024). Scalable watermarking for identifying large language model outputs, Nature](https://www.nature.com/articles/s41586-024-08025-4)
- [Hugging Face Blog: How to generate text](https://huggingface.co/blog/how-to-generate)
