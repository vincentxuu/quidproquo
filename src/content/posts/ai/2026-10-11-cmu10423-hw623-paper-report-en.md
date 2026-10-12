---
title: "Paper Reports: Turn a Model Summary into a Testable Argument | CMU 10-423 Assignment 623"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 33
description: "Separate paper claims, empirical support, and your own interpretation through a role-based report and a controlled-comparison example."
tldr: "Separate paper claims, empirical support, and your own interpretation through a role-based report and a controlled-comparison example."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-hw623-paper-report)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

“This paper proposes a better model” is a summary, not yet an argument. Better on which task, against which baseline, with what data and compute? The [HW623 handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) asks for a role-based paper presentation. This guide teaches you to separate the paper's claims, its empirical support, and your own interpretation.

HW623 applies to students in 10-623 and 10-723. External readers can practice the method without receiving course credit. We use [DPO](https://arxiv.org/abs/2305.18290), a paper on the official list, as a reading example. The numerical scenario below is invented for teaching and is not a result from that paper.

## Choose the argument you will own

The handout offers six roles. A reviewer tests whether evidence supports claims. An archaeologist traces predecessors and subsequent influence. A researcher proposes a testable follow-up. A practitioner explains an application and its constraints. A detective studies an author's research trajectory. An impact assessor examines overlooked benefits and harms. Every role still requires a summary and accurate attribution.

A practitioner cannot infer that DPO suits every product merely because its training pipeline is simpler. Preference pairs, a reference policy, and access to trainable models remain relevant conditions. A reviewer needs more than a high score: fair comparisons and the scope of the evaluation matter.

## Separate problem, method, and evidence

For DPO, the problem is preference-based adaptation without the full reward-model-plus-RL training pipeline. The method uses preferred and rejected responses' log-probability ratios relative to a reference policy to define a directly optimized preference loss. Evidence concerns the tasks, datasets, and controlled comparisons the paper actually reports.

The first two statements can be checked against equations and data flow. The third requires experimental tables. A derivation does not automatically establish product performance, and one benchmark does not prove satisfaction for all users. The [DPO teaching guide](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en) handles the mechanism; your presentation should select only the details needed for its argument.

## A complete evidence example

Imagine a customer-support experiment with 100 fixed test prompts. Method A beats a baseline on 62% of prompts, while method B wins on 58%. Judges see one sample per prompt, and the systems were trained on different data.

You can report the observed rates under this particular test and judging procedure. You cannot conclude that A's method is intrinsically better. Training data may explain the difference, and paired outcomes and uncertainty have not been supplied. A useful follow-up fixes training data, base model, judging procedure, and sampling settings, then changes only the method and retains prompt-level results.

Keep four columns in your notes: claim, evidence location, applicable conditions, and missing evidence. Cite the table for a reported number. Label your proposed control experiment as your recommendation, not as work already performed by the authors.

## Check: is a larger improvement enough?

Suppose A now wins on 70% of the same test set, but the baseline still uses older training data. Does that remove the concern? What should a reviewer request first?

<details>
<summary>Answer and criterion</summary>

No. A larger gap can still reflect data or other simultaneous changes. Request a controlled comparison with the same data and model setup, then examine uncertainty, paired outcomes, and failure cases. A large difference does not eliminate confounding. This is a teaching scenario, not a criticism of the DPO paper.

</details>

## Build a presentation that survives questions

Give each slide one job: problem, one mechanism diagram, key evidence, limitations, role-specific analysis, or next experiment. Link every number to a source table; expose inputs and calculations for your own numbers. Rehearse and ask, after each conclusion, which piece of evidence supports it. Narrow claims you cannot defend.

The assignment requires slides and a recording. Its overview says 5–10 minutes, while recording instructions say 7–10 minutes with a penalty above 11. Enrolled students should check current course announcements. The handout allows AI for understanding, but requires submitted materials to be created without AI assistance. This guide is instructional material, not a ready-to-submit report.

Consult the [official handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) for selection and submission rules. Continue to the [project guide](/posts/ai/2026-10-11-cmu10423-final-project-en) to produce evidence of your own.

## Course Video Sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## References

- [HW623 handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
- [DPO paper](https://arxiv.org/abs/2305.18290)
- [Role-playing paper-reading seminars](https://colinraffel.com/blog/role-playing-seminar.html)
