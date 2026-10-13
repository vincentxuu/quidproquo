---
title: "Decoding, Generation Control, and Evaluation for NLG | NTU Yun-Nung Chen Applied Deep Learning Lecture 9"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, decoding, llm-evaluation]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 10
tldr: "Lecture 9 of ADL Fall 2025 answers two questions. The model gives you a probability distribution at every step, so how do you pick a word from it? And once you have a sentence, how do you judge it? The slides start with teacher forcing and exposure bias to show the gap between training and generation, then compare greedy, beam search, sampling, top-k, and nucleus sampling, and file temperature and the penalties under 'control' rather than decoding algorithms. The evaluation half covers BLEU, ROUGE, perplexity, and LLM-Eval, then explains why you would use RL to optimize whole-sentence quality directly."
description: "A guide to the 10/27 NLG Decoding and NLG Evaluation slides and videos 9.1–9.5 of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): conditional LMs, teacher forcing, exposure bias, scheduled sampling, greedy / beam / sampling / top-k / nucleus, temperature, repetition / frequency / presence penalties, BLEU, ROUGE, perplexity, LLM-Eval, and RL for NLG and RLHF. Includes hand-computed examples for decoding, BLEU / ROUGE, and perplexity, and a self-check."
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
    context: "Slide 9 of the NLG Evaluation deck stresses that it evaluates the generative model itself, not any single output."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 9 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) taught this lecture on 10/27, right after midterm week. The [course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) marks that week as Virtual.

**Sources**: two slide decks, [NLG Decoding (251027_NLG.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLG.pdf) (41 pages) and [NLG Evaluation (251027_NLGEval.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) (22 pages), plus five videos: [9.1 Natural Language Generation](https://youtu.be/1d9WhPS6gv8) (28:20), [9.2 Decoding Algorithms](https://youtu.be/agHrC93u7w8) (28:34), [9.3 Generation Control](https://youtu.be/Jxg6MLpgKPM) (17:57), [9.4 NLG Evaluation](https://youtu.be/gAsEAga1icM) (32:41), and [9.5 RL for NLG](https://youtu.be/Ly67whCaS4M) (15:27). The videos are taught in Mandarin; the slides are in English. All page numbers below refer to the PDFs.

> **Version note**: The slide cover says October 27th, 2025. The five videos were uploaded to the Fall 2025 playlist on 2025/10/27, but their descriptions carry the date 2023/10/26, and 9.1, 9.2, 9.3, and 9.5 credit the slides to Hung-Yi Lee. The homework mentioned in the videos (practicing decoding with a pretrained T5) belongs to the semester in which they were recorded. I did not compare the video frames against the 2025 slides page by page; where they differ, this post follows the slides.

**Series**: Previous: [RAG + HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) | Next: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

The earlier lectures taught a model to learn a distribution over the next word. This one deals with what happens after training: you have the distribution, so **which word do you actually output**? And **how do you tell whether the resulting text is any good**?

There is no homework attached to this lecture. The series-wide [access grade](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) is A2, and this lecture has no gaps of its own: slides and videos are all public. The TA session from the same week, LLM Inference & Evaluation, is covered in the series' [TA sessions post](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en).

After this lecture you should be able to do four things: describe the gap that teacher forcing creates and why it is not serious for LLMs; pick words for a small example with greedy, beam search, top-k, and nucleus sampling; say what temperature changes and what it does not; and tell output-level metrics such as BLEU and ROUGE from the model-level metric perplexity, computing each once by hand. Examples marked "made up for this post" are not from the lecture.

## From language models to conditional LMs

Slide 3 lists tasks that involve generation: machine translation, abstractive summarization, dialogue, image captioning, and creative writing. Slides 4–7 fold them into one problem.

- **Language model**: predict the next word given the words so far, P(y_i | y_1, …, y_{i−1}). An RNN-LM models this distribution with an RNN; GPT does it with a Transformer.
- **Conditional LM**: add an input x and predict P(y_i | y_1, …, y_{i−1}, x). For translation x is the source sentence, for summarization the document, for dialogue the context, for captioning the image.

Slide 7 adds that either an encoder-decoder or a decoder-only architecture can condition on x. Professor Yun-Nung Chen adds that today's prompting is also a conditional LM: when the model generates an answer, the condition is the prompt you gave. Encoder-only models are absent here because they see later words and cannot generate. This is the same idea as the language models in [Lecture 3](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en), with a condition added.

## The train/test gap: exposure bias

**Teacher forcing** (slide 8): during training, feed the gold target to the decoder as the next input, whatever the model predicted. It is the obvious thing to do, but the slide flags the problem right away: training and testing no longer match.

Slides 9–11 use a toy vocabulary of just A and B:

- In training, every input is the reference, and the loss is the sum of per-word cross-entropy.
- In generation, there is no reference, so the model's previous output becomes its next input.

The model never sees, during training, the state that follows its own mistake. The slides call this **exposure bias** and sum it up with a Chinese saying: one wrong step, every step wrong. Once a step goes off, the model walks into paths it has never explored, and the whole sentence can go wrong.

**Scheduled sampling** (slides 12–13, Bengio et al. 2015) randomly decides during training whether the next input comes from the reference or from the model. She explains how the probability is scheduled: early in training the model cannot generate yet and should mostly be given the reference; later it should increasingly use its own output so that training approaches the test condition. So a decreasing function sets "the probability of using the reference at this step," and it can decay linearly, exponentially, or as an inverse sigmoid. In the MSCOCO captioning results on the slide, this mixed approach beats "always from reference"; "always from model" is much worse, and her explanation is that with no teacher, continuing from outputs the model has not yet learned to produce well rarely goes well.

Slide 14 then notes that **LLM training does not use scheduled sampling**. The reason given: LLM pretraining data is large enough that it already explores far more paths. She calls this an empirical conclusion: even when testing reaches a path never seen, the model can estimate a decent next step from the data it has seen, so exposure bias still occurs but matters little. She adds that scheduled sampling is still worth using when you train a small model yourself.

## Five decoding algorithms

Slide 16 defines the term: with a trained (conditional) LM, a **decoding algorithm** decides how to generate text from it. The slides run every method on the same opening (Dwight gets up, goes downstairs, makes breakfast, looks at the crossword in the paper) and show each continuation, which makes the comparison easy to follow.

| Method | What it does | Problem the slides point out |
|---|---|---|
| Greedy (slides 17–19) | Take the most probable word at each step (argmax) | No backtracking; an unexplored path may have higher total probability. The example produces "The headline read: 'The New York Times.'" three times almost verbatim (the third swaps in "said") |
| Beam search (slides 20–23) | Keep the k most probable sequences at each step | Small beams are ungrammatical; large beams are expensive and make chit-chat generic. The example produces a long string of "New York" |
| Sampling (slides 26–28) | Sample from the distribution instead of taking argmax | The long tail holds many low-probability words, and quality drops there. The example produces lines like "how happy has white rabbit been?" |
| Top-k (slides 29–32) | Sample only from the k most probable words | k=1 is greedy and k=V is pure sampling; with a peaked distribution a large k picks absurd words, with a flat one a small k is too conservative |
| Nucleus / top-p (slides 33–34) | Sample from the small set of words holding most of the probability mass | The slides frame it as top-k that shrinks and expands dynamically |

### Greedy versus beam search with numbers (made up for this post)

The vocabulary has two words, A and B, and generation runs for two steps. The model's probabilities are:

| Generated so far | Next is A | Next is B |
|---|---|---|
| (start) | 0.6 | 0.4 |
| A | 0.55 | 0.45 |
| B | 0.1 | 0.9 |

- **Greedy**: take A at step one (0.6) and A at step two (0.55), giving AA with sequence probability 0.6 × 0.55 = 0.33.
- **Sequence probabilities of the four paths**: AA 0.33, AB 0.27, BA 0.04, BB 0.36. The highest is BB, which greedy never reaches.
- **Beam search, k = 2**: keep both A and B after step one. Step two expands to four paths and keeps the two most probable, BB (0.36) and AA (0.33), and the output is BB.

Greedy picked the locally higher A at step one and could never return to the B path. With a real vocabulary of ten thousand words, ten generated words mean ten thousand to the tenth power paths, which cannot all be checked, so beam search also only tracks a few more.

Slide 22 has a good beam-size example. Given "I mostly eat a fresh and raw diet, so I save on groceries", beam size 1 replies "I love to eat healthy and eat healthy", and larger beams keep producing "What do you do for a living?". The takeaway: **finding a proper beam size is not trivial**.

### Why maximizing probability doesn't work

Slides 24–25 are the turning point of the lecture. Human text has many spikes in per-step probability; text from maximization-based decoding is high and flat. The slides give three reasons:

1. Successful language models rely heavily on attention, which easily learns to amplify a bias toward repetition.
2. Maximization is problematic at high-entropy steps (when many words would fit), regardless of how good the model is.
3. Humans aren't trying to maximize probability; they're trying to achieve goals (citing Goodman 2016).

So you add randomness, and top-k and nucleus sampling look for a balance between diversity and safety.

The trouble with pure sampling lies in the long tail: the vocabulary is large, very improbable words are numerous in total, and once a rare word is drawn, everything after has to continue from it. She uses the character 「縕」 from her own name as an example: draw it, and a fluent continuation is hard to find.

Top-k uses a fixed k, and she shows with two sentences why that falls short:

- "I ate the pizza while it was still ＿": almost only "hot" or "warm" fits, so the distribution is narrow. A large k lets unreasonable words into the draw.
- "She said I never ＿": many words fit, so the distribution is flat. A small k leaves only a few of the most ordinary words.

Nucleus sampling fixes a probability instead: add up words from most to least probable until the sum reaches p, and sample only within that group. The group is small when the distribution is narrow and grows automatically when it is flat.

**Compute it once (made up for this post).** Take p = 0.85.

- Narrow distribution: hot 0.6, warm 0.3, cold 0.05, all other words 0.05 in total. "hot" alone is 0.6, short of 0.85; adding "warm" gives 0.9, which reaches it, so the candidates are just "hot" and "warm." With top-k at k = 4, "cold" and one even less likely word would get in.
- Flat distribution: 10 words at 0.09 each, all other words 0.1 in total. Nine words sum to 0.81, still short; the tenth brings it to 0.9, so there are 10 candidates. With top-k at k = 4, only 4 remain.

## Generation control: temperature and penalties

From slide 35 the lecture shifts angle: encourage what you want, penalize what you don't.

**Temperature** (slide 36) applies a temperature hyperparameter τ to the softmax. Higher temperature flattens the distribution and gives more diversity; lower temperature sharpens it and gives less. The slide is emphatic that **temperature is not a decoding algorithm**. It is a way to control diversity at test time, usable with any decoding algorithm. She adds one point: followed by greedy decoding, changing the temperature is pointless, because the top-scoring word stays the same.

**Compute it once (made up for this post).** Three words have scores (2, 1, 0):

| τ | Probabilities |
|---|---|
| 0.5 | (0.867, 0.117, 0.016) |
| 1 | (0.665, 0.245, 0.090) |
| 2 | (0.506, 0.307, 0.186) |

The ranking is the same under all three settings, and what changes is the gap. Raise it for creative copy, and lower it when you want nearly the same result every time.

**Penalties** (slides 37–38):

- Repetition penalty: discourage repetition. Slide 38 splits it into the two below.
- Frequency penalty: discourage repeating the same word too much.
- Presence penalty: encourage using different words.

She explains why repetition is common: when the input belongs to some topic, the probabilities of topic-related words all rise, so they keep getting drawn. The two penalties share a goal and work in opposite directions. The frequency penalty lowers a word according to how many times it has already appeared; once or twice is fine, and more appearances are penalized more. The presence penalty looks at whether a word has appeared at all and raises the words that have not.

Slide 40 adds a detail that is easy to miss. If you feed the model the previous step's **entire distribution** instead of a chosen word, it can blend "happy, want to laugh" and "sad, want to cry" into "happy, want to cry". The slide concludes that distribution input may not suit NLG.

<details>
<summary>How this maps to API parameters</summary>

Slide 39 shows a screenshot of the OpenAI Playground. Going through it, she says Temperature defaults to 1, which is the plain softmax, and Top P defaults to 1. In the screenshot, Frequency penalty and Presence penalty are both set to 0. The quantities on slides 36–38 are the parameters adjustable on that screen. What the lecture adds is which part of the distribution each knob changes.

</details>

## Evaluating NLG: the output or the model?

Slide 2 of the [NLG Evaluation deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251027_NLGEval.pdf) splits automatic metrics into two kinds and sets the frame first: these metrics evaluate **the outputs**, not the generative model.

- **Word-overlap metrics**: BLEU, ROUGE, METEOR. Not ideal for translation, much worse for summarization, and worse still for open-ended tasks such as dialogue and storytelling.
- **Embedding metrics**: compare word-embedding similarity, capturing semantics more flexibly. The approach she describes is to feed both sentences into BERT and compare how close the resulting vectors are.

Both kinds share one weakness, treating the reference as the only standard. As she puts it, a summary that differs from the expert's is not thereby bad, and for dialogue any reasonable response is fine. Being unlike the reference does not mean poor, and being like it does not mean good.

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
- Brevity penalty B: if the output is shorter than the reference, B = e^(1 − ref/hyp); otherwise B = 1. (The point is to stop a model from gaming precision with a few safe words; this gloss is added by this post and is not on the slide.)
- BLEU = B × exp((1/N) Σ log p_n): the geometric mean of the n-gram precisions times the length penalty. The formula printed on slide 3 has no log; this is the standard definition.

</details>

**By hand (made up for this post).** The reference is "the cat is on the mat" (6 words) and the model outputs "the cat sat on mat" (5 words).

- Overlapping unigrams: the, cat, on, mat, 4 in total.
- Unigram precision (the direction BLEU uses): 4 ÷ 5 = 0.8, with the output length as the denominator.
- ROUGE-1 (recall): 4 ÷ 6 ≈ 0.67, with the reference length as the denominator.
- Bigrams: the output has four (the cat, cat sat, sat on, on mat), and only "the cat" appears in the reference. Precision is 1 ÷ 4 = 0.25. The reference has 5 bigrams, so ROUGE-2 is 1 ÷ 5 = 0.2.
- The output is shorter than the reference, so the brevity penalty is e^(1 − 6/5) ≈ 0.82.
- Full BLEU uses n = 1 to 4. These sentences share no trigram or 4-gram, so BLEU is 0. Short sentences easily end up this way, and BLEU is normally computed over a whole test set.

For the same output, precision is 0.8 and recall is 0.67. Most of its words are supported, and it leaves out things that are in the reference.

Slide 7 shows a plot where automatic scores and human scores of dialogue quality **do not agree**. She fills in the other half of the figure: some suspected that human ratings themselves were too noisy, but when the same data was rated by two different groups of people, the two groups' scores were positively correlated. People agree with one another, and automatic metrics fail to reflect it. Later papers therefore add a user study with human raters on top of automatic metrics.

Slide 8 suggests scoring single aspects instead: fluency (probability under a well-trained LM), style (an LM trained on the target corpus), diversity (rare words, unique n-grams), relevance to the input, simple things like length and repetition, and task-specific metrics such as compression rate for summarization.

### Perplexity

Slides 9–10: perplexity measures how confused a language model is when predicting a sentence. It is the inverse probability of the test set, normalized by the number of words. A better LM predicts an unseen test set better, so its perplexity is lower. Slide 10 ties it to cross-entropy, the distance between the true and predicted distributions.

**Compute it once (made up for this post).** A test sentence has 3 tokens, and the model assigns them probabilities 0.5, 0.25, and 0.125 in turn. The sentence probability is 1/64. Perplexity is (1/64)^(−1/3) = 4. In cross-entropy terms: the −log₂ of the three tokens are 1, 2, and 3, averaging 2 bits, and 2² is also 4. Intuitively, at each step this model is guessing among about 4 options.

Unlike BLEU and ROUGE, **perplexity evaluates the probabilistic generative model itself**, and lower is better. The model is not asked to generate; you compute how much probability it gives to the real sentences in the test set. The summary on slide 22 calls these output evaluation and model evaluation.

### LLM-Eval

Slides 11–12 present [LLM-Eval](https://arxiv.org/abs/2305.13711) by Yen-Ting Lin and Yun-Nung Chen (NLP4ConvAI 2023), which uses an LLM to score open-domain dialogue responses. The slides make two points: LLM-Eval correlates with human judgments better than all existing metrics, and it works for both single-turn and multi-turn dialogue. So LLM-Eval scores can serve as a proxy for human evaluation. "Better than all existing metrics" is the slide's conclusion; talking through the table, she says most of the higher scores, the ones that correlate better with humans, come from the LLM. She adds two more observations: asking the LLM for a 0–5 score or a 0–100 score gives slightly different results, and for dialogue, showing it a human reference response or not makes little difference. She also says it is not perfect, only closer to human judgment than earlier automatic metrics.

For a fuller discussion of LLM-as-judge biases, see the site's [CME295 LLM evaluation post](/posts/ai/2026-09-29-cme295-llm-evaluation-en).

## RL for NLG: optimize the whole sentence

The second half of the evaluation deck returns to training. Slide 14 poses the problem: **minimizing per-word cross-entropy is not the same as producing the best sentence**. The reference is "The dog is running fast" and the model outputs "The dog is is fast". Cross-entropy penalizes only the one wrong step, but the sentence is already broken. We want to optimize a sentence-level criterion R(y, ŷ), and you can't run gradient descent on that directly.

She explains the reinforcement learning setup with a shooting game: at each step you see the screen and choose an action without necessarily knowing whether it was good, and the score comes only when an alien is hit. Go is more extreme, with the result known only at the end.

Slides 15–18 answer with reinforcement learning. Each generated word is an action, earlier words shape the next observation, and the reward (say, a score against the reference) arrives only when the sentence is finished. The slides cite [Ranzato et al.'s Sequence Level Training](https://arxiv.org/abs/1511.06732) (ICLR 2016) and put scheduled sampling and RL side by side in one figure.

The summarization result on slide 19 is worth remembering. Optimizing ROUGE-L with RL alone gives higher automatic scores but **lower human scores**; MLE plus RL does best. Slide 22 turns it into one line of advice: MLE first, RL later.

Slides 20–21 connect this to ChatGPT's RLHF. The reward is no longer ROUGE but a score from people, which lets RL optimize an abstract target like human satisfaction. People cannot give feedback continuously, so a reward model that imitates human feedback is learned first and then optimized with an algorithm such as PPO. She says ChatGPT's answers often sound well-argued because it learned that people like such answers. The full RLHF pipeline is in the series' [post-training post](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en).

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"Picking the most probable word at every step gives the most probable sentence."** In the example above greedy gets 0.33 and the best is 0.36.
- **"A larger beam size is always better."** Larger beams cost more time, and in chit-chat they pick sentences such as "What do you do for a living?" that fit anywhere and ignore the input.
- **"Temperature is a decoding method."** It only makes the distribution sharper or flatter, and the decoding algorithm still chooses the word. With greedy decoding it has no effect at all.
- **"A high BLEU means good generation."** On open-ended tasks such as dialogue, automatic scores and human ratings do not agree.
- **"Perplexity, like BLEU, is better when higher."** Lower perplexity is better, and it evaluates the model, not one generated output.
- **"Pushing ROUGE up directly with RL gives the best summarizer."** The RL-only model has the highest ROUGE-1 and ROUGE-L and a lower human rating. MLE followed by RL does best.

## Self-check

The questions were written for this post.

**1. Training uses teacher forcing and the reference is A B B. At test time the model outputs B at step one. What is the input at step two, and what problem does this cause?**

The input is the B the model itself produced, because no reference exists at test time. In training the model only saw what follows "A first," so the path after B was never practiced and later steps may keep going wrong. This is exposure bias.

**2. Using the A/B probability table above with beam size 1, what is the output?**

Beam size 1 is greedy, so the output is AA with probability 0.33.

**3. The next-word distribution is a 0.5, b 0.2, c 0.15, d 0.1, e 0.05. Which words do top-k (k = 2) and nucleus (p = 0.8) each sample from?**

Top-k takes a and b. Nucleus adds from the top: 0.5, 0.7, 0.85, and exceeds 0.8 only at c, so it samples from a, b, and c.

**4. The scores are (2, 1, 0) and temperature goes from 1 to 2. How does the top word's probability change? With greedy decoding, does the output change?**

It falls from 0.665 to 0.506, and the distribution flattens. With greedy the output is unchanged, because the ranking is unchanged.

**5. The reference is "I am very happy today" and the model outputs "I am happy". What are unigram precision and ROUGE-1 recall?**

All three output words appear in the reference, so precision is 3 ÷ 3 = 1. Three of the reference's five words are covered, so recall is 3 ÷ 5 = 0.6.

**6. A model assigns probabilities 0.5 and 0.5 to a 2-token test sentence. What is the perplexity? Another model assigns 0.25 and 0.25. Which model is better?**

The first is (0.25)^(−1/2) = 2 and the second is (0.0625)^(−1/2) = 4. The first, with the lower perplexity, is better.

**7. Hands-on: with any open-source language model and one fixed prompt, run greedy, beam search, pure sampling, top-k, and top-p. What should you expect?**

Greedy and beam search tend to repeat the same passage, pure sampling occasionally drifts off topic, and top-k and top-p fall in between.

## Further reading

- [CS224N Lecture 11: Why Benchmarks and LLM Evaluation Go Stale](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en): evaluation from the benchmark side.
- [CME295 Lecture 8: LLM-as-judge and three biases to guard against](/posts/ai/2026-09-29-cme295-llm-evaluation-en): the details of LLM-as-judge.
- [CME295 Lecture 5: RLHF and DPO](/posts/ai/2026-09-29-cme295-preference-tuning-en): the modern continuation of RL for NLG.

Previous: [RAG + HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en)
Next: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=1d9WhPS6gv8
title: ADL 9.1: Natural Language Generation (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=agHrC93u7w8
title: ADL 9.2: Decoding Algorithms (YouTube, in Mandarin)
```

Original videos: [ADL 9.1: Natural Language Generation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=1d9WhPS6gv8), [ADL 9.2: Decoding Algorithms (YouTube, in Mandarin)](https://www.youtube.com/watch?v=agHrC93u7w8), [ADL 9.3: Generation Control (YouTube, in Mandarin)](https://www.youtube.com/watch?v=Jxg6MLpgKPM), [ADL 9.4: NLG Evaluation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=gAsEAga1icM), [ADL 9.5: RL for NLG (YouTube, in Mandarin)](https://www.youtube.com/watch?v=Ly67whCaS4M)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): all five videos (9.1–9.5) were worked from their captions. All five were uploaded on 2025-10-27 with descriptions dated 2023/10/26; 9.1, 9.2, 9.3, and 9.5 credit Hung-Yi Lee for the slides.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed 9.1 and 9.2 match the article; the version note (uploaded 2025-10-27, description dated 2023/10/26) is accurate.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Added explanations from the spoken content of the five videos, hand-computed examples for greedy / beam search, nucleus sampling, temperature, BLEU / ROUGE, and perplexity, common misreadings, and a self-check with answers.

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
