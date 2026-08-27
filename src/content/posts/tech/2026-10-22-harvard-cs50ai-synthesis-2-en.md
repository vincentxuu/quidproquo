---
title: "Harvard CS50 AI Synthesis (2): Project Portfolio — All 12 Projects Compared, Difficulty Tiered & Skill Mapped"
date: 2026-10-22
category: tech
tags: [harvard-cs50ai, ai, projects, comparison, difficulty, portfolio, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 9
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 9
tldr: "Synthesis 2: Complete comparison of 12 projects — core algorithms, LOC estimates, difficulty tiers, check50 acceptance criteria, transferable skills. With difficulty grading and learning sequence advice."
description: "Harvard CS50 AI series synthesis part 2: Deep dive into all 12 projects (Degrees, Tic-Tac-Toe, Knights, Minesweeper, Heredity, PageRank, Crossword, Shopping, Nim, Traffic, Parser, Questions). Comparing core algorithms, estimated lines of code, difficulty tiers, check50 verification points, and transferable skills. Provides project selection and learning sequence recommendations. Videos recorded 2020/2023; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-22-harvard-cs50ai-synthesis-2)

> ⚠️ **Version note**: Lecture videos are **Spring 2020 recordings (Weeks 0–5) and 2023 re-record (Week 6)**; project specs, distribution code, and check50 slugs follow the 2026 OCW site.

## TL;DR

Twelve projects span search, logic, probability, optimization, ML, RL, CNN, NLP — seven domains. Three difficulty tiers: Entry (Degrees, Shopping), Core (Tic-Tac-Toe, Knights, Minesweeper, Heredity, PageRank, Nim, Parser, Questions), Challenge (Crossword, Traffic). Strict week-order with immediate project parallelism recommended.

## Complete 12-Project Comparison Table

| # | Project | Week | Core Algorithm/Tech | Est. Core LOC | Difficulty | check50 Key Verification | Transferable Core Skills |
|---|---|---|---|---|---|---|---|
| 1 | **Degrees** | 0 | BFS Graph Search, Path Reconstruction | 30-50 | ⭐ Entry | Shortest path correctness, large dataset perf | Graph search abstraction, Frontier pattern, Path reconstruction |
| 2 | **Tic-Tac-Toe** | 0 | Minimax + Alpha-Beta | 60-90 | ⭐⭐ Core | Unbeatable strategy, deepcopy correctness, terminal detection | Adversarial tree search, Pruning, Recursive evaluation |
| 3 | **Knights** | 1 | Model Checking (Logic Inference) | 40-60 | ⭐⭐ Core | All 4 puzzles solved, logic encoding correct | Propositional logic modeling, Model checking, Knowledge engineering |
| 4 | **Minesweeper** | 1 | Sentence KB + Subset Inference | 80-120 | ⭐⭐ Core | Safe/mine inference accuracy, AI win rate | Dynamic KB, Forward chaining, Subset resolution |
| 5 | **Heredity** | 2 | Likelihood Weighting Sampling | 70-100 | ⭐⭐ Core | Probability convergence, prior/inheritance switching | Bayesian net sampling, Probabilistic inheritance calc |
| 6 | **PageRank** | 2 | Power Iteration + Random Walk | 50-80 | ⭐⭐ Core | Iteration convergence, sampling approx match, damping | Markov chain stationary dist, Random walk, PageRank |
| 7 | **Crossword** | 3 | AC-3 + Backtracking (MRV/LCV) | 150-250 | ⭐⭐⭐ Challenge | Large crossword solved, constraint propagation correct | CSP modeling, Arc consistency, Heuristic backtracking |
| 8 | **Shopping** | 4 | k-NN + StandardScaler | 40-60 | ⭐ Entry | Sensitivity/Specificity targets, feature encoding | Supervised classification pipeline, Feature preprocessing, Metrics |
| 9 | **Nim** | 4 | Q-learning (Table-based) | 60-90 | ⭐⭐ Core | Converged optimal policy, ε-greedy balance, Q-table update | MDP modeling, Tabular RL, Exploration/Exploitation |
| 10 | **Traffic** | 5 | CNN (Keras/TensorFlow) | 80-120 | ⭐⭐⭐ Challenge | Test accuracy, model save/load format | CNN architecture design, Training loop, Regularization, Transfer learning basics |
| 11 | **Parser** | 6 | CYK + Recursive Generation | 60-90 | ⭐⭐ Core | Syntax judgment correct, generated sentences valid | CFG parsing, Dynamic programming, Ambiguity handling |
| 12 | **Questions** | 6 | TF-IDF + Cosine Similarity | 80-110 | ⭐⭐ Core | Doc/sentence retrieval accuracy, Answer extraction | Statistical NLP pipeline, Vector space model, Information retrieval |

## Difficulty Tier Details

### ⭐ Entry Tier (Warm-up, Confidence Building)

**Degrees** — *BFS Shortest Path*
- **Why Simple**: Distribution provides `Node`, `QueueFrontier`, `neighbors_for_person`; just implement standard BFS loop
- **Key Pitfall**: `result` no deepcopy needed (single path); Goal check at enqueue optimizes
- **Verification**: `check50` tests small/large datasets; large must complete within time limit

**Shopping** — *k-NN Classification*
- **Why Simple**: `sklearn.neighbors.KNeighborsClassifier` one-liner; focus on data cleaning & `evaluate` implementation
- **Key Pitfall**: `Month`→numeric, `VisitorType`/`Weekend`→bool; **Must use `StandardScaler`** or distance distorted
- **Verification**: `evaluate` returns `(sensitivity, specificity)` not accuracy

### ⭐⭐ Core Tier (Must Master, Interview Staples)

**Tic-Tac-Toe** — *Minimax + αβ*
- **Core Challenge**: `result` **MUST deepcopy** (`copy.deepcopy`), else parallel board exploration corrupts state
- **Alpha-Beta Key**: `alpha` init `-inf`, `beta` init `+inf`; Prune when `v >= beta` / `v <= alpha`
- **Verification**: `check50` tests all legal positions; AI must **never lose** (draw or win)

**Knights** — *Logic Puzzle Encoding*
- **Core Challenge**: Puzzle 3 trickiest — A's utterance unknown, but logical constraints still encodable
- **Encoding Pattern**: Identity `Or(AKnight, AKnave) ∧ ¬(AKnight ∧ AKnave)` + Utterance `Implication(AKnight, stmt) ∧ Implication(AKnave, ¬stmt)`
- **Verification**: Requires **100% pass** (not 70%), all four puzzles solved

**Minesweeper** — *Dynamic KB Inference*
- **Core Challenge**: `add_knowledge` iterates to fixpoint; Subset inference `S1 ⊂ S2 → S2-S1 = c2-c1` easily missed
- **Key Detail**: `mark_mine` removes cell → `count -= 1`; `mark_safe` removes cell → `count` unchanged
- **Verification**: AI auto-infers safe cells & mines across board configurations

**Heredity** — *Bayesian Net Sampling*
- **Core Challenge**: Likelihood weighting weight: `weight = ∏ P(evidence | parents)`; Prior vs inheritance probability switching
- **Mutation Handling**: Parent gene transmission flips with `mutation` probability
- **Verification**: Probability distributions converge, marginals reasonable

**PageRank** — *Markov Chain Stationary Distribution*
- **Core Challenge**: No-outlink pages treated as linking to all; Iteration threshold `0.001`; Sampling needs large N
- **Two Algorithm Consistency**: `check50` compares Iterative vs Sampling result closeness
- **Verification**: PageRank values sum to 1 (normalized)

**Nim** — *Q-learning*
- **Core Challenge**: State as `tuple(piles)` for Q-table key; Update `Q ← Q + α(R + γ max Q' - Q)`; γ=1 (finite horizon)
- **Exploration**: Training `ε=0.1`, Inference `ε=0` pure greedy
- **Verification**: Trained AI beats human/random with near-100% win rate

**Parser** — *CYK Syntax Parsing*
- **Core Challenge**: Grammar must be CNF (distribution handles); CYK table fill order: length 1→n, split point k
- **Generation Logic**: Recursive random production choice; Terminals emit directly
- **Verification**: Valid/invalid sentence judgment correct, generated sentences grammatical

**Questions** — *TF-IDF QA*
- **Core Challenge**: TF normalized (divide by max TF), IDF `log(N/df)`, Cosine similarity sparse vectors
- **Two-Stage Retrieval**: Find doc → Find sentence; Sentence-level uses "query term coverage density" tie-break
- **Verification**: Output best answer sentence per question

### ⭐⭐⭐ Challenge Tier (Most Time-Consuming, Integration Test)

**Crossword** — *Complete CSP Solver*
- **Why Hardest**: Must correctly chain AC-3 → MRV → LCV → Forward Checking → Backtracking; Any broken link causes exponential blowup
- **Key Optimizations**:
  - `add_constraints` builds all overlap constraints
  - `forward_check` filters neighbor domains immediately after assignment
  - `count_conflicts` implements LCV ordering
- **Verification**: Large structures (e.g., `structure3.txt`) must solve in reasonable time

**Traffic** — *CNN Training*
- **Why Hard**: Not algorithmic — **Deep Learning Engineering** — Architecture design, Hyperparameter tuning, Training stability
- **Key Decisions**:
  - How many Conv2D layers, filters, kernel sizes
  - BatchNorm placement (Post-Conv vs Post-ReLU debate)
  - Dropout rates, Learning Rate, Early Stopping patience
- **Verification**: `check50` loads `traffic_model.h5` on hidden test set, **Accuracy threshold high** (~95%+)

## Suggested Learning Sequence & Time Estimates

```
Week 0: Degrees (2-4h) → Tic-Tac-Toe (4-6h)
Week 1: Knights (3-5h) → Minesweeper (6-10h)
Week 2: Heredity (4-6h) → PageRank (3-5h)
Week 3: Crossword (10-20h) ⚠️ Reserve ample time
Week 4: Shopping (2-3h) → Nim (4-8h)
Week 5: Traffic (6-15h) ⚠️ GPU/CPU dependent, includes tuning
Week 6: Parser (3-5h) → Questions (4-7h)
```

**Total Estimate**: 60-100 hours (incl. debugging, refactoring, check50 iterations)

## Project Skill Transfer Map

```
Graph Search Foundation (Degrees)
    │
    ├─► Adversarial Search (Tic-Tac-Toe)
    │     │
    │     └─► Roots of MCTS, AlphaZero
    │
    ▼
Logic Inference (Knights, Minesweeper)
    │
    ├─► SAT/SMT Solver Foundations
    │
    ▼
Probabilistic Inference (Heredity, PageRank)
    │
    ├─► Variational Inference, MCMC, Bayesian Optimization
    │
    ▼
Constraint Solving (Crossword)
    │
    ├─► Scheduling, Path Planning, Combinatorial Optimization
    │
    ▼
Traditional ML (Shopping)
    │     │
    │     └─► Feature Engineering, Model Selection, Evaluation
    │
    ▼
Tabular RL (Nim)
    │     │
    │     └─► Deep Q-Network (DQN), Actor-Critic
    │
    ▼
Deep Learning (Traffic)
    │     │
    │     └─► ResNet, EfficientNet, ViT, Object Detection
    │
    ▼
Statistical/Symbolic NLP (Parser, Questions)
          │
          └─► Transformer, BERT, GPT, RAG
```

## Common Sticking Points & Fixes

| Project | Common Block | Fix |
|---|---|---|
| Tic-Tac-Toe | AI sometimes loses | Check `result` uses `deepcopy`; Alpha-Beta bound updates correct |
| Minesweeper | Infinite loop | `add_knowledge` `inferred` flag logic; Clean empty sentences |
| Crossword | Too slow/unsolvable | Verify AC-3 correct; MRV/LCV heuristics active; Forward Checking pruning |
| Heredity | Probabilities don't converge | Increase sample N; Check weight calc; Prior/Inheritance logic |
| Traffic | Accuracy below threshold | Deepen net; Increase Dropout; Tune LR; Data Augmentation; Verify normalization |

## Series Links

- [Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) (order 0)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) (order 1)
- [Week 1 Knowledge](/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge-en) (order 2)
- [Week 2 Uncertainty](/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty-en) (order 3)
- [Week 3 Optimization](/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization-en) (order 4)
- [Week 4 Learning](/posts/tech/2026-09-24-harvard-cs50ai-w04-learning-en) (order 5)
- [Week 5 Neural Networks](/posts/tech/2026-10-01-harvard-cs50ai-w05-neural-networks-en) (order 6)
- [Week 6 Language](/posts/tech/2026-10-08-harvard-cs50ai-w06-language-en) (order 7)
- [Synthesis 1: Knowledge Arc](/posts/tech/2026-10-15-harvard-cs50ai-synthesis-1-en) (order 8)
- **This Post: Synthesis 2** (order 9)
- [Wrap-up: Timeless vs Changed, Next Steps](/posts/tech/2026-10-29-harvard-cs50ai-wrapup-en) (order 10)

## References

- [CS50 AI Projects Overview](https://cs50.harvard.edu/ai/projects/) — All 12 project spec links
- Individual Project Specs: Degrees, Tic-Tac-Toe, Knights, Minesweeper, Heredity, PageRank, Crossword, Shopping, Nim, Traffic, Parser, Questions
- [check50 Documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [CS50 AI YouTube Playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 Tier Definition
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — Series Entry & Version Notes