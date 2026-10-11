---
title: "CMU 10-423 L15–L16: Scaling Laws and Mixture of Experts — How Big Should the Model Be, and How Do You Compute Only Part of It?"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, scaling-laws, mixture-of-experts, moe, llm, training-data]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 16
tldr: "The first two lectures of the Scaling Up unit in CMU 10-423 Spring 2026 answer two questions. The second half of L15 covers scaling laws: Kaplan 2020 says 8x more parameters needs only about 5x more data, Chinchilla says scale both equally, and the Phi models and data-filtering scaling laws add data quality as a third axis. L16 covers MoE: feed-forward layers hold most of GPT-3's parameters, so split them into experts and send each token through only the top k. Memory follows total parameters, compute follows active parameters, and the price is load balancing and training stability. No programming homework covers this half of the course; quizzes, practice exam question 13, and the final project do."
description: "A guide to Lecture 15 (second half) and Lecture 16 of CMU 10-423/623/723 Generative AI (Spring 2026): the power-law form, Kaplan 2020's experimental design and seven takeaways, Chinchilla's proportional scaling, the Phi models and data-filtering scaling laws; then MoE from the feed-forward parameter share, dense and sparse gating, noisy top-k, expert parallelism and capacity, load-balance loss and router z-loss, to active parameters and choosing the number of experts. Includes notes on slide versions and what outside readers can access."
draft: false
glossary:
  - term: "active parameters"
    aliases: ["active params"]
    definition: "In an MoE model, the parameters the router selects and actually uses to process a token. Total parameters set how much memory you need; active parameters set how many FLOPs each token costs."
    context: "The L16 slides use Mixtral (2 of 8 experts) and OLMoE (8 of 64 experts) to show the difference."
  - term: "router z-loss"
    aliases: ["z-loss", "Router Z-loss"]
    definition: "A regularizer added to the MoE training objective that penalizes large router logits to stabilize training."
    context: "The L16 slides follow OLMoE and add it to the total loss alongside the load-balance loss."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This guide is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 16 of [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) and opens the fifth unit, "Scaling Up". The previous post, [HW4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en), was the last programming assignment. From here on the course checks your learning through quizzes, HW623 (10-623/723 only), and the final project.

Official materials used: the [Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf) (37 pages; the Querying Transformer half is covered in [part 14](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en), so this post reads only the Scaling Laws section), the [Lecture 16 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf) and their [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf), the [course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), and the practice exam on the [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html). I downloaded and checked all of them on 2026-09-30. The schedule lists no readings for these two lectures, so every paper cited here is one the slides cite.

> **Version note**: Both PDFs linked from the March 16 Lecture 16 row have a cover reading "Matt Gormley & Pat Virtue, Mar. 17, 2025", a reminder slide with Spring 2025 HW4 dates, and a 2025 creation date. Spring 2026 reused last year's MoE deck. The Scaling section of L15 is marked "Scaling slides credit: Pat Virtue". Recordings are on CMU's internal Panopto and not visible from outside, so this post relies entirely on the slides.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. On 2026-10-10 the anonymous Panopto folder listed no videos and prompted sign-in. The course homepage and schedule link no public (YouTube) recordings; an instructor post dated 2026-04-08 said YouTube recordings were “coming very soon”, but no such link had appeared on the official pages when checked. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

Checked: 2026-10-10.

## Why this comes after multimodal models

The schedule groups L15–L18 as "Scaling Up". The first 14 lectures asked what models look like and how to train them. This unit turns to engineering: with limited money and GPUs, how big should the model be, how much data should it see, and what do you do when it doesn't fit?

The four lectures split the work cleanly. L15–L16 answer "how big" and "can a big model compute less", and L17–L18 in the [next post](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en) answer "how do you actually run it".

## L15, second half: scaling laws

### It starts with a question

The Scaling section opens with two timelines, one for language models and one for image generation, and a question: Transformers appeared in 2017 and took over NLP immediately, so why did Vision Transformers take until 2021? The slides don't answer directly. They move to a table of LLM sizes from GPT-2 to LLaMA-3, with the section's guiding question beside it: **how did Meta choose this combination of training tokens and model parameters?**

Some rows from the table (as on the slide):

| Model | Year | Training tokens | Parameters |
|---|---|---|---|
| GPT-2 | 2019 | ~10 billion | 1.5 billion |
| GPT-3 | 2020 | 300 billion | 175 billion |
| Chinchilla | 2022 | 1.4 trillion | 70 billion |
| LLaMA-2 | 2023 | 2 trillion | 70 billion |
| LLaMA-3 | 2024 | 15 trillion | 405 billion |

Next comes a "how much did it cost to train Llama?" exercise. It gives a GPU price (around $15k), cloud GPUs at $1–4 per hour, and the electricity cost of a 700W card, and asks you to estimate the cost of Llama-3 70B. The answer box is empty on the slide, and the schedule has no inked version of L15.

### Power laws and Kaplan 2020

Most LLM scaling laws assume a **power law** between loss and some quantity, of the form $f(x) = c\,x^{-k}$. The slide plots the same curve on linear and log-log axes: on log-log axes it's a straight line.

For [Kaplan et al. 2020](https://arxiv.org/abs/2001.08361), the slides list what the experiments varied: parameters N (768 to 1.5B), data D (22M to 23B tokens), compute C, model shape (depth, width, heads), context length (up to 1024), and batch size. They then measured each model's test loss.

The seven takeaways the slides step through:

1. Three quantities dominate: parameters N, tokens D, and FLOPs C.
2. Model shape doesn't matter much.
3. Performance improves as long as N and D grow together.
4. Training and test loss curves follow predictable power laws.
5. Larger models are more sample-efficient.
6. You don't need to train to convergence to get good performance.
7. The best batch size also follows a power law, and it's huge (1–2M tokens).

The last of these slides quotes Kaplan: every time model size grows 8x, data needs to grow only about 5x to avoid a penalty. The next line reads: "But Hoffman et al. (2022) tell a very different story!"

### Chinchilla: everyone was using too little data

[Hoffmann et al. 2022](https://arxiv.org/abs/2203.15556) (Chinchilla) fixed the compute budget C, varied both D and N, measured L(N, D), fit a model that predicts loss for any N and D, and used it to find the optimal model size.

The slides boil it down to one line: **everyone had been using far too little data.** Kaplan paired 8x parameters with 5x tokens. Chinchilla says scale them proportionally (2x parameters, 2x tokens). Under the same compute budget, a smaller model trained on more data does much better. The slides don't write out Meta's answer, but the guiding question is meant to be read through this result. In the same table, Chinchilla pairs 70B parameters with 1.4T tokens, far smaller and far more data than GPT-3's 175B parameters on 300B tokens.

### A third axis: data quality

The last part is titled "Adjusting quality of data":

- **The Phi models**: instead of growing the model or the data, improve the data. [Phi-1 ("Textbooks Are All You Need")](https://arxiv.org/abs/2306.11644) matched much larger models on coding, and [Phi-1.5](https://arxiv.org/abs/2309.05463) extended the result to general LLMs.
- **Scaling laws for data filtering**: [Goyal et al. 2024](https://arxiv.org/abs/2404.07177) deal with trading off quantity, quality, and compute. The slides' summary: the more compute you have, the less you need to filter.

<details>
<summary>How the practice exam tests this section</summary>

Question 13, "Scaling Laws" (4 points), on the [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) asks about the link between compute budget and data filtering, what the Hoffmann study found about model size versus data, how test loss changes with parameter count, why simply growing the model gives diminishing returns, and the key insight behind the Phi models. It also has two MoE short answers: why MoE is more efficient and why it is hard to train. Solutions are in a [separate PDF](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf). Write your own answers first.

The L18 reminder slide says the March 30 evening exam covers Lectures 1–15, so scaling laws are on the exam and MoE is not. The schedule puts Quiz 5 over L16–L20.
</details>

## L16: Mixture of Experts

### The parameters live in the feed-forward layers

L16 opens with a GPT-3 parameter breakdown, taken from the [OLMoE paper](https://arxiv.org/abs/2409.02060). Of 174.57B parameters, feed-forward layers hold 115.97B, attention 57.99B, and embeddings only 0.62B. The slides ask you to work out how each layer type's count comes about.

The point: more than half of a Transformer LLM's parameters sit in the feed-forward layers, so that's where to cut.

### Splitting a layer into experts

The slides explain "experts" in two steps:

1. A linear layer $z = Wx + b$ can be split by rows into three pieces $z_i = W_i x + b_i$ with the same total parameters.
2. A feed-forward layer $y = U\sigma(Wx + b) + c$ can likewise be split into three small feed-forward networks. The two are equivalent when $W$, $b$, and $U^T$ are the three pieces stacked. The slides leave what $c$ should be as a fill-in-the-blank.

Note the slide's caveat: in MoE, each expert is not a linear layer but a feed-forward network with one hidden layer.

### Dense and sparse gating

The MoE output is a weighted sum $y = \sum_{i=1}^{N_e} G(x)_i E_i(x)$. What changes is the gate $G$:

- **Dense MoE**: $G(x) = \text{softmax}(x \cdot W_g)$, so every expert gets a nonzero weight.
- **Sparse MoE**: $G(x) = \text{softmax}(\text{topk}(x \cdot W_g + b_g, k))$ keeps only the k highest scores. The slides note that sparsely-gated MoE was first proposed for RNNs but applies generally and is now popular in Transformers.
- **Noisy top-k**: add Gaussian noise to the gate scores, scaled by an input-dependent term.
- **Mixtral**: the same top-k gating, with each expert replaced by a SwiGLU feed-forward network ([Mixtral paper](https://arxiv.org/abs/2401.04088)).

One initialization detail: $W_g$ and $W_{noise}$ start at all zeros, which gives no signal at first and only a little noise.

### Put experts on different GPUs and traffic jams follow

**Expert parallelism** puts each expert on a different GPU and routes each token to k experts. The slides use two small examples. With 3 devices, each able to hold 3 tokens, 6 tokens, and k = 1, some devices fill up while others sit idle. With 4 tokens and k = 2, token 3 gets routed to a device that is already full and can't fit.

Left alone, the gate concentrates on a few experts that happened to be popular early in training. The slides give OLMoE's fix, noting that many variants exist: add two regularizers to the loss.

$$L = L_{CE} + \alpha L_{LB} + \beta L_{RZ}$$

- **Load balance term** $L_{LB} = N_e \sum_i f_i P_i$, where $f_i$ is the fraction of tokens in the batch routed to expert i and $P_i$ is the probability assigned to expert i. It pushes load to spread out.
- **Router z-loss** $L_{RZ}$ penalizes large router logits to stabilize training.

### Active parameters: memory and compute are counted separately

The k in top-k is usually small. The slides' two examples: Mixtral uses k = 2 with $N_e$ = 8, and OLMoE uses k = 8 with $N_e$ = 64.

**Active parameters** are the ones the router selects for computation. Roughly:

- GPU memory ∝ total parameters
- FLOPs ∝ active parameters

That's the MoE tradeoff: spend more memory to compute less per token. The slides follow with a Mixtral vs. Llama-2 comparison, OLMoE's hyperparameter table, and the "performance vs. cost" plots from the OLMoE paper, concluding that MoE offers a good tradeoff between performance and FLOPs.

### How many experts?

The last two slides contrast two eras. Early MoE work on LSTM language models favored a very large number of experts, while recent Transformer LMs favor comparatively few. The closing slide shows the routed-LM scaling laws of [Clark et al. 2022](https://proceedings.mlr.press/v162/clark22a.html), tying the lecture back to L15.

## How to study these two lectures

1. In L15, read only the Scaling section (from slide number 13 on). Put Kaplan's seven takeaways next to Chinchilla's one line and write down their different answers to "how much more data for 8x the parameters?"
2. Work out GPT-3's per-layer parameter counts yourself (the exercise on L16 slide number 8) and see why feed-forward layers dominate.
3. Use the two expert-parallelism examples on L16 slide numbers 21–22 and work out by hand which tokens get dropped.
4. Finish with practice exam question 13, then check the solutions.

**What to do**: tonight, open L16 slide number 12 and fill in what $c$ should be when a feed-forward layer is split into three experts. If you can, you've understood that experts are just a big feed-forward layer regrouped.

## What this post can and can't confirm

Confirmed: the text, formulas, and citations on both slide decks; schedule dates and quiz coverage; the exam coverage on the L18 reminder slide; and the question stems in practice exam question 13. Not confirmed: what was said or drawn in class (recordings are on Panopto, and L15 has no inked version), the official answer to the Llama cost exercise, and numbers that appear only in figures the text layer doesn't capture (such as the Mixtral vs. Llama-2 comparison).

## Further reading

- How scaling laws extrapolate from small runs: [CS336 Lecture 9: Scaling Laws Are Extrapolation Tools, Not Crystal Balls](/posts/ai/2026-08-22-cs336-scaling-laws-foundations-en) and [CS336 Lecture 11: Scaling Laws in Practice Must Scale Learning Rate and Batch Too](/posts/ai/2026-08-22-cs336-scaling-laws-practice-en)
- Where MoE sits among architecture choices: [CS336 Lecture 4: Attention Has Alternatives, and MoE Does Not Scale for Free](/posts/ai/2026-08-22-cs336-attention-moe-en)
- The systems side of MoE (expert parallelism, communication): [CMU 11-868 L16–L17: When a Model Won't Fit on One GPU](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)

Series: Previous: [HW4: Text-to-Image with a Q-Former](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) | Next: [L17–L18: Distributed Training, FlashAttention, and Efficient Decoding](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L15 and L16 dates, Quiz 4/5 coverage
- [Lecture 15 slides: Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 16 slides: Mixture of Experts](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf), [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf)
- [Lecture 18 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — exam covers L1–L15
- [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Kaplan et al. 2020: Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Hoffmann et al. 2022: Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Gunasekar et al. 2023: Textbooks Are All You Need](https://arxiv.org/abs/2306.11644)
- [Li et al. 2023: Textbooks Are All You Need II: phi-1.5 technical report](https://arxiv.org/abs/2309.05463)
- [Goyal et al. 2024: Scaling Laws for Data Filtering](https://arxiv.org/abs/2404.07177)
- [Cai et al. 2024: A Survey on Mixture of Experts in Large Language Models](https://arxiv.org/abs/2407.06204)
- [Muennighoff et al. 2024: OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)
- [Jiang et al. 2024: Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Clark et al. 2022: Unified Scaling Laws for Routed Language Models (ICML)](https://proceedings.mlr.press/v162/clark22a.html)
