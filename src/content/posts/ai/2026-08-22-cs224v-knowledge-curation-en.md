---
title: "Stanford CS224V Lecture 2: STORM, Co-STORM, and Knowledge Curation"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, deep-research, rag, storm]
lang: en
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 3
tldr: "STORM uses perspective-guided questions, simulated interviews, and outlines to broaden research; Co-STORM keeps a person in the loop so discovering unknown questions and co-editing become part of the system."
description: "The complete CS224V Knowledge Curation lecture: RAG, STORM pre-writing research and evaluation, Co-STORM discourse, and the DataSTORM assignment."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-knowledge-curation)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

Lecture 2 asks how pre-writing research can reveal dimensions the writer did not know to ask about. The schedule calls this Knowledge Curation. [STORM](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf) and Co-STORM are the central systems, followed by DataSTORM and Homework 1.

## Agenda: from RAG to collaborative research

The deck reviews retrieval and RAG, then identifies two weaknesses in ordinary search-driven writing: the initial question is often too narrow, and one-shot retrieval does not ask useful follow-ups. It covers STORM's research, generation, and evaluation pipeline; adds a person to Co-STORM's multi-agent discourse; and closes with DataSTORM's combination of web and database exploration. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

## Perspectives and outlines are inspectable state

STORM derives possible author and reader perspectives from existing articles. Perspective becomes a latent variable controlling breadth. A simulated interviewer asks an expert follow-up questions; the expert searches and answers with sources. The accumulated interviews become a hierarchical outline before section-level retrieval and writing begin. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

That intermediate state distinguishes STORM from “write a report about this topic.” Breadth can be inspected through perspectives and outline coverage, while grounding can be traced through interviews and sources. The lecture accordingly separates outline, organization, and factual-support evaluation rather than asking only whether the prose sounds good.

## Co-STORM: exploration is a conversation

STORM largely performs pre-writing research for a person. Co-STORM keeps the user in the discourse. Agents with different perspectives participate while a protocol decides who should respond, when a new dimension is useful, and how the user's questions enter shared knowledge. One goal is unknown-unknown discovery: helping a person discover what they did not know to ask. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

Its evaluation therefore has two levels: discourse depth and diversity, then the final report's ability to preserve and organize the exploration. A collaborative research tool cannot be judged only by its last answer.

## DataSTORM and Homework 1

The closing section expands beyond web pages. DataSTORM combines literature search with a data-exploration agent that proposes questions, queries a database, and returns findings. Students implement key pieces of DRLite in Homework 1; the assignment PDF, not the lecture diagram alone, defines the implementation boundary. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

## Knowledge curation adds a pre-writing stage to RAG

The lecture begins with query, retriever, ranked documents, and retrieve-then-generate. That baseline answers a well-formed local question, but it does not construct a research plan. For an encyclopedia-style article, the largest failure may be an important dimension that never enters a query. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

STORM makes pre-writing a first-class phase: discover related material, derive perspectives, conduct multi-turn simulated interviews, accumulate sourced notes, and build an outline before drafting. Breadth becomes an inspectable artifact before prose exists. Interview notes and citations also narrow verification from an entire fluent article to section, question, and source relationships.

## Perspective-guided QA controls breadth

A perspective is not merely a different tone. Roles such as historical, technical, policy, and practitioner viewpoints produce different questions and search paths. The lecture treats perspective as a latent variable because it controls evidence collection without directly becoming the answer. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

Simulated interviews permit follow-ups about definitions, counterexamples, chronology, and comparisons. This is closer to research than generating independent questions because later turns respond to discovered gaps. Evidence must remain attached at every turn; otherwise a mistaken premise can propagate through follow-ups.

The outline then reconciles notes into a hierarchy. Duplicate topics merge, evidence can support multiple sections, and isolated questions must earn a place. Without note-to-section provenance, article generation would revert to opaque free generation.

## Evaluation spans pipeline, artifact, and use

Outline-coverage metrics approximate pre-writing quality and support ablations of perspectives or interviews. They can also reward similarity to existing articles, so the lecture adds Wikipedia-editor evaluation of organization, breadth, and citations. In-the-wild deployment asks what people actually research and where the system fails. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

Reported usage and preference figures belong to the specific STORM studies. They do not prove that every deep-research agent works or that users learn more. The portable lesson is evaluation decomposition: outline, grounding, editorial quality, and use behavior are different outcomes.

## Co-STORM needs a discourse protocol

Multiple agents in one chat can repeat, compete, and branch without shared memory. Co-STORM therefore selects speakers, decides whether to deepen a thread or introduce a new dimension, and updates shared knowledge. Users can inject hypotheses and redirect exploration without resetting the discourse. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

Unknown-unknown discovery creates a tension. Immediate answers may be narrow; endless novelty can overwhelm. The lecture evaluates discourse, final reports, ablations, and human experience to determine whether the protocol introduces relevant new dimensions rather than noise.

## Distinct boundaries for STORM, Co-STORM, and DataSTORM

STORM targets literature-driven article construction. Co-STORM centers collaborative sensemaking. DataSTORM adds structured-data exploration. The choice depends on whether a task lacks literature breadth, human-machine exploration, or patterns in a database—not which system name is newest. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

Database evidence also changes provenance. A web claim can point to a URL and passage; a data finding needs query, schema, filters, and a result snapshot. Homework 1 sits at this boundary: a research agent must formulate data questions and preserve returned evidence, not merely call search.

None of the three makes a report trustworthy with one click. Sources, search, parsing, and generation still fail. Computational decomposition makes the responsible layer observable.

## Rebuild a minimal version

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Begin with a bounded topic and source set. Generate three non-overlapping perspectives and state which gap each covers. Conduct two sourced QA turns per perspective, requiring the second turn to pursue an unresolved point. Build a two-level outline only from notes and annotate every heading with support.

Generate one section at a time with only its notes. Then create a coverage table for unused evidence and a citation table for verifiable claims. Ask another reader to inspect the outline alone and identify expected missing dimensions.

To move toward Co-STORM, define speaker selection, shared notes, and interruption rules before adding agents. To move toward DataSTORM, add query logs and result provenance. Each extension should add an evaluation artifact, not only more agents.

## Cost and stopping conditions are research design

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

**Author extension:** Perspectives, interview turns, and section retrieval multiply calls quickly. A defensible run records whether it stopped because outline coverage was met, new questions produced duplicate evidence, or the budget was exhausted. It deduplicates syndicated sources by canonical publication and reports breadth separately from depth, since many shallow perspectives and a few long threads fail differently.

## Keep the citation chain intact

Every note needs a stable ID, source span, and URL; outline sections reference note IDs, and generated claims inherit them. Giving only note text to the writer and reconstructing citations later breaks provenance. When a sentence combines sources, claim-level support preserves which source supports which part, followed by human review of attribution and hedging. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

## When this method is the wrong fit

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Multi-perspective research adds noise when one authoritative source answers the question and is wasteful when the task is locating one fact. Time-sensitive, private, or confidential data also violate an open-web workflow's assumptions. A bounded corpus, executable query, or research brief without auto-generated prose is then safer.

## A pre-delivery curation audit

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Audit both directions. From the outline, require distinct research questions and inspected evidence. From the sources, check that important counterevidence was not omitted or misplaced. Label statements as directly supported fact, cross-source synthesis, or unresolved question so readers do not mistake synthesis for one source's claim.

## A concrete exercise

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Choose an unfamiliar topic, list three perspectives yourself, and generate an outline. Annotate every second-level heading with the perspective and evidence that produced it. Any paragraph that cannot be traced exposes the point where fluent generation outran research.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

There is no public recording, and oral explanations for several tables are unavailable. Usage and human-evaluation figures in the deck summarize the named studies; this article does not generalize them to every deep-research system.

## References

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 2: Knowledge Curation](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf)
- [Homework 1](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [Lecture 1: computational-thinking course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
