---
title: "Stanford CS224V Lecture 1: Turning Hallucinating LLMs into Dependable Assistants"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, conversational-ai, llm, computational-thinking]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 2
tldr: "Fall 2025 opens with computational thinking: reliability comes from decomposing retrieval, formal representation, verification, and generation into testable algorithms, not from one heroic prompt."
description: "A lecture-by-lecture guide to Stanford CS224V Fall 2025 Introduction: hallucination, computational thinking, the two research stages, semantic parsing, and the course map."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-introduction)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

This is the first lecture of CS224V Fall 2025, not the still-unpublished Autumn 2026 Agentic AI syllabus. Its premise is severe: an LLM can ignore retrieved evidence, mix in parametric memory, or fluently invent unsupported statements even with RAG. The course responds by turning an assistant into individually inspectable steps.

## Agenda

The deck moves through the reliability problem, computational thinking, the 2022–2025 general research-assistant program, and the post-2025 scientific-assistant direction. Only then does it map the remaining course: free text, databases, long documents, knowledge graphs, SMT, dialogue policy, multimodal interfaces, and training. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

The ordering matters. CS224V does not begin with a toolbox. It asks which intermediate state can be inspected. A semantic parser maps language to a formal representation, a retriever executes a traceable query, and generated text is split into claims for verification. Each layer leaves a useful failure case.

## Computational thinking is not “ask the LLM to code”

The [WikiChat paper](https://aclanthology.org/2023.findings-emnlp.157/) supplies the central example. Before generation, formulate a query, retrieve, and filter evidence. After generation, decompose the answer into atomic claims, find evidence for each, and remove unsupported claims. The lesson is not the exact number of stages; it is replacing one vague objective—“answer correctly”—with testable subproblems.

Formal semantics supplies the other axis. For relational data, direct generation entangles querying and wording. Translating first into SQL, SUQL, SPARQL, or SMT makes “nothing was returned” distinguishable from “the model filled in an answer.”

## Stage 1 and Stage 2

Stage 1 applies the method to general research: WikiChat grounds free-text answers, STORM performs multi-perspective pre-writing research, SUQL joins structured and unstructured retrieval, and Genie Worksheets represent task dialogue state formally. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Stage 2 narrows the domain while raising the bar. Scientific assistants must read figures, compare long documents, extract variables and constraints, and test whether clinical-trial criteria apply to a patient. The lecture sketches a direction, not a separate complete syllabus; the research vision should not be reported as already-taught material.

## The product reliability problem

The opening deck frames reliability as a product problem. A system that is usually right can still be unusable for reservations, medical information, or data analysis because a user cannot know which request lands in the failing portion. Reliability therefore means more than moving average accuracy. A team must know which data an answer used, which step failed, and whether the system can stop safely. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

The slides place capability beside limitation. LLMs read and write language well and adapt to formats with examples, but they do not guarantee schema compliance, evidence support, or multi-step composition. CS224V separates “better conversation” from “dependable behavior.” The latter requires algorithms, representations, and evaluation in addition to model selection.

That distinction explains the historical title, *Conversational Virtual Assistants*. These are not merely social chatbots. An assistant reads, writes, retrieves, maintains state, and acts. Once an external action or factual decision is involved, fluency is no longer the dominant objective. Every later system asks how to retain language flexibility while moving unacceptable freedom out of generation.

## RAG still hallucinates because retrieval and generation differ

The lecture rejects a common shortcut: retrieval does not automatically ground an answer. A retriever can select the wrong document, miss part of the required evidence, or fail because of a poor query. A generator can see the correct passage and still add a statement absent from it. Saving only the final answer makes retrieval recall, filtering, and generation fidelity indistinguishable. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

WikiChat illustrates a testable decomposition. Conversation becomes a standalone query; results pass relevance filtering; a candidate response is decomposed into claims; each claim is searched and checked. The claim is not that seven fixed stages solve every application. The lesson is converting “RAG should hallucinate less” into interfaces that can each receive tests.

The same applies to databases. Direct language-to-answer generation mixes schema errors with wording. Producing SQL or SUQL first exposes execution, empty results, and result-set comparison. Formal representation is not theoretical decoration in this course; it creates an evidence trail.

## Four data forms and two forms of control

The course map becomes clearer when grouped by data. Free text includes WikiChat, STORM, and long-document analysis. Structured data includes SQL, schemas, and enumerated values. SUQL handles tables containing textual fields. Knowledge and constraints use SPARQL, knowledge graphs, propositional logic, and SMT. Each form demands a different intermediate representation; vector search is not the universal answer. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Control provides another axis. Task dialogue needs formal state and constrained policy so only permitted actions execute. Multimodal applications need voice, GUI context, and native output in one runtime. The former governs where a task stands; the latter governs what a language command actually changes in an interface. Neither should rely on a transcript to maintain state implicitly.

The final training lecture appears to leave the systems track, but it supplies a lower-level limit. Algorithms can constrain a model; they cannot create representations absent from learning data. CS224V retains model, data, and system layers while concentrating on inspectable system design.

## The universal-semantic-parser ambition

The deck maps several tasks to one semantic-parser concept: language can become a database query, free-text retrieval plan, dialogue-state update, knowledge-graph query, or logical constraint. The shared property is not one output language. It is an intermediate object understood and checked by a downstream executor. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Domain differences remain fundamental. “Nearby” can be geography in a restaurant schema, semantic proximity in retrieval, or spatial reference in a GUI. Universal does not mean one domain-blind prompt. It means a common architecture can host domain-specific representations, retrieval optimizations, and executors.

The lecture also connects parsing to weak model composition. Rather than guessing one complex query, a system can construct fragments, execute them, observe, and compose. SPINACH later implements this as actions; the SMT lecture delegates reasoning to a solver. The enduring principle is division of labor between language understanding and executable reasoning.

## Evaluation must target each failure layer

Final-answer accuracy hides compensating errors: a retriever can fail while a generator guesses correctly, or retrieval can succeed while generation adds an unsupported claim. Evaluation should be decomposed too. Retrieval measures evidence coverage; parsers measure formal output or execution; task agents measure state updates, completion, and action validity; generation measures claim support and attribution. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

Human evaluation remains necessary, but questions must be specific. “Which answer is better?” tends to measure style and confidence. “Is this claim supported by this passage?”, “Was this action allowed by the Worksheet?”, and “Did this UI command execute correctly in context?” match the course's reliability objective. Automatic metrics and user studies cover different failures.

Deployment also becomes a research instrument. Real users ask questions absent from benchmarks, revise constraints, omit information, and encounter changing data. Feeding those failures back into component tests lets the pipeline follow the actual distribution. This is closer to a dependable assistant than repeatedly swapping models on one static dataset.

## An implementation checklist derived from Lecture 1

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Before building an assistant, answer six questions. Where does external truth live: documents, a database, a graph, or current UI state? What intermediate representation receives language? Which executor owns it? Which artifacts remain for debugging? What is safe failure at each layer—empty result, clarification, or blocked action? Which response claims link to evidence?

If every answer is “the LLM handles it,” the system remains a demo. A minimum version can begin by retaining query, passages, and claims, or by limiting a task to three typed actions. The point is that each future failure should add a precise test rather than merely lengthen the system prompt.

Formalization is not always maximal. Casual conversation and creative work may not need a solver; low-risk questions may need only citations and abstention. The course offers reliability mechanisms chosen according to task risk, data form, and acceptable failure. That is the practical meaning of computational thinking here: decompose first, then choose representations and algorithms that make verification possible.

## Three tensions left by Lecture 1

Generality competes with domain control: the architecture can be shared while each domain supplies its schema, ontology, Worksheet, or solver. Automation competes with oversight: inspectable citations, state diffs, and constraints let people intervene precisely. Accuracy competes with coverage: deleting unsupported claims improves precision but may omit useful information, while wider retrieval adds both coverage and noise. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

## The architecture you should be able to draw

Draw user language flowing through a semantic parser into formal state or a query, then an executor into evidence or results and finally a response generator; put a verifier beside evidence and claims. Attach evaluation to each arrow: formal-output or execution tests, result tests, entailment examples, and a response grounding audit. If a lecture omits a box, identify where its responsibility moved. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf))

## A practical reading method

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

For every system, write three columns: input, formal intermediate state, observable failure. If the only entries are “prompt” and “answer,” the computational structure is still missing. STORM exposes perspectives and outlines; Worksheets expose dialogue state; WikiChat exposes retrieved passages and atomic claims.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public artifact is a slide deck, with no recording or complete speaker notes. Some slides intentionally leave classroom content out. This article therefore reconstructs only the visible argument and keeps Fall 2025 separate from the renamed 2026–27 catalog course.

## References

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 1: Introduction](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [Homework 1: DRLite](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf)
- [Homework 2: Genie Worksheets](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf)
