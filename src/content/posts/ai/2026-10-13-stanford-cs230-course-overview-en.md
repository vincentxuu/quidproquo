---
title: "Deep Learning: How the Flipped Classroom Works and How to Read the Nine Lectures | Stanford CS230 Course Overview"
date: 2026-10-13
category: ai
type: guide
tags: [stanford-cs230, deep-learning, ai-course, stanford, course-guide]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 0
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 10
tldr: "CS230 is the deep learning course Andrew Ng and Kian Katanforoosh teach at Stanford, run as a flipped classroom: the foundations of neural networks, optimization, CNNs, sequence models and Transformers live in five online Coursera courses, and one in-person lecture a week covers project method, adversarial attacks and generative models, reinforcement learning, LLM applications and interpretability. The nine in-person lectures, most of their slides and two practice midterms with solutions are public; the Stanford-only Coursera sessions, the section recordings and project mentoring are not."
description: "An overview of the Stanford CS230: Deep Learning series, based on the official home page, syllabus, project page, section page and the Stanford Online playlist: how the flipped classroom is put together, prerequisites, grading and the AI tools policy, the week-by-week mapping between in-person lectures and Coursera modules, what outside readers can get, and two reading routes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-stanford-cs230-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Source years**: the schedule, grading and policies follow the official site as of 2026-10-13, which shows the Autumn 2025 syllabus. The public recordings are the nine in-person lectures from that same offering. This is post 0 of the [Reading Stanford CS230](/en/series/cs230) series, and its entry point.

[CS230: Deep Learning](https://cs230.stanford.edu/) is taught by Andrew Ng and Kian Katanforoosh, with one in-person lecture every Tuesday morning. The site describes the course this way: you learn the foundations of deep learning, how to build neural networks, and how to lead successful machine learning projects. The topics it names include convolutional networks, RNNs, LSTM, Adam, Dropout, BatchNorm and Xavier/He initialization.

This post answers five questions: what the course is made of, what you need first, how it is graded, what outside readers can get, and in what order to read the nine in-person lectures.

## What the course is made of

CS230 is a flipped classroom. The foundations are not taught in the room: students watch online videos at home and do quizzes and programming assignments, and class time goes to advanced topics the videos don't treat in depth, plus guest speakers from industry. The site lists five components:

| Component | Content | Frequency |
|---|---|---|
| Online modules | All five courses of DeepLearning.AI's [Deep Learning Specialization](https://www.deeplearning.ai/courses/deep-learning-specialization/): videos, quizzes, programming assignments | About two modules a week |
| In-person lecture | An advanced topic or a guest lecture | One every Tuesday |
| Section | Hands-on project advice and theory | One every Friday |
| Midterm | Three hours, pen and paper, covering the first half of the quarter | Once |
| Final project | Proposal, milestone, final report, poster session | All quarter |

One online module equals one "week" of a Coursera course: about ten videos of roughly ten minutes each, a quiz that takes 10 to 30 minutes, and a programming assignment of about two hours.

So the first thing to sort out is that the course has two tracks. **The online modules teach the fundamentals of deep learning**, from logistic regression, backpropagation, initialization and regularization to CNNs, RNNs, attention and Transformers. **The in-person lectures teach what sits outside the fundamentals**: how to tell where a project is stuck, why models can be fooled, where RLHF fits inside reinforcement learning, and how many layers an LLM application should stack. This series covers the second track.

## Prerequisites

The site lists four, and offers enrolled students Workera self-assessments:

| Prerequisite | Official wording | On this site |
|---|---|---|
| Probability | Familiarity with probability theory (CS 109 or STATS 116) | [CS109 course overview](/posts/learning/2026-08-21-stanford-cs109-probability-en) |
| Statistics | Familiarity with basic statistics and data science | [CS109 course overview](/posts/learning/2026-08-21-stanford-cs109-probability-en) (its second half covers inference and estimation) |
| Linear algebra | Familiarity with linear algebra (MATH 51) | [Harvard CS181 Assignment 0](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) (four problems to self-test linear algebra and calculus) |
| Programming | Basic computer science principles and skills, enough to write a reasonably non-trivial program | — |

There is no machine learning course on the list. The online modules start from logistic regression and do not assume you have taken [CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

A self-check you can use: take a single-layer logistic regression with input vector x, output sigmoid(w·x + b) and cross-entropy loss. Can you derive the gradient of the loss with respect to w by hand? The answer: for a single example, ∂L/∂w = (ŷ − y)x, the scalar prediction error times the input vector. If you can derive it, the first two modules of the first online course will not block you. If you can't, read the [CS229 Lecture 8 guide on backpropagation](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en) for the chain rule and vector derivatives before starting.

## Grading and the AI tools policy

| Item | Weight |
|---|---|
| Final project | 45% (proposal 2%, milestone 7%, final report 30%, poster session 6%) |
| Midterm | 35% |
| Programming assignments | 12% |
| Quizzes | 8% |

Programming assignments and quizzes are graded on completion, not score. Together they make up a fifth of the grade that you get for finishing; the other four fifths are the project and the three-hour written exam.

The late policy gives each student six penalty-free late days, with at most three days late on any single assignment; once the late days are used up, each extra day takes 2% off the final grade. The final report, the poster and the exams accept no late submissions.

The AI tools policy is written for two cases. On assignments, you may use generative AI as a collaborator, but you may not ask it for the answers or copy solutions, and you must acknowledge it. On project reports, you may use tools such as Claude Code and Codex for coding, debugging, finding literature and polishing the writing, but the core analysis, the interpretation of results and the conclusions must be your own. The report must end with an AI disclosure section naming the tools used and what each was used for, and that section does not count toward the page limit. Fabricated citations, unsupported claims, unverified code and unchecked AI-generated content may all lose points.

## How the lectures map to the online modules

The official syllabus puts each in-person lecture on the same row as the online modules to finish before it. Module codes read like this: C1M2 is the second module of the first course.

| Lecture | Topic | Online modules to complete first | Guide on this site |
|---|---|---|---|
| Lecture 1 | Class introduction | None | [Introduction to Deep Learning](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) |
| Lecture 2 | Supervised, self-supervised and weakly supervised learning through case studies | C1M1 Introduction to deep learning, C1M2 Neural network basics | [Supervised, Self-Supervised & Weakly Supervised Learning](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en) |
| Lecture 3 | Full cycle of a deep learning project | C1M3 Shallow neural networks, C1M4 Deep neural networks | [Full Cycle of a DL Project](/posts/ai/2026-08-16-cs230-full-cycle-dl-project-en) |
| Lecture 4 | Adversarial robustness and generative models | C2M1 Practical aspects, C2M2 Optimization algorithms | [Adversarial Robustness and Generative Models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en) |
| Lecture 5 | Deep reinforcement learning | C2M3 Hyperparameters and BatchNorm, C3M1–M2 ML strategy | [Deep Reinforcement Learning](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf-en) |
| Lecture 6 | AI project strategy | C4M1 Foundations of CNNs, C4M2 Deep convolutional models | [AI Project Strategy](/posts/ai/2026-08-16-cs230-ai-project-strategy-en) |
| (Lecture 7, no class) | — | C4M3–M4 ConvNet applications | — |
| Lecture 8 | Agents, prompts and RAG | C5M1 Recurrent neural networks | [Agents, Prompts, and RAG](/posts/ai/2026-08-16-cs230-agents-prompts-rag-en) |
| Lecture 9 | Career advice in AI, with a guest | C5M2 Word embeddings, C5M3 Sequence-to-sequence models | [Career Advice in AI](/posts/career/2026-08-16-cs230-career-advice-in-ai-en) |
| Lecture 10 | What's going on inside the model | C5M4 Transformers | [What's Going On Inside My Model?](/posts/ai/2026-08-16-cs230-inside-the-model-en) |

The week of Lecture 7 was Democracy Day with no class, and the syllabus lists the midterm on that same day (with the year mistyped as 2026), which is why the public recordings jump from 6 to 8.

Three rows don't match between the syllabus and the recordings. Go by the recordings:

- Lecture 2 is called "Key AI Concepts Through Case Studies" on the syllabus and "Supervised, Self-Supervised, & Weakly Supervised Learning" on the recording. They are the same lecture.
- Lecture 6 is listed on the syllabus as career advice and reading research papers, with links to the previous year's slides. The actual recording is about AI project strategy. The career lecture is Lecture 9.
- Lecture 8 is called "Beyond the model: Enhancing LLM applications" on the syllabus and "Agents, Prompts, and RAG" on the recording.

The table also shows why the in-person lectures can be read out of order. When Lecture 4 covers adversarial attacks, students have only just finished initialization and optimization. When Lecture 5 covers reinforcement learning, CNNs haven't been taught yet. From this arrangement, the inference is that the lecture topics mostly don't depend on that week's online modules and are mostly independent of each other. The syllabus flags one exception: the Lecture 2 row notes that the Batch Normalization videos from C2M3 will be useful for that lecture.

## What outside readers can get

**Available:**

- **Recordings of the nine in-person lectures.** The Stanford Online [YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) has Lectures 1 to 6 and 8 to 10, each one to two hours long.
- **Slides for most in-person lectures.** On the official syllabus, Lectures 2, 4, 5, 8, 9 and 10 link to that offering's PDFs with no login (the file numbers run one behind the lecture numbers: Lecture 8's file is lecture_7.pdf). Lectures 1 and 6 link to the previous year's files, and Lecture 3 has no slides posted.
- **Slides for the online modules.** Every module on the syllabus has a PDF next to it, from C1M1 to C5M4.
- **The online courses themselves.** The five course links on the syllabus point straight to the public Coursera course pages, so outside readers can enroll in the Deep Learning Specialization on their own. For cost and audit terms, go by the Coursera pages.
- **Project resources.** The [project page](https://cs230.stanford.edu/project/) publishes the project instructions, past projects, and a [code examples repo](https://github.com/cs230-stanford/cs230-code-examples) put together by the teaching team (one computer vision and one NLP example, each in TensorFlow and PyTorch). One rule on the project page is worth knowing early: simply prompting LLMs without additional training does not qualify as a valid project.
- **Section topics and handout pages.** The [section page](https://cs230.stanford.edu/section/) lists nine sessions, from getting a project started, backpropagation, and initialization and regularization, to debugging, evaluation metrics and writing the report.
- **Midterm review material.** The [Section 6 page](https://cs230.stanford.edu/section/6/) posts two years of review slides plus two practice midterms with their solutions, no login needed.

**Not available:**

- **The actual midterm and the review session recording.** Only the two practice midterms above are public.
- **The Stanford-only Coursera sessions.** Enrolled students get invitations at their university email, and quiz and assignment deadlines follow the Stanford syllabus. Outside readers can only enroll in the public version.
- **Section recordings**, which are on Canvas.
- **Project grading and mentoring.** The proposal, milestone and report go to Gradescope, and the syllabus schedules two project meetings with a TA. Both are for enrolled students only.

The site also has an audit request form, but it doesn't say what the criteria are or what an approved auditor gets access to.

## Two reading routes

**The full route: online modules plus lectures.** Go down the table row by row: finish that row's online modules, then read the guide for that lecture or watch the recording. Ten weeks of this gives you both the fundamentals and the judgment. Nobody will grade your final project. The project page currently publishes only the proposal requirements; the milestone, final report and poster sections still say to be announced, and for how to write the report you can use the [Section 9](https://cs230.stanford.edu/section/9/) material. Working through both practice midterms against their solutions is the one objective check outside readers have.

**Lectures only: pick by purpose.** If you can already train models, treat the nine lectures as independent topics:

- To run projects well: [Lecture 3](/posts/ai/2026-08-16-cs230-full-cycle-dl-project-en) and [Lecture 6](/posts/ai/2026-08-16-cs230-ai-project-strategy-en). Both teach different stages of the same thing: get a first working version out as fast as possible, then use error analysis to decide what to change next.
- To see how embeddings get trained: [Lecture 2](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en).
- For LLM applications: [Lecture 8](/posts/ai/2026-08-16-cs230-agents-prompts-rag-en), then the final part of [Lecture 5](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf-en), which covers RLHF.
- For model security and interpretability: [Lecture 4](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en) and [Lecture 10](/posts/ai/2026-08-16-cs230-inside-the-model-en).
- For career questions: the second half of [Lecture 1](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) and [Lecture 9](/posts/career/2026-08-16-cs230-career-advice-in-ai-en).

To decide which route is yours, look at the four programming assignments in the first two modules of the second Deep Learning Specialization course: initialization, regularization, gradient checking, optimization. If you can say what each of the four does and why it is needed without looking anything up, take the second route. If not, take the first. As a bar: you should be able to say that poor initialization makes gradients vanish or explode, and that gradient checking compares numerical differences against the gradients backpropagation computes.

## What you can do tonight

1. Open the [official syllabus](https://cs230.stanford.edu/syllabus/), download the C1M1 and C1M2 slides, and confirm you can work out the prerequisite self-check above.
2. Watch the [Lecture 1 recording](https://www.youtube.com/watch?v=_NLHFoVNlbg), one hour with no math, alongside [this series' Lecture 1 guide](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en).
3. Pick one purpose from the lectures-only list and schedule that lecture for this week.

## Further reading

- [Stanford CS229 course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): Stanford's machine learning course, with more mathematical derivation than CS230.
- [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en): where CS230 sits among the main-line courses.

**Series navigation**: next, [Introduction to Deep Learning: The Two Moments Prompting Stops Being Enough](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)

## Course video sources

Official course and recording entries are linked below. The public playlist holds the recordings of the nine in-person lectures, and each lecture's video is embedded in its own guide; this post is an overview and embeds none. The site's [Lecture page](https://cs230.stanford.edu/lecture/) also links to an older Fall 2018 playlist and notes that the current recordings are on Canvas for enrolled students only.

Course and recording entries:

- [Stanford CS230 Autumn 2025 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X)
- [Official course / lecture source](https://cs230.stanford.edu/syllabus/)

Checked: 2026-10-13.

## Update Log

- 2026-10-13: Added the course overview as the series entry point.

## References

- [CS230 home page](https://cs230.stanford.edu/) — course description, flipped-classroom components, prerequisites, grade breakdown, late policy, honor code and AI tools policy
- [CS230 official syllabus](https://cs230.stanford.edu/syllabus/) — lecture dates and topics, online module mapping, slide links, midterm and project deadlines
- [CS230 project page](https://cs230.stanford.edu/project/) — project types, starter resources and deliverables
- [CS230 section page](https://cs230.stanford.edu/section/) — topics of the nine sections
- [CS230 Section 6](https://cs230.stanford.edu/section/6/) — midterm review slides, two practice midterms and solutions
- [CS230 Lecture page](https://cs230.stanford.edu/lecture/) — note that current recordings are on Canvas, and the older Fall 2018 playlist
- [Stanford CS230 Autumn 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNRRGdS0rBbXOUGA0wjdh1X) — Stanford Online, recordings of the nine in-person lectures
- [Deep Learning Specialization](https://www.deeplearning.ai/courses/deep-learning-specialization/) — DeepLearning.AI, the five courses the online modules belong to
- [cs230-code-examples](https://github.com/cs230-stanford/cs230-code-examples) — project code examples from the teaching team
