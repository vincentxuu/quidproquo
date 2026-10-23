---
title: "Learn to Think While Doing, Then Learn to Remember — ReAct and MemGPT | Stanford CS329Z Week 4"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 5
tldr: "Week 4 connects the ReAct loop and MemGPT memory hierarchy to Lecture 06/07: composing design patterns, keeping context focused without losing commitments, choosing memory architectures, and evaluating correct use. An original email-assistant example tests whether compaction preserves an approval constraint."
description: "A guided reading of the Stanford CS329Z Week 4 anchors: how Yao et al.'s ReAct interleaves reasoning with acting, how Packer et al.'s MemGPT manages memory past context limits, and how both map to the HW1 agent harness."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Picture hiring a research assistant with two failure modes: one sits at the desk answering from memory and going wrong where you cannot debug it, the other clicks links endlessly without ever saying what it is looking for. You cannot steer either of them. That dilemma is what Week 4's two anchor papers set out to fix.

Monday (Oct 12, Agent Patterns) assigns Yao et al.'s [ReAct](https://arxiv.org/abs/2210.03629) (ICLR 2023): let the model interleave "thinking" (Thought) with "doing" (Action), checking the environment's reply (Observation) after every step. Wednesday (Oct 14, Agent Memory Architectures) assigns Packer et al.'s [MemGPT](https://arxiv.org/abs/2310.08560) (ICLR 2024): borrow hierarchical memory from operating systems and page information between a finite window and external storage through function calls. The same week lands mid-way through [HW1](https://cs329z.stanford.edu/), where the loop's shape and the memory layout are the two decisions to lock in before the harness grows further.

For orientation: [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en) released HW1 — build a company's internal AI assistant with no agent frameworks, just a chat-completion call and your own code, starting from pipelines that retrieve and reason over a real corporate email archive and growing into a harness with tools, a terminal, memory, and a human in the loop. Week 4 hands you two papers as construction blueprints, and the [course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en) frames the whole course as engineering — this is the week the drawings get unrolled.

This update uses the published Lecture 06/07 slides alongside the assigned papers. It covers the full topic structure of both decks; no unavailable classroom speech is reconstructed.

## ReAct: the think-act-observe loop

ReAct's definition fits in one sentence: merge the language space into the action space. A model that could previously only emit actions may now also emit "thoughts" — thoughts never touch the outside environment, they only organize the context so far to inform the next move. Task trajectories then read as repeating Thought → Action → Observation sequences, with reasoning deciding what to look up and actions feeding outside information back into reasoning.

Why bother? The two prior roads each carry a terminal illness. Pure reasoning ([Chain-of-Thought](https://arxiv.org/abs/2202.03629)) is a static black box: the model generates thoughts from internal representations alone, ungrounded, so one wrong step compounds all the way down. Pure acting has no working memory: the paper's Act baseline forgets the sink holds no pepper shaker and repeats hallucinated moves in place. ReAct's claim is that humans cooking dinner already work this way — chopped vegetables prompt the thought to boil water, missing salt becomes soy sauce, a forgotten recipe means opening the cookbook. Thinking and doing serve each other.

The setups are deliberately asymmetric. Question answering runs on a deliberately spartan [Wikipedia](https://www.wikipedia.org/) API with exactly three moves: search an article, look up a string within the page, finish with an answer. Keeping retrieval weak forces the model to retrieve through explicit verbal reasoning instead of leaning on a strong retriever. Decision-making tasks (the [ALFWorld](https://alfworld.github.io/) text game, [WebShop](https://webshop-pnlp.github.io/) shopping navigation) flip the pattern: thoughts appear sparsely, and the model itself decides when to think versus when to act.

**What to do**: freeze your HW1 loop into this shape tonight — three moves per iteration: one Thought line (why this action), one Action (one tool call), one Observation (what the tool returned). Add two guardrails: a step cap (7 steps for HotpotQA, 5 for FEVER, falling back to CoT-SC past the cap) plus a finish move that must carry an answer. Before submitting, sort every failed trajectory into three bins — reasoning error, empty retrieval, or repetition loop. The paper's appendix hands you that taxonomy for free.

## The controlled experiment: where did the hallucinations go

ReAct's most readable table is not a leaderboard but Table 2, a hand-labeled error analysis. The authors sampled 200 trajectories and tagged each by hand. Among [CoT](https://arxiv.org/abs/2202.03629)'s failures, hallucination accounts for 56%. Under the same audit, ReAct's hallucination failures stand at 0%. The price is rigidity bought with structure: ReAct's reasoning-error rate runs higher than CoT's, and its signature death is replaying one thought-action pair forever, unable to break the loop.

Scores split by domain. On the [FEVER](https://fever.ai/) fact-checking task, ReAct beats CoT 60.9 to 56.3. On [HotpotQA](https://hotpotqa.github.io/) multi-hop QA, ReAct trails slightly at 27.4 to 29.4. The hybrids win overall. On HotpotQA, answer with ReAct first and fall back to CoT-SC on failure, reaching 35.1. On FEVER the reverse order wins: lead with CoT-SC and fall back to ReAct when consensus runs thin, reaching 64.6. Internal knowledge owns structure, external retrieval owns facts — a division of labor that multi-agent week will revisit.

Decision-making scores are cleaner: with only one or two in-context examples, ReAct beats imitation-learning baselines by 34 percentage points on ALFWorld. On WebShop it clears the previous best method by 10 percentage points. The finetuning result throws small models a lifeline: finetuned on just 3,000 correct trajectories, an 8B ReAct model overtakes every 62B prompting result. Teaching a model "how to look things up" generalizes better than teaching it "the answers" — translated to an email assistant, teach it how to search the inbox rather than stuffing the whole archive into the prompt.

**What to do**: give your agent a CoT fallback — when ReAct exhausts its step budget without an answer, back off to one pure-CoT attempt; when CoT's sampled consensus runs too thin, switch to ReAct with external lookup. Count how many questions each path rescues. That count becomes the "error analysis" section of the HW1 report almost verbatim.

## MemGPT: when memory runs short, borrow from the OS

If ReAct answers "how to move," MemGPT answers "how to remember." The motive is practical: transformer attention costs grow quadratically with length, and stretching context windows is both expensive and unreliable (models lose track of the middle). MemGPT takes another road: treat the context window as main memory, external stores as disk, and let the model serve as its own memory manager, paging information in and out through function calls.

The architecture has two tiers. Main context holds three prompt sections: read-only system instructions, a writable working context for load-bearing facts like user preferences and persona, and a FIFO message queue. External memory is two databases: recall storage with the full conversation history, archival storage with arbitrarily long outside documents. Near capacity (the paper's example warning line sits at 70% of the window), the system raises a "memory pressure" warning first so the model decides what deserves working context; only at the hard limit does the queue flush half its messages, leaving a recursive summary behind. Control flow runs on events and interrupts — user messages, system warnings, timers — and function chaining lets the model finish multi-step retrieval before replying.

Each experiment targets one pain point. In multi-session dialogue, baseline GPT-4 — shown only a lossy summary of the prior five sessions — manages only 32.1% accuracy on deep memory retrieval. The same underlying model wired through MemGPT, which pages through the full history, reaches 92.5%. In document QA, fixed-window baselines must truncate as documents grow and accuracy slides with it, while MemGPT pages through archival storage nearly unaffected. The prettiest result is nested key-value retrieval, where each value may be the next lookup's key across several hops: the GPT-4 baseline hits zero accuracy by three nesting levels, and only MemGPT keeps completing the chain.

**What to do**: HW1 requires memory in the harness anyway, so split your agent's memory into two ledgers — working context holds only what would break the next move if lost (user goals, confirmed constraints), everything else lives in external storage behind retrieval. Then write one eviction rule: past how many queued messages you summarize, and that summaries keep facts, not small talk. Graders reward design trade-offs; that rule plus its rationale goes straight into the report.

## Lecture 06: design context as well as the loop

[Lecture 06: Agent Design Patterns and Scaffolds](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf) expands the week from ReAct to the whole harness. Start with who chooses control flow: a workflow has steps arranged by code; an agent lets the model choose its next step from observations. A system can combine them, for example by classifying emails through fixed steps and letting an agent investigate uncertain cases.

The slides organize workflows into prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer. The distinction is more than model count. Parallel work can be divided beforehand; an orchestrator determines subtasks dynamically. Evaluation-and-revision loops need feedback that can be articulated and used to improve the output. Reasoning/action designs also extend beyond ReAct: Reflexion turns external feedback into reflections for later attempts, CodeAct expresses actions as code, and ReWOO/LLMCompiler separate planning from execution. These are composable choices.

Context design pursues two goals together: focus on what the current task needs and preserve continuity of goals, constraints, and progress. Replaying everything creates bloat; clearing everything loses commitments. The slides describe compatible patterns:

| Pattern | What it preserves or changes |
|---|---|
| Persistent event log | Append original events, then reconstruct model input for each call. History and prompt are different objects. |
| Memory offloading | Store knowledge in files or memory, allowing recoverable material to leave context. |
| Compaction | Replace old trajectories with a shorter summary, preserving unfinished work and constraints. |
| Observation masking | Hide or truncate old tool output so long observations stop occupying the window. |
| Context isolation | Give subtasks only the context they need; disclose tools and skills as needed. |

The Pi case study illustrates a small tool surface with deliberate context management: the slides describe read, bash, edit, and write as default tools, alongside event logs, progressive disclosure through skills, and compaction. This describes the course's example; fewer tools do not by themselves establish greater reliability.

**Check your understanding**: does masking old tool output delete the record? No. The event log can preserve the original while the model sees a selected view. Recoverability is lost only if the original evidence cannot be retrieved.

## Lecture 07: decide what to remember before choosing storage

[Lecture 07: Agent Memory Architectures](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf) separates memory's purpose from its implementation. Working memory is what the model currently sees; episodic memory contains past conversations or trajectories; semantic memory holds facts, preferences, and knowledge; procedural memory describes how to perform tasks. Knowledge and skills in model weights are parametric memory; retrieved information supplied in the window is context memory. Selecting a vector database does not decide what deserves remembering.

Write down what, when, and how in that order. Are you storing facts, procedures, or progress? Do tools, events, or background workers trigger storage and retrieval? Then choose a filesystem, database, or knowledge graph. Files offer hierarchy and grep; databases can combine vector retrieval, exact terms, and metadata queries; graphs represent entity relationships. These describe storage and retrieval options rather than categories of memory purpose.

The slides group architectures into four patterns. Voyager/AWM turn successful experience into reusable procedures; MemGPT/MemoryOS organize short- and long-term information in tiers; Generative Agents consolidate experiences through reflection; sleep-time compute, A-Mem, and Mem0 illustrate maintenance, updates, and removal. When a new preference contradicts an old one, appending another item is insufficient: the system must decide whether the old item remains valid.

**Check your understanding**: how do you classify “the user said yesterday to send reports on Friday” and “the steps for sending a report”? The original conversation is episodic; the extracted current preference is semantic; the method is procedural. One event can yield multiple kinds of memory, depending on their purpose.

## Original worked example: can a summary preserve a prior constraint?

This is an original teaching example, not a lecturer's account or an official assignment solution. An email assistant receives: “Compare supplier quotes. Draft only; wait for my approval before sending.” After reading several emails, its window gets crowded. In the next conversation the user says: “Change the budget to eighty thousand and continue the comparison.”

Append both requests and tool results to the event log so original evidence stays recoverable. Keep the comparison goal, the new budget, the draft-only constraint, the approval requirement, and unfinished suppliers in working memory. Store email bodies separately with source IDs. A summary carries progress forward; old verbose observations can be masked. Retrieve relevant quotes when comparing them instead of replaying the entire archive every turn.

```diagram
title: History is not the current input
desc: A context manager selects from logs and memory while preserving recoverable evidence.
caption: Simplified architecture for this example; writes and maintenance omitted.
---
<svg viewBox="0 0 440 360">
  <path class="dg-line" d="M112 80V112Q112 120 120 120H172V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M328 80V112Q328 120 320 120H268V156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 224V276" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="16" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="112" y="40" text-anchor="middle" dominant-baseline="central">Event log</text>
  <text class="dg-sub" x="112" y="60" text-anchor="middle" dominant-baseline="central">Requests and results</text>
  <rect class="dg-box" x="232" y="16" width="192" height="64" rx="6"/>
  <text class="dg-label" x="328" y="40" text-anchor="middle" dominant-baseline="central">Memory store</text>
  <text class="dg-sub" x="328" y="60" text-anchor="middle" dominant-baseline="central">Facts, skills, sources</text>
  <rect class="dg-box dg-box--accent" x="80" y="160" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="184" text-anchor="middle" dominant-baseline="central">Context manager</text>
  <text class="dg-sub" x="220" y="204" text-anchor="middle" dominant-baseline="central">Select, summarize, retrieve</text>
  <rect class="dg-box" x="80" y="280" width="280" height="64" rx="6"/>
  <text class="dg-label" x="220" y="304" text-anchor="middle" dominant-baseline="central">Model input</text>
  <text class="dg-sub" x="220" y="324" text-anchor="middle" dominant-baseline="central">Goal, limits, evidence</text>
</svg>
```

Across sessions, semantic memory can replace the old budget with the new one while the episodic log preserves the change. The sending procedure checks approval before execution. The assistant may complete a comparison draft, but “continue” does not authorize sending. Memory earns its value through the next correct action, rather than the volume stored.

**Variation and answer criteria**: a summary says only “quotes reviewed; continue comparing” and drops “draft only.” Does it pass? No. A passing system preserves or retrieves that constraint, updates the budget, cites quote sources, and stops at a draft. Additional tests can cover changing preferences, abstaining when evidence is absent, and maintaining memory after a deletion request. These are suggested tests for this example, not official HW1 grading rules.

## Evaluate whether memory is used correctly

Lecture 07 asks for realistic, long-context, challenging, and verifiable evaluations. LoCoMo tests capabilities over long conversations; PersonaMem adds evolving preferences; LongMemEval-v2 asks about agent trajectory details; MemoryArena moves toward actual task completion. Retrieval hits alone are insufficient: the slides note that a model can receive the right memory and still misuse it, while a complex task failure cannot always be attributed entirely to memory.

For the worked example, separately record whether the constraint was stored, retrieved, and obeyed. Sending the email fails the task even if retrieval succeeded. The slides also raise uncertain future relevance, poisoned memories, privacy and user control, and over-personalization. Concrete engineering questions follow: can evidence be traced, can old preferences be updated, can users delete memories, and can irrelevant memories be ignored?

## Where it sits in the course

Week 4 bridges both directions. Looking back, it gives [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s workflow-versus-agent distinction a runnable shape: ReAct and tiered memory offer composable agent designs. Looking ahead, multi-agent collaboration (roles, communication, emergent behavior) is the focus of Week 5 — and the ReAct paper's closing note, that humans can steer an agent live by editing its Thoughts, is exactly where human-in-the-loop collaboration begins, and it is the hook HW1 asks you to leave open for a human.

On the calendar, HW1 (due Oct 30) should get its skeleton settled this week: loop shape fixed, memory design fixed, which leaves the next two weeks for wiring in the terminal, adding the human-in-the-loop step, running evaluations, and writing error analysis. The assignment bans frameworks throughout, so [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en)'s DSPy stays in lecture, where you can see how it abstracts the parts you are writing by hand. Recall the Week 1 thesis — systems beat models. This week's two papers are that sentence as working drawings.

## This week's course-material map

- Monday 10/12, Agent Design Patterns & Scaffolds: the anchor paper is ReAct (covered above); this session lists no additional readings.
- Wednesday 10/14, Agent Memory Architectures: the anchor paper is MemGPT (covered above). Three follow-ups each fill one gap.
  - The [Letta blog on agent memory](https://www.letta.com/blog/agent-memory) turns tiered memory into buildable parts: core-memory blocks pinned in context, recall holding the full history, archival storage for outside knowledge. It adds sleep-time agents that reorganize memory asynchronously while idle. Its one-line conclusion: memory is context engineering — what the agent remembers equals which tokens sit in its window.
  - [Mem0](https://arxiv.org/abs/2504.19413) takes the production route: dynamically extracting, consolidating, and retrieving salient facts mid-conversation, with a graph-structured variant for entity relations. On a long-dialogue benchmark's LLM-judged metric it improves 26% over OpenAI.
  - [Park et al.'s Generative Agents](https://arxiv.org/abs/2304.03442) shows the other end of memory: 25 agents inhabit a small town, storing complete experience logs in natural language. Agents periodically distill experience into higher-level reflections and retrieve them to plan. From a single seed — one agent wanting to throw a Valentine's Day party — invitations, date proposals, and coordinated attendance emerge on their own. Ablations confirm observation, planning, and reflection are each indispensable.
- Full schedule: [CS329Z site, Week 4](https://cs329z.stanford.edu/)

## Update log

- 2026-10-23: Expanded from the full Lecture 06/07 slides with design patterns, context management, memory architectures, evaluation, and an original worked example.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, memory and human-in-the-loop are explicit requirements); rewrote the opening, the ReAct/MemGPT "What to do" notes, and the course-position section to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## References

- [Lecture 06: Agent Design Patterns and Scaffolds](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)
- [Lecture 07: Agent Memory Architectures](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)

- On this site: [Week 3: plug tools in, swap frameworks up](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en), [Week 2: workflows versus agents](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629), [Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560), [Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- Projects and data: [ReAct project page](https://react-lm.github.io/), [MemGPT research site](https://research.memgpt.ai/), [ALFWorld](https://alfworld.github.io/), [WebShop](https://webshop-pnlp.github.io/), [FEVER](https://fever.ai/), [HotpotQA](https://hotpotqa.github.io/)
