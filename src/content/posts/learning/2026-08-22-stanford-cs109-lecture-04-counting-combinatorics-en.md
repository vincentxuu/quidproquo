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

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This is article 5 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 4** (Jun 25). The canonical schedule title is **Counting and Combinatorics**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/4-Counting), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Course video sources

Verified the official Summer 2026 archive: the course is recorded and its syllabus says recordings are available through Canvas. The archived homepage's Videos link redirects to Stanford Canvas login and requires course access, so there is no public Summer 2026 player. The 2022 Stanford Online public recording(s) below cover the same topic but come from a different offering with different lecture numbering; they are supplementary material, not Summer 2026 lecture recordings.

```youtube
url: https://www.youtube.com/watch?v=2MuDZIAzBMY
title: Stanford CS109 Probability for Computer Scientists I Counting I 2022 I Lecture 1
```

```youtube
url: https://www.youtube.com/watch?v=ag4Ei15CG0c
title: Stanford CS109 Probability for Computer Scientists I Combinatorics I 2022 I Lecture 2
```

Original videos:
- [Stanford CS109 Probability for Computer Scientists I Counting I 2022 I Lecture 1](https://www.youtube.com/watch?v=2MuDZIAzBMY)
- [Stanford CS109 Probability for Computer Scientists I Combinatorics I 2022 I Lecture 2](https://www.youtube.com/watch?v=ag4Ei15CG0c)

Official sources:

- [CS109 Summer 2026 — Canvas lecture recordings (login required)](https://canvas.stanford.edu/courses/217477/external_tools/69960)
- [CS109 Summer 2026 — archived official schedule](https://web.stanford.edu/class/archive/cs/cs109/cs109.1268/schedule.html)
- [CS109 Summer 2026 — archived syllabus and recording policy](https://web.stanford.edu/class/archive/cs/cs109/cs109.1268/handouts/syllabus.html)
- [Stanford Online CS109 2022 public playlist (different offering, supplementary)](https://www.youtube.com/playlist?list=PLoROMvodv4rOpr_A7B9SriE_iZmkanvUg)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): what was checked is how the two videos relate to this lecture. In 2022 Lecture 1 (Counting) most of the first part is course introduction and motivation; the step (multiplication) and sum rules start only in roughly the last quarter, estimated from the relative position in the transcript, not an exact time. 2022 Lecture 2 (Combinatorics) covers permutations, combinations, and distinguishable/indistinguishable objects in buckets (buckets and dividers). Together they fit this lecture on the multiplication rule, permutations, combinations and counting with repetition.

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

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Switched to related supplementary video: embedded the 2022 Stanford Online public recording on the same topic; the Summer 2026 original is behind Canvas sign-in and could not be verified.
- 2026-10-10: Checked the video content against its transcript. The two videos together cover this lecture's topic; noted that the first video is mostly course introduction.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 4: Counting and Combinatorics](https://web.stanford.edu/class/cs109/lectures/4-Counting)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 4 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture04-Worksheet.pdf)
- [Lecture 4 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture04-AnswerKey.pdf)
- [Lecture 4 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture04-LLMPrompts.pdf)
