---
title: "CMU 11-868 Assignment 2: Implementing Autodiff in MiniTorch and Training a Sentiment Classifier"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, deep-learning, backpropagation, homework]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 5
tldr: "The second 11-868 assignment has three parts: autodiff's topological_sort and backpropagate (40 points), a Linear layer and MLP network (30), and binary cross entropy plus the training loop (30). You then train a sentiment classifier on SST-2 with GloVe embeddings and must reach 75% validation accuracy. The default backend is the CUDA kernels from Assignment 1, and the repo merged small Fall 2026 fixes on 2026-09-02."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Assignment 2: the three problems and their points, how it builds on L05's autodiff and Assignment 1's CUDA kernels, the SST-2 training setup and the 75% bar, the official schedule (out 1/28, due 2/4), and what Fall 2026 changed in llmsys_hw2 plus which commit to check out. No solutions."
draft: false
glossary:
  - term: "MiniTorch"
    definition: "A miniature deep learning framework Sasha Rush wrote for teaching; CMU 11-868 extends it to run real CUDA kernels, and all seven assignments are built on it."
    context: "Assignment 2 has you fill in its autodiff core and use it to train a sentiment classifier."
  - term: "GloVe"
    definition: "A set of pretrained English word vectors, mapping each word to a fixed-size vector."
    context: "The Assignment 2 training script uses the 50-dimensional wikipedia_gigaword GloVe vectors to turn SST-2 sentences into sequences of embeddings; it downloads them on first run."
  - term: "SST-2"
    aliases: ["Stanford Sentiment Treebank"]
    definition: "The binary version of the Stanford Sentiment Treebank, labeling movie-review sentences positive or negative; it is also one of the GLUE benchmark tasks."
    context: "The Assignment 2 training script loads sst2 from nyu-mll/glue on Hugging Face."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The assignment page lives on the cross-semester [homework site](https://llmsystem.github.io/llmsystemhomework/assignment_2/) and the starter code in [llmsys_hw2](https://github.com/llmsystem/llmsys_hw2), both as seen on 2026-09-30. **Fall 2026 has already touched this repo**: three PRs were merged on 2026-09-02, detailed in the "Version differences" section below. Access level **A3**: the problems, starter code, local tests, and training script are public; what you cannot get is Canvas submission, the private test cases, and PSC.

**Series navigation**: Previous [L05 Deep learning frameworks and automatic differentiation](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff-en) | Next [L06–L07 Transformers and pretrained LLMs](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The previous post explained how a framework computes gradients on a computation graph. This one has you build that machinery into [MiniTorch](https://llmsystem.github.io/llmsystemhomework/) yourself. The page's first paragraph is direct: implement a basic deep learning framework with automatic differentiation and the necessary operators, then use it to build a feedforward network for sentiment classification.

Unlike Assignment 1, all the code here is Python. It is not independent of Assignment 1, though: the CUDA kernels you wrote there are this assignment's default compute backend.

This post covers only the problem structure, points, required resources, and where outside readers get stuck. **It does not provide solutions to any problem.**

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## Where it sits in the course

The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) releases HW2 on 1/28, the same day HW1 is due and L05 is taught, and makes it due 2/4: one week. Recitation 2 on 1/30 is "HW2, MiniTorch, More GPU".

The last L05 slide points straight at this assignment and asks students to bring laptops to Friday's recitation to learn MiniTorch. The `backward_pass` on slide 27, labeled "important for HW2", is the prototype for Problem 1.

## First, bring over your Assignment 1 kernels

The repo README has a "Copy kernel code" section that the homework site does not: before starting HW2, copy `src/combine.cu` from HW1 into the same path in HW2, then compile it with `nvcc` into `minitorch/cuda_kernels/combine.so`. The repo also ships `migrate_kernel.py` to do this for you.

The reason is at the top of the training script, `project/run_sentiment.py`: `backend_name` defaults to `"CudaKernelOps"`, and the comment next to it says to change it to `"SimpleOps"` if you run on CPU. In other words, whether your Assignment 1 kernels are correct directly affects your Assignment 2 training results.

## Problems and points

Three problems, 100 points in total:

| Problem | What you do | Points | File | Local test |
|---|---|---|---|---|
| P1 Automatic Differentiation | Two functions: `topological_sort` and `backpropagate` | 40 | `minitorch/autodiff.py` | `-k "autodiff"` |
| P2 Neural Network Architecture | `__init__` and `forward` for the `Linear` layer and the `Network` class | 30 | `project/run_sentiment.py` | `-k "linear"`, `-k "network"` |
| P3 Training and Evaluation | Binary cross entropy loss, the training and validation loop, and an actual training run | 30 | `project/run_sentiment.py` | run `bash run_sentiment.sh` |

The places to fill in are marked `BEGIN HW2_x` and `END HW2_x`.

**P1 is only graph traversal.** The page explains that derivatives for the built-in operations are already provided in `minitorch.Function.backward`. You write just the two core functions: one computes the reverse topological order of the graph, the other propagates derivatives to the leaf nodes along that order. The hint is to use a post-order depth-first search, and the page tells you to check what `class Variable(Protocol)` provides first.

**P2's architecture is spelled out in a docstring.** `Network` is an MLP for SST-2 sentiment classification with four steps: average over sentence length, a Linear layer to hidden_dim followed by ReLU and Dropout, a Linear layer to the number of classes, then sigmoid. Defaults are embedding_dim 50, hidden_dim 32, dropout 0.5. It follows the same idea as the "It is a good movie" network on L05 slide 4.

**P3 has a score bar.** The page says you should reach a best validation accuracy **equal to or higher than 75%**. It also strongly suggests using the provided `default_log_fn` to print validation accuracy, because those outputs are used for autograding.

**Submission and grading.** Zip the `llmsys_hw2` directory, excluding `.venv`, `.git`, and cache files, and upload it to Canvas. Grading uses private test cases.

## What the training setup looks like

The training script hardcodes its settings in the main block. As of 2026-09-30:

| Setting | Value |
|---|---|
| Data | `sst2` from `nyu-mll/glue` on Hugging Face |
| Train / validation examples | 450 / 100 |
| Embeddings | GloVe `wikipedia_gigaword`, 50 dimensions |
| Learning rate | 0.025 |
| Max epochs | 250 |
| Batch size | 10 |

The dataset is deliberately tiny; the point is to prove your framework trains end to end, not to chase accuracy. The page warns that the GloVe file downloads before the first training run and takes a while. The FAQ says that if one epoch on CPU takes more than 30 minutes, check your implementation for inefficiencies. If you cannot reach 75%, the FAQ suggests trying other hyperparameters first, such as SGD or a different learning rate.

## What compute you need

Unlike Assignment 1, this page does not say "you'll need a GPU". It only requires Python 3.12+ and includes a comment about loading `cuda/12.4.0` on PSC. In practice:

- The default path in the README needs `nvcc` to compile your Assignment 1 kernels, which means an NVIDIA GPU.
- The training script lets you switch to `SimpleOps` on CPU, and the repo's neural network tests also build a CPU backend with `SimpleOps`. **I have not verified whether the whole assignment can be completed CPU-only and still pass the private tests**, because the README's compile step still assumes CUDA.

## Version differences: what Fall 2026 changed

The last mainline commit in llmsys_hw2 before the spring deadline is `b9716f3`, dated 2026-01-29. Comparing it with HEAD on 2026-09-30 shows only three kinds of changes, all merged on 2026-09-02:

1. The fill-in markers in the code changed from `BEGIN ASSIGN2_x` to `BEGIN HW2_x`, matching the homework site.
2. The `backpropagate` docstring changed "leave nodes" to "leaf nodes".
3. In `cuda_kernel_ops.py`, the reduce `reduce_value` argument type changed from `ctypes.c_double` to `ctypes.c_float`. The commit message says this fixes a type mismatch between the Python binding and the CUDA code, which expects a float, and that the mismatch could lead to nan gradients.

The problems and points did not change. To reproduce the spring version exactly, `git checkout b9716f3`, but item 3 is a bug fix, so HEAD is the easier choice for self-study. Fall 2026 is still in session and may change things again; check the [commit history](https://github.com/llmsystem/llmsys_hw2/commits/main) before you start.

One small inconsistency: the repo README names the P3 function `cross_entropy_loss`, while the homework site and the actual code use `binary_cross_entropy_loss`. Go by the code.

## Where outside readers get stuck

**Without Assignment 1, the default path does not run.** If you skipped Assignment 1, your only option is `SimpleOps`, with the unverified risk described above.

**No PSC, no Canvas, no private tests.** You can self-check only with the repo's `tests/` and the 75% bar.

**The schedule is tight.** The spring version allowed one week. Logistics allows 3 penalty-free late days for the whole semester, then 20% off per day. Self-study has no deadline, but the pace is a hint: the amount of code is small, and when people get stuck it is usually because they have not understood how to walk the graph.

## How to self-study it

1. Make sure your Assignment 1 kernels pass all CUDA tests, then move them over with `migrate_kernel.py` and compile.
2. Before P1, work through the example on L05 slides 18–26 on paper, then read `class Variable(Protocol)`.
3. After P1 passes the `autodiff` tests, do P2 and P3.
4. Once training reaches 75%, switch the backend to `SimpleOps` and run it again to compare speed. It is the first time in the course you see what your own CUDA kernels buy you.

One thing you can do tonight: open `minitorch/autodiff.py`, read only the methods and docstrings of the `Variable` protocol, and list which ones you will need in `backpropagate`.

## Further reading

- [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en): the math behind autodiff
- [CMU 10-414/714 Deep Learning Systems](https://dlsyscourse.org/): a whole course building a framework called Needle from scratch; this site has no series for it yet, but the [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en) explains where it fits

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) (HW2 release and due dates, Recitation 2)
- [CMU 11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) (late days)
- [Assignment 2: Minitorch Framework](https://llmsystem.github.io/llmsystemhomework/assignment_2/) (homework site, as seen 2026-09-30)
- [llmsystem/llmsys_hw2](https://github.com/llmsystem/llmsys_hw2) (starter code, README, `project/run_sentiment.py`)
- [llmsys_hw2 commit history](https://github.com/llmsystem/llmsys_hw2/commits/main)
- [CMU 11-868 homework site: MiniTorch overview](https://llmsystem.github.io/llmsystemhomework/)
- [CMU 11-868 Spring 2026 L05 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf)
- [GLUE SST-2 dataset (nyu-mll/glue)](https://huggingface.co/datasets/nyu-mll/glue)
