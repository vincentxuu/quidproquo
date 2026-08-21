---
title: "Stanford CS161 Lecture 7: Binary Search Trees, Red-Black Trees, and the Source of Worst-Case O(log n)"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, binary-search-tree, red-black-tree]
lang: en
type: deep-dive
description: "A lecture-by-lecture reading of Stanford CS161 Winter 2026 Lecture 7: BST search, insertion, and deletion; the danger of uncontrolled height; and the invariants that keep red-black trees logarithmic."
tldr: "Ordinary BST operations cost O(h) and can degrade to O(n); five red-black invariants cap the height at 2 log₂(n+1), giving search, insertion, and deletion worst-case O(log n) bounds."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 8
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-07-binary-search-red-black-trees)

This is article 8 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 7**. The official title is **Binary Search Trees and Red-Black Trees**. Moses Charikar taught the lecture on January 28, 2026.

I used the [official Lecture 7 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-7-binary-search-trees-and-red-black-trees), the public notes, and the public slides. The deck centers on binary search trees and red-black trees; the notes also contain a substantial section on heaps. I label that material as a notes supplement instead of presenting it as an equal part of the live deck. I did not use the Canvas-only recording.

The lecture asks a more precise question than “what is a tree?” A sorted array supports fast search but expensive updates. An unsorted linked list makes local updates cheap but search expensive. Can one mutable set retain fast search, insertion, and deletion? A BST tries to combine those benefits, but its performance depends on its shape. A red-black tree turns “the shape must not become too bad” into invariants that an update algorithm can maintain.

## Start from the operations, not the picture

Assume all keys are distinct. We want to search for a key, insert, delete, find a predecessor or successor, and traverse the set in sorted order. A sorted array supports binary search in `Θ(log n)` and direct selection by rank, but an insertion or deletion usually shifts a linear suffix. An unsorted linked list reverses the tradeoff: a local edit can be `Θ(1)` when its position is known, while search is `Θ(n)`.

A BST spreads the ordering relation across a tree. Every node `x` obeys one rule:

- Every key in the left subtree is less than `key(x)`.
- Every key in the right subtree is greater than `key(x)`.
- This lecture assumes unique keys, so it does not need a duplicate-key policy.

That one invariant supplies both a search direction and a sorted traversal. Each comparison discards an entire subtree. An in-order traversal—left subtree, node, right subtree—emits keys in increasing order.

There is also a useful analogy to QuickSort. Each node acts like a pivot: smaller values live on the left and larger values on the right. QuickSort eventually leaves an ordered array; the BST keeps a mutable tree that can accept future updates.

## Search, insertion, and deletion in a BST

### Search follows one path

To search for `i`, start at the root. Return when the current key equals `i`; move left when `i` is smaller and right when it is larger. Reaching a `NIL` child proves that `i` is absent. The node immediately above that `NIL` is also the parent that a future insertion would use.

Consider:

```text
        4
      /   \
     2     6
    / \   / \
   1   3 5   8
            /
           7
```

Searching for `5` follows `4 → 6 → 5`. Searching for the missing key `5.5` follows the same route and stops because 5 has a `NIL` right child. That stopping node need not be the numerically closest key. The notes explicitly warn that the procedure returns a valid insertion parent, not a nearest-neighbor answer.

### Insertion reuses search

To insert `i`, run search to find parent `p`. Attach the new node to the left when `i < key(p)` and to the right otherwise. Search has already established that the selected child is `NIL`. Both children of the new node begin as `NIL`.

Insert the sorted sequence `1,2,3,4,5` into an empty BST and every insertion moves right. The result is a chain. It is still a valid BST, but it has lost the benefit of repeatedly cutting the search space. The BST invariant controls order, not balance.

### Deletion has three structural cases

Deleting node `x` must preserve access to its subtrees:

1. With no child, replace the pointer from its parent with `NIL`.
2. With one child `c`, elevate `c` into `x`'s position and repair the parent pointer.
3. With two children, find the immediate successor `z`, the minimum node in the right subtree, and move `z` into `x`'s position.

The third case is the subtle one. Successor `z` cannot have a left child; otherwise that child would be a smaller successor candidate. Removing `z` from its old position therefore requires handling at most its right child. Then attach the two former subtrees of `x` beneath `z`. A symmetric implementation can use the predecessor, the maximum node in the left subtree.

Search, insertion, and deletion touch only a constant number of root-to-leaf paths plus a constant amount of pointer work. Their time is therefore `O(h)`, where `h` is the height. A balanced tree has `h=O(log n)`; a chain has `h=O(n)`.

## Notes supplement: a heap solves a narrower problem

The first part of the Lecture 7 notes introduces a binary min-heap, although the slide deck does not make it part of its main sequence. A heap uses a complete binary tree: every level is full except possibly the last, which fills from left to right. Every node's key is no greater than its children's keys, so the minimum sits at the root.

The two central operations are:

- `insert(i)`: place the new key in the next complete-tree position, then swap it upward while it is smaller than its parent.
- `extract-min`: save the root, replace it with the last node's key, delete that last node, then swap the replacement downward with its smaller child until the heap property returns.

A complete tree has height `Θ(log n)`, so each operation follows one path and costs `O(log n)`. A heap does not impose the global left/right order of a BST; searching for an arbitrary key can still inspect `Θ(n)` nodes. The heap is not merely an inferior BST. It is a simpler design for a priority queue that needs insertion and minimum extraction.

## Why rotation preserves order

Balancing a BST requires changing its shape without changing its in-order sequence. A rotation is the basic local move. Suppose `x` has left child `y`:

```text
        x                  y
       / \                / \
      y   γ  --right-->   α   x
     / \                    / \
    α   β                  β   γ
```

Before the rotation, `α < y < β < x < γ`. Afterward, `α` remains left of `y`, `β` moves to the left of `x`, and `γ` stays on the right. The ordering is unchanged, so the BST invariant survives. Only a fixed number of parent and child pointers change, making a rotation `O(1)`. The reverse move is a left rotation at `y`.

Rotation alone is not an algorithm. “Rotate whenever the tree looks crooked” gives neither a testable trigger nor a proof. We need rules that define acceptable balance and can be restored after each update. Red-black colors provide that bookkeeping.

## The five red-black invariants

A red-black tree is first a BST and then obeys five additional conditions:

1. Every node is red or black.
2. The root is black.
3. Every `NIL` leaf is black.
4. A red node has black children; red nodes never occur consecutively on a path.
5. From any node `x`, every path to a descendant `NIL` contains the same number of black nodes.

The fifth rule balances the black skeleton. The fourth limits how many extra red levels can appear between black nodes. Red does not mean “invalid.” It allows one local extra level without allowing those extra levels to accumulate.

Let `b(x)` be the number of black nodes on any path from `x` to a `NIL`, excluding `x`. First prove by induction that the subtree at `x` contains at least

```text
2^{b(x)} - 1
```

non-`NIL` nodes. The base case is a `NIL`: `b(x)=0`, with zero non-`NIL` descendants. In the inductive step, each child has black height at least `b(x)-1`; combine the lower bounds for the two child subtrees and add `x`.

Because red nodes cannot be consecutive, any root-to-`NIL` path of height `h` contains at least `h/2` black nodes. Thus `b(root) ≥ h/2`. For a tree with `n` non-`NIL` nodes:

```text
n ≥ 2^{b(root)} - 1 ≥ 2^{h/2} - 1
```

Rearranging gives:

```text
h ≤ 2 log₂(n + 1)
```

This is the source of the worst-case logarithmic bound. A red-black tree need not be perfectly balanced; it guarantees that its longest path remains logarithmic.

## Repairing an insertion

Insert new node `x` as in an ordinary BST, then color it red. Red is a deliberate choice: the new node has two black `NIL` children, and adding a red node does not increase the black count of any path. The likely violation is rule four—a red parent followed by a red child.

Classify the repair by the colors of parent `p` and uncle `u`:

- **The parent is black:** no red-red violation exists, so stop.
- **The parent and uncle are red:** color both black and color the grandparent red. Each affected path exchanges one red for black and one black for red, preserving its black count. A conflict may move upward to the grandparent.
- **The parent is red and the uncle black:** combine recoloring with a rotation to eliminate the red-red pair while preserving order and black height.

The slides demonstrate different shapes by inserting `0` and later `6`. The notes spell out one orientation and state that the mirrored cases are similar. Correctness does not come from a more balanced-looking picture. Each case must preserve BST order, eliminate the local red-red violation, maintain equal black counts, and retain the required root and `NIL` colors.

Each level performs only a constant number of rotations or recolorings. Repair can propagate toward the root, so it costs `O(h)`. Combined with the height theorem, red-black search and insertion have worst-case `O(log n)` cost. A complete deletion fix-up obtains the same bound.

## What the lecture proves—and what it leaves out

The official deck says students are not responsible for every red-black implementation case. The notes also call the treatment a case study and point to CLRS Chapter 13 for full coverage. The public material proves the height bound and develops representative insertion repairs. It does not fully enumerate deletion fix-up or every mirrored and zig-zag insertion case.

After this lecture, the expected understanding is conceptual and analytical: why the five rules imply a height bound, why rotation preserves BST order, why a new node begins red, and what recoloring and rotation repair. The abbreviated pseudocode is not by itself a complete production implementation.

## Complexity and assumptions

| Structure or operation | Time | Condition |
| --- | ---: | --- |
| Ordinary BST search / insert / delete | `O(h)` | `h` may equal `n` |
| BST in-order traversal | `Θ(n)` | Visits every node once |
| Rotation | `O(1)` | Changes a fixed number of pointers |
| Red-black search / insert / delete | worst-case `O(log n)` | All five invariants are fully restored |
| Heap insert / extract-min | `O(log n)` | Complete tree plus heap property |
| Heap search for an arbitrary key | worst-case `Θ(n)` | No global BST ordering |

A common misuse is to see “binary tree” and write `O(log n)`. Binary restricts the number of children, not the height. Only a balancing condition or a stated random model supplies a logarithmic bound. A red-black tree is also not a complete tree; it need not fill levels left to right.

## Where Lecture 7 sits in the course

The first six lectures mostly designed and analyzed sorting, divide-and-conquer, and randomized algorithms, often treating insertion into a collection as an abstract primitive. Lecture 7 briefly moves down a level and asks which data structure implements those primitives. It also prepares for Lecture 11, where Dijkstra's running time changes depending on whether its priority queue uses an array, a red-black tree, or a Fibonacci heap.

The next lecture narrows the requirement. If an application only needs membership, insertion, and deletion—not sorted order—can it improve on a red-black tree's worst-case `O(log n)`? Hashing offers expected `O(1)`, but the guarantee now depends on randomness and collision analysis.

## Beyond the lecture

A useful exercise is to insert the same key sequence three ways: sorted order into an ordinary BST, an approximately median-first order into another BST, and red-black insertion. Record the height and search path after every update. The keys remain identical while the shape—and therefore the cost—changes.

For implementation practice, begin with rotations rather than a full red-black tree. Run an in-order traversal before and after every rotation; any changed sequence reveals a pointer error. Then compute the black counts of all paths to `NIL` before attempting insertion fix-up. These are practice suggestions from this article, not added Winter 2026 requirements.

## References

- [Stanford CS161 Winter 2026 — Lecture 7 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-7-binary-search-trees-and-red-black-trees)
- [Lecture 7 notes: Heaps and Binary Search Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-notes.pdf)
- [Lecture 7 slides: Binary Search Trees and Red-Black Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-slides.pdf)
- [Lecture 7 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-pre.pdf)

