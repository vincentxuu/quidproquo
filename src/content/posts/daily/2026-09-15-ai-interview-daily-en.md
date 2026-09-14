---
title: "AI Engineer Interview Daily — 2026-09-15: Deep Learning & NLP"
date: 2026-09-15
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Today's drill covers five Transformer interview fundamentals — the Q/K/V mechanics of self-attention, why positional encoding is necessary, the architectural split between BERT and GPT, static vs. contextual word embeddings, and how to choose a fine-tuning strategy — plus a practice question on scaling a 2K-token model to handle 100K-token documents."
tldr: "Today's Deep Learning & NLP rotation covers the Q/K/V computation behind self-attention and where its O(n²) complexity comes from, why positional encoding is a Transformer necessity (from sinusoidal encodings to RoPE/ALiBi), the architectural and training-objective split between BERT (encoder, bidirectional) and GPT (decoder, causal), the real difference between static word embeddings like Word2Vec/GloVe and contextual ones from BERT/GPT, and how to pick between full fine-tuning, freezing upper layers, and LoRA. The practice question asks how you'd scale a Transformer from a 2K-token to a 100K-token context window — interviewers want to see whether you can connect complexity analysis, positional extrapolation, and production cost tradeoffs in one answer."
series:
  name: "AI Engineer Interview Daily"
  order: 27
---

> 🌏 [中文版](/posts/daily/2026-09-15-ai-interview-daily)

## Today's Topic

Tuesday's rotation is Deep Learning & NLP, which in 2026 essentially means "the Transformer interview" — whatever the job title says (ML Engineer, NLP Engineer, AI Engineer), interviewers expect you to be able to sketch self-attention, positional encoding, and the BERT/GPT architectural split on a whiteboard, not just recite the title of "Attention Is All You Need." Today's material targets the mid-interview deep-dive pattern: first you're asked to "explain attention," and once you've cleared that, the follow-up pushes toward "what if the sequence is 100,000 tokens" — a question that forces you to connect complexity analysis with production tradeoffs.

## Core Concepts Cheat Sheet

### Self-attention: how Q, K, and V work

Every token produces three vectors — Query, Key, and Value — via learnable linear projections. The attention score of token i over token j is `softmax(Qᵢ · Kⱼ / √d_k)`, where dividing by `√d_k` prevents dot products from growing too large in high dimensions and killing the softmax gradient. Token i's output is the weighted sum of all value vectors. Multi-head attention runs h parallel attention operations with different projections, then concatenates and re-projects the results, letting the model attend to different "representation subspaces" at once. The detail most likely to draw a follow-up is complexity: `Q×Kᵀ` produces an n×n attention matrix, so doubling sequence length quadruples both memory and compute.

### Positional encoding: why Transformers need it

Unlike RNNs, Transformers process all tokens in parallel and have no inherent notion of order — without positional information, "dog bites man" and "man bites dog" would produce identical attention computations. The original Transformer uses sinusoidal positional encoding, `PE(pos, 2i) = sin(pos/10000^(2i/d_model))`, added to the token embedding; learnable absolute positional embeddings are also common. Both share the same weakness: they don't extrapolate well to sequence lengths beyond what the model was trained on. Modern LLMs use RoPE (Rotary Positional Embeddings) or ALiBi — relative positional schemes that generalize much better to longer sequences, which is part of why GPT-4 and Llama can handle long context.

### BERT vs. GPT: architecture and training objective

Both are Transformers, but each uses only half of it. BERT uses the encoder with bidirectional attention — every token attends to every other token in both directions — trained with masked language modeling (15% of tokens are masked: 80% replaced with `[MASK]`, 10% swapped for a random token, 10% left unchanged, forcing the model to learn deep bidirectional representations) plus next-sentence prediction. It's best suited to understanding tasks: classification, NER, QA. GPT uses the decoder with causal (left-to-right) attention — each token only attends to what came before it — trained with autoregressive next-token prediction, and is best suited to generation. In 2026, mainstream general-purpose assistants are GPT-style architectures fine-tuned with RLHF/DPO.

### Static vs. contextual word embeddings

Word2Vec, GloVe, and FastText assign each word a single fixed vector regardless of context — "bank" gets the identical vector whether the sentence is about a river or a financial institution, which is a real problem for polysemous words. ELMo (built on bidirectional LSTMs) was the first model to produce contextual representations; BERT and GPT, built on self-attention, produce vectors where the same word gets a meaningfully different 768-dimensional representation depending on the sentence it's in. If you're asked "why doesn't anyone use Word2Vec anymore," the core answer is that static vectors can't handle polysemy or context dependence.

### Choosing a fine-tuning strategy

Full fine-tuning updates every parameter — usually the best results, but also the highest cost and data requirement, and the learning rate needs to be kept low (2e-5 to 5e-5 for BERT) to avoid destroying what the pretrained model already learned. Linear probing freezes the pretrained layers and trains only a new head — less prone to overfitting with limited data, but with a lower ceiling. LoRA-style parameter-efficient fine-tuning doesn't update the weight matrix W directly; instead it adds a low-rank decomposition `ΔW = AB` and trains only the small A and B matrices, cutting trainable parameters by 10 to 1000x, and is now the dominant approach for fine-tuning LLMs. The core tradeoff across all three is data volume, compute budget, and how far the target task is from the pretraining objective.

## Today's Practice Question

### The Question

You have a Transformer model that supports a 2K-token context window, and the product now needs it to handle documents up to 100K tokens. How would you design this expansion?

**Source**: Adapted and combined from goodspace.ai's "LLM Interview Questions" section on positional-encoding extrapolation and DataExpertise's "Deep Learning Interview Questions 2026" Q18 on attention complexity　**Difficulty**: Advanced　**Round**: onsite / system design hybrid

### How to Break It Down

1. **Clarify first**: Ask whether the 100K tokens need to be supported at training time or extrapolated zero-shot at inference; whether the document-access pattern is reading the whole thing for a summary or precise in-document retrieval (which determines whether RAG-based routing is a better fit than brute-forcing context length); and what the latency and cost budget looks like, since scaling attention from 2K to 100K tokens means a 2,500x increase in the `n²` memory and compute cost.
2. **Build a framework**: Split the problem into three layers. First, positional encoding — if the original model uses absolute positional embeddings, it fundamentally can't extrapolate past its trained length, so it needs to switch to a relative scheme like RoPE or ALiBi, or use position interpolation / NTK-aware scaling. Second, the attention computation itself — standard self-attention will blow up memory at 100K tokens, so you'd bring in Flash Attention to cut HBM read/write overhead, or move to sliding-window / sparse attention that only computes local plus a handful of global tokens. Third, whether an engineering workaround beats brute-forcing long context altogether — e.g., using RAG to retrieve only the most relevant passages instead of stuffing the entire document into context.
3. **Go deep on the core**: What interviewers really want to hear is that you understand "swapping positional encoding" and "swapping the attention implementation" are two separate problems. A common mistake is assuming Flash Attention alone gets you longer sequences — it only solves the memory-wall problem, not whether the model has ever "seen" positions that far out. Conversely, swapping in RoPE without touching the attention implementation still blows up memory at inference. Both need to happen together, and you typically also need a round of continued pretraining or long-context fine-tuning at the target length — architectural changes alone don't make a model naturally understand dependencies a hundred times longer than what it trained on.
4. **Close strong**: Propose how to verify the expansion actually works, not just that it runs — use a "needle in a haystack" style long-document retrieval test to confirm the model can actually surface a key fact buried in the middle of 100K tokens, not just near the beginning or end. Also report the resulting change in latency and cost so the product side understands long context isn't free.

### Sample Answer (What You'd Actually Say)

> **Framing the problem**: I'd first confirm whether the 100K tokens need to be supported at training time or extrapolated zero-shot, and whether the use case is whole-document summarization or precise retrieval — if it's the latter, I'd raise whether RAG-based routing, feeding only the most relevant passages into context, is a better fit than dumping the entire document in, because a lot of the time what's actually needed isn't longer context, it's better retrieval.
>
> **Architecture**: Assuming we do need to brute-force the context length, I'd start with the positional encoding — if the model uses absolute positional embeddings, it has a hard training-length ceiling and needs to switch to a relative scheme like RoPE or ALiBi, or use position interpolation so it doesn't fall apart entirely at unseen lengths. Then I'd address the O(n²) cost of attention itself — bringing in Flash Attention to cut the memory-bandwidth bottleneck, and if 100K is still too expensive, moving to sliding-window attention plus a handful of global tokens, trading a bit of theoretical global connectivity for feasible inference cost.
>
> **Verification and wrap-up**: Architectural changes alone aren't enough — I'd run a round of continued pretraining or at least long-context fine-tuning at the target length, then validate with a needle-in-a-haystack test to confirm the model can genuinely find a key fact buried in the middle of 100K tokens, not just near the start or end. Finally, I'd quantify the resulting latency and cost change so the product side can decide whether the investment is worth it, rather than assuming longer context is automatically better.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clarified whether training-time support or zero-shot extrapolation is needed, and whether RAG-based routing should be considered | |
| Correctly explained where attention's O(n²) complexity comes from (Q×Kᵀ producing an n×n matrix) | |
| Mentioned the positional-encoding extrapolation problem (absolute embedding ceiling vs. RoPE/ALiBi) | |
| Distinguished "swapping positional encoding" from "swapping the attention implementation" as separate concerns | |
| Mentioned a verification method (e.g. needle-in-a-haystack) rather than just "does it run" | |
| Bonus: quantified the latency and cost tradeoff to inform a product decision | |

## Further Reading

- [LLM Interview Questions and Answers for Freshers & Experienced (2026) — goodspace.ai](https://goodspace.ai/interview-questions/llm) — A thorough collection of follow-ups on positional-encoding extrapolation, KV cache, and long-context handling, good for filling in detail beyond today's practice question.
- [AI Fundamentals: Attention Mechanisms in Transformers (Part 1) — Towards AI](https://pub.towardsai.net/ai-fundamentals-attention-mechanisms-in-transformers-part-1-a91cce62fbab) — Explains Q/K/V intuitively; "every token is asking how relevant everyone else is to it" is a useful phrase to rehearse out loud.
- [ai-engineering-interview-questions — amitshekhariitbhu (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — A question-bank-style collection of AI engineering interview Q&A covering positional encoding, Q/K/V, and related extensions of today's topic.

## References

- [Deep Learning Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — Source for the self-attention, positional encoding, BERT/GPT architecture, and attention O(n²) sections.
- [NLP Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/nlp-interview-questions-answers-2026/) — Source for the static-vs-contextual embeddings and fine-tuning strategy sections.
- [LLM Interview Questions and Answers for Freshers & Experienced (2026) — goodspace.ai](https://goodspace.ai/interview-questions/llm) — Source for the positional-encoding extrapolation portion of today's practice question.
