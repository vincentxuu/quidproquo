---
title: "SFT, RLHF, and DPO: Separate Their Training Signals | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, instruction-tuning, rlhf, dpo, post-training, alignment]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 38
tldr: "A prompt with one demonstrated answer is not the same data as a prompt with a preferred and rejected response. SFT learns demonstrated tokens. A typical RLHF pipeline learns reward and then updates a constrained policy. DPO forms a loss directly from preference pairs and reference-relative ratios."
description: "A prompt with one demonstrated answer is not the same data as a prompt with a preferred and rejected response. SFT learns demonstrated tokens. A typical RLHF pipeline learns reward and then updates a constrained policy. DPO forms a loss directly from preference pairs and reference-relative ratios."
draft: false
glossary:
  - term: "instruction fine-tuning"
    aliases: ["instruction tuning", "chat fine-tuning"]
    definition: "Supervised fine-tuning of a pretrained model on a dataset of instruction/prompt → ideal response pairs, turning a text-completer into an assistant that follows instructions and knows when to stop."
    context: "CMU 10-423 L11 lists its other names: chat fine-tuning, alignment, behavioral fine-tuning."
  - term: "DPO"
    aliases: ["Direct Preference Optimization"]
    definition: "Fine-tunes a language model directly on preference data (a better and a worse response to the same prompt) without training a separate reward model or running RL: its objective increases the preferred response's reference-relative log-ratio relative to the rejected response's. Shared parameters and updates over multiple examples do not guarantee monotonic changes in every response or token's absolute probability."
    context: "L12 derives it from the Bradley–Terry preference model and the KL-constrained RLHF objective; HW3 section 4 walks you through the derivation."
    links:
      - label: "Rafailov et al. 2023"
        url: "https://arxiv.org/abs/2305.18290"
  - term: "Bradley–Terry model"
    aliases: ["Bradley-Terry"]
    definition: "A probability model for pairwise comparisons: item i beats item j with probability exp(r_i) / (exp(r_i) + exp(r_j)). It is equivalent to logistic regression on the score difference r_i − r_j, and only relative scores matter."
    context: "Both the RLHF reward model and DPO use it to model human preferences."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

A prompt with one demonstrated answer is not the same data as a prompt with a preferred and rejected response. SFT learns demonstrated tokens. A typical RLHF pipeline learns reward and then updates a constrained policy. DPO forms a loss directly from preference pairs and reference-relative ratios.

## Choose a lesson

- [SFT and RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en): work through its mechanism, example, and answer criteria.
- [DPO preference objective](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching DPO example: the preferred response has policy probability 0.4 and reference probability 0.2; the rejected response has 0.2 under both. The difference between reference-relative log ratios is log(2). With beta=1, sigmoid(log2)=2/3 and negative-log preference loss is approximately 0.405. That does not mean answer accuracy is 2/3: it is the objective value for this pair. SFT on the demonstrated preferred response does not use these two reference-relative ratios.

## Check your understanding

What is the loss if policy and reference match on both responses?

<details>
<summary>Answer and criterion</summary>

The difference is zero, sigmoid is 0.5, and loss is log2, approximately 0.693. This is a neutral objective value for one pair, not a claim about all evaluation tasks.

</details>

## How to use this map

Before reading the answer, identify the inputs, what changes, and the outputs. Then complete the linked lesson’s variation. If two mechanisms seem identical, trace where their conditions or data paths diverge. This page checks relationships and boundaries; it does not replace the derivations, implementations, or evaluations in the individual lessons.

The source edition is Spring 2026. Teaching examples are not official assessments or reconstructed classroom speech. Recordings remain subject to course authorization.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## Update Log

- 2026-10-11: Rebuilt the teaching scope, worked example, and self-check; retained the original URL and publication date.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L11 and L12 dates, Quiz 3
- [Lecture 11 slides: In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 slides: DPO / Latent Diffusion Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img-ink.pdf))
- [HW3 handout (hw3.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip): structure and points of the DPO section
- [Practice Exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Ouyang et al. 2022: Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [Bai et al. 2022: Training a Helpful and Harmless Assistant with RLHF](https://arxiv.org/abs/2204.05862)
- [Rafailov et al. 2023: Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Williams 1992: Simple statistical gradient-following algorithms for connectionist reinforcement learning](https://link.springer.com/article/10.1007/BF00992696)
- [Wei et al. 2021: Finetuned Language Models Are Zero-Shot Learners (Flan)](https://arxiv.org/abs/2109.01652)
- [Longpre et al. 2023: The Flan Collection](https://arxiv.org/abs/2301.13688): the instruction-dataset comparison figure in the slides
- [Xu et al. 2023: MultiInstruct](https://arxiv.org/abs/2212.10773)
- [databricks/databricks-dolly-15k](https://huggingface.co/datasets/databricks/databricks-dolly-15k)
