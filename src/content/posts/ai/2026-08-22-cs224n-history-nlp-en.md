---
title: "CS224N Lecture 1: Four Paradigm Shifts in NLP"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, nlp, stanford, deep-learning]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 2
tldr: "Winter 2026 Lecture 1 divides NLP into four eras: early exploration, symbolic systems, statistical machine learning, and deep/self-supervised learning. The point is not the dates but how each era redefined the language problem."
description: "A lecture-by-lecture reading of Stanford CS224N Winter 2026 Lecture 1: course goals, four eras of NLP, and the limits of the public material."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-history-nlp)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 1, **History of NLP**, on January 6, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff and reconstructs the public agenda from the [course-introduction deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf) and [history deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-history.pdf). The lecture first defines the quarter's destination, then asks where today's language models came from.

## Where the course is taking you

[Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning) supplements the course's boundary between understanding and reasoning. The introduction gives three goals: foundations of modern NLP, a broad understanding of why human language is difficult, and the ability to build language systems such as question answering, RAG, tool use, and LLM evaluation.

That ordering matters. CS224N is not an “LLM tools” course. It places current systems at the end of a chain of representation, learning, and evaluation decisions. Each later lecture fills in one link.

## Four eras, not four mutually exclusive toolkits

The history deck divides NLP into 1940–1969 early exploration, 1970–1992 hand-built symbolic systems, 1993–2012 statistical and supervised machine learning, and 2013 onward deep learning, self-supervision, and reinforcement learning.

The early story starts with machine translation. Warren Weaver compared translation to decoding, an engineer's optimism; Norbert Wiener questioned whether semantic boundaries across languages were crisp enough for mechanical treatment. That tension persists. Is language a rule system, a distribution that data can estimate, or reasoning that requires world knowledge?

Symbolic NLP encoded dictionaries, grammars, and rules. Its structure was explicit and failures inspectable, but coverage depended on manual work. Statistical NLP estimated patterns from corpora and generalized beyond written rules, while inheriting choices and biases in data and annotation. Deep learning replaced many hand-designed features with learned representations; self-supervision turned unlabelled text into a training signal.

The lesson is not that each new era proved the previous one wrong. Current systems still use tokenization, search, tools, and structured constraints. What changes is how much knowledge engineers write down and how much optimization learns from data.

## A reading method for the rest of the course

Ask three questions in every later lecture: How is language represented? Where does the learning signal come from? Who fills the gap when the model cannot know or act? Lecture 2 begins with representation; lecture 3 explains how parameters learn; Transformers, pretraining, and RAG revisit all three.

## Early exploration: translation, information theory, and neural nets

The history deck begins NLP with machine translation because it turned meaning across symbol systems into an engineering problem. Weaver's decoding analogy borrowed optimism from cryptanalysis; Wiener's objection noted that semantic boundaries are not fixed like cipher symbols. Their exchange anticipates a persistent question: how much can form and distribution recover, and what still requires context or world knowledge?

McCulloch and Pitts' simplified neurons and the Dartmouth AI project appear beside translation in the deck. These were not yet isolated course categories. Language was simultaneously a test for intelligence and an object for theories of information and computation.

## Symbolic NLP: inspectable language structure

Hand-built systems encoded lexicons, grammars, semantic representations, and rules. A failed parse could be traced to a production rule; a word-sense error to a lexical entry. That traceability remains useful in knowledge graphs, parsers, constraints, and tool schemas.

The cost was coverage. Ambiguity, ellipsis, pragmatics, and domain change produced interacting exceptions. This era did not simply fail: it defined tasks and annotation structures later statistical models used as labels. New methods reduced hand-written decision rules without eliminating structured knowledge.

## Statistical NLP: estimating uncertainty

From the 1990s, corpora became evidence and probabilistic models ranked analyses. Held-out data enabled systematic measurement; features were separated from learned weights; uncertainty could flow between components.

Human choices did not disappear. Benchmarks chose the target, annotation guidelines chose a linguistic analysis, and common corpora received more weight. “Learning from data” moved decisions from rule files into collection, labels, and metrics.

## Deep learning, self-supervision, and reinforcement learning

Deep NLP learned representations and compositions rather than relying on hand-designed features. Self-supervision creates targets from text itself—next tokens, masks, or corrupted spans—scaling beyond labelled data while making provenance, repetition, contamination, and copyright central concerns.

Preference optimization changes the signal again, from observed tokens to preferred or rewarded answers. It can improve assistant behavior while changing calibration, diversity, and minority preferences. Every objective redefines success.

## Comparing the eras on common axes

| Era | Main knowledge carrier | Construction | Inspectable evidence | Main gap |
|---|---|---|---|---|
| Early exploration | task analogies and prototypes | manual design | explicit assumptions | scaling unproven |
| Symbolic | lexicons, grammars, rules | expert authoring | rules and structures | coverage and exceptions |
| Statistical | features, probabilities, labelled corpora | parameter estimation | held-out error | labels, shift, sparsity |
| Deep/self-supervised | learned representations and parameters | large-scale optimization | end-task metrics and probes | provenance, interpretation, cost |

This is not a scoreboard. Each era relocates labor: knowledge authoring, features and labels, or data, compute, and evaluation. The useful question for a new method is where human judgment moved.

## An exercise for the full series

Keep four columns while reading: representation, training signal, inference procedure, and failure evidence. For lecture 2, write word vectors, center-context prediction, nearest-neighbor use, and rare-word/polysemy/bias failures. For lecture 5, write contextual token states, language-model objectives, attention generation, and quadratic cost plus position limits.

By lecture 19, the course becomes repeated revisions of the same four columns rather than nineteen disconnected topics. A new paper that changes architecture but leaves its signal or evaluation vague will expose its own missing cells.

## Three historical misreadings to avoid

Do not ridicule early questions with current infrastructure, tell a single-line victory story, or equate benchmark progress with solved understanding. Modern RAG and agents mix neural representations with symbolic schemas, filters, documents, and validators. For any “new paradigm,” ask which old limitation it removes, whether the comparison holds resources constant, and which new assumptions it introduces.

## A map of the quarter

Lectures 1–5 establish representation and optimization; 7–10 move through pretraining, adaptation, RAG, and agents; 11 treats evaluation; 12–13 reasoning and inference compute; 14–18 tokenization, multilinguality, interpretation, social impact, and multimodality; 19 returns to open research. Lecture 6 turns concepts into a baseline, dataset, and metric. Revisit the four-era table after every block.

## Material gap

Winter 2026 recordings are available only to enrolled students. This article follows the official introduction and history decks. It does not claim spoken examples, classroom discussion, or views absent from those slides, and it does not fill the gap with recordings from another offering.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 1 introduction slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf)
- [Lecture 1 History of NLP slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-history.pdf)
- [Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning)
