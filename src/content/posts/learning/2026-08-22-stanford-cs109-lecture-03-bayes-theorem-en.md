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

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This is article 4 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 3** (Jun 24). The canonical schedule title is **Bayes Theorem**, taught by Chris Gregg. This guide cross-checks the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/lectures/3-Independence), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf). The lecture page and the `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) are shared, Spring-dated concept references.

Material fidelity is **L3**: the Summer schedule and problem artifacts establish the agenda; shared Spring-dated pages support concepts only. The Canvas recording was not used.

## Course video sources

Verified the official Summer 2026 archive: the course is recorded and its syllabus says recordings are available through Canvas. The archived homepage's Videos link redirects to Stanford Canvas login and requires course access, so there is no public Summer 2026 player. The 2022 Stanford Online public recording(s) below cover only part of this lecture's topic (see the content check below) but come from a different offering with different lecture numbering; they are supplementary material, not Summer 2026 lecture recordings.

```youtube
url: https://www.youtube.com/watch?v=NHRoXvPaZqY
title: Stanford CS109 I Conditional Probability and Bayes I 2022 I Lecture 4
```

Original videos: [Stanford CS109 I Conditional Probability and Bayes I 2022 I Lecture 4](https://www.youtube.com/watch?v=NHRoXvPaZqY)

Official sources:

- [CS109 Summer 2026 — Canvas lecture recordings (login required)](https://canvas.stanford.edu/courses/217477/external_tools/69960)
- [CS109 Summer 2026 — archived official schedule](https://web.stanford.edu/class/archive/cs/cs109/cs109.1268/schedule.html)
- [CS109 Summer 2026 — archived syllabus and recording policy](https://web.stanford.edu/class/archive/cs/cs109/cs109.1268/handouts/syllabus.html)
- [Stanford Online CS109 2022 public playlist (different offering, supplementary)](https://www.youtube.com/playlist?list=PLoROMvodv4rOpr_A7B9SriE_iZmkanvUg)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the transcript of 2022 Lecture 4, "Conditional Probability and Bayes" (about 75 minutes): the video matches the schedule title Bayes Theorem (conditional probability, the law of total probability, Bayes), but its transcript barely discusses independence and never covers inclusion-exclusion, which are the core of this post's worksheet agenda. It therefore only supplies Bayes prerequisites, not the main worksheet content below. The same video is also embedded in Lecture 2.

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

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Switched to related supplementary video: embedded the 2022 Stanford Online public recording on the same topic; the Summer 2026 original is behind Canvas sign-in and could not be verified.
- 2026-10-10: Checked the video content against its transcript. The video only matches the schedule title (Bayes) and not the worksheet's independence/inclusion-exclusion material; the description now says "partial match".

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 3: Bayes Theorem](https://web.stanford.edu/class/cs109/lectures/3-Independence)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
- [Lecture 3 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture03-Worksheet.pdf)
- [Lecture 3 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture03-AnswerKey.pdf)
- [Lecture 3 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture03-LLMPrompts.pdf)
