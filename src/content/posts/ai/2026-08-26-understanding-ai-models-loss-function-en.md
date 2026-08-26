---
title: "How a Model Knows It's Wrong: Loss Functions and Cross-Entropy"
date: 2026-08-26
category: ai
type: deep-dive
tags: [loss-function, cross-entropy, perplexity, ai-model, training, nlp]
lang: en
series:
  name: "認識 AI 模型"
  order: 4
tldr: "Every time a model predicts the next token, it assigns a probability to every candidate word. A loss function measures how far that probability distribution is from the correct answer — the further off, the higher the loss, the more the model knows it got it wrong. Cross-entropy is the standard formula; perplexity is its human-readable translation."
description: "Loss function primer: how cross-entropy measures the gap between a model's predictions and the right answer, what perplexity means intuitively, and why this is where model training begins."
draft: false
glossary:
  - term: "Cross-Entropy"
    def: "A metric that measures the divergence between two probability distributions — the most common loss function for language models"
  - term: "Perplexity"
    def: "The exponential of cross-entropy loss — a perplexity of k means the model is, on average, as uncertain as picking randomly from k choices"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-loss-function)

You tell ChatGPT "The capital of Taiwan is" and it replies "Taipei." Obvious, right? But how does the model know "Taipei" is correct and "Kaohsiung" is wrong? More fundamentally: during training, how does the model know it made a mistake — and how bad that mistake was?

The answer is a **loss function** — a scoring formula that runs after every prediction and tells the model "here's how far off you were."

## The Guessing Game

Imagine a number-guessing game. I think of a number from 1 to 10, and you guess.

If you say "I'm 100% sure it's 7" and the answer is 7 — your confidence matches reality perfectly. Best possible score.

If you say "I'm 100% sure it's 7" and the answer is 3 — you weren't just wrong, you were supremely confident and wrong. That's far worse than "Maybe 7? I'm not really sure."

That's what a loss function does: it doesn't just check right vs. wrong. It checks **how confidently wrong** you were. The more confident the wrong prediction, the higher the loss.

## What Is a Language Model Predicting?

Back to language models. As covered in earlier posts in this series, a model predicts one token at a time. Given "The capital of Taiwan is," the model doesn't output the word "Taipei" — it outputs a **probability distribution** over every token in its vocabulary:

| Token    | Model's probability |
|----------|---------------------|
| Taipei   | 0.85                |
| Kaoh     | 0.05                |
| Tai      | 0.03                |
| the      | 0.01                |
| …        | …                   |

The training data says the correct next token is "Taipei." The correct distribution is: "Taipei" = 1, everything else = 0.

The loss function's job: **compare the model's distribution to the correct distribution and compute a distance.**

## Cross-Entropy: The Standard Formula

The loss function used by language models is called **cross-entropy**.

Intuitively, cross-entropy asks one question: **how much probability did the model assign to the correct answer?**

If the model gave the correct answer 0.85 probability, loss is low — it mostly got it right. If the model gave the correct answer 0.01 probability, loss is high — it barely considered the right answer at all.

<details>
<summary>The cross-entropy formula</summary>

For a single token prediction, the cross-entropy loss is:

```
L = -log(p)
```

where `p` is the probability the model assigned to the correct answer.

Why `-log`?

- When `p = 1` (perfect prediction), `-log(1) = 0`. Zero loss.
- When `p = 0.5`, `-log(0.5) ≈ 0.693`.
- When `p = 0.01`, `-log(0.01) ≈ 4.605`.
- When `p → 0`, `-log(p) → ∞`.

`-log` amplifies near-zero probabilities into near-infinite loss — it heavily punishes predictions that are confidently wrong about the correct answer.

The full cross-entropy formula over the entire distribution:

```
H(P, Q) = -Σ P(x) × log Q(x)
```

where `P` is the true distribution (one-hot) and `Q` is the model's predicted distribution. Since `P(x)` is 1 only for the correct answer and 0 everywhere else, the sum collapses to just `-log(p)`.

</details>

### A Worked Example

Suppose the model sees "The weather today is really" and predicts the next token. The vocabulary has only four tokens: nice, hot, cold, bad. The training data says the correct answer is "nice."

Model A's prediction:

| Token | Probability |
|-------|-------------|
| nice  | 0.70        |
| hot   | 0.15        |
| cold  | 0.10        |
| bad   | 0.05        |

Model A's loss = `-log(0.70) ≈ 0.357`

Model B's prediction:

| Token | Probability |
|-------|-------------|
| nice  | 0.10        |
| hot   | 0.30        |
| cold  | 0.30        |
| bad   | 0.30        |

Model B's loss = `-log(0.10) ≈ 2.303`

Model B's loss is 6.4x higher than Model A's. Model B didn't just get it wrong — it spread its probability across wrong answers and barely gave the correct answer a chance. The loss function captures this gap precisely.

## Perplexity: Making Loss Human-Readable

Raw cross-entropy values (0.357, 2.303) aren't very intuitive. Researchers invented **perplexity** to translate them into something concrete.

Perplexity is simply the exponential of cross-entropy loss:

```
Perplexity = e^(cross-entropy loss)
```

Using our examples:

- Model A: perplexity = e^0.357 ≈ **1.43**
- Model B: perplexity = e^2.303 ≈ **10.0**

The intuitive meaning of perplexity: **on average, how many choices is the model deciding between?**

Model A's perplexity of 1.43 means it has nearly locked onto the right answer — it's choosing between fewer than two options. Model B's perplexity of 10 means it's as lost as if it were randomly guessing among 10 equally likely choices.

When a paper says "GPT-4 achieves a perplexity of 8 on WikiText-103," it means: **on average, when predicting each token, the model is as uncertain as choosing from 8 equally probable options.** Lower perplexity = more confident model.

<details>
<summary>Formal perplexity definition</summary>

For a sequence of N tokens, perplexity is:

```
PP = e^( -(1/N) × Σ log p(token_i) )
```

This is the exponential of the average per-token cross-entropy loss. Normalizing by N makes perplexity comparable across texts of different lengths — it always represents "on average, how many options is the model choosing from."

</details>

## Loss Is Where Training Starts, Not Where It Ends

The loss function tells the model "how wrong you are," but it doesn't fix anything by itself. It's just a score.

Like an exam grade tells you how well you did but doesn't automatically make you better — you still need the "review mistakes and practice" step. In model training, that step is called **gradient descent** — and that's the topic of the next post.

The loss function's role is to **provide clear, quantifiable feedback**. Without it, the model is like a student who never gets told whether their answers are right or wrong — no matter what it predicts, there's no signal to learn from. With cross-entropy loss, the model gets precise feedback on every single token prediction.

That's where training begins.

## References

- [Stanford CS109 — Lecture 18: Information Theory](https://web.stanford.edu/class/cs109/) — Mathematical foundations of entropy and cross-entropy
- [Stanford CS109 — Lecture 5: Random Variables & Expectation](https://web.stanford.edu/class/cs109/) — Probability fundamentals, including the expected value concepts underlying loss functions
- [Hugging Face — Perplexity of Fixed-length Models](https://huggingface.co/docs/transformers/en/perplexity) — Practical guide to computing language model perplexity
