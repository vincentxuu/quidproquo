---
title: "Hung-yi Lee ML 2026 HW8: Spending More Inference Compute — What Voting, Self-Certainty, and DeepConf Each Buy in Accuracy"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, test-time-scaling, reasoning, llm-inference]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 17
tldr: "HW8 involves no coding and no code submission. The TAs provide a finished Colab that runs Llama-3.2-1B-Instruct on the first 100 GSM8K questions and compares direct inference, Self-Consistency, Self-Certainty, and DeepConf (Confidence), sampling 16 reasoning traces per method. You read three papers, run the notebook, and answer 20 questions on NTU COOL: 18 about the papers and 2 about the Colab results. The prerequisite is Lecture 7 (Reasoning) of Lee's 2025 course. All questions are printed in hw8.pdf in Chinese and English, and the Colab is publicly downloadable. Only the COOL quiz and grades need an NTU account."
description: "Guide to HW8 \"Test-Time Scaling\" in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw8.pdf, the assignment Colab, and the course page: the prerequisite video, five concepts (Chain-of-Thought, beam search, Self-Consistency, Self-Certainty, DeepConf), the Colab's model and sampling settings, how the three methods are defined and implemented (Borda weighting, top-k logprob approximation, confidence-weighted voting), what the 20 quiz questions cover, grading, and how to self-study it."
draft: false
glossary:
  - term: "Self-Consistency"
    aliases: ["majority voting"]
    definition: "Sample several reasoning traces for the same question, extract each final answer, and return the most frequent one."
    context: "In HW8 it is the most basic test-time scaling method and needs no logprobs."
  - term: "Self-Certainty"
    aliases: []
    definition: "Score each reasoning trace by how certain the model is, using the full token distribution at every generated position, then vote with rank-based weights."
    context: "The HW8 Colab approximates the full vocabulary using the top 50 logprobs returned by vLLM."
  - term: "DeepConf"
    aliases: ["Deep Think with Confidence", "Confidence"]
    definition: "Aggregate token-level confidence into a trace-level confidence, then filter low-confidence traces or run weighted voting."
    context: "HW8 calls DeepThinkLLM.deepthink() from the official deepconf package in offline mode."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling)

**This post covers HW8 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 17 of the series [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en). Official materials: the slides [hw8.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw8.pdf), the [assignment Colab](https://colab.research.google.com/drive/1_z4JryPWnITLAwtytVwu75FZMx9giT3R?usp=sharing) (34 cells), and the TA's [walkthrough video](https://youtu.be/KAbM5gM6Isw). The course page lists it as released 5/15 and due 2026/06/04 23:59 (UTC+8), with TAs 江履方, 陳品睿, 尹廷安, and 林育正. Grades were due by 2026/06/07.

Access rating: **A3 minus grading**. The slides print all 20 questions in both Chinese and English, and the Colab can be downloaded and run by anyone. The only things you can't get are the NTU COOL quiz itself and the grades. This assignment doesn't use JudgeBoi.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=KAbM5gM6Isw
title: HW8 walkthrough video (YouTube)
```

Original videos: [HW8 walkthrough video (YouTube)](https://www.youtube.com/watch?v=KAbM5gM6Isw)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Prerequisite: 2025 Lecture 7 on Reasoning

Page 3 of hw8.pdf asks you to watch [Machine Learning in the Age of Generative AI (2025), Lecture 7: How do LLMs like DeepSeek-R1 "think deeply" (Reasoning)?](https://www.youtube.com/watch?v=bJFtcwLSNxI) (in Mandarin) first. This term has no new lecture that covers it.

The closest lectures this term are [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en) and [Self-Improving AI (Part 1)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en). Part 1's certainty-based loss uses how concentrated the output distribution is as a signal to update parameters. HW8's Self-Certainty and DeepConf use the same kind of signal, but to **pick an answer**, leaving the parameters untouched.

## The task: five concepts, three methods

The slides' goal is to learn several test-time scaling methods, run them on an open-source LLM, and look at how accuracy differs. They recommend these papers for an overview:

- [Chain-of-Thought](https://arxiv.org/abs/2201.11903)
- Beam Search (the slides give only the name)
- [Self-Consistency](https://arxiv.org/abs/2203.11171) (ICLR 2023): generate multiple outputs and take the majority.
- [Self-Certainty](https://arxiv.org/abs/2502.18581) (NeurIPS 2025): voting plus certainty.
- [Confidence / DeepConf](https://arxiv.org/abs/2508.15260) (ICLR 2026): use different parts of the reasoning and token confidence to decide the final answer.

## The Colab: already written, you just run it

The notebook says up front that the code is complete. You only need to run it on a Colab T4, and you should **not modify any cells**. Treat it as a tutorial. The fixed settings:

| Item | Setting |
|---|---|
| Model | `unsloth/Llama-3.2-1B-Instruct`, loaded with vLLM and wrapped in `deepconf`'s `DeepThinkLLM` |
| Data | First 100 questions of the [GSM8K](https://huggingface.co/datasets/openai/gsm8k) test split |
| Samples per method | 16 reasoning traces |
| Sampling | temperature 0.7, top-p 0.95, up to 384 new tokens |
| Answer format | The model is asked for `\boxed{answer}`; the extractor also accepts GSM8K's `#### answer` or the last number |

Each GSM8K item is a word problem whose reference solution ends with an answer in the form `#### 10`. The slides' Metric page is explicit: an answer counts only if **the value and the format are both right**. Wrong working with a lucky final number, or `####` written as `##!!`, changes the outcome.

### Baseline: direct inference

One trace at temperature 0, answer extracted directly. It's the control for asking whether test-time scaling beats a single generation at all.

### Method 1: Self-Consistency

Sample N traces y₁…y_N, extract an answer a_i from each, and return the most frequent:

â = argmax_a Σ_i 𝟙[a_i = a]

This needs no logprobs, so it works with any API.

### Method 2: Self-Certainty

Score each trace y_k, where V is the vocabulary size and n is the number of generated tokens:

Self-Certainty(y_k) = −(1 / nV) · Σ_i Σ_j log( V · p(j | x, y_{k,<i}) )

The intuition: the further the distribution is from uniform (the more concentrated it is), the higher the score. Traces are then ranked by score, and the trace at rank r gets weight (N − r + 1)^p in a Borda-style weighted vote. With p = 0 this reduces to plain majority voting. The Colab sets p = 0.3.

One approximation to note: the full vocabulary costs too much VRAM, so the Colab takes only **the top 50 logprobs** from vLLM and spreads the remaining probability mass evenly over the other tokens.

### Method 3: Confidence (DeepConf)

This one isn't hand-coded. The notebook calls `DeepThinkLLM.deepthink()` from the official [deepconf](https://github.com/facebookresearch/deepconf) package in offline mode. As the notebook explains:

- At each position, compute the entropy H_{k,i}, then convert it to a normalized confidence c_{k,i} = 1 − H_{k,i} / log K, where K is the number of token probabilities used. Lower entropy means higher confidence.
- Aggregate a trace's c values into a trace-level confidence C(y_k). Variants include mean, tail, and bottom-window aggregation.
- Run confidence-weighted voting: each answer sums the confidence of the traces supporting it, and the largest total wins.

The Colab prefers bottom-window, then tail, then mean confidence-weighted voting, followed by the top-10% filtered variants, and falls back to majority voting only as a last resort.

At the end the notebook prints an accuracy table (accuracy, number correct, average runtime in seconds, average number of valid answers) and plots an accuracy bar chart, correct-vs-wrong counts, and per-question runtime. It reminds you that the accuracy gained from sampling many traces usually costs more inference time.

## The quiz: 20 questions, all on NTU COOL

| Part | Questions | Points |
|---|---|---|
| Part 1: Paper reading | 18 | 0.5 each |
| Part 2: Coding | 2 | 0.5 each |

The total is 10 points. No code submission; the COOL quiz has unlimited attempts and keeps your best score; no late submissions.

Based on the questions printed in hw8.pdf, the paper questions cover:

- **Self-Consistency** (Q1–Q3): the correct order of steps, when it works poorly, and its core idea.
- **Self-Certainty** (Q4–Q6): the core concept, experimental findings (including why Borda voting combines certainty ranking with answer frequency), and how it differs from AvgLogP / negative perplexity.
- **DeepConf** (Q7–Q9): motivation; the Token, Average Trace, Bottom 10% Group, Tail, and Lowest Group confidence measures; and online thinking with early stopping in DeepConf-low / high.
- **CoT and comparisons** (Q10–Q15): how CoT relates to Self-Consistency, when CoT doesn't help, sensible implementation and evaluation practices, a hand calculation of majority vs. confidence-weighted voting, and Best-of-N.
- **Beam search** (Q16–Q18): how it differs from Self-Consistency, a hand expansion with beam size 2, and its limits on reasoning tasks.

The two Part 2 questions: screenshot the Colab's accuracy table (Q19), then use it to say which method has the lowest accuracy (Q20).

This post doesn't give answers. Q13 and Q17 are hand calculations you can do with the formulas above.

## What outside readers can't get

- **NTU COOL**: the quiz needs an NTU account, so you can't see scores or official answers.
- **Walkthrough video**: it has no captions on YouTube, so this post does not draw on the video.

Everything else is available. **Something you can do tonight**: copy the Colab, run it on a T4, and write down each method's accuracy and average runtime. Work out how many times more time each extra percentage point of accuracy costs. Then quiz yourself with the 18 paper questions from hw8.pdf, and go back to the paper for any you can't answer.

## Going deeper

- **Papers**: the DeepConf [arXiv paper](https://arxiv.org/abs/2508.15260) is the source for Q7–Q9, and its definitions of the confidence measures are the best use of your time. The Self-Certainty [arXiv paper](https://arxiv.org/abs/2502.18581) explains why it uses the full distribution rather than just the chosen token.
- **Modify it yourself**: the assignment forbids editing the notebook, but outside the assignment you can set `N_SAMPLES` and each method's budget to 4, 8, and 32 instead of 16, plot accuracy against sample count, and see which method saturates first.
- **Related reading**: [CME295 LLM Reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning-en) covers reasoning models and inference-time compute. [BrowseConf](/posts/ai/2026-09-19-browseconf-test-time-scaling-en) applies confidence-driven test-time scaling to browsing agents. For RL fundamentals, see [Berkeley CS285 policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en).

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW7: Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en) | Next: [Self-Improving AI (Part 2): improving the harness and learning to learn](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW8 release date, deadline, TAs (in Mandarin)
- [ML 2026 Spring HW8 Test-Time Scaling (hw8.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw8.pdf) — prerequisite, task, grading, all 20 questions in Chinese and English
- [HW8 Colab](https://colab.research.google.com/drive/1_z4JryPWnITLAwtytVwu75FZMx9giT3R?usp=sharing) — model, sampling settings, formulas and implementation of the three methods
- [HW8 walkthrough video (YouTube)](https://youtu.be/KAbM5gM6Isw)
- [Prerequisite: Machine Learning in the Age of Generative AI (2025), Lecture 7 on Reasoning](https://www.youtube.com/watch?v=bJFtcwLSNxI) (in Mandarin)
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv 2201.11903)](https://arxiv.org/abs/2201.11903)
- [Self-Consistency Improves Chain of Thought Reasoning in Language Models (arXiv 2203.11171)](https://arxiv.org/abs/2203.11171)
- [Scalable Best-of-N Selection for Large Language Models via Self-Certainty (arXiv 2502.18581)](https://arxiv.org/abs/2502.18581)
- [Deep Think with Confidence (arXiv 2508.15260)](https://arxiv.org/abs/2508.15260)
- [facebookresearch/deepconf (GitHub)](https://github.com/facebookresearch/deepconf)
- [openai/gsm8k (Hugging Face)](https://huggingface.co/datasets/openai/gsm8k)
