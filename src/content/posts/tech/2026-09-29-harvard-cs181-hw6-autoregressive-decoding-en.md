---
title: "Harvard CS181 HW6 (Part 1): Decoding Autoregressive Models, KV Cache, and Speculative Decoding"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, generative-models, kv-cache, speculative-decoding]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 11
type: guide
tldr: "HW6 Problem 4 (20 points) takes apart the cost of generating one token at a time in three questions: picking the most likely token at each step doesn't give the most likely sequence; recomputing every key at every step makes cost quadratic, and a KV cache brings it back to linear; speculative decoding lets a small model guess and a large model verify in one pass. It is all pencil-and-paper, and every question maps onto a real design choice in today's LLM inference systems."
description: "Weekly guide to Harvard CS1810 Spring 2026 HW6 (due 2026-05-01) Problem 4, Autoregressive Models: greedy vs MAP decoding, dynamic programming for k-th order autoregressive models and Viterbi, the N_naive/N_cached ratio of key computations, why causal attention can be cached, why training parallelizes and generation doesn't, and speculative decoding's verification and acceptance rule. Mapped to schedule week 11 and Section 9."
draft: false
glossary:
  - term: "MAP decoding"
    aliases: ["maximum a posteriori decoding"]
    definition: "Finding the single sequence with the highest joint probability. For a general autoregressive model this means enumerating V^T sequences, which is exponential."
    context: "HW6 Problem 4 Part 1 contrasts it with greedy decoding, which takes the argmax at each step."
  - term: "prefill"
    aliases: ["prefill phase"]
    definition: "The phase before generation in which the model runs one forward pass over the whole prompt and stores every position's key and value in the KV cache."
    context: "HW6 Problem 4 Part 2c uses it to define the first term of N_cached."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding)

> ⚠️ **Edition and access**: Based on [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6) (`hw6_release.tex/.pdf`), week 11 of the [official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule), and [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) (headed Spring 2026). "Autoregressive Models" is a new lecture in 2026; **the 2024 scribe notes have nothing matching it**, and there are no current-term recordings. Section 9 covers the autoregressive factorization, teacher forcing, and decoding strategies such as greedy and sampling, but **does not cover KV caching or speculative decoding**; background for those parts comes only from the problem text. Homework solutions are not public; Section 9 has a [solution PDF](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf). Access grade **A3**, same as the [series overview](/posts/tech/2026-08-27-harvard-cs181-overview-en).

This is part 11 of the [Harvard CS181 Weekly Guides](/posts/tech/2026-08-27-harvard-cs181-overview-en). Previous: [HW5 (Part 2): SimCLR Contrastive Learning and GANs](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans-en). Next: [HW6 (Part 2): HMMs and the Kalman Filter](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman-en).

## Why start HW6 with Problem 4

HW6 is titled "Sequential Models and Decision Making." Its five problems, in order, are HMMs (Kalman filter, 15 pts), policy/value iteration (15 pts), Q-learning on Swingy Monkey (20 pts), Autoregressive Models (20 pts), and Embedded Ethics (10 pts). The lectures run the other way:

| Week | Date | Lecture | Section |
|---|---|---|---|
| 11 | Apr 7 (Tue) | Autoregressive Models | S8: Generative Modeling Medley |
| 11 | Apr 9 (Thu) | Hidden Markov Models | |
| 12 | Apr 14 (Tue) | Single-Agent MDPs | S9: Autoregressive Models and HMMs |
| 12 | Apr 16 (Thu) | Reinforcement Learning I | |
| 13 | Apr 21 (Tue) | Reinforcement Learning II | S10: MDPs and Reinforcement Learning |

HW6 was released Apr 17 (the schedule says "Release HW 6 (AR, HMMS, MDPs, RL)"), and the tex's `\duedate` is **May 1, 2026 11:59PM EST**. This series splits HW6 in lecture order, so Problem 4 comes first.

Problem 4 is also the only HW6 problem that connects directly to [HW4's Transformer problem](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en): the KV cache in Part 2 rests entirely on causal self-attention. It has no code; all three parts are written.

## The setup: autoregressive factorization

Any sequence's joint probability factors by the chain rule:

```text
p(x₁, …, x_T) = ∏ₜ p(xₜ | x₍<t₎)
```

Section 2 of [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) puts it this way: a hard joint-modeling problem becomes a chain of "given the prefix, predict the next one" problems. Each step looks like supervised classification, but the labels come from the data itself. Training is cross-entropy on the next token at every position.

The problem says it examines three consequences of this step-by-step structure: the algorithmic cost of finding the most probable sequence, the compute cost of each generation step, and how to partially parallelize generation.

## Part 1: the best step isn't the best sequence

The problem gives a small model over length-3 sequences with alphabet {A, B}, listing every p(x₁), p(x₂|x₁), and p(x₃|x₁,x₂).

- **1a**: Greedy decoding takes `argmax p(x | x₍<t₎)` at each step. Compute the sequence and its joint probability.
- **1b**: MAP decoding looks for `argmax p(x)`. Enumerate all 8 sequences.

The numbers are chosen on purpose: once you've done both, you'll find the answers differ. Look at the two branches for x₁. A is more likely, but the conditional probabilities after B are very concentrated. Greedy commits at step one and can never go back.

Section 9's subsection 2.5 lists four decoding strategies (greedy, ancestral sampling, temperature, top-k/nucleus) and notes that greedy suits tasks with a unique right answer but often repeats itself in open-ended generation. Part 1 adds another angle: greedy doesn't even guarantee the single most probable sequence.

- **1c**: Exact MAP for a general autoregressive model costs O(V^T). But if each token depends only on the previous k tokens, dynamic programming works. The problem defines δₜ(w) as the probability of the most probable length-t sequence ending in the window w = (x₍t−k+1₎, …, xₜ), and asks: (i) how many values w can take; (ii) the recursion for δₜ₊₁ in terms of δₜ; (iii) the total time as a function of T, V, and k, checking that k = 1 recovers Viterbi's O(TV²) and k = T−1 recovers brute force.

This is a preview of the HMM lecture. Exercise 3.3 in Section 9's subsection 3.9 is a hand-computed Viterbi problem. Do it first and the recursion in 1c comes much more easily: with k = 1 the window w is just the previous token, playing the same role as an HMM hidden state.

## Part 2: a KV cache turns quadratic into linear

The problem first defines the key quantities in a Transformer: each position t has a representation hₜ, key `Kₜ = W_K hₜ`, and value `Vₜ = W_V hₜ`. Causal self-attention at position t combines keys and values from positions 1…t only.

Generation starts from a length-T prefix and adds one token at a time, k tokens in total. The naive approach reruns a full forward pass over the current sequence at every step, recomputing every Kₜ and Vₜ.

- **2a**: Let N_naive(T, k) be the total number of `W_K hₜ` computations over the k steps. (i) Before generating x₍T+j₎, how long is the sequence and how many keys does that pass compute? (ii) Sum over j = 1…k for a closed form and show it is O((T+k)²).
- **2b**: What property of causal self-attention does KV caching rely on, and why does it hold? Why does caching break under bidirectional self-attention?
- **2c**: With caching, a single prefill pass computes and stores K and V for the T prefix positions, and each later step computes only the new token's pair. (i) Give N_cached(T, k). (ii) What is N_naive / N_cached when k ≫ T (short prompt, long generation)?
- **2d**: One training forward pass over a length-k sequence takes about as long in wall-clock time as generating one token at inference, even though training does far more arithmetic. Why does training parallelize across positions while generation doesn't? Does a KV cache help training?

The hint for 2b is in the problem text: "the value of Kₜ for a position t already in the sequence does not change when a later token is appended." Ask which positions hₜ depends on under a causal mask, and which it depends on under bidirectional attention. Section 9's subsection 2.6 describes how causal masking is implemented (adding −∞ to the upper triangle of the attention score matrix), which answers the first half.

2d maps onto teacher forcing in Section 9's subsection 2.3.1. During training every position's prefix is ground-truth data that is already known, so all positions can be computed in one pass. During generation the next token isn't known until the previous one has been sampled. The same subsection calls the resulting train/generate mismatch exposure bias.

The ratio in 2c(ii) grows with k. That is why the problem says KV caching "is standard in every production language model inference system."

## Part 3: speculative decoding

Part 2 concluded that generation is slow because it can't be parallelized. Speculative decoding sidesteps part of that with two models: the large target model p you actually want, and a small, cheap draft model q that approximates it. Each round has three steps:

1. **Drafting**: q generates k candidate tokens autoregressively.
2. **Verification**: p runs **one** forward pass over the whole sequence and gets k+1 conditional distributions at once. The first k verify the candidates; the last is a "bonus" distribution used if every draft is accepted.
3. **Acceptance**: Check candidates one at a time, accepting the i-th with probability `min(1, p(x₍T+i₎ | …) / q(x₍T+i₎ | …))`. On the first rejection, discard every later candidate and resample that position from a specially constructed distribution so the output still matches p exactly.

The problem states the result directly: under this rule the output has exactly the same distribution as sampling from p. You aren't asked to prove it. You are asked:

- **3a**: (i) What property of the target model's forward pass makes parallel verification possible, and why doesn't the same property allow parallel generation? (ii) If q = p, what happens? Any speedup? Any extra cost?
- **3b**: (i) When p ≥ q, what is the acceptance probability, and why does always accepting make sense? (ii) When p ≪ q, what is it, and why does usually rejecting make sense?

3a(i) and 2d are two sides of one answer: once the candidate tokens are written into the sequence, the target model is effectively doing teacher forcing, and every position can be computed together. For 3b, think of it this way: if q gives a token more probability than p does, the small model is over-recommending it, and accepting with probability p/q trims off exactly the excess.

The problem gives only the algorithm, with no citation. The method comes from [Leviathan et al. 2022](https://arxiv.org/abs/2211.17192) and [Chen et al. 2023](https://arxiv.org/abs/2302.01318); read the former for the proof that the distribution is preserved.

## Suggested order

1. Start with Section 9's Exercise 2.1 (hand-compute one sequence's probability and perplexity) to get used to reading conditional probability tables.
2. For Part 1, tabulate all 8 sequences; the greedy one will be in the table.
3. Before 1c, do the Viterbi problem in Section 9's Exercise 3.3, then replace "hidden state" with "length-k window."
4. For Part 2, do 2a(i) first and count keys by hand with small numbers like T = 2, k = 3, then derive the closed form.
5. Every question in Part 3 can be answered with Part 2's results, so write Part 2 first.

## Self-check

- At which step does greedy decoding make its irreversible choice?
- Why does the MAP dynamic program for a k-th order model have V to the power k states?
- Under bidirectional attention, why do earlier positions' keys change when a new token is appended?
- Roughly what is N_naive / N_cached when k ≫ T?
- With q = p every candidate is accepted, so why might there still be no speedup?

## Further reading

This series covers only what the assignment needs. For how these techniques work in real systems, two site guides take the LLM-engineering view:

- [CME295 Lecture 3: the control knobs of LLM generation](/posts/ai/2026-09-29-cme295-large-language-models-en): decoding strategies, temperature, top-p.
- [CME295 2026 Lecture 5 (pre-written): LLM systems](/posts/ai/2026-09-29-cme295-llm-systems-en): prefill vs decode, sizing the KV cache, speculative decoding's acceptance rate and speedup ceiling.

## References

- [CS1810 Spring 2026 HW6 folder (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6): `hw6_release.tex`, `hw6_release.pdf`
- [HW6 problem PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.pdf)
- [CS1810 2026 official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) (weeks 11–13, HW6 release; read via Google Sheet CSV export on 2026-09-29)
- [Section 9: Autoregressive Models and Hidden Markov Models (Spring 2026)](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) / [solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf)
- [CS1810 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Leviathan et al., Fast Inference from Transformers via Speculative Decoding (2022)](https://arxiv.org/abs/2211.17192)
- [Chen et al., Accelerating Large Language Model Decoding with Speculative Sampling (2023)](https://arxiv.org/abs/2302.01318)
- [Harvard CS181 Weekly Guides (series overview)](/posts/tech/2026-08-27-harvard-cs181-overview-en)
