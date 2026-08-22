---
title: "CS124 Week 2 Words, Tokens, Edit Distance, and N-grams: Decide What the Model Sees First"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, tokenization, language-model]
lang: en
series: { name: "Stanford CS124 導讀", order: 3 }
tldr: "Week 2 builds three layers: a token vocabulary with BPE, sequence comparison with dynamic-programming edit distance, and probability approximation with n-grams; PA1 turns regex and BPE into executable work."
description: "Stanford CS124 Winter 2026 Week 2: tokenization, BPE, minimum edit distance, n-gram language models, Lab 1, and PA1."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week2-tokens-ngram)

CS124 Week 2 asks a question that precedes model choice: what does the model get to see? The official agenda moves through words and tokenization, minimum edit distance, and n-gram language modeling, then turns those ideas into a Unix text-processing lab and PA1.

**Version:** Winter 2026. **Unit:** Week 2, January 13 and 15. **Activities:** prerecorded topics, Lab 1, and a NumPy tutorial. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [token slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf), [edit-distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf), [n-gram slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf), [Lab 1](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf), and [PA1](https://github.com/cs124/pa1-regular-expressions). The assigned textbook version is SLP3 August 2025, Chapter 2 pp.1–32 and Chapter 3 pp.1–14. **Gap:** Canvas narration and Gradescope Quiz 1 are inaccessible.

## Words are design decisions

The public [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) begin with deceptively simple counting questions: Does punctuation count? Is `I'm` one orthographic word or two grammatical units? Are filled pauses words? They also show why Chinese, Japanese, and Thai defeat whitespace splitting in different ways. Tokenization is therefore a choice of computational unit, not the discovery of a single natural boundary.

The distinction between vocabulary types and running-text instances exposes another problem: larger corpora keep revealing more word types. A fixed vocabulary of whole words becomes sparse and brittle across spelling variation, new terms, and languages.

## BPE chooses a middle scale

Byte Pair Encoding begins with small units and repeatedly merges the most frequent adjacent pair. Frequent strings can become longer tokens while rare strings remain decomposable. It avoids requiring one universal theory of word boundaries or a vocabulary containing every possible word.

The tradeoff is that a token is not necessarily a linguistic word or morpheme. Leading spaces, casing, and training statistics can change segmentation. Model context length is counted in tokens, so it cannot be translated into a fixed number of human words.

[PA1](https://github.com/cs124/pa1-regular-expressions) combines BPE with regular expressions because tokenizers still need string matching and preprocessing before statistical merges. The assignment asks students to work through the mechanism rather than merely call an existing tokenizer.

## Edit distance is a shortest-path problem

The public [Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf) define minimum edit distance as the least insertion, deletion, and substitution cost needed to transform one sequence into another, and connect it to spelling correction, speech-recognition evaluation, and biological alignment.

Naively enumerating edit sequences is infeasible. The [Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf) define `D(i,j)` as the best cost between the first `i` source symbols and first `j` target symbols. Each cell compares an insertion, deletion, and substitution or match from previously solved prefixes. Dynamic programming works because many paths reach the same subproblem; only the cheapest needs to survive.

The cost function defines similarity. A substitution cost of two makes replacement equivalent to deletion plus insertion, while unit costs favor direct replacement. The algorithm minimizes the supplied values; it does not decide what an application ought to value.

## N-grams approximate an unbounded history

The public [N-gram slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf) define a language model as assigning probabilities to possible next tokens and, by the chain rule, to sequences. Conditioning on the complete history is too sparse even for enormous corpora. An n-gram model makes a Markov approximation and retains only the latest `n-1` tokens.

A bigram estimates `P(w_i | w_{i-1})`; a trigram keeps two prior tokens. Larger `n` captures more specific context but produces sparser counts. Smaller `n` has more evidence but discards longer dependencies. Unseen counts are not linguistic impossibilities, which is why smoothing must reserve probability mass for unobserved events.

## One pipeline, not three tricks

Tokenization defines the states, edit distance compares sequences, and n-grams model continuation. Lab 1 makes students manipulate the corpus with Unix tools, and PA1 delivers regex and BPE code. A concrete finish line is to compute one edit-distance table, perform three BPE merges on a tiny corpus, and construct a bigram count table by hand. If vocabulary, costs, and history length remain invisible behind library calls, the central lesson is still missing.

## The multilingual problem in the token slides

The [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) segment the Chinese string “Yao Ming reaches the finals” according to different conventions and obtain different token counts. Character segmentation, treebank annotation, and alternative word standards choose different computational units. A character vocabulary produces longer sequences with few unknown characters; longer words shorten sequences but create ambiguity and new-word problems.

The [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) also compare type growth in Shakespeare, Brown, Switchboard, COCA, and Google N-grams. Word vocabulary keeps expanding even in English through names, spelling, morphology, and coinage. Subwords address more than languages without spaces.

A reproducible BPE exercise begins with basic symbols and word boundaries, counts adjacent pairs, merges the most frequent pair, updates the corpus, and repeats. Ordered merge rules are part of the tokenizer. Ties also need deterministic resolution; otherwise two “identical” training runs can produce different encodings.

## Explaining every edit-distance cell

For `X[1..n]` and `Y[1..m]`, initialize `D(i,0)` with deletion costs and `D(0,j)` with insertion costs. Each internal cell compares deletion, insertion, and substitution or match from solved prefixes. Saving predecessors permits a backtrace alignment rather than only the final distance.

Alignment matters for speech error analysis because equal total distance can contain different substitutions, insertions, and deletions. Cost schemes must accompany reported scores. A substitution cost of two can redirect the optimum through insertion plus deletion.

The full matrix takes `O(nm)` time and space. Distance alone can retain adjacent rows, but alignment requires backpointers or another reconstruction method.

## Boundaries, unknowns, and smoothing

Sentence models need `<s>` and `</s>` so they assign probabilities to beginnings and endings. Evaluation also requires a fixed vocabulary. Low-frequency training words can be mapped to `<UNK>` so unseen test items have a learned outcome instead of a newly invented zero-count type.

Maximum-likelihood n-grams assign zero to unseen events, making any containing sentence probability zero. Add-one smoothing demonstrates redistribution but moves too much mass in large vocabularies. The Week 2 principle is bounded: zero observed count is not linguistic impossibility, so some redistribution is necessary.

Perplexity is comparable only with the same tokenizer, vocabulary, test set, and boundary conventions. Different tokenization changes the number and identity of prediction steps.

## Exercise-level evidence from Lab 1 and PA1

Public [Lab 1](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf) places Unix text manipulation before modeling and puts solutions after problems. Evidence of completion should include commands, input, output, and comparison with the solution—not merely a viewed PDF.

The [PA1 README](https://github.com/cs124/pa1-regular-expressions) names the Week 2 slides, Lab 1, and Chapter 2 sections as prerequisites. Cloning and opening `pa1.ipynb` only obtains the assignment. Preserve public-test output, final merge rules, and one failure case. Probe an unseen name, punctuated abbreviation, and unsegmented Chinese span to reveal preprocessing assumptions without claiming that the assignment solves multilingual tokenization.

## Further study

Modern LLM tokenizers are larger than the classroom examples, but the same choices affect sequence length, rare strings, and multilingual cost. Compare actual vocabularies and encodings rather than treating “subword” as one fixed algorithm.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf)
- [Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf)
- [N-gram Language Modeling slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf)
- [Lab 1: Unix Text Processing](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)
- [CS124 PA1](https://github.com/cs124/pa1-regular-expressions)
