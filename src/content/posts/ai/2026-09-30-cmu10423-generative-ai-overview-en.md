---
title: "A Generative AI Learning Path: Reading the 35 Core Guides | CMU 10-423 Course Overview"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 0
tldr: "This series uses the public Spring 2026 materials for CMU 10-423/623/723 Generative AI."
description: "A teaching guide based on public Spring 2026 materials: A Generative AI Learning Path: Reading the 35 Core Guides | CMU 10-423 Course Overview"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

This series uses the public Spring 2026 materials for CMU 10-423/623/723 Generative AI. Its goal is not a vocabulary of model names. You should be able to follow data into a model, trace learning signals into parameters, explain generation steps, and judge whether an output or experiment supports a claim. Each lecture has one guide; when a lecture covers several topics, the guide splits them into sections. Assignments, the practice exam, the paper report, and the final project each have their own guide.

The series contains **35 core teaching guides and 12 retained navigation guides**: one overview, one guide for each of the 26 lectures, five for Assignments 0–4, and one each for the practice exam, paper report, and final project. Core guides follow prerequisite dependencies. Retained pages preserve existing URLs and compare related mechanisms while linking to complete lessons.

## Diagnose your starting point

Prerequisites are Python, vectors and matrices, conditional probability, derivatives, and introductory machine learning. You need not have trained a large model, but you should distinguish data, tensor shapes, and parameters.

Original diagnostic A: three conditional token probabilities are 0.5, 0.4, and 0.25. Their prefix probability is 0.05. If you added them, begin with the RNN guide's chain rule. Diagnostic B: ŷ=wx, x=2, w=1, y=5, and L=(ŷ−y)²/2. The derivative with respect to w is −6. If you cannot trace it, use Assignment 0's scalar exercise.

Diagnostic C: a 4×4 grayscale image becomes nonoverlapping 2×2 patches. There are four tokens, each with four raw values. If you counted sixteen tokens, the CNN/ViT guide clarifies the distinction between pixels and patches. These are site-authored orientation exercises, not CMU admissions or exam requirements.

## Three routes with concrete starting points

**Language modeling:** start with sequence likelihood, the Assignment 0 gradient exercise, causal attention, training/decoding, RoPE/GQA, and Assignment 1. Then study PEFT, ICL, SFT/RLHF, and DPO. Separate parameter updates, context changes, and output selection at every step.

**Images and multimodality:** establish CNN/ViT representations, then read GANs, Diffusion I/II, VAE, and Assignment 2. Continue with latent diffusion, VLMs, cross-attention/DiT, and Q-Former. The audio guide covers representation/recognition first, then generation; video introduces temporal relationships, and world models introduce actions. An attractive image or smooth video cannot validate every capability.

**Systems and research:** readers with modeling foundations can begin with scaling laws, MoE, distributed training, and efficient inference, followed by long context, reasoning, SSMs, risks, code agents, and alignment. Finish with the practice exam, paper report, and project. These connect a question to baselines, ablations, and evidence. Systems topics still require attention shapes and autograd rather than bypassing them.

## Core reading map

The first column is this site's reading order, **not an official lecture number**. The second records the original scope. Lectures 11, 12, 15, 24, and 26 each cover two topics, handled as two halves of one guide. Worked examples and answers are site-authored rather than attributed to the instructor or presented as official solutions.

| Reading order | Original scope | Core guide |
|---|---|---|
| 0 | Overview | [A Generative AI Learning Path: Reading the 35 Core Guides](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) |
| 1 | L1 | [RNN Language Models: Sequence Probabilities and Gradient Paths](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) |
| 2 | HW0 / recitation | [Autodiff in Practice: From Hand Gradients to a Training Loop](/posts/ai/2026-10-11-cmu10423-hw0-autodiff-en) |
| 3 | L2 | [Causal Attention: From Q, K, and V to the Next Token](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) |
| 4 | L3 | [Training and Decoding: Why the Same Logits Produce Different Sequences](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en) |
| 5 | L4 | [Modern Transformers: What Position Rotation and KV Sharing Change](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) |
| 6 | HW1 | [Testing minGPT Changes: Shapes, Masks, and Positions](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) |
| 7 | L5 | [CNNs and ViT: Turning an Image into Model Inputs](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en) |
| 8 | L6 | [GANs: What the Generator and Discriminator Learn](/posts/ai/2026-09-30-cmu10423-gans-en) |
| 9 | L7 | [Diffusion Models: Why Adding Noise Creates a Training Task](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) |
| 10 | L8 | [Diffusion Training and Sampling: Random Timesteps and Reverse Chains](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling-en) |
| 11 | L9 | [VAEs: Reconstruction, KL, and Reparameterization](/posts/ai/2026-10-11-cmu10423-lecture-09-vae-en) |
| 12 | HW2 | [Testing DDPM: Matching Timestep Coefficients to a Batch](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) |
| 13 | L10 | [LoRA: What Changes When Most Weights Stay Frozen](/posts/ai/2026-10-11-cmu10423-peft-en) |
| 14 | L11 / L9 ICL section | [ICL, SFT, and RLHF: From Changing Inputs to Changing Weights](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en) |
| 15 | L12 | [DPO and Latent Diffusion: Updating on Preferences, Conditioning the Denoiser](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en) |
| 16 | HW3 | [Testing LoRA Fine-Tuning: Gradients, Data, and Evaluation](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en) |
| 17 | L13 | [Vision-Language Models: Turning Images into Language-Model Inputs](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en) |
| 18 | L14 | [Cross-Attention and DiT: How Conditions Enter a Denoiser](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en) |
| 19 | L15 | [Q-Former and Scaling Laws: Bridging Frozen Models, Allocating a Fixed Budget](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws-en) |
| 20 | HW4 | [Testing Q-Former Text-to-Image: Gradients through Frozen Backbones](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) |
| 21 | L16 | [Mixture of Experts: Separating Capacity from Active Computation](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en) |
| 22 | L17 | [Distributed Training: Splitting Data, Models, and Optimizer State](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en) |
| 23 | L18 | [Efficient Inference: FlashAttention, KV Caches, and Speculative Decoding](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en) |
| 24 | L19 | [Long Context: Fitting Input Is Not Reliable Retrieval](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en) |
| 25 | L20 | [Reasoning Models: Spending Compute on Verifiable Answers](/posts/ai/2026-09-30-cmu10423-reasoning-models-en) |
| 26 | L21 | [State Space Models: From Recurrence to Convolution](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en) |
| 27 | L22 | [Generative AI Risks: Turning Failures into Tests](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en) |
| 28 | L23 | [Code Generation and Agents: A Reliable Test–Repair Loop](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en) |
| 29 | L24 | [Audio Understanding and Generation: Samples to Text, Tokens Back to Sound](/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation-en) |
| 30 | L25 | [Video Generation: Modeling the Time Axis](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en) |
| 31 | L26 | [World Models and Alignment Theory: Action Interventions and Corrigibility Assumptions](/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment-en) |
| 32 | Official practice exam | [Practice Exam: Diagnose Conceptual Gaps](/posts/ai/2026-10-11-cmu10423-practice-exam-en) |
| 33 | HW623 | [Paper Reports: Turn a Model Summary into a Testable Argument](/posts/ai/2026-10-11-cmu10423-hw623-paper-report-en) |
| 34 | Final project | [Final Projects: Build a Reproducible Generative-Model Experiment](/posts/ai/2026-10-11-cmu10423-final-project-en) |


## Use assignments as learning checks

Assignment 0 matches hand derivatives to autograd. Assignment 1 checks shapes, masks, positions, and GQA. Assignment 2 aligns diffusion timesteps with image batches. Assignment 3 checks adapters and data splits. Assignment 4 follows gradients through frozen foundations and a trainable bridge. Establish a starter baseline, run its tests, add controlled variations, and then train.

Spring 2026 materials define separate Slot A/B rules, with an initial human-only submission and later AI-assisted corrections under specified conditions. Enrolled students should follow their semester's syllabus and handouts. Our independent examples neither replace those rules nor provide official submission answers. Public materials do not imply access to grading systems, manual rubrics, or every recitation supplement.

Small numerical exercises and unit checks can run on CPU; that does not make complete homework training equally cheap. Confirm hardware, environment, and data requirements for the actual scope. Record completed steps separately: passing tests, generating a sample, and evaluating quality establish different things.

## What the retained guides do

These twelve pages keep their original URLs and provide comparisons and links to the full core lessons. Return to them when you need a relationship explained. They are not additional lectures after the core guides.

- [Audio, video, and world models](/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en)
- [Cross-attention, DiT, and Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en)
- [Distributed training and efficient inference](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en)
- [Exam, paper report, and project](/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en)
- [SFT, RLHF, and DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en)
- [Long context and SSMs](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en)
- [PEFT and ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en)
- [Risks and alignment](/posts/ai/2026-09-30-cmu10423-risks-alignment-en)
- [Scaling laws and MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en)
- [Text-to-image and VLMs](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en)
- [Transformers and decoding](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en)
- [Variational inference and VAE](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en)

## What the sources establish

The primary basis is the official schedule, public slides, assignments, and assessment materials. A schedule is an index, not an exhaustive description of a deck. Lecture 8 introduces VAE; Lecture 9 closes with zero/few-shot material; Lecture 26 has separate world-model and alignment decks. Each guide's scope therefore follows the slides' actual content rather than filenames alone.

These are site-authored bilingual teaching guides, not lecture transcripts. The recording index is hosted on SCS Panopto. An anonymous folder view remains unloaded and requests sign-in; that establishes an access limitation, not an absence of recordings. Each guide retains official entry points. Unavailable speech, subtitles, or spoken whiteboard explanations are not invented.

Choose a route and complete its first numerical check before proceeding. If you can repeat model names but cannot explain the worked input and result, pause there and repair the gap rather than rush through the schedule.

[Next](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Official course homepage and syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Previous](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html)
- [Aran Nayebi](https://anayebi.github.io/)
- [Matt Gormley](http://www.cs.cmu.edu/~mgormley/)
- [a practice exam with solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [Lecture 1 slides: Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Lecture 2 slides: Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [HW1 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW3 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip)
- [HW4 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
