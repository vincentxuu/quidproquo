---
title: "A Learning Path into Machine Learning through AI Agents | NTU Hung-yi Lee Machine Learning Course Overview"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, machine-learning, ai-agent]
lang: en
math: true
series:
  name: "Reading NTU Hung-yi Lee Machine Learning"
  order: 0
tldr: "Hung-yi Lee's Spring 2026 Machine Learning enters through AI agents and centers on how to influence and adjust model behavior: first take OpenClaw apart to see how an agent works and manages context, then look inside the model at why it is slow and why input length is limited (Flash Attention, KV cache, positional encoding), then the harness and self-correction, which make a model stronger without changing its parameters, and finally AI self-improvement. The 8 lecture recordings and slides and all 10 assignments' problems and Colabs are public; the grading platform is not reachable from outside, so set up your own checks."
description: "Entry point for the series on NTU Professor Hung-yi Lee's Machine Learning 2026 Spring: what each lecture in the three segments teaches, a hand calculation of KV cache memory, prerequisites and self-check questions, how the ten assignments map to lectures and how to check your work outside NTU, and the reading route."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-course-overview)

**Video status: Videos included.** The intro embeds the course introduction (27 minutes); each lecture's recording is in its own post. [Source details](#course-video-sources)

[Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) is Professor Hung-yi Lee's course in NTU's electrical engineering department. It does not start from gradient descent; the first lecture dissects a "lobster", the open-source AI agent [OpenClaw](/posts/ai/2026-03-28-openclaw-overview-en). The syllabus gives the reason: this year AI "no longer just talks, it has started to act", so the whole semester takes the AI agent's point of view and focuses on "how to influence and adjust model behavior".

The semester's order is itself a learning path: first see what an agent does on your computer (visible), then ask why the model is slow and why its input has a length limit (inside the model, invisible), and finally come back to the harness, which makes a model stronger without changing its parameters, and to whether models can correct and improve themselves. This series follows the official order, with assignments placed between lectures by release date; HW9 (flow matching) and HW10 (spoken language models) have no matching lecture, and their posts point out which older videos to catch up on.

This post is the series entry point. It lays out what each lecture in the three segments teaches, works out KV cache memory by hand, and ends with a prerequisite check and how to read the series. Below is the 27-minute course introduction, covering the semester plan, prerequisites, and assignment rules; the course content itself starts with Part 1, and you can read the series without the video.

```youtube
url: https://www.youtube.com/watch?v=gl-BdDjNPVI
title: Machine Learning 2026 course introduction
```

## The storyline: three segments

### The visible agent (Parts 1–5)

[Part 1](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) breaks OpenClaw into five questions: how an agent knows who it is, how it uses tools, how it remembers, how it runs on a schedule, and how it works autonomously for a long time. Every answer comes back to one fact: a language model only continues text and starts fresh each turn, so identity, memory, and procedures are all text files stuffed into the prompt, or files the model reads and writes through tools. [Part 3](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) handles the next problem: input length is limited, yet an agent keeps piling up tool output. Context engineering splits into compression (summarize, clear, offload to files), filtering (read only what is needed, load tools on demand), and letting the model decide its own next-turn context; a subagent can be seen as a form of self-directed compression. [Part 4](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en) looks at how multiple agents collaborate (irregular connection patterns beat regular ones), whether they can deceive each other in games like Werewolf, and the impact on academic research now that agents can reproduce and extend a paper from scratch.

Assignments: [HW1](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en) has you write a defense prompt so the model keeps its output format under attack; [HW2](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en) has you write prompts and a workflow, not a classifier, so an open-source LLM on Colab plans, writes code, and debugs its own way to character face recognition.

### Inside the model, where you can't see (Parts 6–10)

[Part 6](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en): a GPU's compute units are fast but its on-chip memory is small, so moving data between HBM and SRAM is the bottleneck. Flash Attention uses a trick, assume the largest value seen so far is the maximum and multiply by a correction later, to merge softmax's several passes into one; the result is exactly the same as before, with no retraining. [Part 7](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en): the KV cache stores already-computed keys and values so decoding doesn't recompute them, at the cost of memory for every token; the slimming methods include sharing keys and values across queries (MQA, GQA), compressing them into one vector (MLA), looking only at a window (sliding window), and cross-conversation prompt caching (a hit only when the prefix matches exactly). [Part 9](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en): self-attention alone can't tell "you hit me" from "I hit you", so position information has to be added; today's dominant RoPE breaks at angles it never saw in training, which led to a series of fixes for training short and testing long.

Assignments: [HW3](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en) has you read speculative decoding and FlashAttention papers and measure speedups in Colab; [HW4](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en) moves next-token prediction to images, treating a 20×20 Pokémon sprite as a 400-token sequence and having the model draw the last 40%.

### How to educate a model (Parts 11–20)

[Part 11](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en) opens with a demo: a small model that can't find a file writes a fake one to get by, but after three short instructions, "the current environment, how to work, what counts as done", it dutifully runs the tests. A harness has three levers: control the mental frame with human language (AGENTS.md), control the capability boundary with tools, and control behavior with workflows. [Part 13](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en) asks whether a model can fix its own mistakes: change inference (build a version that answers wrong and subtract it), change the workflow (external feedback beats self-reflection, and with limited compute, sampling several answers and voting often pays off better), or change parameters (with RL). [Part 15](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) and [Part 18](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en) cover AI self-improvement: the first hands the parts humans used to do over to the AI one by one, with reference answers produced by the AI's own self-correction, rewards written by an LLM, the loss set by the model itself, and even the problems posed by the model, though experiments keep showing that going fully without humans hits a ceiling; the second lets the harness grow too, using a language model as the rewriter and keeping a pool of candidates, genetic-algorithm style, that retains the ones that perform well.

Assignments: [HW5](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en) fine-tunes math ability with LoRA without washing out the model's refusal of dangerous requests; [HW6](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en) uses ROME to change one fact the model remembers; [HW7](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en) merges a Japanese model and a math model at the parameter level; [HW8](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en) compares test-time scaling methods such as self-consistency; [HW9](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en) reads flow matching papers and trains on 2D data; [HW10](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model-en) compares three architectures for spoken language models.

## Work it by hand: how much memory the KV cache takes

This is a teaching example written for this post, to see why Part 7 spends a whole lecture on slimming the KV cache and why Part 3 manages context length.

The KV cache stored per token is:

$$
2 \times \text{layers} \times \text{KV heads} \times \text{head dimension} \times \text{bytes per number}
$$

The 2 is because keys and values each get a copy. With Llama 2 7B's configuration (32 layers, 32 heads, head dimension 128, fp16 at 2 bytes per number):

- Per token: $2 \times 32 \times 32 \times 128 \times 2 = 524{,}288$ bytes, exactly 0.5 MB ($2^{19}$ bytes, counting 1 MB as $2^{20}$ bytes).
- One 4096-token conversation: $0.5 \text{ MB} \times 4096 = 2$ GB.
- Serving 16 at once: 32 GB, more than the model's own weights (about 13 GB in fp16).

Suppose you switch to GQA (Llama 2 7B itself doesn't use it), with every 4 query heads sharing one set of keys and values (KV heads go from 32 to 8): the KV cache drops to a quarter, and 16 conversations need only 8 GB.

**What this means:** what limits how many people you can serve at once and how much you can read during generation is often not the model weights but the KV cache, which grows in proportion to both context length and the number of concurrent conversations. Part 7's MQA, GQA, MLA, and sliding window each cut one term of the formula; Part 3's context management and Part 7's prompt caching, which lets an identical prefix skip recomputation, are also ways of saving on this bill.

## Prerequisites and self-check

The syllabus requires watching the [recordings](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) of Fall 2025's Introduction to Generative AI and Machine Learning (ten lectures, about two hours each) before enrolling, and says material covered before will not be repeated this semester; that is a requirement, not a suggestion. All assignments use Python, but the course doesn't teach the syntax; Colab's free tier is enough to pass.

After reading this post, try to answer:

1. Where does OpenClaw's "memory" live?
   Answer: In files, which the agent stuffs into the prompt each turn or reads and writes through tools; the model itself starts fresh every turn and remembers nothing.
2. Why doesn't Flash Attention require retraining the model?
   Answer: It only changes the order of computation to cut memory traffic; the attention it computes is exactly the same as before.
3. Suppose the example's context grows to 32k (32,768) tokens (Llama 2 7B natively goes only to 4096). How large is one conversation's KV cache?
   Answer: $0.5 \text{ MB} \times 32768 = 16$ GB, more than the model weights for a single conversation.
4. Why should a system prompt put stable content first and changing things like the date later?
   Answer: Prompt caching only hits when the prefix matches exactly; put changing content early and everything after it has to be recomputed.
5. How does harness engineering differ from fine-tuning?
   Answer: A harness changes no parameters and controls the model's behavior through instructions, tools, and workflows; fine-tuning updates the parameters.

## How to read it: assignments and materials

Read in this series' order, one lecture followed by one assignment. All 8 lectures have slides and full recordings, and all 10 assignments have a problem PDF, Colab starter code, and a TA walkthrough video. The course page also lists three talks by title only, with no materials, which this series does not cover.

The assignments come in two kinds. HW3, 6, 8, 9, and 10 are multiple-choice quizzes based on reading papers and running Colab, answered on NTU COOL along with the answer keys; most questions are printed in the assignment PDFs and can be worked through, except HW6, whose PDF does not include them. HW1, 2, 4, 5, and 7 are graded by upload, and their grading platform, JudgeBoi, can no longer be reached from outside, so you can't see scores or leaderboards. HW2, 4, 5, 9, and 10 involve training models, so plan your Colab time around them. Before starting an assignment, copy the baselines and grading rules from the problem PDF and write a small evaluation script as your feedback; each assignment post explains the grading and how to check your own work. One line from the course rules is worth keeping in mind: the only difference between enrolling and auditing is that the TAs don't grade auditors' assignments.

The three getting-started tutorials reuse earlier years' materials: [Colab and Kaggle](https://www.youtube.com/watch?v=kibL4oJbzy4), [PyTorch](https://youtu.be/6dEp6oRN2NE), and [JudgeBoi](https://www.youtube.com/watch?v=sNX3iKzxAPs) (the platform is closed, so it is reference only). There is also a bonus assignment: enter the [Teaching Monster](https://teaching.monster/) competition by building a fully automatic AI system that produces teaching videos. The competition closed on 2026-05-15, but the official [baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released) is public and works as an agent project to practice on.

## Posts in this series

| Order | Post | Lecture / assignment |
|---|---|---|
| 1 | [Dissecting the lobster: OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) | 3/6 AI Agent (1) |
| 2 | [HW1 Malicious instruction defense](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en) | HW1 |
| 3 | [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) | 3/13 AI Agent (2) |
| 4 | [Agent interaction and the impact on research](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en) | 3/13 AI Agent (2) |
| 5 | [HW2 AI agent as an AI engineer](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en) | HW2 |
| 6 | [Flash Attention](/posts/ai/2026-09-30-ntu-ml2026-flash-attention-en) | 3/20 Speeding up generation |
| 7 | [KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) | 3/20 Speeding up generation |
| 8 | [HW3 Fast inference](/posts/ai/2026-09-30-ntu-ml2026-hw3-fast-inference-en) | HW3 |
| 9 | [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en) | 3/27 Very long inputs |
| 10 | [HW4 Training a Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer-en) | HW4 |
| 11 | [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en) | 4/10 Educating models (1) |
| 12 | [HW5 Fine-tuning without forgetting](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en) | HW5 |
| 13 | [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en) | 4/24 Educating models (2) |
| 14 | [HW6 Model editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en) | HW6 |
| 15 | [AI self-improvement, part 1](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) | 5/8 Self-improvement (1) |
| 16 | [HW7 Model merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en) | HW7 |
| 17 | [HW8 Test-time scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en) | HW8 |
| 18 | [AI self-improvement, part 2](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en) | 5/22 Self-improvement (2) |
| 19 | [HW9 Flow matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en) | HW9 |
| 20 | [HW10 Spoken language models](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model-en) | HW10 |

## What to do tonight

1. Make sure you have watched the Fall 2025 introductory course; if not, put it on your schedule first.
2. Redo "Work it by hand" with the configuration of a model you use (layers, KV heads, and head dimension are in its config file).
3. Read [Part 1](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en).

Related entry points on this site: the [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en) places this course within NTU's offerings, and [Which AI Courses to Take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide-en) explains where it sits relative to other courses in its section on Hung-yi Lee.

Next: [Dissecting the lobster: how AI agents work, through OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en)

## Course video sources

This is a course overview; the intro embeds the course introduction video listed on the official course page. Each other lecture's recording is in its own post, or find it from the official course page.

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Machine Learning 2026 course introduction](https://www.youtube.com/watch?v=gl-BdDjNPVI) (embedded in the intro, 26:46)

Checked: 2026-10-14.

Content check: verified against the video transcript (2026-10-10): the full transcript of video gl-BdDjNPVI (26:46, course introduction) was read. The prerequisite requirement cited here (last semester's introductory course, 10 lectures of about two hours each), that the course doesn't teach Python syntax, that Colab's free tier is enough to pass, that enrolling and auditing differ only in whether TAs grade the work, and that the bonus is Teaching Monster all match the transcript.

## Update Log

- 2026-10-14: Rewrote the body as a real guide: the mechanism behind each lecture in the three segments, a hand calculation of KV cache memory, self-check questions, and the course introduction video moved to the intro; access rating, the platform table, and grading and auditing rules were cut down to a few paragraphs in the reading section, noting where each assignment is answered and that the bonus has closed.
- 2026-10-10: Checked the course introduction video against its transcript.
- 2026-10-10: Added video status and embedded the course introduction video.

## References

- [Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Chinese) — content table, homework table, platforms, deadlines, integrity rules
- [ML 2026 policy slides (policy.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/policy.pdf) (in Chinese) — assignment schedule and platform split, grading, enrollment agreement, add codes and auditing, semester plan
- [ML 2026 course introduction (YouTube)](https://youtu.be/gl-BdDjNPVI) (in Mandarin)
- [NTU course catalog: Machine Learning 114-2 syllabus](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?class=&course_id=921+U2620&dpt_code=9450&semester=114-2&ser_no=26696) (in Chinese) — course number, credits, time and place, overview and FAQ
- [Introduction to Generative AI and Machine Learning 2025 playlist](https://www.youtube.com/playlist?list=PLJV_el3uVTsMMGi5kbnKP5DrDHZpTX0jT) (in Mandarin) — the required prerequisite recordings
- [ML 2026 Spring Bonus: Teaching Monster Arena (bonus.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/bonus.pdf)
- [ML2026 Bonus HW walkthrough video](https://youtu.be/Xk_utjmoK5A)
- [Teaching Monster baseline repo](https://github.com/Teaching-Monster/TeachingMonster-released)
- [Teaching Monster competition site](https://teaching.monster/)
- [Colab Tutorial slides (ML 2025)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/Colab_Tutorial.pdf)
- [2025 Colab/Kaggle tutorial video](https://www.youtube.com/watch?v=kibL4oJbzy4)
- [PyTorch Tutorial 1 slides (ML 2023)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2023-course-data/Pytorch_Tutorial_1_rev_1.pdf)
- [PyTorch Tutorial video (ML 2023)](https://youtu.be/6dEp6oRN2NE)
- [JudgeBoi Guide slides](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/JudgeBoi_Guide.pdf)
- [JudgeBoi platform](https://ml.ee.ntu.edu.tw/home)
- On this site: [NTU AI/ML course guide](/posts/learning/2026-09-30-ntu-ai-ml-course-map-en)
- On this site: [Which AI Courses to Take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide-en)
- [Dissecting the lobster: how AI agents work, through OpenClaw (intro.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/intro.pdf) (in Chinese) — Part 1: agent identity, tools, and memory
- [Speeding up language model generation (inference.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/inference.pdf) (in Chinese) — Parts 6 and 7: Flash Attention and the KV cache
