---
title: "Harvard CS50 AI Guide: Seven Weeks, Twelve Projects, and How to Follow a Course Filmed in 2020"
date: 2026-08-26
category: ai
type: guide
tags: [cs50, harvard, ai-course, python, learning-path]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 0
tldr: "CS50 AI's OpenCourseWare edition publishes seven weeks of lectures, slides, notes, and twelve Python projects with autograder feedback, plus a free CS50 Certificate if you score at least 70% on every project. The catch: weeks 0–5 still use the Spring 2020 recordings; only Week 6 (Language) was re-recorded, in 2023."
description: "A guide to Harvard CS50's Introduction to Artificial Intelligence with Python: what the seven weeks cover, what the twelve projects ask you to build, how the free OCW route differs from edX certificates, and whether 2020 recordings are still worth following in 2026."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-harvard-cs50-ai-guide)

Search for free AI courses and [Harvard CS50's Introduction to Artificial Intelligence with Python](https://cs50.harvard.edu/ai/) (CS50 AI below) is always near the top. Taught by [Brian Yu](https://brianyu.me) and [David J. Malan](https://cs.harvard.edu/malan/), it is fully open through OpenCourseWare: seven weeks of video, per-lecture notes, slides, source code, quizzes, and twelve Python projects with autograder feedback. Under the access labels defined in this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map), it is **A3 — sufficient for self-study**: recordings, materials, projects, and the feedback loop are all available to outsiders, and you can go from zero to a certificate without any campus identity.

But "fully public" does not mean "fully current." Open any lecture's download links and the paths read `cdn.cs50.net/ai/2020/spring/` — the videos were filmed in spring 2020. So this guide answers two questions: what do these seven weeks and twelve projects actually involve, and is a course recorded in 2020 still worth following in 2026?

## Decide whether this is your course

The prerequisites are explicit on the official page: [CS50x](https://cs50.harvard.edu/x), or at least one year of experience with Python. No linear algebra or probability required — where probability matters, the course teaches it in week two.

CS50 AI's positioning is "walk the full landscape from classical to modern AI in Python," not a theory course and not a framework bootcamp. Each week has the same rhythm: watch the lecture, build the project, submit to the autograder. The official workflow is literally two steps — Watch Lecture, Submit Project. If you want rigorous derivations, this is not that course. If you want to be writing search engines, game-playing AIs, Bayesian networks, and neural networks within months, it is probably the most complete free structure available.

## What the seven weeks teach

The seven topics form a deliberate arc from "how to search" to "language models":

| Week | Topic | Coverage |
|---|---|---|
| [Week 0](https://cs50.harvard.edu/ai/weeks/0/) | Search | DFS, BFS, A\*, Minimax, Alpha-Beta Pruning |
| [Week 1](https://cs50.harvard.edu/ai/weeks/1/) | Knowledge | Propositional logic, model checking, resolution |
| [Week 2](https://cs50.harvard.edu/ai/weeks/2/) | Uncertainty | Probability, Bayes' rule, Bayesian networks, Markov models |
| [Week 3](https://cs50.harvard.edu/ai/weeks/3/) | Optimization | Local search, simulated annealing, constraint satisfaction |
| [Week 4](https://cs50.harvard.edu/ai/weeks/4/) | Learning | Supervised learning, SVMs, reinforcement learning, Q-learning, k-means |
| [Week 5](https://cs50.harvard.edu/ai/weeks/5/) | Neural Networks | Backpropagation, TensorFlow, CNNs, RNNs |
| [Week 6](https://cs50.harvard.edu/ai/weeks/6/) | Language | n-grams, Naive Bayes, word2vec, attention, transformers |

The first half (Search through Optimization) is classical AI: symbols, logic, probability, search. Only the second half enters machine learning. Many free courses jump straight to neural networks; CS50 AI spends three weeks building the panorama that "AI is not deep learning" — one of the strongest reasons to follow it even now.

## What the twelve projects ask you to build

Each project is a complete program written from scratch. The official distribution code and specification are provided, and you verify correctness with [`check50`](https://cs50.readthedocs.io/projects/check50/en/latest/index.html) before submitting via [`submit50`](https://cs50.readthedocs.io/projects/submit50/en/latest/):

| Week | Projects | What you build |
|---|---|---|
| [Project 0](https://cs50.harvard.edu/ai/projects/0/) | [Degrees](https://cs50.harvard.edu/ai/projects/0/degrees/), [Tic-Tac-Toe](https://cs50.harvard.edu/ai/projects/0/tictactoe/) | BFS over actor co-starring graphs; Minimax tic-tac-toe |
| [Project 1](https://cs50.harvard.edu/ai/projects/1/) | [Knights](https://cs50.harvard.edu/ai/projects/1/knights/), [Minesweeper](https://cs50.harvard.edu/ai/projects/1/minesweeper/) | Solve knights-and-knaves puzzles with propositional logic; knowledge-based Minesweeper |
| [Project 2](https://cs50.harvard.edu/ai/projects/2/) | [PageRank](https://cs50.harvard.edu/ai/projects/2/pagerank/), [Heredity](https://cs50.harvard.edu/ai/projects/2/heredity/) | PageRank via sampling and iteration; infer genotypes with a Bayesian network |
| [Project 3](https://cs50.harvard.edu/ai/projects/3/) | [Crossword](https://cs50.harvard.edu/ai/projects/3/crossword/) | Generate crossword layouts with backtracking and constraint satisfaction |
| [Project 4](https://cs50.harvard.edu/ai/projects/4/) | [Shopping](https://cs50.harvard.edu/ai/projects/4/shopping/), [Nim](https://cs50.harvard.edu/ai/projects/4/nim/) | k-nearest-neighbors purchase prediction; Q-learning Nim agent |
| [Project 5](https://cs50.harvard.edu/ai/projects/5/) | [Traffic](https://cs50.harvard.edu/ai/projects/5/traffic/) | Train a CNN in TensorFlow to classify traffic signs |
| [Project 6](https://cs50.harvard.edu/ai/projects/6/) | [Parser](https://cs50.harvard.edu/ai/projects/6/parser/), [Attention](https://cs50.harvard.edu/ai/projects/6/attention/) | Parse sentences with a CFG; implement self-attention |

The value of this list is coverage: one solid artifact each for logic puzzles, probabilistic inference, combinatorial optimization, supervised learning, reinforcement learning, computer vision, and NLP. Finish all twelve and you have not merely heard of these terms — you have implemented each of them once.

## Three official routes and how they differ

The site lists four ways to take the course. For outside learners, three matter:

**1. The free OCW route (this guide's main line)**

Follow the [OpenCourseWare](https://cs50.harvard.edu/ai/) directly, at no cost. To get autograder feedback, create an edX account and join the course by authorizing cs50 with your GitHub account. Work is graded within five minutes, and progress shows up in the [Gradebook](https://cs50.me/cs50ai). Score at least 70% on every project and you qualify for the free [CS50 Certificate](https://cs50.harvard.edu/ai/certificate/).

**2. The edX verified-certificate route**

If you want an edX verified certificate, enroll through [cs50.edx.org/ai](https://cs50.edx.org/ai) instead; professional certificates have their own entry point. The difference is identity verification and fees — the materials themselves are identical.

**3. The credit route**

For actual transfer credit, register with [Harvard Extension School](https://web.dce.harvard.edu/extension/csci/e/80) or the corresponding Harvard Summer School section. This site's [Harvard AI/ML course map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) audited the Summer 2026 offering: it is a new official section running on the 2020 recordings and a snapshot of the assignments, with Gradescope, sections, and office hours reserved for enrolled students. Pure self-learners can ignore this route.

One more thing worth knowing: the license lets teachers adopt or adapt the materials for their own courses, which is why so many high schools and bootcamps run on this skeleton.

## The core tension: everything is public, but the footage stopped in 2020

This is the most important section and the easiest to miss.

Open the asset list for any lecture from Week 0 to Week 5: the video, audio, slides, and transcript URLs all point to `cdn.cs50.net/ai/2020/spring/`. In other words, **the first six weeks were filmed in spring 2020**.

The single exception is Week 6, Language: its assets live under `cdn.cs50.net/ai/2023/x/`, a re-recording. Attention and transformers therefore are in the course — but only in the final week.

The assignment side crosses years too. Take [Degrees](https://cs50.harvard.edu/ai/projects/0/degrees/): the distribution code downloads from the `2023/x` path, while `check50` and `submit50` run against the slug `ai50/projects/2024/x/degrees`.

Conceptually it is one problem; its executable versions span several years. The spec also states the latest supported Python is 3.12.

The right mental model splits "course version" into four layers: **the official offering, the lecture assets, the assignment assets, and the feedback system**. The OCW front page carries the current year, the lectures are from 2020, the assignments mix 2023/2024 distributions, and the autograder is maintained today. These layers being out of sync does not mean the course is broken; it means you should follow the OCW pages' own download URLs and `check50` commands rather than assembling versions yourself.

## Are 2020 recordings worth following in 2026?

My answer is yes, for three verifiable reasons.

First, what this course teaches changes slowly. DFS, A\*, Minimax, Bayesian networks, Q-learning, and backpropagation are decades-old core algorithms. A 2020 recording has no staleness problem there — textbooks today teach the same material.

Second, where things changed fast, the course already patched itself halfway. Week 6 was re-recorded in 2023 to add attention and transformers, so the course touches the edge of LLM-era concepts. What is missing is the application layer: prompt engineering, RAG, agents. That layer was never what this course claimed to cover.

Third, alternatives are not obviously better. Many "latest 2026 AI courses" update tool names rather than fundamentals, while twelve projects plus autograder feedback remains a rare closed loop among free offerings.

Practical advice: pick the OCW route and follow it end to end. Always use the download URL and `check50` command printed on the official project page, and never mix starter code from other years. If you need the LLM application layer, find separate resources — do not expect this course to cover it.

## Minimal way to start

Three steps you can take tonight:

1. Open the [Degrees spec](https://cs50.harvard.edu/ai/projects/0/degrees/), download the distribution code, and read the Understanding section.
2. Implement `shortest_path` — the hint is already in the spec: breadth-first search. Stuck? Go back to the [Week 0](https://cs50.harvard.edu/ai/weeks/0/) lecture.
3. Run `check50 ai50/projects/2024/x/degrees`, then walk through the submission flow and confirm your edX account shows up in the Gradebook.

If steps one through three take you three days or fewer, keep going. If reading the spec alone stalls you, do [CS50x](https://cs50.harvard.edu/x) or a year of Python first, then come back.

## Update log

- 2026-08-26: Initial version. Recording and assignment version status verified against the official site on August 26, 2026.

## References

- [CS50's Introduction to Artificial Intelligence with Python — OpenCourseWare main site](https://cs50.harvard.edu/ai/)
- [Week 0 Search](https://cs50.harvard.edu/ai/weeks/0/) — evidence lecture assets point to `cdn.cs50.net/ai/2020/spring/`
- [Week 6 Language](https://cs50.harvard.edu/ai/weeks/6/) — evidence lecture assets point to `cdn.cs50.net/ai/2023/x/`
- [Projects overview](https://cs50.harvard.edu/ai/projects/)
- [Degrees project spec](https://cs50.harvard.edu/ai/projects/0/degrees/) — `2023/x` distribution, `ai50/projects/2024/x/degrees` slug, Python 3.12 cap
- [CS50 Certificate page](https://cs50.harvard.edu/ai/certificate/) — free certificate requires ≥70% on every project
- [edX enrollment (verified certificate)](https://cs50.edx.org/ai)
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [Gradebook](https://cs50.me/cs50ai)
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — definitions of the A0–A3 access labels
- On this site: [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) — version audit of CSCI S-80 Summer 2026 vs. OCW
