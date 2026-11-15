---
title: "AI Engineer Interview Daily — 2026-11-04: ML System Design"
date: 2026-11-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Wednesday's slot is ML System Design, practiced on a real Reddit MLE onsite question: splitting a comment-likelihood prediction system into a serving-path latency budget, batched candidate scoring, and a deployment safety net."
tldr: "Today's core idea is shifting ML system design from picking a model to keeping that model alive in production: break the serving path into feature retrieval, preprocessing, inference, and postprocessing, each against an explicit latency budget; score the whole candidate list in one batch instead of repeating work per candidate; and back it with canary/shadow deployment plus three distinct monitoring categories — data drift, concept drift, and infrastructure failure. The practice question is a real Reddit MLE onsite prompt: design a comment-likelihood prediction system with most of the depth on feature serving and model serving. The trap is stopping at \"put the model behind an API\" without touching the latency budget, skew detection, or rollback."
series:
  name: "AI Engineer Interview Daily"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-11-04-ai-interview-daily)

## Today's Focus

Wednesday's slot is ML System Design, and today takes a different angle: instead of designing a whole recommendation system from scratch, it zooms in on the part interviewers dig into hardest and candidates most often wave at — actually keeping a model alive in production. Most people prepare for ML system design by memorizing the standard pipeline of data → features → model → evaluation, but interviewers usually start asking the real questions only after the model choice is settled: where does this feature come from, how fast can it be looked up, how does the whole candidate list get scored within the latency budget, and what does the system do when the model breaks or slows down.

This isn't about being able to draw a feature store box and a model server box. It's about knowing how many engineering decisions stand between "the model is behind an API" and "the model survives real production traffic" — which is exactly what the ML system design round of an ML Engineer onsite is testing.

## Core Concepts

```flow-diagram
{
  "title": "Serving-path breakdown of a ranking request",
  "lang": "en",
  "width": 520,
  "height": 680,
  "nodes": [
    {"id": "input", "label": "Ranking request arrives\nuser + candidate post list", "x": 260, "y": 50, "w": 280},
    {"id": "feature", "label": "Feature retrieval\none online-store call for the list", "x": 260, "y": 190, "w": 280},
    {"id": "preprocess", "label": "Preprocessing\nsame transforms as training", "x": 260, "y": 330, "w": 280},
    {"id": "inference", "label": "Inference\nversioned ranker, batch-scored", "x": 260, "y": 470, "w": 280, "tone": "accent"},
    {"id": "output", "label": "Postprocessing & response\nbusiness rules + fallback on timeout", "x": 260, "y": 610, "w": 280}
  ],
  "edges": [
    {"from": "input", "to": "feature", "step": 1, "label": "batch feature fetch"},
    {"from": "feature", "to": "preprocess", "step": 2, "label": "align with training"},
    {"from": "preprocess", "to": "inference", "step": 3, "label": "batch scoring"},
    {"from": "inference", "to": "output", "step": 4, "label": "apply rules or fallback"}
  ],
  "steps": [
    "Feature retrieval pulls every feature the whole candidate list needs from a low-latency online store in one call, instead of re-fetching the user's features once per post — this is the single biggest lever on p99 latency, and interviewers push on it a lot.",
    "Preprocessing applies the exact same feature transforms used in training (the same log-transform, for example) — getting this step wrong is the most common source of training-serving skew.",
    "Inference scores the whole candidate list in one batch with a versioned ranker; the model version and its feature schema are deployed together and can't be upgraded independently.",
    "Postprocessing applies business rules (diversity, safety filtering) before returning a response; any stage that times out or hits a missing value falls back to a predefined default or simplified model instead of failing the whole request."
  ],
  "caption": "Simplified: the upstream candidate-generation stage and the separate shadow/canary deployment path are omitted. An end-to-end latency budget (e.g. 100ms) is split across these stages."
}
```

### Serving-path breakdown and the latency budget: split one request into pieces you can measure separately

A ranking request has to get through several stages inside its latency budget: request handling, feature retrieval, preprocessing, inference, postprocessing, and a defined fallback behavior. A strong answer states an explicit end-to-end budget up front (say, 100ms total, with 20–40ms reserved for model inference itself), splits the rest across the other stages, and measures p50, p95, and p99 for each stage separately — because what actually sinks a request usually isn't the average latency, it's one stage blowing up in the tail. Jumping straight to an architecture diagram without stating a budget first is the most common way to lose points on this question.

### Candidate generation and ranking are two separate stages — never run a deep model over the whole corpus

A single request usually needs scores for many candidates at once (a personalized feed might have hundreds of candidate posts for one user). The right move is to split "cheaply narrowing down a candidate set" from "running an expensive model over a bounded set" into two stages — use subscriptions, collaborative filtering, embedding nearest-neighbor search, or popularity to pull a few hundred to a few thousand candidates, then let the heavier ranker score only that bounded set, never the whole corpus. This two-stage architecture saves both latency and compute at once; when a candidate says they'd "just call the model once per candidate," that's usually the signal they haven't thought about what work can be shared across a single request.

### Training-serving skew: catch it with centralized definitions and shadow comparisons, not trust

Training-serving skew happens when training and inference apply different transforms to the same feature — the classic case is training on a log-transformed count while production sends the raw count. The fix is centralizing feature definitions into a single source that feeds both paths, plus running regular shadow comparisons — taking the feature values actually sent to the model in production and comparing them against the same logic recomputed offline; a widening gap means the two paths have already drifted apart. Saying "I'd make sure features stay consistent" without saying how you'd detect inconsistency is a common way this part falls flat.

### Deployment safety net: canary, shadow deployment, and three separate monitoring categories

Before a new model launches, shadow deployment lets it receive real traffic without affecting any decision, so you can compare score distributions, feature availability, latency, and disagreement against the current model; once that looks clean, canary traffic exposes it gradually, backed by versioned models and fast rollback. Monitoring after launch needs to separate three genuinely different failure modes — data drift (the input distribution changed), concept drift (the relationship between inputs and outputs changed), and infrastructure failure (timeouts, thrown errors, capacity limits) — because each one calls for a different response, and lumping them together signals you haven't actually thought through what "model degradation" looks like in practice. Alerting thresholds should also be set at a level that's actionable, not firing on every small distribution shift.

## Today's Practice Question

### The Question

Design a comment-likelihood prediction system: on a large discussion platform where posts belong to communities, given a user and a post, estimate the probability that the user will comment on it. Cover the problem framing, training data, features, and model choice, but expect most of the discussion to land on feature serving and model serving — how every feature the model needs gets computed, stored, and fetched at request time, and how the model is deployed and scored within the request's latency budget.

**Source**: Real Reddit Machine Learning Engineer interview question (collected via PracHub's interview question library, logged 2026-09-07) **Difficulty**: Medium **Round**: Onsite ML system design

### Breaking It Down

1. **Clarify the problem first**: the prompt is deliberately open-ended, so it's worth asking up front — where does this score get consumed (personalized feed ranking, ranking within one community, or filtering for notifications), since that directly sets the candidate count and latency budget; does "comment" mean top-level only or any reply in the thread, and over what observation window; and what infrastructure already exists — an event stream, a feature store, a model-serving platform. These answers decide how much depth you can go into later.
2. **Build the framework**: start with a precise label (event, time window, impression source), handle position bias and class imbalance, and keep the output calibrated. Then group features by entity and by freshness — slow-changing features run batch, medium-speed ones run streaming aggregation, and only features that genuinely need second-level freshness get real-time compute — feeding both a low-latency online store and a point-in-time-correct offline store.
3. **Go deep on the core trade-offs**: nearly all the depth on this question is on the serving side. Training-serving consistency needs either shared feature definitions or logged serving-time feature values to detect skew; the model-serving path needs an explicit latency budget, batched scoring of the whole candidate list, versioned deployment of the model together with its feature schema, a safe rollout path (canary/shadow), and defined timeout and fallback behavior; monitoring needs to cover feature freshness, prediction calibration, and guardrails against rewarding low-quality engagement.
4. **Close it out**: collapse the whole answer into one judgment call — "this question isn't testing whether you can pick a model, it's testing whether you've quantified every stage of keeping that model alive under real traffic and thought through its failure modes" — then add one more layer: "a trending post's comment count changes several times a second and gets read by many concurrent requests at once; keeping that fresh without hammering the online store is usually the follow-up this question ends on."

### Sample Answer (How You'd Actually Say This in an Interview)

> **First, pin down the problem**: I'd confirm whether this score drives personalized feed ranking or ranking within a single community, since that sets the candidate count and latency budget. I'd define the label as "a top-level comment within some time window after the post was shown," handle position bias and class imbalance, and keep the output calibrated rather than just rank-ordered. I'd group features by freshness: static user and community attributes run daily batch, recent-interaction aggregates run streaming, and real-time signals from a post's first few minutes get computed at request time — all feeding both a low-latency online store and a point-in-time-correct offline store.
>
> **Serving is really the heart of this question**: a single request scores a whole batch of candidate posts for one user, so I'd make sure feature retrieval fetches everything the whole candidate list needs in one call, instead of re-querying the user's features once per post. Preprocessing applies the exact same transform logic used in training, and I'd run regular shadow comparisons between the live serving-time feature values and the same logic recomputed offline to catch training-serving skew. On the inference side, a versioned ranker scores the batch; a new model version first runs shadow traffic to compare score distributions before being exposed gradually through canary traffic.
>
> **To close**, I'd add monitoring and fault tolerance: feature freshness, prediction calibration, and three distinct failure modes — the input distribution shifted, the input-output relationship shifted, or the infrastructure itself broke — each needing a different response; any stage that times out or hits a missing value falls back to a predefined default rather than failing the whole ranking request. With more time, I'd specifically handle trending posts: comment counts that change every second under heavy concurrent read load need an extra caching or approximate-update layer, rather than hitting the online store directly on every request.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---|---|
| Precisely defined the label (event, time window, impression source), and handled position bias / class imbalance and output calibration | |
| Grouped features by entity and freshness, mapped to batch / streaming / request-time pipelines | |
| Broke down the serving-path latency budget (feature retrieval / preprocessing / inference / postprocessing each measured at p99) | |
| Mentioned batch-scoring the whole candidate list instead of repeating work per candidate | |
| Explained how to detect training-serving skew (centralized feature definitions or shadow comparison), plus a safe canary/shadow rollout | |
| Bonus: separated data drift / concept drift / infrastructure failure as three monitoring categories, and addressed freshness for hot items (trending posts) | |

## Further Reading

- [ML Model Serving Architecture — Tech Interview Concept](https://prachub.com/concepts/ml-model-serving-architecture) — a full interview-concept writeup of serving-path decomposition, the candidate-generation/ranking two-stage architecture, canary/shadow deployment, and the three monitoring categories, with common failure modes
- [Machine Learning System Design in a Hurry — Hello Interview](https://www.hellointerview.com/learn/ml-system-design/in-a-hurry/introduction) — a quick-reference guide that splits ML system design interviews into Product, Infra, and Model tracks, useful for figuring out which track a given question belongs to

## References

- [Design a Comment-Likelihood Prediction System with a Focus on Feature and Model Serving — PracHub (Reddit, Machine Learning Engineer)](https://prachub.com/interview-questions/design-a-comment-likelihood-prediction-system-with-a-focus-on-feature-and-model-serving) — original source of today's practice question, logged as a real Reddit MLE onsite interview question
- [Reddit Machine Learning Engineer Interview Experience — Onsite with a Cat/Dog Comment-Tree Filter and a Comment-Likelihood ML Design — PracHub](https://prachub.com/interview-experiences/reddit-machine-learning-engineer-interview-experience-onsite-with-a-cat-dog-comment-tree-filter-and-a-comment-likelihood-ml-design) — the full interview report this practice question came from
- [ML Model Serving Architecture — Tech Interview Concept — PracHub](https://prachub.com/concepts/ml-model-serving-architecture) — source for the "serving-path breakdown," "candidate generation and ranking," and "deployment safety net" sections
- [What Is a Feature Store? — Chalk](https://chalk.ai/blog/what-is-a-feature-store) — source for the definition and detection method in the "training-serving skew" section
