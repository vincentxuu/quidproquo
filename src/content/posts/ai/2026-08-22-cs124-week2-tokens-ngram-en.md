---
title: "Words, Tokens, Edit Distance, and N-grams: Decide What the Model Sees First | Stanford CS124 Week 2"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, tokenization, language-model]
lang: en
series: { name: "Reading Stanford CS124", order: 3 }
tldr: "Week 2 teaches three things: cutting text into tokens with BPE, computing the edit distance between two strings with dynamic programming, and estimating the next word's probability with n-grams, evaluated by perplexity. Each can be done on paper, and this post works one example of each."
description: "A guide to Stanford CS124 Winter 2026 Week 2: words versus tokens, how BPE learns and encodes, the recurrence and alignment for minimum edit distance, bigram language models, perplexity, add-one smoothing, and what Lab 1 and PA1 ask for. Based on the public slides and the PA1 repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week2-tokens-ngram)

This is Week 2 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en), and the first week with technical content. It answers three questions:

1. When a model reads text, what is the smallest unit?
2. How do you compute how different two strings are?
3. How do you turn "does this sound like language" into a number?

**This week's material**: the [Words and Tokens slides](https://web.stanford.edu/class/cs124/lec/tokens_jan26.pdf), the [Minimum Edit Distance slides](https://web.stanford.edu/class/cs124/lec/med25.pdf), the [N-gram slides](https://web.stanford.edu/class/cs124/lec/lm_jan25.pdf), [Lab 1](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf) and [PA1](https://github.com/cs124/pa1-regular-expressions). The assigned reading is [Chapter 2](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf) and [Chapter 3](https://web.stanford.edu/~jurafsky/slp3/old_aug25/3.pdf) of the August 2025 release of the textbook. The pre-recorded videos are on Canvas and not visible outside Stanford, so this post follows the slides and the textbook.

## Why not just use words

The slides open with a question that looks easy: how many words are in this sentence?

> They picnicked by the pool, then lay back on the grass and looked at the stars.

Sixteen without punctuation, eighteen with it. Then the questions get finer. Are `They` and `they` the same word? Is `I'm` one word or two? Do `uh` and the cut-off `main-` in speech count?

Two numbers need to be kept apart here. A **type** is an entry in the vocabulary. An **instance** is one occurrence of it in running text. The sentence above has 16 instances, but `the` appears three times, so it has only 14 types.

Using words as the unit runs into three problems, and the slides give an example of each.

**Many languages have no spaces.** Chinese, Japanese and Thai do not separate words with spaces. The slides' example is 姚明进入总决赛 ("Yao Ming reaches the finals"), which can be cut into 3 words, 5 words or 7 characters. The first two come from two different annotation standards and the third simply uses characters as the unit. None of them is the single correct one.

**There are always more words.** The larger the corpus, the more unseen words:

| Corpus | Types | Instances |
|---|---|---|
| Shakespeare | 31 thousand | 884 thousand |
| Brown Corpus | 38 thousand | 1 million |
| COCA | 2 million | 440 million |
| Google N-grams | 13+ million | 1 trillion |

This relationship is called Herdan's law (or Heaps' law): vocabulary keeps growing with corpus length and never levels off. However large the vocabulary, the test data will always contain words it missed.

**Words have internal structure.** `cats` is `cat` plus the plural `-s`, and `carefully` is `care` + `-ful` + `-ly`. These smallest meaning-bearing pieces are called morphemes. Using morphemes as the unit sounds reasonable, but their boundaries are hard to define and languages differ a great deal.

So current practice uses neither words, nor characters, nor morphemes. It lets the data decide where to cut. The resulting units are called **subwords**, and the most common algorithm is BPE.

## Regular expressions

After BPE the slides have a section on regular expressions, covered first here because the preprocessing for BPE uses them. A regular expression is a way of describing what a string looks like. Nearly every text-processing job uses them, including the step that splits text into words before BPE starts merging.

In Python the call is `re.search(pattern, string)`: it scans the string and returns the first place that matches the pattern. Patterns are conventionally written as raw strings (prefixed with `r`), because regular expressions and Python both use the backslash as a special character, and without the `r` you would have to type an extra layer of backslashes.

| Pattern | What it matches |
|---|---|
| `r"Buttercup"` | `Buttercup` anywhere in a string |
| `r"[mM]ary"` | `mary` or `Mary`. Square brackets mean "any one of these characters" |
| `r"[tT]he"` | `the` or `The`, and also the `the` inside `other` |
| `r"\d+"` | One or more digits. `\d` is a digit and `+` means "one or more" |

The first half of PA1 uses these tools to pull email addresses out of web page text.

## BPE: repeatedly merge the most frequent adjacent pair

BPE (Byte Pair Encoding) has two parts. The **learner** builds a vocabulary from a training corpus. The **encoder** uses that vocabulary to cut new text.

The learner is three steps:

1. Start with a vocabulary of every character that appears.
2. Find the most frequent pair of adjacent tokens in the corpus, merge it into a new token, and add that token to the vocabulary.
3. Repeat step 2 until k merges have been made.

The slides demonstrate with a tiny corpus: `set new new renew reset renew`. Merges never cross word boundaries, and the space before each word counts as part of the word (written `␣` below). First split the corpus into characters and count:

| Count | Word (as characters) |
|---|---|
| 2 | `␣ n e w` |
| 2 | `␣ r e n e w` |
| 1 | `␣ s e t` |
| 1 | `␣ r e s e t` |

Then merge, one round at a time:

| Round | Pair merged | Occurrences | New token |
|---|---|---|---|
| 1 | `n` + `e` | 4 (twice in new, twice in renew) | `ne` |
| 2 | `ne` + `w` | 4 | `new` |
| 3 | `␣` + `r` | 3 (twice in renew, once in reset) | `␣r` |
| 4 | `␣r` + `e` | 3 | `␣re` |
| 5 | `␣` + `new` | 2 | `␣new` |
| 6 | `␣re` + `new` | 2 | `␣renew` |
| 7 | `s` + `e` | 2 | `se` |
| 8 | `se` + `t` | 2 | `set` |

Several rounds in this table are ties: in round 1, `n`+`e` and `e`+`w` both occur 4 times, and rounds 3 and 5 also have pairs with equal counts. The order above is the one the slides chose. Which pair to pick in a tie needs a fixed rule, or the same corpus can yield different vocabularies on different runs, which matters when you implement it yourself.

Round 4 is worth a pause: the algorithm has no linguistic knowledge, and it still learned the prefix `␣re`.

To process new text, the encoder splits it into characters and then applies the same merges **in the order they were learned**. `new` and `renew` are rebuilt into whole tokens. An unseen word such as `rearrange` also gets `␣re` cut from its start, with the rest broken into smaller pieces. That is why BPE has no unknown-word problem: the worst case is falling back to single characters.

Real systems differ from this small example in two ways:

- **They run on bytes, not characters.** Text is first encoded as UTF-8 bytes, BPE starts merging from the 256 possible byte values, and vocabularies usually reach 50,000 to 200,000 tokens. That makes any language and any symbol tokenizable.
- **English gets the better deal.** Training data is dominated by English, so most tokens go to English. The slides compare one recipe sentence in two languages: the English version's 14 words become 18 tokens with no word split, while the Spanish version's 16 words become 33 tokens with 6 words split. The same content costs more tokens outside English.

## Edit distance: how many steps apart are two strings

Spelling correction needs the closest correct spelling. Speech recognition needs to measure how far the output is from the reference. Both use the same tool: **minimum edit distance**, the smallest number of steps that turns one string into another. Three operations are allowed: insert a character, delete a character, substitute a character.

The slides' example turns `intention` into `execution`. One cheapest way:

```
i n t e * n t i o n
* e x e c u t i o n
d s s   i s
```

Delete `i` (d), substitute `n` with `e` (s), substitute `t` with `x` (s), insert `c` (i), substitute `n` with `u` (s). One deletion, three substitutions, one insertion.

The distance depends on what each operation costs:

- All three operations cost 1: the distance is 5.
- Substitution costs 2 (the same as a deletion plus an insertion): the distance is 1 + 3×2 + 1 = 8.

So an edit distance should always be reported with its cost scheme. Otherwise the numbers cannot be compared.

### Computing it with dynamic programming

There are far too many possible edit sequences to list, but the problem breaks into smaller ones. Let D(i, j) be the minimum distance from the first i characters of the source to the first j characters of the target. Only three paths lead into D(i, j):

- From D(i−1, j), then delete the i-th character of the source.
- From D(i, j−1), then insert the j-th character of the target.
- From D(i−1, j−1): free if the two characters match, a substitution if they do not.

Take the smallest of the three. The boundaries are D(i, 0) = i (delete everything) and D(0, j) = j (insert everything).

Here is a small example written for this post, turning `cat` into `cut` with every operation costing 1:

| | (empty) | c | u | t |
|---|---|---|---|---|
| **(empty)** | 0 | 1 | 2 | 3 |
| **c** | 1 | 0 | 1 | 2 |
| **a** | 2 | 1 | 1 | 2 |
| **t** | 3 | 2 | 2 | 1 |

The 1 in the bottom-right corner is the answer: one step, substituting `a` with `u`. Look at how the cell in row a, column u is filled: its upper-left neighbor is 0 (`c` to `c`), and `a` differs from `u`, so it is 0 + 1 = 1.

The distance alone is not enough in practice. Error analysis for speech recognition needs to know **which words were wrong and what they became**. The method is to store one more pointer in each cell, recording which of the three paths it came from. When the table is done, follow the pointers from the bottom-right back to the top-left and you have an alignment. This step is called the backtrace.

The table has n × m cells, so time and space are both O(nm).

## N-gram language models: guess the next word from the last one or two

A language model does two things that are really one: assign a probability to a whole sentence, or, given the preceding words, give a probability distribution over the next word.

The chain rule splits the probability of a sentence: P(w₁ w₂ … wₙ) is the product, step by step, of the probability of the next word given all the words before it. The trouble is that "all the words before it" has so many combinations that a corpus can never count them. An n-gram model looks only at the last few words: a bigram model at the previous one, a trigram model at the previous two. This simplification is the Markov assumption.

The probabilities are ratios of counts. The [three-sentence corpus in the course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en#an-example-the-kind-of-thing-the-course-asks-you-to-compute) works through a full calculation, so it is not repeated here. That example leaves two questions open, and the second half of this week deals with them.

### How to tell whether a language model is good: perplexity

Given held-out test text, a good model should assign it a higher probability. But probability keeps shrinking as text gets longer, so texts of different lengths cannot be compared. **Perplexity** normalizes probability by length:

PP(W) = P(w₁ w₂ … wₙ) to the power −1/n

That is the inverse of the probability of the whole text, with the n-th root taken. **Lower is better.**

The slides explain what it means with an example you can do in your head. Suppose a language has only three words, red, green and blue, and the test text is "red red red red blue":

- **Model A** gives each word probability 1/3. The whole text has probability (1/3)⁵, and the perplexity is ((1/3)⁵) to the power −1/5, which is 3.
- **Model B** gives red 0.8, green 0.1 and blue 0.1. The whole text has probability 0.8⁴ × 0.1 = 0.04096, and the perplexity is about 1.89.

Model A's 3 is exactly the number of words: at every step it guesses uniformly among three options. Model B knows red is more common, so the number of options it is really hesitating between at each step is under 2. Perplexity can be read this way: on average, how many options is the model undecided between each time it predicts a word.

The slides also give a set of real numbers. Trained on Wall Street Journal text, unigram, bigram and trigram models have perplexities of 962, 170 and 109. The more context a model sees, the better it guesses.

Comparing perplexities has one condition: **both models must use the same test data and the same tokenization.** With a different tokenization, n is different and the numbers are not comparable. The slides make the same point when discussing tokenization: with a fixed segmentation, different systems agree on how long a text is.

### What to do about unseen pairs: smoothing

In the overview example, "like" is never followed by "you" in the corpus, so P(you | like) = 0, the whole sentence goes to zero, and perplexity cannot be computed at all (it would divide by 0).

The simplest fix is **add-one smoothing**: pretend every pair was seen one more time.

P(next | previous) = (count of "previous next" + 1) ÷ (count of "previous" + V)

V is the size of the vocabulary. With the overview corpus, the vocabulary has 6 entries (I, you, like, climbing, coffee, `</s>`) and "like" appears 3 times.

| | Before | After add-one |
|---|---|---|
| P(climbing \| like) | 2/3 | (2+1)/(3+6) = 3/9 |
| P(you \| like) | 0/3 = 0 | (0+1)/(3+6) = 1/9 |

"like you" is no longer zero. The cost is just as visible: P(climbing | like) fell from 2/3 to 1/3, with half of its probability handed to pairs that were never seen. Add-one moves too much probability, and in practice it is rarely used directly on n-grams. The slides go on to gentler methods: **interpolation** mixes the trigram, bigram and unigram probabilities with weights, and **backoff** falls back to a lower-order model when the higher-order pair was never seen.

### Sampling from the model

A language model can also generate text: draw a word according to the distribution, append it, and draw the next. The slides demonstrate with Shakespeare. Unigram samples are a pile of unrelated words, bigram samples start to have locally fluent stretches, and 4-gram samples read like Shakespeare.

But that is because the 4-gram output **is, almost word for word, Shakespeare**. The corpus has only 884 thousand words. Even for bigrams, 99.96% of the possible pairs never appear, and 4-grams are sparser still: after three given words the corpus often offers only one continuation, so the model can only copy. The larger n is, the more the model remembers and the less it can generalize. The way out of this tension comes in Weeks 5 and 6: represent words as vectors, so that contexts with similar meanings share statistics.

## Lab 1 and PA1

**[Lab 1](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)** teaches text processing with UNIX commands and involves no programming. At its core is one pipeline that turns a New York Times text file into a word-frequency table:

```bash
tr -sc 'A-Za-z' '\n' < nyt_200811.txt | sort | uniq -c | sort -nr | head -n 50
```

`tr` replaces every non-letter character with a newline, leaving one word per line. `sort` puts identical words next to each other. `uniq -c` collapses adjacent duplicate lines and counts them. The second `sort -nr` orders by count, largest first. `head` keeps the first 50 lines. On the slides, the answer to each exercise is on the next slide, so try it before you advance.

**[PA1](https://github.com/cs124/pa1-regular-expressions)** has two parts. Section A uses regular expressions to extract email addresses from text. Section B starts from Unicode and UTF-8 and then has you implement BPE training, encoding and decoding yourself. The README recommends reading section 2.1 and sections 2.4.1, 2.4.2 and 2.4.5 of Chapter 2 first. The work is done in a Jupyter notebook, in the `cs124` conda environment built for PA0.

## Self-check

1. **BPE**: use the merge table above to tokenize the new word `␣rent`. Answer: start from `␣ r e n t`. Round 1 merges `n` + `e`, but here `e` comes before `n`, so it does not apply. Round 3 merges `␣` + `r`, giving `␣r e n t`. Round 4 merges `␣r` + `e`, giving `␣re n t`. No later rule applies. The result is three tokens: `␣re`, `n`, `t`.
2. **Edit distance**: with every operation costing 1, what is the distance from `ab` to `acb`? Answer: 1, inserting a `c`.
3. **Perplexity**: a model guesses uniformly among 10 words at every position. What is its perplexity? Answer: 10.
4. **Smoothing**: with the corpus above and add-one, what is P(coffee | like)? "like" appears 3 times and is followed by "coffee" once, so it is (1+1)/(3+6) = 2/9.

## How this week connects to later ones

- The tokens BPE produces are the input units of the neural language models in Weeks 6 and 7. PA6a trains its Transformer with the GPT-2 BPE vocabulary.
- Edit distance returns in Week 7: word error rate (WER) for speech recognition is computed with it, with words in place of characters.
- The objective "predict the next token given the preceding ones" carries from this week all the way to LLMs, and so does perplexity. PA6a in Week 7 has you compute it yourself.

**Series navigation**: previous, [Week 1: Introduction and Setup](/posts/ai/2026-08-22-cs124-week1-introduction-en) | next, [Week 3: Logistic Regression and Text Classification](/posts/ai/2026-08-22-cs124-week3-logistic-regression-en)

## Update Log

- 2026-10-13: Rewritten from the public slides. Added a section on regular expressions and worked examples for BPE merges, the edit-distance table, perplexity and add-one smoothing, plus a self-check; removed advice about self-study record-keeping that was unrelated to the course content.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Words and Tokens slides](https://web.stanford.edu/class/cs124/lec/tokens_jan26.pdf) — the word-count example, the corpus-size table, the BPE example corpus and the cross-language token comparison
- [Minimum Edit Distance slides](https://web.stanford.edu/class/cs124/lec/med25.pdf) — the intention/execution example and the two cost schemes
- [N-gram Language Modeling slides](https://web.stanford.edu/class/cs124/lec/lm_jan25.pdf) — the red/green/blue perplexity example, the Wall Street Journal perplexities and the Shakespeare samples
- [Lab 1: Unix Text Processing](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)
- [CS124 PA1](https://github.com/cs124/pa1-regular-expressions)
- [Speech and Language Processing, August 2025 release](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — Chapters 2 and 3
