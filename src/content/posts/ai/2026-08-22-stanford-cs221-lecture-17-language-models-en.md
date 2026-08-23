---
title: "CS221 Lecture 17: Language Models: From Next-Token Prediction to Generation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 18
tldr: "Lecture 17 defines a language model as a chain-rule factorization of sequence probability, compares n-gram and neural conditional models, and shows how sampling, temperature, and evaluation shape generation."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 17: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-17-language-models)

This post is rewritten only from the official slides for **Stanford CS221 Autumn 2025 Lecture 17**, `language_models.pdf`. The PDF dates the lecture to 2025-11-17 and credits Ken Liu; it begins by noting that language models will not be on that week's exam, then introduces the definition, motivation, architectures and systems, and finally places the topic in its industrial and research context.

> Material gap: The scope below is limited to what the static PDF supports. The slides do not provide a complete Transformer derivation, reproducible training code, systems benchmark table, classroom interaction record, or Canvas material; those gaps are not filled with generic textbook content.

## The lecture map

The PDF's agenda has four stops:

1. What exactly are language models?
2. Why is it a good idea to model language?
3. What makes language models work?
4. Where we are today

The order matters. The lecture first reduces a language model to a distribution over sequences, then explains why one next-token objective can support many tasks, and only then discusses scaling, post-training, and deployment costs.

### 1. What exactly are language models?

The working definition is deliberately simple: language is a structured sequence of characters, where characters may be words or tokens. Its structure comes from the possible vocabulary and the grammar or conventions governing what follows what. Learning a language model therefore means learning both the structure of a language and the ability to produce it.

The slides use **The stock market crashed and investors ...** as the example. At the next position, `桌` is outside the intended vocabulary, while `golfing` is shown as a bad semantic and grammatical continuation. `panicked` is plausible, and `celebrated` is also possible. The former fits the world knowledge associated with a crashing market more naturally, but the point is not that it is the only correct answer: the model should assign different probabilities to possible continuations.

The tensor view turns this into multi-class classification over a vocabulary. Suppose the vocabulary has only ten words. Map each word to an ID; an input of length T has shape `(T,)`. Turn each ID into a D-dimensional embedding, producing `(T, D)`. The model then outputs a probability vector over the vocabulary, `(V)`. Doing this at every position gives `(T, V)`; processing B sequences at once gives `(B, T, V)`.

The shapes make next-token prediction concrete: the input is a sequence of token IDs, and the output is a classification distribution over the vocabulary at each position. The slides then append the predicted `panicked` to the input and predict again. That is autoregression. Generation does not emit a complete sentence in one operation; it adds one token to the context at a time.

### 2. Why is it a good idea to model language?

#### 2.1 Probability factorization and the next-token objective

The probabilistic view is shorter. A language model is a distribution over sequences. The slides give illustrative values: a sequence ending in `panicked` has probability 0.02, one ending in `celebrated` has probability 0.015, and one ending in `golfing` has probability 0.0001. These are slide examples, not estimates from a real corpus.

By the chain rule, a sequence's joint probability can be decomposed into conditional probabilities:

```text
P(x₁, ..., xₙ) = ∏ᵢ P(xᵢ | x₁:i−1)
```

The model therefore does not need a table containing every complete sentence. It needs to predict one token from the preceding context. Next-token prediction (NTP) is sequential multi-class classification over the vocabulary: input `(B, T)`, output `(B, T, V)`, learning `P(xₜ | x₁, ..., xₜ₋₁)`. The PDF calls it the most prevalent objective for pre-training.

The slides contrast masked language modeling (MLM). It has the same broad classification shapes, `(B, T)` to `(B, T, V)`, but is non-sequential and can use context on both sides of a masked position. In `import ____ as np`, the model can use the surrounding text to make `numpy` a plausible completion. The PDF gives an example such as `P(xₜ | x₁, ..., xₜ₋₁, xₜ₊₁, ..., x_T)` and says MLM is used less today. It should not be described as the same generation procedure as NTP because the conditioning information differs.

#### 2.2 From sequence completion to multitask learning

The first reason is that many human activities can be viewed as sequence completion. The PDF places writing an email, writing code, and responding to an advisor in the same frame: a useful next-word distribution may translate into tangible benefits. The slides give no task accuracy or user study here, so this is a modeling perspective, not a complete performance claim.

The second reason is multitask learning. One next-token objective can teach a model many things from text: the slides show memorizing facts, math, and reasoning. A deliberately simple multiple-choice example makes the point: if the correct answer is `c)`, an LM that assigns high probability to `c)` may solve the task as sequence completion. The slide recalls the similarity to the first-order-logic problems in HW7. This does not mean a language model is identical to a logic solver; it means a task can be encoded as a continuation.

The third reason is scale. The PDF cites the Kaplan Scaling Laws (OpenAI, 2020) and Chinchilla Scaling Laws (Google DeepMind, 2022), presenting the claim that loss can keep decreasing with more data and a larger model. One model can then cover chat, coding, translation, and summarization that were once handled by separate LMs. The slides do not define the scaling-law equations, validity range, or statistical uncertainty, so those remain gaps in this material.

### 3. What makes language models work?

The PDF revisits scaling and treating next-token prediction as multitask learning, then lists model architecture, pre-training versus post-training, tokenization, and systems. It closes with test-time scaling, distillation, tool use, mixed precision, speculative decoding, model routing, evaluation, and multimodality. The sections below follow what the slides actually show.

#### 3.1 Architecture: three MLP bottlenecks

The slides deliberately do not teach Transformer details. Instead, they ask why a vanilla neural network or MLP, like the one from HW2, is not enough, and tell students to learn Transformers elsewhere and check how they fix these problems. This is a bottleneck comparison, not a complete Transformer tutorial.

The first problem is parameter count that depends on T and V. If an MLP maps a length-T embedding directly to length-T outputs over vocabulary V, even one layer has roughly `O(DVT²)` parameters. A language model wants a large T to see more history and a large V to support languages and tasks. The slides say that Transformers share parameters across T and have their main dependence on V in the embedding and output components.

The second problem is a fixed network with no dynamic weights. The MLP is essentially a giant lookup table: for a given prefix, it has a fixed next-word mapping. With frozen weights, it does not change its preference by position. The slides use attention as the intuition for the contrast: a frozen Transformer can create dynamic weights for different positions through attention.

The third problem is no computation reuse. For an input of length T, the MLP can at best cache the output for that exact input. If one position changes, it must redo the whole forward pass. The slides point to a Transformer KV-cache for storing intermediate values for past tokens. The PDF gives no data structure, latency number, or memory formula, so this post does not turn the point into a deployment tutorial.

#### 3.2 Training: pre-training and post-training

Pre-training means training a giant model on a giant amount of text with a simple objective such as next-token prediction. The slides show an AI2 OLMo example and sample pre-training text, and state that capabilities emerge from pre-training. A GPT-3 slide then introduces in-context learning: showing task examples inside the input string can make completions better.

Yet a pre-trained LM is still an autocomplete system, albeit a powerful one. It may know many things because it has seen the data, but it follows the pattern of the input rather than treating the input as a question. Post-training is intended to make it useful to people; the PDF uses ChatGPT as the intuitive example.

The slides connect instruction following to InstructGPT/RLHF (OpenAI, 2022). In reinforcement-learning language, the LM is a policy: generations are samples from the policy, reward is a model trained from human preference labels, and training is roughly policy gradient. Safety tuning makes the model not answer harmful questions, producing a cat-and-mouse game between jailbreakers and defenders. The examples ask for the same request in the past tense or as a grandmother's bedtime story, showing prompt transformations.

The PDF lists evolving techniques. SFT is next-token prediction on instruction-following or refusal examples. RLHF uses reinforcement learning to reward instruction-following or refusal behavior with human labels. RLVR uses an automated verifier for the labels. Data curation removes harmful data from the beginning. The lecture gives no comparative experiments, so these remain design choices listed by the slides.

#### 3.3 Tokenization: do not enumerate only whole words

An all-whole-word vocabulary is brittle when the input contains `rArE` or the misspelling `mispeled`. The PDF's key idea is to use subword units. It introduces Byte-Pair Encoding (BPE) as a conceptual procedure: begin with one token per character, plus common words and special tokens; repeatedly merge frequent token pairs into new tokens until reaching a target vocabulary size.

This makes the tensor definition more realistic. T need not mean the number of complete words; it is the token sequence length. The vocabulary does not need an entry for every possible new word. The PDF gives only the high-level procedure and a video link, not a merge table, token-count comparison, or tokenizer experiment.

#### 3.4 Systems: memory, parallelism, efficiency, and caching

Language models are too large to run only on a laptop. The PDF uses Llama-3.3 70B as an arithmetic example: at 2 bytes per parameter, weights alone need about 140 GB; vanilla Adam training with gradients and optimizer states is estimated at roughly eight times that, or 1.12 TB. A single H100 has 80 GB, so the immediate problem is fitting the model. These are lecture estimates, not a complete hardware specification.

The first direction is quantization: store values in lower precision. The slides mention as low as 2-bit for inference and 4-bit for training as active research. With 2-bit quantization there are four possible values. The basic procedure allocates `2^k` bins and assigns weights to nearby bins while minimizing loss. Tradeoffs include training stability and performance degradation at low bitwidth.

The second direction is parallelism and sharding. If the model fits on one GPU, copy it across GPUs, reduce the batch size until it fits, and combine gradients: data parallelism. If the model plus one example does not fit, split the model itself: pipeline parallelism cuts layers, while tensor parallelism cuts individual matrices.

The third direction is hardware-aware code. The slides say most computation is bottlenecked by memory bandwidth rather than raw compute. Kernel fusion combines small operations that move between memory and compute into a larger operation; the FlashAttention series is one example. The fourth direction is caching and batching: cache activations for common inputs, use KV-cache for past-token work, and batch inputs to raise arithmetic intensity. Modern serving systems cache common prompts, but the PDF also warns that caching can become a security side channel.

The PDF lists directions without developing them: test-time scaling (reasoning and parallel sampling), distillation, tool use, mixed precision, speculative decoding, model routing, better optimizers, architectures and RL algorithms, thoughtful evaluations and benchmarks, and multimodality across images, video, and audio. A list is not a tutorial; the slides supply no formula or result for these items.

### 4. Generation and inference: from a distribution to the next token

The tensor and chain-rule views combine into an inference loop. Given a prefix, the model outputs a conditional distribution over the vocabulary. Select or sample a token, append it to the sequence, and use the new prefix to obtain the next distribution. In the `The stock market crashed and investors` example, `panicked` and `celebrated` first compete; after `panicked` is appended, the model moves to the next step instead of enumerating every full sentence.

Three levels must remain separate. The model learns conditional probabilities. Autoregressive inference uses them one token at a time. Actual generation chooses tokens according to the distribution. In the RLHF section, the PDF describes generations as samples from a policy, but it does not define temperature, top-k, top-p, beam search, or stopping rules. Those familiar terms are therefore not attributed to this lecture.

KV-cache and batching belong to the systems side of the same inference journey. The former avoids recomputing intermediate values for past tokens; the latter processes multiple inputs together. They change how computation and memory are used, not the NTP objective. The PDF gives no per-token latency, throughput, cache-hit rate, or quality curve, so those measurements remain gaps.

### 5. Evaluation and limitations: lower loss is not a complete guarantee

The main quantitative signal explicitly discussed in the PDF is loss. In the scaling section, the slides claim that loss can keep decreasing as data and model size grow; they also list thoughtful evaluation and benchmarking among the other ingredients that make language models work. This supports a limited conclusion: training loss matters, but the lecture does not provide a complete evaluation protocol. There is no validation split, perplexity definition, calibration analysis, task-score table, or human-evaluation procedure in the PDF.

The examples already expose several limits. First, both `panicked` and `celebrated` can be plausible completions; a language model learns a distribution, not a unique truth. Second, fluent completion does not guarantee sourced knowledge. The PDF says pre-training produces capabilities from data, but gives no retrieval, citation, or factuality evaluation. Third, the MLP discussion shows that architecture constrains context, vocabulary, and inference cost; Transformers, KV-cache, and systems techniques are lecture-level responses to those bottlenecks, not proof that every limitation disappears.

The final agenda section adds social and organizational constraints. Closed frontier models sit behind paid APIs, with their algorithms, data, systems, and inference secret sauce undisclosed. Open-weight models put weights on Hugging Face and can be used for inference, fine-tuning, RL, architecture study, or removal of safety training, but running them still costs resources. Open-source models ideally expose data, training, weights, and code; the PDF names OLMo, Marin, LLM360, and Pythia, and describes them as mostly academic and smaller.

The PDF defines agents as LMs that can generate tool tokens for web search or the command line and are placed inside a `while task not done` loop. It also says they need special training: how to run long trajectories and when to use tools are not solved here. The last list includes AI safety, copyright and fair use, data and user privacy, security, interpretability, and HCI. These are questions raised by the slides, not questions this post can settle.

### 6. What the PDF explicitly does not answer

This 119-page slide deck is a map, not a complete textbook or reproducible benchmark. Within its static content, the following remain gaps:

- No line-by-line derivation or complete implementation of Transformers, attention, KV-cache, FlashAttention, or BPE.
- No complete pre-training corpus list, data-cleaning policy, training hyperparameters, checkpoint, or failure case.
- No controlled comparison of NTP, MLM, SFT, RLHF, and RLVR, and no shared quality, cost, or safety score.
- No full evaluation protocol beyond loss; IOI, FrontierMath, and HLE appear only as capability examples in the closed-model section.
- No public Canvas interactions, assignment solutions, hidden tests, or classroom discussion for this lecture.

The reliable takeaway is therefore not that next-token prediction explains intelligence. It is a checkable contract: language is represented as a token sequence, the joint probability is factored by the chain rule, each position is a vocabulary classification, training and post-training change different behaviors, inference generates one token at a time, and architecture, data, systems, and evaluation determine how far the contract can be taken.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: language_models.pdf](https://stanford-cs221.github.io/autumn2025-lectures/language_models.pdf)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
