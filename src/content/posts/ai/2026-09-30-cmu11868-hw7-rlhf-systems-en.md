---
title: "CMU 11-868 RLHF Systems and Assignment 7: A VERL-Style Pipeline with a Reward Model, GAE, and PPO"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, rlhf, reinforcement-learning, homework]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 22
tldr: "11-868's RL systems lecture has no slides; the Syllabus lists just one paper, ReaLHF. Assignment 7, on the other hand, is fully public. You train a DistilBERT reward model on Anthropic's HH-RLHF data (40 points), fill in GAE, the PPO loss, and entropy in a VERL-style trainer to fine-tune GPT-2 (40 points), and compare reward distributions before and after RLHF (20 points). The starter trainer never imports the verl package. What you learn is the RLHF dataflow, not VERL's distributed engine."
description: "A guide to the RLHF unit of CMU 11-868 LLM Systems (Spring 2026): the 4/15 lecture 'Efficient Reinforcement Learning System for LLMs' with only a ReaLHF reading, what ReaLHF and HybridFlow (VERL) each solve, Assignment 7's three problems and points, the four functions in the starter code, the grading criteria, the 4/20 deadline, and where self-learners get stuck. No solutions."
draft: false
glossary:
  - term: "reward model"
    aliases: ["RM"]
    definition: "A model trained on human preference data (a chosen and a rejected answer to the same prompt) that takes a response and outputs a score, used as the feedback signal during RL."
    context: "Problem 1 of Assignment 7 uses DistilBERT as the backbone and asks you to implement the ranking loss and reach at least 60% validation accuracy."
  - term: "GAE"
    aliases: ["generalized advantage estimation"]
    definition: "A way to estimate advantages as an exponentially weighted sum of TD errors, with γ and λ trading off bias against variance."
    context: "_compute_gae in the Assignment 7 starter code is the first function Problem 2 asks for; ppo_gae_lambda defaults to 0.95."
  - term: "HybridFlow"
    aliases: ["verl", "VERL"]
    definition: "An RLHF framework paper that models RLHF as a dataflow, combines single-controller and multi-controller execution, and uses a 3D-HybridEngine to reshard the actor model between training and generation. Its open-source implementation is verl."
    context: "The Assignment 7 page lists the HybridFlow paper and the VERL docs as essential reading."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). Lecture details come from the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus). The assignment page lives on the [homework site](https://llmsystem.github.io/llmsystemhomework/assignment_7/), shared across terms, and the starter code is in [llmsys_hw7](https://github.com/llmsystem/llmsys_hw7), both as seen on 2026-09-30. The repo's last commit is 2026-05-02, and Fall 2026 hasn't changed it yet. Access grade: the assignment is **A3**, with the problems, starter code, tests, and grading criteria all public. The RL lecture itself is only **A1**: no slides or public video links listed in the official syllabus, just one paper.

**Series**: previous [L26–L30 serving at scale: prefill/decode disaggregation, KV cache, and heterogeneous hardware](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en) | this is the last post in the series | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The course description lists "efficient implementation of RLHF," and this lecture plus Assignment 7 is where it lands. The two are public to very different degrees. The lecture has a title and one reading. The assignment has a full write-up, starter code, and grading criteria. This post covers what you can read for the lecture, then what the assignment asks of you.

**No solutions here.** I also don't derive the RLHF algorithms themselves (PPO, reward model theory); links to other courses are at the end.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The 4/15 lecture: a title and one paper

The 4/15 entry on the Syllabus is "Efficient Reinforcement Learning System for LLMs." That row has no `[slides]` link, and deck number 25 is missing from the file sequence, between the 4/13 vLLM deck (L24) and the 4/20 Dynamo deck (L26). The Fall 2026 [Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) puts it on 11/23, again without slides.

The only material is the reading, the [ReaLHF paper](https://arxiv.org/abs/2406.14088) by Mei et al. (the paper calls the system ReaL). So what follows sticks to what the abstract supports.

**The problem**: supervised training has one model doing one kind of work. One round of RLHF involves several LLM instances. The actor, critic, reward, and reference models each generate, run inference, or train, and they depend on one another. Reusing the fixed parallelism of supervised training for all of this is inefficient.

**The approach**: redistribute parameters during training so each workload gets its own parallelism. The paper calls this parameter reallocation. A search algorithm with a lightweight runtime estimator finds an "execution plan" that says which GPUs each workload uses and how it's parallelized. The runtime engine then moves parameters according to the plan.

**The result**: the abstract reports up to 3.58x speedup over baselines on LLaMA models up to 70B parameters and 128 GPUs.

It's worth reading this against the previous post. Prefill and decode were split because they behave differently. Generation and training inside RLHF also behave differently, and ReaLHF's answer is to switch the same parameters between two parallel layouts.

## The assigned papers: HybridFlow and VERL

The first two essential readings on the Assignment 7 page are the [VERL docs](https://verl.readthedocs.io/en/latest/) and the [HybridFlow paper](https://arxiv.org/abs/2409.19256). VERL is HybridFlow's open-source implementation; the assignment page expands the name as "Volcano Engine Reinforcement Learning."

The HybridFlow abstract makes its case in three steps:

1. Classic RL can be drawn as a dataflow: nodes are neural-network computations, edges are data dependencies. RLHF turns every node into a distributed LLM training or generation program and every edge into many-to-many data transfer.
2. A single controller that directs all computation and communication has too much dispatch overhead. Existing RLHF systems use multiple controllers instead, but that nests computation inside communication and makes algorithms awkward to change.
3. HybridFlow mixes the two. Hierarchical APIs wrap computation and data dependencies so algorithms are easy to write and device mappings easy to change. A 3D-HybridEngine reshards the actor model between the training and generation phases with no redundant memory.

The abstract reports 1.53–20.57x higher throughput. The VERL docs currently list algorithms such as PPO, GRPO, and DAPO, and rollout backends such as SGLang and TensorRT-LLM. One page covers offloading rollout KV cache through Mooncake Store, which ties straight back to Mooncake in the [previous post](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en).

## What Assignment 7 asks you to do

The assignment is titled "Introduction to RLHF." The task is to build a "VERL-like" framework and use RLHF to fine-tune a small model toward more helpful, more harmless answers. The data is [Anthropic/hh-rlhf](https://huggingface.co/datasets/Anthropic/hh-rlhf) on Hugging Face, and the example data-prep command takes 10,000 samples.

| Problem | Task | Points | File |
|---|---|---|---|
| 1 | Implement the reward model's ranking loss and train on preference data | 40 | `src/reward_model.py` |
| 2 | Complete `VERLTrainer` and run RLHF training | 40 | `src/rlhf_trainer.py` |
| 3 | Evaluate and analyze the model before and after RLHF | 20 | run `scripts/evaluate.py` |

The starter code marks what you need to fill in with `BEGIN ASSIGN7_*` / `END ASSIGN7_*`. There are four spots:

- `compute_loss`: the reward model's ranking loss (Problem 1)
- `_compute_gae`: advantages via GAE (Problem 2.1)
- the PPO loss inside `_train_step_custom` (Problem 2.2)
- `_compute_entropy`: entropy from logits (Problem 2.3)

The defaults in `src/config.py` tell you the scale. The policy is `gpt2`, the reward model is `distilbert-base-uncased`, PPO clip is 0.2, GAE λ is 0.95, and every batch size is in single digits.

### Grading criteria

The page ends with three rules:

1. **Problem 1**: pass pytest and reach at least 60% validation accuracy on the reward model.
2. **Problem 2**: show a reasonable reward increase in `rlhf_training_curves.png`. The page's example is from -0.5 to +0.5.
3. **Problem 3**: show clearly different reward distributions before and after RLHF in `reward_comparison.png`, and upload checkpoints of the best reward model and best RLHF model so TAs can reproduce the evaluation.

Problem 3 also carries a warning. You may see gibberish generations getting high rewards. The page says this is expected: the reward model is a neural network, and the policy learns to exploit its loopholes. That's reward hacking, and seeing it in your own run teaches more than reading about it.

## What "VERL-like" actually means

This is the easiest thing to misread in the starter code. `requirements.txt` lists `verl>=0.1.0`, and the classes are named `VERLPolicyWrapper`, `VERLValueWrapper`, and `VERLTrainer`. But `src/rlhf_trainer.py` imports only PyTorch and transformers. It never imports verl.

So Assignment 7 trains you on the RLHF **dataflow**: generate rollouts, score them with the reward model, compute advantages, update with PPO. It doesn't touch the distributed problems HybridFlow actually solves, such as coordinating multiple controllers or resharding the model between training and generation. For that layer, read VERL's source and docs.

Seen across the whole course, this makes sense. In HW5 you wrote data and pipeline parallelism yourself. In HW6 you used DeepSpeed and SGLang. HW7 shrinks the scale to GPT-2 so you can focus on the RLHF pipeline itself.

## Timeline and versions

- **Deadline**: the Syllabus puts "HW7 Due" on the 4/20 row (11/30 in Fall 2026). It doesn't list a release date.
- **Order relative to the lecture**: the RL systems lecture is on 4/15, five days before the deadline. In practice you start the assignment before the lecture, and the algorithm background comes from the assignment's readings.
- **Repo history**: commits in December 2025 fixed the GAE reward shift and added a KL penalty and the grading criteria. On 2026-03-18 a commit fixed the KL approximation and prompt/response alignment in evaluation. On 2026-05-02 a pull request was merged.
- **README vs. assignment page**: the repo README's header says "Spring 2025," and its clone command uses `llmsys_f25_hw7`, which GitHub redirects to `llmsys_hw7`. The assignment page clones `llmsys_hw7` directly. Go with the assignment page.
- **Required or optional**: Logistics says only that 2 of the 7 assignments are optional, not which ones. The official pages don't say whether HW7 is required.

## Where self-learners get stuck

- **Hardware**: the page states no hardware requirements. GPT-2 and DistilBERT are far lighter than HW5 and HW6, but there are no official numbers for training time or GPU memory.
- **Grading**: the only public pytest file is `tests/test_reward_model.py`, which covers Problem 1. Problems 2 and 3 are judged by TAs from plots and checkpoints. Off campus, nobody checks them, so grade yourself against the three criteria on the page.
- **Submission**: the page asks for `assignment7_[your_andrew_id].zip`. Self-learners have no way to submit and no private tests.
- **Data**: you need to download HH-RLHF from Hugging Face. `requirements.txt` also lists wandb and tensorboard; one of them is enough.

## How to study it

1. Read the [RLHF primer](https://huggingface.co/blog/rlhf) the page links, until you can explain how chosen/rejected pairs, the reward model, and PPO fit together.
2. Do Problem 1: get pytest passing and push validation accuracy past 60%.
3. Before Problem 2, read how `generate_rollouts` in `rlhf_trainer.py` builds a `RolloutBatch`. Then fill in GAE, the PPO loss, and entropy.
4. After Problem 3, look at a few high-reward generations and find a reward-hacking example.
5. If you have time, read the first architecture figure in [HybridFlow](https://arxiv.org/abs/2409.19256). Compare it with the single-machine trainer you just wrote and list which steps would become bottlenecks at scale.

One thing to do tonight: clone [llmsys_hw7](https://github.com/llmsystem/llmsys_hw7), open `src/config.py`, and match each PPO parameter to the PPO formula you know. The ones you can't place are tomorrow's reading.

## Where to learn the algorithms

This course treats RLHF as a systems problem. Guides to other courses on this site cover the algorithms more fully:

- [Stanford CS336: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en): SFT, preference data, reward models, PPO and DPO, and how RLHF fails
- [Stanford CS336: RLVR](/posts/ai/2026-08-22-cs336-rlvr-en): from PPO to GRPO and verifiable rewards, including the cost of rollout systems
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en): policy gradient, DQN, SAC, and the rest of the policy-based and value-based toolkit
- [Berkeley CS285 series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — the 4/15 topic, the ReaLHF reading, the HW7 due row
- [CMU 11-868 Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) — fall schedule for comparison
- [CMU 11-868 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — five required and two optional assignments
- [Assignment 7: Introduction to RLHF](https://llmsystem.github.io/llmsystemhomework/assignment_7/) — the three problems, points, data, grading criteria
- [llmsys_hw7 GitHub repo](https://github.com/llmsystem/llmsys_hw7) — starter code, `src/config.py` defaults, commit history
- [Mei et al., ReaL: Efficient RLHF Training of Large Language Models with Parameter Reallocation (arXiv 2406.14088)](https://arxiv.org/abs/2406.14088)
- [Sheng et al., HybridFlow: A Flexible and Efficient RLHF Framework (arXiv 2409.19256)](https://arxiv.org/abs/2409.19256)
- [verl documentation](https://verl.readthedocs.io/en/latest/)
- [Anthropic/hh-rlhf dataset](https://huggingface.co/datasets/Anthropic/hh-rlhf)
- [Illustrating RLHF (Hugging Face blog)](https://huggingface.co/blog/rlhf) — the RLHF primer the assignment links
