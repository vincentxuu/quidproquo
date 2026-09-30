---
title: "Hung-yi Lee ML 2026 HW7: Merging a Japanese Model and a Math Model, With No Training, Into One That Solves Japanese Math Problems"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, model-merging, llm, fine-tuning]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 16
tldr: "HW7 hands you two models fine-tuned from Mistral-7B-v0.1: shisa-gamma-7b-v1, strong in Japanese, and WizardMath-7B-V1.1, strong in math. You may only merge them at the parameter level (no further training, no MoE or ensembles), and the merged model has to answer 20 Japanese math questions written by a TA. Part 1 (60%) is tuning the method, weights, and density in mergekit, with simple and strong baselines at 50% and 75% accuracy. Part 2 (40%) is 8 multiple-choice paper questions. The spec, Colab, and Kaggle notebook are public, but JudgeBoi returned 502 on 2026-09-30 and the paper questions live on NTU COOL, so outside readers can only check accuracy inside the notebook."
description: "Guide to HW7 \"Model Merging\" in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw7.pdf, the assignment Colab, and the course page: the two 7B source models, 20 Japanese math questions that need cultural knowledge and the answer-extraction rule, task vectors, mergekit weights and density, linear / slerp / magnitude prune / DARE / TIES / SCE compared, the Colab default config and prohibitions, grading and submission, and how outside readers can check their own work."
draft: false
glossary:
  - term: "Task vector"
    aliases: []
    definition: "The fine-tuned model's parameters minus the base model's parameters, representing what fine-tuning added. Most merging algorithms operate on these differences."
    context: "Both HW7 models are fine-tuned from Mistral-7B-v0.1, so each has a task vector that can be merged."
  - term: "Density"
    aliases: []
    definition: "A mergekit parameter: the fraction of values kept in a tensor; the rest are pruned or zeroed."
    context: "Magnitude prune, DARE, TIES, and SCE all take a density; linear and slerp don't."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging)

**This post covers HW7 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 16 of the series [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en). Official materials: the slides [hw7.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw7.pdf), the [assignment Colab](https://colab.research.google.com/drive/1B9692EHFAZFh5-8Q5LsVhzk9nTH1MEyD) (50 cells), a [Kaggle version](https://www.kaggle.com/code/sylora1101/ml2026hw7), and the TA's [walkthrough video](https://youtu.be/YQtwk_L686I). The course page lists it as released 5/8 and due 2026/05/28 23:59, with TAs 黃郁涵, 陳思齊, 董家愷, and 吳岳霖 (the slide cover lists the first three). The slides note it is adapted from ML2025 HW9 Model Merging.

Access rating: **A3 minus grading**. The spec, both models, the Colab, and the evaluation code are public. The leaderboard requires uploading to [JudgeBoi](https://ml.ee.ntu.edu.tw/home), which returned 502 on 2026-09-30, and the paper questions are on NTU COOL, which needs an NTU account.

## Prerequisite: hw7.pdf names none, but one lecture fits

The HW7 slides list no prerequisite video, and this term has no lecture on model merging. Lee's 2025 [Intro to Generative AI and ML, Lecture 8](https://www.youtube.com/watch?v=EnWz5XuOnIQ) (in Mandarin) is literally titled "Lifelong learning for general models (Fine-tuning, Model Editing, Model Merging, Test-Time Training)," and the [previous post, Self-Improving AI (Part 1)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en), also points to it for TTT. It is the quickest way to pick up the concepts.

It helps to read HW7 next to [HW6: Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en). HW6 surgically changes one fact. HW7 stacks two whole sets of skills. Neither retrains the model.

## The task: two 7B models, one knows Japanese, one knows math

The slides state the goal plainly: merge models with different capabilities at the parameter level, **without extra training**, to get one model that keeps both Japanese understanding and math ability. The two sources:

| Model | Strength |
|---|---|
| [augmxnt/shisa-gamma-7b-v1](https://huggingface.co/augmxnt/shisa-gamma-7b-v1) | Japanese understanding |
| [WizardLMTeam/WizardMath-7B-V1.1](https://huggingface.co/WizardLMTeam/WizardMath-7B-V1.1) | Mathematical reasoning |

Both are fine-tuned from Mistral-7B-v0.1. The pairing comes from [Evolutionary Optimization of Model Merging Recipes](https://arxiv.org/abs/2403.13187) (Akiba et al., Nature Machine Intelligence 2025), which the slides cite as the source for this assignment.

The Colab opens with three rules that are stricter than the slides:

- Use only the two models above. No third model.
- Any library or your own algorithm is fine; mergekit is not required.
- **The merged model must have the same total parameter count as a single base model.** MoE, ensembles, stacking, or anything else that adds parameters at inference counts as a violation.

## Evaluation: 20 math questions that need Japanese knowledge

The evaluation set is 20 Japanese math questions written by TA 董家愷. They aren't just math problems translated into Japanese. They also require knowledge of Japanese culture. The slides give two examples:

- Of Japan's prefectures, excluding Tokyo-to, Hokkaido, Kyoto-fu, and Osaka-fu, how many are "ken"?
- Taro was born in Heisei 5, Jiro in Reiwa 2. How many years older is Taro?

That is exactly why merging is needed. The math model may not understand the question or know how to convert Heisei and Reiwa years. The Japanese model understands the question but is weak at arithmetic.

Answers are extracted by rule. First look for a number after "答え:" or "答え："; if there isn't one, take the last number in the output. The Colab fixes a Japanese prompt template ending with an instruction to answer as 『答え: [数値]』, and marks it **must not be modified**, because the assignment tests merging, not prompt engineering. The accuracy the notebook prints is identical to JudgeBoi's.

## Merging algorithms: from weighted averages to selective merges

The slides define model merging as combining source models' capabilities into one model using simple arithmetic on parameters, without training from scratch or touching the original training data. They note that redundant parameters and sign conflicts between task vectors cause **parameter interference**, which hurts the merged model. Most of the algorithms below exist to deal with that.

mergekit has three common settings:

- **input models / base model**: the models to merge, plus a base model used as the reference point when needed
- **weights (α)**: the coefficient for each model's contribution
- **density (d)**: the fraction of values kept in a tensor

The methods the slides cover:

| Method | Parameters | What it does |
|---|---|---|
| Task Arithmetic / linear | weights | Weighted sum of task vectors; with two models it's (1−t)A + tB |
| Slerp | weights | Spherical linear interpolation between two models' weights |
| Magnitude Prune | density, weights | Keep the top-d fraction of each task vector by magnitude, then take a weighted sum |
| [DARE](https://arxiv.org/abs/2311.03099) Linear | density, weights | Randomly zero a 1−d fraction, rescale the rest by 1/d to keep the expected value, then take a weighted sum |
| [TIES](https://arxiv.org/abs/2306.01708) | density, weights | Trim to the top-d fraction, Elect Sign per parameter by summing, then Disjoint Merge averages only values with the majority sign |
| [SCE](https://arxiv.org/abs/2408.07990) | density | Select the top-k positions by variance across task vectors, Calculate each model's coefficient from sums of squares, Erase values pointing in the minority direction |

SCE and TIES are easy to confuse. TIES prunes **each task vector on its own** by magnitude. SCE looks at the variance **across all task vectors** at each position. TIES comes from TIES-Merging (NeurIPS 2023), and SCE from [FuseChat](https://arxiv.org/abs/2408.07990).

## The Colab: flow and what you can change

The notebook has three sections:

1. **Section 1: explore the base models.** Each model gets one Japanese prompt and one English math problem, then runs the 20-question evaluation to record a baseline. You can skip this if you're short on time.
2. **Section 2: merge.** The main area you edit is a mergekit YAML block. The text calls it "the simplest 50/50 linear merge," but the default in the code is actually **slerp**, with layer-varying `t` values for `self_attn` and `mlp`, 0.5 elsewhere, and shisa as the base. The TODO suggests changing the weight ratio, switching to linear / ties / dare_ties, or using different parameters per layer. It then runs `mergekit-yaml … --lazy-unpickle --allow-crimes --cuda`.
3. **Section 3: inference.** It loads the merged model, runs the 20 questions with the same prompt and extraction rule, and writes `submission.json`.

The slides estimate 0.5–2 hours to merge and 1–2 hours to run inference on the 20 questions. The Colab assumes a T4 GPU. Every config you try means rerunning Sections 2 and 3, so pick configs deliberately instead of trying things at random.

## Grading and submission

| Item | Condition | Points |
|---|---|---|
| Public Simple Baseline | Japanese math QA accuracy ≥ 50% | 2 |
| Public Strong Baseline | Accuracy ≥ 75% | 2 |
| Code Submission | Uploaded to NTU COOL | 2 |
| Paper Reading | 8 questions, 0.5 each | 4 |

- **Part 1 (60%)**: upload `submission.json` to JudgeBoi (.json only, don't change the format, 5 submissions a day, reset at 23:59). Zip your `.ipynb` as `<student-id>_hw7.zip` and upload it to NTU COOL. Your leaderboard score must be reproducible from the notebook you submit or it won't count, so fix the random seed.
- **Part 2 (40%)**: multiple-choice questions on NTU COOL. The slides say 5 cover basic model merging concepts and 3 cover the ICLR 2026 paper [LS-Merge: Merging Language Models in Latent Space](https://openreview.net/pdf?id=VSDV0SWwOC).
- Rules: no closed-source LLM APIs such as GPT-4 or Gemini; no extra training data or searching for test answers; no hand-editing inputs or prediction files. No late submissions.

## What outside readers can't get

- **JudgeBoi 502**: you can't upload or see the leaderboard. But the notebook prints the same accuracy JudgeBoi would, so you can fully self-grade Part 1.
- **Paper questions**: they are only on NTU COOL and are not printed in hw7.pdf (unlike HW6 and HW8).
- **Walkthrough video**: it has no captions on YouTube, so this post does not draw on the video.

**Something you can do tonight**: open the Colab and, without changing anything, run the default slerp config and note the accuracy. Then set `merge_method` to `ties`, pick some weights and a density, and compare which questions changed. Free Colab doesn't guarantee a GPU, as the notebook itself warns.

## Going deeper

- **Papers**: read [Editing Models with Task Arithmetic](https://arxiv.org/abs/2212.04089) for the task-vector idea, then [TIES-Merging](https://arxiv.org/abs/2306.01708) for how interference is handled. To see how this particular model pair was found, read [Evolutionary Optimization of Model Merging Recipes](https://arxiv.org/abs/2403.13187).
- **Tools**: the [mergekit](https://github.com/arcee-ai/mergekit) README lists every merge method and its parameters. Hugging Face PEFT also has a [model merging guide](https://huggingface.co/docs/peft/developer_guides/model_merging).

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Self-Improving AI (Part 1)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) | Next: [HW8: Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en)

## References

- [Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW7 release date, deadline, TAs (in Mandarin)
- [ML2026 HW7 Model Merging (hw7.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw7.pdf) — task, evaluation, algorithms, grading, rules
- [HW7 Colab](https://colab.research.google.com/drive/1B9692EHFAZFh5-8Q5LsVhzk9nTH1MEyD) — model restrictions, prompt template, default mergekit config (notes in Mandarin)
- [HW7 Kaggle version](https://www.kaggle.com/code/sylora1101/ml2026hw7)
- [HW7 walkthrough video (YouTube)](https://youtu.be/YQtwk_L686I)
- [JudgeBoi](https://ml.ee.ntu.edu.tw/home) (returned 502 on 2026-09-30)
- [2025 Intro to Generative AI and ML, Lecture 8: lifelong learning for general models](https://www.youtube.com/watch?v=EnWz5XuOnIQ) (in Mandarin)
- [augmxnt/shisa-gamma-7b-v1 (Hugging Face)](https://huggingface.co/augmxnt/shisa-gamma-7b-v1)
- [WizardLMTeam/WizardMath-7B-V1.1 (Hugging Face)](https://huggingface.co/WizardLMTeam/WizardMath-7B-V1.1)
- [Evolutionary Optimization of Model Merging Recipes (arXiv 2403.13187)](https://arxiv.org/abs/2403.13187)
- [Editing Models with Task Arithmetic (arXiv 2212.04089)](https://arxiv.org/abs/2212.04089)
- [Language Models are Super Mario (DARE, arXiv 2311.03099)](https://arxiv.org/abs/2311.03099)
- [TIES-Merging: Resolving Interference When Merging Models (arXiv 2306.01708)](https://arxiv.org/abs/2306.01708)
- [FuseChat: Knowledge Fusion of Chat Models (SCE, arXiv 2408.07990)](https://arxiv.org/abs/2408.07990)
- [LS-Merge: Merging Language Models in Latent Space (OpenReview)](https://openreview.net/pdf?id=VSDV0SWwOC)
- [arcee-ai/mergekit (GitHub)](https://github.com/arcee-ai/mergekit)
- [Hugging Face PEFT: Model merging](https://huggingface.co/docs/peft/developer_guides/model_merging)
