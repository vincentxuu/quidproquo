---
title: "Transformers and Attention: How Models Decide Which Words to Look At"
date: 2026-08-26
category: ai
type: deep-dive
tags: [transformer, attention, self-attention, nlp, ai-model, architecture]
lang: en
series:
  name: "認識 AI 模型"
  order: 6
tldr: "The core of the Transformer is self-attention: for each token, the model computes how relevant every other token is, then takes a weighted sum. This lets the model reach across distance to figure out that 'it' refers to 'cat' not 'mat' — and is the foundation for how it handles long documents."
description: "An intuitive introduction to Transformers and self-attention: the Query/Key/Value analogy, how attention matrices decide which words the model focuses on, why multi-head attention needs multiple reading strategies, and how positional encoding preserves word order."
draft: false
glossary:
  - term: "Self-Attention"
    def: "A mechanism where each token computes relevance scores against all other tokens in the sequence to decide which ones to 'attend to'"
  - term: "Multi-Head Attention"
    def: "Running multiple sets of Q/K/V in parallel to capture different types of relationships (syntactic, semantic, coreference, etc.)"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-transformer)

## The Scene: What Does "It" Refer To?

Read this sentence:

> The cat sat on the mat because **it** was tired.

You know "it" refers to the cat, not the mat. How? Because "tired" describes a state of a living thing, and cats are alive, mats aren't. You didn't read word by word — your eyes jumped back and picked out the most relevant word.

A model needs to do the same thing. When deciding what word comes after "it," it must look back at all previous tokens and **decide which ones are worth paying attention to and which ones to ignore**.

That's what attention does.

## The Intuition: Selective Reading

Imagine you're reading a long contract and encounter the pronoun "said party." You don't reread the whole thing from scratch — your eyes scan backward, find the most likely referent, and skip everything irrelevant.

Attention works almost identically:

- For each token, the model asks: **"Which other tokens in the sequence are most relevant to what I need right now?"**
- It assigns each token a relevance score (a weight between 0 and 1)
- High-weight tokens get close attention; low-weight tokens are nearly ignored
- Finally, it takes a weighted sum of all tokens' information to produce the "understanding" at this position

This isn't a novel idea — you do it every day. Attention just turns "selective reading" into a mathematical operation that can be computed.

## The Mechanism: Query, Key, Value

Intuition in place — but how does the model actually compute "which tokens are relevant"? The answer is three vectors: **Query (Q), Key (K), and Value (V)**.

### The Library Analogy

Imagine a library:

- **Query (Q)**: The question in your head as you walk in — "I need books about cat fatigue"
- **Key (K)**: The label on each book's spine — "Animal Behavior," "Floor Materials," "Sleep Science"
- **Value (V)**: The actual content inside each book

You compare your Query against each book's Key. The better the match (higher relevance), the more you want to open that book and read its Value.

In a Transformer, every token plays all three roles simultaneously:

1. When it's the "token being processed," it emits a **Query** — "What am I looking for?"
2. When it's a "candidate being looked at," it offers a **Key** — "What can I tell you?"
3. If it's selected, it contributes its **Value** — "Here's my actual content"

### Computing Relevance: The QK Dot Product

Q and K are both vectors (derived from the embedding vectors from the previous article, passed through linear transformations). The more similar two vectors are, the larger their dot product.

```
relevance("it", "cat")  = Q_it · K_cat  = 8.2  ← high!
relevance("it", "mat")  = Q_it · K_mat  = 1.1  ← low
relevance("it", "the")  = Q_it · K_the  = 0.3  ← nearly ignored
```

Pass all scores through softmax (so they sum to 1) to get **attention weights**:

```
weights: [cat: 0.85, mat: 0.08, the: 0.02, sat: 0.03, on: 0.01, because: 0.01]
```

Finally, take the weighted sum of all tokens' Values:

```
output_it = 0.85 × V_cat + 0.08 × V_mat + 0.02 × V_the + ...
```

The result: the output representation for "it" is almost entirely the semantics of "cat." This is how the model "understands" that "it" refers to "cat."

### The Attention Matrix: A Full Picture

If the sentence has N tokens, every token must compute relevance against all N tokens. This forms an N×N matrix called the **attention matrix**.

For "The cat sat on the mat" (simplified):

```
         The   cat   sat    on   the   mat
The     [0.1   0.2   0.1   0.1  0.3   0.2]
cat     [0.1   0.3   0.2   0.0  0.1   0.3]
sat     [0.0   0.5   0.2   0.1  0.0   0.2]
on      [0.1   0.1   0.2   0.1  0.1   0.4]
the     [0.2   0.1   0.1   0.1  0.2   0.3]
mat     [0.1   0.1   0.1   0.3  0.2   0.2]
```

Each row sums to 1. Read each row as: "how much attention does this token allocate to every other token." The `sat` row gives 0.5 to `cat` — because the most relevant answer to "who's sitting?" is the subject.

<details>
<summary>Technical details: Scaled Dot-Product Attention formula</summary>

The complete attention computation:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

Dividing by $\sqrt{d_k}$ (the dimension of key vectors) prevents dot products from growing too large, which would cause softmax to produce near-one-hot distributions. The scaling keeps gradients stable and training smooth.

</details>

## Multi-Head Attention: Multiple Reading Strategies

A single set of Q/K/V can only capture one type of relationship. But language has many layers:

- **Syntactic**: "sat" → subject is "cat"
- **Coreference**: "it" → refers to "cat"
- **Modification**: "tired" → modifies "it" (indirectly "cat")

Multi-head attention runs **multiple sets of Q/K/V in parallel, each learning to focus on different types of patterns**.

Imagine sending 8 people (8 heads) into the same library, each with a different task:

- Person 1 looks for subject-verb relationships
- Person 2 looks for pronoun references
- Person 3 looks for adjective-noun modification
- …

Each searches independently; their results are concatenated. The model gains multiple "reading perspectives" at once.

<details>
<summary>Technical details: Head count and dimensions</summary>

The model doesn't manually assign each head a task — it learns the division of labor during training. Common configurations use 8 to 128 heads. Each head operates in $d_{\text{model}} / h$ dimensions, so the total computation is roughly the same as a single large head, but with greater expressive power.

</details>

## Positional Encoding: How the Model Knows Word Order

There's a problem we've been ignoring: the attention computation doesn't care about position at all. To attention, "The cat sat on the mat" and "mat the on sat cat The" are identical — it only looks at content, not order.

But word order obviously matters. "Dog bites man" and "man bites dog" mean very different things.

The fix is adding **positional information** (positional encoding) to the embeddings. The simplest way to think about it: each token gets a "position vector" added to its semantic embedding, telling the model which position it occupies.

```
final_input = embedding("cat") + position(2)
```

Now when attention computes the QK dot product, it considers both "what is this token" and "where is it."

<details>
<summary>Technical details: The evolution of positional encoding</summary>

The original Transformer (2017) used fixed sinusoidal functions to generate position vectors. Modern models (LLaMA, GPT) typically use Rotary Position Embedding (RoPE) or learnable position embeddings. RoPE handles very long sequences better and is the foundation for context-extension techniques like YaRN and NTK-aware scaling.

</details>

## Connecting Back: Why Attention Matters — and Where It Falls Short

Now you understand the core of how Transformers work:

1. Each token uses Q/K/V to compute relevance against every other token
2. A weighted sum produces a context-aware representation
3. Multiple heads capture different types of relationships in parallel
4. Positional encoding preserves word order

This explains why modern language models are so powerful — they can see any position in the entire input sequence in a single computation, unlike older architectures (RNNs) that processed word by word and gradually forgot earlier information.

But attention comes with costs:

- **Computation scales quadratically with sequence length.** N tokens require N×N comparisons. This is why context windows have limits — it's not that the model "can't remember," it's that very long inputs are too expensive (or too slow) to compute.
- **Not every token gets proper attention.** Even within the context window, in very long documents the attention weights for middle paragraphs tend to get diluted. This is why some models "miss details in the middle" of long inputs.

In the next article, we'll see where a model's capabilities come from — how three training phases (pretraining, SFT, and RLHF) transform a word-completion machine into a useful, safe assistant.

## Going Deeper

- [Stanford CS224N Lecture 5: Self-Attention and Transformers](https://web.stanford.edu/class/cs224n/) — motivates attention from a linguistics perspective
- [Stanford CS336 Lecture 3: Transformers](https://stanford-cs336.github.io/spring2025/) — engineering-focused with full implementation details
- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762) — the original paper that launched the Transformer era
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/) — perhaps the best visual explanation of Transformers on the internet

## References

- Vaswani, A. et al. (2017). [Attention Is All You Need](https://arxiv.org/abs/1706.03762). NeurIPS 2017.
- Stanford CS224N: [Natural Language Processing with Deep Learning — Lecture 5: Self-Attention and Transformers](https://web.stanford.edu/class/cs224n/).
- Stanford CS336: [Language Modeling from Scratch — Lecture 3: Transformers](https://stanford-cs336.github.io/spring2025/).
- Alammar, J. (2018). [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/).
- Su, J. et al. (2024). [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864). Neurocomputing, 568, 127063.
