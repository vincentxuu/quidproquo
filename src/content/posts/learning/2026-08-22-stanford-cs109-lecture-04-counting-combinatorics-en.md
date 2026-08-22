---
title: "Stanford CS109 Lecture 4 | Counting and Combinatorics: Decide whether order matters and repetition is allowed before choosing a formula."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 5
tldr: "Decide whether order matters and repetition is allowed before choosing a formula."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 4, covering the product rule, permutations, combinations, and overcounting with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-04-counting-combinatorics)

This is article 5 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 4** (Jun 25). The canonical schedule title is **Counting and Combinatorics**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/4-Counting), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Worksheet agenda: decide order and repetition before choosing a formula

The three-component review gives all-up probability 0.95 cubed and at-least-one-down probability one minus that value. It previews a central counting move: count the complement when direct counting is awkward.

A four-digit code has 10^4 possibilities with repetition and 10·9·8·7 without it. If six distinct smudged digits are known but their order is not, there are 6! orders. The product rule is not “multiply everything”; it builds an outcome step by step and updates the choices remaining at each step.

The fantasy draft mixes category constraints and ranking. Exactly two goalkeepers requires selecting eligible people while preserving the six-position ranking. In the second part, if four of six drafted players are forwards and three unordered starters are selected, the all-forward probability is C(4,3)/C(6,3). The draft is ordered; the starter committee is not.

BANANA has six letters with three As and two Ns, giving 6!/(3!2!). MISSISSIPPI divides by the internal permutations of repeated I, S, and P groups. The denominator removes the number of distinct-label permutations that produce the same visible string.

Five-card hands, three-person committees, and length-ten bit strings with exactly three ones are combinations: choose members or positions without ordering them. Flushes count four suits times C(13,5). Four of a kind chooses a rank and then a fifth card. Both divide by C(52,5), because the atomic outcomes are equally likely hands rather than deal sequences.

Ten flips produce 2^10 sequences. Exactly four heads chooses four head positions; at least eight adds the disjoint counts for eight, nine, and ten heads. The two-aces challenge similarly chooses two of four aces and three of 48 non-aces.

## A decision table

Use the product rule to construct outcomes in stages, permutations when order matters, combinations for unordered subsets, and division by internal swaps for repeated objects. Before turning a count into probability, verify that the denominator’s atomic outcomes are equally likely.
## Material gaps

- The shared Spring-dated counting page supports the product-rule and combination notation, but not the Summer classroom sequence.
- recordings are Canvas-gated and were not used.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 4: Counting and Combinatorics](https://web.stanford.edu/class/cs109/lectures/4-Counting)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 4 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf)
- [Lecture 4 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf)
- [Lecture 4 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf)
