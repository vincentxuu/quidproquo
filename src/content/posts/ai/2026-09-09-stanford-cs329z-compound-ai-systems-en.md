---
title: "Reading Stanford CS329Z Week 1: Stop Tuning Only the Model — State-of-the-Art Is Systems Engineering"
date: 2026-09-09
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 2
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 20
tldr: "The Week 1 anchor reading for CS329Z is Zaharia et al.'s Compound AI Systems: the best results increasingly come from multi-component systems, and even the biggest model is just one part. The post leaves three design questions and three hard challenges — which happen to be exactly what HW1 asks you to answer by building."
description: "A guided reading of the Stanford CS329Z Week 1 anchor paper: the definition of compound AI systems, three reasons the field is moving to systems, three open design questions, three hard challenges, four emerging directions, and how each maps to HW1's from-scratch RAG and DSPy rewrite."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)

The first lecture of [CS329Z](https://cs329z.stanford.edu/) (Sep 23, Foundations & Landscape) assigns exactly one anchor reading: [The Shift from Models to Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) (BAIR Blog, 2024), led by Matei Zaharia with ten co-authors across Berkeley, Stanford, and Databricks. Opening with this piece states the whole course's position: the class makes no bets on what the next big model will unlock. It cares about one thing — engineering the best possible system out of today's parts. The three keywords of lecture one, decomposition, data, and evaluation, all grow out of this post.

This guide follows the post's own argument: the definition, why systems are unavoidable, then its three design questions, three hard challenges, and four emerging directions. At the end I connect each section back to the course — what [HW1 actually asks you to hand in](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en) is essentially the hands-on version of this article.

## The definition: system versus model in one sentence

The post defines it in a single line: a compound AI system tackles tasks with **multiple interacting components**, including repeated model calls, retrievers, and external tools. An AI model, by contrast, is just a statistical model — a Transformer predicting the next token.

The test is simple: can your thing get better by merely swapping in a bigger model? If it also needs retrieval, tools, or multi-step reasoning, it is a system. RAG, tool use, and agent loops are all instances.

## Why systems are unavoidable: four reasons

First, **some tasks improve more cheaply through system design**. LLMs follow handsome scaling laws, but in many applications training spend returns less than system-building. The post's own hypothetical: the best LLM solves contest problems 30% of the time and tripling its training budget only reaches 35% — still unusable. Sampling repeatedly from today's model with testing and filtering, by contrast, can reach 80%. More importantly, iteration speed: systems iterate daily, training runs take months. In any high-value application developers will want every tool available — the familiar story of a dazzling but unreliable LLM demo that an engineering team then systematically hardens.

Second, **systems can be dynamic**. A model freezes on its training cutoff date, so fresh knowledge has to come through components like retrieval. Training also lets a model "see" the whole training set, so access controls (answer only from files the user may read) need system-level machinery too.

Third, **control and trust are more buildable**. Neural nets can hardly promise to avoid specific behaviors, but a system can filter outputs from the outside; LLMs hallucinate, but retrieval-backed generation can attach citations and verify facts automatically.

Fourth, **budgets differ per application**. Every model ships fixed quality at a fixed cost, but applications want different points: inline completion finds the best models too expensive, so Copilot uses tuned small models plus search heuristics. Conversely, someone would gladly pay dollars for a correct legal opinion instead of cents for GPT-4 — capturing that budget takes system design. Designing systems is the flip side of making tradeoffs.

## Three design questions it leaves open

The post offers no answers, only three questions — each one is an HW1 exam question in disguise:

1. **Where does the control logic live?** In traditional code (Python calling an LLM) or with the model driving (an LLM agent calling tools)? That is exactly the Part A from-scratch versus Part B framework contrast in HW1.
2. **Where do the FLOPS go?** In a RAG pipeline, should extra compute go to the retriever, the LLM, or more LLM calls? The post gives it concrete shape: answering within 100 milliseconds, 20 for retrieval and 80 for the LLM, or the reverse? There is no general answer — only measurement.
3. **How do you optimize end to end?** Neural nets have differentiable backprop; systems contain non-differentiable parts like search engines and interpreters. How do you tune the whole thing against one metric?

## Three hard challenges

First, **the design space is enormous**. Even plain retriever-plus-LM RAG spans model selection, query expansion, reranking, and adding another LLM to check outputs against retrieved passages. Developers navigate this space mostly by feel today.

Second, **components must be tuned together to shine**. Ideally the LLM learns to write queries that work well for *that* retriever, and the retriever prefers answers *that* LLM uses well. Tuning each in isolation leaves performance behind.

Third, **optimization methods are still being born**. Single models have PyTorch; compound systems need new machinery. [DSPy](https://dspy.ai/) is the first framework aiming at general optimization of LLM-call-plus-tool pipelines (hand it a metric and it generates prompt instructions, few-shot examples, and per-module tuning). LaMDA, Toolformer, and AlphaGeometry represent the other route — teaching models to use tools during training itself.

## Four emerging directions

**Composition frameworks**: component libraries called from traditional programs ([LangChain](https://www.langchain.com/), [LlamaIndex](https://www.llamaindex.ai/)), agent frameworks where the LLM drives (AutoGPT lineage), output-control tooling (Guardrails, Outlines, SGLang), and inference strategies (chain-of-thought, self-consistency, WikiChat, RAG) at the same layer.

**Automatic quality optimization**: DSPy. You write natural-language signatures (e.g. `user_question -> search_query`) whose field names carry meaning, and the framework turns them into prompts, examples, even weight updates. PyTorch-like effects, except the modules are not always differentiable.

**Cost optimization**: FrugalGPT learns a routing policy dispatching inputs across model cascades, cutting cost by up to 90% at matched quality — part of the broader AI-gateway idea (Databricks AI Gateway, OpenRouter, Martian). The finer a system is sliced, the better each segment optimizes separately.

**Operations**: tracing tools like [LangSmith](https://www.langchain.com/langsmith) and Phoenix Traces record every intermediate step, visualize it, and tie it back to data quality; on the research side, DSPy Assertions feeds monitoring feedback straight into outputs, while MT-Bench, FAVA, and ARES push automated quality monitoring. The post adds one counterintuitive risk: combinations like a chatbot plus a content filter can open security holes neither component has alone — system safety has to be examined whole, never part by part.

## One thing to do tonight

A shrunken HW1 Part A: pick one QA task you answer poorly, hand-build a two-stage RAG with litellm (one retriever plus one LLM call), measure the baseline, then swap only the retriever and measure again, then swap only the prompt and measure again. Note which move gained more. That is the smallest possible experiment for design question two.

## Where it sits in the course

This post is the map; the eleven weeks are the walk. Weeks 2–3 (RAG, tool use) are the Part A parts lectures, the second half of Week 3 (DSPy) is Part B, and Weeks 4–8 (optimization, evaluation with the 4-tuple) are the HW2 parts lectures. Use the three design questions as bookmarks: at each week's end, ask which one the week answered.

## Further reading: the week's other two papers

The Week 1 syllabus lists two additional readings beyond the anchor. They are lighter lifts, covered briefly here.

**Ng's four agent design patterns** ([The Batch, 2024](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance)): Reflection (checking your own work), Tool Use, Planning, and multi-agent collaboration. The argument is one line: don't let the LLM emit the final answer in one shot — walk multiple rounds, with tools and a plan, and quality follows. Note how it maps onto Week 2's Anthropic taxonomy: Ng's four are capability directions, Anthropic's five are construction shapes — Reflection pairs with evaluator-optimizer, Planning with orchestrator-workers. After Week 2, reread this piece and you'll see the same concepts told twice: once as directions, once as methods.

**Si et al. on execution-grounded automated AI research** ([arXiv:2601.14525](https://arxiv.org/abs/2601.14525), 2026; note course instructor Diyi Yang is a co-author): LLM-generated research ideas look convincing but often fail once executed. The fix is execution as ground truth — automatically implementing ideas as code, running large-scale parallel GPU experiments, then learning from the feedback via evolutionary search or RL. Within ten search epochs the found post-training recipe beats the GRPO baseline (69.4% vs 48.0%). Two cold showers follow: frontier models saturate early, and RL raises the average score but not the ceiling (diversity collapses). This paper is an appetizer for Week 11's science agents and open problems: not even AI that researches AI escapes evaluation.

## This week's course material

- Wed 9/23 Foundations & Landscape: anchor reading Zaharia et al., Compound AI Systems (covered above); further reading Ng's four design patterns and Si et al. on execution-grounded research (see Further reading above).
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## References

- On this site: [Stanford CS329Z guide: hand-build the agent with litellm first, then let DSPy take it away](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z: Engineering AI Agents, official site with schedule and deadlines](https://cs329z.stanford.edu/)
- Source: [Zaharia et al., The Shift from Models to Compound AI Systems, BAIR Blog (2024)](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)
- Frameworks: [DSPy](https://dspy.ai/), [LangChain](https://www.langchain.com/), [LlamaIndex](https://www.llamaindex.ai/)
