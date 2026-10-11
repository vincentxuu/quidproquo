---
title: "CMU 11-868 L08–L09: Choosing a Vocabulary, Emitting Tokens, and Why Speculative Decoding Is Fast"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, tokenization, speculative-decoding, llm-inference]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 7
tldr: "L08 goes from BPE to VOLT, a method co-authored by the lecturer Lei Li: vocabulary size has both a cost and a value, and VOLT finds the sweet spot by asking how much normalized entropy each added token removes, then solves it as an optimal transport problem. The second half covers LLaMA 3 growing its vocabulary from 32k to 128k and the cost of byte-level BPE splitting one Chinese character into three tokens. L09 moves from greedy decoding, sampling, and beam search to speculative decoding: a small model guesses N tokens and the big model checks them in one forward pass, because checking is cheaper than generating. It ends with EAGLE, which predicts final-layer features instead of tokens."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L08 Tokenization and Embedding and L09 Generation and Speculative Decoding: BPE, VOLT and MUV, the LLaMA 3 vocabulary and multilingual over-tokenization, Gumbel-max sampling, beam search, top-k-verified speculative decoding, EAGLE, and tree attention."
draft: false
glossary:
  - term: "VOLT"
    definition: "Vocabulary Learning via Optimal Transport (Xu et al., ACL 2021): uses the marginal utility of a vocabulary (MUV, how much normalized entropy each added token removes) to find a cost-effective vocabulary size, and solves it as an entropy-regularized optimal transport problem with the Sinkhorn algorithm."
    context: "The second part of CMU 11-868 L08; the lecturer Lei Li is a co-author."
  - term: "MUV"
    definition: "Marginal Utility of Vocabularization: when a vocabulary grows from k to k+m tokens, the negative of the drop in normalized entropy divided by m. It measures how much value each new token adds."
    context: "The metric VOLT uses to find the best vocabulary size."
  - term: "Speculative decoding"
    definition: "A small draft model generates N candidate tokens in a row, and a large target model verifies them all in one forward pass. Accepted tokens are kept; at the first rejection the target model takes over. The speedup comes from verification being cheaper than token-by-token generation."
    context: "The main topic of CMU 11-868 L09."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-tokenization-decoding)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The main sources are the [L08 Tokenization and Embedding slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-08-tokenization-594dd043d7a87d8dcc91b7e7585a0e34.pdf) (Feb 9, 45 pages), the [L09 Decoding slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-09-decoding-cac2cd9402765ff5e6c24f7baffd321c.pdf) (Feb 11, 54 pages), the readings listed in the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) ([BPE](https://aclanthology.org/P16-1162/), [SentencePiece](https://aclanthology.org/D18-2012/), [VOLT](https://aclanthology.org/2021.acl-long.571/)), and the course's [llmsys_code_examples](https://github.com/llmsystem/llmsys_code_examples) notebooks. Page numbers refer to PDF pages. All facts were checked against the official materials on 2026-09-30. Access level **A3**, but **the official syllabus lists no public recording links**; Quizzes 5.1–5.3 on the slides live on Canvas and are not visible from outside.

**Series**: previous [L06–L07: Transformers and pre-trained LLMs](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en) | next [HW3: a decoder-only Transformer in MiniTorch](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The [previous post](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms-en) covered the big block in the middle of the model. This one covers the two ends: how text is cut into tokens on the way in, and how tokens are emitted one by one on the way out.

Neither sounds like a "systems" topic, but both are about cost. Vocabulary size determines how big the embedding table and output layer are, and how many tokens the same sentence takes. The decoding strategy determines how many forward passes it takes to generate a piece of text. The second half of L09 is more direct still: speculative decoding is an inference acceleration technique.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## L08: tokenization is a trade-off

### Three granularities

L08 pages 5–11 compare three ways to split text:

| Granularity | Pros | Cons |
|---|---|---|
| Word | Easy to implement | Unseen words (the slide's example is Covid) become [UNK]; languages without spaces, such as Chinese, Japanese, Korean, and Khmer, need a separate segmenter |
| Character | Tiny vocabulary, no OOV | Longer sequences; single tokens carry no meaning |
| Subword | Moderate vocabulary, no OOV | Pieces are not necessarily meaningful |

Page 9 states the vocabulary-size dilemma plainly: a small vocabulary means fewer parameters and fewer choices at generation time, but more OOV; a large one is the reverse.

### BPE

Pages 11–14 cover Byte Pair Encoding. It started as a 1994 data-compression algorithm, and [Sennrich et al. 2016](https://aclanthology.org/P16-1162/) applied it to translation:

1. Start the vocabulary with every character (plus an end-of-word symbol)
2. Repeatedly count adjacent token pairs and merge the most frequent pair into a new token
3. Stop when the vocabulary reaches the target size

To tokenize new text, page 14 splits on whitespace and then greedily finds the longest prefix in the vocabulary. The course provides a [tokenization notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/tokenization/tokenization.ipynb) to follow along.

### VOLT: how big should the vocabulary be?

Pages 17–26 are the heaviest part of L08. The material comes from [VOLT (Xu, Zhou, Gan, Zheng, Li, ACL 2021)](https://aclanthology.org/2021.acl-long.571/), co-authored by the lecturer Lei Li.

The question (page 18): which of a 1k, 10k, or 30k vocabulary translates best? The honest approach is to fully train and test each size, which is too expensive.

VOLT works in three steps:

- **Measure value**: page 19 defines normalized entropy, the entropy of the token distribution divided by the average number of characters per token, i.e. semantic information per character. Smaller is better: less ambiguity, easier to generate
- **Measure utility**: page 20 defines MUV, how much normalized entropy drops for every m tokens added, divided by m. It answers "is one more token worth it?"
- **Solve**: pages 21–22 say the point of maximum MUV usually matches the best BLEU, with the two correlated on two-thirds of tasks; pages 23–25 replace maximizing MUV with maximizing a lower bound, which becomes an entropy-regularized optimal transport problem solved with the Sinkhorn algorithm

Page 26 adds the encoding procedure: split into characters, then keep merging adjacent tokens as long as the merged token is in the vocabulary.

### Four practical concerns

Pages 28–35 turn to LLM practice:

- **Deduplication** (page 29): LLaMA 3 deduplicates at the URL, document (minHash), and line level (64-bit SHA-1 hashes for every 30M documents), and also filters lines with repeated n-grams, "dirty word" counts, and documents whose token distribution diverges too far from the corpus
- **SentencePiece and byte-level BPE** (page 30): BBPE treats text as a sequence of Unicode bytes, so it works for every language; [SentencePiece](https://aclanthology.org/D18-2012/) works on raw sentences, replaces spaces with ▁ (U+2581), then runs BPE; WordPiece merges by conditional probability instead of frequency
- **Code and numbers** (pages 31–32): split code with regular expressions first (so `.append` becomes one token); for numbers the slides point to continuous encodings such as xVal
- **Multilingual vocabularies** (pages 33–34): LLaMA 2's 32k vocabulary grew to 128k in LLaMA 3.1, with 100k taken from OpenAI's tiktoken and 28k allocated to other languages

### Vocabulary sharing and over-tokenization

Pages 37–42 cite Yuan et al. (ACL 2024) on vocabulary sharing in LLaMA: fine-tuning LLaMA-7B's embeddings on 10k bilingual examples sorts languages into four quadrants. In the "stagnant" quadrant (Khmer, Lao, Gujarati, Telugu), neither bilingual nor multilingual performance improves, partly because of over-tokenization: byte-level BPE produces sequences longer than the number of characters. Page 41's example is the character 饕, which becomes three tokens.

This slide matters for anyone working in Chinese: more tokens for the same sentence means slower, more expensive inference and a context window that fills up faster.

L08 page 43 mentions the tokenizer-free Byte Latent Transformer, but only shows the paper title without discussion.

## L09: getting the tokens out

### Greedy, sampling, and beam search

L09 page 4 notes that exhaustively searching every sequence for the maximum probability is O(V^N), which is out of the question. That leaves three routes:

- **Greedy** (pages 5–6): pick the most likely token at each step. Since you only need the maximum, comparing logits is enough; no softmax normalization required
- **Sampling** (pages 7–10): draw from the distribution. Page 8 compares three ways to draw n samples from k categories: direct sampling O(nk), binary search O(k + n log k), and alias sampling O(k log k + n). Pages 9–10 introduce the Gumbel-max trick: adding Gumbel noise to the logits and taking the argmax is equivalent to sampling from the softmax distribution, so the softmax can be skipped. A PyTorch snippet with precomputed noise is included
- **Beam search** (pages 12–16): keep the k best partial sequences at each step. Page 14 gives pseudocode, page 15 lists three pruning rules, and page 16 suggests sampling the first few tokens and then switching to beam search for more diversity

All of these have a [decoding notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/decoding/decoding.ipynb), and the Syllabus schedules Recitation 4 on Feb 13 for decoding.

### Speculative decoding

Page 20 states the problem: autoregressive decoding produces one token at a time, and each token can take hundreds of milliseconds.

Pages 22–34 walk through the fix step by step:

1. A small **draft model** generates N candidate tokens in a row
2. The large **target model** computes its own distribution at each position; a candidate is accepted if it is in the target model's top-k predictions (pages 31–32)
3. At the first rejection, the target model takes over from the last accepted position and generates on its own (pages 33–34)

Why is it faster? Pages 35–37 explain: generating N tokens autoregressively takes N forward passes; verifying N tokens takes **one** forward pass, because causal attention lets you compute the likelihood at every position at once. Checking is cheaper than generating.

Pages 41–42 cover the tuning trade-offs:

- A larger N gives more theoretical speedup, but raises the chance of a rejection, makes each rejection more expensive, means more full-vocabulary softmaxes (a possible memory bottleneck), and causes longer stalls in real-time apps like chatbots. Common choices are N = 4 or 8
- The better the draft and target are aligned, the lower the rejection rate; every rejection eats into the speedup. A common choice is a small and a large model from the same family

The slides use top-k acceptance. The diagrams are taken from the [2024 survey by Xia et al.](https://aclanthology.org/2024.findings-acl.456/), and the quality and speed results on pages 39–40 come from the same first author's [EMNLP 2023 Findings paper](https://aclanthology.org/2023.findings-emnlp.257/). Section 6 of the survey groups verification strategies into greedy decoding, speculative sampling, and token tree verification, which is a good place to start if you want to compare acceptance rules.

### EAGLE: predict features, not tokens

Pages 44–51 introduce [EAGLE](https://arxiv.org/abs/2401.15077):

- Observation (page 44): the big model's next final-layer feature is easier to predict than its next token
- Method (pages 45–46): reuse the original model's embedding and LM head, and add a single Transformer layer as the draft model. Its input is the token embedding plus the final-layer feature; the token embedding is needed because which token got sampled strongly affects the next feature
- Implementation (page 47): flatten the candidate branches into one input with a tree-shaped attention mask, so the whole candidate tree is verified at once
- Training (pages 48–49): smooth L1 loss on the features plus cross-entropy on the token distribution
- Page 51 notes that EAGLE-2 prunes low-confidence branches and EAGLE-3 scales up the training data

The course provides a [speculative decoding notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/speculative_decoding/Speculative_decoding_demo.ipynb) and an [EAGLE demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/speculative_decoding/EAGLE).

## How this connects to the homework

The translation pipeline in [HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) asks you to implement `generate`, and the assignment page specifies argmax decoding, one example at a time, no batching. After L09 you will recognize this as the slowest and simplest version; the later [serving post](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en) deals with serving many requests at once.

## Further reading

- [CS336 Lecture 1: from bytes to a tokenizer](/posts/ai/2026-08-22-cs336-overview-tokenization-en): building a BPE tokenizer from scratch
- [CS336 Lecture 10: LLM inference](/posts/ai/2026-08-22-cs336-inference-en): speculative decoding from the memory-bandwidth angle
- [CS224N Lecture 7: pre-training, subwords, and in-context learning](/posts/ai/2026-08-22-cs224n-pretraining-en)
- [CME295 Lecture 1: from tokens to Transformers](/posts/ai/2026-09-29-cme295-transformer-en)

## How to self-study this part

1. Run the tokenization notebook and let BPE merge a few rounds by hand, then read the MUV definition in the VOLT paper
2. Open a tokenizer demo (slide 35 lists two), paste in a Chinese paragraph and an English one, and compare token counts
3. Run the decoding notebook and compare greedy and beam search outputs
4. Run the speculative decoding notebook, change N, and watch how the acceptance rate and speed move

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 11-868 LLM Systems, Spring 2026 course site](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L08 Tokenization and Embedding slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-08-tokenization-594dd043d7a87d8dcc91b7e7585a0e34.pdf)
- [L09 Decoding slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-09-decoding-cac2cd9402765ff5e6c24f7baffd321c.pdf)
- [Sennrich et al., Neural Machine Translation of Rare Words with Subword Units (ACL 2016)](https://aclanthology.org/P16-1162/)
- [Kudo & Richardson, SentencePiece (EMNLP 2018 Demo)](https://aclanthology.org/D18-2012/)
- [Xu et al., Vocabulary Learning via Optimal Transport for Neural Machine Translation (VOLT, ACL 2021)](https://aclanthology.org/2021.acl-long.571/)
- [Xia et al., Speculative Decoding: Exploiting Speculative Execution for Accelerating Seq2seq Generation (EMNLP 2023 Findings)](https://aclanthology.org/2023.findings-emnlp.257/)
- [Xia et al., Unlocking Efficiency in Large Language Model Inference: A Comprehensive Survey of Speculative Decoding (ACL 2024 Findings)](https://aclanthology.org/2024.findings-acl.456/)
- [Li et al., EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty (2024)](https://arxiv.org/abs/2401.15077)
- [llmsys_code_examples (course example code)](https://github.com/llmsystem/llmsys_code_examples)
