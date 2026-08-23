---
title: "Stanford CS224V Lecture 8: SLIDERS Turns Long-Document Sets into Queryable Tables"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, long-context, information-extraction, sliders]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 9
tldr: "SLIDERS induces a question-specific schema, applies semantic chunking and contextualized extraction, reconciles duplicate rows, and answers with SUQL instead of feeding every long document directly to one model."
description: "CS224V Long-Document QA: training versus chunking, SLIDERS schematization, semantic chunking, contextualized extraction, reconciliation, and preliminary evaluation."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-long-document-qa)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 8 scales to sets of long documents. Comparing annual reports, medical records, news, or invoices requires evidence scattered across sections and files. A larger context window does not itself integrate documents or expose queryable intermediate state. SLIDERS converts text into a table tailored to the question.

## Agenda: two approaches, then SLIDERS

The deck contrasts training-based and chunking-based methods, then names three chunking problems: representation, broken semantic boundaries, and integration of many local outputs. It builds SLIDERS through schematization, semantics-driven chunking, contextualized extraction, reconciliation, SUQL querying, and preliminary evaluation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Induce a schema before extraction

Map-reduce pipelines often summarize each chunk, then ask another model to combine summaries. At scale the summaries become another long input, and early omissions cannot be recovered. SLIDERS induces fields from the user's question and emits structured rows from relevant chunks. A question comparing share counts and dates creates fields for company, value, date, and source location rather than generic summaries. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Training and chunking allocate cost differently

Training-based methods invest in data and model capability for repeated long-context tasks. Chunking uses existing models and parallel local processing but pays for boundaries and reduction. Running summaries are compact yet order-dependent and lossy; structured chunk outputs are inspectable but require a schema. SLIDERS automates that schema and reconciliation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Schematization turns questions into data models

A comparison question induces typed fields for entities, dates, values, units, reasons, and provenance. A narrow schema misses evidence; a generic one degenerates into summaries. Multi-question schemas can amortize extraction, while domain experts add dependencies and unit rules. Schema versions must remain attached to rows. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Semantic chunks preserve logical units

Fixed windows split headers from tables and antecedents from pronouns. Overlap reduces omission but creates duplicates. Semantics-driven chunking preserves paragraphs, tables, sections, line numbers, and outlines while keeping sizes manageable. Evaluate answer-bearing-unit preservation, not only average length. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Contextualized extraction

Each relevant chunk receives schema and document context and emits a typed JSON row with source coordinates. A lightweight relevance step avoids expensive extraction on empty chunks. Missing information should remain missing; supporting context must not silently become primary evidence. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Reconciliation is the real reduction step

Exact deduplication cannot merge aliases, units, or partial rows. Reconciliation identifies entities or events, distinguishes legitimate temporal differences from conflicts, and preserves parent rows and merge decisions. Reversible provenance is essential. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## SUQL supports repeated questions

The reconciled table supports filters, grouping, sorting, comparison, and text functions. A follow-up changing a year can rerun the query without re-extraction. A genuinely new concept triggers schema revision and targeted extraction instead of rereading everything. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Read preliminary evaluation cautiously

The lecture explicitly labels results preliminary. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

> **Author extension:** Production readiness should separately test document-type generalization, expert assessment of schemas and merges, cost, latency, and gold artifacts at each pipeline layer.

Scale reports need documents, chunks, relevance rate, rows, calls, tokens, and wall time. Parallel extraction does not eliminate growth in reconciliation and query tables.

## Build a verifiable miniature

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Use five related documents and three comparison questions with gold fields and spans. Run semantic chunking, schema induction, relevance, extraction, and reviewed reconciliation. Query only the resulting rows.

Compare fixed versus semantic chunks, isolated versus contextual extraction, and exact deduplication versus reconciliation. Test a new question to determine whether the existing schema supports query-only reuse or requires targeted re-extraction.

## Provenance must survive the table

Each normalized cell must still point to its document, section, and source span. Reconciliation retains conflicting candidates and its resolution rule instead of silently overwriting them. That lineage distinguishes extraction error from aggregation error and allows a changed document to invalidate only affected rows. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## Permissions and incremental updates

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Extraction caches, reconciled tables, and answer indexes must preserve source access controls. Changed documents need versioned re-extraction and targeted reconciliation; otherwise a structurally correct table can expose restricted text or answer from stale evidence.

## Chunking is not a fixed token count

Fixed windows split tables, paragraphs, and definitions. Semantics-driven chunking preserves logical units and document structure. Contextualized extraction first tests relevance, then adds nearby or document-level context so a chunk is not interpreted in isolation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

Independent extraction still creates duplicate or conflicting rows. Reconciliation merges references to the same event, retains provenance, and handles field differences. A semantic parser then translates the question into SUQL over the table, using textual fields only where required.

## The design optimizes integration

SLIDERS is not merely a way to process more tokens. It maps local evidence into consistent rows that can be inspected and requeried. The table can support new questions, though a schema fitted too closely to one question raises re-extraction cost. The lecture considers shared multi-question schemas and domain-expert refinement. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf))

## A concrete experiment

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Take three reports and one comparison question. Hand-design five fields and retain `document_id`, `chunk_id`, and source text during extraction. Identify duplicate rows, missing fields, and cases requiring cross-chunk context. Define reconciliation before generating prose.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The deck explicitly calls its evaluation preliminary. It does not establish a mature production benchmark or publish the complete pipeline, cost analysis, or recording. This article preserves that research-stage qualification.

## References

- [Lecture 8: Question Answering on Sets of Long Documents](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 7: SUQL](https://web.stanford.edu/class/cs224v/lectures/l-suql.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
