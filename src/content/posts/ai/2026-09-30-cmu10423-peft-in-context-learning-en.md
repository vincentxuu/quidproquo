---
title: "PEFT and ICL: Change Parameters or Change the Input | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, peft, lora, fine-tuning, in-context-learning, prompt-engineering]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 37
tldr: "Adapting without retraining every weight can mean two different things. LoRA-style PEFT still trains some parameters. ICL supplies examples in context without updating parameters during that inference. The source spans the end of Lecture 9, Lecture 10, and the ICL material in Lecture 11."
description: "Adapting without retraining every weight can mean two different things. LoRA-style PEFT still trains some parameters. ICL supplies examples in context without updating parameters during that inference. The source spans the end of Lecture 9, Lecture 10, and the ICL material in Lecture 11."
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter efficient fine-tuning"]
    definition: "Fine-tuning only a small subset of a model's parameters (or a small number of added ones) while the pretrained weights stay frozen, aiming to match full fine-tuning."
    context: "CMU 10-423 L10 covers four approaches: tuning only the top K layers, adapters, prefix tuning, and LoRA."
  - term: "prefix tuning"
    definition: "Pretends a sequence of prefix tokens comes before the real tokens and trains only those prefixes' key/value vectors in each layer, with all Transformer parameters frozen."
    context: "The third PEFT method in L10; the slides note the prefix parameters are produced by a lower-dimensional MLP for training stability."
    links:
      - label: "Li & Liang 2021"
        url: "https://arxiv.org/abs/2101.00190"
  - term: "in-context learning"
    aliases: ["ICL"]
    definition: "Putting a task description and a few input/output examples directly in the prompt, without updating any parameters, so the LLM infers the pattern and answers during generation."
    context: "L10 and L11 treat it as the alternative to supervised fine-tuning and compare the two."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Adapting without retraining every weight can mean two different things. LoRA-style PEFT still trains some parameters. ICL supplies examples in context without updating parameters during that inference. The source spans the end of Lecture 9, Lecture 10, and the ICL material in Lecture 11.

## Choose a lesson

- [Parameter-efficient adaptation](/posts/ai/2026-10-11-cmu10423-peft-en): work through its mechanism, example, and answer criteria.
- [ICL, prompting, SFT, and RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: classify a phrase as positive or negative. ICL puts labeled examples in the prompt, consuming context while leaving model weights unchanged. LoRA propagates training error into an adapter, so later requests need not repeat those examples. For a toy 4×4 weight matrix, rank-one A has shape 1×4 and B has shape 4×1: eight adapter parameters rather than sixteen full-update parameters. This is a calculation for that matrix, not a universal model-wide savings ratio.

## Check your understanding

Does persistent behavior without repeating examples prove LoRA was used?

<details>
<summary>Answer and criterion</summary>

No. Existing capability, a system prompt, memory, or another training method could explain it. Inspect parameter updates and request context rather than inferring the mechanism from output alone.

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
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L9–L11 dates, Quiz 2 and Quiz 3
- [Lecture 9 slides: VAEs / In-context learning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf): zero-shot, few-shot, prompting
- [Lecture 10 slides: Parameter Efficient Fine-Tuning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf)
- [Lecture 11 slides: In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf): Quiz 3 scope on the Reminders slide
- [HW3 handout (hw3.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip): point breakdown and question structure
- [Practice Exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Hu et al. 2021: LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Houlsby et al. 2019: Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Li & Liang 2021: Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Li et al. 2018: Measuring the Intrinsic Dimension of Objective Landscapes](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al. 2020: Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning](https://arxiv.org/abs/2012.13255)
- [Mosbach et al. 2023 (ACL Findings): Few-shot Fine-tuning vs. In-context Learning](https://aclanthology.org/2023.findings-acl.779.pdf)
- [Anyscale blog: comparing LoRA and full-parameter fine-tuning on Llama-2](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2)
- [Brown et al. 2020: Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165)
- [Lu et al. 2021: Fantastically Ordered Prompts and Where to Find Them](https://arxiv.org/abs/2104.08786)
- [Min et al. 2022: Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837)
- [Wei et al. 2022: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022: Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
