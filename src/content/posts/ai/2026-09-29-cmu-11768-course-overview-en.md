---
title: "Reading CMU 11-768 AI Agents: An Agents Course You Can't Take Without Having Trained a Language Model, With Three Assignments From Harness to Eval to RL"
date: 2026-09-29
category: ai
type: guide
tags: [cmu-11768, ai-course, cmu, ai-agent, harness-engineering, self-study]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 0
tldr: "CMU 11-768 is a new Fall 2026 graduate course on agents taught by Graham Neubig and Daniel Fried. The prerequisite — prior experience training language models — is strictly enforced. Its 23 lectures run from tool calling, context, memory, and planning through SFT, RL, sandboxing, and human-agent interaction. Three individual assignments in the first half build a harness, an evaluation, and a training pipeline; the second half is a team research project. Slides and the first nine lecture videos are public."
description: "Series guide to CMU 11-768 AI Agents (Fall 2026): what the course is for, the prerequisite bar, grading and AI-tool policy, the seven modules of the 23-lecture schedule, the three assignments and research project, and how this 27-part series is organized and how far along it is."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-course-overview)

**Video status: Videos included.** [Source details](#course-video-sources)

[11-768 AI Agents](https://www.cmu-agents.com/) is a new graduate course from Carnegie Mellon's Language Technologies Institute ([LTI](https://lti.cs.cmu.edu/)), first offered in Fall 2026 and taught by [Graham Neubig](https://www.phontron.com/) and [Daniel Fried](https://dpfried.github.io/). Introducing himself in lecture 1, Neubig said he develops [OpenHands](https://github.com/All-Hands-AI/OpenHands); Fried described his research as grounded agents, human-agent interaction, and, more recently, agent-system interaction.

The course website defines its subject in one sentence: systems that use large language models to perceive, reason, plan, and act over many steps. What separates it from the usual "build an agent with a framework" course is that it asks you to **train agents yourself**. Neubig says it plainly in lecture 1: building an agent isn't hard, making it actually work is — and very few people know how to train agents well. The instructors want everyone who finishes the course to be in that small group.

This post is the entry point for the series: first the format and the bar to get in, then the 23-lecture schedule, the three assignments, and the project, and finally how the 27 posts in this series are laid out and where they stand.

## Course video sources

Verified public recording for CMU 11-768 Fall 2026 lecture 1, published on course instructor Graham Neubig’s channel; its title and description identify this course. This overview links the introductory first lecture.

```youtube
url: https://www.youtube.com/watch?v=UwfjzyLnvMg
title: CMU AI Agents 2026: 1. What are Agents and How Do They Work?
```

Original videos: [CMU AI Agents 2026: 1. What are Agents and How Do They Work?](https://www.youtube.com/watch?v=UwfjzyLnvMg)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## Format: the prerequisite is enforced

Class meets Tuesdays and Thursdays for 80 minutes, with no class during fall break (Oct 12–16) and Thanksgiving (Nov 25–27); Dec 1–3 are final poster sessions. Communication runs through Piazza and submissions through Canvas; readers outside CMU have the public slides, YouTube recordings, and assignment repos on the course site.

**The prerequisite is the biggest barrier.** The website asks for prior experience training neural language models and recommends 11-667, 11-711, 10-202, or equivalent experience. [The lecture 1 slides](https://www.cmu-agents.com/slides/lecture-01-agents.pdf) are stricter: in the first week you fill out a form naming a university course with an LM-training assignment, the assignment link, the term, and your grade. Without the formal prerequisite, you explain comparable experience, such as pre- or post-training work or published research training 4–7B+ models. Students who can't meet it are asked to drop.

The reason is practical: the goal is for everyone to be able to train an agent with reinforcement learning by the end of the semester. In lecture 1's show of hands, Neubig's read of the room was that few students had done RL on language models, and he estimated that about one in ten had used RL to train agents (a spoken estimate from the raised hands, not a formal count).

### Grading

The grading table from the website:

| Component | Weight | Format |
|---|---|---|
| Assignment 1: Harness | 10% | Individual |
| Assignment 2: Eval | 15% | Individual |
| Assignment 3: Training | 15% | Individual |
| Lecture highlights | 10% | Individual |
| Project proposal | 5% | Team of 2–4 |
| Project check-in | 5% | Team of 2–4 |
| Final presentation | 10% | Team of 2–4 |
| Final report | 30% | Team of 2–4 |

A lecture highlight is a short takeaway you write yourself and submit within 24 hours after each lecture — a few sentences, as long as it's one thoughtful point. There are 22 opportunities and 20 count. Neubig said in lecture 1 that if you found nothing new because the prerequisite courses already covered it, you should say so — that's useful to them too.

### AI-tool policy

AI tools are generally allowed on coursework unless a specific assignment says otherwise. The one exception: lecture highlights must be written by you. Two other rules are less common:

- **You are responsible for every claim, citation, result, and line of code you submit, and you will be quizzed on it.** Neubig said the staff also know how to use agents and are considering having agents read your code and generate questions tailored to your implementation. Submitting a thousand lines of agent-generated junk is a bad idea; something concise that you actually understand is better.
- **Late work uses slack days.** Each assignment comes with two, which can't be transferred; after that, it's 5% of the assignment score per extra day or part-day. The project proposal and report each have two as well; the presentation has none.

## Schedule: 23 lectures, seven modules

Based on the course schedule (checked 2026-09-29), merging the module labels the website gives each lecture, the 23 lectures group like this (the seven groups are this post's consolidation; the website's labels are finer-grained):

| Module | Lectures | Topics |
|---|---|---|
| Intro and agent capabilities | L1–L5 | What an agent is, tool use, long-context management, skills and memory, planning and multi-agent coordination |
| Domains | L6, L7, L10 | Coding agents, computer use agents (JY Koh), deep research agents (Akari Asai) |
| Training methods | L8, L9, L11, L12 | SFT (Yueqi Song), RL basics, advanced RL algorithms, RL systems (Apurva Gandhi) |
| Safety | L13, L16 | Sandboxing and credential management, observability and monitoring (Eric Wallace) |
| Frameworks | L14, L15 | OpenHands, LangGraph |
| Interaction | L17–L19 | Agents and the future of work (Zora Wang), multi-agent interaction (Saujas Vaduguru), human-agent interaction (Valerie Chen) |
| Search and advanced topics | L20–L23 | Reranking and critic models, tree search (JY Koh), guest lectures by Karthik Narasimhan and Sasha Rush |

There are also two project-hour sessions in early November with no new material.

Two ways to read this table. First, its skeleton is lecture 1's "six capabilities × two paths": the first five lectures build capabilities from the harness side, the training module builds the same capabilities from the model side, and safety and frameworks return to systems engineering. Second, **there is no dedicated evaluation lecture** — evaluation design shows up only in Assignment 2. L11 covers reward hacking and benchmark contamination, and by then you'll see that how well you write evaluations directly decides what RL learns.

Each lecture on the website comes with a long reading list — lecture 2 alone lists 30 items (not counting slides and recording), from [Toolformer](https://arxiv.org/abs/2302.04761) to the MCP specification. Each post in this series links the readings that bear directly on that lecture's argument rather than copying the whole list.

## Three assignments and a research project

The first half of the semester is three individual assignments; the second half is a team research project. The three assignments line up with lecture 1's "build → evaluate → train."

**[Assignment 1: Harness](https://github.com/cmu-agents/assignment-1)** (due Sep 14). Write your own ReAct loop on top of an open-source LLM. First, build a `CodeAgent` that fixes bugs in a terminal and use it to repair a broken chess app; then add context compaction; finally, instantiate the same loop as a `ChessAgent`, define its tools to play against a rule-based bot, and try letting the agent call tools by writing Python.

**[Assignment 2: Eval](https://github.com/cmu-agents/assignment-2)** (due Oct 1). The subject is a data-visualization agent that takes data and a user spec and produces a chart. You write a validator that judges, from only the agent's trajectory and final figure (no ground truth), whether it succeeded and where it went wrong; you then design new evaluation tasks, and you're graded on a private set of trajectories.

**Assignment 3: Training** (tentatively due Oct 29, not yet released). The website says only: "Implement the training procedures used to adapt and improve the agent."

**Research project**: pick an advanced agent topic and produce a proposal, check-in, poster, and final report. Team size is stated inconsistently: the website's grading table and assignments page say 2–4, while the website's own "Individual and team work" policy section and the lecture 1 slides (and the spoken lecture) say 2–3; check Canvas and staff announcements for the operative rule. Fireworks AI, Modal, Prime Intellect, and Sail sponsor compute for the assignments and project (lecture 1 slide 8 and the website's sponsor list).

Go by the website for due dates: the dates in the lecture 1 slides were marked tentative (A1 was Sep 10, A2 Sep 24, A3 Oct 22) and all were later pushed back (the website now lists Sep 14, Oct 1, and Oct 29, with A3 still marked tentative).

## How it relates to other courses

The website lists four CMU courses with overlapping content, none by much:

| Course | Overlap with 11-768 |
|---|---|
| [11-711 Advanced NLP](https://cmu-l3.github.io/anlp-spring2026) | About two weeks on RL and agents, heavier on RL methods |
| [11-766 LLM Applications](https://cmu-llms.org/schedule/) | About two weeks: tool calling, security, multi-agent systems, code assistants |
| [11-891 Neural Code Generation](https://cmu-codegen.github.io/f2025/) | About two weeks on code generation agents |
| [11-777 Multimodal ML](https://cmu-mmml.github.io/) | About one week on GUI agents |

In terms of courses this site has already covered: [Stanford CS329Z](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en) also has you build an agent harness from scratch, but it focuses on systems engineering and evaluation and doesn't touch training; [Stanford CS336](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) teaches you to train a language model from scratch — exactly the experience 11-768 requires. 11-768 sits between them: it takes your ability to train models and points it at agents that use tools and act in environments.

## How to read this series

The series follows the official lecture order, one post per lecture, with each assignment inserted at its official due date — 27 posts in all. Each post uses the lecture transcript and slides as primary sources and covers the whole lecture; lectures with slides only say so and get updated when the video appears. Assignment posts cover requirements, architecture, and design trade-offs, not solutions.

The target reader is an engineer who uses LLM APIs and has built or is building agents. You can read the first half without having trained a model; the training posts lead with intuition, put the math in collapsible sections, and link to this site's CS336 posts as prerequisites.

| Part | Maps to | Topic | Status |
|---|---|---|---|
| 0 | — | Series overview | This post |
| 1 | L1 | [What Is an Agent?](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en) | Published |
| 2 | L2 | [Tool Use](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en) | Published |
| 3 | L3 | [Context Management for Long-Context Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en) | Published |
| 4 | L4 | [Skills and Memory](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en) | Published |
| 5 | L5 | [Planning, Task Decomposition, Multi-Agent Coordination](/en/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en) | Published |
| 6 | L6 | [Coding Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en) | Published |
| 7 | A1 | [Assignment 1: Harness](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en) | Published |
| 8 | L7 | [Computer Use Agents (JY Koh)](/en/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents-en) | Published |
| 9 | L8 | [SFT (Yueqi Song)](/en/posts/ai/2026-09-29-cmu-11768-lecture-08-sft-en) | Published |
| 10 | L9 | [RL Basics](/en/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics-en) | Published |
| 11 | L10 | [Deep Research Agents (Akari Asai)](/en/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents-en) | Published (from slides; video pending) |
| 12 | L11 | [Advanced RL Algorithms](/en/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl-en) | Published (from slides; video pending) |
| 13 | L12 | RL Systems (Apurva Gandhi) | Awaiting course release |
| 14 | A2 | [Assignment 2: Eval](/en/posts/ai/2026-09-29-cmu-11768-assignment-2-eval-en) | Published |
| 15 | L13 | Sandboxing & Credential Management | Awaiting course release |
| 16 | L14 | OpenHands | Awaiting course release |
| 17 | L15 | LangGraph | Awaiting course release |
| 18 | L16 | Observability & Monitoring (Eric Wallace) | Awaiting course release |
| 19 | L17 | Agents and the Future of Work (Zora Wang) | Awaiting course release |
| 20 | L18 | Multi-Agent Interaction (Saujas Vaduguru) | Awaiting course release |
| 21 | A3 | Assignment 3: Training | Awaiting course release |
| 22 | L19 | Human-Agent Interaction (Valerie Chen) | Awaiting course release |
| 23 | L20 | Reranking & Critic Models | Awaiting course release |
| 24 | L21 | Tree Search (JY Koh) | Awaiting course release |
| 25 | L22 | Guest: Karthik Narasimhan | Awaiting course release |
| 26 | L23 | Guest: Sasha Rush | Awaiting course release |

Material status as of 2026-09-29: L1–L9 have slides and recordings, L10 and L11 have slides only, and nothing after L12 is public yet.

If you only plan to read a few, start with [lecture 1](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en) to get the "six capabilities × two paths" map, then A1 to see what a harness actually looks like, then A2 and the RL lectures to see how evaluation becomes a training signal.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [11-768 AI Agents course website](https://www.cmu-agents.com/) (overview, schedule, assignments, grading and policies; checked 2026-09-29)
- [Lecture 1 slides](https://www.cmu-agents.com/slides/lecture-01-agents.pdf) (prerequisite, grading, AI-tool policy, semester schedule)
- [Lecture 1 recording](https://www.youtube.com/watch?v=UwfjzyLnvMg)
- [cmu-agents/assignment-1](https://github.com/cmu-agents/assignment-1) (Assignment 1: Build an Agent Harness)
- [cmu-agents/assignment-2](https://github.com/cmu-agents/assignment-2) (Assignment 2: Evaluating a Data-Visualization Agent)
- On this site: [Reading Stanford CS329Z](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- On this site: [Reading Stanford CS336](/en/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)
