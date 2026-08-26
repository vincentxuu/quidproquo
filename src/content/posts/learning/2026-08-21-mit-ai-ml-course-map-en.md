---
title: "MIT AI/ML Course Guide: Course 6-4 Is a Real AI Degree, but Its Public Materials Span Three Eras"
date: 2026-08-21
category: learning
tags: [mit, ai-course, machine-learning, learning-path, open-course]
lang: en
series:
  name: "Global AI and CS Course Maps"
  order: 3
type: guide
tldr: "MIT has offered Course 6-4, a formal BS in Artificial Intelligence and Decision Making, since 2022. For an outside learner, however, the current degree requirements, the 2025–2026 course sites, and the best OCW editions rarely line up. A workable route follows 6-4's programming, algorithms, linear algebra, and probability foundation, then selects among 6.S191, 6.3900, 6.4110, 6.7960, vision, and robotics according to what is actually public."
description: "A map of MIT's AI and ML curriculum based on Course 6-4 requirements, 2025–2026 offerings, anonymous access tests, subject-number changes, CSDIY coverage, and A0–A3 public-material ratings."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-mit-ai-ml-course-map)

First, a correction to an error that is easy to inherit from old guides: [**MIT has a formal AI degree.**](https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-4-artificial-intelligence-and-decision-making/) Course 6-4 is the Bachelor of Science in **Artificial Intelligence and Decision Making**, and students have been able to declare it since Fall 2022. It is not merely a few machine-learning electives hidden inside the computer science degree.

That does not mean MIT publishes a seamless online path from a first Python lesson to its latest work on large models. The resources split into three layers that often fail to align:

1. **The current degree requirements** show what MIT believes an AI student must know.
2. **The 2025–2026 course sites** show what was recently taught, but the material may sit behind Canvas, Piazza, Panopto, or Gradescope.
3. **OCW, Open Learning Library, and archived course sites** are often the most usable for self-study, but may use an old subject number or an earlier syllabus.

This guide keeps those layers separate. It does not pretend that an outside learner can “take an MIT degree online.” It builds a path whose links open and whose missing pieces are explicit. The site already has a detailed [guide to MIT 6.S191](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en); this article places that short course inside the larger MIT structure.

## Two numbering systems: Course 6-4 is not subject 6.4

**Course 6-4** identifies a degree program. **6.3900 and 6.4110** identify individual subjects. A second source of confusion is MIT EECS's Fall 2022 renumbering, which replaced most three-digit decimal subject numbers with four-digit ones.

These are the mappings that repeatedly appear in AI and ML reading lists:

| Old number | Current number | Relationship |
|---|---|---|
| 6.0001 | 6.100A | Python introduction |
| 6.042 | 6.1200 | Mathematics for Computer Science |
| 6.006 | 6.1210 | Introduction to Algorithms |
| 6.041 | 6.3700 | Probability |
| 6.036 | 6.3900 | Introduction to Machine Learning |
| 6.034 | 6.4100 | Artificial Intelligence; not offered regularly in the current catalog |
| 6.038 | 6.4110 | Representation, Inference, and Reasoning in AI |
| 6.867 | 6.7900 | Graduate Machine Learning |

Two traps matter. First, the classic OCW **6.034 is not an old edition of 6.4110**. It became 6.4100; 6.4110 descends from 6.038. Second, **6.7960 Deep Learning is not the new number for 6.867**. The latter became 6.7900, and both subjects now exist.

A YouTube title, a CSDIY page, or a decade-old reading list therefore cannot establish a course lineage merely because two subjects sound similar.

## MIT's AI foundation is not “Python, then ML, then deep learning”

The 2025 Course 6-4 requirements begin with six foundation subjects covering programming, software construction, discrete mathematics, algorithms, linear algebra, and probability or inference. There are several approved substitutions; reduced to capabilities, the prerequisite structure looks like this:

```text
Programming: 6.100A + 6.100B, or integrated 6.1000
        ↓
Software and algorithms: 6.1010 + 6.1200 → 6.1210
        ↓
AI mathematics: 18.06/18.C06 linear algebra + 6.3700/6.3800/18.05 probability and inference
        ↓
Core branches: 6.3900 machine learning | 6.4110 representation, inference, and planning
```

This is a route inferred from official prerequisites, not an MIT-issued semester plan. Its point is that 6.3900 is not the beginning. Without basic programming, algorithms, linear algebra, and probability, it is easy to confuse “I can run the notebook” with understanding the model.

Course 6-4 then requires at least one subject from each of five **Centers**:

- **Data-centric:** how data is generated, estimated, and learned from; 6.3900 is a common entry.
- **Model-centric:** how a system represents the world and reasons under uncertainty; 6.4110 is one current route.
- **Decision-centric:** how an agent plans, controls, and acts under uncertainty.
- **Computation-centric:** algorithms, computational resources, and system constraints.
- **Human-centric:** causality, feedback, and risk when AI enters social systems, including subjects such as 6.3950.

One subject cannot fill two required-subject slots. The rule deliberately prevents students from filling all five boxes with courses that merely look like ML. The degree also includes an Application CI-M, an advanced AI+D subject, an EECS or mathematics elective, at least two CI-M subjects overall, and a SERC-qualified subject. **Social responsibility is part of the formal structure, not an appendix added after the models.**

Students who prefer a broader systems and CS foundation before choosing AI as one area of depth can also take that route through Course 6-3, Computer Science and Engineering. MIT does not imply that Course 6-4 is the only legitimate way to study AI.

## What an outside learner can actually access in 2025–2026

The ratings below use the editorial scale defined in the [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): A0 means a catalog entry is visible, A1 adds a syllabus, A2 exposes some substantive material, and A3 is coherent enough to organize into a self-study course. These are not MIT ratings, and A3 does not include credit, instructors, grading, peers, or free compute.

| Subject and edition | Rating | What opens anonymously | What is missing |
|---|---:|---|---|
| **6.S191, Spring 2026** | **A3** | Nine weekly videos and slide decks from March 30 to May 25, three labs, official GitHub repository | MIT feedback, credit, and cloud credits |
| **6.3900, Spring 2026** | **A2** | Some static lecture material remains accessible | Home page and homework archived after the term; video, Shimmer, and Piazza restricted |
| **6.4110, Spring 2026** | **A2** | Info, calendar, slides, several CAT-SOOP assignments, and code stubs | Panopto video in Canvas; no complete public solutions |
| **6.7960, Fall 2025** | **A2** | Schedule, slides, readings, and some PyTorch Colabs | Video and solutions in Canvas; assignments released through Gradescope |
| **6.7960, Fall 2024 OCW** | **A3** | 24 lectures and notes, five assignments, code files, final project | Not the 2025 edition; no class feedback |
| **6.S058 Computer Vision, Spring 2026** | **A3** | Slides, open textbook, four problem sets, Colabs, project requirements | Recordings and class notes in Canvas |
| **6.4210, Fall 2025** | **A2** | Textbook-like notes, readings, complete schedule | Canvas video; Gradescope and Deepnote access for assignments |
| **6.5940, Fall 2026** | **A0** | Catalog and upcoming-course announcement | The class had not started at verification time; a plan is not released material |
| **6.5940, Fall 2024 archive** | **A3** | Lectures, video, and public labs | No formal solutions or class feedback |
| **6.7900, Fall 2025** | **A1** | Syllabus, calendar, topics, and readings | Notes, assignments, and project in Piazza |
| **6.7920, Fall 2025** | **A1** | Schedule, readings, and an isolated slide deck | Most slides, assignments, and solutions in Canvas |
| **6.8610, Spring 2026** | **A1** | Current syllabus and schedule | Slides, Panopto video, assignments, and code in Canvas |

The important lesson is not which subject receives the highest score. It is that **the same course can become less public over time**. The Fall 2026 preview for 6.3900 says most materials will be open, yet the completed Spring 2026 home page and assignments are now staff-only. If a page used to open and no longer does, the old search result may not have been wrong; the archive policy changed.

The reverse also happens: the newest class is only partly public while the previous edition is complete. Fall 2025 6.7960 keeps recordings and solutions in Canvas. MIT OCW's Fall 2024 edition publishes the videos, notes, five assignments, and final project. For self-study, **choosing 2024 OCW is more honest than forcing the 2025 site into a course it cannot provide**. Check the newest edition first, but do not let the year outrank completeness. For how to combine the two editions and which route to take for which goal, this site's [6.7960 deep dive](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) breaks both down edition by edition.

## Three routes that an outside learner can finish

### 1. A modern AI engineering introduction

Build the Python, linear algebra, and probability prerequisites, then use the public 6.3900 notes to establish the language of supervised learning and modeling. From there:

```text
6.3900 public notes
  ├─ 6.S191 Spring 2026: a nine-week introduction to modern deep learning
  └─ 6.7960 Fall 2024 OCW: a semester of advanced deep learning
```

[6.S191 Spring 2026](https://introtodeeplearning.com/) quickly connects convolutional networks, Transformers, generative models, and AI for science. It met weekly from March 30 through May 25; it was not a one-week IAP bootcamp, nor is it the predecessor or equivalent of 6.7960. For a theory-oriented route with 24 lectures and longer assignments, use the 6.7960 OCW edition.

### 2. AI beyond neural networks

Take the 6.4110 route through constraint satisfaction, logic, graphical models, MDPs and POMDPs, and planning. Its public assignments are more useful than its locked recordings, so an outside learner can read the slides and then work through the CAT-SOOP problems.

The classic 6.034 Fall 2010 OCW course still supplies video, assignments, and exams for search, symbolic AI, and traditional methods. It is valuable historical grounding, but it does not represent the 2025–2026 frontier and must not be relabeled as current 6.4110.

### 3. Vision, robotics, and efficient ML systems

The Spring 2026 computer vision offering ran under the special-subject number **6.S058**. It publishes slides, a book, problem sets, Colabs, and project requirements, making it one of the few current branches close to A3. The catalog's 6.4300 is the related regular-subject number, but the two labels should not be silently interchanged.

For embodied AI, follow 6.3900, linear algebra, and probability with 6.4110, then use the public 6.4210 Robotic Manipulation notes. Its Gradescope and Deepnote assignments and Canvas video are unavailable, so an external version of the course needs to center on lecture notes, Drake examples, and a self-defined project.

For efficient ML systems, use 6.5940. It was not offered during the 2025–2026 academic year and returns in Fall 2026; at verification time, that class was still upcoming. To work now, use the Fall 2024 materials on pruning, quantization, neural architecture search, distributed training, and TinyML labs.

## What CSDIY can and cannot confirm

CSDIY is useful evidence that a self-study community has organized a particular edition into a workable route. It is not sufficient evidence that MIT offered the subject this year or that its current site still opens anonymously.

Among the MIT subjects above, CSDIY currently has dedicated pages for only:

- **MIT 6.7960:** linked to MIT OCW Fall 2024, estimated at about 90 hours, and positioned after an ML foundation as advanced broad-coverage deep learning.
- **MIT 6.5940:** organized around the 2023 and 2024 sites and labs as advanced ML systems study.

It does not list 6.S191, 6.3900, 6.4100, or 6.7900. That absence does not mean those subjects do not exist or cannot be studied. Conversely, the presence of a 6.5940 page does not mean MIT offered it in 2025–2026. A reliable check runs in this order:

1. Use the MIT Registrar archive or term site to confirm that the class actually ran.
2. Open the syllabus, slides, video, assignments, and code anonymously instead of stopping at the home page.
3. Use CSDIY to understand how a community sequences an archived edition, estimates its workload, and handles prerequisites.

## If you do one thing today

Do not bookmark ten courses. Spend half an hour on three steps:

1. Open the Course 6-4 requirements and copy its six foundation subjects and five Centers into a checklist.
2. Choose one of the 6.S191, 6.4110, or 6.S058 A3/A2 routes and open the first lab or homework—not merely the first video.
3. Write down the missing prerequisite: Python, algorithms, linear algebra, or probability. Go back and fill that one first.

The most valuable thing to borrow from MIT is not a list of famous subjects. It is the way Course 6-4 divides AI capability into data, models, decisions, computation, and people. Public material lets an outside learner borrow much of that structure. Credit, feedback, peers, gated platforms, and the research environment remain outside the package.

## Changelog

- 2026-08-26: Backfilled an internal link — the [6.7960 deep dive](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) is now live; linked it from the two-edition comparison passage.

- 2026-08-22: Corrected 6.S191 2026 to a nine-week spring course rather than a one-week IAP bootcamp.

## References

- [MIT EECS — Course 6-4: Artificial Intelligence and Decision Making](https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-4-artificial-intelligence-and-decision-making/)
- [MIT EECS — 6-4_2025 Degree Requirements](https://eecsis.mit.edu/degree_requirements.pcgi?program=6-4)
- [MIT Catalog — Course 6-4 Degree Chart](https://catalog.mit.edu/degree-charts/artifical-intelligence-decision-making-course-6-4/)
- [MIT EECS — New Subject Numbering](https://www.eecs.mit.edu/academics/subject-numbering/)
- [MIT EECS — Old and New Subject Number Crosswalk](https://eecsis.mit.edu/numbering.html)
- [MIT 6.S191 — Introduction to Deep Learning 2026](https://introtodeeplearning.com/)
- [MIT 6.3900 — Introduction to Machine Learning, Spring 2026](https://introml.mit.edu/spring26/)
- [MIT 6.4110 — Representation, Inference, and Reasoning in AI, Spring 2026](https://airr.mit.edu/spring26)
- [MIT 6.7960 — Deep Learning, Fall 2025](https://deeplearning6-7960.github.io/)
- [MIT OpenCourseWare — 6.7960 Deep Learning, Fall 2024](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- [MIT 6.S058 — Introduction to Computer Vision, Spring 2026](https://introtocv.github.io/)
- [MIT 6.4210 — Robotic Manipulation, Fall 2025](https://manipulation.mit.edu/Fall2025/index.html)
- [MIT Han Lab — 6.5940 TinyML and Efficient Deep Learning Computing, Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.7900 — Machine Learning, Fall 2025](https://gradml.mit.edu/)
- [MIT 6.7920 — Reinforcement Learning: Foundations and Methods, Fall 2025](https://web.mit.edu/6.7920/www/)
- [MIT 6.8610 — Quantitative Methods for Natural Language Processing, Spring 2026](https://mit-6861.github.io/)
- [CSDIY — MIT 6.7960](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/MIT6-7960/)
- [CSDIY — MIT 6.5940](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F/EML/)
