---
title: "Final Projects: Build a Reproducible Generative-Model Experiment | CMU 10-423 Topic Guide"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 39
description: "Design controlled comparisons, retain paired outcomes, and distinguish replication from working code in a generative-model project."
tldr: "Design controlled comparisons, retain paired outcomes, and distinguish replication from working code in a generative-model project."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-final-project)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

A beautiful generated image does not finish a research project. Others need to know what it improves on, under which data and resource constraints, and whether the result survives a changed condition. The [CMU project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf) emphasizes real data, baselines, controlled comparisons, and staged reports. This guide turns “I built a model” into a question someone else can inspect.

You should have worked through at least one assignment's training and evaluation path, such as [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en). The goal is to specify a controlled comparison, distinguish replication from reimplementation, and interpret failures. The experiment below is an invented teaching scenario, not an official task or measured result.

## Choose a question that can fail

“Build a text-to-image model” is too broad. Ask whether configuration A improves text adherence over B with data, model, and training budget fixed. Define the question, baseline, and success criterion before running experiments. State how you will interpret no improvement, a gain confined to one subgroup, or a gain purchased with extra compute. Otherwise it is tempting to change metrics until the story looks favorable.

## Work through a small experiment

Fix 100 held-out prompts, one checkpoint, and matched seeds. Change only conditioning strength between A and B. Keep the blind judging procedure fixed, and score text adherence separately from visual quality.

Suppose A succeeds on 60 prompts and B on 68. The observed difference is eight percentage points. B is not thereby universally better: quality might decrease, and paired outcomes matter. If 15 of A's successful prompts fail under B, B loses 15 successes while gaining 23. Those transitions expose tradeoffs hidden by the aggregate totals.

Record configuration, data version, seeds, sampling budget, both ratings, paired outcomes, and cost. Mark unrun cells “not measured.” Do not present the scenario's numbers as project results. Retain generated artifacts and settings so another person can inspect the same prompt.

## Replication means a result, not merely working code

The handout requires replication of a prior result unless a justified exception is discussed with course staff in advance and documented throughout the milestones. Reimplementation concerns code; replication concerns outcomes. An error-free run does not reproduce a published number.

Smaller models or data subsets can make the project feasible, but must be documented. Compare published settings with your actual settings. Failure after reducing scale is a result about your constrained experiment, not automatically a refutation of the paper. If multiple factors differ, use ablations or narrow the conclusion.

## Check: can you attribute an improvement?

B improves text adherence, but you also changed to a larger model and cleaner data. Can you attribute the gain to conditioning strength? What is the smallest useful correction?

<details>
<summary>Answer and criterion</summary>

No: model, data, and conditioning changed together. First hold model and data fixed and compare only conditioning. Then, if resources permit, vary model or data separately. Preserve matched prompts, seeds, and sampling budgets. With insufficient resources, describe the observed performance of the entire configuration without attributing it to one mechanism.

</details>

## Make failures and compute part of the argument

A proposal explains the question and plan. An interim report presents the baseline, current evidence, and risks. The final report explains experiments, outcomes, limitations, and research history. The handout also requests a compute thought experiment and a research log. Resource failures can be substantive findings when supported by configurations, measured usage, and alternatives.

Disclose AI assistance in a traceable way: tools, tasks, usage, human contributions, and verification. You must be able to explain data splits, loss, and evaluation code yourself. One passing test does not validate the research conclusion.

Write a one-page protocol tonight: fixed data, baseline, one changed factor, two metrics, artifact storage, and stopping conditions. Consult the [official handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf) for milestone and submission details. This ends the core path. Return to the [overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) for your next experiment; subsequent topic guides review relationships rather than representing extra lectures.

## Course Video Sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## References

- [Project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Official syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
