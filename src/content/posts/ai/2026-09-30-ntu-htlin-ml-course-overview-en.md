---
title: "Reading Hsuan-Tien Lin's Machine Learning Foundations & Techniques: Overview and Self-Study Routes"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 0
tldr: "Hsuan-Tien Lin's Machine Learning Foundations (16 lectures) and Machine Learning Techniques (16 lectures) are two Mandarin-taught MOOCs. All 130 YouTube videos and 32 slide decks are free. The MOOCs alone are A2: since August 2025, free Coursera accounts can only view the first module, so the exercises sit behind a paywall. Add the Fall 2024 course page, which publishes HW0–HW7 and the final project spec, and you reach A3, minus the grading chain: no official solutions, Gradescope and NTU COOL are enrolled-only, and the Kaggle competition returns 404. Fall 2026 is running now as a flipped classroom; slides through week 4, hw0, and hw1 are public."
description: "Entry point for the series on NTU Professor Hsuan-Tien Lin's Machine Learning Foundations and Machine Learning Techniques: the 32-lecture structure organized around seven questions, three version baselines (MOOC, Fall 2024, Fall 2026), A0–A3 access grading and gaps, YouTube versus Coursera's preview model, the Fall 2026 flipped-classroom watch list, three self-study routes, and the 19 posts in this series."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

For many Mandarin-speaking learners, [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/) (機器學習基石) and Machine Learning Techniques (機器學習技法) were their first course in machine learning theory. Hsuan-Tien Lin of NTU's Department of Computer Science and Information Engineering launched both on Coursera in 2015–2016, taught in Mandarin. The textbook is [Learning from Data](http://amlbook.com) (LFD below), which he co-wrote with Yaser Abu-Mostafa and Malik Magdon-Ismail. Foundations asks why machines can learn at all and builds up to VC dimension and regularization. Techniques moves on to SVMs, boosting, decision trees, and neural networks.

Ten years later, Lin's own NTU course still uses the two MOOCs as its backbone. [Machine Learning, Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) is a flipped classroom, and each week's "required watching (before class)" is a set of MOOC videos.

This post is the series entry point. It covers the course structure, what outside learners can get, and the order to read things in. Each lecture gets its own post later.

**Sources**: the [MOOC page](https://www.csie.ntu.edu.tw/~htlin/mooc/) (footer: last updated 2024-08-30), the [Foundations](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) and [Techniques](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) YouTube playlists, the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) and its [policy.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf), the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and its homework PDFs, the [Coursera page for Foundations part 1](https://www.coursera.org/learn/ntumlone-mathematicalfoundations), and [NTU OpenCourseWare's note on Coursera's policy](https://ocw.aca.ntu.edu.tw/courses/mooc0016) (in Mandarin). I opened and checked all of them on 2026-09-30.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [Foundations: official free YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Techniques: official free YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)

On 2026-10-10 this was checked live against the official MOOC page and both playlists (65 videos each). This post is an overview with no single matching lecture, so no video is embedded.

Checked: 2026-10-10.

## Two MOOCs: seven questions, 32 lectures, 130 videos

Page 2 of [01_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf) describes Foundations as "foundation oriented" and "story-like," strung along four questions. Techniques is split by three ways of handling features. The Fall 2026 course page numbers these seven segments topic 1 through topic 7:

| Segment | Question (as on the slides) | Lectures | This series |
|---|---|---|---|
| Foundations 1 | When Can Machines Learn? | L1–L4 | [Post 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en), [Post 2](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en) |
| Foundations 2 | Why Can Machines Learn? | L5–L8 | [Post 3](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en), [Post 4](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en) |
| Foundations 3 | How Can Machines Learn? | L9–L12 | [Post 5](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), [Post 6](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en) |
| Foundations 4 | How Can Machines Learn Better? | L13–L16 | [Post 7](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en), [Post 8](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) |
| Techniques 1 | embedding numerous features (kernel models) | T1–T6 | [Post 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en), [Post 10](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en), [Post 11](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) |
| Techniques 2 | combining predictive features (aggregation models) | T7–T11 | [Post 12](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), [Post 13](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) |
| Techniques 3 | distilling hidden features (extraction models) | T12–T15 | [Post 14](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en), [Post 15](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) |
| Wrap-up | finale ("happy learning!") | T16 | [Post 16](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en) |

The MOOC page lists four section titles for each lecture, one video per section. Foundations L1 and Techniques T1 each add a "Course Introduction" video, so each playlist has 65 videos, 130 in total. The first Foundations video went up on 2015-12-09; the first Techniques video on 2016-02-14.

Slides come in two flavors: handout and presentation (step-by-step animation). Files are numbered `01`–`16` for Foundations and `201`–`216` for Techniques. Each course has a zip of all handouts ([Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip), [Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mltech_handout.zip)). The MOOC page says the slides are shared under CC-BY-NC 3.0, but the figures stay with their original copyright holders, in most cases the LFD authors. There is also an [errata page](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php).

The lectures are in Mandarin and the slides are in English. English readers can follow the slides directly; the audio is the barrier.

## Three version baselines

The same material now exists in three versions. Every post in this series says which one it cites:

| Layer | What it is | Status | What this series uses it for |
|---|---|---|---|
| MOOC | Recordings and slides for Foundations (16) and Techniques (16) | Recorded 2015–2016; MOOC page last updated 2024-08-30 | Core material |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | NTU course, Mondays 13:20–16:20, page says "English teaching"; grading 70% homework, 30% project (tentative) | Finished | Homework baseline: HW0–HW7 and final project PDFs are all public |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | NTU course, Wednesdays 9:10–12:10, "Mandarin teaching"; grading 30% homework, 30% exam, 40% project (tentative) | In progress, week 4 today | Current reference: watch lists, extended slides, hw0 and hw1 |

Fall 2024 homework lives on `hwN/` subpages of the course page, for example `hw1_red.pdf` on the [hw1 subpage](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/). Each set has 12 problems plus 1 bonus; the first 4 are auto-graded and the other 8 are graded by TAs. Most programming datasets come from [LIBSVM datasets](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/), such as `rcv1_train.binary` in HW1.

The [final project spec, final.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf), is set in a fictional baseball league called HTMLB. The task is to predict whether the home team wins, submitted to Kaggle in two stages, and the report must be written in English.

Rules from the Fall 2026 [policy.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf):

- About 6 homework sets, one every two weeks, each due two weeks after release. Late work loses 10% per 12 hours; each student gets 4 penalty-free half-days ("gold medals").
- Answers are multiple choice and auto-graded, but derivations must be uploaded for selective TA grading, and programming answers need source code. Answers without derivations or code get zero.
- AI tools are allowed as aids, but you may not submit their output directly. If generative AI wrote your code, you must comment it block by block in your own words.
- No midterm; there is a final exam (12/09 on the course page).

## Access grading: MOOC alone is A2; add Fall 2024 homework for A3

Grades follow the definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): A0 schedule visible, A1 syllabus visible, A2 materials partly open, A3 enough for self-study.

| Combination | Grade | Why |
|---|---|---|
| MOOC only | A2 | Recordings and slides are fully open, but exercises sit behind Coursera's paywall |
| MOOC + Fall 2024 course page | A3 (grading chain excluded) | HW0–HW7 problems and the final project spec are public; most datasets can be downloaded |
| Fall 2026, current term | A2 (in progress) | Slides for W1–W4, hw0, hw1 and `hw1_train.dat` are public; slide links from W5 on currently return 404 |

What outside learners cannot get, repeated in every homework section later in the series:

1. **No official solutions.** Gradescope auto-grading and TA grading are for enrolled students only.
2. **NTU COOL needs an NTU account.** Fall 2024 is [course 40495](https://cool.ntu.edu.tw/courses/40495); Fall 2026 is [course 63348](https://cool.ntu.edu.tw/courses/63348).
3. **The Kaggle final-project pages return 404.** The [stage 1](https://www.kaggle.com/competitions/html-2024-fall-final-project-stage-1) link in final.pdf returned 404 on 2026-09-30, possibly because the competition is private or removed. This series has not confirmed whether the data is still downloadable or late submissions are accepted.
4. **Fall 2026 is still running.** hw2–hw6, the final project, and slides from W5 on are not yet public.

## YouTube vs. Coursera after August 2025

The MOOC page offers two entry points per course: Coursera and free YouTube. On Coursera, Foundations is split in two: [part 1 (Mathematical Foundations)](https://www.coursera.org/learn/ntumlone-mathematicalfoundations) and [part 2 (Algorithmic Foundations)](https://www.coursera.org/learn/ntumlone-algorithmicfoundations). Techniques is [a third course](https://www.coursera.org/learn/machine-learning-techniques). The part 1 page says "There are 8 modules in this course."

The difference is the exercises. According to [NTU OpenCourseWare](https://ocw.aca.ntu.edu.tw/courses/mooc0016) (in Mandarin), Coursera replaced "Audit" with "Preview" worldwide starting August 2025. Free accounts can only watch the first module; the full course, including all modules, assignments, and assessments, requires a subscription or purchase. That note sits on a different NTU OCW course page and describes a platform-wide policy. Lin's Coursera pages do not mention it themselves.

So the practical choices today:

- **Just watch**: the YouTube playlists are enough. The videos match the Coursera versions and have no module limit.
- **Want exercises and a certificate**: pay for Coursera. This series did not open anything behind the paywall and does not describe those problems.
- **Want free exercises**: use the Fall 2024 homework PDFs. That is the baseline this series uses.

## Fall 2026 flipped classroom: the first four weeks of required watching

Each week on the Fall 2026 course page lists "required watching (before class)": one MOOC slide deck, LFD sections, and 3–5 YouTube videos. The four weeks published so far:

| Week | Required watching | LFD sections | Also published |
|---|---|---|---|
| W1 (09/09) | None; class is the course introduction | — | 00_handout, hw0 released |
| W2 (09/16) | L1 four videos, L2 four videos, first L3 video | 1.0, 1.1.1, 1.2.4; 1.1.2, 3.1; 1.2, 1.3 | 01e/02e/03e extended slides |
| W3 (09/23) | Last three L3 videos, four L4 videos, first L5 video | 1.2, 1.3; 1.3; 2.0, 2.1.1 | 03e/04e, Wolpert paper, hw1 released |
| W4 (09/30) | Last three L5 videos, four L7 videos, three L8 videos; the four L6 videos are "suggested watching (anytime)" | 2.0, 2.1.1; 2.2; 1.4 | 05e/07e |

Rows from W5 on only link to slides (for example `09u_handout.pdf`), which currently return 404, and have no video list yet. The course plan departs from the MOOC in a few places: T5–T6 and T14–T15 are not scheduled; W13 (12/02) has no class and points to the `mlmai.ics` slides instead; W14 is the final exam; W16 covers modern deep learning and the finale.

Class is streamed live to TAICA and the public via a [synchronous screencast](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/screencast.php), and there is an auditing request form. This series has not checked whether the streams leave complete recordings.

## Three self-study routes

**Route A: videos only (A2).** Watch the YouTube playlists in order with the handout slides. Every section ends with a "Fun Time" multiple-choice question, which works as a minimal self-check. Good for building intuition if you don't plan to do derivations.

**Route B: videos + Fall 2024 homework (A3, this series' main line).** Start with [Fall 2024 HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf) as a prerequisite check, and patch any gaps in combinatorics, probability, linear algebra, or calculus first. Then read this series one post per lecture; each post ends with the Fall 2024 problems that exercise that topic. There are no official solutions, so set up your own checks for programming problems, for example comparing numbers against the scikit-learn model of the same name.

**Route C: follow the Fall 2026 live stream.** Watch the videos on each week's required list, then do the current homework. hw0 and hw1 are both due 2026-10-21. Auditors can work to the same schedule but will not be graded.

As for prerequisites, the course needs first-year calculus, linear algebra, and probability. If probability is shaky, read this site's [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en) or the [statistics and ML series](/series/statistics-ml-ai) first.

## Posts in this series

| Order | Post | Lectures |
|---|---|---|
| 1 | [The Learning Problem, PLA, and Types of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) | Foundations L1–L3 |
| 2 | [Is Learning Feasible? Hoeffding and "Outside the Data"](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en) | Foundations L4 |
| 3 | [Training vs. Testing: Effective Hypotheses, Growth Function, and Break Point](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) | Foundations L5–L6 |
| 4 | [VC Dimension, Noise, and Error Measures](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en) | Foundations L7–L8 |
| 5 | [Linear Regression and Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) | Foundations L9–L10 |
| 6 | [Linear Classification, SGD, Multiclass, and Nonlinear Transforms](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en) | Foundations L11–L12 |
| 7 | [Overfitting and Regularization](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) | Foundations L13–L14 |
| 8 | [Validation and Three Learning Principles](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) | Foundations L15–L16 |
| 9 | [Linear SVM and Dual SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) | Techniques T1–T2 |
| 10 | [Kernel Trick and Soft-Margin SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) | Techniques T3–T4 |
| 11 | [Kernel Logistic Regression and Support Vector Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) | Techniques T5–T6 |
| 12 | [Blending, Bagging, and AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) | Techniques T7–T8 |
| 13 | [Decision Trees, Random Forests, and Gradient Boosted Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) | Techniques T9–T11 |
| 14 | [Neural Networks and Deep Learning](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en) | Techniques T12–T13 |
| 15 | [RBF Networks, k-Means, and Matrix Factorization](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) | Techniques T14–T15 |
| 16 | [Finale: Three Techniques, Plus Modern Deep Learning](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en) | Techniques T16 + Fall 2024 supplementary slides |
| 17 | [Foundations Homework Guide: Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en) | Maps to L1–L16 |
| 18 | [Techniques Homework and Final Project: HW6–HW7 and HTMLB](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en) | Maps to T1–T12 |

## What to do tonight

1. Open [Fall 2024 HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf) and give yourself one hour for the combinatorics and probability section. If you get stuck on two or more, brush up on probability before starting the videos.
2. Download the [Foundations handout zip](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip) and watch the [Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0) video.
3. Pick a route, then read [Post 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en).

## Further reading

These courses overlap with this series, but every post here stands on its own; these are links only:

- [NTU AI/ML course map](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en): places Lin's courses within NTU's offerings.
- [Reading NTU Hung-yi Lee's Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): NTU's parallel track, which starts from AI agents and leans toward deep learning and generative AI.
- [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): another take on SVMs, kernels, and learning theory.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): Abu-Mostafa's English course on the same textbook. The Fall 2024 course page puts his English Lecture 6 right next to Lin's Mandarin version.
- [CMU 10-301 guide](/posts/learning/2026-08-22-cmu-10301-overview-en), [Berkeley CS189 guide](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en): intro ML at other schools.

Next: [The Learning Problem, PLA, and Types of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Added the two official playlist links; this overview embeds no single video.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — 32-lecture outline, slides, license note
- [Machine Learning Foundations handout zip](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mlfound_handout.zip)
- [Machine Learning Techniques handout zip](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/mltech_handout.zip)
- [MOOC errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (65 videos, in Mandarin)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (65 videos, in Mandarin)
- [Lecture 1 slides, 01_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf) — course introduction and design
- [Coursera: Machine Learning Foundations part 1 (Mathematical Foundations)](https://www.coursera.org/learn/ntumlone-mathematicalfoundations)
- [Coursera: Machine Learning Foundations part 2 (Algorithmic Foundations)](https://www.coursera.org/learn/ntumlone-algorithmicfoundations)
- [Coursera: Machine Learning Techniques](https://www.coursera.org/learn/machine-learning-techniques)
- [NTU OpenCourseWare: note on Coursera platform changes](https://ocw.aca.ntu.edu.tw/courses/mooc0016) (in Mandarin) — the preview model since August 2025
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — course info, watch lists, course plan
- [Fall 2026 Course Policies (policy.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf)
- [Fall 2026 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf), [Homework 1 subpage](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — homework schedule and slides
- [Fall 2024 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf)
- [Fall 2024 Final Project (final.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf)
- [LIBSVM Data](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) — source of the Fall 2024 programming datasets
- [Learning from Data textbook site](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- On this site: [Global AI/CS course map (A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- On this site: [NTU AI/ML course map](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
