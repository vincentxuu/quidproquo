---
title: "Reading MIT 6.7960: One Course, Two Official Editions — Complete the OCW 2024 Package, Read the 2025 Decks for What's New"
date: 2026-08-26
category: ai
type: guide
tags: [mit, ai-course, deep-learning, course-guide]
lang: en
series:
  name: "Reading MIT 6.7960"
  order: 0
tldr: "MIT 6.7960 Deep Learning (Fall 2025) publishes all 21 lecture decks as public Dropbox PDFs, and most required readings map to free textbook chapters; but the five problem sets are released only through Gradescope, and solutions plus recordings live behind Canvas login. This guide covers how the three instructors split the course, a topic map of all 21 lectures, textbook-based substitutes for lectures, and where outside self-learners realistically stop."
description: "A guided tour of MIT 6.7960 Deep Learning Fall 2025: instructor roles, a topic map of 21 lectures, how to pair two free textbooks with the readings, and the exact gaps in psets and recordings for self-study."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)

[MIT 6.7960: Deep Learning](https://deeplearning6-7960.github.io/) is MIT EECS's graduate-level deep learning course. In Fall 2025 it is co-taught by [Sara Beery](https://beerys.github.io/), [Kaiming He](https://people.csail.mit.edu/kaiming/), and [Omar Khattab](https://omarkhattab.com/). Every one of the semester's 21 lecture decks is directly available as a Dropbox PDF, weekly readings are listed on the schedule, and even the final project's [guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) is public.

This is not, however, a fully open course. Problem sets are released through [Gradescope](https://www.gradescope.com/courses/1110115), their solutions sit on [Canvas](https://canvas.mit.edu/courses/33933), and so do the lecture recordings — all three require MIT credentials. Under this site's four-tier rubric from the [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), the course rates **A2: partially open materials**. A materials-level deep dive is possible; the gaps must be stated plainly.

This post answers four questions: what the course teaches, how the three instructors divide it, how the 21 lectures connect, and how far an outside learner can get using two free textbooks. My verification covered the complete Fall 2025 schedule, grading section, and policies on the official site; I did not open every slide deck to audit its inner pages, so descriptions of individual lectures come from the official site's own summaries.

## First, decide if this is your course

The official description promises "fundamentals of deep learning, including both theory and applications," covering neural net architectures (MLPs, CNNs, RNNs, graph nets, transformers), backpropagation and automatic differentiation, learning theory and generalization in high dimensions, plus applications to computer vision, NLP, and robotics. The prerequisites are stiff: 18.05 (probability and statistics) plus one of 6.3720, 6.3900, or 6.C01 — meaning you should already have taken a machine learning or algorithms subject before walking in. It carries 3-0-9 units, and due to heavy enrollment Fall 2025 accepted no cross-registrations at all.

Compared with [MIT 6.S191](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en), which this site has also reviewed, the positioning is entirely different. 6.S191 is a nine-week bootcamp that prioritizes breadth; 6.7960 is a full-semester backbone course with proofs and theory. Generalization theory, approximation theory, and information theory — the topics bootcamps skip — each get a full lecture here. If you want to understand why things work rather than merely call APIs, this skeleton is worth walking through.

The grading structure reveals the emphasis: five psets worth 10% each (half the grade), a midterm worth 25%, and a final research project worth 25%. The exam is two hours, closed book, with a single page of handwritten notes allowed — the course expects you to internalize derivations, not look them up.

## Three instructors, exactly seven lectures each

The 21 lectures split evenly among the three instructors, and the division is not turn-taking — each owns a thematic line:

| Instructor | Line | Lectures |
|---|---|---|
| [Sara Beery](https://beerys.github.io/) | Engineering foundations and deployment | 1–2, 4, 6, 17–18, 20 |
| [Kaiming He](https://people.csail.mit.edu/kaiming/) | Representation learning and generative models | 5, 8, 10, 13–14, 16, 21 |
| [Omar Khattab](https://omarkhattab.com/) | Theory and foundation models | 3, 7, 9, 11–12, 15, 19 |

Beery owns "how you train models and ship them into the real world": the opening training fundamentals, CNNs, Transformers, OOD generalization, transfer learning, and a closing lecture on evaluation. He handles "what happens inside the model": sequence modeling, three flavors of representation learning, four lectures of generative modeling, and the finale on applying deep learning to your own problems. Khattab carries theory and the LLM side: approximation theory, generalization theory, similarity-based retrieval (his own neural information retrieval specialty), plus pre-training, scaling laws, post-training as three foundation-model lectures, and inference-time algorithms.

The lineup itself tells a story. Kaiming He is the author of ResNet; Omar Khattab created [ColBERT](https://arxiv.org/abs/2004.12832) and DSPy. In Fall 2024 the course was still taught by Phillip Isola and Jeremy Bernstein; after the 2025 handover the syllabus visibly shifted toward LLMs and retrieval — the foundation-model block and inference-time algorithms are new.

## A topic map of the 21 lectures

Laid out, the schedule falls into six segments:

| Segment | Lectures | Content |
|---|---:|---|
| Foundations | 1–3 | DNN building blocks, SGD/backprop/autodiff, universal approximation through Barron's theorem |
| Architectures | 4–6 | CNNs (grids), RNNs/LSTMs (memory), Transformers (tokens, attention, positional codes) |
| Generalization and representation learning | 7–10 | Generalization theory, reconstruction-based representation learning, similarity-based (contrastive, InfoNCE), information theory |
| Foundation models | 11–12, 15 | Pre-training, scaling laws, post-training |
| Generative models | 13–14, 16 | Generative basics, VAE and GAN, diffusion and flows |
| Practice and deployment | 17–21 | OOD generalization, transfer learning, inference-time algorithms, evaluation, practical advice |

Three things stand out. First, architectures take only three lectures: MLPs, CNNs, RNNs, and Transformers are taught as variations on the same set of ideas, not as a tour of popular models. Second, "generalization" appears twice — Lecture 7 covers the theory, Lecture 17 covers distribution shift and robustness; the theoretical and engineering faces are kept separate. Third, LLMs are not one standalone lecture; they are decomposed into pre-training, scaling laws, post-training, and inference-time algorithms, threaded through the deep learning spine.

Three guest lectures are interleaved: Rose E Wang (OpenAI), Zongyi Li (MIT/NYU), and Jiajun Wu (Stanford), with no public slides. There is also a PyTorch tutorial whose [Colab notebook](https://colab.research.google.com/drive/1nZg9_wYpVYWS9xZAiSft5_gyluuQpBWY?usp=sharing) is public and runnable from anywhere.

## Two free textbooks are your recording substitute

Without recordings, the readings become an outside learner's main channel. The good news: most of them point to free textbooks.

- [Foundations of Computer Vision](https://visionbook.mit.edu/) by Torralba, Isola, and Freeman (MIT Press, fully readable online for free). Most required readings come from here: Lecture 1 pairs with the neural networks chapter; Lecture 2 pairs with gradient-based learning and backpropagation; CNNs and Transformers each have matching chapters.
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) by Simon Prince (free PDF). The course site calls it "probably the best textbook devoted entirely to deep learning." UDL is not assigned chapter-by-chapter, but its chapters on inference, diffusion, and transformers cover exactly what the vision book treats lightly.
- To refresh ML basics, the official site also points to the open [6.390 notes](https://introml.mit.edu/notes/?fbclid=PAQ0xDSwMxDVNleHRuA2FlbQIxMAABp0r1wjiBU7px9Kf6ziMGCn6NGB3GhTW-QhmDeMG5oCD9T6qAQW5ItdrbpohF_aem_jL3v0-a5F6jpmw5iOtA7Aw).

The optional readings are curated seriously too. Generalization theory lists [Understanding deep learning requires rethinking generalization](https://arxiv.org/abs/1611.03530); pre-training lists the GPT-3 paper [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) alongside OLMo 2; scaling laws pairs [Kaplan et al.](https://arxiv.org/abs/2005.10242) with [Chinchilla](https://arxiv.org/abs/2203.15556) plus both sides of the "are emergent abilities a mirage?" debate. All public links — effectively a curated must-read list for modern deep learning.

The self-study method is direct: treat the official schedule as your syllabus, read the required readings before opening each deck, and when a derivation in the slides doesn't land, go back to the matching textbook chapter and redo it. The UDL author also ships a full set of [notebooks](https://github.com/udlbook/udlbook), so any formula you can't parse can be verified in code.

## The assignment gap, stated plainly

This is the line between A2 and A3:

| Item | Status | Notes |
|---|---|---|
| 21 lecture decks | Public | Direct Dropbox PDF links |
| Weekly readings | Public | Free textbook chapters, arXiv papers |
| Project guidelines | Public | Including grading direction and team rules |
| PyTorch tutorial | Public | Runnable Colab notebook |
| Pset questions | Not public | Released via Gradescope, requires enrollment access |
| Pset solutions | Not public | Links resolve to Canvas files |
| Lecture recordings | Not public | Canvas external tool, enrolled students only |
| TAs, office hours, feedback | Not public | In-class environment |

The final project is the one assessment an outsider can complete in full. The [guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) asks for novel experimentation and visualization, teams of up to three, and explicitly provides Google Colab Pro while telling students not to plan for large compute costs — "be creative." That design is friendly to self-learners: one small, clean research question beats hoarding GPU hours.

Worth noting is the [AI assistants policy](https://deeplearning6-7960.github.io/#AI_policy): rules for ChatGPT and friends are identical to those for human assistants — asking about concepts is welcome, doing the work for you is not, and any use must be disclosed atop the pset. The course treats understanding what AI can and cannot do as part of its content, and the policy reads more honestly than most.

The late policy is instructive too: homework is accepted up to 7 days late with score multiplied by (1−n/14), and every student gets ten penalty days waived automatically. The design assumes life happens, so you don't beg case by case.

## An outside self-study route

Once the gaps are acknowledged, the path forward is clear. My advice is to replace "finished reading" with "built something":

1. **Test the water first**: open the PyTorch tutorial Colab and complete the first cell block without peeking at anything. If you're stuck, go back to the 6.390 notes before pushing on.
2. **Textbook first, slides second**: for the first three weeks, follow the readings into visionbook's learning part (gradient-based learning, backpropagation, neural networks) alongside Lectures 1–3. After each chapter, redo the key derivation on blank paper.
3. **Invent small problems where psets are missing**: for example, after backpropagation, implement finite-difference gradient checking for a one-layer network in NumPy. It won't impersonate a real pset, but it verifies you actually understand.
4. **Read the foundation-model block (Lectures 11, 12, 15, 19) with the papers**: this is the newest part of the 2025 syllabus, and the optional readings — GPT-3, OLMo 2, Kaplan, Chinchilla — are the core material.
5. **Finish with a mini project**: following the spirit of the guidelines, pick something runnable on free Colab and write it up like a Distill-style analysis. This is the one assessment you can reproduce end to end.

The formal course runs 15 weeks; budgeting 12 weeks for self-study is realistic, because without office hours, stuck-time comes out of your own schedule.

## Which edition to use: 2025 as syllabus, 2024 OCW for recordings

The [Fall 2024 edition](https://phillipi.github.io/6.7960/), taught by Isola, Beery, and Bernstein, also published every deck — and graded 65% psets / 35% project with no midterm. Adding an exam in 2025 signals a raised bar on internalizing theory. [Fall 2023](https://phillipi.github.io/6.s898/index.html), then numbered 6.s898, is an earlier ancestor.

The key difference is video. Fall 2025 recordings are locked behind Canvas, but **the Fall 2024 course shipped on [MIT OpenCourseWare](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)** — videos, notes, five assignments, and the project, all public. So my recommendation: **use the Fall 2025 schedule and decks as your primary syllabus** (freshest instructor lineup and LLM content), **and watch corresponding-topic recordings from Fall 2024 on OCW** where you want a lecture voice. The two years don't align perfectly — graph nets had a dedicated lecture in 2024 that left the main 2025 table — but reading them side by side shows how the same course evolves.

For background, pair this with the [MIT AI/ML Course Map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en) and the [CMU 11-785 overview](/posts/ai/2026-08-22-cmu-11785-course-overview-en): the former locates 6.7960 within MIT's ladder, the latter reviews another course with open teaching and closed assignments.

## Bottom line

6.7960 Fall 2025 is a rigorously designed A2 course: 21 public decks, curated readings, and an open project guidelines document make materials-level self-study entirely feasible, while closed psets, solutions, and current-year recordings mark the real boundary for outsiders. Substitute textbooks for lectures, fill recordings from OCW 2024, and close with a mini project — you won't get MIT credit, but you will reach the core of the course.

## References

- [MIT 6.7960 Deep Learning, Fall 2025 course site](https://deeplearning6-7960.github.io/) — source for the 21-lecture schedule, grading, policies, and every public link
- [6.7960 Fall 2025 Project Guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) — final project requirements, teaming, and compute advice
- [PyTorch Tutorial Colab](https://colab.research.google.com/drive/1nZg9_wYpVYWS9xZAiSft5_gyluuQpBWY?usp=sharing) — official Week 2 tutorial notebook
- [Foundations of Computer Vision](https://visionbook.mit.edu/) (Torralba, Isola, Freeman) — the free online textbook behind most required readings
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/) (Simon Prince) — the free deep learning textbook recommended by the course site
- [6.7960 Fall 2024 course site](https://phillipi.github.io/6.7960/) — the Isola/Bernstein era syllabus and decks
- [MIT OCW: 6.7960 Fall 2024](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) — historical edition with public recordings and full assignments
- [6.s898 Fall 2023 course site](https://phillipi.github.io/6.s898/index.html) — earlier iteration
- [6.390 Intro to ML public notes](https://introml.mit.edu/notes/) — the site-recommended ML refresher
- [Understanding deep learning requires rethinking generalization (arXiv:1611.03530)](https://arxiv.org/abs/1611.03530) — optional reading for Lecture 7
- [Language Models are Few-Shot Learners (GPT-3, arXiv:2005.14165)](https://arxiv.org/abs/2005.14165) — optional reading for Lecture 11
- [Scaling Laws for Neural Language Models (arXiv:2005.10242)](https://arxiv.org/abs/2005.10242) — optional reading for Lecture 12
- [Training Compute-Optimal LLMs (Chinchilla, arXiv:2203.15556)](https://arxiv.org/abs/2203.15556) — optional reading for Lecture 12
- [ColBERT (arXiv:2004.12832)](https://arxiv.org/abs/2004.12832) — instructor Khattab's signature work, related to Lecture 9
- On this site: [Global AI and CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — definition of the A0–A3 openness tiers
- On this site: [MIT AI/ML Course Map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en) — where 6.7960 sits in MIT's curriculum ladder
