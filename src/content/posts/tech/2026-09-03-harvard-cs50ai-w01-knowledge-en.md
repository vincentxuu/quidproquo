---
title: "Harvard CS50 AI Week 1: Knowledge — Propositional Logic, Model Checking, Inference Rules & Knowledge Representation"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, logic, knowledge, model-checking, resolution, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 2
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 2
tldr: "Week 1 shifts to knowledge representation: propositional logic syntax, model checking, Modus Ponens/Resolution inference, CNF conversion. Projects: Knights (logic puzzles) and Minesweeper (probabilistic inference)."
description: "Detailed guide to Harvard CS50 AI Week 1 Knowledge: lecture highlights, video timestamps, propositional logic connectives, model checking & Resolution inference, knowledge engineering examples, plus Knights and Minesweeper project specs and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 1 moves from search to knowledge representation: encode the world in propositional logic, verify entailment via model checking, scale reasoning with Resolution. Two projects map to logic puzzle solving (Knights) and Minesweeper inference (Minesweeper).

## Lecture Video & Timestamps

YouTube Playlist: [CS50 AI 2020 Full Playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm) (Week 1 is the 2nd video)

| Timestamp | Content |
|---|---|
| 00:00–06:00 | Knowledge-based agents intro, Harry Potter reasoning example |
| 06:00–18:00 | Propositional logic syntax: symbols, connectives, truth tables |
| 18:00–28:00 | Models, Knowledge Base, entailment |
| 28:00–42:00 | Model checking algorithm: recursive model enumeration, Python implementation |
| 42:00–52:00 | Knowledge engineering examples: Clue deduction, Mastermind |
| 52:00–1:04:00 | Inference rules: Modus Ponens, And Elimination, Double Negation, Implication Elimination, De Morgan, Distributive |
| 1:04:00–1:14:00 | Resolution: complementary literals, clauses, CNF conversion, proof by contradiction |
| 1:14:00–1:22:00 | First-order logic: constants, predicates, universal/existential quantification |

> Full transcript: [Week 1 Notes](https://cs50.harvard.edu/ai/2020/notes/1/)

## Core Concepts Cheat Sheet

### Propositional Logic Connectives Truth Tables

| Connective | Symbol | P | Q | Result |
|---|---|---|---|---|
| Not | ¬ | F | — | T |
|  |  | T | — | F |
| And | ∧ | F | F | F |
|  |  | F | T | F |
|  |  | T | F | F |
|  |  | T | T | T |
| Or | ∨ | F | F | F |
|  |  | F | T | T |
|  |  | T | F | T |
|  |  | T | T | T |
| Implication | → | F | F | T |
|  |  | F | T | T |
|  |  | T | F | F |
|  |  | T | T | T |
| Biconditional | ↔ | F | F | T |
|  |  | F | T | F |
|  |  | T | F | F |
|  |  | T | T | T |

> **Key**: Implication is vacuously true when antecedent is false; Biconditional requires both directions to match.

### Model Checking Algorithm

```python
# Key classes from lecture's logic.py
class Symbol:
    def __init__(self, name): self.name = name
    def evaluate(self, model): return model[self]

class Not:
    def __init__(self, operand): self.operand = operand
    def evaluate(self, model): return not self.operand.evaluate(model)

class And:
    def __init__(self, *operands): self.operands = operands
    def evaluate(self, model): return all(op.evaluate(model) for op in self.operands)

# ... Or, Implication, Biconditional similar

def model_check(knowledge, query):
    """Returns whether KB entails query"""
    symbols = list({s for s in knowledge.symbols()} | {s for s in query.symbols()})
    return check_all(knowledge, query, symbols, {})

def check_all(knowledge, query, symbols, model):
    if not symbols:
        if knowledge.evaluate(model):
            return query.evaluate(model)
        return True
    else:
        remaining = symbols.copy()
        p = remaining.pop()
        model_true = model.copy(); model_true[p] = True
        model_false = model.copy(); model_false[p] = False
        return (check_all(knowledge, query, remaining, model_true) and
                check_all(knowledge, query, remaining, model_false))
```

> **Complexity**: n symbols → 2^n models. Only feasible for small KBs.

### Inference Rules Quick Reference

| Rule | Premise | Conclusion |
|---|---|---|
| Modus Ponens | α → β, α | β |
| And Elimination | α ∧ β | α (or β) |
| Double Negation | ¬¬α | α |
| Implication Elimination | α → β | ¬α ∨ β |
| Biconditional Elimination | α ↔ β | (α → β) ∧ (β → α) |
| De Morgan 1 | ¬(α ∧ β) | ¬α ∨ ¬β |
| De Morgan 2 | ¬(α ∨ β) | ¬α ∧ ¬β |
| Distributive | α ∧ (β ∨ γ) | (α ∧ β) ∨ (α ∧ γ) |

### Resolution & CNF

**Resolution Rule**: If clauses contain complementary literals (P, ¬P), resolve to new clause

```
   P ∨ Q        ¬P ∨ R
   ────────────────────
          Q ∨ R
```

**CNF Conversion (3 Steps)**:
1. Eliminate biconditionals: α ↔ β → (α → β) ∧ (β → α)
2. Eliminate implications: α → β → ¬α ∨ β
3. Push negations inward: De Morgan until only literals negated

**Proof by Contradiction Algorithm**: Check KB ⊨ α
1. Construct (KB ∧ ¬α)
2. Convert to CNF
3. Repeatedly apply Resolution
4. Empty clause derived → contradiction → KB ⊨ α
5. No new clauses & no empty clause → no entailment

---

## Project 1A: Knights — Logic Puzzle Solver

### Task

In `puzzle.py`, build knowledge bases `knowledge0`–`knowledge3` for four Knights and Knaves puzzles, using `logic.py`'s `model_check` for automated reasoning.

### Puzzle Rule Encoding

Each character is exactly one of Knight/Knave:
- `Or(AKnight, AKnave)`
- `Not(And(AKnight, AKnave))`  # cannot both be true

Knight speaks truth, Knave lies:
- `Implication(AKnight, statement)`  # if Knight, statement true
- `Implication(AKnave, Not(statement))`  # if Knave, statement false

### Four Puzzles Knowledge Bases Reference

```python
# puzzle.py snippet
from logic import *

# Symbols
AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")
BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")
CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0: A says "I am both a knight and a knave"
knowledge0 = And(
    Or(AKnight, AKnave),
    Not(And(AKnight, AKnave)),
    Implication(AKnight, And(AKnight, AKnave)),
    Implication(AKnave, Not(And(AKnight, AKnave)))
)

# Puzzle 1: A says "We are both knaves", B says nothing
knowledge1 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, And(AKnave, BKnave)),
    Implication(AKnave, Not(And(AKnave, BKnave)))
)

# Puzzle 2: A says "We are the same kind", B says "We are different kinds"
knowledge2 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, Or(And(AKnight, BKnight), And(AKnave, BKnave))),
    Implication(AKnave, Not(Or(And(AKnight, BKnight), And(AKnave, BKnave)))),
    Implication(BKnight, Or(And(AKnight, BKnave), And(AKnave, BKnight))),
    Implication(BKnave, Not(Or(And(AKnight, BKnave), And(AKnave, BKnight))))
)

# Puzzle 3: A says "I am a knight" or "I am a knave" (unknown which)
# B says "A said 'I am a knave'", B says "C is a knave"
# C says "A is a knight"
knowledge3 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Or(CKnight, CKnave), Not(And(CKnight, CKnave)),
    # A's utterance: whether A says "I am Knight" or "I am Knave",
    # the logical content is equivalent to "A is a Knight"
    Implication(AKnight, AKnight),
    Implication(AKnave, Not(AKnight)),
    # B's first claim: "A said 'I am a knave'"
    Implication(BKnight, Implication(AKnight, AKnave)),
    Implication(BKnave, Not(Implication(AKnight, AKnave))),
    # B's second claim: "C is a knave"
    Implication(BKnight, CKnave),
    Implication(BKnave, Not(CKnave)),
    # C's claim: "A is a knight"
    Implication(CKnight, AKnight),
    Implication(CKnave, Not(AKnight))
)
```

> **Tip**: Puzzle 3 is the trickiest. Key insight: whatever A says, its truth value is constrained by A's identity.

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/knights.zip
unzip knights.zip && cd knights

python puzzle.py
# Expected: prints knight/knave determination for each puzzle

check50 ai50/projects/2024/x/knights
# NOTE: Knights requires 100% to pass (not 70%)

style50 puzzle.py
```

---

## Project 1B: Minesweeper — Minesweeper AI

### Task

Complete `Sentence` class and `MinesweeperAI` class in `minesweeper.py` for a logic-based Minesweeper player.

### Knowledge Representation: `Sentence` Class

```python
# minesweeper.py snippet
class Sentence:
    def __init__(self, cells, count):
        self.cells = set(cells)  # set of (i, j)
        self.count = count       # int: mines among cells

    def known_mines(self):
        """If |cells| == count, all are mines"""
        if len(self.cells) == self.count and self.count > 0:
            return self.cells.copy()
        return set()

    def known_safes(self):
        """If count == 0, all are safe"""
        if self.count == 0:
            return self.cells.copy()
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            # count unchanged: safe cell contributes 0 to mine count
```

### AI Inference Core: `add_knowledge`

```python
class MinesweeperAI:
    def __init__(self, height=8, width=8):
        self.height = height
        self.width = width
        self.moves_made = set()
        self.mines = set()
        self.safes = set()
        self.knowledge = []

    def add_knowledge(self, cell, count):
        # 1. Mark move made
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # 2. New sentence: unknown neighbors = count
        neighbors = set()
        for i in range(cell[0]-1, cell[0]+2):
            for j in range(cell[1]-1, cell[1]+2):
                if (i, j) == cell: continue
                if 0 <= i < self.height and 0 <= j < self.width:
                    if (i, j) not in self.safes and (i, j) not in self.mines:
                        neighbors.add((i, j))
        if neighbors:
            self.knowledge.append(Sentence(neighbors, count))

        # 3. Iterative inference until fixpoint
        inferred = True
        while inferred:
            inferred = False
            new_knowledge = []
            new_mines = set()
            new_safes = set()

            # 3a. Infer mines/safes from existing sentences
            for sentence in self.knowledge:
                new_mines |= sentence.known_mines()
                new_safes |= sentence.known_safes()

            for mine in new_mines:
                if mine not in self.mines:
                    self.mark_mine(mine)
                    inferred = True
            for safe in new_safes:
                if safe not in self.safes:
                    self.mark_safe(safe)
                    inferred = True

            # 3b. Subset inference: S1 ⊂ S2 → S2 - S1 = c2 - c1
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 is s2: continue
                    if s1.cells.issubset(s2.cells):
                        diff_cells = s2.cells - s1.cells
                        diff_count = s2.count - s1.count
                        if diff_cells and diff_count >= 0:
                            new_sentence = Sentence(diff_cells, diff_count)
                            if new_sentence not in self.knowledge:
                                new_knowledge.append(new_sentence)
                                inferred = True

            self.knowledge.extend(new_knowledge)

            # 3c. Clean empty sentences
            self.knowledge = [s for s in self.knowledge if s.cells]

    def make_safe_move(self):
        safe_moves = self.safes - self.moves_made
        return safe_moves.pop() if safe_moves else None

    def make_random_move(self):
        choices = [(i, j) for i in range(self.height) for j in range(self.width)
                   if (i, j) not in self.moves_made and (i, j) not in self.mines]
        return random.choice(choices) if choices else None
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/minesweeper.zip
unzip minesweeper.zip && cd minesweeper
pip3 install -r requirements.txt  # pygame

# Play vs AI or watch AI auto-play
python runner.py

check50 ai50/projects/2024/x/minesweeper

style50 minesweeper.py
```

---

## Learning Checklist

- [ ] Can write truth tables for arbitrary propositional formulas
- [ ] Can manually execute model checking (small KB)
- [ ] Can list all 8 inference rules with examples
- [ ] Can convert formulas to CNF and apply Resolution for proof by contradiction
- [ ] Understand Knights project: "identity constraints" vs "utterance constraints" logical encoding
- [ ] Understand Minesweeper: why `mark_mine`/`mark_safe` adjust `count` differently
- [ ] Both projects pass `check50` clean

## References

- [Week 1 Knowledge lecture page](https://cs50.harvard.edu/ai/weeks/1/) — video, slides, transcript, quiz
- [Week 1 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/1/) — primary source for this post
- [Knights project spec](https://cs50.harvard.edu/ai/projects/1/knights/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/knights` (requires 100%)
- [Minesweeper project spec](https://cs50.harvard.edu/ai/projects/1/minesweeper/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/minesweeper`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition