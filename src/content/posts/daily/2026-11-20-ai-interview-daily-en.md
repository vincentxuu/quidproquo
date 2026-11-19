---
title: "AI Engineer Interview Drill — 2026-11-20: Coding"
date: 2026-11-20
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's topic is Coding: hand-rolling a Byte-Pair Encoding tokenizer's train, encode, and decode, and practicing how to talk through the vocab-size-versus-sequence-length trade-off and why a production tokenizer's version has to match training exactly."
tldr: "BPE comes down to one idea: repeatedly merge the most frequent adjacent pair in the corpus into a new symbol, which finds a data-driven balance point between vocabulary size and sequence length. The point interviewers catch most people missing is that encoding has to replay the exact merge order learned during training — any mismatch in order or version means a production model reads the wrong tokens."
series:
  name: "AI Engineer 面試日練"
  order: 93
---

> 🌏 [中文版](/posts/daily/2026-11-20-ai-interview-daily)

## Today's Focus

Friday is the fixed slot for Coding, and today it's narrowed to the ML-flavored implementation problems that show up most: batch inference, tokenizers, data processing, numpy vectorization. These rounds show up in live coding interviews for LLM and NLP-adjacent roles, and what the interviewer is actually checking isn't whether you can call the `tokenizers` library — it's whether you know what that library is doing underneath, and can write the core loop cleanly without a high-level API to lean on.

Today's pick is hand-rolling a Byte-Pair Encoding (BPE) tokenizer. It touches both "algorithm implementation" and "ML system design" at once: getting the loop to run is the baseline. Being able to explain the vocab-size-versus-sequence-length trade-off, and why encoding can't re-count frequencies on the fly, is what actually separates candidates on this question.

## Core Concepts, Fast

### The BPE training loop: use pair frequency as the signal, merge greedily

BPE training is two steps repeated until a vocab-size target or a merge-count limit is hit: count the frequency of every adjacent symbol pair across the corpus, then merge the single most frequent pair into a new symbol and record that merge rule in the order it was discovered. The algorithm has zero knowledge of linguistics — `er` ends up merged into one token purely because it showed up often enough in the corpus, not because it's an English suffix.

### Training and encoding are two separate phases, and the order has to match

Training depends on frequency statistics across the whole corpus, but encoding a new input string doesn't recount anything — it starts from the base symbols and applies the merge rules in the exact priority order (the merge rank) recorded during training, stopping once no rule applies. This split is the easiest place to get caught out in an interview: if encoding applies rules in a different order than training recorded, the same sentence produces a different token sequence, and a production model drifts out of sync with the fine-tuning data it was trained against.

### A byte-level starting alphabet solves out-of-vocabulary input, not luck

A character-level tokenizer can still choke on a Unicode character it has never seen, but byte-level BPE always starts from the 256 possible UTF-8 byte values, so any input that can be represented as UTF-8 has a guaranteed fallback to its individual bytes — no `[UNK]` token silently discarding the original spelling. This is the shared design behind every mainstream tokenizer since GPT-2.

### Vocabulary size is a real engineering trade-off, not "bigger is better"

A larger vocabulary means fewer tokens per piece of text — shorter sequences, less attention compute — but every extra token adds a row to both the input embedding matrix and the output head. GPT-2 small's embedding matrix alone accounts for 31% of its 124-million-parameter total. The curve also flattens in practice: one measurement trained BPE on 83,159 real words and found that going from 5,000 to 10,000 merges saved exactly zero tokens on unseen text, because the extra merges were just memorizing quirks of the training corpus instead of learning anything that generalizes.

### In the room: nail correctness first, then talk performance

A naive implementation rescans the entire corpus and recounts pair frequencies after every single merge. That's fine for a toy corpus, but interviewers will almost always ask about the time complexity of that step and how you'd optimize it at scale — maintaining a pair-frequency heap and only incrementally updating the pairs affected by the latest merge, instead of recomputing from scratch. Getting `train`/`encode`/`decode` correct and passing edge-case tests first, then volunteering the optimization direction, lands better than jumping straight to the advanced version.

```flow-diagram
{
  "title": "The BPE training loop: count, merge, repeat",
  "lang": "en",
  "width": 900,
  "height": 460,
  "nodes": [
    {"id": "init", "label": "Initialize\nSplit each word into base symbols\n(byte-level: 0-255)", "x": 320, "y": 50, "w": 420, "h": 70},
    {"id": "count", "label": "Count adjacent pair frequencies\n(weighted by word frequency)", "x": 320, "y": 160, "w": 420, "h": 70},
    {"id": "merge", "label": "Merge the most frequent pair\nRecord this merge rule", "x": 320, "y": 270, "w": 420, "h": 70, "tone": "accent"},
    {"id": "stop", "label": "Stop condition: vocab-size target\nor merge-count limit reached?", "x": 320, "y": 380, "w": 420, "h": 60}
  ],
  "edges": [
    {"from": "init", "to": "count", "step": 1},
    {"from": "count", "to": "merge", "step": 2},
    {"from": "merge", "to": "stop", "step": 3},
    {"from": "stop", "to": "count", "step": 4, "label": "Not reached yet,\nback to counting", "via": [[560, 380], [560, 160]], "labelAt": [560, 320], "tone": "warn"}
  ],
  "steps": [
    "First split each word in the corpus into base symbols. Byte-level BPE always starts from the 256 UTF-8 byte values, guaranteeing a starting symbol for any input.",
    "Count the frequency of every adjacent symbol pair across the whole corpus. This is a global, word-frequency-weighted count, not a per-word one.",
    "Merge the single most frequent pair into a new symbol, and record this merge rule in discovery order — this order has to be replayed exactly during encoding later.",
    "Check whether the vocab-size target or merge-count limit has been reached. If not, loop back to counting frequencies and run another merge round until the stop condition holds."
  ],
  "caption": "Simplified for clarity: tie-breaking rules and normalization details are omitted. The point that matters is keeping \"training counts globally and records in order\" separate from \"encoding applies a fixed order and never recounts.\""
}
```

## Today's Practice Question

### The Question

Hand-roll a Byte-Pair Encoding tokenizer: given a small corpus (a list of strings) and a merge-count limit `num_merges`, write `train()` to learn the merge rules and vocabulary, and write `encode()` / `decode()` so any input string can be correctly turned into a token-ID sequence and recovered exactly. No calling `tokenizers`, `tiktoken`, or any other existing library.

**Source**: A common live-coding question for ML/NLP engineer interviews — for example, Apple's NLP Engineer loop includes a "Machine Learning Coding" round that asks candidates to implement model components or algorithms live, rather than calling a high-level library API, and BPE is one of the representative questions in that style; the open-source `ML-Interview-Prep` question bank also lists BPE as a core MLE coding problem. **Difficulty**: Intermediate **Round**: Live coding phone screen or onsite ML coding round

### How to Break It Down

1. **Clarify the problem first**: Is the base symbol unit a byte or a character — this decides whether arbitrary Unicode input is handled without erroring. Is `num_merges` a fixed hyperparameter, or does training run until vocab size hits some target? Is the input corpus raw strings or already whitespace-tokenized words? Does `encode` need to handle a batch of strings at once?
2. **Build a framework**: Split the problem into three functions. `train()` runs the loop of "count pair frequencies → merge the highest-frequency pair → record the merge rule." `encode()` starts from base symbols and applies the merge rules learned by `train()` in their recorded priority order. `decode()` looks up each token ID and concatenates the symbols back together. Pin down the input/output signature of each function before writing the loop bodies.
3. **Go deep on the core**: The two points that get the most follow-up questions — first, `encode` must never recount frequencies; it has to apply the rules in exactly the order `train` recorded, or the same sentence will encode differently at different points in time. Second, the vocab-size-versus-sequence-length trade-off: a bigger vocabulary means shorter sequences but more embedding parameters, and that compression payoff curve flattens as merge count grows — it's not a straight line that keeps paying off forever.
4. **Close strong**: Collapse it into one line — "BPE uses word-pair frequency as a signal and greedily merges adjacent pairs, which finds a data-driven balance point between vocabulary size and sequence length." Then add a production note: the tokenizer's version (its merge-rule table) has to stay exactly in sync with whatever version is used for inference and fine-tuning — if the versions drift, the model reads the wrong embedding row for the token IDs it gets.

### A Sample Answer (how you'd actually say this in an interview)

> **First I'd pin down the interface and edge cases.** I'd ask whether the base symbol unit should be bytes or characters — for multilingual input, byte-level is the safer choice, because any UTF-8 string has a guaranteed fallback to individual bytes and won't break just because it hits a character it's never seen. I'd also ask how `num_merges` is decided, and whether `encode` needs to handle edge cases like an empty string or a completely new character.
>
> **For the core algorithm, here's how I'd write it.** In `train()`, I'd keep a dict mapping each word to its symbol sequence. Each round, I'd scan all sequences to count weighted adjacent-pair frequencies, pick the highest-frequency pair, merge it, and append that rule to a merge list in discovery order — repeating until `num_merges` is hit. `encode()` doesn't recount anything; it starts from base symbols and checks the merge list in that recorded order, applying each rule until none apply anymore. `decode()` is just looking up token IDs back to symbols and concatenating them. I'd specifically write a round-trip test that `encode` followed by `decode` always recovers the original string exactly.
>
> **To close, I'd talk performance and correctness.** This version of `train` rescans the whole corpus and recounts frequencies after every merge, which is fine at small scale. At larger scale, I'd maintain a pair-frequency heap and only incrementally update the pairs affected by the latest merge, instead of recomputing everything. One production gotcha I'd flag: the merge-rule table has to be version-controlled as part of the model. If the tokenizer used for inference or fine-tuning drifts from the version it was trained with, the same sentence encodes into different tokens, and the model is effectively reading the wrong embedding row.

### Self-Check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---|---|
| Asked up front whether the base unit is bytes or characters, and whether arbitrary Unicode must be handled | |
| Explained the roles of `train`/`encode`/`decode` clearly, stressing that `encode` never recounts frequencies | |
| Explained that `encode` must replay the exact merge order recorded during training | |
| Covered the vocab-size vs. sequence-length / embedding-parameter trade-off, including that the payoff curve flattens | |
| Mentioned that the tokenizer version must be version-controlled together with the model / fine-tuning data | |
| Bonus: discussed naive full recount vs. an incremental heap-based update of pair frequencies | |

## Further Reading

- [How does tokenization work, and why do LLMs usually rely on subword tokenizers such as BPE? — Sebastian Raschka](https://sebastianraschka.com/faq/docs/tokenization-bpe.html) — the clearest explainer of the training/encoding split and how byte-level avoids out-of-vocabulary input
- [Tokenization: BPE from Scratch, Vocab Size, and What Tokenizers Hide](https://dev.to/ali_82f3409ed625e8ba8515b/tokenization-bpe-from-scratch-vocab-size-and-what-tokenizers-hide-23mn) — measures the vocab-size payoff curve on 83,159 real words, with minimal readable BPE training code
- [GitHub: jyotipmahes/ML-Interview-Prep](https://github.com/jyotipmahes/ML-Interview-Prep) — an open-source question bank with several hand-rolled MLE coding problems, including BPE, linear regression, and a 2-layer MLP, useful for checking your own implementation against

## References

- [How does tokenization work, and why do LLMs usually rely on subword tokenizers such as BPE? — Sebastian Raschka](https://sebastianraschka.com/faq/docs/tokenization-bpe.html) — source for "training and encoding are two separate phases" and "a byte-level starting alphabet solves out-of-vocabulary input"
- [Tokenization: BPE from Scratch, Vocab Size, and What Tokenizers Hide](https://dev.to/ali_82f3409ed625e8ba8515b/tokenization-bpe-from-scratch-vocab-size-and-what-tokenizers-hide-23mn) — source for the measured numbers in "vocabulary size is a real engineering trade-off" (GPT-2 embedding share, payoff flattening after 5,000 merges)
- [GitHub: jyotipmahes/ML-Interview-Prep](https://github.com/jyotipmahes/ML-Interview-Prep) — source for today's practice question; the repo describes itself as Machine Learning Engineer (MLE) interview prep material, and its `MLE_Coding_Interview_Guide.ipynb` lists BPE as a core hand-rolled problem
