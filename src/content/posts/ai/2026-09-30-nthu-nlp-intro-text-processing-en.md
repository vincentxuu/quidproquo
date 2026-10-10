---
title: "NTHU Hung-Yu Kao NLP, Week 1: Why Language Is Hard, and How Text Became Numbers Before LLMs"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, information-retrieval, tf-idf, bm25, word2vec]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 1
tldr: "Week 1 of Hung-Yu Kao's NLP course at NTHU is a 91-page deck, W1_NLP_brief. It opens with 'Watch for kids', five readings of the telescope sentence, and a Chinese tongue-twister about eleven uncles to show why language is hard. Then, from an information-retrieval angle, it builds one pipeline: inverted index, tokenization, stemming, TF-IDF, BM25. The second half hits that pipeline's dead ends (synonyms, polysemy, vocabulary mismatch), moves to SVD-based LSA, and closes with a preview of dense vectors through Skip-gram, GloVe, and FastText."
description: "Guide to week 1 of NTHU Hung-Yu Kao's Natural Language Processing, Fall 2025: based on W1_NLP_brief.pdf and the W1 Tuesday and Thursday recordings. Covers ambiguity examples, the four levels of NLP, inverted indexes, tokenization, stemming vs. lemmatization, stop words, the vector-space model and TF-IDF, BM25, the limits of bag of words, the LSA/LSI SVD example, the Skip-gram training loop, GloVe and FastText, and what changed in the Fall 2026 v2 deck."
draft: false
glossary:
  - term: "inverted index"
    aliases: ["倒排索引", "posting list"]
    definition: "A dictionary keyed by term, where each term points to a list of its occurrences (document IDs, optionally with character offsets). A query looks terms up directly instead of scanning every document."
    context: "The slides treat it as the first step of information retrieval: index for efficiency, then rank for accuracy."
  - term: "stemming"
    definition: "Rule-based reduction of a word's variants to one index term, so fishing and fisher both become fish. The output is not always a real word."
    context: "The slides use the Porter algorithm (1980) and contrast it with lemmatization, which is slower but outputs real words."
  - term: "LSA"
    aliases: ["LSI", "latent semantic analysis", "latent semantic indexing"]
    definition: "Run SVD on a term-document (or word co-occurrence) matrix, keep only the largest K singular values, and project terms and documents into a low-dimensional 'concept' space."
    context: "Used to fix the case where a query and a relevant document use different words, so their cosine similarity is low."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: this post is based on the Fall 2025 run of [NTHU Hung-Yu Kao's Natural Language Processing](https://github.com/IKMLab/NTHU_Natural_Language_Processing), specifically [W1_NLP_brief.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf) (91 pages). The matching recordings are [Week 1 Tue.](https://www.youtube.com/live/X7XJcm9wfFA) and [Week 1 Thu.](https://www.youtube.com/live/0hTqSpoNp4o) (in Mandarin). Facts were checked against the slides on 2026-09-30. The post follows the slides only; I did not transcribe the recordings. Access rating **A3** (see the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) for why).

**Series position**: previous: [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) | next: [Word embeddings and language models: from n-grams to RNNs](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) | [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

Type "taxi" into a search box and you probably also want pages that say "cab." To a person these are the same thing. To a program that only compares strings, they have nothing in common. The slides' own example is three different Chinese words for taxi.

Week 1 is about that gap. It answers one question: **before large language models, how did a computer turn a pile of text into something it could compute on and rank?** The answer is a pipeline that grew out of information retrieval, plus two patches applied after that pipeline hit a wall: LSA and word vectors.

## Course video sources

These recordings correspond to the material discussed here. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=X7XJcm9wfFA
title: Fall 2025 Week 1 Tue. recording
```

```youtube
url: https://www.youtube.com/watch?v=0hTqSpoNp4o
title: Fall 2025 Week 1 Thu. recording
```

Original videos: [Fall 2025 Week 1 Tue. recording](https://www.youtube.com/watch?v=X7XJcm9wfFA)、[Fall 2025 Week 1 Thu. recording](https://www.youtube.com/watch?v=0hTqSpoNp4o)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## Why language is hard for computers

The slides open with a short definition: NLP is the use of human languages by a computer, viewed as a branch of machine learning, with applications such as translation, information retrieval, chatbots, and information verification. Then comes a run of examples that are "easy for humans, hard for computers":

- **Word-sense ambiguity**: the slide shows only "Watch for kids" and a question mark. "Watch" can be a verb or a wristwatch.
- **Syntactic ambiguity**: "I saw a man on a hill with a telescope." The slide lists five readings: I watch him through my telescope; he has the telescope; the telescope is on the hill; I am on a hill watching a man who uses a telescope; and the one that reads "saw" as cutting with a saw.
- **Reasoning**: a Chinese tongue-twister in which the eldest uncle goes to the second uncle's house to tell the third uncle that the fourth uncle was tricked by the fifth, and so on through the eleventh uncle's 1,000-yuan salary. Who is the thief, and whose money was it? The slide's title is "Is reasoning difficult for LLM?"
- **Context**: a Chinese line about clothing that reads identically for winter and summer but means "wear as much as you can" in one and "wear as little as you can" in the other.
- **Homophones**: a classical-style Chinese passage (the 2026 deck credits it to Yuen Ren Chao) in which nearly every syllable is pronounced "ji," so only context tells the words apart.
- **Reading comprehension**: a question from a 2017 Chinese reading-comprehension competition that asks for a passage's main idea out of four options.

The slides then split language into levels. Most tasks later in the semester hang off this table:

| Level | What it deals with | Examples |
|---|---|---|
| Morphology | Word structure | Prefixes and suffixes, lemmatization/stemming, spell checking |
| Syntax | How words form sentences | Part-of-speech tagging, syntax trees, dependency trees |
| Semantics | Meaning of words and sentences | Named entity recognition, relation extraction, word sense disambiguation, coreference |
| Pragmatics | What cannot be parsed literally | Topic segmentation, summarization |

A middle section tours pre-LLM applications: flu prediction from Twitter, sentiment analysis, fake-news detection, and a medical literature example. Swanson and Smalheiser (1994) chained findings such as "stress is associated with migraines," "stress can lead to loss of magnesium," and "magnesium is a natural calcium channel blocker" to propose a link between migraines and magnesium levels. The slides also cite the claim that 80–90% of data is unstructured as the reason the course exists.

## Meeting text through information retrieval

The slides call this part "First meet with text: from the view of information retrieval." Retrieval means: given a user's query, find the most relevant subset of documents. It splits into two jobs. **Index for efficiency. Rank for accuracy.**

### Inverted index

The slides describe the simplest inverted index as a dictionary. Each term is a key pointing to a bucket (posting list) that records every occurrence of that term in the collection. Each entry holds at least a document ID. If you also store the character offset of each occurrence, you can show the surrounding context in results (the slides point to Google's result snippets) and support queries that require two terms to appear near each other.

### Lexical processing before indexing

Before documents become an index or vectors, a few steps run first:

- **Tokenization**: extract terms from a document. Strip HTML tags, punctuation, and special characters, and fold case.
- **Stemming**: map a word's variants to one index term. The slides' example: a document says fish and fisher, the query says fishing, and the document is missed. Stemming maps all three to fish. The slide immediately asks: what about "fishing rod"? It introduces the [Porter algorithm](http://www.tartarus.org/~martin/PorterStemmer/) (1980), which uses a prebuilt table of suffix rules, such as BINARIZATION → BINARIZE.
- **Stemming or lemmatization**: stemming turns studies into studi; lemmatization turns it into study. The first is rule-based, fast, and may not output a real word, which suits search engines. The second uses a corpus plus syntax, is slow, and outputs real words, which suits semantic understanding and QA.
- **Stop words**: dropping common words such as articles and prepositions shrinks the index by 20–30%. The slides then ask three questions. Should the list be static or dynamic? Does it depend on the application? When should you remove them? The example is "To be or not to be!", which is nothing but stop words.

### The vector-space model and TF-IDF

Each document becomes a high-dimensional vector with one dimension per term. The vocabulary is far larger than the set of terms in any one document, so these vectors are very sparse.

- **TF (term frequency)**: a term that appears many times in a document is likely more important. The slides define it as occurrences divided by document length.
- **IDF (inverse document frequency)**: a term found in few documents discriminates better than one found everywhere. IDF = log(n / nⱼ), where n is the number of documents and nⱼ is the number containing the term.
- **Similarity**: rank by the cosine of two document vectors.

The slides also note that TF-IDF has many variants, and search engines often weight queries and documents differently (their example notation is "ltn.lnc").

### BM25

The last ranking function is Okapi BM25 (1980s). The slides frame it as an improved TF-IDF with two free parameters, k and b, and say "generally k=2, b=0.75." They do not expand the formula. If you want the formula and what each parameter controls, see the [CS224U information retrieval post](/posts/ai/2026-09-29-cs224u-information-retrieval-en). Those slides give a default k of 1.2, which is a reminder that k is a parameter you tune, not a constant.

## Where bag of words hits the wall

At this point text can become numbers. The slides then show where "one dimension per word" breaks.

They start with a Chinese pair that uses the same characters in a different order: "money is not the problem" versus "no, money is the problem." Bag of words cannot tell them apart. Next is one-hot encoding on restaurant reviews: cheap, famous, great, tender, awful, too expensive, bad, overcooked, each on its own axis, all orthogonal. In that space, "cheap" is as far from "low-priced" as it is from "awful."

Two classic problems:

- **Synonymy** (bandit, brigand, thief): the same concept expressed with different terms, which hurts recall.
- **Polysemy** (bank as a repository, bank as a riverside): the same term in different contexts, which hurts precision.

The slides push this to "concept matching vs. term matching." A query can be conceptually close to a document and still have low cosine similarity. The causes: regional vocabulary (three Chinese words for taxi), domain vocabulary (a formal "smart mobile computing device" versus "phone"), or new terms (COVID-19, the novel coronavirus, SARS-CoV-2).

Hand-built dictionaries such as WordNet have their own costs: they ignore context, miss new words, cost a lot to maintain, and make similarity hard to measure.

The fix is a **continuous, distributed representation**: words become real-valued vectors, and similar words sit close together. Here the slides bring in [Bengio et al.'s 2003 neural probabilistic language model](http://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf) and Firth's (1957) distributional hypothesis: "A word is characterized by the company it keeps." Cat and dog both appear near lick and fur, so their vectors should be close.

## LSA: using SVD to find the concepts behind the words

The first patch is Latent Semantic Analysis, from Deerwester et al. (1990). Count co-occurrences over a corpus to get a matrix, then reduce it with SVD.

The small example uses three sentences, "I like deep learning.", "I like NLP.", and "I enjoy programming.", to build a 7×7 co-occurrence matrix. Keeping the two largest singular values places every word on a 2D plane.

The fuller LSI example uses 10 document titles. The first five are Linux open-source news (Debian, Gentoo, gnuPOD); the last five are genome news (Dolly the sheep, DNA chips). In the original term-document matrix, the term Linux appears only in d4. After reconstructing with the two largest singular values (K=2), Linux has positive weights across d1–d5 and near-zero weights on the five genome titles. **Linux never appears in d2, yet LSI judges it relevant to d2.** That is the slide's point, stated in Chinese: appearing does not mean relevant, and not appearing does not mean irrelevant. It also flags that the reconstructed matrix contains negative values, which a count matrix never could.

The slides list four problems with LSA: the matrix is as large as the vocabulary squared (possibly 100,000 × 100,000), it is extremely sparse, SVD has quadratic cost, and adding one new word changes the whole matrix.

## Word2Vec, GloVe, FastText: a preview of dense vectors

The last section comes at it from probability models. A unigram model ignores word order entirely; a bigram model is better but its context is too short. Word2vec uses a window to get more context, in two flavors:

- **CBOW**: use the context to predict the center word (The cat ___ its fur).
- **Skip-gram**: use the center word to predict the context (___ licked ___). The slides say they focus on this one.

The slides draw the Skip-gram training loop step by step. With window size 1, "The cat licked its fur. The truck moved." yields pairs like (the, cat) and (cat, licked). The network has a single hidden layer: the input-to-hidden matrix holds the word embeddings, and the hidden-to-output matrix holds a second set called output embeddings. In practice there is no matrix multiplication; the word's index looks up its vector directly. That vector takes a dot product with every word's output embedding, softmax turns the scores into a distribution over the vocabulary, and cross entropy measures the error for the update. Week 2 goes deeper, so this post stops here.

Two other embeddings get a slide each:

- **[GloVe](https://nlp.stanford.edu/projects/glove/) (2014)**: the slides say word2vec learns similarity and linear regularities well but does not fully use co-occurrence statistics; GloVe adds global statistics.
- **[FastText](https://fasttext.cc/)**: uses character-level features, so it can guess vectors for out-of-vocabulary words, and it ships pretrained vectors for many languages.

Which to use? The slides say "it depends." GloVe is widely used; FastText can also do well. If your domain has many words missing from pretrained vectors, such as classical Chinese, train your own with word2vec. The best approach is to compare on your own task, for example with [WordSim353](http://www.cs.technion.ac.il/~gabr/resources/data/wordsim353/).

The second-to-last slide quotes Leonie Monigatti's "[37 Things I Learned About Information Retrieval in Two Years at a Vector Database Company](https://www.leoniemonigatti.com/blog/what_i_learned.html)" and picks a few lines: BM25 is a strong baseline; similar does not mean relevant ("How to fix a faucet" vs. "Where to buy a kitchen faucet"); vector search is not robust to typos; out-of-domain is not the same as out-of-vocabulary. These lines tie week 1's classical methods to the RAG unit later on.

## The Fall 2026 v2 deck

The 2026 main README links [W1_NLP_brief_v2.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W1_NLP_brief_v2.pdf) (95 pages) from both W1 and W2, with recordings [Fall 2026 Week 1](https://youtube.com/live/EEbwXXoVQPY) and [Week 2](https://youtube.com/live/MnA5KUETSg4). A text comparison with the 2025 deck shows the same main line, with these additions:

- The vocabulary slide adds LLM vocabulary sizes: 32K for LLaMA 1 and 2 and Mistral 7B, 50K for GPT-3, 128K for GPT-4, 152K for Qwen, and asks "Bigger = Better?"
- The language-model history slide spells out what Markov and Shannon found.
- The word-vector section adds one line on Chinese-specific methods: CW2Vec and Stroke-rich FastText.
- The classical homophone passage is now credited to Yuen Ren Chao.

## What to do after reading

- **Tonight**: take three posts you have written, hand-compute TF-IDF for a few words, and check whether the top-scoring words match what you consider the keywords.
- **One step further**: reproduce the LSI example with scikit-learn's `TfidfVectorizer` and `TruncatedSVD`, and watch how the "Linux" row changes when K goes from 2 to 5.
- **Next post**: [Word embeddings and language models](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en) starts with n-grams and perplexity, finishes the "predict the next word" story, and gets to RNNs.

## Further reading

- [CS224N word vectors](/posts/ai/2026-08-22-cs224n-word-vectors-en): Stanford's take on word2vec and distributional semantics.
- [CS224U information retrieval](/posts/ai/2026-09-29-cs224u-information-retrieval-en): the BM25 formula, IR metrics, and neural IR.
- [Hybrid search: BM25 + vectors + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en): BM25 inside a real RAG retrieval system.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [W1_NLP_brief.pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf) (in English and Chinese)
- [W1_NLP_brief_v2.pdf (Fall 2026)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W1_NLP_brief_v2.pdf) (in English and Chinese)
- [2025 README: Fall 2025 weekly table](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 Week 1 Tue. recording](https://www.youtube.com/live/X7XJcm9wfFA) (in Mandarin)
- [Fall 2025 Week 1 Thu. recording](https://www.youtube.com/live/0hTqSpoNp4o) (in Mandarin)
- [Bengio et al. 2003, A Neural Probabilistic Language Model](http://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf)
- [Porter Stemming Algorithm](http://www.tartarus.org/~martin/PorterStemmer/)
- [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/projects/glove/)
- [fastText](https://fasttext.cc/)
- [Leonie Monigatti, 37 Things I Learned About Information Retrieval](https://www.leoniemonigatti.com/blog/what_i_learned.html)
