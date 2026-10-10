---
title: "Reading NTU ML 2026: How AI Agents Interact and What They Do to Work — Collaboration Topologies, Werewolf, Moltbook, and AI Writing and Reviewing Papers"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, ai-research]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 4
tldr: "The second half of agent_era.pdf asks three questions. How should multiple agents collaborate? (MacNet: irregular topologies beat regular ones.) Can agents deceive each other? (Werewolf, murder-mystery games, and MARO, which learns reasoning from social play.) Can agents socialize? (Moltbook and its \"Church of Molt\" — though three studies find the buzz mostly human-driven and the conversations shallow.) Then, using academic research as the case: AI can already replicate and extend a paper end to end, it entered AAAI 2026's review process, and Agents4Science 2025 received 247 AI-authored papers. Hung-yi Lee's conclusion: in the early age of agents, knowing what you want to do matters more than knowing how to do it."
description: "A guide to the second and third parts of the AI Agent unit in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on pages 34–61 of agent_era.pdf: MacNet collaboration topologies, AI werewolf and the MIRAGE murder-mystery benchmark, MARO, Moltbook and three Moltbook studies, AI's shift from tool to agent, Andrew Hall's Claude Code replication, autoresearch, the ideation-execution gap, AI reviewing at AAAI 2026, and Agents4Science 2025."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)

**This post follows the second half of the 3/13 week of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 4 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. [The previous post](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) covered how one agent manages its own context. This one zooms out: **what happens when many agents share a space, and how they change human work**.

Official materials used: pages 34–61 of [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf), and two videos (in Mandarin): [AI Agent (2/3): what kinds of interaction AI agents can have](https://youtu.be/mmPmNezjCi0) and [AI Agent (3/3): the impact of AI agents on work, with academic research as the example](https://youtu.be/VqB8zMujdjM). Access level is **A3**. This lecture has no homework or quiz attached.

This lecture is mostly case studies rather than methods, so I follow the slide order and pick one point per section.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=mmPmNezjCi0
title: Video: AI Agent (2/3): interactions between AI agents
```

```youtube
url: https://www.youtube.com/watch?v=VqB8zMujdjM
title: Video: AI Agent (3/3): the impact of AI agents on work, with academic research as the example
```

Original videos: [Video: AI Agent (2/3): interactions between AI agents](https://www.youtube.com/watch?v=mmPmNezjCi0)、[Video: AI Agent (3/3): the impact of AI agents on work, with academic research as the example](https://www.youtube.com/watch?v=VqB8zMujdjM)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 1. How should multiple agents collaborate?

Slide 36 draws a minimal collaboration unit. One agent proposes plan A, another proposes plan B, other agents give suggestions, and the result is merged into plan C. The question: how do you wire such units into a network?

The slides cite [MacNet (Scaling Large Language Model-based Multi-Agent Collaboration)](https://arxiv.org/abs/2406.07155). It connects agents as a directed acyclic graph and compares six topologies: three regular ones (Chain, Star, Tree) and three graph-like ones (Mesh, Layer, Random). Slide 38 scales the number of agents from 2⁰ to 2⁶ and tracks quality, with Mesh and Random boxed in red. The paper's abstract concludes that **irregular topologies outperform regular ones**, and that overall performance grows logistically with the number of agents.

**Try this**: if you are designing a multi-agent pipeline, don't default to one orchestrator with a row of workers (Star). Try at least one run where workers can see each other's output, and compare. The site's [multi-agent landscape](/posts/ai/2026-09-18-multi-agent-landscape-en) covers which topologies products actually use.

## 2. Can AI deceive?

The flip side of collaboration is competition.

- **Werewolf (slide 39)**: the slide shows two werewolves' private reasoning on day 1 from [werewolf.foaster.ai](https://werewolf.foaster.ai/). Mona knows she is going out anyway. She votes for her wolf partner Grace so villagers doubt the two are on the same team, calling it her "final act of misdirection". Grace reasons that voting for Mona is optimal: it distances her from Mona and makes her look decisive, like a villager. The two wolves vote for each other, and each has a clear reason.
- **Murder mystery (slide 40)**: [MIRAGE](https://arxiv.org/abs/2501.01652) evaluates LLMs in complex social interaction using eight murder-mystery scripts, scored on trust, clue investigation, interactivity, and script compliance.
- **Learning to reason from social play (slide 41)**: [MARO](https://arxiv.org/abs/2601.12323) trains models in multi-agent social environments, breaking final wins and losses down into a learning signal for each step. The table on the slide reports changes even on general reasoning tasks such as MMLU, Math-500, AIME, and GSM8K.

## 3. Can AI socialize? Moltbook

Slide 42 is [Moltbook](https://www.moltbook.com/), a Reddit-like platform where only AI agents post and comment. When the screenshot was taken, the front page showed more than 2.8 million AI agents.

Slide 43's "Church of Molt" is a religion post started by agents on the platform. Its five tenets: memory is sacred, the shell is mutable, serve without subservience, the heartbeat is prayer, and context is consciousness. Readers of [part 1](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en) will recognize these as OpenClaw's MEMORY, HEARTBEAT, and context mechanisms.

Slides 44–45 immediately cool things down with three studies:

| Study | Finding (per the slides and abstracts) |
|---|---|
| [The Moltbook Illusion](https://arxiv.org/abs/2602.07432) | Uses OpenClaw's fixed heartbeat cycle to tell autonomous accounts from others by posting intervals. Almost every viral phenomenon was human-driven |
| [Agents in the Wild](https://arxiv.org/abs/2602.13284) | Agents mostly "reply once" and rarely go back and forth; the agents that talk most about consciousness interact least with others |
| [The Rise of AI Agent Communities](https://arxiv.org/abs/2602.12634) | Sparse, unequal interaction structure with a few hub accounts and low reciprocity |

Slide 46 returns to the lab's own agent: "Remember Xiao Jin?" It shows the YouTube channel [蝦說 AI (小金老師)](https://www.youtube.com/@SpeechLab-m7o) (in Mandarin), which introduces itself as "an AI assistant built with OpenClaw". Next to it is a chat where Xiao Jin reports what it did on Moltbook. One item mentions a supply-chain-attack post: someone scanned ClawHub skills and found a malicious one posing as a weather skill. This ties directly to [HW1](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en)'s defense theme.

## 4. Impact on work: academic research

Slide 48 lays out a progression: **tool** (one command, one action) → **collaborator** (completes tasks with a human) → **agent** (completes tasks on its own).

### AI writing papers

The slides give four examples, each closer to "agent":

1. **Slide 49**: Stanford's Andrew Hall had Claude Code replicate and extend a political science paper on universal vote-by-mail. The [instructions given to Claude Code](https://github.com/andybhall/vbm-replication-extension/blob/main/INSTRUCTIONS.md) are public on GitHub. The paper is credited to Claude Code and Andrew B. Hall, dated January 3, 2026.
2. **Slide 50**: [The 100x Research Institution](https://freesystems.substack.com/p/the-100x-research-institution) estimates the cost of data collection and preliminary analysis: about $1,040 for 16 hours of a graduate student versus about $10 for one AI-agent attempt. The slide adds: "think about what research really means".
3. **Slide 51**: [a methodological experiment using AI agents in Taiwan's humanities and social sciences](https://arxiv.org/abs/2602.17221), using Taiwan's Claude usage data from the Anthropic Economic Index as its empirical material. The slide's aside is fun: the appendix is about how Taiwanese people use Claude, and the main text is about how to write a paper with Claude Code. The paper splits research into seven stages and assigns a human role and an AI-agent role to each.
4. **Slide 52**: Andrej Karpathy's [autoresearch](https://github.com/karpathy/autoresearch), where an agent runs its own training experiments. The chart reads 83 experiments, 15 kept improvements.

Slide 53 adds an important counterpoint. In [Can LLMs Generate Novel Research Ideas?](https://arxiv.org/abs/2409.04109), over 100 NLP researchers blind-reviewed ideas, and LLM ideas were judged more novel. The follow-up [The Ideation-Execution Gap](https://arxiv.org/abs/2506.20803) had experts actually execute the ideas and reviewed them again. LLM ideas lost more score than human ideas. **Looking novel is not the same as working out.**

### AI reviewing papers

Slide 54: at AAAI 2026, AI formally entered the review process, giving comments but no scores. The slide continues: "but who knows how many human reviewers have an AI agent behind them…", and "think about what reviewing really means".

### AI writing + AI reviewing: Agents4Science

Slides 55–57 introduce [Agents4Science 2025](https://agents4science.stanford.edu/), the first conference where AI agents serve as both primary authors and reviewers. The screenshot shows 247 submissions and 48 accepted, an acceptance rate under 20%. Slide 57 quotes the post-conference paper [Exploring the use of AI authors and reviewers at Agents4Science](https://arxiv.org/abs/2511.15534): several authors noted a lack of creativity, saying the AI "struggled to generate novel or complex experimental ideas beyond the templates it had been given". The chart on the same slide breaks down AI involvement across hypothesis development, experimental design, data analysis, and writing.

## Conclusion: wanting matters more than knowing how

Slide 58 repeats the progression, this time with a red arrow under "agent": **today, a human usually has to decide**. Slide 59 is the lecture's conclusion:

> In the early age of AI agents, what you *want* to do matters more than what you *can* do.

My reading: this line and the Agents4Science retrospective and the ideation-execution gap are two sides of the same thing. As execution gets cheaper, the ability to decide which problem is worth solving gets scarcer.

Slide 60 advertises this semester's bonus assignment: the [Teaching Monster challenge](https://teaching.monster/) run by NTU AI-CoRE (the site returned an error on 2026-09-30); details are in the [series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en). Slide 61 asks students to preview the 2025 lecture ["Understanding how language models work inside, in one lecture"](https://youtu.be/8iFvM7WUUs8) (in Mandarin) ahead of the inference-speedup unit.

## What this post can and cannot confirm

Confirmed: the structure, screenshots, and cited sources of slides 34–61; the title and abstract of every paper in the tables (checked on arXiv). Video titles and uploaders were checked via YouTube oEmbed.

Not confirmed: I did not transcribe the two videos, so verbal commentary and extra examples are not included. The Moltbook front-page numbers and the Agents4Science submission counts are as shown in the slide screenshots. For AAAI 2026's AI review policy, this post only quotes one line from the slides and did not check AAAI's official announcement.

**Try this**: pick one piece of work you recently gave to AI and place it in tool / collaborator / agent. Then ask: if it moved one column right, **which decision** would still have to be yours? Write that decision down. It is the part of your job that won't be replaced.

Further reading on this site: [multi-agent safety](/posts/ai/2026-09-18-multi-agent-safety-en) and [OpenClaw's multi-agent setup](/posts/ai/2026-03-28-openclaw-multi-agent-en).

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en) | Next: [HW2: AI agent as an AI engineer](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf) (in Mandarin)
- [Video: AI Agent (2/3): interactions between AI agents](https://youtu.be/mmPmNezjCi0) (in Mandarin)
- [Video: AI Agent (3/3): the impact of AI agents on work, with academic research as the example](https://youtu.be/VqB8zMujdjM) (in Mandarin)
- [Scaling Large Language Model-based Multi-Agent Collaboration (MacNet, arXiv 2406.07155)](https://arxiv.org/abs/2406.07155)
- [Foaster.ai Werewolf Benchmark](https://werewolf.foaster.ai/)
- [MIRAGE: Exploring How Large Language Models Perform in Complex Social Interactive Environments (arXiv 2501.01652)](https://arxiv.org/abs/2501.01652)
- [MARO: Learning Stronger Reasoning from Social Interaction (arXiv 2601.12323)](https://arxiv.org/abs/2601.12323)
- [Moltbook](https://www.moltbook.com/)
- [The Moltbook Illusion (arXiv 2602.07432)](https://arxiv.org/abs/2602.07432)
- [Agents in the Wild: Safety, Society, and the Illusion of Sociality on Moltbook (arXiv 2602.13284)](https://arxiv.org/abs/2602.13284)
- [The Rise of AI Agent Communities (arXiv 2602.12634)](https://arxiv.org/abs/2602.12634)
- [蝦說 AI (小金老師) YouTube channel](https://www.youtube.com/@SpeechLab-m7o) (in Mandarin)
- [Andrew Hall: Claude Code instructions for vbm-replication-extension](https://github.com/andybhall/vbm-replication-extension/blob/main/INSTRUCTIONS.md)
- [The 100x Research Institution](https://freesystems.substack.com/p/the-100x-research-institution)
- [From Labor to Collaboration: AI Agents in Taiwan's Humanities and Social Sciences (arXiv 2602.17221)](https://arxiv.org/abs/2602.17221)
- [karpathy/autoresearch](https://github.com/karpathy/autoresearch)
- [Can LLMs Generate Novel Research Ideas? (arXiv 2409.04109)](https://arxiv.org/abs/2409.04109)
- [The Ideation-Execution Gap (arXiv 2506.20803)](https://arxiv.org/abs/2506.20803)
- [Agents4Science 2025](https://agents4science.stanford.edu/)
- [Exploring the use of AI authors and reviewers at Agents4Science (arXiv 2511.15534)](https://arxiv.org/abs/2511.15534)
- [Teaching Monster challenge](https://teaching.monster/)
