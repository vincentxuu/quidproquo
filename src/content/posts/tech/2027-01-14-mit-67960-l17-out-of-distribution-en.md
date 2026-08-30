---
title: "MIT 6.7960 L17: Out-of-Distribution Generalization — Distribution Shift, Spurious Correlations, and Three Practical Remedies"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - ood
  - distribution-shift
  - domain-adaptation
  - irm
  - spurious-correlations
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW, Lecture 17: why do models break when train and test distributions differ? The difference between covariate / label / concept shift, what spurious correlations and shortcut learning are, and three remedies — IRM, domain randomization, test-time adaptation."
tldr: "OOD failure is not a bug, it's the i.i.d. assumption breaking: covariate shift (image style changes), label shift (class proportions change), concept shift (a word's meaning changes) each need different responses; the most common cause is the model latching onto spurious correlations (using grass as a cue for cows); IRM and domain randomization try to fix this in training data structure, test-time adaptation fixes it at inference."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 20
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 29
---

> 🌏 [中文版](/posts/tech/2027-01-14-mit-67960-l17-out-of-distribution)

> **Source**: based on **MIT 6.7960 Fall 2024 OCW** (corresponds to OCW Lec 17). Videos, slides, and assignments are all open on [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/).

---

## The gap between the i.i.d. assumption and the real world

Almost every ML textbook assumes training and test data are i.i.d. samples from the same distribution. But real deployment is never like that: the camera model changes, the hospital changes city, the corpus moves from English to legal text. A model hits 95% accuracy in-distribution, then 60% in production — not a bug, the **assumption broke**.

## Three types of shift

The lecture breaks shift into three types, each needing a different response:

| Type | What changes | Typical example |
|---|---|---|
| **Covariate shift** | P(X) changes, P(Y\|X) unchanged | Daytime model meets night scenes; sketch vs photo |
| **Label shift** | P(Y) changes, P(X\|Y) unchanged | Hospital A has more elderly patients, Hospital B more athletes |
| **Concept shift** | P(Y\|X) changes | "Healthy" redefines across eras; spam rules evolve with the cat-and-mouse game |

Identifying which type matters: covariate shift can be fixed by re-weighting training, label shift by calibrating predictions, concept shift usually needs re-labeling.

## Spurious correlations and shortcut learning

The most common — and sneakiest — cause of OOD failure: **the model latches onto a spurious correlation**. The classic example: an ImageNet cow-vs-sheep classifier learns "is there grass in the background?" as a cue for cow presence; in the desert or on the beach it falls apart.

This is not a training-not-converged issue, nor an insufficient-capacity issue. **ERM (empirical risk minimization) with limited capacity**, given enough i.i.d. training data, picks the most predictive shortcut it can find. Avoiding it requires **changing the structure of the training distribution**, not a bigger model.

## Three remedies

### 1. Invariant Risk Minimization (IRM, Arjovsky 2019)

The idea: across multiple training environments, learn a representation `Φ` such that the optimal classifier `w` is the same in all environments — i.e. learn features that are **invariant across environments**. In practice, add a penalty in each environment that encourages the within-environment optimal classifier to be the same.

Practically, IRM on the DomainBed benchmark is roughly tied with plain ERM (some newer ERM variants even beat it), so it gets criticized as "conceptually elegant but limited effect." But it points to the core truth: **real generalization must come from the environment structure of the training data**.

### 2. Domain randomization / data augmentation

Since we can't enumerate all test environments, **maximize environmental variation at training time**: color jitter, cutout, mixup, CutMix, RandAugment, style transfer, synthetic data. The ImageNet-C / -R / -A benchmarks simulate shift via augmentation.

A cheap remedy, usually more effective than IRM. Cost: slightly longer training, and augmentation can't be too aggressive (the training distribution drifts).

### 3. Test-time adaptation (TTA)

At inference, use **unlabeled test data** to adapt the model on the fly. The classic TENT (Wang 2021) combines batch-norm stat updates with entropy minimization — a few gradient steps shift the model toward the current data distribution.

TTA needs no labels and is free at deployment, but assumes "test environment varies continuously and the model can adapt" — not a silver bullet.

## Honest evaluation: the benchmark itself is biased

Recht et al. (2019) did something rigorous: re-collect the ImageNet test set with the same methodology (ImageNet-V2). SOTA models drop 11–14%. Similar conclusions from Bechtel et al. — don't take a single benchmark number as ground truth.

In practice: cross-check on at least one independent distribution (different time / geography / population) before going to production.

## Minimal experiment: test-time entropy minimization

```python
model.train()                              # enable BN stats update
for x_unlabeled, _ in test_loader:
    logits = model(x_unlabeled)
    loss = -(logits.softmax(1) * logits.log_softmax(1)).sum(1).mean()  # entropy min
    loss.backward(); opt.step(); opt.zero_grad()
```

Run for 1–2 epochs and the model "moves toward the test distribution's features" — covariate shift often recovers a few points this way.

## Which remedy for which shift

- **Small shift**: more data + augmentation is enough.
- **Medium shift**: test-time adaptation (unlabeled) or self-training.
- **Large shift**: domain adaptation (a bit of target-domain data) or even retraining.
- **Concept shift**: almost only re-labeling — the model layer can't save you.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Arjovsky et al., *Invariant Risk Minimization* (2019): [arXiv:1907.02893](https://arxiv.org/abs/1907.02893)
- Gulrajani & Lopez-Paz, *In Search of Lost Domain Generalization* (DomainBed, 2021): [arXiv:2107.00641](https://arxiv.org/abs/2107.00641)
- Recht et al., *Do ImageNet Classifiers Generalize to ImageNet?* (2019): [arXiv:1902.10811](https://arxiv.org/abs/1902.10811)
