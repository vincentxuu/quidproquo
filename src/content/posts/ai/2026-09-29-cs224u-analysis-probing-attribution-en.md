---
title: "CS224U Analysis Methods I: Probing Shows You Representations, Feature Attribution Gives You Causal Guarantees"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, interpretability, nlp, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 11
tldr: "The Analysis methods unit of CS224U (Spring 2023) starts by grading three families of methods on a three-column scorecard. Probing is strong at characterizing representations but can't support causal claims. Integrated gradients only gives you a scalar about each representation, but it satisfies the sensitivity axiom, so it does come with a causal guarantee. This post covers slides 1–40, videos 33–35, and feature_attribution.ipynb, including where the notebook breaks in today's environment."
description: "A guide to the first half of the Analysis methods unit in Stanford CS224U (Spring 2023): moving from behavioral to structural evaluation, how probing works, control tasks and selectivity, why probes can't support causal inference, the sensitivity axiom, the counterexample to inputs × gradients, how integrated gradients is computed, and what happens when you run feature_attribution.ipynb today."
draft: false
glossary:
  - term: "probe selectivity"
    aliases: ["selectivity", "control task"]
    definition: "A probe's performance on the real task minus its performance on a control task, which has the same input/output format but randomly assigned labels."
    context: "CS224U uses it to correct for probes that are powerful enough to store the information in their own parameters (Hewitt and Liang 2019)."
    links:
      - label: "Hewitt and Liang 2019"
        url: "https://aclanthology.org/D19-1275/"
  - term: "integrated gradients"
    aliases: ["IG"]
    definition: "Interpolate a series of points between a baseline and the actual input, compute the gradient at each one, average them, and multiply by the input-minus-baseline difference to get each feature's attribution."
    context: "CS224U uses it as its main feature attribution example because it provably satisfies the sensitivity axiom."
    links:
      - label: "Sundararajan et al. 2017"
        url: "http://proceedings.mlr.press/v70/sundararajan17a.html"
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/).** It is part 11 of the [Stanford CS224U guide series](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en). It covers the first half of the Analysis methods unit: the overview, probing, and feature attribution. The schedule puts this unit on May 8, 10, and 15, 2023. I used three official sources: slides 1–40 of the [Analysis methods in NLP deck](https://web.stanford.edu/class/cs224u/slides/cs224u-analysis-2023-handout.pdf) (64 slides in total), videos 33–35 of the public playlist, and [`feature_attribution.ipynb`](https://github.com/cgpotts/cs224u/blob/main/feature_attribution.ipynb) in the course repo.

Access follows the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) definitions: **A3 (historical offering)**. Slides, recordings, and notebooks are all public. What you can't get is Quiz 4 on Canvas and the classroom recordings.

## Course video sources

The videos below are the corresponding Spring 2023 recordings published by Stanford Online, matching the 2023 course version this article uses. Titles and video IDs were checked against the official 50-video playlist on 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=5RZDKW1_HS4
title: Stanford XCS224U: NLU I Analysis Methods for NLU, Part 1: Overview I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=lZqsLuAjZ4c
title: Stanford XCS224U: NLU I Analysis Methods for NLU, Part 2: Probing I Spring 2023
```

Original videos: [Stanford XCS224U: NLU I Analysis Methods for NLU, Part 1: Overview I Spring 2023](https://www.youtube.com/watch?v=5RZDKW1_HS4), [Stanford XCS224U: NLU I Analysis Methods for NLU, Part 2: Probing I Spring 2023](https://www.youtube.com/watch?v=lZqsLuAjZ4c)

Course and recording entries:

- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## Going one layer beneath behavioral evaluation

The [previous post](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3-en) was about black-box testing: does the model look right from the outside? On slide 3, Potts splits evaluation into two kinds. **Behavioral** covers standard IID, exploratory, hypothesis-driven, challenge, adversarial, and security-oriented tests. **Structural** covers probing, feature attribution, and interventions. This unit is about the second kind.

He uses an even/odd detector to show why you need to cross over. Model 1 gets four, twenty one, thirty two, thirty six, and sixty three right. Look inside and it is a lookup table for exactly those five strings, with everything else defaulting to odd. So twenty two comes out wrong. Model 2 is smarter: it reads the last token, maps one through nine to even or odd, and still defaults to odd otherwise. This time sixteen breaks it.

In video 33 he says:

> "no matter how many inputs we offer this model we will never get a guarantee for every integer string that it will behave as intended. For that kind of guarantee we need to look inside this black box."

He then names three positive guarantees everyone wants: free of pernicious social bias, safe in a given context, approved for a given use. Behavioral testing can show that a model **has** a problem. It can't show that it **doesn't**.

## The three-column scorecard is the unit's spine

The whole unit fills in one table. The three goals are characterizing representations, making causal inferences, and having a path to improved models. The table below comes from Potts's spoken ratings in videos 33–37. The ratings on the slides are images, so they don't survive text extraction.

| Method | Characterize representations | Causal inference | Improve models |
|---|---|---|---|
| Probing | Strong | No | Unclear (whether multi-task training works is open) |
| Feature attribution | Weak: a single importance score | Yes (with IG) | No direct path |
| Intervention-based | Yes | Yes | Yes (IIT, see the [next post](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das-en)) |

Potts is open about his stake. In the video he says the third family is the one he has been most involved in developing and the one he favors. Keep that in mind when reading the table.

## Probing: reading a big model's hidden layers with a small model

### How it works

Slide 16 breaks probing into four steps:

1. State a hypothesis about the target model's internal structure, such as "this layer encodes part of speech."
2. Pick a supervised task that serves as a proxy for that structure, such as a POS tagging dataset.
3. Pick the place in the model where you think the structure lives.
4. Train a supervised probe on that site.

In practice, BERT is just a machine that produces vectors. For each sentence, you pull the vector at the chosen site, pair it with a task label, build up an (x, y) dataset, and fit a small linear model on it. The schedule lists [Tenney et al.](https://aclanthology.org/P19-1452/) as the probing reading. They probed each BERT layer and found part of speech emerging in the middle layers, dependency parses a bit later, and coreference later still.

A small discrepancy: the schedule says "Tenney et al. 2018," but the link goes to the ACL 2019 paper *BERT Rediscovers the Classical NLP Pipeline*, and the slide references list Tenney, Das, and Pavlick 2019. I go with the link and the slides.

### Problem one: are you reading the target model or training a new one?

Slide 18 is blunt about it. A probe is itself a supervised model whose inputs happen to be the target model's frozen representations. That is hard to tell apart from training a classifier with a particular featurization. A more powerful probe finds more information, but some of that information may just be stored in the probe's own parameters.

[Hewitt and Liang 2019](https://aclanthology.org/D19-1275/) proposed the **control task** as a fix: same input/output format as the real task, but with labels assigned randomly and then held fixed, for example a random fixed POS tag for each word. **Selectivity** is the probe's score on the real task minus its score on the control task. Video 34 cites their result: a tiny probe with just two hidden units has the highest selectivity, and probes with many parameters have enough capacity to memorize the data, so their selectivity drops.

**What to do**: when you probe, report the control-task score and selectivity alongside probe accuracy.

### Problem two: probes can't support causal claims

This is the point Potts cares about more. Slides 21–22 use an addition network. It takes three numbers and always outputs their sum correctly. Your hypothesis is that the first two numbers get added into an intermediate variable S1, the third is copied into w, and the output is S1 + w.

You probe L1 and it perfectly encodes the third input z. You probe L2 and it perfectly encodes x + y. The hypothesis looks confirmed, just in a different order. But lay out the weights and the output layer's weight on L2 is 0. L2 has **no effect at all** on the output. It really does store x + y, and nothing uses it.

A probe saying "this information is here" doesn't mean "the model relies on this information to decide."

### A path to better models?

Slide 23 suggests one route: multi-task training, where you train on addition and also require one representation to encode z and another to encode x + y. Potts thinks it's an open question whether that actually induces modularity, and even if it does, you still don't get causal guarantees.

The last probing slide lists work on unsupervised probes: SVCCA, inspecting attention weights, the linear structural probe of [Hewitt and Manning 2019](https://aclanthology.org/N19-1419/), and others. These usually have no parameters of their own, so the "probe is too powerful" problem goes away. They still can't support causal claims.

## Feature attribution: what is responsible for this prediction?

### Two axioms

Slide 27 lists the methods supported by [captum.ai](https://captum.ai): integrated gradients, gradients, saliency maps, DeepLift, deconvolution, LIME, feature ablation, feature permutation, and more. The unit goes deep only on integrated gradients (IG, [Sundararajan et al. 2017](http://proceedings.mlr.press/v70/sundararajan17a.html)). [LIME](https://arxiv.org/abs/1602.04938) is on the reading list too, but the slides only list it among captum's methods and don't discuss it.

Part of why Potts likes the IG paper is that it uses axioms to pin down what a good attribution should satisfy. He covers two of them:

- **Sensitivity**: if two inputs differ only in dimension i and get different predictions, dimension i must get non-zero attribution.
- **Implementation invariance**: if two models have identical input/output behavior, their attributions must be identical. Implementation details shouldn't matter.

### The counterexample to inputs × gradients

The intuitive baseline is inputs × gradients: take the gradient with respect to a feature and multiply by the feature's value. It generalizes to any neuron in the network.

Slide 31 borrows the IG paper's counterexample. The model is M(x) = 1 − ReLU(1 − x), so M(0) = 0 and M(2) = 1. The input has one dimension and the outputs differ, so sensitivity requires non-zero attribution for that dimension. But inputs × gradients gives 0 at x = 0 (gradient 1 times 0) and 0 at x = 2 (gradient 0 times 2). The axiom is violated.

Slide 30 raises a separate conceptual problem. For a classifier, should attributions be computed with respect to the **predicted** label or the **true** label? When the model is accurate, the two barely differ. But you are often analyzing a bad model, and then they diverge. Potts deliberately trains a shallow classifier for a single iteration, and the two options give completely different mean attributions. His conclusion in video 35 is that there is no a priori reason to prefer either one. Be explicit about your assumptions and methods.

### How integrated gradients works

The intuition behind IG is to look at counterfactual versions of the input. Pick a baseline (often the all-zeros vector), interpolate a series of points between it and the actual input, compute the gradient at each point, and aggregate. Slide 33 splits this into five steps:

1. Generate the step vector α = [1, …, m]
2. Interpolate between the baseline x′ and the actual input x
3. Compute gradients at each interpolated point
4. Approximate the integral by averaging
5. Multiply by (x − x′) to scale back to the original input

<details>
<summary>Formula (slide 33)</summary>

IG<sub>i</sub>(M, x, x′) = (x<sub>i</sub> − x′<sub>i</sub>) · (1/m) · Σ<sub>k=1..m</sub> ∂M(x′ + (k/m)·(x − x′)) / ∂x<sub>i</sub>

</details>

On the same counterexample, IG gives an attribution of about 1 for x = 2 with baseline 0, so the counterexample goes away. Video 35 notes that IG provably satisfies sensitivity.

The practical appeal of IG is that you can attribute with respect to **any layer and any neuron** in the model. You get some of probing's flexibility plus a causal guarantee. The full example on slides 35–39 uses Hugging Face's `cardiffnlp/twitter-roberta-base-sentiment` with captum's `LayerIntegratedGradients` on the embedding layer. The baseline is a same-length sequence of pad tokens that keeps only CLS and SEP. Captum's visualizer then colors the tokens.

The small challenge set uses sentences like "They said it would be great, and they were right." and "…they were wrong." The reporting verb *said* and *right*/*wrong* all get clear attributions. Potts takes this as reassurance that the model is using systematic cues.

His verdict on feature attribution: only an "OK" characterization of representations, since you get a scalar importance score; a causal guarantee, yes; and no direct path from IG to improving models.

## Hands-on: running feature_attribution.ipynb today

The notebook goes in this order: two InputXGradients implementations (raw PyTorch and captum), the sensitivity counterexample (the notebook calls this section "selectivity examples"), a shallow classifier on `make_classification` synthetic data, error analysis for a bag-of-words SST classifier, and the RoBERTa example.

Things you can confirm from the repo:

- **The version string says "CS224u, Stanford, Spring 2022"**, a year older than the course site.
- **captum is not in `requirements.txt`.** You have to `pip install captum` yourself, and the notebook itself says it isn't a required install.
- **The SST section needs local data.** It reads `data/sentiment` and uses NLTK's stopwords list, so you have to download both first.
- **`get_feature_names()` breaks.** The SST section calls `DictVectorizer.get_feature_names()`. `requirements.txt` only asks for `scikit-learn>=1.0.2`, and I confirmed on my local scikit-learn 1.9.0 that the method no longer exists. Use `get_feature_names_out()` instead.
- **`ig_reference_implementation` only interpolates correctly when the baseline is 0.** It computes `xx = (base + (k/m)) * (x - base)`, while standard interpolation is `base + (k/m) * (x - base)`. Every baseline in the notebook happens to be 0, so the outputs are right, but a different baseline would give wrong results.

**What to do**: if you want a first pass tonight, run only the first two sections (InputXGradients and the sensitivity counterexample). They need only PyTorch and captum and no data downloads, and you'll see inputs × gradients return two zeros while IG returns roughly 1.

## What this post can and can't confirm

Confirmed: the schedule, the slide content, the three videos, and the current state of the notebook on GitHub. Not confirmed: what Quiz 4 asks (Canvas requires a login) and any extra classroom discussion in 2023 (the recordings are on Panopto).

Further reading: the site's CS224N series has an [interpretability guide](/posts/ai/2026-08-22-cs224n-interpretability-en) covering Been Kim's agentic interpretability, which complements the probing/IG line here.

Series navigation: previous, [Compositionality: COGS, ReCOGS, and HW3](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3-en) | next, [Analysis Methods II: causal abstraction, IIT, and DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked video IDs and lecture numbers against the official playlist; they are correct, and video titles now use the original titles.

## References

- [CS224U: Natural Language Understanding (Spring 2023 course site and schedule)](https://web.stanford.edu/class/cs224u/)
- [Analysis methods in NLP slides (Potts, 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-analysis-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Video 33: Analysis Methods for NLU, Part 1: Overview](https://www.youtube.com/watch?v=5RZDKW1_HS4)
- [Video 34: Part 2: Probing](https://www.youtube.com/watch?v=lZqsLuAjZ4c)
- [Video 35: Part 3: Feature Attribution](https://www.youtube.com/watch?v=p0dzR6iaFmc)
- [feature_attribution.ipynb (cgpotts/cs224u)](https://github.com/cgpotts/cs224u/blob/main/feature_attribution.ipynb)
- [cgpotts/cs224u requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt)
- [Tenney, Das, and Pavlick 2019: BERT Rediscovers the Classical NLP Pipeline](https://aclanthology.org/P19-1452/)
- [Hewitt and Liang 2019: Designing and Interpreting Probes with Control Tasks](https://aclanthology.org/D19-1275/)
- [Hewitt and Manning 2019: A Structural Probe for Finding Syntax in Word Representations](https://aclanthology.org/N19-1419/)
- [Sundararajan, Taly, and Yan 2017: Axiomatic Attribution for Deep Networks](http://proceedings.mlr.press/v70/sundararajan17a.html)
- [Ribeiro, Singh, and Guestrin 2016: "Why Should I Trust You?" Explaining the Predictions of Any Classifier](https://arxiv.org/abs/1602.04938)
- [Captum](https://captum.ai)
