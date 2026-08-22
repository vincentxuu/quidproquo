---
title: "Stanford CS107 Lecture 22: Why an Explicit Free List Lives in Two Orders at Once"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, memory-management, malloc, free-list]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 23
tldr: "CS107 Lecture 22 replaces an implicit list with an explicit free list. Searches visit only reusable blocks, but every free block now has both physical neighbors and logical links, so unlinking, coalescing, and reinsertion must preserve both structures."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 22: implicit and explicit free lists, links embedded in payloads, placement, unlinking, splitting, physical adjacency, coalescing, and dual invariants."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-heap-allocator-designs)

Lecture 21's implicit free list uses each block's size to walk the physical heap. Its structural weakness is that a search crosses allocated blocks that cannot satisfy the request. Lecture 22 narrows the search set by linking only free blocks.

This is more than adding a `next` pointer. A free block now belongs to two orders: physical neighbors by address and logical neighbors in the free list. Coalescing uses the first; search and removal use the second. The dangerous failure is updating one relation while the other still treats an obsolete node as valid.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official session: Lecture 22, February 27, 2026
- Official title: Managing the Heap, Take II
- Instructor: the syllabus lists Jerry Cain; the PDF does not identify a guest speaker
- Materials read: the official calendar and slides, CS:APP Malloc Lab, Doug Lea's design article, and the glibc malloc-internals guide
- Material gaps: the Canvas recording and AFS lecture code are not public; this article reconstructs the slide diagrams without claiming to reproduce live demos

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) identifies this as heap management, part two. The agenda covers implicit-list cost, explicit lists, links in free payloads, search and unlink during allocation, split remainders, physical versus logical adjacency, and unlink/merge/reinsert coalescing cases. Later production mechanisms are not retroactively treated as slide content.

## Implicit-list cost comes from an oversized search set

An implicit search crosses allocated and free blocks. With a thousand blocks but ten free blocks, it may inspect nearly a thousand headers. An explicit list ideally visits ten candidates. Its cost scales mainly with free-block count, though it is not constant time.

The [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf) evaluates throughput and utilization together. Links increase minimum free-block size, and unlink/reinsert operations cost time. Explicit lists are especially attractive with many live blocks and few holes; tiny blocks may suffer from metadata overhead.

Instrument both physical blocks inspected and free candidates inspected under the same trace. That separates search-set cost from coalescing or other work.

## Free payload can hold links because the client surrendered access

Allocated payload belongs to the client; freed payload may store `prev` and `next`:

```text
allocated block: [header | client bytes................]
free block:      [header | prev | next | unused space..]
```

This reuse is not free. A valid free node must fit header and links, increasing minimum block size. A small split remainder may need to stay inside the allocation as internal fragmentation.

The same bytes change meaning with lifetime. Once allocated, client writes may destroy old links. Once freed, allocator links may overwrite old content. Use-after-free can therefore read allocator state or corrupt the list.

The [C17 draft](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) ends the object's valid lifetime on release. Payload reuse depends on that client obligation, not on memory becoming blank.

## One free region has both physical and logical order

```text
physical: [A used][B free][C free][D used][E free]
logical:  head -> E -> B -> C -> NULL
```

B and C may coalesce because they are physically adjacent. E and B are logical neighbors but cannot merge. Removing B updates logical links; identifying merge partners examines physical metadata.

Debugging should print two views: an address-ordered heap map and a head-following free-list map. Core invariants require every node to be in-heap and free, every free block to appear exactly once, reciprocal links to agree, and physical blocks to partition the heap without overlap.

## List ordering is policy, not physical fact

LIFO insertion is short and simple but makes first-fit sensitive to release history. Address ordering costs more at insertion and reflects heap direction. Size ordering or bins may speed fit search while complicating updates and ties.

[Doug Lea's allocator-design article](https://gee.cs.oswego.edu/dl/html/malloc.html) treats time, space, locality, fragmentation, and tunability as competing goals. Production bins do not invalidate a teaching list; the simple structure exposes invariants before policy complexity.

Hold placement and coalescing fixed while comparing ordering. Otherwise a changed high-water mark cannot be attributed.

## Allocation is find, unlink, and split if useful

After finding a fit, the allocator must unlink before client use. Merely setting the allocated bit leaves the list pointing into payload that the client may overwrite.

```c
static void remove_free(block *b) {
    if (b->prev != NULL) b->prev->next = b->next;
    else free_head = b->next;
    if (b->next != NULL) b->next->prev = b->prev;
}
```

Test the sole node, head, tail, and middle cases. If splitting, the allocated prefix stays out of the list; the remainder receives valid metadata and is inserted exactly once. Treat the update as a transaction from one valid structure to another.

## `free` combines a state transition, insertion, and a double-free boundary

`free(ptr)` recovers the header, marks the block free, coalesces, and inserts according to one consistent ordering. Inserting before and after merging without a strict rule can represent the same physical range with multiple nodes.

Double-free can create cycles or overlapping future allocations. `free(NULL)` is a no-op, while interior, stack, and already-freed pointers violate the contract. Debug builds can check range, alignment, and state to expose corruption earlier.

Link initialization belongs in a centralized helper. Otherwise stale client bytes can be mistaken for pointers.

## Coalescing is unlink, merge, and reinsert

When B is released, physical metadata determines whether left and right blocks are free. Existing free neighbors are already list nodes and must be unlinked. The allocator then writes one combined size and inserts one merged node.

```text
before: list -> L -> B -> R -> ...   (logical order only)
heap:   [L free][B free][R free]

after:  list -> M -> ...
heap:   [M = combined free block]
```

Logical order need not match this drawing. Leaving old nodes makes later allocation treat interior addresses as blocks. Overwriting links before removal loses the logical neighbors needed for unlinking.

Test four physical cases: neither neighbor free, right only, left only, and both. With a free left neighbor, the merged header begins at the left block—not necessarily at the pointer just passed to `free`.

## Finding neighbors uses physical metadata, not free-list links

The right neighbor is `current + size`. Finding the left neighbor may require a scan from heap start or a footer/boundary tag carrying previous size. The footer consumes space but shortens backward discovery.

Header and footer must agree after split, merge, and state changes. A checker should compare them and verify that the next block begins exactly at current address plus size.

More compact designs store footers only for free blocks or a previous-allocated bit in the next header. These save space by adding transition rules. The conceptual separation remains: physical metadata finds adjacent blocks; logical links organize candidates.

The [glibc malloc-internals guide](https://sourceware.org/glibc/wiki/MallocInternals) shows how chunks, boundary information, and multiple bins extend these ideas. It is context, not a claim that all glibc machinery appears in the Stanford slides.

## Corrupted links can amplify an ordinary overflow

Free-list links live in writable heap memory. An overflow or use-after-free can alter them; a naive unlink then writes through attacker-controlled-looking addresses. Allocator metadata is therefore a safety boundary, not merely performance state.

Basic hardening checks alignment, heap range, free state, and reciprocal links before writes. A checker should walk both heap and list, compare free-address sets, and cap traversal to detect cycles instead of hanging.

## Explicit is not automatically smaller or always faster

Explicit lists search only free candidates but require links and larger minimum blocks. Tiny workloads may lose utilization; mostly empty heaps may see little candidate reduction.

Compare average and tail latency, peak heap, minimum-block overhead, and coalescing count. One average throughput number hides long searches; utilization alone hides expensive ordering work.

## An implementation and testing sequence from this lecture

Build the heap walker and checker first. Test insert/remove positions, then allocation unlink, splitting, and the four coalescing cases. After every operation, compare the set of physically free blocks with list-reachable nodes.

On failure, retain the shortest trace and print physical and logical maps before and after every operation. Corruption often occurs one split or unlink before the eventual crash.

The lasting lesson is ownership across structures. A free block is both contiguous memory and a linked-list node. Every transition must answer: what is its physical extent, which logical links name it, and may the client still touch these bytes? Optimization is trustworthy only when all three answers agree.

## References

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 22 — Managing the Heap, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/22/Lecture22.pdf)
- [ISO C17 Committee Draft N1570 — Memory Management Functions](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)
- [CS:APP Malloc Lab](https://csapp.cs.cmu.edu/3e/malloclab.pdf)
- [Doug Lea — A Memory Allocator](https://gee.cs.oswego.edu/dl/html/malloc.html)
- [glibc Wiki — Malloc Internals](https://sourceware.org/glibc/wiki/MallocInternals)
