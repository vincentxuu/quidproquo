---
title: "Harvard CS50 AI Week 3: Optimization — Local Search, Simulated Annealing, CSP & Crossword Generation"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, optimization, local-search, simulated-annealing, csp, ac-3, backtracking, crossword, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 4
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 4
tldr: "Week 3 tackles optimization: hill climbing, simulated annealing escaping local optima, CSP framework with AC-3 arc consistency, backtracking with MRV/degree heuristics. Project Crossword builds a crossword puzzle generator."
description: "Detailed guide to Harvard CS50 AI Week 3 Optimization: lecture highlights, video timestamps, local search & simulated annealing, CSP variables/domains/constraints, AC-3 algorithm, backtracking with MRV & degree heuristics, Crossword project specs and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 3 solves optimization problems: local search (hill climbing, random restart), simulated annealing accepts worse moves, CSP models variables/domains/constraints, AC-3 filters domains, backtracking with MRV and degree heuristics. Project Crossword generates valid crossword puzzles.

## Lecture Video & Timestamps

YouTube: [Week 3 Optimization (2020 recording)](https://www.youtube.com/watch?v=8M8vLzl4p5M)

| Timestamp | Content |
|---|---|
| 00:00–08:00 | Optimization problem definition: objective function, state space, neighbors |
| 08:00–22:00 | Local search: Hill Climbing, Sideways moves, Random Restart, Local Beam Search |
| 22:00–38:00 | Simulated Annealing: temperature parameter, worse-move acceptance probability, cooling schedule, convergence guarantee |
| 38:00–52:00 | Linear programming intro: objective, constraints, simplex method concept |
| 52:00–1:08:00 | Constraint Satisfaction Problems (CSP): variables, domains, constraints, consistency, solutions |
| 1:08:00–1:22:00 | AC-3 arc consistency algorithm, backtracking search, MRV (Minimum Remaining Values), Degree heuristic, Least Constraining Value |
| 1:22:00–1:30:00 | Project intro: Crossword (CSP + backtracking for crossword generation) |

> Full transcript: [Week 3 Notes](https://cs50.harvard.edu/ai/2020/notes/3/)

## Core Concepts Cheat Sheet

### Local Search Family

| Algorithm | Core Idea | Drawback |
|---|---|---|
| Hill Climbing | Pick best neighbor each step | Stuck in local optima, plateaus, ridges |
| Sideways Moves | Allow equal-score moves | May cycle on plateaus |
| Random Restart | Multiple random initializations | Needs many trials |
| Local Beam Search | Keep k best states | Insufficient diversity |
| **Simulated Annealing** | **Accept worse moves at high temp, cool gradually** | **Parameter-sensitive, needs careful schedule** |

**Simulated Annealing Acceptance Probability**:
```
P(accept) = 1                    if ΔE > 0 (better)
P(accept) = exp(ΔE / T)          if ΔE ≤ 0 (worse)
```
where ΔE = new_state_value - current_value, T = temperature. As T → 0, reduces to Hill Climbing.

### Constraint Satisfaction Problems (CSP)

**CSP Three Components**:
1. **Variables** X = {X₁, X₂, ..., Xₙ}
2. **Domains** D = {D₁, D₂, ..., Dₙ}, possible values per variable
3. **Constraints** C: allowed value combinations

**Node consistency**: single variable satisfies unary constraints  
**Arc consistency**: for every arc (Xᵢ, Xⱼ), each value in Xᵢ has support in Xⱼ

### AC-3 Algorithm

```python
# ac3.py core implementation
from collections import deque

def ac3(csp, queue=None):
    """Enforce arc consistency; return whether possible (no empty domain)"""
    if queue is None:
        queue = deque([(Xi, Xj) for Xi in csp.variables for Xj in csp.neighbors[Xi]])
    
    while queue:
        Xi, Xj = queue.popleft()
        if revise(csp, Xi, Xj):
            if not csp.domains[Xi]:  # domain emptied → inconsistent
                return False
            for Xk in csp.neighbors[Xi] - {Xj}:
                queue.append((Xk, Xi))
    return True

def revise(csp, Xi, Xj):
    """Remove values from Xi with no support in Xj; return whether revised"""
    revised = False
    for x in csp.domains[Xi][:]:  # copy for iteration
        # Check if exists y ∈ D(Xj) satisfying constraint
        if not any(csp.constraints(Xi, x, Xj, y) for y in csp.domains[Xj]):
            csp.domains[Xi].remove(x)
            revised = True
    return revised
```

### Backtracking Search + Heuristics

```python
# backtracking.py core skeleton
def backtrack(assignment, csp):
    if len(assignment) == len(csp.variables):
        return assignment  # complete assignment
    
    var = select_unassigned_variable(assignment, csp)  # MRV + Degree
    for value in order_domain_values(var, assignment, csp):  # LCV
        if is_consistent(var, value, assignment, csp):
            assignment[var] = value
            # Optional: forward checking or maintain arc consistency
            inferences = {}
            if inference(var, value, assignment, csp, inferences):
                result = backtrack(assignment, csp)
                if result is not None:
                    return result
            del assignment[var]
    return None

# MRV: Minimum Remaining Values
def select_unassigned_variable(assignment, csp):
    unassigned = [v for v in csp.variables if v not in assignment]
    return min(unassigned, key=lambda v: (len(csp.domains[v]), -len(csp.neighbors[v])))  # MRV, tie-break: Degree

# LCV: Least Constraining Value
def order_domain_values(var, assignment, csp):
    return sorted(csp.domains[var], 
                  key=lambda v: count_conflicts(var, v, assignment, csp))
```

---

## Project 3: Crossword — CSP Crossword Puzzle Generation

### Task

Given a structure file (`structure.txt` defining across/down slots) and word list (`words.txt`), fill all slots with words such that intersecting letters match. Each word used at most once.

### Distribution Code Highlights

```python
# crossword.py provided core classes
class Variable:
    def __init__(self, i, j, direction, length):
        self.i = i          # start row
        self.j = j          # start col
        self.direction = direction  # 'across' or 'down'
        self.length = length
        self.cells = []     # [(i,j), ...] all cell coordinates

class CrosswordCreator:
    def __init__(self, crossword, words):
        self.crossword = crossword  # Crossword object with variables, overlaps
        self.words = words          # available word set
        self.domains = {var: set(words) for var in crossword.variables}
    
    def solve(self):
        """Return complete assignment {var: word} or None"""
        assignment = {}
        return self.backtrack(assignment)
```

### Overlap Detection (provided)

```python
# crossword.py pre-built overlaps dict
# self.crossword.overlaps[var1][var2] = (i, j) means var1[i] == var2[j]
# e.g., var1[3] == var2[1]
```

### Reference Core: `add_constraints` + Backtracking

```python
# crossword.py snippet
def add_constraints(self):
    """Create all binary constraints: overlapping positions must have same letter"""
    for var1 in self.crossword.variables:
        for var2 in self.crossword.variables:
            if var1 == var2:
                continue
            overlap = self.crossword.overlaps[var1].get(var2)
            if overlap:
                i, j = overlap
                # Constraint: word1[i] == word2[j]
                def constraint(w1, w2, i=i, j=j):
                    return w1[i] == w2[j]
                self.constraints[(var1, var2)] = constraint

def backtrack(self, assignment):
    if len(assignment) == len(self.crossword.variables):
        return assignment
    
    # MRV heuristic
    unassigned = [v for v in self.crossword.variables if v not in assignment]
    var = min(unassigned, key=lambda v: len(self.domains[v]))
    
    # LCV ordering
    for word in sorted(self.domains[var], 
                       key=lambda w: self.count_conflicts(var, w, assignment)):
        if self.is_consistent(var, word, assignment):
            assignment[var] = word
            
            # Forward checking: prune neighbor domains
            inferences = {}
            if self.forward_check(var, word, assignment, inferences):
                result = self.backtrack(assignment)
                if result:
                    return result
            
            # Restore domains
            for v, removed in inferences.items():
                self.domains[v].update(removed)
            del assignment[var]
    
    return None

def forward_check(self, var, word, assignment, inferences):
    """After assigning word to var, filter neighbor domains"""
    for neighbor in self.crossword.neighbors[var]:
        if neighbor in assignment:
            continue
        overlap = self.crossword.overlaps[var][neighbor]
        i, j = overlap
        required_char = word[i]
        
        # Keep only words with char at position j = required_char
        removed = set()
        for w in self.domains[neighbor]:
            if w[j] != required_char:
                removed.add(w)
        if removed:
            inferences[neighbor] = removed
            self.domains[neighbor] -= removed
            if not self.domains[neighbor]:
                return False
    return True

def count_conflicts(self, var, word, assignment):
    """LCV: count how many neighbor values would be eliminated by this choice"""
    conflicts = 0
    for neighbor in self.crossword.neighbors[var]:
        if neighbor in assignment:
            continue
        overlap = self.crossword.overlaps[var][neighbor]
        i, j = overlap
        for w in self.domains[neighbor]:
            if w[j] != word[i]:
                conflicts += 1
    return conflicts
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/3/crossword.zip
unzip crossword.zip && cd crossword

# Test small structure
python generate.py data/structure1.txt data/words1.txt output.png

# Autograde
check50 ai50/projects/2024/x/crossword

style50 generate.py
```

> **Note**: Crossword is a single project (not split A/B), but challenging — requires correct AC-3 / forward checking / MRV / LCV combination to solve large puzzles within time limits.

---

## Learning Checklist

- [ ] Can compare Hill Climbing, Simulated Annealing, Local Beam Search strategies for escaping local optima
- [ ] Can hand-write AC-3 algorithm and explain when `revise` returns True
- [ ] Understand MRV (Minimum Remaining Values) and Degree heuristic variable ordering logic
- [ ] Understand why LCV (Least Constraining Value) reduces backtracking
- [ ] Can explain how Crossword's `overlaps` dictionary encodes binary constraints
- [ ] Crossword project passes `check50` clean (large test cases solve within time limit)

## References

- [Week 3 Optimization lecture page](https://cs50.harvard.edu/ai/weeks/3/) — video, slides, transcript, quiz
- [Week 3 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/3/) — primary source for this post
- [Crossword project spec](https://cs50.harvard.edu/ai/projects/3/crossword/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/crossword`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition