---
title: "One Agent or a Meeting — Multi-Agent Systems and the Three Optimization Axes | Stanford CS329Z Week 5"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 6
tldr: "Lecture 08 explains orchestration, communication, task ledgers and worktree isolation. Lecture 09 starts with data and evaluation, then compares context optimization, SFT, RL and distillation. Use a traceable email example to decide whether collaboration or optimization addresses the actual bottleneck."
description: "A guided reading of Stanford CS329Z Week 5: AutoGen's conversable agents and conversation programming, GEPA's reflective prompt evolution and difficulty-aware test-time compute, converging on a three-way choice for finishing HW1."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

This update uses the full Lecture 08–09 slide text, alongside the assigned papers. Prerequisite: the agent loop and memory model in [Week 4](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en).

When one model cannot crack a problem, the instinct is to bring more models and split the work. One writes code, one runs it, one checks it — like holding a meeting. That is what the multi-agent debate is about: when is one worker enough, and when is the meeting worth it.

But anyone who has sat through meetings knows the meeting itself costs something. Who speaks first, who writes the conclusion, who owns the mistake — none of it is free. Model meetings work the same way, except quieter: the upstream agent's hallucination becomes the downstream agent's trusted fact. Monday (Oct 19, Multi-Agent Systems) assigns Wu et al.'s [AutoGen](https://arxiv.org/abs/2308.08155) (COLM 2024): a framework that turns meeting rules into programs.

Wednesday (Oct 21, Optimization) turns to improving the system, whether it uses one agent or a team: three useful places to examine are prompts (the instructions), weights (the brain), and inference compute (thinking longer). The anchors are Snell et al.'s [test-time compute paper](https://arxiv.org/abs/2408.03314) (ICLR 2025) and Agrawal et al.'s [GEPA](https://arxiv.org/abs/2507.19457). The timing is practical: [HW1 is due 10/30](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), and this is the last full week before it. This installment helps you decide which axis deserves your effort.

## Solo versus team: AutoGen writes the division of labor as conversation

AutoGen rests on two abstractions, and the [open-source implementation](https://github.com/microsoft/autogen) is there to play with. First, conversable agents: every agent receives messages, acts, and replies, with back ends drawn from LLMs, humans, tools, or mixes. The two built-ins do most of the work: AssistantAgent (the LLM engine that thinks and writes) and UserProxyAgent (the proxy for people and tools that runs code, returns results, and fetches a human when needed).

Second, conversation programming: complex flows are written as conversations between agents rather than pipelines. Computation (what to do on receiving a message) and control flow (who gets the next message, when to stop) both revolve around the dialogue. The machinery is a unified send/receive plus generate_reply, with auto-reply on top: an agent that receives a message replies automatically unless a termination condition fires.

Control comes in two flavors, code and natural language mixed. Natural-language control lives in the system message — fix errors and resubmit, reply TERMINATE when done. Programmatic control lives in Python — max reply rounds, tool-execution logic. The two convert into each other: one LLM call inside code switches to natural language, one LLM-proposed function call switches back.

The most memorable of the three applications is [ALFWorld](https://arxiv.org/abs/2010.03768): when a two-agent setup stalled in repetitive error loops, adding one grounding agent that supplied commonsense knowledge lifted success rates by 15% on average. The value of a team is not headcount — it is someone covering the job everybody ignores.

**What to do**: do not split yet. Run your HW1 email assistant over twenty questions and sort failures into two piles: one wrong step, everything after it wrong. Only when the same division boundary keeps reappearing (say code-writing and code-checking contaminating each other) do you cut along it into a second agent. Splits need failure evidence, not a pretty org chart.

## Coordination cost: the real bill for the meeting

Monday's lecture title names it directly: coordination and error propagation. Team architectures pay three bills. The first is handoff: agents pass not just answers but where things stand and why. Drop that context and the downstream agent repeats the mistake.

The second is error amplification: in a pipeline nobody checks, every extra stop is another chance to treat hallucination as fact. AutoGen rebuilds [OptiGuide](https://arxiv.org/abs/2307.03875) — originally a supply-chain Q&A system — as a multi-agent team: a Commander coordinating a Writer and a Safeguard, keeping checking independent of producing. Neither people nor models check their own work well.

The third is the process itself: who picks the next speaker. AutoGen's built-in GroupChatManager selects the next speaker dynamically with a role-play style prompt, then broadcasts the message to everyone, fitting collaboration with no fixed order. The price is debuggability: you must first reconstruct why it was someone's turn. Human involvement is cost design too: UserProxyAgent's human_input_mode ranges from asking every round to letting people skip. The paper's discussion section openly calls the automation-versus-human-control balance an open problem.

**What to do**: HW1 bans frameworks, so write AutoGen's rules into your own loop: a TERMINATE condition, a maximum round count, and one role that only checks and never acts (borrow the Safeguard). When the checker is unsure, have it stop and ask a person — exactly the human in the loop HW1 requires. Run ten hard questions and log how often the checker intercepts, how often it false-alarms, and how often it hands off to a human. That interception log is ready-made material for the report's coordination-cost section.

## The three axes: prompts, weights, inference compute

Wednesday's positioning line is when to optimize prompts vs. weights vs. inference compute. This week's two anchors each guard one axis; the schedule lists further prompt optimizers alongside, but this installment stays with the anchors.

GEPA guards the prompt axis. It watches trajectories a system produces (reasoning, tool calls, tool outputs), reflects in natural language on what broke and which prompt line to change, then merges complementary lessons from its Pareto frontier of attempts. Its [open-source implementation](https://github.com/gepa-ai/gepa) makes the loop concrete: propose a prompt change, run it, inspect feedback, and retain useful candidates. Lecture 09 places GEPA alongside MIPROv2 and TextGrad, not as a guarantee that any particular prompt search wins on your workload.

Snell et al. guard the inference-compute axis. They split test-time compute into two moves: searching against a process verifier, and letting the model iteratively revise its own answers. The paper studies how the usefulness of revision and search changes with task difficulty and compute budget. Its experiments on [MATH](https://arxiv.org/abs/2103.03874) motivate allocating compute selectively; they do not prove that an email assistant's persistent failures require new weights. Missing retrieval results, invalid tools, or a misleading evaluator can produce the same symptom. Read the trace before choosing an optimization axis.

Lecture 09 goes substantially further than the reading list: weights occupy a full section. Supervised fine-tuning (SFT) trains a student on teacher-completed trajectories; filtering for successful outputs avoids treating every rollout as a demonstration. Reinforcement learning instead samples the student's own attempts and uses task rewards. The lecture contrasts PPO and GRPO: GRPO derives relative advantages from a group of outputs, reducing dependence on a separate value model. On-policy distillation also starts from student-generated trajectories, but a teacher supplies token-level distribution feedback. These are different feedback mechanisms, not interchangeable names for training.

**Check your understanding:** you have a strong teacher's successful task traces, but cannot execute new student attempts in the environment. Which route is directly supported? **Answer criterion:** identify SFT on those traces; explain that RL needs student rollouts and reward feedback, while on-policy distillation requires feedback on trajectories sampled from the student.

## From conversation to coordination: Lecture 08's three layers

[Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf) separates orchestration, communication, and coordination. Orchestration divides work; communication moves information; coordination manages dependencies, commitments, and shared resources. Being able to exchange messages establishes only the second layer.

| Pattern | Intermediate information | A useful condition to test | Main cost |
|---|---|---|---|
| Independent | Separate work, final aggregation | Independent sources or candidate solutions | Cannot use intermediate findings from peers |
| Centralized | Orchestrator delegates and collects | One owner must integrate results | Central bottleneck |
| Decentralized | Direct peer exchange | Broad exploration and self-selected tasks | Commitments and conflicts become harder to track |
| Hybrid | Central integration, limited peer exchange | Global goals with local dependencies | Rules for direct coordination are necessary |

Communication also distinguishes handoff from agent-as-tool. A handoff transfers control to a specialist who owns subsequent steps. An agent-as-tool handles a bounded request and returns a result while its caller retains control. This determines who owns the final answer; counting model calls does not tell you that.

Coordination needs inspectable state. A task ledger records goals, ownership, dependencies, progress, and blockers. Shared memory preserves experience across tasks. Worktree isolation gives coding agents separate checkouts and branches. Isolation reduces interference during execution; completed changes still need conflict resolution and tests of the combined result. Separate green tests do not establish successful integration.

**Check your understanding:** two agents read the same chat but implement incompatible versions of one interface. Why can integration still fail? **Answer criterion:** distinguish the information channel from resource ownership and interface commitments. Add explicit owners in the ledger, an interface agreement, isolated workspaces, and integration checks.

The lecture groups failures around system design, inter-agent behavior, and verification, and also warns about conformity and incompatible goals. Agreement does not establish stronger evidence; individual success does not establish a shared outcome. A reviewer should inspect original tool results and tests instead of endorsing another agent's summary alone.

## Let data choose the intervention: Lecture 09

[Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf) begins with three requirements: data, an executable system, and evaluation with metrics. An optimizer cannot clarify an undefined notion of success. Track cost and latency alongside success rate. Separate development examples from held-out acceptance examples so that learning a familiar question set is not mistaken for generalization.

Context optimization includes more than editing a system instruction. Few-shot methods collect successful trajectories and search for useful combinations. MIPROv2 proposes both instructions and demonstrations, using minibatch evaluations to guide search. Reflective methods examine traces and feedback to propose changes. Saving only final scores loses the tool evidence that could identify which module needs revision.

| Available conditions | Intervention to test first | What to establish |
|---|---|---|
| API-only models, frequent task changes, expensive interaction | Context / prompt optimization | Evaluation covers real failures |
| A capable teacher and a cheaper target student | SFT / distillation | Quality and diversity of teacher trajectories |
| Student interaction and verifiable task completion | RL | Rewards reflect actual completion |
| Retries help some questions and a verifier is reliable | More inference compute | Benefit justifies cost and latency |

This table is a starting point synthesized from the lecture, not an exclusive menu. BetterTogether illustrates alternating prompts, weights, then prompts again. The lecture also considers agents that modify harnesses, run experiments, and retain improvements. More autonomous exploration makes evaluator integrity more important: keep acceptance checks outside the optimizer's editable scope and reserve unseen examples.

## Worked example: two agents organize email

This is an original teaching example. Its numbers are illustrative, not official homework results. The task is to answer, “Which emails support delaying delivery this week?” Claims must be traceable to original messages. A retrieval agent finds evidence; a synthesis agent writes the answer. If the retrieval summary turns “might delay” into “delay confirmed,” fluent synthesis only propagates the error.

Define a handoff contract: every claim includes an email ID, source text, and uncertainty. The task ledger records who completed retrieval and whether counterevidence remains missing. The synthesizer may not promote a tentative claim to a confirmed fact. Final verification checks citations and wording against original emails.

```diagram
title: Evidence survives the handoff
desc: Retrieval passes source evidence and uncertainty to synthesis, then verification checks original emails.
caption: Original teaching example; arrows show artifact flow.
---
<svg viewBox="0 0 440 440">
<path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 200V240" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 312V352" marker-end="url(#arrow)"/>
<rect class="dg-box" x="40" y="16" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="52" text-anchor="middle" dominant-baseline="central">Retrieve original emails</text>
<rect class="dg-box dg-box--accent" x="40" y="128" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="164" text-anchor="middle" dominant-baseline="central">Handoff: ID, text, uncertainty</text>
<rect class="dg-box" x="40" y="240" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="276" text-anchor="middle" dominant-baseline="central">Synthesize within evidence</text>
<rect class="dg-box" x="40" y="352" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="388" text-anchor="middle" dominant-baseline="central">Verify against original emails</text>
</svg>
```

Suppose a frozen baseline succeeds on twelve of twenty held-out questions. Inspecting separate development examples reveals that most failures discard uncertainty at the handoff. First change the handoff prompt and add one successful demonstration. A rerun on the held-out set succeeds on sixteen questions: success increases from 60% to 80%, or twenty percentage points. This is a comparison on illustrative data; a small sample does not guarantee the same future gain. Once those questions have been repeatedly used to choose versions, reserve another unseen set for final acceptance.

Next examine cost and remaining traces. If the search tool never returned the relevant email, another reviewer cannot invent missing evidence: inspect queries and indexing first. If a correct candidate exists but selection fails, test more candidates with a verifier. Splitting agents, editing prompts, and training weights should each target an identified bottleneck through a controlled comparison.

**Synthesis check:** after expanding to three agents, each reports success but the final answer remains wrong. What should you check before adding agents? **Answer criterion:** compare the end-to-end answer with original emails and locate the handoff where information changed. Inspect the ledger, contract, and evaluator. Expand only after identifying a separable bottleneck and measuring benefits against coordination costs. A failure alone cannot establish a need for fine-tuning.

## Closing HW1: three things before submission

First, freeze the skeleton. Once [Week 4](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en) fixed the [ReAct](https://arxiv.org/abs/2210.03629) loop's shape and the memory tiers, stop touching them — a frozen runnable version is your control group. Second, complete the harness: HW1 wants more than a pipeline that searches email — it wants tools, a terminal, memory, and a human in the loop. Fill whichever piece is missing first, and after each one rerun the same email question set against the frozen version. Third, write three lines of error analysis: which kinds of questions fail most, whether failures land in retrieval or reasoning, and where the human checkpoint caught a mistake.

**What to do**: budget the remaining time in proportion to what is missing: freeze the skeleton, complete the harness piece by piece with comparisons, and reserve time for error analysis and cleanup. Move one axis per day: prompts today, compute tomorrow, splitting agents only the day after. Failures from mixed tuning cannot be written up.

## Where it sits in the course

Week 6 follows with a guest lecture plus Data for Agentic Systems, [HW2 out on 10/26](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), HW1 due 10/30. Multi-agent error propagation returns in Week 8's safety and guardrails — injection attacks and sandboxes are the same bill. The three axes feed straight into the quarter project: every iteration before demo day is the same three-way choice. Week 4 fixed the loop's shape, Week 5 decides how many copies of it run and where effort goes. Read in order, HW1 is the final exam covering these five weeks.

## This week's course material

- Monday 10/19 Multi-Agent Systems: AutoGen anchors (covered above). [Cemri et al. collected 1600+ multi-agent traces](https://arxiv.org/abs/2503.13657) into MAST-Data. Failure modes sort into design flaws, inter-agent misalignment, and missing verification — a roll call for meeting failures. The echo of Monday's theme: coordination fails structurally, not randomly. [Neubig](https://openhands.dev/blog/dont-sleep-on-single-agent-systems) argues from [OpenHands](https://github.com/OpenHands/OpenHands) experience for the single agent: multi-agent pain is rigid structure, leaky context handoffs, and costly maintenance. One strong model with a general toolbox and a long prompt covers most divisions of labor. [Liu et al.'s DyLAN](https://arxiv.org/abs/2310.02170) picks the team first, then networks dynamically: on select [MMLU](https://arxiv.org/abs/2009.03300) subsets the right team lifts accuracy by up to 25%. Who plays is itself an optimizable variable.
- Wednesday 10/21 Optimization: Snell et al. and GEPA anchor (covered above). [Soylu et al. alternate weight fine-tuning with prompt optimization](https://aclanthology.org/2024.emnlp-main.597/), letting one model teach itself. On multi-hop QA and math reasoning, doing both beats either alone. [Opsahl-Ong et al.'s MIPRO](https://arxiv.org/abs/2406.11695) jointly optimizes instructions and demonstrations across stages, using mini-batch surrogate evaluation to solve cross-module credit assignment. The best case gains 13 points, and the optimizer ships in [DSPy](https://dspy.ai). Its successor MIPROv2 is the strongest baseline GEPA beats.
- Schedule: [CS329Z site, Week 5](https://cs329z.stanford.edu/)

## Update log

- 2026-10-23: Added Lecture 08–09 material on coordination, worktrees, weight optimization and evaluation-based choices; added an original worked example, diagram and answer criteria.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, the corpus is now a corporate email archive, the goal is a framework-free full harness); rewrote the ten-day "Closing HW1" plan and the HW1 hooks in each "What to do" note
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## References

- On this site: [Week 4: ReAct and memory](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en), [Week 3: tools and DSPy](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Slides: [Lecture 08: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)、[Lecture 09: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155), [Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314), [Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- Tools: [AutoGen](https://github.com/microsoft/autogen), [GEPA](https://github.com/gepa-ai/gepa)
