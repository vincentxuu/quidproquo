---
title: "CS336 Lecture 12: There Is No Single True LLM Score, Only Different Games"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm-evaluation, benchmark, agents, safety]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 13
tldr: "Lecture 12 moves from perplexity to exams, chat preferences, agents, reasoning, and safety. Every benchmark changes the capability definition, scaffold, judge, and contamination risk, so evaluation must first say whether it compares a method, model, or complete system."
description: "A guide to Stanford CS336 Spring 2026 Lecture 12: perplexity, exam/chat/agent benchmarks, reasoning, safety, realism, validity, contamination, and evaluation contracts."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-evaluation)

This post covers **CS336 Spring 2026 Lecture 12: Evaluation**, taught by Percy Liang on May 6, 2026. Its primary source is the official executable lecture, [`lecture_12.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py).

The course discusses evaluation before data because data pushes a model toward the behavior being measured. The lecture's central statement is that no single evaluation is true. Rules, objects, and use cases must be specified before choosing a metric.

## Perplexity is smooth but not equivalent to usefulness

A language model is a probability distribution over token sequences. Perplexity measures its average assigned probability to a dataset. It is continuous, cheap, useful for smooth scaling curves, and central to pretraining development.

It also scores every token, including words irrelevant to an actual task. Perplexities across different tokenizers are not directly comparable. Conditional perplexity focuses on a response given a prompt, while products often still require accuracy, rewards, or human preference.

## Exam benchmarks are controlled and saturate

MMLU- and GPQA-like questions have unambiguous answers, controlled subjects and difficulty, and cheap grading. As models improve, benchmarks add harder questions, more answer choices, or expert authors.

The cost is realism: users rarely interact with an assistant through multiple-choice exams. Scores also depend on prompt format, chain of thought, few-shot examples, and answer extraction. Reporting only a model name without the protocol is not reproducible.

## Chat evaluation introduces preference

Chatbot Arena-like platforms ask users to choose blindly between two responses and fit rankings from pairwise outcomes. They collect real prompts and admit new models continuously, while user demographics, spam, style preferences, and correctness judgments remain uncontrolled.

LLM judges scale more cheaply but prefer longer answers or answers resembling their own style. Pairwise comparisons are often more stable than absolute scores, and rubrics improve consistency, but no rubric gives a judge domain knowledge it lacks.

## Agent benchmarks score model plus scaffold

SWE-bench, Terminal-Bench, and Kaggle-like tasks place models in terminals or codebases and grade tests or environment outcomes. Planning, tool use, memory, context management, and retry policy become part of the tested system.

A different scaffold can change scores while the model remains fixed. Results must identify model, tools, budget, environment, scaffold version, and success criteria. A bare “model score on SWE-bench” mislabels system capability as model capability.

## Reasoning and safety have distinct traps

ARC-AGI-like tasks try to reduce memorized knowledge by testing new human-solvable rules, but “pure reasoning” remains difficult to separate from interfaces, search procedures, and test-time compute.

Safety benchmarks derive prompts from harmful behaviors, policies, or regulations and may test jailbreaks. Safety depends heavily on context and culture; refusal rate alone can reward excessive refusal. Harmful compliance and benign utility must be measured together.

## Separate realism, difficulty, and validity

A hard question need not be realistic, and a realistic prompt may lack reliable ground truth. Validity asks whether the metric measures its claimed construct. Occupational and clinical workflows improve realism but require experts, privacy controls, and expensive grading.

Contamination makes all three harder to assess. Pretraining may contain questions or answers while providers hide training data. Live tasks, private data, personal writings, and overlap analysis help, but timestamps can fail through copied pages.

## Write an evaluation contract

Define the evaluation unit: method, checkpoint, or model-plus-agent system. Specify task distribution, prompt template, tools, token/time budget, metric, judge, failure policy, and contamination control. Report central tendency, variance, cost, and common failure modes together.

Lecture 12 does not ask for more leaderboard runs. It requires each score to answer a precise question.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. This guide follows its perplexity, exam, chat, agent, reasoning, safety, and validity structure.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 12 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_12.py)
- [SWE-bench](https://www.swebench.com/)
- [HELM](https://crfm.stanford.edu/helm/)

