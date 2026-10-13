---
title: "Autonomous Agentic Systems: Rewards and Understanding Are the Bottleneck | Stanford CS329A Lecture 18"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 15
description: "From the transcript of Misha Laskin's public interview in July 2025: what Reflection AI learned building a code-comprehension agent, why evals are derived from customer problems, why team memory needs review, and why RL is bound by rewards."
tldr: "Laskin's view is that engineers spend 80% of their time understanding systems rather than writing code, and that how far RL goes depends on clean rewards, a problem he considers as hard as superintelligence itself."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-cs329a-session-18-autonomous-agentic-systems)

Earlier sessions covered methods: how to generate more candidates, how to verify, how to write feedback back into weights. Where do people get stuck when they build products with those methods? Session 18 of [CS329A](https://cs329a.stanford.edu/) Autumn 2025 was a guest lecture by Misha Laskin, CEO of [Reflection AI](https://reflection.ai/), titled "Building Agentic Systems for Autonomy: Lessons & Open questions." After reading this guide you should be able to say which piece he thinks coding agents lack, why he calls the field reward-bound, and which category a task's reward signal falls into. Prerequisites: reinforcement learning adjusts behavior with rewards, and LLM-as-judge means asking a model to grade.

Read [Lecture 13 on software engineering agents](/posts/ai/2026-10-11-cs329a-session-13-software-engineering-readings-en) and [Lecture 17 on long-horizon evaluation](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation-en) first.

**Video status: No recording or slides are public for this session.** On 2026-10-13 I checked the Stanford Online playlist, the official schedule and its edit history, both instructors' channels, and the speaker's personal site; none has material for this session. This guide uses public material from the speaker on a similar topic instead: the [transcript](https://ulisten.ai/channels/no-priors/no-priors-ep-123-with-reflectionai-co-founder-and-ceo-misha_xqyy_Zs8Fgw/transcript) of his interview on No Priors episode 123 in July 2025, read in full, four months before the CS329A session. The transcript is an automatic transcription on a third-party site, with errors in names and product names, and I did not check it against the audio. Quotations below are paraphrases and do not represent what was said in the session.

## Eighty percent of the problem is understanding, not generation

The product Laskin introduces, Asimov, is a code research agent positioned as "deep research for large codebases." His reason comes from watching enterprise customers: the productivity gain from coding tools is much lower than people expect, and sometimes negative.

His diagnosis is that the ratio is backwards. Today's tools put roughly 80% of the effort into generating code and 20% into understanding it. Engineers in an organization spend their time the other way around: 80% goes to understanding complex systems and asking colleagues questions. The knowledge is not only in the code; it is scattered across chats, project management tools, and engineers' heads.

He gives an example from his own company. A class of training batch jobs they call environment jobs suddenly ran five times slower. The cause was that the infrastructure team and the research team each submitted a pull request; both passed tests, and together they produced a race condition. A problem like this has no file name or function name to search for. He calls these semantic queries, and they usually take two or three engineers a few days to track down.

## Evals are derived backward from customer problems

How do you know the system improved? Laskin says this is the least discussed and possibly most important work at frontier labs. His approach is to work backward from customer pain points. For example, onboarding an engineer at a large company takes months, so you design evals that reflect whether the questions needed for onboarding can be answered, then find which capability the system lacks. That might be long-context reasoning over a codebase of a hundred million tokens, or it might be tool use.

He stresses being able to change the whole system: product features, agent design, and model training. If you can only change the product and agent design, you are limited by what third-party general models can do. This is also behind his reservation about benchmarks: models are close to the best in the world on competitive programming, yet when you ask a company whether they have helped, the answer is mixed; the host supplies the word "uneven" and he agrees. [Lecture 17](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation-en) asks the same question.

## Team memory needs a review process

Asimov lets engineers teach the system tribal knowledge, for example which kind of batch job "environment jobs" refers to, so that when someone else asks about the same term later, the system knows what it means. This is memory shared by a whole team. It differs from the single-agent memory in [Lecture 14](/posts/ai/2026-10-11-cs329a-session-14-agent-memory-readings-en) by adding another layer of questions: who can edit, who can view, and what happens when something wrong is written.

The approach he describes borrows from code management. Customers usually start with a small group of senior engineers as gatekeepers who populate the memory, then widen the scope; changing team memory will look like a pull request, approved by the person who really understands that system. He compares it to version control for knowledge about the code.

## Rewards are the bottleneck, and there is no shortcut

The part of the interview closest to "open questions" is his explanation of why RL cannot yet be scaled the way pretraining is. Laskin led reward models for Gemini 1 and 1.5. His view: if you had a reward that accurately describes the outcome of any task, the rest would be algorithmic progress, and even today's simple RL methods would go far.

In reality that reward does not exist, so everyone compromises. Having a model grade against a rubric works to a degree, but a noisy reward eventually gets hacked. Tasks with ground-truth answers have clean rewards, but there are few of them, and you can only hope training on them generalizes elsewhere. His conclusion is that the field is reward-bound and that no sudden breakthrough will change this, because a model that can accurately verify any outcome is probably a superintelligence itself. This is the industry version of the generation-verification gap from [Lecture 1](/posts/ai/2026-10-12-stanford-cs329a-lecture-01-generation-verification-gap-en).

He also points to an algorithmic gap: current RL methods make successful trajectories more frequent and failed ones less frequent, without discerning which part of a reasoning chain was right and which was wrong. That is why model reasoning often meanders.

On generalization he offers what he calls a hot take: there is no such thing as generalization, only bringing the test distribution into training. The meaning is that the generalization users experience mostly comes from training environments that already resembled what they asked about.

Near the end he extends this view to deployment: every sufficiently large category of work will have its own environment, tools, and agents; a general base model is only the starting point, and each category needs its own post-training. His examples are the models behind coding agents and deep research products, each trained for its own environment. He therefore expects the technical blueprint to be set within a few years, while actual deployment across fields takes decades.

## A worked example: classifying rewards for three tasks

This exercise was written for this guide; it is not from the interview. The "ground truth" and "noisy" categories are distinctions he makes in the interview; the third, "real outcome," is added here based on his remarks about customer-driven evals.

| Task | Reward source | Category | Main risk |
|---|---|---|---|
| Fix a failing unit test | Running the tests | Ground truth | Few task types; relies on generalization |
| Answer "why did jobs get five times slower" | A model grading against a rubric | Noisy | The grader gets exploited |
| Can a new hire be productive in two weeks | The customer's actual outcome | Real outcome | Slow feedback, few samples |

The reasoning: the first task can be checked by execution, so its reward is cleaner than a model grader's; it can still be bypassed by tricks such as deleting tests, which needs a separate check. The second has no executable ground truth; you can only ask a model whether the answer identified the two conflicting PRs, and that grader can be fooled by a long but empty answer. The third is what the customer actually cares about, but each observation takes weeks and cannot serve as a per-step training signal.

What the result means: training can directly use only the first two signals, and the gap between those two and the third is what Laskin says customer-driven evals are for.

## Variation check, with answers

Your grader model agrees with human spot checks 90% of the time. Can you safely use it as an RL reward? **Answer: not without further safeguards.** Agreement was measured on the current distribution of answers. RL pushes the model toward whatever the grader scores highly, including the 10% where the grader is wrong. You need to keep spot-checking high-scoring samples during training and hold out questions the grader has never seen. This answer is derived in this guide from his statement that a noisy reward gets hacked.

A common misreading takes this interview to say RL does not work. His position is the opposite: he sees RL as the path to superintelligence, with rewards and evaluation as the problem. Something to do tonight: write your agent project's success condition as one row of the table above and mark which reward category it belongs to.

## English reading and expression

Sentences written for this guide: *A noisy reward will eventually be exploited.* *Engineers spend most of their time understanding systems, not writing code.* Practice explaining in two sentences why the grader for the second task is risky. This is reading and expression practice, with no original audio to shadow.

## References

- [CS329A Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [No Priors Ep. 123: With ReflectionAI Co-Founder and CEO Misha Laskin (transcript, 2025-07-17)](https://ulisten.ai/channels/no-priors/no-priors-ep-123-with-reflectionai-co-founder-and-ceo-misha_xqyy_Zs8Fgw/transcript)
- [Reflection AI official site](https://reflection.ai/)
