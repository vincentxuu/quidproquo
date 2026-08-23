---
title: "Stanford CS109 Lecture 2 | Conditional Probability: A condition restricts the sample space to outcomes still compatible with the evidence."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 3
tldr: "A condition restricts the sample space to outcomes still compatible with the evidence."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 2, covering conditional probability, the product rule, and total probability with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-02-conditional-probability)

This is article 3 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 2** (Jun 23). The canonical schedule title is **Conditional Probability**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/2-ConditioningAndBayes), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture02-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture02-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture02-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Worksheet agenda: conditioning, chain rule, total probability, and Bayes

The opening die problem reviews sets so that the numerator P(E∩F) has a concrete meaning. The second problem then compares three dice questions. Unconditionally, five ordered pairs sum to eight. Given that the first die is five, only six outcomes remain and only a second die of three succeeds. Given that at least one die is five, eleven outcomes remain and both (5,3) and (3,5) succeed. Similar English conditions produce different answers because they retain different sample spaces.

Drawing without replacement makes the chain rule visible. Two aces have probability 4/52 times 3/51. A king followed by a queen is 4/52 times 4/51. Three hearts multiply 13/52, 12/51, and 11/50. Every draw changes the next denominator and favorable count; that update is the dependence.

The spam problems form one probability tree. The prior is P(spam)=0.3 and the likelihood is P(free|spam)=0.6; the ham branch contributes 0.7 and 0.1. Total probability adds the two paths to “free,” giving 0.25. Bayes divides the spam-and-free path, 0.18, by that evidence to obtain posterior 0.72. Prior, likelihood, evidence, and posterior have distinct roles.

The medical-test problem exposes the base-rate effect. Among one thousand representative people, about ten have the disease and 9.8 test positive; among 990 healthy people, about 49.5 false positives appear. Most positive tests can therefore come from the much larger healthy group. High sensitivity is not high positive predictive value unless prevalence enters the denominator.

## One tree unifies four formulas

Multiplying along branches is the chain rule. Adding disjoint paths to one label is total probability. After observing the label, asking which upstream branch produced it is Bayes. Mapping equations back onto this tree is more reliable than memorizing isolated fractions.
## Material gaps

- The shared Spring-dated conditioning page supports the formulas and Bayes vocabulary, but not the Summer classroom sequence.
- recordings are Canvas-gated and were not used.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 2: Conditional Probability](https://web.stanford.edu/class/cs109/lectures/2-ConditioningAndBayes)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 2 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture02-Worksheet.pdf)
- [Lecture 2 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture02-AnswerKey.pdf)
- [Lecture 2 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture02-LLMPrompts.pdf)
