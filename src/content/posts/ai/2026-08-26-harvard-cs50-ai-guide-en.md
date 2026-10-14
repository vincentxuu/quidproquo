---
title: "Introduction to AI: Seven Weeks from Search, Logic and Probability to Neural Networks and Language | Harvard CS50 AI Course Overview"
date: 2026-08-26
category: ai
type: guide
tags: [cs50, harvard, ai-course, python, learning-path]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 0
tldr: "CS50 AI covers the introductory material of artificial intelligence in seven weeks and twelve Python projects: search, logical inference, probability, optimization, machine learning, neural networks, and language. In the first four weeks a person writes the problem down precisely; in the last three the computer learns from data. Lectures, notes, projects, and autograding are free and open to people outside Harvard. This post is the entry to the series: the mechanism each week teaches, an example you can work through, a prerequisite check, and a reading path."
description: "Course overview of Harvard CS50's Introduction to Artificial Intelligence with Python: the main line of the course, the mechanism of each of the seven weeks (each linked to its guide), a Q-learning example worked to the end, what each of the twelve projects has you write, three prerequisite checks with criteria, and how to take the course and where to start. The official 1 minute 53 second course introduction is embedded at the top. The Week 0–5 lectures are 2020 recordings and Week 6 is a new 2023 version; project specs follow the current course site."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-26-harvard-cs50-ai-guide)

**Video status: Videos included.** Runtime 1:53. It is the first video in the official playlist: a short course introduction that previews the topics of the seven weeks. It is not any week's lecture and has no subtitle track, so this post paraphrases it from a machine transcript; each of the seven lecture recordings is embedded in that week's guide, with time links in every section. [Source details](#course-video-sources)

[Harvard CS50's Introduction to Artificial Intelligence with Python](https://cs50.harvard.edu/ai/) (CS50 AI below) is a course that teaches introductory artificial intelligence in Python. The lectures are given by [Brian Yu](https://brianyu.me); the header of the course site shows his name alongside that of [David J. Malan](https://cs.harvard.edu/malan/), and [the edX course page](https://cs50.edx.org/ai) lists both as instructors. Each week you watch one lecture recording and do one or two projects, twelve in all across the seven weeks. The course is free through OpenCourseWare, and under the access labels defined in this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) it is **A3 (sufficient for self-study)**: materials, projects, and autograding are all open to outsiders.

This series has one guide for each of the seven weeks, and this post is the entry point. Below is the official course introduction, under two minutes; watch it first or read the next section first, either works.

```youtube
url: https://www.youtube.com/watch?v=gR8QvFmNuLE
title: Introduction - CS50's Introduction to Artificial Intelligence with Python 2020
```

## The main line of the course

The introduction presents the whole course as one line. The following paraphrases it in the video's order (based on a machine transcript; see the note at the end):

1. How AI can **search** for solutions to problems, with learning to play a game or finding driving directions to a destination as examples.
2. How AI can **represent information**, both knowledge it is certain about and information and events it is uncertain about; and, more importantly, how to use that information to **draw inferences** and new conclusions.
3. How AI can solve various **optimization** problems: maximizing profits, minimizing costs, or satisfying some constraints.
4. **Machine learning**: not telling the AI how to solve a problem, but giving it data and experiences so that it learns on its own.
5. In particular **neural networks**, which the video calls one of the most popular tools in modern machine learning.
6. Finally **natural language processing**, so that AI can understand human language.

The video says two more things: the course picks up where CS50 leaves off, and along the way you write your own AI programs to implement these ideas.

The video does not say which week each item falls in; the mapping below is this post's, following the week pages on the course site: item 2 splits into two weeks, with certain knowledge in Week 1 and uncertain information in Week 2, and the rest take one week each. This site reads the seven weeks as two halves; that is this site's summary, not a division the video makes. In the first four weeks (search, knowledge, uncertainty, optimization) a person writes the problem down precisely and hands it to an algorithm that finds the answer; in the last three (learning, neural networks, language) the computer is given data and finds the patterns itself. Neural networks do not appear until Week 5.

## What each of the seven weeks teaches

Each row gives that week's mechanism in a sentence or two, taken from the weekly guides; the week number links to the official lecture page and "Guide" links to this series' post for that week. The Week 0–5 lectures are 2020 recordings and Week 6 is a new 2023 version. That does not affect the table below, but it does affect how you do the projects; see "What the twelve projects ask you to do".

| Week | Topic | The mechanism this week |
|---|---|---|
| [Week 0](https://cs50.harvard.edu/ai/weeks/0/) | Search | Write the problem as states, actions, and a goal, and expand nodes one at a time from a frontier. DFS and BFS differ only in whether the frontier is a stack or a queue; A\* adds the steps already taken to a heuristic estimate; with an opponent, Minimax has the two players alternately take the maximum and the minimum. [Guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) |
| [Week 1](https://cs50.harvard.edu/ai/weeks/1/) | Knowledge | Write knowledge as sentences using propositional symbols and connectives. Model checking lists every truth assignment to check whether the known sentences entail a query; when there are too many, inference rules and resolution derive new sentences directly from existing ones. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en) |
| [Week 2](https://cs50.harvard.edu/ai/weeks/2/) | Uncertainty | Conditional probability and Bayes' rule turn evidence into probabilities. A Bayesian network uses arrows to break the joint probability into one conditional probability table per node, and inference can enumerate (exact but slow) or sample (approximate); a Markov chain describes a state that changes over time. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en) |
| [Week 3](https://cs50.harvard.edu/ai/weeks/3/) | Optimization | Local search keeps only one state: hill climbing moves to a better neighbor, and simulated annealing accepts a worse step with some probability; linear programming writes the problem as a linear cost function plus constraints; constraint satisfaction problems first shrink each variable's domain with arc consistency, then find a solution with backtracking search. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en) |
| [Week 4](https://cs50.harvard.edu/ai/weeks/4/) | Learning | Supervised learning learns a function from labeled data: k-NN looks at the nearest neighbors, and the perceptron and the support vector machine draw a decision boundary with weights. In reinforcement learning, Q-learning updates its estimate for each state and action from rewards. Unsupervised learning is represented by k-means clustering. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en) |
| [Week 5](https://cs50.harvard.edu/ai/weeks/5/) | Neural Networks | A unit multiplies its inputs by weights, adds a bias, and passes the result through an activation function; gradient descent adjusts the weights one small step at a time, and backpropagation distributes the error back through hidden layers. Images go through convolution and pooling before an ordinary network (a CNN), and sequence data uses an RNN. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en) |
| [Week 6](https://cs50.harvard.edu/ai/weeks/6/) | Language | First parse sentences with hand-written context-free grammar rules, then switch to statistics (n-grams, Naive Bayes); turn words into vectors with word2vec and process whole sequences with an RNN encoder–decoder; finally, attention and the Transformer. [Guide](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en) |

The weeks are not independent of one another. Week 2's Markov chain becomes the Markov decision process in Week 4, Week 4's "inputs times weights" classifier becomes a unit in Week 5, and Week 5's RNN is used to process sentences in Week 6. These connections are laid out in [cross-week review 1](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en).

## Work through one: a single Q-learning update

Every section of the weekly guides carries a small example you can compute to the end. The one below comes from the self-check in [the Week 4 guide's section on letting an AI teach itself Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#letting-an-ai-teach-itself-nim-and-function-approximation); the scenario was made up for that guide and is not lecture content, while the update formula is what the lecture teaches ([Q-learning and ε-greedy](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#q-learning-and-ε-greedy)).

**Setup.** The game of Nim has several piles of objects; players take turns removing at least one object from one pile, and whoever removes the last object loses. Only one pile is left, with 2 objects, and it is your turn. You have two actions:

- Take 1: one object remains, the opponent is forced to take it, and you win.
- Take 2: you take the last object yourself, and you lose.

**Mechanism.** Q-learning keeps an estimate Q for each pair of state and action, all starting at 0. Each time the AI tries something, it corrects the estimate with this formula:

```text
new Q = old Q + α × (reward for this step + best future estimate − old Q)
```

In the Nim project `α` defaults to 0.5. A move that loses the game for you has a reward of −1, and since the game is over there is no future reward.

**Computation.** For the action "take 2":

- First update: 0 + 0.5 × (−1 − 0) = −0.5
- Second update: −0.5 + 0.5 × (−1 − (−0.5)) = −0.75

Each update moves halfway toward −1. "Take 1" makes the opponent lose, and the same formula moves its Q-value step by step toward 1.

**What the result means.** After enough tries, the AI in this state picks "take 1", the action with the higher Q-value. Nobody told it which move is good; it learned that from the rewards for winning and losing. The Week 4 Nim project has the AI play 10,000 games against itself in exactly this way. This is also what the introduction means by not telling the AI how to solve a problem and giving it experiences to learn from.

**Check yourself. Write your answer down before opening the fold.** What is the Q-value of "take 2" after its third update?

<details>
<summary>Answer</summary>

−0.75 + 0.5 × (−1 − (−0.75)) = −0.75 + 0.5 × (−0.25) = −0.875. The gap to −1 shrinks from 0.25 to 0.125, halving again.

</details>

## What the twelve projects ask you to do

For every project the course provides distribution code and a specification, and you fill in the functions the spec names; you do not start from a blank file. The lecture recordings do not introduce the projects, so what a project asks for is written only on its spec page; the second half of each weekly guide in this series covers the project specs, the official files, and a reference implementation.

| Week | Projects | What you do |
|---|---|---|
| [Project 0](https://cs50.harvard.edu/ai/projects/0/) | [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0a-degrees--bfs-for-actor-degrees-of-separation), [Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0b-tic-tac-toe--minimax-optimal-play) | Use BFS to find the shortest chain of co-starring between two actors; write a tic-tac-toe AI with Minimax |
| [Project 1](https://cs50.harvard.edu/ai/projects/1/) | [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1a-knights--logic-puzzle-solver), [Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1b-minesweeper--minesweeper-ai) | Write knights-and-knaves puzzles in propositional logic and let model checking solve them; write a Minesweeper AI that reasons with sentences of the form "a set of cells plus a mine count" |
| [Project 2](https://cs50.harvard.edu/ai/projects/2/) | [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2a-heredity--inferring-genes-and-traits-with-a-bayesian-network), [PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2b-pagerank--sampling-and-iterative-algorithms) | Compute joint probabilities on a Bayesian network to infer each family member's gene count and trait; compute page ranks two ways, by sampling and by an iterative formula |
| [Project 3](https://cs50.harvard.edu/ai/projects/3/) | [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#project-3-crossword--csp-crossword-puzzle-generation) | Write a crossword as a constraint satisfaction problem and generate a filling with AC-3 and backtracking search |
| [Project 4](https://cs50.harvard.edu/ai/projects/4/) | [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4a-shopping--k-nn-purchase-intent-prediction), [Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4b-nim--q-learning-learns-to-play) | Predict purchase intent with a nearest-neighbor classifier and report sensitivity and specificity; use Q-learning so an AI learns Nim through self-play |
| [Project 5](https://cs50.harvard.edu/ai/projects/5/) | [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#project-5-traffic--cnn-training-for-traffic-sign-classification) | Train a neural network in TensorFlow to recognize 43 kinds of traffic signs, and write a README documenting the architectures you tried |
| [Project 6](https://cs50.harvard.edu/ai/projects/6/) | [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6a-parser--parsing-sentences-with-a-cfg-and-extracting-noun-phrases), [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head) | Write a CFG grammar to parse sentences and extract noun phrases; predict a masked word with BERT and draw its attention |

The project names in the table link to the project sections of this series' guides, and "Project N" links to the official page. The comparison of all twelve projects is in [cross-week review 2](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en).

Three things about doing the projects depend on the age of the recordings:

- **Use the files on the current course site.** The recordings are from 2020; the projects are not. For Degrees, the distribution code downloads from a `2023/x` path and `check50` uses the slug `ai50/projects/2024/x/degrees`. For every project use the download URL and commands on the official spec page, and do not piece things together with starter code from another year. The spec pages state that the latest Python to use in this course is 3.12.
- **The Week 6 projects are Parser and Attention.** The 2020 edition's Questions project (TF-IDF question answering) is no longer listed on the current site, but the 2020 spec page can still be reached; do not follow it.
- **Autograding needs accounts.** The submission flow of [`check50`](https://cs50.readthedocs.io/projects/check50/en/latest/index.html) and [`submit50`](https://cs50.readthedocs.io/submit50/) has you log in with a GitHub account, and the course site also asks you to create an edX account first. Without accounts you can still check your answers against the examples on the spec pages; the weekly guides list the examples available for each project.

## Prerequisites and a self-check

The prerequisite on the official page is: [CS50x](https://cs50.harvard.edu/x), or at least one year of experience with Python. No linear algebra or probability is required: probability is taught from its definitions in Week 2, and for gradient descent in Week 5 the lecturer says explicitly that he will not go into the calculus.

The three questions below were written for this post, to help you judge whether it is too early to start. The code fragments in the first two come from the course's official files and this series' reference implementations.

**Check yourself. Write your answer down before opening the fold.** With `pages = ["a", "b", "c", "d"]`, what is the value of `{page: 1 / len(pages) for page in pages}`?

<details>
<summary>Answer and criterion</summary>

A dictionary whose four keys each map to 0.25: `{"a": 0.25, "b": 0.25, "c": 0.25, "d": 0.25}`.

Criterion: if you can say this without running it, your Python is enough to start. The PageRank reference implementation in the Week 2 guide has a nearly identical line. If dictionary comprehensions are unfamiliar, the projects' distribution code will be hard going; work on Python first.

</details>

**Check yourself. Write your answer down before opening the fold.** The official `util.py` contains `class QueueFrontier(StackFrontier):`, and the class defines only a `remove` method. Where does `QueueFrontier`'s `add` method come from?

<details>
<summary>Answer and criterion</summary>

It is inherited from `StackFrontier`. `QueueFrontier` overrides only `remove` (to take out the node that was added earliest) and uses the parent class's other methods as they are.

Criterion: being able to say "inheritance" and "overriding one method" is enough. This is exactly the point of Week 0: the programs for DFS and BFS differ only in which node `remove` takes.

</details>

**Check yourself. Write your answer down before opening the fold.** Roll two dice. What is the probability that they sum to 12?

<details>
<summary>Answer and criterion</summary>

1/36. Two dice have 6 × 6 = 36 equally likely outcomes, and only (6, 6) sums to 12.

Criterion: it does not matter if you cannot answer this one. The Week 2 lecture starts from the sum of two dice, so you do not need to have studied probability beforehand.

</details>

## How to take the course and where to start

**Three routes.** The site lists five entry points, which fall into three routes:

1. **The free OpenCourseWare** (the route this series follows): follow the [course site](https://cs50.harvard.edu/ai/) directly. The spec pages say work is graded within five minutes of submission, and progress is recorded in the [Gradebook](https://cs50.me/cs50ai). Score at least 70% on every project and you can claim the free [CS50 Certificate](https://cs50.harvard.edu/ai/certificate/); Knights is the exception, since its spec page says it must be 100% correct to pass.
2. **An edX certificate**: for an edX verified certificate, enroll through the [edX version](https://cs50.edx.org/ai) instead; a professional certificate has its own entry point. Fees and identity verification are described on edX's pages.
3. **Credit**: register with [Harvard Extension School](https://web.dce.harvard.edu/extension/csci/e/80) or the corresponding Harvard Summer School section. This site's [Harvard AI/ML course map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) audited the Summer 2026 offering: it still uses the 2020 recordings, and Gradescope, sections, and office hours are reserved for enrolled students.

**Reading path.** Read Week 0 through Week 6 in order. The first half of each guide follows the lecture recording, with a time link and one self-check question per section; the second half covers that week's projects. After the seven weeks, [cross-week review 1](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en) lays out how the weeks relate, [cross-week review 2](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en) compares the twelve projects, and the [course retrospective](/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en) covers what the course leaves out and what to read next.

**Three steps you can take tonight:**

1. Open the [Degrees spec page](https://cs50.harvard.edu/ai/projects/0/degrees/), download the distribution code, and read the Understanding section.
2. Write `shortest_path`. The spec's Background section already says how: use breadth-first search. If you get stuck, read two sections of the Week 0 guide, [Nodes, the frontier, and the generic search loop](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#nodes-the-frontier-and-the-generic-search-loop) and [DFS and BFS](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#dfs-and-bfs-the-only-difference-is-which-node-leaves-the-frontier), which have time links into the recording.
3. Run `python degrees.py large` and enter Emma Watson and Jennifer Lawrence; the sample output on the spec page is 3 degrees. If you have accounts, also run `check50 ai50/projects/2024/x/degrees`.

If you can get through these three steps, the other eleven projects follow the same workflow. If reading the spec alone stalls you, do [CS50x](https://cs50.harvard.edu/x) or a year of Python first, then come back.

## Course video sources

The video embedded at the top is the first in the official CS50 YouTube playlist (CS50's Introduction to Artificial Intelligence with Python, 8 videos), which was checked live on 2026-10-10; this video's title, runtime, upload date, and embeddability were checked again with yt-dlp on 2026-10-13.

Original video: [Introduction - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=gR8QvFmNuLE) (runtime 1:53, uploaded 2023-07-24)

Course and recording entries:

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

Checked: 2026-10-10 (playlist), 2026-10-13 (introduction video).

Basis: this introduction has no subtitle track (checked with yt-dlp on 2026-10-13). The section "The main line of the course" is based on a machine transcript (Whisper large-v3-turbo, not proofread by a person), read in full for all 1 minute 53 seconds; this post only paraphrases the topics the video previews in order, quotes nothing verbatim, and gives no time links. The video does not say which week each topic falls in; the mapping to weeks is this post's, following the week pages on the course site. The content of the seven lectures is not based on this video; each follows its own weekly guide.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlist was checked live; no recording corresponds to this post, so the status stays official entry only.
- 2026-10-13: Corrected the Project 6 note: the Attention project predicts a masked word with BERT and draws attention diagrams; it does not implement self-attention.
- 2026-10-13: Rewritten from scratch as a course overview against the rewritten weekly guides and the course site. The official playlist's first video, the short course introduction, is now embedded at the top and the status is "Videos included"; the new section "The main line of the course" paraphrases it from a machine transcript. The title and tldr now say what the course teaches (the old title was "Seven Weeks, Twelve Projects, and How to Follow a Course Filmed in 2020"). "What each of the seven weeks teaches" changed from a table of topic names to each week's mechanism with links to the weekly guides; a Q-learning example worked to the end and three prerequisite checks with criteria are new. The two former sections on versions ("The core tension", "Are 2020 recordings worth following in 2026?") no longer have their own headings; the three points that affect what you do moved into the projects section. Corrected facts: projects are not "complete programs written from scratch" but functions you fill in within the distribution code; the things you end up having built were listed as "search engines, game-playing AIs", which the course has no projects for; the site lists five entry points, not four; the certificate condition now notes the 100% exception for Knights. Removed unsupported statements ("always near the top", "within months", "so many high schools and bootcamps run on this skeleton", "latest AI courses update tool names", "three days or fewer"). The `submit50` link, which returned 404, now points to the working documentation page.
- 2026-10-13: Fixes from independent review: the lectures are given by Brian Yu (the post said both instructors taught, which neither the transcripts nor the course site supports); the sentence mapping the introduction's six items onto seven weeks now says on the spot that the mapping is this post's; the status line now notes the machine-transcript basis.
- 2026-10-14: Fixes from re-review: the statement about instructors now follows the course site header and the edX course page (the header shows both names, and the edX course page lists both as instructors), with a link to the edX course page added.
- 2026-08-26: Initial version. Recording and assignment version status verified against the official site on August 26, 2026.

## References

- [CS50's Introduction to Artificial Intelligence with Python — course site](https://cs50.harvard.edu/ai/) — prerequisite, weekly workflow, the five entry points
- [Introduction (YouTube)](https://www.youtube.com/watch?v=gR8QvFmNuLE) — the basis of "The main line of the course"
- [Week 0 Search](https://cs50.harvard.edu/ai/weeks/0/) — lecture assets point to `cdn.cs50.net/ai/2020/spring/`
- [Week 6 Language](https://cs50.harvard.edu/ai/weeks/6/) — lecture assets point to `cdn.cs50.net/ai/2023/x/`; the current Week 6 projects
- [Projects overview](https://cs50.harvard.edu/ai/projects/)
- [Degrees project spec](https://cs50.harvard.edu/ai/projects/0/degrees/) — `2023/x` distribution, `ai50/projects/2024/x/degrees` slug, Python 3.12 cap, sample output, grading within five minutes
- [Knights project spec](https://cs50.harvard.edu/ai/projects/1/knights/) — the 100%-to-pass exception
- [CS50 Certificate page](https://cs50.harvard.edu/ai/certificate/) — free certificate requires at least 70% on every project
- [edX enrollment (verified certificate)](https://cs50.edx.org/ai)
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [Gradebook](https://cs50.me/cs50ai)
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — definitions of the A0–A3 access labels
- On this site: [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) — version audit of CSCI S-80 Summer 2026 vs. OCW
