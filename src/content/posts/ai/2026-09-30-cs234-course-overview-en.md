---
title: "Reading Stanford CS234: Overview and Self-Study Route (Winter 2026)"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, course-guide]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 0
tldr: "CS234 is Emma Brunskill's introductory reinforcement learning course at Stanford. It runs from planning in known MDPs through policy gradients, RLHF/DPO, bandit exploration, and MCTS. For Winter 2026, all 14 slide decks, the three assignment handouts with starter code, and the project spec can be downloaded without logging in, so this series rates it A3 (enough to self-study). The gaps: the site links no 2026 recordings, L15 and L16 have no slides, and the midterm and tutorials are not public. The public recordings are from Spring 2024, and this series uses them only as a supplement. Two 2024 lectures on offline RL have no counterpart in the 2026 slides."
description: "Series overview for Stanford CS234 Reinforcement Learning (Winter 2026), built from the official home page, lecture materials page, assignments page, project page, and the Spring 2024 YouTube playlist: where the course sits, prerequisites, learning outcomes, the on-campus and off-campus grading schemes, what outside readers can get, how the 2026 materials line up with the 2024 videos, and a 10-week self-study route that includes the final project."
draft: false
glossary:
  - term: "A3 enough to self-study"
    definition: "One of the access tiers on this site's course map: structured materials plus homework and the files needed to do it are public, so you can work through the course in order."
    context: "CS234 Winter 2026 is rated A3, but its public recordings are from Spring 2024."
  - term: "tutorials (CS234)"
    definition: "Small on-campus sessions added in Winter 2026: 30 minutes a week, four students and one CA, practicing how to explain course concepts. They count for 24% of the on-campus grade."
    context: "Off-campus students have no tutorials and use a different grading scheme."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-course-overview)

> **Source years**: slides, assignments, project spec, and grading are from Winter 2026 (classes started 2026-01-05 and ended in March). The public recordings are from Spring 2024 (YouTube). They are only a listening supplement, and the differences are flagged below. This is post 0 of the Reading Stanford CS234 series and its entry point.

[CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/) is Emma Brunskill's reinforcement learning course at Stanford. In Winter 2026 it met Mondays and Wednesdays, 3:00–4:20 pm. The schedule runs from January 5 to the final report deadline on March 17.

This post answers five questions: what the course covers, what you need first, what outside readers can actually get, how the 2026 materials pair with the 2024 recordings, and how to lay out ten weeks.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## What the course covers

The course description opens with a claim: realizing the impact of AI requires autonomous systems that learn to make good decisions, and reinforcement learning is one powerful way to get there. The course aims to give a solid introduction to RL, including its core challenges of generalization and exploration. The assignments cover RL basics, deep RL, and the basics of training with RL from human feedback.

The course outline in the [Lecture 1 slides](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf) has seven parts:

1. Markov decision processes and planning
2. Model-free policy evaluation
3. Model-free control
4. Policy search
5. Offline RL, including RLHF and DPO
6. Exploration
7. Advanced topics

Compared with [CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en), Stanford's deep RL course, CS234 spends more time on analysis: why methods converge and how much data they need. One of the learning outcomes on the home page asks you to evaluate RL algorithms on regret, sample complexity, computational complexity, empirical performance, and convergence.

## Prerequisites: four layers

| Prerequisite | What the site says | On this site |
|---|---|---|
| Python | All assignments are in Python; experience in C/C++, Matlab, or JavaScript is probably fine | — |
| Calculus and linear algebra | e.g. MATH 51, CME 100; comfortable with derivatives and matrix-vector notation | — |
| Probability and statistics | e.g. [CS109](/posts/learning/2026-08-21-stanford-cs109-probability-en); Gaussians, mean, standard deviation | [Reading CS109](/posts/learning/2026-08-21-stanford-cs109-probability-en) |
| ML foundations | Writing cost functions, taking derivatives, optimizing with gradient descent; CS221 or CS229 covers it | [Reading CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), [Reading CS221](/posts/ai/2026-08-21-stanford-cs221-ai-principles-en) |

The home page adds that some convex optimization makes a few of the optimization tricks more intuitive. Next to Lecture 1, the materials page links CS229's [linear algebra review](http://cs229.stanford.edu/section/cs229-linalg.pdf), [probability review](http://cs229.stanford.edu/section/cs229-prob.pdf), and a [Python tutorial](http://cs231n.github.io/python-numpy-tutorial/).

## Learning outcomes

The home page lists five, each tagged with how it is assessed:

1. Define the key features of RL that distinguish it from AI and non-interactive machine learning (exam)
2. Given an application problem, decide whether it should be formulated as an RL problem; if so, define it formally (state space, action space, dynamics, reward model), state which algorithm from class suits it best, and justify the choice (exam)
3. Implement common RL algorithms in code (assignments)
4. List and define multiple criteria for analyzing RL algorithms, and evaluate algorithms on them (assignments and exam)
5. Describe the exploration–exploitation challenge and compare at least two ways to address it (assignment and exam)

Outcome 2 is the spine of the course, and post 1 starts there.

## Grading: two schemes

The Winter 2026 grading section is titled "Will be Updated First Week of Class." The table below is what the page showed on 2026-09-30. On-campus students have mandatory tutorials, so their assignments weigh less:

| Item | On campus | Off campus |
|---|---|---|
| A1, A2, A3 | 7% each | 15% each |
| Tutorials | 24% (top 6 of 8) | none |
| Midterm | 25% | 25% |
| Quiz | 5% | 5% |
| Course project | 25% (proposal 1%, milestone 2%, poster 5%, paper 17%) | 25% (same) |

On the page, the midterm, quiz, and project are listed after both sub-lists. Each column sums to 100% only if they apply to both, so this post reads them as shared.

Tutorials are new in the 2026 design. The [Lecture 1 slides](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf) frame them as practice for a key skill, explaining your ideas: one 30-minute session a week with four students and a CA, starting in week 2. Participating earns 4/4, attending unprepared or silent earns 1/4, and absence earns 0.

Late days: 5 in total, at most 2 each on A1–A3, the proposal, and the milestone; none on the poster or the final paper. There is one midterm and one quiz. You may bring one single-sided handwritten page to the midterm and one double-sided page to the quiz.

## AI tools policy

The Academic Collaboration section allows generative AI tools such as Gemini, GPT-4, and Copilot under the same rules as human collaboration: you may not ask directly for solutions or copy code, and you must say that you used them. An LLM may not be listed as a collaborator on the project milestone or final report, because generative AI cannot take responsibility. Posting assignment solutions publicly, for example in a public git repo, also violates the honor code.

The assignment posts in this series explain what each problem practices and which functions you implement. They do not give solutions.

## What outside readers can get: A3, with four gaps

Using the tiers on this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), CS234 Winter 2026 rates **A3, enough to self-study**. Opened anonymously on 2026-09-30, these materials are available:

- Post-class slides for L1–L14 on the [lecture materials page](https://web.stanford.edu/class/cs234/modules.html) (L10 has only a post-class version)
- Two guest decks: Lecture 14 Guest Slides Part 2 ([ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf)) and Shane Gu's [World of World Modeling](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf)
- Question PDFs, LaTeX templates, and starter code for all three assignments on the [assignments page](https://web.stanford.edu/class/cs234/assignments.html) (A3's starter code is on Google Drive)
- The timeline and the proposal, milestone, and final report specs on the [project page](https://web.stanford.edu/class/cs234/project.html)

There are four gaps, and every post flags them:

1. **No public 2026 recordings.** The site links none. The page source of the materials page only keeps commented-out Canvas/Panopto links. The public recordings are from Spring 2024.
2. **No slides for L15 and L16.** `lecture15post.pdf` and `lecture16post.pdf` both return 404. The Week 9 Guest Lecture and the Week 10 "Alignment, Impacts" slot can only be reconstructed from the two guest PDFs and the second half of L10.
3. **Exams and tutorials are not public.** Midterm and quiz questions and solutions, tutorial content, the Gradescope autograder, and the course forum are all out of reach. The FAQ page linked from the home page currently returns 404.
4. **The project page's "Project Ideas" section still says "To be added,"** and there is no list of past projects.

## Why 2026 materials with 2024 videos

Winter 2026 is the baseline because it is the latest complete offering in the 2025–2026 academic year, and the assignments changed with it. For example, [A3](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf) has a full problem on direct preference optimization (6 points of writeup plus 19 points of coding).

The [Stanford Online Spring 2024 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) is the only public official recording: 16 videos, also taught by Emma Brunskill. This series treats it as a listening supplement because two things do not line up with 2026:

1. **The one 2024 lecture that actually teaches offline RL has no counterpart in the 2026 slides.** The 2024 Lecture 8 is titled "Offline RL 1," but its YouTube chapters show MaxEnt IRL and the start of RLHF, which line up with the second half of 2026 L7 and the first half of L8. The lecture that actually covers offline RL is Lecture 10, "Offline RL 3" (chapters from 5:51, "Offline reinforcement learning," through model-based and model-free policy evaluation and importance sampling). I converted all 14 post-class 2026 decks to text and searched for "offline": it appears once, in L4. The 2026 schedule does label Weeks 4–6 "Offline RL," but L7 and L8 actually cover PPO, imitation learning, and RLHF/DPO, and L9 moves to bandits. The Lecture 1 outline files RLHF and DPO under offline RL, which is probably where the schedule labels come from. This series does not invent 2026 offline RL content. If you want the topic, watch 2024 video 10 or read [CS224R's offline RL post](/posts/ai/2026-09-30-cs224r-offline-rl-en).
2. **DPO is taught differently.** The 2024 Lecture 9 is a DPO guest lecture by Rafael Rafailov, Archit Sharma, and Eric Mitchell. In 2026, Brunskill folds DPO into L8 herself.

### Video map

This map is based on video titles and YouTube chapters (checked 2026-10-01). I have not watched every video in full:

| 2024 video | Title | This series |
|---|---|---|
| [01](https://www.youtube.com/watch?v=WsvFL-LjA6U) | Introduction to Reinforcement Learning | Post 1 |
| [02](https://www.youtube.com/watch?v=gHdsUUGcBC0) | Tabular MDP Planning | Post 2 |
| [03](https://www.youtube.com/watch?v=jjq51TRNVvk) | Policy Evaluation | Post 4 |
| [04](https://www.youtube.com/watch?v=b_wvosA70f8) | Q learning and Function Approximation | Post 5; the DQN part from 58:04 goes with post 6 |
| [05](https://www.youtube.com/watch?v=L6OVEmV3NcE)–[07](https://www.youtube.com/watch?v=4ngb0IZTg8I) | Policy Search 1–3 | Posts 7, 8, 10 |
| [08](https://www.youtube.com/watch?v=IEbuJtjqtMU) | Offline RL 1 | Posts 10 and 11 (chapters are actually MaxEnt IRL and RLHF) |
| [09](https://www.youtube.com/watch?v=Q7rl8ovBWwQ) | Guest Lecture on DPO | Post 11 |
| [10](https://www.youtube.com/watch?v=F6APGIAm5fw) | Offline RL 3 | No 2026 counterpart; the first 6 minutes review RLHF/DPO, the rest is offline RL |
| [11](https://www.youtube.com/watch?v=sqYii3nd78w)–[13](https://www.youtube.com/watch?v=pc7oayCSZmQ) | Exploration 1–3 | Posts 13–15 |
| [14](https://www.youtube.com/watch?v=UgANzoWc0nc) | Multi-Agent Game Playing | Post 16 |
| [15](https://www.youtube.com/watch?v=FOlPpjNbHjE) | Emma Brunskill & Dan Webber | First 15 minutes wrap up AlphaZero (post 16); from 15:24, Dan Webber on value alignment (post 17) |
| [16](https://www.youtube.com/watch?v=eenJzay5aLo) | Value Alignment | Titled Value Alignment, but the chapters are a quiz review, a course recap, and RL case studies; no single matching post |

## The series arc

The official order already makes a good path: plan with a known model → evaluate without a model → control without a model → function approximation → search policies directly → learn from human data → data efficiency and exploration → planning plus learning → alignment. This series makes three adjustments:

1. **Posts follow topics, not PDFs.** Slide file boundaries do not match topic boundaries. For example, the first half of L5 is DQN and the second half is policy gradients. Each post says which part of which lecture it uses.
2. **Assignment posts come right after the lectures they need.** A1 follows MDP planning, A2 follows PPO, and A3 follows RLHF/DPO.
3. **The value alignment guest lecture moves to the end.** The second half of L10 is a value alignment guest talk. It is combined with the ethics guest PDF in one post instead of interrupting the bandit sequence.

```text
Problem setup (1) → With a model: planning (2) → A1 (3)
  → No model: evaluation (4) → control + function approx (5) → DQN (6)
    → Policy search: PG basics (7) → PPO/GAE (8) → A2 (9)
      → Learning from people: imitation/IRL (10) → RLHF/DPO (11) → A3 (12)
        → Data efficiency: bandits/UCB (13) → Thompson (14) → exploration in MDPs (15)
          → Planning + learning: MCTS/AlphaZero (16)
            → Wrap-up: value alignment (17) → world models guest (18)
```

| Post | Topic | Official material |
|---|---|---|
| 1 | [What RL is and the language of MDPs](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en) | L1 |
| 2 | [Planning with a model: policy evaluation, PI, VI](/posts/ai/2026-09-30-cs234-mdp-planning-en) | L2 |
| 3 | [A1: effective horizon, reward hacking, Bellman residuals, RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) | A1 |
| 4 | [Evaluation without a model: MC, TD(0)](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en) | L3, start of L4 |
| 5 | [Control without a model: SARSA, Q-learning, function approximation](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en) | L4 |
| 6 | [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en) | first half of L5 |
| 7 | [Policy gradients: REINFORCE, baselines, actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en) | second half of L5, first half of L6 |
| 8 | [Advanced policy gradients: PPO, GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en) | second half of L6, first half of L7 |
| 9 | [A2: implementing policy gradients and PPO](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en) | A2 |
| 10 | [Learning from demonstrations: BC, DAgger, IRL](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en) | second half of L7, start of L8 |
| 11 | [Learning from human preferences: RLHF, DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo-en) | L8 |
| 12 | [A3: RLHF, DPO, and best arm identification on Hopper](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en) | A3 |
| 13 | [Bandits, regret, UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) | L9, first half of L10 |
| 14 | [Thompson sampling and Bayesian bandits](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits-en) | L11 |
| 15 | [Exploration in MDPs: PAC, MBIE-EB, PSRL](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration-en) | L12 |
| 16 | [MCTS and AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero-en) | L13, L14 |
| 17 | [Value alignment](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en) | second half of L10, ethics guest PDF |
| 18 | [Guest: World of World Modeling](/posts/ai/2026-09-30-cs234-guest-world-models-en) | Shane Gu guest PDF |

## A 10-week self-study route

The left column shows the week labels and deadlines on the [Winter 2026 schedule](https://web.stanford.edu/class/cs234/). The right column is this series' suggested reading. The exams are not public, so midterm week becomes catch-up time.

| Week | Official schedule | Suggested reading |
|---|---|---|
| 1 | Introduction to RL, Tabular MDP Planning; A1 released | Posts 1–2; start A1 |
| 2 | Policy Evaluation, Q-learning and function approximation; A1 due (1/16) | Posts 3–5; submit A1 |
| 3 | Policy Search | Posts 6–7; start A2 |
| 4 | Policy Search, Offline RL / Imitation Learning; A2 due (2/1) | Posts 8–10; submit A2 |
| 5 | Offline RL / RLHF, Midterm; A3 released; proposal due (2/8) | Post 11; write the project proposal |
| 6 | Offline RL / Bandits, Strategic data gathering / Exploration | Posts 12–13; start A3 |
| 7 | Exploration; A3 due (2/20) | Post 14; submit A3 (Q4 needs the bandit ideas from post 13) |
| 8 | Exploration, RL and MCTS; milestone due (2/25) | Posts 15–16; write the milestone |
| 9 | Guest Lecture, In Class Quiz | Post 18; project experiments |
| 10 | Alignment, Impacts; poster session (3/11) | Post 17; make the poster |
| 11 | Final project writeup due (3/17) | Submit the final report |

### How to do the final project

The project page says novel research is welcome but not required for full credit. A method that fails is fine if you carefully show, with theory or experiments, why it did not work. "Not enough coding was done" does not count as a good reason. The page also encourages projects that reproduce recent results from an RL paper.

Teams can have up to three people. The staff strongly recommend three and expect the scope to scale with team size. There are three deliverables:

- **Proposal (200–400 words)**: what problem you will study and why it is interesting; what data, simulator, or real RL domain you will use; what method, algorithm, or theoretical analysis you propose; what literature you have read; how you will evaluate results and what plots or metrics you expect.
- **Milestone (2–3 pages, ICML template)**: an introduction and an approach section describing the steps done so far, ideally with early results, and a precise list of remaining work.
- **Final report (6–8 pages, ICML template)**: an abstract of at most 300 words, then introduction, background/related work, approach, theoretical results (if any), experiment results detailed enough to reproduce, conclusion, and references. Full proofs can go in supplementary material, which does not count toward the page limit.

The 2026 home page source contains a commented-out "default project / 4th assignment" option, and the project page comments it out too. So Winter 2026 has no default project, and outside readers need to pick their own topic.

## What you can do tonight

1. Open the [lecture materials page](https://web.stanford.edu/class/cs234/modules.html) and download the post-class slides for L1 and L2.
2. Read [Sutton & Barto chapter 1](http://incompleteideas.net/book/RLbook2018.pdf), the reading the materials page assigns to Lecture 1.
3. Download the [A1 questions](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) and [starter code](https://web.stanford.edu/class/cs234/assignments/a1/code.zip), and read the environment description in the RiverSwim problem.
4. Watch the [2024 Lecture 1 recording](https://www.youtube.com/watch?v=WsvFL-LjA6U) alongside the 2026 Lecture 1 slides, then read [post 1 of this series](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en).

## Further reading

These series on the site overlap with CS234. This series does not cut content because of the overlap; the links are here instead:

- [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en): Stanford's deep RL course, more focused on robotics and LLM applications. Related posts: [Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en), [Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en), [RLHF and preference optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)
- [Reading Berkeley CS285 Spring 2026](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en): another graduate deep RL course. Related posts: [imitation learning and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en), [policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en), [exploration and open problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- [Reinforcement learning: MDPs, value iteration, and continuous states (CS229 notes chapter 19)](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en): the RL chapter of a prerequisite course
- [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): where the A0–A3 tiers are defined

**Series navigation**: next, [What RL is and the language of MDPs](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS234 home page, schedule, and grading (Winter 2026)](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials (Winter 2026)](https://web.stanford.edu/class/cs234/modules.html)
- [CS234 Assignments (Winter 2026)](https://web.stanford.edu/class/cs234/assignments.html)
- [CS234 Course Project (Winter 2026)](https://web.stanford.edu/class/cs234/project.html)
- [Lecture 1 slides: Introduction to RL (2026 post-class)](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)
- [A1 questions (2026)](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf)
- [A2 questions (2026)](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [A3 questions (2026)](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf)
- [Ethics and Society guest slides, part 2](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf)
- [Shane Gu: World of World Modeling (2026 guest slides)](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf)
- [CS234 Spring 2024 archive](https://web.stanford.edu/class/cs234/CS234Spr2024/index.html)
- [Stanford CS234 Spring 2024 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.)](http://incompleteideas.net/book/RLbook2018.pdf)
