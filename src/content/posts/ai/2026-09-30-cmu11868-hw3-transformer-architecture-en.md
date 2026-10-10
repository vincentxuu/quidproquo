---
title: "CMU 11-868 HW3: Build GPT-2 in Your Own MiniTorch and Make It Translate German"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, transformer, cuda, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 8
tldr: "HW3 has you add softmax loss, Dropout, LayerNorm, and Embedding to the MiniTorch you built in HW1 and HW2, assemble a pre-LN GPT-2 decoder, and train it on IWSLT14 German-English translation. Points: tensor functions 20, basic modules 20, decoder LM 40, translation pipeline 20. Full marks require passing the private tests and a BLEU of about 20±2. The assignment page warns that training alone takes at least 10 hours: one epoch is about an hour on a PSC V100, and you need 10. In Spring 2026 it went out Feb 4 and was due Feb 18."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Assignment 3: what you build, the four problems with their points and files, where it depends on your HW1 CUDA kernels and HW2 autodiff, hardware and training time, where self-learners get stuck, and a version note on Fall 2026 changes to the llmsys_hw3 repo. No solutions."
draft: false
glossary:
  - term: "MiniTorch"
    definition: "A teaching deep learning framework that originated with Sasha Rush; CMU 11-868 adds real CUDA kernels, and students fill in tensor ops, autodiff, a Transformer, and acceleration kernels across seven assignments."
    context: "The framework shared by all CMU 11-868 assignments."
  - term: "Pre-LN"
    definition: "A Transformer layer layout that applies LayerNorm before the attention and FFN sublayers, ahead of the residual addition; the original Transformer applied it after the residual addition (Post-LN). GPT-2 and LLaMA both use pre-LN."
    context: "HW3 Problem 3 requires TransformerLayer to use pre-LN."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: Dates follow the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). Assignment content follows the [Assignment 3 page](https://llmsystem.github.io/llmsystemhomework/assignment_3/) and the [llmsys_hw3 repo](https://github.com/llmsystem/llmsys_hw3) **as seen on 2026-09-30**. The assignment site is shared across semesters, and **llmsys_hw3 already contains Fall 2026 changes** (see "Version note" at the end). Access level **A3**: the problems, starter code, and local tests are public; the private tests, Canvas submission, and recordings are not. This post contains no solutions or reference code.

**Series**: previous [L08–L09: Tokenization, decoding, and speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en) | next [L10: Accelerating Transformers on GPU (LightSeq)](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The first two assignments built the foundation: [HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) wrote CUDA kernels for map, zip, reduce, and matmul, and [HW2](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework-en) wrote autodiff and a sentiment classifier. HW3 is the first time they come together as a real language model.

The assignment page opens with two sentences. The first: implement a decoder-only GPT-2 architecture in MiniTorch, train it on IWSLT14 German-English translation, and benchmark it. The second is a warning: **training for Problem 4 takes at least 10 hours**.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## Timeline and dependencies

From the [Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus):

| Date | Event |
|---|---|
| Feb 2 | L06 Transformer |
| Feb 4 | L07 Pre-trained LLMs; HW2 due, **HW3 released** |
| Feb 6 | Recitation 3: The Annotated Transformer |
| Feb 9, Feb 11 | L08 Tokenization, L09 Decoding |
| Feb 16 | L10 Accelerating Transformer on GPU Part 1 |
| Feb 18 | L10 Part 2; **HW3 due** |

Conceptually you need [L06–L07](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en); Problem 4's `generate` relates to greedy decoding from [L09](/posts/ai/2026-09-30-cmu11868-tokenization-decoding-en).

In code, HW3 consumes your previous two assignments directly. The setup section asks you to:

- Copy `llmsys_hw2/minitorch/autodiff.py` over, and rename `run_sentiment.py` to `project/run_sentiment_linear.py`
- From `llmsys_hw1/src/combine.cu`, extract only the implementations of `MatrixMultiplyKernel`, `mapKernel`, `zipKernel`, and `reduceKernel` into the new `src/combine.cu`
- Run `bash compile_cuda.sh` to compile the kernels

The page explains why you copy only the functions: HW3's `combine.cu` and `cuda_kernel_ops.py` have changed. GPU memory allocation, deallocation, and host/device copies moved into `combine.cu`, and the tensor storage type changed from `numpy.float64` to `numpy.float32`.

In other words, **a bug in HW1 or HW2 will surface in HW3 in strange ways**. FAQ Q3 on the assignment page is one example: forward tests pass but gradient assertions fail, and the official pointer is the `backpropagate` function in `autodiff.py`.

## The four problems

| Problem | Content | File | Points |
|---|---|---|---|
| 1 | Tensor functions: `logsumexp`, `softmax_loss` | `minitorch/nn.py` | 20 |
| 2 | Basic modules: `Linear`, `Dropout`, `LayerNorm1d`, `Embedding` | `minitorch/modules_basic.py` | 20 |
| 3 | Decoder-only Transformer LM: `MultiHeadAttention`, `TransformerLayer`, `DecoderLM` | `minitorch/transformer.py` | 40 |
| 4 | Machine translation pipeline: `generate` | `project/run_machine_translation.py` | 20 |

Each problem's code region is marked with `BEGIN ASSIGN3_x` / `END ASSIGN3_x`, and comes with pytest commands (for example `python -m pytest -l -v -k "test_softmax_loss_student"`).

### Problem 1: softmax loss

The page gives the formula ℓ(z, y) = log Σ exp(z_i) − z_y and asks you to build it from `logsumexp`, `one_hot`, and other existing ops. Inputs are (minibatch, C) logits and (minibatch,) labels; the output has shape (minibatch,), with no reduction.

### Problem 2: four basic modules

- `Linear`: reuse HW2, adapted for the new `backend` argument
- `Dropout`: when `self.training` is false, leave the input untouched; to match the autograder's random seed, the page requires `np.random.binomial` for the mask
- `LayerNorm1d`: layer normalization over a 2D tensor
- `Embedding`: maps one-hot word vectors to embeddings

### Problem 3: assembling GPT-2

This problem carries the most points and gets the most detail. The architecture follows the [GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf); of the four modules, `FeedForward` is already written for you.

The key to `MultiHeadAttention` is shapes. The page spells it out: the input X is B×S×D (batch, sequence length, hidden dimension); project to Q, K, and V, split into h heads, permute to B×h×S×D_h, and transpose K's last two dimensions. After computing `softmax(QKᵀ/√D_h + M)V` (M is the causal mask), permute and reshape back to B×S×D and apply the output projection. Batched matrix multiplication is provided.

This is the full version of the two shapes on [L06 page 12](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf) (len × dim and len × len), with batch and head dimensions added.

`TransformerLayer` must use **pre-LN**. The page shows post-LN and pre-LN side by side and cites [On Layer Normalization in the Transformer Architecture](https://arxiv.org/abs/2002.04745).

`DecoderLM` runs: look up token and positional embeddings and add them, apply dropout, pass through every Transformer layer, apply a final LayerNorm, and project to vocabulary size with a linear layer.

### Problem 4: the translation pipeline

You implement `generate`: for each source sentence, produce the target with **argmax decoding**, **one example at a time**, without batching. The page suggests reading `collate_batch` and `loss_fn` in the same file first to understand data processing and loss computation.

After `python project/run_machine_translation.py`, outputs and BLEU scores land in `./workdir_vocab10000_lr0.02_embd256`. Reference numbers from the page:

- BLEU around 7 after the first epoch, around 20 after 10 epochs
- About one hour per epoch on a PSC V100
- The default hyperparameters are not guaranteed to be stable (you may see nan); you can tune learning rate, vocabulary size, embedding dimension, number of layers, number of heads, and dropout

## Grading and submission

Submit the whole `llmsys_hw3` as a zip on Canvas, containing the full codebase, one workdir with your best result, and a screenshot of training progress (or the slurm log if you used sbatch).

Grading has two parts: private MiniTorch test cases and the IWSLT evaluation results. According to the page, full marks require **passing all tests and a BLEU of about 20 ± 2**.

## Where self-learners get stuck

1. **You need an NVIDIA GPU.** The whole assignment sits on CUDA kernels you compile yourself. The page's instructions assume PSC (`module load cuda/12.4.0`, Python 3.12+, a `uv` virtual environment); outside CMU you need your own CUDA machine or a cloud GPU
2. **Training time.** Going by the V100 reference, 10 epochs is roughly ten hours, longer on a slower card. Confirm the loss drops with small hyperparameters before starting a long run
3. **CUDA and driver versions.** FAQ Q1 covers nvcc being newer than the CUDA version the driver supports, which makes PyTorch abort with `Aborted (core dumped)`. The official fix is to align CUDA and PyTorch to the same version
4. **Get the earlier assignments right first.** Without HW1 and HW2, HW3 is missing its kernels and autodiff and cannot be started on its own
5. **No private tests.** The local pytest suite is only the public half. A BLEU of 20 ± 2 is something you can measure yourself, and it is the most reliable self-check available outside CMU

## Version note

The assignment site and repos are shared across semesters. Checking the [llmsys_hw3 commit history](https://github.com/llmsystem/llmsys_hw3/commits/main) on 2026-09-30:

- Several fixes landed during Spring 2026 (Feb 4–6: Embedding docstring, `datasets` version, Adam second-moment coefficient, transformer module filename, view backward)
- A commit on 2026-08-28, "add unit test for machine translation; cleanup code comment inconsistency", was merged into main on Sep 9 as part of Fall 2026

To match the spring version, the last commit before the Feb 18 deadline is `376bf97` (2026-02-06). Problem statements and points reflect what the page showed on the check date; Fall 2026 is in progress and may change them again.

## Further reading

- [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/): the Recitation 3 material, useful for comparing shapes and masking
- [CS336 series overview](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): CS336's first assignment also has you write a Transformer LM from scratch, but in PyTorch; in 11-868 the framework and kernels underneath are yours too
- [CMU 11-785 Lecture 18: attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [11-868 Assignment 3: Transformer Architecture](https://llmsystem.github.io/llmsystemhomework/assignment_3/)
- [llmsys_hw3 starter code repo](https://github.com/llmsystem/llmsys_hw3)
- [11-868 assignment site overview](https://llmsystem.github.io/llmsystemhomework/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L06 Transformer slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)
- [Radford et al., Language Models are Unsupervised Multitask Learners (GPT-2, 2019)](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Xiong et al., On Layer Normalization in the Transformer Architecture (2020)](https://arxiv.org/abs/2002.04745)
- [The Annotated Transformer (Harvard NLP)](https://nlp.seas.harvard.edu/annotated-transformer/)
