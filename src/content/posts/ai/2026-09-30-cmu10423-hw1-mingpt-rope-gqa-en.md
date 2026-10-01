---
title: "CMU 10-423 HW1: Adding RoPE and GQA to minGPT — Structure, Files to Edit, and Compute"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, transformer, attention, pytorch]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 4
tldr: "HW1 in CMU 10-423 Spring 2026 is worth 62 points. The written part covers RNN LMs (7), Transformer LMs (19), and sliding window attention (11). The programming part (22) has you implement RoPE and GQA in Karpathy's minGPT, train a character-level model on the complete works of Shakespeare, and plot loss and attention time. You upload only model.py; the handout ships five unit tests, and the official estimates put all experiments at about 40 minutes on a Colab T4."
description: "A guide to HW1, \"Generative Models of Text,\" in CMU 10-423/623/723 Generative AI (Spring 2026): the point table, what each written question tests, the minGPT starter files and TODOs, chargpt.py flags, the seven experiments with Colab/Kaggle compute estimates, the Slot A/B AI policy, and which materials are and aren't available outside CMU. No solutions."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 4 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and closes the text unit. The previous post, [L4: the modern Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en), explained RoPE, GQA, and sliding window attention. This one looks at how the homework makes you build them.

Official materials used: [hw1.zip](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip) from the [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html) (the 27-page hw1.pdf, starter code, and a LaTeX template), the [read-only Overleaf template](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1), the January 30 [HW1 recitation slides](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing) (public Google Slides), and the syllabus homework rules. **This post covers only the structure and setup of the assignment. It contains no solutions.**

## The basics

| Item | Details |
|---|---|
| Title | Homework 1: Generative Models of Text (the Coursework page calls it "Large Language Models") |
| Scope | L1–L4 (per the schedule) |
| Released | hw1.pdf says 2026-01-27; the schedule marks "HW1 out" on January 26 |
| Due | 2026-02-09, 11:59 pm (Slot A); the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) marks feedback on February 14 and Slot B on February 17, both tentative |
| Submission | Gradescope: one written PDF; code is `model.py` only |
| Total | 62 points |

Point table (hw1.pdf, page 1):

| Question | Points |
|---|---|
| LaTeX Template Alignment | 0 |
| Recurrent Neural Network (RNN) Language Models | 7 |
| Transformer Language Models | 19 |
| Sliding Window Attention | 11 |
| Programming: RoPE and GQA | 22 |
| Code Upload | 1 |
| Collaboration Questions | 2 |

The written part is worth 37 points, more than the programming part. If you only want coding practice, don't jump straight to Question 5.

### Understand Slot A and Slot B first

The [syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/) gives every homework two deadlines:

- **Slot A**: pure human work only, no AI assistance. The staff grade it and tell you which questions you got wrong.
- **Slot B**: due three days after you receive Slot A feedback. AI assistance and full collaboration are allowed, but only the questions you missed in Slot A are regraded.

Each question takes the higher of the two scores. The final score is 0.95 × the sum of per-question maxima, plus a 0.05 bonus for scoring above 50% in Slot A. Submitting AI-assisted work to Slot A is an academic integrity violation. No grace days apply to Slot A, and staff answer homework questions only while Slot A is open.

That is why the handout includes `.cursorignore`, `.aiderignore`, and `.vscode/settings.json` (which turns off GitHub Copilot and inline suggestions). hw1.pdf explains these files are there to make it easier to work without AI during Slot A.

## What the written questions test

### Question 2: RNN language models (7 points)

- **2.1**: Given an Elman RNN with activation slide(a) = min(1, max(0, a)) and W_hh fixed to the identity, set the remaining parameters so the output satisfies a specified logical condition.
- **2.2**: Both parts ask whether a bidirectional RNN can define an autoregressive language model. The difference is whether the BiRNN runs over the whole sequence or only over the prefix x₁:ₜ₋₁.

This ties back to [L1's RNN LM](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) and the definition of the autoregressive factorization.

### Question 3: Transformer language models (19 points)

- **3.1**: A conceptual question on why attention needs queries, keys, and values, then a step-by-step hand computation on three one-hot tokens, "birds fly away": Q, K, V, the score matrix, the attention matrix, and the output. Each step supplies its own fixed matrices, so an early mistake doesn't cascade.
- **3.2**: Compares the expressiveness of multiplicative, concatenated, and additive attention scores, for example whether they can learn the angle or cosine between two vectors.
- **3.3**: Asks whether the multi-head score matrix is always symmetric, then whether concatenating two heads' parameters into one single-head attention gives the same output as the two-head version.

### Question 4: Sliding window attention (11 points)

This question is written only, with no programming. The recitation slides also mark sliding window as "only written, no programming."

- **4.1**: Using the handout's example mask for N = 6 and w = 4, give the time and space complexity of the plain matrix-multiply-plus-mask approach.
- **4.2**: Fill in seven blanks in a `SlidingWindowAttention(Q, K, V, w)` pseudocode skeleton: the shape and initial values of the local score vector, the window loop range, the mapping from local index to token index, the bounds check, the score formula, and the weighted accumulation. The completed pseudocode must be asymptotically cheaper than the plain matrix multiply. You then state its time and space complexity.

It corresponds to the "for-loop implementation: asymptotically faster, less memory" row in the L4 slides.

## Programming: upgrading minGPT into "your own Llama-2"

In hw1.pdf's words, you will not be able to claim you trained a large language model, since the dataset is just Shakespeare, but you can reasonably claim you built your own Llama-2.

### Data and starter code

- **Data**: `input.txt`, the complete works of Shakespeare, about 1.1 MB, character-level with a vocabulary of 65.
- **Starter code**: adapted and simplified from Andrej Karpathy's [minGPT](https://github.com/karpathy/minGPT).

| File | Purpose | Edit it? |
|---|---|---|
| `chargpt.py` | Training entry point; flags adjust the config | Yes, when changing prompts |
| `mingpt/model.py` | The GPT model | **Main file to edit** |
| `mingpt/trainer.py` | Training loop | No |
| `mingpt/utils.py` | Logging and config helpers | No |
| `test_model.py` | Unit tests, same as on Gradescope | No |

`model.py` marks three areas with TODOs:

1. `RotaryPositionalEmbeddings`: `__init__`, `_build_cache`, and `forward`. hw1.pdf says forward should first build the cache if it doesn't exist yet.
2. `CausalSelfAttention`: initialize RoPE and fill in the forward path when RoPE is enabled.
3. `GroupedQueryAttention`: everything from initialization (checking that the embedding size divides by the head counts, Q/K/V and output projections, dropout, the causal mask, RoPE integration) to forward. hw1.pdf also asks you to record CUDA memory before and after the attention operation; `CausalSelfAttention` has reference code.

The `Block` class switches to `GroupedQueryAttention` automatically when `n_query_head != n_kv_head`, and uses the original `CausalSelfAttention` otherwise.

### Default model and flags

The default model has 6 layers, h = 6 attention heads per layer, maximum sequence length N = 16, d_model = 192, and d_k = 32. `chargpt.py` sets the learning rate to 5e-4; `trainer.py` defaults to batch size 64 and 600 iterations.

Useful flags (hw1.pdf, Table 1):

```bash
python chargpt.py --data.block_size=16        # sequence length
python chargpt.py --model.n_query_head=6 --model.n_kv_head=3   # GQA; query heads must divide by kv heads
python chargpt.py --model.rope=True           # enable RoPE
python chargpt.py --model.pretrained_folder=out/chargpt3       # continue from a previous run
python chargpt.py --trainer.max_iters=200 --trainer.device=cpu
```

Every 200 iterations, training generates 500 characters from the prompt "O God, O God!" and writes the model, training loss, attention time, and memory to JSON files under `work_dir`. Your plots come from those files.

### The seven experiments

| Question | Points | What you submit | Official estimate (Colab T4) |
|---|---|---|---|
| 5.1 | 2 | A sample from the RoPE model after 600 iterations at length 16 | ~3 min |
| 5.2 | 2 | A sample after another 600 iterations at length 256 | ~5 min |
| 5.3 | 2 | Read `GPT.generate()` and say whether it uses a KV cache, with an explanation | — |
| 5.4 | 4 | Loss curves for RoPE vs. vanilla minGPT over those 1,200 iterations | ~10 min |
| 5.5 | 4 | Average attention time with {1, 2, 3, 6} key heads | ~1 min |
| 5.6 | 4 | Loss curves for GQA (2 key heads) vs. vanilla, 200 iterations | ~6 min |
| 5.7 | 4 | Four curves: vanilla, RoPE only, GQA only, RoPE + GQA | ~16 min |

For 5.1 and 5.2, prompt with the first line of your favorite Shakespeare play, not the default line. Questions 5.5–5.6 use absolute position embeddings, not RoPE. By the official estimates, the programming part needs about 40 minutes of GPU time in total.

### Unit tests

`test_model.py` has five tests: T01 checks submitted files (only meaningful on Gradescope), T02 GQA, T03 RoPE, T04 GQA dropout, and T05 GQA with RoPE. hw1.pdf stresses that most of the programming grade still comes from manual review, so passing the tests is not full credit.

## Environment and compute: does it still run today?

hw1.pdf lists three routes:

- **Colab**: a free T4 GPU with time limits. If you run out, you can wait, switch accounts, pay for Colab, or move to Kaggle, GCP, or AWS.
- **Kaggle**: 30 free hours of T4 or V100 per week, which hw1.pdf says is enough for this assignment. It includes steps for enabling the GPU, turning on internet, and uploading files.
- **Local**: debug locally with `test_model.py`; training on CPU is not recommended.

I downloaded hw1.zip on 2026-09-30 and tested it (macOS, PyTorch 2.13, CPU):

- `python test_model.py` runs. T02–T05 raise `NotImplementedError` before you implement anything, which is expected.
- Unmodified `chargpt.py` ran 20 iterations on CPU in about 28 seconds, with loss dropping from 3.83 to 2.94. At that rate 600 iterations take well over ten minutes, so a GPU is the right call.

The assignment downloads no external data or weights. The dataset is in the zip and the only dependencies are PyTorch and einops, which makes it the easiest of the four homeworks to reproduce outside CMU.

Two mismatches between the handout and the zip, recorded as found:

- hw1.pdf's file list includes `requirements.txt` (torch, einops), but the zip actually ships `environment.yaml` (Python 3.10, pytorch, einops).
- hw1.pdf mentions importing a notebook for Kaggle, but the zip contains no `.ipynb`. And the `model.py` docstring says the RoPE formula is on "page 13 of the writeup," while this edition of the PDF has it on pages 18–19.

## What the recitation slides add

The January 30 recitation slides are public. They cover a minGPT intro, RoPE, GQA, einops, and sliding window, in that order:

- **RoPE**: walks through "Your cat is a lovely cat" word by word to show the rotation angle growing with position, generalizes from a 2D rotation matrix to the d-dimensional block form, ends with the matrix formula the homework uses, and notes that RoPE applies to the keys and queries.
- **GQA**: moves from the memory/speed trade-off between MHA and MQA to GQA, with diagrams of grouping, shared K/V per group, and concatenating and projecting back to n_embd.
- **PyTorch tools**: `torch.unsqueeze`, `torch.cat`, `torch.arange`, `torch.sin`/`torch.cos`, and `einops.rearrange`.

The "Supplemental Material" link in the same schedule row is a Google Drive file that returns 401 from outside CMU.

**What to do**: tonight, download hw1.zip, set up an environment with just PyTorch and einops, and run `python test_model.py` until you see four `NotImplementedError`s. Then open `model.py`, read only `CausalSelfAttention.forward`, and annotate every tensor's shape in a comment. Implementing GQA is mostly a matter of changing the head counts in that shape table.

## What this post can and cannot confirm

Confirmed: the PDF, starter code, and tests in hw1.zip; the recitation slides; the syllabus Slot A/B rules; and my local test results. Not confirmed: Gradescope's autograder and manual grading criteria, whether the tentative Slot B date on the schedule (February 17) held that semester, the contents of the HW1 Supplemental Material (401), and the official solutions.

Further reading: to write an LM from scratch and make the architecture choices yourself, see the [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en). Karpathy's original [minGPT repo](https://github.com/karpathy/minGPT) is also worth comparing against, to see what the course version simplified.

Series navigation: previous [L4: pre-training, fine-tuning, and the modern Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) | next [L5: CNNs, encoder-only Transformers, and ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) homepage and syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW1 handout (hw1.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW1 read-only Overleaf template](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1)
- [HW1 recitation slides (2026-01-30)](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [karpathy/minGPT](https://github.com/karpathy/minGPT)
- [Su et al. 2021: RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Ainslie et al. 2023: GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)
