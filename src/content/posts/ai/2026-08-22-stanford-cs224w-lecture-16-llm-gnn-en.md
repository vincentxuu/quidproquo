---
title: "Stanford CS224W Lecture 16: LLM + GNN: Letting Language Models Read Graphs and Graph Models Read Text"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 17
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 16, covering Complementary gaps in LLMs and GNNs, Text-attributed graphs, The LLM as predictor or encoder while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 16, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-16-llm-gnn)

This is **Lecture 16 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-11-18. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and the [official slide artifact linked in that row](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture. Where a slide filename differs from the lecture number, the Fall 2025 schedule row remains canonical.

## Complete lecture agenda

### 1. Complementary gaps in LLMs and GNNs

LLMs excel at text and broad knowledge but do not guarantee multi-hop graph reasoning; GNNs aggregate along edges but often lack textual semantics and open vocabularies. The design question is which module understands language and which preserves structure.

### 2. Text-attributed graphs

A text-attributed graph attaches text to nodes or edges. One pipeline encodes text into features before a GNN; another serializes neighborhoods into a prompt. The former preserves graph inductive bias, while the latter is sensitive to context length and serialization order.

### 3. The LLM as predictor or encoder

An LLM may directly predict a graph task, produce node embeddings, or supply pseudo-labels and explanations. These roles have different costs: embedding an entire graph through an API is unlike processing only a query neighborhood.

### 4. Graph retrieval for LLMs

In the reverse direction, a graph retriever selects a query-relevant subgraph before an LLM reads its structure and text. A fluent generator cannot restore facts omitted by retrieval, so retrieval recall needs separate evaluation.

### 5. G-Retriever and the GraphRAG pipeline

G-Retriever composes a query, graph retrieval, subgraph pruning, and generation. Track retrieval metrics, answer metrics, and token cost separately to locate the source of any improvement.

## Deep lecture agenda

### Complementary gaps
GNNs exploit structure but may lack semantics; LLMs understand text but do not preserve topology or exact paths. A hybrid must identify which gap each component fills.

### Text-attributed graphs
Nodes and edges carry documents or descriptions alongside connectivity. Text availability and duplication across splits require the same cutoff audit as edges.

### LLM as encoder
An LLM turns node text into GNN features. Frozen embeddings reduce cost; fine-tuning adds adaptation, leakage risk, and versioning requirements.

### LLM as predictor
Serialized neighborhoods can be prompted directly. Ordering, truncation, and structural invariance become part of the model.

### GNN enhanced by an LLM
LLM features or pseudo-labels can enrich graph learning. Compare simpler text encoders and exclude target-bearing generated supervision.

### LLM enhanced by a graph
Graph retrieval supplies connected evidence to generation. Retrieval quality and answer faithfulness need separate evaluation.

### The G-Retriever pipeline
G-Retriever selects a compact query subgraph, encodes it, and conditions an LLM. Pruning saves context but may remove the decisive path.

### GraphRAG evidence
GraphRAG retrieves multi-hop evidence before generation. Claims must trace to retrieved nodes and edges rather than parametric memory.

### KG construction
Extraction, entity linking, relation extraction, and deduplication define the retrieval graph. Errors create false paths or fragmented entities.

### Training
Frozen encoders, alignment projections, fine-tuning, and joint objectives have different cost and leakage boundaries. Record all trainable modules and corpora.

### Evaluation
Measure answer quality, retrieval recall, evidence precision, faithfulness, latency, and cost. End-to-end accuracy cannot locate the failing stage.

### Acceptance
Use known supporting paths, distractors, and missing-evidence queries; trace linking, retrieved edges, serialization, input, answer, and citations.

## Implementation, failure modes, and acceptance

### Entity linking
Ambiguity attaches queries to wrong nodes and missed aliases fragment evidence. Report candidates, confidence, and sensitivity.

### Subgraph pruning
Top-k and path limits trade recall for context. Measure whether the gold path survives each budget.

### Serialization
Preserve types, direction, IDs, and provenance, then reorder equivalent serializations to test robustness.

### Fine-tuning leakage
Instruction data may contain benchmark answers or future facts. Deduplicate sources and enforce time boundaries.

### Hallucination audit
Classify statements as supported, contradicted, or absent from retrieved evidence. Fluency without a path is not grounding.

### Acceptance test
Remove the decisive edge and require abstention or answer change; add distractors and verify citations remain evidence-bound.

## Self-study checkpoint

Decompose the pipeline into graph construction, retrieval or sampling, encoder, prediction head, and evaluation. Replace one component at a time and retain cost and failure traces so any improvement remains attributable.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 16 official slides](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf)
