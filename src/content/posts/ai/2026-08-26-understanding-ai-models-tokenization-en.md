---
title: "Tokenization: The BPE Algorithm, and Why Chinese Costs More Than English"
date: 2026-08-26
category: ai
type: deep-dive
tags: [tokenization, bpe, llm, token, nlp, chinese-nlp, api-pricing]
lang: en
series:
  name: "認識 AI 模型"
  order: 2
tldr: "Models charge by tokens, not characters. The BPE algorithm starts from individual bytes and repeatedly merges the most frequent adjacent pair to build a vocabulary. English 'understanding' might be 1-2 tokens, but Chinese '理解' could take 2-3 — same meaning, higher cost."
description: "An introduction to tokenization and BPE: why models split text into subwords, how BPE builds a vocabulary, the real-world impact of Chinese vs. English token count differences, and the differences between tiktoken and SentencePiece."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-tokenization)

The previous post covered tokens as the basic units models use to process text. But how does a model decide which characters form a token? That process is called tokenization, and it directly affects how much you pay to use an API.

## Models Don't See Words — They See Tokens

Humans read in words and sentences. Language models don't. A model sees a sequence of numbers, each corresponding to an entry in a vocabulary table. Tokenization is the process of splitting raw text into these entries.

The key question: how do you decide what goes in the vocabulary?

The simplest approach is character-level splitting: every letter or Chinese character becomes a token. But this makes the vocabulary tiny and sequences extremely long — the model needs many steps to grasp the meaning of a single word. The other extreme is whole-word splitting, but English alone has hundreds of thousands of word forms, and any new or misspelled word becomes unrepresentable.

Modern language models use a compromise: **subword tokenization**. Common words stay as single tokens (like `the`, `is`), while rare words get split into smaller pieces (`tokenization` → `token` + `ization`). This keeps the vocabulary at a manageable size (typically 32,000 to 200,000 tokens) while being able to represent virtually any text.

## BPE: Merging From Characters Up

Byte Pair Encoding (BPE) is the dominant subword tokenization algorithm today. The GPT family, Claude, and LLaMA all use it — or a variant — to build their vocabularies.

Here's how BPE works:

1. **Start**: Split all text in the training data into individual bytes or characters. This is the initial vocabulary.
2. **Count frequencies**: Tally how often each adjacent token pair appears.
3. **Merge the most frequent pair**: Combine the most common pair into a new token and add it to the vocabulary.
4. **Repeat**: Go back to step 2 and keep merging until the vocabulary reaches a target size.

A simplified example. Suppose the training data frequently contains `low`, `lower`, `lowest`:

- Initial tokens: `l`, `o`, `w`, `e`, `r`, `s`, `t`
- Most frequent pair: `l` + `o` → merge into `lo`
- Next round: `lo` + `w` → merge into `low`
- Next round: `e` + `r` → merge into `er`
- Next round: `e` + `s` → merge into `es`

After several rounds, `low` becomes a full token, `lower` gets split into `low` + `er`, and `lowest` into `low` + `es` + `t`. Frequent fragments naturally merge into larger tokens; rare combinations stay as smaller pieces.

The elegance of BPE is that it's entirely **data-driven** — no linguistic rules required, just frequency counts.

## Why Chinese Costs More

This is a practical issue anyone using LLM APIs will encounter: the same meaning expressed in Chinese consumes significantly more tokens than English.

Testing with OpenAI's `cl100k_base` tokenizer (used by GPT-4):

| Sentence | Token count |
|----------|-------------|
| "Machine learning is a subset of artificial intelligence." | 8 |
| "機器學習是人工智慧的子集。" (same meaning in Chinese) | 14 |

Same meaning, nearly double the tokens for Chinese.

The reason lies in BPE's training data. These models are trained on predominantly English corpora. Common English words get heavily compressed during the merge process. `machine`, `learning`, `artificial`, `intelligence` — each is a single token.

Chinese appears far less frequently in the training data. During BPE merging, Chinese character pairs don't rank high enough in frequency to get merged. The result: a single Chinese character is often split into 2-3 byte-level tokens. The character "機" takes 3 bytes in UTF-8; if those 3 bytes were never merged during BPE training, that one character occupies 2-3 tokens.

Claude's tokenizer handles this somewhat better — Anthropic included more multilingual data during training, so common Chinese characters are typically encoded as single tokens. But even then, Chinese token efficiency remains lower than English, because each Chinese character carries high semantic density (one character is one morpheme), and the finite vocabulary can't allocate dedicated tokens for every character combination.

## Practical Impact

The token count gap has two direct consequences:

**Cost differences**: APIs charge per token. If the rate is $3 per million input tokens, processing the same content in Chinese costs roughly 1.5 to 2 times more than English.

**Context window compression**: A model's context window is measured in tokens. A 128K-token window holds roughly 96,000 English words (about 300 pages), but only about 40,000-50,000 Chinese characters (about 120-150 pages). This gap becomes very noticeable when doing long-document analysis or RAG.

## Different Models, Different Tokenizers

Each model family has its own tokenizer and vocabulary:

- **tiktoken** (OpenAI): Used by GPT-3.5/4/4o. The `cl100k_base` vocabulary has 100,256 tokens; `o200k_base` has 200,000. Byte-level BPE.
- **SentencePiece** (Google / Meta): Used by Gemini and LLaMA. Supports both BPE and Unigram algorithms. Operates directly on Unicode text without converting to bytes first.
- **Claude's tokenizer**: Anthropic hasn't published detailed tokenizer specifications, but observed behavior suggests a BPE-like method with a larger vocabulary and better multilingual support than early GPT models.

The important takeaway: **different tokenizers produce different token counts for the same text**. When estimating costs or context usage, always use the corresponding model's tokenizer — don't apply OpenAI's counts to Claude.

OpenAI provides an online [Tokenizer](https://platform.openai.com/tokenizer) tool where you can see exactly how text gets split. For programmatic counting, Python's `tiktoken` package works well.

## Wrapping Up

Tokenization is the first step in how a model understands text. BPE uses pure frequency statistics to split text into appropriately-sized subword units. Because training data is linguistically imbalanced, Chinese consumes more tokens than English in most models, which directly translates to higher API costs and reduced context capacity.

The next post goes inside the model — once these tokens enter, how do they get transformed into embedding vectors?

## References

- Sennrich, R., Haddow, B., & Birch, A. (2016). [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/). *Proceedings of the 54th ACL*.
- [OpenAI Tokenizer tool](https://platform.openai.com/tokenizer)
- Kudo, T., & Richardson, J. (2018). [SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing](https://aclanthology.org/D18-2012/). *EMNLP 2018*.
- [OpenAI tiktoken source](https://github.com/openai/tiktoken)
