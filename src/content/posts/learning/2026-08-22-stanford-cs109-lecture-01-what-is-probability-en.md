---
title: "Stanford CS109 Lecture 1 | What is Probability?: List outcomes first; only then assign probabilities to events."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 2
tldr: "List outcomes first; only then assign probabilities to events."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 1, covering sample spaces, events, and the three axioms with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-01-what-is-probability)

This is article 2 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 1** (Jun 22). The canonical schedule title is **What is Probability?**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/1-Welcome), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture01-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Worksheet agenda: from listing outcomes to the axioms

The first problem anchors the statement that an event is a subset of a sample space. Three flips produce eight equally likely sequences. “At least two heads” contains HHH, HHT, HTH, and THH; “first flip is tails” contains THH, THT, TTH, and TTT. Their intersection contains THH, so they are not mutually exclusive. The task combines three moves: enumerate outcomes, translate prose into a set, and use intersection—not verbal intuition—to test exclusivity.

The second problem sets the classic sum-of-dice trap. Two distinguishable dice have 36 ordered outcomes. Six sum to seven and only one sums to two. Treating sums 2 through 12 as eleven equally likely outcomes fails because those sums have different multiplicities. Favorable-over-total counting is valid only after choosing equally likely atomic outcomes.

The card problem turns the axioms into arithmetic. Hearts contain 13 cards and aces contain four, but the ace of hearts belongs to both. The union must subtract that duplicate. Aces and face cards J/Q/K are disjoint and may be added directly. The spinner problem then contrasts direct union counting with the complement rule: multiples of three and values at most four overlap at three, while “not seven” is simply one minus 1/12.

The final problem separates long-run frequency from certainty. The 219 sunny days among 365 observations estimate a rate, not tomorrow’s outcome. Probability 1.2 violates the axioms, while two event probabilities summing above one need not: the events may overlap. If P(E)=0.4, the complement is exactly 0.6.

## Using the six LLM-guide concepts

The official guide orders sample space, event, equally likely outcomes, long-run frequency, axioms, and complement. Use it after attempting the work: ask the model to identify omitted atomic outcomes or a false equal-likelihood assumption. For the dice-sum problem, the useful question is which level of outcomes is equally likely—not a request for the final fraction.
## Material gaps

- The shared Spring-dated welcome page supports the sample-space and axioms vocabulary, but not the Summer classroom sequence.
- recordings are Canvas-gated and were not used.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 1: What is Probability?](https://web.stanford.edu/class/cs109/lectures/1-Welcome)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 1 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf)
- [Lecture 1 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture01-AnswerKey.pdf)
- [Lecture 1 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf)
