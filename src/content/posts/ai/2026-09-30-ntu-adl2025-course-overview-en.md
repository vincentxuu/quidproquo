---
title: "Applied Deep Learning: A Learning Path through Concepts, Assignments, and Implementation | NTU Yun-Nung Chen Applied Deep Learning Course Overview"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, deep-learning, nlp]
lang: en
math: true
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 0
tldr: "NTU Professor Yun-Nung (Vivian) Chen's Applied Deep Learning (ADL) is a deep learning course centered on NLP, with 14 lectures in four segments: neural networks and backpropagation; sequences and Transformers (word vectors, RNNs, attention, BERT); putting pretrained models to work (prompting, instruction tuning, RLHF, LoRA, RAG, decoding and evaluation); and LLM issues and frontiers (bias and safety, language agents, reasoning, tool use, multimodality). Fall 2025 slides and segmented videos are public; only HW1 has a full spec, while HW2, HW3, and the final project have only briefing videos."
description: "Entry point for the series on NTU Professor Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025: what each lecture in the four segments teaches, a hand calculation of dot-product attention with three keys, prerequisites and self-check questions, how to read the lecture and TA tracks with the materials available outside NTU, and the full series index."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

**Video status: Videos included.** The intro embeds the Lecture 0 course introduction (29:36); each lecture's segmented videos are in its own post. [Source details](#course-video-sources)

Applied Deep Learning (ADL, 深度學習之應用) is taught by Professor Yun-Nung (Vivian) Chen of NTU's computer science department, at the permanent address [adl.miulab.tw](http://adl.miulab.tw/). Despite the name, it is centered on natural language processing; the course's own slides say "ADL focus on NLP". Lectures are in Mandarin, slides in English.

The course goals are concrete: understand how deep learning works, how to frame a task as a learning problem, how to implement models with tools, how to use pretrained models, and when and why particular techniques work. The semester builds up in that order: first learn to train a network, then handle language sequences, then learn to make a big pretrained model do what you want, and finally look at the new problems LLMs bring.

This post is the series entry point. It lays out what each lecture in the four segments teaches, works an attention calculation by hand, and ends with a prerequisite check and how to read the series. The series follows Fall 2025 (September–December 2025), the most recent finished term. Below is the Lecture 0 course introduction (29:36), covering goals, prerequisites, grading, and the AI-use rules; this post does not cover the grading details or AI-use rules, so watch the video for those.

```youtube
url: https://www.youtube.com/watch?v=RwRZVd9rLxE
title: ADL 0: Course Introduction
```

## The storyline: four segments

### How neural networks learn (Lectures 1–2)

[Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) sets up two ideas: deep learning chains many simple functions into a production line, where you supply only the data at the two ends and the machine learns what each station does; and to solve a problem with it, first write down input X and output Y, since the form of the output decides whether the task is classification or sequence prediction. [Lecture 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en) answers the three questions of training: the model is layers of $z = Wa + b$ followed by a nonlinearity; quality is measured by a loss; and gradient descent walks downhill. With millions of parameters, gradients come from backpropagation: one forward pass stores each layer's outputs, one backward pass computes error terms from the output layer back, and their product is each weight's gradient. These two lectures are the official HW0, to be finished before enrolling.

### Sequences and Transformers (Lectures 3–5 and HW1)

[Lecture 3](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) is built around language models: predict the next word, one at a time. Words go from one-hot vectors to low-dimensional word embeddings; language models go from n-grams (unseen combinations get zero probability) to RNNs (previous context accumulated in a hidden state). RNN gradients tend to vanish or explode; clipping handles explosion, and the gates of LSTMs and GRUs handle vanishing. [Lecture 4](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) fixes the problem of squeezing a whole sentence into one vector: attention lets the decoder, for each word it produces, score every input position and take a weighted sum; the Transformer has the input attend to itself, dropping recurrence for parallelism at the cost of adding position information separately. [Lecture 5](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) covers subword tokenization in the first half (BPE repeatedly merges the most frequent adjacent pair) and BERT in the second: mask 15% of tokens and fill them back in to learn context-aware representations, then fine-tune for downstream tasks. [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) is Chinese extractive question answering: pick the relevant paragraph from four, then mark the answer's start and end positions.

### Putting pretrained models to work (Lectures 6–9)

[Lecture 6](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en) sorts pretrained models into three kinds: encoders see both sides and suit understanding; decoders see only the left and can generate, the kind that has won out; encoder-decoders are pretrained by denoising. GPT-3's in-context learning does tasks without updating parameters; then come two kinds of prompts: a hard prompt uses a human-written template to turn the task into fill-in-the-blank, with a verbalizer mapping the filled-in word to a label, while a soft prompt trains a sequence of vectors directly as the prompt. [Lecture 7](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en) covers the two steps from continuing text to following instructions: instruction tuning teaches the model to read task descriptions, and RLHF uses a reward model to move answers toward human preferences (DPO and KTO remove the reinforcement learning part); the second half covers Adapters and LoRA, which train only a few parameters. [Lecture 8](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) is RAG: an open-book exam where the model retrieves passages for the question first, then answers with them; it compares sparse and dense retrieval, bi-encoders and cross-encoders, and when prompting, RAG, or fine-tuning fits best. [Lecture 9](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en) covers how to pick words during generation: greedy takes the most likely word at each step, beam search keeps several candidates at once, and top-k and nucleus sampling sample only among the more probable words; evaluation includes BLEU and ROUGE, which measure word overlap with reference answers, plus perplexity and LLM-based evaluation.

### LLM issues and frontiers (Lectures 10–14)

[Lecture 10](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) sorts the problems of models trained on web data into three kinds: bias (goal: fairness), harmful content (goal: safety; jailbreaks are attempts to get around the defenses), and hallucination (goal: factuality; a long answer can be split into minimal claims and checked one by one). A common fix for all three is alignment, but optimizing too hard against an imperfect reward model makes things worse. [Lecture 11](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) organizes language agents around reasoning, memory, and planning: reasoning itself is treated as an internal action (CoT, ReAct); memories are retrieved by recency, importance, and relevance scores; planning goes from step-by-step reaction to tree search. [Lecture 12](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) has two halves: test-time scaling keeps the model fixed and spends more compute at inference (answer several times and pick, score each step with a process reward model); learning to reason updates the weights, for example DeepSeek-R1-Zero, which is given only whether answers are right and grows reasoning behavior through reinforcement learning. [Lecture 13](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en) covers dialogue systems: traditionally split into understanding, state tracking, choosing an action, and generating a sentence, all of which a language model can do in one go, except that without tools its "let me look that up" looks nothing up; Toolformer has the model generate and filter its own tool-use training data. [Lecture 14](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en) covers learning representations without labels: an auto-encoder compresses the input into a short code and reconstructs it, a VAE makes the code follow a Gaussian so it can be sampled to generate, and contrastive learning pulls similar things together and pushes dissimilar ones apart; CLIP applies contrastive learning to image-text pairs, so image classification needs no separate training.

The TA recitations are a separate track: Colab and PyTorch, the NLP project workflow, LoRA and QLoRA, quantization, and deployment with vLLM, gathered in the [TA recitations post](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en).

## Work it by hand: attention is a weighted average

This is a teaching example written for this post, to look at Lecture 4's core operation and why it shows up again in Lecture 8's retrieval and Lecture 9's temperature.

Take a query vector $q = (1, 0)$ and three keys, $k_1 = (1, 0)$, $k_2 = (0, 1)$, $k_3 = (-1, 0)$, with values 10, 20, and 30.

1. **Score**: the dot products $q \cdot k_i$ are 1, 0, −1. $k_1$, pointing the same way as $q$, scores highest.
2. **Softmax into weights**: $e^1 \approx 2.718$, $e^0 = 1$, $e^{-1} \approx 0.368$, summing to about 4.086, so the weights are 0.665, 0.245, 0.090, adding up to 1.
3. **Weighted average**: $0.665 \times 10 + 0.245 \times 20 + 0.090 \times 30 \approx 14.25$.

The output leans toward $k_1$'s value of 10, but the other two still contribute.

Double the scores (2, 0, −2) and compute again: the weights become 0.867, 0.117, 0.016, and the output is about 11.49, taking almost only $k_1$. The larger the scale of the scores, the sharper the softmax, and the closer attention gets to looking up a single entry.

**What this means:** attention does not pick one item; it averages by similarity, and the score scale decides how selective it is. The Transformer divides the dot product by $\sqrt{d_k}$ (the key dimension) precisely so that the score scale does not grow with the dimension and make the softmax too sharp. The same "score by similarity, take the top few" shows up in Lecture 8's dense retrieval, and "rescale the scores to control how sharp the distribution is" is what temperature does in Lecture 9.

## Prerequisites and self-check

The official requirements are university calculus and linear algebra, with probability, statistics, and intro AI recommended; you should be fluent in Python, since all assignments are written in Python. If PyTorch is new to you, start with the Dev Infra recitation and Colab in the TA recitations post.

After reading this post, try to answer:

1. Why can't a single neuron do XOR?
   Answer: One neuron can only draw a single straight boundary, and the two XOR classes cannot be separated by one straight line; you need two layers.
2. Why do RNN gradients tend to vanish or explode, and how is each handled?
   Answer: Backpropagation multiplies by the same weight matrix many times; clip gradients for explosion, and use LSTM or GRU gates for vanishing.
3. In the example above, if $q = (0, 1)$, which value gets the highest weight?
   Answer: The scores become 0, 1, 0, so $k_2$ is highest, with weights about 0.212, 0.576, 0.212. The output is exactly 20, but these values hide the lean: $k_1$ and $k_3$ get equal weight, and 10 and 30 average to 20 anyway. Swap the values for 10, 20, 60 and compute again: $0.212 \times 10 + 0.576 \times 20 + 0.212 \times 60 \approx 26.4$, closer to $k_2$'s 20 than the plain average of 30.
4. When is RAG a better fit than fine-tuning?
   Answer: When knowledge changes often, lives in internal documents, or needs a citable source; RAG needs no retraining, and swapping documents swaps the knowledge.
5. How do test-time scaling and learning to reason differ?
   Answer: The first leaves the model unchanged and spends more compute at inference; the second updates the weights so the model learns to reason.

## How to read it: lectures, assignments, and materials

The series follows the official lecture order, with HW1 as its own post, HW2, HW3, and the final project folded into their lectures, and the TA recitations gathered into the last post.

**Suggested route**: read Lectures 1 and 2 with videos 1.1–2.5 (the official HW0) → after Lecture 5, do HW1 as a checkpoint (with your own data) → from Lecture 6 on, follow your interests. If you only want the NLP storyline from RNNs to LLMs, the slides and videos are enough.

**Materials and limits**:

- Lectures 1–11 have slides and segmented videos. Lectures 12–14 are only on the [Fall 2025 playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o), with titles only on the course page; Lecture 12 has no public slides, and Lectures 13 and 14 use Fall 2024 slides, which the posts note.
- The backpropagation video ([ADL 2.5](https://youtu.be/BHgssEwMxsY)) is linked from the course page but not on the playlist; watching only the playlist skips it.
- Only HW1 has a full spec, but its data and leaderboard are behind a Kaggle invitation link, and code and reports go to NTU COOL, so outside readers cannot get the data and need to find a Chinese QA dataset to practice on. HW2 (LLM fine-tuning for classical Chinese translation) and HW3 (training a retriever and reranker for RAG) have only briefing videos, so you need your own data and your results will not match the official grading; the final project likewise has only briefing videos. The posts summarize the tasks and points from the videos. None of the three assignments has public solutions.
- The TA handout links on the course page do not open; the same files can be downloaded from the [Fall 2024 path](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) instead.

**If you are following Fall 2026**: the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~miulab/f115-adl/) has new slides and videos for the first half and a reordered schedule; the easiest thing to mix up is RAG (Lecture 7 in Fall 2026, Lecture 8 in this series); Post-Training moved after RAG, and the materials for the second half have not been updated yet.

## Posts in this series

| Lecture | Post | Official materials |
|---|---|---|
| Lecture 1 | [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) | Introduction, videos 1.1–1.3 |
| Lecture 2 | [Neural Networks and Backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en) | NN Basics, Backpropagation, videos 2.1–2.5 |
| Lecture 3 | [Word Vectors, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en) | Sequence Modeling, videos 3.1–3.4 |
| Lecture 4 | [Attention and Transformers](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer-en) | Videos 4.1–4.2 |
| Lecture 5 | [Tokenization and BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) | Videos 5.1–5.2; optional 5.3–5.6 |
| Assignment 1 | [HW1: Chinese Extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) | HW1 spec slides |
| Lecture 6 | [Three Families of Pretraining and Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en) | Videos 6.1–6.6 |
| Lecture 7 | [Post-Training and Efficient Adaptation: Instruction Tuning, RLHF, LoRA, plus HW2](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en) | Videos 7.1–7.5, HW2 video |
| Lecture 8 | [RAG, plus HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) | Videos 8.1–8.6, HW3 video |
| Lecture 9 | [NLG: Decoding, Control, and Evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en) | Videos 9.1–9.5 |
| Lecture 10 | [Bias, Safety, Hallucination, and Alignment, plus the Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | Videos 10.1–10.3, project videos |
| Lecture 11 | [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) | Videos 11.1–11.5 |
| Lecture 12 | [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | Videos 12.1–12.5 |
| Lecture 13 | [Conversational AI and Tool Use](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en) | Videos 13.1–13.9, Fall 2024 slides |
| Lecture 14 | [Learning Without Labels and Multimodality](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en) | Videos 14.1–14.7, Fall 2024 slides |
| Tutorials | [TA Recitations: From PyTorch to LLM Deployment](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en) | Recitation videos, slides, and Colabs |

## What to do tonight

1. Watch the roughly 30-minute course introduction above and check the prerequisites.
2. Redo the three steps in "Work it by hand", then do it again with $q = (0, 1)$ and values 10, 20, 60.
3. Read [Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) alongside videos 1.1–1.3.

Related entry points on this site: the [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) compares ADL with the courses of Hung-yi Lee and Hsuan-Tien Lin. From the same university, the [Hung-yi Lee Machine Learning 2026 Spring guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) starts from AI agents, which complements ADL's bottom-up order. For an English-taught NLP storyline, compare with the [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en).

Next: [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en)

## Course video sources

This is a course overview; the intro embeds the Lecture 0 course introduction. For each lecture's segmented videos, use the official course page or playlist; each lecture post also links its videos.

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [Official ADL Fall 2025 playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (77 videos)
- [ADL 0: Course Introduction](https://www.youtube.com/watch?v=RwRZVd9rLxE) (embedded in the intro, 29:36)

Checked: 2026-10-14.

## Update Log

- 2026-10-14: Rewrote the body as a real guide: the mechanism behind each lecture in the four segments, a hand-worked attention example, self-check questions, and the Lecture 0 introduction in the intro; course rules, access rating, course-page issues, and the Fall 2026 comparison were cut down to a few paragraphs in the reading section.
- 2026-10-13: Lectures 5 and 7 were each merged into one post; updated the HW2 and HW3 notes.
- 2026-10-13: Rechecked the Fall 2026 course page and added a lecture mapping between the two terms.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — weekly schedule, slide and video links, recitations, assignment entry points, TA duties
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — goals, prerequisites, grading, collaboration policy, HW0
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (in Mandarin)
- [ADL 0: Course Introduction (YouTube)](https://youtu.be/RwRZVd9rLxE) (in Mandarin)
- [ADL 2.5: Backpropagation (YouTube, not on the playlist)](https://youtu.be/BHgssEwMxsY) (in Mandarin)
- [NTU ADL 2025 Fall HW1 spec slides](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [ADL 2025 Fall Homework 2 video](https://youtu.be/_QiIp0WTRzI)
- [ADL 2025 Fall Homework 3 video](https://youtu.be/tzjmqxw1n8M)
- [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg), [Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I)
- [Recitation Colab: Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT), [NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [NLP Lifecycle recitation slides (same-name file under the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [BERT Variants slides (Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [ADL Fall 2026 (115-1) course page](https://www.csie.ntu.edu.tw/~miulab/f115-adl/) — in progress, used only for comparison
- [陳縕儂 Vivian NTU MiuLab YouTube channel](https://www.youtube.com/@VivianMiuLab/playlists)
- On this site: [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
- [Attention Mechanism slides (250908_Attention.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf) — Lecture 4: dot-product attention
- [Transformer slides (250908_Transformer.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf) — Lecture 4: self-attention and position information
- [NN Basics slides (250901_NNBasics.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf) — Lecture 2: neural networks and gradient descent

