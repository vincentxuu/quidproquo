---
title: "Post-Training from Chatbots to Agents: A Public-Sources Guide | Stanford CS329A Lecture 9"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 9
description: "Compare the post-training sections of the Gemini 1.0 and Gemini 2.5 technical reports to see how the reward signal moved from human preference over one response to verifiable outcomes of multi-step tool tasks."
tldr: "A chat model is rewarded for a single response people prefer; an agent has to be rewarded for whether a multi-step task actually finished, which needs different data and environments."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-cs329a-session-09-post-training-agents)

A pretrained model can continue text, but it does not automatically become a useful assistant, let alone an agent that operates tools over many steps. The work in between is called post-training. Session 9 of [CS329A](https://cs329a.stanford.edu/) Autumn 2025 was a guest lecture by Melvin Johnson of Google DeepMind, titled "Evolution of Post-training from Chatbots to Agents." After reading this guide you should be able to say which signal serves as the reward in chat-era and agent-era post-training, and decide which one a given task needs. Prerequisite: the difference between supervised fine-tuning and reinforcement learning (RL).

Read [Lecture 6 on train-time improvement](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl-en) first. That lecture teaches how feedback gets written back into weights; this guide looks at which feedback production models actually use.

**Video status: No recording or slides are public for this session.** On 2026-10-13 I checked the Stanford Online playlist, the official schedule and its edit history, both instructors' channels, and the speaker's personal site; none has material for this session. I also found no public talk by the speaker on this topic. This guide uses public material on a similar topic instead: the post-training sections of two official Gemini technical reports. The speaker is listed among the contributors to the Gemini 2.5 report. The comparison and examples are this guide's own and do not represent what was said in the session.

## The chat era: reward comes from human preference over one response

Section 6.3 of the [Gemini 1.0 technical report](https://arxiv.org/abs/2312.11805) describes post-training in four stages. First, collect prompts that represent real use. Second, apply supervised fine-tuning (SFT) on demonstrations of what the output should be for a prompt. Third, collect several candidate responses to the same prompt, ask people to compare them, and train a reward model (RM) on that feedback. Finally, use the RM as the scorer for RLHF, reinforcement learning from human feedback.

The unit being scored is one response. The RM learns which response people prefer, so it is good at qualities you can see at a glance: tone, completeness, whether the model refused too readily. The report also describes a loop: RL pushes the model into regions the RM has not seen, and the RM is then improved with new evaluation and data.

## The agent era: reward has to look at the result after many steps

Section 2.4 of the [Gemini 2.5 technical report](https://arxiv.org/abs/2507.06261) lists what changed. More training compute went to RL. The reward sources it emphasizes are verifiable rewards and model-based generative rewards. Algorithmic changes made RL more stable over longer training. The report says these changes let the model learn from more diverse and complex RL environments, including ones that require multi-step actions and tool use.

Other sections of the same report add three details. Thinking is trained with RL: the model learns to spend more inference compute before answering, and users can set a thinking budget to trade performance against cost. For coding, post-training used a curated set of engineering tasks; the report lists SWE-bench Verified rising from 34.2% for Gemini 1.5 Pro to 67.2% for Gemini 2.5 Pro, both under what the report calls the multiple-attempts setting: several agent trajectories are sampled and the model picks one to submit for grading. Safety training uses "RL\*F": the reward combines a Data Reward Model trained on human preference data, with a Critic, a prompted model that grades responses against predefined rubrics.

Putting the two reports side by side:

| | Chat era (Gemini 1.0 report) | Agent era (Gemini 2.5 report) |
|---|---|---|
| Unit scored | One response | A whole multi-step trajectory |
| Reward source | RM trained on human preference | Verifiable outcomes, model grading, and human preference together |
| Training setting | A prompt dataset | RL environments with tools and multi-step actions |

This table is this guide's summary, not a table from either report. Neither report publishes details such as the number of environments or reward weights, so the table shows direction only and cannot be used to reproduce the training pipeline.

## A worked example: a refund agent

This is a teaching example written for this guide; the numbers are not from the reports. A customer-service agent handles a refund: look up the order, look up the payment record, confirm eligibility, call the refund API, update the order status, send a confirmation email. That takes six tool calls. Suppose each step succeeds on its own with probability 0.9 and the steps are independent. The whole task then succeeds with probability 0.9⁶ ≈ 0.53.

Scored the chat-era way, a rater reads the final message, "Your refund has been processed." It is polite and complete, so its preference score is high, yet in about 47% of cases the six steps did not all succeed; an agent that fails to notice a failed step still writes this message. Scored with a verifiable reward, you check whether the order's status in the database changed to refunded and whether the amount is right. That check ignores wording and looks only at the final state of the environment.

Both signals are still needed. The database check will not tell you whether the confirmation email explained the refund timeline clearly; that still takes a rubric or a human judgment.

## Variation check, with answers

Change the task to "write an email politely declining an interview invitation." It is one step, uses no tools, and leaves no environment state to inspect. Which reward fits? **Answer: human preference or a model grading against a rubric.** When no verifiable outcome exists, forcing an automatic check, such as whether the email contains "thank you," only teaches the model to hit keywords.

Now change it to "fix the failing tests in this repo." **Answer: verifiable reward first.** Whether the tests pass can be checked by running them. You still need a separate check that the model did not pass by deleting tests or hard-coding answers, which is the exploitable execution feedback discussed in [Lecture 4](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback-en).

A common misreading treats a higher benchmark score as proof that a post-training method works. The scores in these reports also depend on pretraining data, model size, and inference settings, so they cannot be attributed to one stage. Something to do tonight: pick a task you want to automate and write down which state in the environment changes when it is done. If you cannot write that down, file the task under the kind that needs human judgment.

## English reading and expression

Sentences written for this guide: *A preference score rates one response; a verifiable reward checks the final state of the environment.* *Polite wording does not prove the refund went through.* Practice explaining in two sentences what to check for the test-fixing task. This is reading and expression practice, with no original audio to shadow.

## References

- [CS329A Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [Gemini: A Family of Highly Capable Multimodal Models (Gemini 1.0 technical report, Section 6.3)](https://arxiv.org/abs/2312.11805)
- [Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context, and Next Generation Agentic Capabilities (Sections 2.4, 2.5, 2.6, 5.3)](https://arxiv.org/abs/2507.06261)
