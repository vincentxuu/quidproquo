---
title: "Reading Stanford CS231N: Overview and a Self-Study Plan (Spring 2026)"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, course-guide]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 0
tldr: "CS231N is Stanford's deep learning course for computer vision. For Spring 2026, slides for 16 lectures, all three assignment pages with starter code, the course notes, and the project spec are public, so this series rates it A3 (enough to self-study). There are three gaps: the 2026 recordings are Canvas-only, L17 and L18 have no slides, and the midterm is not public. You can pair the 2026 slides and assignments with the 2025 YouTube recordings and follow the official calendar over 10 weeks."
description: "Series overview for Stanford CS231N: Deep Learning for Computer Vision (Spring 2026), built from the official home page, schedule, assignment pages, project page, the cs231n.github.io notes, and the Spring 2025 YouTube playlist: what the course covers, grading and prerequisites, what outside readers can actually get, how the 2026 materials line up with the 2025 recordings, and a 10-week self-study plan that follows the official calendar."
draft: false
glossary:
  - term: "A3 (self-study ready)"
    definition: "One of the access levels in this site's course map: systematic materials plus assignments and the files they need are public, so you can work through the course in order."
    context: "CS231N Spring 2026 is rated A3, although its public recordings come from a different year than its 2026 materials."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-course-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Source years**: slides and assignments are from Spring 2026; recordings are from Spring 2025 (YouTube). They may differ, and the differences are flagged below. This is post 0 of the Reading Stanford CS231N series and its entry point.

[CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) is Stanford's computer vision course. When I opened the home page on September 30, 2026, its header read "Stanford - Spring 2026", and it listed five instructors: Fei-Fei Li, Ehsan Adeli, Justin Johnson, Zane Durante, and Tiange Xiang.

The course description centers on end-to-end learning. Over 10 weeks, students implement and train their own neural networks and learn to read current computer vision research. The home page also runs a small CNN in your browser that classifies CIFAR-10 images live, with the line "By the end of the class, you will know exactly what all these numbers mean."

This post answers three questions: what the course teaches, what outside readers can actually get, and how to fit it into 10 weeks.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding. Rechecked live on 2026-10-10: the official Spring 2026 schedule lists no recording links, no public Spring 2026 playlist was found, and the Spring 2025 playlist has no single lecture matching this article’s scope. Checked: 2026-10-10.

Course and recording entries:

- [Stanford CS231N Deep Learning for Computer Vision I 2025 (YouTube playlist)](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The hard facts

**Meeting times**: Tuesdays and Thursdays, 12:00–1:20 PM Pacific, in NVIDIA Auditorium, plus Friday discussion sections.

**Grading** (Coursework section of the [home page](https://cs231n.stanford.edu/)):

| Component | Weight | Breakdown |
|---|---|---|
| Assignments | 45% | A1 12%, A2 18%, A3 15% ([assignments page](https://cs231n.stanford.edu/assignments.html)) |
| Midterm | 20% | In class on May 12; details announced on Ed |
| Final project | 35% | Proposal 1%, three milestones at 3% each, final report 20%, poster 5% ([project page](https://cs231n.stanford.edu/project.html)) |
| Participation | up to 3% extra credit | The most commended student gets the full 3%; others get a proportional share |

The grading slide in Lecture 1 marks the midterm as "New". Students get 4 free late days for the quarter, at most 2 per assignment, and 25% off for each day after that. Late days cannot be used on the final report.

**Prerequisites** (Prerequisites section of the home page):

- Proficiency in Python; assignments use numpy
- College calculus and linear algebra (for example MATH 19 and MATH 51): you should be comfortable taking derivatives and reading matrix-vector notation
- Basic probability and statistics (for example [CS109](/posts/learning/2026-08-21-stanford-cs109-probability-en)): an intuitive grasp of Gaussians, means, and standard deviations

**Assignment policy**: the assignments page says outright that solutions from past offerings are posted online and that staff know about them. Generative AI is treated like a collaborator: you must note how you used it, and using it to "substantially complete" parts of an assignment violates the Honor Code. The Lecture 1 slides are blunter. Rule 4 reads "Do not submit AI-generated responses."

## The schedule: 18 lectures in three units

The [official schedule](https://cs231n.stanford.edu/schedule.html) runs from March 31 to June 10 with 18 lectures in three units:

1. **Deep Learning Basics** (L2–L4): image classification and linear classifiers, regularization and optimization, neural networks and backpropagation
2. **Perceiving and Understanding the Visual World** (L5–L11): CNNs, CNN architectures, RNNs, attention and Transformers, detection/segmentation/visualization, video understanding, large-scale distributed training
3. **Generative and Interactive Visual Intelligence** (L12–L18): self-supervised learning, two lectures on generative models, 3D vision, vision and language, World Modeling (guest lecturer Gordon Wetzstein), Human-Centered AI

The official materials don't agree on how to cut the units. The overview slide in Lecture 1 lists four blocks, adding "Human-Centered Applications and Implications". The closing slide of the same deck splits the course into L2–4, L5–12, L13–17, and L18. This series follows the schedule.

There are six discussion sections: Python/Numpy, Backprop, the final project overview, PyTorch, RNNs & Transformers, and a midterm review.

## What outside readers get: A3, with three gaps

This site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) grades access as A0 (schedule visible), A1 (syllabus visible), A2 (materials partly open), and A3 (enough to self-study). CS231N Spring 2026 rates **A3**:

| Material | Status (checked 2026-09-30) |
|---|---|
| Slides | L1 (two decks) through L16 download from the schedule, plus three section decks (Backprop, Project, RNNs & Transformers) |
| Assignment pages | [A1](https://cs231n.github.io/assignments2026/assignment1/), [A2](https://cs231n.github.io/assignments2026/assignment2/), and [A3](https://cs231n.github.io/assignments2026/assignment3/) are public, each with downloadable Colab starter code |
| Course notes | The long-form notes at [cs231n.github.io](https://cs231n.github.io/), linked lecture by lecture from the schedule |
| Project spec | The [project page](https://cs231n.stanford.edu/project.html) lists the weight and date of every deliverable, with reports from past years |
| Recordings | The [Spring 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16) on the Stanford Online channel, 18 videos |

There are three gaps, and every post in this series repeats them:

- **The 2026 recordings are on Canvas only.** The home page says they go under Canvas's "Panopto Course Videos" tab for enrolled students. Recordings from past years are on YouTube, but they are "not reflective of this offering".
- **L17 and L18 have no 2026 slides.** The schedule has no slides link for either, and guessing the URL from the pattern returns 404.
- **The midterm, Ed, and Gradescope are closed.** Outside readers can't see exam questions, forum threads, the autograder, or grades.

So you can do the programming assignments on your own, but there is no official autograder to check against. You rely on the check cells built into each notebook and on numerical gradient checks.

## Lining up the 2026 materials with the 2025 recordings

The [Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html) has almost the same 18 lecture titles as 2026. The one clear difference is L17: "Robot Learning" in 2025, "World Modeling" in 2026.

Keep a few things in mind when you pair them:

- **The recordings are from 2025.** Every video title in the playlist says "Spring 2025". This series takes its content from the 2026 slides and treats the videos as listening aids. I did not compare each video against the 2026 slides.
- **L17 is a different topic.** The 2025 L17 video teaches robot learning, not world modeling. The last post in this series keeps the two apart.
- **The 2026 slides carry over material from earlier years.** The L7 cover is dated 2025, and so is the footer on page 1 of Lecture 1 part 1. That only shows the files were reused. It says nothing about how much changed.
- **The assignment pages disagree slightly.** The assignments overview lists "Network Visualization" under A2, but the A2 page itself has five questions (BatchNorm, Dropout, CNNs, PyTorch on CIFAR-10, RNN captioning) and no visualization. Go by the assignment page.

## A 10-week self-study plan

The official quarter runs from March 31 to June 10, exactly 10 weeks. The plan below follows the official pace. Assignment dates are the official 2026 due dates; use them as checkpoints.

| Week | Lectures | Assignments and project | Posts in this series |
|---|---|---|---|
| 1 | L1 introduction, L2 image classification | Python/Numpy tutorial; start A1 (released 4/2) | [L1](/posts/ai/2026-09-30-cs231n-intro-vision-history-en), [L2](/posts/ai/2026-09-30-cs231n-image-classification-linear-en) |
| 2 | L3 regularization and optimization, L4 backprop | Work the Backprop section example; A1 Q1–Q3 | [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization-en), [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) |
| 3 | L5 CNNs, L6 training CNNs and architectures | Finish A1 (officially due 4/16); think about a project | [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en), [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en), [L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) |
| 4 | L7 RNNs, L8 attention and Transformers | Write a project proposal (officially due 4/23); start A2 | [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en), [L8](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) |
| 5 | L9 detection/segmentation/visualization, L10 video | A2 Q1–Q3 | [L9](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en), [L10](/posts/ai/2026-09-30-cs231n-video-understanding-en) |
| 6 | L11 distributed training, L12 self-supervised learning | Finish A2 (officially due 5/8); the official midterm follows this week | [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en), [L11](/posts/ai/2026-09-30-cs231n-distributed-training-en), [L12](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) |
| 7 | L13 generative models I, L14 diffusion | Start A3 (released 5/14); project milestone 1 | [L13](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en), [L14](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en) |
| 8 | L15 3D vision, L16 vision and language | A3 Q1–Q3; project milestone 2 | [L16](/posts/ai/2026-09-30-cs231n-vision-language-en), [L15](/posts/ai/2026-09-30-cs231n-3d-vision-en) |
| 9 | L17, L18 (2025 videos only) | Finish A3 (officially due 5/28); project milestone 3 | [A3](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en) |
| 10 | — | Final report and poster | [Wrap-up and project](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project-en) |

The post order differs from the schedule in three places. Each assignment post comes right after the last lecture it depends on. L15 moves after A3 so that generative models, multimodal models, and A3 read as one run. L17 and L18 have no 2026 slides, so they share one closing post.

**Where to start**: tonight, open the [A1 page](https://cs231n.github.io/assignments2026/assignment1/), download the starter code, switch the Colab runtime version to "2025.07" as the page instructs, and run the first cell of knn.ipynb. Once that works, read [L1](/posts/ai/2026-09-30-cs231n-intro-vision-history-en).

## Series contents

| order | Post |
|---|---|
| 0 | Overview and self-study plan (this post) |
| 1 | [L1: Where computer vision came from, and where this course is going](/posts/ai/2026-09-30-cs231n-intro-vision-history-en) |
| 2 | [L2: Image classification, kNN, and linear classifiers](/posts/ai/2026-09-30-cs231n-image-classification-linear-en) |
| 3 | [L3: Regularization and optimization](/posts/ai/2026-09-30-cs231n-regularization-optimization-en) |
| 4 | [L4: Neural networks and backpropagation](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) |
| 5 | [A1: kNN, Softmax, a two-layer net, and fully connected nets](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) |
| 6 | [L5: Image classification with CNNs](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) |
| 7 | [L6: Training CNNs and classic architectures](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) |
| 8 | [L7: Recurrent neural networks and image captioning](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en) |
| 9 | [A2: BatchNorm, Dropout, CNNs, PyTorch, and RNN captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) |
| 10 | [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) |
| 11 | [L9: Object detection, segmentation, and visualization](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en) |
| 12 | [L10: Video understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en) |
| 13 | [L11: Large-scale distributed training](/posts/ai/2026-09-30-cs231n-distributed-training-en) |
| 14 | [L12: Self-supervised learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) |
| 15 | [L13: Generative models I: VAEs, GANs, and autoregressive models](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en) |
| 16 | [L14: Generative models II: diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en) |
| 17 | [L16: Vision and language](/posts/ai/2026-09-30-cs231n-vision-language-en) |
| 18 | [A3: Transformer captioning, SSL, DDPM, CLIP and DINO](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en) |
| 19 | [L15: 3D vision](/posts/ai/2026-09-30-cs231n-3d-vision-en) |
| 20 | [Wrap-up: World Modeling / Robot Learning, Human-Centered AI, and the final project](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project-en) |

## Further reading

- [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): machine learning background for linear classifiers, softmax, and maximum likelihood
- [CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en) and [MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en): deep learning courses that aren't limited to vision
- [Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) and [Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): the language-model side of Transformers and large-scale training
- [CS230: adversarial examples and generative models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en)
- [Berkeley CS285](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en): for readers who want to go on to robot learning

**Series navigation**: Next: [L1: Where computer vision came from, and where this course is going](/posts/ai/2026-09-30-cs231n-intro-vision-history-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Rechecked official sources; there is still no public recording matching this article, and a check date was added.

## References

- [CS231n home page (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231n schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html)
- [CS231n assignments page](https://cs231n.stanford.edu/assignments.html)
- [CS231n final project page](https://cs231n.stanford.edu/project.html)
- [Assignment 1 (2026)](https://cs231n.github.io/assignments2026/assignment1/)
- [Assignment 2 (2026)](https://cs231n.github.io/assignments2026/assignment2/)
- [Assignment 3 (2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [CS231n course notes (cs231n.github.io)](https://cs231n.github.io/)
- [Lecture 1 Part 2 slides: Overview (2026)](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf)
- [CS231n Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N Deep Learning for Computer Vision I 2025 (YouTube playlist)](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
