---
title: "CS224U Compositional Generalization: COGS, ReCOGS, and Assignment 3"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, semantic-parsing, benchmark]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 10
tldr: "A few COGS generalization splits score 0 for nearly every model. CS224U uses its own ReCOGS work to explain why: the zeros on the recursion splits are mostly a length-generalization problem, and the zeros on the prepositional-phrase split come from training data that only ever put PPs in certain variables and positions. Assignment 3, hw_recogs.ipynb, uses 135K ReCOGS training pairs. It first has you find Charlie and Lina, two names whose train and test roles are exact opposites, then shows a trained model stumbling on them."
description: "A guide to compositional generalization in Stanford CS224U (Spring 2023): the compositionality principle and systematicity, four conventions of COGS logical forms, how ReCOGS breaks the all-zero structural splits down into length and distribution problems, its three modifications, and Assignment 3's five questions, points, single rule, and required resources. No solutions."
draft: false
glossary:
  - term: "COGS"
    definition: "A compositional generalization benchmark from Kim & Linzen 2020: map synthetic English sentences to event-semantics logical forms, with 21 categories of generalization splits that test whether models can interpret novel combinations of familiar elements."
    context: "The starting point for CS224U's behavioral evaluation unit and Assignment 3."
  - term: "ReCOGS"
    definition: "Wu, Manning & Potts's 2023 rework of COGS: remove redundant tokens, add meaning-preserving data augmentation, and name variables arbitrarily, so evaluation gets closer to meaning itself."
    context: "The dataset for CS224U Assignment 3."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3)

> **Version note**: This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/), the last on-campus version with a fully public site. The main materials are the Compositionality and (Re)COGS sections of the [Advanced behavioral evaluation slides](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf), the [Assignment 3 overview slides](https://web.stanford.edu/class/cs224u/slides/cs224u-hw3-overview-2023.pdf), [hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb), and screencasts 24, 27, and 28 of the [XCS224U playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp). The notebook in the repo today carries the version string Spring 2024; I note where it differs from 2023. Every fact was checked against official materials on 2026-09-29. Access grade **A3**: the questions, data, trained model, unit tests, and screencasts are all public. What you can't get is the Gradescope autograder and the bake-off leaderboard.

**Series**: previous [Behavioral evaluation](/posts/ai/2026-09-29-cs224u-behavioral-evaluation-en) | next [Analysis methods I: probing and feature attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en) | [Series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)

The [previous post](/posts/ai/2026-09-29-cs224u-behavioral-evaluation-en) ended on an open question: what counts as a fair non-IID generalization test? This one answers it with a concrete benchmark.

The [series overview](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) already reproduced the COGS results table, whose headline is that the structural columns are almost all zeros. I won't repeat the numbers. This post covers where those zeros came from, how ReCOGS takes them apart, and what Assignment 3 asks you to do.

## Course video sources

The videos below are the recordings linked for the topics covered in this article.

```youtube
url: https://www.youtube.com/watch?v=g5zwxUqBzN8
title: Screencast 27: Compositionality
```

```youtube
url: https://www.youtube.com/watch?v=tOh-1GYaDl8
title: Screencast 28: COGS and ReCOGS
```

Original videos: [Screencast 27: Compositionality](https://www.youtube.com/watch?v=g5zwxUqBzN8)、[Screencast 28: COGS and ReCOGS](https://www.youtube.com/watch?v=tOh-1GYaDl8)、[Screencast 24: Homework 3 overview (XCS224U, Spring 2023)](https://www.youtube.com/watch?v=e73Ch08XhX0)

Course and recording entries:

- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [Official course / lecture source](https://web.stanford.edu/class/cs224u/)

## What compositionality is and why test it

[Screencast 27](https://www.youtube.com/watch?v=g5zwxUqBzN8) opens with an informal statement of the principle:

> The meaning of a phrase is a function of the meanings of its immediate syntactic constituents and the way they are combined.

Take "every student admired the idea." The sentence's meaning is determined by its subject NP and its VP; the NP's meaning is determined by the determiner and the noun, and so on down to the words. Learn the words and how they combine, and you can understand combinations you've never seen.

The slides list four motivations: modeling all meaningful units, "infinite" capacity, creativity, and systematicity. In the screencast Potts discounts "infinite": we're all finite beings. He thinks the real intuition is closer to creativity, since most sentences you say today have never been said before in human history.

**Systematicity** comes from Fodor & Pylyshyn 1988: the ability to understand "Sandy loves the puppy" is intrinsically connected to the ability to understand "The puppy loves Sandy." Potts considers systematicity more general than compositionality, and it's the intuition behind many challenge tests.

The slides include a counterexample from one of his own sentiment models:

| Sentence | Gold | Prediction |
|---|---|---|
| The bakery sells a mean apple pie. | pos | pos |
| They sell a mean apple pie. | pos | pos |
| She sells a mean apple pie. | pos | neg |
| He sells a mean apple pie. | pos | neg |

Here mean means excellent. What worried him wasn't the two errors. It was that switching from a plural to a singular pronoun, which shouldn't affect how mean is read, flipped the prediction. That's a lack of systematicity.

The screencast closes with history. Early systems like SHRDLU and Chat-80 were implemented symbolic grammars, so compositionality came by design. Percy Liang's semantic parsers learned weights on the rules of a compositional grammar. Socher's recursive tree-structured networks weren't symbolic, but they still combined vectors node by node up the parse tree. Today's Transformers connect everything to everything, with **no compositionality guarantee at all**. The question becomes whether behavioral tests can tell us if these models found systematic solutions on their own.

## COGS: the task and four conventions of its logical forms

In [COGS (Kim & Linzen 2020)](https://aclanthology.org/2020.emnlp-main.731/), inputs are synthetic English sentences and outputs are event-semantics logical forms (LFs). The slides' example:

```text
Input:  A rose was helped by a dog .
Output: rose ( x _ 1 ) AND help . theme ( x _ 3 , x _ 1 )
        AND help . agent ( x _ 3 , x _ 6 ) AND dog ( x _ 6 )
```

[Screencast 28](https://www.youtube.com/watch?v=tOh-1GYaDl8) says certain features of COGS LFs explain the pattern of results in the literature. The slides list four:

1. Verbs specify primitive events with obligatory or optional roles (agent, theme, and so on).
2. **Variable numbering is determined by linear position in the input sentence.** `x _ 3` is 3 because helped is the third word.
3. All variables are bound; apparently free ones are existentially bound with widest scope.
4. Definite descriptions are marked with `*`.

Number 2 is the crux. The screencast says it seriously affects modern models, especially ones with positional encoding.

The COGS splits: 24,000 training examples plus 155 primitives, 10,000 dev, 10,000 test, and 21,000 generalization examples in 21 categories. Dev and test are IID; the generalization splits are the interesting part. The screencast walks through several categories: nouns moving from subject to other positions, primitives seen only in isolation appearing in full sentences, modifiers moving from object to subject position, deeper recursion, active/passive alternation, and more.

## How ReCOGS takes the zeros apart

The [ReCOGS (Wu, Manning & Potts 2023)](https://arxiv.org/abs/2303.13716) abstract states its position plainly:

> COGS poses generalization splits that appear impossible for present-day models, which could be taken as an indictment of those models. However, we show that the negative results trace to incidental features of COGS LFs.

The slides break the analysis into three steps.

**Step one: remove redundant tokens.** Every variable begins with `x _`; only the numeral distinguishes it. Rewriting `kitten ( x _ 1 )` as `kitten ( 1 )` changes nothing semantically. The screencast explains why it matters using bigram frequencies. In COGS, the most common bigram by far is ", x". After removal, Emma, the most frequent proper name, is about as common as the variables, and the distribution evens out. Language models lean heavily on local conditional probabilities, so this is friendlier to them. But this step mainly helps lexical generalization; it does little for the stubborn structural splits.

**Step two: the zeros on CP and PP recursion are really about length.** Sentences and LFs in the generalization splits are far longer than in training, with a long tail. At test time a model meets positions it never trained on, and variable names it never saw: if training topped out at variable 45 and the test uses 46, that token's embedding was never trained. Potts says pushing models toward length generalization is perfectly reasonable, but the goal here was to test recursion, and the two got tangled. ReCOGS concatenates existing examples and renumbers them under the COGS protocol, so training covers the variable names seen at test time. That essentially overcomes the split for both LSTMs and Transformers. The screencast's conclusion: the hard part of this split isn't recursion, it's length generalization.

**Step three: the zeros on PP modifiers come from what the training distribution taught.** The slides state the hypothesis:

> The train data teach the model that PPs occur only with a specific set of variables and positions. When models learn this lesson, they struggle with examples that contradict it.

To test it, they used meaning-preserving tricks to put PPs in more positions: preposing the object ("The box in the tent Emma was lent"), inserting filled pauses like "um" at random points, and using participial modifiers ("A leaf painting the spaceship froze"). Both LSTMs and Transformers improved sharply.

Finally, ReCOGS makes three modifications: redundant token removal, meaning-preserving data augmentation, and **arbitrary variable renaming** (variables are no longer tied to input position; they're assigned randomly in a semantically consistent way). Here's "The sailor saw Emma" in both formats:

```text
ReCOGS: * sailor ( 48 ) ; Emma ( 53 ) ; see ( 10 ) AND
        agent ( 10 , 48 ) AND theme ( 10 , 53 )
COGS:   * sailor ( x _ 1 ) ; see . agent ( x _ 2 , x _ 1 ) AND
        see . theme ( x _ 2 , Emma )
```

The screencast stresses that ReCOGS is **not necessarily easier**; in their experiments some aspects looked harder than COGS. What it does is even out performance between lexical and structural generalization, so the previously immovable structural splits can be moved. The slides' phrase is that ReCOGS remains challenging.

### Four conceptual questions still open

The last slide of the (Re)COGS section lists four questions:

1. How can we test for meaning if we're predicting logical forms? The screencast notes that LFs are just more syntax, always carrying some arbitrariness.
2. What's a fair generalization test here? Models see a world with specific restrictions. Some we want them **not** to learn, others we do, and deciding which category a phenomenon falls into is hard.
3. What are the limits of compositionality for humans, and how should that shape generalization tests?
4. If our goals go beyond what our datasets support, how do we express them in tasks and models?

These tie straight back to the "unfair tasks" in the [previous post](/posts/ai/2026-09-29-cs224u-behavioral-evaluation-en).

## Assignment 3: hw_recogs.ipynb

The 2023 schedule put the Assignment 3 overview on April 26, the same day as the behavioral evaluation lecture. The assignment, bake-off, and Quiz 3 were due May 8 at 3:00 pm Pacific.

The data is ReCOGS, with these splits per the overview slides:

- Train: 135,546 input/output pairs
- Dev: 3,000 pairs, same distribution as train
- Gen: 21,000 examples in 21 categories, all novel combinations of familiar elements

Gen category names follow a pattern: `X_to_Y` or `only_seen_as_X_as_Y` means certain phrases appeared only as X in training and appear as Y at test time.

The whole assignment has one rule, stated at the top of the notebook and again in the original-system question:

> You cannot train your system on any examples from `dataset["gen"]`, nor can the output representations from those examples be included in any prompts used for in-context learning.

### Questions and points

| Question | Content | Points |
|---|---|---|
| Q1 Task 1 | `get_propername_role`: extract (name, role) pairs from an LF | 1 |
| Q1 Task 2 | `find_name_roles`: count which roles each name plays in a split | 1 |
| Q2 | `category_assess`: evaluate a trained model on one generalization category | 2 |
| Q3 | In-context learning with DSPy (Task 1 basic module, Task 2 `LabeledFewShot`) | 2 |
| Q4 | Original system | 3 |
| Q5 | Bake-off entry | 1 |

**Q1 is pure data analysis, no model training.** The overview slides give the spoiler outright: Charlie is only a theme in train and only an agent in gen; Lina is only an agent in train and only a theme in gen.

**Before Q2 comes a long modeling interlude.** The notebook gives you all six pieces needed to train a ReCOGS model: a Hugging Face tokenizer, a PyTorch Dataset, `EncoderDecoderModel.from_pretrained("ReCOGS/ReCOGS-model")`, `RecogsLoss`, `RecogsModule`, and `RecogsModel`. If you aren't training your own model, treat the last one as an interface and skip the rest. In [screencast 24](https://www.youtube.com/watch?v=e73Ch08XhX0), Potts says the tokenizer was meant to be a homework question, but writing it was so painful for him that he decided to just provide it.

Q2 uses this trained model to continue the Q1 analysis, and you see for yourself that a very good model makes most of its mistakes on exactly the names that appear in unfamiliar positions.

Q2's scoring function, `recogs_exact_match`, follows three rules, each with an example in the notebook:

- Names of bound variables don't matter: `dog ( 4 ) AND happy ( 4 )` equals `dog ( 7 ) AND happy ( 7 )`
- Conjunct order doesn't matter: `dog ( 4 ) AND happy ( 4 )` equals `happy ( 7 ) AND dog ( 7 )`
- Consistency of variable names does matter: `dog ( 4 ) AND happy ( 4 )` does not equal `dog ( 4 ) AND happy ( 7 )`

**Q3 switches to in-context learning.** The screencast warns that large language models produce LFs that look plausible at a glance, yet the evaluation can score them 0. The task demands exact correctness; "roughly right" doesn't count.

**Q4, the original system**: the overview slides suggest a DSPy program, further training of the course model, fine-tuning a pretrained model, training from scratch, or even a symbolic solver. The notebook includes T5 starter code; the screencast notes that T5 used directly will translate your sentences into German, so it needs fine-tuning on ReCOGS first.

**Q5, the bake-off**: add a `prediction` column to `cs224u-recogs-test-unlabeled.tsv`, save it as `cs224u-recogs-bakeoff-entry.tsv`, and upload.

### 2023 versus the current repo version

The question structure and points are the same in both. The difference is the tool in Q3. A [June 2023 snapshot of the notebook](https://github.com/cgpotts/cs224u/blob/89bdd14820b5/hw_recogs.ipynb) uses DSP: you write a `@dsp.transformation` function, `recogs_dsp`, that samples demonstrations and applies a template yourself. After a 2024-01-28 commit titled "Updating to switch from DSP to DSPy," Q3 asks for a `dspy.Module` plus `LabeledFewShot`.

### Required resources

- **Data**: [recogs.tgz](https://web.stanford.edu/class/cs224u/data/recogs.tgz), HTTP 200 on 2026-09-29, 7,075,025 bytes.
- **Model**: [ReCOGS/ReCOGS-model](https://huggingface.co/ReCOGS/ReCOGS-model) is public and ungated on Hugging Face, last modified 2023-04-18.
- **Compute**: Q1 needs only pandas and regular expressions. For Q2, predicting one generalization category took about 3 minutes on a relatively new Apple laptop, per a notebook comment; Colab varies with the instance.
- **API**: only Q3 needs one. The current version defaults to `dspy.OpenAI(model='gpt-3.5-turbo', ...)`, so you need an OpenAI key, and the `dspy-ai==2.4.13` pin applies here too (DSPy 3.x no longer has `dspy.OpenAI`; see the [Assignment 2 post](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy-en)).

## How to self-study it

1. Watch screencasts 27 and 28 before the assignment. Q1 and Q2's "discovery" is a scaled-down version of the ReCOGS argument; understand the argument first, and the assignment becomes more than regex practice.
2. After Q1, print Charlie's and Lina's role distributions and decide for yourself: is this a fair generalization test? Compare with conceptual question 2 above.
3. If your original system goes the DSPy route, check the output format against 10 dev examples with `recogs_exact_match` and make sure you're not at 0 before going further.

One thing to do tonight: download the 7 MB recogs.tgz, load `train.tsv` and `gen.tsv` with pandas, and count which roles Charlie plays in each file. No GPU, no API key, and before writing any model you'll see what this benchmark is really testing.

## Further reading

- The COGS results table and course status: [Stanford CS224U (series overview)](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en)
- General principles of evaluation design: [CS224N Lecture 11: Why LLM Benchmarks Expire](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224U course site (Spring 2023)](https://web.stanford.edu/class/cs224u/) — the April 26 session, Assignment 3 deadline, COGS and ReCOGS readings
- [Advanced behavioral evaluation slides (Spring 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) — the compositionality definition, the mean apple pie example, the four COGS LF conventions and splits, the three-step ReCOGS analysis, the four conceptual questions
- [Assignment 3 overview slides (Spring 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-hw3-overview-2023.pdf) — ReCOGS split sizes, gen category examples, the Charlie and Lina spoiler, the six-piece modeling interlude, original-system ideas
- [Screencast 24: Homework 3 overview (XCS224U, Spring 2023)](https://www.youtube.com/watch?v=e73Ch08XhX0) — question-by-question walkthrough, the three `recogs_exact_match` rules, the warning about LLMs scoring 0
- [Screencast 27: Compositionality](https://www.youtube.com/watch?v=g5zwxUqBzN8) — the principle, systematicity, historical review
- [Screencast 28: COGS and ReCOGS](https://www.youtube.com/watch?v=tOh-1GYaDl8) — bigram frequencies, decoupling length from depth, the PP-modifier hypothesis, conceptual questions
- [hw_recogs.ipynb (current repo version)](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb) — questions, points, the single rule, resource needs
- [hw_recogs.ipynb (June 2023 DSP snapshot)](https://github.com/cgpotts/cs224u/blob/89bdd14820b5/hw_recogs.ipynb) — how Q3 was written in Spring 2023
- [Commit history of hw_recogs.ipynb](https://github.com/cgpotts/cs224u/commits/main/hw_recogs.ipynb) — the 2023-04-22 first version and the 2024-01-28 rewrite
- [ReCOGS data recogs.tgz](https://web.stanford.edu/class/cs224u/data/recogs.tgz) — still downloadable on 2026-09-29
- [ReCOGS/ReCOGS-model (Hugging Face)](https://huggingface.co/ReCOGS/ReCOGS-model) — the trained model the assignment provides
- [Kim & Linzen, COGS: A Compositional Generalization Challenge Based on Semantic Interpretation (EMNLP 2020)](https://aclanthology.org/2020.emnlp-main.731/)
- [Wu, Manning & Potts, ReCOGS (arXiv:2303.13716)](https://arxiv.org/abs/2303.13716) — the abstract quoted above
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — the public screencasts this series follows
