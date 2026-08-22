---
title: "CS336 Lecture 13: Data Does Not Fall from the Sky, and Every Source Has Access and License Costs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, training-data, common-crawl, copyright, llm]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 14
tldr: "Lecture 13 traces training sources through Common Crawl, Wikipedia, GitHub, arXiv, books, and open datasets. Technically accessible is not the same as licensed, and raw data is not training data; provenance must precede cleaning and mixing."
description: "A guide to Stanford CS336 Spring 2026 Lecture 13: web crawling, walled gardens, robots.txt, licensing and copyright risk, and the lineage from WebText and C4 to The Pile, RefinedWeb, Dolma, and DCLM."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-data-sources)

This post covers **CS336 Spring 2026 Lecture 13: Data (sources, datasets)**, taught by Percy Liang on May 11, 2026. Its primary source is the official executable lecture, [`lecture_13.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_13.py). This guide summarizes course material and is not legal advice.

Data is easily hidden behind “we used internet text.” Lecture 13 follows the path from a live service to a raw snapshot and later processed data, asking about origin, acquisition, and rights before Lecture 14 handles filtering, deduplication, and mixing.

## A web crawl is not a download of the entire internet

A crawler begins from seed URLs, discovers links, and downloads pages. Modern sites often require JavaScript, buttons, forms, or login state. Paywalls, CAPTCHAs, rate limits, geographic blocks, and bot detection make a public URL different from anonymous bulk access.

`robots.txt` expresses crawler preferences, terms of service may impose separate restrictions, and server load has real costs. Technical ability to bypass a control is not permission.

Common Crawl publishes periodic web snapshots in WARC, WAT, and WET forms and underlies many open datasets. It remains raw material containing templates, spam, duplicate pages, personal information, and copyrighted expression.

## Every source carries a different bias

Wikipedia is structured and clearly licensed but concentrated in style and coverage. GitHub contains abundant code alongside generated files, secrets, license differences, and repeated forks. arXiv supplies dense technical material but not ordinary conversation. Books provide long-form coherence with higher acquisition and rights risk.

Stack Exchange and Project Gutenberg each have their own licensing and community structure. A mixture is not the internet's natural distribution. It is an editorial outcome of crawlers, platform populations, licensing policy, and cleaning rules.

## Copyright, licenses, and fair use are separate questions

The lecture distinguishes expression from ideas and copyright from contractual licenses while reviewing generative-AI litigation. The durable engineering conclusion is not a universal legal rule. It is to preserve provenance: URL, crawl date, acquisition method, license, robots/ToS status, transformations, and deletion mechanisms.

Creative Commons, public-domain status, and direct agreements provide clearer bases for use. Missing license metadata does not mean missing copyright. A copy acquired from a shadow library does not become lawful automatically because later training may be transformative. Law continues to evolve, so governance must support reevaluation and source removal.

## Dataset generations encode sampling choices

BERT used Wikipedia and BooksCorpus. GPT-2 built WebText from outbound Reddit links. C4 cleaned Common Crawl. GPT-3 mixed filtered web, books, and Wikipedia. The Pile exposed a more explicit multi-source composition. RefinedWeb, Dolma, DCLM, Nemotron-CC, and Common Pile later changed filtering, provenance, or reproducibility.

Token count alone cannot describe this lineage. For every dataset ask: what are the raw sources, what snapshot date applies, how are languages selected, what filtering and deduplication occur, are document IDs retained, what is excluded, and can downstream users honor deletion requests?

## A raw-source manifest should precede training

Create one manifest row per source: owner or platform, acquisition method, time range, license and terms, content type, estimated scale, sensitive-data risk, permitted uses, and opt-out/deletion process. Keep immutable raw snapshots and track transformations through versioned programs and output hashes.

Without a manifest, failures can only be traced by guesswork. With one, a team can reconstruct what a checkpoint saw and reprocess sources when legal, privacy, or quality judgments change.

Lecture 13 is not a request for a longer source list. It treats acquisition as a first-class model system rather than a one-time download before training.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. Legal sections summarize the course's framework and engineering implications; specific uses require jurisdiction-specific professional advice.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 13 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_13.py)
- [Common Crawl](https://commoncrawl.org/)
- [DataComp-LM](https://arxiv.org/abs/2406.11794)

