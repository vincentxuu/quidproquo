---
title: "Stanford CS109 Lecture 5 | Random Variables and Expectation: A random variable maps outcomes to numbers; expectation is a weighted average, not necessarily an attainable value."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 6
tldr: "A random variable maps outcomes to numbers; expectation is a weighted average, not necessarily an attainable value."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 5, covering random variables, PMFs, and expectation with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-05-random-variables-expectation)

This is article 6 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 5** (Jun 29). The canonical schedule title is **Random Variables and Expectation**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/5-Binomial), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture05-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture05-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture05-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Worksheet agenda: from counting to the binomial PMF

The committee review has C(12,4) total committees, C(5,2)C(7,2) with exactly two seniors, and C(7,4) all-junior committees. These counts anticipate the binomial coefficient, although sampling without replacement itself is not binomial.

Three fair flips map eight sequences to Y, the number of heads. Y takes only 0, 1, 2, and 3, with probabilities obtained by counting mapped sequences; they must sum to one. A random variable compresses outcomes: HTH and THH differ as sequences but both map to Y=2.

The earthquake PMF P(X=k)=c/2^k must normalize. Because the geometric series from k=1 sums to one, c=1; P(X=3)=1/8 and P(X≤2)=1/2+1/4. The exercise tests normalization before event queries, not the realism of this seismic model.

A binomial model requires fixed n, binary trials, constant p, and independence. Independent bits and ad impressions qualify. Hearts in five cards drawn without replacement do not, because every draw changes the next success probability. Exactly three ones in eight positions uses C(8,3) to select success locations and multiplies the appropriate success and failure powers.

For seven servers independently alive with probability 0.8, X is Bin(7,0.8). Failure X<2 contains only zero and one live server; uptime is its complement. In the audience problem, X counts only the twenty experts, so X is Bin(20,0.7), not a model with n=200.

In the best-of-seven exercise, assuming all games are played, winning is X≥4. Selecting four wins and calling the remaining games “anything” double-counts outcomes with five, six, or seven wins because the selected-slot events overlap. The Galton board finally turns every right move into a Bernoulli trial; bucket k has probability C(5,k)/2^5, symmetric because C(5,k)=C(5,5-k).

## Every factor in the binomial formula

C(n,k) chooses the success locations, p^k makes those successes occur, and (1-p)^(n-k) makes the rest fail. Multiplication gives one location pattern; the coefficient adds all disjoint patterns. Memorizing the expression without its four modeling conditions is the common failure mode.
## Material gaps

- The shared Spring-dated Binomial page supports the PMF and modeling conditions, but not the Summer classroom sequence.
- recordings are Canvas-gated and were not used.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 5: Random Variables and Expectation](https://web.stanford.edu/class/cs109/lectures/5-Binomial)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 5 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture05-Worksheet.pdf)
- [Lecture 5 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture05-AnswerKey.pdf)
- [Lecture 5 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture05-LLMPrompts.pdf)
