---
title: "Stanford CS161 Lecture 8: Hashing, Collisions, and What Expected O(1) Actually Guarantees"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, hashing, randomized-algorithms]
lang: en
type: deep-dive
description: "A lecture-by-lecture reading of Stanford CS161 Winter 2026 Lecture 8: chained hash tables, adversarial inputs for fixed functions, universal collision bounds, and the birthday scale."
tldr: "A universal hash family only needs to keep the collision probability of every distinct key pair at most 1/n; that makes the expected bucket size below 2, yielding expected O(1), not per-operation worst-case O(1)."
draft: false
series:
  name: "Reading Stanford CS161"
  order: 9
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-lecture-08-hashing)

This is article 9 in [Reading Stanford CS161](/en/series/stanford-cs161), covering **Stanford CS161, Winter 2026, Lecture 8**. The official title is **Hashing**. Ellen Vitercik taught it on February 2, 2026.

I used the [official Lecture 8 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-8-hashing), the public notes, and the public slides. The deck's main line ends with universal hashing. The notes continue into balls-and-bins and the birthday paradox, which I label as notes extensions. The course page also links to a Colab notebook inherited from `winter2025-extra`; I do not present it as newly authored Winter 2026 material. I did not use the Canvas-only recording.

Lecture 7 used red-black trees to obtain worst-case `O(log n)` search, insertion, and deletion. Lecture 8 asks whether a set that does not need sorted order can approach constant expected time. The answer is not a magical deterministic formula that always distributes keys evenly. Hashing puts randomness inside the algorithm and controls collision probability for any key set fixed before that random choice.

## Why direct addressing is not enough

If every key belongs to `{0,1,…,9}`, allocate ten array cells and store key `k` at index `k`. Search, insertion, and deletion each take one indexed access: genuine `O(1)` direct addressing.

Real universes are much larger. A 64-bit key has `2^64` possible values, while an application may store only a few thousand at once. Reserving one slot for every possible key uses vastly more space than the data.

Instead, allocate `n` buckets and use

```text
h : U → {0, 1, …, n-1}
```

to map a universe key into a bucket. Because `|U|` is far larger than `n`, distinct keys can share an output. That event is a collision. This lecture resolves collisions with chaining: every bucket stores a linked list of all keys mapped there.

An operation on `k` first computes `h(k)` and then scans that chain. Insertion can place a node at the head, but a set that disallows duplicates still needs a lookup first. Lookup and deletion also scale with chain length. The design question becomes: how do we prevent a bucket from becoming too long?

## A concrete chaining example

The notes use five buckets and

```text
h(x) = (13x + 2) mod 5
```

then insert `{1,2,4,7,8}`:

```text
B0 → 1
B1 → 8
B2 → NIL
B3 → 2 → 7
B4 → 4
```

Keys `2` and `7` collide in bucket 3. Correctness is intact; chaining retains both. Only cost changes: a lookup for `7` enters `B3` and traverses the list.

The lecture analysis assumes that the number of stored keys never exceeds the number of buckets, so the load factor is at most one. A real implementation usually grows the table and rehashes when it exceeds capacity. The notes explicitly leave resizing outside this model. The expected bound here is not a complete accounting of every production hash-table cost.

## A fixed function cannot defeat worst-case input

One might choose a deterministic formula that looks irregular and hope it spreads keys. For every fixed `h`, however, many universe keys map to the same bucket. An adversary who knows `h` can choose keys from that preimage and build a chain of length `n`.

The impossible goal has the wrong quantifier order:

```text
There exists one fixed h that evenly distributes every set of n keys.
```

The function places `|U|` possible values into `n` buckets. At least one bucket receives roughly `|U|/n` universe keys, giving the adversary a large collision set.

The lecture considers two alternatives: assume random input keys, or randomize the hash function. The first is difficult to justify because IDs, URLs, and strings often have structure. The second is under the algorithm's control: fix any key set first, then let the algorithm privately draw `h`. The analysis works for every fixed set.

## Why a completely random function gives constant expectation

Begin with an idealized assumption: choose `h` uniformly from all functions `U→{0,…,n-1}`. The table currently contains `x₁,…,xₙ`. For an operation involving `xᵢ`, let `X` be the size of its bucket.

Write `X` as a sum of indicators, one for each `xⱼ` that collides with `xᵢ`. Linearity of expectation gives:

```text
E[X] = Σⱼ Pr[h(xᵢ)=h(xⱼ)]
     = 1 + Σⱼ≠ᵢ Pr[h(xᵢ)=h(xⱼ)]
     = 1 + (n-1)/n
     < 2
```

The first one is the key's collision with itself. Under a completely random function, every other key lands in its bucket with probability `1/n`. The expected chain scanned by an operation has fewer than two entries. If evaluating `h(k)` is `O(1)`, insertion, lookup, and deletion are expected `O(1)`.

Three qualifiers are essential:

- **Expected:** the average is over the random choice of function, not a promise that each operation examines at most two nodes.
- **Fixed input:** the key set is chosen before the random function. An adaptive adversary that observes `h` lies outside this simplified proof.
- **Load assumption:** the table stores at most `n` keys. A table holding far more keys than buckets must have longer average chains.

## A completely random function is easy to analyze and impossible to store

There are `n^{|U|}` functions from `U` to the bucket range. Naming one requires about

```text
log₂(n^{|U|}) = |U| log₂ n
```

bits—effectively a recorded value `h(x)` for every universe element. That description can exceed the set being stored.

Generating `h(x)` on first encounter and remembering it does not remove the circularity. The next call must determine whether `x` appeared before, which itself requires a searchable dictionary.

The previous proof, however, never used full independence. It only used a collision probability of at most `1/n` for each distinct pair. A small family with that contract can reuse the expected-cost proof.

## The universal-family contract

A family `F` is universal when, for every `xᵢ≠xⱼ`, drawing `h` uniformly from `F` gives

```text
Pr[h(xᵢ)=h(xⱼ)] ≤ 1/n
```

This is a pairwise collision guarantee. It does not say every member function distributes every set evenly, nor does it require all outputs to be mutually independent. Substitute the bound into the indicator proof and `E[X]<2` still follows.

The lecture constructs a practical family by encoding universe keys as `0,…,|U|-1`, choosing a prime `p≥|U|`, and defining

```text
hₐ,ᵦ(x) = ((ax+b) mod p) mod n
```

where `a∈{1,…,p-1}` and `b∈{0,…,p-1}`. An implementation stores a random pair `(a,b)`, not a table over the entire universe. Excluding `a=0` matters: zero would turn the map into a constant function.

## Why this family is universal

First remove the final `mod n` and define

```text
fₐ,ᵦ(x) = (ax+b) mod p
```

Fix distinct inputs `x₁,x₂` and distinct target outputs `y₁,y₂`. The equations

```text
ax₁+b ≡ y₁ (mod p)
ax₂+b ≡ y₂ (mod p)
```

imply

```text
a(x₁-x₂) ≡ y₁-y₂ (mod p)
```

Because `p` is prime and `x₁-x₂` is nonzero, that difference has a multiplicative inverse modulo `p`. It determines a unique `a`, and substitution determines a unique `b`. Every distinct output pair corresponds to exactly one family member.

Now ask which distinct `y₁,y₂` become equal after `mod n`. For each fixed `y₁`, at most about `(p-1)/n` values of `y₂` share its residue. Across all `p` choices of `y₁`, at most `p(p-1)/n` functions cause a collision. The family has `p(p-1)` members, so

```text
Pr[hₐ,ᵦ(x₁)=hₐ,ᵦ(x₂)] ≤ [p(p-1)/n] / [p(p-1)] = 1/n
```

The proof also explains every condition. Primality supplies inverses for nonzero differences, excluding zero prevents a constant map, and the final `mod n` reduces field elements to the real bucket range.

## Notes extension: balls, bins, and the birthday scale

The notes abstract random hashing as throwing `m` balls independently into `n` bins. Keys are balls and buckets are bins. How many balls produce a substantial chance of at least one collision?

The probability of no collision is

```text
Pr[no collision] = ∏ᵢ₌₁^{m-1}(1-i/n)
```

Using `1-x≤e^{-x}`:

```text
Pr[no collision] ≤ exp(-m(m-1)/(2n))
```

When `m` is about `√(2 ln 2)√n≈1.18√n`, the no-collision probability falls below one half. Collisions become likely around the square-root scale, not only when the table is nearly full.

“At least one collision” is not the same as “slow operations.” Chaining tolerates a small number of collisions while keeping expected chain length constant. Requiring no collision at all would demand a table whose size exceeds roughly the square of the number of stored elements.

The notes apply the same calculation to random IDs. Give `m` users random `b`-bit IDs; a union bound places the collision probability around `m²/2^{b+1}`. To keep it at most `δ`, choose

```text
b ≥ 2 log₂ m - 1 + log₂(1/δ)
```

This material is an official notes extension, not the main slide sequence.

## Complexity and guarantee semantics

| Setting | Insert / Lookup / Delete | Meaning |
| --- | ---: | --- |
| Worst input for fixed deterministic `h` | `Θ(n)` | Every key can enter one chain |
| Completely random `h` | expected `O(1)` | Analyzable but too large to store |
| Random `h` from a universal family | expected `O(1)` | Pair collision ≤ `1/n` for a fixed key set |
| Capacity exceeded without resizing | Increases with load | Full resizing cost is outside the lecture model |

The chained table uses `n` bucket heads plus the stored nodes, or `O(n)` space under the lecture's at-most-`n`-keys model. A completely random function requires `Θ(|U|log n)` description bits. A universal family stores only two modulo-`p` parameters. The time claims also assume word arithmetic and hash evaluation are constant-time operations.

## Four common misuses

First, expected `O(1)` is not amortized `O(1)`. Expectation averages over randomness; amortization bounds the total cost of an operation sequence and may involve no randomness. Lecture 11 will place the two terms side by side.

Second, universal does not mean cryptographic. This lecture controls expected data-structure collisions. It makes no preimage-resistance, authentication, or security claim.

Third, after one family member becomes public forever, the proof does not let us classify every adaptive malicious input as oblivious. The quantifiers choose the fixed key set before `h`.

Fourth, the lecture analyzes chaining, not open addressing. The slides explicitly place open addressing outside the required material. The two designs have different load, collision-resolution, and deletion behavior.

## Where Lecture 8 sits in the course

Lecture 7 retained sorted order and obtained deterministic worst-case `O(log n)` with a red-black tree. Lecture 8 abandons ordered queries and trades that structure for randomized expected `O(1)` membership. The point of reading them together is not memorizing two operation tables. It is learning to read the guarantee: worst case versus expectation, structural invariant versus random model, and the assumptions attached to each big-O expression.

Lecture 9 moves into graph algorithms. Even an adjacency list is a data-structure choice, and Dijkstra later demonstrates again that the implementation cost of an underlying operation can change the whole algorithm.

## Beyond the lecture

To internalize the universal-family proof, choose a small prime such as `p=11` and `n=5`. Enumerate several `(a,b)` pairs and count how often two fixed, distinct keys collide. The goal is not a perfectly even histogram; it is verifying the `1/n` pairwise bound.

For implementation practice, record load factor, maximum chain length, and the average nodes scanned by a successful lookup after every insertion. Add resizing only when the load crosses a chosen threshold, then analyze that sequence separately with amortization. These are exercises suggested by this article, not additional Winter 2026 claims.

## References

- [Stanford CS161 Winter 2026 — Lecture 8 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-8-hashing)
- [Lecture 8 notes: Hashing](https://stanford-cs161.github.io/winter2026/assets/files/lecture8-notes.pdf)
- [Lecture 8 slides: Hashing](https://stanford-cs161.github.io/winter2026/assets/files/Lecture8.pdf)
- [Lecture 8 metadata and resource list (official component)](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture8.md)
