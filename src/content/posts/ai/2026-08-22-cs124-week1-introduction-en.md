---
title: "Introduction and Setup: Turning Language Problems into Computable Components | Stanford CS124 Week 1"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, llm, ai-course]
lang: en
series:
  name: "Reading Stanford CS124"
  order: 2
tldr: "Week 1 has no algorithms. The live introduction explains what the course teaches: which week covers each component of an LLM, which language algorithms outside LLMs are also taught, and why language is hard. PA0 sets up the Python and Jupyter environment the later assignments use."
description: "A guide to Stanford CS124 Winter 2026 Week 1: how the introduction slides define the scope of the course, the mapping from LLM components to assignments, an example of ambiguity (The chef made her duck), the reasons for the flipped classroom and mastery learning, how to choose between CS124 and CS224N, and the four parts of PA0. Based on the public slides and the PA0 repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week1-introduction)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

This is Week 1 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). The week has no algorithms and does two things: Dan Jurafsky's live introduction explains what the course teaches, and PA0 sets up the environment.

The introduction was not recorded, and its [slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) are public. Prerequisites, grading and access to materials are already covered in the [course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en), so this post is only about the content of the introduction itself.

## What the course teaches

The slides position it in one sentence: the rise of LLMs has completely changed natural language processing, information retrieval, recommendation systems and speech recognition, and this class **starts from scratch** and builds up how LLMs work and how they are applied.

The content falls into three blocks.

**The algorithmic components of LLMs.** The slides map each component to an assignment:

| Component | Assignment |
|---|---|
| BPE tokenization | PA1 |
| Logistic regression | PA2 |
| Word embeddings | PA4 |
| Neural networks, gradient descent and backpropagation | PA5 |
| Transformers, the language modeling loss | PA6 |
| Convolutional networks | Speech, in Week 8 |

**Other crucial language algorithms.** These are not inside an LLM but always come up when working with language data: regular expressions, minimum edit distance, information retrieval and web search, PageRank and network analysis, and collaborative filtering.

**LLMs and society.** This goes in two directions. One is the problems of LLMs themselves, of which the slides list four: they hallucinate, they are overconfident, they are sycophantic, and they display stereotypes about every group. The other turns it around and uses these tools to study society, which is computational social science.

## Some previews

The slides then pick one example from each of several weeks. Each shows what problem its topic is meant to solve.

**Information retrieval.** The slides call web search probably the most frequently used algorithm in the history of the planet, with more than 6.5 billion searches every day. The course teaches classic tf-idf, modern dense retrieval, and RAG with an LLM.

**Edit distance.** Comparing two DNA sequences to see where they agree and differ is a basic tool for finding genes and studying evolution. The same algorithm is used to evaluate speech recognition output.

**Text classification.** After the 2010 Haiti earthquake, responders received huge numbers of SMS messages, many in Haitian Creole. The slides' example is one message: "I am in Thomassin number 32, in the area named Pyron. I would like to have some water. Thank God we are fine, but we desperately need water." Picking out which of thousands of messages need immediate action is a classification problem, and it is the task in PA2.

**Recommendation engines.** The good side is "if you bought this…". The dark side is a recommendation system leading people step by step toward extreme content.

**Computational social science.** From Jurafsky's own research: an analysis of 900,000 Yelp restaurant reviews. The language of one-star reviews is past tense, heavy use of "we," and narratives about people (the waitress, the manager) and not about the food. Those are the same linguistic features psychologists find in trauma narratives: past tense for distancing and "we" for seeking solace in community. The conclusion is that bad reviews are almost all about personal interaction. Another example analyzes speech from police body-worn cameras to quantify how officers and community members interact.

## Why language is hard: ambiguity

The slides use one sentence to show the central difficulty of language processing:

> The chef made her duck.

It has at least half a dozen meanings. In class the students vote on the ones they come up with, and the slides list, among others:

- The cook cooked waterfowl for another woman to eat.
- The cook cooked waterfowl belonging to that woman.
- The cook cooked waterfowl belonging to the cook.
- The cook created the (plaster?) waterfowl that the woman owns.
- The cook caused the woman to quickly lower her head or body.

The ambiguity comes from several places: `duck` can be a noun (the bird) or a verb (to lower your head), `her` can be possessive or an object, and `made` can mean cooked, created or caused.

A person reading the sentence usually thinks of one meaning and never notices the others. The slides say language is ambiguous everywhere, that language users often do not even notice, and that language models have to resolve it efficiently.

The next question is how a model represents these differences. The slides preview the answer from Week 5: represent a word's meaning as a position in a high-dimensional space. The same word lands in different places in different sentences, and the senses are not two or three distinct ones but a continuum.

## Why a flipped classroom

The slides spend several pages on the reasoning behind the class format, citing the **mastery learning** proposed by Benjamin Bloom in 1968: learn until you have mastered the material, instead of learning whatever fits into a fixed amount of time.

That explains several features of the course:

- Lectures are pre-recorded, so students can watch and rewatch at their own pace.
- The weekly review quizzes are open-book and can be retaken. Their purpose is to confirm that you have learned the material, not to rank you.
- Classroom time goes to labs.

## CS124 or CS224N

One slide answers exactly this question.

**CS124** is designed for sophomores and juniors:

- It is gentle and explains everything. It is broad, covering recommendation engines, IR and social networks as well as NLP and LLMs.
- It uses mastery learning, with quizzes and programming assignments that come with starter code and scaffolding.
- It has no research project.

**CS224N** is a deeper, more focused graduate course:

- It assumes you are very familiar with machine learning, and the first homework goes straight into optimization.
- It puts more weight on systems, implementation and scaling.
- A research project is a large component.

The slides call CS124 the broad undergraduate introduction to "at least 12 grad classes," including CS224N (NLP with deep learning), CS224U (natural language understanding), CS224V (conversational assistants), CS224S (spoken language processing), CS224W (graph neural networks), CS246 (mining massive data sets), CS276 (information retrieval) and CS336 (language modeling from scratch). The ones with guides on this site are listed in the [course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en#two-ways-to-read).

## PA0: setting up the environment

**[PA0](https://github.com/cs124/pa0-jupyter-tutorial)** has no NLP content and four parts:

1. **Environment setup.** Follow the instructions for your operating system (macOS, Linux or Windows) in the `platform` directory.
2. **Jupyter tutorial.** Work through `jupyter_tutorial.ipynb`.
3. **Python tutorial.** `python_tutorial.ipynb`. The README recommends skimming it even if you are very comfortable with Python, because the later assignments assume you know everything in it.
4. **Submission.** Enrolled students upload to Gradescope. Self-learners skip this.

PA1 through PA5 all use the `cs124` conda environment created here and follow the same routine: clone the repo, activate the environment, open the notebook. From PA4 on, extra packages are installed, and from PA6a the work moves to `.py` files in an editor.

One check is worth doing once you finish: restart the notebook's kernel and run everything from top to bottom. The setup counts as done only if it all passes. Jupyter lets you run cells out of order, and a result that looks right on screen may depend on a cell you have since deleted.

## Self-check

1. Without looking at the table above, name three components of an LLM and the assignment in which each is implemented. Sample answer: BPE tokenization (PA1), word embeddings (PA4), the Transformer (PA6).
2. How many readings does "I saw her with the telescope" have? Answer: at least two. The telescope can go with the seeing (I used it to see her) or with her (she was holding it). This is the same kind of problem as "The chef made her duck": one string of words maps to different structures.
3. Is your PA0 environment really set up? The test: open a new terminal, activate the `cs124` environment, open `jupyter_tutorial.ipynb`, restart the kernel and run all cells with no errors.

**Series navigation**: previous, [Course Overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en) | next, [Week 2: Words, Tokens, Edit Distance, and N-grams](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en)

## Course video sources

The official Winter 2026 course page (read live on 2026-10-10) says the January 6 Introduction is a live lecture by Dan marked "required not recorded", and January 8 is a live tutorial. The only videos listed for this week are the PA0 Windows and Mac setup demos, which sit in Canvas (sign-in required) and are not lecture recordings. The "CS124 - Full Course" YouTube playlist uses weekly titles that differ from the Winter 2026 syllabus, so it is not treated as this term’s recording.

Course and recording entries:

- [Official course / lecture source](https://web.stanford.edu/class/cs124/)

Checked: 2026-10-10.

## Update Log

- 2026-10-13: Rewritten from the public slides. The post now follows the actual content of the introduction: the scope of the course, the preview examples, the ambiguity example, the reasons for the flipped classroom, and the comparison of CS124 and CS224N; removed advice about self-study record-keeping that was unrelated to the course content.
- 2026-10-10: Rechecked video status. The official page says the January 6 Introduction is a live lecture that is not recorded; the only video listed for the week is the PA0 setup demo (Canvas, sign-in required); the status is now checked, no recording listed.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [CS124 Week 1 introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) — the scope of the course, the mapping from components to assignments, the example topics, ambiguity, the flipped classroom, CS124 versus CS224N
- [CS124 PA0](https://github.com/cs124/pa0-jupyter-tutorial) — the four parts
- [Stanford CS124 course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)
