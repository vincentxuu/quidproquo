---
title: "Stanford CS224V Lecture 10: How SPINACH Explores Wikidata and Builds SPARQL"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, knowledge-graph, sparql, agentic-ai]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 11
tldr: "SPINACH does not guess complete SPARQL in one shot. It searches entities and properties, inspects Wikidata entries and examples, executes small queries, and composes a final query under explicit action and stopping rules."
description: "CS224V Agentic AI for Knowledge Base Queries: Wikidata and SPARQL challenges, parsing baselines, SPINACH actions, loop control, datasets, and evaluation."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-agentic-knowledge-base)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

This lecture was already titled “Agentic AI for Knowledge Base Queries” in Fall 2025. That does not authorize mixing in the course-wide Autumn 2026 rename. Its historical scope is precise: make an agent construct SPARQL the way a knowledgeable Wikidata user does—by inspecting the graph while writing the query.

## Agenda: KBQA, the agent, and evaluation data

The deck introduces Wikidata's RDF graph and SPARQL, then explains schema discovery in knowledge-base QA. It compares fine-tuned parsing, prompted parsing, and subgraph retrieval before developing [SPINACH](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf)'s action loop. The final sections cover a dataset derived from real Wikidata help discussions, baselines, ablations, and a possible extension to SQL databases.

## Why one-shot SPARQL fails

Wikidata lacks the fixed typed schema of a relational database. Before answering where a film was shot, a system must resolve the correct entity QID, identify the property PID, and inspect qualifiers and actual property usage. An LLM may know SPARQL syntax while guessing the graph structure incorrectly. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Direct semantic parsing is fast and explicit. Subgraph retrieval explores neighboring facts but does not naturally preserve all relational operations available in SPARQL. SPINACH combines them: keep SPARQL's expressiveness while confirming structure through actions.

## RDF is schema-on-read

Wikidata entities connect through properties and qualifiers without fixed columns shared by every entity type. SPARQL supports joins, filters, aggregation, paths, and qualifiers, but authors must discover QIDs, PIDs, direction, and usage. Entity and property pages function as schema-on-read tools. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

## Three KBQA baselines

Fine-tuned parsers learn question-SPARQL pairs but need annotation and can struggle with new properties. Prompted models know syntax but hallucinate graph identifiers. Subgraph retrieval handles local facts but loses full SPARQL expressiveness and can overflow context. SPINACH combines iterative discovery with a formal final query. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

## The expert workflow

Human authors start with a small query, inspect uncertain entities or properties, execute, and add clauses. SPINACH records this as thought/action/observation history. The final answer must come from `execute_sparql`, not a value casually seen on an entity page, preserving replayable provenance. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

## Four actions, four uncertainties

`search_wikidata` resolves names; `get_wikidata_entry` inspects local graph structure; `get_property_examples` clarifies property semantics; `execute_sparql` probes or runs the final program. Outputs should disclose truncation because absence from a truncated result is not evidence of absence. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

## Loops, rollback, and budgets

Canonical duplicate detection blocks repeated empty queries. Rollback abandons a bad branch, while total action limits bound cost. Completion requires successful execution and an appropriate projection. Real services also need honest no-answer behavior because, unlike a benchmark, the graph may not contain an answer. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

## A dataset from real help requests

SPINACH data comes from Wikidata Request a Query discussions, capturing questions and edits that trouble actual users rather than only template-generated language. It also carries selection bias and live-graph drift. Evaluation should preserve endpoint date and separate service failure from semantic failure. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Equivalent SPARQL complicates string matching, while answer-only comparison changes as Wikidata updates. Execution, structure, and reviewed equivalence provide complementary evidence.

## Action ablations and trace analysis

Removing actions tests whether each tool resolves its intended uncertainty. Final accuracy alone is insufficient: a model may replace lookup with repeated execution. Report success, actions, repeats, tokens, and endpoint calls. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Label trace failures as entity resolution, property selection, composition, execution repair, or stopping. “Agent reasoning failed” is too coarse to guide changes.

## Extending the approach to SQL

Fixed schemas often make one-shot SQL parsing sufficient. Large unfamiliar databases can still benefit from schema inspection, distinct-value lookup, explanation, and read-only execution. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

> **Author extension:** Enterprise SQL authorization and cost controls are deployment recommendations from this article, not a reported agentic-SQL mechanism in the deck.

Production SQL agents should add sandboxing, row-level policy, and query-cost limits; replacing SPARQL syntax in the SPINACH prompt is not a deployment design.

## Rebuild a minimal experiment

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Use ten multi-property Wikidata questions with gold identifiers, query, and answer. Restrict the agent to the four lecture actions and log requests, truncation, latency, and observations. Add duplicate detection, query validation, and budgets.

Annotate each step's information gain and compare action ablations on success and cost. Add no-answer and endpoint-failure cases so the system distinguishes absent graph data, unresolved queries, and unavailable service.

## The action set is the research method

The lecture provides four core actions: `search_wikidata` for entities and properties, `get_wikidata_entry` for outgoing edges, `get_property_examples` for usage, and `execute_sparql` for partial or complete queries. Each turn emits one thought and one action, then waits for an observation. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

This mirrors an expert: begin with a small query, look up uncertain identifiers, execute, inspect, and add clauses. The final result must still come from `execute_sparql`; text seen on an entity page is not silently substituted for the requested query result.

## Loops and stopping are part of the algorithm

An agent can repeat the same empty action. SPINACH detects repetition, rolls back, and caps actions. Without budgets and stopping conditions, exploration becomes unbounded cost; stopping too early leaves only a partial subgraph. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf))

Evaluation should therefore retain action traces. The deck reports action ablations in addition to final query or answer results. Its dataset comes from real Wikidata query-request discussions, capturing structures that trouble users rather than only template-generated questions.

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Choose one Wikidata question and forbid yourself from writing the complete query immediately. List every uncertain QID or PID and select an exploratory action. After every observation, write which hypothesis it ruled out. An action that never changes the next step should be removed from the tool set or trace.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public slides include action definitions, a prompt summary, and result tables, but not the complete harness, all traces, or classroom discussion. This article describes Fall 2025 SPINACH only and infers nothing from the Autumn 2026 rename.

## References

- [Lecture 10: Agentic AI for Knowledge Base Queries](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf)
- [Wikidata Query Service](https://query.wikidata.org/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 6: database-agent comparison](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
