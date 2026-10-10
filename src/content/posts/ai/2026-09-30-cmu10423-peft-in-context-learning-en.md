---
title: "CMU 10-423 L10–L11: Parameter-Efficient Fine-Tuning and In-Context Learning — Change a Few Weights, or Just the Input?"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, peft, lora, fine-tuning, in-context-learning, prompt-engineering]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 10
tldr: "With a small labeled dataset and an LLM with billions of parameters, CMU 10-423 offers two routes: supervised fine-tuning, or putting the examples in the prompt for in-context learning. L10 first notes that the 2023 consensus was that fine-tuning usually wins, then covers four ways to tune only a few parameters: the top layers only, adapters, prefix tuning, and LoRA. The first half of L11 returns to in-context learning: how sensitive it is to example order and label balance, how to pick a prompt, and what chain-of-thought is. HW3's written questions and its LoRA programming task both draw on these two lectures."
description: "A guide to CMU 10-423/623/723 Generative AI (Spring 2026) Lecture 10, \"Parameter Efficient Fine-Tuning,\" plus the zero-shot/few-shot and prompting slides at the end of Lecture 9 and the in-context learning, prompt engineering, and chain-of-thought slides in the first half of Lecture 11: the SFT vs. ICL trade-off, top-K layer tuning, adapters, prefix tuning, LoRA's motivation and initialization, the memory and speed details, PEFT on ViT, and where this material shows up in HW3 and the practice exam."
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter efficient fine-tuning"]
    definition: "Fine-tuning only a small subset of a model's parameters (or a small number of added ones) while the pretrained weights stay frozen, aiming to match full fine-tuning."
    context: "CMU 10-423 L10 covers four approaches: tuning only the top K layers, adapters, prefix tuning, and LoRA."
  - term: "prefix tuning"
    definition: "Pretends a sequence of prefix tokens comes before the real tokens and trains only those prefixes' key/value vectors in each layer, with all Transformer parameters frozen."
    context: "The third PEFT method in L10; the slides note the prefix parameters are produced by a lower-dimensional MLP for training stability."
    links:
      - label: "Li & Liang 2021"
        url: "https://arxiv.org/abs/2101.00190"
  - term: "in-context learning"
    aliases: ["ICL"]
    definition: "Putting a task description and a few input/output examples directly in the prompt, without updating any parameters, so the LLM infers the pattern and answers during generation."
    context: "L10 and L11 treat it as the alternative to supervised fine-tuning and compare the two."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 10 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and opens the third unit, "Applying and adapting foundation models." The main material is the February 16 [Lecture 10 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf) (Aran Nayebi and Matt Gormley), plus the zero-shot/few-shot and prompting slides at the end of the February 11 [Lecture 9 deck](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf) and the in-context learning and prompt engineering slides in the first half of the February 18 [Lecture 11 deck](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf). The VAE half of L9 is in [part 8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en), and the instruction tuning and RLHF half of L11 is in [part 11](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en).

I checked every fact against the official materials on 2026-09-30. From L9 onward the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) lists no readings, so this post cites only the slides and the figure sources they name. Access level **A3**: slides, homework, and the practice exam are public; lecture recordings are on CMU Panopto and not viewable from outside.

**Series position**: previous [HW2: implementing DDPM from scratch on AFHQ cats](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) | next [L11–L12: instruction tuning, RLHF, and DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## Why the course goes from images back to LLMs

Once HW2 is in, the next assignment, [HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en), has you fine-tune GPT-2 with LoRA for sentiment classification. These two lectures lay the groundwork. The question is practical: you have a pretrained model with billions of parameters and a small labeled dataset. How do you get the model to learn your task?

The first real slide of L10 splits the answer into two routes:

| | A: Supervised fine-tuning (SFT) | B: In-context learning (ICL) |
|---|---|---|
| How | Fine-tune on the training data with a standard supervised objective, backprop, and your favorite optimizer (e.g. Adam) | Feed the training examples to the LLM as a prompt, let it infer the pattern while decoding, and take the output after the prompt as the prediction |
| Pros | Fits the standard ML recipe; still works when N is large | No backprop, and one pass through the training data; needs only API access, not weights |
| Cons | Backprop needs about 3x the memory and time of the forward pass; with a proprietary model you may not have the weights at all | A Transformer needs O(N²) time and space for a prompt of length N; the prompt may not fit in the maximum context |

The rest of this post follows that table: first how to make A cheaper (PEFT), then the pitfalls of B (ICL and prompt engineering).

## First, the end of L9: zero-shot, few-shot, and prompting

After VAEs, L9 opens this unit with a few slides:

- **Zero-shot learning**: the training data contains no examples of the labels that appear at test time. The slide's answer is to "cheat" and use a description of the label instead.
- **Few-shot learning**: each label has only a handful (two, three, or four) of examples.
- **Prompting**: an autoregressive LM defines p(x₁:T) = ∏ p(x_t | x₁, …, x_{t−1}). The key idea of prompting is to give the model a prefix whose likely completion is the answer you want.

The slides then use examples from the GPT-3 paper to show zero-shot use: feed in the context, watch how the model completes it, and do no extra training. That's enough to answer factual questions, complete sentences, solve analogies, and do reading comprehension.

## Fine-tuning usually beats ICL, at least as of 2023

If ICL is so convenient, why fine-tune? L10's answer: even for very large LMs, fine-tuning usually wins.

The slides use GPT-3 results from the [LoRA paper](https://arxiv.org/abs/2106.09685), where fine-tuning beats few-shot by a wide margin on two tasks. The reason is concrete. GPT-3's context is only 2048 tokens, so the few-shot MNLI-m setting fits just 6 examples in total. The fine-tuned version used all 393,000 MNLI-m training examples for 2 epochs.

A study that compares the two under fair conditions (the slides cite [this ACL 2023 Findings paper](https://aclanthology.org/2023.findings-acl.779.pdf)) also finds fine-tuning ahead on RTE and MNLI for most model sizes.

The slides add a caveat here: "At least this was the general wisdom in 2023." The story may be different since 2024, and the course returns to it in L19 (long context).

## PEFT: tune a few parameters, get close to full fine-tuning

The slide states PEFT's goal plainly: fine-tune fewer parameters but reach downstream performance comparable to fine-tuning all of them. L10 covers four approaches:

| Method | How |
|---|---|
| Subset | Fine-tune only some parameters, e.g. the top K layers of a K+L layer network |
| Adapters | Add new layers with few parameters, tune only those, freeze everything else |
| Prefix tuning | Pretend many tokens come before your sequence and tune only their keys/values |
| LoRA | Learn a small delta for each parameter matrix, with the delta constrained to be low rank |

### Tuning only the top layers

The simplest baseline: freeze everything except the top K layers. Gradients only flow through K layers, and you don't have to store adjoints (the gradient of the loss with respect to each parameter) for the whole computation graph, which saves memory. It works with almost any deep network.

The slide asks why this should work at all. Its answer: earlier layers capture general language features, and higher layers capture task-specific ones.

### Adapters

An adapter layer is a feedforward network with one hidden layer and a residual connection. Input and output have dimension d, with a bottleneck of dimension r in the middle. In practice r is much smaller than d, and adapter layers hold only 0.5%–8% of the total parameters. Once they're inserted into a Transformer, every pretrained parameter is frozen and only the adapters are fine-tuned.

The slides cite [Houlsby et al. 2019](https://arxiv.org/abs/1902.00751) on BERT-Large. Adapters nearly match full fine-tuning with far fewer parameters, and sometimes beat it. The baseline is fine-tuning only the top K layers of BERT-Large. The slide's comment: "Interesting: it works even though the grey modules are kept fixed!"

### Prefix tuning

Following [Li & Liang 2021](https://arxiv.org/abs/2101.00190), prefix tuning works like this:

1. Treat token i's activation in each layer and head as its key/value vectors.
2. Insert dummy prefix tokens before the real tokens. Each prefix token's activation comes directly from trainable parameters P_θ.
3. P_θ is itself produced from a lower-dimensional Q_θ through an MLP, because that makes training more stable.
4. During training, all Transformer parameters stay frozen and only θ is tuned.

In other words, it changes neither the model nor the input text. It adds learnable keys and values in front of the attention in every layer.

### LoRA

LoRA is the centerpiece of this lecture and the method HW3's programming part asks you to implement. The slides build three layers of motivation.

**How big are these models?** The slides show a comparison table from GPT-2 to LLaMA-3 and point out that one linear layer in GPT-3 is 12k × 12k. Full fine-tuning stores gradients and optimizer state for every such matrix.

**Why don't LLMs overfit when fine-tuned without regularization?** The slides' hypothesis: they are intrinsically low dimensional. [Li et al. 2018](https://arxiv.org/abs/1804.08838) define the intrinsic dimension as follows: train in a random lower-dimensional subspace, increase its dimension step by step, and take the dimension at which solutions reaching 90% of full-parameter performance first appear. In their MNIST example, the original network has 199,210 parameters but an intrinsic dimension of only 750. [Aghajanyan et al. 2020](https://arxiv.org/abs/2012.13255) measure LLMs the same way and find that pretraining lands on parameters with low intrinsic dimension.

**The LoRA paper's own three motivations**:

1. Inspired by those two papers, over-parameterized models actually lie on a low intrinsic dimension.
2. Optimizing the prompt directly, as prefix tuning does, gives performance that changes non-monotonically with the number of parameters. We want more parameters to mean better performance.
3. Adapters and related methods add non-trivial latency at inference time.

**The core idea**: freeze the pretrained weights W₀ and learn only an additive change ΔW, factored as a low-rank product BA:

- W₀ ∈ ℝ^{d×k}, A ∈ ℝ^{r×k}, B ∈ ℝ^{d×r}, with r much smaller than min(d, k)
- The output changes from z = W₀x to z = W₀x + BAx = (W₀ + BA)x

<details>
<summary>Details the slides emphasize</summary>

- **Initialization**: each entry of A is drawn from N(0, σ²), and B is set to 0. So ΔW = BA = 0 at the start, and fine-tuning begins from the pretrained weights.
- **Hot swapping**: W₀ and BA have the same shape, so you can merge them into a standard linear layer with W ← W₀ + BA and remove them later with W ← W − BA. Train B′A′ for one task and B″A″ for another, and you can switch back and forth.
- **Bias**: LoRA itself doesn't touch the bias. The bias is already rank 1, so there's no rank left to reduce. Most implementations offer an option to also fine-tune the bias, but it needs no special machinery.
- **Where to apply it**: LoRA layers could replace every linear layer in a Transformer, but the original paper applies them only to the attention weights. For GPT-3, the authors found it most efficient to apply LoRA to the query and value layers only. During training, only the new LoRA parameters are tuned.

</details>

The slides summarize LoRA's GPT-3 results: performance almost as good as full fine-tuning with far fewer parameters, better on some tasks, rank r = 1 sufficient for some datasets, and good results whether the dataset is large or small.

### Memory and speed: less simple than it looks

The slides raise a question people often skip: all the pretrained parameters still sit in memory during training, so why does LoRA use less? Because while the total parameter count is actually higher than before, far fewer gradients are needed, and so far less optimizer state.

Speed is subtler. The slides say faster training is one of the main reasons people use PEFT, but the reasons are nuanced. Three effects compete:

1. Slowdown from the extra computation (true of LoRA, adapters, and prefix tuning; not of top-K tuning).
2. Speedup from computing fewer gradients (true of all four).
3. Speedup from using a larger batch, since much less GPU memory is used (true of all four).

Which effect wins isn't obvious and may even depend on hyperparameters such as batch size. The slides point to [an Anyscale post that measures LoRA throughput on Llama-2 7B](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2) as an example.

### It works on ViT too

The last section ties back to [ViT from L5](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en): a ViT is just another Transformer, so LoRA applies directly. The results the slides cite show that on VTAB-1k (19 vision tasks), parameter-efficient transfer learning sometimes beats full fine-tuning.

## First half of L11: the fine print on in-context learning

L11 (the slides credit Pat Virtue) opens by repeating the SFT vs. ICL table, then focuses on route B.

### What few-shot ICL is sensitive to

Few-shot learning can be done through ICL: give a task description first, then a sequence of input/output examples from the training data. That's the format from the [GPT-3 paper](https://arxiv.org/abs/2005.14165).

The slides list three things that affect ICL:

1. The order in which the examples appear (citing [Lu et al.](https://arxiv.org/abs/2104.08786))
2. How balanced the labels are, e.g. how many positive vs. negative
3. How many distinct labels the examples cover

Then a counterintuitive result: you'd expect it to matter whether the examples carry their true labels, and that more examples help. According to [Min et al.](https://arxiv.org/abs/2202.12837), that's not always the case.

### Prompt engineering: how to pick a prompt

The slides pose a question with a fixed setup: news topic classification (AG News), OPT-175B, zero-shot. Keep everything the same and change only the prompt. Do you get the same results? No, so you need to choose a prompt.

The slides' method: **pick the prompt with the lowest perplexity (highest likelihood) under the model**. A second setup shows the same thing: French word-level translation (the NorthEuraLex dataset), the multilingual model Bloom, zero-shot, same conclusion.

### Chain-of-thought

The last section covers chain-of-thought prompting:

- In few-shot ICL, asking the model to reason about its answer can improve performance.
- Chain-of-thought prompting puts that reasoning into the in-context examples ([Wei et al.](https://arxiv.org/abs/2201.11903)).
- But the model also does better if you give no reasoning examples and simply tell it to reason step by step ([Kojima et al.](https://arxiv.org/abs/2205.11916)).

## Where these lectures show up in homework and tests

- **HW3** (Applying and Adapting LLMs, 66 points, released February 21, due March 12) splits its points as In-Context Learning 14, Parameter Efficient Fine-Tuning 10, Direct Preference Optimization 15, and Programming: LoRA for GPT-2 25. The ICL section asks you to contrast ICL with few-shot chain-of-thought, write ICL, one-shot CoT, and zero-shot CoT prompts for the same question, and discuss the pros and cons of zero-shot CoT. The PEFT section asks you to count the parameters in a fully connected network, how many you'd tune with a bottleneck adapter, and how attention weights are computed under prefix tuning. Details are in the [HW3 guide](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en).
- **Quizzes**: the schedule puts Quiz 2 (L5–L9) in class on the day of L10, and Quiz 3 on February 25. The Reminders slide in L12 says Quiz 3 covers Lectures 10, 11, and 12 (RLHF/DPO only). Quiz questions aren't available outside CMU.
- **[Practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)**: question 9, In-context Learning, is worth 8 points. The 167-point exam has no separate PEFT question.

## How to self-study this

1. Read L10's opening SFT/ICL table and, for each pro and con, write down a situation where you've run into it.
2. When you read the LoRA section, do the arithmetic yourself: with d = k = 12,288 (the slide's "12k × 12k") and r = 8, what percentage of the original matrix do the LoRA parameters add? That's a warm-up for questions like HW3's 5.2.
3. Read L11's slides on ICL sensitivity, pick an LLM you can call, and try one set of examples in three different orders to see whether the output changes.

One thing to do tonight: open the LoRA Initialization slide in L10, write one sentence on why B, not A, is set to 0, then check it against the method section of the LoRA paper.

## Further reading

- The same material in other courses: [CS224N Lecture 7: pre-training, subwords, and in-context learning](/posts/ai/2026-08-22-cs224n-pretraining-en), [CS224U: in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning-en)
- What LoRA saves in training cost: [CME295 Lecture 4: the bill for LLM training](/posts/ai/2026-09-29-cme295-llm-training-en)
- Course status and a self-study path: [CMU 10-423 series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L9–L11 dates, Quiz 2 and Quiz 3
- [Lecture 9 slides: VAEs / In-context learning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf): zero-shot, few-shot, prompting
- [Lecture 10 slides: Parameter Efficient Fine-Tuning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf)
- [Lecture 11 slides: In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf): Quiz 3 scope on the Reminders slide
- [HW3 handout (hw3.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip): point breakdown and question structure
- [Practice Exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Hu et al. 2021: LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Houlsby et al. 2019: Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Li & Liang 2021: Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Li et al. 2018: Measuring the Intrinsic Dimension of Objective Landscapes](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al. 2020: Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning](https://arxiv.org/abs/2012.13255)
- [Mosbach et al. 2023 (ACL Findings): Few-shot Fine-tuning vs. In-context Learning](https://aclanthology.org/2023.findings-acl.779.pdf)
- [Anyscale blog: comparing LoRA and full-parameter fine-tuning on Llama-2](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2)
- [Brown et al. 2020: Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)
- [Lu et al. 2021: Fantastically Ordered Prompts and Where to Find Them](https://arxiv.org/abs/2104.08786)
- [Min et al. 2022: Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837)
- [Wei et al. 2022: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022: Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
