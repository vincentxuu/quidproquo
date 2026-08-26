---
title: "Pre-training, SFT, RLHF: Three Stages That Turn a Text Predictor into a Useful Assistant"
date: 2026-08-26
category: ai
type: deep-dive
tags: [pre-training, sft, rlhf, dpo, fine-tuning, ai-model, training, alignment]
lang: en
series:
  name: "認識 AI 模型"
  order: 7
tldr: "Every LLM goes through three training stages: pre-training reads the internet to learn language, SFT uses example conversations to learn the format, and RLHF uses human preferences to learn what a good answer looks like. The gap between a base model and a chat model is what the last two stages do."
description: "An introduction to the three stages of LLM training: how pre-training builds language ability, SFT teaches the conversation format, RLHF aligns model behavior with human preferences, and why DPO is a simpler alternative."
draft: false
glossary:
  - term: "SFT"
    def: "Supervised Fine-Tuning — training a model on human-written example conversations so it learns the format of following instructions"
  - term: "RLHF"
    def: "Reinforcement Learning from Human Feedback — training a reward model on human preference rankings, then using it to guide the language model toward better answers"
  - term: "DPO"
    def: "Direct Preference Optimization — skipping the reward model and directly adjusting model weights using preference data"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-training-stages)

You open ChatGPT and ask "How do I write an apology letter?" It responds with a well-structured, appropriately-toned example. Feels natural — but remember what we covered in previous posts: the model's core ability is just "predicting the next token." How does a machine that only completes text become an assistant that answers questions?

The answer is three stages of training, each teaching the model something different.

## Act 1: Pre-training — Reading the Entire Internet

Pre-training is the largest and most expensive stage. The goal is straightforward: teach the model language itself.

The process involves collecting text from the web — pages, books, papers, code, Wikipedia — into a corpus of trillions of tokens, then having the model do one thing over and over: **mask the next token and guess what it is.** Wrong guesses produce cross-entropy loss, gradients flow back, parameters update, and the model tries again. This is exactly the training loop from previous posts, just scaled up to thousands of GPUs running for months.

After this massive exercise, what has the model learned?

- **Language structure**: grammar, word order, collocations. It knows that "The capital of France is" is probably followed by "Paris."
- **World knowledge**: by predicting factual text billions of times, facts get compressed into parameters.
- **Reasoning patterns**: it has done next-token prediction on math proofs, code, and logical arguments, picking up reasoning "templates" along the way.

But the model that comes out of this stage — called a **base model** — has a fundamental problem: it can only continue text, not hold a conversation.

If you ask it "What is the tallest mountain in the world?", it won't answer "Mount Everest." It's more likely to continue with something like "What is the tallest mountain in the world? This is a common geography question. According to the textbook..." — because that's the kind of text it saw during training. It's completing an article, not answering your question.

A base model is like a student who has read every book: encyclopedic knowledge, but when you ask a question, they start reciting a textbook instead of giving you a direct answer.

## Act 2: SFT — Learning the Format of Conversation

Supervised Fine-Tuning has one goal: teach the model that **when someone gives you an instruction, you should answer directly, not continue writing an essay.**

The method is to prepare thousands of example conversations by hand:

```
User: Summarize quantum mechanics in three sentences.
Assistant: 1. Subatomic particles are described by probabilities, not definite trajectories.
           2. Measurement affects a particle's state (observer effect).
           3. Particles can exist in multiple states simultaneously (superposition) until measured.
```

These aren't scraped from the web. Human annotators write them one by one, each demonstrating what a good response looks like — concise, direct, structured.

The base model is then trained on these example conversations. The mechanism is identical to pre-training — still next-token prediction, cross-entropy loss, gradient descent — but the data is no longer random web text. It's carefully curated instruction/response pairs.

SFT datasets are typically tens of thousands to hundreds of thousands of examples, orders of magnitude smaller than the trillions of tokens in pre-training. But the effect is dramatic: the model learns a new "register." It stops treating your question as the beginning of an article and starts treating it as an instruction that needs an answer.

Think of SFT as teaching a student the format of exam answers — not teaching new knowledge, but teaching them to express what they already know in the right way.

### The Limits of SFT

After SFT, the model can hold a conversation. But it still has issues:

- **It might answer harmful questions**: ask it how to make something dangerous, and it might comply — because the training examples didn't cover every scenario that should be refused.
- **Response quality is inconsistent**: sometimes great, sometimes verbose, off-topic, or imprecise. It learned the format but doesn't necessarily know what counts as a "good" answer.
- **It learned "what to do" but not "what's better"**: SFT's signal is "this response is a correct example," but it doesn't tell the model "this response is better than that one."

Solving these problems requires the third stage.

## Act 3: RLHF — Human Preferences as a Training Signal

Reinforcement Learning from Human Feedback revolves around one core idea: **let humans tell the model which answer is better.**

The process has two steps:

### Step 1: Train a reward model

Given the same question, have the model generate two (or more) different answers. Then have human annotators look at these answers and rank them: "Answer A is better than Answer B."

Use this human preference data to train a separate, smaller model called a **reward model**. Its job: given a (question, answer) pair, output a score representing "how much a human would like this answer."

### Step 2: Use the reward model to guide training

Now we have a model that can stand in for human judgment. Use it as the training signal: the language model generates an answer, the reward model scores it, and a reinforcement learning algorithm (PPO is the most common) updates the language model's parameters to produce higher-scoring answers next time.

Think of it as hiring a tutor. The student (language model) answers questions, the tutor (reward model) doesn't give the correct answer directly but says "this answer is better than the last one" or "that direction is wrong." The student adjusts their behavior based on this feedback.

After RLHF, the model learns not just "how to answer" but "how to answer better":

- It knows to refuse dangerous questions, and does so more naturally.
- Responses are more precise, better structured, and closer to user expectations.
- Hallucination decreases, because human annotators typically rank inaccurate answers lower.

## A Summary Analogy for All Three Stages

| Stage | What it does | What it learns | Analogy |
|-------|-------------|---------------|---------|
| Pre-training | Reads trillions of tokens | Language ability, world knowledge | A student who read every book |
| SFT | Learns from thousands of example conversations | Conversation format, instruction following | The student learns exam answer format |
| RLHF | Learns from human preference rankings | What counts as a "better" answer | The student gets a tutor |

Data volume decreases at each stage (trillions → thousands → hundreds), but each stage is essential. Pre-training gives the model ability, SFT gives it format, RLHF gives it taste.

## DPO: A Simpler Alternative

RLHF's pipeline is somewhat complex — you need to train a reward model first, then run reinforcement learning with it. **DPO (Direct Preference Optimization)**, proposed in 2023, offers a shortcut.

DPO's insight: since we have human preference data (A is better than B), why not skip the reward model and directly use that preference data to update the language model's parameters?

Mathematically, DPO proves that you can reformulate RLHF's optimization objective as a simple loss function and run gradient descent directly on the preference data — almost the same training procedure as SFT. No reward model needed, no reinforcement learning, and training stability improves significantly.

Many recent models (including Llama 3 and some Mistral variants) use DPO or its variants rather than traditional PPO-based RLHF.

## Why Should You Care?

Understanding the three training stages has practical value:

1. **Reading model release announcements**: when Meta says "Llama 3 base model is open source," you know that's the model after pre-training but before SFT — you can't have a conversation with it directly. When they separately release "Llama 3-Instruct," that's the version that went through SFT and preference optimization.

2. **Understanding capability boundaries**: pre-training determines what the model "knows." If the pre-training data didn't include a particular domain, SFT and RLHF can't fix that — they adjust behavior, not knowledge.

3. **Understanding fine-tuning logic**: when a company says "we fine-tuned the model on our data," they're usually doing something similar to SFT — continuing to train with their own example conversations so the model learns their tone and format.

## Next Up

The model has learned language, learned to converse, and learned human preferences. But all its "knowledge" is compressed into parameters — it can't be updated, and it can't cite sources. Next, we'll look at a different approach: instead of changing the model's parameters, feed it external knowledge at inference time. That's RAG (Retrieval-Augmented Generation), and it's the most common approach in enterprise AI today.

## References

- Ouyang, L. et al. (2022). [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155). NeurIPS 2022.
- Rafailov, R. et al. (2023). [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290). NeurIPS 2023.
- Lambert, N. et al. (2022). [Illustrating Reinforcement Learning from Human Feedback (RLHF)](https://huggingface.co/blog/rlhf). Hugging Face Blog.
- Touvron, H. et al. (2023). [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288). Meta AI.
