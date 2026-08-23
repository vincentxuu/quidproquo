---
title: "Berkeley CS288 Spring 2026: 18 Slide Units, Three Assignments, and the Limits of Self-Study"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, llm, self-study, open-course]
lang: en
type: guide
difficulty: 深度
tldr: "CS288 moves from n-grams to RAG, reasoning, and agents through 18 public slide units and three assignments; Berkeley-only recordings make this an A3 materials route, not a public video course."
description: "A guide to Berkeley CS288 Spring 2026: prerequisites, 18 slide units, three assignments, the research project, compute needs, and off-campus access limits."
draft: false
series:
  name: "Berkeley CS288 Spring 2026"
  order: 0
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-overview)

[Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/) is a graduate-level Advanced Natural Language Processing course. It does not begin with an LLM API. It builds from n-grams, word representations, classification, and sequence models before reaching Transformers, pre-training, post-training, RAG, inference-time compute, reasoning, and agents.

This series is a guide to the materials, not a reconstruction of the classroom. The official site says that [recordings require a Berkeley login](https://cal-cs288.github.io/sp26/course_info/). Anonymous readers get 18 slide units, three assignments, two starter repositories, and project specifications. The articles stay within that evidence.

## The prerequisites are operational

The course assumes machine-learning experience and proficiency with PyTorch, NumPy, and neural networks; it provides no introductory tutorials. For undergraduate and master's students, [CS182, CS188, CS189, or EECS183/283A](https://cal-cs288.github.io/sp26/course_info/) is strongly encouraged.

Try this tonight: implement a PyTorch classifier with a forward pass, loss, backward pass, optimizer step, and a defensible train/validation split. If that is not yet routine, repair the foundation first.

## Six articles cover all 18 slide units

| order | scope | public slides |
|---:|---|---|
| 1 | Counts to classification | 01–04: introduction, n-gram LM, word representation, text classification |
| 2 | Sequences to Transformers | 05–07: sequence models, seq2seq, Transformers |
| 3 | Making trained models useful | 08–12: pre-training, advanced pre-training, post-training, generation, evaluation |
| 4 | External knowledge and architecture | 13–14: retrieval/RAG and advanced architectures, plus the social-impact materials gap |
| 5 | Reasoning and agents | 15–18: embodied perception, inference-time compute, agent reasoning, embodied agents |

The schedule also lists impact, speech, continual learning, and guest lectures. Where no anonymous materials accompany a session, this series records the gap instead of inventing its contents.

## The assignments form one capability chain

[Assignment 1](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf) covers an n-gram LM, a neural n-gram LM, a perceptron, and an NBOW MLP. It forces a comparison between designed features and learned representations before large models enter the picture.

[Assignment 2](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) turns Transformer vocabulary back into components: BPE, RoPE, causal attention, blocks, optimizers, warmup, cosine decay, and gradient clipping. A bonus mini-study connects pre-training, fine-tuning, and prompting.

[Assignment 3](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf) has no starter code. Students collect Berkeley EECS pages, create QA validation data, build a retrieval corpus, compare sparse and dense retrieval, and use ablations to separate retrieval failures from generation failures.

## A3 is not the enrolled experience

The materials and starter code are sufficient for meaningful work, hence A3. [Course Info](https://cal-cs288.github.io/sp26/course_info/) says recordings are available to enrolled students and Cal-affiliated auditors; Ed, Gradescope, and staff feedback also belong to the enrolled environment.

Official assessment for [Assignments 2 and 3](https://cal-cs288.github.io/sp26/assignments/) additionally relies on hidden tests, Gradescope, and a course-provided OpenRouter wrapper. Off-campus readers do not receive those pieces. The [final project](https://cal-cs288.github.io/sp26/project/) adds in-course team matching and checkpoint feedback. The course home only acknowledges VESSL AI and Google Cloud project compute credits; it does not promise public access to them.

A2's Transformer and A3's RAG can both incur compute costs. Start with small data, small models, and CPU baselines before renting a GPU.

## References

- [CS288 Spring 2026](https://cal-cs288.github.io/sp26/)
- [Course info and prerequisites](https://cal-cs288.github.io/sp26/course_info/)
- [Assignments index](https://cal-cs288.github.io/sp26/assignments/)
- [Course project](https://cal-cs288.github.io/sp26/project/)
- [Berkeley AI/ML course map](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
