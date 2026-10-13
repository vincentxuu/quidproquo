---
title: "From Languages to Information: An NLP Intro That Teaches Both tf-idf and LLMs | Stanford CS124 Course Overview"
date: 2026-08-21
category: ai
type: guide
tags: [cs124, ai-course, stanford, nlp, retrieval, llm]
lang: en
series:
  name: "Reading Stanford CS124"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 8
tldr: "CS124 is the first course in Stanford's NLP track: ten weeks from tokenization, n-grams, text classification, information retrieval and embeddings to LLMs and Transformers. The textbook is the free Speech and Language Processing, and the nine assignment repos plus the lab problems and solutions are public; the pre-recorded videos, quizzes and autograding need a Stanford account."
description: "Series overview for Stanford CS124: From Languages to Information: the course's main thread, what each of the ten weeks teaches and which assignment goes with it, a bigram example you can work by hand, prerequisites with a self-check, grading, what readers outside Stanford can get, and two reading routes. Based on the Winter 2026 course site, the public assignment repos and the textbook site."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

> **Source year**: the schedule, assignments and grading follow the Winter 2026 course site. The course homepage says CS124 will not be taught in the 2026–27 academic year, so this is the latest version for a while. This post is the entry point of the [Reading Stanford CS124](/en/series/stanford-cs124) series.

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/) is the introductory natural language processing course in Stanford's CS department, taught by [Dan Jurafsky](https://web.stanford.edu/~jurafsky/) and cross-listed in Linguistics (LINGUIST 180/280). On the [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en) it is the first cell of the NLP branch, with graduate courses such as [CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) and [CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) after it.

This post answers six questions: what the course's main thread is, what each of the ten weeks teaches, what you need to know first, how grades work, what readers outside Stanford can get, and in what order to read the ten weekly posts.

## The main thread

The course is called "From Languages to Information." The words people write, the things they say and the links between them are not something a computer can calculate with directly. For ten weeks the course does one thing: **turn them into representations you can count, rank and predict.**

- Once text is cut into tokens, you can count them and compute probabilities.
- Once a document is a feature vector, you can classify it.
- Once a query is a vector, you can compare it with every document and rank the results.
- Once a word is a vector with a few hundred dimensions, "similar meaning" becomes "vectors pointing in a similar direction."
- Once user ratings are laid out as a matrix, you can recommend; once the links between web pages are drawn as a graph, you can compute which pages matter.

LLMs sit in the middle of the course, not at the start. The Week 1 [introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) break an LLM into components: BPE tokenization, logistic regression, word embeddings, neural networks, attention, sampling, the language-modeling loss, RAG. Put that list next to the schedule and each component has a week of its own:

| LLM component | Week |
|---|---|
| How text is cut into tokens (BPE) | Week 2 |
| A probability model that predicts the next token | Week 2 (n-grams) |
| Output probabilities and loss (sigmoid/softmax, cross-entropy) | Week 3 |
| How outside data gets looked up (the retrieval half of RAG) | Week 4 |
| How tokens become vectors | Week 5 |
| Multi-layer networks and backpropagation | Week 6 |
| Attention, sampling and perplexity | Week 7 |

So the course suits two kinds of readers: people who have not studied NLP and want to go through it from the beginning, and people who already use LLMs but cannot say what the tokenizer, the embeddings and attention each do.

## What each week teaches

| Week | Topic | Assigned reading | Programming assignment | Post |
|---|---|---|---|---|
| 1 | Introduction, environment setup | — | PA0 Jupyter | [Week 1](/posts/ai/2026-08-22-cs124-week1-introduction-en) |
| 2 | Tokenization and BPE, edit distance, n-gram language models | SLP Ch. 2, 3 | PA1 regular expressions and BPE | [Week 2](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en) |
| 3 | Logistic regression and text classification | SLP Ch. 4 | PA2 logistic regression | [Week 3](/posts/ai/2026-08-22-cs124-week3-logistic-regression-en) |
| 4 | Information retrieval and RAG | SLP Ch. 11 | PA3 information retrieval | [Week 4](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en) |
| 5 | Embeddings, computational social science | SLP Ch. 5, 10 | PA4 embeddings | [Week 5](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en) |
| 6 | Neural networks, LLMs and Transformers | SLP Ch. 6 | PA5 neural networks | [Week 6](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms-en) |
| 7 | Implementing a Transformer, speech processing | SLP Ch. 7, 8 | PA6a Transformers | [Week 7](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en) |
| 8 | Speech synthesis and recognition, Git collaboration | SLP Ch. 14, 15 | PA6b speech | [Week 8](/posts/ai/2026-08-22-cs124-week8-speech-git-en) |
| 9 | Collaborative filtering, LLM agents | [*Mining of Massive Datasets*](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) Ch. 9 | PA7 Agent | [Week 9](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en) |
| 10 | PageRank and social networks | *Introduction to Information Retrieval* Ch. 21, [*Networks, Crowds, and Markets*](https://www.cs.cornell.edu/home/kleinber/networks-book/) | — | [Week 10](/posts/ai/2026-08-22-cs124-week10-pagerank-networks-en) |

SLP is the course textbook, *Speech and Language Processing*. Chapter numbers follow the August 2025 release that the syllabus uses; "Which edition of the textbook to read" below explains why that matters.

The ten weeks fall into four parts.

### Weeks 2–4: turning text into things you can count

In these three weeks the representations are chosen by people, and all of them can be worked out on paper.

**Week 2** starts with the unit the model sees. English can be split on spaces, Chinese has no spaces, and new words never stop appearing, so the current practice is BPE: start from characters and repeatedly merge the most frequent adjacent pair into a new unit. Common words end up as one token and rare words are split into known pieces. The same week teaches two more things. Edit distance uses dynamic programming to count how many edits separate two strings (spelling correction and speech-recognition error rates both rely on it). An n-gram language model estimates the probability of the next word from the one or two words before it.

**Week 3** teaches logistic regression. Turn a document into a feature vector (for example, how many times each word appears), multiply by weights, sum, pass the result through a sigmoid, and you get the probability that this is a positive review. Cross-entropy measures how wrong the prediction was, and gradient descent adjusts the weights. This looks like the week furthest from LLMs, but every time a language model predicts a token it performs a classification with as many classes as the vocabulary, using the same loss and the same kind of update.

**Week 4** teaches search. An inverted index records which documents each word appears in, so a query does not have to scan every document. Ranking uses tf-idf: the more often a word appears in this document and the rarer it is across the collection, the higher its weight. With the query and the documents both turned into vectors, cosine similarity gives the ranking. The textbook chapter is titled "Information Retrieval and Retrieval-Augmented Generation," and the first half of RAG is this retrieval pipeline.

### Weeks 5–7: learned representations, all the way to the Transformer

**Week 5** is the turning point. Up to here people picked the features; from this week on the data learns them. The starting point is one hypothesis: words that appear in similar contexts have similar meanings. Following it, you can count which words tend to appear near each word, or train a small model to predict the context (word2vec). Either way you get a vector for every word. In the same week Jurafsky gives a live lecture on computational social science, which was not recorded, and its slides need a Stanford login.

**Week 6** stacks Week 3's logistic regression into layers. A neuron is still a weighted sum followed by a nonlinear function. The difference is the hidden layers in between, which let the representation itself change during training. Backpropagation uses the chain rule to pass the gradient from the output back through each layer. This week's live lecture, "LLMs and Transformers!", sorts language models into three architectures: decoder, encoder and encoder-decoder.

**Week 7** has you write a Transformer. PA6a asks you to implement causal self-attention in `model.py` (each position can see itself and the tokens to its left, and nothing after it), train a small model on Shakespeare, then sample at different temperatures and compute perplexity. It is the first assignment of the term that is not written in a Jupyter notebook.

### Weeks 7–8: speech

Week 7 has a live lecture on speech processing. It was not recorded, and its slides are public; the Week 7 and Week 8 posts follow them through how speech recognition is evaluated, how sound becomes model input, and the Whisper architecture. The assignment is PA6b in Week 8: send a set of sentences (the ones your PA6a model generated, or the file that ships with the repo if you skipped PA6a) through speech synthesis to get audio, send the audio through speech recognition to get text back, and compare what was lost along the way. Then run the same pipeline on a real recording with an accent or with pauses.

### Weeks 9–10: people and links

In the last two weeks the data becomes people's behavior and connections. The collaborative filtering and PageRank taught in the pre-recorded material are not neural networks; they work on matrices and graphs.

**Week 9** teaches collaborative filtering. It ignores what a movie is about and looks only at the ratings matrix: two movies are similar when the same people rate them alike, and the movies a user has rated are used to estimate ones they have not seen. PA7 wraps that recommender as a tool and hands it to an LLM agent that makes tool calls, with web search and memory added.

**Week 10** treats the web as a directed graph. The idea behind PageRank is that a page linked from important pages is itself important, and the scores are computed by repeated iteration. The social-network part teaches several ways to measure a node's position: degree, betweenness and the clustering coefficient. The [slides for the final live lecture](https://web.stanford.edu/class/cs124/lec/final124_26.pdf) cover what comes after pretraining: preference alignment, interpretability and emergent misalignment, plus a section on machine translation, and they end with which courses to take after this one.

## An example: the kind of thing the course asks you to compute

This is an example written for this post, to show Week 2's bigram language model. The numbers are small enough to do in your head.

The training corpus has three sentences. `<s>` and `</s>` mark the start and the end of a sentence:

```
<s> I like climbing </s>
<s> I like coffee </s>
<s> you like climbing </s>
```

A bigram model assumes each word depends only on the word before it, and the probability is a ratio of counts: P(next | previous) = the number of times "previous next" appears together ÷ the number of times "previous" appears.

| Probability | How to count it | Result |
|---|---|---|
| P(I \| `<s>`) | Two of the three sentences start with "I" | 2/3 |
| P(you \| `<s>`) | One of the three sentences starts with "you" | 1/3 |
| P(like \| I) | "I" appears twice, followed by "like" both times | 1 |
| P(like \| you) | "you" appears once, followed by "like" | 1 |
| P(climbing \| like) | "like" appears 3 times, followed by "climbing" twice | 2/3 |
| P(coffee \| like) | "like" appears 3 times, followed by "coffee" once | 1/3 |
| P(`</s>` \| climbing), P(`</s>` \| coffee) | Both words are always followed by the end of the sentence | 1 |

The probability of a whole sentence is the product of the steps. "I like climbing" is 2/3 × 1 × 2/3 × 1 = 4/9.

The table shows two things.

First, **the model gives probability to sentences it has never seen**. "you like coffee" is not in the corpus, but every step of it appears in some other sentence: 1/3 × 1 × 1/3 × 1 = 1/9. A language model learns how words follow one another. It does not memorize sentences.

Second, **an unseen pair sends the whole sentence to zero**. "like" is never followed by "you" in the corpus, so P(you | like) = 0, and "I like you" gets probability 0 even though it is a perfectly ordinary sentence. The smoothing taught in Week 2 handles this by moving a little probability from the pairs that were seen to the ones that were not.

Today's LLMs still take the preceding text and output a probability distribution over the next token. The difference is that they do not look up a table of counts. They compute the distribution with the vectors, neural networks and attention taught in Weeks 5 to 7, which lets them use a much longer context and lets contexts with similar meanings share statistics.

**Self-check**: with the same corpus, compute the probability of "you like climbing." The answer is 1/3 × 1 × 2/3 × 1 = 2/9. If you can also say why it is higher than "you like coffee" (in the corpus, "like" is followed by "climbing" twice as often as by "coffee"), the Week 2 reading will not stop you.

## Prerequisites

The course site lists four:

| Prerequisite | Where it is used | On this site |
|---|---|---|
| CS106B (data structures) | Dictionaries, indexes and matrix operations in the assignments | — |
| Python (at the level of CS106A) | Every assignment is in Python | — |
| CS109 (probability) | Conditional probability, the chain rule and maximum likelihood estimation, from Week 2 on | [CS109 course overview](/posts/learning/2026-08-21-stanford-cs109-probability-en) |
| UNIX and programming maturity at the level of CS107 | The terminal, conda environments, Git; from Week 7 the assignments are multi-file projects | [CS107 course overview](/posts/learning/2026-08-21-stanford-cs107-computer-systems-en) |

The course number is in the 100s, but CS107 and CS109 are both required. The course site explains that in earlier years the two were optional, and they became required after students said it would have helped to take them first. CS107 may be taken concurrently. If UNIX is the only gap, you do not need all of CS107: the FAQ links a [list of UNIX videos from an older CS107](https://web.stanford.edu/class/archive/cs/cs107/cs107.1186/unixref/) and names the segments to watch, on logging in, the file system, common commands, the shell and Vim.

How to tell whether you are ready:

1. **Probability**: you can work the bigram example above and say why the probability of a sentence is the product of the steps.
2. **Python**: you can read a text file, count how often each word appears with a dictionary, and print the top ten.
3. **UNIX**: you can create a conda environment in a terminal, clone a repo and start a Jupyter notebook without looking up the commands.

If all three are fine, start at Week 2. If the first one stops you, read the CS109 lecture on [conditional probability](/posts/learning/2026-08-22-stanford-cs109-lecture-02-conditional-probability-en) first. If the third one stops you, finish [PA0](https://github.com/cs124/pa0-jupyter-tutorial) first.

## Class format and grading

CS124 is a flipped class. In most weeks you watch two to two and a half hours of pre-recorded video, read the assigned chapters, go to a live lecture or a lab on Tuesday, take a review quiz and hand in a programming assignment. The ten Tuesdays hold five live lectures (Weeks 1, 5, 6, 7 and 10) and five labs. None of the live sessions are recorded, and attendance is required on six of the days.

There is no midterm and no final exam. The last requirement is PA7.

| Item | Weight |
|---|---|
| Attendance | 3% |
| Assignments and quizzes | 97%, of which assignments are 73% and quizzes 27% |

Within the 73 points for assignments, PA1 to PA6 are worth 9 each, PA7 is worth 18 and PA0 is worth 1. There are nine quizzes. They are open-book, can be retaken, and the best eight count. PA0 to PA6 share four free late days.

The starter code for all nine assignments is in public GitHub repos, all in Python:

| Assignment | Content | Starter code |
|---|---|---|
| PA0 | Environment setup and Jupyter tutorial | [pa0-jupyter-tutorial](https://github.com/cs124/pa0-jupyter-tutorial) |
| PA1 | Regular expressions and BPE tokenization | [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) |
| PA2 | Logistic regression and text classification | [pa2-logistic-regression](https://github.com/cs124/pa2-logistic-regression) |
| PA3 | Information retrieval | [pa3-information-retrieval](https://github.com/cs124/pa3-information-retrieval) |
| PA4 | Embeddings | [pa4-embeddings](https://github.com/cs124/pa4-embeddings) |
| PA5 | Neural networks | [pa5-neural-networks](https://github.com/cs124/pa5-neural-networks) |
| PA6a | Transformers | [pa6a-transformers](https://github.com/cs124/pa6a-transformers) |
| PA6b | Speech synthesis and recognition | [pa6b-speech](https://github.com/cs124/pa6b-speech) |
| PA7 | Collaborative filtering plus an LLM agent | [pa7-agent](https://github.com/cs124/pa7-agent) |

PA7 differs from the earlier ones. PA1 to PA6 can be done alone or in pairs. PA7 requires a team of three or four, is worth twice as much as the others, and cannot use late days. It has two parts: implement collaborative filtering to recommend movies, then build an LLM agent that makes tool calls, with web search and memory.

Self-learners should know that two assignments need accounts with outside services. PA7 needs your own Together AI and SerpAPI keys: the README warns that you may have to add payment information to create the Together AI key, and SerpAPI's free account comes with 250 searches. PA6b needs a Cartesia account for speech synthesis and recognition, and its README says the free account is enough to finish the assignment. Check each service's own page for current limits and prices.

The course's rule on LLMs is in the honor code: you may use a language model the way you would use a TA, to improve your understanding, and you may not paste LLM-generated code into an assignment.

## Which edition of the textbook to read

Almost all the assigned reading comes from one book: [*Speech and Language Processing*, third edition](https://web.stanford.edu/~jurafsky/slp3/), by Jurafsky and James H. Martin. The whole book is free online as per-chapter PDFs, with no registration. For self-learners it is the most complete public material the course has, and most of what the pre-recorded videos cover can be read here.

The thing to watch is the edition. The syllabus's chapter numbers refer to the August 2025 release, while the textbook site now serves the August 2026 release, which reordered the chapters. Following the syllabus links takes you to a different chapter:

| What the syllabus says | The file with that number in the main directory today |
|---|---|
| Ch. 7 Large Language Models | Transformers and Pretraining |
| Ch. 8 The Transformer | Post-training |
| Ch. 10 (supplementary reading for embeddings) | Interpretability |
| Ch. 14 Phonetics | RNNs and LSTMs |
| Ch. 15 Automatic Speech Recognition | Phonetics and Speech Feature Extraction |

The older release is kept in full in the [`old_aug25/`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) directory. **When you read by the syllabus's chapter and page numbers, use the `old_aug25/` release.** For the latest text, go back to the main directory, keeping in mind that content has moved: the LLM material from the old Chapter 7 is now in Chapter 1, and the old Chapter 8 on Transformers was merged into the new Chapter 7.

## What readers outside Stanford can get

The course does not allow auditing, but the FAQ says plainly that people who are not enrolled are welcome to go through the material and do the assignments on their own, as long as they do not submit work or ask questions on the course forum.

**Available:**

- **The whole textbook.** Per-chapter PDFs and a combined version, both free.
- **Starter code for all nine assignments.** Every repo in the table above can be cloned.
- **Lab problems and solutions.** The problems for Labs 2 to 5 are in [cs124/labs](https://github.com/cs124/labs), with solutions for Labs 2, 3 and 5. The [Lab 1 slides](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf) are a public PDF in which each answer is on the slide after its question.
- **Most slides.** The slides for the pre-recorded topics (tokenization, edit distance, n-grams, logistic regression, information retrieval, embeddings, neural networks, collaborative filtering, link analysis, social networks) and for four of the live lectures (introduction, LLMs and Transformers, speech, final) are linked from the [schedule on the course homepage](https://web.stanford.edu/class/cs124/), as both PDF and pptx.

**Not available:**

- **The pre-recorded videos.** They are on Canvas, which needs a Stanford account.
- **The live lectures and labs themselves.** None of the ten sessions are recorded. You get the slides only.
- **The slides for the computational social science lecture.** It is the only one of the five live lectures whose slides need a Stanford login.
- **Quizzes and autograding.** Both are on Gradescope and need an enrolled account. After you finish an assignment, nothing checks your answers except the public tests that ship with the repo.

On YouTube there is a [From Languages to Information channel](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) with a full set of CS124 recordings, and the FAQ encourages people to watch it. Those recordings follow an earlier syllabus. They include topics the course no longer teaches (Naive Bayes, part-of-speech tagging, chatbots) and lack LLMs and Transformers, speech and agents. You can watch them alongside tokenization, edit distance, n-grams, logistic regression, information retrieval, embeddings, neural networks, recommender systems, PageRank and social networks. For the three missing parts you rely on the slides, the textbook and the assignments.

## Two ways to read

**Start to finish.** Go down the weekly table one row at a time: read that week's assigned chapters, look at the slides, read this site's post for the week, and do that assignment. The assignments for Weeks 2 to 6 are all in notebooks, with numbers small enough to check by hand. Only from Week 7 do you need more compute time and paid APIs. In the weeks whose labs have public solutions (Weeks 2, 3, 4 and 9), do the problems yourself before checking.

**Pick weeks by purpose.** If you already have a machine learning background, read only what you need:

- **Building RAG or search**: [Week 4](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en), then the vector-similarity part of [Week 5](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en). Understand tf-idf first, as a baseline you can compute by hand, and you will know what changed when you move to vector retrieval.
- **Understanding what is inside an LLM**: BPE and n-grams in [Week 2](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en), then [Week 6](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms-en) and [Week 7](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en), then do PA6a.
- **Building an agent**: [Week 9](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en). PA7 shows how to wrap a deterministic function as a tool and how to test a system whose output differs a little on every run.
- **Building speech products**: [Week 8](/posts/ai/2026-08-22-cs124-week8-speech-git-en), together with edit distance from Week 2 (word error rate is computed with it).
- **Recommendation or graph analysis**: the first half of [Week 9](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en) and [Week 10](/posts/ai/2026-08-22-cs124-week10-pagerank-networks-en).

To decide which route is yours, look at Week 3. If you can write the logistic regression loss without looking it up and say why the gradient is "the prediction minus the true label, times the input features," pick weeks by purpose. If you cannot, start at Week 2 and go in order.

For where to go afterwards, the Week 1 slides give directions too:

| Direction | Next course |
|---|---|
| Neural networks for NLP | [CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) |
| Training a language model from scratch | [CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) |
| Natural language understanding | [CS224U](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) |
| Conversational assistants and agents | [CS224V](/posts/ai/2026-08-21-stanford-cs224v-agentic-ai-en) |
| Machine learning on graphs | [CS224W](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs-en) |

## What you can do tonight

1. Do the bigram self-check above and confirm the probability part is fine.
2. Read the section on BPE in [`old_aug25/2.pdf`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf) (Words and Tokens), then clone [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) and get the BPE exercise working. That is one part of the Week 2 assignment, and it fits in one evening.
3. If the environment will not install, finish PA0 first, then open the [Lab 1 slides](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf) first. They are pure UNIX text-processing exercises. Come back to PA1 once those go smoothly.

**Series navigation**: next, [Introduction and Setup: Turning Language Problems into Computable Components](/posts/ai/2026-08-22-cs124-week1-introduction-en)

## Course video sources

The official Winter 2026 course page (read live on 2026-10-10) says the pre-recorded videos are in Canvas Modules (course 186110); opening it redirected me to the Stanford login page, confirming the sign-in wall, and the five live lectures and five labs are explicitly "not recorded". The From Languages to Information YouTube channel has an 80-video "CS124 - Full Course" playlist, but its weekly titles (for example Week 2: Naive Bayes, Week 6: Chatbots and Dialogue Agents) do not match the Winter 2026 syllabus, so it is not treated as the current term’s recordings and nothing is embedded.

Course and recording entries:

- [From Languages to Information YouTube channel](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA)
- [Official course / lecture source](https://web.stanford.edu/class/cs124/)

Checked: 2026-10-10.

## Update Log

- 2026-10-13: Rewrote the post as a course overview. Added the main thread, what each of the ten weeks teaches, a hand-worked bigram example, a prerequisite self-check and two reading routes; the earlier account of the course-research process (the history of the prerequisite line, archive-directory comparisons, enrollment numbers and so on) was moved out of the body.
- 2026-10-10: Rechecked video status. The official page says the pre-recorded videos are in Canvas and opening it confirmed the sign-in wall; the YouTube channel’s weekly titles do not match the Winter 2026 syllabus, so nothing is embedded and the status is now sign-in required.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS124: From Languages to Information (Winter 2026 course site)](https://web.stanford.edu/class/cs124/) — prerequisites, schedule, grade weights, auditing and self-study rules, honor code
- [CS124 Week 1 introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) — the list of LLM components and the follow-on courses
- [CS124 final lecture slides](https://web.stanford.edu/class/cs124/lec/final124_26.pdf) — outline of the last live lecture
- [Speech and Language Processing, third edition](https://web.stanford.edu/~jurafsky/slp3/) — the current release of the textbook
- [SLP3 `old_aug25/` directory](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — the August 2025 release that the syllabus's chapter numbers refer to
- [cs124/pa7-agent](https://github.com/cs124/pa7-agent) — PA7's team rule, two-part structure and API key requirements
- [cs124/pa6a-transformers](https://github.com/cs124/pa6a-transformers) — what PA6a asks you to implement
- [cs124/pa6b-speech](https://github.com/cs124/pa6b-speech) — the PA6b pipeline and the Cartesia account requirement
- [cs124/pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) — the Week 2 assignment
- [cs124/labs](https://github.com/cs124/labs) — lab problems and solutions
- [From Languages to Information YouTube channel](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) — public recordings of an earlier syllabus
- [Mining of Massive Datasets, Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) — the assigned reading for Week 9's collaborative filtering
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/) — the assigned reading for Week 10's social networks
- [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en) — where CS124 sits among the main-line courses
