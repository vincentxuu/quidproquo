---
title: "Harvard CS181 HW4 (Part 1): Transformers, From Hand-Computed Attention to Multi-Head"
date: 2026-09-29
category: tech
tags: [harvard, cs181, transformer, self-attention, attention, homework]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 6
type: guide
tldr: "HW4 Problem 1 (40 pts) takes self-attention apart in five steps: a 2×2 hand calculation, why we divide by √dk, permutation equivariance without positional encoding, single-head attention in pure NumPy, and multi-head attention in PyTorch with an attention heatmap on synthetic data."
description: "A problem-by-problem guide to Harvard CS1810 Spring 2026 HW4 Problem 1: scaled dot-product attention by hand, the variance argument for √dk, permutation equivariance and positional encodings, a NumPy self-attention implementation, and multi-head attention, cross-referenced with Section 6 notes."
draft: false
glossary:
  - term: "permutation equivariance"
    definition: "If the input order is shuffled, the output is shuffled in exactly the same way, with its content unchanged."
    context: "Self-attention without positional encoding has this property, so it cannot tell word order apart."
  - term: "scaled dot-product attention"
    definition: "Score each query–key pair by their dot product divided by √dk, turn scores into weights with a row-wise softmax, then take the weighted average of the values."
    context: "The core formula of HW4 Problem 1: softmax(QKᵀ/√dk)V."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> ⚠️ **Version and access**: Based on [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4) (`hw4_release.tex/pdf/ipynb`, due 2026-04-03) and the [Section 6 notes](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf), all opened on 2026-09-29. The course as a whole is **A3** (homework, notebooks, sections and section solutions are public), but there are no recordings for the current term, no homework solutions, and Gradescope requires enrollment. The [official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) says slides live in a Google Drive folder, but the CSV export carries no links. I did not get the 2026 Transformers lecture slides, so this post makes no claims about what was said in lecture.

This is post 6 of the [Harvard CS181 weekly guide](/posts/tech/2026-08-27-harvard-cs181-overview-en). The previous post is the [midterm checkpoint](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint-en); this one opens HW4, the first assignment after the midterm.

## Course video sources

Checked the official CS1810 Spring 2026 schedule and syllabus. This guide uses homework, section, or exam materials; the corresponding entries do not list a public lecture video. Slides and section materials are provided. No public listing does not mean that a recording never existed.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## Where HW4 sits in the term

Per the [2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ), Week 6 covered Representation Learning / Autoencoders on Tuesday and Transformers on Thursday (March 5). The midterm was March 10, and Non-parametric Models / Decision Trees followed on March 12. HW4 was released after spring break on March 23 and due April 3. The matching section is **Section 6: Transformers, Autoencoders, Decision Trees**, the week of March 24.

The [HW4 handout](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex) is titled "Representation Learning, Transformers, and Non-parametric methods" and has three problems. This series splits them into three posts:

| Post | Problem | Points |
|---|---|---|
| This post | Problem 1 Understanding the Transformer | 40 |
| [HW4 (Part 2)](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en) | Problem 2 Autoencoders | 76 per header |
| [HW4 (Part 3)](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en) | Problem 3 Decision Trees, RF, MoE | no total in header |

The five parts of Problem 1 form one arc: compute attention once on the smallest possible matrices, question two design choices (why scale, why add position), then turn it into code and extend it to multiple heads.

## (a) 10 pts: a 2×2 hand calculation

You get `T = 2` tokens with dimension `d = 2`. `X` is the identity matrix, and you are given three 2×2 weight matrices `W_Q`, `W_K`, `W_V`. Compute `Q`, `K`, `V`, the raw score matrix `S = QKᵀ`, then divide by `√dk` and apply a row-wise softmax to get the attention matrix `A`.

Notice this first: **since `X` is the identity, `Q = W_Q`, `K = W_K`, `V = W_V`**. That step is free. The only real work is `QKᵀ` and two rows of softmax. Leaving answers in terms of `e^(·)` is allowed.

You can check yourself in the notebook. `hw4_release.ipynb` has a cell titled "Verification: Updated Part (a) Hand Calculation" that prints `Q`, `K`, `V`, raw scores, scaled scores and attention weights for the same matrices. Work it by hand first, then run the cell. Doing it the other way round teaches you nothing.

## (b) 5 pts: why divide by √dk

Assume each entry of `q` and `k` is independent with mean 0 and variance 1. You need to:

1. Compute the mean and variance of `qᵀk = Σ qᵢkᵢ`
2. Say what happens to its magnitude as `dk` grows, and whether the softmax becomes flatter or peakier
3. Show that after dividing by `√dk` the variance is 1 regardless of `dk`

The intuition: the dot product sums `dk` terms, so more terms means a wider spread. [Section 6](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) §1.4 puts it this way: large logits make the softmax very peaked, and a very peaked softmax has tiny gradients almost everywhere. Dividing by `√dk` keeps the typical logit scale constant across dimensions and prevents premature softmax saturation.

<details>
<summary>Proof skeleton (just the properties you need)</summary>

- Each term `qᵢkᵢ`: independent with mean 0, so `E[qᵢkᵢ] = E[qᵢ]E[kᵢ] = 0`
- `Var(qᵢkᵢ) = E[qᵢ²kᵢ²] − 0 = E[qᵢ²]E[kᵢ²]`, and both factors equal 1
- The terms are independent, so variances add, which gives the relationship with `dk`
- Scaling: `Var(c·Y) = c²·Var(Y)`, with `c = 1/√dk`

</details>

## (c) 5 pts: permutation equivariance and positional encoding

`P_σ` is a permutation matrix. Show that without positional encoding:

```text
Attention(P_σ X) = P_σ Attention(X)
```

The hint gives the route. After left-multiplying by `P_σ`, you get `P_σ Q`, `P_σ K`, `P_σ V`. The score matrix becomes `P_σ S P_σᵀ`. A row-wise softmax doesn't care if rows and columns are reordered together. Chain those three steps and you have the proof.

The follow-ups ask why this hurts language modeling ("dog bites man" and "man bites dog" produce the same bag of representations), and why adding a positional encoding `X' = X + PE` breaks the symmetry (`PE` is tied to positions, so it does not move when `X` is shuffled).

Watch the terminology. Section 6 §1.9 says "self-attention alone is **permutation-invariant**", while the homework asks you to prove **equivariance**. The difference is in the output. Each token's output moves along with the input: that is equivariance. Only if you then pool all tokens into one vector (mean or sum) does the result stay identical, which is invariance. Use the homework's definition in your write-up.

The notebook's `TinyTransformerClassifier` shows the fix in practice: it adds a learned `position_embedding` to the token embedding.

## (d) 10 pts: single-head attention in pure NumPy

The signature is given: `self_attention(X, W_Q, W_K, W_V)` returns `output` (`T × dv`) and `weights` (`T × T`). **NumPy only**: no PyTorch or sklearn implementations.

The notebook's TODO lists five steps: project to `Q/K/V` → `S = QKᵀ` → multiply by `1/√dk` → numerically stable row-wise softmax → multiply by `V`.

The one trap is the softmax. The hint says to subtract each row's max before exponentiating, which leaves the result unchanged but avoids overflow in `exp`. Common bugs are subtracting the max of the whole matrix, or forgetting `axis=-1, keepdims=True` on the `max`, so the broadcast goes the wrong way. The notebook has two hidden test cases that compare outputs and weights with `atol=1e-10`, so any wrong step fails.

## (e) 10 pts: multi-head attention and the heatmap

With `h` heads, each head has its own `W_Q⁽ⁱ⁾`, `W_K⁽ⁱ⁾`, `W_V⁽ⁱ⁾`, with `dk = dv = d/h`. Head outputs are concatenated and multiplied by `W_O`. Section 6 §1.6 explains why: one attention map can only express one notion of relevance at a time, and multiple heads give the model several notions in parallel before recombining them.

This part switches to PyTorch, and the TODO prescribes the approach. `W_Q`, `W_K`, `W_V`, `W_O` are all bias-free `nn.Linear` layers from `d_model` to `d_model`, and **heads are split by reshaping** (`.view` then `.transpose` into `(B, num_heads, T, d_k)`), not by building `h` small linear layers. That's the standard practical pattern and also where people get stuck: get the transpose order wrong once and the tests fail.

Then plug it into `TinyTransformerClassifier` (one layer, `d_model=32`, `num_heads=4`) and train for 10 epochs on synthetic data. The data is simple. Each sequence starts with `[CLS]`, followed by 5 positions filled with noise tokens `NOISE_A` / `NOISE_B`. One random position holds `VAL0` or `VAL1`, which determines the label. The classifier reads only the `[CLS]` representation.

You must attach one learned attention heatmap and describe what the model attends to. The notebook suggests the `[CLS]` row is the most useful view. If training worked, `[CLS]` should put most of its weight on the `VAL0/VAL1` position, since that is the only informative token.

## How this connects to LLMs

Every time you send a prompt to an LLM, each layer runs the operation from (d): every token matches its query against all keys and takes a weighted average of the values. Section 6 frames this as a "learned similarity" function, the same idea as the kernels in HW1 and HW3, except the similarity itself is trained.

HW4 Problem 1 does not cover causal masking, KV caching, or the cost of long contexts. Those show up in the HW6 autoregressive models problem.

## Further reading

Other courses approach the same topic from different angles:

- [CS224N Lecture 5: from recurrence to Transformers](/posts/ai/2026-08-22-cs224n-transformers-en): motivates attention from the limits of RNNs, with an NLP focus
- [CME295 Lecture 1: from tokens to Transformers](/posts/ai/2026-09-29-cme295-transformer-en): follows one example sentence through tokenization, attention, and encoder-decoder
- [CS336 Lecture 4: attention alternatives and MoE](/posts/ai/2026-08-22-cs336-attention-moe-en): linear attention, sparse attention, and MoE, with a systems and cost focus

## Next

[HW4 (Part 2): why autoencoders can't generate, and what VAEs add](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en). We move from "every token looks at every other token" to "squeeze an image through a narrow latent and rebuild it".

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-read the official schedule and syllabus; they still list no public lecture video for this topic.

## References

- [CS1810 Spring 2026 HW4 handout hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 notebook hw4_release.ipynb](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.ipynb)
- [CS1810 Spring 2026 HW4 handout PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.pdf)
- [CS1810 Spring 2026 Section 6: Transformers and Decision Trees](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) ([solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf))
- [CS1810 Spring 2026 official schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS181 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [Vaswani et al. 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Global AI/CS course map (A0–A3 access tiers)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
