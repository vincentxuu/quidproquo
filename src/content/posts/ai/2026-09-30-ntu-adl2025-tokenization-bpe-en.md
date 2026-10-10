---
title: "NTU ADL Lecture 5: Tokenization and BPE, or Where the Vocabulary Comes From"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, tokenization, bpe]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 5
tldr: "With whole words as units, any unseen word becomes UNK. With single characters, meaning is hard to reassemble. This 22-page ADL deck explains the mainstream compromise, subwords, and the most common way to build them, BPE. The core is a tiny corpus of 4 words and 16 occurrences: start from characters, merge the most frequent adjacent pair each round, and after 9 merges you have units like newest</w> and low</w>, which then segment the unseen words lowest and powest. It ends with a GPT-3 tokenizer screenshot where the Chinese version of a sentence takes more than twice as many tokens as the English."
description: "A guide to the Tokenization lecture of NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025: the out-of-vocabulary (UNK) problem, rich morphology in Swahili verbs, character versus subword tokens, the three steps of BPE with a merge-by-merge demonstration, how merge rules handle unseen words, BPE units and morphemes, and the token cost multilingual BPE imposes on Chinese."
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte-Pair Encoding"]
    definition: "A way to define a subword vocabulary. Start with a vocabulary of characters plus an end-of-word symbol, repeatedly find the most frequent adjacent pair of units in the corpus, merge it into a new unit, and add it to the vocabulary until the vocabulary reaches the target size. The recorded merge order becomes the rule set for segmenting new text."
    context: "Slides 5–19 of the ADL Tokenization deck demonstrate it step by step on a tiny corpus of low, lower, newest, and widest."
  - term: "subword"
    definition: "A unit between a whole word and a single character. Common words stay whole, rare words break into a few more common pieces, so the vocabulary stays manageable and fully unseen input is rare."
    context: "Slide 4 of the ADL Tokenization deck calls it the dominant modern paradigm, a balance between words and characters."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This guide is based on the [Tokenization slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf) (22 pages) from the 9/08 week of NTU Yun-Nung Chen's *Applied Deep Learning* (ADL), **Fall 2025 (semester 114-1, 2025/09/01–12/15)**. The video linked on that row of the course page is [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://youtu.be/NrT5kmnTFCk) (33:37, in Mandarin). It was uploaded on 2023-10-12, so it is a reused recording from an earlier year, not a 2025 re-record, and it may not match the 2025 slides exactly. It has no captions, so this post relies on the slides alone. All facts were checked against the official materials on 2026-09-30. The course is rated **A2**, with the gaps on the homework side; see the [series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en).

**Series**: Previous: [Attention and the Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) | Next: [BERT and the BERT Family](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

Going back to "how do we split text" right after the Transformer looks like a step backward. But this is exactly the order of the 9/08 row on the [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/): Attention → Transformer → Tokenization → BERT. There are two reasons. The first item in the Transformer training tips from the [previous post](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) is BPE. And BERT, in the [next post](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), takes subwords as input.

The deck is only 22 pages, and 14 of them walk through a single example. Work that example yourself and you have read the lecture.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=NrT5kmnTFCk
title: ADL 5.1: BPE (Byte-Pair Encoding) Tokenization
```

Original videos: [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://www.youtube.com/watch?v=NrT5kmnTFCk)、[Byte Pair Encoding Tokenization](https://www.youtube.com/watch?v=HEikzVL-lZU) (a Hugging Face demo video linked from the slides; not an ADL lecture recording, so it is not embedded)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Transcript attempt (2026-10-10): the embedded ADL 5.1 (33:38) has no obtainable YouTube transcript, so its spoken content was not checked; the article's own version note already says this video has no captions and that the content follows the slides only. Metadata confirmed: uploaded 2023-10-12 with a description dated 2023/10/12, so it is a recording reused from an earlier term, which matches the article.

## The problem: out-of-vocabulary words

The table on slide 2 makes the problem concrete. The vocabulary comes from training data. Common words like hat and learn get their own vectors. The next three kinds of word all become UNK and share one uninformative vector:

- variations: taaaaasty
- misspellings: laern
- novel items: Transformerify

The headline is the point: models handle these words badly, but humans don't. You can guess what Transformerify means because you break it into parts.

Slide 3 adds the linguistic angle: many languages have complex morphology. The slide's example is Swahili, where verbs can have hundreds of conjugations, each encoding tense, mood, definiteness, negation, information about the object, and more. With whole words as units, the vocabulary for such languages becomes impractical.

## How fine should a token be?

Slide 4 compares two units:

| Unit | Pros | Cons |
|---|---|---|
| Character | Nothing is ever unseen; tiny vocabulary | Meaning is spread across many characters and hard for the model to reassemble |
| Subword (parts of words) | A balance between words and characters | — |

The slide calls subwords the dominant modern paradigm. The next question is how to choose the pieces.

## BPE in three steps

Slide 5 first gives the original definition of BPE: replace the most common pair of consecutive bytes in the data with a byte that does not occur in the data. For NLP it becomes three steps:

1. Start with a vocabulary of characters plus an end-of-word symbol `</w>`.
2. Find the most frequent pair of adjacent units "a, b" in the corpus and add "ab" to the vocabulary.
3. Replace every instance of that pair in the corpus with the new unit, and go back to step 2 until the vocabulary reaches the desired size.

The slides don't cite a paper; the work that brought BPE to neural machine translation is [Sennrich et al. 2016](https://arxiv.org/abs/1508.07909). The slides also link a Hugging Face demo video, "[Byte Pair Encoding Tokenization](https://youtu.be/HEikzVL-lZU)."

## Step by step: low, lower, newest, widest

Slides 6–16 run the algorithm on a tiny corpus of four words and their counts:

```
l o w </w>        : 5
l o w e r </w>    : 2
n e w e s t </w>  : 6
w i d e s t </w>  : 3
```

The starting vocabulary is every character in the corpus plus `</w>`: `</w> d e i l n o r s t w`.

**First merge.** Count every adjacent pair. `e s` appears in newest (6 times) and widest (3 times), 9 in total. `s t` is also 9. `l o` is 7. The slide marks the two tied pairs at 9, says "Choose One," and picks `es`. The corpus becomes `n e w es t </w>` and `w i d es t </w>`.

**Every later round is the same**: count, merge the top pair, rewrite the corpus. Slide 17 lists all nine merges in order:

```
1. e + s        → es
2. es + t       → est
3. est + </w>   → est</w>
4. l + o        → lo
5. lo + w       → low
6. n + e        → ne
7. ne + w       → new
8. new + est</w> → newest</w>
9. low + </w>   → low</w>
```

The final corpus is `low</w>`, `low e r </w>`, `newest</w>`, `w i d est</w>`, and the vocabulary has gained `es est est</w> lo low ne new newest</w> low</w>`.

Look at merge 3: `est` joins `</w>`, which means the model has learned that est often ends a word. The same letters in the middle of a word and at the end become different units. That is what `</w>` is for.

### Segmenting unseen words

Once the merge rules are recorded, segmenting a new word means applying them in order. Slides 18–19 try two words that are not in the corpus:

- **lowest** → `low est</w>`. Applying the rules in order builds `est</w>` first, then `low`. The low in lowest is not followed by `</w>`, so rule 9 doesn't fire. Both pieces are in the vocabulary.
- **powest** → `<unk> o w est</w>`. `p` is not in the starting vocabulary, so it becomes `<unk>`, and without an `l` in front, `o w` can't become `low`.

The second example shows BPE's limit: a character missing from the starting vocabulary still becomes an unknown symbol.

## What BPE units look like

Slide 20: a BPE vocabulary usually contains both frequent whole words and frequent subwords, and those subwords are often morphemes, such as -est or -er. The slide defines a morpheme as the smallest meaning-bearing unit of a language, with unlikeliest splitting into three: un-, likely, -est.

This closes the loop on the opening problem. You understand Transformerify because you recognize Transformer and -ify. BPE gives a model a chance to do something similar.

## Multilingual BPE: Chinese costs more

Slide 21 is a screenshot of the [OpenAI tokenizer](https://platform.openai.com/tokenizer). A multilingual model tokenizes every language with one unified BPE, and the same sentence in two languages comes out very differently:

| Sentence | Tokens | Characters |
|---|---|---|
| Working on NLP is fun, but tokenization is not fun. | 14 | 51 |
| 做NLP工作很有趣，但tokenization不有趣。 | 29 | 27 |

These are GPT-3 tokenizer counts. The Chinese version has fewer characters but more than twice the tokens, and the tool warns that some unicode characters map to multiple tokens. The slide's conclusion: tokenizing Mandarin through Unicode encoding is inefficient and costs more.

The closing slide (22) sums up the lecture in three points. Subwords address unseen words. BPE is a common subword method whose vocabulary holds both frequent words and the smallest meaning-bearing units. And different languages may need their own tokenization for better efficiency and lower cost.

## How to self-study it

1. Don't just read slides 6–17. Count along on paper. Decide the next merge yourself before turning the page.
2. On slide 7, `es` and `st` tie at 9, and the slide picks `es`. Try picking `st` instead and see whether the final vocabulary changes.
3. If you want the lecture audio, the [5.1 video](https://youtu.be/NrT5kmnTFCk) is the 2023 recording (in Mandarin). Match it to the slide numbers before watching.

One thing to try tonight: open the [OpenAI tokenizer](https://platform.openai.com/tokenizer), paste a message you wrote recently in any non-English language you use along with its English translation, and write down both token counts. You now have your own version of slide 21, measured with a current tokenizer.

## Further reading

- Building a BPE tokenizer from scratch: [CS336 Lecture 1: From Bytes to a Tokenizer](/posts/ai/2026-08-22-cs336-overview-tokenization-en)
- A fuller treatment of multilingual token costs: [CS224N Lecture 14: How Tokenization Creates Multilingual Cost Gaps](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality-en)
- How another course connects tokenization to the Transformer: [CME295 Lecture 1](/posts/ai/2026-09-29-cme295-transformer-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Kept the ADL 5.1 lecture embed; removed the embed of the Hugging Face demo video, which is not a course recording (text link kept).
- 2026-10-10: Tried to check ADL 5.1 against a transcript, but none is available, so the content was not checked; confirmed it is an older recording dated 2023-10-12, matching the article.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/08 row
- [Tokenization slides (2025/09/08)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf) — all slide numbers and examples in this post come from this deck
- [ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://youtu.be/NrT5kmnTFCk) (33:37, uploaded 2023-10-12, in Mandarin)
- [ADL 2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Sennrich, Haddow & Birch, Neural Machine Translation of Rare Words with Subword Units (ACL 2016)](https://arxiv.org/abs/1508.07909) — the original paper applying BPE to NMT (not cited in the slides)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — source of the slide 21 screenshot
