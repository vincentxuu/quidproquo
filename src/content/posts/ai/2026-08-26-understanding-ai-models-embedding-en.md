---
title: "Embeddings: How Models Turn Words Into Computable Vectors"
date: 2026-08-26
category: ai
type: deep-dive
tags: [embedding, vector, cosine-similarity, nlp, rag, ai-model]
lang: en
series:
  name: "認識 AI 模型"
  order: 3
tldr: "Models don't understand text — they only understand numbers. Embeddings map each token to a vector of several hundred dimensions, where semantically similar words end up close together in vector space. This is the shared foundation behind search, RAG, and classification."
description: "An introduction to embeddings: from one-hot to dense vectors, how cosine similarity measures closeness, practical applications in search and RAG, and how embedding models differ from LLMs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-embedding)

In the previous article, we learned that models break text into tokens. But tokens are just a way of slicing — once the model has a sequence of tokens, how does it "understand" them?

The answer: it doesn't. Models do math from start to finish. So the first step is turning each token into a set of numbers.

## Computers Can't Read

When you see the word "cat," your mind conjures a furry four-legged animal. When a computer sees "cat," nothing happens — it can only process numbers. For a model to do anything with text (compare, classify, generate), the text must first become numbers.

The most intuitive approach is **one-hot encoding**. Suppose our vocabulary has just five words:

| Word | Vector |
|---|---|
| cat | `[1, 0, 0, 0, 0]` |
| dog | `[0, 1, 0, 0, 0]` |
| fish | `[0, 0, 1, 0, 0]` |
| car | `[0, 0, 0, 1, 0]` |
| boat | `[0, 0, 0, 0, 1]` |

Each word gets one slot — its own position is 1, everything else is 0.

This approach has two fatal problems:

1. **Too sparse.** Modern vocabularies can have over 100,000 tokens. Each vector would be 100,000 dimensions with a single 1 and the rest zeros. A massive waste of space and compute.
2. **No meaning.** In one-hot space, the distance between "cat" and "dog" is exactly the same as between "cat" and "car." The model can't see any semantic relationship from these vectors.

## From Sparse to Dense: The Core Idea of Embeddings

Embeddings take a completely different approach. They map each token to a **dense vector** — a few hundred dimensions, where every dimension is a meaningful floating-point number.

For example, a simplified 3-dimensional embedding might look like this:

| Word | Vector |
|---|---|
| cat | `[0.82, -0.15, 0.41]` |
| dog | `[0.79, -0.12, 0.38]` |
| fish | `[0.45, 0.60, 0.22]` |
| car | `[-0.70, 0.30, 0.85]` |
| boat | `[-0.65, 0.35, 0.80]` |

Notice a few things:

- **"Cat" and "dog" have very similar numbers** — they're semantically related (both pets, both animals).
- **"Car" and "boat" are also close** — both are vehicles.
- **"Cat" and "car" are far apart** — semantically unrelated.

These numbers aren't filled in by hand. They're learned by the model from massive amounts of text. Individual dimensions don't necessarily correspond to concepts humans can name, but the overall effect is: **words with similar meanings end up close together in vector space.**

## Measuring "Closeness"

There are many ways to measure distance between vectors. In NLP, the most common is **cosine similarity**.

It ignores vector length and only looks at direction. Imagine two arrows shooting out from the origin — if they point nearly the same way, cosine similarity is close to 1; perpendicular is 0; opposite is -1.

```
cosine_similarity(A, B) = (A · B) / (|A| × |B|)
```

Using our example:

- `cosine(cat, dog)` ≈ 0.99 — very similar
- `cosine(cat, car)` ≈ -0.38 — not similar
- `cosine(car, boat)` ≈ 0.99 — very similar

This is how a model "knows" that cats and dogs are more alike — it doesn't need to understand what a cat is. It just checks whether the vectors point in similar directions.

## Visual Intuition: A Map in Vector Space

Real embeddings have hundreds of dimensions, but compressing to 2D makes the intuition clear. Imagine a flat map:

- Animal words cluster in one corner: cat, dog, rabbit
- Vehicle words cluster in another: car, boat, airplane
- Food words might be in yet another corner

Even more interesting, embeddings capture **parallel relationships**. The classic example:

```
king - man + woman ≈ queen
```

The direction from "king" to "queen" is nearly identical to the direction from "man" to "woman." The model was never explicitly taught that "the female counterpart of a king is a queen," but because these words appear in similar contexts across massive text corpora, the trained vectors naturally carry this structure.

When Word2Vec first demonstrated this phenomenon in 2013, the NLP community was stunned — hundreds of floating-point numbers somehow encode the logical structure of human language.

## Practical Applications

### Semantic Search

Traditional search relies on keyword matching: you type "how to fix a faucet" and the system finds documents containing those words. But if a document says "dealing with a leaky tap," the keywords don't match and you miss it.

Semantic search works differently: convert the query and all documents into embeddings, then find the closest vectors. Because "fix a faucet" and "dealing with a leaky tap" have similar embeddings, the system finds relevant results even when the wording differs.

### RAG (Retrieval-Augmented Generation)

RAG is currently the most popular way to get LLMs to answer questions about data they haven't seen. The process:

1. Pre-process all documents into chunks, compute an embedding for each, and store them in a vector database
2. When a user asks a question, compute its embedding too
3. Find the closest chunks in the vector database
4. Feed those chunks into the prompt and let the LLM answer based on them

Steps 1 through 3 depend entirely on embeddings — without embeddings, RAG doesn't exist.

### Classification and Clustering

Once you've converted a large set of documents into embeddings, you can feed them into a classifier (is this complaint about returns or quality?) or run clustering analysis (what natural groups do these thousands of feedback entries fall into?).

## Embedding Models vs. LLMs

It's important to distinguish two types of models:

| | Embedding Model | LLM |
|---|---|---|
| Input | A piece of text | A piece of text (prompt) |
| Output | A fixed-length vector | New text (generation) |
| Parameters | Typically hundreds of millions (smaller) | Billions to trillions (much larger) |
| Use cases | Search, matching, classification | Conversation, summarization, translation, reasoning |
| Cost | Cheap | Expensive |

Models like OpenAI's `text-embedding-3-small` or BAAI's `bge-m3` are embedding models — they don't "talk." They just turn your text into a set of numbers. GPT-4 or Claude are LLMs — they have embedding layers internally, but their ultimate purpose is generating text.

In other words: **every LLM contains embeddings, but an embedding model is not an LLM.**

## Looking Ahead

Now we know that models convert tokens into vectors, and that distances between vectors represent semantic closeness. But where do these vector values come from? How does the model know what "cat"'s vector should look like?

The answer: through training. And training requires an objective — a mathematical function that tells the model "you got it right" or "you got it wrong."

Next up: **the loss function**.

## References

- Mikolov, T. et al. (2013). *Efficient Estimation of Word Representations in Vector Space*. [https://arxiv.org/abs/1301.3781](https://arxiv.org/abs/1301.3781)
- Reimers, N. & Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*. [https://arxiv.org/abs/1908.10084](https://arxiv.org/abs/1908.10084)
- Google. *What Are Word and Sentence Embeddings?* Machine Learning Crash Course. [https://developers.google.com/machine-learning/crash-course/embeddings](https://developers.google.com/machine-learning/crash-course/embeddings)
