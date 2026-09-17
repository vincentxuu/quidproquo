---
title: "AI Engineer Interview Daily — 2026-09-18: Coding"
date: 2026-09-18
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Today's drill is the longest-match tokenizer implementation question Anthropic asks in its technical screen — greedy matching over a vocabulary, unknown-run handling, and why a growing vocabulary forces you off linear scans and onto a trie."
tldr: "Today's Coding rotation is a real question from Anthropic's Technical Screen — implement a case-sensitive longest-match tokenizer: greedily match the longest possible vocabulary entry at each position, emit the exact token id and the consumed original text, and support two modes for characters that don't match anything — emit one unknown token per character, or coalesce a whole unmatched run into a single unknown span. Core concepts covered: the greedy longest-match-first strategy behind subword tokenizers like WordPiece, why a growing vocabulary forces you from a linear scan onto a trie (paired with Aho-Corasick-style failure links, the same idea behind Google's LinMaxMatch, to get from O(n²) down to linear), how the unknown-run merge choice actually affects downstream training, and the classic off-by-one traps in Python string slicing."
series:
  name: "AI Engineer Interview Daily"
  order: 30
---

> 🌏 [中文版](/posts/daily/2026-09-18-ai-interview-daily)

## Today's Topic

Friday's rotation is Coding. Today's question isn't an abstract algorithm puzzle — it's the foundation of NLP infra. A tokenizer is the first step of nearly every LLM pipeline, and interviewers love pulling questions from it because it tests string algorithms (greedy matching, tries), edge-case handling (what happens on unknown characters), and engineering judgment (when does the vocabulary size force you to switch data structures) all at once. This question comes from Anthropic's Technical Screen for a Software Engineer role, but the content is exactly the kind of ML infra problem an AI Engineer interview loop would ask — a solid match for coding-round practice.

## Core Concepts Cheat Sheet

### Greedy longest-match-first: the default strategy for tokenizers

WordPiece, the subword tokenization algorithm behind the BERT family, runs on a simple idea at inference time: greedy longest match. Starting from the current position, find the longest prefix that matches an entry in the vocabulary, treat it as one token, consume that span, and repeat from the next position. The appeal is that it's straightforward to implement and deterministic — the same input always produces the same split. The downside is that it's locally optimal, not globally minimal in token count, and "would a different split produce fewer tokens" is a common follow-up.

### A growing vocabulary forces you onto a trie, or you degrade to O(n²)

For a small vocabulary, checking candidate substrings one by one at each starting position (longest candidate first) is perfectly fine. But once the vocabulary reaches tens of thousands of entries, the classic MaxMatch approach — two pointers, one marking the start and one shrinking the end while scanning — has overall complexity that's quadratic in the length of the input. Google's Fast WordPiece Tokenization System paper proposes LinMaxMatch: build the vocabulary into a trie (prefix tree), then borrow the Aho-Corasick idea of jumping to a failure link instead of restarting the whole scan when a match fails, bringing the complexity down to linear. Saying "linear scan is fine for a small vocabulary, but a large one needs a trie" in an interview is the one line that shows you understand the performance trade-off instead of having memorized an algorithm by rote.

### Two ways to handle unknown runs, and they change what downstream training sees

When the tokenizer hits characters that don't match anything in the vocabulary, it has two common options: emit one unknown token per character, or coalesce a whole contiguous run of unmatched characters into a single unknown span. The first preserves information about exactly how many unknown characters there were, but eats into the sequence length and dilutes the meaningful tokens. The second saves tokens, but the downstream model loses the length information for that unknown stretch. There's no universally correct answer here — it's a design choice, and interviewers usually want to hear "it depends on how this text is actually used downstream," not a fixed rule.

### Case-sensitive matching, and the requirement that output can losslessly reconstruct the input

This question specifically calls for case-sensitive matching (uppercase and lowercase are distinct characters) and requires that "the output token must exactly correspond to the text it consumed." That means your return value can't just be token ids — it has to carry the exact original substring each token consumed, along with its starting position in the source text. This looks like a minor detail, but it's actually testing whether you'll notice an easy-to-miss correctness requirement — that the output must be able to reconstruct the input without loss — which is a hidden trap in a lot of string-processing problems.

### The classic off-by-one trap in Python string slicing

This kind of problem is an easy place to trip up on "where does the candidate substring end" in Python — `text[i:i+length]` and `text[i:j]` (where `j` is an exclusive upper bound) are easy to conflate, especially when you're juggling both "how far have I scanned" and "how long is this candidate" at once. In an interview, it helps to name a variable explicitly as an exclusive upper bound (e.g. `end_exclusive`), and to manually trace through a simple example after writing the code (an empty-string candidate, a single-character candidate) — that's an effective way to catch this, the most common source of bugs in this style of problem.

## Today's Practice Question

### The Question

You're given a vocabulary `vocab: dict[str, int]` (keys are known token strings, values are their token ids) and an input string `text: str`. Implement a case-sensitive longest-match tokenizer: starting from the beginning of the text, at each position greedily match the longest string in the vocabulary that matches there, consume it as one token, and continue from the next position. If no vocabulary entry matches at the current position — not even a single character — that position needs to be handled as an unknown token. The function must accept a `coalesce_unknown: bool` parameter that decides whether unmatched characters are each emitted as their own unknown token, or whether a contiguous run of unmatched characters is merged into a single unknown token. The return value must be a list where each element carries: the token id (`None` for unknown), the exact original substring the token consumed, and its starting offset in the source text — so that the return value alone is enough to losslessly reconstruct the original input. Follow-up discussion: if the vocabulary grows from a few hundred entries to tens of thousands, what performance problem does your implementation run into, and how would you fix it?

**Source**: PracHub Knowledge Hub (Anthropic Interview Question, Technical Screen round)   **Difficulty**: Medium   **Round**: Technical screen

### How to Break It Down

1. **Clarify the problem first**: Ask whether the vocabulary can contain an empty string or duplicate keys (usually not, but asking shows you care about edge cases), whether there's a tie-break rule when multiple candidates share the same longest length, and whether the input can contain non-ASCII characters (if so, confirm whether length is measured in code points or bytes, so you don't slice in the middle of a UTF-8 character).
2. **Build the framework**: Use a cursor `pos` that walks from `0` to `len(text)`. At each `pos`, compute an upper bound on the longest possible candidate length (bounded by both the longest key in the vocabulary and `len(text) - pos`), then try substrings from that upper bound down to length 1 — the first hit is the longest match at this position. If nothing hits, fall into the unknown branch; depending on `coalesce_unknown`, either consume one character or keep advancing until you reach a position where a match resumes.
3. **Go deep on the core**: The easiest correctness trap here is, in coalesce mode, precisely finding the next position where matching resumes — you can't naively re-scan the entire vocabulary from scratch at every step of the merge; you need to keep trying to match from the current position while extending the unknown span, and stop the moment a match succeeds. The core performance discussion is the small-vs-large vocabulary trade-off: for a small vocabulary, scanning every candidate length linearly at each `pos` is fine, but once the vocabulary is large, you should build it into a trie first, so matching at each `pos` degrades to "walk down the trie until you can't, then stop" — bringing overall complexity from roughly O(n × maxlen × vocab lookup) down to close to O(n).
4. **Close it out**: Explain why the return structure needs to carry both the consumed substring and the starting offset — it's so the caller can losslessly verify `''.join(consumed_texts) == text`, which is a common hidden acceptance criterion in this style of tokenizer question. Finish by proactively bringing up Google's LinMaxMatch (the Fast WordPiece Tokenization System) as "how I'd optimize this to production grade" — it signals that you know what the industry-standard solution actually looks like.

### Sample Answer (something you could actually say in an interview)

> **Framing the problem**: Before I write any code, I want to confirm a few assumptions — the vocabulary has no empty strings or duplicate keys, if there's a tie on longest-match length I'll use a well-defined rule like "whichever appears first in the vocabulary" rather than leaving it undefined, and I'll assume ASCII input for now — if we need Unicode support later, I'd switch slicing to operate on code points instead of bytes. Within that scope, I'll walk a cursor from the start to the end of the text, and at each position compute the longest possible candidate length before trying substrings from that length down.
>
> **Core logic**: At each `pos`, the main loop first takes `min(length of the longest vocabulary key, len(text) - pos)` as the upper bound on candidate length, then tries `text[pos:pos+length]` against `vocab` from that length downward — the first hit is the longest match at this position, so I append `(token_id, consumed_text, pos)` to the result and advance `pos` by the consumed length. If nothing hits, it depends on `coalesce_unknown`: if `False`, I consume exactly one character as unknown and do `pos += 1`; if `True`, I keep advancing `pos`, retrying a match at each new position, and the moment a match succeeds I close out the whole accumulated span — from where the unknown run started to now — as a single unknown token, then resume the normal flow.
>
> **Correctness and follow-up**: I'd manually verify with a simple example — vocabulary `{"ab": 1, "a": 2}`, input `"abc"` should produce `[(1, "ab", 0), (None, "c", 2)]` in per-character mode — to confirm `''.join(...)` reconstructs the original input. To close, I'd point out that once the vocabulary grows from a few hundred entries to tens of thousands, this linear-scan-of-candidate-lengths approach does O(maxlen) dictionary lookups at every position, so it's roughly O(n × maxlen) overall. The production fix is to build the vocabulary into a trie with Aho-Corasick-style failure links — the same approach as Google's LinMaxMatch paper — to get matching down to true linear time. That's the next optimization I'd make if this needed to run at production scale.

### Self-Check List

Use this table to check whether your answer missed a key point:

| Check item | Covered? |
|---|---|
| Defined a clear tie-break rule for "longest match," left no undefined behavior | |
| Explained how both unknown-run modes (per-character / coalesced) are implemented | |
| Return structure carries the consumed original substring and offset, so input can be losslessly reconstructed | |
| Manually traced through a concrete example to verify correctness | |
| Discussed the performance problem as the vocabulary grows, and the trie-based fix | |
| Bonus: mentioned the Unicode / code point vs. byte edge case | |

## Further Reading

- [A Fast WordPiece Tokenization System — Google Research](https://research.google/blog/a-fast-wordpiece-tokenization-system/) — The LinMaxMatch paper referenced in today's performance discussion, explaining exactly how trie + Aho-Corasick failure links bring greedy longest-match matching down from O(n²) to linear — the standard answer for taking this question to production grade.
- [WordPiece: BERT's Subword Tokenization Algorithm Explained — Michael Brenndoerfer](https://mbrenndoerfer.com/writing/wordpiece-tokenization-bert-subword-algorithm) — An illustrated walkthrough of greedy longest match, good for building intuition if subword tokenization is still unfamiliar.
- [Anthropic Coding & Algorithms Questions — PracHub](https://prachub.com/companies/anthropic/categories/coding-and-algorithms) — An overview of Anthropic's coding-round question style, showing that this systems-minded, production-adjacent flavor of question is the norm rather than the exception.

## References

- [Implement a longest-match tokenizer — PracHub (Anthropic Interview Question)](https://prachub.com/interview-questions/implement-a-longest-match-tokenizer) — Source of today's practice question, including the case-sensitive and unknown-run handling requirements.
- [Anthropic Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/anthropic) — Overview of the Anthropic question bank this question belongs to, including difficulty and round distribution.
- [A Fast WordPiece Tokenization System — Google Research](https://research.google/blog/a-fast-wordpiece-tokenization-system/) — Source for the trie construction, Aho-Corasick failure links, and LinMaxMatch complexity analysis.
- [GEICO AI Engineer Interview Questions & Guide 2026 — Dataford](https://dataford.io/interview-guides/geico/ai-engineer) — Corroborates the trend that AI Engineer coding rounds increasingly ask for hand-rolled string or matrix logic without NumPy or a framework.
