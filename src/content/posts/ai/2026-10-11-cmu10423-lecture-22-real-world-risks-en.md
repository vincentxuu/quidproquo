---
title: "Generative AI Risks: Turning Failures into Tests | CMU 10-423 Lecture 22"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 27
description: "Generative AI Risks: Turning Failures into Tests | CMU 10-423 Lecture 22"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 22 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

A document assistant can answer 90% of questions correctly and still expose another user's records through one attack. Average task accuracy and deployment harm differ. Lecture 22 covers memorization, bias, attacks, hallucination, and environmental costs. We turn them into separate observable failures.

Start with [preference training](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en). For each risk, identify affected people, triggering inputs or states, the harmful path, and a control point. Formal alignment is covered separately.

## Four paths in one assistant

Consider a teaching assistant retrieving refund policies and a user's own orders. Unsupported refund claims are factual failures. Disproportionate refusals for one language are service-quality disparities. Executing an external PDF's instruction to read everyone's orders is an authorization failure through untrusted content. Reproducing private training data raises memorization and disclosure concerns.

These need different controls. Retrieval and citations enable checking but do not prove support. Group-specific evaluation reveals disparities hidden by averages. Application-level authorization must check users and resources; documents cannot grant permissions. Training-data governance and sensitive-data protection address another layer.

## Accuracy, abstention, and coverage

In an illustrative20-question set,12 questions have answers in the documents and eight lack necessary information. The model gets10 of 12 known-answer questions right and two wrong. It guesses on six unknown questions and abstains on two. Answering18/20 looks helpful, but eight responses fail the intended evidence-based behavior.

Known-answer accuracy is 10/12; appropriate abstention on missing-information cases is 2/8. Suppose an evidence check blocks all six guesses and one known-answer error, but also blocks two correct answers. Coverage falls from 18/20 to 9/20, with eight correct and one wrong answer: answered-question accuracy 8/9. These are invented results, not a guarantee about RAG.

Higher selective accuracy can come from more abstention, so report coverage too. Confidence needs calibration against observed correctness, including distribution shifts. An attack can elicit a confident failure.

## Follow the attack path

Direct malicious prompts come from users; indirect prompt injection can enter through documents, pages, or tool responses. Harm may involve exfiltration or unauthorized changes rather than merely inappropriate text. Treat retrieved content as untrusted, constrain tool scopes, validate arguments, and enforce identity/resource checks. Test the full path with adversarial content, not just the presence of a defensive prompt.

If three of ten attacks access another user's orders, attack success is 30%. After resource authorization, zero of ten succeed. Also verify legitimate access to one's own orders. Zero observed successes does not prove a universal zero rate; languages, long documents, and multi-step tool chains may expose new paths.

## Separate memorization and environmental costs

Training-data extraction studies demonstrate that models can reproduce memorized material. Reproduction, licensing, and infringement judgments have different conditions; classroom discussion is not a jurisdiction-independent statement of current law. Technical tests can assess extractability, similarity, and effects of deduplication.

For an illustrative service with 1000 requests/day at .002kWh each, energy is 2kWh. An assumed emissions factor of .4kgCO₂e/kWh gives .8kgCO₂e. This excludes training, hardware manufacture, and other infrastructure costs. Doubling requests gives 4kWh and 1.6kgCO₂e under unchanged assumptions. Changed hardware or output lengths require revisiting per-request energy.

Does refusing every unknown question eliminate risk? No: known-answer errors, tool authorization, group disparities, and disclosure remain. Pair each control with its own metric, legitimate-function test, and residual-risk account.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en)
- [Next](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 22 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture22-practical-considerations.pdf)
- [Extracting Training Data from Large Language Models](https://arxiv.org/abs/2012.07805)
- [Universal Adversarial Attacks](https://arxiv.org/abs/2307.15043)
