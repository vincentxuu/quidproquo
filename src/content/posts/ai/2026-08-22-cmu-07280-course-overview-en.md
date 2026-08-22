---
title: "Reading CMU 07-280: Why Search, GPT-2, and AlphaZero Belong in One Course"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, search, reinforcement-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 0
type: deep-dive
tldr: "07-280 is CMU's new Spring 2026 AI+ML core: 24 lectures and 12 main assignments move from heuristic search and CSPs to AlexNet, GPT-2, and AlphaZero. Its public material supports self-study, but complete recordings, Canvas checkpoints, Gradescope, and staff feedback remain unavailable."
description: "An overview of CMU 07-280 Spring 2026: its curriculum redesign, 24-lecture structure, assignments, public access, version hazards, and the plan for a complete reading series."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-course-overview)

CMU first offered **07-280 Artificial Intelligence and Machine Learning I** in Spring 2026, replacing the old pairing of 15-281 Artificial Intelligence and 10-315 Machine Learning for SCS. Its striking feature is not the course number. The semester begins with heuristic search, adversarial search, and constraint satisfaction, then asks students to build AlexNet, GPT-2, and AlphaZero.

This is not a list that places “classic AI” beside fashionable models. The course's spine is: **learn to define states, objectives, models, and computational costs, then progressively add components that learn from data and interaction.** Search, supervised learning, language modeling, and reinforcement learning are different answers to how a system selects its next move.

This series uses the **first completed Spring 2026 offering** as its canonical edition. The official home page has switched to Fall 2026, moving Spring links into HTML comments. Most `S26` slides, notes, recitations, written homework, and notebooks remain anonymously accessible through direct URLs, although a few old direct links now fail. The surviving material is sufficient to reconstruct the complete course spine, but there is no public lecture-by-lecture video archive. The series will not invent spoken explanations or classroom discussion.

## What the redesign changed

The [official 07-280 FAQ](https://www.cs.cmu.edu/~07280/) is explicit: 15-281 and 10-315 are being retired in favor of the 07-280 → 07-380 sequence. The first course must serve BSAI students and other SCS students who may take only one technical AI course; the second adds advanced topics and research methods.

07-280 is not a renamed 10-301. Both satisfy many introductory ML prerequisites, but 07-280 adds heuristic and adversarial search, CSPs, GPU basics, and Monte Carlo tree search. 10-301 instead retains more KNN, perceptrons, PAC learning, PCA, clustering, ensembles, recommender systems, and MAP. Choose 07-280 for a broad AI core; choose 10-301 for a concentrated statistical-ML route.

The prerequisites reflect that ambition: 15-122 programming, discrete mathematics/concepts, linear algebra, plus calculus and probability requirements. Search analysis needs discrete structures; ML derivations need calculus, linear algebra, and probability; the larger assignments require fluency with substantial Python notebooks.

## Four capability upgrades across 24 lectures

The [Spring 2026 schedule](https://www.cs.cmu.edu/~07280/) contains 24 lectures that form four stages:

```text
Problems and search
  Introduction → Heuristic Search → Adversarial Search → CSP
                              ↓
Learning functions from data
  Formulation → Trees → Linear/Logistic Regression → Optimization
  → Regularization → Neural Nets → Backprop → Vision/Transfer
                              ↓
Probability and language representations
  MLE → N-grams → Embeddings → Attention/Transformers
                              ↓
Sequential decisions
  MDP → RL → Deep RL → MCTS
```

The first stage asks learners to encode a world as states, actions, constraints, utilities, and heuristics. The second replaces hand-designed rules with functions estimated from data. The third handles sequences, representations, and conditional probability so a model can predict tokens. The final stage lets an agent choose actions under feedback and long-term return, then reconnects planning and learning through MCTS and policy/value networks.

GPT-2 and AlphaZero are therefore not isolated showcases. GPT-2 joins feature learning, tokenization, position, attention, and autoregressive likelihood. AlphaZero reconnects adversarial search, MDPs, reinforcement learning, MCTS, and neural networks. The large assignments test whether students can integrate the previous lectures instead of merely calling an API.

## The assignment sequence is the course's real clock

Spring 2026 lists HW0 through HW12. HW0 is an online-only initial check, leaving twelve main assignment numbers. Assignments mix online, written, and programming work: the early sequence tests search and derivation, the middle enters ML notebooks, and the final stage culminates in three landmark systems.

| Stage | Representative deliverable | External access |
|---|---|---|
| Search and CSP | HW1 written/programming, HW2 search and games | Handouts, LaTeX starters, and parts of the programming tree are public; online components and submission are restricted |
| ML foundations | Regression, regularization, and neural-network writing/notebooks | Many PDFs, ZIP files, and notebooks are public; formal grader feedback is not |
| Deep learning | HW8 Building AlexNet | The notebook is public; course compute and grading are not implied |
| Language models | HW11 Building GPT2 | Written work, GPT notebook, and RL programming are visible; Canvas and Gradescope remain restricted |
| Planning plus learning | HW12 Building AlphaZero | The notebook is visible; official tests and staff feedback are not public |

This is why the series will not turn slides into 24 summaries. Each lecture article also reads the associated pre-reading, recitation, worksheet solution, and homework, connecting “what was taught” to “what students had to produce.” Three stage reviews then use AlexNet, GPT-2, and AlphaZero to test integration across lectures, followed by an independent-study completion roadmap.

## Access: A3, not remote enrollment

Using the criteria from the [CMU AI/ML Course Guide](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en), Spring 2026 qualifies as A3:

- The official material reconstructs the topic chain across all 24 lectures. Most slides or inked slides and many staff notes are public, although a few late-semester direct links now fail.
- Fourteen recitations expose worksheets, many with solutions.
- Written homework, LaTeX starters, selected notebooks, and programming trees can be downloaded directly.
- The [Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf) provide a detailed capability checklist.

A3 does not recreate the enrolled course. There is no complete public lecture recording or transcript set. Pre-reading checkpoints live in Canvas; online homework and submission use Gradescope. Piazza, office hours, in-class polls, exam grading, and staff feedback are also outside the anonymous route. Some optional readings require CMU Library access.

Independent learners must build their own feedback loop: solve a worksheet before opening its solution, classify every error afterward, and add repeatable local tests to programming notebooks. Without those actions, downloading every PDF is only collecting material.

## Why the series locks Spring 2026 instead of following the Fall home page

At audit time, the visible home-page schedule is already Fall 2026. Its Lecture 1 is titled “Introduction, AI Alignment, and Safety” and uses an August date. Spring 2026 Lecture 1 was officially titled “Introduction” and occurred January 13. Copying the current page would attach a new syllabus title to old slides.

The series follows three edition rules:

1. Every article records the Spring 2026 lecture number, date, and official title.
2. Primary material must be identifiable as Spring 2026 slides, notes, recitations, or homework.
3. Fall 2026 additions appear only under an explicit extension section and never silently rewrite the source course.

After Fall 2026 is complete, it may support a separate edition-difference article. It will not silently replace the canonical semester of published readings.

## How to read the complete series

The series contains 29 articles: this overview, 24 lecture readings, three stage reviews, and a completion roadmap. The reviews regroup the course as search through supervised learning, AlexNet through GPT-2, and reinforcement learning through AlphaZero. Each lecture article includes:

1. official material and reading completeness;
2. the problem inherited from the previous lecture;
3. complete coverage of the slides/notes agenda;
4. how recitation and homework test the same concept;
5. one reproducible derivation, example, or coding action;
6. modern-system or old-course comparisons only at the end.

For a first pass, begin with [Lecture 1: Introduction](/posts/ai/2026-08-22-cmu-07280-lecture-01-introduction-en), work through each lecture exercise, and pause at the three stage reviews to reorganize what you learned. Before starting, download the [Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf) and [Math Background](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf), then open the [Recitation 1 Search worksheet](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf). If you cannot define its state space, frontier, heuristic, and graph-search behavior, repair that foundation before jumping to the GPT-2 notebook. After all 24 lectures, use the [completion roadmap](/posts/ai/2026-08-22-cmu-07280-completion-roadmap-en) to test whether you produced executable evidence of learning.

The value of 07-280 is precisely that it refuses to reduce modern AI to training a neural network. It starts from problem representation, moves through search, estimation, representation learning, and sequential decisions, and only then assembles landmark systems. Read in full, AlexNet, GPT-2, and AlphaZero become three integration exams—not marketing names placed in one syllabus.

## References

- [CMU 07-280 Artificial Intelligence and Machine Learning I](https://www.cs.cmu.edu/~07280/)
- [07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [07-280 Spring 2026 Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf)
- [Lecture 1 — Introduction](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf)
- [Lecture 2 — Heuristic Search](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search.pdf)
- [Lecture 3 — Adversarial Search](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search.pdf)
- [Lecture 4 — Constraint Satisfaction Problems](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs.pdf)
- [07-280 Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html)
- [07-280 Recitation 1 — Search](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [07-280 Homework 1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf)
