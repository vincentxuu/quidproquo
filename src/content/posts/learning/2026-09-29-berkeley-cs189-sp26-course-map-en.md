---
title: "Three Versions of CS189: Spring 2026 as the Base, Spring 2025 as the Classic, Fall 2026 in Progress"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 2
tldr: "Several semesters of Berkeley CS189 are online at once. From here on, this series follows Spring 2026 (Listgarten/Dimakis): its slides, 25 lecture videos, discussions with solutions, HW1–5 handouts and midterm solutions are all publicly accessible, so it rates A3. Spring 2025 (Shewchuk) is a different, classic route and the only one that covers SVMs, decision trees, PCA and boosting. Fall 2025's homework folders open empty to outside readers, so it was not chosen. Fall 2026 is still running and serves only as a comparison."
description: "A version map for Berkeley CS189: why Spring 2026 is the base semester, its syllabus (prerequisites, grading, two-part homework, hidden tests, the Bishop textbook), where each kind of material lives, how outside readers can check their own work, and where to find the topics only Spring 2025 covers."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)

[Berkeley CS189/289A Introduction to Machine Learning](https://eecs189.org/sp26/) is Berkeley's intro machine learning course. The catch is that a search turns up more than one CS189. Shewchuk taught Spring 2025. Norouzi and Gonzalez taught Fall 2025 and are teaching Fall 2026. Listgarten and Dimakis taught Spring 2026. The four semesters differ in lecture order, textbook and homework. The [order 1 overview](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en) in this series was written before the Spring 2026 site came back online. This post takes stock of the versions again and decides which semester the lecture and homework guides will follow.

The short answer: **from this post on, every lecture and homework guide follows [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis).** It is the only version that currently publishes lecture videos, slides and discussions with solutions, plus homework all the way down to the notebooks.

## The four versions side by side

I opened every official page below without logging in on 2026-09-29. The ratings use the A0–A3 scale from this site's [global course map](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en). A0 means only the listing is visible, A1 means the syllabus is visible, A2 means materials are partly open, and A3 means you can self-study the course.

| Version | Instructors | What you can get without logging in | Gaps | Rating |
|---|---|---|---|---|
| [Spring 2026](https://eecs189.org/sp26/) | Listgarten, Dimakis | A 27-lecture schedule; slide PDFs or Notes on Google Drive; a YouTube playlist, linked from the course site, with 25 lecture videos; Discussions 1–12, each with a worksheet, solutions and a walkthrough video; Drive folders for HW1–5 (PDF, LaTeX template, notebooks; HW5 includes solutions) | Gradescope, hidden tests, Ed; HW1–4 solutions; the final exam; a Lecture 1 recording | **A3 (base)** |
| [Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/) | Jonathan Shewchuk | Lecture notes for each lecture, the full [machlearn.pdf](https://people.eecs.berkeley.edu/~jrs/papers/machlearn.pdf), HW1–7 (zip or PDF), past midterms and finals | The official recordings are on bCourses and need a login; only screen-only backup screencasts on Drive are public | A3, but a different route |
| [Fall 2025](https://eecs189.org/fa25/) | Narges Norouzi, Joseph Gonzalez | Schedule, slides, a lecture playlist, discussions | The homework Drive folders open empty; the `BerkeleyML/fa25-student` repo linked from the home page returns 404 | A2 |
| [Fall 2026](https://eecs189.org/fa26/) | Norouzi, Gonzalez | In progress (the home page says Week 6); materials for lectures already given; the `BerkeleyML/fa26-student` repo opens | No public homework links on the home page; the semester isn't over | A1→A2 |

The Spring 2026 [Past Offerings](https://eecs189.org/sp26/past-offerings/) page lists earlier semesters from Spring 2016 to Fall 2025. Most of them are Shewchuk's `~jrs/189sXX` pages.

**One thing to do tonight**: open the [Spring 2026 home page](https://eecs189.org/sp26/), scroll to the schedule, and check that you can see the PDF and Video links on each row.

## Why not Fall 2025

Fall 2025 follows a lecture order close to Spring 2026, and its slides are all there. The practice chain is what breaks. Each homework on the home page links to a Drive materials folder, and those folders open empty for an anonymous visitor. The home page also links `github.com/BerkeleyML/fa25-student` as its Content Repository, and that URL returns 404.

Without the homework, a course is just slides and videos. That is enough to understand the topics. It is not enough to practise them. So Fall 2025 rates A2 and is not the base.

## The Spring 2026 syllabus

Everything in this section comes from the [Spring 2026 Syllabus](https://eecs189.org/sp26/syllabus/).

**Prerequisites**: MATH 53 (multivariable calculus), MATH 54 (linear algebra) and COMPSCI 70 (probability and discrete math), or equivalent. The syllabus names what you should be comfortable with: gradients and the multivariate chain rule, matrix operations, conditional probability and Bayes' rule, and writing and debugging complex Python programs.

**Grading**:

| Item | CS 189 | CS 289A |
|---|---|---|
| Homework | 30% | 20% |
| Midterm | 30% | 25% |
| Final | 40% | 35% |
| Graduate final project | — | 20% |

The midterm was on the evening of March 17 and the final on May 11, both in person.

**Homework comes in two parts.** There are 5 assignments, each spanning three weeks, split into Part 1 Warmup and Part 2 Main Homework. The warmup introduces the tools and concepts, and the main part applies them in more depth. Both parts come out together and share one deadline. Assignments mix mathematical derivations with coding and are submitted on Gradescope.

**The autograder has public and hidden tests.** The syllabus says the public tests are mostly sanity checks, such as confirming you entered a number rather than a word. The hidden tests check correctness and stay invisible while students work. For an outside reader this matters: the sanity checks are all you can run, so you have to verify correctness yourself.

**The late policy appears in two versions.** The syllabus says the lowest homework score is dropped automatically. The Assessment Cadence slide in [Lecture 1](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing) says "No HW drops" and gives 10 slip days instead, at most 4 per assignment. The two official documents disagree, so both are reported here as written. Neither affects self-study.

**AI use**: Lecture 1 allows open use of GenAI but says "No Vibe Coding/Writing": you must understand everything you submit. [Lecture 3](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link) gives a sharper rule. Use AI when you can easily verify the result, such as visualizations or documentation lookup. If you can't verify it, or can't write tests or a design doc for it, don't let AI write it.

**Textbook**: Christopher M. Bishop and Hugh Bishop, *Deep Learning: Foundations and Concepts* (Springer, 2024). The Springer PDF link in the syllabus requires a CalNet login, so outside readers can't use it. The alternative is [bishopbook.com](https://www.bishopbook.com): the official site embeds a free-to-use online version (via issuu) and offers solutions to the exercises for chapters 2 to 10. The schedule lists recommended sections for every lecture, and each post in this series copies them.

The [Resources page](https://eecs189.org/sp26/resources/) adds three free supplementary books: Murphy's [Probabilistic Machine Learning: An Introduction](https://probml.github.io/pml-book/book1.html), Goodfellow et al.'s [Deep Learning](https://www.deeplearningbook.org/) and Prince's [Understanding Deep Learning](https://udlbook.github.io/udlbook/).

## Where each kind of material lives

| Material | Location | Notes |
|---|---|---|
| Slides | The PDF or Notes link on each schedule row (Google Drive) | From Lecture 13 on, some are Notes folders |
| Lecture videos | The [Spring 2026 Lectures playlist](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE) linked from the site | 25 videos; Lecture 1 is PDF only; the Lecture 26 guest lecture has no materials |
| Discussions | The Sections column: PDF + Solutions + Walkthrough each week | 12 of them |
| Homework | Drive folders in the HW column | HW1 coding is in Modal notebooks; HW5 is marked optional |
| Past exams | The [Past Exams folder](https://drive.google.com/drive/folders/1jmkYiwFCEjhFmMTipTh7KMx-l9lbdDuZ) on the Resources page | Midterms include `sp26-midterm.pdf` with solutions; finals go up to sp25 and fa25 |

The Lecture 3 slides say course content also lives in a `BerkeleyML/sp26-student` repo, but that repo returns 404 to anonymous visitors today. The Drive files are unaffected, and this series cites only Drive and course-site links.

**One thing to do tonight**: open the [HW1 Part 1 folder](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C) and check that you can see `hw1.pdf` and `hw1_student.tex`. If you can, you have access to the course's practice chain.

## How outside readers can check their work

You have no Gradescope and no hidden tests. That leaves three layers of feedback:

1. **Discussion solutions**: do each week's worksheet first, then compare with the Solutions, and watch the walkthrough video if you get stuck. This is the richest feedback in the course.
2. **The midterm with solutions**: after the first 16 lectures, give yourself two hours for `sp26-midterm.pdf`, then check it against `sp26-midterm-sol.pdf`. The home page also links a walkthrough playlist for the midterm.
3. **Final exam**: the Spring 2026 final isn't public. Use `sp25-final` or `fa25-final` with their solutions instead. Note that sp25 is Shewchuk's version, so its scope only partly overlaps with Spring 2026.

For homework, HW1–4 have no official solutions, so you'll need to write your own tests. The HW5 folder includes `solutions/hw5-sol.pdf`.

## Topics only Spring 2025 covers

Spring 2026 is a modern "data to LLMs" route. Shewchuk's Spring 2025 takes a different, classic route: perceptrons, SVMs, decision theory, Gaussian discriminant analysis, regression, decision trees, neural networks, PCA, boosting and nearest neighbours. The topics below either don't appear in the Spring 2026 schedule or get only a passing mention. To fill them in, go to the [Spring 2025 site](https://people.eecs.berkeley.edu/~jrs/189s25/):

| Topic | Spring 2025 lecture |
|---|---|
| Hard-margin and soft-margin SVMs | Lec 3–4 |
| Gaussian discriminant analysis (QDA/LDA) | Lec 7, 9 |
| Decision trees, bagging, random forests | Lec 14–15 |
| PCA, SVD, hierarchical clustering | Lec 20–21 |
| AdaBoost, nearest neighbours and the Bayes risk | Lec 24 |
| Faster nearest-neighbour queries, Voronoi diagrams, k-d trees | Lec 25 |

The Spring 2026 syllabus mentions PCA in its course description, but none of the 27 lectures on the schedule is devoted to it. This series follows the schedule.

Spring 2025's lecture notes and the full `machlearn.pdf` can be downloaded without logging in, and HW1–7 are on the site. It is a complete A3 course in its own right, best used as a parallel read alongside Spring 2026 rather than a replacement.

## Fall 2026: what the next semester looks like

[Fall 2026](https://eecs189.org/fa26/) is taught by Norouzi and Gonzalez, and the home page shows Week 6 today. Its schedule also has 27 lectures, in roughly the same order as Spring 2026: KNN/K-Means → density estimation and GMMs → linear regression → logistic regression → gradient descent → neural networks → CNNs → Transformers → LLMs. There are two differences. Lecture 3 is a standalone Dimensionality Reduction lecture, and the back half adds MDPs/RL, post-training and diffusion.

Each post in this series ends with a "Fall 2026 counterpart" line. Once the semester ends, if Fall 2026's homework is fully public too, I'll reconsider which semester to use as the base.

## Where the series goes next

The series follows the official Spring 2026 order, with each homework guide placed after the lectures it covers:

- Next: [Lec 1–3: ML problem framing, data tools, terminology and techniques](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en)
- After that: [Lec 4–7: K-means, probability review, MLE, multivariate Gaussians and GMMs](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en)
- Then, in order: linear regression, HW1, classification and logistic regression, gradient descent, MLE/MAP with a midterm self-check, HW2, neural networks, HW3, CNNs, Transformers, HW4, LLMs and self-supervised learning, the closing lectures, and finally the optional HW5.

## Further reading

- [Berkeley AI/ML course map](/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en): where CS189 sits among Berkeley's courses
- [Stanford CS109 probability guide](/en/posts/learning/2026-08-21-stanford-cs109-probability-en): a route for catching up on probability
- [Stanford CS229 guide](/en/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): another math-heavy intro ML course to compare against

## References

- [CS 189/289A Spring 2026 home page and schedule](https://eecs189.org/sp26/)
- [CS 189/289A Spring 2026 Syllabus](https://eecs189.org/sp26/syllabus/)
- [CS 189/289A Spring 2026 Resources](https://eecs189.org/sp26/resources/)
- [CS 189/289A Spring 2026 Past Offerings](https://eecs189.org/sp26/past-offerings/)
- [CS 189 Spring 2026 Lectures playlist](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [CS 189 past exams folder (Google Drive)](https://drive.google.com/drive/folders/1jmkYiwFCEjhFmMTipTh7KMx-l9lbdDuZ)
- [Spring 2026 Lecture 1 slides](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)
- [Spring 2026 Lecture 3 slides](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link)
- [CS 189 Spring 2025 (Shewchuk) site](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [CS 189 Fall 2025 site](https://eecs189.org/fa25/)
- [CS 189 Fall 2026 site](https://eecs189.org/fa26/)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts official site](https://www.bishopbook.com)
