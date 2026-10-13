---
title: "LLM Reasoning: Why Intermediate Tokens Help | Stanford CS329A Lecture 15"
date: 2026-10-13
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 12
description: "Following the slides of Denny Zhou's public lecture of the same title: a definition of reasoning, decoding, how SFT and RL fine-tuning differ, and why self-consistency picks the most frequent answer rather than the most frequent reasoning path."
tldr: "Reasoning is the intermediate tokens between input and output; RL fine-tuning beats imitating human solutions because of a reliable verifier, and sampling several times then taking the most frequent answer pushes accuracy further."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-13-cs329a-session-15-llm-reasoning)

"Can models reason?" is often argued as philosophy. Denny Zhou of Google DeepMind offers a definition you can work with: reasoning is the intermediate tokens generated between the input and the final answer. He gave session 15 of [CS329A](https://cs329a.stanford.edu/) Autumn 2025 as a guest, under the title "LLM Reasoning." After reading this guide you should be able to explain why intermediate tokens help, how SFT and RL fine-tuning differ, and work through self-consistency by hand. Prerequisites: a language model predicts one token at a time, and sampling differs from greedy decoding.

Read [Lecture 2 on test-time compute](/posts/ai/2026-10-11-stanford-cs329a-lecture-02-test-time-compute-en) and [Lecture 6 on train-time improvement](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl-en) first. This session reads like those two lectures retold from one researcher's own line of work.

**Video status: No recording or slides are public for this session.** On 2026-10-13 I checked the Stanford Online playlist, the official schedule and its edit history, both instructors' channels, and the speaker's personal site; none has material for this session. This guide uses public material from the speaker on a similar topic instead: the [slides](https://dennyzhou.github.io/LLM-Reasoning-Stanford-CS-25.pdf) of his lecture of the same title at Stanford CS25 on April 29, 2025, which also has a [public recording](https://www.youtube.com/watch?v=ebnX5Ur1hBk). The two talks are about half a year apart. This guide follows the slides. I also checked the self-consistency segment of the recording against its automatic captions (roughly minutes 41–51); the rest was not checked line by line, and it does not represent what was said in the CS329A session.

## Reasoning is intermediate tokens, and theory backs it

The slides open with a synthetic task: concatenate the last letter of each word in "artificial intelligence." Answering "le" directly is no reasoning. Writing "the last letter of artificial is l, the last letter of intelligence is e, concatenating gives le" before answering is reasoning.

Why do those extra sentences help? The slides cite a [theory paper](https://arxiv.org/abs/2402.12875) Zhou co-authored: for any problem solvable by a boolean circuit of size T, a constant-size transformer can solve it by generating O(T) intermediate tokens; when generating the final answer directly, it either needs a huge depth or cannot solve the problem at all. In plain terms, the number of layers is fixed, and writing out intermediate steps spreads the computation over a longer output.

## Decoding: the model already can, greedy just did not pick it

The slides name a common wrong belief: pretrained models cannot reason without prompt engineering or fine-tuning. The counterexample is an apple problem: "I have 3 apples. My dad has 2 more apples than me. How many apples do we have in total?" The first candidate under greedy decoding is "5 apples," which is wrong. Further down the candidate list, responses appear that first work out "dad has 5 apples, 3+5=8."

How do you pick among candidates? The slides look at the model's confidence in the final answer: responses that contain reasoning have much higher confidence in their answer. This is [chain-of-thought decoding](https://arxiv.org/abs/2402.10200). It has the same structure as [Lecture 2](/posts/ai/2026-10-11-stanford-cs329a-lecture-02-test-time-compute-en): generate more candidates, then find a way to select.

## Prompting, SFT, and RL fine-tuning

The slides evaluate three ways to make the good answer rank first.

Prompting is simple and works, but few-shot examples must be prepared per task, and the generic "Let's think step by step" performs clearly worse. The slides add a remark: nobody shows similar solved problems before asking a person a question, so prompting approaches are actually weird.

SFT collects problems with step-by-step solutions written by humans and maximizes the likelihood of those solutions. It is generic, but it does not generalize well, and scaling the data does not help much.

RL fine-tuning changes where the data comes from: the model generates the solutions, and training maximizes the likelihood of the correct ones and minimizes that of the wrong ones. The slides explain this with a first principle of machine learning: directly optimize what you want. What we want is generation quality, not resemblance to humans. Then comes the heaviest line in the deck: a reliable verifier is the most crucial part of RL fine-tuning, rather than the RL algorithm. Its limitation sits in the same place: not every task can be verified automatically. That matches the main thread of [Lecture 3](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification-en).

## Self-consistency: pick the most frequent answer

During decoding the model looks for the most probable full string of reasoning plus answer, but what we want is the most probable answer. Many different reasoning paths can reach the same answer, so the probabilities of those paths should be summed, which means marginalizing over reasoning paths. [Self-consistency](https://arxiv.org/abs/2203.11171) implements this: sample several responses at random and choose the answer that appears most often.

The slides use an egg problem whose three sampled answers are 18, 26, and 18. Choose 18 because it appears twice. The two responses that reach 18 are worded differently; what gets selected is the answer, not the reasoning path. When answers are free-form and cannot be compared directly, the slides present [Universal Self-Consistency](https://arxiv.org/abs/2311.17311), which asks the model itself to select the most consistent response.

## A worked example: choosing among five samples

This is a teaching example written for this guide. One math problem is sampled five times:

| Sample | Reasoning summary | Answer |
|---|---|---|
| 1 | Unit price first, then multiply by quantity | 42 |
| 2 | Total first, then subtract the discount | 42 |
| 3 | Unit price first, then multiply; discount missed | 48 |
| 4 | Set up and solve an equation | 42 |
| 5 | Unit price first, then multiply; discount missed | 48 |

The answer 42 appears 3 times and 48 appears 2 times, so self-consistency picks 42. If you instead picked the most frequent reasoning path, the result changes: the three correct samples each take a different path, so each path appears once, while "unit price first, then multiply; discount missed" appears twice (samples 3 and 5) and is the most frequent path, so you would pick 48. Counting by answer is the marginalization described above. This is why the slides stress that the answer is what gets selected.

What it means: high consistency says the model is more likely right on this problem; it does not guarantee correctness. If all five samples answered 48, self-consistency would hand back the wrong answer with great confidence.

## Variation check, with answers

The slides leave two questions for the audience. Below, the speaker's response in the CS25 recording comes first (roughly minutes 48–50, paraphrased from automatic captions), followed by this guide's explanation.

Question one: when the model outputs the answer directly, without intermediate steps, do you still need to sample several times and take the most common answer? **Answer: no.** An audience member answers that you can just read the probabilities, and the speaker agrees: it is like classical machine learning, where you take the output with maximum probability, so self-consistency is only useful when there is reasoning. This assumes you can get the probability of each answer.

Question two: can you instead have the model write several answers in one response and take the most common? The speaker does not rule on it directly; he says you can try it and points back to the same principle: choose the final answer with maximum probability. **This guide's inference is that it is not equivalent.** Later answers in the same response are conditioned on earlier ones, so they are not independent samples, and their counts no longer estimate each answer's probability.

The deck ends with four comparisons: reasoning beats no reasoning, RL fine-tuning beats SFT, aggregating multiple answers beats a single answer, and retrieval plus reasoning beats reasoning alone. It lists two next steps: tasks without a unique verifiable answer, and building real applications rather than solving benchmarks. Something to do tonight: take a calculation you often ask a model, sample it five times, record answer counts as in the table above, and see whether consistency and correctness move together on your problem.

## English reading and expression

Sentences written for this guide: *Self-consistency picks the most frequent answer, not the most frequent reasoning path.* *A reliable verifier matters more than the choice of RL algorithm.* Practice explaining in two sentences why the five-sample example selects 42. This is reading and expression practice, with no original audio to shadow.

## References

- [CS329A Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [Denny Zhou, LLM Reasoning (Stanford CS25 V5 slides, 2025-04-29)](https://dennyzhou.github.io/LLM-Reasoning-Stanford-CS-25.pdf)
- [Stanford CS25 V5: Large Language Model Reasoning, recording (Stanford Online)](https://www.youtube.com/watch?v=ebnX5Ur1hBk)
- [Chain of Thought Empowers Transformers to Solve Inherently Serial Problems](https://arxiv.org/abs/2402.12875)
- [Chain-of-Thought Reasoning Without Prompting](https://arxiv.org/abs/2402.10200)
- [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171)
- [Universal Self-Consistency for Large Language Model Generation](https://arxiv.org/abs/2311.17311)
