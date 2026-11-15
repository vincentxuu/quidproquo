---
title: "AI Engineer Interview Daily — 2026-11-03: Deep Learning & NLP"
date: 2026-11-03
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's topic is Deep Learning & NLP: working through a real Amazon interview question on deriving scaled dot-product self-attention, then extending into the pretraining-objective difference between BERT and GPT."
tldr: "Today's core is taking self-attention from formula to engineering judgment: how Q/K/V get projected from the input, why we divide by √d_k (to avoid vanishing softmax gradients), how multi-head attention lets the model learn several kinds of relationships at once, and what causal masking versus padding masking each solve. From there we move up to BERT (MLM, bidirectional, good for understanding-style downstream tasks) versus GPT (next-token prediction, unidirectional, good for generation), and how that pretraining-objective difference should drive which one you reach for. Today's practice question is lifted from Amazon's Software Engineer (Machine Learning) technical screen — derive scaled dot-product self-attention end to end and compare BERT with GPT. The trap is memorizing Attention(Q,K,V) = softmax(QK^T/√d_k)V without being able to explain why each step exists."
series:
  name: "AI Engineer Interview Daily"
  order: 76
---

> 🌏 [中文版](/posts/daily/2026-11-03-ai-interview-daily)

## Today's Focus

Tuesday is the fixed slot for Deep Learning & NLP. Today's pick is self-attention and the Transformer — a near-universal question for any LLM-adjacent role, but most candidates prepare by memorizing the formula and the architecture diagram, then freeze the moment they're asked "why divide by √d_k" or "what's the actual difference between BERT's and GPT's pretraining objectives, and how does that difference change which one you'd pick for a downstream task." Questions like this aren't testing whether you can draw the Transformer block diagram — they're testing whether you know what problem each design choice is solving. That's exactly the "math derivation + architecture understanding" combo that shows up anywhere from phone screens to onsites.

## Core Concepts Cheat Sheet

### Scaled Dot-Product Self-Attention: what each step is actually solving

Self-attention projects each input token's embedding into three vectors — Query (Q, "what information am I looking for right now"), Key (K, "what information do I hold that can be found"), and Value (V, "the actual content handed over once found") — all three obtained by multiplying the input embedding by learned weight matrices W_Q, W_K, and W_V. Scores are computed by taking the dot product between the current token's Q and every token's K in the sequence; a larger dot product means greater relevance. That score is then divided by √d_k — if the components of Q and K are independent random variables with mean 0 and variance 1, the dot product's variance equals d_k. As d_k grows, the score's scale blows up and pushes softmax into a region where gradients vanish, stalling training; dividing by √d_k pulls the variance back to 1 and keeps gradients stable. The scaled scores are then normalized by softmax into weights summing to 1, and a weighted average over every token's V produces the current token's updated, context-fused representation.

```flow-diagram
{
  "title": "Five steps of scaled dot-product self-attention",
  "lang": "en",
  "width": 560,
  "height": 650,
  "nodes": [
    {"id": "input", "label": "Input embedding", "x": 280, "y": 40, "w": 260},
    {"id": "qkv", "label": "Project into Q／K／V", "x": 280, "y": 150, "w": 260},
    {"id": "score", "label": "Dot product Q·K for scores", "x": 280, "y": 260, "w": 260},
    {"id": "scale", "label": "Scale by √d_k", "x": 280, "y": 370, "w": 260, "tone": "accent"},
    {"id": "softmax", "label": "Softmax normalize", "x": 280, "y": 480, "w": 260},
    {"id": "output", "label": "Weighted sum of V\n→ output representation", "x": 280, "y": 600, "w": 260}
  ],
  "edges": [
    {"from": "input", "to": "qkv", "step": 1, "label": "W_Q／W_K／W_V projection"},
    {"from": "qkv", "to": "score", "step": 2, "label": "per-token dot product"},
    {"from": "score", "to": "scale", "step": 3, "label": "stabilize gradients"},
    {"from": "scale", "to": "softmax", "step": 4, "label": "normalize to weights"},
    {"from": "softmax", "to": "output", "step": 5, "label": "weighted average of V"}
  ],
  "steps": [
    "The input token's embedding is multiplied by learned weight matrices W_Q, W_K, and W_V, projecting it into Query, Key, and Value vectors.",
    "The current token's Query vector is dotted with every token's Key vector in the sequence; a larger dot product means the two tokens are more related.",
    "The dot-product scores are divided by √d_k: larger d_k means larger variance in the dot product, and without scaling this pushes softmax into a region where gradients nearly vanish. Dividing by √d_k pulls the variance back to 1 and keeps training stable.",
    "The scaled scores go through softmax, normalizing into weights that sum to 1 and represent how much attention to pay to each token.",
    "Those weights are used to compute a weighted average over every token's Value vector, producing this token's new, context-fused representation."
  ],
  "caption": "Simplified view of a single attention head's computation; the parallel split and concat of multi-head attention are omitted."
}
```

### Multi-Head Attention: why split into several heads instead of computing once

A single attention function can only learn one kind of relationship pattern within one high-dimensional space. Multi-Head Attention splits the embedding dimension into several smaller subspaces, runs scaled dot-product attention independently in each one with its own learned Q/K/V projections, and lets the model capture several kinds of dependency simultaneously — for example, one head focused on grammatical structure (subject-verb pairing) while another focuses on semantic relatedness (coreference). The outputs of all heads are concatenated and passed through an output projection matrix back to the original dimension. A common follow-up: if you add more heads, each head's dimension shrinks — does more heads always help? No — the number of heads versus the dimension per head is itself a hyperparameter to tune; too many heads with too little dimension per head means each head can't learn sufficiently fine-grained patterns.

### Causal mask versus padding mask: two masks solving entirely different problems

Padding mask handles the problem of variable sentence lengths within a batch and the zero-padding used to equalize them — attention scores at padding positions are set to negative infinity, so after softmax their weight becomes 0, preventing the model from wasting attention on meaningless filler tokens. This mask is needed in both encoder and decoder regardless of task. Causal mask (also called a future mask) is used only in the decoder's autoregressive generation setting — during both training and inference, position t is forced to only see positions 1 through t and never the future, achieved by setting the attention scores pointing "forward in time" to negative infinity as well. The two masks can be applied together without interfering, since both simply turn disallowed scores into negative infinity before softmax.

### BERT vs. GPT: the pretraining objective dictates how you use it downstream

BERT uses Masked Language Modeling (MLM) — roughly 15% of input tokens are randomly masked, and the model predicts them using bidirectional context (tokens both before and after are visible). This bidirectionality makes BERT especially suited to downstream tasks that require fully understanding a span of text, like classification, NER, or QA span extraction — but that same bidirectionality also means BERT isn't naturally suited to generating text, since it has never learned to "only see the past and generate the future." GPT uses pure next-token prediction — each position can only see tokens before it (enforced by a causal mask), predicting the next token. This unidirectional, autoregressive objective is inherently designed for generation, at the cost of losing the information bidirectional context would provide for understanding tasks. A common follow-up: for sentiment classification, which would you pick? The right line of reasoning is that BERT's native architecture is a closer match for "read the whole sentence and output one label" tasks — but modern large GPT-family models, through scale and instruction tuning, can already match or exceed fine-tuned BERT on such tasks via few-shot prompting. That reflects two competing routes — "architectural fit" versus "scale plus training method" — not that the GPT architecture is fundamentally incapable of understanding tasks.

## Today's Practice Question

### The question

Explain attention and Transformers: derive and explain scaled dot-product self-attention (Q/K/V, the scaling factor, masking, complexity), then explain the Transformer's encoder-decoder architecture (residual connections, pre-norm vs. post-norm, positional encoding), and finally compare BERT and GPT's pretraining objectives and architectural differences, and how those differences affect transfer learning and inference behavior.

**Source**: Amazon Software Engineer (Machine Learning) technical screen (compiled from PracHub's interview question bank)　**Difficulty**: Advanced　**Round**: technical screen

### How to break it down

1. **Clarify the scope first**: This question is broad, so it's worth proactively segmenting it up front — "I'll derive the math for scaled dot-product attention, then explain how the encoder-decoder stack is built, and finish by comparing BERT and GPT — does that work?" This shows structured thinking and gives the interviewer room to dig into any one segment instead of spreading your effort evenly and thin.
2. **Build the framework**: Where Q/K/V come from, what the dot product represents, why it's divided by √d_k, and how the weighted sum works after softmax — these five steps are the foundation of the whole question. Without nailing this, everything you say later about multi-head and masking is just noise.
3. **Go deep on the core**: multi-head attention solves the limitation that "a single attention function can only learn one kind of relationship pattern"; causal mask and padding mask solve two distinct problems — "can't see the future" and "shouldn't see padding"; residual connections and layer norm solve vanishing gradients and numerical instability in deep networks, and pre-norm (placing the norm before the sublayer) trains more stably than post-norm in deep models, which is why modern large models (like the GPT family) widely adopt pre-norm; positional encoding solves the fact that self-attention has no inherent notion of position (swap two tokens' order and the attention scores don't change, so position must be injected explicitly).
4. **Close it out**: Converge the BERT/GPT comparison into one guiding principle — "the pretraining objective determines how the model accesses context; bidirectional access suits understanding, unidirectional autoregressive access suits generation, and the choice isn't about which is more advanced, it's about whether the task's information-access pattern matches." Then add: "but scale and instruction tuning in recent years have already blurred that line in practice" — this is the up-to-date perspective interviewers want to hear.

### Sample answer (something you could actually say in an interview)

> **Start with the math foundation**: The core of self-attention is computing a new representation for each token by taking its Query vector's dot product with the Key vector of every token in the sequence — the score represents relevance. That score gets divided by √d_k before going into softmax — this scaling matters because if Q and K's components are independent random variables with mean 0 and variance 1, the dot product's variance equals d_k. A large d_k blows up the score, pushing softmax into a region where gradients nearly vanish, and dividing by √d_k pulls the variance back to 1 so training stays stable. The resulting softmax weights are then used for a weighted average over the Value vectors, which gives this token its new, context-fused representation.
>
> **Multi-head and masking fill in the gaps of a single attention function**: One attention pass can only learn one kind of relationship within a single subspace, so Multi-Head Attention splits the dimension into several subspaces run in parallel, each learning distinct Q/K/V projections to capture different kinds of dependency, then concatenates and projects back to the original dimension. Masking serves two different purposes — padding mask sets scores at padded positions to negative infinity to avoid wasting attention on filler tokens; causal mask is only used in autoregressive generation, forcing each position to see only itself and the past. Both just turn disallowed scores into negative infinity before softmax, so they can be applied together without conflict.
>
> **Converge the BERT/GPT comparison into one judgment principle**: BERT uses bidirectional Masked Language Modeling, predicting masked tokens using both preceding and following context, which makes it naturally suited to "read the whole sentence and judge" tasks like classification and NER. GPT uses unidirectional autoregressive next-token prediction, enforced by a causal mask that only looks backward, which naturally maps to generation. The choice isn't about which architecture is more advanced — it's about whether the downstream task's information-access pattern matches the pretraining objective. That said, I'd add that sufficiently large GPT-family models, through instruction tuning and few-shot prompting, can already handle understanding tasks like classification with the same model — in practice that line isn't as absolute as the textbook framing suggests.

### Self-check list

Use this table to check whether your answer missed any key points:

| Checklist item | Covered? |
|---|---|
| Correctly defined how Q/K/V are projected from the input, and what the dot-product score represents | |
| Explained why we divide by √d_k (variance grows with d_k, pushing softmax into a gradient-vanishing saturation region) rather than just reciting "there's this one step" | |
| Distinguished padding mask from causal mask as solving different problems, rather than conflating them | |
| Mentioned that multi-head attention solves the limitation that a single attention function can only learn one relationship pattern | |
| Correctly compared BERT's (bidirectional MLM, suited to understanding) and GPT's (unidirectional next-token, suited to generation) pretraining objectives, and connected that to downstream usage | |
| Bonus: mentioned that instruction tuning / scale has blurred the BERT-vs-GPT task boundary in practice, showing an up-to-date perspective | |

## Further Reading

- [Mastering Transformers: The Ultimate AI Interview Prep Guide (2026) — Sundeep Teki](https://www.sundeepteki.org/advice/the-transformer-revolution-the-ultimate-guide-for-ai-interviews) — A full breakdown of the math behind every step of scaled dot-product attention and the reasoning behind the scaling factor, and notes how deeply interviewers at OpenAI and Google DeepMind probe attention mechanics.
- [Understanding and Coding the Self-Attention Mechanism of Large Language Models From Scratch — Sebastian Raschka](https://sebastianraschka.com/blog/2023/self-attention-from-scratch.html) — A from-scratch code implementation of self-attention, useful for verifying your understanding of the Q/K/V computation flow against working code.

## References

- [Explain attention and Transformers — PracHub (Amazon, Software Engineer / Machine Learning)](https://prachub.com/interview-questions/explain-attention-and-transformers) — Source of today's practice question, listed as a real Amazon technical screen question.
- [Mastering Transformers: The Ultimate AI Interview Prep Guide (2026) — Sundeep Teki](https://www.sundeepteki.org/advice/the-transformer-revolution-the-ultimate-guide-for-ai-interviews) — Source for the "Scaled Dot-Product Self-Attention" section's variance analysis behind the scaling factor.
- [LLM Interview Series(3): Transformers Explained — Attention Is All You Need — DEV Community](https://dev.to/jackm_345442a09fb53b/llm-interview-series3-transformers-explained-attention-is-all-you-need-523o) — Source for the "Multi-Head Attention" section's parallel subspace and output-merging explanation.
- [Transformer-Interview-Question.md — Wenqing-Machine_Learning_Blog (GitHub)](https://github.com/purepisces/Wenqing-Machine_Learning_Blog/blob/main/Machine-Learning-Interview-Questions/Transformer-Interview-Question.md) — Source for the "Multi-Head Attention" section's definition and encoder sublayer structure.
- [100 NLP Questions & Answers | Attention part — Medium](https://medium.com/@milana.shxanukova15/100-nlp-questions-answers-attention-part-bf86e07251de) — Source for the "BERT vs GPT" section's self-attention/cross-attention masking distinction and pretraining-objective comparison.
