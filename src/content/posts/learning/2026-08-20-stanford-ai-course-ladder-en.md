---
title: "The Stanford AI Course Ladder: Order It by Prerequisites, and Check Whether the Course Still Runs"
date: 2026-08-20
category: learning
tags:
  - stanford
  - ai-course
  - learning-path
  - cs-course
  - llm
  - self-study
lang: en
type: guide
series:
  name: "Reading Stanford CS Courses"
  order: 2
tldr: "Most Stanford AI course maps online are ordered by course number or by impression, but Stanford publishes an official prerequisite chain — CS221's entry names CS103, CS106B, CS109, and CS161 outright. This piece orders the ladder by those prerequisites and adds one step: checking each course's offering record on ExploreCourses. CS324, CS329S, and CS329D were last offered in 2023, 2022, and 2023; the much-cited CS329A last ran in autumn 2025, and CS229S — one of its two listed prerequisites — last ran in autumn 2024."
description: "A prerequisite-ordered ladder through Stanford's AI courses from CS221 to CS336 and CS329A, built on official ExploreCourses entries, covering the NLP/LLM, vision, reinforcement learning and robotics, and graph branches, with each course's most recent offering and four suggested routes."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-20-stanford-ai-course-ladder)

[The previous piece](/posts/learning/2026-08-20-stanford-cs-course-map-en) mapped Stanford CS courses by one test: can you get the materials? This one covers only the AI line, and switches the test to **official prerequisites**.

The reason for switching is that the AI line has too many courses to order by number without getting it wrong. CS221 is a 200-level course but it's the entry point; CS124 is 100-level yet expects you to have done CS109 and to be at roughly CS107's level. Stanford says itself that it has no standardized numbering system, so ordering these means reading each course's `Prerequisites` field.

Working through them surfaced something that deserves checking even before prerequisites, and it's in the second half: **several widely cited "advanced AI courses" haven't been offered in years.**

## The base: CS221's prerequisite field names four courses outright

You don't have to guess which courses count as foundational. CS221's ExploreCourses entry lists CS103, CS106B, CS109, and CS161, and adds that the staff highly recommend comfort with these concepts before taking the course. Those four, plus CS106A, are the base of the AI line; the previous piece walks through each.

CS109 deserves separate mention. Probability isn't nice-to-have here, it's the shared language of everything downstream: CS224W lists CS109 plus any introductory ML; CS234 wants basic probability; CS336 wants CS109-level probability and statistics. **Skipping CS109 doesn't cost you in the next course, it costs you in every course after that.**

CS107 sits differently. It isn't in CS221's prerequisites, but CS124's prerequisites include "programming maturity and knowledge of UNIX equivalent to CS107," and CS348K requires CS107 outright. If you want to do AI engineering rather than only read models, this one repays the time.

## Three entry points — take at least two

Stanford's way into AI isn't one course, it's three doors facing different directions.

**CS221: Artificial Intelligence: Principles and Techniques** is the standard one. It frames AI as making good decisions given incomplete information (hence probability) and limited computation (hence algorithms), covering search, constraint satisfaction, game playing, Markov decision processes, graphical models, machine learning, and logic. It's the only entry course that shows you the AI that isn't deep learning.

**CS124: From Languages to Information** is the language-and-information door, and the formal start of the NLP line. The official description already runs from regular expressions through logistic regression and gradient descent to transformers and large language models, with applications in chatbots, information retrieval, social computing, and recommender systems. Its prerequisites are stiffer than the number suggests: CS106B, Python at CS106A level, CS109, plus CS107-level UNIX and programming maturity.

**CS238: Decision Making under Uncertainty** (cross-listed as AA228) is the decision-and-uncertainty door — the smoothest way in if you're heading for reinforcement learning, planning, or autonomous systems.

## The trunk: CS229 and CS230, with CS228 optional in between

Past the entry courses comes the work of actually building modelling ability.

**CS229** is the theory side, laying the statistical assumptions bare. **CS230** is the practice side, run as a flipped classroom with videos and programming assignments on the deeplearning.ai Coursera specialization. They aren't either/or — as the previous piece noted, CS230's core material is the easiest of any of these for a self-learner to reach.

**CS228: Probabilistic Graphical Models** fills in probabilistic reasoning: Bayesian and Markov networks, hidden Markov models, dynamic Bayesian networks, exact and approximate inference. Its stated prerequisites are only "basic probability theory and algorithm design and analysis" — lower than most people assume. It runs in winter of the 2026-27 year.

**CS229S: Systems for Machine Learning** is for people who want the infrastructure rather than the model: efficiency of data preparation, training, deployment, and inference at each level of the software and hardware stack. Prerequisite is CS224N or CS229. There's a catch with this one, covered in a later section.

**What to do**: if you can't decide between starting at CS229 or CS230, read chapter one of CS229's public lecture notes PDF. If it doesn't go down, start with CS230. That beats any self-assessment.

## Four branches

### NLP / LLM / Agents

This branch has the most complete prerequisite chain of the four — you can follow it end to end.

| Number | Title | Official prerequisites |
|---|---|---|
| CS124 | From Languages to Information | CS106B, Python, CS109, CS107-level |
| CS224N | Natural Language Processing with Deep Learning | calculus and linear algebra; CS124, CS221, or CS229 |
| CS224U | Natural Language Understanding | CS224N or CS224S |
| CS224V | Agentic AI | one of LINGUIST 180/280, CS124, CS224N, CS224S, CS224U |
| CS329X | Human Centered NLP | — |
| CS329A | Self-Improving AI Agents | CS224N or CS229S |
| CS336 | Language Modeling from Scratch | Python, PyTorch, systems concepts, calculus and linear algebra, CS109-level probability |

**CS224V is now called Agentic AI** — a 2026 name. The course works directly on RAG and formal task descriptions, hybrid reasoning across databases and knowledge bases, AI-driven knowledge curation for scientific research, improving the accuracy and interpretability of decision-making agents through formal methods, and efficiency techniques for long-horizon agents. If you want to build agents and would rather have a real course than a blog post, this one is underrated.

**CS329X: Human Centered NLP** covers human-centered design, human-in-the-loop algorithms, fairness, and accessibility. It's easy to write off as a soft elective, but it handles exactly the class of problems that blows up first when a model becomes a product.

### Vision

**CS231A: Computer Vision** covers cameras and projection models, filtering and edge detection, segmentation and clustering, stereo reconstruction, and object and scene recognition. Its old number was CS223B, and the prerequisites are only linear algebra and basic probability and statistics. **CS231N: Deep Learning for Computer Vision** is the deep learning side — and note that its title is no longer "Convolutional Neural Networks for Visual Recognition," which many course maps still use.

On ordering, having CS229 or CS230 before CS231N makes it much smoother; CS231A can run alongside or after.

### Reinforcement learning and robotics

`CS221 → CS238 → CS234 → CS223A → CS333`.

**CS234: Reinforcement Learning** states its prerequisites plainly: proficiency in Python, CS229 or equivalent, linear algebra, basic probability. **CS223A** is the robotics foundation course, taught by Oussama Khatib. **CS333** is a project-based graduate course pulling robotics, machine learning, and control theory into human-AI interaction; officially it only recommends an introductory AI course.

### Graphs and networks

**CS224W: Machine Learning with Graphs** asks for CS109 plus any introductory machine learning course — a low bar for this tier. It covers representation learning and graph neural networks, web algorithms, reasoning over knowledge graphs, influence maximization, and social network analysis.

## The top tier: research-level

What these have in common isn't teaching models again, it's demanding that you do research, build systems, or run a whole pipeline from zero.

**CS336: Language Modeling from Scratch** is the only one flagged **Application required**. You do the whole thing yourself: data collection and cleaning, transformer construction, training, evaluation.

**CS312** takes a different line. It argues that knowledge and math ability alone aren't enough — inventing the next generation of architectures takes running very many experiments — so the course walks students through gaining mastery in computationally tractable domains via efficient experimentation and predicting experiment outcomes. It's taught by Tatsunori Hashimoto, who also co-teaches CS336.

**CS329A: Self-Improving AI Agents** is a graduate seminar covering constitutional AI, learned verifiers, scaling test-time compute, combining search with LLMs, tool use and retrieval, multimodal web interaction, multi-step reasoning and planning, and robust evaluation and orchestration frameworks. All nine lectures are public on Stanford Online's YouTube channel.

**CS329Z: Engineering AI Agents** teaches compound AI systems: students first build the core components — RAG, tool use, agent loops — from scratch, then learn how frameworks like DSPy abstract those patterns. It runs in autumn of the 2026-27 year.

The safety and reliability group is the most notable shift in this tier, because it has stopped being peripheral. **CS221M: Mechanistic Interpretability** covers probing, steering, causal abstraction, and sparse autoencoders, with emphasis on causal methods and large language models. **CS329H: Machine Learning from Human Preferences** handles preference heterogeneity and aggregation, interpretation of human feedback, and privacy. **CS329T** runs from foundation models, prompting, and RAG through agent architectures and evaluation. All three are offered in 2026-27.

## Check whether it runs before you check prerequisites

This section is the most useful part here, and it's what surprised me most after checking every course against ExploreCourses.

Course maps circulating online — including the one that prompted this piece — routinely list a batch of advanced AI courses as offered this year. Checked against the catalog, four of them look like this:

| Number | Title | Last offered, per ExploreCourses |
|---|---|---|
| CS329S | Machine Learning Systems Design | Winter 2022 |
| CS324 | Advances in Foundation Models | Winter 2023 |
| CS329D | Machine Learning Under Distributional Shifts | Spring 2023 |
| CS229S | Systems for Machine Learning | Autumn 2024 |
| CS329A | Self-Improving AI Agents | Autumn 2025 |

There's a small knot in there: **CS329A lists CS224N or CS229S as prerequisites, and CS229S hasn't run in two years.** For an enrolled student that just means "take the CS224N route," but for a self-learner building a plan off an online map, this kind of detail is where the plan quietly dies.

Not offered doesn't mean not useful. CS324's course site and CS329A's nine recorded lectures are still up, and the content hasn't aged out. But **"is this course still running" and "can I still learn from its materials" are two different questions, and merging them produces a plan made of courses you can't take.**

**What to do**: search any course number on ExploreCourses and look at whether it shows "2026-2027 Autumn/Winter/Spring" or "Last offered: …". The first means it runs this year; the second means it doesn't, and the year tells you how long it's been. That check takes ten seconds and can save the whole plan.

## Four routes

**General AI research**: the four base courses → CS221 → CS229 → CS230 → CS228 → pick one branch → CS312 or CS221M. The closest thing to building full foundations before going research-directed.

**NLP / LLM / agents**: the four base courses → CS124 → CS221 → CS229 → CS224N → CS224U or CS224V → CS329X → CS329Z → CS336. The smoothest route if you're aiming at LLMs, RAG, tool use, and agents — and every step is backed by an official prerequisite relationship.

**Vision**: the four base courses → CS229 → CS230 → CS231A → CS231N.

**Reinforcement learning and robotics**: the four base courses → CS221 → CS238 → CS234 → CS223A → CS333.

One closing warning, same as the previous piece but sharper here: **don't make CS329A, CS329Z, or CS336 your first stop.** Read the prerequisite structure and these assume you already have machine learning, deep learning, NLP or LLM work, and systems and evaluation behind you. CS336 requires an application just to enroll. The four base courses look far away from AI, but they're the only part with no shortcut.

## Appendix: how this was checked, and the numbers

Course information comes from Stanford ExploreCourses entries for the 2026-2027 academic year, read on 2026-08-20. Prerequisites and offering records follow what that page displays; secondary summaries were not taken on trust.

- **CS221's official prerequisites**: CS103 (or CS103B/X), CS106B (or CS106X), CS109, CS161.
- **Units**: CS221M, CS329H, CS329X, CS329T, CS329Z are 3 each; CS224V 3–4; CS224W 3–4; CS228 3–4; CS231A 3–4; CS234 3; CS312 3–5; CS336 3–5.
- **Advanced courses offered in 2026-27**: CS221M (spring), CS224V (autumn), CS224W (autumn), CS224U (spring), CS228 (winter), CS231A (winter), CS223A (winter), CS329H (autumn), CS329T (spring), CS329X (autumn), CS329Z (autumn), CS312 (autumn), CS336 (spring, application required), CS333 (winter), CS224N (winter).
- **CS224N instructors**: Tatsunori Hashimoto and Diyi Yang; cross-listed as LINGUIST 284.
- **CS231A's old number**: CS223B.

Two items are marked not fully confirmed. CS312's title did not render as a heading in the ExploreCourses search results, though searching the exact phrase "Deep Learning Alchemy" returns that entry. CS238's own entry likewise failed to render; its existence and the AA228 cross-listing are inferred from CS239's prerequisite field, "AA 228/CS 238 or CS 221." Neither affects the ordering conclusions.

## References

- [Stanford Explore Courses](https://explorecourses.stanford.edu/) — source for every prerequisite, unit count, and offering record here
- [CS 221: Artificial Intelligence: Principles and Techniques](https://explorecourses.stanford.edu/search?q=Artificial+Intelligence+Principles+and+Techniques&view=catalog) — the four prerequisites, named officially
- [CS 124: From Languages to Information](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — description running from regex to large language models, plus prerequisites
- [CS 224N: Natural Language Processing with Deep Learning](https://explorecourses.stanford.edu/search?q=Natural+Language+Processing+with+Deep+Learning&view=catalog) — 2026-27 winter offering and prerequisites
- [CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — prerequisite CS224N or CS224S
- [CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — the renamed course's description and prerequisite list
- [CS 224W: Machine Learning with Graphs](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — prerequisite CS109 plus any introductory ML
- [CS 228: Probabilistic Graphical Models](https://explorecourses.stanford.edu/search?q=Probabilistic+Graphical+Models&view=catalog) — scope and prerequisites
- [CS 229S: Systems for Machine Learning](https://explorecourses.stanford.edu/search?q=CS+229S&view=catalog) — description and "Last offered: Autumn 2024"
- [CS 231A: Computer Vision](https://explorecourses.stanford.edu/search?q=CS+231A&view=catalog) — the old CS223B number and prerequisites
- [CS 234: Reinforcement Learning](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — prerequisites and scope
- [CS 312](https://explorecourses.stanford.edu/search?q=Deep+Learning+Alchemy&view=catalog) — the mastery-through-experiments stance and instructors
- [CS 324: Advances in Foundation Models](https://explorecourses.stanford.edu/search?q=CS+324&view=catalog) — description and "Last offered: Winter 2023"
- [CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — full topic list, prerequisite CS224N or CS229S, "Last offered: Autumn 2025"
- [CS 329D: Machine Learning Under Distributional Shifts](https://explorecourses.stanford.edu/search?q=CS+329D&view=catalog) — "Last offered: Spring 2023"
- [CS 329H: Machine Learning from Human Preferences](https://explorecourses.stanford.edu/search?q=CS+329H&view=catalog) — description and 2026-27 autumn offering
- [CS 329S: Machine Learning Systems Design](https://explorecourses.stanford.edu/search?q=CS+329S&view=catalog) — "Last offered: Winter 2022"
- [CS 329T](https://explorecourses.stanford.edu/search?q=CS+329T&view=catalog) — prerequisite CS229-level ML plus deep learning
- [CS 329X: Human Centered NLP](https://explorecourses.stanford.edu/search?q=CS+329X&view=catalog) — description and 2026-27 autumn offering
- [CS 329Z: Engineering AI Agents](https://explorecourses.stanford.edu/search?q=Engineering+AI+Agents&view=catalog) — compound AI systems and DSPy in the course description
- [CS 333](https://explorecourses.stanford.edu/search?q=CS+333&view=catalog) — project-based course on human-AI interaction
- [CS 336: Language Modeling from Scratch](https://explorecourses.stanford.edu/search?q=Language+Modeling+from+Scratch&view=catalog) — the application-required note and 2026-27 spring offering
- [CS336 course site](https://cs336.stanford.edu) — lectures, assignments, and the prerequisite text
- [CS229 lecture notes PDF](https://cs229.stanford.edu/main_notes.pdf) — chapter one, for the self-assessment above
- [Stanford CS329A Self-Improving AI Agents, Part 1 (YouTube)](https://www.youtube.com/watch?v=6YnLB0XbTnI) — the public nine-lecture recordings
- Related on this site: [A Reading Guide to Stanford's CS Courses](/posts/learning/2026-08-20-stanford-cs-course-map-en), [the CS230 series](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en), [CS146S syllabus diff](/posts/ai/2026-08-16-cs146s-course-map-en)
