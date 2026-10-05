---
title: "AI Engineer Interview Daily — 2026-10-06: Deep Learning & NLP"
date: 2026-10-06
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's rotation is Deep Learning & NLP — Self-Attention's Q/K/V and why scaled dot-product divides by sqrt(d_k), how tokenizer fertility decides a multilingual LLM's cost structure, why BERT's masking splits into two independent decisions (attention mask vs. loss label), and how to choose between CNN and RNN — plus a Sarvam AI-style scenario question: why tokenizer fertility is the first performance bottleneck for multilingual LLMs."
tldr: "Today's Deep Learning & NLP rotation covers five core concepts: why Self-Attention's scaled dot-product divides by sqrt(d_k); how tokenizer fertility (tokens per word) decides a language's cost and effective context length; why BERT's attention mask and MLM loss label are two independent mechanisms that interviewees often conflate; the trade-offs between CNN and RNN; and the fine-tuning spectrum from full fine-tuning to LoRA to continued pretraining. The practice question comes from a representative Sarvam AI interview question (compiled by the AI-Engineer-Interview-Questions project from public information, not leaked): explain why tokenization is the first performance bottleneck for multilingual LLMs, and how a low-fertility tokenizer like Sarvam-1's changes the underlying cost structure — the breakdown threads 'how fertility is defined' through to 'which three downstream cost lines it determines' into one complete reasoning chain."
series:
  name: "AI Engineer Interview Daily"
  order: 48
---

> 🌏 [中文版](/posts/daily/2026-10-06-ai-interview-daily)

## Today's Topic

Tuesday's rotation is Deep Learning & NLP, and today's concepts circle around one thread: how text turns into something a model can read, and why the efficiency gap in that step can decide a product's entire cost structure. The math behind Self-Attention, how a tokenizer splits words, BERT's masking mechanism, and the CNN-versus-RNN trade-off are all standard interviewer probes for whether you actually understand the mechanism or just memorized the vocabulary. Today's practice question is especially close to a real-world scenario: multilingual LLM tokenizer design isn't an academic exercise — it shows up directly in your API bill and in whether your context window is actually big enough.

## Core Concepts Cheat Sheet

### Self-Attention's Q/K/V, and why scaled dot-product divides by sqrt(d_k)

Self-Attention projects each token into a Query, a Key, and a Value vector, takes the dot product between a Query and every Key to get a similarity score, then uses those scores to weight-average all the Values — letting each token dynamically decide which other tokens to listen to. The dot-product score gets divided by sqrt(d_k) because the variance of a dot product between random vectors grows linearly with dimension; without that correction, the score distribution sharpens, softmax collapses probability onto a few positions, and the gradient vanishes. Dividing by sqrt(d_k) pulls the variance back to a constant scale so softmax still carries a reasonable gradient signal early in training.

### Tokenizer fertility: the first performance bottleneck for multilingual LLMs

Fertility is the average number of tokens a word gets split into. An English-centric BPE tokenizer has barely seen Devanagari or Tamil script, so it degrades toward near byte-level splitting on these languages — a single word can explode into four to eight tokens. That one number hits three lines at once: cost and latency scale linearly with token count, the effective context window can shrink to a quarter of its nominal size, and the model has to spend capacity re-learning that these broken fragments compose a single word — capacity that should have gone toward semantics.

### BERT's masking mechanism: attention mask and loss label are two independent decisions

People often talk about "BERT using a mask" as if it were one thing, but it's really three independent decisions stacked together: which input tokens get replaced with `[MASK]` (corruption), which positions are visible during attention (the attention mask — `[MASK]` itself has an attention value of 1; it's a real position with a representation to compute), and which positions' outputs count toward the loss (the label — padding and unselected tokens are both `-100`, ignored). The original paper's recipe selects 15% of eligible tokens, and among those, 80% become `[MASK]`, 10% become a random token, and 10% stay unchanged — but all three variants still count toward the loss. That last detail is the part interviewees most often miss.

### CNN vs. RNN: how to choose, and where each one fails

CNNs assume locality and translation invariance, using convolutional kernels to pick up patterns within a fixed range — highly parallelizable and fast to train, which suits vision or sequence tasks where the dependency is mostly local. RNNs assume the sequence unfolds step by step like a Markov chain, and in theory can remember dependencies of arbitrary length, but they have to be computed sequentially (no parallelism across time steps) and run into vanishing gradients on long sequences, where early information gets crushed toward zero by the chain-rule product during backpropagation. Most sequence tasks with long-range dependencies have since moved to Transformers, but interviewers still use this question to check whether you understand *why*, rather than just saying "Transformers are newer."

### The fine-tuning spectrum: full fine-tuning, LoRA, and continued pretraining

The three solve different problems. Continued pretraining uses a large volume of monolingual or domain text to keep pretraining the base model, teaching it what a target language or domain looks like. Full fine-tuning updates every parameter to learn a specific task — the most expensive option and the most prone to catastrophic forgetting. LoRA adds a low-rank update on top of a subset of weights to adapt the model — far fewer parameters, swappable per deployment, and with a lower forgetting risk for other languages as a result. The typical recipe for a low-resource language: amplify data via translation or transliteration, continue pretraining from a related-language base to teach the language itself, then apply LoRA for lightweight task-level adaptation.

## Today's Practice Question

### The Question

Why is tokenization the first performance bottleneck for multilingual LLMs? How does a low-fertility tokenizer like Sarvam-1's change the underlying cost structure?

**Source**: Sarvam AI (a representative question compiled by the [AI-Engineer-Interview-Questions](https://github.com/ombharatiya/AI-Engineer-Interview-Questions) project from public technical direction, not a leaked question)　**Difficulty**: Intermediate　**Round**: Technical deep-dive / system-design flavored

### How to Break It Down

1. **Clarify first**: Confirm whether the discussion is about tokenizer design at training time or a post-deployment cost/latency analysis. What's the target language set — mostly Latin-script languages, or scripts like Devanagari and Tamil that don't tokenize on whitespace the same way? Is there an existing multilingual tokenizer to use as a baseline?
2. **Build a framework**: Start by defining the metric — fertility = token count / word count, measured on parallel corpora (the same sentence across languages) so you're not accidentally comparing "different corpora that talk about different things." Then split the downstream impact into three independent lines: cost/speed, effective context length, and model quality.
3. **Go deep on the core**: The key trade-off is vocabulary budget — under a fixed vocab size, covering one more language well costs embedding rows and softmax compute, so you can't just keep expanding coverage indefinitely. You retrain the tokenizer on a balanced, script-aware corpus so common morphemes in each language get their own token, rather than force-fitting new languages into an English-centric vocabulary.
4. **Close strong**: Converge on concrete numbers — a 4x fertility gap means roughly 4x the tokens, 4x the KV cache, and roughly 4x the API cost for the same sentence, while the context window's effective capacity drops to a quarter, squeezing RAG chunk budgets and few-shot examples along with it. Then give an actionable fix: measure fertility per language to rank where the bottleneck is, then either retrain the tokenizer or extend the vocabulary with new tokens initialized from subword averages, letting continued pretraining settle them in.

### Sample Answer (What You'd Actually Say)

> Tokenization is the first bottleneck because it sets the unit cost for everything downstream. **Start with the metric**: fertility is the average number of tokens a word gets split into. An English-centric BPE tokenizer has barely seen Devanagari, so on Indian languages it often degrades close to byte-level — a word can explode into four to eight tokens — while a well-designed multilingual tokenizer can push that down to somewhere between one-point-something and two-point-something.
>
> **Then explain why this propagates downstream**: cost and latency scale directly with token count, so a 4x fertility gap means roughly 4x the KV cache and inference time for the same sentence; the context window has a fixed token budget, so that same 4x gap leaves you with a quarter of the effective length, squeezing RAG chunks and conversation history. The more subtle cost is model capacity — when a word gets chopped too finely, the model has to spend capacity re-learning that these fragments compose a single word, capacity that should have gone toward semantics and morphology instead.
>
> **Finally, how you'd fix it**: this isn't a patch you bolt on after training — you retrain the tokenizer on a balanced corpus that actually covers each target language, so common morphemes get their own tokens. The cost is that vocabulary size has a ceiling, so covering one more language well means allocating more of the embedding and softmax budget to it. That's a balance you need to make at design time, not a hyperparameter you tune after the fact.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clearly defined fertility (tokens/word, measured on parallel corpora) | |
| Explained why an English-centric tokenizer degrades toward byte-level on non-Latin scripts | |
| Split the downstream impact into three independent lines: cost/speed, effective context, model quality | |
| Named the vocabulary-budget trade-off (covering one more language well costs embedding/softmax budget) | |
| Gave an actionable fix (retrain the tokenizer, or extend the vocab with subword-averaged embeddings plus continued pretraining) | |
| Bonus: named the risk of bolting new tokens directly onto an existing vocabulary (unstable cold-start embeddings that need continued training to converge) | |

## Further Reading

- [BERT Interview Questions: Pretraining Objectives, Attention Masks, and Task Heads — PracHub](https://prachub.com/resources/bert-interview-questions-pretraining-objectives-attention-masks-and-task-heads) — A full breakdown that separates `[MASK]` corruption, attention mask, and loss label into three distinct decisions, with a batch-shape table and a worked MLM loss calculation.
- [BERT model documentation — Hugging Face](https://huggingface.co/docs/transformers/model_doc/bert) — The official API convention for attention masks and MLM labels (the `-100` ignore value), useful for checking your own code against.
- [Samsung Electronics Machine Learning Engineer Interview Questions & Guide 2026 — PracHub](https://prachub.com/interview-guide/samsung-electronics-machine-learning-engineer-interview-questions-guide-2026) — Documents real reported ML Engineer interview questions including "how to choose between CNN and RNN" and "walk through the math of self-attention," with a breakdown framework.

## References

- [AI-Engineer-Interview-Questions / Sarvam AI — GitHub](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/sarvam-ai.md) — Source of today's practice question on how tokenizer fertility changes a multilingual LLM's cost structure, including the fertility figures and Sarvam-1's actual design.
- [BERT Interview Questions: Pretraining Objectives, Attention Masks, and Task Heads — PracHub](https://prachub.com/resources/bert-interview-questions-pretraining-objectives-attention-masks-and-task-heads) — Source for the "BERT's masking mechanism" concept section, including the corruption/attention-mask/loss-label breakdown.
- [Samsung Electronics Machine Learning Engineer Interview Questions & Guide 2026 — PracHub](https://prachub.com/interview-guide/samsung-electronics-machine-learning-engineer-interview-questions-guide-2026) — Supporting source for the "Self-Attention" and "CNN vs. RNN" concept sections, confirming both are real reported interview questions.
