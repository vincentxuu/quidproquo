---
title: "How to Build a Deep Research Agent: Multi-Turn Search Planning, Conflict Resolution, and Verifiable Conclusions"
date: 2026-06-04
category: ai
type: deep-dive
tags: [deep-research, ai-agent, multi-agent, retrieval, llm]
lang: en
tldr: "An autonomous research agent = four controllable stages: planning (decompose into sub-questions), retrieval loop (search -> read -> reflect on gaps -> search again), evidence arbitration (>=2 independent sources, typed conflict handling), and verifiable output (sentence-level citations + independent verification pass). Two approaches: training-based uses RL to learn end-to-end when to search (Search-R1 +41%); orchestration-based uses orchestrator-worker division of labor (Anthropic internal eval +90.2%, at ~15x token cost)."
description: "Dissecting the architectural differences between OpenAI Deep Research, Anthropic Research, GPT Researcher, and NVIDIA AI-Q: autonomous planning mechanisms for multi-turn search, stopping condition design, heterogeneous source conflict resolution (RA-RAG), citation grounding and attribution evaluation, with a practical reference architecture."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-04-autonomous-deep-research-agent)

"Deep research" products emerged collectively in 2025: OpenAI Deep Research, Anthropic's Research feature, Perplexity Deep Research, plus open-source GPT Researcher and NVIDIA AI-Q. They all tackle the same problem: **letting an agent autonomously plan multi-turn searches, synthesize heterogeneous and potentially contradictory sources, and produce conclusions where every sentence is verifiable**. This article breaks the problem into four controllable stages, compares two industry approaches, and concludes with a practical reference architecture.

The four stages: **Planning** (decompose a vague broad question into independently verifiable sub-questions), **Retrieval loop** (search -> read -> reflect on gaps -> search again, until sufficient), **Evidence arbitration** (deduplication, credibility weighting, conflict resolution), and **Verifiable output** (sentence-level citations + independent verification pass).

## Two Approaches: Training-Based vs. Orchestration-Based

**The training-based approach** uses RL to train the model end-to-end to "learn on its own" when to search, what to search for, and when to stop. OpenAI Deep Research is an o3 variant that underwent end-to-end RL for browsing + reasoning tasks, running dozens of searches per query over 28 minutes; but OpenAI's own published pass rate is only 15-25% -- usable, but not replacing experts. The open-source representative Search-R1 (arXiv:2503.09516) treats the search engine as part of the RL environment, using retrieved-token masking to stabilize training and outcome-based reward, achieving **+41%** over RAG baseline with Qwen2.5-7B -- proving that even small models can learn multi-turn search.

**The orchestration-based approach** leaves the model untouched, using an orchestrator-worker architecture to divide planning, retrieval, synthesis, and verification. Anthropic's numbers published in their [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) post are the most representative: after the lead agent plans, it spawns 3-5 parallel subagents (each with independent context windows), achieving **+90.2%** over single agent in internal evaluations -- but at the cost of approximately **15x token consumption** (token usage explains 80% of the performance variance).

Decision criteria: multi-agent parallelism only pays off for breadth-oriented research where "tasks can be decomposed into independent parallel branches"; tightly-coupled tasks (like writing code) are better suited for single-agent sequential processing. Cognition's contrarian perspective is worth noting alongside: multi-agent setups easily lose context, and subagent data is hard to manage -- in practice, most take a hybrid approach: parallelize what can be independent, serialize what's tightly coupled.

## Stage 1: Autonomous Planning for Multi-Turn Search

| Mechanism | Approach | Representative |
|---|---|---|
| Plan-and-Execute | Planner generates sub-questions / outline first, executor retrieves in parallel | GPT Researcher, NVIDIA AI-Q (4-6 queries mapped to report sections) |
| Iterative retrieval | search -> read results -> modify next query based on new findings | OpenAI / Perplexity Deep Research |
| Interleaved RL | Model autonomously generates queries during reasoning, search is part of the RL environment | Search-R1 |
| Adaptive retrieval | Model judges on its own whether "this segment needs lookup" | Self-RAG |

Key insight: **Planning is not a one-shot process**. When OpenAI DR hits a paywall, it internally reasons "trying an unofficial website might be better" and then switches to searching government public abstracts -- this ability to react to real-time information, backtrack, and rewrite queries is trained through RL, not hardcoded in a workflow. The complete methodology map for the "whether to search, what to search" decision layer is expanded in the companion post [Three Decision Layers of Agentic RAG](/posts/ai/2026-06-04-agentic-retrieval-decisions).

## Stage 2: When to Stop Searching

The most underestimated stage, yet it directly determines cost and quality. Four approaches: Self-RAG uses critique tokens (`ISSUP` whether supported by evidence, `ISUSE` usefulness) as continue/stop signals; NVIDIA AI-Q uses a fixed loop cap (default research loop = 2, pragmatic but blunt); Search-R1 only looks at whether the final answer is correct, letting the model learn "stop when enough" on its own -- but community testing shows this often leads to **over-searching** (searching three times even when unnecessary), suggesting adding search penalties to the reward; the orchestration-based approach dispatches a completeness critic to ask "what's still missing," turning gaps into the next round of work.

Design principle: **Stopping conditions must be explicitly logged** (how many rounds searched, why it stopped) -- silent truncation misleads users into thinking coverage is complete.

## Stage 3: Conflict Resolution Across Heterogeneous Sources

When sources contradict each other, you cannot let the generation stage "implicitly" decide whom to trust -- the mainstream approach is to **push conflict handling upstream to the evidence layer**. RA-RAG (arXiv:2410.22954) first uses cross-source cross-validation to automatically estimate source credibility, then applies weighted majority voting and only consults a minority of reliable sources. Even more critical is **conflict typing** (DRAGged into Conflicts, arXiv:2506.08500 and others): query-ambiguity conflicts should **present multiple valid answers**, while source-error conflicts should be filtered -- you cannot always hard-pick one answer.

Evidence discipline you can directly adopt: each fact needs at least **2 independent sources** before going into conclusions; single-source facts are marked as unverified; source quality ranking is "official > first-party author > high-quality secondary > content farms"; conflicting facts are listed without taking sides, letting the reader decide. A counterintuitive reminder: using "majority agreement" as a credibility criterion will **bias toward the incorrect majority** -- when sources copy from each other, consistency does not equal correctness.

## Stage 4: Verifiable Conclusions

"Verifiable" = every assertion can be traced to a specific source, with an independent pass confirming the citation actually supports that sentence.

Generation side: OpenAI DR attaches sentence-level clickable citations to each fact, pointing to the exact paragraph in the source; Anthropic Research uses an **independent citation stage** to add citations after synthesis -- separating writer and citation to avoid self-endorsement; GPT Researcher's multi-agent version (LangGraph) has a Reviewer that validates drafts and a Reviser that revises based on feedback in a loop.

Evaluation side: attribution is not binary, it's divided into **full / partial / no support** three levels; commonly uses NLI models for automatic judgment (AutoAIS), but CiteEval (arXiv:2506.01829) criticizes NLI-only as a suboptimal proxy. An even more important warning comes from the consistent conclusion of two independent studies at INLG 2024 and ACL 2025 Findings: **no single faithfulness metric is best in all scenarios**, and automatic verifiers themselves have biases -- automation can reduce costs, but high-stakes conclusions still need human review. A stronger approach is adversarial verification: for each key assertion, dispatch N independent skeptics with a default inclination to refute; only discard if a majority refutes.

## Four Practical Lessons from Anthropic

The most worth copying engineering details from the orchestration-based approach, all from Anthropic's official retrospective:

1. **Four elements of a delegation contract**: each subagent needs a goal, output format, which tools and sources to use, and task boundaries -- missing one leads to drift and rework.
2. **Isolation boundaries**: subagents are unaware of each other with independent contexts, enabling true parallelism without flooding the lead's context window.
3. **Write output to files, return references**: subagents save results to the filesystem, returning only lightweight references -- avoiding information loss from multi-stage telephone games.
4. **Extended thinking as scratchpad**: the lead uses its thinking process to plan subagent count; subagents evaluate quality after tool results, identify gaps, and rewrite the next query.

## Reference Architecture

```
User's broad question
  |--[Clarification] Interactive follow-up to narrow scope (optional)
  |--[Planning] Decompose into 3-6 independently verifiable sub-questions -> write to plan file
  |        Delegation contract = goal + output format + sources/tools + boundaries
  |--[Retrieval loop] Per sub-question (parallelizable, each with own context):
  |        search -> read -> reflect on gaps -> rewrite query -> search again
  |        Stop: sufficiency critic / loop cap / search penalty (all must be logged)
  |        Each fact >= 2 independent sources
  |--[Evidence arbitration] Decompose into atomic claims -> detect conflicts -> credibility weighting
  |        Ambiguity type: present multiple answers; Error type: filter -> produce fact cross-table
  |--[Synthesis] Write report following outline (save output to files, return references)
  |--[Verification] Independent citation pass + N skeptic adversarial verification
           Completeness critic: what's still missing? -> trigger next round
```

## Overall Takeaway

The training-based approach has a higher ceiling (it can learn strategies that are impossible to write by hand), but you don't have access to o3's training pipeline; the orchestration-based approach can be deployed today, and each stage can be independently replaced and evaluated. For most teams, the pragmatic path is to start with orchestration: first separate the "planning - retrieval - arbitration - verification" four passes, make stopping conditions and citation verification explicit, then decide based on budget whether to add multi-agent parallelism -- remember that number: +90.2% comes at the cost of 15x tokens, and only truly parallelizable breadth-oriented questions are worth it.

## References

- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [OpenAI — Introducing deep research](https://openai.com/index/introducing-deep-research/)
- [Search-R1 (arXiv:2503.09516)](https://arxiv.org/abs/2503.09516)
- [Self-RAG (official site)](https://selfrag.github.io/)
- [GPT Researcher (GitHub)](https://github.com/assafelovic/gpt-researcher)
- [NVIDIA AI-Q Blueprint](https://build.nvidia.com/nvidia/aiq)
- [NVIDIA AI-Q — Deep Researcher Agent architecture docs](https://docs.nvidia.com/aiq-blueprint/2.0.0/architecture/agents/deep-researcher.html)
- [RA-RAG: Reliability-Aware RAG (arXiv:2410.22954)](https://arxiv.org/abs/2410.22954)
- [DRAGged into Conflicts (arXiv:2506.08500)](https://arxiv.org/abs/2506.08500)
- [CiteEval (arXiv:2506.01829)](https://arxiv.org/abs/2506.01829)
- [Deep Research Agents: A Systematic Examination And Roadmap (arXiv:2506.18096)](https://arxiv.org/abs/2506.18096)
- [Cognition — Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)
