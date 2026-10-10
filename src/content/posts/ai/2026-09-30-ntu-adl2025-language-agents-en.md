---
title: "NTU ADL 2025 Lecture 11: Reasoning, Memory, Planning, and Multi-Agent Systems in Language Agents"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, agent-memory]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 14
tldr: "Lecture 11 of ADL Fall 2025 builds on the EMNLP 2024 Language Agents tutorial. It defines an agent as an entity that perceives and acts, then names what is new about language agents: reasoning itself counts as an internal action. The lecture is organized around three concepts. Reasoning covers CoT and ReAct; memory covers Generative Agents and its recency / importance / relevance retrieval; planning goes from greedy reactive planning to tree search and world models. It closes with multi-agent systems in three steps: initialization, orchestration, and team optimization."
description: "A guide to the 11/10 Language Agents slides and videos 11.1–11.5 of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): the general definition of an agent and what language agents add, the logical / neural / language agent progression, CoT and ReAct, how reasoning enlarges the action space, short- and long-term memory, Generative Agents, social simulation, planning paradigms and world models (Deep Dyna-Q, D3Q, LLMs as user simulators), and the initialization, orchestration, and team optimization of multi-agent systems."
draft: false
glossary:
  - term: "language agent"
    definition: "An agent that integrates an LLM, represents percepts and external actions in language, and treats generating reasoning tokens as an internal action."
    context: "The definition on slide 5."
  - term: "ReAct"
    definition: "Having an LLM interleave reasoning (Thought) and action (Action), feeding the environment's response (Observation) back into the next reasoning step."
    context: "Slides 13–17 cite Yao et al. 2022 and conclude that reasoning and acting are both essential."
  - term: "world model"
    definition: "An environment simulator: given the current state and an action, it predicts what happens next (the next state or observation)."
    context: "Slides 38–47 use it to connect dialogue planning with model-based planning for web agents."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-language-agents)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This is post 14 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) taught this lecture on 11/10, and the [course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) marks the week as Virtual. It is the last row on the course page with slides attached; the next three rows (Knowledge / Multimodality, Personalization, Reasoning) have titles only.

**Sources**: the slide deck [Language Agents (251110_LangAgent.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) (65 pages) and five videos: [11.1 Language Agents Introduction](https://youtu.be/R0YBJve0NoI) (21:11), [11.2 Reasoning](https://youtu.be/UO527XuWEzg) (21:40), [11.3 Memory](https://youtu.be/nAcLNc-H5Sc) (19:28), [11.4 Planning](https://youtu.be/ny7qcF1BzaA) (23:19), and [11.5 Multi-Agent Systems](https://youtu.be/0b8NdMfZ8Fs) (19:38). The videos are taught in Mandarin. I checked the slides on 2026-09-30, and all page numbers below refer to the PDF.

> **Version note**: The slide cover says November 10th, 2025 and names the [EMNLP 2024 Language Agents tutorial](https://language-agent-tutorial.github.io/) as its reference. The five videos were uploaded to the Fall 2025 playlist on 2025/11/10, but their descriptions carry the date 2024/12/04. I did not compare the video frames against the 2025 slides page by page; where they differ, this post follows the slides.

**Series**: Previous: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | Next: [Reasoning (videos only)](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

There is no homework for this lecture. Slides and videos are public, with no extra gaps beyond the series-wide A2 grade. The question it answers: **everyone talks about agents, but what exactly is one, and what do reasoning, memory, planning, and multiple agents each solve?**

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=R0YBJve0NoI
title: ADL 11.1: Language Agents Introduction (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=UO527XuWEzg
title: ADL 11.2: Reasoning (YouTube, in Mandarin)
```

Original videos: [ADL 11.1: Language Agents Introduction (YouTube, in Mandarin)](https://www.youtube.com/watch?v=R0YBJve0NoI)、[ADL 11.2: Reasoning (YouTube, in Mandarin)](https://www.youtube.com/watch?v=UO527XuWEzg)、[ADL 11.3: Memory (YouTube, in Mandarin)](https://www.youtube.com/watch?v=nAcLNc-H5Sc)、[ADL 11.4: Planning (YouTube, in Mandarin)](https://www.youtube.com/watch?v=ny7qcF1BzaA)、[ADL 11.5: Multi-Agent Systems (YouTube, in Mandarin)](https://www.youtube.com/watch?v=0b8NdMfZ8Fs)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## What an agent is, and what language agents add

Slide 2 lays out both camps. Bill Gates, Andrew Ng, and Sam Altman are bullish on agents; the other side says current agents are thin wrappers around LLMs and that autoregressive LLMs can never reason or plan. The slides don't pick a side. They go back to definitions.

Slides 3–4 quote Russell and Norvig's *AI: A Modern Approach*: an agent is anything that perceives its environment through sensors and acts on it through actuators. In one line, **an agent is an entity that perceives and acts**, and a rational agent picks actions that maximize its (expected) utility.

Slide 5 explains what is new in a language agent:

- Generating reasoning tokens can be viewed as an **internal action**, taking place in an internal environment in the manner of an inner monologue.
- Self-reflection is a "meta" reasoning action: reasoning over the reasoning process.
- Reasoning serves better acting: inferring environment states, replanning, and so on.
- Percepts and external actions are represented in language.

The table on slide 6 compares three generations of agents:

| | Logical agent | Neural agent | Language agent |
|---|---|---|---|
| Expressiveness | Low: bounded by the logical language | Medium: whatever a (small) NN can encode | High: almost anything verbalizable |
| Reasoning | Logical inference: sound, explicit, rigid | Parametric inference: stochastic, implicit, rigid | Language-based: fuzzy, semi-explicit, flexible |
| Adaptivity | Low: bounded by knowledge curation | Medium: data-driven but sample-inefficient | High: strong LLM priors plus language use |

Slide 7 sets the three key concepts for the rest of the lecture: **reasoning, memory, and planning**.

## Reasoning: CoT and ReAct

Slide 9 lays out a language agent's action space in three kinds: reasoning (update short-term memory, i.e. the context window), retrieval and learning (read and write long-term memory), and planning (choose an external action at inference time).

- **[Chain-of-Thought](https://arxiv.org/abs/2201.11903)** (Wei et al. 2022, slide 10): have the model generate intermediate steps that imitate human thinking.
- **Reasoning helps acting, and acting helps reasoning** (slides 11–12). The example on slide 12 asks, in Chinese, "Do you know NTU's Yun-Nung Chen?"; the model searches first, then answers from the results.
- **[ReAct](https://arxiv.org/abs/2210.03629)** (Yao et al. 2022, slides 13–17): interleave reasoning and acting. The slides draw two conclusions: both are essential, and reasoning provides explanations for controlling actions.

Slides 18–19 add a more abstract but important point: **reasoning enlarges the action space**. The space of language and reasoning is infinite. A bigger action space means more capacity but harder decisions, and LLMs pick up reasoning priors by imitating many human reasoning traces. Slide 20 follows with Yao et al. 2023 on using action planning to improve reasoning.

The [next post in this series, Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en), has videos but no slides, so it points back to the CoT and ReAct material on slides 8–20 here.

## Memory: short-term, long-term, and Generative Agents

The comparison on slide 22 is easy to remember:

| | Short-term memory | Long-term memory |
|---|---|---|
| Form | Instruction, Thought, Action, Obs appended in order | Read and write |
| Contents | Context for the current task | Experience, knowledge, skills |
| Limits | Append-only; limited context; limited attention | — |
| Persistence | Does not persist across new tasks | Persists over new experience |

**[Generative Agents](https://arxiv.org/abs/2304.03442)** (Park et al. 2023, slides 23–25) faces a two-part problem: the context window can't hold the whole event stream, and it's hard to attend to the relevant events. The approach has two steps: simulate a series of events to build episodic memory, then retrieve from it. The point of slide 25 is that **retrieval should weigh recency, importance, and relevance together**, not relevance alone.

Slides 26–30 cover social simulation agents (Zhang et al. 2024). Given the same line, "I passed the bar exam!", an agent that was just promoted suggests a party, while one that took the exam and failed replies half-heartedly. The slides use this work to show that an agent's own emotion changes its response. In simulated group discussions, negative emotion leans toward objections and positive emotion toward agreement, and groups in a positive mood tend to reach more peaceful decisions.

## Planning: from reactive to tree search to world models

Slide 32's definition: given a goal G, decide on a sequence of actions (a0, a1, …, an) that leads to a state passing the goal test g(·).

The slides build up with a few examples:

- **Commonsense-inferred planning** (Kuo & Chen 2023, slide 33): the user only says "I want to plan a trip to SF", the agent infers the implicit flight and hotel intents, and calls an airline bot and a hotel bot in turn.
- **Web planning agents** (Deng et al. 2024, slide 34): decompose a task into several web actions.

Slides 35–37 compare three planning paradigms:

| Paradigm | Strengths | Weaknesses |
|---|---|---|
| Reactive (decide each step directly) | Fast, easy to implement | Greedy, short-sighted |
| Tree search with real interactions ([Koh et al. 2024](https://arxiv.org/abs/2407.01476)) | Systematic exploration | Irreversible actions, unsafe, slow |
| Model-based planning with a world model | Faster, safer, systematic exploration | How do you get a world model? |

### World models

Slide 38: **a world model is an environment simulator**. It answers "if I take action a_t in state s_t, what happens next?" Slides 39–42 illustrate it with two papers on dialogue policy learning (slide 41 lists the D3Q authors, Chen among them):

- **[Deep Dyna-Q](https://arxiv.org/abs/1801.06176)** (Peng et al. 2018): while interacting with real users, also learn a world model that generates simulated experience for planning. The catch is that low-quality fake experience drags policy learning down.
- **[D3Q](https://arxiv.org/abs/1808.09442)** (Su et al. 2018): add a discriminator to filter out bad simulated experience. Policy learning becomes more robust, and human evaluation improves.

Slides 43–45 carry the thread to LLMs: **an LLM can serve directly as a user simulator**. Slide 44 shows role-play prompts for an extroverted and an introverted persona, and the slides conclude that this makes diverse user simulators easy to build for training assistants. Slide 45 adds that LLMs can predict state transitions in some cases. Slides 46–47 cite [Gu et al. 2024](https://arxiv.org/abs/2411.06559) on web agents: on VisualWebArena, model-based planning is more accurate than reactive planning and more efficient than tree search.

## Multi-agent systems

Slide 49 lists the motivations: a single agent isn't strong enough, multiple agents scale easily in parallel, different agents represent different expertise, and control can be decentralized and privacy-preserving. Slide 50 splits construction into three steps, each with two examples:

1. **Agent initialization**: by persona description (slide 52, the long profile of pharmacy shopkeeper John Lin from Generative Agents), or by roles and actions (Chen et al. 2024, slides 53–54).
2. **Orchestration**: [multi-agent debate](https://arxiv.org/abs/2305.14325) (Du et al. 2023, slides 56–58) improves factuality and reasoning; [AutoGen](https://arxiv.org/abs/2308.08155) (Wu et al. 2023, slides 59–60) lets agents interact through conversation, which the slides call conversational programming.
3. **Team optimization**: optimize the team by selecting agents ([Liu et al. 2024](https://arxiv.org/abs/2310.02170), slides 62–63). After optimization, a team of the same size gets better results with fewer API calls.

The summary on slide 64 boils each concept down to a line or two. Reasoning is an internal action for agents: reasoning guides acting, and acting updates reasoning. Language agents interact with both external environments and internal memories. Reasoning in language enables new planning abilities.

## How to self-study this lecture

1. Start with 11.1 and get slide 5 ("reasoning is an internal action") and slide 9's three kinds of actions clear. The other four videos build on them.
2. Pair 11.2 with the ReAct paper, and 11.3 with the memory retrieval section of the Generative Agents paper.
3. The planning paradigms table in 11.4 (slide 37) is the most useful single slide in the lecture. Afterward, try sorting the agent frameworks you know into its three rows.

One thing you can do tonight: take an agent you use or are building, and following slide 22's table, write down what goes into its short-term and long-term memory. Then ask whether its long-term retrieval considers recency and importance, or relevance only.

## Further reading

- [Reading CMU 11-768 AI Agents](/posts/ai/2026-09-29-cmu-11768-course-overview-en): a whole course on agents, especially [Lecture 4: Skills and Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en) and [Lecture 5: Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en).
- [CME295 Lecture 7: Agentic LLMs](/posts/ai/2026-09-29-cme295-agentic-llms-en) and [CME295 2026 Lecture 6 preview: AI Agents](/posts/ai/2026-09-29-cme295-ai-agents-en)
- [CS224N Lecture 10: Six Components of RAG and Language Agents](/posts/ai/2026-08-22-cs224n-rag-language-agents-en)

Previous: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)
Next: [Reasoning (videos only)](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 11/10 schedule row
- [Language Agents slides (251110_LangAgent.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) — all page numbers in this post
- [EMNLP 2024 Tutorial: Language Agents: Foundations, Prospects, and Risks](https://language-agent-tutorial.github.io/) — the deck's reference source
- [ADL 11.1: Language Agents Introduction (YouTube, in Mandarin)](https://youtu.be/R0YBJve0NoI)
- [ADL 11.2: Reasoning (YouTube, in Mandarin)](https://youtu.be/UO527XuWEzg)
- [ADL 11.3: Memory (YouTube, in Mandarin)](https://youtu.be/nAcLNc-H5Sc)
- [ADL 11.4: Planning (YouTube, in Mandarin)](https://youtu.be/ny7qcF1BzaA)
- [ADL 11.5: Multi-Agent Systems (YouTube, in Mandarin)](https://youtu.be/0b8NdMfZ8Fs)
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Park et al., Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- [Koh et al., Tree Search for Language Model Agents](https://arxiv.org/abs/2407.01476)
- [Peng et al., Deep Dyna-Q: Integrating Planning for Task-Completion Dialogue Policy Learning](https://arxiv.org/abs/1801.06176)
- [Su et al., Discriminative Deep Dyna-Q: Robust Planning for Dialogue Policy Learning (EMNLP 2018)](https://arxiv.org/abs/1808.09442)
- [Gu et al., Is Your LLM Secretly a World Model of the Internet? Model-Based Planning for Web Agents](https://arxiv.org/abs/2411.06559)
- [Du et al., Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325)
- [Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- [Liu et al., A Dynamic LLM-Powered Agent Network for Task-Oriented Agent Collaboration](https://arxiv.org/abs/2310.02170)
