---
title: "CS224N Lecture 15: Reading Agentic Interpretability Without Public Slides"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, interpretability, human-centered-ai, ai-agent, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 16
tldr: "Lecture 15 is Been Kim's interpretability guest session, but the Winter 2026 site publishes no slides or agenda. This article does not invent lecture content; it maps the five official readings across concept discovery, agentic investigation, and new vocabulary."
description: "A material-gap record and official reading map for CS224N Winter 2026 Lecture 15: agentic interpretability, human-centered AI, concept discovery, and neologism learning."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-interpretability)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) confirms that the fifteenth regular unit took place on February 24, 2026, guest-taught by Been Kim under the official title **Guest Lecture: Interpretability**. Unlike the first fourteen units, the course page publishes no Winter 2026 deck and no agenda. It lists only five suggested readings.

This article therefore cannot faithfully reconstruct what was taught. It is a reading map supported by the official list, preserving the series position and material boundary without presenting papers as classroom speech.

## Route one: from explaining an answer to an investigating agent

The first official reading is [*Because we have LLMs, we Can and Should Pursue Agentic Interpretability*](https://arxiv.org/abs/2506.12152). This route moves interpretability beyond one visualization or feature attribution toward an investigation that proposes hypotheses, designs probes, calls analysis tools, and accumulates evidence.

Agentic does not mean trustworthy. Every step still needs traceable inputs, tool outputs, counterexamples, and stopping rules. Asking one model to explain itself and then judge the explanation creates a closed confirmation loop.

## Route two: from model internals to human concepts

[*The Pareto Frontier of Human-Centered AI*](https://medium.com/@beenkim/the-pareto-frontier-of-human-centered-ai-54f90ba5872c) and the [AlphaZero concept-discovery paper](https://www.pnas.org/doi/10.1073/pnas.2406675122) focus on concept exchange between people and models. The latter discovers concepts in a model and transfers them to people. The question is not only whether a neuron activates, but whether a discovered concept is understandable, usable, and improves later human judgment.

This creates a multi-objective trade-off: predictive performance, human understanding, intervention cost, and actionability need not peak together. An explanation that is faithful but unusable—or intuitive but unfaithful—cannot be summarized merely as “interpretable.”

## Route three: existing vocabulary may be insufficient

[*We Can't Understand AI Using our Existing Vocabulary*](https://arxiv.org/abs/2502.07586) and [*Neologism Learning for Controllability and Self-Verbalization*](https://arxiv.org/abs/2510.08506) ask whether model structure exceeds existing human labels. A concept bottleneck restricted to known vocabulary may force unknown patterns into familiar categories.

Neologism learning introduces new concept tokens that a model can reference, control, or verbalize. Validation must go beyond whether a name sounds plausible: does it correspond to reproducible behavior, generalize across examples, and cause the expected change when intervened upon?

## What can and cannot be confirmed

The date, speaker, title, and five official readings are confirmed. The spoken agenda, deck, coverage of each paper, live examples, and conclusions are not. The page HTML contains a commented-out link to an older offering's slides; it is not Winter 2026 public material and is not used here. This article should become a full lecture review only if current slides are later released.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Because we have LLMs, we Can and Should Pursue Agentic Interpretability](https://arxiv.org/abs/2506.12152)
- [The Pareto Frontier of Human-Centered AI](https://medium.com/@beenkim/the-pareto-frontier-of-human-centered-ai-54f90ba5872c)
- [Bridging the human–AI knowledge gap through concept discovery and transfer in AlphaZero](https://www.pnas.org/doi/10.1073/pnas.2406675122)
- [We Can't Understand AI Using our Existing Vocabulary](https://arxiv.org/abs/2502.07586)
- [Neologism Learning for Controllability and Self-Verbalization](https://arxiv.org/abs/2510.08506)
