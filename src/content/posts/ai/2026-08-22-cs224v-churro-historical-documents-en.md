---
title: "Stanford CS224V Lecture 12: CHURRO Makes Multilingual Historical Documents Searchable"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, vision-language-model, ocr, historical-documents]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS224V"
  order: 13
tldr: "CHURRO represents full-page text, layout, and metadata in HDML, unifies multilingual historical data for a page-level VLM, and connects extraction to HistoryGenie for searchable, conversational archives."
description: "CS224V NLP Building Blocks: historical OCR gaps, HDML, CHURRO-DS, the CHURRO VLM, benchmarking, and HistoryGenie."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-churro-historical-documents)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

The schedule labels Lecture 12 “NLP Building Blocks,” while its deck is specifically “Vision-Language Models to Make Historical Documents Accessible.” It is not a general NLP-components survey. It presents [CHURRO](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf) from representation and data through model and historical-research application.

## Agenda: data and systems for historical OCR

The lecture surveys digitization projects and document/OCR benchmarks, then explains gaps in layout, handwriting, languages, and annotation. It covers full-page extraction, HDML, CHURRO-DS, the CHURRO VLM, cross-model evaluation, and integration with WikiChat and HistoryGenie. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

## A historical page is not a clean line of text

Pages contain columns, footnotes, marginalia, captions, damage, and mixed writing systems. Plain OCR drops reading order and metadata; isolated crops lose page structure. Page-level VLMs retain the full image but need a consistent target representation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

HDML aims to represent the whole document and nothing but the document, combining text, layout structure, and metadata in a unique form. That supports training and dataset unification. CHURRO-DS combines existing and newly collected material across print, handwriting, languages, and centuries. This data engineering enables long-tail coverage.

## Digitization still leaves an access gap

Scanned collections may be searchable only by collection metadata. Without reliable transcription, names, dates, and low-resource language words remain invisible. Modern document benchmarks cover layout and OCR, but historical paper, scripts, handwriting, and language distributions differ. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

Flagship VLM errors on CHURRO motivate data acquisition rather than assuming scale alone fixes the domain.

## Scholarly transcriptions as supervision

Historical publications often pair page images with expert transcriptions. Turning them into training data requires alignment because editions can normalize spelling, add notes, or omit unreadable text. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

> **Author extension:** The following alignment/provenance recipe and train/research/no-redistribution classification are data-governance recommendations from this article, not rules stated by the deck.

Preserve publication, page, transformation, license, and provenance rather than treating every printed transcription as pixel-level truth. Track collection terms separately and classify material as usable for training, research-only, or not redistributable.

## Full-page VLM versus OCR pipelines

Traditional OCR separates layout, segmentation, and recognition; component errors cascade. Full-page models use cross-region context but can omit blocks or normalize language. Historical spelling and damaged text must be transcribed rather than made fluent. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

Dynamic resolution helps with page shapes, while tiny text and large tables can still require tiling. Evaluate whole-page completeness as well as local recognition.

## HDML as a training representation

HDML represents reading order, paragraphs, headings, tables, marginalia, image regions, missing text, and metadata in a consistent serialization. A simple schema loses layout; a complex one spends capacity on tags. Syntax validity and image-region alignment require separate checks. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

## Unifying CHURRO-DS

According to the [official Lecture 12 deck](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf), CHURRO-DS spans twenty-two centuries and multiple language clusters. Source datasets differ in annotation, normalization, crops, and metadata. They must be converted, aligned, deduplicated, and split without leaking neighboring pages of one document. Report documents, pages, languages, centuries, print/handwriting, and source—not only total size.

Per-language results need sample counts so large language clusters do not hide unstable long-tail performance.

## Model comparison boundaries

The [official deck](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf) identifies the compact base as a Qwen VL 2.5 3B-class model. CHURRO fine-tunes that compact open-weight VLM and compares commercial models, open VLMs, and OCR systems across print, handwriting, and languages. Fair comparison needs consistent resolution, prompt, normalization, and metrics. Closed APIs change, so the lecture table is a snapshot.

Character error alone misses omitted columns, reading-order errors, metadata, and critical names or dates. Preserve page, layout, text, and targeted entity evaluation.

## From transcription to HistoryGenie

Indexing OCR output reintroduces retrieval and grounding failures. Answers should link to transcription and original page image. Normalized spelling can improve search but must remain separate from diplomatic text. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

Classroom and historian use demonstrates practical exploration, not automatically OCR accuracy or learning outcomes. These evidence layers should remain distinct.

## Layered evaluation

**Author extension:** Audit source, license, alignment, and split leakage; then page/layout/text/metadata; then retrieval; then claim-to-page grounding. Analyze by writing mode, language, century, scan quality, and layout, with targeted names, places, dates, and numbers.

## A ten-page prototype

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Define a small HDML subset and transcription guideline for ten varied pages. Have two reviewers align elements to coordinates. Evaluate model output for syntax, completeness, reading order, and text.

Index the result and write five page-grounded queries. Keep normalization separate and trace three failures through OCR, retrieval, and generation.

## Model scores are not the endpoint

The CHURRO VLM fine-tunes an existing vision-language model. The lecture compares commercial VLMs, OCR systems, and open models across print, handwriting, and languages. Dataset composition remains critical: overall averages conceal sparse-language and script failures, so per-language and document-type results matter. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf))

HistoryGenie connects page extraction to search and conversation. Provenance must remain visible: answers should link back to page images and extracted text so historians can identify OCR errors rather than treating a model transcript as the primary source.

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Select ten pages from one collection and define representation rules for reading order, marginalia, and missing characters. Preserve image coordinates, HDML/text output, and corrections. Evaluate layout, text, and metadata errors separately instead of hiding them in one score.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The course site provides slides but no recording or complete reproducibility bundle. The deck summarizes the EMNLP 2025 work; this article does not infer undisclosed training details or costs from its charts.

## References

- [Lecture 12: Vision-Language Models for Historical Documents](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)
- [HistoryGenie](https://history.genie.stanford.edu/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 5: grounding free text](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)
