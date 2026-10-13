---
title: "Information Retrieval: The Indexing and Ranking Layer Beneath RAG | Stanford CS124 Week 4"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, information-retrieval, rag, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 5 }
tldr: "Week 4 teaches search: turn the query and the documents into vectors, weight them with tf-idf, rank by cosine similarity, speed it up with an inverted index, evaluate with precision, recall and MAP, and finally connect to dense retrieval and RAG. This post works the slides' four-document example in full."
description: "A guide to Stanford CS124 Winter 2026 Week 4: the information retrieval task, why LLMs still need retrieval, the tf and idf formulas, cosine similarity, a hand-worked tf-idf ranking of four documents, the inverted index, evaluating ranked results (average precision and MAP), two architectures for dense retrieval, RAG, and Lab 3 and PA3."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week4-information-retrieval)

This is Week 4 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). The topic is information retrieval (IR): a user wants to know something, there is a large collection of documents, and the system has to find the most relevant ones and put them in order.

**This week's material**: the [Information Retrieval and RAG slides](https://web.stanford.edu/class/cs124/lec/ir_jan17_2026.pdf), the [Lab 3 problems](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md) and [solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md), and [PA3](https://github.com/cs124/pa3-information-retrieval). The assigned reading is [Chapter 11](https://web.stanford.edu/~jurafsky/slp3/old_aug25/11.pdf) of the textbook. The pre-recorded videos are on Canvas, so this post follows the slides and the textbook.

## Why learn search when there are LLMs

The slides take up this question first. For something like "Where is the Louvre Museum located?", you can just prompt an LLM and need no document collection. But an LLM answering questions has three weaknesses that retrieval can cover:

- **It hallucinates.** The slides cite a 2024 study in which LLMs hallucinated up to 88% of the time in the legal domain.
- **It cannot see private data.** Personal email, medical records, internal company documents and legal discovery material are not in the training data.
- **It cannot keep up with change.** Last week's match, this morning's earthquake, the latest Oscar winner: the model does not know what happened after it was trained.

The solution is **RAG** (retrieval-augmented generation): use retrieval to find relevant passages in a document collection, then have the LLM generate an answer conditioned on them. The retrieval taught this week is the first half of RAG.

## The core idea: queries and documents are vectors

This is the vector space model, proposed by Gerard Salton in 1971:

1. Represent each document as a vector. Each dimension is a word, and the value is how much that word weighs in the document.
2. Represent the query as a vector in the same format.
3. Return the documents whose vectors are most similar to the query's, ranked by similarity.

The system cannot actually judge whether a document meets the user's need. It computes how similar the query and the document are as text, and uses that as an approximation of relevance.

There are two ways to build the vectors. **Sparse retrieval** uses word counts: the vector has as many dimensions as the vocabulary and is mostly zeros. **Dense retrieval** uses vectors of a few hundred dimensions produced by a language model. Both measure similarity with the cosine. This week starts with the first.

## tf-idf: how much a word matters in this document

Using raw counts as the vector values has two problems, and tf-idf handles each with one factor.

**Term frequency (tf) should be dampened.** A document where a word appears 100 times is not ten times as relevant as one where it appears 10 times. So take a logarithm:

tf = 1 + log₁₀(count), and tf = 0 when the count is 0

One occurrence gives 1, ten give 2, a hundred give 3.

**Words that are everywhere do not discriminate.** Nearly every document contains "the," so knowing that the query and a document share it tells you nothing. **Document frequency** (df, the number of documents containing the word) is used to discount such words:

idf = log₁₀(N ÷ df), where N is the total number of documents

A word in every document has idf = log₁₀(1) = 0 and counts for nothing. A word in only one document has the highest idf.

Their product is the weight of the word in the document: **tf-idf = tf × idf**.

## Cosine: compare direction, not length

The dot product of two vectors is affected by their length: a long document has more words and bigger numbers, so its dot product is naturally high. So first divide each vector by its own length to get a vector of length 1, then take the dot product. The result is the cosine of the angle between the two vectors: 1 when they point the same way, 0 when they share no words.

## One full calculation

The slides demonstrate with four very short "documents." The query is `sweet love`:

- Doc 1: Sweet sweet nurse! Love?
- Doc 2: Sweet sorrow
- Doc 3: How sweet is love?
- Doc 4: Nurse!

Everything is lowercased and punctuation is removed. N = 4.

**Step one, compute each word's idf.**

| Word | Appears in | df | idf = log₁₀(4 ÷ df) |
|---|---|---|---|
| sweet | 1, 2, 3 | 3 | 0.125 |
| love | 1, 3 | 2 | 0.301 |
| nurse | 1, 4 | 2 | 0.301 |
| sorrow | 2 | 1 | 0.602 |
| how | 3 | 1 | 0.602 |
| is | 3 | 1 | 0.602 |

`sweet` appears in three of the four documents and has the lowest idf.

**Step two, build the query vector.** Each of the two words appears once, so tf is 1 for both.

| Word | tf | idf | tf-idf | After dividing by length |
|---|---|---|---|---|
| sweet | 1 | 0.125 | 0.125 | 0.383 |
| love | 1 | 0.301 | 0.301 | 0.924 |

The length is √(0.125² + 0.301²) = 0.326. After normalization you can see that the weight of this query sits on `love`, because it is the rarer word.

**Step three, build the vector for Doc 1.** `sweet` appears twice, so tf = 1 + log₁₀(2) = 1.301.

| Word | Count | tf | idf | tf-idf | After dividing by length |
|---|---|---|---|---|---|
| sweet | 2 | 1.301 | 0.125 | 0.163 | 0.357 |
| nurse | 1 | 1 | 0.301 | 0.301 | 0.661 |
| love | 1 | 1 | 0.301 | 0.301 | 0.661 |

The length is √(0.163² + 0.301² + 0.301²) = 0.456.

**Step four, compute the cosine.** Only words that appear in both the query and the document contribute:

cos(query, Doc 1) = 0.383 × 0.357 + 0.924 × 0.661 = 0.747

**Doc 2** follows the same steps: the tf-idf of `sweet` is 0.125 and of `sorrow` is 0.602, the length is 0.615, and `sweet` normalizes to 0.203. It shares only `sweet` with the query:

cos(query, Doc 2) = 0.383 × 0.203 = 0.078

Those two are computed on the slides. Docs 3 and 4 are left as an exercise there, and the following are my own calculations with the same formulas:

- **Doc 3**: `how` 0.602, `sweet` 0.125, `is` 0.602, `love` 0.301, length 0.912. `sweet` normalizes to 0.137 and `love` to 0.330. cos = 0.383 × 0.137 + 0.924 × 0.330 = 0.357.
- **Doc 4**: only `nurse`, with no word in common with the query, so cos = 0.

| Rank | Document | Score |
|---|---|---|
| 1 | Doc 1: Sweet sweet nurse! Love? | 0.747 |
| 2 | Doc 3: How sweet is love? | 0.357 |
| 3 | Doc 2: Sweet sorrow | 0.078 |
| 4 | Doc 4: Nurse! | 0 |

Two things are worth noticing. Docs 1 and 3 both contain `sweet` and `love`, but Doc 3 has two words that only it contains (`how` and `is`). Their idf is high, which pulls Doc 3's vector away from the query's direction and lowers its score. In a collection of four documents, `how` and `is` are treated as rare and important. In a real collection that is large enough, function words like these appear in almost every document and their idf is close to 0. Also, Doc 2 contains `sweet` and still scores very low, because `sweet` is in almost every document and is weak evidence.

## The inverted index: not every document needs scoring

The calculation above scored all four documents. That is impossible with a hundred million. Notice that a document sharing no word with the query always has a cosine of 0 and does not need to be computed at all.

An **inverted index** exists to find all documents containing a given word quickly. It is like the index at the back of a book: look up a word and get the pages it appears on. It has two parts: a dictionary of all the terms, and for each term a list of document IDs (the postings).

The inverted index for the four documents above:

| Term | Document IDs |
|---|---|
| how | 3 |
| is | 3 |
| love | 1, 3 |
| nurse | 1, 4 |
| sorrow | 2 |
| sweet | 1, 2, 3 |

When the query `sweet love` arrives, look up just those two terms and combine the two lists to get {1, 2, 3}. Doc 4 is never even looked at.

## Evaluating ranked results

Precision and recall from Week 3 carry over directly:

- **Precision**: of the documents returned, how many are relevant.
- **Recall**: of all the relevant documents, how many were returned.

But search results have an order. Two systems can return the same ten documents, one with the relevant ones at the top and the other with them at the bottom. Precision and recall are identical, and the user's experience is very different. So you need a metric that looks at rank.

The method is to walk down the ranking and, at each relevant document, record the precision up to that position. The average of those numbers is the **average precision** (AP).

Here is an example made up for this post. A query has 3 relevant documents in total. The system returns six, and the order of relevant (✓) and non-relevant (✗) results is ✓ ✗ ✓ ✗ ✗ ✓:

| Rank | Relevant? | Precision up to here |
|---|---|---|
| 1 | ✓ | 1/1 = 1.00 |
| 2 | ✗ | |
| 3 | ✓ | 2/3 = 0.67 |
| 4 | ✗ | |
| 5 | ✗ | |
| 6 | ✓ | 3/6 = 0.50 |

AP = (1.00 + 0.67 + 0.50) ÷ 3 = 0.72. If the three relevant documents were ranked first, second and third, AP would be 1.

A system is tested on many queries. Averaging the AP over all of them gives **MAP** (mean average precision).

## Dense retrieval: finding matches with different wording

tf-idf has a basic limit: the query and the document have to use **the same word** to get any score. A query for "apple" will not find a document that only says "pineapple, fruit," and a query for "car" will not find one that only says "automobile."

Dense retrieval instead uses a language model to encode the query and each document into a vector of a few hundred dimensions. Texts with similar meanings end up with nearby vectors, whether or not they share words. The slides present two architectures:

- **Bi-encoder**: the query and the document go through encoders separately (the slides use BERT), each yields one vector, and the dot product is the score. The document vectors can all be computed and stored in advance, so at query time only the query needs encoding.
- **Single encoder (cross-encoder)**: the query and the document are concatenated and fed to one encoder, so the model sees both sides before scoring. It is more accurate, but the model has to run once for every query-document pair, which is too expensive for a large collection and is used only for rescoring.

In practice the two are often chained: a cheap method (the slides name BM25, a refinement of tf-idf) pulls the top N documents, and an expensive model reranks those N.

Dense vectors are not mostly zeros, so an inverted index does not help. Finding the closest vectors in a large set uses approximate nearest neighbor search, and the tool the slides name is Faiss.

Also, the unit of retrieval is usually not a whole document but a passage. The slides give a length of about 100 tokens.

## RAG: handing the retrieved passages to the LLM

Back to the start. RAG is two steps:

1. Retrieve with the user's question and get back the most relevant passages.
2. Put those passages and the question into the prompt and have the LLM answer from them.

That gives each of the three weaknesses an answer: the response can be checked against documents, private data becomes searchable once it is in the collection, and updating the collection updates the answers. It also means RAG quality has a ceiling: **a passage that retrieval did not find cannot be used, however strong the generator is.** So the ranking and evaluation methods above are needed in a RAG system just the same.

## Lab 3 and PA3

**[Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)** has two parts, with the problems and the [solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md) both public. The schedule also links a set of [introduction slides](https://web.stanford.edu/class/cs124/lec/lab3irupload.pdf). The first part computes a tf-idf cosine for a two-document collection in a spreadsheet, then asks why, for the query `apple`, a dense retrieval system might give "pineapple fruit" a non-zero score when tf-idf would not. The second part practices precision and recall and discusses which one matters more in different search settings.

**[PA3](https://github.com/cs124/pa3-information-retrieval)** walks through this week from the start in a notebook: build an inverted index, fetch the postings for a term, compute tf-idf, rank and retrieve documents, then do dense retrieval and compare the results of the two methods, ending with ethics questions. The README recommends going through the Week 4 videos, slides and readings and Lab 3 first.

## Self-check

1. A collection has 1,000 documents and a word appears in 10 of them. What is its idf? What if it appears in all 1,000? Answer: log₁₀(100) = 2, and log₁₀(1) = 0.
2. (From Lab 3.) The collection has only two documents: Doc1 contains apple 3 times and fruit 2 times, and Doc2 contains phone 2 times. The query is `apple`. Which document ranks first, and what is the cosine? Answer: N = 2, all three words have df = 1, and idf = log₁₀(2) = 0.301. In Doc1, `apple` is (1 + log₁₀3) × 0.301 = 0.445 and `fruit` is (1 + log₁₀2) × 0.301 = 0.392, the length is 0.593, and `apple` normalizes to 0.750. The query has one word, which normalizes to 1. The cosine is 0.750. Doc2 has no `apple`, so it scores 0. Doc1 ranks first.
3. (From Lab 3.) For some query the system returns 8 relevant and 10 non-relevant documents, and the collection has 20 relevant documents in total. What are precision and recall? Answer: precision = 8/18 = 0.44 and recall = 8/20 = 0.40.
4. Change the order in the AP example to ✗ ✓ ✓ ✓ ✗ ✗. What is AP? Answer: the relevant documents are at ranks 2, 3 and 4, with precisions 1/2, 2/3 and 3/4, so AP = (0.50 + 0.67 + 0.75) ÷ 3 = 0.64. Getting the first rank wrong puts it below the original 0.72.

## How this week connects to later ones

- This week's vectors are built from word counts. Next week applies the same idea to words themselves: one vector per word, compared by cosine as well.
- The encoder in dense retrieval is a Transformer, whose internals are covered in Weeks 6 and 7.
- PA7 in Week 9 has an agent call a web search tool, another way of connecting retrieval to an LLM.
- PageRank in Week 10 adds a different ranking signal: the links between pages instead of their text.

**Series navigation**: previous, [Week 3: Logistic Regression and Text Classification](/posts/ai/2026-08-22-cs124-week3-logistic-regression-en) | next, [Week 5: Embeddings and Social NLP](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en)

## Update Log

- 2026-10-13: Rewritten from the 2026 public slides. Added the full hand-worked tf-idf example with four documents, a concrete inverted index, an average-precision example, the two dense-retrieval architectures and a self-check; removed extensions the slides do not cover.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Information Retrieval and RAG slides](https://web.stanford.edu/class/cs124/lec/ir_jan17_2026.pdf) — the three weaknesses of LLMs, the tf-idf formulas, the four-document example, the inverted index, MAP, dense retrieval
- [CS124 Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md) and [solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)
- [CS124 PA3](https://github.com/cs124/pa3-information-retrieval)
- [Speech and Language Processing, August 2025 release, Chapter 11](https://web.stanford.edu/~jurafsky/slp3/old_aug25/11.pdf)
