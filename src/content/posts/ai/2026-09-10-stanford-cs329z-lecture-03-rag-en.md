---
title: "Hand-Build Your First RAG: From Chunking to Agent-Decided Retrieval | Stanford CS329Z Lecture 3"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 4
tldr: "Lecture 03 starts from the project question and works through RAG's motivation, chunk boundaries, approximate vector search, BM25 / dense / hybrid / rerankers, and letting the agent decide when to retrieve. The assigned Lewis et al. RAG paper and ColBERT add the original recipe and late interaction."
description: "A page-linked guide to the CS329Z Lecture 03 RAG slides, digests of Lewis et al.'s RAG paper and Khattab and Zaharia's ColBERT, and an exercise that turns a hand-built RAG into comparable variants."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 3 (Sep 30, Retrieval-Augmented Generation) is the first complete compound system: retrieve what the model does not know, then generate. The slides cover indexing (chunking, contextual retrieval, RAPTOR, HNSW), retrievers (BM25, DPR, hybrid), reranking, ColBERT and agentic RAG, and this lecture also introduces the course project.

The assigned readings are Lewis et al.'s [RAG paper](https://arxiv.org/abs/2005.11401), Karpukhin et al.'s DPR, and Khattab and Zaharia's [ColBERT](https://arxiv.org/abs/2004.12832). This post digests RAG and ColBERT; together they form the blueprint for the email-retrieval pipeline at the start of [HW1](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en). The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 03 slide guide

<div class="slide-reader" data-slide-reader data-pages="63" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf">
<p>63 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–9: Start a project with a question, data, and evaluation

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=1" data-slide-page="1">Slides 1–9</a>

Project guidance asks for a task, research question, data source, and success criteria before implementation. Suggested topics include schedule assistants, research discovery, and coding agents. A demo that succeeds once provides weak evidence; baselines, multiple tasks, and failure analysis make the result assessable.

For an original internal knowledge-assistant exercise, collect real questions, identify supporting passages and unanswerable cases, then choose a retriever. This exposes missing data and scoring rules early.

### Pages 10–22: Retrieval motivation and the original RAG formulation

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=10" data-slide-page="10">Slides 10–22</a>

“Which office hour is least crowded?” distinguishes generic expectations from current queue records. A retriever finds evidence and a reader or generator answers. Original RAG combines DPR retrieval with BART generation and weights possibilities using retrieval probabilities. Sequence and Token formulations differ in marginalizing retrieved documents across a whole answer or individual tokens.

Keep that jointly trained research architecture separate from a fixed retriever connected to a chat model. The paper digest below covers its experiments. First check whether an answer can identify the passage that supports it.

### Pages 23–31: Chunk boundaries determine whether evidence remains intact

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=23" data-slide-page="23">Slides 23–31</a>

Different splits of the same grading policy can separate a deadline from its late-day restriction. Fixed-size chunks are simple but can cut meaning; sentence or structural splits preserve boundaries with less uniform lengths. Contextual retrieval adds document context to a passage; late chunking embeds a longer document before deriving chunk representations.

The ACME revenue example shows why a growth figure needs its company and quarter. Test whether retrieval identifies all three, and retain the original document identifier so generated context is not mistaken for quoted evidence.

### Pages 32–38: Cross-passage questions and approximate vector search

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=32" data-slide-page="32">Slides 32–38</a>

RAPTOR uses hierarchical summaries to retrieve beyond isolated chunks; the Cinderella examples contrast a local fact with a story-level question. GraphRAG builds entities, relationships, communities, and summaries. These representations add indexing work and can introduce summary errors, so establish that your questions need global synthesis.

Vector search then addresses scale. Exact search compares every candidate; HNSW navigates a layered neighbor graph approximately. Approximate-index misses and embedding failures are separate causes and should be measured separately.

### Pages 39–54: Sparse, dense, hybrid, and reranking solve different problems

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=39" data-slide-page="39">Slides 39–54</a>

BM25 scores lexical overlap with frequency saturation and length normalization. DPR embeds questions and passages separately. Their complementary failures motivate hybrid retrieval and rank fusion such as RRF. A cross-encoder models query–passage interaction over a smaller candidate set; ColBERT retains token vectors for late interaction.

Choose metrics to match the task: Hit@k asks whether any relevant result appears, Recall@k measures how much relevant evidence was recovered, MRR tracks the first relevant rank, and nDCG scores ranked relevance. A question needing two pieces of evidence can pass Hit@k while still lacking a necessary source.

### Pages 55–63: An agent decides when to retrieve and when to stop

<a href="https://web.stanford.edu/class/cs329z/slides/lecture03.pdf#page=55" data-slide-page="55">Slides 55–63</a>

Earlier components answer how to retrieve for a given query. Agentic RAG also decides whether to search and how to revise the question. Self-RAG integrates retrieval and critique signals, CRAG grades retrieval quality, and Search-R1 learns a multi-turn search policy. They address different control decisions.

The final slide separates retriever failures, reader failures, and loop failures: missing, stale or unauthorized evidence; position bias, distraction or conflict; and compounding errors, absent stopping rules, or injection. Test an unanswerable question and verify that the system stops and identifies the missing evidence.

## Reading | Lewis et al.: retrieval participates in generation and training

[Required reading](https://arxiv.org/abs/2005.11401)

### TL;DR

Original RAG joins DPR and BART, marginalizes over retrieved documents, and trains the query encoder with the generator; swapping the index changes external knowledge.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | NeurIPS 2020 research across open-domain and abstractive QA, question generation, and fact classification, with ablations and index replacement. |
| Boundary | Results concern the paper’s models and data. A fixed retriever plus chat model does not reproduce its joint training or guarantee factuality or access control. |
| Reading value | Useful for understanding joint retrieval-generation modeling. |

### Background

Parametric knowledge is difficult to update and attribute. An external index creates an independently replaceable source of evidence, making retrieval quality part of the answer pipeline.

### Intermediate guide

**RAG: the recipe for a first compound system**

[The first lecture](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems-en) argued the systems era is here; this lecture hands over the recipe. The RAG paper's problem statement is precise: big models store knowledge in parameters and fine-tune well, yet remain weak at *retrieving and manipulating* that knowledge — with provenance and knowledge updates unsolved. The fix is parametric plus non-parametric memory: a seq2seq model ([BART](https://arxiv.org/abs/1910.13461)) over a dense Wikipedia index, reached through a neural retriever ([DPR](https://arxiv.org/abs/2004.04906)).

Two formulations: RAG-Sequence marginalizes whole-answer probabilities over individual retrieved documents; RAG-Token marginalizes over documents at each output token. Jeopardy generation shows the difference best: answers often fuse two unrelated facts, so the Token variant reads one document for the first half and switches for the second.

The training setup deserves its own note: retriever and generator train together with no labeled retrieval answers, freezing the document encoder and tuning only the query encoder plus the generator. Retrieval is a DPR bi-encoder — separate BERT encoders for documents and queries, inner-product similarity, top-K via approximate MIPS. Generation is BART-large with input and retrieved passages simply concatenated.

The experiments cover four task families. Open-domain QA (NQ, TriviaQA, WebQuestions, CuratedTrec) set the best known scores — with generative answers beating extractive predecessors. Documents hinting at the answer without quoting it can still contribute, and RAG answers correctly even when the correct answer string is absent from retrieved documents, achieving 11.8% accuracy on that subset of NQ, where extractive models score zero. Abstractive QA (MS-MARCO) beats BART by over two BLEU points. Jeopardy generation went to blind human judges: RAG more factual than BART in forty-three percent of pairs against seven. FEVER verification: measured by article-title overlap, the top result comes from a gold article in 71% of cases, and the top ten contain a gold article in 90%.

The ablations answer questions HW1 will raise: freezing the retriever costs performance on every task, and swapping dense retrieval for BM25 loses everywhere except entity-dense FEVER, where word overlap still rules. Training retrieves five to ten documents; at test time the Sequence variant keeps improving with more, the Token variant plateaus at ten.

Knowledge updates are equally direct: swap the index file. The authors indexed two Wikipedia vintages and quizzed world leaders — matched indices score 70% and 68%; mismatched indices score 12% and 4%, with no retraining. That is the mechanism behind Lecture 1's "dynamic" argument. Related work in one line: REALM and ORQA stayed extractive; RAG is the first general generative recipe for hybrid memory.

For the course, RAG provides a concrete compound-system template — Lecture 1's three design questions (control logic, resource allocation, end-to-end optimization) finally take a buildable shape.

```diagram
title: RAG combines two sources of knowledge
desc: The question and retrieved passages enter generation alongside knowledge in model weights.
caption: Conceptual diagram of the existing explanation; omits encoder internals and the Sequence/Token marginalization distinction.
---
<svg viewBox="0 0 440 448">
<path class="dg-line" d="M200 48H212Q220 48 220 56V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M108 80V116" marker-end="url(#arrow)"/>
<path class="dg-line" d="M108 184V216Q108 224 116 224H172V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M332 184V216Q332 224 324 224H268V260" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 328V364" marker-end="url(#arrow)"/>
<rect class="dg-box" x="16" y="16" width="184" height="64" rx="6"/>
<text class="dg-label" x="108" y="40" text-anchor="middle" dominant-baseline="central">Question</text>
<text class="dg-sub" x="108" y="60" text-anchor="middle" dominant-baseline="central">Query input</text>
<rect class="dg-box" x="16" y="120" width="184" height="64" rx="6"/>
<text class="dg-label" x="108" y="144" text-anchor="middle" dominant-baseline="central">Retrieve</text>
<text class="dg-sub" x="108" y="164" text-anchor="middle" dominant-baseline="central">External index</text>
<rect class="dg-box" x="240" y="120" width="184" height="64" rx="6"/>
<text class="dg-label" x="332" y="144" text-anchor="middle" dominant-baseline="central">Model weights</text>
<text class="dg-sub" x="332" y="164" text-anchor="middle" dominant-baseline="central">Parametric memory</text>
<rect class="dg-box dg-box--accent" x="80" y="264" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="288" text-anchor="middle" dominant-baseline="central">Generate from both</text>
<text class="dg-sub" x="220" y="308" text-anchor="middle" dominant-baseline="central">Question + passages</text>
<rect class="dg-box" x="80" y="368" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="400" text-anchor="middle" dominant-baseline="central">Answer</text>
</svg>
```

### Deeper points

Marginalization is a probabilistic mechanism, not a synonym for concatenating documents into one prompt. Index replacement establishes influence over answers, not perfect overriding of parametric knowledge.

### Reviewer in one sentence

Read it for joint modeling and ablations rather than a performance claim for every RAG product.

### Your take-away

Create two index versions with changed answers. Measure evidence retrieval, answer correctness, and citation support separately.

## Reading | Khattab and Zaharia: preserve token detail through late interaction

[Additional reading](https://arxiv.org/abs/2004.12832)

### TL;DR

ColBERT separately encodes query and passage token vectors, then scores them with MaxSim, trading index space for finer interaction than a single-vector retriever.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | SIGIR 2020 retrieval experiments on MS MARCO and TREC CAR, distinguishing reranking from full-collection search. |
| Boundary | Ranking metrics do not measure generated-answer accuracy; latency depends on hardware and candidate count, and token indexes consume more storage. |
| Reading value | Useful when fine-grained retrieval and index costs matter. |

### Background

A single-vector bi-encoder supports precomputation but compresses detail. Cross-encoders model each pair jointly at higher cost. Late interaction preserves finer matches while reusing passage encodings.

### Intermediate guide

**Further reading: ColBERT keeps fine-grained matching until the end**

[ColBERT](https://arxiv.org/abs/2004.12832) targets the gap between two retrieval extremes. A bi-encoder compresses each query and passage into one vector, making offline indexing easy but discarding fine-grained matches. A cross-encoder jointly processes every query–passage pair, preserving full interaction but paying a Transformer forward pass per candidate. ColBERT encodes query and document separately while retaining a contextualized vector per token. At scoring time, each query token takes its maximum similarity to any document token, and those MaxSim values are summed.

Document token vectors can be precomputed, so the same mechanism supports reranking and full-collection vector search. On the paper's MS MARCO setup, ColBERT reranking reached 34.9 MRR@10 at 61 ms, versus 34.7 at 10,700 ms for the cited BERT-base baseline in the same table. Its end-to-end run over 8.8 million passages reported 36.0 MRR@10, 96.8 Recall@1000, and 458 ms latency. Read those as a 2020 result under the paper's dataset, hardware, and implementation—not as a latency promise for a current deployment. The cost has not vanished either: storing many token vectors per passage makes the index substantially heavier.

The paper measures passage ranking, not downstream RAG factuality or answer quality. That boundary suggests the exercise: compare BM25, a single-vector dense retriever, and ColBERT on the same queries; measure Recall@k or MRR first, then feed identical-sized result sets to the generator and test whether better ranking actually becomes better answers.

### Deeper points

MaxSim finds each query token’s strongest passage-token match and sums the scores. Separate this scoring rule from approximate candidate search.

### Reviewer in one sentence

It shows how representation and computation placement change retrieval tradeoffs.

### Your take-away

Compare BM25, dense retrieval, and ColBERT on fixed questions; measure ranking, downstream answers, index size, and query time.

## What to do: modify your hand-built RAG

**What to do**: take the two-stage RAG you hand-built in Lecture 1 and rewrite it with one of Anthropic's five workflow patterns (covered in [Lecture 6](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en)). The smoothest pick is evaluator-optimizer: add a second LLM call checking the first call's output against the retrieved passages (exactly the example from the compound-AI post). Measure three things: accuracy delta, latency cost, which examples got fixed and which broke. Write the conclusion as one selection sentence: is this task worth an extra call? That is the question Anthropic wants answered before every complexity increase.

## Where it sits in the course

Lecture 3 builds the first working pipeline; [Lecture 4](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en) connects tools beyond retrieval. HW1 is released on Oct 5 and begins with retrieval over a corporate email archive, so this post's RAG exercise is a direct starting point.

## Course material for this lecture

- Official slides (PDF): [Retrieval-Augmented Generation — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- Assigned readings: Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (digested here); Karpukhin et al., "Dense Passage Retrieval"; Khattab and Zaharia, "ColBERT" (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 3 (Wed Sep 30), previously part of the "Week 2: workflows, agents, and a first hand-built RAG" guide; earlier entries below predate the split.
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Added a workflow/agent comparison and RAG architecture diagram to visualize existing explanations; no factual refresh.
- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.
- 2026-09-12: Added substantive guided readings of Effective Context Engineering and ColBERT.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 2: LLMs for Builders](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders-en), [Lecture 4: Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Lecture slides: [RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401), [Khattab & Zaharia, ColBERT, SIGIR 2020](https://arxiv.org/abs/2004.12832)
