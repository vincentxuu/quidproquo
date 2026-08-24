---
title: "How Marin Trains 535B: Scaling Ladder, MoE Expert Parallel, Harrier Data and Live W&B"
date: 2026-08-24
category: ai
type: deep-dive
tags: [marin, mixture-of-experts, scaling-laws, llm, open-source, stanford-cs336]
lang: en
tldr: "Stanford Marin pre-registers a paloma macro-loss of 2.04 with a 5-rung Scaling Ladder at 1% cost, then trains 535B-A23B on 11×GB200 in public with live W&B telemetry — 847 training buckets already show the most teachable frontier run."
description: "A process-ordered deep dive into Marin 535B-A23B: why a ladder first, how 535B MoE and 11×GB200 fit, how Harrier 23.1T is bucketed, how MoE all-to-all is solved, and how to read live W&B."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-24-marin-535b-hero-run)

This post introduces Stanford Marin's ongoing **535B-A23B hero run**.

You will learn why small models rehearse the large one, how 535B hardware and parameters fit, how Harrier data is cut, how MoE networking is solved, and how to tell from W&B if training has drifted.

The core idea is **spending 1% of compute to buy 99% of confidence**. Rehearse failures at small scale, then burn the 100-day run.

## What Marin Is

[Marin](https://github.com/marin-community/marin) is Stanford CRFM's open platform led by Percy Liang. It advocates `open development` beyond `open weights`.

In the [ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI](https://www.iclr.cc/virtual/2026/invited-talk/10020867), the speaker notes `As AI capabilities skyrocket, openness plummets`. Marin's answer: every experiment is preregistered and live on GitHub, including failures, open for anyone to question and rerun. Even `d2048 failing at 81% without resumption` stays in [Hero Run #8435](https://github.com/marin-community/marin/issues/8435).

This hero run is Marin's largest to date, positioned at `5e24 model-FLOPs, 500B+ total`.

Predecessors verified the method: [67B-A2B 10T](https://github.com/marin-community/marin/issues/6044) with about 0.6% error and [1e23 d5120 129B/16B](https://github.com/marin-community/marin/issues/4697) with about 1% error. This post only covers the hero's first 3.5% and the ladder; post-training is not yet started.

## How the Scaling Ladder Rehearses

A hero run costs about 100 days. One failure costs millions.

Marin's answer is an **iso-ratio ladder** before the full run. Intuition: cook a small pot with the same recipe to predict the large pot.

### Design Philosophy

Five widths with identical recipe. Fixed `791 tokens / active param`, same Harrier mix and epoching.

Then fit a power law and extrapolate the hero's final loss. The extrapolated value is **2.04**.

This gives a quantitative `off-course` criterion, not just a feeling.

### Compared to Alternatives

An arbitrary small run only answers `it runs`.

An iso-ratio ladder answers `where it will converge`. The ratio is fixed, so error can be validated beforehand.

### When to Use and When Not To

Good for teams that want to see dynamics before burning money. Also good for researchers who want to rerun the ladder at 1% cost.

Not for those waiting for a final leaderboard. That comes after the hero and post-training.

### How It Is Done

Widths `d768 → d1024 → d1536 → d2048 → hero d6144`. Cost is 1%.

### Limitations

`d2048` failed at 81% without resumption; the tail relies on extrapolation and needs hero verification.

### What It Caught

The previous ladder saw grad norm above 4, leading to `logit z-loss`. Without it, the hero would blow up mid-run at high batch size.

This ladder shows gradients peaking around 25% then declining, and drop spiking then settling. Hence the hero expectation around `about 2%`.

## How the Hero Is Launched: Model and Hardware

This section answers `how 535B is assembled and placed`.

### How Big Is the Model

Large total, small active. Think of 384 experts where each token consults 8, plus 2 generalists as backup.

This is the `total ≠ active` in [CS336 Lecture 4](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf).

### How Big Is the Hardware

11 GB200 NVL72. Experts are sharded inside each rack, with data-parallel across racks.

Mirroring [CS336 Lecture 2](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)'s `6×N×D` estimate, 2.7e24 FLOPs divided by peak predicts 100 days without renting first.

### When to Use and When Not To

Good for teams needing to understand `active vs total` cost.

Not for single-machine reproduction of 535B. 11 racks cannot be reproduced, but the ladder can.

### Limitations

Details are in Appendix A. The `18.0T vs 18.75T` gap is definitional: the former is step conversion, the latter is reference budget. A [comment on 08-19](https://github.com/marin-community/marin/issues/8435#issuecomment-3269873921) notes `≤8-epoch cap`.

## How Harrier Data Is Cut

Harrier is a map, not a single dataset.

First, dedup. Raw had many sources, after fuzzy dedup and `n-gram decontamination` about 23.1T remains. Pair examples at [dedup browser](https://storage.googleapis.com/marin-public/rav/dedup-pair-browser/2026.08.18.2/index.html), provenance frozen at `marin-community/token-counts@3612ddc`.

Then bucketing. [Harrier 0.6b](https://huggingface.co/microsoft/harrier-oss-v1-0.6b) embeddings → `K-means 5000 → 40` semantic domains; quality labeled by [GLM 5.2](https://huggingface.co/zai-org/GLM-5) then distilled. Visualized at [Harrier K40 overview](https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling).

Good for teams picking domains. Search a topic, check its `Q0–Q4` split and enrichment, then decide on upweighting.

Not for teams wanting `download-and-use`. The underlying `s3://marin-us-east-02a/marin/datakit/store_4d2e363d` was confirmed `403` on 08-22 by two independent observations, so end-to-end reproduction remains blocked on bucket policy.

You can do tonight: open Harrier K40 overview, type `Software Development`, check its share in Q4 versus the full average, and decide on upweighting for your next run.

## How MoE Networking Is Solved

Replacing dense with MoE saves `active FLOPs` and moves cost to `routing + all-to-all`.

This is the question Lecture 4 asks you to chase: every FLOPs reduction adds communication.

Hero's three answers:

- **LatentMoE**: compress hidden to latent before all-to-all, halving transport. FLOP accounting is corrected so MFU is not inflated.
- **Pooled-wave fixed EP**: hand-rolled fixed-shape buffers with `in-band IDs`, avoiding `ragged`'s dynamic shapes. See [EP writeup](https://storage.googleapis.com/marin-public/rav/moe-fixed-wave-a2a-384/2026.08.17/index.html).
- **Shared backup**: 2 generalists provide about one-third dense capacity. Even at 40% dropping, zero loss spike.

On a 4-node proxy in [EP64 ragged diagnosis #8077](https://github.com/marin-community/marin/issues/8077), optimized MFU went from 11.3% to about 19.6%. Full-rack remains unverified, so the hero stays on the fixed path.

Good for teams that want more capacity without proportional FLOPs. Not for teams treating MoE as `free scaling`; networking and balance are the hidden bill.

## How to Read It Live: W&B hero-12d8b6f0-dee637

The [W&B Hero Run Scaling Ladder](https://wandb.ai/marin-community/marin_moe/reports/Hero-Run-Scaling-Ladder--VmlldzoxNzc2MDM5Ng) is queryable via `api.wandb.ai/graphql`. We intercepted 847 buckets.

Training to `step 13527` (about 3.5%):

- `loss` drops steeply. Early fast convergence is expected.
- `grad` shows an early micro-peak then back to a low, direction down, matching `watch direction, not absolute value`. The true 25% peak is not yet reached.
- `drop` recovers from a spike to about 3%, within the healthy range.
- `MFU` stabilizes around 21 after warmup.

Against the health checklist, `First 3%` is already marked `clear` in #8435. The next window is the true gradient peak around 30%.

Eval at 12k steps: `paloma macro` is 2.577. versus ladder target 2.04 is expected at 3% (early `0→3k` drop of 8.77, then `3k→12k` drop of 0.44). Domain gaps already provide a datamix observation point.

Raw `bucketedHistory` and CSVs are at `.research/wandb-hero-12d8b6f0/`, full table in Appendix B.

You can do tonight: poll `grad` direction and `drop` via `BucketedRunsDeltaQuery`. If grad keeps rising before 25% or drop exceeds 8%, compare against the small ladder's shape before tuning `z-loss` or `capacity`.

## Overall

Marin spends 1% of compute to earn 99% of confidence. The cost is more complex engineering and a slower start, in exchange for an auditable, interruptible, adjustable voyage.

This mirrors [CS336 Lecture 2 resource accounting](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py) and [Lecture 4 MoE trade-offs](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) at 11×NVL72 for 100 days.

For outside observers, the value is not the number 535. It is how the team diagnoses and fixes every deviation from the ladder over the next 100 days.

## Limitations

- `11 racks` cannot be reproduced. Harrier's underlying bucket was confirmed `403` on 08-22 by two independent observations, so reproduction remains blocked on bucket policy.
- The prediction assumes `full 4k + same datamix`. The datamix was already updated on 08-19 and context will extend, requiring segmented comparison.
- `d2048` failed at 81% without resumption; the tail needs hero verification.

## Appendix A: Spec Details

- Model: `d6144 / 48 layers / 384 top-8 + 2 shared`
- Params: `total 535.3B / active 22.76B`
- Hardware: `11× GB200 NVL72`
- Training: `18.0T tokens / 390,139 steps × 11,264 seq × 4096 / 2.70e24 FLOPs`
- Code: `commit 12d8b6f`
- Harrier: `Raw 25.6T → 23.106T / 40 domains`
- Excerpt: `26 Council 7.52%·1.74T / 32 Infra 7.04%·1.63T / 14 Web Code 6.73%·1.56T`

## Appendix B: W&B Raw Numbers

Training `847 buckets` and eval `5 points` full CSV and JSON at `.research/wandb-hero-12d8b6f0/`.

Excerpt: `loss 11.801→1.321`, `grad peak 1.518→0.205`, `drop 10.43%→3.06%`, `MFU 21.15`, `paloma macro 2.577`.

## References

- [Hero Run #8435 — 535B-A23B on 18T tokens](https://github.com/marin-community/marin/issues/8435)
- [W&B — 535B-A23B 18T Token Hero Run + Scaling Ladder](https://wandb.ai/marin-community/marin_moe/reports/Hero-Run-Scaling-Ladder--VmlldzoxNzc2MDM5Ng)
- [Harrier K40 overview — 23.11T / 40×5](https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling)
- [EP writeup — pooled-wave fixed all-to-all](https://storage.googleapis.com/marin-public/rav/moe-fixed-wave-a2a-384/2026.08.17/index.html)
- [EP64 ragged diagnosis #8077](https://github.com/marin-community/marin/issues/8077)
- [ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI](https://www.iclr.cc/virtual/2026/invited-talk/10020867)
- [CS336 Lecture 2 — PyTorch, resource accounting](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)
- [CS336 Lecture 4 — Attention alternatives and MoE](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)
- [Marin — 1e23 report](https://github.com/marin-community/marin/issues/4697)
