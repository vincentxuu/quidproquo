---
title: "From Linear Regression to Training Reasoning Models: A Course Map and Reading Routes | Stanford CS229 Course Overview"
date: 2026-08-21
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, self-study]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 0
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 9
tldr: "CS229 is the Stanford course that works through the mathematical derivations of machine learning. The Spring 2026 recordings make 17 lectures public: the first ten cover linear models, neural networks, and unsupervised learning, and the last seven go on to diffusion models, LLMs, and training reasoning models with reinforcement learning. This series has one post per lecture, and this post is the map: what each lecture actually teaches, where the video titles don't match, and where to pick up what the lecture notes cover but the lectures skipped."
description: "An overview of Stanford CS229: Machine Learning: what the 17 public Spring 2026 lectures actually cover and which lecture-note chapters they map to, the gaps in the video numbering and titles, the prerequisites and how to test yourself, the problem sets you can still get, and reading routes for self-study."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

**Video status: Videos included.** This post is the overview of the whole course. The video embedded below is Spring 2026 Lecture 1 (the course introduction); the recording for each lecture sits at the top of that lecture's guide.

[CS229: Machine Learning](https://cs229.stanford.edu/) is the main machine learning course in Stanford's computer science department, cross-listed in statistics as STATS 229. Its subject is derivation: which probabilistic assumption a model's loss function comes from, how to compute the gradient, and why the algorithm converges. Plenty of people can call a library to train a model. This course wants you to be able to write out the equations yourself.

This series follows the Spring 2026 recordings that Stanford Online made public, one post per lecture, 17 lectures in all. Each post opens with that lecture's video, the body walks through the derivations in the order the lecture takes them, adds one example you can work by hand, and ends with the matching chapters of the lecture notes. This overview helps you decide three things: whether the course suits you right now, what each of the 17 lectures teaches, and where to start.

```youtube
url: https://www.youtube.com/watch?v=DATnpGoGhM8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction
captions: en
```

## Who this course is for

The course site lists three prerequisites. All three are phrased as "equivalent to", so you don't need to have taken those course numbers:

- You can write a non-trivial program in Python and NumPy (the level of CS106A or CS106B)
- Probability theory (the level of CS109 or MATH151)
- Multivariable calculus and linear algebra (the level of MATH51 or CS205L)

In practice, what stops people most often is the notation for matrix derivatives and conditional probability. The lecturer of Lecture 2 frames that session as a "notation lecture" and says every later lecture will assume you know it. So the fastest way to judge whether you can take the course is to go straight to the normal equations section of [Lecture 2](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en): if you can follow every step from $J(\theta) = \frac{1}{2}(X\theta - y)^T(X\theta - y)$ to $X^TX\theta = X^Ty$, you can handle the mathematical density.

Stanford Online also gives an official self-test: before enrolling, look at [Problem Set 1 from the 2008 public course](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf), and if it looks too hard, the course is too hard for you. The first problem in that set asks you to compute the Hessian of the least-squares cost function and then prove that Newton's method converges in one step; Newton's method and the Hessian are taught in [Lecture 3](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en). Reading a post tells you whether you can keep up. Doing that problem set tells you whether you can do the work yourself, and it is the more accurate test.

If what you want is hands-on experience getting deep learning models to train and debugging them, CS230 is the better fit. The relationship between the two courses is covered near the end of this post.

## What each of the 17 lectures teaches

Spring 2026 is taught by Tengyu Ma and Chris Ré, who split the lectures between them. Lecture 1 is Ma's opening session. Ré teaches Lectures 2 through 6 and Lectures 9 and 10, and at the end of Lecture 10 he says it is his last class of the quarter. The remaining lectures are Ma's.

The "Actual content" column in the table below is compiled from each lecture's transcript. It does not always match the video title on YouTube; the next section explains the gaps.

| Lecture | Guide | Actual content | Lecture notes |
|---|---|---|---|
| 1 | [What machine learning learns](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction-en) | Course introduction, definitions of machine learning, supervised / unsupervised / reinforcement learning | Tour of the whole book |
| 2 | [The supervised learning setup and linear regression](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en) | Hypothesis function, least-squares cost, gradient descent, minibatch SGD, normal equations | Chapter 1 |
| 3 | [Maximum likelihood and logistic regression](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en) | Probabilistic interpretation of linear regression, logistic regression, Newton's method | Chapters 1–2 |
| 4 | [The exponential family, generalized linear models, and softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en) | Exponential family, GLMs, multiclass softmax, cross-entropy and label smoothing | Chapters 2–3 |
| 5 | [Gaussian discriminant analysis and Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en) | Generative vs. discriminative, multivariate Gaussian, GDA, Naive Bayes | Chapter 4 |
| 6 | [Bias and variance, regularization, and model selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) | Bias–variance decomposition, ridge regression, double descent, cross-validation | Chapters 8–9 |
| 7 | [Neural network architecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) | Training framework for nonlinear models, fully connected networks, residual connections, normalization layers | Chapter 7 |
| 8 | [Backpropagation](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en) | Why computing the gradient is as fast as one forward pass, the backward of each module | Chapter 7 |
| 9 | [k-means and Gaussian mixture models](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en) | k-means, GMM, latent variables, Jensen's inequality | Chapters 10–11 |
| 10 | [The EM algorithm and PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en) | ELBO and the monotonicity of EM, applying it back to GMM, PCA | Chapters 11–12 |
| 11 | [Diffusion models](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en) | Forward noising, reverse denoising, writing the training objective with the ELBO | Chapter 14 |
| 12 | [The noise-prediction loss of diffusion models, foundation models, and LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en) | Simplifying the diffusion loss, pretraining plus adaptation, linear probe, finetune, LoRA | Chapters 14–15 |
| 13 | [Contrastive learning and semantic search](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en) | Representation learning, contrastive loss, semantic search, RAG | Chapter 16 |
| 14 | [Large language models](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) | Tokenization, next-token loss, how attention is computed | Chapter 17 |
| 16 | [Attention variants, MoE, and prompting](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en) | KV cache, grouped-query attention, MoE, in-context learning, SFT | Chapter 17 |
| 18 | [Reinforcement learning basics and policy gradient](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en) | MDPs, value functions, Bellman equations, deriving the policy gradient | Chapters 19, 21 |
| 20 | [Baselines, PPO, and verifiable rewards](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning-en) | Finishing policy gradient, PPO, training long chains of thought with reinforcement learning | Chapters 18, 21 |

The course falls into three stretches.

**Lectures 2 through 6 practice one recipe over and over.** Write down a probabilistic model of the data, take the log-likelihood, and maximize it. Linear regression, logistic regression, GLMs, and GDA are all this procedure with a different distribution swapped in. Lecture 6 turns around and asks why doing as well as possible on the training set doesn't guarantee doing well on new data.

**Lectures 7 through 10 replace two assumptions.** Lectures 7 and 8 swap the linear model for a neural network; the price is that there is no closed-form solution, and the gradient has to come from backpropagation. Lectures 9 and 10 take the labels away and bring in latent variables and EM. The ELBO derived in Lecture 10 is the foundation for the diffusion models that come later.

**From Lecture 11 on, the material entered the course only in the last few years.** Diffusion models, pretraining and adapting foundation models, contrastive learning, the training objective and architecture of LLMs, and finally two lectures of reinforcement learning that end on how to train a model that reasons for a long time. The lecture-note chapters for this stretch are recent additions. In the [frozen Fall 2022 notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf), all of "self-supervised learning and foundation models" was one chapter of eight pages; the same material is now five chapters and nearly fifty pages.

## Video numbering and titles

Studying from the playlist, you will run into two things that are easy to misread.

### The numbering skips, but no regular lecture is missing

The [playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw) has 17 videos. The numbers in the titles run from 1 to 14, then 16, 18, 20. Each of the three missing numbers has its own reason:

- **Lectures 15 and 17 were guest lectures** and were not posted to YouTube. At the start of Lecture 14 the lecturer says the rest of the course, apart from two guest lectures, is LLMs and reinforcement learning, and announces that Simran will talk about systems ML the following Monday.
- **The Lecture 19 slot fell on Memorial Day**, and there was no class. The course meets on Mondays and Wednesdays; the lecturer of Lecture 18 says reinforcement learning starts "from this week", and in Lecture 20 he refers to the previous lecture as "last week".

So the content of the 17 videos is continuous, and the lecturer of Lecture 20 says outright that it is the last lecture of the quarter. This series uses the lecture numbers from the video titles.

### The topics in the titles often don't match

The numbers are right, but in several videos the topic in the title doesn't match the content. The table below lists the larger mismatches:

| Topic in the video title | Actual content |
|---|---|
| Lecture 3: Weighted Least Squares | Probabilistic interpretation, logistic regression, Newton's method; weighted least squares is never covered in the lecture |
| Lecture 6: Dataset Split, ML Advice | Mostly the bias–variance decomposition and ridge regression; dataset splitting gets only the last few minutes |
| Lecture 12: Representation Learning | First half finishes the diffusion loss, second half is foundation models and LoRA |
| Lecture 13: LLMs, Next-Word Prediction Loss | Representation learning, contrastive learning, semantic search |
| Lecture 14: Transformers, In-Context Learning | Covers the Transformer's attention, but not in-context learning |
| Lecture 16: Basic Concept in RL, Policy Gradient | Attention variants, MoE, in-context learning |
| Lecture 18: GMM (EM), PCA | Reinforcement learning basics and policy gradient |
| Lecture 20: GMM (EM), PCA | PPO and training long chains of thought with reinforcement learning |

From Lecture 12 on, each title roughly describes the content of the next video; the last two simply reuse the title of Lecture 10. Stanford Online has not explained why. The practical conclusion: **don't plan your study schedule from the video titles**. Use the table in the previous section, or go straight to the opening of each lecture's guide.

## In the lecture notes but not taught in Spring 2026

The course's [main lecture notes](https://cs229.stanford.edu/main_notes.pdf) are a public PDF of 278 pages, credited to Tengyu Ma and Andrew Ng and divided into six parts. They cover more than one quarter of lectures does, and the following chapters do not appear in the Spring 2026 recordings:

| Lecture notes | Topic | Where to pick it up |
|---|---|---|
| Chapter 1, Section 1.4 | Locally weighted linear regression | Lecture notes |
| Chapter 5 | Kernel methods | Lecture notes; Lecture 7 of the 2018 Andrew Ng version |
| Chapter 6 | Support vector machines | Lecture notes; Lectures 6 and 7 of the 2018 version |
| Chapter 8, Section 8.3 | Uniform convergence and VC dimension | Lecture notes |
| Chapter 13 | Independent component analysis (ICA) | Lecture notes; Lectures 15 and 16 of the 2018 version |
| Chapter 19, later sections | Value iteration and policy iteration | Lecture notes; Lecture 17 of the 2018 version |
| Chapter 20 | LQR, DDP, LQG | Lecture notes; Lectures 18 and 19 of the 2018 version |

The lecturer of Lecture 18 explains in class why reinforcement learning is cut this way: the quarter's focus is on LLMs, so the algorithms in the notes that are not often used when training language models are left out, the lecture jumps straight to policy gradient, and anyone interested is asked to read the rest in the notes.

[The Autumn 2018 version taught by Andrew Ng](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU) is another complete public set of recordings, 21 videos in all. Its supervised learning portion differs little from today's, and kernels, SVMs, ICA, and LQR each get full lectures, which makes it a good way to fill the gaps in the table above. In the other direction, diffusion models, foundation models, and LLMs are entirely absent from the 2018 version. What neither version teaches is decision trees and ensemble methods: the 2018 syllabus still had one lecture on them, and the current syllabus and notes have none.

## What a self-learner can get

| Material | Status |
|---|---|
| Main lecture notes PDF | Public, 278 pages, still being updated |
| Review notes on linear algebra, probability, convex optimization, and Gaussian distributions | Public, under `section/` on the course site |
| Spring 2026 recordings | 17 videos public, regular lectures complete, two guest lectures missing |
| 2018 Andrew Ng recordings | 21 videos public |
| Problem sets 1–3, with starter code and datasets | Public, in the Summer 2019 and Summer 2020 versions |
| Current-term assignments, syllabus, schedule, project handouts | Require a Stanford account |
| Recent official solutions and autograders | Not public |

The course site states that current-term documents are shared only with Stanford affiliates. The official route for non-degree students is SCPD, and [Stanford Online's course page](https://online.stanford.edu/courses/cs229-machine-learning) lists the application requirements.

### Problem sets

The server still holds the [three problem sets from Summer 2020](https://cs229.stanford.edu/summer2020/ps1.pdf), and both the PDFs and the starter-code archives can be downloaded:

- **PS1**: derive and implement logistic regression and GDA, once each, plus Poisson regression and a proof of convexity for GLMs. Matches Lectures 3 through 5.
- **PS2**: Naive Bayes spam SMS classification, the validity of kernels, and writing the forward and backward passes of a single-hidden-layer network from scratch to recognize MNIST. Matches Lectures 5, 7, and 8; the kernel problems rely on Chapter 5 of the notes.
- **PS3**: reinforcement learning on the inverted pendulum, k-means image compression, semi-supervised EM, PCA, ICA. Matches Lectures 9 and 10 and the reinforcement learning part.

Every set has you derive first and then implement. The assignments restrict the coding problems to the packages listed in the environment file, which contains NumPy, SciPy, matplotlib, and Pillow, with no scikit-learn and no PyTorch. That means the MNIST problem in PS2 makes you write the chain rule yourself, and it is a good way to check your understanding after reading Lecture 8.

These problem sets are older than the Spring 2026 course, and there are no public assignments for the diffusion model and LLM material. Also, the derivation problems have no solutions to check against, which is the biggest gap in studying this course on your own.

## How to start

**If you have a grounding in linear algebra and probability**, start at Lecture 2 and read in order. Lecture 1 is the course introduction and has no derivations; come back to it when you want to know how the three kinds of learning are divided. Every lecture is read the same way: watch the video or read the body of the guide, work through the derivation on paper yourself, do the self-check at the end of the post, then read the matching chapters of the lecture notes to see what the lecture skipped.

**If you only want the modern material in the second half**, the shortest path is Lecture 3 (maximum likelihood) → Lectures 7 and 8 (neural networks and backpropagation) → the first half of Lecture 10 (the ELBO) → Lecture 11 onward. The diffusion models in Lectures 11 and 12 need the ELBO; Lecture 20 needs the policy gradient from Lecture 18.

**If the matrix derivatives in Lecture 2 stop you**, read the [linear algebra review notes](https://cs229.stanford.edu/section/cs229-linalg.pdf) on the course site first. Section 4 was written for exactly this.

To pair the problem sets with the lectures, do PS1 after Lecture 5, PS2 after Lecture 8, and the unsupervised learning problems in PS3 after Lecture 10.

## CS229 and CS230

People often treat these two as an either-or choice, but the official line is that they overlap very little. On [ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog), the prerequisites field for CS230 says CS229 may be taken concurrently. In the Q&A of CS230's [Autumn 2025 first lecture](https://www.youtube.com/watch?v=_NLHFoVNlbg), Andrew Ng says the two curricula were deliberately designed to have low overlap, and describes CS229 as much heavier on math and theory and very fast-paced, while CS230 does one thing, deep learning, and does almost no mathematical proofs all quarter.

So the two courses cut in different directions: CS229 covers a wide range of algorithms and makes you derive each one; CS230 picks deep learning alone and heads toward implementation and projects. Neither is a prerequisite for the other. This site also has a [guide to CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) for comparison, and for where this course sits on the whole prerequisite ladder, see the [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en).

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction](https://www.youtube.com/watch?v=DATnpGoGhM8)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng | Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [CS229 course site](https://cs229.stanford.edu/)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the English transcripts of all 17 Spring 2026 recordings were obtained and each lecture was written up as a guide. The per-lecture content, lecturers, reasons for the numbering gaps, and title mismatches in this post are compiled from those transcripts; the slides and board work on screen were not viewed. The lecturers do not state their names in every lecture, so who taught each lecture was determined from how they refer to each other and from the handover remarks in the transcripts.

## Update Log

- 2026-10-12: Rewritten as a course overview. The series changed from "chapter by chapter through the 2026 main lecture notes" to "one post per lecture of the public Spring 2026 recordings", with the videos moved to the top of each post. Added the table of what the 17 lectures actually cover, the table of video title mismatches, and routes for picking up the chapters the lectures did not teach. The original post's details on verifying the materials are no longer in the body.
- 2026-10-10: Marked the video status and checked the recording sources and how to access them. A recheck confirmed that the public Spring 2026 playlist (17 videos) exists, and the embedded Lecture 1 was checked against its transcript.

## References

- [CS229: Machine Learning course site](https://cs229.stanford.edu/): the prerequisites, and the statement that materials are shared only with Stanford affiliates
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): 278 pages, the six-part structure and chapter numbering, the basis for each lecture's "Lecture notes" entry
- [CS229 frozen Fall 2022 lecture notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf): for comparing how much the foundation-model chapters have grown in recent years
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): the numbering and titles of the 17 recordings; each lecture's content is compiled from its English transcript
- [Stanford CS229: Machine Learning led by Andrew Ng | Autumn 2018 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU): the lectures that fill in kernels, SVMs, ICA, and LQR
- [CS229 Autumn 2018 syllabus (Wayback capture)](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html): how the 2018 lectures were grouped, including decision trees and ensemble methods
- [Linear Algebra Review and Reference](https://cs229.stanford.edu/section/cs229-linalg.pdf): supplementary material for matrix derivatives
- [SEE public course Problem Set 1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf): the pre-enrollment self-test Stanford Online recommends
- [Stanford Online: CS229 course page](https://online.stanford.edu/courses/cs229-machine-learning): SCPD application requirements and the self-test advice
- [CS229 Summer 2020 Problem Set 1](https://cs229.stanford.edu/summer2020/ps1.pdf), [Problem Set 2](https://cs229.stanford.edu/summer2020/ps2.pdf), [Problem Set 3](https://cs229.stanford.edu/summer2020/ps3.pdf): the problems and the rule on permitted packages
- [ExploreCourses: CS 229](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog): the STATS 229 cross-listing, and the original wording of the CS 230 prerequisites field
- [Stanford CS230 Autumn 2025 Lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg): how Andrew Ng positions CS229 and CS230
- On this site: [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [CS230: when prompt engineering stops working](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
