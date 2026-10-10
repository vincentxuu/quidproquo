---
title: "Reading MIT 6.5940: Song Han's Efficient AI Course Skipped a Year, So This Series Is Built on Fall 2024"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantization, edge-ai, llm-inference]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 0
tldr: "MIT 6.5940 (TinyML and Efficient Deep Learning Computing) teaches how to make models smaller and faster so they fit on laptops, phones, and microcontrollers: pruning, quantization, NAS, distillation, LLM deployment, and distributed training. It was not offered in Fall 2025 because Song Han was on sabbatical, and the 2025 course URL returns 404. Fall 2026 is running, but as of 2026-09-30 only L1–L6 and Labs 0–1 are out. This series therefore follows Fall 2024, the latest complete edition: 23 slide decks, 23 videos, and Labs 0–5 are all public (A3). Fall 2026 is graded A2 and compared in every post."
description: "Entry point for the MIT 6.5940 series: what the course covers, how open Fall 2024 and Fall 2026 are (A3 / A2), grading and lab structure, a table of schedule changes between the two editions, gaps for self-learners, and three reading routes. Every fact comes from the two official course pages, slide PDFs, and lab files."
draft: false
glossary:
  - term: "sabbatical"
    definition: "A period in which a professor pauses teaching to focus on research."
    context: "The Fall 2024 course page states that 6.5940 was not offered in Fall 2025 because Song Han was on sabbatical. That is why this series uses Fall 2024."
  - term: "EfficientML.ai"
    aliases: ["efficientml.ai"]
    definition: "The course brand and URL of MIT 6.5940. It redirects to MIT HAN Lab's course page, and every lecture video title starts with \"EfficientML.ai Lecture N\"."
    context: "The slide covers and video titles cited in this series use this name."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

[MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) is a graduate course taught by [Song Han](https://songhan.mit.edu). His slide covers list him as Associate Professor at MIT and Distinguished Scientist at NVIDIA. The course URL, [efficientml.ai](https://efficientml.ai), redirects to MIT HAN Lab's [course page](https://hanlab.mit.edu/course). The course tackles a practical problem: models grow faster than hardware, so how do you compress and speed them up enough to run on a laptop, a phone, or a microcontroller with a few hundred KB of memory?

The Fall 2024 course description lists model compression, pruning, quantization, neural architecture search, distributed training, data/model parallelism, gradient compression, and on-device fine-tuning, plus acceleration techniques for LLMs and diffusion models. It also promises a concrete hands-on result: students deploy Llama2-7B on their own laptop.

This post is the entry point to the series. It answers four questions: what the course teaches, why this series uses Fall 2024 instead of the newest edition, what outside readers can actually get, and how to read it.

## Course video sources
This article covers multiple lectures; choose recordings by topic and lecture from the official index. Rechecked against the live official pages on 2026-10-10: the Fall 2024 page lists public YouTube recordings for Lectures 1–23 (Lectures 24–26 are final-project presentations with no recording listed); the Fall 2026 page currently lists recordings for Lectures 1–8. Per-lecture videos are embedded in each lecture article.

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)
- [mit-6-5940 Fall 2026 — official course page](https://hanlab.mit.edu/courses/2026-fall-65940)

Checked: 2026-10-10.

## The hard facts

| Item | Fall 2024 (series backbone) | Fall 2026 (in progress) |
|---|---|---|
| Title | TinyML and Efficient Deep Learning Computing | TinyML and Efficient AI Computing |
| Course page | [2024-fall-65940](https://hanlab.mit.edu/courses/2024-fall-65940) | [2026-fall-65940](https://hanlab.mit.edu/courses/2026-fall-65940) |
| Prerequisites | 6.191 Computation Structures and 6.390 Intro to Machine Learning; students without them are de-registered in week two, with a petition option | Same two subjects; the page says no prerequisite waivers and no cross-registration |
| Lectures | 23, plus 3 final project presentation sessions (Dec 3, 5, 10) | 22 (the last is a Guest Lecture), plus 3 presentation sessions (Dec 3, 8, 10) |
| Exams | None; the page says the class "does not have any tests or exams" | Same |
| Videos | 23, on the [MIT HAN Lab YouTube channel](https://www.youtube.com/c/MITHANLab), entry point [live.efficientml.ai](https://live.efficientml.ai/) | Uploaded as the term runs; L1–L6 as of 2026-09-30 |
| Submission / discussion | Canvas and Piazza (enrolled MIT students only) | Same |

The course page calls it a "PhD level course." It sets two goals: understand efficient deep learning techniques, and be able to deploy an LLM on your own laptop.

## Why Fall 2024 is the backbone

This site's course guides normally follow the latest complete edition from 2025–2026. 6.5940 has no complete edition in that window:

1. **Fall 2025 was cancelled.** The "Time" field on the Fall 2024 page now reads: "The course will not be offered in Fall 2025 due to Prof. Han is on sabbatical." Opening `hanlab.mit.edu/courses/2025-fall-65940` returns HTTP 404. The "Previous Courses" list at the bottom of the page shows only three 6.5940 editions (2026, 2024, 2023) plus its 2022 predecessor, 6.S965.
2. **Fall 2026 is not finished.** Its schedule runs to December 10. As of 2026-09-30, L1–L6 have slides and videos, and Labs 0 and 1 are out. From L7 on, the Slides and Video links are still empty.

So this series uses Fall 2024, the latest complete edition. Each post has a "Fall 2026 comparison" section that lists the matching new material and what changed. As later Fall 2026 lectures appear, they will be added to each post through an update log. The post order stays the same.

## Openness: Fall 2024 is A3, Fall 2026 is A2

The grades follow the A0–A3 definitions in this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

**Fall 2024: A3 (enough to self-study).** Every lecture on the course page links to Dropbox slides and a YouTube video. Labs 0–4 are public Colab notebooks, Lab 5 is a public Google Drive folder, and the final project list is a public Google Doc. You get systematic material plus the assignment files, which meets A3.

A3 still has gaps. Know these before you start:

- **No official solutions.** Labs are submitted on Canvas, so outside readers get no grading feedback and have to check their work against the slides.
- **The four "Chapter" slots are empty.** Chapter I–IV on the schedule (Sep 11, Oct 16, Nov 11, Nov 20) are section markers with empty Slides and Video links.
- **L22 only has summary slides.** L22 is titled "Course Summary + Quantum Machine Learning I," but its slide link is the 13-page Course-Summary.pdf, which has no quantum ML content. Quantum ML Part I exists only as video.
- **Final presentations were not recorded.** None of the three presentation sessions has a link.

**Fall 2026: A2 (partly open).** Slides and videos appear as the term runs, currently through L6. The course page says it does not accept cross-registered students.

## Grading and labs

Fall 2024 grading, from the course page:

| Item | Weight |
|---|---|
| 5 labs | 15% each, 75% total |
| Final project | 25% (Proposal 5% + Presentation and Final Report 20%) |
| Participation Bonus | 4% (end-of-term course survey) |

Other rules: labs are individual, though discussing them is allowed if you name your collaborators. There are 6 penalty-free late days for the whole term. You must turn in at least 4 of the 5 labs to pass. On team size, the course page says groups of 4 or 5, while slide 89 of Lecture 1 says "group of 3-4," so the two official sources disagree. The report is 4 pages in the NeurIPS template, and slide 11 of the [Course Summary deck](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0) also asks for a GitHub link to open-source the code. The [project list](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA) was released on 2024-10-24.

Fall 2024 labs:

| Lab | Topic | Lectures |
|---|---|---|
| Lab 0 | PyTorch tutorial | L2 |
| Lab 1 | Pruning | L3–L4 |
| Lab 2 | Quantization | L5–L6 |
| Lab 3 | Neural architecture search | L7–L8 |
| Lab 4 | LLM compression | L13 |
| Lab 5 | LLM deployment on laptop | L13 |

Slide 88 of Lecture 1 lists the minimum hardware for Lab 5: macOS, Linux, or Windows; an x86 or ARM (Apple M1/M2) processor; 8 GB of memory; 5 GB of free storage.

Fall 2026 grading is not on the course page. It appears only on slide 88 of the [Fall 2026 Lecture 1 deck](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0): 5 labs at 14% each, a 30% final project (Proposal 5% + Presentation and Final Report 25%), and a Class Survey Bonus with no stated weight.

## What changed from Fall 2024 to Fall 2026

This table lists only differences that the two course pages and slide decks confirm directly.

| Item | Fall 2024 | Fall 2026 |
|---|---|---|
| L1–L6 | Introduction, Basics, Pruning I/II, Quantization I/II | Same topics; the L2 Lecture Plan adds a CNN architecture review (AlexNet, VGG-16, ResNet-50, MobileNetV2) |
| L13 | Efficient LLM Deployment | LLM Quantization and Deployment |
| L17–L18 | GAN, Video, and Point Cloud; Diffusion Model | Diffusion Model Part I and Part II |
| End of term | L22 Course Summary + Quantum ML I; L23 Quantum ML II | Dec 1 Guest Lecture (speaker and topic not announced) |
| Lab 1 | Pruning | GPU Basics (titled "Lab1: Efficient AI Fundamentals" inside the zip) |
| Lab 2, Lab 4 | Quantization; LLM compression | Course page: Quantization, Quantization. L1 slides: Pruning, Quantization |
| Grading | Labs 15% × 5, project 25%, bonus 4% | Labs 14% × 5, project 30%, survey bonus |

The Lab 2 row needs a note. The Fall 2026 course page lists "Lab2: Quantization" and "Lab4: Quantization," so Quantization appears twice in the same list. Slides 87 and 89 of Lecture 1 say "Lab 2 — Pruning" instead. The two official sources contradict each other, and this series will not guess. It will update once Lab 2 is actually released. Until then, readers who want to practice pruning should use Fall 2024 Lab 1.

Fall 2026 Lab 1 can already be confirmed. Its [README](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1) lists five parts: latency and MAC/FLOPs/I/O, the roofline model, a Gemma-3 decoder layer case study (prefill vs. decode), PyTorch Profiler and kernel fusion, and Flash Attention. It is worth 80 points plus 20 bonus points. Part 5 needs an A100 GPU on Colab. Fall 2024 had no GPU profiling lab like this, so the series gives it a separate supplementary post.

## Course map: four chapters

The schedule uses four chapter markers to group the 23 lectures:

| Chapter | Lectures | Topics |
|---|---|---|
| Chapter I: Efficient Inference | L3–L11 | Pruning, quantization, NAS, knowledge distillation, MCUNet, TinyEngine |
| Chapter II: Domain-Specific Optimization | L12–L18 | Transformers and LLMs, LLM deployment, post-training, long context, ViT, GAN/video/point cloud, diffusion |
| Chapter III: Efficient Training | L19–L21 | Distributed training, on-device training and transfer learning |
| Chapter IV: Advanced Topics | L22–L23 | Course summary, quantum ML |

L1–L2 come before Chapter I and supply the motivation and the measuring tools. Slides 6–7 of the Course Summary deck cut the material another way: Efficient Inference, Efficient Training, and Application-Specific Optimizations, placed on an Algorithm axis and a System axis. The course teaches algorithms and systems together, and that is its biggest difference from a typical deep learning course.

## Series contents

The series has 25 posts (order 0–24). There are more posts than lectures because the pruning, quantization, and NAS labs are large enough to get their own posts.

| Order | Post | Material |
|---|---|---|
| 0 | This post: series entry | Both course pages |
| 1 | [Why efficiency matters and how to measure model size and compute](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) | L1, L2, Lab 0 |
| 2 | [Pruning I: granularity and criteria](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) | L3 |
| 3 | [Pruning II: per-layer ratios and hardware support](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en) | L4 |
| 4 | [Lab 1: fine-grained and channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en) | F24 Lab 1 |
| 5 | [Quantization I: number formats and basic quantization](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) | L5 |
| 6 | [Quantization II: PTQ, QAT, and mixed precision](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) | L6 |
| 7 | [Lab 2: k-means and linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en) | F24 Lab 2 |
| 8 | [NAS I: search space and search strategy](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en) | L7 |
| 9 | [NAS II: hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en) | L8 |
| 10 | [Lab 3: searching subnets under constraints](/posts/ai/2026-09-30-mit-65940-lab3-nas-en) | F24 Lab 3 |
| 11 | [Knowledge distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en) | L9 |
| 12 | [MCUNet: neural networks on microcontrollers](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) | L10 |
| 13 | [TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) | L11 |
| 14 | [Bridge: Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) | L12 |
| 15 | [LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) | L13 |
| 16 | [Labs 4 + 5: AWQ and an LLM on your laptop](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) | F24 Labs 4 and 5 |
| 17 | [Fall 2026 supplement: Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) | F26 Lab 1 |
| 18 | [LLM post-training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) | L14 |
| 19 | [Long-context LLMs](/posts/ai/2026-09-30-mit-65940-long-context-llm-en) | L15 |
| 20 | [Efficient vision: ViT, GANs, video, point clouds](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en) | L16, L17 |
| 21 | [Accelerating diffusion](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en) | L18 |
| 22 | [Distributed training](/posts/ai/2026-09-30-mit-65940-distributed-training-en) | L19, L20 |
| 23 | [On-device training](/posts/ai/2026-09-30-mit-65940-on-device-training-en) | L21 |
| 24 | [Course summary and quantum ML](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml-en) | L22, L23 |

## Three reading routes

**The full route.** Read orders 0–24 in sequence, with each lecture's slides and video, and do each lab when you reach its post. Fall 2024 released a lab every two or three lectures. At that pace the route takes about a semester.

**LLM efficiency only.** Read order 1 (the measuring tools) → 5 and 6 (quantization basics, needed for AWQ) → 14 → 15 → 16 → 17 → 19. You can skip pruning and NAS for now and come back to order 2 when you reach LLM sparsity.

**TinyML and edge devices.** Read order 1 → 2, 3, 4 → 5, 6, 7 → 8, 9, 10 → 12 → 13 → 23. This is Chapter I plus on-device training, focused on design under KB-scale memory limits.

## Before you start

- **Python and PyTorch.** Lab 0 is a PyTorch tutorial. If it feels hard, catch up first.
- **Backpropagation and CNNs.** L2 only reviews terms and layer shapes; it does not teach how training works. If that is new to you, read the [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) or the [CMU 11-785 guide](/posts/ai/2026-08-22-cmu-11785-course-overview-en) first.
- **Basic computer architecture.** The 6.191 prerequisite is a computer architecture course, and TinyEngine, SIMD, and the memory hierarchy come up later.
- **A Google account.** Labs 0–4 run on Colab.

## Further reading

These site series overlap with 6.5940. This series still covers the overlapping material in full; the links are for readers who want another angle:

- [MIT AI/ML course map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en): where 6.5940 sits in MIT's curriculum
- [Stanford CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en) and [inference](/posts/ai/2026-08-22-cs336-inference-en): hardware and inference from a language-model course
- [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) and [Stanford CME295 guide](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en): how Transformers and LLMs work
- [Stanford CS231N guide](/posts/ai/2026-09-30-cs231n-course-overview-en): ViTs and computer vision
- [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en): the theory of diffusion and flow matching

**Series navigation**: Next: [Why efficiency matters and how to measure model size and compute](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official entry: per-lecture recordings are listed there and embedded in each lecture article; the status stays “Official entry or recording index only.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [MIT 6.5940 Fall 2023 course page](https://hanlab.mit.edu/courses/2023-fall-65940)
- [EfficientML.ai video entry point (MIT HAN Lab YouTube)](https://live.efficientml.ai/)
- [Fall 2024 Lecture 1 slides: Introduction](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Fall 2024 Course Summary slides](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)
- [Fall 2026 Lecture 1 slides: Introduction](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)
- [Fall 2026 Lab 1 archive (lab1_gpu_basics.zip)](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1)
- [Fall 2024 final project list](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA)
- [Fall 2024 Lab 0: PyTorch Tutorial (Colab)](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [Fall 2024 Lab 5 folder (Google Drive)](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0)
- [Global AI/CS course map: A0–A3 definitions](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
