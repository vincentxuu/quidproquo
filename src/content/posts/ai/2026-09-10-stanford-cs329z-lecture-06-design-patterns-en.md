---
title: "Tell Workflows from Agents, Then Learn to Think While Acting | Stanford CS329Z Lecture 6"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 7
tldr: "Lecture 06 compares workflows with agents: five composable workflow patterns, reasoning-and-acting patterns such as ReAct, Reflexion, CodeAct and ReWOO, and context-management techniques such as event logs, compaction, observation masking and context isolation, with the Pi harness as a case study. The assigned ReAct paper and Anthropic's Building Effective Agents each supply half the picture."
description: "A page-linked guide to the CS329Z Lecture 06 Agent Design Patterns & Scaffolds slides, plus digests of Yao et al.'s ReAct and Anthropic's guide to workflows and agents."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Imagine asking an assistant to look something up. Either it answers from memory without checking, or it clicks link after link without ever saying what it is looking for. When the first is wrong you cannot debug it; when the second goes off course you cannot tell where it is heading. Lecture 6 (Oct 12, Agent Design Patterns & Scaffolds) addresses that dilemma: what should be a fixed workflow, what should be left to the agent's own next-step decisions, and how to manage context over long tasks.

The assigned readings are Yao et al.'s [ReAct](https://arxiv.org/abs/2210.03629), Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents), and LangChain's Context Engineering, with Reflexion and CodeAct as additional readings. This post digests the first two: ReAct interleaves Thought and Action and checks each Observation, while Anthropic urges you to decide what is worth building as an agent at all. HW1 is midway at this point, and the shape of the loop has to be settled before the harness can grow. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

## Lecture 06 slide guide

<div class="slide-reader" data-slide-reader data-pages="86" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf">
<p>86 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–12: Adapt patterns to the task

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=1" data-slide-page="1">Slides 1–12</a>

Patterns need adaptation to their environment. The lecture distinguishes workflows and agents by where control flow lives: program logic can classify, retrieve, and draft in a fixed sequence; a model can investigate and choose steps from feedback. Real systems combine both.

Map a support flow and label each branch as a business rule or model decision. If all branches are known in advance, a reproducible workflow provides a useful baseline.

### Pages 13–30: Compose the five workflow patterns

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=13" data-slide-page="13">Slides 13–30</a>

Chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer are introduced separately, then composed in STORM and Archon. In STORM, inspect who decides the subtasks across research, synthesis, and critique. Simultaneous calls alone do not establish dynamic orchestration. Archon searches compositions of inference techniques.

Map your own research flow onto these patterns, then identify the slowest and most error-prone stage before adding another critique round.

### Pages 31–42: ReAct and Reflexion use feedback differently

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=31" data-slide-page="31">Slides 31–42</a>

ReAct interleaves reasoning, action, and observation. Reflexion additionally turns evaluations and failure reflections into text for a later attempt. The lecture cautions that unsupported self-evaluation can repeat an error; CRITIC adds tools to the verifier. The figures report particular research settings rather than a universal benefit from reflection.

Separate noticing a failed tool call from changing strategy because of it. The ReAct digest below examines the paper’s QA and interactive-environment experiments.

### Pages 43–54: Code actions, plans, and dependency-aware execution

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=43" data-slide-page="43">Slides 43–54</a>

CodeAct uses executable code as the action representation. A cross-country phone-price comparison illustrates loops and combined data processing; the execution environment and permissions become part of the design. ReWOO separates planning from tool execution, while LLMCompiler adds parallelism and dynamic replanning.

An original failure test can disable one price API. Identify independent work and dependent steps. Correct arithmetic over stale or missing prices can still produce a bad recommendation.

### Pages 55–75: Separate the complete event record from current context

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=55" data-slide-page="55">Slides 55–75</a>

The principles are focus and continuity: retain information needed now while preserving goals, constraints, and progress. OpenHands preserves original events and reconstructs model input. Offloading moves knowledge outside the window; compaction summarizes; observation masking hides older tool output; isolation limits subtask context. Progressive disclosure loads details when needed.

These methods can coexist. After removing lengthy test output, preserve the command, exit code, conclusion, and source path. A summary that drops “do not send yet” fails even if it saves many tokens.

### Pages 76–86: Pi shows the decisions inside a minimal harness

<a href="https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=76" data-slide-page="76">Slides 76–86</a>

The lecture’s Pi snapshot uses read, write, edit, and bash; a ReAct-style loop; tree-shaped history; progressive disclosure through skills; and compaction. Treat it as a course snapshot rather than a permanent feature list. Fewer tool definitions do not automatically constrain bash. [Page 78](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=78) lists what Pi deliberately leaves out: no subagents, no permission checks, no plan mode, no agent to-do lists, and no background bash. Features found in mainstream harnesses come from community extensions.

[Page 82](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf#page=82) stresses that Pi runs with the launching process's permissions and never pops up a confirmation, so it is effectively always in auto mode. Assess state retention, stopping behavior, and enforcement of user constraints alongside tool count. The final recap connects workflow, reasoning, and context choices to the next lecture on memory.

## Reading | ReAct: interleave reasoning with environment actions

[Required reading](https://arxiv.org/abs/2210.03629)

### TL;DR

ReAct interleaves reasoning and actions, using observations to update subsequent steps. QA and interactive environments show different tradeoffs, including task-dependent CoT hybrids.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | ICLR 2023 research spanning HotpotQA, FEVER, ALFWorld, WebShop, and manually analyzed trajectories. |
| Boundary | A zero hallucination category in a small audited sample is not a universal rate. Step caps and fallback rules are experimental settings. |
| Reading value | Useful for analyzing tool loops and environment feedback. |

### Background

Internal reasoning can invent facts, while action-only traces can repeat failures. ReAct brings environment observations back into the decision process.

### Intermediate guide

**ReAct: the think-act-observe loop**

ReAct's definition fits in one sentence: merge the language space into the action space. A model that could previously only emit actions may now also emit "thoughts" — thoughts never touch the outside environment, they only organize the context so far to inform the next move. Task trajectories then read as repeating Thought → Action → Observation sequences, with reasoning deciding what to look up and actions feeding outside information back into reasoning.

Why bother? The two prior roads each carry a terminal illness. Pure reasoning ([Chain-of-Thought](https://arxiv.org/abs/2202.03629)) is a static black box: the model generates thoughts from internal representations alone, ungrounded, so one wrong step compounds all the way down. Pure acting has no working memory: the paper's Act baseline forgets the sink holds no pepper shaker and repeats hallucinated moves in place. ReAct's claim is that humans cooking dinner already work this way — chopped vegetables prompt the thought to boil water, missing salt becomes soy sauce, a forgotten recipe means opening the cookbook. Thinking and doing serve each other.

The setups are deliberately asymmetric. Question answering runs on a deliberately spartan [Wikipedia](https://www.wikipedia.org/) API with exactly three moves: search an article, look up a string within the page, finish with an answer. Keeping retrieval weak forces the model to retrieve through explicit verbal reasoning instead of leaning on a strong retriever. Decision-making tasks (the [ALFWorld](https://alfworld.github.io/) text game, [WebShop](https://webshop-pnlp.github.io/) shopping navigation) flip the pattern: thoughts appear sparsely, and the model itself decides when to think versus when to act.

**Optional exercise**: implement a separate loop in this shape — three moves per iteration: one Thought line (why this action), one Action (one tool call), one Observation (what the tool returned). Add two guardrails: a step cap (7 steps for HotpotQA, 5 for FEVER, falling back to CoT-SC past the cap) plus a finish move that must carry an answer. For this exercise, sort every failed trajectory into three bins — reasoning error, empty retrieval, or repetition loop. The paper's appendix hands you that taxonomy for free.

**The controlled experiment: where did the hallucinations go**

ReAct's most readable table is not a leaderboard but Table 2, a hand-labeled error analysis. The authors sampled 50 correct and 50 incorrect trajectories for each method on HotpotQA, totaling 200 for manual analysis. Among [CoT](https://arxiv.org/abs/2202.03629)'s failures, hallucination accounts for 56%. Under the same audit, ReAct's hallucination category is 0% within the sampled failed trajectories; this is not a universal hallucination rate. The price is rigidity bought with structure: ReAct's reasoning-error rate runs higher than CoT's, and its signature death is replaying one thought-action pair forever, unable to break the loop.

Scores split by domain. On the [FEVER](https://fever.ai/) fact-checking task, ReAct beats CoT 60.9 to 56.3. On [HotpotQA](https://hotpotqa.github.io/) multi-hop QA, ReAct trails slightly at 27.4 to 29.4. The hybrids win overall. On HotpotQA, answer with ReAct first and fall back to CoT-SC on failure, reaching 35.1. On FEVER the reverse order wins: lead with CoT-SC and fall back to ReAct when consensus runs thin, reaching 64.6. Internal knowledge owns structure, external retrieval owns facts — a division of labor that multi-agent week will revisit.

Decision-making scores are cleaner: with only one or two in-context examples, ReAct beats imitation-learning baselines by 34 percentage points on ALFWorld. On WebShop it clears the previous best method by 10 percentage points. The finetuning result throws small models a lifeline: finetuned on just 3,000 correct trajectories, an 8B ReAct model overtakes every 62B prompting result. Teaching a model "how to look things up" generalizes better than teaching it "the answers" — translated to an email assistant, teach it how to search the inbox rather than stuffing the whole archive into the prompt.

**What to do**: give your agent a CoT fallback — when ReAct exhausts its step budget without an answer, back off to one pure-CoT attempt; when CoT's sampled consensus runs too thin, switch to ReAct with external lookup. Count how many questions each path rescues. Use the count in your own error analysis; the fallback design is a suggested experiment, not an official HW1 requirement.

### Deeper points

Readable traces are not complete causal explanations of model internals. Check execution, observation delivery, and stopping conditions directly.

### Reviewer in one sentence

It makes the feedback-sensitive trajectory an inspectable unit of agent behavior.

### Your take-away

Find the first missing-evidence, wrong-tool, or repeated-action point in a failed trace, then change one component and compare.

## Reading | Anthropic: when to use a workflow or an agent?

[Required reading](https://www.anthropic.com/engineering/building-effective-agents)

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

## Where it sits in the course

Lecture 6 fixes the shape of the loop; [Lecture 7](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en) asks what the loop should remember as it runs. Together they are the blueprint for growing HW1 from a retrieval pipeline into a full harness.

## Course material for this lecture

- Official slides (PDF): [Agent Design Patterns & Scaffolds — Lecture 06](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)
- Assigned readings: Yao et al., "ReAct" (digested here); Schluntz and Zhang, "Building Effective AI Agents" (digested here); LangChain, "Context Engineering"
- Additional readings: Shinn et al., "Reflexion"; Wang et al., "Executable Code Actions Elicit Better LLM Agents"
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 6 (Mon Oct 12), previously part of the "Week 4: reason while acting, then remember" guide; earlier entries below predate the split.
- 2026-10-29: Rechecked every section's page range against the Lecture 06/07 PDFs; the Pi case now lists the features the slides say it deliberately omits and its permission model (L06 pp. 78, 82).
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Expanded from the full Lecture 06/07 slides with design patterns, context management, memory architectures, evaluation, and an original worked example.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, memory and human-in-the-loop are explicit requirements); rewrote the opening, the ReAct/MemGPT "What to do" notes, and the course-position section to match
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 5: Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks-en), [Lecture 7: Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629), [Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- Projects and data: [ALFWorld](https://alfworld.github.io/), [WebShop](https://webshop-pnlp.github.io/), [FEVER](https://fever.ai/), [HotpotQA](https://hotpotqa.github.io/)
- Sources: [Anthropic, Building Effective Agents (2024)](https://www.anthropic.com/engineering/building-effective-agents)
