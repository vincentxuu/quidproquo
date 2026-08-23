---
title: "Stanford CS107 Lecture 23: The Allocator Invariants Behind In-Place realloc"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, realloc, free-list]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 24
tldr: "CS107 Lecture 23 advances the explicit free list to in-place realloc: split a useful remainder when shrinking, absorb free right neighbors when growing, and allocate-copy-free only as a fallback, while preserving both the physical heap and logical list."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 23: coalescing exercises, three in-place realloc paths, split thresholds, repeated rightward absorption, fallback, and final explicit-allocator invariants."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-explicit-free-list)

The preceding lectures build an implicit allocator and then link all free blocks into an explicit free list. Lecture 23 asks the more difficult question: when a client changes an allocation with `realloc`, can the data remain at the same address? Sometimes it can, but “no move” does not mean “no work.” Shrinking can create a free block; growing can require removing a right neighbor from the free list. One missing metadata or link update can leave overlapping blocks.

This lecture follows one `realloc` transition. Check the block's actual capacity, then consider existing padding, a shrink-and-split, absorption of adjacent free blocks, and finally allocate-copy-free. All three in-place cases preserve the same invariants: alignment, a complete nonoverlapping heap partition, exactly one list entry for every free block, and an unchanged valid prefix of the old data.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official session: Lecture 23, March 2, 2026
- Official title: Managing the Heap, Take III
- Instructor: Jerry Cain
- Materials read: the official calendar and Lecture 23 slides, POSIX `realloc` and `free`, the C17 memory-management sections, and the CS:APP Malloc Lab handout
- Material gaps: the Canvas recording and AFS lecture code are not public; this article reconstructs slide layouts without claiming to reproduce live commentary or demos

The [official Lecture 23 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/23/Lecture23.pdf) begin with a coalescing exercise that distinguishes physical adjacency from free-list adjacency. They then give three in-place `realloc` cases: existing padding is enough, shrinking can produce a remainder, and growing can absorb free blocks on the right. Three heap exercises distinguish a useful remainder, an exact absorption, and an eight-byte remainder that must become padding. The final slide turns these ideas into the explicit-allocator assignment requirements.

## Establish the realloc contract first

The [POSIX specification for `realloc`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html) permits either the original pointer or a newly allocated object. On success, the new object retains the prefix covered by the smaller of the old and new sizes. If its location changes, the old object is released. A caller therefore cannot assume address stability or keep using the old pointer after success.

```c
void *tmp = realloc(buf, wanted);
if (tmp == NULL) {
    /* buf still names the old allocation; handle failure first. */
    return -1;
}
buf = tmp;
```

The temporary is not merely stylistic. Writing `buf = realloc(buf, wanted)` directly loses the only usable old address on failure. Inside the allocator, fallback has the same transactional boundary: release the old block only after the new allocation and copy succeed.

Zero-size behavior varies across C and POSIX editions and is not the mechanism this lecture teaches. This article follows the positive-size requests shown in the slides. An implementation should follow the assignment's exact contract and tests rather than importing a different libc's edge behavior.

## Etude 1: coalescing follows addresses, not list links

In the first heap diagram, B's allocated block is immediately followed by a free block. After `free(b)`, the two physical regions can become one larger free block. `b->next` cannot make this decision: B was not a list node while allocated, and a free-list next link represents search order rather than the next address.

```text
before: [B used 24][free 16][A used 16]
free(b)
after:  [free 48........][A used 16]
```

The numbers describe the allocator's block layout, not only client payload. A merge uses physical boundaries from headers; adding payload sizes is insufficient. If the neighbor already belongs to the explicit list, unlink it before inserting the combined block once. Otherwise the logical structure retains both an obsolete node and a larger node that covers it.

The [POSIX `free` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html) makes later references to released space undefined. That client obligation allows the allocator to reuse freed payload for `prev` and `next`; it also explains why use-after-free can corrupt an allocator index rather than merely read stale bytes.

## In-place path one: growth fits existing padding

Alignment and minimum block size can make actual capacity larger than the client request. The slides allocate 42 bytes, but the block already has enough room for a 48-byte request. `realloc(a, 48)` can return `a` without moving data or modifying the free list.

The comparison is between the normalized new request and the block's actual size, not between the old and new requested counts. An allocator may not preserve every detail of the old request; its header stores enough metadata to traverse the heap, determine state, and recover capacity. Existing padding already belongs to the allocation and cannot be promised elsewhere.

Even this no-op path should pass the checker. The header remains allocated, the payload address and neighbor boundaries remain fixed, and the set of free-list nodes is identical. Replacing the physical block size with the raw requested size would instead make the next heap walk start at the wrong address.

## In-place path two: can a shrink leave a legal free block?

When the request shrinks, the old block necessarily has enough capacity. The design choice is whether its tail can become another block. The slides shrink a larger block to a 16-byte payload and split the tail only when it can hold a header and the explicit list's two pointers.

```text
before: [A used........................][free]
after:  [A used][new free remainder.....][free]
```

The split threshold cannot ask only whether bytes remain. An explicit free payload must fit `prev` and `next`, satisfy alignment, and carry required metadata. Lecture 23's layout uses a 16-byte free payload, so the example requires at least a 24-byte difference. Production code should derive this from layout constants instead of scattering slide numbers as magic constants.

An undersized remainder stays inside the allocation as internal padding. Splitting it would create a hole that can never serve a request or make links cross a boundary. For a valid remainder, compute both exact ranges, write metadata, initialize links, insert the remainder according to policy, and then consider coalescing with its right neighbor.

Shrinking does not permit damage to the retained data. The `realloc` contract preserves the first `min(old,new)` bytes. A stable payload start normally provides that for free, but a misplaced header write can still overwrite the prefix. Tests should fill the payload with a byte pattern and compare the retained range, not merely inspect the returned address.

## In-place path three: absorb free blocks on the right

If a block's physical right neighbor is free, the allocator can add that region to the allocation. This avoids a copy and may avoid heap growth. The neighbor is already a free-list node, however, so it must be removed from the logical list before its metadata is overwritten.

```text
physical: [A used][R1 free][R2 free][B used]
logical:  head -> ... -> R2 -> ... -> R1 -> ...

grow A:   unlink R1, absorb it; if insufficient, unlink R2, absorb it
result:   [A used larger..............][B used]
```

The generalized case repeatedly absorbs rightward: inspect the block at the current combined range's right boundary, continue while it is free, and stop when capacity suffices or an allocated block or heap end is reached. R2 may precede R1 in logical order, so following free-list links cannot discover the next physical neighbor.

After absorption, split a tail only if it can form a complete free block. If only eight bytes remain, the entire range stays with A as padding. Etude 4 isolates this threshold: a request for 48 produces a 56-byte block, and the eight extra bytes cannot hold an explicit node.

## What the three etudes test

Etude 2 begins with `[A used 16][free 32][B used 16]` and grows A to 24. Absorption leaves a useful remainder, yielding A 24, free 24, and B 16. It tests that merging does not imply consuming the entire neighbor; split eligibility must be reconsidered afterward.

Etude 3 uses the same start and grows A to 56. A and its right neighbor exactly provide the needed block, so the free node vanishes. It tests complete unlinking for a head, tail, middle, or sole node; no link may remain aimed into A's payload.

Etude 4 grows A to 48. The combined size is 56, but the remaining eight bytes do not meet the minimum free-block size, so A retains all 56. It tests that “unused bytes” are not automatically an expressible allocator block. A checker concerned only with byte conservation can miss this bug.

Together they define the decision order: normalize the request, compute combined capacity, and then compare the remainder with minimum block size. Do not truncate at the request boundary and only later discover that the tail cannot carry metadata.

## Why an unsuccessful rightward attempt need not be undone

The assignment includes a subtle requirement: if all consecutive free right neighbors are absorbed but capacity is still insufficient, those nodes need not be restored. The allocator may next allocate a new block, copy, and release the now-expanded old block. The client's successful result still meets the contract, and the allocator has coalesced several holes into one extent.

No restoration does not remove the failure obligation. If fallback allocation returns `NULL`, the old allocation must remain valid. Prior absorption must not damage the old payload, and one consistent header must describe the larger backing block. The client was promised its old data, not an exact hidden block size; the expanded block must still be releasable through the old pointer.

Copy the smaller relevant payload range, not the entire combined capacity. Absorbed space contains no client data and may contain old allocator metadata. Release the old block only after copying to a successful new allocation.

## A checkable realloc decision skeleton

```c
void *resize(void *p, size_t request) {
    block *b = payload_to_block(p);
    size_t need = normalize(request);

    if (need <= block_size(b)) {
        split_tail_if_usable(b, need);
        return p;
    }

    while (right_neighbor_is_free(b)) {
        block *r = right_neighbor(b);
        remove_free(r);
        absorb_right(b, r);
        if (block_size(b) >= need) {
            split_tail_if_usable(b, need);
            return p;
        }
    }

    void *moved = allocate(request);
    if (moved == NULL) return NULL;
    memcpy(moved, p, preserved_payload_size(b, request));
    release(p);
    return moved;
}
```

This is a decision sketch, not assignment-ready code. `remove_free` precedes metadata destruction in `absorb_right`; `split_tail_if_usable` updates both the physical layout and logical membership; normalization must check arithmetic overflow before alignment rounding.

The [C17 draft memory-management sections](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) define the external boundaries of allocation, reallocation, and release. The teaching allocator realizes them with headers, links, and copy lengths. The standard does not prescribe a free list, so internal policy may vary, but it cannot rewrite public behavior for data-structure convenience.

## Final explicit-allocator requirements are interdependent

The final slide requires headers with size and used/free state; two doubly linked-list pointers in the first 16 free-payload bytes; a `malloc` that searches the explicit list; right coalescing in `free`; and in-place `realloc` whenever possible, with exhaustive right-neighbor absorption even before a move.

These are not independent checkboxes. Without link-aware minimum block size, a shrink creates an illegal node. If `malloc` still scans the physical heap, list corruption may remain hidden. Without coalescing, `realloc` moves more often. Without unlink-before-absorb, the next first-fit search may return an overlapping address inside A.

The [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf) evaluates correctness, utilization, and throughput together. In-place `realloc` can reduce copying and temporary peak heap, but correctness is not an acceptable trade. Establish the checker after every mutation before comparing trace performance.

## Tests must inspect state, not only return values

Build deterministic traces for four families. Test padding-only growth and verify an unchanged address and list. Test shrinking with a remainder exactly large enough and one alignment unit too small. Test one and multiple right neighbors, exact absorption, and a useful remainder. Force fallback and verify the data prefix, release of the old block, and nonoverlap with the new block.

After each operation, check aligned addresses and sizes, nonzero blocks, correct next boundaries, valid state, equality between physical free blocks and list-reachable nodes, reciprocal links, no cycle, and no adjacent free blocks left unmerged when policy requires coalescing.

Inject fallback-allocation failure. It catches “free old before malloc” and inconsistent metadata after partial absorption. Fill copied data with an increasing byte pattern rather than zeros; zero-filled pages can disguise a missing copy.

## The durable lesson is mutation discipline

Lecture 23 is not merely a faster `realloc`. It forces three views into one function: the client sees a stable or changed payload pointer, the physical heap sees split and merged extents, and the explicit list sees removed and inserted nodes. Every optimization answers to all three.

Write preconditions and postconditions for each helper: whether its node is currently listed, whether a returned remainder is already inserted, when metadata may be overwritten, and which pointer remains valid on failure. Decomposing an operation into unlink, change the physical extent, and reinsert as needed is much easier to debug than changing six pointers at once.

The performance benefit of in-place growth is obvious. The deeper rule is simpler: preserve structural information before invalidating its old representation; prove a remainder is a legal block before indexing it; establish the new allocation before ending the old object's lifetime. Allocators have little room for error because one stale link eventually becomes overlapping memory returned to another caller.

## References

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 23 — Managing the Heap, Take III](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/23/Lecture23.pdf)
- [POSIX — realloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)
- [POSIX — free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
