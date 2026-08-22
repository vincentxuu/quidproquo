---
title: "Stanford CS161 Lecture 14: When a Greedy Algorithm Turns Local Choices into a Global Optimum"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, greedy-algorithms, exchange-argument, huffman-coding]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 15
tldr: "A greedy algorithm is not merely 'pick what looks best.' It keeps one choice at each step and needs an exchange argument proving that the choice preserves an optimum. Lecture 14 develops that proof pattern through activity selection, weighted completion time, and Huffman coding."
description: "A complete reading of Stanford CS161 Winter 2026 Lecture 14: activity selection, weighted completion-time scheduling, Huffman prefix-free coding, and the exchange arguments that make greedy choices correct."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-14-greedy-algorithms)

This is article fifteen in [Reading Stanford CS161](/en/series/stanford-cs161). It covers **Stanford CS161, Winter 2026, Lecture 14**, taught by Ellen Vitercik on February 25, 2026. The official title is simply *Greedy Algorithms*.

This article uses the public [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture14-notes.pdf), [slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture14.pdf), and [official lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture14.md). The Canvas recording on the official page requires Stanford access. I did not watch it and do not count it as a source. The component also links a Winter 2025 notebook and concept-check bank; this article does not use those older auxiliary materials to expand Winter 2026 claims.

The preceding dynamic-programming lecture retained several subproblems because it did not yet know which decision would extend to an optimum. This lecture asks a more aggressive question: if one can prove that following a single branch always suffices, can the whole table be discarded? Yes—but the cost moves from code to proof. A greedy algorithm is often short. The difficult part is proving that no local decision ever eliminates every globally optimal solution.

## Greedy is a proved structure, not an intuition

The slides deliberately give a rough description: make choices one at a time, never look back, and hope for the best. The notes immediately supply the formal version. Suppose a problem has optimal substructure and could be expressed as a dynamic program comparing several subproblems. If one can prove that a particular subproblem always extends to an optimum, the algorithm needs to follow only that one.

Two properties must remain distinct:

- **Greedy-choice property:** the current local choice is compatible with at least one global optimum.
- **Optimal substructure:** after making that choice, the remainder is an optimal solution to a smaller instance of the same kind.

A common proof maintains the invariant: “After greedy choice `t`, there is still an optimal solution containing every choice made so far.” The base case is immediate because an optimum exists before any choices are fixed. The inductive step usually starts from an optimum consistent with the old choices and replaces one part with the new greedy choice without worsening the objective. That is an exchange argument.

Knapsack appears first as a warning. Choosing by value, weight, or value density can fail because indivisible items interact with the remaining capacity. Its `O(nW)` dynamic program keeps many states precisely because no natural single path is guaranteed to preserve an optimum. Greedy is not a speed switch for every optimization problem.

## Activity selection: choose earliest finish, not earliest start

There are `n` activities. Activity `a_i` starts at `s_i` and finishes at `f_i`; only one may be attended at a time. The goal is to find a largest set of mutually nonconflicting activities.

A dynamic-programming view defines `S_{i,j}` as the activities starting after `a_i` finishes and ending before `a_j` starts. Let `A_{i,j}` be a largest compatible subset. If an optimum contains `a_k`, it splits into activities before and after it:

```text
|A_{i,j}| = max_{a_k ∈ S_{i,j}} (1 + |A_{i,k}| + |A_{k,j}|)
```

The direct formulation has `Θ(n²)` subproblems and may test `Θ(n)` choices per entry, giving the `O(n³)` bound in the notes. Activities have a stronger property, however: it suffices to consider the feasible activity with the earliest finishing time.

Sort by nondecreasing finish time, select the first activity, and scan once. Whenever `s_m≥f_k`, where `k` is the most recently selected activity, add `a_m` and update `k`.

```text
Greedy-AS(a[1...n]):
    sort by finish time
    A = {a[1]}
    k = 1
    for m = 2 ... n:
        if s[m] ≥ f[k]:
            A = A ∪ {a[m]}
            k = m
    return A
```

### Why earliest finish is correct

Let `a_k` be the currently feasible activity with earliest finish. Take any optimum `A*`, and let `a_l` be its first activity. If `a_l=a_k`, the greedy choice is already present. Otherwise, replace `a_l` with `a_k`.

Because `f_k≤f_l`, every later activity that was compatible with `a_l` also starts after `a_k` finishes. The exchanged schedule remains legal and has the same number of activities, so it remains optimal. The proof establishes that **some** optimum contains `a_k`; it does not need every optimum to contain it. Apply the same argument recursively to the activities after `a_k`.

The scan takes `O(n)` when activities are already sorted. Including sorting gives `O(n log n)`. The result also explains why the greedy proof replaces the DP table: after choosing earliest finish, the “before” subproblem is empty, leaving only one “after” subproblem.

The common mistake is to substitute earliest start, shortest duration, or the currently highest-valued compatible activity. Those rules may sound as if they preserve room for the future, but the lecture's exchange argument supports earliest finish specifically. A greedy rule and its proof are a package; one cannot keep the algorithmic shape while swapping the sorting key.

## Weighted completion time: adjacent exchange derives the ratio

The second problem has `n` jobs sharing one resource. Job `j` has length `l_j` and importance weight `w_j`. In an ordering, completion time `c_j` is the total length from the beginning through the end of job `j`. The objective is

```text
Σ_j w_j c_j
```

The easy boundary cases suggest the answer but do not complete it. If all lengths are equal, put higher weights earlier. If all weights are equal, put shorter jobs earlier. When both differ, how should the two signals be combined?

Consider adjacent jobs `i` and `j`. Swapping `ij` to `ji` changes no other completion time. The change in the objective is

```text
Δ = w_i l_j - w_j l_i
```

If `ij` belongs in an optimal order, the swap cannot lower the objective, so `Δ≥0`:

```text
w_i l_j ≥ w_j l_i
l_i / w_i ≤ l_j / w_j
```

Jobs should therefore be sorted by increasing `l_i/w_i`. The slides express the same rule as decreasing `w_i/l_i`: a job with greater delay cost per unit processing time goes earlier. The two ratio directions are equivalent, not competing algorithms.

For the global exchange argument, whenever an ordering contains an adjacent inversion of the ratio rule, swap it without increasing cost. Repeatedly removing inversions yields the ratio-sorted order. Therefore at least one optimal order follows the greedy order.

The notes give a minimal hand calculation. With equal weights and lengths `1,2,3`, shortest first produces completion times `1,3,6` and sum 10. Reversing them gives `3,5,6` and sum 14. The example makes both the scheduling intuition and the accumulation in `Σw_jc_j` visible.

Once sorted, emitting the schedule takes `O(n)`; beginning from unsorted input gives `O(n log n)`. Equal ratios may appear in either order without changing their combined contribution. An implementation can compare cross products `l_iw_j` and `l_jw_i` rather than using floating-point division. That is an implementation extension rather than a required step in the notes.

## Prefix-free coding: why an encoding becomes a tree

The third example comes from information theory. A fixed-length code uses the same number of bits for every character. If character frequencies differ substantially, common characters could receive shorter codewords and rare characters longer ones. Codewords cannot be shortened arbitrarily, however. If `a→0`, `b→1`, and `c→01`, the received string `01` could mean `ab` or `c`.

The code must therefore be **prefix-free**: no codeword is a prefix of another. A binary tree gives a natural representation. Label left edges 0 and right edges 1, and place characters only at leaves. Since no leaf is an ancestor of another leaf, root-to-leaf bit strings are automatically prefix-free.

Let the alphabet be `C` with frequencies summing to one. Character `c` has code length equal to its depth `d_T(c)` in tree `T`. The average cost is

```text
B(T) = Σ_{c∈C} f(c)d_T(c)
```

The goal is to minimize `B(T)` over full binary trees. The lecture uses `{a:.45,b:.13,c:.12,d:.16,e:.05,f:.09}`. High-frequency `a` appears near the root, while low-frequency `e` and `f` sit deeper.

## Huffman coding: merge the least frequent nodes upward

Huffman's algorithm does not guess codewords from the root downward. It constructs the tree from its leaves upward:

1. Create one node per character with frequency as its key.
2. Take the two minimum-key nodes `N_i,N_j` from `current`.
3. Create parent `I` with those nodes as children and `I.key=N_i.key+N_j.key`.
4. Remove the children from `current` and insert `I`.
5. Repeat until one root remains.

```text
Huffman(C, f):
    current = one leaf node per character
    while |current| > 1:
        x, y = the two minimum-key nodes in current
        z = Node(key=x.key+y.key, children=(x,y))
        remove x,y from current and insert z
    return the unique root in current
```

### First exchange: the two least frequent characters can be siblings

Take an optimal full binary coding tree. At maximum depth it has a pair of sibling leaves, call them `a,b`. Let `x,y` be the two least frequent characters in the alphabet. Swapping `x` with `a` changes cost by

```text
(f(x)-f(a))(d_T(a)-d_T(x)) ≤ 0
```

The inequality follows because `f(x)≤f(a)` and deepest leaf `a` has `d_T(a)≥d_T(x)`. The swap cannot increase cost; the same argument applies to `y,b`. Thus an optimal tree exists in which the two least frequent characters are sibling leaves. This proves that the first merge is safe, but it does not yet prove that later merges of intermediate nodes are safe.

### Second exchange: a subtree can become a meta-character

Collapse every character in a subtree into one character `c'` whose frequency equals their total frequency. The notes expand the cost difference and show that the difference between the original and collapsed trees depends only on the internal subtree cost, not on the shape outside it.

This enables induction. Entries in Huffman's `current` may be original leaves or already merged subtrees. Treat every subtree as a symbol in a new alphabet and apply the least-frequency sibling argument again. The inductive invariant is: after `t` merges, there remains a way to merge the subtrees in `current` into an optimal tree. When `current` contains one tree, that tree must be optimal.

The notes point to CLRS for the fully rigorous version and call their own treatment a sketch; the slides likewise say students are not responsible for the complete proof. The public material still provides the two central propositions and the main algebra, but an article should retain that stated proof boundary.

The official notes and slides do not analyze a data structure or asymptotic runtime for Huffman coding. This article therefore does not present the textbook priority-queue `O(n log n)` implementation as an explicit Lecture 14 result. “Find the two minimum nodes” is an algorithmic step; how it is implemented determines its cost. That is a deliberate gap in the lecture material.

## Three correct greedy algorithms and one proof skeleton

The local choices are different:

| Problem | Greedy choice | What gets exchanged | Main complexity |
|---|---|---|---:|
| Activity Selection | Compatible activity with earliest finish | First activity of an optimum | `O(n log n)` including sorting |
| Weighted Completion Time | Increasing `l_i/w_i` | An adjacent inversion | `O(n log n)` including sorting |
| Huffman Coding | Two minimum-frequency nodes | Deepest sibling leaves, then collapsed subtrees | Not given in this lecture |

Their common feature is not “choose the minimum.” Scheduling may be phrased as choosing maximum `w/l`, Huffman selects two objects per round, and activity selection uses earliest finish. Their shared question is: assuming an optimum remains consistent with the old choices, how can it be modified locally to contain the new greedy choice without worsening its value?

The slides compare subproblem graphs. Divide and conquer expands independent subproblems. Dynamic programming expands several overlapping subproblems and stores them. Greedy follows one subproblem at each step. That picture is useful but is not itself a proof. Following one branch describes the algorithm; explaining why that branch suffices still requires a problem-specific exchange or induction argument.

## Limits that are easiest to misuse

First, activity selection maximizes the **number** of activities. If activities have different values, earliest finish need not be optimal; weighted interval scheduling may require dynamic programming. Second, the scheduling objective here is `Σw_jc_j`. A different objective—maximum lateness, deadline violations, or another cost—does not automatically preserve the ratio rule.

Third, prefix-free does not mean that all codewords have different lengths, nor that they have fixed length. It only forbids one codeword from prefixing another. Fourth, Huffman's proof assumes frequency-weighted expected code length as the objective. A different cost model requires a new proof.

Fifth, and most important, an exchange argument only needs to show that **some** optimum can be transformed to contain the greedy choice. It does not need every optimum to make the same choice. Conversely, one successful example proves nothing general. The argument must cover arbitrary inputs and every greedy round.

## Where this lecture sits in the eighteen-lecture sequence

Lecture 13 used states and transitions to preserve many possibilities. Lecture 14 identifies the additional structure that permits only one decision to survive. The next lecture, Minimum Spanning Trees, turns “the choice does not rule out an optimum” into a concrete cut property: a light edge crossing an appropriate cut can be exchanged into an MST.

Lecture 14 is therefore more than three classic problems. It establishes how to read the remaining greedy lectures. Propose a candidate rule, identify the optimal substructure behind it, and formulate an invariant that survives every choice. If that proof cannot be written, return to dynamic programming or admit that the rule is only approximate. “It seems to leave the most room for later” is not a theorem.

## Beyond the lecture

The following points are implementation guidance, not formal Winter 2026 Lecture 14 content.

If activity input is already finish-time sorted, do not sort it again; this keeps the distinction between `O(n)` and `O(n log n)` explicit. For ratio scheduling, cross multiplication avoids floating-point error but integer overflow must be considered. A standard Huffman implementation uses a min-priority queue for `current`; any runtime claim must include the queue operations rather than merely counting loop iterations.

More generally, when a “pick the best next item” idea appears, take two actions. Search small instances for a counterexample to reject bad ordering rules quickly. Then try to exchange the first different choice in an arbitrary optimum with the greedy choice. The first action cannot prove correctness but can stop a false conjecture. The second is the threshold between intuition and an algorithm.

## References

- [Stanford CS161 Winter 2026 Lecture 14 official page](https://stanford-cs161.github.io/winter2026/lectures/#lecture-14-greedy-algorithms)
- [Lecture 14 notes — Greedy Algorithms](https://stanford-cs161.github.io/winter2026/assets/files/lecture14-notes.pdf)
- [Lecture 14 slides — Greedy Algorithms](https://stanford-cs161.github.io/winter2026/assets/files/Lecture14.pdf)
- [Lecture 14 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture14.md)
