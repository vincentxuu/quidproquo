---
title: "Multimodal Agents in Robotics: How a VLA Connects to Actions | Stanford CS329A Lecture 19"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 16
description: "From Physical Intelligence's π0.5 and knowledge insulation research posts: how a VLA model outputs continuous actions, why gradients from the action module damage language ability, and how to read the experiments on generalizing to new homes."
tldr: "A VLA adds an action module to a vision-language model; letting that module's gradients flow back harms language understanding, so knowledge insulation blocks the gradient, while π0.5 co-trains on web data and data from many robots to gain generalization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-cs329a-session-19-robotics-vla)

A software agent's actions are text: a piece of code, a tool call. A robot's actions are joint commands issued dozens of times per second, and a mistake cannot be rerun. Session 19 of [CS329A](https://cs329a.stanford.edu/) Autumn 2025 was a guest lecture by Danny Driess of [Physical Intelligence](https://www.physicalintelligence.company/), titled "Multimodal AI Agents in Robotics." After reading this guide you should be able to explain how a vision-language-action (VLA) model grows an action output out of a language model, what goes wrong in training, and how to read a data ablation table. Prerequisites: a vision-language model (VLM) can answer questions about images, and gradients flow backward through a network.

Read [Lecture 5 on multi-step planning](/posts/ai/2026-10-11-stanford-cs329a-lecture-05-reasoning-planning-en) first. A robot also breaks a task into subtasks before executing; the execution layer is just continuous motion instead.

**Video status: No recording or slides are public for this session.** On 2026-10-13 I checked the Stanford Online playlist, the official schedule and its edit history, both instructors' channels, and the speaker's personal site; none has material for this session. This guide uses public material from the speaker on a similar topic instead: knowledge insulation, on which he is first author, and π0.5, on which he is a listed author. Both are official research posts from Physical Intelligence. This guide does not represent what was said in the session.

## From VLM to VLA: how actions are output

The [knowledge insulation post](https://www.physicalintelligence.company/research/knowledge_insulation) divides VLA development into two generations. The first, with RT-2 and OpenVLA as its examples, discretizes each joint angle into fixed-size bins, assigns a token to each bin, and has the model output actions the way it would answer a numeric question. That works for basic manipulation such as picking up objects, but it suits high-frequency, precise, fluent motion poorly, and inference is slow.

The second generation, starting with π0, adds an "action expert" beside the VLM backbone. It can attend to the backbone's internal representations and specializes in producing actions with continuous generative methods such as flow matching. The post uses a brain analogy: the vision encoder is like a visual cortex, the language model like a prefrontal cortex, and the action expert like a motor cortex attached afterward.

## The problem: gradients from the action module damage the backbone

Once the action expert is attached, its gradients flow back into the VLM backbone during training. The post's experiments show two consequences: learning becomes much slower, and the backbone loses some knowledge acquired in pretraining. The visible symptom is ignoring instructions. In the post's example, a robot asked to put the spoon into the dish container grasps the trash instead.

A purely autoregressive VLA, π0-FAST in the post, does not have this issue, but inference is too slow. In the post's side-by-side video, it has only just started moving when the new method has already finished.

## The method: block the gradient and give the backbone its own action objective

Knowledge insulation does three things.

First, it stops the gradient from the action expert to the backbone. That alone is not enough: the backbone no longer receives a signal from robot data, so its representations are not adapted to control. In the post's shirt-folding experiment, the frozen-backbone version cannot do the task.

Second, it has the backbone itself predict discrete FAST action tokens. This is a representation-learning objective that quickly gives the backbone action-related representations, which the action expert then uses to produce continuous actions. After training, the discrete actions are discarded.

Third, it trains at the same time on general vision-language data and high-level robot command data, which preserves the backbone's semantic knowledge.

The reported result: on a table-bussing task, the new method needs 7.5 times fewer training steps than π0 while keeping π0's fast inference. The architecture diagram labels the backbone at about 3 billion parameters and the action expert at about 300 million.

## π0.5: generalizing to homes it has never seen

The [π0.5 post](https://www.physicalintelligence.company/blog/pi05) asks whether a robot can complete cleaning tasks in homes that are absent from the training data. Its main principle is co-training on heterogeneous data: action data from many kinds of robots, image-text data from the web, high-level examples labeled with subtasks, and demonstrations in which a person coaches the robot step by step in spoken language.

Inference has two levels. The model first outputs a high-level action in text, for example going from "clean the bedroom" to "pick up the pillow." It then outputs low-level actions for that subtask, in the form of a 50-step, 1-second chunk of continuous joint commands. The post likens this to a kind of chain-of-thought, with the same model serving both levels.

The post states its limits openly: π0.5 does not always succeed on the first try, and it often makes mistakes in both its high-level deductions and its motor commands. It also mentions that robots could in the future use their autonomous experience to improve with less supervision. That is the physical-world version of this course's self-improvement theme, though the post does not claim to have done it.

## A worked example: reading the data ablation table

The π0.5 post removes different parts of the training data and compares results. The table below gives success rates under the post's out-of-distribution (OOD) condition, with unseen objects:

| Training data | OOD success rate |
|---|---|
| Full π0.5 | 94% |
| Without web data (no WD) | 74% |
| Without cross-embodiment data from other robots (no CE) | 49% |
| Without multi-environment data from non-mobile robots (no ME) | 31% |

The reasoning: removing web data costs 94−74=20 percentage points; removing cross-embodiment data costs 94−49=45; removing multi-environment data costs 94−31=63.

What the result means: under this condition all three data sources contribute. By the numbers, the largest drop is in the row without multi-environment data; that data comes from static robots placed in many different homes, not from the mobile robots being tested. The post's figure caption stresses a different contrast: web data makes the biggest difference for recognizing unseen object categories, while data from other robots matters under every condition. This guide's reading is that the two statements look at different comparisons and do not conflict: on the in-distribution cleaning tasks, removing web data makes almost no difference (83% versus 82% success), and only with unseen objects does it cost 20 percentage points. So whether web data helps depends on what you test.

The post also reports a scaling study: with about 100 training environments, performance approaches that of a baseline model trained directly on the test environment.

## Variation check, with answers

First, check the mechanism. What happens if you only stop the gradient from the action expert to the backbone and add nothing else? **Answer: the backbone keeps its language ability, but the motion will be poor.** The backbone no longer receives any signal from robot data, so its representations are not suited to control; in the post's shirt-folding experiment, the frozen-backbone version cannot do the task. That is why the backbone is additionally trained to predict discrete FAST action tokens, which supplies an action-related training signal.

Next, check the rhythm of the two-level inference. The following calculation was written for this guide. An action chunk is 50 steps over 1 second, so the control frequency is 50÷1=50 Hz. Suppose the robot runs inference again after executing each chunk; a 2-minute subtask then needs 120÷1=120 low-level inferences. What happens if you switch to an autoregressive model whose inference takes twice as long? **Answer: the wait for each chunk doubles, so motion pauses between chunks, or the robot has to execute actions computed longer ago.** This shows why the post treats inference speed as a goal alongside success rate. The "twice" comes from the post's observation that the autoregressive model takes twice as long to complete the same task; applying it here is a simplifying assumption.

A common misreading takes these videos to mean household robots are ready. The two posts test shirt folding, table bussing, putting items in a drawer, and household cleaning, the π0.5 post includes videos of its own model failing, and none of the success rates in the knowledge insulation post reaches 100%. Something to do tonight: find a robot demo video you care about and check whether its test environment appears in the training data. That is the line the π0.5 post draws between generalization and memorization.

## English reading and expression

Sentences written for this guide: *The action expert reads the backbone's representations, but its gradients do not flow back.* *Web data helps most when the robot meets unfamiliar objects.* Practice stating the conclusion of the ablation table in two sentences. This is reading and expression practice, with no original audio to shadow.

## References

- [CS329A Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [VLAs that Train Fast, Run Fast, and Generalize Better (Physical Intelligence, 2025-05-28)](https://www.physicalintelligence.company/research/knowledge_insulation)
- [π0.5: a VLA with Open-World Generalization (Physical Intelligence, 2025-04-22)](https://www.physicalintelligence.company/blog/pi05)
- [Knowledge Insulating Vision-Language-Action Models (paper)](https://arxiv.org/abs/2505.23705)
