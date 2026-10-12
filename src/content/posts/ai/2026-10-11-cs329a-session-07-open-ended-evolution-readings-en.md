---
title: "Open-Ended Evolution: A Reading Guide | Stanford CS329A Lecture 7"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 7
description: "Compare DGM, the AI Scientist, and AlphaEvolve through an archive-branch example and held-out evaluation."
tldr: "Open-ended evolution changes agent code and workflows; archives preserve branches, while held-out tests assess generalization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cs329a-session-07-open-ended-evolution-readings)

Once an agent can write code, can it change its own tools and problem-solving workflow rather than merely produce another answer? This guide reads the assigned papers for [CS329A](https://cs329a.stanford.edu/) Autumn 2025 session 7. You will distinguish answer search from system search and design a search loop that does not reward only the current winner. You need to know that agents call tools and tests return feedback; evolutionary algorithms are not a prerequisite.

Read [Lecture 6 on weight updates](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl-en) first to distinguish workflow changes from model training.

**Video status: The official schedule does not list a recording.** The nine public videos checked on 2026-10-11 did not include a match for this session. This does not establish that no recording exists. This is a paper-based explanation, not a reconstruction of the spoken lecture.

## What actually changes?

The [Darwin Gödel Machine (DGM)](https://arxiv.org/abs/2505.22954) modifies its own coding-agent implementation and evaluates the resulting agent on coding tasks. Changes can affect file-reading interfaces, editing tools, or problem-solving workflows. Updating the underlying language model's weights is not the object of this self-improvement step. DGM maintains an archive of agents and selects parents from it, rather than always extending the current highest-scoring version.

There is a material source conflict in the schedule: the reading is labeled “Automated design of agentic systems,” but links to DGM. The [ADAS paper with that title](https://arxiv.org/abs/2408.08435) is a different work: a meta agent generates agent programs, evaluates them, and stores them in an archive. This guide follows the actual DGM link. The two papers must not be treated as one experiment.

## Why keep more than the champion?

Keeping only the highest score assumes that every useful next step first improves the current metric. A new tool might initially add overhead or solve a neglected task class before combining with another change. An archive preserves these branches. Diversity does not remove evaluation: candidates must still execute and face tests, with failures recorded so that new capabilities can be distinguished from renamed old workflows.

This is also not a mathematical proof that every modification improves the system. DGM uses empirical assessment where a general improvement proof is difficult to obtain. Reliability outside the evaluated distribution requires separate evidence.

## A complete search example

This is an original teaching example, not a reported result. You have ten validation tasks and ten independent held-out tasks. Agent A solves six validation tasks and can read and edit files. B adds a tool that classifies failed tests but solves only five. C increases retries and solves seven.

A winner-only search continues from C. An archive retaining A, B, and C can instead branch from B to produce D: classify the failure, then retry only the relevant error category. Suppose D solves eight validation tasks and seven held-out tasks that were never used to select versions. That provides preliminary support for this branch. The reasoning is not “B is useful because it scored worse.” B offers a different, composable mechanism, and D's later results support that hypothesis.

If C's seven successes came from hard-coding repeatedly observed answers, the held-out tasks can expose it. Use validation tasks for search and untouched tests for final assessment. Combining the two confuses memorizing evaluation tasks with improvement.

## Where the other papers put the loop

[The AI Scientist](https://arxiv.org/abs/2408.06292) connects ideation, experiments, writing, and model-generated review, then uses previous ideas to generate new research. Its output is a research candidate and report. Producing a complete-looking paper does not establish reproducibility or a valid conclusion.

[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) uses language models to propose program variants, automated evaluators to check and score them, and an evolutionary database to retain useful programs. It particularly suits problems with measurable correctness and performance. All three use generation, execution-based assessment, retention, and regeneration, but search over different objects: an agent, a research project, or an algorithmic program. Those are not interchangeable claims about a model becoming smarter.

## Variation check and answer

D now solves nine validation tasks but only four held-out tasks. B solves five in each set. Can you announce that D has improved generally? **No.** The gap raises an overfitting concern. Check leakage, task distributions, and sample size, then test on fresh held-out tasks. This result also does not prove that archives are useless: the unsupported claim concerns this candidate's generalization.

A common mistake is reading “open-ended” as “without stopping conditions.” Tonight, archive your agent versions with code differences, validation performance, tool costs, and failure categories. Set a search budget and keep a task set that never feeds back into search. You can then distinguish exploring a new path from repeatedly tuning one score.

## English reading and expression

These are original practice sentences, without audio shadowing: *We improve the agent's workflow, not the base model's weights.* *An archive preserves alternative paths for future search.* Use them to explain why B need not be deleted immediately.


## References

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [Darwin Gödel Machine, linked from the schedule](https://arxiv.org/abs/2505.22954)
- [ADAS, a distinct paper matching the schedule label](https://arxiv.org/abs/2408.08435)
- [The AI Scientist](https://arxiv.org/abs/2408.06292)
- [AlphaEvolve official explanation](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
