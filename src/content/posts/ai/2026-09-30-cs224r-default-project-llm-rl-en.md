---
title: "CS224R Default Project: Fine-Tuning an LLM on Countdown with SFT, IPO, and RLOO"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, post-training, rlvr, homework]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 14
tldr: "The CS224R Spring 2026 default project has you implement three stages on Qwen2.5-0.5B Base for the Countdown arithmetic reasoning task: SFT warm-start, IPO preference optimization, and RLOO with a rule-based verifier reward. All three are compared with the same vLLM evaluation, followed by a research extension of your choice. For the implementation, high-level trainers like SFTTrainer are banned, and so is any AI tool assistance; only the extension is exempt. The extension is half the grade for this project, and it's graded on methodology and documentation, not score. The starter code and datasets are public. What outside readers lack is Modal credits and the autograder."
description: "A guide to the Stanford CS224R (Spring 2026) Default Project, based on the official Default Project Guidelines, the default_proj.zip starter code, and the Custom Project Guidelines: the Countdown task and its datasets, what to implement and report for SFT, IPO, and RLOO, the verifier reward and performance thresholds, the eight extension directions, the 5/1 and 5/22 milestones, grading and AI tool policy, and how it compares with the custom project's novelty requirement. No solutions."
draft: false
glossary:
  - term: "RLOO"
    aliases: ["REINFORCE Leave-One-Out"]
    definition: "A policy gradient estimator: sample k responses to the same prompt, and use the mean reward of the other k−1 responses as each one's baseline. It reduces variance without a value model."
    context: "The third stage of the CS224R default project, paired with Countdown's rule-based verifier reward."
  - term: "IPO (Identity Preference Optimization)"
    aliases: ["IPO", "ΨPO"]
    definition: "A preference optimization objective from Gheshlaghi Azar et al. (2023). It relaxes the Bradley-Terry assumption and replaces DPO's log-sigmoid loss with a squared loss toward a fixed target, reducing overfitting to preference labels."
    context: "This is the IPO the CS224R default project asks you to implement. The 2025 IPO in the L9 reading list is a different method with the same acronym."
  - term: "Countdown"
    aliases: ["Countdown task"]
    definition: "Given a set of numbers and a target value, write an arithmetic expression that uses those numbers to reach the target."
    context: "The CS224R default project uses it as the single task, so SFT, preference optimization, and online RL can be compared on the same problem."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-default-project-llm-rl)

> **Source term**: Based on the Spring 2026 [Default Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf), the [default_proj.zip starter code](https://cs224r.stanford.edu/material/default_proj.zip), and the [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf), downloaded anonymously on 2026-09-30. The [course home page](https://cs224r.stanford.edu/) notes that the default project has changed since Spring 2025, so the 2025 project examples are only a rough guide. This is post 14 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series, and it **contains no solutions**.

The [CS224R](https://cs224r.stanford.edu/) final project is 35% of the course grade. You choose a custom project (your own topic) or the default project. The spec is titled "RL Fine-Tuning of Language Models": you build parts of the RL stack for LLM post-training yourself, then run a research extension.

The spec opens with a note: the default project isn't meant to be less work. It removes the difficulty of devising your own idea and evaluation, so you can put the same effort into a given problem.

It ties the last two lectures together. You run [L9](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)'s preference optimization and the verifiable-reward RL from [L10](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning-en) on the same task.

## The task: Countdown

Each problem gives a set of numbers and a target. The model has to write a sequence of arithmetic operations that turns those numbers into the target. The starter code README's example is target 24 with numbers [3, 4, 6, 8], and the model should output:

```text
<answer>(8 - 4) * 6</answer>
```

The spec says the task tests planning, problem decomposition, and getting the intermediate arithmetic right. It was chosen for control. Preference optimization is usually applied to instruction following, but here the course deliberately builds a Countdown preference dataset too, so SFT, preference optimization, and online RL can be compared directly on one problem.

**Model constraint**: every experiment must use [Qwen2.5-0.5B Base](https://huggingface.co/Qwen/Qwen2.5-0.5B). No other model, and no instruct variant either. The spec says this is required for fair evaluation.

**Datasets**: all four are public on Hugging Face:

| Role | Data |
|---|---|
| SFT warm-start | [Asap7772/cog_behav_all_strategies](https://huggingface.co/datasets/Asap7772/cog_behav_all_strategies) |
| Official SFT checkpoint (optional starting point for IPO/RLOO) | [asingh15/qwen-sft-countdown-defaultproj](https://huggingface.co/asingh15/qwen-sft-countdown-defaultproj) |
| Pairwise preference data (IPO) | [asingh15/countdown_tasks_3to4-dpo](https://huggingface.co/datasets/asingh15/countdown_tasks_3to4-dpo) |
| Prompt/evaluation data (RLOO) | [asingh15/countdown_tasks_3to4](https://huggingface.co/datasets/asingh15/countdown_tasks_3to4) |

The official SFT checkpoint is there to isolate bugs. If your IPO or RLOO misbehaves, swap in the official checkpoint first to rule out your SFT stage.

## The reward: a rule-based verifier

RLOO's reward lives in `evaluation/countdown.py`. Per the README, there are only three score levels:

| Score | Condition |
|---|---|
| 0.0 | no `<answer>...</answer>` found |
| 0.1 | an answer was extracted, but the equation is invalid or the result is wrong (format score) |
| 1.0 | a valid equation that uses exactly the given numbers and equals the target |

The spec says this two-part scoring follows [TinyZero](https://github.com/Jiayi-Pan/TinyZero). Only RLOO uses it. IPO learns from preference data and never sees this reward.

## What each stage asks you to implement

The starter code already handles data loading, RLOO's overall orchestration (sampling, reward computation, checkpoint handoff), and vLLM evaluation. The README lists three functions left for you, each of which raises `NotImplementedError`:

| Stage | Where you write code | Objective |
|---|---|---|
| SFT | `train(...)` in `sft_trainer/sft.py` | next-token prediction, **with loss only on response tokens**, not the prompt |
| IPO | `train(...)` in `ipo_trainer/ipo.py` | a pairwise preference objective with the SFT model as π_ref |
| RLOO | `update(...)` in `rloo_trainer/rloo_update_worker.py` | a policy gradient update with a leave-one-out baseline |

**SFT** is the first stage of most RL pipelines for language. The objective matches pretraining, except the loss only covers the response.

**IPO** follows [Gheshlaghi Azar et al. 2023](https://arxiv.org/abs/2310.12036). The spec writes out the DPO loss for comparison, then explains that IPO relaxes the Bradley-Terry assumption to reduce overfitting to preference labels. It pulls the difference in policy-versus-reference log-ratios toward a fixed value, (2β)⁻¹, with a squared loss instead of a log-sigmoid. Note that the L9 reading [Garg et al. 2025](https://arxiv.org/abs/2502.16182) is also called IPO, but it's a different method (Implicit Preference Optimization). Don't confuse them.

**RLOO** comes from [Ahmadian et al. 2024, Back to Basics](https://arxiv.org/abs/2402.14740). Sample k responses to the same prompt. Each response's baseline is the mean reward of the other k−1. That's the baseline trick from [L3](/posts/ai/2026-09-30-cs224r-policy-gradients-en), without learning a value function.

<details>
<summary>Expand: why RLOO needs importance weighting</summary>

The starter code samples with vLLM but computes gradients on the Hugging Face model. The two paths can produce slightly different token probabilities (kernel numerics, tokenization edge cases). So the spec treats vLLM as a behavior policy μ and the model being trained as the target policy π_θ, and multiplies each sample by w = exp(log π_θ(y|x) − log μ(y|x)). For stability, the ratio is computed in log space and clipped to a maximum. This is the importance sampling from [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) doing real engineering work.

</details>

## Evaluation and performance thresholds

The evaluation loop: collect prompts, sample K responses per prompt with vLLM, score each with the verifier, and report average score and pass@K. All three checkpoints are compared under identical sampling settings.

The spec fixes the sampling parameters:

| | temperature | top_k | top_p | min_p |
|---|---|---|---|---|
| Training | 1.0 | -1 (disabled) | 1.0 (disabled) | 0.0 (disabled) |
| Evaluation | 0.6 | 20 | 0.95 | 0.0 (disabled) |

**Expected performance**: SFT should reach an average test accuracy of 0.3 or higher. IPO and RLOO should beat SFT, reaching 0.4 and 0.5 or higher. Because vLLM sampling is seed-dependent, the autograder allows a 5% margin, so the actual thresholds are 0.25, 0.35, and 0.45. The milestone's performance score is min(your accuracy ÷ threshold, 1.0).

## What each milestone requires

| Date | Deliverable | Weight | Contents |
|---|---|---|---|
| 4/22 | Survey | 0% | group members, confirm you're doing the default project |
| 5/1 | Proposal + SFT | 4% | proposal PDF (extension 1/4 page, related work 1/2 page, technical outline 1/2 page) plus SFT results; separately submit `sft.py` and `eval.json` |
| 5/22 | IPO + RLOO milestone | 5% | report PDF; separately submit `ipo.py`, `rloo_update_worker.py`, and an `eval.json` for each |
| 6/3 | Poster | 8% | focused on the extension |
| 6/8 | Final report | 18% | research-paper format, 20-point rubric |

The survey date comes from the custom project spec and the home page schedule. The other dates and weights come from the default project spec. One line in the default spec's poster section gives the venue time as "6/4/25," which looks like a leftover from last year. The home page schedule and the custom spec both say June 3, 2026.

**Every metric must be reported as a plot**, not just a number:

- **SFT**: train/test cross-entropy loss and token accuracy over iterations, pass@k for the final checkpoint, plus one full completion for a test problem
- **IPO**: train/test IPO loss and reward margin (the implicit reward gap between chosen and rejected), pass@k, one rollout
- **RLOO**: RLOO loss, mean importance weight, KL loss, rollout accuracy over 16 samples per prompt, pass@k, one rollout

The list doubles as a debugging guide. If the reward margin isn't rising, the preference objective is probably wrong. If the importance weight drifts far from 1, vLLM and the training model disagree on probabilities. If KL spikes, suspect reward hacking or forgetting.

## The extension: half the grade, judged on method

Section 5 of the spec is blunt: the extension is 50% of the grade for this project. It should explore a problem that's unanswered or only partly answered. State-of-the-art results aren't required, and the performance bar is "very lax." What counts is the sequence of ideas you tried, how rigorous you were, and how clearly you documented it. A negative or mixed result can still succeed if the methodology is thoughtful and well documented.

The spec lists eight directions, each with references:

1. Synthetic data augmentation and pre-training initialization
2. Improving efficiency through off-policy sampling
3. Incorporating test-time inference (e.g., generative verifiers)
4. Exploration in discrete token spaces
5. Self-play and multi-agent co-evolution
6. Effective tool-integrated reasoning
7. Learning with a curriculum
8. Choose your own adventure

In the 20-point final report rubric, Method (5 points) and Results (6 points, split evenly between quantitative and qualitative) carry the most weight. A standalone one-page extended abstract is worth 2 points.

## Rules: no high-level trainers, no AI tools

- **Code**: except for the extension, you may not use or refer to code from any existing codebase, framework, or AI agent. The spec names Cursor, Codex, Claude Code, and Antigravity. Hugging Face is fine for loading models, tokenizers, and datasets, but not SFTTrainer or similar high-level trainer APIs. You write the training objectives yourself.
- **AI tools**: no collaboration with tools like GitHub Copilot or ChatGPT on any part of the default project, with the extension as the only exception.
- **TAs**: TAs can't look at code for any final project.
- **Compute**: each enrolled student gets $500 in Modal credits for homework and the project. The starter code's Modal config defaults to an H100.

## How it differs from the custom project

The two share the same deliverables and weights. They differ in two ways.

**Novelty requirement.** The custom project spec requires at least one of: answering an open question that the literature leaves unanswered or partly answered; making justified, non-trivial modifications at the component or algorithm level (even if not every dimension improves, with failure modes analyzed); or applying a method to an underexplored domain where the adaptation is non-trivial. It also lists examples of weak proposals, such as running an existing algorithm out of the box on a new dataset. The default project concentrates this requirement in the extension.

**AI tool policy.** The custom project allows Copilot and ChatGPT for boilerplate and data pipelines, but core RL algorithms (the spec cites PPO) must be written independently, and both the milestone and final report need an AI Tools Disclosure section. The default project bans them everywhere except the extension.

## Notes for self-learners

- **The materials are complete.** The spec, starter code, and all four datasets are anonymously accessible. The README says you can run on your own CUDA GPU or on Modal, and you'll need Weights & Biases and Hugging Face tokens. Models load in bfloat16, so your GPU needs to support it.
- **The gaps**: Modal credits go only to enrolled students. The autograder, Gradescope, and the Ed thread (the spec directs questions there) are all closed. You'll have to check yourself against the 0.3 / 0.4 / 0.5 thresholds above.
- **The spirit of the honor code**: if you're using this project to learn, the most valuable approach is to follow the spec's constraints. Skip high-level trainers and don't let AI write the three core functions. Those three functions are exactly what the project exists to teach.

## Something to try tonight

Download [default_proj.zip](https://cs224r.stanford.edu/material/default_proj.zip) and read just two files: `evaluation/countdown.py` and `sft_trainer/sft_dataset.py`. The first shows how the reward is computed; the second shows how prompt and response are split. Then write one sentence: which tokens does your SFT loss mask need to exclude? It's the easiest step to get wrong across all three stages, and the first one you need right.

## Further reading

- [CS336: RLVR](/posts/ai/2026-08-22-cs336-rlvr-en): engineering details of RL with verifiable rewards
- [CS336: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en): another take on SFT and preference optimization
- [CME295: Preference tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en): an overview of the DPO family

**Series**: previous [L10: RL for LLM reasoning and test-time compute](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning-en) | next [L11: Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R course home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [CS224R Default Project Guidelines (2026)](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)
- [CS224R Default Project starter code, default_proj.zip](https://cs224r.stanford.edu/material/default_proj.zip)
- [CS224R Custom Project Guidelines (2026)](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [Qwen2.5-0.5B (Hugging Face)](https://huggingface.co/Qwen/Qwen2.5-0.5B)
- [Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036)
- [Ahmadian et al. 2024, Back to Basics: Revisiting REINFORCE Style Optimization for Learning from Human Feedback in LLMs](https://arxiv.org/abs/2402.14740)
- [Rafailov et al. 2023, Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [TinyZero (GitHub)](https://github.com/Jiayi-Pan/TinyZero)
