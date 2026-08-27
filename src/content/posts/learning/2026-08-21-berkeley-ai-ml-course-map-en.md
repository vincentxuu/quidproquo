---
title: "Berkeley AI/ML Course Guide: From CS61A to CS288, What Can You Actually Study Online?"
date: 2026-08-21
category: learning
tags: [berkeley, ai-course, machine-learning, learning-path, open-course]
lang: en
series:
  name: "Global AI and CS Course Maps"
  order: 94
type: guide
tldr: "Berkeley has no standalone undergraduate AI degree. A workable path builds on the CS BA or EECS BS foundation, enters through either CS188's broad AI curriculum or CS189's mathematical machine learning curriculum, then branches into deep learning, NLP, vision, or reinforcement learning. Many 2025–2026 courses are A3, but the newest class, the newest stable URL, and the best self-study edition are not always the same."
description: "A guide to Berkeley's AI and ML curriculum based on official degree requirements, prerequisites, 2025–2026 offerings, anonymous access tests, and public versions of CS188, CS189, CS182, CS285, CS288, and computer vision."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)

First, correct the assumption hidden inside the phrase “Berkeley AI curriculum”: according to [Berkeley EECS's undergraduate-program comparison](https://eecs.berkeley.edu/academics/undergraduate/compare-majors/), **Berkeley does not offer a standalone undergraduate AI degree.** Its relevant undergraduate degrees are the BA in Computer Science and the BS in Electrical Engineering and Computer Sciences. Students build an AI/ML path from upper-division courses on top of a shared programming, theory, and mathematics foundation.

That differs sharply from MIT's Course 6-4. MIT defines a formal degree in Artificial Intelligence and Decision Making. Berkeley offers something closer to a network that students assemble: enter through CS188 for search, reasoning, and planning, or through CS189 for mathematically intensive machine learning, then branch into deep learning, natural language processing, computer vision, or reinforcement learning.

Course numbers and public access both make that network harder to read. CS185 and CS285 are undergraduate and graduate counterparts, as are CS180 and CS280A, but CS C280 is a separate graduate vision course. A site that was public during one semester may later return 404. This guide therefore checks official prerequisites, actual 2025–2026 course sites, and what an anonymous visitor can currently obtain: notes, assignments, code, video, and solutions.

## Build the foundation: 61A, 61B, 70, and mathematics

The lower-division requirements for the CS BA include CS61A, CS61B or 61BL, CS61C, CS70, calculus, and linear algebra. If the goal is to expose the direct prerequisites for the AI/ML courses in this guide, the structure becomes:

```text
Programming: CS61A → CS61B
                     ├─ CS188: broad AI
Discrete math: CS70 ─┘

Calculus + linear algebra + CS70
                     └─ CS189: machine learning
```

CS61C remains an important part of a complete CS degree, but it is not a direct prerequisite for most subjects on this map, so it does not need to appear in every self-study route. Conversely, the CS189 catalog does not list CS61B, but that should not be read as evidence that mathematical knowledge without implementation ability is enough for the assignments. That is practical guidance inferred from the course format, not an extra official prerequisite.

The three foundation courses are unusually open:

- **CS61A Fall 2025** publishes textbook chapters, slides, video, labs, homework, projects, and starter files.
- **CS61B Fall 2025** publishes its calendar, slides, video, discussions, exam preparation, homework, and project specifications. The major gap is a complete public autograder for the current edition; the official GitHub organization identifies Spring 2021 as the latest fully public autograder edition.
- **CS70 Fall 2025** publishes a semester of notes, slides, discussions and solutions, homework and solutions, and past exams.

All three qualify as A3 self-study courses. A3 means that the public material forms a coherent learning sequence; it does not include Berkeley's Ed forums, Gradescope submission, instructors, or formal grading.

## CS188 and CS189 are parallel entrances, not two halves of a sequence

Many reading lists place “CS188 → CS189” on a single line, implying that AI must precede ML. The official prerequisites do not establish that strict order.

**CS188 Introduction to Artificial Intelligence** requires CS61A, CS61B, and CS70. It surveys search, adversarial search, constraint satisfaction, MDPs, reinforcement learning, probabilistic inference, and some machine learning. Its central question is how an intelligent system represents a problem, reasons, and acts.

**CS189 Introduction to Machine Learning** formally expects multivariable calculus, linear algebra, and CS70 or instructor consent. It concentrates on statistical learning, optimization, classification, dimensionality reduction, and modern models. Its central question is how a model learns from data.

Choose the entrance by the capability you want first:

| Goal | Entrance | Best public edition |
|---|---|---|
| Search, planning, reasoning, uncertainty, and the broad agent picture | CS188 | Spring 2026 |
| Mathematical ML and the foundation for advanced deep learning | CS189 | Spring 2025 |

CS188 Spring 2026 is one of the most complete current courses in this audit. Slides, online notes, videos, discussion solutions, and all six projects from P0 through P5 open anonymously, and the projects include a local autograder. Gradescope homework, Ed, and human feedback remain restricted, but the public sequence is coherent enough for an A3 rating.

CS189 demonstrates why “latest” cannot mean “largest year number.” Berkeley did offer it in Fall 2025 and Spring 2026, but the old rotating-site URLs currently return 404. The stable Spring 2025 site still provides complete lecture notes, video, HW1–7, code, data, and past exams. This guide therefore treats Spring 2025 as the **latest complete edition that remains usable for self-study**. A result that once appeared in search is not proof that it still opens today.

## Decode the paired numbers before choosing a course

Several recent Berkeley AI subjects pair undergraduate and graduate students around a shared topic and site, with different numbers or requirements distinguishing the levels.

| Topic | Undergraduate/graduate numbers | 2025–2026 status | Common mistake |
|---|---|---|---|
| Deep Learning | CS C182/CS282A | Fall 2025 | C182 was formerly CS182; cross-list metadata is not fully synchronized |
| Deep Reinforcement Learning | CS185/CS285 | Spring 2026 together | 185 did not replace 285 |
| Natural Language Processing | EECS183/EECS283A | Fall 2025 on one site | CS288 is advanced NLP, not a sequel to CS188 |
| Intro Computer Vision and Computational Photography | CS180/CS280A | Fall 2025 on one site | CS280A is not CS C280 |
| Computer Vision | CS C280 | Spring 2026 | A separate advanced graduate subject |

The number 280 is the main trap. **CS180/280A** is an introductory course that moves from imaging and filters through feature matching to neural radiance fields. **CS C280** is a separate graduate Computer Vision course. When a requirement page or an old guide says only “CS280,” return to the official course entry and semester site instead of guessing the missing letter.

CS288 should not be placed immediately after CS188 either. Its Spring 2026 preparation guidance expects machine-learning experience and PyTorch, and recommends previous NLP exposure. A defensible route takes CS189 first, uses EECS183/283A or another NLP introduction for language-model foundations, and then enters CS288.

## Public-material audit for 2025–2026

The table uses the editorial scale from the [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): A0 exposes only a catalog entry, A1 adds a syllabus, A2 includes some substantive materials, and A3 provides enough structure for a coherent self-study course. These are not Berkeley ratings, and they do not promise credit, feedback, or free compute.

| Course and edition | Rating | What opens anonymously | Main gap |
|---|---:|---|---|
| **CS61A, Fall 2025** | **A3** | Chapters, slides, video, labs, homework, projects, starter files | Ed, submission, grading |
| **CS61B, Fall 2025** | **A3** | Slides, video, discussions, exams, homework, project specs | Complete current autograder |
| **CS70, Fall 2025** | **A3** | Notes, slides, discussion/homework solutions, past exams | Ed, Gradescope |
| **CS188, Spring 2026** | **A3** | Slides, notes, video, discussions, P0–P5, local autograder | Gradescope homework, Ed, human feedback |
| **CS189, Spring 2025** | **A3** | Notes, video, HW1–7, code/data, past exams | Not the newest class; no course grading |
| **CS C182/282A, Fall 2025** | **A2** | Syllabus, schedule, multiple assignment PDFs and code links | Current video requires Berkeley access; incomplete lecture resources |
| **CS180/280A, Fall 2025** | **A3** | Slides, readings, discussions and solutions, five programming projects | Deliberately no recordings; no project solutions or grading |
| **EECS183/283A, Fall 2025** | **A2** | Full topic schedule and most slides | Assignments, starter code, solutions, video |
| **CS185/285, Spring 2026** | **A3** | 25 lecture decks, nine discussion decks, five homeworks, starter code, final projects | Current recordings and student compute |
| **CS288, Spring 2026** | **A3** | 17+ slide decks, three assignments, starter repositories, final-project docs | Current recordings, hidden tests, solutions |
| **CS C280, Spring 2026** | **A3** | 24 slide decks, HW0–3, project | No video; Ed, Gradescope, CMT |

This table also answers whether a course can be public without public video. **Recordings are not the only criterion; the relevant question is whether the material forms a complete practice loop.** CS180 has no recordings, but it publishes a semester of slides and readings, thirteen discussion worksheets with solutions, and five complete programming projects. CS C280 likewise publishes lectures, four homeworks, and a project. Both remain A3, although the experience resembles a textbook-and-assignments course rather than a video playlist.

In the other direction, CS C182 exposes assignment materials but withholds current recordings and lacks a complete set of lecture resources, so it receives a conservative A2. A2 does not mean unusable. It means an outside learner must supply missing explanations rather than treating the site as an end-to-end course.

## Three routes an outside learner can actually follow

### 1. Broad AI and agent foundations

```text
CS61A → CS61B
       + CS70
          ↓
      CS188 Spring 2026
```

Take this path if AI currently means little more than neural networks to you. Do not stop at the videos: begin with Project 1 Search, then continue through Multi-Agent Search, Reinforcement Learning, and Bayes Nets. The sequence reconnects “agent” with state, search, utility, uncertainty, and decision-making instead of merely calling a model API.

### 2. ML, deep learning, and NLP

```text
Calculus + linear algebra + CS70
                ↓
          CS189 Spring 2025
             ├─ CS C182/282A: deep learning, with a less complete public site
             └─ EECS183/283A → CS288 Spring 2026: NLP
```

CS189 is the spine of this route. For current NLP, Spring 2026 CS288 publishes three assignments, starter repositories, and final-project documentation, enough for a complete self-study course. Its assignments include hidden tests, and the course forbids distributing solutions. A3 means there is enough to practice, not that someone will validate every result.

### 3. Vision, RL, and embodied AI

```text
CS189
  ├─ CS C182 + CS180/280A Fall 2025 → CS C280 Spring 2026
  └─ CS185/285 Spring 2026
```

CS180/280A is a strong project-first introduction to vision; its five projects are more valuable than a passive recording archive would be. The [official CS C280 site](https://cs280-berkeley.github.io/) expects command of CS189, CS C182, and CS180/280A material. That is recommended background, not a claim that registration enforces three formal prerequisites. For control, robotics, or embodied AI, the five CS185/285 homeworks and public starter code form another A3 route.

Enrolled CS185/285 students receive course-provided compute support; outside learners do not. That is a real cost, not a footnote. Read the compute requirements for each homework before starting and decide whether to scale down the experiments, rent a GPU, or complete only the lighter components.

## CSDIY helps, but it cannot prove that a course is open now

CSDIY currently has dedicated Berkeley pages for **CS188, CS189, and CS285**. They are useful for identifying the historical edition selected by the self-study community, suggested prerequisites, and past approaches to the assignments.

They cannot independently establish that a current site remains accessible:

- The CS188 page recommends Spring 2024. That edition remains A3, but the official Spring 2026 edition is newer and equally complete.
- The CS189 page points to the rotating course site. Its existence does not prevent the old Fall 2025 and Spring 2026 URLs from becoming unavailable.
- The CS285 page recommends Fall 2022. Berkeley has newer official historical video, while the Spring 2026 slides, assignments, and code are already public.
- CSDIY has no dedicated page for CS C182, CS288, CS180/280A, or CS C280. That does not imply that those courses lack public material.

The reliable order is to confirm the semester in Berkeley's catalog or Class Schedule, anonymously open the syllabus, slides, video, assignments, and repositories, and only then use CSDIY for historical self-study advice. **CSDIY is a route index, not a live access monitor.**

## If you start tonight

Do not bookmark eleven courses. Spend ninety minutes identifying your entrance:

1. For search, planning, and agents, open CS188 Spring 2026 Project 1, read the specification, and pass the first local-autograder case.
2. For ML and LLMs, open CS189 Spring 2025 HW1 and mark every linear-algebra, probability, and coding task you cannot yet do. Do not force yourself to finish the sheet.
3. If both routes fail at Python and data structures, return to CS61B and complete one mini-project instead of collecting more advanced course titles.

Berkeley's reusable lesson is not an official AI checklist. It is a structure with two entrances and several advanced branches. Decide whether you first need to learn how intelligent systems reason or how models learn from data, then select a version by public completeness. That is more useful than sorting course numbers from smallest to largest.

For comparison, the [MIT AI/ML Course Guide](/posts/learning/2026-08-21-mit-ai-ml-course-map-en) starts from a different structure: a formal AI degree defines capability centers, and the outside learner then searches for public editions. Reading the two together makes the difference between a degree curriculum and an executable public route much clearer.

## Changelog

- 2026-08-22: Restored CS C182 to the advanced-vision route based on CS C280's official expected background.

## References

- [UC Berkeley EECS — Undergraduate Programs Comparison](https://eecs.berkeley.edu/academics/undergraduate/compare-majors/)
- [UC Berkeley EECS — CS Lower-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/)
- [UC Berkeley EECS — CS Upper-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-upperdiv/)
- [UC Berkeley EECS — EECS Upper-Division Requirements](https://eecs.berkeley.edu/resources/undergrads/eecs-2/degree-reqs-upperdiv-2/)
- [CS61A — Fall 2025](https://www-inst.eecs.berkeley.edu/~cs61a/fa25/)
- [CS61B — Fall 2025](https://fa25.datastructur.es/)
- [CS70 — Fall 2025](https://fa25.eecs70.org/)
- [CS188 — Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS189 — Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [CS C182/282A — Fall 2025](https://berkeley-cs182.github.io/fa25/)
- [CS180/280A — Fall 2025](https://cal-cs180.github.io/fa25/)
- [EECS183/283A — Fall 2025](https://cal-nlp-class.github.io/fa25/)
- [CS185/285 — Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS288 — Spring 2026](https://cal-cs288.github.io/sp26/)
- [CS C280 — Spring 2026](https://cs280-berkeley.github.io/)
- [CSDIY — Berkeley CS188](https://csdiy.wiki/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/CS188/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)
- [CSDIY — Berkeley CS285](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/)
