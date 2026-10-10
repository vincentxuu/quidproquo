---
title: "Reading NTU ADL 2025 Fall: Reasoning — A Video-Only Lecture, Five Steps from CoT to RL"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, reasoning, chain-of-thought, test-time-scaling]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 15
tldr: "The Reasoning lecture of NTU ADL Fall 2025 has no public slides. It exists only as five videos in the course playlist: 12.1 What is Reasoning?, 12.2 Short CoT, 12.3 Test-Time Scaling, 12.4 Learning to Reason (imitating others), and 12.5 RL for Reasoning (evolving reasoning through exploration). This post lays out that route from the video titles alone, then pairs it with the CoT, ReAct, and 'reasoning enlarges the action space' pages of the previous Language Agents deck. Technical detail is left to the site's CS224N and CME295 reasoning posts."
description: "Post 15 of the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series: L12 Reasoning has videos 12.1–12.5 but no slides. The post orders the five subtopics from the video titles, adds pages 8–20 of 251110_LangAgent.pdf on CoT, ReAct, and reasoning as an action space, and states what can and cannot be verified."
draft: false
glossary:
  - term: "Chain-of-Thought"
    aliases: ["CoT"]
    definition: "Having a language model produce intermediate reasoning steps before its answer, first proposed through worked examples in the prompt."
    context: "Page 10 of the ADL Language Agents deck cites Wei et al., 2022 and describes it as intermediate generation that imitates human mental processes."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-reasoning)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the L12 videos in the playlist of [NTU Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), taught by Yun-Nung (Vivian) Chen.** It is post 15 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The previous post, [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en), treated reasoning as one of three key concepts for agents. This one pulls it out on its own: **how does a model learn to think before it answers?**

First, the limit of this post: **L12 has no public slides.** The 12/01 row on the course page just says "Reasoning," with no slides and no video links. The five videos appear only in the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o). I did not transcribe the videos, so all I can report are their titles, lengths, and descriptions, plus the reasoning pages in the previous lecture's deck.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=paTmY2nZ8XI
title: 12.1 What is Reasoning?
```

```youtube
url: https://www.youtube.com/watch?v=VHNdIld9sAg
title: 12.2 Short CoT
```

Original videos: [12.1 What is Reasoning?](https://www.youtube.com/watch?v=paTmY2nZ8XI)、[12.2 Short CoT](https://www.youtube.com/watch?v=VHNdIld9sAg)、[12.3 Test-Time Scaling](https://www.youtube.com/watch?v=wc0SKCyXbaA)、[12.4 Learning to Reason](https://www.youtube.com/watch?v=VBhFnYMPeO4)、[12.5 RL for Reasoning](https://www.youtube.com/watch?v=WT2f7nBLGJA)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Transcript attempt (2026-10-10): the embedded 12.1 (10:21) and 12.2 (12:06) have no obtainable YouTube transcript, so their spoken content was not checked word for word. For these two the article relies only on the title, subtitle, length, upload date and description, which match the YouTube pages.

## The five videos

The lectures are in Mandarin; each title carries a Chinese subtitle, translated here.

| # | Video | Chinese subtitle (translated) | Length |
|---|---|---|---|
| 12.1 | [What is Reasoning?](https://youtu.be/paTmY2nZ8XI) | Can machines reason too? | 10:21 |
| 12.2 | [Short CoT](https://youtu.be/VHNdIld9sAg) | Reason briefly, then answer | 12:06 |
| 12.3 | [Test-Time Scaling](https://youtu.be/wc0SKCyXbaA) | Thinking more during the exam helps | 29:17 |
| 12.4 | [Learning to Reason](https://youtu.be/VBhFnYMPeO4) | Imitating how others reason | 18:25 |
| 12.5 | [RL for Reasoning](https://youtu.be/WT2f7nBLGJA) | Evolving reasoning behavior through exploration | 12:14 |

All five descriptions read "2025/11/17 Applied Deep Learning" and note "Slides credited from Hung-Yi Lee," meaning the slides were borrowed from Prof. Hung-yi Lee. One thing does not line up. The course page labels 11/17 "Knowledge, Multimodality" and puts "Reasoning" on 12/01, but the video descriptions give 11/17 as the lecture date. Public information cannot settle which is right, so this post records both.

## The route the titles lay out

The five titles already form a path from basic to advanced. This section only restates what the titles and subtitles say. It adds nothing I could not verify from the videos.

**1. What is reasoning (12.1).** The subtitle is a question: "Can machines reason too?" This video defines the problem; the next four cover methods.

**2. Short CoT (12.2).** "Reason briefly, then answer" makes two points: reasoning comes before the answer, and it is short. That sets up a contrast with the "think more" direction from 12.3 on.

**3. Test-Time Scaling (12.3).** "Thinking more during the exam helps." The trained model stays fixed, and more compute is spent at inference. At 29 minutes it is the longest of the five and carries the most weight.

**4. Learning to Reason (12.4).** "Imitating how others reason": the model learns from existing reasoning traces. This is the turn from "how to use it at inference" to "how to teach it in training."

**5. RL for Reasoning (12.5).** "Evolving reasoning behavior through exploration": instead of only imitating, the model uses reinforcement learning to discover its own ways of reasoning.

So the whole arc is: **define → let it think at inference (short, then long) → teach it to think in training (imitate first, then explore).**

**Try this**: before watching, copy down the five titles. After each video, write one sentence next to it saying which question it answered. Together the five sentences summarize the lecture, and they show whether you caught the inference-to-training turn between 12.3 and 12.4.

## Reasoning in the previous lecture's deck

L12 has no slides, but pages 8–20 of the [Language Agents deck (251110_LangAgent.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) are entirely about reasoning. They are the closest official Fall 2025 material. Page 1 says the deck draws on the EMNLP 2024 tutorial on language agents.

**Reasoning as an internal action (pages 5, 9).** The deck draws a language agent as: perceive the environment → reason in an inner monologue → act on the environment. Page 5 says that generating tokens to reason can be viewed as an internal action; self-reflection is a "meta" action that reasons over the reasoning process; and reasoning exists to act better. Page 9 splits the action space three ways: reasoning updates short-term memory (the context window), retrieval/learning reads and writes long-term memory, and planning chooses an external action at inference time.

**CoT (page 10).** Cites [Wei et al., 2022](https://arxiv.org/abs/2201.11903), in one line: intermediate generation imitates human mental processes.

**Reasoning helps acting, and acting helps reasoning (pages 11–12).** Page 12 uses a Chinese example: asked "Do you know NTU's Yun-Nung Chen?", the model searches first and then answers from the results. The search gives the reasoning something to stand on.

**ReAct (pages 13–17).** Cites [Yao et al., 2022](https://arxiv.org/abs/2210.03629). The deck's takeaways are "Reasoning + Act are both essential" and "reasoning provides explanations for controlling actions."

**Reasoning enlarges the action space (pages 18–19).** A larger action space means more capacity but harder decisions, since the space of reasoning and language is infinite. The last point on page 19 echoes the 12.4 subtitle directly: LLMs learn reasoning priors by imitating many human reasoning traces.

Page 20 is titled "Action Planning for Improving Reasoning (Yao et al, 2023)" and has no further text. I do not guess which paper it refers to.

## What this post can and cannot confirm

Confirmed: the five videos' titles, Chinese subtitles, lengths, upload date (2025-11-20), and description text (checked with YouTube oEmbed and yt-dlp); the titles and bullets of pages 5–20 of the Language Agents deck; the arXiv titles of the CoT and ReAct papers.

Not confirmed: the content of the videos themselves. Without slides or a transcript, I do not say which test-time scaling methods 12.3 covers, what data 12.4 imitates, or which RL algorithm or model 12.5 uses. The descriptions credit the slides to Prof. Hung-yi Lee, but which deck and which pages cannot be confirmed from public information.

## Further reading

For detail beyond the video titles, two site series cover the same ground from courses with slides:

- [CS224N Lecture 12: Decoding, DeepSeek-R1, and Reasoning Training](/posts/ai/2026-08-22-cs224n-reasoning-one-en): R1-Zero/R1, PPO, GRPO, DAPO, matching the RL route of 12.5.
- [CS224N Lecture 13: Speculative Decoding and Test-Time Scaling](/posts/ai/2026-08-22-cs224n-reasoning-two-en): matching the test-time scaling of 12.3.
- [CME295: LLM Reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning-en), plus [CME295: RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en) on RL training.
- From the same university, the [Hung-yi Lee Machine Learning 2026 Spring guide](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): all five L12 descriptions credit the slides to Prof. Lee, so his own course is a natural companion.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) | Next: [Conversational AI and Tool Use](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Tried to check 12.1 and 12.2 against transcripts, but neither has one, so the content was not checked; the article already relied only on titles and descriptions and was left unchanged.

## References

- [NTU Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 12/01 row carries only the title "Reasoning"
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (lectures in Mandarin)
- Videos: [12.1 What is Reasoning?](https://youtu.be/paTmY2nZ8XI), [12.2 Short CoT](https://youtu.be/VHNdIld9sAg), [12.3 Test-Time Scaling](https://youtu.be/wc0SKCyXbaA), [12.4 Learning to Reason](https://youtu.be/VBhFnYMPeO4), [12.5 RL for Reasoning](https://youtu.be/WT2f7nBLGJA)
- [251110_LangAgent.pdf (Language Agents, Fall 2025)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) — pages 5–20
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv 2201.11903)](https://arxiv.org/abs/2201.11903)
- [ReAct: Synergizing Reasoning and Acting in Language Models (arXiv 2210.03629)](https://arxiv.org/abs/2210.03629)
