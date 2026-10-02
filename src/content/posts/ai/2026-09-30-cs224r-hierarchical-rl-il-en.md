---
title: "CS224R L15: Hierarchical RL and Imitation Learning"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, imitation-learning, embodied-ai]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 18
tldr: "Long-horizon tasks are hard because the agent visits a huge number of states and has many chances to make mistakes or get stuck. Lecture 15 of CS224R answers with two levels: a high-level policy proposes subgoals, and a low-level policy runs at a higher frequency to reach them. The real design decisions are three: how to represent the subgoal, how to supervise each level, and when to switch to the next subgoal. The slides also admit that nobody has yet shown whether hierarchy beats a single policy with chain of thought."
description: "A guide to Lecture 15 of Stanford CS224R (Spring 2026), \"Hierarchical RL and IL\": why long-horizon tasks are hard, four reasons hierarchy may help, hierarchy vs. flat policy vs. chain of thought, properties of good goal representations, how to supervise each level, when to switch subgoals, and example systems with language, image, and state subgoals (Yell At Your Robot, Hi Robot, π0.5, SuSIE, HIRO), plus the assigned reading, SayCan."
draft: false
glossary:
  - term: "hierarchical policy"
    definition: "A policy split into two (or more) levels: the high-level policy outputs an intermediate goal g_t from the observation and instruction, and the low-level policy outputs actions at a higher frequency to accomplish g_t. g_t is also called a subgoal, skill, option, or high-level action."
    context: "The core structure of CS224R L15."
  - term: "HL DAgger"
    definition: "DAgger applied only to the high level of a hierarchical policy: freeze the low-level policy, let a human override the high-level prediction with language corrections during execution, and use those corrections as supervision for the high level."
    context: "CS224R L15 illustrates it with Yell At Your Robot (RSS 2024)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 18 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en) and covers Lecture 15, "Hierarchical RL and IL," on May 20, 2026 (Wednesday of week 8). There is no lecture 14 in 2026: that slot (May 15) was the midterm.

Official materials used:

- The 2026 slides, [15_cs224r_hierarchy_2026.pdf](https://cs224r.stanford.edu/slides/15_cs224r_hierarchy_2026.pdf) (46 pages, titled "Hierarchy in Imitation and Reinforcement Learning")
- The assigned reading on the schedule: [Do As I Can, Not As I Say: Grounding Language in Robotic Affordances (Ahn et al. 2022, known as SayCan)](https://arxiv.org/abs/2204.01691)

Access level is **A3**: the slides download anonymously, and the 2026 recordings live on Canvas for enrolled students only.

Companion video (**supplement**): [Spring 2025 Lecture 15: Hierarchical RL and IL](https://www.youtube.com/watch?v=iKWYLSVAtfM) (about 70 minutes). The 2025 lecture ran on May 21 with the same title and reading, but it is last year's recording and may differ from the 2026 slides. This post follows the 2026 slides.

## Setting: stringing behaviors together

Slide 3 recaps the previous two lectures. [Multi-task and goal-conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en) feeds the policy a task descriptor z or a goal state s_g. [Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en) feeds it a few episodes of experience on a new task. Today's question: **can we string together behaviors from multiple (sub)tasks?**

Slide 5 gives four long-horizon tasks: cook focaccia, fix a bug that makes training loss explode, drive to Yosemite, and give feedback on an 8-page report. They are hard for three reasons:

1. The agent visits a very large number of states.
2. There are many opportunities to make mistakes.
3. There are many opportunities to get "stuck."

**Try this**: pick a long task you actually face, such as a multi-step agent workflow, and write it as a ladder like slide 6: bake a cheesecake → buy ingredients → go to the store → walk to the door → take a step. The top rung is hard to do directly and the bottom rung is easy. The middle rungs are what a hierarchy has to learn.

## Intuition: the high level picks goals, the low level picks actions

Slide 7 draws the structure:

- **High-level policy π_HL**: reads observation o_t and the instruction, outputs an intermediate goal g_t
- **Low-level policy π_LL**: reads o_t and g_t, outputs action a_t, and **runs at a higher frequency than the high level**

g_t goes by many names: subgoal, subtask, skill, option, high-level action. There can also be more than two levels.

Slide 8 writes the rollout as an algorithm:

1. Observe the initial observation o_1 at t = 1.
2. Plan goal g_t according to π_HL(· | o_t, prompt).
3. Until a new goal is selected: execute a_t according to π_LL(· | o_t, g_t), set t ← t + 1, and observe the new o_t.

### Four reasons hierarchy may help

Slide 9:

1. It provides a supervision signal on how to complete the task.
2. Similar subtasks can share knowledge more directly.
3. In RL, exploration can be structured in the higher-level space.
4. A practical advantage: running the policies at different frequencies helps with latency requirements.

### Do we really need two policies?

Slides 10–11 compare three designs:

| Design | Structure | What the slides say |
|---|---|---|
| Hierarchy | π_HL outputs g_t, π_LL outputs a_t | — |
| Flat policy | One π outputs a_t directly | — |
| Chain of thought | One π outputs g_t, then a_t | Can use the same supervision as hierarchy, but may be too expensive, e.g. for 50 Hz control |

The verdict on the slide: **no conclusive empirical comparison yet**. Keep that in mind. The systems below are all hierarchical, but they show that hierarchy beats a flat policy without intermediate supervision. They do not show that hierarchy beats chain of thought.

## Mechanism 1: how to represent subgoals

Slide 13 is a think-pair-share exercise. Pick one of four tasks (cook Italian dishes, bike to campus locations, draft legal briefs, plan and book one-week vacations) and discuss the intermediate goals and their best representation. The slide's example is "Bike to the Dish entrance."

Slide 14 summarizes:

1. The best goal representations are likely **domain-specific**.
2. Good goal representations have three properties:
   - **Expressive**: they can communicate many different low-level behaviors
   - **Structured**: similar behaviors should have similar g
   - **At the right level of abstraction**: not too hard for either the low level or the high level

**Try this**: list three candidate representations for your task (a sentence, a goal image, a set of coordinates) and check each against the three properties. Language is usually the most expressive, coordinates usually the most structured, and images fall in between.

## Mechanism 2: how to supervise each level

Slide 16 asks: why not train everything end to end with a latent goal? The answer: **what you get is a flat policy**. The slide adds that you should think carefully about where the benefits come from, which it calls good practice in any kind of research.

Slide 17 lays out the chicken-and-egg problem:

- **Low level**: trained to accomplish g, not the original task. Key question: for which distribution of goals? Ideally whatever the high level will output, but the high level hasn't been learned yet.
- **High level**: trained to accomplish the original long-horizon task. Key question: with which low-level policy? Ideally the learned one, but it hasn't been learned yet either.

Slide 18's advice: the two levels **can be trained separately first**, but at least one should be adapted to the deficiencies of the other, if they are not fine-tuned jointly. A side note on the slide: **LLMs are often good high-level policies**.

## Mechanism 3: when to move on to the next subgoal

Slides 20–21 ask how often to re-query the high level. Two options:

| | Option 1: switch when the low level has completed g_t | Option 2: switch every fixed n steps |
|---|---|---|
| How | e.g. estimate progress toward g | e.g. pick a fairly frequent replanning interval |
| Pros | Ideal in principle | Simple |
| Cons | Hard to estimate when done; must handle mistakes that require redoing past goals | Small n puts more burden on the high level; trades more compute against delay in switching |
| Failure mode | Errors in estimating completion can leave the agent **perpetually stuck** | Errors in predicting the subtask mean the low level may take wrong actions for n steps |

The slide marks option 1's errors as **more fatal**.

## Examples: language, image, and state subgoals

Slide 23, titled "Hierarchy is hot," lists four industry systems: Physical Intelligence π0.5, NVIDIA GR00T N1, Figure Helix, and Gemini Robotics. The slide shows only names and figures.

The rest follows slide 25's taxonomy.

### Imitation with language subgoals

Slide 27: the data is **segmented demonstrations, each segment labeled with a language command**. Both levels are trained with imitation learning.

Slides 28–30 use [Yell At Your Robot (Shi et al., RSS 2024)](https://arxiv.org/abs/2403.12910). The high level is a language policy that reads RGB images and outputs a sentence. The low level is a language-conditioned BC policy (LCBC) that outputs joint targets on an ALOHA workcell.

Can you use [DAgger](/posts/ai/2026-09-30-cs224r-imitation-learning-en) on either level? Yes. And the high level **can be updated with language-only interventions**. The recipe is called **HL DAgger**:

1. Freeze the low-level policy.
2. During execution, a human's language correction (e.g. "avoid pouring outside the bag") overrides the high-level prediction.
3. Use those corrections as supervision to update the high level.

Slide 33's video shows the fine-tuned policy correcting itself. Slide 34 compares a flat VLA against a hierarchical VLA, and a base hierarchical policy against one with high-level DAgger, citing [Hi Robot (Lucy Shi et al., ICML 2025)](https://arxiv.org/abs/2502.19417). Slides 35–36 are titled "With hierarchy, the robot is better at long-horizon tasks" and carry a 2X label, from Yell At Your Robot and [π0.5 (Pi team, 2025)](https://arxiv.org/abs/2504.16054). The PDF shows only the figure and the 2X label, not which metric it refers to, so this post does not guess.

### Imitation with image subgoals

Slide 38 swaps the high level to output a **goal image**, in practice generated with an image-editing model. The low level becomes a goal-image-conditioned policy. Two benefits:

- No need for segmented videos with language annotations
- The high level can use **unlabeled video data**

Slides 39–40 use [SuSIE (Black, Nakamoto et al., ICLR 2024)](https://arxiv.org/abs/2310.10639) on tasks like "move the wooden bowl to the top of the table," "put the toothpaste into the wooden bowl," and "open the drawer." Slide 40 asks whether adding human videos to high-level training helps, comparing "robot data only" with "robot data + videos of humans."

Slide 41 adds a chain-of-thought version (visual from Chen, Belkhale et al. 2025, Training Strategies for Efficient Embodied Reasoning) and notes: **fine-tuning large-scale hierarchical robot learning systems with RL is an open and important research direction**. That is exactly where [L17 RL for VLAs](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en) picks up.

### Hierarchical RL: state goals and language goals

Slide 43 gives two examples:

- **State goals** (e.g. relative target positions of the agent and objects), from [Nachum et al., NeurIPS 2018 (HIRO)](https://arxiv.org/abs/1805.08296):
  - Low level: a goal-conditioned policy with a goal-reaching reward
  - High level: trained to output goal states, which are its actions
  - Hindsight relabeling on the high-level actions, with an off-policy algorithm. Hindsight relabeling was covered in the [multi-task and GCRL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en) post
- **Language goals** (or simple semantic tasks), from [Jiang, Gu, Murphy, Finn, NeurIPS 2019](https://arxiv.org/abs/1906.07343):
  - Low level: a language-conditioned policy with hindsight language relabeling
  - High level: trained to output language

Slide 44 leaves an active research question: can you discover a set of diverse skills **without supervision**? The citation is [Diversity is All You Need (Eysenbach et al., ICLR 2019)](https://arxiv.org/abs/1802.06070).

## Assigned reading: SayCan

The schedule lists [SayCan](https://arxiv.org/abs/2204.01691) for this lecture, though no 2026 slide mentions it. Going by the abstract, it is an early example of "the LLM as the high level":

- LLMs hold a lot of semantic knowledge but lack real-world experience, so the steps they propose may not fit a given robot and environment.
- The fix is to constrain the LLM with **pretrained skills**, so it only proposes language actions that are feasible and fit the context.
- Each skill's **value function** grounds the LLM's knowledge in the physical environment.
- It completes long-horizon, abstract language instructions on a mobile manipulator.

Read against slide 18 ("LLMs are often good high-level policies") and slide 21 (when to switch goals), SayCan has the LLM propose and the low-level skills' value functions vote.

## Tying it together

Slide 45 recaps three things: why long-horizon tasks are hard, why hierarchy may help, and the three design choices (goal representation, supervision per level, when to switch).

**Try this**: for the agent or robot system you are building, write three lines: what g is, what data trains each level, and what triggers replanning. A system that can't fill in the third line is the most likely to hit slide 21's "perpetually stuck" failure.

Next is Guanya Shi's guest lecture on moving behaviors learned in simulation onto real robots. See [L16 Sim-to-Real](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en).

Further reading on this site:

- [Berkeley CS285: exploration and open problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- [CS285: imitation and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en), another take on DAgger

## What this post can and cannot confirm

Confirmed: the text, algorithm steps, and figure titles in the 2026 slides; the schedule's date and reading; the title and length of the 2025 video; and every paper title (each arXiv page was opened). Not confirmed: what was said in the slide 13 discussion, the numbers and metrics behind the bar charts on slides 34–36, and how the four industry systems on slide 23 were presented in class. The 2026 slides title SuSIE "SuSIE: Subgoal Synthesis via Image Editing," while arXiv titles it "Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models." They are the same paper.

Series navigation: previous [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl-en) | next [L16 Sim-to-Real Robot Learning](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 15 slides: Hierarchy in Imitation and Reinforcement Learning (2026)](https://cs224r.stanford.edu/slides/15_cs224r_hierarchy_2026.pdf)
- [CS224R Spring 2025 archive](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 15: Hierarchical RL and IL (YouTube, supplement)](https://www.youtube.com/watch?v=iKWYLSVAtfM)
- [Ahn et al. 2022: Do As I Can, Not As I Say (SayCan)](https://arxiv.org/abs/2204.01691)
- [Shi et al. 2024: Yell At Your Robot](https://arxiv.org/abs/2403.12910)
- [Shi et al. 2025: Hi Robot](https://arxiv.org/abs/2502.19417)
- [Physical Intelligence 2025: π0.5](https://arxiv.org/abs/2504.16054)
- [Black, Nakamoto et al. 2023: SuSIE (Zero-Shot Robotic Manipulation with Pretrained Image-Editing Diffusion Models)](https://arxiv.org/abs/2310.10639)
- [Nachum et al. 2018: Data-Efficient Hierarchical Reinforcement Learning](https://arxiv.org/abs/1805.08296)
- [Jiang et al. 2019: Language as an Abstraction for Hierarchical Deep RL](https://arxiv.org/abs/1906.07343)
- [Eysenbach et al. 2018: Diversity is All You Need](https://arxiv.org/abs/1802.06070)
