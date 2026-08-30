---
title: "Harvard CS50 AI Week 2: Uncertainty — Probability, Bayesian Networks, Markov Models & Genetic Inference"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, probability, bayesian-network, markov-model, heredity, pagerank, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 3
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 3
tldr: "Week 2 shifts from deterministic to probabilistic: Bayes rule, Bayesian nets with D-separation, Markov chains, PageRank random walks. Projects: Heredity (genotype inference) and PageRank (web ranking)."
description: "Detailed guide to Harvard CS50 AI Week 2 Uncertainty: lecture highlights, video timestamps, Bayesian network construction & inference, Markov chain stationary distribution, PageRank iterative & sampling implementations, Heredity and PageRank project specs and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 2 introduces probability for uncertainty: Bayesian nets encode conditional independence, Markov chains model sequences, PageRank ranks pages via random walks. Two projects implement genetic inference (Heredity) and web ranking (PageRank).

## Lecture Video & Timestamps

YouTube: [Week 2 Uncertainty (2020 recording)](https://www.youtube.com/watch?v=qYl8k3K6t1M)

| Timestamp | Content |
|---|---|
| 00:00–08:00 | Uncertainty motivation, probability axioms, conditional probability, Bayes rule |
| 08:00–22:00 | Bayesian networks: nodes, directed edges, CPTs, D-separation for conditional independence |
| 22:00–38:00 | Bayesian network inference: Enumeration, Variable Elimination, approximate sampling |
| 38:00–52:00 | Markov models: Markov assumption, transition matrix, stationary distribution, PageRank random walk |
| 52:00–1:05:00 | Hidden Markov Models (HMM): observations, forward algorithm, Viterbi algorithm |
| 1:05:00–1:15:00 | Project intro: Heredity (Bayesian net sampling), PageRank (iterative & sampling) |

> Full transcript: [Week 2 Notes](https://cs50.harvard.edu/ai/2020/notes/2/)

## Core Concepts Cheat Sheet

### Bayes Rule & Conditional Independence

```
P(A|B) = P(B|A) P(A) / P(B)
```

**Conditional Independence**: X ⊥ Y | Z ⇔ P(X, Y | Z) = P(X | Z) P(Y | Z)
- Bayesian networks use DAGs to encode conditional independencies
- **D-separation**: A path is "blocked" in three cases:
  1. Chain/common cause: middle node in evidence set Z
  2. Common effect: middle node not in Z, nor any descendants in Z

### Three Inference Strategies for Bayesian Networks

| Strategy | Use Case | Complexity |
|---|---|---|
| Enumeration (full joint) | Very few variables (<10) | O(2^n) |
| Variable Elimination | Medium, exact answer needed | Exponential worst-case, often better |
| Approximate Inference (sampling) | Large networks, tolerable error | Linear in samples |

**Rejection Sampling** core logic:
```python
# rejection_sampling.py core logic
def rejection_sampling(query_var, evidence, network, N=10000):
    counts = {True: 0, False: 0}
    for _ in range(N):
        sample = {}
        for var in network.topological_order():
            parents_vals = {p: sample[p] for p in network.parents(var)}
            prob = network.cpt(var)[tuple(parents_vals.values())]
            sample[var] = random.random() < prob
        if all(sample[e] == v for e, v in evidence.items()):
            counts[sample[query_var]] += 1
    total = sum(counts.values())
    return {k: v/total for k, v in counts.items()} if total > 0 else {True: 0.5, False: 0.5}
```

**Likelihood Weighting** fixes rejection sampling's inefficiency: fix evidence variables, sample only non-evidence, weight = ∏ P(evidence | parents).

### Markov Models & PageRank

**Markov Chain**: state set S, transition matrix T, initial distribution π₀
- **Stationary distribution** π: π = π T (if unique)
- **PageRank** interpretation: random surfer follows links with probability d, jumps randomly with 1-d
  ```
  PR(p) = (1-d)/N + d Σ_{q→p} PR(q) / OutDegree(q)
  ```
  Typical d = 0.85, N = total pages.

### Hidden Markov Models (HMM)

- States unobserved, only emissions visible
- **Forward algorithm**: computes P(observations | model) — DP avoids exponential blowup
- **Viterbi algorithm**: finds most likely state sequence argmax P(states | observations)

---

## Project 2A: Heredity — Bayesian Network Sampling for Genotype Inference

### Task

Given a family tree with partial trait observations, use **likelihood weighting sampling** to infer each person's probability of having a specific gene. Input CSV has `name, mother, father, trait` (trait: 0/1/empty).

### Distribution Code Highlights

```python
# heredity.py provided core structures
PROBS = {
    "gene": {2: 0.01, 1: 0.03, 0: 0.96},  # priors: 2/1/0 gene copies
    "trait": {
        2: {True: 0.65, False: 0.35},  # trait expression given 2 copies
        1: {True: 0.56, False: 0.44},
        0: {True: 0.01, False: 0.99}
    },
    "mutation": 0.01  # mutation rate during inheritance
}

class Person:
    def __init__(self, name, mother, father):
        self.name = name
        self.mother = mother
        self.father = father
        self.trait = None  # True/False/None
```

### Reference Core: `joint_probability` + `update`

```python
# heredity.py snippet
import random

def joint_probability(people, one_gene, two_genes, have_trait):
    """Compute joint probability of a specific gene assignment & trait observations"""
    prob = 1.0
    for person in people.values():
        gene_count = (2 if person.name in two_genes else
                      1 if person.name in one_gene else 0)
        
        # Prior or inheritance probability
        if person.mother is None and person.father is None:
            prob *= PROBS["gene"][gene_count]
        else:
            prob *= inheritance_prob(person, one_gene, two_genes)
        
        # Trait probability
        has_trait = person.name in have_trait
        prob *= PROBS["trait"][gene_count][has_trait]
    return prob

def inheritance_prob(person, one_gene, two_genes):
    """Probability of inheriting specific gene_count from parents"""
    def prob_from_parent(parent_name):
        if parent_name in two_genes:
            return 1 - PROBS["mutation"]  # passes 1 copy
        elif parent_name in one_gene:
            return 0.5  # 50% chance to pass
        else:
            return PROBS["mutation"]  # mutation creates 1 copy
    
    pm = prob_from_parent(person.mother)
    pf = prob_from_parent(person.father)
    # Combination: 0 copies=(1-pm)(1-pf), 1 copy=pm(1-pf)+(1-pm)pf, 2 copies=pm*pf
    # Actual update() computes for specific gene_count
    ...

def update(probabilities, one_gene, two_genes, have_trait, p):
    """Accumulate sampling weight"""
    for person in probabilities:
        if person in two_genes:
            probabilities[person]["gene"][2] += p
        elif person in one_gene:
            probabilities[person]["gene"][1] += p
        else:
            probabilities[person]["gene"][0] += p
        probabilities[person]["trait"][person in have_trait] += p
```

### Likelihood Weighting Main Loop

```python
def main():
    # ... read CSV, build people dict ...
    probabilities = {name: {"gene": {2:0,1:0,0:0}, "trait": {True:0, False:0}} 
                     for name in people}
    
    N = 10000
    for _ in range(N):
        # 1. Sample non-evidence variables
        one_gene, two_genes, have_trait = set(), set(), set()
        for person in people.values():
            if person.trait is not None:
                if person.trait:
                    have_trait.add(person.name)
                continue  # evidence fixed
            
            # Sample gene count
            if person.mother is None:
                # Prior sampling
                r = random.random()
                if r < PROBS["gene"][2]: two_genes.add(person.name)
                elif r < PROBS["gene"][2] + PROBS["gene"][1]: one_gene.add(person.name)
            else:
                # Inheritance sampling
                gene = sample_from_parents(person, one_gene, two_genes)
                if gene == 2: two_genes.add(person.name)
                elif gene == 1: one_gene.add(person.name)
        
        # 2. Compute weight: likelihood of evidence
        weight = 1.0
        for person in people.values():
            if person.trait is not None:
                gene = (2 if person.name in two_genes else
                        1 if person.name in one_gene else 0)
                weight *= PROBS["trait"][gene][person.trait]
        
        # 3. Accumulate
        update(probabilities, one_gene, two_genes, have_trait, weight)
    
    # 4. Normalize & output
    for person in probabilities:
        normalize(probabilities[person]["gene"])
        normalize(probabilities[person]["trait"])
        print(person, probabilities[person])
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/heredity.zip
unzip heredity.zip && cd heredity

python heredity.py data/family0.csv
# Expected: each person's gene/trait probability distribution

check50 ai50/projects/2024/x/heredity
style50 heredity.py
```

---

## Project 2B: PageRank — Iterative & Sampling Algorithms

### Task

Implement two PageRank computation methods:
1. **Iterative**: repeatedly apply formula until convergence (|PR_new - PR_old| < 0.001)
2. **Sampling**: random walk sampling N times, count visit frequencies

Input: HTML files in `corpus` directory, parse `<a href>` to build link graph.

### Reference Implementation: Iterative PageRank

```python
# pagerank.py snippet
def iterate_pagerank(corpus, damping_factor=0.85):
    N = len(corpus)
    pr = {page: 1/N for page in corpus}
    threshold = 0.001
    
    while True:
        new_pr = {}
        for page in corpus:
            # Base probability: random jump
            rank = (1 - damping_factor) / N
            
            # Add contributions from all pages linking to page
            for possible in corpus:
                if page in corpus[possible]:
                    rank += damping_factor * pr[possible] / len(corpus[possible])
                elif not corpus[possible]:  # no outlinks → links to all pages
                    rank += damping_factor * pr[possible] / N
            new_pr[page] = rank
        
        # Check convergence
        if all(abs(new_pr[p] - pr[p]) < threshold for p in corpus):
            break
        pr = new_pr
    
    # Normalize (floating-point correction)
    total = sum(pr.values())
    return {p: v/total for p, v in pr.items()}
```

### Reference Implementation: Sampling PageRank

```python
def sample_pagerank(corpus, damping_factor=0.85, n=10000):
    N = len(corpus)
    counts = {page: 0 for page in corpus}
    page = random.choice(list(corpus.keys()))
    
    for _ in range(n):
        counts[page] += 1
        
        # Random walk next step
        if not corpus[page] or random.random() > damping_factor:
            # No outlinks or random jump: uniform choice
            page = random.choice(list(corpus.keys()))
        else:
            # Follow outlink
            page = random.choice(list(corpus[page]))
    
    return {p: c/n for p, c in counts.items()}
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/pagerank.zip
unzip pagerank.zip && cd pagerank

python pagerank.py corpus0
# Expected: Iterative and Sampling results converge closely

check50 ai50/projects/2024/x/pagerank
style50 pagerank.py
```

---

## Learning Checklist

- [ ] Can articulate how Bayesian nets encode conditional independence (D-separation three rules)
- [ ] Can hand-write Variable Elimination to derive marginal probabilities
- [ ] Understand rejection sampling vs likelihood weighting weight source difference
- [ ] Can derive PageRank formula and explain damping factor role
- [ ] Understand Heredity's "prior vs inheritance" probability switching logic
- [ ] Both projects pass `check50` clean

## References

- [Week 2 Uncertainty lecture page](https://cs50.harvard.edu/ai/weeks/2/) — video, slides, transcript, quiz
- [Week 2 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/2/) — primary source for this post
- [Heredity project spec](https://cs50.harvard.edu/ai/projects/2/heredity/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/heredity`
- [PageRank project spec](https://cs50.harvard.edu/ai/projects/2/pagerank/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/pagerank`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition