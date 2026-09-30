---
title: "NTHU NLP Term Project and the Fall 2026 Redesign: A 30% Group Project Becomes an In-Person W14 Midterm, Plus Reasoning/Agentic AI, an AI-TA and TAICA Compute"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, nlp, ai-course, research-project, taiwan]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 19
tldr: "Fall 2025 was graded 70% assignments + 30% term project. Projects were done in groups of 3–4 and split into Proposal 6%, Progress 6%, Poster 6% and Report 12%, with no GPUs provided. The repo has no project spec, only the syllabus structure, an end-of-term reminder and the W15–W16 recordings. Fall 2026 switches to 75% assignments (4 of them) + a 25% in-person midterm in W14. The schedule drops the presentation weeks, adds a Reasoning/Agent unit, and brings in an AI-TA for grading support and TAICA compute credits. The official materials don't say why."
description: "The closing post of the NTHU Hung-Yu Kao NLP series: Fall 2025 term project weights, the four project types and four constraints, the end-of-term timeline and presentation recordings, and what the Fall 2026 (115-1) syllabus changes: grading, meeting time, week order, Reasoning/Agentic AI, the AI-TA, TAICA compute credits, the 2025 grade distribution, and what has been released so far (through W3)."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes)

**This post is based on the official materials for NTHU Prof. Hung-Yu Kao's Natural Language Processing course, Fall 2025 (114-1) and Fall 2026 (115-1).** It is part 19, the last, of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series, following [the course summary and LLM reasoning notes](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en).

The first 18 posts walked through one semester of Fall 2025 materials. This one covers two things they skipped: what the 2025 term project, worth 30% of the grade, asked for, and what changed in 2026.

Official materials used: the 2025 [W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf) and [Course_summary.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/Course_summary.pdf), the recordings in rows W14–W16 of the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md), the 2026 [Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf), and the schedule on the [repo's front page](https://github.com/IKMLab/NTHU_Natural_Language_Processing). Access ratings: Fall 2025 is **A3, enough for self-study**, though the term project only reaches syllabus level; Fall 2026 is **A2 (in progress)**. The scale is defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## 2025: the term project is worth 30%

The Grading page of the 2025 syllabus is short:

| Item | Weight | Details |
|---|---|---|
| Assignments | 70% | Says "5 assignments for each student," coding required |
| Final project | 30% | Groups of 3–4; Proposal 6%, Progress report 6%, Poster 6%, Report 12% |

The same page adds that the load of individual assignments may be "fine-tuned" to their design, with credits shifting by up to 3% either way. Note also that the syllabus says 5 assignments, but the repo only publishes 4 (word analogy, arithmetic, multi-output learning, RAG). The official materials don't say what the fifth was.

A small detail: this syllabus sits in the 2025 folder, but its cover reads "113-1 主導課程5," a title carried over from academic year 113 (Fall 2024). It lists 1,200 seats (100 reserved for NTHU) and synchronous remote sessions on Tuesday 13:20–15:10 and Thursday 13:20–14:10.

### Four project types, four constraints

Page 37 of the syllabus draws the project as two rows of boxes. The top row lists four project types:

- Reproducing new or classic NLP tasks
- LLM applications
- Competitions / Kaggle tasks
- Real data solving

The bottom row lists four constraints: groups of 3–4, **no GPU provided**, performance is not the only evaluation criterion (the slide says "evaluation matrix"), and two rounds of presentation or demonstration.

Read "no GPU provided" alongside [Part 13 on PEFT](/posts/ai/2026-09-30-nthu-nlp-peft-en). That post opens by estimating the GPU memory needed for full fine-tuning, and methods like LoRA are exactly what students without a cluster reach for in a project.

### Three directions from the closing slides

Course_summary has its own "Term project" page, which sorts good project work into three directions:

1. **Describe what makes the problem hard, and how that connects to your method**: data improvements, case studies (look at false positives and false negatives).
2. **Compare the performance of NLP techniques**: text features, representations, NLP models. The slide notes in parentheses that this matters more than machine-learning concerns such as hyperparameters or swapping in different ML models.
3. **Learn from others**: collect and reuse Kaggle code, and study or discuss how other groups approached it.

The second point is worth a pause. This is an NLP course, and the project is expected to answer which text representation or NLP model works better and why, not to push the score up by tuning.

**What to do**: If you're an outside reader using this course to practice a project, do one thing tonight. Pick a text classification or QA task on Kaggle, write down the two representations you plan to compare (say, TF-IDF vs. BERT's CLS vector), and list 10 error cases you'll inspect one by one. That covers points 1 and 2 at once.

### End-of-term timeline and presentation recordings

The last page of Course_summary gives the end-of-term timeline: Term Project CP4 and all assignments are due 12/25 (Thursday), grades are posted 12/29–12/30 and submitted 12/31. The slide doesn't spell out "CP4." The project happens to have four graded items, but the official materials don't confirm that CP4 means the fourth one.

The syllabus originally planned presentations in W14–W16 and optional demos in W17–W18. Here is what the actual 2025 schedule README lists:

| Week | README title | Materials |
|---|---|---|
| W14 | Term project presentation (1) | Course_summary, reasoning notes; recording [Week 14 Tue.](https://www.youtube.com/watch?v=_hzMv789JQ8) (about 77 min) |
| W15 | Term project presentation (2) | Recordings [Week 15 Tue.](https://www.youtube.com/watch?v=03_BDLu3DDU) (about 114 min), [Week 15 Thu.](https://www.youtube.com/watch?v=w48WxRz6LXE) (about 72 min) |
| W16 | Term Project (demo) (optional) | Recordings [Week 16 Tue.](https://www.youtube.com/watch?v=3AsbuOlSWpQ) (about 75 min), [Week 16 Thu.](https://www.youtube.com/watch?v=jQUHM3MQisw) (about 33 min) |
| W17–W18 | Term Project (demo) (optional) | Empty |

None of these recordings has captions, and I did not watch them, so this post doesn't describe which groups presented or on what topics. The W14 materials are the course summary, covered in [the previous post](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en).

### What outside readers can't get

The project spec, grading rubric, group topics, posters and reports are not in the repo. Assignment solutions and grades live on NTU COOL and require enrollment. That's why the project part of Fall 2025 only goes as far as its structure, even though the term as a whole is rated A3.

## 2026: the project becomes a midterm

The Fall 2026 Syllabus-115 changes the grading:

| Item | 2025 | 2026 |
|---|---|---|
| Assignments | 70% (5 listed) | 75% (4) |
| Term project | 30% | Dropped |
| Midterm exam | None | 25%, W14 (tentative), **in person** |

A red box on the same page says the course is an X-class at NTHU, so students can take other NTHU courses in the same time slot, and that the exam is held in person.

The schedule legend reflects the change. The 2025 legend lists Lecture, Tutorial and Reporting, with Exam struck through. In 2026, Reporting is struck through and Exam stays. The 2025 "This course is NOT designed for" list included "people who expect no exams and plan to get through assignments by collaborating." The 2026 version drops the NOT list entirely, keeps only "Is designed for," and adds "want to understand why LLMs are so powerful."

**The official materials don't say why.** The syllabus gives no reason for dropping the project and adding an exam, and this post won't guess.

### Meeting time and week order

In 2026 the course meets once, Thursday 9:00–12:00, still with 1,200 seats. The two syllabus schedules compare as follows. (This compares the two syllabus schedules only. The order of materials actually posted in 2025 never matched its own syllabus; see the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en).)

| Topic | 2025 syllabus | 2026 syllabus |
|---|---|---|
| Intro to NLP, basic ML for text | W1–W5 | W1–W5 |
| Intro to generative AI for text (1/3): embeddings through Transformers | W6 | W8 |
| Python for text (TA tutorials) | W7–W8 | W6–W7 |
| BERT family, decoding and evaluation | W9–W10 | W9–W10 |
| GPT-3/InstructGPT/RLHF, PEFT | W11–W12 | W11–W12 |
| RAG | W13 | W13 (I), W15 (II) |
| Midterm | None | W14 |
| Reasoning / Agent | None | W16 |
| Project presentations and demos | W14–W18 | None |

Two changes stand out: the TA tutorials move ahead of the generative-AI lectures, and RAG splits into two weeks on either side of the midterm.

The "In this course" page changed too. The 2025 version lists Basics, NLP Basics, GAI (generative models for text and images, different uses of GAI, building GAI-powered applications) and PBL (real-data use cases, building rich GAI-powered applications). The 2026 version lists Basics, NLP Basics and NLP with DL (sequential models, generative models for text), plus a new block, "NLP issues in LLM era," with Reasoning and Agentic AI underneath. The "not included" list is the same both years: speech, prompt usage, developing new models, solving GAI problems.

### Three new items: grade distribution, TAICA compute, AI-TA

**2025 grade distribution.** Page 46 of Syllabus-115, "Grade in 2025," shows two charts: 523 students in total, 475 with valid grades, a mean of 76.60 and a median of 79.70. The most common letter grade is A- (123 students, 25.9%); 41 students (8.6%) got an F. This is the only grade data the course has published.

**TAICA compute credits.** Page 47 spells out the terms. Credits are available September through December, each account is valid for 90 days from activation, and unused credit expires. The total budget is NT$90,000, with two suggested options: 100 accounts with 100 compute units (about NT$300 each), or 40 accounts with 500 units (about NT$1,500 each). The last line reads "Wait for announcement"; how to apply hasn't been announced. Compare this with "No GPU provided" on the 2025 project page. The 2025 syllabus says 100 seats are reserved for NTHU and the rest go to partner schools, about 50 per school on average.

**AI-TA.** Page 48, "Homework evaluation," lists "Human-TA grading" and "AI-TA assistance," with two evaluation areas below, "Code / Results Evaluation" and "Discussion Evaluation," and a final red box: "Your Insight, not GPT insight." The slide doesn't show which TA handles which area, and this post won't assign them.

Page 50, "The hardships of learning," quotes several student comments without attribution. They mention that the course takes a lot of time early in the term and that asynchronous viewing makes it easy to fall behind. One recommends it to master's students with coding and deep-learning background, and one liked how the later weeks connected Hugging Face, LangChain and Ollama.

**What to do**: If you're enrolled from a partner school in 2026, put the tentative W14 midterm date on your calendar tonight, and set a reminder on NTU COOL ([course 41436](https://cool.ntu.edu.tw/courses/41436)) to watch for the TAICA compute announcement.

## What 2026 has released so far

As of 2026-09-30, the schedule on the repo's front page is filled in only through W3:

| Week | Slides | Recording | Assignment |
|---|---|---|---|
| W1 | Syllabus-115, W1_NLP_brief_v2 | [Week 1](https://www.youtube.com/watch?v=EEbwXXoVQPY) | |
| W2 | W1_NLP_brief_v2 | [Week 2](https://www.youtube.com/watch?v=MnA5KUETSg4) | |
| W3 | W2_Word embeddings and Language Modeling (RNN)_v2 | [Week 3](https://www.youtube.com/watch?v=g0QE6O17BWE) | [HW1](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2026/Assignments/Assignment1) |

HW1 is still Word Analogy. Its walkthrough video is [4nktsdfU24k](https://youtu.be/4nktsdfU24k); the YouTube title says "Week 2 Thu. - Assignment 1," while the README places HW1 in the W3 row. The 2025 HW1 is covered in [Part 3](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en); I did not compare the 2026 handout item by item. Slides, recordings and HW2–HW4 from W4 onward are not out yet, and the in-person W14 midterm will have no public materials.

TA office hours are Monday and Wednesday 15:30–16:30 in Delta Building room 714.

## Further reading

- [CS224N Final Projects](/posts/ai/2026-08-22-cs224n-final-projects-en): Stanford's NLP final project comes with a full spec and examples, which fills the gap the NTHU project leaves.
- [CS230: AI project strategy](/posts/ai/2026-08-16-cs230-ai-project-strategy-en): how to choose a topic and iterate.
- [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): another Mandarin-taught course with fully public assignments.

## What this post can and cannot confirm

Confirmed: the weights, project types, constraints and schedules in both syllabi; the TAICA compute terms, the AI-TA page and the 2025 grade distribution charts; the project directions and end-of-term timeline in Course_summary; and the files, video IDs, titles and lengths listed for each week in the 2025 and 2026 READMEs. Not confirmed: what the fifth 2025 assignment was; the project spec, rubric and group topics; what the W15–W16 recordings contain (no captions, not watched); what exactly "CP4" refers to; why the course switched to a midterm; any Fall 2026 materials after W3.

Series navigation: previous, [course summary and LLM reasoning notes](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) | back to the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## References

- [IKMLab/NTHU_Natural_Language_Processing (course repo; front page shows the 2026 schedule)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W0_Syllabus.pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf)
- [Course_summary.pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/Course_summary.pdf)
- [Syllabus-115.pdf (Fall 2026)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf)
- [2026 Assignment1 (Word Analogy)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2026/Assignments/Assignment1)
- [Recording: [Fall 2025] Week 15 Tue. (in Mandarin)](https://www.youtube.com/watch?v=03_BDLu3DDU)
- [Recording: [Fall 2025] Week 15 Thu. (in Mandarin)](https://www.youtube.com/watch?v=w48WxRz6LXE)
- [Recording: [Fall 2025] Week 16 Tue. (in Mandarin)](https://www.youtube.com/watch?v=3AsbuOlSWpQ)
- [Recording: [Fall 2025] Week 16 Thu. (in Mandarin)](https://www.youtube.com/watch?v=jQUHM3MQisw)
- [Recording: [Fall 2026] Week 2 Thu. - Assignment 1 (in Mandarin)](https://youtu.be/4nktsdfU24k)
- [IKMLab NTHU YouTube channel (in Mandarin)](https://www.youtube.com/@IKMLabNTHU)
- [NTU COOL course page (course 41436, login required)](https://cool.ntu.edu.tw/courses/41436)
