---
title: "Reading Stanford CS329Z Week 5: One Agent or a Meeting — Multi-Agent Systems and the Three Optimization Axes"
date: 2026-09-13
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 6
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 21
tldr: "Week 5 turns multi-agent collaboration into programmable conversation with AutoGen on Monday, then lays out the three optimization axes — prompts, weights, inference compute — with GEPA and the test-time compute paper on Wednesday. HW1 is due 10/30, the last full week before the deadline, so this installment helps you decide which axis deserves your effort."
description: "A guided reading of Stanford CS329Z Week 5: AutoGen's conversable agents and conversation programming, GEPA's reflective prompt evolution and difficulty-aware test-time compute, converging on a three-way choice for the HW1 finish."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization)

When one model cannot crack a problem, the instinct is to bring more models and split the work. One writes code, one runs it, one checks it — like holding a meeting. That is what the multi-agent debate is about: when is one worker enough, and when is the meeting worth it.

But anyone who has sat through meetings knows the meeting itself costs something. Who speaks first, who writes the conclusion, who owns the mistake — none of it is free. Model meetings work the same way, except quieter: the upstream agent's hallucination becomes the downstream agent's trusted fact. Monday (Oct 19, Multi-Agent Systems) assigns Wu et al.'s [AutoGen](https://arxiv.org/abs/2308.08155) (COLM 2024): a framework that turns meeting rules into programs.

Wednesday (Oct 21, Optimization) asks a different question: solo or meeting, a system improves in exactly three places. Prompts (the instructions), weights (the brain), inference compute (thinking longer). The anchors are Snell et al.'s [test-time compute paper](https://arxiv.org/abs/2408.03314) (ICLR 2025) and Agrawal et al.'s [GEPA](https://arxiv.org/abs/2507.19457). The timing is practical: [HW1 is due 10/30](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), and this is the last full week before it. This installment helps you decide which axis deserves your effort.

## Solo versus team: AutoGen writes the division of labor as conversation

AutoGen rests on two abstractions, and the [open-source implementation](https://github.com/microsoft/autogen) is there to play with. First, conversable agents: every agent receives messages, acts, and replies, with back ends drawn from LLMs, humans, tools, or mixes. The two built-ins do most of the work: AssistantAgent (the LLM engine that thinks and writes) and UserProxyAgent (the proxy for people and tools that runs code, returns results, and fetches a human when needed).

Second, conversation programming: complex flows are written as conversations between agents rather than pipelines. Computation (what to do on receiving a message) and control flow (who gets the next message, when to stop) both revolve around the dialogue. The machinery is a unified send/receive plus generate_reply, with auto-reply on top: an agent that receives a message replies automatically unless a termination condition fires.

Control comes in two flavors, code and natural language mixed. Natural-language control lives in the system message — fix errors and resubmit, reply TERMINATE when done. Programmatic control lives in Python — max reply rounds, tool-execution logic. The two convert into each other: one LLM call inside code switches to natural language, one LLM-proposed function call switches back.

The most memorable of the three applications is [ALFWorld](https://arxiv.org/abs/2010.03768): when a two-agent setup stalled in repetitive error loops, adding one grounding agent that supplied commonsense knowledge lifted success rates by 15% on average. The value of a team is not headcount — it is someone covering the job everybody ignores.

**What to do**: do not split yet. Run your HW1 agent over twenty questions and sort failures into two piles: one wrong step, everything after it wrong. Only when the same division boundary keeps reappearing (say code-writing and code-checking contaminating each other) do you cut along it into a second agent. Splits need failure evidence, not a pretty org chart.

## Coordination cost: the real bill for the meeting

Monday's lecture title names it directly: coordination and error propagation. Team architectures pay three bills. The first is handoff: agents pass not just answers but where things stand and why. Drop that context and the downstream agent repeats the mistake.

The second is error amplification: in a pipeline nobody checks, every extra stop is another chance to treat hallucination as fact. AutoGen rebuilds [OptiGuide](https://arxiv.org/abs/2307.03875) — originally a supply-chain Q&A system — as a multi-agent team: a Commander coordinating a Writer and a Safeguard, keeping checking independent of producing. Neither people nor models check their own work well.

The third is the process itself: who picks the next speaker. AutoGen's built-in GroupChatManager selects the next speaker dynamically with a role-play style prompt, then broadcasts the message to everyone, fitting collaboration with no fixed order. The price is debuggability: you must first reconstruct why it was someone's turn. Human involvement is cost design too: UserProxyAgent's human_input_mode ranges from asking every round to letting people skip. The paper's discussion section openly calls the automation-versus-human-control balance an open problem.

**What to do**: give your agent meeting three rules: a TERMINATE condition, a maximum round count, and one role that only checks and never acts (borrow the Safeguard). Run ten hard questions and log how often the checker intercepts and how often it false-alarms. That interception log is ready-made material for Part B's coordination-cost reflection.

## The three axes: prompts, weights, inference compute

Wednesday's positioning line is when to optimize prompts vs. weights vs. inference compute. This week's two anchors each guard one axis; the schedule lists further prompt optimizers alongside, but this installment stays with the anchors.

GEPA guards the prompt axis. It watches trajectories a system produces (reasoning, tool calls, tool outputs), reflects in natural language on what broke and which prompt line to change, then merges complementary lessons from its Pareto frontier of attempts. One line to remember: against [GRPO](https://arxiv.org/abs/2402.03300)-style RL tuning it uses as little as one thirty-fifth of the rollouts. It also beats [MIPROv2](https://arxiv.org/abs/2406.11695), then the leading prompt optimizer, by over ten percent. The [open-source implementation](https://github.com/gepa-ai/gepa) is public. One course aside: co-author Michael Ryan teaches this course and co-first-authored MIPRO (with Krista Opsahl-Ong). On the prompt-optimization thread, the teacher wrote the code.

Snell et al. guard the inference-compute axis. They split test-time compute into two moves: searching against a process verifier, and letting the model iteratively revise its own answers. The finding that matters is that which move wins depends entirely on question difficulty: easy questions reward patient revision, hard ones reward broad sampling. Difficulty bins come from the model's own pass rate, not the dataset's labels. Allocating compute-optimally — picking the move per question by difficulty — matches best-of-N scores at a quarter of the compute, measured on [MATH](https://arxiv.org/abs/2103.03874).

Pushing further, they pit saved compute against simply scaling the model: a smaller model plus inference compute beats a model 14x its size, with one precondition — the small model already solves the question occasionally. On the hardest questions extra inference compute barely helps, and pretraining wins instead. That sentence matters for HW1: grade your misses before spending compute on them.

The weight axis has no anchor this week; LoRA, distillation, and RLHF directions appear as schedule bullets only. That absence is itself a signal: on HW1's timescale, weights are usually off the table.

**What to do**: grade twenty validation questions first: solved first try, solved after retries, never solved however tuned. Spend prompt edits (GEPA-style: read the trajectory, change one line, rerun) on the first group. Spend inference compute (more samples plus verifier reranking) on the second. Stop on the third — that is a retrieval or weights problem, not a prompt fire to burn.

## Closing HW1: three things before submission

First, freeze Part A. Once [Week 4](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en) fixed the [ReAct](https://arxiv.org/abs/2210.03629) loop's shape, stop touching it — a frozen runnable version is your control group. Second, finish a shrunken Part B: rewrite exactly one stage, following [Week 3](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en). Third, write the three reflection lines: what the framework decided for you, which decision you dispute, and when you would switch back.

**What to do**: budget the last ten days — two to freeze Part A, five for the Part B comparison, three for reflection and cleanup. Move one axis per day: prompts today, compute tomorrow, splitting agents only the day after. Failures from mixed tuning cannot be written up.

## Where it sits in the course

One week remains after Week 5: a guest lecture plus Data for Agentic Systems in Week 6, [HW2 out on 10/26](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), HW1 due 10/30. Multi-agent error propagation returns in Week 8's safety and guardrails — injection attacks and sandboxes are the same bill. The three axes feed straight into the quarter project: every iteration before demo day is the same three-way choice. Week 4 fixed the loop's shape, Week 5 decides how many copies of it run and where effort goes. Read in order, HW1 is the final exam covering these five weeks.

## This week's course material

- Monday 10/19 Multi-Agent Systems: AutoGen anchors (covered above). [Cemri et al. collected 1600+ multi-agent traces](https://arxiv.org/abs/2503.13657) into MAST-Data. Failure modes sort into design flaws, inter-agent misalignment, and missing verification — a roll call for meeting failures. The echo of Monday's theme: coordination fails structurally, not randomly. [Neubig](https://openhands.dev/blog/dont-sleep-on-single-agent-systems) argues from [OpenHands](https://github.com/OpenHands/OpenHands) experience for the single agent: multi-agent pain is rigid structure, leaky context handoffs, and costly maintenance. One strong model with a general toolbox and a long prompt covers most divisions of labor. [Liu et al.'s DyLAN](https://arxiv.org/abs/2310.02170) picks the team first, then networks dynamically: on select [MMLU](https://arxiv.org/abs/2009.03300) subsets the right team lifts accuracy by up to 25%. Who plays is itself an optimizable variable.
- Wednesday 10/21 Optimization: Snell et al. and GEPA anchor (covered above). [Soylu et al. alternate weight fine-tuning with prompt optimization](https://aclanthology.org/2024.emnlp-main.597/), letting one model teach itself. On multi-hop QA and math reasoning, doing both beats either alone. [Opsahl-Ong et al.'s MIPRO](https://arxiv.org/abs/2406.11695) jointly optimizes instructions and demonstrations across stages, using mini-batch surrogate evaluation to solve cross-module credit assignment. The best case gains 13 points, and the optimizer ships in [DSPy](https://dspy.ai). Its successor MIPROv2 is the strongest baseline GEPA beats.
- Schedule: [CS329Z site, Week 5](https://cs329z.stanford.edu/)

## References

- On this site: [Week 4: ReAct and memory](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en), [Week 3: tools and DSPy](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155), [Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314), [Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- Tools: [AutoGen](https://github.com/microsoft/autogen), [GEPA](https://github.com/gepa-ai/gepa)
