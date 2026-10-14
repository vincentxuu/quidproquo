---
title: "Cross-Week Review (1): How the Ideas of Seven Weeks Connect and Replace One Another | Harvard CS50 AI Topic Guide"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, synthesis]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 8
tldr: "Three kinds of relationship you see when the seven weeks are put side by side: an idea that returns in later weeks (the Markov chain from Week 2 is used again in Weeks 4 and 6; the linear combination of weights from Week 4 becomes Week 5's unit); an earlier week's tool that a later week depends on; and the lectures teaching one method, saying where it falls short, and moving to the next. Includes three cross-week examples and four cross-week self-check questions."
description: "The first cross-week review in the Harvard CS50 AI series. It does not retell each week; it only lays out the relationships between weeks: which ideas recur, which week is a prerequisite for which, and which methods the lectures themselves replace, each linked to the relevant section of that week's guide. Three cross-week examples (three uses of one Markov chain, training Week 5's unit with Week 4's learning rule, from Bayes' rule to Naive Bayes) are worked to the end, followed by four cross-week self-check questions with answers. This post is this site's own review, not any week's lecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)

**Video status: Official entry or recording index only.** This post is this site's cross-week review, not any week's lecture, and there is no official video for it; each week's lecture recording and time links are in the weekly guides. [Source details](#course-video-sources)

> ⚠️ **Version note**: Of the lecture recordings in this series, Weeks 0–5 are titled **2020** and Week 6 is titled **2023**; project specs follow the 2026 course site.

## TL;DR

What each week covers is in the weekly guides. This post is only about the relationships between weeks, of three kinds:

- **An idea returns**: Week 2's Markov chain gains actions and rewards in Week 4 and becomes the Markov decision process, and in Week 6 it is used to generate text.
- **An earlier week is a prerequisite for a later one**: without Week 4's classifier that multiplies inputs by weights and applies a threshold, Week 5's unit has nothing to build on.
- **Methods replace one another**: the lectures often teach one method, say where it falls short, and teach the next.

How to tell the two kinds of content apart in this post: statements that say "the lecture" or "the lecturer" and carry a link are course content, and the link goes to the relevant section of that week's guide, where the time links into the recording are. Statements marked "this site's summary" or "made up for this post" are what this site worked out or invented after putting several weeks side by side; the course does not present them this way.

## The same idea returning in different weeks

In every item below, a later week uses something an earlier week taught. The pairing of weeks is this site's arrangement based on the weekly guides; where the lecturer says on the spot that something was covered before, the linked section says so.

**The format of a search problem (Week 0 → Week 3).** Week 0 writes a problem as five things: initial state, actions, transition model, goal test, path cost ([How a search problem is defined](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#how-a-search-problem-is-defined)). When Week 3 reaches constraint satisfaction problems, the lecturer first fits them into the same format: the initial state is the empty assignment, an action adds one "variable = value", and the goal test is that every variable is assigned and every constraint holds ([A CSP as a search problem](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#a-csp-as-a-search-problem-backtracking-search)). Earlier in the same week, local search is also introduced by contrast with Week 0's BFS and A\*: those algorithms keep many paths at once, while local search keeps a single state ([Optimization and local search](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#optimization-and-local-search-only-the-answer-matters-not-the-path)).

**Manhattan distance (Week 0 → Week 3).** Week 0 uses it as the heuristic for mazes ([greedy best-first search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#informed-search-greedy-best-first-search)); Week 3 uses it to measure the distance from houses to hospitals, summed up as the cost ([Optimization and local search](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#optimization-and-local-search-only-the-answer-matters-not-the-path)).

**The Markov chain (Week 2 → Week 4 → Week 6).** Week 2 uses a transition model to describe how the weather changes day by day ([Markov chains](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#markov-chains-a-state-that-changes-over-time)). Week 4's Markov decision process starts from it and adds the actions an agent can choose and the reward attached to each transition ([Reinforcement learning and Markov decision processes](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#reinforcement-learning-and-markov-decision-processes)). Week 6 uses it to generate text: once you know which words tend to follow which, you can predict one word after another ([n-grams, tokenization, and Markov chains](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#switching-to-statistics-n-grams-tokenization-and-markov-chains)).

**Bayes' rule (Week 2 → Week 6).** Week 2 derives `P(b | a) = P(a | b) P(b) / P(a)` ([Bayes' rule](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#bayes-rule-turning-a-conditional-probability-around)), and Week 6's Naive Bayes classifier uses it to go from "the share of positive reviews containing this word" to "the probability that a review containing these words is positive" ([bag-of-words and Naive Bayes](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#text-classification-bag-of-words-and-naive-bayes)).

**Inputs times weights (Week 4 → Week 5).** Week 4's classifier is `w₀ + w₁x₁ + w₂x₂ ≥ 0` ([Classifying with a line](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#classifying-with-a-line-weights-the-perceptron-learning-rule-and-two-kinds-of-threshold)). Week 5 opens by returning to this formula and drawing it as a unit: inputs times weights, plus a bias, through an activation function ([What one unit computes](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#what-one-unit-computes)).

**Loss (Week 4 → Week 5).** Week 4 defines loss functions to score a hypothesis ([Regression and loss functions](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#regression-and-loss-functions-how-to-score-a-hypothesis)), and that number is what Week 5's gradient descent reduces ([Gradient descent](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#gradient-descent-letting-the-computer-find-the-weights)).

**Overfitting (Week 4 → Week 5).** Week 4 handles it with regularization and cross-validation ([Overfitting, regularization, and cross-validation](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#overfitting-regularization-and-cross-validation)); Week 5 switches to dropout for neural networks ([Hidden layers, backpropagation, and dropout](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#hidden-layers-backpropagation-and-dropout)).

**The RNN (Week 5 → Week 6).** Week 5 ends by introducing a network that feeds its output back into itself ([recurrent neural networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#the-limits-of-feed-forward-networks-and-recurrent-neural-networks)), and Week 6's encoder–decoder uses it directly to process a whole sentence ([The RNN encoder–decoder](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#sequence-in-sequence-out-the-rnn-encoderdecoder)).

## Which week is a prerequisite for which

Every item in the previous section is an ordering. Laid out as a table, they show which weeks cannot be skipped:

| Content in the later week | Read first |
|---|---|
| Week 3: backtracking search | Week 0: the five parts of a search problem |
| Week 4: the Markov decision process | Week 2: Markov chains and the transition model |
| Week 5: units, gradient descent | Week 4: weights, loss functions |
| Week 6: generating text with n-grams, Naive Bayes | Week 2: Markov chains, Bayes' rule |
| Week 6: encoder–decoder, attention | Week 5: neural networks and the RNN |

Week 1 (logic) is the week that later weeks cite least directly; this is this site's summary, based on the fact that no row above depends on it. This series found one place where the lecturer refers back to it by name: in Week 5, computing OR with one unit, he says it is the "or" seen in propositional logic ([What one unit computes](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#what-one-unit-computes)). In Week 3, presenting maintaining arc consistency, he says to go back to the idea of inference ([Interleaving search and inference](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#interleaving-search-and-inference-maintaining-arc-consistency)), but does not name Week 1; mapping that remark to Week 1 is this site's guess. Its relationship to Week 2 is closer to a contrast: both derive the unknown from the known, with Week 1 handling certain facts and Week 2 handling things known only with some probability.

## Methods the lectures themselves replace

The course often teaches one method, states its limit, and moves to the next. In every row below the limit is one the lecture itself states. The link in the third column goes to the section that is taught next; for the four rows where the limit is stated in an earlier section, the second column also links to that section.

| Taught first | Limit the lecture points out | Taught next |
|---|---|---|
| Minimax over the whole tree | A game like chess cannot be searched to the end | [Depth-limited Minimax with an evaluation function](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#when-the-tree-is-too-big-depth-limited-minimax) |
| Model checking | Has to enumerate all 2 to the n truth assignments ([stated in this section](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#logic-puzzles-mastermind-and-the-limit-of-model-checking)) | [Inference rules](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#inference-rules-rewriting-sentences-instead-of-listing-worlds) and [resolution](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#resolution-clauses-and-cnf) |
| Inference by enumeration | Exact but slow | [Rejection sampling, likelihood weighting](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#approximate-inference-sampling-rejection-sampling-and-likelihood-weighting) |
| Hill climbing | Gets stuck at local optima ([stated in this section](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#hill-climbing-keep-moving-to-a-better-neighbor)) | [Random restart](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#variants-of-hill-climbing-and-a-run-of-hospitalspy), [simulated annealing](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#simulated-annealing-and-the-traveling-salesman-problem) |
| Backtracking search that only checks for violated constraints | Walks into dead ends it could have avoided | [Maintaining arc consistency](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#interleaving-search-and-inference-maintaining-arc-consistency) |
| One Q-value per state and action | Too many states to record | [Function approximation](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#letting-an-ai-teach-itself-nim-and-function-approximation) |
| A single perceptron | Can only learn linearly separable boundaries ([stated in this section](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#several-outputs-and-the-limit-of-one-unit)) | [Hidden layers and backpropagation](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#hidden-layers-backpropagation-and-dropout) |
| Hand-written context-free grammar | The rules never end ([stated in this section](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#writing-syntax-as-rules-context-free-grammar)) | [Statistics over large amounts of text](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#switching-to-statistics-n-grams-tokenization-and-markov-chains) |
| One-hot word representations | The vectors are long, and words with similar meanings do not get similar vectors | [word2vec](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#turning-words-into-vectors-one-hot-distributed-representations-and-word2vec) |
| RNN encoder–decoder | The whole input is squeezed into one hidden state | [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#attention-letting-the-decoder-decide-where-in-the-input-to-look) |
| RNN | Must compute token by token in order, hard to parallelize | [The Transformer](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#the-transformer-encoder-parallel-processing-positional-encoding-and-self-attention) |

Read from top to bottom, one pattern appears three times in this table, and this is this site's summary: **when the full computation is out of reach, switch to an estimate**. Week 0 uses an evaluation function to estimate boards that are not finished, Week 2 uses sampling to estimate probabilities too costly to compute, and Week 4 uses function approximation to estimate Q-values too numerous to record. Of the three, the lecturer himself draws only one connection: when he presents function approximation he compares it with depth-limited Minimax.

## Cross-week example 1: three uses of one Markov chain

The numbers come from the transition model in the Week 2 lecture, and the three uses correspond to Weeks 2, 4, and 6; putting them side by side is this site's doing.

**Setup.** The weather is either sun or rain. The starting distribution is sun 0.5, rain 0.5. The transition model:

| Today | Sun tomorrow | Rain tomorrow |
|---|---|---|
| Sun | 0.8 | 0.2 |
| Rain | 0.3 | 0.7 |

**Use 1: the probability of a sequence of states (Week 2).** For the three days "sun, sun, rain", the first day uses the starting distribution, and each later day looks up the cell "given the day before":

```text
P(sun) × P(sun | sun) × P(rain | sun) = 0.5 × 0.8 × 0.2 = 0.08
```

**Use 2: add actions and it is an MDP (Week 4).** In a Markov chain nobody makes decisions; the transition model is `P(tomorrow | today)`, and one 2 × 2 table is enough. A Markov decision process lets an agent choose an action in each state, so the transition model becomes `P(s' | s, a)`: one table per action. If this world had 2 states and 3 actions in each state, it would need three 2 × 2 tables, plus a reward function saying how much each transition earns. "2 states, 3 actions" are numbers made up for this post; the lecture's example is a grid world.

**Use 3: replace the state with a word (Week 6).** Replace "today's weather" with "the previous word" and the transition model becomes "the probability of each word following this one", counted from a corpus. Sampling from it one word after another is how the lecture generates sentences from Shakespeare's works. The lecturer states the limit on the spot: sentences generated this way are only guaranteed to follow the statistics, not to mean anything.

**What the result means.** All three weeks use the same assumption: the next state depends only on a fixed number of previous states. The differences are what else the transition model looks at (Week 4 adds the action) and what a state is (in Week 6, a word).

## Cross-week example 2: training Week 5's unit with Week 4's rule

In Week 5 the lecturer simply states the weights that compute OR and AND and does not show how they would be learned; Week 4 teaches the perceptron learning rule, with weather as its example. Below, Week 4's rule is applied to Week 5's unit. The formulas on both sides are the lecture's; the combination and the arithmetic were made up for this post.

**Setup.** Week 5's unit for AND: both weights are 1, the bias is −2, and the activation function is the step function (output 1 when the weighted sum is at least 0). In Week 4's notation the weight vector is **w** = (w₀, w₁, w₂) = (−2, 1, 1) and the input vector is **x** = (1, x₁, x₂).

Now we want it to compute OR instead. Give it one data point: input (1, 0), correct answer y = 1.

**Computation.** First see what it answers now: −2 + 1 × 1 + 1 × 0 = −1, which is below 0, so it outputs 0. Wrong.

Apply Week 4's rule `wᵢ ← wᵢ + α × (y − h(x)) × xᵢ` with `α` = 1. The error y − h(x) = 1 − 0 = 1, and the input vector is (1, 1, 0):

```text
w₀ ← −2 + 1 × 1 × 1 = −1
w₁ ←  1 + 1 × 1 × 1 =  2
w₂ ←  1 + 1 × 1 × 0 =  1
```

The new weights are (−1, 2, 1). Compute all four inputs:

| x₁ | x₂ | −1 + 2x₁ + x₂ | Output |
|---|---|---|---|
| 0 | 0 | −1 | 0 |
| 1 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 1 | 1 | 2 | 1 |

**What the result means.** After one update the unit computes OR. Its weights differ from the OR weights the lecture gives (bias −1, both weights 1), yet the outputs for all four inputs are the same: more than one set of weights computes the same function. It also shows that Week 5's unit and Week 4's classifier are the same thing, so Week 4's learning rule can be used unchanged. Succeeding after a single update is a coincidence of these numbers; in general the data has to be seen for many rounds.

## Cross-week example 3: from Bayes' rule to Naive Bayes

The Week 2 numbers are the ones the lecturer gives. Of the Week 6 rates, the 49% and 51% shares of positive and negative reviews are stated by the lecturer; he does not read out the numbers for the "loved" and "it" rows, which the Week 6 guide takes from the figure in the official notes and which are reused here. Using only two words is a simplification this post made to keep the example short.

**Week 2's use: one piece of evidence.** On 80% of days with rain in the afternoon the morning was cloudy, 40% of days have cloudy mornings, and 10% of days have rain in the afternoon. The probability of rain in the afternoon given a cloudy morning:

```text
P(rain | clouds) = P(clouds | rain) × P(rain) ÷ P(clouds) = 0.8 × 0.1 ÷ 0.4 = 0.2
```

**Week 6's use: many pieces of evidence.** A review contains the two words "loved" and "it"; what is the probability it is positive? The data is from the table in the Week 6 guide: 49% of reviews are positive and 51% negative; 32% of positive reviews contain "loved" and 30% contain "it"; 8% of negative reviews contain "loved" and 40% contain "it".

Week 6 does two more things on top of Bayes' rule. First, it assumes each word appears independently of the others, so the probability that both words appear splits into a product. Second, it skips the denominator, computes two proportional numbers, and normalizes at the end:

```text
Positive: 0.49 × 0.32 × 0.30 = 0.04704
Negative: 0.51 × 0.08 × 0.40 = 0.01632

P(positive | loved, it) = 0.04704 ÷ (0.04704 + 0.01632) = 0.04704 ÷ 0.06336 ≈ 0.742
```

**What the result means.** Judged by these two words alone, the review is more likely positive (about 74%). "it" appears more often in negative reviews, but "loved" appears in positive reviews at four times the rate it does in negative ones, which matters far more. The lecture's example uses four words (the other two are "my" and "grandson") and comes out at 0.68; the full computation is in the [Week 6 guide](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#text-classification-bag-of-words-and-naive-bayes), whose self-check works with the other two words.

The step "normalize at the end" is not new in Week 6 either: Week 2 uses the same move for joint probability, computing proportional numbers first and then dividing by their sum ([Joint probability, normalization, and four rules](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#joint-probability-normalization-and-four-rules)).

## Cross-week self-check

All four questions were made up for this post, and each needs material from more than one week.

**Check yourself. Write your answer down before opening the fold.** With the starting distribution and transition model of example 1, what is the probability of the three days "rain, rain, sun"? If this became a Markov decision process, what one extra thing would the transition model look at?

<details>
<summary>Answer</summary>

0.5 × 0.7 × 0.3 = 0.105. The first rainy day uses 0.5 from the starting distribution, the second looks up "rain today, rain tomorrow" at 0.7, and the third looks up "rain today, sun tomorrow" at 0.3.

As an MDP the transition model is `P(s' | s, a)`, so it also looks at the action the agent chose; in addition, each transition carries a reward.

Relevant sections: [Markov chains](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#markov-chains-a-state-that-changes-over-time), [reinforcement learning and Markov decision processes](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#reinforcement-learning-and-markov-decision-processes)

</details>

**Check yourself. Write your answer down before opening the fold.** The weights after the update in example 2 are (−1, 2, 1). Give the unit one more data point: input (0, 0), correct answer y = 0, with `α` still 1. How do the weights change?

<details>
<summary>Answer</summary>

They do not change. The current output is −1 + 0 + 0 = −1, below 0, so the output is 0, which matches the correct answer. The error y − h(x) is 0 and the whole added term is 0. Of the three cases Week 4 describes, this is "the estimate was right, the weights stay".

Relevant sections: [classifying with a line](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#classifying-with-a-line-weights-the-perceptron-learning-rule-and-two-kinds-of-threshold), [what one unit computes](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#what-one-unit-computes)

</details>

**Check yourself. Write your answer down before opening the fold.** For Week 1's model checking and Week 2's inference by enumeration, what does the lecture say is the problem with each, and what does it replace each with? What do the two have in common?

<details>
<summary>Answer</summary>

Model checking has to enumerate all 2 to the n truth assignments, which becomes impossible as symbols are added; the lecture moves to inference rules and resolution, which operate on the sentences directly. Inference by enumeration sums over every value of the unobserved variables, which is exact but slow; the lecture moves to rejection sampling and likelihood weighting.

What they share is that both go through every possible case, so both are correct and both slow down quickly as variables are added: 10 propositional symbols give 1,024 assignments, and 20 give over a million. This shared point is this site's summary. The replacements go in different directions: Week 1 moves to another method that is equally exact, Week 2 to an approximation.

Relevant sections: [the limit of model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#logic-puzzles-mastermind-and-the-limit-of-model-checking), [inference rules](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#inference-rules-rewriting-sentences-instead-of-listing-worlds), [inference](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#inference-from-evidence-to-the-distribution-of-other-variables), [approximate inference](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#approximate-inference-sampling-rejection-sampling-and-likelihood-weighting)

</details>

**Check yourself. Write your answer down before opening the fold.** In example 3, suppose the share of negative reviews containing "loved" were 32% instead of 8% (the same as for positive reviews), with every other number unchanged. What is `P(positive | loved, it)`?

<details>
<summary>Answer</summary>

Positive: 0.49 × 0.32 × 0.30 = 0.04704. Negative: 0.51 × 0.32 × 0.40 = 0.06528. Normalized: 0.04704 ÷ (0.04704 + 0.06528) = 0.04704 ÷ 0.11232 ≈ 0.419.

When "loved" appears at the same rate on both sides it has no effect on the result, which is the same as looking at "it" alone: 0.49 × 0.30 = 0.147 against 0.51 × 0.40 = 0.204, again 0.419. The conclusion moves from leaning positive (0.742) to leaning negative. For a word to help classification, it has to appear at different rates in the two classes.

Relevant sections: [Bayes' rule](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#bayes-rule-turning-a-conditional-probability-around), [bag-of-words and Naive Bayes](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#text-classification-bag-of-words-and-naive-bayes)

</details>

## Series Links

- [Course overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en)
- [Week 1 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en)
- [Week 2 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en)
- [Week 3 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en)
- [Week 4 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en)
- [Week 5 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en)
- [Week 6 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en)
- **Cross-week review 1: how ideas connect and replace one another (this post)**
- [Cross-week review 2: which lecture material each of the twelve projects uses](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en)
- [Course retrospective and what to read next](/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en)

## Course video sources

This post is a cross-week review written by this site; it corresponds to no particular week and embeds no video. Wherever it discusses a week's content it links to the relevant section of that week's guide, where the player and time links are. The official CS50 YouTube playlist (8 videos: an introduction plus the Week 0–6 lectures) was checked live on 2026-10-10 and contains no cross-week synthesis video.

Course and recording entries:

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

Checked: 2026-10-10.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlist was checked live; no recording corresponds to this post, so the status stays official entry only.
- 2026-10-13: Brought the Week 6 description in line with the current course: the projects are Parser and Attention (previously Questions), the 2023 lecture has no TF-IDF (now listing Naive Bayes and word2vec), and Parser means writing a CFG grammar and parsing with NLTK (previously CYK and generation).
- 2026-10-13: Rewritten from scratch against the rewritten weekly guides, with its role changed to a cross-week review. The former knowledge-arc diagram, three-stage tables, and "core abstraction" chain were removed; they contained a good deal the lectures do not cover (conditional independence and variable elimination, PageRank's stationary distribution, the SVM kernel trick, Q-learning as "model-free, off-policy, convergence", the chain rule for backpropagation, translation invariance for CNNs, the "symbolism to connectionism" framing) and wrong project descriptions (Heredity as likelihood-weighting sampling, Shopping as requiring standardization). The new content is three kinds of cross-week relationship, each linked to sections of the weekly guides; three cross-week examples worked to the end; and four cross-week self-check questions with answers. The project table moved to cross-week review 2. The unsupported math list and reading list were removed. The scope label in the title changed from "Course Overview" to "Topic Guide" so it no longer shares a role with the actual course overview.
- 2026-10-13: Fixes from independent review: in four rows of the "methods the lectures replace" table the limit is stated in an earlier section, so each now links to that section and the explanatory sentence was rewritten; example 3 and the last self-check question now use the words "loved" and "it" so they no longer duplicate the self-check in the Week 6 guide; added the places where the lecturer refers back to Week 1; tags reduced from 12 to 5.
- 2026-10-14: Fixes from re-review: only the Week 5 remark refers back to Week 1 by name; in the Week 3 remark the lecturer does not name Week 1, so it is now marked as this site's guess. The tag python was also removed, leaving 4.

## References

- The seven weekly guides in this series, the source of every statement about course content here, each with the lecture recording and time links: [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en), [Week 1 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en), [Week 2 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en), [Week 3 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en), [Week 4 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en), [Week 5 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en), [Week 6 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en)
- [CS50 AI course site](https://cs50.harvard.edu/ai/) — Entry to each week's lecture page and official notes
- [CS50 AI YouTube Playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 Tier Definition
