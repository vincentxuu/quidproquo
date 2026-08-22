---
title: "Harvard AI/ML Course Guide: Do CS50 AI, CS181, and CS182 Videos Match Their Assignments?"
date: 2026-08-22
category: learning
tags: [harvard, ai-course, machine-learning, learning-path, open-course]
lang: en
series:
  name: "Global AI and CS Course Maps"
  order: 5
type: guide
tldr: "CS50 AI is Harvard's most complete public entry point, but the Summer 2026 course still uses 2020 recordings and assignment assets while the rolling OCW projects have moved to other editions. CS181 Spring 2026 exposes current homework and notes without current recordings; CS182 Fall 2026 has not yet completed an offering."
description: "An access and version audit of Harvard CS50 AI, CS1810, CS1820, and follow-on reinforcement-learning and vision courses."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-harvard-ai-ml-course-map)

Search for a public Harvard AI course and **CS50’s Introduction to Artificial Intelligence with Python** appears first. Seven weeks of video, lecture notes, Python projects, and `check50` make it look like a single, current course. The year printed on the course shell, however, is not necessarily the recording year or the assignment edition.

CSCI S-80 Summer 2026 was a formal Harvard Summer School offering, but that does not mean its underlying assets were recorded in 2026. Lecture 0 still points to Spring 2020 recordings, slides, and transcripts, and the enrolled course's Degrees project downloads a Spring 2020 distribution.

The undated [CS50 AI OpenCourseWare](https://cs50.harvard.edu/ai/) uses a 2023 distribution for the same project and a 2024 `check50` slug. All access judgments below reflect an audit performed on **August 22, 2026**.

This guide therefore separates **the offering, lecture assets, assignment assets, and feedback system** before reconstructing Harvard's internal AI/ML route.

## Harvard's formal foundation is not CS50 AI

Harvard College calls a major a concentration. The current [CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/) cover programming, formal reasoning, systems, computation and the world, linear algebra, and probability; the honors route also requires an AI-tagged course. A common route is:

```text
CS50/CS32 → CS51/CS61
    + linear algebra + probability + formal reasoning
                         ↓
              CS1810 Machine Learning
              CS1820 Planning and Learning Methods in AI
                         ↓
         CS1840 RL / CS2831 Vision / advanced topics
```

[Harvard CS advising](https://csadvising.seas.harvard.edu/concentration/courses/) lists CS1810 and CS1820 among the core courses guaranteed at least once per year. They are parallel foundations, not consecutive difficulty levels. CS1810 builds machine learning from probability; CS1820 treats search, planning, games, uncertainty, and learning as a broader AI problem. CS50 AI is a useful implementation-first preview, but it does not replace CS1810's mathematics or non-trivial Python expectations.

## Three entry points, three different kinds of course

| Course and edition | Editorial grade | What an anonymous learner gets | Main gap |
|---|---:|---|---|
| **CS50 AI OCW, rolling edition** | **A3** | Seven weeks of video, audio, slides, transcripts, notes, project specs, distributions, and parts of the `check50` workflow | Lecture and project assets span editions; this is not current Harvard College enrollment |
| **CSCI S-80, Summer 2026** | **A3*** | A formal seven-week schedule, 2020 recordings, 2020 project distributions, and public specifications | `*` The material is usable, but Gradescope, sections, quizzes, office hours, and formal feedback require enrollment |
| **CS1810, Spring 2026** | **A3** | Current syllabus, seven homework directories, course notes, and section material | The syllabus says all learning is in person; current complete recordings are not public, while Gradescope and Ed are restricted |
| **CS1820, Fall 2026** | **A1** | Catalog entry, topic scope, instructor, and preview site | The course begins September 2, so a complete video or assignment chain cannot yet be assessed |
| **CS182, Fall 2022 archive** | **A2** | Historical lecture and section notes plus exams | Not the current edition; no complete, consistent video/starter/grader chain |
| **CS1840 RL, Fall 2026** | **A1** | Catalog and detailed topic description | The offering is not complete yet |
| **CS2831 Advanced Computer Vision, Fall 2026** | **A1** | Catalog, instructor, and topic description | The current material set is not yet a complete auditable public course |

The A0–A3 scale comes from the [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en). A0 exposes only a catalog entry, A1 adds a syllabus or complete specification, A2 exposes substantive partial material, and A3 is coherent enough for self-study. These are not Harvard ratings and do not promise credit, instructor feedback, or free compute.

## CS50 AI: complete enough to study, not a wholly new 2026 edition

[CSCI S-80 Summer 2026](https://cs50.harvard.edu/summer/ai/2026/) covers Search, Knowledge, Uncertainty, Optimization, Learning, Neural Networks, and Language, each paired with a quiz, section, and project. At the curriculum level, the lectures and assignments follow the same seven-week sequence.

At the file level, editions diverge. Summer 2026 [Lecture 0](https://cs50.harvard.edu/summer/ai/2026/lectures/0/) links directly into `cdn.cs50.net/ai/2020/spring/`; the enrolled Degrees project also downloads a `2020/spring` distribution. The OCW [Degrees project](https://cs50.harvard.edu/ai/projects/0/degrees/) downloads `2023/x` and runs `check50 ai50/projects/2024/x/degrees`.

The accurate description is: **Summer 2026 is a new formal offering built from classic recordings and a pinned assignment snapshot; OCW is a rolling public edition.** The concepts align closely, but learners should not mix OCW starter files with Summer 2026 Gradescope instructions. Use OCW end to end for independent study; use only the linked files for enrolled CSCI S-80 work.

The quickest version check is to open every project's download URL and `check50` command and record the embedded years. If they differ, treat the assets as conceptually aligned but operationally distinct.

## CS1810: current 2026 homework is public; current lectures are not recordings

The [CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html) defines a rigorous ML foundation: students derive algorithms mathematically and apply them to real data. Expected preparation includes Python beyond CS50, probability, calculus, and linear algebra. The course explicitly presents Homework 0 as a readiness check.

Its access profile is almost the inverse of CS50 AI. The [Spring 2026 homework repository](https://github.com/harvard-ml-courses/cs181-s26-homeworks) exposes HW0 through HW6, and the course site links notes and sections. The syllabus also states that **all learning will be in person**. Gradescope handles submission and grades; Ed carries course discussion; solution feedback belongs to the enrolled workflow.

CS1810 therefore earns A3 because its current notes, sections, textbook, and assignments form a coherent route—not because it has a public current-semester playlist. An independent learner should use the homework as the clock: attempt HW0, repair gaps in probability or linear algebra, then read and solve toward each later assignment. An old playlist should not be relabeled as Spring 2026.

## CS1820: the newest offering is not complete yet

The [Harvard SEAS course listing](https://seas.harvard.edu/computer-science/courses) schedules CS1820 for Fall 2026 with Stephanie Gil. It covers search and planning, optimization and games, uncertainty and learning, plus AI ethics and social applications. That is the current official design, but the first class is still eleven days away on this article's audit date.

The catalog and preview site are not enough to judge a semester's recordings, assignments, starter code, or solutions, so the current course remains A1. Ariel Procaccia's [Fall 2022 archive](https://procaccia.info/courses/CS182-F22/) preserves notes on problem solving, multi-agent systems, uncertainty, machine learning, and ethics. It can fill classical-AI gaps left by CS50 AI, but it is a historical A2 resource, not a substitute labeled Fall 2026.

This is a case where “latest only” prevents study. Use dated historical notes when you want to learn today; reassess Fall 2026 after its materials exist when describing Harvard's current delivery. Do not compress both claims into “CS182 is public.”

## The most stable external route

### 1. Build working intuition with CS50 AI OCW

This fits learners with roughly a year of Python who want a project-driven overview of search, logic, probability, optimization, ML, neural networks, and language. Stay inside the OCW download and `check50` paths instead of crossing into Summer 2026.

### 2. Make the mathematics real with CS1810 Spring 2026

Attempt HW0 first. Repair only the gaps it exposes, then use the six main homeworks as milestones. Without recordings, notes, section problems, and assignments preserve edition consistency better than an unrelated video playlist.

### 3. Add broad AI or a specialist branch

For planning, games, and multi-agent systems, use the dated CS182 Fall 2022 archive until Fall 2026 is complete. Track CS1840 for sequential decision making and CS2831 for vision. Both Fall 2026 offerings are currently announcements, not complete public courses.

Harvard's clearest lesson is that a polished public page still needs an asset-level version audit. CS50 AI shows how lecture and assignment years can diverge; CS1810 shows that a course without public recordings can still be A3; CS1820 shows that the newest catalog entry is not yet a public course. Separating those states produces a route learners can start now and update honestly later.

## References

- [CS50’s Introduction to Artificial Intelligence with Python — OpenCourseWare](https://cs50.harvard.edu/ai/)
- [CSCI S-80 Introduction to Artificial Intelligence with Python — Summer 2026](https://cs50.harvard.edu/summer/ai/2026/)
- [CSCI S-80 Summer 2026 Lectures](https://cs50.harvard.edu/summer/ai/2026/lectures/)
- [CSCI S-80 Summer 2026 Projects](https://cs50.harvard.edu/summer/ai/2026/projects/)
- [CS1810 Spring 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS1810 Spring 2026 homework repository](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [Harvard CS concentration requirements](https://csadvising.seas.harvard.edu/concentration/requirements/)
- [Harvard CS course tags](https://csadvising.seas.harvard.edu/concentration/courses/tags/)
- [Harvard SEAS computer science course listing](https://seas.harvard.edu/computer-science/courses)
- [CS182 Fall 2022 archive](https://procaccia.info/courses/CS182-F22/)
