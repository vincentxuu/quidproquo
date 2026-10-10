---
title: "Reading NTHU Kao's NLP: Parameter-Efficient Fine-Tuning — Fine-Tuning Large Models Without an A100 Cluster"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, course-guide, nlp, peft, lora, prompt-tuning, fine-tuning]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 13
tldr: "Hung-Yu Kao's Fall 2025 PEFT slides open with a budget: full fine-tuning of Llama 2-7B in 16-bit needs about 56GB of GPU memory, while training only 0.2M parameters brings it down to about 17GB, because gradients and optimizer states nearly vanish. Intrinsic dimensionality then explains why tuning a small slice is enough: the longer a model is pretrained and the larger it is, the fewer effective dimensions fine-tuning needs. Methods fall into additive (Adapters, Prompt Tuning), selective (BitFit), reparametrization (LoRA), and hybrid (MAM Adapters, S4). The second half runs from GPT-2's task descriptions and verbalizers to the trade-offs between prefix tuning and soft prompt tuning."
description: "A guide to W9 of Prof. Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (Fall 2025), based on W9_PEFT.pdf: GPU memory estimates for full fine-tuning versus PEFT, five benefits of PEFT, three findings on intrinsic dimensionality, the additive / selective / reparametrization taxonomy, Adapters, Prompt Tuning, BitFit, LoRA, MAM Adapters, S4, a method comparison table, prompt-based learning and verbalizers, and Prefix Tuning versus Soft Prompt Tuning."
draft: false
glossary:
  - term: "PEFT"
    aliases: ["Parameter-Efficient Fine-Tuning"]
    definition: "Freeze most of a pretrained model and train only a small subset of its parameters, or a small number of new ones, to adapt it to a new task."
    context: "The slides use it to answer the problem of full fine-tuning running out of memory."
  - term: "intrinsic dimensionality"
    aliases: ["intrinsic dimension"]
    definition: "The smallest dimension of a random subspace of the full parameter space in which optimization still reaches a given fraction (for example 90%) of the full optimization result."
    context: "The slides use it to explain why tuning a few parameters gets close to full fine-tuning."
  - term: "verbalizer"
    definition: "A one-to-one mapping from class labels to natural words in the model's vocabulary, such as positive → great, so an MLM can classify by filling in a blank."
    context: "The slides illustrate it with Yelp, SST-2, and MNLI in the prompt-based learning section."
  - term: "soft prompt"
    aliases: ["continuous prompt"]
    definition: "A sequence of trainable vectors prepended to the input that doesn't correspond to any real tokens."
    context: "Prompt Tuning adds them only at the input layer; Prefix Tuning adds them at every layer."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-peft)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on [W9_PEFT.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W9_PEFT.pdf) (61 pages) from the Fall 2025 (114-1) edition of Prof. Hung-Yu Kao's [Natural Language Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing) course at National Tsing Hua University. The W9 row of the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) attaches both this deck and the GPT-2 / T5 TA-session deck, with recordings [Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E) and [Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA) (in Mandarin). In the Week 9 Thu. captions the professor opens by saying this deck is the PEFT material "originally scheduled for week nine," so PEFT is in Thu.; it only reaches the adapter idea and the memory estimate, and the professor says LoRA comes next week. Week 9 Tue. has no captions, so its content could not be checked (frame captures in the GPT-2 / T5 post identify it as that TA session). The W9 Topics column says "ELMo, BERT, GPT, and T5"; it's a syllabus template that doesn't match the attached slides. Facts checked on 2026-09-30. Access grade **A3**: slides and recordings are public.

**Series**: Previous [GPT-3, InstructGPT, and RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf-en) | Next [RAG (Part 1): Hallucination and Retrievers](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

Every step of InstructGPT and Llama-2 in the last post touches every parameter in the model. A university lab, a small company, or a student in this course (the syllabus says "No GPU provided") who wants to adapt a 7B model to their own task hits GPU memory first.

This post answers one question: **how do you fine-tune a large model without an A100 cluster?**

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=zgjO_t5eu_E
title: Week 9 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=zWMHxXc0QvA
title: Week 9 Thu.
```

Original videos: [Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E)、[Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the Week 9 Thu. transcript was read. The professor opens by saying this deck is the PEFT material originally scheduled for week nine, then covers the Hovy ROCLING talk recap (three angles), the OpenAI compute-shortage news, the full fine-tuning memory estimate (7B, 16-bit, about 56 GB) and why training few parameters still does not shrink memory much, catastrophic forgetting, and the adapter idea (with the translator and plug-adapter analogies), and ends by saying LoRA comes next week. These parts match the post; the later parts on LoRA and prefix/prompt tuning exist only in the slides and are not covered in this video. The Week 9 Tue. YouTube page has no captions, so its content could not be checked.

## Opening: what's left for NLP in the LLM era

The deck opens with Eduard Hovy (CMU) from his ROCLING 2024 talk. The first slide is self-mockery repeated three times: "Look what an LLM can do! Why can it do that? I have no idea / that's future work / I've never thought about it." The second gives three directions: make LLMs usable (NLP engineering), make them useful (NLP applications), and make them understandable (NLP research). The first item under the first direction is tuning LLMs to domains and building smaller, cheaper models.

Next is an October 2024 TechCrunch story in which OpenAI's CEO says a lack of compute is delaying the company's products. If OpenAI is short on compute, the case for PEFT makes itself.

## First, the budget: how much memory full fine-tuning takes

The slides list PaLM 540B, MT-NLG 530B, and GPT-3 175B, then work through a real budget for Llama 2-7B (16-bit float, sequence length 4096, batch size 1):

| Item | Formula | Full fine-tuning | Training 0.2M params |
|---|---|---|---|
| CUDA | Fixed overhead | ~1GB | ~1GB |
| Model weights | size(float) × N_parameter | 13.03GB | 13.03GB (same) |
| Gradients | size(float) × N_trainable | 13.03GB | 0.4MB |
| Hidden states | Grow with layers, sequence length, heads | 3.16GB | 3.16GB (same) |
| Optimizer states | 2 × size(float) × N_trainable | 26.06GB | 0.8MB |
| **Total** | | **56.28GB** | **17.19GB** |

The key point: **gradients and optimizer states both scale with the number of trainable parameters**, and optimizer states (counted as twice the trainable parameters on the slide) are the biggest chunk. Shrink the trainable parameters and both nearly disappear. Weights and hidden states stay, so you never get to zero.

The slides also give a formula for hidden states and cite the hardware table from [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory), noting that inference at batch 1 with a 4k context needs only 24GB.

<details>
<summary>Hidden-state estimate (from the slides)</summary>

During training, roughly: 3·h·seq·bs + 18·L·h·seq·bs + 3·L·heads·seq² + vocab·seq·bs

L is the number of layers (32 for Llama 2-7B), heads the number of attention heads (32), h the hidden size, bs the batch size. The seq² term comes from attention scores, probabilities, and dropout.

</details>

### Not a new idea

The slides point out that computer vision has long updated only the last layer, that NLP experimented with static and non-static word embeddings, and that [ELMo](https://arxiv.org/abs/1802.05365) didn't fine-tune its contextualized embeddings at all. PEFT carries that old intuition over to LLMs.

### Five benefits of PEFT

1. Lower compute and storage costs.
2. Portability: each task stores a small set of parameters, and the general pretrained parameters are shared.
3. Less catastrophic forgetting: most parameters don't move, so language knowledge from pretraining is less likely to be overwritten.
4. Less overfitting when data is scarce.
5. Performance close to full fine-tuning. The slides' example: adding a small adapter lands within 1% of fully fine-tuned BERT on several NLU benchmarks.

There's also a comparison on RTE (DeBERTa-v3-base). Full fine-tuning scores 83.75% training 184M parameters. LoRA scores 86.60% training 0.8M (0.43%). AdaLoRA scores 88.09% with 1.27M (0.69%). In this example, the methods with fewer parameters score higher.

## Why a small slice is enough: intrinsic dimensionality

The definition from [Li et al. (ICLR 2018)](https://arxiv.org/abs/1804.08838): in a D-dimensional parameter space, optimize only within a random d-dimensional subspace and ask how large d must be to reach a given fraction of the full result. d90 is the dimension needed for 90%.

The numbers on the slide are striking. A fully connected network on MNIST has 199,210 parameters, yet d90 is only 750 (0.38%). A ConvNet on Atari Pong has 1,005,974 parameters and d90 is 6,000 (0.60%). **For many problems, the effective dimension is two to three orders of magnitude smaller than the parameter count.**

[Aghajanyan et al. (ACL 2021)](https://arxiv.org/abs/2012.13255) carried the idea to language model fine-tuning. The slides draw three findings:

- Many problems have small intrinsic dimensions.
- For RoBERTa-base on six datasets (MRPC, QQP, Yelp Polarity, SST-2, MNLI, ANLI), the intrinsic dimension of fine-tuning drops the longer pretraining runs.
- At a fixed number of pretraining updates, larger models need a lower intrinsic dimension to fine-tune on MRPC.

Put together: **pretraining already moves the model to a spot where a small adjustment adapts it to a new task**, and more so for larger models. That's the theory behind PEFT.

## Method map: three families plus hybrids

The slides follow the taxonomy of the [Lialin et al. 2023](https://arxiv.org/abs/2303.15647) survey:

| Type | Approach | Examples |
|---|---|---|
| Additive | Add new trainable parameters; freeze the original model | Adapters, Prompt Tuning, Prefix Tuning |
| Selective | Train only a chosen subset of the original parameters | BitFit |
| Reparametrization | Represent the weight update with low-rank matrices | LoRA |
| Hybrid | Combine the above | MAM Adapters, S4 |

### Adapters

[Houlsby et al. 2019](https://arxiv.org/abs/1902.00751) insert a small bottleneck network after attention and after the FFN. It projects d-dimensional features down to a smaller m, applies a nonlinearity, and projects back to d. With m much smaller than d, each task adds few parameters. The slides also list later variants: Bottleneck Adapter (2019), Parallel Adapter (2020), and Compact Adapter (2021).

### Prompt Tuning

[Lester et al. 2021](https://arxiv.org/abs/2104.08691) prepend a sequence of trainable vectors (a soft prompt) to the input embeddings. The model stays frozen and only those vectors update. That makes multi-task serving easy: each task is a prompt, not a model, and one batch of inputs can carry prompts for different tasks.

```python
# Pseudocode from the slides
soft_prompt = torch.nn.Parameter(torch.rand(num_tokens, embedding_dim))

def input_soft_prompt(x, soft_prompt):
    return concatenate([soft_prompt, x], dim=seq_len)

train(model(input_soft_prompt(x, soft_prompt)))  # only soft_prompt is updated
```

### BitFit

[Ben Zaken et al. 2022](https://arxiv.org/abs/2106.10199) fine-tune only the bias terms (in LayerNorm, FFN, and attention) and freeze everything else. In code, you hand the optimizer every parameter whose name contains "bias".

### LoRA

In [Hu et al. 2021](https://arxiv.org/abs/2106.09685), the original weight W (d×d) is frozen and a side path B·A is added: A compresses the input to r dimensions and B expands it back to d, with r much smaller than d. The slide shows the initialization. A is sampled from N(0, σ²) and B is set to 0, so the side path outputs zero at the start and the model behaves exactly like the original. α is a scaling factor.

In the comparison table, LoRA's edge is **no inference overhead**: after training you can add B·A back into W, and the architecture doesn't change.

### Hybrids: MAM Adapters and S4

[He et al. (ICLR 2022)](https://arxiv.org/abs/2110.04366) put adapters, prefix tuning, and LoRA in one framework and assembled the MAM Adapter: a scaled parallel adapter on the FFN layer plus a soft prompt.

[Chen et al. (ICLR 2023)](https://arxiv.org/abs/2301.01821) treat PEFT design as a search problem, decided in four steps: how to group layers, how to allocate trainable parameters, which groups to tune, and which method each group uses (Adapter, Prefix, BitFit, LoRA). Under a 0.1% extra-parameter budget, the search found spindle grouping, uniform allocation, tuning every group, and then picked method combinations for the four groups in sequence.

### Comparison table and selection criteria

The slides' comparison, following Lialin et al. (excerpt):

| Method | Type | Inference overhead | Trainable parameters |
|---|---|---|---|
| Adapters | A | Extra FFN | 0.1%–6% |
| Prompt Tuning | A | Longer input | 0.1% |
| BitFit | S | — | 0.5% |
| LoRA | R | None | 0.01%–0.5% |
| MAM Adapters | A | Extra FFN and input | 0.5% |
| S4 | A+S+R | Extra FFN and input | 0.5% |

To choose, the slides ask four questions. How many parameters? How efficient is training (do you backpropagate through the original network, can you keep the GPU busy)? How efficient is inference (are parameters added, and at what cost)? And how accurate is the result?

## Second half: prompt-based learning

The last section takes a different angle: instead of changing the model, change what the input looks like. There are hard prompts (discrete, real text) and soft prompts (continuous vectors).

### Fine-tuning with task descriptions

The idea already appears in the [GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf): put a task description like "translated to English:" in the input and the model knows what to do.

[Schick & Schütze (EACL 2021)](https://arxiv.org/abs/2001.07676) apply it to MLM classification. To rate a Yelp review from 1 to 5 stars, rewrite the input as "review [SEP] In summary, the restaurant is [MASK]." and use a **verbalizer** to map labels to words: 1→terrible, 2→bad, 3→okay, 4→good, 5→great. [Gao et al. (ACL 2021)](https://arxiv.org/abs/2012.15723) add SST-2 (positive→great, negative→terrible) and MNLI (entailment→Yes, neutral→Maybe, contradiction→No).

Two benefits. Classification becomes generation, so you reuse the MLM's output layer instead of adding a classifier. And you need fewer training examples to match standard fine-tuning.

The slides note this helps GPT-3 too. Adding task descriptions without fine-tuning is in-context learning; fine-tuning with them is prompt-based fine-tuning.

### Problems with discrete prompts

- There are too many possible descriptions to find the best one.
- Searching for the best description per task is expensive.
- Discrete text can't be optimized directly with gradients during training.

Those three points lead to soft prompts.

### Prefix Tuning and Soft Prompt Tuning

**Prefix Tuning** ([Li & Liang, ACL 2021](https://arxiv.org/abs/2101.00190)) was designed for generation. It prepends p virtual hidden states at **every layer**, mimicking virtual outputs of self-attention. The pretrained model (GPT-2 / BART) is frozen and only these states train. In practice they're first reparametrized through an MLP, which stabilizes training. Initialization matters: with little data, random initialization gives low, high-variance scores, and initializing with task words like "summarization" or "table-to-text" works better. With full data it makes no difference. [P-Tuning v2](https://arxiv.org/abs/2110.07602) does the same thing, tested on NLU tasks.

**Soft Prompt Tuning** (Lester et al. 2021) prepends p trainable vectors only at the **input layer**, with a frozen T5. For initialization, words from the class labels work best. Small models show large gaps between initializations; at XXL size the gaps disappear.

The slides' comparison:

| | Prefix Tuning | Soft Prompt Tuning |
|---|---|---|
| Trainable parameters | More (prefix length × hidden size × layers) | Fewer (prompt length × hidden size) |
| Inference speed | Slower | Faster |
| Performance | Better | Worse |
| Use case | Beats full fine-tuning in few-shot settings; no difference with abundant data | Same |

## How to self-study this lecture

1. Redo the memory budget table for a 13B model. If you can, you understand why PEFT saves on gradients and optimizer states rather than weights.
2. Use Hugging Face's [PEFT library](https://github.com/huggingface/peft) to run LoRA and prompt tuning on a small model. Print `print_trainable_parameters()` and compare with the parameter ratios in the slides' table.
3. Read Figure 1 of the [LoRA paper](https://arxiv.org/abs/2106.09685) and check that you see why the A and B initialization makes training start from the original model.
4. The series post on [HW3 multi-output learning](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en) specifies bert-base-uncased. Once you finish it, try wrapping it in LoRA and compare memory and scores.

One thing to do tonight: open the training script you're using, compute the ratio of trainable to total parameters, and use the slide's formula to estimate how much memory the optimizer states take.

## Further reading

- Efficient adaptation from prompting to LoRA: [CS224N Lecture 8: Efficient Adaptation](/posts/ai/2026-08-22-cs224n-efficient-adaptation-en)
- Memory and parameter budgets in training: [Reading CME295: LLM Training](/posts/ai/2026-09-29-cme295-llm-training-en)
- Fine-tuning without losing old abilities: [Reading NTU Hung-yi Lee ML 2026: HW5 Fine-tuning Without Forgetting](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Week 9 Thu. is confirmed as the PEFT session (it only reaches the adapter idea and the memory estimate); Week 9 Tue. has no captions and could not be checked.

## References

- [IKMLab/NTHU_Natural_Language_Processing (GitHub)](https://github.com/IKMLab/NTHU_Natural_Language_Processing) — course repo
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — slides and recordings attached to the W9 row
- [W9_PEFT.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W9_PEFT.pdf) — source of every table, formula, and category in this post
- [[Fall 2025] Week 9 Tue. recording](https://www.youtube.com/watch?v=zgjO_t5eu_E) (in Mandarin)
- [[Fall 2025] Week 9 Thu. recording](https://www.youtube.com/watch?v=zWMHxXc0QvA) (in Mandarin)
- [hiyouga/LLaMA-Factory hardware requirements](https://github.com/hiyouga/LLaMA-Factory)
- [Li et al., Measuring the Intrinsic Dimension of Objective Landscapes (ICLR 2018)](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al., Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning (ACL 2021)](https://arxiv.org/abs/2012.13255)
- [Lialin et al., Scaling Down to Scale Up: A Guide to Parameter-Efficient Fine-Tuning (2023)](https://arxiv.org/abs/2303.15647)
- [Houlsby et al., Parameter-Efficient Transfer Learning for NLP (ICML 2019)](https://arxiv.org/abs/1902.00751)
- [Lester et al., The Power of Scale for Parameter-Efficient Prompt Tuning (EMNLP 2021)](https://arxiv.org/abs/2104.08691)
- [Ben Zaken et al., BitFit (ACL 2022)](https://arxiv.org/abs/2106.10199)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models (ICLR 2022)](https://arxiv.org/abs/2106.09685)
- [He et al., Towards a Unified View of Parameter-Efficient Transfer Learning (ICLR 2022)](https://arxiv.org/abs/2110.04366)
- [Chen et al., Parameter-Efficient Fine-Tuning Design Spaces (ICLR 2023)](https://arxiv.org/abs/2301.01821)
- [Schick & Schütze, Exploiting Cloze Questions for Few Shot Text Classification and NLI (EACL 2021)](https://arxiv.org/abs/2001.07676)
- [Gao et al., Making Pre-trained Language Models Better Few-shot Learners (ACL 2021)](https://arxiv.org/abs/2012.15723)
- [Li & Liang, Prefix-Tuning (ACL 2021)](https://arxiv.org/abs/2101.00190)
- [Liu et al., P-Tuning v2 (ACL 2022)](https://arxiv.org/abs/2110.07602)
- [huggingface/peft (GitHub)](https://github.com/huggingface/peft)
