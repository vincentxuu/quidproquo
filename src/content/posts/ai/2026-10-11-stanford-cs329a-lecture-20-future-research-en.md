---
title: "Future Research: Turn Improvement Bottlenecks into Testable Hypotheses | Stanford CS329A Lecture 20"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 17
description: "Design falsifiable agent experiments from the final lecture’s discussion of diversity, verification, data selection, and efficiency."
tldr: "Diversity, verification, task selection, and efficiency are distinct bottlenecks; experiments need holdouts and falsifiable hypotheses."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-stanford-cs329a-lecture-20-future-research)

**Video status: Videos included.** Lecture text is available; caption type, listening checks, and the shadowing player still require verification.

“Generate more data and repeat” sounds like a self-improvement plan, but it is difficult to falsify. [Stanford CS329A](https://cs329a.stanford.edu/), Autumn 2025 Lecture 20, separates unresolved bottlenecks: diversity, verification, task selection, and the computational cost of improvement.

The official schedule assigns no readings to this session. This guide uses the text transcript of [Stanford Online's official Part 9 video](https://www.youtube.com/watch?v=AyO6wyu4DEg). It organizes the lecture's research directions without presenting outside papers as assigned readings or claiming those problems are solved. Readers should understand generation, verification, and feedback loops.

For prerequisite context, first read [long-horizon evaluation](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation-en).

## Three bottlenecks require different evidence

Diversity comes first. More paraphrases of one rationale need not yield new solutions. Examine reasoning strategies and task variants, not just vocabulary or response length.

Second is verification. The lecture discusses meta-verification: another model examines a verifier's analysis. An additional model does not create ground truth; both layers can share mistakes. Ask whether the extra check catches systematic failures missed by the first.

Third is task selection. Human-curated prompts can constrain improvement. Model-proposed tasks broaden exploration but may repeatedly select problems the model already solves. Measure learning progress and preserve evaluation tasks outside the training loop.

## Worked example: an experiment that can disprove itself

This is an original research example, not a lecture experiment. The task is reasoning about boundary conditions in short programs. Hold out twenty evaluation questions from task selection and updates; the initial model solves ten. Group A generates forty training questions with one generator. Group B uses varied prompts to generate forty covering null values, negative numbers, and duplicates. Both receive equal update steps and training budgets.

After updating, A solves twelve questions and B fourteen: gains of two and four, with B exceeding A by two. This supports a tentative claim about this diversified-data intervention, not “multiple agents are always smarter.” Prompts, difficulty, and generation costs can differ, and one small evaluation run is unstable.

Next, use the same verifier for both groups and record task type, difficulty, duplicates, and verification failures. Repeat with several random seeds and evaluate unseen variants. If B's advantage disappears, revise the hypothesis rather than report only the best run.

## Test the verifier's mistakes

Create a checking set with ten deliberately incorrect solutions. The first verifier catches six. A second layer catches two of the four remaining errors, for eight detected overall. But if it also rejects two of five correct solutions, report that too.

Track both missed errors and false rejections. Reporting only two extra detections hides the loss of useful data. Check the second layer against known answers or executable tests instead of treating model agreement as correctness.

## Efficiency and memory change the objective

The final lecture also discusses intelligence per watt and local–cloud inference. If improvement requires more samples and judges, report costs and operating conditions alongside accuracy. First establish whether outputs meet task requirements, then compare the cost of meeting them.

The Q&A distinguishes memory updates from weight updates. A database can supply new facts without guaranteeing a new reasoning skill. Conversely, changing information does not always require weight training. If the failure is forgetting a current specification, test retrieval and memory. If the specification is visible but the model cannot handle a new task type, investigate skill learning. Select interventions from failure causes rather than proclaim one method universally superior.

## Exercises and answers

B still solves fourteen questions but spends three times A's generation budget. Is it more efficient? Not established. It may be more accurate; compare cost per successful task and deployment requirements separately.

What if the twenty evaluation questions guide the next training batch and then measure improvement? They have influenced development and no longer provide independent generalization evidence. Use a fresh holdout.

## Reduce the research plan to one page

Record the observed failure, suspected bottleneck, one intervention, fixed comparison baseline, held-out tests, and a condition that would disprove the hypothesis. Specify how to measure accuracy, missed errors, false rejections, and cost. An improvement loop becomes research when its results can tell you that your idea failed.

## English practice: audio shadowing pending

The official video's text transcript is available, but caption type, segment timestamps, listening checks, and replay behavior remain unverified. Three audio-shadowing segments are pending. The experiments and explanations above are original teaching reconstructions, not attributed lecturer quotations.

## Lecture video source

[Stanford Online — Part 9](https://www.youtube.com/watch?v=AyO6wyu4DEg)

```youtube
url: https://www.youtube.com/watch?v=AyO6wyu4DEg
title: Stanford CS329A — Lecture 20
captions: en
```

## References

- [Stanford CS329A — Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [Official lecture video: Future Research Areas](https://www.youtube.com/watch?v=AyO6wyu4DEg)
- [Stanford Online — official lecture video](https://www.youtube.com/watch?v=AyO6wyu4DEg)
