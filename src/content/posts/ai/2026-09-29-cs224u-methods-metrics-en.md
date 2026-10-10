---
title: "CS224U Methods and Metrics I: A Classifier with 0.81 Accuracy and 0.43 Macro F1 — What Classifier and Generation Metrics Each Encode"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, evaluation, metrics, nlp, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 13
tldr: "The CS224U slides compute two numbers from one three-class confusion matrix: accuracy 0.81 and macro F1 0.43. One says the system is good; the other says it gets the two small classes almost entirely wrong. The unit's claim is that different metrics encode different values, and it goes through the bounds, values, and weaknesses of accuracy, the three F-score averages, perplexity, word error rate, and BLEU. Final projects are graded on whether the metrics fit, not on how high the scores are."
description: "A guide to the first half of the NLP methods and metrics unit in Stanford CS224U (Spring 2023): how experimental methods changed between 2010 and 2023, the two rules that can't bend, classifier metrics (accuracy, precision, recall, F scores with macro/weighted/micro averaging, PR curves), generation metrics (perplexity, WER, BLEU, plus other reference-based, reference-free, and task-oriented metrics), and evaluation_metrics.ipynb alongside Resnik and Lin 2010."
draft: false
glossary:
  - term: "macro-averaged F1"
    aliases: ["macro F1"]
    definition: "Compute F1 for each class, then take the unweighted mean, which treats every class as equally important."
    context: "In this post's confusion matrix, it exposes the failure on two small classes hidden behind 0.81 accuracy."
  - term: "brevity penalty"
    aliases: ["BP"]
    definition: "The term in BLEU that stands in for recall: generated text shorter than the references is penalized, and the penalty stops once the length is sufficient."
    context: "It keeps systems from scoring well by producing very short, very precise outputs."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-methods-metrics)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/).** It is part 13 of the [Stanford CS224U guide series](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) and covers the first half of the NLP methods unit: the overview, classifier metrics, and generation metrics. The schedule puts this unit on May 17, 22, and 24, 2023. The Experimental protocol listed in the same row was due May 29.

Official sources: slides 1–41 of the [Methods and metrics deck](https://web.stanford.edu/class/cs224u/slides/cs224u-methods-2023-handout.pdf) (94 slides in total), videos 39–41 of the playlist, [`evaluation_metrics.ipynb`](https://github.com/cgpotts/cs224u/blob/main/evaluation_metrics.ipynb) in the repo, and the scheduled reading [Resnik and Lin 2010](https://home.cs.colorado.edu/~jbg/teaching/CMSC_773_2012/reading/evaluation.pdf). Access level: **A3 (historical offering)**.

Datasets, data organization, and model comparison make up the second half of the slides and are left for the [next post](/posts/ai/2026-09-29-cs224u-datasets-model-evaluation-en).

## Course video sources

The videos below are the corresponding Spring 2023 recordings published by Stanford Online, matching the 2023 course version this article uses. Titles and video IDs were checked against the official 50-video playlist on 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=ORg6bZ3d1Rc
title: Stanford XCS224U: NLU I NLP Methods and Metrics, Part 1: Overview I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=mbL4uUNtZwY
title: Stanford XCS224U: NLU I NLP Methods and Metrics, Part 2: Classifier Metrics I Spring 2023
```

Original videos: [Stanford XCS224U: NLU I NLP Methods and Metrics, Part 1: Overview I Spring 2023](https://www.youtube.com/watch?v=ORg6bZ3d1Rc), [Stanford XCS224U: NLU I NLP Methods and Metrics, Part 2: Classifier Metrics I Spring 2023](https://www.youtube.com/watch?v=mbL4uUNtZwY)

Course and recording entries:

- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## Why an NLU course spends a unit on metrics

The previous two posts ([Analysis Methods I](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en) and [II](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das-en)) dealt with what a model does internally. This one steps back to a more basic question: what does the number you base your conclusion on actually measure?

Slide 5 starts with project grading. The course **will never evaluate a project based on how "good" the results are**. Publication venues have space constraints that push them toward positive results; the course doesn't, so positive results, negative results, and everything in between count equally. Grading looks at three things:

1. Whether the metrics are appropriate
2. How strong the methods are
3. How open and clear-sighted the paper is about the limits of its findings

The Experimental protocol section of [`projects.md`](https://github.com/cgpotts/cs224u/blob/main/projects.md) says the same. The Metrics field asks you to describe the basis for evaluation. A standard choice (F1 for classification, say) needs little explanation; departing from the standard or proposing your own metric needs a justification.

## The 2010 rules can't be followed in 2023

Slide 6 puts the two eras' experimental workflows side by side:

| Step | Circa 2010 | 2023 |
|---|---|---|
| 1 | Develop the full system on tiny samples of the train data | Same |
| 2 | Run cross-validation using only train data | Either there's no train data, or cross-validation would cost $20K and take six months |
| 3 | Evaluate on dev only occasionally, to avoid hill-climbing on it | Dev is crucial for optimization and a superb proxy for test |
| 4 | At the end, tune hyperparameters on dev, pick the best model, run test | Tuning would cost $100K and take ten years, or there are no hyperparameters but a test run costs $4K in API fees |

Slide 7's conclusion: the old rules are still sound, but only the richest organizations can follow them, and shutting everyone else out would be terrible. So **write down your methods and the reasoning behind them**, practical details included. Two rules stay absolutely fixed:

- **Never do any model selection based on test set evaluations**, not even informally.
- **Give every system you evaluate its best chance of success.** Never stack the deck for the system you're advocating.

**What to do**: add a log to your project notes for "how many times I touched the test set, and why," and write one line every time you run test.

## Strathern's law and leaderboards

Slide 8 quotes Strathern's law: "When a measure becomes a target, it ceases to be a good measure." Leaderboards give an objective basis for comparison and a hearing for wild-seeming ideas. Their downside is three conflations: benchmark improvements with progress, benchmarks with whole empirical domains ("X is solved"), and benchmark performance with capabilities.

Slide 9 lists some real application needs. Missing a safety signal costs lives, but human review is feasible. Specific mistakes are deal-breakers while others barely matter. The solution can't give worse service to specific groups. Then: "Our (apparent) answer: F1 and friends." In video 39, Potts's word for this is "tragically."

The rest of the overview covers multidimensional leaderboards like [Dynascores](https://github.com/cgpotts/cs224u/blob/main/dynascoring.ipynb); the observation that "human performance" is roughly the average performance of harried crowdworkers doing a machine task repeatedly (Pavlick and Kwiatkowski 2019); and a shift in assessment from one-dimensional and research-defined toward high-dimensional and stakeholder-defined. Dynascores are covered in the next post.

## Classifier metrics: one matrix, three stories

Slide 18's principle: **different metrics encode different values**. Choosing a metric is part of experimental design. For established tasks you'll be expected to use certain metrics, but you're entitled to push back.

The slides use the same three-class confusion matrix throughout (rows are gold labels, columns are predictions):

| Gold \ Predicted | pos | neg | neutral | support |
|---|---|---|---|---|
| pos | 15 | 10 | 100 | 125 |
| neg | 10 | 15 | 10 | 35 |
| neutral | 10 | 100 | 1000 | 1110 |

Slide 19 adds a reminder: **a threshold has already been imposed** to get these categorical predictions. A probabilistic classifier outputs a distribution, and turning it into labels was already a choice.

Per-class numbers from the slides:

| Class | precision | recall | F1 |
|---|---|---|---|
| pos | 0.43 | 0.12 | 0.19 |
| neg | 0.12 | 0.43 | 0.19 |
| neutral | 0.90 | 0.90 | 0.90 |

Macro F1 is the plain average of the three: **0.43**. The slides note that micro-averaged F1 for "yes" equals accuracy, which here is **0.81**. Plugging the supports into the weighting formula on slide 27, I get a weighted F1 of about 0.81.

Same system. Report accuracy or weighted F1 and it looks fine; report macro F1 and you can see pos and neg are almost all wrong. Neutral is 1,110 of the 1,270 examples, and the big class props the numbers up.

Values and weaknesses of each metric (from slides 20–29):

| Metric | Value encoded | Weaknesses |
|---|---|---|
| Accuracy | How often the system is correct | No per-class scores; doesn't control for class size |
| Precision | Penalizes incorrect guesses | Rarely guess k and precision for k goes up |
| Recall | Penalizes missed cases | Always guess k and recall for k goes up |
| F<sub>β</sub> | Balance of precision and recall, with β setting the weight (default 1) | No normalization for dataset size; ignores cells outside k's row and column |
| Macro F | Assumes all classes are equal | A system that does well only on small classes may fail in the real world, and vice versa |
| Weighted F | Assumes class size matters | Large classes dominate |
| Micro F | The "yes" score equals accuracy | Same as weighted, plus separate yes/no scores and no single summary number |

Two more points: accuracy is inversely proportional to the cross-entropy loss, and KL divergence is an analogue of accuracy for soft labels (slide 21). A precision–recall curve treats every predicted probability as a potential threshold, which sidesteps both the threshold choice and the β choice. If you need one number, average precision summarizes the whole curve.

The notebook goes further than the slides: ROC curves (which the notebook notes are limited to binary problems) and regression metrics (MSE, R², Pearson, Spearman).

**What to do**: take any classifier you have and print `sklearn.metrics.classification_report` for it tonight. Print all the averages (macro, weighted, and micro if your task allows it) and see how far apart they are. A big gap means class imbalance is flattering your model.

## Generation metrics: many good ways to say the same thing

Slide 32 names the core difficulty: there is more than one effective way to say most things. So you first have to decide what you're measuring: fluency, truthfulness, or communicative effectiveness? Video 41 gives examples. A system can be highly fluent while spewing falsehoods, or quite disfluent while still achieving its communicative goal.

### Perplexity

A sequence's perplexity is the inverse of the geometric mean of the probabilities the model assigns at each time step, and averaging over a corpus also uses a geometric mean. The range is [1, ∞], 1 is best, and it equals the exponentiated cross-entropy loss. Video 41 makes a pointed observation: almost every modern language model trains with cross-entropy, so **whether you want to or not, you're effectively optimizing for perplexity**.

Its weaknesses all come from how much it depends on setup:

- **It depends heavily on the vocabulary.** Map every token to a single UNK and perplexity is perfect while the generation system is terrible.
- **It doesn't allow comparisons across datasets.**
- **Even comparing models is tricky.** Tokenization, datasets, and other conditions must all match.

### Word error rate

WER is the edit distance between the prediction and the reference divided by the reference length. At the corpus level, it's the sum of distances over the sum of lengths. The range is [0, ∞], with 0 best. It's really a family of metrics, depending on which distance function you pick. Its weaknesses: it takes only one reference text, and it is very syntactic. It was good, It was not good, and It was great are all about equally far apart, even though the first and third mean nearly the same thing.

### BLEU

BLEU tries to handle the fact that one input can have many suitable outputs. It has two parts:

- **Modified n-gram precision.** Slide 37's example is the candidate "the the the the the the the" against two references, "the cat is on the mat" and "there is a cat on the mat." The candidate has 7 instances of *the*; the most *the* appears in any single reference is 2, so the score is 2/7.
- **Brevity penalty.** Candidates that are too short get penalized, standing in for recall.

BLEU = BP × a weighted combination of modified n-gram precisions across n. The range is [0, 1], but nobody expects any system to reach 1. Slide 38 lists the weaknesses: some work argues it correlates poorly with human judgments of translation (Callison-Burch et al. 2006); it's very sensitive to n-gram order; it's insensitive to n-gram type (*that dog*, *the dog*, and *that toaster* look alike to it); and some work argues specifically against using it for dialogue systems (Liu et al. 2016).

### Other reference-based, reference-free, and task-oriented metrics

Slide 39's comparison:

| Metric | Approach |
|---|---|
| WER | Edit distance from a single reference |
| BLEU | Modified precision + brevity penalty, against many references |
| ROUGE | Recall-focused BLEU variant, mainly for summarization |
| METEOR | Unigram alignments with exact match, stemming, and synonyms |
| CIDEr | Weighted cosine similarity between TF-IDF vectors |
| BERTScore | Weighted MaxSim over token-level BERT representations |

Video 41 adds that BERTScore's scoring looks a lot like ColBERT from the [information retrieval post](/posts/ai/2026-09-29-cs224u-information-retrieval-en).

For image description tasks there are reference-free metrics like CLIPScore, UMIC, and SPURTS, which score text–image pairs directly. Potts's group criticizes them in Kreiss et al. 2022 for ignoring the context the image appears in and the purpose of the text.

Last come **task-oriented metrics** (slide 41). Off-the-shelf reference-based metrics only capture what the reference annotations capture. Instead, ask what the generated text is supposed to achieve. Can an agent that receives it use it to solve the task? Was a specific piece of information reliably communicated? Did the message lead the person to take the action you wanted?

**What to do**: if your generation task already uses BLEU or ROUGE, pick 20 outputs, write down for each one what it's supposed to let the reader do, and then check whether the high-scoring ones actually do it.

## Scheduled reading: Resnik and Lin 2010

The schedule lists Resnik and Lin as the reading for this unit. It is chapter 11, *Evaluation of NLP Systems*, in an NLP volume. The old URL on the schedule (`www.cs.colorado.edu`) returned 404 when I checked on 2026-09-29; the same path on `home.cs.colorado.edu` works, so that's the link I use here.

The chapter organizes the unit's intuitions into a few pairs of concepts:

- **Intrinsic vs. extrinsic evaluation**: judging output directly against predefined criteria, or judging its effect on an external task. For summarization, the first asks whether a summary reads fluently and covers the key ideas. The second asks how accurately and quickly users can judge document relevance from the summary compared with the full document.
- **Formative vs. summative evaluation**
- **Inter-annotator agreement and upper bounds**
- **The role of baselines**: similar to a control condition in an experiment.

It pairs well with the task-oriented metrics section of the slides.

## Hands-on: evaluation_metrics.ipynb

The notebook's version string is "CS224u, Stanford, Spring 2023," and Potts is the author. It imports only NLTK (edit distance and BLEU), scikit-learn, NumPy, pandas, SciPy, and the repo's own `utils`, and it **doesn't download any datasets**. That makes it one of the easiest notebooks in the repo to run today.

Its structure mirrors the slides. Each metric follows a fixed format: definition, bounds, value encoded, weaknesses, and a sklearn or NLTK implementation. At the end it points to scikit-learn's [model evaluation guide](https://scikit-learn.org/stable/modules/model_evaluation.html) for clustering, ranking, inter-annotator agreement, and other metrics the notebook doesn't cover.

## What this post can and can't confirm

Confirmed: the schedule, slides 1–41, videos 39–41, the notebook, and the grading language in projects.md. The 0.81 weighted F1 is my own calculation from the slide's formula and numbers; the slides don't print the final value. Not confirmed: what Quiz 4 contains (Canvas requires a login) and the content of Kawin Ethayarajh's guest lecture "Real-world NLP assessments" in the same unit, which has no slide link on the schedule and no video in the playlist.

Further reading: the site's [CS224N benchmark and evaluation guide](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en) covers benchmark design in the LLM era and makes a good next read.

Series navigation: previous, [Analysis Methods II: causal abstraction, IIT, and DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das-en) | next, [Methods and Metrics II: datasets, data organization, and model comparison](/posts/ai/2026-09-29-cs224u-datasets-model-evaluation-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked video IDs and lecture numbers against the official playlist; they are correct, and video titles now use the original titles.

## References

- [CS224U: Natural Language Understanding (Spring 2023 course site and schedule)](https://web.stanford.edu/class/cs224u/)
- [Methods and metrics slides (Potts, 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-methods-2023-handout.pdf)
- [Video 39: NLP Methods and Metrics, Part 1: Overview](https://www.youtube.com/watch?v=ORg6bZ3d1Rc)
- [Video 40: Part 2: Classifier Metrics](https://www.youtube.com/watch?v=mbL4uUNtZwY)
- [Video 41: Part 3: Generation Metrics](https://www.youtube.com/watch?v=DXz4IeOENiM)
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [evaluation_metrics.ipynb (cgpotts/cs224u)](https://github.com/cgpotts/cs224u/blob/main/evaluation_metrics.ipynb)
- [dynascoring.ipynb (cgpotts/cs224u)](https://github.com/cgpotts/cs224u/blob/main/dynascoring.ipynb)
- [projects.md: Experimental protocol and grading guidelines](https://github.com/cgpotts/cs224u/blob/main/projects.md)
- [Resnik and Lin 2010: Evaluation of NLP Systems](https://home.cs.colorado.edu/~jbg/teaching/CMSC_773_2012/reading/evaluation.pdf)
- [scikit-learn: Metrics and scoring (model evaluation)](https://scikit-learn.org/stable/modules/model_evaluation.html)
