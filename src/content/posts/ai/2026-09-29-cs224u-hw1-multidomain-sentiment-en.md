---
title: "CS224U Homework 1: Multi-Domain Sentiment and the Bake-Off"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, homework, fine-tuning]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 5
tldr: "CS224U's first assignment, hw_sentiment.ipynb, is ternary sentiment classification: you develop on two rounds of DynaSent plus SST-3, and the bake-off test set mixes in mystery sentences from undisclosed sources. The original-system question is worth 3 of the 9 homework points, and it has exactly one rule: never touch the three public test sets during development. Run as-is today, the first data-loading cell breaks because Hugging Face datasets 4.0 dropped trust_remote_code."
description: "A guide to Stanford CS224U (Spring 2023) Homework 1: the four questions in hw_sentiment.ipynb and their points, the roles of DynaSent and SST-3, the bake-off test set and its honor code, how the policies page grades the original system, the compute you need, and the datasets compatibility problem a self-learner hits in 2026. No solutions."
draft: false
glossary:
  - term: "bake-off"
    aliases: ["bakeoff"]
    definition: "The class-wide competition attached to each CS224U assignment: everyone runs their original system on the same unlabeled test file, and the teaching team scores and ranks the entries."
    context: "The Homework 1 bake-off file has 3,000 sentences; entering is itself worth 1 point."
  - term: "macro-F1"
    aliases: ["macro-average F1", "macro avg F1"]
    definition: "Compute F1 separately for each class, then take the plain average, ignoring how many examples each class has."
    context: "The notebook says this is the course's default metric because small classes matter as much as large ones in NLP; it discourages accuracy."
  - term: "DynaSent"
    definition: "An English ternary (positive/negative/neutral) sentiment benchmark built by Potts and colleagues in two rounds, with every sentence validated by five crowdworkers."
    context: "The main training and development data for Homework 1."
    links:
      - label: "DynaSent (ACL 2021)"
        url: "https://aclanthology.org/2021.acl-long.186/"
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-hw1-multidomain-sentiment)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Spring 2023 edition of [CS224U](https://web.stanford.edu/class/cs224u/), the last fully public on-campus version. The assignment notebook is still in the [GitHub repo](https://github.com/cgpotts/cs224u); every fact was checked against the official materials on 2026-09-29. Access grade **A3**: the questions, data, unit tests, original-system rules, and overview video are all public, which is enough to self-study. What you can't get is the Gradescope autograder, the bake-off leaderboard, and the teaching team's results report.

**Series**: Previous: [Contextual Representations II: Model Families](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en) | Next: [Information Retrieval](/posts/ai/2026-09-29-cs224u-information-retrieval-en) | [Series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)

The previous two posts covered the Transformer and its model families. This one puts that material into an assignment you actually hand in. [hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) asks for ternary sentiment classification (positive, negative, neutral), and its first paragraph states the goal: build systems that make accurate predictions **across multiple domains**.

It is also the template for every assignment in the course. At the start of the [Homework 1 overview video](https://www.youtube.com/watch?v=PzvvtyK0QOk), Potts says the later assignments follow the same rhythm and philosophy. Understanding this one's structure pays off.

This post covers the question structure, the points, the resources you need, and where the notebook breaks if you run it unchanged today. **It gives no solutions.**

## Course video sources

The videos below are the recordings linked for the topics covered in this article.

```youtube
url: https://www.youtube.com/watch?v=PzvvtyK0QOk
title: Homework 1 overview video (XCS224U, Spring 2023)
```

Original videos: [Homework 1 overview video (XCS224U, Spring 2023)](https://www.youtube.com/watch?v=PzvvtyK0QOk)

Course and recording entries:

- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## Where it sits in the course

The 2023 schedule puts Homework 1 under the first unit, "Domain adaptation for supervised sentiment." The April 5 session lists "Overview of Assign/bakeoff 1," but that item has **no slide link**; the only public material is the overview video on YouTube. The homework and bake-off were due April 17 at 3:00 pm, alongside Quiz 0 and Quiz 1 (on Canvas, not available outside Stanford).

The unit's readings include the two dataset papers the homework depends on: [SST (Socher et al. 2013)](https://aclanthology.org/D13-1170/) and [DynaSent (Potts, Wu et al.)](https://aclanthology.org/2021.acl-long.186/).

If scikit-learn, PyTorch, or supervised sentiment analysis is new to you, the overview video points you to the course's background materials first. Those live on the [Background materials page](https://web.stanford.edu/class/cs224u/background.html): material CS224N already teaches and CS224U no longer lectures on, including the `sst_*` notebooks.

## Three development datasets, one unseen test

The notebook gives you three datasets for training and development:

| Dataset | Source | How the notebook describes it |
|---|---|---|
| DynaSent Round 1 | Naturally occurring sentences from the [Yelp Academic Dataset](https://www.yelp.com/dataset) | Sentences that fooled a top-performing sentiment model but were intuitive for humans; the model was used only to find examples heuristically, and crowdworkers multiply-labeled all of them |
| DynaSent Round 2 | Collected on the [Dynabench](https://dynabench.org) platform | Crowdworkers edited Yelp sentences to hit a target sentiment while fooling a top model; separate annotators validated them |
| SST-3 | Rotten Tomatoes movie reviews | Originally five-way; the notebook loads `SetFit/sst5` from Hugging Face and converts it to three labels |

The DynaSent abstract gives 121,634 sentences in total, each validated by five crowdworkers, with dev and test splits **designed to yield chance performance for the best models the authors had**. That is what "multi-domain" means here: restaurant reviews, adversarially rewritten sentences, and movie reviews are three different distributions of the same task.

The notebook flags one property of SST: it has **phrase-level** as well as sentence-level labels. The homework uses only sentence labels, but your original system may use the phrase labels, provided you get the raw data from the [SST project page](http://nlp.stanford.edu/sentiment/); the Hugging Face version doesn't include them.

The bake-off test set has three parts: DynaSent test sentences, SST-3 test sentences, and a batch of **mystery sentences whose origin you aren't told**. The bake-off file ([cs224u-sentiment-test-unlabeled.csv](https://web.stanford.edu/class/cs224u/data/cs224u-sentiment-test-unlabeled.csv)) was still downloadable on 2026-09-29. It has two columns, `example_id` and `sentence`, and 3,000 rows.

### A rule held up by an honor code

The DynaSent and SST-3 test sets have long been public; anyone can get the labels. The notebook has a bolded methodological note: do all development without the test sets, evaluate on them exactly **once**, turn in the results, and do no further tuning or reruns.

In the video, Potts is blunter: doing any model selection on the test set is "a sin" in the field. The course can keep the mystery sentences secret, but for the public test sets it can only rely on students' integrity. The same rule reappears, word for word, in the original-system question.

## Question structure and points

Four questions, adding up to 9 homework points plus 1 point for entering the bake-off:

| Question | What you do | Points |
|---|---|---|
| Q1 Linear classifiers | Task 1: a feature function using NLTK's `TweetTokenizer`; Task 2: complete `train_linear_model`; Task 3: complete `assess_linear_model` | 1 each |
| Q2 Transformer fine-tuning | Task 1: batch tokenization with the tokenizer; Task 2: extract the final hidden state above [CLS]; Task 3: complete an `nn.Module` for fine-tuning | 1 each |
| Q3 Your original system | Design your own ternary sentiment model | 3 |
| Q4 Bakeoff entry | Run your original system on the bake-off file, add a `prediction` column, upload | 1 |

A few design choices worth knowing before you start:

**Every question has a unit test.** Potts says in the video that this holds for every assignment in the course. It's hard to specify code unambiguously in English, so the course defines each task by its tests: pass the test and you've completed the task as the course defines it, and the autograder will agree.

**Q1 and Q2 open with background sections.** Q1 has four (feature functions, `DictVectorizer` vectorization, scikit-learn models, classifier assessment); Q2 has three (tokenization, representation, masking). The video recommends working through them first, however experienced you are. The tasks are deliberately easy; the point is to leave you with helper functions you'll reuse when building your original system.

**The course default metric is macro-F1.** The notebook's reason: in NLP, small classes often matter as much as large ones, or more. It explicitly discourages accuracy, including the `score` method on scikit-learn classifiers, which defaults to accuracy.

**Q2 uses BERT-mini.** The weights are [`prajjwal1/bert-mini`](https://huggingface.co/prajjwal1/bert-mini) on Hugging Face, with 256-dimensional token representations. The notebook's idea is to prototype quickly on a small model, then consider scaling up.

## What the original-system question actually grades

Q3 is the heaviest question, and its structure is shared by all three assignments. The notebook suggests four directions: swap in another pretrained model from Hugging Face; change the fine-tuning setup (for example, pool over all output states instead of using [CLS]); train on all three training sets or add other sentiment data; or take an entirely different approach.

There is one rule, in bold: **you may not use the DynaSent-R1, DynaSent-R2, or SST-3 test sets at any point during development**. Dev sets are fine, and encouraged.

The grading criteria are on the [policies page](https://web.stanford.edu/class/cs224u/requirements.html):

- Downloading code from the web, retraining, and submitting is not original, **even if it produces an outstanding bake-off score**. You can build on others' code, but you have to do something new and meaningful with it.
- Very creative, well-motivated systems get full credit even if they perform poorly on the bake-off data.
- Other systems get partial credit at the teaching team's judgment, with deductions explained in feedback.

The video adds a practical detail. Your system description and code go between the `START COMMENT` and `STOP COMMENT` lines in a designated cell, and you must not edit those two lines. The autograder uses them to skip your code (it doesn't have your libraries), so code placed elsewhere can make the whole grading run fail.

The written description isn't a formality either. Potts says that if you tried many directions and ended up with a simple-looking system, **writing them down is the only way to get credit for that exploration**.

Bake-off scoring is at the end of the notebook: entering earns 1 point, and the top system earns another 0.5. The teaching team reruns the top systems itself, and **results it can't reproduce don't get the bonus**. Late entries are accepted but can't earn the bonus. The notebook also forbids tuning your system on the bake-off file's contents; at most you may check that the file looks as expected.

## Compute requirements

| Part | Requirement |
|---|---|
| Q1 | CPU only. The notebook says a unigram logistic-regression model on DynaSent R1 should train within a couple of minutes on a CPU |
| Q2's three tasks | Load BERT-mini, write functions, pass the unit tests; no actual model training required |
| Optional classifier-interface training demo | The notebook says **not to run it on CPU**; on Colab with a GPU it takes about an hour |
| Q3 original system | Depends on your approach |

No paid API is needed. That's a difference from Homework 2, which needs an OpenAI API key and a ColBERT index; see the [series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en).

## Where self-study breaks in 2026

**The first data-loading cell may fail.** The notebook loads both DynaSent rounds with `load_dataset("dynabench/dynasent", ..., trust_remote_code=True)`. As of 2026-09-29, the `dynabench/dynasent` repo on Hugging Face still contains only a loading script, `dynasent.py` (last modified 2021-04-29), and no parquet version; its [parquet endpoint](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) still answers that the dataset "runs arbitrary Python code." The [datasets 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) say `trust_remote_code` is no longer supported.

The repo's [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) pins `datasets` only as `>=2.14.6`, with no upper bound, so a fresh environment gets the latest version. The full trail of evidence is in the "What a self-learner can actually get" section of the [series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en); I won't repeat it here.

Two workarounds, **neither of which I have run**:

1. Downgrade `datasets` to a pre-4.0 release.
2. Skip Hugging Face. The DynaSent authors' [GitHub repo](https://github.com/cgpotts/dynasent) ships `dynasent-v1.1.zip`, and its README lists train/dev/test JSONL files for each round. If you use these, you'll need to map the fields to the `sentence` and `gold_label` keys the notebook expects.

The SST side looks lower-risk: `SetFit/sst5` on the Hub is plain data files (`train.jsonl`, `dev.jsonl`, `test.jsonl`) with no loading script. The dataset itself doesn't need remote code; the notebook still passes `trust_remote_code=True` to it, and I haven't tested how newer `datasets` versions handle that argument.

**The version string matches the website.** This notebook says `CS224u, Stanford, Spring 2023`, the same term as the course site (the other two assignments don't match; see the overview's appendix).

**What you can't get**: the Gradescope autograder, the bake-off leaderboard, and the report Potts mentions at the end of the video, where the teaching team reflects on what everyone tried and what worked. He calls it the most informative part of the whole exercise, but it isn't public.

## How to self-study it

1. Fix data loading first (pick one of the two routes above) and confirm the label distributions print for all three datasets.
2. Treat the three **dev sets** as your evaluation benchmark and never open the test sets. You won't get answers for the bake-off's mystery sentences, so this is the only way to approximate an unseen distribution.
3. Work through the Q1 and Q2 background sections and tasks in order, using the unit tests to confirm each one.
4. Before building your original system, write down a one-sentence hypothesis (for example, "mean pooling over all output states beats using only [CLS]"). That's what the policies page actually grades, and it's the habit the final-project guide, [projects.md](https://github.com/cgpotts/cs224u/blob/main/projects.md), asks for later.

One thing to do tonight: open the notebook, read only the four directions in Question 3, pick one, and write it as a hypothesis your dev sets could refute.

## Further reading

- Course status, all three assignments, and environment pitfalls: [Reading Stanford CS224U (series overview)](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)
- Pretraining and fine-tuning basics: [CS224N Lecture 7: Pretraining, Subwords, and In-Context Learning](/posts/ai/2026-08-22-cs224n-pretraining-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224U course site (Spring 2023)](https://web.stanford.edu/class/cs224u/) — schedule, Homework 1 deadline, unit readings
- [hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) — questions, points, data loading, original-system and bake-off rules
- [Homework 1 overview video (XCS224U, Spring 2023)](https://www.youtube.com/watch?v=PzvvtyK0QOk) — unit tests, the START/STOP cell, why the written description matters
- [CS224U Policies and requirements](https://web.stanford.edu/class/cs224u/requirements.html) — grading criteria for original systems
- [CS224U Background materials](https://web.stanford.edu/class/cs224u/background.html) — background on scikit-learn, PyTorch, and supervised sentiment
- [Potts, Wu, Geiger & Kiela, DynaSent: A Dynamic Benchmark for Sentiment Analysis (ACL 2021)](https://aclanthology.org/2021.acl-long.186/) — dataset size, five-way validation, chance-performance splits
- [cgpotts/dynasent GitHub repo](https://github.com/cgpotts/dynasent) — `dynasent-v1.1.zip` and the JSONL file list
- [Socher et al., Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank (EMNLP 2013)](https://aclanthology.org/D13-1170/) — the original SST paper
- [Stanford Sentiment Treebank project page](http://nlp.stanford.edu/sentiment/) — raw data with phrase-level labels
- [Bake-off test file cs224u-sentiment-test-unlabeled.csv](https://web.stanford.edu/class/cs224u/data/cs224u-sentiment-test-unlabeled.csv) — still downloadable on 2026-09-29, 3,000 rows
- [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) — `datasets>=2.14.6` with no upper bound
- [Hugging Face datasets 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) — `trust_remote_code` no longer supported
- [Hugging Face API: dynabench/dynasent parquet endpoint](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) — evidence there is no parquet version
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — the public recordings this series follows
