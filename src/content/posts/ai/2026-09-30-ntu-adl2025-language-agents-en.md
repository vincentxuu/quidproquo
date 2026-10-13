---
title: "Reasoning, Memory, Planning, and Multi-Agent Systems in Language Agents | NTU Yun-Nung Chen Applied Deep Learning Lecture 11"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, agent-memory]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 12
tldr: "Lecture 11 of ADL Fall 2025 builds on the EMNLP 2024 Language Agents tutorial. It defines an agent as an entity that perceives and acts, then names what is new about language agents: reasoning itself counts as an internal action. The lecture is organized around three concepts. Reasoning covers CoT and ReAct; memory covers Generative Agents and its recency / importance / relevance retrieval; planning goes from greedy reactive planning to tree search and world models. It closes with multi-agent systems in three steps: initialization, orchestration, and team optimization."
description: "A guide to the 11/10 Language Agents slides and videos 11.1–11.5 of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): the general definition of an agent and what language agents add, the logical / neural / language agent progression, CoT and ReAct, how reasoning enlarges the action space, short- and long-term memory, Generative Agents, social simulation, planning paradigms and world models (Deep Dyna-Q, D3Q, LLMs as user simulators), and the initialization, orchestration, and team optimization of multi-agent systems. Includes ReAct, memory-retrieval, and planning-cost examples and a self-check."
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

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 11 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) taught this lecture on 11/10, and the [course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) marks the week as Virtual. It is the last row on the course page with slides attached; the next three rows (Knowledge / Multimodality, Personalization, Reasoning) have titles only.

**Sources**: the slide deck [Language Agents (251110_LangAgent.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) (65 pages) and five videos: [11.1 Language Agents Introduction](https://youtu.be/R0YBJve0NoI) (21:11), [11.2 Reasoning](https://youtu.be/UO527XuWEzg) (21:40), [11.3 Memory](https://youtu.be/nAcLNc-H5Sc) (19:28), [11.4 Planning](https://youtu.be/ny7qcF1BzaA) (23:19), and [11.5 Multi-Agent Systems](https://youtu.be/0b8NdMfZ8Fs) (19:38). The videos are taught in Mandarin. All page numbers below refer to the PDF.

> **Version note**: The slide cover says November 10th, 2025 and names the [EMNLP 2024 Language Agents tutorial](https://language-agent-tutorial.github.io/) as its reference. The five videos were uploaded to the Fall 2025 playlist on 2025/11/10, but their descriptions carry the date 2024/12/04. I did not compare the video frames against the 2025 slides page by page; where they differ, this post follows the slides.

**Series**: Previous: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en) | Next: [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

There is no homework for this lecture. Slides and videos are public, with no extra gaps beyond the series-wide A2 grade. The question it answers: **everyone talks about agents, but what exactly is one, and what do reasoning, memory, planning, and multiple agents each solve?**

After this lecture you should be able to do four things: state the definition of an agent and what a language agent's "internal action" is; write out a ReAct-style trace with observation, thought, and action; say what short-term and long-term memory each hold and which three things matter when retrieving from long-term memory; and compare the costs of three ways of planning. Examples marked "made up for this post" are not from the lecture.

## What an agent is, and what language agents add

Slide 2 lays out both camps. Bill Gates, Andrew Ng, and Sam Altman are bullish on agents; the other side says current agents are thin wrappers around LLMs and that autoregressive LLMs can never reason or plan. The slides don't pick a side. They go back to definitions.

Slides 3–4 quote Russell and Norvig's *AI: A Modern Approach*: an agent is anything that perceives its environment through sensors and acts on it through actuators. In one line, **an agent is an entity that perceives and acts**, and a rational agent picks actions that maximize its (expected) utility.

Slide 5 explains what is new in a language agent:

- Generating reasoning tokens can be viewed as an **internal action**, taking place in an internal environment in the manner of an inner monologue.
- Self-reflection is a "meta" reasoning action: reasoning over the reasoning process.
- Reasoning serves better acting: inferring environment states, replanning, and so on.
- Percepts and external actions are represented in language.

Yun-Nung Chen, the instructor, explains it this way. At every step a language model chooses one token from the vocabulary to produce, which is itself an action. It differs from an action on the environment: the outward one is an external action, and producing tokens to think is an internal action that happens inside the agent. The definition of an agent has not changed; it still perceives the environment and chooses actions. What changed is that the step from perception to action is now done by a language model reasoning in language. She adds that if a better tool than language models appears later, that middle part can be swapped out and the concept of an agent stays the same.

The table on slide 6 compares three generations of agents:

| | Logical agent | Neural agent | Language agent |
|---|---|---|---|
| Expressiveness | Low: bounded by the logical language | Medium: whatever a (small) NN can encode | High: almost anything verbalizable |
| Reasoning | Logical inference: sound, explicit, rigid | Parametric inference: stochastic, implicit, rigid | Language-based: fuzzy, semi-explicit, flexible |
| Adaptivity | Low: bounded by knowledge curation | Medium: data-driven but sample-inefficient | High: strong LLM priors plus language use |

Her additions on the three columns: a logical agent reasons most rigorously, but handles only what the logical language can express. A neural agent's reasoning is hidden in the network, and you cannot see why it took an action. A language agent's reasoning is spoken out, so the process is visible; the cost is fuzziness, since anything that sounds plausible gets through, which is why people say language models can sound earnest while saying little.

Slide 7 sets the three key concepts for the rest of the lecture: **reasoning, memory, and planning**.

## Reasoning: CoT and ReAct

Slide 9 lays out a language agent's action space in three kinds: reasoning (update short-term memory, i.e. the context window), retrieval and learning (read and write long-term memory), and planning (choose an external action at inference time).

She first explains what "reasoning updates short-term memory" means: every sentence the model produces stays in the context window and is read by the model as it continues. One round of reflection adds a passage to the context, and by the second round what it sees has already changed. Short-term memory is whatever is in the context window.

- **[Chain-of-Thought](https://arxiv.org/abs/2201.11903)** (Wei et al. 2022, slide 10): have the model generate intermediate steps that imitate human thinking. With those steps in the context, the same model finds it easier to go on and state the correct answer.
- **Reasoning helps acting, and acting helps reasoning** (slides 11–12). The example on slide 12 asks, in Chinese, "Do you know NTU's Yun-Nung Chen?"; the model searches first, then answers from the results.
- **[ReAct](https://arxiv.org/abs/2210.03629)** (Yao et al. 2022, slides 13–17): interleave reasoning and acting. The slides draw two conclusions: both are essential, and reasoning provides explanations for controlling actions.

**Why action needs reasoning: the cooking-without-salt example.** Slide 11 shows the four observation and action boxes; the thought in between is what Chen adds in the video. A robot is cooking, the observation is "there is no salt," and the ideal next action is "turn right." Looking only at this observation-action pair there is no connection, and learning the mapping directly is very hard. Add the reasoning and it makes sense:

```text
Observation: cooking, and the salt has run out
Thought: This dish is savory. With no salt, I need something else salty. Soy sauce works. The soy sauce is in the cabinet on the right.
Action: turn right
Observation: a cabinet and a table
Action: open the cabinet
```

A person who sees no salt and turns right does so to get the soy sauce. The thought in the middle connects the observation to the action.

**Another benefit of ReAct: a person can edit its thoughts.** Slides 16–17 show a ReAct task in a virtual room (AlfWorld): put two keychains in the safe. After finding the first, the model decides the second is in a particular drawer, which it does not actually know; that is a hallucination. Because the thought is written text, a person can delete or change that sentence, and the later actions change with it instead of fixating on the same drawer.

Slides 18–19 add a more abstract but important point: **reasoning enlarges the action space**. The space of language and reasoning is infinite. A bigger action space means more capacity but harder decisions, and LLMs pick up reasoning priors by imitating many human reasoning traces. She goes on, with slide 20 (Yao et al. 2023), to say that choosing which direction to think in is itself a kind of planning: chain-of-thought is a straight line; you can also open many reasoning paths and trust the result that, say, eighty percent of them reach; and thinking can be expanded into a tree, with each step branching in several directions.

The [next post in this series, Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en), has videos but no slides, so it points back to the CoT and ReAct material on slides 8–20 here.

## Memory: short-term, long-term, and Generative Agents

The comparison on slide 22 is easy to remember:

| | Short-term memory | Long-term memory |
|---|---|---|
| Form | Instruction, Thought, Action, Obs appended in order | Read and write |
| Contents | Context for the current task | Experience, knowledge, skills |
| Limits | Append-only; limited context; limited attention | — |
| Persistence | Does not persist across new tasks | Persists over new experience |

She places long-term memory relative to RAG: the RAG covered earlier amounts to a read-only long-term memory, searched for relevant documents before each answer. Long-term memory here can also be written, storing new experience, knowledge, and skills for use in later tasks.

**[Generative Agents](https://arxiv.org/abs/2304.03442)** (Park et al. 2023, slides 23–25) faces a two-part problem: the context window can't hold the whole event stream, and it's hard to attend to the relevant events. The approach has two steps: simulate a series of events to build episodic memory, then retrieve from it. The point of slide 25 is that **retrieval should weigh recency, importance, and relevance together**, not relevance alone.

**Compute it once (made up for this post).** Someone asks the agent, "What are you most looking forward to?" Its memory has three entries, each scored from 0 to 1 on three criteria, and the three are added. The original example on slide 25 also adds them: its top entry is 2.34 = 0.91 + 0.63 + 0.80, and what is retrieved is the Valentine's Day party. The numbers below are my own:

| Memory | Recency | Importance | Relevance | Total |
|---|---|---|---|---|
| Last month a colleague mentioned a launch event at year-end | 0.2 | 0.6 | 0.8 | 1.6 |
| This morning my parents said there will be a party this weekend | 0.9 | 0.7 | 0.7 | 2.3 |
| This morning I spilled my coffee | 0.95 | 0.2 | 0.1 | 1.25 |

By relevance alone, the launch event is retrieved (0.8). With all three, the party is retrieved (2.3). This matches her example: both events are worth looking forward to, one heard long ago and one heard this morning, and a person thinks of the latter first.

Slides 26–30 cover social simulation agents (Zhang et al. 2024). Given the same line, "I passed the bar exam!", an agent that was just promoted suggests a party, while one that took the exam and failed replies half-heartedly. The slides use this work to show that an agent's own emotion changes its response. In simulated group discussions, negative emotion leans toward objections and positive emotion toward agreement, and groups in a positive mood tend to reach more peaceful decisions. She describes the method: a language model first synthesizes, for each character, a series of events during a day and the emotion each brings (spilling coffee in the morning, an urgent request at nine, fixing a stubborn bug at eleven thirty), and then the agents carrying those emotions hold conversations and meetings. Meetings with more negative emotion often end without a conclusion or with a compromise.

## Planning: from reactive to tree search to world models

Slide 32's definition: given a goal G, decide on a sequence of actions (a0, a1, …, an) that leads to a state passing the goal test g(·).

The slides build up with a few examples:

- **Commonsense-inferred planning** (Kuo & Chen 2023, slide 33): the user only says "I want to plan a trip to SF", the agent infers the implicit flight and hotel intents, and calls an airline bot and a hotel bot in turn.
- **Web planning agents** (Deng et al. 2024, slide 34): decompose a task into several web actions.

Both examples above break the goal into a few actions and execute them one by one. She explains why this falls short: if any step fails, such as a button that cannot be clicked, the whole process is stuck, because nothing provides feedback or adjustment. Tree search backs up to the previous step and tries another path on failure, estimating at each step how far the goal still is and turning back when that value drops. Its problem is that every step must really be carried out: some actions are hard to undo, such as changing a setting; some are unsafe; and finding out only after acting is slow.

Slides 35–37 compare three planning paradigms:

| Paradigm | Strengths | Weaknesses |
|---|---|---|
| Reactive (decide each step directly) | Fast, easy to implement | Greedy, short-sighted |
| Tree search with real interactions ([Koh et al. 2024](https://arxiv.org/abs/2407.01476)) | Systematic exploration | Irreversible actions, unsafe, slow |
| Model-based planning with a world model | Faster, safer, systematic exploration | How do you get a world model? |

### World models

Slide 38: **a world model is an environment simulator**. It answers "if I take action a_t in state s_t, what happens next?" Slides 39–42 illustrate it with two papers on dialogue policy learning (slide 41 lists the D3Q authors, Chen among them):

- **[Deep Dyna-Q](https://arxiv.org/abs/1801.06176)** (Peng et al. 2018): while interacting with real users, also learn a world model that generates simulated experience for planning. The catch is that low-quality fake experience drags policy learning down. Its benefit is fewer interactions with real users; the curves on slide 40 show that with a little simulated experience added, early learning is faster than with real interaction only. The legend on slide 40 reads DQN(1), DDQ(2), DDQ(5), DDQ(10), DDQ(20). Chen points to the yellow curve with the most simulated experience (DDQ(20) in the legend): it fluctuates heavily and ends below the blue real-interaction-only curve, while the red DDQ(5) curve, which she describes as four extra simulated interactions per real one, stays fairly stable.
- **[D3Q](https://arxiv.org/abs/1808.09442)** (Su et al. 2018): add a discriminator to filter out bad simulated experience. Policy learning becomes more robust, and human evaluation improves.

Slides 43–45 carry the thread to LLMs: **an LLM can serve directly as a user simulator**. Slide 44 shows role-play prompts for an extroverted and an introverted persona, and the slides conclude that this makes diverse user simulators easy to build for training assistants. Slide 45 adds that LLMs can predict state transitions in some cases. Slides 46–47 cite [Gu et al. 2024](https://arxiv.org/abs/2411.06559) on web agents: on VisualWebArena, model-based planning is more accurate than reactive planning and more efficient than tree search.

She describes how it works in practice: facing several clickable options, first ask the LLM to imagine what the page becomes after each click, such as "the product detail page, with the name, dimensions, and customer reviews," then evaluate how close each imagined state is to the goal, and actually execute the closest one.

**Counting the cost (made up for this post).** Suppose each step has 3 options and the task takes 4 steps.

- Reactive: choose one directly at each step and really execute 4 actions. A wrong choice has no remedy.
- Tree search in the real environment: in the worst case all three options are really tried at every step, and fully expanding four levels gives 3 + 9 + 27 + 81 = 120 nodes, so real operations far exceed 4, and some cannot be undone.
- Model-based: simulate 3 options at each step, 12 simulations in all, and still really execute only 4 actions.

The numbers on slide 47 point the same way: success rates are 17.7% for reactive, 23.6% for model-based, and 26.4% for tree search; action steps are 4.3, 4.6, and 11.6; wall-clock times are 80, 199, and 836 seconds. Model-based planning succeeds slightly less often than tree search while taking about as many actions as reactive planning.

## Multi-agent systems

Slide 49 lists the motivations: a single agent isn't strong enough, multiple agents scale easily in parallel, different agents represent different expertise, and control can be decentralized and privacy-preserving. Slide 50 splits construction into three steps:

1. **Agent initialization**: by persona description (slide 52, the long profile of pharmacy shopkeeper John Lin from Generative Agents), or by roles and actions (Chen et al. 2024, slides 53–54).
2. **Orchestration**: [multi-agent debate](https://arxiv.org/abs/2305.14325) (Du et al. 2023, slides 56–58) improves factuality and reasoning; [AutoGen](https://arxiv.org/abs/2308.08155) (Wu et al. 2023, slides 59–60) lets agents interact through conversation, which the slides call conversational programming. She walks through a debate: two agents each solve the same math problem, in round one answering 225 and 595, and neither knows who is right. In round two each agent reads the other's solution and decides whether to revise, and the wrong one changes to 560, still wrong. In round three it reads again, agrees with the other's calculation, and changes to 595, so the two reach consensus. Her analogy is the saying that three cobblers outdo one master strategist. AutoGen does not require pairwise debate: three parties can talk together, or it can be layered like a manager and reports.
3. **Team optimization**: optimize the team by selecting agents ([Liu et al. 2024](https://arxiv.org/abs/2310.02170), slides 62–63). After optimization, a team of the same size gets better results with fewer API calls. She explains why selection is needed: having every agent read every other agent's reply each round takes time, and for a given question some agent may simply be unsuited, like giving a biology question to someone who never took biology. The method has agents score one another's first-round replies, like peer review, and leaves the low scorers out of that question. The numbers on slide 63: plain debate among 4 agents reaches about 69.3% with 12 calls, and the selected team of 4 reaches 70.5% with 4.39 calls on average. The same chart shows that fewer is not always better: with only 2 agents kept, accuracy falls to 68.4%, below the unselected baseline.

The summary on slide 64 boils each concept down to a line or two. Reasoning is an internal action for agents: reasoning guides acting, and acting updates reasoning. Language agents interact with both external environments and internal memories. Reasoning in language enables new planning abilities.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"The agent is a concept that arrived with language models."** The definition comes from classical AI: anything that perceives its environment and acts on it. Language models are the tool now used for the reasoning in between.
- **"Reasoning is the model writing a few more sentences before answering."** In this lecture's framing, reasoning is an internal action that updates the short-term memory in the context window, with the purpose of choosing a better external action.
- **"Long-term memory is RAG."** RAG reads and does not write, and looks only at relevance. Long-term memory here can store new experience, and retrieval also weighs recency and importance.
- **"Tree search is the most complete, so it is best."** It has to try things step by step in the real environment, where some actions cannot be undone, and it is slow.
- **"More agents are always better."** Each added agent raises the communication cost of every round. Selecting the agents suited to a question gives better results with fewer calls, though selecting too few lowers accuracy.

## Self-check

The questions were written for this post.

**1. A language agent produces the text "I should look up what this word means first" and then calls a search tool. Which is the internal action and which the external one?**

Producing the text is the internal action; it only updates the context. Calling the search tool is the external action; it acts on the environment and brings back a new observation.

**2. Following the cooking example, write the full observation, thought, and action for this case: a robot is to make tea and finds the kettle empty.**

For example: Observation "making tea, and the kettle is empty"; Thought "Tea needs hot water. The kettle is empty, so it has to be filled first. The tap is at the sink"; Action "walk to the sink." The criterion is whether the thought connects the observation to the action.

**3. Using the three-memory table above, change the question to "What happened to you this morning?" so the three relevance scores become 0.1, 0.8, and 0.9, with everything else the same. Which entry is retrieved?**

The totals become 0.2 + 0.6 + 0.1 = 0.9, 0.9 + 0.7 + 0.8 = 2.4, and 0.95 + 0.2 + 0.9 = 2.05. The party is still retrieved, because of its high importance, and the spilled coffee comes second.

**4. An agent must "change the shipping address" on a website for a user and then place an order. Why is tree search in the real environment a poor fit?**

Changing the address is an action that leaves a result, which may not be undoable after a wrong try, and a wrong order might really be placed. By this lecture's account, tasks like this are better simulated with a world model first. (Confirming with the user before executing is this post's addition, not from the lecture.)

**5. What question does a world model answer? In a conversational assistant, who is the environment?**

It answers "in state s, after action a, what happens next." For a conversational assistant the environment is the user, and the world model predicts what the user will say next.

**6. Four agents debate for three rounds, each calling the model once per round. How many calls in total? What if only two agents are selected per question?**

Under the question's simplified assumption it is 4 × 3 = 12 calls; the debate baseline on slide 63 is also 12, though the slide does not say how many rounds it ran. With two agents still running three rounds, 2 × 3 = 6. This is a simplification: the method in the deck drops agents partway, and the averages measured on slide 63 are 4.39 calls for a team of 4 and 2.83 for a team of 2. Fewer calls does not mean better: with only 2 agents kept, accuracy is 68.4%, below the unselected baseline.

## Further reading

- [Reading CMU 11-768 AI Agents](/posts/ai/2026-09-29-cmu-11768-course-overview-en): a whole course on agents, especially [Lecture 4: Skills and Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en) and [Lecture 5: Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en).
- [CME295 Lecture 7: Agentic LLMs](/posts/ai/2026-09-29-cme295-agentic-llms-en) and [CME295 2026 Lecture 6 preview: AI Agents](/posts/ai/2026-09-29-cme295-ai-agents-en)
- [CS224N Lecture 10: Six Components of RAG and Language Agents](/posts/ai/2026-08-22-cs224n-rag-language-agents-en)

Previous: [Bias, Safety, Hallucination, and Alignment + Final Project](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)
Next: [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=R0YBJve0NoI
title: ADL 11.1: Language Agents Introduction (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=UO527XuWEzg
title: ADL 11.2: Reasoning (YouTube, in Mandarin)
```

Original videos: [ADL 11.1: Language Agents Introduction (YouTube, in Mandarin)](https://www.youtube.com/watch?v=R0YBJve0NoI), [ADL 11.2: Reasoning (YouTube, in Mandarin)](https://www.youtube.com/watch?v=UO527XuWEzg), [ADL 11.3: Memory (YouTube, in Mandarin)](https://www.youtube.com/watch?v=nAcLNc-H5Sc), [ADL 11.4: Planning (YouTube, in Mandarin)](https://www.youtube.com/watch?v=ny7qcF1BzaA), [ADL 11.5: Multi-Agent Systems (YouTube, in Mandarin)](https://www.youtube.com/watch?v=0b8NdMfZ8Fs)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): all five videos (11.1–11.5) were worked from their captions. 11.1 opens with "this is the second-to-last class of the semester" and its description is dated 2024/12/04, so these are recordings from the 2024 term.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed 11.1 and 11.2 match the article, and the version note holds (the video calls itself the second-to-last class, so it is a 2024 recording).
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Added explanations from the spoken content of the five videos, the cooking-without-salt ReAct example, examples for memory retrieval and planning cost, common misreadings, and a self-check with answers.

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
