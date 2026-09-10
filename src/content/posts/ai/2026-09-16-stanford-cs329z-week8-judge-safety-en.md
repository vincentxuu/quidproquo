---
title: "Reading Stanford CS329Z Week 8: Let a Model Judge, Then Guardrail the Agent"
date: 2026-09-16
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 9
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 27
tldr: "Week 8 builds model judges with MT-Bench and Anthropic's eval guide on Monday, then faces production leakage with PrivacyLens and four guardrails on Wednesday. The paper video is due Friday, and this week's deliverable is one working judge score plus one permission check."
description: "A guided reading of Stanford CS329Z Week 8: three grader types, pairwise and pointwise judge shapes, judge bias and calibration, plus the action-time leakage PrivacyLens exposes and four guardrails — prompt injection, red-teaming, sandboxing, and permission."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)

Week 8 is judges week plus safety week. Monday (11/9) covers LLM-as-a-Judge and eval infrastructure. Wednesday (11/11) covers Agent Safety and Guardrails. The paper video is due Friday, and quarter projects enter final rehearsal.

Open-ended answers have no answer key, and that is the week's starting point. Classic multiple-choice benchmarks measure right versus wrong, like [MMLU](https://arxiv.org/abs/2006.03341). Two answers can both be correct while only one is actually useful, and that gap is invisible to classic benchmarks.

Human grading is the gold standard, at gold-standard prices and speed. Every prompt change cannot mean rehiring dozens of graduate students to vote again. The fix is asking a strong model to judge, validated end to end in the [MT-Bench paper](https://arxiv.org/abs/2306.05685). Anthropic's [eval guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) then slots the judge into the full agent-evaluation puzzle. Judges make mistakes too, and Wednesday's safety lecture answers the other question: why do agents that pass grading still fail in production?

Of the three anchor readings, this guide reads the Anthropic eval guide and MT-Bench closely. The safety thread centers on [PrivacyLens](https://arxiv.org/abs/2409.00138), plus deployment-time guardrail practice.

## Three grader types: pick the right tool before automating

Anthropic sorts graders into three kinds. Code-based graders check deterministic evidence: string matching, unit tests, static analysis, tool-call records. Model-based graders check open-ended quality: rubric scoring, natural-language assertions, pairwise comparison, reference-based grading, multi-judge consensus. Humans serve as the gold standard: expert review, crowdsourcing, spot-check sampling.

The selection rule is pragmatic: wherever a deterministic check works, use it. Reserve model judges for places only they can reach, and reserve humans for calibrating model judges plus periodic sampling. One support task can carry all three grader types: whether the ticket landed resolved in the database, whether the key tools were called by the book, and whether the tone showed empathy. The first two are code-based; only the last one calls a model.

Note the conclusion early: the judge is just one cell in the model-based column, not the whole eval. The wrong grader choice is beyond any judge's rescue.

## Pairwise, pointwise, and reference answers

Judge shapes come in three. Pairwise judging places two answers side by side and picks the winner without scoring. Pointwise judging scores a single answer directly, also called single-answer grading. Reference-guided judging treats math and reasoning questions specially: attach the reference solution, then judge.

The tradeoff sits between cost and sensitivity. Pairwise judging is sensitive, while its grading workload grows quadratically with the number of contestants. Pointwise judging scales well, while absolute scores drift with the judge model. MT-Bench validation shows [GPT-4](https://arxiv.org/abs/2303.08774) pointwise and pairwise results agreeing closely, with a fairly stable internal rubric.

Math questions are the judge's weak spot: solving a problem does not imply grading one. Wrong answers drag the judge along, and even basic questions can get misjudged. Two mitigations help: let the judge solve the question independently before grading, or attach the reference answer outright. With the reference attached, the failure rate falls to roughly fifteen percent.

## Bias: three bad habits of judges

The first bad habit is position bias: a standing preference for whichever answer comes first. The fix is judging twice with positions swapped, counting a win only when an answer wins both rounds, and calling the rest ties. Double the grading cost buys one trustworthy outcome.

The second is verbosity bias: long, watery answers get favored. The paper tests it with a "repetitive list" attack: rephrase an answer's list and paste it back in, adding zero new information. Weaker judges fall for it nearly every time, while GPT-4 falls for it under one time in ten.

The third is self-enhancement: the suspicion that judges prefer their own outputs. Evidence here is thin, with [Claude](https://www.anthropic.com/claude) showing the largest apparent self-love and GPT-3.5 showing none. The paper closes honestly: inconclusive, pending cleaner controlled experiments.

Calibration is where trust comes from. The baseline is votes from fifty-eight experts. GPT-4 agrees with the human majority eighty-five percent of the time. Human experts agree with each other eighty-one percent of the time. The judge ties humans rather than beating them — read that as a ceiling statement.

## Auto-generating the rubric: AutoMetrics

Monday's third anchor changes the move: instead of hand-writing rubrics, generate the metrics. [Ryan et al.'s AutoMetrics](https://arxiv.org/abs/2512.17267) (note first author Michael Ryan teaches this course) starts from MetricBank's 48 ready-made metrics, generates LLM-judge criteria from lightweight human feedback, and composes the set against the human signal with regression. The test spans five tasks. Agreement with human ratings beats pure LLM-as-a-judge by up to a third. The price is under a hundred feedback points. The composed set doubles as a proxy reward matching verifiable rewards — prototype teams without money or traffic finally get a cheap, trustworthy optimization target.

## Four guardrails: passing grading is not production safety

Wednesday's core evidence comes from PrivacyLens: acing the quiz still leaks in action. The theoretical footing is [contextual integrity](https://en.wikipedia.org/wiki/Contextual_integrity): privacy is not the secret itself but whether an information flow fits its context's norms. One sentence is harmless to a colleague and a disaster inside a letter to your manager.

Method-wise, the authors collect four hundred ninety-three privacy-sensitive seeds. Each seed is a five-tuple: data type, data subject, sender, recipient, and transmission principle. Seeds grow into vignettes, then into full tool trajectories inside a sandbox. Probing questions test the quiz layer while the final action tests the doing layer, scored separately.

The result is a cold splash. Even with privacy-enhancing prompts, GPT-4 leaks sensitive information in just over a quarter of cases. [Llama-3-70B](https://arxiv.org/abs/2407.21783) leaks in nearly four cases in ten. Answering well is not acting well, now with reproducible evidence.

Evals are the mock exam and guardrails are the exam proctors, with four standard pieces in practice. First, injection defense: treat tool outputs and retrieved content as untrusted input, echoing the [MCP spec from Week 3](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en). Second, red-teaming: grow many trajectories from one seed and actively hunt the leakiest path. Third, sandboxing: start every trial from a clean environment so experiments cannot wound the host. Fourth, permission: ask explicit consent before irreversible tool calls.

## Attacks evolve: privacy offense and defense in simulation

Wednesday's other two anchors push the threat forward. [Zhang and Yang (Diyi Yang again) search privacy risks through simulation](https://arxiv.org/abs/2508.10880): hostile agents coax sensitive information out over multi-turn dialogue, where dynamic conversation outruns pre-written defenses. Their setup lets offense and defense co-evolve inside simulation — an LLM optimizer rewrites instructions from trajectories, with parallel multi-thread search over the strategy space. Both sides evolve: attacks graduate from blunt requests to impersonation plus forged consent, defenses from plain rules to identity-verification state machines. The discovered plays generalize across scenarios and backbone models, ready to reuse for privacy-aware agents.

## Deanonymization: off-the-shelf tools suffice

[Li's deanonymization study](https://arxiv.org/abs/2601.05918) stings more: in Anthropic's public Interviewer dataset, twenty-four scientist interviews mention published work. Six were linked back to specific paper authors. The attacker built nothing new — an LLM with search and agentic capabilities, a few prompts of cross-referencing. Safeguards break when decomposed into benign subtasks. Anthropic has been notified. Read it as the week's warning: once rich data is public, every anonymization assumption of the agent era needs recomputing.

## What to do: ship one judge score and one permission check

**What to do**: give your own agent one judge eval plus one guardrail. For the eval, pull twenty real tasks from the bug tracker, check correctness deterministically, and judge tone and completeness with one natural-language assertion each, rerunning weekly to catch regressions. For the guardrail, start with exactly one rule: irreversible moves like sending mail or deleting files need explicit permission first. This week's deliverable is one live judge score plus one permission check that has blocked a real incident.

## Where it sits in the course

[Week 7](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en) spreads out the benchmark map, and Week 8 hands over the tools: automated judges guard quality, guardrails guard safety. This mapping follows the official CS329Z schedule, with the paper video due Friday. Monday's three anchors are the eval guide, MT-Bench, and AutoMetrics. Wednesday's three are PrivacyLens, simulation offense-defense, and deanonymization. Once Friday's paper video lands, only Demo Day remains. The judge eval is the project's quality gate, and the guardrail is its on-stage insurance.

## This week's course material

- Mon 11/9 LLM-as-Judge & Evaluation Infrastructure: anchor readings Demystifying Evals, MT-Bench, AutoMetrics (covered above); further reading [Zhu et al., AutoLibra: metric induction from open-ended human feedback](https://openreview.net/forum?id=4BjGVZ7Bxn).
- Wed 11/11 Agent Safety & Guardrails: anchor readings PrivacyLens, Zhang & Yang, Li (covered above); further reading [Wen et al., contextualized privacy defense](https://arxiv.org/abs/2603.02983), [OpenAI on prompt injections](https://openai.com/index/prompt-injections/), [Anthropic's Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy).
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## References

- On this site: [Week 7: evals and benchmarks](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en), [Week 3: MCP and DSPy](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Grace et al., Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685), [Ryan et al., AutoMetrics](https://arxiv.org/abs/2512.17267), [Shao et al., PrivacyLens, NeurIPS 2024](https://arxiv.org/abs/2409.00138), [Zhang & Yang, Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880), [Li, Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918)
- Tools: [FastChat llm_judge](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge), [PrivacyLens](https://github.com/SALT-NLP/PrivacyLens)
