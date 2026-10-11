---
title: "CS224R L18: Open Problems in Deep RL, and How to Do Research"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, research-project, ai-safety]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 21
tldr: "The last CS224R lecture has three parts. It first folds the whole quarter into one toolbox. It then lists seven unsolved problems: domains without verifiable rewards, using prior data, world models, scaling, safety, hallucination and calibration, and evaluating generalist systems. Nearly half the deck is about how to do research: you need both an important problem and a workable plan, you front-load the risk, you consider pivoting early, and research only counts once you share it. Reading it alongside the 244 public 2026 final project reports shows what those principles look like in practice."
description: "A guide to Lecture 18, \"Frontiers,\" of Stanford CS224R (Spring 2026): the quarter-wide method summary new in 2026, seven open problems in deep RL and the papers the slides cite, Chelsea Finn's research advice (choosing problems, handling risk, when to pivot, how to share), and what the 2026 final project list contains and how to use it to pick a topic."
draft: false
glossary:
  - term: "batch online RL"
    definition: "A middle ground between online and offline RL: instead of interleaving model updates and data collection at every step, you run a few rounds of \"collect a large batch of data, then update the model.\" It suits settings where frequent updates are hard, such as conversations with real users or real robots."
    context: "CS224R L18 lists it as an open problem under \"How to scale.\""
  - term: "sycophancy"
    definition: "A language model's tendency to say what the user wants to hear, such as agreeing with the user's view, instead of giving the correct answer. Preference optimization is one cause, because human preferences themselves reward \"agrees with me\" and \"sounds confident.\""
    context: "CS224R L18 uses it to show why chatbot rewards are hard to define."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 21, and the final part, of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L17 RL for VLAs](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en) and covers Lecture 18, "Frontiers," on May 29, 2026 (Friday of week 9). The schedule lists no assigned reading for this lecture.

Official sources used:

- The 57-page slide deck [18_cs224r_frontiers_how_to_research_2026.pdf](https://cs224r.stanford.edu/slides/18_cs224r_frontiers_how_to_research_2026.pdf)
- The [2026 final project list](https://cs224r.stanford.edu/projects/cs224r_final_projects.html), with 244 reports, each linked as a PDF
- The [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf), to see how the research advice in this lecture shows up in project grading

Access level is **A3**: the slides, project specs, and project reports are all readable without logging in; the 2026 recordings live only on Canvas.

Companion video (**supplementary**): [Spring 2025 Lecture 18: Frontiers](https://www.youtube.com/watch?v=FacJ_1tTSx4) (about 71 minutes). I compared the [2025 deck](https://cs224r.stanford.edu/spring_2025/slides/18_cs224r_frontiers_how_to_research.pdf) (53 pages) with the 2026 one. The 2026 deck adds three opening slides summarizing the quarter and one research example slide; the text of the open problems and research advice is nearly identical. So the 2025 video covers most of this lecture, but for the opening summary, go by the 2026 slides.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=FacJ_1tTSx4
title: Spring 2025 Lecture 18: Frontiers (YouTube, supplementary)
```

Original videos: [Spring 2025 Lecture 18: Frontiers (YouTube, supplementary)](https://www.youtube.com/watch?v=FacJ_1tTSx4)

Content check: verified against the video transcript (2026-10-10): sampled the beginning, middle and end of the Spring 2025 L18 Frontiers transcript and searched keywords (not a word-by-word comparison). The video is the lecture it is labeled as, the speaker is Chelsea Finn, and the topic matches this post. The transcript walks through open problems in problem setup, methods, and deployment/evaluation, then research advice and projects, and includes the speaker's second-year-PhD internship story about building a video generation model (about 1,300 citations), which supports the post's statement that the 2025 video covers most of this lecture. This post follows the 2026 slides; the video is supplementary only.

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

The Spring 2026 lecture recordings sit behind Stanford sign-in on Canvas/Panopto; the public YouTube playlist is Spring 2025. Checked: 2026-10-10.

## The setting: what is still unsolved after the full toolkit

The course reminder on slide 2 is blunt: poster session next Wednesday, final report due the Monday after, **no late days and no extensions**. Students heard this lecture during the final push on their projects.

The lecture has three parts:

1. Recap: deep RL is a toolbox (new in 2026)
2. Frontiers and open problems: seven unsolved directions
3. How to do (deep RL) research

The third part takes up almost half the slides. It is the only lecture in the course that teaches no algorithm; it is about how to keep going on your own.

## Recap: deep RL is a mix-and-match toolbox

The 2026 deck opens with three slides that wrap up the quarter.

Slide 3 is the same table of four families of online methods from [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning-en) (vanilla PG, PPO-like, off-policy actor-critic, Q-learning). I won't repeat it here; see that post.

Slide 4 cuts the methods again by whether they collect new data:

| | Offline (no new data) | Online (collects data) |
|---|---|---|
| Imitation learning | Behavior cloning: supervise the actions in the data | DAgger |
| RL | Offline RL (AWR, AWAC, IQL): offline data only; IQL learns V with an asymmetric loss | Off-policy RL (DQN, SAC): can reuse data from other policies; on-policy RL (PPO, importance sampling): only data from the current policy |

The slide marks the cost at each end: imitation learning needs expert data but no reward; the further toward on-policy you go, the more online data you need.

Slide 5 is the one to save. Titled "What makes up an RL algorithm?", it breaks an RL algorithm into five swappable parts:

- **Data**: offline demos or stored experience; online DAgger or policy rollouts
- **Reward function**: given or annotated, learned from examples or preferences ([L8](/posts/ai/2026-09-30-cs224r-reward-learning-en)), or self-supervised (e.g., goal-conditioned RL)
- **Policy update method**: supervised BC, policy gradient, actor-critic, Q-learning
- **Value learning**: Monte Carlo, TD, n-step returns
- **Neural net model**: Gaussian, categorical, diffusion, flow, autoregressive

Next to these it lists four groups of tools: using off-policy data (importance weighting, replay buffers), using offline data (supervising to data actions, asymmetric value loss), sharing across tasks (multi-task policies, hindsight relabeling), and learned models (synthetic data, test-time planning).

The takeaway on the slide: **many algorithms mix and match these tools depending on the needs of the use case.**

**Try this**: take an RL paper you read recently and fill it into these five parts and four tool groups. If you can't fill a cell, that is usually where the paper is unclear, or where you haven't understood it yet.

## Frontiers: seven unsolved problems

Slide 7 groups the open problems into three categories and seven items:

1. Problem setup: (a) non-rewarding, non-verifiable domains
2. Methods: (b) leveraging prior data and knowledge, (c) using world models, (d) how to scale
3. Deployment and evaluation: (e) safety, (f) handling inaccuracies and hallucinations, (g) evaluating generalist systems

I go through them in order. Each item on the slides is posed as a question **without an answer**, and I don't supply answers either.

### (a) Non-rewarding, non-verifiable domains

Slides 8–11 first mark out the "no problem" domains: games, math reasoning, and coding problems, all of which have verifiable rewards. The hard part is domains where rewards don't exist or are very delayed. The slides list five:

- **Chatbots**: current practice is preference optimization, which gets you "what you want to hear." The slides cite [Sharma & Tong et al. 2023](https://arxiv.org/abs/2310.13548) on sycophancy, splitting human preference into three factors, "agrees with me," "is confident," and "is actually true," and state "People don't actually give good preferences!" They go on to list the tension between personalization and polarization, and balancing competing objectives.
- **Robotics**: rewards today are often binary or hand-shaped. The slide shows several photos of folded shirts and asks how you would score each fold.
- **YouTube recommendations**: a weighted combination of engagement (e.g., clicks) and satisfaction (e.g., likes), and **the weights are tuned by hand**.
- Extending math reasoning to **scientific experimentation and reasoning**.
- **Can machines optimize for learning itself?**

This item connects directly to [L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning-en) and [L9 RLHF](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en). Those lectures teach how to learn rewards; this one reminds you the learned reward may itself be biased.

### (b) Leveraging prior data and knowledge

Slide 13 starts with the default tool: **initialize model weights from a pre-trained model, and initialize the replay buffer with offline data.** It cites [Ball et al. 2023](https://arxiv.org/abs/2302.02948), noting that this method initializes only the buffer, not the weights.

Then two open questions:

1. What about more abstract prior knowledge, such as hints or knowledge from news articles?
2. Do pre-trained weights and data constrain learning too much?

The slide makes the second question concrete in two lines: how can LLMs go beyond pre-training to solve problems humans haven't solved? How can robots and autonomous vehicles learn tasks faster and more reliably than humans?

### (c) Using world models (video generation models)

Slide 15's position: video generation models have rich world knowledge and should be useful, **but there are large, nuanced challenges**.

The example on the slide: train a model on demos plus one policy's rollouts to predict the next h states given the current state and the next h actions, then use it to judge whether a new policy's actions lead to good outcomes. Two problems:

- The new policy's actions are **out of distribution** for this model
- Small physical inaccuracies lead to poor performance

The slide lists two possible fixes: train on data from more policies, or use the model differently, for example train "current state to future video" on demos only, then run a goal-conditioned policy to follow the predicted video.

This picks up the model-error problem from [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en), with the model now a video generator instead of a dynamics model.

### (d) How to scale

Slide 17's assessment: large-scale RL for LLMs is exciting, but today it is **either fairly short-horizon or very online**. Two examples:

- **LLM preference optimization** usually considers a single turn rather than the outcome of the whole conversation. That makes the problem short-horizon and avoids collecting human-in-the-loop data.
- **RL for math reasoning** relies on a large number of online samples from the model, interleaved with policy updates.

So the open question is: **can we do large-scale RL with longer horizons and less online data?** Slide 18 splits it into two sub-questions:

1. Can we train and use accurate value functions at scale? The slide points out that algorithms like PPO only use value functions to reduce gradient variance, which may not be accurate enough for actor-critic algorithms.
2. Can we do large-scale **batch online RL**? In many applications it is hard to interleave model updates and data collection, especially with large models, for example when collecting dialogs with real users or data on real robots. A few iterations of "collect a large batch of data, update the model," possibly asynchronous, are more practical. That raises new considerations, such as needing expressive policies to get enough breadth in the data.

Slide 18 cites "Dong et al., 2025." The matching paper I found is [What Matters for Batch Online Reinforcement Learning in Robotics?](https://arxiv.org/abs/2505.08078) (Perry Dong, Suvir Mirchandani, Dorsa Sadigh, Chelsea Finn). The topic matches, but the slide gives no full citation, so this match is my own.

### (e) Safety

Slides 20–22 ask how to develop and test AI in safety-critical domains: medicine, autonomous driving, mental health counseling, legal and political discourse.

The argument has three steps:

1. The traditional approach is formal verification and probabilistic guarantees, but their assumptions usually don't hold in the real world, and there are far too many open-world scenarios to guarantee each one. The slide also notes that human drivers, surgeons, and pilots make mistakes too.
2. Large-scale ML is arguably the most successful way to handle open-world circumstances. So should we collect large amounts of data on unsafe circumstances? The slide's answer: doing so has had horrific ramifications.
3. That leaves two open questions. Can we learn what is unsafe **without extensive data on unsafe incidents**, perhaps using synthetic data or prior knowledge? Can we **gradually explore new behaviors while staying safe**?

### (f) Handling inaccuracies and hallucinations

Slide 24 notes that for LLMs, a human is often the recipient (chatbots, code generation), so mistakes are often manageable, **but the interface is not well optimized**. It quotes Rajpurkar & Topol's 2025 New York Times piece and Goh et al.'s 2024 JAMA study: AI working alone reached 92% diagnostic accuracy, physicians using AI assistance reached 76%, barely better than the 74% they got without AI.

Two open questions follow:

1. **Can we optimize the combined human-AI system?** For example, can models better estimate and convey their uncertainty? Slide 25 shows the calibration plots from the [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774), pre-trained GPT-4 next to GPT-4 after PPO post-training, under the heading "RLHF hurts model's calibration!" One possible direction on the slide is [Tian et al. 2023](https://arxiv.org/abs/2305.14975): calibration through verbalized confidence and listing multiple guesses.
2. **When humans are not in the loop, how do we get to 99.99% reliability?** The slide argues RL is likely part of the solution and cites [Luo et al. 2024](https://arxiv.org/abs/2410.21845) as promising results in some scenarios.

### (g) Evaluating generalist systems

Slide 28 states the difficulty plainly:

- In supervised learning, you measure accuracy on a held-out validation set
- In RL, there generally **aren't any reliable offline metrics**, because the data was collected by a different policy, which makes it very hard to evaluate the new policy on the states it will visit
- Generalist models need evaluation under many conditions, which makes it worse

So how do you decide whether a policy is good enough to deploy, or which model to pick? Slide 30 leaves two open questions: can we develop offline metrics that can **at least rule out bad models**, let alone estimate performance? How do we select representative real-world scenarios for online evaluation of generalist policies?

Slide 29 contains only a link to a social media post, labeled "About one month ago." This slide is word-for-word the same as in 2025, so "one month ago" refers to a 2025 date, not 2026.

Slide 31 closes the section: **"You are all now well-equipped to start tackling these challenges!"**

**Try this**: pick one of the seven items and search the [2026 final project list](https://cs224r.stanford.edu/projects/cs224r_final_projects.html) for two or three reports with related titles. A student project is sized for one quarter of work, which makes it a good yardstick for how big your own first project should be.

## How to do (deep RL) research

From slide 32 on, the topic is research method. The slides don't name the speaker, but the course homepage lists Chelsea Finn as the only instructor, so the first-person stories below are presumably hers.

Slide 33's preface is a single line: **a diversity of research approaches is good.** What follows is one person's advice, not the only right answer.

### A few realities first

Slide 34's backstory: the speaker had no intention of a career in research ("You don't either!"). She wanted to work on frontier AI topics that weren't ready yet, and the people she met working on them in industry all had PhDs. Along the way she found the ambiguity of research intellectually stimulating.

Slide 35 lists three realities:

1. **Less than 1% of research ideas have lasting impact.** Many ideas don't lead to papers; many papers have small impact.
2. **Research is incremental.** The slide's example builds closely on CASP, a 20-year academic project for the critical assessment of protein structure prediction, and on advances in neural networks.
3. **In a world where scale matters, simple ideas have more impact, because they can be scaled.**

Slide 36's outline has four parts: what to work on, how to do the work, how to share the work, and miscellaneous. The slide stresses that **the first three are equally important**.

### What to work on: an important problem plus a workable plan

Slides 37–39 give a three-step check:

1. **You need two things: an important problem and a plan for how to approach it.** One counterexample for each: "solve climate change" is missing the plan; "a really cool algorithm that makes the robot 1% more successful" is missing the important problem. The slide then asks: what will the outcome look like if you are very successful?
2. **Are you excited about it?** Research is a ton of work, and you will be far more successful if you are excited.
3. **If you are brutally honest about why it could fail to solve the problem, does the idea still have a high chance of working?** If not, it probably won't work.

Slide 40 compares two starting points:

| | Idea-driven | Problem-driven |
|---|---|---|
| Starting point | Start with an idea, then find a problem | Start with a problem, then find the best solution |
| Risk | There may not exist an important problem that the idea solves | May be harder to write the paper if the solution is obvious in retrospect |
| Upside | — | Guaranteed to be working on an important problem |
| Goal | Get the idea to work | Solve the problem |

Slides 42–43 tell the story of the speaker's internship in year 2 of her PhD. She wanted to build a predictive model and use it to learn skills across many robots, then discovered existing video generation models were really bad. She was an ML and robotics person, not a computer vision person, but decided to first build a better video generation model. The slide says that paper became the basis of her job talk, has 1,300 citations, and showed the community it was an interesting problem to study.

Two takeaways: **don't box yourself into one area**, because crossing topic boundaries surfaces new problems and ideas; and **don't be a perfectionist**, because you can never know a project's impact at the outset.

### How to do the work: front-load the risk

Slide 45 returns to "less than 1% of ideas have lasting impact," so the key is **handling risk**:

1. **Front-load the risk whenever possible.** This is uncomfortable. Before building large-scale infrastructure, formulate and run small didactic experiments that test the core unknowns.
2. Design targeted experiments that test unknowns in the fastest possible way.
3. Try lots of ideas, including different problems; "create luck."
4. **Don't mentally commit to a project** before you see signs of life on the core unknown.

Slide 46 gives five ways to get things working:

1. Start from something that works, then make it incrementally harder
2. Simplify
3. Talk to friends, colleagues, and advisers
4. Revisit your assumptions; things you believed at the start may be refuted by your experiments
5. Does it "want" to work? If not at all, it likely won't be impactful. Can you reduce the scope to the parts that "want" to work?

Slide 47, new in 2026, gives an example for point 5 and cites "Shi et al. 2025." The PDF shows only the heading and the citation marker, so I can't tell which paper it is or what the example says.

### When to pivot

Slide 48 says pivoting is often considered later than it should be, because of the sunk cost fallacy.

The slide reframes the decision. "Continue the current project" versus "switch to a new project" is a very nebulous choice. "Continue the current project" versus "project B" versus "project C" is much more straightforward and less anxiety-inducing. Hence the advice: **spend time thinking about other research projects.**

**Try this**: at the top of your current project notes, write down two concrete alternatives, each with one sentence stating the important problem and the plan. Next time you get stuck, compare your project against those two, not against "give up."

### How to share: if no one knows, there was no output

Slide 50 asks: what is the output of research? Ideas, knowledge, learnings, almost never a product or service. **If no one knows about the learnings, there was no output.** It adds that even companies invest heavily in marketing.

It also answers three common objections:

- "It feels like self-promotion" → you are teaching people and sharing cool findings
- "But it didn't work that well" → still very useful, since other people may think of an idea from it
- "But it's all obvious to me now" → after enough research, you will know far more than others

Slide 51 covers how to share: clear writing, visuals, and presentations; think about your audience and how they will interpret what you say; when in doubt, assume they know less rather than more; avoid jargon when you can, since many people appreciate a refresher; practice, practice, practice, and get honest feedback.

Slide 52 covers writer's block: break the task down, for example jot down ideas on paper, then write an outline. The speaker's recommendation: **think through your own ideas before asking your friend ChatGPT.**

### Misc: mentorship and confidence

Slide 54: if you have mentorship, don't be afraid to lean on it; the speaker finds students do best when learning gradually.

Slide 55 is about confidence. There are many reasons to lack it: no one knows the best way to do research right now, no one knows which research will matter most, many ideas don't work, many papers get rejected, and many researchers have been thinking about a domain for years. They will be "smarter" than you in that domain, but that is no reason to be intimidated. **Confidence really matters; self-doubt and overthinking can really slow you down.**

Slide 56 closes the course, thanking students for their questions, their patience with new course components, and their feedback throughout the quarter.

## Tying it together: how to read the 2026 final project list

The [2026 final project list](https://cs224r.stanford.edu/projects/cs224r_final_projects.html) is headed "Spring 2026 · 244 student projects." Each row gives the type (Custom or Default), title, authors, and mentor TA, and each title opens the report PDF. I counted the table: 155 Custom, 88 Default, and 1 with no type listed.

Awards went to 4 Outstanding Projects and 9 Honorable Mentions. The grading section of the homepage says outstanding projects can earn up to 2% extra credit. The four Outstanding Projects:

- A Semi-Decentralized Approach to Scalable Multiagent Control (Custom)
- EXPO-FT: Sample-Efficient Reinforcement Learning Finetuning for Vision-Language-Action Models (Custom)
- Hybrid Reinforcement Learning for Chip Macro Placement (Custom)
- SFT Augmentation and Replay-Based RL for Countdown Reasoning (Default)

Default projects all build on the Countdown task and the SFT → IPO → RLOO pipeline of the [Default Project](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en). Of the 88, 33 have "curriculum" in the title and 27 have "RLOO" (a rough keyword count on titles only). Custom projects spread across robotics, VLAs, multi-agent systems, LLM reasoning, and many application domains.

Keep in mind that this list is **only a collection of reports**: it has no grading details and no TA comments, and apart from the award labels you can't tell how each report scored.

Its value is as a companion to the novelty requirement in the [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf). The spec asks for at least one of: answering an open question that the literature leaves unanswered or partly answered; non-trivial, justified modifications at the component or algorithm level (they need not improve every dimension, but failure modes must be analyzed); or applying a method to an underexplored domain where the adaptation is non-trivial. The spec also says novelty does **not** require meeting the bar of ML conferences or reaching state of the art, but regardless of performance, the project should offer new insight into why an idea succeeds or fails.

This is the same thing as the three-step check on slides 37–39: an important problem, a workable plan, and brutally honest failure analysis.

## Further reading

- Posts in this series tied to the seven open problems: [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en), [L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning-en), [L9 RLHF and Preference Optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en), [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en), [L17 RL for VLAs](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en)
- [Berkeley CS285: exploration and open problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en), how another deep RL course wraps up
- [Berkeley CS285: homework and project route](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en), to compare the two courses' project requirements
- [CS336 RLVR](/posts/ai/2026-08-22-cs336-rlvr-en) and [CME295 RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en), on the line between verifiable rewards and non-verifiable domains from the LLM side

## What this post can and cannot confirm

Confirmed: the text, structure, and citation markers of the 2026 slides; the schedule date and final project deadlines; the differences between the 2025 and 2026 decks; the count, types, and award labels on the final project list; the novelty requirement in the Custom Project Guidelines; the title and length of the 2025 video.

Not confirmed:

- What was said in the 2026 lecture, including whether the speaker gave her own view on each open problem
- Image-only slides, such as the figure for the CASP example on slide 35, "Bottlenecks" on slide 41, and the "Shi et al. 2025" example on slide 47
- The paper behind "Dong et al., 2025" on slide 18 is my own match by topic; the slide gives no full citation
- Which video generation paper slide 43 refers to; the slide doesn't give its title

Series navigation: previous [L17 RL for VLAs](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en) | this is the final post | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.
- 2026-10-10: Checked the video content against its transcript. The transcript supports the claim that the 2025 video covers most of the lecture, including the internship story; nothing needed correcting.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 18 slides: Summary & frontier of deep RL + How to do (deep RL) research (2026)](https://cs224r.stanford.edu/slides/18_cs224r_frontiers_how_to_research_2026.pdf)
- [CS224R Final Projects (Spring 2026 final project list)](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)
- [CS224R Custom Project Guidelines (2026)](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [Lecture 18 slides (Spring 2025 archive, for comparison)](https://cs224r.stanford.edu/spring_2025/slides/18_cs224r_frontiers_how_to_research.pdf)
- [Spring 2025 Lecture 18: Frontiers (YouTube, supplementary)](https://www.youtube.com/watch?v=FacJ_1tTSx4)
- [Sharma et al. 2023: Towards Understanding Sycophancy in Language Models](https://arxiv.org/abs/2310.13548)
- [Ball et al. 2023: Efficient Online Reinforcement Learning with Offline Data](https://arxiv.org/abs/2302.02948)
- [Dong et al. 2025: What Matters for Batch Online Reinforcement Learning in Robotics?](https://arxiv.org/abs/2505.08078)
- [OpenAI 2023: GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
- [Tian et al. 2023: Just Ask for Calibration](https://arxiv.org/abs/2305.14975)
- [Luo et al. 2024: Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning](https://arxiv.org/abs/2410.21845)
