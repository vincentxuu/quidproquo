---
title: "AI Engineer Interview Daily — 2026-10-13: Deep Learning & NLP"
date: 2026-10-13
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's rotation is Deep Learning & NLP — why self-attention uses a dot product to score similarity, what causal masks and padding masks are each actually for, how subword tokenization (BPE/WordPiece) solves out-of-vocabulary words — plus a classic architecture question: which half of the Transformer does GPT actually use, and why that's enough to generate text."
tldr: "Today's Deep Learning & NLP rotation covers four core concepts: self-attention scores relevance with a Query/Key dot product and uses it to weight the Value vectors, at the cost of quadratic compute in sequence length; causal masks and padding masks solve two unrelated problems — one controls whether a position can see the future, the other controls whether padding should be attended to at all; subword tokenization (BPE/WordPiece) solves out-of-vocabulary words by falling back to known sub-word pieces, though tokenizer fertility still varies by language; and RNNs vs. Transformers boils down to a fixed-size hidden state that has to carry information forward step by step, versus attention that can reach any position directly. The practice question is a classic architecture question: GPT only uses the Transformer's decoder, relying on causal attention for autoregressive generation — the breakdown threads 'why half the architecture is enough' through to 'how KV caching makes inference fast' into one complete reasoning chain."
series:
  name: "AI Engineer Interview Daily"
  order: 55
---

> 🌏 [中文版](/posts/daily/2026-10-13-ai-interview-daily)

## Today's Topic

Tuesday's rotation is Deep Learning & NLP, and today's four concepts circle around one thread: why the Transformer is built the way it is, not some other way. Self-attention, masking, tokenization, and RNN-vs-Transformer are terms every candidate has heard — but what interviewers are actually testing is whether you can state the specific problem each design choice solves: why a dot product, why mask out the future, why split words into pieces. Today's practice question deliberately connects an architecture choice to an inference-performance consequence.

## Core Concepts Cheat Sheet

### Self-Attention: a Query/Key dot product scores relevance, at quadratic cost in sequence length

Self-attention projects each token into three vectors: Query ("what am I looking for"), Key ("what am I"), and Value ("what I contribute if selected"). Relevance is computed as the dot product between a Query and every Key — a larger dot product means the two vectors point in a more similar direction, i.e. more "relevant" — then scaled by √d_k so the values don't blow up as dimensionality grows, passed through softmax to get a weight distribution, and finally used to compute a weighted average over all the Value vectors. This lets every token see any other position directly, instead of relaying information step by step the way an RNN does — but the cost is that computing relevance requires a full n×n matrix, so compute grows quadratically with sequence length. That's exactly why long-context work has produced sparse attention, linear attention, and similar variants.

### Causal mask vs. padding mask: "can't see the future" vs. "ignore the filler"

These two get paired in interviews, but they solve completely different problems. A causal mask (also called a look-ahead mask) is used for autoregressive generation: it forces each position's attention to only see itself and earlier positions, never the future. It works by setting the attention scores for future positions to negative infinity, so softmax drives their weight to zero — this keeps training and inference consistent, since at training time the model technically has access to the full sequence but has to behave as if it doesn't, or it would learn to "cheat." A padding mask solves a different problem: sentences in a batch have different lengths, and padding them to a common length is what makes batched computation possible, but those padding positions aren't real content and shouldn't be allowed to participate in attention — so their scores also get set to negative infinity to exclude them. Both can be applied to the same model at once: one controls the time direction, the other controls which positions count as valid content.

### Subword tokenization: BPE/WordPiece solve out-of-vocabulary words, but token counts still vary by language

Early NLP used word-level tokenization, where any word outside the vocabulary (an out-of-vocabulary, or OOV, word) was simply replaced with a single `<UNK>` token — discarding information outright. Subword tokenization methods like BPE and WordPiece instead count the most frequent character combinations in the training corpus and repeatedly merge them into larger sub-word units, ending up with a fixed-size vocabulary that still covers common roots and affixes. An unseen word just gets broken into known sub-word pieces and stitched back together, so in theory a truly unknown token never has to appear again. The side effect is "tokenizer fertility": the same sentence can split into fewer tokens in one language and far more sub-word pieces in another with different morphology — which directly affects how much of the context window gets used and how API costs scale. This detail is often what separates a good answer when multilingual scenarios come up.

### RNN vs. Transformer: a fixed-size hidden state vs. direct access to any position

An RNN processes a sequence by maintaining a fixed-size hidden state, updating it at every time step as new input arrives — so however many time steps information needs to travel across, it has to get "squeezed" through that same fixed-size vector that many times. This is exactly why RNNs struggle with long-range dependencies: gradients tend to vanish or explode exponentially with distance during backpropagation (LSTM/GRU gating mechanisms mitigate this but don't solve it at the root). The Transformer replaces this recurrent structure with self-attention: information between any two positions is transferred in one step — a direct dot product — instead of being relayed one step at a time, so the difficulty of learning a long-range dependency doesn't grow with distance. The trade-off is the O(n²) compute mentioned above, plus the need for a KV cache during autoregressive inference — storing the Key/Value vectors already computed so that generating each new token doesn't require recomputing attention over the entire sequence from scratch.

## Today's Practice Question

### The Question

GPT models only use the decoder half of the Transformer architecture. Why is half the architecture enough to generate text, and how does that differ from an encoder-decoder architecture like a translation model?

**Source**: Compiled from Cloud Soft Solutions' "Deep Learning Interview Questions and Answers 2026" and DataExpertise's "Deep Learning Interview Questions and Answers – Top 40 for 2026," flagged as a high-frequency architecture-understanding question for LLM-related roles　**Difficulty**: Intermediate　**Round**: Technical screen / onsite system design

### How to Break It Down

1. **Clarify first**: Is the interviewer asking purely about the architectural difference (decoder-only vs. encoder-decoder), or do they want to extend into inference performance (KV cache, latency)? This question usually invites both, so starting with architecture and extending into performance works well.
2. **Build a framework**: Explain the division of labor in the original Transformer first — the encoder encodes the input sequence into a bidirectional-context representation (every token can see the whole sentence, before and after), while the decoder generates output autoregressively, using causal attention so each step only sees what's already been generated, and cross-attention to read the encoder's output.
3. **Go deep on the core**: The key trade-off is that GPT's training objective — predict the next token given everything before it — already lines up exactly with what a decoder's causal attention does, so there's no need for a separate encoder to produce bidirectional context. Translation, by contrast, needs bidirectional understanding of the input and a separate output sequence, which is why it needs an encoder to fully read the input first and a decoder with cross-attention to generate the output.
4. **Close strong**: Extend into inference performance — a decoder-only architecture can use a KV cache during autoregressive generation, storing the Key/Value vectors computed at each step so that generating the next token only requires attending over the new token against everything already cached, instead of recomputing attention over the whole sequence. That's the engineering detail that makes interactive, low-latency generation with GPT-style models feasible.

### Sample Answer (What You'd Actually Say)

> GPT only uses the decoder, not because the encoder doesn't matter, but because its training objective and the decoder's mechanism are literally the same thing. **Start with the architecture split**: the original Transformer's encoder produces a bidirectional-context representation of the input — every position can see the whole sentence — while the decoder generates autoregressively, using causal masking so each step only sees what's already been generated, and cross-attention to read the encoder's output, which is what makes translation-style tasks with two distinct sequences work. GPT's training objective — predict the next token given everything before it — is itself a statement that each position should only see what came before, which lines up exactly with the decoder's causal attention. There's no need for a separate encoder to produce bidirectional context.
>
> **Then, how this differs from an encoder-decoder architecture**: translation needs to fully understand the input language first — bidirectionally — and then generate a separate output language step by step. Input and output are genuinely two different sequences, so you need the encoder/decoder split with cross-attention connecting them. GPT's input and output are really the same sequence continuing, with no structural need to "fully read one part before generating another," so decoder-only plus causal attention is sufficient.
>
> **Finally, how this choice affects inference performance**: a decoder-only architecture pairs naturally with a KV cache — storing the Key and Value vectors computed at each step, so the next token only needs one attention pass against what's already cached, instead of recomputing attention over the entire sentence. That's the engineering detail that makes GPT-style models usable for interactive conversation at acceptable latency, and it's the part that's easiest to miss but most practically important when an interviewer asks why this architectural choice matters.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Explained the encoder's bidirectional context vs. the decoder's causal attention | |
| Connected GPT's training objective (predict the next token) to why it naturally fits the decoder | |
| Mentioned what cross-attention does in an encoder-decoder architecture | |
| Extended into how a KV cache affects inference latency | |
| Gave an example of a scenario that genuinely needs encoder-decoder (e.g. translation) | |
| Bonus: framed it as an engineering performance consideration, not just a theoretical architecture choice | |

## Further Reading

- [Deep Learning Interview Questions and Answers 2026 (65 Qs) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/deep-learning-interview-questions) — Compares attention's compute cost against an RNN's fixed state, explaining clearly why long-sequence scenarios push toward alternative architectures.
- [NLP Interview Questions and Answers 2026 (60 Questions) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/nlp-interview-questions) — 60 questions spanning tokenization, embeddings, and multilingual NLP scenarios — good for drilling today's "tokenizer fertility" explanation.
- [Deep Learning Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — Has additional diagrams explaining GPT's decoder-only architecture and causal attention mechanism.

## References

- [Deep Learning Interview Questions and Answers 2026 (65 Qs) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/deep-learning-interview-questions) — Supporting source for the "Self-Attention" and "RNN vs. Transformer" concept sections, including the comparison of attention's compute cost against an RNN's fixed state.
- [Deep Learning Interview Questions and Answers – Top 40 for 2026 — DataExpertise](https://www.dataexpertise.in/deep-learning-interview-questions-answers-2026/) — Primary source for today's practice question ("why GPT only uses the decoder"), including the explanation of causal attention and autoregressive generation.
- [NLP Interview Questions and Answers 2026 (60 Questions) — Cloud Soft Solutions](https://cloudsoftsol.com/blog/nlp-interview-questions) — Source for the "Subword Tokenization" concept section, including the BPE/WordPiece mechanism and the effect of tokenizer fertility in multilingual scenarios.
- [NLP Interview Questions (Beginner to Advanced) — DataCamp](https://www.datacamp.com/blog/nlp-interview-questions) — Supporting source for the "Causal Mask vs. Padding Mask" concept section, confirming the convention of pairing these two mask types in interviews.
