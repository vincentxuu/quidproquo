---
title: "Stanford CS109 Lecture 3 | Bayes Theorem: Bayes’ theorem turns an easier generative direction into the inferential direction we need."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 4
tldr: "Bayes’ theorem turns an easier generative direction into the inferential direction we need."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 3, covering reversing conditions, priors, and evidence with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem)

This is article 4 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 3** (Jun 24). The canonical schedule title is **Bayes Theorem**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/3-Independence), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Worksheet agenda: this lecture is actually about independence

The schedule labels Lecture 3 “Bayes Theorem,” while the current worksheet and navbar center independence and inclusion-exclusion. That source conflict should not be hidden. This guide follows the worksheet agenda and shows how it continues the previous lecture.

Two-event inclusion-exclusion handles overlap. If 0.60 of students take CS, 0.40 take math, and 0.25 take both, the union is 0.75 and neither is 0.25. Direct addition counts dual enrollment twice. With three sets, subtract the pairwise intersections and restore the triple intersection that was removed too often.

The Cloud City problem turns independence into a data-checkable assumption. Estimate marginal rain frequency from all True values, then estimate tomorrow’s rain only among adjacent pairs where today was sunny. Similar estimates are compatible with independence, but do not establish causal independence; seasonality and time trends remain possible.

The scheduling problem uses a complement to avoid an eight-way union. Each person is free with probability 0.3, so both are free in one block with probability 0.3 squared. No common free block has probability (1-0.09)^8, and at least one is its complement. This multiplication requires independence across people and blocks.

The half-hour India/UK problem cannot treat two meeting options as independent because both share blocks A and D. The feasible event is ACD or ABD. Factor the shared requirements, then apply inclusion-exclusion to B or C. The exercise combines AND, OR, independence, and shared components in one diagram.

## Independent is not mutually exclusive

Disjoint events cannot occur together. Independent events leave each other’s probabilities unchanged. Two positive-probability disjoint events are strongly dependent: observing one drives the conditional probability of the other to zero. In reliability models, component independence is an assumption; series systems require every component, while parallel systems are often solved through the complement “all fail.”
## Material gaps

- The shared Spring-dated independence page helps explain the schedule/worksheet title mismatch; it is not Summer-specific evidence.
- recordings are Canvas-gated and were not used.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 3: Bayes Theorem](https://web.stanford.edu/class/cs109/lectures/3-Independence)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 3 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf)
- [Lecture 3 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf)
- [Lecture 3 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf)
