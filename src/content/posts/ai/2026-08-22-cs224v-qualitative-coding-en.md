---
title: "Stanford CS224V Lecture 9: Why Automated Qualitative Coding Still Needs Expert Review"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, qualitative-coding, event-extraction, structured-output]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 10
tldr: "Automated qualitative coding defines event types and arguments in a codebook, then separates document classification, structured extraction, and entity linking. Constrained JSON fixes form, not expert judgment."
description: "CS224V Document Set Analysis: qualitative coding, ACLED codebooks, abstractive event detection, Python and JSON schemas, entity linking, and end-to-end limits."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-qualitative-coding)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 9 examines document analysis in which researchers repeatedly code events, actors, places, and relationships under a codebook. Epidemic events and ACLED conflict data provide the running cases. Its conclusion is deliberately restrained: automated qualitative coding is not ready to bypass human quality control.

## Agenda: from manual practice to extraction

The deck defines qualitative coding and codebooks, introduces epidemic and ACLED cases, and critiques sentence/span extraction. It then decomposes abstractive event extraction into event-type detection, argument extraction, constrained output, entity retrieval/filtering/assignment, and task-specific and end-to-end evaluation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## A codebook is both schema and decision policy

A codebook defines event boundaries, arguments per type, exclusion cases, and treatment of overlapping events. Cross-country, multilingual sources often supply actors or consequences outside one sentence. Trigger words and nearby spans therefore miss abstract events. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

The first task is abstractive event-type detection over the document. Once the type is known, extraction can focus on its typed arguments—location, participants, time, and other type-specific fields.

## Qualitative coding is not ordinary QA

QA answers a question; coding applies one codebook consistently across a corpus and produces records for analysis. Human workflows include codebook design, coder training, independent annotation, disagreement review, and revision. Automation must version rules, retain spans, express uncertainty, and preserve overrides. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## The epidemic case exposes multilingual, prospective demands

Public-health event coding must recognize reports across languages and before a retrospective benchmark stabilizes. It preserves publication time, location, event type, and evidence while handling duplicate reports, making prospective evaluation and expert adjudication part of the system rather than cleanup. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## Why ACLED is a difficult codebook

[ACLED's methodology](https://acleddata.com/methodology/) combines event definitions, actor conventions, geography, dates, and inclusion rules. A fluent summary can violate one field's policy, so executable structure must localize disagreement to event detection, arguments, entity linking, or a policy edge case.

Social-media coding extracts symptoms, prevention, deaths, and locations across languages for epidemic research. Evaluate by language, region, event, and time; random splits can leak narratives of the same event.

ACLED contains multiple event types, actors, locations, fatalities, and relationships. One article can describe several events across sentences. Trigger-span extraction misses document-level distinctions, motivating abstractive full-text detection.

## Event-type detection

The first task ranks applicable event types from definitions and guidelines. Long codebooks may require retrieving candidate type descriptions, creating separate candidate-recall and classification stages. Stable event IDs and supporting spans are more auditable than free-form labels or unconstrained rationales. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## Typed argument extraction

Once type is known, Python classes represent event signatures and typed fields. Classes convert to JSON Schema and constrained decoding. Required, optional, enum, and nested types expose malformed output, but valid structure does not prove correct actors, locations, or relationships. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Every field needs a source span and cross-field checks. Unknown must remain representable so required schemas do not force guesses.

## Constrained decoding fixes syntax only

Python classes become JSON Schema, then a context-free grammar restricts tokens. This removes malformed JSON and illegal enum values. It does not select the right codebook type or factual value. Report format validity separately from semantic accuracy. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## Entity linking is a separate pipeline

Arguments must map to canonical entities, but candidate databases can contain thousands of names and local actors absent from Wikidata. Retrieval produces candidates, filtering narrows them, and assignment links arguments. Candidate recall and final accuracy need separate reporting. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Creating new entities remains a governance decision. A failed link can be a missing alias rather than a new actor.

## Why end-to-end automation remains insufficient

Errors compound across detection, extraction, and linking, particularly for long-tail types, languages, and guideline exceptions. The lecture explicitly concludes that automatic qualitative coding is not good enough. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

A suitable deployment pre-fills records, exposes uncertainty, and routes cases to expert review. Measure acceptance, field edits, missed-event audits, consistency, and time per validated record—not row volume alone.

## Build a small AQC study

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Define five event types with inclusion, exclusion, arguments, positive examples, and near-misses. Have two reviewers annotate twenty documents and resolve disagreements into codebook v1.

Evaluate ranked event types, typed arguments with spans, and entity candidates separately and end to end. Route low confidence, conflicts, and missing evidence to review. Version codebook revisions and rerun the fixed corpus with migration notes.

## Programmatic constraints fix structure, not truth

The lecture represents guidelines as Python classes and typed fields, converts them to JSON Schema and a context-free grammar, and uses constrained decoding. This prevents missing fields, invalid types, and malformed JSON. It does not guarantee correct event classification, values, or cross-event relationships. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Entity linking remains separate. Candidate sets can exceed context and many domain actors are absent from Wikidata. The pipeline retrieves a manageable candidate set, filters it, then assigns arguments to domain entities. Each stage needs its own recall and accuracy diagnosis.

## Why experts remain necessary

Qualitative coding derives value from consistent application of a codebook, not from row volume. Evolving category boundaries, regional wording, source bias, and compound events require expert judgment. The deck explicitly finds end-to-end automation insufficient. Useful roles are pre-filling, prioritization, and uncertainty routing. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Build a small codebook over twenty documents. For every event type, write one positive example and one near-miss exclusion. Require source spans and confidence in model output; route low-confidence or conflicting labels to review. Re-run the fixed set after every codebook revision.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The lecture summarizes active research and multiple datasets without publishing the complete annotation manual, review workflow, or training/evaluation code. This article does not present the research pipeline as an unattended production system.

## References

- [Lecture 9: Document Set Analysis—Qualitative Coding](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf)
- [ACLED methodology](https://acleddata.com/methodology/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 8: Long-Document Analysis](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
