---
title: "CS221 Lecture 1: Overview: Defining Intelligence Under Resource Constraints"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 2
tldr: "Lecture 1 of Stanford CS221 Autumn 2025 develops operational representations and algorithmic intuition through Overview: Defining Intelligence Under Resource Constraints."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 1, following the official executable artifact, examples, and limitations."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-01-overview-intelligence-tensors)

This article covers **Stanford CS221, Autumn 2025, Lecture 1**, taught by Percy Liang and dated 2025-09-22. It reads only the three public executable artifacts: `welcome.py`, `history.py`, and `tensors.py`. The course entry point is the [official course site](https://stanford-cs221.github.io/autumn2025/), and the lecture trace is [welcome, history, tensors](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome). Canvas-only classroom interaction is not treated as evidence, and claims absent from these sources are not added.

## The lecture agenda

The order defines the agent's problem, examines historical representations and algorithms, then makes shapes and cost inspectable. CS221 asks how to represent a problem before asking how inference or learning should proceed.

## Welcome: intelligence is defined with capabilities and limits

`welcome.py` begins with familiar AI: ChatGPT, Claude, Gemini, and Grok; autonomous vehicles such as Waymo and Wayve; game-playing systems such as Deep Blue, AlphaGo, and AlphaStar; competition mathematics and programming through IMO, IOI, and ICPC; and AlphaFold's 3D protein structure prediction. Their differences motivate the question: what is AI? Artificial can mean running on a computer or robot, but intelligence cannot be reduced to “like a human.”

The artifact asks what an intelligent agent should be able to do. Its four ingredients are **perceive, reason, act, and learn**. Perceive processes raw inputs, including visual scene understanding, speech recognition, and natural-language understanding. Reason uses knowledge and percepts to draw inferences: uniform-cost search in a deterministic world, value iteration for uncertain decisions, minimax for adversarial games, and probabilistic inference in Bayesian networks. Act outputs actions that affect the world, including text/image generation, speech synthesis, and robot manipulation. Learn updates the agent from experience, including gradient descent, Q-learning in reinforcement learning, and expectation maximization for Bayesian networks.

The driving example puts the four abilities into one setting: interpret sensor input, reason with knowledge and percepts, produce driving actions, and update from experience. It is an organizing example, not a claim that self-driving is the only form of AI.

All four abilities operate under **resource constraints**. Computation includes running time, memory, and communication. Information includes data, experience, and the inputs available in a particular situation. The problem is therefore not simply whether an answer exists, but whether an agent can make a good-enough decision with available time, memory, communication, and data. The artifact's summary consequently points toward compute-efficient and data-efficient algorithms.

## Goals: what should the agent accomplish, and for whom?

Capabilities are not objectives. Agents encode values, goals, objectives, or utility functions, and alignment asks whether they match what the developer wants; the ChatGPT examples are being informative, avoiding hallucinations, and refusing harmful queries. Societal impact also matters: privacy, copyright, jobs, inequality, and geopolitics raise who “we” are, value tradeoffs, and unintended consequences in social media and education.

## Course philosophy and the executable lecture

The course combines timeless foundations, modern examples, and learning by building applications. Autumn 2025 is **tensor-native**, covers deep learning, value iteration, and Bayesian-network inference, removes constraint satisfaction problems, and goes deeper on copyright, supply chains, policy, and other societal impact. Policies, coursework, and schedule are on the [official site](https://stanford-cs221.github.io/autumn2025/). The material is an *executable lecture*: a loop adds 1, 2, and 3 to `total`, demonstrating code's hierarchy and precision and that building AI ultimately requires code.

## History: three traditions under resource constraints

### The Turing test

`history.py` opens with Alan Turing and his 1950 paper. Turing asked, “Can machines think?”, then reformulated the question as the more operational “How could you tell?” His answer was the Imitation Game, or Turing Test. Its significance is grounding a philosophical question in objective measurement while leaving possible solutions—machine learning or logic—open. The artifact does not call it a perfect or exclusive definition.

### Symbolic AI

In 1956, John McCarthy organized a workshop at Dartmouth College, bringing together thinkers such as Shannon and Minsky. The goal was a “significant advance” in two months, and the term “artificial intelligence” was coined there. Earlier examples include Arthur Samuel's 1952 checkers program, which learned weights and reached a strong amateur level, and Newell and Simon's 1955 Logic Theorist, which used search and heuristics to find a new proof for a theorem in *Principia Mathematica*.

The predictions were optimistic, but a machine-translation Russian round trip turned “The spirit is willing but the flesh is weak” into “The vodka is good but the meat is rotten.” The 1966 ALPAC report cut off government funding and produced the first AI winter; the artifact also records optimistic statements by Simon, Minsky, and Shannon.

The artifact separates limited computation from limited information. Search spaces grew exponentially beyond hardware, while AI had to represent the world's many words, objects, and concepts. Useful contributions remained: Lisp, garbage collection so memory need not be manually allocated and freed, and time-sharing so multiple people could use one computer.

Knowledge-based systems in the 1970s and 1980s addressed the gap with expert systems. They elicited domain-specific rules from experts. DENDRAL inferred molecular structure from mass spectrometry; MYCIN diagnosed blood infections and recommended antibiotics; XCON converted customer orders into parts specifications. Knowledge helped both information and computation gaps, and these were early real applications with industrial impact. But deterministic rules could not handle real-world uncertainty, and rules quickly became too complex to create and maintain. The collapse of Lisp machines in 1987 brought the second AI winter.

### Neural AI

The neural timeline begins in 1943 with McCulloch and Pitts, who connected artificial neural networks to neural circuitry and mathematical logic. Hebb's 1949 learning rule said “cells that fire together wire together.” Rosenblatt's 1958 Perceptron was a linear classifier, and Widrow and Hoff's 1959 ADALINE performed linear regression. Minsky and Papert's 1969 *Perceptrons* showed that linear models could not solve XOR, and neural-network research suffered.
Connectionism revived through Fukushima's 1980 Neocognitron, Rumelhart/Hinton/Williams's 1986 backpropagation, and LeCun's 1989 CNN work on USPS handwritten digits; neural networks were still difficult to train and unpopular in the 2000s.

The deep-learning milestones listed are 2006 unsupervised layerwise pretraining; 2009 neural networks outperforming Hidden Markov Models in speech recognition; 2012 AlexNet's large object-recognition gains; 2014 sequence-to-sequence modeling and Adam; 2015 attention; 2016 AlphaGo defeating Lee Sedol with deep reinforcement learning; and 2017 the Transformer architecture. This is the source's timeline, not an explanation that reduces each result to one cause.

### Statistical AI

Earlier ideas include Gauss and Legendre's linear regression, Fisher's linear classification, Robbins and Monro's stochastic gradient descent, Dijkstra's uniform-cost search, and Bellman's Markov decision processes (the source gives the years 1801, 1936, 1951, 1956, and 1957).

Statistical machine learning includes Pearl's 1985 Bayesian networks for reasoning under uncertainty; Cortes and Vapnik's 1995 support-vector machines, which became popular because they were easier to train and rooted in statistical learning theory; variational inference popularized by Jordan and Jaakkola in 1999; conditional random fields from Lafferty, McCallum, and Pereira in 2001 for predicting structures; and topic modeling from Blei, Ng, and Jordan in 2003 for hierarchies and parameter uncertainty.

## Foundation models, reasoning, and industrialization

### Pretrained language models

ELMo uses LSTMs for pretraining and then fine-tuning on downstream tasks; BERT uses a Transformer in the same pretraining/fine-tuning pattern; Google's T5 (11B) casts everything as text-to-text. The artifact links the papers and includes an image for T5.

### Scaling up

GPT-2 produces fluent text and shows the first signs of zero-shot capabilities; scaling laws offer hope and predictability for scaling; GPT-3 demonstrates in-context learning and is closed; Chinchilla presents compute-optimal scaling laws; and the list also names Llama 3 and DeepSeek v3. The source does not provide one common benchmark, so this list cannot support an unstated ranking.

### Reasoning and industrialization

The reasoning section says that answering hard questions requires thinking, that language models produce “thoughts” before a response, and names OpenAI's o1–o4 and DeepSeek's r1. This article does not add architecture or performance claims absent from the artifact.

The industrialization section presents scale with explicitly qualified reporting: GPT-4 **supposedly** has 1.8T parameters; GPT-4 **supposedly** cost $100M to train; xAI is building a cluster with 200,000 H100s to train Grok; and Stargate (OpenAI, NVIDIA, and Oracle) announced $500B over four years. The artifact immediately notes that public details on how frontier models are built do not exist and points to the GPT-4 technical report. Its conclusion is that AI has moved from research into business and public policy, while the research remains far from finished.

### AI as a melting pot

The final section revisits battles among the traditions: Minsky and Papert promoted symbolic AI and harmed neural-network research; statistical ML in the 2000s also considered neural networks dead. Yet there are deeper connections: the McCulloch–Pitts neural-network paper was about implementing logical operations; Go is defined by symbols while deep neural networks are central to playing it; and deep learning moved from perception toward reasoning, a symbolic-AI goal.

AI is therefore a melting pot. Symbolic AI supplied vision and ambition; neural AI supplied model architectures; statistical AI supplied rigor such as optimization and generalization. The class will use elements of all three, rather than treating history as a line with one winner.

## Tensors: from data shapes to inspectable computation

`tensors.py` calls tensors the atoms of modern machine learning. They represent data, model parameters, gradients, and intermediate computations (activations), and they also appear in science and engineering. The core examples use NumPy; the einops section uses PyTorch tensors.

### Scalars, vectors, matrices, and rank

A tensor is a multidimensional array generalizing vectors and matrices. A scalar is rank 0, such as `np.array(42)`; a vector is rank 1, such as `[1,2,3]`; a matrix is rank 2, such as a two-by-three array; and the rank-3 example stacks two two-by-three matrices into shape `(2,2,3)`. Slices `x[1]`, `x[1][0]`, and `x[1][0][2]` successively return a matrix, vector, and scalar.

We usually do not write every entry. `np.zeros((2,3))`, `np.ones((2,3))`, and `np.random.randn((2,3))` create structured arrays; `np.eye(3)` creates an identity matrix and `np.diag([1,2,3])` creates a diagonal matrix. Arrays can also be saved with `np.save` and loaded with `np.load`. These examples separate shape from numerical content.

### Typical machine-learning shapes
A D-dimensional point has `(D,)`, a batch `(N,D)`, a language sequence batch `(N,L,D)`, and an image batch `(N,H,W,C)` with RGB channels. A weight matrix is `(Din,Dout)`; the source uses DeepSeek v3's paper and Hugging Face file information as an example.

### Viewing and elementwise operations

For a `(2,3)` tensor, `x[0]` selects row 0, `x[:,1]` selects column 1, and `x.transpose(1,0)` transposes it. These are views, not copies: assigning `x[0][0]=100` also changes the corresponding `y`. Avoid mutation unless needed.

Elementwise operations apply the same operation to every element and return the same shape: `np.power(x,2)`, `np.sqrt(x)`, `x+x`, `x*3`, and `x/2`. `np.triu` and `np.tril` select upper and lower triangular parts and are useful for masking Transformer inputs. `np.zeros_like` and `np.ones_like` create arrays with another tensor's shape.

### Matrix multiplication and efficiency

If `x` has shape `(4,6)` and `w` has shape `(6,3)`, `x @ w` has shape `(4,3)`. If `x` has shape `(2,4,6)` while `w` remains `(6,3)`, the result is `(2,4,3)`: each slice `x[0]`, `x[1]`, and so on is multiplied by the same `w`, which is broadcast.

The same result often has multiple implementations. The source compares three nested Python loops with NumPy `x @ w` for N=16, uses `timeit` to calculate `python_time / numpy_time`, and notes that GPUs are faster for large matrices. The measured speedup is not a fixed benchmark; the reusable lesson is to express computation as tensor operations when possible.

### Einops and dimension bookkeeping

Traditional PyTorch code such as `x @ y.transpose(-2,-1)` requires remembering what `-2` and `-1` mean. Einops is a library for manipulating tensors with named dimensions, inspired by Einstein summation notation; see the [Einops tutorial](https://einops.rocks/1-einops-basics/).

`einsum` is generalized matrix multiplication. A two-dimensional example names `x` as `seq1 hidden` and `y` as `hidden seq2`, producing `seq1 seq2`. A batched example names the inputs `batch seq1 hidden` and `batch seq2 hidden`, producing `batch seq1 seq2`; dimensions absent from the output are summed. `...` represents any number of broadcasting dimensions.

Reductions can also be named: `x.sum(dim=-1)` is expressed as `reduce(x, "... hidden -> ...", "sum")`. Finally, `rearrange` splits `total_hidden` in `(seq,total_hidden)` into `heads` and `hidden1`, applies `einsum` with a `(hidden1,hidden2)` weight, and combines `heads` and `hidden2` again. The mathematical goal is unchanged; the dimension split, preservation, and merge are simply made explicit.

## Checks after reading

Together, the artifacts suggest listing abilities and goals, marking computation, information, and societal constraints, then checking tensor shapes. Start with the smallest test case; hidden tests and unpublished solutions are not reconstructed here.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official executable artifacts: welcome, history, tensors](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Einops tutorial](https://einops.rocks/1-einops-basics/)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
