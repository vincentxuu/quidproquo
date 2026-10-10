---
title: "NTU ADL 2025 Lecture 9: Decoding, Generation Control, and Evaluation for NLG"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, decoding, llm-evaluation]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 12
tldr: "Lecture 9 of ADL Fall 2025 answers two questions. The model gives you a probability distribution at every step, so how do you pick a word from it? And once you have a sentence, how do you judge it? The slides start with teacher forcing and exposure bias to show the gap between training and generation, then compare greedy, beam search, sampling, top-k, and nucleus sampling, and file temperature and the penalties under 'control' rather than decoding algorithms. The evaluation half covers BLEU, ROUGE, perplexity, and LLM-Eval, then explains why you would use RL to optimize whole-sentence quality directly."
description: "A guide to the 10/27 NLG Decoding and NLG Evaluation slides and videos 9.1–9.5 of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): conditional LMs, teacher forcing, exposure bias, scheduled sampling, greedy / beam / sampling / top-k / nucleus, temperature, repetition / frequency / presence penalties, BLEU, ROUGE, perplexity, LLM-Eval, and RL for NLG and RLHF."
draft: false
glossary:
  - term: "exposure bias"
    definition: "During training the decoder is fed the correct token at every step (teacher forcing), but during generation it is fed its own previous output. The model never sees the states that follow its own mistakes, so one wrong step can derail the rest."
    context: "Slides 10–11 sum it up in Chinese as 'one wrong step, every step wrong'."
  - term: "nucleus sampling"
    aliases: ["top-p sampling", "top-p"]
    definition: "Sample only from the smallest set of candidate words whose cumulative probability reaches a threshold p. The set shrinks when the distribution is peaked and grows when it is flat, which amounts to a dynamic k for top-k."
    context: "Slide 33 cites Holtzman et al., The Curious Case of Neural Text Degeneration."
  - term: "perplexity"
    definition: "How confused a language model is when predicting a test set: the inverse probability of the test set, normalized by the number of words. Lower means the model predicts unseen sentences better."
    context: "Slide 9 stresses that it evaluates the generative model itself, not any single output."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)

This is post 12 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) taught this lecture on 10/27, right after the midterm break. The [course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) marks that week as Virtual.

**Sources**: two slide decks, [NLG Decoding (251027_NLG.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf) (41 pages) and [NLG Evaluation (251027_NLGEval.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) (22 pages), plus five videos: [9.1 Natural Language Generation](https://youtu.be/1d9WhPS6gv8) (28:20), [9.2 Decoding Algorithms](https://youtu.be/agHrC93u7w8) (28:34), [9.3 Generation Control](https://youtu.be/Jxg6MLpgKPM) (17:57), [9.4 NLG Evaluation](https://youtu.be/gAsEAga1icM) (32:41), and [9.5 RL for NLG](https://youtu.be/Ly67whCaS4M) (15:27). The videos are taught in Mandarin; the slides are in English. I checked the slides on 2026-09-30, and all page numbers below refer to the PDFs.

> **Version note**: The slide cover says October 27th, 2025. The five videos were uploaded to the Fall 2025 playlist on 2025/10/27, but their descriptions carry the date 2023/10/26, and 9.1–9.3 credit the slides to Hung-Yi Lee. I did not compare the video frames against the 2025 slides page by page; where they differ, this post follows the slides.

**Series**: Previous: [RAG + HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) | Next: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The earlier lectures taught a model to learn a distribution over the next word. This one deals with what happens after training: you have the distribution, so **which word do you actually output**? And **how do you tell whether the resulting text is any good**?

There is no homework attached to this lecture. The series-wide [access grade](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) is A2, and this lecture has no gaps of its own: slides and videos are all public. The TA session from the same week, LLM Inference & Evaluation, is covered in the series' [TA sessions post](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en).

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=1d9WhPS6gv8
title: ADL 9.1: Natural Language Generation (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=agHrC93u7w8
title: ADL 9.2: Decoding Algorithms (YouTube, in Mandarin)
```

Original videos: [ADL 9.1: Natural Language Generation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=1d9WhPS6gv8)、[ADL 9.2: Decoding Algorithms (YouTube, in Mandarin)](https://www.youtube.com/watch?v=agHrC93u7w8)、[ADL 9.3: Generation Control (YouTube, in Mandarin)](https://www.youtube.com/watch?v=Jxg6MLpgKPM)、[ADL 9.4: NLG Evaluation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=gAsEAga1icM)、[ADL 9.5: RL for NLG (YouTube, in Mandarin)](https://www.youtube.com/watch?v=Ly67whCaS4M)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## From language models to conditional LMs

Slide 3 lists tasks that involve generation: machine translation, abstractive summarization, dialogue, image captioning, and creative writing. Slides 4–7 fold them into one problem.

- **Language model**: predict the next word given the words so far, P(y_i | y_1, …, y_{i−1}). An RNN-LM models this distribution with an RNN; GPT does it with a Transformer.
- **Conditional LM**: add an input x and predict P(y_i | y_1, …, y_{i−1}, x). For translation x is the source sentence, for summarization the document, for dialogue the context, for captioning the image.

Slide 7 adds that either an encoder-decoder or a decoder-only architecture can condition on x. This is the same idea as the language models in [post 3](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en), with a condition added.

## The train/test gap: exposure bias

**Teacher forcing** (slide 8): during training, feed the gold target to the decoder as the next input, whatever the model predicted. Training becomes stable, but the slide flags the problem right away: training and testing no longer match.

Slides 9–11 use a toy vocabulary of just A and B:

- In training, every input is the reference, and the loss is the sum of per-word cross-entropy.
- In generation, there is no reference, so the model's previous output becomes its next input.

The model never sees, during training, the state that follows its own mistake. The slides call this **exposure bias** and sum it up with a Chinese saying: one wrong step, every step wrong. Once a step goes off, the model walks into paths it has never explored, and the whole sentence can go wrong.

**Scheduled sampling** (slides 12–13, Bengio et al. 2015) randomly decides during training whether the next input comes from the reference or from the model. In the MSCOCO captioning results on the slide, the mixed approach beats both "always from reference" and "always from model".

Slide 14 then notes that **LLM training does not use scheduled sampling**. The reason given: LLM pretraining data is large enough that it already explores far more paths.

## Five decoding algorithms

Slide 16 defines the term: with a trained (conditional) LM, a **decoding algorithm** decides how to generate text from it. The slides run every method on the same opening (Dwight gets up, goes downstairs, eats breakfast, looks at the crossword in the paper) and show each continuation, which makes the comparison easy to follow.

| Method | What it does | Problem the slides point out |
|---|---|---|
| Greedy (slides 17–19) | Take the most probable word at each step (argmax) | No backtracking; an unexplored path may have higher total probability. The example repeats "The headline read: "The New York Times."" three times |
| Beam search (slides 20–23) | Keep the k most probable sequences at each step | Small beams are ungrammatical; large beams are expensive and make chit-chat generic. The example produces a long string of "New York" |
| Sampling (slides 26–28) | Sample from the distribution instead of taking argmax | The long tail holds many low-probability words, and quality drops there. The example produces lines like "how happy has white rabbit been?" |
| Top-k (slides 29–32) | Sample only from the k most probable words | k=1 is greedy and k=V is pure sampling; with a peaked distribution a large k picks absurd words, with a flat one a small k is too conservative |
| Nucleus / top-p (slides 33–34) | Sample from the small set of words holding most of the probability mass | The slides frame it as top-k that shrinks and expands dynamically |

Slide 22 has a good beam-size example. Given "I mostly eat a fresh and raw diet, so I save on groceries", beam size 1 replies "I love to eat healthy and eat healthy", and larger beams keep producing "What do you do for a living?". The takeaway: **finding a proper beam size is not trivial**.

### Why maximizing probability doesn't work

Slides 24–25 are the turning point of the lecture. Human text has many spikes in per-step probability; text from maximization-based decoding is high and flat. The slides give three reasons:

1. Successful language models rely heavily on attention, which easily learns to amplify a bias toward repetition.
2. Maximization is problematic at high-entropy steps (when many words would fit), regardless of how good the model is.
3. Humans aren't trying to maximize probability; they're trying to achieve goals (citing Goodman 2016).

So you add randomness, and top-k and nucleus sampling look for a balance between diversity and safety. Slide 29 calls that balance an important direction.

## Generation control: temperature and penalties

From slide 35 the lecture shifts angle: encourage what you want, penalize what you don't.

**Temperature** (slide 36) applies a temperature hyperparameter τ to the softmax. Higher temperature flattens the distribution and gives more diversity; lower temperature sharpens it and gives less. The slide is emphatic that **temperature is not a decoding algorithm**. It is a way to control diversity at test time, usable with any decoding algorithm.

**Penalties** (slides 37–38):

- Repetition penalty: discourage repetition. Slide 38 splits it into the two below.
- Frequency penalty: discourage repeating the same word too much.
- Presence penalty: encourage using different words.

Slide 40 adds a detail that is easy to miss. If you feed the model the previous step's **entire distribution** instead of a chosen word, it can blend "happy, want to laugh" and "sad, want to cry" into "happy, want to cry". The slide concludes that distribution input may not suit NLG.

<details>
<summary>How this maps to API parameters</summary>

The slides don't mention any specific API. But if you've used an LLM service, the temperature, frequency penalty, and presence penalty on slides 36–38 are the familiar inference parameter names, and top-k and top-p usually appear under those names too. What the lecture adds is which part of the distribution each knob changes.

</details>

## Evaluating NLG: the output or the model?

Slide 2 of the [NLG Evaluation deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) splits automatic metrics into two kinds and sets the frame first: these metrics evaluate **the outputs**, not the generative model.

- **Word-overlap metrics**: BLEU, ROUGE, METEOR. Not ideal for translation, much worse for summarization, and worse still for open-ended tasks such as dialogue and storytelling.
- **Embedding metrics**: compare word-embedding similarity, capturing semantics more flexibly.

### BLEU and ROUGE

The comparison from slides 3–5:

| | BLEU | ROUGE |
|---|---|---|
| Basis | n-gram overlap | n-gram overlap |
| Emphasis | precision | recall |
| Reported as | one number (combining n = 1–4) | separately per n-gram: ROUGE-1, ROUGE-2, ROUGE-L (longest common subsequence) |
| Typical use | machine translation | summarization |

<details>
<summary>How BLEU is built (per slide 3)</summary>

- n-gram precision p_n: count each n-gram in the output, clip it to its highest count in any reference, and divide by the total number of output n-grams.
- Brevity penalty B: if the output is shorter than the reference, B = e^(1 − ref/hyp); otherwise B = 1. This stops a model from gaming precision with a few safe words.
- BLEU = B × exp((1/N) Σ log p_n): the geometric mean of the n-gram precisions times the length penalty.

</details>

Slide 7 shows a plot where automatic scores and human scores of dialogue quality **do not agree**. Slide 8 therefore suggests scoring single aspects: fluency (probability under a well-trained LM), style (an LM trained on the target corpus), diversity (rare words, unique n-grams), relevance to the input, simple things like length and repetition, and task-specific metrics such as compression rate for summarization.

### Perplexity

Slides 9–10: perplexity measures how confused a language model is when predicting a sentence. It is the inverse probability of the test set, normalized by the number of words. A better LM predicts an unseen test set better, so its perplexity is lower. Slide 10 ties it to cross-entropy, the distance between the true and predicted distributions.

Unlike BLEU and ROUGE, **perplexity evaluates the probabilistic generative model itself**. The summary on slide 22 calls these output evaluation and model evaluation.

### LLM-Eval

Slides 11–12 present [LLM-Eval](https://arxiv.org/abs/2305.13711) by Yen-Ting Lin and Yun-Nung Chen (NLP4ConvAI 2023), which uses an LLM to score open-domain dialogue responses. The slides make two points: LLM-Eval correlates with human judgments better than all existing metrics, and it works for both single-turn and multi-turn dialogue. So LLM-Eval scores can serve as a proxy for human evaluation.

For a fuller discussion of LLM-as-judge biases, see the site's [CME295 LLM evaluation post](/posts/ai/2026-09-29-cme295-llm-evaluation-en).

## RL for NLG: optimize the whole sentence

The second half of the evaluation deck returns to training. Slide 14 poses the problem: **minimizing per-word cross-entropy is not the same as producing the best sentence**. The reference is "The dog is running fast" and the model outputs "The dog is is fast". Cross-entropy penalizes only the one wrong step, but the sentence is already broken. We want to optimize a sentence-level criterion R(y, ŷ), and you can't run gradient descent on that directly.

Slides 15–18 answer with reinforcement learning. Each generated word is an action, earlier words shape the next observation, and the reward (say, a score against the reference) arrives only when the sentence is finished. The slides cite [Ranzato et al.'s Sequence Level Training](https://arxiv.org/abs/1511.06732) (ICLR 2016) and put scheduled sampling and RL side by side in one figure.

The summarization result on slide 19 is worth remembering. Optimizing ROUGE-L with RL alone gives higher automatic scores but **lower human scores**; MLE plus RL does best. Slide 22 turns it into one line of advice: MLE first, RL later.

Slides 20–21 connect this to ChatGPT's RLHF. The reward is no longer ROUGE but a score from people, which lets RL optimize an abstract target like human satisfaction. The full RLHF pipeline is in the series' [post-training post](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en).

## How to self-study this lecture

1. Start with 9.2 and 9.3, reading the example continuations for the five decoding methods on slides 17–34 side by side. It's the most memorable part of the lecture.
2. Take any open LM, fix one prompt, and run greedy, beam, top-k, and top-p. Note where repetition shows up and where the text drifts off topic.
3. Then reread slides 14 and 19 and work out why "every word right" and "the whole sentence good" are different things.

One thing you can do tonight: pick a generation feature you use often, write down its current temperature and top-p, and judge from slide 29's diversity-versus-safety angle whether those settings fit the task.

## Further reading

- [CS224N Lecture 11: Why Benchmarks and LLM Evaluation Go Stale](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en): evaluation from the benchmark side.
- [CME295 Lecture 8: LLM-as-judge and three biases to guard against](/posts/ai/2026-09-29-cme295-llm-evaluation-en)
- [CME295 Lecture 5: RLHF and DPO](/posts/ai/2026-09-29-cme295-preference-tuning-en): the modern continuation of RL for NLG.

Previous: [RAG + HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en)
Next: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 10/27 schedule row
- [NLG Decoding slides (251027_NLG.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf) — teacher forcing, exposure bias, the five decoding methods, and generation control
- [NLG Evaluation slides (251027_NLGEval.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) — BLEU, ROUGE, perplexity, LLM-Eval, RL for NLG
- [ADL 9.1: Natural Language Generation (YouTube, in Mandarin)](https://youtu.be/1d9WhPS6gv8)
- [ADL 9.2: Decoding Algorithms (YouTube, in Mandarin)](https://youtu.be/agHrC93u7w8)
- [ADL 9.3: Generation Control (YouTube, in Mandarin)](https://youtu.be/Jxg6MLpgKPM)
- [ADL 9.4: NLG Evaluation (YouTube, in Mandarin)](https://youtu.be/gAsEAga1icM)
- [ADL 9.5: RL for NLG (YouTube, in Mandarin)](https://youtu.be/Ly67whCaS4M)
- [Bengio et al., Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks (2015)](https://arxiv.org/abs/1506.03099)
- [Holtzman et al., The Curious Case of Neural Text Degeneration (ICLR)](https://arxiv.org/abs/1904.09751)
- [Ranzato et al., Sequence Level Training with Recurrent Neural Networks (ICLR 2016)](https://arxiv.org/abs/1511.06732)
- [Lin & Chen, LLM-Eval: Unified Multi-Dimensional Automatic Evaluation for Open-Domain Conversations with Large Language Models (NLP4ConvAI 2023)](https://arxiv.org/abs/2305.13711)
