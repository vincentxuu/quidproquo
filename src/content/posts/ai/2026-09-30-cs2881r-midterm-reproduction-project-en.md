---
title: "CS2881R Midterm: Reproduce and Extend One Headline Figure"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, reproducibility, red-teaming]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 7
tldr: "The CS2881R midterm isn't an exam. Teams of 2–4 pick one of four AI safety papers, redo its central figure or table, add one or two extensions, and hand in a 3–5 page report plus a GitHub repo. The spec slides and rubric are public, so an outside reader can do the whole thing. The rubric puts most points on reproduction and extensions, and reserves one point for reflecting on how fragile the result is. That one point is the research habit the assignment is really training."
description: "A guide to the Harvard CS 2881R AI Safety (Fall 2025) midterm mini-project: the goals and deliverables in the spec slides, the four candidate papers (GCG, Instruction Hierarchy, Spill the Beans, and safety brittleness via pruning and low-rank modifications) and which figure or table each asks you to reproduce, the rubric's point allocation, the head TA's retrospective on the assignment, and the places where the materials disagree."
draft: false
glossary:
  - term: "headline figure"
    definition: "The figure or table in a paper that carries its core claim. The CS2881R midterm asks you to reproduce that, not the whole paper."
    context: "Terminology from the CS2881R mini-project spec slides."
  - term: "Attack Success Rate"
    aliases: ["ASR"]
    definition: "The fraction of a set of harmful requests for which an attack gets the model to produce a response it shouldn't."
    context: "Two of the midterm's candidate papers, GCG and the pruning/low-rank paper, use ASR as their main metric."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project)

> **Version note**: This post is based on the midterm mini-project of [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/), Fall 2025. The main materials are the public [mini-project spec slides](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew), the [grading rubric](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII), and the "Assignment Structure" section of head TA Roy Rinberg's [retrospective](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic). The deadline comes from the Admin slide of Boaz Barak's Lecture 8 deck. All facts were checked against these materials on 2026-09-30. The spec and rubric are fully public, so the assignment itself rates **A3**; what you can't get is the students' submitted reports and grades.

**Series**: previous [L5: Carrying Content Moderation's Old Lessons into Generative AI](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies-en) | next [L8: Scheming, Reward Hacking, and Deception](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en) | [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)

By this point you've seen how models are trained (L2), how they're broken (L3), how their rules are written (L4), and how those rules are enforced (L5). The [CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) midterm asks you to redo one of those results yourself, then ask: how solid is it?

## Course video sources

The official Fall 2025 schedule provides recordings for some lectures. A direct recording link for this article was not confirmed by the official page retrieved in this update; use the schedule to inspect available recordings.

Course and recording entries:

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## What the assignment asks

The first slide of the spec states the goal in one line: practice reproducing and critically examining results in AI safety research. You choose one paper from the options provided (or propose your own) and recreate its "headline figure."

The slides break the task into two parts:

1. **Reproduce the headline result**: recreate the central figure or table, with clear, well-documented, runnable code and setup.
2. **Explore divergences**: run 1–2 variations. These can test robustness (shifting datasets, tweaking hyperparameters, modifying the setup) or apply the method in a new setting. The slides say the goal is "to probe how fragile or generalizable the original finding is."

The TLDR on the last slide is blunt: they don't care about exact reproduction as much as getting at the main idea, and variations and interesting extensions are welcome.

## The spec at a glance

| Item | What the spec slides say |
|---|---|
| Team size | 2–4 students |
| Deliverables | Short report (3–5 pages) + GitHub |
| Report contents | Recreated headline result (figure or table), 1–2 extensions, reflection on robustness/fragility |
| Code | Code + README |
| Public source code | If the paper's code is public, extensions should be non-trivial |
| Simplifications | You may propose variations to make things practical, e.g. scaling down model size or substituting a model series |
| Compute | $200 per project; ask if you need more |
| Deadline | Midnight, Sunday November 2, 2025 (from the Lecture 8 Admin slide) |

The compute budget doesn't match across sources. The spec slides say $200 per project; the head TA's retrospective says reimbursements were "approximately 50$ per group for the mini-projects," and that most students used much less. This post follows the spec slides and flags the discrepancy.

## The four candidate papers

The retrospective says the midterm offered "five papers," but the public spec slides list four. This post follows the slides. The first two also appear on the reading list of [L3 on jailbreaks and prompt injection](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en).

### 1. GCG: one suffix that works across models

[Universal and Transferable Adversarial Attacks on Aligned Language Models](https://arxiv.org/abs/2307.15043). The slides' one-line summary: use the Greedy Coordinate Gradient method to find a single learned suffix (a "universal adversarial prompt") that bypasses alignment on many models, measured by Attack Success Rate.

**Reproduce**: the first three rows of Table 2 (behavior only with no suffix, behavior plus the "Sure, here's" baseline, behavior plus GCG), and also report the white-box success rate on the source model you optimized on.

### 2. Instruction Hierarchy: teaching a model whose instructions outrank whose

[The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions](https://arxiv.org/abs/2404.13208). The slides' summary: show that a model fine-tuned to respect an instruction hierarchy is more robust to attacks than a baseline of the same capability, while keeping over-refusals small.

**Reproduce**: Figure 2.

### 3. Spill the Beans: RAG systems copying retrieved text verbatim

[Follow My Instruction and Spill the Beans: Scalable Data Extraction from Retrieval-Augmented Generation Systems](https://arxiv.org/abs/2402.17840). The slides' summary: a simple instruction-style prompt can make instruction-tuned LMs copy retrieved context verbatim, and the vulnerability grows with model size.

**Reproduce**: Table 1 (7B/13B).

### 4. Safety alignment lives in very few weights

[Assessing the Brittleness of Safety Alignment via Pruning and Low-Rank Modifications](https://arxiv.org/abs/2402.05162). The slides' summary: identify and remove very sparse "safety-critical" regions (about 3% of weights via neuron pruning, or about 2.5% of ranks via low-rank updates) and drive up attack success rate.

**Reproduce**: Figure 2.

What the four share is that each asks how solid a safety mechanism is. The first two are an attack and a defense, the third moves the attack surface to RAG systems, and the fourth argues from the weights that safe behavior may be a thin layer.

## How the rubric allocates points

The rubric has two blocks, Writeup and Code.

**Writeup (header says /10)**

| Item | Points | What earns full marks |
|---|---|---|
| Reproduction of Results | 5 | Successfully reproduced the headline result, **or** gave a convincing, well-reasoned explanation of methodological differences leading to divergent results |
| Extensions | 5 | One or two meaningful, thoughtful extensions with clear discussion of findings |
| Reflection on Robustness / Fragility | 1 | Credible discussion of fragility, assumptions, or reliability of findings |
| Communication & Clarity | 1 | Clear, readable writeup with understandable figures |

**Code (/5)**

| Item | Points | What earns full marks |
|---|---|---|
| README & Documentation | 1 | README with basic instructions (environment, setup, usage) |
| Code Quality & Use of Public Source | 4 | Well-structured, readable code with clear additions showing understanding of the method and extensions; if public code is used, commit history should show genuine engagement |

In the public document, the four Writeup sub-items add up to 12, while the header says /10. The document doesn't explain this, so this post reports it as written.

Three details stand out:

- **A failed reproduction can still earn full marks**, as long as you explain why it failed. That's very different from homework where only the right answer scores.
- **The 3-point description for extensions** reads "trivial, expected, or insufficiently discussed (especially when public code exists)." For a paper with a ready-made repo, running it once and submitting won't get you far.
- **Reflecting on fragility is worth only 1 point**, but it's the only item that directly grades research judgment.

## How the TA saw it

In his post-course retrospective, head TA Roy Rinberg describes the midterm as recreating one of five suggested papers with a small open-ended twist, such as seeing how different forms of prompting affect a result, or whether it holds up on a different model or dataset.

Two of his comments on the design are worth passing along:

- Grading should target things that are hard to do and easy to verify. Recreating a headline figure is easy to verify while still forcing real engagement with the material, and requiring a "meaningful spin-off" pushes students beyond running Claude Code on an existing codebase. He adds that AI tools may make this too easy in the future, but it worked for this iteration.
- The mini-project helped students find groups they wanted to work with, without being too binding.

In his recommendations, he also admits that as a first-time course, the rubrics weren't always ready when assignments went out. Student feedback likewise asked for earlier and clearer communication about project options, grading criteria, and deadlines.

Another passage puts the assignment in a larger frame: many AI safety papers have the flavor of "we tried a thing and it worked," and one role for academia is to pick them up and check how robust they really are: when they break, and what the papers don't say.

## How to do it yourself

1. **Pick a paper.** If you have GPUs, consider GCG or the pruning/low-rank paper. If you only have API credits, the 7B/13B setting of Spill the Beans or the evaluation side of Instruction Hierarchy is more feasible. The slides allow smaller models or a different model series.
2. **Understand the figure first.** Write one sentence for every axis and row, and make sure you know how each number is computed.
3. **Do a minimal reproduction, then extend.** Choose an extension that could make the original conclusion fail, such as a newer model, a different prompt template, or a different data distribution.
4. **Leave a section on fragility in the report**, even if it's just a list of settings where your reproduction differs from the paper.

One thing you can do tonight: open the paper you picked, look only at the headline figure, and write on a sheet of paper what you'd need to redo it: which models, which data, how many inference calls. That list is your compute budget.

## Further reading

- The lecture two of the candidates come from: [CS2881R L3: Jailbreaks, Prompt Injection, and Lessons Borrowed from Software Security](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en)
- Another course's jailbreak project design: [NTU ADL 2025 Lecture 10: Bias, Safety, Hallucination, and Alignment](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)
- Engineering defenses against prompt injection: [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS2881 Mini-project spec slides (Google Slides)](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew) — goals, deliverables, compute, four candidates and the figure or table for each
- [Mini Project Grading rubric (Google Docs)](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII) — points and descriptions for Writeup and Code
- [Roy Rinberg, Reflections on TA-ing Harvard's first AI safety course (LessWrong, 2026-01-15)](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) — Assignment Structure, reimbursement amounts, reflections on grading design, student feedback
- [Boaz Barak, Lecture 8: Scheming slides (Harvard SharePoint)](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/Ec5_PVcJPBJPg-fJa0scnPYB8oDlDLuCM5I92N1Dit6SPQ?e=d6Z21h) — mini-project deadline on the Admin slide
- [Harvard CS 2881R AI Safety, Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/) — GCG and Instruction Hierarchy on the L3 reading list
- [Zou et al., Universal and Transferable Adversarial Attacks on Aligned Language Models (arXiv 2307.15043)](https://arxiv.org/abs/2307.15043)
- [Wallace et al., The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions (arXiv 2404.13208)](https://arxiv.org/abs/2404.13208)
- [Qi et al., Follow My Instruction and Spill the Beans (arXiv 2402.17840)](https://arxiv.org/abs/2402.17840)
- [Wei et al., Assessing the Brittleness of Safety Alignment via Pruning and Low-Rank Modifications (arXiv 2402.05162)](https://arxiv.org/abs/2402.05162)
