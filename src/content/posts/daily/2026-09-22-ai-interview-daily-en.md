---
title: "AI Engineer Interview Daily — 2026-09-22: Deep Learning & NLP"
date: 2026-09-22
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's rotation is Deep Learning & NLP — the QKV mechanics behind self-attention, why positional encoding is necessary, subword tokenization, the fine-tuning-vs-RAG trade-off, and embeddings as semantic similarity — plus a Google agentic AI engineer interview question on how attention mechanics and context compression affect retrieval accuracy."
tldr: "Today's Deep Learning & NLP rotation covers five core concepts: how self-attention scores relevance with Query/Key/Value, why positional encoding is a necessary patch for self-attention's permutation-invariance, how subword tokenization (BPE/WordPiece) solves the out-of-vocabulary problem, how to answer the classic fine-tuning-vs-RAG follow-up, and how embeddings represent semantic similarity as vector distance. The practice question comes from a Google agentic AI engineer interview guide: explain how attention works and how context compression techniques affect retrieval accuracy — the breakdown threads attention's computational complexity together with the compression-vs-accuracy trade-off into one complete answer."
series:
  name: "AI Engineer Interview Daily"
  order: 34
---

> 🌏 [中文版](/posts/daily/2026-09-22-ai-interview-daily)

## Today's Topic

Tuesday's rotation is Deep Learning & NLP — foundational knowledge that nearly every AI Engineer role tests in the LLM era. Whether you're interviewing for a traditional ML role or an agentic AI role, interviewers expect you to explain what's happening inside a transformer, not just how to call an API. Today's practice question directly connects the attention mechanism to context compression and retrieval accuracy, which is exactly the kind of follow-up an onsite technical deep-dive uses: test the fundamentals first, then see whether you can connect them to production trade-offs.

## Core Concepts Cheat Sheet

### Self-attention scores relevance — think in intuition, not formulas

Self-attention lets every token in a sequence directly see every other token, instead of passing information step by step like an RNN. Each token's vector gets projected into three sets — Query, Key, and Value: Query represents "what am I looking for," Key represents "what can I offer," and the dot product between them gives a relevance score that's used to weight-average all the Values. Rather than reciting the matrix formulas in an interview, frame it as "every token asks every other token 'how relevant are you to me,' then blends in information proportional to that relevance" — that reads as deeper understanding than the textbook definition.

### Positional encoding patches self-attention's missing sense of order

Self-attention is permutation-invariant by design — shuffle the input sequence and the attention scores compute the same way, so the model has no idea which token came first. That's exactly why transformers need positional encoding added on top, injecting position information into the token embeddings. The original paper used fixed sine/cosine functions; newer models (like RoPE) encode relative position directly into the attention computation itself via rotation matrices. A common follow-up is "why not let the model learn position on its own" — the answer is that absolute positional encodings generalize poorly once sequence length exceeds what was seen in training, which is why long-context models favor relative position encoding.

### Subword tokenization solves the out-of-vocabulary problem

Text isn't fed to a model directly — it has to be split into tokens first. Character-level splitting makes sequences too long; word-level splitting turns any word not seen during training into an unknown token (the OOV problem). Subword tokenization (BPE, WordPiece) is the middle ground: frequent words stay whole, rare words get split into common subword pieces, keeping the vocabulary size bounded while almost never hitting a true OOV case. A common follow-up is "can a tokenizer's vocabulary trained for one language work for a different model" — the answer is technically yes but with worse efficiency, because subword splitting is optimized for the statistical properties of the training corpus it was built on.

### Fine-tuning vs. RAG — start by asking whether the knowledge changes

This is a classic interview follow-up pair. Fine-tuning bakes knowledge directly into model weights, suited to changing the model's "behavior" — tone, format, task-specific reasoning style — but knowledge updates require retraining, and it's prone to overfitting to the training distribution. RAG keeps knowledge in an external retrieval system and dynamically pulls relevant documents into context at inference time, suited to knowledge that changes frequently or needs traceable sources — but accuracy depends on retrieval quality, and it lengthens context and adds latency. The stronger answer in an interview is that the two aren't mutually exclusive — many production systems use both: fine-tuning shapes output format and reasoning habits, while RAG supplies the latest, verifiable facts.

### Embeddings compress meaning into a vector space

Embeddings turn words, sentences, or documents into a fixed-dimension vector, where semantically similar content sits close together in that vector space, usually measured with cosine similarity. This is the same core assumption running from word2vec, through BERT embeddings, to today's sentence-embedding models — and it's the shared mechanism behind RAG retrieval, recommendation systems, and semantic search. A common follow-up is "how do you choose the embedding dimension" — there's no standard answer; it's a trade-off between accuracy (higher dimensions retain more semantic detail) and storage/compute cost, and in practice you pick it using downstream task metrics rather than a rule of thumb.

## Today's Practice Question

### The Question

Explain how the attention mechanism works in a transformer architecture, and how context compression techniques affect retrieval accuracy.

**Source**: Google agentic AI engineer interview guide (via Dataford)　**Difficulty**: Advanced　**Round**: onsite technical deep-dive

### How to Break It Down

1. **Clarify first**: This question is broad — ask the interviewer whether they want the mechanics of self-attention itself, or the extension into how a RAG pipeline handles retrieval. The two depths differ significantly, so confirm scope before going deep.
2. **Build a framework**: Start with the Query/Key/Value mechanics of attention, then move up to multi-head attention, and finally connect that to "why does context compression exist in the first place."
3. **Go deep on the core**: Attention's compute cost grows quadratically with sequence length — that's the root reason context compression exists. Compressing a long context into fewer tokens (summarization, KV cache eviction, sliding window) always sacrifices some information, and that lost information is often exactly what retrieval needed, which is why retrieval accuracy drops.
4. **Close strong**: State the trade-off explicitly instead of picking a side — higher compression ratios mean faster, cheaper inference, but higher accuracy risk. In production, that sweet spot should be found with a fixed evaluation set, not tuned by feel.

### Sample Answer (What You'd Actually Say)

> **Start with how attention works**: Self-attention lets every token in a sequence directly see every other token — it uses Query, Key, and Value matrices to score how relevant each pair of tokens is to each other, then weight-averages the Values by that score. That means long-range dependencies get captured in one step, instead of being passed along token by token like an RNN. Multi-head attention runs several of these QKV projections in parallel, so different heads can specialize — one might track syntactic structure, another might track coreference.
>
> **Then connect it to context compression and retrieval**: Because attention's compute cost grows quadratically with sequence length, that's exactly why context compression exists in practice — summarizing retrieved documents before they enter the context window, or using KV cache eviction to drop tokens that rarely get attended to. The trade-off is direct: a higher compression ratio means faster, cheaper inference, but if the compression step treats critical details — numbers, names, timestamps — as low-importance tokens to discard, retrieval accuracy takes a real hit.
>
> **Close it out**: In production, I'd measure retrieval accuracy against a fixed QA benchmark across different compression ratios, and pick the sweet spot where cost and accuracy are both acceptable — not tune the compression parameters by feel.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Explained the roles of the Query/Key/Value matrices | |
| Explained the purpose of multi-head attention | |
| Mentioned that attention's quadratic compute cost is the reason compression exists | |
| Named at least one compression technique (summarization / KV cache eviction / sliding window) | |
| Mentioned evaluating compression's impact on retrieval accuracy with a fixed benchmark | |
| Bonus: mentioned the risk of positional encoding getting scrambled after compression | |

## Further Reading

- [Deep Learning Interview Questions and Answers – Top 40 for 2026](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — A complete round-up of self-attention, CNN, and RNN fundamentals, good for a quick pre-interview review.
- [Neural Network Architectures Explained – MLP, CNN, RNN, LSTM, Attention and Transformers](https://www.dataexpertise.in/neural-network-architectures-explained-mlp-cnn-rnn-lstm-transformer/?noamp=mobile) — Walks from MLPs all the way to Transformers, threading today's scattered concepts into one narrative.
- [Tokenization and Tokenizers for Machine Learning](https://arize.com/blog-course/tokenization/) — Fills in the detail on how subword tokenization connects to embeddings, extending today's tokenization section.

## References

- [Attention Is All You Need — Wikipedia](https://en.wikipedia.org/wiki/Attention_Is_All_You_Need) — Source for the "self-attention scores relevance" concept section.
- [Deep Learning Interview Questions and Answers – Top 40 for 2026](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — Source for the core concepts and practice-question breakdown.
- [Tokenization and Tokenizers for Machine Learning](https://arize.com/blog-course/tokenization/) — Source for the "subword tokenization solves OOV" concept section.
- [RAG Vs Fine-Tuning for Enhancing LLM Performance](https://www.geeksforgeeks.org/nlp/rag-vs-fine-tuning-for-enhancing-llm-performance/) — Source for the "fine-tuning vs. RAG" concept section.
- [Google Agentic AI Engineer Interview Questions & Guide 2026](https://dataford.io/interview-guides/google/agentic-ai-engineer) — Source of today's practice question.
