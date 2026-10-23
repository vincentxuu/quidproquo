---
title: "Tell Workflows from Agents Apart, Then Hand-Build Your First RAG | Stanford CS329Z Week 2"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 3
tldr: "Week 2 connects model internals to retrieval engineering: decoding, attention, training, inference and context budgets in Lecture 02; chunking, indexes, sparse/dense retrieval, reranking and agentic RAG in Lecture 03. Separate reading digests examine workflow selection and the RAG and ColBERT experiments."
description: "Page-grounded guides to CS329Z Lectures 02 and 03, followed by detailed readings of Building Effective Agents, context engineering, RAG and ColBERT, with mechanisms and diagnostic exercises."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Week 2 is deliberately sequenced. Monday (Sep 28, LLMs for Builders) assigns Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) (2024): learn when something should *not* become an agent before you start building, so you don't over-engineer on day one. Wednesday (Sep 30, RAG) assigns Lewis et al.'s [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) (NeurIPS 2020): the complete recipe for a first compound system, with indexing, retrieval, reranking, and agentic-RAG designs in the official slides. Together they are the blueprint for the first stage of [HW1](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), an email retrieval pipeline.

The official slides and assigned readings serve different roles. The page-by-page guides below cover both lectures; the following reading digests retain the arguments and experiments of the assigned sources. Examples and checks proposed by this article are teaching exercises, not official assignment solutions. Page ranges use physical PDF pages; repeated animation and section-divider pages are grouped.

## Lecture 02 slide guide

<div class="slide-reader" data-slide-reader data-pages="176" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf">
<p>176 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–23: From probability distributions to decoding

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=1" data-slide-page="1">Slides 1–23</a>

The opening locates this course at the application layer, then asks what a model actually produces. A sequence probability decomposes into conditional next-token probabilities. The animated “The class was about…” example shows multiple possible continuations; decoding chooses among them. Greedy selection takes the most likely token, top-k and top-p restrict sampling candidates, and beam search retains alternative sequences.

For an agent, this affects the stability of tool selection and arguments. Lower temperature can reduce sampling variation; it cannot validate arguments. Repeat the same input with a fixed tool schema and record wrong-tool choices separately from malformed output.

### Pages 24–62: How a Transformer reads earlier tokens

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=24" data-slide-page="24">Slides 24–62</a>

A sequence of animated diagrams builds a decoder-only Transformer: token and position embeddings, attention and feed-forward layers, then an LM head that predicts the next token. Queries and keys determine attention weights; those weights mix values. A causal mask excludes future tokens during training, and multiple heads operate in different representation subspaces.

Follow the changing arrows rather than treating every animation frame as a separate concept. When a model generates tool arguments, tool definitions and user constraints must be present in the context it can access. The architecture provides a route to that information, without guaranteeing correct use.

### Pages 63–91: Linear attention trades stored detail for efficiency

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=63" data-slide-page="63">Slides 63–91</a>

Full softmax attention retains keys and values for earlier positions. Linear attention updates a compressed state and lets new tokens interact with that state. The slides animate state retention and replacement, compare scaling behavior, then discuss long-context limitations and hybrid architectures.

A long advertised window does not establish reliable access to every detail. As an original exercise, move the same constraint to the beginning, middle, and end of a long document in your working language. Compare answer correctness and latency before choosing a model for that workload.

### Pages 92–118: Training stages shape what the model has learned

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=92" data-slide-page="92">Slides 92–118</a>

Starting with next-token cross-entropy, the lecture moves through pretraining data cleaning, deduplication and mixing; domain-focused midtraining; and instruction and preference post-training. Human preference labels can be unreliable or conflicting. Verifiable rewards use tests, proofs, or environment state, but the verifier still needs to represent actual task success. SWE-smith supplies the agent-training example.

Fluent writing and successful execution in your tool environment require separate acceptance checks. Give the model a failed tool result and inspect whether it changes arguments, changes strategy, or requests assistance.

### Pages 119–137: Prefill, decode, and the KV cache

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=119" data-slide-page="119">Slides 119–137</a>

Prefill processes the input; decode generates output step by step. Retained keys and values form the KV cache, allowing later generation to reuse earlier computation. This motivates measuring time to first token, output speed, and total duration separately. Speculative decoding uses a smaller draft model to propose continuations for a target model to verify.

For a multi-turn agent, inspect oversized tool results and repeatedly rewritten stable prefixes. These slides explain the mechanism; provider-specific cache eligibility and pricing require separate documentation. A KV cache, an application answer cache, and stored user memory serve different purposes.

### Pages 138–148: Extra inference compute needs a selection method

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=138" data-slide-page="138">Slides 138–148</a>

The lecture compares longer reasoning with repeated sampling. More candidates can increase the chance of finding a good answer, but a verifier or aggregation method must select it. Self-consistency uses agreement across reasoning paths and can still inherit shared errors. The jacket-price example asks readers to check the base of each percentage change rather than the length of the explanation.

An original exercise is to divide the same budget between one longer attempt and several shorter attempts. Keep the scoring rule fixed and measure success, cost, and latency together.

### Pages 149–159: Structured output supplies a component contract

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=149" data-slide-page="149">Slides 149–159</a>

Compound systems need a field-level contract between components. This section introduces constrained decoding, DSPy signatures, and tool calls. Restricting allowed tokens helps maintain structure; schema validity does not establish factual correctness or authorization.

In an original email example, extracting a valid meeting intent from “Thursday works” still leaves the date, time zone, and recipient unresolved. Validate structure, then meaning and required information, before dispatching execution.

### Pages 160–176: Context engineering preserves decision-relevant information

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=160" data-slide-page="160">Slides 160–176</a>

The final section treats system instructions, history, memories, tool results, and attachments as one context budget. It covers avoiding bloat, retrieving on demand, preserving reusable prefixes, comparing choices with evaluations, and retaining critical constraints through compaction. Recursive LMs introduce another approach to operating on externally held material. The summary leads into RAG.

Preserve the complete event record, then construct a shorter model input. Check that goals, unfinished work, and user prohibitions survive. This gives token reduction a concrete acceptance condition and connects to the Anthropic context-engineering reading below.

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

## Reading | Anthropic: when to use a workflow or an agent?

[Monday required reading](https://www.anthropic.com/engineering/building-effective-agents)

### TL;DR

Build the simplest workable version, then select chaining, routing, parallelism, dynamic delegation, or critique loops according to control needs. Justify each added layer.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | First-party practice guide based on customer and author experience, without a controlled benchmark covering all patterns. |
| Boundary | The taxonomy supports architectural reasoning, not a universal accuracy ranking; tool examples on the maintained page can change. |
| Reading value | Useful before architecture selection to locate the need for dynamic control. |

### Background

LLMs can occupy fixed pipelines or choose actions from environment feedback. The distinction concerns control and recovery rather than the presence of model calls. A fixed reporting process and exploratory diagnosis may need different control structures.

### Intermediate guide

**First, the split: workflows are not agents**

Anthropic's first cut is definitional. Workflows run LLMs and tools along **predefined code paths**; agents let the LLM direct its own process and tool use. Both are agentic systems, but the selection logic differs completely: predictable tasks on fixed paths call for workflows, unpredictable step counts with model judgment call for agents. And most applications need neither — a single LLM call with retrieval and examples is usually enough. That paragraph is the post's brake pedal; every pattern below must answer to it.

| Design question | Workflow | Agent |
|---|---|---|
| Who chooses the next step? | Prewritten program paths | The model, based on observations |
| When does it fit? | Repeatable, separable tasks | Steps cannot be fully predicted |
| What do you inspect? | Branches, inputs, outputs | Tool decisions, feedback, stopping conditions |

**Five patterns: the selection toolkit**

The building block is the augmented LLM: a model that writes its own search queries, picks tools, and decides what to remember — capabilities tailored to your case with an easy, well-documented interface. Up from there, five patterns in rising complexity:

**Prompt chaining**: each call processes the previous call's output, with programmatic gates in between. Use it when tasks decompose cleanly; you trade latency for accuracy.

**Routing**: classify the input, then send it down a specialized path. Use it when distinct inputs deserve distinct prompts — with the precondition that classification itself is accurate.

**Parallelization**: independent subtasks at once (sectioning), or the same task several times for a vote (voting). Anthropic recommends focused calls for distinct considerations when seeking speed or confidence; improvement on a particular task still needs evaluation.

**Orchestrator-workers**: a central LLM decomposes on the spot, delegates, and synthesizes. It differs from parallelization in that subtasks aren't predefined. Fits tasks whose decomposition varies with input, like multi-file code changes.

**Evaluator-optimizer**: one call generates, another critiques, in a refinement loop. Use it with clear grading criteria where iteration measurably helps — literary translation is the canonical example.

**Agents** come last: tool loops driven by environment feedback, with checkpoints and iteration caps. For open-ended problems with unpredictable step counts where you trust the model's judgment. Costly, with compounding errors — sandbox plus guardrails as standard kit.

**Framework advice: call the API directly first**

Anthropic's framework view is blunt: frameworks simplify model calls, tool definitions, and chaining, but each abstraction layer is a debugging blind spot — and an invitation to add complexity you don't need. Start with raw LLM APIs; the same patterns take a few lines of code. If you adopt a framework, understand what's underneath; wrong assumptions about internals are a top customer error source. Appendix 2 applies this to tool definitions: formats should be easy to write (diffs are harder than full rewrites, JSON escaping is costlier than markdown), models need tokens to think before committing, and definitions deserve junior-developer-grade docstrings. On SWE-bench the team spent more time tuning tools than the overall prompt — relative paths broke the model after directory changes, mandating absolute paths fixed it outright. That is ACI (agent-computer interface): whatever effort goes into HCI, tool interfaces deserve the same.

### Deeper points

Tool names, descriptions, boundaries, and arguments are part of the model interface. Improve them using observed mistakes and measure the result; a framework change alone does not repair ambiguity.

### Reviewer in one sentence

Its value is a testable reason for adding autonomy rather than an agent feature checklist.

### Your take-away

Draw the simplest flow for one task. Use an actual failure to justify a model-controlled step, then measure added latency and repaired failures.

## Reading | Anthropic: what should the model see at each step?

[Monday additional reading](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### TL;DR

Context engineering manages instructions, tools, history, and evidence together, using retrieval, compaction, and isolation to retain useful signals.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | First-party engineering guidance on long-running tasks, tool design, and context strategies. |
| Boundary | Strategies trade information loss against retrieval and coordination costs; the article provides no guaranteed effect size. |
| Reading value | Useful for designing context and tool inputs in long tasks. |

### Background

A long-running task accumulates observations each turn, moving the design problem beyond the wording of one prompt. Capacity alone does not establish correct use of every passage.

### Intermediate guide

**Further reading: context is a budget, not a bucket**

Anthropic's [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) widens the unit of design beyond prompt wording. Every inference sees a finite state assembled from system instructions, tool definitions, external data, message history, and tool results; the goal is the smallest set of high-signal tokens that still produces the desired behavior. Static context should stay crisp: tools with clear, non-overlapping contracts and token-efficient outputs, plus a few diverse canonical examples rather than an edge-case catalog.

Dynamic context should arrive just in time. Keep lightweight references such as paths, saved queries, and URLs, then progressively disclose only what the next decision needs. Long tasks add three distinct controls: compaction for an overgrown trace, structured notes for durable state outside the window, and subagents for isolating deep exploration. None is free: compaction can erase details whose value appears later, while autonomous retrieval adds latency and can send the agent down dead ends. This is first-party applied guidance, not a benchmark paper; it supplies a design checklist rather than a promised accuracy gain.

The Week 2 connection is operational. In the RAG exercise, do not stop at “retrieve top-k and paste it.” Hold the retriever fixed, vary top-k, chunk length, tool-result shape, and history pruning, then measure answer quality, tokens, and latency. A second variant can expose only source identifiers first and let the agent fetch full passages on demand.

### Deeper points

Define non-discardable fields before summarizing: constraints, progress, unresolved issues, and source pointers. A subtask summary should allow evidence recovery.

### Reviewer in one sentence

It turns context selection into state design with costs and acceptance conditions.

### Your take-away

With model and questions fixed, compare full-history replay, summaries, and on-demand retrieval, including compliance with earlier constraints.

## Reading | Lewis et al.: retrieval participates in generation and training

[Wednesday required reading](https://arxiv.org/abs/2005.11401)

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

[Last week](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en) argued the systems era is here; this week hands over the recipe. The RAG paper's problem statement is precise: big models store knowledge in parameters and fine-tune well, yet remain weak at *retrieving and manipulating* that knowledge — with provenance and knowledge updates unsolved. The fix is parametric plus non-parametric memory: a seq2seq model ([BART](https://arxiv.org/abs/1910.13461)) over a dense Wikipedia index, reached through a neural retriever ([DPR](https://arxiv.org/abs/2004.04906)).

Two formulations: RAG-Sequence marginalizes whole-answer probabilities over individual retrieved documents; RAG-Token marginalizes over documents at each output token. Jeopardy generation shows the difference best: answers often fuse two unrelated facts, so the Token variant reads one document for the first half and switches for the second.

The training setup deserves its own note: retriever and generator train together with no labeled retrieval answers, freezing the document encoder and tuning only the query encoder plus the generator. Retrieval is a DPR bi-encoder — separate BERT encoders for documents and queries, inner-product similarity, top-K via approximate MIPS. Generation is BART-large with input and retrieved passages simply concatenated.

The experiments cover four task families. Open-domain QA (NQ, TriviaQA, WebQuestions, CuratedTrec) set the best known scores — with generative answers beating extractive predecessors. Documents hinting at the answer without quoting it can still contribute, and RAG answers correctly even when the correct answer string is absent from retrieved documents, achieving 11.8% accuracy on that subset of NQ, where extractive models score zero. Abstractive QA (MS-MARCO) beats BART by over two BLEU points. Jeopardy generation went to blind human judges: RAG more factual than BART in forty-three percent of pairs against seven. FEVER verification: measured by article-title overlap, the top result comes from a gold article in 71% of cases, and the top ten contain a gold article in 90%.

The ablations answer questions HW1 will raise: freezing the retriever costs performance on every task, and swapping dense retrieval for BM25 loses everywhere except entity-dense FEVER, where word overlap still rules. Training retrieves five to ten documents; at test time the Sequence variant keeps improving with more, the Token variant plateaus at ten.

Knowledge updates are equally direct: swap the index file. The authors indexed two Wikipedia vintages and quizzed world leaders — matched indices score 70% and 68%; mismatched indices score 12% and 4%, with no retraining. That is the mechanism behind Week 1's "dynamic" argument. Related work in one line: REALM and ORQA stayed extractive; RAG is the first general generative recipe for hybrid memory.

For the course, RAG provides a concrete compound-system template — Week 1's three design questions (control logic, resource allocation, end-to-end optimization) finally take a buildable shape.

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

[Wednesday additional reading](https://arxiv.org/abs/2004.12832)

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

## What to do: modify last week's RAG

**What to do**: take the two-stage RAG you hand-built in Week 1 and rewrite it with one of this week's five patterns. The smoothest pick is evaluator-optimizer: add a second LLM call checking the first call's output against the retrieved passages (exactly the example from the compound-AI post). Measure three things: accuracy delta, latency cost, which examples got fixed and which broke. Write the conclusion as one selection sentence: is this task worth an extra call? That is the question Anthropic wants answered before every complexity increase.

## Where it sits in the course

Week 2 is HW1's prep week: the assignment drops next Monday, but Wednesday's RAG material supplies its retrieval foundation. HW1 bans agent frameworks — just a chat-completion call plus code you write — and starts with pipelines that retrieve and reason over a corporate email archive. Week 3's tool use (with [MCP](https://modelcontextprotocol.io/) entering there) connects tools, Week 4's ReAct and memory fix the shape of the loop and what it remembers, and the pipeline grows step by step into a full agent harness. Reading the Anthropic piece, keep its brake pedal in mind: prove the simple version insufficient before adding each pattern.

## This week's course material

- Official lecture slides (PDF): [LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf); [RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- Mon 9/28 LLMs for Builders: anchor reading Anthropic, Building Effective Agents, plus [Rajasekaran et al., Effective Context Engineering for AI Agents (Anthropic, 2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents); both are covered above.
- Wed 9/30 RAG: anchor reading Lewis et al., RAG, plus [Khattab et al., ColBERT](https://arxiv.org/abs/2004.12832); both are covered above.
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update Log

- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.

- 2026-10-23: Added a workflow/agent comparison and RAG architecture diagram to visualize existing explanations; no factual refresh.

- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.
- 2026-09-12: Added substantive guided readings of Effective Context Engineering and ColBERT.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- Lecture slides: [LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf); [RAG — Lecture 03](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- On this site: [Reading Stanford CS329Z Week 1: stop tuning only the model](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents), [Anthropic, Effective Context Engineering for AI Agents (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401), [Khattab & Zaharia, ColBERT, SIGIR 2020](https://arxiv.org/abs/2004.12832)
- Tools: [litellm docs](https://docs.litellm.ai/), [MCP specification](https://modelcontextprotocol.io/)
