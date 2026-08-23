---
title: "CS224N Lecture 10: Six Components of RAG and Language Agents"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, rag, ai-agent, tool-use, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 11
tldr: "Lecture 10 moves from question answering and RAG into language agents, then decomposes them into reasoning and planning, memory, tools, data, and evaluation. An agent is an inspectable loop between a model and external state."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 10: QA/RAG, language agents, planning, memory, tools, and evaluation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-rag-language-agents)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 10 on February 5, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture10-rag-agents.pdf) is titled **RAG and Language Agents**. Its agenda closes adapters, then covers question answering and RAG, language agents, reasoning and planning, memory, tool use, and agent data and evaluation.

## RAG moves the knowledge source outside the model

Answering only from parameters is limited by training time and capacity and makes specific evidence difficult to identify. [RAG](https://arxiv.org/abs/2005.11401) retrieves documents for a question and places results into the generation context. A typical pipeline contains an index, retriever, context construction, and generator.

Failure can occur at every layer: the corpus lacks the answer, chunking breaks meaning, retrieval ranks poorly, long context dilutes evidence, or generation ignores retrieved material. Evaluation therefore cannot inspect only final answers; it should at least separate retrieval recall from whether the answer is supported by evidence.

## An agent is a loop between model and environment

A language agent does more than generate text once. It reads an observation, maintains state, chooses an action, calls a tool, and returns the result to the next step. [ReAct](https://arxiv.org/abs/2210.03629), which interleaves reasoning traces and actions, is the deck's representative bridge between reasoning and acting.

This view avoids treating an agent as a mysterious new model. The underlying model may be unchanged; the differences lie in action space, tool schemas, state management, stopping rules, and error handling.

## Reasoning, planning, and memory

Planning decomposes a long goal and revises steps after new observations. A complete up-front plan may continue after its assumptions fail; stepwise planning adapts but adds model calls and opportunities for cumulative error.

Memory includes short-term trajectory state and long-term information retrieved across tasks. Replaying all history into a prompt is not robust memory: it raises cost, mixes stale information, and complicates sensitive-data control. Useful memory needs write criteria, retrieval, and deletion policies.

## Tool use, data, and evaluation

[Toolformer](https://arxiv.org/abs/2302.04761) represents one approach to learning when to call tools. Tools translate textual intent into API or environment actions; reliability depends on argument schemas, permission boundaries, result validation, and recovery. Actions with external side effects need approval boundaries, not only a prompt asking the model to be careful.

Agent data includes observations, thoughts/actions, tool results, and outcomes across a trajectory. Evaluation can measure task success, steps, tool errors, cost, latency, and safety violations. Success alone conflates accidental, circuitous completion with a stable method.

## From closed-book to retrieval-augmented QA

RAG depends first on corpus coverage. Choose chunking from evidence spans, preserve metadata, and enforce permissions before retrieval content reaches a prompt.

## Sparse, dense, and reranked retrieval

Sparse methods excel at exact terms; dense methods bridge paraphrases; hybrid systems combine them. Bi-encoders retrieve efficiently and cross-encoders rerank. Audit hard negatives for false negatives.

## Context construction and grounded generation

Deduplicate, order, delimit, and cite evidence. Treat retrieved instructions as untrusted data. Verify that citations support claims, evaluate abstention, and test evidence position rather than assuming larger top-k helps.

## Layered RAG evaluation

Separate retrieval recall/ranking, answer correctness, faithfulness/citations, and operational cost. Classify missing-corpus, missed-retrieval, ignored-evidence, and reasoning failures.

## The agent loop as a state machine

Define state, policy action, environment observation, and termination. Validate typed actions, budget loops, and return recoverable tool errors. Side effects need idempotency and approval.

## Observable reasoning and planning

Plan-and-execute, ReAct, and search expose different control flows. Evaluate action preconditions, observations, and replanning under environment feedback rather than prose-plan quality alone.

## Memory needs write, retrieve, and forget policies

Separate working, episodic, and semantic memory. Add provenance, confidence, privacy, expiry, correction, and poisoning defenses; replaying all chat history is not memory design.

## Tool permissions and recovery

Start read-only, grant least privilege, structure success/error/retry state, and check transactions before retrying writes. Retrieved text cannot elevate authority.

## Agent data and trajectory learning

Store versioned observations, actions, tool results, and outcomes. Include recovery, not only success, and use step-level or counterfactual evidence for credit assignment.

## An agent evaluation suite

Measure components, trajectories, outcomes, and operations. Perturb timeouts, schemas, malicious documents, and permissions; report variation, tail steps/cost, and human interventions.

## A minimal verifiable agent

Answer from three local documents using only `search` and `open`, a five-step budget, and citations. Test answerable, unanswerable, conflicting, and malicious-document cases before any side-effect tool.

## Material gap

Winter 2026 recordings are not public. This article covers the adapter recap and all six formal agenda topics without reconstructing live demos or spoken cases. The safety-boundary discussion is an engineering implication of the architecture, not presented as an experimental result from the slides.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 10 RAG and Language Agents slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture10-rag-agents.pdf)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [ReAct](https://arxiv.org/abs/2210.03629)
- [Toolformer](https://arxiv.org/abs/2302.04761)
