---
title: "Cross-Week Review (2): Which Lecture Material Each of the Twelve Projects Uses | Harvard CS50 AI Topic Guide"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, projects, python]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 9
tldr: "The twelve projects side by side: which functions each has you write, which lecture section it uses, and what example the spec page gives you to check against; which projects share a method (enumeration, search, Markov chains, learning from data) and which need something the lectures do not teach. Includes three worked examples and five self-check questions. The course gives no difficulty ratings or hour estimates, and neither does this post."
description: "The second cross-week review in the Harvard CS50 AI series: a comparison of the twelve projects (Degrees, Tic-Tac-Toe, Knights, Minesweeper, Heredity, PageRank, Crossword, Shopping, Nim, Traffic, Parser, Attention). The functions to implement and the spec-page checkpoints follow the official specs and distribution code, the lecture sections link to the weekly guides, and the grouping of projects is this site's summary. Three examples (how many joint probabilities Heredity computes, why Shopping does not report accuracy, PageRank's transition model) are worked to the end, followed by five self-check questions with answers, three of which span two or more weeks. This post is this site's own review, not any week's lecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)

**Video status: Official entry or recording index only.** This post is this site's cross-week review, not any week's lecture, and there is no official video for it; the weekly lecture recordings do not introduce the projects, whose specs and implementations are in the second half of each weekly guide. [Source details](#course-video-sources)

> ⚠️ **Version note**: Project specs, distribution code, and check50 slugs follow the 2026 course site; the Week 6 projects are Parser and Attention.

## TL;DR

None of the twelve projects starts from a blank file: the course provides distribution code and you fill in the functions the spec names. This post puts them side by side to answer three questions:

- What each project has you write, which lecture section it uses, and what example the spec page gives to check against (the table below).
- Which projects are really the same method (this site's summary).
- Which projects need something the lectures do not teach, so you learn it from the spec page.

How to tell the two kinds of content apart in this post: "what you write" and "checkpoints on the spec page" come from the official specs; "lecture sections it uses" link to the weekly guides; anything marked "this site's summary" or "made up for this post" is what this site worked out after putting the projects side by side. Each project's distribution code, reference implementation, and run results are in the weekly guides and are not repeated here.

The official spec pages give no difficulty rating and do not say how long each project takes; this series has not measured how long a beginner needs, so this post does not rank difficulty or estimate hours.

## The twelve projects compared

| Project | What you write | Lecture sections it uses | Checkpoints on the spec page |
|---|---|---|---|
| [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0a-degrees--bfs-for-actor-degrees-of-separation) | `shortest_path` | [Nodes, the frontier, and the generic search loop](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#nodes-the-frontier-and-the-generic-search-loop), [DFS and BFS](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#dfs-and-bfs-the-only-difference-is-which-node-leaves-the-frontier) | Sample output: Emma Watson to Jennifer Lawrence is 3 degrees |
| [Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0b-tic-tac-toe--minimax-optimal-play) | Seven functions, ending with `minimax`; alpha-beta pruning is optional | [Minimax](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#adversarial-search-minimax), [alpha-beta pruning](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#alpha-beta-pruning) | With optimal play on both sides the game is a tie, so you should never be able to beat your own AI |
| [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1a-knights--logic-puzzle-solver) | Knowledge bases for four puzzles | [Propositional logic](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#propositional-logic-symbols-and-five-connectives), [model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#model-checking-listing-every-possible-world), [knowledge engineering](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#knowledge-engineering-writing-clue-in-propositional-logic) | This one must be 100% correct to pass; other projects pass at 70% |
| [Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1b-minesweeper--minesweeper-ai) | Four methods of `Sentence`, three methods of `MinesweeperAI` | [Deriving new facts from known ones](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#deriving-new-facts-from-known-ones) (the sentence form is the project's own) | The spec notes the AI will not always win: without enough information it has to guess |
| [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2a-heredity--inferring-genes-and-traits-with-a-bayesian-network) | `joint_probability`, `update`, `normalize` | [Bayesian networks](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#bayesian-networks-arrows-for-who-influences-whom), [inference](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#inference-from-evidence-to-the-distribution-of-other-variables), [joint probability and normalization](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#joint-probability-normalization-and-four-rules) | One joint-probability example (0.0026643247488) and the full expected output for `family0.csv` |
| [PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2b-pagerank--sampling-and-iterative-algorithms) | `transition_model`, `sample_pagerank`, `iterate_pagerank` | [Markov chains](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#markov-chains-a-state-that-changes-over-time) | A `transition_model` example (0.05, 0.475, 0.475); returned values must sum to 1 |
| [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#project-3-crossword--csp-crossword-puzzle-generation) | Eight functions in `generate.py` | [Constraint satisfaction problems](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#constraint-satisfaction-problems-variables-domains-and-constraints), [AC-3](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#node-consistency-arc-consistency-and-ac-3), [backtracking search](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#a-csp-as-a-search-problem-backtracking-search), [heuristics](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#heuristics-for-choosing-variables-and-ordering-values-mrv-degree-least-constraining-value) | The run command and how to output an image; a hint that the heuristics can wait |
| [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4a-shopping--k-nn-purchase-intent-prediction) | `load_data`, `train_model`, `evaluate` | [Nearest neighbor](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#supervised-learning-classification-and-nearest-neighbor), [the scikit-learn run](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#trying-it-with-scikit-learn-banknote-authentication-data) | The 17 evidence values of the first row; sample output of 41.02% and 90.55% |
| [Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4b-nim--q-learning-learns-to-play) | Four methods of `NimAI` | [Q-learning and ε-greedy](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#q-learning-and-ε-greedy), [the Nim demonstration](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#letting-an-ai-teach-itself-nim-and-function-approximation) | The Q-learning update formula and the three rewards (−1, 1, 0) |
| [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#project-5-traffic--cnn-training-for-traffic-sign-classification) | `load_data`, `get_model`, plus a `README.md` | [Convolution](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#images-as-input-convolution-and-kernels), [pooling and CNNs](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#pooling-and-the-structure-of-a-convolutional-neural-network), [`handwriting.py`](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#handwritingpy-recognizing-handwritten-digits-with-a-cnn) | No accuracy threshold; the sample output on the spec page shows 0.9535 |
| [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6a-parser--parsing-sentences-with-a-cfg-and-extracting-noun-phrases) | The `NONTERMINALS` grammar, `preprocess`, `np_chunk` | [Context-free grammar](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#writing-syntax-as-rules-context-free-grammar) | Three sentences in the hints that should be accepted and two that should not |
| [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head) | Three functions in `mask.py`, plus `analysis.md` | [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#attention-letting-the-decoder-decide-where-in-the-input-to-look), [self-attention and multi-headed attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#the-transformer-encoder-parallel-processing-positional-encoding-and-self-attention) | Three predictions for each of the two opening example sentences; the color for 0.25 may be 63 or 64 |

"Checkpoints on the spec page" lists only examples or requirements stated on the spec page. This series did not run check50 (it has you log in with a GitHub account), so what check50 actually tests is not listed.

## How the projects relate to one another

The grouping in this section is this site's summary; the course does not group the projects this way. Each group is followed by the reason for it, and the reasons themselves can be traced to a source.

**Going through every possibility: Knights, Heredity.** Once Knights has the puzzles written as knowledge bases, it hands them to `model_check` in `logic.py`, which enumerates every truth assignment of the propositional symbols. Heredity's official `main` walks through every combination of who has the trait, who has one copy of the gene, and who has two, and your `joint_probability` computes the probability of each. In both projects you do not write the enumeration itself; you write how one case is described or computed. The lectures' verdict on this approach is that it is correct but slows down as variables are added ([the limit of model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#logic-puzzles-mastermind-and-the-limit-of-model-checking), [inference](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#inference-from-evidence-to-the-distribution-of-other-variables)); both projects are small enough to enumerate completely.

**Searching a tree or a graph: Degrees, Tic-Tac-Toe, Crossword.** Degrees uses BFS to find a shortest path in the graph of actors and movies; Tic-Tac-Toe uses Minimax over the whole game tree; Crossword uses backtracking search, assigning one variable at a time. All three apply Week 0's search framework, which the Week 3 lecturer makes explicit when he fits a CSP into the format of a search problem ([A CSP as a search problem](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#a-csp-as-a-search-problem-backtracking-search)).

**Two ways to compute on one Markov chain: PageRank.** The spec describes a surfer clicking links at random as a Markov chain. `sample_pagerank` samples step by step from the transition model, which the lectures teach; the iterative formula used by `iterate_pagerank` is not taught in the lectures and is given on the spec page.

**Learning from data or experience: Shopping, Nim, Traffic.** Shopping and Traffic are supervised learning, with labeled data; Nim is reinforcement learning, where the AI learns from winning and losing in self-play. The official `main` in both Shopping and Traffic uses `train_test_split` to hold out 40% as a test set.

**Hand-written rules: Knights, Parser.** In both projects you write human knowledge as formal rules and hand them to an existing program to do the reasoning: Knights to `model_check`, Parser to NLTK's `ChartParser`. In Week 6 the lecturer says hand-written grammar rules never end, which is why the lecture turns to statistics; Parser lets you run into that limit yourself, since the spec wants a grammar that parses ten sentences without being loose enough to accept "Holmes sat in the the armchair."

**Using a trained model: Attention.** It is the only one of the twelve that uses a model someone else trained: it loads a pre-trained BERT and observes its outputs and attention. BERT is not mentioned in the lectures; the spec page introduces it.

**Projects and the lectures' demonstration programs.** Nine projects can be set directly against a program demonstrated in lecture or a definition given in lecture; this was compiled from the specs and the weekly guides:

| Project | Lecture demonstration | Relationship |
|---|---|---|
| Degrees | `maze.py` | The project's `util.py` is the lecture's `Node`, `StackFrontier`, `QueueFrontier` (stated on the spec page) |
| Tic-Tac-Toe | The lecture defines Minimax using tic-tac-toe | The player, actions, result, terminal, and utility the lecture defines have the same names as the functions the project has you write |
| Knights | `logic.py` | The `logic.py` shipped with the project is nearly identical to the lecture's |
| PageRank | `chain/model.py` | The lecture draws 50 states from the weather Markov chain; `sample_pagerank` does the same thing |
| Crossword | `schedule0.py` | The lecture uses it to demonstrate backtracking search |
| Shopping | The scikit-learn run on banknote authentication | The lecture uses the same `KNeighborsClassifier` |
| Nim | The lecturer's own Nim AI | The same 10,000 games of self-play and the same opening of 1, 3, 5, 7 |
| Traffic | `handwriting.py` | The spec's hint says the lecture source code will help; the official `main` follows nearly the same steps |
| Parser | `cfg0.py`, `cfg1.py` | The spec's hint says the lecture's rules are deliberately simplified and that you should modify them |

**Things the lectures do not teach and you learn from the spec page.** This series could not find the following in the lecture transcripts; the project sections of the weekly guides explain them from the spec pages:

- Minesweeper's sentence form (a set of cells plus a mine count) and the subset inference.
- Heredity's inheritance rules and mutation probability.
- PageRank's iterative formula and the damping factor.
- Shopping's sensitivity and specificity.
- Attention's BERT and the masked language model.

## Example 1: how many joint probabilities Heredity computes

The loop structure of the official `main` is taken from `heredity.py`, and the data is the official `family0.csv`; the counts were computed for this post.

**Setup.** `family0.csv` has three people: Harry, James, and Lily. James is known to have the trait, Lily is known not to, and Harry is unknown. The loops in `main` are:

1. For every combination of who has the trait (all subsets of the three people), skip those that contradict the known traits.
2. For every combination of who has one copy of the gene.
3. For every combination of who, among the rest, has two copies, call `joint_probability` once.

**Computation.** Level 1: James must be in and Lily must be out, so only Harry can go either way, leaving 2 combinations. Levels 2 and 3 together amount to each person independently having 0, 1, or 2 copies: 3 × 3 × 3 = 27 combinations. So there are 2 × 27 = 54 calls in all.

If the traits of all three were unknown, level 1 would be 2 × 2 × 2 = 8 combinations, for 8 × 27 = 216 calls.

**What the result means.** Each additional person multiplies the gene combinations by 3, and by another 2 if the trait is unknown. Three people give 216; ten people with unknown traits give 6 to the 10th power, about sixty million. This is what the Week 2 lecture's "exact but slow" looks like in practice; the project's families are small, so the enumeration finishes. Known evidence reduces the combinations to compute: `family0.csv` knows two people's traits, which brings 216 down to 54.

## Example 2: why Shopping does not report accuracy

The row counts come from the Week 4 guide's check of `shopping.csv`; the "always predict no purchase" classifier is the spec page's own example, worked out below with the actual counts.

**Setup.** `shopping.csv` has 12,330 rows, of which 1,908 ended in a purchase and 10,422 did not. Suppose a classifier looks at no data at all and always answers "no purchase".

**Computation.**

```text
accuracy    = correct ÷ all                        = 10,422 ÷ 12,330 ≈ 84.5%
sensitivity = share of buyers identified correctly     = 0 ÷ 1,908       = 0
specificity = share of non-buyers identified correctly = 10,422 ÷ 10,422 = 1
```

**What the result means.** An accuracy of 84.5% does not look bad, but this classifier identifies not a single buyer. Only when accuracy is split into sensitivity and specificity does that become visible. The Week 4 guide ran its reference implementation (nearest neighbor with k = 1) inside the official files, and neither number came out as 0 or 1: it does identify some of the buyers, at the cost of getting some non-buyers wrong. The number of runs and the ranges are in [the Shopping section of the Week 4 guide](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4a-shopping--k-nn-purchase-intent-prediction) and are not copied here.

## Example 3: PageRank's transition model

The corpus is the official `corpus0` and the formula follows the spec page; the numbers for this page were computed for this post.

**Setup.** `corpus0` has four pages: `1.html` links to `2.html`; `2.html` links to `1.html` and `3.html`; `3.html` links to `2.html` and `4.html`; `4.html` links to `2.html`. The damping factor `d` is 0.85. The surfer is on `2.html`; what is the probability of each page being next?

**Computation.** The spec's rule: with probability `d`, choose at random among the links on the current page; with probability `1 − d`, choose at random among all pages.

- Every page first gets (1 − 0.85) ÷ 4 = 0.0375.
- `2.html` has two links, each of which gets another 0.85 ÷ 2 = 0.425.

So `1.html` and `3.html` are each 0.0375 + 0.425 = 0.4625, and `2.html` and `4.html` are each 0.0375. The four sum to 0.4625 × 2 + 0.0375 × 2 = 1.

**What the result means.** This row is the "today on `2.html`" row of a Week 2 transition model table, with the states changed from two kinds of weather to four web pages. `transition_model` computes one such row for each page, and together they are the whole table; `sample_pagerank` does what the lecture does when it draws 50 states from the weather Markov chain, except that it draws 10,000 and counts the share of each page.

## Self-check

All five questions were made up for this post; the first, fourth, and fifth need material from more than one week.

**Check yourself. Write your answer down before opening the fold.** Puzzle 3 of Knights uses six propositional symbols (A, B, and C each have "is a Knight" and "is a Knave"). At most how many truth assignments does `model_check` have to check? Heredity's `family0.csv` takes 54 joint-probability computations. Why does neither project have to worry about the lectures' "enumeration is too slow"?

<details>
<summary>Answer</summary>

2 to the 6th power: 64.

Both projects are small: 64 assignments and 54 computations finish instantly. The problem the lectures describe appears as variables are added: each extra propositional symbol doubles the assignments, and each extra person with an unknown trait in Heredity multiplies the count by 6. The projects are sized so that you can first get "how one case is described and computed" right without dealing with efficiency.

Relevant sections: [model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#model-checking-listing-every-possible-world), [the limit of model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#logic-puzzles-mastermind-and-the-limit-of-model-checking), [the Heredity project](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2a-heredity--inferring-genes-and-traits-with-a-bayesian-network)

</details>

**Check yourself. Write your answer down before opening the fold.** With the `corpus0` of example 3 and `d` = 0.85, the surfer is on `1.html` (which links only to `2.html`). What is the probability of each of the four pages being next?

<details>
<summary>Answer</summary>

Every page first gets 0.15 ÷ 4 = 0.0375. `1.html` has a single link, so all of 0.85 goes to `2.html`. So `2.html` is 0.0375 + 0.85 = 0.8875 and the other three pages are 0.0375 each. The sum is 0.8875 + 0.0375 × 3 = 1.

Relevant sections: [Markov chains](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#markov-chains-a-state-that-changes-over-time), [the PageRank project](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2b-pagerank--sampling-and-iterative-algorithms)

</details>

**Check yourself. Write your answer down before opening the fold.** On the data of example 2, a classifier identifies 800 of the 1,908 buyers and gets 9,422 of the 10,422 non-buyers right. What are its accuracy, sensitivity, and specificity? Compared with "always predict no purchase", which number got worse?

<details>
<summary>Answer</summary>

Accuracy = (800 + 9,422) ÷ 12,330 = 10,222 ÷ 12,330 ≈ 82.9%. Sensitivity = 800 ÷ 1,908 ≈ 41.9%. Specificity = 9,422 ÷ 10,422 ≈ 90.4%.

Accuracy drops from 84.5% to 82.9% and specificity from 1 to 0.904, but sensitivity rises from 0 to 0.419. Looking at accuracy alone you would think it is worse than "always predict no purchase", when it is the only useful one of the two.

Relevant sections: [the Shopping project](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4a-shopping--k-nn-purchase-intent-prediction)

</details>

**Check yourself. Write your answer down before opening the fold.** Of the twelve projects, which use a method that has a demonstration program or a definition in the lecture recordings to compare against? Pick one and name the program, or say what the lecture defines. Which project uses a model the lectures never mention?

<details>
<summary>Answer</summary>

This post identified nine: Degrees (the frontier classes of `maze.py`), Tic-Tac-Toe (the player, actions, result, terminal, and utility the lecture defines using tic-tac-toe), Knights (`logic.py`), PageRank (`chain/model.py`), Crossword (`schedule0.py`), Shopping (the scikit-learn run on banknotes), Nim (the lecturer's Nim AI), Traffic (`handwriting.py`), and Parser (`cfg0.py`, `cfg1.py`). Naming any one of them together with its program or the lecture's definition counts as correct (Tic-Tac-Toe is matched to a definition, not a program).

The BERT used by Attention is not mentioned in the lectures. The lecture teaches the architecture of attention and the Transformer; BERT is introduced on the spec page.

Relevant sections: [the maze program](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#the-maze-program-swap-one-class-and-dfs-becomes-bfs), [`handwriting.py`](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#handwritingpy-recognizing-handwritten-digits-with-a-cnn), [the Attention project](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head)

</details>

**Check yourself. Write your answer down before opening the fold.** In Nim only one pile is left, with 2 objects, and it is your turn (whoever removes the last object loses). First use Week 0's Minimax idea: score "you win" as 1 and "you lose" as −1. What is the value of each of the two actions, and which should you choose? Then look at Week 4: after the Nim project trains with Q-learning for 10,000 games, the run in the Week 4 guide found Q-values of 1.0 and close to −1 for the two actions in this state. Do the two methods choose the same action? What does each need?

<details>
<summary>Answer</summary>

By Minimax: after you take 1, one object remains and the opponent has a single action, taking the last object, so the opponent loses and this action is worth 1. Taking 2 means you take the last object yourself, worth −1. Take the maximum: choose to take 1.

Q-learning learned Q-values of 1.0 and close to −1, and choosing the action with the highest Q-value also means taking 1. The two methods choose the same action.

The difference is in what they need. Minimax needs to know the rules and has to play the continuations out to the end of the game, with no experience of past games; the Tic-Tac-Toe project uses this. Q-learning does not search ahead; it corrects its estimates from the rewards of many games, one at a time, and the estimates are off when there have been too few games; the Nim project uses this. Setting the two projects side by side like this is this post's doing; the lecture does not solve Nim with Minimax.

Relevant sections: [Minimax](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#adversarial-search-minimax), [letting an AI teach itself Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#letting-an-ai-teach-itself-nim-and-function-approximation), [the Nim project](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4b-nim--q-learning-learns-to-play)

</details>

## Where each project most often goes wrong

This table is compiled from the project sections of the weekly guides: some entries are explicit requirements in the spec, others are errors hit when the code was run inside the official files. The details and a runnable way to write each project are in the weekly guides.

| Project | Symptom | Cause |
|---|---|---|
| Degrees | The return format is wrong | The spec wants a list of `(movie_id, person_id)` pairs, and `None` when there is no path |
| Tic-Tac-Toe | The board changes mid-computation | `result` modified the board passed in. The spec requires the original board to be left unmodified and suggests a deep copy first |
| Knights | Puzzle 3 cannot determine anyone's identity | "Which sentence A said" was not itself written as a sentence |
| Minesweeper | The loop in `add_knowledge` never ends | You rewrote `Sentence` and dropped `__eq__`, so the same sentence keeps being added to the knowledge base |
| Minesweeper | A safe cell gets marked as a mine | Known mines were not subtracted from `count` when building the new sentence |
| Heredity | The numbers do not match the spec page | People without parents use the unconditional probability; people with parents use the pass probabilities (0.99, 0.5, 0.01) |
| PageRank | The pages do not sum to 1 | A page with no links must be treated as linking to every page; the first sample in sampling counts as one |
| Crossword | It fails as soon as it runs inside the official files | The keys of `overlaps` are pairs of variables; `neighbors` is a method and must be called |
| Shopping | `main` fails when calling `predict` | `train_model` must return the model itself |
| Nim | Accessing `self.q` raises an error | The state is a list and must be converted to a tuple first. The rule is that whoever removes the last object loses |
| Traffic | Accuracy stays around 0.055 | Pixel values were not scaled to 0–1; in the Week 5 guide, 5 of the 13 runs without scaling ended this way |
| Parser | It accepts a sentence it should not | The grammar is too loose, for example allowing determiners to repeat |
| Attention | Importing `TFBertForMaskedLM` fails | The packages are too new. The combination the Week 6 guide found to work on 2026-10-13 is transformers 4.44.2, tensorflow 2.21.0, tf-keras 2.21.0 |

Do the projects in week order. The only things known for certain that affect scheduling are these: Week 3 has a single project, Crossword, with eight functions to write; Traffic's dataset is a separate download; Attention downloads the model on first run; and the spec pages state that the latest Python to use in this course is 3.12.

## Series Links

- [Course overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en)
- [Week 1 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en)
- [Week 2 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en)
- [Week 3 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en)
- [Week 4 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en)
- [Week 5 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en)
- [Week 6 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en)
- [Cross-week review 1: how ideas connect and replace one another](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en)
- **Cross-week review 2: which lecture material each of the twelve projects uses (this post)**
- [Course retrospective and what to read next](/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en)

## Course video sources

This post is a cross-week review written by this site; it corresponds to no particular week and embeds no video. None of the seven lecture recordings introduces that week's project assignments (Week 4 demonstrates Nim but does not mention the assignment); the project content here comes from the spec pages on the course site and the officially released code. The official CS50 YouTube playlist (8 videos: an introduction plus the Week 0–6 lectures) was checked live on 2026-10-10.

Course and recording entries:

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

Checked: 2026-10-10.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlist was checked live; no recording corresponds to this post, so the status stays official entry only.
- 2026-10-13: Brought the Week 6 projects in line with the current course: the twelfth project is Attention (previously the 2020 edition's Questions), and the Parser notes now describe what the spec actually asks for — a CFG grammar, `preprocess`, and `np_chunk` (previously CYK and sentence generation).
- 2026-10-13: Rewritten from scratch against the official distribution code, the spec pages, and the rewritten weekly guides, with its role changed to a cross-week review. Removed unsupported content: the estimated line counts per project, the star difficulty ratings, the hour estimates and the "60–100 hours" total, the "check50 key verification" column (this series did not run check50), and the skill transfer map. Corrected wrong project descriptions: Heredity enumerates every combination and normalizes (previously likelihood-weighting sampling); Shopping has no `StandardScaler` (previously "MUST use"); Nim has no discount parameter (previously γ=1); `add_constraints`, `forward_check`, `count_conflicts`, and `structure3.txt` do not exist in Crossword's official files; in Traffic you write `load_data` yourself and the spec has no accuracy threshold (previously: check50 loads `traffic_model.h5`, threshold around 95%); alpha-beta pruning in Tic-Tac-Toe is optional. New content: each project linked to the lecture sections it uses, six kinds of relationship between projects and nine lecture demonstrations to compare against, three examples worked to the end, and five self-check questions with answers. The scope label in the title changed from "Course Overview" to "Topic Guide", and the topic half now says what the post actually does.
- 2026-10-13: Fixes from independent review: example 2 no longer copies the run count and ranges from the Week 4 guide and links there instead; Tic-Tac-Toe and PageRank were added to the projects with a lecture demonstration to compare against, nine in all; Attention's checkpoint is two example sentences; "neither trains nor reasons" became "uses a model someone else trained"; the PageRank row no longer links to the Bayesian-network sampling section; the account needed for check50 is now consistently a GitHub account; the tags difficulty and portfolio were removed.
- 2026-10-14: Fixes from re-review: the fourth self-check question and its criterion now cover "a definition given in lecture", since Tic-Tac-Toe is matched to a definition, not a program. The tag comparison was also removed.

## References

- [CS50 AI Projects Overview](https://cs50.harvard.edu/ai/projects/) — Entry point to the twelve project spec pages; links to each spec page are in the references of the weekly guides
- [Knights project spec](https://cs50.harvard.edu/ai/projects/1/knights/) — The 100%-to-pass exception
- [CS50 Certificate Info](https://cs50.harvard.edu/ai/certificate/) — The 70%-on-every-project condition
- [check50 Documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [CS50 AI YouTube Playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- On this site: [Harvard CS50 AI course overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — Series entry and version notes
