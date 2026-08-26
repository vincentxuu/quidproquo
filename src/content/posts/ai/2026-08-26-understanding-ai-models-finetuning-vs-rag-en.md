---
title: "Fine-tuning vs RAG: When to Teach the Model vs When to Look Things Up"
date: 2026-08-26
category: ai
type: deep-dive
tags: [fine-tuning, rag, retrieval-augmented-generation, llm, ai-model, vector-database]
lang: en
series:
  name: "認識 AI 模型"
  order: 13
tldr: "Data changes often and you need citations → RAG. Need consistent style or want to run on a small device → fine-tuning. In practice, many production systems use both: fine-tune a small model that speaks your domain language, then use RAG to supply up-to-date facts."
description: "A practical guide for choosing between fine-tuning and RAG: when each approach works, what they cost, their risks, and the hybrid architecture that most production systems end up using."
draft: false
glossary:
  - term: "Fine-tuning"
    def: "Continuing to train a pre-trained model on your own data so it learns domain-specific knowledge or style"
  - term: "RAG"
    def: "Retrieval-Augmented Generation — at query time, retrieve relevant documents from a knowledge base and include them in the prompt so the model can reference them"
  - term: "Catastrophic Forgetting"
    def: "When a model learns new knowledge during fine-tuning but forgets capabilities it previously had"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag)

You have a pile of internal company documents and you want a model to answer questions about them. Two paths lie ahead: feed the data into the model through additional training (fine-tuning), or look up relevant documents in real time when the user asks a question (RAG).

These two paths solve different problems, have different costs, and suit different scenarios.

## Fine-tuning: Teaching the Model Your Language

Fine-tuning means continuing to train a pre-trained model on your own data. The model's weights get updated — knowledge is "baked into" the model itself.

### How It Works

1. Prepare training data — typically prompt-completion pairs, hundreds to tens of thousands of examples
2. Pick a base model (e.g., Llama 3, Mistral, GPT-4o mini)
3. Train for a few epochs, updating some or all of the model's weights
4. Validate performance, deploy the new model

### When It Fits

- **Consistent style**: You want the model to always reply in a specific format — say, three-step answers for customer service
- **Behavioral changes**: You want the model to refuse certain questions or speak in a particular tone
- **Small model + specialized domain**: Turn a 7B or 8B model into a domain expert that runs on a phone or edge device
- **Efficiency**: A fine-tuned model doesn't need to process extra documents at inference time — lower latency

### Costs

- **GPU time**: Even with parameter-efficient methods like LoRA, expect hours to days of GPU compute
- **Data preparation**: Curating high-quality training data is often the most time-consuming part
- **Version management**: When data changes, you retrain — every version is a new model

### Risks

- **Catastrophic Forgetting**: The model learns new things but forgets old capabilities. Teach it to write legal briefs, and it might lose the ability to chat casually
- **Overfitting**: With too little or too homogeneous training data, the model just parrots the training set and fumbles on novel inputs
- **Hallucination doesn't go away**: Fine-tuning teaches "how to say it," not "whether it's correct" — the model may confidently produce wrong answers in your taught style

## RAG: Looking Things Up for the Model

RAG (Retrieval-Augmented Generation) doesn't change the model itself. When a user asks a question, it first searches a knowledge base for relevant documents, stuffs them into the prompt, and lets the model "answer with an open book."

### How It Works

1. Split documents into small chunks and convert them to vectors using an embedding model
2. Store vectors in a vector database (e.g., Pinecone, Qdrant, Weaviate, Cloudflare Vectorize)
3. When the user asks a question, convert it to a vector too and find the most similar chunks
4. Pack the retrieved documents and the question into the prompt, send it to the model

### When It Fits

- **Frequently updated data**: Product docs, policies, price lists — update the documents and you're done, no retraining needed
- **Citations required**: You can tell the user "this answer came from document X, page Y"
- **Large knowledge base**: The company has tens of thousands of documents; embedding them all into model weights isn't practical, but retrieving the five most relevant chunks is enough
- **A general model is fine**: You don't need to change the model's behavior, just show it the right data

### Costs

- **Embedding pipeline**: Every document needs to be embedded; new documents need processing promptly
- **Vector database**: You're running a vector DB with storage and query costs
- **Retrieval latency**: An extra search step per query, typically adding 100–500ms
- **Token consumption**: Retrieved documents take up context window space, increasing inference costs

### Risks

- **Retrieval failure**: If the right document isn't found, the model falls back to its own knowledge — which usually means hallucination
- **Context window limits**: Retrieve too many documents and they won't fit; retrieve too few and you might miss critical information
- **Document quality**: If the knowledge base itself contains errors, the model will "diligently cite wrong information"

## Decision Framework

Choosing between fine-tuning and RAG isn't binary. Here's a simple decision flow:

```
What problem are you solving?
│
├─ Data updates frequently? ──→ RAG
│
├─ Need to cite sources? ──→ RAG
│
├─ Need consistent style/format? ──→ Fine-tuning
│
├─ Need to run on a small device? ──→ Fine-tune a small model
│
├─ All of the above? ──→ Fine-tuning + RAG
│
└─ Not sure? ──→ Start with RAG (lower cost, reversible)
```

A practical rule of thumb: **start with RAG**. The barrier to entry is low, iteration is fast, and if it goes wrong you haven't ruined a model. If RAG can't solve your problem — usually issues of style, format, or specific behavior — then consider fine-tuning.

## Practical Examples

### Customer Support Bot → RAG

An e-commerce company wants AI to answer return and refund questions. Return policies update quarterly, and new products launch constantly.

Use RAG: embed the support knowledge base and product catalog into a vector database. When policies change, swap the documents — no retraining needed. Answers include source links so support managers can audit them.

### Code Completion Model → Fine-tuning

A company wants to train an autocomplete tool for internal code. The internal codebase has its own frameworks, naming conventions, and API patterns.

Use fine-tuning: fine-tune a code model (e.g., CodeLlama or StarCoder) on the internal codebase. The model learns the company's naming style and API usage, completing code without needing to search the codebase every time.

### Legal Research Assistant → Fine-tuning + RAG

A law firm wants an AI assistant that can answer regulatory questions. Laws update frequently, but legal writing style is fixed.

Hybrid approach: fine-tune a model to learn legal writing conventions and citation formats, then use RAG to search for the latest statutes and case law. The model answers in language lawyers understand while ensuring cited laws are current.

## Summary

| | Fine-tuning | RAG |
|---|---|---|
| What changes | The model itself (weight updates) | The model's input (documents in the prompt) |
| Best for | Style, format, behavior, small model specialization | Real-time knowledge, frequent updates, citations |
| Data updates | Retrain | Update the knowledge base |
| Barrier to entry | Higher (GPU, data engineering) | Lower (vector DB, embedding) |
| Risks | Catastrophic forgetting, overfitting | Retrieval failure, context overflow |

In practice, start with RAG to solve "knowledge" problems, and consider fine-tuning only when you need to change "behavior." Many production systems use both.

## References

- Lewis, P. et al. ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."](https://arxiv.org/abs/2005.11401) NeurIPS, 2020.
- Hu, E. J. et al. ["LoRA: Low-Rank Adaptation of Large Language Models."](https://arxiv.org/abs/2106.09685) ICLR, 2022.
- Gao, Y. et al. ["Retrieval-Augmented Generation for Large Language Models: A Survey."](https://arxiv.org/abs/2312.10997) arXiv:2312.10997, 2024.
- OpenAI. ["Fine-tuning — OpenAI API Documentation."](https://platform.openai.com/docs/guides/fine-tuning) 2024.
- Anthropic. ["Retrieval Augmented Generation (RAG) — Anthropic Documentation."](https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation) 2024.
