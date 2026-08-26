---
title: "Understanding AI Models: 18 Articles from Tokens to Self-Hosting"
date: 2026-08-26
category: ai
type: guide
tags: [llm, transformer, ai-model, learning-path, tokenization, embedding, scaling-laws, fine-tuning, rlhf]
lang: en
series:
  name: "認識 AI 模型"
  order: 0
tldr: "You don't need to become a researcher to understand AI models systematically. This series starts from what you can see (tokens, context windows) and works up to self-hosting open-source models — 18 articles covering everything you need to choose models, read benchmarks, and estimate costs."
description: "Series introduction for 'Understanding AI Models': 18 articles covering tokens, embeddings, loss functions, Transformers, training pipelines, scaling laws, evaluation, quantization, and self-hosting — designed for readers without a research background."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-series-intro)

You don't need to understand models to generate text with an API. Just like you don't need to understand engines to drive a car.

But when you're choosing a car (picking a model), estimating fuel costs (calculating token pricing), reading road test reports (interpreting benchmarks), or deciding whether to mod the engine yourself (fine-tuning vs RAG), not understanding the engine means trusting the salesperson blindly.

The goal of this series: **give you enough model knowledge to make better engineering decisions**. Not to turn you into a researcher, but so that when you encounter "128K context window," "MoE architecture," "RLHF alignment," or "INT4 quantization," you understand the mechanisms behind these terms and what they mean for your choices.

## What this series is not

- Not a paper walkthrough. No derivations, no proofs.
- Not lecture notes. The order follows a learner's arc, not a professor's syllabus.
- Not an API tutorial. How to call models is application-layer work; it's not covered here.

## Learning path

The series follows a single arc: starting from concepts you can touch, progressing toward the knowledge you need for real decisions.

```
Fundamentals → Representation → Learning → Architecture → Training → Scale → Evaluation → Advanced → Practical
    1-2              3             4-5          6             7         8       9-10         11-12      13-17
```

You don't have to read front to back. Each article stands on its own, but if a topic feels difficult, going back one or two articles usually gives you the prerequisite.

## The 18 articles

### Fundamentals

**1. Model basics: tokens, context windows, inference vs training**
What are a model's actual inputs and outputs? Why are "training" and "inference" completely different operations? These form the shared vocabulary for everything that follows.

**2. Tokenization: BPE and why Chinese costs more than English**
Models don't see characters — they see tokens. The BPE algorithm determines how text is split, which directly affects cost across languages.

### Representation

**3. Embeddings: text to vectors and what similarity means**
How does a model turn text into something computable? Embeddings are the foundation for understanding search, classification, and RAG.

### Learning mechanisms

**4. How models know they're wrong: loss functions**
The loss function is a model's only compass for learning. Understanding it explains why models learn some tasks well and others poorly.

**5. How models improve: gradient descent and the training loop**
Once a model knows where it went wrong, how does it adjust its parameters step by step? Gradient descent is the core loop of all deep learning.

> Articles 4 and 5 involve some math. Both use an intuition-first structure: analogies and diagrams build intuition first, with formulas in collapsible sections. Readers wanting a deeper probability foundation should look at Stanford CS109.

### Architecture

**6. Transformers and Attention: the intuition behind selective focus**
Why did Transformers replace RNNs as the dominant architecture? The attention mechanism lets a model see all positions simultaneously while focusing only on what matters.

### Training pipeline

**7. The three training stages: pre-training → SFT → RLHF**
A model goes through three stages to evolve from "can continue text" to "useful and safe." This is key to understanding ChatGPT-class products.

### Scale

**8. Scaling Laws: how big does a model need to be?**
Is bigger always better? Scaling laws describe the relationship between data, parameters, and compute — and why training a GPT-4-class model costs as much as it does.

> Article 8 also uses the intuition-first structure. Logarithms and power-law formulas are in collapsible sections.

### Evaluation

**9. MoE architecture: routing instead of brute-force computation**
Not all parameters need to activate simultaneously. MoE lets a model use only a fraction of its parameters during inference — essential for understanding Mixtral and GPT-4's architecture.

**10. How to read a model's report card: metrics and evaluation**
MMLU, HumanEval, MT-Bench — benchmark names pile up. How do you judge which ones matter and how much a score difference means?

**11. How to read coding benchmarks**
Code-capability benchmarks have their own nuances: pass@k, contamination, multi-language support. Required reading for engineers choosing models.

### Advanced

**12. Self-improvement RL: three approaches**
Can models make themselves better? Expert Iteration, SPIN, and SELF-PLAY — each with its own assumptions and limitations.

**13. Fine-tuning vs RAG: when to train the model, when to connect a database**
Two ways to make a model "know more," with completely different cost structures and use cases. Choosing wrong wastes significant time and budget.

### Practical

**14. Quantization and inference optimization: running models on your laptop**
INT8, INT4, GGUF, KV cache — the techniques for fitting a 70B model into consumer GPUs, and the quality-speed tradeoffs involved.

**15. Open-source AI licensing guide**
Apache 2.0, Llama 3 Community License, RAIL — open-source model licenses vary widely. Know the differences before commercial use.

**16. API routing and pricing: getting the best model for the least money**
OpenRouter, Amazon Bedrock, Azure — pricing comparisons and routing strategies across providers.

**17. Self-hosting open-source models**
vLLM, Ollama, TGI — when you decide to run models yourself instead of using APIs, here's the hardware planning and deployment tooling you need.

## Relationship to the "AI Model Families" series

This series covers **universal knowledge** — tokens, Transformers, training pipelines, and benchmarks work the same regardless of which vendor's model you use.

The companion series, "AI Model Families," covers **what makes each family different** — Claude's constitutional AI, GPT's o-series reasoning models, Gemini's multimodal architecture, and so on.

We recommend building your foundation with this series first, then consulting the model family articles as needed.

## How to read this

- **Short on time**: Read article 1 (shared vocabulary) → jump to the topic you need
- **Want the full picture**: Read 1 through 13 in order; pick from the practical articles as needed
- **Already have a foundation**: Skip to article 9 onward for evaluation and advanced topics

Each article ends with further reading and the corresponding university course chapters for readers who want to go deeper.

## References

- Jurafsky, D. & Martin, J. H. (2024). *Speech and Language Processing* (3rd ed. draft). [https://web.stanford.edu/~jurafsky/slp3/](https://web.stanford.edu/~jurafsky/slp3/)
- Stanford CS336: Language Modeling from Scratch (2025). [https://stanford-cs336.github.io/spring2025/](https://stanford-cs336.github.io/spring2025/)
- Stanford CS224N: Natural Language Processing with Deep Learning. [https://web.stanford.edu/class/cs224n/](https://web.stanford.edu/class/cs224n/)
- Stanford CS109: Probability for Computer Scientists. [https://web.stanford.edu/class/cs109/](https://web.stanford.edu/class/cs109/)
- CMU 11-785: Introduction to Deep Learning. [https://deeplearning.cs.cmu.edu/](https://deeplearning.cs.cmu.edu/)
