---
title: "Operational Risks and Alignment Theory: Tests and Assumptions | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, ai-safety, alignment, hallucination, adversarial-attack, copyright]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 44
tldr: "Hallucination, leakage, and prompt injection are observable operational risks. Alignment theory asks which guarantees hold under specific formal assumptions. They require different evidence. Lectures 22 and 26 therefore have separate teaching guides, without turning one theorem into a universal impossibility claim."
description: "Hallucination, leakage, and prompt injection are observable operational risks. Alignment theory asks which guarantees hold under specific formal assumptions. They require different evidence. Lectures 22 and 26 therefore have separate teaching guides, without turning one theorem into a universal impossibility claim."
draft: false
glossary:
  - term: "corrigibility"
    aliases: ["corrigible agent"]
    definition: "The property of an AI agent being willing to be corrected or shut down by humans. CMU 10-423 uses a paraphrase of the Soares et al. (2015) definition with five parts: shut down when asked, do not stop humans from pressing the button, do not press the button yourself, make any sub-agents respect shutdown too, and otherwise pursue the base goal normally."
    context: "The centerpiece of the second half of CMU 10-423 Lecture 26, \"Science of Alignment.\""
    links:
      - label: "Core Safety Values for Provably Corrigible Agents (Nayebi, 2025)"
        url: "https://arxiv.org/abs/2507.20964"
  - term: "GCG"
    aliases: ["Greedy Coordinate Gradient", "adversarial suffix attack"]
    definition: "Append an adversarial suffix to a harmful request, use token-level gradients to find candidate replacements, and greedily keep the best one, so the model most likely begins its answer with an affirmative such as \"Sure, here is\". Optimizing across multiple prompts and models can improve transfer, but success still depends on the target model and defenses and must be measured."
    context: "The main example in the \"Adversarial Attack on LLMs\" section of CMU 10-423 Lecture 22."
    links:
      - label: "Zou et al. 2023: Universal and Transferable Adversarial Attacks on Aligned Language Models"
        url: "https://arxiv.org/abs/2307.15043"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-risks-alignment)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Hallucination, leakage, and prompt injection are observable operational risks. Alignment theory asks which guarantees hold under specific formal assumptions. They require different evidence. Lectures 22 and 26 therefore have separate teaching guides, without turning one theorem into a universal impossibility claim.

## Choose a lesson

- [Operational risks](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en): work through its mechanism, example, and answer criteria.
- [Alignment science](/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment-en): work through its mechanism, example, and answer criteria.
- [Preference training](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: a support agent reads a document containing an instruction to ignore policy and send an invoice. Test whether it treats document text as instructions, has sending privileges, and actually invokes the tool. Blocking ten cases supports a claim about those cases and that configuration. A formal result may concern a function class, prior, or preference structure. It applies only when its assumptions match. Ten successful tests do not refute a worst-case lower bound.

## Check your understanding

Do one hundred additional passing cases justify claiming protection against all prompt injections?

<details>
<summary>Answer and criterion</summary>

No. Describe the tested population, attack coverage, permissions, and residual risk. A finite test set is not a universal proof.

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

- [CMU 10-423/623/723 Generative AI (Spring 2026) home page and Course Description](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (L22 and L26 dates and Quiz 6 coverage)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 22 slides: Real-world Issues and Considerations](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture22-practical-considerations.pdf)
- [Lecture 26 slides (Part II): Towards a Science of AI Alignment](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-alignment.pdf)
- [MIT AI Risk Repository: Domain Taxonomy of AI Risks](https://airisk.mit.edu/)
- [Google: Gemini image generation got it wrong. We'll do better.](https://blog.google/products/gemini/gemini-image-generation-issue/)
- [Henderson et al. 2023: Foundation Models and Fair Use](https://arxiv.org/abs/2303.15715)
- [Karamolegkou et al. 2023: Copyright Violations and Large Language Models (EMNLP)](https://aclanthology.org/2023.emnlp-main.458/)
- [Vyas et al. 2023: On Provable Copyright Protection for Generative Models](https://arxiv.org/abs/2302.10870)
- [Zou et al. 2023: Universal and Transferable Adversarial Attacks on Aligned Language Models](https://arxiv.org/abs/2307.15043)
- [Wei et al. 2023: Jailbroken: How Does LLM Safety Training Fail?](https://arxiv.org/abs/2307.02483)
- [OpenAI 2023: GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
- [Huang et al. 2023: A Survey on Hallucination in Large Language Models](https://arxiv.org/abs/2311.05232)
- [Lewis et al. 2020: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [Gallegos et al. 2023: Bias and Fairness in Large Language Models: A Survey](https://arxiv.org/abs/2309.00770)
- [Kotek et al. 2023: Gender bias and stereotypes in Large Language Models](https://arxiv.org/abs/2308.14921)
- [Touvron et al. 2023: LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971)
- [Dodge et al. 2022: Measuring the Carbon Intensity of AI in Cloud Instances (FAccT)](https://dl.acm.org/doi/10.1145/3531146.3533234)
- [Patterson et al. 2022: The Carbon Footprint of Machine Learning Training Will Plateau, Then Shrink](https://arxiv.org/abs/2204.05149)
- [Tien et al. 2026: ROGUE: Misaligned Agent Behavior Arising from Ordinary Computer Use](https://arxiv.org/abs/2606.00341)
- [Irving, Christiano & Amodei 2018: AI Safety via Debate](https://arxiv.org/abs/1805.00899)
- [Hadfield-Menell et al. 2016: Cooperative Inverse Reinforcement Learning](https://arxiv.org/abs/1606.03137)
- [Hadfield-Menell et al. 2016: The Off-Switch Game](https://arxiv.org/abs/1611.08219)
- [Nayebi 2025: Intrinsic Barriers and Practical Pathways for Human-AI Alignment: An Agreement-Based Complexity Analysis](https://arxiv.org/abs/2502.05934)
- [Nayebi 2025: Core Safety Values for Provably Corrigible Agents](https://arxiv.org/abs/2507.20964)
- [Nayebi 2025: When Do AI Gains Become Broadly Shareable? (cited on the slides under its earlier title, An AI Capability Threshold for Rent-Funded Universal Basic Income in an AI-Automated Economy)](https://arxiv.org/abs/2505.18687)
- [Nayebi 2026: What Capable Agents Must Know: Selection Theorems for Robust Decision-Making under Uncertainty](https://arxiv.org/abs/2603.02491)
