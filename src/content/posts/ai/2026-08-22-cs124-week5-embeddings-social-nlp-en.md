---
title: "Embeddings and Social NLP: Representing a Word by the Words Around It | Stanford CS124 Week 5"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, embeddings, social-nlp, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 6 }
tldr: "Week 5 teaches embeddings: the meaning of a word can be represented by the words that tend to appear around it. It builds vectors from co-occurrence counts and compares them by cosine, then trains dense vectors of a few hundred dimensions with word2vec, and finally separates static vectors from ones that change with context. The same week's live lecture on computational social science has no public material."
description: "A guide to Stanford CS124 Winter 2026 Week 5: the distributional hypothesis, co-occurrence vectors with a hand-worked cosine, how word2vec (skip-gram with negative sampling) turns the problem into logistic regression, properties of embeddings and analogies, cultural bias in vectors, static versus contextual embeddings, and PA4. Based on the public slides."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp)

This is Week 5 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en), and the turning point of the course. In the previous three weeks people designed the representations: the features in Week 3 were hand-picked and the vectors in Week 4 were counted directly. From this week on, the data learns the representation.

The question is: **how do you represent the meaning of a word as a list of numbers?**

**This week's material**: the [Vector Semantics and Embeddings slides](https://web.stanford.edu/class/cs124/lec/vector26jan.pdf), the [Contextual Embeddings slides](https://web.stanford.edu/class/cs124/lec/ContextualEmbeddings25.pdf) (a 2025 file that the current schedule page no longer displays a link to, though it still downloads) and [PA4](https://github.com/cs124/pa4-embeddings). The assigned reading is [Chapter 5](https://web.stanford.edu/~jurafsky/slp3/old_aug25/5.pdf) of the August 2025 release of the textbook, plus a short part of [Chapter 10](https://web.stanford.edu/~jurafsky/slp3/old_aug25/10.pdf). The pre-recorded videos are on Canvas. This week also has a live lecture by Dan Jurafsky on computational social science. It was not recorded and its slides need a Stanford login, so this post covers only the embeddings material.

## The starting point: look at a word's neighbors

The slides open with a word most people have not seen: ongchoi. Suppose you read these sentences:

- Ongchoi is delicious sautéed with garlic.
- Ongchoi is superb over rice.
- ...ongchoi leaves with salty sauces...

And you have also read these:

- ...spinach sautéed with garlic over rice...
- ...chard stems and leaves are delicious...
- ...collard greens and other salty leafy greens...

Without being told, you can guess that ongchoi is a leafy green similar to spinach and chard (it is water spinach). The clue you used is that it shows up in the same kinds of sentences as spinach, surrounded by words like "garlic," "leaves," "rice" and "salty."

This idea is the **distributional hypothesis**: words that occur in similar contexts have similar meanings. It trades the abstract thing called meaning for something you can count, namely which words tend to appear around a word.

## The first approach: count co-occurrences

For each word, count how often every other word appears within a few words of it (the slides use four words on either side). The slides take four words from Wikipedia and look at only three context words:

| | pie | data | computer |
|---|---|---|---|
| **cherry** | 442 | 8 | 2 |
| **strawberry** | 60 | 0 | 0 |
| **digital** | 5 | 1683 | 1670 |
| **information** | 5 | 3982 | 3325 |

Each row is that word's vector. The numbers alone show it: cherry and strawberry both co-occur with pie, and digital and information both co-occur with data and computer.

To turn "you can see it" into a number, use last week's cosine: the dot product divided by the lengths of the two vectors.

**cherry and information:**

- dot product = 442×5 + 8×3982 + 2×3325 = 40,716
- length of cherry = √(442² + 8² + 2²) = 442.1
- length of information = √(5² + 3982² + 3325²) = 5,187.7
- cosine = 40,716 ÷ (442.1 × 5,187.7) = **0.018** (the slides print .017, with the last digit truncated)

**digital and information:**

- dot product = 5×5 + 1683×3982 + 1670×3325 = 12,254,481
- length of digital = √(5² + 1683² + 1670²) = 2,371.0
- cosine = 12,254,481 ÷ (2,371.0 × 5,187.7) = **0.996**

The counts for information are more than twice those for digital, but the cosine looks only at direction, so the two nearly coincide. Cherry and information are nearly perpendicular.

Vectors like these have two drawbacks. They have as many dimensions as the vocabulary, easily tens of thousands, and almost all the entries are 0. And words that are everywhere, like "the" and "of," have very high counts while carrying little information, which is what last week's tf-idf was for.

## The second approach: word2vec

The word vectors that work well in practice are **short and dense**: roughly 50 to 1,000 dimensions, with a value in every one. These are called embeddings. Short vectors mean fewer weights for a downstream model to learn, and words with similar meanings are more easily grouped together.

The method the slides teach is one variant of word2vec: **skip-gram with negative sampling** (SGNS). Its trick is that it counts nothing. It recasts the problem as the binary classification from Week 3.

### Replace counting with guessing whether two words are neighbors

The question becomes: given a target word w and another word c, is c a neighbor of w?

The training data needs no human labels, because the text itself is the answer. The slides' example:

> …lemon, a [tablespoon of **apricot** jam, a] pinch…

The target word is apricot and the window is two words on either side. The words in the window are the **positive examples**:

| Target | Context word | Label |
|---|---|---|
| apricot | tablespoon | neighbor |
| apricot | of | neighbor |
| apricot | jam | neighbor |
| apricot | a | neighbor |

The **negative examples** are drawn at random from the vocabulary: each positive example is paired with k random words, such as (apricot, aardvark), (apricot, seven) and (apricot, forever), labeled "not a neighbor." That is negative sampling.

### What the classifier looks like

Every word has a vector. The probability that two words are neighbors is the sigmoid of the dot product of their vectors:

P(neighbor | w, c) = σ(c · w)

The larger the dot product, the higher the probability. This is the same formula as the logistic regression in Week 3. The difference is that **there are no fixed features here, and the vectors themselves are what is learned**.

Here are some numbers made up for this post. Suppose the dot product of the vectors for apricot and jam is 2: the model puts the probability that they are neighbors at σ(2) ≈ 0.88. Suppose the dot product for apricot and aardvark is −1: the probability is σ(−1) ≈ 0.27.

### How it learns

Every word's vector starts out random. Training still uses cross-entropy loss and gradient descent, and each training example does two things:

- Pull the target word's vector toward the vectors of its **positive examples** (increase the dot product).
- Push the target word's vector away from the vectors of its **negative examples** (decrease the dot product).

After many passes over the corpus, words that often occur together have nearby vectors and words that never do are apart.

There is one thing here worth being clear about. Nobody wants this classifier for its own sake. Nobody actually needs to know whether jam is a neighbor of apricot. The classifier is a pretext, and the goal is the vectors that training produces along the way. The classification task is thrown away and the vectors are kept.

SGNS in fact learns two vectors for every word: one used when it is the target and one used when it is the context. A common choice is to add the two and use the sum as the final vector.

## Properties of embeddings

**The window size decides which kind of similarity you get.** The slides' example: with a very small window (two words either side), the nearest neighbors of Hogwarts are schools from other works of fiction, words of the same kind that could replace it. With a large window, the nearest neighbors become Dumbledore, Malfoy and half-blood, words from the same topic.

**Subtracting vectors can represent a relation.** The best-known example is that king − man + woman lands near queen, and Paris − France + Italy lands near Rome. Drawn out, the two pairs form a parallelogram. The slides add a caveat: the method only works for frequent words, small distances and certain relations, and how analogy works is not fully understood.

**Vectors record the era of their corpus.** Training one set of vectors on text from each decade shows meanings shifting over time.

**Vectors also record the biases of their corpus.** With the same analogy method, asking "Paris is to France as Tokyo is to what" gives Japan. Asking "man is to computer programmer as woman is to what" gave, in a 2016 study, homemaker. The vectors faithfully reflect how words are used in the training text, stereotypes included. The slides point out the consequence: if such vectors are used in a system that screens résumés, the bias comes along.

The same property can be turned around and used as a research tool. The slides present a 2018 study that Jurafsky co-authored: train vectors on text from each decade of a century and measure which gender or ethnicity each adjective leans toward. Adjectives about competence (brilliant, logical, thoughtful) leaned toward men, and that lean shrank from the 1960s to the 1990s. Work of this kind is the subject of this week's live lecture on computational social science: using language models as instruments for observing society.

## The limit of static vectors, and contextual embeddings

word2vec gives each word **one fixed vector**, called a static embedding. The problem is words with more than one sense:

- We had a picnic on the grassy river **bank**.
- I went to the **bank** and withdrew some cash.

The word bank gets the same vector in both sentences, and that vector can only be a blend of the two senses.

A **contextual embedding** works differently: the whole sentence goes through a language model, every word gets a vector, and **the same word gets different vectors in different sentences**. The slides show the vectors BERT computes for the word die. Plotted on a plane they fall into clusters: one for the singular of dice, one for the verb to die, and even one for the German article die.

The difference can be summarized this way:

| | Static embedding | Contextual embedding |
|---|---|---|
| What it represents | A word in the vocabulary | One occurrence of a word in a particular sentence |
| How you get it | Look it up in a table | Pass the whole sentence through a language model |
| The same word in different sentences | Same vector | Different vectors |

Contextual embeddings are taken from inside a Transformer, which is the subject of the next two weeks.

## PA4

**[PA4](https://github.com/cs124/pa4-embeddings)** has two halves. The first uses static word vectors: find synonyms, compare different similarity measures, and look at where antonyms sit in the vector space. The second uses BERT to get contextual embeddings and computes similarity between sentences. It ends with ethics questions. The README recommends going through the Week 5 videos and slides and the corresponding textbook reading first. Besides the existing `cs124` environment, this assignment needs PyTorch and Hugging Face Transformers installed, because it uses a pretrained model to get contextual embeddings.

There is no lab this week. The Tuesday slot is the live lecture.

## Self-check

1. Use the co-occurrence table to compute the cosine of cherry and strawberry. Answer: strawberry's vector is [60, 0, 0], the dot product is 442×60 = 26,520, the length of strawberry is 60 and of cherry 442.1, so the cosine is 26,520 ÷ (442.1 × 60) ≈ 1.00. On these three dimensions the two point in almost exactly the same direction.
2. In SGNS, if the dot product of two words' vectors is 0, what probability does the model give that they are neighbors? Answer: σ(0) = 0.5, no lean either way.
3. The training text is "I drink hot coffee," the window is one word on either side, and the target word is "hot." What are the positive examples? Answer: (hot, drink) and (hot, coffee).
4. "Apple" can be a fruit or a company. How does each kind of embedding handle it? Answer: there is a single static vector, a blend of the two uses that leans toward whichever is more common in the corpus. A contextual embedding gives two different vectors in "eat an apple" and "Apple announced a new phone."

## How this week connects to later ones

- The first step of the neural language model in Week 6 is to replace each token with its vector. The vectors in that layer are trained together with the rest of the model, with no separate word2vec run.
- SGNS is the first example of using a prediction task as a pretext for learning a representation. Language models follow the same pattern: the training objective is to predict the next token, and what turns out to be useful is the representation learned along the way.
- The document vectors used in last week's dense retrieval are the contextual embeddings from the end of this week.

**Series navigation**: previous, [Week 4: Information Retrieval](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en) | next, [Week 6: Neural Networks and LLMs](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms-en)

## Update Log

- 2026-10-13: Rewritten from the public slides. Added a hand-worked cosine on co-occurrence vectors, how skip-gram's positive and negative examples are built and trained, properties of embeddings and the bias studies, a comparison of static and contextual embeddings, and a self-check; removed author extensions unrelated to the slides.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Vector Semantics and Embeddings slides](https://web.stanford.edu/class/cs124/lec/vector26jan.pdf) — the ongchoi example, the co-occurrence table and cosine, skip-gram, analogies and the bias studies
- [Contextual Embeddings slides](https://web.stanford.edu/class/cs124/lec/ContextualEmbeddings25.pdf) — the bank and die examples, static versus contextual embeddings
- [CS124 PA4](https://github.com/cs124/pa4-embeddings)
- [Speech and Language Processing, August 2025 release, Chapter 5](https://web.stanford.edu/~jurafsky/slp3/old_aug25/5.pdf)
