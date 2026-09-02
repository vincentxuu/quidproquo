---
title: "AI Engineer Interview Daily — 2026-09-03: LLM & Agent Engineering"
date: 2026-09-03
category: daily
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Today's LLM and agent engineering drill: why high retrieval accuracy doesn't guarantee correct answers, why a bigger context window makes 'context pollution' worse instead of better, and where RAG, fine-tuning, and LLM-as-judge each belong."
tldr: "LLM & Agent Engineering interviews don't test whether you can wire up LangChain — they test whether you can turn a vague 'something's broken' into a set of testable sub-hypotheses. Today covers four high-frequency concepts: why RAG's 'retrieval is right but the answer is wrong' gap needs retrieval and generation evaluated as two separate systems; why a bigger agent context window doesn't fix quality decay, because the real problem is context pollution (noise diluting attention) rather than too few tokens; the decision logic between RAG and fine-tuning — 'RAG owns knowledge, fine-tuning owns behavior'; and why LLM-as-judge carries consistency and self-preference bias and can't stand alone as the only metric. The practice problem is a common enterprise scenario question — retrieval accuracy is 90% but answer accuracy is only 60%, how do you diagnose it — walking through how to turn a vague symptom into verifiable hypotheses."
series:
  name: "AI Engineer Interview Daily"
  order: 15
---

> 🌏 [中文版](/posts/daily/2026-09-03-ai-interview-daily)

## Today's Topic

LLM & Agent Engineering is where interviews most often expose "can use the tools but doesn't understand the boundaries." Plenty of candidates can spell out what RAG stands for and sketch an agent loop diagram, but when pressed on "retrieval clearly found the right passage, so why is the answer still wrong" or "the context window is already 1M tokens, so why does agent quality still degrade as the task gets longer," the answer falls apart.

Today isn't about re-drawing the RAG architecture diagram — it's about practicing what interviewers actually want to hear: when a system feels broken, how do you turn that feeling into a set of hypotheses you can verify independently. This style of question shows up in phone-screen deep dives and in diagnostic questions during LLM/agent infra onsites.

## Core Concepts Quick Reference

### RAG accuracy needs two separate scores — right retrieval doesn't mean right answer

"90% retrieval accuracy, 60% answer accuracy" is a near-guaranteed interview question, because it directly tests whether a candidate treats a RAG pipeline as two independent systems. The retrieval side measures context precision (are the retrieved passages relevant) and context recall (was all the needed information retrieved); the generation side measures faithfulness (does the answer stay true to the retrieved content) and answer relevance (does the answer actually address the question). These four metrics can each fail independently — 90% retrieval only proves the retrieved passages are relevant, not that the answer faithfully used them, and not that the model didn't quietly fall back on its own parametric memory instead.

### Context Pollution: a bigger context window doesn't fix agent quality decay

An autonomous coding agent navigating a large monorepo to find files and write a patch often shows a strange pattern: once it finds the right file, patch quality tanks anyway. The instinctive fix is "give it a bigger context window," but that's the wrong direction — the problem isn't running out of space, it's that the same context fills up with failed tool calls, dead-end reasoning, and irrelevant file snippets, diluting the model's attention on the task that actually matters. That's context pollution. Even with an unbounded context window, once noise crosses a threshold, the LLM's zero-shot reasoning quality on the final task still degrades. The right interview direction is architectural isolation: split "discovery" (search, browsing, running grep) from "execution" (writing the patch) into separate agents or separate context segments, and once discovery finishes, hand execution only the distilled conclusion — which file, which line, why — instead of forwarding the entire raw reasoning history.

### RAG vs. Fine-Tuning: who owns knowledge, who owns behavior

The trap here is comparing the two as if they're competing on raw performance, when what the interviewer actually wants is your decision logic. RAG fits knowledge that changes, is private, and needs a traceable source, because RAG pulls data in at query time — the model's weights never memorize it, so there's no need to retrain when the data changes. Fine-tuning fits behavior: tone, output format, domain jargon, or anything that needs to apply on every single call without paying for a long system prompt each time. The core distinction is that fine-tuning teaches style, not factual recall — using it to make a model "remember our documents" is the wrong tool for the job, and often neither is needed; a better prompt solves it.

### The Limits of LLM-as-Judge — Never Trust a Single Score

Using an LLM to judge another LLM's output is currently the most practical way to scale evaluation, but you need to name its known biases in an interview: consistency bias (the same judge gives inconsistent scores to similarly good answers depending on presentation order or phrasing), self-preference bias (a judge tends to score outputs from its own model family higher), and a length bias (judges tend to mistake "said more" for "said it better"). Mitigations include using a structured rubric instead of an open-ended "is this answer good," running the same sample multiple times to check consistency, and periodically calibrating the judge's score distribution against a small human-labeled set — rather than treating the LLM-as-judge score as ground truth on its own.

## Today's Practice Problem

### Problem

"Your RAG-based customer support chatbot measures 90% retrieval accuracy, but final answer accuracy is only 60%. How would you diagnose the gap and find where the real problem is?"

**Source**: Cloud Soft Solutions, "GenAI Engineer Interview Questions 2026" — Scenario-Based Questions (a compilation of common enterprise RAG customer-support interview scenarios) | **Difficulty**: Intermediate | **Stage**: phone-screen technical deep dive

### Breakdown

1. **Clarify the problem first**: The easiest trap here is jumping straight into listing possible causes. What the interviewer actually wants to see is you asking how the two numbers were measured in the first place. Is the 90% retrieval accuracy recall@k, or human-labeled relevance? Is the 60% answer accuracy a strict exact match, or a faithfulness score from an LLM-as-judge? If the two metrics use inconsistent scoring methods — say, retrieval is human-labeled while answer accuracy is a strict string match — part of that 30-point gap is a false signal caused by mismatched rulers, not an actually broken system.

2. **Establish a framework**: Split the pipeline into retrieval → context assembly → generation, and hypothesize independently about where the bottleneck sits, rather than diagnosing RAG as one black box. 90% retrieval only proves the retrieved passages are relevant to the question — it doesn't guarantee the complete information needed to answer is present, and it doesn't guarantee the model actually used those passages in its answer.

3. **Dive into the core**: Three real causes show up most often. First, the answer may be scattered across multiple chunks — each chunk looks relevant on its own (hence the high retrieval score), but no single chunk contains the complete answer, so the model has to stitch fragments together. Second, lost-in-the-middle: if the key passage lands in the middle of the top-k results, an LLM's attention over a long context is naturally weaker in the middle than at the edges, so a retrieved passage can still be effectively ignored. Third, the prompt may not force the model to answer only from retrieved content or require citations — when the retrieved content is ambiguous, the model falls back to its parametric memory, which for enterprise-internal information is almost always wrong or stale.

4. **Wrap up**: Close with one line that ties it together — "the gap between 90% and 60% is really retrieval and generation using two different definitions of 'correct'; you have to evaluate them separately before you know whether to fix chunking or fix the prompt, instead of tuning both sides by feel." That's the line that justifies diagnosing before acting, instead of jumping straight to "raise top-k" or "switch to a more expensive model" without a validated hypothesis behind it.

### Sample Answer (how to articulate this in an interview)

> Before guessing at causes, I'd want to confirm how these two numbers were measured — is the 90% retrieval accuracy recall@k or human-labeled relevance? Is the 60% answer accuracy a strict exact match or a faithfulness score from an LLM-as-judge? If the scoring methods aren't consistent, part of the gap could just be a measurement mismatch rather than an actually broken system. Assuming both are measured reasonably, I'd split the pipeline into retrieval, context assembly, and generation, and validate each stage independently.
>
> I'd start by sampling the cases where retrieval was correct but the answer was wrong, and check for three common patterns: first, whether the answer is scattered across multiple chunks — each individually relevant, but none containing the complete answer, forcing the model to stitch fragments together; second, whether the key passage landed in the middle of the top-k results — long-context attention has a lost-in-the-middle decay, so a retrieved passage isn't necessarily a used passage; third, whether the prompt explicitly requires the model to answer only from the retrieved content and cite sources. Without that constraint, the model falls back to parametric memory whenever the retrieved content feels insufficient, and for things like internal company policy or pricing, parametric memory is almost always wrong.
>
> Once I've identified the main bottleneck, the fix follows from it: if it's a chunking problem, I'd move to smaller chunks combined with parent-child retrieval, so precise matching uses small chunks while the returned context still carries full surrounding detail; if it's positional bias, I'd place the most relevant passages at the start and end of the assembled prompt and add a reranking stage instead of relying on vector similarity ordering alone; if it's missing citation enforcement, I'd add an explicit instruction like "answer only from the content below, and say you don't know if it's insufficient," then verify with the faithfulness metric that the change actually moved answer accuracy — not just assume it worked because it sounds right.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| Proactively asked whether the 90%/60% numbers were measured consistently | |
| Split the pipeline into retrieval, context assembly, and generation for independent validation | |
| Mentioned chunk-boundary fragmentation and answers scattered across multiple chunks | |
| Mentioned lost-in-the-middle positional bias and the role of reranking | |
| Mentioned missing citation enforcement causing fallback to parametric memory | |
| Bonus: proposed a specific fix tied to the identified bottleneck, not a generic "tune the parameters" | |

## Further Reading

- [GenAI Engineer Interview Questions 2026 (300+ Questions) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/genai-engineer-interview-questions-2026) — Covers RAG, agents, MCP, evaluation, and security across 19 sections and 300+ questions; today's core concepts and practice problem are both drawn from this compilation
- [LLM Agents Interview Questions #12 — The Context Pollution Trap](https://aiinterviewprep.substack.com/p/llm-agents-interview-questions-12) — A Google DeepMind-style senior interview question breaking down why a bigger context window doesn't fix agent quality decay
- [Context engineering in agents — LangChain Docs](https://docs.langchain.com/oss/python/langchain/context-engineering) — Official documentation on how middleware summarizes, guardrails, and logs between agent steps, filling in the implementation side of context engineering

## References

- [GenAI Engineer Interview Questions 2026 (300+ Questions) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/genai-engineer-interview-questions-2026) — Full source for today's practice problem, and the basis for the RAG vs. fine-tuning and LLM-as-judge limitations sections
- [LLM Agents Interview Questions #12 — The Context Pollution Trap](https://aiinterviewprep.substack.com/p/llm-agents-interview-questions-12) — Basis for the context pollution section in Core Concepts
- [Context engineering in agents — LangChain Docs](https://docs.langchain.com/oss/python/langchain/context-engineering) — Official documentation supporting the "split discovery from execution context" recommendation in the context pollution section
