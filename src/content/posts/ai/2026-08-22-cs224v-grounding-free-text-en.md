---
title: "Stanford CS224V Lecture 5: WikiChat's Seven-Stage Defense Against Hallucination"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, rag, hallucination, wikichat]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS224V"
  order: 6
tldr: "The [WikiChat paper](https://aclanthology.org/2023.findings-emnlp.157/) expands RAG into query formulation, retrieval, filtering, generation, claim extraction, renewed retrieval and verification, and removal of unsupported content—and evaluates retrieval separately from factuality."
description: "CS224V Grounding Conversational Agents on Free Text: RAG baselines, WikiChat's seven-stage pipeline, claim verification, and dynamic evaluation."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-grounding-free-text)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 5 returns to free text. Without a database schema or fixed Worksheet fields, how can an assistant avoid fluent invention? WikiChat expands RAG into repeated retrieval, filtering, and claim verification instead of assuming that context eliminates hallucination.

## Agenda: break the baseline, then build the pipeline

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The deck reviews RAG and systems such as BlenderBot-3 and Atlas, focusing on the gap between strong human ratings and verifiable errors. It then introduces computational thinking, WikiChat's design and seven-stage pipeline, and automatic and dynamic real-user evaluation.

## Why retrieve-then-read is insufficient

Retrieval can select the wrong article. Evidence can be stale when a user asks about the present. Even with correct passages, generation can merge them into a new unsupported statement. Retrieval success and final factuality therefore require separate measurement. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

WikiChat formulates a search query from conversation, retrieves and filters documents, and generates a candidate answer. It then decomposes sentences into self-contained atomic claims, retrieves evidence again for each claim, judges support, and removes failures. Post-generation checking catches statements the model added despite correct context.

## What earlier retrieval baselines leave unresolved

The lecture reviews conversational QA, BlenderBot-3, and Atlas-style systems before WikiChat. Retrieval improves knowledge responses and can receive strong crowd ratings, yet concrete examples remain factually wrong. If raters judge engagement and fluency, confident detail can score well while claim verification would fail. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Joint retrieval-generation training still does not guarantee that each output claim follows from a passage. WikiChat therefore chooses a system-level algorithm that exposes support relationships rather than relying only on a model objective.

## The seven-stage computational pipeline

Conversation first becomes a standalone query because pronouns and follow-ups are poor search inputs. Retrieval returns candidates and filtering removes topically similar but unusable passages. A candidate answer is generated, decomposed into self-contained claims, and each claim triggers renewed retrieval and verification. Unsupported content is removed or rewritten. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Some slides count seven conceptual stages while others expand them into more prompts. The important feature is two retrieval moments: gather context before generation, then gather evidence for generated claims. The second catches additions absent from context; the first avoids generating a large body of speculation to verify afterward.

## Query formulation and retrieval bound the system

“Did he win the next one?” needs entity, event, and time from history without importing an unsupported premise. Save rewritten queries because under-specification and over-specification create different retrieval failures. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

The deck discusses ColBERT and multilingual retrieval components to emphasize that generation cannot recover an absent document. Measure passage recall by named entities, long-tail events, language, and temporal questions.

Grounded is not synonymous with current. A passage may accurately describe an earlier date while the user asks “now.” Temporal intent and source dates require explicit handling.

## Filtering protects generation from noisy context

High-recall retrieval returns irrelevant documents, same-name entities, and conflicting years. Filtering asks whether a passage can support the query, not merely whether it shares a topic. Dropping unique evidence and retaining misleading evidence are separate errors and require keep/drop labels. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Conflicting passages may represent different dates or definitions. The lecture does not provide a universal conflict resolver; a production system should expose conflict, prefer a justified authority, or abstain rather than manufacture certainty.

## Claim extraction makes factuality measurable

Factuality can be expressed as supported claims divided by factual claims only if segmentation is stable. Large claims mix true and false propositions; tiny fragments lose independent meaning. Claims also need resolved entities and dates. Rewriting “he won that year” must not add “record-setting.” ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Subjective advice and social language should not be forced into true/false verification. Classify factual content before checking it, and evaluate the claim extractor itself with reviewed examples.

## Verification tests entailment, not similarity

A passage mentioning the same entity may not support the claim. Verifiers need supported, contradicted, and insufficient-evidence outcomes, with special attention to numbers, negation, and comparisons. LLM judges can scale evaluation but still need human audits and disagreement reporting. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Verification must change the delivered response. Delete unsupported claims, regenerate only from passed claims, or state that evidence is insufficient. A score that leaves the original response untouched is not a reliability mechanism.

## Dynamic evaluation and its limits

Crowdsourced static conversations age and reflect tester imagination. Deployment reveals natural follow-ups and long-tail topics. It also introduces selection bias and privacy concerns, so traffic is supplementary evidence rather than an automatically representative benchmark. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

Measure retrieval, filtering, claim extraction, verification, response quality, latency, and cost on the actual serving path. A system that silently skips verification for speed cannot inherit an offline factuality result.

## Build a maintainable harness from failures

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Collect fifty RAG failures with conversation, rewritten query, passages, candidate answer, claims, verification evidence, and final answer. Label the earliest failing layer. Build component regressions for reference resolution, gold-passage recall, filtering, self-contained claims, and support judgments.

The final-answer test should require every factual sentence to trace to a passed claim rather than match one wording. In production, track corrections, citation use, abstention, retrieval misses, and latency separately. More abstention can be an improvement when it replaces unsupported answers.

## Atomic claims are the verification interface

“A player won the title that year, earned a tenth championship, and set a record” is a poor binary test unit. Decomposition gives each proposition its own evidence and label. Claims must also be self-contained: pronouns such as “he” and relative dates such as “that year” make retrieval impossible outside the original sentence. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

## Source presentation is the pipeline's last mile

A passed support label is not enough for a reader. The response must attach each factual claim to the evidence span that actually supports it, distinguish source publication dates, and expose conflicts rather than decorating a paragraph with unrelated links. Citation rendering is therefore part of the grounding contract, not a final formatting step. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

## Evaluation must move with the world

Static crowdsourced conversations age and cover only questions imagined by testers. The lecture therefore considers dynamic evaluation from real use: collect questions, update knowledge and failure cases, and measure retrieval, claim support, and overall response separately. This is closer to reliability than one conversational-preference score. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf))

## An exercise for tonight

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Take ten failures from an existing RAG system and label each as retrieval miss, stale evidence, unsupported generation, or claim-decomposition failure. Add one independent test and log field per category before editing prompts. If the failed layer is invisible, prompt tuning merely moves the error.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public deck does not include full code, prompts, or a recording. Some slides expand the seven conceptual stages into finer prompt operations. This article describes the visible algorithmic roles and does not claim the production system can be reconstructed verbatim.

## References

- [Lecture 5: Grounding Conversational Agents on Free Text](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [WikiChat paper (Findings of EMNLP 2023)](https://aclanthology.org/2023.findings-emnlp.157/)
- [Lecture 1: computational-thinking and WikiChat overview](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
