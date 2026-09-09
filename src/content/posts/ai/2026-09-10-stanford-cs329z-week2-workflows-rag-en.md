---
title: "Reading Stanford CS329Z Week 2: Tell Workflows from Agents Apart, Then Hand-Build Your First RAG"
date: 2026-09-10
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 3
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 18
tldr: "Week 2 runs as a one-two punch: Monday's Anthropic taxonomy teaches you when not to build an agent, Wednesday's RAG paper hands you the first complete compound-system recipe. Five workflow patterns are the selection toolkit, RAG is parametric-plus-nonparametric memory, and together they are the blueprint for HW1 Part A."
description: "A guided reading of the Stanford CS329Z Week 2 anchors: Anthropic's Building Effective Agents with its workflow/agent split and five patterns, plus Lewis et al.'s RAG recipe — and how they assemble into HW1 Part A."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)

Week 2 is deliberately sequenced. Monday (Sep 28, LLMs for Builders) assigns Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) (2024): learn when something should *not* become an agent before you start building, so you don't over-engineer on day one. Wednesday (Sep 30, RAG) assigns Lewis et al.'s [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) (NeurIPS 2020): the complete recipe for a first compound system, with an in-class hands-on building a RAG pipeline from scratch. Together they are the blueprint for [HW1 Part A](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en).

## First, the split: workflows are not agents

Anthropic's first cut is definitional. Workflows run LLMs and tools along **predefined code paths**; agents let the LLM direct its own process and tool use. Both are agentic systems, but the selection logic differs completely: predictable tasks on fixed paths call for workflows, unpredictable step counts with model judgment call for agents. And most applications need neither — a single LLM call with retrieval and examples is usually enough. That paragraph is the post's brake pedal; every pattern below must answer to it.

## Five patterns: the selection toolkit

The building block is the augmented LLM: a model that writes its own search queries, picks tools, and decides what to remember — capabilities tailored to your case with an easy, well-documented interface. Up from there, five patterns in rising complexity:

**Prompt chaining**: each call processes the previous call's output, with programmatic gates in between. Use it when tasks decompose cleanly; you trade latency for accuracy.

**Routing**: classify the input, then send it down a specialized path. Use it when distinct inputs deserve distinct prompts — with the precondition that classification itself is accurate.

**Parallelization**: independent subtasks at once (sectioning), or the same task several times for a vote (voting). Use it for speed or for confidence; complex tasks with multiple considerations usually do better with one focused call per consideration.

**Orchestrator-workers**: a central LLM decomposes on the spot, delegates, and synthesizes. It differs from parallelization in that subtasks aren't predefined. Fits tasks whose decomposition varies with input, like multi-file code changes.

**Evaluator-optimizer**: one call generates, another critiques, in a refinement loop. Use it with clear grading criteria where iteration measurably helps — literary translation is the canonical example.

**Agents** come last: tool loops driven by environment feedback, with checkpoints and iteration caps. For open-ended problems with unpredictable step counts where you trust the model's judgment. Costly, with compounding errors — sandbox plus guardrails as standard kit.

## Framework advice: call the API directly first

Anthropic's framework view is blunt: frameworks simplify model calls, tool definitions, and chaining, but each abstraction layer is a debugging blind spot — and an invitation to add complexity you don't need. Start with raw LLM APIs; the same patterns take a few lines of code. If you adopt a framework, understand what's underneath; wrong assumptions about internals are a top customer error source. Appendix 2 applies this to tool definitions: formats should be easy to write (diffs are harder than full rewrites, JSON escaping is costlier than markdown), models need tokens to think before committing, and definitions deserve junior-developer-grade docstrings. On SWE-bench the team spent more time tuning tools than the overall prompt — relative paths broke the model after directory changes, mandating absolute paths fixed it outright. That is ACI (agent-computer interface): whatever effort goes into HCI, tool interfaces deserve the same.

## RAG: the recipe for a first compound system

[Last week](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en) argued the systems era is here; this week hands over the recipe. The RAG paper's problem statement is precise: big models store knowledge in parameters and fine-tune well, yet remain weak at *retrieving and manipulating* that knowledge — with provenance and knowledge updates unsolved. The fix is parametric plus non-parametric memory: a seq2seq model ([BART](https://arxiv.org/abs/1910.13461)) over a dense Wikipedia index, reached through a neural retriever ([DPR](https://arxiv.org/abs/2004.04906)).

Two formulations: RAG-Sequence conditions the whole generation on one retrieved set, RAG-Token may consult different passages per token. Jeopardy generation shows the difference best: answers often fuse two unrelated facts, so the Token variant reads one document for the first half and switches for the second.

The training setup deserves its own note: retriever and generator train together with no labeled retrieval answers, freezing the document encoder and tuning only the query encoder plus the generator. Retrieval is a DPR bi-encoder — separate BERT encoders for documents and queries, inner-product similarity, top-K via approximate MIPS. Generation is BART-large with input and retrieved passages simply concatenated.

The experiments' breadth is why the course assigns this paper: one architecture across four task families. Open-domain QA (NQ, TriviaQA, WebQuestions, CuratedTrec) set the best known scores — with generative answers beating extractive predecessors. Documents hinting at the answer without quoting it can still contribute, and RAG answers correctly even with nothing relevant retrieved in about one case in nine on NQ, where extractive models score zero. Abstractive QA (MS-MARCO) beats BART by over two BLEU points. Jeopardy generation went to blind human judges: RAG more factual than BART in forty-three percent of pairs against seven. FEVER verification: the top retrieved document is gold evidence seventy percent of the time, rising to ninety within the top ten.

The ablations answer questions HW1 will raise: freezing the retriever costs performance on every task, and swapping dense retrieval for BM25 loses everywhere except entity-dense FEVER, where word overlap still rules. Training retrieves five to ten documents; at test time the Sequence variant keeps improving with more, the Token variant plateaus at ten.

Knowledge updates are equally direct: swap the index file. The authors indexed two Wikipedia vintages and quizzed world leaders — matched years answer around seventy percent right, mismatched years collapse toward ten, with no retraining. That is the mechanism behind Week 1's "dynamic" argument. Related work in one line: REALM and ORQA stayed extractive; RAG is the first general generative recipe for hybrid memory.

For the course, RAG is the cheapest compound-system template — Week 1's three design questions (control logic, resource allocation, end-to-end optimization) finally take a buildable shape.

## What to do: modify last week's RAG

**What to do**: take the two-stage RAG you hand-built in Week 1 and rewrite it with one of this week's five patterns. The smoothest pick is evaluator-optimizer: add a second LLM call checking the first call's output against the retrieved passages (exactly the example from the compound-AI post). Measure three things: accuracy delta, latency cost, which examples got fixed and which broke. Write the conclusion as one selection sentence: is this task worth an extra call? That is the question Anthropic wants answered before every complexity increase.

## Where it sits in the course

Week 2 opens HW1 Part A: Wednesday's hands-on RAG is the assignment's foundation. Week 3's tool use (with [MCP](https://modelcontextprotocol.io/) entering there) connects tools, Week 4's ReAct fixes the loop's shape — the three Part A puzzle pieces. Reading the Anthropic piece, keep its brake pedal in mind: prove the simple version insufficient before adding each pattern.

## This week's course material

- Mon 9/28 LLMs for Builders: anchor reading Anthropic, Building Effective Agents (covered above); further reading [Rajasekaran et al., Effective Context Engineering for AI Agents (Anthropic, 2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
- Wed 9/30 RAG: anchor reading Lewis et al., RAG (covered above); further reading [Khattab et al., ColBERT: efficient passage search via late interaction](https://arxiv.org/abs/2004.12832).
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## References

- On this site: [Reading Stanford CS329Z Week 1: stop tuning only the model](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents), [Lewis et al., Retrieval-Augmented Generation, NeurIPS 2020](https://arxiv.org/abs/2005.11401)
- Tools: [litellm docs](https://docs.litellm.ai/), [MCP specification](https://modelcontextprotocol.io/)
