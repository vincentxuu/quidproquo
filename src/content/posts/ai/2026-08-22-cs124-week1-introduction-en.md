---
title: "CS124 Week 1 Introduction and Setup: Turning Language Problems into Computable Components"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, llm, ai-course]
lang: en
series:
  name: "Reading Stanford CS124"
  order: 2
tldr: "CS124 Winter 2026 opens by mapping a ten-week path from tokenization and classification to retrieval, speech, networks, and LLMs, while PA0 establishes the Jupyter environment used throughout the quarter."
description: "A week-by-week reading of Stanford CS124 Winter 2026 Week 1: scope, flipped-classroom design, the NLP component map, and PA0 setup."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week1-introduction)

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/lec/) begins with a map, not a Transformer crash course. Dan Jurafsky's January 6 Introduction arranges the quarter as an engineering chain: decide how text becomes tokens, then study classification, retrieval, and representations before moving into neural networks, Transformers, speech, recommendation, and network analysis. The governing idea is that an LLM is a system assembled from learnable components, not a black box that appears fully formed.

**Course version:** CS124 / LINGUIST 180, Winter 2026. **Official unit:** Week 1, January 6 and 8. **Instructor:** Dan Jurafsky, with a separate Jupyter/PA0 tutorial on January 8. **Public materials:** the [schedule and syllabus](https://web.stanford.edu/class/cs124/lec/), [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf), and [PA0 repository](https://github.com/cs124/pa0-jupyter-tutorial). **Public-material gap:** the live Introduction was not recorded, and the platform-specific setup videos require Stanford Canvas access. This article therefore does not reconstruct live discussion.

## One course, several kinds of information

The official [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) list BPE tokenization, logistic regression, embeddings, neural networks, attention, sampling, language-model loss, and RAG alongside information retrieval, recommendation, speech recognition, social networks, and ethical issues. Their common problem is representation: turning language and relationships into objects a machine can rank, predict, or generate.

That is why the course is called “From Languages to Information,” not simply “Introduction to LLMs.” Text becomes token sequences; documents become feature vectors; queries become ranking problems; speech becomes transcripts; social links become graphs. LLMs are a major destination on this route, but not the only one.

The [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) describe CS124 as a broad undergraduate gateway to courses including CS224N, CS224U, CS224V, CS224S, CS224W, CS246, CS276, and CS336. This does not mean one quarter replaces them. It tells students where each unit leads: retrieval toward CS276, social NLP toward CS224C and CS329R, model construction toward CS224N and CS336, and the final graph unit toward CS224W.

## Why the official unit is a week

The Winter 2026 [schedule and syllabus](https://web.stanford.edu/class/cs124/lec/) define CS124 as a flipped class in which a typical week includes roughly two to two-and-a-half hours of prerecorded material, a Tuesday lecture or lab, assigned reading, a review quiz, and a programming assignment. The schedule binds those activities into one agenda. That makes a week—not an isolated 80-minute meeting—the smallest faithful unit for this series.

Week 1 pairs the course map with a Thursday tutorial on Jupyter and PA0. One answers where the course is going; the other establishes whether the student's machine can execute the work. Deferring setup until PA1 would turn time intended for tokenization and BPE into debugging shell, conda, or notebook issues.

## PA0 is the quarter's execution layer

The [PA0 repository](https://github.com/cs124/pa0-jupyter-tutorial) establishes the Python/conda environment and the notebook workflow reused by later assignments. The [schedule](https://web.stanford.edu/class/cs124/lec/) makes it due January 9, before any NLP algorithm assignment. This is deliberate: the prerequisites include Python and UNIX maturity comparable to CS107, but prior experience does not make every local environment identical.

The practical completion test for Week 1 is not memorizing a list of models. It is being able to clone PA0, launch a notebook, execute cells, and preserve the result. PA1 through PA4 repeat the same broad workflow, so PA0 is infrastructure rather than disposable warm-up work.

After PA0 succeeds, close the server and terminal, start a fresh shell, reactivate the environment, reopen the repository, and run every cell. Record Python and major package versions. Restarting the kernel and running all cells detects hidden notebook state created by out-of-order execution.

Also record the working directory, Python executable, and selected Jupyter kernel. An activated terminal does not guarantee that the notebook uses the same environment; this diagnostic separates a kernel mismatch from a missing package.

## Components before product names

The [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) say LLMs changed NLP, AI, retrieval, recommendation, and speech, yet the [schedule](https://web.stanford.edu/class/cs124/lec/) is not organized around vendors or model brands. It is organized around reusable mechanisms. Tokenization determines what the system can see; classification introduces prediction and loss; retrieval supplies external information; embeddings turn similarity into geometry; neural networks and Transformers connect these into learned representations.

For an independent learner, this design makes the public materials useful even without Canvas video access. Slides, readings, and assignments preserve the conceptual path. The limitation remains real: public files cannot preserve the live examples, discussion, and qualifications delivered in the room. Public algorithms are not the same thing as a complete recording of the class.

## A concrete Week 1 finish line

Write one sentence for each component in the Introduction slides stating its input and output. Then complete PA0 and relaunch the notebook once from a clean terminal. If that workflow is not stable, fix it before opening the Transformer readings. Week 1's lesson is procedural as much as conceptual: move infrastructure failures forward so later attention can stay on the model.

## How the assignments accumulate

The [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) map algorithms to programming assignments: PA1 handles BPE tokenization, PA2 logistic regression, PA3 retrieval, PA4 embeddings, PA5 neural networks, PA6 Transformers and speech, and PA7 collaborative filtering plus an agent. These are not isolated notebooks. The abstraction level changes across the quarter.

Early assignments expose count tables, feature vectors, indexes, and similarity scores in small examples. PA6 moves to PyTorch and a multi-file project; PA7 adds a team and metered external services. A student who preserves only final autograder output will have little evidence for deciding whether a later failure belongs to data, model code, a tool wrapper, or an API.

Week 1 is therefore the right time to choose a common experiment record: one input, the important intermediate representation, expected output, and a known failure. Save a merge table for PA1, feature weights for PA2, query-document scores for PA3, and nearest neighbors for PA4. The same interface becomes useful when PA7 tools need inspection.

## What the assessment design values

The official [syllabus](https://web.stanford.edu/class/cs124/lec/) has no midterm or final exam; PA7 is the last requirement. Programming assignments and weekly review quizzes dominate assessment. The quizzes are open-note and open-book and allow repeated attempts, with answers withheld until the deadline. That creates a weekly reading, retrieval, lab, and implementation rhythm rather than a single final recall event.

Independent learners cannot access the Gradescope pool. They may write five self-check questions per week, but those must be labeled as self-authored exercises rather than “the CS124 quiz.” Labs likewise belong to the assessed agenda. Public solutions should be opened only after attempting the problems; otherwise problem solving becomes solution reading.

## Prerequisites inside Week 1

The official [prerequisite section](https://web.stanford.edu/class/cs124/lec/) expects CS106B, Python at the CS106A level, CS109 probability, and UNIX maturity comparable to CS107. PA0 confirms an execution environment; it does not replace courses in data structures, probability, or systems tools.

The [Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) use “starts from scratch” to mean building NLP components from their basics, not beginning programming from zero. A concrete readiness check is to create an environment, clone a repository, launch Jupyter from a terminal, count text with a Python dictionary, and compute a simple conditional probability. The step that fails identifies the gap more reliably than a remembered course number.

## Public self-study is not formal enrollment

The FAQ encourages non-enrolled learners to use public materials and assignments while not asking TAs for support or grading. Public starter code does not make hidden tests, rubrics, feedback, or live activities public. For each assignment, distinguish “the program ran,” “public tests passed,” and “equivalent to formal grading.” The first cannot prove the third.

Independent study can still preserve artifacts that a deadline-driven student might discard: repeated runs, failure notebooks, and a ten-week portfolio. The best Week 1 output is therefore an evidence structure, not merely a viewing schedule.

## Further study

For the broader course, prerequisites, and source-access audit, see the [existing CS124 overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). This article covers only Winter 2026 Week 1 and does not import older public recordings.

## References

- [CS124 Winter 2026 schedule and syllabus](https://web.stanford.edu/class/cs124/lec/)
- [CS124 Week 1 Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf)
- [CS124 PA0 Jupyter Tutorial](https://github.com/cs124/pa0-jupyter-tutorial)
- [Speech and Language Processing, 3rd edition](https://web.stanford.edu/~jurafsky/slp3/)
- [Complete Stanford CS124 course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)
