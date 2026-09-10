---
title: "Reading Stanford CS329Z Week 4: Learn to Think While Doing, Then Learn to Remember — ReAct and MemGPT"
date: 2026-09-12
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 5
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 23
tldr: "Week 4 pins the agent loop down as an interleaved think-act-observe sequence with the ReAct paper on Monday, then turns memory into OS-style tiered storage with the MemGPT paper on Wednesday. HW1 Part A closes the same week, so the loop shape and the memory design are the two things to finalize before grading."
description: "A guided reading of the Stanford CS329Z Week 4 anchors: how Yao et al.'s ReAct interleaves reasoning with acting, how Packer et al.'s MemGPT manages memory past context limits, and how both map to the HW1 Part A finish."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)

Picture hiring a research assistant with two failure modes: one sits at the desk answering from memory and going wrong where you cannot debug it, the other clicks links endlessly without ever saying what it is looking for. You cannot steer either of them. That dilemma is what Week 4's two anchor papers set out to fix.

Monday (Oct 12, Agent Patterns) assigns Yao et al.'s [ReAct](https://arxiv.org/abs/2210.03629) (ICLR 2023): let the model interleave "thinking" (Thought) with "doing" (Action), checking the environment's reply (Observation) after every step. Wednesday (Oct 14, Memory & Multi-Agent) assigns Packer et al.'s [MemGPT](https://arxiv.org/abs/2310.08560) (ICLR 2024): borrow hierarchical memory from operating systems and page information between a finite window and external storage through function calls. The same week closes [HW1](https://cs329z.stanford.edu/) Part A, where the loop's shape and the memory layout are the two decisions to lock in before submission.

For orientation: [Week 3](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en) released HW1 with a from-scratch agent in Part A, Week 4 hands you two papers as construction blueprints, and the [course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en) frames the whole course as engineering — this is the week the drawings get unrolled.

## ReAct: the think-act-observe loop

ReAct's definition fits in one sentence: merge the language space into the action space. A model that could previously only emit actions may now also emit "thoughts" — thoughts never touch the outside environment, they only organize the context so far to inform the next move. Task trajectories then read as repeating Thought → Action → Observation sequences, with reasoning deciding what to look up and actions feeding outside information back into reasoning.

Why bother? The two prior roads each carry a terminal illness. Pure reasoning ([Chain-of-Thought](https://arxiv.org/abs/2202.03629)) is a static black box: the model generates thoughts from internal representations alone, ungrounded, so one wrong step compounds all the way down. Pure acting has no working memory: the paper's Act baseline forgets the sink holds no pepper shaker and repeats hallucinated moves in place. ReAct's claim is that humans cooking dinner already work this way — chopped vegetables prompt the thought to boil water, missing salt becomes soy sauce, a forgotten recipe means opening the cookbook. Thinking and doing serve each other.

The setups are deliberately asymmetric. Question answering runs on a deliberately spartan [Wikipedia](https://www.wikipedia.org/) API with exactly three moves: search an article, look up a string within the page, finish with an answer. Keeping retrieval weak forces the model to retrieve through explicit verbal reasoning instead of leaning on a strong retriever. Decision-making tasks (the [ALFWorld](https://alfworld.github.io/) text game, [WebShop](https://webshop-pnlp.github.io/) shopping navigation) flip the pattern: thoughts appear sparsely, and the model itself decides when to think versus when to act.

**What to do**: freeze your HW1 Part A loop into this shape tonight — three moves per iteration: one Thought line (why this action), one Action (one tool call), one Observation (what the tool returned). Add two guardrails: a step cap (7 steps for HotpotQA, 5 for FEVER, falling back to CoT-SC past the cap) plus a finish move that must carry an answer. Before submitting, sort every failed trajectory into three bins — reasoning error, empty retrieval, or repetition loop. The paper's appendix hands you that taxonomy for free.

## The controlled experiment: where did the hallucinations go

ReAct's most readable table is not a leaderboard but Table 2, a hand-labeled error analysis. The authors sampled 200 trajectories and tagged each by hand. Among [CoT](https://arxiv.org/abs/2202.03629)'s failures, hallucination accounts for 56%. Under the same audit, ReAct's hallucination failures stand at 0%. The price is rigidity bought with structure: ReAct's reasoning-error rate runs higher than CoT's, and its signature death is replaying one thought-action pair forever, unable to break the loop.

Scores split by domain. On the [FEVER](https://fever.ai/) fact-checking task, ReAct beats CoT 60.9 to 56.3. On [HotpotQA](https://hotpotqa.github.io/) multi-hop QA, ReAct trails slightly at 27.4 to 29.4. The hybrids win overall. On HotpotQA, answer with ReAct first and fall back to CoT-SC on failure, reaching 35.1. On FEVER the reverse order wins: lead with CoT-SC and fall back to ReAct when consensus runs thin, reaching 64.6. Internal knowledge owns structure, external retrieval owns facts — a division of labor that multi-agent week will revisit.

Decision-making scores are cleaner: with only one or two in-context examples, ReAct beats imitation-learning baselines by 34 percentage points on ALFWorld. On WebShop it clears the previous best method by 10 percentage points. The finetuning result throws small models a lifeline: finetuned on just 3,000 correct trajectories, an 8B ReAct model overtakes every 62B prompting result. Teaching a model "how to look things up" generalizes better than teaching it "the answers" — a line worth quoting in the Part B reflection.

**What to do**: give your agent a CoT fallback — when ReAct exhausts its step budget without an answer, back off to one pure-CoT attempt; when CoT's sampled consensus runs too thin, switch to ReAct with external lookup. Count how many questions each path rescues. That count becomes the "error analysis" section of the Part A report almost verbatim.

## MemGPT: when memory runs short, borrow from the OS

If ReAct answers "how to move," MemGPT answers "how to remember." The motive is practical: transformer attention costs grow quadratically with length, and stretching context windows is both expensive and unreliable (models lose track of the middle). MemGPT takes another road: treat the context window as main memory, external stores as disk, and let the model serve as its own memory manager, paging information in and out through function calls.

The architecture has two tiers. Main context holds three prompt sections: read-only system instructions, a writable working context for load-bearing facts like user preferences and persona, and a FIFO message queue. External memory is two databases: recall storage with the full conversation history, archival storage with arbitrarily long outside documents. Near capacity (the paper's example warning line sits at 70% of the window), the system raises a "memory pressure" warning first so the model decides what deserves working context; only at the hard limit does the queue flush half its messages, leaving a recursive summary behind. Control flow runs on events and interrupts — user messages, system warnings, timers — and function chaining lets the model finish multi-step retrieval before replying.

Each experiment targets one pain point. In multi-session dialogue, baseline GPT-4 — shown only a lossy summary of the prior five sessions — manages only 32.1% accuracy on deep memory retrieval. The same underlying model wired through MemGPT, which pages through the full history, reaches 92.5%. In document QA, fixed-window baselines must truncate as documents grow and accuracy slides with it, while MemGPT pages through archival storage nearly unaffected. The prettiest result is nested key-value retrieval, where each value may be the next lookup's key across several hops: the GPT-4 baseline hits zero accuracy by three nesting levels, and only MemGPT keeps completing the chain.

**What to do**: split your agent's memory into two ledgers — working context holds only what would break the next move if lost (user goals, confirmed constraints), everything else lives in external storage behind retrieval. Then write one eviction rule: past how many queued messages you summarize, and that summaries keep facts, not small talk. Graders reward design trade-offs; that rule plus its rationale goes straight into the report.

## Where it sits in the course

Week 4 bridges both directions. Looking back, it gives [Week 2](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s workflow-versus-agent distinction a runnable shape: an agent is a ReAct loop plus tiered memory. Looking ahead, Wednesday's second half on multi-agent collaboration (roles, communication, emergent behavior) previews Week 5 — and the ReAct paper's closing note, that humans can steer an agent live by editing its Thoughts, is exactly where human-in-the-loop collaboration begins.

On the calendar, HW1 (due Oct 30) Part A should close this week: loop shape fixed, memory design fixed, leaving runs and error analysis. The Part B framework rewrite ([Week 3](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en)'s DSPy) can wait until next week. Recall the Week 1 thesis — systems beat models. This week's two papers are that sentence as working drawings.

## This week's course-material map

- Monday 10/12, Agent Design Patterns & Scaffolds: the anchor paper is ReAct (covered above); this session lists no additional readings.
- Wednesday 10/14, Agent Memory Architectures: the anchor paper is MemGPT (covered above). Three follow-ups each fill one gap.
  - The [Letta blog on agent memory](https://www.letta.com/blog/agent-memory) turns tiered memory into buildable parts: core-memory blocks pinned in context, recall holding the full history, archival storage for outside knowledge. It adds sleep-time agents that reorganize memory asynchronously while idle. Its one-line conclusion: memory is context engineering — what the agent remembers equals which tokens sit in its window.
  - [Mem0](https://arxiv.org/abs/2504.19413) takes the production route: dynamically extracting, consolidating, and retrieving salient facts mid-conversation, with a graph-structured variant for entity relations. On a long-dialogue benchmark's LLM-judged metric it improves 26% over OpenAI.
  - [Park et al.'s Generative Agents](https://arxiv.org/abs/2304.03442) shows the other end of memory: 25 agents inhabit a small town, storing complete experience logs in natural language. Agents periodically distill experience into higher-level reflections and retrieve them to plan. From a single seed — one agent wanting to throw a Valentine's Day party — invitations, date proposals, and coordinated attendance emerge on their own. Ablations confirm observation, planning, and reflection are each indispensable.
- Full schedule: [CS329Z site, Week 4](https://cs329z.stanford.edu/)

## References

- On this site: [Week 3: plug tools in, swap frameworks up](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en), [Week 2: workflows versus agents](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629), [Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560), [Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- Projects and data: [ReAct project page](https://react-lm.github.io/), [MemGPT research site](https://research.memgpt.ai/), [ALFWorld](https://alfworld.github.io/), [WebShop](https://webshop-pnlp.github.io/), [FEVER](https://fever.ai/), [HotpotQA](https://hotpotqa.github.io/)
