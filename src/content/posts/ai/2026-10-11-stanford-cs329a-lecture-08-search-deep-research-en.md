---
title: "Search and Deep Research: Selecting a Deliverable Answer | Stanford CS329A Lecture 8"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 8
description: "Distinguish candidate search from information retrieval, and work through filtering, clustering, and evidence refinement."
tldr: "Candidate search selects solutions; retrieval fills knowledge gaps. Both require specifications and checkable evidence."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-stanford-cs329a-lecture-08-search-deep-research)

**Video status: Videos included.** Lecture text is available; caption type, listening checks, and the shadowing player still require verification.

[Stanford CS329A](https://cs329a.stanford.edu/), Autumn 2025 Lecture 8, covers two searches: finding an answer among generated programs, and retrieving knowledge needed during reasoning. Candidate search expands possible solutions; document retrieval supplies missing facts. They address different bottlenecks.

This guide uses the official readings, [AlphaCode](https://arxiv.org/html/2203.07814), [AlphaCode 2](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf), and [Search-o1](https://arxiv.org/html/2501.05366), alongside the official video's text transcript. Basic programming knowledge is enough. The goal is to design a candidate selection and checking process, rather than count tool calls as research depth.

For prerequisite context, first read [tool feedback](/posts/ai/2026-10-11-stanford-cs329a-lecture-04-tool-code-feedback-en) and [multi-step planning](/posts/ai/2026-10-11-stanford-cs329a-lecture-05-reasoning-planning-en).

## Search the solution space: generate, filter, cluster

AlphaCode generates many programs, filters them with example tests, then clusters candidates by behavior on additional inputs. This avoids spending limited submissions on similar programs. AlphaCode 2 retains this structure and adds a scoring model to select candidates within clusters. Similar behavior on finite tests does not prove equivalence for every possible input.

Generating a correct answer at least once differs from submitting it. The former concerns coverage; the latter concerns selection. More generation may not fix a selection bottleneck.

## Worked example: avoid submitting similar failures

This is an original, reduced teaching example. Return the maximum of a nonempty integer array; all-negative inputs are allowed. The public example is `[2, 5] → 5`. Four candidates pass: A starts its running maximum at zero; B returns the last element; C starts at the first element; D sorts and returns the last element.

A probe `[-3, -1]` produces 0, −1, −1, −1. A second probe `[4, 1]` produces 4, 1, 4, 4. Their behavior vectors are A=(0,4), B=(−1,1), C=(−1,4), D=(−1,4), producing three clusters.

With two submission opportunities, C and D do not increase behavioral coverage on these probes. Make the requirements explicit, establish expected outputs, and eliminate A and B. C and D still require checking the allowed input domain, whether mutation is permitted, and sorting cost. Clustering saves selection opportunities; specifications and tests define correctness.

## Search the knowledge space: retrieve the missing fact

Search-o1 lets the reasoning model request retrieval when knowledge is missing. Its separate Reason-in-Documents stage uses the query, preceding reasoning, and documents to refine relevant information. It avoids inserting entire long documents into the main chain, but refinement can also drop important conditions.

Consider an original example: compare the free allowances of services A and B for 100 requests a day over a specified 30-day month. Demand is 3,000 requests, but A's allowance period is unknown. Search for its daily or monthly allowance, rather than another general product introduction.

Suppose the supplied teaching documents state that A includes 2,000 requests monthly and charges 0.01 dollars per extra request, while B includes 5,000 monthly. Preserve the units: A costs 10 dollars for 1,000 excess requests; B stays within its allowance. These are hypothetical prices. A source saying only “2,000 requests” does not justify assuming a monthly period.

## Exercises and answers

Would `[7, 7]` separate C and D? No: both return 7. Clusters depend on probes. If mutation is forbidden and D sorts in place, inspect side effects; return-value tests alone are insufficient.

Now change A's allowance to 80 requests daily, keeping the excess price. Demand is 100 daily. Daily excess is 20; across 30 days it is 600, costing 6 dollars. Treating a daily allowance as monthly gives the wrong answer. Document refinement must preserve time units.

## Misconceptions and an action

More searches do not guarantee more information. More clusters do not guarantee more correct programs. Program search needs executable tests; research search needs documents and conditions supporting claims. Confidence is not a substitute for either.

Choose a small task, list three candidate solutions, and design two distinguishing tests. Separately, organize one factual query into five fields: claim, source, period, unit, and unknowns. Use the first table to identify selection problems and the second to identify knowledge gaps before increasing the search budget.

## English practice: audio shadowing pending

A text transcript of the lecture is available for content comparison. Caption type, precise timestamps, listening checks, and three replayable audio segments remain unverified. Shadowing materials are pending. Original examples are not attributed to the lecturer, and this English article does not substitute for an audio transcript.

## Lecture video source

[Stanford Online — Part 7](https://www.youtube.com/watch?v=Uni9dqyuuDM)

```youtube
url: https://www.youtube.com/watch?v=Uni9dqyuuDM
title: Stanford CS329A — Lecture 8
captions: en
```

## References

- [Stanford CS329A — Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [AlphaCode](https://arxiv.org/html/2203.07814)
- [AlphaCode 2 technical report](https://storage.googleapis.com/deepmind-media/AlphaCode2/AlphaCode2_Tech_Report.pdf)
- [Search-o1](https://arxiv.org/html/2501.05366)
- [Stanford Online — official lecture video](https://www.youtube.com/watch?v=Uni9dqyuuDM)
