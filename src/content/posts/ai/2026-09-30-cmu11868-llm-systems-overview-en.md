---
title: "Reading CMU 11-868 LLM Systems: Overview and Self-Study Paths — 28 Slide Decks and 7 Assignments Are Public, but No Videos and You Bring Your Own GPU"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 0
tldr: "CMU 11-868 is Lei Li's graduate course on LLM systems: it goes from CUDA kernels and your own MiniTorch framework to distributed training, SGLang serving, and RLHF. All 28 Spring 2026 slide decks, 7 assignment pages, and 7 starter-code repos are public, which rates it A3. What's missing: videos, GPUs and a PSC account, the quizzes, and any official statement of which two assignments are optional."
description: "Series overview for CMU 11-868 LLM Systems: what the course is for, how it changed across four terms from Spring 2024 to Fall 2026, its A3 access rating and gaps, the Fall 2026 policy changes (no AI agents for homework, new TPU lectures, 30% off per late day), the final project spec and timeline, and self-study paths tiered by the hardware you have."
draft: false
glossary:
  - term: "MiniTorch"
    aliases: ["miniTorch"]
    definition: "A small teaching deep learning framework by Sasha Rush with tensors and automatic differentiation. CMU 11-868 extends it with real CUDA kernels and GPU acceleration, and most of the seven assignments build on it."
    context: "The Overview page of the 11-868 assignment site describes this origin and extension."
  - term: "PSC"
    aliases: ["Pittsburgh Supercomputing Center", "Bridges-2"]
    definition: "Pittsburgh Supercomputing Center. 11-868 gives enrolled students accounts on its GPU cluster, which uses queue-based job scheduling."
    context: "The Fall 2026 Logistics page says normal queue waits exceed 24 hours and deadlines will not be extended because of them."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

> **Version note**: This series follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/), the most recent completed term with the fullest materials. Fall 2026 is in progress and is used only for comparison. Every fact was checked on 2026-09-30 against the official pages, slide PDFs, and GitHub repos. Access rating: **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Slides, assignment specs, starter code, and the project spec are public, which is enough to self-study. Videos, the GPU cluster, quizzes, and grading are not.

**Series**: this is the overview | next [L01: Why LLMs Need Systems](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en)

CMU 11-868 is a graduate course in the [Language Technologies Institute](https://www.lti.cmu.edu/), taught by [Lei Li](https://www.cs.cmu.edu/~leili/). It doesn't teach you how to use LLMs. It teaches you how to turn LLM training, fine-tuning, and serving into systems that actually run. The Spring 2026 course description lists eight topics: training efficiently on huge data, embedding storage and retrieval, data-efficient fine-tuning, communication-efficient algorithms, efficient RLHF, acceleration on GPUs and other hardware, model compression for deployment, and online maintenance.

The homework centers on [MiniTorch](https://llmsystem.github.io/llmsystemhomework). The [assignment site overview](https://llmsystem.github.io/llmsystemhomework) says it began as a teaching framework by [Sasha Rush](https://rush-nlp.com/), and the course will "extend the original framework to support real cuda kernels." You write CUDA kernels first. Then you build autodiff, a Transformer, and fused kernels inside your own framework. Only near the end do you switch to industry frameworks like DeepSpeed and SGLang.

The FAQ draws a clear line between this course and CMU's other LLM course, 11-667. 11-667 covers models, learning algorithms, and applications. 11-868 covers "building systems for LLM, including training, serving, and maintaining." The FAQ also says plainly that students who don't want to write low-level systems code should take 11-667.

## The hard facts

| Item | Spring 2026 |
|---|---|
| Schedule | 1/12–4/28, Mon/Wed 12:30–1:50, optional Friday recitations |
| Staff | Lei Li; four TAs (Aditya Tummala, Danqing Wang, Jackey Hua, Sreeram Vennam) |
| Prerequisites | Linear algebra, calculus, probability and statistics; Python plus C/C++/Java (15-122 level); ML background "preferred but not required" |
| Homework | "five required and two optional programming assignments", done individually |
| Grading | Homework 44% (+5% optional), Quiz 10%, Participation 2% (+ up to 5%), Project 44% |
| Textbook | None required; *Programming Massively Parallel Processors*, 4th ed., recommended for anyone new to GPU programming |
| Compute | PSC cluster; Google Colab for new users |
| Forum | Ed; don't email individual TAs |
| Videos | No video or YouTube link anywhere on the official pages |

Sources: [Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics), [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), [FAQ](https://llmsystem.github.io/llmsystem2026spring/docs/FAQ).

The FAQ estimates about 12 hours a week for students who have taken an ML course and are comfortable in C. The participation bonus fits the course well: find a typo or bug in an assignment repo, send a pull request, and get credit if it's merged. The latest commits on `llmsys_hw1` through `llmsys_hw7` are mostly "Merge pull request," so people do use this channel.

## How four terms evolved

The [course hub](https://llmsystem.github.io/) lists four terms: Spring 2024, Spring 2025, Spring 2026, and Fall 2026. It also notes that a "slightly adjusted" version is a core course in the [CMU GenAI/LLM certificate](https://www.cmu.edu/online/generative-ai-llms).

| Term | Homework | Assessment | Schedule changes |
|---|---|---|---|
| [Spring 2024](https://llmsystem.github.io/llmsystem2024spring/docs/Syllabus) | HW1–HW4 | 10% per assignment; in-class paper presentation 10%; every student writes paper reviews | Late-term lectures on RAG, HNSW, multimodal LLMs, attention sinks |
| [Spring 2025](https://llmsystem.github.io/llmsystem2025spring/docs/Syllabus) | Syllabus lists HW1–HW5 due dates | Logistics says "Homework 10% each, 40% in total"; $150 of AWS credit per student | Guest lectures by Tri Dao, Woosuk Kwon, Hao Zhang, Ying Sheng, and others; last lecture on RL systems |
| [Spring 2026](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) | HW1–HW7 (5 required + 2 optional) | Homework 44% (+5%) | Google guest lectures on TPU/JAX and Pallas; guests on disaggregated prefill/decode (Vikram Mailthody) and LMCache (Junchen Jiang) |
| [Fall 2026](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) | Same 7 assignments | Homework 44%, "+5% optional" dropped | New Week 13 "Acceleration on TPU 1/2" |

The two Spring 2025 pages disagree: the Syllabus schedules five assignments, while Logistics says 10% each and 40% in total. The course doesn't explain this, and this article doesn't guess.

The overall direction is clear. Spring 2024 still ran partly as a seminar, with paper reviews and student presentations. Those were dropped in favor of more programming assignments and industry guests. The late-term lectures on RAG, vector search, and multimodal models moved to an "unscheduled" block at the bottom of the Spring 2026 Syllabus, with readings but no slides.

## A3, with six gaps

Spring 2026 publishes a lot: 28 slide PDFs on the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), seven specs on the [assignment site](https://llmsystem.github.io/llmsystemhomework), seven assignment repos plus the example code in [`llmsys_code_examples`](https://github.com/llmsystem/llmsys_code_examples) under the [GitHub org](https://github.com/llmsystem), and the [project spec](https://llmsystem.github.io/llmsystem2026spring/docs/Projects). By the course map's definition, that's A3: structured materials plus assignments and the files they need.

A3 still has gaps. Outside readers will run into these six:

1. **No videos.** Neither the Spring nor the Fall 2026 pages link to recordings. This is the biggest difference from [Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en). You can only read slides and papers, and anything said out loud in class is lost.
2. **You need NVIDIA GPUs.** [Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) opens with "You'll need a GPU." [Assignment 5](https://llmsystem.github.io/llmsystemhomework/assignment_5/) needs at least two. [Assignment 6](https://llmsystem.github.io/llmsystemhomework/assignment_6/) recommends a 2-GPU PSC session and asks you to make Llama-2-7B trainable with LoRA on "2 V100 GPUs/ 16GB GPU memory." Without a PSC account, you rent cloud GPUs yourself.
3. **Quizzes and grading are closed.** Quizzes are 10% of the grade, and the quiz links on the slides point to CMU Canvas. Ed and the submission systems are also for enrolled students only.
4. **The course never says which two assignments are optional.** Logistics only says "five required and two optional," and none of the seven assignment pages is marked optional. This series won't guess.
5. **Some lectures have no slides.** The 4/15 lecture "Efficient Reinforcement Learning System for LLMs" only links the [ReaLHF](https://arxiv.org/abs/2406.14088) paper. Parts 1 and 2 of "Accelerating Transformer on GPU" share one PDF. Five unscheduled topics at the bottom of the Syllabus (Triton, RAG, HNSW, multimodal LLMs, attention sinks) have readings only.
6. **You buy the textbook.** The PMPP 4th edition link goes through O'Reilly's CMU SSO, and Logistics says "Please login using your andrew email for free access."

The FAQ also says there's no audit option, because the waitlist comes first.

## Assignment repos are shared across terms

This affects the code you clone. The assignment site and `llmsys_hw1`–`llmsys_hw7` aren't split by term, and Fall 2026 is editing them now. Latest commit on the default `main` branch, via the GitHub API on 2026-09-30:

| Repo | Latest commit | Status |
|---|---|---|
| `llmsys_hw1` | 2026-01-30 | During spring |
| `llmsys_hw2` | 2026-09-02 | Changed for Fall 2026 |
| `llmsys_hw3` | 2026-09-09 | Changed for Fall 2026 |
| `llmsys_hw4` | 2026-09-30 | Changed for Fall 2026 |
| `llmsys_hw5` | 2026-04-30 | Spring state |
| `llmsys_hw6` | 2026-03-23 | Spring state |
| `llmsys_hw7` | 2026-05-02 | Spring state |

The older `llmsys_s24_hw1–4` and `llmsys_s25_hw1–5` repos are still public.

**What to do**: to match the spring version, check out the last commit before the term ended:

```bash
git clone https://github.com/llmsystem/llmsys_hw2.git
cd llmsys_hw2
git checkout $(git rev-list -n 1 --before=2026-04-29 main)
```

To pick up Fall 2026 fixes, stay on `main`, but problem numbers and points may differ from what this series describes.

## How the other 22 posts are ordered

The series mostly follows the official schedule with three changes, all made for readability rather than by the course: each assignment post comes right after the lectures it depends on (the course often releases homework first; HW1 comes out on the day of L02); Google's TPU/JAX and Pallas guest lectures move from Week 7 to after FlashAttention, so Splash Attention can be read against FlashAttention's tiling; and the three unscheduled serving decks with slides are folded into the serving-at-scale post.

| # | Stage | Post |
|---|---|---|
| 1 | Motivation | [L01 Why LLMs need systems](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en) |
| 2 | Hardware | [L02–L04 GPU programming and acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en) |
| 3 | Hardware | [HW1: CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) |
| 4 | Framework | [L05 Deep learning frameworks and autodiff](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff-en) |
| 5 | Framework | [HW2: MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework-en) |
| 6 | Model | [L06–L07 Transformers and pre-trained LLMs](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en) |
| 7 | Model | [L08–L09 Tokenization, decoding, and speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en) |
| 8 | Model | [HW3: A decoder-only Transformer in MiniTorch](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) |
| 9 | Single-GPU speed | [L10 Accelerating Transformers on GPU (LightSeq)](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en) |
| 10 | Single-GPU speed | [HW4: Fused Softmax/LayerNorm kernels](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en) |
| 11 | Multi-GPU training | [L14–L15 Distributed training and data parallelism](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en) |
| 12 | Multi-GPU training | [L16–L17 Model parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en) |
| 13 | Multi-GPU training | [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en) |
| 14 | Multi-GPU training | [HW5: Data and pipeline parallelism](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en) |
| 15 | Smaller and faster | [L19–L20 Model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en) |
| 16 | Smaller and faster | [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en) |
| 17 | Smaller and faster | [L12–L13 TPU, JAX, and Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en) |
| 18 | Smaller and faster | [L23 Efficient fine-tuning (LoRA, QLoRA)](/posts/ai/2026-09-30-cmu11868-peft-lora-en) |
| 19 | Serving | [L22, L24 LLM serving: SGLang and vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en) |
| 20 | Serving | [HW6: DeepSpeed + SGLang](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en) |
| 21 | Serving | [L26–L30 Serving at scale and KV caches](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en) |
| 22 | Alignment systems | [RLHF systems and HW7](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems-en) |

## What Fall 2026 changed

| Item | Spring 2026 | Fall 2026 |
|---|---|---|
| Schedule | Mon/Wed 12:30–1:50 | Mon/Wed 5:00–6:20, Friday recitation; Silicon Valley students join online |
| TAs | 4 | 6 |
| AI tools | "Using Github copilot or any AI agent is ok for explanation purpose" | "It is strictly forbidden to use any AI agent to complete the homework"; LLMs for explanation only |
| Late work | 3 free late days per term, then 20% off per day; no late final report | "Each late day will incur 30% discount on the grades" |
| PSC | No guarantee when a job starts | Normal waits exceed 24 hours; no extension because a job didn't run (unless PSC is down for more than 24 hours) |
| Homework weight | 44% (+5% optional) | 44% |
| Schedule order | Google guests in Week 7 | Google guests moved to Week 6; new Week 13 "Acceleration on TPU 1/2", no slides yet |

Sources: [Fall 2026 Logistics](https://llmsystem.github.io/llmsystem2026fall/docs/Logistics), [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus).

The Fall 2026 course description was also rewritten. It names vLLM, SGLang, and FlashAttention, and says students will write "custom GPU/TPU acceleration kernels (CUDA/Triton)." On 2026-09-29 the GitHub org created a [`shared-tpu-notebooks`](https://github.com/llmsystem/shared-tpu-notebooks) repo, described as giving hundreds of students a Cloud TPU from a Jupyter notebook. The official pages don't say whether it's for the Week 13 TPU lectures.

## Final project: spec and timeline

The project is 44% of the grade: proposal 2%, mid-term 2%, presentation 20%, final report 20%. From the [Projects page](https://llmsystem.github.io/llmsystem2026spring/docs/Projects):

- **Teams**: 2–3 people. The topic needs both a systems side and an LLM side.
- **Two project types**: reimplement a recent LLM systems paper inside MiniTorch, or do research aimed at a venue like MLSys, OSDI, SOSP, or SC. The L01 slides add that MiniTorch projects "should not use external PyTorch/Tensorflow code."
- **Proposal**: MLSys 2024 LaTeX style. Cover the systems problem, the state of the art, evaluation and workload, team split, timeline, and how much CPU/GPU/storage and compute time you need.
- **Mid-term report**: no page limit, suggested max 6 pages: motivation, related work, method, early experiments, remaining work.
- **Final report**: suggested max 8 pages. It adds implementation details, analysis and ablations, limitations, and file-level member contributions (e.g., "Author X contributed to the function in the file ABC.py").
- **Seed topics**: FlashAttention, PagedAttention, mixed-precision training, or DPO in MiniTorch. Research ideas include KV cache management, faster MoE training, training on heterogeneous hardware, and making WebLLM faster in the browser.

Spring 2026 timeline (Syllabus):

| Milestone | Date |
|---|---|
| Team list | 2/20 |
| Proposal | 2/27 |
| Mid-term report | 4/1 |
| Final presentation | 4/27 |
| Final report | 4/28 |

The L03 slides give 2/18 as the team deadline. The Syllabus says 2/20; go with the Syllabus.

## Self-study paths

The materials are public. The real barrier is hardware. Check what you have, then pick a path.

### Path 1: slides only, no GPU

Read the slides and the Syllabus readings in this series' order. The only assignment you can do is [Assignment 2](https://llmsystem.github.io/llmsystemhomework/assignment_2/), which builds autodiff and a sentiment classifier in MiniTorch. Its page says "Training on CPU can take some time," so a CPU works.

**Tonight**: open [L02 GPU Programming](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf), copy the B200/H100/A100 spec table on page 15, and note the ratio of FP32 compute to memory bandwidth. Several later lectures use it.

### Path 2: one NVIDIA GPU

Add HW1 (CUDA kernels), HW3 (a decoder-only Transformer in MiniTorch), and HW4 (fused Softmax and LayerNorm kernels). A Colab T4 is fine for the examples: the `llmsys_code_examples` notebook compiles with `-arch=sm_75` for the T4. HW3's Problem 4 trains a translation model, and the page warns "You may need to spend at least 10 hours for the training process." Free Colab sessions won't last that long, so rent an hourly cloud GPU.

**Tonight**: start a Colab GPU runtime, run [`simple_cuda_demo/CUDA_Code_Examples.ipynb`](https://github.com/llmsystem/llmsys_code_examples/blob/main/simple_cuda_demo/CUDA_Code_Examples.ipynb), and confirm `nvcc` compiles the vector-add example.

### Path 3: two or more GPUs

HW5 (your own data parallel and pipeline parallel) needs at least two GPUs. HW6 (DeepSpeed ZeRO plus LoRA training on Llama-2-7B, then SGLang inference) targets two V100s. HW7 builds RLHF in a VERL-like framework; its commands use GPT-2, and the page doesn't state hardware requirements.

**Tonight**: price it out. Multiply a two-GPU machine's hourly rate by HW3-style "at least 10 hours" training runs, then decide whether to do the whole path or only the data-parallel half of HW5.

### The project

You won't have teammates or a grader, but the project spec makes a good practice list. Pick a seed topic, such as FlashAttention in MiniTorch, and write it up for yourself in the five-section mid-term format.

## Further reading

- [Reading Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): training a language model from scratch, with matching lectures on GPUs, kernels, parallelism, and inference, plus videos.
- [CME295 Lecture 5: LLM Systems](/posts/ai/2026-09-29-cme295-llm-systems-en): one lecture covering KV caches, distributed training, and inference speedups.
- [Reading CMU 11-785 Deep Learning](/posts/ai/2026-08-22-cmu-11785-course-overview-en): background on autodiff and Transformers.
- CMU 10-414/714 Deep Learning Systems ([dlsyscourse.org](https://dlsyscourse.org/)): another build-your-own-framework course. The site has no series for it yet; see the [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en) for where it fits.

## References

- [Large Language Model Systems Courses (hub listing four terms)](https://llmsystem.github.io/)
- [CMU 11-868 Spring 2026 home page](https://llmsystem.github.io/llmsystem2026spring/)
- [Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)
- [Spring 2026 Projects](https://llmsystem.github.io/llmsystem2026spring/docs/Projects)
- [Spring 2026 FAQ](https://llmsystem.github.io/llmsystem2026spring/docs/FAQ)
- [CMU 11-868 assignment site (Assignments 1–7)](https://llmsystem.github.io/llmsystemhomework)
- [GitHub org llmsystem (assignment repos and example code)](https://github.com/llmsystem)
- [Fall 2026 home page](https://llmsystem.github.io/llmsystem2026fall/)
- [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
- [Fall 2026 Logistics](https://llmsystem.github.io/llmsystem2026fall/docs/Logistics)
- [Spring 2025 Syllabus](https://llmsystem.github.io/llmsystem2025spring/docs/Syllabus)
- [Spring 2024 Syllabus](https://llmsystem.github.io/llmsystem2024spring/docs/Syllabus)
- [L01 Introduction slides (Spring 2026)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf)
- [Global AI/CS course map (A0–A3 definitions)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
