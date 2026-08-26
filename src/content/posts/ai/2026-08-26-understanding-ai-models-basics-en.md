---
title: "Tokens, Context Windows, and Inference vs Training: Three Things to Know Before Using AI Models"
date: 2026-08-26
category: ai
type: deep-dive
tags: [llm, token, context-window, inference, ai-model, tokenization]
lang: en
series:
  name: "認識 AI 模型"
  order: 1
tldr: "Models don't read words — they read tokens. A Chinese character is typically 1-2 tokens; an English word is 1-3. The context window is the token limit per request. Inference is using a model; training is teaching one. What you do every day is inference."
description: "AI model fundamentals: what tokens are, why context windows have limits, and the difference between inference and training. Building the mental model of 'tokens in, probabilities out'."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-basics)

You open ChatGPT, type "write me a sick leave email," and a reply appears in seconds. What actually happened in between?

This post covers three things: tokens, context windows, and inference vs training. After reading it, you'll have one mental model: **tokens in, probabilities out**.

## Tokens: The Model's Smallest Unit of Reading

Models don't read "characters." They don't read "words." They read **tokens**.

A token is the smallest unit in the model's vocabulary. Before training, a fixed vocabulary is built (typically 100K to a few hundred thousand tokens), and all inputs must be broken down into entries from this table.

### English tokenization

Common short words are usually one token:

```
"ChatGPT is great"
→ ["Chat", "G", "PT", " is", " great"]
→ 5 tokens
```

Uncommon long words get split into subwords:

```
"tokenization"
→ ["token", "ization"]
→ 2 tokens
```

### Chinese tokenization

Chinese is more interesting. Since the character set is enormous, the vocabulary can't cover every character. Common characters are typically 1 token, while rare ones may be split into 2-3 tokens (based on UTF-8 bytes):

```
"人工智慧" (artificial intelligence)
→ ["人工", "智", "慧"]
→ 3 tokens
```

A rough conversion: **1,000 Chinese characters ≈ 800-1,500 tokens**, depending on the model and character frequency. For English, it's roughly **1 word ≈ 1.3 tokens**.

### Why tokens instead of characters?

Two reasons:

1. **Efficiency.** Processing character-by-character would require an impossibly large vocabulary (Unicode alone has over 100,000 Chinese characters). Subword tokenization covers virtually all languages with a manageable vocabulary.
2. **Semantic density.** "un-believ-able" split into three meaningful fragments helps the model learn that un- means negation and -able means capability.

Tokens are also the billing unit. API pricing is per-token — so the same passage in Chinese may cost more tokens (and more money) than the same content in English.

## Context Window: How Much the Model Can See at Once

The context window is the maximum number of tokens the model can process **in a single inference** — including both your input and the model's output.

| Model | Context window |
|-------|---------------|
| GPT-3 (2020) | 4,096 tokens |
| GPT-4 (2023) | 128K tokens |
| Claude 4 Opus (2025) | 200K tokens |
| Gemini 2.5 Pro (2025) | 1M tokens |

4,096 tokens is roughly 3,000 English words — about one blog post. 200K tokens is roughly a 150,000-word novel.

### What happens when you exceed the limit?

It depends on the implementation:

- **Truncation**: Earlier messages in the conversation get dropped. Ever had ChatGPT suddenly "forget" something you said earlier? That's this.
- **Rejection**: The API returns an error telling you the token count exceeds the limit.

The context window limits output too. If you've used 190K tokens of input, the model only has 10K tokens left for its reply.

### Why is there a limit at all?

Because the Transformer architecture (the backbone of virtually all modern language models) has computation that scales quadratically with context length. Double the context, quadruple the compute. While various techniques keep pushing the ceiling higher (sparse attention, sliding windows, etc.), physics dictates that the amount a model can see at once will always be finite.

## Inference vs Training: Using a Model vs Teaching a Model

**Training** is the process of teaching a model. A model has billions of adjustable numbers (parameters), and training is the process of tuning those numbers.

For a GPT-4-class model, one training run requires:
- Trillions of tokens of training data (essentially the entire written internet)
- Tens of thousands of GPUs running for months
- Hundreds of millions of dollars

Once training is complete, the parameters are fixed. The model is now a "tokens → probabilities" conversion machine.

**Inference** is the process of using a model. You type something in, the model uses its fixed parameters to compute a probability distribution over the next token, picks the most likely one, appends it to the input, and computes again. One token at a time.

This is why model responses appear one word at a time — it really is generating one token per step.

### Why is inference cheap and training expensive?

Inference only requires "multiplying and adding" — running the input tokens through fixed parameter matrices. The compute for a single inference is comparable to applying a filter to a photo.

Training does all of that computation, plus three extra steps at every stage:
1. Calculate the loss (how far the prediction is from the correct answer)
2. Backpropagate (send the error signal back through every layer)
3. Update parameters (adjust billions of numbers)

Training processes orders of magnitude more data than inference. That's why training a model costs hundreds of millions of dollars, but a single API inference call costs fractions of a cent.

### What you do every day is inference

Chatting with ChatGPT = inference. Calling Claude via API = inference. Letting Copilot autocomplete your code = inference.

You're not going to train a model yourself. That's OpenAI's, Anthropic's, and Google's job. You pick a pre-trained model and run inference — like choosing a factory-built car and driving it.

## Putting It All Together: Tokens In, Probabilities Out

Connect the three concepts:

1. You type a message
2. The model splits it into **tokens**
3. The model processes those tokens within its **context window**
4. It runs **inference** — using fixed parameters to calculate the probability of the next token
5. It picks a token, appends it to the context, and repeats until the response is complete

That's all there is to "using an AI model." No consciousness, no understanding, no thinking — just tokens in, probabilities out.

Next, we'll look at how those probabilities are actually computed: what parameters are, what the Transformer is, and why the attention mechanism made language models suddenly useful.

## References

- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — Online tool to see how any text gets split into tokens
- [Anthropic — Counting Tokens](https://docs.anthropic.com/en/docs/build-with-claude/token-counting) — Anthropic's official token counting documentation
- [Karpathy — Let's build the GPT Tokenizer](https://www.youtube.com/watch?v=zduSFxRajkE) — Andrej Karpathy's tutorial building a BPE tokenizer from scratch
