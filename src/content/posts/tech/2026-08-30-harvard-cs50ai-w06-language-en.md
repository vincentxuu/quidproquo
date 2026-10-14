---
title: "Language — N-grams, Parser, Attention & the Transformer | Harvard CS50 AI Week 6"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, nlp, n-gram, parser, attention, transformer, bert, language-model, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 7
tldr: "Week 6 is about getting computers to handle natural language: parse sentences with hand-written context-free grammar rules, then switch to statistics, from n-grams and Markov-chain text generation to a Naive Bayes classifier for review sentiment; turn words into vectors with word2vec, process whole sequences with an RNN encoder–decoder, and finish with attention and the Transformer. Includes section-by-section time links, plus an approach, common mistakes and ways to check your work for the Parser and Attention projects."
description: "A guide to Harvard CS50 AI Week 6 Language, written section by section from the captions of the lecture recording titled 2023: syntax and semantics, context-free grammars and NLTK parsing, n-grams and Markov chains, bag-of-words and Naive Bayes sentiment analysis, one-hot and word2vec word vectors, the RNN encoder–decoder, attention and the Transformer. Each section has a clickable time link and a self-check, followed by the task, an approach, pseudocode, common mistakes and ways to check your work for the Parser and Attention (BERT) projects, with the full reference implementations folded at the end of each. Project specs follow the 2026 course site."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)

**Video status: Videos included.** The lecture runs 1:05:21. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture does not cover this week's projects; those sections follow the course website. [Jump to the player](#lecture-video--timestamps) | [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture recording is titled **2023** (the recordings for Weeks 0 to 5 in this series are titled 2020); the official notes state that the new version of Lecture 6 was released on 14 August 2023, and it already covers attention and the Transformer. Project specs, distribution code, and check50 slugs follow the 2026 course site (i.e., `ai50/projects/2024/x/...`), where the Week 6 projects are Parser and Attention. The 2020 edition's Questions project (TF-IDF question answering) is no longer listed on the current site, this recording does not teach TF-IDF, and this article does not cover it.

## TL;DR

Week 6 is the last week of the course, and its subject is getting computers to work with human language. The lecture follows one line: first try to write syntax down as rules (a context-free grammar), find that the rules never end, switch to statistics over large amounts of text (n-grams, Markov chains, Naive Bayes), then replace words with vectors that carry meaning (word2vec) and hand whole sequences to a neural network (an RNN encoder–decoder). It closes with attention and the Transformer: the first frees the decoder from relying on a single hidden state, the second removes the RNN's requirement to compute word by word in order.

The article has two halves. The first, "Lecture walkthrough", follows the recording; the second covers the task, approach and checks for the two projects, with the full reference implementations folded at the end of each; the lecture does not mention the projects. The Parser project uses the context-free grammar from the second section of the lecture, and the Attention project turns the attention of the last three sections into diagrams you can look at.

## Lecture Video & Timestamps

The recording runs 1 hour 5 minutes, and the nine sections of "Lecture walkthrough" below cover all of it in order. Every time link, at the top of a section or inside the text, moves the player on this page to that point, so when a section does not make sense you can go straight back and listen.

```youtube
url: https://www.youtube.com/watch?v=QAZc9xsQNjQ
title: Language - Lecture 6 - CS50's Introduction to Artificial Intelligence with Python 2023
```

YouTube: [Week 6 Language (2023 version)](https://www.youtube.com/watch?v=QAZc9xsQNjQ)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13) and mark where the lecturer starts each topic; they are not official chapters. This table describes only this recording, titled 2023, and the video itself does not introduce this week's projects.

| Time (click to play from there) | Content |
|---|---|
| [0:00–5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=0s) | Natural language processing tasks, syntax and semantics |
| [5:13–13:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s) | Formal grammars and context-free grammars, parsing sentences with NLTK |
| [13:19–19:09](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=799s) | n-grams, tokenization and Markov-chain text generation |
| [19:09–30:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1149s) | Text classification: bag-of-words, Naive Bayes and Laplace smoothing |
| [30:57–40:33](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1857s) | Word representations: one-hot, distributed representations and word2vec |
| [40:33–46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2433s) | Sequence to sequence: an RNN encoder–decoder |
| [46:35–52:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s) | Attention: attention scores and the weighted average |
| [52:57–1:00:10](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3177s) | The Transformer encoder: positional encoding, self-attention, multi-headed attention |
| [1:00:10–1:05:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3610s) | The Transformer decoder, variants and the wrap-up of the whole course |

> Official notes: [Lecture 6 Notes](https://cs50.harvard.edu/ai/notes/6/) (current edition, with the same sections as this recording); the slides and the lecture source code `src6.zip` are on the [Week 6 lecture page](https://cs50.harvard.edu/ai/weeks/6/).

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Captions alone do not show the slides, so this article does not reconstruct the syntax trees, the neural network block diagrams or the attention heat map; it reports only what the lecturer says aloud, and the figures are in the [official notes](https://cs50.harvard.edu/ai/notes/6/). For the programs the lecturer runs in the terminal I compared against the official lecture source code `src6.zip`; the grammars and code excerpts shown here come from that source, two further details come from the official slides, and each place says so. The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well.

### What natural language processing is for: syntax and semantics

[Recording 0:00–5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=0s)

The lecturer, Brian Yu, starts by looking back over the course: the earlier weeks all rewrote problems into a form a computer understands, such as search problems, constraint satisfaction problems and optimization problems. This week goes the other way and asks the computer to understand the language people normally use. He groups this work under natural language processing and lists five tasks:

- Automatic summarization: given a long text, produce a shorter version.
- Information extraction: pull relevant facts or details out of a text.
- Machine translation: turn text in one language into another.
- Question answering: ask a phone or a chatbot a question, and the computer understands the text and generates a reply.
- Text classification: assign a label to a piece of text, such as positive or negative, inbox or spam.

Before any method, he describes two difficulties of language itself.

The first is **syntax**, the structure of language ([2:18](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=138s)). "Just before nine o'clock Sherlock Holmes stepped briskly into the room." is a well-structured sentence. Rearrange some of the same words into "Just before Sherlock Holmes nine o'clock stepped briskly the room" and every word is still valid English, but together they do not form a sentence.

Syntax has a further complication ([3:12](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=192s)): one sentence can have more than one valid structure. "I saw the man on the mountain with a telescope." can mean that I used a telescope to see the man, or that the man on the mountain has the telescope. In the lecturer's words, natural language is ambiguous, and the same sentence can be interpreted in several ways.

The second is **semantics**, the meaning of language ([3:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=226s)). Knowing that a sentence is well-structured is not enough; the computer also needs to know what it says. "A few minutes before nine, Sherlock Holmes walked quickly into the room." does not use quite the same words as the earlier sentence, yet it means almost the same thing, and an ideal model should see that. In the other direction, a well-structured sentence can mean nothing. He quotes the linguist Noam Chomsky's famous "Colorless green ideas sleep furiously.": adjectives modify the noun ideas, the verb and the adverb are in the right places, and the whole says nothing.

This section has no algorithm. It separates the two things the rest of the lecture deals with: structure (syntax) and meaning (semantics). The next two sections work on structure, and meaning comes in with the word vectors of the fifth section; that mapping is my own summary.

**Check yourself. Write your answer down before opening the fold.** Both sentences below are lecture examples. Is the problem in each one syntax or semantics? (a) Just before Sherlock Holmes nine o'clock stepped briskly the room. (b) Colorless green ideas sleep furiously.

<details>
<summary>Answer</summary>

(a) is a syntax problem: every word is valid English, but the order does not form a sentence. (b) is a semantics problem: adjectives plus noun, verb plus adverb, the structure is entirely correct, and the whole still means nothing. Together they show that these are two separate levels, and passing one does not mean passing the other.

</details>

### Writing syntax as rules: context-free grammar

[Recording 5:13–13:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s)

The first idea for teaching a computer sentence structure is to hand it the rules directly. In English nouns tend to come before verbs, and nouns can be modified by adjectives; if those rules could be formalized, the computer could apply them. The lecturer calls this a **formal grammar**: a system of rules for generating sentences in a language. There are several kinds of formal grammar, and this week covers only the **context-free grammar** (CFG from here on).

He uses "she saw the city" to introduce the three parts of a CFG ([6:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=373s)):

- **Terminal symbol**: a word that actually appears in the sentence, such as she, saw, the, city. It is terminal because once the word has been generated there is nothing left to generate.
- **Nonterminal symbol**: a symbol that generates other symbols. `N` is a noun, `V` is a verb, and `D` is a determiner (words like the, a, an).
- **Rewriting rule**: a nonterminal symbol on the left of an arrow, and on the right what it can be replaced with, with alternatives separated by vertical bars ([7:07](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=427s)).

In the rules below, the `N` and `D` rows and the last three rules are read out by the lecturer; for `V` he only says "and so forth", so that row comes from the official slides. On the slides the first three rows each end with an ellipsis, meaning the lists are not complete.

```text
N  → she | city | car | Harry
D  → the | a | an
V  → saw | ate | walked
NP → N | D N
VP → V | V NP
S  → NP VP
```

The last three rules have other nonterminal symbols on the right. `NP` is a noun phrase: it can be just a noun (she) or a determiner followed by a noun (the city). `VP` is a verb phrase: just a verb (walked), or a verb followed by a noun phrase (saw the city). `S` is a sentence, a noun phrase followed by a verb phrase.

Walk "she saw the city" through these rules: `S` becomes `NP VP`; the first `NP` becomes `N`, then she; `VP` becomes `V NP`, and `V` becomes saw; the second `NP` becomes `D N`, which is the city. Each step uses one rule, and the result is the structure of the sentence: she is a noun phrase, saw the city is a verb phrase, and inside it the city is a noun phrase of its own.

Then the code ([9:41](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=581s)). The lecturer uses the Python library NLTK (Natural Language Toolkit). `cfg0.py` gives NLTK the grammar as a string, asks the user for a sentence, splits it into words, then parses it and prints the syntax tree. This is `cfg0.py` from the official lecture source code:

```python
import nltk

grammar = nltk.CFG.fromstring("""
    S -> NP VP

    NP -> D N | N
    VP -> V | V NP

    D -> "the" | "a"
    N -> "she" | "city" | "car"
    V -> "saw" | "walked"
""")

parser = nltk.ChartParser(grammar)

sentence = input("Sentence: ").split()
try:
    for tree in parser.parse(sentence):
        tree.pretty_print()
except ValueError:
    print("No parse tree possible.")
```

Typing she walked gives she as the noun phrase and walked as the verb phrase. Typing she saw the city gives she as the noun phrase and the whole of saw the city as the verb phrase. The Parser project's `parser.py` makes the same two calls (`nltk.CFG.fromstring` and `nltk.ChartParser`).

The grammar in `cfg1.py` is larger ([11:08](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=668s)). A sentence is still a noun phrase followed by a verb phrase, with an adjective phrase `AP` and a prepositional phrase `PP` added: an adjective phrase can come before a noun phrase, and a prepositional phrase can follow a noun. The rules in the source file are:

```text
S  -> NP VP
AP -> A | A AP
NP -> N | D NP | AP NP | N PP
PP -> P NP
VP -> V | V NP | V NP PP
```

For she saw the wide street, NLTK finds one tree: the noun phrase inside the verb phrase contains an adjective. For she saw the dog with the binoculars ([12:07](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=727s)), NLTK returns two trees, one for each reading of the sentence:

- the dog with the binoculars is one noun phrase, so the dog has the binoculars.
- the dog is the noun phrase, and with the binoculars is a prepositional phrase modifying saw, so she used the binoculars to see the dog.

The ambiguity from the previous section shows up here as "one sentence with two valid syntax trees". I ran both grammars myself and got what the lecturer describes: one tree each for the first three sentences, two for the last.

The lecturer closes with the limit of this approach ([13:05](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=785s)): everything depends on a person writing the rules. Writing rules for every English sentence someone might write or say would take a great deal of effort, and the rules would be very complex.

**Check yourself. Write your answer down before opening the fold.** Using only the grammar in `cfg0.py`, which of these three sentences can be parsed? (a) the city saw she (b) she saw the the city (c) saw the city (My own question.)

<details>
<summary>Answer</summary>

(a) Yes. the city is `D N`, which fits `NP`; saw she is `V NP`, which fits `VP`; together they are `NP VP`. The English is wrong (the object should be her), but in this grammar she is just an `N`, and the rules do not separate subjects from objects, so it is accepted.

(b) No. `NP` can only be `N` or `D N`, and no rule allows two `D` symbols in a row.

(c) No. `S` has the single rule `NP VP`, so a sentence must start with a noun phrase, and saw can only be a `V`.

I ran all three against the `cfg0.py` grammar. (a) shows that loose rules accept sentences they should not. As a side note, `cfg1.py` has `NP -> D NP` and therefore accepts (b) with its two consecutive determiners, which is exactly what the Parser project's spec asks you to avoid. This paragraph about (a) and `cfg1.py` is my own addition.

</details>

### Switching to statistics: n-grams, tokenization and Markov chains

[Recording 13:19–19:09](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=799s)

Since the rules never end, the lecturer changes the angle: give the computer a lot of existing English sentences and see what it can learn from the data. Making sense of a long text all at once is hard, so the first step is to break it into small pieces.

An **n-gram** is a contiguous sequence of n items from a sample of text, where the items can be characters or words. With n equal to 3 it is a trigram, with n equal to 2 a bigram. The lecturer takes a passage from Sherlock Holmes and looks for trigrams; the first few are how often have, often have I, have I said, I said to, said to you, to you that. Shifting one word to the right gives the next one. If the computer pulls every trigram out of a large corpus, it learns which sequences of three words tend to appear together, and with that some sense of the structure of the language.

`ngrams.py` does exactly this ([14:54](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=894s)): it loads a folder of text files into memory, uses NLTK's `ngrams` function to extract all the n-grams, and uses Python's `Counter` to find the most common ones. The data is a set of Sherlock Holmes stories.

| n | Most common n-grams (in the order the lecturer reads them) |
|---|---|
| 2 | of the, in the, it was |
| 3 | it was a, one of the, I think that |

Getting this far requires splitting the text first, a step called **tokenization** ([16:31](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=991s)): splitting a sequence of characters into pieces. Here the pieces are individual words, and the program then looks at sequences of those words.

What can be done with n-grams? The lecturer goes back to the **Markov chain** from the Week 2 lecture on probability ([16:58](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1018s)): a sequence of values in which each value can be predicted from the values before it. Knowing which words tend to follow which, we can predict the next word, and so build a Markov chain for language that generates text with the same statistical patterns as the input data.

The input for the demo is `shakespeare.txt`, a collection of Shakespeare's works. `generator.py` uses a third-party library (`markovify` in the source code) to read the text, train a Markov model and ask it for five sentences. The sentences do not necessarily appear in the original; they are predicted word by word from the same statistical patterns.

The lecturer adds the limit immediately ([18:52](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1132s)): so far nothing guarantees that the generated sentences mean anything or make sense. They only follow the statistical patterns the computer has seen. He says he will come back later to how text can be generated in a more meaningful way.

**Check yourself. Write your answer down before opening the fold.** The lecture's passage opens with "how often have I said to you that", 8 words, from which the lecturer lists 6 trigrams. How many bigrams do the same 8 words contain, and what are the first three? Also, what does a sentence generated by a Markov chain guarantee, and what does it not?

<details>
<summary>Answer</summary>

7 bigrams. Among n words there are n − k + 1 runs of k consecutive words: for trigrams 8 − 3 + 1 = 6, which matches the number the lecturer lists, and for bigrams 8 − 2 + 1 = 7. The first three are how often, often have, have I. The formula is my own addition; the lecturer only lists examples.

A Markov chain guarantees the statistical pattern: each word chosen is one that often follows the preceding words in the training data. It does not guarantee that the sentence means anything or holds together as a whole, because each step looks at only a few preceding words.

</details>

### Text classification: bag-of-words and Naive Bayes

[Recording 19:09–30:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1149s)

The next problem is **text classification**: putting a piece of text into a category. An inbox has to decide whether an email belongs in the inbox or in spam; **sentiment analysis** has to decide whether a text is positive or negative. The lecturer uses four product reviews:

1. My grandson loved it! So much fun.
2. Product broke after a few days.
3. One of the best games I've played in a long time.
4. Kind of cheap and flimsy, not worth it.

A person sees at once that reviews 1 and 3 are positive and reviews 2 and 4 negative. How? Mostly by noticing a few key words: loved, fun and best tend to appear in positive reviews, and broke, cheap and flimsy in negative ones. If a computer could learn which words go with which kind of review, it could make the same call.

**Bag-of-words** ([21:01](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1261s)) treats text as an unordered collection of words. Which word came first or second does not matter. The lecturer admits this throws information away, since word order is important, and says he will return to it; for now the simplification helps.

On top of this model he builds a **Naive Bayes** classifier ([21:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1297s)), using Bayes' rule from Week 2:

```text
P(b | a) = P(a | b) × P(b) ÷ P(a)
```

What we want is "the probability that the review is positive, given that the review is my grandson loved it". In the bag-of-words view, the review is simply the four words my, grandson, loved and it all being present, in no particular order. Putting that into Bayes' rule:

```text
P(positive | my, grandson, loved, it)
  = P(my, grandson, loved, it | positive) × P(positive) ÷ P(my, grandson, loved, it)
```

The lecturer simplifies it in two steps.

First, the denominator does not depend on whether we are looking at the positive or the negative case; it is the same either way. So it can be dropped, leaving a probability that is **proportional to** the numerator, and at the end the positive and negative values are normalized so that they sum to 1. By the definition of joint probability, the numerator is the joint probability that the review is positive and all four words are in it.

The second step is where the "naive" in the name comes from ([24:28](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1468s)): assume the words are independent of each other and depend only on whether the review is positive or negative. In other words, grandson being in the review does not change the probability that loved is in it. The lecturer says plainly that this assumption is probably not true in practice, but it simplifies the analysis and still gives reasonably good results. With it:

```text
P(positive | my, grandson, loved, it)
  ∝ P(positive) × P(my | positive) × P(grandson | positive) × P(loved | positive) × P(it | positive)
```

Every term on the right can be counted from training data that is already labeled positive or negative:

- `P(positive)`: the number of positive reviews divided by the total number of reviews.
- `P(loved | positive)`: the number of positive reviews containing loved, divided by the number of positive reviews.

The lecturer gives a set of data ([26:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1579s)): 49% of the reviews are positive and 51% negative; 30% of positive reviews contain my, against 20% of negative ones; 1% of positive reviews contain grandson, against 2% of negative ones. He does not read out the numbers for loved and it, so those two rows below come from the figure in the official notes.

| | Positive | Negative |
|---|---|---|
| Share of reviews in this class | 0.49 | 0.51 |
| Contains my | 0.30 | 0.20 |
| Contains grandson | 0.01 | 0.02 |
| Contains loved | 0.32 | 0.08 |
| Contains it | 0.30 | 0.40 |

Multiply each column from top to bottom. The lecturer only says "we get some value"; I computed the two products below from the table, and they match the numbers on the figure in the official notes:

```text
Positive: 0.49 × 0.30 × 0.01 × 0.32 × 0.30 = 0.00014112
Negative: 0.51 × 0.20 × 0.02 × 0.08 × 0.40 = 0.00006528
```

These two values do not sum to 1, so they are not yet a probability distribution. After normalizing, positive is 0.00014112 ÷ (0.00014112 + 0.00006528) ≈ 0.68 and negative is about 0.32. The lecturer does read out these two results: the model gives this review a 68% chance of being positive.

Then the problem with this approach ([27:44](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1664s)). Suppose grandson never appears in a positive review in the training data. Then `P(grandson | positive)` is 0, and the whole product for the positive side is 0 as well. The model would say the review cannot be positive, only because it contains grandson. That conclusion is unreasonable: when a word is rare, its absence from the training data does not mean it can never appear in a positive review.

The fix is **additive smoothing**: add some value α to each value in the distribution to smooth the data a little. A common form is **Laplace smoothing**, which adds 1 to each value, as if every word had been seen one more time than it really was. A word never seen counts as seen once, a word seen once counts as seen twice, and nothing multiplies by 0.

Some numbers make the difference concrete (my own example; the lecturer gives none). Suppose the training data has 20 positive reviews and none contains grandson. Without smoothing, `P(grandson | positive)` = 0 ÷ 20 = 0. With Laplace smoothing, the two cases "contains grandson" and "does not contain grandson" are each counted once more, and the estimate becomes (0 + 1) ÷ (20 + 2) = 1 ÷ 22 ≈ 0.045, no longer 0. A word that appears in 5 of the 20 goes from 5 ÷ 20 = 0.25 to 6 ÷ 22 ≈ 0.27, a small shift. The denominator grows by 2 because each of the two cases gained 1; I wrote this formula from the lecturer's "add 1 to each value".

Last comes the code demo ([29:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1761s)). `sentiment.py` loads a small set of positive reviews (such as "It was great! So much fun") and negative reviews (such as "Not worth it" and "Kind of cheap"), trains a Naive Bayes classifier, and asks the user for a sentence.

| Input | Classifier output |
|---|---|
| I enjoyed it | About 0.92 probability of positive |
| kind of overpriced | About 0.96 probability of negative |

**Check yourself. Write your answer down before opening the fold.** Using the table above, compute the probability that the two-word review "my grandson" is positive. Compared with the four-word result, which word flips the decision? (The review is my own; the numbers are from the lecture's table.)

<details>
<summary>Answer</summary>

Positive: 0.49 × 0.30 × 0.01 = 0.00147. Negative: 0.51 × 0.20 × 0.02 = 0.00204. Normalizing: 0.00147 ÷ (0.00147 + 0.00204) = 0.00147 ÷ 0.00351 ≈ 0.42. With only my and grandson, the model gives 0.42 for positive and 0.58 for negative, so it would call the review negative: my leans positive (0.30 against 0.20), but that is outweighed by grandson appearing in negative reviews (0.02) at twice the rate of positive ones (0.01), and negative reviews are slightly more common to begin with.

Adding loved and it brings it to 0.68. The word that flips it is loved: it appears in 0.32 of positive reviews and only 0.08 of negative ones, a factor of four, which outweighs the pull toward negative from grandson and from it (0.30 against 0.40).

</details>

### Turning words into vectors: one-hot, distributed representations and word2vec

[Recording 30:57–40:33](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1857s)

Naive Bayes works, but it rests on several assumptions. The lecturer asks next whether machine learning tools can take better advantage of language data. The approach that keeps coming back from earlier weeks is to turn the input into numbers. A neural network takes a vector as input and produces a vector as output, so words have to become vectors, and the vectors should express what the words mean.

The most direct way is a **one-hot representation** ([32:02](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1922s)). Take "He wrote a book":

```text
he    = [1, 0, 0, 0]
wrote = [0, 1, 0, 0]
a     = [0, 0, 1, 0]
book  = [0, 0, 0, 1]
```

Each word's vector has a single 1 and 0 everywhere else. Every word has its own vector and can be fed to a neural network. But the lecturer points out two problems:

1. There are only four words here. With a vocabulary of thousands of words or more, a distinct vector for every word means very long vectors, which are harder to work with and to train on.
2. Words with similar meanings should have similar vectors and sit close together in the vector space. One-hot cannot do that: wrote and authored mean much the same thing, and so do book and novel, but each has its 1 in a different position, so their vectors are entirely different.

What we want instead is a **distributed representation** ([34:05](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2045s)): each word is associated with a vector, the meaning is spread across many values, and similar words have similar vectors.

Where do the values come from? The lecturer quotes the British linguist J. R. Firth: "You shall know a word by the company it keeps." That is, define a word's meaning by the words that appear around it. In the context "for ___ he ate", the blank could reasonably be breakfast, lunch or dinner. These three words appear in similar contexts, so they should have similar meanings. A computer can learn this: read a large corpus, see which words appear in similar contexts, and move their vectors close together.

**word2vec** is a common model for doing so ([35:39](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2139s)). The lecturer gives only the idea: every word starts at a random position in space, and as the model is trained on data it learns which words appear in similar contexts and moves the vectors accordingly, until breakfast, lunch and dinner end up near each other, and so do book, memoir and novel.

The code demo ([36:24](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2184s)) uses an already trained result. Each line of `words.txt` is a word and its word2vec vector; `vectors.py` reads it into a dictionary and defines `distance` (the distance between two word vectors) and `closest_words` (the words with the nearest vectors). The lecturer tries a few pairs in the Python interpreter:

| Words | Distance |
|---|---|
| book and novel | 0.34 |
| book and breakfast | about 0.64 |
| lunch and breakfast | about 0.2 |

The lecturer says to read 0 as very close together and 1 as very far apart. The vector for book on its own is a long list of numbers that means little; it becomes meaningful when compared with the vectors of other words. Of the 10 words closest to book, the first is book itself, followed by books, essay, memoir, essays, novella, anthology and so on.

word2vec also captures something about the relationships between words ([39:03](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2343s)). Subtracting the vector for man from the vector for king gives the vector that "takes us from man to king". Add it to woman, ask for the closest word, and the answer is queen:

```text
closest_word(king − man + woman) = queen
```

**Check yourself. Write your answer down before opening the fold.** From the three distances the lecturer reports, which of book–novel, book–breakfast and lunch–breakfast is closest in meaning and which is furthest? With a one-hot representation instead, would the distances for wrote–authored and wrote–book differ?

<details>
<summary>Answer</summary>

A smaller distance means closer: lunch–breakfast (about 0.2) is closest, then book–novel (0.34), and book–breakfast (about 0.64) is furthest. That matches intuition, since two meals are far more alike than a book and a breakfast.

With one-hot there would be no difference. Any two different words have their 1 in different positions, so the two vectors have no position where both are non-zero, and every pair of different words is equally far apart. The distance between wrote and authored equals the distance between wrote and book. That is the lecturer's second problem. One more detail: `distance` in `vectors.py` is cosine distance, and under it any two different one-hot vectors are at distance 1. That sentence is my own addition from the source code; the lecturer does not say how the distance is computed.

</details>

### Sequence in, sequence out: the RNN encoder–decoder

[Recording 40:33–46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2433s)

Once words can be written as vectors, they can be the input or the output of a neural network. The lecturer first recalls what a neural network does: input goes in, output comes out, and training data is used to update the weights so that the mapping from input to output becomes more accurate. So we can imagine passing a word in and getting a word out.

This is useful in **machine translation**, for instance passing in the English word lamp and getting the French word for it. But translation is usually not word for word; it works on a whole sentence or paragraph. That raises a problem ([42:12](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2532s)): a neural network's input and output have a fixed size, and a sentence does not. The problem to solve is therefore "translating one sequence into another sequence". Question answering is the same kind of problem: the input is "What is the capital of Massachusetts" and the hoped-for output is "The capital is Boston".

The tool is the **recurrent neural network** (RNN) from the previous week ([43:06](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2586s)): run the same network many times, each time on one value of the sequence, passing a **hidden state** from one run to the next to keep track of the relevant information so far.

The architecture the lecturer uses is the **encoder–decoder** ([43:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2615s)): the encoder encodes the question into a hidden state, and the decoder decodes that hidden state into the output we want. He walks through it with the question above.

The encoder half:

1. The first word, what, goes into the network and produces a hidden state.
2. The second word, is, goes into the same network together with the hidden state from the previous step and produces a new hidden state.
3. the, capital, of and Massachusetts repeat this in turn, each step taking one word and the previous hidden state. At the end there is one final hidden state.
4. Nothing is left in the input, so a special end token is passed in to signal that.

The decoder half ([44:56](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2696s)):

1. It generates the first word, the, along with a hidden state.
2. To generate the next word it helps to know the previous one, so the is passed back into the decoder together with the hidden state, producing capital.
3. capital is passed back in, producing is.
4. Once more, producing Boston.
5. How do we know it is done? Run it one more time: pass Boston back in, and this time the output is an end token.

In summary: the input sequence goes into the encoder, which is an RNN producing hidden states along the way until the final one; the decoder is also an RNN, and it uses that hidden state to generate the output sequence.

**Check yourself. Write your answer down before opening the fold.** In the lecture's walkthrough the answer "the capital is Boston" has only four words. How many times does the decoder run in total? On its fourth run, what inputs does it get and what does it produce?

<details>
<summary>Answer</summary>

Five times. The first four runs each produce a word (the, capital, is, Boston), and the fifth takes Boston and produces the end token, which is how the program knows to stop. Without the fifth run the decoder has no way to say "the answer ends here".

The inputs to the fourth run are the word produced in the previous step, is, and the hidden state left by the previous step; the outputs are Boston and a new hidden state. Those two things are all the decoder has at each step, and the problem the next section deals with comes from there.

</details>

### Attention: letting the decoder decide where in the input to look

[Recording 46:35–52:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s)

The lecturer says that for many years the RNN and its variants were among the best approaches to natural language processing, but there were problems to solve. The first is in the encoder ([47:04](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2824s)): the whole input sequence is encoded into that final hidden state, and everything needed to generate the output has to fit inside it. That is manageable for short sequences and harder and harder for long ones.

It would be better, when generating output, to refer not just to the final hidden state but to every hidden state the encoder produced along the way. But how should so many be combined into one? Adding them up or averaging them would work, except that it assumes each one is equally important. They are not: each hidden state corresponds most closely to one word of the input, and some words matter more; and which input words matter also changes with the position of the output being generated.

What is really needed is a way for the model to decide which inputs are worth paying attention to at which point in time. That is the key idea behind **attention** ([48:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2917s)).

Back to the same example. The input is What is the capital of Massachusetts, the output so far is the capital is, and the fourth word is next. The attention mechanism computes an **attention score** for each input word, a value for "how relevant is this word right now". When generating the fourth word, the most important words are probably capital and Massachusetts.

As for how the scores are computed, the lecturer says several mechanisms have been used: something as simple as a dot product to see how similar two vectors are, or an entire neural network trained to compute them. The key point is that how to compute the scores is learned during training; the model learns for itself what to pay attention to when deciding the next word.

Once the scores exist ([50:51](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3051s)): each input word is associated with a hidden state vector that captures the sentence up to that word, but focused mainly on that word. Multiply each vector by its attention score and add them all up, in other words take a **weighted average**, and the result is a new vector. It represents the context from the input, weighted toward the words judged most important. Feed this vector to the decoder, and the decoder can decide that the next word is Boston.

The lecturer then shows a diagram from the paper that introduced the idea ([51:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3097s)), where the task is translating English into French. He does not say which paper; the official slides note beside the figure that it is adapted from Bahdanau et al. 2015, "Neural machine translation by jointly learning to align and translate". The English input runs along the top, the French output down the left side, and each square is an attention score, with lighter squares for higher scores. The diagram shows a strong correspondence between each French word and the equivalent English word: when generating the French word for "agreement", the model is mostly looking at the English word agreement. Sometimes it looks at several words: the French word for "economic" mainly attends to the English economic and also to European. The lecturer notes that attention scores are easy to visualize, which gives a sense of what the model is paying attention to when it makes a decision.

**Check yourself. Write your answer down before opening the fold.** Suppose the input has only three words with hidden states h₁ = (1, 0), h₂ = (0, 1) and h₃ = (1, 1), and the attention scores when generating some output word are 0.1, 0.2 and 0.7. What vector is handed to the decoder? How does it differ from a plain average? (My own example; having the scores sum to 1 is also my own setup.)

<details>
<summary>Answer</summary>

Weighted average: 0.1 × (1, 0) + 0.2 × (0, 1) + 0.7 × (1, 1) = (0.1 + 0.7, 0.2 + 0.7) = (0.8, 0.9).

The plain average is ((1 + 0 + 1) ÷ 3, (0 + 1 + 1) ÷ 3) ≈ (0.67, 0.67), with each word counting for a third. The weighted result lies close to h₃ at (1, 1), because the third word has the highest score. At another output position the scores differ, and the same three hidden states combine into a different vector; a plain average is the same no matter which word is being generated, which is exactly why the lecturer says averaging is not good enough.

</details>

### The Transformer encoder: parallel processing, positional encoding and self-attention

[Recording 52:57–1:00:10](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3177s)

An RNN with attention already works well, but the RNN has another problem: every run needs the output of the step before it. That is how the network knows the order of the words, but it also means this word cannot be computed until the previous word's hidden state is done. The whole process is hard to parallelize ([53:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3201s)). The lecturer ties this to the growth of large language models: more training data makes a model more accurate, so models and datasets keep getting larger and training keeps taking longer, and the lack of parallelism becomes a growing problem. This was one of the main motivations for the **Transformer** architecture ([54:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3261s)). He says there are many kinds of Transformers and that he will describe one basic architecture.

Start with the encoder. An RNN encoder has to go through the words in order; the Transformer sends each word through the same neural network on its own to get an **encoded representation** of that word. Words do not wait for each other, and everything can be computed at once. The lecturer points out that he draws the flow for a single word, while every other input word is going through the same thing at the same time.

The price of parallelism is that word order is gone ([56:16](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3376s)). "Sherlock Holmes gave the book to Watson" and "Watson gave the book to Sherlock Holmes" mean different things. An RNN runs one word at a time in sequence, so order comes along automatically; a Transformer processes each word independently and does not have that information.

The remedy is **positional encoding** ([56:50](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3410s)): a vector that represents "this is the n-th word of the sentence". It is added to the input word's vector, and the sum carries both pieces of information, what the word is and where it appears. The sum is then passed into the neural network, which can use both.

Besides positional encoding and this feed-forward neural network, there is one more component, a **self-attention** step ([57:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3466s)). This attention looks at the other input words: how a word should be interpreted varies with the other words in the input, so each input word decides for itself which input words to pay attention to before settling on its encoded representation. The reason the lecturer gives is that words are defined by their context; that is the same idea as Firth's line in the fifth section, and the connection is my own summary.

Self-attention is valuable enough that a Transformer often uses several self-attention layers at the same time, so the model can attend to several facets of the input at once. This is **multi-headed attention** ([58:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3515s)), where each attention head can pay attention to something different.

In the spirit of deep learning, the two steps "multi-headed self-attention layer plus neural network layer" can be repeated many times to learn deeper patterns. After every input word has had its positional encoding added and has passed through these layers, we have an encoded representation for each word, and that is the output of the encoder.

**Check yourself. Write your answer down before opening the fold.** If positional encoding were removed, what would the Transformer encoder be missing, according to the lecturer, when it processes "Sherlock Holmes gave the book to Watson" and "Watson gave the book to Sherlock Holmes"? Why does an RNN not have this problem?

<details>
<summary>Answer</summary>

It would be missing the positions of the words. The two sentences use the same set of words and differ only in which comes first, and that is precisely what tells us who gave the book to whom. A Transformer processes each word independently in parallel, so unless position is carried in the input, the model has nothing to tell the two sentences apart.

An RNN takes one word at a time and passes its hidden state to the next step, so whether it sees Sherlock Holmes first or Watson first changes the hidden states that follow; order comes with the computation. The cost is that it cannot run in parallel. The Transformer gains parallelism and then has to put order back with positional encoding.

</details>

### The Transformer decoder and the course wrap-up

[Recording 1:00:10–1:05:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3610s)

The decoder has a structure very similar to the encoder. To generate the next output word, the input is the previous output word plus its positional encoding (where in the output sequence we are). Then come the same two steps, self-attention and a neural network, which can also be repeated over many layers. Here self-attention lets an output word attend to the other words in the same output, because deciding the next word requires knowing what has already been generated.

The decoder has one additional step ([1:00:41](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3641s)): another attention, in which the output word attends to the encoded representations produced by the encoder. When generating each token of the output sequence, the model needs to decide which encoded representations of the input words are relevant to this step, and that is what this step does.

Putting the two halves together: the encoder takes all the input words and produces encoded representations; the decoder takes the previous output word, attends to the output generated so far and to the encoded input, and generates the next output word. The lecturer says this is only one possible architecture for a Transformer, and that the key is the attention steps that let words pay attention to each other. Training no longer has to wait for the words to be processed one after another, so it parallelizes much more easily, and how to perform the attention steps is also learned in training.

He ends by noting that many variants of this model have been proposed ([1:02:43](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3763s)): some Transformers use only an encoder, some only a decoder, and some another combination, with the same core ideas. He does not name any specific model.

In the wrap-up ([1:03:30](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3810s)) the lecturer goes back over the seven topics of the course: search, knowledge, uncertainty, optimization, machine learning, neural networks, and this week's language.

**Check yourself. Write your answer down before opening the fold.** When the Transformer decoder generates an output word, it goes through two kinds of attention. What does each one attend to? Which one does the encoder not have?

<details>
<summary>Answer</summary>

The first is self-attention, which attends to the other words already generated in the output sequence, to know what has been written so far. The encoder has self-attention too, but there it attends to the other input words.

The second is the attention the decoder adds, which attends to the encoded representations from the encoder, that is, to each word of the input. Its role is the same as attention on top of the RNN in the previous section: deciding which parts of the input are most relevant for this output word. Connecting the two sections this way is my own summary.

</details>

## Project 6A: Parser — Parsing Sentences with a CFG and Extracting Noun Phrases

> How this site handles project solutions: both projects below start with the task, the code the course provides, an approach, pseudocode, common mistakes and ways to check your work, none of which contains code you could submit. The full reference implementation is folded at the end of each project and hidden by default. The course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) lists discussing solutions with diagrams or pseudocode as reasonable, and providing or looking at solutions in advance as not reasonable.

### Task

According to the [official spec](https://cs50.harvard.edu/ai/projects/6/parser/), you complete three things in `parser.py` so that the program can parse the ten sentences in the `sentences/` directory and list the noun phrase chunks of each:

1. **`NONTERMINALS`**: add the CFG rules that generate nonterminal symbols. Each rule goes on its own line, the first rule must begin with `S ->`, and noun phrases must use the symbol `NP`. `TERMINALS` must not be changed.
2. **`preprocess(sentence)`**: convert a sentence into a list of lowercased words. The spec requires `nltk`'s `word_tokenize` for tokenization and excludes any word without at least one alphabetic character (such as `.` or `28`).
3. **`np_chunk(tree)`**: return all noun phrase chunks. A noun phrase chunk is a subtree whose label is `NP` and that does not itself contain another `NP`. If the home is a chunk, then the armchair in the home is not, because it contains the former.

The spec also warns against over-generation ("Armchair on the sat Holmes." should not be accepted) and against rules that fit only one particular sentence.

### Code the Course Provides

The top of `parser.py` already provides every rule that generates words, plus one starting rule. This is the content of the official file:

```python
import nltk
import sys

TERMINALS = """
Adj -> "country" | "dreadful" | "enigmatical" | "little" | "moist" | "red"
Adv -> "down" | "here" | "never"
Conj -> "and" | "until"
Det -> "a" | "an" | "his" | "my" | "the"
N -> "armchair" | "companion" | "day" | "door" | "hand" | "he" | "himself"
N -> "holmes" | "home" | "i" | "mess" | "paint" | "palm" | "pipe" | "she"
N -> "smile" | "thursday" | "walk" | "we" | "word"
P -> "at" | "before" | "in" | "of" | "on" | "to"
V -> "arrived" | "came" | "chuckled" | "had" | "lit" | "said" | "sat"
V -> "smiled" | "tell" | "were"
"""

NONTERMINALS = """
S -> N V
"""

grammar = nltk.CFG.fromstring(NONTERMINALS + TERMINALS)
parser = nltk.ChartParser(grammar)
```

`main` is written for you as well: it reads a sentence (from a file or the keyboard), calls `preprocess`, gets every syntax tree from `parser.parse`, and prints each tree and the chunks found by `np_chunk`. The two functions you write look like this in the file:

```python
def preprocess(sentence):
    """
    Convert `sentence` to a list of its words.
    Pre-process sentence by converting all characters to lowercase
    and removing any word that does not contain at least one alphabetic
    character.
    """
    raise NotImplementedError


def np_chunk(tree):
    """
    Return a list of all noun phrase chunks in the sentence tree.
    A noun phrase chunk is defined as any subtree of the sentence
    whose label is "NP" that does not itself contain any other
    noun phrases as subtrees.
    """
    raise NotImplementedError
```

A grammar with only the rule `S -> N V` can generate nothing beyond noun-plus-verb sentences like "Holmes sat."

### Approach

Writing the grammar is what the walkthrough section "[Writing syntax as rules: context-free grammar](#writing-syntax-as-rules-context-free-grammar)" does ([Recording 5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s)). The lecturer's `cfg1.py` ([11:08](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=668s)) already has adjective phrases and prepositional phrases and works as a starting point, but it cannot be copied: the symbol names differ here (`Det`, `Adj`, `Adv`, `Conj`), and the spec says outright that the lecture's rules are intentionally simplified and over-generate.

A steadier way is to extend the grammar one sentence at a time. Get sentence 1 to parse, then look at what structure the next sentence adds and which kind of phrase needs one more way to be rewritten. In order, the ten sentences call for these structures:

| Sentence | New structure the grammar has to handle |
|---|---|
| 1 Holmes sat. | A noun phrase followed by a verb phrase |
| 2 Holmes lit a pipe. | A determiner plus a noun; a noun phrase after the verb |
| 3 We arrived the day before Thursday. | A prepositional phrase (before Thursday) |
| 4 Holmes sat in the red armchair and he chuckled. | Adds an adjective (red) and a conjunction (and) |
| 5 My companion smiled an enigmatical smile. | Nothing new; it confirms the rules so far |
| 6 Holmes chuckled to himself. | Nothing new |
| 7 She never said a word until we were at the door here. | An adverb before the verb (never) and at the end (here) |
| 8 Holmes sat down and lit his pipe. | Adds the adverb down; what stands on either side of and differs from sentence 4 |
| 9 I had a country walk on Thursday and came home in a dreadful mess. | Nothing new; note that country is an `Adj` in `TERMINALS` |
| 10 I had a little moist red paint in the palm of my hand. | Several adjectives in a row; two prepositions (in, of) one after the other |

Each time you add a structure you decide which level it attaches to. Whether a prepositional phrase hangs on the noun phrase or on the verb phrase decides how many trees a sentence has; where the determiner goes decides whether "the the armchair" is accepted.

`preprocess` is three steps: tokenize, lowercase, and drop tokens with no alphabetic character.

`np_chunk` has to check, for every subtree labeled `NP`, whether there is another `NP` beneath it. The spec's hints say the `label` and `subtrees` methods of `nltk.tree` will be useful.

### Pseudocode

```text
Writing the grammar:
    grammar ← only "a sentence is a noun phrase followed by a verb phrase"
    for sentence 1 to sentence 10 in sentences/:
        try to parse it
        if it does not parse:
            find the structure in the sentence the grammar does not cover yet
            give the matching phrase one more way to be rewritten
                (at the phrase level, not a rule written for this one sentence)
        go back and confirm every earlier sentence still parses
    finally try sentences that should be rejected and confirm they do not parse

Preprocess(sentence):
    split the sentence into tokens
    kept ← empty list
    for each token:
        make it lowercase
        if it contains at least one alphabetic character: add it to kept
    return kept

Noun phrase chunks(syntax tree):
    result ← empty list
    for each subtree t of the tree whose label is NP:
        if nothing beneath t (not counting t itself) is labeled NP:
            add t to result
    return result
```

### Common Mistakes

Everything below was observed when I ran the project (2026-10-13, Python 3.15.0, nltk 3.10.3). The spec page notes that the course uses Python up to 3.12; an independent reviewer reran the whole project on Python 3.12.13 with the same results as mine, and I did not run it on 3.12 myself.

- **The official file as distributed raises `NotImplementedError` straight away.** The error comes from `preprocess`, before the grammar is reached. The spec suggests having `np_chunk` return an empty list for a while so you can concentrate on the grammar.
- **`word_tokenize` needs data downloaded separately.** Without it you get a `LookupError` whose message says `Resource 'punkt_tab' not found`. On nltk 3.10.3, downloading `punkt_tab` alone is enough.
- **Skipping lowercasing or leaving punctuation in looks like a grammar problem.** Every word in `TERMINALS` is lowercase. Hand `Holmes` to the parser unchanged and `main` prints `Grammar does not cover some of the input words: "'Holmes'".`; leave the period in and you get the same message with `'.'`. When you see that message, check `preprocess` first instead of changing the grammar.
- **Copying the lecture's `cfg1.py` accepts two determiners in a row.** That grammar lets a noun phrase be "a determiner followed by a noun phrase", so determiners can stack. When I ran `cfg1.py`, she saw the the city parsed with one tree. The spec names "Holmes sat in the the armchair." as a sentence that should not be accepted.
- **`subtrees` includes the subtree itself.** If you do not exclude it when checking whether there is another `NP` beneath, every `NP` is judged to contain an `NP`, `np_chunk` always returns an empty list, and nothing appears under "Noun Phrase Chunks".
- **`np_chunk` must return trees, not strings.** `main` calls `flatten()` on each returned value, and the spec says the return value is a list of `nltk.tree` objects, each labeled `NP`.
- **Several trees for one sentence is normal.** The spec says English grammar is inherently ambiguous. `main` prints each tree with its chunks, so the same set of chunks showing up repeatedly is not an error.
- **A rule written for one sentence passes that sentence and is useless.** The spec's counterexample lines up the parts of speech of sentence 10 as a single rule: it parses, but it does not generalize.

### How to Check Your Work

First confirm the environment and how to run it:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/parser.zip
unzip parser.zip && cd parser

# The spec page notes that the course uses Python up to 3.12
pip3 install -r requirements.txt  # nltk

# Tokenizer data that word_tokenize needs (punkt_tab on nltk 3.10.3)
python -c "import nltk; nltk.download('punkt_tab')"

# Parse the sentence in a file; with no argument, type one yourself
python parser.py sentences/1.txt
```

The example on the spec page: for the input `Holmes sat.`, the printed tree has `S` over an `NP` (containing `N` holmes) and a `VP` (containing `V` sat), and "Noun Phrase Chunks" lists holmes.

Small cases you can work out by hand:

- `preprocess("Holmes sat 28 .")` should give `['holmes', 'sat']`. Neither 28 nor the period contains an alphabetic character.
- The chunks of "Holmes lit a pipe." are holmes and a pipe.
- The chunks of "I had a little moist red paint in the palm of my hand." are i, a little moist red paint, the palm and my hand. The whole of the palm of my hand does not count, because it contains other noun phrases.

All ten sentences must parse with at least one tree. Below are the noun phrase chunks this site's reference grammar finds (2026-10-13, one run on Python 3.15.0; an independent reviewer reran it once each on 3.15.0 and 3.12.13 with the same result). With a differently written grammar, individual chunks may differ:

| Sentence | Noun phrase chunks |
|---|---|
| 1 | holmes |
| 2 | holmes, a pipe |
| 3 | we, the day, thursday |
| 4 | holmes, the red armchair, he |
| 5 | my companion, an enigmatical smile |
| 6 | holmes, himself |
| 7 | she, a word, we, the door |
| 8 | holmes, his pipe |
| 9 | i, a country walk, thursday, home, a dreadful mess |
| 10 | i, a little moist red paint, the palm, my hand |

The number of trees depends on your grammar and has no single right answer. This site's reference grammar gives 2, 4 and 5 trees for sentences 3, 9 and 10 and one each for the rest; different numbers do not mean you are wrong.

Then test how tight the grammar is with the sentences from the spec's hints:

| Sentence | Should |
|---|---|
| Holmes sat in the armchair. | Parse |
| Holmes sat in the red armchair. | Parse |
| Holmes sat in the little red armchair. | Parse |
| Holmes sat in the the armchair. | Print `Could not parse sentence.` |
| Armchair on the sat Holmes. | Print `Could not parse sentence.` |
| His Thursday chuckled in a paint. | Either is fine; the spec says not to worry about meaningless sentences being accepted |

You can try more sentences that should be rejected. The nine below use only words from `TERMINALS`, and this site's reference grammar parses none of them: Sat Holmes., Holmes Holmes sat., Holmes sat sat., Holmes sat and and lit his pipe., Holmes in the armchair., Never Holmes sat., Holmes sat and., Holmes sat the red., Holmes lit a pipe pipe.

Last, the official automated checks:

```bash
check50 ai50/projects/2024/x/parser
style50 parser.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation was run only in the environment listed on this site and has not been through check50.

This is one way to write it, not an official solution. The choice made in the grammar is that a determiner may appear only once while adjectives may be stacked.

```python
NONTERMINALS = """
S -> NP VP | S Conj S | S Conj VP
NP -> N | Det N | Det AP N | NP PP
AP -> Adj | Adj AP
PP -> P NP
VP -> V | V NP | VP PP | Adv VP | VP Adv
"""


def preprocess(sentence):
    return [
        word.lower() for word in nltk.word_tokenize(sentence)
        if any(c.isalpha() for c in word)
    ]


def np_chunk(tree):
    chunks = []
    for subtree in tree.subtrees(lambda t: t.label() == "NP"):
        inner = list(subtree.subtrees(lambda t: t.label() == "NP"))
        if len(inner) == 1:
            chunks.append(subtree)
    return chunks
```

I put this implementation into the official `parser` directory and ran it (Python 3.15.0, nltk 3.10.3), and an independent reviewer extracted the code from the article and reran it with the same result: all ten sentences parse, with the chunks and tree counts given in the previous subsection; the three armchair sentences from the spec's hints parse, while "Holmes sat in the the armchair." and "Armchair on the sat Holmes." do not; and "His Thursday chuckled in a paint." is accepted. An independent reviewer also reran it on Python 3.12.13 (nltk 3.10.3) with the same result.

</details>

---

## Project 6B: Attention — Predicting a Masked Word with BERT and Drawing Every Attention Head

This section is laid out like the previous project: the reference implementation and the sample for `analysis.md` are folded at the end.

### Task

According to the [official spec](https://cs50.harvard.edu/ai/projects/6/attention/), this project uses Google's BERT for two things. BERT is a transformer-based language model trained as a masked language model: one word of a sentence is hidden, and the model predicts it from the surrounding context. The spec states that the base BERT model has 12 layers with 12 self-attention heads each, 144 in total.

This picks up exactly where the last three sections of the walkthrough end: the attention scores of the seventh section and the self-attention and multi-headed attention of the eighth become things you can look at. In the ninth section the lecturer says some Transformers use only an encoder, and BERT is one of those; the spec does not say this, so that sentence is my own addition.

The first part is completing three functions in `mask.py`:

1. **`get_mask_token_index(mask_token_id, inputs)`**: return the position of `[MASK]` in the input token sequence, counting from 0, or `None` if the input has no `[MASK]`. `inputs` is the `transformers.BatchEncoding` produced by the tokenizer.
2. **`get_color_for_attention_score(attention_score)`**: turn an attention score between 0 and 1 into a gray RGB triple. 0 is fully black `(0, 0, 0)`, 1 is fully white `(255, 255, 255)`, and values in between scale linearly; the three values must be equal integers, and you may either truncate or round (for 0.25, both `(63, 63, 63)` and `(64, 64, 64)` are accepted).
3. **`visualize_attentions(tokens, attentions)`**: call `generate_diagram` once for every head of every layer. In `attentions[i][j][k]`, `i` is the layer, `j` is the beam number (always 0 here) and `k` is the head; the layer and head numbers passed to `generate_diagram` must be 1-indexed.

The second part is reading the diagrams and writing an analysis: in `analysis.md`, describe at least two attention heads and the relationship between words each appears to have learned, with at least two example sentences you actually fed the model for each. The spec demonstrates two itself (Layer 3 Head 10 attends to the following token, and Layer 4 Head 11 has adverbs attend to the verbs they modify), and yours must differ from those.

### Code the Course Provides

The top of `mask.py` and `main` are already written. This is the content of the official file:

```python
import sys
import tensorflow as tf

from PIL import Image, ImageDraw, ImageFont
from transformers import AutoTokenizer, TFBertForMaskedLM

# Pre-trained masked language model
MODEL = "bert-base-uncased"

# Number of predictions to generate
K = 3

# Constants for generating attention diagrams
FONT = ImageFont.truetype("assets/fonts/OpenSans-Regular.ttf", 28)
GRID_SIZE = 40
PIXELS_PER_WORD = 200


def main():
    text = input("Text: ")

    # Tokenize input
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    inputs = tokenizer(text, return_tensors="tf")
    mask_token_index = get_mask_token_index(tokenizer.mask_token_id, inputs)
    if mask_token_index is None:
        sys.exit(f"Input must include mask token {tokenizer.mask_token}.")

    # Use model to process input
    model = TFBertForMaskedLM.from_pretrained(MODEL)
    result = model(**inputs, output_attentions=True)

    # Generate predictions
    mask_token_logits = result.logits[0, mask_token_index]
    top_tokens = tf.math.top_k(mask_token_logits, K).indices.numpy()
    for token in top_tokens:
        print(text.replace(tokenizer.mask_token, tokenizer.decode([token])))

    # Visualize attentions
    visualize_attentions(inputs.tokens(), result.attentions)
```

`main` reads a line of text containing `[MASK]`, tokenizes it, finds the position of `[MASK]`, passes the input to BERT, prints the `K` most likely words (3 by default), and finally calls `visualize_attentions` to draw the diagrams. The spec points out that tokens are not always words: a sequence always starts with `[CLS]` and ends with `[SEP]`, and one word may be split into several tokens (the spec's example is intelligently, split into `intelligent` and `##ly`).

The three functions you write look like this in the file:

```python
def get_mask_token_index(mask_token_id, inputs):
    """
    Return the index of the token with the specified `mask_token_id`, or
    `None` if not present in the `inputs`.
    """
    # TODO: Implement this function
    raise NotImplementedError



def get_color_for_attention_score(attention_score):
    """
    Return a tuple of three integers representing a shade of gray for the
    given `attention_score`. Each value should be in the range [0, 255].
    """
    # TODO: Implement this function
    raise NotImplementedError



def visualize_attentions(tokens, attentions):
    """
    Produce a graphical representation of self-attention scores.

    For each attention layer, one diagram should be generated for each
    attention head in the layer. Each diagram should include the list of
    `tokens` in the sentence. The filename for each diagram should
    include both the layer number (starting count from 1) and head number
    (starting count from 1).
    """
    # TODO: Update this function to produce diagrams for all layers and heads.
    generate_diagram(
        1,
        1,
        tokens,
        attentions[0][0][0]
    )
```

`generate_diagram(layer_number, head_number, tokens, attention_weights)` is also provided: it draws a grid with one row and one column per token, colors each cell with `get_color_for_attention_score` so that lighter means a higher score, and saves it as `Attention_Layer{layer}_Head{head}.png`. Read a diagram as "the token of this row is attending to the token of that column".

### Approach

All three functions are short. The hard part is being clear about what the data looks like.

**Finding the position of `[MASK]`.** The tokenizer turns the sentence into a sequence of token IDs, and `[MASK]` has its own fixed ID, the `mask_token_id` passed in. The job is to find where it sits in that sequence. Two things to be clear about first: `inputs` can hold many sentences at once, so the IDs are nested as "sentences × tokens", with only one sentence here; and the leading `[CLS]` takes up a position too. The spec suggests reading the transformers documentation for the fields of a tokenizer's return value.

**Turning a score into a color.** This is a linear mapping: 0 to 1 onto 0 to 255, made an integer, with the same value in all three color channels.

**Drawing every diagram.** The official code already shows how to draw the first head of the first layer; the job is to generalize it to "one diagram for each head of each layer". The data has three levels of index: layer, beam and head, where the beam is always 0. Indexes in the program count from 0, and the numbers passed to `generate_diagram` count from 1.

**Reading the diagrams for the analysis.** This half uses what the walkthrough says in "[Attention: letting the decoder decide where in the input to look](#attention-letting-the-decoder-decide-where-in-the-input-to-look)" ([Recording 46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s)) and, in "[The Transformer encoder](#the-transformer-encoder-parallel-processing-positional-encoding-and-self-attention)", about self-attention ([57:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3466s)) and multi-headed attention ([58:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3515s)): each head decides for itself which tokens each token attends to, and the lecturer says each head can attend to something different. Each diagram shows the attention scores of one head. Read one row at a time and find which column holds the lightest cell. The patterns worth looking for fall into roughly three kinds:

- Positional patterns: the light cells form a diagonal, meaning each token attends to a token at a fixed distance.
- Part-of-speech or syntactic patterns: the light cells for one kind of word fall on a word it is syntactically related to. The spec lists some directions to look in: verbs and their direct objects, prepositions, pronouns, adjectives, determiners, and tokens attending to the token before them.
- No pattern: the light cells of the whole diagram sit in the `[SEP]` or `[CLS]` column. The spec's hint says this is common and means the head has no good word to attend to in that sentence.

Confirm a head's pattern with several sentences. Move the target word, or insert other words in between, and see whether the light cell follows; also write down where the pattern fails, since the spec says heads are noisy and need not hold for every sentence. Going through 144 diagrams one by one is slow, so you can print the scores as numbers, shortlist candidate heads, and then open the diagrams to confirm.

### Pseudocode

```text
Find the mask position(mask ID, inputs):
    take the token ID sequence of the only sentence in the inputs
    compare one by one, starting from position 0:
        if the ID at this position equals the mask ID: return this position
    none matched: return "nothing"

Score to color(score):
    gray ← score × 255, made an integer
    return a color whose three channels are all gray

Draw every attention(tokens, all scores):
    for each layer (counting from layer 1):
        for each head in this layer (counting from head 1):
            take the score table for this layer, the only beam, this head
            draw one diagram with the official drawing function,
                passing the layer number and head number

Find one head's pattern:
    prepare several sentences with different structures, each containing [MASK]
    run the program on each sentence to get 144 diagrams
    pick a head:
        for each row, note which column holds the lightest cell
        guess a relationship (for example "words of one kind attend to words of another")
    test the guess on other sentences, noting where it holds and where it fails
    if it holds often enough, write it into analysis.md with at least two example sentences
```

### Common Mistakes

**The environment is the biggest trap.** The official `requirements.txt` pins no versions. On 2026-10-13 I tried four combinations on Python 3.12.13 (macOS), and an independent reviewer reproduced the same results:

| Installed versions | Result |
|---|---|
| `pip3 install -r requirements.txt` (that day it installed transformers 5.19.0 and tensorflow 2.21.0) | Line 5 of `mask.py`: `ImportError: cannot import name 'TFBertForMaskedLM' from 'transformers'` |
| transformers 4.57.6, tensorflow 2.21.0, tf-keras 2.21.0 | `TypeError: 'builtins.safe_open' object is not iterable` while loading the model |
| transformers 4.44.2, tensorflow 2.21.0, without tf-keras | `RuntimeError` whose message asks for `tf-keras` to be installed |
| **transformers 4.44.2, tensorflow 2.21.0, tf-keras 2.21.0, pillow 12.3.0** | Runs |

All three errors come from importing packages or loading the model and have nothing to do with the functions you write. When you see them, change package versions first.

Other points:

- **The position counts `[CLS]`.** The tokens of "Then I picked up a [MASK] from the table." are `[CLS]`, then, i, picked, up, a, `[MASK]`…, so the answer is 6, not 5.
- **The token IDs are nested.** If you forget to take out the one sentence first, what you compare is the whole sentence's ID sequence, not a single ID.
- **Colors must be integers.** The spec requires all three values to be integers; the score the model gives is not a Python integer, so remember to make the result an integer after multiplying by 255.
- **Layer and head numbers count from 1.** The filenames should run from `Attention_Layer1_Head1.png` to `Attention_Layer12_Head12.png`. A `Layer0`, or a missing `Layer12`, means you are off by one.
- **The next run overwrites the diagrams.** Every run writes 144 diagrams into the current directory, and the filenames carry only the layer and head numbers. Before comparing sentences, move the previous sentence's diagrams to another folder.
- **check50 does not check the drawing.** I read the check file for `2024/x/attention` in `ai50/projects`: apart from the file existing and importing, the other eight checks are all on `get_mask_token_index` and `get_color_for_attention_score`. Whether `visualize_attentions` draws 144 diagrams and whether `analysis.md` is right are things a clean check50 does not tell you, so check them yourself.
- **The first run downloads the model.** `bert-base-uncased` comes from Hugging Face, and the independent reviewer measured the cache at about 421 MB.
- **Input is lowercased.** The model is the uncased version, so the tokens in the diagrams are all lowercase, and Holmes appears as holmes.

### How to Check Your Work

Install and run:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/attention.zip
unzip attention.zip && cd attention

# The official spec says pip3 install -r requirements.txt (and notes that the course uses Python up to 3.12)
# The combination below is what worked on 2026-10-13; see "Common Mistakes" above
pip3 install pillow tensorflow==2.21.0 tf-keras==2.21.0 transformers==4.44.2

# The first run downloads bert-base-uncased from Hugging Face
python mask.py
```

The three functions can be tested on their own. These are the values from my run (2026-10-13, the last package combination in the table above, one run each; the independent reviewer's rerun matched):

| Call | Should give |
|---|---|
| `get_color_for_attention_score(0)` | `(0, 0, 0)` |
| `get_color_for_attention_score(1)` | `(255, 255, 255)` |
| `get_color_for_attention_score(0.25)` | `(63, 63, 63)` or `(64, 64, 64)`; the spec accepts both |
| `get_mask_token_index` on "Then I picked up a [MASK] from the table." | `6` |
| `get_mask_token_index` on a sentence with no `[MASK]` | `None` |

Output of the whole program. The first two sentences are the examples on the spec page, and my predictions match the spec page; the last two are extra runs of my own:

```text
Text: Then I picked up a [MASK] from the table.
Then I picked up a book from the table.
Then I picked up a bottle from the table.
Then I picked up a plate from the table.

Text: We turned down a narrow lane and passed through a small [MASK].
We turned down a narrow lane and passed through a small field.
We turned down a narrow lane and passed through a small clearing.
We turned down a narrow lane and passed through a small park.

Text: The turtle moved slowly across the [MASK].
The turtle moved slowly across the water.
The turtle moved slowly across the sand.
The turtle moved slowly across the beach.

Text: She opened the old door with a small [MASK].
She opened the old door with a small smile.
She opened the old door with a small key.
She opened the old door with a small sigh.
```

The predictions are printed by code the course already wrote, and they appear as soon as `get_mask_token_index` is correct. For a sentence with no `[MASK]`, the program should print `Input must include mask token [MASK].` and exit.

Checking the diagrams:

- Each sentence you run should add 144 PNG files to the directory.
- Compare against the example the spec page itself publishes: enter "Then I picked up a [MASK] from the table." and open `Attention_Layer3_Head10.png`. The spec says this head has each token attend to the next token, so the diagram should show a white diagonal shifted one cell to the right of the main diagonal. Mine does; in numbers, across five sentences every token except the `[CLS]` and `[SEP]` rows gives between 0.99 and 1.00 of its score to the next token. If your diagonal is shifted left, or the diagram is all black or all white, go back to the color mapping and the indexes.
- Then the spec's second example: enter "The turtle moved slowly across the [MASK]." and see whether the lightest cell in the slowly row of `Attention_Layer4_Head11.png` is moved. My score is slowly → moved 0.84.

The official automated checks:

```bash
check50 ai50/projects/2024/x/attention
style50 mask.py
```

`analysis.md` has no automated check. The standard to check yourself against is the spec's requirement: at least two heads, at least two sentences you actually ran for each, and neither of them the Layer 3 Head 10 or Layer 4 Head 11 the spec already demonstrates.

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation was run only in the environment listed on this site and has not been through check50. The head observations below amount to an answer for `analysis.md`, so write your own first as well.

This is one way to write it, not an official solution.

```python
def get_mask_token_index(mask_token_id, inputs):
    for i, token_id in enumerate(inputs.input_ids[0]):
        if int(token_id) == mask_token_id:
            return i
    return None


def get_color_for_attention_score(attention_score):
    value = round(float(attention_score) * 255)
    return (value, value, value)


def visualize_attentions(tokens, attentions):
    for i, layer in enumerate(attentions):
        for k in range(len(layer[0])):
            generate_diagram(
                i + 1,
                k + 1,
                tokens,
                layer[0][k]
            )
```

`inputs.input_ids` has the shape "batch of sentences × number of tokens"; there is only one sentence here, hence `[0]`. `attentions` is a tuple with one tensor per layer, `layer[0]` takes the only beam, and `len(layer[0])` is the number of heads in that layer.

I put this implementation into the official `attention` directory and ran it (2026-10-13, macOS, Python 3.12.13, transformers 4.44.2, tensorflow 2.21.0, tf-keras 2.21.0, pillow 12.3.0): each of the four sentences in the previous subsection printed those three predictions and produced 144 diagrams, and the three functions gave the values in the table above. An independent reviewer extracted the code from the article and reran it with the same result.

**A sample for `analysis.md`: two heads I actually looked at.** I first used a short script to print the scores of five sentences across all 144 heads, picked the heads with the clearest patterns, and then opened the corresponding diagrams to confirm. The five sentences are the four above plus "Holmes lit his [MASK] and sat in the red armchair."; the two starting with She and Holmes are my own, and the other three come from the spec page.

**Layer 4 Head 6: attending to the previous token.** The diagram is a diagonal shifted one cell to the left, blurrier than Layer 3 Head 10.

- "Then I picked up a [MASK] from the table.": i → then 0.96, a → up 0.95, from → `[MASK]` 0.97, the → from 0.96.
- "She opened the old door with a small [MASK].": the → opened 0.98, old → the 0.85, door → old 0.81, a → with 0.91.
- Where it does not hold: the first word of a sentence has no word before it and gives its score to `[CLS]` (then → `[CLS]` 0.85, she → `[CLS]` 0.95); some other words also give their highest score to `[CLS]`, verbs and nouns alike (picked → `[CLS]` 0.67, turtle → `[CLS]` 0.57, armchair → `[CLS]` 0.76).

**Layer 8 Head 11: determiners attending to the noun of their phrase, with prepositions showing the same tendency more weakly.**

- "We turned down a narrow lane and passed through a small [MASK].": a → lane 0.93, across the intervening narrow.
- "Then I picked up a [MASK] from the table.": the → table 0.86.
- "She opened the old door with a small [MASK].": the → door 0.76, across the intervening old.
- When the noun is masked, the determiner attends to `[MASK]`: a → `[MASK]` is 0.82, 0.68 and 0.78 in the three sentences above.
- Prepositions: the strongest is from → table 0.88, and the rest are weaker: through → `[MASK]` 0.55, with → `[MASK]` 0.53, down → lane 0.50, in → armchair 0.44; across does not attend to a noun and gives its highest score (0.43) to `[SEP]`.
- Where it does not hold: in "Holmes lit his [MASK]…" the word his gives its highest score (0.50) to `[SEP]`, and so does the second the in "The turtle moved slowly across the [MASK]." (0.55). In this head nearly all other tokens, nouns and verbs included, give their score to `[SEP]`, which is the situation the spec's hint describes.

Both observations rest on five sentences and are guesses about what the heads do. The spec itself says attention heads are noisy and do not always correspond to a relationship a person can interpret.

</details>

---

## Learning Checklist

- [ ] Can tell whether a sentence's problem is syntax or semantics, and give a sentence with two parses
- [ ] Can derive a sentence with context-free grammar rewriting rules and state the limit of hand-written rules
- [ ] Can list the bigrams and trigrams of a passage and say what Markov-chain text does and does not guarantee
- [ ] Can compute a review's positive and negative probabilities by hand with Naive Bayes and explain why Laplace smoothing is needed
- [ ] Can name the two problems of one-hot representations and what word2vec bases a word's vector on
- [ ] Can explain the problem of squeezing the whole input into one hidden state in an encoder–decoder, and how attention's weighted average deals with it
- [ ] Can say why a Transformer needs positional encoding and what each of the decoder's two kinds of attention attends to
- [ ] Can read an attention diagram: say which column's token a row's token attends to, and describe one head's pattern and its exceptions
- [ ] The Parser and Attention projects pass `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 6 lecture recording is listed there.

Original videos: [Language - Lecture 6 - CS50's Introduction to Artificial Intelligence with Python 2023](https://www.youtube.com/watch?v=QAZc9xsQNjQ)

Course and recording entries:

- [CS50 AI Week 6 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/6/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): I fetched the timecoded English captions with yt-dlp, read the full 1:05:21, and rewrote "Lecture walkthrough" from them. Section start times and the numbers quoted in the text (Naive Bayes' 0.49/0.51, the rates for my and grandson, 0.68 and 0.32; the sentiment demo's 0.92 and 0.96; the word-vector distances 0.34, 0.64 and 0.2) all come from the captions; I did not watch the video frames. At 45:46 the captions write the end token that the decoder outputs last as "n token"; this article follows the earlier passage (the end token at 44:54); the official transcript `lecture6.txt` also has "n token" at the same place, so the slip is in the official captions themselves. Four kinds of content do not come from the captions, and the text marks each: the `V` row of the CFG rule block and the source paper of the attention figure are from the text of the official slides `lecture6.pdf`; the values in the loved and it rows of the Naive Bayes table are from the figure in the official notes; the `cfg0.py` code, the `cfg1.py` rules, the package name `markovify` and how `distance` is computed are from the official lecture source code `src6.zip`; and I separately ran both grammars with nltk to confirm the parse results. The captions never mention this week's projects, so the project material comes from the course site, not the video.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Rewrote the video timeline from the transcript, removed TF-IDF/QA/project introductions the video does not cover, and made timecodes approximate.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rechecked against the timecoded captions. Rewrote "Core Concepts Cheat Sheet" as a nine-section "Lecture walkthrough", each section with a time link and one self-check; replaced the approximate minutes in the timeline with actual start times, each row linking to that point in the video; corrected the running time to 1:05:21 from the actual video. Removed material from the old cheat sheet that the lecture does not cover: the maximum likelihood formula for n-grams, the Add-k/Good-Turing/Kneser-Ney smoothing comparison, the four-tuple definition of a CFG and the CYK algorithm, the TF-IDF and cosine similarity formulas, the Q/K/V formula for scaled dot-product attention, and the Transformer's LayerNorm and residual structure. The learning checklist was rewritten to match.
- 2026-10-13: Rewrote Project 6A from the official `parser.zip`. The `Grammar` class, the CYK parser and the `generate` function shown before are not in the official file; what the project asks for is the `NONTERMINALS` grammar, `preprocess` and `np_chunk`. The new reference implementation was run inside the official project directory. The nonexistent `sentences.txt` in the run command is now `sentences/1.txt`.
- 2026-10-13: Pointed the official notes link at the current page, which matches this recording. Added a version note to Project 6B: Questions is no longer in the course site's current Week 6 project list, and that section has not yet been checked against the official files.
- 2026-10-13: Revised after an independent review. Project 6B changed from the 2020 edition's Questions to the Attention project on the current course site: the distribution code is from the official `attention.zip`, the reference implementation was run on Python 3.12, and the article records which package versions run and which do not, the predictions for three sentences and observations on two attention heads. The former Questions section (TF-IDF, cosine similarity) was removed entirely. "TF-IDF QA" was dropped from the title and `tf-idf` and `questions` from the tags, with `transformer` and `bert` added.
- 2026-10-13: Added two items taken from the official slides to the walkthrough (the `V` row of the CFG rules and the source paper of the attention figure) and a Laplace smoothing example with numbers of my own; added the release date recorded in the official notes to the version note; and brought two attributions to the lecturer in line with the tone of the captions.
- 2026-10-13: Restructured the project sections: the task, the code the course provides, an approach, pseudocode, common mistakes and ways to check your work come first, and the full reference implementation and the sample for `analysis.md` are folded at the end of each project with a warning, following the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/); the reference implementation code is unchanged. Also added, from the second review: the score range for the spec's own Layer 3 Head 10 now excludes the `[CLS]` and `[SEP]` rows, further numbers and exceptions for the two head observations inside the fold, and the predictions for the spec page's second example sentence.
- 2026-10-13: Revised after the review of the project sections. The update log no longer names the heads inside the fold; the Python version note for Parser moved outside the fold and records the reviewer's rerun on Python 3.12.13; three rows of the approach table were made coarser; and the tldr and description now match the current project sections.

## References

- [Week 6 Language lecture page](https://cs50.harvard.edu/ai/weeks/6/) — video, slides, lecture source code `src6.zip`, transcript, quiz
- [Language - Lecture 6 (YouTube)](https://www.youtube.com/watch?v=QAZc9xsQNjQ) — the basis for "Lecture walkthrough"; content, numbers and time links come from its English captions
- [Lecture 6 Notes](https://cs50.harvard.edu/ai/notes/6/) — current official notes, with the same sections as this recording; useful for the figures on the slides
- [Parser project spec](https://cs50.harvard.edu/ai/projects/6/parser/) — Distribution code `2023/x`, check50 slug `ai50/projects/2024/x/parser`
- [Attention project spec](https://cs50.harvard.edu/ai/projects/6/attention/) — Distribution code `2023/x`, check50 slug `ai50/projects/2024/x/attention`
- [Questions project spec (2020 edition)](https://cs50.harvard.edu/ai/2020/projects/6/questions/) — no longer listed on the current course site and not covered here
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition
